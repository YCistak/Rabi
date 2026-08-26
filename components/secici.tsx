'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { saatiKirp } from '@/lib/hatirlatma'

/* ===========================================================================
   Sayı tekerleği
   =========================================================================== */

/** Tek satırın yüksekliği (px). */
const SAYI_SATIRI = 56
/** Görünen satır sayısı; ortadaki seçili olan. Tek sayı olmak zorunda. */
const SAYI_GORUNEN = 5

/**
 * Dikey sayı seçici — telefonun kendi saat/tarih tekerleklerindeki hareket.
 *
 * Günlük soru hedefi önce çip listesiydi (100 · 200 · 300 · 400 · 500), sonra
 * yukarı aşağı sürüklenen dolu bir çubuk oldu. Çubuk "az mı çok mu" hissini
 * veriyordu ama hangi sayıda olduğunu ancak üstündeki rakama bakarak
 * anlıyordun ve termometre gibi duran koca bir gövde kartın tamamını
 * kaplıyordu. Tekerlekte seçilen sayı ortada, komşuları üstünde ve altında:
 * hem nerede olduğun hem de nereye gidebileceğin aynı anda görünüyor.
 *
 * Sürükleme kodu yok; tarayıcının kendi kaydırması + `scroll-snap`
 * kullanılıyor. İvme, sınırda yaylanma ve dokunma hassasiyeti elle yazılsa
 * asla bu kadar doğal olmazdı. Aynı gerekçe `SaatSecici` için de geçerli —
 * iki seçici bilerek aynı mekanikte.
 */
