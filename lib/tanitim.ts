import type { Ekran, Sekme } from './gezinme'
import type { BankaKaydi } from './oyunlar/banka'

export type TanitimTuru = 'ana_tur' | 'denemeler' | 'konu_haritasi'
export const TUR_ANAHTARLARI: Record<TanitimTuru, string> = {
  ana_tur: 'rabi_ana_tur_tamamlandi', denemeler: 'rabi_deneme_turu_tamamlandi', konu_haritasi: 'rabi_harita_turu_tamamlandi',
}
export const TANITIM_ANAHTARI = TUR_ANAHTARLARI.ana_tur

export const TANITIM_ADIMLARI = [
  { kimlik: 'sinav-hedefi', hedef: 'sinav-hedefi', baslik: 'Hedefin hep gözünün önünde', aciklama: 'Sınava kalan süreyi, hedeflediğin bölüm ve üniversiteyi bu karttan izlersin. Hedef sıralaman ile güncel tahminin arasındaki fark, ne kadar yaklaştığını gösterir.', tiklamali: false },
  { kimlik: 'hedef', hedef: 'gunluk-hedef', baslik: 'Her gün küçük bir adım', aciklama: 'Halka, bugün çözdüğün soruların günlük hedefine ne kadar yaklaştığını gösterir. Altındaki yedi günlük şeritte bugün ortada durur; hedefine ulaştığın günler işaretlenir.', tiklamali: false },
  { kimlik: 'soru-takibi', hedef: 'soru-takibi', baslik: 'Çözdüklerini kaydet', aciklama: 'Soru Takibi’nde çözdüğün soruları ders ve konu bazında kaydedersin. Günlük hedefindeki halka bu kayıtlardan dolar. Şimdilik kartı tanımamız yeterli.', tiklamali: false },
  { kimlik: 'pomodoro-ac', hedef: 'pomodoro-ac', baslik: 'Birlikte odaklanalım', aciklama: 'Şimdi odaklanma aracımızı görmek için Pomodoro’ya dokun.', tiklamali: true },
  { kimlik: 'pomodoro-prova', hedef: 'pomodoro-prova', baslik: 'Pomodoro veya deneme provası', aciklama: 'Çalışma ve mola döngüsü için Pomodoro’yu, sınav süresini deneyimlemek için Deneme provası’nı seçebilirsin. Prova kipinde TYT, AYT veya YDT kitapçığını seçersin.', tiklamali: false },
  { kimlik: 'pomodoro', hedef: 'pomodoro-ayarlar', ekHedefler: ['pomodoro-sayaci', 'pomodoro-ders'], baslik: 'Çalışma ortamını kendine göre kur', aciklama: 'Sayaç çalışma ve mola döngünü gösterir. Çalışacağın dersi seçebilir, Süreler’den çalışma ve molaları ayarlayabilir, Ses’ten müzik açabilirsin. İstersen çalışırken ekranı açık bırakabilirsin. Bu turda ayarlarını değiştirmiyoruz.', tiklamali: false },
  { kimlik: 'pomodoro-kilit', hedef: 'pomodoro-kilit', baslik: 'Dikkatini odak kilidiyle koru', aciklama: 'Odak korumasıyla çalışma sırasında dikkatini dağıtan uygulamaları engelleyebilir ve bildirimleri susturabilirsin. Bu özellik desteklenen Android cihazlarda, verdiğin izinlerle çalışır. Şimdi ana sayfaya dönüp oyunlara bakalım.', tiklamali: false },
  { kimlik: 'oyunlar-ac', hedef: 'oyunlar-ac', baslik: 'Bilgini oyunla pekiştir', aciklama: 'Alt menüdeki Oyunlar’a dokun. Birlikte bir soruluk kısa bir demo oynayacağız.', tiklamali: true },
  { kimlik: 'demo-ac', hedef: 'demo-oyun', baslik: 'Kısa bir deneme', aciklama: 'Tanıtım oyunu kartına dokun. Bu oyundaki cevaplar ve skor yalnızca tanıtımda kalacak.', tiklamali: true },
  { kimlik: 'zorluk', hedef: 'demo-zorluk', etkilesimli: true, baslik: 'Gerçek oyunun hazırlık ekranı', aciklama: 'Bütün mini oyunlarda bu ekrandan tur modunu ve başlangıç zorluğunu seçersin. Tanıtım oyunu da aynı ekranı kullanıyor; burada seçtiklerin yalnızca bu denemede kalır.', tiklamali: false },
  { kimlik: 'oyun-baslat', hedef: 'demo-baslat', baslik: 'Hazırsan turu başlat', aciklama: 'Başlat’a dokun. Geri sayımdan sonra gerçek oyun ekranında bir örnek işlem çözeceksin.', tiklamali: true },
  { kimlik: 'soru-bir', hedef: 'demo-soru', ekHedefler: ['demo-islem'], baslik: 'Bir işlemi dene', aciklama: 'Sonucu tuş takımından yazıp onayla; istersen pas geç. Bu tuş takımı ve geri bildirimler normal oyunlarla aynı. Bir cevaptan sonra sonucu göreceksin.', tiklamali: true },
  { kimlik: 'sonuc', hedef: 'demo-sonuc', baslik: 'Sonucunu hemen gör', aciklama: 'Doğru ve yanlışlarını burada görürsün. Bankanın nasıl çalıştığını göstermek için üç örnek demo soru hazırladık; senin cevaplarından bağımsızlar.', tiklamali: false },
  { kimlik: 'banka-ac', hedef: 'oyun-bankasi-ac', baslik: 'Yanlışlarına yeniden dön', aciklama: 'Üç geçici örnek hazırladık. Oyunlar menüsündeki Oyun Bankası kartına dokunarak nerede toplandıklarını görelim.', tiklamali: true },
  { kimlik: 'banka', hedef: 'demo-banka', baslik: 'Yanlışlarını öğrenmeye dönüştür', aciklama: 'Oyunlarda bilemediğin sorular Oyun Bankası’nda toplanır. Genel testte tekrar çözüp doğru bildiklerini bankadan çıkarabilirsin. Buradaki üç örnek ve demo skorun tur bitince silinecek.', tiklamali: false },
] as const

