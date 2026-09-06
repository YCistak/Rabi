/**
 * `public/ses/` altındaki lo-fi parçalar.
 *
 * Liste elle tutuluyor: statik export'ta klasör taranamaz, ayrıca hangi parçanın
 * uygulamaya girdiğinin kodda görünmesi lisans takibini kolaylaştırıyor
 * (bkz. `public/ses/LISANS.md`).
 *
 * Hepsi CC0 1.0 — kamu malı, atıf gerekmiyor.
 *
 * Dosyalar Ogg Opus. Önceden 64 kbps MP3'tü ve paketin 14 MB'ını tutuyordu —
 * uygulamanın en büyük kalemi; Opus aynı kaliteyi 40 kbps'te veriyor ve
 * toplam 10,6 MB'a indi. Konteyner `.opus` değil `.ogg`: ikisi de aynı akışı
 * taşıyor ama WebView dosya tipini uzantıdan çıkarıyor ve `.ogg` her
 * sürümde tanınıyor.
 */
export type LofiParca = {
  /** `public/ses/` içindeki dosya adı. */
  dosya: string
  ad: string
}

export const LOFI_PARCALAR: LofiParca[] = [
  { dosya: 'dust-on-the-morning-keys.ogg', ad: 'Dust on the Morning Keys' },
  { dosya: 'candlelit-at-70-bpm.ogg', ad: 'Candlelit at 70 BPM' },
  { dosya: 'glow-on-the-overpass.ogg', ad: 'Glow on the Overpass' },
  { dosya: 'almost-floating.ogg', ad: 'Almost Floating' },
  { dosya: 'after-school-rain.ogg', ad: 'After School Rain' },
  { dosya: '2-am-debug-loop.ogg', ad: '2 AM Debug Loop' },
  { dosya: 'graphite-in-the-quiet.ogg', ad: 'Graphite in the Quiet' },
  { dosya: 'stacks-of-quiet-hours.ogg', ad: 'Stacks of Quiet Hours' },
  { dosya: 'chapter-by-lamplight.ogg', ad: 'Chapter by Lamplight' },
  { dosya: 'coffee-ring-notebook.ogg', ad: 'Coffee Ring Notebook' },
  { dosya: 'margin-notes-at-dusk.ogg', ad: 'Margin Notes at Dusk' },
  { dosya: 'stacks-of-quiet-books.ogg', ad: 'Stacks of Quiet Books' },
]

/** Ses seçiminden parçayı bulur; `lofi:<dosya>` biçimini çözer. */
export function lofiParcaBul(secim: string): LofiParca | null {
  if (!secim.startsWith('lofi:')) return null
  const dosya = secim.slice('lofi:'.length)
  const bulunan = LOFI_PARCALAR.find((p) => p.dosya === dosya)
  if (bulunan) return bulunan
  /*
    Eskiden seçilmiş parça MP3 adıyla kayıtlı.

    Seçim ayarlarda `lofi:<dosya>` olarak duruyor ve dosyalar Opus'a geçince
    eski kayıtların hiçbiri listeye uymaz oldu: kullanıcı parçasını seçmiş
    olmasına rağmen odak ekranı sessiz açılıyordu. Uzantıyı çevirip bir daha
    bakmak eski seçimi olduğu gibi koruyor.
  */
  if (!dosya.endsWith('.mp3')) return null
  const yeniAd = `${dosya.slice(0, -'.mp3'.length)}.ogg`
  return LOFI_PARCALAR.find((p) => p.dosya === yeniAd) ?? null
}
