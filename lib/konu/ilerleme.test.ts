import { describe, expect, it } from 'vitest'
import {
  BILINMEYEN_SINIRI,
  GECME_ORANI,
  bankaDagilimi,
  bilinmeyenKur,
  bilinmeyenSil,
  bilinmeyenleriEkle,
  dersOrani,
  ilerlemeyiYaz,
  kilidiAc,
  konuBitti,
  konuKilitli,
  konuTamam,
  soruBekliyor,
  soruOrani,
  temadaBiten,
  type BilinmeyenKart,
} from './ilerleme'
import { konu, kart, program, soru, tema } from './tip'

const ornekKonu = konu('k1', 'Birinci Konu', [
  kart('A', 'a metni'),
  kart('B', 'b metni'),
])
const ikinciKonu = konu('k2', 'İkinci Konu', [kart('C', 'c metni')])
const ornekProgram = program('biyoloji', 9, 'Yaşamdan organizasyona', [
  tema('t1', 'Tema Bir', [ornekKonu, ikinciKonu]),
])

function bilinmeyen(id: string, ders: BilinmeyenKart['ders'] = 'biyoloji'): BilinmeyenKart {
  return {
    id,
    konuId: 'k1',
    konuAdi: 'Birinci Konu',
    ders,
    sinif: 9,
    baslik: id,
    metin: `${id} metni`,
    tarih: '2026-09-01',
  }
}

describe('ilerleme', () => {
  it('deste bitmeden konu tamamlanmış sayılmaz', () => {
    const yarim = ilerlemeyiYaz({}, 'k1', { okunan: 1, bitti: false }, '2026-09-01')
    expect(konuBitti(yarim, 'k1')).toBe(false)
  })

  it('biten konu haritada tamamlanmış görünür', () => {
    const tam = ilerlemeyiYaz({}, 'k1', { okunan: 2, bitti: true }, '2026-09-01')
    expect(konuBitti(tam, 'k1')).toBe(true)
    expect(temadaBiten(ornekProgram.temalar[0], tam)).toBe(1)
    expect(dersOrani(ornekProgram, tam)).toEqual({ biten: 1, toplam: 2 })
  })

  /** Aynı konu yeniden okunabiliyor; kayıt birikmiyor, son okuma kazanıyor. */
  it('aynı konu ikinci kez okunursa kayıt tazelenir', () => {
    let ilerlemeler = ilerlemeyiYaz({}, 'k1', { okunan: 1, bitti: false }, '2026-09-01')
    ilerlemeler = ilerlemeyiYaz(ilerlemeler, 'k1', { okunan: 2, bitti: true }, '2026-09-05')
    expect(Object.keys(ilerlemeler)).toHaveLength(1)
    expect(ilerlemeler.k1).toEqual({ okunan: 2, bitti: true, tarih: '2026-09-05' })
  })
})

/**
 * Sorusu yazılmış bir konu: tamamlanma yalnızca desteye değil geçme oranına
 * da bakıyor. Havuzdaki gerçek konuların hiçbirinde soru yok, o yüzden ölçüt
 * ancak burada denenebiliyor.
 */
const soruluKonu = konu(
  's1',
  'Sorulu Konu',
  [kart('A', 'a metni')],
  [soru('Soru 1', true, 'Açıklama 1'), soru('Soru 2', false, 'Açıklama 2')],
)

describe('soru oranı ve tamamlanma', () => {
  it('sorusu olmayan konuda deste yetiyor', () => {
    const tam = ilerlemeyiYaz({}, 'k1', { okunan: 2, bitti: true }, '2026-09-01')
    expect(soruOrani(tam, ornekKonu)).toBeNull()
    expect(konuTamam(tam, ornekKonu)).toBe(true)
  })

  it('sorusu olan konu, sorulara hiç girilmeden tamamlanmaz', () => {
    // Kartlar okundu, yoklama verilmedi: oran yok ama borç var. Bir sonraki
    // konu bununla açılsaydı yoklamayı atlamak geçmekten kolay olurdu.
    const okundu = ilerlemeyiYaz({}, 's1', { okunan: 1, bitti: true }, '2026-09-01')
    expect(soruOrani(okundu, soruluKonu)).toBeNull()
    expect(konuTamam(okundu, soruluKonu)).toBe(false)
  })

  it('sorusu olan konu geçme oranının altında tamamlanmaz', () => {
    const yarim = ilerlemeyiYaz({}, 's1', { okunan: 1, bitti: true, dogru: 0 }, '2026-09-01')
    expect(soruOrani(yarim, soruluKonu)).toBe(0)
    expect(soruOrani(yarim, soruluKonu)!).toBeLessThan(GECME_ORANI)
    expect(konuTamam(yarim, soruluKonu)).toBe(false)
    // Kartlar bitti ama borç kaldı: düğümdeki soru işaretinin ölçütü bu.
    expect(soruBekliyor(yarim, soruluKonu)).toBe(true)
  })

  it('sorular geçilince konu tamamlanır', () => {
    const tam = ilerlemeyiYaz({}, 's1', { okunan: 1, bitti: true, dogru: 2 }, '2026-09-01')
    expect(konuTamam(tam, soruluKonu)).toBe(true)
    expect(soruBekliyor(tam, soruluKonu)).toBe(false)
  })

  /*
    Geçilmiş bir konunun kartlarına ikinci kez bakmak o konuyu yarım
    göstermemeli: kayıt üzerine yazılmıyor, birleşiyor.
  */
  it('kartlar yeniden okunduğunda soru sonucu korunur', () => {
    let ilerlemeler = ilerlemeyiYaz({}, 's1', { okunan: 1, bitti: true, dogru: 2 }, '2026-09-01')
    ilerlemeler = ilerlemeyiYaz(ilerlemeler, 's1', { okunan: 1, bitti: true }, '2026-09-05')
    expect(ilerlemeler.s1.dogru).toBe(2)
    expect(konuTamam(ilerlemeler, soruluKonu)).toBe(true)
  })
})

