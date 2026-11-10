/**
 * İstatistik ekranının hesapları (tasarım: `tasarim/istatistik.dc.html` → 2a).
 *
 * Ekranın sorusu "hangi derste net kaybediyorum?". Bu yüzden ortalamadan önce
 * **son iki denemenin farkı** geliyor: öğrencinin elindeki en taze bilgi o ve
 * "ne değişti" sorusuna ortalama cevap vermiyor.
 *
 * Her şey tek bir şablonun denemeleri üzerinden: TYT ile seviye tespit
 * sınavının soru sayısı farklı, netleri aynı hesaba girmez.
 */

import { denemeOzeti, grupNeti, tarihSirala, yuvarla, type DenemeOzeti } from './hesap'
import { gecerliToplu, sablonGruplari, TOPLU_GRUPLAR, TOPLU_GRUP_ADI } from './toplu-grup'
import type { Deneme, Sablon, TopluGrup } from './types'

export { grupNeti } from './hesap'

/** Kayan nokta artığı: 0,25'lik netlerin farkında 1e-15 kalıyor ve "değişmedi"yi bozuyor. */
const ESIK = 0.001

export type Yon = 'artti' | 'azaldi' | 'ayni'

export function yon(fark: number): Yon {
  return fark > ESIK ? 'artti' : fark < -ESIK ? 'azaldi' : 'ayni'
}

/** "+1,50" / "−0,75" / "±0,00" — eksi işareti tire değil, rakamla aynı genişlikte. */
export function farkYaz(fark: number, netYaz: (n: number) => string): string {
  const y = yon(fark)
  return `${y === 'artti' ? '+' : y === 'azaldi' ? '−' : '±'}${netYaz(Math.abs(fark))}`
}

export type DersDegisimi = {
  dersId: string
  ad: string
  onceki: number
  son: number
  fark: number
  /** Toplu grup satırı mı? */
  toplu?: boolean
}

/**
 * Ders analizinde kaç denemede bir grubun toplu girildiği. O denemeler
 * grubun derslerinin serisinde boş (sıfır sayılmıyor); not bunu söylüyor.
 */
export type TopluNotu = { grup: TopluGrup; ad: string; denemeSayisi: number }

/** Denemelerde toplu girilen grupların sayımı; hiç toplu yoksa boş. */
export function topluNotlari(denemeler: Deneme[], sablon: Sablon): TopluNotu[] {
  return TOPLU_GRUPLAR.flatMap((grup) => {
    const sayi = denemeler.filter((d) =>
      gecerliToplu(d, sablon).some((t) => t.grup === grup),
    ).length
    return sayi > 0 ? [{ grup, ad: TOPLU_GRUP_ADI[grup], denemeSayisi: sayi }] : []
  })
}

/**
 * İki deneme arasındaki ders değişimleri.
 * Bir grup iki denemede de ders ders girildiyse: ders ders.
 * Grup en az birinde toplu girildiyse: o grup için dersler yerine
 * tek bir grup satırı ("Sosyal" / "Fen") eklenir (toplu: true).
 */
export function dersDegisimleri(
  aDeneme: Deneme,
  bDeneme: Deneme,
  sablon: Sablon,
): DersDegisimi[] {
  const oa = denemeOzeti(aDeneme, sablon)
  const ob = denemeOzeti(bDeneme, sablon)

  const gruplar = sablonGruplari(sablon)
  const topluGrupKumesi = new Set<TopluGrup>()
  for (const g of gruplar) {
    const aToplu = gecerliToplu(aDeneme, sablon).some((t) => t.grup === g.grup)
    const bToplu = gecerliToplu(bDeneme, sablon).some((t) => t.grup === g.grup)
    if (aToplu || bToplu) {
      topluGrupKumesi.add(g.grup)
    }
  }

  const atlanacakDersIdleri = new Set<string>()
  for (const g of gruplar) {
    if (topluGrupKumesi.has(g.grup)) {
      for (const id of g.dersIdleri) atlanacakDersIdleri.add(id)
    }
  }

  const degisimler: DersDegisimi[] = []

  // Şablondaki dersler (toplu olan grupların dersleri atlanır)
  for (const ders of sablon.dersler) {
    if (atlanacakDersIdleri.has(ders.id)) continue
    const once = oa.dersNetleri[ders.id]
    const sonra = ob.dersNetleri[ders.id]
    if (once === undefined || sonra === undefined) continue
    degisimler.push({
      dersId: ders.id,
      ad: ders.ad,
      onceki: once,
      son: sonra,
      fark: yuvarla(sonra - once),
    })
  }

  // En az bir denemede toplu girilen gruplar tek grup satırı olarak eklenir
  for (const g of gruplar) {
    if (!topluGrupKumesi.has(g.grup)) continue
    const once = grupNeti(aDeneme, sablon, g.grup)
    const sonra = grupNeti(bDeneme, sablon, g.grup)
    if (once === null || sonra === null) continue
    degisimler.push({
      dersId: g.grup,
      ad: TOPLU_GRUP_ADI[g.grup],
      onceki: once,
      son: sonra,
      fark: yuvarla(sonra - once),
      toplu: true,
    })
  }

  return degisimler
}

