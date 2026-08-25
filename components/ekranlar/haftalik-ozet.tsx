'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CalendarX2,
  Download,
  Flame,
  Gamepad2,
  Images,
  Share2,
  Target,
  Timer,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import type { HaftalikOzet } from '@/lib/ozet'
import { dakikaYaz, gunYaz, haftaYaz, yuzdeYaz } from '@/lib/ozet'
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
 */

/** Özetin arka plan müziği için sabit bir parça — her hafta aynı, "özet müziği" olsun. */
const OZET_PARCASI = LOFI_PARCALAR[3]

type Kart = {
  id: string
  /** Kendiliğinden geçmeden önce ekranda kalma süresi (ms). 0 = geçmez. */
  sure: number
  /** Zemin geçişinin iki ucu. Paylaşılan görsel de aynı renkleri kullanıyor. */
  renkler: readonly [string, string]
  ses?: () => void
  icerik: React.ReactNode
  /** Kartın paylaşılabilir hâli — ekrandakiyle aynı sayı ve cümle. */
  paylasim: OzetKartVerisi
}

/** Kartın CSS zemini. Renkler tek yerde dursun diye buradan türetiliyor. */
function zeminCss(renkler: readonly [string, string]): string {
  return `linear-gradient(160deg, ${renkler[0]} 0%, ${renkler[1]} 100%)`
}

/** Basılı tutma kaç ms sonra "duraklat" sayılıyor. Altındakiler dokunuş. */
const BASILI_ESIGI = 220

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
    kalanRef.current = kart?.sure ?? 0
  }, [kart, sira])

  useEffect(() => {
    if (!kart || kart.sure <= 0 || bekliyor) return
    const baslangic = Date.now()
    const zamanlayici = setTimeout(ilerle, kalanRef.current)
    return () => {
      clearTimeout(zamanlayici)
      kalanRef.current = Math.max(0, kalanRef.current - (Date.now() - baslangic))
    }
  }, [kart, sira, bekliyor, ilerle])

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
      className="fixed inset-0 z-50 flex flex-col overflow-hidden text-white"
      style={{ background: zeminCss(kart.renkler) }}
      onPointerDown={basmaBasladi}
      onPointerUp={basmaBitti}
      onPointerCancel={basmaBitti}
      onPointerLeave={basmaBitti}
    >
      {/* Zemin geçişi yumuşasın diye kartın rengi üstüne ince bir karartma */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      {/* İçerik sütunu uygulamanın geri kalanıyla aynı genişlikte tutuluyor;
          geniş ekranda kartlar kenarlara savrulmasın. */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-md flex-col px-5 pt-[calc(0.75rem+var(--guvenli-ust))] pb-[calc(1rem+var(--guvenli-alt))]">
        <IlerlemeCubuklari
          toplam={kartlar.length}
          sira={sira}
          sure={kart.sure}
          durdu={bekliyor}
        />

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onKapat}
            aria-label="Özeti kapat"
            className="rounded-full p-2 text-white/80 active:bg-white/15"
          >
            <X size={22} aria-hidden />
          </button>

          <p className="min-w-0 flex-1 truncate text-center text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            {haftaYaz(ozet.hafta)}
          </p>

          <div className="flex items-center">
            {/* Hikâyede ne bakıyorsan onu paylaşırsın: bu düğme açık kartın
                görselini üretiyor, sondaki düğme haftanın tamamını. */}
            <button
              type="button"
              onClick={() => void kartiPaylas()}
              disabled={paylasimDurumu === 'uretiliyor'}
              aria-label="Bu kartı paylaş"
              className="rounded-full p-2 text-white/80 active:bg-white/15 disabled:opacity-50"
            >
              <Share2 size={19} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setSesli((s) => !s)}
              aria-label={sesli ? 'Sesi kapat' : 'Sesi aç'}
              aria-pressed={sesli}
              className="rounded-full p-2 text-white/80 active:bg-white/15"
            >
              {sesli ? <Volume2 size={20} aria-hidden /> : <VolumeX size={20} aria-hidden />}
            </button>
          </div>
        </div>

        {/* Kartın kendisi. `key` sıra: her geçişte animasyonlar baştan oynasın. */}
        <div key={kart.id} className="flex min-h-0 flex-1 flex-col justify-center py-6">
          {kart.icerik}
        </div>

        {sonKart ? (
          <PaylasCubugu durum={paylasimDurumu} onPaylas={() => void haftayiPaylas()} onKapat={onKapat} />
        ) : (
          <p className="pb-1 text-center text-xs text-white/55">
            {basili ? 'Bıraktığında devam eder' : 'Dokun geç · basılı tut beklet'}
          </p>
        )}
      </div>

      {/* Dokunma alanları: sol üçte bir geri, kalanı ileri. Kartın kendi
          düğmeleri (paylaş, kapat) bunların üstünde kaldığı için engellenmiyor. */}
      <button
        type="button"
        aria-label="Önceki kart"
        onClick={dokunus(geri)}
        className="absolute inset-y-0 left-0 z-0 w-1/3"
      />
      <button
        type="button"
        aria-label="Sonraki kart"
        onClick={dokunus(ilerle)}
        className="absolute inset-y-0 right-0 z-0 w-2/3"
      />
    </div>
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
            className={cn('block h-full rounded-full bg-white', i === sira && sure > 0 && 'ozet-cubuk')}
            style={
              i < sira || sure <= 0
                ? { width: i <= sira ? '100%' : '0%' }
                : i === sira
                  ? { animationDuration: `${sure}ms`, animationPlayState: durdu ? 'paused' : 'running' }
                  : { width: '0%' }
            }
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
    <div className="relative z-10 space-y-2">
      {durum === 'hata' && (
        <p className="text-center text-xs text-white/80">
          Görsel oluşturulamadı. Ekran görüntüsü alabilirsin.
        </p>
      )}
      <button
        type="button"
        onClick={onPaylas}
        disabled={durum === 'uretiliyor'}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white font-medium text-neutral-900 transition active:brightness-95 disabled:opacity-60"
      >
        {durum === 'uretiliyor' ? (
          <>
            <Download size={18} aria-hidden /> Görsel hazırlanıyor…
          </>
        ) : (
          <>
            <Share2 size={18} aria-hidden /> Tüm haftayı paylaş
          </>
        )}
      </button>
      <button
        type="button"
        onClick={onKapat}
        className="h-10 w-full rounded-2xl text-sm font-medium text-white/80 active:bg-white/10"
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
function Ustluk({ simge, children }: { simge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="ozet-girisi flex items-center gap-2 text-sm font-medium text-white/75">
      {simge}
      {children}
    </p>
  )
}

