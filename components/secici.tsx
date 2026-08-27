'use client'

import { useEffect, useId, useMemo, useRef } from 'react'
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
/** Tek satırın yüksekliği (px) — soru hedefi tekerleğiyle aynı. */
const SATIR = SAYI_SATIRI
/** Görünen satır sayısı; ortadaki seçili olan. Tek sayı olmak zorunda. */
const GORUNEN = SAYI_GORUNEN

/**
 * Listenin kaç kez arka arkaya çizildiği.
 *
 * Saat çarkının sonu yok: 23'ten sonra 00, 55'ten sonra 00 geliyor. Bunun için
 * liste üç kez basılıyor ve kaydırma uçtaki kopyaya girdiğinde `scrollTop` bir
 * kopya boyu geri/ileri alınıyor — ekranda aynı sayılar durduğu için sıçrama
 * görünmüyor. Tek kopyayla dönmek imkânsız: tarayıcının kendi kaydırmasını
 * kullanıyoruz ve onun sonu var.
 *
 * Üçten az olamaz (ortada duracak bir kopya kalmaz); daha fazlası da yalnızca
 * boşuna satır çizer.
 */
const KOPYA = 3
/** Kaydırmanın yaşadığı kopya: ortadaki. */
const ORTA_KOPYA = Math.floor(KOPYA / 2)

const SAATLER = Array.from({ length: 24 }, (_, s) => s)
const DAKIKALAR = Array.from({ length: 60 / DAKIKA_ADIMI }, (_, d) => d * DAKIKA_ADIMI)

/** Saat ve dakika tekerleğinin genişliği (px). */
const BASAMAK = 116
/** İki tekerleğin arasındaki noktanın genişliği (px). */
const AYIRAC = 24

