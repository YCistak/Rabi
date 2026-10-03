/*
  Tanıtım rehberinin balon yerleşimi ve kare kare izleme kuralları (saf).

  `components/tanitim/spot-isigi.tsx` ölçüyor ve çiziyor; nereye
  konacağına buradaki işlevler karar veriyor. Bütün ölçüler katmanın CSS
  pikselinde (iPad'deki `zoom` dönüşümü çağıran tarafta yapılıyor).
*/

export type Kutu = { sol: number; ust: number; genislik: number; yukseklik: number }
export type Ekran = { sol: number; ust: number; genislik: number; yukseklik: number }

export const BALON_EN_GENIS = 340

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
 */
export function balonKonumu(kutu: Kutu | null, ekran: Ekran, ustSinir: number, altSinir: number, genislik: number, yukseklik: number, korunan: Kutu | null = null): { sol: number; ust: number } {
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
        const alan = ortusmeAlani(balon, kutu) + (korunan && ortusmeAlani(balon, korunan) > 0 ? 1e9 : 0)
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
 * Hedef yerine oturdu mu: art arda `gereken` kare boyunca yarım pikselden az
 * kıpırdadıysa evet. Ekran girişi (`sayfa-girisi`) ya da oyun ekranının kendi
 * girişi sürerken hedef her karede biraz kayıyor; spot o sırada izlemeye
 * başlarsa geçişin her karesine yeniden hedeflenen bir CSS geçişiyle
 * kovalıyor ve hedefin önüne geçip geri dönüyordu.
 */
export function durgunlukSayaci(gereken = 2) {
  let onceki: Kutu | null = null
  let sayi = 0
  return {
    bildir(kutu: Kutu): boolean {
      sayi = onceki && kutuFarki(onceki, kutu) < 0.5 ? sayi + 1 : 0
      onceki = kutu
      return sayi >= gereken
    },
    sifirla() { onceki = null; sayi = 0 },
  }
}
