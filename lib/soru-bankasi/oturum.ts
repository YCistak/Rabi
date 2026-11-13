/**
 * Test oturumunun saf hesapları: mod değerlendirmesi, kayda yazım, yarım test.
 *
 * Oturumdaki seçim şıkkın sırasıdır; kalıcı kayıtta ise yalnız d/y durur
 * (hangi şıkkın seçildiği tutulmaz). Kaldığı yerden devam eden testte önceki
 * oturumun cevapları bu yüzden "önceki" durum olarak gelir, şık olarak değil.
 */
import { cevapKaydet, durumAl, TEST_BOYUTU } from './mantik'
import type { SoruBankasiKaydi, SoruBankasiTestleri, SoruDurumu } from './tip'

export type OncekiDurumlar = Record<number, Exclude<SoruDurumu, '-'>>

export function soruSonucu(secim: number | undefined, dogru: number, onceki?: Exclude<SoruDurumu, '-'>): SoruDurumu {
  if (secim !== undefined) return secim === dogru ? 'd' : 'y'
  return onceki ?? '-'
}

export type TestDegerlendirmesi = {
  sonuclar: SoruDurumu[]
  dogru: number
  yanlis: number
  bos: number
  /** ÖSYM puanlaması: dört yanlış bir doğruyu götürür (YKS kılavuzu, ham puan hesabı). */
  net: number
}

export function netHesapla(dogru: number, yanlis: number): number {
  return dogru - yanlis / 4
}

export function testDegerlendir(
  sorular: readonly { dogru: number }[],
  secimler: Readonly<Record<number, number>>,
  onceki: OncekiDurumlar = {},
): TestDegerlendirmesi {
  const sonuclar = sorular.map((soru, sira) => soruSonucu(secimler[sira], soru.dogru, onceki[sira]))
  const dogru = sonuclar.filter((durum) => durum === 'd').length
  const yanlis = sonuclar.filter((durum) => durum === 'y').length
  return { sonuclar, dogru, yanlis, bos: sonuclar.length - dogru - yanlis, net: netHesapla(dogru, yanlis) }
}

/**
 * Deneme modunun bitişte kayda yazımı. `cevapKaydet`in kuralı aynen geçer:
 * ilk cevap kalıcıdır, yanlışları tekrar çözerken doğru cevap düzeltir. Boş
 * bırakılan soru kayda dokunmaz.
 */
export function denemeyiKaydet(
  kayit: SoruBankasiKaydi,
  konu: string,
  kaynakSiralari: readonly number[],
  sorular: readonly { dogru: number }[],
  secimler: Readonly<Record<number, number>>,
  tekrar: boolean,
): SoruBankasiKaydi {
  return kaynakSiralari.reduce((sonuc, kaynak, sira) => {
    const secim = secimler[sira]
    if (secim === undefined || !sorular[sira]) return sonuc
    return cevapKaydet(sonuc, konu, kaynak, secim === sorular[sira].dogru ? 'd' : 'y', tekrar)
  }, kayit)
}

/** Kayıttaki cevaplanmış soruların oturum sırasına göre durumu (devam eden test için). */
export function oncekiDurumlar(kayit: SoruBankasiKaydi, konu: string, kaynakSiralari: readonly number[]): OncekiDurumlar {
  const sonuc: OncekiDurumlar = {}
  kaynakSiralari.forEach((kaynak, sira) => {
    const durum = durumAl(kayit, konu, kaynak)
    if (durum !== '-') sonuc[sira] = durum
  })
  return sonuc
}

export type YarimTest = { test: number; cozulen: number; toplam: number; ilkBos: number }

/**
 * Yarım bırakılmış ilk test: bazı soruları cevaplanmış ama hepsi değil ve
 * bitirilmiş sonucu yok. Bitirilip boş soru bırakılan test yarım sayılmaz.
 */
export function yarimTestBul(
  kayit: SoruBankasiKaydi,
  testler: SoruBankasiTestleri,
  konu: string,
  soruSayisi: number,
  boyut = TEST_BOYUTU,
): YarimTest | null {
  const testSayisi = Math.ceil(soruSayisi / boyut)
  for (let test = 0; test < testSayisi; test++) {
    if (testler[konu]?.[String(test + 1)]) continue
    const toplam = Math.min(boyut, soruSayisi - test * boyut)
    let cozulen = 0
    let ilkBos = -1
    for (let sira = 0; sira < toplam; sira++) {
      if (durumAl(kayit, konu, test * boyut + sira) === '-') {
        if (ilkBos === -1) ilkBos = sira
      } else cozulen++
    }
    if (cozulen > 0 && cozulen < toplam) return { test, cozulen, toplam, ilkBos }
  }
  return null
}
