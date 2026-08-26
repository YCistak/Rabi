'use client'

import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Sağa/sola kaydırılan karar kartı — Kural Tuzağı'nın cevap aracı.
 *
 * Şıkka dokunmakla aynı bilgiyi topluyor ama oyunun karakteri farklı: karar
 * tek bir hareket ve hareket **yarım bırakılabiliyor**. Kartı biraz itip
 * durmak, kararsızlığı ekranda görünür kılıyor; şıkta böyle bir ara durum yok.
 * Oyunun ölçtüğü şey hız olduğu için bu ara durumun kendisi geri bildirim.
 *
 * Kaydırma **tek yol**: altta ayrıca iki düğme duruyordu, kaldırıldı. İki
 * sebeple: düğmeler varken kimse kartı kaydırmıyordu (oyunun mekaniği
 * kullanılmadan kalıyordu) ve yön etiketleri kartın arkasında kalıp
 * okunmuyordu. Yön artık kartın **üstünde** duruyor — damga olarak kartın
 * kendisine biniyor, arkasına değil.
 */

/** Cevabın sayılması için kartın gitmesi gereken yatay mesafe (piksel). */
const ESIK = 88

/** Kartın en çok eğilme açısı — eşikteki eğim bu. */
const EN_COK_ACI = 11

export function KaydirmaKarti({
  metin,
  kilitli,
  sonuc,
  onCevap,
}: {
  /** Kartın üstündeki eşitlik. */
  metin: string
  /** Cevap verildikten sonra kart donuyor. */
  kilitli: boolean
  /**
   * Verilen cevap ve tuttu mu — yalnızca kilitliyken.
   *
   * `dogruDedi` null ise oyuncu cevap vermeden süre dolmuş demektir; kart
   * hiçbir yöne gitmemiş gibi duruyor.
   */
  sonuc: { dogruDedi: boolean | null; dogruMu: boolean } | null
  onCevap: (dogruDedi: boolean) => void
}) {
  /** Kartın parmakla gittiği yatay mesafe. Bırakınca sıfırlanıyor. */
  const [kayma, setKayma] = useState(0)
  const baslangicRef = useRef<number | null>(null)

  const basildi = (olay: React.PointerEvent<HTMLDivElement>) => {
    if (kilitli) return
    baslangicRef.current = olay.clientX
    olay.currentTarget.setPointerCapture(olay.pointerId)
  }

  const suruklendi = (olay: React.PointerEvent<HTMLDivElement>) => {
    if (kilitli || baslangicRef.current === null) return
    setKayma(olay.clientX - baslangicRef.current)
  }

  const birakildi = () => {
    if (kilitli || baslangicRef.current === null) return
    baslangicRef.current = null
    // Eşiği geçmeyen kaydırma cevap sayılmıyor: kart yerine dönüyor ve süre
    // işlemeye devam ediyor. Kararsızlık cevap değil.
    if (Math.abs(kayma) >= ESIK) onCevap(kayma > 0)
    setKayma(0)
  }

  /** Kilitliyken kart, verilen cevabın yönünde durmuş görünüyor. */
  const gosterilenKayma = kilitli
    ? sonuc?.dogruDedi === null || sonuc === null
      ? 0
      : sonuc.dogruDedi
        ? ESIK
        : -ESIK
    : kayma

  const oran = Math.max(-1, Math.min(1, gosterilenKayma / ESIK))

  return (
    <div className="flex flex-col gap-3">
      {/* Yön şeridi kartın **üstünde**, kaydırmadan önce de okunuyor: oyuncu
          ilk soruda hangi yönün ne demek olduğunu kartı itmeden görüyor.
          Aktif taraf kart o yöne gittikçe koyulaşıyor. */}
      <div className="flex flex-none items-center justify-between gap-2 px-0.5">
        <YonSeridi yon="yanlis" belirginlik={Math.max(0, -oran)} />
        <YonSeridi yon="dogru" belirginlik={Math.max(0, oran)} />
      </div>

      <div
        onPointerDown={basildi}
        onPointerMove={suruklendi}
        onPointerUp={birakildi}
        onPointerCancel={birakildi}
        style={{
          transform: `translateX(${gosterilenKayma}px) rotate(${oran * EN_COK_ACI}deg)`,
          // Sürüklerken geçiş yok — kart parmağın gerisinde kalırdı; bırakınca
          // ve kilitlenince yumuşak dönüş var.
          transition: baslangicRef.current === null ? 'transform 200ms' : 'none',
        }}
        className={cn(
          'golge-kart relative grid min-h-[240px] w-full touch-none place-items-center',
          'overflow-hidden rounded-[26px] border-2 px-5 py-8 text-center',
          kilitli
            ? sonuc?.dogruMu
              ? 'border-success bg-card'
              : 'border-ikincil bg-card'
            : 'border-border bg-card',
        )}
      >
        {/* Damga kartın üstünde duruyor, arkasında değil: kaydırırken görünen
            tek şey kartın kendisi olduğu için yön oradan okunmak zorunda. */}
        <Damga yon="yanlis" belirginlik={Math.max(0, -oran)} />
        <Damga yon="dogru" belirginlik={Math.max(0, oran)} />

        <p className="rakam font-display text-[23px] font-extrabold leading-snug tracking-tight">
          {metin}
        </p>
      </div>

      <p className="flex-none text-center text-[12px] font-semibold text-muted-foreground">
        Kartı sürükleyerek cevapla
      </p>
    </div>
  )
}

