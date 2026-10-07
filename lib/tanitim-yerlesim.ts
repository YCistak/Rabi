/*
  Tanıtım rehberinin balon yerleşimi ve kare kare izleme kuralları (saf).

  `components/tanitim/spot-isigi.tsx` ölçüyor ve çiziyor; nereye
  konacağına buradaki işlevler karar veriyor. Bütün ölçüler katmanın CSS
  pikselinde (iPad'deki `zoom` dönüşümü çağıran tarafta yapılıyor).
*/

export type Kutu = { sol: number; ust: number; genislik: number; yukseklik: number }
export type Ekran = { sol: number; ust: number; genislik: number; yukseklik: number }

export const BALON_EN_GENIS = 340
/** Son çaredeki balon adayları arasında şu anki yerin piksel cinsinden avantajı (bkz. `balonKonumu`). */
export const ONCEKI_YER_PAYI = 16

/**
 * Balonun genişliği. Yatay ekranda hedefin yanında yer varsa balon o yana
 * sığacak kadar daralıyor. Tablette yan boşluk dar diye balon daraltılmıyor:
 * sağdaki rayla geniş bir hedefin arasına 170 piksellik bir şerit olarak
 * sıkışıyor, düğmeleri kesiliyordu; yer yoksa balon üste/alta geçiyor.
 */
export function balonGenisligi(kutu: Kutu | null, ekran: Ekran, tablet: boolean): number {
  const tam = Math.min(BALON_EN_GENIS, ekran.genislik - 24)
  if (!kutu) return tam
  const solBosluk = kutu.sol - ekran.sol
  const sagBosluk = ekran.sol + ekran.genislik - kutu.sol - kutu.genislik
  const enDarYan = tablet ? 300 : 188
  if (ekran.genislik > ekran.yukseklik && Math.max(solBosluk, sagBosluk) >= enDarYan) {
    return Math.min(BALON_EN_GENIS, Math.max(solBosluk, sagBosluk) - 28)
  }
  return tam
}

/**
 * Balonun sol-üst köşesi. Sıra: hedefin sağı, solu, altı, üstü; hiçbirine
 * sığmıyorsa hedefle **en az örtüşen** yer (alt/üst kenar × sol/orta/sağ
 * hiza). Eskiden son çare "hedefin 12 piksel altı"ydı ve ekran
 * sınırına kırpılınca balon iPad yatayda Pomodoro'nun ayar kartının
 * üstüne biniyordu. Sonuç her zaman ekranın içinde.
 *
 * `korunan`: balonun hiç örtmemesi gereken kutu (klavye açıkken odaktaki
 * yazı kutusu). Son çaredeki adaylardan onu örtenler ancak hepsi örtüyorsa
 * seçiliyor. Klavyeli formda (Soru ekle, ders listesi açık) balon görünür
 * alanın dibine konup yazılan kutunun üstüne biniyordu.
 *
 * `onceki`: balonun şu an durduğu yer. Son çarede adaylar hedefle neredeyse
 * eşit örtüşüyorsa balon yerinde kalıyor (`ONCEKI_YER_PAYI` piksellik şerit
 * kadar avantaj). iPad'deki tanı kaydında (deneme listesi, t=64503→64828)
 * üst ve alt aday 10,2 ile 10,7 px örtüşüyordu; sayfa 1 px kayınca sıra
 * değişti ve balon ekranın tepesinden dibine 384 px uçtu.
 */
