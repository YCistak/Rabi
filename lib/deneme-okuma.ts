/**
 * Deneme fotoğrafındaki metni ders sonuçlarına çevirir — saf mantık.
 *
 * Öğrenci deneme kitapçığının üstüne "Matematik 38D 2Y" diye yazıyor; kamera
 * okuyor, kutular kendiliğinden doluyor. Bu dosya OCR'ın **çıktısını**
 * ayrıştırıyor, fotoğrafı çekmiyor ve metni tanımıyor — o iş
 * `lib/deneme-ocr.ts` içinde ve cihaza bağlı. Ayrım bilerek: tanıma telefon
 * ister, ayrıştırma istemez ve asıl hata buradan çıkar.
 *
 * ## Okunan hiçbir şey doğrudan kaydedilmiyor
 *
 * Çıkan sayılar kutulara **yazılıyor**, kaydedilmiyor; kullanıcı görüp
 * onaylıyor. `AGENTS.md`'deki Doğruluk kuralının aynısı: tahmin kesin sayı
 * gibi sunulmaz. Üstelik burada tahminin kaynağı el yazısı — model basılı
 * metin için eğitildi ve yanılacak.
 *
 * ## Şüphedeyken doldurma
 *
 * Her belirsizlik `atlananlar`a düşüyor, bir tahminle doldurulmuyor. Yanlış
 * dolmuş bir kutu boş kutudan kötü: boşu kullanıcı görüp yazar, yanlışı
 * fark etmeden kaydeder. Üç yerde şüphe var ve üçünde de satır atlanıyor:
 * ders adı iki derse birden uyuyorsa, sayılardan yalnızca biri okunduysa, ve
 * doğru + yanlış ders soru sayısını aşıyorsa.
 */

import { sadelestir } from './metin'
import type { Sablon, SablonDers } from './types'

/** Kullanıcıya gösterilen yazım örneği; okuma bu düzene göre ayarlandı. */
export const ORNEK_YAZIM = 'Matematik 38D 2Y'

/**
 * İkinci örnek: boşla yazım.
 *
 * Öğrencilerin çoğu sonucu doğru/yanlış diye değil doğru/boş diye tutuyor ve
 * kâğıda öyle yazıyor. Yalnızca ilk örneği göstermek, okumanın desteklemediği
 * bir düzen varmış gibi durmasına yol açıyordu — oysa üçüncü sayı zaten
 * çıkarımla buluyor.
 */
export const ORNEK_YAZIM_BOS = 'Türkçe 15D 20B'

export type OkunanDers = {
  dersId: string
  dogru: number
  yanlis: number
}

export type OkumaSonucu = {
  /** Kutulara yazılacak satırlar — şablonun ders sırasında. */
  okunanlar: OkunanDers[]
  /**
   * Ders adı bulunduğu hâlde okunamayan satırların ders adları.
   * Arayüz "şunları okuyamadım, sen yaz" diyebilsin diye ayrı duruyor.
   */
  atlananlar: string[]
}

/**
 * Ders kimliği → o dersin kâğıtta görünebilecek adları.
 *
 * Şablonun kendi `ad` alanı zaten anahtar olarak kullanılıyor; buradakiler
 * öğrencinin gerçekte yazdıkları. Hepsi sadeleştirilmiş yazılıyor (Türkçe harf
 * yok) çünkü karşılaştırma sadeleştirilmiş metinde yapılıyor.
 *
 * **En az üç harf.** İki harflik kısaltma ("tm", "fk") satırın içinde başka bir
 * kelimenin parçası olarak yakalanıyor ve yanlış derse yazıyor.
 */
