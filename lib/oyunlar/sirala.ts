/**
 * Zaman Şeridi — beş olayı eskiden yeniye diz.
 *
 * Şık yok: cevap bir seçim değil bir **düzen**. Beş kartın 120 olası dizilişi
 * var, altı kartın 720; rastgele denemenin karşılığı yok, bilmek gerekiyor.
 * Mevcut oyunların hiçbiri bunu ölçmüyordu — hepsi tek bir bilgi parçasını
 * soruyor, kronoloji ise parçalar arasındaki ilişki.
 *
 * Puanlama iki katmanlı, çünkü "hepsini karıştırmak" ile "iki kartın yerini
 * değiştirmek" aynı şey değil:
 *
 * - **Doğru/yanlış** sayacı yalnızca tam sıraya bakıyor. Rekor buna göre
 *   tutuluyor, öteki oyunlarla karşılaştırılabilir kalsın diye.
 * - **Puan** doğru sıralı komşu çiftlerini sayıyor. Beş kartın dördü yerinde
 *   olan bir cevap sıfır değil, dört puan alıyor.
 *
 * Komşuluk ölçüsü "kaç kart doğru yerde" ölçüsüne tercih edildi: tek bir kartı
 * en başa çekmek geri kalan her kartın konumunu kaydırır ve tamamen doğru
 * bilinen bir sıra sıfır puan alırdı. Komşuluk yalnızca gerçekten bozulan
 * ilişkileri cezalandırıyor.
 *
 * Saf: React'e bağlı hiçbir şey yok, hepsi test edilebilir.
 */

import type { SiraDonemi, SiraliOlay } from './sirala-havuzu'
import { SIRALA_HAVUZU } from './sirala-havuzu'
import type { Zorluk } from './ritim'
import { karistir, sec } from './tur'

/** Normal sorudaki kart sayısı. Beş kart telefon ekranına sürüklenebilir boyutta sığıyor. */
export const KART_SAYISI = 5

/**
 * Boss sorusunda kart sayısı bir fazla.
 *
 * Boss'un zorluğu öteki oyunlarda "bir üst havuz"dan geliyor; burada o tek
 * başına yetmiyor, çünkü asıl zorluk kart sayısında: beş kartın 120, altı
 * kartın 720 dizilişi var. Havuzdaki her dönem altı olay taşıyor, o yüzden
 * boss elini kuracak kadar olay her zaman bulunuyor.
 */
export const BOSS_KART_SAYISI = 6

/** Tam sırayı tutturmanın komşuluk puanına eklediği bonus. */
export const TAM_BONUS = 2

export type SiralamaSorusu = {
  /**
   * Kartların **karışık** hâli — ekranda bu sırayla açılıyorlar.
   *
   * Soru bu listeyle kimlikleniyor (bkz. `soruKimligi`), o yüzden bankaya
   * giren kayıt da bu listeyi taşıyor: aynı beş olay yeniden sorulduğunda
   * oyuncu aynı soruyu görüyor.
   */
  olaylar: SiraliOlay[]
  /** Soru tek dönemden kurulduysa o dönem; karışıksa null. */
  donem: SiraDonemi | null
}

/** Doğru cevap: olaylar eskiden yeniye. */
export function dogruSira(soru: SiralamaSorusu): SiraliOlay[] {
  return [...soru.olaylar].sort((a, b) => a.yil - b.yil)
}

/** Verilen dizilim tam olarak doğru mu. */
export function siraDogruMu(dizilim: readonly SiraliOlay[]): boolean {
  for (let i = 1; i < dizilim.length; i++) {
    if (dizilim[i - 1].yil > dizilim[i].yil) return false
  }
  return true
}

/**
 * Doğru sıralı komşu çifti sayısı.
 *
 * `n` kartta en çok `n - 1` olabiliyor. Tam doğru cevapta hepsi doğru, tersten
 * dizilmiş bir cevapta hiçbiri.
 */
