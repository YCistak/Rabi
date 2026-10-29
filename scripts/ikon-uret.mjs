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
 * arka plan bu düz renk, ön plan ise kaynağın büyütülmüş hâli.
 *
 * ## Kadraj kuralı: küçültme yok
 *
 * Kaynak kadrajı (kulak uçları üst kenara, yanaklar yan kenarlara, çene alt
 * kenara yakın) ikonun kendisidir; hiçbir çıktıda küçültülüp etrafına zemin
 * eklenmez. Kullanıcı büyük kafa istiyor, güvenli alan için küçültme reddedildi.
 *
 * - iOS, Android eski tip, web 192/512: kaynak tam kadraj.
 * - Android uyarlanabilir: 108 birimlik katmanın ortadaki 72 birimi (%66,7)
 *   kaynağın tamamını gösterir; yani ön planda kaynak tuvalin %66,7'si boyunda
 *   ortalanır (kaynak ölçüsü görünen alanla BİREBİR aynı, ekstra küçültme yok).
 *   Daire maskeli launcher'da kulak uçları ve yanak kenarları biraz kesilir.
 * - Web maskable: görünen alan (%80) kaynağın tamamı; kaynak tuvalin %80'i boyunda
 *   zemin üstüne ortalanır.
 */

import { Buffer } from 'node:buffer'
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const kok = join(dirname(fileURLToPath(import.meta.url)), '..')
const res = join(kok, 'android/app/src/main/res')
const KAYNAK = join(kok, 'assets/ikon/rabi-ikon-kaynak.png')

/** Android yoğunlukları: uyarlanabilir ikonun 108 biriminin piksel karşılığı. */
const YOGUNLUKLAR = [
  ['mdpi', 48, 108],
  ['hdpi', 72, 162],
  ['xhdpi', 96, 216],
  ['xxhdpi', 144, 324],
  ['xxxhdpi', 192, 432],
]

/** Uyarlanabilir ikonda görünen kısım (108 birimin 72'si): kaynak tam bu oranda yer alır. */
const ADAPTIF_GORUNEN = 72 / 108
/** Web maskable'da görünen güvenli alan. */
const MASKELENEBILIR_GORUNEN = 0.8

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

/**
 * Kaynağın tamamı tuvalin ortasında `gorunen` oranında yer alır (görünen alanı
 * tam doldurur); çevresi `zemin` ya da saydam. Kaynak kenarı zemin rengiyle
 * aynı düz renkte olduğundan katmanlar arasında dikiş görünmez.
 */
async function yerlestirilmis(tuval, gorunen, zemin) {
  const yan = Math.round(tuval * gorunen)
  const sol = Math.round((tuval - yan) / 2)
  const taban = zemin ? zeminDuz(tuval) : sharp({ create: { width: tuval, height: tuval, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  return taban
    .composite([{ input: await sharp(KAYNAK).removeAlpha().resize(yan, yan).png().toBuffer(), left: sol, top: sol }])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/** Tam ikon: kaynak tuvali tam dolduruyor; `maske` squircle, daire ya da yok. */
async function ikon(kenar, { maske = 'squircle' } = {}) {
  const taban = await sharp(KAYNAK).removeAlpha().resize(kenar, kenar).ensureAlpha().png().toBuffer()
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

/** Uyarlanabilir ikonun ön planı: kaynak görünen alanı (72/108) tam dolduracak boyda, çevresi saydam. */
const onPlan = (tuval) => yerlestirilmis(tuval, ADAPTIF_GORUNEN, false)

const yaz = async (yol, veri) => {
  await writeFile(yol, veri)
  console.log('  ' + yol.slice(kok.length + 1).replace(/\\/g, '/'))
}

console.log(`» Zemin rengi: rgb(${ZEMIN.r}, ${ZEMIN.g}, ${ZEMIN.b})`)

console.log('» Web ikonları')
for (const boy of [192, 512]) await yaz(join(kok, `public/icon-${boy}.png`), await ikon(boy))
// Maskelenebilir sürüm: köşeler yuvarlatılmıyor; görünen alan (%80) kaynağın tamamı.
await yaz(join(kok, 'public/icon-maskelenebilir-512.png'), await yerlestirilmis(512, MASKELENEBILIR_GORUNEN, true))

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
  await yaz(join(res, `mipmap-${ad}/ic_launcher_round.png`), await ikon(boy, { maske: 'daire' }))
}

console.log('» iOS ikonu')
// Tek dosya, 1024; köşeler yuvarlatılmıyor (maskeyi iOS uyguluyor). Alfa
// kanalı **atılıyor**: App Store saydamlığı olan ikonu reddediyor.
await yaz(
  join(kok, 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'),
  await sharp(await ikon(1024, { maske: 'yok' })).removeAlpha().png({ compressionLevel: 9 }).toBuffer(),
)

console.log('bitti')
