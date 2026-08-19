'use client'

import { useRef } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * İki uçlu sayı çubuğu — Köklü Sayı Aralığı oyununun cevap aracı.
 *
 * Cevap bir sayı değil bir **aralık**, o yüzden tuş takımı değil çubuk: oyuncu
 * iki ucu sürükleyerek aralığı daraltıyor. Sayı doğrusunda düşünmek, köklü
 * sayının nereye düştüğünü zaten aynı şekilde gerektiriyor.
 *
 * Sürüklemenin yanında artı/eksi düğmeleri de var: 25 basamaklı bir çubukta
 * parmakla tek basamak isabet ettirmek dar ekranlarda zor, ve son bir basamağı
 * düzeltmek için bütün cevabı yeniden sürüklemek gerekirdi.
 */

export type Aralik = { alt: number; ust: number }

export function SayiCubugu({
  enAz,
  enCok,
  alt,
  ust,
  kilitli,
  durum,
  dogruAlt,
  onDegis,
}: {
  enAz: number
  enCok: number
  alt: number
  ust: number
  /** Cevap verildikten sonra çubuk donuyor. */
  kilitli: boolean
  /** Cevaptan sonraki renk; `null` ise henüz cevap verilmedi. */
  durum: 'dogru' | 'yanlis' | null
  /** Yanlış cevapta doğrunun nerede olduğunu gösteren işaret. */
  dogruAlt?: number
  /**
   * Yeni aralık — güncelleyici olarak veriliyor, hazır değer olarak değil.
   *
   * Artı/eksi düğmelerine hızlı hızlı basıldığında React araya render sokmuyor
   * ve her dokunuş **aynı** eski değerden hesap yapıyordu: beş dokunuş bir adım
   * ilerletiyordu. Güncelleyici biçiminde her dokunuş bir öncekinin sonucunu
   * görüyor.
   */
  onDegis: (guncelle: (onceki: Aralik) => Aralik) => void
}) {
  const izRef = useRef<HTMLDivElement>(null)
  /** Sürüklenen uç; sürükleme bitince null. */
  const tutulanRef = useRef<'alt' | 'ust' | null>(null)

  const yuzde = (deger: number) => ((deger - enAz) / (enCok - enAz)) * 100

  const degerOku = (clientX: number) => {
    const iz = izRef.current
    if (!iz) return enAz
    const kutu = iz.getBoundingClientRect()
    const oran = kutu.width > 0 ? (clientX - kutu.left) / kutu.width : 0
    return Math.min(enCok, Math.max(enAz, Math.round(oran * (enCok - enAz)) + enAz))
  }

  /** Uçlar birbirini geçemiyor: aralık en az bir birim kalıyor. */
  const tasi = (uc: 'alt' | 'ust', deger: number) => {
    onDegis((onceki) =>
      uc === 'alt'
        ? { alt: Math.max(enAz, Math.min(deger, onceki.ust - 1)), ust: onceki.ust }
        : { alt: onceki.alt, ust: Math.min(enCok, Math.max(deger, onceki.alt + 1)) },
    )
  }

  /** Artı/eksi: hedef değer bir öncekinin sonucundan hesaplanıyor. */
  const adimla = (uc: 'alt' | 'ust', fark: number) => {
    onDegis((onceki) =>
      uc === 'alt'
        ? { alt: Math.max(enAz, Math.min(onceki.alt + fark, onceki.ust - 1)), ust: onceki.ust }
        : { alt: onceki.alt, ust: Math.min(enCok, Math.max(onceki.ust + fark, onceki.alt + 1)) },
    )
  }

  const basildi = (olay: React.PointerEvent<HTMLDivElement>) => {
    if (kilitli) return
    const deger = degerOku(olay.clientX)
    // Hangi uç tutuldu: dokunulan yere yakın olan. Eşitlikte alt uç seçiliyor,
    // çünkü aralık soldan daraltılarak kuruluyor.
    const uc = Math.abs(deger - alt) <= Math.abs(deger - ust) ? 'alt' : 'ust'
    tutulanRef.current = uc
    olay.currentTarget.setPointerCapture(olay.pointerId)
    tasi(uc, deger)
  }

  const suruklendi = (olay: React.PointerEvent<HTMLDivElement>) => {
    const uc = tutulanRef.current
    if (kilitli || uc === null) return
    tasi(uc, degerOku(olay.clientX))
  }

  const birakildi = () => {
    tutulanRef.current = null
  }

  const doluRenk =
    durum === 'dogru' ? 'bg-success' : durum === 'yanlis' ? 'bg-ikincil' : 'bg-isl-ok'

  return (
    <div className="select-none">
      <div className="flex items-end justify-between px-0.5">
        <span className="text-[11px] font-extrabold text-muted-foreground">Aralığın</span>
        <span className="rakam font-display text-[19px] font-extrabold leading-none tracking-tight">
          {alt} – {ust}
        </span>
      </div>

      {/* Dokunma alanı çubuktan yüksek: 10 piksellik bir şeride parmakla
          isabet etmek zor, sürükleme de kolayca kopardı. */}
      <div
        className="relative mt-2 h-12 touch-none"
        onPointerDown={basildi}
        onPointerMove={suruklendi}
        onPointerUp={birakildi}
        onPointerCancel={birakildi}
      >
        <div
          ref={izRef}
          className="absolute inset-x-3 top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-foreground/10"
        >
          <span
            className={cn('absolute inset-y-0 rounded-full transition-colors', doluRenk)}
            style={{ left: `${yuzde(alt)}%`, width: `${yuzde(ust) - yuzde(alt)}%` }}
          />

          {/* Yanlış cevapta doğrunun yeri: ince yeşil bir bant. Sayıyı yazmak
              yerine çubukta göstermek, hatanın ne kadar uzağa düştüğünü de
              anlatıyor. */}
          {dogruAlt !== undefined && (
            <span
              className="absolute -inset-y-1 rounded-full border-[2.5px] border-success"
              style={{
                left: `${yuzde(dogruAlt)}%`,
                width: `${yuzde(dogruAlt + 1) - yuzde(dogruAlt)}%`,
              }}
            />
          )}

          <Tutamak deger={alt} sol={yuzde(alt)} kilitli={kilitli} />
          <Tutamak deger={ust} sol={yuzde(ust)} kilitli={kilitli} />
        </div>
      </div>

      {/* Ölçek: her sayının çentiği var, beşte bir sayısı yazılı. Yirmi beş
          rakamı yan yana yazmak mobilde okunmaz bir şerit yapardı. */}
      <div className="relative mx-3 h-6">
        {Array.from({ length: enCok - enAz + 1 }, (_, i) => enAz + i).map((deger) => {
          const yazili = deger === enAz || deger === enCok || deger % 5 === 0
          return (
            <span
              key={deger}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${yuzde(deger)}%` }}
            >
              <span
                aria-hidden
                className={cn(
                  'w-px rounded-full bg-foreground/25',
                  yazili ? 'h-2' : 'h-1.5 opacity-60',
                )}
              />
              {yazili && (
                <span className="rakam mt-0.5 text-[9.5px] font-bold text-muted-foreground">
                  {deger}
                </span>
              )}
            </span>
          )
        })}
      </div>

      <div className="mt-1 grid grid-cols-2 gap-2">
        <UcAyari
          etiket="Alt uç"
          deger={alt}
          kilitli={kilitli}
          azaltilabilir={alt > enAz}
          artirilabilir={alt < ust - 1}
          onAzalt={() => adimla('alt', -1)}
          onArtir={() => adimla('alt', 1)}
        />
        <UcAyari
          etiket="Üst uç"
          deger={ust}
          kilitli={kilitli}
          azaltilabilir={ust > alt + 1}
          artirilabilir={ust < enCok}
          onAzalt={() => adimla('ust', -1)}
          onArtir={() => adimla('ust', 1)}
        />
      </div>
    </div>
  )
}

function Tutamak({
  deger,
  sol,
  kilitli,
}: {
  deger: number
  sol: number
  kilitli: boolean
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'golge-kart absolute top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center',
        'rakam rounded-full border-2 border-isl-koyu bg-card text-[11px] font-extrabold text-isl-koyu',
        kilitli && 'opacity-70',
      )}
      style={{ left: `${sol}%` }}
    >
      {deger}
    </span>
  )
}

/** Bir ucun artı/eksi kutusu — sürüklemeden sonra son ayarı yapmak için. */
function UcAyari({
  etiket,
  deger,
  kilitli,
  azaltilabilir,
  artirilabilir,
  onAzalt,
  onArtir,
}: {
  etiket: string
  deger: number
  kilitli: boolean
  azaltilabilir: boolean
  artirilabilir: boolean
  onAzalt: () => void
  onArtir: () => void
}) {
  return (
    <div className="golge-kart flex items-center justify-between rounded-[15px] bg-card px-1.5 py-1.5">
      <Adim
        etiket={`${etiket} azalt`}
        edilgin={kilitli || !azaltilabilir}
        onBas={onAzalt}
      >
        <Minus size={16} aria-hidden />
      </Adim>

      <span className="flex flex-col items-center leading-none">
        <span className="rakam font-display text-[15px] font-extrabold">{deger}</span>
        <span className="mt-0.5 text-[9.5px] font-bold text-muted-foreground">{etiket}</span>
      </span>

      <Adim etiket={`${etiket} artır`} edilgin={kilitli || !artirilabilir} onBas={onArtir}>
        <Plus size={16} aria-hidden />
      </Adim>
    </div>
  )
}

function Adim({
  etiket,
  edilgin,
  onBas,
  children,
}: {
  etiket: string
  edilgin: boolean
  onBas: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={etiket}
      disabled={edilgin}
      onClick={onBas}
      className={cn(
        'grid h-8 w-8 shrink-0 place-items-center rounded-full transition',
        edilgin
          ? 'bg-muted text-muted-foreground/50'
          : 'bg-isl text-isl-koyu active:brightness-95',
      )}
    >
      {children}
    </button>
  )
}
