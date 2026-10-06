import type { Ekran, Sekme } from './gezinme'
import type { MaskotPozu } from './maskot'
import type { BankaKaydi } from './oyunlar/banka'
import type { Deneme, GunlukKayit } from './types'
import type { Gorev } from './yapilacaklar'

export type TanitimTuru = 'ana_tur' | 'denemeler' | 'konu_haritasi'
export const TUR_ANAHTARLARI: Record<TanitimTuru, string> = {
  ana_tur: 'rabi_ana_tur_tamamlandi', denemeler: 'rabi_deneme_turu_tamamlandi', konu_haritasi: 'rabi_harita_turu_tamamlandi',
}
export const TANITIM_ANAHTARI = TUR_ANAHTARLARI.ana_tur

/** Turda kullanıcının kendisinin eklediği kayıt türleri (bkz. `lib/tanitim-veri.ts`). */
export type TanitimKaydi = 'soru' | 'gorev' | 'deneme'

export type TanitimAdimi = {
  kimlik: string
  /** Aydınlatılan öğenin `data-tanitim` değeri. */
  hedef: string
  baslik: string
  aciklama: string
  /** Tablette (sağ ray) farklı yönerge gerektiğinde. */
  tabletAciklama?: string
  /** İleri yok; adım hedefe dokunulunca (ya da `kayit` eklenince) ilerliyor. */
  tiklamali: boolean
  /** İleri var ama hedefin içi kullanılabilir. */
  etkilesimli?: boolean
  ekHedefler?: readonly string[]
  /** Adım, bu türden bir kayıt eklenince ilerliyor (form adımları). */
  kayit?: TanitimKaydi
  /** Dokunma adımında "Aydınlatılan alana dokun" yerine yazılan ipucu. */
  ipucu?: string
  /** İleri düğmesinin yazısı (varsayılan "İleri"). */
  ileriEtiketi?: string
  /** Kısa balon: büyük formların yanında yer kaplamasın. */
  kisa?: boolean
  /** Balondaki Rabi'nin pozu; verilmezse `adimPozu` içeriğe göre seçer. */
  poz?: MaskotPozu
}

/** Adım kimliğine göre varsayılan poz; burada olmayan adım dokunmalıysa işaret eden, değilse tam boy poz alır. */
const ADIM_POZLARI: Record<string, MaskotPozu> = {
  'sinav-hedefi': 'selamlayan', hedef: 'basparmak',
  'pomodoro-prova': 'saatli', pomodoro: 'saatli', 'pomodoro-kilit': 'elleri-belde',
  'soru-form': 'defterli', 'soru-kaydedildi': 'sevinen',
  'gorev-form': 'defterli', 'gorev-kaydedildi': 'basparmak',
  'deneme-liste': 'buyutecli', 'deneme-okut': 'fotografci', 'deneme-kaydet': 'defterli',
  'konu-takibi': 'okuyan', 'harita-ders': 'haritali', 'harita-soru': 'kitapli', 'konu-haritasi': 'haritali',
  'istatistik-tur': 'buyutecli', 'istatistik-son': 'tahtali', 'istatistik-ilerleyen': 'ziplayan', 'istatistik-kutular': 'durbunlu', 'istatistik-karsilastir': 'abakuslu',
  zorluk: 'elleri-belde', 'oyun-sayac': 'saatli', 'soru-bir': 'dusunen', sonuc: 'sevinen',
  banka: 'dusunen', 'banka-liste': 'okuyan', 'banka-test': 'defterli', 'banka-ogrendim': 'basparmak',
}

/** Balondaki Rabi'nin pozu: adımın kendi `poz`u, ana turun son adımında kutlama, yoksa içeriğe uyan varsayılan. */
export function adimPozu(adim: TanitimAdimi, tur: TanitimTuru | null, sonAdimMi: boolean): MaskotPozu {
  if (adim.poz) return adim.poz
  if (sonAdimMi && tur === 'ana_tur') return 'alkislayan'
  return ADIM_POZLARI[adim.kimlik] ?? (adim.tiklamali ? 'isaretci' : 'tam')
}

