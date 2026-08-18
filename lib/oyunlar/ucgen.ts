import { arasinda, sec } from './tur'
import {
  TUVAL_GENISLIK,
  TUVAL_YUKSEKLIK,
  aciDerece,
  aciEtiketi,
  kenarEtiketi,
  kenarTiki,
  koseYayi,
  type Nokta,
  type Sekil,
  type SekilParcasi,
} from './sekil'

/**
 * Özel Üçgenler — Geometri Ustası'nın dik üçgen oyunu.
 *
 * TYT'de dik üçgen soruları neredeyse her zaman ezberlenmiş bir orandan
 * çözülüyor: Pisagor üçlüleri (3-4-5, 5-12-13, 8-15-17, 7-24-25 ve katları),
 * 30-60-90 (a, a√3, 2a) ve ikizkenar dik üçgen 45-45-90 (a, a, a√2). Oyunun
 * amacı bu oranları refleks hâline getirmek, o yüzden hesap değil **tanıma**
 * soruluyor: iki kenar verilir, üçüncüsü iki şıktan seçilir.
 *
 * Şekil kenar uzunluklarıyla orantılı çiziliyor (`sekil.ts`); 7-24-25 gerçekten
 * yatık, 45-45-90 gerçekten simetrik görünüyor.
 */

/**
 * Kenar uzunluğu: `kat · √kok`.
 *
 * Ondalık sayı tutulmuyor. 5√2 sınavda böyle yazılıyor ve 7,07 diye yazılsaydı
 * hem şık hem de öğrencinin kafasındaki biçim değişirdi.
 */
export type Kenar = { kat: number; kok: 1 | 2 | 3 }

export type UcgenTuru = 'pisagor' | 'otuz-altmis' | 'kirkbes'

/** Üçgenin bir kenarı; dik köşe sol altta, kenarlar ona göre adlandırılıyor. */
export type UcgenKenari = 'dikey' | 'yatay' | 'hipotenus'

export type UcgenSorusu = {
  tur: UcgenTuru
  dikey: Kenar
  yatay: Kenar
  hipotenus: Kenar
  /** Şekilde "x" yazan, sorulan kenar. */
  bilinmeyen: UcgenKenari
  /**
   * Uzunluğu yazılmayan kenar.
   *
   * Yalnızca ikizkenar dik üçgende doluyor: iki dik kenar eşit olduğu için
   * ikisini de yazmak cevabı vermek olurdu. Eşitlik şekilde çentikle
   * gösteriliyor.
   */
  gizli: UcgenKenari | null
  celdirici: Kenar
}

export const UCGEN_ADI: Record<UcgenTuru, string> = {
  pisagor: 'Pisagor üçlüsü',
  'otuz-altmis': '30-60-90 üçgeni',
  kirkbes: 'İkizkenar dik üçgen',
}

/** Tur sonunda yanlışın altında çıkan kural. */
export const UCGEN_ACIKLAMASI: Record<UcgenTuru, string> = {
  pisagor:
    'Dik üçgende a² + b² = c². 3-4-5, 5-12-13, 8-15-17 ve 7-24-25 üçlüleri ile katları ezberlenirse hesap yapmaya gerek kalmaz.',
  'otuz-altmis':
    '30-60-90 üçgeninde kenarlar a, a√3, 2a oranındadır; en kısa kenar 30°nin karşısındadır.',
  kirkbes:
    'İkizkenar dik üçgende (45-45-90) kenarlar a, a, a√2 oranındadır; hipotenüs dik kenarın √2 katıdır.',
}

export function kenarMetni(kenar: Kenar): string {
  if (kenar.kok === 1) return String(kenar.kat)
  return kenar.kat === 1 ? `√${kenar.kok}` : `${kenar.kat}√${kenar.kok}`
}

/** Şekli ölçeklemek ve şıkları karşılaştırmak için sayısal değer. */
export function kenarDegeri(kenar: Kenar): number {
  return kenar.kat * Math.sqrt(kenar.kok)
}

export function kenarEsit(bir: Kenar, iki: Kenar): boolean {
  return bir.kat === iki.kat && bir.kok === iki.kok
}

