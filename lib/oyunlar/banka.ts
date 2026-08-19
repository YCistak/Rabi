/**
 * Oyun Bankası — mini oyunlarda karıştırılan soruların biriktiği havuz.
 *
 * Fotoğraflı **Yanlış Soru Bankası**'ndan (`lib/resim-depo.ts`) bilerek ayrı:
 * o, kullanıcının kendi çektiği fotoğraflar; burası oyunların kendi soruları.
 * Metin olarak duruyorlar, o yüzden yeniden oynanabiliyorlar — fotoğrafa
 * bakmakla soruyu tekrar çözmek arasındaki fark bu.
 *
 * Kayıt kendi kendine yeter: soruyu ekrana çizmek ve doğrusunu bilmek için
 * gereken her şey içinde. Havuzdaki sıraya (indekse) bağlanmadı, çünkü havuza
 * yeni soru eklendiğinde bütün banka kayarrdı.
 */

import type { OyunId } from '../types'
import { ACI_KURALI_ADI, type AciSorusu } from './aci'
import type { IslemTuru } from './islem'
import type { NoktalamaIsareti, NoktalamaSorusu } from './noktalama-havuzu'
import { OLAY_ADI, type SesOlayi } from './ses-havuzu'
import { OGE_ADI, type OgeTuru } from './oge-havuzu'
import type { BolunmeTipi } from './bolunme'
import type { SozKonusu, SozTuru } from './soz-havuzu'
import { ucgenCevabi, ucgenKimligi, ucgenOzeti, kenarMetni, type UcgenSorusu } from './ucgen'
import { BOZUKLUK_ADI, type BozuklukTuru } from './anlatim-havuzu'
import { altSinir, ustSinir, type KokluSorusu } from './koklu'
import type { BiyolojiSorusu } from './biyoloji'
import type { OrganelSorusu } from './hucre-havuzu'

/** Bir kaydın bankadan düşmesi için gereken üst üste doğru sayısı. */
export const DUSME_ESIGI = 3

/**
 * Bankanın en fazla tutacağı kayıt.
 *
 * Sınırsız olsaydı aylar sonra yüzlerce kayıt birikir, "sadece bunlardan bir
 * tur" da rastgele bir tura dönerdi. Sınır aşılınca **en eski** kayıt düşer:
 * yeni yapılan hata, aylar önce yapılandan daha çok ilgi hak ediyor.
 */
export const BANKA_SINIRI = 100

export type BankaSorusu =
  | {
      oyun: 'yazim'
      dogru: string
      yanlis: string
      kural: string
      /**
       * Noktalama sorusuysa cümledeki iki işaret; yazım sorusunda yok.
       *
       * Aynı `oyun` kimliği altındalar çünkü ikisi de Yazım Ustası turunda
       * çıkıyor: banka turu oyuna göre açılıyor, ayrı kimlik verilseydi bu
       * kayıtlar bankada durur ama hiçbir turda tekrar sorulamazdı.
       */
      isaretler?: { yanlis: NoktalamaIsareti; dogru: NoktalamaIsareti }
    }
  | { oyun: 'islem'; islemTuru: IslemTuru; metin: string; sonuc: number }
  | { oyun: 'edebiyat'; eser: string; yazar: string }
  | { oyun: 'ses'; kelime: string; olusum: string; olay: SesOlayi }
  | { oyun: 'oge'; once: string; oge: string; sonra: string; ogeTuru: OgeTuru }
  // Cevap saklanmıyor, `sayi % bolen` ile hesaplanıyor: kayıtta duran bir
  // cevap sayıyla çelişebilirdi, türetilen cevap çelişemez.
  | { oyun: 'bolunme'; sayi: number; bolen: number; bolunmeTipi: BolunmeTipi }
  | { oyun: 'soz'; soz: string; anlam: string; sozTuru: SozTuru; konu: SozKonusu }
  /**
   * Geometri soruları sorunun kendisini olduğu gibi taşıyor.
   *
   * Ötekiler gibi alanlara açılmadılar çünkü ikisi de zaten küçük ve **kendi
   * şekillerini üretebilen** veri: `aciSekli`/`ucgenSekli` bu nesneden çizimi
   * yeniden kuruyor, bankaya koordinat yazmak gerekmiyor.
   */
  | { oyun: 'aci'; aci: AciSorusu }
  | { oyun: 'ucgen'; ucgen: UcgenSorusu }
  | { oyun: 'antlasma'; madde: string; antlasma: string }
  | { oyun: 'kavram'; kavram: string; tanim: string }
  | {
      oyun: 'anlatim'
      cumle: string
      duzeltme: string
      bozuklukTuru: BozuklukTuru
    }
  // Cevap saklanmıyor, √sayı'dan hesaplanıyor: kayıtta duran bir aralık
  // sayıyla çelişebilirdi, türetilen aralık çelişemez.
  | { oyun: 'koklu'; sayi: number }
  /**
   * Biyolojinin iki çoktan seçmeli oyunu tek dalda duruyor.
   *
   * Soru şekilleri birebir aynı (soru, doğru, üç çeldirici, açıklama); ayrı
   * dallar yazılsaydı aynı alanlar iki kez sıralanır ve her yeni alan iki
   * yerde birden güncellenmeyi beklerdi. Kimlik yine ayrı: banka turu oyuna
   * göre açıldığı için `oyun` alanı ikisini ayırmaya yetiyor.
   *
   * Soru nesnesi olduğu gibi taşınıyor — şıkları yeniden kurmak için hepsi
   * gerekiyor ve şıklar soruya ait, ortak bir listeden gelmiyor.
   */
  | { oyun: 'ortak' | 'siniflandirma'; biyoloji: BiyolojiSorusu }
  // İpuçları da kayıtta: banka turunda kart yeniden açılıyor ve ipuçları
  // olmadan oyun oynanamaz.
  | { oyun: 'hucre'; hucre: OrganelSorusu }

