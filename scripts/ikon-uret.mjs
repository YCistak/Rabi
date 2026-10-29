/**
 * Rabi'nin uygulama ikonlarını üretir.
 *
 *   node scripts/ikon-uret.mjs
 *
 * Üretilen dosyalar depoya giriyor (Capacitor onları `cap sync` sırasında
 * silmiyor) ama **elle düzenlenmemeli** — ikon değişecekse `assets/ikon/
 * rabi-ikon-kaynak.png` değiştirilip betik yeniden çalıştırılmalı.
 *
 * ## Kaynak
 *
 * `assets/ikon/rabi-ikon-kaynak.png`: 1024 piksellik düz kare, yalnız tavşanın
 * KAFASI (gövde yok), turuncu zemin üzerinde. Kullanıcının verdiği görselden
 * kırpıldı, çene altındaki gövde zemin rengiyle silindi. Uygulama içindeki
 * maskot (`public/tavsan-*.png`) ikondan bağımsız: ikon artık onu kullanmıyor.
 *
 * Zemin rengi kaynağın köşelerinden örnekleniyor. Uyarlanabilir ikonda
 * arka plan bu düz renk, ön plan ise kaynağın küçültülmüş hâli; ön planın
 * kenarları saydamlığa eriyor, böylece iki katman arasında dikiş görünmüyor.
 *
 * ## Güvenli alan
 *
 * Kafa kaynağın yaklaşık %90 yüksekliğinde; kulak uçları ve çene merkezden
 * kaynak kenarının ~%0,50'si kadar uzakta (`KAFA.r`). Android'in uyarlanabilir
 * ikonu ortadaki %66'lık daireyi (yarıçap %33), web "maskable" ise %80'lik
 * daireyi (yarıçap %40) kırpmadan gösteriyor; görsel buna göre küçültülüyor
 * (kafa dairesi güvenli dairenin biraz içinde kalsın diye pay bırakıldı).
 */

import { Buffer } from 'node:buffer'
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const kok = join(dirname(fileURLToPath(import.meta.url)), '..')
const res = join(kok, 'android/app/src/main/res')
const KAYNAK = join(kok, 'assets/ikon/rabi-ikon-kaynak.png')

/**
 * Kafayı (kulak uçları ve çene dahil) çevreleyen en küçük dairenin merkezi ve
 * yarıçapı, kaynak kenarına oran olarak ölçüldü: kafa dairesi ortada değil,
 * hafif yukarıda ve sola yakın.
 */
const KAFA = { x: 0.497, y: 0.482, r: 0.496 }

/** Android yoğunlukları: uyarlanabilir ikonun 108 biriminin piksel karşılığı. */
const YOGUNLUKLAR = [
  ['mdpi', 48, 108],
  ['hdpi', 72, 162],
  ['xhdpi', 96, 216],
  ['xxhdpi', 144, 324],
  ['xxxhdpi', 192, 432],
]

/** Uyarlanabilir ikonda kafa görselinin tuvale oranı (güvenli alan %66). */
const ADAPTIF_ORAN = 0.65
/** Web maskable'da (güvenli alan %80). */
const MASKELENEBILIR_ORAN = 0.8
/** Yuvarlak eski ikonda görselin küçülmesi: daire köşeleri yer, kulaklar sınıra yaklaşmasın. */
const YUVARLAK_ORAN = 0.88

/**
 * Köşe eğrisi daire değil "squircle" (iOS'un yumuşak köşesi gibi). `pay`
 * köşeden kenar boyunca kaç oran ilerlendiği, `tut` Bézier tutamağının
 * köşeye yakınlığı.
 */
const KOSE = { pay: 0.2095, tut: 0.48 }

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

/** Kaynağın dört köşesinden (16x16'lık bloklar) ortalama zemin rengi. */
async function zeminRengi() {
  const { data, info } = await sharp(KAYNAK).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const n = 16
  const toplam = [0, 0, 0]
  let say = 0
  for (const [x0, y0] of [
    [0, 0],
    [info.width - n, 0],
    [0, info.height - n],
    [info.width - n, info.height - n],
  ]) {
    for (let y = y0; y < y0 + n; y++) {
      for (let x = x0; x < x0 + n; x++) {
        for (let c = 0; c < 3; c++) toplam[c] += data[(y * info.width + x) * info.channels + c]
        say++
      }
    }
  }
  const [r, g, b] = toplam.map((t) => Math.round(t / say))
  return { r, g, b }
}

const ZEMIN = await zeminRengi()
const zeminDuz = (kenar) =>
  sharp({ create: { width: kenar, height: kenar, channels: 4, background: { ...ZEMIN, alpha: 1 } } })

