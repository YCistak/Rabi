/**
 * Seviye ve havuç ekonomisi — saf mantık.
 *
 * Seviye **türetilmiş** bir sayı: her açılışta mevcut veriden yeniden
 * hesaplanıyor, ayrı bir XP sayacı birikmiyor. Sebebi geriye dönük çalışması:
 * aylardır veri girmiş bir kullanıcı sistemi ilk gördüğünde 1. seviyede değil,
 * hak ettiği seviyede başlıyor. Birikimli bir sayaç bunu yapamazdı.
 *
 * Türetilmiş olmanın bedeli, verinin küçülebilmesi (deneme silinir, not
 * düzeltilir). Bunun için `rabi-seviye` altında **ulaşılan en yüksek seviye**
 * duruyor ve gösterilen seviye asla onun altına inmiyor — rozetin "bir kez
 * kazanılınca geri alınmaz" kuralının buradaki karşılığı. Aynı kayıt aynı
 * zamanda "ödülü verilmiş seviye" demek; iki kez havuç dağıtılmasını da o
 * engelliyor.
 *
 * ## Ölçü seçiminin kuralı
 *
 * `lib/rozetler.ts` ile aynı: soru sayısı elle giriliyor, Soru Takibi'ne "500"
 * yazıp çıkmak bir saniye sürüyor. Bu yüzden soru XP'sinin **iki** tavanı var —
 * günlük olan tek bir günü, ömür boyu olan ise yılları koruyor. İkisi birden
 * olmasaydı her gün rakam yazarak tavan seviyeye çıkmak mümkün olurdu.
 *
 * Zaman isteyen ölçülerde (pomodoro dakikası, seri günü, bankadan düşen soru)
 * tavan yok; onları hızlandırmanın yolu yok, seviyenin omurgası da onlar.
 *
 * Oyun XP'sinin de ayrı bir toplam tavanı var: oyun mola aktivitesi, seviyenin
 * ana yolu değil. Tavansız bırakılsaydı tek gecede yüz tur atıp seviye
 * kasmak mümkün olurdu.
 */

/**
 * XP'nin hesabına giren ölçüler.
 *
 * Alan adları `RozetDurumu` ile bilerek aynı: rozet kontrolü bu değerleri zaten
 * hesaplıyor, seviye de aynı nesneyi olduğu gibi alabiliyor. Yine de buradan
 * `lib/rozetler.ts`'e bağımlılık yok — iki sistem birbirinden bağımsız kalsın.
 */
export type XpGirdisi = {
  /** Her günün toplam soru sayısı. Gün gün duruyor çünkü tavan günlük. */
  gunToplamlari: number[]
  pomodoroDakikasi: number
  denemeSayisi: number
  /** Oyun Bankası'ndan düşen toplam soru. */
  bankaDusen: number
  enUzunSeri: number
  oyunTuru: number
  oyunDogru: number
}

/**
 * XP oranları ve tavanlar.
 *
 * Dengenin tamamı bu nesnede: bir sayıyı değiştirmek bütün ekonomiyi kaydırır,
 * başka hiçbir yere dokunmak gerekmez.
 */
export const XP = {
  /** Soru başına. Günlük tavana kadar. */
  soru: 1,
  /**
   * Bir günden sayılabilecek en fazla soru.
   *
   * Varsayılan günlük hedefle aynı sayı: hedefini tutturan biri gününün
   * tamamını saydırıyor, üstüne yazılan rakam ise seviyeye dokunmuyor.
   */
  gunlukSoruTavani: 200,
  /**
   * Soru XP'sinin ömür boyu tavanı — üç yüz dolu günün karşılığı.
   *
   * Günlük tavan tek bir günü koruyor, bu ikinci tavan yılları koruyor: her
   * gün uygulamayı açıp rakam yazan biri de bir yerde duruyor ve üst seviyeler
   * ancak zaman isteyen ölçülerle açılıyor.
   */
  soruTavani: 60000,
  /** Pomodoro dakikası başına. Tavan yok: zaman hızlandırılamıyor. */
  pomodoroDakika: 3,
  /** Girilen deneme başına. */
  deneme: 150,
  /** Bankadan düşen soru başına — en zor uydurulan ölçü, en yüksek oran. */
  bankaDusen: 40,
  /** En uzun serinin her günü. */
  seriGunu: 25,
  /** Tamamlanan tur başına. */
  oyunTuru: 15,
  /** Turdaki doğru cevap başına. */
  oyunDogru: 1,
  /** Oyundan gelebilecek en fazla XP — oyun ana yol olmasın diye. */
  oyunTavani: 15000,
} as const

