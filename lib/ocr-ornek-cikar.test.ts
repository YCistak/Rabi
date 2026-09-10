/**
 * Gerçek kâğıtlardan etiketli karakter örneği çıkarır — yerel araç, depoya
 * girmiyor ve fotoğraflar da depoda değil.
 *
 * Amaç eğitim verisini kâğıda yaklaştırmak: EMNIST düz taranmış Amerikan el
 * yazısı, bizim girdimiz telefonla çekilip eşiklenmiş bir kâğıt.
 *
 * ## Hizalama iki katmanlı ve ikisi de arama
 *
 * Elimizde her kâğıdın **satır satır doğru cevabı** var ama hangi lekenin
 * hangi karaktere denk geldiği yok. Ders adının harfleri de geometri
 * süzgeçlerini geçtiği için kutu sayısı hiçbir zaman karakter sayısına eşit
 * çıkmıyor; bir dönem "cevaplar sağdadır, en sağdaki N kutuyu al" denendi ve
 * kâğıtların dörtte birinde kaydı (ölçüldü: o kâğıtlarda etiketlerin ancak
 * beşte biri tanıyıcıyla tutuyordu, yani neredeyse hepsi yanlıştı).
 *
 * Şimdi iki seviyede de **sırayı koruyan en iyi eşleşme** aranıyor:
 *
 * - **Kutu ↔ karakter**: satırdaki kutulardan hangilerinin cevap olduğu,
 *   tanıyıcının o kutuya o karakter için verdiği olasılıkların toplamını en
 *   büyükleyen alt dizi seçilerek bulunuyor. Etiket yine **doğru cevaptan**
 *   geliyor; tanıyıcı yalnızca hangi kutunun hangi karakter olduğunu
 *   söylüyor. Seçilen kutular arasında atlanan her kutu ceza alıyor: cevap
 *   bir blok hâlinde yazılıyor, harflerin arasına serpilmiş değil.
 * - **Satır ↔ etiket**: aynı arama satır düzeyinde. Fazladan bulunan satır
 *   (ders adından kopan parça) atlanabiliyor, okunamamış satır da öyle;
 *   ikisinin de bedeli var, yoksa arama her şeyi atlayıp boş bir eşleşmeyi
 *   "en iyi" bulurdu.
 *
 * Sonuçta güveni düşük kalan satır alınmıyor: yanlış etiketli veri ağı
 * bozuyor ve bu ölçüldü — gevşek hizalamayla örnek sayısını 155'ten 272'ye
 * çıkarmak kâğıt başarısını %75,3'ten %57,8'e düşürmüştü.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { describe, it } from 'vitest'
import { grilestir, uyarlamaliEsik } from './goruntu-esikle'
import { ceyrekDondur, kagidaKirp } from './kagit-kirp'
import { karakterleriCikar, kareyeOturt, KARE, type Kutu } from './karakter-ayir'
import { genisleriBol, satirlariOku } from './kagit-oku'
import { agirliklariCoz, SINIFLAR, tani, type Agirliklar } from './karakter-tani'
import { AGIRLIKLAR } from './karakter-agirliklari'

/**
 * Kâğıtların hazırlanmış hâli (`<ad>.rgba` + `etiketler.json`) depoda değil,
 * yerelde duruyor. Yolu `KAGITLAR` ile veriliyor; yoksa test kendini atlıyor.
 */
const D = process.env.KAGITLAR ?? ''

/** `satiriOku` ile aynı geometri süzgeçleri. */
const EN_AZ_BOY = 0.55
const EN_GENIS = 1.6

/**
 * Bir satırın alınması için sınır boşluğunun iç boşluğu bu kadar aşması
 * gerekiyor (kutu genişliğine oranla). Sıfır "sınır iç boşluktan geniş"
 * demek; biraz üstü, kılpayı geçen belirsiz pencereleri eliyor.
 */
const EN_AZ_GUVEN = Number(process.env.GUVEN ?? 0.15)

