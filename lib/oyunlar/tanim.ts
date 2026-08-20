import type { OyunId, OyunIstatistigi, OyunKayitlari } from '../types'
import { BOSS_ARALIGI, MATEMATIK_TUR_SORUSU, SORU_SURESI } from './ritim'
import { istatistigiTamamla } from './tur'
import { HAVUZ_BOYUTU } from './yazim-havuzu'
import { NOKTALAMA_BOYUTU } from './noktalama-havuzu'
import { SES_BOYUTU } from './ses-havuzu'
import { OGE_BOYUTU } from './oge-havuzu'
import { SOZ_BOYUTU } from './soz-havuzu'
import { EDEBIYAT_BOYUTU } from './edebiyat-havuzu'
import { ANTLASMA_BOYUTU } from './antlasma-havuzu'
import { KAVRAM_BOYUTU } from './kavram-havuzu'
import { EL_BOYUTU as ANTLASMA_EL_BOYUTU } from './antlasma'
import { CELDIRICI_SAYISI, KAVRAM_SAYISI } from './kavram'
import { ANLATIM_BOYUTU } from './anlatim-havuzu'
import { ORTAK_BOYUTU } from './ortak-havuzu'
import { SINIFLANDIRMA_BOYUTU } from './siniflandirma-havuzu'
import { HUCRE_BOYUTU } from './hucre-havuzu'
import { IPUCU_SAYISI } from './hucre'
import { SIRALA_BOYUTU } from './sirala-havuzu'
import { BOSS_KART_SAYISI, KART_SAYISI, TAM_BONUS } from './sirala'
import { TUZAK_BOYUTU } from './tuzak-havuzu'
import {
  BONUS_SURESI as KOKLU_BONUS_SURESI,
  CUBUK_EN_AZ as KOKLU_EN_AZ,
  CUBUK_EN_COK as KOKLU_EN_COK,
} from './koklu'

/**
 * Mini oyun listesi.
 *
 * Oyunlar tek bir kayıt tablosundan besleniyor: istatistikler `rabi-oyunlar`
 * altında oyun kimliğine göre tutuluyor, rozetler de bütün oyunların toplamına
 * bakıyor. Yeni bir oyun eklemek için buraya bir satır ve bir ekran yetiyor —
 * depo ve rozet mantığına dokunmak gerekmiyor.
 */

/**
 * Oyun kategorisi = ders.
 *
 * Oyunlar sekmesi önce dersleri gösteriyor, ders seçilince o dersin oyunları
 * geliyor. Üç oyunla bu fazladan bir dokunuş demek; ama oyun sayısı arttıkça
 * tek bir ızgaraya sığmayacak ve hangi oyunun hangi derse çalıştığı
 * kaybolacaktı. Sınıflandırma sonradan değil, şimdi kuruluyor.
 */
export type DersId = 'turkce' | 'matematik' | 'edebiyat' | 'cografya' | 'tarih' | 'biyoloji'

export type DersTanimi = {
  id: DersId
  ad: string
  aciklama: string
  ikon: string
  /**
   * Tema renk ailesi.
   *
   * Renk artık oyuna değil **derse** bağlı: aynı derse çalışan bütün oyunlar
   * aynı rengi paylaşıyor, böylece renk bir kimlik taşıyor. (Ailelerin adları
   * ilk oyunlardan geliyor: yzm=yazım, isl=işlem, edb=edebiyat, trh=tarih,
   * byl=biyoloji.)
   */
  aile: 'yzm' | 'isl' | 'edb' | 'cog' | 'trh' | 'byl'
}

export const DERSLER: DersTanimi[] = [
  {
    id: 'turkce',
    ad: 'Türkçe',
    aciklama: 'Yazım, dil bilgisi, anlam',
    ikon: '✍️',
    aile: 'yzm',
  },
  {
    id: 'matematik',
    ad: 'Matematik',
    aciklama: 'İşlem hızı, denklem',
    ikon: '🧮',
    aile: 'isl',
  },
  {
    id: 'edebiyat',
    ad: 'Edebiyat',
    aciklama: 'Eser, yazar, dönem',
    ikon: '📚',
    aile: 'edb',
  },
  {
    id: 'cografya',
    ad: 'Coğrafya',
    aciklama: 'Harita, yer şekilleri',
    ikon: '🗺️',
    aile: 'cog',
  },
  {
    id: 'tarih',
    ad: 'Tarih',
    aciklama: 'Antlaşma, madde, kavram',
    ikon: '🏛️',
    aile: 'trh',
  },
  {
    id: 'biyoloji',
    ad: 'Biyoloji',
    aciklama: 'Canlılar, sınıflandırma, hücre',
    ikon: '🧬',
    aile: 'byl',
  },
]