export const DENEME_ADIMLARI = [
  { kimlik: 'deneme-ekle', hedef: 'deneme-ekle', baslik: 'Netlerini kaydet', aciklama: 'Yeni Deneme Ekle ile TYT, AYT veya diğer denemelerinin doğru ve yanlışlarını girersin. Netlerin otomatik hesaplanır.', tiklamali: false },
  { kimlik: 'deneme-grafik', hedef: 'deneme-grafik', baslik: 'Gelişimini izle', aciklama: 'Netlerinin dalgalanmasını ve genel gidişatını burada izlersin. Farklı deneme şablonları ayrı gösterilir. İlk kaydından sonra grafik oluşur.', tiklamali: false },
] as const
export const HARITA_ADIMLARI = [
  { kimlik: 'konu-haritasi', hedef: 'konu-haritasi', baslik: 'Eksiklerini tek bakışta gör', aciklama: 'Konuları tamamladıkça dersinin ilerlemesi artar. Konu kartları ve bölüm ilerlemesi, bitirdiklerini ve sıradaki konunu gösterir.', tiklamali: false },
] as const
export type TanitimAdimi = (typeof TANITIM_ADIMLARI | typeof DENEME_ADIMLARI | typeof HARITA_ADIMLARI)[number]
export const TUR_ADIMLARI: Record<TanitimTuru, readonly TanitimAdimi[]> = { ana_tur: TANITIM_ADIMLARI, denemeler: DENEME_ADIMLARI, konu_haritasi: HARITA_ADIMLARI }
export type TanitimZorlugu = 'kolay' | 'orta' | 'zor'
export type DemoSoru = { metin: string; cevap: number }

export const DEMO_SORULAR: Record<TanitimZorlugu, readonly [DemoSoru]> = {
  kolay: [{ metin: '8 + 5 = ?', cevap: 13 }],
  orta: [{ metin: '12 × 4 = ?', cevap: 48 }],
  zor: [{ metin: '18 × 7 = ?', cevap: 126 }],
}

export type DemoVeri = {
  demoVeri: true
  banka: BankaKaydi[]
  sonuc: { dogru: number; yanlis: number; skor: number } | null
}

