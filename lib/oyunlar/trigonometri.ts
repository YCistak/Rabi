import { siklariKur, type CoktanSecmeliSoru, type Sik } from './coktan-secmeli'
import type { Zorluk } from './ritim'
import { karistir, sec } from './tur'
import {
  TUVAL_GENISLIK,
  TUVAL_YUKSEKLIK,
  aciDerece,
  kenarEtiketi,
  koseEtiketi,
  type Nokta,
  type Sekil,
  type SekilParcasi,
} from './sekil'

/**
 * Trigonometrik Oranlar — Geometri Ustası'nın 10. sınıf oyunu.
 *
 * Maarif programının 10. sınıf Geometrik Şekiller temasındaki "Dik Üçgende
 * Trigonometrik Oranlar ve Özdeşlikler" konusu: sinüs, kosinüs, tanjant,
 * kotanjant ve tümler açı özdeşlikleri. Program bu sınıfta birim çembere
 * geçmiyor; oyun da yalnızca dar açıyla, dik üçgenin içinde kalıyor.
 *
 * Beş soru biçimi var ve zorluk hangisinin geleceğini seçiyor:
 *
 * - `ucgen` — üç kenarı yazılı üçgende α işaretli, bir oran soruluyor.
 * - `eksik` — iki kenar yazılı; sorulan oran yazılmayan kenarı istiyor, önce
 *   Pisagor.
 * - `ozel` — 30°, 45°, 60° değerleri (şekilsiz).
 * - `donusum` — bir oran verilip ötekisi soruluyor (şekilsiz; üçgeni öğrenci
 *   kafasında kuruyor).
 * - `tumler` — α + β = 90°: α'nın oranı verilip β'nınki soruluyor.
 *
 * Çeldiriciler rastgele sayı değil, **aynı üçgenin öteki oranları**: sin
 * sorulduğunda cos, tan ve cot değerleri şıkta duruyor. Oyunun ölçtüğü hata
 * tam bu — karşı ile komşuyu, pay ile paydayı karıştırmak. Rastgele bir kesir
 * konsaydı üçgene bakmadan elenirdi.
 */

export type Oran = 'sin' | 'cos' | 'tan' | 'cot'

export const ORANLAR: readonly Oran[] = ['sin', 'cos', 'tan', 'cot'] as const

export type TrigTuru = 'ucgen' | 'eksik' | 'ozel' | 'donusum' | 'tumler'

/** α'ya göre adlandırılmış kenar. */
export type TrigKenari = 'karsi' | 'komsu' | 'hipotenus'

/** Özel açılar. 0° ve 90° yok: dik üçgenin dar açısı olamıyorlar. */
export type OzelAci = 30 | 45 | 60

/** Kenar uzunlukları tam sayı: Pisagor üçlüleri ve katları. */
type UcgenKenarlari = { karsi: number; komsu: number; hipotenus: number }

export type TrigSorusu =
  | (UcgenKenarlari & {
      tur: 'ucgen' | 'eksik'
      oran: Oran
      /**
       * α'nın durduğu köşe. Dik köşe sol altta; `sag` yatay kenarın ucu, `ust`
       * dikey kenarın ucu. α hep aynı köşede dursaydı "karşı = dik kenar" diye
       * ezberlenirdi ve kural değil şeklin kendisi öğrenilirdi.
       */
      aciYeri: 'sag' | 'ust'
      /** Uzunluğu yazılmayan kenar; yalnızca `eksik` türünde dolu. */
      gizli: TrigKenari | null
    })
  | { tur: 'ozel'; oran: Oran; aci: OzelAci }
  | (UcgenKenarlari & {
      tur: 'donusum' | 'tumler'
      oran: Oran
      /** Soruda değeri verilen oran (α'nın). */
      verilen: Oran
    })

export type TrigOyunSorusu = CoktanSecmeliSoru<TrigSorusu, string>
export type TrigSikki = Sik<string>

/** Tanımın kendisi — açıklamalarda ve tur sonunda aynı cümle. */
export const ORAN_TANIMI: Record<Oran, string> = {
  sin: 'karşı / hipotenüs',
  cos: 'komşu / hipotenüs',
  tan: 'karşı / komşu',
  cot: 'komşu / karşı',
}

