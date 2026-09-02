/**
 * İzohips Okuma — eş yükselti eğrilerinden yer şeklini tanıma (9. sınıf).
 *
 * Haritalar **üretiliyor**, çizilmiş bir görsel havuzundan gelmiyor. İki
 * sebebi var:
 *
 * 1. **Telif.** Sınav ve deneme kitaplarındaki izohips haritaları o
 *    yayınların; kopyalanamaz. Üretilen harita özgün.
 * 2. **Cevabın doğruluğu.** Hazır bir görselde "daire içindeki şekil nedir"
 *    sorusunun cevabı elle yazılır ve yanlış yazılabilir. Burada harita, cevabı
 *    **bilinen** bir yükselti alanından türüyor: tepe soruluyorsa daire zaten
 *    bir tepenin üstüne konuyor, çünkü tepeyi oraya bu kod koydu.
 *
 * Boru hattı: tohum → yükselti alanı (birkaç katmanın toplamı) → ızgara →
 * marching squares ile eğriler → SVG yolları. Tohum kayıtta durduğu için aynı
 * harita Oyun Bankası turunda birebir yeniden çiziliyor.
 */

import type { Zorluk } from './ritim'
import { siklariKur as secenekleriKur, type Sik } from './coktan-secmeli'

export { SIK_SAYISI } from './coktan-secmeli'

/**
 * Sorulabilecek yer şekilleri.
 *
 * Hepsinin ortak yanı **izohipsten okunabilir** olması: eğrilerin biçimi,
 * sıklığı ve yükselti sayıları dışında bilgi gerektirmiyorlar. Delta ve falez
 * bu yüzden listede yok — ikisi de kesit ya da akarsu bilgisi ister, düz bir
 * izohips haritasından çıkarılamazlar.
 */
export type YerSekli =
  | 'tepe'
  | 'cukur'
  | 'vadi'
  | 'sirt'
  | 'boyun'
  | 'dik-yamac'
  | 'yatik-yamac'
  | 'plato'
  | 'ada'
  | 'yarimada'
  | 'koy'

export const SEKIL_ADI: Record<YerSekli, string> = {
  tepe: 'Tepe (doruk)',
  cukur: 'Kapalı çukur',
  vadi: 'Vadi',
  sirt: 'Sırt',
  boyun: 'Boyun (geçit)',
  'dik-yamac': 'Dik yamaç',
  'yatik-yamac': 'Yatık (az eğimli) yamaç',
  plato: 'Plato',
  ada: 'Ada',
  yarimada: 'Yarımada',
  koy: 'Koy',
}

/** Tur sonunda yanlışın altında görünen kısa öğretici not. */
export const SEKIL_ACIKLAMASI: Record<YerSekli, string> = {
  tepe: 'İç içe kapalı eğriler ve içe doğru **artan** yükselti: en içteki halka doruğu gösterir.',
  cukur:
    'İç içe kapalı eğriler ama yükselti içe doğru **azalıyor**. Sayılara bakılmazsa tepeyle karıştırılır.',
  vadi: 'Eğriler yükseltinin arttığı yöne, yani **yukarıya** doğru sivrilir (V ters döner). İçinden akarsu geçer.',
  sirt: 'Eğriler yükseltinin azaldığı yöne, yani **aşağıya** doğru sivrilir; iki vadi arasındaki yüksek hattır.',
  boyun: 'İki doruğun arasındaki alçak geçit. Eğriler burada karşılıklı iki kez içbükey döner; yollar buradan aşar.',
  'dik-yamac':
    'İzohipsler **sıklaşmışsa** aynı yükselti farkı daha kısa yatay mesafede aşılıyor demektir: eğim fazladır.',
  'yatik-yamac':
    'İzohipsler **seyrekleşmişse** aynı yükselti farkı uzun bir mesafeye yayılmış demektir: eğim azdır.',
  plato:
    'Çevresine göre yüksekte duran **geniş düzlük**: kenarları sık izohipslerle çevrili, ortası eğrisiz kalır.',
  ada: 'Denizin ortasında, çevresi tümüyle suyla kuşatılmış kara. En dıştaki eğrisi kıyı çizgisidir.',
  yarimada: 'Üç yanı denizle çevrili, bir yanından karaya bağlı çıkıntı.',
  koy: 'Denizin karaya doğru girinti yaptığı yer; kıyı çizgisi burada içeri doğru kıvrılır.',
}

/**
 * Çeldiriciler buradan seçiliyor — rastgele değil.
 *
 * Rastgele şıkla soru haritaya bakmadan elenirdi: "kapalı çukur" sorulup
 * şıklara ada, koy ve yarımada konsaydı denizin olmadığı bir haritada üçü de
 * kendiliğinden düşerdi. Buradaki listeler **gerçekten karıştırılan**
 * şekiller: aynı çizime benzeyen, ayrımı yükselti sayısına ya da eğrilerin
 * sıklığına bakmayı gerektirenler.
 */
export const KARISTIRILAN: Record<YerSekli, YerSekli[]> = {
  // Aynı çizim: iç içe kapalı halkalar. Ayıran tek şey yükselti sayıları.
  tepe: ['cukur', 'sirt', 'boyun'],
  cukur: ['tepe', 'boyun', 'vadi'],
  // Vadi ile sırt aynı V'nin iki yönü.
  vadi: ['sirt', 'boyun', 'cukur'],
  sirt: ['vadi', 'tepe', 'boyun'],
  boyun: ['tepe', 'vadi', 'sirt'],
  // Eğim soruları kendi aralarında karışıyor.
  'dik-yamac': ['yatik-yamac', 'vadi', 'plato'],
  'yatik-yamac': ['dik-yamac', 'plato', 'sirt'],
  plato: ['tepe', 'yatik-yamac', 'dik-yamac'],
  // Kıyı şekilleri yalnızca denizli haritalarda çıkıyor; birbirleriyle karışıyorlar.
  ada: ['yarimada', 'koy', 'tepe'],
  yarimada: ['ada', 'koy', 'sirt'],
  koy: ['yarimada', 'ada', 'vadi'],
}

