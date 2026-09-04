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
import { SINIFLAR, tani, YAZI_DISI, type Agirliklar } from './karakter-tani'

/** Bir yazı satırından okunanlar. */
export type SatirOkuma = {
  metin: string
  /** Satırdaki karakterlerin ortalama güveni; sıralamada kullanılıyor. */
  guven: number
}

/**
 * Bu güvenin altındaki karakter metne yazılmıyor.
 *
 * Yüksek tutmak akla yatkın geliyor ama ölçüldü ve **tersi** çıktı: elle
 * etiketlenmiş 27 satırda 0,60 eşiği 20, 0,40 eşiği 21, 0,25 eşiği 22 satır
 * veriyor. Sebebi, elemenin asıl işini artık güvenin yapmıyor olması: ders
 * adından sızan lekeleri ağın "diğer" sınıfı ile aşağıdaki boy ve genişlik
 * kuralları ayıklıyor. Geriye kalan yüksek eşik yalnızca doğru okunmuş ama
 * çekingen rakamları atıyordu ve bir satırdan tek karakterin düşmesi o satırı
 * kullanılamaz yapıyor.
 */
const GUVEN_ESIGI = 0.25

/**
 * Boşluk sayılan aralık, tipik karakter genişliğinin bu katı.
 *
 * "12D 6Y" ile "12D6Y" arasındaki fark bu: rakam kümeleri arasındaki boşluk
 * harfler arasındakinden belirgin biçimde geniş.
 *
 * Ölçü **yalnızca gerçek karakterlerden** alınıyor (`gercekler`); ders adının
 * ufak parçaları ile birbirine değmiş geniş lekeler ortalamayı iki yöne birden
 * bozuyordu ve eşik onunla ölçülüyordu. Düzeltildikten sonra 27 satırın
 * 0,55'te 20'si, 0,75'te 21'i okunuyor; 1,2'de 11'e düşüyor, çünkü o noktada
 * gerçek kümeler arasındaki boşluk da yutuluyor.
 */
const BOSLUK_ORANI = 0.75

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
 * Küme sonundaki kutuyu harfe çevirmek için gereken en az olasılık.
 *
 * Düşük tutuluyor çünkü burada ağa sorulan soru daralmış: kutunun bir harf
 * olduğunu kâğıdın biçimi zaten söylüyor, ağdan istenen tek şey üç harften
 * hangisi olduğu. Rakiplerini eleyen bilgi ağdan değil, sayfadan geliyor.
 */
const HARF_ESIGI = 0.05

/** Harfe çevrilecek kutunun satır boyuna oranı; altındakiler nokta sayılıyor. */
const TAM_BOY_ORANI = 0.6

/**
 * Bir kutunun okunması için gereken en az boy oranı.
 *
 * Cevap karakterleri satırın tam boyunda yazılıyor; ders adından artakalan
 * ufak parçalar değil. 27 satırda 0,45 → 18, 0,55 → 19, 0,75 → 16: dar bir
 * tepe, çünkü yükseldikçe gerçek rakamlar da elenmeye başlıyor.
 */
const EN_AZ_BOY_ORANI = 0.55

/**
 * Kutunun boyuna göre en fazla genişliği; üstü birleşmiş leke sayılıyor.
 *
 * En kazançlı tek kural: 1,0 → 21, 1,3 → 25, 1,8 → 24 satır. Ne rakam ne
 * B/D/Y boyundan belirgin biçimde geniş olabiliyor.
 */
const EN_GENIS_ORAN = 1.3

/**
 * Bir satırın okunması için sayfanın tipik yazı boyuna oranı.
 *
 * Puanı değiştirmiyor ama **uydurma satırı** kaldırıyor: fotoğraflardaki ilaç
 * kutusunun basılı logosu "7D" diye okunup olmayan bir sonuç üretiyordu. Boş
 * kutu, yanlış dolmuş kutudan iyi.
 */