describe('kilit', () => {
  const sirali = [ornekKonu, ikinciKonu]

  it('ilk konu hep açık', () => {
    expect(konuKilitli({}, sirali, 0)).toBe(false)
  })

  it('önceki konu bitmeden sonraki kilitli', () => {
    expect(konuKilitli({}, sirali, 1)).toBe(true)
  })

  it('önceki konu bitince kilit açılır', () => {
    const tam = ilerlemeyiYaz({}, 'k1', { okunan: 2, bitti: true }, '2026-09-01')
    expect(konuKilitli(tam, sirali, 1)).toBe(false)
  })

  /** "Yine de aç" kararı kayda giriyor; haritaya dönünce kilit geri gelmemeli. */
  it('elle açılan kilit kalıcı', () => {
    const acik = kilidiAc({}, 'k2', '2026-09-01')
    expect(konuKilitli(acik, sirali, 1)).toBe(false)
    expect(acik.k2.bitti).toBe(false)
  })

  it('elle açmak okunan kart bilgisini bozmaz', () => {
    const yarim = ilerlemeyiYaz({}, 'k2', { okunan: 1, bitti: false }, '2026-09-01')
    const acik = kilidiAc(yarim, 'k2', '2026-09-05')
    expect(acik.k2).toMatchObject({ okunan: 1, bitti: false, acildi: true, tarih: '2026-09-01' })
  })
})

describe('bilinmeyenler bankası', () => {
  it('yeni kartlar başa girer', () => {
    const banka = bilinmeyenleriEkle([bilinmeyen('a')], [bilinmeyen('b')])
    expect(banka.map((k) => k.id)).toEqual(['b', 'a'])
  })

  /** Aynı kart iki kez "bilmiyorum" işaretlenebilir; liste ikiye çıkmamalı. */
  it('aynı kart ikinci kez eklenmez, tazelenir', () => {
    const banka = bilinmeyenleriEkle([bilinmeyen('a'), bilinmeyen('b')], [bilinmeyen('a')])
    expect(banka.map((k) => k.id)).toEqual(['a', 'b'])
  })

  it('sınır aşılınca en eski kayıt düşer', () => {
    const dolu = Array.from({ length: BILINMEYEN_SINIRI }, (_, i) => bilinmeyen(`k${i}`))
    const banka = bilinmeyenleriEkle(dolu, [bilinmeyen('yeni')])
    expect(banka).toHaveLength(BILINMEYEN_SINIRI)
    expect(banka[0].id).toBe('yeni')
    expect(banka.some((k) => k.id === `k${BILINMEYEN_SINIRI - 1}`)).toBe(false)
  })

  it('girdiyi değiştirmez', () => {
    const once = [bilinmeyen('a')]
    bilinmeyenleriEkle(once, [bilinmeyen('b')])
    expect(once).toHaveLength(1)
  })

  it('tek kaydı siler', () => {
    expect(bilinmeyenSil([bilinmeyen('a'), bilinmeyen('b')], 'a').map((k) => k.id)).toEqual(['b'])
  })

  it('derse göre sayar', () => {
    const banka = [bilinmeyen('a'), bilinmeyen('b'), bilinmeyen('c', 'tarih')]
    expect(bankaDagilimi(banka)).toEqual({ biyoloji: 2, tarih: 1 })
  })

  /**
   * Kayıt kartın metnini kendi içinde taşıyor: içerik güncellenip kart
   * kimlikleri kaysa bile bankadaki yazı doğru kalmalı.
   */
  it('kart kaydı metni kendi içinde taşır', () => {
    const kayit = bilinmeyenKur(ornekKonu.kartlar[0], ornekKonu, 'biyoloji', 9, '2026-09-01')
    expect(kayit).toMatchObject({
      id: 'k1-1',
      konuId: 'k1',
      konuAdi: 'Birinci Konu',
      baslik: 'A',
      metin: 'a metni',
    })
  })
})