export type IzohipsSorusu = {
  /**
   * Haritayı üreten tohum.
   *
   * Kayıtta duran tek şey bu: harita bir görsel değil, tohumdan yeniden
   * çizilen bir hesap. Bankaya piksel yazmak gerekmiyor.
   */
  tohum: number
  zorluk: Zorluk
  sekil: YerSekli
}

export type IzohipsSikki = Sik<YerSekli>
export type IzohipsOyunSorusu = { soru: IzohipsSorusu; siklar: IzohipsSikki[] }

// ---------------------------------------------------------------------------
// Rastgelelik
// ---------------------------------------------------------------------------

/**
 * Tohumdan üreteç (mulberry32).
 *
 * `Math.random` kullanılamaz: aynı soru bankadan yeniden açıldığında **aynı**
 * haritanın çizilmesi gerekiyor. Öğrencinin bir kez yanlış bildiği harita,
 * tekrar karşısına çıktığında başka bir harita olsaydı banka öğretmezdi.
 */
export function uretec(tohum: number): () => number {
  let durum = tohum >>> 0
  return () => {
    durum = (durum + 0x6d2b79f5) >>> 0
    let t = durum
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const arasinda = (en_az: number, en_cok: number, rastgele: () => number): number =>
  en_az + rastgele() * (en_cok - en_az)

// ---------------------------------------------------------------------------
// Yükselti alanı
// ---------------------------------------------------------------------------

/** Bir katman: normalize edilmiş (0–1) koordinatta metre cinsinden katkı. */
type Katman = (x: number, y: number) => number

/** Çan eğrisi — tepelerin ve çukurların ortak biçimi. */
function tumsek(cx: number, cy: number, genlik: number, yaricap: number): Katman {
  return (x, y) => {
    const d2 = (x - cx) ** 2 + (y - cy) ** 2
    return genlik * Math.exp(-d2 / (yaricap * yaricap))
  }
}

/** Bir doğru parçası boyunca uzayan çan — sırtlar ve vadiler böyle. */
function seritTumsegi(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  genlik: number,
  yaricap: number,
): Katman {
  const dx = bx - ax
  const dy = by - ay
  const uzun = dx * dx + dy * dy
  return (x, y) => {
    const t = uzun === 0 ? 0 : Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / uzun))
    const d2 = (x - (ax + t * dx)) ** 2 + (y - (ay + t * dy)) ** 2
    return genlik * Math.exp(-d2 / (yaricap * yaricap))
  }
}

/**
 * Basamak — yamacın dikliğini belirleyen katman.
 *
 * `genislik` daraldıkça aynı yükselti farkı daha kısa mesafede aşılıyor, yani
 * izohipsler sıklaşıyor. Dik ve yatık yamaç soruları arasındaki tek fark bu
 * sayı; ikisi de aynı katmandan çıkıyor.
 */
function basamak(
  cx: number,
  cy: number,
  nx: number,
  ny: number,
  genlik: number,
  genislik: number,
): Katman {
  return (x, y) => genlik / (1 + Math.exp(-((x - cx) * nx + (y - cy) * ny) / genislik))
}

/** Yayvan ve düz tepeli yükselti — platonun gövdesi. */
function masa(cx: number, cy: number, genlik: number, duzluk: number, kenar: number): Katman {
  return (x, y) => {
    const d = Math.hypot(x - cx, y - cy)
    if (d <= duzluk) return genlik
    if (d >= duzluk + kenar) return 0
    const t = (d - duzluk) / kenar
    // Kenarda yumuşak iniş: keskin kesim izohipsleri üst üste bindirirdi.
    return genlik * (1 - t * t * (3 - 2 * t))
  }
}

// ---------------------------------------------------------------------------
// Harita kurulumu
// ---------------------------------------------------------------------------

/** Çizimin kutusu. */
export const HARITA_EN = 600
export const HARITA_BOY = 440

/** Denizli haritalarda kıyının yaklaşık yeri (0–1, aşağı doğru). */
const KIYI = 0.52

/** Deniz tabanının eğimi: kıyıdan uzaklaştıkça metre cinsinden iniş. */
const DENIZ_EGIMI = 1100

/**
 * Verilen enlemde denizin derinliği, metre.
 *
 * Ada ile yarımadanın genliği bu sayıdan türüyor, elle yazılmıyor: sabit bir
 * genlik derin yerde suyun altında kalıyor, sığ yerde koca bir dağ oluyordu —
 * ada sorusunun haritasında ada görünmüyordu. Kural şu: yükselti derinliğin
 * yaklaşık iki katı, yani kara deniz seviyesinin üstüne **her zaman** çıkıyor.
 */
function denizDerinligi(y: number): number {
  return Math.max(60, (y - KIYI) * DENIZ_EGIMI)
}

/** İşaret halkasının yarıçapı (0–1 ölçeğinde). */
const ISARET_YARICAPI = 0.13

type ZorlukAyari = {
  sekiller: YerSekli[]
  /** Sorulan şeklin dışında haritaya konan şekil sayısı. */
  dekor: number
  /** İki izohips arasındaki yükselti farkı, metre. */
  aralik: number
  /** Kaç eğride bir yükselti yazılıyor. */
  etiketAdimi: number
}

/**
 * Zorluk, haritanın kalabalığı ve okunurluğu demek.
 *
 * Kolay haritada tek bir şekil ve her eğride yazan yükselti var: soru "bu
 * çizim ne" sorusuna iniyor. Zor haritada eğri aralığı yarıya iniyor, sayılar
 * seyrekleşiyor ve ekranda dört şekil birden duruyor — aranan şeklin
 * ötekilerden ayırt edilmesi gerekiyor.
 *
 * Şekiller de zorlukla açılıyor: kıyı şekilleri ve eğim karşılaştırmaları
 * kolayda hiç çıkmıyor, çünkü ikisi de haritanın başka bir yerine bakmayı
 * gerektiriyor.
 */