/** Tümler açının oranı: sin ↔ cos, tan ↔ cot. */
export const TUMLER_ORAN: Record<Oran, Oran> = {
  sin: 'cos',
  cos: 'sin',
  tan: 'cot',
  cot: 'tan',
}

// ---------------------------------------------------------------------------
// Değerler
// ---------------------------------------------------------------------------

function ebob(a: number, b: number): number {
  return b === 0 ? a : ebob(b, a % b)
}

/**
 * Sadeleştirilmiş kesir: "6/10" değil "3/5".
 *
 * Şıklar her zaman sade: 6-8-10 üçgeninde sin α = 3/5 ve bu tam da oyunun
 * söylemek istediği şey — oran üçgenin boyuna değil açıya bağlı. Sade
 * olmayan bir şık, doğru cevabın ikinci bir yazılışı olurdu.
 */
export function kesirYaz(pay: number, payda: number): string {
  const b = ebob(pay, payda)
  const p = pay / b
  const q = payda / b
  return q === 1 ? String(p) : `${p}/${q}`
}

/**
 * Özel açıların değerleri.
 *
 * tan 30° "√3/3" yazılıyor, "1/√3" değil: ders kitabında paydası
 * rasyonelleştirilmiş hâli duruyor ve iki yazılış yan yana şık olsaydı aynı
 * değer iki kez sorulurdu.
 */
export const OZEL_DEGER: Record<Oran, Record<OzelAci, string>> = {
  sin: { 30: '1/2', 45: '√2/2', 60: '√3/2' },
  cos: { 30: '√3/2', 45: '√2/2', 60: '1/2' },
  tan: { 30: '√3/3', 45: '1', 60: '√3' },
  cot: { 30: '√3', 45: '1', 60: '√3/3' },
}

/**
 * Özel açı sorularının şık kümesi.
 *
 * Altı değer tablodan, √2 ise tablonun dışından: 45-45-90 üçgeninin
 * hipotenüsünü orana karıştıran öğrencinin düştüğü değer.
 */
const OZEL_SIKLAR: readonly string[] = ['1/2', '√2/2', '√3/2', '1', '√3', '√3/3', '√2']

/**
 * Metnin sayısal değeri: "√3/2" → 0,866.
 *
 * Şıkların birbirine eşit olmadığını denetlemek ve testte gerçek
 * trigonometriyle karşılaştırmak için. Biçim bu dosyanın ürettiği kadar:
 * `[a][√b]` pay, isteğe bağlı `/c` payda.
 */
export function degerSayisi(metin: string): number {
  const [pay, payda = '1'] = metin.split('/')
  const eslesme = /^(\d*)(?:√(\d+))?$/.exec(pay)
  if (!eslesme) throw new Error(`Okunmayan değer: ${metin}`)
  const [, kat, kok] = eslesme
  const katSayi = kat === '' ? 1 : Number(kat)
  return (katSayi * (kok ? Math.sqrt(Number(kok)) : 1)) / Number(payda)
}

/** Bir açının dört oranı ile iki ters oranı (1/sin, 1/cos) — kenarlardan. */
function oranDegerleri({ karsi, komsu, hipotenus }: UcgenKenarlari) {
  return {
    sin: kesirYaz(karsi, hipotenus),
    cos: kesirYaz(komsu, hipotenus),
    tan: kesirYaz(karsi, komsu),
    cot: kesirYaz(komsu, karsi),
    tersSin: kesirYaz(hipotenus, karsi),
    tersCos: kesirYaz(hipotenus, komsu),
  }
}

/**
 * Cevabın ait olduğu açının kenarları.
 *
 * Tümler soruda cevap β'ya ait ve β'nın karşısı α'nın komşusu: kenarlar yer
 * değiştiriyor, üçgen aynı.
 */
function cevapKenarlari(soru: Exclude<TrigSorusu, { tur: 'ozel' }>): UcgenKenarlari {
  if (soru.tur === 'tumler') {
    return { karsi: soru.komsu, komsu: soru.karsi, hipotenus: soru.hipotenus }
  }
  return soru
}

export function trigCevabi(soru: TrigSorusu): string {
  if (soru.tur === 'ozel') return OZEL_DEGER[soru.oran][soru.aci]
  return oranDegerleri(cevapKenarlari(soru))[soru.oran]
}

