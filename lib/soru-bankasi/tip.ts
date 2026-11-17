import type { Gorsel } from '@/lib/konu/tip'

/*
  Soru Bankası'na özel şekil türleri (fizik).

  Biçim, soru yazan modellerin okuduğu şemayla birebir aynı:
  `soru-bankasi-calisma/gorev/tip-fizik.ts`. Alan adları o dosyadan gelir ve
  değiştirilmez (yazılmış JSON'lar onu kullanıyor); burada yalnız geriye uyumlu,
  isteğe bağlı eklemeler var ve her biri "Ek:" diye işaretli.

  Konu kartlarının `Gorsel` tipine dokunulmuyor: bu türleri yalnız Soru
  Bankası çiziyor (`components/soru-bankasi/soru-sekli.tsx`).
*/

/** Kartezyen [x, y]. Sağa x, yukarı y artar. Açılar +x'ten saat yönünün tersine derece. */
export type Konum = [number, number]
/** [sol, sağ, alt, üst]. İki eksen aynı ölçekle çizilir. */
export type Pencere = [number, number, number, number]
/** Verilen noktaya ortalanan yazı. */
export type Yazi = { konum: Konum; ad: string }

export type DevreElemani = 'tel' | 'direnc' | 'pil' | 'lamba' | 'anahtar' | 'ampermetre' | 'voltmetre' | 'reosta'

export type DevreKolu = {
  /** Tam sayı ızgarada başlangıç düğümü. */
  bas: Konum
  /** Aynı satır ya da sütunda başka bir düğüm. */
  bit: Konum
  eleman: DevreElemani
  /** Elemanın adı (R₁, L, K). */
  ad?: string
  /** Birimli değer; pilde emk ("6 V"). */
  deger?: string
  /** Pilin uzun levhasının (+) baktığı uç; varsayılan `bas`. */
  arti?: 'bas' | 'bit'
  /** Pilin iç direnci, birimli ("1 Ω"). */
  icDirenc?: string
  /** Anahtarın konumu; varsayılan açık. */
  kapali?: boolean
  /** Telin üstünde akım oku; ileri = bas → bit. */
  akim?: { yon: 'ileri' | 'geri'; ad?: string }
}

export type DevreGorseli = {
  tur: 'devre'
  kollar: DevreKolu[]
  /** Adlı ya da işaretli düğüm. Üç ve daha çok kolun birleştiği yere nokta kendiliğinden konur. */
  dugumler?: { konum: Konum; ad?: string }[]
}

export type OptikArac =
  /** Bas → bit doğrultusunun sağ tarafı (aynanın arkası) taranır. */
  | { tur: 'duzlemAyna'; bas: Konum; bit: Konum }
  /**
   * Merkez: ayna tepesi / mercek optik merkezi; boy tam yükseklik; odak pozitif.
   * Ayna `yon`e bakar (varsayılan sol). Asal eksen ve F, M (mercekte iki F) kendiliğinden.
   */
  | { tur: 'cukurAyna' | 'tumsekAyna' | 'inceMercek' | 'kalinMercek'; merkez: Konum; boy: number; odak: number; yon?: 'sol' | 'sag' }
  | { tur: 'prizma'; koseler: [Konum, Konum, Konum] }
  /**
   * İki ortamı ayıran doğru; `normal` normalin sınırdaki ayağı.
   * Ek: `dolgu` hafif boyanan ortamın tarafı (bas → bit yönüne göre); varsayılan `sag`.
   */
  | { tur: 'sinir'; bas: Konum; bit: Konum; normal?: Konum; dolgu?: 'sag' | 'sol' | 'yok' }
  /**
   * Okun ayağı ve ucu. Ek: `sanal` görüntünün kesik çizilmesini zorlar; verilmezse
   * aynanın arkasındaki / mercekte cisimle aynı taraftaki görüntü kesik çizilir.
   */
  | { tur: 'cisim' | 'goruntu'; bas: Konum; bit: Konum; ad?: string; sanal?: boolean }
  /** Gözün bakış yönü (kaynakta ışınların yönü), varsayılan 0°. */
  | { tur: 'kaynak' | 'goz'; konum: Konum; aci?: number }

/** Merkezde bas açısından bit açısına saat yönünün tersine yay. */
export type AciYayi = { merkez: Konum; bas: number; bit: number; ad?: string }

export type OptikGorseli = {
  tur: 'optik'
  pencere: Pencere
  araclar: OptikArac[]
  /** Sıralı yol; her parçada ilerleme oku. Sanal uzantı kesik ve oksuz. */
  isinlar?: { noktalar: Konum[]; kesik?: boolean }[]
  acilar?: AciYayi[]
  etiketler?: Yazi[]
}

export type DuzenekParcasi =
  /** Zemin: sağ tarafı taranır. İp, kap: açık kırık çizgi. Sıvı: kapalı, hafif dolgulu çokgen. */
  | { tur: 'zemin' | 'ip' | 'kap' | 'sivi'; noktalar: Konum[]; ad?: string }
  /** Ölçüler pencere biriminde; açı bloğu merkezi çevresinde döndürür. */
  | { tur: 'blok'; merkez: Konum; en: number; boy: number; aci?: number; ad?: string }
  | { tur: 'makara'; merkez: Konum; yaricap: number; ad?: string }
  | { tur: 'ok'; bas: Konum; bit: Konum; ad?: string }

export type DuzenekGorseli = {
  tur: 'duzenek'
  pencere: Pencere
  parcalar: DuzenekParcasi[]
  etiketler?: Yazi[]
  /** Ek: açı yayı (eğik düzlem açısı, ipin düşeyle yaptığı açı); optikteki gibi. */
  acilar?: AciYayi[]
}

/** Soru Bankası'nda çizilebilen her şekil: konu kartı türleri + fizik türleri. */
export type BankaGorseli = Gorsel | DevreGorseli | OptikGorseli | DuzenekGorseli

/** Soru Bankası'nın yayımlanmış, uygulamada kullanılan soru biçimi. */
export type BankaSorusu = {
  konu: string
  zorluk: 1 | 2 | 3
  soru: string
  onculler?: string[]
  gorsel?: BankaGorseli
  siklar: [string, string, string, string, string]
  dogru: 0 | 1 | 2 | 3 | 4
  cozum: string
}

export type SoruDurumu = '-' | 'd' | 'y'
export type SoruBankasiKaydi = Record<string, string>

/**
 * Bitirilen bir testin son çözüşü. `sure` saniye; `tarih` ISO zaman damgası.
 * Soru sırasına bağlı `SoruBankasiKaydi`ndan ayrı: o ilk cevabı tutar, bu son
 * çözüşün süresini ve sonucunu.
 */
export type TestSonucKaydi = { sure: number; dogru: number; yanlis: number; bos: number; tarih: string }

/** Konu kimliği → test numarası (1'den başlar, ekranda görünen "Test 3") → son sonuç. */
export type SoruBankasiTestleri = Record<string, Record<string, TestSonucKaydi>>

/**
 * Alıştırma: şık seçilince doğru/yanlış ve çözüm hemen görünür.
 * Deneme: cevaplar test bitince toplu değerlendirilir ve kayda o zaman yazılır.
 */
export type CalismaModu = 'alistirma' | 'deneme'
