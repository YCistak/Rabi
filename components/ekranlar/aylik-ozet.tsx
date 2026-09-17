'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RotateCcw, Share2, Volume2, VolumeX, X } from 'lucide-react'
import type { AylikOzet, DenemeNeti, DersToplami } from '@/lib/ozet'
import {
  ayAdi,
  ayDe,
  ayAraligiYaz,
  ayKaydir,
  dakikaKisa,
  gunAyYaz,
  ondalikYuzdeYaz,
  tamYaz,
  yuzdeYaz,
} from '@/lib/ozet'
import { netYaz } from '@/lib/hesap'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { geriSayimSesi, kapanisSesi, kartSesi, ozetSesiCal, zaferSesi } from '@/lib/ozet-sesi'
import { ozetGorseliUret } from '@/lib/ozet-gorsel'
import { gorseliPaylas } from '@/lib/paylas'
import { SesCalar } from '@/lib/ses'
import { LOFI_PARCALAR } from '@/lib/lofi'
import { useUygulamaGorunur } from '@/lib/gorunurluk'
import { useGeriKatmani } from '@/lib/geri'
import { Rabi, type MaskotPozu } from '@/components/maskot/rabi'
import { cn } from '@/lib/utils'

/**
 * Aylık özet — hikâye (story) biçiminde, sayfa sayfa çevrilen ay kapanışı.
 *
 * Neden liste değil de sayfa destesi: aynı sayılar tek sayfada alt alta
 * dizildiğinde göz hepsini birden görüp hiçbirinde durmuyor. Sayfalar sayıları
 * teker teker önüne koyuyor; özellikle sondaki "en çok çalıştığın üç ders"
 * geri sayımı, hepsi birden gösterilseydi hiçbir merak uyandırmazdı.
 *
 * Sayfalar **kendiliğinden ilerlemiyor**, dokunarak çevriliyor (tasarım:
 * "SAĞA DOKUN →"). Haftalık özet zamanlayıcıyla akıyordu ve okunacak sayı
 * çoğalınca beş saniye ya kısa ya uzun geliyordu; ay özeti bir defter gibi
 * çevriliyor, üstteki şerit yalnızca kaçıncı sayfada olunduğunu söylüyor.
 *
 * Tasarım kaynağı `tasarim/aylik-ozet.dc.html`. Ekran kâğıt zeminli, amber
 * çerçeveli; renkler tema değişkenlerinden **gelmiyor**, burada yazılı — aynı
 * renkler paylaşılan afişe de gidiyor (`lib/ozet-gorsel.ts`) ve tuval
 * `var(--…)` metnini çözemiyor. İkisi birlikte değişmeli.
 */

/** Özetin arka plan müziği için sabit bir parça — her ay aynı, "özet müziği" olsun. */
const OZET_PARCASI = LOFI_PARCALAR[3]

/** Büyük sayıların sıfırdan hedefe sayma süresi (ms) — tasarımdaki `sayacBaslat`. */
const SAYAC_SURESI = 1100

// ---------------------------------------------------------------------------
// Palet — tasarımın kâğıt ve mürekkep renkleri
// ---------------------------------------------------------------------------

export const KAGIT = '#faf3e1'
const KAGIT_CIZGISI = 'repeating-linear-gradient(0deg,rgba(168,124,36,.14) 0 1px,transparent 1px 8px)'
const MUREKKEP = '#1b1a19'
const GOVDE = '#33302c'
const SOLUK = '#6b6764'
const AMBER = '#d09b34'
const AMBER_KOYU = '#8d691a'
const AMBER_SOLUK = '#a68a43'
const AMBER_ZEMIN = '#f7f0dc'
const AMBER_CIZGI = '#ecdfb8'
const VURGU = '#b3491f'
const VURGU_PARLAK = '#d9622f'
const YESIL = '#4f7a4a'
/** İkincilik kartının çivit tonu. */
const IKINCI = '#4a5789'
const IKINCI_ACIK = '#6c7cb0'
/** Şampiyon kartı: koyu kızıl zemin, altın vurgu. */
const KOYU_ZEMIN = 'linear-gradient(168deg,#b3491f 0%,#7e2f12 62%,#5c2410 100%)'
const ALTIN = '#f0be48'
const ALTIN_ACIK = '#fbe2a0'
const KOYU_KAHVE = '#5c2410'

/** Beyaz kutuların ortak kenarı ve gölgesi. */
const KUTU_GOLGESI = '0 4px 14px -6px rgba(141,105,26,.4)'

/**
 * Tasarımdaki `font: 800 11px/1` kısayolunun karşılığı.
 *
 * CSS'in kendi `font` kısayolu **kullanılamıyor**: aile adı zorunlu ve oraya
 * `inherit` yazmak geçersiz bir bildirim üretiyor — tarayıcı satırın tamamını
 * atıyor. Tailwind sınıfı da değil: buradaki punto ve kalınlıklar tasarımın
 * ölçüleri, ölçek adımlarına yuvarlanınca 112 piksellik sayı ile 66'lık süre
 * aynı boya iniyor.
 */
function yz(kalinlik: number, punto: number, satir: number): React.CSSProperties {
  return { fontWeight: kalinlik, fontSize: punto, lineHeight: satir }
}

type Kart = {
  id: string
  /** Koyu zeminli (şampiyon) kart: üst şerit ve hap renkleri buna bakıyor. */
  koyu?: boolean
  ses?: () => void
  /** `oran` 0→1 sayaç ilerlemesi; sayı taşıyan kartlar onunla sayıyor. */
  icerik: (oran: number) => React.ReactNode
  sonMu?: boolean
}

