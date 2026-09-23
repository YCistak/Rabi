import {
  SIK_SAYISI,
  siklariKur as ortakSiklariKur,
  type CoktanSecmeliSoru,
  type Sik,
} from './coktan-secmeli'
import { karistir } from './tur'
import {
  TEPKIME_HAVUZU,
  TUR_ADI,
  TUR_KURALI,
  type TepkimeSorusu,
  type TepkimeTuru,
} from './tepkime-havuzu'

/**
 * Tepkime Türü'nün mantığı: denklemin parçaları ve şıklar.
 *
 * Mekanik Ses Olayları'nın aynısı (sabit seçenek kümesinden dört şık) ama
 * çeldirici kuralı soruya bağlı: denklemin `ayrica` listesindeki türler şık
 * olamıyor (`tepkime-havuzu.ts`). Ortak `turHazirla` çeldirici süzgecine
 * soruyu geçirmediği için şıklar burada soru soru kuruluyor.
 */

export { SIK_SAYISI }

export type TepkimeSikki = Sik<TepkimeTuru>
export type TepkimeOyunSorusu = CoktanSecmeliSoru<TepkimeSorusu, TepkimeTuru>

/** Bütün türler — çeldiriciler buradan seçiliyor. */
export const TURLER = Object.keys(TUR_ADI) as TepkimeTuru[]

/** Maddenin hâli: katı, sıvı, gaz, suda çözünmüş. */
export type Hal = 'k' | 's' | 'g' | 'suda'

export type Terim = {
  katsayi: number
  /** Yüksüz, hâlsiz formül: `Ca(OH)2`. Alt indisleri `formulParcalari` kuruyor. */
  formul: string
  /** İyonun yükü (`2+`, `-`); molekülde `null`. */
  yuk: string | null
  hal: Hal | null
}

export type DenklemParcalari = { girenler: Terim[]; urunler: Terim[] }

const TERIM = /^(\d*)([A-Za-z0-9()]+?)(?:\^(\d*[+-]))?(?:\((k|s|g|suda)\))?$/

/**
 * Düz yazı terimi parçalarına ayırır: `2Fe^3+(suda)`.
 *
 * Katsayı ile alt indis aynı rakamlar; ayıran yalnızca yeri. Baştaki sayı
 * katsayı, formülün içindeki her sayı alt indis — `2H2O`da ilk 2 çizimde
 * normal boyda, ikincisi aşağıda.
 */
export function terimCoz(metin: string): Terim {
  const eslesme = TERIM.exec(metin)
  if (!eslesme) throw new Error(`Çözülemeyen terim: ${metin}`)
  const [, katsayi, formul, yuk, hal] = eslesme
  return {
    katsayi: katsayi === '' ? 1 : Number(katsayi),
    formul,
    yuk: yuk ?? null,
    hal: (hal as Hal | undefined) ?? null,
  }
}

export function denklemCoz(denklem: string): DenklemParcalari {
  const [sol, sag] = denklem.split(' → ')
  if (sol === undefined || sag === undefined) throw new Error(`Okunmayan denklem: ${denklem}`)
  return {
    girenler: sol.split(' + ').map(terimCoz),
    urunler: sag.split(' + ').map(terimCoz),
  }
}

const UST_RAKAM: Record<string, string> = { '1': '¹', '2': '²', '3': '³', '+': '⁺', '-': '⁻' }

/**
 * Banka listesinde ve hata bildiriminde görünen tek satırlık metin.
 *
 * Hâller atılıyor (liste satırında gürültü), yük üst simgeyle yazılıyor:
 * düz "SO42-" dört mü kırk iki mi, okunmuyordu. Alt indis ise düz rakam
 * kalıyor — Formül Eşleştirme'nin banka satırıyla aynı.
 */
export function denklemDuzYazi(denklem: string): string {
  const yaz = (t: Terim) =>
    `${t.katsayi === 1 ? '' : t.katsayi}${t.formul}${
      t.yuk ? [...t.yuk].map((k) => UST_RAKAM[k] ?? k).join('') : ''
    }`
  const { girenler, urunler } = denklemCoz(denklem)
  return `${girenler.map(yaz).join(' + ')} → ${urunler.map(yaz).join(' + ')}`
}

/** Sorunun dört şıkkı; `ayrica`daki türler çeldirici olamıyor. */
export function siklariKur(
  soru: TepkimeSorusu,
  rastgele: () => number = Math.random,
): TepkimeSikki[] {
  return ortakSiklariKur(
    soru.tur,
    TURLER,
    (t) => TUR_ADI[t],
    rastgele,
    (aday) => !soru.ayrica.includes(aday),
  )
}

/**
 * Bir turun soruları.
 *
 * `karistirilsin` yalnızca sıra dışarıda kurulduğunda kapatılıyor: şeritler
 * ayrı ayrı eşleniyor ve aynı `sira` numarası üçünde aynı yerde kalmalı
 * (`coktan-secmeli.ts`).
 */
export function turHazirla(
  havuz: readonly TepkimeSorusu[] = TEPKIME_HAVUZU,
  rastgele: () => number = Math.random,
  karistirilsin = true,
): TepkimeOyunSorusu[] {
  const sira = karistirilsin ? karistir(havuz, rastgele) : havuz
  return sira.map((soru) => ({ soru, siklar: siklariKur(soru, rastgele) }))
}

/** Havuzdaki kayıt — banka kaydı yalnızca denklemi taşıyor. */
export function tepkimeBul(denklem: string): TepkimeSorusu | null {
  return TEPKIME_HAVUZU.find((s) => s.denklem === denklem) ?? null
}

/**
 * Cevaptan sonra çıkan cümle.
 *
 * Denklemin kendi notu varsa o, yoksa türün kuralı. Ardından denklemin
 * ayrıca girdiği türler: "bir denklem iki türe girebilir" konu kartındaki
 * en önemli uyarı ve bu oyunda şıklardan elenerek görünmez oluyordu.
 */
export function aciklama(soru: TepkimeSorusu): string {
  const govde = soru.not ?? TUR_KURALI[soru.tur]
  if (soru.ayrica.length === 0) return govde
  const adlar = soru.ayrica.map((t) => kisaAd(t)).join(' ve ')
  return `${govde} Ayrıca ${adlar}.`
}

/** Şıktaki adın parantezsiz hâli: "Sentez (oluşum)" → "sentez". */
function kisaAd(tur: TepkimeTuru): string {
  return TUR_ADI[tur].replace(/\s*\(.*\)$/, '').toLocaleLowerCase('tr')
}

