/**
 * Hedef kataloğu — üniversite + bölüm seçiminden başarı sırası ve taban puan.
 *
 * Kullanıcı eskiden hedef ekranında dört kutuyu da elle dolduruyordu: bölüm
 * adı, üniversite adı, taban puan, başarı sırası. Son iki sayıyı bilen kimse
 * yoktu; hedef ya boş kalıyordu ya da rastgele bir sayıyla kaydediliyordu ve
 * "hedefine ne kadar kaldı" cümlesi ölçtüğü şeyi kaybediyordu. Artık kullanıcı
 * yalnızca **arayıp seçiyor**, sayıları katalog dolduruyor.
 *
 * ## Sıra artık tahmin değil
 *
 * Eskiden sıra, üniversitenin 1–5 arası "kademesi" ile bölümün iki ucu
 * arasında geometrik iç değerle **tahmin ediliyordu**; model tek boyutluydu ve
 * bir üniversitenin her bölümde aynı yerde olduğunu varsayıyordu. Artık
 * `veri/katalog.ts` her programın kılavuzdaki **gerçek** başarı sırasını
 * taşıyor.
 *
 * ## Puan hâlâ hesaplanıyor
 *
 * Kılavuzda taban puan da yazıyor ama kataloğa girmiyor; puan `siralamadanPuan`
 * ile o yılın yerleştirme dağılımından geri hesaplanıyor. Sebep değişmedi:
 * sıra yıldan yıla neredeyse yerinde duruyor, puan sınavın zorluğuyla oynuyor.
 * Yeni yılın dağılımı geldiğinde puan kendiliğinden güncelleniyor; kataloğa
 * yazılmış olsaydı bir yıl eskimiş sayıyı göstermeye devam ederdi.
 *
 * Saf ve React'ten bağımsız.
 */

import { SON_VERI_YILI } from './puan'
import { siralamadanPuan } from './siralama'
import {
  UNIVERSITELER,
  sadelestir,
  universiteninBolumleri,
  type Bolum,
  type Universite,
} from './veri/katalog'

export { sadelestir, VERI_YILI as KATALOG_VERI_YILI } from './veri/katalog'
export type { Bolum, Universite }

export type Tahmin = {
  /** Programın kılavuzdaki başarı sırası. */
  siralama: number
  /** O sıranın son veri yılındaki yerleştirme puanı karşılığı. */
  tabanPuan: number
}

/** Aramada en fazla kaç sonuç gösteriliyor — liste uzayınca seçilmez oluyor. */
export const EN_COK_SONUC = 40

/**
 * Üniversite + bölüm → başarı sırası ve taban puan.
 *
 * Sıra katalogdan olduğu gibi geliyor; yuvarlanmıyor. Eskiden sıra bir
 * tahmindi ve "47.213" gibi kesin görünen bir sayı hak etmediği güveni
 * veriyordu, o yüzden kabalaştırılıyordu. Artık sayı ÖSYM'nin kendi yayımladığı
 * değer — yuvarlamak onu daha dürüst değil, yalnızca daha yanlış yapardı.
 * Arayüzdeki belirsizlik bandı `siralama.ts`'teki `bantYaz`ın işi.
 */
export function tahminEt(_universite: Universite, bolum: Bolum): Tahmin {
  const { puan } = siralamadanPuan(bolum.basariSirasi, bolum.puanTuru, SON_VERI_YILI)
  return { siralama: bolum.basariSirasi, tabanPuan: Math.round(puan * 10) / 10 }
}

/**
 * Üniversitenin açtığı bölümler.
 *
 * Eskiden burada iki süzgeç vardı (fakülte grubu var mı, bölüm bu kademede
 * açılıyor mu) çünkü liste bütün bölümlerin çarpımından türetiliyordu. Katalog
 * artık gerçek programları taşıyor: bir üniversitede listelenen her bölüm o
 * üniversitede gerçekten açık.
 */
export function bolumleriGetir(universite: Universite): Bolum[] {
  return universiteninBolumleri(universite)
}

/**
 * Arama: sadeleştirilmiş metinde geçen kayıtlar, baştan eşleşenler önde.
 *
 * "ege" yazan kullanıcı Ege Üniversitesi'ni ilk sırada görmeli; "Gebze"nin
 * içinde de "ge" geçtiği için sıralama olmadan liste anlamsızlaşıyor.
 * Sözcük başı eşleşmesi ortada geçenden önce geliyor: "teknik" araması
 * "İstanbul Teknik"i "Teknik"siz bir addan önce getirsin.
 */
