import { describe, expect, it } from 'vitest'
import { geriSayim, gunFarki, yilinTakvimi } from './sinav-tarihi'
import { sinavSozu } from './sinav-sozleri'

describe('yilinTakvimi', () => {
  it('ilan edilmiş yılları tahmin olarak işaretlemez', () => {
    expect(yilinTakvimi(2026)).toEqual({
      yil: 2026,
      tyt: '2026-06-20',
      ayt: '2026-06-21',
      tahmini: false,
    })
  })

  it('ilan edilmemiş yıl için haziranın üçüncü hafta sonunu tahmin eder', () => {
    // Haziran 2027'nin cumartesileri: 5, 12, 19, 26.
    expect(yilinTakvimi(2027)).toEqual({
      yil: 2027,
      tyt: '2027-06-19',
      ayt: '2027-06-20',
      tahmini: true,
    })
  })

  it('ayın 1’i cumartesiyse o günü ilk cumartesi sayar', () => {
    // 1 Haziran 2030 cumartesi → üçüncüsü 15 Haziran.
    expect(yilinTakvimi(2030).tyt).toBe('2030-06-15')
  })
})

describe('gunFarki', () => {
  it('gün sayısını verir', () => {
    expect(gunFarki('2026-06-01', '2026-06-20')).toBe(19)
    expect(gunFarki('2026-06-20', '2026-06-20')).toBe(0)
    expect(gunFarki('2026-06-21', '2026-06-20')).toBe(-1)
  })

  it('yaz saati geçişinde kaymaz', () => {
    // Türkiye'de yaz saati sabit ama cihaz başka yerelde olabilir.
    expect(gunFarki('2026-03-28', '2026-03-30')).toBe(2)
  })
})

describe('geriSayim', () => {
  it('yılın sınavı gelmediyse o yıla sayar', () => {
    const s = geriSayim('2026-06-01')
    expect(s.takvim.yil).toBe(2026)
    expect(s.oturum).toBe('tyt')
    expect(s.kalanGun).toBe(19)
  })

  it('sınav günü sıfır gün gösterir', () => {
    expect(geriSayim('2026-06-20').kalanGun).toBe(0)
  })

  it('TYT geçtiyse aynı hafta sonunun AYT’sine döner', () => {
    const s = geriSayim('2026-06-21')
    expect(s.oturum).toBe('ayt')
    expect(s.kalanGun).toBe(0)
    expect(s.takvim.yil).toBe(2026)
  })

  it('sınav hafta sonu bittiyse sonraki yıla geçer', () => {
    const s = geriSayim('2026-06-22')
    expect(s.takvim.yil).toBe(2027)
    expect(s.oturum).toBe('tyt')
    expect(s.tahmini).toBe(true)
    expect(s.kalanGun).toBe(gunFarki('2026-06-22', '2027-06-19'))
  })

  it('ilerleme bir önceki sınavdan bu yana geçen günü verir', () => {
    const s = geriSayim('2026-06-22')
    // Önceki YKS 21 Haziran 2026 (AYT), sonraki TYT 19 Haziran 2027.
    expect(s.toplamGun).toBe(gunFarki('2026-06-21', '2027-06-19'))
    expect(s.gecenGun).toBe(1)
  })

  it('ilerleme her zaman 0 ile toplam arasında kalır', () => {
    for (const gun of ['2026-06-22', '2026-12-31', '2027-06-19']) {
      const s = geriSayim(gun)
      expect(s.gecenGun).toBeGreaterThanOrEqual(0)
      expect(s.gecenGun).toBeLessThanOrEqual(s.toplamGun)
    }
  })
})

describe('sinavSozu', () => {
  it('aynı gün aynı sözü verir, ertesi gün başkasını', () => {
    const bugun = sinavSozu(120, 'tyt', '2026-02-20')
    expect(sinavSozu(120, 'tyt', '2026-02-20')).toEqual(bugun)
    expect(sinavSozu(119, 'tyt', '2026-02-21').metin).not.toBe(bugun.metin)
  })

  it('kalan güne uygun kademeyi seçer', () => {
    expect(sinavSozu(0, 'tyt', 'x').baslik).toBe('Bugün')
    expect(sinavSozu(1, 'tyt', 'x').baslik).toBe('Yarın')
    expect(sinavSozu(9, 'tyt', 'x').baslik).toBe('İki hafta')
    expect(sinavSozu(400, 'tyt', 'x').baslik).toBe('Uzun yol')
  })

  it('dönüm noktalarında o güne özel cümleyi verir', () => {
    expect(sinavSozu(100, 'tyt', 'x').metin).toContain('Yüz gün')
    expect(sinavSozu(100, 'tyt', 'y').metin).toBe(sinavSozu(100, 'tyt', 'z').metin)
  })

  it('AYT oturumunda TYT’nin bittiğini bilir', () => {
    expect(sinavSozu(0, 'ayt', 'x').metin).toContain('AYT')
    expect(sinavSozu(1, 'ayt', 'x').metin).toContain('TYT bitti')
  })
})
