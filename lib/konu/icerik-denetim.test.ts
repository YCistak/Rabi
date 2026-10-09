import { describe, expect, it } from 'vitest'
import { KONU_DERSLERI, programBul, tumKonular } from './index'
import type { DersProgrami, KonuDersId } from './tip'

/**
 * 9–11. sınıf haritasının soru denetimi.
 *
 * `icerik.test.ts` sayıları ve uzunlukları denetliyor; bu dosya soruların
 * **metnini**: cevap anahtarı geçerli mi, iki şık aynı mı, metinde yazım
 * kalıntısı ya da bozuk karakter var mı, aynı soru iki kez yazılmış mı. Hepsi
 * elle okumada gözden kaçan, ama ekranda öğrencinin hemen fark ettiği
 * kusurlar: aynı iki şık arasında seçim yaptırmak ya da "Çin den" yazmak
 * soruya duyulan güveni bitiriyor.
 *
 * Hesap doğruluğu burada denetlenmiyor (metinden güvenle hesaplanamıyor);
 * sayısal sorular 2026-10'da elle tek tek doğrulandı.
 */

type DenetimSorusu = {
  id: string
  sinif: number
  ders: KonuDersId
  konu: string
  tur: 'dogru-yanlis' | 'sikli' | 'kontrol'
  /** Soru cümlesi ya da iddia. */
  govde: string
  siklar: string[]
  dogru: unknown
  aciklamalar: string[]
}

const SINIFLAR = [9, 10, 11] as const

const ONEKLER: Record<KonuDersId, string> = {
  matematik: 'mat',
  turkce: 'trk',
  fizik: 'fzk',
  kimya: 'kim',
  biyoloji: 'byl',
  tarih: 'trh',
  cografya: 'cog',
  ingilizce: 'ing',
}

const programlar: DersProgrami[] = SINIFLAR.flatMap((sinif) =>
  KONU_DERSLERI.map((ders) => programBul(ders.id, sinif)).filter((p): p is DersProgrami => p !== null),
)

const sorular: DenetimSorusu[] = programlar.flatMap((program) =>
  tumKonular(program).flatMap((konu) => [
    ...konu.sorular.map((s): DenetimSorusu => ({
      id: s.id,
      sinif: program.sinif,
      ders: program.ders,
      konu: konu.id,
      tur: s.tur === 'sikli' ? 'sikli' : 'dogru-yanlis',
      govde: s.tur === 'sikli' ? s.soru : s.ifade,
      siklar: s.tur === 'sikli' ? [...s.siklar] : [],
      dogru: s.dogru,
      aciklamalar: [s.aciklama],
    })),
    ...konu.kontroller.map((k, sira): DenetimSorusu => ({
      id: `${konu.id}-k${sira + 1}`,
      sinif: program.sinif,
      ders: program.ders,
      konu: konu.id,
      tur: 'kontrol',
      govde: k.soru,
      siklar: [...k.siklar],
      dogru: k.dogru,
      aciklamalar: [k.aciklama.dogru, k.aciklama.yanlis],
    })),
  ]),
)

const metinleri = (s: DenetimSorusu) => [s.govde, ...s.siklar, ...s.aciklamalar]

/** Karşılaştırma için: boşluklar teke iner, büyük-küçük harf Türkçe kurala göre eşitlenir. */
const olagan = (metin: string) => metin.replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr')

function ihlaller(kural: (s: DenetimSorusu) => string | null): string[] {
  return sorular.map((s) => {
    const sorun = kural(s)
    return sorun ? `${s.id}: ${sorun}` : null
  }).filter((x): x is string => x !== null)
}

describe('9–11 soru denetimi: kapsam', () => {
  it('üç sınıfın bütün dersleri yüklendi', () => {
    // 9 ve 10'da yedi, 11'de İngilizceyle sekiz ders.
    expect(programlar.length).toBe(22)
    expect(sorular.length).toBeGreaterThan(5000)
  })
})

describe('9–11 soru denetimi: cevap anahtarı', () => {
  it('doğru cevap geçerli ve şık sayısı iki', () => {
    expect(ihlaller((s) => {
      if (s.tur === 'dogru-yanlis') return typeof s.dogru === 'boolean' ? null : `dogru boolean değil (${String(s.dogru)})`
      if (s.siklar.length !== 2) return `${s.siklar.length} şık`
      return s.dogru === 0 || s.dogru === 1 ? null : `dogru dizini geçersiz (${String(s.dogru)})`
    })).toEqual([])
  })

  it('iki şık birbirinin aynısı değil (boşluk ve büyük-küçük harf farkı dahil)', () => {
    expect(ihlaller((s) => (s.siklar.length === 2 && olagan(s.siklar[0]) === olagan(s.siklar[1]) ? `yinelenen şık "${s.siklar[0]}"` : null))).toEqual([])
  })
})

