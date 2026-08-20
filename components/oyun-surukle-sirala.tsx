'use client'

import { useRef } from 'react'
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import type { SiraliOlay } from '@/lib/oyunlar/sirala-havuzu'
import { yilMetni } from '@/lib/oyunlar/sirala'
import { cn } from '@/lib/utils'

/**
 * Sürüklenerek sıralanan kart listesi — Zaman Şeridi'nin cevap aracı.
 *
 * Cevap bir seçim değil bir **düzen**, o yüzden şık da tuş takımı da işe
 * yaramıyor: oyuncunun kartları eliyle yerleştirmesi gerekiyor. Sayı
 * çubuğundaki gerekçenin aynısı — aracın kendisi düşünme biçimini taşıyor.
 *
 * Sürüklemenin yanında yukarı/aşağı okları da var: telefonu tek elle tutan
 * kullanıcı için uzun sürükleme zahmetli ve son bir kartı düzeltmek için bütün
 * listeyi yeniden dizmek gerekirdi. (`oyun-sayi-cubugu.tsx`'teki artı/eksi
 * düğmeleriyle aynı sebep.)
 */

/** Kart yüksekliği ve arası — sürükleme hesabı sabit adım istiyor. */
const KART_YUKSEKLIGI = 54
const ARALIK = 8
const ADIM = KART_YUKSEKLIGI + ARALIK

