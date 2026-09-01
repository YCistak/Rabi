/**
 * Dünya haritasını üretir: lib/oyunlar/dunya-havuzu.ts
 *
 * Kaynak **Natural Earth** (1:110m admin-0). Veri kamuya açık, telif kısıtı
 * yok; ham dosya projeye girmiyor — Türkiye haritasındaki (`harita-havuzu.ts`)
 * boru hattının aynısı burada da işliyor: indir → ayrıştır → izdüşüm →
 * sadeleştir → ölçekle.
 *
 * İzdüşüm **eşdikdörtgen** (equirectangular) ve bilerek öyle: iklim oyununun
 * sorduğu şey enleme bağlı ve eşdikdörtgende enlem düşey eksende doğrusal —
 * ekvatorun iki yanındaki simetri haritada da simetrik duruyor. Robinson gibi
 * bir izdüşümde kuşaklar eğrilir, "aynı enlemde aynı kuşak" sezgisi bozulurdu.
 *
 * Kullanım: node scripts/dunya-uret.mjs
 * Ağ gerektirir; havuz değiştiğinde değil, harita yenilendiğinde çalıştırılır.
 */

import { writeFileSync } from 'node:fs'

const KAYNAK =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'

/** Kutunun genişliği; SVG `viewBox` bununla kuruluyor. */
const GENISLIK = 1000

/**
 * Enlem sınırları.
 *
 * Antarktika dışarıda: eşdikdörtgende kutba yaklaşan her şey yatay olarak
 * uzuyor ve kıta haritanın alt üçte birini yiyordu. 84° kuzey de aynı sebeple
 * kesiliyor — orada kara yok denecek kadar az.
 */
const KUZEY = 84
const GUNEY = -56

const OLCEK = GENISLIK / 360
const YUKSEKLIK = Math.round((KUZEY - GUNEY) * OLCEK)

/**
 * Sadeleştirme toleransı, kutu birimiyle.
 *
 * 1000 birimlik bir kutuda 0,8 birim telefon ekranında yarım pikselden az;
 * sınırın gözle görülür ayrıntısı kaybolmuyor ama nokta sayısı beşte birine
 * iniyor.
 */
const TOLERANS = 0.8

/** Bundan küçük adalar atılıyor (kutu birimiyle alan). */
const EN_KUCUK_ALAN = 1.2

function izdusum([lon, lat]) {
  const y = (KUZEY - Math.min(KUZEY, Math.max(GUNEY, lat))) * OLCEK
  return [(lon + 180) * OLCEK, y]
}

/** Douglas–Peucker. */
function sadelestir(noktalar, tolerans) {
  if (noktalar.length < 3) return noktalar
  const tut = new Array(noktalar.length).fill(false)
  tut[0] = tut[noktalar.length - 1] = true
  const yigin = [[0, noktalar.length - 1]]
  while (yigin.length) {
    const [bas, son] = yigin.pop()
    let enUzak = 0
    let dizin = -1
    for (let i = bas + 1; i < son; i++) {
      const u = uzaklik(noktalar[i], noktalar[bas], noktalar[son])
      if (u > enUzak) {
        enUzak = u
        dizin = i
      }
    }
    if (enUzak > tolerans && dizin > 0) {
      tut[dizin] = true
      yigin.push([bas, dizin], [dizin, son])
    }
  }
  return noktalar.filter((_, i) => tut[i])
}

function uzaklik(n, a, b) {
  const [x, y] = n
  const [x1, y1] = a
  const [x2, y2] = b
  const dx = x2 - x1
  const dy = y2 - y1
  const uzun = dx * dx + dy * dy
  if (uzun === 0) return Math.hypot(x - x1, y - y1)
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / uzun))
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy))
}

function alan(halka) {
  let toplam = 0
  for (let i = 0; i < halka.length; i++) {
    const [x1, y1] = halka[i]
    const [x2, y2] = halka[(i + 1) % halka.length]
    toplam += x1 * y2 - x2 * y1
  }
  return Math.abs(toplam) / 2
}

function merkez(halka) {
  let x = 0
  let y = 0
  for (const [hx, hy] of halka) {
    x += hx
    y += hy
  }
  return [x / halka.length, y / halka.length]
}

function halkalar(geometri) {
  if (geometri.type === 'Polygon') return geometri.coordinates
  if (geometri.type === 'MultiPolygon') return geometri.coordinates.flat()
  return []
}

function yolYaz(halkalar) {
  return halkalar
    .map(
      (halka) =>
        'M' +
        halka.map(([x, y]) => `${yuvarla(x)},${yuvarla(y)}`).join(' ') +
        'Z',
    )
    .join('')
}