export type TanitimDurumu = { aktifTur: TanitimTuru | null; aktifAdim: number | null; demo: DemoVeri }
export type TanitimEylemi = (
  | { tur: 'baslat'; turAdi?: TanitimTuru }
  | { tur: 'ileri' | 'geri' | 'temizle' }
  | { tur: 'hedefe-dokun'; hedef: string }
  | { tur: 'oyun-bitti'; dogru: number; yanlis: number }
) & { beklenenAdim?: number | null; beklenenTur?: TanitimTuru | null }

export function demoVerileriTemizle(): TanitimDurumu {
  return { aktifTur: null, aktifAdim: null, demo: { demoVeri: true, banka: [], sonuc: null } }
}

function demoBankasiKur(): BankaKaydi[] {
  // Gerçek bankaya ekleme yapılmaz; aynı ekran ayrı bir listeyi çizer.
  return [
    { metin: '8 + 5', sonuc: 13, islemTuru: 'toplama' as const },
    { metin: '6 × 3', sonuc: 18, islemTuru: 'carpma' as const },
    { metin: '81 ÷ 9', sonuc: 9, islemTuru: 'bolme' as const },
  ].map((soru, sira) => ({ id: `tanitim-demo-${sira}`, soru: { oyun: 'islem', ...soru }, kacKez: 1, eklenme: '2026-01-01', sonYanlis: '2026-01-01' }))
}

export function tanitimGecisi(durum: TanitimDurumu, eylem: TanitimEylemi): TanitimDurumu {
  if (eylem.tur === 'temizle') return demoVerileriTemizle()
  if (eylem.beklenenTur !== undefined && eylem.beklenenTur !== durum.aktifTur) return durum
  if (eylem.beklenenAdim !== undefined && eylem.beklenenAdim !== durum.aktifAdim) return durum
  if (eylem.tur === 'baslat') return durum.aktifAdim === null ? { ...demoVerileriTemizle(), aktifTur: eylem.turAdi ?? 'ana_tur', aktifAdim: 0 } : durum
  if (durum.aktifAdim === null || !durum.aktifTur) return durum
  const adimlar = TUR_ADIMLARI[durum.aktifTur]
  const adim = adimlar[durum.aktifAdim]
  let yeniAdim = durum.aktifAdim
  let demo = durum.demo
  switch (eylem.tur) {
    case 'ileri':
      if (adim.tiklamali || durum.aktifAdim === adimlar.length - 1) return durum
      yeniAdim++
      break
    case 'hedefe-dokun':
      if (!['pomodoro-ac', 'oyunlar-ac', 'demo-ac', 'oyun-baslat', 'banka-ac'].includes(adim.kimlik) || adim.hedef !== eylem.hedef) return durum
      yeniAdim++
      break
    case 'oyun-bitti':
      if (adim.kimlik !== 'soru-bir') return durum
      demo = { ...demo, sonuc: { dogru: eylem.dogru, yanlis: eylem.yanlis, skor: eylem.dogru * 10 }, banka: demoBankasiKur() }
      yeniAdim++
      break
    case 'geri': {
      if (adim.kimlik === 'soru-bir') return durum
      yeniAdim = Math.max(0, yeniAdim - 1)
      if (['sonuc', 'oyun-baslat'].includes(adim.kimlik)) yeniAdim = adimlar.findIndex((oge) => oge.kimlik === 'zorluk')
      if (durum.aktifTur === 'ana_tur' && yeniAdim <= adimlar.findIndex((oge) => oge.kimlik === 'zorluk')) demo = demoVerileriTemizle().demo
      break
    }
  }
  return { ...durum, aktifAdim: yeniAdim, demo }
}

export function tanitimKonumu(adim: TanitimAdimi): { sekme: Sekme; ekran: Ekran | null } {
  if (['pomodoro-prova', 'pomodoro', 'pomodoro-kilit'].includes(adim.kimlik)) return { sekme: 'ana', ekran: 'pomodoro' }
  if (adim.kimlik === 'banka') return { sekme: 'oyunlar', ekran: 'oyun-bankasi' }
  return { sekme: ['demo-ac', 'zorluk', 'oyun-baslat', 'soru-bir', 'sonuc', 'banka-ac'].includes(adim.kimlik) ? 'oyunlar' : 'ana', ekran: null }
}

export function demoSonucu(demo: DemoVeri) {
  if (demo.sonuc) return demo.sonuc
  return { dogru: 0, yanlis: 0, skor: 0 }
}