const AYAR: Record<Zorluk, ZorlukAyari> = {
  kolay: { sekiller: ['tepe', 'cukur', 'vadi', 'sirt'], dekor: 1, aralik: 100, etiketAdimi: 1 },
  orta: {
    sekiller: ['tepe', 'cukur', 'vadi', 'sirt', 'boyun', 'dik-yamac', 'koy', 'yarimada'],
    dekor: 2,
    aralik: 100,
    etiketAdimi: 2,
  },
  zor: {
    sekiller: [
      'tepe',
      'cukur',
      'vadi',
      'sirt',
      'boyun',
      'dik-yamac',
      'yatik-yamac',
      'plato',
      'ada',
      'yarimada',
      'koy',
    ],
    dekor: 3,
    aralik: 100,
    etiketAdimi: 2,
  },
}

/**
 * Bölgesel eğimin şiddeti — haritanın bir ucundan ötekine metre farkı.
 *
 * Eğim vadi ve sırt için **şart**: düz bir zeminde ikisi de kapalı halkaya
 * dönüyor ve birbirinden ayrılamıyorlar. Ama plato ile yamaç sorularında aynı
 * eğim sorunun cevabını bozuyordu: platonun düz tepesi bölgesel eğim yüzünden
 * iki üç izohipsle kesiliyor ("eğrisiz düzlük" görünmüyor), yamaçta da
 * izohips sıklığını basamağın değil zeminin belirlemesi mümkün oluyordu.
 * Onlarda zemin neredeyse düz.
 */
function bolgeselEgim(sekil: YerSekli, rastgele: () => number): number {
  if (sekil === 'plato') return arasinda(80, 130, rastgele)
  if (sekil === 'dik-yamac' || sekil === 'yatik-yamac') return arasinda(180, 260, rastgele)
  // Boyun bir eyer: iki doruk arasındaki geçit. Dik bir zemin eyeri yana
  // yatırıyor ve geçit "iki yönde yukarı, iki yönde aşağı" olmaktan çıkıyordu.
  if (sekil === 'boyun') return arasinda(250, 350, rastgele)
  return arasinda(500, 700, rastgele)
}

/**
 * Karşıt yamacın yeri — eğim ekseni boyunca, hedeften uzakta.
 *
 * Rastgele bir yer yetmiyordu: basamak katmanının dik kuşağı bir **çizgi** ve
 * çizgi haritayı baştan başa geçiyor. İki yamacın merkezi birbirinden uzak
 * olsa bile, aradaki uzaklık eğime **dik** yöndeyse iki kuşak üst üste
 * biniyor ve dik kuşak yatık yamacın halkasının içinden geçiyordu — soru
 * "yatık yamaç" derken daire içinde haritanın en sık izohipsleri duruyordu.
 * Kaydırma bu yüzden eğim ekseni boyunca.
 */
function karsitYamacinYeri(
  [cx, cy]: [number, number],
  [ex, ey]: [number, number],
): [number, number] {
  const boy = Math.hypot(ex, ey) || 1
  const uzaklik = 0.32
  const aday: [number, number] = [cx + (ex / boy) * uzaklik, cy + (ey / boy) * uzaklik]
  // Kutunun dışına taşarsa ters yöne kaydırılıyor; kuşak yine ayrı kalıyor.
  if (aday[0] < 0.1 || aday[0] > 0.9 || aday[1] < 0.1 || aday[1] > 0.9) {
    return [cx - (ex / boy) * uzaklik, cy - (ey / boy) * uzaklik]
  }
  return aday
}

/**
 * Dekorların sorulan şekle en az uzaklığı.
 *
 * Plato geniş bir şekil: yarıçapı işaret halkasının iki katı. Varsayılan eşik
 * ötekiler için yeterli, orada değil.
 */
function dekorUzakligi(sekil: YerSekli): number {
  return sekil === 'plato' ? ISARET_YARICAPI * 3.6 : ISARET_YARICAPI * 3
}

/** Denizle birlikte çizilen şekiller. */
const KIYI_SEKILLERI: YerSekli[] = ['ada', 'yarimada', 'koy']

export function denizliMi(sekil: YerSekli): boolean {
  return KIYI_SEKILLERI.includes(sekil)
}

/** Yeni bir soru — tohum burada atılıyor, harita çizilirken değil. */
export function soruUret(zorluk: Zorluk, rastgele: () => number = Math.random): IzohipsSorusu {
  const sekiller = AYAR[zorluk].sekiller
  return {
    tohum: Math.floor(rastgele() * 0xffffffff),
    zorluk,
    sekil: sekiller[Math.floor(rastgele() * sekiller.length)],
  }
}

export function siklariKur(
  soru: IzohipsSorusu,
  rastgele: () => number = Math.random,
): IzohipsSikki[] {
  return secenekleriKur(
    soru.sekil,
    [soru.sekil, ...KARISTIRILAN[soru.sekil]],
    (sekil) => SEKIL_ADI[sekil],
    rastgele,
  )
}

/** Turun soruları — her biri kendi tohumuyla. */
export function turHazirla(
  zorluk: Zorluk,
  adet: number,
  rastgele: () => number = Math.random,
): IzohipsOyunSorusu[] {
  const sorular: IzohipsOyunSorusu[] = []
  for (let i = 0; i < adet; i++) {
    const soru = soruUret(zorluk, rastgele)
    sorular.push({ soru, siklar: siklariKur(soru, rastgele) })
  }
  return sorular
}

// ---------------------------------------------------------------------------
// Şekillerin kendisi
// ---------------------------------------------------------------------------

type Ozellik = {
  katmanlar: Katman[]
  /** İşaretin merkezi (0–1). */
  merkez: [number, number]
}

/**
 * Bir şekli haritaya koyar.
 *
 * `egim` bölgesel eğimin yönü: vadi ve sırt bu yöne göre kuruluyor. Vadi
 * eğimin **indiği** yöne uzanır — akarsu yokuş aşağı akar ve izohipsler bu
 * yüzden yukarı doğru sivrilir. Yön rastgele verilseydi bazı haritalarda vadi
 * ile sırt aynı çizime düşerdi.
 */