function sirala<T>(kayitlar: readonly T[], sorgu: string, metni: (k: T) => string): T[] {
  const aranan = sadelestir(sorgu.trim())
  if (aranan === '') return [...kayitlar]

  const puanla = (metin: string): number => {
    const yer = metin.indexOf(aranan)
    if (yer < 0) return -1
    if (yer === 0) return 2
    return metin[yer - 1] === ' ' || metin[yer - 1] === '-' ? 1 : 0
  }

  return kayitlar
    .map((kayit) => ({ kayit, agirlik: puanla(sadelestir(metni(kayit))) }))
    .filter((k) => k.agirlik >= 0)
    .sort((a, b) => b.agirlik - a.agirlik)
    .map((k) => k.kayit)
}

/**
 * Üniversite araması — ad ve şehir birlikte taranıyor ("ankara" şehri de bulur).
 *
 * KKTC üniversiteleri şehirleriyle (Lefkoşa, Girne…) duruyor ama arayan
 * öğrenci "kıbrıs" yazıyor; o yüzden aranan metne ülke adı da ekleniyor.
 */
export function universiteAra(sorgu: string): Universite[] {
  return sirala(UNIVERSITELER, sorgu, (u) =>
    u.tur === 'kktc' ? `${u.ad} ${u.sehir} KKTC Kıbrıs` : `${u.ad} ${u.sehir}`,
  ).slice(0, EN_COK_SONUC)
}

/** Bölüm araması — yalnızca o üniversitenin açtıkları arasında. */
export function bolumAra(universite: Universite, sorgu: string): Bolum[] {
  return sirala(bolumleriGetir(universite), sorgu, (b) => b.ad)
}

/**
 * Kayıtlı hedefin üniversitesini katalogda bulur.
 *
 * `Hedef` üniversiteyi kimlikle değil **adla** tutuyor: alan eskiden serbest
 * metindi ve elle yazılmış hedefler kayıtta duruyor. Ada bakan bir arama,
 * kataloğa girmeyen o kayıtları da olduğu gibi çalıştırıyor.
 */
export function universiteBul(ad: string): Universite | null {
  const aranan = sadelestir(ad.trim())
  if (aranan === '') return null
  return UNIVERSITELER.find((u) => sadelestir(u.ad) === aranan) ?? null
}

/**
 * Kayıtlı hedefin bölümünü katalogda bulur; bulamazsa `null`.
 *
 * Üniversite parametresi şart: bölüm artık evrensel bir kayıt değil, o
 * üniversitedeki bir program ve başarı sırası üniversiteden üniversiteye
 * değişiyor. Üniversitesiz bir arama, "Tıp"ın sırasını rastgele bir
 * üniversiteden okurdu.
 */
export function bolumBul(universite: Universite | null, ad: string): Bolum | null {
  if (universite === null) return null
  const aranan = sadelestir(ad.trim())
  if (aranan === '') return null
  return bolumleriGetir(universite).find((b) => sadelestir(b.ad) === aranan) ?? null
}

/** Üniversite türünün ekranda görünen adı. */
export function turAdi(universite: Universite): string {
  if (universite.tur === 'kktc') return 'KKTC'
  return universite.tur === 'vakif' ? 'Vakıf' : 'Devlet'
}

/**
 * Üniversitenin kısa adı — "Orta Doğu Teknik Üniversitesi" → "ODTÜ".
 *
 * Ana sayfadaki hedef panelinde bölüm ile üniversite tek satırda duruyor ve
 * tasarımda üniversite kısa yazılı. Katalogdaki tam adlar o satıra sığmıyor:
 * "Bilgisayar Mühendisliği · Orta Doğu Teknik Üniversitesi" en geniş telefonda
 * bile kırpılıyor ve kırpılan yer tam da üniversitenin adı oluyordu.
 *
 * Kural, öğrencilerin kendi kullandığı kısaltmayı üretiyor: "Üniversitesi" eki
 * atılıyor, geriye **birden çok** kelime kalıyorsa baş harfleri alınıp sonuna
 * "Ü" ekleniyor (ODTÜ, İTÜ, YTÜ, DEÜ, KTÜ, DAÜ). Tek kelime kalıyorsa o kelime
 * zaten kısa ve tanınan ad — "Boğaziçi Üniversitesi" için "BÜ" demek adı
 * tanınmaz hâle getirirdi, o yüzden "Boğaziçi" kalıyor.
 *
 * Yalnızca **gösterim** için: kayıttaki ad tam hâliyle duruyor, çünkü katalog
 * eşleşmesi (`universiteBul`) tam ada bakıyor.
 */
export function universiteKisaAdi(ad: string): string {
  const govde = ad.replace(/\s*Üniversitesi\s*$/i, '').trim()
  if (govde === '') return ad.trim()

  const kelimeler = govde.split(/\s+/)
  if (kelimeler.length < 2) return govde

  // `toLocaleUpperCase('tr')` şart: "istanbul" → "İSTANBUL", "i" değil "İ".
  return kelimeler.map((k) => k[0].toLocaleUpperCase('tr')).join('') + 'Ü'
}
