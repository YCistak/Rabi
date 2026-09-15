'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import type { Konu } from '@/lib/konu'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Rabi } from '@/components/maskot/rabi'
import { KartGorseli } from './kart-gorseli'
import { YoklamaBileti } from './yoklama-bileti'

/**
 * Soru sahnesi — deste okunduktan **hemen sonra** gelen ekran.
 *
 * Kartlar anlatıyor, burası geri istiyor. Ekranda bir iddia (ya da iki şıklı
 * bir soru) duruyor ve düğmeler var. Akış tek dokunuşluk: karar ver, sıradaki
 * soru gelsin. Tasarım kaynağı `tasarim/soru-sahnesi.html` (3a).
 *
 * Ekran bir süre **çevrilen** bir kart gösteriyordu: bir yüzünde soru, öteki
 * yüzünde cevap, kararı da kullanıcı kendi veriyordu ("bildim / bilmedim").
 * Ölçtüğü şey bilmek değil beyandı — cevabı gördükten sonra "bildim" demek
 * serbest. Şimdi cevap `SoruKarti.dogru` içinde ve ekran kararı kendisi
 * tartıyor.
 *
 * **Karar pencere açmıyor.** Bir süre karardan sonra kartın altında gerekçe
 * şeridi çıkıyor ve "Devam"a basılmasını bekliyordu; tasarımın 3a yönüyle
 * kalktı. Kararın karşılığı kartın kendisinde: çerçeve yeşile ya da kırmızıya
 * dönüyor, köşeye bir rozet düşüyor, doğru şık her hâlde yeşile, seçilen
 * yanlış kırmızıya boyanıyor — ve `BEKLEME` sonra sıradaki soru kendiliğinden
 * geliyor. Her soruda bir "Devam" dokunuşu, yoklamayı okumanın arkasına
 * eklenen ikinci bir ekran gibi uzatıyordu. Gerekçe (`aciklama`) içerikte
 * duruyor; burada gösterilmiyor.
 *
 * Sahnenin **iki** hâli var: kartlardan devralan kapanış — yoklama bileti,
 * `yoklama-bileti.tsx` — ve soruların kendisi. Bilet bir süre sahnenin kendi
 * ilk ekranıydı (`Giris`, burada); tasarım onu destenin tarafına aldı ve
 * sahne "Yoklamaya başla" denince açılıyor. İki kök ayrı `key` taşıyor: aynı
 * `div` yeniden kullanılsaydı `sahne-iner` ikinci kökte hiç oynamazdı.
 * Kapanışta bir de özet (`Sonuc`: iki sayı, maskot, "Haritaya dön") vardı;
 * kaldırıldı — son sorudan sonra sahne doğrudan haritaya dönüyor. Sayı kayda
 * yine giriyor (`SahneSonucu`), yalnızca ekranda gösterilmiyor.
 *
 * Sahne uzun süre uygulamanın tek koyu yüzeyiydi; 3a ile aydınlığa döndü:
 * krem zemin, ince çizgili kâğıt, amber işlemeli çift çerçeve. Renkler
 * `globals.css`teki `.sahne` bloğunda, burada onaltılık kod yok.
 */

/** Karardan sıradaki soruya kadar geçen süre (ms). Rozetin pop'u bu sürenin içinde bitiyor. */
const BEKLEME = 850

export type SahneSonucu = {
  dogru: number
  yanlis: number
  /**
   * Yoklamanın sonuna gelindi mi.
   *
   * Yarıda çıkılan yoklama sayı **yazdırmıyor** (`konu-haritasi.tsx`):
   * destenin kendi kuralının aynısı — tamamlanma sona gelmekle kazanılıyor.
   * Bayrak olmadan, girişte "Şimdi değil" diyen kullanıcının kaydına hiç
   * verilmemiş bir yoklamanın "0 doğru"su yazılıyordu.
   */
  bitti: boolean
}