/**
 * Okunamamış bir etiket satırını atlamanın bedeli.
 *
 * Satır puanı artık kutu genişliğine oranlanmış bir marj (tipik olarak 0-2
 * arası); ceza da o ölçekte. Büyük olsaydı arama, hiç oturmayan bir pencereyi
 * atlamak yerine zorla eşlerdi.
 */
const SATIR_CEZASI = 0.3

const ETIKET_DOSYASI = D ? `${D}/etiketler.json` : ''
const ETIKETLER: Record<string, { en: number; boy: number; dogru: string[] }> =
  ETIKET_DOSYASI && existsSync(ETIKET_DOSYASI)
    ? JSON.parse(readFileSync(ETIKET_DOSYASI, 'utf8'))
    : {}

function ortanca(sayilar: number[]): number {
  const s = [...sayilar].sort((a, b) => a - b)
  return s[s.length >> 1]
}

type Aday = { kutu: Kutu; olasilik: Float32Array }

/** Satırdaki kutuları tanıyıp geometri süzgecinden geçirir. */
function adaylar(gri: Parameters<typeof kareyeOturt>[0], kutular: Kutu[], a: Agirliklar): Aday[] {
  const tipik = ortanca(kutular.map((k) => k.boy))
  return kutular
    .filter((k) => k.boy >= tipik * EN_AZ_BOY && k.en <= k.boy * EN_GENIS)
    .map((kutu) => ({ kutu, olasilik: tani(kareyeOturt(gri, kutu), a).olasilik }))
}

type Hizalama = { puan: number; secilen: number[] }

/**
 * Cevap kutularını **yalnızca boşluklara** bakarak bulur; tanıyıcıya sormaz.
 *
 * Önceki sürüm kutuyu seçerken ağın olasılıklarına bakıyordu ve ölçüldü:
 * çıkan kümenin %95,6'sını ağ zaten doğru okuyordu, yani seçim ağın bildiğini
 * seçiyor ve öğretecek bir şey taşımıyordu. Eğitim kâğıt başarısını
 * %75,3'ten %69,5'e düşürdü.
 *
 * Geometri bunu ağdan bağımsız çözüyor. Doğru cevabın **grup deseni**
 * biliniyor: "15D 2Y 13B" üç grup, 3+2+3 kutu. Kâğıtta gruplar arasındaki
 * boşluk grup içindekinden geniş ve ders adı ile cevap arasındaki boşluk
 * ondan da geniş. Aranan şey bu desene oturan pencere:
 *
 * - Pencere satırın sağında, tam N kutu (cevap satırın sonunda yazılıyor).
 * - **Sınır boşlukları**: pencerenin solundaki boşluk ve grup sınırlarındaki
 *   boşluklar. **İç boşluklar**: grup içindeki kutular arası.
 * - Puan = en dar sınır boşluğu − en geniş iç boşluk. Pozitifse desen
 *   oturuyor demektir; negatifse o pencere yanlış ve satır alınmıyor.
 *
 * Böylece ağın yanlış okuduğu karakterler de kümeye giriyor — asıl
 * öğretilmesi gerekenler onlar.
 */
function hizala(adaylar: Aday[], gruplar: string[]): Hizalama | null {
  const N = gruplar.join('').length
  const K = adaylar.length
  if (N === 0 || K < N) return null

  // Grup sınırlarının pencere içindeki yerleri: "15D 2Y" → {3}
  const sinirlar = new Set<number>()
  let toplam = 0
  for (const grup of gruplar.slice(0, -1)) {
    toplam += grup.length
    sinirlar.add(toplam)
  }

  let enIyi: Hizalama | null = null
  for (let s = 0; s + N <= K; s++) {
    const pencere = adaylar.slice(s, s + N)
    let enDarSinir = Infinity
    let enGenisIc = 0

    // Pencerenin solundaki boşluk da bir sınır: ders adı ile cevap arası.
    if (s > 0) {
      const onceki = adaylar[s - 1].kutu
      enDarSinir = pencere[0].kutu.x - (onceki.x + onceki.en)
    }

    for (let i = 1; i < N; i++) {
      const sol = pencere[i - 1].kutu
      const bosluk = pencere[i].kutu.x - (sol.x + sol.en)
      if (sinirlar.has(i)) enDarSinir = Math.min(enDarSinir, bosluk)
      else enGenisIc = Math.max(enGenisIc, bosluk)
    }

    // Hiç sınır yoksa (tek gruplu satır, üstelik satırın başındaysa) desen
    // ayırt etmiyor; böyle bir pencereye güvenilmiyor.
    if (enDarSinir === Infinity) continue

    const puan = enDarSinir - enGenisIc
    if (enIyi === null || puan > enIyi.puan) {
      enIyi = { puan, secilen: Array.from({ length: N }, (_, i) => s + i) }
    }
  }

  return enIyi
}

