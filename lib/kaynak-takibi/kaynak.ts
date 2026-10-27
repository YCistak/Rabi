import type { KonuDersId } from '../konu/tip'
import { varsayilanSinif } from '../konu-takibi/sinif'
import { KAYNAK_SINIFLARI, konuKimligi, uniteler, type KaynakSinifi, type Unite } from './konular'

/**
 * Kaynak Takibi — öğrencinin test kitapları ve her kitapta bitirdiği konular.
 *
 * Kaynak bir sınıfın bir dersine bağlı; konuları o sınıfın listesinden geliyor
 * (`konular.ts`). Tik yalnızca "bitti / bitmedi": kitapta konu bir kez
 * çözülüp geçiliyor, Konu Takibi'ndeki aşamalara (okul, soru) burada gerek
 * yok. Bu yüzden iki takip birbirine bağlanmadı.
 */
export type Kaynak = {
  id: string
  ad: string
  sinif: KaynakSinifi
  ders: KonuDersId
  /** Eklendiği gün, 'YYYY-AA-GG'. Liste sırası için. */
  eklenme: string
  /** Bitirilen konuların kimlikleri (`konuKimligi`). */
  bitenler: string[]
}

/** Kartta tek satıra sığan uzunluk ("Limit Yayınları AYT Matematik Soru Bankası" kırpılır). */
export const EN_UZUN_KAYNAK_ADI = 40

/** Liste sınırı; localStorage küçük veri için ve 60 kitap zaten bir kütüphane. */
export const EN_COK_KAYNAK = 60

const DERS_KIMLIKLERI: readonly KonuDersId[] = [
  'matematik', 'turkce', 'fizik', 'kimya', 'biyoloji', 'tarih', 'cografya', 'ingilizce',
]

/** Baştaki/sondaki ve art arda boşlukları atıp sınıra kırpar. */
export function kaynakAdiKirp(ad: string): string {
  return ad.replace(/\s+/g, ' ').trim().slice(0, EN_UZUN_KAYNAK_ADI).trim()
}

/** Formun açılacağı sınıf: Konu Takibi'yle aynı kural (mezun 12, bilinmeyen 9). */
export const varsayilanKaynakSinifi: (buYilSinif: number) => KaynakSinifi = varsayilanSinif

/**
 * Depodan ya da yedekten geleni süzer. Bozuk kayıt atılıyor; bilinmeyen konu
 * kimlikleri **atılmıyor** — liste ileride düzeltilirse geri bağlanabilsinler,
 * sayımda zaten yok sayılıyorlar (`kaynakIlerlemesi`).
 */
export function kaynaklariCoz(ham: unknown): Kaynak[] {
  if (!Array.isArray(ham)) return []
  const gorulen = new Set<string>()
  const temiz: Kaynak[] = []
  for (const k of ham) {
    if (typeof k !== 'object' || k === null) continue
    const n = k as Partial<Kaynak>
    if (typeof n.id !== 'string' || n.id === '' || gorulen.has(n.id)) continue
    if (typeof n.ad !== 'string' || kaynakAdiKirp(n.ad) === '') continue
    if (!KAYNAK_SINIFLARI.includes(n.sinif as KaynakSinifi)) continue
    if (!DERS_KIMLIKLERI.includes(n.ders as KonuDersId)) continue
    gorulen.add(n.id)
    temiz.push({
      id: n.id,
      ad: kaynakAdiKirp(n.ad),
      sinif: n.sinif as KaynakSinifi,
      ders: n.ders as KonuDersId,
      eklenme: typeof n.eklenme === 'string' ? n.eklenme : '',
      bitenler: Array.isArray(n.bitenler)
        ? [...new Set(n.bitenler.filter((b): b is string => typeof b === 'string'))]
        : [],
    })
    if (temiz.length >= EN_COK_KAYNAK) break
  }
  return temiz
}

