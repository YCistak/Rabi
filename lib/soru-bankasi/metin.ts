export type MetinParcasi =
  | { tur: 'metin'; metin: string }
  | { tur: 'ust'; metin: string }
  | { tur: 'alt'; metin: string }

import { kesirParcala, type KesirParcasi } from '../kesir'

const UST = new Map([
  ['⁰', '0'], ['¹', '1'], ['²', '2'], ['³', '3'], ['⁴', '4'], ['⁵', '5'],
  ['⁶', '6'], ['⁷', '7'], ['⁸', '8'], ['⁹', '9'], ['⁺', '+'], ['⁻', '-'],
  ['⁼', '='], ['⁽', '('], ['⁾', ')'], ['ⁿ', 'n'], ['ˣ', 'x'], ['ʸ', 'y'],
  ['ᵗ', 't'], ['ᵃ', 'a'], ['ᵇ', 'b'], ['ᵏ', 'k'], ['ᵐ', 'm'], ['⁄', '/'],
])

const ALT = new Map([
  ['₀', '0'], ['₁', '1'], ['₂', '2'], ['₃', '3'], ['₄', '4'], ['₅', '5'],
  ['₆', '6'], ['₇', '7'], ['₈', '8'], ['₉', '9'], ['₊', '+'], ['₋', '-'],
  ['₌', '='], ['₍', '('], ['₎', ')'], ['ₙ', 'n'], ['ₓ', 'x'], ['ₐ', 'a'],
  ['ₑ', 'e'], ['ₕ', 'h'], ['ₖ', 'k'], ['ₘ', 'm'], ['ₚ', 'p'], ['ₛ', 's'], ['ₜ', 't'],
])

function paranteziAc(metin: string): string {
  return metin.startsWith('(') && metin.endsWith(')') ? metin.slice(1, -1) : metin
}

/** Unicode ve düz üs/alt simgeleri, çizim bileşeninin anlayacağı parçalara ayırır. */
export function simgeleriParcala(metin: string): MetinParcasi[] {
  const parcalar: MetinParcasi[] = []
  let duz = ''
  const ekleDuz = () => {
    if (duz) parcalar.push({ tur: 'metin', metin: duz })
    duz = ''
  }

  for (let sira = 0; sira < metin.length;) {
    const karakter = metin[sira]
    const harita = UST.has(karakter) ? UST : ALT.has(karakter) ? ALT : null
    // Derece işaretinden sonraki ek ("90°'dir") matematik üssü değildir.
    // Veri içindeki bazı kesme işaretleri üst simge karakteri olarak gelmişti.
    if (harita && metin[sira - 1] !== '°') {
      ekleDuz()
      let deger = ''
      while (sira < metin.length && harita.has(metin[sira])) {
        deger += harita.get(metin[sira])
        sira++
      }
      parcalar.push({ tur: harita === UST ? 'ust' : 'alt', metin: paranteziAc(deger) })
      continue
    }
    if ((karakter === '^' || karakter === '_') && metin[sira + 1] === '(') {
      const bitis = metin.indexOf(')', sira + 2)
      if (bitis !== -1) {
        ekleDuz()
        parcalar.push({ tur: karakter === '^' ? 'ust' : 'alt', metin: metin.slice(sira + 2, bitis) })
        sira = bitis + 1
        continue
      }
    }
    duz += karakter
    sira++
  }
  ekleDuz()
  return parcalar
}

const BIRIMLER = new Set(['a', 'cm', 'dm', 'g', 'h', 'j', 'k', 'kg', 'km', 'l', 'lt', 'm', 'mg', 'mm', 'n', 'pa', 's', 'sa', 'tl', 'v', 'w'])

/**
 * Matematik kesrini birim eğik çizgisinden ayırır.
 *
 * Tek harfli `a/b` cebirsel kesirdir; tanınan ölçü birimleri ise (üsleri
 * `simgeleriParcala` ayrı taşısa bile) düz yazılır.
 */
export function kesirParcalariSec(metin: string): KesirParcasi[] {
  const cikti: KesirParcasi[] = []
  for (const parca of kesirParcala(metin)) {
    const pay = parca.tur === 'kesir' ? parca.pay.toLocaleLowerCase('tr-TR') : ''
    const payda = parca.tur === 'kesir' ? parca.payda.toLocaleLowerCase('tr-TR') : ''
    const birim = parca.tur === 'kesir' && BIRIMLER.has(pay) && BIRIMLER.has(payda) && !(pay === 'a' && payda === 'b')
    const duz = birim ? { tur: 'metin' as const, metin: `${parca.pay}/${parca.payda}` } : parca
    const son = cikti[cikti.length - 1]
    if (duz.tur === 'metin' && son?.tur === 'metin') son.metin += duz.metin
    else cikti.push(duz.tur === 'metin' ? { ...duz } : duz)
  }
  return cikti
}
