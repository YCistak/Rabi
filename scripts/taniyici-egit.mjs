/**
 * `lib/karakter-agirliklari.ts` dosyasını üretir — geliştirme makinesinde
 * çalışır, uygulamaya girmez.
 *
 * Kullanım:  node scripts/taniyici-egit.mjs <emnist-klasörü> [tur]
 *
 * Neden burada bir eğitim döngüsü var: cihazda çalışacak tanıyıcı 14 sınıflık
 * küçük bir ağ ve onu eğitmek için makineye PyTorch kurmak gerekmiyor —
 * ileri ve geri geçiş birkaç yüz satır. Böylece ağırlıkların nereden geldiği
 * depoda duruyor ve yeniden üretilebiliyor.
 *
 * Veri: EMNIST (NIST'in el yazısı derlemi). Rakamlar `emnist-digits`,
 * B/D/Y harfleri `emnist-letters` içinden alınıyor.
 *
 * ## Eğitim çekirdeklere dağıtılıyor
 *
 * Tek çekirdekte bir tur bu ağda **saatler** sürüyor ve ağırlıkları bir kez
 * eğitip bırakmıyoruz: gerçek kâğıtlarla ölçüp çoğaltmayı düzeltip yeniden
 * eğitiyoruz. Yirmi saatlik bir döngüyle o iş yapılamıyor.
 *
 * Bölünme **yığın içinde**: her yığının örnekleri işçilere paylaştırılıyor,
 * her işçi kendi eğimini hesaplıyor, ana iş parçacığı hepsini toplayıp
 * ağırlıkları bir kez güncelliyor. Yani matematik tek çekirdekli hâliyle
 * birebir aynı — yalnızca aynı yığının örnekleri aynı anda hesaplanıyor.
 *
 * Ağırlıklar `SharedArrayBuffer` üzerinde duruyor ve işçiler ona **görünüm**
 * (view) açıyor: ana iş parçacığı güncelleyince kopyalamaya gerek kalmadan
 * işçiler yeni değeri görüyor. Tek kopyalanan şey eğimler.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { availableParallelism } from 'node:os'
import { fileURLToPath } from 'node:url'
import { isMainThread, parentPort, Worker, workerData } from 'node:worker_threads'

const KARE = 28
const SINIFLAR = ['0','1','2','3','4','5','6','7','8','9','B','D','Y','diğer']
const S1 = 24, S2 = 48, C = 5
const HARF_ETIKETI = { B: 2, D: 4, Y: 25 } // EMNIST letters: 1=A … 26=Z

/**
 * "diğer" sınıfına alınmayan harfler.
 *
 * B, D, Y kendi sınıfları. Kalan altısı rakamlara fazla benziyor ve "diğer"e
 * atılsalardı ağ gerçek rakamları da oraya itmeye başlardı: elle yazıldığında
 * O ile 0, I ile 1, S ile 5, Z ile 2, G ile 6, Q ile 2 çoğu zaman ayırt
 * edilemiyor.
 */
const DISARIDA = new Set([2, 4, 25, 15, 9, 19, 26, 7, 17])

const [klasor = '.', turArg, gercekKlasor] = process.argv.slice(2)
const TUR = Number(turArg ?? 8)
const ORNEK_BASINA = 12000

// ---------------------------------------------------------------- veri

function idxOku(yol) {
  const b = readFileSync(yol)
  const boyut = b.readUInt8(3)
  const olcu = []
  for (let i = 0; i < boyut; i++) olcu.push(b.readUInt32BE(4 + i * 4))
  return { olcu, veri: b.subarray(4 + boyut * 4) }
}

/** EMNIST görüntüleri devrik saklanıyor; MNIST düzenine çevriliyor. */
function devrikAl(veri, i) {
  const kare = new Float32Array(KARE * KARE)
  const yer = i * KARE * KARE
  for (let y = 0; y < KARE; y++)
    for (let x = 0; x < KARE; x++) kare[y * KARE + x] = veri[yer + x * KARE + y] / 255
  return kare
}

