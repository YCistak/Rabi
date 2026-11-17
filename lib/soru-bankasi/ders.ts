/**
 * Soru Bankası'ndaki dersler.
 *
 * Ders ayrı bir alanda tutulmuyor: konu kimliğinin öneki söylüyor (`mat10-…`,
 * `fzk11-…`). Böylece kayıt anahtarları ve eski kayıtlar olduğu gibi kalıyor;
 * yeni ders eklemek bu listeye bir satır eklemek demek.
 */
export type BankaDersi = 'matematik' | 'fizik'

export const BANKA_DERSLERI: { id: BankaDersi; ad: string; onek: string }[] = [
  { id: 'matematik', ad: 'Matematik', onek: 'mat' },
  { id: 'fizik', ad: 'Fizik', onek: 'fzk' },
]

/** Konu kimliğinin dersi; tanınmayan önek eski (yalnız matematik) bankadan kalmadır. */
export function konuDersi(konuId: string | undefined): BankaDersi {
  return BANKA_DERSLERI.find((ders) => konuId?.startsWith(ders.onek))?.id ?? 'matematik'
}

export function dersAdi(ders: BankaDersi): string {
  return BANKA_DERSLERI.find((d) => d.id === ders)?.ad ?? 'Matematik'
}

/** Kayıttan okunan ders tercihi: bilinmeyen değer matematiğe döner. */
export function bankaDersiCoz(ham: unknown): BankaDersi {
  return BANKA_DERSLERI.some((d) => d.id === ham) ? (ham as BankaDersi) : 'matematik'
}
