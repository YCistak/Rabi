import type { ReactElement } from 'react'
import type { KategoriKimlikleri } from '@/lib/magaza/esyalar'
import { ANATOMI } from '../olculer'

/**
 * Kürk renkleri.
 *
 * Renk bir "eşya" gibi satın alınıyor ama giyilmiyor: tavşanın kendi
 * gövdesini boyuyor. O yüzden burada SVG değil **palet** duruyor; gövdeyi
 * çizen dosya paleti okuyup kendi şekillerini boyuyor.
 *
 * Hiçbir kürk satın alınmamışsa tema değişkenleri geçerli — uygulamanın her
 * yerindeki Rabi ile aynı beyaz tavşan. Böylece mağazaya hiç girmemiş bir
 * kullanıcı da tanıdık bir tavşan görüyor.
 */
export type KurkPaleti = {
  /** Gövde, baş ve kulakların ana rengi. */
  kurk: string
  /** Gölge tonu — karın ve kol ayrımı. */
  golge: string
  kulakIc: string
  yanak: string
}

export const VARSAYILAN_KURK: KurkPaleti = {
  kurk: 'var(--maskot-kurk)',
  golge: 'color-mix(in oklab, var(--maskot-kurk) 88%, var(--maskot-cizgi))',
  kulakIc: 'var(--maskot-kulak-ic)',
  yanak: 'var(--maskot-yanak)',
}

export const KURK_PALETLERI: Record<KategoriKimlikleri<'kurk'>, KurkPaleti> = {
  'kurk-kutup': { kurk: '#ffffff', golge: '#e4ebf7', kulakIc: '#f6d2da', yanak: '#f9dde3' },
  'kurk-karamel': { kurk: '#cb8d55', golge: '#ad703b', kulakIc: '#f2c9ac', yanak: '#e8a887' },
  'kurk-gece': { kurk: '#333a57', golge: '#242a41', kulakIc: '#6f5c78', yanak: '#4d4162' },
  'kurk-gumus': { kurk: '#c9d2e0', golge: '#a9b5c9', kulakIc: '#e6d5df', yanak: '#dcc7d2' },
  'kurk-benekli': { kurk: '#f6f0e5', golge: '#e0d5c2', kulakIc: '#f6d2da', yanak: '#f9dde3' },
  'kurk-altin': { kurk: '#f3c552', golge: '#d8a029', kulakIc: '#ffe8ac', yanak: '#f8db8c' },
  'kurk-neon': { kurk: '#2a1c56', golge: '#1c1240', kulakIc: '#ff54d9', yanak: '#7d40d6' },
  'kurk-robot': { kurk: '#bcc6d4', golge: '#96a2b4', kulakIc: '#49d6ff', yanak: '#8090a4' },
}

/**
 * Kimliğe karşılık gelen palet; bilinmeyen ya da boş kimlikte varsayılan.
 *
 * Arama geniş bir kayıt üzerinden: gelen kimlik kayıttan okunuyor ve kayıt
 * elle kurcalanmış olabilir. Dar tiple indekslemek derleyiciyi memnun eder,
 * çalışma zamanında hiçbir şeyi güvence altına almazdı.
 */
const PALET_ARAMASI: Record<string, KurkPaleti> = KURK_PALETLERI

export function kurkPaleti(id: string | undefined): KurkPaleti {
  return (id !== undefined ? PALET_ARAMASI[id] : undefined) ?? VARSAYILAN_KURK
}

/**
 * Bazı kürklerin desen katmanı.
 *
 * Düz renk her şeyi anlatmıyor: "benekli" beneksiz, "robot" panelsiz sadece
 * gri bir tavşan olurdu. Desen gövdenin üstüne, kıyafetlerin altına çiziliyor
 * — tişört giyince göbekteki benek görünmemeli.
 */
export const KURK_DESENI: Record<string, () => ReactElement> = {
  'kurk-benekli': Benekler,
  'kurk-robot': RobotPanelleri,
  'kurk-neon': NeonCizgileri,
  'kurk-altin': AltinParilti,
}

function Benekler() {
  const { bas, govde } = ANATOMI
  return (
    <g fill="#b98a5a" opacity="0.55">
      <ellipse cx={bas.x - 30} cy={bas.y - 22} rx="11" ry="8" />
      <ellipse cx={bas.x + 26} cy={bas.y - 28} rx="7" ry="5.5" />
      <ellipse cx={govde.sol + 14} cy={govde.ust + 34} rx="9" ry="7" />
      <ellipse cx={govde.sag - 16} cy={govde.ust + 58} rx="7" ry="5.5" />
      <ellipse cx={govde.sol + 26} cy={govde.alt - 14} rx="6" ry="4.5" />
    </g>
  )
}

function RobotPanelleri() {
  const { bas, govde } = ANATOMI
  return (
    <g>
      {/* Baştaki dikiş çizgisi ve vida — yüzü bozmadan, alnın üstünden geçiyor. */}
      <path
        d={`M${bas.x - 34} ${bas.y - 26} q34 -14 68 0`}
        fill="none"
        stroke="#7d8a9d"
        strokeWidth="2"
      />
      <circle cx={bas.x - 36} cy={bas.y - 12} r="2.6" fill="#7d8a9d" />
      <circle cx={bas.x + 36} cy={bas.y - 12} r="2.6" fill="#7d8a9d" />
      {/* Göğüs paneli. Kıyafet giyilince altında kalıyor, olması gereken de bu. */}
      <rect
        x={govde.sol + 16}
        y={govde.ust + 26}
        width="36"
        height="26"
        rx="6"
        fill="#8e9aad"
        stroke="#6f7c8f"
        strokeWidth="1.6"
      />
      <circle cx={govde.sol + 26} cy={govde.ust + 39} r="4" fill="#49d6ff" />
      <rect x={govde.sol + 34} y={govde.ust + 35} width="14" height="3.4" rx="1.7" fill="#49d6ff" />
      <rect
        x={govde.sol + 34}
        y={govde.ust + 42}
        width="10"
        height="3.4"
        rx="1.7"
        fill="#49d6ff"
        opacity="0.6"
      />
    </g>
  )
}

function NeonCizgileri() {
  const { bas, govde, kol } = ANATOMI
  return (
    <g fill="none" stroke="#3ff5e0" strokeWidth="2.2" strokeLinecap="round" opacity="0.9">
      <path d={`M${bas.x - 40} ${bas.y + 6} q6 16 22 22`} />
      <path d={`M${bas.x + 40} ${bas.y + 6} q-6 16 -22 22`} />
      <path d={`M${govde.sol + 10} ${govde.ust + 18} v${govde.alt - govde.ust - 34}`} />
      <path
        d={`M${govde.sag - 10} ${govde.ust + 18} v${govde.alt - govde.ust - 34}`}
        stroke="#ff54d9"
      />
      <path d={`M${kol.solX} ${kol.ust + 12} v34`} stroke="#ff54d9" />
      <path d={`M${kol.sagX} ${kol.ust + 12} v34`} />
    </g>
  )
}

function AltinParilti() {
  const { bas, govde } = ANATOMI
  return (
    <g fill="#fff6d6" opacity="0.75">
      <path d={`M${bas.x - 34} ${bas.y - 30} l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z`} />
      <path d={`M${govde.sag - 12} ${govde.ust + 22} l2.4 5.6 5.6 2.4 -5.6 2.4 -2.4 5.6 -2.4 -5.6 -5.6 -2.4 5.6 -2.4z`} />
    </g>
  )
}