export function SoruSahnesi({
  konu,
  temaAdi,
  dersAdi,
  biletli,
  onKapat,
}: {
  konu: Konu
  temaAdi: string
  dersAdi: string
  /**
   * Önce yoklama bileti gelsin mi. Destenin ucundan gelince evet; haritadaki
   * turuncu kitaptan gelince hayır — bilet destenin kapanışı, yoklamanın
   * girişi değil, ve kitaptan giren kullanıcı bir şey okumadı.
   */
  biletli: boolean
  onKapat: (sonuc: SahneSonucu) => void
}) {
  const [sira, setSira] = useState(0)
  /**
   * Verilen cevap; `null` ise henüz karar verilmedi.
   *
   * İki soru biçimi tek sayıda buluşuyor: doğru/yanlışta 1 "doğru", 0
   * "yanlış"; iki şıklıda şıkkın dizini. Beklenen cevap da aynı sayıya
   * çevriliyor (`beklenen`), böylece karar ve boyama iki biçimde tek koddan
   * çıkıyor.
   */
  const [secim, setSecim] = useState<number | null>(null)
  const [dogru, setDogru] = useState(0)
  const [yanlis, setYanlis] = useState(0)
  /** Biletteki düğmeye basıldı mı; basılana kadar ilk soru görünmüyor. Biletsiz açılışta hemen doğru. */
  const [basladi, setBasladi] = useState(!biletli)

  const soru = konu.sorular[sira]
  const toplam = konu.sorular.length
  const sikli = soru.tur === 'sikli'
  const beklenen = soru.tur === 'sikli' ? soru.dogru : soru.dogru ? 1 : 0
  const isabet = secim !== null && secim === beklenen

  /*
    Sonuç ref'te de duruyor: geri tuşu katmanı bileşenin ilk çiziminde
    kaydediliyor ve `onKapat`ı çağırdığı anda state'in güncel hâlini görmesi
    gerekiyor.
  */
  const sonucRef = useRef<SahneSonucu>({ dogru: 0, yanlis: 0, bitti: false })
  sonucRef.current = { dogru, yanlis, bitti: false }
  useGeriKatmani(true, () => onKapat(sonucRef.current))

  function karar(cevap: number) {
    if (secim !== null) return
    setSecim(cevap)
    if (cevap === beklenen) setDogru((o) => o + 1)
    else setYanlis((o) => o + 1)
  }

  /*
    Sıradaki soru kendiliğinden geliyor. Zamanlayıcı bir etkide, `karar`ın
    içinde değil: etki karardan sonraki çizimde kuruluyor ve `dogru`/`yanlis`
    orada güncel — `karar`ın kapanışında bir önceki değerler kalırdı. Etkinin
    temizliği, kullanıcı bekleme sürerken kapatırsa (geri tuşu, ✕) sökülmüş
    bileşende sayacın işlemesini de önlüyor.
  */
  useEffect(() => {
    if (secim === null) return
    const sayac = window.setTimeout(() => {
      // Son sorudan sonra ekran yok: sayı kayda gidiyor, sahne kapanıyor.
      if (sira >= toplam - 1) {
        onKapat({ dogru, yanlis, bitti: true })
        return
      }
      setSira((o) => o + 1)
      setSecim(null)
    }, BEKLEME)
    return () => window.clearTimeout(sayac)
    // `onKapat` her çizimde yeni bir işlev; bağımlılığa girse sayaç her
    // çizimde baştan kurulurdu.
  }, [secim])

  // Uzun bir sorudan sonra gelen kısa soru sayfayı ortasından başlatıyordu.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [sira])

  if (!basladi) {
    return (
      <YoklamaBileti
        key="bilet"
        konu={konu}
        dersAdi={dersAdi}
        temaAdi={temaAdi}
        onBasla={() => setBasladi(true)}
        onVazgec={() => onKapat({ dogru: 0, yanlis: 0, bitti: false })}
      />
    )
  }

  /**
   * Bir karar düğmesinin tonu. Karardan önce hepsi beyaz; sonra doğru şık
   * yeşile dolar (seçilmemiş olsa da — doğru cevap gösteriliyor), seçilen
   * yanlış kırmızıya dolar, kalan söner.
   */
  function dugmeTonu(kendi: number): 'sakin' | 'dogru' | 'yanlis' | 'sonuk' {
    if (secim === null) return 'sakin'
    if (kendi === beklenen) return 'dogru'
    if (kendi === secim) return 'yanlis'
    return 'sonuk'
  }

  const tonSinifi = {
    sakin: '',
    dogru: 'bg-[var(--sahne-dogru)] text-white',
    yanlis: 'bg-[var(--sahne-yanlis)] text-white',
    sonuk: 'text-foreground/35',
  }

  return (
    <div
      key="sorular"
      className="sahne sahne-iner fixed inset-0 z-50 flex flex-col text-foreground"
    >
      {/* İşlemeli çift çerçeve: sayfanın kendisi bir kâğıt gibi çerçeveli. */}
      <div aria-hidden className="sahne-cerceve pointer-events-none absolute inset-[14px] rounded-[32px]" />
      <div aria-hidden className="sahne-cerceve-ic pointer-events-none absolute inset-[20px] rounded-[26px]" />

      <header className="relative shrink-0 px-7 pt-[calc(1.75rem+var(--guvenli-ust))]">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            type="button"
            onClick={() => onKapat(sonucRef.current)}
            aria-label="Kapat"
            className="sahne-kapat grid size-[46px] shrink-0 place-items-center rounded-2xl bg-card transition active:brightness-95"
          >
            <X size={19} strokeWidth={2.6} aria-hidden />
          </button>

          {/* Açık soru ötekilerden geniş: hangi bölmede olunduğu renkten olduğu kadar boydan da okunsun. */}
          <div className="flex flex-1 gap-[5px]" aria-hidden>
            {konu.sorular.map((s, i) => (
              <span
                key={s.id}
                className={cn(
                  'h-[7px] rounded-full transition-[flex-grow,background-color] duration-200',
                  i <= sira ? 'bg-[var(--sahne-amber)]' : 'bg-foreground/12',
                )}
                style={{ flexGrow: i === sira ? 2.1 : 1 }}
              />
            ))}
          </div>

          <span className="rakam shrink-0 rounded-full bg-[var(--sahne-amber-zemin)] px-[11px] py-[5px] text-[14px] font-black text-[var(--sahne-amber-yazi)]">
            {sira + 1}/{toplam}
          </span>
        </div>

        <div className="mx-auto mt-[22px] flex max-w-md flex-col items-center gap-[7px] text-center">
          <p className="text-[11px] font-black tracking-[0.16em] text-foreground/55 uppercase">
            {dersAdi} · {temaAdi}
          </p>
          <h2 className="font-display text-[21px] leading-tight font-black tracking-tight">
            {konu.ad}
          </h2>
          <Sus genislik={38} />
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col px-7 pb-[calc(2rem+var(--guvenli-alt))]">
        {/*
          Kartın boyu içeriğe göre değişiyor ve gerekirse kendi içinde
          kaydırılıyor: görselli soru ile tek cümlelik soru aynı kutuya
          sığmıyor, sabit boy ikisinden birini bozardı. Dikey ortalama
          `my-auto` ile, `flex-1` ile değil — artan yeri paylaşan kutu kartı
          yukarı yapıştırmıyor.

          Kaydırma kutusunun üstünde ve yanlarında pay var: rozet çerçevenin
          dışına taşıyor ve paysız bir `overflow` onu kırpıyordu.
        */}
        <div className="mx-auto my-auto w-full max-w-md overflow-y-auto overscroll-contain px-3 pt-5 -mx-3">
          {/* Maskot kartın üstünde oturuyor; kararın kendisi kartta, tavşan izliyor. */}
          <div className="flex justify-center">
            <Rabi poz="kahveli" boyut={134} durum="normal" className="sahne-maskot" />
          </div>

          {/*
            Kararın izi kartın **çerçevesinde**: kart amber bir paspartuyla
            duruyor ve karar o paspartuyu yeşile ya da kırmızıya boyuyor.
            Rozet de çerçevenin köşesinde — kartın içine girseydi kart büyür,
            iddia yukarı kayardı.
          */}
          <div
            key={soru.id}
            className={cn(
              'relative mt-3 rounded-[33px] p-[7px] transition-colors duration-200',
              secim === null
                ? 'bg-[var(--sahne-cerceve-dolgu)]'
                : isabet
                  ? 'bg-[var(--sahne-dogru)]'
                  : 'bg-[var(--sahne-yanlis)]',
            )}
          >
            {secim !== null && (
              <span
                role="status"
                aria-label={isabet ? 'Doğru' : 'Yanlış'}
                className={cn(
                  'soru-rozet-pop absolute -top-4 -right-2.5 z-[2] grid size-[58px] place-items-center rounded-full text-white',
                  isabet ? 'bg-[var(--sahne-dogru)]' : 'bg-[var(--sahne-yanlis)]',
                )}
                style={{
                  boxShadow: `0 8px 18px ${isabet ? 'var(--sahne-dogru-golge)' : 'var(--sahne-yanlis-golge)'}`,
                }}
              >
                {isabet ? (
                  <Check size={28} strokeWidth={3.2} aria-hidden />
                ) : (
                  <X size={26} strokeWidth={3.2} aria-hidden />
                )}
              </span>
            )}

            <div className="sahne-kart relative rounded-[27px] bg-card px-[26px] pt-[30px] pb-8">
              <p className="absolute top-0 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-[var(--sahne-cerceve-cizgi)] bg-[var(--sahne-amber-zemin)] px-5 py-2 text-[10px] font-black tracking-[0.1em] whitespace-nowrap text-[var(--sahne-amber-yazi)] uppercase">
                <span className="size-[7px] shrink-0 rounded-full bg-[var(--sahne-amber-koyu)]" aria-hidden />
                {sikli ? 'Hangisi?' : 'Doğru mu, yanlış mı?'}
              </p>

              <p className="mt-3.5 text-center text-[20px] leading-normal font-extrabold text-pretty">
                {soru.tur === 'sikli' ? soru.soru : soru.ifade}
              </p>

              {soru.gorsel && (
                <div className="mt-4">
                  <KartGorseli
                    gorsel={soru.gorsel}
                    etiket={soru.tur === 'sikli' ? soru.soru : soru.ifade}
                  />
                </div>
              )}

              <div className="mt-[22px]">
                <Sus genislik={26} soluk />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-[18px] w-full max-w-md">
          {soru.tur === 'sikli' ? (
            /*
              İki şıklı soruda düğmeler alt alta ve şıkkın metnini taşıyor;
              karardan önce ikisi de nötr — hangisinin doğru olduğu düğmenin
              renginden okunmamalı.
            */
            <div className="flex flex-col gap-3">
              {soru.siklar.map((metin, i) => {
                const ton = dugmeTonu(i)
                return (
                  <button
                    key={metin}
                    type="button"
                    onClick={() => karar(i)}
                    disabled={secim !== null}
                    className={cn(
                      'sahne-dugme flex min-h-16 w-full items-center gap-3.5 rounded-[20px] bg-card px-[18px] py-3.5 text-left text-[15.5px] font-extrabold transition-colors',
                      tonSinifi[ton],
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-[34px] shrink-0 place-items-center rounded-xl text-[14px] font-black',
                        ton === 'dogru' || ton === 'yanlis'
                          ? 'bg-white/22 text-white'
                          : 'bg-[var(--sahne-amber-zemin)] text-[var(--sahne-amber-yazi)]',
                      )}
                    >
                      {i === 0 ? 'A' : 'B'}
                    </span>
                    <span className="min-w-0 flex-1 leading-snug text-pretty">{metin}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex gap-3.5">
              <button
                type="button"
                onClick={() => karar(0)}
                disabled={secim !== null}
                className={cn(
                  'sahne-dugme flex h-[60px] flex-1 items-center justify-center gap-2 rounded-full bg-card text-[16px] font-black transition-colors',
                  dugmeTonu(0) === 'sakin' ? 'text-[var(--sahne-yanlis)]' : tonSinifi[dugmeTonu(0)],
                )}
              >
                <X size={18} strokeWidth={3} aria-hidden /> Yanlış
              </button>
              <button
                type="button"
                onClick={() => karar(1)}
                disabled={secim !== null}
                className={cn(
                  'sahne-dugme flex h-[60px] flex-1 items-center justify-center gap-2 rounded-full bg-card text-[16px] font-black transition-colors',
                  dugmeTonu(1) === 'sakin' ? 'text-[var(--sahne-dogru)]' : tonSinifi[dugmeTonu(1)],
                )}
              >
                <Check size={18} strokeWidth={3} aria-hidden /> Doğru
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Amber süs: çizgi · baklava · çizgi. Başlığın altında ve kartın dibinde.
 * Başlıktakinin çizgileri dışa doğru soluyor, karttakiler düz ve soluk.
 */
function Sus({ genislik, soluk = false }: { genislik: number; soluk?: boolean }) {
  const cizgi = soluk ? 'bg-foreground/18' : ''
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden>
      <span
        className={cn('h-px', cizgi)}
        style={{
          width: genislik,
          background: soluk ? undefined : 'linear-gradient(90deg, transparent, var(--sahne-amber))',
        }}
      />
      <span className={cn('rotate-45 bg-[var(--sahne-amber)]', soluk ? 'size-[7px]' : 'size-1.5')} />
      <span
        className={cn('h-px', cizgi)}
        style={{
          width: genislik,
          background: soluk ? undefined : 'linear-gradient(90deg, var(--sahne-amber), transparent)',
        }}
      />
    </div>
  )
}