/** Dönüşüm ve tümler sorularında verilen değer: α'nın oranı. */
export function verilenDeger(soru: Extract<TrigSorusu, { verilen: Oran }>): string {
  return oranDegerleri(soru)[soru.verilen]
}

// ---------------------------------------------------------------------------
// Şıklar
// ---------------------------------------------------------------------------

/**
 * Çeldirici adayları.
 *
 * Üçgenli sorularda cevabın ait olduğu açının öteki üç oranı; sin ve cos
 * sorulduğunda üstüne kendi tersi (hipotenüs / karşı): payı paydayla
 * karıştırmak, tanımı bilip ters yazmak demek. tan ile cot'un tersi zaten
 * birbiri, ayrıca eklenmiyor.
 */
function adaylar(soru: TrigSorusu): string[] {
  if (soru.tur === 'ozel') return [...OZEL_SIKLAR]
  const d = oranDegerleri(cevapKenarlari(soru))
  const liste = [d.sin, d.cos, d.tan, d.cot]
  if (soru.oran === 'sin') liste.push(d.tersSin)
  if (soru.oran === 'cos') liste.push(d.tersCos)
  return [...new Set(liste)]
}

/** Dört şık, biri doğru; değeri doğruya eşit bir çeldirici olamıyor. */
export function trigSiklari(soru: TrigSorusu, rastgele: () => number = Math.random): TrigSikki[] {
  const dogru = trigCevabi(soru)
  const dogruSayi = degerSayisi(dogru)
  return siklariKur(
    dogru,
    adaylar(soru),
    (deger) => deger,
    rastgele,
    // Aynı değerin iki yazılışı iki doğru şık demek (1 ile 45° cot'u gibi).
    (aday) => Math.abs(degerSayisi(aday) - dogruSayi) > 1e-9,
  )
}

// ---------------------------------------------------------------------------
// Metinler
// ---------------------------------------------------------------------------

/** Sorulan oranın adı: "sin α", "sin 60°", tümlerde "cos β". */
export function sorulanAd(soru: TrigSorusu): string {
  if (soru.tur === 'ozel') return `${soru.oran} ${soru.aci}°`
  return `${soru.oran} ${soru.tur === 'tumler' ? 'β' : 'α'}`
}

const KENAR_ADI: Record<TrigKenari, string> = {
  karsi: 'karşı',
  komsu: 'komşu',
  hipotenus: 'hipotenüs',
}

/**
 * Tek satırlık metin: Oyun Bankası listesi, genel test ve hata bildirimi.
 *
 * Genel testte şekil çizilmiyor, soru bu satırdan cevaplanabilmeli; o yüzden
 * üçgenli sorularda kenarlar α'ya göre adlarıyla yazılıyor. Yazılmayan kenar
 * satırda da yok.
 */
export function trigMetni(soru: TrigSorusu): string {
  switch (soru.tur) {
    case 'ozel':
      return `${sorulanAd(soru)} = ?`
    case 'ucgen':
    case 'eksik': {
      const kenarlar = (['karsi', 'komsu', 'hipotenus'] as TrigKenari[])
        .filter((k) => k !== soru.gizli)
        .map((k) => `${KENAR_ADI[k]} ${soru[k]}`)
        .join(', ')
      return `${sorulanAd(soru)} = ? (${kenarlar})`
    }
    case 'donusum':
      return `${soru.verilen} α = ${verilenDeger(soru)} ise ${sorulanAd(soru)} = ?`
    case 'tumler':
      return `α + β = 90°, ${soru.verilen} α = ${verilenDeger(soru)} ise ${sorulanAd(soru)} = ?`
  }
}

/**
 * Cevaptan sonra çıkan cümle: sonucun nereden geldiği.
 *
 * Yalnızca doğru değeri söylemek yetmiyor — oyuncu 3/4 yerine 4/3'ü seçtiyse
 * öğrenmesi gereken şey değer değil tanımın hangi kenarı paya koyduğu.
 */
