/**
 * Ana sayfa başlığındaki tavşan: günün hâline göre poz.
 *
 * Selamlamanın yanındaki baş bir süre her durumda aynı çizimdi ("kafası
 * gözüken maskot"); durum yalnızca ekran okuyucu etiketini değiştiriyordu.
 * Kullanıcı tavşanın günü göstermesini istedi — örneği "o gün hiç soru
 * girilmediyse uyusun". Kararı bu dosya veriyor; saf, React'ten ve saatten
 * bağımsız (saati ana sayfa veriyor), `ana-maskot.test.ts` her kuralı
 * denetliyor.
 *
 * ## Kurallar sıralı, ilk tutan kazanıyor
 *
 * 1. Pomodoro çalışma turu işliyor → laptopta çalışan. Kullanıcı şu an tam
 *    olarak bunu yapıyor; başka her bilgiden daha taze.
 * 2. Pomodoro molası işliyor → kahve içen.
 * 3. Devamsızlık hakkı aşıldı → üzgün. Eski davranışın aynısı (durum
 *    `uzgun`du); şimdi görsel de söylüyor.
 * 4. Sınav günü → bağdaş kurmuş, sakin. `gunun-hali.ts` o gün soru sayısından
 *    bağımsız olarak "dinlen" diyor; tavşan da çalışmıyor.
 * 5. Günlük hedef tuttu → dans eden / alkışlayan / kahkaha atan (günden güne).
 * 6. Bugün başlandı, hedefe ulaşılmadı → deftere yazan / kitabı inceleyen.
 * 7. Bugün hiç kayıt yok:
 *    - gece (22:00–04:59) → uyuyan;
 *    - sabah (05:00–10:59) → gerinen. Gün daha yeni başladı: sabah sekizde
 *      uyuyan bir tavşan "bugün bir şey yapmadın" gibi okunurdu, oysa
 *      yapılacak bir şey için henüz vakit olmadı. Gerinen tavşan güne
 *      birlikte başlıyor;
 *    - seri kırılmak üzere (dün hedef tuttu) → elleri belde, "hadi". Aynı
 *      koşul `gunun-hali.ts`te de 2. sırada ve seri hesabı oradan geliyor;
 *    - kalan durum → uyuyan (kullanıcının örneği).
 *
 * Günlük hedef sıfırsa "tuttu" anlamsız (`gunun-hali.ts` ile aynı kural):
 * 5. ve seri kuralı atlanıyor, kayıt varsa çalışan, yoksa saat kuralı.
 *
 * Dönüşümlü pozlar `gununPozu` ile seçiliyor: gün içinde sabit, günden güne
 * değişiyor.
 */

import { gunOzeti } from './hesap'
import { hedefSerisi } from './gunun-hali'
import { gununPozu, type MaskotDurumu, type MaskotPozu } from './maskot'
import type { GunlukKayit } from './types'

export type PomodoroHali = 'calisma' | 'mola' | null

export type AnaMaskotGirdisi = {
  /** 'YYYY-AA-GG' */
  bugun: string
  /** 0–23, cihazın yerel saati. */
  saat: number
  /** Günlük soru hedefi; 0 ise "tuttu" kuralı yok. */
  hedef: number
  gunlukKayitlar: GunlukKayit[]
  /** Sınava kalan gün. */
  kalanGun: number
  /** İşleyen bir Pomodoro aşaması; duraklatılmışsa ya da yoksa null. */
  pomodoro: PomodoroHali
  devamsizlikAsildi: boolean
}

export type AnaMaskot = {
  poz: MaskotPozu
  durum: MaskotDurumu
  /** Ekran okuyucu etiketi ("Rabi — …"). */
  etiket: string
}

/** Sabah bu saatte başlıyor; öncesi gece. */
export const SABAH_BASI = 5
/** Bu saatten sonra kayıtsız gün "henüz başlamadı" değil. */
export const SABAH_SONU = 11
/** Bu saatten sonra gece: kayıt yoksa tavşan uyuyor. */
export const GECE_BASI = 22

const KUTLAMA: readonly AnaMaskot[] = [
  { poz: 'kafa-dans', durum: 'kutlama', etiket: 'hedefini tutturdun, dans ediyor' },
  { poz: 'kafa-alkislayan', durum: 'kutlama', etiket: 'hedefini tutturdun, alkışlıyor' },
  { poz: 'kafa-kahkaha', durum: 'kutlama', etiket: 'hedefini tutturdun, gülüyor' },
]

const CALISMA: readonly AnaMaskot[] = [
  { poz: 'kafa-yazan', durum: 'calisiyor', etiket: 'seninle birlikte çalışıyor' },
  { poz: 'kafa-kitapli', durum: 'calisiyor', etiket: 'seninle birlikte çalışıyor' },
]

const UYUYAN: AnaMaskot = { poz: 'kafa-uyuyan', durum: 'uykulu', etiket: 'uyuyor, bugün henüz kayıt yok' }

export function anaMaskot(g: AnaMaskotGirdisi): AnaMaskot {
  if (g.pomodoro === 'calisma') {
    return { poz: 'kafa-laptoplu', durum: 'calisiyor', etiket: 'Pomodoro turunda çalışıyor' }
  }
  if (g.pomodoro === 'mola') {
    return { poz: 'kafa-kahveli', durum: 'normal', etiket: 'molada, kahvesini içiyor' }
  }
  if (g.devamsizlikAsildi) {
    return { poz: 'kafa-uzgun', durum: 'uzgun', etiket: 'üzgün, devamsızlık hakkın aşıldı' }
  }
  if (g.kalanGun === 0) {
    return { poz: 'kafa-bagdas', durum: 'normal', etiket: 'sınav günü, sakin' }
  }

  const toplam = gunOzeti(g.gunlukKayitlar.find((k) => k.tarih === g.bugun)).toplam
  if (g.hedef > 0 && toplam >= g.hedef) return gununPozu(g.bugun, KUTLAMA)
  if (toplam > 0) return gununPozu(g.bugun, CALISMA)

  if (g.saat < SABAH_BASI || g.saat >= GECE_BASI) return UYUYAN
  if (g.saat < SABAH_SONU) {
    return { poz: 'kafa-gerinen', durum: 'normal', etiket: 'güne gerinerek başlıyor' }
  }
  if (hedefSerisi(g.gunlukKayitlar, g.bugun, g.hedef) > 0) {
    return { poz: 'kafa-elleri-belde', durum: 'normal', etiket: 'serin bozulmasın diye seni bekliyor' }
  }
  return UYUYAN
}
