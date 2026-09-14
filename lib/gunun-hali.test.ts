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
  it('hedef sıfırsa kart yok', () => {
    expect(gununHali({ ...sakin, hedef: 0 })).toBeNull()
  })

  it('hiçbir öneri tutmayınca üç temel hâl', () => {
    expect(gununHali(sakin)?.poz).toBe('uzgun')
    expect(gununHali({ ...sakin, gunlukKayitlar: [gun(BUGUN, ['Mat', 20])] })?.poz).toBe('okuyan')
    expect(gununHali({ ...sakin, gunlukKayitlar: [gun(BUGUN, ['Mat', 50])] })?.poz).toBe('ziplayan')
  })

  it('son haftada sınav her gün önde, 8–30 günde gün aşırı', () => {
    // BUGUN'ün gün sayısı çift: sınav günü. Ertesi gün tek: öteki kurallar.
    const bugunku = gununHali({ ...sakin, kalanGun: 12, bekleyenYanlis: 5 })!
    const yarinki = gununHali({ ...sakin, bugun: '2026-09-15', kalanGun: 11, bekleyenYanlis: 5 })!
    const basliklar = [bugunku.baslik, yarinki.baslik]
    expect(basliklar.some((b) => b.includes('Sınava'))).toBe(true)
    expect(basliklar.some((b) => !b.includes('Sınava'))).toBe(true)
    // Son hafta: iki gün de sınav
    expect(gununHali({ ...sakin, kalanGun: 5 })!.baslik).toContain('Sınava 5 gün')
    expect(gununHali({ ...sakin, bugun: '2026-09-15', kalanGun: 4 })!.baslik).toContain('Sınava 4 gün')
    expect(gununHali({ ...sakin, kalanGun: 0 })!.baslik).toContain('Sınav günü')
    // 31 gün: sınav kuralı devrede değil
    expect(gununHali({ ...sakin, kalanGun: 31 })!.baslik).toBe('Bugün hiç soru çözmedin')
  })

  it('dün hedef tutmuş, bugün sıfır: seri kırılıyor', () => {
    const h = gununHali({ ...sakin, gunlukKayitlar: [gun('2026-09-13', ['Mat', 50])] })!
    expect(h.baslik).toBe('Dünkü seri seni bekliyor')
    const uc = gununHali({
      ...sakin,
      gunlukKayitlar: [
        gun('2026-09-11', ['Mat', 50]),
        gun('2026-09-12', ['Mat', 50]),
        gun('2026-09-13', ['Mat', 50]),
      ],
    })!
    expect(uc.baslik).toBe('3 günlük seri kırılmasın')
  })

  it('bugün de tuttuysa seri sürüyor', () => {
    const h = gununHali({
      ...sakin,
      gunlukKayitlar: [gun('2026-09-13', ['Mat', 50]), gun(BUGUN, ['Mat', 50])],
    })!
    expect(h.baslik).toBe('2 gündür hedefteysin')
    expect(h.poz).toBe('ziplayan')
  })

  it('evvelsi gün tutmuş ama dün tutmamışsa seri yok', () => {
    expect(hedefSerisi([gun('2026-09-12', ['Mat', 50])], BUGUN, 50)).toBe(0)
  })

  it('bankada bekleyen varsa ve bugün çalışılmışsa bankayı işaret eder', () => {
    const h = gununHali({
      ...sakin,
      bekleyenYanlis: 4,
      gunlukKayitlar: [gun(BUGUN, ['Mat', 10])],
    })!
    expect(h.baslik).toBe('Bankada 4 soru bekliyor')
    expect(h.ekran).toBe('yanlis-banka')
    // Bugün sıfırsa banka değil, soru çözmeye çağırıyor
    expect(gununHali({ ...sakin, bekleyenYanlis: 4 })!.ekran).toBe('soru')
  })

  it('günün soruları tek derse yığılmışsa uyarır', () => {
    const hepsi = gununHali({ ...sakin, gunlukKayitlar: [gun(BUGUN, ['Matematik', 30])] })!
    expect(hepsi.baslik).toBe('Hepsi Matematik')
    const cogu = gununHali({
      ...sakin,
      gunlukKayitlar: [gun(BUGUN, ['Matematik', 25], ['Fizik', 5])],
    })!
    expect(cogu.baslik).toBe('Çoğu Matematik')
    // 20'nin altında oran anlamsız; dengeliyse de sessiz
    expect(gununHali({ ...sakin, gunlukKayitlar: [gun(BUGUN, ['Matematik', 10])] })!.baslik).not.toContain('Matematik')
    expect(
      gununHali({ ...sakin, gunlukKayitlar: [gun(BUGUN, ['Matematik', 15], ['Fizik', 15])] })!.baslik,
    ).not.toContain('Çoğu')
  })

  it('bir haftadır dokunulmayan dersi hatırlatır', () => {
    const h = gununHali({
      ...sakin,
      gunlukKayitlar: [gun('2026-09-05', ['Kimya', 10]), gun('2026-09-13', ['Mat', 10])],
    })!
    expect(h.baslik).toBe('Kimya 9 gündür bekliyor')
    // 30 günden eski ders "bırakılmış", hatırlatılmıyor
    expect(
      gununHali({ ...sakin, gunlukKayitlar: [gun('2026-08-01', ['Kimya', 10])] })!.baslik,
    ).not.toContain('Kimya')
  })

  it('son deneme eskiyse denemeyi işaret eder', () => {
    const h = gununHali({ ...sakin, sonDenemeTarihi: '2026-09-01' })!
    expect(h.baslik).toBe('Son deneme 13 gün önceydi')
    expect(h.ekran).toBe('deneme')
  })

  it('hiç deneme yoksa bir haftalık geçmişten sonra hatırlatır', () => {
    expect(gununHali({ ...sakin, sonDenemeTarihi: null })!.ekran).toBe('soru')
    const h = gununHali({
      ...sakin,
      sonDenemeTarihi: null,
      // Ders ihmal kuralına takılmasın diye dün de aynı ders çalışılmış
      gunlukKayitlar: [gun('2026-09-01', ['Mat', 5]), gun('2026-09-13', ['Mat', 5])],
    })!
    expect(h.baslik).toBe('Henüz deneme girmedin')
  })

  it('aynı gün aynı cümle, ertesi gün değişebilir', () => {
    const a = gununHali(sakin)!
    const b = gununHali(sakin)!
    expect(a.alt).toBe(b.alt)
    const yarin = gununHali({ ...sakin, bugun: '2026-09-15' })!
    expect(yarin.alt).not.toBe(a.alt)
  })
})