export function trigAciklamasi(soru: TrigSorusu): string {
  const cevap = trigCevabi(soru)
  switch (soru.tur) {
    case 'ozel':
      return soru.aci === 45
        ? `${sorulanAd(soru)} = ${cevap}. 45-45-90 üçgeninde kenarlar 1, 1, √2.`
        : `${sorulanAd(soru)} = ${cevap}. 30-60-90 üçgeninde kenarlar 1, √3, 2; 30°nin karşısı 1.`
    case 'ucgen':
    case 'eksik': {
      const pay = soru.oran === 'sin' || soru.oran === 'tan' ? soru.karsi : soru.komsu
      const payda =
        soru.oran === 'sin' || soru.oran === 'cos'
          ? soru.hipotenus
          : soru.oran === 'tan'
            ? soru.komsu
            : soru.karsi
      const ham = `${pay}/${payda}`
      const govde = `${sorulanAd(soru)} = ${ORAN_TANIMI[soru.oran]} = ${ham}${ham === cevap ? '' : ` = ${cevap}`}.`
      if (soru.tur === 'ucgen' || soru.gizli === null) return govde
      return `Pisagor: ${KENAR_ADI[soru.gizli]} ${soru[soru.gizli]}. ${govde}`
    }
    case 'donusum':
      return `Üçgen ${soru.karsi}-${soru.komsu}-${soru.hipotenus}: karşı ${soru.karsi}, komşu ${soru.komsu}. ${sorulanAd(soru)} = ${ORAN_TANIMI[soru.oran]} = ${cevap}.`
    case 'tumler':
      return `Tümler açıda sin ↔ cos, tan ↔ cot: ${sorulanAd(soru)} = ${TUMLER_ORAN[soru.oran]} α = ${cevap}.`
  }
}

// ---------------------------------------------------------------------------
// Şekil
// ---------------------------------------------------------------------------

const HEDEF_GENISLIK = 196
const HEDEF_YUKSEKLIK = 104

/** Şekil yalnızca üçgenli iki türde var; ötekiler metinle soruluyor. */
export function sekliVarMi(soru: TrigSorusu): soru is Extract<TrigSorusu, { tur: 'ucgen' | 'eksik' }> {
  return soru.tur === 'ucgen' || soru.tur === 'eksik'
}

/**
 * Üçgen, kenar uzunluklarıyla orantılı.
 *
 * Özel Üçgenler'in (`ucgen.ts`) çiziminin aynısı; fark α'nın köşesi ve
 * kenarların α'ya göre adlanması. α'nın karşısındaki kenar α `sag`dayken
 * dikey, `ust`teyken yatay.
 */
export function trigSekli(soru: Extract<TrigSorusu, { tur: 'ucgen' | 'eksik' }>): Sekil {
  const dikeyKenar: TrigKenari = soru.aciYeri === 'sag' ? 'karsi' : 'komsu'
  const yatayKenar: TrigKenari = soru.aciYeri === 'sag' ? 'komsu' : 'karsi'
  const dikeyBoy = soru[dikeyKenar]
  const yatayBoy = soru[yatayKenar]

  const olcek = Math.min(HEDEF_GENISLIK / yatayBoy, HEDEF_YUKSEKLIK / dikeyBoy)
  const genislik = yatayBoy * olcek
  const yukseklik = dikeyBoy * olcek

  const dikKose: Nokta = {
    x: (TUVAL_GENISLIK - genislik) / 2,
    y: (TUVAL_YUKSEKLIK + yukseklik) / 2,
  }
  const yatayUcu: Nokta = { x: dikKose.x + genislik, y: dikKose.y }
  const dikeyUcu: Nokta = { x: dikKose.x, y: dikKose.y - yukseklik }

  const etiket = (kenar: TrigKenari, bas: Nokta, son: Nokta, disari: number): SekilParcasi[] =>
    soru.gizli === kenar ? [] : [kenarEtiketi(bas, son, String(soru[kenar]), disari)]

  const aciKosesi = soru.aciYeri === 'sag' ? yatayUcu : dikeyUcu
  const obur = soru.aciYeri === 'sag' ? dikeyUcu : yatayUcu

  return {
    genislik: TUVAL_GENISLIK,
    yukseklik: TUVAL_YUKSEKLIK,
    parcalar: [
      { tur: 'cizgi', bas: dikKose, son: yatayUcu },
      { tur: 'cizgi', bas: dikKose, son: dikeyUcu },
      { tur: 'cizgi', bas: dikeyUcu, son: yatayUcu },
      { tur: 'dikAci', kose: dikKose, ilk: 0, son: 90 },
      ...etiket(yatayKenar, dikKose, yatayUcu, 270),
      ...etiket(dikeyKenar, dikKose, dikeyUcu, 180),
      ...etiket('hipotenus', dikeyUcu, yatayUcu, aciDerece(dikeyUcu, yatayUcu) + 90),
      // Basık üçgende köşe ile karşı kenar arası dar; `koseEtiketi` yazıyı
      // o derinliğe sığdırıyor.
      ...koseEtiketi(aciKosesi, dikKose, obur, 'α', true, 22),
    ],
  }
}