function sekliKur(
  sekil: YerSekli,
  merkez: [number, number],
  egim: [number, number],
  rastgele: () => number,
): Ozellik {
  const [cx, cy] = merkez
  const [ex, ey] = egim
  // Eğimin indiği yön (birim); vadi ve sırt bu eksene oturuyor.
  const boy = Math.hypot(ex, ey) || 1
  const ux = ex / boy
  const uy = ey / boy

  switch (sekil) {
    case 'tepe':
      return {
        katmanlar: [tumsek(cx, cy, arasinda(500, 700, rastgele), arasinda(0.11, 0.14, rastgele))],
        merkez,
      }
    case 'cukur':
      return {
        katmanlar: [tumsek(cx, cy, -arasinda(450, 600, rastgele), arasinda(0.1, 0.125, rastgele))],
        merkez,
      }
    case 'vadi': {
      const uzunluk = 0.22
      return {
        katmanlar: [
          seritTumsegi(
            cx - ux * uzunluk,
            cy - uy * uzunluk,
            cx + ux * uzunluk,
            cy + uy * uzunluk,
            -arasinda(240, 340, rastgele),
            arasinda(0.055, 0.075, rastgele),
          ),
        ],
        merkez,
      }
    }
    case 'sirt': {
      const uzunluk = 0.22
      return {
        katmanlar: [
          seritTumsegi(
            cx - ux * uzunluk,
            cy - uy * uzunluk,
            cx + ux * uzunluk,
            cy + uy * uzunluk,
            arasinda(300, 420, rastgele),
            arasinda(0.06, 0.085, rastgele),
          ),
        ],
        merkez,
      }
    }
    case 'boyun': {
      // İki doruk, aralarında geçit. Eksen eğime **dik**: boyun böyle
      // kurulduğunda geçidin iki yanı da yokuş aşağı iniyor.
      const ax = -uy
      const ay = ux
      const uzak = arasinda(0.14, 0.16, rastgele)
      const genlik = arasinda(480, 600, rastgele)
      return {
        katmanlar: [
          tumsek(cx + ax * uzak, cy + ay * uzak, genlik, 0.105),
          tumsek(cx - ax * uzak, cy - ay * uzak, genlik * 0.92, 0.105),
        ],
        merkez,
      }
    }
    case 'dik-yamac':
      return {
        katmanlar: [basamak(cx, cy, ux, uy, arasinda(420, 520, rastgele), 0.022)],
        merkez,
      }
    case 'yatik-yamac':
      return {
        katmanlar: [basamak(cx, cy, ux, uy, arasinda(200, 260, rastgele), 0.22)],
        merkez,
      }
    case 'plato':
      // Düzlüğün yarıçapı işaret halkasından geniş: halkanın içinde yalnızca
      // düzlük kalıyor, kenardaki sık eğriler dışarıda duruyor.
      return {
        katmanlar: [masa(cx, cy, arasinda(450, 560, rastgele), 0.2, 0.09)],
        merkez,
      }
    case 'ada':
      /*
        Ada dar ve kıyıdan uzak.

        İlk sürümde geniş bir tümsekti ve kıyıya yakın duruyordu: çan eğrisinin
        kuyruğu deniz tabanını kıyıya kadar kaldırıyor, ada karaya yapışıp
        yarımadaya dönüşüyordu. Sorulan şekil ada, çizilen şekil yarımada
        olduğu için cevap da yanlış oluyordu.
      */
      return {
        katmanlar: [
          tumsek(
            cx,
            cy,
            denizDerinligi(cy) * arasinda(2, 2.3, rastgele),
            arasinda(0.06, 0.075, rastgele),
          ),
        ],
        merkez,
      }
    case 'yarimada':
      // Karadan denize uzanan sırt; işaret ucunda duruyor.
      return {
        katmanlar: [
          seritTumsegi(
            cx,
            KIYI - 0.12,
            cx,
            cy + 0.04,
            denizDerinligi(cy + 0.04) * arasinda(1.8, 2.1, rastgele),
            0.06,
          ),
        ],
        merkez,
      }
    case 'koy':
      // Kıyıyı karaya doğru içeri çeken çukurluk.
      return {
        katmanlar: [tumsek(cx, KIYI - 0.01, -arasinda(480, 560, rastgele), 0.068)],
        merkez,
      }
  }
}

/**
 * Dekor şekilleri — sorulanın dışındakiler.
 *
 * Sorulanla **aynı** şekil dekor olarak konmuyor: haritada iki tepe varsa ve
 * biri daire içindeyse soru hâlâ doğru cevaplanıyor ama "hangisi sorulmuş"
 * belirsizliği okumayı zorlaştırıyor, üstelik hiçbir şey öğretmiyor.
 */
function dekorSecenekleri(hedef: YerSekli, denizli: boolean): YerSekli[] {
  /*
    Dekorlar hep **yerel** şekiller.

    Yamaçlar listede yok: basamak katmanı haritanın bir yanını bütünüyle
    kaldırıyor ve uzaktaki bir şeklin izohips sıklığını da değiştiriyor. Yamaç
    yalnızca sorulan şekilse haritaya giriyor, o zaman da karşıtıyla birlikte
    (`haritaCiz`).

    Denizli haritada liste iyice daralıyor — tepe ve boyun, ikisi de birer çan
    eğrisi. Ötekiler denizi bozuyordu: vadi ile sırt eğim ekseni boyunca
    haritanın üçte birine uzanıyor ve karadan denize taşıp kıyıyı içeri
    çekiyor, hatta sorulan adayı karaya bağlıyordu; vadi ve çukur ise karada
    deniz seviyesinin **altına** inip göl açıyor, kıyıyı sütun sütun tarayan
    `denizCokgeni` de gölü denizin devamı sanıp aradaki karayı suya
    boğuyordu.
  */
  const kara: YerSekli[] = ['tepe', 'cukur', 'vadi', 'sirt', 'boyun']
  // Platonun yanında boyun da yok: boyun iki tepeden oluşuyor ve tepelerinden
  // biri dekorun merkezinden 0,15 kadar öteye düşüyor, yani ölçülen uzaklığın
  // dışına taşıp düzlüğü eğiyordu.
  const havuz: YerSekli[] =
    denizli ? ['tepe', 'boyun'] : hedef === 'plato' ? kara.filter((s) => s !== 'boyun') : kara
  return havuz.filter((s) => s !== hedef)
}

