import type { ReactElement } from 'react'
import type { KategoriKimlikleri } from '@/lib/magaza/esyalar'
import { ANATOMI } from '../olculer'

/**
 * Üst kıyafetler.
 *
 * Gövdenin (`ANATOMI.govde`) üstüne ve kolların bir kısmına oturuyorlar.
 * Kesim tek tip: omuzdan bele inen yuvarlatılmış bir dikdörtgen ve iki kısa
 * kol. Her kıyafet bunu kendi rengiyle çizip üstüne kendi detayını koyuyor —
 * ortak bir "Gövde" bileşeni var ki yenisini eklemek beş satır olsun.
 *
 * Pelerin gibi arkadan sarkan parçalar `UST_ARKASI` içinde: onlar gövdenin
 * **önüne** çizilseydi tavşanı örterlerdi.
 *
 * Hiçbiri gerçek bir markaya, takıma ya da karaktere ait değil; forma
 * numaralı ama armasız, kolej ceketi harfli ama okulsuz.
 */

const CIZGI = '#1b2440'
const { govde, kol } = ANATOMI
/** Kumaşın gövdeden biraz taşan sınırları. */
const SOL = govde.sol - 2
const SAG = govde.sag + 2
const UST = govde.ust + 10
const ALT = govde.alt - 12

export const USTLER: Record<KategoriKimlikleri<'ust'>, () => ReactElement> = {
  'ust-hoodie-mavi': () => <Hoodie renk="#4a8fe7" koyu="#2f6cbb" />,
  'ust-hoodie-kirmizi': () => <Hoodie renk="#ef5a52" koyu="#c33d36" />,
  'ust-hoodie-siyah': () => <Hoodie renk="#333a57" koyu="#1f2437" />,
  'ust-kravat': Kravat,
  'ust-pijama': Pijama,
  'ust-forma': Forma,
  'ust-asci': AsciOnlugu,
  'ust-onluk': LaboratuvarOnlugu,
  'ust-kolej': KolejCeketi,
  'ust-pelerin': PelerinTokasi,
  'ust-astronot': AstronotElbisesi,
  'ust-samuray': SamurayZirhi,
}

/**
 * Gövdenin **arkasına** çizilen üstler.
 *
 * Pelerinin kumaşı ve kapüşon buraya ait: ikisi de önde çizilseydi biri
 * tavşanı örter, öteki başın altında büsbütün kaybolurdu.
 */
export const UST_ARKASI: Record<string, () => ReactElement> = {
  'ust-pelerin': PelerinKumasi,
  'ust-hoodie-mavi': () => <Kapuson renk="#2f6cbb" />,
  'ust-hoodie-kirmizi': () => <Kapuson renk="#c33d36" />,
  'ust-hoodie-siyah': () => <Kapuson renk="#1f2437" />,
}

/** Omuzların arkasında duran kapüşon; başın iki yanından görünüyor. */
function Kapuson({ renk }: { renk: string }) {
  return (
    <path
      d={`M56 ${UST + 8} q44 -54 88 0 q-44 22 -88 0 z`}
      fill={renk}
      stroke={CIZGI}
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  )
}

/**
 * Ortak gömlek kalıbı: gövde + iki kol.
 *
 * `kolRenk` verilmezse kollar gövdeyle aynı; kolej ceketinde farklı.
 */
function Govde({
  renk,
  kolRenk,
  cizgi = CIZGI,
}: {
  renk: string
  kolRenk?: string
  cizgi?: string
}) {
  return (
    <g stroke={cizgi} strokeWidth="2.4" strokeLinejoin="round">
      <rect
        x={kol.solX - 10}
        y={kol.ust - 2}
        width="20"
        height="38"
        rx="10"
        fill={kolRenk ?? renk}
      />
      <rect
        x={kol.sagX - 10}
        y={kol.ust - 2}
        width="20"
        height="38"
        rx="10"
        fill={kolRenk ?? renk}
      />
      <rect x={SOL} y={UST} width={SAG - SOL} height={ALT - UST} rx="20" fill={renk} />
    </g>
  )
}

/** Boyun oyuntusu — çoğu kıyafette aynı V. */
function Yaka({ renk = '#ffffff' }: { renk?: string }) {
  return (
    <path
      d={`M88 ${UST} q12 14 24 0`}
      fill={renk}
      stroke={CIZGI}
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  )
}

function Hoodie({ renk, koyu }: { renk: string; koyu: string }) {
  return (
    <g>
      <Govde renk={renk} />
      {/* Kanguru cebi ve ipler. */}
      <path
        d={`M80 ${ALT - 30} h40 v18 q-20 8 -40 0 z`}
        fill={koyu}
        stroke={CIZGI}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <g stroke="#f2f5fb" strokeWidth="2.6" strokeLinecap="round">
        <path d={`M94 ${UST + 8} v14`} />
        <path d={`M106 ${UST + 8} v14`} />
      </g>
    </g>
  )
}