const SAYFA_BOY_ORANI = 0.7

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
  const satirlar = karakterleriCikar(gri)
  if (satirlar.length === 0) return []

  /*
    Sayfanın el yazısından belirgin biçimde ufak satırlar hiç okunmuyor.
    Kâğıtta yazıdan başka basılı şeyler de var — bu fotoğraflarda bir ilaç
    kutusunun logosu — ve onlar da lekedir: ölçüldü, logo satırı "7D" diye
    okunup olmayan bir sonuç uyduruyordu. Basılı yazı el yazısının yanında
    küçük kalıyor ve bu, sınıflandırmadan bağımsız bir ayraç.
  */
  const boylar = satirlar.map((satir) => tipikKarakterBoyu(satir.karakterler.map((k) => k.kutu)))
  const sayfaBoyu = [...boylar].sort((a, b) => a - b)[boylar.length >> 1]

  return satirlar
    .filter((_, sira) => boylar[sira] >= sayfaBoyu * SAYFA_BOY_ORANI)
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

  const tipikBoy = tipikKarakterBoyu(kutular)
  // Genişlik ölçüsü yalnızca gerçek karakterlerden: ders adının ufak
  // parçaları ile "oğ" gibi birleşmiş geniş lekeler ortalamayı iki yöne birden
  // bozuyor ve boşluk eşiği onunla ölçülüyor.
  const gercekler = kutular.filter((k) => k.boy >= tipikBoy * EN_AZ_BOY_ORANI)
  const tipikEn = gercekler.reduce((t, k) => t + k.en, 0) / Math.max(1, gercekler.length)
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

    /*
      Alçak kutular atılıyor. Cevap karakterleri satırın tam boyunda yazılıyor;
      ders adından artakalan ufak parçalar ("ğ"nin şapkası, iki noktanın
      noktası, "i"nin noktası) ise değil ve onlar da kendinden emin biçimde
      rakam okunuyor — ölçüldü, "Din Kültürü: 2B 2D" satırı "6D 2B 2D"
      çıkıyordu. Boy, sınıftan bağımsız ve güvenilir bir ayraç.
    */
    if (kutu.boy < tipikBoy * EN_AZ_BOY_ORANI) continue
    /*
      Yatık kutular da atılıyor. Ne rakam ne B/D/Y enine yayılıyor; boyundan
      geniş bir leke ya birbirine değmiş iki ders adı harfi ya da altı çizili
      bir sözcüğün çizgisi. Ölçüldü: "Bilgisi:" kelimesinden 74×48'lik bir
      leke "4" okunup "5D" satırını "45D" yapıyordu.
    */
    if (kutu.en > kutu.boy * EN_GENIS_ORAN) continue
    if (tahmin.guven < GUVEN_ESIGI || tahmin.sinif === YAZI_DISI) continue
    okunanlar.push({
      karakter: tahmin.sinif,
      ayrik: oncekiSag === null || kutu.x - oncekiSag > tipikEn * BOSLUK_ORANI,
      olasilik: tahmin.olasilik,
      tamBoy: kutu.boy >= tipikBoy * TAM_BOY_ORANI,
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
  /** Sınıf olasılıkları; kümenin sonunu harfe çevirirken gerekiyor. */
  olasilik: Float32Array
  /**
   * Kutu, satırın tam boyuna yakın mı.
   *
   * B, D ve Y satırın tam boyunda yazılıyor; iki nokta üst üstenin noktası ya
   * da "ğ"nin şapkası değil. Kümenin sonunu harfe çevirirken bu ayrım şart:
   * o adım kutuya "harf olmak zorundasın" diyor ve küçük bir lekeye bunu
   * demek olmayan bir cevap uydurmak oluyor.
   */
  tamBoy: boolean
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
  let bitisik: Okunan[] = []

  const bosalt = (sonMu: boolean) => {
    kumeyeCevir(bitisik, kumeler, sonMu)
    bitisik = []
  }

  for (const okunan of okunanlar) {
    if (okunan.ayrik) bosalt(false)
    bitisik.push(okunan)
  }
  bosalt(true)

  return kumeler.join(' ')
}

/** Bitişik bir karakter dizisini kümelere ayırıp `kumeler`e ekler. */
function kumeyeCevir(bitisik: Okunan[], kumeler: string[], sonMu: boolean): void {
  const bulunan: string[] = []
  let rakamlar = ''

  for (const okunan of bitisik) {
    if (rakamMi(okunan.karakter)) {
      rakamlar += okunan.karakter
      continue
    }
    if (rakamlar !== '') bulunan.push(rakamlar + okunan.karakter)
    rakamlar = ''
  }

  /*
    Dizi harfsiz bitiyorsa son kutu büyük olasılıkla yanlış okunmuş bir
    harftir. Ölçüldü: kalın uçlu kalemde "1B" satırı "13", "4D" satırı "40"
    diye çıkıyor — çünkü tanıyıcı için kalın bir B ile 3, kalın bir D ile 0
    birbirine çok benziyor ve fark birkaç puan.

    Kâğıdın biçimi bu belirsizliği çözüyor: küme **her zaman** sayıyla başlar
    ve bir işaretle biter, "13" diye bir küme yoktur. O yüzden son kutuya en
    büyük sınıfı değil, en olası **harfi** soruyoruz. Yine de bedava değil:
    ders adından sızan harfler de rakam okunup küme uydurabiliyor, bu yüzden
    harfin kendi olasılığı `HARF_ESIGI`yi geçmeli.
  */
  const son = bitisik[bitisik.length - 1]
  if (rakamlar.length >= 2 && son.tamBoy) {
    const harf = enOlasiHarf(son.olasilik)
    if (harf !== null) bulunan.push(rakamlar.slice(0, -1) + harf)
  }

  /*
    Bitişik bir dizi birden çok küme veriyorsa o bir cevap değil, bir
    **kelimedir**. Ölçüldü: "Edebiyat" harfleri "6D8B" diye okunup iki küme
    çıkarıyor, "Din Kültürü" ise "6D" — oysa gerçek cevaplar arasında her
    zaman boşluk var, çünkü kâğıda "12D 6Y" diye yazılıyor, "12D6Y" diye
    değil. Tek kutu dizisinden iki küme çıkması, kutuların bir sözcüğün
    harfleri olduğunun işareti.

    Satırın **son** dizisi bu kuralın dışında: ders adı solda, cevap sağda ve
    sağda başka bir şey yoksa o dizi bir sözcük olamaz. Sıkışık yazılmış
    "3D 2B" ancak böyle kurtuluyor.
  */
  if (bulunan.length === 1 || sonMu) for (const kume of bulunan) kumeler.push(kume)
}

function rakamMi(karakter: string): boolean {
  return karakter >= '0' && karakter <= '9'
}

/** Kutunun en olası B/D/Y'si; hiçbiri eşiği geçmezse `null`. */
function enOlasiHarf(olasilik: Float32Array): string | null {
  let secilen: string | null = null
  let enBuyuk = HARF_ESIGI

  for (const harf of ['B', 'D', 'Y'] as const) {
    const p = olasilik[SINIFLAR.indexOf(harf)]
    if (p > enBuyuk) {
      enBuyuk = p
      secilen = harf
    }
  }

  return secilen
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

/**
 * Satırdaki gerçek karakterin tipik boyu.
 *
 * Düz ortanca işe yaramıyor: ders adı bir sürü ufak parçaya bölünüyor
 * ("Kültürü" tek başına on leke veriyor) ve sayıca onlar baskın çıkıp ortancayı
 * aşağı çekiyor. Mürekkeple ağırlıklandırınca ölçü, satırın yerini gerçekten
 * kaplayan lekelerden geliyor. Aynı hile `lib/karakter-ayir.ts` içinde de var.
 */
function tipikKarakterBoyu(kutular: Kutu[]): number {
  const sirali = [...kutular].sort((a, b) => a.boy - b.boy)
  const yari = sirali.reduce((t, k) => t + k.piksel, 0) / 2
  let birikim = 0
  for (const kutu of sirali) {
    birikim += kutu.piksel
    if (birikim >= yari) return kutu.boy
  }
  return sirali[sirali.length - 1].boy
}
