// Rabi — veri tipleri
// Tüm veri kullanıcının cihazında durur (localStorage + fotoğraflar için IndexedDB);
// sunucu, hesap, senkronizasyon yoktur.

import type { BankaKaydi } from './oyunlar/banka'
import type { NotKagidi } from './yapilacaklar'
import type { BilinmeyenKart, KonuIlerlemeleri } from './konu/ilerleme'

// ---------------------------------------------------------------------------
// Deneme
// ---------------------------------------------------------------------------

/**
 * ÖSYM'nin puan hesabında kullandığı test blokları. Deneme şablonundaki her ders
 * bunlardan birine bağlanır; puan hesabı ders adına değil bu koda bakar, böylece
 * kullanıcı dersi yeniden adlandırsa da hesap bozulmaz.
 */
export type OsymTest =
  | 'tyt-turkce'
  | 'tyt-sosyal'
  | 'tyt-mat'
  | 'tyt-fen'
  | 'ayt-mat'
  | 'ayt-fizik'
  | 'ayt-kimya'
  | 'ayt-biyoloji'
  | 'ayt-edebiyat'
  | 'ayt-tarih1'
  | 'ayt-cografya1'
  | 'ayt-tarih2'
  | 'ayt-cografya2'
  | 'ayt-felsefe'
  | 'ayt-din'
  | 'ydt'

export type PuanTuru = 'say' | 'ea' | 'soz' | 'dil'

/** Şablonun hangi sınavı temsil ettiği — sıralama ekranı denemeleri buna göre ayırır. */
export type SablonTuru = 'tyt' | 'ayt' | 'ydt' | 'okul'

/** Bir deneme şablonundaki tek ders. */
export type SablonDers = {
  id: string
  ad: string
  soruSayisi: number
  /**
   * Bu dersin netinin hangi ÖSYM testine sayılacağı. Boşsa ders puana katılmaz
   * (örn. okul denemesindeki, gerçek sınavda karşılığı olmayan bir ders).
   */
  osymTesti?: OsymTest
}

/** Deneme biçimi: hangi dersler, kaçar soru, kaç yanlış bir doğruyu götürüyor. */
export type Sablon = {
  id: string
  ad: string
  tur: SablonTuru
  dersler: SablonDers[]
  /** net = doğru − yanlış / yanlisKatsayi (YKS'de 4) */
  yanlisKatsayi: number
  /** Hazır şablonlar silinemez; kopyalanıp düzenlenebilir. */
  hazir: boolean
}

/** Bir denemede tek dersin sonucu. Boş = soruSayisi − doğru − yanlış. */
export type DersSonuc = {
  dersId: string
  dogru: number
  yanlis: number
}

export type Deneme = {
  id: string
  sablonId: string
  ad: string
  /** 'YYYY-AA-GG' */
  tarih: string
  sonuclar: DersSonuc[]
  not?: string
}

// ---------------------------------------------------------------------------
// Okul notları / OBP
// ---------------------------------------------------------------------------

/**
 * Bir lise yılının başarı ortalaması. OBP dört yılın (9–12) ortalamasından çıkar.
 *
 * Bitmiş yıllar için bu **yıl sonu** notudur. İçinde bulunulan yıl için henüz yıl
 * sonu notu yoktur; oraya **1. dönem sonu** notu yazılır ve yılın tamamı için
 * tahmin olarak kullanılır (`donemSonu` bunu işaretler, arayüz de böyle yazar).
 *
 * Not: ders ders yazılı/sözlü girme sistemi kaldırıldı — kullanıcı zaten karnesindeki
 * tek sayıyı biliyor, on beş dersin notunu tek tek girmek gereksiz emek çıkarıyordu.
 */
export type OkulYili = {
  id: string
  sinif: number
  ortalama: number
  /** Yıl bitmediği için girilen değer 1. dönem sonu notu mu. */
  donemSonu?: boolean
}

// ---------------------------------------------------------------------------
// Soru takibi
// ---------------------------------------------------------------------------

/** Tek bir derste o gün çözülen soruların dökümü. */
export type SoruKaydi = {
  ders: string
  toplam: number
  dogru: number
  yanlis: number
}

/** Bir günün soru kayıtları. `tarih` aynı zamanda listedeki benzersiz anahtardır. */
export type GunlukKayit = {
  /** 'YYYY-AA-GG' */
  tarih: string
  kayitlar: SoruKaydi[]
}

// ---------------------------------------------------------------------------
// Devamsızlık
// ---------------------------------------------------------------------------

export type DevamsizlikTuru = 'ozurlu' | 'ozursuz'