/**
 * Ders içindeki alt bölüm.
 *
 * Bir dersin oyunları çoğaldıkça hepsi tek ızgarada yan yana duruyordu ve
 * aralarındaki akrabalık kayboluyordu: "Açı Tamamlama" ile "Özel Üçgenler"
 * aynı konunun iki yüzü, "Zihinden İşlem" ise bambaşka bir şey. Bölüm bu
 * yakınlığı taşıyor — açılınca içindeki oyunlar geliyor.
 *
 * Bölümün kendi kaydı yok: rekor da istatistik de oyunlara ait, bölüm yalnızca
 * bir kapak.
 */
export type BolumId = 'geometri'

export type BolumTanimi = {
  id: BolumId
  ders: DersId
  ad: string
  aciklama: string
  ikon: string
}

export const BOLUMLER: BolumTanimi[] = [
  {
    id: 'geometri',
    ders: 'matematik',
    ad: 'Geometri Ustası',
    aciklama: 'Açı ve dik üçgen',
    ikon: '📐',
  },
]

export type OyunTanimi = {
  id: OyunId
  /** Hangi derse çalışıyor — Oyunlar sekmesi bu alana göre grupluyor. */
  ders: DersId
  /** Varsa dersin hangi bölümünün altında duruyor. */
  bolum?: BolumId
  ad: string
  kisaAciklama: string
  ikon: string
  /** Tanıtım penceresindeki "nasıl oynanır" maddeleri. */
  nasilOynanir: string[]
}