/** Oyun Bankası listesinde görünen özet: "5 · x · 13". */
export function ucgenOzeti(soru: UcgenSorusu): string {
  const yaz = (kenar: UcgenKenari) => {
    if (kenar === soru.bilinmeyen) return 'x'
    if (kenar === soru.gizli) return '?'
    return kenarMetni(soru[kenar])
  }
  return `${yaz('dikey')} · ${yaz('yatay')} · ${yaz('hipotenus')}`
}

export function ucgenCevabi(soru: UcgenSorusu): Kenar {
  return soru[soru.bilinmeyen]
}

/** Şıklar: doğru kenar ve çeldirici, karışık sırada. */
export function ucgenSiklari(
  soru: UcgenSorusu,
  rastgele: () => number = Math.random,
): [Kenar, Kenar] {
  const dogru = ucgenCevabi(soru)
  return rastgele() < 0.5 ? [dogru, soru.celdirici] : [soru.celdirici, dogru]
}

/** Şekildeki açılar. Pisagor üçlüsünde açı verilmiyor — verilse soru ikiye bölünürdü. */
export function ucgenAcilari(soru: UcgenSorusu): { dikeyUcu: number; yatayUcu: number } | null {
  if (soru.tur === 'pisagor') return null
  if (soru.tur === 'kirkbes') return { dikeyUcu: 45, yatayUcu: 45 }
  // 30° en kısa kenarın karşısında: dikey kenarın karşısındaki açı yatay ucunda.
  const dikeyKisa = kenarDegeri(soru.dikey) < kenarDegeri(soru.yatay)
  return { dikeyUcu: dikeyKisa ? 60 : 30, yatayUcu: dikeyKisa ? 30 : 60 }
}

// ---------------------------------------------------------------------------
// Şekil
// ---------------------------------------------------------------------------

const HEDEF_GENISLIK = 196
const HEDEF_YUKSEKLIK = 104

export function ucgenSekli(soru: UcgenSorusu): Sekil {
  const yatayBoy = kenarDegeri(soru.yatay)
  const dikeyBoy = kenarDegeri(soru.dikey)
  const olcek = Math.min(HEDEF_GENISLIK / yatayBoy, HEDEF_YUKSEKLIK / dikeyBoy)
  const genislik = yatayBoy * olcek
  const yukseklik = dikeyBoy * olcek

  // Dik köşe sol altta; yatay kenar sağa, dikey kenar yukarı gidiyor.
  const dikKose: Nokta = {
    x: (TUVAL_GENISLIK - genislik) / 2,
    y: (TUVAL_YUKSEKLIK + yukseklik) / 2,
  }
  const yatayUcu: Nokta = { x: dikKose.x + genislik, y: dikKose.y }
  const dikeyUcu: Nokta = { x: dikKose.x, y: dikKose.y - yukseklik }

  const etiket = (kenar: UcgenKenari, bas: Nokta, son: Nokta, disari: number) => {
    if (soru.gizli === kenar) return []
    const bilinmiyor = soru.bilinmeyen === kenar
    return [
      kenarEtiketi(bas, son, bilinmiyor ? 'x' : kenarMetni(soru[kenar]), disari, bilinmiyor),
    ]
  }

  const parcalar: SekilParcasi[] = [
    { tur: 'cizgi', bas: dikKose, son: yatayUcu },
    { tur: 'cizgi', bas: dikKose, son: dikeyUcu },
    { tur: 'cizgi', bas: dikeyUcu, son: yatayUcu },
    { tur: 'dikAci', kose: dikKose, ilk: 0, son: 90 },
    ...etiket('yatay', dikKose, yatayUcu, 270),
    ...etiket('dikey', dikKose, dikeyUcu, 180),
    // Hipotenüs etiketi kenarın dışına, yani üçgenin ters tarafına kaçıyor.
    ...etiket('hipotenus', dikeyUcu, yatayUcu, aciDerece(dikeyUcu, yatayUcu) + 90),
  ]

  // Gizlenen kenar varsa eşitlik çentikle gösteriliyor; şekil onsuz eksik kalır.
  if (soru.gizli !== null) {
    parcalar.push(kenarTiki(dikKose, yatayUcu), kenarTiki(dikKose, dikeyUcu))
  }

  const acilar = ucgenAcilari(soru)
  if (acilar) {
    const ust = koseYayi(dikeyUcu, dikKose, yatayUcu)
    const sag = koseYayi(yatayUcu, dikKose, dikeyUcu)
    parcalar.push(
      ...aciEtiketi(dikeyUcu, ust.ilk, ust.son, `${acilar.dikeyUcu}°`, false, 20),
      ...aciEtiketi(yatayUcu, sag.ilk, sag.son, `${acilar.yatayUcu}°`, false, 20),
    )
  }

  return { genislik: TUVAL_GENISLIK, yukseklik: TUVAL_YUKSEKLIK, parcalar }
}