export type Devamsizlik = {
  id: string
  /** 'YYYY-AA-GG' */
  tarih: string
  tur: DevamsizlikTuru
  /** Yarım gün devamsızlıklar 0,5 gün sayılır. */
  yarimGun: boolean
  not?: string
}

// ---------------------------------------------------------------------------
// Yanlış soru bankası
// ---------------------------------------------------------------------------

export type YanlisSoru = {
  id: string
  ders: string
  /** 'YYYY-AA-GG' */
  tarih: string
  /** IndexedDB'deki fotoğraf anahtarı — görüntünün kendisi burada tutulmaz. */
  resimId: string
  konu?: string
  not?: string
  cozuldu: boolean
  /**
   * Sorunun "çözdüm" olarak işaretlendiği gün, 'YYYY-AA-GG'.
   *
   * `cozuldu` tek başına yetmiyordu: haftalık özet "bu hafta bankadan kaç soru
   * çözdün" diye soruyor, bunun cevabı işaretin **ne zaman** konduğuna bağlı.
   * Bu alan eklenmeden önce işaretlenmiş kayıtlarda boş kalır — o sorular
   * hiçbir haftanın sayısına girmez, geçmişe dönük uydurulmuş bir tarihten iyidir.
   */
  cozulmeTarihi?: string
}

// ---------------------------------------------------------------------------
// Pomodoro
// ---------------------------------------------------------------------------

/**
 * Pomodoro sesi. Üretilen ortam sesleri (yağmur, kafe, gürültü) kaldırıldı;
 * eski bir kayıtta kalmışlarsa `lofi:` önekiyle eşleşmedikleri için sessize
 * düşüyorlar — ayrı bir taşıma koduna gerek yok.
 */
export type SesSecimi = 'yok' | `lofi:${string}`

export type PomodoroAyar = {
  /** Dakika cinsinden. */
  calisma: number
  kisaMola: number
  uzunMola: number
  /** Kaç çalışma turundan sonra uzun mola gelsin. */
  turSayisi: number
  ses: SesSecimi
  /** 0–1 arası. */
  sesSeviyesi: number
  /** Çalışma sırasında ekran açık kalsın mı. */
  ekraniAcikTut: boolean
  /** Çalışma turunda seçili uygulamalar engellensin mi. */
  odakKilidi: boolean
  /**
   * Çalışma turunda telefon Rahatsız Etme'ye alınsın mı.
   *
   * Kilitten **ayrı** bir anahtar: ikisi farklı şeyler engelliyor ve aynı anda
   * istenmiyorlar. "Uygulamalar engellensin ama telefon çalabilsin" (nöbetteki
   * öğrenci) ile "telefon sussun ama uygulamalara karışma" (kilit izinlerini
   * vermeyen kullanıcı) ayrı ayrı geçerli tercihler; tek anahtara bağlanınca
   * ikisi de kurulamıyordu.
   */
  rahatsizEtme: boolean
  /** Engellenecek uygulamaların paket adları. */
  kilitliUygulamalar: string[]
  /** Odak kilidi tanıtımı bir kez gösterilir; kullanıcı geçtiyse bir daha sorulmaz. */
  kilitTanitimiGoruldu: boolean
}

export type PomodoroSeans = {
  id: string
  /** ISO zaman damgası. */
  baslangic: string
  /** Tamamlanan çalışma süresi, dakika. */
  dakika: number
  ders?: string
}

// ---------------------------------------------------------------------------
// Mini oyunlar
// ---------------------------------------------------------------------------

/** Mini oyun kimliği. Oyun tanımları `lib/oyunlar/tanim.ts` içinde. */
export type OyunId =
  | 'yazim'
  | 'islem'
  | 'edebiyat'
  | 'ses'
  | 'oge'
  | 'soz'
  | 'bolunme'
  | 'aci'
  | 'ucgen'
  | 'harita'
  | 'iklim'
  | 'izohips'
  | 'antlasma'
  | 'kavram'
  | 'anlatim'
  | 'koklu'
  | 'ortak'
  | 'siniflandirma'
  | 'hucre'
  | 'sirala'
  | 'tuzak'
  | 'periyodik'
  | 'formul'

/**
 * Bir mini oyunun kalıcı istatistiği.
 *
 * Tek tek turlar saklanmıyor, yalnızca özet: yüz turdan sonra bile kayıt bir
 * satır kalıyor ve rozetlerin ihtiyaç duyduğu her ölçü burada mevcut.
 */
