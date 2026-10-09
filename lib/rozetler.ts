import type {
  Deneme,
  GunlukKayit,
  KazanilanRozet,
  OyunKayitlari,
  PomodoroSeans,
  Sablon,
  YanlisSoru,
} from './types'
import { enUzunSeri, enUzunYukselis, gunOzeti, haftalikToplamlar } from './hesap'
import { oyunToplami } from './oyunlar/tanim'
import { tariheYaz } from './utils'
import type { KonuIlerlemeleri } from './konu/ilerleme'
import type { OkumaSeansi } from './konu/okuma-suresi'
import type { YksTakip } from './konu-takibi/kayit'
import { BIRLESEN_KONULAR } from './konu-takibi/okul-dersleri'

/**
 * Rozetler — saf mantık.
 *
 * Rozet bir kez kazanılınca kalıcıdır: veri sonradan düşse bile (deneme silinir,
 * not düzeltilir) rozet geri alınmaz. Bunun sebebi rozetin bir ödül olması, anlık
 * bir durum göstergesi değil. Kazanılanlar `rabi-rozetler` altında tarihiyle
 * saklanıyor.
 *
 * ## Ölçü seçiminin kuralı
 *
 * Soru sayıları **elle giriliyor** — Soru Takibi'ne "500" yazıp çıkmak bir
 * saniye sürüyor. Bu yüzden günlük/haftalık rozetler eşiği bir kez aşmayı
 * değil, **kaç ayrı gün/hafta aşıldığını** sayıyor (`olcut` = eşik, `esik` =
 * kaç kez). Bir kez 300 yazmak bedava; on ayrı gün 300 yazmak on gün sürüyor.
 *
 * Aynı sebeple değerli rozetler uydurulamayan ölçülerden geliyor: seri günü,
 * pomodoro dakikası, bankadan düşen soru. Zaman hızlandırılamıyor.
 */

export type RozetTuru =
  | 'seri'
  | 'pomodoro-seans'
  | 'pomodoro-dakika'
  | 'pomodoro-gun'
  | 'gunluk-soru'
  | 'haftalik-soru'
  | 'deneme'
  | 'deneme-yukselis'
  | 'diploma'
  | 'yanlis-ekleme'
  | 'yanlis-cozme'
  | 'banka-dusen'
  | 'banka-temiz'
  | 'oyun-tur'
  | 'oyun-rekor'
  | 'oyun-hatasiz'
  | 'oyun-dogru'
  | 'oyun-seri'
  | 'konu-bitti'
  | 'harita-konu'
  | 'konu-okuma'

/**
 * Rozetin nadirliği. Hepsi aynı görünürken 100 saatlik odak ile ilk pomodoro
 * aynı kutudaydı; kademe bunu ayırıyor — ekranda görsel ağırlık, kutlamada
 * şiddet farkı.
 */
export type RozetKademesi = 'bronz' | 'gumus' | 'altin' | 'efsane'

export type Rozet = {
  id: string
  tur: RozetTuru
  ad: string
  aciklama: string
  /** Kazanmak için ulaşılması gereken değer. */
  esik: number
  /**
   * Tekrar sayan rozetlerde günün/haftanın aşması gereken soru sayısı.
   * `esik` o zaman "kaç kez" anlamına gelir.
   */
  olcut?: number
  kademe: RozetKademesi
  ikon: string
}

export const KADEME_ADI: Record<RozetKademesi, string> = {
  bronz: 'Bronz',
  gumus: 'Gümüş',
  altin: 'Altın',
  efsane: 'Efsane',
}

/** Kademe sıralaması — büyük sayı daha değerli. */
export const KADEME_SIRASI: Record<RozetKademesi, number> = {
  bronz: 0,
  gumus: 1,
  altin: 2,
  efsane: 3,
}

