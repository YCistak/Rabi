import type { ReactElement } from 'react'
import type { KategoriKimlikleri } from '@/lib/magaza/esyalar'
import { ANATOMI } from '../olculer'

/**
 * Ayakkabılar.
 *
 * İkisi de aynı çizim, biri aynalanmış: `Ikili` sol ayak için `yon = -1`,
 * sağ ayak için `+1` veriyor ve çizim burnunu o yöne uzatıyor. Tek ayak
 * çizip iki kez kullanmak, iki ayrı şekli elle hizalamaktan hem kısa hem de
 * kaymaya kapalı.
 */

const CIZGI = '#1b2440'
const { ayak } = ANATOMI
/** Ayakkabının tabanı; bileğe kadar olan kısım buradan yukarı çıkıyor. */
const Y = ayak.y

export const AYAKKABILAR: Record<KategoriKimlikleri<'ayakkabi'>, () => ReactElement> = {
  'ayak-panduf': Panduf,
  'ayak-sneaker-beyaz': () => <Sneaker renk="#f7f9ff" seritRenk="#4a8fe7" />,
  'ayak-sneaker-siyah': () => <Sneaker renk="#2f3550" seritRenk="#f2f5fb" />,
  'ayak-bahcivan': BahcivanCizmesi,
  'ayak-krampon': Krampon,
  'ayak-palet': DalgicPaleti,
  'ayak-cizme': Cizme,
  'ayak-topuklu': TopukluAyakkabi,
  'ayak-uzay': UzayBotu,
}

/** Aynı çizimi iki ayağa uygular; `yon` burnun baktığı taraf. */
function Ikili({ ciz }: { ciz: (x: number, yon: 1 | -1) => ReactElement }) {
  return (
    <g>
      {ciz(ayak.solX, -1)}
      {ciz(ayak.sagX, 1)}
    </g>
  )
}

function Panduf() {
  return (
    <Ikili
      ciz={(x, yon) => (
        <g key={x} stroke={CIZGI} strokeWidth="2.2" strokeLinejoin="round">
          <path
            d={`M${x - 15} ${Y - 6} q0 -8 8 -8 h14 q10 0 12 10 q2 10 -10 12 h-16 q-8 0 -8 -6 z`}
            fill="#f3b0c6"
            transform={yon === -1 ? `translate(${2 * x} 0) scale(-1 1)` : undefined}
          />
          <circle cx={x + yon * 10} cy={Y - 12} r="5" fill="#ffffff" />
        </g>
      )}
    />
  )
}

function Sneaker({ renk, seritRenk }: { renk: string; seritRenk: string }) {
  return (
    <Ikili
      ciz={(x, yon) => (
        <g key={x} stroke={CIZGI} strokeWidth="2.2" strokeLinejoin="round">
          <path
            d={`M${x - 16} ${Y - 12} h16 q14 2 18 12 q1 8 -8 8 h-26 z`}
            fill={renk}
            transform={yon === -1 ? `translate(${2 * x} 0) scale(-1 1)` : undefined}
          />
          {/* Taban — bütün spor ayakkabıların ortak kalın beyaz şeridi. */}
          <rect x={x - 18} y={Y + 3} width="36" height="7" rx="3.5" fill="#f2f5fb" />
          <path
            d={`M${x - yon * 6} ${Y - 8} l${yon * 12} 8`}
            stroke={seritRenk}
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </g>
      )}
    />
  )
}

function BahcivanCizmesi() {
  return (
    <Ikili
      ciz={(x, yon) => (
        <g key={x} stroke={CIZGI} strokeWidth="2.2" strokeLinejoin="round">
          <path
            d={`M${x - 9} ${Y - 26} h18 v20 q10 2 12 10 q1 6 -7 6 h-23 z`}
            fill="#3d8340"
            transform={yon === -1 ? `translate(${2 * x} 0) scale(-1 1)` : undefined}
          />
          <rect x={x - 10} y={Y - 28} width="20" height="6" rx="3" fill="#2b6330" />
        </g>
      )}
    />
  )
}

