/**
 * Rabi'nin maskot pozlarını üretir.
 *
 *   node scripts/maskot-uret.mjs
 *
 * Kaynak `assets/maskot/*.png`, çıktı `public/tavsan-*.png`. Üretilen dosyalar
 * depoya giriyor ama **elle düzenlenmemeli** — poz değişecekse kaynak PNG
 * değiştirilip betik yeniden çalıştırılmalı. `ikon-uret.mjs` ile aynı gerekçe.
 *
 * ## Zemin artık burada silinmiyor
 *
 * Kaynaklar bir süre siyah zeminli JPEG'di ve betik zemini kenardan taşırarak
 * siliyordu. O yol maskotu bozuyordu: taşma tavşanın kendi gövdesindeki koyu
 * geçişlere de sızıyor, gövdenin yanında düz bir kesik bırakıyordu — kürk
 * yuvarlak biterken kenar bıçakla kesilmiş gibi duruyordu.
 *
 * Yeni kaynaklar zemini kesilmiş, gerçek alfa taşıyan PNG'ler. Silinecek bir
 * zemin yok; betik saydamlığı kaynağın kendisinden okuyor. Kalan iş yalnızca
 * ölçü: kırpma, ölçekleme ve ortak tuvale oturtma.
 *
 * Kaynakların ölçüsü sabit değil: ilk takım 2048'lik, ikinci takım (v2, 2026
 * ekimi) 1254'lük. Betik ölçüyü kaynaktan okuyor ve kutuyu saydamlıktan
 * buluyor; yalnızca `YUZ` kırpımı sabit piksel taşıyor ve o da 2048'lik "normal
 * maskot"a ait.
 *
 * ## Pozlar paletli PNG, `yuz` hariç
 *
 * Bütün pozlar 256 renklik palete indirilip yazılıyor: dosya başına ~60 kB
 * yerine ~15–20 kB. Elliyi aşkın poz düz PNG'yle paketi iki buçuk megabayta
 * çıkarırdı. Fark yalnızca üç kat büyütmede kürkte ince bir kumlanma olarak
 * görülüyor. Önce yalnızca ikinci takım (v2) sıkıştırılıyordu; ilk takım da
 * aynı yola alındı.
 *
 * Tek istisna `yuz`: uygulama ikonunun (`ikon-uret.mjs`) ve Android
 * `drawable-nodpi/tavsan_yuz.png` ile iOS `KalkanGorunumu/tavsan_yuz.png`
 * kopyalarının kaynağı. Baytları değişirse ikon yeniden üretilmeli ve iki
 * kopya yenilenmeli; o yüzden düz PNG kalıyor (`sikistir: false`).
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
 * Kutu hesabında pikselin "var" sayılması için alfa alt sınırı.
 *
 * Kesim aracı kenarda birkaç birimlik saydamlık bırakıyor; sıfır alınsaydı kutu
 * gözle görünmeyen bir tozla birlikte büyür, maskot da tuvalde küçülürdü.
 */
const KUTU_ALFA = 8


/**
 * Üretilecek pozlar: çıktı adı → kaynak dosya.
 *
 * Kaynak klasöründeki her PNG kullanılmıyor. Dışarıda kalanların gerekçesi:
 * "sinirli" (ve onun ikinci kopyası "uyuyan") uygulamada karşılığı olmayan bir
 * ruh hâli — Rabi kullanıcıya kızmıyor; "sevinen 1/3" ile "çubuk tutan 1/2"
 * seçilenlerin başka açıdan çekilmiş eşleri.
 */
