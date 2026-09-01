/**
 * Formül–Ad Eşleştirme'nin bileşik havuzu.
 *
 * Ölçüt "kimyada geçen bileşik" değil, **soruyu okumak için gereken** bileşik:
 * NaHCO₃'ün ne olduğunu bilmeyen öğrenci sorunun kendisini okuyamıyor. Havuz
 * bu yüzden 9–10. sınıfın asit, baz, tuz ve yaygın bileşiklerinden ibaret;
 * organik adlandırma ve kompleks tuzlar hiç yok.
 *
 * Formüller **düz yazıyla** duruyor (`H2SO4`), alt indisli hâliyle değil.
 * Unicode'un alt indis rakamları her yazı tipinde bulunmuyor ve Nunito'da
 * bulunmadığında tarayıcı harf harf başka bir aileye düşüyor — aynı formülün
 * yarısı bir yazı tipinde, yarısı ötekinde çiziliyordu. Alt indisi çizim
 * tarafı kuruyor (`formulParcalari`, `formul.ts`).
 */

import type { Zorluk } from './ritim'

/**
 * Bileşiğin türü.
 *
 * El mümkün olduğunca tek türden kuruluyor (`formul.ts`): karışık bir elde
 * öğrenci formüle değil biçime bakıyor — "OH ile bitiyorsa bazdır" diye
 * eleyerek altı çifti de bulabiliyor. Aynı türden altı bileşik ise gerçekten
 * bilmeyi gerektiriyor.
 */
export type FormulTuru = 'asit' | 'baz' | 'tuz' | 'bilesik'

export const TUR_ADI: Record<FormulTuru, string> = {
  asit: 'Asitler',
  baz: 'Bazlar',
  tuz: 'Tuzlar',
  bilesik: 'Yaygın bileşikler',
}

export type FormulEsi = {
  /** Düz yazı formül — alt indisler çizim sırasında kuruluyor. */
  formul: string
  ad: string
  tur: FormulTuru
  zorluk: Zorluk
}

/** `[formül, ad]` çiftlerini tek türe bağlar — havuzu okunur tutmak için. */
function tur(
  tur: FormulTuru,
  taban: Zorluk,
  ciftler: ([string, string] | [string, string, Zorluk])[],
): FormulEsi[] {
  return ciftler.map(([formul, ad, zorluk]) => ({ formul, ad, tur, zorluk: zorluk ?? taban }))
}

export const FORMUL_HAVUZU: FormulEsi[] = [
  ...tur('asit', 'orta', [
    ['HCl', 'Hidroklorik asit', 'kolay'],
    ['H2SO4', 'Sülfürik asit', 'kolay'],
    ['HNO3', 'Nitrik asit', 'kolay'],
    ['CH3COOH', 'Asetik asit', 'kolay'],
    ['H3PO4', 'Fosforik asit'],
    ['H2CO3', 'Karbonik asit', 'kolay'],
    ['HF', 'Hidroflorik asit', 'zor'],
    ['HBr', 'Hidrobromik asit', 'zor'],
    ['HI', 'Hidroiyodik asit', 'zor'],
  ]),
  ...tur('baz', 'orta', [
    ['NaOH', 'Sodyum hidroksit', 'kolay'],
    ['KOH', 'Potasyum hidroksit', 'kolay'],
    ['NH3', 'Amonyak', 'kolay'],
    ['Ca(OH)2', 'Kalsiyum hidroksit', 'kolay'],
    ['Mg(OH)2', 'Magnezyum hidroksit', 'kolay'],
    ['Al(OH)3', 'Alüminyum hidroksit', 'zor'],
    ['Ba(OH)2', 'Baryum hidroksit', 'zor'],
    ['Fe(OH)3', 'Demir(III) hidroksit', 'zor'],
  ]),
  ...tur('tuz', 'orta', [
    ['NaCl', 'Sodyum klorür', 'kolay'],
    ['CaCO3', 'Kalsiyum karbonat', 'kolay'],
    ['KCl', 'Potasyum klorür', 'kolay'],
    ['NaHCO3', 'Sodyum bikarbonat', 'kolay'],
    ['Na2CO3', 'Sodyum karbonat', 'kolay'],
    ['KNO3', 'Potasyum nitrat'],
    ['CuSO4', 'Bakır(II) sülfat'],
    ['MgCl2', 'Magnezyum klorür'],
    ['Na2SO4', 'Sodyum sülfat'],
    ['AgNO3', 'Gümüş nitrat', 'zor'],
    ['CaSO4', 'Kalsiyum sülfat', 'zor'],
  ]),
  ...tur('bilesik', 'orta', [
    ['H2O', 'Su', 'kolay'],
    ['CO2', 'Karbon dioksit', 'kolay'],
    ['CO', 'Karbon monoksit', 'kolay'],
    ['CH4', 'Metan', 'kolay'],
    ['C2H5OH', 'Etanol'],
    ['C6H12O6', 'Glikoz', 'kolay'],
    ['H2O2', 'Hidrojen peroksit', 'kolay'],
    ['SO2', 'Kükürt dioksit'],
    ['NO2', 'Azot dioksit'],
    ['NO', 'Azot monoksit'],
    ['CaO', 'Kalsiyum oksit'],
    ['H2S', 'Hidrojen sülfür', 'zor'],
    ['SO3', 'Kükürt trioksit', 'zor'],
    ['SiO2', 'Silisyum dioksit', 'zor'],
  ]),
]
