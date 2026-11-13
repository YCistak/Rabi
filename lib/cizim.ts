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
/**
 * Yakınlık da kalınlık gibi dikey bir çubukla seçiliyor, +/− basamaklarıyla
 * değil: iki araç aynı biçimde durunca ikincisi öğretilmeden anlaşılıyor.
 * Çubuk logaritmik: %100→%200 ile %200→%400 aynı mesafe, göz de büyümeyi
 * oranla algılıyor — doğrusal çubukta ilk iki kat çubuğun dibine sıkışırdı.
 */
export const YAKINLIK_EN_COK = 4

/** Çubuğun dibine yakın bırakılan değer tam %100'e oturuyor. */
const SIGDIRMA_PAYI = 0.03

export function yakinlikDegeri(oran: number): number {
  const t = Math.min(1, Math.max(0, oran))
  const olcek = YAKINLIK_EN_COK ** t
  return olcek < 1 + SIGDIRMA_PAYI ? 1 : olcek
}

export function yakinlikOrani(olcek: number): number {
  return Math.min(1, Math.max(0, Math.log(olcek) / Math.log(YAKINLIK_EN_COK)))
}

/** Fotoğrafın kenarı kutunun içine girmesin — boşluk görünmesin. */
export function yakinlikSinirla(y: Yakinlik): Yakinlik {
  const alt = 1 - y.olcek
  const sinirla = (d: number) => Math.min(0, Math.max(alt, d))
  return { olcek: y.olcek, x: sinirla(y.x), y: sinirla(y.y) }
}

/**
 * Ölçeği değiştirir; kutunun ortasındaki nokta yerinde kalıyor. Köşeye
 * sabitlenseydi çubuk kaydıkça bakılan yer kaçardı.
 */
export function yakinlikAyarla(y: Yakinlik, olcek: number): Yakinlik {
  const hedef = Math.min(YAKINLIK_EN_COK, Math.max(1, olcek))
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

export type ParmakCifti = { ilk: [number, number]; ikinci: [number, number] }

export const DOKUNUS_HAREKET_ESIGI = 8
export const DOKUNUS_SURE_ESIGI = 300

/** Kısa, hareketsiz dokunuş çizim değil alttaki denetimin tıklamasıdır. */
export function tikMi(
  baslangic: { x: number; y: number; zaman: number },
  bitis: { x: number; y: number; zaman: number },
): boolean {
  return Math.hypot(bitis.x - baslangic.x, bitis.y - baslangic.y) <= DOKUNUS_HAREKET_ESIGI
    && bitis.zaman - baslangic.zaman <= DOKUNUS_SURE_ESIGI
}

function uzaklik([x1, y1]: [number, number], [x2, y2]: [number, number]): number {
  return Math.hypot(x2 - x1, y2 - y1)
}

function orta(noktalar: ParmakCifti): [number, number] {
  return [(noktalar.ilk[0] + noktalar.ikinci[0]) / 2, (noktalar.ilk[1] + noktalar.ikinci[1]) / 2]
}

/** İki parmağın orta noktasındaki içerik yerinde kalacak biçimde ölçekler. */
export function pinchYakinligi(y: Yakinlik, onceki: ParmakCifti, sonraki: ParmakCifti): Yakinlik {
  const oncekiUzaklik = uzaklik(onceki.ilk, onceki.ikinci)
  const sonrakiUzaklik = uzaklik(sonraki.ilk, sonraki.ikinci)
  if (oncekiUzaklik === 0) return y
  const hedefOlcek = Math.min(YAKINLIK_EN_COK, Math.max(1, y.olcek * (sonrakiUzaklik / oncekiUzaklik)))
  const [oncekiX, oncekiY] = orta(onceki)
  const [sonrakiX, sonrakiY] = orta(sonraki)
  const oran = hedefOlcek / y.olcek
  return yakinlikSinirla({ olcek: hedefOlcek, x: sonrakiX - (oncekiX - y.x) * oran, y: sonrakiY - (oncekiY - y.y) * oran })
}

// ---------------------------------------------------------------------------
// Soru Bankası sayfa karalaması
//
// Fotoğraf çiziminden ayrı bir biçim: noktalar içeriğin %100'deki CSS
// pikseli (sayfa kayar ve yakınlaşır, oran tutmanın anlamı yok); kalınlık da
// içerik pikseli. Mürekkep rengi değer değil ad: tuvale çizerken tema
// değişkeninden (`--murekkep-<ad>`) okunur, koyu temada kurşun açık tona döner.
// ---------------------------------------------------------------------------

export type SayfaNoktasi = [number, number]
export type SayfaAraci = 'kalem' | 'vurgu'
export type Murekkep = 'kursun' | 'kirmizi' | 'mavi' | 'yesil'

export type SayfaCizgisi = {
  arac: SayfaAraci
  /** Kalemde mürekkep adı; vurgulayıcı her zaman `vurgu`. */
  renk: Murekkep | 'vurgu'
  /** İçerik pikseli. */
  kalinlik: number
  noktalar: SayfaNoktasi[]
}

function noktaParcaUzakligi(p: SayfaNoktasi, a: SayfaNoktasi, b: SayfaNoktasi): number {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const uzunluk = dx * dx + dy * dy
  const t = uzunluk === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / uzunluk))
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy))
}

