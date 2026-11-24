/*
  Ham kimya sorularını Soru Bankası'nın aktarma biçimine çevirir.

  Kullanım:
    node scripts/kimya-donustur.mjs <hamKlasör> <araKlasör>
    node scripts/soru-bankasi-aktar.mjs <araKlasör>

  Ham klasörde `sorular/<sınıf>-*.json` ve `gorseller/<sınıf>/*.svg` durur; ham
  klasör yalnız okunur. Yalnız `scripts/kimya-onay.json`daki sorular geçer:
  kimlik → içerik özeti. Özet kör çözüm ve denetimden geçmiş hâlin özetidir;
  soru ya da şekli sonradan değişirse özet tutmaz ve soru, yeniden çözülüp
  onaylanana kadar dışarıda kalır.
*/
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { svgHatasi, svgOlcusu } from '../lib/soru-bankasi/svg-denetim.ts'

const HARFLER = ['A', 'B', 'C', 'D', 'E']
/** Bozuk kodlama, HTML/Markdown/LaTeX artığı, görünmez karakter. */
const BOZUK = /\uFFFD|[ÃÄÅ]|<\/?[a-z]+[ >]|\*\*|\$|\\[a-z]|&(?:[a-z]+|#\d+);|[\u0000-\u0008\u000B-\u001F\u200B-\u200F\u202A-\u202E\uFEFF]/
const KIMLIK = /^kim(9|10|11)-[a-z0-9]+-\d{3}$/

/** Onaylanan içeriğin özeti: kök, şıklar, cevap, çözüm ve şeklin kendisi. */
export function soruOzeti(s, svg) {
  return createHash('sha256').update(JSON.stringify([s.kok, HARFLER.map((h) => s.secenekler[h]), s.cevap, s.cozum, svg])).digest('hex').slice(0, 12)
}

/** Ham öğeyi `BankaSorusu`ya çevirir. Kaynak ve kazanım alanları uygulamaya girmez. */
export function cevir(s, konu, svg) {
  const hata = (metin) => { throw new Error(metin) }
  if (!s.gorsel !== !svg) hata('şekil dosyası yok')
  const siklar = HARFLER.map((h) => s.secenekler?.[h])
  if (siklar.some((m) => typeof m !== 'string' || !m.trim()) || new Set(siklar).size !== 5) hata('beş farklı şık yok')
  const dogru = HARFLER.indexOf(s.cevap)
  if (dogru === -1) hata('cevap harfi geçersiz')
  for (const metin of [s.kok, s.cozum, ...siklar, ...(svg ? [s.gorselAciklama] : [])])
    if (typeof metin !== 'string' || !metin.trim() || BOZUK.test(metin)) hata(`metin boş ya da bozuk: ${String(metin).slice(0, 60)}`)
  // Piktogram gibi şekillerde hiç yazı olmayabilir; varsa bozuk olmamalı.
  if (svg && BOZUK.test(svg.replace(/<[^>]*>/g, ' '))) hata('şekil yazısı bozuk')
  if (svg) { const kusur = svgHatasi(svg); if (kusur) hata(`svg: ${kusur}`) }
  // Öncüller kökte kalır: soru cümlesi öncüllerden sonra geliyor ("…yargılarından
  // hangileri doğrudur?"); ayrı alana alınsa soru cümlesi öncüllerin üstüne çıkardı.
  return {
    konu, zorluk: s.zorluk, soru: s.kok.trim(), siklar, dogru, cozum: s.cozum.trim(),
    ...(svg ? { gorsel: { tur: 'svg', yol: `soru-bankasi/kimya/${konu.match(/^kim(\d+)/)[1]}/${s.id}.svg`, aciklama: s.gorselAciklama.trim(), ...svgOlcusu(svg) } } : {}),
  }
}

async function calistir([ham, ara]) {
  if (!ham || !ara) throw new Error('Kullanım: node scripts/kimya-donustur.mjs <hamKlasör> <araKlasör>')
  const onay = JSON.parse(await readFile(new URL('./kimya-onay.json', import.meta.url), 'utf8'))
  const konular = new Map(); const sekiller = []; const disarida = []; const gorulen = new Set()
  for (const sinif of ['9', '10', '11']) {
    // Konu kimliği tahmin edilmez: ham dosyanın yazdığı kimlik programda birebir bulunmalı.
    const program = await readFile(new URL(`../lib/konu/icerik/${sinif}-kimya.ts`, import.meta.url), 'utf8')
    const kimlikler = new Set([...program.matchAll(/\bkonu\('([^']+)'/g)].map((e) => e[1]))
    for (const dosya of (await readdir(join(ham, 'sorular'))).filter((d) => d.startsWith(`${sinif}-`) && d.endsWith('.json')).sort()) {
      const { rabiDeste, sorular } = JSON.parse(await readFile(join(ham, 'sorular', dosya), 'utf8'))
      if (!kimlikler.has(rabiDeste)) { disarida.push(`${dosya}: programda "${rabiDeste}" konusu yok`); continue }
      for (const s of sorular) {
        const ozet = onay[s.id]
        if (!ozet) { disarida.push(`${s.id}: onay listesinde yok`); continue }
        try {
          if (!KIMLIK.test(s.id) || gorulen.has(s.id)) throw new Error('kimlik geçersiz ya da tekrar')
          gorulen.add(s.id)
          const svg = s.gorsel ? await readFile(join(ham, 'gorseller', sinif, `${s.id}.svg`), 'utf8') : null
          if (soruOzeti(s, svg) !== ozet) throw new Error('onaydan sonra değişmiş')
          const soru = cevir(s, rabiDeste, svg)
          if (!konular.has(rabiDeste)) konular.set(rabiDeste, [])
          konular.get(rabiDeste).push(soru)
          if (svg) sekiller.push([soru.gorsel.yol, svg])
        } catch (e) { disarida.push(`${s.id}: ${e.message}`) }
      }
    }
  }
  for (const [konu, sorular] of konular) {
    const klasor = join(ara, konu.match(/^kim(\d+)/)[1]); await mkdir(klasor, { recursive: true })
    await writeFile(join(klasor, `${konu}.json`), JSON.stringify(sorular), 'utf8')
  }
  for (const [yol, svg] of sekiller) { const hedef = resolve('public', yol); await mkdir(join(hedef, '..'), { recursive: true }); await writeFile(hedef, svg, 'utf8') }
  if (disarida.length) console.error(`Dışarıda kalan:\n${disarida.join('\n')}`)
  console.log(`${[...konular.values()].flat().length} soru, ${sekiller.length} şekil, ${konular.size} konu dönüştürüldü; ${disarida.length} öğe dışarıda.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await calistir(process.argv.slice(2))