/** Seviye tavanı. Buraya varmak bir eğitim yılı boyu düzenli çalışmak demek. */
export const EN_YUKSEK_SEVIYE = 50

/** 1 → 2 için gereken XP. */
const SEVIYE_TABANI = 200
/** Her seviyede gerekenin ne kadar arttığı. */
const SEVIYE_ARTISI = 100

/**
 * Yeni kullanıcının başlangıç havucu.
 *
 * Mağaza ilk açıldığında ölü bir vitrin olmasın diye var; en ucuz jokere
 * yetiyor, ikincisine yetmiyor. Gerisi seviyeden geliyor.
 */
export const BASLANGIC_HAVUCU = 100

/** Seviye ödülünün tabanı ve seviye başına artışı. */
const ODUL_TABANI = 50
const ODUL_ARTISI = 6

export type SeviyeDurumu = {
  seviye: number
  toplamXp: number
  /** Bu seviyede biriken XP. */
  buSeviyeXp: number
  /** Bir sonraki seviye için bu seviyede gereken toplam XP. */
  sonrakiIcinXp: number
  /** İlerleme çubuğu, 0–1. Tavandaki seviyede 1. */
  oran: number
  /** Tavana ulaşıldıysa `sonrakiIcinXp` anlamsız — çubuk dolu kalır. */
  tavandaMi: boolean
}

/** `seviye` → `seviye + 1` için gereken XP. */
export function gerekenXp(seviye: number): number {
  return SEVIYE_TABANI + SEVIYE_ARTISI * (seviye - 1)
}

/** Bir seviyede **olmak** için gereken toplam XP. 1. seviye için 0. */
export function esikXp(seviye: number): number {
  const adet = Math.max(0, seviye - 1)
  // Üçgensel toplam: her adım bir öncekinden SEVIYE_ARTISI kadar uzun.
  return SEVIYE_TABANI * adet + (SEVIYE_ARTISI * adet * (adet - 1)) / 2
}

/**
 * XP toplamı.
 *
 * Tavanlar burada uygulanıyor, oranların çarpıldığı yerde: çağıran tarafın
 * "acaba tavanı uyguladım mı" diye düşünmesi gerekmesin.
 */
export function toplamXp(girdi: XpGirdisi): number {
  const soru = Math.min(
    XP.soruTavani,
    girdi.gunToplamlari.reduce(
      (t, gun) => t + Math.min(Math.max(0, gun), XP.gunlukSoruTavani) * XP.soru,
      0,
    ),
  )
  const oyun = Math.min(
    XP.oyunTavani,
    Math.max(0, girdi.oyunTuru) * XP.oyunTuru + Math.max(0, girdi.oyunDogru) * XP.oyunDogru,
  )

  return Math.floor(
    soru +
      oyun +
      Math.max(0, girdi.pomodoroDakikasi) * XP.pomodoroDakika +
      Math.max(0, girdi.denemeSayisi) * XP.deneme +
      Math.max(0, girdi.bankaDusen) * XP.bankaDusen +
      Math.max(0, girdi.enUzunSeri) * XP.seriGunu,
  )
}

/**
 * XP'den seviye.
 *
 * Kapalı formül yerine döngü: eşik eğrisi değiştiğinde formülü yeniden türetmek
 * gerekmiyor ve elli adım hiçbir yerde ölçülebilir bir maliyet değil.
 */