function veriyiTopla() {
  const kova = SINIFLAR.map(() => [])

  const rG = idxOku(join(klasor, 'emnist-digits-train-images-idx3-ubyte'))
  const rE = idxOku(join(klasor, 'emnist-digits-train-labels-idx1-ubyte'))
  for (let i = 0; i < rE.olcu[0]; i++) {
    const s = rE.veri[i]
    if (kova[s].length < ORNEK_BASINA) kova[s].push(devrikAl(rG.veri, i))
  }

  const hG = idxOku(join(klasor, 'emnist-letters-train-images-idx3-ubyte'))
  const hE = idxOku(join(klasor, 'emnist-letters-train-labels-idx1-ubyte'))
  const diger = SINIFLAR.indexOf('diğer')
  for (let i = 0; i < hE.olcu[0]; i++) {
    const etiket = hE.veri[i]
    const harf = Object.keys(HARF_ETIKETI).find((h) => HARF_ETIKETI[h] === etiket)

    // Ders adının harfleri de tanıyıcıya geliyor. On üç sınıf varken ağ onlara
    // zorunlu olarak bir rakam diyordu ve ortaya olmayan sayılar çıkıyordu;
    // on dördüncü sınıf ağa "bu bir şey değil" diyebilme imkânı veriyor.
    const s = harf !== undefined ? SINIFLAR.indexOf(harf) : DISARIDA.has(etiket) ? -1 : diger
    if (s >= 0 && kova[s].length < ORNEK_BASINA) kova[s].push(devrikAl(hG.veri, i))
  }

  /*
    Sınıflar eşitleniyor. EMNIST'te her rakamdan yeterince örnek var ama her
    harften 4.800; olduğu gibi alınınca ağ rakamları 2,5 kat daha çok görüyor
    ve kararsız kaldığı yerde rakam demeye eğiliyor. Bu tam da ölçtüğümüz
    kusurlardan biri: kalın uçlu kalemde "D" kutusu "0" okunuyordu.

    Az olan sınıf **tekrarlanarak** dolduruluyor; kopya olmuyorlar çünkü
    çoğaltma (`cogalt`) her turda her örneği başka bir açı, ölçek, kalınlık
    ve lekeyle gösteriyor.
  */
  const hedef = Math.max(...kova.map((k) => k.length))
  for (const liste of kova) {
    const asil = liste.length
    if (asil === 0) continue
    for (let i = asil; i < hedef; i++) liste.push(liste[i % asil])
  }

  const x = [], y = []
  kova.forEach((liste, s) => liste.forEach((k) => { x.push(k); y.push(s) }))
  gercekleriKat(x, y)
  console.log('sınıf başına:', kova.map((k) => k.length).join(' '))
  return { x, y }
}

/**
 * Gerçek kâğıtlardan çıkarılmış karakterleri EMNIST'in **üstüne** ekler.
 *
 * EMNIST düz taranmış Amerikan el yazısı; bizim girdimiz telefonla çekilip
 * eşiklenmiş bir kâğıt ve arada kapanmayan bir fark var. Örnekler
 * `lib/ocr-ornek-cikar.test.ts` ile çıkarılıyor (yerel araç; kâğıdın doğru
 * cevabı biliniyor, hangi lekenin hangi karakter olduğu kâğıdın boşluk
 * desenine bakılarak bulunuyor).
 *
 * **Sınıf başına eşit** katkı veriliyor. Ölçüldü: kâğıtlardan çıkan küme
 * çarpık ("1" ve "D" ellişer, "7" ile "9" hiç yok) ve olduğu gibi
 * tekrarlanınca EMNIST'in dengesini bozup kâğıt başarısını düşürüyor.
 * Örneği `EN_AZ_ORNEK`ten az olan sınıf hiç eklenmiyor: üç kareyi altı yüz kez
 * göstermek öğretmek değil ezberletmek.
 *
 * Klasör verilmezse hiçbir şey eklenmiyor; betik EMNIST'le tek başına
 * çalışmaya devam ediyor.
 */
