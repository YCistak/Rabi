import type { ReactElement } from 'react'
import type { KategoriKimlikleri } from '@/lib/magaza/esyalar'
import { ANATOMI } from '../olculer'

/**
 * Alt kıyafetler.
 *
 * Bel `ANATOMI.govde.alt` hizasında başlıyor, paçalar bacakları takip ediyor.
 * Ortak kalıp `Bacaklar`: bel bandı ve iki paça. Şort ile pantolonun tek farkı
 * paçanın nerede bittiği.
 *
 * Üst kıyafetlerden **sonra** çiziliyorlar: bahçıvan tulumunun göğüslüğü
 * tişörtün üstünde durmalı, tersi olsaydı askılar kaybolurdu.
 */

const CIZGI = '#1b2440'
const { govde, bacak } = ANATOMI
/** Bel bandının üst kenarı. */
const BEL = govde.alt - 14
/** Uzun paça diz altında biter; ayakkabı oradan devralıyor. */
const UZUN = bacak.alt - 6
const KISA = bacak.ust + 22

export const ALTLAR: Record<KategoriKimlikleri<'alt'>, () => ReactElement> = {
  'alt-sort-mavi': () => <DuzSort renk="#4a8fe7" koyu="#2f6cbb" />,
  'alt-sort-kirmizi': () => <DuzSort renk="#ef5a52" koyu="#c33d36" />,
  'alt-sort-yesil': () => <DuzSort renk="#2b7a4b" koyu="#1e5836" />,
  'alt-deniz-sortu': DenizSortu,
  'alt-kot-sort': KotSort,
  'alt-yaprak': YaprakEtek,
  'alt-yirtik-kot': YirtikKot,
  'alt-baggy-mavi': () => <Baggy renk="#5b7fc7" koyu="#3f5f9e" />,
  'alt-baggy-siyah': () => <Baggy renk="#2f3550" koyu="#1f2437" />,
  'alt-kargo': Kargo,
  'alt-bahcivan': BahcivanTulumu,
}

/**
 * Ortak kalıp: bel bandı + iki paça.
 *
 * `genislik` paçanın enini veriyor — baggy geniş, şort dar. `paca` paçanın
 * bittiği y; şortu pantolondan ayıran tek sayı bu.
 */
function Bacaklar({
  renk,
  koyu,
  paca = UZUN,
  genislik = 22,
}: {
  renk: string
  koyu: string
  paca?: number
  genislik?: number
}) {
  return (
    <g stroke={CIZGI} strokeWidth="2.4" strokeLinejoin="round">
      <rect
        x={bacak.solX - genislik / 2}
        y={BEL + 8}
        width={genislik}
        height={paca - BEL - 8}
        rx="7"
        fill={renk}
      />
      <rect
        x={bacak.sagX - genislik / 2}
        y={BEL + 8}
        width={genislik}
        height={paca - BEL - 8}
        rx="7"
        fill={renk}
      />
      <rect x={govde.sol} y={BEL} width={govde.sag - govde.sol} height="20" rx="8" fill={renk} />
      <rect
        x={govde.sol}
        y={BEL}
        width={govde.sag - govde.sol}
        height="7"
        rx="3.5"
        fill={koyu}
        strokeWidth="1.6"
      />
    </g>
  )
}

function DuzSort({ renk, koyu }: { renk: string; koyu: string }) {
  return (
    <g>
      <Bacaklar renk={renk} koyu={koyu} paca={KISA} genislik={24} />
      <path d={`M100 ${BEL + 20} v${KISA - BEL - 22}`} stroke={koyu} strokeWidth="2.4" />
    </g>
  )
}

function DenizSortu() {
  return (
    <g>
      <Bacaklar renk="#3fb6f2" koyu="#1f8ec4" paca={KISA + 6} genislik={26} />
      {/* Dalga deseni ve bel ipi — şortu "deniz" yapan iki detay. */}
      <g fill="none" stroke="#f7f9ff" strokeWidth="2.4" strokeLinecap="round">
        <path d={`M${bacak.solX - 11} ${KISA - 6} q6 -5 11 0 q5 5 11 0`} />
        <path d={`M${bacak.sagX - 11} ${KISA - 6} q6 -5 11 0 q5 5 11 0`} />
      </g>
      <path d={`M94 ${BEL + 4} l6 8 6 -8`} fill="none" stroke="#f7f9ff" strokeWidth="2.6" strokeLinecap="round" />
    </g>
  )
}

function KotSort() {
  return (
    <g>
      <Bacaklar renk="#6f93d4" koyu="#4a6faf" paca={KISA + 4} genislik={25} />
      {/* Katlanmış paça ağzı ve dikişler. */}
      <g stroke="#4a6faf" strokeWidth="2.2" fill="none">
        <path d={`M${bacak.solX - 12} ${KISA - 4} h24`} />
        <path d={`M${bacak.sagX - 12} ${KISA - 4} h24`} />
      </g>
      <g stroke="#e8c98a" strokeWidth="1.6" strokeDasharray="3 3" fill="none">
        <path d={`M${govde.sol + 8} ${BEL + 10} v10`} />
        <path d={`M${govde.sag - 8} ${BEL + 10} v10`} />
      </g>
    </g>
  )
}

