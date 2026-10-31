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

export type Yuva = 'kafa' | 'kulak' | 'yuz' | 'boyun' | 'ayak'

export type EsyaId = 'kep' | 'bere' | 'tac' | 'kulaklik' | 'kalem' | 'gunes' | 'papyon' | 'atki' | 'sigma'

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
   * Bu eşya giyiliyken alttaki Rabi'nin değişen yanı (dosya adı eki). Kepte bir
   * kulak dik, öteki bükük (kullanıcı dört seçenek arasından seçti); Sigma'da
   * yüz ve duruş değişir. İkisi birden giyilince ekler birleşir:
   * `rabi-sigma-kep.png` (`tabanYolu`). Eşya katmanı da bu Rabi'ye göre çizildi.
   */
  taban?: string
  /**
   * Alttaki Rabi değişince bu eşyanın ona göre çizilmiş katmanı: taban eki →
   * katman. Kulağa bağlı kalem kepte kulakla birlikte kayıyor; yoksa kulaktan
   * ayrık dururdu.
   */
  tabanaGore?: Readonly<Record<string, string>>
}

/** Yuva → giyilen eşya. Her yuvada en çok bir eşya: aynı yere iki şapka olmaz. */
export type Giyilenler = Partial<Record<Yuva, EsyaId>>

export const BOS_GIYILENLER: Giyilenler = {}

/** Çıplak Rabi — her zaman en alttaki katman. */
export const CIPLAK_RABI = '/giydir/rabi.png'

/**
 * Listedeki sıra: baştan ayağa, göz yukarıdan aşağı tarıyor.
 *
 * Gözlük (`gozluk`) ve bahçıvan botu (`bot`) kullanıcı kaldırttı (2026-10-31);
 * kayıtta kalan eski seçim `giyilenleriCoz`ta sessizce düşer. Ayak yuvası
 * boş ama tip ve sırada duruyor: ileride ayağa eşya gelirse yeri hazır.
 */
export const ESYALAR: readonly Esya[] = [
  {
    id: 'kep',
    ad: 'Mezuniyet Kepi',
    yuva: 'kafa',
    gorsel: '/giydir/kep.png',
    ikon: '/giydir/kep-ikon.png',
    fiyat: 0,
    taban: 'kep',
  },
  { id: 'bere', ad: 'Bere', yuva: 'kafa', gorsel: '/giydir/bere.png', ikon: '/giydir/bere-ikon.png', fiyat: 0 },
  { id: 'tac', ad: 'Taç', yuva: 'kafa', gorsel: '/giydir/tac.png', ikon: '/giydir/tac-ikon.png', fiyat: 0 },
  { id: 'kulaklik', ad: 'Kulaklık', yuva: 'kafa', gorsel: '/giydir/kulaklik.png', ikon: '/giydir/kulaklik-ikon.png', fiyat: 0 },
  {
    id: 'kalem',
    ad: 'Kulakta Kalem',
    yuva: 'kulak',
    gorsel: '/giydir/kalem.png',
    ikon: '/giydir/kalem-ikon.png',
    fiyat: 0,
    tabanaGore: { kep: '/giydir/kalem-kep.png' },
  },
  { id: 'gunes', ad: 'Güneş Gözlüğü', yuva: 'yuz', gorsel: '/giydir/gunes.png', ikon: '/giydir/gunes-ikon.png', fiyat: 0 },
  { id: 'papyon', ad: 'Papyon', yuva: 'boyun', gorsel: '/giydir/papyon.png', ikon: '/giydir/papyon-ikon.png', fiyat: 0 },
  { id: 'atki', ad: 'Atkı', yuva: 'boyun', gorsel: '/giydir/atki.png', ikon: '/giydir/atki-ikon.png', fiyat: 0 },
  // Sigma paketi (kullanıcı istedi, 2026-10-31): katman altın zincir + "R" kolye;
  // yarı kapalı gözler, çatık/kalkık kaş, sırıtış ve eller belde duruş tabanda.
  // Zincir boyunda olduğu için papyon ve atkıyla aynı yuvada.
  { id: 'sigma', ad: 'Sigma Rabi', yuva: 'boyun', gorsel: '/giydir/sigma.png', ikon: '/giydir/sigma-ikon.png', fiyat: 0, taban: 'sigma' },
]

/**
 * Katmanların alttan üste sırası (çıplak Rabi'nin üstünde).
 *
 * Ayak → boyun → yüz → kulak → kafa. Katmanlar başın çevresinde örtüşür:
 * şapka en üstte (kalemin ucu berenin altına girer, gözlük sapı kepin
 * altında kalır); boyun eşyası çenenin altında, yüzün altında.
 */
export const KATMAN_SIRASI: readonly Yuva[] = ['ayak', 'boyun', 'yuz', 'kulak', 'kafa']

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

/** Taban ekleri (katman sırasıyla) → alttaki Rabi'nin dosyası. Ek yoksa çıplak Rabi. */
export function tabanYolu(ekler: readonly string[]): string {
  return ekler.length === 0 ? CIPLAK_RABI : `/giydir/rabi-${ekler.join('-')}.png`
}

/**
 * Bütün alttaki Rabi dosyaları: her taban ekli eşya için tek başına ve aynı
 * yuvada olmayanlarla birlikte (ön yükleme listesi; render bunların hepsini
 * üretmiş olmalı).
 */
export function tumTabanlar(): string[] {
  const ekli = KATMAN_SIRASI.flatMap((yuva) => ESYALAR.filter((e) => e.yuva === yuva && e.taban))
  const sonuc = new Set<string>([CIPLAK_RABI])
  const gez = (i: number, secilen: Esya[]) => {
    if (i === ekli.length) {
      sonuc.add(tabanYolu(secilen.map((e) => e.taban as string)))
      return
    }
    gez(i + 1, secilen)
    if (!secilen.some((e) => e.yuva === ekli[i].yuva)) gez(i + 1, [...secilen, ekli[i]])
  }
  gez(0, [])
  return [...sonuc]
}

/**
 * Önizlemenin katman dosyaları, alttan üste: önce Rabi, sonra eşyalar.
 *
 * Alttaki Rabi, giyilen eşyaların `taban` eklerinden kurulur (kepte bükük
 * kulak, Sigma'da yüz ve duruş; ikisi birlikte `rabi-sigma-kep.png`).
 */
export function katmanlar(giyilenler: Giyilenler): string[] {
  const giyili = KATMAN_SIRASI.flatMap((yuva) => {
    const id = giyilenler[yuva]
    const esya = id === undefined ? undefined : esyaBul(id)
    // Yuvası tutmayan kayıt (elle kurcalanmış) çizilmiyor: kep ayak katmanına düşmesin.
    return esya && esya.yuva === yuva ? [esya] : []
  })
  const ekler = giyili.flatMap((e) => (e.taban ? [e.taban] : []))
  const gorsel = (e: Esya) => {
    const ek = ekler.find((x) => e.tabanaGore?.[x] !== undefined)
    return ek === undefined ? e.gorsel : (e.tabanaGore?.[ek] ?? e.gorsel)
  }
  return [tabanYolu(ekler), ...giyili.map(gorsel)]
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