export type BankaKaydi = {
  /** Soru içeriğinden türetilen kimlik; aynı soru iki kez eklenmez. */
  id: string
  soru: BankaSorusu
  /** Kaç kez yanlış bilindi. "3 kez" rozeti bunu gösteriyor. */
  kacKez: number
  /** Üst üste kaç doğru. `DUSME_ESIGI`'ne ulaşınca kayıt bankadan çıkar. */
  ardisikDogru: number
  /** İlk eklenme (ISO tarih) — sınır aşılınca en eskisi düşsün diye. */
  eklenme: string
  /** Son yanlış bilinme tarihi (ISO). */
  sonYanlis: string
}

/** Bir turda verilen cevap; hem doğrular hem yanlışlar bankaya bildirilir. */
export type BankaCevabi = {
  soru: BankaSorusu
  dogruMu: boolean
}

// ---------------------------------------------------------------------------
// Oyunların kendi soru tiplerinden banka sorusuna çevirim
//
// Dönüştürücüler burada, oyun dosyalarında değil: banka üç oyunun da soru
// şeklini bilmek zorunda, ama oyunların bankayı bilmesine gerek yok.
// ---------------------------------------------------------------------------

export function yazimdanBanka(soru: {
  dogru: string
  yanlis: string
  kural: string
}): BankaSorusu {
  return { oyun: 'yazim', dogru: soru.dogru, yanlis: soru.yanlis, kural: soru.kural }
}

export function noktalamadanBanka(soru: NoktalamaSorusu): BankaSorusu {
  return {
    oyun: 'yazim',
    // Cümlenin doğru hâli "doğru cevap", hatalı hâli sorunun kendisi.
    dogru: soru.duzeltme,
    yanlis: soru.cumle,
    kural: soru.kural,
    isaretler: { yanlis: soru.yanlisIsaret, dogru: soru.dogruIsaret },
  }
}

export function islemdenBanka(soru: {
  tur: IslemTuru
  metin: string
  sonuc: number
}): BankaSorusu {
  return { oyun: 'islem', islemTuru: soru.tur, metin: soru.metin, sonuc: soru.sonuc }
}

export function edebiyattanBanka(es: { eser: string; yazar: string }): BankaSorusu {
  return { oyun: 'edebiyat', eser: es.eser, yazar: es.yazar }
}

export function sestenBanka(soru: {
  kelime: string
  olusum: string
  olay: SesOlayi
}): BankaSorusu {
  return { oyun: 'ses', kelime: soru.kelime, olusum: soru.olusum, olay: soru.olay }
}

export function sozdenBanka(soru: {
  soz: string
  anlam: string
  tur: SozTuru
  konu: SozKonusu
}): BankaSorusu {
  return { oyun: 'soz', soz: soru.soz, anlam: soru.anlam, sozTuru: soru.tur, konu: soru.konu }
}

