import { describe, expect, it } from 'vitest'
import { SON_VERI_YILI } from './puan'
import { siralamadanPuan, yilSiralamasi } from './siralama'
import {
  EN_COK_SONUC,
  bolumAra,
  bolumBul,
  bolumleriGetir,
  tahminEt,
  tahminiSira,
  universiteAra,
  universiteBul,
  universiteKisaAdi,
} from './hedef-katalog'
import { BOLUMLER } from './veri/bolumler'
import { EN_DUSUK_KADEME, UNIVERSITELER, sadelestir } from './veri/universiteler'

function uni(ad: string) {
  const bulunan = universiteBul(ad)
  if (!bulunan) throw new Error(`${ad} katalogda yok`)
  return bulunan
}

function bolum(ad: string) {
  const bulunan = bolumBul(ad)
  if (!bulunan) throw new Error(`${ad} katalogda yok`)
  return bulunan
}

describe('katalog bütünlüğü', () => {
  it('üniversite kimlikleri tekil', () => {
    const kimlikler = new Set(UNIVERSITELER.map((u) => u.id))
    expect(kimlikler.size).toBe(UNIVERSITELER.length)
  })

  it('bölüm kimlikleri tekil', () => {
    const kimlikler = new Set(BOLUMLER.map((b) => b.id))
    expect(kimlikler.size).toBe(BOLUMLER.length)
  })

  it('üniversite adları tekil — ada göre arama tek kayıt bulmalı', () => {
    const adlar = new Set(UNIVERSITELER.map((u) => sadelestir(u.ad)))
    expect(adlar.size).toBe(UNIVERSITELER.length)
  })

  it('her kademe 1 ile en düşük kademe arasında', () => {
    for (const u of UNIVERSITELER) {
      expect(u.kademe).toBeGreaterThanOrEqual(1)
      expect(u.kademe).toBeLessThanOrEqual(EN_DUSUK_KADEME)
    }
  })

  it('her üniversite en az bir bölüm açıyor', () => {
    // Boş liste, kullanıcıyı seçtiği üniversitede çıkmaz sokağa sokar.
    const bossuz = UNIVERSITELER.filter((u) => bolumleriGetir(u).length === 0)
    expect(bossuz.map((u) => u.ad)).toEqual([])
  })

  it('bölümlerin üst ucu alt ucundan daha iyi', () => {
    for (const b of BOLUMLER) {
      expect(b.ustSira).toBeLessThan(b.altSira)
      expect(b.sonKademe).toBeGreaterThanOrEqual(1)
      expect(b.sonKademe).toBeLessThanOrEqual(EN_DUSUK_KADEME)
    }
  })
})

describe('tahminiSira', () => {
  it('kademe düştükçe sıra kötüleşiyor', () => {
    const tip = bolum('Tıp')
    const siralar = [1, 2, 3, 4, 5].map((k) => tahminiSira(tip, k))
    for (let i = 1; i < siralar.length; i++) {
      expect(siralar[i]).toBeGreaterThan(siralar[i - 1])
    }
  })

  it('uçlar yazılan değerlere yakın', () => {
    const tip = bolum('Tıp')
    // Yuvarlama payı var; katalogdaki uç değerin %10'undan fazla sapmamalı.
    expect(tahminiSira(tip, 1)).toBeCloseTo(tip.ustSira, -2)
    expect(Math.abs(tahminiSira(tip, tip.sonKademe) - tip.altSira)).toBeLessThan(
      tip.altSira * 0.1,
    )
  })

  it('bölümün açılmadığı kademe alt uca sabitleniyor', () => {
    const havacilik = bolum('Havacılık ve Uzay Mühendisliği')
    expect(tahminiSira(havacilik, EN_DUSUK_KADEME)).toBe(
      tahminiSira(havacilik, havacilik.sonKademe),
    )
  })
})

describe('tahminEt', () => {
  it('sıra kötüleştikçe taban puan düşüyor', () => {
    const tip = bolum('Tıp')
    const ust = tahminEt(uni('Hacettepe Üniversitesi'), tip)
    const alt = tahminEt(uni('Van Yüzüncü Yıl Üniversitesi'), tip)
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
  it('fakültesi olmayan bölümü listelemiyor', () => {
    const itu = uni('İstanbul Teknik Üniversitesi')
    expect(bolumleriGetir(itu).some((b) => b.id === 'tip')).toBe(false)
    expect(bolumleriGetir(itu).some((b) => b.id === 'bilgisayar-muh')).toBe(true)
  })

  it('sonKademe altındaki üniversitede bölüm görünmüyor', () => {
    const havacilik = bolum('Havacılık ve Uzay Mühendisliği')
    const alt = UNIVERSITELER.find(
      (u) => u.kademe > havacilik.sonKademe && u.alanlar.includes('muh'),
    )
    expect(alt).toBeDefined()
    expect(bolumleriGetir(alt!).some((b) => b.id === havacilik.id)).toBe(false)
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
    expect(bolumAra(itu, 'bilgisayar')[0].ad).toBe('Bilgisayar Mühendisliği')
  })
})

describe('katalogda bulma', () => {
  it('ada göre üniversite buluyor', () => {
    expect(universiteBul('boğaziçi üniversitesi')?.id).toBe('bogazici-universitesi')
  })

  it('katalog dışı ad null dönüyor — elle yazılmış eski hedefler bozulmasın', () => {
    expect(universiteBul('Rabi Üniversitesi')).toBeNull()
    expect(bolumBul('')).toBeNull()
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
