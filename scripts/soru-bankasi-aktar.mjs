import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
// Şekil denetimi uygulamayla ortak; Node .ts dosyasını tip ayıklamasıyla okuyor.
import { gorselHatasi } from '../lib/soru-bankasi/gorsel-denetim.ts'

const argumanlar = process.argv.slice(2)
const denetle = argumanlar.includes('--denetle')
const kaynak = argumanlar.find((deger) => deger !== '--denetle')
if (!kaynak) throw new Error('Kullanım: node scripts/soru-bankasi-aktar.mjs <kaynakKlasör> [--denetle]')
// Konu kimliğinin öneki dersi söyler (lib/soru-bankasi/ders.ts).
const ONEKLER = ['mat', 'fzk']
const kok = resolve(kaynak); const hedef = resolve('lib/soru-bankasi/veri'); const hatalar = []; const aktarilan = []

function soruGecerliMi(soru, dosya, sira) {
  const hata = (metin) => (hatalar.push(`${dosya} [${sira + 1}]: ${metin}`), false)
  if (!soru || typeof soru !== 'object') return hata('nesne değil')
  if (typeof soru.konu !== 'string' || !soru.konu) return hata('konu eksik')
  if (![1, 2, 3].includes(soru.zorluk)) return hata('zorluk 1–3 değil')
  if (typeof soru.soru !== 'string' || !soru.soru.trim() || soru.soru.length > 700) return hata('soru metni geçersiz')
  if (!Array.isArray(soru.siklar) || soru.siklar.length !== 5 || new Set(soru.siklar).size !== 5 || !soru.siklar.every((s) => typeof s === 'string' && s.trim())) return hata('beş farklı şık yok')
  if (![0, 1, 2, 3, 4].includes(soru.dogru) || typeof soru.cozum !== 'string' || !soru.cozum.trim()) return hata('cevap ya da çözüm geçersiz')
  if (soru.onculler !== undefined && soru.onculler !== null && (!Array.isArray(soru.onculler) || !soru.onculler.every((a) => typeof a === 'string'))) return hata('öncüller geçersiz')
  if (soru.gorsel !== undefined && soru.gorsel !== null) {
    const sekilHatasi = gorselHatasi(soru.gorsel)
    if (sekilHatasi) return hata(`görsel biçimi geçersiz: ${sekilHatasi}`)
  }
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
    if (!ONEKLER.some((onek) => id.startsWith(onek))) { hatalar.push(`${yol}: konu kimliğinin dersi tanınmıyor (önek ${ONEKLER.join('/')})`); continue }
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
const dizin = `/* Bu dosya soru-bankasi-aktar.mjs tarafından veri eşlemesiyle güncellenir. */
import { programBul } from '../konu'
import type { BankaDersi } from './ders'
import type { BankaSorusu } from './tip'

export type BankaKonusu = { id: string; ad: string; sayi: number; yukle?: () => Promise<{ default: BankaSorusu[] }> }
export type BankaTemasi = { id: string; ad: string; konular: BankaKonusu[] }
export type BankaSinifi = { sinif: 9 | 10 | 11; temalar: BankaTemasi[] }

export const AKTARILAN_KONULAR: Record<string, Pick<BankaKonusu, 'sayi' | 'yukle'>> = {
${satirlar}
}

/** Bir dersin 9–11 dizini: programdaki her konu; verisi gelmemiş konu \`sayi: 0\` ("Yakında"). */
function dizinKur(ders: BankaDersi): BankaSinifi[] { return ([9, 10, 11] as const).map((sinif) => { const program = programBul(ders, sinif); return { sinif, temalar: (program?.temalar ?? []).map((tema) => ({ id: tema.id, ad: tema.ad, konular: tema.konular.map((konu) => ({ id: konu.id, ad: konu.ad, ...(AKTARILAN_KONULAR[konu.id] ?? { sayi: 0 }) })) })) } }) }
export const BANKA_DIZINLERI: Record<BankaDersi, BankaSinifi[]> = { matematik: dizinKur('matematik'), fizik: dizinKur('fizik') }
export function bankaKonusuBul(id: string): BankaKonusu | undefined { return Object.values(BANKA_DIZINLERI).flat().flatMap((sinif) => sinif.temalar).flatMap((tema) => tema.konular).find((konu) => konu.id === id) }
`
if (!denetle) { await mkdir(hedef, { recursive: true }); for (const { id, sorular } of aktarilan) await writeFile(join(hedef, `${id}.json`), JSON.stringify(sorular), 'utf8'); await writeFile(resolve('lib/soru-bankasi/dizin.ts'), dizin, 'utf8') }
if (hatalar.length) console.error(`Atlanan soru/dosyalar:\n${hatalar.join('\n')}`)
console.log(`${aktarilan.length} konu doğrulandı${denetle ? ' (yazılmadı)' : ' ve aktarıldı'}.`)
