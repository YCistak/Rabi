/**
 * Düz metindeki güvenli kesir parçaları.
 *
 * Soru üretim biçiminde kesirler boşluksuz yazılır (`(x+1)/(x−2)`). Buna
 * karşılık birim ve tarihlerin eğik çizgisi matematiksel kesir değildir.
 * Bu yüzden yalnızca sözcük sınırında duran iki kısa ifade arasındaki tek
 * eğik çizgi tanınır; `m/s`, `km/sa` ve `12/10/2026` özellikle dışarıda kalır.
 */
export type KesirParcasi =
  | { tur: 'metin'; metin: string }
  | { tur: 'kesir'; pay: string; payda: string }

const IFADE = String.raw`(?:\([^()]+\)|[0-9A-Za-zÇĞİÖŞÜçğıöşü√π]+)`
const ADAY = new RegExp(`(${IFADE})/(${IFADE})`, 'g')
const SOZCUK = /[0-9A-Za-zÇĞİÖŞÜçğıöşü_]/
const BIRIMLER = new Set(['m/s', 'km/sa'])

function sinirdaMi(metin: string, bas: number, son: number): boolean {
  const once = metin[bas - 1]
  const sonra = metin[son]
  // Kesrin iki yanında yeni bir sözcüğe yapışma olmaz. Noktalama ve boşluk
  // serbesttir; böylece "x/2," ile "(a+b)/(c+d) ise" okunur kalır.
  return !(once && (SOZCUK.test(once) || once === ')')) && !(sonra && (SOZCUK.test(sonra) || sonra === '(' || sonra === '/'))
}

/** Metni erişilebilir metin/kesir parçalarına ayırır. */
export function kesirParcala(metin: string): KesirParcasi[] {
  const parcalar: KesirParcasi[] = []
  let son = 0
  ADAY.lastIndex = 0

  for (let eslesme = ADAY.exec(metin); eslesme; eslesme = ADAY.exec(metin)) {
    const [tam, pay, payda] = eslesme
    const bas = eslesme.index
    const bitis = bas + tam.length
    if (!sinirdaMi(metin, bas, bitis) || BIRIMLER.has(tam.toLocaleLowerCase('tr-TR'))) continue
    if (bas > son) parcalar.push({ tur: 'metin', metin: metin.slice(son, bas) })
    parcalar.push({ tur: 'kesir', pay, payda })
    son = bitis
  }

  if (son < metin.length || parcalar.length === 0) parcalar.push({ tur: 'metin', metin: metin.slice(son) })
  return parcalar
}
