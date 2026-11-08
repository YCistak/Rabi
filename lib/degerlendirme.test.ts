import { describe, expect, it } from 'vitest'
import {
  acilisiSay,
  kaydiOku,
  pencereIstenmeliMi,
  VARSAYILAN_DEGERLENDIRME_KAYDI,
} from './degerlendirme'

describe('mağaza değerlendirmesi', () => {
  it('ilk iki açılışta pencere istemez', () => {
    const ilk = acilisiSay(VARSAYILAN_DEGERLENDIRME_KAYDI)
    const ikinci = acilisiSay(ilk)
    expect(pencereIstenmeliMi(ilk)).toBe(false)
    expect(pencereIstenmeliMi(ikinci)).toBe(false)
  })

  it('üçüncü açılışta pencere ister', () => {
    const kayit = acilisiSay(acilisiSay(acilisiSay(VARSAYILAN_DEGERLENDIRME_KAYDI)))
    expect(pencereIstenmeliMi(kayit)).toBe(true)
  })

  it('istenen pencereyi yeniden istemez', () => {
    expect(pencereIstenmeliMi({ acilisSayisi: 3, istendi: true })).toBe(false)
  })

  it('bozuk JSON kaydını varsayılana çeker', () => {
    expect(kaydiOku('{bozuk')).toEqual(VARSAYILAN_DEGERLENDIRME_KAYDI)
  })

  it('eksik alanlı kaydı varsayılana çeker', () => {
    expect(kaydiOku(JSON.stringify({ acilisSayisi: 3 }))).toEqual(VARSAYILAN_DEGERLENDIRME_KAYDI)
  })
})
