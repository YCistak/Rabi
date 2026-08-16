import { describe, expect, it } from 'vitest'
import {
  ROZETLER,
  hakEdilenler,
  rozetDurumu,
  rozetListesi,
  yeniRozetler,
} from './rozetler'
import type { Deneme, GunlukKayit } from './types'

function denemeler(sayi: number): Deneme[] {
  return Array.from({ length: sayi }, (_, i) => ({
    id: `d${i}`,
    sablonId: 'tyt',
    ad: `Deneme ${i}`,
    tarih: '2026-08-10',
    sonuclar: [],
  }))
}

function gun(tarih: string, dogru: number): GunlukKayit {
  return { tarih, kayitlar: [{ ders: 'Matematik', toplam: dogru, dogru, yanlis: 0 }] }
}

describe('rozetDurumu', () => {
  it('en iyi gün ve haftayı bulur', () => {
    // 2026-08-10 pazartesi, 2026-08-17 sonraki pazartesi
    const durum = rozetDurumu({
      denemeler: denemeler(12),
      gunlukKayitlar: [
        gun('2026-08-10', 120),
        gun('2026-08-11', 310),
        gun('2026-08-17', 250),
      ],
      diplomaNotu: 91.4,
    })

    expect(durum.denemeSayisi).toBe(12)
    expect(durum.enIyiGun).toBe(310)
    // İlk hafta 120 + 310 = 430, ikinci hafta 250
    expect(durum.enIyiHafta).toBe(430)
    expect(durum.diplomaNotu).toBe(91.4)
  })

  it('kayıt yoksa sıfırlanır', () => {
    const durum = rozetDurumu({ denemeler: [], gunlukKayitlar: [], diplomaNotu: null })
    expect(durum).toEqual({
      denemeSayisi: 0,
      diplomaNotu: null,
      enIyiGun: 0,
      enIyiHafta: 0,
    })
  })
})

describe('hakEdilenler', () => {
  it('eşiğin altındaki rozet verilmez', () => {
    const durum = rozetDurumu({
      denemeler: denemeler(9),
      gunlukKayitlar: [],
      diplomaNotu: null,
    })
    expect(hakEdilenler(durum)).toEqual([])
  })

  it('eşiğe tam oturunca verilir', () => {
    const durum = rozetDurumu({
      denemeler: denemeler(10),
      gunlukKayitlar: [],
      diplomaNotu: null,
    })
    expect(hakEdilenler(durum).map((r) => r.id)).toEqual(['deneme-10'])
  })

  it('alt basamaklar da birlikte gelir', () => {
    const durum = rozetDurumu({
      denemeler: denemeler(55),
      gunlukKayitlar: [],
      diplomaNotu: null,
    })
    expect(hakEdilenler(durum).map((r) => r.id)).toEqual([
      'deneme-10',
      'deneme-20',
      'deneme-50',
    ])
  })

  /** Diploma notu girilmemişse 0 sayılmalı, rozet verilmemeli. */
  it('diploma notu yoksa okul rozeti çıkmaz', () => {
    const durum = rozetDurumu({
      denemeler: [],
      gunlukKayitlar: [],
      diplomaNotu: null,
    })
    expect(hakEdilenler(durum).some((r) => r.tur === 'diploma')).toBe(false)
  })

  it('diploma 95 hem 90 hem 95 rozetini verir', () => {
    const durum = rozetDurumu({ denemeler: [], gunlukKayitlar: [], diplomaNotu: 96 })
    expect(hakEdilenler(durum).map((r) => r.id)).toEqual(['diploma-90', 'diploma-95'])
  })
})

describe('yeniRozetler', () => {
  const durum = rozetDurumu({
    denemeler: denemeler(20),
    gunlukKayitlar: [],
    diplomaNotu: null,
  })

  it('kazanılmamışları döner', () => {
    expect(yeniRozetler(durum, []).map((r) => r.id)).toEqual(['deneme-10', 'deneme-20'])
  })

  it('zaten kazanılanı tekrar vermez', () => {
    const kazanilmis = [{ rozetId: 'deneme-10', tarih: '2026-07-01' }]
    expect(yeniRozetler(durum, kazanilmis).map((r) => r.id)).toEqual(['deneme-20'])
  })

  it('hepsi kazanılmışsa boş döner', () => {
    const kazanilmis = [
      { rozetId: 'deneme-10', tarih: '2026-07-01' },
      { rozetId: 'deneme-20', tarih: '2026-07-20' },
    ]
    expect(yeniRozetler(durum, kazanilmis)).toEqual([])
  })
})

describe('rozetListesi', () => {
  /**
   * Rozet bir kez kazanılınca kalıcı. Deneme silinip sayı eşiğin altına düşse
   * bile rozet ekranda kazanılmış kalmalı — geri alınması cezalandırıcı olurdu.
   */
  it('veri düşse de kazanılmış rozet durur', () => {
    const durum = rozetDurumu({
      denemeler: denemeler(3),
      gunlukKayitlar: [],
      diplomaNotu: null,
    })
    const liste = rozetListesi(durum, [{ rozetId: 'deneme-10', tarih: '2026-07-01' }])
    const on = liste.find((s) => s.rozet.id === 'deneme-10')!

    expect(on.kazanildi).toBe(true)
    expect(on.tarih).toBe('2026-07-01')
    expect(on.mevcut).toBe(3)
  })

  it('bütün rozetleri kapsar', () => {
    const durum = rozetDurumu({ denemeler: [], gunlukKayitlar: [], diplomaNotu: null })
    expect(rozetListesi(durum, [])).toHaveLength(ROZETLER.length)
  })

  it('kazanılanlar üstte, kalanlar yakınlığa göre sıralanır', () => {
    const durum = rozetDurumu({
      denemeler: denemeler(10),
      gunlukKayitlar: [gun('2026-08-10', 190)],
      diplomaNotu: null,
    })
    const liste = rozetListesi(durum, [{ rozetId: 'deneme-10', tarih: '2026-08-10' }])

    expect(liste[0].rozet.id).toBe('deneme-10')
    // 190/200 ile en yakın olan günlük rozeti hemen ardından gelmeli
    expect(liste[1].rozet.id).toBe('gun-200')
  })

  it('rozet kimlikleri benzersiz', () => {
    expect(new Set(ROZETLER.map((r) => r.id)).size).toBe(ROZETLER.length)
  })
})