export function AylikOzetEkrani({
  ozet,
  sesAcik,
  onKapat,
}: {
  ozet: AylikOzet
  /** Ayarlardaki ses tercihi — özetin başlangıç durumu. */
  sesAcik: boolean
  onKapat: () => void
}) {
  const [sira, setSira] = useState(0)
  const [sesli, setSesli] = useState(sesAcik)
  const [paylasimDurumu, setPaylasimDurumu] = useState<'hazir' | 'uretiliyor' | 'hata'>('hazir')

  const kartlar = useMemo(() => kartlariKur(ozet), [ozet])
  const kart = kartlar[Math.min(sira, kartlar.length - 1)]
  const oran = useSayac(sira)

  useGeriKatmani(true, onKapat)

  // Ana tuşa basıldığında WebView durmuyor: müzik çalmaya devam ediyordu.
  const gorunur = useUygulamaGorunur()

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
    ozetSesiCal(kart.ses ?? (() => kartSesi(sira)), sesli)
  }, [sira, kart, sesli])

  const ilerle = useCallback(() => {
    setSira((s) => Math.min(s + 1, kartlar.length - 1))
  }, [kartlar.length])
  const geri = useCallback(() => setSira((s) => Math.max(0, s - 1)), [])
  const bastanBasla = useCallback(() => {
    sonSesliKartRef.current = -1
    setSira(0)
  }, [])

  const paylas = async () => {
    setPaylasimDurumu('uretiliyor')
    const gorsel = await ozetGorseliUret(ozet)
    if (!gorsel) {
      setPaylasimDurumu('hata')
      return
    }
    const ad = ayAdi(ozet.ay)
    const sonuc = await gorseliPaylas(
      gorsel,
      `rabi-aylik-ozet-${ozet.ay.anahtar}.png`,
      `Rabi aylık özetim — ${ad}`,
      `${ad} ayında ${tamYaz(ozet.toplamSoru)} soru çözdüm — Rabi aylık özeti`,
    )
    setPaylasimDurumu(sonuc === 'hata' ? 'hata' : 'hazir')
  }

  const koyu = kart.koyu === true
  const hapYazi = koyu ? ALTIN_ACIK : AMBER_KOYU

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden select-none"
      style={{ background: KAGIT, color: MUREKKEP }}
    >
      <div className="absolute inset-0 mx-auto w-full max-w-md overflow-hidden">
        {/* Kâğıdın defter çizgisi ve çift amber çerçeve. Koyu kartta çizgi
            yok — kızıl zeminde amber çizgi kirli duruyordu — çerçeve duruyor:
            ekran hâlâ aynı defterin sayfası. */}
        {!koyu && (
          <span aria-hidden className="absolute inset-0" style={{ backgroundImage: KAGIT_CIZGISI }} />
        )}

        {/* Kartın kendisi. `key` sıra: her geçişte animasyonlar baştan oynasın. */}
        <div
          key={kart.id}
          className="absolute inset-0"
          style={koyu ? { background: KOYU_ZEMIN, color: '#fff' } : undefined}
        >
          {kart.icerik(oran)}
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute z-[6] rounded-[32px] border"
          style={{
            inset: 10,
            top: 'calc(10px + var(--guvenli-ust))',
            borderColor: koyu ? 'rgba(240,190,72,.45)' : 'rgba(208,155,52,.5)',
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute z-[6] rounded-[27px] border"
          style={{
            inset: 16,
            top: 'calc(16px + var(--guvenli-ust))',
            borderColor: koyu ? 'rgba(240,190,72,.2)' : 'rgba(208,155,52,.2)',
          }}
        />

        {/* Dokunma alanları: sol üçte bir geri, kalanı ileri. Üstteki şerit ve
            kapanış düğmeleri bunların üstünde kaldığı için engellenmiyor. */}
        <button type="button" aria-label="Önceki sayfa" onClick={geri} className="absolute inset-y-0 left-0 z-[4] w-[34%]" />
        <button type="button" aria-label="Sonraki sayfa" onClick={ilerle} className="absolute inset-y-0 right-0 z-[4] w-[66%]" />

        {/* Üst şerit: dilimler, altında kapat · ay hapı · sayfa · ses. Kabın
            kendisi dokunuşu geçiriyor, yalnızca düğmeler alıyor. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[7] px-[26px]"
          style={{ paddingTop: 'calc(26px + var(--guvenli-ust))' }}
        >
          <div className="flex gap-1">
            {kartlar.map((k, n) => (
              <span
                key={k.id}
                className="h-1 flex-1 rounded-full"
                style={{
                  background:
                    n < sira + 1
                      ? koyu ? ALTIN : VURGU_PARLAK
                      : koyu ? 'rgba(255,255,255,.28)' : 'rgba(168,124,36,.25)',
                }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <YuvarlakDugme etiket="Özeti kapat" koyu={koyu} onClick={onKapat}>
              <X size={17} aria-hidden />
            </YuvarlakDugme>

            <span
              className="flex min-w-0 items-center gap-2 rounded-full border px-3 py-[7px]"
              style={{
                background: koyu ? 'rgba(0,0,0,.28)' : 'rgba(255,255,255,.72)',
                borderColor: koyu ? 'rgba(240,190,72,.4)' : AMBER_CIZGI,
              }}
            >
              <span className="size-1.5 shrink-0 rotate-45" style={{ background: VURGU_PARLAK }} />
              <span className="truncate" style={{ ...yz(800, 10.5, 1), letterSpacing: '0.16em', color: hapYazi }}>
                {ayAdi(ozet.ay).toLocaleUpperCase('tr')} ÖZETİ
              </span>
              <span className="rakam shrink-0" style={{ ...yz(900, 11, 1), letterSpacing: '0.06em', color: hapYazi }}>
                {sira + 1}/{kartlar.length}
              </span>
            </span>

            <YuvarlakDugme
              etiket={sesli ? 'Sesi kapat' : 'Sesi aç'}
              koyu={koyu}
              basili={sesli}
              onClick={() => setSesli((s) => !s)}
            >
              {sesli ? <Volume2 size={16} aria-hidden /> : <VolumeX size={16} aria-hidden />}
            </YuvarlakDugme>
          </div>
        </div>

        {/* Kapanış düğmeleri dokunma alanlarının üstünde; ötekilerde alt
            satır yalnızca bir ipucu. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] px-[30px]"
          style={{ paddingBottom: 'calc(30px + var(--guvenli-alt))' }}
        >
          {kart.sonMu ? (
            <div className="pointer-events-auto ozet-girisi flex gap-2.5" style={{ animationDelay: '320ms' }}>
              <button
                type="button"
                onClick={() => void paylas()}
                disabled={paylasimDurumu === 'uretiliyor'}
                className="flex h-[54px] flex-1 items-center justify-center gap-2.5 rounded-[18px] text-white transition active:translate-y-0.5 active:shadow-[0_2px_0_#b3491f] disabled:opacity-70"
                style={{ background: VURGU_PARLAK, boxShadow: `0 4px 0 ${VURGU}`, ...yz(900, 15.5, 1) }}
              >
                <Share2 size={18} aria-hidden />
                {paylasimDurumu === 'uretiliyor'
                  ? 'Görsel hazırlanıyor…'
                  : paylasimDurumu === 'hata'
                    ? 'Paylaşılamadı, yeniden dene'
                    : 'Özeti paylaş'}
              </button>
              <button
                type="button"
                onClick={bastanBasla}
                aria-label="Özeti baştan izle"
                className="grid size-[54px] place-items-center rounded-[18px] border bg-white transition active:brightness-95"
                style={{ borderColor: AMBER_CIZGI, color: AMBER_KOYU }}
              >
                <RotateCcw size={20} strokeWidth={2.6} aria-hidden />
              </button>
            </div>
          ) : (
            sira === 0 && (
              <p
                className="ozet-girisi text-center"
                style={{ ...yz(800, 11, 1), letterSpacing: '0.18em', color: AMBER_SOLUK, animationDelay: '420ms' }}
              >
                SAĞA DOKUN →
              </p>
            )
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * 0'dan 1'e çıkan sayaç ilerlemesi; `anahtar` değişince baştan başlıyor.
 *
 * Sayılar sıfırdan hedefe sayıyor: hikâyede sayı bir sonuç değil, olay.
 * Eğri kübik yavaşlama (`1 − (1−p)³`): hızlı başlayıp sonda duruyor, sayının
 * "oturduğu" an belli oluyor.
 */
function useSayac(anahtar: number): number {
  const [oran, setOran] = useState(0)
  useEffect(() => {
    setOran(0)
    const bas = performance.now()
    let kare = 0
    const adim = (simdi: number) => {
      const p = Math.min(1, (simdi - bas) / SAYAC_SURESI)
      setOran(1 - Math.pow(1 - p, 3))
      if (p < 1) kare = requestAnimationFrame(adim)
    }
    kare = requestAnimationFrame(adim)
    return () => cancelAnimationFrame(kare)
  }, [anahtar])
  return oran
}

// ---------------------------------------------------------------------------
// Kabuk parçaları
// ---------------------------------------------------------------------------

function YuvarlakDugme({
  etiket,
  koyu,
  basili,
  onClick,
  children,
}: {
  etiket: string
  koyu: boolean
  basili?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={etiket}
      aria-pressed={basili}
      onClick={onClick}
      className="pointer-events-auto grid size-9 shrink-0 place-items-center rounded-full border transition active:scale-95"
      style={{
        background: koyu ? 'rgba(0,0,0,.28)' : 'rgba(255,255,255,.72)',
        borderColor: koyu ? 'rgba(240,190,72,.4)' : AMBER_CIZGI,
        color: koyu ? ALTIN_ACIK : AMBER_KOYU,
      }}
    >
      {children}
    </button>
  )
}

/** Kartın içerik sütunu: ortalanmış, üstte şerit altta ipucu için pay bırakıyor. */
function Sayfa({
  bosluk,
  ustPay = 96,
  altPay = 96,
  className,
  children,
}: {
  bosluk: number
  ustPay?: number
  altPay?: number
  className?: string
  children: React.ReactNode
}) {
  return (
    // `safe center`: içerik kısa telefonda sığmazsa üstten başlayıp kaydırılıyor;
    // düz `center` taşan kısmı iki uçtan da ulaşılmaz biçimde kırpardı.
    <div
      className={cn('absolute inset-0 flex flex-col overflow-y-auto px-8 [scrollbar-width:none]', className)}
      style={{
        justifyContent: 'safe center',
        gap: bosluk,
        paddingTop: `calc(${ustPay}px + var(--guvenli-ust))`,
        paddingBottom: `calc(${altPay}px + var(--guvenli-alt))`,
      }}
    >
      {children}
    </div>
  )
}

/** Alttan yükselerek gelen satır; `gecikme` ms. */
function Giris({
  gecikme = 0,
  className,
  style,
  children,
}: {
  gecikme?: number
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <div className={cn('ozet-girisi relative', className)} style={{ ...style, animationDelay: `${gecikme}ms` }}>
      {children}
    </div>
  )
}

/** Üstteki küçük, aralıklı büyük harfli etiket. */
function Ustluk({ children, renk = AMBER_SOLUK }: { children: React.ReactNode; renk?: string }) {
  return (
    <p className="whitespace-nowrap" style={{ ...yz(800, 11, 1), letterSpacing: '0.22em', color: renk }}>
      {children}
    </p>
  )
}

/** Beyaz, amber kenarlı küçük sayı kutusu. */
function Kutu({
  deger,
  etiket,
  renk = VURGU,
  kenar = AMBER,
  zemin = '#fff',
  golge = KUTU_GOLGESI,
  etiketRenk = SOLUK,
  punto = 21,
}: {
  deger: string
  etiket: string
  renk?: string
  kenar?: string
  zemin?: string
  golge?: string
  etiketRenk?: string
  punto?: number
}) {
  return (
    <div
      className="flex-1 rounded-[18px] border-2 px-2 py-3 text-center"
      style={{ background: zemin, borderColor: kenar, boxShadow: golge }}
    >
      <p className="rakam whitespace-nowrap" style={{ ...yz(900, punto, 1.1), color: renk }}>
        {deger}
      </p>
      <p className="mt-[3px] whitespace-nowrap" style={{ ...yz(800, 9.5, 1.2), letterSpacing: '0.06em', color: etiketRenk }}>
        {etiket}
      </p>
    </div>
  )
}

/** Sayfanın sağ altına oturan maskot — kutuların yanında duruyor. */
function KoseMaskotu({ poz, boyut, gecikme }: { poz: MaskotPozu; boyut: number; gecikme: number }) {
  return (
    <div
      className="ozet-pop pointer-events-none absolute right-2"
      style={{
        bottom: 'calc(54px + var(--guvenli-alt))',
        animationDelay: `${gecikme}ms`,
        filter: 'drop-shadow(0 16px 20px rgba(27,26,25,.18))',
      }}
    >
      <Rabi poz={poz} boyut={boyut} />
    </div>
  )
}

/** Yapışkan bant süsü — kapak ve kapanış. */
function Bant({ sag = false, style }: { sag?: boolean; style: React.CSSProperties }) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute h-[34px]', sag ? 'ozet-bant-sag' : 'ozet-bant')}
      style={{
        background: sag ? 'rgba(217,98,47,.16)' : 'rgba(208,155,52,.28)',
        borderLeft: `2px dashed ${sag ? 'rgba(179,73,31,.35)' : 'rgba(168,124,36,.45)'}`,
        borderRight: `2px dashed ${sag ? 'rgba(179,73,31,.35)' : 'rgba(168,124,36,.45)'}`,
        ...style,
      }}
    />
  )
}

/**
 * Dolan halka. `--halka-cevre`/`--halka-hedef` CSS değişkenleri animasyonun iki
 * ucu; çevre 2πr, hedef çevrenin dolmayan kısmı.
 */
function Halka({
  boyut,
  kalinlik,
  oran,
  renk,
  gecikme,
  children,
}: {
  boyut: number
  kalinlik: number
  oran: number
  renk: string
  gecikme: number
  children: React.ReactNode
}) {
  const yaricap = boyut / 2 - kalinlik / 2 - 1
  const cevre = 2 * Math.PI * yaricap
  const hedef = cevre * (1 - Math.min(1, Math.max(0, oran)))
  return (
    <div className="relative shrink-0" style={{ width: boyut, height: boyut }}>
      <svg width={boyut} height={boyut} viewBox={`0 0 ${boyut} ${boyut}`} className="-rotate-90" aria-hidden>
        <circle cx={boyut / 2} cy={boyut / 2} r={yaricap} fill="none" stroke="rgba(208,155,52,.3)" strokeWidth={kalinlik} />
        <circle
          cx={boyut / 2}
          cy={boyut / 2}
          r={yaricap}
          fill="none"
          stroke={renk}
          strokeWidth={kalinlik}
          strokeLinecap="round"
          strokeDasharray={cevre}
          className="ozet-halka"
          style={
            {
              '--halka-cevre': cevre,
              '--halka-hedef': hedef,
              animationDelay: `${gecikme}ms`,
            } as React.CSSProperties
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Kartlar
// ---------------------------------------------------------------------------

/**
 * Kart listesi. Kapak, kapanış her zaman; ötekiler yalnızca o ay veri varsa.
 * "Bu ay deneme yok" diyen bir sayfa, hiçbir şey söylemeyen bir sayfa.
 */
function kartlariKur(ozet: AylikOzet): Kart[] {
  const kartlar: Kart[] = [kapakKarti(ozet)]

  if (ozet.okunanKonu > 0 || ozet.calisilanGun > 0) kartlar.push(konuKarti(ozet))
  if (ozet.toplamSoru > 0) kartlar.push(soruKarti(ozet))
  if (ozet.enIyiTyt || ozet.enIyiAyt) kartlar.push(denemeKarti(ozet))
  if (ozet.pomodoroDakika > 0) kartlar.push(pomodoroKarti(ozet))
  if (ozet.oyunTur > 0) kartlar.push(oyunKarti(ozet))

  // Geri sayım: üçüncüden birinciye. Ders sayısı üçten azsa olanlar çiziliyor.
  const dersler = ozet.ilkUcDers
  // Şeritler birinciye oranlı: birinci dolu, ötekiler ona göre kısa.
  const enCok = Math.max(1, dersler[0]?.soru ?? 0)
  if (dersler[2]) kartlar.push(ucuncuDersKarti(dersler[2], dersler[2].soru / enCok))
  if (dersler[1]) kartlar.push(ikinciDersKarti(dersler[1], dersler[1].soru / enCok))
  if (dersler[0]) kartlar.push(birinciDersKarti(ozet, dersler[0]))

  kartlar.push(kapanisKarti(ozet))
  return kartlar
}

function kapakKarti(ozet: AylikOzet): Kart {
  return {
    id: 'kapak',
    icerik: () => (
      <Sayfa bosluk={0} ustPay={104} altPay={104} className="items-center text-center">
        <span
          aria-hidden
          className="ozet-isima pointer-events-none absolute left-1/2 top-[56%] size-[330px] rounded-full"
          style={{ background: 'radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,255,255,0))' }}
        />
        <Bant style={{ left: -26, top: 'calc(96px + var(--guvenli-ust))', width: 150 }} />
        <Bant sag style={{ right: -30, bottom: 'calc(150px + var(--guvenli-alt))', width: 160 }} />

        <Giris>
          <p style={{ ...yz(800, 11, 1), letterSpacing: '0.26em', color: AMBER_SOLUK }}>RABİ · AYLIK ÖZET</p>
        </Giris>
        <Giris gecikme={60}>
          {/* Manrope (`font-marka`): açılıştaki "RABİ" ile aynı gerekçe —
              tasarım bu başlığı 66 pikselde Manrope ile çizdi ve iki aile o
              boyda belirgin biçimde ayrışıyor. Üçüncü bir yerde kullanmadan
              önce AGENTS.md'deki istisnaya bak. */}
          <h1
            className="font-marka mt-1.5"
            style={{ ...yz(800, 66, 0.94), letterSpacing: '-0.045em', color: VURGU }}
          >
            {ayAdi(ozet.ay).toLocaleUpperCase('tr')}
          </h1>
        </Giris>
        <Giris gecikme={140} className="mt-3 flex items-center gap-[9px]">
          <span className="h-px w-[30px]" style={{ background: 'rgba(168,124,36,.4)' }} />
          <span className="size-[7px] rotate-45" style={{ background: AMBER }} />
          <span className="whitespace-nowrap" style={{ ...yz(800, 11.5, 1), letterSpacing: '0.13em', color: AMBER_KOYU }}>
            {ayAraligiYaz(ozet.ay).toLocaleUpperCase('tr')}
          </span>
          <span className="size-[7px] rotate-45" style={{ background: AMBER }} />
          <span className="h-px w-[30px]" style={{ background: 'rgba(168,124,36,.4)' }} />
        </Giris>

        <div className="ozet-suzul relative mt-[18px]">
          <div className="ozet-pop" style={{ animationDelay: '120ms', filter: 'drop-shadow(0 20px 24px rgba(27,26,25,.2))' }}>
            <Rabi poz="el-sallayan" durum="kutlama" boyut={230} />
          </div>
        </div>

        <Giris gecikme={220} className="mt-1.5">
          <p className="text-balance" style={{ ...yz(900, 21, 1.35), letterSpacing: '-0.02em' }}>
            {ozet.ay.gunler.length} günü senin için topladım.
            <br />
            Sayfaları çevirelim mi?
          </p>
          <span aria-hidden className="mx-auto mt-3.5 block h-1 w-24 rounded-full" style={{ background: AMBER }} />
        </Giris>
      </Sayfa>
    ),
  }
}

function konuKarti(ozet: AylikOzet): Kart {
  return {
    id: 'konu',
    icerik: (oran) => (
      <Sayfa bosluk={18}>
        <Giris>
          <Ustluk>KONU HARİTASINDA</Ustluk>
        </Giris>
        <Giris gecikme={60} className="flex items-end gap-2.5">
          <span className="rakam" style={{ ...yz(900, 112, 0.82), letterSpacing: '-0.05em', color: VURGU }}>
            {Math.round(ozet.okunanKonu * oran)}
          </span>
          <span className="mb-3" style={{ ...yz(900, 20, 1), color: AMBER_KOYU }}>
            konu
          </span>
        </Giris>
        <Giris gecikme={160}>
          <p className="max-w-[280px] text-pretty" style={{ ...yz(700, 17, 1.5), color: GOVDE }}>
            Bu ay baştan sona okuyup bitirdiğin konu sayısı.
          </p>
        </Giris>
        <Giris gecikme={240} className="flex gap-[9px]">
          <Kutu deger={String(ozet.calisilanGun)} etiket="GÜN ÇALIŞTIN" />
          <Kutu deger={String(ozet.enUzunSeri)} etiket="SERİ" />
          <Kutu deger={sureKisa(ozet.toplamDakika)} etiket="GEÇEN SÜRE" />
        </Giris>
        <KoseMaskotu poz="okuyan" boyut={150} gecikme={200} />
      </Sayfa>
    ),
  }
}

function soruKarti(ozet: AylikOzet): Kart {
  const enYuksek = Math.max(1, ...ozet.haftalar.map((h) => h.soru))
  // Zirve haftası dolu turuncu, ötekiler kâğıdın kendi amber tonunda:
  // beyaz kart, kâğıt işlemesini kesip ekranın ortasına ikinci bir yüzey
  // koyuyordu. Eşitlikte **ilk** zirve.
  const zirve = ozet.haftalar.findIndex((h) => h.soru === enYuksek)

  return {
    id: 'soru',
    icerik: (oran) => (
      <Sayfa bosluk={20}>
        <Giris>
          <p className="whitespace-nowrap" style={{ ...yz(800, 10.5, 1), letterSpacing: '0.18em', color: AMBER_SOLUK }}>
            TOPLAM ÇÖZÜLEN SORU
          </p>
        </Giris>
        <Giris gecikme={60}>
          <span className="rakam" style={{ ...yz(900, 96, 0.86), letterSpacing: '-0.05em' }}>
            {tamYaz(ozet.toplamSoru * oran)}
          </span>
        </Giris>
        <Giris gecikme={230}>
          <p className="pb-2.5 whitespace-nowrap" style={{ ...yz(800, 10.5, 1), letterSpacing: '0.18em', color: AMBER_SOLUK }}>
            HAFTA HAFTA
          </p>
          <div className="flex h-[146px] items-end gap-3 border-b-2" style={{ borderColor: 'rgba(168,124,36,.35)' }}>
            {ozet.haftalar.map((h, n) => {
              const zirveMi = n === zirve
              return (
                <div key={h.baslangic} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="rakam whitespace-nowrap" style={{ ...yz(900, 13, 1), color: zirveMi ? VURGU : AMBER_SOLUK }}>
                    {tamYaz(h.soru)}
                  </span>
                  <span
                    className="ozet-bar w-full rounded-t-[10px]"
                    style={{
                      height: `${Math.max(2, Math.round((h.soru / enYuksek) * 100))}%`,
                      background: zirveMi ? VURGU_PARLAK : 'rgba(208,155,52,.32)',
                      boxShadow: zirveMi ? '0 8px 18px -8px rgba(179,73,31,.6)' : 'none',
                      animationDelay: `${240 + n * 90}ms`,
                    }}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex gap-3 pt-[9px]">
            {ozet.haftalar.map((h) => (
              <span key={h.baslangic} className="flex-1 text-center whitespace-nowrap" style={{ ...yz(800, 9.5, 1), letterSpacing: '0.02em', color: AMBER_KOYU }}>
                {h.ad}
              </span>
            ))}
          </div>
        </Giris>
      </Sayfa>
    ),
  }
}

function denemeKarti(ozet: AylikOzet): Kart {
  const cumle = denemeCumlesi(ozet)
  return {
    id: 'deneme',
    icerik: () => (
      <Sayfa bosluk={22} className="px-[30px]" altPay={92}>
        <Giris>
          <Ustluk>AYIN EN İYİ DENEMELERİ</Ustluk>
        </Giris>
        <Giris gecikme={60}>
          <h2 style={{ ...yz(900, 32, 1.12), letterSpacing: '-0.03em' }}>
            Rekorların
            <br />
            burada.
          </h2>
        </Giris>
        <Giris gecikme={140} className="flex gap-3.5">
          {ozet.enIyiTyt && <NetKarti tur="TYT" neti={ozet.enIyiTyt} renk={VURGU_PARLAK} gecikme={200} tek={!ozet.enIyiAyt} />}
          {ozet.enIyiAyt && <NetKarti tur="AYT" neti={ozet.enIyiAyt} renk={AMBER_KOYU} gecikme={320} tek={!ozet.enIyiTyt} />}
        </Giris>
        <Giris gecikme={240} className="flex items-center gap-3.5">
          <div className="shrink-0" style={{ filter: 'drop-shadow(0 14px 18px rgba(27,26,25,.18))' }}>
            <Rabi poz="kupali" durum="kutlama" boyut={110} />
          </div>
          <p className="text-pretty" style={yz(800, 16, 1.45)}>{cumle}</p>
        </Giris>
      </Sayfa>
    ),
  }
}

function NetKarti({
  tur,
  neti,
  renk,
  gecikme,
  tek,
}: {
  tur: string
  neti: DenemeNeti
  renk: string
  gecikme: number
  tek: boolean
}) {
  return (
    <div
      className={cn('flex flex-1 flex-col items-center gap-2.5 rounded-[22px] border-2 px-3 py-[18px]', tek && 'mx-auto max-w-[220px]')}
      style={{ background: AMBER_ZEMIN, borderColor: AMBER, boxShadow: '0 6px 18px -8px rgba(141,105,26,.45)' }}
    >
      <Halka boyut={118} kalinlik={11} oran={neti.toplamSoru > 0 ? neti.net / neti.toplamSoru : 0} renk={renk} gecikme={gecikme}>
        <p className="rakam whitespace-nowrap" style={{ ...yz(900, 28, 1), letterSpacing: '-0.03em', color: VURGU }}>
          {netYaz(neti.net)}
        </p>
        <p className="mt-1 whitespace-nowrap" style={{ ...yz(800, 9, 1), letterSpacing: '0.14em', color: AMBER_KOYU }}>
          / {neti.toplamSoru} NET
        </p>
      </Halka>
      <p className="whitespace-nowrap" style={{ ...yz(900, 12, 1), letterSpacing: '0.14em', color: AMBER_KOYU }}>
        {tur}
      </p>
      <p className="whitespace-nowrap" style={{ ...yz(800, 11, 1), color: SOLUK }}>
        {gunAyYaz(neti.tarih)}
      </p>
    </div>
  )
}

function pomodoroKarti(ozet: AylikOzet): Kart {
  return {
    id: 'pomodoro',
    icerik: (oran) => (
      <Sayfa bosluk={16} ustPay={92} altPay={92}>
        <Giris>
          <p className="whitespace-nowrap" style={{ ...yz(800, 10.5, 1), letterSpacing: '0.17em', color: AMBER_SOLUK }}>
            POMODORO&apos;DA GEÇEN SÜRE
          </p>
        </Giris>
        <Giris gecikme={60}>
          {/* Taşıyıcı sayı tek satır: "48sa 20dk" bölünürse vurgu dağılıyor. */}
          <p className="rakam whitespace-nowrap" style={{ ...yz(900, 66, 0.9), letterSpacing: '-0.05em', color: VURGU }}>
            {dakikaKisa(ozet.pomodoroDakika * oran)}
          </p>
        </Giris>
        <Giris gecikme={160} className="flex items-center gap-4">
          <Halka boyut={104} kalinlik={9} oran={ozet.pomodoroOrani} renk={VURGU_PARLAK} gecikme={220}>
            <p className="rakam whitespace-nowrap" style={yz(900, 20, 1)}>
              {yuzdeKisa(ozet.pomodoroOrani)}
            </p>
            <p className="mt-[3px]" style={{ ...yz(800, 8.5, 1), letterSpacing: '0.12em', color: AMBER_KOYU }}>
              AYIN
            </p>
          </Halka>
          <p className="flex-1" style={{ ...yz(800, 16, 1.4), color: GOVDE }}>
            Ayın <b style={{ color: VURGU }}>{ondalikYuzdeYaz(ozet.pomodoroOrani)}</b> masadaydı.
          </p>
        </Giris>
        <Giris gecikme={280} className="flex gap-2.5">
          <Kutu deger={String(ozet.pomodoroSeans)} etiket="SEANS" renk={MUREKKEP} punto={24} />
          <Kutu deger={dakikaKisa(ozet.enUzunGunDakika)} etiket="EN UZUN GÜN" renk={MUREKKEP} punto={22} />
          <Kutu deger={String(ozet.pomodoroSeri)} etiket="GÜN SERİ" renk={YESIL} punto={24} />
        </Giris>
        <KoseMaskotu poz="kahveli" boyut={150} gecikme={320} />
      </Sayfa>
    ),
  }
}

function oyunKarti(ozet: AylikOzet): Kart {
  const enCok = Math.max(1, ...ozet.enCokOynananlar.map((o) => o.soru))
  // Şerit renkleri sırayla: oyunun kendi ders rengi değil, listenin ritmi.
  const SERIT_RENKLERI = ['#b4523c', '#6b5ca5', '#4a7a52', '#a87c24']
  return {
    id: 'oyun',
    icerik: (oran) => (
      <Sayfa bosluk={18}>
        <Giris>
          <Ustluk>MİNİ OYUNLARDA</Ustluk>
        </Giris>
        <Giris gecikme={60} className="flex items-end gap-2.5">
          <span className="rakam" style={{ ...yz(900, 104, 0.84), letterSpacing: '-0.05em', color: VURGU }}>
            {tamYaz(ozet.oyunSoru * oran)}
          </span>
          <span className="mb-3" style={{ ...yz(900, 20, 1), color: AMBER_KOYU }}>
            soru
          </span>
        </Giris>
        <Giris gecikme={150} className="flex gap-2.5">
          <Kutu deger={String(ozet.oyunTur)} etiket="TOPLAM TUR" punto={23} />
          <Kutu deger={sureKisa(ozet.oyunDakika)} etiket="GEÇEN SÜRE" punto={23} />
        </Giris>
        <Giris gecikme={240} className="flex flex-col gap-[11px]">
          <p className="whitespace-nowrap" style={{ ...yz(800, 10.5, 1), letterSpacing: '0.18em', color: AMBER_SOLUK }}>
            EN ÇOK OYNADIĞIN OYUNLAR
          </p>
          {ozet.enCokOynananlar.map((o, n) => (
            <div key={o.oyun} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate" style={yz(800, 13.5, 1.2)}>{oyunBul(o.oyun).ad}</span>
                <span className="rakam shrink-0" style={{ ...yz(900, 12.5, 1), color: AMBER_KOYU }}>
                  {tamYaz(o.soru)} soru
                </span>
              </div>
              <span className="block h-[9px] overflow-hidden rounded-full" style={{ background: 'rgba(208,155,52,.28)' }}>
                <span
                  className="ozet-serit block h-full rounded-full"
                  style={{
                    width: `${Math.round((o.soru / enCok) * 100)}%`,
                    background: SERIT_RENKLERI[n % SERIT_RENKLERI.length],
                    animationDelay: `${320 + n * 90}ms`,
                  }}
                />
              </span>
            </div>
          ))}
        </Giris>
        {/* Maskot yalnızca listede yer kalınca: dört satırlık listede sağ alta
            konan tavşan son şeridin üstüne biniyordu. */}
        {ozet.enCokOynananlar.length <= 2 && <KoseMaskotu poz="ziplayan" boyut={140} gecikme={300} />}
      </Sayfa>
    ),
  }
}

/** Ders kartlarının ortak gövdesi: numara, ad, pay şeridi, iki + üç kutu. */
function DersGovdesi({
  sira,
  ders,
  pay,
  ton,
  gecikme = 0,
  children,
}: {
  sira: number
  ders: DersToplami
  /** Şeridin doluluğu: dersin sorusu / birincinin sorusu. Birincide 1. */
  pay: number
  ton: {
    numara: string
    ad: string
    alt: string
    seritZemin: string
    serit: string
    kutuZemin: string
    kutuKenar: string
    kutuGolge: string
    deger: string
    altDeger: string
    etiket: string
    altEtiket: string
  }
  gecikme?: number
  children?: React.ReactNode
}) {
  const numaraPunto = { 3: 104, 2: 132, 1: 150 }[sira] ?? 104
  const adPunto = { 3: 34, 2: 42, 1: 46 }[sira] ?? 34
  return (
    <>
      <Giris gecikme={gecikme + 80} className="flex items-center gap-4">
        <span className="rakam" style={{ ...yz(900, numaraPunto, 0.78), letterSpacing: '-0.07em', color: ton.numara }}>
          {sira}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate" style={{ ...yz(900, adPunto, 1.02), letterSpacing: '-0.035em', color: ton.ad }}>
            {ders.ders}
          </p>
          <p className="rakam mt-2" style={{ ...yz(800, 14, 1.2), color: ton.alt }}>
            {children ?? `${tamYaz(ders.soru)} soru · toplamın ${yuzdeYaz(ders.oran)}`}
          </p>
        </div>
      </Giris>
      <Giris gecikme={gecikme + 200} className="h-4 overflow-hidden rounded-full" style={{ background: ton.seritZemin }}>
        <span
          className="ozet-serit block h-full rounded-full"
          style={{
            width: `${Math.max(6, Math.round(pay * 100))}%`,
            background: ton.serit,
            animationDelay: `${gecikme + 280}ms`,
          }}
        />
      </Giris>
      <Giris gecikme={gecikme + 300} className="mt-1.5 flex gap-2.5">
        <Kutu
          deger={ders.basari === null ? '—' : `%${Math.round(ders.basari * 100)}`}
          etiket="BAŞARI"
          renk={ton.deger}
          kenar={ton.kutuKenar}
          zemin={ton.kutuZemin}
          golge={ton.kutuGolge}
          etiketRenk={ton.etiket}
          punto={22}
        />
        <Kutu
          deger={String(ders.gunSayisi)}
          etiket="GÜN ÇALIŞTIN"
          renk={ton.deger}
          kenar={ton.kutuKenar}
          zemin={ton.kutuZemin}
          golge={ton.kutuGolge}
          etiketRenk={ton.etiket}
          punto={22}
        />
      </Giris>
      <Giris gecikme={gecikme + 380} className="mt-0.5 flex gap-[9px]">
        {[
          [ders.dogru, 'DOĞRU'],
          [ders.yanlis, 'YANLIŞ'],
          [ders.bos, 'BOŞ'],
        ].map(([deger, etiket]) => (
          <Kutu
            key={etiket}
            deger={tamYaz(Number(deger))}
            etiket={String(etiket)}
            renk={ton.altDeger}
            kenar={ton.kutuKenar}
            zemin={ton.kutuZemin}
            golge={ton.kutuGolge}
            etiketRenk={ton.altEtiket}
          />
        ))}
      </Giris>
    </>
  )
}

const UCUNCU_TONU = {
  numara: 'rgba(168,124,36,.3)',
  ad: MUREKKEP,
  alt: AMBER_KOYU,
  seritZemin: AMBER_CIZGI,
  serit: AMBER_KOYU,
  kutuZemin: AMBER_ZEMIN,
  kutuKenar: AMBER,
  kutuGolge: KUTU_GOLGESI,
  deger: AMBER_KOYU,
  altDeger: AMBER_KOYU,
  etiket: SOLUK,
  altEtiket: SOLUK,
}

const IKINCI_TONU = {
  numara: IKINCI_ACIK,
  ad: IKINCI,
  alt: IKINCI,
  seritZemin: 'rgba(208,155,52,.28)',
  serit: IKINCI,
  kutuZemin: AMBER_ZEMIN,
  kutuKenar: IKINCI_ACIK,
  kutuGolge: '0 4px 14px -6px rgba(74,87,137,.4)',
  deger: IKINCI,
  altDeger: IKINCI,
  etiket: SOLUK,
  altEtiket: SOLUK,
}

const BIRINCI_TONU = {
  numara: ALTIN,
  ad: '#fff',
  alt: ALTIN_ACIK,
  seritZemin: 'rgba(0,0,0,.25)',
  serit: `linear-gradient(90deg,${ALTIN},${ALTIN_ACIK})`,
  kutuZemin: 'rgba(255,255,255,.12)',
  kutuKenar: ALTIN,
  kutuGolge: '0 4px 16px -6px rgba(0,0,0,.45)',
  deger: ALTIN,
  altDeger: '#fff',
  etiket: 'rgba(255,255,255,.8)',
  altEtiket: 'rgba(255,255,255,.75)',
}

function ucuncuDersKarti(ders: DersToplami, pay: number): Kart {
  return {
    id: 'ders-3',
    ses: () => geriSayimSesi(3),
    icerik: () => (
      <Sayfa bosluk={16} ustPay={100}>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[200px]"
          style={{ background: `linear-gradient(${AMBER_ZEMIN},rgba(247,240,220,0))` }}
        />
        <Giris>
          <Ustluk>EN ÇOK SORU ÇÖZDÜĞÜN DERSLER</Ustluk>
        </Giris>
        <DersGovdesi sira={3} ders={ders} pay={pay} ton={UCUNCU_TONU} />
      </Sayfa>
    ),
  }
}

function ikinciDersKarti(ders: DersToplami, pay: number): Kart {
  return {
    id: 'ders-2',
    ses: () => geriSayimSesi(2),
    icerik: () => (
      <Sayfa bosluk={16}>
        <Giris>
          <Ustluk>İKİNCİ SIRADA</Ustluk>
        </Giris>
        <DersGovdesi sira={2} ders={ders} pay={pay} ton={IKINCI_TONU} />
        <KoseMaskotu poz="dusunen" boyut={112} gecikme={420} />
      </Sayfa>
    ),
  }
}

function birinciDersKarti(ozet: AylikOzet, ders: DersToplami): Kart {
  const konfeti = Array.from({ length: 14 }, (_, n) => ({
    sol: `${6 + ((n * 37) % 88)}%`,
    renk: [ALTIN, ALTIN_ACIK, '#fff4e1', VURGU_PARLAK][n % 4],
    gecikme: n * 150,
  }))
  return {
    id: 'ders-1',
    koyu: true,
    ses: zaferSesi,
    icerik: (oran) => (
      <>
        {/* Işınlar ve konfeti içerik sütununun arkasında. */}
        <span
          aria-hidden
          className="ozet-isin pointer-events-none absolute left-1/2 top-[40%] size-[760px]"
          style={{
            background: 'repeating-conic-gradient(from 0deg,rgba(240,190,72,.16) 0deg 7deg,transparent 7deg 20deg)',
          }}
        />
        {konfeti.map((k, n) => (
          <span
            key={n}
            aria-hidden
            className="ozet-konfeti pointer-events-none absolute -top-[30px] h-3.5 w-[9px] rounded-sm"
            style={{ left: k.sol, background: k.renk, animationDelay: `${k.gecikme}ms` }}
          />
        ))}

        <Sayfa bosluk={12} ustPay={112} altPay={72}>
          <Giris className="mb-[30px]">
            <Ustluk renk={ALTIN}>AYIN DERSİ</Ustluk>
          </Giris>

          <div className="ozet-suzul relative flex justify-center">
            <span
              aria-hidden
              className="absolute left-1/2 top-[52%] size-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: 'radial-gradient(closest-side,rgba(240,190,72,.4),rgba(240,190,72,0))' }}
            />
            <div className="ozet-pop relative" style={{ animationDelay: '200ms', filter: 'drop-shadow(0 18px 22px rgba(0,0,0,.35))' }}>
              <Rabi poz="kupali" durum="kutlama" boyut={150} />
            </div>
          </div>

          <DersGovdesi sira={1} ders={ders} pay={1} ton={BIRINCI_TONU}>
            {tamYaz(ders.soru * oran)} soru · toplamın {yuzdeYaz(ders.oran)}
          </DersGovdesi>

          {/* Damga: ayın adıyla "ŞAMPİYONU". Yeri köşede, maskotun yanında. */}
          <div
            className="ozet-damga absolute left-8 rounded-[10px] px-4 py-[9px]"
            style={{
              top: 'calc(132px + var(--guvenli-ust))',
              background: ALTIN,
              boxShadow: '0 10px 24px -8px rgba(0,0,0,.45)',
            }}
          >
            <span className="block whitespace-nowrap" style={{ ...yz(900, 12.5, 1), letterSpacing: '0.14em', color: KOYU_KAHVE }}>
              {ayAdi(ozet.ay).toLocaleUpperCase('tr')} ŞAMPİYONU
            </span>
          </div>
        </Sayfa>
      </>
    ),
  }
}

function kapanisKarti(ozet: AylikOzet): Kart {
  const kutular = kapanisKutulari(ozet)
  const sonrakiAy = ayDe(Number(ayKaydir(ozet.ay.anahtar, 1).slice(5)))
  return {
    id: 'kapanis',
    sonMu: true,
    ses: kapanisSesi,
    icerik: () => (
      <Sayfa bosluk={16} ustPay={92} altPay={110} className="px-[30px]">
        <Bant style={{ left: -30, top: 'calc(104px + var(--guvenli-ust))', width: 170, height: 32 }} />
        <Giris>
          <Ustluk>{ayAdi(ozet.ay).toLocaleUpperCase('tr')} · TEK SAYFADA</Ustluk>
        </Giris>
        <Giris gecikme={60}>
          <h2 style={{ ...yz(900, 31, 1.12), letterSpacing: '-0.03em' }}>
            Sayfayı kapatırken
            <br />
            hepsi burada.
          </h2>
        </Giris>
        <Giris gecikme={140} className="grid grid-cols-2 gap-2.5">
          {kutular.map((k, n) => (
            <div
              key={k.etiket}
              // Tek kalan kutu satırı tek başına doldursun; yarım satır
              // "bir şey eksik" gibi duruyordu.
              className={cn('rounded-[18px] border-2 bg-white p-3.5 text-center', n === kutular.length - 1 && kutular.length % 2 === 1 && 'col-span-2')}
              style={{ borderColor: AMBER, boxShadow: KUTU_GOLGESI }}
            >
              <p className="rakam whitespace-nowrap" style={{ ...yz(900, 23, 1.1), letterSpacing: '-0.02em', color: k.renk }}>
                {k.deger}
              </p>
              <p className="mt-1" style={{ ...yz(800, 10, 1.3), letterSpacing: '0.09em', color: SOLUK }}>
                {k.etiket}
              </p>
            </div>
          ))}
        </Giris>
        <Giris
          gecikme={240}
          className="flex items-center gap-3.5 rounded-[22px] border px-4 py-3.5"
          style={{ background: AMBER_ZEMIN, borderColor: AMBER_CIZGI }}
        >
          <div className="shrink-0" style={{ filter: 'drop-shadow(0 12px 14px rgba(27,26,25,.16))' }}>
            <Rabi poz="sevinen" durum="mutlu" boyut={96} />
          </div>
          <p className="text-pretty" style={yz(800, 15, 1.45)}>
            {ozet.sonrakiAyHedefi > 0 ? (
              <>
                {sonrakiAy} hedef net: <b style={{ color: VURGU }}>{tamYaz(ozet.sonrakiAyHedefi)} soru</b>. Yarın yine buradayım.
              </>
            ) : (
              <>{sonrakiAy} de buradayım. Sayfaları yine birlikte çevirelim.</>
            )}
          </p>
        </Giris>
      </Sayfa>
    ),
  }
}

/** Kapanıştaki kutular — yalnızca o ay veri olanlar. */
function kapanisKutulari(ozet: AylikOzet): { deger: string; etiket: string; renk: string }[] {
  const kutular: { deger: string; etiket: string; renk: string }[] = []
  if (ozet.okunanKonu > 0) kutular.push({ deger: tamYaz(ozet.okunanKonu), etiket: 'OKUNAN KONU', renk: VURGU })
  if (ozet.toplamSoru > 0) kutular.push({ deger: tamYaz(ozet.toplamSoru), etiket: 'ÇÖZÜLEN SORU', renk: VURGU })
  if (ozet.enIyiTyt) kutular.push({ deger: netYaz(ozet.enIyiTyt.net), etiket: 'EN YÜKSEK TYT NETİ', renk: YESIL })
  if (ozet.enIyiAyt) kutular.push({ deger: netYaz(ozet.enIyiAyt.net), etiket: 'EN YÜKSEK AYT NETİ', renk: YESIL })
  if (ozet.pomodoroDakika > 0) kutular.push({ deger: dakikaKisa(ozet.pomodoroDakika), etiket: 'POMODORO SÜRESİ', renk: AMBER_KOYU })
  if (ozet.oyunSoru > 0) kutular.push({ deger: tamYaz(ozet.oyunSoru), etiket: 'MİNİ OYUN SORUSU', renk: AMBER_KOYU })
  return kutular
}

// ---------------------------------------------------------------------------
// Cümleler ve küçük yazımlar
// ---------------------------------------------------------------------------

/**
 * Deneme kartının altındaki cümle. Rekorların ayın hangi yarısında geldiğine
 * bakıyor: ikisi de son yarıda gelmişse yükseliş, ilk yarıdaysa hatırlatma.
 */
function denemeCumlesi(ozet: AylikOzet): string {
  const rekorlar = [ozet.enIyiTyt, ozet.enIyiAyt].filter((n): n is DenemeNeti => n !== null)
  const yari = Math.ceil(ozet.ay.gunler.length / 2)
  const sonYarida = rekorlar.filter((n) => Number(n.tarih.slice(8)) > yari).length

  if (rekorlar.length === 2) {
    if (sonYarida === 2) return 'İkisi de ayın son yarısında geldi — yükseliş sürüyor.'
    if (sonYarida === 0) return 'İkisi de ayın ilk yarısından. Bu ay o çizgiyi geçmeye bakalım.'
    return 'Biri ilk yarıdan, biri sondan — çizgi yukarı bakıyor.'
  }
  const tek = rekorlar[0]
  const tur = ozet.enIyiTyt ? 'TYT' : 'AYT'
  if (ozet.denemeSayisi === 1) return `Bu ay tek ${tur} denemesi vardı; rekor çizgisi buradan başlıyor.`
  return sonYarida === 1
    ? `En iyi ${tur} netin ${gunAyYaz(tek.tarih)}'de geldi — ayın son yarısında.`
    : `En iyi ${tur} netin ${gunAyYaz(tek.tarih)}'de geldi. ${ozet.denemeSayisi} denemenin en iyisi.`
}

/** Kutulara sığan süre: saatin altındaysa dakika, üstündeyse "31sa". */
function sureKisa(dakika: number): string {
  if (dakika < 60) return `${Math.round(dakika)}dk`
  const saat = dakika / 60
  return saat >= 10 ? `${Math.round(saat)}sa` : dakikaKisa(dakika)
}

/** Halkanın içindeki yüzde: "%6,7" — eksiz. */
function yuzdeKisa(oran: number): string {
  const yuzde = Math.round(oran * 1000) / 10
  return `%${yuzde.toFixed(yuzde % 1 === 0 ? 0 : 1).replace('.', ',')}`
}
