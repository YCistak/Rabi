/**
 * Geçici ölçüm düzeneği — ~/Downloads/ocr altındaki dokuz gerçek fotoğrafı
 * okuyup elle etiketlenmiş doğru cevaplarla karşılaştırır. Kâğıtların
 * hazırlanmış hâli depoda değil; yolu `KAGITLAR` ile veriliyor, yoksa test
 * kendini atlıyor.
 *
 * Etiketler kâğıtlara bakılarak yazıldı; satırlar kâğıttaki sırayla ve
 * yalnızca **sayı taşıyanlar** (ders adı yazıp sayı yazmayan ya da "Full"
 * yazan satırlar burada yok).
 */
import { existsSync, readFileSync } from 'node:fs'
import { describe, it } from 'vitest'
import { grilestir, uyarlamaliEsik, yerelKontrast } from './goruntu-esikle'
import { kagidaKirp } from './kagit-kirp'
import { satirlariOku } from './kagit-oku'
import { agirliklariCoz } from './karakter-tani'
import { AGIRLIKLAR } from './karakter-agirliklari'

const DIZIN = process.env.KAGITLAR ?? ''

const KAGITLAR = [
  {
    ad: 'k1',
    en: 1501,
    boy: 2000,
    // Siyah tükenmez, düz duruyor. İki satır alta taşmış.
    dogru: ['36D', '1B', '39D 1Y', '3D 2B', '1B', '3D 1Y', '5D', '4D 1Y', '1B', '5D 1Y'],
  },
  {
    ad: 'k2',
    en: 1501,
    boy: 2000,
    dogru: ['5B 10Y', '15D 20B', '3B 2Y', '3Y 2D', '3B 1Y', '2Y 3B', '5Y', '3Y 1B', '2B 2D'],
  },
  {
    ad: 'k3',
    en: 1501,
    boy: 2000,
    dogru: ['12D 6Y', '2D 1B', '5D 5Y', '20D 5Y', '6D 1Y', '6D 4B', '2D 1Y', '6D 6Y'],
  },
  {
    ad: 'k4',
    en: 1501,
    boy: 2000,
    dogru: ['15D 10B', '25D 2B', '1D 3B', '2D 1Y', '2D 3B', '5Y', '0D 0B', '2Y 1B', '3B 1D'],
  },
  {
    ad: 'k5',
    en: 1501,
    boy: 2000,
    dogru: ['12D 10B', '2Y', '5Y 0B', '30D 0B', '1B 2Y', '3Y 2B', '9Y'],
  },
  {
    ad: 'k6',
    en: 2000,
    boy: 1501,
    // Yan duruyor, pembe ince kalem.
    dogru: ['5D 1B', '1Y 1B', '35D 1Y', '10D 1B', '1B 0Y', '1B', '1Y'],
  },
  {
    ad: 'k7',
    en: 2000,
    boy: 1501,
    dogru: ['1B', '3Y', '3D 1B 1Y', '1B 1Y', '5D 1B', '0Y 0B', '2Y', '3D 2B'],
  },
  {
    ad: 'k8',
    en: 2000,
    boy: 1501,
    // Kurşun kalem — en zor kâğıt.
    dogru: ['30D 10Y', '35D 5Y', '3D 2Y', '5D 1B', '7D 0Y', '2B', '1Y', '5D'],
  },
  {
    ad: 'k9',
    en: 2000,
    boy: 1501,
    dogru: ['24D', '5D 1Y', '2B', '3Y', '2B', '0Y 0B', '11D 1Y', '10D 1Y 0B'],
  },
  {
    ad: 'y1',
    en: 1501,
    boy: 2000,
    dogru: ['12D 12Y 6B', '6D 2Y 2B', '12D', '6D', '15D 2Y 13B', '5D 2Y 3B', '10D', '10D'],
  },
  {
    ad: 'y2',
    en: 1501,
    boy: 2000,
    dogru: ['15D 5Y 10B', '6D 2Y 4B', '12D', '6D', '25D 3Y 2B', '10D', '8D 1Y 1B', '10D'],
  },
  {
    ad: 'y3',
    en: 1501,
    boy: 2000,
    dogru: ['30B', '12B', '12B', '6B', '30B', '10B', '10B', '10B'],
  },
  {
    ad: 'y4',
    en: 1501,
    boy: 2000,
    dogru: ['25D 4Y 1B', '12D', '10D 2Y', '6D', '30D', '5D 5Y', '4D 5Y 1B', '10D'],
  },
  {
    ad: 'y5',
    en: 1501,
    boy: 2000,
    dogru: ['30D', '12D', '12D', '6D', '30D', '10D', '10D', '10D'],
  },
  {
    ad: 'y6',
    en: 1501,
    boy: 2000,
    dogru: ['30Y', '12Y', '12Y', '12Y', '30Y', '10Y', '10Y', '10Y'],
  },
  {
    ad: 'y7',
    en: 1501,
    boy: 2000,
    dogru: ['30D', '12D', '12D', '6D', '30D', '10D', '10D', '10D'],
  },
  {
    ad: 'y8',
    en: 1501,
    boy: 2000,
    dogru: ['30D', '12D', '12D', '6D', '30D', '10D', '10D', '10D'],
  },
  {
    ad: 'y9',
    en: 1501,
    boy: 2000,
    dogru: ['30D', '12D', '12D', '6D', '30D', '10Y', '10Y', '10Y'],
  },
  {
    ad: 'y10',
    en: 1501,
    boy: 2000,
    dogru: ['30D', '12D', '12D', '6D', '30D', '10D', '10D', '10D'],
  },
]