export const TANITIM_ADIMLARI: readonly TanitimAdimi[] = [
  { kimlik: 'sinav-hedefi', hedef: 'sinav-hedefi', baslik: 'Hedefin hep gözünün önünde', aciklama: 'Sınava kalan süreyi, hedeflediğin bölüm ve üniversiteyi bu karttan izleyebilirsin. Hedefine ne kadar yaklaştığını gösterir.', tiklamali: false },
  { kimlik: 'hedef', hedef: 'gunluk-hedef', baslik: 'Her gün küçük bir adım at', aciklama: 'Her gün çözdüğün soru sayısını ve günlük soru hedefine ne kadar yakın olduğunu görürsün.', tiklamali: false },
  { kimlik: 'araclar-ac', hedef: 'araclar-ac', baslik: 'Çalışma araçların bir dokunuş uzakta', aciklama: 'Alt menüde Araçlar’a dokun.', tabletAciklama: 'Sağdaki menüde Araçlar’a dokun.', tiklamali: true },
  { kimlik: 'pomodoro-ac', hedef: 'arac-pomodoro', baslik: 'Birlikte odaklanalım', aciklama: 'Önce odaklanma aracımıza bakalım: Pomodoro’ya dokun.', tiklamali: true },
  { kimlik: 'pomodoro-prova', hedef: 'pomodoro-prova', baslik: 'Pomodoro veya deneme provası', aciklama: 'Çalışma ve mola döngüsü için Pomodoro’yu, sınav süresini deneyimlemek için Deneme provası’nı seçebilirsin.', tiklamali: false },
  { kimlik: 'pomodoro', hedef: 'pomodoro-calisma', baslik: 'Çalışma ortamını kendine göre kur', aciklama: 'Dersi seçebilir, süreleri ayarlayabilir ve çalışırken ekranı açık tutabilirsin. Bu bloklar birlikte çalışma ortamını oluşturur.', tiklamali: false },
  { kimlik: 'pomodoro-kilit', hedef: 'pomodoro-kilit', baslik: 'Dikkatini odak kilidiyle koru', aciklama: 'Odak korumasıyla çalışma sırasında dikkatini dağıtan uygulamaları engelleyebilir ve bildirimleri susturabilirsin. Bu özellik izin ile çalışır. Şimdi Araçlar’a dönüp Soru Takibi’ne geçelim.', ileriEtiketi: 'Araçlara dön', tiklamali: false },
  { kimlik: 'soru-ac', hedef: 'arac-soru', baslik: 'Çözdüklerini kaydet', aciklama: 'Soru Takibi’nde gün gün çözdüğün soruları ders bazında kaydedersin. Soru Takibi’ne dokun.', tiklamali: true },
  { kimlik: 'soru-ekle', hedef: 'soru-ekle', baslik: 'İlk kaydını birlikte girelim', aciklama: 'Soru ekle’ye dokun. Bu kayıt yalnızca tanıtım için; tur bitince silinecek.', tiklamali: true },
  { kimlik: 'soru-form', hedef: 'soru-formu', kayit: 'soru', kisa: true, baslik: 'Ders ve sayıları gir', aciklama: 'Bir ders seç, toplam soruyu ve doğru, yanlış sayını yaz. Boşları Rabi hesaplar.', ipucu: 'Kaydet’e dokununca devam ederiz', tiklamali: true },
  { kimlik: 'soru-kaydedildi', hedef: 'soru-listesi', baslik: 'Kaydın günlük hedefe işlendi', aciklama: 'Bu örnek tur bitince silinecek.', ileriEtiketi: 'Araçlara dön', tiklamali: false },
  { kimlik: 'gorev-ac', hedef: 'arac-notlar', baslik: 'Gününü planla', aciklama: 'Yapılacaklar’da gününü sabah, öğle ve akşam diye bölüp görev yazarsın. Yapılacaklar’a dokun.', tiklamali: true },
  { kimlik: 'gorev-ekle', hedef: 'gorev-dilimleri', baslik: 'Bir görev ekle', aciklama: 'Sabah, öğle ya da akşamın + düğmesine dokun. Tur bitince eklediklerin silinecek.', tiklamali: true },
  { kimlik: 'gorev-form', hedef: 'gorev-formu', kayit: 'gorev', kisa: true, baslik: 'Görevini yaz', aciklama: 'Ne yapacağını yaz, kategori ve renk seç. Süre isteğe bağlı.', ipucu: 'Kaydet’e dokununca devam ederiz', tiklamali: true },
  { kimlik: 'gorev-kaydedildi', hedef: 'gorev-dilimleri', baslik: 'Görevin listede', aciklama: 'Bitirince işaretler, yıldızla öne alır, gerekirse ertesi güne ertelersin. Bu örnek görev tur bitince silinecek.', ileriEtiketi: 'Araçlara dön', tiklamali: false },
  { kimlik: 'deneme-ac', hedef: 'arac-deneme', baslik: 'Denemelerini kaydet', aciklama: 'Denemeler’e dokun. Nasıl göründüğünü göstermek için iki örnek deneme hazırladık.', tiklamali: true },
  { kimlik: 'deneme-liste', hedef: 'deneme-listesi', baslik: 'Örnek denemeler', aciklama: 'Her kartta denemenin türünü, tarihini ve netini görürsün; karta dokunursan ayrıntılı rapor açılır. Tur bitince silinecekler.', tiklamali: false },
  { kimlik: 'deneme-ekle', hedef: 'deneme-ekle', baslik: 'Şimdi sıra sende', aciklama: 'Deneme ekle’ye dokun. Bu deneme de tanıtıma ait; tur bitince silinecek.', tiklamali: true },
  { kimlik: 'deneme-okut', hedef: 'deneme-okut', etkilesimli: true, baslik: 'Fotoğraftan okut', aciklama: 'Derslerin doğru ve yanlış sayılarını bir kâğıda satır satır yazdıysan fotoğrafını çek, Rabi okuyup forma yazsın. Denemek istersen Okut’a dokun; İleri’ye dokunursan örnek sonuçlar forma kendiliğinden yazılır.', tiklamali: false },
  { kimlik: 'deneme-kaydet', hedef: 'deneme-kaydet', kayit: 'deneme', kisa: true, baslik: 'Denemeni kaydet', aciklama: 'Sonuçlar forma yazıldı ve netin hesaplandı. Kaydet’e dokun.', ipucu: 'Kaydet’e dokun', tiklamali: true },
  { kimlik: 'konu-takibi-ac', hedef: 'arac-konu-takibi', baslik: 'Konularını takip et', aciklama: 'Denemen kaydedildi. Şimdi Konu Takibi’ne dokun.', tiklamali: true },
  { kimlik: 'konu-takibi', hedef: 'konu-takibi', baslik: 'Konu konu işaretle', aciklama: 'TYT ve AYT konularını alanına göre görürsün. Okulda öğrendiğin ve soru çözdüğün konuyu işaretle; konu bitince soldaki daireye dokun.', ileriEtiketi: 'Haritaya geç', tiklamali: false },
  { kimlik: 'harita-ac', hedef: 'harita-ac', baslik: 'Konuları haritada çalış', aciklama: 'Alt menüde Harita’ya dokun.', tabletAciklama: 'Sağdaki menüde Harita’ya dokun.', tiklamali: true },
  { kimlik: 'harita-ders', hedef: 'harita-kart', baslik: 'Yeşil kitap: konu anlatımı', aciklama: 'Yeşil kitaba dokunup konunun kartlarını okursun; dersi burada çalışırsın.', tiklamali: false },
  { kimlik: 'harita-soru', hedef: 'harita-soru', baslik: 'Turuncu kitap: sorular', aciklama: 'Kartları okuyunca turuncu kitapla konunun sorularını çözersin. Haritada bitirdiğin konu Konu Takibi’nde kendiliğinden işaretlenir.', ileriEtiketi: 'Araçlara dön', tiklamali: false },
  { kimlik: 'istatistik-ac', hedef: 'arac-istatistik', baslik: 'Gidişatını izle', aciklama: 'Şimdi İstatistik’e dokun; kaydettiğin deneme orada öncekilerle karşılaştırılır.', tiklamali: true },
  { kimlik: 'istatistik-tur', hedef: 'istatistik-turler', baslik: 'Deneme türünü seç', aciklama: 'Her tür kendi içinde hesaplanır; TYT ile AYT netleri birbirine karışmaz. Bir türün istatistiği o türden iki deneme olunca açılır.', tiklamali: false },
  { kimlik: 'istatistik-son', hedef: 'istatistik-son-net', baslik: 'Son netin ve değişimi', aciklama: 'Son denemenin netini ve bir öncekine göre farkını görürsün. Altında önceki netin ve ortalaman, sağda son dört denemenin netleri yan yana.', tiklamali: false },
  { kimlik: 'istatistik-ilerleyen', hedef: 'istatistik-ilerleyen', baslik: 'En çok ilerlediğin dersler', aciklama: 'Son iki deneme arasında neti en çok artan dersler sıralanır. Daha fazla ile bütün derslerin değişimini görürsün.', tiklamali: false },
  { kimlik: 'istatistik-kutular', hedef: 'istatistik-kutular', baslik: 'Güçlü ve zayıf yanların', aciklama: 'En güçlü ve en kötü dersin, bu türdeki en yüksek ve en düşük netin burada. Dersler soru sayısına oranla kıyaslanır.', tiklamali: false },
  { kimlik: 'istatistik-karsilastir', hedef: 'istatistik-karsilastir', baslik: 'İki denemeyi karşılaştır', aciklama: 'İki deneme seçip hangi derste kazandığını, hangisinde kaybettiğini görürsün. Örnek denemeler ve seninki tur bitince silinecek.', ileriEtiketi: 'Oyunlara geç', tiklamali: false },
  { kimlik: 'oyunlar-ac', hedef: 'oyunlar-ac', baslik: 'Bilgini oyunla pekiştir', aciklama: 'Alt menüdeki Oyunlar’a dokun. Birlikte bir soruluk kısa bir demo oynayacağız.', tiklamali: true },
  { kimlik: 'demo-ac', hedef: 'demo-oyun', baslik: 'Kısa bir deneme', aciklama: 'Tanıtım oyunu kartına dokun. Bu oyundaki cevaplar ve skor yalnızca tanıtımda kalacak.', tiklamali: true },
  { kimlik: 'zorluk', hedef: 'demo-zorluk', etkilesimli: true, baslik: 'Gerçek oyunun hazırlık ekranı', aciklama: 'Tur modunu ve başlangıç zorluğunu seç. Bu seçimler tanıtımda kalır; demo süresi 10 dakikadır.', tiklamali: false },
  { kimlik: 'oyun-baslat', hedef: 'demo-baslat', baslik: 'Hazırsan turu başlat', aciklama: 'Başlat’a dokun. Geri sayımdan sonra gerçek oyun ekranında bir örnek işlem çözeceksin.', tiklamali: true },
  { kimlik: 'oyun-sayac', hedef: 'demo-sayac', baslik: 'Süre ve tur bilgileri', aciklama: 'Üst bölümde kalan süreyi, doğru ve yanlışlarını, serini izlersin. Tanıtım oyununun süresi 10 dakika. Bu açıklamayı okurken sayaç durur; İleri ile örnek soruya geçeriz.', tiklamali: false },
  { kimlik: 'soru-bir', hedef: 'demo-soru', ekHedefler: ['demo-islem'], baslik: 'Bir işlemi dene', aciklama: 'Sonucu tuş takımından yazıp onayla; istersen pas geç. Bu tuş takımı ve geri bildirimler normal oyunlarla aynı. Bir cevaptan sonra sonucu göreceksin.', tiklamali: true },
  { kimlik: 'sonuc', hedef: 'demo-sonuc', baslik: 'Sonucunu hemen gör', aciklama: 'Doğru ve yanlışlarını burada görürsün. Bankanın nasıl çalıştığını göstermek için üç örnek demo soru hazırladık; senin cevaplarından bağımsızlar.', tiklamali: false },
  { kimlik: 'banka-ac', hedef: 'oyun-bankasi-ac', baslik: 'Yanlışlarına yeniden dön', aciklama: 'Üç geçici örnek hazırladık. Oyunlar menüsündeki Oyun Bankası kartına dokunarak nerede toplandıklarını görelim.', tiklamali: true },
  { kimlik: 'banka', hedef: 'demo-banka', baslik: 'Yanlışların burada toplanır', aciklama: 'Mini oyunlarda bilemediğin sorular Oyun Bankası’na kendiliğinden düşer. Buradaki üç soru tanıtım için hazırlanmış örnekler.', tiklamali: false },
  { kimlik: 'banka-liste', hedef: 'banka-liste', baslik: 'Soruların listesi', aciklama: 'Her kartta soru, doğru cevabı ve kaç kez yanlış yaptığın yazar. Üstteki çiplerle oyuna göre süzebilirsin.', tiklamali: false },
  { kimlik: 'banka-test', hedef: 'banka-genel-test', baslik: 'Genel testle yeniden çöz', aciklama: 'Genel test bankadaki soruları karışık sırayla, cevabı göstermeden yeniden sorar. Doğru bildiğin soru bankadan kendiliğinden kalkar.', tiklamali: false },
  { kimlik: 'banka-ogrendim', hedef: 'banka-ogrendim', baslik: 'Öğrendiysen kaldır', aciklama: 'Bir soruyu öğrendiğinden eminsen Öğrendim’e dokun; soru bankadan kalkar. Buradaki üç örnek ve demo skorun tur bitince silinecek.', tiklamali: false },
]

