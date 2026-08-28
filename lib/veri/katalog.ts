/**
 * Hedef kataloğu verisi — ÖSYM kılavuzundan üretilmiş gerçek programlar.
 *
 * Eskiden burada elle yazılmış 205 üniversite ve 77 bölüm vardı; üniversitenin
 * 1–5 arası bir "kademesi", bölümün iki sıra ucu tutuluyor ve hedefin sırası
 * ikisinin arasında geometrik iç değerle **tahmin ediliyordu**. Model tek
 * boyutluydu: Tıp'ta önde olan üniversite Hukuk'ta da önde sayılıyordu.
 * Gerçek tablo o zaman taşınmadı çünkü hem devasa görünüyordu hem her ağustos
 * elle güncellenecekti.
 *
 * İkisi de artık geçerli değil. Veri ÖSYM kılavuzundan bir ETL ile çıkıyor
 * (elle güncelleme yok) ve yalnızca uygulamanın kullandığı alanlara indirilmiş
 * hâli 240 KB: 225 üniversite, 9.319 lisans programı. Sıra artık tahmin değil,
 * o programın 2025-YKS'de gerçekleşen başarı sırası.
 *
 * ## Veri neden bu biçimde
 *
 * Adlar çok tekrar ediyor — "Hemşirelik" 100'den fazla üniversitede açılıyor.
 * Üniversite ve bölüm adları birer sözlükte bir kez yazılıyor, programlar
 * indekse dönüyor. Aynı veri düz nesne dizisi olarak yaklaşık dört kat yer
 * kaplardı.
 *
 * ## Neden yalnızca lisans
 *
 * `PuanTuru` say/ea/soz/dil; önlisans (TYT) programları uygulamanın hedef
 * modelinde hiç olmadı. Kılavuzun TYT tarafı bu yüzden profile girmiyor.
 */

import ham from './hedef-katalog-2025.json'
import type { PuanTuru } from '../types'

export type UniversiteTuru = 'devlet' | 'vakif' | 'kktc'

export type Universite = {
  /** Addan türetiliyor; elle yazılan kimlik 225 satırlık listede er geç çakışır. */
  id: string
  ad: string
  /** Yurt dışındaki ortak üniversitelerde boş kalabilir. */
  sehir: string
  tur: UniversiteTuru
}

/**
 * Bir üniversitedeki tek program.
 *
 * Adı bölümün tam adı: "Bilgisayar Mühendisliği (İngilizce) (Burslu)". Parantez
 * içindeki ekler ayıklanmıyor — vakıf üniversitesinde burslu ile ücretli
 * kontenjanın arası uçurum ve hedef koyan öğrencinin kovaladığı sayı
 * bunlardan yalnızca biri.
 */
export type Bolum = {
  id: string
  ad: string
  puanTuru: PuanTuru
  /** Öğrenim süresi (yıl) — listede bölümün yanında yazıyor. */
  sure: number
  /** Programın kılavuzdaki gerçek başarı sırası. */
  basariSirasi: number
}

/** Verinin ait olduğu YKS yılı — kılavuz yılı değil, bir öncesi. */
export const VERI_YILI: number = ham.veriYili

/**
 * Arama ve eşleştirme için metni sadeleştirir.
 *
 * `toLowerCase` tek başına yetmiyor: "İ" küçültüldüğünde birleşik işaretli
 * bir karakter çıkıyor ve "İstanbul" araması kendi kaydını bulamıyor.
 */
export function sadelestir(metin: string): string {
  return metin
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/â/g, 'a')
    .replace(/\s+/g, ' ')
    .trim()
}

function kimlige(ad: string): string {
  return sadelestir(ad).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const PUAN_TURLERI = ham.puanTurleri as readonly PuanTuru[]
const BOLUM_ADLARI = ham.bolumAdlari as readonly string[]

export const UNIVERSITELER: readonly Universite[] = (
  ham.universiteler as readonly (readonly string[])[]
).map(([ad, sehir, tur]) => ({
  id: kimlige(ad),
  ad,
  sehir,
  tur: tur as UniversiteTuru,
}))

/**
 * Üniversite indeksi → programları.
 *
 * Ham dizi 9.319 satır; her arama için baştan taramak yerine bir kez
 * gruplanıyor. Program nesneleri de burada kuruluyor: modül yüklenirken
 * hepsini birden kurmak, kullanıcı hiç hedef ekranını açmasa bile 9.319 nesne
 * yaratmak olurdu.
 */
const gruplar = new Map<number, Bolum[]>()
let gruplandi = false

function gruplandir(): void {
  if (gruplandi) return
  for (const [uniIdx, adIdx, turIdx, sure, sira] of ham.programlar as readonly number[][]) {
    const liste = gruplar.get(uniIdx)
    const ad = BOLUM_ADLARI[adIdx]
    const bolum: Bolum = {
      id: kimlige(ad),
      ad,
      puanTuru: PUAN_TURLERI[turIdx],
      sure,
      basariSirasi: sira,
    }
    if (liste) liste.push(bolum)
    else gruplar.set(uniIdx, [bolum])
  }
  gruplandi = true
}

const SIRA_KIMLIKTEN = new Map(UNIVERSITELER.map((u, i) => [u.id, i]))

/** Üniversitenin açtığı programlar — başarı sırasına göre, en iyi önde. */
export function universiteninBolumleri(universite: Universite): Bolum[] {
  gruplandir()
  // Nesne kimliği yerine `id`: çağıran taraf kayıttan yeniden kurulmuş bir
  // nesne geçirirse referans karşılaştırması sessizce boş liste döndürürdü.
  const idx = SIRA_KIMLIKTEN.get(universite.id)
  if (idx === undefined) return []
  return gruplar.get(idx) ?? []
}
