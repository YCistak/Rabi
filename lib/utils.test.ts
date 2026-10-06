import { describe, expect, it } from 'vitest'
import { gunKaydir, haftaBasi, haftaBasiIsaretiMi, tariheCevir, tariheYaz, yediGunlukSerit } from './utils'

describe('yediGunlukSerit', () => {
  it('pazar günü de bugünü dördüncü sırada tutup gelecek haftayı gösterir', () => {
    expect(yediGunlukSerit('2026-09-27')).toEqual([
      '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27',
      '2026-09-28', '2026-09-29', '2026-09-30',
    ])
  })

  it('ertesi gün pencere bir gün kayar', () => {
    expect(yediGunlukSerit('2026-09-28').slice(0, 6)).toEqual(
      yediGunlukSerit('2026-09-27').slice(1),
    )
  })
})

describe('haftaBasi', () => {
  it('haftayı pazartesiden başlatır', () => {
    // 2026-08-16 pazar; ait olduğu hafta 10 Ağustos pazartesi başlar.
    expect(haftaBasi('2026-08-16')).toBe('2026-08-10')
    expect(haftaBasi('2026-08-10')).toBe('2026-08-10')
    expect(haftaBasi('2026-08-14')).toBe('2026-08-10')
  })

  it('pazartesi sonraki haftaya taşınmaz', () => {
    expect(haftaBasi('2026-08-17')).toBe('2026-08-17')
  })

  it('ay sınırını aşan haftayı doğru bulur', () => {
    // 1 Eylül 2026 salı → haftası 31 Ağustos pazartesi başlar.
    expect(haftaBasi('2026-09-01')).toBe('2026-08-31')
  })
})

describe('tariheYaz / tariheCevir', () => {
  it('gidiş-dönüş aynı tarihi verir', () => {
    expect(tariheYaz(tariheCevir('2026-03-07'))).toBe('2026-03-07')
  })

  it('yerel gece yarısını kullanır, UTC kaymasına düşmez', () => {
    const t = tariheCevir('2026-01-01')
    expect(t.getFullYear()).toBe(2026)
    expect(t.getMonth()).toBe(0)
    expect(t.getDate()).toBe(1)
  })

  it('tek haneli ay ve günü sıfırla doldurur', () => {
    expect(tariheYaz(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('gunKaydir', () => {
  it('önceki günü ay sınırında doğru bulur', () => {
    expect(gunKaydir('2026-10-01', -1)).toBe('2026-09-30')
  })

  it('önceki günü yıl sınırında doğru bulur', () => {
    expect(gunKaydir('2027-01-01', -1)).toBe('2026-12-31')
  })

  it('artık yıldaki 29 Şubat üzerinden ilerler', () => {
    expect(gunKaydir('2028-03-01', -1)).toBe('2028-02-29')
  })
})

describe('haftaBasiIsaretiMi', () => {
  it('geçmişteki ve gelecekteki pazartesiyi işaretler', () => {
    // 2026-10-07 çarşamba; 5 ve 12 Ekim pazartesi.
    expect(haftaBasiIsaretiMi('2026-10-05', '2026-10-07')).toBe(true)
    expect(haftaBasiIsaretiMi('2026-10-12', '2026-10-07')).toBe(true)
  })

  it('pazartesi olmayan günleri işaretlemez', () => {
    for (const iso of ['2026-10-06', '2026-10-08', '2026-10-11']) {
      expect(haftaBasiIsaretiMi(iso, '2026-10-07')).toBe(false)
    }
  })

  it('bugün pazartesiyse o gün işaretsiz kalır, ötekiler işaretli', () => {
    expect(haftaBasiIsaretiMi('2026-10-05', '2026-10-05')).toBe(false)
    expect(haftaBasiIsaretiMi('2026-10-12', '2026-10-05')).toBe(true)
    expect(haftaBasiIsaretiMi('2026-09-28', '2026-10-05')).toBe(true)
  })

  it('yedi günlük şeritte en çok bir gün işaretli', () => {
    for (const bugunIso of ['2026-10-04', '2026-10-05', '2026-10-06', '2026-10-08']) {
      const isaretli = yediGunlukSerit(bugunIso).filter((iso) => haftaBasiIsaretiMi(iso, bugunIso))
      expect(isaretli.length).toBe(bugunIso === '2026-10-05' ? 0 : 1)
    }
  })
})
