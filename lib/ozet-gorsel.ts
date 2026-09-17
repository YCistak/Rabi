'use client'

/**
 * Aylık özetin paylaşılabilir görseli.
 *
 * Ekrandaki sayfaların görüntüsü alınmıyor, görsel **yeniden çiziliyor**. İki
 * sebep: ekran görüntüsü alan kütüphaneler (html2canvas gibi) birkaç yüz KB
 * geliyor ve CSS'in yarısını yanlış yorumluyor; ayrıca paylaşılan görselin
 * telefonun ekran oranından bağımsız, her yerde aynı görünmesi gerekiyor.
 * Burada 1080×1920 sabit bir tuval var — hikâye (story) oranı.
 *
 * Afiş ekrandaki hikâyenin **özeti**, kopyası değil: on sayfayı tek görsele
 * sığdırmak hepsini okunmaz yapardı. Afiş ayın adını, taşıyıcı sayıyı (soru),
 * haftalık dağılımı ve altı kutuda geri kalanı gösteriyor — ekrandaki kapanış
 * sayfasının kâğıda basılmış hâli.
 *
 * Renkler `components/ekranlar/aylik-ozet.tsx` ile **aynı** ve burada ayrıca
 * yazılı: tuval `var(--…)` metnini çözemiyor. Biri değişirse öteki de.
 *
 * Yazı tipi ailesi sayfadan okunuyor: `next/font` üretilen aile adını rastgele
 * bir sınıfın arkasına saklıyor, elle "Nunito" yazmak tutmuyordu.
 */

import type { AylikOzet } from './ozet'
import { ayAdi, ayAraligiYaz, dakikaKisa, tamYaz } from './ozet'
import { netYaz } from './hesap'

const GENISLIK = 1080
const YUKSEKLIK = 1920
const KENAR = 84

// --- Kâğıt paleti (tasarım: `tasarim/aylik-ozet.dc.html`) ---
const KAGIT = '#faf3e1'
const KAGIT_CIZGISI = 'rgba(168,124,36,.14)'
const MUREKKEP = '#1b1a19'
const SOLUK = '#6b6764'
const AMBER = '#d09b34'
const AMBER_KOYU = '#8d691a'
const AMBER_SOLUK = '#a68a43'
const AMBER_ZEMIN = '#f7f0dc'
const VURGU = '#b3491f'
const VURGU_PARLAK = '#d9622f'
const YESIL = '#4f7a4a'

type Yazitipleri = { baslik: string; govde: string; marka: string }

/**
 * Sayfadaki gerçek yazı tipi adlarını okur. Gizli bir öğe kurulup hesaplanmış
 * `font-family` alınıyor; `--font-display` değişkeni doğrudan okunsaydı
 * `var(--font-nunito), …` gibi çözülmemiş bir metin dönerdi.
 */
function yazitipleriniOku(): Yazitipleri {
  const oku = (sinif: string) => {
    const olc = document.createElement('span')
    olc.style.position = 'absolute'
    olc.style.visibility = 'hidden'
    olc.className = sinif
    document.body.appendChild(olc)
    const aile = getComputedStyle(olc).fontFamily
    document.body.removeChild(olc)
    return aile
  }
  return { baslik: oku('font-display'), govde: getComputedStyle(document.body).fontFamily, marka: oku('font-marka') }
}

/** Özetin paylaşılabilir PNG'si — 1080×1920 afiş. */
export async function ozetGorseliUret(ozet: AylikOzet): Promise<Blob | null> {
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
  const maskot = await maskotuYukle()

  afisZeminiCiz(ctx)
  afisIcerigiCiz(ctx, ozet, yazi, maskot)

  return new Promise((coz) => tuval.toBlob((blob) => coz(blob), 'image/png'))
}

/**
 * Maskotun görselini yükler; yüklenemezse `null` ve afiş maskotsuz çıkıyor.
 * Aynı kökten (`public/`) geldiği için tuval kirlenmiyor, `toBlob` çalışıyor.
 */
function maskotuYukle(): Promise<HTMLImageElement | null> {
  return new Promise((coz) => {
    const gorsel = new Image()
    gorsel.onload = () => coz(gorsel)
    gorsel.onerror = () => coz(null)
    gorsel.src = '/tavsan-sevinen.png'
  })
}

