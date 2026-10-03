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

import { denemeOzeti, tarihSirala, yuvarla } from './hesap'
import type { Deneme, Sablon } from './types'

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
  /** Ortalama netin soru sayısına oranı en yüksek / en düşük ders. */
  enGucluDers: string | null
  enZayifDers: string | null
}

export function istatistikOzeti(denemeler: Deneme[], sablon: Sablon): IstatistikOzeti | null {
  const sirali = tarihSirala(denemeler)
  if (sirali.length === 0) return null

  const ozetler = sirali.map((d) => denemeOzeti(d, sablon))
  const netler = ozetler.map((o) => o.toplamNet)
  const son = ozetler[ozetler.length - 1]
  const onceki = ozetler.length > 1 ? ozetler[ozetler.length - 2] : null

  const degisimler: DersDegisimi[] = onceki
    ? sablon.dersler.map((ders) => {
        const a = onceki.dersNetleri[ders.id] ?? 0
        const b = son.dersNetleri[ders.id] ?? 0
        return { dersId: ders.id, ad: ders.ad, onceki: a, son: b, fark: yuvarla(b - a) }
      })
    : []

  // Ders kıyası ham net değil oranla: 40 soruluk Türkçe'nin 20 neti, 5 soruluk
  // Felsefe'nin 4 netinden "güçlü" değil.
  const oranlar = sablon.dersler
    .filter((d) => d.soruSayisi > 0)
    .map((ders) => {
      const toplam = ozetler.reduce((t, o) => t + (o.dersNetleri[ders.id] ?? 0), 0)
      return { ad: ders.ad, oran: toplam / ozetler.length / ders.soruSayisi }
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
    enGucluDers: oranSirali[0]?.ad ?? null,
    // Tek ders varsa aynı ders iki kutuda birden yazılırdı.
    enZayifDers: oranSirali.length > 1 ? oranSirali[oranSirali.length - 1].ad : null,
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
}

/** İki denemeyi ders ders karşılaştırır; sıralama farkın büyüklüğüne göre. */
export function denemeKarsilastir(x: Deneme, y: Deneme, sablon: Sablon): Karsilastirma {
  const [a, b] = tarihSirala([x, y])
  const oa = denemeOzeti(a, sablon)
  const ob = denemeOzeti(b, sablon)

  const satirlar = sablon.dersler
    .map((ders) => {
      const once = oa.dersNetleri[ders.id] ?? 0
      const sonra = ob.dersNetleri[ders.id] ?? 0
      return { dersId: ders.id, ad: ders.ad, onceki: once, son: sonra, fark: yuvarla(sonra - once) }
    })
    .sort((p, q) => Math.abs(q.fark) - Math.abs(p.fark))

  return {
    a,
    b,
    aNet: oa.toplamNet,
    bNet: ob.toplamNet,
    toplamFark: yuvarla(ob.toplamNet - oa.toplamNet),
    artanlar: satirlar.filter((s) => yon(s.fark) === 'artti'),
    azalanlar: satirlar.filter((s) => yon(s.fark) === 'azaldi'),
    sabitler: satirlar.filter((s) => yon(s.fark) === 'ayni'),
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