export function ogedenBanka(soru: {
  once: string
  oge: string
  sonra: string
  tur: OgeTuru
}): BankaSorusu {
  return {
    oyun: 'oge',
    once: soru.once,
    oge: soru.oge,
    sonra: soru.sonra,
    ogeTuru: soru.tur,
  }
}

export function bolunmedenBanka(soru: {
  tip: BolunmeTipi
  sayi: number
  bolen: number
}): BankaSorusu {
  return { oyun: 'bolunme', sayi: soru.sayi, bolen: soru.bolen, bolunmeTipi: soru.tip }
}

export function acidanBanka(soru: AciSorusu): BankaSorusu {
  return { oyun: 'aci', aci: soru }
}

export function ucgendenBanka(soru: UcgenSorusu): BankaSorusu {
  return { oyun: 'ucgen', ucgen: soru }
}

export function antlasmadanBanka(es: { madde: string; antlasma: string }): BankaSorusu {
  return { oyun: 'antlasma', madde: es.madde, antlasma: es.antlasma }
}

export function kavramdanBanka(es: { kavram: string; tanim: string }): BankaSorusu {
  return { oyun: 'kavram', kavram: es.kavram, tanim: es.tanim }
}

export function anlatimdanBanka(soru: {
  cumle: string
  duzeltme: string
  tur: BozuklukTuru
}): BankaSorusu {
  return {
    oyun: 'anlatim',
    cumle: soru.cumle,
    duzeltme: soru.duzeltme,
    bozuklukTuru: soru.tur,
  }
}

export function kokludenBanka(soru: KokluSorusu): BankaSorusu {
  return { oyun: 'koklu', sayi: soru.sayi }
}

/** Oyun kimliği dışarıdan geliyor: aynı soru şeklini iki oyun paylaşıyor. */
export function biyolojidenBanka(
  oyun: 'ortak' | 'siniflandirma',
  soru: BiyolojiSorusu,
): BankaSorusu {
  return { oyun, biyoloji: soru }
}

export function hucredenBanka(soru: OrganelSorusu): BankaSorusu {
  return { oyun: 'hucre', hucre: soru }
}

/**
 * Kayıt kimliği.
 *
 * Soru metninden üretiliyor, rastgele değil: aynı kelimeyi ikinci kez
 * karıştırdığında yeni kayıt açılmamalı, mevcut kaydın sayacı artmalı.
 */
export function bankaKimligi(soru: BankaSorusu): string {
  switch (soru.oyun) {
    case 'yazim':
      return `yazim:${soru.dogru}`
    case 'islem':
      return `islem:${soru.metin}`
    case 'edebiyat':
      return `edebiyat:${soru.eser}`
    case 'ses':
      return `ses:${soru.kelime}`
    // Aynı cümle farklı ögesi sorularak iki kez geçebiliyor; kimlik yalnız
    // cümleden üretilseydi ikisi tek kayda düşerdi.
    case 'oge':
      return `oge:${soru.once}[${soru.oge}]${soru.sonra}`
    case 'soz':
      return `soz:${soru.soz}`
    // Aynı sayı hem "bölünür mü" hem "kalan kaç" olarak sorulabiliyor; tip
    // kimliğe girmeseydi ikisi tek kayda düşer, biri diğerini düşürürdü.
    case 'bolunme':
      return `bolunme:${soru.bolunmeTipi}:${soru.sayi}/${soru.bolen}`
    // Şekil sorularında kimlik verilen açılardan/kenarlardan geliyor: aynı
    // kuralın 40°'lik hâli ile 65°'lik hâli ayrı sorular.
    case 'aci':
      return `aci:${soru.aci.kural}:${soru.aci.a}:${soru.aci.b ?? ''}`
    case 'ucgen':
      return `ucgen:${ucgenKimligi(soru.ucgen)}`
    // Eşleştirme oyunlarında kimlik sorulan taraftan geliyor: aynı antlaşmanın
    // iki farklı maddesi iki ayrı soru.
    case 'antlasma':
      return `antlasma:${soru.madde}`
    case 'kavram':
      return `kavram:${soru.kavram}`
    case 'anlatim':
      return `anlatim:${soru.cumle}`
    case 'koklu':
      return `koklu:${soru.sayi}`
    // İki biyoloji oyunu tek dalda; kimlik oyun adıyla başlıyor ki aynı soru
    // metni iki oyunda da geçse kayıtlar karışmasın.
    case 'ortak':
    case 'siniflandirma':
      return `${soru.oyun}:${soru.biyoloji.soru}`
    case 'hucre':
      return `hucre:${soru.hucre.organel}`
  }
}

