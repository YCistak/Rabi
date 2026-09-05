/**
 * Konu Anlatımı'nın veri tipleri.
 *
 * Müfredat **Türkiye Yüzyılı Maarif Modeli**ne göre; eski (2018) programın
 * ünite adları kullanılmıyor. Yapı programın kendi yapısıyla aynı: ders →
 * tema → konu → bilgi kartı.
 *
 * Kartlar "her şeyi anlatan ders notu" değil: bir konuda akılda kalması
 * gereken birkaç şey. Uzun kart okunmuyor; okunmayan kart hiç yazılmamış
 * demek.
 */

/**
 * Konu anlatımı olan dersler.
 *
 * Oyunlardaki `DersId`den **ayrı** bir liste: oyunlarda Fizik yok, burada
 * Fizik var ve iki listenin birbirine bağlanması, bir tarafa ders eklemenin
 * öteki tarafta da ders açması demek olurdu.
 */
export type KonuDersId =
  | 'matematik'
  | 'turkce'
  | 'fizik'
  | 'kimya'
  | 'biyoloji'
  | 'tarih'
  | 'cografya'

/** Programın kapsadığı sınıflar. */
export type KonuSinifi = 9 | 10

/**
 * Tek bir bilgi kartı.
 *
 * `metin` kasten kısa: kart ekranda tek bakışta okunacak kadar olmalı.
 * Uzunluğu `kart.test.ts` denetliyor — sınırı aşan kart, ikiye bölünmesi
 * gereken karttır.
 */
export type BilgiKarti = {
  /** `${konuId}-${sıra}` — deste ilerlemesi ve bilinmeyenler listesi bunu kullanır. */
  id: string
  baslik: string
  metin: string
}

/**
 * Deste okunduktan sonra sorulan tek soru.
 *
 * Kart bir şeyi anlatıyor, soru onu **geri istiyor**: okuduğunu hatırlayıp
 * hatırlamadığını okuyan kişi kendi söylüyor. Soru ile cevap bu yüzden ayrı
 * iki yüz — cevabı görmeden verilen "biliyorum", bilmeyi değil emin olmayı
 * ölçer.
 *
 * **Sorular henüz yazılmadı ve yazılmayan konu soru sormuyor.** `konu()`ya
 * dördüncü parametre verilmezse deste boş kalıyor; harita da boş desteyi
 * açmıyor (`konu-haritasi.tsx`). Bir süre her konu kart sayısı kadar **boş**
 * soru taşıdı — ekranı boş kartlarla denemek içindi ama koşul "sorusu var mı"
 * diye baktığı için deste biten her konuda metinsiz bir sınav açılıyordu.
 * Soru yazılan konu ekranı kendiliğinden kazanıyor, ötekiler eskisi gibi
 * destenin sonunda kapanıyor.
 */
export type SoruKarti = {
  /** `${konuId}-s${sıra}` — kart kimlikleriyle çakışmasın diye 's' ekli. */
  id: string
  soru: string
  cevap: string
}

export type Konu = {
  id: string
  ad: string
  kartlar: BilgiKarti[]
  sorular: SoruKarti[]
}

export type Tema = {
  id: string
  /** Maarif programındaki tema/ünite adı, olduğu gibi. */
  ad: string
  konular: Konu[]
}

export type DersProgrami = {
  ders: KonuDersId
  sinif: KonuSinifi
  /**
   * Programın bir cümlelik yolu — "Sayılardan olasılığa".
   *
   * Harita ekranının tepesindeki kart bunu başlık olarak yazıyor. Elle
   * yazılıyor, ilk ve son temanın adından türetilmiyor: Türkçede ad durumu
   * eki ("Sayılar" → "Sayılardan", "Enerji" → "Enerjiden") kurala
   * bağlanamıyor ve türetilen cümle her programda bir kez bozuk çıkıyordu.
   */
  ozet: string
  temalar: Tema[]
}

/** Yazarken okunur kalsın diye kısa kurucular. İçerik dosyaları bunları kullanır. */
export function kart(baslik: string, metin: string): Omit<BilgiKarti, 'id'> {
  return { baslik, metin }
}

/**
 * Kart kimlikleri konu kimliğinden ve **sıradan** türüyor.
 *
 * Ortaya kart eklemek sonraki kartların kimliğini kaydırır; bu yüzden
 * bilinmeyenler bankası kartın metnini kendi içinde saklıyor
 * (`ilerleme.ts`) — kimlik kayarsa bile kullanıcının kaydettiği bilgi
 * yerinde kalıyor, kimlik yalnızca aynı kartın iki kez eklenmesini önlüyor.
 */
export function konu(
  id: string,
  ad: string,
  kartlar: Omit<BilgiKarti, 'id'>[],
  sorular?: Omit<SoruKarti, 'id'>[],
): Konu {
  return {
    id,
    ad,
    kartlar: kartlar.map((k, sira) => ({ ...k, id: `${id}-${sira + 1}` })),
    sorular: (sorular ?? []).map((s, sira) => ({
      ...s,
      id: `${id}-s${sira + 1}`,
    })),
  }
}

/** Soru kurucusu — `kart` ile aynı kalıp; içerik dosyaları bunu kullanacak. */
export function soru(soru: string, cevap: string): Omit<SoruKarti, 'id'> {
  return { soru, cevap }
}

export function tema(id: string, ad: string, konular: Konu[]): Tema {
  return { id, ad, konular }
}

export function program(
  ders: KonuDersId,
  sinif: KonuSinifi,
  ozet: string,
  temalar: Tema[],
): DersProgrami {
  return { ders, sinif, ozet, temalar }
}
