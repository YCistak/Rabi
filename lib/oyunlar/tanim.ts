import type { OyunId, OyunIstatistigi, OyunKayitlari } from '../types'
import { BOSS_ARALIGI, MATEMATIK_TUR_SORUSU, SORU_SURESI } from './ritim'
import { istatistigiTamamla } from './tur'
import { HAVUZ_BOYUTU } from './yazim-havuzu'
import { NOKTALAMA_BOYUTU } from './noktalama-havuzu'
import { SES_BOYUTU } from './ses-havuzu'
import { OGE_BOYUTU } from './oge-havuzu'
import { SOZ_BOYUTU } from './soz-havuzu'
import { EDEBIYAT_BOYUTU } from './edebiyat-havuzu'

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
export type DersId = 'turkce' | 'matematik' | 'edebiyat'

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
   * ilk üç oyundan geliyor: yzm=yazım, isl=işlem, edb=edebiyat.)
   */
  aile: 'yzm' | 'isl' | 'edb'
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
      `Her sorunun kendi süresi var: ${SORU_SURESI.yazim} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir.`,
      `Tur sınırsız: ${BOSS_ARALIGI} soruda bir **boss** gelir, seçtiğin seviyenin bir üstünden. Ekran kızarır, süre uzar ama hakkın tektir — orada yanılırsan tur biter.`,
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
      `Her sorunun kendi süresi var: ${SORU_SURESI.ses} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir.`,
      `Tur sınırsız: ${BOSS_ARALIGI} soruda bir **boss** gelir, seçtiğin seviyenin bir üstünden. Ekran kızarır, süre uzar ama hakkın tektir — orada yanılırsan tur biter.`,
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
      `Her sorunun kendi süresi var: ${SORU_SURESI.oge} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir.`,
      `Tur sınırsız: ${BOSS_ARALIGI} soruda bir **boss** gelir, seçtiğin seviyenin bir üstünden. Ekran kızarır, süre uzar ama hakkın tektir — orada yanılırsan tur biter.`,
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
      `Her sorunun kendi süresi var: ${SORU_SURESI.soz} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir.`,
      `Tur sınırsız: ${BOSS_ARALIGI} soruda bir **boss** gelir, seçtiğin seviyenin bir üstünden. Ekran kızarır, süre uzar ama hakkın tektir — orada yanılırsan tur biter.`,
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
      `Her sorunun kendi süresi var: ${SORU_SURESI.bolunme} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir. Tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
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
      `Her sorunun kendi süresi var: ${SORU_SURESI.islem} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir. Tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
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
      `Her sorunun kendi süresi var: ${SORU_SURESI.aci} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir. Tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
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
      `Her sorunun kendi süresi var: ${SORU_SURESI.ucgen} saniye. Süre dolarsa soru yanlış sayılır ve sıradakine geçilir. Tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
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
      `Her ${BOSS_ARALIGI} eşleştirmede bir **boss eli** gelir: bir üst seviyeden kurulur, ekran kızarır ve tek yanlışta tur biter.`,
      `Eller mümkün oldukça tek dönemden kurulur — aynı dönemden altı isim, çağrışımla değil bilerek eşleştirmeyi gerektirir.`,
      `Havuzda ${EDEBIYAT_BOYUTU} eser var: ÖSYM'nin AYT Edebiyat'ta en sık sorduğu eser–yazar eşleştirmeleri.`,
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