function gercekleriKat(x, y) {
  if (gercekKlasor === undefined) return
  const sinifBasina = Number(process.env.SINIF_BASINA ?? 1500)
  const EN_AZ_ORNEK = 5
  if (sinifBasina <= 0) return

  const bayt = new Uint8Array(readFileSync(join(gercekKlasor, 'gercek-x.bin')))
  const { etiketler, kaynak } = JSON.parse(
    readFileSync(join(gercekKlasor, 'gercek-y.json'), 'utf8'),
  )
  // Ölçüm kümesi dışarıda tutulabiliyor: `SADECE` ön eki verilirse yalnızca
  // adı onunla başlayan kâğıtların örnekleri alınıyor. Böylece "ezberledi mi
  // yoksa öğrendi mi" sorusu ölçülebiliyor.
  const sadece = process.env.SADECE
  const kovalar = SINIFLAR.map(() => [])
  for (let i = 0; i < etiketler.length; i++) {
    if (sadece !== undefined && !String(kaynak[i]).startsWith(sadece)) continue
    const kare = new Float32Array(KARE * KARE)
    for (let j = 0; j < kare.length; j++) kare[j] = bayt[i * KARE * KARE + j] / 255
    kovalar[etiketler[i]].push(kare)
  }

  /*
    `TEKRAR` verilirse her örnek olduğu gibi o kadar kez ekleniyor; sınıf
    dengesi kâğıttan geldiği gibi kalıyor. Hangisinin doğru olduğu ölçülerek
    seçiliyor, ikisi de duruyor.
  */
  const tekrar = Number(process.env.TEKRAR ?? 0)
  if (tekrar > 0) {
    let toplam = 0
    kovalar.forEach((liste, s) =>
      liste.forEach((kare) => {
        for (let n = 0; n < tekrar; n++) {
          x.push(kare)
          y.push(s)
        }
        toplam++
      }),
    )
    console.log(`gerçek örnek: ${toplam} × ${tekrar}`)
    return
  }

  const eklenen = kovalar.map((liste, s) => {
    if (liste.length < EN_AZ_ORNEK) return 0
    for (let n = 0; n < sinifBasina; n++) {
      x.push(liste[n % liste.length])
      y.push(s)
    }
    return liste.length
  })
  console.log(`gerçek örnek (sınıf başına ${sinifBasina}): ${eklenen.join(' ')}`)
}

// ------------------------------------------------------- veri çoğaltma

/**
 * Eğitim örneğini kâğıttan gelene benzetir.
 *
 * EMNIST ince uçlu kalemle, düz taranmış. Bizim girdimiz telefon
 * fotoğrafından eşiklenerek geliyor: kalem kalın, harf eğik, kenarlar sert.
 * Bu fark kapanmazsa ağ sınavda görmediği bir şeyle karşılaşıyor.
 */
function cogalt(kare, rast) {
  const aci = (rast() - 0.5) * 0.45          // ±13°
  const olcek = 0.82 + rast() * 0.36
  const kx = (rast() - 0.5) * 4
  const ky = (rast() - 0.5) * 4
  const cos = Math.cos(aci) / olcek, sin = Math.sin(aci) / olcek
  const orta = KARE / 2

  const cikti = new Float32Array(KARE * KARE)
  for (let y = 0; y < KARE; y++) {
    for (let x = 0; x < KARE; x++) {
      const dx = x - orta - kx, dy = y - orta - ky
      const sx = cos * dx + sin * dy + orta
      const sy = -sin * dx + cos * dy + orta
      cikti[y * KARE + x] = ikiliAra(kare, sx, sy)
    }
  }

  // Kalem kalınlığı: yayma (kalın uç) ya da aşındırma (ince uç).
  const kalinlik = rast()
  const kalemli = kalinlik < 0.45 ? kalinlastir(cikti, 1) : kalinlik < 0.55 ? inceltilmis(cikti) : cikti

  return lekele(kalemli, rast)
}

