import { describe, expect, it } from 'vitest'
import type { GunlukKayit } from './types'
import { gununHali, hedefSerisi, type GununHaliGirdisi } from './gunun-hali'

const BUGUN = '2026-09-14'

function gun(tarih: string, ...dersler: [string, number][]): GunlukKayit {
  return {
    tarih,
    kayitlar: dersler.map(([ders, toplam]) => ({ ders, toplam, dogru: toplam, yanlis: 0 })),
  }
}

/** Uzak sınav, boş banka, taze deneme, tek kayıt — hiçbir öneri tutmasın diye. */
const sakin: GununHaliGirdisi = {
  bugun: BUGUN,
  hedef: 50,
  gunlukKayitlar: [],
  bekleyenYanlis: 0,
  sonDenemeTarihi: '2026-09-12',
  kalanGun: 270,
}

describe('gununHali', () => {
  it('hedef sıfırsa cümle yok', () => {
    expect(gununHali({ ...sakin, hedef: 0 })).toBeNull()
  })

  it('her hâl tek cümle', () => {
    for (const girdi of [
      sakin,
      { ...sakin, kalanGun: 5 },
      { ...sakin, kalanGun: 0 },
      { ...sakin, bekleyenYanlis: 3, gunlukKayitlar: [gun(BUGUN, ['Mat', 10])] },
      { ...sakin, gunlukKayitlar: [gun(BUGUN, ['Mat', 50])] },
    ]) {
      const cumle = gununHali(girdi)!
      // Cümle sonu noktası ya da ünlem yalnızca sonda.
      expect(cumle.slice(0, -1)).not.toMatch(/[.!?]\s/)
    }
  })

  it('hiçbir öneri tutmayınca üç temel hâl', () => {
    expect(gununHali(sakin)).toContain('henüz soru kaydın yok')
    expect(gununHali({ ...sakin, gunlukKayitlar: [gun(BUGUN, ['Mat', 15])] })).toBe(
      'Güzel gidiyorsun; hedefine 35 soru kaldı.',
    )
    expect(gununHali({ ...sakin, gunlukKayitlar: [gun(BUGUN, ['Mat', 25], ['Fizik', 25])] })).toMatch(/hedef/i)
  })

  it('son haftada sınav her gün önde, 8–30 günde gün aşırı', () => {
    // BUGUN'ün gün sayısı çift: sınav günü. Ertesi gün tek: öteki kurallar.
    const bugunku = gununHali({ ...sakin, kalanGun: 12, bekleyenYanlis: 5 })!
    const yarinki = gununHali({ ...sakin, bugun: '2026-09-15', kalanGun: 11, bekleyenYanlis: 5 })!
    const cumleler = [bugunku, yarinki]
    expect(cumleler.some((c) => c.includes('Sınava'))).toBe(true)
    expect(cumleler.some((c) => !c.includes('Sınava'))).toBe(true)
    // Son hafta: iki gün de sınav
    expect(gununHali({ ...sakin, kalanGun: 5 })).toContain('Sınava 5 gün')
    expect(gununHali({ ...sakin, bugun: '2026-09-15', kalanGun: 4 })).toContain('Sınava 4 gün')
    expect(gununHali({ ...sakin, kalanGun: 0 })).toContain('sınav günü')
    // 31 gün: sınav kuralı devrede değil
    expect(gununHali({ ...sakin, kalanGun: 31 })).toContain('henüz soru kaydın yok')
  })

  it('dün hedef tutmuş, bugün sıfır: seri kırılıyor', () => {
    const h = gununHali({ ...sakin, gunlukKayitlar: [gun('2026-09-13', ['Mat', 50])] })
    expect(h).toBe('Dün hedefini tamamladın; bugün de devam edelim.')
    const uc = gununHali({
      ...sakin,
      gunlukKayitlar: [
        gun('2026-09-11', ['Mat', 50]),
        gun('2026-09-12', ['Mat', 50]),
        gun('2026-09-13', ['Mat', 50]),
      ],
    })
    expect(uc).toContain('3 günlük serin var')
  })

  it('bugün de tuttuysa seri sürüyor', () => {
    const h = gununHali({
      ...sakin,
      gunlukKayitlar: [gun('2026-09-13', ['Mat', 50]), gun(BUGUN, ['Mat', 50])],
    })
    expect(h).toContain('2 gündür hedeftesin')
  })

  it('evvelsi gün tutmuş ama dün tutmamışsa seri yok', () => {
    expect(hedefSerisi([gun('2026-09-12', ['Mat', 50])], BUGUN, 50)).toBe(0)
  })

  it('bankada bekleyen varsa ve bugün çalışılmışsa bankayı söyler', () => {
    const h = gununHali({
      ...sakin,
      bekleyenYanlis: 4,
      gunlukKayitlar: [gun(BUGUN, ['Mat', 10])],
    })
    expect(h).toBe('Yanlış bankanda 4 soru seni bekliyor.')
    // Bugün sıfırsa banka değil, soru çözmeye çağırıyor
    expect(gununHali({ ...sakin, bekleyenYanlis: 4 })).not.toContain('bank')
  })

  it('günün soruları tek derse yığılmışsa uyarır', () => {
    const hepsi = gununHali({ ...sakin, gunlukKayitlar: [gun(BUGUN, ['Matematik', 30])] })
    expect(hepsi).toContain('yalnızca Matematik dersi')
    const cogu = gununHali({
      ...sakin,
      gunlukKayitlar: [gun(BUGUN, ['Matematik', 25], ['Fizik', 5])],
    })
    expect(cogu).toContain('ağırlık Matematik dersinde')
    // 20'nin altında oran anlamsız; dengeliyse de sessiz
    expect(gununHali({ ...sakin, gunlukKayitlar: [gun(BUGUN, ['Matematik', 10])] })).not.toContain('Matematik')
    expect(
      gununHali({ ...sakin, gunlukKayitlar: [gun(BUGUN, ['Matematik', 15], ['Fizik', 15])] }),
    ).not.toContain('ağırlık')
  })

  it('bir haftadır dokunulmayan dersi hatırlatır', () => {
    const h = gununHali({
      ...sakin,
      gunlukKayitlar: [gun('2026-09-05', ['Kimya', 10]), gun('2026-09-13', ['Mat', 10])],
    })!
    expect(h).toMatch(/^Kimya dersi(ne|nde)? 9 gündür/)
    expect(h).not.toContain(':')
    // 30 günden eski ders "bırakılmış", hatırlatılmıyor
    expect(gununHali({ ...sakin, gunlukKayitlar: [gun('2026-08-01', ['Kimya', 10])] })).not.toContain(
      'Kimya',
    )
  })

  it('son deneme eskiyse denemeyi hatırlatır', () => {
    expect(gununHali({ ...sakin, sonDenemeTarihi: '2026-09-01' })).toContain(
      'Son denemen 13 gün önceydi',
    )
  })

  it('hiç deneme yoksa bir haftalık geçmişten sonra hatırlatır', () => {
    expect(gununHali({ ...sakin, sonDenemeTarihi: null })).not.toContain('deneme')
    const h = gununHali({
      ...sakin,
      sonDenemeTarihi: null,
      // Ders ihmal kuralına takılmasın diye dün de aynı ders çalışılmış
      gunlukKayitlar: [gun('2026-09-01', ['Mat', 5]), gun('2026-09-13', ['Mat', 5])],
    })
    expect(h).toContain('Henüz deneme kaydın yok')
  })

  it('sınav gününde soru sayısı ne olursa olsun yeni soru çözmeye zorlamaz', () => {
    for (const toplam of [0, 10, 50]) {
      const h = gununHali({ ...sakin, kalanGun: 0, gunlukKayitlar: [gun(BUGUN, ['Mat', toplam])] })!
      expect(h).toContain('sınav günü')
      expect(h).toMatch(/dinlen/)
      expect(h).not.toContain('soru')
    }
  })

  it('sıfır sorulu ders kaydı ders dağılımını değiştirmez', () => {
    const h = gununHali({ ...sakin, gunlukKayitlar: [gun(BUGUN, ['Matematik', 30], ['Fizik', 0])] })
    expect(h).toContain('yalnızca Matematik dersi')
  })

  it('birden çok öneri tutuyorsa günler arasında dönüyor', () => {
    const girdi = {
      ...sakin,
      bekleyenYanlis: 3,
      sonDenemeTarihi: '2026-08-01',
      // Bugün ve ertesi gün de çalışılmış: banka kuralı çalışılmış gün ister.
      gunlukKayitlar: [gun('2026-09-13', ['Mat', 10]), gun('2026-09-14', ['Mat', 10]), gun('2026-09-15', ['Mat', 10])],
    }
    const cumleler = ['2026-09-14', '2026-09-15'].map((bugun) => gununHali({ ...girdi, bugun })!)
    expect(cumleler.some((c) => c.includes('bank'))).toBe(true)
    expect(cumleler.some((c) => c.includes('deneme'))).toBe(true)
  })

  it('aynı gün aynı cümle, ertesi gün değişebilir', () => {
    const a = gununHali(sakin)
    expect(gununHali(sakin)).toBe(a)
    expect(gununHali({ ...sakin, bugun: '2026-09-15' })).not.toBe(a)
  })
})
