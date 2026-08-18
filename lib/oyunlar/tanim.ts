import type { OyunId, OyunIstatistigi, OyunKayitlari } from '../types'
import { TUR_SURESI, YANLIS_CEZASI, istatistigiTamamla } from './tur'
import { HAVUZ_BOYUTU } from './yazim-havuzu'
import { SES_BOYUTU } from './ses-havuzu'
import { OGE_BOYUTU } from './oge-havuzu'
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

export type OyunTanimi = {
  id: OyunId
  /** Hangi derse çalışıyor — Oyunlar sekmesi bu alana göre grupluyor. */
  ders: DersId
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
    kisaAciklama: 'Doğru yazılışı seç, süreye karşı yarış',
    ikon: '✍️',
    nasilOynanir: [
      `Ekrana bir kelime iki farklı yazılışıyla gelir; biri doğru, biri yaygın hatadır. Doğrusuna dokun.`,
      `Turun süresi ${TUR_SURESI} saniye. Doğru cevap süreyi uzatmaz, ${YANLIS_CEZASI} saniyeyi yanlış cevap götürür — emin değilsen okumadan dokunma.`,
      `Puanın tek turda bildiğin doğru sayısı. En yüksek puanın rekor olarak saklanır.`,
      `Havuzda ${HAVUZ_BOYUTU} soru var: TDK Yazım Kılavuzu'ndan ve ÖSYM'nin sık sorduğu başlıklardan derlendi.`,
      `Tur bitince yanlış bildiğin kelimeler kuralıyla birlikte listelenir — asıl öğrenme orada.`,
    ],
  },
  {
    id: 'ses',
    ders: 'turkce',
    ad: 'Ses Olayları',
    kisaAciklama: 'Sözcükteki ses olayını bul',
    ikon: '🔤',
    nasilOynanir: [
      `Ekrana bir sözcük ve nasıl oluştuğu gelir (**kitabı** · kitap + ı). Dört şıktan hangi ses olayının yaşandığını seçersin.`,
      `Turun süresi ${TUR_SURESI} saniye. Doğru cevap süreyi uzatmaz, ${YANLIS_CEZASI} saniyeyi yanlış cevap götürür.`,
      `Oluşum satırı ipucu değil, sorunun parçası: kökünü bilmeden *hakkı* sözcüğünde ünsüz türemesiyle yumuşamayı ayıramazsın.`,
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
      `Turun süresi ${TUR_SURESI} saniye. Doğru cevap süreyi uzatmaz, ${YANLIS_CEZASI} saniyeyi yanlış cevap götürür.`,
      `Şaşırınca önce yüklemi bul, sonra ona soruyu sor: “kim” özneyi, “neyi” belirtili nesneyi, “nereye” dolaylı tümleci verir.`,
      `Havuzda ${OGE_BOYUTU} cümle var. Aynı cümle farklı ögesi sorularak tekrar çıkabilir — ögeyi cümleden bağımsız düşünmen için.`,
      `Edat tümleci şıklarda yok: güncel müfredat onu ayrı öge saymıyor, olsaydı bazı cümlelerde iki cevap birden doğru olurdu.`,
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
      `Turun süresi ${TUR_SURESI} saniye. Doğru cevap süreyi uzatmaz, ${YANLIS_CEZASI} saniyeyi yanlış cevap götürür. Takıldığında “pas geç” de aynı cezayı verir.`,
      `Bütün sonuçlar tam sayı ve eksi değil; bölmede kalan çıkmaz, kök hep tam çıkar.`,
      `Sorular her turda yeniden üretilir — ezberlenecek bir liste yok.`,
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
      `Turun süresi ${TUR_SURESI} saniye. Yanlış eşleştirme ${YANLIS_CEZASI} saniye götürür.`,
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

/** Bir dersin oyunları, listedeki sırayla. */
export function dersinOyunlari(id: DersId): OyunTanimi[] {
  return OYUNLAR.filter((o) => o.ders === id)
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
