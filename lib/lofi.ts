/**
 * `public/ses/` altındaki lo-fi parçalar.
 *
 * Liste elle tutuluyor: statik export'ta klasör taranamaz, ayrıca hangi parçanın
 * uygulamaya girdiğinin kodda görünmesi lisans takibini kolaylaştırıyor
 * (bkz. `public/ses/LISANS.md`).
 *
 * Hepsi CC0 1.0 — kamu malı, atıf gerekmiyor.
 */
export type LofiParca = {
  /** `public/ses/` içindeki dosya adı. */
  dosya: string
  ad: string
}

export const LOFI_PARCALAR: LofiParca[] = [
  { dosya: 'dust-on-the-morning-keys.mp3', ad: 'Dust on the Morning Keys' },
  { dosya: 'candlelit-at-70-bpm.mp3', ad: 'Candlelit at 70 BPM' },
  { dosya: 'glow-on-the-overpass.mp3', ad: 'Glow on the Overpass' },
  { dosya: 'almost-floating.mp3', ad: 'Almost Floating' },
  { dosya: 'after-school-rain.mp3', ad: 'After School Rain' },
  { dosya: '2-am-debug-loop.mp3', ad: '2 AM Debug Loop' },
  { dosya: 'graphite-in-the-quiet.mp3', ad: 'Graphite in the Quiet' },
  { dosya: 'stacks-of-quiet-hours.mp3', ad: 'Stacks of Quiet Hours' },
  { dosya: 'chapter-by-lamplight.mp3', ad: 'Chapter by Lamplight' },
  { dosya: 'coffee-ring-notebook.mp3', ad: 'Coffee Ring Notebook' },
  { dosya: 'margin-notes-at-dusk.mp3', ad: 'Margin Notes at Dusk' },
  { dosya: 'stacks-of-quiet-books.mp3', ad: 'Stacks of Quiet Books' },
]

/** Ses seçiminden parçayı bulur; `lofi:<dosya>` biçimini çözer. */
export function lofiParcaBul(secim: string): LofiParca | null {
  if (!secim.startsWith('lofi:')) return null
  const dosya = secim.slice('lofi:'.length)
  return LOFI_PARCALAR.find((p) => p.dosya === dosya) ?? null
}
