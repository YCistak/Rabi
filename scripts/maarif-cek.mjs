/**
 * Maarif programının iskeletini tymm.meb.gov.tr'den çeker.
 *
 * Çıktı `lib/konu/maarif/iskelet.json`: ders → sınıf → tema → bölüm sırası.
 * Bunu **elle düzenleme**; müfredat değişince betiği yeniden çalıştır.
 *
 * Neden çekiliyor: bilgi kartlarının konu adları ve sırası bir süre hafızadan
 * yazıldı ve programla tutmadı (eski müfredatın ünite adları, karışmış sıra).
 * İskelet testin ölçüsü oluyor (`icerik.test.ts`); ölçü yazılırsa bayatlıyor,
 * çekilirse bayatlamıyor — açılış ekranındaki varış noktasıyla aynı gerekçe.
 *
 * Alınan şey **başlık ve sıra**; programın düzyazısı alınmıyor. Kart metinleri
 * bu dosyadan üretilmiyor, elle yazılıyor.
 */
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KOK = 'https://tymm.meb.gov.tr'
const BURASI = dirname(fileURLToPath(import.meta.url))
const CIKTI = join(BURASI, '..', 'lib', 'konu', 'maarif', 'iskelet.json')

/** Uygulamadaki ders kimliği → tymm'deki ders adresi. */
const DERSLER = {
  matematik: 'matematik-dersi',
  turkce: 'turk-dili-ve-edebiyati-dersi',
  fizik: 'fizik-dersi',
  kimya: 'kimya-dersi',
  biyoloji: 'biyoloji-dersi',
  tarih: 'tarih-dersi',
  cografya: 'cografya-dersi',
}

const SINIFLAR = [9, 10, 11]

/**
 * Virgülün ayraç mı başlığın parçası mı olduğu bir yerde ayırt edilemiyor.
 *
 * Kimya 9'un son bölümü şöyle yazılı: "Metal Nanoparçacıklar, Metal, Alaşım
 * ve Metal Nanoparçacıkların Çevresel Etkileri". Buradaki ikinci virgül
 * ayraç değil — "Metal, Alaşım ve Metal Nanoparçacıkların Çevresel
 * Etkileri" tek bir konu. Ayraç sayıldığında ortaya "Metal" adında bir konu
 * çıkıyor ve programda öyle bir konu yok.
 *
 * Tablo bölüm adıyla anahtarlanıyor ve yalnızca ayrıştırıcının çözemediği
 * satırları düzeltiyor; yeni bir düzeltme eklerken önce programın kendi
 * sayfasına bak.
 */
const DUZELTMELER = {
  'Nanoparçacıklar ve Ekolojik Sürdürülebilirlik': [
    'Metal Nanoparçacıklar',
    'Metal, Alaşım ve Metal Nanoparçacıkların Çevresel Etkileri',
    'Yeşil Kimyanın Atık Önleme İlkesi',
  ],
}

const al = async (yol) => {
  const cevap = await fetch(`${KOK}${yol}`)
  if (!cevap.ok) throw new Error(`${yol} → HTTP ${cevap.status}`)
  return cevap.text()
}

/**
 * Etiketleri atar ama **etiketler arasındaki boşluğu korur**.
 *
 * Program metni PDF'ten geldiği için kelimeler satır sonlarında bölünmüş ve
 * her parça ayrı bir `<span>`: bitişik iki span tek kelimedir
 * (`Kim`+`yanın` → "Kimyanın"), aralarında boşluk olan iki span ayrı
 * kelimedir. Etiketi boşlukla değiştiren kaba bir temizlik "Kim yanın"
 * üretiyor ve konu adı bozuk çıkıyor.
 */
function metneCevir(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[•·]\s*/, '')
}

/** Sağdaki hücreyi başlığından bul: `<div ...title">Başlık</div><div ...content">…</div>` */
function bolumHtml(html, baslik) {
  const desen = new RegExp(
    `title"[^>]*>\\s*${baslik}\\s*</div>\\s*<div[^>]*content"[^>]*>([\\s\\S]*?)</div>`,
  )
  return (html.match(desen) || [])[1] ?? null
}

/**
 * Virgülle ayır ama **parantez içindekine dokunma**.
 *
 * "Atom Teorileri (Bohr Atom Teorisi, Modern Atom Teorisi) ve Atomun Yapısı"
 * tek bir alt konu; düz `split(',')` onu ikiye bölüp "Modern Atom Teorisi) ve
 * Atomun Yapısı" gibi yarım bir başlık üretiyordu.
 */
function virgulleBol(metin) {
  const parcalar = []
  let derinlik = 0
  let su = ''
  for (const harf of metin) {
    if (harf === '(' || harf === '[') derinlik++
    else if (harf === ')' || harf === ']') derinlik = Math.max(0, derinlik - 1)
    if (harf === ',' && derinlik === 0) {
      parcalar.push(su)
      su = ''
    } else su += harf
  }
  parcalar.push(su)
  return parcalar.map((x) => x.trim().replace(/\.$/, '')).filter((x) => x.length > 1)
}

