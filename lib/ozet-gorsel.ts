'use client'

/**
 * Haftalık özetin paylaşılabilir görseli.
 *
 * Ekrandaki kartların görüntüsü alınmıyor, görsel **yeniden çiziliyor**. İki
 * sebep: ekran görüntüsü alan kütüphaneler (html2canvas gibi) birkaç yüz KB
 * geliyor ve CSS'in yarısını yanlış yorumluyor; ayrıca paylaşılan görselin
 * telefonun ekran oranından bağımsız, her yerde aynı görünmesi gerekiyor.
 * Burada 1080×1920 sabit bir tuval var — hikâye (story) oranı.
 *
 * Yazı tipi ailesi sayfadan okunuyor: `next/font` üretilen aile adını rastgele
 * bir sınıfın arkasına saklıyor, elle "Space Grotesk" yazmak tutmuyordu.
 */

import type { HaftalikOzet } from './ozet'
import { dakikaYaz, gunYaz, haftaYaz } from './ozet'
import { netYaz } from './hesap'

const GENISLIK = 1080
const YUKSEKLIK = 1920

const ZEMIN_UST = '#C2622A'
const ZEMIN_ALT = '#7A3412'
const BEYAZ = '#FFFFFF'
const SOLUK = 'rgba(255,255,255,0.72)'
const COK_SOLUK = 'rgba(255,255,255,0.16)'

type Yazitipleri = { baslik: string; govde: string }

/**
 * Sayfadaki gerçek yazı tipi adlarını okur. Gizli bir öğe kurulup hesaplanmış
 * `font-family` alınıyor; `--font-display` değişkeni doğrudan okunsaydı
 * `var(--font-space-grotesk), …` gibi çözülmemiş bir metin dönerdi.
 */
function yazitipleriniOku(): Yazitipleri {
  const olc = document.createElement('span')
  olc.style.position = 'absolute'
  olc.style.visibility = 'hidden'
  olc.className = 'font-display'
  document.body.appendChild(olc)
  const baslik = getComputedStyle(olc).fontFamily
  document.body.removeChild(olc)

  return { baslik, govde: getComputedStyle(document.body).fontFamily }
}

/** Özetin paylaşılabilir PNG'sini üretir. */
export async function ozetGorseliUret(ozet: HaftalikOzet): Promise<Blob | null> {
  if (typeof document === 'undefined') return null

  // Yazı tipleri yüklenmeden çizilirse tuval yedek yazı tipiyle boyar ve
  // görsel uygulamadakine hiç benzemez.
  try {
    await document.fonts.ready
  } catch {
    // Desteklenmiyorsa yedek yazı tipiyle devam; görsel yine de üretilsin.
  }

  const tuval = document.createElement('canvas')
  tuval.width = GENISLIK
  tuval.height = YUKSEKLIK
  const ctx = tuval.getContext('2d')
  if (!ctx) return null

  const yazi = yazitipleriniOku()
  zeminCiz(ctx)
  icerikCiz(ctx, ozet, yazi)

  return new Promise((coz) => tuval.toBlob((blob) => coz(blob), 'image/png'))
}

