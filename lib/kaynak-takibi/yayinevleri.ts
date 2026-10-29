import { sadelestir } from '../metin'
import type { Kaynak } from './kaynak'

/**
 * Kaynak eklerken hızlı seçim için yayınevleri (kullanıcı seçti, 2026-10).
 *
 * Yalnız ad, düz yazı: logo, kapak, yayınevinin rengi yok ve liste
 * **alfabetik** — hiçbiri öne çıkarılmış ya da önerilmiş gibi durmasın
 * (marka adı yalnız ürünü anmak için). Formda "adları sahiplerine aittir"
 * notu duruyor. Mağaza açıklamasına yayınevi adı yazılmaz.
 *
 * Kitap adları değil yayınevi adları: kitaplar her yıl değişiyor, liste
 * eskirdi. Öğrenci ad kutusuna yazarken yayınevi önerilir, seçince kutuya
 * kısa adı (`on`) yazılır; kitabın gerisini kendisi yazar ("Limit AYT Fizik").
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
 * Ad kutusu yazılırken açılan listedeki yayınevleri (Hedefim'deki arama
 * gibi). Kutu boşken liste yok (kullanıcı istedi, 2026-10: hazır öneri
 * yazmadan çıkmasın); yazıldıkça adı yazılanla **başlayanlar** ("o" → Orijinal,
 * "lim" → Limit; büyük/küçük harf ve Türkçe harf farkı gözetilmez). Adın başında zaten bir yayınevi varsa liste
 * yok: öğrenci kitabın adını yazıyor. Hiçbiri seçilmezse yazılan ad olduğu
 * gibi kaydedilir.
 */
export function yayineviOnerileri(ad: string): string[] {
  if (adinYayinevi(ad) !== null) return []
  const aranan = sadelestir(ad)
  if (aranan === '') return []
  return YAYINEVLERI.filter((y) => sadelestir(y.on).startsWith(aranan)).map((y) => y.on)
}

/**
 * Öğrencinin daha önce yazdığı kaynak adlarından öneriler: aynı serinin
 * başka dersini eklerken ("Limit AYT Fizik" → "Limit AYT Kimya") adı
 * baştan yazmasın. Adı yazılanla başlayanlar (yayınevleriyle aynı kural),
 * yeni eklenen önce; yazılanla birebir aynı olan önerilmez. Kutu boşken
 * öneri yok.
 */
export function gecmisOneriler(kaynaklar: Kaynak[], yazilan: string, enCok = 3): string[] {
  const aranan = sadelestir(yazilan)
  if (aranan === '') return []
  const gorulen = new Set<string>()
  const sonuc: string[] = []
  for (const k of kaynaklar) {
    const ad = sadelestir(k.ad)
    if (ad === aranan || gorulen.has(ad) || !ad.startsWith(aranan)) continue
    gorulen.add(ad)
    sonuc.push(k.ad)
    if (sonuc.length >= enCok) break
  }
  return sonuc
}
