/**
 * Eşiklenmiş kâğıttan okunabilir satırlar üretir — saf, telefonsuz test
 * edilebilir.
 *
 * Zincirin son halkası: `lib/kagit-kirp.ts` kâğıdı buluyor,
 * `lib/goruntu-esikle.ts` siyah-beyaza indiriyor, `lib/karakter-ayir.ts`
 * lekeleri çıkarıyor, `lib/karakter-tani.ts` her lekeye bir harf diyor.
 * Burası onları satır satır metne diziyor.
 *
 * ## Ne okunuyor, ne okunmuyor
 *
 * Tanıyıcı yalnızca **0-9, B, D, Y** biliyor. Ders adı okunmuyor ve okunması
 * da gerekmiyor: dersi kullanıcı uygulamada seçiyor, zor olan kısım sayılar.
 * Ders adının harfleri tanıyıcıdan "diğer" diye dönüyor ve metne girmiyor;
 * güven eşiğini geçemeyen karakterler de öyle.
 */

import type { Gri } from './goruntu-esikle'
import { ceyrekDondur } from './kagit-kirp'
import { karakterleriCikar, kareyeOturt, type Kutu, type Satir } from './karakter-ayir'
import { tani, YAZI_DISI, type Agirliklar } from './karakter-tani'

/** Bir yazı satırından okunanlar. */
export type SatirOkuma = {
  metin: string
  /** Satırdaki karakterlerin ortalama güveni; sıralamada kullanılıyor. */
  guven: number
}

/**
 * Bu güvenin altındaki karakter metne yazılmıyor.
 *
 * Yüksek tutmak akla yatkın geliyor ama ölçüldü ve **tersi** çıktı: 0,75'te
 * gerçek kâğıtlarda 26 satırın 7'si tam okunuyordu, 0,40'ta 12'si. Sebebi,
 * elemenin asıl işini artık eşiğin yapmıyor olması — ders adının harflerini
 * ağın kendi "diğer" sınıfı ayıklıyor (`lib/karakter-tani.ts`). Geriye kalan
 * yüksek eşik, doğru okunmuş ama telaffuzu çekingen rakamları atıyordu ve bir
 * satırdan tek karakterin düşmesi o satırı kullanılamaz yapıyor.
 *
 * Sıfır da değil: 0,40'ın altında sonuç değişmiyor, yani bu noktadan sonra
 * eşiğin attığı şey zaten ağın da inanmadığı bir tahmin.
 */
const GUVEN_ESIGI = 0.4

/**
 * Boşluk sayılan aralık, tipik karakter genişliğinin bu katı.
 *
 * "12D 6Y" ile "12D6Y" arasındaki fark bu: rakam kümeleri arasındaki boşluk
 * harfler arasındakinden belirgin biçimde geniş.
 */
const BOSLUK_ORANI = 0.55

/**
 * Bu orandan geniş kutu birden çok karakter taşıyor sayılıyor.
 *
 * Elle yazarken "20" bitişebiliyor ve tek leke oluyor; bölünmezse tanıyıcıya
 * iki rakamı birden gösterip tek cevap istemiş oluyoruz. Tek bir rakamın
 * genişliği boyunun kabaca yarısı ile dörtte üçü arası; 0,95'i aşan kutu
 * neredeyse hep birden çok karakter.
 */
const BOLME_ORANI = 0.95

/**
 * Kesim yerindeki mürekkep, kutu ortalamasının bu kadarının altında olmalı.
 *
 * Bölmeyi genişliğe bakarak yapmak yetmiyor: kalın kalemle yazılan bir "D"
 * ya da "0" da boyu kadar geniş çıkıyor ve ikiye kırpılıyordu — ölçüldü,
 * kalın kalemle yazılmış bir kâğıtta 71 lekenin yarısı yarım harfti ve
 * tanıyıcı hiçbirini okuyamadı. İki rakamın değdiği yerde mürekkep gerçekten
 * incelir; tek harfin ortasında incelmez.
 */
const VADI_ORANI = 0.45

