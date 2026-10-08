import { mezunMu } from './hesap'
import { ALAN_KISA_ADI } from './sablonlar'
import { geriSayim } from './sinav-tarihi'
import type { Hedef, PuanTuru } from './types'

/**
 * Kurulum sonrası "uygulaman hazır" ekranının kutucukları.
 *
 * Ekranın işi kullanıcının kurulumda verdiği cevapların yerine oturduğunu
 * göstermek; bu yüzden her kutucuğun alt satırı bir cevaptan türüyor. Oyunlar
 * ve Pomodoro kutucuğu yok (kullanıcı kaldırttı): ikisi de kurulumdaki hiçbir
 * cevaba bağlı değil.
 */
export type HazirKutuKimligi = 'konu' | 'denemeler' | 'hedef' | 'hatirlatma' | 'geri-sayim' | 'gunluk'

export type HazirKutu = {
  kimlik: HazirKutuKimligi
  ad: string
  satir: string
}

export type HazirGirdisi = {
  sinif: number
  puanTuru: PuanTuru | null
  hedef: Hedef | null
  gunlukHedef: number
  hatirlatmaSaati: number
  hatirlatmaDakikasi: number
  bildirimAcik: boolean
}

/**
 * Konu anlatımı yalnızca 9, 10 ve (kısmen) 11. sınıfta var. 12'ye ve mezuna
 * "12. sınıf konuların hazır" demek olmayan bir şeyi vaat ederdi.
 */
function konuSatiri(sinif: number): string {
  if (!mezunMu(sinif) && sinif <= 11) return `${sinif}. sınıf konuların hazır`
  return 'Konu kartları seni bekliyor'
}

/** "Boğaziçi Üniversitesi" → "Boğaziçi": kutucuk iki satırlık, ek yer yiyor. */
function kisaUniversite(ad: string): string {
  return ad.replace(/\s+Üniversitesi$/u, '')
}

const iki = (n: number) => String(n).padStart(2, '0')

export function hazirKutulari(girdi: HazirGirdisi, bugunIso: string): HazirKutu[] {
  const sayim = geriSayim(bugunIso, girdi.sinif)
  return [
    { kimlik: 'konu', ad: 'Konu Anlatımı', satir: konuSatiri(girdi.sinif) },
    {
      kimlik: 'denemeler',
      ad: 'Denemeler',
      satir: girdi.puanTuru ? `${ALAN_KISA_ADI[girdi.puanTuru]} netlerini izle` : 'Netlerini izle',
    },
    {
      kimlik: 'hedef',
      ad: 'Hedefim',
      // Bölüm adımı atlanabiliyor; hedefsiz kullanıcıya boş kutu gösterilmiyor.
      satir: girdi.hedef
        ? `${kisaUniversite(girdi.hedef.universite)} · ${girdi.hedef.bolum}`
        : 'Sonra seçebilirsin',
    },
    {
      kimlik: 'hatirlatma',
      ad: 'Hatırlatma',
      // Bildirim izni reddedildiyse hatırlatma kapalı kaydediliyor; saati
      // yazmak kurulmamış bir hatırlatmayı kurulmuş gibi gösterirdi.
      satir: girdi.bildirimAcik
        ? `Her gün ${iki(girdi.hatirlatmaSaati)}:${iki(girdi.hatirlatmaDakikasi)}`
        : "Ayarlar'dan açabilirsin",
    },
    {
      kimlik: 'geri-sayim',
      ad: sayim.kalanGun === 0 ? 'YKS bugün' : `YKS'ye ${sayim.kalanGun} gün`,
      // ÖSYM tarihi açıklamadıysa tarih tahmin; ana sayfadaki geri sayım gibi
      // burada da söyleniyor.
      satir: sayim.tahmini ? 'Tahmini tarihe göre' : 'Geri sayım başladı',
    },
    { kimlik: 'gunluk', ad: `Günde ${girdi.gunlukHedef} soru`, satir: 'Günlük hedefin' },
  ]
}
