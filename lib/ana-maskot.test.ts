import { describe, expect, it } from 'vitest'
import type { GunlukKayit } from './types'
import { anaMaskot, bugunKonuBittiMi, gorevlerBittiMi, type AnaMaskotGirdisi } from './ana-maskot'

const BUGUN = '2026-09-14'
const DUN = '2026-09-13'

function gun(tarih: string, toplam: number): GunlukKayit {
  return { tarih, kayitlar: [{ ders: 'Matematik', toplam, dogru: toplam, yanlis: 0 }] }
}

const temel: AnaMaskotGirdisi = {
  bugun: BUGUN,
  saat: 15,
  hedef: 50,
  gunlukKayitlar: [],
  kalanGun: 200,
  pomodoro: null,
  devamsizlikAsildi: false,
  ozetHazir: false,
  sonDenemeTarihi: null,
  konuBitti: false,
  gorevlerBitti: false,
  bekleyenYanlis: 0,
}

const poz = (g: Partial<AnaMaskotGirdisi>) => anaMaskot({ ...temel, ...g }).poz

describe('anaMaskot', () => {
  it('öğleden sonra hiç kayıt yoksa uyuyor', () => {
    expect(poz({})).toBe('kafa-uyuyan')
  })

  it('gece kayıt yoksa uyuyor, sabah geriniyor', () => {
    expect(poz({ saat: 23 })).toBe('kafa-uyuyan')
    expect(poz({ saat: 3 })).toBe('kafa-uyuyan')
    expect(poz({ saat: 5 })).toBe('kafa-gerinen')
    expect(poz({ saat: 10 })).toBe('kafa-gerinen')
    expect(poz({ saat: 11 })).toBe('kafa-uyuyan')
  })

  it('seri kırılmak üzereyse (dün tuttu, bugün 0) elleri belde bekliyor', () => {
    expect(poz({ gunlukKayitlar: [gun(DUN, 60)] })).toBe('kafa-elleri-belde')
    // Sabah ve gece saat kuralı önde: gün yeni başladı ya da bitti.
    expect(poz({ gunlukKayitlar: [gun(DUN, 60)], saat: 8 })).toBe('kafa-gerinen')
    expect(poz({ gunlukKayitlar: [gun(DUN, 60)], saat: 22 })).toBe('kafa-uyuyan')
    // Dün hedefin altındaysa seri yok.
    expect(poz({ gunlukKayitlar: [gun(DUN, 10)] })).toBe('kafa-uyuyan')
  })

  it('bugün başlandıysa ama hedefe ulaşılmadıysa çalışıyor', () => {
    expect(['kafa-yazan', 'kafa-kitapli']).toContain(poz({ gunlukKayitlar: [gun(BUGUN, 10)] }))
    // Gece de olsa kayıt varsa uyumuyor.
    expect(poz({ gunlukKayitlar: [gun(BUGUN, 10)], saat: 23 })).not.toBe('kafa-uyuyan')
  })

  it('hedef tuttuysa kutluyor', () => {
    const m = anaMaskot({ ...temel, gunlukKayitlar: [gun(BUGUN, 50)] })
    expect(['kafa-dans', 'kafa-alkislayan', 'kafa-kahkaha']).toContain(m.poz)
    expect(m.durum).toBe('kutlama')
  })

  it('hedef sıfırken "tuttu" yok, kayıt varsa çalışıyor', () => {
    expect(['kafa-yazan', 'kafa-kitapli']).toContain(
      poz({ hedef: 0, gunlukKayitlar: [gun(BUGUN, 500)] }),
    )
    expect(poz({ hedef: 0, gunlukKayitlar: [gun(DUN, 500)] })).toBe('kafa-uyuyan')
  })

  it('pomodoro her şeyin önünde', () => {
    expect(poz({ pomodoro: 'calisma', gunlukKayitlar: [gun(BUGUN, 80)] })).toBe('kafa-laptoplu')
    expect(poz({ pomodoro: 'mola', saat: 23 })).toBe('kafa-kahveli')
    expect(poz({ pomodoro: 'calisma', devamsizlikAsildi: true })).toBe('kafa-laptoplu')
  })

  it('devamsızlık aşıldıysa üzgün, sınav günü sakin', () => {
    expect(poz({ devamsizlikAsildi: true, gunlukKayitlar: [gun(BUGUN, 80)] })).toBe('kafa-uzgun')
    expect(poz({ kalanGun: 0, gunlukKayitlar: [gun(BUGUN, 80)] })).toBe('kafa-bagdas')
  })

  it('dönüşümlü poz gün içinde sabit, günden güne değişiyor', () => {
    const kayit = (tarih: string) => [gun(tarih, 50)]
    const bir = anaMaskot({ ...temel, bugun: BUGUN, gunlukKayitlar: kayit(BUGUN) })
    const ayni = anaMaskot({ ...temel, bugun: BUGUN, saat: 9, gunlukKayitlar: kayit(BUGUN) })
    expect(ayni.poz).toBe(bir.poz)
    const gunler = ['2026-09-14', '2026-09-15', '2026-09-16'].map(
      (t) => anaMaskot({ ...temel, bugun: t, gunlukKayitlar: kayit(t) }).poz,
    )
    expect(new Set(gunler).size).toBe(3)
  })

  it('ay özeti bekliyorsa megafonla duyuruyor; pomodoro ve sınav günü önde', () => {
    expect(poz({ ozetHazir: true, gunlukKayitlar: [gun(BUGUN, 80)] })).toBe('kafa-megafonlu')
    expect(poz({ ozetHazir: true, pomodoro: 'calisma' })).toBe('kafa-laptoplu')
    expect(poz({ ozetHazir: true, kalanGun: 0 })).toBe('kafa-bagdas')
  })

  it('bugün deneme girildiyse damga, konu bittiyse tahta; ikisi de hedef kutlamasının önünde', () => {
    expect(poz({ sonDenemeTarihi: BUGUN })).toBe('kafa-damgali')
    expect(poz({ sonDenemeTarihi: DUN })).toBe('kafa-uyuyan')
    expect(poz({ konuBitti: true, gunlukKayitlar: [gun(BUGUN, 80)] })).toBe('kafa-tahtali')
    expect(poz({ sonDenemeTarihi: BUGUN, konuBitti: true })).toBe('kafa-damgali')
  })

  it('görevler bittiyse çanta; hedef tuttuysa kutlama önde', () => {
    expect(poz({ gorevlerBitti: true })).toBe('kafa-cantali')
    expect(poz({ gorevlerBitti: true, gunlukKayitlar: [gun(BUGUN, 10)] })).toBe('kafa-cantali')
    expect(poz({ gorevlerBitti: true, gunlukKayitlar: [gun(BUGUN, 60)] })).not.toBe('kafa-cantali')
  })

  it('üç gün ve daha uzun aradan sonra ilk kayıtta selamlıyor', () => {
    const bugun = [gun(BUGUN, 10)]
    // 2026-09-10 ile 14 arasında 3 boş gün (11, 12, 13).
    expect(poz({ gunlukKayitlar: [gun('2026-09-10', 20), ...bugun] })).toBe('kafa-selamlayan')
    // 2 boş gün yetmiyor.
    expect(poz({ gunlukKayitlar: [gun('2026-09-11', 20), ...bugun] })).not.toBe('kafa-selamlayan')
    // Eski kaydı hiç olmayan yeni kullanıcı geri dönmüş sayılmıyor.
    expect(poz({ gunlukKayitlar: bugun })).not.toBe('kafa-selamlayan')
    // Bugün hedef tuttuysa kutlama önde.
    expect(poz({ gunlukKayitlar: [gun('2026-09-01', 20), gun(BUGUN, 60)] })).not.toBe('kafa-selamlayan')
  })

  it('hafta sonu sabahı bitki suluyor', () => {
    expect(poz({ bugun: '2026-09-12', saat: 9 })).toBe('kafa-bitkili')
    expect(poz({ bugun: '2026-09-13', saat: 9 })).toBe('kafa-bitkili')
    expect(poz({ bugun: BUGUN, saat: 9 })).toBe('kafa-gerinen')
  })

  it('kayıtsız günde: seri > yanlış birikti > sınav yakın > akşam', () => {
    expect(poz({ bekleyenYanlis: 10 })).toBe('kafa-buyutecli')
    expect(poz({ bekleyenYanlis: 9 })).toBe('kafa-uyuyan')
    expect(poz({ bekleyenYanlis: 10, gunlukKayitlar: [gun(DUN, 60)] })).toBe('kafa-elleri-belde')
    expect(poz({ kalanGun: 30 })).toBe('kafa-saatli')
    expect(poz({ kalanGun: 31 })).toBe('kafa-uyuyan')
    expect(poz({ kalanGun: 20, bekleyenYanlis: 12 })).toBe('kafa-buyutecli')
    expect(poz({ saat: 18 })).toBe('kafa-dusunen')
    expect(poz({ saat: 21 })).toBe('kafa-dusunen')
    expect(poz({ saat: 17 })).toBe('kafa-uyuyan')
    expect(poz({ saat: 19, kalanGun: 10 })).toBe('kafa-saatli')
    // Kayıt varsa hatırlatma yok.
    expect(poz({ bekleyenYanlis: 50, gunlukKayitlar: [gun(BUGUN, 10)] })).not.toBe('kafa-buyutecli')
  })

  it('bugunKonuBittiMi ve gorevlerBittiMi', () => {
    expect(bugunKonuBittiMi({ a: { bitisTarihi: DUN }, b: { bitisTarihi: BUGUN } }, BUGUN)).toBe(true)
    expect(bugunKonuBittiMi({ a: { bitisTarihi: DUN }, b: {} }, BUGUN)).toBe(false)
    expect(gorevlerBittiMi([], BUGUN)).toBe(false)
    expect(gorevlerBittiMi([{ gun: BUGUN, bitti: true }, { gun: DUN, bitti: false }], BUGUN)).toBe(true)
    expect(gorevlerBittiMi([{ gun: BUGUN, bitti: true }, { gun: BUGUN, bitti: false }], BUGUN)).toBe(false)
  })

  it('her durumun Türkçe bir ekran okuyucu etiketi var', () => {
    const girdiler: Partial<AnaMaskotGirdisi>[] = [
      {},
      { saat: 7 },
      { gunlukKayitlar: [gun(DUN, 60)] },
      { gunlukKayitlar: [gun(BUGUN, 10)] },
      { gunlukKayitlar: [gun(BUGUN, 60)] },
      { pomodoro: 'calisma' },
      { pomodoro: 'mola' },
      { devamsizlikAsildi: true },
      { kalanGun: 0 },
      { ozetHazir: true },
      { sonDenemeTarihi: BUGUN },
      { konuBitti: true },
      { gorevlerBitti: true },
      { gunlukKayitlar: [gun('2026-09-01', 20), gun(BUGUN, 10)] },
      { bugun: '2026-09-12', saat: 9 },
      { bekleyenYanlis: 10 },
      { kalanGun: 20 },
      { saat: 19 },
    ]
    for (const g of girdiler) expect(anaMaskot({ ...temel, ...g }).etiket.length).toBeGreaterThan(3)
  })
})
