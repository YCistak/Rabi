import { describe, expect, it } from 'vitest'
import { SON_VERI_YILI } from './puan'
import { siralamadanPuan, yilSiralamasi } from './siralama'
import {
  EN_COK_SONUC,
  bolumAra,
  bolumBul,
  bolumleriGetir,
  tahminEt,
  universiteAra,
  universiteBul,
  universiteKisaAdi,
} from './hedef-katalog'
import { UNIVERSITELER, sadelestir } from './veri/katalog'

function uni(ad: string) {
  const bulunan = universiteBul(ad)
  if (!bulunan) throw new Error(`${ad} katalogda yok`)
  return bulunan
}

function bolum(universiteAdi: string, bolumAdi: string) {
  const bulunan = bolumBul(uni(universiteAdi), bolumAdi)
  if (!bulunan) throw new Error(`${universiteAdi} / ${bolumAdi} katalogda yok`)
  return bulunan
}

describe('katalog bütünlüğü', () => {
  it('üniversite kimlikleri tekil', () => {
    const kimlikler = new Set(UNIVERSITELER.map((u) => u.id))
    expect(kimlikler.size).toBe(UNIVERSITELER.length)
  })

  it('üniversite adları tekil — ada göre arama tek kayıt bulmalı', () => {
    const adlar = new Set(UNIVERSITELER.map((u) => sadelestir(u.ad)))
    expect(adlar.size).toBe(UNIVERSITELER.length)
  })

  it('her üniversite en az bir bölüm açıyor', () => {
    // Boş liste, kullanıcıyı seçtiği üniversitede çıkmaz sokağa sokar.
    const bossuz = UNIVERSITELER.filter((u) => bolumleriGetir(u).length === 0)
    expect(bossuz.map((u) => u.ad)).toEqual([])
  })

  it('bölüm kimlikleri kendi üniversitesi içinde tekil', () => {
    // `bolumBul` ada bakıyor; aynı üniversitede aynı ad iki kez geçerse
    // kullanıcının seçtiğinden başka bir programın sırası kaydedilirdi.
    for (const u of UNIVERSITELER) {
      const bolumler = bolumleriGetir(u)
      const kimlikler = new Set(bolumler.map((b) => b.id))
      expect({ ad: u.ad, adet: kimlikler.size }).toEqual({
        ad: u.ad,
        adet: bolumler.length,
      })
    }
  })

  it('her programın sırası ve süresi makul aralıkta', () => {
    for (const u of UNIVERSITELER) {
      for (const b of bolumleriGetir(u)) {
        expect(b.basariSirasi).toBeGreaterThan(0)
        expect(b.basariSirasi).toBeLessThan(3_000_000)
        expect(b.sure).toBeGreaterThanOrEqual(4)
        expect(b.sure).toBeLessThanOrEqual(6)
        expect(['say', 'ea', 'soz', 'dil']).toContain(b.puanTuru)
      }
    }
  })

  it('programlar başarı sırasına göre sıralı — en iyi önde', () => {
    for (const u of UNIVERSITELER) {
      const siralar = bolumleriGetir(u).map((b) => b.basariSirasi)
      expect(siralar).toEqual([...siralar].sort((a, b) => a - b))
    }
  })
})

describe('tahminEt', () => {
  it('sırayı katalogdan olduğu gibi veriyor', () => {
    const tip = bolum('Hacettepe Üniversitesi', 'Tıp')
    expect(tahminEt(uni('Hacettepe Üniversitesi'), tip).siralama).toBe(tip.basariSirasi)
  })

  it('aynı bölümde sıra kötüleştikçe taban puan düşüyor', () => {
    const ust = tahminEt(
      uni('Hacettepe Üniversitesi'),
      bolum('Hacettepe Üniversitesi', 'Tıp'),
    )
    const alt = tahminEt(
      uni('Van Yüzüncü Yıl Üniversitesi'),
      bolum('Van Yüzüncü Yıl Üniversitesi', 'Tıp'),
    )
    expect(ust.siralama).toBeLessThan(alt.siralama)
    expect(ust.tabanPuan).toBeGreaterThan(alt.tabanPuan)
  })

  it('taban puan ÖSYM ölçeğinin içinde kalıyor', () => {
    for (const u of UNIVERSITELER) {
      for (const b of bolumleriGetir(u)) {
        const { tabanPuan } = tahminEt(u, b)
        expect(tabanPuan).toBeGreaterThan(100)
        expect(tabanPuan).toBeLessThanOrEqual(560)
      }
    }
  })
})

