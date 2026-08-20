import type { ReactElement, SVGProps } from 'react'
import type { KategoriKimlikleri } from '@/lib/magaza/esyalar'
import { ANATOMI, TUVAL } from '../olculer'

/**
 * Sırt aksesuarları.
 *
 * Neredeyse tamamı gövdenin **arkasında**: kanat da jetpack de sırttan
 * çıkıyor. Önde görünen tek şey askılar, onlar da `SIRT_ONU` içinde.
 *
 * Simetrik parçalar tek yol yazılıp `Aynala` ile yansıtılıyor — sağ kanadı
 * elle yazmak, iki kanadın er geç birbirini tutmaması demekti.
 */

const CIZGI = '#1b2440'
const { govde } = ANATOMI

export const SIRT_ARKASI: Record<KategoriKimlikleri<'sirt'>, () => ReactElement> = {
  'sirt-canta': CantaGovdesi,
  'sirt-jetpack': JetpackTupleri,
  'sirt-melek': MelekKanatlari,
  'sirt-seytan': SeytanKanatlari,
}

export const SIRT_ONU: Record<string, () => ReactElement> = {
  'sirt-canta': CantaAskilari,
  'sirt-jetpack': JetpackAskilari,
}

/** Bir yolu x = 100 ekseninde yansıtır: sol çizilir, sağ kendiliğinden gelir. */
function Aynala({ d, ...ozellikler }: { d: string } & SVGProps<SVGPathElement>) {
  return (
    <g>
      <path d={d} {...ozellikler} />
      <path d={d} {...ozellikler} transform={`translate(${TUVAL.genislik} 0) scale(-1 1)`} />
    </g>
  )
}

function CantaGovdesi() {
  return (
    <g stroke={CIZGI} strokeWidth="2.4" strokeLinejoin="round">
      <rect
        x={govde.sol - 12}
        y={govde.ust + 8}
        width={govde.sag - govde.sol + 24}
        height="76"
        rx="14"
        fill="#c33d36"
      />
      <rect x={govde.sol - 8} y={govde.ust + 52} width={govde.sag - govde.sol + 16} height="24" rx="8" fill="#9e2f29" />
    </g>
  )
}

function CantaAskilari() {
  return (
    <Aynala
      d={`M84 ${govde.ust + 4} q-14 26 -10 56`}
      fill="none"
      stroke="#9e2f29"
      strokeWidth="8"
      strokeLinecap="round"
    />
  )
}

function JetpackTupleri() {
  const ust = govde.ust + 12
  return (
    <g stroke={CIZGI} strokeWidth="2.4" strokeLinejoin="round">
      <Aynala d={`M${govde.sol - 20} ${ust} h18 v70 h-18 z`} fill="#c9d2e0" />
      <Aynala d={`M${govde.sol - 20} ${ust + 10} h18 v10 h-18 z`} fill="#ef5a52" />
      {/* Alev — jetpack'i durur hâlde çizmek anlamsız olurdu. */}
      <Aynala d={`M${govde.sol - 17} ${ust + 70} q6 18 6 26 q-8 -4 -12 -26 z`} fill="#ffd45e" stroke="none" />
      <Aynala d={`M${govde.sol - 15} ${ust + 70} q4 12 4 17 q-5 -3 -8 -17 z`} fill="#ef7a3a" stroke="none" />
    </g>
  )
}

function JetpackAskilari() {
  return (
    <Aynala
      d={`M86 ${govde.ust + 4} q-12 22 -9 46`}
      fill="none"
      stroke="#8b94a8"
      strokeWidth="7"
      strokeLinecap="round"
    />
  )
}

function MelekKanatlari() {
  return (
    <g>
      <Aynala
        d={`M78 ${govde.ust + 6} q-40 -18 -56 18 q-14 30 8 52 q26 16 44 -14 q10 -20 4 -56 z`}
        fill="#f7f9ff"
        stroke={CIZGI}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Tüy çizgileri — düz beyaz bir leke yerine kanat okunması için. */}
      <Aynala
        d={`M64 ${govde.ust + 26} q-16 10 -20 30`}
        fill="none"
        stroke="#c9d2e0"
        strokeWidth="2.2"
      />
      <Aynala
        d={`M60 ${govde.ust + 46} q-12 8 -14 22`}
        fill="none"
        stroke="#c9d2e0"
        strokeWidth="2.2"
      />
    </g>
  )
}

function SeytanKanatlari() {
  return (
    <g>
      <Aynala
        d={`M78 ${govde.ust + 8} q-34 -12 -54 6 q10 6 12 16 q-14 2 -18 12 q16 6 18 18 q-10 6 -8 16 q30 6 46 -22 q8 -20 4 -46 z`}
        fill="#8b2f2a"
        stroke={CIZGI}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <Aynala
        d={`M74 ${govde.ust + 20} q-24 6 -38 22`}
        fill="none"
        stroke="#5e1f1c"
        strokeWidth="2.2"
      />
    </g>
  )
}
