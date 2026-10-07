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
 * 3. Devamsızlık hakkı aşıldı → üzgün.
 * 4. Sınav günü → bağdaş kurmuş, sakin. `gunun-hali.ts` o gün soru sayısından
 *    bağımsız olarak "dinlen" diyor; tavşan da çalışmıyor.
 * 5. Aylık özet açılmayı bekliyor → megafonla konuşan. Ayın 1'inde, özet
 *    açılana kadar; açılınca `ozetHazir` düşüyor.
 * 6. Bugünün tarihli bir deneme girildi → onay damgası basan.
 * 7. Bugün bir konu anlatımı bitirildi → tahtaya yazan.
 * 8. Günlük hedef tuttu → dans eden / alkışlayan / kahkaha atan (günden güne).
 * 9. Bugünün bütün görevleri işaretlendi → çantasını kapatan.
 * 10. Bugün kayıt var ve öncesinde en az `GERI_DONUS_BOSLUK` boş gün → eğilerek
 *    selamlayan: "tekrar hoş geldin". Hiç eski kaydı olmayan yeni kullanıcı
 *    geri dönmüş sayılmıyor.
 * 11. Bugün başlandı, hedefe ulaşılmadı → deftere yazan / kitap okuyan.
 * 12. Bugün hiç kayıt yok:
 *    - gece (22:00–04:59) → esneyen;
 *    - sabah (05:00–10:59) → gerinen, hafta sonu bitki sulayan. Gün daha yeni
 *      başladı: sabah sekizde uyuyan bir tavşan "bugün bir şey yapmadın" gibi
 *      okunurdu;
 *    - seri kırılmak üzere (dün hedef tuttu) → elleri belde, "hadi". Aynı
 *      koşul `gunun-hali.ts`te de 2. sırada ve seri hesabı oradan geliyor;
 *    - yanlış bankasında `YANLIS_BIRIKTI`+ çözülmemiş soru → büyüteçle inceleyen;
 *    - sınava `SINAV_YAKIN_GUN` ya da daha az gün → saate bakan;
 *    - akşam (18:00–21:59) → düşünen, "bugün ne yapsak";
 *    - kalan durum → esneyen (kullanıcının ilk örneği "uyusun"du; yatan
 *      tavşan sonra istenmedi).
 *
 * 5–10 kullanıcının seçtiği durumlar. Etkinlik bildirenler (deneme, konu,
 * görev) hedef kutlamasının çevresinde: deneme ve konu günün sıra dışı işi,
 * hedef her gün tutabiliyor; görev ise kullanıcının kendi planı, hedef
 * tutmuşsa kutlama önde.
 *
 * Günlük hedef sıfırsa "tuttu" anlamsız (`gunun-hali.ts` ile aynı kural):
 * 5. ve seri kuralı atlanıyor, kayıt varsa çalışan, yoksa saat kuralı.
 *
 * Dönüşümlü pozlar `gununPozu` ile seçiliyor: gün içinde sabit, günden güne
 * değişiyor.
 */

import { gunOzeti } from './hesap'
import { hedefSerisi, SINAV_YAKIN_GUN } from './gunun-hali'
import { gununPozu, type MaskotDurumu, type MaskotPozu } from './maskot'
import { gunFarki } from './sinav-tarihi'
import type { GunlukKayit } from './types'
import { tariheCevir } from './utils'

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
  /** Aylık özet açılmayı bekliyor (ayın 1'i, henüz açılmadı). */
  ozetHazir: boolean
  /** En yeni denemenin tarihi; hiç deneme yoksa null. */
  sonDenemeTarihi: string | null
  /** Bugün bitirilen bir konu anlatımı var (`bugunKonuBittiMi`). */
  konuBitti: boolean
  /** Bugünün görevleri var ve hepsi işaretli (`gorevlerBittiMi`). */
  gorevlerBitti: boolean
  /** Yanlış soru bankasında çözülmemiş soru sayısı. */
  bekleyenYanlis: number
}