export const DENEME_ADIMLARI: readonly TanitimAdimi[] = [
  { kimlik: 'deneme-ekle', hedef: 'deneme-ekle', baslik: 'Netlerini kaydet', aciklama: 'Deneme ekle ile TYT, AYT veya diğer denemelerinin doğru ve yanlışlarını girersin. Netlerin otomatik hesaplanır; gelişimini İstatistik’te izlersin.', tiklamali: false },
]
export const HARITA_ADIMLARI: readonly TanitimAdimi[] = [
  { kimlik: 'konu-haritasi', hedef: 'konu-haritasi', baslik: 'Eksiklerini tek bakışta gör', aciklama: 'Yeşil kitapta konunun kartlarını okursun, turuncu kitapta sorularını çözersin. Haritada bitirdiğin konu Konu Takibi’nde kendiliğinden işaretlenir.', tiklamali: false },
]
export const TUR_ADIMLARI: Record<TanitimTuru, readonly TanitimAdimi[]> = { ana_tur: TANITIM_ADIMLARI, denemeler: DENEME_ADIMLARI, konu_haritasi: HARITA_ADIMLARI }
export type TanitimZorlugu = 'kolay' | 'orta' | 'zor'
export type DemoSoru = { metin: string; cevap: number }

export const DEMO_SORULAR: Record<TanitimZorlugu, readonly [DemoSoru]> = {
  kolay: [{ metin: '8 + 5 = ?', cevap: 13 }],
  orta: [{ metin: '12 × 4 = ?', cevap: 48 }],
  zor: [{ metin: '18 × 7 = ?', cevap: 126 }],
}

