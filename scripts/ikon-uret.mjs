/**
 * Rabi'nin uygulama ikonlarını üretir.
 *
 *   node scripts/ikon-uret.mjs
 *
 * Kaynak tek dosya: `public/tavsan-yuz.png` — uygulamanın her yerinde görünen
 * maskotun ta kendisi. İkon bir süre elle çizilmiş bir SVG tavşandı
 * (`assets/icon-kare.svg`) ve telefonun ana ekranındaki tavşan, uygulamanın
 * içindeki tavşana benzemiyordu; ikisinin ayrı kaynaklardan gelmesi de bunu
 * kalıcı hâle getiriyordu. Artık tek kaynak var: maskot değişirse bu betik
 * yeniden çalıştırılıyor ve ikon da değişiyor.
 *
 * Üretilen dosyalar depoya giriyor (Capacitor `cap sync` sırasında silmiyor)
 * ama elle düzenlenmemeli.
 *
 * Gereken tek araç `sharp` — zaten Next'in bağımlılığı olarak kurulu, yani
 * ikon üretmek için makineye ayrıca bir şey kurmak gerekmiyor (eski betik
 * librsvg ve ImageMagick istiyordu ve Windows'ta hiç çalışmıyordu).
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const kok = join(dirname(fileURLToPath(import.meta.url)), '..')
const res = join(kok, 'android/app/src/main/res')
const KAYNAK = join(kok, 'public/tavsan-yuz.png')

/*
  Zemin markanın iki tonu arasında: sol üstte dolgu tonu (--primary-parlak),
  sağ altta yazı tonu (--primary). Düz tek renk de olurdu ama ikon telefonun
  duvar kâğıdının üstünde tek başına duruyor ve düz turuncu bir kare, yanındaki
  uygulamaların hepsinden daha yassı görünüyordu.
*/
const ACIK = '#D9622F'
const KOYU = '#B3491F'

/** Köşe yuvarlaklığı — kenarın %22'si. Android'in kendi maskesine yakın. */
const KOSE_ORANI = 0.22

/**
 * Maskotun ikon içindeki payı.
 *
 * Eski ikonda tavşan kutunun yarısı kadardı ve ana ekranda turuncu bir
 * kareden ibaret görünüyordu; tanınan şey tavşan, zemin değil.
 */
const MASKOT_ORANI = 0.8

/**
 * Uyarlanabilir ikonun ön planında pay daha küçük.
 *
 * Android 108 birimlik tuvalin yalnızca ortadaki 72'sini gösteriyor (kalanı
 * launcher'ın maskesine ve hareketine ayrılmış); 0.8'de tavşanın kulakları
 * kırpılırdı.
 */
const ONPLAN_ORANI = 0.56

const YOGUNLUKLAR = [
  ['mdpi', 1],
  ['hdpi', 1.5],
  ['xhdpi', 2],
  ['xxhdpi', 3],
  ['xxxhdpi', 4],
]

/**
 * Kaynak görselin kenarındaki beyaz tozu siler.
 *
 * `tavsan-yuz.png` beyaz zeminden kesilmiş: dış hattının çevresinde ve
 * tuvalin kenarlarında soluk (alfa < ~190) beyazımsı pikseller kalmış.
 * Uygulamanın içinde zemin zaten kırık beyaz olduğu için hiç fark
 * edilmiyorlar; turuncu ikonun üstünde tavşanın etrafında bir hâle ve serpilmiş
 * benekler olarak çıkıyorlar.
 *
 * Eşiğin altındaki alfa sıfırlanıyor, üstündeki olduğu gibi kalıyor: kenar
 * sertleşiyor ama görsel 256'dan ~150'ye küçülürken yumuşuyor zaten.
 */
async function temizKaynak() {
  const { data, info } = await sharp(KAYNAK).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 3; i < data.length; i += info.channels) {
    if (data[i] < TOZ_ESIGI) data[i] = 0
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toBuffer()
}

/** Bu eşiğin altındaki alfa, gerçek kenar değil beyaz zemin artığı sayılıyor. */
const TOZ_ESIGI = 190

