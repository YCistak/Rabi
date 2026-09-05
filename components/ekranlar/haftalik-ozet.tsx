'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Gamepad2,
  Images,
  LineChart,
  Share2,
  Target,
  Timer,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import type { HaftalikOzet } from '@/lib/ozet'
import { dakikaYaz, haftaYaz, yuzdeYaz } from '@/lib/ozet'
import { netYaz } from '@/lib/hesap'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { geriSayimSesi, kapanisSesi, kartSesi, ozetSesiCal, zaferSesi } from '@/lib/ozet-sesi'
import { kartGorseliUret, ozetGorseliUret, type OzetKartVerisi } from '@/lib/ozet-gorsel'
import { gorseliPaylas } from '@/lib/paylas'
import { SesCalar } from '@/lib/ses'
import { LOFI_PARCALAR } from '@/lib/lofi'
import { useUygulamaGorunur } from '@/lib/gorunurluk'
import { useGeriKatmani } from '@/lib/geri'
import { Rabi } from '@/components/maskot/rabi'
import { cn } from '@/lib/utils'

/**
 * Haftalık özet — hikâye (story) biçiminde, kart kart ilerleyen hafta kapanışı.
 *
 * Neden liste değil de kart destesi: aynı sayılar tek sayfada alt alta
 * dizildiğinde göz hepsini birden görüp hiçbirinde durmuyor. Kartlar sayıları
 * teker teker önüne koyuyor; özellikle sondaki "en çok çalıştığın üç ders"
 * geri sayımı, hepsi birden gösterilseydi hiçbir merak uyandırmazdı.
 *
 * Kartlar kendiliğinden ilerliyor ama dokunmak beklemeden geçiriyor: elinde
 * telefonla bekleyen biri için otomatik geçiş yavaş, okumak isteyen için elle
 * geçiş yorucu — ikisi birlikte.
 *
 * Tasarım kaynağı `tasarim/ozet-kavrulmus.html`. Kartlar tema değişkenlerini
 * **kullanmıyor**, renkleri burada yazılı: ekran uygulamanın kırık beyaz
 * zemininden tümüyle kopuk, kendi koyu/amber paletinde duruyor ve aynı renkler
 * paylaşılan görsele de gidiyor (`lib/ozet-gorsel.ts`). Tema değişkenlerinden
 * gelselerdi tuvale çizen taraf `var(--…)` metnini çözemezdi.
 */

/** Özetin arka plan müziği için sabit bir parça — her hafta aynı, "özet müziği" olsun. */
const OZET_PARCASI = LOFI_PARCALAR[3]

/**
 * Kartın kendiliğinden geçmeden önce ekranda kalma süresi (ms).
 *
 * Tek bir sabit: tasarımda bütün kartlar aynı sürede geçiyor ve üstteki dolan
 * çubuk da o süreye bağlı. Kart başına ayrı süreler verildiğinde şerit
 * bölmeleri eşit genişlikte olmasına rağmen farklı hızda doluyor ve "ne kadar
 * kaldı" duygusu bozuluyordu.
 */
const KART_SURESI = 5200

/** Kartın son iki kartından biri değilse kapanışta süre dolmuyor. */
const SONSUZ = 0

type Kart = {
  id: string
  /** Ekranın CSS zemini — kartın kendi degradesi. */
  zemin: string
  /** İçerik sütununun dikey boşluğu (px). Tasarımda karttan karta değişiyor. */
  bosluk: number
  ses?: () => void
  /** Zeminin üstündeki serbest süsler (ışıma, konfeti) — içerik sütununun altında. */
  susler?: React.ReactNode
  icerik: React.ReactNode
  /** Kartın paylaşılabilir hâli — ekrandakiyle aynı sayı ve cümle. */
  paylasim: OzetKartVerisi
  /** Kapanış kartı: sayaç durur, alt çubuk paylaş düğmelerine döner. */
  sonMu?: boolean
}

/** Basılı tutma kaç ms sonra "duraklat" sayılıyor. Altındakiler dokunuş. */
const BASILI_ESIGI = 220

/**
 * Tasarımdaki `font: 800 11px/1` kısayolunun karşılığı.
 *
 * CSS'in kendi `font` kısayolu **kullanılamıyor**: aile adı zorunlu ve oraya
 * `inherit` yazmak geçersiz bir bildirim üretiyor — tarayıcı satırın tamamını
 * atıyor ve kart varsayılan punto ile çiziliyordu. Tailwind sınıfı da değil,
 * çünkü buradaki punto ve kalınlıklar tasarımın ölçüleri; ölçek adımlarına
 * yuvarlanınca 132 piksellik "1" ile 88 piksellik süre aynı boya iniyor.
 */
function yz(kalinlik: number, punto: number, satir: number): React.CSSProperties {
  return { fontWeight: kalinlik, fontSize: punto, lineHeight: satir }
}

// ---------------------------------------------------------------------------
// Palet
//
// Kart başına ayrı bir degrade **yok**: üç zemin dönüşümlü kullanılıyor (koyu
// radial, amber, kızıl). On kartın onunda ayrı renk, hikâyeyi bir renk
// geçidine çeviriyordu; dönüşümlü zemin kartları gruplayıp ritim kuruyor.
// ---------------------------------------------------------------------------

const VURGU = '#D9622F'
const ACIK_VURGU = '#F6B27A'
const KREM = '#FFD9B0'
const FIL_DISI = '#FFF4E1'
const KOYU_YAZI = '#5C2410'
const ARTIS_YESILI = '#8FC98A'

const ZEMIN = {
  kapak: 'radial-gradient(120% 75% at 22% 4%,#43200F 0%,#1C0E07 58%,#120A06 100%)',
  amber: 'linear-gradient(158deg,#E07A34 0%,#B3491F 54%,#83300F 100%)',
  koyuSag: 'radial-gradient(115% 70% at 78% 6%,#3E1D10 0%,#1A0D07 60%,#120A06 100%)',
  kizil: 'linear-gradient(158deg,#8E3320 0%,#4A1810 58%,#2A0D08 100%)',
  koyuSol: 'radial-gradient(110% 70% at 20% 8%,#3E1D10 0%,#1A0D07 62%,#120A06 100%)',
  kizilKoyu: 'linear-gradient(158deg,#7A2C1A 0%,#3C1410 60%,#200906 100%)',
  ucuncu: 'radial-gradient(110% 70% at 80% 10%,#33190E 0%,#180C07 62%,#120A06 100%)',
  ikinci: 'radial-gradient(110% 70% at 20% 10%,#4A2312 0%,#1C0E07 62%,#120A06 100%)',
  birinci: 'linear-gradient(155deg,#F0A24A 0%,#D9622F 46%,#96370F 100%)',
  kapanis: 'linear-gradient(160deg,#C05B2B 0%,#7A3316 52%,#3A150A 100%)',
} as const

/**
 * Paylaşılan görselin degrade uçları.
 *
 * CSS metni tuvale çizilemiyor (`linear-gradient(…)` ayrıştırılamaz), o yüzden
 * her zeminin iki ucu ayrıca burada duruyor. İkisi birlikte değişmeli: ekranda
 * gördüğü kartı paylaşan kullanıcı başka renkte bir görsel alırsa "bu o değil"
 * diyor.
 */
const GORSEL_RENKLERI = {
  kapak: ['#43200F', '#120A06'],
  amber: ['#E07A34', '#83300F'],
  koyuSag: ['#3E1D10', '#120A06'],
  kizil: ['#8E3320', '#2A0D08'],
  koyuSol: ['#3E1D10', '#120A06'],
  kizilKoyu: ['#7A2C1A', '#200906'],
  ucuncu: ['#33190E', '#120A06'],
  ikinci: ['#4A2312', '#120A06'],
  birinci: ['#F0A24A', '#96370F'],
  kapanis: ['#C05B2B', '#3A150A'],
} as const satisfies Record<keyof typeof ZEMIN, readonly [string, string]>

