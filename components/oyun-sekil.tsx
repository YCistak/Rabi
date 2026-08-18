'use client'

import { yonde, type Sekil, type SekilParcasi } from '@/lib/oyunlar/sekil'
import { cn } from '@/lib/utils'

/**
 * Geometri sorularının şekli.
 *
 * Bileşenin tek işi çizmek: hangi çizginin nereden nereye gittiğini, yayın kaç
 * derece açık olduğunu `lib/oyunlar/sekil.ts` hesaplıyor. Ayrım bilerek keskin —
 * şekli burada kursaydık doğruluğu test edilemezdi.
 *
 * Renkler temadan: çizgi metin rengini takip ediyor (`currentColor`), aranan
 * açı/kenar ikincil renkte. Koyu temada da okunuyor, çünkü ikisi de tema
 * değişkeni.
 */
export function OyunSekli({ sekil, className }: { sekil: Sekil; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${sekil.genislik} ${sekil.yukseklik}`}
      className={cn('w-full', className)}
      role="img"
      aria-label="Soru şekli"
    >
      {sekil.parcalar.map((parca, sira) => (
        <Parca key={sira} parca={parca} />
      ))}
    </svg>
  )
}

/** Yayın SVG yolu. Süpürme yönü 0: SVG'de y aşağı büyüdüğü için saat yönünün tersi. */
function yayYolu(merkez: { x: number; y: number }, ilk: number, son: number, yaricap: number) {
  const bas = yonde(merkez, ilk, yaricap)
  const bit = yonde(merkez, son, yaricap)
  const genisMi = Math.abs(son - ilk) > 180 ? 1 : 0
  return `M ${bas.x} ${bas.y} A ${yaricap} ${yaricap} 0 ${genisMi} 0 ${bit.x} ${bit.y}`
}

function Parca({ parca }: { parca: SekilParcasi }) {
  switch (parca.tur) {
    case 'cizgi':
      return (
        <line
          x1={parca.bas.x}
          y1={parca.bas.y}
          x2={parca.son.x}
          y2={parca.son.y}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          // Uzatılmış kenar gibi yardımcı çizgiler soluk: şeklin kendisiyle
          // karışırsa üçgenin nerede bittiği anlaşılmıyor.
          className={parca.sonuk ? 'text-foreground/35' : 'text-foreground/80'}
          strokeDasharray={parca.sonuk ? '5 4' : undefined}
        />
      )

    case 'yay':
      return (
        <path
          d={yayYolu(parca.merkez, parca.ilk, parca.son, parca.yaricap)}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className={parca.vurgu ? 'text-ikincil' : 'text-isl-koyu'}
        />
      )

    case 'dikAci': {
      const boy = 13
      const bir = yonde(parca.kose, parca.ilk, boy)
      const iki = yonde(parca.kose, parca.son, boy)
      const kose = {
        x: bir.x + iki.x - parca.kose.x,
        y: bir.y + iki.y - parca.kose.y,
      }
      return (
        <path
          d={`M ${bir.x} ${bir.y} L ${kose.x} ${kose.y} L ${iki.x} ${iki.y}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="text-foreground/55"
        />
      )
    }

    case 'tik': {
      const bir = yonde(parca.orta, parca.aci + 90, 6)
      const iki = yonde(parca.orta, parca.aci - 90, 6)
      return (
        <line
          x1={bir.x}
          y1={bir.y}
          x2={iki.x}
          y2={iki.y}
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          className="text-foreground/60"
        />
      )
    }

    case 'yazi':
      return (
        <text
          x={parca.konum.x}
          y={parca.konum.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="currentColor"
          className={cn(
            'rakam font-display text-[15px] font-extrabold',
            parca.vurgu ? 'text-ikincil' : parca.sonuk ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {parca.metin}
        </text>
      )
  }
}