/** Kâğıt zemin: krem dolgu, sekiz piksellik defter çizgisi, çift amber çerçeve. */
function afisZeminiCiz(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = KAGIT
  ctx.fillRect(0, 0, GENISLIK, YUKSEKLIK)

  // Ekrandaki 8 px'lik çizgi aralığı 1080'lik tuvalde ~2,6 kat: 21 px.
  ctx.fillStyle = KAGIT_CIZGISI
  for (let y = 0; y < YUKSEKLIK; y += 21) ctx.fillRect(0, y, GENISLIK, 2)

  ctx.lineWidth = 2
  yuvarlakKutu(ctx, 26, 26, GENISLIK - 52, YUKSEKLIK - 52, 84)
  ctx.strokeStyle = 'rgba(208,155,52,.5)'
  ctx.stroke()
  yuvarlakKutu(ctx, 42, 42, GENISLIK - 84, YUKSEKLIK - 84, 70)
  ctx.strokeStyle = 'rgba(208,155,52,.2)'
  ctx.stroke()
}

function afisIcerigiCiz(
  ctx: CanvasRenderingContext2D,
  ozet: AylikOzet,
  yazi: Yazitipleri,
  maskot: HTMLImageElement | null,
) {
  const enFazla = GENISLIK - KENAR * 2
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  // --- Başlık: "RABİ · AYLIK ÖZET", ayın adı, tarih aralığı ---
  ctx.fillStyle = AMBER_SOLUK
  ctx.font = `800 28px ${yazi.baslik}`
  aralikliYaz(ctx, 'RABİ · AYLIK ÖZET', KENAR, 168, 0.26)

  ctx.fillStyle = VURGU
  const ad = ayAdi(ozet.ay).toLocaleUpperCase('tr')
  const adPunto = punto(ctx, ad, enFazla - 320, 170, yazi.marka, 800)
  ctx.font = `800 ${adPunto}px ${yazi.marka}`
  ctx.fillText(ad, KENAR - 6, 318)

  ctx.fillStyle = AMBER_KOYU
  ctx.font = `800 26px ${yazi.baslik}`
  aralikliYaz(ctx, ayAraligiYaz(ozet.ay).toLocaleUpperCase('tr'), KENAR, 376, 0.13)

  // Sağ üstte maskot — başlığın yanındaki boşluğa, kâğıdın üstünde.
  if (maskot) ctx.drawImage(maskot, GENISLIK - KENAR - 260, 128, 260, 282)

  // --- Taşıyıcı sayı: ayın soru toplamı ---
  ctx.fillStyle = AMBER_SOLUK
  ctx.font = `800 28px ${yazi.baslik}`
  aralikliYaz(ctx, 'TOPLAM ÇÖZÜLEN SORU', KENAR, 520, 0.18)

  const sayi = tamYaz(ozet.toplamSoru)
  const sayiPunto = punto(ctx, sayi, enFazla, 250, yazi.baslik)
  ctx.fillStyle = MUREKKEP
  ctx.font = `900 ${sayiPunto}px ${yazi.baslik}`
  ctx.fillText(sayi, KENAR - 8, 770)

  // --- Haftalık çubuklar ---
  const kutuY = 830
  const kutuYuksekligi = 380
  ctx.fillStyle = AMBER_SOLUK
  ctx.font = `800 26px ${yazi.baslik}`
  aralikliYaz(ctx, 'HAFTA HAFTA', KENAR, kutuY, 0.18)
  haftaCubuklariCiz(ctx, ozet, KENAR, kutuY + 30, enFazla, kutuYuksekligi - 30, yazi)

  // --- Altı kutu (iki sütun) ---
  const kutular = kapanisKutulari(ozet)
  const kutuGenislik = (enFazla - 24) / 2
  const altiliY = kutuY + kutuYuksekligi + 56
  const altiliYukseklik = 168

  kutular.forEach((kutu, i) => {
    const son = i === kutular.length - 1 && kutular.length % 2 === 1
    const x = KENAR + (i % 2) * (kutuGenislik + 24)
    const y = altiliY + Math.floor(i / 2) * (altiliYukseklik + 20)
    const genislik = son ? enFazla : kutuGenislik

    yuvarlakKutu(ctx, x, y, genislik, altiliYukseklik, 40)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = AMBER
    ctx.stroke()

    ctx.textAlign = 'center'
    const degerPunto = punto(ctx, kutu.deger, genislik - 64, 56, yazi.baslik)
    ctx.fillStyle = kutu.renk
    ctx.font = `900 ${degerPunto}px ${yazi.baslik}`
    ctx.fillText(kutu.deger, x + genislik / 2, y + 84)

    // Etiket önce **küçülüyor**, sonra kısalıyor: kesilen bir etiketten geriye
    // kutunun ne anlattığını söylemeyen bir baş kalıyordu.
    ctx.fillStyle = SOLUK
    let etiketPunto = 22
    ctx.font = `800 ${etiketPunto}px ${yazi.baslik}`
    while (etiketPunto > 16 && harfAraliginaGore(ctx, kutu.etiket, 0.09) > genislik - 56) {
      etiketPunto -= 1
      ctx.font = `800 ${etiketPunto}px ${yazi.baslik}`
    }
    const etiket = aralikliKisalt(ctx, kutu.etiket, genislik - 56, 0.09)
    ctx.textAlign = 'left'
    aralikliYaz(ctx, etiket, x + genislik / 2 - harfAraliginaGore(ctx, etiket, 0.09) / 2, y + 128, 0.09)
  })

  // --- Alt imza ---
  const cizgiY = YUKSEKLIK - KENAR - 72
  ctx.beginPath()
  ctx.moveTo(KENAR, cizgiY)
  ctx.lineTo(GENISLIK - KENAR, cizgiY)
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(168,124,36,.35)'
  ctx.stroke()

  ctx.fillStyle = AMBER_SOLUK
  ctx.font = `800 26px ${yazi.baslik}`
  aralikliYaz(ctx, `${ad} · TEK SAYFADA`, KENAR, cizgiY + 52, 0.18)

  ctx.fillStyle = VURGU
  const imza = 'rabi'
  ctx.font = `900 30px ${yazi.baslik}`
  ctx.fillText(imza, GENISLIK - KENAR - ctx.measureText(imza).width, cizgiY + 52)
}