// ---------------------------------------------------------------------------
// Çizim
// ---------------------------------------------------------------------------

export type IzohipsCizimi = {
  en: number
  boy: number
  /** İzohipsler, alçaktan yükseğe. */
  egriler: { yukselti: number; yol: string }[]
  /** Yükselti yazıları. */
  etiketler: { x: number; y: number; metin: string }[]
  /** Denizin çokgeni; denizsiz haritada `null`. */
  deniz: string | null
  /** Denizin içinde kalan karalar (adalar) — denizin üstüne çiziliyor. */
  adalar: string[]
  /** Sorulan yeri gösteren halka. */
  isaret: { x: number; y: number; r: number }
  aralik: number
}

/** Izgara çözünürlüğü — eğrilerin pürüzsüzlüğü buradan geliyor. */
const IZGARA_X = 150
const IZGARA_Y = 110

/**
 * Sorunun yükselti alanı — çizimden **önceki** hâli.
 *
 * Ayrı bir fonksiyon çünkü sorunun doğruluğu buradan denetleniyor
 * (`izohips.test.ts`): "tepe" sorulan haritada halkanın merkezi çevresindeki
 * her yönden yüksek mi, "kapalı çukur"da alçak mı, "ada"nın çevresi deniz mi?
 * Eğrilere bakarak bunları ölçmek zor, alana bakarak kolay — ve asıl güvence
 * bu: soruyu üreten kod ile cevabı veren kod aynı yerden besleniyor.
 */
export function yukseltiAlani(soru: IzohipsSorusu): {
  alan: (x: number, y: number) => number
  /** İşaretin merkezi (0–1 ölçeğinde). */
  merkez: [number, number]
  /** Bölgesel eğimin yönü; vadi ve sırt bu eksene göre kuruluyor. */
  egim: [number, number]
  /** İşaret halkasının yarıçapı (0–1 ölçeğinde). */
  yaricap: number
} {
  const rastgele = uretec(soru.tohum)
  const ayar = AYAR[soru.zorluk]
  const denizli = denizliMi(soru.sekil)

  const katmanlar: Katman[] = []

  /*
    Zemin.

    Denizli haritada zemin kıyıdan yukarı yükselen bir düzlem: deniz seviyesi
    (0 m) tek bir yerde, aşağıda kalıyor. Denizsiz haritada zemin hafif eğimli
    bir yüzey — eğim şart, çünkü vadi ile sırt ancak bir yamaç üzerinde
    ayrışıyor: düz bir zeminde ikisi de kapalı halkaya dönerdi.
  */
  let egim: [number, number]
  if (denizli) {
    egim = [0, 1]
    katmanlar.push((_x, y) => (KIYI - y) * DENIZ_EGIMI)
    // Kıyı düz bir çizgi olmasın diye çok yayvan bir dalga: gerçek kıyılar
    // cetvelle çizilmiş gibi durmuyor.
    const evre = arasinda(0, Math.PI * 2, rastgele)
    katmanlar.push((x) => Math.sin(x * 4 + evre) * 28)
  } else {
    const aci = arasinda(0, Math.PI * 2, rastgele)
    egim = [Math.cos(aci), Math.sin(aci)]
    const siddet = bolgeselEgim(soru.sekil, rastgele)
    katmanlar.push((x, y) => 700 + (egim[0] * (x - 0.5) + egim[1] * (y - 0.5)) * siddet)
  }

  // --- Sorulan şekil ---
  const hedefMerkez = hedefinYeri(soru.sekil, rastgele)
  const hedef = sekliKur(soru.sekil, hedefMerkez, egim, rastgele)
  katmanlar.push(...hedef.katmanlar)

  /*
    Eğim soruları karşılaştırmalı: dik yamaç sorulduğunda haritada bir de
    yatık yamaç duruyor (ve tersi). Tek bir yamaçla "dik mi" sorusunun neye
    göre sorulduğu belli olmazdı — izohipsin sıklığı ancak başka bir yerle
    kıyaslanınca anlam taşıyor.
  */
  if (soru.sekil === 'dik-yamac' || soru.sekil === 'yatik-yamac') {
    const karsit: YerSekli = soru.sekil === 'dik-yamac' ? 'yatik-yamac' : 'dik-yamac'
    katmanlar.push(...sekliKur(karsit, karsitYamacinYeri(hedefMerkez, egim), egim, rastgele).katmanlar)
  }

  /*
    Dekorlar.

    Yamaç sorularında hiç yok: soru "bu yamaç dik mi yatık mı" değil, "bu yer
    haritanın geri kalanına göre dik mi" demek ve karşılaştırma ancak
    kıyaslanacak şey belliyken kurulabiliyor. Haritaya tepe konduğunda
    tepelerin yamacı ikisinden de dik oluyor, "en sık izohipsler" oraya kayıyor
    ve doğru cevap tartışmalı hâle geliyordu. Ekranda yalnızca iki yamaç var:
    biri dik, biri yatık.
  */
  const yamacSorusu = soru.sekil === 'dik-yamac' || soru.sekil === 'yatik-yamac'
  const dekorSayisi = yamacSorusu ? 0 : ayar.dekor
  const secenekler = dekorSecenekleri(soru.sekil, denizli)
  const kullanilanYerler: [number, number][] = [hedefMerkez]
  for (let i = 0; i < dekorSayisi; i++) {
    const yer = uzakYer(hedefMerkez, rastgele, kullanilanYerler, denizli, dekorUzakligi(soru.sekil))
    if (!yer) break
    kullanilanYerler.push(yer)
    const sekil = secenekler[Math.floor(rastgele() * secenekler.length)]
    katmanlar.push(...sekliKur(sekil, yer, egim, rastgele).katmanlar)
  }

  return {
    alan: (x, y) => {
      let toplam = 0
      for (const katman of katmanlar) toplam += katman(x, y)
      return toplam
    },
    merkez: hedef.merkez,
    egim,
    yaricap: ISARET_YARICAPI,
  }
}