/**
 * Kartın üstündeki yön şeridi.
 *
 * `belirginlik` 0–1: kart o yöne gittikçe şerit doluyor. Sönük hâlde bile
 * okunuyor — mekaniği ilk kez gören oyuncunun kartı itmeden öğrenmesi gereken
 * bilgi bu.
 */
function YonSeridi({ yon, belirginlik }: { yon: 'dogru' | 'yanlis'; belirginlik: number }) {
  const Ok = yon === 'dogru' ? ArrowRight : ArrowLeft

  return (
    <span
      style={{ opacity: 0.45 + belirginlik * 0.55 }}
      className={cn(
        'flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border-2 text-[12.5px] font-extrabold uppercase tracking-wide transition-colors',
        yon === 'dogru'
          ? belirginlik > 0.35
            ? 'border-success bg-success text-white'
            : 'border-success/40 text-success'
          : belirginlik > 0.35
            ? 'border-ikincil bg-ikincil text-white'
            : 'border-ikincil/40 text-ikincil',
      )}
    >
      {yon === 'yanlis' && <Ok size={15} aria-hidden />}
      {yon === 'dogru' ? 'Doğru' : 'Yanlış'}
      {yon === 'dogru' && <Ok size={15} aria-hidden />}
    </span>
  )
}

/**
 * Kartın köşesine basılan damga.
 *
 * Eğik ve iri: kart kaydıkça büyüyüp belirginleşiyor, eşiği geçtiğinde
 * tamamen okunur oluyor. Oyuncunun parmağını kaldırmadan önce hangi cevabı
 * vermek üzere olduğunu görmesi gereken yer burası.
 */
function Damga({ yon, belirginlik }: { yon: 'dogru' | 'yanlis'; belirginlik: number }) {
  return (
    <span
      aria-hidden
      style={{
        opacity: belirginlik,
        transform: `rotate(${yon === 'dogru' ? -14 : 14}deg) scale(${0.8 + belirginlik * 0.2})`,
      }}
      className={cn(
        'pointer-events-none absolute top-5 rounded-xl border-[3px] px-3 py-1',
        'font-display text-[19px] font-extrabold uppercase tracking-wider',
        yon === 'dogru'
          ? 'right-4 border-success text-success'
          : 'left-4 border-ikincil text-ikincil',
      )}
    >
      {yon === 'dogru' ? 'Doğru' : 'Yanlış'}
    </span>
  )
}