const ESANLAMLI: Record<string, readonly string[]> = {
  turkce: ['turkce', 'turk'],
  matematik: ['matematik', 'temel matematik', 'mat'],
  edebiyat: ['edebiyat', 'turk dili', 'edb', 'tdb', 'tde'],
  tarih: ['tarih', 'trh', 'tar'],
  tarih1: ['tarih-1', 'tarih 1', 'tarih1', 'tar-1', 'tar 1', 'tar1'],
  tarih2: ['tarih-2', 'tarih 2', 'tarih2', 'tar-2', 'tar 2', 'tar2'],
  cografya: ['cografya', 'cog'],
  cografya1: ['cografya-1', 'cografya 1', 'cografya1', 'cog-1', 'cog 1', 'cog1'],
  cografya2: ['cografya-2', 'cografya 2', 'cografya2', 'cog-2', 'cog 2', 'cog2'],
  felsefe: ['felsefe', 'fel', 'fels'],
  din: ['din', 'din kulturu', 'dkab'],
  fizik: ['fizik', 'fzk', 'fiz'],
  kimya: ['kimya', 'kmy', 'kim'],
  biyoloji: ['biyoloji', 'byoloji', 'biyo', 'byl', 'biy'],
  ingilizce: ['ingilizce', 'ing', 'yds', 'ydt'],
}

/**
 * Eşleşme bir sözcüğün tamamını mı kaplıyor?
 *
 * İki ayrı hatayı birden kesiyor. Solda: "mat" kısaltması "otomat"ın içinde
 * yakalanıyordu. Sağda -- ve asıl can sıkan -- "tarih 1" eşanlamlısı
 * "tarih 10d 2y" satırında **"tarih 1"** olarak eşleşiyor, geriye "0d 2y"
 * kalıyor ve 10 doğru, 0 doğru diye okunuyordu.
 */
function sozSiniriMi(satir: string, bas: number, uzunluk: number): boolean {
  const alfanumerik = /[a-z0-9]/
  const onceki = satir[bas - 1]
  const sonraki = satir[bas + uzunluk]
  if (onceki !== undefined && alfanumerik.test(onceki)) return false
  if (sonraki !== undefined && alfanumerik.test(sonraki)) return false
  return true
}

/** Bir anahtarın satırda bulunduğu yer. */
type Bulgu = {
  ders: SablonDers
  bas: number
  son: number
  uzunluk: number
}

/**
 * Bir dersin aranacak adları: şablondaki adı, adın uzun kelimeleri ve
 * eşanlamlıları.
 *
 * Adın kelimelerine ayrılması şart: şablonda "Türk Dili ve Edebiyatı" yazıyor
 * ama kimse kâğıda onu yazmıyor. Kısa kelimeler ("ve", "dil") atılıyor —
 * satırın içinde başka yerlerde de geçiyorlar.
 */
function anahtarlar(ders: SablonDers): string[] {
  const ad = sadelestir(ders.ad)
  const kume = new Set<string>([ad])
  for (const esanlamli of ESANLAMLI[ders.id] ?? []) kume.add(esanlamli)
  for (const kelime of ad.split(/[^a-z0-9]+/)) {
    if (kelime.length >= 4) kume.add(kelime)
  }
  return [...kume].filter((a) => a.length >= 3)
}

/**
 * Satırdaki ders adlarını yerleriyle birlikte bulur.
 *
 * Aynı yerde birden çok anahtar eşleşebiliyor ("tarih" ile "tarih-1" ikisi de
 * aynı harften başlıyor); uzun olan kazanıyor çünkü daha belirleyici. **Uzunluk
 * da eşitse iki ders birbirinden ayrılamıyor demektir** ve o yer tümüyle
 * atılıyor: AYT Sözel'de yalnızca "Tarih" yazan bir satır Tarih-1'e de Tarih-2'ye
 * de uyuyor ve birini seçmek yazı tura atmak olurdu.
 */
