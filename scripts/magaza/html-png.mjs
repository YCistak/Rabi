/**
 * Rabi — HTML şablonlarını tam boyutlu PNG görsellerine dönüştürme betiği.
 *
 * Kullanım:
 *   1. Tek dosya kipi:
 *      node scripts/magaza/html-png.mjs <girdi.html> <cikti.png> <genislik> <yukseklik>
 *      Örnek:
 *      node scripts/magaza/html-png.mjs tasarim/magaza/dikey/1.html magaza-cikti/dikey/1.png 1080 1920
 *
 *   2. Klasör kipi:
 *      node scripts/magaza/html-png.mjs --klasor <girdiKlasor> <ciktiKlasor> <genislik> <yukseklik>
 *      Örnek:
 *      node scripts/magaza/html-png.mjs --klasor tasarim/magaza/dikey magaza-cikti/dikey 1080 1920
 *
 * HTML'i `file://` ile açar, viewport = verilen boyut, deviceScaleFactor: 1,
 * yazı tipleri yüklenene kadar bekler (`document.fonts.ready`), tam o boyutta PNG kaydeder.
 */

import { pathToFileURL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const PUPPETEER_YOLU =
  'C:/Users/ynser/AppData/Roaming/npm/node_modules/hyperframes/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'
const CHROME_YOLU = 'C:/Program Files/Google/Chrome/Application/chrome.exe'

const bekle = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Tek bir HTML dosyasını açıp ekran görüntüsünü PNG olarak kaydeder. */
async function htmlDonustur(sayfa, girdiYolu, ciktiYolu, genislik, yukseklik) {
  const mutlakGirdi = path.resolve(girdiYolu)
  const mutlakCikti = path.resolve(ciktiYolu)

  if (!fs.existsSync(mutlakGirdi)) {
    throw new Error(`Girdi dosyası bulunamadı: ${mutlakGirdi}`)
  }

  // Çıktı klasörünü oluştur
  fs.mkdirSync(path.dirname(mutlakCikti), { recursive: true })

  // Boyutu ayarla (deviceScaleFactor: 1)
  await sayfa.setViewport({
    width: genislik,
    height: yukseklik,
    deviceScaleFactor: 1,
  })

  const dosyaUrl = pathToFileURL(mutlakGirdi).href + (genislik === 1290 ? '?boyut=appstore' : '')
  await sayfa.goto(dosyaUrl, { waitUntil: 'networkidle0', timeout: 30000 })

  // Yazı tipleri yüklenene kadar bekle
  await sayfa.evaluate(() => document.fonts.ready)
  await bekle(200)

  // Tam verilen boyutta ekran görüntüsü al
  await sayfa.screenshot({
    path: mutlakCikti,
    type: 'png',
    clip: {
      x: 0,
      y: 0,
      width: genislik,
      height: yukseklik,
    },
  })

  console.log(`✓ [Dönüştürüldü] ${path.basename(mutlakGirdi)} -> ${mutlakCikti} (${genislik}×${yukseklik})`)
}

async function anaIslem() {
  const argumanlar = process.argv.slice(2)

  if (argumanlar.length === 0 || argumanlar.includes('--yardim') || argumanlar.includes('-h')) {
    console.log(`
Kullanım:
  Tek dosya:
    node scripts/magaza/html-png.mjs <girdi.html> <cikti.png> <genislik> <yukseklik>

  Klasör kipi:
    node scripts/magaza/html-png.mjs --klasor <girdiKlasor> <ciktiKlasor> <genislik> <yukseklik>
    `)
    return
  }

  console.log('Puppeteer yükleniyor...')
  const puppeteerModulu = await import(pathToFileURL(PUPPETEER_YOLU).href)
  const puppeteer = puppeteerModulu.default || puppeteerModulu

  console.log(`Chrome başlatılıyor... (${CHROME_YOLU})`)
  const tarayici = await puppeteer.launch({
    executablePath: CHROME_YOLU,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const sayfa = await tarayici.newPage()

  try {
    if (argumanlar[0] === '--klasor') {
      const girdiKlasor = argumanlar[1]
      const ciktiKlasor = argumanlar[2]
      const genislik = parseInt(argumanlar[3], 10)
      const yukseklik = parseInt(argumanlar[4], 10)

      if (!girdiKlasor || !ciktiKlasor || isNaN(genislik) || isNaN(yukseklik)) {
        throw new Error('Eksik veya geçersiz argüman! Örnek: node scripts/magaza/html-png.mjs --klasor tasarim/magaza/dikey magaza-cikti/dikey 1080 1920')
      }

      const mutlakGirdiKlasor = path.resolve(girdiKlasor)
      if (!fs.existsSync(mutlakGirdiKlasor)) {
        throw new Error(`Girdi klasörü bulunamadı: ${mutlakGirdiKlasor}`)
      }

      const dosyalar = fs
        .readdirSync(mutlakGirdiKlasor)
        .filter((d) => d.toLowerCase().endsWith('.html'))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

      if (dosyalar.length === 0) {
        console.warn(`Uyarı: "${mutlakGirdiKlasor}" içinde dönüştürülecek .html dosyası bulunamadı.`)
      } else {
        console.log(`Toplam ${dosyalar.length} HTML dosyası dönüştürülecek:`)
        for (const dosya of dosyalar) {
          const dosyaAdi = path.basename(dosya, path.extname(dosya))
          const girdi = path.join(mutlakGirdiKlasor, dosya)
          const cikti = path.join(path.resolve(ciktiKlasor), `${dosyaAdi}.png`)
          await htmlDonustur(sayfa, girdi, cikti, genislik, yukseklik)
        }
      }
    } else {
      const girdiHtml = argumanlar[0]
      const ciktiPng = argumanlar[1]
      const genislik = parseInt(argumanlar[2], 10)
      const yukseklik = parseInt(argumanlar[3], 10)

      if (!girdiHtml || !ciktiPng || isNaN(genislik) || isNaN(yukseklik)) {
        throw new Error('Eksik veya geçersiz argüman! Örnek: node scripts/magaza/html-png.mjs girdi.html cikti.png 1080 1920')
      }

      await htmlDonustur(sayfa, girdiHtml, ciktiPng, genislik, yukseklik)
    }
  } finally {
    await tarayici.close()
    console.log('İşlem tamamlandı, tarayıcı kapatıldı.')
  }
}

anaIslem().catch((hata) => {
  console.error('Hata:', hata.message)
  process.exit(1)
})
