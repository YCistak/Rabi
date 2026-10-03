export const ANIMASYON_ANAHTARI = 'rabi_tur_animasyon_ayarlari'

/*
  Kayıtlı ayarın sürümü. Varsayılanlar değişince artırılır.

  Ayarlar `/tanitim-deneyi` sayfasında elle oynanıp kaydediliyor ve gerçek turda
  da kullanılıyor. Eskiden kayıt sürümsüzdü: deney sayfasını bir kez açmış bir
  cihazda o günün değerleri (ör. adımlar arası 450 ms karartmasız bekleme,
  700 ms çerçeve) yeni varsayılanları sonsuza dek eziyordu. Sürümü tutmayan ya
  da eski sürümlü bir kayıt artık yok sayılıyor; kullanıcı yeni varsayılanla
  başlıyor, deney sayfasında yeniden ayarlarsa yeni sürümle kaydediliyor.
*/
export const ANIMASYON_SURUMU = 2

/*
  Süreler ve eğri (ölçümle seçildi, bkz. PR açıklaması):

  - `cerceveMs` 360: spotun bir hedeften ötekine kayması **ve** sayfanın aynı
    anda kaydırılması aynı süre ve eğriyle yürüyor; delik, içerikle birlikte
    hedefin üstüne iniyor. iOS'un yay geçişleri bu bölgede (~350 ms).
  - `balonMs` 320 + `balonGecikmesiMs` 50: balon spotun hemen arkasından gelip
    onunla neredeyse aynı anda (370 ms) duruyor; önce ışık, sonra açıklama.
  - `aydinlatmaMs` 220 / `aydinlatmaGecikmesiMs` 60: turun ilk açılışında ve
    kapanışında karartma ile deliğin solması. Önce zemin kararıyor, delik 60 ms
    sonra aydınlanıyor.
  - Eğri `TANITIM_EGRISI` (aşağıda): hızlı başlayıp uzun ve yumuşak oturan,
    iOS'un sayfa/yaprak geçişlerindeki eğri. Hareketin %80'i ilk ~%40'ta bitiyor,
    yani 360 ms uzun değil, çevik hissediliyor; sonu yay gibi süzülüyor.
*/
export const VARSAYILAN_ANIMASYON = {
  gecisMs: 0,
  cerceveMs: 360,
  aydinlatmaGecikmesiMs: 60,
  aydinlatmaMs: 220,
  balonMs: 320,
  balonGecikmesiMs: 50,
  karartma: 0.68,
}
export type TanitimAnimasyonu = typeof VARSAYILAN_ANIMASYON

/** CSS geçişlerinde ve JS kaydırmasında aynı eğri: [x1, y1, x2, y2]. */
export const TANITIM_EGRISI_NOKTALARI = [0.32, 0.72, 0, 1] as const
export const TANITIM_EGRISI = `cubic-bezier(${TANITIM_EGRISI_NOKTALARI.join(', ')})`

/**
 * CSS `cubic-bezier` ile birebir aynı zamanlama işlevi: 0–1 arası ilerlemeyi
 * eğrideki değere çevirir. Sayfa kaydırması rAF ile bu eğriyle yürütülüyor ki
 * CSS geçişiyle kayan delikle aynı karede aynı yerde olsun.
 */
export function egriDegeri(t: number, [x1, y1, x2, y2]: readonly number[] = TANITIM_EGRISI_NOKTALARI): number {
  if (t <= 0) return 0
  if (t >= 1) return 1
  const bx = (u: number) => 3 * x1 * u * (1 - u) ** 2 + 3 * x2 * u ** 2 * (1 - u) + u ** 3
  const by = (u: number) => 3 * y1 * u * (1 - u) ** 2 + 3 * y2 * u ** 2 * (1 - u) + u ** 3
  // x(u) monoton artan; ikiye bölerek u'yu bul (40 adım ~1e-12 hassasiyet).
  let alt = 0
  let ust = 1
  for (let i = 0; i < 40; i++) {
    const orta = (alt + ust) / 2
    if (bx(orta) < t) alt = orta
    else ust = orta
  }
  return by((alt + ust) / 2)
}

export function animasyonuDogrula(deger: unknown): TanitimAnimasyonu {
  const sonuc = { ...VARSAYILAN_ANIMASYON }
  if (!deger || typeof deger !== 'object') return sonuc
  // Sürümsüz ya da eski sürümlü kayıt: o günün varsayılanları, yenilerini ezmesin.
  if ((deger as Record<string, unknown>).surum !== ANIMASYON_SURUMU) return sonuc
  for (const anahtar of Object.keys(sonuc) as (keyof TanitimAnimasyonu)[]) {
    const sayi = (deger as Record<string, unknown>)[anahtar]
    if (typeof sayi === 'number' && Number.isFinite(sayi)) sonuc[anahtar] = Math.max(0, Math.min(anahtar === 'karartma' ? 0.9 : 3000, sayi))
  }
  return sonuc
}

/** Kaydedilecek biçim: değerler ve sürüm. */
export function animasyonKaydi(deger: TanitimAnimasyonu) {
  return { surum: ANIMASYON_SURUMU, ...deger }
}