export function balonKonumu(kutu: Kutu | null, ekran: Ekran, ustSinir: number, altSinir: number, genislik: number, yukseklik: number, korunan: Kutu | null = null, onceki: { sol: number; ust: number } | null = null): { sol: number; ust: number } {
  let sol = ekran.sol + (ekran.genislik - genislik) / 2
  let ust = altSinir - yukseklik
  if (kutu) {
    const alt = kutu.ust + kutu.yukseklik
    if (ekran.sol + ekran.genislik - kutu.sol - kutu.genislik >= genislik + 28) {
      sol = kutu.sol + kutu.genislik + 16
      ust = kutu.ust
    } else if (kutu.sol - ekran.sol >= genislik + 28) {
      sol = kutu.sol - genislik - 16
      ust = kutu.ust
    } else if (altSinir - alt >= yukseklik + 16) ust = alt + 16
    else if (kutu.ust - ustSinir >= yukseklik + 16) ust = kutu.ust - yukseklik - 16
    else {
      // Hiçbir yana sığmıyor: alt/üst kenar ile sol/orta/sağ hizalardan
      // hedefle en az örtüşeni. Eşitlikte sıra korunur (önce alt orta).
      const solHiza = ekran.sol + 12
      const sagHiza = ekran.sol + ekran.genislik - 12 - genislik
      let enAz = Number.POSITIVE_INFINITY
      for (const aday of [altSinir - yukseklik, ustSinir]) for (const x of [sol, solHiza, sagHiza]) {
        const balon = { sol: x, ust: Math.max(ustSinir, aday), genislik, yukseklik }
        const yerinde = !!onceki && Math.abs(onceki.sol - x) < 1 && Math.abs(onceki.ust - balon.ust) < 1
        const alan = ortusmeAlani(balon, kutu) + (korunan && ortusmeAlani(balon, korunan) > 0 ? 1e9 : 0) - (yerinde ? genislik * ONCEKI_YER_PAYI : 0)
        if (alan < enAz - 0.5) { enAz = alan; ust = aday; sol = x }
      }
    }
  }
  const solSinir = ekran.sol + 12
  const sagSinir = ekran.sol + ekran.genislik - 12 - genislik
  return {
    sol: Math.max(solSinir, Math.min(sol, sagSinir)),
    ust: Math.max(ustSinir, Math.min(ust, altSinir - yukseklik)),
  }
}

export function ortusmeAlani(a: Kutu, b: Kutu): number {
  const x = Math.min(a.sol + a.genislik, b.sol + b.genislik) - Math.max(a.sol, b.sol)
  const y = Math.min(a.ust + a.yukseklik, b.ust + b.yukseklik) - Math.max(a.ust, b.ust)
  return Math.max(0, x) * Math.max(0, y)
}

/** İki kutu arasındaki en büyük kenar farkı (yoksa sonsuz). */
export function kutuFarki(a: Kutu | null, b: Kutu | null): number {
  if (!a && !b) return 0
  if (!a || !b) return Number.POSITIVE_INFINITY
  return Math.max(Math.abs(a.sol - b.sol), Math.abs(a.ust - b.ust), Math.abs(a.genislik - b.genislik), Math.abs(a.yukseklik - b.yukseklik))
}

/**
 * Hedef yerine oturdu mu: art arda `gereken` ölçüm boyunca yarım pikselden az
 * kıpırdadıysa **ve** bu durgunluk en az `enAzMs` sürdüyse evet. Ekran girişi
 * (`sayfa-girisi`) ya da oyun ekranının kendi girişi sürerken hedef her karede
 * biraz kayıyor; spot o sırada izlemeye başlarsa geçişin her karesine yeniden
 * hedeflenen bir CSS geçişiyle kovalıyor ve hedefin önüne geçip geri dönüyordu.
 *
 * Süre şartı kare sayısının tek başına yetmemesinden: 120 Hz ekranda (iPhone
 * ProMotion) iki kare 16 ms, ağır bir karede (yavaş telefon, React'in ikinci
 * çizimi) iki ölçüm arası 100 ms'yi aşabiliyor. "İki kare durdu" ekranın
 * hızına göre başka bir süre demekti; deneme formunda örnek sonuçlar yazılırken
 * spot ara bir yerde "yerleşti" sanıp 24 px sonra ikinci kez kayıyordu.
 */