/** Listede görünen soru metni. */
export function bankaSorusuMetni(soru: BankaSorusu): string {
  switch (soru.oyun) {
    case 'yazim':
      return soru.yanlis
    case 'islem':
      return soru.metin
    case 'edebiyat':
      return soru.eser
    case 'ses':
      return soru.kelime
    case 'oge':
      return `“${soru.oge}” · ${soru.once}${soru.oge}${soru.sonra}`
    case 'soz':
      return soru.soz
    case 'bolunme':
      return soru.bolunmeTipi === 'kalan'
        ? `${soru.sayi} ÷ ${soru.bolen} · kalan?`
        : `${soru.sayi} · ${soru.bolen}’e bölünür mü?`
    case 'aci':
      return `${ACI_KURALI_ADI[soru.aci.kural]} · ${soru.aci.a}°${soru.aci.b === null ? '' : ` · ${soru.aci.b}°`}`
    case 'ucgen':
      return ucgenOzeti(soru.ucgen)
    case 'antlasma':
      return soru.madde
    case 'kavram':
      return soru.kavram
    case 'anlatim':
      return soru.cumle
    case 'koklu':
      return `√${soru.sayi}`
    case 'ortak':
    case 'siniflandirma':
      return soru.biyoloji.soru
    // Üç ipucundan sonuncusu: listede okunacak olan, cevabı en çok anlatan.
    // İlk ipucu tek başına birkaç organele birden uyduğu için tekrar ederken
    // hiçbir şey öğretmezdi.
    case 'hucre':
      return soru.hucre.ipuclari[soru.hucre.ipuclari.length - 1]
  }
}

/** Listede görünen doğru cevap. */
export function bankaCevabiMetni(soru: BankaSorusu): string {
  switch (soru.oyun) {
    case 'yazim':
      return soru.dogru
    case 'islem':
      return String(soru.sonuc)
    case 'edebiyat':
      return soru.yazar
    case 'ses':
      return OLAY_ADI[soru.olay]
    case 'oge':
      return OGE_ADI[soru.ogeTuru]
    case 'soz':
      return soru.anlam
    case 'bolunme':
      return soru.bolunmeTipi === 'kalan'
        ? String(soru.sayi % soru.bolen)
        : soru.sayi % soru.bolen === 0
          ? 'Evet'
          : 'Hayır'
    case 'aci':
      return `${soru.aci.cevap}°`
    case 'ucgen':
      return kenarMetni(ucgenCevabi(soru.ucgen))
    case 'antlasma':
      return soru.antlasma
    case 'kavram':
      return soru.tanim
    case 'anlatim':
      return BOZUKLUK_ADI[soru.bozuklukTuru]
    case 'koklu':
      return `${altSinir(soru)} – ${ustSinir(soru)}`
    case 'ortak':
    case 'siniflandirma':
      return soru.biyoloji.dogru
    case 'hucre':
      return soru.hucre.organel
  }
}

/**
 * Biten turun cevaplarını bankaya işler.
 *
 * Tek fonksiyon hem ekliyor hem düşürüyor, çünkü ikisi aynı kuralın iki yüzü:
 * yanlış bilinen girer, üst üste `DUSME_ESIGI` kez doğru bilinen çıkar. Ayrı
 * yazılsaydı normal turda verilen doğru cevabın bankayı ilerletmesi unutulurdu —
 * oysa asıl istenen bu: soruyu nerede bilirsen bil, öğrenmiş sayılırsın.
 *
 * Saf: girdiyi değiştirmiyor, yeni dizi döndürüyor.
 */