/*
  Turun geçici verisi. Hiçbiri cihaz deposuna yazılmıyor: ekranlar tur
  sürerken gerçek listeler yerine bunları çiziyor, tur bitince (`temizle`,
  `demo-temizle`) hepsi birden siliniyor. Kullanıcının turda eklediği soru,
  görev ve deneme de burada; iki hazır örnek deneme ise alana göre her
  çizimde yeniden kuruluyor (`demoDenemeleri`, `lib/tanitim-veri.ts`).
*/
export type DemoVeri = {
  demoVeri: true
  banka: BankaKaydi[]
  sonuc: { dogru: number; yanlis: number; skor: number } | null
  soruKayitlari: GunlukKayit[]
  gorevler: Gorev[]
  denemeler: Deneme[]
}

type DemoListeleri = { soruKayitlari: GunlukKayit[]; gorevler: Gorev[]; denemeler: Deneme[] }
export type DemoAlani = keyof DemoListeleri
type Guncelleyici<T> = T[] | ((onceki: T[]) => T[])

export type TanitimDurumu = { aktifTur: TanitimTuru | null; aktifAdim: number | null; demo: DemoVeri }
export type TanitimEylemi = (
  | { tur: 'baslat'; turAdi?: TanitimTuru }
  | { tur: 'ileri' | 'geri' | 'temizle' | 'demo-temizle' }
  | { tur: 'hedefe-dokun'; hedef: string }
  | { tur: 'oyun-bitti'; dogru: number; yanlis: number }
  | { tur: 'kayit-eklendi'; kayit: TanitimKaydi }
  | { [A in DemoAlani]: { tur: 'demo-veri'; alan: A; guncelle: Guncelleyici<DemoListeleri[A][number]> } }[DemoAlani]
) & { beklenenAdim?: number | null; beklenenTur?: TanitimTuru | null }

