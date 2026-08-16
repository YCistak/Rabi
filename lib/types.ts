// Rabi — veri tipleri
// Tüm veri kullanıcının cihazında durur (localStorage + fotoğraflar için IndexedDB);
// sunucu, hesap, senkronizasyon yoktur.

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

/** Bir dönemin notları. Girilmeyen not null'dır ve ortalamaya katılmaz. */
export type DonemNotlari = {
  yazili1: number | null
  yazili2: number | null
  sozlu1: number | null
  sozlu2: number | null
  /** Yalnızca dersten proje alındıysa girilir. */
  proje: number | null
}

/** Okul dersi. Haftalık ders saati, yıl sonu ortalamasında ağırlık katsayısıdır. */
export type OkulDersi = {
  id: string
  ad: string
  haftalikSaat: number
  /** Bu dersten proje ödevi alındı mı — birden fazla dersten alınabilir. */
  projeVar: boolean
  donem1: DonemNotlari
  donem2: DonemNotlari
}

/** Önceki sınıfların yıl sonu ortalaması — OBP dört yılın ortalamasından çıkar. */
export type GecmisYil = {
  id: string
  sinif: number
  ortalama: number
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
}

// ---------------------------------------------------------------------------
// Pomodoro
// ---------------------------------------------------------------------------

/** Üretilen ortam sesleri (dosyasız) ve gömülü lo-fi parçalar. */
export type SesSecimi =
  | 'yok'
  | 'beyaz-gurultu'
  | 'kahverengi-gurultu'
  | 'yagmur'
  | 'kafe'
  | `lofi:${string}`

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

export type Ayarlar = {
  varsayilanSablonId: string
  /** Bu yılın hangi sınıf olduğu — ilk açılışta sorulur, OBP hesabında kullanılır. */
  buYilSinif: number
  /**
   * `buYilSinif`'in hangi eğitim-öğretim yılına ait olduğu, yılın başladığı
   * takvim yılıyla yazılır (2025-2026 ders yılı → 2025). Yeni ders yılı
   * başladığında sınıf bunun üzerinden kendiliğinden ilerler.
   */
  sinifYili: number
  /** Hedeflenen puan türü — sıralama ekranı ve şablon önerileri buna bakar. */
  puanTuru: PuanTuru
  /** Günlük soru hedefi, ilk açılışta seçilir. */
  gunlukHedef: number
  /** Günlük hatırlatma saati, 0–23. */
  hatirlatmaSaati: number
  bildirimAcik: boolean
  /** İlk açılış kurulumu tamamlandı mı; false ise kurulum ekranı gösterilir. */
  kurulumTamamlandi: boolean
}

/** Yedek dosyasının biçimi. Fotoğraflar boyutu yüzünden yedeğe girmez. */
export type Yedek = {
  uygulama: 'rabi'
  surum: 1
  tarih: string
  denemeler: Deneme[]
  sablonlar: Sablon[]
  okulDersleri: OkulDersi[]
  gecmisYillar: GecmisYil[]
  gunlukKayitlar: GunlukKayit[]
  devamsizlik: Devamsizlik[]
  rozetler: KazanilanRozet[]
  hedef: Hedef | null
  ayarlar: Ayarlar
}