/** Yeni kaynak listenin başına eklenir; ad boşsa, ders o sınıfta yoksa ya da liste doluysa `null`. */
export function kaynakEkle(
  liste: Kaynak[],
  yeni: { id: string; ad: string; sinif: KaynakSinifi; ders: KonuDersId; eklenme: string },
): Kaynak[] | null {
  const ad = kaynakAdiKirp(yeni.ad)
  if (ad === '' || liste.length >= EN_COK_KAYNAK) return null
  if (uniteler(yeni.sinif, yeni.ders).length === 0) return null
  return [{ ...yeni, ad, bitenler: [] }, ...liste]
}

/** Yalnız ad değişir; sınıf ve ders sabit — değişseydi tikler başka listeye düşerdi. */
export function kaynakAdlandir(liste: Kaynak[], id: string, ad: string): Kaynak[] {
  const temiz = kaynakAdiKirp(ad)
  if (temiz === '') return liste
  return liste.map((k) => (k.id === id ? { ...k, ad: temiz } : k))
}

export function kaynakSil(liste: Kaynak[], id: string): Kaynak[] {
  return liste.filter((k) => k.id !== id)
}

/** Konunun tikini açar ya da kapatır (Yapılacaklar'daki görev gibi). */
export function konuIsaretle(liste: Kaynak[], kaynakId: string, konuId: string): Kaynak[] {
  return liste.map((k) => {
    if (k.id !== kaynakId) return k
    const bitenler = k.bitenler.includes(konuId)
      ? k.bitenler.filter((b) => b !== konuId)
      : [...k.bitenler, konuId]
    return { ...k, bitenler }
  })
}

/**
 * Ünitenin bütün konularını işaretler; hepsi zaten işaretliyse hepsini
 * kaldırır. Kitapta bir üniteyi topluca geçen öğrenci tek tek dokunmasın.
 */
export function uniteIsaretle(liste: Kaynak[], kaynakId: string, unite: Unite): Kaynak[] {
  const kimlikler = unite.konular.map(konuKimligi)
  return liste.map((k) => {
    if (k.id !== kaynakId) return k
    const hepsi = kimlikler.every((id) => k.bitenler.includes(id))
    const bitenler = hepsi
      ? k.bitenler.filter((b) => !kimlikler.includes(b))
      : [...k.bitenler, ...kimlikler.filter((id) => !k.bitenler.includes(id))]
    return { ...k, bitenler }
  })
}

export type Ilerleme = { biten: number; toplam: number }

/** Ünitede kaç konu bitti. */
export function uniteIlerlemesi(kaynak: Kaynak, unite: Unite): Ilerleme {
  return {
    biten: unite.konular.filter((ad) => kaynak.bitenler.includes(konuKimligi(ad))).length,
    toplam: unite.konular.length,
  }
}

/** Kaynağın bütün konularında ilerleme; listede olmayan kimlik sayılmaz. */
export function kaynakIlerlemesi(kaynak: Kaynak): Ilerleme {
  return uniteler(kaynak.sinif, kaynak.ders).reduce<Ilerleme>(
    (top, unite) => {
      const i = uniteIlerlemesi(kaynak, unite)
      return { biten: top.biten + i.biten, toplam: top.toplam + i.toplam }
    },
    { biten: 0, toplam: 0 },
  )
}

export function kaynakBittiMi(kaynak: Kaynak): boolean {
  const { biten, toplam } = kaynakIlerlemesi(kaynak)
  return toplam > 0 && biten === toplam
}

/**
 * Liste sırası: bitmemiş kaynaklar üstte, bitenler altta; ikisinin içinde
 * eklenme sırası (yeni üstte) korunur. Biten kitap artık açılmak için değil
 * başarının kaydı olarak duruyor.
 */
export function siraliKaynaklar(liste: Kaynak[]): Kaynak[] {
  return [...liste.filter((k) => !kaynakBittiMi(k)), ...liste.filter(kaynakBittiMi)]
}
