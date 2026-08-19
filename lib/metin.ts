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
