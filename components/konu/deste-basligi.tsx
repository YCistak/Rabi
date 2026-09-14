'use client'

import { X } from 'lucide-react'
import type { HaritaTemasi } from '@/lib/konu/harita-temasi'
import { cn } from '@/lib/utils'

/**
 * Destenin üç ekranının (kart, kısa mola, hızlı kontrol) ortak başlığı:
 * kapatma düğmesi, konu adı, "Ders · Tema" satırı ve sağda ekrana özgü bir
 * kutu (sayfa numarası ya da "Kısa mola" rozeti).
 *
 * Üç ekran ayrı bileşen ama başlık tek: kullanıcı ara ekrana geçtiğinde
 * ekranın tepesi yerinde durmalı, yalnızca altı değişmeli. Üçünde ayrı
 * yazılsaydı biri zamanla kayardı — kurulum sihirbazındaki maskotla aynı
 * gerekçe.
 *
 * Kapatma düğmesi mockup'ta yalnızca kart ekranında var; burada üçünde de.
 * Molada ya da kontrolde desteden çıkmak isteyen kullanıcı, çıkış için önce
 * "İlerle"ye basıp bir karta varmak zorunda kalmamalı.
 */
export function DesteBasligi({
  konuAdi,
  dersAdi,
  temaAdi,
  onKapat,
  sag,
}: {
  konuAdi: string
  dersAdi: string
  temaAdi: string
  onKapat: () => void
  sag?: React.ReactNode
}) {
  return (
    <div className="mx-auto flex max-w-md items-center gap-3">
      {/* Kapatma beyaz bir kutu: zemin dersin rengiyle dolu ve o zeminin
          üstünde çerçevesiz bir simge dokunulabilir görünmüyordu. */}
      <button
        type="button"
        onClick={onKapat}
        aria-label="Kapat"
        className="golge-kart grid size-11 shrink-0 place-items-center rounded-[14px] bg-card text-foreground transition active:brightness-95"
      >
        <X size={19} strokeWidth={2.6} aria-hidden />
      </button>
      <div className="min-w-0 flex-1">
        <h2 className="truncate font-display text-[17px] leading-tight font-extrabold tracking-tight">
          {konuAdi}
        </h2>
        <p className="mt-0.5 truncate text-[11px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
          {dersAdi} · {temaAdi}
        </p>
      </div>
      {sag}
    </div>
  )
}

/**
 * Bölmeli ilerleme çubuğu — destede kaç kart olduğu tek bakışta okunuyor.
 *
 * Yalnızca **kartlar** sayılıyor; mola ve kontrol bölme almıyor. Ara
 * ekranlar bölme alsaydı çubuk "kaç kart kaldı"yı değil "kaç ekran kaldı"yı
 * söylerdi ve kullanıcının okuduğu kart sayısı çubuğa uymazdı.
 *
 * Açık olan kart (`acik`) ötekilerden geniş: hangi bölmede olunduğu yalnızca
 * renkten değil boydan da okunuyor. Ara ekranlarda açık kart yok, okunanlar
 * dolu duruyor.
 *
 * Geçilen bölmeler dersin mürekkep rengine yarı saydam boyalı; `color-mix`
 * eski WebView'da yok, o yüzden ton opaklıkla veriliyor.
 */
export function DesteCubugu({
  toplam,
  okunan,
  acik,
  bicim,
}: {
  toplam: number
  /** Okunmuş kart sayısı (dolu bölme). */
  okunan: number
  /** Şu an açık olan kartın sırası (0'dan); ara ekranda `undefined`. */
  acik?: number
  bicim: HaritaTemasi
}) {
  return (
    <div className="mx-auto mt-4 flex max-w-md gap-1.5" aria-hidden>
      {Array.from({ length: toplam }, (_, i) => {
        const gecildi = i < okunan && i !== acik
        const bu = i === acik
        return (
          <span
            key={i}
            className={cn(
              'h-[5px] rounded-full transition-[flex-grow,opacity] duration-200',
              !gecildi && !bu && 'bg-black/10',
            )}
            style={{
              flexGrow: bu ? 2.2 : 1,
              background: gecildi || bu ? bicim.murekkep : undefined,
              opacity: gecildi ? 0.45 : 1,
            }}
          />
        )
      })}
    </div>
  )
}

/** Sağ üstteki beyaz rozet — "Kısa mola", "Hızlı kontrol". Yazı dersin mürekkebinde. */
export function DesteRozeti({
  bicim,
  children,
}: {
  bicim: HaritaTemasi
  children: React.ReactNode
}) {
  return (
    <span
      className="golge-kart inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-full bg-card px-3 text-[11px] font-bold tracking-[0.12em] uppercase"
      style={{ color: bicim.murekkep }}
    >
      {children}
    </span>
  )
}