/**
 * Hangi kuralın tuttuğu. Başlığın cümlesi bundan kuruluyor (`ana-baslik.ts`):
 * tavşan ile cümle aynı karardan çıkıyor, ikisi çelişemiyor.
 */
export type MaskotKurali =
  | 'pomodoro'
  | 'mola'
  | 'devamsizlik'
  | 'sinav-gunu'
  | 'ozet'
  | 'deneme'
  | 'konu'
  | 'kutlama'
  | 'gorevler'
  | 'geri-donus'
  | 'calisma'
  | 'gece'
  | 'sabah'
  | 'hafta-sonu'
  | 'seri'
  | 'yanlis'
  | 'sinav-yakin'
  | 'aksam'
  | 'esneyen'

export type AnaMaskot = {
  kural: MaskotKurali
  poz: MaskotPozu
  durum: MaskotDurumu
  /** Ekran okuyucu etiketi ("Rabi — …"). */
  etiket: string
}

/** Sabah bu saatte başlıyor; öncesi gece. */
export const SABAH_BASI = 5
/** Bu saatten sonra kayıtsız gün "henüz başlamadı" değil. */
export const SABAH_SONU = 11
/** Bu saatten sonra gece: kayıt yoksa tavşan esniyor. */
export const GECE_BASI = 22
/** Bu saatten sonra kayıtsız gün akşam: tavşan düşünüyor. */
export const AKSAM_BASI = 18
/** Önceki kayıtla bugün arasında bu kadar boş gün varsa "geri döndü". */
export const GERI_DONUS_BOSLUK = 3
/** Bankada bu kadar çözülmemiş yanlış birikince büyüteç. */
export const YANLIS_BIRIKTI = 10

const KUTLAMA: readonly AnaMaskot[] = [
  { kural: 'kutlama', poz: 'dans', durum: 'kutlama', etiket: 'hedefini tutturdun, dans ediyor' },
  { kural: 'kutlama', poz: 'alkislayan', durum: 'kutlama', etiket: 'hedefini tutturdun, alkışlıyor' },
  { kural: 'kutlama', poz: 'kahkaha', durum: 'kutlama', etiket: 'hedefini tutturdun, gülüyor' },
]

const CALISMA: readonly AnaMaskot[] = [
  { kural: 'calisma', poz: 'yazan', durum: 'calisiyor', etiket: 'seninle birlikte çalışıyor' },
  { kural: 'calisma', poz: 'okuyan', durum: 'calisiyor', etiket: 'seninle birlikte çalışıyor' },
]

/*
  Kayıtsız günün tavşanı esniyor, uyumuyor: başlıkta yere yatmış uyuyan
  tavşan istenmedi (kullanıcı, 2026-10: "hiçbir yerde olmasın").
*/
const ESNEYEN: AnaMaskot = { kural: 'esneyen', poz: 'esneyen', durum: 'uykulu', etiket: 'esniyor, bugün henüz kayıt yok' }

/** Bugün kayıt var ve ondan önceki son kayıtlı günle arada en az `GERI_DONUS_BOSLUK` boş gün var. */
function geriDondu(kayitlar: GunlukKayit[], bugun: string): boolean {
  let son: string | null = null
  for (const k of kayitlar) {
    if (k.tarih >= bugun || gunOzeti(k).toplam <= 0) continue
    if (son === null || k.tarih > son) son = k.tarih
  }
  return son !== null && gunFarki(son, bugun) > GERI_DONUS_BOSLUK
}

/** Cumartesi ya da pazar. */
function haftaSonu(bugun: string): boolean {
  const gun = tariheCevir(bugun).getDay()
  return gun === 0 || gun === 6
}

/** Bugün bitirilen bir konu var mı — `KonuIlerlemesi.bitisTarihi` yalnız ilk bitişte damgalanıyor. */
export function bugunKonuBittiMi(
  ilerlemeler: Record<string, { bitisTarihi?: string }>,
  bugun: string,
): boolean {
  return Object.values(ilerlemeler).some((i) => i.bitisTarihi === bugun)
}

