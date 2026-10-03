/*
  Başlangıç turunun Araçlar bölümünde kullanılan geçici veriler.

  Tur sürerken Soru Takibi, Yapılacaklar, Denemeler ve İstatistik gerçek
  kayıtları değil turun kendi listelerini gösteriyor (`DemoVeri`,
  `lib/tanitim.ts`). Kullanıcının turda eklediği soru, görev ve deneme o
  listelere yazılıyor, cihaz deposuna hiç inmiyor; tur bitince liste
  boşaltılıyor. Denemeler ve görevler ayrıca `tanitim-` önekli kimlik
  taşıyor: bir hata yüzünden gerçek listeye karışsalar bile
  `tanitimKayitlariniAyikla` onları ayırt edip yalnızca onları siliyor.
*/
import { gunKaydir } from './utils'
import type { Deneme, DersSonuc, PuanTuru, Sablon } from './types'

export const TANITIM_ONEKI = 'tanitim-'

export const tanitimKimligi = (id: string) => (id.startsWith(TANITIM_ONEKI) ? id : `${TANITIM_ONEKI}${id}`)
export const tanitimKaydiMi = (kayit: { id: string }) => kayit.id.startsWith(TANITIM_ONEKI)

/** Listeden yalnızca tanıtım kayıtlarını çıkarır; gerçek kayıtlar aynı sırada kalır. */
export function tanitimKayitlariniAyikla<T extends { id: string }>(liste: readonly T[]): T[] {
  return liste.filter((kayit) => !tanitimKaydiMi(kayit))
}

/** Alanın ikinci oturumu: 11. sınıftan itibaren ve alan seçilmişse (`secilebilirSablonlar` ile aynı kural). */
function alanSinavi(sinif: number, puanTuru: PuanTuru | null): string | null {
  if (puanTuru === null || sinif < 11) return null
  return { say: 'ayt-say', ea: 'ayt-ea', soz: 'ayt-soz', dil: 'ydt' }[puanTuru]
}

/**
 * Örnek denemelerin şablonları: alanı belli öğrenciye TYT ve kendi alan
 * sınavı (Dil → YDT, Sayısal → AYT Sayısal…); kararsız ya da henüz 11.
 * sınıfa gelmemiş öğrenciye herkesin girdiği TYT, iki kez.
 */
export function demoSablonIdleri(sinif: number, puanTuru: PuanTuru | null): [string, string] {
  return ['tyt', alanSinavi(sinif, puanTuru) ?? 'tyt']
}

type Satir = [dersId: string, dogru: number, yanlis: number]
const sonuclar = (satirlar: Satir[]): DersSonuc[] => satirlar.map(([dersId, dogru, yanlis]) => ({ dersId, dogru, yanlis }))

/*
  Netler ortalama bir adayın aralığında ve soru sayılarını aşmıyor
  (`lib/sablonlar.ts`). İki TYT varsa ikincisi birkaç net yukarıda:
  İstatistik'te "en çok ilerleyen dersler" boş kalmasın.
*/
const ORNEK_SONUCLAR: Record<string, Satir[][]> = {
  tyt: [
    [['turkce', 27, 8], ['tarih', 3, 1], ['cografya', 3, 1], ['felsefe', 3, 2], ['din', 4, 1], ['matematik', 17, 8], ['fizik', 3, 2], ['kimya', 3, 2], ['biyoloji', 3, 1]],
    [['turkce', 30, 6], ['tarih', 3, 1], ['cografya', 4, 1], ['felsefe', 3, 1], ['din', 4, 1], ['matematik', 20, 7], ['fizik', 3, 2], ['kimya', 4, 2], ['biyoloji', 3, 1]],
  ],
  'ayt-say': [[['matematik', 16, 8], ['fizik', 5, 4], ['kimya', 5, 3], ['biyoloji', 6, 3]]],
  'ayt-ea': [[['matematik', 15, 8], ['edebiyat', 13, 5], ['tarih1', 5, 2], ['cografya1', 3, 1]]],
  'ayt-soz': [[['edebiyat', 14, 5], ['tarih1', 5, 2], ['cografya1', 3, 1], ['tarih2', 5, 3], ['cografya2', 5, 2], ['felsefe', 6, 3], ['din', 4, 1]]],
  ydt: [[['ydt', 48, 14]]],
}

