/**
 * Rabi'nin uygulama ikonlarını üretir.
 *
 *   node scripts/ikon-uret.mjs
 *
 * Üretilen dosyalar depoya giriyor (Capacitor onları `cap sync` sırasında
 * silmiyor) ama **elle düzenlenmemeli** — ikon değişecekse buradaki sayılar
 * düzeltilip betik yeniden çalıştırılmalı.
 *
 * ## Maskot çizilmiyor, gömülüyor
 *
 * Eski betik (`ikon-uret.sh`) maskotu elle çizilmiş elipslerden kuruyordu ve
 * uygulamanın gerçek tavşanına benzemiyordu: ikondaki yüz ile açılış
 * ekranındaki yüz iki ayrı tavşandı. Artık ikon da `public/tavsan-yuz.png`
 * kullanıyor — uygulamanın her yerinde aynı maskot.
 *
 * Bunun bedeli: kaynak artık saf vektör değil, o yüzden `rsvg-convert` +
 * ImageMagick yerine `sharp` ile üretiliyor (zaten Next'in bağımlılığı, ayrıca
 * Windows'ta rsvg/magick yok).
 *
 * ## Ölçüler nereden geliyor
 *
 * Tasarımın verdiği 179 piksellik ikondan ölçüldü; hepsi kenar uzunluğuna
 * **oran** olarak yazılı, çünkü aynı geometri 48 pikselden 512 piksele kadar
 * her yoğunlukta ve ayrıca Android'in 108 birimlik uyarlanabilir tuvalinde
 * yeniden kuruluyor.
 */

import { Buffer } from 'node:buffer'
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const kok = join(dirname(fileURLToPath(import.meta.url)), '..')
const res = join(kok, 'android/app/src/main/res')

/** Maskot dosyası ve içindeki tavşanın (saydam kenarlar hariç) sınırları. */
const MASKOT = {
  dosya: join(kok, 'public/tavsan-yuz.png'),
  tuval: 256,
  sol: 27,
  ust: 3,
  en: 204,
  boy: 253,
}

/**
 * Zemin degradesi iki parça: dairenin dışı ve içi. İkisi de kenar uzunluğuna
 * oranlanmış koordinatlarda (0..1) `a + b·x + c·y` ile yazılı — tuval ikonun
 * kendi karesinden büyük olduğunda (uyarlanabilir ikonun 108 birimlik alanı)
 * renk kesilmeden dışarı doğru sürsün diye. Uçlara sabit renk yazılsaydı
 * kenarlar tek düze bir bantla biterdi.
 */
const ZEMIN = {
  dis: { r: [225.73, -19.94, -37.86], g: [118.01, -18.58, -33.81], b: [47.24, -7.86, -14.36] },
  ic: { r: [229.43, -21.71, -36.1], g: [131.91, -20.96, -34.37], b: [67.69, -11.76, -17.76] },
}

/** Üst soldaki açık daire: içi ayrı degradeyle boyanıyor. */
const DAIRE = { x: 0.3268, y: 0.274, r: 0.4184 }

/**
 * Köşe eğrisi daire değil "squircle": iOS'un yumuşak köşesi gibi kenara daha
 * geç yaklaşıyor. `pay` köşeden kenar boyunca kaç oran ilerlendiği, `tut`
 * Bézier tutamağının köşeye ne kadar yaklaştığı — dairede 0,5523 olurdu,
 * ölçülen ikona 0,48 oturuyor.
 */
const KOSE = { pay: 0.2095, tut: 0.48 }

/** Tavşanın ikon karesindeki yeri: eni kenarın %56'sı, ortası tam ortada. */
const YERLESIM = { en: 0.5642, x: 0.4916, y: 0.4916 }

/** Android yoğunlukları: uyarlanabilir ikonun 108 biriminin piksel karşılığı. */
const YOGUNLUKLAR = [
  ['mdpi', 48, 108],
  ['hdpi', 72, 162],
  ['xhdpi', 96, 216],
  ['xxhdpi', 144, 324],
  ['xxxhdpi', 192, 432],
]

/**
 * Uyarlanabilir ikonda sistemin kırpmadan gösterdiği alan 108 birimin
 * ortasındaki 72 birim; ikon karesi oraya oturuyor, zemin dışarı taşıyor.
 */
const GUVENLI_ORAN = 72 / 108

const kirp = (s) => Math.max(0, Math.min(255, Math.round(s)))
const onalti = (s) => kirp(s).toString(16).padStart(2, '0')
const renk = (model, x, y) =>
  '#' +
  onalti(model.r[0] + model.r[1] * x + model.r[2] * y) +
  onalti(model.g[0] + model.g[1] * x + model.g[2] * y) +
  onalti(model.b[0] + model.b[1] * x + model.b[2] * y)

