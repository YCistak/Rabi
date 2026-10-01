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
  { kimlik: 'pomodoro', hedef: 'pomodoro-sayaci', baslik: 'Çalış, mola ver, tekrarla', aciklama: 'Pomodoro, çalışmayı kısa molalarla böler. Halka süreyi, noktalar çalışma ve mola döngüsünü gösterir. Süreleri kendine göre ayarlayabilirsin. Harika! Şimdi ana sayfaya dönelim.', tiklamali: false },
  { kimlik: 'oyunlar-ac', hedef: 'oyunlar-ac', baslik: 'Bilgini oyunla pekiştir', aciklama: 'Alt menüdeki Oyunlar’a dokun. Birlikte bir soruluk kısa bir demo oynayacağız.', tiklamali: true },
  { kimlik: 'demo-ac', hedef: 'demo-oyun', baslik: 'Kısa bir deneme', aciklama: 'Demo Oyun kartına dokun. Bu oyundaki cevaplar ve skor yalnızca tanıtımda kalacak.', tiklamali: true },
  { kimlik: 'zorluk', hedef: 'demo-zorluk', baslik: 'Başlangıç seviyeni seç', aciklama: 'Kolay, Orta veya Zor’a dokun. Gerçek oyunlarda başlangıç seviyeni seçebilir, oynadıkça sana uyarlanan sorularla ilerleyebilirsin.', tiklamali: true },
  { kimlik: 'soru-bir', hedef: 'demo-soru', baslik: 'İlk sorunu çöz', aciklama: 'Bir cevaba dokun, ardından Sonucu gör’e bas. Bu bir deneme; doğru ya da yanlış cevap vermen turu etkilemez.', tiklamali: true },
  { kimlik: 'sonuc', hedef: 'demo-sonuc', baslik: 'Sonucunu hemen gör', aciklama: 'Doğru ve yanlışlarını burada görürsün. Bankanın nasıl çalıştığını göstermek için üç örnek demo soru hazırladık; senin cevaplarından bağımsızlar.', tiklamali: false },
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
export type DemoSoru = { metin: string; secenekler: readonly number[]; cevap: number }

export const DEMO_SORULAR: Record<TanitimZorlugu, readonly [DemoSoru]> = {
  kolay: [{ metin: '8 + 5 = ?', secenekler: [11, 13, 15], cevap: 13 }],
  orta: [{ metin: '12 × 4 = ?', secenekler: [36, 48, 56], cevap: 48 }],
  zor: [{ metin: '18 × 7 = ?', secenekler: [116, 126, 136], cevap: 126 }],
}

export type DemoVeri = {
  demoVeri: true
  zorluk: TanitimZorlugu | null
  cevaplar: number[]
  banka: BankaKaydi[]
}

export type TanitimDurumu = { aktifTur: TanitimTuru | null; aktifAdim: number | null; demo: DemoVeri }
export type TanitimEylemi = (
  | { tur: 'baslat'; turAdi?: TanitimTuru }
  | { tur: 'ileri' | 'geri' | 'temizle' }
  | { tur: 'hedefe-dokun'; hedef: string }
  | { tur: 'zorluk-sec'; zorluk: TanitimZorlugu }
  | { tur: 'cevapla'; cevap: number }
  | { tur: 'soruyu-gec' }
) & { beklenenAdim?: number | null; beklenenTur?: TanitimTuru | null }

export function demoVerileriTemizle(): TanitimDurumu {
  return { aktifTur: null, aktifAdim: null, demo: { demoVeri: true, zorluk: null, cevaplar: [], banka: [] } }
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
      if (!['pomodoro-ac', 'oyunlar-ac', 'demo-ac'].includes(adim.kimlik) || adim.hedef !== eylem.hedef) return durum
      yeniAdim++
      break
    case 'zorluk-sec':
      if (adim.kimlik !== 'zorluk') return durum
      demo = { ...demo, zorluk: eylem.zorluk, cevaplar: [], banka: [] }
      yeniAdim++
      break
    case 'cevapla': {
      if (!demo.zorluk || adim.kimlik !== 'soru-bir') return durum
      const sira = 0
      if (demo.cevaplar.length !== sira || !DEMO_SORULAR[demo.zorluk][sira].secenekler.includes(eylem.cevap)) return durum
      demo = { ...demo, cevaplar: [...demo.cevaplar, eylem.cevap] }
      break
    }
    case 'soruyu-gec':
      if (adim.kimlik !== 'soru-bir' || demo.cevaplar.length !== 1) return durum
      yeniAdim++
      if (TANITIM_ADIMLARI[yeniAdim].kimlik === 'sonuc') demo = { ...demo, banka: demoBankasiKur() }
      break
    case 'geri':
      yeniAdim = Math.max(0, yeniAdim - 1)
      if (yeniAdim <= 7) demo = demoVerileriTemizle().demo
      else if (yeniAdim === 8) demo = { ...demo, cevaplar: [], banka: [] }
      break
  }
  return { ...durum, aktifAdim: yeniAdim, demo }
}

export function tanitimKonumu(adim: TanitimAdimi): { sekme: Sekme; ekran: Ekran | null } {
  if (adim.kimlik === 'pomodoro') return { sekme: 'ana', ekran: 'pomodoro' }
  if (adim.kimlik === 'banka') return { sekme: 'oyunlar', ekran: 'oyun-bankasi' }
  return { sekme: ['demo-ac', 'zorluk', 'soru-bir', 'sonuc'].includes(adim.kimlik) ? 'oyunlar' : 'ana', ekran: null }
}

export function demoSonucu(demo: DemoVeri) {
  const dogru = demo.zorluk ? demo.cevaplar.filter((cevap, sira) => DEMO_SORULAR[demo.zorluk!][sira].cevap === cevap).length : 0
  return { dogru, yanlis: demo.cevaplar.length - dogru, skor: dogru * 10 }
}
