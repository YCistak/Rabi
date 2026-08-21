import { ESYALAR, KATEGORILER, esyaBul, type Esya, type EsyaKategorisi } from './esyalar'

/**
 * Havuç Mağazası'nın saf mantığı: neyin alınabildiği, neyin giyildiği.
 *
 * React'e bağlı hiçbir şey yok; ekran yalnızca çiziyor. Havuç kazanma
 * mekaniği henüz yazılmadı — bakiye tek bir sayı olarak duruyor ve bu dosya
 * onu yalnızca **eksiltiyor**. Kazanma tarafı geldiğinde artırma da buradan
 * geçmeli ki bakiye tek bir yerden değişsin.
 */

/**
 * Kullanıcının mağaza durumu.
 *
 * `giyilen` kategori başına tek kimlik: iki şapka aynı anda takılamaz ve
 * hangisinin üstte kalacağını belirlemek gerekmiyor. Bir kategoriden hiçbir şey
 * giyilmiyorsa anahtar hiç yok — `undefined` ile boş dize arasındaki farkı
 * kovalamak yerine.
 */
export type MagazaDurumu = {
  /** Satın alınan eşyaların kimlikleri. */
  sahipOlunan: string[]
  /** Kategori → o kategoride giyilen eşyanın kimliği. */
  giyilen: Partial<Record<EsyaKategorisi, string>>
}

export const BOS_MAGAZA: MagazaDurumu = { sahipOlunan: [], giyilen: {} }

/** Yeni kullanıcının başlangıç havucu — mağazayı boş bir vitrin gibi görmesin diye. */
export const BASLANGIC_HAVUCU = 250

/**
 * Kayıttan okunan durumu güncel katalogla uyumlu hâle getirir.
 *
 * Gerekli, çünkü katalog değişiyor: kaldırılan bir eşyanın kimliği kayıtta
 * kalırsa `esyaBul` `undefined` döner ve çizim çöker. Sahip olunmadan giyilmiş
 * görünen bir kayıt da eleniyor — elle kurcalanmış `localStorage` ile
 * mağazayı atlamanın yolu kapansın.
 */
export function magazayiNormalize(ham: Partial<MagazaDurumu> | undefined): MagazaDurumu {
  const sahipOlunan = (Array.isArray(ham?.sahipOlunan) ? ham.sahipOlunan : []).filter(
    (id): id is string => typeof id === 'string' && esyaBul(id) !== undefined,
  )
  const benzersiz = [...new Set(sahipOlunan)]

  const giyilen: MagazaDurumu['giyilen'] = {}
  const hamGiyilen = ham?.giyilen ?? {}
  for (const kategori of KATEGORILER) {
    const id = hamGiyilen[kategori]
    if (typeof id !== 'string') continue
    const esya = esyaBul(id)
    if (!esya || esya.kategori !== kategori || !benzersiz.includes(id)) continue
    giyilen[kategori] = id
  }

  return { sahipOlunan: benzersiz, giyilen }
}

export function sahipMi(durum: MagazaDurumu, esya: Esya): boolean {
  return durum.sahipOlunan.includes(esya.id)
}

export function giyiliMi(durum: MagazaDurumu, esya: Esya): boolean {
  return durum.giyilen[esya.kategori] === esya.id
}

/** Bir kategoride şu an giyilen eşya; hiçbiri giyilmiyorsa `undefined`. */
export function kategorideGiyilen(
  durum: MagazaDurumu,
  kategori: EsyaKategorisi,
): Esya | undefined {
  const id = durum.giyilen[kategori]
  return id === undefined ? undefined : esyaBul(id)
}

/** Giyilen bütün eşyalar — tavşanı çizen bileşen bunu istiyor. */
export function giyilenler(durum: MagazaDurumu): Esya[] {
  return KATEGORILER.map((k) => kategorideGiyilen(durum, k)).filter(
    (e): e is Esya => e !== undefined,
  )
}

export function satinAlinabilirMi(durum: MagazaDurumu, havuc: number, esya: Esya): boolean {
  return !sahipMi(durum, esya) && havuc >= esya.fiyat
}

/**
 * Satın alma. Yetmiyorsa `null` — çağıran taraf hata durumunu tek yerden
 * okusun, "sessizce hiçbir şey yapma" olmasın.
 *
 * Alınan eşya doğrudan giyiliyor: kullanıcı zaten üstünde denemek için aldı,
 * ayrıca bir "giy" dokunuşu istemek gereksiz bir adım olurdu.
 */
export function satinAl(
  durum: MagazaDurumu,
  havuc: number,
  esya: Esya,
): { durum: MagazaDurumu; havuc: number } | null {
  if (!satinAlinabilirMi(durum, havuc, esya)) return null
  const alinmis: MagazaDurumu = {
    sahipOlunan: [...durum.sahipOlunan, esya.id],
    giyilen: { ...durum.giyilen, [esya.kategori]: esya.id },
  }
  return { durum: alinmis, havuc: havuc - esya.fiyat }
}

/**
 * Giyme/çıkarma — aynı eşyaya ikinci dokunuş çıkarıyor.
 *
 * Ayrı bir "çıkar" düğmesi yok: kategoriden yalnızca bir eşya giyilebildiği
 * için dokunuşun anlamı zaten belirsiz değil ve tek dokunuşla denemek,
 * mağazada gezerken çok daha akıcı.
 */
export function giydir(durum: MagazaDurumu, esya: Esya): MagazaDurumu {
  if (!sahipMi(durum, esya)) return durum
  const giyilen = { ...durum.giyilen }
  if (giyilen[esya.kategori] === esya.id) delete giyilen[esya.kategori]
  else giyilen[esya.kategori] = esya.id
  return { ...durum, giyilen }
}

/** Bütün eşyaları çıkarır — "sıfırla" düğmesi için. */
export function hepsiniCikar(durum: MagazaDurumu): MagazaDurumu {
  return { ...durum, giyilen: {} }
}

/** Kaç eşyaya sahip olunduğu / toplam — mağaza başlığındaki ilerleme. */
export function koleksiyonOrani(durum: MagazaDurumu): { sahip: number; toplam: number } {
  return { sahip: durum.sahipOlunan.length, toplam: ESYALAR.length }
}
