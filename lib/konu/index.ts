import type { DersProgrami, Konu, KonuDersId, KonuSinifi, SoruKarti, Tema } from './tip'
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
import { cografya11 } from './icerik/11-cografya'
import { tarih11 } from './icerik/11-tarih'
import { turkce11 } from './icerik/11-turkce'
import { biyoloji11 } from './icerik/11-biyoloji'
import { fizik11 } from './icerik/11-fizik'
import { kimya11 } from './icerik/11-kimya'
import { matematik11 } from './icerik/11-matematik'
import { biyoloji11Sorulari } from './icerik/11-biyoloji-sorular'
import { fizik11Sorulari } from './icerik/11-fizik-sorular'
import { kimya11Sorulari } from './icerik/11-kimya-sorular'
import { matematik11Sorulari } from './icerik/11-matematik-sorular'

export type {
  AkisGorseli,
  BilgiKarti,
  DersProgrami,
  Gorsel,
  HizliKontrol,
  KartRenk,
  KatmanGorseli,
  Konu,
  KonuDersId,
  KonuSinifi,
  KoordinatGorseli,
  SayiDogrusuGorseli,
  SikliSoru,
  DogruYanlisSorusu,
  SoruKarti,
  TabloGorseli,
  Tema,
  VennGorseli,
} from './tip'

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
export const KONU_SINIFLARI: KonuSinifi[] = [9, 10, 11]

function sorulariBagla(program: DersProgrami, havuz: Record<string, Omit<SoruKarti, 'id'>[]>): DersProgrami {
  const konuKimlikleri = new Set(program.temalar.flatMap((tema) => tema.konular.map((konu) => konu.id)))
  for (const kimlik of Object.keys(havuz)) {
    if (!konuKimlikleri.has(kimlik)) throw new Error(`Bilinmeyen 11. sınıf konu kimliği: ${kimlik}`)
  }
  return {
    ...program,
    temalar: program.temalar.map((tema) => ({
      ...tema,
      konular: tema.konular.map((konu) => {
        const sorular = havuz[konu.id]
        if (!sorular?.length) throw new Error(`11. sınıf soruları eksik: ${konu.id}`)
        const baslangic = [...konu.id].reduce((toplam, harf) => toplam + harf.charCodeAt(0), 0) % sorular.length
        // Her konunun ilk sorusunun aynı biçimde ve aynı cevapta başlamasını önler.
        const sirali = [...sorular.slice(baslangic), ...sorular.slice(0, baslangic)]
        return {
          ...konu,
          sorular: sirali.map((soru, dizin) => ({ ...soru, id: `${konu.id}-s${dizin + 1}` }) as SoruKarti),
        }
      }),
    })),
  }
}

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
  'turkce-11': turkce11,
  'tarih-11': tarih11,
  'cografya-11': cografya11,
  'matematik-11': sorulariBagla(matematik11, matematik11Sorulari),
  'fizik-11': sorulariBagla(fizik11, fizik11Sorulari),
  'kimya-11': sorulariBagla(kimya11, kimya11Sorulari),
  'biyoloji-11': sorulariBagla(biyoloji11, biyoloji11Sorulari),
}

/** İçeriği henüz yazılmamış ders/sınıf için `null` döner; ekran bunu yazıyla karşılar. */
export function programBul(ders: KonuDersId, sinif: KonuSinifi): DersProgrami | null {
  return PROGRAMLAR[`${ders}-${sinif}`] ?? null
}

/** Kısmi sınıf eklemelerinde boş ders seçeneği gösterilmez. */
export function sinifDersleri(sinif: KonuSinifi): KonuDersTanimi[] {
  return KONU_DERSLERI.filter((ders) => programBul(ders.id, sinif) !== null)
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

/**
 * Yoklamanın kaba süresi, dakika — biletteki "~4 dakika" kutusu.
 *
 * Soru başına yirmi beş saniye: iki şık ya da doğru/yanlış, üstüne gerekçeyi
 * okumak. `okumaDakikasi` ile aynı gerekçe ve aynı yuvarlama.
 */
export function yoklamaDakikasi(soruSayisi: number): number {
  return Math.max(1, Math.round(soruSayisi * 0.4))
}

/** Programın tema ve konu sayısı — harita başlığındaki "7 tema · 22 konu". */
export function programSayilari(program: DersProgrami): { tema: number; konu: number } {
  return { tema: program.temalar.length, konu: tumKonular(program).length }
}