// ---------------------------------------------------------------------------
// Üretim
// ---------------------------------------------------------------------------

/**
 * Pisagor üçlüleri ve kullanılan katları.
 *
 * Kat sınırı sayıları küçük tutmak için: 7-24-25'in üçüncü katı 21-72-75,
 * zihinden tanınacak bir üçlü olmaktan çıkıyor.
 */
const UCLULER: { kenarlar: [number, number, number]; katlar: number[] }[] = [
  { kenarlar: [3, 4, 5], katlar: [1, 2, 3, 4] },
  { kenarlar: [5, 12, 13], katlar: [1, 2] },
  { kenarlar: [8, 15, 17], katlar: [1, 2] },
  { kenarlar: [7, 24, 25], katlar: [1, 2] },
]

function tam(kat: number): Kenar {
  return { kat, kok: 1 }
}

/**
 * Çeldirici seçimi.
 *
 * Aday listesinden doğru cevaba ve şekilde **yazan** kenarlara eşit olanlar
 * eleniyor: ekranda görünen bir uzunluğu şık diye koymak soruyu okumadan
 * elenebilir hâle getirirdi.
 */
function celdiriciSec(
  adaylar: Kenar[],
  dogru: Kenar,
  gorunen: Kenar[],
  rastgele: () => number,
): Kenar {
  const uygun = adaylar.filter(
    (aday) =>
      aday.kat > 0 &&
      !kenarEsit(aday, dogru) &&
      !gorunen.some((k) => kenarEsit(aday, k)),
  )
  // Liste hiç boşalmıyor ama tip güvenliği için son çare: doğrunun bir fazlası.
  return uygun.length > 0 ? sec(uygun, rastgele) : tam(dogru.kat + 1)
}

function pisagorUret(rastgele: () => number): UcgenSorusu {
  const uclu = sec(UCLULER, rastgele)
  const kat = sec(uclu.katlar, rastgele)
  const [kisa, uzun, hip] = uclu.kenarlar.map((k) => k * kat)

  // Uzun kenar bazen dikey: her soruda aynı duran bir şekil ezberleniyordu.
  const dikDurur = rastgele() < 0.5
  const dikey = tam(dikDurur ? uzun : kisa)
  const yatay = tam(dikDurur ? kisa : uzun)
  const hipotenus = tam(hip)

  if (rastgele() < 0.45) {
    return {
      tur: 'pisagor',
      dikey,
      yatay,
      hipotenus,
      bilinmeyen: 'hipotenus',
      gizli: null,
      // İki dik kenarı toplamak, hipotenüs sorularının en yaygın hatası.
      celdirici: celdiriciSec(
        [tam(kisa + uzun), tam(2 * uzun)],
        hipotenus,
        [dikey, yatay],
        rastgele,
      ),
    }
  }

  const bilinmeyen: UcgenKenari = rastgele() < 0.5 ? 'dikey' : 'yatay'
  const oteki = bilinmeyen === 'dikey' ? yatay : dikey
  return {
    tur: 'pisagor',
    dikey,
    yatay,
    hipotenus,
    bilinmeyen,
    gizli: null,
    // Kenar sorulduğunda hipotenüsten çıkarmak yerine farkı almak yaygın hata.
    celdirici: celdiriciSec(
      [tam(hip - oteki.kat), tam(hip + oteki.kat)],
      bilinmeyen === 'dikey' ? dikey : yatay,
      [oteki, hipotenus],
      rastgele,
    ),
  }
}

