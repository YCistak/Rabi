/**
 * Cihaza verilen okunur ad — saf üreteç.
 *
 * Eskiden `yeniId()` kullanılıyordu ve tabloda `mtoptoc2-1zvbcy` gibi
 * duruyordu: teknik olarak doğru, gözle ayırt edilemez. Bildirim tablosunda
 * asıl iş "bu satırlar aynı kişiden mi" sorusunu cevaplamak ve o soru gözle
 * cevaplanıyor — okunmayan bir numara işi görmüyordu.
 *
 * Ad üç parçadan kuruluyor: renk + hayvan + iki hane. Kelimeler kasıtlı olarak
 * nötr; kişiyi çağrıştıran hiçbir şey (isim, şehir, okul) listeye girmiyor.
 *
 * Kaç farklı ad çıkabiliyor: 12 × 16 × 100 = 19.200. Çakışma ihtimali küçük bir
 * kullanıcı kitlesinde göz ardı edilebilir; zaten kimlik değil, tabloda
 * gruplamaya yarayan bir etiket. Çakışırsa iki kişinin bildirimleri aynı adla
 * görünür, kaybolan bir şey olmaz.
 */

const RENKLER = [
  'mavi', 'yesil', 'mor', 'turuncu', 'sari', 'kirmizi',
  'pembe', 'lacivert', 'bordo', 'gri', 'bej', 'turkuaz',
]

const HAYVANLAR = [
  'tavsan', 'kunduz', 'kirpi', 'baykus', 'tilki', 'geyik',
  'sincap', 'kaplumbaga', 'yunus', 'sahin', 'panda', 'vasak',
  'ceylan', 'porsuk', 'marti', 'kelebek',
]

function sec<T>(liste: T[]): T {
  return liste[Math.floor(Math.random() * liste.length)]
}

/** `mavi-tavsan-42` biçiminde yeni bir ad. */
export function yeniCihazAdi(): string {
  const sayi = String(Math.floor(Math.random() * 100)).padStart(2, '0')
  return `${sec(RENKLER)}-${sec(HAYVANLAR)}-${sayi}`
}