function dersleriBul(satir: string, dersler: SablonDers[]): { bulgular: Bulgu[]; belirsiz: string[] } {
  const adaylar: Bulgu[] = []

  for (const ders of dersler) {
    for (const anahtar of anahtarlar(ders)) {
      let yer = satir.indexOf(anahtar)
      while (yer !== -1) {
        if (sozSiniriMi(satir, yer, anahtar.length)) {
          adaylar.push({ ders, bas: yer, son: yer + anahtar.length, uzunluk: anahtar.length })
        }
        yer = satir.indexOf(anahtar, yer + 1)
      }
    }
  }

  // Uzundan kısaya: aynı yeri paylaşan eşleşmelerden belirleyici olan önce
  // yerleşsin, kısası çakışma denetimine takılıp düşsün.
  adaylar.sort((a, b) => b.uzunluk - a.uzunluk || a.bas - b.bas)

  const bulgular: Bulgu[] = []
  const belirsiz: string[] = []

  for (const aday of adaylar) {
    const cakisan = bulgular.find((b) => aday.bas < b.son && b.bas < aday.son)
    if (cakisan === undefined) {
      bulgular.push(aday)
      continue
    }
    // Aynı yerde, aynı uzunlukta, **başka** bir ders: ayırt edilemiyor.
    if (
      cakisan.uzunluk === aday.uzunluk &&
      cakisan.bas === aday.bas &&
      cakisan.ders.id !== aday.ders.id
    ) {
      belirsiz.push(cakisan.ders.ad)
      bulgular.splice(bulgular.indexOf(cakisan), 1)
    }
  }

  bulgular.sort((a, b) => a.bas - b.bas)
  return { bulgular, belirsiz }
}

/** `38d` / `38 dogru` gibi işaretli sayılar. */
const DOGRU_DESENI = /(\d{1,3})\s*d(?:ogru)?(?![a-z0-9])/
const YANLIS_DESENI = /(\d{1,3})\s*y(?:anlis)?(?![a-z0-9])/
const BOS_DESENI = /(\d{1,3})\s*b(?:os)?(?![a-z0-9])/
/** "Full" / "tamamı": sayı yerine kelimeyle yazılan tam sonuç. */
const TAMAMI_DESENI = /(?:^|[^a-z])(?:full|tamami|tamam|hepsi)(?![a-z0-9])/

/**
 * Ders adından sonra gelen parçadan doğru/yanlış çıkarır.
 *
 * Üç işaret de aranıyor: `D`, `Y` ve `B`. İşaretler aranırken sıraya
 * bakılmıyor — kâğıtta "3Y 2D" diye ters yazan da var.
 *
 * ## Boş neden gerekiyor
 *
 * Öğrenciler sonucu doğru/yanlış diye değil **doğru/boş** diye yazıyor:
 * "Coğ1: 2D 1B", "Temel Matematik: 15D 20B", "TDE: 5B 10Y". `B` bilinmezken
 * bu satırlar işaretsiz sanılıp ilk iki sayı doğru ve yanlış diye okunuyordu —
 * "2D 1B" **2 doğru 1 yanlış** oluyordu. Yanlış dolmuş kutu, hiç dolmamış
 * kutudan kötü: kullanıcı onu fark etmeden kaydediyor.
 *
 * ## Üçüncü sayı çıkarımla bulunuyor
 *
 * Doğru + yanlış + boş, dersin soru sayısına eşit. İkisi yazılmışsa üçüncüsü
 * tahmin değil **aritmetik**: "15D 20B" yazan 40 soruluk Temel Matematik'te
 * yanlış 5'tir. Çıkarım yalnızca şablondaki soru sayısı doğruysa geçerli;
 * öğrencinin kâğıdı başka bir sınava aitse sayı kayar. Bu yüzden sonuç
 * negatif çıkarsa satır atlanıyor ve okunanlar kutulara yazılıp kullanıcıya
 * gösteriliyor, doğrudan kaydedilmiyor.
 *
 * **Tek işaret yetmiyor.** Yalnızca "38D" yazılmışsa yanlışın sıfır olduğu
 * bilinmiyor — yazılmamış olabilir. Sıfır yazmak veriyi uydurmak olurdu.
 * "Coğ: 1B" ve "Kim: 5Y" de aynı sebeple atlanıyor.
 */