export const OYUNLAR: OyunTanimi[] = [
  {
    id: 'yazim',
    ders: 'turkce',
    ad: 'Yazım Ustası',
    kisaAciklama: 'Yazım ve noktalama hatalarını yakala',
    ikon: '✍️',
    nasilOynanir: [
      `Önce hangi hatalarla çalışacağını seç: yazım, noktalama ya da ikisi birden. İkisi de seçiliyse sorular sırayla karışık gelir.`,
      `Yazım hatasında kelime iki farklı yazılışıyla gelir; biri doğru, biri yaygın hatadır. Doğrusuna dokun.`,
      `Noktalama hatasında en az iki işaret taşıyan bir cümle gelir ve işaretlerden biri yanlış kullanılmıştır. Şıklardaki iki işaretten yanlış olanına dokun.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.yazim} saniye. Süre dolarsa soru yanlış sayılır.`,
      `**Tek yanlış turu bitirir.** Bilmediğin soruyu şansa bırakmak bedava değil; tur, ilk hatanda kapanır ve sonucun kaydedilir.`,
      `Tur sınırsız: ${BOSS_ARALIGI} soruda bir **boss** gelir, seçtiğin seviyenin bir üstünden. Ekran kızarır, çerçeve atmaya başlar, süren uzar — soru daha zor, hakkın yine tek.`,
      `Havuzda ${HAVUZ_BOYUTU} yazım, ${NOKTALAMA_BOYUTU} noktalama sorusu var: TDK Yazım Kılavuzu'ndan ve ÖSYM'nin sık sorduğu başlıklardan derlendi.`,
      `Tur bitince yanlış bildiklerin kuralıyla birlikte listelenir — asıl öğrenme orada.`,
    ],
  },
  {
    id: 'ses',
    ders: 'turkce',
    ad: 'Ses Olayları',
    kisaAciklama: 'Sözcükteki ses olayını bul',
    ikon: '🔤',
    nasilOynanir: [
      `Ekrana tek bir sözcük gelir (**kitabı**). Dört şıktan hangi ses olayının yaşandığını seçersin.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.ses} saniye. Süre dolarsa soru yanlış sayılır.`,
      `**Tek yanlış turu bitirir.** Bilmediğin soruyu şansa bırakmak bedava değil; tur, ilk hatanda kapanır ve sonucun kaydedilir.`,
      `Tur sınırsız: ${BOSS_ARALIGI} soruda bir **boss** gelir, seçtiğin seviyenin bir üstünden. Ekran kızarır, çerçeve atmaya başlar, süren uzar — soru daha zor, hakkın yine tek.`,
      `Şaşırınca kökü bul: *kitabı* → **kitap + ı**. Olayı gösteren şey kökle sözcük arasındaki fark — kök cevabı verdiği için soruda gösterilmiyor, cevabından sonra çıkıyor.`,
      `Havuzda ${SES_BOYUTU} sözcük var ve her biri **tek** bir ses olayı içeriyor — iki olayın birden görüldüğü sözcükler bilerek alınmadı.`,
      `Tur bitince yanlış bildiklerin kuralıyla listelenir — asıl öğrenme orada.`,
    ],
  },
  {
    id: 'oge',
    ders: 'turkce',
    ad: 'Cümlenin Ögeleri',
    kisaAciklama: 'Vurgulu bölüm hangi öge?',
    ikon: '🧩',
    nasilOynanir: [
      `Ekrana bir cümle gelir ve bir bölümü vurgulanır. Dört şıktan o bölümün hangi öge olduğunu seçersin.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.oge} saniye. Süre dolarsa soru yanlış sayılır.`,
      `**Tek yanlış turu bitirir.** Bilmediğin soruyu şansa bırakmak bedava değil; tur, ilk hatanda kapanır ve sonucun kaydedilir.`,
      `Tur sınırsız: ${BOSS_ARALIGI} soruda bir **boss** gelir, seçtiğin seviyenin bir üstünden. Ekran kızarır, çerçeve atmaya başlar, süren uzar — soru daha zor, hakkın yine tek.`,
      `Şaşırınca önce yüklemi bul, sonra ona soruyu sor: “kim” özneyi, “neyi” belirtili nesneyi, “nereye” dolaylı tümleci verir.`,
      `Havuzda ${OGE_BOYUTU} cümle var. Aynı cümle farklı ögesi sorularak tekrar çıkabilir — ögeyi cümleden bağımsız düşünmen için.`,
      `Edat tümleci şıklarda yok: güncel müfredat onu ayrı öge saymıyor, olsaydı bazı cümlelerde iki cevap birden doğru olurdu.`,
    ],
  },
  {
    id: 'soz',
    ders: 'turkce',
    ad: 'Deyim ve Atasözü',
    kisaAciklama: 'Anlamını doğru şıkta bul',
    ikon: '💬',
    nasilOynanir: [
      `Ekrana bir deyim ya da atasözü gelir; dört şıktan anlamını seçersin. Hangisi olduğu üstte yazıyor.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.soz} saniye. Süre dolarsa soru yanlış sayılır.`,
      `**Tek yanlış turu bitirir.** Bilmediğin soruyu şansa bırakmak bedava değil; tur, ilk hatanda kapanır ve sonucun kaydedilir.`,
      `Tur sınırsız: ${BOSS_ARALIGI} soruda bir **boss** gelir, seçtiğin seviyenin bir üstünden. Ekran kızarır, çerçeve atmaya başlar, süren uzar — soru daha zor, hakkın yine tek.`,
      `Şıklar başka sözlerin anlamlarından geliyor ama hepsi **farklı konudan** seçiliyor — iki eşanlamlı deyim aynı soruda karşılaşmıyor.`,
      `Havuzda ${SOZ_BOYUTU} söz var: TDK Atasözleri ve Deyimler Sözlüğü'nden, ÖSYM'nin sık sorduklarından derlendi.`,
      `Tur bitince yanlış bildiklerin, deyim ile atasözünün farkıyla birlikte listelenir.`,
    ],
  },
  {
    id: 'bolunme',
    ders: 'matematik',
    ad: 'Bölünebilme',
    kisaAciklama: 'Bölünür mü, kalan kaç?',
    ikon: '➗',
    nasilOynanir: [
      `Ekrana dört ya da beş basamaklı bir sayı gelir. Soru iki türlü olabilir: **kalan kaç** (tuş takımından yazarsın) ya da **bölünür mü** (Evet / Hayır).`,
      `Bölenler 2'den 10'a kadar, ikisi de dahil. Tanıtımda hangilerinin geleceğini seçebilirsin — sadece 7 ve 8 açıp onlara çalışabilirsin.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.bolunme} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir — bu oyunda yanlış turu bitirmiyor, tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
      `Sayılar rastgele değil, **cevaba göre** üretiliyor: her bölende Evet ile Hayır yarı yarıya. Hep "hayır" diyerek tur kazanılmıyor.`,
      `Kalan sorusu 6 ve 7'de sorulmuyor: onların kuralı sayının bölünüp bölünmediğini söylüyor ama kalanı vermiyor. Diğer yedi bölende kural kalanı da veriyor.`,
      `Tur bitince yanlışların, kuralın o sayıdaki karşılığıyla listelenir — "son üç hane 536" gibi.`,
    ],
  },
  {
    id: 'islem',
    ders: 'matematik',
    ad: 'Zihinden İşlem',
    kisaAciklama: 'İşlem hızını aç, sonucu tuşla yaz',
    ikon: '🧮',
    nasilOynanir: [
      `Önce hangi işlemlerle çalışacağını seç — hepsi ya da yalnızca zorlandıkların.`,
      `Ekranda bir işlem çıkar, sonucu alttaki tuş takımıyla yazıp onaylarsın.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.islem} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir — bu oyunda yanlış turu bitirmiyor, tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
      `Bütün sonuçlar tam sayı ve eksi değil; bölmede kalan çıkmaz, kök hep tam çıkar.`,
      `Sorular her turda yeniden üretilir — ezberlenecek bir liste yok.`,
    ],
  },
  {
    id: 'aci',
    ders: 'matematik',
    bolum: 'geometri',
    ad: 'Açı Tamamlama',
    kisaAciklama: 'Şekildeki x kaç derece?',
    ikon: '📐',
    nasilOynanir: [
      `Ekrana ya paralel iki doğruyu kesen bir doğru ya da bir üçgen gelir; aranan açı şekilde "x" ile gösterilir. Kaç derece olduğunu tuş takımıyla yazarsın.`,
      `Şekiller ölçekli: yayın açıklığı gerçekten yazan açı kadar, üçgenin köşeleri gerçekten o açılarda. Takıldığında şekle bakmak işe yarar.`,
      `Kurallar dönüşümlü gelir: Z (iç ters açılar eşit), U (aynı yandaki iç açılar 180°), M (ortadaki açı yanlardakilerin toplamı), üçgende iç açılar toplamı, dış açı ve ikizkenar üçgen.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.aci} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir — bu oyunda yanlış turu bitirmiyor, tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
      `Sorular her turda yeniden üretilir; ezberlenecek bir liste yok.`,
      `Tur bitince yanlış bildiklerin kuralıyla birlikte listelenir — asıl öğrenme orada.`,
    ],
  },
  {
    id: 'ucgen',
    ders: 'matematik',
    bolum: 'geometri',
    ad: 'Özel Üçgenler',
    kisaAciklama: 'İki kenar verili, üçüncüsü kaç?',
    ikon: '📏',
    nasilOynanir: [
      `Ekrana bir dik üçgen gelir; iki kenarı yazılıdır, üçüncüsünde “x” durur. İki şıktan doğru uzunluğa dokunursun.`,
      `Üç aile dönüşümlü gelir: Pisagor üçlüleri (3-4-5, 5-12-13, 8-15-17, 7-24-25 ve katları), 30-60-90 (a, a√3, 2a) ve ikizkenar dik üçgen 45-45-90 (a, a, a√2).`,
      `Kenarlar ölçekli çizilir, açılar da şekilde yazar — hangi ailede olduğunu şekilden tanıman yeterli, hesap yapman gerekmez.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.ucgen} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir — bu oyunda yanlış turu bitirmiyor, tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
      `Yanlış şık rastgele değil: iki dik kenarı toplamak ya da hipotenüsten çıkarmak gibi en sık yapılan hatanın sonucu.`,
      `Tur bitince yanlış bildiklerin oranıyla birlikte listelenir.`,
    ],
  },
  {
    id: 'edebiyat',
    ders: 'edebiyat',
    ad: 'Edebiyat Eşleştirme',
    kisaAciklama: 'Eseri yazarıyla eşleştir',
    ikon: '📚',
    nasilOynanir: [
      `Üstte altı eser, altta altı yazar. Bir esere, sonra yazarına dokun — sıra fark etmez.`,
      `Doğru eşleşen çift yeşile döner ve yerinde kalır. Altısı da bitince yeni altılı gelir.`,
      `Her elin kendi süresi var: ${SORU_SURESI.edebiyat} saniye. Süre dolarsa eşleştirilmemiş eserler yanlış sayılır.`,
      `**Tek yanlış eşleştirme turu bitirir.** Emin olmadığın eşi denemek bedava değil.`,
      `Her ${BOSS_ARALIGI} eşleştirmede bir **boss eli** gelir: bir üst seviyeden kurulur, ekran kızarır ve çerçeve atmaya başlar.`,
      `Eller mümkün oldukça tek dönemden kurulur — aynı dönemden altı isim, çağrışımla değil bilerek eşleştirmeyi gerektirir.`,
      `Havuzda ${EDEBIYAT_BOYUTU} eser var: ÖSYM'nin AYT Edebiyat'ta en sık sorduğu eser–yazar eşleştirmeleri.`,
    ],
  },
  {
    id: 'harita',
    ders: 'cografya',
    ad: 'Harita Avı',
    kisaAciklama: 'İli haritada bul',
    ikon: '🗺️',
    nasilOynanir: [
      `Türkiye haritası gelir. Sorular iki türlü: **“Ankara’yı bul”** dendiğinde haritada ile dokunursun, **il yanıp söndüğünde** dört şıktan adını seçersin.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.harita} saniye. Süre dolarsa soru yanlış sayılır.`,
      `**Tek yanlış turu bitirir.** Bilmediğin soruyu şansa bırakmak bedava değil; tur, ilk hatanda kapanır ve sonucun kaydedilir.`,
      `Tur sınırsız: ${BOSS_ARALIGI} soruda bir **boss** gelir, seçtiğin seviyenin bir üstünden. Ekran kızarır, çerçeve atmaya başlar, süren uzar — soru daha zor, hakkın yine tek.`,
      `Harita **yakınlaştırılabilir**: iki parmakla aç, tek parmakla kaydır, köşedeki düğmelerle de olur. Küçük illere sokulmak için gerekiyor; sürüklemek il seçmez, yalnızca dokunmak seçer.`,
      `Küçük iller (Yalova, Kilis, Bartın…) “bul” olarak sorulmaz: telefonda birkaç piksel kalıyorlar, orada dokunmak beceriden çok şans olurdu. Onlar işaretlenip adları sorulur.`,
      `Şıklar rastgele değil, **komşu illerden** gelir — Kırşehir'in şıkkı Nevşehir olur, Edirne olmaz.`,
      `Tur bitince bilemediğin iller haritadaki yerleriyle listelenir.`,
    ],
  },
  {
    id: 'antlasma',
    ders: 'tarih',
    ad: 'Antlaşma Eşleştirme',
    kisaAciklama: 'Bu madde hangi antlaşmadan?',
    ikon: '📜',
    nasilOynanir: [
      `Üstte ${ANTLASMA_EL_BOYUTU} kart, altta ${ANTLASMA_EL_BOYUTU} antlaşma. Kartta ya antlaşmanın bir maddesi ya da o antlaşmayı tanımlayan sonuç yazar; hangisine ait olduğuna dokun — sıra fark etmez.`,
      `Doğru eşleşen çift yeşile döner ve yerinde kalır. Dördü de bitince yeni dörtlü gelir.`,
      `Her elin kendi süresi var: ${SORU_SURESI.antlasma} saniye. Süre dolarsa eşleştirilmemiş maddeler yanlış sayılır.`,
      `Her ${BOSS_ARALIGI} eşleştirmede bir **boss eli** gelir: bir üst seviyeden kurulur, ekran kızarır ve tek yanlışta tur biter.`,
      `El mümkün oldukça tek dönemden kurulur: aynı dönemden dört antlaşma, tarihe bakıp tahmin etmeyi değil maddeyi okumayı gerektirir.`,
      `Havuzda ${ANTLASMA_BOYUTU} madde var. Seviyeler dönemlere göre: kolayda Millî Mücadele ve inkılap, ortada Dağılma dönemi, zorda klasik dönem Osmanlı antlaşmaları.`,
    ],
  },
  {
    id: 'kavram',
    ders: 'tarih',
    ad: 'Kavram Eşleştirme',
    kisaAciklama: 'Kavramı tanımıyla eşleştir',
    ikon: '🧭',
    nasilOynanir: [
      `Solda ${KAVRAM_SAYISI} kavram, sağda ${KAVRAM_SAYISI + CELDIRICI_SAYISI} tanım. Bir kavrama, sonra tanımına dokun.`,
      `Tanımların ${CELDIRICI_SAYISI} tanesinin karşılığı yok: üç eşleşme bitince o ikisi açıkta kalır ve yeni tahta gelir.`,
      `Her tahtanın kendi süresi var: ${SORU_SURESI.kavram} saniye. Süre dolarsa eşleştirilmemiş kavramlar yanlış sayılır.`,
      `Her ${BOSS_ARALIGI} eşleştirmede bir **boss tahtası** gelir: kavramlar bir üst seviyeden, süre kısa ve tek yanlışta tur biter.`,
      `Çeldiriciler hep aynı konudan seçilir; başka konudan gelselerdi okunmadan elenirlerdi.`,
      `Havuzda ${KAVRAM_BOYUTU} kavram var: İslamiyet öncesi Türk devletleri, ilk Türk-İslam devletleri, Osmanlı düzeni, yenileşme dönemi ve Cumhuriyet.`,
    ],
  },
  {
    id: 'anlatim',
    ders: 'turkce',
    ad: 'Anlatım Bozukluğu',
    kisaAciklama: 'Cümle bozuk — sebebi hangisi?',
    ikon: '🚧',
    nasilOynanir: [
      `Ekrana **bozuk** bir cümle gelir. Dört şıktan bozukluğun sebebini seçersin — cümleyi düzeltmen istenmiyor, hatayı adlandırman isteniyor.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.anlatim} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir.`,
      `Tur sınırsız: ${BOSS_ARALIGI} soruda bir **boss** gelir, seçtiğin seviyenin bir üstünden. Ekran kızarır, süre uzar ama hakkın tektir — orada yanılırsan tur biter.`,
      `Şaşırınca önce yüklemi bul ve ona sorularını sor: cevabı olmayan soru (“kimi?”, “neye?”) eksik ögeyi verir. Yüklem sağlamsa hata anlamdadır.`,
      `Her cümlede **tek** bozukluk var; iki sebebin birden savunulabildiği cümleler havuza alınmadı.`,
      `Havuzda ${ANLATIM_BOYUTU} cümle var. Tur bitince yanlış bildiklerin, cümlenin düzeltilmiş hâliyle birlikte listelenir — asıl öğrenme orada.`,
    ],
  },
  {
    id: 'koklu',
    ders: 'matematik',
    ad: 'Köklü Sayı Aralığı',
    kisaAciklama: 'Köklü sayı hangi iki sayı arasında?',
    ikon: '🔢',
    nasilOynanir: [
      `Üstte bir köklü sayı, altta ${KOKLU_EN_AZ}'den ${KOKLU_EN_COK}'e bir sayı çubuğu var. Çubuğun iki ucunu sürükleyerek sayının hangi aralıkta olduğunu gösterirsin.`,
      `Yalnızca **en dar** aralık doğru sayılır: √50 için "7 – 8". "1 – 25" de doğrudur ama hiçbir şey söylemez.`,
      `Doğru bilirsen hemen ardından ${KOKLU_BONUS_SURESI} saniyelik bir **bonus** gelir: sayı hangi uca daha yakın? Bilirsen bir puan daha alırsın.`,
      `Bonusu kaçırmak temel puanı götürmez — soruyu zaten bilmişsindir, bonus üstüne konandır.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.koklu} saniye. Süre dolarsa soru yanlış sayılır. Tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
      `Sorular her turda yeniden üretilir; ezberlenecek bir liste yok. Tam kareler hiç gelmez — onların cevabı aralık değil, sayının kendisi olurdu.`,
    ],
  },
  {
    id: 'ortak',
    ders: 'biyoloji',
    ad: 'Ortak Özellikler',
    kisaAciklama: 'Canlıları canlı yapan nedir?',
    ikon: '🌱',
    nasilOynanir: [
      `Ekrana bir soru gelir, dört şıktan doğrusuna dokunursun.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.ortak} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir.`,
      `Tur sınırsız: ${BOSS_ARALIGI} soruda bir **boss** gelir, seçtiğin seviyenin bir üstünden. Ekran kızarır, süre uzar ama hakkın tektir — orada yanılırsan tur biter.`,
      `Konu 9. sınıfın ilk ünitesi: hücresel yapı, beslenme, solunum, boşaltım, hareket, uyarılara tepki, üreme, büyüme-gelişme, metabolizma, homeostazi, uyum ve organizasyon.`,
      `Havuzda ${ORTAK_BOYUTU} soru var. Çeldiriciler rastgele değil, aynı konudan ve akla yatkın seçildi — okumadan elenen şık yok.`,
      `Tur bitince yanlış bildiklerin, doğrusunun neden doğru olduğuyla birlikte listelenir.`,
    ],
  },
  {
    id: 'siniflandirma',
    ders: 'biyoloji',
    ad: 'Canlıları Sınıflandır',
    kisaAciklama: 'Âlemler, birimler, ikili adlandırma',
    ikon: '🔬',
    nasilOynanir: [
      `Ekrana bir soru gelir, dört şıktan doğrusuna dokunursun.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.siniflandirma} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir.`,
      `Tur sınırsız: ${BOSS_ARALIGI} soruda bir **boss** gelir, seçtiğin seviyenin bir üstünden. Ekran kızarır, süre uzar ama hakkın tektir — orada yanılırsan tur biter.`,
      `Konu 9. sınıfın "Canlılar Dünyası" ünitesi: sınıflandırma çeşitleri, taksonomik birimler, tür kavramı, ikili adlandırma ve altı âlem.`,
      `Havuzda ${SINIFLANDIRMA_BOYUTU} soru var. Birim sırası (âlem → şube → sınıf → takım → familya → cins → tür) neredeyse her turda bir kez sorulur; ezberlemeye değer.`,
      `Tur bitince yanlış bildiklerin kısa açıklamasıyla listelenir — asıl öğrenme orada.`,
    ],
  },
  {
    id: 'hucre',
    ders: 'biyoloji',
    ad: 'Organel Kartı',
    kisaAciklama: 'İpuçlarından organeli bul',
    ikon: '🧫',
    nasilOynanir: [
      `Ekranda arkası dönük bir kart var; arkasında bir organel yazıyor. Kart sana ipucu verir, sen dört şıktan hangisi olduğunu bulursun.`,
      `İpuçları üç saniyede bir açılır, en fazla ${IPUCU_SAYISI} tane. Sırayla daralırlar: birincisi birkaç organele birden uyar, üçüncüsü tek bir cevabı gösterir.`,
      `Puan ne kadar erken bildiğine bağlı: **1. ipucuyla 3**, 2. ipucuyla 2, 3. ipucuyla 1 puan. Üçüncü ipucundan sonraki üç saniye de dolarsa puan alamazsın.`,
      `Şıkka dokununca kart çevrilir ve arkası görünür. Dokunmazsan kart kapalı kalır — cevabı görmeden geçmiş olursun.`,
      `Doğru/yanlış sayacı puandan ayrı işler: geç bilmek de doğrudur, yalnızca daha az puan getirir. Rekor yine doğru sayısına göre tutulur.`,
      `Havuzda ${HUCRE_BOYUTU} organel var: 9. sınıf hücre ünitesinin tamamı. Tur bitince bilemediklerin görevleriyle birlikte listelenir.`,
    ],
  },
  {
    id: 'sirala',
    ders: 'tarih',
    ad: 'Zaman Şeridi',
    kisaAciklama: 'Olayları eskiden yeniye diz',
    ikon: '⏳',
    nasilOynanir: [
      `Ekrana ${KART_SAYISI} olay karışık gelir. Kartları sürükleyerek **eskiden yeniye** dizer, sonra onaylarsın. Sürüklemek zorsa kartların yanındaki oklarla da taşıyabilirsin.`,
      `Şık yok: ${KART_SAYISI} kartın ${KART_SAYISI === 5 ? '120' : 'yüzlerce'} olası dizilişi var. Rastgele denemenin bir karşılığı yok, bilmek gerekiyor.`,
      `Puan kısmi: her doğru sıralanmış **komşu çift** bir puan, tamamını tutturursan ${TAM_BONUS} puan daha. Beşin dördü yerindeyse cevabın sıfır sayılmıyor.`,
      `Doğru/yanlış sayacı ise yalnızca tam sıraya bakıyor — rekor öteki oyunlarla karşılaştırılabilir kalsın diye.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.sirala} saniye. Süre dolarsa kartların o anki hâli cevabın sayılır.`,
      `**Tek yanlış turu bitirir.** Bilmediğin soruyu şansa bırakmak bedava değil; tur, ilk tam yanlışında kapanır.`,
      `Tur sınırsız: ${BOSS_ARALIGI} soruda bir **boss** gelir, seçtiğin seviyenin bir üstünden ve **${BOSS_KART_SAYISI} kartla**. Ekran kızarır, süren uzar.`,
      `Bir sorudaki olaylar hep aynı dönemden gelir: dönemler karışsaydı sıralamak tarih bilgisi değil çağrışım işi olurdu.`,
      `Havuzda ${SIRALA_BOYUTU} olay var. Yıllar soruda gizli, cevaptan sonra kartların üstünde açılıyor — asıl öğrenme orada.`,
    ],
  },
  {
    id: 'tuzak',
    ders: 'matematik',
    ad: 'Kural Tuzağı',
    kisaAciklama: 'Eşitlik doğru mu, yanlış mı?',
    ikon: '🪤',
    nasilOynanir: [
      `Ekrana tek bir eşitlik gelir. Doğruysa kartı **sağa**, yanlışsa **sola** atarsın. Kaydırmak istemezsen alttaki iki düğme de aynı işi görür.`,
      `Kartı biraz itip bırakmak cevap sayılmaz — yerine döner ve süre işlemeye devam eder. Kararsızlık cevap değil.`,
      `Her sorunun kendi süresi var: ${SORU_SURESI.tuzak} saniye. Kısa, çünkü ölçülen şey hız: kuralı bilen bir saniyede karar verir.`,
      `Süre dolarsa soru yanlış sayılır ve sıradakine geçilir — bu oyunda yanlış turu bitirmiyor, tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
      `Her kuralın doğru hâli ve öğrencilerin sık düştüğü yanlış hâli havuzda yan yana duruyor; hangisinin geleceği her soruda yazı turayla belirlenir. Cevaplar yarı yarıya — "hep yanlış de" diyerek tur kazanılmaz.`,
      `Yanlış hâller uydurma değil: (a+b)² açılımını a²+b² sanmak, kökü terim terim dağıtmak gibi sınavda gerçekten yapılan hatalar.`,
      `Havuzda ${TUZAK_BOYUTU} kural var: özdeşlikler, üslü ve köklü sayılar, mutlak değer, rasyonel ifadeler, eşitsizlikler ve fonksiyonlar.`,
      `Tur bitince yanlış bildiklerin, hatanın nerede doğru göründüğüyle birlikte listelenir.`,
    ],
  },
]

