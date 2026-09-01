/**
 * Genel test — bankadaki bütün yanlışlar tek bir testte, karışık.
 *
 * Banka turları oyuna göre açılıyor (yazımda iki şık, işlemde tuş takımı,
 * edebiyatta eşleştirme) ve bu, bankayı **oyun oyun** çalışılan bir listeye
 * çeviriyordu: aynı dersin soruları arka arkaya gelince cevap sorudan değil
 * sıradan çıkıyor. Genel test bunun karşıtı — soru hangi oyundan gelirse
 * gelsin aynı biçimde soruluyor ve sıra karışık.
 *
 * Ortak biçim şıklı soru olmak zorunda: on sekiz oyunun kendi ekranını tek
 * turda toplamak mümkün değil, ama hepsinin bankadaki kaydı zaten bir soru
 * metni ile bir cevap metnine iniyor (`bankaSorusuMetni`, `bankaCevabiMetni`).
 * Test o ikisiyle kuruluyor.
 *
 * Çeldiriciler **bankanın kendisinden** geliyor, havuzlardan değil: kullanıcı
 * hangi cevapları karıştırıyorsa şıklar onlar. Aynı oyunun cevapları öncelikli
 * — "Çalıkuşu"nun şıkları arasında bir element adı dursaydı soru cevabı
 * bilmeden elenirdi.
 */

import type { OyunId } from '../types'
import {
  bankaCevabiMetni,
  bankaSorusuMetni,
  type BankaKaydi,
} from './banka'
import { karistir } from './tur'

/** Bir sorunun en fazla kaç şıkkı olur. */
export const SIK_SAYISI = 4

export type TestSorusu = {
  /** Banka kaydının kimliği — doğru bilinen kayıt bununla düşürülüyor. */
  id: string
  oyun: OyunId
  metin: string
  dogru: string
  /** Doğru cevap da içinde, karışık sırada. */
  siklar: string[]
}

/**
 * Testi kurar: bankadaki her kayıt için bir soru, sıra karışık.
 *
 * Çeldirici bulunamayan kayıt **teste girmiyor**. Tek şıklı bir soru
 * cevaplanmadan doğru sayılırdı ve o kayıt bankadan hak etmeden düşerdi.
 */
export function testHazirla(
  banka: readonly BankaKaydi[],
  rastgele: () => number = Math.random,
): TestSorusu[] {
  const sorular: TestSorusu[] = []

  for (const kayit of banka) {
    const dogru = bankaCevabiMetni(kayit.soru)
    const metin = bankaSorusuMetni(kayit.soru)
    const celdiriciler = celdiricileriSec(banka, kayit, dogru, rastgele)
    if (celdiriciler.length === 0) continue

    sorular.push({
      id: kayit.id,
      oyun: kayit.soru.oyun,
      metin,
      dogru,
      siklar: karistir([dogru, ...celdiriciler], rastgele),
    })
  }

  return karistir(sorular, rastgele)
}

/**
 * Çeldiriciler: önce aynı oyunun cevapları, yetmezse öteki oyunlarınki.
 *
 * Metne göre tekilleştiriliyor, kimliğe göre değil: aynı cevaba çıkan iki
 * kayıt (aynı yazarın iki eseri) şıkta iki kez görünürdü ve ikisi de yanlış
 * sayılırken doğru cevap gibi dururdu.
 */
function celdiricileriSec(
  banka: readonly BankaKaydi[],
  kayit: BankaKaydi,
  dogru: string,
  rastgele: () => number,
): string[] {
  const gorulen = new Set([dogru])
  const yakin: string[] = []
  const uzak: string[] = []

  for (const oteki of banka) {
    if (oteki.id === kayit.id) continue
    const cevap = bankaCevabiMetni(oteki.soru)
    if (gorulen.has(cevap)) continue
    gorulen.add(cevap)
    if (oteki.soru.oyun === kayit.soru.oyun) yakin.push(cevap)
    else uzak.push(cevap)
  }

  return [...karistir(yakin, rastgele), ...karistir(uzak, rastgele)].slice(0, SIK_SAYISI - 1)
}