/**
 * Ders bazında ilerleyiş sayfası için değişim listesi:
 * Şablonun dersleri yalnız ders ders denemelerden çizilir (biri topluysa atlanır).
 * Grubu olan şablonlarda Sosyal ve Fen için grup neti serisi ("Sosyal (toplam)",
 * "Fen (toplam)") her zaman çizilir (her deneme için grupNeti).
 */
export function dersBazindaIlerleyisler(
  aDeneme: Deneme,
  bDeneme: Deneme,
  sablon: Sablon,
): DersDegisimi[] {
  const oa = denemeOzeti(aDeneme, sablon)
  const ob = denemeOzeti(bDeneme, sablon)

  const degisimler: DersDegisimi[] = []

  // 1. Mevcut ders serileri: yalnız ders ders girilmişse var olur
  for (const ders of sablon.dersler) {
    const once = oa.dersNetleri[ders.id]
    const sonra = ob.dersNetleri[ders.id]
    if (once === undefined || sonra === undefined) continue
    degisimler.push({
      dersId: ders.id,
      ad: ders.ad,
      onceki: once,
      son: sonra,
      fark: yuvarla(sonra - once),
    })
  }

  // 2. Grubu olan şablonlarda Sosyal ve Fen grup toplamı her zaman çizilir
  const gruplar = sablonGruplari(sablon)
  for (const g of gruplar) {
    const once = grupNeti(aDeneme, sablon, g.grup)
    const sonra = grupNeti(bDeneme, sablon, g.grup)
    if (once === null || sonra === null) continue
    const enAzBiriToplu = [aDeneme, bDeneme].some((d) =>
      gecerliToplu(d, sablon).some((t) => t.grup === g.grup),
    )
    degisimler.push({
      dersId: `${g.grup}-toplam`,
      ad: `${TOPLU_GRUP_ADI[g.grup]} (toplam)`,
      onceki: once,
      son: sonra,
      fark: yuvarla(sonra - once),
      toplu: enAzBiriToplu,
    })
  }

  return degisimler
}

export type IstatistikOzeti = {
  denemeSayisi: number
  sonNet: number
  /** Tek deneme varken karşılaştırılacak bir önceki yok. */
  oncekiNet: number | null
  ortalama: number
  enYuksek: number
  enDusuk: number
  /** Son dört denemenin toplam neti, eskiden yeniye. */
  sonDortNet: number[]
  /** Son deneme ile bir öncekinin ders ders farkı; tek denemede boş. */
  degisimler: DersDegisimi[]
  /** Ders bazında ilerleyiş sayfası için; grup serileri dahil. */
  dersIlerleyisleri: DersDegisimi[]
  /** Ortalama netin soru sayısına oranı en yüksek / en düşük ders. */
  enGucluDers: string | null
  enZayifDers: string | null
  /** Toplu girilen gruplar — ders analizindeki "N denemede toplu girildi" notu. */
  topluNotlari: TopluNotu[]
}

