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
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const KARE = 28
const SINIFLAR = ['0','1','2','3','4','5','6','7','8','9','B','D','Y','diğer']
const S1 = 16, S2 = 32, C = 5
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

const [klasor = '.', turArg] = process.argv.slice(2)
const TUR = Number(turArg ?? 8)
const ORNEK_BASINA = 6000

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

  const x = [], y = []
  kova.forEach((liste, s) => liste.forEach((k) => { x.push(k); y.push(s) }))
  console.log('sınıf başına:', kova.map((k) => k.length).join(' '))
  return { x, y }
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
  if (kalinlik < 0.45) return kalinlastir(cikti, 1)
  if (kalinlik < 0.55) return inceltilmis(cikti)
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
const rast = rastgeleTohum(20260903)

function dizi(n, olcek) {
  const d = new Float32Array(n)
  for (let i = 0; i < n; i++) d[i] = (rast() * 2 - 1) * olcek
  return d
}

// He başlatması: ReLU'da varyansı koruyor, aksi hâlde derin katman sönüyor.
const p = {
  k1: dizi(S1 * C * C, Math.sqrt(2 / (C * C))),
  b1: new Float32Array(S1),
  k2: dizi(S2 * S1 * C * C, Math.sqrt(2 / (S1 * C * C))),
  b2: new Float32Array(S2),
  w: dizi(SINIFLAR.length * S2 * 16, Math.sqrt(2 / (S2 * 16))),
  b: new Float32Array(SINIFLAR.length),
}
const hiz = Object.fromEntries(Object.keys(p).map((k) => [k, new Float32Array(p[k].length)]))
const egim = Object.fromEntries(Object.keys(p).map((k) => [k, new Float32Array(p[k].length)]))

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

const { x, y } = veriyiTopla()
const sira = [...x.keys()]
for (let i = sira.length - 1; i > 0; i--) {
  const j = Math.floor(rast() * (i + 1))
  ;[sira[i], sira[j]] = [sira[j], sira[i]]
}
const ayirma = Math.floor(sira.length * 0.9)
const egitim = sira.slice(0, ayirma)
const sinav = sira.slice(ayirma)
console.log(`eğitim ${egitim.length}, sınav ${sinav.length}, tur ${TUR}`)

const YIGIN = 32
for (let tur = 1; tur <= TUR; tur++) {
  // Son turdaki adım, ilkinin %2'si olacak biçimde soluyor.
  const adim = 0.06 * Math.pow(Math.pow(0.02, 1 / Math.max(1, TUR - 1)), tur - 1)
  let kayip = 0
  const basla = Date.now()

  for (let i = egitim.length - 1; i > 0; i--) {
    const j = Math.floor(rast() * (i + 1))
    ;[egitim[i], egitim[j]] = [egitim[j], egitim[i]]
  }

  for (let b = 0; b + YIGIN <= egitim.length; b += YIGIN) {
    for (let i = 0; i < YIGIN; i++) {
      const n = egitim[b + i]
      const girdi = cogalt(x[n], rast)
      kayip += geri(girdi, ileri(girdi), y[n])
    }
    guncelle(adim, YIGIN)
  }

  let dogru = 0
  for (const n of sinav) {
    const puan = ileri(cogalt(x[n], rast)).puan
    let en = 0
    for (let s = 1; s < puan.length; s++) if (puan[s] > puan[en]) en = s
    if (en === y[n]) dogru++
  }

  const basari = ((dogru / sinav.length) * 100).toFixed(2)
  console.log(`tur ${tur}: kayıp ${(kayip / egitim.length).toFixed(4)}  başarı %${basari}  ${((Date.now() - basla) / 1000).toFixed(0)}sn`)
  yaz(basari)
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