/**
 * Başlığı, parantez içindeki ayrıntıdan ayırır.
 *
 * Program bir konunun kapsamını başlığın içine sıkıştırıyor: "Canlıların
 * Ortak Özellikleri (Hücresel Yapı, Organizasyon, Beslenme, …)" tek satır.
 * Haritada okunacak olan başlık, kartlarda anlatılacak olan ayrıntı — ikisi
 * ayrı yerlere gidiyor, çünkü 200 karakterlik bir konu adı düğüme sığmıyor.
 */
function baslikVeAyrinti(satir) {
  const ayrintilar = []
  let derinlik = 0
  let ad = ''
  let su = ''
  for (const harf of satir) {
    if (harf === '(' || harf === '[') {
      derinlik++
      if (derinlik === 1) continue
    } else if (harf === ')' || harf === ']') {
      derinlik = Math.max(0, derinlik - 1)
      if (derinlik === 0) {
        ayrintilar.push(su.trim())
        su = ''
        continue
      }
    }
    if (derinlik === 0) ad += harf
    else su += harf
  }
  return {
    ad: ad.replace(/\s+/g, ' ').trim().replace(/[,;]$/, ''),
    ayrinti: ayrintilar.filter(Boolean).join('; ') || null,
  }
}

/**
 * İçerik Çerçevesi → temanın bölümleri.
 *
 * Her `<p>` bir bölüm: kalın yazılan kısım bölümün adı, sonrası virgülle
 * ayrılmış alt konular. Kalın kısım yoksa bölüm adsızdır ve tema tek
 * parçadır — o zaman alt konular doğrudan temanın altına düşüyor.
 */
function bolumleriAyikla(html) {
  if (!html) return []

  /*
    Liste maddesinin **içindeki** `<br>` madde ayracı değil, satır kaydırma:
    Matematik'in içerik açıklamaları uzun cümleler ve ortalarında bir `<br>`
    taşıyor. Ayraç sayılınca cümle ikiye bölünüyor, ilk yarısı noktayla
    bitmediği için düzyazı süzgecinden kaçıyor ve "ilgili dağılımın merkezinin"
    diye bir konu türüyordu.
  */
  const duzeltilmis = html.replace(/<li>[\s\S]*?<\/li>/gi, (madde) =>
    madde.replace(/<br\s*\/?>/gi, ' '),
  )

  // Blok sınırları: satırı bitiren her etiket. Bunlar ayrılmazsa "Tarihin
  // Doğası" ile bir sonraki başlık tek kelimeye yapışıyor.
  const bloklar = duzeltilmis
    .split(/<br\s*\/?>|<\/p>|<\/li>|<\/tr>/i)
    .map((b) => b.trim())
    .filter(Boolean)

  const cikti = []
  /* Başlığı ile listesi ayrı bloklara düşen ders var (Biyoloji); başlık
     beklemeye alınıyor, listesi bir sonraki blokta geliyor. */
  let bekleyen = null
  const bitir = () => {
    if (bekleyen) cikti.push({ ad: null, altKonular: [baslikVeAyrinti(bekleyen)] })
    bekleyen = null
  }

  for (const blok of bloklar) {
    const kalinHtml = (blok.match(/<strong>([\s\S]*?)<\/strong>/i) || [])[1]
    const kalin = kalinHtml ? metneCevir(kalinHtml).replace(/:\s*$/, '') : null
    const tumu = metneCevir(blok)
    if (!tumu) continue

    /*
      Nokta ya da iki nokta ile biten blok konu değil, düzyazı: Matematik
      içerik açıklamasını cümleyle yazıyor ("Benzer üçgenlerin alanları
      orantılıdır."), Türk Dili ve Edebiyatı ise temanın tamamını paragrafla
      anlatıyor. Konu başlığı noktayla bitmiyor.
    */
    if (/[.:]$/.test(tumu)) continue

    if (kalin) {
      bitir()
      const kuyruk = tumu.slice(metneCevir(kalinHtml).length).replace(/^\s*:?\s*/, '')
      if (kuyruk)
        cikti.push({ ad: kalin, altKonular: virgulleBol(kuyruk).map(baslikVeAyrinti) })
      else bekleyen = kalin
      continue
    }

    if (bekleyen) {
      cikti.push({ ad: bekleyen, altKonular: virgulleBol(tumu).map(baslikVeAyrinti) })
      bekleyen = null
      continue
    }

    // Virgül burada ayraç değil, başlığın parçası: "Nüfusla İlgili Fırsat,
    // Sorun ve Politikalar" tek bir konu.
    cikti.push({ ad: null, altKonular: [baslikVeAyrinti(tumu)] })
  }
  bitir()

  for (const bolum of cikti) {
    const duzeltme = DUZELTMELER[bolum.ad]
    if (duzeltme) bolum.altKonular = duzeltme.map(baslikVeAyrinti)
  }

  return cikti.filter((b) => b.ad || b.altKonular.length)
}