export function demoVerileriTemizle(): TanitimDurumu {
  return { aktifTur: null, aktifAdim: null, demo: { demoVeri: true, banka: [], sonuc: null, soruKayitlari: [], gorevler: [], denemeler: [] } }
}

function demoBankasiKur(): BankaKaydi[] {
  // Gerçek bankaya ekleme yapılmaz; aynı ekran ayrı bir listeyi çizer.
  return [
    { metin: '8 + 5', sonuc: 13, islemTuru: 'toplama' as const },
    { metin: '6 × 3', sonuc: 18, islemTuru: 'carpma' as const },
    { metin: '81 ÷ 9', sonuc: 9, islemTuru: 'bolme' as const },
  ].map((soru, sira) => ({ id: `tanitim-demo-${sira}`, soru: { oyun: 'islem', ...soru }, kacKez: 1, eklenme: '2026-01-01', sonYanlis: '2026-01-01' }))
}

const sira = (kimlik: string) => TANITIM_ADIMLARI.findIndex((adim) => adim.kimlik === kimlik)

/*
  Geri, bazı adımlarda bir önceki adıma değil anlamlı bir başlangıca döner:
  kaydedildi adımından geri gidince form kapalı ve yeniden açılabilir hâlde
  ("ekle" adımı) bulunuyor; yoksa kapalı bir forma işaret eden adıma düşülürdü.
*/
const GERI_HEDEFI: Record<string, string> = {
  'soru-kaydedildi': 'soru-ekle',
  'gorev-kaydedildi': 'gorev-ekle',
  // Deneme kaydedildikten sonra geri, kaydetme formuna değil listeye dönüyor
  // (form yeniden açılsaydı ikinci bir örnek deneme kaydedilirdi).
  'konu-takibi-ac': 'deneme-liste',
}
/** Deneme formunun Vazgeç'i: form kapanıp "Deneme ekle" adımına dönülüyor. */
export const DENEME_VAZGEC = 'deneme-vazgec'
const DENEME_FORMU_ADIMLARI = ['deneme-okut', 'deneme-kaydet']