/**
 * Eşiklemenin bıraktığı kusurları taklit eder: kopuk çizgi ve zemin lekesi.
 *
 * EMNIST düzgün taranmış; bizim girdimiz telefon fotoğrafından uyarlamalı
 * eşikle geçiyor ve iki kusuru **her zaman** taşıyor. Ölçüldü: kurşun kalemle
 * yazılmış kâğıtta harfin gövdesi yer yer kopuyor ("5" yarısı silinince "3"e
 * benziyor) ve kâğıdın dokusundan kalan noktalar kutunun içinde kalıyor.
 * Ağ bunları eğitimde hiç görmezse sınavda ilk kez görüyor.
 */
function lekele(kare, rast) {
  const cikti = Float32Array.from(kare)

  // Kopuk çizgi: mürekkebin üstünden birkaç küçük kare siliniyor.
  if (rast() < 0.35) {
    const adet = 1 + Math.floor(rast() * 3)
    for (let n = 0; n < adet; n++) {
      const cx = Math.floor(rast() * KARE)
      const cy = Math.floor(rast() * KARE)
      const yari = 1 + Math.floor(rast() * 2)
      for (let y = cy - yari; y <= cy + yari; y++)
        for (let x = cx - yari; x <= cx + yari; x++)
          if (x >= 0 && y >= 0 && x < KARE && y < KARE) cikti[y * KARE + x] = 0
    }
  }

  // Zemin lekesi: kâğıdın dokusundan kalan tek tük koyu noktalar.
  if (rast() < 0.3) {
    const adet = 1 + Math.floor(rast() * 6)
    for (let n = 0; n < adet; n++) {
      const x = Math.floor(rast() * KARE)
      const y = Math.floor(rast() * KARE)
      cikti[y * KARE + x] = Math.max(cikti[y * KARE + x], 0.6 + rast() * 0.4)
    }
  }

  return cikti
}

function ikiliAra(kare, sx, sy) {
  const x0 = Math.floor(sx), y0 = Math.floor(sy)
  const fx = sx - x0, fy = sy - y0
  const al = (x, y) => (x < 0 || y < 0 || x >= KARE || y >= KARE ? 0 : kare[y * KARE + x])
  return (
    al(x0, y0) * (1 - fx) * (1 - fy) + al(x0 + 1, y0) * fx * (1 - fy) +
    al(x0, y0 + 1) * (1 - fx) * fy + al(x0 + 1, y0 + 1) * fx * fy
  )
}

function kalinlastir(kare, yaricap) {
  const cikti = new Float32Array(KARE * KARE)
  for (let y = 0; y < KARE; y++)
    for (let x = 0; x < KARE; x++) {
      let enBuyuk = 0
      for (let dy = -yaricap; dy <= yaricap; dy++)
        for (let dx = -yaricap; dx <= yaricap; dx++) {
          const nx = x + dx, ny = y + dy
          if (nx < 0 || ny < 0 || nx >= KARE || ny >= KARE) continue
          if (kare[ny * KARE + nx] > enBuyuk) enBuyuk = kare[ny * KARE + nx]
        }
      cikti[y * KARE + x] = enBuyuk
    }
  return cikti
}

function inceltilmis(kare) {
  const cikti = new Float32Array(KARE * KARE)
  for (let y = 0; y < KARE; y++)
    for (let x = 0; x < KARE; x++) {
      let enKucuk = 1
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy
          const d = nx < 0 || ny < 0 || nx >= KARE || ny >= KARE ? 0 : kare[ny * KARE + nx]
          if (d < enKucuk) enKucuk = d
        }
      cikti[y * KARE + x] = enKucuk
    }
  return cikti
}

// ------------------------------------------------------------------ ağ

