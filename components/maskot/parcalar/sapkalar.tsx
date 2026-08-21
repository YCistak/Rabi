import type { ReactElement } from 'react'
import type { KategoriKimlikleri } from '@/lib/magaza/esyalar'
import { ANATOMI } from '../olculer'

/**
 * Şapkalar.
 *
 * Hepsi başın tepesine (`ANATOMI.bas`) oturuyor ve kulakların arasında
 * kalıyor: kulaklar dışa yatık çizildiği için tepe boş ve şapka kulakları
 * kesmiyor. Yeni bir şapka eklerken kuralı koru — tacın genişliği kabaca
 * x 74–126 arası, tepesi y 30'un altına inmesin.
 *
 * Çizimler kasten jenerik: hiçbiri tanınan bir markanın, filmin ya da
 * karakterin şapkası değil. (`lib/magaza/esyalar.ts`)
 */

const CIZGI = '#1b2440'
const { bas } = ANATOMI
/** Başın tepe noktası — bütün şapkalar buradan başlıyor. */
const TEPE = bas.y - bas.ry

export const SAPKALAR: Record<KategoriKimlikleri<'sapka'>, () => ReactElement> = {
  'sapka-bere': Bere,
  'sapka-parti': PartiSapkasi,
  'sapka-kulaklik': Kulaklik,
  'sapka-dedektif': DedektifSapkasi,
  'sapka-maske': KahramanMaskesi,
  'sapka-sihirbaz': SihirbazSapkasi,
  'sapka-tac': KralTaci,
}

function Bere() {
  return (
    <g>
      {/* Kubbe: başın eğrisine oturan, üstü yuvarlak bir kaput. */}
      <path
        d={`M62 ${TEPE + 12} q38 -46 76 0 z`}
        fill="#e05a63"
        stroke={CIZGI}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Kıvrık kenar — berenin kaşa doğru katlanan bandı. */}
      <rect
        x="58"
        y={TEPE + 6}
        width="84"
        height="15"
        rx="7.5"
        fill="#f2f5fb"
        stroke={CIZGI}
        strokeWidth="2.4"
      />
      <circle cx="100" cy={TEPE - 26} r="9" fill="#f2f5fb" stroke={CIZGI} strokeWidth="2.4" />
    </g>
  )
}

function PartiSapkasi() {
  return (
    <g>
      <path
        d={`M78 ${TEPE + 10} L100 ${TEPE - 44} L122 ${TEPE + 10} z`}
        fill="#4a8fe7"
        stroke={CIZGI}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Şeritler — koninin eğimini takip eden iki bant. */}
      <path d={`M85 ${TEPE - 6} l30 0`} stroke="#ffd45e" strokeWidth="4" strokeLinecap="round" />
      <path d={`M91 ${TEPE - 22} l18 0`} stroke="#ef5a52" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy={TEPE - 48} r="6" fill="#ffd45e" stroke={CIZGI} strokeWidth="2.2" />
    </g>
  )
}

function Kulaklik() {
  return (
    <g stroke={CIZGI} strokeWidth="2.4">
      {/* Kafa bandı başın üstünden geçiyor, kulakların önünden iniyor. */}
      <path d={`M56 ${bas.y - 4} q44 -62 88 0`} fill="none" strokeWidth="7" strokeLinecap="round" />
      <path d={`M56 ${bas.y - 4} q44 -62 88 0`} fill="none" stroke="#5b6478" strokeWidth="4.5" />
      <rect x="42" y={bas.y - 12} width="22" height="34" rx="9" fill="#5b6478" />
      <rect x="136" y={bas.y - 12} width="22" height="34" rx="9" fill="#5b6478" />
      <rect x="47" y={bas.y - 6} width="12" height="22" rx="6" fill="#8b94a8" strokeWidth="1.6" />
      <rect x="141" y={bas.y - 6} width="12" height="22" rx="6" fill="#8b94a8" strokeWidth="1.6" />
    </g>
  )
}