export function seviyeHesapla(xp: number): SeviyeDurumu {
  const toplam = Math.max(0, Math.floor(xp))

  let seviye = 1
  while (seviye < EN_YUKSEK_SEVIYE && toplam >= esikXp(seviye + 1)) seviye++

  const tavandaMi = seviye >= EN_YUKSEK_SEVIYE
  const taban = esikXp(seviye)
  const sonrakiIcinXp = tavandaMi ? 0 : gerekenXp(seviye)
  const buSeviyeXp = tavandaMi ? 0 : toplam - taban

  return {
    seviye,
    toplamXp: toplam,
    buSeviyeXp,
    sonrakiIcinXp,
    oran: tavandaMi ? 1 : Math.min(1, buSeviyeXp / sonrakiIcinXp),
    tavandaMi,
  }
}

/** Kestirme: girdiden doğrudan seviye durumu. */
export function seviyeDurumu(girdi: XpGirdisi): SeviyeDurumu {
  return seviyeHesapla(toplamXp(girdi))
}

/**
 * Türetilen durumu daha önce ulaşılmış seviyenin altına düşürmez.
 *
 * Veri küçülebiliyor — deneme silinir, not düzeltilir, banka boşaltılır. Seviye
 * ise rozet gibi: bir kez ulaşıldıysa geri alınmıyor. Böyle bir durumda sonraki
 * eşik gösterilmiyor (`sonrakiIcinXp` sıfır); kullanıcı o seviyeyi zaten
 * tamamlamış, eksilen şey verisi.
 */
export function tabanla(durum: SeviyeDurumu, taban: number): SeviyeDurumu {
  if (durum.seviye >= taban) return durum
  return {
    ...durum,
    seviye: Math.min(taban, EN_YUKSEK_SEVIYE),
    buSeviyeXp: 0,
    sonrakiIcinXp: 0,
    oran: 1,
  }
}

/**
 * Bir seviyeye **ulaşınca** verilen havuç. 1. seviye başlangıç, ödülü yok.
 *
 * Artan ödül, artan eşikle birlikte gidiyor: 40. seviye 4. seviyeden çok daha
 * uzun sürdüğü için karşılığı da büyük olmalı, yoksa üst seviyeler ödülsüz bir
 * merdivene döner.
 */
export function seviyeOdulu(seviye: number): number {
  if (seviye <= 1 || seviye > EN_YUKSEK_SEVIYE) return 0
  return ODUL_TABANI + ODUL_ARTISI * seviye
}

/**
 * `onceki`den `yeni`ye çıkarken biriken toplam havuç.
 *
 * Aralık olarak hesaplanıyor çünkü tek seferde birden fazla seviye atlanabiliyor:
 * sistemi ilk gören eski kullanıcı doğrudan 12. seviyede başlıyor ve arada
 * kalan bütün ödülleri hak ediyor.
 */
export function birikenOdul(onceki: number, yeni: number): number {
  let toplam = 0
  for (let s = Math.max(2, onceki + 1); s <= yeni; s++) toplam += seviyeOdulu(s)
  return toplam
}

/** Şimdiye kadar dağıtılabilecek toplam havuç — ekonominin tavanı. */
export const TOPLAM_HAVUC = BASLANGIC_HAVUCU + birikenOdul(1, EN_YUKSEK_SEVIYE)

/**
 * Seviye ünvanları.
 *
 * Sayının yanında bir sıfat olması, "37" ile "38" arasındaki farkı
 * hissettiriyor; tek başına sayı bir süre sonra okunmaz oluyor.
 */
const UNVANLAR: readonly { enAz: number; ad: string }[] = [
  { enAz: 40, ad: 'Bilge' },
  { enAz: 30, ad: 'Usta' },
  { enAz: 20, ad: 'Kalfa' },
  { enAz: 10, ad: 'Çırak' },
  { enAz: 1, ad: 'Fidan' },
]

export function seviyeUnvani(seviye: number): string {
  return UNVANLAR.find((u) => seviye >= u.enAz)?.ad ?? 'Fidan'
}