describe('9–11 soru denetimi: metin', () => {
  it('soru metni ve şıklar boş değil, gerekçe var', () => {
    expect(ihlaller((s) => {
      if (s.govde.trim().length < 8) return `soru çok kısa: "${s.govde}"`
      if (s.siklar.some((sik) => sik.trim().length === 0)) return 'boş şık'
      if (s.aciklamalar.some((a) => a.trim().length < 2)) return 'boş gerekçe'
      return null
    })).toEqual([])
  })

  it('yazım kalıntısı yok (undefined, NaN, TODO, ???)', () => {
    const kalinti = /\bundefined\b|\bNaN\b|\bnull\b|\bTODO\b|\bFIXME\b|\?\?\?|\[object /
    expect(ihlaller((s) => metinleri(s).find((m) => kalinti.test(m)) ?? null)).toEqual([])
  })

  it('parantez, köşeli parantez ve kalın yazı işareti kapanmış', () => {
    // Aralık gösterimi ([2, 5), (−∞, 4]) kasıtlı olarak dengesiz; önce o ayıklanıyor.
    const aralik = /[[(][^[\]()]*,[^[\]()]*[\])]/g
    expect(ihlaller((s) => metinleri(s).find((m) => {
      const t = m.replace(aralik, '')
      const say = (c: string) => t.split(c).length - 1
      return say('(') !== say(')') || say('[') !== say(']') || say('{') !== say('}') || say('**') % 2 === 1 || say('$') > 0
    }) ?? null)).toEqual([])
  })

  it('emoji yok', () => {
    // Hizalı şıklarda emoji telefona göre farklı çiziliyor (AGENTS.md → Tasarım).
    expect(ihlaller((s) => metinleri(s).find((m) => /\p{Extended_Pictographic}/u.test(m)) ?? null)).toEqual([])
  })

  it('çift boşluk ya da baştaki/sondaki boşluk yok', () => {
    expect(ihlaller((s) => metinleri(s).find((m) => m.includes('  ') || m !== m.trim()) ?? null)).toEqual([])
  })

  it('bozuk Türkçe karakter (mojibake) yok', () => {
    // UTF-8'in Latin-1/1252 diye okunmuş hâli: "Ã¼", "Ä±", "Å", "â€", ya da 1254 yerine 1252 ("ý", "þ", "ð").
    const bozuk = /Ã|Ä|Å|â€|�|[ýþðÝÞÐ]/
    expect(ihlaller((s) => metinleri(s).find((m) => bozuk.test(m)) ?? null)).toEqual([])
  })

  /*
    Sayıdan ve simgeden sonra gelen ek kesme işaretiyle ayrılır: "7'den",
    "360°'dir", "%10'u". Kesme işaretinin yerine boşluk ("7 den") ya da hiç
    ayırmadan ("360°dir") yazılmış ekler ekranda bozuk metin gibi okunuyordu.
    "18 de dâhil" gibi bağlaç olan "de/da" ve "ya da" ayrık kalır.
  */
  it('sayı ve simgeden sonraki ek kesme işaretiyle ayrılmış', () => {
    const uzunEk = '(?:dir|dır|dur|dür|tir|tır|tur|tür|den|dan|ten|tan|nin|nın|nun|nün|deki|daki|teki|taki)'
    const kisaEk = '(?:e|a|ye|ya|i|ı|u|ü|si|sı|sinde|un|ün|in|ın|luk|lük|lık|lik)'
    const son = '(?=[\\s.,;:!?)]|$)'
    const bitisik = new RegExp(`[0-9°%π]${uzunEk}${son}`)
    const ayrik = new RegExp(`[0-9°%²³)] (?:${uzunEk}|${kisaEk})${son}(?! d[ae]${son})`)
    expect(ihlaller((s) => (s.ders === 'ingilizce' ? null : metinleri(s).find((m) => bitisik.test(m) || ayrik.test(m)) ?? null))).toEqual([])
  })
})

/*
  Aynı destede aynı soru iki kez gelirse yoklama bir soruyu boşa harcıyor.
  Farklı destelerde (ve sınıflarda) tekrar kasıtlı olabilir — Pisagor 9'da da
  10'da da var — ama bilinmeyen bir tekrar çoğunlukla kopyala-yapıştırdır.
  Bilinenler aşağıda; yeni bir tekrar bu listeye ancak bilerek girer.
*/
const BILINEN_DESTELER_ARASI_TEKRAR = [
  'fzk10-sabit-hiz-s7 = fzk9-nicelik-s7',
  'fzk9-nicelik-s3 = kim9-nano-s1',
  'mat10-alan-s10 = mat9-ucgen-ozellik-s14',
]

describe('9–11 soru denetimi: tekrar ve kimlik', () => {
  const anahtar = (s: DenetimSorusu) => [olagan(s.govde), ...s.siklar.map(olagan).sort()].join(' | ')
  const gruplar = new Map<string, DenetimSorusu[]>()
  for (const s of sorular.filter((x) => x.tur !== 'kontrol')) {
    gruplar.set(anahtar(s), [...(gruplar.get(anahtar(s)) ?? []), s])
  }
  const tekrarlar = [...gruplar.values()].filter((g) => g.length > 1)

  it('aynı destede birebir yinelenen soru yok', () => {
    const destede = tekrarlar.filter((g) => new Set(g.map((s) => s.konu)).size < g.length)
    expect(destede.map((g) => g.map((s) => s.id).join(' = '))).toEqual([])
  })

  it('desteler arası tekrarlar yalnızca bilinenler', () => {
    const desteler = tekrarlar
      .filter((g) => new Set(g.map((s) => s.konu)).size === g.length)
      .map((g) => g.map((s) => s.id).sort().join(' = '))
      .sort()
    expect(desteler).toEqual(BILINEN_DESTELER_ARASI_TEKRAR)
  })

  it('soru kimlikleri benzersiz ve konu kimliğiyle başlıyor', () => {
    const sayac = new Map<string, number>()
    for (const s of sorular) sayac.set(s.id, (sayac.get(s.id) ?? 0) + 1)
    expect([...sayac].filter(([, n]) => n > 1).map(([id]) => id)).toEqual([])
    expect(ihlaller((s) => (s.id.startsWith(`${s.konu}-`) ? null : 'kimlik konuyla başlamıyor'))).toEqual([])
  })

  it('konu kimliği ders ve sınıf önekini taşıyor', () => {
    expect(ihlaller((s) => (s.konu.startsWith(`${ONEKLER[s.ders]}${s.sinif}-`) ? null : `önek beklenen ${ONEKLER[s.ders]}${s.sinif}-`))).toEqual([])
  })
})

/*
  Doğru cevabın konumu: hep "Doğru" ya da hep B çıkan bir ders, soruyu
  okumadan cevaplatıyor. `icerik.test.ts` bütünü ve 11. sınıfı ölçüyor; burada
  her ders × sınıf ayrı ayrı. Hızlı kontroller ders başına 11–58 tane — o
  kadar az soruda oran rastgele de sapar, yalnızca raporlanıyor.
*/
describe('9–11 soru denetimi: doğru cevabın konumu', () => {
  const oran = (liste: DenetimSorusu[], dogruMu: (s: DenetimSorusu) => boolean) =>
    liste.length === 0 ? 0.5 : liste.filter(dogruMu).length / liste.length

  it.each(programlar.map((p) => [`${p.sinif}. sınıf ${p.ders}`, p] as const))('%s: Doğru/Yanlış ve A/B dengeli', (_ad, program) => {
    const dersin = sorular.filter((s) => s.sinif === program.sinif && s.ders === program.ders)
    const dogruOrani = oran(dersin.filter((s) => s.tur === 'dogru-yanlis'), (s) => s.dogru === true)
    const bOrani = oran(dersin.filter((s) => s.tur === 'sikli'), (s) => s.dogru === 1)
    expect(dogruOrani).toBeGreaterThanOrEqual(0.35)
    expect(dogruOrani).toBeLessThanOrEqual(0.65)
    expect(bOrani).toBeGreaterThanOrEqual(0.35)
    expect(bOrani).toBeLessThanOrEqual(0.65)
  })

  it('hızlı kontrollerde B oranı (rapor)', () => {
    const satirlar = programlar.map((p) => {
      const k = sorular.filter((s) => s.sinif === p.sinif && s.ders === p.ders && s.tur === 'kontrol')
      return `${p.sinif}-${p.ders}: B ${(oran(k, (s) => s.dogru === 1) * 100).toFixed(0)}% (${k.length})`
    })
    // Bilgi amaçlı; eşik yok.
    expect(satirlar).toHaveLength(programlar.length)
  })
})