export function SurukleSirala({
  dizilim,
  kilitli,
  dogrusu,
  onDegis,
}: {
  dizilim: SiraliOlay[]
  /** Cevap verildikten sonra liste donuyor ve yıllar açılıyor. */
  kilitli: boolean
  /**
   * Doğru sıra — yalnızca cevaptan sonra veriliyor.
   *
   * Kartın kendi rengi buna göre: doğru yerde duran yeşil, kaymış olan kırmızı.
   * Doğrusunu ayrı bir liste hâlinde altta göstermek yerine aynı kartların
   * üzerinde işaretlemek, hatanın nerede olduğunu tek bakışta veriyor.
   */
  dogrusu?: SiraliOlay[]
  onDegis: (yeni: SiraliOlay[]) => void
}) {
  /** Sürüklenen kartın güncel konumu; sürükleme bitince null. */
  const tutulanRef = useRef<number | null>(null)
  /** Parmağın son okunan y'si — kart bir adım kayınca birlikte güncelleniyor. */
  const sonYRef = useRef(0)
  const kartRef = useRef<HTMLLIElement | null>(null)
  /** Sürüklenen kartın parmağı takip eden kaydırması (piksel). */
  const kaymaRef = useRef(0)

  /** Sürüklenen kartı ekranda parmağın altına taşır. */
  const kaydir = (piksel: number) => {
    kaymaRef.current = piksel
    if (kartRef.current) kartRef.current.style.transform = `translateY(${piksel}px)`
  }

  const basildi = (olay: React.PointerEvent<HTMLLIElement>, sira: number) => {
    if (kilitli) return
    tutulanRef.current = sira
    sonYRef.current = olay.clientY
    kartRef.current = olay.currentTarget
    kaydir(0)
    olay.currentTarget.setPointerCapture(olay.pointerId)
  }

  const suruklendi = (olay: React.PointerEvent<HTMLLIElement>) => {
    const tutulan = tutulanRef.current
    if (kilitli || tutulan === null) return

    const fark = olay.clientY - sonYRef.current
    kaydir(fark)

    /*
      Kart bir adımdan fazla kaydıysa yeri hemen değişiyor.

      Sürükleme bitince tek seferde hesaplamak yerine anlık takas: oyuncu
      bıraktığı yerin neresi olduğunu görerek karar veriyor. Takas olunca
      parmağın referans noktası da bir adım kayıyor, yoksa kart parmaktan
      kopardı.
    */
    const yon = fark > ADIM / 2 ? 1 : fark < -ADIM / 2 ? -1 : 0
    if (yon === 0) return

    const hedef = tutulan + yon
    if (hedef < 0 || hedef >= dizilim.length) return

    onDegis(tasi(dizilim, tutulan, hedef))
    tutulanRef.current = hedef
    sonYRef.current += yon * ADIM
    kaydir(olay.clientY - sonYRef.current)
  }

  const birakildi = () => {
    tutulanRef.current = null
    kaydir(0)
    kartRef.current = null
  }

  return (
    <ol className="select-none" style={{ display: 'grid', gap: ARALIK }}>
      {dizilim.map((olay, sira) => {
        // Kilitliyken kartın kendi rengi: doğru yerde mi durduğu.
        const yerinde = dogrusu ? dogrusu[sira]?.olay === olay.olay : false

        return (
          <li
            key={olay.olay}
            onPointerDown={(e) => basildi(e, sira)}
            onPointerMove={suruklendi}
            onPointerUp={birakildi}
            onPointerCancel={birakildi}
            style={{ height: KART_YUKSEKLIGI }}
            className={cn(
              'golge-kart relative flex touch-none items-center gap-2 rounded-[15px] border-2 bg-card pl-2 pr-1.5',
              kilitli
                ? yerinde
                  ? 'border-success'
                  : 'border-ikincil'
                : 'border-border active:brightness-95',
            )}
          >
            {/* Sıra numarası: "kaçıncı sıraya koydum" bilgisi sürüklerken
                kayboluyordu — liste yeniden dizildikçe göz takip edemiyor. */}
            <span
              className={cn(
                'rakam grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11.5px] font-extrabold',
                kilitli
                  ? yerinde
                    ? 'bg-success text-white'
                    : 'bg-ikincil text-white'
                  : 'bg-trh-kart text-trh-koyu',
              )}
            >
              {sira + 1}
            </span>

            <span className="min-w-0 flex-1 text-[12.5px] font-extrabold leading-tight">
              {olay.olay}
              {/* Yıl ancak cevaptan sonra açılıyor: sorunun kendisi o. */}
              {kilitli && (
                <span className="rakam mt-0.5 block text-[11px] font-bold text-muted-foreground">
                  {yilMetni(olay.yil)}
                </span>
              )}
            </span>

            {kilitli ? null : (
              <div className="flex shrink-0 items-center gap-0.5">
                <div className="flex flex-col">
                  <OkDugmesi
                    yon="yukari"
                    etkin={sira > 0}
                    onBas={() => onDegis(tasi(dizilim, sira, sira - 1))}
                  />
                  <OkDugmesi
                    yon="asagi"
                    etkin={sira < dizilim.length - 1}
                    onBas={() => onDegis(tasi(dizilim, sira, sira + 1))}
                  />
                </div>
                <GripVertical
                  size={16}
                  className="shrink-0 text-muted-foreground/60"
                  aria-hidden
                />
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Kartı bir konumdan ötekine taşır — araya girerek, yer değiştirerek değil.
 *
 * Takas (swap) yerine ekleme: iki kartın yerini değiştirmek uzun sürüklemelerde
 * aradaki kartları rastgele karıştırıyor, oysa oyuncunun beklediği şey kartın
 * araya girip ötekilerin kayması.
 */
function tasi(dizilim: readonly SiraliOlay[], kaynak: number, hedef: number): SiraliOlay[] {
  const kopya = [...dizilim]
  const [kart] = kopya.splice(kaynak, 1)
  kopya.splice(hedef, 0, kart)
  return kopya
}

function OkDugmesi({
  yon,
  etkin,
  onBas,
}: {
  yon: 'yukari' | 'asagi'
  etkin: boolean
  onBas: () => void
}) {
  const Simge = yon === 'yukari' ? ChevronUp : ChevronDown

  return (
    <button
      type="button"
      disabled={!etkin}
      aria-label={yon === 'yukari' ? 'Yukarı taşı' : 'Aşağı taşı'}
      // Sürükleme aynı kartın üstünde başlıyor: düğmeye basmak sürüklemeyi de
      // tetiklerse kart parmakla birlikte kayardı.
      onPointerDown={(olay) => olay.stopPropagation()}
      onClick={onBas}
      className={cn(
        'grid h-[22px] w-7 place-items-center rounded-[7px] transition',
        etkin ? 'text-trh-koyu active:bg-trh-kart' : 'text-muted-foreground/25',
      )}
    >
      <Simge size={15} aria-hidden />
    </button>
  )
}
