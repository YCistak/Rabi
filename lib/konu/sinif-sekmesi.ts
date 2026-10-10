import { HARITA_SINIFLARI, dersBul, programBul, sinifDersleri, type HaritaSinifi } from './index'
import { dersOrani, type KonuIlerlemeleri } from './ilerleme'
import type { KonuDersId } from './tip'

/**
 * Haritanın sınıf sekmesi — saf mantık.
 *
 * Sınıf bir süre "Çalıştığın program" kartında, "Değiştir" ile açılan gizli
 * bir seçicideydi. Kullanıcı değerlendirmesinde başka sınıfın haritasına
 * geçilebildiği hiç fark edilmedi; Konu Takibi'nden gelen yönlendirme sınıfı
 * kendiliğinden değiştirince de nerede olunduğu anlaşılmıyordu. Sekme artık
 * patikanın hemen üstünde ve her zaman görünüyor; her sekmede seçili dersin o
 * sınıftaki ilerlemesi yazıyor.
 */

export type SinifSekmesi = {
  sinif: HaritaSinifi
  /**
   * Seçili dersin o sınıftaki tamamlanma yüzdesi (0–100). Ders o sınıfta
   * yoksa ya da sınıfın içeriği yazılmadıysa `null`.
   */
  yuzde: number | null
  /** İçeriği olmayan sınıf (12): seçimde listelenmiyor. */
  pasif: boolean
  /** Kullanıcının kendi sınıfı — küçük "sen" işareti. */
  sen: boolean
}

/**
 * Haritanın açılacağı sınıf.
 *
 * 12. sınıfın haritası yazılmadı; 12. sınıf öğrencisi boş bir "yapım
 * aşamasında" kartına açılmasın diye bir alt sınıfa, içeriği olan en büyük
 * sınıfa düşüyor. "Sen" işareti yine 12'de duruyor. Mezunda `null`.
 */
export function haritaAcilisSinifi(kullaniciSinifi: HaritaSinifi | null): HaritaSinifi | null {
  if (kullaniciSinifi === null) return null
  if (!sinifPasifMi(kullaniciSinifi)) return kullaniciSinifi
  return [...HARITA_SINIFLARI].reverse().find((s) => !sinifPasifMi(s)) ?? null
}

/** Sınıfın hiçbir dersi yazılmamışsa pasif. Kartlar yazılınca kendiliğinden açılıyor. */
export function sinifPasifMi(sinif: HaritaSinifi): boolean {
  return sinifDersleri(sinif).length === 0
}

/** Seçili dersin bir sınıftaki tamamlanma yüzdesi; ders o sınıfta yoksa `null`. */
export function sinifYuzdesi(
  ders: KonuDersId,
  sinif: HaritaSinifi,
  ilerlemeler: KonuIlerlemeleri,
): number | null {
  const program = programBul(ders, sinif)
  if (program === null) return null
  const { biten, toplam } = dersOrani(program, ilerlemeler)
  if (toplam === 0) return null
  return Math.round((biten / toplam) * 100)
}

/** Sekmenin dört düğmesi, `HARITA_SINIFLARI` sırasıyla. */
export function sinifSekmeleri(
  ders: KonuDersId,
  ilerlemeler: KonuIlerlemeleri,
  kullaniciSinifi: HaritaSinifi | null,
): SinifSekmesi[] {
  return HARITA_SINIFLARI.map((sinif) => ({
    sinif,
    yuzde: sinifYuzdesi(ders, sinif, ilerlemeler),
    pasif: sinifPasifMi(sinif),
    sen: sinif === kullaniciSinifi,
  }))
}

/**
 * Görünen ders adı. Haritada `turkce` her sınıfta okuldaki adıyla, Türk Dili ve
 * Edebiyatı olarak anılıyor (kullanıcı istedi, 2026-10): lisede "Türkçe" diye
 * bir ders yok. Kimlik `turkce` kalıyor — kayıtlar ona bağlı.
 */
