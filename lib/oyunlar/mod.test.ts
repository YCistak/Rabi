import { describe, expect, it } from 'vitest'
import {
  MODLAR,
  MOD_SIRASI,
  TURBO_SURESI,
  VARSAYILAN_MOD,
  etkinMod,
  modKayitliMi,
  moduNormalize,
  type OyunModu,
} from './mod'
import { elerMi } from './ritim'
import { TUR_SURESI } from './tur'

describe('katalog', () => {
  it('her mod sırada bir kez geçiyor', () => {
    expect(new Set(MOD_SIRASI).size).toBe(MOD_SIRASI.length)
    expect(MOD_SIRASI.length).toBe(Object.keys(MODLAR).length)
  })

  it('her modun adı, özeti ve kuralı var', () => {
    for (const mod of MOD_SIRASI) {
      const tanim = MODLAR[mod]
      expect(tanim.id, mod).toBe(mod)
      expect(tanim.ad.length, mod).toBeGreaterThan(2)
      expect(tanim.ozet.length, mod).toBeGreaterThan(2)
      expect(tanim.kural.length, mod).toBeGreaterThan(20)
    }
  })

  it('varsayılan mod sıradan tur', () => {
    expect(VARSAYILAN_MOD).toBe('siradan')
    expect(MODLAR.siradan.turSuresi).toBe(TUR_SURESI)
  })

  it('turbo sıradanın yarısı', () => {
    expect(TURBO_SURESI).toBe(TUR_SURESI / 2)
    expect(MODLAR.turbo.turSuresi).toBe(TURBO_SURESI)
  })

  /*
    Saat ya tura ait ya soruya, ikisine birden değil: iki sayaç aynı anda
    işleseydi ekranda hangisinin gösterildiği moda göre değişirdi.
  */
  it('hiçbir modda iki sayaç birden yok', () => {
    for (const mod of MOD_SIRASI) {
      const { turSuresi, soruSayaci } = MODLAR[mod]
      expect(turSuresi !== null && soruSayaci, mod).toBe(false)
    }
  })

  /* Süresiz bir turda "kaç doğru yaptın" sabrı ölçer, bilgiyi değil. */
  it('sayacı olmayan tek mod rahat ve o da kayıtsız', () => {
    const sayacsiz = MOD_SIRASI.filter(
      (m) => MODLAR[m].turSuresi === null && !MODLAR[m].soruSayaci,
    )
    expect(sayacsiz).toEqual(['rahat'])
    expect(modKayitliMi('rahat')).toBe(false)
  })

  it('rahat dışındaki her mod rekora sayılıyor', () => {
    for (const mod of MOD_SIRASI) {
      expect(modKayitliMi(mod), mod).toBe(mod !== 'rahat')
    }
  })

  /* Ceza yalnızca süreden düşülebilir; saatsiz modda düşecek bir şey yok. */
  it('yanlış cezası yalnızca tur saatli modlarda var', () => {
    for (const mod of MOD_SIRASI) {
      const { turSuresi, yanlisCezasi } = MODLAR[mod]
      expect(yanlisCezasi > 0, mod).toBe(turSuresi !== null)
    }
  })
})

describe('moduNormalize', () => {
  it('bilinen modu olduğu gibi bırakıyor', () => {
    for (const mod of MOD_SIRASI) expect(moduNormalize(mod)).toBe(mod)
  })

  /* Kayıt elle kurcalanabiliyor; tanınmayan değerde oyun hiç açılmazdı. */
  it('tanınmayan değeri varsayılana düşürüyor', () => {
    expect(moduNormalize('kolay')).toBe(VARSAYILAN_MOD)
    expect(moduNormalize(undefined)).toBe(VARSAYILAN_MOD)
    expect(moduNormalize(7)).toBe(VARSAYILAN_MOD)
    expect(moduNormalize(null)).toBe(VARSAYILAN_MOD)
  })
})

describe('etkinMod', () => {
  it('normal turda seçilen mod geçerli', () => {
    for (const mod of MOD_SIRASI) expect(etkinMod(mod, false)).toBe(mod)
  })

  /* Banka turu modu dinlemiyor: süreli bir tur onu yarıda keserdi. */
  it('banka turu her zaman soru başına süreyle işliyor', () => {
    for (const mod of MOD_SIRASI) {
      expect(MODLAR[etkinMod(mod, true)].soruSayaci, mod).toBe(true)
    }
  })
})

describe('elerMi', () => {
  it('yalnızca ani ölümde eliyor', () => {
    const modlar: OyunModu[] = [...MOD_SIRASI]
    for (const mod of modlar) {
      expect(elerMi(false, false, mod), mod).toBe(mod === 'ani-olum')
    }
  })

  it('doğru cevap hiçbir modda elemiyor', () => {
    for (const mod of MOD_SIRASI) expect(elerMi(true, false, mod), mod).toBe(false)
  })

  it('banka turu hiçbir modda elemiyor', () => {
    for (const mod of MOD_SIRASI) expect(elerMi(false, true, mod), mod).toBe(false)
  })
})
