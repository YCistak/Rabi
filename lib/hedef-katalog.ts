/**
 * Hedef kataloğu — üniversite + bölüm seçiminden tahmini taban puan ve sıra.
 *
 * Kullanıcı eskiden hedef ekranında dört kutuyu da elle dolduruyordu: bölüm
 * adı, üniversite adı, taban puan, başarı sırası. Son iki sayıyı bilen kimse
 * yoktu; hedef ya boş kalıyordu ya da rastgele bir sayıyla kaydediliyordu ve
 * "hedefine ne kadar kaldı" cümlesi ölçtüğü şeyi kaybediyordu. Artık kullanıcı
 * yalnızca **arayıp seçiyor**, sayıları katalog dolduruyor.
 *
 * ## Tahmin zinciri
 *
 * 1. Üniversitenin **kademesi** (`universiteler.ts`) ile bölümün iki ucu
 *    (`bolumler.ts`) arasında geometrik iç değer → tahmini **başarı sırası**.
 * 2. O sıra, `puan.ts`'teki gerçek ÖSYM yerleştirme dağılımından geri çevrilir
 *    (`siralamadanPuan`) → tahmini **taban puan**.
 *
 * İkinci adım gerçek veri, birinci adım tahmin. Bölünme kasıtlı: en yavaş
 * bayatlayan sayıyı (sırayı) elle tutuyoruz, hızlı bayatlayanı (puanı) her yıl
 * gelen veriden hesaplatıyoruz.
 *
 * ## Neden geometrik iç değer
 *
 * Sıralamalar kademe kademe doğrusal değil **katlanarak** büyüyor: Tıp'ta
 * 1. kademe 400. sıra, 5. kademe 60.000. sıra — aradaki her basamak bir
 * öncekinin yaklaşık üç katı. Doğrusal iç değer ortadaki kademeleri 15.000
 * civarına yığar ve gerçekte 4.000'lik olan bir bölümü ulaşılmaz gösterirdi.
 *
 * ## Yuvarlama
 *
 * Çıkan sıra kabalaştırılıyor. Kesin görünen bir sayı ("47.213") tahmini
 * olduğundan daha güvenilir gösteriyor; `siralama.ts`'teki `bantYaz` da aynı
 * gerekçeyle yuvarlıyor.
 *
 * Saf ve React'ten bağımsız.
 */

import { SON_VERI_YILI } from './puan'
import { siralamadanPuan } from './siralama'
import { BOLUMLER, type Bolum } from './veri/bolumler'
import { UNIVERSITELER, sadelestir, type Universite } from './veri/universiteler'

export { sadelestir }
export type { Bolum, Universite }

export type Tahmin = {
  /** Tahmini başarı sırası. */
  siralama: number
  /** O sıranın son veri yılındaki yerleştirme puanı karşılığı. */
  tabanPuan: number
}

/** Aramada en fazla kaç sonuç gösteriliyor — liste uzayınca seçilmez oluyor. */
export const EN_COK_SONUC = 40

/**
 * Bölümün o kademedeki tahmini başarı sırası.
 *
 * Kademe bölümün açıldığı en düşük kademeden aşağıdaysa alt uca sabitleniyor;
 * çağıran taraf zaten `bolumleriGetir` ile süzüyor, burası yalnızca güvenlik.
 */
export function tahminiSira(bolum: Bolum, kademe: number): number {
  const sinirli = Math.min(Math.max(kademe, 1), bolum.sonKademe)
  const oran = bolum.sonKademe <= 1 ? 0 : (sinirli - 1) / (bolum.sonKademe - 1)
  const ham = bolum.ustSira * Math.pow(bolum.altSira / bolum.ustSira, oran)
  return kabalastir(ham)
}

/** Tahmini sayıyı okunur bir adıma indirir — kesinlik iddiası taşımasın diye. */
function kabalastir(sayi: number): number {
  const basamak = sayi >= 100_000 ? 1000 : sayi >= 10_000 ? 500 : sayi >= 1_000 ? 100 : 10
  return Math.max(basamak, Math.round(sayi / basamak) * basamak)
}

/** Üniversite + bölüm → tahmini sıra ve taban puan. */
export function tahminEt(universite: Universite, bolum: Bolum): Tahmin {
  const siralama = tahminiSira(bolum, universite.kademe)
  const { puan } = siralamadanPuan(siralama, bolum.puanTuru, SON_VERI_YILI)
  return { siralama, tabanPuan: Math.round(puan * 10) / 10 }
}

/**
 * Üniversitenin açtığı bölümler.
 *
 * İki ayrı süzgeç var ve ikisi farklı soruyu soruyor: fakülte grubu "bu
 * üniversitede böyle bir fakülte var mı", `sonKademe` ise "bu bölüm bu
 * kademede açılıyor mu". Havacılık ve Uzay Mühendisliği'ni mühendislik
 * fakültesi olan her üniversitede listelemek ikincisini atlamak olurdu.
 */
export function bolumleriGetir(universite: Universite): Bolum[] {
  return BOLUMLER.filter(
    (b) => universite.alanlar.includes(b.alan) && universite.kademe <= b.sonKademe,
  )
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

/** Kayıtlı hedefin bölümünü katalogda bulur; bulamazsa `null`. */
export function bolumBul(ad: string): Bolum | null {
  const aranan = sadelestir(ad.trim())
  if (aranan === '') return null
  return BOLUMLER.find((b) => sadelestir(b.ad) === aranan) ?? null
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
