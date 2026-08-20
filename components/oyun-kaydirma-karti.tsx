'use client'

import { useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Sağa/sola kaydırılan karar kartı — Kural Tuzağı'nın cevap aracı.
 *
 * Şıkka dokunmakla aynı bilgiyi topluyor ama oyunun karakteri farklı: karar
 * tek bir hareket ve hareket **yarım bırakılabiliyor**. Kartı biraz itip
 * durmak, kararsızlığı ekranda görünür kılıyor; şıkta böyle bir ara durum yok.
 * Oyunun ölçtüğü şey hız olduğu için bu ara durumun kendisi geri bildirim.
 *
 * Kaydırmanın yanında iki düğme de duruyor. Kaydırma tek başına kalsaydı
 * mekaniği bilmeyen ilk turunu kaybederdi; düğmeler öğrenme tekerleği gibi
 * çalışıyor ve tanıtım metni kaydırmayı asıl yol olarak anlatıyor.
 */

/** Cevabın sayılması için kartın gitmesi gereken yatay mesafe (piksel). */
const ESIK = 96

/** Kartın en çok eğilme açısı — eşikteki eğim bu. */
const EN_COK_ACI = 12

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
      {/* Kartın altındaki iki hedef: hangi yöne gidileceği kart hareket
          etmeden de görünüyor, ilk turda mekaniği anlatan şey bu. */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-1">
          <YonEtiketi yon="yanlis" belirginlik={Math.max(0, -oran)} />
          <YonEtiketi yon="dogru" belirginlik={Math.max(0, oran)} />
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
            'golge-kart relative mx-auto grid min-h-[132px] w-[86%] touch-none place-items-center',
            'rounded-[22px] border-2 px-4 py-5 text-center',
            kilitli
              ? sonuc?.dogruMu
                ? 'border-success bg-card'
                : 'border-ikincil bg-card'
              : 'border-border bg-card',
          )}
        >
          <p className="rakam font-display text-[19px] font-extrabold leading-snug tracking-tight">
            {metin}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <KararDugmesi
          yon="yanlis"
          kilitli={kilitli}
          secilen={kilitli && sonuc?.dogruDedi === false}
          onBas={() => onCevap(false)}
        />
        <KararDugmesi
          yon="dogru"
          kilitli={kilitli}
          secilen={kilitli && sonuc?.dogruDedi === true}
          onBas={() => onCevap(true)}
        />
      </div>

      <p className="text-center text-[11.5px] font-semibold text-muted-foreground">
        Kartı sağa at: doğru · sola at: yanlış
      </p>
    </div>
  )
}

/**
 * Kartın arkasındaki yön etiketi.
 *
 * `belirginlik` 0–1: kart o yöne gittikçe etiket beliriyor. Sabit dursaydı
 * ekranda iki durağan söz olurdu; belirme, kaydırmanın hangi cevaba gittiğini
 * bırakmadan önce söylüyor.
 */
function YonEtiketi({ yon, belirginlik }: { yon: 'dogru' | 'yanlis'; belirginlik: number }) {
  return (
    <span
      style={{ opacity: 0.25 + belirginlik * 0.75, transform: `scale(${1 + belirginlik * 0.2})` }}
      className={cn(
        'rounded-full px-3 py-1.5 text-[12px] font-black uppercase tracking-wide',
        yon === 'dogru' ? 'bg-success text-white' : 'bg-ikincil text-white',
      )}
    >
      {yon === 'dogru' ? 'Doğru' : 'Yanlış'}
    </span>
  )
}

function KararDugmesi({
  yon,
  kilitli,
  secilen,
  onBas,
}: {
  yon: 'dogru' | 'yanlis'
  kilitli: boolean
  secilen: boolean
  onBas: () => void
}) {
  const Simge = yon === 'dogru' ? Check : X

  return (
    <button
      type="button"
      disabled={kilitli}
      onClick={onBas}
      className={cn(
        'golge-kart flex h-12 items-center justify-center gap-2 rounded-[16px] border-2',
        'font-display text-[14px] font-extrabold transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        !kilitli && 'border-border bg-card active:brightness-95',
        kilitli && !secilen && 'border-border bg-card opacity-45',
        secilen && yon === 'dogru' && 'border-success bg-success text-white',
        secilen && yon === 'yanlis' && 'border-ikincil bg-ikincil text-white',
      )}
    >
      <Simge size={17} aria-hidden />
      {yon === 'dogru' ? 'Doğru' : 'Yanlış'}
    </button>
  )
}