function sayilariCoz(parca: string, soruSayisi: number): { dogru: number; yanlis: number } | null {
  const sayi = (desen: RegExp): number | null => {
    const es = desen.exec(parca)
    return es === null ? null : Number(es[1])
  }
  const dogru = sayi(DOGRU_DESENI)
  const yanlis = sayi(YANLIS_DESENI)
  const bos = sayi(BOS_DESENI)

  if (dogru !== null && yanlis !== null) return { dogru, yanlis }
  if (dogru !== null && bos !== null) return tamamla(dogru, soruSayisi - dogru - bos)
  if (yanlis !== null && bos !== null) return tamamla(soruSayisi - yanlis - bos, yanlis)

  /*
    Tek işaret genelde yetmiyor ama işaret soru sayısına eşitse geriye
    belirsizlik kalmıyor: "Din K.: 5D" yazan öğrenci 5 soruluk dersin hepsini
    doğru yapmış, yanlışı sıfır olmak zorunda. Bu çıkarım değil, tek olasılık.
  */
  if (dogru === soruSayisi) return { dogru, yanlis: 0 }
  if (yanlis === soruSayisi) return { dogru: 0, yanlis: soruSayisi }
  if (dogru !== null || yanlis !== null || bos !== null) return null

  // "Tarih: Full" -- hepsini doğru yapanın kullandığı yazım; sayı yazmıyor.
  if (TAMAMI_DESENI.test(parca)) return { dogru: soruSayisi, yanlis: 0 }

  const sayilar = [...parca.matchAll(/\d{1,3}/g)].map((e) => Number(e[0]))
  if (sayilar.length < 2) return null
  return { dogru: sayilar[0], yanlis: sayilar[1] }
}

/** Çıkarımla bulunan sayı eksiye düşerse okuma yanlış demektir. */
function tamamla(dogru: number, yanlis: number): { dogru: number; yanlis: number } | null {
  return dogru < 0 || yanlis < 0 ? null : { dogru, yanlis }
}

/**
 * Bir OCR çıktısı ne kadar işe yarıyor?
 *
 * Aynı fotoğraf iki kez tanınıyor — ham ve eşiklenmiş — ve hangisinin
 * kullanılacağına buradaki sayı karar veriyor (`lib/deneme-ocr.ts`). Ölçü
 * "kaç karakter okundu" değil: eşikleme gürültüyü de harfe benzetebiliyor ve
 * uzun ama anlamsız bir metin, kısa ama doğru olandan yüksek çıkardı.
 *
 * Sayılan şey **işaretli sayı**: "38d", "2 y", "1b". Kâğıttan aradığımız tek
 * şey bu ve gürültünün rastgele üretmesi zor.
 */
export function okumaPuani(metin: string): number {
  return [...sadelestir(metin).matchAll(/\d{1,3}\s*[dyb](?![a-z0-9])/g)].length
}

/**
 * OCR metnini şablonun derslerine oturtur.
 *
 * Satır satır işleniyor ama bir satırda birden çok ders olabiliyor: OCR
 * "Türkçe 32D 5Y Matematik 38D 2Y" gibi iki kaydı tek satıra birleştirebiliyor.
 * Bu yüzden ders adları satır içinde **yer**leriyle bulunuyor ve her dersin
 * sayıları kendi adıyla bir sonraki ders adı arasından okunuyor.
 */
/**
 * Bir ders adı, sayıları uzun bir addan sonra alt satıra taşabiliyor.
 *
 * Kâğıtta "Türk Dili ve Edebiyat.: 36D" yazıp satır bitince "1B"yi altına
 * yazan öğrenci var; OCR de bunu iki ayrı satır olarak veriyor. Alt satırda
 * ders adı yok, o yüzden tek başına hiçbir şeye bağlanamıyor ve sayılar
 * kayboluyordu.
 *
 * Yalnızca **işaretli sayılardan ibaret** satırlar bir öncekine ekleniyor.
 * Ölçü dar tutuldu: harf taşıyan bir satır kendi başına bir kayıt olabilir ve
 * onu yukarıdakine yapıştırmak iki dersin sayılarını karıştırırdı.
 */
