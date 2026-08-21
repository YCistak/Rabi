import { describe, expect, it } from 'vitest'
import { ESYALAR, KATEGORILER, esyaBul, kategorininEsyalari } from './esyalar'
import {
  BOS_MAGAZA,
  giyiliMi,
  giydir,
  hepsiniCikar,
  kategorideGiyilen,
  koleksiyonOrani,
  magazayiNormalize,
  sahipMi,
  satinAl,
  satinAlinabilirMi,
  type MagazaDurumu,
} from './magaza'

const esya = (id: string) => {
  const bulunan = esyaBul(id)
  if (!bulunan) throw new Error(`katalogda yok: ${id}`)
  return bulunan
}

describe('katalog', () => {
  it('aynı kimlik iki kez geçmiyor', () => {
    expect(new Set(ESYALAR.map((e) => e.id)).size).toBe(ESYALAR.length)
  })

  /*
    Kimlik kategoriyle başlıyor: mağazada da kayıtta da hangi eşyanın nereye
    ait olduğu kimliğe bakarak anlaşılıyor ve çizim dosyaları aynı önekle
    gruplanıyor.
  */
  it('kimlikler kategorisinin önekini taşıyor', () => {
    const onek: Record<string, string> = {
      sapka: 'sapka-',
      gozluk: 'gozluk-',
      ust: 'ust-',
      alt: 'alt-',
      ayakkabi: 'ayak-',
      kurk: 'kurk-',
      sirt: 'sirt-',
    }
    for (const e of ESYALAR) {
      expect(e.id.startsWith(onek[e.kategori]), e.id).toBe(true)
    }
  })

  it('her eşyanın adı ve pozitif fiyatı var', () => {
    for (const e of ESYALAR) {
      expect(e.ad.length, e.id).toBeGreaterThan(2)
      expect(e.fiyat, e.id).toBeGreaterThan(0)
    }
  })

  it('her kategoride en az üç eşya var', () => {
    for (const kategori of KATEGORILER) {
      expect(kategorininEsyalari(kategori).length, kategori).toBeGreaterThanOrEqual(3)
    }
  })

  it('kategori süzgeci yalnızca o kategoriyi veriyor', () => {
    for (const kategori of KATEGORILER) {
      for (const e of kategorininEsyalari(kategori)) expect(e.kategori).toBe(kategori)
    }
  })
})

describe('magazayiNormalize', () => {
  it('bozuk kaydı boş duruma indiriyor', () => {
    expect(magazayiNormalize(undefined)).toEqual(BOS_MAGAZA)
    expect(magazayiNormalize({ sahipOlunan: 'hayır' as never })).toEqual(BOS_MAGAZA)
  })

  /*
    Katalogdan kalkan bir eşyanın kimliği kayıtta kalırsa çizim araması boşa
    düşer ve avatar çizilirken patlar. Süzgeç bu yüzden var.
  */
  it('katalogda olmayan kimliği atıyor', () => {
    const durum = magazayiNormalize({
      sahipOlunan: ['sapka-tac', 'kaldirilmis-esya'],
      giyilen: { sapka: 'kaldirilmis-esya' },
    })
    expect(durum.sahipOlunan).toEqual(['sapka-tac'])
    expect(durum.giyilen.sapka).toBeUndefined()
  })

  it('aynı kimliği iki kez saymıyor', () => {
    const durum = magazayiNormalize({ sahipOlunan: ['sapka-tac', 'sapka-tac'] })
    expect(durum.sahipOlunan).toEqual(['sapka-tac'])
  })

  /*
    `localStorage` elle kurcalanabilir. Sahip olunmadan giyilmiş görünen bir
    kayıt kabul edilseydi mağazayı atlamanın yolu açık kalırdı.
  */
  it('sahip olunmayan eşyayı giyili saymıyor', () => {
    const durum = magazayiNormalize({ sahipOlunan: [], giyilen: { sapka: 'sapka-tac' } })
    expect(durum.giyilen.sapka).toBeUndefined()
  })

  it('eşyayı yanlış kategoriye yazılmış hâlde kabul etmiyor', () => {
    const durum = magazayiNormalize({
      sahipOlunan: ['sapka-tac'],
      giyilen: { gozluk: 'sapka-tac' },
    })
    expect(durum.giyilen.gozluk).toBeUndefined()
  })
})