export function istatistikOzeti(denemeler: Deneme[], sablon: Sablon): IstatistikOzeti | null {
  const sirali = tarihSirala(denemeler)
  if (sirali.length === 0) return null

  const ozetler = sirali.map((d) => denemeOzeti(d, sablon))
  const netler = ozetler.map((o) => o.toplamNet)
  const son = ozetler[ozetler.length - 1]
  const onceki = ozetler.length > 1 ? ozetler[ozetler.length - 2] : null

  const sonDeneme = sirali[sirali.length - 1]
  const oncekiDeneme = sirali.length > 1 ? sirali[sirali.length - 2] : null

  const degisimler: DersDegisimi[] =
    oncekiDeneme && sonDeneme ? dersDegisimleri(oncekiDeneme, sonDeneme, sablon) : []
  const dersIlerleyisleri: DersDegisimi[] =
    oncekiDeneme && sonDeneme ? dersBazindaIlerleyisler(oncekiDeneme, sonDeneme, sablon) : []

  // Ders kıyası ham net değil oranla: 40 soruluk Türkçe'nin 20 neti, 5 soruluk
  // Felsefe'nin 4 netinden "güçlü" değil. Ortalama yalnız dersin ders ders
  // girildiği denemelerden; hiç verisi olmayan ders kıyasa girmez.
  const oranlar = sablon.dersler
    .filter((d) => d.soruSayisi > 0)
    .flatMap((ders) => {
      const netler = ozetler.flatMap((o) =>
        o.dersNetleri[ders.id] === undefined ? [] : [o.dersNetleri[ders.id]],
      )
      if (netler.length === 0) return []
      const toplam = netler.reduce((t, n) => t + n, 0)
      return [{ ad: ders.ad, oran: toplam / netler.length / ders.soruSayisi }]
    })
  const oranSirali = [...oranlar].sort((a, b) => b.oran - a.oran)

  return {
    denemeSayisi: sirali.length,
    sonNet: son.toplamNet,
    oncekiNet: onceki ? onceki.toplamNet : null,
    ortalama: yuvarla(netler.reduce((a, b) => a + b, 0) / netler.length),
    enYuksek: Math.max(...netler),
    enDusuk: Math.min(...netler),
    sonDortNet: netler.slice(-4),
    degisimler,
    dersIlerleyisleri,
    enGucluDers: oranSirali[0]?.ad ?? null,
    // Tek ders varsa aynı ders iki kutuda birden yazılırdı.
    enZayifDers: oranSirali.length > 1 ? oranSirali[oranSirali.length - 1].ad : null,
    topluNotlari: topluNotlari(sirali, sablon),
  }
}

/** Net artan dersler, en çok artan başta. */
export function ilerleyenDersler(degisimler: DersDegisimi[]): DersDegisimi[] {
  return degisimler.filter((d) => yon(d.fark) === 'artti').sort((a, b) => b.fark - a.fark)
}

export type Karsilastirma = {
  /** A her zaman eski deneme — seçim sırası değil tarih belirliyor. */
  a: Deneme
  b: Deneme
  aNet: number
  bNet: number
  toplamFark: number
  artanlar: DersDegisimi[]
  azalanlar: DersDegisimi[]
  sabitler: DersDegisimi[]
  /** İki denemeden birinde toplu girilen gruplar — dersleri kıyasa girmedi. */
  topluGruplar: TopluGrup[]
}

/** İki denemeyi ders ders karşılaştırır; sıralama farkın büyüklüğüne göre. */
export function denemeKarsilastir(x: Deneme, y: Deneme, sablon: Sablon): Karsilastirma {
  const [a, b] = tarihSirala([x, y])
  const oa = denemeOzeti(a, sablon)
  const ob = denemeOzeti(b, sablon)

  const satirlar = dersDegisimleri(a, b, sablon).sort(
    (p, q) => Math.abs(q.fark) - Math.abs(p.fark),
  )
  const topluGruplar = TOPLU_GRUPLAR.filter((g) =>
    [a, b].some((d) => gecerliToplu(d, sablon).some((t) => t.grup === g)),
  )

  return {
    a,
    b,
    aNet: oa.toplamNet,
    bNet: ob.toplamNet,
    toplamFark: yuvarla(ob.toplamNet - oa.toplamNet),
    artanlar: satirlar.filter((s) => yon(s.fark) === 'artti'),
    azalanlar: satirlar.filter((s) => yon(s.fark) === 'azaldi'),
    sabitler: satirlar.filter((s) => yon(s.fark) === 'ayni'),
    topluGruplar,
  }
}

/**
 * Karşılaştırma seçimi: iki yer var, üçüncü seçim en eskisini düşürüyor.
 * Aynı denemeye yeniden dokunmak seçimi kaldırıyor.
 */
export function secimGuncelle(secili: string[], id: string): string[] {
  if (secili.includes(id)) return secili.filter((x) => x !== id)
  if (secili.length >= 2) return [secili[1], id]
  return [...secili, id]
}
