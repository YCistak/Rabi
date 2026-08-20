import type { ReactElement } from 'react'
import type { KategoriKimlikleri } from '@/lib/magaza/esyalar'
import { ANATOMI } from '../olculer'

/**
 * Gözlükler.
 *
 * Hepsi göz hizasına (`ANATOMI.goz`) oturuyor. Camlar saydam değil: altındaki
 * göz görünsün isteniyorsa cam hiç çizilmiyor, kapatılacaksa tamamen
 * kapatılıyor. Yarı saydam bir cam telefonda çamura dönüyordu.
 */

const CIZGI = '#1b2440'
const { goz } = ANATOMI
const SOL = goz.solX
const SAG = goz.sagX
const Y = goz.y

export const GOZLUKLER: Record<KategoriKimlikleri<'gozluk'>, () => ReactElement> = {
  'gozluk-inek': InekGozlugu,
  'gozluk-deney': DeneyGozlugu,
  'gozluk-yuzucu': YuzucuGozlugu,
  'gozluk-profesor': ProfesorGozlugu,
  'gozluk-saka': SakaGozlugu,
  'gozluk-kalp': KalpliGozluk,
  'gozluk-dj': DjGozlugu,
  'gozluk-piksel': PikselGozluk,
  'gozluk-hipnoz': HipnozGozlugu,
}

/** Kulaklara giden saplar — neredeyse bütün gözlüklerde aynı. */
function Saplar({ renk = CIZGI, kalinlik = 3 }: { renk?: string; kalinlik?: number }) {
  return (
    <g stroke={renk} strokeWidth={kalinlik} strokeLinecap="round">
      <path d={`M${SOL - 15} ${Y - 2} L52 ${Y + 4}`} />
      <path d={`M${SAG + 15} ${Y - 2} L148 ${Y + 4}`} />
    </g>
  )
}

function InekGozlugu() {
  return (
    <g>
      <Saplar />
      <g fill="none" stroke={CIZGI} strokeWidth="4">
        <circle cx={SOL} cy={Y} r="14" />
        <circle cx={SAG} cy={Y} r="14" />
        <path d={`M${SOL + 14} ${Y} h8`} />
      </g>
      {/* Burun köprüsündeki bant — gözlüğün "inek" tarafı burası. */}
      <rect x="96" y={Y - 7} width="8" height="14" rx="2" fill="#f2f5fb" stroke={CIZGI} strokeWidth="1.8" />
    </g>
  )
}

function DeneyGozlugu() {
  return (
    <g>
      {/* Lastik bant başın arkasına dolanıyor. */}
      <path
        d={`M${SOL - 24} ${Y - 4} q-14 6 -22 10`}
        stroke="#5b6478"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M${SAG + 24} ${Y - 4} q14 6 22 10`}
        stroke="#5b6478"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <rect
        x={SOL - 25}
        y={Y - 15}
        width="86"
        height="30"
        rx="14"
        fill="#cfe4f5"
        stroke={CIZGI}
        strokeWidth="2.6"
      />
      <path d={`M${SOL + 15} ${Y - 15} v30`} stroke={CIZGI} strokeWidth="2.2" />
      <path d={`M${SOL - 16} ${Y - 8} q8 -3 16 0`} stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  )
}

function YuzucuGozlugu() {
  return (
    <g>
      <path
        d={`M${SOL - 14} ${Y} q-16 2 -26 8`}
        stroke="#ef5a52"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M${SAG + 14} ${Y} q16 2 26 8`}
        stroke="#ef5a52"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <g stroke={CIZGI} strokeWidth="2.6">
        <ellipse cx={SOL} cy={Y} rx="14" ry="11" fill="#3fb6f2" />
        <ellipse cx={SAG} cy={Y} rx="14" ry="11" fill="#3fb6f2" />
        <path d={`M${SOL + 14} ${Y} h${SAG - SOL - 28}`} strokeWidth="3" />
      </g>
      <ellipse cx={SOL - 4} cy={Y - 4} rx="4" ry="2.6" fill="#ffffff" opacity="0.8" />
      <ellipse cx={SAG - 4} cy={Y - 4} rx="4" ry="2.6" fill="#ffffff" opacity="0.8" />
    </g>
  )
}

function ProfesorGozlugu() {
  return (
    <g>
      <Saplar renk="#c9a227" kalinlik={2.2} />
      <g fill="none" stroke="#c9a227" strokeWidth="2.6">
        <circle cx={SOL} cy={Y} r="13" />
        <circle cx={SAG} cy={Y} r="13" />
        <path d={`M${SOL + 13} ${Y - 2} q6 -4 12 0`} />
      </g>
    </g>
  )
}