/**
 * Diploma notu rozetleri.
 *
 * İstek "OBP 90 ve 95 üstü" diyordu ama OBP 250–500 aralığında bir sayı; 90/95
 * ancak **diploma notu** ölçeğinde (0–100) anlamlı. Rozet diploma notu üzerine
 * kuruldu, açıklamasında OBP karşılığı da yazıyor (diploma × 5).
 */
export const ROZETLER: Rozet[] = [
  // --- Seri: uygulamanın en değerli ölçüsü ---
  // Otuz günlük seri otuz gün sürer, kısayolu yok. Rozetlerin ağırlık merkezi
  // bilerek burada.
  { id: 'seri-3', tur: 'seri', esik: 3, kademe: 'bronz', ikon: '🌱', ad: 'Üç gün üst üste', aciklama: 'Günlük hedefini üç gün arka arkaya tutturdun' },
  { id: 'seri-7', tur: 'seri', esik: 7, kademe: 'gumus', ikon: '📅', ad: 'Tam bir hafta', aciklama: 'Yedi gün boyunca hedefini hiç kaçırmadın' },
  { id: 'seri-14', tur: 'seri', esik: 14, kademe: 'gumus', ikon: '🗓️', ad: 'İki hafta', aciklama: 'On dört gün arka arkaya hedefindesin' },
  { id: 'seri-30', tur: 'seri', esik: 30, kademe: 'altin', ikon: '🔥', ad: 'Bir ay kesintisiz', aciklama: 'Otuz gün boyunca hedefini hiç kaçırmadın' },
  { id: 'seri-60', tur: 'seri', esik: 60, kademe: 'efsane', ikon: '💫', ad: 'İki ay kesintisiz', aciklama: 'Altmış gün arka arkaya hedefini tutturdun' },

  // --- Pomodoro ---
  // Eşikler dakika cinsinden tutuluyor, açıklamada saat yazıyor: ilerleme çubuğu
  // saat dolmadan da kıpırdasın diye.
  { id: 'pomodoro-ilk', tur: 'pomodoro-seans', esik: 1, kademe: 'bronz', ikon: '🍅', ad: 'İlk pomodoro', aciklama: 'İlk çalışma seansını tamamladın' },
  { id: 'pomodoro-10s', tur: 'pomodoro-dakika', esik: 600, kademe: 'gumus', ikon: '⏳', ad: '10 saat odak', aciklama: 'Pomodoroda toplam 10 saat çalıştın' },
  { id: 'pomodoro-50s', tur: 'pomodoro-dakika', esik: 3000, kademe: 'altin', ikon: '⌛', ad: '50 saat odak', aciklama: 'Pomodoroda toplam 50 saat çalıştın' },
  { id: 'pomodoro-100s', tur: 'pomodoro-dakika', esik: 6000, kademe: 'efsane', ikon: '🏔️', ad: '100 saat odak', aciklama: 'Pomodoroda toplam 100 saat çalıştın' },
  { id: 'pomodoro-gun-8', tur: 'pomodoro-gun', esik: 8, kademe: 'altin', ikon: '🔂', ad: 'Sekiz turluk gün', aciklama: 'Bir günde sekiz pomodoro turu tamamladın' },

  // --- Günlük soru: kaç ayrı gün ---
  { id: 'gun-200-x5', tur: 'gunluk-soru', olcut: 200, esik: 5, kademe: 'bronz', ikon: '☕', ad: 'Beş kez 200', aciklama: 'Beş ayrı gün 200 soruyu geçtin' },
  { id: 'gun-300-x10', tur: 'gunluk-soru', olcut: 300, esik: 10, kademe: 'gumus', ikon: '🔆', ad: 'On kez 300', aciklama: 'On ayrı gün 300 soruyu geçtin' },
  { id: 'gun-400-x10', tur: 'gunluk-soru', olcut: 400, esik: 10, kademe: 'altin', ikon: '⚡', ad: 'On kez 400', aciklama: 'On ayrı gün 400 soruyu geçtin' },
  { id: 'gun-500-x5', tur: 'gunluk-soru', olcut: 500, esik: 5, kademe: 'efsane', ikon: '🚀', ad: 'Beş kez 500', aciklama: 'Beş ayrı gün 500 soruyu geçtin' },

  // --- Haftalık soru: kaç ayrı hafta ---
  // Eski 5000'lik rozet haftada 714 soru/gün demekti; kimsenin ulaşamayacağı
  // rozet motive etmiyor, süs oluyor. Tavan 3500'e indi.
  { id: 'hafta-1500-x4', tur: 'haftalik-soru', olcut: 1500, esik: 4, kademe: 'gumus', ikon: '🥕', ad: 'Dört hafta 1500', aciklama: 'Dört ayrı hafta 1500 soruyu geçtin' },
  { id: 'hafta-2500-x4', tur: 'haftalik-soru', olcut: 2500, esik: 4, kademe: 'altin', ikon: '💪', ad: 'Dört hafta 2500', aciklama: 'Dört ayrı hafta 2500 soruyu geçtin' },
  { id: 'hafta-3500-x2', tur: 'haftalik-soru', olcut: 3500, esik: 2, kademe: 'efsane', ikon: '🏆', ad: 'İki hafta 3500', aciklama: 'İki ayrı hafta 3500 soruyu geçtin' },

  // --- Deneme sayısı ---
  { id: 'deneme-10', tur: 'deneme', esik: 10, kademe: 'bronz', ikon: '📝', ad: 'Isınma turu', aciklama: '10 deneme çözdün' },
  { id: 'deneme-25', tur: 'deneme', esik: 25, kademe: 'gumus', ikon: '📚', ad: 'Alıştın artık', aciklama: '25 deneme çözdün' },
  { id: 'deneme-50', tur: 'deneme', esik: 50, kademe: 'gumus', ikon: '🎯', ad: 'Yarı yol', aciklama: '50 deneme çözdün' },
  { id: 'deneme-100', tur: 'deneme', esik: 100, kademe: 'altin', ikon: '🏅', ad: 'Yüzler kulübü', aciklama: '100 deneme çözdün' },
  { id: 'deneme-200', tur: 'deneme', esik: 200, kademe: 'efsane', ikon: '👑', ad: 'Deneme ustası', aciklama: '200 deneme çözdün' },

  // --- Deneme gelişimi: sayı değil, yön ---
  { id: 'yukselis-3', tur: 'deneme-yukselis', esik: 3, kademe: 'gumus', ikon: '📈', ad: 'Üç deneme yükseliş', aciklama: 'Aynı denemede netin üç kez üst üste yükseldi' },
  { id: 'yukselis-5', tur: 'deneme-yukselis', esik: 5, kademe: 'efsane', ikon: '📊', ad: 'Beş deneme yükseliş', aciklama: 'Aynı denemede netin beş kez üst üste yükseldi' },

  // --- Okul notu ---
  { id: 'diploma-85', tur: 'diploma', esik: 85, kademe: 'bronz', ikon: '🎓', ad: 'Diploma 85+', aciklama: 'Diploma notun 85’i geçti (OBP 425+)' },
  { id: 'diploma-90', tur: 'diploma', esik: 90, kademe: 'altin', ikon: '🌟', ad: 'Diploma 90+', aciklama: 'Diploma notun 90’ı geçti (OBP 450+)' },
  { id: 'diploma-95', tur: 'diploma', esik: 95, kademe: 'efsane', ikon: '🎖️', ad: 'Diploma 95+', aciklama: 'Diploma notun 95’i geçti (OBP 475+)' },

  // --- Yanlış Soru Bankası ---
  // Fotoğraf çekmek yazı yazmaktan zor: bu rozetler elle şişirilemiyor.
  { id: 'yanlis-10', tur: 'yanlis-ekleme', esik: 10, kademe: 'bronz', ikon: '📷', ad: 'On yanlış', aciklama: 'Bankaya 10 yanlış soru ekledin' },
  { id: 'yanlis-50', tur: 'yanlis-ekleme', esik: 50, kademe: 'altin', ikon: '🗂️', ad: 'Elli yanlış', aciklama: 'Bankaya 50 yanlış soru ekledin' },
  { id: 'yanlis-coz-25', tur: 'yanlis-cozme', esik: 25, kademe: 'gumus', ikon: '✅', ad: 'Yirmi beş çözüm', aciklama: 'Bankadaki 25 soruyu çözdüm diye işaretledin' },
  { id: 'yanlis-coz-100', tur: 'yanlis-cozme', esik: 100, kademe: 'efsane', ikon: '🧹', ad: 'Yüz çözüm', aciklama: 'Bankadaki 100 soruyu çözdüm diye işaretledin' },

  // --- Oyun Bankası: karıştırılan sorunun öğrenilmesi ---
  { id: 'banka-1', tur: 'banka-dusen', esik: 1, kademe: 'bronz', ikon: '🎈', ad: 'İlk düşen', aciklama: 'Bir soruyu bankadan düşürdün — genel testte doğru bildin' },
  { id: 'banka-25', tur: 'banka-dusen', esik: 25, kademe: 'altin', ikon: '🧺', ad: 'Yirmi beş düşen', aciklama: 'Oyun Bankası’ndan 25 soru düşürdün' },
  { id: 'banka-temiz', tur: 'banka-temiz', esik: 1, kademe: 'efsane', ikon: '✨', ad: 'Banka tertemiz', aciklama: 'En az 20 soru düşürdükten sonra bankayı tamamen boşalttın' },

  // --- Mini oyunlar ---
  // Oyun mola aktivitesi, ana iş değil: rozetlerin küçük bir azınlığı burada ve
  // hepsi gerçekten zor olanlardan seçildi. Ölçüler tek bir oyuna değil bütün
  // oyunların toplamına bakıyor; yeni oyun eklenince kendiliğinden sayılır.
  { id: 'oyun-tur-50', tur: 'oyun-tur', esik: 50, kademe: 'bronz', ikon: '🎲', ad: '50 tur', aciklama: 'Mini oyunlarda 50 tur oynadın' },
  { id: 'oyun-rekor-25', tur: 'oyun-rekor', esik: 25, kademe: 'gumus', ikon: '📖', ad: 'Tek turda 25', aciklama: 'Bir turda 25 doğru bildin' },
  { id: 'oyun-hatasiz-5', tur: 'oyun-hatasiz', esik: 5, kademe: 'gumus', ikon: '💎', ad: '5 hatasız tur', aciklama: 'Beş turu hiç yanlış yapmadan bitirdin' },
  { id: 'oyun-rekor-40', tur: 'oyun-rekor', esik: 40, kademe: 'altin', ikon: '🧠', ad: 'Tek turda 40', aciklama: 'Bir turda 40 doğru bildin' },
  { id: 'oyun-dogru-1000', tur: 'oyun-dogru', esik: 1000, kademe: 'altin', ikon: '📜', ad: '1000 doğru', aciklama: 'Mini oyunlarda toplam 1000 doğru cevap' },
  { id: 'oyun-seri-25', tur: 'oyun-seri', esik: 25, kademe: 'efsane', ikon: '☄️', ad: '25 seri', aciklama: 'Üst üste 25 doğru cevap verdin' },

  // --- Konu haritası ---
  // Deste ancak kartları tek tek geçilerek biter; okuma süresi de yalnız
  // uygulama öndeyken akar. İkisi de elle yazılamıyor, bu yüzden altına kadar
  // kademe alabiliyor.
  { id: 'harita-10', tur: 'harita-konu', esik: 10, kademe: 'bronz', ikon: '🗺️', ad: 'Haritada on konu', aciklama: 'Haritada 10 konunun kartlarını sonuna kadar okudun' },
  { id: 'harita-50', tur: 'harita-konu', esik: 50, kademe: 'altin', ikon: '🧭', ad: 'Haritada elli konu', aciklama: 'Haritada 50 konunun kartlarını sonuna kadar okudun' },
  { id: 'okuma-10s', tur: 'konu-okuma', esik: 600, kademe: 'gumus', ikon: '📘', ad: '10 saat konu okuma', aciklama: 'Haritada kart okuyarak toplam 10 saat geçirdin' },

  // --- Konu Takibi ---
  // "Bitirdim" tek dokunuşla işaretleniyor; uydurulabilir bir ölçü olduğu
  // için kademe gümüşte kalıyor.
  { id: 'konu-bitti-10', tur: 'konu-bitti', esik: 10, kademe: 'bronz', ikon: '📌', ad: 'On konu bitti', aciklama: 'Konu Takibi’nde 10 konuyu bitirdin' },
  { id: 'konu-bitti-50', tur: 'konu-bitti', esik: 50, kademe: 'gumus', ikon: '🗃️', ad: 'Elli konu bitti', aciklama: 'Konu Takibi’nde 50 konuyu bitirdin' },
]