describe('satın alma', () => {
  it('havuç yetiyorsa alıyor, düşüyor ve giydiriyor', () => {
    const tac = esya('sapka-tac')
    const sonuc = satinAl(BOS_MAGAZA, 500, tac)
    expect(sonuc).not.toBeNull()
    expect(sonuc?.havuc).toBe(500 - tac.fiyat)
    expect(sahipMi(sonuc!.durum, tac)).toBe(true)
    expect(giyiliMi(sonuc!.durum, tac)).toBe(true)
  })

  it('havuç yetmiyorsa satmıyor', () => {
    const tac = esya('sapka-tac')
    expect(satinAlinabilirMi(BOS_MAGAZA, tac.fiyat - 1, tac)).toBe(false)
    expect(satinAl(BOS_MAGAZA, tac.fiyat - 1, tac)).toBeNull()
  })

  it('aynı eşyayı ikinci kez sattırmıyor', () => {
    const tac = esya('sapka-tac')
    const ilk = satinAl(BOS_MAGAZA, 1000, tac)!
    expect(satinAl(ilk.durum, 1000, tac)).toBeNull()
  })

  it('tam fiyatına alınabiliyor', () => {
    const tac = esya('sapka-tac')
    expect(satinAl(BOS_MAGAZA, tac.fiyat, tac)?.havuc).toBe(0)
  })

  it('bakiyeyi eksiye düşürmüyor', () => {
    let durum = BOS_MAGAZA
    let havuc = 300
    for (const e of ESYALAR) {
      const sonuc = satinAl(durum, havuc, e)
      if (!sonuc) continue
      durum = sonuc.durum
      havuc = sonuc.havuc
    }
    expect(havuc).toBeGreaterThanOrEqual(0)
  })
})

describe('giyme', () => {
  const tac = esya('sapka-tac')
  const bere = esya('sapka-bere')
  const sahip: MagazaDurumu = { sahipOlunan: [tac.id, bere.id], giyilen: {} }

  it('sahip olunmayan eşya giyilmiyor', () => {
    expect(giydir(BOS_MAGAZA, tac)).toEqual(BOS_MAGAZA)
  })

  it('ikinci dokunuş çıkarıyor', () => {
    const giyili = giydir(sahip, tac)
    expect(giyiliMi(giyili, tac)).toBe(true)
    expect(giyiliMi(giydir(giyili, tac), tac)).toBe(false)
  })

  /*
    Kategoriden yalnızca bir eşya giyilebiliyor: iki şapka aynı anda takılırsa
    hangisinin üstte çizileceğine karar vermek gerekirdi ve o karar hiçbir
    zaman doğru olmazdı.
  */
  it('aynı kategoriden ikinci eşya öncekinin yerine geçiyor', () => {
    const sonuc = giydir(giydir(sahip, tac), bere)
    expect(giyiliMi(sonuc, bere)).toBe(true)
    expect(giyiliMi(sonuc, tac)).toBe(false)
    expect(kategorideGiyilen(sonuc, 'sapka')?.id).toBe(bere.id)
  })

  it('hepsini çıkarmak sahipliği bozmuyor', () => {
    const giyili = giydir(sahip, tac)
    const cikmis = hepsiniCikar(giyili)
    expect(cikmis.giyilen).toEqual({})
    expect(cikmis.sahipOlunan).toEqual(giyili.sahipOlunan)
  })

  it('koleksiyon oranı sahip olunanı ve katalogu sayıyor', () => {
    expect(koleksiyonOrani(sahip)).toEqual({ sahip: 2, toplam: ESYALAR.length })
  })
})
