export type MetinParcasi =
  | { tur: 'metin'; metin: string }
  | { tur: 'ust'; metin: string }
  | { tur: 'alt'; metin: string }

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
    if (harita) {
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