// ---------------------------------------------------------------------------
// Üretim
// ---------------------------------------------------------------------------

/**
 * Pisagor üçlüleri ve katları.
 *
 * Katlar yalnızca şekilli sorularda kullanılıyor: 6-8-10 üçgeninde sin α'nın
 * yine 3/5 çıkması sorunun yarısı. Metin sorularında değer zaten sade
 * yazıldığı için kat görünmüyor, taban üçlü yetiyor.
 *
 * 7-24-25 çizilmiyor (`sekilde: false`): dar açısı 16° ve α o köşeye
 * düşünce etiket kenarların arasına sığmıyor, çizgilerin üstüne biniyordu.
 * Metin sorularında duruyor — orada 7/25 ile 24/25 ayrı iki değer, yeter.
 */
const UCLULER: { kenarlar: [number, number, number]; katlar: number[]; sekilde: boolean }[] = [
  { kenarlar: [3, 4, 5], katlar: [1, 2, 3], sekilde: true },
  { kenarlar: [5, 12, 13], katlar: [1, 2], sekilde: true },
  { kenarlar: [8, 15, 17], katlar: [1], sekilde: true },
  { kenarlar: [7, 24, 25], katlar: [1], sekilde: false },
  { kenarlar: [20, 21, 29], katlar: [1], sekilde: true },
]

function ucgenKur(rastgele: () => number, sekilli: boolean): UcgenKenarlari {
  const uclu = sec(sekilli ? UCLULER.filter((u) => u.sekilde) : UCLULER, rastgele)
  const kat = sekilli ? sec(uclu.katlar, rastgele) : 1
  const [kisa, uzun, hip] = uclu.kenarlar.map((k) => k * kat)
  // Kısa kenar bazen karşı, bazen komşu: sin hep küçük kesir çıkmasın.
  return rastgele() < 0.5
    ? { karsi: kisa, komsu: uzun, hipotenus: hip }
    : { karsi: uzun, komsu: kisa, hipotenus: hip }
}

/** Oranın payında ve paydasında duran kenarlar. */
const ORANIN_KENARLARI: Record<Oran, TrigKenari[]> = {
  sin: ['karsi', 'hipotenus'],
  cos: ['komsu', 'hipotenus'],
  tan: ['karsi', 'komsu'],
  cot: ['komsu', 'karsi'],
}

function sekilliUret(tur: 'ucgen' | 'eksik', oranlar: readonly Oran[], rastgele: () => number): TrigSorusu {
  const kenarlar = ucgenKur(rastgele, true)
  const aciYeri = rastgele() < 0.5 ? 'sag' : 'ust'
  if (tur === 'ucgen') {
    return { tur, ...kenarlar, aciYeri, oran: sec(oranlar, rastgele), gizli: null }
  }
  /*
    Eksik kenar sorulan oranın içinde olmak zorunda: olmasaydı Pisagor'a hiç
    gerek kalmaz, soru `ucgen`in aynısı olurdu.
  */
  const gizli = sec<TrigKenari>(['karsi', 'komsu', 'hipotenus'], rastgele)
  const uygun = oranlar.filter((o) => ORANIN_KENARLARI[o].includes(gizli))
  return { tur, ...kenarlar, aciYeri, oran: sec(uygun, rastgele), gizli }
}

function ozelUret(oranlar: readonly Oran[], rastgele: () => number): TrigSorusu {
  return { tur: 'ozel', oran: sec(oranlar, rastgele), aci: sec<OzelAci>([30, 45, 60], rastgele) }
}