/** Bugüne yazılmış en az bir görev var ve hepsi işaretli. */
export function gorevlerBittiMi(gorevler: { gun: string; bitti: boolean }[], bugun: string): boolean {
  const bugunku = gorevler.filter((g) => g.gun === bugun)
  return bugunku.length > 0 && bugunku.every((g) => g.bitti)
}

export function anaMaskot(g: AnaMaskotGirdisi): AnaMaskot {
  if (g.pomodoro === 'calisma') {
    return { kural: 'pomodoro', poz: 'laptoplu', durum: 'calisiyor', etiket: 'Pomodoro turunda çalışıyor' }
  }
  if (g.pomodoro === 'mola') {
    return { kural: 'mola', poz: 'kahveli', durum: 'normal', etiket: 'molada, kahvesini içiyor' }
  }
  if (g.devamsizlikAsildi) {
    return { kural: 'devamsizlik', poz: 'uzgun', durum: 'uzgun', etiket: 'üzgün, devamsızlık hakkın aşıldı' }
  }
  if (g.kalanGun === 0) {
    return { kural: 'sinav-gunu', poz: 'bagdas', durum: 'normal', etiket: 'sınav günü, sakin' }
  }
  if (g.ozetHazir) {
    return { kural: 'ozet', poz: 'megafonlu', durum: 'mutlu', etiket: 'aylık özetin hazır diye duyuruyor' }
  }
  if (g.sonDenemeTarihi === g.bugun) {
    return { kural: 'deneme', poz: 'damgali', durum: 'mutlu', etiket: 'bugünkü denemeni onaylıyor' }
  }
  if (g.konuBitti) {
    return { kural: 'konu', poz: 'tahtali', durum: 'mutlu', etiket: 'bugün bir konuyu bitirdin, tahtaya yazıyor' }
  }

  const toplam = gunOzeti(g.gunlukKayitlar.find((k) => k.tarih === g.bugun)).toplam
  if (g.hedef > 0 && toplam >= g.hedef) return gununPozu(g.bugun, KUTLAMA)
  if (g.gorevlerBitti) {
    return { kural: 'gorevler', poz: 'cantali', durum: 'mutlu', etiket: 'bugünkü görevlerin bitti, çantasını kapatıyor' }
  }
  if (toplam > 0) {
    if (geriDondu(g.gunlukKayitlar, g.bugun)) {
      return { kural: 'geri-donus', poz: 'selamlayan', durum: 'mutlu', etiket: 'tekrar hoş geldin diyor' }
    }
    return gununPozu(g.bugun, CALISMA)
  }

  if (g.saat < SABAH_BASI || g.saat >= GECE_BASI) return { ...ESNEYEN, kural: 'gece' }
  if (g.saat < SABAH_SONU) {
    return haftaSonu(g.bugun)
      ? { kural: 'hafta-sonu', poz: 'bitkili', durum: 'normal', etiket: 'hafta sonu sabahı, bitkisini suluyor' }
      : { kural: 'sabah', poz: 'gerinen', durum: 'normal', etiket: 'güne gerinerek başlıyor' }
  }
  if (hedefSerisi(g.gunlukKayitlar, g.bugun, g.hedef) > 0) {
    return { kural: 'seri', poz: 'elleri-belde', durum: 'normal', etiket: 'serin bozulmasın diye seni bekliyor' }
  }
  if (g.bekleyenYanlis >= YANLIS_BIRIKTI) {
    return { kural: 'yanlis', poz: 'buyutecli', durum: 'normal', etiket: 'biriken yanlışlarına bakıyor' }
  }
  if (g.kalanGun > 0 && g.kalanGun <= SINAV_YAKIN_GUN) {
    return { kural: 'sinav-yakin', poz: 'saatli', durum: 'normal', etiket: 'sınava az kaldı, saate bakıyor' }
  }
  if (g.saat >= AKSAM_BASI) {
    return { kural: 'aksam', poz: 'dusunen', durum: 'normal', etiket: 'akşam oldu, bugün ne yapsak diye düşünüyor' }
  }
  return ESNEYEN
}
