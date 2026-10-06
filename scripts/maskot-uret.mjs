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
 * Ana sayfa başlığının durum kafaları: `tavsan-kafa-*.png`.
 *
 * Sol üstteki tavşan 58 piksel ve tam boy poz o ölçüde lekeye dönüyor (70
 * kuralı); pozun baş ve üst gövdesi gösteriliyor.
 *
 * ## Kafaya göre hizalanıyor, kutuya göre değil
 *
 * Kafalar bir süre pozun kutusundan oranla kırpılıp (`alt: 0.62` gibi) tuvale
 * sığdırılıyordu. Kırpılan parçanın boyu pozdan poza değiştiği için **kafa**
 * değişiyordu: üst gövdeden kırpılan kahkahada baş kocaman, tam boy alınan
 * bağdaşta küçücüktü; yatan uyuyan tavşan enine sığdırılıp yere çökmüş gibi
 * duruyordu. Poz her değiştiğinde tavşan büyüyüp küçülüyor, gözleri yukarı
 * aşağı zıplıyordu. Kullanıcı bunu "tavşanlarda yamukluk" diye fark etti.
 *
 * Şimdi ölçü gözlerden: her pozun iki göz merkezi kaynak pikselinde yazılı
 * (`gozler`), poz göz arası `GOZ_ARASI` olacak şekilde ölçekleniyor ve göz
 * ortası tuvalde hep aynı noktaya (`GOZ_Y`, yatayda orta) konuyor. Poz
 * değişince yalnızca ifade, kollar ve tutulan nesne değişiyor. Tuvalin dışına
 * düşen gövde kesiliyor; kesik alt kenarda `SOLMA`, yanlarda `YAN_SOLMA`
 * boyunca saydamlaşıyor, düz bir bıçak çizgisi bırakmasın diye.
 *
 * Göz merkezleri koyu piksellerin en büyük iki lekesinden bulundu ve
 * çıktılara bakılarak denetlendi. Defter, kitap ve kahkahada en büyük koyu
 * leke defter, kitap ya da ağızdı; orada göz çifti elle seçildi.
 *
 * `duzelt`, göz arasının kafa boyunu yanlış söylediği pozlar için çarpan:
 * kahkahada ve uyuyanda gözler kapalı yaylar; laptop, megafon, saat ve
 * tahtada baş yana dönük ya da öne eğik (göz arası kısalıyor). Değiştirince `public/tavsan-kafa-*.png`yi yan yana aç ve
 * kafaların aynı boyda durduğunu gör.
 *
 * `kitapli` "kitap okuyan"dan geliyor: "kitabı inceleyen" yüzüstü yatıyor ve
 * yüzü kısalmış, başı ötekilerden iri görünüyordu.
 */
const GOZ_ARASI = 58
const GOZ_Y = 152
const SOLMA = 40
/** Yan kenarlarda solma: yatan uyuyanın gövdesi sağdan kesiliyor. */
const YAN_SOLMA = 24

