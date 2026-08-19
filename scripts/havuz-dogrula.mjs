/**
 * Yazım oyunu havuzunu TDK'ya karşı doğrular.
 *
 * Neden gerekli: havuzdaki "doğru" yazılışlar internetteki listelerden derlendi,
 * o listelerin bir kısmı hatalı (kimi kaynak "ıstırap" yerine "ızdırap" diyor).
 *
 * ## Hakem neden Yazım Kılavuzu, sözlük değil
 *
 * Betik önce Güncel Türkçe Sözlük'e (gts) soruyordu ve iki türlü yanılıyordu:
 *
 * 1. **Yanlış alarm.** Sözlükte "makina" ve "ünvan" maddeleri var; Yazım
 *    Kılavuzu ise yalnızca "makine" ve "unvan" diyor. Oyunun sorduğu şey
 *    yazılış olduğu için hakem de kılavuz olmalı. ("unvan" sözlükte hiç yok,
 *    kılavuzda var — sözlüğe göre havuzdaki doğru şık "bulunamadı" çıkıyordu.)
 * 2. **Şapka körlüğü.** Arama düzeltme işaretini yok sayıyor: "hikaye" sorgusu
 *    "hikâye" maddesini buluyor ve yanlış şık da sözlükteymiş gibi görünüyordu.
 *    Bunun için elle tutulan bir istisna listesi vardı; artık gerek yok, çünkü
 *    dönen maddenin sorgunun **birebir aynısı** olması şart koşuluyor.
 *
 * ## Ne denetleniyor
 *
 * - `dogru` tek kelimeyse kılavuzda birebir bulunmalı (bulunamazsa sözlüğe de
 *   sorulur: çekimli biçimler kılavuzda madde başı olmayabiliyor).
 * - `yanlis` tek kelimeyse hiçbirinde bulunmamalı — bulunuyorsa çift belirsiz
 *   demektir, iki şık da doğru sayılabilir.
 * - Boşluklu girişler (*her şey*, *ayrı yazılan kalıplar*) sorulmuyor: kılavuz
 *   uç noktası boşluklu sorguya doğru yazılışta bile "yok" cevabı veriyor.
 *   İki yanı da boşlukluysa çift atlanır, biri tek kelimeyse yalnızca o yan
 *   denetlenir — "her şey / herşey" çiftinde yanlış şık böyle yakalanıyor.
 *
 * Kullanım: node scripts/havuz-dogrula.mjs
 * Ağ gerektirir; CI'da çalıştırılmaz, havuza dokunulduğunda elle çalıştırılır.
 */

import { readFileSync } from 'node:fs'

const kaynak = readFileSync(new URL('../lib/oyunlar/yazim-havuzu.ts', import.meta.url), 'utf8')

// Havuz TypeScript; derlemeden okumak için satırlardaki ['doğru', 'yanlış'] çiftleri
// ayıklanıyor. Üçüncü eleman (zorluk) isteğe bağlı: desende yokken zorluğu elle
// yazılmış satırlar sessizce denetim dışı kalıyordu.
const ciftler = [
  ...kaynak.matchAll(/^\s*\['([^']+)',\s*'([^']+)'(?:,\s*'[^']+')?\],\s*$/gm),
].map((e) => ({ dogru: e[1], yanlis: e[2] }))

const TEK_KELIME = /^[a-zçğıöşüâîûA-ZÇĞİÖŞÜ]+$/

async function sor(uc, kelime) {
  const adres = `https://sozluk.gov.tr/${uc}?ara=${encodeURIComponent(kelime)}`
  for (let deneme = 0; deneme < 3; deneme++) {
    try {
      const cevap = await fetch(adres, { signal: AbortSignal.timeout(15000) })
      const veri = await cevap.json()
      if (!Array.isArray(veri)) return false
      // Birebir eşleşme şart: arama şapkayı yok sayıyor, "kabus" sorgusu
      // "kâbus" maddesini döndürüyor. Alan adı iki uçta farklı.
      const alan = uc === 'yazim' ? 'sozu' : 'madde'
      return veri.some((madde) => (madde[alan] ?? '').localeCompare(kelime, 'tr') === 0)
    } catch {
      await new Promise((c) => setTimeout(c, 800))
    }
  }
  return null // ağ hatası — "bilinmiyor"
}

/**
 * Doğru şık için: kılavuzda yoksa sözlüğe de bakılıyor — çekimli biçimler
 * ("burada") kılavuzda madde başı olmayabiliyor.
 */
async function dogruTaniniyorMu(kelime) {
  const kilavuz = await sor('yazim', kelime)
  if (kilavuz === true) return true
  const sozluk = await sor('gts', kelime)
  if (kilavuz === null && sozluk === null) return null
  return sozluk === true
}

/**
 * Yanlış şık için: yalnızca kılavuz.
 *
 * Sözlüğe de bakılsaydı "makina" ve "ünvan" yanlış alarm verirdi; ikisi de
 * sözlükte madde ama kılavuz "makine" ve "unvan" diyor. Sorulan şey yazılış
 * olduğu için hakem kılavuz.
 */
async function yanlisTaniniyorMu(kelime) {
  return sor('yazim', kelime)
}

/**
 * Denetim dışı bırakılan doğru şıklar.
 *
 * Hiçbiri madde başı değil, bulunmamaları normal: `cekimli` günlük sözcüklerin
 * çekimi, `ozelAd` ise kesme işareti kuralını ölçen özel ad çekimleri
 * ("Türkçe" kılavuzda var, "Türkçede" yok).
 */
const BEKLENEN = {
  cekimli: ['burada', 'orada', 'şurada'],
  ozelAd: ['Türkçede', 'Ankaralıyım', 'Ahmetlerde', 'Avrupalılar'],
}

const sorunlar = []
let atlanan = 0
let bakilan = 0

for (const { dogru, yanlis } of ciftler) {
  const dogruTek = TEK_KELIME.test(dogru)
  const yanlisTek = TEK_KELIME.test(yanlis)
  if (!dogruTek && !yanlisTek) {
    atlanan++
    continue
  }
  bakilan++

  const beklenen = [...BEKLENEN.cekimli, ...BEKLENEN.ozelAd]
  if (dogruTek && !beklenen.includes(dogru)) {
    const var_mi = await dogruTaniniyorMu(dogru)
    if (var_mi === false) sorunlar.push(`YOK       ${dogru}  (doğru şık TDK'da bulunamadı)`)
    if (var_mi === null) sorunlar.push(`AĞ        ${dogru}`)
  }

  if (yanlisTek) {
    const var_mi = await yanlisTaniniyorMu(yanlis)
    if (var_mi === true) {
      sorunlar.push(`BELİRSİZ  ${dogru} / ${yanlis}  (yanlış şık da TDK'da var)`)
    }
    if (var_mi === null) sorunlar.push(`AĞ        ${yanlis}`)
  }
}

console.log(
  `Çift sayısı: ${ciftler.length} · denetlenen: ${bakilan} · atlanan (iki yanı da boşluklu): ${atlanan}`,
)

const tekrar = new Map()
for (const { dogru } of ciftler) tekrar.set(dogru, (tekrar.get(dogru) ?? 0) + 1)
for (const [kelime, adet] of tekrar) if (adet > 1) sorunlar.push(`TEKRAR    ${kelime} (${adet} kez)`)

if (sorunlar.length === 0) {
  console.log('Havuz temiz.')
} else {
  console.log(`\n${sorunlar.length} sorun:`)
  for (const satir of sorunlar) console.log('  ' + satir)
  process.exitCode = 1
}
