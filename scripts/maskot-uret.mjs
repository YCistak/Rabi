/**
 * Rabi'nin maskot pozlarını üretir.
 *
 *   node scripts/maskot-uret.mjs
 *
 * Kaynak `assets/maskot/*.jpeg`, çıktı `public/tavsan-*.png`. Üretilen dosyalar
 * depoya giriyor ama **elle düzenlenmemeli** — poz değişecekse kaynak JPEG
 * değiştirilip betik yeniden çalıştırılmalı. `ikon-uret.mjs` ile aynı gerekçe.
 *
 * ## Neden bir betik gerekiyor
 *
 * Kaynaklar 2048'lik JPEG ve zeminleri **siyah**; uygulamanın zemini kırık
 * beyaz. Doğrudan konsalardı her maskot siyah bir karenin içinde dururdu.
 * Üstelik JPEG'in kendi sıkıştırma gürültüsü kenarlarda gri bir hâle bırakıyor.
 *
 * ## Zemin taşma ile bulunuyor, eşikle değil
 *
 * "Karanlık pikseli sil" kuralı ilk denenen yoldu ve maskotun **içini** de
 * siliyordu: gözlerin bebeği, kitabın kahverengi kapağı, kupanın gölgesi hep
 * eşiğin altında. Zemin bu yüzden kenardan taşırılarak bulunuyor — silinen
 * şey "karanlık olan" değil, "karanlık olan ve kenara bağlı olan".
 *
 * ## Kenar yumuşaklığı kürkten geliyor
 *
 * Taşma ikili bir maske veriyor ve tek başına kullanılsaydı kürk tırtıklı
 * kesilirdi. Zemine komşu birkaç piksellik bantta saydamlık parlaklıktan
 * okunuyor: siyah zeminin üstündeki yarı saydam kürk zaten `alfa × renk` olarak
 * kaydedilmiş durumda, o çarpım geri bölünüyor. Bölünmeseydi kenarlar
 * uygulamanın açık zemininde koyu bir çizgi olarak kalırdı.
 *
 * ## Pozların boyu eşitleniyor
 *
 * Her poz kendi kutusuna kırpılıp aynı kare tuvalde **aynı yükseklikte**
 * duruyor. Eşitlenmeseydi ana sayfadaki maskot poz değiştirdiğinde büyüyüp
 * küçülürdü — ölçüyü veren yer `Rabi` bileşeni ve o boyu tek bir sayı olarak
 * biliyor.
 */

import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const kok = join(dirname(fileURLToPath(import.meta.url)), '..')
const kaynakKlasoru = join(kok, 'assets/maskot')
const cikisKlasoru = join(kok, 'public')

/** Çıktı tuvali. Eski maskotlar da 256'ydı; `Rabi` kutusuna oturan ölçü bu. */
const TUVAL = 256

/** Maskotun tuval içindeki yüksekliği (oran). Kenarda pay bırakıyor. */
const DOLULUK = 0.94

/**
 * Kenara bağlı bir pikselin "zemin" sayılması için parlaklık sınırı.
 *
 * Kaynaklar tam siyah zeminli ama JPEG gürültüsü onu 0'da tutmuyor; 30'un
 * altında kalan her şey zemin. Maskotun en koyu yeri (göz bebeği) bunun
 * üstünde ve zaten kenara bağlı değil.
 */
const ZEMIN_SINIRI = 30

/** Saydamlığın okunduğu bandın kalınlığı (piksel, 2048'lik kaynakta). */
const BANT = 4

/**
 * Bantta parlaklığın saydamlığa çevrildiği aralık.
 *
 * Üst uç maskotun kürkünün parlaklığı: siyah zeminin üstünde tam opak bir kürk
 * pikseli bu değere yakın okunuyor, dolayısıyla ondan sonrası tam opak sayılıyor.
 * Alt uç JPEG gürültüsünü eliyor.
 */
const [BANT_ALT, BANT_UST] = [16, 190]

/**
 * Üretilecek pozlar: çıktı adı → kaynak dosya.
 *
 * Kaynak klasöründeki her JPEG kullanılmıyor. Dışarıda kalanların gerekçesi:
 * "sinirli" (ve onun ikinci kopyası "uyuyan") uygulamada karşılığı olmayan bir
 * ruh hâli — Rabi kullanıcıya kızmıyor; "sevinen 1/3" ile "çubuk tutan 1/2"
 * seçilenlerin başka açıdan çekilmiş eşleri.
 */
