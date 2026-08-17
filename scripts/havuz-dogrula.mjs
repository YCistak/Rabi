/**
 * Yazım oyunu havuzunu TDK Güncel Türkçe Sözlük'e karşı doğrular.
 *
 * Neden gerekli: havuzdaki "doğru" yazılışlar internetteki listelerden derlendi,
 * o listelerin bir kısmı hatalı (kimi kaynak "ıstırap" yerine "ızdırap" diyor).
 * Tek kelimelik her giriş sozluk.gov.tr'ye soruluyor:
 *   - `dogru` sözlükte **bulunmalı**,
 *   - `yanlis` sözlükte **bulunmamalı** (bulunuyorsa çift belirsiz demektir).
 *
 * Çok kelimeli girişler (cümleler, ayrı yazılan kalıplar) sözlükte madde başı
 * olmayabilir; onlar atlanır ve raporun sonunda sayısı yazılır.
 *
 * Kullanım: node scripts/havuz-dogrula.mjs
 * Ağ gerektirir; CI'da çalıştırılmaz, havuza dokunulduğunda elle çalıştırılır.
 */

import { readFileSync } from 'node:fs'

const kaynak = readFileSync(new URL('../lib/oyunlar/yazim-havuzu.ts', import.meta.url), 'utf8')

// Havuz TypeScript; derlemeden okumak için satırlardaki ['doğru', 'yanlış'] çiftleri ayıklanıyor.
const ciftler = [...kaynak.matchAll(/^\s*\['([^']+)',\s*'([^']+)'\],\s*$/gm)].map((e) => ({
  dogru: e[1],
  yanlis: e[2],
}))

const TEK_KELIME = /^[a-zçğıöşüâîûA-ZÇĞİÖŞÜ]+$/

/**
 * Beklenen uyarılar — elle incelenip doğru bulunanlar.
 *
 * `cekimli`: madde başı değil, çekimli biçim ("bura" + "-da"). Sözlükte
 * bulunmaması normal; yazılışı yine de doğru.
 * `sapkasiz`: sözlüğün araması düzeltme işaretini yok sayıyor, şapkasız yazılış
 * da aynı maddeyi buluyor. Belirsizlik değil, aramanın davranışı.
 */
const BEKLENEN = {
  cekimli: ['burada', 'orada', 'şurada'],
  sapkasiz: ['kâğıt', 'rüzgâr', 'mahkûm', 'tezgâh', 'dükkân', 'mekân', 'imkân', 'kâtip', 'sükûnet', 'klasik'],
}

async function sozluktekiMi(kelime) {
  const adres = `https://sozluk.gov.tr/gts?ara=${encodeURIComponent(kelime)}`
  for (let deneme = 0; deneme < 3; deneme++) {
    try {
      const cevap = await fetch(adres, { signal: AbortSignal.timeout(15000) })
      const veri = await cevap.json()
      return Array.isArray(veri)
    } catch {
      await new Promise((c) => setTimeout(c, 800))
    }
  }
  return null // ağ hatası — "bilinmiyor"
}

const sorunlar = []
let atlanan = 0
let bakilan = 0

for (const { dogru, yanlis } of ciftler) {
  if (!TEK_KELIME.test(dogru) || !TEK_KELIME.test(yanlis)) {
    atlanan++
    continue
  }
  bakilan++

  const dogruVar = await sozluktekiMi(dogru)
  const yanlisVar = await sozluktekiMi(yanlis)

  if (dogruVar === false && !BEKLENEN.cekimli.includes(dogru)) {
    sorunlar.push(`YOK       ${dogru}  (doğru şık sözlükte bulunamadı)`)
  }
  if (yanlisVar === true && !BEKLENEN.sapkasiz.includes(dogru)) {
    sorunlar.push(`BELİRSİZ  ${dogru} / ${yanlis}  (yanlış şık da sözlükte var)`)
  }
  if (dogruVar === null || yanlisVar === null) sorunlar.push(`AĞ        ${dogru} / ${yanlis}`)
}

console.log(`Çift sayısı: ${ciftler.length} · sözlüğe sorulan: ${bakilan} · atlanan (çok kelimeli): ${atlanan}`)

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