export type OyunIstatistigi = {
  /** Tek turda çıkarılan en yüksek doğru sayısı — oyunun rekoru. */
  enIyiDogru: number
  /** Şimdiye kadarki en uzun ardışık doğru dizisi. */
  enIyiSeri: number
  oynananTur: number
  toplamDogru: number
  toplamYanlis: number
  /** Hiç yanlış yapılmadan bitirilen tur sayısı. */
  hatasizTur: number
  /** Son oynama tarihi, 'YYYY-AA-GG'. */
  sonTarih: string
}

/** Bütün oyunların istatistikleri, oyun kimliğine göre. */
export type OyunKayitlari = Partial<Record<OyunId, OyunIstatistigi>>

/**
 * Oynanan tek bir tur.
 *
 * `OyunIstatistigi` her şeyi toplayarak tuttuğu için "bu hafta oyunda ne kadar
 * vakit geçirdin" sorusuna cevap veremiyordu — haftalık özet bunu istiyor.
 * Turlar bu yüzden ayrıca, tarihiyle birlikte tutuluyor.
 *
 * Liste `OYUN_GECMIS_SINIRI` kadar tutuluyor; eskiler düşüyor. Haftalık özet
 * yalnızca son haftaya bakıyor, sınırsız büyütmek localStorage kotasını
 * gereksiz yere yiyor.
 */
export type OyunTurKaydi = {
  /** 'YYYY-AA-GG' */
  tarih: string
  oyun: OyunId
  /** Turda geçen süre, saniye. Erken çıkılırsa turun tamamı sayılmaz. */
  saniye: number
  dogru: number
  /**
   * Turdaki yanlış sayısı ve turun hatasız bitip bitmediği.
   *
   * İkisi de sonradan eklendi ve **isteğe bağlı**: haftalık özetin oyun kartı
   * isabet oranı ("%89") ve hatasız tur sayısı istiyor, ikisi de doğru sayısı
   * tek başınayken hesaplanamıyordu. Eski kayıtlarda yoklar — o turlar isabet
   * hesabına hiç girmiyor; sıfır saymak, hatasız oynanmış eski turları %100
   * isabetli gösterirdi.
   */
  yanlis?: number
  hatasiz?: boolean
}

// ---------------------------------------------------------------------------
// Hedef ve rozetler
// ---------------------------------------------------------------------------

export type Hedef = {
  universite: string
  bolum: string
  puanTuru: PuanTuru
  tabanPuan: number | null
  basariSirasi: number | null
}

export type KazanilanRozet = {
  rozetId: string
  /** 'YYYY-AA-GG' */
  tarih: string
}

// ---------------------------------------------------------------------------
// Ayarlar ve yedek
// ---------------------------------------------------------------------------

/**
 * Oyun müziği seçimi.
 *
 * `'mod'` eskiden `'sakin'`di ve tek bir pad'i anlatıyordu; artık her tur modu
 * kendi parçasını çalıyor (`lib/oyunlar/mod-muzigi.ts`) ve Rahat modun parçası
 * o eski pad. Kayıttaki `'sakin'` değeri `ayarlariNormalize` içinde `'mod'`a
 * çevriliyor — eski kurulumlar ayarlarını kaybetmesin.
 */
export type OyunMuzikTuru = 'mod' | 'lofi'

