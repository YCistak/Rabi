/**
 * Sesle söylenebilecek ders ve deneme grubu adlarının tek kaynağı.
 *
 * Resmî adlar şablonlar ve ÖSYM test adlarından türetilir. Konuşma dilindeki
 * ek adlar ise aşağıdaki dar ekleme listesinde tutulur; çözücü başka bir
 * eş anlamlı listesinden ders ya da grup tanımaz.
 */

import { CALISMA_DERSLERI } from './dersler'
import { sadelestir } from './metin'
import { HAZIR_SABLONLAR, OSYM_TEST_ADI } from './sablonlar'
import type { TopluGrup } from './types'

export type SesliAd = {
  /** Karşılaştırmaya hazır, Türkçe karakterleri sadeleştirilmiş ad. */
  ad: string
  /** Günlük soru takibinde yazılacak kanonik ders; gruplarda `null`. */
  soruDersi: string | null
  /** Deneme şablonunda eşleşebilecek ders kimlikleri. */
  dersKimlikleri: readonly string[]
  /** Ders yerine toplu sonuç tutan deneme grubu. */
  grup: TopluGrup | null
}

type BirikenAd = {
  soruDersleri: Set<string>
  dersKimlikleri: Set<string>
  gruplar: Set<TopluGrup>
}

const biriken = new Map<string, BirikenAd>()

function ekle(ad: string, secenek: { soruDersi?: string; dersKimlikleri?: readonly string[]; grup?: TopluGrup } = {}): void {
  const sade = sadeAd(ad)
  if (sade.length < 3) return
  const kayit = biriken.get(sade) ?? { soruDersleri: new Set(), dersKimlikleri: new Set(), gruplar: new Set() }
  if (secenek.soruDersi) kayit.soruDersleri.add(secenek.soruDersi)
  for (const kimlik of secenek.dersKimlikleri ?? []) kayit.dersKimlikleri.add(kimlik)
  if (secenek.grup) kayit.gruplar.add(secenek.grup)
  biriken.set(sade, kayit)
}

