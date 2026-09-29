/** İlerleme durumuna uygun, gün boyunca sabit kalan kısa hedef cümlesi. */
export function gunlukHedefMesaji(cozulen: number, hedef: number, tarih: string): string {
  const gunSirasi = Math.floor(Date.parse(`${tarih}T00:00:00Z`) / 86_400_000)
  const sec = (cumleler: string[]) => cumleler[((gunSirasi % cumleler.length) + cumleler.length) % cumleler.length]

  if (hedef <= 0) return sec([
    'Kendine günlük bir soru hedefi belirle.',
    'Bugün kaç soru çözmek istiyorsun?',
    'Küçük bir hedefle başlamak yeter.',
  ])
  if (cozulen >= hedef) return sec([
    'Hedef tamam! Serini yarın da sürdür.',
    'Bugünkü hedefe ulaştın, eline sağlık.',
    'Hedef tuttu. Yarın kaldığın yerden devam et.',
  ])
  if (cozulen === 0) return sec([
    'İlk soruyla başla, serini büyüt.',
    'Hedefine giden ilk soru seni bekliyor.',
    'Bugün bir soruyla ritmini kur.',
  ])
  const kalan = hedef - cozulen
  return sec([
    `Hedefe ${kalan} soru kaldı; ritmini koru.`,
    `${kalan} soru daha çözersen bugünkü hedefin tamam.`,
    `İlerliyorsun! Kalan ${kalan} soruyu da bitir.`,
  ])
}
