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

const ZEMIN_UST = '#4A8FE7'
const ZEMIN_ALT = '#1F4F92'
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

// ---------------------------------------------------------------------------
// Tek kartın paylaşılabilir görseli
//
// Kullanıcı ekranda kart kart ilerleyen bir hikâye izliyor ama paylaş düğmesi
// ona hep aynı toplu afişi veriyordu — "gördüğüm şey bu değil" duygusu.
// Instagram hikâyesinde ne bakıyorsan onu paylaşırsın; buradaki de aynı
// mantıkta: hangi kart açıksa onun görseli üretiliyor, ekrandakiyle aynı
// zemin, aynı sayı, aynı cümle.
// ---------------------------------------------------------------------------

/** Bir kartın görsele dökülebilir hâli. Kartlar bunu kendileri tanımlıyor. */
export type OzetKartVerisi = {
  /** Üstteki küçük etiket — "Bu hafta çözdüğün soru" gibi. */
  ustluk: string
  /** Kartın taşıyıcı değeri. Genişliğe göre kendiliğinden küçülür. */
  dev: string
  /** Sayının altındaki cümle. */
  alt: string
  /** İsteğe bağlı ek satırlar ("En düşük 68,25" gibi) — kutucuk olarak çizilir. */
  ekstra?: string[]
  /** Zemin geçişinin iki ucu. Ekrandaki kartla aynı renkler. */
  renkler: readonly [string, string]
}

/** Hikâye kartının PNG'si. `sira`/`toplam` üstteki ilerleme çizgisini çizer. */
export async function kartGorseliUret(
  veri: OzetKartVerisi,
  haftaMetni: string,
  sira: number,
  toplam: number,
): Promise<Blob | null> {
  if (typeof document === 'undefined') return null
  try {
    await document.fonts.ready
  } catch {
    // yedek yazı tipiyle devam
  }

  const tuval = document.createElement('canvas')
  tuval.width = GENISLIK
  tuval.height = YUKSEKLIK
  const ctx = tuval.getContext('2d')
  if (!ctx) return null

  const yazi = yazitipleriniOku()

  kartZeminiCiz(ctx, veri.renkler)
  ilerlemeCiz(ctx, sira, toplam)
  kartIcerigiCiz(ctx, veri, haftaMetni, yazi)

  return new Promise((coz) => tuval.toBlob((blob) => coz(blob), 'image/png'))
}

function kartZeminiCiz(ctx: CanvasRenderingContext2D, renkler: readonly [string, string]) {
  // CSS'teki `linear-gradient(160deg, …)` ile aynı yön: hafif sağa yatık, yukarıdan aşağı.
  const gecis = ctx.createLinearGradient(GENISLIK * 0.25, 0, GENISLIK * 0.75, YUKSEKLIK)
  gecis.addColorStop(0, renkler[0])
  gecis.addColorStop(1, renkler[1])
  ctx.fillStyle = gecis
  ctx.fillRect(0, 0, GENISLIK, YUKSEKLIK)

  ctx.fillStyle = 'rgba(255,255,255,0.055)'
  for (const [x, y, r] of [
    [900, 300, 420],
    [90, 1240, 330],
    [1000, 1760, 300],
  ]) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // Alt kenara doğru koyulaşan bir perde: metin zeminden ayrışsın.
  const perde = ctx.createLinearGradient(0, YUKSEKLIK * 0.55, 0, YUKSEKLIK)
  perde.addColorStop(0, 'rgba(0,0,0,0)')
  perde.addColorStop(1, 'rgba(0,0,0,0.22)')
  ctx.fillStyle = perde
  ctx.fillRect(0, YUKSEKLIK * 0.55, GENISLIK, YUKSEKLIK * 0.45)
}

/** Hikâyenin üstündeki bölmeli çizgi — görsele bakan "bu bir hikâye" diye okuyor. */
function ilerlemeCiz(ctx: CanvasRenderingContext2D, sira: number, toplam: number) {
  if (toplam <= 0) return
  const kenar = 88
  const bosluk = 8
  const genislik = (GENISLIK - kenar * 2 - bosluk * (toplam - 1)) / toplam

  for (let i = 0; i < toplam; i += 1) {
    yuvarlakKutu(ctx, kenar + i * (genislik + bosluk), 96, genislik, 8, 4)
    ctx.fillStyle = i <= sira ? BEYAZ : 'rgba(255,255,255,0.3)'
    ctx.fill()
  }
}

