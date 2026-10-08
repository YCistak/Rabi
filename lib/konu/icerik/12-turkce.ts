import { program } from '../tip'
import { girisHikayeTemalari } from './12-turkce-hikaye'
import { siirTemalari } from './12-turkce-siir'
import { romanTiyatroTemalari } from './12-turkce-roman'
import { denemeSoylevTemalari } from './12-turkce-deneme'

/**
 * 12. sınıf Türk Dili ve Edebiyatı — **2018 programı** (MEB Ortaöğretim Türk
 * Dili ve Edebiyatı, 12. sınıf).
 *
 * Maarif Modeli'nin 12. sınıfı yayımlanmadı; bugünün 12. sınıfları ve
 * mezunlar 2018 programını görüyor (bkz. `docs/kurallar/konu-takibi.md`). Tema
 * adları 2018 programının ünite adlarından: Giriş, Hikâye, Şiir, Roman,
 * Tiyatro, Deneme, Söylev. `maarif.test.ts` bu dersi zaten denetlemiyor.
 *
 * Program metni yayınlandığı biçimiyle doğrulanamadığı için bilerek dar
 * tutuldu: yalnız yazar–eser eşleşmesinden emin olunan örnekler yazıldı;
 * makale, eleştiri ve röportaj desteleri yazılmadı. 11. sınıfta kartı olan
 * Orhun Yazıtları, Âşık geleneği ve Küçürek Hikâye burada tekrarlanmadı
 * (söylev destesi Orhun’a yalnızca değiniyor).
 *
 * Konu sonu soruları ayrı dosyalarda (`12-turkce-*-sorular.ts`); hızlı
 * kontroller destelerin içinde (`12-turkce-yardimci.ts`).
 */
export const turkce12 = program('turkce', 12, 'Cumhuriyet edebiyatı: şiir, roman, sahne', [
  ...girisHikayeTemalari,
  ...siirTemalari,
  ...romanTiyatroTemalari,
  ...denemeSoylevTemalari,
])
