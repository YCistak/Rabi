import { describe, expect, it } from 'vitest'
import {
  BANKA_SINIRI,
  DUSME_ESIGI,
  bankaDagilimi,
  OYUN_KIMLIKLERI,
  bankaKimligi,
  bankaSuz,
  bankayiGuncelle,
  bankaCevabiMetni,
  bankaSorusuMetni,
  sestenBanka,
  bolunmedenBanka,
  dusenSayisi,
  enKalabalikOyun,
  type BankaKaydi,
  type BankaSorusu,
} from './banka'

const yazim = (dogru: string): BankaSorusu => ({
  oyun: 'yazim',
  dogru,
  yanlis: `${dogru}!`,
  kural: 'kural',
})

const islem: BankaSorusu = { oyun: 'islem', islemTuru: 'bolme', metin: '156 ÷ 12', sonuc: 13 }
const edebiyat: BankaSorusu = { oyun: 'edebiyat', eser: 'Çalıkuşu', yazar: 'Reşat Nuri Güntekin' }

describe('bankaKimligi', () => {
  it('aynı soru için aynı kimliği üretir', () => {
    expect(bankaKimligi(yazim('yanlış'))).toBe(bankaKimligi(yazim('yanlış')))
  })

  it('farklı oyunların kimlikleri çakışmaz', () => {
    expect(bankaKimligi(islem)).not.toBe(bankaKimligi(edebiyat))
  })
})

describe('bankayiGuncelle', () => {
  it('yanlış bilinen soruyu bankaya ekler', () => {
    const banka = bankayiGuncelle([], [{ soru: yazim('yanlış'), dogruMu: false }], '2026-08-18')
    expect(banka).toHaveLength(1)
    expect(banka[0].kacKez).toBe(1)
    expect(banka[0].ardisikDogru).toBe(0)
  })

  it('doğru bilinen soru bankaya girmez', () => {
    expect(bankayiGuncelle([], [{ soru: islem, dogruMu: true }], '2026-08-18')).toHaveLength(0)
  })

  it('aynı soru ikinci kez yanlışsa yeni kayıt açmaz, sayacı artırır', () => {
    let banka = bankayiGuncelle([], [{ soru: islem, dogruMu: false }], '2026-08-18')
    banka = bankayiGuncelle(banka, [{ soru: islem, dogruMu: false }], '2026-08-19')
    expect(banka).toHaveLength(1)
    expect(banka[0].kacKez).toBe(2)
  })

  it(`üst üste ${DUSME_ESIGI} doğrudan sonra kayıt düşer`, () => {
    let banka = bankayiGuncelle([], [{ soru: edebiyat, dogruMu: false }], '2026-08-18')
    for (let i = 0; i < DUSME_ESIGI - 1; i++) {
      banka = bankayiGuncelle(banka, [{ soru: edebiyat, dogruMu: true }], '2026-08-19')
      expect(banka).toHaveLength(1)
    }
    banka = bankayiGuncelle(banka, [{ soru: edebiyat, dogruMu: true }], '2026-08-20')
    expect(banka).toHaveLength(0)
  })

  it('araya giren yanlış ilerlemeyi sıfırlar', () => {
    let banka = bankayiGuncelle([], [{ soru: edebiyat, dogruMu: false }], '2026-08-18')
    banka = bankayiGuncelle(banka, [{ soru: edebiyat, dogruMu: true }], '2026-08-19')
    banka = bankayiGuncelle(banka, [{ soru: edebiyat, dogruMu: false }], '2026-08-20')
    expect(banka[0].ardisikDogru).toBe(0)
    expect(banka[0].kacKez).toBe(2)
  })

  it('girdiyi değiştirmez', () => {
    const banka = bankayiGuncelle([], [{ soru: islem, dogruMu: false }], '2026-08-18')
    const kopya = structuredClone(banka)
    bankayiGuncelle(banka, [{ soru: islem, dogruMu: false }], '2026-08-19')
    expect(banka).toEqual(kopya)
  })

  it(`sınır aşılınca en eski kayıt düşer, boyut ${BANKA_SINIRI}'de kalır`, () => {
    let banka: BankaKaydi[] = []
    for (let i = 0; i < BANKA_SINIRI; i++) {
      const gun = String(i + 1).padStart(2, '0')
      banka = bankayiGuncelle(banka, [{ soru: yazim(`k${i}`), dogruMu: false }], `2026-01-${gun}`)
    }
    expect(banka).toHaveLength(BANKA_SINIRI)

    banka = bankayiGuncelle(banka, [{ soru: yazim('yeni'), dogruMu: false }], '2026-12-31')
    expect(banka).toHaveLength(BANKA_SINIRI)
    expect(banka.some((k) => k.id === bankaKimligi(yazim('yeni')))).toBe(true)
    expect(banka.some((k) => k.id === bankaKimligi(yazim('k0')))).toBe(false)
  })
})