export type Ayarlar = {
  varsayilanSablonId: string
  /**
   * Kullanıcının adı — kurulumun ilk adımında sorulur, boş bırakılabilir.
   *
   * Yalnızca selamlamada kullanılıyor; boşken selamlama adsız hâline düşüyor
   * ("Merhaba 👋"). Hesaba, sıralamaya, hiçbir yere girmiyor ve cihazdan
   * çıkmıyor. Ayarlar'dan değiştirilebilir.
   */
  ad: string
  /**
   * Bu yılın hangi sınıf olduğu — ilk açılışta sorulur, OBP hesabında kullanılır.
   * Mezun için `MEZUN` (13); ayrı bir bayrak yok (bkz. `lib/hesap.ts`).
   */
  buYilSinif: number
  /**
   * Mezunun elle girdiği OBP (250–500), yoksa `null`.
   *
   * Girildiğinde yıl ortalamalarından hesaplanan tahminin önüne geçiyor. Yalnız
   * mezuna sorulur: okuyan öğrencinin OBP'si zaten kesin değil.
   */
  elleObp: number | null
  /**
   * `buYilSinif`'in hangi eğitim-öğretim yılına ait olduğu, yılın başladığı
   * takvim yılıyla yazılır (2025-2026 ders yılı → 2025). Yeni ders yılı
   * başladığında sınıf bunun üzerinden kendiliğinden ilerler.
   */
  sinifYili: number
  /**
   * Öğrencinin kendi alanı — sıralama ekranı, şablon önerileri ve hedef
   * listesinin süzgeci buna bakar.
   *
   * `null` "karar vermedim" demek ve bir varsayılanla doldurulmuyor. Kurulumda
   * bir alan **seçilmiş gibi** kaydetmek, sıralama ekranında hiç seçilmemiş bir
   * türe göre hesaplanmış bir sayı göstermek olurdu; o sayı da tahmin değil
   * uydurma olurdu. Kararsızken sıralama hesaplanmıyor, hedef listesi de
   * süzülmüyor.
   */
  puanTuru: PuanTuru | null
  /** Günlük soru hedefi, ilk açılışta seçilir. */
  gunlukHedef: number
  /** Günlük hatırlatma saati, 0–23. */
  hatirlatmaSaati: number
  /** Hatırlatma dakikası, 0–59. Kullanıcı "21.30" gibi bir saat seçebiliyor. */
  hatirlatmaDakikasi: number
  bildirimAcik: boolean
  /** Mini oyunlarda doğru/yanlış/bitiş ses efektleri. */
  oyunSesi: boolean
  /** Mini oyunlarda arkada müzik çalsın mı. Sesten ayrı: biri kapalı, öteki açık olabilir. */
  oyunMuzigi: boolean
  /**
   * Hangi müzik: `sakin` koddan üretilen yumuşak pad, `lofi` pomodoro'nun
   * parçaları. Zevk meselesi olduğu için seçim kullanıcıda.
   */
  oyunMuzikTuru: OyunMuzikTuru
  /** İlk açılış kurulumu tamamlandı mı; false ise kurulum ekranı gösterilir. */
  kurulumTamamlandi: boolean
}

/**
 * Yedek dosyasının biçimi.
 *
 * Fotoğraflar `resimler` alanına **isteğe bağlı** giriyor: dosyayı onlarca MB
 * yapıyorlar, ama en zor yerine konan veri de onlar (elinde artık olmayan bir
 * denemenin sorusunu yeniden fotoğraflayamazsın). Seçimi kullanıcı yapıyor.
 *
 * `yanlisSorular` kayıtları her zaman yedekte; geri yüklemede fotoğrafı
 * bulunmayanlar eleniyor, yoksa görüntüsüz kartlar kalırdı.
 */
export type Yedek = {
  uygulama: 'rabi'
  surum: 1
  tarih: string
  denemeler: Deneme[]
  sablonlar: Sablon[]
  okulYillari: OkulYili[]
  gunlukKayitlar: GunlukKayit[]
  devamsizlik: Devamsizlik[]
  yanlisSorular: YanlisSoru[]
  rozetler: KazanilanRozet[]
  oyunlar: OyunKayitlari
  oyunGecmisi: OyunTurKaydi[]
  /**
   * Oyun Bankası. Eski yedeklerde yok — geri yüklemede boş dizi sayılıyor,
   * yoksa yedek geri alınca banka `undefined` olur ve ekran çöker.
   */
  oyunBankasi?: BankaKaydi[]
  /** Oyun Bankası'ndan düşen toplam soru sayısı. */
  bankaDusen?: number
  /**
   * Yapılacaklar tahtası. Eski yedeklerde yok — geri yüklemede yazılmıyor,
   * kullanıcının mevcut kâğıtları olduğu gibi kalıyor.
   *
   * Oyun modu burada **yok**: o veri değil, bu cihazdaki tercih.
   */
  notlar?: NotKagidi[]
  /**
   * Konu Anlatımı: hangi konuların destesi bitirildi ve "bilmiyorum" denen
   * kartlar. Eski yedeklerde yok — geri yüklemede yazılmıyor, kullanıcının
   * mevcut kaydına dokunulmuyor.
   *
   * Seçili ders/sınıf burada **yok**: o veri değil, bu cihazdaki tercih.
   */
  konuIlerleme?: KonuIlerlemeleri
  bilinmeyenKartlar?: BilinmeyenKart[]
  pomodoroGecmis: PomodoroSeans[]
  /**
   * Pomodoro ayarı. Eski yedeklerde yok — o zaman geri yüklemede yazılmıyor,
   * kullanıcının mevcut ayarı olduğu gibi kalıyor. Kilitli uygulama listesi de
   * burada; telefon değiştiren kullanıcı seçimini yeniden yapmak zorunda kalmasın.
   */
  pomodoroAyar?: PomodoroAyar
  hedef: Hedef | null
  ayarlar: Ayarlar
  /** Fotoğraf kimliği → `data:` adresi. Fotoğrafsız yedekte alan hiç yok. */
  resimler?: Record<string, string>
}