export const TUR_ADI: Record<RozetTuru, string> = {
  seri: 'Seri',
  'pomodoro-seans': 'Pomodoro',
  'pomodoro-dakika': 'Pomodoro — toplam süre',
  'pomodoro-gun': 'Pomodoro — tek gün',
  'gunluk-soru': 'Günlük soru',
  'haftalik-soru': 'Haftalık soru',
  deneme: 'Deneme',
  'deneme-yukselis': 'Deneme — yükseliş',
  diploma: 'Okul notu',
  'yanlis-ekleme': 'Yanlış Soru Bankası — biriktirme',
  'yanlis-cozme': 'Yanlış Soru Bankası — çözme',
  'banka-dusen': 'Oyun Bankası',
  'banka-temiz': 'Oyun Bankası — temizlik',
  'oyun-tur': 'Mini oyun — oynanan tur',
  'oyun-rekor': 'Mini oyun — tek tur rekoru',
  'oyun-hatasiz': 'Mini oyun — hatasız tur',
  'oyun-dogru': 'Mini oyun — toplam doğru',
  'oyun-seri': 'Mini oyun — ardışık doğru',
  'konu-bitti': 'Konu Takibi — biten konu',
  'harita-konu': 'Konu haritası — okunan deste',
  'konu-okuma': 'Konu haritası — okuma süresi',
}

