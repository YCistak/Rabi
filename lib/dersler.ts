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
  'Psikoloji',
  'Sosyoloji',
  'Mantık',
  'Din Kültürü',
  'İngilizce',
  'Almanca',
  'Fransızca',
  // Ders değil ama çalışma seansının gerçekten geçtiği yerler. Pomodoro'da
  // "hangi derse çalışıyorsun" sorusunun en sık cevabı bunlar oluyor ve
  // listede yoklarsa seans dersiz kaydediliyordu.
  'Deneme Çözümü',
  'Soru Çözümü',
  'Tekrar',
]

/**
 * Pomodoro'nun ders listesi.
 *
 * Soru takibiyle aynı listeyi kullanıyordu ve ondan uzun düşüyordu: Geometri
 * ile Edebiyat kâğıtta ayrı test ama çalışırken Matematik ve Türkçe'nin
 * içinde; Psikoloji, Sosyoloji, Mantık seçmeli ve çoğu öğrencide yok; "Deneme
 * Çözümü" prova kipinin işi, "Soru Çözümü" ve "Tekrar" da ders değil.
 * Listeden **süzülüyor**, ikinci bir liste yazılmıyor: soru takibine yeni bir
 * ders eklenince burada da görünmeli.
 */
const POMODORO_DISI = new Set([
  'Geometri',
  'Edebiyat',
  'Psikoloji',
  'Sosyoloji',
  'Mantık',
  'Deneme Çözümü',
  'Soru Çözümü',
  'Tekrar',
])
export const POMODORO_DERSLERI: string[] = CALISMA_DERSLERI.filter((d) => !POMODORO_DISI.has(d))

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
