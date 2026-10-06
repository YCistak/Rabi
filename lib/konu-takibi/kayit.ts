/**
 * Konu Takibi'nin kaydı — saf mantık, React'e ve konu içeriğine bağlı değil.
 *
 * Her YKS konusunun dört aşaması var:
 *
 * - **Haritada çalıştım** — elle işaretlenmiyor, konu haritasının kendi
 *   kaydından (`rabi-konu-ilerleme`) hesaplanıyor (`haritaDurumu`). Elle bir
 *   kutu olsaydı haritayla çelişebilirdi: kartları okumuş öğrenci kutuyu boş,
 *   hiç açmamış öğrenci dolu görebilirdi. Haritada karşılığı olmayan
 *   konularda aşama hiç yok; elle bir "haritada çalıştım" kutusu, olmayan bir
 *   haritayı çalışılmış saymak olurdu.
 * - **Okulda öğrendim** ve **Soru çözdüm** — elle.
 * - **Bitirdim** — ayrı ve ağır bir eylem. Aşamalar sıralı ya da zorunlu
 *   değil: öğrenci bir konuyu dershanede öğrenip yalnızca soru çözmüş
 *   olabilir, bitirdiğine o karar veriyor. Ekran eksik aşamayı hatırlatıyor
 *   ama engellemiyor (`eksikAsamalar`).
 *
 * Kayıtta işaret yerine **gün** duruyor ('YYYY-AA-GG'): bugün yalnızca var/yok
 * olarak okunuyor, ama "bu ay kaç konu bitirdin" gibi bir soru ileride
 * geriye dönük cevaplanabilsin. Konu haritasındaki `bitisTarihi` ile aynı
 * gerekçe.
 */

export type ElleAsama = 'okul' | 'soru'
export type YazilanAlan = ElleAsama | 'bitti'

export type YksKonuKaydi = {
  /** Okulda/derste öğrendiğini işaretlediği gün. */
  okul?: string
  /** Soru çözdüğünü işaretlediği gün. */
  soru?: string
  /** "Bitirdim" dediği gün. */
  bitti?: string
}

/**
 * Depodaki biçim. Sürüm alanı şema değişirse eski kaydı tanıyıp taşımak için:
 * bilinmeyen bir sürüm boş kayıt sayılıyor (`takibiCoz`), yani yeni bir
 * uygulamanın yazdığı kaydı eski sürüm okuyup bozmuyor — yalnızca görmüyor.
 */
export type YksTakip = {
  surum: 1
  konular: Record<string, YksKonuKaydi>
}

export const BOS_TAKIP: YksTakip = { surum: 1, konular: {} }

const GUN = /^\d{4}-\d{2}-\d{2}$/

function gunMu(deger: unknown): deger is string {
  return typeof deger === 'string' && GUN.test(deger)
}

/**
 * Depodan ya da yedekten gelen değeri güvenli bir kayda çevirir.
 *
 * Yalnızca bilinen alanlar ve geçerli günler kalıyor; bozuk bir kayıt
 * ekranı çökertmiyor, boş görünüyor. Listede artık olmayan konu kimlikleri
 * **atılmıyor**: bir konu listeden geçici olarak düşüp geri gelirse
 * öğrencinin işareti yerinde dursun.
 */
export function takibiCoz(ham: unknown): YksTakip {
  if (typeof ham !== 'object' || ham === null) return BOS_TAKIP
  const nesne = ham as Record<string, unknown>
  if (nesne.surum !== 1) return BOS_TAKIP
  if (typeof nesne.konular !== 'object' || nesne.konular === null) return BOS_TAKIP

  const konular: Record<string, YksKonuKaydi> = {}
  for (const [id, kayitHam] of Object.entries(nesne.konular as Record<string, unknown>)) {
    if (typeof kayitHam !== 'object' || kayitHam === null) continue
    const kayit = kayitHam as Record<string, unknown>
    const temiz: YksKonuKaydi = {}
    if (gunMu(kayit.okul)) temiz.okul = kayit.okul
    if (gunMu(kayit.soru)) temiz.soru = kayit.soru
    if (gunMu(kayit.bitti)) temiz.bitti = kayit.bitti
    if (Object.keys(temiz).length > 0) konular[id] = temiz
  }
  return { surum: 1, konular }
}

/**
 * Bir aşamayı işaretler ya da kaldırır.
 *
 * Kaldırılan alan kayıttan silinip boş kalan kayıt da atılıyor: depo yalnızca
 * işaretli konuları taşısın, "hiç dokunulmamış" ile "işaretlenip geri
 * alınmış" ayrı iki hâl olmasın. Zaten işaretli alan yeniden
 * işaretlendiğinde ilk gün korunuyor.
 */
export function asamaYaz(
  takip: YksTakip,
  konuId: string,
  alan: YazilanAlan,
  acik: boolean,
  bugun: string,
): YksTakip {
  const onceki = takip.konular[konuId] ?? {}
  const sonraki: YksKonuKaydi = { ...onceki }
  if (acik) sonraki[alan] = onceki[alan] ?? bugun
  else delete sonraki[alan]

  const konular = { ...takip.konular }
  if (Object.keys(sonraki).length === 0) delete konular[konuId]
  else konular[konuId] = sonraki
  return { surum: 1, konular }
}
