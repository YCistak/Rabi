/**
 * Jokerler — tur sırasında harcanan tek kullanımlık yardımlar.
 *
 * Kozmetik eşyalardan iki noktada ayrılıyorlar: **tükeniyorlar** (aynı jokerden
 * birden fazla bulundurulabiliyor) ve oyunun gidişatına dokunuyorlar. Bu yüzden
 * ayrı bir katalogda ve ayrı bir kayıtta duruyorlar — `MagazaDurumu` "hangi eşya
 * senin, hangisi üstünde" sorusunun cevabı; stok bambaşka bir soru.
 *
 * Hiçbir joker doğru cevabı **söylemiyor**. 50/50 iki yanlış şıkkı eliyor,
 * kalanı süreye ve hakka dokunuyor. Cevabı veren bir joker oyunların ölçtüğü
 * şeyi bozardı: rekor da banka da "biliyor muydun" sorusunun cevabı olmaktan
 * çıkardı.
 *
 * Jokerin tur içinde **kullanılması henüz yazılmadı**; burada yalnızca katalog
 * ve stok var. Oyun tarafı geldiğinde `jokerKullan` tek giriş noktası olmalı,
 * yoksa stok birkaç yerden birden eksilir.
 */

export type JokerId = 'elli-elli' | 'sure-dondur' | 'ek-sure' | 'cift-cevap' | 'puan-3x'

/** "+15 sn" jokerinin eklediği süre. Metinlerde de bu sabit yazıyor. */
export const EK_SURE_SANIYE = 15

/** Puan katlayıcının çarpanı. */
export const PUAN_KATSAYISI = 3

export type Joker = {
  id: JokerId
  ad: string
  /** Kutucuktaki emoji — ikon seti yerine, tek bakışta ayrılsınlar diye. */
  simge: string
  /** Tek cümlede ne yaptığı; mağazada adın altında yazıyor. */
  aciklama: string
  /** Havuç cinsinden fiyat. */
  fiyat: number
}

/**
 * Katalog.
 *
 * Fiyat sırası gücü izliyor: turu **kurtaran** joker en pahalı. Bu oyunlarda
 * tek yanlış turu bitirdiği için "çift cevap" tek başına bir tur daha demek;
 * süreye dokunanlar ise yalnızca rahatlatıyor.
 */
export const JOKERLER = [
  {
    id: 'ek-sure',
    ad: 'Ek Süre',
    simge: '⏱️',
    aciklama: `Sayaca ${EK_SURE_SANIYE} saniye ekler.`,
    fiyat: 40,
  },
  {
    id: 'sure-dondur',
    ad: 'Süre Dondurma',
    simge: '❄️',
    aciklama: 'Sayacı o soru boyunca durdurur; acele etmeden düşünürsün.',
    fiyat: 70,
  },
  {
    id: 'elli-elli',
    ad: '50/50',
    simge: '✂️',
    aciklama: 'İki yanlış şıkkı eler. Doğruyu söylemez, sahayı daraltır.',
    fiyat: 90,
  },
  {
    id: 'puan-3x',
    ad: `${PUAN_KATSAYISI}x Puan`,
    simge: '✨',
    aciklama: `Yalnızca o sorunun puanını ${PUAN_KATSAYISI}'e katlar. Bildiğin soruda kullan.`,
    fiyat: 110,
  },
  {
    id: 'cift-cevap',
    ad: 'Çift Cevap',
    simge: '🎯',
    aciklama: 'O soruda ilk yanlışın turu bitirmez; ikinci bir hakkın olur.',
    fiyat: 140,
  },
] as const satisfies readonly Joker[]

/**
 * Bir jokerden çantada tutulabilecek en fazla adet.
 *
 * Sınır olmasaydı havuç biriktiren kullanıcı tek jokerle bütün oyunları
 * baştan sona taşıyabilirdi; ayrıca rozetteki sayı iki basamağı geçince
 * kutucuk dağılıyor.
 */
export const STOK_SINIRI = 9

/** Joker kimliği → çantadaki adet. Hiç yoksa anahtar yok. */
export type JokerStogu = Partial<Record<JokerId, number>>

export const BOS_STOK: JokerStogu = {}

export function jokerBul(id: string): Joker | undefined {
  return JOKERLER.find((j) => j.id === id)
}

/**
 * Kayıttan okunan stoğu kataloga ve sınırlara uydurur.
 *
 * Katalogdan kalkan jokerin kimliği kayıtta kalırsa çizim tarafı boş kutucuk
 * gösterirdi; elle kurcalanmış `localStorage` ise sınırsız stok yazabilirdi.
 * İkisi de burada eleniyor — negatif ve kesirli adetler dahil.
 */
export function stoguNormalize(ham: JokerStogu | undefined): JokerStogu {
  const stok: JokerStogu = {}
  if (!ham || typeof ham !== 'object') return stok
  for (const joker of JOKERLER) {
    const adet = ham[joker.id]
    if (typeof adet !== 'number' || !Number.isFinite(adet)) continue
    const kirpilmis = Math.min(STOK_SINIRI, Math.floor(adet))
    if (kirpilmis > 0) stok[joker.id] = kirpilmis
  }
  return stok
}

export function jokerSayisi(stok: JokerStogu, id: JokerId): number {
  return stok[id] ?? 0
}

/** Çantadaki bütün jokerlerin toplamı — mağaza başlığındaki sayı. */
export function jokerToplami(stok: JokerStogu): number {
  return JOKERLER.reduce((toplam, j) => toplam + jokerSayisi(stok, j.id), 0)
}

export function jokerDoluMu(stok: JokerStogu, joker: Joker): boolean {
  return jokerSayisi(stok, joker.id) >= STOK_SINIRI
}

export function jokerAlinabilirMi(stok: JokerStogu, havuc: number, joker: Joker): boolean {
  return !jokerDoluMu(stok, joker) && havuc >= joker.fiyat
}

/**
 * Satın alma. Yetmiyorsa ya da stok doluysa `null` — çağıran taraf "olmadı"
 * durumunu tek yerden okusun, sessizce hiçbir şey yapılmasın.
 */
export function jokerAl(
  stok: JokerStogu,
  havuc: number,
  joker: Joker,
): { stok: JokerStogu; havuc: number } | null {
  if (!jokerAlinabilirMi(stok, havuc, joker)) return null
  return {
    stok: { ...stok, [joker.id]: jokerSayisi(stok, joker.id) + 1 },
    havuc: havuc - joker.fiyat,
  }
}

/**
 * Bir joker harcar. Stokta yoksa durum değişmiyor.
 *
 * Oyun tarafı henüz bunu çağırmıyor; jokerin **tek** eksilme yolu burası
 * olsun diye şimdiden yazıldı ve test edildi.
 */
export function jokerKullan(stok: JokerStogu, id: JokerId): JokerStogu {
  const kalan = jokerSayisi(stok, id) - 1
  if (kalan < 0) return stok
  const yeni = { ...stok }
  if (kalan === 0) delete yeni[id]
  else yeni[id] = kalan
  return yeni
}