export function tanitimGecisi(durum: TanitimDurumu, eylem: TanitimEylemi): TanitimDurumu {
  if (eylem.tur === 'demo-temizle') return { ...durum, demo: demoVerileriTemizle().demo }
  if (eylem.tur === 'temizle') return demoVerileriTemizle()
  // Veri değişikliği adımdan bağımsız: geçiş beklenmeden hemen işleniyor.
  if (eylem.tur === 'demo-veri') {
    if (durum.aktifTur !== 'ana_tur') return durum
    const onceki = durum.demo[eylem.alan] as unknown[]
    const yeni = typeof eylem.guncelle === 'function' ? (eylem.guncelle as (o: unknown[]) => unknown[])(onceki) : eylem.guncelle
    return { ...durum, demo: { ...durum.demo, [eylem.alan]: yeni } }
  }
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
      if (eylem.hedef === DENEME_VAZGEC && durum.aktifTur === 'ana_tur' && DENEME_FORMU_ADIMLARI.includes(adim.kimlik)) { yeniAdim = sira('deneme-ekle'); break }
      // Kayıt bekleyen form adımı ve demo oyunun sorusu dokunuşla geçilmiyor.
      if (!adim.tiklamali || adim.kayit || adim.kimlik === 'soru-bir' || adim.hedef !== eylem.hedef) return durum
      yeniAdim++
      break
    case 'kayit-eklendi':
      if (adim.kayit !== eylem.kayit) return durum
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
      if (durum.aktifTur === 'ana_tur' && GERI_HEDEFI[adim.kimlik]) yeniAdim = sira(GERI_HEDEFI[adim.kimlik])
      if (['sonuc', 'oyun-baslat', 'oyun-sayac'].includes(adim.kimlik)) yeniAdim = adimlar.findIndex((oge) => oge.kimlik === 'zorluk')
      // Yalnızca oyunun sonucu ve örnek banka sıfırlanıyor; turda eklenen
      // soru, görev ve deneme oyuna geri dönülünce de yerinde kalıyor.
      if (durum.aktifTur === 'ana_tur' && yeniAdim <= adimlar.findIndex((oge) => oge.kimlik === 'zorluk')) demo = { ...demo, banka: [], sonuc: null }
      break
    }
  }
  return { ...durum, aktifAdim: yeniAdim, demo }
}

