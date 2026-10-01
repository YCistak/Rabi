/**
 * `cap sync ios`un Windows'ta yazdığı Package.swift'i düzeltir.
 *
 *   node scripts/ios-yol-duzelt.mjs   (npm run sync:ios zaten çağırıyor)
 *
 * Capacitor eklenti yollarını işletim sisteminin ayracıyla yazıyor ve
 * Windows'ta çıkan `..\..\..\node_modules\@capacitor\app` macOS'ta bir yol
 * değil, tek bir dosya adı: Xcode paketleri bulamıyor ve derleme hiç
 * başlamıyor. Depo Windows'ta geliştiriliyor, derleme Mac'te (CI) yapılıyor,
 * yani dosya depoya hep bu hâliyle giriyordu.
 *
 * CI zaten Mac'te `cap sync ios` çalıştırıp dosyayı yeniden yazıyor; bu betik
 * depodaki kopyanın da açılabilir kalması için. Mac'te çalıştırılırsa
 * değiştirecek bir şey bulmuyor.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const kok = join(dirname(fileURLToPath(import.meta.url)), '..')
const dosya = join(kok, 'ios/App/CapApp-SPM/Package.swift')

const eski = await readFile(dosya, 'utf8')
// Yalnızca `path: "…"` içindekiler: dosyanın geri kalanında ters eğik çizgi
// yok ama Swift dizgesindeki bir kaçış karakterine dokunmak derlemeyi bozardı.
const yeni = eski.replace(/path: "([^"]*)"/g, (_, yol) => `path: "${yol.replaceAll('\\', '/')}"`)

if (yeni !== eski) {
  await writeFile(dosya, yeni)
  console.log('Package.swift: yollar düzeltildi')
}
