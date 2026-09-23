import { Fragment } from 'react'
import { formulParcalari } from '@/lib/oyunlar/formul'
import { denklemCoz, type Terim } from '@/lib/oyunlar/tepkime'
import { cn } from '@/lib/utils'

/**
 * Tepkime denklemini çizer: katsayı normal boyda, alt indis aşağıda, yük
 * yukarıda, hâl küçük ve soluk.
 *
 * Terimler satır sonunda **bölünmüyor**, satır terimlerin arasından kırılıyor:
 * "Pb(NO₃)₂(suda) + 2KI(suda) → …" telefonda tek satıra sığmıyor ve formülün
 * ortasından kırılan bir satır, alt indisi bir sonraki satıra atıp formülü
 * okunmaz yapıyordu.
 *
 * Unicode alt/üst simge rakamları kullanılmadı; gerekçe `lib/oyunlar/formul.ts`.
 */
export function DenklemYazisi({ denklem, className }: { denklem: string; className?: string }) {
  const { girenler, urunler } = denklemCoz(denklem)
  return (
    <span
      className={cn(
        'rakam inline-flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-1',
        className,
      )}
    >
      <Taraf terimler={girenler} />
      <span className="font-bold text-muted-foreground" aria-label="verir">
        →
      </span>
      <Taraf terimler={urunler} />
    </span>
  )
}

function Taraf({ terimler }: { terimler: Terim[] }) {
  return terimler.map((terim, sira) => (
    <Fragment key={sira}>
      {sira > 0 && <span className="text-muted-foreground">+</span>}
      <TerimYazisi terim={terim} />
    </Fragment>
  ))
}

function TerimYazisi({ terim }: { terim: Terim }) {
  return (
    <span className="whitespace-nowrap">
      {terim.katsayi > 1 && <span>{terim.katsayi}</span>}
      {formulParcalari(terim.formul).map((parca, sira) =>
        parca.alt ? (
          <sub key={sira} className="text-[0.68em]">
            {parca.metin}
          </sub>
        ) : (
          <span key={sira}>{parca.metin}</span>
        ),
      )}
      {terim.yuk && (
        // Yük "−" ile çiziliyor: tire kısa kalıyor ve üst simgede eksi gibi değil
        // bir kesme işareti gibi görünüyordu.
        <sup className="text-[0.62em]">{terim.yuk.replace('-', '−')}</sup>
      )}
      {terim.hal && (
        <span className="ml-px align-baseline text-[0.55em] font-bold text-muted-foreground">
          ({terim.hal})
        </span>
      )}
    </span>
  )
}