export function haritaDersAdi(ders: KonuDersId): string {
  return ders === 'turkce' ? 'Türk Dili ve Edebiyatı' : dersBul(ders).ad
}

/**
 * Sınıf değişince seçim.
 *
 * Ders yeni sınıfta varsa kalıyor. Yoksa sınıfın ilk dersine geçiliyor ve
 * bunu söyleyen kısa bir bilgi dönüyor: bir süre sessizce geçiliyordu ve
 * İngilizce'den 9. sınıfa geçen kullanıcı neden Matematik'e düştüğünü
 * anlamıyordu. Pasif sınıfa geçilmiyor (`null`).
 */
export function sinifDegisimi(
  secim: { ders: KonuDersId; sinif: HaritaSinifi },
  yeniSinif: HaritaSinifi,
): { secim: { ders: KonuDersId; sinif: HaritaSinifi }; bilgi: string | null } | null {
  if (sinifPasifMi(yeniSinif)) return null
  if (programBul(secim.ders, yeniSinif)) return { secim: { ders: secim.ders, sinif: yeniSinif }, bilgi: null }
  const yeniDers = sinifDersleri(yeniSinif)[0].id
  return {
    secim: { ders: yeniDers, sinif: yeniSinif },
    bilgi: `${haritaDersAdi(secim.ders)} ${yeniSinif}. sınıfta yok; ${haritaDersAdi(yeniDers)} açıldı.`,
  }
}

/**
 * Konu Takibi'nden gelen yönlendirmenin şeridi.
 *
 * Yönlendirme sınıfı kendiliğinden değiştiriyor (11. sınıf öğrencisi TYT
 * trigonometrisi için 10. sınıfa). Kendi sınıfından farklıysa patikanın
 * üstünde bunu söyleyen kapatılabilir ince bir şerit çıkıyor; aynıysa ya da
 * öğrencinin tek bir sınıfı yoksa (mezun) şerit yok.
 */
export function yonlendirmeMetni(
  konuAdi: string,
  hedefSinif: HaritaSinifi,
  kullaniciSinifi: HaritaSinifi | null,
): string | null {
  const kendi = haritaAcilisSinifi(kullaniciSinifi)
  if (kendi === null || kendi === hedefSinif) return null
  return `${konuAdi} için ${hedefSinif}. sınıfa geçildi`
}

/**
 * Seçim penceresindeki sınıf hücresinin yüzdesi: o sınıftaki bütün derslerin
 * ilerlemesinin ortalaması. Pencerede henüz ders seçilmemiş oluyor (sınıfa
 * basmak dersi değiştirmiyor, yalnız listeyi), o yüzden tek dersin değil
 * sınıfın durumu yazıyor. İçeriği olmayan sınıfta `null`.
 */
export function sinifOrtalamasi(sinif: HaritaSinifi, ilerlemeler: KonuIlerlemeleri): number | null {
  const yuzdeler = sinifDersleri(sinif)
    .map((d) => sinifYuzdesi(d.id, sinif, ilerlemeler))
    .filter((y): y is number => y !== null)
  if (yuzdeler.length === 0) return null
  return Math.round(yuzdeler.reduce((a, b) => a + b, 0) / yuzdeler.length)
}

/**
 * Pencerede başka bir sınıfa bakılırken seçili ders o sınıfta yoksa bunu
 * söyleyen satır. Liste o sınıfın dersleriyle değiştiği için seçili ders
 * işaretsiz kalıyor; satır olmasa ders sessizce kaybolmuş gibi görünürdü.
 */
export function pencereBilgisi(
  secim: { ders: KonuDersId; sinif: HaritaSinifi },
  bakilanSinif: HaritaSinifi,
): string | null {
  if (bakilanSinif === secim.sinif || sinifPasifMi(bakilanSinif)) return null
  if (programBul(secim.ders, bakilanSinif)) return null
  return `${haritaDersAdi(secim.ders)} ${bakilanSinif}. sınıfta yok, başka bir ders seç.`
}