const POZLAR = [
  { ad: 'tavsan-tam', kaynak: 'normal maskot.jpeg' },
  { ad: 'tavsan-el-sallayan', kaynak: 'selam veren maskot.jpeg' },
  { ad: 'tavsan-okuyan', kaynak: 'kitap okuyan maskot.jpeg' },
  { ad: 'tavsan-kupali', kaynak: 'kupa kaldıran maskot.jpeg' },
  { ad: 'tavsan-sevinen', kaynak: 'sevinen maskot 2.jpeg' },
  { ad: 'tavsan-uzgun', kaynak: 'üzülen maskot.jpeg' },
  { ad: 'tavsan-dusunen', kaynak: 'düşünen maskot.jpeg' },
  { ad: 'tavsan-kahveli', kaynak: 'kahve içen maskot.jpeg' },
  { ad: 'tavsan-isaretci', kaynak: 'çubuk tutan maskot 3.jpeg' },
  // Kafa: `tavsan-yuz`ün elle kırpılmış hâlinin aksine kaynağın kendisi zaten
  // baş çekimi — kırpma gerekmiyor, kulaklar da tam giriyor. Ana sayfanın
  // selamlaması ve açılış tavşanı bunu kullanıyor.
  { ad: 'tavsan-kafa', kaynak: 'kafası gözüken maskot.jpeg' },
  // Zıplayan sevinç: `tavsan-sevinen`den ayrı bir poz, çünkü ikisi aynı anda
  // kullanılıyor — bu, günlük hedefi tutturan kullanıcıya çıkan hâl.
  { ad: 'tavsan-ziplayan', kaynak: 'sevinen maskot 3.jpeg' },
]

/**
 * Yüz kırpımı: `tavsan-yuz.png`.
 *
 * Ayrı bir çıktı, çünkü tam boy maskot küçük ölçülerde okunmuyor — oyun
 * başlıklarında 26, ana sayfada 58 piksel yer var ve orada gövde bir lekeye
 * dönüşüyor. Aynı dosya uygulama ikonunun (`ikon-uret.mjs`), Android'in engel
 * katmanının ve pomodoro bildiriminin de kaynağı; hepsinde görülen şey bir yüz.
 *
 * Kutu kaynağın kendi piksel uzayında (2048) ve kulakların ucundan **boyna**
 * kadarını alıyor. İki ölçü de ölçülerek bulundu, göz kararı değil:
 *
 * - Alt kenar gövdenin en dar satırı (y≈1160). Daha yukarıda kesmek yanağın
 *   ortasından düz bir çizgi geçiriyordu; daha aşağıda omuzlar başlıyor ve
 *   kırpım yüz olmaktan çıkıyor.
 * - Yan kenarlar yanakların en geniş satırından (x 606–1446) pay bırakılarak
 *   alındı; ilk denemede sağ yanak kutunun dışında kalmıştı.
 */
const YUZ = { kaynak: 'normal maskot.jpeg', sol: 590, ust: 15, en: 870, boy: 1150 }

/**
 * Parlaklık — saydamlık kararları buna bakıyor.
 *
 * `i` kaynak tamponundaki bayt indisi; kaynak JPEG olduğu için kanal sayısı
 * 3 (bir kez 4 varsayıldı ve maskot okunmaz bir mozaiğe döndü).
 */
function parlaklik(veri, i) {
  return (veri[i] * 299 + veri[i + 1] * 587 + veri[i + 2] * 114) / 1000
}

function kirp(deger) {
  return deger < 0 ? 0 : deger > 255 ? 255 : Math.round(deger)
}

/**
 * Siyah zemini saydamlaştırır.
 *
 * Dönen tampon RGBA; kaynak JPEG'in kendisi saydamlık taşımıyor.
 */
function zeminiSil(veri, en, boy, kanal) {
  const zemin = new Uint8Array(en * boy)
  const yigin = []

  // Kenardaki karanlık pikselleri tohum al: zemin dışarıdan içeri taşıyor.
  for (let x = 0; x < en; x++) {
    for (const y of [0, boy - 1]) yigin.push(y * en + x)
  }
  for (let y = 0; y < boy; y++) {
    for (const x of [0, en - 1]) yigin.push(y * en + x)
  }

  while (yigin.length > 0) {
    const p = yigin.pop()
    if (zemin[p] === 1) continue
    if (parlaklik(veri, p * kanal) >= ZEMIN_SINIRI) continue
    zemin[p] = 1
    const x = p % en
    const y = (p - x) / en
    if (x > 0) yigin.push(p - 1)
    if (x < en - 1) yigin.push(p + 1)
    if (y > 0) yigin.push(p - en)
    if (y < boy - 1) yigin.push(p + en)
  }

  // Zemine komşu bant: saydamlık orada parlaklıktan okunuyor, ötesi tam opak.
  const uzaklik = new Uint8Array(en * boy).fill(255)
  let sinir = []
  for (let p = 0; p < zemin.length; p++) {
    if (zemin[p] === 1) {
      uzaklik[p] = 0
      sinir.push(p)
    }
  }
  for (let adim = 1; adim <= BANT && sinir.length > 0; adim++) {
    const sonraki = []
    for (const p of sinir) {
      const x = p % en
      const y = (p - x) / en
      const komsular = []
      if (x > 0) komsular.push(p - 1)
      if (x < en - 1) komsular.push(p + 1)
      if (y > 0) komsular.push(p - en)
      if (y < boy - 1) komsular.push(p + en)
      for (const k of komsular) {
        if (uzaklik[k] !== 255) continue
        uzaklik[k] = adim
        sonraki.push(k)
      }
    }
    sinir = sonraki
  }

  const cikti = Buffer.alloc(en * boy * 4)
  for (let p = 0; p < en * boy; p++) {
    if (zemin[p] === 1) continue // alfa 0, renk 0 — Buffer zaten sıfır dolu
    const kaynak = p * kanal
    const hedef = p * 4

    let alfa = 255
    if (uzaklik[p] <= BANT) {
      const l = parlaklik(veri, kaynak)
      alfa = kirp(((l - BANT_ALT) / (BANT_UST - BANT_ALT)) * 255)
    }
    cikti[hedef + 3] = alfa
    if (alfa === 0) continue

    // Çarpımı geri böl: siyah zeminin üstündeki yarı saydam kürk `alfa × renk`
    // olarak kaydedilmiş, bölünmezse açık zeminde koyu bir kenar bırakıyor.
    const carpan = 255 / alfa
    cikti[hedef] = kirp(veri[kaynak] * carpan)
    cikti[hedef + 1] = kirp(veri[kaynak + 1] * carpan)
    cikti[hedef + 2] = kirp(veri[kaynak + 2] * carpan)
  }
  return cikti
}