describe('siralamadanPuan', () => {
  it('yilSiralamasi ile birbirinin tersi', () => {
    // Gidip gelen çevrim başladığı puana dönmeli; iki yönde farklı iç değer
    // kullanılsaydı katalogun taban puanı sıralamayla tutmazdı.
    for (const puan of [320, 400, 460, 500]) {
      const sira = yilSiralamasi(puan, 'say', SON_VERI_YILI).siralama
      const geri = siralamadanPuan(sira, 'say', SON_VERI_YILI)
      expect(geri.puan).toBeCloseTo(puan, 0)
      expect(geri.tabloDisi).toBe(false)
    }
  })

  it('tablonun dışındaki sıra işaretleniyor', () => {
    expect(siralamadanPuan(9_000_000, 'say', SON_VERI_YILI).tabloDisi).toBe(true)
    expect(siralamadanPuan(1, 'soz', SON_VERI_YILI).tabloDisi).toBe(true)
  })
})

describe('bolumleriGetir', () => {
  it('üniversitede gerçekten açık olmayan bölümü listelemiyor', () => {
    // Kademe modeli döneminde bu süzgeç elle yazılmış fakülte gruplarına
    // bakıyordu; artık listenin kendisi gerçek programlardan geliyor.
    const itu = uni('İstanbul Teknik Üniversitesi')
    expect(bolumleriGetir(itu).some((b) => b.ad.startsWith('Tıp'))).toBe(false)
    expect(bolumleriGetir(itu).some((b) => b.ad.startsWith('Bilgisayar Mühendisliği'))).toBe(
      true,
    )
  })
})

describe('arama', () => {
  it('Türkçe harf yazmadan bulunuyor', () => {
    expect(universiteAra('bogazici')[0].ad).toBe('Boğaziçi Üniversitesi')
    expect(universiteAra('YILDIZ')[0].ad).toBe('Yıldız Teknik Üniversitesi')
  })

  it('şehirle de bulunuyor', () => {
    expect(universiteAra('Diyarbakır').map((u) => u.ad)).toContain('Dicle Üniversitesi')
  })

  it('baştan eşleşen önce geliyor', () => {
    const sonuc = universiteAra('ankara')
    expect(sonuc[0].ad.startsWith('Ankara')).toBe(true)
  })

  it('boş sorgu listenin başını veriyor — kutu açılır açılmaz seçenek görünsün', () => {
    expect(universiteAra('').length).toBe(EN_COK_SONUC)
  })

  it('bölüm araması üniversitenin dışına çıkmıyor', () => {
    const itu = uni('İstanbul Teknik Üniversitesi')
    expect(bolumAra(itu, 'tıp')).toEqual([])
    expect(bolumAra(itu, 'bilgisayar')[0].ad).toContain('Bilgisayar Mühendisliği')
  })
})

describe('katalogda bulma', () => {
  it('ada göre üniversite buluyor', () => {
    expect(universiteBul('boğaziçi üniversitesi')?.id).toBe('bogazici-universitesi')
  })

  it('katalog dışı ad null dönüyor — elle yazılmış eski hedefler bozulmasın', () => {
    expect(universiteBul('Rabi Üniversitesi')).toBeNull()
    expect(bolumBul(uni('Boğaziçi Üniversitesi'), '')).toBeNull()
    expect(bolumBul(null, 'Tıp')).toBeNull()
  })
})

describe('universiteKisaAdi', () => {
  it('çok kelimeli adı baş harflere indiriyor', () => {
    expect(universiteKisaAdi('Orta Doğu Teknik Üniversitesi')).toBe('ODTÜ')
    expect(universiteKisaAdi('İstanbul Teknik Üniversitesi')).toBe('İTÜ')
    expect(universiteKisaAdi('Yıldız Teknik Üniversitesi')).toBe('YTÜ')
    expect(universiteKisaAdi('Doğu Akdeniz Üniversitesi')).toBe('DAÜ')
  })

  it('tek kelimeli adı olduğu gibi bırakıyor', () => {
    // "Boğaziçi Üniversitesi" → "BÜ" adı tanınmaz hâle getirirdi.
    expect(universiteKisaAdi('Boğaziçi Üniversitesi')).toBe('Boğaziçi')
    expect(universiteKisaAdi('Hacettepe Üniversitesi')).toBe('Hacettepe')
  })

  it('katalogdaki her ad boş olmayan bir kısaltma veriyor', () => {
    for (const u of UNIVERSITELER) {
      expect(universiteKisaAdi(u.ad).length).toBeGreaterThan(0)
      expect(universiteKisaAdi(u.ad).length).toBeLessThanOrEqual(u.ad.length)
    }
  })
})
