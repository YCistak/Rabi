/**
 * Ana sayfada gösterilen motivasyon sözleri. Havuzdan seçilir; her açılışta değişir.
 *
 * Kaynağı belirsiz "ünlü söz" alıntıları bilerek kullanılmadı — internette dolaşan
 * çoğu yanlış kişiye atfediliyor. Buradakiler ya kaynağı belli ya da anonim/atıfsız
 * cümleler; hiçbiri gerçek bir kişiye asılsız biçimde mal edilmiyor.
 */
import { tohumlaSec } from './utils'

export type Soz = {
  metin: string
  kaynak?: string
}

export const SOZLER: Soz[] = [
  { metin: 'Bugün çözmediğin soru, sınavda karşına çıkacak olan.' },
  { metin: 'Az ama her gün, çoktan ama ara ara iyidir.' },
  { metin: 'Yanlışın, doğruyu öğrenmenin en kısa yolu.' },
  { metin: 'Bir konuyu bitirmek, yüz konuya başlamaktan iyidir.' },
  { metin: 'Motivasyon başlatır, alışkanlık bitirir.' },
  { metin: 'Netin düştüğü gün pes edilecek gün değil, bakılacak gündür.' },
  { metin: 'Kimse ilk denemede iyi değildi. Sen de olmayacaksın; olacaksın.' },
  { metin: 'Ertelediğin her soru, gelecek haftanın yüküne ekleniyor.' },
  { metin: 'Zorlandığın konu, en çok puan kazandıracağın konudur.' },
  { metin: 'Bugün 20 soru bile bir şeydir. Sıfır değildir.' },
  { metin: 'Deneme netin bir fotoğraf, gidişatın ise film. Filme bak.' },
  { metin: 'Çalışmaya başlamak için hazır hissetmeyi bekleme; hazır hissetmek çalışınca gelir.' },
  { metin: 'Kolay soruları hızlı çöz, kazandığın zamanı zorlara ayır.' },
  { metin: 'Not tutmadan geçtiğin konu, iki hafta sonra hiç görmemiş gibi olacak.' },
  { metin: 'Rakibin sınıftaki arkadaşın değil, dün akşamki hâlin.' },
  { metin: 'Bir soruyu anlamadan geçmek, o soruyu ikinci kez kaybetmektir.' },
  { metin: 'Plan yapmak çalışmak değildir. Planı kapat, soruyu aç.' },
  { metin: 'Uykusuz çalışılan üç saat, dinlenmiş bir saatten az eder.' },
  { metin: 'Her denemede aynı hatayı yapıyorsan, sorun konu değil, alışkanlık.' },
  { metin: 'Yavaş gitmenin sakıncası yok; durmanın var.' },
  { metin: 'Hedefini yazmayan, hedefi olduğunu sanır.' },
  { metin: 'Bugünü kurtaran çalışma değil, tekrar edilen çalışma kalıcıdır.' },
  { metin: 'Boş bıraktığın soru da bir karardır — doğru karar mıydı, ona bak.' },
  { metin: 'Konuyu bilmek başka, soruyu çözmek başka. İkisini de yap.' },
  { metin: 'Bir yıl uzun görünür; 365 gün kısa. Günü çalış.' },
]

/**
 * Havuzdan bir söz seçer. `tohum` verilirse aynı tohum aynı sözü döndürür —
 * gün içinde ekran her yeniden çizildiğinde söz zıplamasın diye tarih tohum olarak
 * kullanılabilir. Tohum verilmezse rastgele seçilir.
 */
export function sozSec(tohum?: string): Soz {
  if (tohum === undefined) return SOZLER[Math.floor(Math.random() * SOZLER.length)]
  return tohumlaSec(SOZLER, tohum)
}