/**
 * Rozet kontrolünün baktığı özet.
 *
 * Günlük ve haftalık toplamlar sayı olarak değil **liste** olarak duruyor:
 * rozet "kaç ayrı gün eşiği geçtin" diye soruyor, cevabı listeyi süzmek.
 */
export type RozetDurumu = {
  denemeSayisi: number
  denemeYukselisi: number
  diplomaNotu: number | null
  gunToplamlari: number[]
  haftaToplamlari: number[]
  enUzunSeri: number
  pomodoroSeansi: number
  pomodoroDakikasi: number
  pomodoroEnIyiGun: number
  yanlisEklenen: number
  yanlisCozulen: number
  bankaDusen: number
  bankaTemiz: boolean
  oyunTuru: number
  oyunRekoru: number
  oyunHatasiz: number
  oyunDogru: number
  oyunSerisi: number
  konuBitti: number
  haritaKonu: number
  /** Konu kartlarında geçen toplam süre, dakika. */
  konuOkumaDakikasi: number
}

/**
 * Konu Takibi'nde "Bitti" işaretli konu sayısı.
 *
 * Birleşen satır (`BIRLESEN_KONULAR`, ör. TYT + AYT Fonksiyonlar) iki kimliği
 * birlikte yazıyor; ikisi de bitmişse ekranda tek satır, sayımda da tek konu.
 */