function Kravat() {
  /*
    Kravat tek başına giyiliyor: altında gömlek yok, kürkün üstünde duruyor.
    Küçük bir yaka çiziliyor ki havada asılı kalmasın.
  */
  return (
    <g stroke={CIZGI} strokeWidth="2.4" strokeLinejoin="round">
      <path d={`M84 ${UST - 2} L100 ${UST + 16} L116 ${UST - 2} L108 ${UST - 8} L92 ${UST - 8} z`} fill="#ffffff" />
      <path d={`M94 ${UST + 6} h12 l-3 8 h-6 z`} fill="#c33d36" />
      <path d={`M97 ${UST + 14} h6 l5 34 -8 8 -8 -8 z`} fill="#ef5a52" />
    </g>
  )
}

function Pijama() {
  return (
    <g>
      <Govde renk="#b8c6f0" />
      <Yaka renk="#e6ecfb" />
      {/* Yıldız deseni — pijamayı pijama yapan şey. */}
      <g fill="#5d6fb5" opacity="0.8">
        {[
          [80, UST + 22],
          [116, UST + 34],
          [92, UST + 48],
          [122, UST + 58],
          [78, UST + 60],
        ].map(([x, y], i) => (
          <path
            key={i}
            d={`M${x} ${y} l1.8 4.2 4.2 1.8 -4.2 1.8 -1.8 4.2 -1.8 -4.2 -4.2 -1.8 4.2 -1.8z`}
          />
        ))}
      </g>
      <g fill="#5d6fb5">
        <circle cx="100" cy={UST + 30} r="2.4" />
        <circle cx="100" cy={UST + 46} r="2.4" />
        <circle cx="100" cy={UST + 62} r="2.4" />
      </g>
    </g>
  )
}

function Forma() {
  return (
    <g>
      <Govde renk="#f2f5fb" />
      {/* Dikey şeritler: takım yok, desen var. */}
      <g fill="#2b7a4b">
        <rect x={SOL + 8} y={UST + 2} width="9" height={ALT - UST - 4} />
        <rect x={SOL + 26} y={UST + 2} width="9" height={ALT - UST - 4} />
        <rect x={SOL + 44} y={UST + 2} width="9" height={ALT - UST - 4} />
        <rect x={SOL + 62} y={UST + 2} width="9" height={ALT - UST - 4} />
      </g>
      <rect
        x={SOL}
        y={UST}
        width={SAG - SOL}
        height={ALT - UST}
        rx="20"
        fill="none"
        stroke={CIZGI}
        strokeWidth="2.4"
      />
      <Yaka />
      <text
        x="100"
        y={ALT - 16}
        textAnchor="middle"
        fontSize="26"
        fontWeight="800"
        fill="#1b2440"
        stroke="none"
      >
        7
      </text>
    </g>
  )
}

function AsciOnlugu() {
  return (
    <g stroke={CIZGI} strokeWidth="2.4" strokeLinejoin="round">
      {/* Boyun ipi ve önlük — gömlek yok, önlük doğrudan kürkün üstünde. */}
      <path d={`M88 ${UST - 4} q12 12 24 0`} fill="none" strokeWidth="3" />
      <path
        d={`M82 ${UST + 8} h36 q6 0 6 8 v${ALT - UST - 4} q-24 8 -48 0 v${-(ALT - UST - 4)} q0 -8 6 -8 z`}
        fill="#f7f9ff"
      />
      <rect x="88" y={ALT - 28} width="24" height="16" rx="3" fill="#e2e7f2" />
      {/* Kuşak */}
      <rect x={SOL + 2} y={UST + 36} width={SAG - SOL - 4} height="9" rx="4.5" fill="#e05a63" />
    </g>
  )
}

function LaboratuvarOnlugu() {
  return (
    <g>
      <Govde renk="#f7f9ff" />
      {/* Yakalar ve orta açıklık — önlüğü gömlekten ayıran şey. */}
      <g stroke={CIZGI} strokeWidth="2.2" strokeLinejoin="round" fill="#e8edf7">
        <path d={`M86 ${UST} L100 ${UST + 18} L92 ${UST + 26} L78 ${UST + 8} z`} />
        <path d={`M114 ${UST} L100 ${UST + 18} L108 ${UST + 26} L122 ${UST + 8} z`} />
      </g>
      <path d={`M100 ${UST + 18} V${ALT}`} stroke={CIZGI} strokeWidth="1.8" />
      <rect x={SOL + 8} y={ALT - 30} width="20" height="15" rx="2" fill="#e8edf7" stroke={CIZGI} strokeWidth="1.8" />
      {/* Cepteki kalem — beyaz önlüğe kimlik veren tek detay. */}
      <path d={`M${SOL + 14} ${ALT - 36} v12`} stroke="#4a8fe7" strokeWidth="3.4" strokeLinecap="round" />
      <g fill="#4a8fe7">
        <circle cx="100" cy={UST + 34} r="2.6" />
        <circle cx="100" cy={UST + 50} r="2.6" />
      </g>
    </g>
  )
}