const POZLAR = [
  // --- İkinci takım (v2). Nerede kullanıldıkları AGENTS.md › Maskotun pozları.
  ...[
    ['tavsan-defterli', 'defter tutan.png'],
    ['tavsan-basparmak', 'başparmak kaldıran.png'],
    ['tavsan-uzanan', 'uzanan.png'],
    ['tavsan-dans', 'dans eden.png'],
    ['tavsan-gerinen', 'gerinen.png'],
    ['tavsan-selamlayan', 'eğilerek selamlayan.png'],
    ['tavsan-bagdas', 'bağdaş kuran.png'],
    ['tavsan-takla', 'takla atan.png'],
    ['tavsan-kahkaha', 'kahkaha atan.png'],
    ['tavsan-elleri-belde', 'elleri belde.png'],
    ['tavsan-megafonlu', 'megafonla konuşan.png'],
    ['tavsan-kitapli', 'kitabı inceleyen.png'],
    ['tavsan-saatli', 'saate bakan.png'],
    ['tavsan-laptoplu', 'laptopta çalışan.png'],
    ['tavsan-tahtali', 'tahtaya yazan.png'],
    ['tavsan-buyutecli', 'büyüteçle inceleyen.png'],
    ['tavsan-abakuslu', 'abaküsle sayan.png'],
    ['tavsan-bitkili', 'bitki sulayan.png'],
    ['tavsan-haritali', 'haritadan yol bulan.png'],
    ['tavsan-damgali', 'onay damgası basan.png'],
    ['tavsan-fotografci', 'fotoğraf çeken.png'],
    ['tavsan-supuren', 'yaprak süpüren.png'],
    ['tavsan-cantali', 'çanta kapatan.png'],
    ['tavsan-durbunlu', 'dürbünle bakan.png'],
    ['tavsan-esneyen', 'esneme yapan.png'],
    ['tavsan-alkislayan', 'alkışlayan.png'],
    // Ana sayfa başlığı için: öteki durumların tam boy pozu zaten vardı.
    ['tavsan-uyuyan', 'kıvrılıp uyuyan.png'],
    ['tavsan-yazan', 'deftere yazan.png'],
  ].map(([ad, kaynak]) => ({ ad, kaynak })),
  // --- İlk takım.
  { ad: 'tavsan-tam', kaynak: 'normal maskot.png' },
  { ad: 'tavsan-el-sallayan', kaynak: 'selam veren maskot.png' },
  { ad: 'tavsan-okuyan', kaynak: 'kitap okuyan maskot.png' },
  { ad: 'tavsan-kupali', kaynak: 'kupa kaldıran maskot.png' },
  { ad: 'tavsan-sevinen', kaynak: 'sevinen maskot 2.png' },
  { ad: 'tavsan-uzgun', kaynak: 'üzülen maskot.png' },
  { ad: 'tavsan-dusunen', kaynak: 'düşünen maskot.png' },
  { ad: 'tavsan-kahveli', kaynak: 'kahve içen maskot.png' },
  { ad: 'tavsan-isaretci', kaynak: 'çubuk tutan maskot 3.png' },
  // Kafa: `tavsan-yuz`ün elle kırpılmış hâlinin aksine kaynağın kendisi zaten
  // baş çekimi — kırpma gerekmiyor, kulaklar da tam giriyor. Ana sayfanın
  // selamlaması ve açılış tavşanı bunu kullanıyor.
  { ad: 'tavsan-kafa', kaynak: 'kafası gözüken maskot.png' },
  // Zıplayan sevinç: `tavsan-sevinen`den ayrı bir poz, çünkü ikisi aynı anda
  // kullanılıyor — bu, günlük hedefi tutturan kullanıcıya çıkan hâl.
  { ad: 'tavsan-ziplayan', kaynak: 'sevinen maskot 3.png' },
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
const YUZ = { kaynak: 'normal maskot.png', sol: 590, ust: 15, en: 870, boy: 1150 }

/** Saydam kenarları atıp maskotun kendi kutusunu döndürür. */
function kutuBul(rgba, en, boy) {
  let [sol, ust, sag, alt] = [en, boy, -1, -1]
  for (let y = 0; y < boy; y++) {
    for (let x = 0; x < en; x++) {
      if (rgba[(y * en + x) * 4 + 3] < KUTU_ALFA) continue
      if (x < sol) sol = x
      if (x > sag) sag = x
      if (y < ust) ust = y
      if (y > alt) alt = y
    }
  }
  return { sol, ust, en: sag - sol + 1, boy: alt - ust + 1 }
}

/**
 * Bir kaynağı tuvale oturtur; yazılan dosyanın yolunu döner.
 *
 * `kirpma` kaynak pikselinde sabit bir kutu (`YUZ`).
 */
async function uret(ad, kaynak, kirpma, { sikistir = true } = {}) {
  let girdi = sharp(join(kaynakKlasoru, kaynak)).ensureAlpha()
  if (kirpma) {
    girdi = girdi.extract({
      left: kirpma.sol,
      top: kirpma.ust,
      width: kirpma.en,
      height: kirpma.boy,
    })
  }

  const { data, info } = await girdi.raw().toBuffer({ resolveWithObject: true })
  const rgba = data
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
    .png(sikistir ? { palette: true, quality: 90, effort: 10, compressionLevel: 9 } : { compressionLevel: 9 })
    .toFile(dosya)

  return { dosya, hedefEn, hedefBoy }
}

await mkdir(cikisKlasoru, { recursive: true })

for (const { ad, kaynak } of POZLAR) {
  const { hedefEn, hedefBoy } = await uret(ad, kaynak)
  console.log(`${ad}.png  ${hedefEn}×${hedefBoy}`)
}

// `yuz` sıkıştırılmıyor: ikonun ve yerli kopyaların kaynağı (dosya başındaki not).
const yuz = await uret('tavsan-yuz', YUZ.kaynak, YUZ, { sikistir: false })
console.log(`tavsan-yuz.png  ${yuz.hedefEn}×${yuz.hedefBoy}`)

// `ikon-uret.mjs` yüzün tuvaldeki kutusunu sabit sayılarla biliyor; kırpma
// değişince orası da değişmeli. Sayıyı burada yazdırmak, ikinci dosyadaki
// sayının sessizce eskimesini önlüyor.
console.log(
  `\nikon-uret.mjs → MASKOT: sol ${Math.round((TUVAL - yuz.hedefEn) / 2)}, ` +
    `ust ${Math.round((TUVAL - yuz.hedefBoy) / 2)}, en ${yuz.hedefEn}, boy ${yuz.hedefBoy}`,
)