const yuvarla = (sayi) => Number(sayi.toFixed(1))

const cevap = await fetch(KAYNAK)
if (!cevap.ok) throw new Error(`Kaynak indirilemedi: ${cevap.status}`)
const veri = await cevap.json()

const ulkeler = []
for (const oge of veri.features) {
  const p = oge.properties
  const kod = p.ADM0_A3
  // Antarktika eşdikdörtgende haritanın altını yiyor; kaynak veride de
  // sınırları enlem kesiminin dışında kalıyor.
  if (kod === 'ATA') continue

  const cizilen = halkalar(oge.geometry)
    .map((halka) => sadelestir(halka.map(izdusum), TOLERANS))
    .filter((halka) => halka.length >= 4 && alan(halka) >= EN_KUCUK_ALAN)
  if (cizilen.length === 0) continue

  const enBuyuk = cizilen.reduce((a, b) => (alan(a) >= alan(b) ? a : b))
  ulkeler.push({
    kod,
    ad: p.NAME_TR || p.NAME,
    merkez: merkez(enBuyuk).map(yuvarla),
    yol: yolYaz(cizilen),
  })
}

ulkeler.sort((a, b) => a.kod.localeCompare(b.kod))

const satirlar = ulkeler
  .map((u) => `  ['${u.kod}', ${JSON.stringify(u.ad)}, ${u.merkez[0]}, ${u.merkez[1]},\n   '${u.yol}'],`)
  .join('\n')

const cikti = `/**
 * Dünya haritası — İklim Kuşakları oyununun zemini.
 *
 * Sınırlar **Natural Earth** (1:110m admin-0) verisinden üretildi; o veri
 * kamuya açık, telif kısıtı yok. Ham veri projeye girmiyor: koordinatlar
 * eşdikdörtgen izdüşümle düzleme indirildi, Douglas–Peucker ile sadeleştirildi
 * ve ${GENISLIK}×${YUKSEKLIK} birimlik bir kutuya oturtuldu.
 *
 * İzdüşüm eşdikdörtgen çünkü oyunun sorduğu şey enleme bağlı: burada enlem
 * düşey eksende doğrusal, yani ekvatorun iki yanındaki kuşaklar haritada da
 * simetrik duruyor. Antarktika ve 84° kuzeyin üstü kesildi — eşdikdörtgende
 * kutuplar yatay olarak uzuyor ve haritanın üçte birini yiyorlar.
 *
 * Dosya elle düzenlenmemeli: yeniden üretmek gerekirse
 * \`node scripts/dunya-uret.mjs\` çalıştırılmalı.
 */

/** Haritanın kutusu; SVG \`viewBox\` bu değerlerle kuruluyor. */
export const DUNYA_GENISLIK = ${GENISLIK}
export const DUNYA_YUKSEKLIK = ${YUKSEKLIK}

/** İzdüşümün enlem sınırları — nokta çevirisi de bunları kullanıyor. */
export const EN_KUZEY = ${KUZEY}
export const EN_GUNEY = ${GUNEY}

export type DunyaUlkesi = {
  /** ISO 3166-1 alpha-3 (Natural Earth \`ADM0_A3\`). */
  kod: string
  ad: string
  /** En büyük parçanın orta noktası; işaret halkası buraya konuyor. */
  merkez: [number, number]
  /** SVG yolu; \`viewBox\` kutusuna göre. */
  yol: string
}

/**
 * Boylam/enlemi kutu koordinatına çevirir.
 *
 * İklim havuzundaki bölge noktaları (Sahra, Amazon, Sibirya) ülke sınırıyla
 * değil bu çeviriyle işaretleniyor: bir çölün sınırı yok, ortası var.
 */
export function noktayaCevir(boylam: number, enlem: number): [number, number] {
  const olcek = DUNYA_GENISLIK / 360
  const kirpik = Math.min(EN_KUZEY, Math.max(EN_GUNEY, enlem))
  return [(boylam + 180) * olcek, (EN_KUZEY - kirpik) * olcek]
}

const HAM: [string, string, number, number, string][] = [
${satirlar}
]

export const DUNYA: DunyaUlkesi[] = HAM.map(([kod, ad, x, y, yol]) => ({
  kod,
  ad,
  merkez: [x, y],
  yol,
}))

/** Koddan ülke; havuz yalnızca kodu saklıyor. */
export function ulkeBul(kod: string): DunyaUlkesi | undefined {
  return DUNYA.find((u) => u.kod === kod)
}
`

writeFileSync(new URL('../lib/oyunlar/dunya-havuzu.ts', import.meta.url), cikti)
console.log(`${ulkeler.length} ülke, ${(cikti.length / 1024).toFixed(0)} KB`)