const KAFALAR = [
  { ad: 'tavsan-kafa-uyuyan', kaynak: 'kıvrılıp uyuyan.png', gozler: [[307, 731], [570, 580]], duzelt: 1.12 },
  { ad: 'tavsan-kafa-gerinen', kaynak: 'gerinen.png', gozler: [[560, 519], [752, 478]] },
  { ad: 'tavsan-kafa-yazan', kaynak: 'deftere yazan.png', gozler: [[547, 609], [760, 655]] },
  { ad: 'tavsan-kafa-kitapli', kaynak: 'kitap okuyan maskot.png', gozler: [[863, 828], [1189, 828]] },
  { ad: 'tavsan-kafa-laptoplu', kaynak: 'laptopta çalışan.png', gozler: [[553, 594], [749, 626]], duzelt: 0.9 },
  { ad: 'tavsan-kafa-kahveli', kaynak: 'kahve içen maskot.png', gozler: [[859, 811], [1194, 808]] },
  { ad: 'tavsan-kafa-dans', kaynak: 'dans eden.png', gozler: [[519, 546], [702, 453]] },
  { ad: 'tavsan-kafa-alkislayan', kaynak: 'alkışlayan.png', gozler: [[542, 553], [735, 488]] },
  { ad: 'tavsan-kafa-kahkaha', kaynak: 'kahkaha atan.png', gozler: [[499, 561], [762, 500]], duzelt: 1.15 },
  { ad: 'tavsan-kafa-elleri-belde', kaynak: 'elleri belde.png', gozler: [[619, 480], [796, 454]] },
  { ad: 'tavsan-kafa-bagdas', kaynak: 'bağdaş kuran.png', gozler: [[585, 615], [801, 560]] },
  { ad: 'tavsan-kafa-uzgun', kaynak: 'üzülen maskot.png', gozler: [[863, 828], [1183, 821]] },
  { ad: 'tavsan-kafa-damgali', kaynak: 'onay damgası basan.png', gozler: [[564, 584], [776, 619]] },
  { ad: 'tavsan-kafa-selamlayan', kaynak: 'eğilerek selamlayan.png', gozler: [[644, 592], [838, 529]] },
  { ad: 'tavsan-kafa-buyutecli', kaynak: 'büyüteçle inceleyen.png', gozler: [[610, 614], [808, 578]] },
  { ad: 'tavsan-kafa-saatli', kaynak: 'saate bakan.png', gozler: [[609, 548], [779, 579]], duzelt: 0.88 },
  { ad: 'tavsan-kafa-dusunen', kaynak: 'düşünen maskot.png', gozler: [[921, 801], [1244, 754]] },
  { ad: 'tavsan-kafa-megafonlu', kaynak: 'megafonla konuşan.png', gozler: [[602, 610], [701, 493]], duzelt: 0.8 },
  { ad: 'tavsan-kafa-tahtali', kaynak: 'tahtaya yazan.png', gozler: [[541, 560], [701, 532]], duzelt: 0.85 },
  { ad: 'tavsan-kafa-cantali', kaynak: 'çanta kapatan.png', gozler: [[538, 549], [740, 588]] },
  { ad: 'tavsan-kafa-bitkili', kaynak: 'bitki sulayan.png', gozler: [[616, 520], [810, 585]] },
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

/**
 * Bir durum kafasını gözlerinden hizalayarak tuvale oturtur (`KAFALAR`).
 *
 * Poz göz arası `GOZ_ARASI` olacak kadar ölçekleniyor, göz ortası tuvalin
 * (orta, `GOZ_Y`) noktasına geliyor; dışarıda kalan kısım atılıyor.
 */
async function kafaUret({ ad, kaynak, gozler, duzelt = 1 }) {
  const girdi = sharp(join(kaynakKlasoru, kaynak)).ensureAlpha()
  const { width: en, height: boy } = await girdi.metadata()
  const [[x1, y1], [x2, y2]] = gozler
  const olcek = (GOZ_ARASI * duzelt) / Math.hypot(x2 - x1, y2 - y1)
  const buyukEn = Math.round(en * olcek)
  const buyukBoy = Math.round(boy * olcek)
  const kaynakPiksel = await girdi.resize(buyukEn, buyukBoy).raw().toBuffer()

  // Göz ortasının büyütülmüş görseldeki yeri, tuvalin sol üstüne kaydırma.
  const sol = Math.round(((x1 + x2) / 2) * olcek - TUVAL / 2)
  const ust = Math.round(((y1 + y2) / 2) * olcek - GOZ_Y)

  const tuval = Buffer.alloc(TUVAL * TUVAL * 4)
  for (let y = 0; y < TUVAL; y++) {
    const ky = y + ust
    if (ky < 0 || ky >= buyukBoy) continue
    // Kesilen kenarlar doğrusal saydamlaşıyor (alt `SOLMA`, yanlar `YAN_SOLMA`).
    const altSolma = y > TUVAL - SOLMA ? (TUVAL - y) / SOLMA : 1
    for (let x = 0; x < TUVAL; x++) {
      const kx = x + sol
      if (kx < 0 || kx >= buyukEn) continue
      const kenar = Math.min(x, TUVAL - 1 - x)
      const solma = altSolma * (kenar < YAN_SOLMA ? kenar / YAN_SOLMA : 1)
      const k = (ky * buyukEn + kx) * 4
      const t = (y * TUVAL + x) * 4
      tuval[t] = kaynakPiksel[k]
      tuval[t + 1] = kaynakPiksel[k + 1]
      tuval[t + 2] = kaynakPiksel[k + 2]
      tuval[t + 3] = Math.round(kaynakPiksel[k + 3] * solma)
    }
  }

  await sharp(tuval, { raw: { width: TUVAL, height: TUVAL, channels: 4 } })
    .png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 })
    .toFile(join(cikisKlasoru, `${ad}.png`))
  return olcek
}

await mkdir(cikisKlasoru, { recursive: true })

for (const { ad, kaynak } of POZLAR) {
  const { hedefEn, hedefBoy } = await uret(ad, kaynak)
  console.log(`${ad}.png  ${hedefEn}×${hedefBoy}`)
}

for (const kafa of KAFALAR) {
  const olcek = await kafaUret(kafa)
  console.log(`${kafa.ad}.png  ölçek ${olcek.toFixed(3)}`)
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