/**
 * Ramer–Douglas–Peucker seyreltmesi: çizgiden `tolerans`tan az sapan ara
 * noktalar düşer. Kalem saniyede yüzlerce nokta veriyor; seyreltilmeden
 * tutulan çizgi her yeniden çizimde boşuna pahalı.
 */
export function noktalariSeyrelt(noktalar: readonly SayfaNoktasi[], tolerans: number): SayfaNoktasi[] {
  if (noktalar.length <= 2) return noktalar.slice()
  const tut = new Uint8Array(noktalar.length)
  tut[0] = 1
  tut[noktalar.length - 1] = 1
  const yigin: [number, number][] = [[0, noktalar.length - 1]]
  while (yigin.length > 0) {
    const [bas, son] = yigin.pop()!
    let enUzak = -1
    let enUzakSira = -1
    for (let i = bas + 1; i < son; i++) {
      const uzak = noktaParcaUzakligi(noktalar[i], noktalar[bas], noktalar[son])
      if (uzak > enUzak) {
        enUzak = uzak
        enUzakSira = i
      }
    }
    if (enUzak > tolerans) {
      tut[enUzakSira] = 1
      yigin.push([bas, enUzakSira], [enUzakSira, son])
    }
  }
  return noktalar.filter((_, i) => tut[i] === 1)
}

export type YolKomutu =
  | { tur: 'tasi'; x: number; y: number }
  | { tur: 'cizgi'; x: number; y: number }
  | { tur: 'egri'; kx: number; ky: number; x: number; y: number }

function ortaNokta(a: SayfaNoktasi, b: SayfaNoktasi): SayfaNoktasi {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
}

/**
 * `sira`ncı nokta gelince çizilecek parça (sira ≥ 1). Yumuşatma orta nokta
 * yöntemiyle: her ara nokta, komşu orta noktalar arasındaki ikinci dereceden
 * eğrinin denetim noktası. Canlı çizim parçaları geldikçe ekler, bitmiş çizgi
 * aynı parçaları baştan sona çizer — çizgi bırakılınca yerinden oynamaz.
 */
export function yolParcasi(noktalar: readonly SayfaNoktasi[], sira: number): YolKomutu[] {
  if (sira < 1 || sira >= noktalar.length) return []
  const simdi = noktalar[sira]
  const onceki = noktalar[sira - 1]
  const hedef = ortaNokta(onceki, simdi)
  if (sira === 1) return [{ tur: 'tasi', x: onceki[0], y: onceki[1] }, { tur: 'cizgi', x: hedef[0], y: hedef[1] }]
  const bas = ortaNokta(noktalar[sira - 2], onceki)
  return [{ tur: 'tasi', x: bas[0], y: bas[1] }, { tur: 'egri', kx: onceki[0], ky: onceki[1], x: hedef[0], y: hedef[1] }]
}

/** Son orta noktadan son noktaya kapanış parçası. */
export function yolSonu(noktalar: readonly SayfaNoktasi[]): YolKomutu[] {
  const n = noktalar.length
  if (n < 2) return []
  const bas = ortaNokta(noktalar[n - 2], noktalar[n - 1])
  return [{ tur: 'tasi', x: bas[0], y: bas[1] }, { tur: 'cizgi', x: noktalar[n - 1][0], y: noktalar[n - 1][1] }]
}