const rastgeleTohum = (t) => () => ((t = (t * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)

/**
 * Çoğaltmanın rastgeleliği işçi başına ayrı tohumlanıyor.
 *
 * Hepsi aynı tohumu kullansaydı bir yığındaki bütün örnekler aynı açı ve
 * kalınlıkla gösterilirdi — çoğaltma çeşitliliğini yitirirdi.
 */
/**
 * Tohum dışarıdan verilebiliyor (`TOHUM`).
 *
 * Aynı yapılandırma iki ayrı tohumla eğitilince kâğıt başarısı birkaç puan
 * oynuyor; ince farkları tek koşuyla karşılaştırmak yanıltıyor. Karar
 * verirken aynı ayarı birkaç tohumla koştur.
 */
const TOHUM = Number(process.env.TOHUM ?? 20260903)
const rast = rastgeleTohum(TOHUM + (isMainThread ? 0 : workerData.sira * 7919))

function dizi(n, olcek) {
  const d = new Float32Array(n)
  for (let i = 0; i < n; i++) d[i] = (rast() * 2 - 1) * olcek
  return d
}

const OLCU = {
  k1: S1 * C * C,
  b1: S1,
  k2: S2 * S1 * C * C,
  b2: S2,
  w: SINIFLAR.length * S2 * 16,
  b: SINIFLAR.length,
}
const SIRA = ['k1', 'b1', 'k2', 'b2', 'w', 'b']
const PARAMETRE = SIRA.reduce((t, ad) => t + OLCU[ad], 0)

/** Verilen tampon üzerinde katman katman görünüm açar. */
function gorunumler(tampon) {
  const cikti = {}
  let yer = 0
  for (const ad of SIRA) {
    cikti[ad] = new Float32Array(tampon, yer * 4, OLCU[ad])
    yer += OLCU[ad]
  }
  return cikti
}

// Ağırlıklar paylaşılan tamponda: ana iş parçacığı günceller, işçiler
// kopyalamadan aynı sayıları görür.
const agirlikTamponu = isMainThread
  ? new SharedArrayBuffer(PARAMETRE * 4)
  : workerData.agirlikTamponu
const p = gorunumler(agirlikTamponu)

if (isMainThread) {
  // He başlatması: ReLU'da varyansı koruyor, aksi hâlde derin katman sönüyor.
  p.k1.set(dizi(OLCU.k1, Math.sqrt(2 / (C * C))))
  p.k2.set(dizi(OLCU.k2, Math.sqrt(2 / (S1 * C * C))))
  p.w.set(dizi(OLCU.w, Math.sqrt(2 / (S2 * 16))))
}

const hiz = Object.fromEntries(SIRA.map((k) => [k, new Float32Array(OLCU[k])]))
const egim = Object.fromEntries(SIRA.map((k) => [k, new Float32Array(OLCU[k])]))

function ileri(x) {
  const z1 = new Float32Array(S1 * 576)
  for (let s = 0; s < S1; s++)
    for (let y = 0; y < 24; y++)
      for (let x2 = 0; x2 < 24; x2++) {
        let t = p.b1[s]
        for (let cy = 0; cy < C; cy++)
          for (let cx = 0; cx < C; cx++) t += p.k1[s * 25 + cy * C + cx] * x[(y + cy) * 28 + x2 + cx]
        z1[s * 576 + y * 24 + x2] = t
      }
  const a1 = z1.map((v) => (v > 0 ? v : 0))
  const { cikti: h1, secim: se1 } = havuz(a1, S1, 24)

  const z2 = new Float32Array(S2 * 64)
  for (let s = 0; s < S2; s++)
    for (let y = 0; y < 8; y++)
      for (let x2 = 0; x2 < 8; x2++) {
        let t = p.b2[s]
        for (let k = 0; k < S1; k++)
          for (let cy = 0; cy < C; cy++)
            for (let cx = 0; cx < C; cx++)
              t += p.k2[(s * S1 + k) * 25 + cy * C + cx] * h1[k * 144 + (y + cy) * 12 + x2 + cx]
        z2[s * 64 + y * 8 + x2] = t
      }
  const a2 = z2.map((v) => (v > 0 ? v : 0))
  const { cikti: h2, secim: se2 } = havuz(a2, S2, 8)

  const puan = new Float32Array(SINIFLAR.length)
  for (let s = 0; s < SINIFLAR.length; s++) {
    let t = p.b[s]
    for (let i = 0; i < h2.length; i++) t += p.w[s * h2.length + i] * h2[i]
    puan[s] = t
  }
  return { z1, h1, se1, z2, h2, se2, puan }
}

function havuz(a, kanal, kenar) {
  const yeni = kenar >> 1
  const cikti = new Float32Array(kanal * yeni * yeni)
  const secim = new Int32Array(kanal * yeni * yeni)
  for (let k = 0; k < kanal; k++)
    for (let y = 0; y < yeni; y++)
      for (let x = 0; x < yeni; x++) {
        const t = k * kenar * kenar + y * 2 * kenar + x * 2
        let en = t
        for (const j of [t + 1, t + kenar, t + kenar + 1]) if (a[j] > a[en]) en = j
        cikti[k * yeni * yeni + y * yeni + x] = a[en]
        secim[k * yeni * yeni + y * yeni + x] = en
      }
  return { cikti, secim }
}

function yumusak(puan) {
  let en = puan[0]
  for (const v of puan) if (v > en) en = v
  const o = new Float32Array(puan.length)
  let t = 0
  for (let i = 0; i < puan.length; i++) { o[i] = Math.exp(puan[i] - en); t += o[i] }
  for (let i = 0; i < o.length; i++) o[i] /= t
  return o
}

function geri(x, d, hedef) {
  const olasilik = yumusak(d.puan)
  const dPuan = Float32Array.from(olasilik)
  dPuan[hedef] -= 1

  const dh2 = new Float32Array(d.h2.length)
  for (let s = 0; s < SINIFLAR.length; s++) {
    egim.b[s] += dPuan[s]
    for (let i = 0; i < d.h2.length; i++) {
      egim.w[s * d.h2.length + i] += dPuan[s] * d.h2[i]
      dh2[i] += p.w[s * d.h2.length + i] * dPuan[s]
    }
  }

  const dz2 = new Float32Array(d.z2.length)
  for (let i = 0; i < dh2.length; i++) {
    const j = d.se2[i]
    if (d.z2[j] > 0) dz2[j] += dh2[i]
  }

  const dh1 = new Float32Array(d.h1.length)
  for (let s = 0; s < S2; s++)
    for (let y = 0; y < 8; y++)
      for (let x2 = 0; x2 < 8; x2++) {
        const g = dz2[s * 64 + y * 8 + x2]
        if (g === 0) continue
        egim.b2[s] += g
        for (let k = 0; k < S1; k++)
          for (let cy = 0; cy < C; cy++)
            for (let cx = 0; cx < C; cx++) {
              const ci = (s * S1 + k) * 25 + cy * C + cx
              const hi = k * 144 + (y + cy) * 12 + x2 + cx
              egim.k2[ci] += g * d.h1[hi]
              dh1[hi] += g * p.k2[ci]
            }
      }

  const dz1 = new Float32Array(d.z1.length)
  for (let i = 0; i < dh1.length; i++) {
    const j = d.se1[i]
    if (d.z1[j] > 0) dz1[j] += dh1[i]
  }

  for (let s = 0; s < S1; s++)
    for (let y = 0; y < 24; y++)
      for (let x2 = 0; x2 < 24; x2++) {
        const g = dz1[s * 576 + y * 24 + x2]
        if (g === 0) continue
        egim.b1[s] += g
        for (let cy = 0; cy < C; cy++)
          for (let cx = 0; cx < C; cx++) egim.k1[s * 25 + cy * C + cx] += g * x[(y + cy) * 28 + x2 + cx]
      }

  return -Math.log(Math.max(olasilik[hedef], 1e-9))
}

function guncelle(adim, yigin) {
  for (const ad of Object.keys(p)) {
    const g = egim[ad], h = hiz[ad], d = p[ad]
    for (let i = 0; i < d.length; i++) {
      h[i] = 0.9 * h[i] - adim * (g[i] / yigin)
      d[i] += h[i]
      g[i] = 0
    }
  }
}

// ------------------------------------------------------------- eğitim

/**
 * Yığın boyu, çekirdek sayısına göre büyütüldü.
 *
 * Tek çekirdekte 32'ydi. Yirmi sekiz işçiye 32 örnek bölmek işçi başına bir
 * örnek demek ve haberleşme hesaptan uzun sürüyor. 224'te her işçiye sekiz
 * örnek düşüyor; adım da ona göre büyüdü — yığın büyüdükçe eğim daha az
 * gürültülü oluyor ve aynı adımla ağ daha yavaş öğreniyor. Oran karekök
 * kuralından: 0.06 × √(224/32) ≈ 0.16.
 */
const YIGIN = 224
const BASLANGIC_ADIMI = 0.16

const ISCI_SAYISI = Math.max(1, Math.min(availableParallelism() - 2, 28))

/** Uint8 örneği ağın beklediği 0-1 aralığına çevirir. */
function kareAl(veri, n) {
  const kare = new Float32Array(KARE * KARE)
  const yer = n * KARE * KARE
  for (let i = 0; i < kare.length; i++) kare[i] = veri[yer + i] / 255
  return kare
}

if (!isMainThread) {
  // ---------------------------------------------------------------- işçi
  const veri = new Uint8Array(workerData.veriTamponu)
  const etiket = new Uint8Array(workerData.etiketTamponu)
  const paylasilanEgim = gorunumler(workerData.egimTamponu)

  parentPort.on('message', (mesaj) => {
    if (mesaj.tur === 'egit') {
      for (const ad of SIRA) egim[ad].fill(0)
      let kayip = 0
      for (const n of mesaj.indeksler) {
        const girdi = cogalt(kareAl(veri, n), rast)
        kayip += geri(girdi, ileri(girdi), etiket[n])
      }
      for (const ad of SIRA) paylasilanEgim[ad].set(egim[ad])
      parentPort.postMessage({ kayip })
      return
    }

    let dogru = 0
    for (const n of mesaj.indeksler) {
      const puan = ileri(cogalt(kareAl(veri, n), rast)).puan
      let en = 0
      for (let s = 1; s < puan.length; s++) if (puan[s] > puan[en]) en = s
      if (en === etiket[n]) dogru++
    }
    parentPort.postMessage({ dogru })
  })
} else {
  // ----------------------------------------------------------------- ana
  const { x, y } = veriyiTopla()

  // Veri paylaşılan tampona Uint8 olarak yazılıyor: Float32 olsaydı aynı
  // küme dört kat yer tutardı ve kaynağı zaten sekiz bitlik.
  const veriTamponu = new SharedArrayBuffer(x.length * KARE * KARE)
  const etiketTamponu = new SharedArrayBuffer(x.length)
  const veri = new Uint8Array(veriTamponu)
  const etiket = new Uint8Array(etiketTamponu)
  for (let i = 0; i < x.length; i++) {
    const yer = i * KARE * KARE
    for (let j = 0; j < KARE * KARE; j++) veri[yer + j] = Math.round(x[i][j] * 255)
    etiket[i] = y[i]
  }

  const sira = [...x.keys()]
  for (let i = sira.length - 1; i > 0; i--) {
    const j = Math.floor(rast() * (i + 1))
    ;[sira[i], sira[j]] = [sira[j], sira[i]]
  }
  const ayirma = Math.floor(sira.length * 0.9)
  const egitim = sira.slice(0, ayirma)
  const sinav = sira.slice(ayirma)
  console.log(`eğitim ${egitim.length}, sınav ${sinav.length}, tur ${TUR}, işçi ${ISCI_SAYISI}`)

  const bu = fileURLToPath(import.meta.url)
  const isciler = []
  const isciEgimleri = []
  for (let i = 0; i < ISCI_SAYISI; i++) {
    const egimTamponu = new SharedArrayBuffer(PARAMETRE * 4)
    isciEgimleri.push(gorunumler(egimTamponu))
    isciler.push(
      new Worker(bu, {
        argv: process.argv.slice(2),
        workerData: { sira: i, agirlikTamponu, veriTamponu, etiketTamponu, egimTamponu },
      }),
    )
  }

  /** Bir mesajı bütün işçilere dağıtıp cevaplarını bekler. */
  function dagit(tur, parcalar) {
    return Promise.all(
      isciler.map(
        (isci, i) =>
          new Promise((coz) => {
            if (parcalar[i].length === 0) {
              coz({ kayip: 0, dogru: 0 })
              return
            }
            isci.once('message', coz)
            isci.postMessage({ tur, indeksler: parcalar[i] })
          }),
      ),
    )
  }

  /** Diziyi işçi sayısı kadar parçaya böler. */
  function bol(liste) {
    const parcalar = Array.from({ length: ISCI_SAYISI }, () => [])
    liste.forEach((n, i) => parcalar[i % ISCI_SAYISI].push(n))
    return parcalar
  }

  for (let tur = 1; tur <= TUR; tur++) {
    // Son turdaki adım, ilkinin %2'si olacak biçimde soluyor.
    const adim = BASLANGIC_ADIMI * Math.pow(Math.pow(0.02, 1 / Math.max(1, TUR - 1)), tur - 1)
    let kayip = 0
    const basla = Date.now()

    for (let i = egitim.length - 1; i > 0; i--) {
      const j = Math.floor(rast() * (i + 1))
      ;[egitim[i], egitim[j]] = [egitim[j], egitim[i]]
    }

    for (let b = 0; b + YIGIN <= egitim.length; b += YIGIN) {
      const cevaplar = await dagit('egit', bol(egitim.slice(b, b + YIGIN)))
      for (const c of cevaplar) kayip += c.kayip
      // İşçilerin eğimleri toplanıyor; güncelleme tek yerden, tek kez.
      for (const ad of SIRA) {
        const hedef = egim[ad]
        hedef.fill(0)
        for (const isciEgim of isciEgimleri) {
          const kaynak = isciEgim[ad]
          for (let i = 0; i < hedef.length; i++) hedef[i] += kaynak[i]
        }
      }
      guncelle(adim, YIGIN)
    }

    const sinavCevaplari = await dagit('sinav', bol(sinav))
    const dogru = sinavCevaplari.reduce((t, c) => t + c.dogru, 0)

    const basari = ((dogru / sinav.length) * 100).toFixed(2)
    console.log(
      `tur ${tur}: kayıp ${(kayip / egitim.length).toFixed(4)}  başarı %${basari}  ${((Date.now() - basla) / 1000).toFixed(0)}sn`,
    )
    yaz(basari)
  }

  for (const isci of isciler) await isci.terminate()
}

function yaz(basari) {
  const sira = ['k1', 'b1', 'k2', 'b2', 'w', 'b']
  const toplam = sira.reduce((t, ad) => t + p[ad].length, 0)
  const hepsi = new Float32Array(toplam)
  let yer = 0
  for (const ad of sira) { hepsi.set(p[ad], yer); yer += p[ad].length }
  const base64 = Buffer.from(hepsi.buffer).toString('base64')

  writeFileSync(
    'lib/karakter-agirliklari.ts',
    `/**\n * Karakter tanıyıcının ağırlıkları — **elle düzenlenmiyor**.\n *\n * \`scripts/taniyici-egit.mjs\` üretiyor; veri EMNIST (NIST el yazısı derlemi),\n * ${toplam} parametre, ayrılmış sınav kümesinde %${basari} başarı.\n *\n * Ağın biçimi ve okunma sırası \`lib/karakter-tani.ts\` içinde.\n */\n\nexport const AGIRLIKLAR =\n  '${base64}'\n`,
  )
}