export function bitenKonuSayisi(takip: YksTakip): number {
  const bitenler = new Set(
    Object.entries(takip.konular)
      .filter(([, kayit]) => kayit.bitti !== undefined)
      .map(([id]) => id),
  )
  for (const [ilk, ikinci] of BIRLESEN_KONULAR) {
    if (bitenler.has(ilk) && bitenler.has(ikinci)) bitenler.delete(ikinci)
  }
  return bitenler.size
}

export function rozetDurumu({
  denemeler,
  sablonlar = [],
  gunlukKayitlar,
  gunlukHedef = 0,
  diplomaNotu,
  pomodoroGecmis = [],
  yanlisSorular = [],
  oyunlar = {},
  bankaDusen = 0,
  bankaBoyutu = 0,
  yksTakip,
  haritaIlerleme = {},
  okumaGecmisi = [],
}: {
  denemeler: Deneme[]
  sablonlar?: Sablon[]
  gunlukKayitlar: GunlukKayit[]
  gunlukHedef?: number
  diplomaNotu: number | null
  pomodoroGecmis?: PomodoroSeans[]
  yanlisSorular?: YanlisSoru[]
  oyunlar?: OyunKayitlari
  /** Oyun Bankası'ndan şimdiye kadar düşen toplam soru. */
  bankaDusen?: number
  /** Bankada şu an duran soru sayısı. */
  bankaBoyutu?: number
  /** Konu Takibi kaydı (`takibiCoz`dan geçmiş). */
  yksTakip?: YksTakip
  /** Konu haritasının deste kayıtları. */
  haritaIlerleme?: KonuIlerlemeleri
  okumaGecmisi?: OkumaSeansi[]
}): RozetDurumu {
  const oyun = oyunToplami(oyunlar)

  // Bir günde biten tur sayısı: seanslar gün gün toplanıp en yükseği alınıyor.
  // `baslangic` UTC damgası; gün yerel saate çevrilerek bulunuyor. İlk on
  // karakteri okumak Türkiye'de gece 03.00'e kadar başlayan seansları bir
  // önceki güne yazıyordu ve gece yarısını geçen bir çalışma iki güne
  // bölünüp "sekiz turluk gün"e hiç ulaşmıyordu (aylık özet aynı çeviriyi
  // yapıyor, `lib/ozet.ts`).
  const gunlukSeans = new Map<string, number>()
  for (const seans of pomodoroGecmis) {
    const gun = tariheYaz(new Date(seans.baslangic))
    gunlukSeans.set(gun, (gunlukSeans.get(gun) ?? 0) + 1)
  }

  return {
    denemeSayisi: denemeler.length,
    denemeYukselisi: enUzunYukselis(denemeler, sablonlar),
    diplomaNotu,
    gunToplamlari: gunlukKayitlar.map((k) => gunOzeti(k).toplam),
    haftaToplamlari: [...haftalikToplamlar(gunlukKayitlar).values()],
    enUzunSeri: enUzunSeri(gunlukKayitlar, gunlukHedef),
    pomodoroSeansi: pomodoroGecmis.length,
    pomodoroDakikasi: pomodoroGecmis.reduce((t, s) => t + s.dakika, 0),
    pomodoroEnIyiGun: gunlukSeans.size > 0 ? Math.max(...gunlukSeans.values()) : 0,
    yanlisEklenen: yanlisSorular.length,
    yanlisCozulen: yanlisSorular.filter((s) => s.cozuldu).length,
    bankaDusen,
    // "Temizledin" demek için bankanın bir zamanlar dolmuş olması şart; boş bir
    // bankayla hiç oynamamak temizlik sayılmaz.
    bankaTemiz: bankaBoyutu === 0 && bankaDusen >= 20,
    oyunTuru: oyun.oynananTur,
    oyunRekoru: oyun.enIyiDogru,
    oyunHatasiz: oyun.hatasizTur,
    oyunDogru: oyun.toplamDogru,
    oyunSerisi: oyun.enIyiSeri,
    konuBitti: yksTakip ? bitenKonuSayisi(yksTakip) : 0,
    // Deste sonuna kadar okunmuş konular. Yoklama oranı içerik dosyası
    // gerektiriyor (`konuTamam`); rozet bu yüzden yalnız desteye bakıyor ve
    // açıklaması da "kartlarını okudun" diyor, "konuyu bitirdin" değil.
    haritaKonu: Object.values(haritaIlerleme).filter((k) => k?.bitti === true).length,
    // Geçmiş `OKUMA_GECMIS_SINIRI` kadar seans tutuyor; çok eski seanslar
    // düşünce toplam azalabilir ama kazanılmış rozet geri alınmıyor.
    konuOkumaDakikasi: Math.floor(okumaGecmisi.reduce((t, s) => t + s.saniye, 0) / 60),
  }
}