function zeminCiz(ctx: CanvasRenderingContext2D) {
  const gecis = ctx.createLinearGradient(0, 0, GENISLIK * 0.4, YUKSEKLIK)
  gecis.addColorStop(0, ZEMIN_UST)
  gecis.addColorStop(1, ZEMIN_ALT)
  ctx.fillStyle = gecis
  ctx.fillRect(0, 0, GENISLIK, YUKSEKLIK)

  // Zemin düz kalmasın diye üç geniş, çok soluk daire. Doku katıyorlar ama
  // yazının okunurluğunu bozmayacak kadar silikler.
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  for (const [x, y, r] of [
    [880, 240, 380],
    [120, 1180, 300],
    [980, 1680, 340],
  ]) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function icerikCiz(ctx: CanvasRenderingContext2D, ozet: HaftalikOzet, yazi: Yazitipleri) {
  const kenar = 88

  // --- Başlık ---
  ctx.textAlign = 'left'
  ctx.fillStyle = SOLUK
  ctx.font = `600 34px ${yazi.govde}`
  ctx.fillText('RABİ · HAFTALIK ÖZET', kenar, 150)

  ctx.fillStyle = BEYAZ
  ctx.font = `700 76px ${yazi.baslik}`
  ctx.fillText(haftaYaz(ozet.hafta), kenar, 245)

  // --- Ana sayı: haftanın soru toplamı ---
  ctx.fillStyle = SOLUK
  ctx.font = `500 36px ${yazi.govde}`
  ctx.fillText('Bu hafta çözdüğün soru', kenar, 400)

  ctx.fillStyle = BEYAZ
  ctx.font = `700 210px ${yazi.baslik}`
  ctx.fillText(String(ozet.toplamSoru), kenar, 570)

  ctx.fillStyle = SOLUK
  ctx.font = `500 38px ${yazi.govde}`
  ctx.fillText(hedefCumlesi(ozet), kenar, 635)

  // --- Dört kutu ---
  const kutular: [string, string][] = [
    ['Pomodoro', dakikaYaz(ozet.pomodoroDakika)],
    ['Mini oyun', dakikaYaz(ozet.oyunDakika)],
    ['Deneme', `${ozet.denemeSayisi}`],
    ['Seri', `${ozet.seri} gün`],
  ]

  const kutuGenislik = (GENISLIK - kenar * 2 - 32) / 2
  const kutuYukseklik = 176
  kutular.forEach(([etiket, deger], i) => {
    const x = kenar + (i % 2) * (kutuGenislik + 32)
    const y = 720 + Math.floor(i / 2) * (kutuYukseklik + 28)

    yuvarlakKutu(ctx, x, y, kutuGenislik, kutuYukseklik, 34)
    ctx.fillStyle = COK_SOLUK
    ctx.fill()

    ctx.fillStyle = SOLUK
    ctx.font = `500 32px ${yazi.govde}`
    ctx.fillText(etiket, x + 36, y + 66)

    ctx.fillStyle = BEYAZ
    ctx.font = `700 64px ${yazi.baslik}`
    ctx.fillText(deger, x + 36, y + 138)
  })

  // --- En çok çalışılan üç ders ---
  let y = 1190
  ctx.fillStyle = SOLUK
  ctx.font = `500 36px ${yazi.govde}`
  ctx.fillText('En çok soru çözdüğün dersler', kenar, y)
  y += 60

  if (ozet.ilkUcDers.length === 0) {
    ctx.fillStyle = BEYAZ
    ctx.font = `600 46px ${yazi.baslik}`
    ctx.fillText('Bu hafta ders girilmemiş', kenar, y + 46)
  }

  const enBuyukPay = ozet.ilkUcDers[0]?.soru ?? 1
  ozet.ilkUcDers.forEach((ders, i) => {
    const satirY = y + i * 132

    ctx.fillStyle = BEYAZ
    ctx.font = `700 52px ${yazi.baslik}`
    ctx.fillText(`${i + 1}`, kenar, satirY + 56)

    ctx.font = `600 46px ${yazi.baslik}`
    ctx.fillText(kisalt(ctx, ders.ders, GENISLIK - kenar * 2 - 260), kenar + 70, satirY + 56)

    ctx.textAlign = 'right'
    ctx.fillStyle = SOLUK
    ctx.font = `500 40px ${yazi.govde}`
    ctx.fillText(`${ders.soru} soru`, GENISLIK - kenar, satirY + 56)
    ctx.textAlign = 'left'

    // Oran çubuğu — birinciye göre ölçekli, sıralamayı gözle okutuyor.
    const cubukY = satirY + 84
    yuvarlakKutu(ctx, kenar + 70, cubukY, GENISLIK - kenar * 2 - 70, 16, 8)
    ctx.fillStyle = COK_SOLUK
    ctx.fill()

    yuvarlakKutu(
      ctx,
      kenar + 70,
      cubukY,
      Math.max(24, (GENISLIK - kenar * 2 - 70) * (ders.soru / enBuyukPay)),
      16,
      8,
    )
    ctx.fillStyle = BEYAZ
    ctx.fill()
  })

  // --- Alt satır ---
  // Parçalar tek satıra sığmayabiliyor (uzun deneme adı, üç madde birden);
  // sığmayan taşıp görselin dışında kalıyordu. Genişliğe göre bölünüyor.
  ctx.fillStyle = SOLUK
  ctx.font = `500 34px ${yazi.govde}`
  const satirlar = satirlaraBol(ctx, altSatir(ozet), GENISLIK - kenar * 2)
  satirlar.forEach((satir, i) => {
    ctx.fillText(satir, kenar, YUKSEKLIK - 110 - (satirlar.length - 1 - i) * 48)
  })
}

/**
 * Metni " · " sınırlarından, verilen genişliğe sığacak satırlara böler.
 * En fazla iki satır: üçüncüsü alt kenara dayanırdı.
 */
function satirlaraBol(
  ctx: CanvasRenderingContext2D,
  metin: string,
  enFazla: number,
): string[] {
  const parcalar = metin.split('  ·  ')
  const satirlar: string[] = []
  let simdiki = ''

  for (const parca of parcalar) {
    const aday = simdiki ? `${simdiki}  ·  ${parca}` : parca
    if (ctx.measureText(aday).width <= enFazla || !simdiki) {
      simdiki = aday
      continue
    }
    satirlar.push(simdiki)
    simdiki = parca
    if (satirlar.length === 1) continue
  }
  if (simdiki) satirlar.push(simdiki)

  return satirlar.slice(0, 2).map((s) => kisalt(ctx, s, enFazla))
}

function hedefCumlesi(ozet: HaftalikOzet): string {
  if (ozet.haftalikHedef <= 0) return 'Haftalık hedef belirlenmemiş'
  if (ozet.hedefDurumu === 'asti') return `Haftalık hedefi ${ozet.hedefFarki} soru aştın`
  if (ozet.hedefDurumu === 'tutturdu') return `${ozet.haftalikHedef} soruluk hedefi tutturdun`
  return `Hedefe ${Math.abs(ozet.hedefFarki)} soru kaldı`
}

function altSatir(ozet: HaftalikOzet): string {
  const parcalar: string[] = []
  if (ozet.denemeEnYuksek) parcalar.push(`En iyi deneme ${netYaz(ozet.denemeEnYuksek.net)} net`)
  if (ozet.bankaCozulen > 0) parcalar.push(`${ozet.bankaCozulen} yanlış soru kapatıldı`)
  if (ozet.devamsizlikToplam > 0) {
    parcalar.push(`${gunYaz(ozet.devamsizlikToplam)} gün devamsızlık`)
  }
  return parcalar.length > 0 ? parcalar.join('  ·  ') : 'Rabi ile hazırlanıyorum'
}

/** Sığmayan ders adını üç noktayla kısaltır. */
function kisalt(ctx: CanvasRenderingContext2D, metin: string, enFazla: number): string {
  if (ctx.measureText(metin).width <= enFazla) return metin
  let kesik = metin
  while (kesik.length > 1 && ctx.measureText(`${kesik}…`).width > enFazla) {
    kesik = kesik.slice(0, -1)
  }
  return `${kesik}…`
}

function yuvarlakKutu(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  genislik: number,
  yukseklik: number,
  yaricap: number,
) {
  ctx.beginPath()
  ctx.roundRect(x, y, genislik, yukseklik, yaricap)
}