function Krampon() {
  return (
    <Ikili
      ciz={(x, yon) => (
        <g key={x} stroke={CIZGI} strokeWidth="2.2" strokeLinejoin="round">
          <path
            d={`M${x - 16} ${Y - 11} h15 q15 2 19 11 q1 7 -8 7 h-26 z`}
            fill="#ffd45e"
            transform={yon === -1 ? `translate(${2 * x} 0) scale(-1 1)` : undefined}
          />
          {/* Çiviler — kramponu ayıran tek detay, tabanın altında. */}
          <g fill="#5b6478" stroke="none">
            <rect x={x - 14} y={Y + 7} width="5" height="5" rx="1.5" />
            <rect x={x - 3} y={Y + 7} width="5" height="5" rx="1.5" />
            <rect x={x + 8} y={Y + 7} width="5" height="5" rx="1.5" />
          </g>
        </g>
      )}
    />
  )
}

function DalgicPaleti() {
  return (
    <Ikili
      ciz={(x, yon) => (
        <g key={x} stroke={CIZGI} strokeWidth="2.2" strokeLinejoin="round">
          {/* Uzun palet öne doğru uzuyor; ayak bandı topukta kalıyor. */}
          <path
            d={`M${x - 12} ${Y - 10} h12 q6 0 8 8 l6 22 q1 6 -6 6 h-22 q-6 0 -5 -8 z`}
            fill="#3fb6f2"
            transform={yon === -1 ? `translate(${2 * x} 0) scale(-1 1)` : undefined}
          />
          <path
            d={`M${x - 10} ${Y - 4} h20`}
            stroke="#1f8ec4"
            strokeWidth="3"
          />
        </g>
      )}
    />
  )
}

function Cizme() {
  return (
    <Ikili
      ciz={(x, yon) => (
        <g key={x} stroke={CIZGI} strokeWidth="2.2" strokeLinejoin="round">
          <path
            d={`M${x - 10} ${Y - 24} h19 v18 q11 2 13 10 q1 6 -7 6 h-25 z`}
            fill="#8a5a34"
            transform={yon === -1 ? `translate(${2 * x} 0) scale(-1 1)` : undefined}
          />
          <rect x={x - 12} y={Y - 27} width="24" height="8" rx="4" fill="#b0794b" />
          <rect x={x - 17} y={Y + 4} width="34" height="6" rx="3" fill="#4a3221" />
        </g>
      )}
    />
  )
}

function TopukluAyakkabi() {
  return (
    <Ikili
      ciz={(x, yon) => (
        <g key={x} stroke={CIZGI} strokeWidth="2.2" strokeLinejoin="round">
          <path
            d={`M${x - 14} ${Y - 10} q10 -2 16 4 l10 12 q2 4 -4 4 h-22 z`}
            fill="#d63f66"
            transform={yon === -1 ? `translate(${2 * x} 0) scale(-1 1)` : undefined}
          />
          {/* İnce topuk — arkada, ökçenin altında. */}
          <path d={`M${x - yon * 12} ${Y + 8} l${yon * 3} 10 h-5 z`} fill="#a82c4d" />
        </g>
      )}
    />
  )
}

function UzayBotu() {
  return (
    <Ikili
      ciz={(x, yon) => (
        <g key={x} stroke={CIZGI} strokeWidth="2.2" strokeLinejoin="round">
          <path
            d={`M${x - 12} ${Y - 22} h20 v14 q12 3 14 10 q1 7 -8 7 h-26 z`}
            fill="#e8edf7"
            transform={yon === -1 ? `translate(${2 * x} 0) scale(-1 1)` : undefined}
          />
          <rect x={x - 14} y={Y - 25} width="28" height="7" rx="3.5" fill="#8b94a8" />
          <rect x={x - 18} y={Y + 3} width="36" height="8" rx="4" fill="#ef7a3a" />
          <circle cx={x} cy={Y - 12} r="3.4" fill="#49d6ff" strokeWidth="1.6" />
        </g>
      )}
    />
  )
}