/** Bir rozetin dayandığı ölçüdeki güncel değer. Diploma notu girilmemişse 0. */
export function rozetDegeri(rozet: Rozet, durum: RozetDurumu): number {
  switch (rozet.tur) {
    case 'seri':
      return durum.enUzunSeri
    case 'pomodoro-seans':
      return durum.pomodoroSeansi
    case 'pomodoro-dakika':
      return durum.pomodoroDakikasi
    case 'pomodoro-gun':
      return durum.pomodoroEnIyiGun
    case 'gunluk-soru':
      return durum.gunToplamlari.filter((t) => t >= (rozet.olcut ?? 0)).length
    case 'haftalik-soru':
      return durum.haftaToplamlari.filter((t) => t >= (rozet.olcut ?? 0)).length
    case 'deneme':
      return durum.denemeSayisi
    case 'deneme-yukselis':
      return durum.denemeYukselisi
    case 'diploma':
      return durum.diplomaNotu ?? 0
    case 'yanlis-ekleme':
      return durum.yanlisEklenen
    case 'yanlis-cozme':
      return durum.yanlisCozulen
    case 'banka-dusen':
      return durum.bankaDusen
    case 'banka-temiz':
      return durum.bankaTemiz ? 1 : 0
    case 'oyun-tur':
      return durum.oyunTuru
    case 'oyun-rekor':
      return durum.oyunRekoru
    case 'oyun-hatasiz':
      return durum.oyunHatasiz
    case 'oyun-dogru':
      return durum.oyunDogru
    case 'oyun-seri':
      return durum.oyunSerisi
    case 'konu-bitti':
      return durum.konuBitti
    case 'harita-konu':
      return durum.haritaKonu
    case 'konu-okuma':
      return durum.konuOkumaDakikasi
  }
}