export function bankayiGuncelle(
  banka: readonly BankaKaydi[],
  cevaplar: readonly BankaCevabi[],
  bugunIso: string,
): BankaKaydi[] {
  const harita = new Map(banka.map((k) => [k.id, { ...k }]))

  for (const cevap of cevaplar) {
    const id = bankaKimligi(cevap.soru)
    const mevcut = harita.get(id)

    if (!cevap.dogruMu) {
      if (mevcut) {
        harita.set(id, {
          ...mevcut,
          // Soru güncelleniyor: havuzdaki kural metni sonradan düzeltilmiş olabilir.
          soru: cevap.soru,
          kacKez: mevcut.kacKez + 1,
          ardisikDogru: 0,
          sonYanlis: bugunIso,
        })
      } else {
        harita.set(id, {
          id,
          soru: cevap.soru,
          kacKez: 1,
          ardisikDogru: 0,
          eklenme: bugunIso,
          sonYanlis: bugunIso,
        })
      }
      continue
    }

    // Doğru cevap yalnızca bankada duran bir soruyu ilerletir; bilinen soru
    // bankaya girmez.
    if (!mevcut) continue
    const ilerleme = mevcut.ardisikDogru + 1
    if (ilerleme >= DUSME_ESIGI) harita.delete(id)
    else harita.set(id, { ...mevcut, ardisikDogru: ilerleme })
  }

  const hepsi = [...harita.values()]
  if (hepsi.length <= BANKA_SINIRI) return hepsi

  // Sınır aşıldı: en eski eklenenler düşer.
  return [...hepsi].sort((a, b) => a.eklenme.localeCompare(b.eklenme)).slice(-BANKA_SINIRI)
}

/** Bankadaki kayıtları oyun kimliğine göre sayar. */
/**
 * Güncelleme sırasında bankadan kaç kaydın düştüğü.
 *
 * `bankayiGuncelle` düşenleri siliyor, yani sonuca bakarak sayılamıyorlar; iki
 * listeyi karşılaştırmak gerekiyor. Boyut farkı yetmez, aynı turda hem ekleme
 * hem düşme olabilir.
 */
export function dusenSayisi(
  onceki: readonly BankaKaydi[],
  sonraki: readonly BankaKaydi[],
): number {
  const kalan = new Set(sonraki.map((k) => k.id))
  return onceki.filter((k) => !kalan.has(k.id)).length
}

/**
 * Bütün oyunların kimlikleri — **tek kaynak**.
 *
 * Bu liste dört ayrı yerde elle yazılıydı (banka dağılımı, en kalabalık oyun,
 * banka ekranının süzgeci, oyun geçmişi doğrulaması) ve dördüncü oyun
 * eklendiğinde hiçbiri güncellenmedi: yeni oyunun soruları bankaya giriyor ama
 * tur açılamıyor, süzgeçte görünmüyor, tur geçmişi sessizce siliniyordu.
 *
 * Kaynak bir `Record<OyunId, …>` olduğu için TypeScript eksik kalanı derleme
 * anında yakalıyor — yeni bir oyun kimliği eklenince burası hata verene kadar
 * proje derlenmiyor.
 */
const BOS_DAGILIM: Record<OyunId, number> = {
  yazim: 0,
  ses: 0,
  oge: 0,
  soz: 0,
  islem: 0,
  bolunme: 0,
  edebiyat: 0,
  aci: 0,
  ucgen: 0,
  antlasma: 0,
  kavram: 0,
  anlatim: 0,
  koklu: 0,
  ortak: 0,
  siniflandirma: 0,
  hucre: 0,
}

export const OYUN_KIMLIKLERI = Object.keys(BOS_DAGILIM) as OyunId[]

export function bankaDagilimi(banka: readonly BankaKaydi[]): Record<OyunId, number> {
  const dagilim = { ...BOS_DAGILIM }
  for (const kayit of banka) dagilim[kayit.soru.oyun]++
  return dagilim
}

/** Belirli bir oyunun kayıtları, en son yanlış bilinen en üstte. */
export function bankaSuz(banka: readonly BankaKaydi[], oyun: OyunId | 'tumu'): BankaKaydi[] {
  const secilen = oyun === 'tumu' ? [...banka] : banka.filter((k) => k.soru.oyun === oyun)
  return secilen.sort((a, b) => b.sonYanlis.localeCompare(a.sonYanlis) || b.kacKez - a.kacKez)
}

/**
 * "Tümü" seçiliyken tur hangi oyundan açılacak: en çok kaydı olan.
 *
 * Tur mantığı oyuna özgü (yazımda iki şık, işlemde tuş takımı, edebiyatta
 * eşleştirme); üç oyunu tek turda karıştırmak her birinin kendi ekranını
 * bozardı. En kalabalık oyunu seçmek, en çok tekrar gereken yer olduğu için
 * de doğru sıralama.
 */
export function enKalabalikOyun(banka: readonly BankaKaydi[]): OyunId | null {
  const dagilim = bankaDagilimi(banka)
  let enIyi: OyunId | null = null
  for (const oyun of OYUN_KIMLIKLERI) {
    if (dagilim[oyun] > 0 && (enIyi === null || dagilim[oyun] > dagilim[enIyi])) enIyi = oyun
  }
  return enIyi
}