function DedektifSapkasi() {
  return (
    <g stroke={CIZGI} strokeWidth="2.4" strokeLinejoin="round">
      {/* Önde ve arkada siperi olan av şapkası: iki yana taşan elips. */}
      <ellipse cx="100" cy={TEPE + 12} rx="52" ry="11" fill="#9c7d5a" />
      <path d={`M64 ${TEPE + 12} q36 -42 72 0 z`} fill="#b08f68" />
      {/* Yan kapaklar — kulakların önüne inen kumaş. */}
      <ellipse cx="60" cy={TEPE + 16} rx="13" ry="16" fill="#9c7d5a" />
      <ellipse cx="140" cy={TEPE + 16} rx="13" ry="16" fill="#9c7d5a" />
      <path
        d={`M76 ${TEPE - 8} q24 -12 48 0`}
        fill="none"
        stroke="#7d6244"
        strokeWidth="2.2"
      />
    </g>
  )
}

function KahramanMaskesi() {
  const { goz } = ANATOMI
  return (
    <g>
      {/* Göz bandı: gözlerin üstünü örten, şakaklara kadar uzanan maske. */}
      <path
        d={`M${goz.solX - 30} ${goz.y - 12} q30 -12 60 0 q4 20 -6 26 q-24 6 -48 0 q-10 -6 -6 -26 z`}
        fill="#2b3ea8"
        stroke={CIZGI}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Göz delikleri — altındaki gözler görünsün diye zemin rengi değil, boşluk. */}
      <ellipse cx={goz.solX} cy={goz.y} rx="10" ry="8" fill="#ffffff" />
      <ellipse cx={goz.sagX} cy={goz.y} rx="10" ry="8" fill="#ffffff" />
      <ellipse cx={goz.solX} cy={goz.y} rx="5.5" ry="6.5" fill={CIZGI} />
      <ellipse cx={goz.sagX} cy={goz.y} rx="5.5" ry="6.5" fill={CIZGI} />
    </g>
  )
}

function SihirbazSapkasi() {
  return (
    <g stroke={CIZGI} strokeWidth="2.4" strokeLinejoin="round">
      {/* Geniş kenar + hafif eğik uzun koni. */}
      <ellipse cx="100" cy={TEPE + 12} rx="56" ry="12" fill="#4b3b8f" />
      <path d={`M76 ${TEPE + 12} q4 -44 34 -62 q6 34 12 62 z`} fill="#5c4aa8" />
      <path d={`M78 ${TEPE + 2} q26 10 42 -2`} stroke="#ffd45e" strokeWidth="5" fill="none" />
      <g fill="#ffd45e" stroke="none">
        <path d={`M96 ${TEPE - 22} l2.4 5.6 5.6 2.4 -5.6 2.4 -2.4 5.6 -2.4 -5.6 -5.6 -2.4 5.6 -2.4z`} />
        <path d={`M88 ${TEPE - 44} l1.8 4.2 4.2 1.8 -4.2 1.8 -1.8 4.2 -1.8 -4.2 -4.2 -1.8 4.2 -1.8z`} />
      </g>
    </g>
  )
}

function KralTaci() {
  return (
    <g stroke={CIZGI} strokeWidth="2.4" strokeLinejoin="round">
      <path
        d={`M70 ${TEPE + 10} L70 ${TEPE - 20} L85 ${TEPE - 4} L100 ${TEPE - 26} L115 ${TEPE - 4} L130 ${TEPE - 20} L130 ${TEPE + 10} z`}
        fill="#f3c552"
      />
      <rect x="68" y={TEPE + 6} width="64" height="10" rx="5" fill="#d8a029" />
      <circle cx="70" cy={TEPE - 22} r="4" fill="#ef5a52" />
      <circle cx="130" cy={TEPE - 22} r="4" fill="#ef5a52" />
      <circle cx="100" cy={TEPE - 29} r="4.5" fill="#4a8fe7" />
      <circle cx="100" cy={TEPE + 11} r="3.4" fill="#4a8fe7" strokeWidth="1.6" />
    </g>
  )
}