export function dersBul(id: DersId): DersTanimi {
  const ders = DERSLER.find((d) => d.id === id)
  if (!ders) throw new Error(`Bilinmeyen ders: ${id}`)
  return ders
}

/** Bir dersin bütün oyunları (bölüm içindekiler dahil), listedeki sırayla. */
export function dersinOyunlari(id: DersId): OyunTanimi[] {
  return OYUNLAR.filter((o) => o.ders === id)
}

export function bolumBul(id: BolumId): BolumTanimi {
  const bolum = BOLUMLER.find((b) => b.id === id)
  if (!bolum) throw new Error(`Bilinmeyen bölüm: ${id}`)
  return bolum
}

/** Dersin ızgarasında kart olarak duran bölümler. */
export function dersinBolumleri(id: DersId): BolumTanimi[] {
  return BOLUMLER.filter((b) => b.ders === id)
}

export function bolumunOyunlari(id: BolumId): OyunTanimi[] {
  return OYUNLAR.filter((o) => o.bolum === id)
}

/** Dersin doğrudan altındaki oyunlar — bölüme girenler burada görünmüyor. */
export function bolumsuzOyunlar(id: DersId): OyunTanimi[] {
  return OYUNLAR.filter((o) => o.ders === id && o.bolum === undefined)
}

