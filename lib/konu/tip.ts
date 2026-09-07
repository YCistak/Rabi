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
 * Kart görsellerinde kullanılabilecek renkler.
 *
 * Serbest renk yok: kart dersin renkli zemininin üstünde duruyor ve içine
 * yazılan bir renk o zeminle çakışabiliyor. Üçü de tema değişkenine bağlanıyor
 * (`kart-gorseli.tsx`), yani tema değişince görseller de değişiyor.
 */
export type KartRenk = 'ana' | 'ikincil' | 'soluk'

/**
 * Kartın yanındaki çizim — **veri olarak**, çizim kodu olarak değil.
 *
 * İçerik dosyaları `lib/` altında ve React'e bağlı değil (bkz. AGENTS.md);
 * içlerine JSX ya da ham SVG koymak o kuralı kırardı. Üstelik ham SVG kabul
 * eden bir alan her kartın kendi ölçüsünü, kendi rengini ve kendi yazı boyunu
 * kurması demekti — on kartlık bir destede on ayrı çizim dili.
 *
 * Bunun yerine sayılı bir tür kümesi var ve hepsini tek bir bileşen çiziyor
 * (`components/konu/kart-gorseli.tsx`). Yeni bir tür eklemek, bileşene bir dal
 * eklemek demek; içerik dosyası hiçbir zaman çizmiyor, yalnızca **ne**
 * çizileceğini söylüyor.
 *
 * Görsel **isteğe bağlı ve süs değil**: metnin anlattığını tekrar eden bir
 * çizim kartı uzatıyor, yerini daraltıyor ve okunmayı zorlaştırıyor. Görsel,
 * ancak cümlenin tek başına anlatamadığı şeyi gösteriyorsa konur — parabolün
 * kolları, aralığın açık ucu, katmanların sırası.
 */
export type Gorsel =
  | KoordinatGorseli
  | SayiDogrusuGorseli
  | VennGorseli
  | AkisGorseli
  | TabloGorseli
  | KatmanGorseli

/**
 * İki boyutlu çizim düzlemi: grafik **ve** geometri şekli.
 *
 * İkisi tek türde birleşti çünkü ayıran tek şey eksenlerin çizilip
 * çizilmemesi: üçgen de bir kapalı çokgen, parabol de bir eğri. Ayrı iki tür
 * olsalardı nokta, etiket ve renk kuralları iki yerde yazılırdı.
 *
 * Eğriler **nokta listesi** olarak veriliyor ve çizerken yumuşatılıyor; bir
 * fonksiyonu ifade olarak yazmak, içerik dosyasına matematik motoru koymak
 * olurdu. Elle yazılabilsin diye az nokta yeter: y = x² için yedi nokta
 * (−3…3) yumuşatıldığında düzgün bir parabol veriyor.
 */
export type KoordinatGorseli = {
  tur: 'koordinat'
  /** Görünen kutu: [xEnAz, xEnÇok, yEnAz, yEnÇok]. Çizim buna göre ölçekleniyor. */
  pencere: [number, number, number, number]
  /** Eksen ve ızgara çizilsin mi. Geometri şekillerinde kapatılır. */
  eksenler?: boolean
  egriler?: {
    noktalar: [number, number][]
    ad?: string
    renk?: KartRenk
    /** Kesik çizgi — asimptot, yardımcı doğru, yükseklik. */
    kesik?: boolean
    /** Son nokta ilkine bağlanıp içi boyanır: üçgen, dörtgen, taralı bölge. */
    kapali?: boolean
    /** Köşeler yumuşatılmasın — doğru parçaları ve çokgenler için. */
    kirik?: boolean
  }[]
  cemberler?: { x: number; y: number; r: number; ad?: string; renk?: KartRenk }[]
  noktalar?: { x: number; y: number; ad?: string; bos?: boolean; renk?: KartRenk }[]
  /** Serbest yazı — açı ölçüsü, kenar uzunluğu, bölge adı. */
  etiketler?: { x: number; y: number; ad: string; renk?: KartRenk }[]
  xAd?: string
  yAd?: string
}

/**
 * Sayı doğrusu — aralık, eşitsizlik ve mutlak değer için.
 *
 * Aralığın açık/kapalı ucu cümleyle anlatıldığında ("2 dâhil, 5 hariç")
 * okunuyor ama akılda kalmıyor; dolu ve boş nokta tek bakışta ayrılıyor.
 */