/**
 * Soruyu haritaya çevirir.
 *
 * Saf ve tohuma bağlı: aynı soru her çağrıda aynı haritayı veriyor. Bileşen
 * yalnızca döndürülen yolları çiziyor — çizim kararları (hangi eğri, nerede
 * etiket, halka nerede) burada, React'in dışında duruyor ve test edilebiliyor.
 */
export function haritaCiz(soru: IzohipsSorusu): IzohipsCizimi {
  const { alan, merkez } = yukseltiAlani(soru)
  return cizimeDok(alan, merkez, AYAR[soru.zorluk], denizliMi(soru.sekil))
}

/**
 * Sorulan şeklin yeri.
 *
 * Kıyı şekilleri kıyının yakınına, ötekiler haritanın ortasına yakın bir yere
 * konuyor: kenara yapışan bir şeklin yarısı haritanın dışında kalır ve daire
 * içine alınan alan yarım görünürdü.
 */
function hedefinYeri(sekil: YerSekli, rastgele: () => number): [number, number] {
  if (sekil === 'ada') return [arasinda(0.28, 0.72, rastgele), KIYI + arasinda(0.22, 0.3, rastgele)]
  if (sekil === 'yarimada') return [arasinda(0.3, 0.7, rastgele), KIYI + arasinda(0.1, 0.15, rastgele)]
  // Koyun işareti kıyının **karaya** düşen tarafında: girinti orada, açık
  // denizde değil.
  if (sekil === 'koy') return [arasinda(0.3, 0.7, rastgele), KIYI - arasinda(0.03, 0.07, rastgele)]
  return [arasinda(0.32, 0.68, rastgele), arasinda(0.32, 0.68, rastgele)]
}

/**
 * İşaretten uzak bir yer.
 *
 * Uzaklık kuralı sorunun cevabını koruyan şey: bir dekor daire içine girerse
 * halkada iki şekil birden görünür ve sorunun tek doğru cevabı kalmaz. Eşik
 * halkanın yarıçapının iki katından geniş.
 */
function uzakYer(
  hedef: [number, number],
  rastgele: () => number,
  kullanilan: [number, number][] = [hedef],
  denizli = false,
  /**
   * Sorulan şeklin kapladığı yer.
   *
   * Plato için ayrıca veriliyor: düzlüğün yarıçapı halkadan geniş ve varsayılan
   * eşikle konan dekor tepesi düzlüğün kenarına oturuyor, halkalarını halkanın
   * içine sokuyordu — "eğrisiz düzlük" diye sorulan yerde üç izohips vardı.
   */
  enAzUzaklik = ISARET_YARICAPI * 3,
): [number, number] {
  // Denizli haritada dekorlar kıyının karasında: denize konan bir tepe ada
  // olurdu ve sorulan şekille karışırdı.
  const enBuyukY = denizli ? KIYI - 0.12 : 0.78
  for (let deneme = 0; deneme < 60; deneme++) {
    const aday: [number, number] = [
      arasinda(0.18, 0.82, rastgele),
      arasinda(0.14, enBuyukY, rastgele),
    ]
    if (kullanilan.every(([x, y]) => Math.hypot(aday[0] - x, aday[1] - y) >= enAzUzaklik)) {
      return aday
    }
  }
  return [hedef[0] > 0.5 ? 0.2 : 0.8, hedef[1] > 0.5 ? 0.2 : Math.min(0.8, enBuyukY)]
}

/** Yükselti alanını eğrilere, etiketlere ve çokgenlere çevirir. */
function cizimeDok(
  alan: (x: number, y: number) => number,
  isaretMerkezi: [number, number],
  ayar: ZorlukAyari,
  denizli: boolean,
): IzohipsCizimi {
  // Izgara bir kez hesaplanıyor: her seviye için alanı yeniden örneklemek
  // aynı işi on kez yapmak olurdu.
  const izgara: number[][] = []
  for (let j = 0; j <= IZGARA_Y; j++) {
    const satir: number[] = []
    for (let i = 0; i <= IZGARA_X; i++) satir.push(alan(i / IZGARA_X, j / IZGARA_Y))
    izgara.push(satir)
  }

  let enAz = Infinity
  let enCok = -Infinity
  for (const satir of izgara) {
    for (const deger of satir) {
      if (deger < enAz) enAz = deger
      if (deger > enCok) enCok = deger
    }
  }

  const egriler: IzohipsCizimi['egriler'] = []
  const etiketler: IzohipsCizimi['etiketler'] = []
  const adalar: string[] = []
  const konulanEtiketler: [number, number][] = []

  // Deniz seviyesinin altında izohips çizilmiyor: harita kara haritası, deniz
  // yalnızca kıyıyı okutmak için var.
  const ilk = Math.ceil(Math.max(enAz, denizli ? 0 : enAz) / ayar.aralik) * ayar.aralik
  let sira = 0
  for (let seviye = ilk; seviye < enCok; seviye += ayar.aralik) {
    const yollar = seviyeEgrileri(izgara, seviye)
    for (const yol of yollar) {
      egriler.push({ yukselti: seviye, yol: yolaCevir(yol.noktalar, yol.kapali) })
      // Deniz seviyesindeki kapalı halkalar ada demek: denizin içinde kalan
      // kara. Denizin üstüne ayrıca boyanıyorlar, yoksa mavinin altında
      // kaybolurlardı.
      if (denizli && seviye === 0 && yol.kapali) {
        adalar.push(yolaCevir(yol.noktalar, true))
      }
    }
    if (sira % ayar.etiketAdimi === 0 && yollar.length > 0) {
      /*
        Etiketlenecek eğri, işarete **en yakın** olan.

        En uzun eğri seçiliyordu ve seviyenin sayısı çoğu zaman haritanın öbür
        ucuna düşüyordu: daire içindeki halkaların hiçbirinde sayı olmuyor,
        tepe ile çukur ayrılamıyordu.
      */
      const yakinYol = yollar.reduce((a, b) =>
        egrininUzakligi(a.noktalar, isaretMerkezi) <= egrininUzakligi(b.noktalar, isaretMerkezi)
          ? a
          : b,
      )
      const nokta = etiketYeri(yakinYol.noktalar, isaretMerkezi, konulanEtiketler)
      if (nokta) {
        konulanEtiketler.push(nokta)
        etiketler.push({
          x: nokta[0] * HARITA_EN,
          y: nokta[1] * HARITA_BOY,
          metin: `${Math.round(seviye)}`,
        })
      }
    }
    sira++
  }

  return {
    en: HARITA_EN,
    boy: HARITA_BOY,
    egriler,
    etiketler,
    deniz: denizli ? denizCokgeni(izgara) : null,
    adalar,
    isaret: {
      x: isaretMerkezi[0] * HARITA_EN,
      y: isaretMerkezi[1] * HARITA_BOY,
      // Halka yatay ölçeğe göre; dikeyde ezilmiş bir elips olsaydı "daire
      // içine alınan alan" cümlesi haritayla çelişirdi.
      r: ISARET_YARICAPI * HARITA_EN,
    },
    aralik: ayar.aralik,
  }
}