describe('dağılım ve süzme', () => {
  const banka = bankayiGuncelle(
    [],
    [
      { soru: yazim('a'), dogruMu: false },
      { soru: yazim('b'), dogruMu: false },
      { soru: islem, dogruMu: false },
    ],
    '2026-08-18',
  )

  /**
   * Dağılımın **tamamı** karşılaştırılmıyor: her yeni oyun eklendiğinde bu test
   * kırılıyordu ve kırılması bir şey öğretmiyordu. İlgilendiği sayılar tek tek,
   * gerisi toplamla doğrulanıyor.
   */
  it('oyun başına sayar', () => {
    const dagilim = bankaDagilimi(banka)
    expect(dagilim.yazim).toBe(2)
    expect(dagilim.islem).toBe(1)
    expect(dagilim.edebiyat).toBe(0)
    // Kaydı olmayan bütün oyunlar sıfır kalmalı.
    expect(Object.values(dagilim).reduce((t, n) => t + n, 0)).toBe(3)
  })

  it('dağılım bütün oyunları kapsıyor', () => {
    expect(Object.keys(bankaDagilimi([])).sort()).toEqual([...OYUN_KIMLIKLERI].sort())
  })

  it('tek oyuna süzer', () => {
    expect(bankaSuz(banka, 'islem')).toHaveLength(1)
    expect(bankaSuz(banka, 'tumu')).toHaveLength(3)
  })

  it('en kalabalık oyunu bulur', () => {
    expect(enKalabalikOyun(banka)).toBe('yazim')
    expect(enKalabalikOyun([])).toBeNull()
  })
})

describe('dusenSayisi', () => {
  const kayit = (id: string): BankaKaydi => ({
    id,
    soru: { oyun: 'yazim', dogru: 'herkes', yanlis: 'herkez', kural: 'k' },
    kacKez: 1,
    ardisikDogru: 0,
    eklenme: '2026-08-10',
    sonYanlis: '2026-08-10',
  })

  it('listeden çıkan kayıtları sayar', () => {
    expect(dusenSayisi([kayit('a'), kayit('b'), kayit('c')], [kayit('b')])).toBe(2)
  })

  it('hiç düşmediyse sıfır', () => {
    const once = [kayit('a'), kayit('b')]
    expect(dusenSayisi(once, once)).toBe(0)
  })

  /**
   * Aynı turda hem düşme hem ekleme olabilir; boyut farkına bakmak yanıltır.
   * Burada bir kayıt düşüp iki yenisi geliyor, liste büyüyor ama düşen bir.
   */
  it('aynı turda eklenen kayıtlar düşeni gizlemez', () => {
    const once = [kayit('a')]
    const sonra = [kayit('b'), kayit('c')]
    expect(dusenSayisi(once, sonra)).toBe(1)
  })

  it('boş listelerle çalışır', () => {
    expect(dusenSayisi([], [])).toBe(0)
    expect(dusenSayisi([], [kayit('a')])).toBe(0)
  })
})

