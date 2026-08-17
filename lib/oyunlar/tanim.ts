import type { OyunId, OyunIstatistigi, OyunKayitlari } from '../types'
import { TUR_SURESI, YANLIS_CEZASI, istatistigiTamamla } from './tur'
import { HAVUZ_BOYUTU } from './yazim-havuzu'
import { EDEBIYAT_BOYUTU } from './edebiyat-havuzu'

/**
 * Mini oyun listesi.
 *
 * Oyunlar tek bir kayıt tablosundan besleniyor: istatistikler `rabi-oyunlar`
 * altında oyun kimliğine göre tutuluyor, rozetler de bütün oyunların toplamına
 * bakıyor. Yeni bir oyun eklemek için buraya bir satır ve bir ekran yetiyor —
 * depo ve rozet mantığına dokunmak gerekmiyor.
 */

export type OyunTanimi = {
  id: OyunId
  ad: string
  kisaAciklama: string
  ikon: string
  /** Tanıtım penceresindeki "nasıl oynanır" maddeleri. */
  nasilOynanir: string[]
}

export const OYUNLAR: OyunTanimi[] = [
  {
    id: 'yazim',
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
    id: 'islem',
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
