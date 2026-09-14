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
    /**
     * Son noktaya ok başı konur.
     *
     * Vektör için şart: yönü olmayan bir çizgi vektör değil doğru parçasıdır.
     * Kuvvet, hız ve yer değiştirme çizimlerinde okun ucu, çizginin kendisi
     * kadar bilgi taşıyor.
     */
    ok?: boolean
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
  /**
   * Kartın başlığının üstündeki küçük etiket — "Tanım", "Ölçme", "Kapanış".
   *
   * Kartın destede ne iş gördüğünü söylüyor; yoksa deste o yere "Kart 3/7"
   * yazıyor. İçerik dosyalarının çoğunda henüz yok: alan tasarımla birlikte
   * açıldı, metinler sonra yazılacak.
   */
  etiket?: string
  /**
   * Rabi'nin notu — kartın altında, maskotun yanındaki balonda.
   *
   * Kartı tekrar etmiyor, kartı **nasıl okuyacağını** söylüyor ("Sıralamayı
   * ezberleme; her okun neden o yöne baktığını sor"). Notu olmayan kartta
   * balon da maskot da çizilmiyor: boş bir balonun yanında duran tavşan,
   * söyleyecek sözü olmayan bir rehber gibi görünür.
   *
   * **Her konuda bir kartta var, hepsinde değil.** Fizik 9'un örnek konusu
   * dışında 247 konunun her birinde tek karta not yazıldı — konunun en
   * sık yanlış okunan, en çok tuzak barındıran kartına. Her karta not
   * konsaydı tavşan destenin her sayfasında konuşur ve sözü değerini
   * yitirirdi; arada bir çıkan not "buraya dikkat" demek. Yeni konu eklerken
   * de kural bu: bir kart seç, ona "nasıl okunmalı" yaz.
   */
  not?: string
}

/**
 * Hızlı kontrol — destenin **ortasında**, okunmuş kartlardan sorulan tek
 * iki şıklı soru.
 *
 * Deste sonundaki doğru/yanlış yoklamasından ayrı: o yoklama okumanın
 * bittiğini söylüyor, bu ise okuma sürerken "önceki kartlar oturdu mu" diye
 * bakıyor. İki şık yeter — şıkları elenen dört seçenekli bir soru, okumanın
 * ortasına bir sınav koyar.
 *
 * Yanlış cevapta "Tekrar oku" `kart` numaralı karta dönüyor; soru bu yüzden
 * hangi karta dayandığını kendisi söylüyor. Deste soruyu ancak o kart
 * okunduktan sonra araya koyuyor (`deste-akisi.ts`).
 *
 * Konu başına bir ya da iki soru: on karttan uzun destede iki, kısasında bir
 * (`icerik.test.ts` denetliyor). Uzun destede tek soru, ikinci yarının hiç
 * yoklanmaması demek.
 */
export type HizliKontrol = {
  soru: string
  /** İki şık; `dogru` bunlardan hangisinin doğru olduğunu söylüyor (0 ya da 1). */
  siklar: [string, string]
  dogru: 0 | 1
  /** Karardan sonra Rabi'nin balonunda çıkan gerekçe — doğruya ve yanlışa ayrı. */
  aciklama: { dogru: string; yanlis: string }
  /** Sorunun dayandığı kartın sırası (1'den başlar). "Tekrar oku" oraya döner. */
  kart: number
}

/**
 * Deste okunduktan sonra sorulan sorular — iki biçim.
 *
 * İlk biçim **doğru/yanlış**: bir iddia ve iki düğme. Biçim kasten dar
 * tutuldu; deste okunduktan hemen sonra gelen ekran ikinci bir ders değil
 * bir yoklama. İkinci biçim **iki şıklı soru** sonradan eklendi: yalnızca
 * iddia soran bir yoklama, "hangisi" diye soramıyordu (Pisagor üçlüsü hangisi,
 * hangi organel ATP üretir). Şık sayısı yine ikiyle sınırlı — dört şıklı bir
 * soru okumanın arkasına bir sınav ekler.
 *
 * Kararın kendisi ölçülüyor, kullanıcının kendi beyanı değil: eskiden kart
 * çevriliyor, cevabı gören kişi "bildim/bilmedim" diyordu — o sayı bilmeyi
 * değil dürüstlüğü ölçüyordu. `dogru` cevabı taşıdığı için ekran kararı
 * kendisi tartıyor.
 *
 * `aciklama` karardan **sonra** görünüyor ve her zaman var: yanlış bilinen
 * bir iddiada "yanlış" demek yetmez, doğrusunun ne olduğunu söylemeyen bir
 * yoklama öğretmiyor.
 */
