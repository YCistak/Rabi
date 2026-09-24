import { Fragment } from 'react'
import { metniAyristir, type MetinParcasi } from '@/lib/konu/kart-metni'

/**
 * Bilgi kartının gövdesi — paragraflar ve maddeler.
 *
 * Biçim dili `lib/konu/kart-metni.ts`te. Madde imi bir nokta değil dersin
 * mürekkebinde küçük bir kare: kartın üstündeki şerit ve etiketin yanındaki
 * nokta da o renkte, üçü aynı yüzeyin parçası gibi okunuyor.
 *
 * Maddeler arasında satır aralığından biraz fazla pay var: iki satıra
 * kırılan bir madde ile iki ayrı madde, pay olmadan birbirinden ayrılmıyordu.
 */
export function KartMetni({ metin, murekkep }: { metin: string; murekkep: string }) {
  const bloklar = metniAyristir(metin)
  return (
    <div className="mt-4 space-y-3 text-[16.5px] leading-relaxed font-semibold text-foreground/80">
      {bloklar.map((blok, sira) =>
        blok.tur === 'paragraf' ? (
          <p key={sira} className="text-pretty">
            <Parcalar parcalar={blok.parcalar} />
          </p>
        ) : (
          <ul key={sira} className="space-y-1.5">
            {blok.maddeler.map((madde, i) => (
              <li key={i} className="flex gap-2.5">
                <span
                  aria-hidden
                  className="mt-[0.62em] size-[7px] shrink-0 rounded-[2px]"
                  style={{ background: murekkep }}
                />
                <span className="min-w-0 flex-1 text-pretty">
                  <Parcalar parcalar={madde} />
                </span>
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  )
}

function Parcalar({ parcalar }: { parcalar: MetinParcasi[] }) {
  return (
    <>
      {parcalar.map((p, i) =>
        p.vurgu ? (
          <strong key={i} className="font-extrabold text-foreground">
            {p.yazi}
          </strong>
        ) : (
          <Fragment key={i}>{p.yazi}</Fragment>
        ),
      )}
    </>
  )
}