export type SayiDogrusuGorseli = {
  tur: 'sayiDogrusu'
  /** Çizilen doğrunun iki ucu. Etiket yazılmaz, yalnızca ölçek kurar. */
  aralik: [number, number]
  /** Altına sayısı yazılan bölüntüler. */
  isaretler?: number[]
  /** Vurgulanan parçalar. Uç `null` ise o yön sonsuza gidiyor demek. */
  parcalar?: {
    bas: number | null
    bit: number | null
    /** Uç dâhil mi — dolu/boş nokta bununla çiziliyor. */
    kapaliBas?: boolean
    kapaliBit?: boolean
    ad?: string
    renk?: KartRenk
  }[]
  noktalar?: { deger: number; ad?: string; bos?: boolean }[]
}

/**
 * Küme diyagramı — kesişim, birleşim ve alt küme.
 *
 * `kapsayan` iki halkayı iç içe çiziyor: alt küme ilişkisini yan yana iki
 * halkayla anlatmak mümkün değil, çakışan alan "bir kısmı" demek.
 */
export type VennGorseli = {
  tur: 'venn'
  sol: string
  sag: string
  /** Ortak alana yazılan şey. Boşsa alan yalnızca boyanır. */
  kesisim?: string
  /** İkisinin de dışında kalan — evrensel kümenin geri kalanı. */
  disi?: string
  /** Sağdaki, solun **içinde** çizilir: A ⊂ B. */
  kapsayan?: boolean
  /**
   * Tek halka: sağdaki, solun **dışında** kalan her şeydir (tümleyen).
   *
   * Ayrı bir alan olmasının sebebi bir hata: tümleyen kartı bir süre sıradan
   * iki halkayla çiziliyordu ve o çizim A ile A′ nün **ortak elemanı var**
   * diyordu — anlatılanın tam tersi. Kesişimi boş olan iki kümeyi çakışan iki
   * daireyle göstermenin doğru bir yolu yok.
   */
  tumleyen?: boolean
  /** Hangi bölge vurgulanacak — kesişim mi, birleşimin tamamı mı, fark mı. */
  vurgu?: 'kesisim' | 'birlesim' | 'solFark' | 'yok'
}

/**
 * Sıralı adımlar — süreç, kronoloji, dönüşüm zinciri.
 *
 * Tarihin zaman çizgisi de bu: aradaki tek fark okun ne anlattığı ve o
 * kartın metninde yazıyor. Ayrı bir "zaman" türü aynı kutuları ikinci kez
 * çizmek olurdu.
 */
export type AkisGorseli = {
  tur: 'akis'
  adimlar: { ad: string; alt?: string; renk?: KartRenk }[]
  /** Adımlar alt alta dizilir. Uzun adlarda yatay sıra ekrana sığmıyor. */
  dikey?: boolean
  /** Son adım ilkine dönüyor: döngüler (su döngüsü, karbon döngüsü). */
  donguSel?: boolean
}

/** İki–üç sütunluk karşılaştırma. Kartın metni farkı söylüyor, tablo hizalıyor. */
export type TabloGorseli = {
  tur: 'tablo'
  basliklar: string[]
  satirlar: string[][]
}

/**
 * Üst üste duran bantlar — atmosfer, yer kürenin katmanları, kayaç döngüsü
 * değil ama toprak profili.
 *
 * `akis` ile karıştırılmasın: orada adımlar arasında ok var ve sıra bir
 * **gidiş**, burada bantlar birbirine değiyor ve sıra bir **konum**. İlk
 * eleman en üstte çiziliyor.
 */
export type KatmanGorseli = {
  tur: 'katman'
  katmanlar: { ad: string; alt?: string; renk?: KartRenk }[]
  /** Sol kenarda yukarıdan aşağı okunan ölçek adı — "yükseklik", "derinlik". */
  eksenAdi?: string
  /**
   * Bantlar aşağı indikçe daralır — kapsama ilişkisi (ℝ ⊃ ℚ ⊃ ℤ ⊃ ℕ).
   *
   * Eşit genişlikteki bantlar dört kümeyi **yan yana** dört küme gibi
   * gösteriyordu; daralma, her bandın bir öncekinin içinde kaldığını
   * söylüyor. Katman bir konum anlatıyorsa (atmosfer) daralma yanlış olur:
   * orada bantlar birbirinin içinde değil, üstünde.
   */
  daralan?: boolean
}

/**
 * Tek bir bilgi kartı.
 *
 * `metin` kasten kısa: kart ekranda tek bakışta okunacak kadar olmalı.
 * Uzunluğu `icerik.test.ts` denetliyor — sınırı aşan kart, ikiye bölünmesi
 * gereken karttır.
 */
export type BilgiKarti = {
  /** `${konuId}-${sıra}` — deste ilerlemesi ve bilinmeyenler listesi bunu kullanır. */
  id: string
  baslik: string
  metin: string
  gorsel?: Gorsel
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
export function kart(
  baslik: string,
  metin: string,
  gorsel?: Gorsel,
): Omit<BilgiKarti, 'id'> {
  return gorsel ? { baslik, metin, gorsel } : { baslik, metin }
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