function kartIcerigiCiz(
  ctx: CanvasRenderingContext2D,
  veri: OzetKartVerisi,
  haftaMetni: string,
  yazi: Yazitipleri,
) {
  const kenar = 88
  const enFazla = GENISLIK - kenar * 2

  ctx.textAlign = 'left'
  ctx.fillStyle = SOLUK
  ctx.font = `600 32px ${yazi.govde}`
  ctx.fillText('RABİ · HAFTALIK ÖZET', kenar, 190)

  ctx.textAlign = 'right'
  ctx.fillText(haftaMetni, GENISLIK - kenar, 190)
  ctx.textAlign = 'left'

  // --- Orta blok ---
  // Alttan yukarı doğru diziliyor: cümle kaç satır tutarsa tutsun sayı hep
  // aynı yerde durmuyor, blok bir bütün olarak ortalanıyor.
  ctx.font = `500 44px ${yazi.govde}`
  const altSatirlar = kelimeSar(ctx, veri.alt, enFazla)
  const devPuntosu = punto(ctx, veri.dev, enFazla, 190, yazi.baslik)

  const ekstraYuksekligi = veri.ekstra?.length ? 150 : 0
  const toplamYukseklik = 60 + devPuntosu * 0.94 + 40 + altSatirlar.length * 62 + ekstraYuksekligi
  let y = (YUKSEKLIK - toplamYukseklik) / 2

  ctx.fillStyle = SOLUK
  ctx.font = `600 36px ${yazi.govde}`
  ctx.fillText(veri.ustluk.toLocaleUpperCase('tr'), kenar, y)
  y += 60 + devPuntosu * 0.78

  ctx.fillStyle = BEYAZ
  ctx.font = `700 ${devPuntosu}px ${yazi.baslik}`
  ctx.fillText(veri.dev, kenar, y)
  y += devPuntosu * 0.16 + 40

  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = `500 44px ${yazi.govde}`
  for (const satir of altSatirlar) {
    y += 62
    ctx.fillText(satir, kenar, y)
  }

  if (veri.ekstra?.length) {
    y += 46
    const kutuGenislik = (enFazla - 28) / Math.min(2, veri.ekstra.length)
    veri.ekstra.slice(0, 2).forEach((metin, i) => {
      const x = kenar + i * (kutuGenislik + 28)
      yuvarlakKutu(ctx, x, y, kutuGenislik, 104, 28)
      ctx.fillStyle = COK_SOLUK
      ctx.fill()
      ctx.fillStyle = BEYAZ
      ctx.font = `600 38px ${yazi.baslik}`
      ctx.fillText(kisalt(ctx, metin, kutuGenislik - 56), x + 28, y + 66)
    })
  }

  // --- Alt imza ---
  tavsanCiz(ctx, kenar, YUKSEKLIK - 178, 0.62)

  ctx.fillStyle = BEYAZ
  ctx.font = `700 46px ${yazi.baslik}`
  ctx.fillText('Rabi', kenar + 96, YUKSEKLIK - 120)

  ctx.fillStyle = SOLUK
  ctx.font = `500 30px ${yazi.govde}`
  ctx.fillText('YKS çalışma asistanı', kenar + 96, YUKSEKLIK - 76)
}

/**
 * Açılış ekranındaki çizgi tavşan (components/acilis.tsx) — aynı yollar.
 * Paylaşılan görselde uygulamanın imzası olsun diye; dolu maskot bu boyutta
 * lekeye dönüşüyor, çizgi hâli küçükken de okunuyor.
 */
function tavsanCiz(ctx: CanvasRenderingContext2D, x: number, y: number, olcek: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(olcek, olcek)
  ctx.strokeStyle = BEYAZ
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (const yol of [
    'M45 46 C39 30 38 16 44 8 C50 2 56 10 55 24 C54 33 52 41 50 47',
    'M75 46 C81 30 82 16 76 8 C70 2 64 10 65 24 C66 33 68 41 70 47',
    'M45 78 q5 6 10 0',
    'M65 78 q5 6 10 0',
    'M53 95 q7 6 14 0',
  ]) {
    ctx.stroke(new Path2D(yol))
  }

  ctx.beginPath()
  ctx.ellipse(60, 84, 35, 31, 0, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = BEYAZ
  ctx.fill(new Path2D('M60 90 l-4.5 -4 h9 z'))
  ctx.restore()
}

/** Metni verilen genişliğe sığdıran en büyük punto (üst sınırdan aşağı iner). */
function punto(
  ctx: CanvasRenderingContext2D,
  metin: string,
  enFazla: number,
  baslangic: number,
  aile: string,
): number {
  let boy = baslangic
  ctx.font = `700 ${boy}px ${aile}`
  while (boy > 44 && ctx.measureText(metin).width > enFazla) {
    boy -= 6
    ctx.font = `700 ${boy}px ${aile}`
  }
  return boy
}

/** Cümleyi kelime sınırlarından satırlara böler. */
function kelimeSar(ctx: CanvasRenderingContext2D, metin: string, enFazla: number): string[] {
  const kelimeler = metin.split(' ')
  const satirlar: string[] = []
  let simdiki = ''

  for (const kelime of kelimeler) {
    const aday = simdiki ? `${simdiki} ${kelime}` : kelime
    if (ctx.measureText(aday).width <= enFazla || !simdiki) {
      simdiki = aday
      continue
    }
    satirlar.push(simdiki)
    simdiki = kelime
  }
  if (simdiki) satirlar.push(simdiki)

  // Beş satırdan uzun bir cümle kartı boğuyor; kalanı kısaltılıyor.
  if (satirlar.length <= 5) return satirlar
  return [...satirlar.slice(0, 4), kisalt(ctx, satirlar.slice(4).join(' '), enFazla)]
}
