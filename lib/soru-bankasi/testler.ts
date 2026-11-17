/**
 * Bitirilen testlerin son sonucu (`rabi-soru-bankasi-testler`). Okurken bozuk
 * değer atılır; kayıt yedeğe isteğe bağlı girer.
 */
import type { SoruBankasiTestleri, TestSonucKaydi } from './tip'

function sayiMi(deger: unknown): deger is number {
  return typeof deger === 'number' && Number.isFinite(deger) && deger >= 0
}

function sonucCoz(ham: unknown): TestSonucKaydi | null {
  if (typeof ham !== 'object' || ham === null || Array.isArray(ham)) return null
  const { sure, dogru, yanlis, bos, tarih } = ham as Record<string, unknown>
  if (!sayiMi(sure) || !sayiMi(dogru) || !sayiMi(yanlis) || !sayiMi(bos) || typeof tarih !== 'string') return null
  return { sure: Math.round(sure), dogru: Math.round(dogru), yanlis: Math.round(yanlis), bos: Math.round(bos), tarih }
}

export function testleriCoz(ham: unknown): SoruBankasiTestleri {
  if (typeof ham !== 'object' || ham === null || Array.isArray(ham)) return {}
  const temiz: SoruBankasiTestleri = {}
  for (const [konu, testler] of Object.entries(ham)) {
    if (typeof testler !== 'object' || testler === null || Array.isArray(testler)) continue
    const konuTestleri: Record<string, TestSonucKaydi> = {}
    for (const [no, sonuc] of Object.entries(testler)) {
      const temizSonuc = /^[1-9]\d*$/.test(no) ? sonucCoz(sonuc) : null
      if (temizSonuc) konuTestleri[no] = temizSonuc
    }
    if (Object.keys(konuTestleri).length > 0) temiz[konu] = konuTestleri
  }
  return temiz
}

/** `test` sıfırdan başlayan sıra; kayıtta ekrandaki numarayla (1'den) durur. */
export function testSonucuAl(testler: SoruBankasiTestleri, konu: string, test: number): TestSonucKaydi | undefined {
  return testler[konu]?.[String(test + 1)]
}

export function testSonucuYaz(
  testler: SoruBankasiTestleri,
  konu: string,
  test: number,
  sonuc: TestSonucKaydi,
): SoruBankasiTestleri {
  return { ...testler, [konu]: { ...testler[konu], [String(test + 1)]: sonuc } }
}
