'use client'

import { clear, createStore, del, get, set, type UseStore } from 'idb-keyval'
import { cizimleriCoz, cizimleriSadelestir, type TestCizimleri } from './cizim-kaydi'

/**
 * Soru Bankası karalamaları — IndexedDB, test başına bir kayıt
 * (`oturumAnahtari`: `konu#test`).
 *
 * Fotoğraf deposundan (`rabi-resimler`) **ayrı** bir veritabanı: Yanlış Soru
 * Bankası açılışta o depodaki kaydı olmayan her şeyi öksüz sayıp siliyor
 * (`oksuzResimleriSil`); karalamalar orada dursaydı silinirdi. Depo ilk
 * kullanımda açılır (bkz. `resim-depo.ts`: modül yüklenirken açmak testleri
 * düşürürdü).
 */
let depoOnbellek: UseStore | null = null
function depo(): UseStore {
  depoOnbellek ??= createStore('rabi-soru-bankasi-cizim', 'cizimler')
  return depoOnbellek
}

export async function testCizimleriniOku(anahtar: string): Promise<TestCizimleri> {
  return cizimleriCoz(await get(anahtar, depo()))
}

export async function testCizimleriniYaz(anahtar: string, cizimler: TestCizimleri): Promise<void> {
  const sade = cizimleriSadelestir(cizimler)
  if (Object.keys(sade).length === 0) await del(anahtar, depo())
  else await set(anahtar, sade, depo())
}

export async function testCizimleriniSil(anahtar: string): Promise<void> {
  await del(anahtar, depo())
}

/** "Tüm verileri sil" için. */
export async function tumSoruCizimleriniSil(): Promise<void> {
  await clear(depo())
}
