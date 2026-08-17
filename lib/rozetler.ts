import type { Deneme, GunlukKayit, KazanilanRozet, OyunKayitlari } from './types'
import { gunOzeti, haftalikToplamlar } from './hesap'
import { oyunToplami } from './oyunlar/tanim'

/**
 * Rozetler — saf mantık.
 *
 * Rozet bir kez kazanılınca kalıcıdır: veri sonradan düşse bile (deneme silinir,
 * not düzeltilir) rozet geri alınmaz. Bunun sebebi rozetin bir ödül olması, anlık
 * bir durum göstergesi değil; kazanılmış bir şeyin elden gitmesi cezalandırıcı
 * olurdu. Kazanılanlar `rabi-rozetler` altında tarihiyle saklanıyor.
 */

export type RozetTuru =
  | 'deneme'
  | 'diploma'
  | 'gunluk-soru'
  | 'haftalik-soru'
  | 'oyun-tur'
  | 'oyun-rekor'
  | 'oyun-hatasiz'
  | 'oyun-dogru'

export type Rozet = {
  id: string
  tur: RozetTuru
  ad: string
  aciklama: string
  /** Kazanmak için ulaşılması gereken değer. */
  esik: number
  ikon: string
}

/**
 * Diploma notu rozetleri.
 *
 * İstek "OBP 90 ve 95 üstü" diyordu ama OBP 250–500 aralığında bir sayı; 90/95
 * ancak **diploma notu** ölçeğinde (0–100) anlamlı. Rozet diploma notu üzerine
 * kuruldu, açıklamasında OBP karşılığı da yazıyor (diploma × 5).
 */
export const ROZETLER: Rozet[] = [
  // --- Deneme sayısı ---
  { id: 'deneme-10', tur: 'deneme', esik: 10, ikon: '📝', ad: 'Isınma turu', aciklama: '10 deneme çözdün' },
  { id: 'deneme-20', tur: 'deneme', esik: 20, ikon: '📚', ad: 'Alıştın artık', aciklama: '20 deneme çözdün' },
  { id: 'deneme-50', tur: 'deneme', esik: 50, ikon: '🎯', ad: 'Yarı yol', aciklama: '50 deneme çözdün' },
  { id: 'deneme-100', tur: 'deneme', esik: 100, ikon: '🏅', ad: 'Yüzler kulübü', aciklama: '100 deneme çözdün' },
  { id: 'deneme-200', tur: 'deneme', esik: 200, ikon: '👑', ad: 'Deneme ustası', aciklama: '200 deneme çözdün' },

  // --- Diploma notu (OBP karşılığı açıklamada) ---
  { id: 'diploma-90', tur: 'diploma', esik: 90, ikon: '🎓', ad: 'Diploma 90+', aciklama: 'Diploma notun 90’ı geçti (OBP 450+)' },
  { id: 'diploma-95', tur: 'diploma', esik: 95, ikon: '🌟', ad: 'Diploma 95+', aciklama: 'Diploma notun 95’i geçti (OBP 475+)' },

  // --- Günlük soru ---
  { id: 'gun-200', tur: 'gunluk-soru', esik: 200, ikon: '☕', ad: 'Günde 200', aciklama: 'Bir günde 200 soru çözdün' },
  { id: 'gun-300', tur: 'gunluk-soru', esik: 300, ikon: '🔥', ad: 'Günde 300', aciklama: 'Bir günde 300 soru çözdün' },
  { id: 'gun-400', tur: 'gunluk-soru', esik: 400, ikon: '⚡', ad: 'Günde 400', aciklama: 'Bir günde 400 soru çözdün' },
  { id: 'gun-500', tur: 'gunluk-soru', esik: 500, ikon: '🚀', ad: 'Günde 500', aciklama: 'Bir günde 500 soru çözdün' },

  // --- Haftalık soru ---
  { id: 'hafta-1500', tur: 'haftalik-soru', esik: 1500, ikon: '🥕', ad: 'Haftada 1500', aciklama: 'Bir haftada 1500 soru çözdün' },
  { id: 'hafta-2000', tur: 'haftalik-soru', esik: 2000, ikon: '🌿', ad: 'Haftada 2000', aciklama: 'Bir haftada 2000 soru çözdün' },
  { id: 'hafta-2500', tur: 'haftalik-soru', esik: 2500, ikon: '💪', ad: 'Haftada 2500', aciklama: 'Bir haftada 2500 soru çözdün' },
  { id: 'hafta-5000', tur: 'haftalik-soru', esik: 5000, ikon: '🏆', ad: 'Haftada 5000', aciklama: 'Bir haftada 5000 soru çözdün' },

  // --- Mini oyunlar ---
  // Ölçüler tek bir oyuna değil **bütün** mini oyunların toplamına bakıyor;
  // yeni oyun eklendiğinde rozetler kendiliğinden onu da sayar.
  { id: 'oyun-tur-1', tur: 'oyun-tur', esik: 1, ikon: '🎮', ad: 'Oyuna başladın', aciklama: 'İlk mini oyun turunu bitirdin' },
  { id: 'oyun-tur-10', tur: 'oyun-tur', esik: 10, ikon: '🕹️', ad: '10 tur', aciklama: 'Mini oyunlarda 10 tur oynadın' },
  { id: 'oyun-tur-50', tur: 'oyun-tur', esik: 50, ikon: '🎲', ad: '50 tur', aciklama: 'Mini oyunlarda 50 tur oynadın' },

  { id: 'oyun-rekor-15', tur: 'oyun-rekor', esik: 15, ikon: '✏️', ad: 'Tek turda 15', aciklama: 'Bir turda 15 doğru bildin' },
  { id: 'oyun-rekor-25', tur: 'oyun-rekor', esik: 25, ikon: '📖', ad: 'Tek turda 25', aciklama: 'Bir turda 25 doğru bildin' },
  { id: 'oyun-rekor-40', tur: 'oyun-rekor', esik: 40, ikon: '🧠', ad: 'Tek turda 40', aciklama: 'Bir turda 40 doğru bildin' },

  { id: 'oyun-hatasiz-1', tur: 'oyun-hatasiz', esik: 1, ikon: '🎯', ad: 'Hatasız tur', aciklama: 'Bir turu hiç yanlış yapmadan bitirdin' },
  { id: 'oyun-hatasiz-5', tur: 'oyun-hatasiz', esik: 5, ikon: '💎', ad: '5 hatasız tur', aciklama: 'Beş turu hiç yanlış yapmadan bitirdin' },

  { id: 'oyun-dogru-250', tur: 'oyun-dogru', esik: 250, ikon: '🔤', ad: '250 doğru', aciklama: 'Mini oyunlarda toplam 250 doğru cevap' },
  { id: 'oyun-dogru-1000', tur: 'oyun-dogru', esik: 1000, ikon: '📜', ad: '1000 doğru', aciklama: 'Mini oyunlarda toplam 1000 doğru cevap' },
]