export function dogruKomsuSayisi(dizilim: readonly SiraliOlay[]): number {
  let sayi = 0
  for (let i = 1; i < dizilim.length; i++) {
    if (dizilim[i - 1].yil < dizilim[i].yil) sayi++
  }
  return sayi
}

/** Bir cevabın getirdiği puan: komşuluklar, tam sıradaysa bonusuyla. */
export function soruPuani(dizilim: readonly SiraliOlay[]): number {
  const taban = dogruKomsuSayisi(dizilim)
  return siraDogruMu(dizilim) ? taban + TAM_BONUS : taban
}

/**
 * Yılın okunur hâli.
 *
 * Havuzdaki İslamiyet öncesi olaylar eksi yılda duruyor (`-209`); ekranda
 * "MÖ 209" yazması gerekiyor, "-209" değil.
 */
export function yilMetni(yil: number): string {
  return yil < 0 ? `MÖ ${-yil}` : String(yil)
}

/**
 * Soruyu kimlikleyen metin.
 *
 * Olay adları **sıralanarak** birleştiriliyor: aynı beş olay farklı karışık
 * düzenle gelse de aynı soru sayılmalı, yoksa bankada aynı soru için onlarca
 * kayıt açılırdı.
 */
export function soruKimligi(soru: SiralamaSorusu): string {
  return [...soru.olaylar].map((o) => o.olay).sort().join('|')
}

/**
 * Tek soru kurar: bir dönemden `adet` kadar olay.
 *
 * Soru **tek dönemden** kuruluyor. Dönemler karışsaydı sıralamak tarih bilgisi
 * değil çağrışım işi olurdu: "Malazgirt" ile "Harf İnkılabı" yan yana gelince
 * hangisinin önce olduğunu bilmek için tarih öğrenmiş olmak gerekmiyor. Aynı
 * dönemden beş olay ise gerçekten kronoloji sorusu.
 *
 * `kullanilan`, tur boyunca daha önce sorulmuş olay adları — bir turda aynı
 * olay iki soruda birden çıkmasın diye. Havuz tükenirse `null` dönüyor ve tur
 * erken bitiyor.
 */
export function soruKur(
  zorluk: Zorluk,
  adet: number = KART_SAYISI,
  kullanilan: ReadonlySet<string> = new Set(),
  havuz: readonly SiraliOlay[] = SIRALA_HAVUZU,
  rastgele: () => number = Math.random,
): SiralamaSorusu | null {
  const zorluktakiler = havuz.filter((o) => o.zorluk === zorluk)
  // Seçilen zorlukta olay yoksa havuzun tamamına düşülüyor: oyunun hiç
  // açılmaması, kolay bir sorunun fazladan gelmesinden kötü. (`ritim.ts`)
  const kaynak = zorluktakiler.length > 0 ? zorluktakiler : havuz
  const kalan = kaynak.filter((o) => !kullanilan.has(o.olay))

  const donemler = new Map<SiraDonemi, SiraliOlay[]>()
  for (const olay of kalan) {
    const liste = donemler.get(olay.donem)
    if (liste) liste.push(olay)
    else donemler.set(olay.donem, [olay])
  }

  const uygunlar = [...donemler.entries()].filter(
    ([, olaylar]) => farkliYil(olaylar) >= adet,
  )

  // Hiçbir dönem tek başına yetmiyorsa dönem karışıyor; soru yine kurulabilir
  // ama kronolojik yakınlık kaybolduğu için `donem` null işaretleniyor.
  const [donem, secilenKaynak] =
    uygunlar.length > 0
      ? sec(uygunlar, rastgele)
      : ([null, kalan] as [null, SiraliOlay[]])

  const olaylar = farkliYillaSec(secilenKaynak, adet, rastgele)
  if (olaylar.length < adet) return null

  return { olaylar: dogrudanFarkliKaristir(olaylar, rastgele), donem }
}

/** Farklı yıl sayısı — dönemin soru kurmaya yetip yetmediğini söyler. */
function farkliYil(olaylar: readonly SiraliOlay[]): number {
  return new Set(olaylar.map((o) => o.yil)).size
}