/**
 * Ekranda gösterilecek dersler — oyunu olmayan ders listelenmiyor.
 *
 * Boş bir kategori "yakında" vaadi gibi duruyor; oyunu olmayan ders hiç
 * görünmesin, eklendiği gün kendiliğinden çıksın.
 */
export function doluDersler(): DersTanimi[] {
  return DERSLER.filter((d) => dersinOyunlari(d.id).length > 0)
}

export function oyunBul(id: OyunId): OyunTanimi {
  const oyun = OYUNLAR.find((o) => o.id === id)
  // Kimlik tipten geliyor; bulunamaması ancak liste bozulursa mümkün.
  if (!oyun) throw new Error(`Bilinmeyen oyun: ${id}`)
  return oyun
}

export type OyunToplami = {
  oynananTur: number
  toplamDogru: number
  hatasizTur: number
  /** Bütün oyunlardaki en yüksek tek tur puanı. */
  enIyiDogru: number
  /** Bütün oyunlardaki en uzun ardışık doğru dizisi. */
  enIyiSeri: number
  /** En az bir tur oynanmış oyun sayısı. */
  denenenOyun: number
}

/** Rozetlerin baktığı toplam. Oyun ayrımı yok: hepsi "mini oyun" sayılıyor. */
export function oyunToplami(kayitlar: OyunKayitlari): OyunToplami {
  // Eski kayıtlarda sonradan eklenen alanlar eksik olabiliyor; tamamlanmadan
  // toplanırsa `Math.max(0, undefined)` bütün toplamı NaN yapar.
  const hepsi = Object.values(kayitlar)
    .filter(Boolean)
    .map((i) => istatistigiTamamla(i as Partial<OyunIstatistigi>))
  return {
    oynananTur: hepsi.reduce((t, i) => t + i.oynananTur, 0),
    toplamDogru: hepsi.reduce((t, i) => t + i.toplamDogru, 0),
    hatasizTur: hepsi.reduce((t, i) => t + i.hatasizTur, 0),
    enIyiDogru: hepsi.reduce((t, i) => Math.max(t, i.enIyiDogru), 0),
    enIyiSeri: hepsi.reduce((t, i) => Math.max(t, i.enIyiSeri), 0),
    // Kayıt var ama hiç tur bitmemiş olabilir (oyun açılıp çıkılmış);
    // "denedin" demek için en az bir tamamlanmış tur şart.
    denenenOyun: hepsi.filter((i) => i.oynananTur > 0).length,
  }
}

export function istatistikAl(kayitlar: OyunKayitlari, id: OyunId): OyunIstatistigi {
  return istatistigiTamamla(kayitlar[id])
}