/** Okunanlarla doğruların kaçı birebir tutuyor (her okuma bir kez sayılıyor). */
function tutan(okunan: string[], dogru: string[]): number {
  const havuz = [...okunan]
  let sayi = 0
  for (const beklenen of dogru) {
    const yer = havuz.indexOf(beklenen)
    if (yer !== -1) {
      havuz.splice(yer, 1)
      sayi++
    }
  }
  return sayi
}

describe('gerçek kâğıtlar', () => {
  it('okur', () => {
    const agirliklar = agirliklariCoz(AGIRLIKLAR)
    let toplamDogru = 0
    let toplamTutan = 0
    let toplamOkunan = 0
    // Eski (k) ve yeni (y) kâğıtlar ayrı sayılıyor: ağ yalnızca y kâğıtlarının
    // karakterleriyle eğitiliyor ve k kümesi ona hiç gösterilmemiş oluyor.
    const kume: Record<string, { dogru: number; tutan: number }> = {
      k: { dogru: 0, tutan: 0 },
      y: { dogru: 0, tutan: 0 },
    }

    for (const k of KAGITLAR) {
      const yol = `${DIZIN}/${k.ad}.rgba`
      if (!existsSync(yol)) continue
      const ham = new Uint8ClampedArray(readFileSync(yol))
      const kagit = kagidaKirp(grilestir(ham, k.en, k.boy))
      const hazirlik = process.env.HAZIRLIK ?? 'esik'
      const gri = hazirlik === 'kontrast' ? yerelKontrast(kagit) : uyarlamaliEsik(kagit)
      const okuma = satirlariOku(gri, agirliklar)
      const okunan = okuma.satirlar.map((s) => s.metin)

      const t = tutan(okunan, k.dogru)
      toplamDogru += k.dogru.length
      toplamTutan += t
      toplamOkunan += okunan.length
      kume[k.ad[0]].dogru += k.dogru.length
      kume[k.ad[0]].tutan += t

      console.log(
        `${k.ad}: ${t}/${k.dogru.length} tuttu (${okunan.length} satır okundu) — ${okunan.join(' | ')}`,
      )
    }

    const oran = ((toplamTutan / toplamDogru) * 100).toFixed(1)
    const yuzde = (a: number, b: number) => ((a / b) * 100).toFixed(1)
    console.log(
      `\n>>> TOPLAM %${oran} (${toplamTutan}/${toplamDogru}) | eski %${yuzde(kume.k.tutan, kume.k.dogru)} (${kume.k.tutan}/${kume.k.dogru}) | yeni %${yuzde(kume.y.tutan, kume.y.dogru)} (${kume.y.tutan}/${kume.y.dogru}) | ${toplamOkunan} satır okundu`,
    )
  }, 300_000)
})
