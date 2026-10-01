'use client'

import { ChevronRight } from 'lucide-react'
import type { GununHali as Hal } from '@/lib/gunun-hali'
import type { Ekran } from '@/lib/gezinme'
import { Rabi } from '@/components/maskot/rabi'

/**
 * "Bugün çalıştın mı" kartı — günün hâlini Rabi'nin pozuyla söylüyor.
 *
 * Cümleyi ve pozu `lib/gunun-hali.ts` seçiyor: eskiden üç sabit hâl vardı
 * (hiç soru / başladın / hedef tuttu), şimdi seri, banka, ders dengesi,
 * ihmal edilen ders, deneme ve sınav yakınlığından bir öneri çıkıyor; hiçbiri
 * tutmazsa üç hâl duruyor. Sayının kendisi burada yazmıyor; halka onu zaten
 * üç kez söylüyor ve kartın işi sayıyı tekrar etmek değil, ona bir yüz vermek.
 *
 * Hedef sıfırken `gununHali` null döner ve kart **çizilmiyor**: hedefi olmayan
 * kullanıcıda "ulaştın" da "ulaşmadın" da anlamsız — ölçülecek bir eşik yok.
 *
 * Dokunuş önerinin işaret ettiği ekranı açıyor (`hal.ekran`): bankayı
 * hatırlatan kart bankayı, denemeyi hatırlatan kart denemeleri.
 */
export function GununHali({ hal, onAc }: {
  hal: Hal | null
  onAc: (ekran: Ekran) => void
}) {
  if (!hal) return null

  return (
    <button
      type="button"
      onClick={() => onAc(hal.ekran)}
      className="golge-kart flex w-full items-center rounded-2xl bg-card py-3 pr-4 pl-4 text-left transition active:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {/* Maskotun arkasında bir süre hâle göre renklenen bir kutu vardı (gri,
          amber, yeşil); kaldırıldı. Düz renkli kare, kartın beyaz zemininde
          yapıştırılmış bir etiket gibi duruyordu — maskot kartın kendi
          zemininde duruyor. Arkasına bir süre soluk bir leke de kondu,
          kullanıcı onu da geri aldı.

          Maskot 72'de ve ayraca yakın: kartın sol dolgusu 16, ayraçla arası
          0 — görselin kendi saydam payı var, tavşan kutusunun ortasında daha
          dar duruyor ve ayraca yine de değmiyor. Bir süre iki yana 8'er
          piksel verilip tam ortalanmıştı; kullanıcı sağa kaydırılmasını
          istedi.

          Ayağının altında yumuşak bir zemin gölgesi var (bulanık elips,
          `foreground`un %12'si): tavşan kartın üstünde bir yere basıyor.
          `drop-shadow` değil — görselin çevresine sarılan gölge onu kâğıttan
          kesilmiş bir çıkartma gibi gösterirdi. Ayraç `--border` tonunda, beyazda soluk kalıyor ve
          kartın kenarlarına değmeden bitiyor (`self-stretch` içeriğin boyunu
          alıyor, `my-2` iki ucundan kısaltıyor). Birini değiştirirsen iki
          yandaki boşluğu yeniden eşitle. */}
      <span className="relative grid w-[72px] shrink-0 place-items-center">
        <span
          aria-hidden
          className="absolute bottom-0 left-[calc(50%-2px)] h-[7px] w-[36px] -translate-x-1/2 rounded-[50%] bg-foreground/12 blur-[2px]"
        />
        <span className="relative grid">
          <Rabi durum={hal.durum} poz={hal.poz} boyut={72} />
        </span>
      </span>
      <span aria-hidden className="my-2 mr-3 w-px shrink-0 self-stretch bg-border" />
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-extrabold tracking-[0.16em] text-muted-foreground">
          BUGÜN
        </span>
        <span className="mt-0.5 block font-display text-[15.5px] leading-tight font-extrabold tracking-tight">
          {hal.baslik}
        </span>
        <span className="mt-0.5 block text-[12.5px] font-semibold text-muted-foreground">
          {hal.alt}
        </span>
      </span>
      <ChevronRight size={19} className="ml-2 shrink-0 text-muted-foreground" aria-hidden />
    </button>
  )
}