export function HaftalikOzetEkrani({
  ozet,
  sesAcik,
  onKapat,
}: {
  ozet: HaftalikOzet
  /** Ayarlardaki ses tercihi — özetin başlangıç durumu. */
  sesAcik: boolean
  onKapat: () => void
}) {
  const [sira, setSira] = useState(0)
  const [sesli, setSesli] = useState(sesAcik)
  const [paylasimDurumu, setPaylasimDurumu] = useState<'hazir' | 'uretiliyor' | 'hata'>('hazir')
  /** Parmak ekranda basılı tutuluyor mu — hikâye o sırada beklemeli. */
  const [basili, setBasili] = useState(false)

  const kartlar = useMemo(() => kartlariKur(ozet), [ozet])
  const kart = kartlar[Math.min(sira, kartlar.length - 1)]
  const sonKart = sira >= kartlar.length - 1
  const sure = kart.sonMu ? SONSUZ : KART_SURESI

  useGeriKatmani(true, onKapat)

  // Ana tuşa basıldığında WebView durmuyor: müzik çalmaya, kartlar ilerlemeye
  // devam ediyordu ve kullanıcı geri döndüğünde özet çoktan bitmiş oluyordu.
  const gorunur = useUygulamaGorunur()
  const bekliyor = basili || !gorunur

  // --- Müzik ---
  const calarRef = useRef<SesCalar | null>(null)
  useEffect(() => {
    // Çalar yalnızca ses açıkken kuruluyor; kapalıyken AudioContext bile açılmıyor.
    if (!sesli) {
      calarRef.current?.kapat()
      calarRef.current = null
      return
    }
    const calar = new SesCalar()
    calar.sesSeviyesi(0.32)
    calar.cal(`lofi:${OZET_PARCASI.dosya}`)
    calarRef.current = calar
    return () => {
      calar.kapat()
      calarRef.current = null
    }
  }, [sesli])

  useEffect(() => {
    if (gorunur) calarRef.current?.devam()
    else calarRef.current?.duraklat()
  }, [gorunur])

  // --- Kartın kendi sesi ---
  // Yalnızca **kart değişince** çalıyor. Bağımlılıkta `sesli` de olsaydı
  // hoparlör düğmesine her dokunuşta o kartın sesi baştan çalardı.
  const sonSesliKartRef = useRef(-1)
  useEffect(() => {
    if (sonSesliKartRef.current === sira) return
    sonSesliKartRef.current = sira
    if (kart?.ses) ozetSesiCal(kart.ses, sesli)
  }, [sira, kart, sesli])

  const ilerle = useCallback(() => {
    setSira((s) => Math.min(s + 1, kartlar.length - 1))
  }, [kartlar.length])

  const geri = useCallback(() => setSira((s) => Math.max(0, s - 1)), [])

  // --- Kendiliğinden ilerleme ---
  // Kalan süre ayrı tutuluyor: basılı tutup bırakınca kart baştan değil,
  // kaldığı yerden devam ediyor — hikâye uygulamalarının davranışı bu.
  const kalanRef = useRef(0)
  useEffect(() => {
    kalanRef.current = sure
  }, [sure, sira])

  useEffect(() => {
    if (sure <= 0 || bekliyor) return
    const baslangic = Date.now()
    const zamanlayici = setTimeout(ilerle, kalanRef.current)
    return () => {
      clearTimeout(zamanlayici)
      kalanRef.current = Math.max(0, kalanRef.current - (Date.now() - baslangic))
    }
  }, [sure, sira, bekliyor, ilerle])

  // --- Basılı tutma ---
  // Dokunuş ile basılı tutmayı ayıran tek şey süre. Eşiğin altında kalan
  // dokunuşlar geçiş düğmelerine gidiyor, üstündekiler kartı durduruyor.
  const olcerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tutulduRef = useRef(false)

  const basmaBasladi = () => {
    tutulduRef.current = false
    olcerRef.current = setTimeout(() => {
      tutulduRef.current = true
      setBasili(true)
    }, BASILI_ESIGI)
  }

  const basmaBitti = () => {
    if (olcerRef.current) clearTimeout(olcerRef.current)
    olcerRef.current = null
    setBasili(false)
  }

  // Basılı tutmadan sonra gelen tıklama yutuluyor; yoksa parmağı kaldırınca
  // kart hem devam eder hem de bir sonrakine atlardı.
  const dokunus = (islem: () => void) => () => {
    if (tutulduRef.current) return
    islem()
  }

  const paylasilan = async (uret: () => Promise<Blob | null>, dosyaAdi: string, metin: string) => {
    setPaylasimDurumu('uretiliyor')
    const gorsel = await uret()
    if (!gorsel) {
      setPaylasimDurumu('hata')
      return
    }
    const sonuc = await gorseliPaylas(
      gorsel,
      dosyaAdi,
      `Rabi haftalık özetim — ${haftaYaz(ozet.hafta)}`,
      metin,
    )
    setPaylasimDurumu(sonuc === 'hata' ? 'hata' : 'hazir')
  }

  const kartiPaylas = () =>
    paylasilan(
      () => kartGorseliUret(kart.paylasim, haftaYaz(ozet.hafta), sira, kartlar.length),
      `rabi-${kart.id}-${ozet.hafta.baslangic}.png`,
      `${kart.paylasim.ustluk}: ${kart.paylasim.dev} — Rabi haftalık özeti (${haftaYaz(ozet.hafta)})`,
    )

  const haftayiPaylas = () =>
    paylasilan(
      () => ozetGorseliUret(ozet),
      `rabi-haftalik-ozet-${ozet.hafta.baslangic}.png`,
      `Bu hafta ${ozet.toplamSoru} soru çözdüm — Rabi haftalık özeti (${haftaYaz(ozet.hafta)})`,
    )

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden text-white"
      style={{ background: '#120A06' }}
      onPointerDown={basmaBasladi}
      onPointerUp={basmaBitti}
      onPointerCancel={basmaBitti}
      onPointerLeave={basmaBitti}
    >
      {/* Kartın kendisi. `key` sıra: her geçişte animasyonlar baştan oynasın —
          zemin de içerikle birlikte sıyrılarak geliyor, iki kart arasında bir
          kare boyunca eski renk görünmüyor. */}
      <div
        key={kart.id}
        className="ozet-kart absolute inset-0"
        style={{ background: kart.zemin }}
      >
        {kart.susler}
        <div
          className="absolute inset-0 mx-auto flex w-full max-w-md flex-col justify-center px-[26px]"
          style={{
            gap: kart.bosluk,
            paddingTop: 'calc(104px + var(--guvenli-ust))',
            // Kapanışta alttaki çubuk iki düğme taşıyor; ötekilerde tek bir
            // ipucu hapı var. Tek bir boşluk verilseydi ya kapanışın kutuları
            // düğmelerin altında kalırdı ya öteki kartlar ortadan yukarı kayardı.
            paddingBottom: `calc(${kart.sonMu ? 180 : 110}px + var(--guvenli-alt))`,
          }}
        >
          {kart.icerik}
        </div>
      </div>

      {/* Dokunma alanları: sol üçte bir geri, kalanı ileri. Üstteki şerit ve
          alt çubuk bunların üstünde kaldığı için düğmeleri engellenmiyor. */}
      <button
        type="button"
        aria-label="Önceki kart"
        onClick={dokunus(geri)}
        className="absolute inset-y-0 left-0 z-[1] w-1/3"
      />
      <button
        type="button"
        aria-label="Sonraki kart"
        onClick={dokunus(ilerle)}
        className="absolute inset-y-0 right-0 z-[1] w-2/3"
      />

      {/* Üst şerit — ilerleme çubukları ve üç yuvarlak düğme. Kabın kendisi
          dokunuşu geçiriyor, yalnızca düğme satırı alıyor: aradaki boşluğa
          dokunmak kartı ilerletmeli. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] mx-auto w-full max-w-md px-5 pt-[calc(16px+var(--guvenli-ust))]">
        <IlerlemeCubuklari toplam={kartlar.length} sira={sira} sure={sure} durdu={bekliyor} />

        <div className="pointer-events-auto mt-3.5 flex items-center justify-between gap-2">
          <YuvarlakDugme etiket="Özeti kapat" onClick={onKapat}>
            <X size={18} aria-hidden />
          </YuvarlakDugme>

          {/* Hafta adı uzayabiliyor ("26 Ağustos – 1 Eylül"): hap tek satırda
              kalıyor ve sığmayan ad kısalıyor. Sarmasına izin verilseydi hap
              iki satıra çıkıp yanındaki düğmelerin hizasını bozardı. */}
          <span
            className="flex min-w-0 items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3.5 py-2"
            style={{ ...yz(800, 11, 1), letterSpacing: '0.14em' }}
          >
            <span className="truncate">{haftaYaz(ozet.hafta).toLocaleUpperCase('tr')}</span>
            <span className="rakam shrink-0 text-white/55">
              {sira + 1}/{kartlar.length}
            </span>
          </span>

          <span className="flex gap-1.5">
            {/* Hikâyede ne bakıyorsan onu paylaşırsın: bu düğme açık kartın
                görselini üretiyor, kapanıştaki düğme haftanın tamamını. */}
            <YuvarlakDugme
              etiket="Bu kartı paylaş"
              onClick={() => void kartiPaylas()}
              pasif={paylasimDurumu === 'uretiliyor'}
            >
              <Share2 size={17} aria-hidden />
            </YuvarlakDugme>
            <YuvarlakDugme
              etiket={sesli ? 'Sesi kapat' : 'Sesi aç'}
              basili={sesli}
              onClick={() => setSesli((s) => !s)}
            >
              {sesli ? <Volume2 size={17} aria-hidden /> : <VolumeX size={17} aria-hidden />}
            </YuvarlakDugme>
          </span>
        </div>
      </div>

      {/* Alt çubuk: son karta kadar ipucu hapı, kapanışta paylaş düğmeleri. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] mx-auto w-full max-w-md px-[26px] pb-[calc(22px+var(--guvenli-alt))]">
        {sonKart ? (
          <PaylasCubugu
            durum={paylasimDurumu}
            onPaylas={() => void haftayiPaylas()}
            onKapat={onKapat}
          />
        ) : (
          <p className="flex justify-center">
            <span
              className="rounded-full border border-white/15 bg-black/25 px-4 py-2.5 text-white/70"
              style={{ ...yz(700, 11, 1) }}
            >
              {basili ? 'Bıraktığında devam eder' : 'Dokun geç · basılı tut beklet'}
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Kabuk parçaları
// ---------------------------------------------------------------------------

function YuvarlakDugme({
  etiket,
  onClick,
  pasif,
  basili,
  children,
}: {
  etiket: string
  onClick: () => void
  pasif?: boolean
  basili?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={etiket}
      aria-pressed={basili}
      disabled={pasif}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/20 text-white/90 active:bg-white/20 disabled:opacity-50"
    >
      {children}
    </button>
  )
}

function IlerlemeCubuklari({
  toplam,
  sira,
  sure,
  durdu,
}: {
  toplam: number
  sira: number
  /** Açık kartın süresi — çubuk tam bu sürede doluyor. */
  sure: number
  durdu: boolean
}) {
  return (
    <div className="flex gap-1" aria-hidden>
      {Array.from({ length: toplam }, (_, i) => (
        <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
          {/* Geçmiş kartlar dolu, açık kart süresince doluyor, sıradakiler boş.
              Dolan çubuk hikâyenin "ne kadar kaldı" duygusunu veren asıl parça;
              dolu/boş iki durum varken kartın ne zaman geçeceği belli olmuyordu. */}
          <span
            className={cn(
              'block h-full rounded-full',
              i === sira && sure > 0 && 'ozet-cubuk',
            )}
            style={{
              background: FIL_DISI,
              ...(i < sira || (i === sira && sure <= 0)
                ? { width: '100%' }
                : i === sira
                  ? { animationDuration: `${sure}ms`, animationPlayState: durdu ? 'paused' : 'running' }
                  : { width: '0%' }),
            }}
          />
        </span>
      ))}
    </div>
  )
}