/** Kaynağın `yan` pikselliğe küçültülmüş hâli; `erit` ise kenarları saydamlığa eritir. */
async function gorsel(yan, erit = false) {
  const g = await sharp(KAYNAK).removeAlpha().resize(yan, yan).ensureAlpha().png().toBuffer()
  if (!erit) return g
  // Kenardan %7 içeride tam opak, kenarda saydam: yumuşak bir dikdörtgen maske.
  const pay = Math.round(yan * 0.07)
  const maske = await sharp({
    create: { width: yan, height: yan, channels: 4, background: '#000' },
  })
    .composite([
      {
        input: {
          create: { width: yan - 2 * pay, height: yan - 2 * pay, channels: 4, background: '#fff' },
        },
        left: pay,
        top: pay,
      },
    ])
    .blur(Math.max(0.5, pay / 2.5))
    .extractChannel(0)
    .raw()
    .toBuffer()
  return sharp(g)
    .removeAlpha()
    .joinChannel(maske, { raw: { width: yan, height: yan, channels: 1 } })
    .png()
    .toBuffer()
}

/** Kafa dairesinin merkezini tuvalin ortasına getirerek yerleştirir. */
async function yerlestir(tuval, oran, erit) {
  const yan = Math.round(tuval * oran)
  return {
    input: await gorsel(yan, erit),
    left: Math.round(tuval / 2 - KAFA.x * yan),
    top: Math.round(tuval / 2 - KAFA.y * yan),
  }
}

/** Zemin + kafa katmanı (düz renk üstüne), isteğe bağlı maskeli. */
async function katmanli(tuval, oran, erit = true) {
  return zeminDuz(tuval)
    .composite([await yerlestir(tuval, oran, erit)])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/** Tam ikon: görsel tuvali dolduruyor; `maske` squircle, daire ya da yok. */
async function ikon(kenar, { maske = 'squircle', oran = 1 } = {}) {
  let taban
  if (oran === 1) {
    taban = await sharp(KAYNAK).removeAlpha().resize(kenar, kenar).ensureAlpha().png().toBuffer()
  } else {
    taban = await katmanli(kenar, oran)
  }
  if (maske === 'yok') return taban
  const sekil =
    maske === 'squircle'
      ? `<path d="${squircle(kenar)}" fill="#fff"/>`
      : `<circle cx="${kenar / 2}" cy="${kenar / 2}" r="${kenar / 2}" fill="#fff"/>`
  return sharp(taban)
    .composite([
      {
        input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${kenar}" height="${kenar}">${sekil}</svg>`),
        blend: 'dest-in',
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/** Uyarlanabilir ikonun ön planı: yalnız kafa görseli, kenarları saydama eriyor. */
async function onPlan(tuval) {
  return sharp({
    create: { width: tuval, height: tuval, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([await yerlestir(tuval, ADAPTIF_ORAN, true)])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

const yaz = async (yol, veri) => {
  await writeFile(yol, veri)
  console.log('  ' + yol.slice(kok.length + 1).replace(/\\/g, '/'))
}

console.log(`» Zemin rengi: rgb(${ZEMIN.r}, ${ZEMIN.g}, ${ZEMIN.b})`)

console.log('» Web ikonları')
for (const boy of [192, 512]) await yaz(join(kok, `public/icon-${boy}.png`), await ikon(boy))
// Maskelenebilir sürüm: köşeler yuvarlatılmıyor, zemin kenara kadar sürüyor ve
// kafa ortadaki güvenli daireye (%80) oturuyor.
await yaz(join(kok, 'public/icon-maskelenebilir-512.png'), await katmanli(512, MASKELENEBILIR_ORAN))

console.log('» Uyarlanabilir ikon (zemin + ön plan)')
for (const [ad, , tuval] of YOGUNLUKLAR) {
  await yaz(join(res, `mipmap-${ad}/ic_launcher_background.png`), await zeminDuz(tuval).png({ compressionLevel: 9 }).toBuffer())
  await yaz(join(res, `mipmap-${ad}/ic_launcher_foreground.png`), await onPlan(tuval))
}

console.log('» Eski sürüm ikonları (kare ve yuvarlak)')
// Android 8 öncesi uyarlanabilir ikonu tanımıyor; maskeyi de sistem uygulamıyor,
// dosyanın kendisi kare ya da yuvarlak olmalı.
for (const [ad, boy] of YOGUNLUKLAR) {
  await yaz(join(res, `mipmap-${ad}/ic_launcher.png`), await ikon(boy, { maske: 'yok' }))
  await yaz(join(res, `mipmap-${ad}/ic_launcher_round.png`), await ikon(boy, { maske: 'daire', oran: YUVARLAK_ORAN }))
}

console.log('» iOS ikonu')
// Tek dosya, 1024; köşeler yuvarlatılmıyor (maskeyi iOS uyguluyor). Alfa
// kanalı **atılıyor**: App Store saydamlığı olan ikonu reddediyor.
await yaz(
  join(kok, 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'),
  await sharp(await ikon(1024, { maske: 'yok' })).removeAlpha().png({ compressionLevel: 9 }).toBuffer(),
)

console.log('bitti')