/** Konuşma metnindeki normalleştirmeyle aynı, karakter kaybına dayanıklı yazım. */
function sadeAd(metin: string): string {
  return sadelestir(metin)
    .replaceAll('ç', 'c')
    .replaceAll('ğ', 'g')
    .replaceAll('ı', 'i')
    .replaceAll('ö', 'o')
    .replaceAll('ş', 's')
    .replaceAll('ü', 'u')
    .replace(/[’`]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

const KANONIK_SORU_DERSI: Record<string, string> = {
  turkce: 'Türkçe',
  edebiyat: 'Türkçe',
  matematik: 'Matematik',
  fizik: 'Fizik',
  kimya: 'Kimya',
  biyoloji: 'Biyoloji',
  tarih: 'Tarih',
  tarih1: 'Tarih',
  tarih2: 'Tarih',
  cografya: 'Coğrafya',
  cografya1: 'Coğrafya',
  cografya2: 'Coğrafya',
  felsefe: 'Felsefe',
  din: 'Din Kültürü',
  ydt: 'Yabancı Dil',
}

const GRUP_TESTLERI: Partial<Record<keyof typeof OSYM_TEST_ADI, TopluGrup>> = {
  'tyt-sosyal': 'sosyal',
  'tyt-fen': 'fen',
}

export const TURKCE_AILESI_KIMLIKLERI: readonly string[] = ['turkce', 'edebiyat']

// Hazır şablonlardaki bütün ders adları yeni şablonla birlikte kendiliğinden
// eklenir. Aynı kimlik farklı şablonlarda tekrar etse de küme tek kaydı korur.
for (const sablon of HAZIR_SABLONLAR) {
  for (const ders of sablon.dersler) {
    const dersKimlikleri =
      ders.id === 'turkce' || ders.id === 'edebiyat'
        ? TURKCE_AILESI_KIMLIKLERI
        : [ders.id]
    ekle(ders.ad, { soruDersi: KANONIK_SORU_DERSI[ders.id], dersKimlikleri })
  }
}

// ÖSYM adının hem tam biçimi ("TYT Temel Matematik") hem sınav öneki
// çıkarılmış biçimi konuşmada kullanılabilir.
for (const [test, ad] of Object.entries(OSYM_TEST_ADI) as [keyof typeof OSYM_TEST_ADI, string][]) {
  const grup = GRUP_TESTLERI[test]
  const dersler = HAZIR_SABLONLAR.flatMap((s) => s.dersler).filter((d) => d.osymTesti === test)
  const turkceAilesi = dersler.some((d) => d.id === 'turkce' || d.id === 'edebiyat')
  const secenek = grup
    ? { grup }
    : {
        soruDersi: dersler.map((d) => KANONIK_SORU_DERSI[d.id]).find((d): d is string => d !== undefined),
        dersKimlikleri: turkceAilesi ? TURKCE_AILESI_KIMLIKLERI : [...new Set(dersler.map((d) => d.id))],
      }
  ekle(ad, secenek)
  ekle(ad.replace(/^(?:TYT|AYT)\s+/u, ''), secenek)
}

const EK_ADLAR: readonly { adlar: readonly string[]; soruDersi?: string; dersKimlikleri?: readonly string[] }[] = [
  // Emre'nin kuralı: 'Edebiyat da Türkçe de Türk Dili ve Edebiyatı da aynı şey.'
  // Türkçe ailesi tek aile; aday kimliklerine hem 'turkce' hem 'edebiyat' girer.
  {
    adlar: [
      'türkçe', 'türkçe testi', 'türk', 'paragraf', 'dil bilgisi', 'dilbilgisi',
      'edebiyat', 'türk dili ve edebiyatı', 'tde',
    ],
    soruDersi: 'Türkçe',
    dersKimlikleri: TURKCE_AILESI_KIMLIKLERI,
  },
  { adlar: ['mat', 'matematik', 'temel matematik', 'temel mat', 'tyt matematik', 'ayt matematik', 'geometri', 'geo', 'problem'], soruDersi: 'Matematik', dersKimlikleri: ['matematik'] },
  { adlar: ['fizik', 'fiz'], soruDersi: 'Fizik', dersKimlikleri: ['fizik'] },
  { adlar: ['kimya', 'kim'], soruDersi: 'Kimya', dersKimlikleri: ['kimya'] },
  { adlar: ['biyoloji', 'biyo', 'bio'], soruDersi: 'Biyoloji', dersKimlikleri: ['biyoloji'] },
  { adlar: ['tarih', 'tarih 1', 'tarih 2', 'inkılap', 'inkılap tarihi'], soruDersi: 'Tarih', dersKimlikleri: ['tarih', 'tarih1', 'tarih2'] },
  { adlar: ['coğrafya', 'coğ', 'cog', 'coğrafya 1', 'coğrafya 2'], soruDersi: 'Coğrafya', dersKimlikleri: ['cografya', 'cografya1', 'cografya2'] },
  { adlar: ['felsefe', 'felsefe grubu', 'psikoloji', 'sosyoloji', 'mantık'], soruDersi: 'Felsefe', dersKimlikleri: ['felsefe'] },
  { adlar: ['din', 'din kültürü', 'din kültürü ve ahlak bilgisi', 'dkab'], soruDersi: 'Din Kültürü', dersKimlikleri: ['din'] },
  { adlar: ['ingilizce', 'yabancı dil', 'ydt', 'dil'], soruDersi: 'Yabancı Dil', dersKimlikleri: ['ydt'] },
]

for (const ekAd of EK_ADLAR) for (const ad of ekAd.adlar) ekle(ad, ekAd)

const GRUP_ADLARI: readonly { grup: TopluGrup; adlar: readonly string[] }[] = [
  { grup: 'fen', adlar: ['fen', 'fen bilimleri', 'fen bilgisi', 'fen testi', 'fen bilimleri testi', 'fenler'] },
  {
    grup: 'sosyal',
    adlar: [
      'sosyal', 'sosyal bilimler', 'sosyal bilgiler', 'sosyal testi', 'sosyal bilimler testi', 'sosyaller',
      'sosyal bilimler 1', 'sosyal bilimler 2', 'edebiyat sosyal 1',
    ],
  },
]

for (const { grup, adlar } of GRUP_ADLARI) for (const ad of adlar) ekle(ad, { grup })

/** Çözücünün ders ve grup tanımada kullandığı tek, kapsamlı tablo. */
export const SESLI_AD_TABLOSU: readonly SesliAd[] = [...biriken.entries()]
  .map(([ad, kayit]) => ({
    ad,
    // Birden çok günlük hedefi olan isimler güvenli değildir; bu tabloda böyle
    // bir durum oluşursa soru kipinde uydurmak yerine tanınmaz bırakılır.
    soruDersi: kayit.soruDersleri.size === 1 ? [...kayit.soruDersleri][0]! : null,
    dersKimlikleri: [...kayit.dersKimlikleri],
    grup: kayit.gruplar.size === 1 ? [...kayit.gruplar][0]! : null,
  }))
  .sort((a, b) => b.ad.length - a.ad.length || a.ad.localeCompare(b.ad, 'tr-TR'))

/** Şablon değişince tablonun resmî ders kapsamı eksilmesin diye testlerde de kullanılır. */
export const RESMI_SESLI_ADLAR = SESLI_AD_TABLOSU.filter((ad) => ad.dersKimlikleri.length > 0 || ad.grup !== null)

/** Günlük soru kipinde gerçekten yazılabilecek kanonik dersler. */
export const SESLI_SORU_ADLARI = SESLI_AD_TABLOSU.filter(
  (ad): ad is SesliAd & { soruDersi: string } => ad.soruDersi !== null && CALISMA_DERSLERI.includes(ad.soruDersi),
)