function PaylasCubugu({
  durum,
  onPaylas,
  onKapat,
}: {
  durum: 'hazir' | 'uretiliyor' | 'hata'
  onPaylas: () => void
  onKapat: () => void
}) {
  return (
    <div className="pointer-events-auto space-y-2.5">
      {durum === 'hata' && (
        <p className="text-center text-xs text-white/80">
          Görsel oluşturulamadı. Ekran görüntüsü alabilirsin.
        </p>
      )}
      <button
        type="button"
        onClick={onPaylas}
        disabled={durum === 'uretiliyor'}
        className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[18px] shadow-[0_10px_26px_rgba(0,0,0,.3)] active:brightness-95 disabled:opacity-60"
        style={{ background: FIL_DISI, color: KOYU_YAZI, ...yz(900, 16, 1) }}
      >
        <Share2 size={18} aria-hidden />
        {durum === 'uretiliyor' ? 'Görsel hazırlanıyor…' : 'Haftayı afiş olarak paylaş'}
      </button>
      <button
        type="button"
        onClick={onKapat}
        className="h-[46px] w-full rounded-2xl border border-white/25 bg-white/5 text-white/85 active:bg-white/15"
        style={{ ...yz(800, 14, 1) }}
      >
        Kapat
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Kart parçaları
// ---------------------------------------------------------------------------

/** Kartın küçük üst etiketi — hangi konuda olduğunu söyler. */
function Ustluk({
  simge,
  ton = 'rgba(255,255,255,.55)',
  children,
}: {
  simge?: React.ReactNode
  ton?: string
  children: React.ReactNode
}) {
  return (
    <p
      className="ozet-girisi m-0 flex items-center gap-2"
      style={{ ...yz(800, 11, 1), letterSpacing: '0.2em', color: ton }}
    >
      {simge}
      {children}
    </p>
  )
}

/** Kartın taşıyıcı sayısı. Gecikme, üst etiketten sonra gelmesi için. */
function DevSayi({
  punto = 96,
  renk,
  children,
}: {
  punto?: number
  renk?: string
  children: React.ReactNode
}) {
  return (
    <p
      className="ozet-vurgu rakam m-0"
      style={{
        ...yz(900, punto, 0.82),
        letterSpacing: '-0.05em',
        color: renk,
        animationDelay: '80ms',
      }}
    >
      {children}
    </p>
  )
}

/** Dev sayının yanındaki küçük birim ("sa", "dk"). */
function Birim({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: '0.36em', letterSpacing: 0, color: 'rgba(255,255,255,.55)' }}>
      {children}
    </span>
  )
}

/** Sayının altındaki cümle — motive eden kısım burada. */
function AltYazi({
  gecikme = 380,
  punto = 16,
  children,
}: {
  gecikme?: number
  punto?: number
  children: React.ReactNode
}) {
  return (
    <p
      className="ozet-girisi m-0 max-w-[300px] text-pretty"
      style={{
        ...yz(600, punto, 1.5),
        color: 'rgba(255,255,255,.82)',
        animationDelay: `${gecikme}ms`,
      }}
    >
      {children}
    </p>
  )
}

/** İçi doldurulabilen yuvarlak köşeli kutu — kartların ikinci katmanı. */
function Kutu({
  gecikme = 420,
  className,
  children,
}: {
  gecikme?: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'ozet-girisi relative rounded-[22px] border border-white/12 bg-white/6',
        className,
      )}
      style={{ animationDelay: `${gecikme}ms` }}
    >
      {children}
    </div>
  )
}

/**
 * Kutunun kenarına yapışan çıkartma etiket.
 *
 * Kutunun **dışına** taşıyor (`top:-13px`): içine konsaydı kutunun kendi
 * başlığı gibi okunurdu; buradaki iş bir vurgu, kutuda yazan sayıya iliştirilen
 * bir not.
 */