export type SoruKarti = DogruYanlisSorusu | SikliSoru

export type DogruYanlisSorusu = {
  /** `${konuId}-s${sıra}` — kart kimlikleriyle çakışmasın diye 's' ekli. */
  id: string
  /** Biçim ayırıcı; doğru/yanlışta yazılmıyor — eski içerik olduğu gibi duruyor. */
  tur?: 'dogru-yanlis'
  /** Doğru ya da yanlış olduğuna karar verilecek iddia. */
  ifade: string
  /** İddia doğru mu. */
  dogru: boolean
  /** Karardan sonra gösterilen tek cümlelik gerekçe. */
  aciklama: string
  /**
   * İddianın yanındaki çizim — bilgi kartlarındakiyle **aynı** tür kümesi.
   *
   * Ayrı bir görsel dili açılmadı: soru da kartın anlattığı şeyi soruyor ve
   * grafiğe bakarak verilen karar, cümleyi hatırlamaya çalışarak verilenden
   * hem hızlı hem gerçek. Görsel yalnızca iddianın **kendisi** çizime
   * bakılarak tartılabiliyorsa konur; iddiayı tekrar eden bir çizim cevabı
   * okumadan verdirir.
   */
  gorsel?: Gorsel
}

/** İki şıklı soru: soru cümlesi, iki şık ve doğrunun dizini. Hızlı kontrolle aynı kalıp. */
export type SikliSoru = {
  id: string
  tur: 'sikli'
  soru: string
  siklar: [string, string]
  dogru: 0 | 1
  aciklama: string
  gorsel?: Gorsel
}

export type Konu = {
  id: string
  ad: string
  kartlar: BilgiKarti[]
  sorular: SoruKarti[]
  /** Destenin ortasındaki hızlı kontroller; her biri dayandığı karttan sonra araya giriyor. */
  kontroller: HizliKontrol[]
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
  ek?: Pick<BilgiKarti, 'etiket' | 'not'>,
): Omit<BilgiKarti, 'id'> {
  // Boş alan yazılmıyor: `gorsel: undefined` taşıyan bir kart testte ve
  // yedekte "görseli var ama boş" gibi okunuyordu.
  return {
    baslik,
    metin,
    ...(gorsel ? { gorsel } : {}),
    ...(ek?.etiket ? { etiket: ek.etiket } : {}),
    ...(ek?.not ? { not: ek.not } : {}),
  }
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
  kontroller?: HizliKontrol[],
): Konu {
  return {
    id,
    ad,
    kartlar: kartlar.map((k, sira) => ({ ...k, id: `${id}-${sira + 1}` })),
    sorular: (sorular ?? []).map(
      (s, sira) => ({ ...s, id: `${id}-s${sira + 1}` }) as SoruKarti,
    ),
    kontroller: kontroller ?? [],
  }
}

/** Soru kurucusu — `kart` ile aynı kalıp. */
export function soru(
  ifade: string,
  dogru: boolean,
  aciklama: string,
  gorsel?: Gorsel,
): Omit<DogruYanlisSorusu, 'id'> {
  return gorsel ? { ifade, dogru, aciklama, gorsel } : { ifade, dogru, aciklama }
}

/** İki şıklı soru kurucusu. `dogru` şıkların dizini: 0 birinci, 1 ikinci. */
export function sikli(
  soru: string,
  siklar: [string, string],
  dogru: 0 | 1,
  aciklama: string,
  gorsel?: Gorsel,
): Omit<SikliSoru, 'id'> {
  return gorsel
    ? { tur: 'sikli', soru, siklar, dogru, aciklama, gorsel }
    : { tur: 'sikli', soru, siklar, dogru, aciklama }
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
