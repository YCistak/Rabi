import type { OyunId, OyunIstatistigi, OyunKayitlari } from '../types'
import { istatistigiTamamla } from './tur'

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
export type DersId = 'turkce' | 'matematik' | 'cografya' | 'tarih' | 'biyoloji' | 'kimya'

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
   * byl=biyoloji.) `edb` adını ilk sahibinden alıyor ama artık **Kimya'nın**:
   * Türkçe ile Edebiyat tek derse inince lavanta boşta kaldı ve yeni bir aile
   * uydurmak yerine o kullanıldı. Kimlik değişmedi çünkü renk değişkenleri
   * (`--edb-*`) ve rozet renkleri aynı ada bağlı.
   */
  aile: 'yzm' | 'isl' | 'edb' | 'cog' | 'trh' | 'byl'
}

export const DERSLER: DersTanimi[] = [
  /*
    Türkçe ile Edebiyat tek ders: ÖSYM'de de tek test var (AYT Türk Dili ve
    Edebiyatı) ve ayrıyken kullanıcı "Edebiyat Eşleştirme"yi ararken iki
    kategoriyi birden açıyordu. Birinde beş, ötekinde tek oyun duran iki
    kategori, ayrı durmayı hak edecek kadar da dolu değildi.
  */
  {
    id: 'turkce',
    ad: 'Türk Dili ve Edebiyatı',
    aciklama: 'Yazım, dil bilgisi, edebiyat',
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
  {
    id: 'kimya',
    ad: 'Kimya',
    aciklama: 'Periyodik tablo, formüller',
    ikon: '🧪',
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
  /**
   * Tanıtım penceresindeki özet — bir ya da iki cümle.
   *
   * Önce sekiz maddelik bir "nasıl oynanır" listesiydi ve kimse okumuyordu:
   * pencere turu başlatan yer, ders kitabı değil. Maddelerin çoğu zaten
   * pencerenin kendisinde yazıyor — turun kuralı mod seçiminde
   * (`components/mod-secimi.tsx`), boss'un nereden geldiği zorluk seçiminde
   * (`components/zorluk-secimi.tsx`), oyuna özgü seçimler de tanıtımın
   * `ekstra` bölümünde. Geriye kalan tek soru "ben ne yapacağım"; cevabı
   * burada duruyor.
   *
   * Havuz boyu, çeldirici mantığı, kural listesi gibi ayrıntılar bilerek
   * yok: hiçbiri ilk turu oynamak için gerekmiyor.
   */
  ozet: string
}

export const OYUNLAR: OyunTanimi[] = [
  {
    id: 'yazim',
    ders: 'turkce',
    ad: 'Yazım Ustası',
    kisaAciklama: 'Yazım ve noktalama hatalarını yakala',
    ikon: '✍️',
    ozet: `Yazımda **doğru** yazılışa dokunursun, noktalamada cümledeki **yanlış** işarete. Hangi hatalarla çalışacağını aşağıdan seçebilirsin.`,
  },
  {
    id: 'ses',
    ders: 'turkce',
    ad: 'Ses Olayları',
    kisaAciklama: 'Sözcükteki ses olayını bul',
    ikon: '🔤',
    ozet: `Gelen sözcükte hangi ses olayının yaşandığını dört şıktan seçersin. Şaşırınca kökü bul: *kitabı* → **kitap + ı**.`,
  },
  {
    id: 'oge',
    ders: 'turkce',
    ad: 'Cümlenin Ögeleri',
    kisaAciklama: 'Vurgulu bölüm hangi öge?',
    ikon: '🧩',
    ozet: `Cümlede vurgulanan bölümün hangi öge olduğunu dört şıktan seçersin. Şaşırınca yükleme sor: “kim” özneyi, “neyi” nesneyi verir.`,
  },
  {
    id: 'soz',
    ders: 'turkce',
    ad: 'Deyim ve Atasözü',
    kisaAciklama: 'Anlamını doğru şıkta bul',
    ikon: '💬',
    ozet: `Gelen deyim ya da atasözünün anlamını dört şıktan seçersin. Tur bitince yanlış bildiklerin anlamlarıyla listelenir.`,
  },
  {
    id: 'bolunme',
    ders: 'matematik',
    ad: 'Bölünebilme',
    kisaAciklama: 'Bölünür mü, kalan kaç?',
    ikon: '➗',
    ozet: `Gelen sayı için ya **kalanı** tuş takımıyla yazarsın ya da **bölünür mü** diye cevaplarsın. Hangi bölenlerin (2–10) geleceğini aşağıdan seçebilirsin.`,
  },
  {
    id: 'islem',
    ders: 'matematik',
    ad: 'Zihinden İşlem',
    kisaAciklama: 'İşlem hızını aç, sonucu tuşla yaz',
    ikon: '🧮',
    ozet: `Ekrana gelen işlemin sonucunu tuş takımıyla yazıp onaylarsın; sonuçlar hep tam sayı. Hangi işlemlerle çalışacağını aşağıdan seçersin.`,
  },
  {
    id: 'aci',
    ders: 'matematik',
    bolum: 'geometri',
    ad: 'Açı Tamamlama',
    kisaAciklama: 'Şekildeki x kaç derece?',
    ikon: '📐',
    ozet: `Şekilde **x** ile gösterilen açının kaç derece olduğunu tuş takımıyla yazarsın. Şekiller ölçekli — takıldığında bakmak işe yarar.`,
  },
  {
    id: 'ucgen',
    ders: 'matematik',
    bolum: 'geometri',
    ad: 'Özel Üçgenler',
    kisaAciklama: 'İki kenar verili, üçüncüsü kaç?',
    ikon: '📏',
    ozet: `Dik üçgende **x** ile gösterilen kenarı iki şıktan seçersin. Pisagor üçlüleri, 30-60-90 ve 45-45-90 dönüşümlü gelir; kenarlar ölçekli çizilir.`,
  },
  {
    id: 'edebiyat',
    ders: 'turkce',
    ad: 'Edebiyat Eşleştirme',
    kisaAciklama: 'Eseri yazarıyla eşleştir',
    ikon: '📚',
    ozet: `Üstteki esere, sonra alttaki yazarına dokunursun — sıra fark etmez. Altı çift bitince yeni altılı gelir.`,
  },
  {
    id: 'harita',
    ders: 'cografya',
    ad: 'Harita Avı',
    kisaAciklama: 'İli haritada bul',
    ikon: '🗺️',
    ozet: `**“Ankara’yı bul”** dendiğinde ili haritada gösterirsin; il yanıp söndüğünde adını dört şıktan seçersin. Harita iki parmakla yakınlaştırılabilir.`,
  },
  {
    id: 'iklim',
    ders: 'cografya',
    ad: 'İklim Kuşakları',
    kisaAciklama: 'Bu bölgede hangi iklim görülür?',
    ikon: '🌍',
    ozet: `Dünya haritasında bir bölge işaretlenir, sen orada görülen iklim tipini dört şıktan seçersin. Haritadaki kesikli çizgiler dönenceler ve kutup dairesi — iklimin çoğu **enlemden** okunur.`,
  },
  {
    id: 'izohips',
    ders: 'cografya',
    ad: 'İzohips Okuma',
    kisaAciklama: 'Daire içindeki yer şekli hangisi?',
    ikon: '⛰️',
    ozet: `Eş yükselti eğrileriyle çizilmiş haritada daire içine alınan yerdeki şekli dört şıktan seçersin. Eğrilerin üstündeki **sayılara** bak: tepe ile kapalı çukurun çizimi aynı, sayıları ters.`,
  },
  {
    id: 'antlasma',
    ders: 'tarih',
    ad: 'Antlaşma Eşleştirme',
    kisaAciklama: 'Bu madde hangi antlaşmadan?',
    ikon: '📜',
    ozet: `Üstteki maddeyi ait olduğu antlaşmayla eşleştirirsin — sıra fark etmez. El bitince yenisi gelir.`,
  },
  {
    id: 'kavram',
    ders: 'tarih',
    ad: 'Kavram Eşleştirme',
    kisaAciklama: 'Kavramı tanımıyla eşleştir',
    ikon: '🧭',
    ozet: `Soldaki kavrama, sonra sağdaki tanımına dokunursun. Tanımların birkaçının karşılığı yok; tahta bitince açıkta kalırlar.`,
  },
  {
    id: 'anlatim',
    ders: 'turkce',
    ad: 'Anlatım Bozukluğu',
    kisaAciklama: 'Cümle bozuk — sebebi hangisi?',
    ikon: '🚧',
    ozet: `Gelen **bozuk** cümlede bozukluğun sebebini dört şıktan seçersin — cümleyi düzeltmen değil, hatayı adlandırman isteniyor.`,
  },
  {
    id: 'koklu',
    ders: 'matematik',
    ad: 'Köklü Sayı Aralığı',
    kisaAciklama: 'Köklü sayı hangi iki sayı arasında?',
    ikon: '🔢',
    ozet: `Çubuğun iki ucunu sürükleyip köklü sayının hangi iki sayı arasında olduğunu gösterirsin; yalnızca **en dar** aralık doğru (√50 → 7 – 8). Doğru bilirsen kısa bir bonus soru gelir.`,
  },
  {
    id: 'ortak',
    ders: 'biyoloji',
    ad: 'Ortak Özellikler',
    kisaAciklama: 'Canlıları canlı yapan nedir?',
    ikon: '🌱',
    ozet: `Canlıların ortak özellikleri üzerine gelen soruyu dört şıktan cevaplarsın. Konu 9. sınıfın ilk ünitesi.`,
  },
  {
    id: 'siniflandirma',
    ders: 'biyoloji',
    ad: 'Canlıları Sınıflandır',
    kisaAciklama: 'Âlemler, birimler, ikili adlandırma',
    ikon: '🔬',
    ozet: `Gelen soruyu dört şıktan cevaplarsın. Konu 9. sınıf “Canlılar Dünyası”: taksonomi, ikili adlandırma ve altı âlem.`,
  },
  {
    id: 'hucre',
    ders: 'biyoloji',
    ad: 'Organel Kartı',
    kisaAciklama: 'İpuçlarından organeli bul',
    ikon: '🧫',
    ozet: `Kart üç saniyede bir yeni ipucu açar, sen organeli dört şıktan bulursun. Erken bilmek çok puan: **1. ipucuyla 3**, 2. ile 2, 3. ile 1.`,
  },
  {
    id: 'sirala',
    ders: 'tarih',
    ad: 'Zaman Şeridi',
    kisaAciklama: 'Olayları eskiden yeniye diz',
    ikon: '⏳',
    ozet: `Karışık gelen olay kartlarını sürükleyerek **eskiden yeniye** dizip onaylarsın. Puan kısmi: doğru sıralanan her komşu çift bir puan.`,
  },
  {
    id: 'tuzak',
    ders: 'matematik',
    ad: 'Kural Tuzağı',
    kisaAciklama: 'Eşitlik doğru mu, yanlış mı?',
    ikon: '🪤',
    ozet: `Gelen eşitlik doğruysa kartı **sağa**, yanlışsa **sola** atarsın; alttaki iki düğme de aynı işi görür.`,
  },
  {
    id: 'periyodik',
    ders: 'kimya',
    ad: 'Periyodik Tablo Avı',
    kisaAciklama: 'Elementi tabloda bul',
    ikon: '⚛️',
    ozet: `**“Kalsiyum’u bul”** dendiğinde elementi tabloda gösterirsin; hücre yanıp söndüğünde adını ya da ailesini dört şıktan seçersin. Tabloda yalnızca sınavda karşılığı olan elementler yazılı.`,
  },
  {
    id: 'formul',
    ders: 'kimya',
    ad: 'Formül Eşleştirme',
    kisaAciklama: 'Formülü adıyla eşleştir',
    ikon: '⚗️',
    ozet: `Üstteki formüle, sonra alttaki adına dokunursun — sıra fark etmez. El mümkün oldukça tek türden kuruluyor: altı asit, altı tuz.`,
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

/**
 * Oyun kimliklerinden ders kimlikleri — sıra korunuyor, tekrar eleniyor.
 *
 * Ana sayfadaki oyun kutucukları ders gösteriyor ve sıraları "en son
 * oynanan"dan geliyor. Ayrı bir "son açılan ders" listesi tutulmadı: aynı
 * bilgiyi ikinci kez saklamak olurdu ve iki liste zamanla birbirinden
 * ayrılırdı — oyunu açmakla dersi açmak zaten aynı hareket.
 */
export function oyunlarinDersleri(oyunlar: readonly string[]): DersId[] {
  const dersler: DersId[] = []
  for (const id of oyunlar) {
    const oyun = OYUNLAR.find((o) => o.id === id)
    // Kaldırılmış oyunun kaydı sessizce eleniyor.
    if (oyun && !dersler.includes(oyun.ders)) dersler.push(oyun.ders)
  }
  return dersler
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