function SakaGozlugu() {
  const { burun } = ANATOMI
  return (
    <g>
      <Saplar />
      <g fill="none" stroke={CIZGI} strokeWidth="4">
        <circle cx={SOL} cy={Y} r="13" />
        <circle cx={SAG} cy={Y} r="13" />
        <path d={`M${SOL + 13} ${Y} h8`} />
      </g>
      {/* Takma burun ve bıyık — şakanın tamamı bu ikisinde. */}
      <ellipse cx={burun.x} cy={burun.y - 2} rx="12" ry="14" fill="#f0a98d" stroke={CIZGI} strokeWidth="2.4" />
      <path
        d={`M${burun.x} ${burun.y + 12} q-16 -6 -24 8 q14 6 24 -2 q10 8 24 2 q-8 -14 -24 -8 z`}
        fill="#3a2a1e"
        stroke={CIZGI}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </g>
  )
}

/** Kalp — iki yay ve bir uç; gözlük camı olarak kullanılıyor. */
function kalpYolu(cx: number, cy: number, r: number): string {
  return `M${cx} ${cy + r * 0.9} C${cx - r * 1.4} ${cy - r * 0.2} ${cx - r * 0.6} ${cy - r * 1.2} ${cx} ${cy - r * 0.35} C${cx + r * 0.6} ${cy - r * 1.2} ${cx + r * 1.4} ${cy - r * 0.2} ${cx} ${cy + r * 0.9} z`
}

function KalpliGozluk() {
  return (
    <g>
      <Saplar renk="#e0509b" kalinlik={2.6} />
      <g fill="#ff8ec4" stroke="#e0509b" strokeWidth="2.4" strokeLinejoin="round">
        <path d={kalpYolu(SOL, Y, 13)} />
        <path d={kalpYolu(SAG, Y, 13)} />
      </g>
      <path d={`M${SOL + 12} ${Y - 2} h${SAG - SOL - 24}`} stroke="#e0509b" strokeWidth="2.6" />
      <ellipse cx={SOL - 4} cy={Y - 5} rx="3.4" ry="2.2" fill="#ffffff" opacity="0.85" />
      <ellipse cx={SAG - 4} cy={Y - 5} rx="3.4" ry="2.2" fill="#ffffff" opacity="0.85" />
    </g>
  )
}

function DjGozlugu() {
  return (
    <g>
      <Saplar renk="#1b2440" kalinlik={3.4} />
      <rect
        x={SOL - 22}
        y={Y - 12}
        width="80"
        height="24"
        rx="6"
        fill="#22283c"
        stroke={CIZGI}
        strokeWidth="2.4"
      />
      {/* Panjur çizgileri — parti gözlüğünü panjur yapan şey. */}
      <g stroke="#ef5a52" strokeWidth="2.6" strokeLinecap="round">
        <path d={`M${SOL - 17} ${Y - 5} h70`} />
        <path d={`M${SOL - 17} ${Y + 1} h70`} />
        <path d={`M${SOL - 17} ${Y + 7} h70`} />
      </g>
    </g>
  )
}

function PikselGozluk() {
  /*
    Piksel piksel çizilen kalın siyah bant. Blok blok duruyor ki "8 bit"
    okunsun; tek bir dikdörtgen sadece güneş gözlüğü olurdu.
  */
  const bloklar = [
    { x: SOL - 24, y: Y - 10, w: 22, h: 8 },
    { x: SOL - 24, y: Y - 2, w: 14, h: 8 },
    { x: SOL - 2, y: Y - 10, w: 12, h: 8 },
    { x: SOL + 10, y: Y - 10, w: 24, h: 8 },
    { x: SAG - 12, y: Y - 2, w: 26, h: 8 },
    { x: SAG + 2, y: Y - 10, w: 22, h: 8 },
  ]
  return (
    <g fill="#12151f">
      <rect x={SOL - 26} y={Y - 12} width="84" height="14" rx="0" />
      {bloklar.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} />
      ))}
    </g>
  )
}

function HipnozGozlugu() {
  /*
    Gerçek spiral yerine iç içe halkalar: telefonda otuz piksele sığan bir
    spiralin dönüşü zaten seçilmiyor, halkalar aynı etkiyi net veriyor.
  */
  const halkalar = [12, 8.5, 5, 2]
  return (
    <g>
      <Saplar />
      <g stroke={CIZGI} strokeWidth="3" fill="none">
        <circle cx={SOL} cy={Y} r="14" fill="#ffffff" />
        <circle cx={SAG} cy={Y} r="14" fill="#ffffff" />
        <path d={`M${SOL + 14} ${Y} h8`} />
      </g>
      <g fill="none" stroke="#7b3fd4" strokeWidth="2.4">
        {halkalar.map((r) => (
          <circle key={`sol-${r}`} cx={SOL} cy={Y} r={r} />
        ))}
        {halkalar.map((r) => (
          <circle key={`sag-${r}`} cx={SAG} cy={Y} r={r} />
        ))}
      </g>
    </g>
  )
}