/**
 * Renk modelini SVG'nin anlayacağı iki uçlu degradeye çevirir. SVG tek eksen
 * boyunca ara değer bulabiliyor, o yüzden ekseni üç kanalın ortak yönünden
 * kuruyoruz; kanalların yönleri arasındaki fark bir birimin altında.
 */
function degrade(model, kimlik, kutu) {
  const yonler = [model.r, model.g, model.b].map(([, b, c]) => {
    const boy = Math.hypot(b, c)
    return [b / boy, c / boy]
  })
  let ux = yonler.reduce((t, [x]) => t + x, 0) / 3
  let uy = yonler.reduce((t, [, y]) => t + y, 0) / 3
  const boy = Math.hypot(ux, uy)
  ;(ux /= boy), (uy /= boy)

  // Degrade çizgisi tuvalin tamamını örtmeli: köşelerin izdüşümünden uçları al.
  const kose = [
    [kutu.x0, kutu.y0],
    [kutu.x1, kutu.y0],
    [kutu.x0, kutu.y1],
    [kutu.x1, kutu.y1],
  ].map(([x, y]) => x * ux + y * uy)
  const bas = Math.min(...kose)
  const son = Math.max(...kose)

  return `<linearGradient id="${kimlik}" gradientUnits="userSpaceOnUse"
      x1="${(ux * bas).toFixed(3)}" y1="${(uy * bas).toFixed(3)}"
      x2="${(ux * son).toFixed(3)}" y2="${(uy * son).toFixed(3)}">
      <stop offset="0" stop-color="${renk(model, ux * bas, uy * bas)}"/>
      <stop offset="1" stop-color="${renk(model, ux * son, uy * son)}"/>
    </linearGradient>`
}

/** Yumuşak köşeli kare (squircle) yolu. */
function squircle(kenar) {
  const p = KOSE.pay * kenar
  const t = p * (1 - KOSE.tut)
  const k = kenar
  return (
    `M ${p} 0 H ${k - p}` +
    ` C ${k - t} 0 ${k} ${t} ${k} ${p}` +
    ` V ${k - p} C ${k} ${k - t} ${k - t} ${k} ${k - p} ${k}` +
    ` H ${p} C ${t} ${k} 0 ${k - t} 0 ${k - p}` +
    ` V ${p} C 0 ${t} ${t} 0 ${p} 0 Z`
  )
}

/**
 * Zemin SVG'si. `kenar` ikon karesinin piksel karşılığı, `tasma` ise karenin
 * her yanından ne kadar daha boyanacağı (uyarlanabilir ikonda sıfırdan büyük).
 * `maske` kırpmayı belirliyor: kare ikonda squircle, yuvarlakta daire,
 * uyarlanabilir zeminde yok — orada maskeyi sistem uyguluyor.
 */
function zeminSvg(kenar, tasma = 0, maske = 'squircle') {
  const tuval = kenar + 2 * tasma
  const kutu = {
    x0: -tasma / kenar,
    y0: -tasma / kenar,
    x1: (kenar + tasma) / kenar,
    y1: (kenar + tasma) / kenar,
  }
  // Degradeler ikon karesinin 0..1 uzayında; tuvalin kayması tek bir taşımayla.
  const kirpma =
    maske === 'squircle'
      ? `<path d="${squircle(1)}"/>`
      : maske === 'daire'
        ? `<circle cx="0.5" cy="0.5" r="0.5"/>`
        : `<rect x="${kutu.x0}" y="${kutu.y0}" width="${kutu.x1 - kutu.x0}" height="${kutu.y1 - kutu.y0}"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${tuval}" height="${tuval}" viewBox="${kutu.x0} ${kutu.y0} ${kutu.x1 - kutu.x0} ${kutu.y1 - kutu.y0}">
  <defs>
    ${degrade(ZEMIN.dis, 'dis', kutu)}
    ${degrade(ZEMIN.ic, 'ic', kutu)}
    <clipPath id="maske" clipPathUnits="userSpaceOnUse">${kirpma}</clipPath>
  </defs>
  <g clip-path="url(#maske)">
    <rect x="${kutu.x0}" y="${kutu.y0}" width="${kutu.x1 - kutu.x0}" height="${kutu.y1 - kutu.y0}" fill="url(#dis)"/>
    <circle cx="${DAIRE.x}" cy="${DAIRE.y}" r="${DAIRE.r}" fill="url(#ic)"/>
  </g>
</svg>`
}