/**
 * Yılı tekrarlamadan `adet` kadar olay seçer.
 *
 * Aynı yıla düşen iki olay bir soruda karşılaşırsa "hangisi önce" sorusunun
 * tek doğru cevabı olmaz. Havuz zaten dönem içinde tekrarsız, ama dönemler
 * karıştığında (yukarıdaki geri düşüş) çakışma mümkün.
 */
function farkliYillaSec(
  olaylar: readonly SiraliOlay[],
  adet: number,
  rastgele: () => number,
): SiraliOlay[] {
  const secilen: SiraliOlay[] = []
  const yillar = new Set<number>()

  for (const olay of karistir(olaylar, rastgele)) {
    if (secilen.length >= adet) break
    if (yillar.has(olay.yil)) continue
    yillar.add(olay.yil)
    secilen.push(olay)
  }
  return secilen
}

/**
 * Kartları karıştırır ama **doğru sırayı vermez**.
 *
 * Karıştırma bazen doğru sırayı üretiyor (beş kartta 120'de bir) ve o soru
 * dokunmadan onaylanarak kazanılırdı — oyunun ölçtüğü şeyle ilgisi olmayan
 * bedava bir puan. Ters çevirmek her zaman doğru sıradan farklı bir dizilim
 * veriyor, çünkü yıllar birbirinden farklı.
 */
function dogrudanFarkliKaristir(
  olaylar: readonly SiraliOlay[],
  rastgele: () => number,
): SiraliOlay[] {
  const karisik = karistir(olaylar, rastgele)
  return siraDogruMu(karisik) ? [...karisik].reverse() : karisik
}

/**
 * Turun soruları.
 *
 * `ritim.ts`'teki `turSirasi` burada kullanılamıyor: orada havuzun tek bir
 * elemanı bir soru, burada bir soru havuzdan beş eleman istiyor. Boss'un
 * hangi sıralarda geleceği kuralı yine `ritim.ts`'ten okunuyor, kopyalanmıyor.
 */
export function siralaTuruHazirla(
  zorluk: Zorluk,
  bossSiralari: (sira: number) => boolean,
  bossZorluk: Zorluk,
  sinir: number,
  havuz: readonly SiraliOlay[] = SIRALA_HAVUZU,
  rastgele: () => number = Math.random,
): { soru: SiralamaSorusu; boss: boolean }[] {
  const sira: { soru: SiralamaSorusu; boss: boolean }[] = []
  const kullanilan = new Set<string>()

  for (let i = 1; i <= sinir; i++) {
    const boss = bossSiralari(i)
    const soru = soruKur(
      boss ? bossZorluk : zorluk,
      boss ? BOSS_KART_SAYISI : KART_SAYISI,
      kullanilan,
      havuz,
      rastgele,
    )
    /*
      Havuz tükendi.

      Kullanılmış olaylar temizlenip baştan başlanıyor: tur sınırsız, havuz
      değil. Tekrar ancak havuzun tamamı bittikten sonra başlıyor — öteki
      oyunlardaki `dongu` kuralının aynısı.
    */
    if (soru === null) {
      if (kullanilan.size === 0) break
      kullanilan.clear()
      i--
      continue
    }
    for (const olay of soru.olaylar) kullanilan.add(olay.olay)
    sira.push({ soru, boss })
  }
  return sira
}

/** Banka kayıtlarındaki olay listelerinden tur soruları. */
export function bankadanSorular(
  listeler: readonly SiraliOlay[][],
  rastgele: () => number = Math.random,
): SiralamaSorusu[] {
  return listeler.map((olaylar) => ({
    olaylar: dogrudanFarkliKaristir(olaylar, rastgele),
    // Bankadaki kayıt tek dönemden kurulmuş olsa da dönem bilgisi saklanmıyor:
    // ekranda yalnızca başlıkta görünen bir etiket ve kayda değmez.
    donem: null,
  }))
}
