import type { DersProgrami, Konu, KonuDersId, KonuSinifi, Tema } from './tip'
import { biyoloji9 } from './icerik/9-biyoloji'
import { cografya9 } from './icerik/9-cografya'
import { fizik9 } from './icerik/9-fizik'
import { kimya9 } from './icerik/9-kimya'
import { matematik9 } from './icerik/9-matematik'
import { tarih9 } from './icerik/9-tarih'
import { turkce9 } from './icerik/9-turkce'
import { biyoloji10 } from './icerik/10-biyoloji'
import { cografya10 } from './icerik/10-cografya'
import { fizik10 } from './icerik/10-fizik'
import { kimya10 } from './icerik/10-kimya'
import { matematik10 } from './icerik/10-matematik'
import { tarih10 } from './icerik/10-tarih'
import { turkce10 } from './icerik/10-turkce'

export type { BilgiKarti, DersProgrami, Konu, KonuDersId, KonuSinifi, SoruKarti, Tema } from './tip'

/**
 * Ders ailesi — renk kimliği.
 *
 * "Renk derse aittir" kuralının karşılığı (bkz. `AGENTS.md`). Fizik oyunlarda
 * yok, o yüzden kendi ailesi (`fzk`) Konu Anlatımı ile birlikte açıldı.
 */
export type KonuAilesi = 'yzm' | 'isl' | 'edb' | 'cog' | 'trh' | 'byl' | 'fzk'

export type KonuDersTanimi = {
  id: KonuDersId
  ad: string
  ikon: string
  aile: KonuAilesi
}

/**
 * Konu anlatımı olan yedi ders.
 *
 * Sıra ekrandaki çip şeridinin sırası: TYT’de ağırlığı en yüksek olan
 * dersler başta.
 */
export const KONU_DERSLERI: KonuDersTanimi[] = [
  { id: 'matematik', ad: 'Matematik', ikon: '➗', aile: 'isl' },
  { id: 'turkce', ad: 'Türkçe', ikon: '📖', aile: 'yzm' },
  { id: 'fizik', ad: 'Fizik', ikon: '🧲', aile: 'fzk' },
  { id: 'kimya', ad: 'Kimya', ikon: '⚗️', aile: 'edb' },
  { id: 'biyoloji', ad: 'Biyoloji', ikon: '🧬', aile: 'byl' },
  { id: 'tarih', ad: 'Tarih', ikon: '🏛️', aile: 'trh' },
  { id: 'cografya', ad: 'Coğrafya', ikon: '🗺️', aile: 'cog' },
]

/** Programın kapsadığı sınıflar. */
export const KONU_SINIFLARI: KonuSinifi[] = [9, 10]

/**
 * Bütün programlar.
 *
 * Anahtar `${ders}-${sinif}`: iki boyutlu bir tabloyu iç içe nesnelerle
 * tutmak, her erişimde iki kez `undefined` denetlemek demekti.
 */
const PROGRAMLAR: Record<string, DersProgrami> = {
  'matematik-9': matematik9,
  'turkce-9': turkce9,
  'fizik-9': fizik9,
  'kimya-9': kimya9,
  'biyoloji-9': biyoloji9,
  'tarih-9': tarih9,
  'cografya-9': cografya9,
  'matematik-10': matematik10,
  'turkce-10': turkce10,
  'fizik-10': fizik10,
  'kimya-10': kimya10,
  'biyoloji-10': biyoloji10,
  'tarih-10': tarih10,
  'cografya-10': cografya10,
}

/** İçeriği henüz yazılmamış ders/sınıf için `null` döner; ekran bunu yazıyla karşılar. */
export function programBul(ders: KonuDersId, sinif: KonuSinifi): DersProgrami | null {
  return PROGRAMLAR[`${ders}-${sinif}`] ?? null
}

export function dersBul(ders: KonuDersId): KonuDersTanimi {
  // Liste sabit ve `KonuDersId` ile aynı yedi kimliği taşıyor; bulunamaması
  // tip hatası demek, o yüzden ilki yedek olarak dönüyor.
  return KONU_DERSLERI.find((d) => d.id === ders) ?? KONU_DERSLERI[0]
}

/** Programdaki bütün konular, tema sırasıyla. */
export function tumKonular(program: DersProgrami): Konu[] {
  return program.temalar.flatMap((t: Tema) => t.konular)
}

/**
 * Bir destenin kaba okuma süresi, dakika.
 *
 * Harita listesinde kart sayısının yanında duruyor ("4 kart · 3 dk"):
 * sayının tek başına söylemediği şey desteyi açmanın kaça mal olduğu ve
 * öğrenci "şimdi mi sonra mı" kararını buna bakarak veriyor. Kart başına
 * kırk beş saniye, kartların uzunluk sınırından (`icerik.test.ts`) çıkan
 * kaba bir ölçü — tahmin olduğu için aşağı yuvarlanmıyor, en az bir dakika
 * yazıyor.
 */
export function okumaDakikasi(kartSayisi: number): number {
  return Math.max(1, Math.round(kartSayisi * 0.75))
}

/** Programın tema ve konu sayısı — harita başlığındaki "7 tema · 22 konu". */
export function programSayilari(program: DersProgrami): { tema: number; konu: number } {
  return { tema: program.temalar.length, konu: tumKonular(program).length }
}