export function SayiTekerlegi({
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
  /** Kaçar kaçar artacağı. */
  adim: number
  /** Seçili sayının yanında yazan birim ("soru" gibi). */
  birim: string
  /** Ekran okuyucuya söylenen ad. */
  etiket: string
  className?: string
}) {
  const secenekler = useMemo(
    () => Array.from({ length: Math.floor((enCok - enAz) / adim) + 1 }, (_, i) => enAz + i * adim),
    [enAz, enCok, adim],
  )

  // Kayıtlı değer basamağa oturmuyorsa (eski kurulumdan kalan 275 gibi bir
  // sayı) en yakın satır seçiliyor; yoksa tekerlek hiçbir satıra hizalanmaz.
  const sira = useMemo(() => {
    const ham = Math.round((deger - enAz) / adim)
    return Math.min(secenekler.length - 1, Math.max(0, ham))
  }, [deger, enAz, adim, secenekler.length])

  const ref = useRef<HTMLDivElement>(null)
  const zamanlayici = useRef<ReturnType<typeof setTimeout> | null>(null)
  /**
   * Parmak tekerlekteyken dışarıdan gelen hizalama çalışmamalı.
   *
   * Seçim kaydırma sırasında anında bildiriliyor; dışarıdaki değer değişince
   * aşağıdaki etki tekerleği yeniden konumlandırmaya kalksaydı kaydırmayı
   * kendi ortasına çekip parmakla kavga ederdi.
   */
  const kaydiriyor = useRef(false)

  const bosluk = ((SAYI_GORUNEN - 1) / 2) * SAYI_SATIRI

  useEffect(() => {
    const kutu = ref.current
    if (!kutu || kaydiriyor.current) return
    const hedef = sira * SAYI_SATIRI
    if (Math.abs(kutu.scrollTop - hedef) > 2) kutu.scrollTo({ top: hedef })
  }, [sira])

  useEffect(() => () => void (zamanlayici.current && clearTimeout(zamanlayici.current)), [])

  /**
   * Kaydırdıkça ortadaki satırı okur.
   *
   * Değer beklemeden bildiriliyor: tekerlek dönerken kartın geri kalanının
   * (kurulumdaki "Devam", ayarlardaki satır değeri) eski sayıda kalması,
   * seçimin işlenmediği izlenimi veriyordu. `scrollend` olayı WebView'ın her
   * sürümünde yok; kaydırma sustuktan 140 ms sonra bayrak indiriliyor.
   */
  const kaydirildi = () => {
    kaydiriyor.current = true
    const kutu = ref.current
    if (kutu) {
      const yeni = secenekler[Math.round(kutu.scrollTop / SAYI_SATIRI)]
      if (yeni !== undefined && yeni !== deger) onDegis(yeni)
    }
    if (zamanlayici.current) clearTimeout(zamanlayici.current)
    zamanlayici.current = setTimeout(() => {
      kaydiriyor.current = false
    }, 140)
  }

  const tusla = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const yon =
      e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0
    if (yon !== 0) {
      e.preventDefault()
      const hedef = secenekler[Math.min(secenekler.length - 1, Math.max(0, sira + yon))]
      if (hedef !== undefined) onDegis(hedef)
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

  return (
    <div className={cn('relative', className)}>
      {/* Seçim alanı: kart değil, zeminden zar zor ayrılan yumuşak bir bant.
          Kutu çizilseydi tasarımın kaldırılan termometresinin yerine bu sefer
          bir çerçeve geçmiş olurdu. */}
      <div
        className="pointer-events-none absolute inset-x-6 top-1/2 h-[52px] -translate-y-1/2 rounded-2xl bg-primary-soft"
        aria-hidden
      />
      {/* Birim, seçili sayının sağında sabit duruyor: sayıyla birlikte
          kaydırılsaydı her satırda tekrar eden bir gürültü olurdu. */}
      <span
        className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 text-xs font-extrabold text-primary/70"
        aria-hidden
      >
        {birim}
      </span>

      <div
        ref={ref}
        onScroll={kaydirildi}
        onKeyDown={tusla}
        tabIndex={0}
        role="listbox"
        aria-label={etiket}
        aria-activedescendant={undefined}
        className="scrollbar-gizli relative snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        style={{
          height: SAYI_GORUNEN * SAYI_SATIRI,
          paddingTop: bosluk,
          paddingBottom: bosluk,
          // Uçlardaki sayılar kesilmek yerine soluyor. Satır opaklıkları
          // uzaklığa göre zaten düşüyor, maske o geçişi kenara kadar taşıyor.
          maskImage:
            'linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)',
        }}
      >
        {secenekler.map((secenek, i) => {
          const uzaklik = Math.abs(i - sira)
          return (
            <button
              key={secenek}
              type="button"
              role="option"
              aria-selected={i === sira}
              onClick={() => onDegis(secenek)}
              className={cn(
                'rakam flex w-full snap-center items-center justify-center font-display font-extrabold tabular-nums transition-all duration-150',
                uzaklik === 0
                  ? 'text-[40px] text-primary'
                  : uzaklik === 1
                    ? 'text-[24px] text-foreground/45'
                    : 'text-[19px] text-foreground/20',
              )}
              style={{ height: SAYI_SATIRI }}
            >
              {secenek}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ===========================================================================
   Saat seçici
   =========================================================================== */

/** Dakika basamağı: beşer beşer. Bildirim için dakika hassasiyeti bu kadarı yeter. */
const DAKIKA_ADIMI = 5
/** Tek satırın yüksekliği (px). Dokunma hedefi 44 px'in altına inmiyor. */
const SATIR = 48
/** Görünen satır sayısı; ortadaki seçili olan. Tek sayı olmak zorunda. */
const GORUNEN = 3

const SAATLER = Array.from({ length: 24 }, (_, s) => s)
const DAKIKALAR = Array.from({ length: 60 / DAKIKA_ADIMI }, (_, d) => d * DAKIKA_ADIMI)

/** Üstteki "20.00" satırında saat ve dakika basamağının genişliği (px). */
const BASAMAK = 88
/** İki basamağın arasındaki noktanın genişliği (px). */
const AYIRAC = 16

type Alan = 'saat' | 'dakika'

/**
 * Saat seçici — üstte seçilen saat, altında **tek** tekerlek.
 *
 * Yerini aldığı `<input type="time">` Android WebView'da sistemin kendi
 * seçicisini açıyordu: telefon İngilizceyse 12 saatlik AM/PM düzeninde
 * geliyor, uygulamanın her yerinde 24 saatlik "20.00" biçimi kullanılırken
 * kutuda "08:00 PM" yazıyordu. Kutunun kendisi de tema renklerini almıyordu.
 *
 * İlk denemesi yan yana iki tekerlekti. Çalışıyordu ama kartın yarısını
 * kaplıyordu ve ortadaki dolu seçim bandı ekranın en koyu lekesi oluyordu —
 * bir bildirim saati bu kadar yer kaplamayı hak etmiyor. Şimdi:
 *
 * - Seçilen saat üstte, tek parça olarak okunuyor ("20.00"). Tekerlek nerede
 *   olursa olsun seçili değer gözden kaybolmuyor.
 * - Hangi basamağın değiştirildiğini renk ve altındaki ince çizgi söylüyor;
 *   çizgi basamak değişince kayarak gidiyor. Dolu renk bloğu yok.
 * - Aşağıda o an düzenlenen basamağın tekerleği duruyor, üç satır. Saat ve
 *   dakika tekerlekleri ikisi de takılı; aralarındaki geçiş opaklıkla
 *   yapılıyor, bu yüzden ayrı ekran gibi hissettirmiyor.
 *
 * Tekerlek sürükleme koduyla değil, tarayıcının kendi kaydırmasıyla çalışıyor
 * (`scroll-snap`): ivme, sınırda yaylanma ve dokunma hassasiyeti elle yazılsa
 * asla bu kadar doğal olmazdı. Aynı gerekçe `SayiTekerlegi` için de geçerli.
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
  const [alan, setAlan] = useState<Alan>('saat')

  const saatBasamagi = saatiKirp(saat)
  // Kayıtlı dakika beşin katı değilse (eski kurulumlar, elle yazılmış saat)
  // en yakın basamağa yuvarlanıyor; yoksa tekerlek hiçbir satıra oturmuyor.
  const dakikaBasamagi = Math.min(55, Math.round(dakika / DAKIKA_ADIMI) * DAKIKA_ADIMI)

  const genislik = BASAMAK * 2 + AYIRAC

  return (
    <div
      className={cn('select-none', className)}
      role="group"
      aria-label="Hatırlatma saati"
    >
      {/* Seçili saat. Ekranın odağı burası; tekerlek yardımcı. */}
      <div className="relative mx-auto flex items-end justify-center pb-2" style={{ width: genislik }}>
        <Basamak
          etiket="Saat"
          deger={saatBasamagi}
          etkin={alan === 'saat'}
          onSec={() => setAlan('saat')}
        />
        <span
          className="rakam grid shrink-0 place-items-center pb-1 font-display text-[40px] font-extrabold leading-none text-foreground/25"
          style={{ width: AYIRAC }}
          aria-hidden
        >
          .
        </span>
        <Basamak
          etiket="Dakika"
          deger={dakikaBasamagi}
          etkin={alan === 'dakika'}
          onSec={() => setAlan('dakika')}
        />

        {/* Vurgu çizgisi. Basamaklar eşit genişlikte olduğu için kayacağı
            mesafe sabit; ölçüm gerekmiyor. */}
        <span
          className="pointer-events-none absolute bottom-0 left-0 h-[3px] rounded-full bg-primary transition-transform duration-200 ease-out"
          style={{
            width: BASAMAK,
            transform: `translateX(${alan === 'saat' ? 0 : BASAMAK + AYIRAC}px)`,
          }}
          aria-hidden
        />
      </div>

      {/* İki tekerlek de takılı duruyor; sadece biri görünür. Böylece geçiş
          opaklıkla yumuşuyor ve pasif tekerlek kendi satırında bekliyor. */}
      <div className="relative mx-auto mt-3" style={{ width: genislik, height: GORUNEN * SATIR }}>
        <Tekerlek
          etiket="Saat"
          secenekler={SAATLER}
          deger={saatBasamagi}
          etkin={alan === 'saat'}
          onSec={(yeni) => onDegis({ saat: yeni, dakika: dakikaBasamagi })}
        />
        <Tekerlek
          etiket="Dakika"
          secenekler={DAKIKALAR}
          deger={dakikaBasamagi}
          etkin={alan === 'dakika'}
          onSec={(yeni) => onDegis({ saat: saatBasamagi, dakika: yeni })}
        />
      </div>
    </div>
  )
}

/** Üstteki saat yazısının bir yarısı: dokunulunca o basamak düzenlenmeye açılır. */
function Basamak({
  etiket,
  deger,
  etkin,
  onSec,
}: {
  etiket: string
  deger: number
  etkin: boolean
  onSec: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSec}
      aria-pressed={etkin}
      aria-label={`${etiket}: ${String(deger).padStart(2, '0')}`}
      style={{ width: BASAMAK }}
      className={cn(
        'rakam shrink-0 pb-1 font-display text-[40px] font-extrabold leading-none tabular-nums',
        'rounded-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        // İki basamak da aynı boyda: "20.00" tek bir saat gibi okunmalı.
        // Hangisinin düzenlendiğini renk ve altındaki çizgi söylüyor.
        etkin ? 'text-primary' : 'text-foreground/35',
      )}
    >
      {String(deger).padStart(2, '0')}
    </button>
  )
}

function Tekerlek({
  etiket,
  secenekler,
  deger,
  etkin,
  onSec,
}: {
  etiket: string
  secenekler: number[]
  deger: number
  etkin: boolean
  onSec: (yeni: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const zamanlayici = useRef<ReturnType<typeof setTimeout> | null>(null)
  const kimlik = useId()
  /**
   * Parmak tekerlekteyken dışarıdan gelen hizalama çalışmamalı; yoksa
   * kaydırmayı kendi ortasına çekip parmakla kavga eder.
   */
  const kaydiriyor = useRef(false)

  const sira = Math.max(0, secenekler.indexOf(deger))
  const bosluk = ((GORUNEN - 1) / 2) * SATIR

  // Değer dışarıdan değiştiğinde (üstteki basamağa dokunmak, geri gelmek)
  // tekerlek de oraya gitmeli.
  useEffect(() => {
    const kutu = ref.current
    if (!kutu || kaydiriyor.current) return
    const hedef = sira * SATIR
    if (Math.abs(kutu.scrollTop - hedef) > 2) kutu.scrollTo({ top: hedef })
  }, [sira])

  useEffect(() => () => void (zamanlayici.current && clearTimeout(zamanlayici.current)), [])

  /**
   * Kaydırdıkça ortadaki satırı okur.
   *
   * Değer beklemeden bildiriliyor: üstteki "20.00" tekerlek dönerken eski
   * sayıda kalsaydı seçimin işlenmediği izlenimi verirdi. `scrollend` olayı
   * WebView'ın her sürümünde yok; kaydırma sustuktan 140 ms sonra bayrak
   * indiriliyor.
   */
  const kaydirildi = () => {
    kaydiriyor.current = true
    const kutu = ref.current
    if (kutu) {
      const yeni = secenekler[Math.round(kutu.scrollTop / SATIR)]
      if (yeni !== undefined && yeni !== deger) onSec(yeni)
    }
    if (zamanlayici.current) clearTimeout(zamanlayici.current)
    zamanlayici.current = setTimeout(() => {
      kaydiriyor.current = false
    }, 140)
  }

  const tusla = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const yon = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0
    if (yon === 0) return
    e.preventDefault()
    const hedef = secenekler[Math.min(secenekler.length - 1, Math.max(0, sira + yon))]
    if (hedef !== undefined) onSec(hedef)
  }

  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-200 ease-out',
        etkin ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!etkin}
    >
      <span id={kimlik} className="sr-only">
        {etiket}
      </span>
      <div
        ref={ref}
        onScroll={kaydirildi}
        onKeyDown={tusla}
        tabIndex={etkin ? 0 : -1}
        role="listbox"
        aria-labelledby={kimlik}
        // `snap-mandatory`: parmak bırakıldığında tekerlek hep bir satıra
        // oturuyor, iki rakamın arasında kalmıyor.
        className="scrollbar-gizli h-full snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        style={{
          paddingTop: bosluk,
          paddingBottom: bosluk,
          // Uçlardaki sayılar kesilmek yerine soluyor. Seçim bandı yok;
          // ortadaki satırı bandın yerine boyut ve renk ayırıyor.
          maskImage: 'linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)',
        }}
      >
        {secenekler.map((secenek, i) => {
          const uzaklik = Math.abs(i - sira)
          return (
            <button
              key={secenek}
              type="button"
              role="option"
              // Klavye gezinmesi kutunun kendisinde (ok tuşları); satırların tek
              // tek sekmeyle dolaşılması hem uzun hem gereksiz.
              tabIndex={-1}
              aria-selected={i === sira}
              onClick={() => onSec(secenek)}
              className={cn(
                'rakam flex w-full snap-center items-center justify-center font-display font-extrabold tabular-nums transition-all duration-200 ease-out',
                uzaklik === 0
                  ? 'scale-100 text-[26px] text-primary'
                  : uzaklik === 1
                    ? 'scale-95 text-[19px] text-foreground/40'
                    : 'scale-95 text-[19px] text-foreground/15',
              )}
              style={{ height: SATIR }}
            >
              {String(secenek).padStart(2, '0')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
