import { describe, expect, it } from 'vitest'
import iskelet from './maarif/iskelet.json'
import { KONU_DERSLERI, KONU_SINIFLARI, programBul } from './index'
import type { KonuDersId } from './tip'

/**
 * Bilgi kartlarının konu listesi Maarif programına uyuyor mu?
 *
 * Ölçü `maarif/iskelet.json`: tymm.meb.gov.tr'deki İçerik Çerçevesi'nden
 * çekiliyor (`scripts/maarif-cek.mjs`), elle yazılmıyor. Sebep yaşanmış:
 * konular bir süre hafızadan yazıldı ve eski (2018) programın başlıklarıyla
 * karıştı — yanlış konu, yanlış sıra. Yazılan bir ölçü bayatlıyor, çekilen
 * ölçü bayatlamıyor.
 *
 * **Eşitlik değil benzerlik aranıyor.** Programın kendi başlıkları haritada
 * gösterilemeyecek kadar uzun ("Türkistan'dan Türkiye'ye Uzanan Süreçte Türk
 * Devlet ve Ordu Teşkilatında Meydana Gelen Değişim" 95 karakter, düğüme
 * sığmıyor). Uygulama kısa adı yazıyor, test o kısa adın programdaki hangi
 * konuya karşılık geldiğini denetliyor. Aranan şey **sıra ve kapsam**: kaç
 * konu var, hangi sırada ve her biri programdaki karşılığıyla örtüşüyor mu.
 */

type Iskelet = typeof iskelet
type IskeletDers = Iskelet['dersler'][keyof Iskelet['dersler']]

/**
 * Türk Dili ve Edebiyatı programın İçerik Çerçevesi'ni konu değil **beceri**
 * olarak yazıyor: her temanın altında yalnızca "Okuma, Yazma,
 * Dinleme/İzleme, Konuşma" duruyor ve dördü dört temada da aynı. Bunları
 * konu olarak almak, haritada on altı düğümün dördü ayrı ad taşıması demekti
 * — çalışılacak konu orada değil, temanın metin türlerinde. Tema adları ve
 * sırası yine programdan denetleniyor; konu listesi bu derste elle yazılıyor.
 */
const KONU_LISTESI_DENETLENMEYEN: KonuDersId[] = ['turkce']

/** Karşılaştırma öncesi ad sadeleştirme: büyük harf, kesme ve noktalama fark etmez. */
const sadelestir = (metin: string) =>
  metin
    .toLocaleLowerCase('tr')
    .replace(/[’'"]/g, '')
    .replace(/[^a-zçğıöşü0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * İki başlığın örtüşme oranı — kısa olanın kelimelerinin kaçı ötekinde geçiyor.
 *
 * Kısa olana bölünüyor çünkü uygulamanın adı kasten kısa: "Osmanlı'nın
 * Kuruluşu", programın "Osmanlı Devleti'nin Kuruluşuna Dair Farklı
 * Görüşler"inin karşılığıdır ve uzun olana bölen bir oran bunu kaçırırdı.
 */
function ortusme(a: string, b: string) {
  const kelimeler = (x: string) =>
    new Set(
      sadelestir(x)
        .split(' ')
        .filter((k) => k.length > 3),
    )
  const A = kelimeler(a)
  const B = kelimeler(b)
  if (!A.size || !B.size) return sadelestir(a) === sadelestir(b) ? 1 : 0
  let ortak = 0
  for (const kelime of A) if (B.has(kelime)) ortak++
  return ortak / Math.min(A.size, B.size)
}

/** Bu eşiğin altı "başka bir konu" demek; üstü aynı konunun kısaltılmış adı. */
const ESIK = 0.5

const resmiTemalar = (ders: KonuDersId, sinif: number) =>
  ((iskelet.dersler as Record<string, IskeletDers>)[ders] as Record<
    string,
    IskeletDers[keyof IskeletDers]
  >)[String(sinif)]

/** Yazılmamış program denetlenmiyor: 11. sınıfta yedi dersin dördü var. */
const durumlar = KONU_SINIFLARI.flatMap((sinif) =>
  KONU_DERSLERI.filter((ders) => programBul(ders.id, sinif) !== null).map(
    (ders) => [`${sinif}. sınıf ${ders.ad}`, ders.id, sinif] as const,
  ),
)

describe('Maarif programına uyum', () => {
  it.each(durumlar)('%s: iskelette karşılığı var', (_ad, ders, sinif) => {
    expect(resmiTemalar(ders, sinif)).toBeDefined()
  })

  it.each(durumlar)('%s: tema adları ve sırası programla aynı', (_ad, ders, sinif) => {
    const bizim = programBul(ders, sinif)!.temalar.map((t) => t.ad)
    const resmi = resmiTemalar(ders, sinif).map((t) => t.ad)

    expect(bizim.length, `tema sayısı: ${bizim.join(', ')}`).toBe(resmi.length)
    bizim.forEach((tema, sira) => {
      expect(ortusme(tema, resmi[sira]), `${sira + 1}. tema "${tema}" ≠ "${resmi[sira]}"`)
        .toBeGreaterThanOrEqual(ESIK)
    })
  })

  it.each(durumlar.filter(([, ders]) => !KONU_LISTESI_DENETLENMEYEN.includes(ders)))(
    '%s: konu adları ve sırası programla aynı',
    (_ad, ders, sinif) => {
      const bizim = programBul(ders, sinif)!.temalar.flatMap((t) =>
        t.konular.map((k) => ({ tema: t.ad, ad: k.ad })),
      )
      const resmi = resmiTemalar(ders, sinif).flatMap((t) =>
        t.bolumler.flatMap((b) => b.altKonular.map((a) => a.ad)),
      )

      expect(
        bizim.length,
        `konu sayısı tutmuyor.\n  bizde: ${bizim.map((k) => k.ad).join(' | ')}\n  programda: ${resmi.join(' | ')}`,
      ).toBe(resmi.length)

      bizim.forEach((konu, sira) => {
        expect(
          ortusme(konu.ad, resmi[sira]),
          `${sira + 1}. konu (${konu.tema}) "${konu.ad}" programdaki "${resmi[sira]}" ile örtüşmüyor`,
        ).toBeGreaterThanOrEqual(ESIK)
      })
    },
  )
})
