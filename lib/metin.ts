/**
 * Tanıtım metinlerindeki küçük biçimlendirme.
 *
 * `tanim.ts`'teki maddeler baştan beri `**kalın**` ve `*eğik*` yazılıyordu ama
 * ekrana düz metin olarak basılıyordu: oyuncu kuralları okurken yıldızları da
 * okuyordu. Tam bir markdown ayrıştırıcısı gereksiz — metinlerde yalnızca bu
 * iki işaret var, üstelik hepsi elle yazılıyor.
 *
 * Saf ve React'ten bağımsız: bileşen yalnızca çıkan parçaları çiziyor.
 */

/**
 * Arama ve eşleştirme için metni sadeleştirir.
 *
 * `toLowerCase` tek başına yetmiyor: "İ" küçültüldüğünde birleşik işaretli bir
 * karakter çıkıyor ve "İstanbul" araması kendi kaydını bulamıyor.
 *
 * Rakamlar ve noktalama **korunuyor**: hedef kataloğu bunları zaten
 * kullanmıyor ama deneme fotoğrafını çözen taraf "38d 2y" gibi bir satırdan
 * sayıları okuyor.
 */
export function sadelestir(metin: string): string {
  return metin
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/â/g, 'a')
    .replace(/\s+/g, ' ')
    .trim()
}

export type MetinParcasi = { tur: 'duz' | 'kalin' | 'egik'; metin: string }

/** Yıldızlı bölümleri ayırır; yıldız yoksa tek parça döner. */
export function vurgulariAyir(metin: string): MetinParcasi[] {
  const parcalar: MetinParcasi[] = []
  // Önce çift yıldız denenmeli: tek yıldız deseni `**kalın**` metnini de yakalar.
  const desen = /\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let son = 0

  for (const eslesme of metin.matchAll(desen)) {
    const yer = eslesme.index
    if (yer > son) parcalar.push({ tur: 'duz', metin: metin.slice(son, yer) })
    parcalar.push(
      eslesme[1] !== undefined
        ? { tur: 'kalin', metin: eslesme[1] }
        : { tur: 'egik', metin: eslesme[2] },
    )
    son = yer + eslesme[0].length
  }

  if (son < metin.length) parcalar.push({ tur: 'duz', metin: metin.slice(son) })
  return parcalar
}
