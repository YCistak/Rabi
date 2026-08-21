/**
 * Havuç Mağazası'nın kataloğu.
 *
 * Eşyalar tamamen kozmetik: hiçbiri çalışmayı kolaylaştırmıyor, hiçbiri
 * puanı etkilemiyor. Tek işleri tavşanı kullanıcının tavşanı yapmak.
 *
 * Adlar ve çizimler **kasten jenerik**. Gerçek bir marka, takım, film ya da
 * karakter geçmiyor: "kolej ceketi" var ama üstünde okul arması yok, "futbol
 * forması" var ama takımı yok. Yeni eşya eklerken aynı çizgide kal — tanınan
 * bir logo ya da karakter silueti eklemek uygulamayı mağazadan indirtir.
 *
 * Fiyatlar tek yerde duruyor ki havuç kazanma mekaniği geldiğinde denge tek
 * dosyadan ayarlanabilsin.
 */

export type EsyaKategorisi = 'sapka' | 'gozluk' | 'ust' | 'alt' | 'ayakkabi' | 'kurk' | 'sirt'

export const KATEGORILER: readonly EsyaKategorisi[] = [
  'sapka',
  'gozluk',
  'ust',
  'alt',
  'ayakkabi',
  'kurk',
  'sirt',
] as const

export const KATEGORI_ADI: Record<EsyaKategorisi, string> = {
  sapka: 'Şapkalar',
  gozluk: 'Gözlükler',
  ust: 'Üst',
  alt: 'Alt',
  ayakkabi: 'Ayakkabı',
  kurk: 'Kürk',
  sirt: 'Sırt',
}

/** Kategori sekmelerindeki emoji — ikon seti yerine, tek bakışta ayrılsınlar diye. */
export const KATEGORI_SIMGESI: Record<EsyaKategorisi, string> = {
  sapka: '🎩',
  gozluk: '🕶️',
  ust: '👕',
  alt: '👖',
  ayakkabi: '👟',
  kurk: '🎨',
  sirt: '🎒',
}

export type Esya = {
  id: string
  ad: string
  kategori: EsyaKategorisi
  /** Havuç cinsinden fiyat. */
  fiyat: number
}

/**
 * Katalog.
 *
 * Sıra ekrandaki sıra: her kategorinin içinde ucuzdan pahalıya değil, konudan
 * konuya gidiyor — "önce günlük, sonra çılgın" okuması fiyat sırasından daha
 * anlaşılır çıktı.
 */