export function hakEdildiMi(rozet: Rozet, durum: RozetDurumu): boolean {
  return rozetDegeri(rozet, durum) >= rozet.esik
}

/** Duruma göre hak edilen bütün rozetler. */
export function hakEdilenler(durum: RozetDurumu): Rozet[] {
  return ROZETLER.filter((r) => hakEdildiMi(r, durum))
}

/**
 * Hak edilmiş ama daha önce kazanılmamış rozetler — kutlama bunlar için çıkar.
 * Boş dizi dönerse yeni bir şey yok.
 */
export function yeniRozetler(durum: RozetDurumu, kazanilmis: KazanilanRozet[]): Rozet[] {
  const varOlan = new Set(kazanilmis.map((k) => k.rozetId))
  return hakEdilenler(durum).filter((r) => !varOlan.has(r.id))
}

/** İki rozetten hangisi daha değerli: önce kademe, eşitse yüksek eşik. */
function ustunMu(aday: Rozet, mevcut: Rozet): boolean {
  const fark = KADEME_SIRASI[aday.kademe] - KADEME_SIRASI[mevcut.kademe]
  return fark !== 0 ? fark > 0 : aday.esik > mevcut.esik
}

/**
 * Aynı anda kazanılan rozetlerden **bildirilecek** olanlar.
 *
 * Bir eşik geçildiğinde altındakiler de birlikte geliyor: kurulumda 97 diploma
 * notu yazan öğrenci diploma-85 (bronz), diploma-90 (altın) ve diploma-95
 * (efsane) rozetlerinin üçünü birden kazanıyor. Üçünü de duyurmak aynı haberi
 * üç kez vermek ve en değerlisini ötekilerin arasında kaybetmek: kullanıcı
 * "Diploma 95+" aldığını biliyorsa "Diploma 85+" bir haber değil.
 *
 * O yüzden her **tür**den yalnızca en değerlisi bildiriliyor. Türler
 * birleştirilmiyor: aynı anda gelen bir seri rozeti ile bir diploma rozeti
 * ayrı iki başarı ve biri ötekinin alt basamağı değil — ikisi de sırayla
 * duyuruluyor.
 *
 * Eleme yalnızca **bildirimde**: `yeniRozetler` hepsini döndürmeye devam
 * ediyor ve hepsi kayda giriyor. Kazanılmış bir rozeti duyurmamak başka,
 * vermemek başka; Başarımlar ekranında üçü de duruyor.
 *
 * Sıra değerliden değersize: kuyruğun ilk bildirimi en değerli olanı olsun.
 */
