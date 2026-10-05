/**
 * Sürüm yükseltir: build.gradle (versionCode +1, versionName), package.json.
 *
 *   npm run surum -- 0.9.1
 *   npm run surum -- 0.9.1 --kuru    (hiçbir şey yazmaz, yalnızca gösterir)
 *
 * Commit ya da etiket ATMAZ; yalnızca dosyaları günceller ve sonraki
 * komutları ekrana yazar. Sürüm tek yerde (build.gradle) tutuluyor: iOS
 * TestFlight akışı da oradan okuyor, iki mağaza aynı numarayı taşımalı.
 */
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const KOK = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const GRADLE = join(KOK, 'android/app/build.gradle')
const PAKET = join(KOK, 'package.json')
const KILIT = join(KOK, 'package-lock.json')
const NOT = join(KOK, 'android/surum-notlari/whatsnew-tr-TR')

/** `1.2.3` biçimi: üç parça, başında gereksiz sıfır yok. */
export function surumGecerliMi(s) {
  return typeof s === 'string' && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(s)
}

/** Sürüm parçalarını sayıya çevirir: '0.9.1' → [0, 9, 1]. */
function parcala(s) {
  return s.split('.').map(Number)
}

/** a > b ise pozitif, eşitse 0, küçükse negatif. */
export function surumKarsilastir(a, b) {
  const [x, y] = [parcala(a), parcala(b)]
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i]
  return 0
}

/** build.gradle metninden mevcut sürümü okur. */
export function gradleOku(metin) {
  const kod = metin.match(/^[ \t]*versionCode (\d+)/m)
  const ad = metin.match(/^[ \t]*versionName "([^"]+)"/m)
  if (!kod || !ad) throw new Error('build.gradle içinde versionCode/versionName bulunamadı')
  return { versionCode: Number(kod[1]), versionName: ad[1] }
}

/** versionCode'u 1 artırır, versionName'i yazar; yeni metni ve kodu döner. */
export function gradleGuncelle(metin, yeniSurum) {
  if (!surumGecerliMi(yeniSurum)) throw new Error(`Geçersiz sürüm: "${yeniSurum}" (örnek: 0.9.1)`)
  const { versionCode, versionName } = gradleOku(metin)
  if (surumKarsilastir(yeniSurum, versionName) <= 0) {
    throw new Error(`Yeni sürüm (${yeniSurum}) mevcut sürümden (${versionName}) büyük olmalı`)
  }
  const yeniKod = versionCode + 1
  const yeni = metin
    .replace(/^([ \t]*versionCode )\d+/m, `$1${yeniKod}`)
    .replace(/^([ \t]*versionName )"[^"]+"/m, `$1"${yeniSurum}"`)
  return { metin: yeni, versionCode: yeniKod, eskiSurum: versionName }
}

/** package.json (ve varsa package-lock.json) sürüm alanını eşitler. */
export function jsonSurumYaz(metin, yeniSurum, kilitMi = false) {
  const nesne = JSON.parse(metin)
  nesne.version = yeniSurum
  if (kilitMi && nesne.packages?.['']) nesne.packages[''].version = yeniSurum
  return JSON.stringify(nesne, null, 2) + '\n'
}

function yardim() {
  console.log(`Kullanım: npm run surum -- <yeniSurum> [--kuru]

  <yeniSurum>  X.Y.Z biçiminde, mevcut sürümden büyük (ör. 0.9.1)
  --kuru       Dosyalara yazmaz, yalnızca ne olacağını gösterir
  --help       Bu yardım

versionCode otomatik 1 artar. Commit ve etiket atılmaz.`)
}

function ana(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return yardim()
  const kuru = argv.includes('--kuru')
  const yeniSurum = argv.find((a) => !a.startsWith('-'))
  if (!yeniSurum) {
    yardim()
    process.exitCode = 1
    return
  }

  const gradle = readFileSync(GRADLE, 'utf8')
  let sonuc
  try {
    sonuc = gradleGuncelle(gradle, yeniSurum)
  } catch (e) {
    console.error(`Hata: ${e.message}`)
    process.exitCode = 1
    return
  }

  console.log(`Sürüm: ${sonuc.eskiSurum} → ${yeniSurum}`)
  console.log(`versionCode: ${sonuc.versionCode - 1} → ${sonuc.versionCode}`)

  if (kuru) {
    console.log('(kuru çalıştırma: dosyalar değiştirilmedi)')
  } else {
    writeFileSync(GRADLE, sonuc.metin)
    writeFileSync(PAKET, jsonSurumYaz(readFileSync(PAKET, 'utf8'), yeniSurum))
    if (existsSync(KILIT)) writeFileSync(KILIT, jsonSurumYaz(readFileSync(KILIT, 'utf8'), yeniSurum, true))
    console.log('Güncellendi: android/app/build.gradle, package.json, package-lock.json')
  }

  // Sürüm notu: yoksa/boşsa ya da gradle sürümünden önce yazılmışsa hatırlat.
  if (!existsSync(NOT) || readFileSync(NOT, 'utf8').trim() === '') {
    console.log('\nUYARI: android/surum-notlari/whatsnew-tr-TR yok ya da boş. Yaz (en çok 500 karakter).')
  } else {
    const degisim = statSync(NOT).mtimeMs
    const gunOnce = (Date.now() - degisim) / 86_400_000
    console.log(
      `\nSürüm notu en son ${gunOnce < 1 ? 'bugün' : Math.floor(gunOnce) + ' gün önce'} değişmiş; ` +
        `bu sürüme ait mi? android/surum-notlari/whatsnew-tr-TR`,
    )
  }

  console.log(`
Sonraki adımlar (komutları sen çalıştır):
  git add -A
  git commit -m "Sürüm ${yeniSurum}"
  git tag v${yeniSurum}
  git push --follow-tags`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  ana(process.argv.slice(2))
}