export const TUR_ADI: Record<RozetTuru, string> = {
  deneme: 'Deneme',
  diploma: 'Okul notu',
  'gunluk-soru': 'Günlük soru',
  'haftalik-soru': 'Haftalık soru',
  'oyun-tur': 'Mini oyun — oynanan tur',
  'oyun-rekor': 'Mini oyun — tek tur rekoru',
  'oyun-hatasiz': 'Mini oyun — hatasız tur',
  'oyun-dogru': 'Mini oyun — toplam doğru',
}

/**
 * Rozet kontrolünün baktığı özet. Günlük ve haftalık eşiklerde **en iyi** değer
 * kullanılıyor, güncel değil: rozet "bir gün 500 soru çözdün" diyor, "bugün 500
 * soru çözüyorsun" değil.
 */
export type RozetDurumu = {
  denemeSayisi: number
  diplomaNotu: number | null
  enIyiGun: number
  enIyiHafta: number
  oyunTuru: number
  oyunRekoru: number
  oyunHatasiz: number
  oyunDogru: number
}

export function rozetDurumu({
  denemeler,
  gunlukKayitlar,
  diplomaNotu,
  oyunlar = {},
}: {
  denemeler: Deneme[]
  gunlukKayitlar: GunlukKayit[]
  diplomaNotu: number | null
  oyunlar?: OyunKayitlari
}): RozetDurumu {
  const gunler = gunlukKayitlar.map((k) => gunOzeti(k).toplam)
  const haftalar = [...haftalikToplamlar(gunlukKayitlar).values()]
  const oyun = oyunToplami(oyunlar)

  return {
    denemeSayisi: denemeler.length,
    diplomaNotu,
    enIyiGun: gunler.length > 0 ? Math.max(...gunler) : 0,
    enIyiHafta: haftalar.length > 0 ? Math.max(...haftalar) : 0,
    oyunTuru: oyun.oynananTur,
    oyunRekoru: oyun.enIyiDogru,
    oyunHatasiz: oyun.hatasizTur,
    oyunDogru: oyun.toplamDogru,
  }
}

/** Bir rozetin dayandığı ölçüdeki güncel değer. Diploma notu girilmemişse 0. */
export function rozetDegeri(rozet: Rozet, durum: RozetDurumu): number {
  switch (rozet.tur) {
    case 'deneme':
      return durum.denemeSayisi
    case 'diploma':
      return durum.diplomaNotu ?? 0
    case 'gunluk-soru':
      return durum.enIyiGun
    case 'haftalik-soru':
      return durum.enIyiHafta
    case 'oyun-tur':
      return durum.oyunTuru
    case 'oyun-rekor':
      return durum.oyunRekoru
    case 'oyun-hatasiz':
      return durum.oyunHatasiz
    case 'oyun-dogru':
      return durum.oyunDogru
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