function satirlar(metin: string): string[] {
  const cikti: string[] = []

  for (const ham of metin.split(/\r?\n/)) {
    const satir = sadelestir(ham)
    if (satir === '') continue

    if (cikti.length > 0 && yalnizcaSayiSatiri(satir)) {
      cikti[cikti.length - 1] += ' ' + satir
      continue
    }
    cikti.push(satir)
  }

  return cikti
}

/** Satırda işaretli sayılardan başka bir şey var mı? */
function yalnizcaSayiSatiri(satir: string): boolean {
  if (!/\d/.test(satir)) return false
  return satir.replace(/\d{1,3}\s*[dyb](?![a-z0-9])/g, ' ').replace(/[^a-z]/g, '') === ''
}

export function denemeyiCoz(metin: string, sablon: Sablon): OkumaSonucu {
  const bulunanlar = new Map<string, OkunanDers>()
  const atlanan = new Set<string>()
  // Aynı ders iki kez ve **farklı** sayılarla okunursa ikisi de güvenilmez.
  const cakisan = new Set<string>()

  for (const satir of satirlar(metin)) {

    const { bulgular, belirsiz } = dersleriBul(satir, sablon.dersler)
    for (const ad of belirsiz) atlanan.add(ad)

    for (const [sira, bulgu] of bulgular.entries()) {
      const sonrakiBas = bulgular[sira + 1]?.bas ?? satir.length
      const sayilar = sayilariCoz(satir.slice(bulgu.son, sonrakiBas), bulgu.ders.soruSayisi)

      if (sayilar === null) {
        atlanan.add(bulgu.ders.ad)
        continue
      }

      // Ders soru sayısını aşan bir sonuç okunmuş olamaz: ya sayı yanlış
      // tanındı ya satırda başka bir şey vardı.
      if (sayilar.dogru + sayilar.yanlis > bulgu.ders.soruSayisi) {
        atlanan.add(bulgu.ders.ad)
        continue
      }

      const onceki = bulunanlar.get(bulgu.ders.id)
      if (onceki && (onceki.dogru !== sayilar.dogru || onceki.yanlis !== sayilar.yanlis)) {
        cakisan.add(bulgu.ders.id)
        atlanan.add(bulgu.ders.ad)
        continue
      }
      bulunanlar.set(bulgu.ders.id, { dersId: bulgu.ders.id, ...sayilar })
    }
  }

  for (const dersId of cakisan) bulunanlar.delete(dersId)
  for (const okunan of bulunanlar.values()) atlanan.delete(dersAdi(sablon, okunan.dersId))

  return {
    // Şablonun kendi sırası: kutular ekranda o sırada duruyor.
    okunanlar: sablon.dersler
      .map((d) => bulunanlar.get(d.id))
      .filter((o): o is OkunanDers => o !== undefined),
    atlananlar: [...atlanan],
  }
}

function dersAdi(sablon: Sablon, dersId: string): string {
  return sablon.dersler.find((d) => d.id === dersId)?.ad ?? dersId
}

/**
 * Okunan sonuç hangi şablona daha çok uyuyor?
 *
 * Öğrenci TYT seçiliyken AYT kâğıdını okutabiliyor. Şablon **değiştirilmiyor**,
 * yalnızca öneriliyor: seçimi sessizce değiştirmek, kullanıcının bilerek
 * seçtiği şablonu elinden almak olurdu.
 *
 * Null dönmesi "seçili şablon zaten en iyisi" demek.
 */
export function sablonOnerisi(metin: string, secili: Sablon, adaylar: Sablon[]): Sablon | null {
  const puan = (sablon: Sablon) => denemeyiCoz(metin, sablon).okunanlar.length
  const seciliPuan = puan(secili)

  let enIyi: Sablon | null = null
  let enIyiPuan = seciliPuan

  for (const aday of adaylar) {
    if (aday.id === secili.id) continue
    const adayPuan = puan(aday)
    // Eşitlikte öneri yok: aynı kadar ders okuyan iki şablondan birini öne
    // çıkarmak için sebep yok ve seçili olan kullanıcının kendi kararı.
    if (adayPuan > enIyiPuan) {
      enIyi = aday
      enIyiPuan = adayPuan
    }
  }

  return enIyi
}
