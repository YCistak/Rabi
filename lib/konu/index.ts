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
import { ingilizce11Temalar1 } from './icerik/11-ingilizce-1'
import { ingilizce11Temalar2 } from './icerik/11-ingilizce-2'
import { ingilizce11Temalar3 } from './icerik/11-ingilizce-3'
import { ingilizce11Temalar4 } from './icerik/11-ingilizce-4'
import { ingilizce11Sorulari1 } from './icerik/11-ingilizce-1-sorular'
import { ingilizce11Sorulari2 } from './icerik/11-ingilizce-2-sorular'
import { ingilizce11Sorulari3 } from './icerik/11-ingilizce-3-sorular'
import { ingilizce11Sorulari4 } from './icerik/11-ingilizce-4-sorular'
import { program } from './tip'
import { biyoloji11Sorulari } from './icerik/11-biyoloji-sorular'
import { fizik11Sorulari } from './icerik/11-fizik-sorular'
import { kimya11Sorulari } from './icerik/11-kimya-sorular'
import { matematik11Sorulari } from './icerik/11-matematik-sorular'
import { matematik12 } from './icerik/12-matematik'
import { matematik12Sorulari } from './icerik/12-matematik-sorular'
import { fizik12 } from './icerik/12-fizik'
import { fizik12Sorulari } from './icerik/12-fizik-sorular'
import { kimya12 } from './icerik/12-kimya'
import { kimya12Sorulari } from './icerik/12-kimya-sorular'
import { biyoloji12 } from './icerik/12-biyoloji'
import { biyoloji12Sorulari } from './icerik/12-biyoloji-sorular'
import { tarih12 } from './icerik/12-tarih'
import { cografya12 } from './icerik/12-cografya'
import { ingilizce12Temalar1 } from './icerik/12-ingilizce-1'
import { ingilizce12Sorulari1 } from './icerik/12-ingilizce-1-sorular'
import { ingilizce12Temalar2 } from './icerik/12-ingilizce-2'
import { ingilizce12Sorulari2 } from './icerik/12-ingilizce-2-sorular'
import { ingilizce12Temalar3 } from './icerik/12-ingilizce-3'
import { ingilizce12Sorulari3 } from './icerik/12-ingilizce-3-sorular'
import { ingilizce12Temalar4 } from './icerik/12-ingilizce-4'
import { ingilizce12Sorulari4 } from './icerik/12-ingilizce-4-sorular'

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
export type KonuAilesi = 'yzm' | 'isl' | 'edb' | 'cog' | 'trh' | 'byl' | 'fzk' | 'dil'

export type KonuDersTanimi = {
  id: KonuDersId
  ad: string
  ikon: string
  aile: KonuAilesi
}

/**
 * Konu anlatımında seçilebilen dersler.
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
  { id: 'ingilizce', ad: 'İngilizce', ikon: '🌐', aile: 'dil' },
]

/**
 * Programın kapsadığı sınıflar. 12'de yalnız Matematik yazıldı (2018
 * programı); öteki dersler 12'de `sinifDersleri` ile gizleniyor.
 */
export const KONU_SINIFLARI: KonuSinifi[] = [9, 10, 11, 12]

/**
 * Haritanın sınıf sekmesindeki sınıflar: `9 · 10 · 11 · 12`, hep görünür.
 *
 * 12 kartları yazılmadan önce de sekmede duruyordu (kullanıcı istedi: 12.
 * sınıf öğrencisi kendi sınıfını listede görmeyince bölümün kendisine ait
 * olmadığını düşünüyordu). Matematik 12 yazılınca `KONU_SINIFLARI`na girdi;
 * ad, ekranların "haritadaki sınıf" diye okuduğu yerlerde kalıyor.
 */
export type HaritaSinifi = KonuSinifi
export const HARITA_SINIFLARI: HaritaSinifi[] = [...KONU_SINIFLARI]

/**
 * Kullanıcının kayıtlı sınıfından haritanın açılacağı sınıf.
 *
 * Harita her açılışta öğrencinin kendi sınıfıyla açılıyor; bir süre en son
 * bakılan sınıfta kalıyordu ve 10. sınıf öğrencisi her seferinde 9. sınıfın
 * haritasını görüp sınıf değiştiriyordu. Mezun ve 9'dan küçük değerler için
 * `null`: o kullanıcıların tek bir sınıfı yok, son seçim yerinde kalıyor.
 */
export function haritaSinifiBul(buYilSinif: number): HaritaSinifi | null {
  return HARITA_SINIFLARI.find((s) => s === buYilSinif) ?? null
}

function sorulariBagla(program: DersProgrami, havuz: Record<string, Omit<SoruKarti, 'id'>[]>): DersProgrami {
  const konuKimlikleri = new Set(program.temalar.flatMap((tema) => tema.konular.map((konu) => konu.id)))
  for (const kimlik of Object.keys(havuz)) {
    if (!konuKimlikleri.has(kimlik)) throw new Error(`Bilinmeyen ${program.sinif}. sınıf konu kimliği: ${kimlik}`)
  }
  return {
    ...program,
    temalar: program.temalar.map((tema) => ({
      ...tema,
      konular: tema.konular.map((konu) => {
        const sorular = havuz[konu.id]
        if (!sorular?.length) throw new Error(`${program.sinif}. sınıf soruları eksik: ${konu.id}`)
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
  'ingilizce-11': sorulariBagla(
    program('ingilizce', 11, 'Okuldan dünyaya, doğadan geleceğe', [
      ...ingilizce11Temalar1, ...ingilizce11Temalar2,
      ...ingilizce11Temalar3, ...ingilizce11Temalar4,
    ]),
    { ...ingilizce11Sorulari1, ...ingilizce11Sorulari2,
      ...ingilizce11Sorulari3, ...ingilizce11Sorulari4 },
  ),
  'matematik-12': sorulariBagla(matematik12, matematik12Sorulari),
  'fizik-12': sorulariBagla(fizik12, fizik12Sorulari),
  'kimya-12': sorulariBagla(kimya12, kimya12Sorulari),
  'biyoloji-12': sorulariBagla(biyoloji12, biyoloji12Sorulari),
  'tarih-12': tarih12,
  'cografya-12': cografya12,
  'ingilizce-12': sorulariBagla(
    program('ingilizce', 12, 'Müzikten davranış kurallarına, 2018 programı', [
      ...ingilizce12Temalar1, ...ingilizce12Temalar2, ...ingilizce12Temalar3,
      ...ingilizce12Temalar4,
    ]),
    { ...ingilizce12Sorulari1, ...ingilizce12Sorulari2, ...ingilizce12Sorulari3,
      ...ingilizce12Sorulari4 },
  ),
}

/** İçeriği henüz yazılmamış ders/sınıf için `null` döner; ekran bunu yazıyla karşılar. */
export function programBul(ders: KonuDersId, sinif: HaritaSinifi): DersProgrami | null {
  return PROGRAMLAR[`${ders}-${sinif}`] ?? null
}

/** Kısmi sınıf eklemelerinde boş ders seçeneği gösterilmez. 12'de yalnız Matematik. */
export function sinifDersleri(sinif: HaritaSinifi): KonuDersTanimi[] {
  return KONU_DERSLERI.filter((ders) => programBul(ders.id, sinif) !== null)
}

export function dersBul(ders: KonuDersId): KonuDersTanimi {
  // Liste sabit ve `KonuDersId` ile aynı ders kimliklerini taşıyor; bulunamaması
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
