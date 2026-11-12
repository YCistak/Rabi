/**
 * Test süresi — saf hesap. Süre soru soru biriktirilir: test sonunda "en çok
 * vakit alan sorular" bu yüzden ayrıca ölçülmeden çıkar. Sayaç yalnız
 * çalışırken bir başlangıç damgası tutar; her duraklama, soru değişimi ve
 * okuma o ana kadar geçeni aktif soruya yazar. Saat geri giderse (cihaz saati
 * değişti) geçen süre eksiye düşmez.
 */
export type SureSayaci = {
  /** Soru başına birikmiş milisaniye. */
  soruSureleri: number[]
  aktif: number
  /** Çalışıyorsa son yazımın zamanı; duraklatılmışsa null. */
  baslangic: number | null
}

export function sayacKur(soruSayisi: number, simdi: number, aktif = 0, birikmisSure = 0): SureSayaci {
  const soruSureleri = Array.from({ length: soruSayisi }, () => 0)
  // Yarım testte yalnız toplam süre kalıcıdır; ayrıntılı soru dağılımı
  // oturumluk olduğu için birikeni devam edilen ilk soruda taşırız.
  soruSureleri[aktif] = Math.max(0, birikmisSure)
  return { soruSureleri, aktif, baslangic: simdi }
}

/** Çalışan sayacın o ana kadar geçenini aktif soruya yazar. */
function isle(sayac: SureSayaci, simdi: number): SureSayaci {
  if (sayac.baslangic === null) return sayac
  const gecen = Math.max(0, simdi - sayac.baslangic)
  const soruSureleri = sayac.soruSureleri.slice()
  soruSureleri[sayac.aktif] = (soruSureleri[sayac.aktif] ?? 0) + gecen
  return { ...sayac, soruSureleri, baslangic: simdi }
}

export function sayacDuraklat(sayac: SureSayaci, simdi: number): SureSayaci {
  if (sayac.baslangic === null) return sayac
  return { ...isle(sayac, simdi), baslangic: null }
}

export function sayacSurdur(sayac: SureSayaci, simdi: number): SureSayaci {
  return sayac.baslangic === null ? { ...sayac, baslangic: simdi } : sayac
}

export function sayacSoruDegistir(sayac: SureSayaci, sira: number, simdi: number): SureSayaci {
  if (sira === sayac.aktif) return sayac
  return { ...isle(sayac, simdi), aktif: sira }
}

/** Soru başına süreler, çalışan parça dahil. */
export function anlikSoruSureleri(sayac: SureSayaci, simdi: number): number[] {
  return isle(sayac, simdi).soruSureleri
}

export function toplamSure(sayac: SureSayaci, simdi: number): number {
  return anlikSoruSureleri(sayac, simdi).reduce((toplam, sure) => toplam + sure, 0)
}

export type SureOzeti = {
  toplam: number
  /** Testteki soru sayısına bölünür (boş bırakılan da süre harcatır). */
  ortalama: number
  /** En çok vakit alan (en çok) üç soru, büyükten küçüğe; hiç bakılmayan soru girmez. */
  enUzun: { sira: number; sure: number }[]
}

export function sureOzeti(soruSureleri: readonly number[]): SureOzeti {
  const toplam = soruSureleri.reduce((sonuc, sure) => sonuc + sure, 0)
  const enUzun = soruSureleri
    .map((sure, sira) => ({ sira, sure }))
    .filter((deger) => deger.sure >= 1000)
    .sort((a, b) => b.sure - a.sure || a.sira - b.sira)
    .slice(0, 3)
  return { toplam, ortalama: soruSureleri.length === 0 ? 0 : toplam / soruSureleri.length, enUzun }
}

/** Sayaç yazısı: "4:07", bir saati geçince "1:04:07". */
export function sayacYazisi(ms: number): string {
  const saniye = Math.max(0, Math.floor(ms / 1000))
  const saat = Math.floor(saniye / 3600)
  const dakika = Math.floor((saniye % 3600) / 60)
  const sn = String(saniye % 60).padStart(2, '0')
  return saat > 0 ? `${saat}:${String(dakika).padStart(2, '0')}:${sn}` : `${dakika}:${sn}`
}

/** Uzun süre yazısı: "8 dk 12 sn", "45 sn", "1 sa 4 dk". */
export function sureYazisi(ms: number): string {
  const saniye = Math.max(0, Math.round(ms / 1000))
  if (saniye < 60) return `${saniye} sn`
  const dakika = Math.floor(saniye / 60)
  if (dakika >= 60) return `${Math.floor(dakika / 60)} sa ${dakika % 60} dk`
  const kalan = saniye % 60
  return kalan === 0 ? `${dakika} dk` : `${dakika} dk ${kalan} sn`
}

/** Kartlardaki kısa süre: "8 dk"; bir dakikadan azı "1 dk"ya yuvarlanmaz, "<1 dk" yazılır. */
export function kisaSureYazisi(saniye: number): string {
  if (saniye < 60) return '<1 dk'
  const dakika = Math.round(saniye / 60)
  return dakika >= 60 ? `${Math.floor(dakika / 60)} sa ${dakika % 60} dk` : `${dakika} dk`
}
