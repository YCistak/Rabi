/**
 * Yanlış soru fotoğrafının üstüne çizim — saf hesaplar.
 *
 * Çizgiler piksel değil **oran** olarak tutuluyor (0–1, fotoğrafın kendi
 * kutusuna göre): aynı çizim telefonda küçük, kaydedilirken fotoğrafın asıl
 * çözünürlüğünde yeniden kuruluyor ve ekran döndüğünde kaymıyor. Kalınlık da
 * fotoğraf genişliğinin oranı, yoksa büyük çözünürlükte kaydedilen çizgi
 * ekranda görünenden incecik çıkardı.
 */

export type CizimAraci = 'kalem' | 'silgi'

export type Cizgi = {
  arac: CizimAraci
  renk: string
  /** Fotoğraf genişliğine oran. */
  kalinlik: number
  /** [x, y] çiftleri; fotoğrafın içi 0–1, dışına taşan uç bu aralığın dışında. */
  noktalar: [number, number][]
}

export type Kutu = { x: number; y: number; genislik: number; yukseklik: number }

/**
 * Fotoğrafın kutunun içinde kapladığı dikdörtgen — `object-contain`in hesabı.
 * Çizim yüzeyi tam bu dikdörtgene oturuyor; fotoğrafın altında ve üstünde
 * kalan siyah boşluk yüzeyin dışında olduğu için oraya çizilemiyor.
 *
 * Küçük fotoğraf büyütülmüyor (ölçek en fazla 1): görüntüleyici önceden
 * `max-w-full max-h-full` ile öyle çiziyordu.
 */
export function fotografKutusu(
  kutuGenislik: number,
  kutuYukseklik: number,
  resimGenislik: number,
  resimYukseklik: number,
): Kutu {
  if (resimGenislik <= 0 || resimYukseklik <= 0 || kutuGenislik <= 0 || kutuYukseklik <= 0) {
    return { x: 0, y: 0, genislik: 0, yukseklik: 0 }
  }
  const olcek = Math.min(1, kutuGenislik / resimGenislik, kutuYukseklik / resimYukseklik)
  const genislik = resimGenislik * olcek
  const yukseklik = resimYukseklik * olcek
  return {
    x: (kutuGenislik - genislik) / 2,
    y: (kutuYukseklik - yukseklik) / 2,
    genislik,
    yukseklik,
  }
}

/**
 * Ekrandaki noktayı fotoğrafa oranlar. Dışarı taşan nokta **kısılmıyor**
 * (0'ın altı, 1'in üstü kalıyor): kısılsaydı fotoğraftan çıkan parmak
 * fotoğrafın kenarı boyunca bir çizgi sürüklerdi. Taşan parçayı tuvalin
 * kendisi kesiyor, fotoğrafın dışına hiçbir şey çizilmiyor.
 */
export function oranla(x: number, y: number, kutu: Kutu): [number, number] {
  return [(x - kutu.x) / kutu.genislik, (y - kutu.y) / kutu.yukseklik]
}

/**
 * Kaydedilen çizimin ölçüsü: fotoğrafın asıl boyu, uzun kenarı `enFazla`da
 * kırpılmış. Çizim fotoğrafla aynı en-boy oranında olmalı ki küçük karede
 * `object-cover` ikisini aynı yerden kırpsın.
 */
export function kayitOlcusu(
  genislik: number,
  yukseklik: number,
  enFazla = 1600,
): { genislik: number; yukseklik: number } {
  const olcek = Math.min(1, enFazla / Math.max(genislik, yukseklik))
  return {
    genislik: Math.max(1, Math.round(genislik * olcek)),
    yukseklik: Math.max(1, Math.round(yukseklik * olcek)),
  }
}

/**
 * Çizimin depo anahtarı. Fotoğrafla aynı IndexedDB deposunda, fotoğrafın
 * anahtarından türeyerek duruyor: kayda yeni bir alan eklenmedi, o yüzden
 * eski yedekler ve kayıt doğrulaması olduğu gibi çalışıyor. Fotoğraf
 * silinirken çizim de bu anahtarla siliniyor.
 */