/** Bir eğrinin işarete en yakın noktasının uzaklığı. */
function egrininUzakligi(noktalar: [number, number][], isaret: [number, number]): number {
  let enYakin = Infinity
  const adim = Math.max(1, Math.floor(noktalar.length / 40))
  for (let i = 0; i < noktalar.length; i += adim) {
    enYakin = Math.min(enYakin, Math.hypot(noktalar[i][0] - isaret[0], noktalar[i][1] - isaret[1]))
  }
  return enYakin
}

/**
 * Bir yükselti yazısının yeri — yoksa `null`.
 *
 * Yazı **sorulan şeklin yanına** konuyor, uzağına değil. İlk sürüm tersini
 * yapıyordu (halkadan olabildiğince uzak) ve soruyu cevaplanamaz hâle
 * getiriyordu: tepe ile kapalı çukurun çizimi birebir aynı, ayıran tek şey
 * yükseltinin içe doğru artıp azalması. Halkanın çevresindeki eğrilerde sayı
 * yoksa öğrenci ekranın öbür ucundaki bir eğriden başlayıp halkaları tek tek
 * saymak zorunda kalıyor — TYT'deki haritalarda da sayılar şeklin üstünde
 * duruyor.
 *
 * İki kural kalıyor: yazı haritanın kenarına yapışmıyor (yarısı kırpılırdı) ve
 * öteki yazılardan uzak duruyor ("300" ile "400" üst üste binince tek bir sayı
 * gibi okunuyordu).
 */
function etiketYeri(
  noktalar: [number, number][],
  isaret: [number, number],
  konulan: readonly [number, number][],
): [number, number] | null {
  const adim = Math.max(1, Math.floor(noktalar.length / 40))
  let enIyi: [number, number] | null = null
  let enYakin = Infinity

  for (let i = 0; i < noktalar.length; i += adim) {
    const [x, y] = noktalar[i]
    if (x < 0.06 || x > 0.94 || y < 0.06 || y > 0.94) continue
    // Sayılar birbirine 0,09'dan yakın duramıyor: yan yana gelen "600" ile
    // "1000" tek bir sayı gibi okunuyordu.
    if (konulan.some(([kx, ky]) => Math.hypot(x - kx, y - ky) < 0.09)) continue
    const uzaklik = Math.hypot(x - isaret[0], y - isaret[1])
    if (uzaklik < enYakin) {
      enYakin = uzaklik
      enIyi = [x, y]
    }
  }

  return enIyi
}

/**
 * Denizin çokgeni.
 *
 * Her sütunda yukarıdan aşağı inip suya ilk girilen yer bulunuyor; kıyı
 * çizgisi bu noktaların birleşimi, deniz de onun altında kalan alan. Genel bir
 * çokgen kesme algoritması yazmaya gerek yok çünkü zemin kıyıdan aşağı doğru
 * **tek yönde** iniyor (`haritaCiz`): denizin ikinci bir parçası olamıyor.
 * Adalar bu taramanın dışında kalıyor ve ayrıca çiziliyorlar.
 */