const AD: Record<string, string> = { tyt: 'TYT', 'ayt-say': 'AYT Sayısal', 'ayt-ea': 'AYT Eşit Ağırlık', 'ayt-soz': 'AYT Sözel', ydt: 'YDT' }

/** Turda gösterilen iki hazır deneme; tarihleri bugünden geriye (14 ve 7 gün önce). */
export function demoDenemeleri(sinif: number, puanTuru: PuanTuru | null, bugunIso: string): Deneme[] {
  const [ilk, ikinci] = demoSablonIdleri(sinif, puanTuru)
  return [ilk, ikinci].map((sablonId, sira) => ({
    id: `${TANITIM_ONEKI}deneme-${sira + 1}`,
    sablonId,
    ad: `${AD[sablonId]} örnek ${sira + 1}`,
    tarih: gunKaydir(bugunIso, sira === 0 ? -14 : -7),
    sonuclar: sonuclar(ORNEK_SONUCLAR[sablonId][ilk === ikinci ? sira : 0]),
  }))
}

/*
  Turun "Deneme ekle" formuna kendiliğinden yazılan sonuçlar. Kullanıcıya
  deneme elle girdirilmiyor: tabloyu doldurmak için açılan klavye ve balon
  dersleri kapatıyordu. Bilinen şablonlarda ikinci örnekten birkaç net
  yukarıda (İstatistik'te "en çok ilerleyen dersler" dolsun); öğrencinin
  kendi şablonunda soru sayısına oranla ortalama bir aday. Hiçbir satır
  soru sayısını aşmıyor.
*/
const TUR_FORMU_SONUCLARI: Record<string, Satir[]> = {
  tyt: [['turkce', 31, 6], ['tarih', 3, 1], ['cografya', 4, 1], ['felsefe', 3, 1], ['din', 4, 1], ['matematik', 21, 8], ['fizik', 4, 2], ['kimya', 4, 2], ['biyoloji', 3, 1]],
  'ayt-say': [['matematik', 18, 7], ['fizik', 6, 4], ['kimya', 6, 3], ['biyoloji', 6, 3]],
  'ayt-ea': [['matematik', 17, 8], ['edebiyat', 14, 5], ['tarih1', 6, 2], ['cografya1', 4, 1]],
  'ayt-soz': [['edebiyat', 15, 5], ['tarih1', 6, 2], ['cografya1', 4, 1], ['tarih2', 6, 3], ['cografya2', 6, 2], ['felsefe', 7, 3], ['din', 4, 1]],
  ydt: [['ydt', 50, 13]],
  okul: [['edebiyat', 18, 5], ['matematik', 15, 7], ['tarih', 7, 2], ['cografya', 7, 2], ['fizik', 5, 2], ['kimya', 5, 2], ['biyoloji', 5, 2], ['din', 4, 1]],
}

export function ornekDenemeSonucu(sablon: Sablon): DersSonuc[] {
  const hazir = new Map((TUR_FORMU_SONUCLARI[sablon.id] ?? []).map(([dersId, dogru, yanlis]) => [dersId, [dogru, yanlis] as const]))
  return sablon.dersler.map((ders) => {
    const [dogru, yanlis] = hazir.get(ders.id) ?? [Math.round(ders.soruSayisi * 0.55), Math.round(ders.soruSayisi * 0.15)]
    const d = Math.min(dogru, ders.soruSayisi)
    return { dersId: ders.id, dogru: d, yanlis: Math.min(yanlis, ders.soruSayisi - d) }
  })
}