/**
 * Kâğıttan satır satır metin; kâğıdın yönünü kendisi buluyor.
 *
 * Kâğıt her zaman düz tutulmuyor: elimizdeki dokuz gerçek fotoğrafın dördünde
 * yan duruyor ve yazı dikey akıyor. Satır gruplama yatay yazı varsaydığı için
 * o kâğıtlardan tek satır bile çıkmıyordu.
 *
 * Yön iki ucuz yoldan **bulunamıyor**, ikisi de denendi ve ölçüldü:
 *
 * - **Lekelerin dizilişi**: düz duran bir kâğıtta doğru eksen 45, yanlış
 *   eksen 47 puan aldı. Satır sayısı da satır uzunluğu da ayırt etmiyor.
 * - **Birkaç karakteri örnekleyip güvene bakmak**: ters duran bir rakam yine
 *   bir rakama benziyor (6 ile 9, 2 ile 2) ve ağ ona da güveniyor.
 *
 * Ayırt eden tek ölçü, tam okumadan çıkan **geçerli küme sayısı**: ters yönde
 * sayılarla işaretler bir araya gelmiyor ve küme kalmıyor. O yüzden üç yön de
 * baştan sona okunuyor.
 *
 * 180° denenmiyor: fotoğraf baş aşağı çekilmiyor, EXIF yönü de zaten
 * uygulanmış oluyor (`lib/deneme-ocr.ts`). Onu da denemek okumayı üçte bir
 * pahalılaştırıp hiçbir gerçek durumu kurtarmazdı.
 */
export function satirlariOku(gri: Gri, agirliklar: Agirliklar): SatirOkuma[] {
  // Eşitlikte düz duruş kazanıyor: kâğıtların çoğu düz ve bir yönü sırf
  // eşit puan aldı diye döndürmek için sebep yok.
  let enIyi: SatirOkuma[] = []
  let enIyiPuan = -1

  for (const ceyrek of [0, 1, 3]) {
    const okunanlar = ceyrekteOku(ceyrekDondur(gri, ceyrek), agirliklar)
    const puan = kumeSayisi(okunanlar)
    if (puan > enIyiPuan) {
      enIyiPuan = puan
      enIyi = okunanlar
    }
  }

  return enIyi
}

function ceyrekteOku(gri: Gri, agirliklar: Agirliklar): SatirOkuma[] {
  return karakterleriCikar(gri)
    .map((satir) => satiriOku(gri, satir, agirliklar))
    .filter((okuma) => okuma.metin !== '')
}

/** Okunan satırlardaki toplam "sayı + işaret" kümesi sayısı. */
function kumeSayisi(satirlar: SatirOkuma[]): number {
  return satirlar.reduce((toplam, satir) => toplam + satir.metin.split(' ').length, 0)
}

function satiriOku(gri: Gri, satir: Satir, agirliklar: Agirliklar): SatirOkuma {
  const kutular = satir.karakterler.flatMap((k) => genisleriBol(gri, k.kutu))
  if (kutular.length === 0) return { metin: '', guven: 0 }

  const tipikEn = kutular.reduce((t, k) => t + k.en, 0) / kutular.length
  const okunanlar: Okunan[] = []
  let guvenToplami = 0

  // Boşluk, bir önceki **kabul edilen** karaktere göre ölçülüyor. Kutu
  // sırasına göre ölçmek yanlış sonuç veriyordu: "12" ile "D" arasına düşen
  // ve elenen bir ders adı harfi ikisini bitişik gösteriyor, "1", "2" ve "D"
  // tek kümede birleşip "122D" çıkıyordu.
  let oncekiSag: number | null = null

  for (const kutu of kutular) {
    const tahmin = tani(kareyeOturt(gri, kutu), agirliklar)
    guvenToplami += tahmin.guven

    if (tahmin.guven < GUVEN_ESIGI || tahmin.sinif === YAZI_DISI) continue
    okunanlar.push({
      karakter: tahmin.sinif,
      ayrik: oncekiSag === null || kutu.x - oncekiSag > tipikEn * BOSLUK_ORANI,
    })
    oncekiSag = kutu.x + kutu.en
  }

  return {
    metin: kumeleriYaz(okunanlar),
    guven: guvenToplami / kutular.length,
  }
}

export type Okunan = {
  karakter: string
  /** Solundaki karakterden boşlukla ayrılmış mı. */
  ayrik: boolean
}

/**
 * Yalnızca **sayı + işaret** kümelerini yazar; gerisini atar.
 *
 * Ders adının harfleri de tanıyıcıdan geçiyor ve bir kısmı rakama benziyor:
 * ölçüldü, "Tar2: 5D 5Y" satırı "Y21 5D 5Y" diye çıkıyordu. Bu biçimde tek
 * başına bir harf ("Y") ya da arkasında işaret olmayan bir sayı ("21")
 * hiçbir şey söylemiyor — atmak, onlara bir anlam uydurmaktan iyi.
 *
 * Küme, bitişik rakamların ardından gelen bitişik bir B/D/Y: "12D". Araya
 * boşluk girerse ("7 D") ikisi ayrı sayılıyor ve ikisi de düşüyor.
 */