/**
 * Maskotun saydamlığındaki JPEG kalıntısını siler. `tavsan-yuz.png` sıkıştırılmış
 * bir kaynaktan geliyor ve kenarında beyaza yakın, yarı saydam bir toz halkası
 * taşıyor. 179 piksellik tasarımda görünmüyor ama ikon 512'ye büyütülünce turuncu
 * zeminin üstünde noktalı bir hâle oluyor. Eşiğin altı siliniyor, üstü açılıyor;
 * sert bir ikili eşik kenarları tırtıklardı, bıyıklar da o aralıkta duruyor.
 */
async function maskotTemiz() {
  const { data, info } = await sharp(MASKOT.dosya).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const [alt, ust] = [140, 230]
  for (let i = 3; i < data.length; i += 4) {
    data[i] = kirp(((data[i] - alt) / (ust - alt)) * 255)
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/** Maskotun verilen tuvaldeki ölçüsü ve yeri. */
function maskotYeri(kenar, tasma = 0, kucult = 1) {
  const olcek = (YERLESIM.en * kenar * kucult) / MASKOT.en
  return {
    boy: Math.round(MASKOT.tuval * olcek),
    sol: Math.round(YERLESIM.x * kenar + tasma - (MASKOT.sol + MASKOT.en / 2) * olcek),
    ust: Math.round(YERLESIM.y * kenar + tasma - (MASKOT.ust + MASKOT.boy / 2) * olcek),
  }
}

async function maskotKatmani(kenar, tasma = 0, kucult = 1) {
  const { boy, sol, ust } = maskotYeri(kenar, tasma, kucult)
  return {
    input: await sharp(await maskotTemiz()).resize(boy, boy, { fit: 'fill' }).png().toBuffer(),
    left: sol,
    top: ust,
  }
}

/** Zemin + maskot: tam ikon. */
async function ikon(kenar, { tasma = 0, maske = 'squircle', kucult = 1 } = {}) {
  const tuval = kenar + 2 * tasma
  return sharp(Buffer.from(zeminSvg(kenar, tasma, maske)))
    .resize(tuval, tuval)
    .composite([await maskotKatmani(kenar, tasma, kucult)])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/** Uyarlanabilir ikonun ön planı: zemin yok, yalnızca maskot. */
async function onPlan(tuval) {
  const kenar = tuval * GUVENLI_ORAN
  const tasma = (tuval - kenar) / 2
  return sharp({
    create: { width: tuval, height: tuval, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([await maskotKatmani(kenar, tasma)])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

const yaz = async (yol, veri) => {
  await writeFile(yol, veri)
  console.log('  ' + yol.slice(kok.length + 1).replace(/\\/g, '/'))
}

console.log('» Web ikonları')
for (const boy of [192, 512]) await yaz(join(kok, `public/icon-${boy}.png`), await ikon(boy))
// Maskelenebilir sürüm: köşeler yuvarlatılmıyor, zemin kenara kadar sürüyor ve
// ikon karesi ortadaki %80'e oturuyor. Yuvarlatılmış olanı verilseydi işletim
// sistemi kendi maskesini uygularken köşelerde saydam boşluk kalırdı.
{
  const kenar = 512 * 0.8
  await yaz(
    join(kok, 'public/icon-maskelenebilir-512.png'),
    await ikon(kenar, { tasma: (512 - kenar) / 2, maske: 'yok' }),
  )
}

console.log('» Uyarlanabilir ikon (zemin + ön plan)')
for (const [ad, , tuval] of YOGUNLUKLAR) {
  const kenar = tuval * GUVENLI_ORAN
  await yaz(
    join(res, `mipmap-${ad}/ic_launcher_background.png`),
    await ikon(kenar, { tasma: (tuval - kenar) / 2, maske: 'yok' }),
  )
  await yaz(join(res, `mipmap-${ad}/ic_launcher_foreground.png`), await onPlan(tuval))
}

console.log('» Eski sürüm ikonları (kare ve yuvarlak)')
// Android 8 öncesi uyarlanabilir ikonu tanımıyor; maskeyi de sistem uygulamıyor,
// dosyanın kendisi kare ya da yuvarlak olmalı. Yuvarlakta maskot biraz küçülüyor:
// daire karenin köşelerini yediği için kulak uçları sınıra çok yaklaşıyordu.
for (const [ad, boy] of YOGUNLUKLAR) {
  await yaz(join(res, `mipmap-${ad}/ic_launcher.png`), await ikon(boy))
  await yaz(join(res, `mipmap-${ad}/ic_launcher_round.png`), await ikon(boy, { maske: 'daire', kucult: 0.88 }))
}

console.log('bitti')