/** Maskotu saydam tuvalin ortasına oturtur. */
async function maskot(boy, oran) {
  const ic = Math.round(boy * oran)
  // `trim` şart: kaynak görselin çevresinde saydam pay var ve oran onsuz
  // görselin kutusunu değil boşluğunu ölçerdi.
  const resim = await sharp(await temizKaynak()).trim().resize(ic, ic, { fit: 'inside' }).toBuffer()
  const { width, height } = await sharp(resim).metadata()
  return sharp({
    create: { width: boy, height: boy, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      {
        input: resim,
        left: Math.round((boy - width) / 2),
        top: Math.round((boy - height) / 2),
      },
    ])
    .png()
    .toBuffer()
}

/** Zemin + maskot: eski sürüm ikonları ve web ikonu böyle basılıyor. */
async function tamIkon(boy, { yuvarlak = false } = {}) {
  const kose = yuvarlak ? boy / 2 : Math.round(boy * KOSE_ORANI)
  const zemin = Buffer.from(
    `<svg width="${boy}" height="${boy}" xmlns="http://www.w3.org/2000/svg">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${ACIK}"/><stop offset="1" stop-color="${KOYU}"/>` +
      `</linearGradient></defs>` +
      `<rect width="${boy}" height="${boy}" rx="${kose}" ry="${kose}" fill="url(#g)"/></svg>`,
  )
  return sharp(zemin)
    .composite([{ input: await maskot(boy, MASKOT_ORANI) }])
    .png()
    .toBuffer()
}

/**
 * Bildirim çubuğunun simgesi — beyaz siluet.
 *
 * Android durum çubuğunda yalnızca **alfa kanalını** kullanıyor: renkli bir
 * ikon orada beyaz bir lekeye dönüşüyor ve bildirimin hangi uygulamadan
 * geldiği anlaşılmıyordu. Silueti maskotun kendi saydamlığından çıkarıyoruz,
 * yani kulaklarıyla birlikte tanınan tavşan.
 *
 * Eşik (`threshold`) bıyıkları ayıklıyor: soluk pikseller 24dp'de gri bir
 * bulanıklığa dönüşüyor, siluet olarak okunmuyor.
 */
async function bildirimSimgesi(boy) {
  const ic = Math.round(boy * 0.86)
  const kirpik = await sharp(await temizKaynak()).trim().resize(ic, ic, { fit: 'inside' }).toBuffer()
  const { width, height } = await sharp(kirpik).metadata()
  const alfa = await sharp(kirpik).extractChannel('alpha').threshold(140).toBuffer()
  const siluet = await sharp({
    create: { width, height, channels: 3, background: '#ffffff' },
  })
    .joinChannel(alfa)
    .png()
    .toBuffer()

  return sharp({
    create: { width: boy, height: boy, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: siluet, left: Math.round((boy - width) / 2), top: Math.round((boy - height) / 2) },
    ])
    .png()
    .toBuffer()
}

console.log('» Uyarlanabilir ikonun ön planı')
for (const [ad, kat] of YOGUNLUKLAR) {
  const boy = Math.round(108 * kat)
  await mkdir(join(res, `mipmap-${ad}`), { recursive: true })
  await writeFile(join(res, `mipmap-${ad}/ic_launcher_foreground.png`), await maskot(boy, ONPLAN_ORANI))
}

console.log('» Eski sürüm ikonları (kare ve yuvarlak)')
// Android 8 öncesi uyarlanabilir ikonu tanımıyor; zemini basılmış hazır görsel
// gerekiyor. Yuvarlağı da ayrı: maskeyi sistem uygulamıyor.
for (const [ad, kat] of YOGUNLUKLAR) {
  const boy = Math.round(48 * kat)
  await writeFile(join(res, `mipmap-${ad}/ic_launcher.png`), await tamIkon(boy))
  await writeFile(join(res, `mipmap-${ad}/ic_launcher_round.png`), await tamIkon(boy, { yuvarlak: true }))
}

console.log('» Bildirim simgesi')
for (const [ad, kat] of YOGUNLUKLAR) {
  await mkdir(join(res, `drawable-${ad}`), { recursive: true })
  await writeFile(join(res, `drawable-${ad}/ic_bildirim.png`), await bildirimSimgesi(Math.round(24 * kat)))
}

console.log('» Web ikonları')
await writeFile(join(kok, 'public/icon-512.png'), await tamIkon(512))
await writeFile(join(kok, 'public/icon-192.png'), await tamIkon(192))

console.log('bitti')