/**
 * Öğrenme çıktıları — kodlu satırlar (`KİM.9.1.3.`).
 *
 * Süreç bileşenleri (a, b, c…) alınmıyor: onlar öğretmenin adımları, kartın
 * konusu değil.
 */
function ciktilariAyikla(html) {
  if (!html) return []
  const metin = metneCevir(html)

  /*
    Koddan **önce** boşluk aranıyor. Kod harflerini serbest bırakan bir desen
    "KİM.9.1.1" içinde "İM.9.1.1"i de eşleşme sayıyor (iki harf de büyük) ve
    çıktılar tek harf eksik kodla kaydediliyordu.
  */
  const desen = /(?:^|\s)([A-ZÇĞİÖŞÜ]{2,4}\.\d+\.\d+\.\d+)\.\s*/g
  const yerler = [...metin.matchAll(desen)]

  return yerler.map((eslesme, sira) => {
    const basi = eslesme.index + eslesme[0].length
    const sonu = sira + 1 < yerler.length ? yerler[sira + 1].index : metin.length
    // Süreç bileşenleri "a)" ile başlıyor; çıktının kendisi orada bitiyor.
    const govde = metin.slice(basi, sonu).split(/\s[a-zçğıöşü]\)\s/)[0]
    return { kod: eslesme[1], metin: govde.trim() }
  })
}

async function temaCek(dersYolu, temaId) {
  const html = await al(`/${dersYolu}/unite/${temaId}`)
  const baslik = metneCevir((html.match(/<title>([^<]*)<\/title>/) || [])[1] ?? '')
  /*
    "Kimya Dersi 9.Sınıf 1. Tema: Etkileşim Teması - Türkiye Yüzyılı…"

    Bazı dersler aynı yerde "Ünite" yazıyor (Fizik, Tarih, Coğrafya) — program
    tema diyor, sayfa başlığı eski adı taşıyor. İkisi de kabul ediliyor, yoksa
    o derslerin temaları adsız ve sırasız kalıyor.
  */
  const eslesme = baslik.match(/(\d+)\s*\.\s*(?:Tema|Ünite)\s*:?\s*(.+?)\s*Teması/i)

  return {
    id: temaId,
    sira: eslesme ? Number(eslesme[1]) : null,
    ad: eslesme ? eslesme[2].trim() : baslik.split(' - ')[0].trim(),
    dersSaati: Number(metneCevir(bolumHtml(html, 'Ders Saati') ?? '')) || null,
    bolumler: bolumleriAyikla(bolumHtml(html, 'İçerik Çerçevesi')),
    anahtarKavramlar: metneCevir(bolumHtml(html, 'Anahtar Kavramlar') ?? '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean),
    ogrenmeCiktilari: ciktilariAyikla(
      bolumHtml(html, 'Öğrenme Çıktıları ve Süreç Bileşenleri'),
    ),
  }
}

/**
 * Sınıf sayfasının adresindeki sayı ders başına kayıyor: Kimya'da 11 dokuzuncu
 * sınıf, Türk Dili ve Edebiyatı'nda 11 dokuzuncu ama 10 hazırlık. Sayı
 * türetilmiyor, sayfanın başlığından **okunuyor**.
 */
async function dersCek(dersYolu) {
  const html = await al(`/ogretim-programlari/ders/${dersYolu}`)
  const idler = [
    ...new Set(
      [...html.matchAll(new RegExp(`/ogretim-programlari/${dersYolu}/(\\d+)`, 'g'))].map(
        (m) => m[1],
      ),
    ),
  ]

  const siniflar = {}
  for (const id of idler) {
    const sayfa = await al(`/ogretim-programlari/${dersYolu}/${id}`)
    const baslik = (sayfa.match(/<title>([^<]*)<\/title>/) || [])[1] ?? ''
    const sinif = Number((baslik.match(/(\d+)\s*\.\s*S/) || [])[1])
    if (!SINIFLAR.includes(sinif)) continue

    const temaIdleri = [
      ...new Set([...sayfa.matchAll(/\/unite\/(\d+)/g)].map((m) => m[1])),
    ]
    const temalar = []
    for (const temaId of temaIdleri) temalar.push(await temaCek(dersYolu, temaId))
    temalar.sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0))
    siniflar[sinif] = temalar
  }
  return siniflar
}

const iskelet = { kaynak: KOK, cekilme: new Date().toISOString().slice(0, 10), dersler: {} }

for (const [ders, yol] of Object.entries(DERSLER)) {
  process.stdout.write(`${ders}… `)
  iskelet.dersler[ders] = await dersCek(yol)
  const sayi = Object.entries(iskelet.dersler[ders])
    .map(([s, t]) => `${s}:${t.length} tema`)
    .join(', ')
  console.log(sayi)
}

await mkdir(dirname(CIKTI), { recursive: true })
await writeFile(CIKTI, JSON.stringify(iskelet, null, 2) + '\n', 'utf8')
console.log(`\n→ ${CIKTI}`)