export const ESYALAR = [
  // --- Şapkalar ------------------------------------------------------------
  { id: 'sapka-bere', ad: 'Kışlık Bere', kategori: 'sapka', fiyat: 80 },
  { id: 'sapka-parti', ad: 'Parti Şapkası', kategori: 'sapka', fiyat: 60 },
  { id: 'sapka-kulaklik', ad: 'Kulaklık', kategori: 'sapka', fiyat: 140 },
  { id: 'sapka-dedektif', ad: 'Dedektif Şapkası', kategori: 'sapka', fiyat: 120 },
  { id: 'sapka-maske', ad: 'Kahraman Maskesi', kategori: 'sapka', fiyat: 180 },
  { id: 'sapka-sihirbaz', ad: 'Sihirbaz Şapkası', kategori: 'sapka', fiyat: 150 },
  { id: 'sapka-tac', ad: 'Kral Tacı', kategori: 'sapka', fiyat: 300 },

  // --- Gözlükler -----------------------------------------------------------
  { id: 'gozluk-inek', ad: 'İnek Öğrenci Gözlüğü', kategori: 'gozluk', fiyat: 60 },
  { id: 'gozluk-deney', ad: 'Deney Gözlüğü', kategori: 'gozluk', fiyat: 70 },
  { id: 'gozluk-yuzucu', ad: 'Yüzücü Gözlüğü', kategori: 'gozluk', fiyat: 70 },
  { id: 'gozluk-profesor', ad: 'Profesör Gözlüğü', kategori: 'gozluk', fiyat: 90 },
  { id: 'gozluk-saka', ad: 'Bıyıklı Şaka Gözlüğü', kategori: 'gozluk', fiyat: 100 },
  { id: 'gozluk-kalp', ad: 'Kalpli Pembe Gözlük', kategori: 'gozluk', fiyat: 110 },
  { id: 'gozluk-dj', ad: 'DJ Gözlüğü', kategori: 'gozluk', fiyat: 130 },
  /*
    "Thug life" bir mem ve kısa bir söz, ama tişörtten oyuncağa kadar tescilli
    kullanımları var. Çizim zaten jenerik piksel güneş gözlüğü; adı da öyle
    duruyor. (`AGENTS.md` — telifsiz kalma kuralı.)
  */
  { id: 'gozluk-piksel', ad: 'Piksel Güneş Gözlüğü', kategori: 'gozluk', fiyat: 160 },
  { id: 'gozluk-hipnoz', ad: 'Hipnoz Gözlüğü', kategori: 'gozluk', fiyat: 200 },

  // --- Üst kıyafetler ------------------------------------------------------
  { id: 'ust-hoodie-mavi', ad: 'Kapüşonlu — Mavi', kategori: 'ust', fiyat: 90 },
  { id: 'ust-hoodie-kirmizi', ad: 'Kapüşonlu — Kırmızı', kategori: 'ust', fiyat: 90 },
  { id: 'ust-hoodie-siyah', ad: 'Kapüşonlu — Siyah', kategori: 'ust', fiyat: 90 },
  { id: 'ust-kravat', ad: 'Kravat', kategori: 'ust', fiyat: 70 },
  { id: 'ust-pijama', ad: 'Pijama Kostümü', kategori: 'ust', fiyat: 110 },
  { id: 'ust-forma', ad: 'Futbol Forması', kategori: 'ust', fiyat: 120 },
  { id: 'ust-asci', ad: 'Aşçı Önlüğü', kategori: 'ust', fiyat: 130 },
  { id: 'ust-onluk', ad: 'Laboratuvar Önlüğü', kategori: 'ust', fiyat: 150 },
  { id: 'ust-kolej', ad: 'Kolej Ceketi', kategori: 'ust', fiyat: 180 },
  { id: 'ust-pelerin', ad: 'Kahraman Pelerini', kategori: 'ust', fiyat: 220 },
  { id: 'ust-astronot', ad: 'Astronot Elbisesi', kategori: 'ust', fiyat: 320 },
  { id: 'ust-samuray', ad: 'Samuray Zırhı', kategori: 'ust', fiyat: 350 },

  // --- Alt kıyafetler ------------------------------------------------------
  { id: 'alt-sort-mavi', ad: 'Şort — Mavi', kategori: 'alt', fiyat: 50 },
  { id: 'alt-sort-kirmizi', ad: 'Şort — Kırmızı', kategori: 'alt', fiyat: 50 },
  { id: 'alt-sort-yesil', ad: 'Şort — Yeşil', kategori: 'alt', fiyat: 50 },
  { id: 'alt-deniz-sortu', ad: 'Deniz Şortu', kategori: 'alt', fiyat: 70 },
  { id: 'alt-kot-sort', ad: 'Kot Şort', kategori: 'alt', fiyat: 80 },
  { id: 'alt-yaprak', ad: 'Yaprak Etek', kategori: 'alt', fiyat: 90 },
  { id: 'alt-yirtik-kot', ad: 'Yırtık Kot', kategori: 'alt', fiyat: 100 },
  { id: 'alt-baggy-mavi', ad: 'Baggy Kot — Mavi', kategori: 'alt', fiyat: 110 },
  { id: 'alt-baggy-siyah', ad: 'Baggy Kot — Siyah', kategori: 'alt', fiyat: 110 },
  { id: 'alt-kargo', ad: 'Kargo Pantolon', kategori: 'alt', fiyat: 120 },
  { id: 'alt-bahcivan', ad: 'Bahçıvan Tulumu', kategori: 'alt', fiyat: 130 },

  // --- Ayakkabılar ---------------------------------------------------------
  { id: 'ayak-panduf', ad: 'Panduf', kategori: 'ayakkabi', fiyat: 50 },
  { id: 'ayak-sneaker-beyaz', ad: 'Sneaker — Beyaz', kategori: 'ayakkabi', fiyat: 90 },
  { id: 'ayak-sneaker-siyah', ad: 'Sneaker — Siyah', kategori: 'ayakkabi', fiyat: 90 },
  { id: 'ayak-bahcivan', ad: 'Bahçıvan Çizmesi', kategori: 'ayakkabi', fiyat: 100 },
  { id: 'ayak-krampon', ad: 'Krampon', kategori: 'ayakkabi', fiyat: 110 },
  { id: 'ayak-palet', ad: 'Dalgıç Paleti', kategori: 'ayakkabi', fiyat: 120 },
  { id: 'ayak-cizme', ad: 'Çizme', kategori: 'ayakkabi', fiyat: 130 },
  { id: 'ayak-topuklu', ad: 'Topuklu Ayakkabı', kategori: 'ayakkabi', fiyat: 140 },
  { id: 'ayak-uzay', ad: 'Uzay Botu', kategori: 'ayakkabi', fiyat: 260 },

  // --- Kürk renkleri -------------------------------------------------------
  { id: 'kurk-kutup', ad: 'Kutup Beyazı', kategori: 'kurk', fiyat: 100 },
  { id: 'kurk-karamel', ad: 'Karamel', kategori: 'kurk', fiyat: 100 },
  { id: 'kurk-gece', ad: 'Gece Karası', kategori: 'kurk', fiyat: 150 },
  { id: 'kurk-benekli', ad: 'Benekli', kategori: 'kurk', fiyat: 180 },
  { id: 'kurk-gumus', ad: 'Gümüş', kategori: 'kurk', fiyat: 200 },
  { id: 'kurk-altin', ad: 'Altın Tavşan', kategori: 'kurk', fiyat: 400 },
  { id: 'kurk-neon', ad: 'Neon Cyberpunk', kategori: 'kurk', fiyat: 450 },
  { id: 'kurk-robot', ad: 'Robot Tavşan', kategori: 'kurk', fiyat: 500 },

  // --- Sırt aksesuarları ---------------------------------------------------
  { id: 'sirt-canta', ad: 'Sırt Çantası', kategori: 'sirt', fiyat: 90 },
  { id: 'sirt-melek', ad: 'Melek Kanatları', kategori: 'sirt', fiyat: 300 },
  { id: 'sirt-seytan', ad: 'Şeytan Kanatları', kategori: 'sirt', fiyat: 300 },
  { id: 'sirt-jetpack', ad: 'Jetpack', kategori: 'sirt', fiyat: 350 },
] as const satisfies readonly Esya[]

/**
 * Katalogdaki bütün kimlikler — çizim dosyaları bunu kullanıyor.
 *
 * `as const` sayesinde kimlikler birer sabit tip. Kazancı derleme zamanı
 * denetimi: bir eşya eklenip çizimi yazılmazsa `SAPKALAR` gibi kayıtlar eksik
 * anahtar hatası veriyor. Onsuz eksik çizim ancak mağazada boş bir kutucuk
 * olarak fark edilirdi.
 */
export type EsyaId = (typeof ESYALAR)[number]['id']

/** Tek bir kategorinin kimlikleri — çizim kayıtlarının anahtar tipi. */
export type KategoriKimlikleri<K extends EsyaKategorisi> = Extract<
  (typeof ESYALAR)[number],
  { kategori: K }
>['id']

export const ESYA_SAYISI = ESYALAR.length

export function esyaBul(id: string): Esya | undefined {
  return ESYALAR.find((e) => e.id === id)
}

export function kategorininEsyalari(kategori: EsyaKategorisi): Esya[] {
  return ESYALAR.filter((e) => e.kategori === kategori)
}
