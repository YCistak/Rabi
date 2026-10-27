import { EN_UZUN_KAYNAK_ADI, type Kaynak } from './kaynak'

/**
 * Kaynak eklerken hızlı seçim için yayınevleri (kullanıcı seçti, 2026-10).
 *
 * Yalnız ad, düz yazı: logo, kapak, yayınevinin rengi yok ve liste
 * **alfabetik** — hiçbiri öne çıkarılmış ya da önerilmiş gibi durmasın
 * (marka adı yalnız ürünü anmak için). Formda "adları sahiplerine aittir"
 * notu duruyor. Mağaza açıklamasına yayınevi adı yazılmaz.
 *
 * Kitap adları değil yayınevi adları: kitaplar her yıl değişiyor, liste
 * eskirdi. Öğrenci yayınevini seçiyor, kitabın gerisini kendisi yazıyor.
 * `on` kutuya yazılan kısa ad ("Limit AYT Fizik").
 */
export const YAYINEVLERI: readonly { on: string }[] = [
  { on: '345' },
  { on: '3D' },
  { on: 'Acil' },
  { on: 'Apotemi' },
  { on: 'Aydın' },
  { on: 'Benim Hocam' },
  { on: 'Bilgi Sarmal' },
  { on: 'Çap' },
  { on: 'Endemik' },
  { on: 'Hız ve Renk' },
  { on: 'Kafa Dengi' },
  { on: 'Karekök' },
  { on: 'Limit' },
  { on: 'Miray' },
  { on: 'Orijinal' },
  { on: 'Palme' },
  { on: 'Paraf' },
  { on: 'Yayın Denizi' },
]

const kucuk = (metin: string) => metin.toLocaleLowerCase('tr')

/** Adın başındaki yayınevi; yoksa `null`. Uzun ad önce denenir ("Hız ve Renk"). */
export function adinYayinevi(ad: string): string | null {
  const bas = kucuk(ad.trimStart())
  const aday = [...YAYINEVLERI]
    .sort((a, b) => b.on.length - a.on.length)
    .find((y) => bas === kucuk(y.on) || bas.startsWith(`${kucuk(y.on)} `))
  return aday?.on ?? null
}

/**
 * Yayınevi çipine dokununca ad: eski yayınevi önekini yenisiyle değiştirir,
 * gerisini korur ("Limit AYT Fizik" → "Paraf AYT Fizik"). Seçili yayınevine
 * yeniden dokunmak öneki kaldırır. Sondaki boşluk, öğrenci yazmaya devam
 * etsin diye.
 */
export function yayineviniUygula(ad: string, on: string): string {
  const mevcut = adinYayinevi(ad)
  const geri = (mevcut ? ad.trimStart().slice(mevcut.length) : ad).trimStart()
  if (mevcut === on) return geri
  return `${on} ${geri}`.slice(0, EN_UZUN_KAYNAK_ADI)
}

/**
 * Öğrencinin daha önce yazdığı kaynak adlarından öneriler: aynı serinin
 * başka dersini eklerken ("Limit AYT Fizik" → "Limit AYT Kimya") adı
 * baştan yazmasın. Yazılan metni içerenler, yeni eklenen önce; yazılanla
 * birebir aynı olan önerilmez. Kutu boşken öneri yok (yer yayınevlerinin).
 */
export function gecmisOneriler(kaynaklar: Kaynak[], yazilan: string, enCok = 3): string[] {
  const aranan = kucuk(yazilan.trim())
  if (aranan === '') return []
  const gorulen = new Set<string>()
  const sonuc: string[] = []
  for (const k of kaynaklar) {
    const ad = kucuk(k.ad)
    if (ad === aranan || gorulen.has(ad) || !ad.includes(aranan)) continue
    gorulen.add(ad)
    sonuc.push(k.ad)
    if (sonuc.length >= enCok) break
  }
  return sonuc
}