function otuzAltmisUret(rastgele: () => number): UcgenSorusu {
  const a = arasinda(2, 9, rastgele)
  const kisa = tam(a)
  const uzun: Kenar = { kat: a, kok: 3 }
  const hipotenus = tam(2 * a)

  const dikDurur = rastgele() < 0.5
  const dikey = dikDurur ? uzun : kisa
  const yatay = dikDurur ? kisa : uzun

  const bilinmeyen = sec<UcgenKenari>(['dikey', 'yatay', 'hipotenus'], rastgele)
  const soru: UcgenSorusu = {
    tur: 'otuz-altmis',
    dikey,
    yatay,
    hipotenus,
    bilinmeyen,
    gizli: null,
    celdirici: kisa,
  }
  const dogru = ucgenCevabi(soru)
  const gorunen = (['dikey', 'yatay', 'hipotenus'] as UcgenKenari[])
    .filter((kenar) => kenar !== bilinmeyen)
    .map((kenar) => soru[kenar])

  return {
    ...soru,
    // Oranı karıştıranın düşeceği değerler: √2'li (45-45-90 ile karışma),
    // iki katı ya da üç katı.
    celdirici: celdiriciSec(
      [kisa, { kat: a, kok: 2 }, uzun, hipotenus, tam(3 * a)],
      dogru,
      gorunen,
      rastgele,
    ),
  }
}

function kirkbesUret(rastgele: () => number): UcgenSorusu {
  // İki biçim: dik kenarlar verilip hipotenüs, ya da hipotenüs verilip dik kenar.
  if (rastgele() < 0.55) {
    const a = arasinda(3, 12, rastgele)
    const dikKenar = tam(a)
    const hipotenus: Kenar = { kat: a, kok: 2 }
    return {
      tur: 'kirkbes',
      dikey: dikKenar,
      yatay: dikKenar,
      hipotenus,
      bilinmeyen: 'hipotenus',
      gizli: null,
      celdirici: celdiriciSec(
        [tam(2 * a), { kat: a, kok: 3 }, tam(3 * a)],
        hipotenus,
        [dikKenar],
        rastgele,
      ),
    }
  }

  // Hipotenüs tam sayı olsun diye çift seçiliyor: dik kenar (m / 2)√2 çıkıyor.
  const m = arasinda(3, 9, rastgele) * 2
  const dikKenar: Kenar = { kat: m / 2, kok: 2 }
  const hipotenus = tam(m)
  const bilinmeyen: UcgenKenari = rastgele() < 0.5 ? 'dikey' : 'yatay'

  return {
    tur: 'kirkbes',
    dikey: dikKenar,
    yatay: dikKenar,
    hipotenus,
    bilinmeyen,
    // Öteki dik kenar yazılmıyor: eşit oldukları için cevabı ele verirdi.
    gizli: bilinmeyen === 'dikey' ? 'yatay' : 'dikey',
    celdirici: celdiriciSec(
      [tam(m / 2), { kat: m, kok: 2 }, { kat: m / 2, kok: 3 }],
      dikKenar,
      [hipotenus],
      rastgele,
    ),
  }
}

const URETECLER: Record<UcgenTuru, (rastgele: () => number) => UcgenSorusu> = {
  pisagor: pisagorUret,
  'otuz-altmis': otuzAltmisUret,
  kirkbes: kirkbesUret,
}

export const TUM_UCGEN_TURLERI: UcgenTuru[] = ['pisagor', 'otuz-altmis', 'kirkbes']

/** Aynı sorunun kaç soru içinde tekrarlanmayacağı. */
const TEKRAR_PENCERESI = 10

export function ucgenKimligi(soru: UcgenSorusu): string {
  return [
    soru.tur,
    kenarMetni(soru.dikey),
    kenarMetni(soru.yatay),
    kenarMetni(soru.hipotenus),
    soru.bilinmeyen,
  ].join(':')
}

/**
 * Bir turun soruları.
 *
 * Üç tür de eşit olasılıkla geliyor: Pisagor üçlüleri daha çok çeşit ürettiği
 * için ağırlıklandırılsaydı 30-60-90 turda birkaç kez görünürdü.
 */
export function ucgenTuruHazirla(
  adet: number,
  rastgele: () => number = Math.random,
): UcgenSorusu[] {
  const sorular: UcgenSorusu[] = []
  const sonGorulen: string[] = []

  for (let deneme = 0; deneme < adet * 20 && sorular.length < adet; deneme++) {
    const soru = URETECLER[sec(TUM_UCGEN_TURLERI, rastgele)](rastgele)
    const kimlik = ucgenKimligi(soru)
    if (sonGorulen.includes(kimlik)) continue

    sorular.push(soru)
    sonGorulen.push(kimlik)
    if (sonGorulen.length > TEKRAR_PENCERESI) sonGorulen.shift()
  }

  return sorular
}