function denizCokgeni(izgara: number[][]): string | null {
  const noktalar: [number, number][] = []
  for (let i = 0; i <= IZGARA_X; i++) {
    let y: number | null = null
    for (let j = 0; j < IZGARA_Y; j++) {
      const ust = izgara[j][i]
      const alt = izgara[j + 1][i]
      if (ust >= 0 && alt < 0) {
        const t = ust / (ust - alt)
        y = (j + t) / IZGARA_Y
        break
      }
    }
    // Sütunun tamamı denizse kıyı en üstte, tamamı karaysa deniz yok sayılıyor.
    if (y === null) y = izgara[0][i] < 0 ? 0 : 1
    noktalar.push([i / IZGARA_X, y])
  }
  if (noktalar.every(([, y]) => y >= 1)) return null

  const yol = noktalar
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${(x * HARITA_EN).toFixed(1)},${(y * HARITA_BOY).toFixed(1)}`)
    .join(' ')
  return `${yol} L${HARITA_EN},${HARITA_BOY} L0,${HARITA_BOY} Z`
}

// ---------------------------------------------------------------------------
// Marching squares
// ---------------------------------------------------------------------------

type Egri = { noktalar: [number, number][]; kapali: boolean }

/**
 * Bir seviyenin eğrileri (marching squares).
 *
 * Her hücrede köşelerin seviyenin üstünde mi altında mı olduğuna bakılıyor;
 * çıkan doğru parçaları sonra uç uca ekleniyor. Eyer durumunda (çapraz iki
 * köşe üstte) hücrenin ortalaması hakem: yanlış bağlanan bir eyer iki ayrı
 * tepeyi tek eğriyle birleştirir ve harita yalan söylerdi.
 */
function seviyeEgrileri(izgara: number[][], seviye: number): Egri[] {
  const parcalar: [[number, number], [number, number]][] = []

  const ara = (
    x1: number,
    y1: number,
    d1: number,
    x2: number,
    y2: number,
    d2: number,
  ): [number, number] => {
    const t = (seviye - d1) / (d2 - d1)
    return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]
  }

  for (let j = 0; j < IZGARA_Y; j++) {
    for (let i = 0; i < IZGARA_X; i++) {
      const x0 = i / IZGARA_X
      const x1 = (i + 1) / IZGARA_X
      const y0 = j / IZGARA_Y
      const y1 = (j + 1) / IZGARA_Y
      const a = izgara[j][i]
      const b = izgara[j][i + 1]
      const c = izgara[j + 1][i + 1]
      const d = izgara[j + 1][i]

      const durum = (a > seviye ? 8 : 0) | (b > seviye ? 4 : 0) | (c > seviye ? 2 : 0) | (d > seviye ? 1 : 0)
      if (durum === 0 || durum === 15) continue

      const ust = (): [number, number] => ara(x0, y0, a, x1, y0, b)
      const sag = (): [number, number] => ara(x1, y0, b, x1, y1, c)
      const altKenar = (): [number, number] => ara(x0, y1, d, x1, y1, c)
      const sol = (): [number, number] => ara(x0, y0, a, x0, y1, d)

      switch (durum) {
        case 1:
        case 14:
          parcalar.push([sol(), altKenar()])
          break
        case 2:
        case 13:
          parcalar.push([altKenar(), sag()])
          break
        case 3:
        case 12:
          parcalar.push([sol(), sag()])
          break
        case 4:
        case 11:
          parcalar.push([ust(), sag()])
          break
        case 6:
        case 9:
          parcalar.push([ust(), altKenar()])
          break
        case 7:
        case 8:
          parcalar.push([sol(), ust()])
          break
        case 5:
        case 10: {
          const orta = (a + b + c + d) / 4
          const ayni = orta > seviye === (durum !== 5)
          if (ayni) {
            parcalar.push([sol(), ust()])
            parcalar.push([altKenar(), sag()])
          } else {
            parcalar.push([sol(), altKenar()])
            parcalar.push([ust(), sag()])
          }
          break
        }
      }
    }
  }

  return birlestir(parcalar)
}

const anahtar = ([x, y]: [number, number]): string => `${x.toFixed(6)},${y.toFixed(6)}`

/**
 * Doğru parçalarını eğrilere diker.
 *
 * Uçlar aynı kenardan aynı formülle hesaplandığı için birebir eşit çıkıyor;
 * anahtar da bu yüzden yuvarlanmış koordinat.
 *
 * Eşleştirme **yönsüz**: bir parçanın hangi ucunun baş olduğuna bakılmıyor,
 * uyan uç neredeyse oradan devam ediliyor. Yönlü bir dikiş de yazılabilirdi
 * ama marching squares parçaları hücreden hücreye ters yönde üretebiliyor ve
 * yön tutturmaya çalışan ilk sürüm eğrileri onlarca kırıntıya bölüyordu:
 * ekranda eş yükselti eğrisi yerine kesik kesik çizgiler vardı.
 *
 * Eğri iki yöne birden uzatılıyor, çünkü dikiş parçanın **ortasından**
 * başlayabiliyor: yalnızca ileri gidilseydi her eğri ikiye bölünürdü.
 */
function birlestir(parcalar: [[number, number], [number, number]][]): Egri[] {
  const uclar = new Map<string, number[]>()
  const kaydet = (nokta: [number, number], dizin: number) => {
    const k = anahtar(nokta)
    const liste = uclar.get(k)
    if (liste) liste.push(dizin)
    else uclar.set(k, [dizin])
  }
  for (let i = 0; i < parcalar.length; i++) {
    kaydet(parcalar[i][0], i)
    kaydet(parcalar[i][1], i)
  }

  const kullanildi = new Array(parcalar.length).fill(false)
  const egriler: Egri[] = []

  /** Uçtan devam eden kullanılmamış parçanın öteki ucu. */
  const devam = (uc: [number, number]): [number, number] | null => {
    const adaylar = uclar.get(anahtar(uc))
    if (!adaylar) return null
    for (const dizin of adaylar) {
      if (kullanildi[dizin]) continue
      const [basi, sonu] = parcalar[dizin]
      kullanildi[dizin] = true
      return anahtar(basi) === anahtar(uc) ? sonu : basi
    }
    return null
  }

  for (let i = 0; i < parcalar.length; i++) {
    if (kullanildi[i]) continue
    kullanildi[i] = true
    const noktalar: [number, number][] = [parcalar[i][0], parcalar[i][1]]

    for (;;) {
      const sonraki = devam(noktalar[noktalar.length - 1])
      if (!sonraki) break
      noktalar.push(sonraki)
      if (anahtar(sonraki) === anahtar(noktalar[0])) break
    }
    for (;;) {
      const onceki = devam(noktalar[0])
      if (!onceki) break
      noktalar.unshift(onceki)
      if (anahtar(onceki) === anahtar(noktalar[noktalar.length - 1])) break
    }

    const kapali =
      noktalar.length > 2 && anahtar(noktalar[noktalar.length - 1]) === anahtar(noktalar[0])
    /*
      Kısa eğriler atılıyor.

      On iki nokta, 150 sütunluk ızgarada avuç içi kadar bir halka demek:
      haritada eş yükselti eğrisi gibi değil mürekkep lekesi gibi duruyorlar.
      Çoğu da gerçek bir yer şekli değil, düzlüğe teğet geçen bir seviyenin
      bıraktığı kırıntı — platonun düz tepesinde beliren kıvrımlar böyleydi ve
      "eğrisiz düzlük" diye sorulan yeri eğrili gösteriyorlardı. Gerçek küçük
      şekiller (ada halkası ~70 nokta) bu eşiğin çok üstünde.
    */
    if (noktalar.length < 12) continue
    egriler.push({ noktalar, kapali })
  }

  return egriler
}

function yolaCevir(noktalar: [number, number][], kapali: boolean): string {
  const yol = noktalar
    .map(
      ([x, y], i) =>
        `${i === 0 ? 'M' : 'L'}${(x * HARITA_EN).toFixed(1)},${(y * HARITA_BOY).toFixed(1)}`,
    )
    .join(' ')
  return kapali ? `${yol} Z` : yol
}