export function cizimAnahtari(resimId: string): string {
  return `${resimId}-cizim`
}

/**
 * Kalınlık tek bir çubukla seçiliyor, üç sabit seçenekle değil: ince bir
 * cevap yazısıyla kalın bir altı çizme arasında üç basamak yetmiyordu.
 * Çubuk doğrusal değil karesel: ince uçta küçük farklar önemli, kalın uçta
 * değil — doğrusal çubukta ince kalemler çubuğun dibine sıkışıyordu.
 *
 * Değer fotoğrafın **yakınlaştırılmamış** genişliğine oran, yani ekrandaki
 * kalınlık; yakınlaştırınca kalem ekranda aynı boyda kalıyor (bkz.
 * `cizgiKalinligi`).
 */
export const KALINLIK_EN_AZ = 0.003
export const KALINLIK_EN_COK = 0.06

export function kalinlikDegeri(oran: number): number {
  const t = Math.min(1, Math.max(0, oran))
  return KALINLIK_EN_AZ + t * t * (KALINLIK_EN_COK - KALINLIK_EN_AZ)
}

export function kalinlikOrani(kalinlik: number): number {
  const t = (kalinlik - KALINLIK_EN_AZ) / (KALINLIK_EN_COK - KALINLIK_EN_AZ)
  return Math.sqrt(Math.min(1, Math.max(0, t)))
}

/**
 * Kaydedilen çizginin kalınlığı. Yakınlaştırılmışken çizilen çizgi fotoğrafa
 * göre inceliyor: yakınlaştırmanın sebebi ince iş, ekranda aynı boyda duran
 * kalem fotoğrafta o kadar ince iz bırakmalı.
 */
export function cizgiKalinligi(ekrandaki: number, olcek: number): number {
  return ekrandaki / olcek
}

/**
 * Yakınlaştırma: fotoğraf kendi kutusunun **içinde** büyüyor, kutu
 * büyümüyor. Kaydırma kutu boyuna oran (`x`, `y` ≤ 0): pencere boyu
 * değişince yakınlaştırılan yer kaymasın.
 */
export type Yakinlik = { olcek: number; x: number; y: number }

export const YAKINLIK_YOK: Yakinlik = { olcek: 1, x: 0, y: 0 }
export const YAKINLIK_ADIMLARI = [1, 1.5, 2, 3, 4] as const

/** Fotoğrafın kenarı kutunun içine girmesin — boşluk görünmesin. */
export function yakinlikSinirla(y: Yakinlik): Yakinlik {
  const alt = 1 - y.olcek
  const sinirla = (d: number) => Math.min(0, Math.max(alt, d))
  return { olcek: y.olcek, x: sinirla(y.x), y: sinirla(y.y) }
}

/**
 * Bir basamak yaklaştırır ya da uzaklaştırır; kutunun ortasındaki nokta
 * yerinde kalıyor. Köşeye sabitlenseydi her basamakta bakılan yer kaçardı.
 */
export function yakinlastir(y: Yakinlik, yon: 1 | -1): Yakinlik {
  const sira = YAKINLIK_ADIMLARI.findIndex((a) => a >= y.olcek - 1e-9)
  const hedef = YAKINLIK_ADIMLARI[Math.min(YAKINLIK_ADIMLARI.length - 1, Math.max(0, sira + yon))]
  const oran = hedef / y.olcek
  return yakinlikSinirla({
    olcek: hedef,
    x: 0.5 - (0.5 - y.x) * oran,
    y: 0.5 - (0.5 - y.y) * oran,
  })
}

/** Kaydırma; fark kutu boyuna oran. */
export function yakinlikKaydir(y: Yakinlik, dx: number, dy: number): Yakinlik {
  return yakinlikSinirla({ ...y, x: y.x + dx, y: y.y + dy })
}
