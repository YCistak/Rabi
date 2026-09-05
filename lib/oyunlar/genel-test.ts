/**
 * Genel test — bankadaki bütün yanlışlar, **kendi oyunlarının ekranında**.
 *
 * Test bir süre ortak bir şıklı ekranda soruluyordu: her kaydın soru metni ve
 * cevap metni vardı, şıklar da bankanın öteki cevaplarından geliyordu. İki
 * şeyi birden bozuyordu. Şıklar birbiriyle alakasızdı — bir eser sorusunun
 * yanında element adı duruyor ve soru cevabı bilmeden eleniyordu. Ve soru
 * kendi biçimini kaybediyordu: harita sorusu haritasız, cümle sorusu cümlesiz
 * soruluyordu, yani ekranda oyunun sorduğu soru değil onun bir özeti vardı.
 *
 * Şimdi test, bankada kaydı olan oyunları **arka arkaya oynatıyor**: sıra
 * karışık, her oyun kendi banka turunu kendi ekranıyla açıyor ve aralarda
 * tanıtım penceresi, geri sayım ya da tur sonu ekranı yok — kullanıcı tek bir
 * testin içinde olduğunu hissediyor.
 *
 * Karıştırma **oyun düzeyinde**. Soruyu soruya karıştırmak, her soruda başka
 * bir oyunu kurmak demekti ve Edebiyat/Formül eşleştirme ile Zaman Şeridi
 * "tek soru" soramıyor: biri bir elde altı çift dağıtıyor, öteki bir turda
 * sıralama yaptırıyor. Onları dışarıda bırakan bir test, bankanın bir kısmına
 * hiç dokunamazdı.
 *
 * Modül saf: sıra, ilerleme ve doğru bilinen kayıtların kimlikleri burada;
 * ekranı `components/ekranlar/oyunlar.tsx` çiziyor.
 */

import type { OyunId } from '../types'
import { bankaKimligi, type BankaCevabi, type BankaKaydi } from './banka'
import { karistir } from './tur'

export type GenelTest = {
  /** Oynanacak oyunlar, karışık sırada. */
  sira: OyunId[]
  /** Kaçıncı oyunda olunduğu. `sira` boyuna ulaşınca test bitmiştir. */
  adim: number
  /**
   * O ana kadar doğru bilinen kayıtların kimlikleri.
   *
   * Bankadan düşme **testin sonunda** bir kerede yapılıyor: kayıtlar tur tur
   * düşseydi sıradaki oyunun havuzu test sürerken küçülür, aynı testin
   * ortasında bir oyun sorusuz kalabilirdi.
   */
  dogruIdler: string[]
}

/**
 * Bankadaki oyunlardan bir test kurar; banka boşsa `null`.
 *
 * Yalnızca kaydı olan oyunlar giriyor: kaydı olmayan bir oyunun turu soru
 * bulamaz ve test boş bir ekranda takılırdı.
 */
export function genelTestKur(
  banka: readonly BankaKaydi[],
  rastgele: () => number = Math.random,
): GenelTest | null {
  const oyunlar: OyunId[] = []
  for (const kayit of banka) {
    if (!oyunlar.includes(kayit.soru.oyun)) oyunlar.push(kayit.soru.oyun)
  }
  if (oyunlar.length === 0) return null
  return { sira: karistir(oyunlar, rastgele), adim: 0, dogruIdler: [] }
}

/** Şu an oynanacak oyun; test bittiyse `null`. */
export function genelTestOyunu(test: GenelTest): OyunId | null {
  return test.sira[test.adim] ?? null
}

export function genelTestBittiMi(test: GenelTest): boolean {
  return test.adim >= test.sira.length
}

/**
 * Bir tur bitti: doğrular biriktiriliyor ve sıra bir sonraki oyuna geçiyor.
 *
 * Kimlikler tekilleştiriliyor — aynı kayıt aynı turda iki kez sorulabiliyor
 * (havuz kısaysa soru tekrar geliyor) ve iki kez sayılan bir kimlik, testin
 * sonunda "bankadan düşen" sayacını olduğundan büyük gösterirdi.
 */
export function genelTestIlerlet(test: GenelTest, yeniDogrular: readonly string[]): GenelTest {
  return {
    ...test,
    adim: test.adim + 1,
    dogruIdler: [...new Set([...test.dogruIdler, ...yeniDogrular])],
  }
}

/** Doğru bilinen cevapların banka kimlikleri. */
export function dogruKimlikler(cevaplar: readonly BankaCevabi[]): string[] {
  return cevaplar.filter((cevap) => cevap.dogruMu).map((cevap) => bankaKimligi(cevap.soru))
}