function metinliUret(tur: 'donusum' | 'tumler', rastgele: () => number): TrigSorusu {
  const kenarlar = ucgenKur(rastgele, false)
  const verilen = sec(ORANLAR, rastgele)
  /*
    Dönüşümde sorulan, verilenden farklı olmalı; yoksa cevap soruda yazılı.
    Tümlerde aynı ad serbest: "sin α = 3/5 ise sin β?" sorusunun cevabı 3/5
    değil ve tuzak tam da orada.
  */
  const oran =
    tur === 'donusum' ? sec(ORANLAR.filter((o) => o !== verilen), rastgele) : sec(ORANLAR, rastgele)
  return { tur, ...kenarlar, verilen, oran }
}

/**
 * Zorluğa göre soru.
 *
 * - Kolay: tanım. Üç kenarı yazılı üçgende sin/cos/tan, özel açılarda sin/cos.
 * - Orta: cot da geliyor, eksik kenar Pisagor istiyor, özel açılarda dört oran.
 * - Zor: şekil yok; bir oran verilip öteki ya da tümler açınınki soruluyor.
 *   Eksik kenarlı üçgen de burada kalıyor — metinden gelen yorgunluğu
 *   bölüyor ve cot ile birlikte hâlâ en çok karıştırılan soru.
 */
export function trigSorusuUret(zorluk: Zorluk, rastgele: () => number = Math.random): TrigSorusu {
  const zar = rastgele()
  switch (zorluk) {
    case 'kolay':
      return zar < 0.6
        ? sekilliUret('ucgen', ['sin', 'cos', 'tan'], rastgele)
        : ozelUret(['sin', 'cos'], rastgele)
    case 'orta':
      if (zar < 0.35) return sekilliUret('ucgen', ORANLAR, rastgele)
      if (zar < 0.7) return sekilliUret('eksik', ORANLAR, rastgele)
      return ozelUret(ORANLAR, rastgele)
    case 'zor':
      if (zar < 0.4) return metinliUret('donusum', rastgele)
      if (zar < 0.7) return metinliUret('tumler', rastgele)
      return sekilliUret('eksik', ORANLAR, rastgele)
  }
}

/** Sorunun kimliği: banka kaydı ve tekrar denetimi. */
export function trigKimligi(soru: TrigSorusu): string {
  switch (soru.tur) {
    case 'ozel':
      return `ozel:${soru.oran}:${soru.aci}`
    case 'ucgen':
    case 'eksik':
      return [soru.tur, soru.oran, soru.karsi, soru.komsu, soru.hipotenus, soru.aciYeri, soru.gizli ?? '-'].join(':')
    case 'donusum':
    case 'tumler':
      return [soru.tur, soru.verilen, soru.oran, soru.karsi, soru.komsu, soru.hipotenus].join(':')
  }
}

/** Aynı sorunun kaç soru içinde tekrarlanmayacağı. */
const TEKRAR_PENCERESI = 12

/**
 * Bir seviyenin soru şeridi, şıklarıyla.
 *
 * Şıklar burada bir kez kuruluyor; her çizimde kurulsaydı yerleri oynardı.
 */
export function trigTuruHazirla(
  adet: number,
  zorluk: Zorluk,
  rastgele: () => number = Math.random,
): TrigOyunSorusu[] {
  const sorular: TrigOyunSorusu[] = []
  const sonGorulen: string[] = []

  for (let deneme = 0; deneme < adet * 20 && sorular.length < adet; deneme++) {
    const soru = trigSorusuUret(zorluk, rastgele)
    const kimlik = trigKimligi(soru)
    if (sonGorulen.includes(kimlik)) continue

    sorular.push({ soru, siklar: trigSiklari(soru, rastgele) })
    sonGorulen.push(kimlik)
    if (sonGorulen.length > TEKRAR_PENCERESI) sonGorulen.shift()
  }

  return sorular
}

/** Banka turu: kayıtlı sorular karışık sırada, şıkları yeniden kurularak. */
export function bankaTuruHazirla(
  sorular: readonly TrigSorusu[],
  rastgele: () => number = Math.random,
): TrigOyunSorusu[] {
  return karistir(sorular, rastgele).map((soru) => ({ soru, siklar: trigSiklari(soru, rastgele) }))
}
