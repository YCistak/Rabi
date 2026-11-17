import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const argumanlar = process.argv.slice(2)
const denetle = argumanlar.includes('--denetle')
const kaynak = argumanlar.find((deger) => deger !== '--denetle')
if (!kaynak) throw new Error('Kullanım: node scripts/soru-bankasi-aktar.mjs <kaynakKlasör> [--denetle]')
const kok = resolve(kaynak); const hedef = resolve('lib/soru-bankasi/veri'); const hatalar = []; const aktarilan = []

const gorselDogrulamalari = {
  koordinat: (g) => Array.isArray(g.pencere) && g.pencere.length === 4 && g.pencere.every(Number.isFinite),
  sayiDogrusu: (g) => Array.isArray(g.aralik) && g.aralik.length === 2 && g.aralik.every(Number.isFinite),
  venn: (g) => typeof g.sol === 'string' && typeof g.sag === 'string',
  akis: (g) => Array.isArray(g.adimlar) && g.adimlar.every((a) => a && typeof a.ad === 'string'),
  tablo: (g) => Array.isArray(g.basliklar) && Array.isArray(g.satirlar) && g.basliklar.every((a) => typeof a === 'string') && g.satirlar.every((s) => Array.isArray(s) && s.length === g.basliklar.length && s.every((a) => typeof a === 'string')),
  katman: (g) => Array.isArray(g.katmanlar) && g.katmanlar.every((a) => a && typeof a.ad === 'string'),
}

function soruGecerliMi(soru, dosya, sira) {
  const hata = (metin) => (hatalar.push(`${dosya} [${sira + 1}]: ${metin}`), false)
  if (!soru || typeof soru !== 'object') return hata('nesne değil')
  if (typeof soru.konu !== 'string' || !soru.konu) return hata('konu eksik')
  if (![1, 2, 3].includes(soru.zorluk)) return hata('zorluk 1–3 değil')
  if (typeof soru.soru !== 'string' || !soru.soru.trim() || soru.soru.length > 700) return hata('soru metni geçersiz')
  if (!Array.isArray(soru.siklar) || soru.siklar.length !== 5 || new Set(soru.siklar).size !== 5 || !soru.siklar.every((s) => typeof s === 'string' && s.trim())) return hata('beş farklı şık yok')
  if (![0, 1, 2, 3, 4].includes(soru.dogru) || typeof soru.cozum !== 'string' || !soru.cozum.trim()) return hata('cevap ya da çözüm geçersiz')
  if (soru.onculler !== undefined && soru.onculler !== null && (!Array.isArray(soru.onculler) || !soru.onculler.every((a) => typeof a === 'string'))) return hata('öncüller geçersiz')
  if (soru.gorsel !== undefined && soru.gorsel !== null && (!soru.gorsel || typeof soru.gorsel !== 'object' || !gorselDogrulamalari[soru.gorsel.tur]?.(soru.gorsel))) return hata('görsel biçimi geçersiz')
  return true
}

for (const sinif of await readdir(kok, { withFileTypes: true })) {
  if (!sinif.isDirectory() || !/^(9|10|11)$/.test(sinif.name)) continue
  const klasor = join(kok, sinif.name)
  for (const dosya of await readdir(klasor)) {
    if (!dosya.endsWith('.json')) continue
    const yol = join(klasor, dosya); let ham
    try { ham = JSON.parse(await readFile(yol, 'utf8')) } catch { hatalar.push(`${yol}: JSON okunamadı`); continue }
    if (!Array.isArray(ham)) { hatalar.push(`${yol}: kök dizi değil`); continue }
    const id = dosya.slice(0, -5); const gorulen = new Set()
    const sorular = ham.filter((soru, sira) => soruGecerliMi(soru, yol, sira)).filter((soru, sira) => {
      if (soru.konu !== id) { hatalar.push(`${yol} [${sira + 1}]: konu kimliği dosya adıyla uyuşmuyor`); return false }
      if (gorulen.has(soru.soru)) { hatalar.push(`${yol} [${sira + 1}]: birebir aynı soru metni atlandı`); return false }
      gorulen.add(soru.soru); return true
    }).map(({ tip, kontrol_py, gorsel, onculler, ...soru }) => ({ ...soru, ...(onculler?.length ? { onculler } : {}), ...(gorsel ? { gorsel } : {}) })).sort((a, b) => a.zorluk - b.zorluk)
    if (!sorular.length) continue
    aktarilan.push({ id, sayi: sorular.length, sorular })
  }
}

const satirlar = aktarilan.sort((a, b) => a.id.localeCompare(b.id)).map(({ id, sayi }) => `  '${id}': { sayi: ${sayi}, yukle: () => import('./veri/${id}.json') as unknown as Promise<{ default: BankaSorusu[] }> },`).join('\n')
const dizin = `/* Bu dosya soru-bankasi-aktar.mjs tarafından veri eşlemesiyle güncellenir. */\nimport { programBul } from '../konu'\nimport type { BankaSorusu } from './tip'\n\nexport type BankaKonusu = { id: string; ad: string; sayi: number; yukle?: () => Promise<{ default: BankaSorusu[] }> }\nexport type BankaTemasi = { id: string; ad: string; konular: BankaKonusu[] }\nexport type BankaSinifi = { sinif: 9 | 10 | 11; temalar: BankaTemasi[] }\n\nexport const AKTARILAN_KONULAR: Record<string, Pick<BankaKonusu, 'sayi' | 'yukle'>> = {\n${satirlar}\n}\n\nexport const BANKA_DIZINI: BankaSinifi[] = ([9, 10, 11] as const).map((sinif) => { const program = programBul('matematik', sinif); return { sinif, temalar: (program?.temalar ?? []).map((tema) => ({ id: tema.id, ad: tema.ad, konular: tema.konular.map((konu) => ({ id: konu.id, ad: konu.ad, ...(AKTARILAN_KONULAR[konu.id] ?? { sayi: 0 }) })) })) } })\nexport function bankaKonusuBul(id: string): BankaKonusu | undefined { return BANKA_DIZINI.flatMap((sinif) => sinif.temalar).flatMap((tema) => tema.konular).find((konu) => konu.id === id) }\n`
if (!denetle) { await mkdir(hedef, { recursive: true }); for (const { id, sorular } of aktarilan) await writeFile(join(hedef, `${id}.json`), JSON.stringify(sorular), 'utf8'); await writeFile(resolve('lib/soru-bankasi/dizin.ts'), dizin, 'utf8') }
if (hatalar.length) console.error(`Atlanan soru/dosyalar:\n${hatalar.join('\n')}`)
console.log(`${aktarilan.length} konu doğrulandı${denetle ? ' (yazılmadı)' : ' ve aktarıldı'}.`)