export function durgunlukSayaci(gereken = 2, enAzMs = 0) {
  let onceki: Kutu | null = null
  let sayi = 0
  let durgunBasi = 0
  return {
    bildir(kutu: Kutu, simdi = 0): boolean {
      if (onceki && kutuFarki(onceki, kutu) < 0.5) sayi++
      else { sayi = 0; durgunBasi = simdi }
      onceki = kutu
      return sayi >= gereken && simdi - durgunBasi >= enAzMs
    },
    sifirla() { onceki = null; sayi = 0 },
  }
}

/**
 * Kaydırma isteğini kabın gerçekten gidebileceği aralığa kısar.
 *
 * iOS WebKit'te `window.scrollBy`/`scrollTo` sınırın dışına (0'ın altına ya da
 * en çok kaydırmanın üstüne) istenince sayfa kenetleniyor ama hemen ardından
 * okunan `getBoundingClientRect`, sayfa **istenen** yere gitmiş gibi
 * hesaplanıyor (WebKit r216803; muffinman.io "iOS Safari window.scrollTo /
 * getBoundingClientRect bug"). Spot planlanırken hedef sayfanın tepesindeyse
 * (Araçlar'daki Pomodoro satırı, istatistik türleri, ana sayfadaki sınav
 * kartı) ortalamak için eksi yöne kaydırma isteniyor; ölçüm hedefi o kadar
 * aşağıda sanıyor, spot önce aşağıya gidip bir sonraki ölçümde yukarı
 * sıçrıyordu. Başsız WebKit kenetlemeyi ölçüme hemen yansıttığı için orada
 * görünmüyordu. İstek baştan kısılınca motorun neyi raporladığı önemsizleşiyor.
 */
export function kaydirmaKis(simdiki: number, istenen: number, enCok: number): number {
  return Math.min(Math.max(0, enCok), Math.max(0, simdiki + istenen)) - simdiki
}

/**
 * `kaydirmaKis` gibi, ama varılacak yer tam piksel.
 *
 * iOS WebKit kesirli kaydırmayı belgede aşağı, ekranda yukarı yuvarlıyor:
 * iPad tanı kaydında istenen 361,35 px'lik kaydırma `scrollY`de 361, bir kare
 * sonra 362 okundu (aynısı 67→68, 79→80, 14→15). Spot 361'e göre
 * çizilmişti; 1 px'lik kayma yeniden çizim, bir adımda da balonun ekranın
 * öbür ucuna geçmesi demekti. Tam piksel istenince iki taraf aynı yerde.
 */
export function kaydirmaKisTam(simdiki: number, istenen: number, enCok: number): number {
  return kaydirmaKis(simdiki, Math.round(simdiki + istenen) - simdiki, Math.floor(enCok))
}

/** Bir kabın kaydırmaya dair ölçüleri (`getComputedStyle` + `scroll*`/`client*`). */
export type KabOlcusu = { overflowX: string; overflowY: string; scrollWidth: number; clientWidth: number; scrollHeight: number; clientHeight: number }

const kaydirilir = (deger: string) => deger === 'auto' || deger === 'scroll'

/**
 * Rehber açıkken bir dokunma/tekerlek hareketi serbest bırakılmalı mı?
 *
 * `zincir`: olayın hedefinden aydınlatılan hedefe kadar (ikisi de dahil) olan
 * kapların ölçüleri; olay hedefin dışındaysa `null`. Hedefin içinde yatayda ya
 * da dikeyde gerçekten taşan, kaydırılabilir bir kap varsa hareket o kabı
 * kaydırsın diye serbest. Hedefin dışı ve hedef içindeki kaydırılamaz alanlar
 * kilitli kalıyor: sayfanın kendisi kaymamalı (spot ile balon kopar).
 */
export function hedefteKaydirilabilir(zincir: readonly KabOlcusu[] | null): boolean {
  if (!zincir) return false
  return zincir.some((kab) =>
    (kaydirilir(kab.overflowX) && kab.scrollWidth > kab.clientWidth + 1)
    || (kaydirilir(kab.overflowY) && kab.scrollHeight > kab.clientHeight + 1))
}