/** Saydam kenarları atıp maskotun kendi kutusunu döndürür. */
function kutuBul(rgba, en, boy) {
  let [sol, ust, sag, alt] = [en, boy, -1, -1]
  for (let y = 0; y < boy; y++) {
    for (let x = 0; x < en; x++) {
      if (rgba[(y * en + x) * 4 + 3] < 8) continue
      if (x < sol) sol = x
      if (x > sag) sag = x
      if (y < ust) ust = y
      if (y > alt) alt = y
    }
  }
  return { sol, ust, en: sag - sol + 1, boy: alt - ust + 1 }
}

/** Bir kaynağı saydamlaştırıp tuvale oturtur; yazılan dosyanın yolunu döner. */
async function uret(ad, kaynak, kirpma) {
  let girdi = sharp(join(kaynakKlasoru, kaynak))
  if (kirpma) {
    girdi = girdi.extract({
      left: kirpma.sol,
      top: kirpma.ust,
      width: kirpma.en,
      height: kirpma.boy,
    })
  }

  const { data, info } = await girdi.raw().toBuffer({ resolveWithObject: true })
  const rgba = zeminiSil(data, info.width, info.height, info.channels)
  const kutu = kutuBul(rgba, info.width, info.height)

  // Ölçek boydan alınıyor: bir poz kollarını açtığında (sevinen) enden
  // ölçeklemek onu ötekilerden alçak gösterirdi.
  //
  // Ene göre bir de kısıtlanıyor, çünkü iki poz kendi kutusundan geniş: kupa
  // kaldıran kolunu yana açıyor, işaretçinin çubuğu sola uzanıyor. Kısıt
  // olmasaydı ikisi tuvalin dışına taşar ve kırpılırlardı — taşan bir çubuk,
  // havada başlayan bir çizgi gibi duruyor.
  const olcek = Math.min((TUVAL * DOLULUK) / kutu.boy, (TUVAL * DOLULUK) / kutu.en)
  const hedefBoy = Math.max(1, Math.round(kutu.boy * olcek))
  const hedefEn = Math.max(1, Math.round(kutu.en * olcek))

  const maskot = await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract({ left: kutu.sol, top: kutu.ust, width: kutu.en, height: kutu.boy })
    .resize(hedefEn, hedefBoy, { fit: 'fill' })
    .png()
    .toBuffer()

  const dosya = join(cikisKlasoru, `${ad}.png`)
  await sharp({
    create: { width: TUVAL, height: TUVAL, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      {
        input: maskot,
        left: Math.round((TUVAL - hedefEn) / 2),
        top: Math.round((TUVAL - hedefBoy) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(dosya)

  return { dosya, hedefEn, hedefBoy }
}

await mkdir(cikisKlasoru, { recursive: true })

for (const { ad, kaynak } of POZLAR) {
  const { hedefEn, hedefBoy } = await uret(ad, kaynak)
  console.log(`${ad}.png  ${hedefEn}×${hedefBoy}`)
}

const yuz = await uret('tavsan-yuz', YUZ.kaynak, YUZ)
console.log(`tavsan-yuz.png  ${yuz.hedefEn}×${yuz.hedefBoy}`)

// `ikon-uret.mjs` yüzün tuvaldeki kutusunu sabit sayılarla biliyor; kırpma
// değişince orası da değişmeli. Sayıyı burada yazdırmak, ikinci dosyadaki
// sayının sessizce eskimesini önlüyor.
console.log(
  `\nikon-uret.mjs → MASKOT: sol ${Math.round((TUVAL - yuz.hedefEn) / 2)}, ` +
    `ust ${Math.round((TUVAL - yuz.hedefBoy) / 2)}, en ${yuz.hedefEn}, boy ${yuz.hedefBoy}`,
)
