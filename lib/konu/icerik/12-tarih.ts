import { program, tema } from '../tip'
import { tarih12Mucadele } from './12-tarih-t1'
import { tarih12Inkilap } from './12-tarih-t2'
import { tarih12IkiSavasArasi, tarih12IkinciDunya } from './12-tarih-t3'
import { tarih12SogukSavas, tarih12Yumusama } from './12-tarih-t5'
import { tarih12Kuresel } from './12-tarih-t7'

/**
 * 12. sınıf Tarih — **2018 programı** (MEB Ortaöğretim T.C. İnkılap Tarihi ve
 * Atatürkçülük + Çağdaş Türk ve Dünya Tarihi).
 *
 * Maarif Modeli'nin 12. sınıfı yayımlanmadı; bugünün 12. sınıfları ve
 * mezunlar 2018 programını görüyor (bkz. `docs/kurallar/konu-takibi.md`).
 * Tema adları 2018 ünitelerinden: Millî Mücadele, Atatürkçülük ve Türk
 * İnkılabı, İki Savaş Arası, II. Dünya Savaşı, Soğuk Savaş, Yumuşama ve
 * küreselleşme. `maarif.test.ts` bu programı denetlemiyor (iskelette 12 yok).
 *
 * 2018 programının 1. ünitesi ("20. Yüzyıl Başlarında Osmanlı Devleti ve
 * Dünya": Trablusgarp, Balkan Savaşları, I. Dünya Savaşı, Mondros öncesi)
 * 11. sınıf haritasında **zaten kartlı** (`trh11-siyasi`, `trh11-goc`),
 * burada tekrar yazılmadı; yalnız Mustafa Kemal'in 1918'e kadar hayatı
 * (programın 1.1 kazanımı) ayrı bir deste olarak eklendi.
 *
 * Çağdaş Türk ve Dünya Tarihi'nin üniteleri (İki Küresel Savaş Arasında
 * Dünya, II. Dünya Savaşı, Soğuk Savaş, Yumuşama, Küreselleşen Dünya) İnkılap
 * Tarihi'nin 4–8. üniteleriyle örtüştüğü için aynı destelerde birleşik
 * işlendi. *
 * Kapsam: 2018 programının kazanım başlıkları (8 ünite) esas alındı; yalnızca
 * emin olunan temel olaylar yazıldı. Yazılmayanlar: Orta Asya Türk
 * cumhuriyetlerinin ayrıntılı tarihi, Latin Amerika, Afrika devletlerinin tek
 * tek bağımsızlık tarihleri, 2000 sonrası Türk iç politikası.
 */
export const tarih12 = program('tarih', 12, 'Mustafa Kemal’den küreselleşen dünyaya', [
  tema('trh12-t1', 'Millî Mücadele', tarih12Mucadele),
  tema('trh12-t2', 'Atatürkçülük ve Türk İnkılabı', tarih12Inkilap),
  tema('trh12-t3', 'İki Savaş Arasındaki Dönemde Türkiye ve Dünya', tarih12IkiSavasArasi),
  tema('trh12-t4', 'II. Dünya Savaşı Sürecinde Türkiye ve Dünya', tarih12IkinciDunya),
  tema('trh12-t5', 'II. Dünya Savaşı Sonrasında Türkiye ve Dünya', tarih12SogukSavas),
  tema('trh12-t6', 'Toplumsal Devrim Çağında Dünya ve Türkiye', tarih12Yumusama),
  tema('trh12-t7', 'XXI. Yüzyılın Eşiğinde Türkiye ve Dünya', tarih12Kuresel),
])
