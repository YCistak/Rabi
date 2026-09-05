'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Konu } from '@/lib/konu'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Buton } from '@/components/ui'

/**
 * Bilgi kartı destesi.
 *
 * Deste **karar sormuyor**: kartlar Geri ve İlerle ile okunuyor, o kadar.
 * Bir süre her kartta "biliyorum / bilmiyorum" soruluyor, bilmediklerin ayrı
 * bir bankaya düşüyordu; ikisi de kaldırıldı. Okumanın ortasında sorulan bir
 * soru okumayı bir sınava çeviriyordu — kartın işi bir şeyi hatırlatmak,
 * kullanıcıyı ölçmek değil.
 *
 * Kayıt olarak yalnızca **kaç karta kadar gidildiği** ve destenin bitip
 * bitmediği tutuluyor (`DesteSonucu`); harita bu ikisini gösteriyor.
 *
 * Destenin kendi bitiş ekranı yok: son karttan sonra soru sahnesi geliyor
 * (`soru-sahnesi.tsx`) ve özet orada. Arada duran bir "deste bitti" ekranı,
 * okumayla soruyu birbirinden ayıran fazladan bir dokunuştu.
 */

/**
 * Kartın sol şeridinin renkleri — "her kart kendi rengiyle gelir".
 *
 * Sırayla dönüyorlar, yani destede ilerlerken kartın değiştiği yalnızca
 * yazıdan değil renkten de anlaşılıyor. Üçü de markanın kendi tonları:
 * dersin rengi zeminde zaten duruyor ve şerit onu tekrarlasaydı kart
 * zeminden ayrışmazdı.
 */
const SERIT_RENKLERI = ['var(--primary-parlak)', 'var(--ikincil)', 'var(--primary)']

export type DesteSonucu = {
  /** Okunan kart sayısı — gidilen en ileri kart. */
  okunan: number
  /** Destenin sonuna gelindi mi. Yarıda çıkıldıysa `false`. */
  bitti: boolean
}

export function KartDestesi({
  konu,
  temaAdi,
  dersAdi,
  zeminSinifi,
  onKapat,
}: {
  konu: Konu
  temaAdi: string
  dersAdi: string
  /** Ekranın zemin sınıfı; dersin renk ailesinden geliyor.
   *  Sınıf adı **dışarıdan tam yazılı** geliyor: `bg-${aile}-kart` gibi
   *  birleştirilen bir ad Tailwind'in taramasından düşer ve zemin renksiz kalır. */
  zeminSinifi: string
  onKapat: (sonuc: DesteSonucu) => void
}) {
  const [sira, setSira] = useState(0)
  /** Gidilen en ileri kart; geri dönüp yeniden ilerlemek sayıyı büyütmüyor. */
  const [enIleri, setEnIleri] = useState(1)
  /** Süzülme yönü: ileri 1, geri −1. Kartın giriş animasyonunu bu belirliyor. */
  const [yon, setYon] = useState(1)

  const kart = konu.kartlar[sira]
  const sonKart = sira >= konu.kartlar.length - 1

  /*
    Sonuç ref'te de duruyor: geri tuşu katmanı bileşenin ilk çiziminde
    kaydediliyor ve `onKapat`ı çağırdığı anda state'in güncel hâlini görmesi
    gerekiyor.
  */
  const sonucRef = useRef<DesteSonucu>({ okunan: 1, bitti: false })
  sonucRef.current = {
    okunan: Math.min(enIleri, konu.kartlar.length),
    bitti: false,
  }
  useGeriKatmani(true, () => onKapat(sonucRef.current))

  function ilerle() {
    if (sonKart) {
      onKapat({ okunan: konu.kartlar.length, bitti: true })
      return
    }
    setYon(1)
    setEnIleri((ileri) => Math.max(ileri, sira + 2))
    setSira((o) => o + 1)
  }

  function geri() {
    if (sira === 0) return
    setYon(-1)
    setSira((o) => o - 1)
  }

  // Kart değişince sayfa başa dönmeli: uzun bir karttan sonra gelen kısa kart
  // ekranın ortasından başlıyordu.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [sira])

  return (
    <div className={cn('deste-zemin fixed inset-0 z-50 flex flex-col', zeminSinifi)}>
      <header className="shrink-0 px-4 pt-[calc(0.75rem+var(--guvenli-ust))] pb-3">
        <div className="mx-auto flex max-w-md items-center gap-3">
          {/* Kapatma beyaz bir daire: zemin dersin rengiyle dolu ve o zeminin
              üstünde çerçevesiz bir simge dokunulabilir görünmüyordu. */}
          <button
            type="button"
            onClick={() => onKapat(sonucRef.current)}
            aria-label="Kapat"
            className="golge-kart grid size-10 shrink-0 place-items-center rounded-full bg-card text-foreground transition active:brightness-95"
          >
            <X size={19} strokeWidth={2.6} aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-[16px] font-extrabold tracking-tight">
              {konu.ad}
            </h2>
            <p className="truncate text-[12px] font-semibold text-muted-foreground">
              {dersAdi} · {temaAdi}
            </p>
          </div>
        </div>

        {/*
          İlerleme çubuğu **bölmeli**: destede kaç kart olduğu tek bakışta
          okunuyor. Tek parça bir çubuk yalnızca oranı gösteriyordu ve dört
          kartlık deste ile on kartlık deste aynı görünüyordu.
        */}
        <div className="mx-auto mt-3 flex max-w-md gap-1.5" aria-hidden>
          {konu.kartlar.map((k, i) => (
            <span
              key={k.id}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-200',
                i <= sira ? 'bg-primary-parlak' : 'bg-black/10',
              )}
            />
          ))}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-[calc(1rem+var(--guvenli-alt))]">
        <div className="mx-auto flex w-full max-w-md flex-1 items-center">
          <article
            /* `key` sıraya bağlı: React aynı düğümü yeniden kullanırsa yazı
                 değişir ama giriş animasyonu hiç oynamaz ve kart yerinde takas
                 edilmiş gibi görünür. */
            key={kart.id}
            style={{ '--deste-yon': yon } as React.CSSProperties}
            className="deste-karti golge-kart relative w-full overflow-hidden rounded-3xl bg-card"
          >
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-2.5"
              style={{
                background: SERIT_RENKLERI[sira % SERIT_RENKLERI.length],
              }}
            />
            <div className="py-7 pr-6 pl-7">
              <div className="flex items-center gap-3">
                <span className="rakam shrink-0 text-[10.5px] font-extrabold tracking-[0.14em] text-muted-foreground uppercase">
                  Kart {sira + 1}/{konu.kartlar.length}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mt-3 font-display text-[23px] leading-tight font-extrabold tracking-tight text-balance">
                {kart.baslik}
              </h3>
              <p className="mt-3 text-[16.5px] leading-relaxed font-medium text-pretty">
                {kart.metin}
              </p>
            </div>
          </article>
        </div>

        {/* İlerle geniş, Geri dar: ikisi eşit genişlikteyken destenin asıl
              yönü okunmuyordu. İlk kartta Geri pasif — gidilecek yer yok. */}
        <div className="mx-auto mt-4 flex w-full max-w-md gap-3">
          <Buton
            bicim="ikincil"
            onClick={geri}
            disabled={sira === 0}
            className="golge-kart h-13 flex-1 bg-card text-muted-foreground"
          >
            <ChevronLeft size={18} aria-hidden /> Geri
          </Buton>
          <Buton onClick={ilerle} className="h-13 flex-[1.45] text-[16px]">
            İlerle <ChevronRight size={18} aria-hidden />
          </Buton>
        </div>
      </div>
    </div>
  )
}