function KolejCeketi() {
  return (
    <g>
      <Govde renk="#3c4a7a" kolRenk="#f2f5fb" />
      {/* Kaburga lastikleri ve düğmeler — kolej ceketinin imzası. */}
      <rect x={SOL} y={ALT - 12} width={SAG - SOL} height="10" rx="5" fill="#f2f5fb" stroke={CIZGI} strokeWidth="2.2" />
      <path d={`M100 ${UST + 4} V${ALT - 12}`} stroke={CIZGI} strokeWidth="1.8" />
      <g fill="#f2f5fb" stroke={CIZGI} strokeWidth="1.4">
        <circle cx="100" cy={UST + 22} r="3" />
        <circle cx="100" cy={UST + 38} r="3" />
        <circle cx="100" cy={UST + 54} r="3" />
      </g>
      <text
        x={SOL + 20}
        y={UST + 34}
        textAnchor="middle"
        fontSize="20"
        fontWeight="800"
        fill="#ffd45e"
        stroke="none"
      >
        R
      </text>
    </g>
  )
}

function PelerinKumasi() {
  return (
    <path
      d={`M74 ${UST} q-30 44 -22 90 q48 14 96 0 q8 -46 -22 -90 z`}
      fill="#c8322b"
      stroke={CIZGI}
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  )
}

function PelerinTokasi() {
  return (
    <g stroke={CIZGI} strokeWidth="2.4" strokeLinejoin="round">
      <path d={`M78 ${UST - 2} q22 12 44 0 q-4 12 -22 12 q-18 0 -22 -12 z`} fill="#e0463d" />
      <circle cx="100" cy={UST + 4} r="5" fill="#ffd45e" />
    </g>
  )
}

function AstronotElbisesi() {
  return (
    <g>
      <Govde renk="#f2f5fb" />
      {/* Göğüs paneli ve hortumlar. */}
      <rect
        x="82"
        y={UST + 22}
        width="36"
        height="26"
        rx="5"
        fill="#8b94a8"
        stroke={CIZGI}
        strokeWidth="2.2"
      />
      <g fill="#4a8fe7">
        <circle cx="90" cy={UST + 31} r="3" />
        <circle cx="100" cy={UST + 31} r="3" fill="#ef5a52" />
        <circle cx="110" cy={UST + 31} r="3" fill="#5fcf8b" />
      </g>
      <rect x="88" y={UST + 39} width="24" height="4" rx="2" fill="#c9d2e0" />
      <path
        d={`M82 ${UST + 26} q-14 6 -12 22`}
        fill="none"
        stroke="#c9d2e0"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d={`M118 ${UST + 26} q14 6 12 22`}
        fill="none"
        stroke="#c9d2e0"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <g stroke="#ef5a52" strokeWidth="3" strokeLinecap="round">
        <path d={`M${kol.solX - 8} ${kol.ust + 16} h16`} />
        <path d={`M${kol.sagX - 8} ${kol.ust + 16} h16`} />
      </g>
    </g>
  )
}

function SamurayZirhi() {
  return (
    <g>
      <Govde renk="#3a2f44" />
      {/* Lamel sıraları — zırhı zırh yapan yatay plakalar. */}
      <g fill="#8b2f2a" stroke={CIZGI} strokeWidth="1.8">
        <rect x={SOL + 4} y={UST + 18} width={SAG - SOL - 8} height="12" rx="3" />
        <rect x={SOL + 4} y={UST + 33} width={SAG - SOL - 8} height="12" rx="3" />
        <rect x={SOL + 4} y={UST + 48} width={SAG - SOL - 8} height="12" rx="3" />
      </g>
      {/* Omuz koruyucular */}
      <g fill="#8b2f2a" stroke={CIZGI} strokeWidth="2.2" strokeLinejoin="round">
        <path d={`M${kol.solX - 14} ${kol.ust - 4} h26 l-4 22 h-22 z`} />
        <path d={`M${kol.sagX - 12} ${kol.ust - 4} h26 l4 22 h-22 z`} />
      </g>
      <path d={`M86 ${UST} q14 12 28 0 l-6 12 h-16 z`} fill="#d8a029" stroke={CIZGI} strokeWidth="2.2" strokeLinejoin="round" />
    </g>
  )
}