export function kumeleriYaz(okunanlar: Okunan[]): string {
  const kumeler: string[] = []
  let rakamlar = ''

  for (const okunan of okunanlar) {
    const rakamMi = okunan.karakter >= '0' && okunan.karakter <= '9'

    if (rakamMi) {
      rakamlar = okunan.ayrik ? okunan.karakter : rakamlar + okunan.karakter
      continue
    }

    if (rakamlar !== '' && !okunan.ayrik) kumeler.push(rakamlar + okunan.karakter)
    rakamlar = ''
  }

  return kumeler.join(' ')
}

/**
 * Geniş kutuyu, mürekkebin en inceldiği yerden böler.
 *
 * Kaç parçaya bölüneceği kutunun genişliğinden çıkıyor: tipik bir karakter
 * boyunun kabaca üçte ikisi kadar geniş. Bölme yeri, dikey mürekkep
 * profilinin en düşük olduğu sütun — iki rakamın değdiği yer.
 */
export function genisleriBol(gri: Gri, kutu: Kutu): Kutu[] {
  const parca = Math.round(kutu.en / (kutu.boy * 0.66))
  if (kutu.en <= kutu.boy * BOLME_ORANI || parca < 2) return [kutu]

  const profil = new Int32Array(kutu.en)
  for (let x = 0; x < kutu.en; x++) {
    let sayac = 0
    for (let y = 0; y < kutu.boy; y++) {
      if (gri.veri[(kutu.y + y) * gri.en + (kutu.x + x)] === 0) sayac++
    }
    profil[x] = sayac
  }

  /*
    Kesim yerinde gerçekten bir **vadi** olmalı.

    Genişlik tek başına yetmiyor: kalın kalemle yazılan bir "D" ya da "0" da
    boyu kadar geniş oluyor ve yalnızca orana bakan bir kural onları ikiye
    kırpıyordu — ağa yarım harfler gidiyordu. İki rakamın değdiği yerde
    mürekkep incelir; tek bir harfin ortasında incelmez.
  */
  const ortalamaMurekkep = profil.reduce((t, m) => t + m, 0) / kutu.en

  const kesimler: number[] = []
  for (let i = 1; i < parca; i++) {
    // Kesim, eşit bölünmüş noktanın çevresinde aranıyor: profilin genel en
    // düşüğü kutunun ucuna kaçıyor ve orada bölmek karakteri kırpar.
    const hedef = Math.round((kutu.en * i) / parca)
    const pencere = Math.round(kutu.en / (parca * 3))
    let enIyi = hedef
    for (let x = Math.max(1, hedef - pencere); x <= Math.min(kutu.en - 2, hedef + pencere); x++) {
      if (profil[x] < profil[enIyi]) enIyi = x
    }
    if (profil[enIyi] > ortalamaMurekkep * VADI_ORANI) return [kutu]
    kesimler.push(enIyi)
  }

  const sinirlar = [0, ...kesimler, kutu.en]
  const kutular: Kutu[] = []
  for (let i = 0; i < sinirlar.length - 1; i++) {
    const en = sinirlar[i + 1] - sinirlar[i]
    if (en < 2) continue
    kutular.push(daralt(gri, { x: kutu.x + sinirlar[i], y: kutu.y, en, boy: kutu.boy, piksel: 0 }))
  }

  return kutular.length === 0 ? [kutu] : kutular
}

/** Kesilen parçanın çevresindeki boş şeridi atar. */
function daralt(gri: Gri, kutu: Kutu): Kutu {
  let solX = kutu.en
  let sagX = -1
  let ustY = kutu.boy
  let altY = -1
  let piksel = 0

  for (let y = 0; y < kutu.boy; y++) {
    for (let x = 0; x < kutu.en; x++) {
      if (gri.veri[(kutu.y + y) * gri.en + (kutu.x + x)] !== 0) continue
      piksel++
      if (x < solX) solX = x
      if (x > sagX) sagX = x
      if (y < ustY) ustY = y
      if (y > altY) altY = y
    }
  }

  if (sagX < 0) return kutu
  return {
    x: kutu.x + solX,
    y: kutu.y + ustY,
    en: sagX - solX + 1,
    boy: altY - ustY + 1,
    piksel,
  }
}
