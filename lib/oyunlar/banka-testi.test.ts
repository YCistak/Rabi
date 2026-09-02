import { describe, expect, it } from 'vitest'
import { bankayiGuncelle, type BankaSorusu } from './banka'
import { SIK_SAYISI, testHazirla } from './banka-testi'

const edebiyat = (eser: string, yazar: string): BankaSorusu => ({ oyun: 'edebiyat', eser, yazar })
const islem = (metin: string, sonuc: number): BankaSorusu => ({
  oyun: 'islem',
  islemTuru: 'bolme',
  metin,
  sonuc,
})

/** Testler karışıklığa değil kurala baksın diye üreteç sabit. */
const sabit = () => 0.5

function banka(sorular: BankaSorusu[]) {
  return bankayiGuncelle(
    [],
    sorular.map((soru) => ({ soru, dogruMu: false })),
    '2026-08-18',
  )
}

describe('testHazirla', () => {
  const dortEser = banka([
    edebiyat('Çalıkuşu', 'Reşat Nuri Güntekin'),
    edebiyat('Kürk Mantolu Madonna', 'Sabahattin Ali'),
    edebiyat('Tutunamayanlar', 'Oğuz Atay'),
    edebiyat('Saatleri Ayarlama Enstitüsü', 'Ahmet Hamdi Tanpınar'),
  ])

  it('bankadaki her kayıt için bir soru kurar', () => {
    const sorular = testHazirla(dortEser, sabit)
    expect(sorular).toHaveLength(4)
    expect(new Set(sorular.map((s) => s.id)).size).toBe(4)
  })

  it('doğru cevap şıkların içinde ve şıklar tekrarsız', () => {
    for (const soru of testHazirla(dortEser, sabit)) {
      expect(soru.siklar).toContain(soru.dogru)
      expect(new Set(soru.siklar).size).toBe(soru.siklar.length)
      expect(soru.siklar.length).toBeLessThanOrEqual(SIK_SAYISI)
    }
  })

  /*
    Çeldirici aynı oyundan geliyor: edebiyat sorusunun şıklarına bir işlem
    sonucu karışsaydı soru, cevabı bilmeden elenebilirdi.
  */
  it('yeterince varsa çeldiriciler aynı oyundan gelir', () => {
    const karisik = banka([
      ...dortEser.map((k) => k.soru),
      islem('156 ÷ 12', 13),
      islem('144 ÷ 12', 12),
    ])
    const edebiyatSorusu = testHazirla(karisik, sabit).find((s) => s.oyun === 'edebiyat')
    expect(edebiyatSorusu).toBeDefined()
    for (const sik of edebiyatSorusu!.siklar) {
      expect(sik).not.toMatch(/^\d+$/)
    }
  })

  /** Tek kayıtla şık kurulamıyor; cevaplanmadan doğru sayılan soru olmasın. */
  it('çeldirici bulunamayan kaydı teste almaz', () => {
    expect(testHazirla(banka([edebiyat('Çalıkuşu', 'Reşat Nuri Güntekin')]), sabit)).toHaveLength(
      0,
    )
  })

  it('az sayıda çeldirici varsa soru yine kuruluyor', () => {
    const iki = banka([
      edebiyat('Çalıkuşu', 'Reşat Nuri Güntekin'),
      edebiyat('Tutunamayanlar', 'Oğuz Atay'),
    ])
    const sorular = testHazirla(iki, sabit)
    expect(sorular).toHaveLength(2)
    expect(sorular[0].siklar).toHaveLength(2)
  })
})