/** Kartın taşıyıcı sayısı. Gecikme, üst etiketten sonra gelmesi için. */
function DevSayi({ children, kucuk }: { children: React.ReactNode; kucuk?: boolean }) {
  return (
    <p
      className={cn(
        'ozet-vurgu font-display font-semibold leading-none tracking-tight',
        kucuk ? 'text-5xl' : 'text-7xl',
      )}
      style={{ animationDelay: '140ms' }}
    >
      {children}
    </p>
  )
}

/** Sayının altındaki cümle — motive eden kısım burada. */
function AltYazi({ children, gecikme = 340 }: { children: React.ReactNode; gecikme?: number }) {
  return (
    <p
      className="ozet-girisi text-lg leading-relaxed text-white/90"
      style={{ animationDelay: `${gecikme}ms` }}
    >
      {children}
    </p>
  )
}

function Sahne({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

// ---------------------------------------------------------------------------
// Kartlar
// ---------------------------------------------------------------------------

/**
 * Kartların zemin renkleri — geçişin iki ucu.
 *
 * CSS metni olarak değil çift olarak tutuluyor: paylaşılan görsel tuvale
 * çiziliyor ve `linear-gradient(...)` metnini ayrıştıramıyor. Renkler tek
 * yerde durunca ekrandaki kartla paylaşılan görsel birbirinden ayrılamıyor.
 */
const ZEMINLER = {
  giris: ['#7C5CFC', '#2E1D6B'],
  hedef: ['#E0559B', '#7A2350'],
  seri: ['#E4708A', '#8C2E48'],
  devamsizlik: ['#4A5568', '#232B38'],
  pomodoro: ['#2F6D4F', '#16382A'],
  ders: ['#3B6E64', '#1B3831'],
  oyun: ['#5B4A9E', '#2C2354'],
  banka: ['#9E4A6B', '#4E2036'],
  deneme: ['#2E5C8A', '#142B44'],
  net: ['#1F6E7A', '#0E343A'],
  ucuncu: ['#6B5B4A', '#33291F'],
  ikinci: ['#8A6B33', '#46340F'],
  birinci: ['#D08A2C', '#8A4A10'],
  kapanis: ['#8B6BFF', '#2A1A5E'],
} as const satisfies Record<string, readonly [string, string]>

function kartlariKur(ozet: HaftalikOzet): Kart[] {
  const kartlar: Kart[] = [
    {
      id: 'giris',
      sure: 3400,
      renkler: ZEMINLER.giris,
      ses: () => kartSesi(0),
      paylasim: {
        ustluk: 'Haftalık özet',
        dev: 'Haftan bitti',
        alt: 'Bakalım ne yapmışsın.',
        renkler: ZEMINLER.giris,
      },
      icerik: (
        <Sahne>
          <div className="ozet-vurgu flex justify-center">
            <Rabi durum="kutlama" boyut={120} />
          </div>
          <p className="ozet-girisi pt-2 text-center text-sm text-white/75">
            {haftaYaz(ozet.hafta)}
          </p>
          <p
            className="ozet-vurgu font-display text-center text-4xl font-semibold leading-tight"
            style={{ animationDelay: '160ms' }}
          >
            Haftan bitti.
            <br />
            Bakalım ne yapmışsın.
          </p>
        </Sahne>
      ),
    },

    // --- 1. Haftalık soru hedefine yakınlık ---
    {
      id: 'hedef',
      sure: 4600,
      renkler: ZEMINLER.hedef,
      ses: () => kartSesi(1),
      paylasim: {
        ustluk: 'Bu hafta çözdüğüm soru',
        dev: String(ozet.toplamSoru),
        alt: hedefCumlesi(ozet),
        renkler: ZEMINLER.hedef,
      },
      icerik: (
        <Sahne>
          <Ustluk simge={<Target size={16} aria-hidden />}>Bu hafta çözdüğün soru</Ustluk>
          <DevSayi>{ozet.toplamSoru}</DevSayi>
          <AltYazi>{hedefCumlesi(ozet)}</AltYazi>
          {ozet.haftalikHedef > 0 && (
            <div className="ozet-girisi pt-2" style={{ animationDelay: '460ms' }}>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-[width] duration-700"
                  style={{ width: `${Math.min(100, Math.round(ozet.hedefOrani * 100))}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-white/70">
                Haftalık hedef {ozet.haftalikHedef} soru · 7 günün {ozet.hedefliGun} tanesinde
                günlük hedefi tutturdun
              </p>
            </div>
          )}
        </Sahne>
      ),
    },

    // --- Seri ---
    {
      id: 'seri',
      sure: 4200,
      renkler: ZEMINLER.seri,
      ses: () => kartSesi(2),
      paylasim: {
        ustluk: 'Serim',
        dev: ozet.seri === 0 ? '—' : `${ozet.seri} gün`,
        alt: seriCumlesi(ozet),
        renkler: ZEMINLER.seri,
      },
      icerik: (
        <Sahne>
          <Ustluk simge={<Flame size={16} aria-hidden />}>Serin</Ustluk>
          <DevSayi>{ozet.seri === 0 ? '—' : `${ozet.seri} gün`}</DevSayi>
          <AltYazi>{seriCumlesi(ozet)}</AltYazi>
        </Sahne>
      ),
    },

    // --- 2. Devamsızlık ---
    {
      id: 'devamsizlik',
      sure: 4200,
      renkler: ZEMINLER.devamsizlik,
      ses: () => kartSesi(3),
      paylasim: {
        ustluk: 'Bu haftaki devamsızlığım',
        dev: ozet.devamsizlikToplam === 0 ? 'Tam gün' : `${gunYaz(ozet.devamsizlikToplam)} gün`,
        alt: devamsizlikCumlesi(ozet),
        renkler: ZEMINLER.devamsizlik,
      },
      icerik: (
        <Sahne>
          <Ustluk simge={<CalendarX2 size={16} aria-hidden />}>Bu haftaki devamsızlığın</Ustluk>
          <DevSayi>
            {ozet.devamsizlikToplam === 0 ? 'Tam gün' : `${gunYaz(ozet.devamsizlikToplam)} gün`}
          </DevSayi>
          <AltYazi>{devamsizlikCumlesi(ozet)}</AltYazi>
        </Sahne>
      ),
    },

    // --- 3. Pomodoro dakikası ---
    {
      id: 'pomodoro-dakika',
      sure: 4200,
      renkler: ZEMINLER.pomodoro,
      ses: () => kartSesi(4),
      paylasim: {
        ustluk: 'Pomodoro ile çalıştığım süre',
        dev: ozet.pomodoroDakika === 0 ? '—' : dakikaYaz(ozet.pomodoroDakika),
        alt: pomodoroCumlesi(ozet),
        renkler: ZEMINLER.pomodoro,
      },
      icerik: (
        <Sahne>
          <Ustluk simge={<Timer size={16} aria-hidden />}>Pomodoro ile çalıştığın süre</Ustluk>
          <DevSayi>{ozet.pomodoroDakika === 0 ? '—' : dakikaYaz(ozet.pomodoroDakika)}</DevSayi>
          <AltYazi>{pomodoroCumlesi(ozet)}</AltYazi>
        </Sahne>
      ),
    },

    // --- 4. En çok çalışılan ders ---
    {
      id: 'pomodoro-ders',
      sure: 4200,
      renkler: ZEMINLER.ders,
      ses: () => kartSesi(5),
      paylasim: {
        ustluk: 'En çok vakit ayırdığım ders',
        dev: ozet.pomodoroDers?.ders ?? 'Ders seçilmemiş',
        alt: ozet.pomodoroDers
          ? `${dakikaYaz(ozet.pomodoroDers.dakika)} — haftanın en çok emek verdiğim dersi bu.`
          : 'Pomodoro başlatırken ders seçilmemiş.',
        renkler: ZEMINLER.ders,
      },
      icerik: (
        <Sahne>
          <Ustluk simge={<Timer size={16} aria-hidden />}>En çok vakit ayırdığın ders</Ustluk>
          <DevSayi kucuk>{ozet.pomodoroDers?.ders ?? 'Ders seçilmemiş'}</DevSayi>
          <AltYazi>
            {ozet.pomodoroDers
              ? `${dakikaYaz(ozet.pomodoroDers.dakika)} — haftanın en çok emek verdiğin dersi bu.`
              : 'Pomodoro başlatırken ders seçersen, haftaya hangi derse ne kadar verdiğini burada görürsün.'}
          </AltYazi>
        </Sahne>
      ),
    },

    // --- 5. Mini oyunlar ---
    {
      id: 'oyun',
      sure: 4200,
      renkler: ZEMINLER.oyun,
      ses: () => kartSesi(6),
      paylasim: {
        ustluk: 'Mini oyunlarda geçen süre',
        dev: ozet.oyunTur === 0 ? '—' : dakikaYaz(ozet.oyunDakika),
        alt: oyunCumlesi(ozet),
        renkler: ZEMINLER.oyun,
      },
      icerik: (
        <Sahne>
          <Ustluk simge={<Gamepad2 size={16} aria-hidden />}>Mini oyunlarda geçen süre</Ustluk>
          <DevSayi>{ozet.oyunTur === 0 ? '—' : dakikaYaz(ozet.oyunDakika)}</DevSayi>
          <AltYazi>{oyunCumlesi(ozet)}</AltYazi>
        </Sahne>
      ),
    },

    // --- 6. Yanlış soru bankası ---
    {
      id: 'banka',
      sure: 4200,
      renkler: ZEMINLER.banka,
      ses: () => kartSesi(7),
      paylasim: {
        ustluk: 'Bankadan kapattığım soru',
        dev: String(ozet.bankaCozulen),
        alt: bankaCumlesi(ozet),
        renkler: ZEMINLER.banka,
      },
      icerik: (
        <Sahne>
          <Ustluk simge={<Images size={16} aria-hidden />}>Bankadan kapattığın soru</Ustluk>
          <DevSayi>{ozet.bankaCozulen}</DevSayi>
          <AltYazi>{bankaCumlesi(ozet)}</AltYazi>
        </Sahne>
      ),
    },

    // --- 7. Deneme sayısı ---
    {
      id: 'deneme-sayisi',
      sure: 4200,
      renkler: ZEMINLER.deneme,
      ses: () => kartSesi(8),
      paylasim: {
        ustluk: 'Bu hafta girdiğim deneme',
        dev: String(ozet.denemeSayisi),
        alt: denemeCumlesi(ozet),
        renkler: ZEMINLER.deneme,
      },
      icerik: (
        <Sahne>
          <Ustluk>Bu hafta girdiğin deneme</Ustluk>
          <DevSayi>{ozet.denemeSayisi}</DevSayi>
          <AltYazi>{denemeCumlesi(ozet)}</AltYazi>
        </Sahne>
      ),
    },
  ]

  // --- 8. Deneme netleri ---
  kartlar.push({
    id: 'deneme-net',
    sure: 5000,
    renkler: ZEMINLER.net,
    ses: () => kartSesi(9),
    paylasim: ozet.denemeEnYuksek
      ? {
          ustluk: 'En yüksek deneme netim',
          dev: netYaz(ozet.denemeEnYuksek.net),
          alt: ozet.denemeEnYuksek.ad,
          ekstra: [
            `En düşük ${netYaz(ozet.denemeEnDusuk?.net ?? 0)}`,
            `Ortalama ${netYaz(ozet.denemeOrtalama ?? 0)}`,
          ],
          renkler: ZEMINLER.net,
        }
      : {
          ustluk: 'Deneme netlerim',
          dev: 'Bu hafta deneme yok',
          alt: 'Deneme, gidişatı gösteren tek ölçü.',
          renkler: ZEMINLER.net,
        },
    icerik: ozet.denemeEnYuksek ? (
      <Sahne>
        <Ustluk>Deneme netlerin</Ustluk>
        <DevSayi>{netYaz(ozet.denemeEnYuksek.net)}</DevSayi>
        <AltYazi>
          En yüksek netin — <strong className="font-semibold">{ozet.denemeEnYuksek.ad}</strong>
        </AltYazi>
        <div
          className="ozet-girisi grid grid-cols-2 gap-3 pt-2"
          style={{ animationDelay: '520ms' }}
        >
          <NetKutusu etiket="En düşük" deger={netYaz(ozet.denemeEnDusuk?.net ?? 0)} />
          <NetKutusu etiket="Ortalama" deger={netYaz(ozet.denemeOrtalama ?? 0)} />
        </div>
      </Sahne>
    ) : (
      <Sahne>
        <Ustluk>Deneme netlerin</Ustluk>
        <DevSayi kucuk>Bu hafta deneme yok</DevSayi>
        <AltYazi>
          Deneme, gidişatını gösteren tek ölçü. Haftaya bir tane çözersen burada netini görürsün.
        </AltYazi>
      </Sahne>
    ),
  })

  // --- 9. En çok soru çözülen üç ders, 3'ten 1'e ---
  if (ozet.ilkUcDers.length === 0) {
    kartlar.push({
      id: 'ders-yok',
      sure: 4200,
      renkler: ZEMINLER.ucuncu,
      ses: () => kartSesi(10),
      paylasim: {
        ustluk: 'En çok soru çözdüğüm dersler',
        dev: 'Ders girilmemiş',
        alt: 'Soru takibine ders ders girilirse haftanın zirvesi burada çıkıyor.',
        renkler: ZEMINLER.ucuncu,
      },
      icerik: (
        <Sahne>
          <Ustluk>En çok soru çözdüğün dersler</Ustluk>
          <DevSayi kucuk>Ders girilmemiş</DevSayi>
          <AltYazi>
            Soru takibine ders ders girersen, haftaya hangi dersin zirvede olduğunu burada
            görürsün.
          </AltYazi>
        </Sahne>
      ),
    })
  } else {
    // Geri sayım için ters çevriliyor: 3. sıradan başlayıp 1.'ye çıkıyor.
    const siralama = [...ozet.ilkUcDers].reverse()
    const zeminler = [ZEMINLER.ucuncu, ZEMINLER.ikinci, ZEMINLER.birinci]

    siralama.forEach((ders, i) => {
      const sira = (siralama.length - i) as 3 | 2 | 1
      const birinciMi = sira === 1

      kartlar.push({
        id: `ders-${sira}`,
        sure: birinciMi ? 6000 : 4000,
        // Birincilik altın rengi; üçüncü ve ikinci daha sönük. Renk sıcaklığının
        // artması, geri sayımın yaklaştığını sayıyı okumadan hissettiriyor.
        renkler: zeminler[Math.min(2, 3 - sira)],
        paylasim: {
          ustluk: birinciMi
            ? 'Haftanın dersi'
            : `En çok soru çözdüğüm ${sira}. ders`,
          dev: `${sira}. ${ders.ders}`,
          alt: `${ders.soru} soru · haftanın ${yuzdeYaz(ders.oran)}${
            birinciMi ? ' — bu hafta beni en çok bu ders yordu.' : ''
          }`,
          renkler: zeminler[Math.min(2, 3 - sira)],
        },
        ses: () => (birinciMi ? zaferSesi() : geriSayimSesi(sira)),
        icerik: (
          <Sahne>
            <Ustluk>
              {birinciMi ? 'Ve haftanın dersi…' : `En çok soru çözdüğün ${sira}. ders`}
            </Ustluk>
            <p
              className={cn(
                'font-display text-8xl font-bold leading-none',
                birinciMi ? 'ozet-nabiz' : 'ozet-vurgu',
              )}
              style={birinciMi ? undefined : { animationDelay: '120ms' }}
            >
              {sira}.
            </p>
            <p
              className="ozet-vurgu font-display text-4xl font-semibold leading-tight"
              style={{ animationDelay: birinciMi ? '520ms' : '300ms' }}
            >
              {ders.ders}
            </p>
            <AltYazi gecikme={birinciMi ? 760 : 520}>
              {ders.soru} soru · haftanın {yuzdeYaz(ders.oran)}
              {birinciMi ? ' — bu hafta seni en çok bu ders yordu.' : ''}
            </AltYazi>
          </Sahne>
        ),
      })
    })
  }

  // --- Kapanış ---
  kartlar.push({
    id: 'kapanis',
    sure: 0,
    renkler: ZEMINLER.kapanis,
    ses: kapanisSesi,
    paylasim: {
      ustluk: `Rabi haftalık özeti`,
      dev: kapanisCumlesi(ozet),
      alt: `${ozet.toplamSoru} soru · ${dakikaYaz(ozet.pomodoroDakika)} pomodoro · ${
        ozet.denemeSayisi
      } deneme`,
      renkler: ZEMINLER.kapanis,
    },
    icerik: (
      <Sahne>
        <div className="ozet-vurgu flex justify-center">
          <Rabi durum="mutlu" boyut={104} />
        </div>
        <p
          className="ozet-vurgu font-display text-center text-3xl font-semibold leading-tight"
          style={{ animationDelay: '160ms' }}
        >
          {kapanisCumlesi(ozet)}
        </p>
        <AltYazi gecikme={420}>
          <span className="block text-center text-base text-white/80">
            Bu haftayı paylaş, gelecek hafta daha iyisini yap.
          </span>
        </AltYazi>
      </Sahne>
    ),
  })

  return kartlar
}

function NetKutusu({ etiket, deger }: { etiket: string; deger: string }) {
  return (
    <div className="rounded-2xl bg-white/15 px-4 py-3">
      <p className="text-xs text-white/70">{etiket}</p>
      <p className="rakam font-display text-2xl font-semibold">{deger}</p>
    </div>
  )
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
    return 'Bu hafta hiç soru girilmemiş. Yeni hafta temiz bir sayfa — pazartesi 20 soruyla başla.'
  }
  return `Hedefe ${Math.abs(ozet.hedefFarki)} soru kalmıştı. Günde ${Math.ceil(
    Math.abs(ozet.hedefFarki) / 7,
  )} soru fazlası bu farkı kapatıyor.`
}

function seriCumlesi(ozet: HaftalikOzet): string {
  if (ozet.seri === 0) {
    return 'Seri kopmuş. Günlük hedefi tutturduğun ilk gün yeniden 1’den başlıyor.'
  }
  if (ozet.seri === 1) return 'Seri başladı. Yarın da tuttur, 2 olsun.'
  if (ozet.seri >= 7) {
    return `${ozet.seri} gündür günlük hedefini hiç kaçırmadın. Bu artık alışkanlık.`
  }
  return `${ozet.seri} gündür günlük hedefini tutturuyorsun. Bir gün boş geçersen sıfırlanır.`
}

function devamsizlikCumlesi(ozet: HaftalikOzet): string {
  if (ozet.devamsizlikToplam === 0) return 'Bu hafta hiç devamsızlık yapmadın. Hakkın duruyor.'

  const parcalar: string[] = []
  if (ozet.devamsizlikOzursuz > 0) {
    parcalar.push(`${gunYaz(ozet.devamsizlikOzursuz)} gün özürsüz`)
  }
  if (ozet.devamsizlikOzurlu > 0) parcalar.push(`${gunYaz(ozet.devamsizlikOzurlu)} gün özürlü`)

  const uyari =
    ozet.devamsizlikOzursuz > 0
      ? ' Özürsüz hakkın 10 gün — Devamsızlık ekranından kalanına bak.'
      : ' Raporlu günler ayrı sayılıyor, panik yok.'

  return parcalar.join(', ') + '.' + uyari
}

function pomodoroCumlesi(ozet: HaftalikOzet): string {
  if (ozet.pomodoroDakika === 0) {
    return 'Bu hafta hiç pomodoro açmamışsın. 25 dakika, tek oturum — başlamak için yeter.'
  }
  if (ozet.pomodoroDakika >= 600) {
    return `${ozet.pomodoroSeans} oturum. On saatin üstü — bu hafta masaya gerçekten oturmuşsun.`
  }
  return `${ozet.pomodoroSeans} oturum. Kesintisiz geçen her dakika, dağınık geçen üç dakikadan değerli.`
}

function oyunCumlesi(ozet: HaftalikOzet): string {
  if (ozet.oyunTur === 0) {
    return 'Bu hafta mini oyun oynamadın. Bir turu bir dakika — sıradaki molada dene.'
  }
  const oyunAdi = ozet.enCokOynanan ? oyunBul(ozet.enCokOynanan).ad : null
  const kuyruk = oyunAdi ? ` En çok ${oyunAdi} oynadın.` : ''
  return `${ozet.oyunTur} tur, ${ozet.oyunDogru} doğru cevap.${kuyruk}`
}

function bankaCumlesi(ozet: HaftalikOzet): string {
  if (ozet.bankaCozulen === 0) {
    return 'Bu hafta bankadaki yanlışlara dönmemişsin. Bir kez yanlış yapılan soru, iki kez yanlış yapılmaya en yakın sorudur.'
  }
  if (ozet.bankaCozulen >= 10) {
    return `${ozet.bankaCozulen} soruyu "çözdüm" işaretledin. Eski yanlışları kapatmak, yeni soru çözmekten daha çok net getirir.`
  }
  return `${ozet.bankaCozulen} eski yanlışını kapattın. Bankayı boşaltmak netini doğrudan yükseltir.`
}

function denemeCumlesi(ozet: HaftalikOzet): string {
  if (ozet.denemeSayisi === 0) {
    return 'Bu hafta deneme girmemişsin. Deneme, çalışmanın karnesi — haftada bir tane bile yön gösterir.'
  }
  if (ozet.denemeSayisi === 1) return 'Bir deneme. Düzenli girersen trend çizgisi anlam kazanır.'
  return `${ozet.denemeSayisi} deneme. Bu tempoda gidişatını okumak kolaylaşıyor.`
}

function kapanisCumlesi(ozet: HaftalikOzet): string {
  if (ozet.hedefDurumu === 'asti') return 'Bu haftayı sen kazandın.'
  if (ozet.hedefDurumu === 'tutturdu') return 'Sözünü tuttun. Aynen devam.'
  if (ozet.toplamSoru === 0) return 'Yeni hafta, temiz sayfa.'
  return 'Hafta bitti, hesap kapandı. Sıradaki daha iyi olacak.'
}
