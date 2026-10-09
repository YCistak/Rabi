import type { Ekran, Sekme } from './gezinme'
import type { MaskotPozu } from './maskot'
import type { BankaKaydi } from './oyunlar/banka'
import type { Deneme, GunlukKayit } from './types'
import type { Gorev } from './yapilacaklar'

/*
  Bir ana tur ve ekran başına mini turlar.

  Ana tur bir süre 46 adımdı ve uygulamanın neredeyse her ekranını gezdiriyordu;
  kullanıcı değerlendirmesinde uzun bulundu. Önce 12 adıma indi (ana sayfa,
  soru ekleme, Konu Takibi, Harita), deneme ekleme ve İstatistik mini turlara
  taştı; kullanıcı o ikisini mini turda zayıf buldu ve ana tura geri istedi.
  Şimdi 28 adım: soru eklemeden sonra Pomodoro'ya kısa bir değinme, Harita'dan
  sonra deneme ekleme ve İstatistik. Gerisi (Pomodoro'nun ayrıntısı,
  Yapılacaklar, Oyunlar, Oyun Bankası) ekran bazlı mini turlarda —
  ilgili ekran **ilk kez** açıldığında 1–5 adımlık kısa bir tur (`miniTurSec`).
  Mini turlar da ana tur gibi atlanamıyor ve her biri bir kez görülüyor.
*/
export type TanitimTuru =
  | 'ana_tur'
  | 'denemeler'
  | 'konu_haritasi'
  | 'pomodoro'
  | 'yapilacaklar'
  | 'istatistik'
  | 'oyunlar'
  | 'oyun_bankasi'

/**
 * Turların "görüldü" kayıtları. İlk üçü eski adlarıyla kalıyor: değişselerdi
 * turu bitirmiş herkes onları yeniden görürdü. Yeni mini turlar projenin
 * anahtar kuralında (`rabi-` öneki, sürümlü): tur içeriği ileride baştan
 * değişirse sürüm artırılıp bir kez daha gösterilebilir.
 */
export const TUR_ANAHTARLARI: Record<TanitimTuru, string> = {
  ana_tur: 'rabi_ana_tur_tamamlandi',
  denemeler: 'rabi_deneme_turu_tamamlandi',
  konu_haritasi: 'rabi_harita_turu_tamamlandi',
  pomodoro: 'rabi-mini-tur-pomodoro-v1',
  // v3: tur görevi gerçekten ekletiyor, Pomodoro düğmesini ve ⋯ menüsünü
  // gösteriyor. v2 (yalnız gösteren, alanları kilitli) "bozuk" bulundu;
  // onu görenler de yeni hâli bir kez görsün (v1, v2 `ESKI_ANAHTARLAR`da).
  yapilacaklar: 'rabi-mini-tur-yapilacaklar-v3',
  istatistik: 'rabi-mini-tur-istatistik-v1',
  oyunlar: 'rabi-mini-tur-oyunlar-v1',
  oyun_bankasi: 'rabi-mini-tur-oyun-bankasi-v1',
}

/** Balonun üst satırındaki tur etiketi. */
export const TUR_ETIKETLERI: Record<TanitimTuru, string> = {
  ana_tur: 'RABİ’Yİ TANI',
  denemeler: 'DENEMELER',
  konu_haritasi: 'KONU HARİTASI',
  pomodoro: 'POMODORO',
  yapilacaklar: 'YAPILACAKLAR',
  istatistik: 'İSTATİSTİK',
  oyunlar: 'OYUNLAR',
  oyun_bankasi: 'OYUN BANKASI',
}
export const TANITIM_ANAHTARI = TUR_ANAHTARLARI.ana_tur
/**
 * Ana turun eski kayıt anahtarı (ilk turun). Artık okunmuyor: ana tur
 * sürümlü (`ANA_TUR_SURUMU`) ve eski anahtarlardan biri olan kullanıcı da
 * güncel turu bir kez görüyor. Anahtar "Tüm verileri sil" için duruyor.
 */
export const ESKI_ANA_TUR_ANAHTARI = 'rabi_tanitim_tamamlandi'