function YaprakEtek() {
  /*
    "Eski çağlar" görünümü: bele dolanan bir sarmaşık ve üstünde birkaç
    yaprak. Kesim etek, o yüzden bacaklar açıkta kalıyor.
  */
  const yapraklar = [-26, -13, 0, 13, 26]
  return (
    <g stroke={CIZGI} strokeWidth="2.2" strokeLinejoin="round">
      <rect x={govde.sol - 2} y={BEL} width={govde.sag - govde.sol + 4} height="12" rx="6" fill="#6f5a3a" />
      {yapraklar.map((kayma, i) => (
        <path
          key={i}
          d={`M${100 + kayma} ${BEL + 10} q-9 14 0 26 q9 -12 0 -26 z`}
          fill={i % 2 === 0 ? '#4f9c4a' : '#3d8340'}
        />
      ))}
    </g>
  )
}

function YirtikKot() {
  return (
    <g>
      <Bacaklar renk="#6f93d4" koyu="#4a6faf" genislik={24} />
      {/* Yırtıklar: kumaşın altındaki kürk değil, açık mavi bir boşluk. */}
      <g fill="#dbe6f7" stroke="#4a6faf" strokeWidth="1.6">
        <rect x={bacak.solX - 10} y={BEL + 34} width="20" height="7" rx="2" />
        <rect x={bacak.sagX - 8} y={BEL + 52} width="16" height="6" rx="2" />
      </g>
      <g stroke="#4a6faf" strokeWidth="1.6" fill="none">
        <path d={`M${bacak.solX} ${BEL + 14} v${UZUN - BEL - 20}`} strokeDasharray="4 4" />
        <path d={`M${bacak.sagX} ${BEL + 14} v${UZUN - BEL - 20}`} strokeDasharray="4 4" />
      </g>
    </g>
  )
}

function Baggy({ renk, koyu }: { renk: string; koyu: string }) {
  /* Bol kesim tek farkla anlatılıyor: paça eni normalin bir buçuk katı. */
  return (
    <g>
      <Bacaklar renk={renk} koyu={koyu} genislik={32} />
      <g stroke={koyu} strokeWidth="2" fill="none">
        <path d={`M${bacak.solX - 8} ${UZUN - 14} q8 6 16 0`} />
        <path d={`M${bacak.sagX - 8} ${UZUN - 14} q8 6 16 0`} />
      </g>
    </g>
  )
}

function Kargo() {
  return (
    <g>
      <Bacaklar renk="#7d7a52" koyu="#5f5d3c" genislik={26} />
      {/* Yan cepler — kargo pantolonun tamamı bu iki kapakta. */}
      <g fill="#6c6a45" stroke={CIZGI} strokeWidth="1.8">
        <rect x={bacak.solX - 14} y={BEL + 30} width="13" height="16" rx="3" />
        <rect x={bacak.sagX + 1} y={BEL + 30} width="13" height="16" rx="3" />
      </g>
      <g stroke="#4f4d32" strokeWidth="2" fill="none">
        <path d={`M${bacak.solX - 13} ${BEL + 36} h11`} />
        <path d={`M${bacak.sagX + 2} ${BEL + 36} h11`} />
      </g>
    </g>
  )
}

function BahcivanTulumu() {
  /*
    Tulum bir "alt" ama göğüslüğü var: bel bandının üstünden çıkıp omuzlara
    giden askılar. Bu yüzden alt kıyafetler üst kıyafetlerden sonra çiziliyor —
    askı, tişörtün üstünde durmalı.
  */
  return (
    <g>
      <Bacaklar renk="#5b7fc7" koyu="#3f5f9e" genislik={26} />
      <g stroke={CIZGI} strokeWidth="2.4" strokeLinejoin="round">
        <rect x="80" y={BEL - 34} width="40" height="38" rx="5" fill="#5b7fc7" />
        <path d={`M82 ${BEL - 32} q-8 -22 -14 -30`} fill="none" strokeWidth="7" stroke="#5b7fc7" />
        <path d={`M118 ${BEL - 32} q8 -22 14 -30`} fill="none" strokeWidth="7" stroke="#5b7fc7" />
      </g>
      <g fill="#e8c98a">
        <circle cx="84" cy={BEL - 30} r="3" />
        <circle cx="116" cy={BEL - 30} r="3" />
      </g>
      <rect x="88" y={BEL - 24} width="24" height="18" rx="3" fill="#4a6faf" stroke={CIZGI} strokeWidth="1.8" />
    </g>
  )
}
