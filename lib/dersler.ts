/**
 * Soru takibi ve yanlış soru bankasında kullanılan çalışma dersleri.
 * YKS'de sorulan testler esas alınır — okulun ders listesi değil.
 */
export const CALISMA_DERSLERI: string[] = [
  'Türkçe',
  'Matematik',
  'Geometri',
  'Fizik',
  'Kimya',
  'Biyoloji',
  'Edebiyat',
  'Tarih',
  'Coğrafya',
  'Felsefe',
  'Din Kültürü',
  'İngilizce',
]

/** Türkçe harfleri de doğru karşılaştırmak için sadeleştirir: "İNGİLİZCE" → "ingilizce". */
export function sadelestir(metin: string): string {
  return metin
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('â', 'a')
    .replaceAll('’', "'")
    .trim()
}

/** Yazılan metne göre önerileri süzer; baştan eşleşenler üste çıkar. */
export function dersOnerileriniSuz(
  yazilan: string,
  hariç: string[] = [],
  havuz: string[] = CALISMA_DERSLERI,
): string[] {
  const aranan = sadelestir(yazilan)
  const kullanilan = new Set(hariç.map(sadelestir))
  const uygun = havuz.filter((ders) => !kullanilan.has(sadelestir(ders)))

  if (aranan === '') return uygun

  const eslesen = uygun.filter((ders) => sadelestir(ders).includes(aranan))
  return eslesen.sort((a, b) => {
    const aBas = sadelestir(a).startsWith(aranan) ? 0 : 1
    const bBas = sadelestir(b).startsWith(aranan) ? 0 : 1
    return aBas - bBas
  })
}