/**
 * Hizalamanın güveni: sınır boşluğu ile iç boşluk arasındaki marj, kutu
 * genişliğine oranlanmış. Piksel cinsinden bir eşik kâğıdın çözünürlüğüne
 * bağlı kalırdı.
 */
function guven(h: Hizalama, adaylar: Aday[]): number {
  const secilenler = h.secilen.map((n) => adaylar[n].kutu.en)
  const tipikEn = secilenler.reduce((t, e) => t + e, 0) / Math.max(1, secilenler.length)
  return tipikEn <= 0 ? 0 : h.puan / tipikEn
}

describe('gerçek kâğıttan örnek çıkarma', () => {
  it('çıkarır', () => {
    // Normal test koşusunda çalışmıyor: dosya yazan bir araç, testi değil.
    // `CIKAR=1 npx vitest run lib/ocr-ornek-cikar.test.ts` ile çağrılıyor.
    if (process.env.CIKAR !== '1' || !ETIKET_DOSYASI || !existsSync(ETIKET_DOSYASI)) return
    const a = agirliklariCoz(AGIRLIKLAR)
    const ornekler: Float32Array[] = []
    const etiketler: number[] = []
    const kaynak: string[] = []
    let toplamSatir = 0
    let alinanSatir = 0

    for (const [ad, bilgi] of Object.entries(ETIKETLER)) {
      const yol = `${D}/${ad}.rgba`
      if (!existsSync(yol)) continue
      const ham = new Uint8ClampedArray(readFileSync(yol))
      const duz = uyarlamaliEsik(kagidaKirp(grilestir(ham, bilgi.en, bilgi.boy)))
      // Yan duran kâğıtlar okumanın seçtiği yöne çevriliyor; ham yönde
      // satırlar dikey akıyor ve hiçbir hizalama tutmuyor.
      const gri = ceyrekDondur(duz, satirlariOku(duz, a).ceyrek)

      const satirlar = karakterleriCikar(gri).map((satir) =>
        adaylar(gri, satir.karakterler.flatMap((k) => genisleriBol(gri, k.kutu)), a),
      )

      /*
        Eski, dar kip: kâğıdın satır sayısı etiketle birebir tutuyorsa her
        satırın **en sağdaki N kutusu** cevap sayılıyor. Kapsamı düşük (19
        kâğıdın 8'i) ama isabeti yüksek ve ölçüldü: eğitimde geometrik
        hizalamanın kümesini geçiyor (%75,3'e karşı %67,5). Sebebi büyük
        olasılıkla şu — geniş kümeye kötü ayrılmış kutular da giriyor ve ağa
        onlara da bir ad vermeyi öğretmek, olmayan karakter uydurmasına yol
        açıyor.
      */
      if (process.env.HIZALAMA === 'sagdan') {
        const dolular = satirlar.filter((k) => k.length >= 2)
        if (dolular.length !== bilgi.dogru.length) continue
        dolular.forEach((kabul, n) => {
          const beklenen = bilgi.dogru[n].replace(/ /g, '')
          if (kabul.length < beklenen.length) return
          toplamSatir++
          alinanSatir++
          kabul.slice(kabul.length - beklenen.length).forEach((aday, k) => {
            const sinif = SINIFLAR.indexOf(beklenen[k] as (typeof SINIFLAR)[number])
            if (sinif === -1) return
            ornekler.push(kareyeOturt(gri, aday.kutu))
            etiketler.push(sinif)
            kaynak.push(ad)
          })
        })
        continue
      }

      /*
        Satır düzeyinde aynı arama: hangi bulunan satır hangi etiket satırı.
        `g[i][j]` = ilk i bulunan satırla ilk j etiket satırını eşlemenin en
        iyi puanı. Fazladan bulunan satır bedavaya atlanıyor (ders adından
        kopan parçalar), okunamamış etiket satırı ise ceza ödüyor.
      */
      const M = satirlar.length
      const L = bilgi.dogru.length
      const EKSI = -1e9
      const g: number[][] = Array.from({ length: M + 1 }, () => new Array(L + 1).fill(EKSI))
      const secim: (Hizalama | null)[][] = Array.from({ length: M + 1 }, () =>
        new Array(L + 1).fill(null),
      )
      const yon: number[][] = Array.from({ length: M + 1 }, () => new Array(L + 1).fill(0))
      for (let i = 0; i <= M; i++) g[i][0] = 0
      for (let j = 1; j <= L; j++) g[0][j] = -SATIR_CEZASI * j

      for (let i = 1; i <= M; i++) {
        for (let j = 1; j <= L; j++) {
          // Bulunan satırı atla.
          let enIyi = g[i - 1][j]
          let secilenYon = 0
          // Etiket satırını atla (o satır hiç okunamamış).
          const etiketAtla = g[i][j - 1] - SATIR_CEZASI
          if (etiketAtla > enIyi) {
            enIyi = etiketAtla
            secilenYon = 2
          }
          const h = hizala(satirlar[i - 1], bilgi.dogru[j - 1].split(' '))
          if (h !== null && g[i - 1][j - 1] !== EKSI) {
            // Puan kutu genişliğine oranlanmış marj; satır uzunluğundan ve
            // kâğıdın çözünürlüğünden bağımsız olsun diye.
            const eslesme = g[i - 1][j - 1] + guven(h, satirlar[i - 1])
            if (eslesme > enIyi) {
              enIyi = eslesme
              secilenYon = 1
              secim[i][j] = h
            }
          }
          g[i][j] = enIyi
          yon[i][j] = secilenYon
        }
      }

      let i = M
      let j = L
      while (i > 0 && j > 0) {
        if (yon[i][j] === 1) {
          const h = secim[i][j]!
          const beklenen = bilgi.dogru[j - 1].replace(/ /g, '')
          toplamSatir++
          if (guven(h, satirlar[i - 1]) >= EN_AZ_GUVEN) {
            alinanSatir++
            h.secilen.forEach((n, k) => {
              const sinif = SINIFLAR.indexOf(beklenen[k] as (typeof SINIFLAR)[number])
              if (sinif === -1) return
              ornekler.push(kareyeOturt(gri, satirlar[i - 1][n].kutu))
              etiketler.push(sinif)
              kaynak.push(ad)
            })
          }
          i--
          j--
        } else if (yon[i][j] === 2) {
          j--
        } else {
          i--
        }
      }
    }

    // Sağlama: etiketler doğruysa mevcut ağ bunların çoğunu zaten bilir.
    let bilinen = 0
    ornekler.forEach((o, n) => {
      if (tani(o, a).sinif === SINIFLAR[etiketler[n]]) bilinen++
    })
    const kagitBasi: Record<string, number> = {}
    kaynak.forEach((k) => (kagitBasi[k] = (kagitBasi[k] ?? 0) + 1))
    console.log(
      `${toplamSatir} satır eşleşti, ${alinanSatir}'i alındı → ${ornekler.length} karakter; ` +
        `mevcut ağ %${((bilinen / ornekler.length) * 100).toFixed(1)}'ini biliyor`,
    )
    console.log(`kâğıt başına: ${JSON.stringify(kagitBasi)}`)

    const bayt = new Uint8Array(ornekler.length * KARE * KARE)
    ornekler.forEach((o, n) =>
      o.forEach((v, m) => (bayt[n * KARE * KARE + m] = Math.round(v * 255))),
    )
    writeFileSync(`${D}/gercek-x.bin`, Buffer.from(bayt))
    writeFileSync(`${D}/gercek-y.json`, JSON.stringify({ etiketler, kaynak }))
  }, 300_000)
})
