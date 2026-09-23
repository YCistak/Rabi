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
