/**
 * Doğru / yanlış / toplam gibi sayı kutularında boş alan 0 sayılır: "60 soru,
 * 60 doğru" yazan öğrenci yanlış kutusuna elle 0 yazmak zorunda kalmasın.
 * Soru Takibi, deneme formu ve tanıtım turu aynı kuralı buradan alır.
 */

/** Kutudaki metni sayıya çevirir; boş, sayı olmayan ya da negatif metin 0 olur. */
export function bosSifir(metin: string | undefined): number {
  const deger = Number.parseInt(metin ?? '', 10)
  return Number.isFinite(deger) && deger > 0 ? deger : 0
}

/** Kutulardan en az birine bir şey yazılmış mı ("0" da yazılmış sayılır). */
export function herhangiDolu(...metinler: (string | undefined)[]): boolean {
  return metinler.some((m) => (m ?? '').trim() !== '')
}
