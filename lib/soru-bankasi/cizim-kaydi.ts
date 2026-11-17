/**
 * Soru başına karalamanın kalıcı biçimi — saf hesap.
 *
 * Çizgiler IndexedDB'ye yazılır (`cizim-depo.ts`), localStorage'a değil:
 * bir testin çizimleri yüzlerce nokta tutar. Geri al / ileri al geçmişi
 * yazılmaz (yalnız son hâl); noktalar bir ondalığa yuvarlanır — içerik
 * pikselinde gözle ayırt edilmez, kayıt yarıya iner.
 */
import type { SayfaCizgisi } from '@/lib/cizim'

/** Soru sırası → çizgiler. */
export type TestCizimleri = Record<number, SayfaCizgisi[]>

const yuvarla = (deger: number) => Math.round(deger * 10) / 10

export function cizimleriSadelestir(cizimler: Readonly<Record<number, readonly SayfaCizgisi[]>>): TestCizimleri {
  const sonuc: TestCizimleri = {}
  for (const [sira, cizgiler] of Object.entries(cizimler)) {
    if (!cizgiler || cizgiler.length === 0) continue
    sonuc[Number(sira)] = cizgiler.map((cizgi) => ({
      ...cizgi,
      kalinlik: yuvarla(cizgi.kalinlik),
      noktalar: cizgi.noktalar.map(([x, y]) => [yuvarla(x), yuvarla(y)] as [number, number]),
    }))
  }
  return sonuc
}

const RENKLER = new Set(['kursun', 'kirmizi', 'mavi', 'yesil', 'vurgu'])
const sayi = (deger: unknown): deger is number => typeof deger === 'number' && Number.isFinite(deger)

function cizgiCoz(ham: unknown): SayfaCizgisi | null {
  if (typeof ham !== 'object' || ham === null) return null
  const c = ham as Record<string, unknown>
  if (c.arac !== 'kalem' && c.arac !== 'vurgu') return null
  if (typeof c.renk !== 'string' || !RENKLER.has(c.renk) || !sayi(c.kalinlik) || c.kalinlik <= 0) return null
  if (!Array.isArray(c.noktalar)) return null
  const noktalar = c.noktalar.filter(
    (n): n is [number, number] => Array.isArray(n) && n.length === 2 && sayi(n[0]) && sayi(n[1]),
  )
  if (noktalar.length === 0) return null
  return { arac: c.arac, renk: c.renk as SayfaCizgisi['renk'], kalinlik: c.kalinlik, noktalar }
}

/** Depodan okunanı süzer; bozuk çizgi atılır. */
export function cizimleriCoz(ham: unknown): TestCizimleri {
  if (typeof ham !== 'object' || ham === null || Array.isArray(ham)) return {}
  const sonuc: TestCizimleri = {}
  for (const [sira, cizgiler] of Object.entries(ham)) {
    if (!/^\d{1,3}$/.test(sira) || !Array.isArray(cizgiler)) continue
    const temiz = cizgiler.map(cizgiCoz).filter((c): c is SayfaCizgisi => c !== null)
    if (temiz.length > 0) sonuc[Number(sira)] = temiz
  }
  return sonuc
}