/**
 * Saat seçici — yan yana iki tekerlek.
 *
 * Yerini aldığı `<input type="time">` Android WebView'da sistemin kendi
 * seçicisini açıyordu: telefon İngilizceyse 12 saatlik AM/PM düzeninde
 * geliyor, uygulamanın her yerinde 24 saatlik "20.00" biçimi kullanılırken
 * kutuda "08:00 PM" yazıyordu. Kutunun kendisi de tema renklerini almıyordu.
 *
 * Bir ara tek tekerlekli bir sürüm denendi: üstte büyük "20.00" duruyor,
 * hangi basamağın çevrileceği o yazıya dokunularak seçiliyordu. Yer
 * kazandırıyordu ama saati kurmak iki işe çıkıyordu — önce basamağa dokun,
 * sonra çevir — ve dakikayı değiştirmek isteyen kullanıcı tekerleği çevirip
 * saatin döndüğünü görüyordu. Şimdi ikisi de aynı anda ekranda ve ikisi de
 * doğrudan çevriliyor; dokunmadan önce seçilecek bir şey yok.
 *
 * Ortadaki yumuşak bant seçili satırı gösteriyor, iki tekerleğin arasındaki
 * nokta da "20.00"ı tek bir saat gibi okutuyor.
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
  const saatBasamagi = saatiKirp(saat)
  // Kayıtlı dakika beşin katı değilse (eski kurulumlar, elle yazılmış saat)
  // en yakın basamağa yuvarlanıyor; yoksa tekerlek hiçbir satıra oturmuyor.
  const dakikaBasamagi = Math.min(55, Math.round(dakika / DAKIKA_ADIMI) * DAKIKA_ADIMI)

  const genislik = BASAMAK * 2 + AYIRAC

  return (
    <div className={cn('select-none', className)} role="group" aria-label="Hatırlatma saati">
      <div
        className="relative mx-auto flex"
        style={{ width: genislik, height: GORUNEN * SATIR }}
      >
        {/* Seçim bandı: kart değil, zeminden zar zor ayrılan yumuşak bir bant.
            İki tekerleğin altından birlikte geçiyor — ayrı ayrı çizilseydi
            "20.00" tek bir saat gibi değil iki ayrı kutu gibi okunurdu. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[52px] -translate-y-1/2 rounded-2xl bg-primary-soft"
          aria-hidden
        />

        <Tekerlek
          etiket="Saat"
          secenekler={SAATLER}
          deger={saatBasamagi}
          onSec={(yeni) => onDegis({ saat: yeni, dakika: dakikaBasamagi })}
        />
        {/* Nokta tekerleklerin arasında ve ortadaki satırın hizasında sabit:
            satırlarla birlikte kaysaydı her satırda tekrar ederdi. */}
        <span
          className="rakam relative grid shrink-0 place-items-center font-display text-[40px] font-extrabold leading-none text-primary/60"
          style={{ width: AYIRAC }}
          aria-hidden
        >
          .
        </span>
        <Tekerlek
          etiket="Dakika"
          secenekler={DAKIKALAR}
          deger={dakikaBasamagi}
          onSec={(yeni) => onDegis({ saat: saatBasamagi, dakika: yeni })}
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
  /**
   * Parmak tekerlekteyken dışarıdan gelen hizalama çalışmamalı; yoksa
   * kaydırmayı kendi ortasına çekip parmakla kavga eder.
   */
  const kaydiriyor = useRef(false)
  /** İlk yerleşim ortadaki kopyaya yapılıyor; sonrakiler bulunduğu kopyada kalıyor. */
  const yerlesti = useRef(false)

  const adet = secenekler.length
  const sira = Math.max(0, secenekler.indexOf(deger))
  const bosluk = ((GORUNEN - 1) / 2) * SATIR
  /** Üç kopya arka arkaya: dönen çarkın satırları. */
  const satirlar = Array.from({ length: adet * KOPYA }, (_, i) => secenekler[i % adet] as number)

  // Değer dışarıdan değiştiğinde (kayıttan gelen saat, geri gelmek) tekerlek de
  // oraya gitmeli — ama bulunduğu kopyayı bırakmadan, yoksa her dış değişiklik
  // çarkı görünür biçimde başa sarardı.
  useEffect(() => {
    const kutu = ref.current
    if (!kutu || kaydiriyor.current) return
    const suanki = Math.round(kutu.scrollTop / SATIR)
    const kopyaBasi = yerlesti.current ? Math.floor(suanki / adet) * adet : ORTA_KOPYA * adet
    yerlesti.current = true
    const hedef = (kopyaBasi + sira) * SATIR
    if (Math.abs(kutu.scrollTop - hedef) > 2) kutu.scrollTo({ top: hedef })
  }, [sira, adet])

  useEffect(() => () => void (zamanlayici.current && clearTimeout(zamanlayici.current)), [])

  /**
   * Kaydırdıkça ortadaki satırı okur, uca gelindiğinde çarkı ortaya alır.
   *
   * Değer beklemeden bildiriliyor: kartın geri kalanının tekerlek dönerken eski
   * sayıda kalması, seçimin işlenmediği izlenimi veriyordu. `scrollend` olayı
   * WebView'ın her sürümünde yok; kaydırma sustuktan 140 ms sonra bayrak
   * indiriliyor.
   */
  const kaydirildi = () => {
    kaydiriyor.current = true
    const kutu = ref.current
    if (kutu) {
      const satir = Math.round(kutu.scrollTop / SATIR)
      const yeni = secenekler[((satir % adet) + adet) % adet]
      if (yeni !== undefined && yeni !== deger) onSec(yeni)

      // Uçtaki kopyaya girildiyse bir kopya boyu geri/ileri alınıyor. Ekranda
      // aynı sayılar durduğu için sıçrama görünmüyor; `scrollTo` anlık, çünkü
      // yumuşak kaydırma parmağın ivmesini keserdi.
      if (satir < adet || satir >= adet * (KOPYA - 1)) {
        const yon = satir < adet ? 1 : -1
        kutu.scrollTop = kutu.scrollTop + yon * adet * SATIR
      }
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
    // Ok tuşu da dönüyor: listenin ucunda durmak, çarkın sonu yokken
    // klavyeyle sonu varmış gibi davranmak olurdu.
    const hedef = secenekler[(sira + yon + adet) % adet]
    if (hedef !== undefined) onSec(hedef)
  }

  return (
    <div className="relative h-full shrink-0" style={{ width: BASAMAK }}>
      <span id={kimlik} className="sr-only">
        {etiket}
      </span>
      <div
        ref={ref}
        onScroll={kaydirildi}
        onKeyDown={tusla}
        tabIndex={0}
        role="listbox"
        aria-labelledby={kimlik}
        // `snap-mandatory`: parmak bırakıldığında tekerlek hep bir satıra
        // oturuyor, iki rakamın arasında kalmıyor.
        className="scrollbar-gizli h-full snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        style={{
          paddingTop: bosluk,
          paddingBottom: bosluk,
          // Uçlardaki sayılar kesilmek yerine soluyor. Satır opaklıkları
          // uzaklığa göre zaten düşüyor, maske o geçişi kenara kadar taşıyor.
          maskImage: 'linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)',
        }}
      >
        {satirlar.map((secenek, i) => {
          // Uzaklık kopyanın içindeki yerine değil, satırın seçili satıra olan
          // gerçek mesafesine bakıyor: aynı sayı üç yerde duruyor.
          const uzaklik = Math.min(
            ...Array.from({ length: KOPYA }, (_, k) => Math.abs(i - (k * adet + sira))),
          )
          return (
            <button
              key={`${i}-${secenek}`}
              type="button"
              role="option"
              // Klavye gezinmesi kutunun kendisinde (ok tuşları); satırların tek
              // tek sekmeyle dolaşılması hem uzun hem gereksiz.
              tabIndex={-1}
              aria-selected={uzaklik === 0}
              onClick={() => onSec(secenek)}
              className={cn(
                'rakam flex w-full snap-center items-center justify-center font-display font-extrabold tabular-nums transition-all duration-150',
                uzaklik === 0
                  ? 'text-[40px] text-primary'
                  : uzaklik === 1
                    ? 'text-[24px] text-foreground/45'
                    : 'text-[19px] text-foreground/20',
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