function Cikartma({
  yon = 'sag',
  ton = 'krem',
  gecikme,
  children,
}: {
  yon?: 'sag' | 'sol'
  ton?: 'krem' | 'vurgu'
  gecikme: number
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'ozet-pop absolute -top-[13px] rounded-full px-[11px] py-1.5 shadow-[0_6px_14px_rgba(0,0,0,.3)]',
        yon === 'sag' ? 'right-4' : 'left-4',
      )}
      style={{
        ...yz(800, 10, 1),
        letterSpacing: '0.08em',
        background: ton === 'krem' ? KREM : VURGU,
        color: ton === 'krem' ? KOYU_YAZI : '#fff',
        animationDelay: `${gecikme}ms`,
      }}
    >
      {children}
    </span>
  )
}

/**
 * Ortasında yazı olan ilerleme halkası.
 *
 * `stroke-dasharray` çevrenin tamamı, `stroke-dashoffset` kalan pay. Dolma
 * animasyonu tam çevreden başlıyor ve o değer `--halka-cevre` ile CSS'e
 * geçiyor — her halkanın yarıçapı farklı, keyframe'e sabit sayı yazılamıyor.
 */
function Halka({
  oran,
  boyut,
  kalinlik,
  renk,
  ust,
  alt,
  gecikme = 260,
}: {
  /** 0–1; aşan değerler halkayı tam gösteriyor. */
  oran: number
  boyut: number
  kalinlik: number
  renk: string
  ust: string
  alt: string
  gecikme?: number
}) {
  const yaricap = (boyut - kalinlik) / 2
  const cevre = 2 * Math.PI * yaricap
  const dolu = Math.max(0, Math.min(1, oran))

  return (
    <div
      className="ozet-girisi relative flex-none"
      style={{ width: boyut, height: boyut, animationDelay: `${gecikme}ms` }}
    >
      <svg width={boyut} height={boyut} viewBox={`0 0 ${boyut} ${boyut}`} style={{ transform: 'rotate(-90deg)' }} aria-hidden>
        <circle
          cx={boyut / 2}
          cy={boyut / 2}
          r={yaricap}
          fill="none"
          stroke="rgba(255,255,255,.22)"
          strokeWidth={kalinlik}
        />
        <circle
          className="ozet-halka"
          cx={boyut / 2}
          cy={boyut / 2}
          r={yaricap}
          fill="none"
          stroke={renk}
          strokeWidth={kalinlik}
          strokeLinecap="round"
          strokeDasharray={cevre}
          strokeDashoffset={cevre * (1 - dolu)}
          style={
            {
              '--halka-cevre': cevre,
              animationDelay: `${gecikme + 60}ms`,
            } as React.CSSProperties
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="rakam m-0" style={{ ...yz(900, Math.round(boyut * 0.21), 1) }}>
          {ust}
        </p>
        <p
          className="m-0 mt-0.5"
          style={{ ...yz(700, 8, 1), letterSpacing: '0.12em', color: 'rgba(255,255,255,.7)' }}
        >
          {alt}
        </p>
      </div>
    </div>
  )
}

/** Yedi günlük soru çubukları. En yüksek gün vurgu renginde. */
function GunCubuklari({ ozet }: { ozet: HaftalikOzet }) {
  const enYuksek = Math.max(1, ...ozet.gunler.map((g) => g.soru))

  return (
    <div className="flex h-[104px] items-end gap-[9px]">
      {ozet.gunler.map((gun, i) => {
        // Sıfır soruda bile ince bir iz kalıyor: bomboş bir sütun "veri yok"
        // gibi değil, çubuk hiç çizilmemiş gibi okunuyordu.
        const yuzde = gun.soru === 0 ? 4 : Math.max(8, Math.round((gun.soru / enYuksek) * 100))
        const enIyi = ozet.enIyiGun?.iso === gun.iso
        return (
          <div key={gun.iso} className="flex h-full flex-1 flex-col items-center justify-end gap-[7px]">
            <span
              className="ozet-bar w-full rounded-[7px]"
              style={{
                height: `${yuzde}%`,
                background: enIyi ? '#FFE3C4' : gun.soru === 0 ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.4)',
                animationDelay: `${560 + i * 60}ms`,
              }}
            />
            <span style={{ ...yz(800, 9, 1), color: 'rgba(255,255,255,.6)' }}>{gun.ad}</span>
          </div>
        )
      })}
    </div>
  )
}

/** Ders adı + süre/pay satırı ve altındaki şerit. Pomodoro kartının kutusu. */
function SeritSatiri({
  ad,
  deger,
  oran,
  oneCikan,
  gecikme,
}: {
  ad: string
  deger: string
  /** 0–1, en büyük satıra göre. */
  oran: number
  oneCikan: boolean
  gecikme: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between" style={{ ...yz(800, 13, 1) }}>
        <span>{ad}</span>
        <span className="rakam" style={{ color: oneCikan ? ACIK_VURGU : 'rgba(255,255,255,.7)' }}>
          {deger}
        </span>
      </div>
      <div className="h-[9px] overflow-hidden rounded-full bg-white/10">
        <span
          className="ozet-serit block h-full rounded-full"
          style={{
            width: `${Math.max(6, Math.round(oran * 100))}%`,
            background: oneCikan
              ? `linear-gradient(90deg,${VURGU},${ACIK_VURGU})`
              : 'rgba(255,255,255,.45)',
            animationDelay: `${gecikme}ms`,
          }}
        />
      </div>
    </div>
  )
}

/** Kapanış ve kapak kartlarındaki küçük sayı kutusu. */
function SayiKutusu({
  deger,
  etiket,
  buyuk,
}: {
  deger: string
  etiket: string
  buyuk?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-[20px] border border-white/15 bg-white/8',
        buyuk ? 'px-4 py-[15px]' : 'px-3.5 py-3 text-center',
      )}
    >
      {/* Değer ders adı da olabiliyor ("Matematik") ve kutuya sığmayan ad
          kenardan taşıyordu — kutunun genişliği ızgaradan geliyor, içeriğe
          göre büyüyemiyor. */}
      <p className="rakam m-0 truncate" style={{ ...yz(900, buyuk ? 30 : 20, 1) }}>
        {deger}
      </p>
      <p
        className="m-0 mt-1.5"
        style={{
          ...yz(700, buyuk ? 10 : 9, 1),
          letterSpacing: '0.13em',
          color: 'rgba(255,255,255,.55)',
        }}
      >
        {etiket}
      </p>
    </div>
  )
}

/** Ders geri sayımının (3. → 1.) ortak gövdesi. */
function DersKarti({
  sira,
  ders,
  not,
}: {
  sira: 2 | 3
  ders: HaftalikOzet['ilkUcDers'][number]
  not: string
}) {
  const ucuncu = sira === 3
  return (
    <>
      <Ustluk ton={ucuncu ? 'rgba(255,255,255,.45)' : 'rgba(255,255,255,.5)'}>
        EN ÇOK SORU ÇÖZDÜĞÜN {sira}. DERS
      </Ustluk>
      <div className="flex items-center gap-4">
        <p
          className="ozet-vurgu m-0"
          style={{
            ...yz(900, ucuncu ? 108 : 118, 0.8),
            letterSpacing: '-0.06em',
            color: ucuncu ? 'rgba(255,255,255,.13)' : 'rgba(246,178,122,.22)',
          }}
        >
          {sira}
        </p>
        <div className="min-w-0 flex-1">
          <p
            className="ozet-girisi m-0 truncate"
            style={{ ...yz(900, ucuncu ? 34 : 38, 1.05), animationDelay: '240ms' }}
          >
            {ders.ders}
          </p>
          <p
            className="ozet-girisi rakam m-0 mt-2"
            style={{ ...yz(700, 13, 1), color: ACIK_VURGU, animationDelay: '340ms' }}
          >
            {ders.soru} soru · haftanın {yuzdeYaz(ders.oran)}
          </p>
        </div>
      </div>
      <div
        className="ozet-girisi h-3 overflow-hidden rounded-full bg-white/10"
        style={{ animationDelay: '400ms' }}
      >
        <span
          className="ozet-serit block h-full rounded-full"
          style={{
            width: `${Math.max(6, Math.round(ders.oran * 100))}%`,
            background: ucuncu ? 'rgba(255,255,255,.4)' : 'rgba(255,255,255,.55)',
            animationDelay: '480ms',
          }}
        />
      </div>
      <Kutu gecikme={520} className="px-4 py-3.5">
        <p className="m-0" style={{ ...yz(600, 14, 1.5), color: 'rgba(255,255,255,.62)' }}>
          {not}
        </p>
      </Kutu>
    </>
  )
}