/** Afişteki kutular — ekrandaki kapanış sayfasının aynısı, yalnızca veri olanlar. */
function kapanisKutulari(ozet: AylikOzet): { deger: string; etiket: string; renk: string }[] {
  const kutular: { deger: string; etiket: string; renk: string }[] = []
  if (ozet.okunanKonu > 0) kutular.push({ deger: tamYaz(ozet.okunanKonu), etiket: 'OKUNAN KONU', renk: VURGU })
  if (ozet.calisilanGun > 0) kutular.push({ deger: String(ozet.calisilanGun), etiket: 'GÜN ÇALIŞTIM', renk: VURGU })
  if (ozet.enIyiTyt) kutular.push({ deger: netYaz(ozet.enIyiTyt.net), etiket: 'EN YÜKSEK TYT NETİ', renk: YESIL })
  if (ozet.enIyiAyt) kutular.push({ deger: netYaz(ozet.enIyiAyt.net), etiket: 'EN YÜKSEK AYT NETİ', renk: YESIL })
  if (ozet.pomodoroDakika > 0) kutular.push({ deger: dakikaKisa(ozet.pomodoroDakika), etiket: 'POMODORO SÜRESİ', renk: AMBER_KOYU })
  if (ozet.oyunSoru > 0) kutular.push({ deger: tamYaz(ozet.oyunSoru), etiket: 'MİNİ OYUN SORUSU', renk: AMBER_KOYU })
  const birinci = ozet.ilkUcDers[0]
  if (birinci && kutular.length < 6) kutular.push({ deger: birinci.ders, etiket: 'AYIN DERSİ', renk: VURGU })
  return kutular.slice(0, 6)
}

