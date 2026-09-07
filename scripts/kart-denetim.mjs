/**
 * Bilgi kartlarını Maarif iskeletine karşı denetler.
 *
 * Testler kartın **başlığını** denetliyor (`maarif.test.ts`: tema ve konu adı,
 * sıra) ve **biçimini** (`icerik.test.ts`: uzunluk, sayı, kimlik). Başlığın
 * altındaki metin ikisinde de denetimsiz: kart konudan sapmış, sınıfın
 * müfredatında olmayan bir kavramı anlatıyor ya da içindeki sayı yanlış
 * olabilir ve hiçbiri kırmızı yanmaz.
 *
 * Bu betik onu ölçüyor ama **test değil rapor**. Gerekçe ölçümün kendisinde:
 * kavram eşleşmesi kelime düzeyinde yapılıyor ve Türkçe buna elverişli değil
 * — Matematik 10'un anahtar kavramları arasında "bölme", "doğru", "çarpan"
 * gibi gündelik kelimeler var ve bunları arayan bir denetim 9. sınıf
 * kartlarının yarısını işaretliyor. Kırmızı yanan gürültülü bir test bir
 * hafta içinde atlanır; sıralı bir liste iş listesi olur.
 *
 * Üç bölüm üretiyor:
 *
 * 1. **Sınıf dışı kavram** — 9. sınıf kartında yalnızca 10. sınıfta geçen bir
 *    kavram. AGENTS.md'deki "Kimya 9'da mol yok" tuzağının ölçülebilir hâli.
 *    Ters yön aranmıyor: üst sınıf alt sınıfın kavramını kullanabilir, konu
 *    tekrarı hata değil.
 * 2. **Kapsam boşluğu** — temanın anahtar kavramlarının kaçına o temanın
 *    kartları hiç dokunmuyor. Düşük oran "konu eksik" demek olmayabilir ama
 *    bakılacak yer sıralaması veriyor.
 * 3. **Olgusal risk listesi** — içinde sayı, birim ya da formül geçen
 *    kartlar. Otomatik doğrulanamayan tek şey olgunun kendisi; ama sessiz
 *    yanlış her kartta eşit dağılmıyor. "Kimya neyi inceler?" yanlışsa göze
 *    batar, "molar hacim 22,4 L" batmaz. Elle okunacak liste bu.
 *
 * Kullanım: `node scripts/kart-denetim.mjs [--tam]`
 * `--tam` üçüncü bölümü kısaltmadan yazar.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BURASI = dirname(fileURLToPath(import.meta.url))
const KOK = join(BURASI, '..')
const ICERIK = join(KOK, 'lib', 'konu', 'icerik')

const iskelet = JSON.parse(
  readFileSync(join(KOK, 'lib', 'konu', 'maarif', 'iskelet.json'), 'utf8'),
)

const tam = process.argv.includes('--tam')

/** Karşılaştırma öncesi sadeleştirme — `maarif.test.ts`teki kuralın aynısı. */
const sadelestir = (metin) =>
  metin
    .normalize('NFC')
    .toLocaleLowerCase('tr')
    .replace(/[’'"]/g, '')
    .replace(/[^a-zçğıöşü0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * İçerik dosyaları TypeScript ve bu betik onları çalıştırmıyor, **okuyor**.
 *
 * Betiği `tsx` gibi bir çalıştırıcıya bağlamak, denetim aracını derleme
 * zincirine bağımlı kılardı. Dosyaların biçimi tek elden (`kart(` çağrısı,
 * tek tırnak) ve ayrıştırma sayısı `icerik.test.ts`in saydığıyla tutuyor;
 * tutmazsa aşağıdaki toplam da tutmaz ve fark edilir.
 */
function dosyayiAyristir(yol) {
  const kaynak = readFileSync(yol, 'utf8')
  const dugumler = []
  for (const m of kaynak.matchAll(/\b(tema|konu)\(\s*'([^']*)',\s*'([^']*)'/g)) {
    dugumler.push({ tur: m[1], ad: m[3], yer: m.index })
  }
  const kartlar = []
  for (const m of kaynak.matchAll(/\bkart\(\s*'([^']*)',\s*'([^']*)'/g)) {
    kartlar.push({ baslik: m[1], metin: m[2], yer: m.index })
  }

  /*
    Kart, kendinden önceki en yakın `konu(`ye ait; konu da kendinden önceki
    en yakın `tema(`ya. Konum karşılaştırması yeterli çünkü içerik dosyaları
    programın kendi sırasında yazılıyor — ağaç kurmak, tek bir sıralı okuma
    ile aynı sonucu daha çok kodla verirdi.
  */
  const oncekiAd = (yer, tur) => {
    let bulunan = null
    for (const d of dugumler) {
      if (d.yer > yer) break
      if (d.tur === tur) bulunan = d.ad
    }
    return bulunan
  }

  return kartlar.map((k) => ({
    ...k,
    konu: oncekiAd(k.yer, 'konu'),
    tema: oncekiAd(k.yer, 'tema'),
  }))
}

/** Bütün içerik: ders + sınıf + kart. */
const icerik = readdirSync(ICERIK)
  .filter((d) => d.endsWith('.ts'))
  .flatMap((dosya) => {
    const [sinif, ders] = dosya.replace('.ts', '').split('-')
    return dosyayiAyristir(join(ICERIK, dosya)).map((kart) => ({
      ...kart,
      ders,
      sinif,
      dosya,
    }))
  })

const temalarinin = (ders, sinif) => iskelet.dersler[ders]?.[sinif] ?? []

/**
 * Bir kavramın metinde aranacak karşılıkları.
 *
 * Program kavramları eş adlarıyla birlikte yazıyor — "su küre (hidrosfer)",
 * "anlatım teknikleri (geriye dönüş, monolog…)". Bunları tek bir dizgi olarak
 * aramak hiçbir zaman eşleşmiyor: kart "hidrosfer" yazıyor, aranan şey
 * "su küre hidrosfer". Parantez ve virgül ayraç sayılıyor ve **herhangi
 * birinin** geçmesi kavrama dokunmak demek.
 */
const karsiliklari = (kavram) =>
  kavram
    .split(/[(),;]|\bvb\b/)
    .map(sadelestir)
    .filter((p) => p.length > 2)

/** Bir dersin bir sınıfındaki bütün anahtar kavramlar, sadeleştirilmiş. */
const kavramlari = (ders, sinif) =>
  new Set(
    temalarinin(ders, sinif).flatMap((t) =>
      (t.anahtarKavramlar ?? []).map(sadelestir),
    ),
  )

const baslik = (metin) => console.log(`\n${metin}\n${'─'.repeat(metin.length)}`)

// ── 1. Sınıf dışı kavram ────────────────────────────────────────────────────
baslik('1. Sınıf dışı kavram adayları')

/*
  Filtre iki kat ve ikisi de gürültü yüzünden var: kavram **çok kelimeli**
  olacak (tek kelimeler gündelik Türkçeye karışıyor — "bölme", "dönem",
  "hareket") ve 9. sınıfın kendi metninde (kavramlar, konu adları, öğrenme
  çıktıları) hiç geçmeyecek. Filtresiz hâli 1.123 kartta onlarca kelime
  döndürüyordu ve hepsi yanlış alarmdı.
*/
const EN_AZ_UZUNLUK = 10
let adayVar = false
for (const ders of Object.keys(iskelet.dersler)) {
  const govde9 = sadelestir(JSON.stringify(temalarinin(ders, '9')))
  const yalniz10 = [...kavramlari(ders, '10')].filter(
    (k) => k.includes(' ') && k.length > EN_AZ_UZUNLUK && !govde9.includes(k),
  )
  const kartlar9 = icerik.filter((k) => k.ders === ders && k.sinif === '9')
  for (const kart of kartlar9) {
    const metin = sadelestir(`${kart.baslik} ${kart.metin}`)
    const gecen = yalniz10.filter((k) => metin.includes(k))
    if (!gecen.length) continue
    adayVar = true
    console.log(`  9-${ders} · ${kart.konu} · "${kart.baslik}"`)
    console.log(`    → ${gecen.join(', ')}`)
  }
}
if (!adayVar) console.log('  (yok)')

// ── 2. Kapsam boşluğu ───────────────────────────────────────────────────────
baslik('2. Kapsam — temanın anahtar kavramlarına dokunma oranı')

const kapsamlar = []
for (const ders of Object.keys(iskelet.dersler)) {
  for (const sinif of ['9', '10']) {
    for (const tema of temalarinin(ders, sinif)) {
      const kavramlar = tema.anahtarKavramlar ?? []
      if (!kavramlar.length) continue
      /*
        Konu adı da gövdeye giriyor: "Afet Bilinci" bir konu başlığı ve o
        kavrama dokunuluyor demek — kartın metninde ikinci kez tekrar
        edilmesini beklemek, kavramı görmüş öğrenciyi görmemiş saymaktı.
      */
      const govde = sadelestir(
        icerik
          .filter((k) => k.ders === ders && k.sinif === sinif)
          .map((k) => `${k.konu} ${k.baslik} ${k.metin}`)
          .join(' '),
      )
      const gecti = (k) => karsiliklari(k).some((p) => govde.includes(p))
      const deger = kavramlar.filter(gecti)
      kapsamlar.push({
        ad: `${sinif}-${ders} · ${tema.ad}`,
        oran: deger.length / kavramlar.length,
        deger: deger.length,
        toplam: kavramlar.length,
        eksik: kavramlar.filter((k) => !gecti(k)),
      })
    }
  }
}
kapsamlar.sort((a, b) => a.oran - b.oran)
for (const k of kapsamlar.slice(0, tam ? kapsamlar.length : 10)) {
  console.log(
    `  %${String(Math.round(k.oran * 100)).padStart(3)} (${k.deger}/${k.toplam})  ${k.ad}`,
  )
  if (tam) console.log(`    eksik: ${k.eksik.join(', ')}`)
}
const ortalama =
  kapsamlar.reduce((t, k) => t + k.oran, 0) / (kapsamlar.length || 1)
console.log(`\n  ortalama kapsam: %${Math.round(ortalama * 100)} (${kapsamlar.length} tema)`)

// ── 3. Olgusal risk listesi ─────────────────────────────────────────────────
baslik('3. Sayı / birim / formül içeren kartlar — elle okunacak')

/* Alt indisler de sayı: "H₂SO₄" yanlış yazılabilir ve göze batmaz. */
const RISKLI = /[0-9]|%|°|₀|₁|₂|₃|₄|₅|₆|₇|₈|₉/
const riskliler = icerik.filter((k) => RISKLI.test(k.metin))
for (const k of tam ? riskliler : riskliler.slice(0, 15)) {
  console.log(`  ${k.sinif}-${k.ders} · ${k.konu} · "${k.baslik}"`)
  if (tam) console.log(`    ${k.metin}`)
}
if (!tam && riskliler.length > 15) {
  console.log(`  … ${riskliler.length - 15} kart daha (--tam ile tümü ve metinleri)`)
}

console.log(
  `\nToplam ${icerik.length} kart · ${riskliler.length} tanesi sayı içeriyor (%${Math.round(
    (riskliler.length / icerik.length) * 100,
  )})`,
)