// ---------------------------------------------------------------------------
// Kartlar
//
// Veri olmayan kart **üretilmiyor**: deneme girilmemiş bir haftada "Bu hafta
// deneme yok" diyen bir kart, beş saniye boyunca hiçbir şey söylemeyen bir
// ekran. Üstteki şeridin bölme sayısı da kart sayısından geliyor, yani şerit
// gerçekten kaç kart olduğunu gösteriyor.
//
// Üçü her zaman var: kapak, soru hedefi ve kapanış. Hedef kartı boş bir
// haftada da anlamlı — "hiç soru girilmemiş" bir haberdir; kapak ile kapanış
// olmadan da hikâyenin başı ve sonu kalmıyor.
// ---------------------------------------------------------------------------

function kartlariKur(ozet: HaftalikOzet): Kart[] {
  const haftaEtiketi = haftaYaz(ozet.hafta).toLocaleUpperCase('tr')
  const kartlar: Kart[] = []
  /** Kart sesleri diziyi yukarı tırmanıyor; kart atlanınca basamak da atlanmasın. */
  let basamak = 0
  const sonrakiSes = () => {
    const su = basamak++
    return () => kartSesi(su)
  }

  // --- Kapak ---
  kartlar.push({
    id: 'kapak',
    zemin: ZEMIN.kapak,
    bosluk: 22,
    ses: sonrakiSes(),
    susler: (
      <div
        className="ozet-parla pointer-events-none absolute left-1/2 top-[150px] h-[300px] w-[300px] -ml-[150px] rounded-full blur-[6px]"
        style={{ background: 'radial-gradient(circle,rgba(217,98,47,.42),transparent 68%)' }}
      />
    ),
    paylasim: {
      ustluk: 'Haftalık özet',
      dev: 'Haftan bitti',
      alt: 'Bakalım ne yapmışsın.',
      renkler: GORSEL_RENKLERI.kapak,
    },
    icerik: (
      <div className="flex flex-col items-center gap-[22px]">
        <div className="ozet-vurgu relative">
          <div className="grid h-[188px] w-[188px] place-items-center rounded-full border border-white/15 bg-white/6">
            <Rabi durum="kutlama" boyut={126} />
          </div>
          <span
            className="ozet-pop absolute -top-1.5 -right-[18px] rounded-full px-3 py-[7px] shadow-[0_8px_18px_rgba(0,0,0,.35)]"
            style={{
              ...yz(800, 11, 1),
              letterSpacing: '0.06em',
              background: KREM,
              color: KOYU_YAZI,
              animationDelay: '420ms',
            }}
          >
            HAFTA KAPANDI
          </span>
        </div>
        <p
          className="ozet-girisi m-0"
          style={{
            ...yz(800, 12, 1),
            letterSpacing: '0.24em',
            color: 'rgba(255,255,255,.5)',
            animationDelay: '160ms',
          }}
        >
          {haftaEtiketi}
        </p>
        <p
          className="ozet-girisi m-0 text-center"
          style={{ ...yz(900, 38, 1.1), letterSpacing: '-0.03em', animationDelay: '260ms' }}
        >
          Haftan bitti.
          <br />
          <span style={{ color: ACIK_VURGU }}>Bakalım ne yapmışsın.</span>
        </p>
        <div className="ozet-girisi flex gap-2" style={{ animationDelay: '420ms' }}>
          <SayiKutusu deger={String(ozet.toplamSoru)} etiket="SORU" />
          <SayiKutusu deger={saatKisa(ozet.pomodoroDakika)} etiket="POMODORO" />
          <SayiKutusu deger={String(ozet.denemeSayisi)} etiket="DENEME" />
        </div>
      </div>
    ),
  })

  // --- 1. Haftalık soru hedefi ---
  kartlar.push({
    id: 'hedef',
    zemin: ZEMIN.amber,
    bosluk: 20,
    ses: sonrakiSes(),
    paylasim: {
      ustluk: 'Bu hafta çözdüğüm soru',
      dev: String(ozet.toplamSoru),
      alt: hedefCumlesi(ozet),
      renkler: GORSEL_RENKLERI.amber,
    },
    icerik: (
      <>
        <Ustluk simge={<Target size={15} aria-hidden />} ton="rgba(255,255,255,.72)">
          BU HAFTA ÇÖZDÜĞÜN SORU
        </Ustluk>
        <div className="flex items-end justify-between gap-3">
          <DevSayi>{ozet.toplamSoru}</DevSayi>
          {ozet.haftalikHedef > 0 && (
            <Halka
              oran={ozet.hedefOrani}
              boyut={104}
              kalinlik={9}
              renk="#FFE3C4"
              ust={`%${Math.round(ozet.hedefOrani * 100)}`}
              alt="HEDEF"
            />
          )}
        </div>
        <AltYazi punto={17}>{hedefCumlesi(ozet)}</AltYazi>
        <Kutu gecikme={480} className="border-white/16 bg-[rgba(48,16,6,.28)] px-4 pt-[18px] pb-3.5">
          {ozet.enIyiGun && (
            <Cikartma gecikme={900}>EN İYİ GÜN · {ozet.enIyiGun.soru}</Cikartma>
          )}
          <GunCubuklari ozet={ozet} />
          <p
            className="m-0 mt-3"
            style={{
              ...yz(700, 11, 1.4),
              letterSpacing: '0.04em',
              color: 'rgba(255,255,255,.72)',
            }}
          >
            {ozet.haftalikHedef > 0
              ? `HAFTALIK HEDEF ${ozet.haftalikHedef} · 7 GÜNÜN ${ozet.hedefliGun}'İNDE TUTTURDUN`
              : 'HAFTALIK HEDEF YOK · AYARLAR’DAN GÜNLÜK HEDEF KOYABİLİRSİN'}
          </p>
        </Kutu>
      </>
    ),
  })

  // --- 2. Pomodoro ---
  if (ozet.pomodoroDakika > 0) {
    const enUzun = ozet.pomodoroDersleri[0]?.dakika ?? 1
    kartlar.push({
      id: 'pomodoro',
      zemin: ZEMIN.koyuSag,
      bosluk: 20,
      ses: sonrakiSes(),
      paylasim: {
        ustluk: 'Pomodoro ile çalıştığım süre',
        dev: dakikaYaz(ozet.pomodoroDakika),
        alt: pomodoroCumlesi(ozet),
        renkler: GORSEL_RENKLERI.koyuSag,
      },
      icerik: (
        <>
          <Ustluk simge={<Timer size={15} aria-hidden />}>POMODORO İLE ÇALIŞTIĞIN SÜRE</Ustluk>
          <DevSayi punto={88} renk={ACIK_VURGU}>
            {sureParcalari(ozet.pomodoroDakika)}
          </DevSayi>
          <div className="ozet-girisi flex gap-2" style={{ animationDelay: '300ms' }}>
            <Hap>{ozet.pomodoroSeans} oturum</Hap>
            <Hap>Günde ~{Math.round(ozet.pomodoroDakika / 7)} dk</Hap>
          </div>
          {ozet.pomodoroDersleri.length > 0 && (
            <Kutu gecikme={420} className="flex flex-col gap-3.5 px-4.5 py-5">
              <Cikartma yon="sol" ton="vurgu" gecikme={760}>
                HAFTANIN MASASI
              </Cikartma>
              {ozet.pomodoroDersleri.map((ders, i) => (
                <SeritSatiri
                  key={ders.ders}
                  ad={ders.ders}
                  deger={dakikaYaz(ders.dakika)}
                  oran={ders.dakika / enUzun}
                  oneCikan={i === 0}
                  gecikme={520 + i * 80}
                />
              ))}
            </Kutu>
          )}
          <AltYazi gecikme={540}>{pomodoroCumlesi(ozet)}</AltYazi>
        </>
      ),
    })
  }

  // --- 3. Mini oyunlar ---
  if (ozet.oyunTur > 0) {
    kartlar.push({
      id: 'oyun',
      zemin: ZEMIN.kizil,
      bosluk: 22,
      ses: sonrakiSes(),
      paylasim: {
        ustluk: 'Mini oyunlarda geçen süre',
        dev: dakikaYaz(ozet.oyunDakika),
        alt: oyunCumlesi(ozet),
        renkler: GORSEL_RENKLERI.kizil,
      },
      icerik: (
        <>
          <Ustluk simge={<Gamepad2 size={15} aria-hidden />} ton="rgba(255,255,255,.58)">
            MİNİ OYUNLARDA GEÇEN SÜRE
          </Ustluk>
          <div className="flex items-center gap-[18px]">
            <DevSayi punto={92}>
              {ozet.oyunDakika}
              <Birim>dk</Birim>
            </DevSayi>
            {ozet.oyunIsabet !== null && (
              <Halka
                oran={ozet.oyunIsabet}
                boyut={96}
                kalinlik={8}
                renk={ACIK_VURGU}
                ust={`%${Math.round(ozet.oyunIsabet * 100)}`}
                alt="İSABET"
                gecikme={280}
              />
            )}
          </div>
          <div className="ozet-girisi flex gap-2.5" style={{ animationDelay: '400ms' }}>
            <div className="flex-1">
              <SayiKutusu buyuk deger={String(ozet.oyunTur)} etiket="TUR" />
            </div>
            <div className="flex-1">
              <SayiKutusu buyuk deger={String(ozet.oyunDogru)} etiket="DOĞRU" />
            </div>
            <div className="flex-1">
              <SayiKutusu buyuk deger={String(ozet.oyunHatasiz)} etiket="HATASIZ" />
            </div>
          </div>
          {ozet.enCokOynanan && (
            <Kutu gecikme={500} className="px-4.5 py-4">
              <Cikartma gecikme={860}>EN ÇOK OYNADIĞIN</Cikartma>
              <p className="m-0" style={{ ...yz(900, 22, 1.1) }}>
                {oyunBul(ozet.enCokOynanan).ad}
              </p>
              <p
                className="m-0 mt-2"
                style={{ ...yz(600, 13, 1.4), color: 'rgba(255,255,255,.65)' }}
              >
                {ozet.enCokOynananTur} tur · bu hafta toplam {ozet.oyunDogru} doğru
              </p>
            </Kutu>
          )}
        </>
      ),
    })
  }

  // --- 4. Yanlış soru bankası ---
  if (ozet.bankaCozulen > 0 || ozet.bankaBekleyen > 0) {
    kartlar.push({
      id: 'banka',
      zemin: ZEMIN.koyuSol,
      bosluk: 22,
      ses: sonrakiSes(),
      paylasim: {
        ustluk: 'Bankadan kapattığım soru',
        dev: String(ozet.bankaCozulen),
        alt: bankaCumlesi(ozet),
        renkler: GORSEL_RENKLERI.koyuSol,
      },
      icerik: (
        <>
          <Ustluk simge={<Images size={15} aria-hidden />}>BANKADAN KAPATTIĞIN SORU</Ustluk>
          <div className="flex items-end gap-3.5">
            <DevSayi punto={104} renk={ACIK_VURGU}>
              {ozet.bankaCozulen}
            </DevSayi>
            <p
              className="m-0 mb-3"
              style={{ ...yz(800, 14, 1.3), color: 'rgba(255,255,255,.6)' }}
            >
              soru
              <br />
              kapandı
            </p>
          </div>
          <Kutu gecikme={320} className="p-4.5">
            <p
              className="m-0 mb-3"
              style={{
                ...yz(800, 10, 1),
                letterSpacing: '0.14em',
                color: 'rgba(255,255,255,.5)',
              }}
            >
              BANKANIN HÂLİ · {ozet.bankaCozulen + ozet.bankaBekleyen} KAYIT
            </p>
            <BankaIzgarasi kapanan={ozet.bankaCozulen} bekleyen={ozet.bankaBekleyen} />
            <div className="mt-3.5 flex gap-4">
              <Gosterge renk={VURGU}>Kapattığın</Gosterge>
              <Gosterge renk="rgba(255,255,255,.12)">Bekleyen {ozet.bankaBekleyen}</Gosterge>
            </div>
          </Kutu>
          <AltYazi gecikme={460}>{bankaCumlesi(ozet)}</AltYazi>
        </>
      ),
    })
  }

  // --- 5. Deneme netleri ---
  if (ozet.denemeEnYuksek) {
    kartlar.push({
      id: 'deneme-net',
      zemin: ZEMIN.kizilKoyu,
      bosluk: 20,
      ses: sonrakiSes(),
      paylasim: {
        ustluk: 'En yüksek deneme netim',
        dev: netYaz(ozet.denemeEnYuksek.net),
        alt: ozet.denemeEnYuksek.ad,
        ekstra: [
          `En düşük ${netYaz(ozet.denemeEnDusuk?.net ?? 0)}`,
          `Ortalama ${netYaz(ozet.denemeOrtalama ?? 0)}`,
        ],
        renkler: GORSEL_RENKLERI.kizilKoyu,
      },
      icerik: (
        <>
          <Ustluk simge={<LineChart size={15} aria-hidden />} ton="rgba(255,255,255,.55)">
            DENEME NETLERİN
          </Ustluk>
          <div className="relative">
            <DevSayi punto={92}>{netYaz(ozet.denemeEnYuksek.net)}</DevSayi>
            {/* Rozet yalnızca gerçekten yükselen bir haftada: her hafta çıkan
                bir "REKOR" etiketi rekor olmaktan çıkıyor. */}
            {ozet.denemeArtis !== null && ozet.denemeArtis > 0 && (
              <span
                className="ozet-pop absolute -top-1 right-0.5 rounded-full px-3 py-[7px] shadow-[0_8px_18px_rgba(0,0,0,.4)]"
                style={{
                  ...yz(900, 11, 1),
                  letterSpacing: '0.06em',
                  background: KREM,
                  color: KOYU_YAZI,
                  animationDelay: '700ms',
                }}
              >
                YÜKSELİŞ
              </span>
            )}
          </div>
          <p
            className="ozet-girisi m-0"
            style={{ ...yz(600, 16, 1.5), color: 'rgba(255,255,255,.82)', animationDelay: '300ms' }}
          >
            En yüksek netin — <strong style={{ fontWeight: 900 }}>{ozet.denemeEnYuksek.ad}</strong>
          </p>
          <Kutu gecikme={400} className="px-4.5 pt-4.5 pb-3.5">
            <NetCubuklari ozet={ozet} />
            <div className="mt-4 flex gap-2">
              <NetKutusu etiket="EN DÜŞÜK" deger={netYaz(ozet.denemeEnDusuk?.net ?? 0)} />
              <NetKutusu etiket="ORTALAMA" deger={netYaz(ozet.denemeOrtalama ?? 0)} />
              {ozet.denemeArtis !== null && (
                <NetKutusu
                  etiket="ARTIŞ"
                  deger={`${ozet.denemeArtis > 0 ? '+' : ''}${netYaz(ozet.denemeArtis)}`}
                  renk={ozet.denemeArtis >= 0 ? ARTIS_YESILI : undefined}
                />
              )}
            </div>
          </Kutu>
        </>
      ),
    })
  }

  // --- 6. En çok soru çözülen üç ders, 3'ten 1'e ---
  // Geri sayım için ters çevriliyor: 3. sıradan başlayıp 1.'ye çıkıyor.
  const siralama = [...ozet.ilkUcDers].reverse()
  siralama.forEach((ders, i) => {
    const derecesi = (siralama.length - i) as 3 | 2 | 1

    if (derecesi !== 1) {
      basamak++
      kartlar.push({
        id: `ders-${derecesi}`,
        zemin: derecesi === 3 ? ZEMIN.ucuncu : ZEMIN.ikinci,
        bosluk: 18,
        ses: () => geriSayimSesi(derecesi),
        paylasim: {
          ustluk: `En çok soru çözdüğüm ${derecesi}. ders`,
          dev: `${derecesi}. ${ders.ders}`,
          alt: `${ders.soru} soru · haftanın ${yuzdeYaz(ders.oran)}`,
          renkler: derecesi === 3 ? GORSEL_RENKLERI.ucuncu : GORSEL_RENKLERI.ikinci,
        },
        icerik: <DersKarti sira={derecesi} ders={ders} not={dereceNotu(derecesi, ozet)} />,
      })
      return
    }

    // Birincilik: parlayan amber zemin, konfeti ve nabız atan "1".
    basamak++
    kartlar.push({
      id: 'ders-1',
      zemin: ZEMIN.birinci,
      bosluk: 16,
      ses: zaferSesi,
      susler: (
        <>
          <div
            className="ozet-parla pointer-events-none absolute left-1/2 top-[120px] h-[340px] w-[340px] -ml-[170px] rounded-full"
            style={{
              background: 'radial-gradient(circle,rgba(255,244,225,.5),transparent 66%)',
              animationDuration: '3.6s',
            }}
          />
          <span
            className="ozet-pop pointer-events-none absolute left-[38px] top-[150px] h-3.5 w-[9px] rounded-[3px] bg-white/75"
            style={{ animationDelay: '700ms' }}
          />
          <span
            className="ozet-pop pointer-events-none absolute right-11 top-[196px] h-3.5 w-[9px] rounded-[3px]"
            style={{ background: 'rgba(90,32,10,.35)', animationDelay: '820ms' }}
          />
          <span
            className="ozet-pop pointer-events-none absolute left-16 top-[250px] h-2 w-2 rounded-full bg-white/70"
            style={{ animationDelay: '900ms' }}
          />
        </>
      ),
      paylasim: {
        ustluk: 'Haftanın dersi',
        dev: ders.ders,
        alt: `${ders.soru} soru · haftanın ${yuzdeYaz(ders.oran)} — bu hafta beni en çok bu ders yordu.`,
        renkler: GORSEL_RENKLERI.birinci,
      },
      icerik: (
        <div className="flex flex-col items-center gap-4 text-center">
          <span
            className="ozet-girisi rounded-full px-3.5 py-2"
            style={{ ...yz(900, 10, 1), letterSpacing: '0.2em', background: 'rgba(48,16,6,.32)' }}
          >
            VE HAFTANIN DERSİ…
          </span>
          <p
            className="ozet-nabiz m-0"
            style={{
              ...yz(900, 132, 0.78),
              letterSpacing: '-0.07em',
              color: FIL_DISI,
              textShadow: '0 12px 40px rgba(90,32,10,.45)',
            }}
          >
            1
          </p>
          <p
            className="ozet-vurgu m-0 max-w-full truncate"
            style={{ ...yz(900, 46, 1), letterSpacing: '-0.03em', animationDelay: '460ms' }}
          >
            {ders.ders}
          </p>
          <div
            className="ozet-girisi flex w-full max-w-[280px] flex-col gap-2.5"
            style={{ animationDelay: '640ms' }}
          >
            <div className="h-3.5 overflow-hidden rounded-full" style={{ background: 'rgba(48,16,6,.25)' }}>
              <span
                className="ozet-serit block h-full rounded-full"
                style={{
                  width: `${Math.max(6, Math.round(ders.oran * 100))}%`,
                  background: FIL_DISI,
                  animationDelay: '760ms',
                }}
              />
            </div>
            <div
              className="rakam flex justify-between"
              style={{ ...yz(800, 12, 1), color: 'rgba(255,244,225,.85)' }}
            >
              <span>{ders.soru} soru</span>
              <span>haftanın {yuzdeYaz(ders.oran)}</span>
            </div>
          </div>
          <p
            className="ozet-girisi m-0 mt-1.5 max-w-[280px] text-pretty"
            style={{ ...yz(700, 16, 1.5), color: 'rgba(255,244,225,.92)', animationDelay: '820ms' }}
          >
            Bu hafta seni en çok bu ders yordu.
          </p>
        </div>
      ),
    })
  })

  // --- Kapanış ---
  kartlar.push({
    id: 'kapanis',
    zemin: ZEMIN.kapanis,
    bosluk: 18,
    sonMu: true,
    ses: kapanisSesi,
    paylasim: {
      ustluk: 'Rabi haftalık özeti',
      dev: kapanisCumlesi(ozet),
      alt: `${ozet.toplamSoru} soru · ${dakikaYaz(ozet.pomodoroDakika)} pomodoro · ${ozet.denemeSayisi} deneme`,
      renkler: GORSEL_RENKLERI.kapanis,
    },
    icerik: (
      <>
        <div className="ozet-girisi flex items-center gap-3.5">
          <Rabi durum="mutlu" boyut={74} />
          <div className="min-w-0">
            <p
              className="m-0"
              style={{ ...yz(800, 10, 1), letterSpacing: '0.2em', color: 'rgba(255,255,255,.6)' }}
            >
              {haftaEtiketi}
            </p>
            <p
              className="m-0 mt-[7px] text-balance"
              style={{ ...yz(900, 30, 1.05), letterSpacing: '-0.02em' }}
            >
              {kapanisCumlesi(ozet)}
            </p>
          </div>
        </div>
        <div className="ozet-girisi grid grid-cols-2 gap-2.5" style={{ animationDelay: '240ms' }}>
          <SayiKutusu buyuk deger={String(ozet.toplamSoru)} etiket="SORU" />
          <SayiKutusu buyuk deger={saatKisa(ozet.pomodoroDakika)} etiket="POMODORO" />
          <SayiKutusu
            buyuk
            deger={ozet.denemeEnYuksek ? netYaz(ozet.denemeEnYuksek.net) : '—'}
            etiket="EN İYİ NET"
          />
          <SayiKutusu
            buyuk
            deger={ozet.ilkUcDers[0] ? kisaDers(ozet.ilkUcDers[0].ders) : '—'}
            etiket="HAFTANIN DERSİ"
          />
        </div>
      </>
    ),
  })

  return kartlar
}