/** Haftalık çubuklar — ekrandaki soru sayfasının aynısı; zirve haftası turuncu. */
function haftaCubuklariCiz(
  ctx: CanvasRenderingContext2D,
  ozet: AylikOzet,
  x: number,
  y: number,
  genislik: number,
  yukseklik: number,
  yazi: Yazitipleri,
) {
  const haftalar = ozet.haftalar
  const bosluk = 32
  const sutun = (genislik - bosluk * (haftalar.length - 1)) / haftalar.length
  const enYuksek = Math.max(1, ...haftalar.map((h) => h.soru))
  const zirve = haftalar.findIndex((h) => h.soru === enYuksek)
  // Üstte sayı, altta etiket satırı; çubuk alanı ikisi kadar kısalıyor.
  const cubukUst = y + 44
  const cubukAlt = y + yukseklik - 48

  ctx.beginPath()
  ctx.moveTo(x, cubukAlt + 2)
  ctx.lineTo(x + genislik, cubukAlt + 2)
  ctx.lineWidth = 4
  ctx.strokeStyle = 'rgba(168,124,36,.35)'
  ctx.stroke()

  haftalar.forEach((hafta, i) => {
    const sutunX = x + i * (sutun + bosluk)
    const oran = Math.max(0.02, hafta.soru / enYuksek)
    const boy = (cubukAlt - cubukUst) * oran
    const zirveMi = i === zirve

    yuvarlakKutu(ctx, sutunX, cubukAlt - boy, sutun, boy + 20, 22)
    ctx.save()
    ctx.beginPath()
    ctx.rect(sutunX, cubukUst - 40, sutun, cubukAlt - cubukUst + 40)
    ctx.clip()
    yuvarlakKutu(ctx, sutunX, cubukAlt - boy, sutun, boy + 40, 22)
    ctx.fillStyle = zirveMi ? VURGU_PARLAK : 'rgba(208,155,52,.32)'
    ctx.fill()
    ctx.restore()

    ctx.textAlign = 'center'
    ctx.fillStyle = zirveMi ? VURGU : AMBER_SOLUK
    ctx.font = `900 30px ${yazi.baslik}`
    ctx.fillText(tamYaz(hafta.soru), sutunX + sutun / 2, cubukAlt - boy - 16)

    ctx.fillStyle = AMBER_KOYU
    ctx.font = `800 24px ${yazi.baslik}`
    ctx.fillText(hafta.ad, sutunX + sutun / 2, y + yukseklik)
    ctx.textAlign = 'left'
  })
}

/**
 * Harf aralıklı yazı.
 *
 * Tuvalin `letterSpacing`i her tarayıcıda yok (WebView sürümüne bağlı) ve
 * afişteki bütün büyük harfli etiketler aralıklı yazılıyor — aralıksız
 * yazılsalardı tasarımdaki düzenin yarısı kayardı. Harfler tek tek çiziliyor.
 */
function aralikliYaz(
  ctx: CanvasRenderingContext2D,
  metin: string,
  x: number,
  y: number,
  aralik: number,
) {
  const puntosu = puntoOku(ctx)
  let imlec = x
  for (const harf of metin) {
    ctx.fillText(harf, imlec, y)
    imlec += ctx.measureText(harf).width + puntosu * aralik
  }
}

/**
 * Aralıklı yazılan metni sığdıracak kadar kısaltır.
 *
 * `measureText` ile ölçülemiyor: aralık payını saymıyor ve etiketler kutunun
 * kenarından taşıyordu — aralıksız sığan etiket aralıklı sığmıyor.
 */
function aralikliKisalt(
  ctx: CanvasRenderingContext2D,
  metin: string,
  enFazla: number,
  aralik: number,
): string {
  if (harfAraliginaGore(ctx, metin, aralik) <= enFazla) return metin
  let kesik = metin
  while (kesik.length > 1 && harfAraliginaGore(ctx, `${kesik}…`, aralik) > enFazla) {
    kesik = kesik.slice(0, -1)
  }
  return `${kesik}…`
}

/** Aralıklı yazılacak metnin toplam genişliği — kutuyu ona göre ölçmek için. */
function harfAraliginaGore(ctx: CanvasRenderingContext2D, metin: string, aralik: number): number {
  const puntosu = puntoOku(ctx)
  let toplam = 0
  for (const harf of metin) toplam += ctx.measureText(harf).width + puntosu * aralik
  return Math.max(0, toplam - puntosu * aralik)
}

/** `ctx.font` içindeki punto — aralık hesabı buna oranlı. */
function puntoOku(ctx: CanvasRenderingContext2D): number {
  return Number.parseFloat(/(\d+(?:\.\d+)?)px/.exec(ctx.font)?.[1] ?? '16')
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

/** Metni verilen genişliğe sığdıran en büyük punto (üst sınırdan aşağı iner). */
function punto(
  ctx: CanvasRenderingContext2D,
  metin: string,
  enFazla: number,
  baslangic: number,
  aile: string,
  kalinlik = 900,
): number {
  let boy = baslangic
  ctx.font = `${kalinlik} ${boy}px ${aile}`
  while (boy > 30 && ctx.measureText(metin).width > enFazla) {
    boy -= 4
    ctx.font = `${kalinlik} ${boy}px ${aile}`
  }
  return boy
}
