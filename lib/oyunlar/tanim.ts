import type { OyunId, OyunIstatistigi, OyunKayitlari } from '../types'
import { BOSS_ARALIGI, MATEMATIK_TUR_SORUSU, SORU_SURESI } from './ritim'
import { istatistigiTamamla } from './tur'
import { CELDIRICI_SAYISI } from './kavram'
import { IPUCU_SAYISI } from './hucre'
import { BONUS_SURESI as KOKLU_BONUS_SURESI } from './koklu'

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
      `Önce hangi hatalarla çalışacağını seç: yazım, noktalama ya da ikisi.`,
      `Yazımda **doğru** yazılışa, noktalamada **yanlış** işarete dokun.`,
      `Soru başına ${SORU_SURESI.yazim} saniye. **Tek yanlış turu bitirir.** ${BOSS_ARALIGI} soruda bir **boss** gelir.`,
    ],
  },
  {
    id: 'ses',
    ders: 'turkce',
    ad: 'Ses Olayları',
    kisaAciklama: 'Sözcükteki ses olayını bul',
    ikon: '🔤',
    nasilOynanir: [
      `Gelen sözcükte hangi ses olayı var? Dört şıktan seç.`,
      `Şaşırınca kökü bul: *kitabı* → **kitap + ı**.`,
      `Soru başına ${SORU_SURESI.ses} saniye. **Tek yanlış turu bitirir.** ${BOSS_ARALIGI} soruda bir **boss** gelir.`,
    ],
  },
  {
    id: 'oge',
    ders: 'turkce',
    ad: 'Cümlenin Ögeleri',
    kisaAciklama: 'Vurgulu bölüm hangi öge?',
    ikon: '🧩',
    nasilOynanir: [
      `Cümlede vurgulanan bölüm hangi öge? Dört şıktan seç.`,
      `Şaşırınca yükleme sor: “kim” özneyi, “neyi” belirtili nesneyi, “nereye” dolaylı tümleci verir.`,
      `Soru başına ${SORU_SURESI.oge} saniye. **Tek yanlış turu bitirir.** ${BOSS_ARALIGI} soruda bir **boss** gelir.`,
    ],
  },
  {
    id: 'soz',
    ders: 'turkce',
    ad: 'Deyim ve Atasözü',
    kisaAciklama: 'Anlamını doğru şıkta bul',
    ikon: '💬',
    nasilOynanir: [
      `Gelen deyim ya da atasözünün anlamını dört şıktan seç.`,
      `Soru başına ${SORU_SURESI.soz} saniye. **Tek yanlış turu bitirir.** ${BOSS_ARALIGI} soruda bir **boss** gelir.`,
      `Tur bitince yanlış bildiklerin anlamlarıyla listelenir.`,
    ],
  },
  {
    id: 'bolunme',
    ders: 'matematik',
    ad: 'Bölünebilme',
    kisaAciklama: 'Bölünür mü, kalan kaç?',
    ikon: '➗',
    nasilOynanir: [
      `Gelen sayı için ya **kalanı** yaz ya da **bölünür mü** diye cevapla.`,
      `Hangi bölenlerle (2–10) çalışacağını aşağıdan seçebilirsin.`,
      `Soru başına ${SORU_SURESI.bolunme} saniye. Yanlış turu bitirmez; tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
    ],
  },
  {
    id: 'islem',
    ders: 'matematik',
    ad: 'Zihinden İşlem',
    kisaAciklama: 'İşlem hızını aç, sonucu tuşla yaz',
    ikon: '🧮',
    nasilOynanir: [
      `Önce hangi işlemlerle çalışacağını seç.`,
      `Çıkan işlemin sonucunu tuş takımıyla yazıp onayla. Sonuçlar hep tam sayı.`,
      `Soru başına ${SORU_SURESI.islem} saniye. Yanlış turu bitirmez; tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
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
      `Şekilde **x** ile gösterilen açının kaç derece olduğunu yaz.`,
      `Şekiller ölçekli — takıldığında bakmak işe yarar.`,
      `Soru başına ${SORU_SURESI.aci} saniye. Yanlış turu bitirmez; tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
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
      `Dik üçgende **x** ile gösterilen kenarı iki şıktan seç.`,
      `Pisagor üçlüleri, 30-60-90 ve 45-45-90 dönüşümlü gelir; kenarlar ölçekli çizilir.`,
      `Soru başına ${SORU_SURESI.ucgen} saniye. Yanlış turu bitirmez; tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
    ],
  },
  {
    id: 'edebiyat',
    ders: 'edebiyat',
    ad: 'Edebiyat Eşleştirme',
    kisaAciklama: 'Eseri yazarıyla eşleştir',
    ikon: '📚',
    nasilOynanir: [
      `Üstte altı eser, altta altı yazar. Esere, sonra yazarına dokun — sıra fark etmez.`,
      `Her el ${SORU_SURESI.edebiyat} saniye. **Tek yanlış eşleştirme turu bitirir.**`,
      `Her ${BOSS_ARALIGI} eşleştirmede bir **boss eli** gelir: bir üst seviyeden.`,
    ],
  },
  {
    id: 'harita',
    ders: 'cografya',
    ad: 'Harita Avı',
    kisaAciklama: 'İli haritada bul',
    ikon: '🗺️',
    nasilOynanir: [
      `İki tür soru var: **“Ankara’yı bul”**da haritada ile dokunursun, il yanıp sönünce adını seçersin.`,
      `Harita yakınlaştırılabilir: iki parmakla aç, tek parmakla kaydır.`,
      `Soru başına ${SORU_SURESI.harita} saniye. **Tek yanlış turu bitirir.** ${BOSS_ARALIGI} soruda bir **boss** gelir.`,
    ],
  },
  {
    id: 'antlasma',
    ders: 'tarih',
    ad: 'Antlaşma Eşleştirme',
    kisaAciklama: 'Bu madde hangi antlaşmadan?',
    ikon: '📜',
    nasilOynanir: [
      `Üstteki maddeyi alttaki antlaşmayla eşleştir — sıra fark etmez.`,
      `Her el ${SORU_SURESI.antlasma} saniye; süre dolarsa eşleşmeyenler yanlış sayılır.`,
      `Her ${BOSS_ARALIGI} eşleştirmede bir **boss eli** gelir: orada tek yanlış turu bitirir.`,
    ],
  },
  {
    id: 'kavram',
    ders: 'tarih',
    ad: 'Kavram Eşleştirme',
    kisaAciklama: 'Kavramı tanımıyla eşleştir',
    ikon: '🧭',
    nasilOynanir: [
      `Soldaki kavrama, sağdaki tanımına dokun. ${CELDIRICI_SAYISI} tanımın karşılığı yok.`,
      `Her tahta ${SORU_SURESI.kavram} saniye; süre dolarsa eşleşmeyenler yanlış sayılır.`,
      `Her ${BOSS_ARALIGI} eşleştirmede bir **boss tahtası** gelir: orada tek yanlış turu bitirir.`,
    ],
  },
  {
    id: 'anlatim',
    ders: 'turkce',
    ad: 'Anlatım Bozukluğu',
    kisaAciklama: 'Cümle bozuk — sebebi hangisi?',
    ikon: '🚧',
    nasilOynanir: [
      `Gelen **bozuk** cümlede bozukluğun sebebini dört şıktan seç — düzeltmen istenmiyor.`,
      `Şaşırınca yükleme sor: cevabı olmayan soru (“kimi?”, “neye?”) eksik ögeyi verir.`,
      `Soru başına ${SORU_SURESI.anlatim} saniye. ${BOSS_ARALIGI} soruda bir **boss** gelir; orada hakkın tek.`,
    ],
  },
  {
    id: 'koklu',
    ders: 'matematik',
    ad: 'Köklü Sayı Aralığı',
    kisaAciklama: 'Köklü sayı hangi iki sayı arasında?',
    ikon: '🔢',
    nasilOynanir: [
      `Çubuğun iki ucunu sürükleyip köklü sayının aralığını göster; yalnızca **en dar** aralık doğru (√50 → 7 – 8).`,
      `Doğru bilirsen ${KOKLU_BONUS_SURESI} saniyelik **bonus** gelir: sayı hangi uca daha yakın?`,
      `Soru başına ${SORU_SURESI.koklu} saniye. Yanlış turu bitirmez; tur ${MATEMATIK_TUR_SORUSU} soru sürer.`,
    ],
  },
  {
    id: 'ortak',
    ders: 'biyoloji',
    ad: 'Ortak Özellikler',
    kisaAciklama: 'Canlıları canlı yapan nedir?',
    ikon: '🌱',
    nasilOynanir: [
      `Gelen soruyu dört şıktan cevapla. Konu 9. sınıfın ilk ünitesi: canlıların ortak özellikleri.`,
      `Soru başına ${SORU_SURESI.ortak} saniye; süre dolarsa yanlış sayılır.`,
      `${BOSS_ARALIGI} soruda bir **boss** gelir; orada hakkın tek — yanılırsan tur biter.`,
    ],
  },
  {
    id: 'siniflandirma',
    ders: 'biyoloji',
    ad: 'Canlıları Sınıflandır',
    kisaAciklama: 'Âlemler, birimler, ikili adlandırma',
    ikon: '🔬',
    nasilOynanir: [
      `Gelen soruyu dört şıktan cevapla. Konu 9. sınıf “Canlılar Dünyası”: taksonomi ve altı âlem.`,
      `Soru başına ${SORU_SURESI.siniflandirma} saniye; süre dolarsa yanlış sayılır.`,
      `${BOSS_ARALIGI} soruda bir **boss** gelir; orada hakkın tek — yanılırsan tur biter.`,
    ],
  },
  {
    id: 'hucre',
    ders: 'biyoloji',
    ad: 'Organel Kartı',
    kisaAciklama: 'İpuçlarından organeli bul',
    ikon: '🧫',
    nasilOynanir: [
      `Kart sana ipucu verir, sen organeli dört şıktan bulursun.`,
      `İpuçları üç saniyede bir açılır, en fazla ${IPUCU_SAYISI} tane. Erken bilmek çok puan: **1. ipucuyla 3**, 2. ile 2, 3. ile 1.`,
      `Şıkka dokununca kart çevrilir ve cevabı görürsün.`,
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