/**
 * Ana turun güncel sürümü. Tur içeriği baştan değişince artırılır; kayıtlı
 * sürümü bundan küçük olan kurulu kullanıcı yeni turu **bir kez** görür
 * (kullanıcı istedi, 2026-10: eski turu bitirenler de yeni tanıtımı görsün).
 * `rabi_ana_tur_tamamlandi` / `rabi_tanitim_tamamlandi` (`'true'`) sürüm
 * 1 sayılır — yani artık turu görülmüş yapmaz.
 */
export const ANA_TUR_SURUMU = 2
export const ANA_TUR_SURUM_ANAHTARI = 'rabi_ana_tur_surumu'

/**
 * Bir turun kayıtta görülmüş olup olmadığı. `oku` depo okuyucusu
 * (`localStorage.getItem`); test edilebilsin diye dışarıdan veriliyor.
 */
export function turGorulduOku(turAdi: TanitimTuru, oku: (anahtar: string) => string | null): boolean {
  if (turAdi === 'ana_tur') return Number(oku(ANA_TUR_SURUM_ANAHTARI) ?? 0) >= ANA_TUR_SURUMU
  return oku(TUR_ANAHTARLARI[turAdi]) === 'true'
}

/**
 * Tur bitince yazılacak kayıtlar. Ana turda eski `'true'` anahtarı da
 * yazılıyor: eski bir sürüme geri dönülürse tur yeniden açılmasın.
 */
export function turBitisKayitlari(turAdi: TanitimTuru): [anahtar: string, deger: string][] {
  const kayitlar: [string, string][] = [[TUR_ANAHTARLARI[turAdi], 'true']]
  if (turAdi === 'ana_tur') kayitlar.push([ANA_TUR_SURUM_ANAHTARI, String(ANA_TUR_SURUMU)])
  return kayitlar
}

/** Turda kullanıcının kendisinin eklediği kayıt türleri (bkz. `lib/tanitim-veri.ts`). */
export type TanitimKaydi = 'soru' | 'gorev' | 'deneme' | 'deneme-ders'

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
  /**
   * Spotun hedef kutusundan taşma payı, CSS pikseli (varsayılan 5). Çizimi
   * kutusundan taşan hedefler için: haritadaki kitapların gölgesi, halkası ve
   * büyütmesi düğmenin 60×76'lık kutusunun dışına çıkıyor.
   */
  dolgu?: number
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
  /**
   * Bu adımdan geri dönülmez (balonun Geri'si pasif, Android geri tuşu
   * yutulur): önceki adım bir kayıt formuydu ve kayıt gerçek; forma dönmek
   * ikinci bir kayıt açardı.
   */
  geriKapali?: boolean
}