/** Bitmiş çizginin tek parça yolu (tek nokta için boş: o nokta daire olarak çizilir). */
export function yumusakYol(noktalar: readonly SayfaNoktasi[]): YolKomutu[] {
  if (noktalar.length < 2) return []
  const komutlar: YolKomutu[] = [{ tur: 'tasi', x: noktalar[0][0], y: noktalar[0][1] }]
  for (let sira = 1; sira < noktalar.length; sira++) {
    // Parçalar uç uca eklendiği için ara "taşı" komutları atlanır: tek yol,
    // yarı saydam vurgulayıcıda kesişim yerleri koyulaşmaz.
    for (const komut of yolParcasi(noktalar, sira)) if (komut.tur !== 'tasi') komutlar.push(komut)
  }
  for (const komut of yolSonu(noktalar)) if (komut.tur !== 'tasi') komutlar.push(komut)
  return komutlar
}

/** İki doğru parçası arasındaki en kısa uzaklık. */
export function parcalarArasiUzaklik(a: SayfaNoktasi, b: SayfaNoktasi, c: SayfaNoktasi, d: SayfaNoktasi): number {
  const yon = (p: SayfaNoktasi, q: SayfaNoktasi, r: SayfaNoktasi) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
  const d1 = yon(a, b, c)
  const d2 = yon(a, b, d)
  const d3 = yon(c, d, a)
  const d4 = yon(c, d, b)
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return 0
  return Math.min(
    noktaParcaUzakligi(a, c, d),
    noktaParcaUzakligi(b, c, d),
    noktaParcaUzakligi(c, a, b),
    noktaParcaUzakligi(d, a, b),
  )
}

/**
 * Çizgi silgisi: silginin bu hareketteki yolu (`a` → `b`) çizgiye, yarıçap
 * artı çizginin yarı kalınlığı kadar yaklaştıysa çizgi bütün olarak silinir.
 * Önce kutu denetimi: çoğu çizgi silgiden uzak, parça parça bakmaya gerek yok.
 */
export function silgiDegiyorMu(cizgi: SayfaCizgisi, a: SayfaNoktasi, b: SayfaNoktasi, yaricap: number): boolean {
  const pay = yaricap + cizgi.kalinlik / 2
  let enAzX = Infinity
  let enAzY = Infinity
  let enCokX = -Infinity
  let enCokY = -Infinity
  for (const [x, y] of cizgi.noktalar) {
    if (x < enAzX) enAzX = x
    if (y < enAzY) enAzY = y
    if (x > enCokX) enCokX = x
    if (y > enCokY) enCokY = y
  }
  if (Math.max(a[0], b[0]) < enAzX - pay || Math.min(a[0], b[0]) > enCokX + pay) return false
  if (Math.max(a[1], b[1]) < enAzY - pay || Math.min(a[1], b[1]) > enCokY + pay) return false
  if (cizgi.noktalar.length === 1) return noktaParcaUzakligi(cizgi.noktalar[0], a, b) <= pay
  for (let i = 1; i < cizgi.noktalar.length; i++) {
    if (parcalarArasiUzaklik(a, b, cizgi.noktalar[i - 1], cizgi.noktalar[i]) <= pay) return true
  }
  return false
}

/**
 * Geri al / ileri al. Her eylem (çizgi, silgi sürüşü, hepsini temizle) tek
 * adım; "hepsini temizle" de geri alınabilir.
 */
export type KaralamaGecmisi = { cizgiler: SayfaCizgisi[]; geri: SayfaCizgisi[][]; ileri: SayfaCizgisi[][] }

export const BOS_GECMIS: KaralamaGecmisi = { cizgiler: [], geri: [], ileri: [] }
const GECMIS_EN_COK = 100

export function gecmiseYaz(g: KaralamaGecmisi, cizgiler: SayfaCizgisi[]): KaralamaGecmisi {
  if (cizgiler === g.cizgiler) return g
  return { cizgiler, geri: [...g.geri, g.cizgiler].slice(-GECMIS_EN_COK), ileri: [] }
}

export function gecmisGeriAl(g: KaralamaGecmisi): KaralamaGecmisi {
  if (g.geri.length === 0) return g
  return { cizgiler: g.geri[g.geri.length - 1], geri: g.geri.slice(0, -1), ileri: [g.cizgiler, ...g.ileri] }
}

export function gecmisIleriAl(g: KaralamaGecmisi): KaralamaGecmisi {
  if (g.ileri.length === 0) return g
  return { cizgiler: g.ileri[0], geri: [...g.geri, g.cizgiler], ileri: g.ileri.slice(1) }
}