// ---------------------------------------------------------------------------
// Küçük parçalar
// ---------------------------------------------------------------------------

function Hap({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-full border border-white/15 bg-white/8 px-3.5 py-2.5 text-white/85"
      style={{ ...yz(800, 12, 1) }}
    >
      {children}
    </span>
  )
}

function Gosterge({ renk, children }: { renk: string; children: React.ReactNode }) {
  return (
    <span
      className="flex items-center gap-[7px] text-white/70"
      style={{ ...yz(700, 11, 1) }}
    >
      <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: renk }} />
      {children}
    </span>
  )
}

/**
 * Bankanın hâlini gösteren kare ızgara — dolular kapatılan, boşlar bekleyen.
 *
 * Kare sayısı `IZGARA_SINIRI` ile kapalı: yüz kayıtlık bir bankada ızgara
 * kartın tamamını yer, kutu kaydırılamadığı için altındaki cümle ekrandan
 * taşardı. Gerçek sayı kutunun başlığında yazıyor; ızgara oranı gösteriyor.
 */
const IZGARA_SINIRI = 30

function BankaIzgarasi({ kapanan, bekleyen }: { kapanan: number; bekleyen: number }) {
  const toplam = kapanan + bekleyen
  if (toplam === 0) return null

  const kare = Math.min(IZGARA_SINIRI, toplam)
  const dolu = Math.round((kapanan / toplam) * kare)

  return (
    <div className="grid grid-cols-10 gap-1.5" aria-hidden>
      {Array.from({ length: kare }, (_, i) => (
        <span
          key={i}
          className={cn('aspect-square rounded-md', i < dolu && 'ozet-pop')}
          style={{
            background: i < dolu ? VURGU : 'rgba(255,255,255,.12)',
            animationDelay: `${380 + i * 40}ms`,
            animationDuration: '420ms',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Deneme netlerinin çubukları: geçen dönemin ortalaması ve bu haftanın
 * denemeleri. Geçen dönem yoksa yalnızca bu hafta çiziliyor — uydurulmuş bir
 * sıfır çubuğu, ilk kez deneme giren kullanıcıya olmayan bir düşüş gösterirdi.
 */
function NetCubuklari({ ozet }: { ozet: HaftalikOzet }) {
  const cubuklar: { anahtar: string; etiket: string; net: number; buHafta: boolean }[] = []
  if (ozet.oncekiDonemOrtalama !== null) {
    cubuklar.push({
      anahtar: 'gecen',
      etiket: 'GEÇEN HF.',
      net: ozet.oncekiDonemOrtalama,
      buHafta: false,
    })
  }
  // En fazla üç deneme: dördüncüsünden sonra çubuklar okunamayacak kadar
  // inceliyor ve ad etiketleri üst üste biniyor.
  for (const deneme of ozet.denemeNetleri.slice(-3)) {
    cubuklar.push({
      anahtar: `${deneme.tarih}-${deneme.ad}`,
      etiket: gunEtiketi(deneme.tarih),
      net: deneme.net,
      buHafta: true,
    })
  }

  const enYuksek = Math.max(1, ...cubuklar.map((c) => c.net))
  const rekor = cubuklar.reduce((en, c) => (c.buHafta && c.net >= en ? c.net : en), -Infinity)

  return (
    <div className="flex h-24 items-end gap-3">
      {cubuklar.map((cubuk, i) => {
        const zirve = cubuk.buHafta && cubuk.net === rekor
        return (
          <div
            key={cubuk.anahtar}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <span
              className="rakam"
              style={{ ...yz(900, 12, 1), color: zirve ? '#FFE3C4' : 'rgba(255,255,255,.55)' }}
            >
              {netYaz(cubuk.net)}
            </span>
            <span
              className="ozet-bar w-full rounded-t-lg rounded-b"
              style={{
                height: `${Math.max(8, Math.round((cubuk.net / enYuksek) * 100))}%`,
                background: zirve
                  ? `linear-gradient(180deg,#FFE3C4,${VURGU})`
                  : cubuk.buHafta
                    ? 'rgba(255,255,255,.32)'
                    : 'rgba(255,255,255,.2)',
                animationDelay: `${480 + i * 80}ms`,
              }}
            />
            <span
              style={{
                ...yz(800, 9, 1),
                color: zirve ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.45)',
              }}
            >
              {cubuk.etiket}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function NetKutusu({ etiket, deger, renk }: { etiket: string; deger: string; renk?: string }) {
  return (
    <div className="flex-1 rounded-[15px] px-3 py-2.5" style={{ background: 'rgba(0,0,0,.22)' }}>
      <p
        className="m-0"
        style={{ ...yz(700, 9, 1), letterSpacing: '0.12em', color: 'rgba(255,255,255,.5)' }}
      >
        {etiket}
      </p>
      <p className="rakam m-0 mt-1.5" style={{ ...yz(900, 18, 1), color: renk }}>
        {deger}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Biçimleme
// ---------------------------------------------------------------------------

/** Kapak ve kapanış kutucuklarındaki kısa süre — "6:55", bir saatin altında "55dk". */
function saatKisa(dakika: number): string {
  if (dakika <= 0) return '—'
  if (dakika < 60) return `${dakika}dk`
  return `${Math.floor(dakika / 60)}:${String(dakika % 60).padStart(2, '0')}`
}

/** Dev sayı olarak süre: "6 sa 55 dk", birimleri küçük punto. */
function sureParcalari(dakika: number): React.ReactNode {
  const saat = Math.floor(dakika / 60)
  const kalan = dakika % 60
  if (saat === 0) {
    return (
      <>
        {kalan}
        <Birim>dk</Birim>
      </>
    )
  }
  return (
    <>
      {saat}
      <Birim>sa</Birim> {kalan}
      <Birim>dk</Birim>
    </>
  )
}

/** Çubuğun altındaki gün adı — "SALI", "CUMA". */
function gunEtiketi(iso: string): string {
  const gunler = ['PAZAR', 'PZT', 'SALI', 'ÇARŞ.', 'PERŞ.', 'CUMA', 'CMT']
  return gunler[new Date(`${iso}T00:00:00`).getDay()]
}

/**
 * Kapanış kutucuğuna sığmayan ders adını kısaltır — "Matematik" → "Mat."
 *
 * Sınır 30 piksellik yazıda ızgaranın yarım sütununa sığan harf sayısı;
 * "Matematik" bu yüzden kısalanların içinde.
 */
function kisaDers(ad: string): string {
  return ad.length <= 8 ? ad : `${ad.slice(0, 3)}.`
}

// ---------------------------------------------------------------------------
// Cümleler
//
// Hepsi veriye göre değişiyor: sabit bir "harikasın" her hafta aynı çıkar ve
// üçüncü haftada okunmaz olur. Kötü giden bir haftada da suçlayıcı değil,
// yönlendirici bir cümle veriliyor — motivasyonu kıran bir özet işe yaramaz.
// ---------------------------------------------------------------------------

function hedefCumlesi(ozet: HaftalikOzet): string {
  if (ozet.haftalikHedef <= 0) return 'Haftalık hedefin yok. Ayarlardan bir günlük hedef koy.'
  if (ozet.hedefDurumu === 'asti') {
    return `Haftalık hedefini ${ozet.hedefFarki} soru aştın. Bu sıradan bir hafta değil.`
  }
  if (ozet.hedefDurumu === 'tutturdu') {
    return `${ozet.haftalikHedef} soruluk hedefi tutturdun. Söz verip tutmak, en zor kısmıydı.`
  }
  if (ozet.toplamSoru === 0) {
    return 'Bu hafta hiç soru girilmemiş. Yeni hafta temiz bir sayfa — yarın 20 soruyla başla.'
  }
  return `Hedefe ${Math.abs(ozet.hedefFarki)} soru kalmıştı. Günde ${Math.ceil(
    Math.abs(ozet.hedefFarki) / 7,
  )} soru fazlası bu farkı kapatıyor.`
}

function pomodoroCumlesi(ozet: HaftalikOzet): string {
  if (ozet.pomodoroDakika >= 600) {
    return 'On saatin üstü — bu hafta masaya gerçekten oturmuşsun.'
  }
  return 'Kesintisiz geçen her dakika, dağınık geçen üç dakikadan değerli.'
}

function oyunCumlesi(ozet: HaftalikOzet): string {
  const oyunAdi = ozet.enCokOynanan ? oyunBul(ozet.enCokOynanan).ad : null
  const kuyruk = oyunAdi ? ` En çok ${oyunAdi} oynadım.` : ''
  return `${ozet.oyunTur} tur, ${ozet.oyunDogru} doğru cevap.${kuyruk}`
}

function bankaCumlesi(ozet: HaftalikOzet): string {
  if (ozet.bankaCozulen === 0) {
    return 'Bu hafta bankadaki yanlışlara dönmemişsin. Bir kez yanlış yapılan soru, iki kez yanlış yapılmaya en yakın sorudur.'
  }
  return 'Eski yanlışları kapatmak, yeni soru çözmekten daha çok net getirir.'
}

/** 3. ve 2. ders kartlarının alt notu — sıradakine bağlayan cümle. */
function dereceNotu(sira: 2 | 3, ozet: HaftalikOzet): string {
  if (sira === 3) return 'Podyumun üçüncü basamağı. Geri kalan iki ders için sıradaki kartlar.'
  const fark = (ozet.ilkUcDers[0]?.soru ?? 0) - (ozet.ilkUcDers[1]?.soru ?? 0)
  if (fark <= 0) return 'Zirveyle başa baş gitmiş. Sırada haftanın dersi var.'
  return `Zirveye ${fark} soru kalmış. Sırada haftanın dersi var.`
}

function kapanisCumlesi(ozet: HaftalikOzet): string {
  if (ozet.hedefDurumu === 'asti') return 'Bu haftayı sen kazandın.'
  if (ozet.hedefDurumu === 'tutturdu') return 'Sözünü tuttun. Aynen devam.'
  if (ozet.toplamSoru === 0) return 'Yeni hafta, temiz sayfa.'
  return 'Hafta bitti, hesap kapandı. Sıradaki daha iyi olacak.'
}