/** Adım kimliğine göre varsayılan poz; burada olmayan adım dokunmalıysa işaret eden, değilse tam boy poz alır. */
const ADIM_POZLARI: Record<string, MaskotPozu> = {
  'sinav-hedefi': 'selamlayan', hedef: 'basparmak',
  'pomodoro-prova': 'saatli', pomodoro: 'saatli', 'pomodoro-kilit': 'elleri-belde',
  'soru-form': 'defterli', 'soru-kaydedildi': 'sevinen',
  'gorev-form': 'defterli', 'gorev-pomodoro-baslat': 'saatli', 'gorev-menu': 'basparmak',
  'deneme-liste': 'buyutecli', 'deneme-detay': 'okuyan', 'pomodoro-sayac': 'saatli', 'pomodoro-odak': 'elleri-belde', 'deneme-okut': 'fotografci', 'deneme-elle': 'defterli', 'deneme-yanlis': 'dusunen', 'deneme-kaydet': 'defterli',
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

/**
 * Ana tur — 28 adım. Sıra: ana sayfa, soru ekleme, Pomodoro (iki adım: sayaç
 * ve odak koruması), Konu Takibi, Harita, sonra
 * deneme ekleme ve İstatistik (kullanıcı ikisini mini turda değil ana turda
 * istedi; sayaç yok, atlanamaz). "Turu Bitir" son İstatistik adımında.
 *
 * Deneme formu: Okut tanıtılıyor; okutmadan İleri denirse örnek sonuçlar
 * **bir ders hariç** her derse yazılıyor (`turFormuSonuclari`). Boş ders
 * (`turBosDersi`) aydınlatılıyor ve geçerli bir doğru/yanlış girilmeden tur
 * ilerlemiyor; ardından "Yanlış soru ekle" yalnızca gösteriliyor (bilgi
 * adımı, İleri ile geçilir) ve en son deneme kaydediliyor. Hepsi turun
 * geçici verisi.
 *
 * "Yanlış soru ekle" bir süre dokundurulup örnek soru formu açtırılıyor,
 * Kaydet'e bastırılıyordu; Android'de (Mi Note 10 Lite) hatalı bulundu ve
 * kullanıcı turda yanlış soru eklettirilmesin, yalnızca gösterilsin istedi
 * (2026-10). Formu turda yeniden açtırma.
 */
export const TANITIM_ADIMLARI: readonly TanitimAdimi[] = [
  { kimlik: 'sinav-hedefi', hedef: 'sinav-hedefi', baslik: 'Sınava kalan süre', aciklama: 'Kalan süreyi ve hedef bölümünü bu karttan izlersin.', tiklamali: false },
  { kimlik: 'hedef', hedef: 'gunluk-hedef', baslik: 'Günlük hedef', aciklama: 'Bugün çözdüğün soru sayısı hedefinle birlikte burada.', tiklamali: false },
  { kimlik: 'araclar-ac', hedef: 'araclar-ac', baslik: 'Çalışma araçların', aciklama: 'Alt menüde Araçlar’a dokun.', tabletAciklama: 'Sağdaki menüde Araçlar’a dokun.', tiklamali: true },
  { kimlik: 'soru-ac', hedef: 'arac-soru', baslik: 'Soru Takibi', aciklama: 'Soru Takibi’ne dokun; çözdüklerini burada kaydedersin.', tiklamali: true },
  { kimlik: 'soru-ekle', hedef: 'soru-ekle', baslik: 'İlk kaydın', aciklama: 'Soru ekle’ye dokun. Kayıt tur bitince silinir.', tiklamali: true },
  { kimlik: 'soru-form', hedef: 'soru-formu', kayit: 'soru', kisa: true, baslik: 'Ders ve sayılar', aciklama: 'Dersi seç, toplam, doğru ve yanlış sayını yaz.', ipucu: 'Kaydet’e dokun', tiklamali: true },
  { kimlik: 'soru-kaydedildi', hedef: 'soru-listesi', baslik: 'Hedefe işlendi', aciklama: 'Kaydın günlük hedefine eklendi.', ileriEtiketi: 'Araçlara dön', tiklamali: false },
  // Pomodoro ana turda yalnız tanıtılıyor (kullanıcı istedi, 2026-10); ayrıntısı
  // (iki mod, ayarlar) ekranın kendi mini turunda. Sayaç turda başlatılmıyor.
  { kimlik: 'pomodoro-ac', hedef: 'arac-pomodoro', baslik: 'Odaklı çalış', aciklama: 'Pomodoro’ya dokun.', tiklamali: true },
  { kimlik: 'pomodoro-sayac', hedef: 'pomodoro-sayaci', baslik: 'Pomodoro', aciklama: 'Sayaç çalışma ve molayı sırayla tutar; dersini seçip başlatırsın.', tiklamali: false },
  { kimlik: 'pomodoro-odak', hedef: 'pomodoro-kilit', baslik: 'Odak koruması', aciklama: 'Açarsan çalışırken dikkat dağıtan uygulamalar engellenir.', ileriEtiketi: 'Araçlara dön', tiklamali: false },
  { kimlik: 'konu-takibi-ac', hedef: 'arac-konu-takibi', baslik: 'Konu Takibi', aciklama: 'Konu Takibi’ne dokun.', tiklamali: true },
  { kimlik: 'konu-takibi', hedef: 'konu-takibi', baslik: 'Konu konu işaretle', aciklama: 'Dersi açınca konunun solundaki daireyle Bitirdim’i işaretlersin.', tiklamali: false },
  { kimlik: 'harita-ac', hedef: 'harita-ac', baslik: 'Konu haritası', aciklama: 'Alt menüde Harita’ya dokun.', tabletAciklama: 'Sağdaki menüde Harita’ya dokun.', tiklamali: true },
  { kimlik: 'harita-ders', hedef: 'harita-kart', dolgu: 14, baslik: 'Yeşil kitap', aciklama: 'Konuyu kısa kartlarla buradan çalışırsın.', tiklamali: false },
  { kimlik: 'harita-soru', hedef: 'harita-soru', dolgu: 14, baslik: 'Turuncu kitap', aciklama: 'Konunun sorularını çöz; biten konu takipte işaretlenir.', ileriEtiketi: 'Araçlara dön', tiklamali: false },
  { kimlik: 'deneme-ac', hedef: 'arac-deneme', baslik: 'Denemelerin', aciklama: 'Denemeler’e dokun; iki örnek deneme hazırladık.', tiklamali: true },
  // Örnek denemenin kartı açtırılıyor (kullanıcı istedi, 2026-10): bakmak
  // yerine dokunup ders ders netleri görsün. Örnekler turun belleğinde.
  { kimlik: 'deneme-liste', hedef: 'deneme-ornek', baslik: 'Örnek denemeler', aciklama: 'Örnek denemeye dokun; ders ders netleri açılsın.', tiklamali: true },
  { kimlik: 'deneme-detay', hedef: 'deneme-detay', baslik: 'Ders ders netler', aciklama: 'Her dersin doğru, yanlış, boş ve net sayısı burada.', tiklamali: false },
  { kimlik: 'deneme-ekle', hedef: 'deneme-ekle', baslik: 'Şimdi sıra sende', aciklama: 'Deneme ekle’ye dokun.', tiklamali: true },
  { kimlik: 'deneme-okut', hedef: 'deneme-okut', etkilesimli: true, baslik: 'Kâğıdı okut', aciklama: 'Okut’la kâğıdı fotoğrafla, Rabi forma yazsın. İleri dersen biri hariç örnekle dolar.', tiklamali: false },
  { kimlik: 'deneme-elle', hedef: 'deneme-bos-ders', kayit: 'deneme-ders', kisa: true, baslik: 'Bu ders sende', aciklama: 'Bu dersin doğru ve yanlış sayısını kendin yaz.', ipucu: 'Doğru ve yanlışı yaz', tiklamali: true },
  { kimlik: 'deneme-yanlis', hedef: 'deneme-yanlis-ekle', baslik: 'Yanlışını sakla', aciklama: 'Buradan yanlış sorularını fotoğraflayıp soru bankana ekleyebilirsin.', tiklamali: false },
  { kimlik: 'deneme-kaydet', hedef: 'deneme-kaydet', kayit: 'deneme', kisa: true, baslik: 'Denemeni kaydet', aciklama: 'Net hesaplandı. Kaydet’e dokun.', ipucu: 'Kaydet’e dokun', tiklamali: true },
  { kimlik: 'istatistik-ac', hedef: 'arac-istatistik', baslik: 'Gidişatın', aciklama: 'İstatistik’e dokun.', tiklamali: true },
  { kimlik: 'istatistik-tur', hedef: 'istatistik-turler', baslik: 'Deneme türü', aciklama: 'Her tür ayrı hesaplanır; iki denemeden sonra açılır.', tiklamali: false },
  { kimlik: 'istatistik-son', hedef: 'istatistik-son-net', baslik: 'Son net', aciklama: 'Son netini ve bir öncekine göre farkını görürsün.', tiklamali: false },
  { kimlik: 'istatistik-ilerleyen', hedef: 'istatistik-ilerleyen', baslik: 'En çok ilerleyenler', aciklama: 'Son iki denemede neti en çok artan dersler.', tiklamali: false },
  { kimlik: 'istatistik-kutular', hedef: 'istatistik-kutular', baslik: 'Güçlü ve zayıf yanların', aciklama: 'En güçlü ve en kötü dersin, en yüksek ve en düşük netin.', tiklamali: false },
  { kimlik: 'istatistik-karsilastir', hedef: 'istatistik-karsilastir', baslik: 'Deneme karşılaştır', aciklama: 'İki deneme seç, hangi derste kazandığını gör.', tiklamali: false },
]

/*
  Mini turlar. Hiçbiri ekran değiştirmiyor: kullanıcı o ekrandayken başlıyor
  ve bittiğinde aynı ekranda bırakıyor. Hedefler ekranda her zaman bulunan
  öğeler; gerçek veri gerektirenlerde (İstatistik, Oyun Bankası) tur kendi
  örnek verisini çiziyor ve bitince siliyor.
*/
export const DENEME_ADIMLARI: readonly TanitimAdimi[] = [
  { kimlik: 'deneme-ekle', hedef: 'deneme-ekle', baslik: 'Netlerini kaydet', aciklama: 'Netleri elle gir ya da kâğıdı fotoğrafla okut; net kendiliğinden hesaplanır.', tiklamali: false },
]
export const HARITA_ADIMLARI: readonly TanitimAdimi[] = [
  { kimlik: 'konu-haritasi', hedef: 'konu-haritasi', baslik: 'Eksiklerini gör', aciklama: 'Yeşil kitapta kartları oku, turuncu kitapta soruları çöz.', tiklamali: false },
]
export const POMODORO_ADIMLARI: readonly TanitimAdimi[] = [
  { kimlik: 'pomodoro-prova', hedef: 'pomodoro-prova', baslik: 'İki çalışma modu', aciklama: 'Pomodoro çalışma-mola içindir, Deneme provası sınav süresi için.', tiklamali: false },
  { kimlik: 'pomodoro', hedef: 'pomodoro-calisma', baslik: 'Çalışma ayarları', aciklama: 'Dersi, süreleri ve ekranın açık kalmasını buradan ayarlarsın.', tiklamali: false },
  { kimlik: 'pomodoro-kilit', hedef: 'pomodoro-kilit', baslik: 'Odak koruması', aciklama: 'Dikkat dağıtan uygulamaları engeller, bildirimleri susturur; izin ister.', tiklamali: false },
]
/*
  Yapılacaklar: kullanıcı görevi **gerçekten** ekliyor (kullanıcı istedi,
  2026-10). Bir süre form alanları bilgi adımlarıyla gösteriliyor, kayıt
  kapalıydı; rehber alanları kilitlediği için "yazı yazılamıyor, hiçbir şey
  yapılamıyor" diye bozuk bulundu. Şimdi form adımı Soru ekle'deki gibi bir
  kayıt adımı: form serbest, tur Kaydet'i bekliyor. Görev gerçek listeye
  yazılıyor ve tur bitince listede kalıyor (kullanıcının kendi eylemi). Sonra
  satırdaki Pomodoro düğmesi ve ⋯ menüsü (düzenle, ertele, sil) gösteriliyor.
*/
export const YAPILACAKLAR_ADIMLARI: readonly TanitimAdimi[] = [
  { kimlik: 'gorev-ekle', hedef: 'gorev-ekle', baslik: 'Gününü planla', aciklama: '+ düğmesine dokun; görev ekleme sayfası açılsın.', tiklamali: true },
  { kimlik: 'gorev-form', hedef: 'gorev-formu', kayit: 'gorev', kisa: true, baslik: 'İlk görevin', aciklama: 'Ne yapacağını yaz, kategori ve renk seç.', ipucu: 'Kaydet’e dokun', tiklamali: true },
  { kimlik: 'gorev-pomodoro-baslat', hedef: 'gorev-satir-pomodoro', geriKapali: true, baslik: 'Pomodoro ile başlat', aciklama: 'Bu görevden Pomodoro başlatabilirsin.', tiklamali: false },
  { kimlik: 'gorev-menu-ac', hedef: 'gorev-eylem-ac', baslik: 'Diğer işlemler', aciklama: 'Görevin ⋯ düğmesine dokun.', tiklamali: true },
  { kimlik: 'gorev-menu', hedef: 'gorev-eylemleri', baslik: 'Düzenle, ertele, sil', aciklama: 'Görevi buradan düzenler, yarına erteler ya da silersin.', tiklamali: false },
]
/** Yapılacaklar turunun ekleme sayfası açıkken geçen adımları. */
export const GOREV_FORMU_ADIMLARI = ['gorev-form']
/** Ekleme sayfasının turda kapatılması (✕, aşağı kaydırma): "+" adımına dönülüyor. */
export const GOREV_VAZGEC = 'gorev-vazgec'

/**
 * Yapılacaklar turunda ekleme sayfası açık mı. Sayfa turda kullanıcının
 * dokunuşuna değil **adıma** bağlı: Geri ya da ✕ formdan çıkınca sayfa
 * kaydedilmeden kalkıyor; Kaydet'le de adım ilerleyip sayfa kapanıyor.
 */
export function gorevFormuTurdaAcik(tur: TanitimTuru | null, adimKimligi: string | null): boolean {
  return tur === 'yapilacaklar' && adimKimligi !== null && GOREV_FORMU_ADIMLARI.includes(adimKimligi)
}

/** Yapılacaklar turunda görevin ⋯ menüsü açık mı (menü de adıma bağlı). */
export function gorevMenusuTurdaAcik(tur: TanitimTuru | null, adimKimligi: string | null): boolean {
  return tur === 'yapilacaklar' && adimKimligi === 'gorev-menu'
}
export const ISTATISTIK_ADIMLARI: readonly TanitimAdimi[] = [
  { kimlik: 'istatistik-tur', hedef: 'istatistik-turler', baslik: 'Deneme türü', aciklama: 'Örnek denemelerle gösteriyoruz. Her tür ayrı hesaplanır.', tiklamali: false },
  { kimlik: 'istatistik-son', hedef: 'istatistik-son-net', baslik: 'Son net', aciklama: 'Son netini ve bir öncekine göre farkını görürsün.', tiklamali: false },
  { kimlik: 'istatistik-ilerleyen', hedef: 'istatistik-ilerleyen', baslik: 'En çok ilerleyenler', aciklama: 'Son iki denemede neti en çok artan dersler.', tiklamali: false },
  { kimlik: 'istatistik-kutular', hedef: 'istatistik-kutular', baslik: 'Güçlü ve zayıf yanların', aciklama: 'En güçlü ve en kötü dersin, en yüksek ve en düşük netin.', tiklamali: false },
  { kimlik: 'istatistik-karsilastir', hedef: 'istatistik-karsilastir', baslik: 'Deneme karşılaştır', aciklama: 'İki deneme seç, hangi derste kazandığını gör.', tiklamali: false },
]
/*
  Tanıtım oyunu. Eskiden "Süre ve skor" adımı da vardı (sayaç dururken
  üst çubuğu anlatıyordu); beş adıma sığmak için kalktı — rehber artık
  geri sayımdan sonra doğrudan soruyla açılıyor (`DemoOyun`).
*/
export const OYUN_ADIMLARI: readonly TanitimAdimi[] = [
  { kimlik: 'demo-ac', hedef: 'demo-oyun', baslik: 'Kısa deneme', aciklama: 'Tanıtım oyunu kartına dokun; skor tanıtımda kalır.', tiklamali: true },
  // Hazırlık ekranı yerini oyun modu penceresine bıraktı (`ModPenceresi`,
  // `oyun-tanitim.tsx`): zorluk seçimi yok, düğmenin adı "Başla". Kimlik
  // (`zorluk`) geri dönüş kararlarında ve `DemoOyun`da geçtiği için kaldı.
  { kimlik: 'zorluk', hedef: 'demo-zorluk', etkilesimli: true, baslik: 'Oyun modu', aciklama: 'Her oyun bu pencereyle açılır. İstersen başka bir mod seç.', tiklamali: false },
  { kimlik: 'oyun-baslat', hedef: 'demo-baslat', baslik: 'Turu başlat', aciklama: 'Başla’ya dokun; 3, 2, 1 sayımından sonra soru gelir.', tiklamali: true },
  // Tanıtım oyununda pas yok (`oyun-islem.tsx`, `pas` demoda tanımsız): 0.9.14'te
  // tuş takımındaki "Pas geç" kalktı, ortak pas demoya verilmedi. Rehber pas önermesin.
  { kimlik: 'soru-bir', hedef: 'demo-soru', ekHedefler: ['demo-islem'], baslik: 'Bir işlemi çöz', aciklama: 'Sonucu yaz ve Onayla’ya dokun.', tiklamali: true },
  { kimlik: 'sonuc', hedef: 'demo-sonuc', baslik: 'Sonucun', aciklama: 'Bu turdaki doğru sayın burada. Bilemediklerin Oyun Bankası’na düşer.', tiklamali: false },
]
export const BANKA_ADIMLARI: readonly TanitimAdimi[] = [
  { kimlik: 'banka', hedef: 'demo-banka', baslik: 'Yanlışların burada', aciklama: 'Bilemediğin sorular buraya düşer; üç örnek hazırladık.', tiklamali: false },
  { kimlik: 'banka-liste', hedef: 'banka-liste', baslik: 'Soru listesi', aciklama: 'Her kartta soru, cevap ve yanlış sayın var; çiplerle süzersin.', tiklamali: false },
  { kimlik: 'banka-test', hedef: 'banka-genel-test', baslik: 'Genel test', aciklama: 'Bankadaki soruları karışık sorar; doğru bildiğin kalkar.', tiklamali: false },
  { kimlik: 'banka-ogrendim', hedef: 'banka-ogrendim', baslik: 'Öğrendiysen kaldır', aciklama: 'Eminsen Öğrendim’le soruyu kaldırırsın. Örnekler tur bitince silinir.', tiklamali: false },
]
export const TUR_ADIMLARI: Record<TanitimTuru, readonly TanitimAdimi[]> = {
  ana_tur: TANITIM_ADIMLARI,
  denemeler: DENEME_ADIMLARI,
  konu_haritasi: HARITA_ADIMLARI,
  pomodoro: POMODORO_ADIMLARI,
  yapilacaklar: YAPILACAKLAR_ADIMLARI,
  istatistik: ISTATISTIK_ADIMLARI,
  oyunlar: OYUN_ADIMLARI,
  oyun_bankasi: BANKA_ADIMLARI,
}

/** Mini turun başlayıp başlamayacağına bakılan yer — `AppShell`in o anki hâli. */
export type MiniTurKonumu = {
  sekme: Sekme
  ekran: Ekran | null
  /** Deneme formu açık mı (Denemeler'in turu formun arkasında başlamıyor). */
  denemeFormu: boolean
  /** Pomodoro turu başlamış mı (duraklatılmış da olsa): tam ekran sahne açık. */
  pomodoroIsliyor: boolean
  /** Yapılacaklar'dan "Pomodoro ile başlat" ile gelindi: kullanıcı sayaç için geldi. */
  pomodoroIstegi: boolean
  /** Oyun Bankası genel testi sürüyor. */
  genelTest: boolean
}

/**
 * Bulunulan yerin mini turu; yoksa `null`. Turun daha önce görülüp
 * görülmediğine bakmıyor — o kayıt `TanitimSaglayici`de.
 *
 * Pomodoro'nun turu sayaç işlerken (tam ekran sahne hedefleri örtüyor) ya da
 * görevden "başlat" ile gelinmişken başlamıyor; bir sonraki boş ziyarette
 * çıkıyor.
 */
export function miniTurSec(konum: MiniTurKonumu): TanitimTuru | null {
  if (konum.genelTest) return null
  switch (konum.ekran) {
    case 'deneme': return konum.denemeFormu ? null : 'denemeler'
    case 'pomodoro': return konum.pomodoroIsliyor || konum.pomodoroIstegi ? null : 'pomodoro'
    case 'notlar': return 'yapilacaklar'
    case 'istatistik': return 'istatistik'
    case 'oyun-bankasi': return 'oyun_bankasi'
    case null:
      if (konum.sekme === 'harita') return 'konu_haritasi'
      if (konum.sekme === 'oyunlar') return 'oyunlar'
      return null
    default: return null
  }
}
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
  `demo-temizle`) hepsi birden siliniyor. Kullanıcının ana turda eklediği
  soru ve deneme burada (görev alanı ana tur kısalmadan önceden kalma, boş
  duruyor); iki hazır örnek deneme alana göre her çizimde yeniden kuruluyor
  (`demoDenemeleri`, `lib/tanitim-veri.ts`).
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
  // Deneme kaydedildikten sonra geri, kaydetme formuna değil listeye dönüyor
  // (form yeniden açılsaydı ikinci bir örnek deneme kaydedilirdi).
  'istatistik-ac': 'deneme-liste',
}
/** Deneme formunun Vazgeç'i: form kapanıp "Deneme ekle" adımına dönülüyor. */
export const DENEME_VAZGEC = 'deneme-vazgec'
/** Ana turun deneme formu açıkken geçen adımları. */
export const DENEME_FORMU_ADIMLARI = ['deneme-okut', 'deneme-elle', 'deneme-yanlis', 'deneme-kaydet']

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
  if (eylem.tur === 'baslat') {
    if (durum.aktifAdim !== null) return durum
    const temiz = demoVerileriTemizle()
    const turAdi = eylem.turAdi ?? 'ana_tur'
    // Oyun Bankası turu üç örnek soruyla açılıyor: bankası boş kullanıcıda
    // anlatılacak liste, test ve "Öğrendim" düğmesi hiç çizilmezdi.
    const demo = turAdi === 'oyun_bankasi' ? { ...temiz.demo, banka: demoBankasiKur() } : temiz.demo
    return { ...temiz, demo, aktifTur: turAdi, aktifAdim: 0 }
  }
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
      if (eylem.hedef === GOREV_VAZGEC && durum.aktifTur === 'yapilacaklar' && GOREV_FORMU_ADIMLARI.includes(adim.kimlik)) { yeniAdim = adimlar.findIndex((oge) => oge.kimlik === 'gorev-ekle'); break }
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
      if (adim.kimlik === 'soru-bir' || adim.geriKapali) return durum
      yeniAdim = Math.max(0, yeniAdim - 1)
      if (durum.aktifTur === 'ana_tur' && GERI_HEDEFI[adim.kimlik]) yeniAdim = sira(GERI_HEDEFI[adim.kimlik])
      const zorluk = adimlar.findIndex((oge) => oge.kimlik === 'zorluk')
      if (['sonuc', 'oyun-baslat'].includes(adim.kimlik)) yeniAdim = zorluk
      // Oyunun hazırlığına dönülünce yalnızca oyunun sonucu ve ondan doğan
      // örnek banka sıfırlanıyor; yeni bir deneme turu temiz başlasın.
      if (durum.aktifTur === 'oyunlar' && yeniAdim <= zorluk) demo = { ...demo, banka: [], sonuc: null }
      break
    }
  }
  return { ...durum, aktifAdim: yeniAdim, demo }
}

