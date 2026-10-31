/**
 * Rabi'yi Giydir — eşya kataloğu ve giyme kuralları.
 *
 * Önizleme, aynı tuvalde (900×1100, aynı kamera) çizilmiş saydam PNG
 * katmanlarının üst üste dizilmesiyle kuruluyor; her eşyanın dosyası tam tuval
 * olduğu için konum hesabı yok, yalnızca sıra var. Sıra bu yüzden burada,
 * bileşende değil: hangi katmanın üstte kalacağı bir kural, çizimin işi değil.
 *
 * Fiyat alanı duruyor ama hepsi 0 ve harcanacak bir para birimi **yok**:
 * havuç ve mağaza kaldırıldı (`docs/kurallar/basarimlar.md`), harcanabilir
 * ödül veriyi uydurmaya iter. Kullanıcı eşyaları denemek için ücretsiz istedi.
 */

export type Yuva = 'kafa' | 'yuz' | 'ayak'

export type EsyaId = 'kep' | 'gozluk' | 'gunes' | 'bot'

export type Esya = {
  id: EsyaId
  ad: string
  yuva: Yuva
  /** Tam tuval saydam katman (900×1100). */
  gorsel: string
  /** Listedeki küçük önizleme (256×256 saydam). */
  ikon: string
  /** Şimdilik hep 0 — arayüzde "Ücretsiz". */
  fiyat: number
  /**
   * Bu eşya giyiliyken çıplak Rabi yerine alta konan Rabi. Kep takılınca
   * kulaklar yana sarkıyor: dik kulak kepin içinden çıkınca da, kulak hiç
   * olmayınca da kötü duruyordu. Eşya katmanı da bu Rabi'ye göre çizildi.
   */
  taban?: string
}

/** Yuva → giyilen eşya. Her yuvada en çok bir eşya: aynı yere iki şapka olmaz. */
export type Giyilenler = Partial<Record<Yuva, EsyaId>>

export const BOS_GIYILENLER: Giyilenler = {}

/** Çıplak Rabi — her zaman en alttaki katman. */
export const CIPLAK_RABI = '/giydir/rabi.png'

/** Listedeki sıra: baştan ayağa, göz yukarıdan aşağı tarıyor. */
export const ESYALAR: readonly Esya[] = [
  {
    id: 'kep',
    ad: 'Mezuniyet Kepi',
    yuva: 'kafa',
    gorsel: '/giydir/kep.png',
    ikon: '/giydir/kep-ikon.png',
    fiyat: 0,
    taban: '/giydir/rabi-kep.png',
  },
  { id: 'gozluk', ad: 'Gözlük', yuva: 'yuz', gorsel: '/giydir/gozluk.png', ikon: '/giydir/gozluk-ikon.png', fiyat: 0 },
  { id: 'gunes', ad: 'Güneş Gözlüğü', yuva: 'yuz', gorsel: '/giydir/gunes.png', ikon: '/giydir/gunes-ikon.png', fiyat: 0 },
  { id: 'bot', ad: 'Bahçıvan Botu', yuva: 'ayak', gorsel: '/giydir/bot.png', ikon: '/giydir/bot-ikon.png', fiyat: 0 },
]

/**
 * Katmanların alttan üste sırası (çıplak Rabi'nin üstünde).
 *
 * Sıra kullanıcının verdiği: bot → gözlük → kep. Katmanların örtüşebileceği
 * tek yer başın çevresi (gözlüğün sapı ile kepin kenarı); orada kep üstte
 * kalmalı, sap kepin içinden geçiyor gibi görünmesin.
 */
export const KATMAN_SIRASI: readonly Yuva[] = ['ayak', 'yuz', 'kafa']

export function esyaBul(id: string): Esya | undefined {
  return ESYALAR.find((e) => e.id === id)
}

export function giyiliMi(giyilenler: Giyilenler, id: EsyaId): boolean {
  const esya = esyaBul(id)
  return esya !== undefined && giyilenler[esya.yuva] === id
}

/** Eşyayı yuvasına giydirir; yuvada başka eşya varsa onun yerini alır. */
export function giy(giyilenler: Giyilenler, id: EsyaId): Giyilenler {
  const esya = esyaBul(id)
  if (!esya) return giyilenler
  return { ...giyilenler, [esya.yuva]: id }
}

/** Yuvayı boşaltır. */
export function cikar(giyilenler: Giyilenler, yuva: Yuva): Giyilenler {
  if (giyilenler[yuva] === undefined) return giyilenler
  const sonraki = { ...giyilenler }
  delete sonraki[yuva]
  return sonraki
}

/**
 * Eşya kartına dokunuş: giyiliyse çıkarır, değilse giydirir.
 *
 * Ayrı bir "Çıkar" düğmesi yok — kart zaten seçili hâlini gösteriyor, aynı
 * karta ikinci dokunuşun geri alması en kısa yol.
 */
export function dokun(giyilenler: Giyilenler, id: EsyaId): Giyilenler {
  const esya = esyaBul(id)
  if (!esya) return giyilenler
  return giyiliMi(giyilenler, id) ? cikar(giyilenler, esya.yuva) : giy(giyilenler, id)
}

/**
 * Önizlemenin katman dosyaları, alttan üste: önce Rabi, sonra eşyalar.
 *
 * Alttaki Rabi giyilen bir eşyanın `taban`ı olabilir (kepte sarkık kulaklı
 * Rabi); bugün yalnız kepte var, ikisi birden olursa üstteki yuvanınki geçer.
 */
export function katmanlar(giyilenler: Giyilenler): string[] {
  const giyili = KATMAN_SIRASI.flatMap((yuva) => {
    const id = giyilenler[yuva]
    const esya = id === undefined ? undefined : esyaBul(id)
    // Yuvası tutmayan kayıt (elle kurcalanmış) çizilmiyor: kep ayak katmanına düşmesin.
    return esya && esya.yuva === yuva ? [esya] : []
  })
  const taban = giyili.reduce<string>((t, e) => e.taban ?? t, CIPLAK_RABI)
  return [taban, ...giyili.map((e) => e.gorsel)]
}

/**
 * Depodan ya da yedekten gelen kaydı süzer.
 *
 * Kayıt elle kurcalanmış, yarım yazılmış ya da ileride kaldırılmış bir eşyayı
 * gösteriyor olabilir; ekran çökmesin diye yalnızca bilinen yuvadaki, o
 * yuvaya ait bilinen eşyalar geçiyor. Gerisi sessizce düşüyor.
 */
export function giyilenleriCoz(ham: unknown): Giyilenler {
  if (typeof ham !== 'object' || ham === null || Array.isArray(ham)) return {}
  const temiz: Giyilenler = {}
  for (const yuva of KATMAN_SIRASI) {
    const id = (ham as Record<string, unknown>)[yuva]
    if (typeof id !== 'string') continue
    const esya = esyaBul(id)
    if (esya && esya.yuva === yuva) temiz[yuva] = esya.id
  }
  return temiz
}
