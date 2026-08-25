'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { saatiKirp } from '@/lib/hatirlatma'

/* ===========================================================================
   Dik çubuk — sayı seçici
   =========================================================================== */

/**
 * Yukarı aşağı sürüklenen dik çubuk.
 *
 * Günlük soru hedefi önce çip listesiydi (100 · 200 · 300 · 400 · 500) ve
 * yanında "kendin yaz" kutusu vardı: beş sabit sayının dışında bir hedef
 * isteyen herkes klavye açıp rakam yazmak zorundaydı. Çubuk hem aradaki
 * değerleri hem de "az mı çok mu" hissini tek harekette veriyor.
 *
 * Sürükleme `pointer` olaylarıyla: `touch` ve `mouse` ayrı ayrı yazılsaydı iki
 * kod yolu olurdu, WebView ikisini de pointer olarak veriyor. `touch-none`
 * şart — yoksa parmak çubuğu sürüklerken sayfa da kayıyor.
 */
export function DikCubuk({
  deger,
  onDegis,
  enAz,
  enCok,
  adim,
  birim,
  etiket,
  className,
}: {
  deger: number
  onDegis: (yeni: number) => void
  enAz: number
  enCok: number
  /** Kaçar kaçar artacağı. Sürükleme bu basamağa yuvarlanır. */
  adim: number
  /** Sayının altında yazan birim ("soru" gibi). */
  birim: string
  /** Ekran okuyucuya söylenen ad. */
  etiket: string
  className?: string
}) {
  const rayRef = useRef<HTMLDivElement>(null)
  const [suruklenen, setSuruklenen] = useState(false)

  const oran = (deger - enAz) / (enCok - enAz)

  /** Parmağın dikey konumunu değere çevirir; çubuk aşağıdan yukarı dolar. */
  const konumdanDeger = useCallback(
    (y: number) => {
      const ray = rayRef.current
      if (!ray) return deger
      const kutu = ray.getBoundingClientRect()
      const ham = 1 - (y - kutu.top) / kutu.height
      const sinirli = Math.min(1, Math.max(0, ham))
      const basamak = Math.round((sinirli * (enCok - enAz)) / adim) * adim
      return enAz + basamak
    },
    [adim, deger, enAz, enCok],
  )

  const surukle = (e: React.PointerEvent<HTMLDivElement>) => {
    const yeni = konumdanDeger(e.clientY)
    if (yeni !== deger) onDegis(yeni)
  }

  const tusla = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const yon =
      e.key === 'ArrowUp' || e.key === 'ArrowRight'
        ? 1
        : e.key === 'ArrowDown' || e.key === 'ArrowLeft'
          ? -1
          : 0
    if (yon !== 0) {
      e.preventDefault()
      onDegis(Math.min(enCok, Math.max(enAz, deger + yon * adim)))
      return
    }
    if (e.key === 'Home') {
      e.preventDefault()
      onDegis(enAz)
    }
    if (e.key === 'End') {
      e.preventDefault()
      onDegis(enCok)
    }
  }

  /*
    Yanda yazan basamaklar. Hepsi yazılsaydı (elli'şer on satır) rakamlar üst
    üste binerdi; ikide bir atlanıyor. Sayma **tepeden** başlıyor: aşağıdan
    başlayınca en üstteki iki etiket (450 ve 500) tek basamak arayla yan yana
    düşüp çakışıyordu. En alttaki değer ayrıca ekleniyor — çubuğun nerede
    başladığı okunabilmeli.
  */
  const basamaklar: number[] = []
  for (let d = enAz; d <= enCok; d += adim) basamaklar.push(d)
  const sonSira = basamaklar.length - 1
  const yazilanlar = basamaklar.filter(
    (d, sira) => (sonSira - sira) % 2 === 0 || d === enAz,
  )

  return (
    <div className={className}>
      {/* Alt boşluk 16px: etiket sütununun en üstteki yazısı kendi yarısı
          kadar yukarı taşıyor, daha dar bir boşlukta sayının üstüne biniyordu. */}
      <p className="mb-4">
        <span className="rakam font-display text-[44px] leading-none font-extrabold text-primary">
          {deger}
        </span>
        <span className="ml-1.5 text-sm font-extrabold text-muted-foreground">{birim}</span>
      </p>

      <div className="flex items-stretch gap-3">
        <div
          ref={rayRef}
          role="slider"
          tabIndex={0}
          aria-label={etiket}
          aria-valuemin={enAz}
          aria-valuemax={enCok}
          aria-valuenow={deger}
          aria-valuetext={`${deger} ${birim}`}
          onKeyDown={tusla}
          onPointerDown={(e) => {
            // Yakalama şart: parmak çubuğun dışına taşsa bile olaylar buraya
            // gelmeye devam etsin, sürükleme yarıda kesilmesin.
            e.currentTarget.setPointerCapture(e.pointerId)
            setSuruklenen(true)
            surukle(e)
          }}
          onPointerMove={(e) => {
            if (suruklenen) surukle(e)
          }}
          onPointerUp={() => setSuruklenen(false)}
          onPointerCancel={() => setSuruklenen(false)}
          className={cn(
            'relative h-[240px] w-[76px] shrink-0 touch-none overflow-hidden rounded-[26px] bg-muted',
            'transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            suruklenen && 'ring-2 ring-primary ring-offset-2 ring-offset-card',
          )}
        >
          {/* Dolu kısım aşağıdan yukarı. Sürüklenirken geçiş kapalı: animasyon
              parmağın arkasında kalıp çubuk takılıyormuş gibi duruyordu. */}
          <div
            className={cn(
              'absolute inset-x-0 bottom-0 rounded-[26px] bg-primary-parlak',
              !suruklenen && 'transition-[height] duration-150',
            )}
            style={{ height: `${Math.max(7, oran * 100)}%` }}
            aria-hidden
          />

          {/* Tutamak: dolu kısmın tepesinde duran beyaz çizgi. Çubuğun nereden
              tutulacağı yazıyla değil biçimle söyleniyor. */}
          <div
            className={cn(
              'absolute inset-x-3 h-1.5 -translate-y-1/2 rounded-full bg-white/85',
              !suruklenen && 'transition-[bottom] duration-150',
            )}
            style={{ bottom: `calc(${Math.max(7, oran * 100)}% - 3px)` }}
            aria-hidden
          />
        </div>

        {/*
          Basamak etiketleri çubukla **aynı boyda** bir sütunda ve her biri
          kendi değerinin hizasına konuyor. Eşit aralıklı bir liste olarak
          dizildiklerinde tutamağın hizasını tutmuyor, çubuk yanlış değeri
          gösteriyormuş gibi duruyordu.
        */}
        <ul className="relative h-[240px] flex-1" aria-hidden>
          {yazilanlar.map((d) => (
            <li
              key={d}
              className="rakam absolute inset-x-0 flex -translate-y-1/2 items-center gap-2 text-[11px] font-bold"
              style={{ bottom: `${((d - enAz) / (enCok - enAz)) * 100}%` }}
            >
              <span
                className={cn('h-px w-3', d === deger ? 'bg-primary' : 'bg-border')}
                aria-hidden
              />
              <span className={d === deger ? 'text-primary' : 'text-muted-foreground/70'}>{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ===========================================================================
   Saat seçici
   =========================================================================== */

/** Dakika basamağı: beşer beşer. Bildirim için dakika hassasiyeti bu kadarı yeter. */
const DAKIKA_ADIMI = 5
const SATIR = 44
/** Görünen satır sayısı; ortadaki seçili olan. Tek sayı olmak zorunda. */
const GORUNEN = 5

const SAATLER = Array.from({ length: 24 }, (_, s) => s)
const DAKIKALAR = Array.from({ length: 60 / DAKIKA_ADIMI }, (_, d) => d * DAKIKA_ADIMI)

/**
 * Saat seçici — iki tekerlek.
 *
 * Yerini aldığı `<input type="time">` Android WebView'da sistemin kendi
 * seçicisini açıyordu: telefon İngilizceyse 12 saatlik AM/PM düzeninde
 * geliyor, uygulamanın her yerinde 24 saatlik "20.00" biçimi kullanılırken
 * kutuda "08:00 PM" yazıyordu. Kutunun kendisi de tema renklerini almıyordu.
 *
 * Tekerlekler sürükleme koduyla değil, tarayıcının kendi kaydırmasıyla
 * çalışıyor (`scroll-snap`): ivme, sınırda yaylanma ve dokunma hassasiyeti
 * elle yazılsa asla bu kadar doğal olmazdı.
 */
export function SaatSecici({
  saat,
  dakika,
  onDegis,
  className,
}: {
  saat: number
  dakika: number
  onDegis: (secim: { saat: number; dakika: number }) => void
  className?: string
}) {
  // Kayıtlı dakika beşin katı değilse (eski kurulumlar, elle yazılmış saat)
  // en yakın basamağa yuvarlanıyor; yoksa tekerlek hiçbir satıra oturmuyor.
  const dakikaBasamagi = Math.min(55, Math.round(dakika / DAKIKA_ADIMI) * DAKIKA_ADIMI)

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card',
        className,
      )}
      role="group"
      aria-label="Hatırlatma saati"
    >
      {/* Ortadaki seçim bandı. Tekerleklerin altında duruyor ki rakamlar
          üstünde okunsun. */}
      <div
        className="pointer-events-none absolute inset-x-2 top-1/2 h-11 -translate-y-1/2 rounded-xl bg-primary-soft"
        aria-hidden
      />

      <div className="relative flex items-stretch justify-center">
        <Tekerlek
          etiket="Saat"
          secenekler={SAATLER}
          deger={saatiKirp(saat)}
          onSec={(yeni) => onDegis({ saat: yeni, dakika: dakikaBasamagi })}
        />
        <span
          className="rakam grid w-4 shrink-0 place-items-center font-display text-lg font-extrabold text-primary"
          aria-hidden
        >
          .
        </span>
        <Tekerlek
          etiket="Dakika"
          secenekler={DAKIKALAR}
          deger={dakikaBasamagi}
          onSec={(yeni) => onDegis({ saat: saatiKirp(saat), dakika: yeni })}
        />
      </div>
    </div>
  )
}

function Tekerlek({
  etiket,
  secenekler,
  deger,
  onSec,
}: {
  etiket: string
  secenekler: number[]
  deger: number
  onSec: (yeni: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const zamanlayici = useRef<ReturnType<typeof setTimeout> | null>(null)
  const kimlik = useId()

  const sira = Math.max(0, secenekler.indexOf(deger))
  const bosluk = ((GORUNEN - 1) / 2) * SATIR

  // Değer dışarıdan değiştiğinde (çip'e dokunmak, geri gelmek) tekerlek de
  // oraya gitmeli. Kullanıcı kaydırırken zaten doğru yerde olduğu için bu
  // etki bir şey yapmıyor.
  useEffect(() => {
    const kutu = ref.current
    if (!kutu) return
    const hedef = sira * SATIR
    if (Math.abs(kutu.scrollTop - hedef) > 2) kutu.scrollTo({ top: hedef })
  }, [sira])

  /**
   * Kaydırma durunca hangi satırda kalındığını okur.
   *
   * `scrollend` olayı WebView'ın her sürümünde yok; kaydırma sustuktan 120 ms
   * sonra okuyan bir zamanlayıcı her yerde çalışıyor.
   */
  const kaydirildi = () => {
    if (zamanlayici.current) clearTimeout(zamanlayici.current)
    zamanlayici.current = setTimeout(() => {
      const kutu = ref.current
      if (!kutu) return
      const yeni = secenekler[Math.round(kutu.scrollTop / SATIR)]
      if (yeni !== undefined && yeni !== deger) onSec(yeni)
    }, 120)
  }

  useEffect(() => () => void (zamanlayici.current && clearTimeout(zamanlayici.current)), [])

  return (
    <div className="min-w-0">
      <span id={kimlik} className="sr-only">
        {etiket}
      </span>
      <div
        ref={ref}
        onScroll={kaydirildi}
        aria-labelledby={kimlik}
        // `snap-mandatory`: parmak bırakıldığında tekerlek hep bir satıra
        // oturuyor, iki rakamın arasında kalmıyor.
        className="scrollbar-gizli h-[220px] snap-y snap-mandatory overflow-y-auto overscroll-contain"
        style={{ paddingTop: bosluk, paddingBottom: bosluk }}
      >
        {secenekler.map((secenek) => {
          const secili = secenek === deger
          return (
            <button
              key={secenek}
              type="button"
              onClick={() => onSec(secenek)}
              aria-pressed={secili}
              className={cn(
                'flex h-11 w-16 snap-center items-center justify-center transition-colors',
                'rakam font-display text-[19px] font-extrabold tabular-nums',
                secili ? 'text-primary' : 'text-muted-foreground/60',
              )}
            >
              {String(secenek).padStart(2, '0')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