export type TanitimKonumu = { sekme: Sekme; ekran: Ekran | null; denemeFormu: boolean }

/** Ana turun araç ekranlarında geçen adımları. */
const ARAC_EKRANLARI: Record<string, Ekran> = {
  'soru-ekle': 'soru', 'soru-form': 'soru', 'soru-kaydedildi': 'soru',
  'konu-takibi': 'konu-takibi', 'harita-ac': 'konu-takibi',
  'deneme-liste': 'deneme', 'deneme-detay': 'deneme', 'deneme-ekle': 'deneme',
  'pomodoro-sayac': 'pomodoro', 'pomodoro-odak': 'pomodoro',
  ...Object.fromEntries(DENEME_FORMU_ADIMLARI.map((kimlik) => [kimlik, 'deneme' as const])),
  'istatistik-tur': 'istatistik', 'istatistik-son': 'istatistik', 'istatistik-ilerleyen': 'istatistik', 'istatistik-kutular': 'istatistik', 'istatistik-karsilastir': 'istatistik',
}
const ARACLAR_SEKMESI = ['soru-ac', 'pomodoro-ac', 'konu-takibi-ac', 'deneme-ac', 'istatistik-ac']
/** Ana turun Harita sekmesinde geçen adımları — iki kitap. */
export const HARITA_TUR_ADIMLARI = ['harita-ders', 'harita-soru']

/**
 * Ana turun adımı hangi sekmede ve ekranda geçiyor. Yalnızca ana tur
 * gezdiriyor; mini turlar bulunulan ekranda kalıyor.
 */
export function tanitimKonumu(adim: TanitimAdimi): TanitimKonumu {
  const ekran = ARAC_EKRANLARI[adim.kimlik]
  if (ekran) return { sekme: 'daha', ekran, denemeFormu: DENEME_FORMU_ADIMLARI.includes(adim.kimlik) }
  if (ARACLAR_SEKMESI.includes(adim.kimlik)) return { sekme: 'daha', ekran: null, denemeFormu: false }
  if (HARITA_TUR_ADIMLARI.includes(adim.kimlik)) return { sekme: 'harita', ekran: null, denemeFormu: false }
  return { sekme: 'ana', ekran: null, denemeFormu: false }
}

export function demoSonucu(demo: DemoVeri) {
  if (demo.sonuc) return demo.sonuc
  return { dogru: 0, yanlis: 0, skor: 0 }
}
