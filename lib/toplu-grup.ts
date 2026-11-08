import type { Deneme, OsymTest, Sablon, TopluGrup, TopluSonuc } from './types'

/*
  Denemede Sosyal ve Fen'i toplu girme (kullanıcı istedi, 2026-11): öğrenci
  çoğu zaman "sosyalden 20 doğru 0 yanlış" diye biliyor, ders ders ayırmıyor.

  Toplu sonuç **derslere bölünmez**: "Tarih 5 doğru" gibi bir sayı
  uydurulsaydı ders istatistiği sahte veriyle çizilirdi (AGENTS.md "Doğruluk").
  Toplu net yalnız toplam nete, ÖSYM test netine ve puan tahminine girer; ders
  serisinde o deneme boş kalır.
*/

export const TOPLU_GRUPLAR: readonly TopluGrup[] = ['sosyal', 'fen']

export const TOPLU_GRUP_ADI: Record<TopluGrup, string> = {
  sosyal: 'Sosyal',
  fen: 'Fen',
}

/**
 * Grup üyeliği şablon dersinin kimliğinden (`lib/sablonlar.ts`). AYT'nin
 * Tarih-1/2, Coğrafya-1/2 kimlikleri de Sosyal'e girer; Edebiyat/Türkçe girmez.
 * Kullanıcının "Başka ders"le eklediği dersin kimliği bunlardan biri değilse
 * gruba girmez, ders ders kalır.
 */
const GRUP_UYELERI: Record<TopluGrup, readonly string[]> = {
  fen: ['fizik', 'kimya', 'biyoloji'],
  sosyal: ['tarih', 'cografya', 'felsefe', 'din', 'tarih1', 'cografya1', 'tarih2', 'cografya2'],
}

/** Dersin toplu grubu; gruba girmeyen derste `null`. */
export function dersinGrubu(dersId: string): TopluGrup | null {
  for (const grup of TOPLU_GRUPLAR) if (GRUP_UYELERI[grup].includes(dersId)) return grup
  return null
}

export type SablonGrubu = { grup: TopluGrup; dersIdleri: string[]; soruSayisi: number }

/**
 * Şablonda toplu girilebilen gruplar — yalnız en az iki üyesi olanlar: tek
 * dersli bir "grup" zaten ders ders girişle aynı şey.
 */
export function sablonGruplari(sablon: Sablon): SablonGrubu[] {
  return TOPLU_GRUPLAR.flatMap((grup) => {
    const dersler = sablon.dersler.filter((d) => dersinGrubu(d.id) === grup)
    if (dersler.length < 2) return []
    return [
      {
        grup,
        dersIdleri: dersler.map((d) => d.id),
        soruSayisi: dersler.reduce((t, d) => t + d.soruSayisi, 0),
      },
    ]
  })
}

/** Toplu satırın geçerliliği: sayılar ≥ 0 tam sayı, doğru + yanlış ≤ grubun soru sayısı. */
export function topluGecerliMi(sonuc: TopluSonuc, soruSayisi: number): boolean {
  if (!Number.isInteger(sonuc.dogru) || !Number.isInteger(sonuc.yanlis)) return false
  if (sonuc.dogru < 0 || sonuc.yanlis < 0) return false
  return sonuc.dogru + sonuc.yanlis <= soruSayisi
}

/**
 * Denemenin şablona göre geçerli toplu satırları. Şablonda olmayan grup,
 * bozuk sayı ya da aynı grubun ikinci satırı atılır — hesaplar yalnız bunu
 * okur, bozuk bir kayıt toplam neti şişirmesin.
 */
export function gecerliToplu(deneme: Pick<Deneme, 'toplu'>, sablon: Sablon): TopluSonuc[] {
  if (!Array.isArray(deneme.toplu) || deneme.toplu.length === 0) return []
  const gruplar = sablonGruplari(sablon)
  const gorulen = new Set<TopluGrup>()
  const sonuc: TopluSonuc[] = []
  for (const satir of deneme.toplu) {
    const grup = gruplar.find((g) => g.grup === satir?.grup)
    if (!grup || gorulen.has(grup.grup) || !topluGecerliMi(satir, grup.soruSayisi)) continue
    gorulen.add(grup.grup)
    sonuc.push({ grup: grup.grup, dogru: satir.dogru, yanlis: satir.yanlis })
  }
  return sonuc
}

/** Bu denemede toplu girilmiş grupların ders kimlikleri — ders serisinde boş kalanlar. */
export function topluDersIdleri(deneme: Pick<Deneme, 'toplu'>, sablon: Sablon): Set<string> {
  const gruplar = sablonGruplari(sablon)
  const idler = new Set<string>()
  for (const satir of gecerliToplu(deneme, sablon)) {
    for (const id of gruplar.find((g) => g.grup === satir.grup)?.dersIdleri ?? []) idler.add(id)
  }
  return idler
}

/**
 * Toplu grup netini ÖSYM testlerine dağıtır — **yalnız puan tahmini için**.
 *
 * TYT'de grubun bütün dersleri tek teste bağlı (`tyt-sosyal`, `tyt-fen`):
 * net olduğu gibi o teste gider. AYT'de grup birden çok teste yayılıyorsa
 * (AYT Fen = Fizik/Kimya/Biyoloji testleri) net üye derslerin şablondaki
 * soru sayısına **orantılı** bölünür. Bu bir varsayım ve puan zaten "tahmin"
 * diye sunuluyor; ders istatistiğine yazılmaz. ÖSYM testi olmayan üyenin
 * payı hiçbir teste gitmez — ders ders girişte de o ders puana katılmıyor.
 */
export function topluTestDagilimi(
  grupNeti: number,
  grup: TopluGrup,
  sablon: Sablon,
): Partial<Record<OsymTest, number>> {
  const uyeler = sablon.dersler.filter((d) => dersinGrubu(d.id) === grup)
  const toplam = uyeler.reduce((t, d) => t + d.soruSayisi, 0)
  const dagilim: Partial<Record<OsymTest, number>> = {}
  if (toplam <= 0) return dagilim
  for (const ders of uyeler) {
    if (!ders.osymTesti) continue
    dagilim[ders.osymTesti] = (dagilim[ders.osymTesti] ?? 0) + (grupNeti * ders.soruSayisi) / toplam
  }
  return dagilim
}