export type TanitimKonumu = { sekme: Sekme; ekran: Ekran | null; denemeFormu: boolean }

const ARAC_EKRANLARI: Record<string, Ekran> = {
  'pomodoro-prova': 'pomodoro', pomodoro: 'pomodoro', 'pomodoro-kilit': 'pomodoro',
  'soru-ekle': 'soru', 'soru-form': 'soru', 'soru-kaydedildi': 'soru',
  'gorev-ekle': 'notlar', 'gorev-form': 'notlar', 'gorev-kaydedildi': 'notlar',
  'deneme-liste': 'deneme', 'deneme-ekle': 'deneme', 'deneme-okut': 'deneme', 'deneme-kaydet': 'deneme',
  'konu-takibi': 'konu-takibi', 'harita-ac': 'konu-takibi',
  'istatistik-tur': 'istatistik', 'istatistik-son': 'istatistik', 'istatistik-ilerleyen': 'istatistik', 'istatistik-kutular': 'istatistik', 'istatistik-karsilastir': 'istatistik',
}
const BANKA_ADIMLARI = ['banka', 'banka-liste', 'banka-test', 'banka-ogrendim']
const ARACLAR_SEKMESI = ['pomodoro-ac', 'soru-ac', 'gorev-ac', 'deneme-ac', 'konu-takibi-ac', 'istatistik-ac']
/** Ana turun Harita sekmesinde geçen adımları — kitaplar ve "Araçlara dön". */
export const HARITA_TUR_ADIMLARI = ['harita-ders', 'harita-soru']

export function tanitimKonumu(adim: TanitimAdimi): TanitimKonumu {
  const ekran = ARAC_EKRANLARI[adim.kimlik]
  if (ekran) return { sekme: 'daha', ekran, denemeFormu: DENEME_FORMU_ADIMLARI.includes(adim.kimlik) }
  if (ARACLAR_SEKMESI.includes(adim.kimlik)) return { sekme: 'daha', ekran: null, denemeFormu: false }
  if (BANKA_ADIMLARI.includes(adim.kimlik)) return { sekme: 'oyunlar', ekran: 'oyun-bankasi', denemeFormu: false }
  if (HARITA_TUR_ADIMLARI.includes(adim.kimlik)) return { sekme: 'harita', ekran: null, denemeFormu: false }
  return { sekme: ['demo-ac', 'zorluk', 'oyun-baslat', 'oyun-sayac', 'soru-bir', 'sonuc', 'banka-ac'].includes(adim.kimlik) ? 'oyunlar' : 'ana', ekran: null, denemeFormu: false }
}

export function demoSonucu(demo: DemoVeri) {
  if (demo.sonuc) return demo.sonuc
  return { dogru: 0, yanlis: 0, skor: 0 }
}