export function bildirilecekler(yeniler: Rozet[]): Rozet[] {
  const enIyi = new Map<RozetTuru, Rozet>()
  for (const rozet of yeniler) {
    const mevcut = enIyi.get(rozet.tur)
    if (mevcut === undefined || ustunMu(rozet, mevcut)) enIyi.set(rozet.tur, rozet)
  }
  return [...enIyi.values()].sort((a, b) => KADEME_SIRASI[b.kademe] - KADEME_SIRASI[a.kademe])
}

export type RozetIlerlemesi = {
  rozet: Rozet
  kazanildi: boolean
  /** Kazanıldığı tarih ('YYYY-AA-GG'); kazanılmamışsa null. */
  tarih: string | null
  mevcut: number
  oran: number
}

/**
 * Rozet ekranının listesi: kazanılanlar önce (yeniden eskiye), sonra kazanılmamışlar
 * eşiğe yakınlıklarına göre. Yakın olanı üste almak, "şuna az kaldı" hissini veriyor.
 */
export function rozetListesi(
  durum: RozetDurumu,
  kazanilmis: KazanilanRozet[],
): RozetIlerlemesi[] {
  const tarihler = new Map(kazanilmis.map((k) => [k.rozetId, k.tarih]))

  const liste = ROZETLER.map((rozet) => {
    const mevcut = rozetDegeri(rozet, durum)
    const tarih = tarihler.get(rozet.id) ?? null
    return {
      rozet,
      // Kazanılmış olması esas: veri sonradan düşse bile rozet duruyor.
      kazanildi: tarih !== null || hakEdildiMi(rozet, durum),
      tarih,
      mevcut,
      oran: rozet.esik > 0 ? Math.min(1, mevcut / rozet.esik) : 0,
    }
  })

  return liste.sort((a, b) => {
    if (a.kazanildi !== b.kazanildi) return a.kazanildi ? -1 : 1
    if (a.kazanildi) return (b.tarih ?? '').localeCompare(a.tarih ?? '')
    return b.oran - a.oran || a.rozet.esik - b.rozet.esik
  })
}

/** Kazanılan rozetlerin kademe kademe sayımı — rozet ekranının üst özeti. */
export function kademeSayimi(liste: RozetIlerlemesi[]): Record<RozetKademesi, number> {
  const sayim: Record<RozetKademesi, number> = { bronz: 0, gumus: 0, altin: 0, efsane: 0 }
  for (const satir of liste) {
    if (satir.kazanildi) sayim[satir.rozet.kademe]++
  }
  return sayim
}
