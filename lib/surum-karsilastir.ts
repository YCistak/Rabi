/**
 * Mağazadaki sürüm kuruludan yeni mi — "1.0.10" ile "1.0.9"u metin gibi
 * karşılaştırmak yanlış sonuç verir, parça parça sayı olarak bakılır.
 *
 * Eksik parça sıfır sayılır ("1.1" = "1.1.0"); sayı olmayan parça da sıfır —
 * bozuk bir sürüm metni yüzünden şerit boşuna çıkmasın.
 */
export function surumYeniMi(magaza: string, kurulu: string): boolean {
  const a = parcala(magaza)
  const b = parcala(kurulu)
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const fark = (a[i] ?? 0) - (b[i] ?? 0)
    if (fark !== 0) return fark > 0
  }
  return false
}

function parcala(surum: string): number[] {
  return surum
    .trim()
    .split('.')
    .map((p) => {
      const n = Number.parseInt(p, 10)
      return Number.isFinite(n) ? n : 0
    })
}