describe('ses kolu', () => {
  const soru = sestenBanka({ kelime: 'burnu', olusum: 'burun + u', olay: 'unluDusmesi' })

  it('bankaya çevirir', () => {
    expect(soru).toEqual({
      oyun: 'ses',
      kelime: 'burnu',
      olusum: 'burun + u',
      olay: 'unluDusmesi',
    })
  })

  /** Kimlik sözcükten üretiliyor: aynı sözcük ikinci kez karıştırılınca yeni
   *  kayıt açılmamalı, mevcut kaydın sayacı artmalı. */
  it('kimliği sözcükten üretir', () => {
    expect(bankaKimligi(soru)).toBe('ses:burnu')
  })

  it('listede sözcük ve olay adı görünür', () => {
    expect(bankaSorusuMetni(soru)).toBe('burnu')
    expect(bankaCevabiMetni(soru)).toBe('Ünlü düşmesi')
  })

  it('aynı sözcük iki kayıt açmaz', () => {
    const banka = bankayiGuncelle(
      [],
      [
        { soru, dogruMu: false },
        { soru, dogruMu: false },
      ],
      '2026-08-18',
    )
    expect(banka).toHaveLength(1)
    expect(banka[0].kacKez).toBe(2)
  })
})

describe('bölünebilme kolu', () => {
  const kalanSorusu = bolunmedenBanka({ tip: 'kalan', sayi: 4537, bolen: 8 })
  const bolunurSorusu = bolunmedenBanka({ tip: 'bolunur', sayi: 4536, bolen: 8 })

  it('bankaya çevirir', () => {
    expect(kalanSorusu).toEqual({ oyun: 'bolunme', sayi: 4537, bolen: 8, bolunmeTipi: 'kalan' })
  })

  /** Cevap kayıtta durmuyor, sayıdan hesaplanıyor: 4537 = 8·567 + 1. */
  it('cevabı sayıdan hesaplar', () => {
    expect(bankaCevabiMetni(kalanSorusu)).toBe('1')
    expect(bankaCevabiMetni(bolunurSorusu)).toBe('Evet')
    expect(bankaCevabiMetni(bolunmedenBanka({ tip: 'bolunur', sayi: 4537, bolen: 8 }))).toBe(
      'Hayır',
    )
  })

  it('listede soru okunur görünür', () => {
    expect(bankaSorusuMetni(kalanSorusu)).toBe('4537 ÷ 8 · kalan?')
    expect(bankaSorusuMetni(bolunurSorusu)).toBe('4536 · 8’e bölünür mü?')
  })

  /**
   * Aynı sayı hem "bölünür mü" hem "kalan kaç" olarak sorulabiliyor. Kimlik
   * yalnız sayıdan üretilseydi ikisi tek kayda düşer, birini bilmek diğerini de
   * bankadan düşürürdü.
   */
  it('aynı sayının iki soru tipi ayrı kayıt açar', () => {
    const ayni = bolunmedenBanka({ tip: 'kalan', sayi: 4536, bolen: 8 })
    expect(bankaKimligi(ayni)).not.toBe(bankaKimligi(bolunurSorusu))

    const banka = bankayiGuncelle(
      [],
      [
        { soru: ayni, dogruMu: false },
        { soru: bolunurSorusu, dogruMu: false },
      ],
      '2026-08-19',
    )
    expect(banka).toHaveLength(2)
  })

  it('aynı bölen farklı sayıda ayrı kayıt açar', () => {
    const banka = bankayiGuncelle(
      [],
      [
        { soru: kalanSorusu, dogruMu: false },
        { soru: bolunmedenBanka({ tip: 'kalan', sayi: 1234, bolen: 8 }), dogruMu: false },
      ],
      '2026-08-19',
    )
    expect(banka).toHaveLength(2)
  })
})
