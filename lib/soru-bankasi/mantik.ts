import type { SoruBankasiKaydi, SoruDurumu } from './tip'

export const TEST_BOYUTU = 12

export function testlereBol<T>(sorular: T[], boyut = TEST_BOYUTU): T[][] {
  return Array.from({ length: Math.ceil(sorular.length / boyut) }, (_, i) => sorular.slice(i * boyut, (i + 1) * boyut))
}

export function kaydiCoz(ham: unknown): SoruBankasiKaydi {
  if (typeof ham !== 'object' || ham === null || Array.isArray(ham)) return {}
  const temiz: SoruBankasiKaydi = {}
  for (const [konu, durumlar] of Object.entries(ham)) {
    if (typeof durumlar !== 'string' || !/^[dy-]*$/.test(durumlar)) continue
    temiz[konu] = durumlar
  }
  return temiz
}

export function durumAl(kayit: SoruBankasiKaydi, konu: string, sira: number): SoruDurumu {
  return kayit[konu]?.[sira] === 'd' ? 'd' : kayit[konu]?.[sira] === 'y' ? 'y' : '-'
}

/** İlk cevap kalıcıdır; tekrar testinde doğru cevap yanlış kaydını düzeltebilir. */
export function cevapKaydet(
  kayit: SoruBankasiKaydi,
  konu: string,
  sira: number,
  durum: Exclude<SoruDurumu, '-'>,
  tekrar = false,
): SoruBankasiKaydi {
  const onceki = durumAl(kayit, konu, sira)
  if (onceki !== '-' && !(tekrar && onceki === 'y' && durum === 'd')) return kayit
  const metin = kayit[konu] ?? ''
  const karakterler = Array.from({ length: Math.max(metin.length, sira + 1) }, (_, i) => metin[i] ?? '-')
  karakterler[sira] = durum
  return { ...kayit, [konu]: karakterler.join('') }
}

export type Ozet = { cozulen: number; dogru: number; yanlis: number; toplam: number }
export function ozet(kayit: SoruBankasiKaydi, konu: string, toplam: number): Ozet {
  let dogru = 0
  let yanlis = 0
  for (let i = 0; i < toplam; i++) {
    const durum = durumAl(kayit, konu, i)
    if (durum === 'd') dogru++
    if (durum === 'y') yanlis++
  }
  return { cozulen: dogru + yanlis, dogru, yanlis, toplam }
}

/** Test kartındaki etiket, soruların çoğunluk zorluğundan gelir. */
export function zorlukEtiketi(zorluklar: readonly (1 | 2 | 3)[]): 'Kolay' | 'Orta' | 'Zor' {
  const sayilar = [0, 0, 0]
  for (const zorluk of zorluklar) sayilar[zorluk - 1]++
  const sira = sayilar.indexOf(Math.max(...sayilar))
  return ['Kolay', 'Orta', 'Zor'][sira] as 'Kolay' | 'Orta' | 'Zor'
}
