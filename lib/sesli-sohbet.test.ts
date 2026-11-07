import { describe, expect, it } from 'vitest'
import { HAZIR_SABLONLAR, secilebilirSablonlar } from './sablonlar'
import { sesliMetniCoz, type SesliCozum } from './sesli-giris'
import {
  ACILIS_SORUSU,
  birikimeEkle,
  BOS_BIRIKIM,
  rabiCevabi,
  type SohbetBirikimi,
} from './sesli-sohbet'
import type { Sablon } from './types'

const SECENEK_SABLONLAR: Sablon[] = secilebilirSablonlar(HAZIR_SABLONLAR, 12, null)

describe('Sabitler', () => {
  it('BOS_BIRIKIM başlangıç durumu boş sorular ve null deneme içermelidir', () => {
    expect(BOS_BIRIKIM).toEqual({
      sorular: [],
      deneme: null,
    })
  })

  it('ACILIS_SORUSU beklenen karşılama metnini içermelidir', () => {
    expect(ACILIS_SORUSU).toBe('Bugün ne çözdün?')
  })
})

describe('birikimeEkle', () => {
  it('aynı ders tekrar geldiğinde toplam, doğru ve yanlış sayıları toplanır', () => {
    const baslangic: SohbetBirikimi = {
      sorular: [{ ders: 'Matematik', toplam: 40, dogru: 32, yanlis: 8 }],
      deneme: null,
    }

    const cozum: SesliCozum = {
      sorular: [{ ders: 'Matematik', toplam: 20, dogru: 18, yanlis: 2 }],
      deneme: null,
      anlasilmayan: [],
    }

    const sonuc = birikimeEkle(baslangic, cozum)

    expect(sonuc.sorular).toEqual([
      { ders: 'Matematik', toplam: 60, dogru: 50, yanlis: 10 },
    ])
  })

  it('yeni ders eklendiğinde sona eklenir ve önceki derslerin sırası korunur', () => {
    const baslangic: SohbetBirikimi = {
      sorular: [
        { ders: 'Türkçe', toplam: 40, dogru: 0, yanlis: 0 },
        { ders: 'Kimya', toplam: 30, dogru: 0, yanlis: 0 },
      ],
      deneme: null,
    }

    const cozum: SesliCozum = {
      sorular: [
        { ders: 'Matematik', toplam: 50, dogru: 0, yanlis: 0 },
        { ders: 'Fizik', toplam: 25, dogru: 0, yanlis: 0 },
      ],
      deneme: null,
      anlasilmayan: [],
    }

    const sonuc = birikimeEkle(baslangic, cozum)

    expect(sonuc.sorular).toEqual([
      { ders: 'Türkçe', toplam: 40, dogru: 0, yanlis: 0 },
      { ders: 'Kimya', toplam: 30, dogru: 0, yanlis: 0 },
      { ders: 'Matematik', toplam: 50, dogru: 0, yanlis: 0 },
      { ders: 'Fizik', toplam: 25, dogru: 0, yanlis: 0 },
    ])
  })

  it('girdi nesnelerini ve alt dizilerini mutasyona uğratmaz (saf fonksiyon)', () => {
    const baslangic: SohbetBirikimi = {
      sorular: [{ ders: 'Matematik', toplam: 40, dogru: 30, yanlis: 10 }],
      deneme: {
        sablonId: 'tyt',
        dersler: [{ dersId: 'turkce', dogru: 30, yanlis: 5 }],
        toplamNet: 80,
      },
    }

    const cozum: SesliCozum = {
      sorular: [{ ders: 'Matematik', toplam: 20, dogru: 15, yanlis: 5 }],
      deneme: {
        sablonId: 'tyt',
        dersler: [{ dersId: 'matematik', dogru: 25, yanlis: 4 }],
        toplamNet: 85,
      },
      anlasilmayan: ['anlasilmayan parca'],
    }

    const baslangicKopya = JSON.parse(JSON.stringify(baslangic))
    const cozumKopya = JSON.parse(JSON.stringify(cozum))

    const sonuc = birikimeEkle(baslangic, cozum)

    expect(baslangic).toEqual(baslangicKopya)
    expect(cozum).toEqual(cozumKopya)
    expect(sonuc).not.toBe(baslangic)
    expect(sonuc.sorular).not.toBe(baslangic.sorular)
    expect(sonuc.deneme).not.toBe(baslangic.deneme)
  })

  it('deneme birikimde yoksa yenisi alınır', () => {
    const baslangic: SohbetBirikimi = {
      sorular: [],
      deneme: null,
    }

    const cozum: SesliCozum = {
      sorular: [],
      deneme: {
        sablonId: 'tyt',
        dersler: [{ dersId: 'turkce', dogru: 35, yanlis: 4 }],
        toplamNet: 85.5,
      },
      anlasilmayan: [],
    }

    const sonuc = birikimeEkle(baslangic, cozum)

    expect(sonuc.deneme).toEqual({
      sablonId: 'tyt',
      dersler: [{ dersId: 'turkce', dogru: 35, yanlis: 4 }],
      toplamNet: 85.5,
    })
  })

  it('deneme aynı şablonda ise aynı ders düzeltilir, yeni ders sona eklenir', () => {
    const baslangic: SohbetBirikimi = {
      sorular: [],
      deneme: {
        sablonId: 'tyt',
        dersler: [
          { dersId: 'turkce', dogru: 30, yanlis: 5 },
          { dersId: 'matematik', dogru: 25, yanlis: 3 },
        ],
        toplamNet: null,
      },
    }

    const cozum: SesliCozum = {
      sorular: [],
      deneme: {
        sablonId: 'tyt',
        dersler: [
          { dersId: 'turkce', dogru: 34, yanlis: 4 },
          { dersId: 'fizik', dogru: 6, yanlis: 1 },
        ],
        toplamNet: 90,
      },
      anlasilmayan: [],
    }

    const sonuc = birikimeEkle(baslangic, cozum)

    expect(sonuc.deneme).toEqual({
      sablonId: 'tyt',
      dersler: [
        { dersId: 'turkce', dogru: 34, yanlis: 4 },
        { dersId: 'matematik', dogru: 25, yanlis: 3 },
        { dersId: 'fizik', dogru: 6, yanlis: 1 },
      ],
      toplamNet: 90,
    })
  })

  it('deneme aynı şablonda yeni toplamNet null ise eskisini korur, null değilse yenisini alır', () => {
    const baslangicNetli: SohbetBirikimi = {
      sorular: [],
      deneme: {
        sablonId: 'tyt',
        dersler: [],
        toplamNet: 80,
      },
    }

    const netDegismeyenCozum: SesliCozum = {
      sorular: [],
      deneme: {
        sablonId: 'tyt',
        dersler: [{ dersId: 'turkce', dogru: 35, yanlis: 3 }],
        toplamNet: null,
      },
      anlasilmayan: [],
    }

    const sonuc1 = birikimeEkle(baslangicNetli, netDegismeyenCozum)
    expect(sonuc1.deneme?.toplamNet).toBe(80)

    const netGuncelleyenCozum: SesliCozum = {
      sorular: [],
      deneme: {
        sablonId: 'tyt',
        dersler: [],
        toplamNet: 88.5,
      },
      anlasilmayan: [],
    }

    const sonuc2 = birikimeEkle(sonuc1, netGuncelleyenCozum)
    expect(sonuc2.deneme?.toplamNet).toBe(88.5)
  })

  it('farklı sablonId gelirse yeni deneme eskisinin tamamen yerine geçer', () => {
    const baslangic: SohbetBirikimi = {
      sorular: [],
      deneme: {
        sablonId: 'tyt',
        dersler: [{ dersId: 'turkce', dogru: 30, yanlis: 5 }],
        toplamNet: 80,
      },
    }

    const cozumAyt: SesliCozum = {
      sorular: [],
      deneme: {
        sablonId: 'ayt-say',
        dersler: [{ dersId: 'matematik', dogru: 35, yanlis: 3 }],
        toplamNet: 65,
      },
      anlasilmayan: [],
    }

    const sonuc = birikimeEkle(baslangic, cozumAyt)

    expect(sonuc.deneme).toEqual({
      sablonId: 'ayt-say',
      dersler: [{ dersId: 'matematik', dogru: 35, yanlis: 3 }],
      toplamNet: 65,
    })
  })

  it('çözümde deneme null ise mevcut deneme korunur', () => {
    const baslangic: SohbetBirikimi = {
      sorular: [],
      deneme: {
        sablonId: 'tyt',
        dersler: [{ dersId: 'turkce', dogru: 32, yanlis: 6 }],
        toplamNet: null,
      },
    }

    const cozum: SesliCozum = {
      sorular: [{ ders: 'Kimya', toplam: 30, dogru: 0, yanlis: 0 }],
      deneme: null,
      anlasilmayan: [],
    }

    const sonuc = birikimeEkle(baslangic, cozum)

    expect(sonuc.deneme).toEqual({
      sablonId: 'tyt',
      dersler: [{ dersId: 'turkce', dogru: 32, yanlis: 6 }],
      toplamNet: null,
    })
    expect(sonuc.sorular).toEqual([
      { ders: 'Kimya', toplam: 30, dogru: 0, yanlis: 0 },
    ])
  })

  it('anlasilmayan parçalar birikime girmez', () => {
    const baslangic = BOS_BIRIKIM
    const cozum: SesliCozum = {
      sorular: [{ ders: 'Matematik', toplam: 40, dogru: 0, yanlis: 0 }],
      deneme: null,
      anlasilmayan: ['fizik 15 soru', 'gece cozulenler'],
    }

    const sonuc = birikimeEkle(baslangic, cozum)

    expect(sonuc).toEqual({
      sorular: [{ ders: 'Matematik', toplam: 40, dogru: 0, yanlis: 0 }],
      deneme: null,
    })
    expect((sonuc as Record<string, unknown>).anlasilmayan).toBeUndefined()
  })
})

describe('rabiCevabi', () => {
  it('tek ders doğru/yanlış yokken virgüllü özet üretir', () => {
    const cozum: SesliCozum = {
      sorular: [{ ders: 'Matematik', toplam: 80, dogru: 0, yanlis: 0 }],
      deneme: null,
      anlasilmayan: [],
    }

    const cevap = rabiCevabi(cozum, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
    })

    expect(cevap).toEqual(['Matematik 80 soru, not aldım.', 'Başka?'])
  })

  it('tek ders doğru/yanlış varken ayrıntılı özet üretir', () => {
    const cozum: SesliCozum = {
      sorular: [{ ders: 'Matematik', toplam: 40, dogru: 32, yanlis: 8 }],
      deneme: null,
      anlasilmayan: [],
    }

    const cevap = rabiCevabi(cozum, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 1,
    })

    expect(cevap).toEqual([
      'Matematik 40 soru, 32 doğru 8 yanlış. Not aldım.',
      'Başka ne çözdün?',
    ])
  })

  it('birden çok ders (2-4 ders) özetini ders ve soru sayılarıyla birleştirir', () => {
    const ikiDers: SesliCozum = {
      sorular: [
        { ders: 'Matematik', toplam: 80, dogru: 0, yanlis: 0 },
        { ders: 'Kimya', toplam: 65, dogru: 0, yanlis: 0 },
      ],
      deneme: null,
      anlasilmayan: [],
    }

    expect(
      rabiCevabi(ikiDers, { sablonlar: SECENEK_SABLONLAR, mesajSirasi: 2 }),
    ).toEqual([
      'Matematik 80, Kimya 65 soru. Not aldım.',
      'Eklemek istediğin başka bir şey var mı?',
    ])

    const dortDers: SesliCozum = {
      sorular: [
        { ders: 'Matematik', toplam: 40, dogru: 0, yanlis: 0 },
        { ders: 'Fizik', toplam: 30, dogru: 0, yanlis: 0 },
        { ders: 'Kimya', toplam: 25, dogru: 0, yanlis: 0 },
        { ders: 'Biyoloji', toplam: 20, dogru: 0, yanlis: 0 },
      ],
      deneme: null,
      anlasilmayan: [],
    }

    expect(
      rabiCevabi(dortDers, { sablonlar: SECENEK_SABLONLAR, mesajSirasi: 0 }),
    ).toEqual([
      'Matematik 40, Fizik 30, Kimya 25, Biyoloji 20 soru. Not aldım.',
      'Başka?',
    ])
  })

  it('çok ders (5 ders) için en çok 4 dersi sayıp "ve 1 ders daha" ekler', () => {
    const besDers: SesliCozum = {
      sorular: [
        { ders: 'Matematik', toplam: 40, dogru: 0, yanlis: 0 },
        { ders: 'Kimya', toplam: 30, dogru: 0, yanlis: 0 },
        { ders: 'Fizik', toplam: 20, dogru: 0, yanlis: 0 },
        { ders: 'Biyoloji', toplam: 15, dogru: 0, yanlis: 0 },
        { ders: 'Türkçe', toplam: 25, dogru: 0, yanlis: 0 },
      ],
      deneme: null,
      anlasilmayan: [],
    }

    const cevap = rabiCevabi(besDers, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 3,
    })

    expect(cevap).toEqual([
      'Matematik 40, Kimya 30, Fizik 20, Biyoloji 15 soru ve 1 ders daha. Not aldım.',
      'Başka?',
    ])
  })

  it('çok ders (6 ders) için "ve 2 ders daha" ekler', () => {
    const altiDers: SesliCozum = {
      sorular: [
        { ders: 'Matematik', toplam: 40, dogru: 0, yanlis: 0 },
        { ders: 'Kimya', toplam: 30, dogru: 0, yanlis: 0 },
        { ders: 'Fizik', toplam: 20, dogru: 0, yanlis: 0 },
        { ders: 'Biyoloji', toplam: 15, dogru: 0, yanlis: 0 },
        { ders: 'Türkçe', toplam: 25, dogru: 0, yanlis: 0 },
        { ders: 'Tarih', toplam: 10, dogru: 0, yanlis: 0 },
      ],
      deneme: null,
      anlasilmayan: [],
    }

    const cevap = rabiCevabi(altiDers, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
    })

    expect(cevap).toEqual([
      'Matematik 40, Kimya 30, Fizik 20, Biyoloji 15 soru ve 2 ders daha. Not aldım.',
      'Başka?',
    ])
  })

  it('deneme anlaşıldığında şablon ve ders adlarını gerçek adlarla yazar', () => {
    const cozum: SesliCozum = {
      sorular: [],
      deneme: {
        sablonId: 'tyt',
        dersler: [
          { dersId: 'turkce', dogru: 33, yanlis: 4 },
          { dersId: 'matematik', dogru: 29, yanlis: 6 },
        ],
        toplamNet: null,
      },
      anlasilmayan: [],
    }

    const cevap = rabiCevabi(cozum, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
    })

    expect(cevap).toEqual([
      'TYT denemesi: Türkçe 33 doğru 4 yanlış, Temel Matematik 29 doğru 6 yanlış.',
      'Başka?',
    ])
  })

  it('deneme şablonunda veya listesinde bulunamayan ders/şablon kimliğini korur', () => {
    const cozum: SesliCozum = {
      sorular: [],
      deneme: {
        sablonId: 'bilinmeyen-sablon',
        dersler: [{ dersId: 'bilinmeyen-ders', dogru: 10, yanlis: 2 }],
        toplamNet: null,
      },
      anlasilmayan: [],
    }

    const cevap = rabiCevabi(cozum, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
    })

    expect(cevap).toEqual([
      'bilinmeyen-sablon denemesi: bilinmeyen-ders 10 doğru 2 yanlış.',
      'Başka?',
    ])
  })

  it('denemede yalnız toplam net söylendiyse ondalık virgülle özetler', () => {
    const bucukluNet: SesliCozum = {
      sorular: [],
      deneme: {
        sablonId: 'tyt',
        dersler: [],
        toplamNet: 85.5,
      },
      anlasilmayan: [],
    }

    expect(
      rabiCevabi(bucukluNet, {
        sablonlar: SECENEK_SABLONLAR,
        mesajSirasi: 0,
      }),
    ).toEqual(['TYT denemesi, toplam 85,5 net.', 'Başka?'])

    const tamNet: SesliCozum = {
      sorular: [],
      deneme: {
        sablonId: 'tyt',
        dersler: [],
        toplamNet: 90,
      },
      anlasilmayan: [],
    }

    expect(
      rabiCevabi(tamNet, {
        sablonlar: SECENEK_SABLONLAR,
        mesajSirasi: 0,
      }),
    ).toEqual(['TYT denemesi, toplam 90 net.', 'Başka?'])
  })

  it('anlaşılmayan parça ile anlaşılan ders birlikte geldiğinde uyarıyı özetin sonuna ekler', () => {
    const cozum: SesliCozum = {
      sorular: [{ ders: 'Matematik', toplam: 80, dogru: 0, yanlis: 0 }],
      deneme: null,
      anlasilmayan: ['sosyal 15 doğru'],
    }

    const cevap = rabiCevabi(cozum, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
    })

    expect(cevap).toEqual([
      'Matematik 80 soru, not aldım. “sosyal 15 doğru” kısmını anlayamadım.',
      'Başka?',
    ])
  })

  it('anlaşılmayan parça 40 karakterden uzunsa 40 karaktere kısaltıp … ekler', () => {
    const uzunParca = 'kimyadan çözdüğüm soruların ikinci testi çok zordu'
    expect(uzunParca.length).toBeGreaterThan(40)

    const cozum: SesliCozum = {
      sorular: [{ ders: 'Matematik', toplam: 40, dogru: 0, yanlis: 0 }],
      deneme: null,
      anlasilmayan: [uzunParca],
    }

    const cevap = rabiCevabi(cozum, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
    })

    const beklenenKirpma = `${uzunParca.slice(0, 40)}…`
    expect(cevap).toEqual([
      `Matematik 40 soru, not aldım. “${beklenenKirpma}” kısmını anlayamadım.`,
      'Başka?',
    ])
  })

  it('hiçbir şey anlaşılmadığında tek balon ve örnekli yönlendirme döner', () => {
    const cozum: SesliCozum = {
      sorular: [],
      deneme: null,
      anlasilmayan: [],
    }

    const cevap = rabiCevabi(cozum, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
    })

    expect(cevap).toEqual([
      'Bunu anlayamadım. Mesela “80 matematik” ya da “TYT Türkçe 33 doğru 4 yanlış” diyebilirsin.',
    ])
  })

  it('yalnızca anlaşılmayan parça olduğunda tek balon olarak uyarı döner', () => {
    const cozum: SesliCozum = {
      sorular: [],
      deneme: null,
      anlasilmayan: ['otuz beş sosyoloji'],
    }

    const cevap = rabiCevabi(cozum, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
    })

    expect(cevap).toEqual(['“otuz beş sosyoloji” kısmını anlayamadım.'])
  })

  it('hedefeKalan verildiğinde toplam soru hedefe eşit veya büyükse kutlama cümlesi ekler', () => {
    const cozum: SesliCozum = {
      sorular: [{ ders: 'Matematik', toplam: 80, dogru: 0, yanlis: 0 }],
      deneme: null,
      anlasilmayan: [],
    }

    const cevap = rabiCevabi(cozum, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
      hedefeKalan: 50,
    })

    expect(cevap).toEqual([
      'Matematik 80 soru, not aldım. Bugünkü hedefin tamam!',
      'Başka?',
    ])
  })

  it('hedefeKalan henüz sağlanmadıysa veya 0/negatif ise kutlama cümlesi eklemez', () => {
    const cozum: SesliCozum = {
      sorular: [{ ders: 'Matematik', toplam: 40, dogru: 0, yanlis: 0 }],
      deneme: null,
      anlasilmayan: [],
    }

    const cevapYetmeyen = rabiCevabi(cozum, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
      hedefeKalan: 50,
    })
    expect(cevapYetmeyen).toEqual(['Matematik 40 soru, not aldım.', 'Başka?'])

    const cevapSifir = rabiCevabi(cozum, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
      hedefeKalan: 0,
    })
    expect(cevapSifir).toEqual(['Matematik 40 soru, not aldım.', 'Başka?'])

    const cevapNull = rabiCevabi(cozum, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
      hedefeKalan: null,
    })
    expect(cevapNull).toEqual(['Matematik 40 soru, not aldım.', 'Başka?'])
  })

  it('kapanış sorusu mesajSirasi değerine göre (0, 1, 2, 3) sırayla döner', () => {
    const cozum: SesliCozum = {
      sorular: [{ ders: 'Fizik', toplam: 20, dogru: 0, yanlis: 0 }],
      deneme: null,
      anlasilmayan: [],
    }

    expect(
      rabiCevabi(cozum, { sablonlar: SECENEK_SABLONLAR, mesajSirasi: 0 })[1],
    ).toBe('Başka?')

    expect(
      rabiCevabi(cozum, { sablonlar: SECENEK_SABLONLAR, mesajSirasi: 1 })[1],
    ).toBe('Başka ne çözdün?')

    expect(
      rabiCevabi(cozum, { sablonlar: SECENEK_SABLONLAR, mesajSirasi: 2 })[1],
    ).toBe('Eklemek istediğin başka bir şey var mı?')

    expect(
      rabiCevabi(cozum, { sablonlar: SECENEK_SABLONLAR, mesajSirasi: 3 })[1],
    ).toBe('Başka?')
  })

  it('hem soru hem deneme anlaşıldığında özetler tek balonda birleşir', () => {
    const karma: SesliCozum = {
      sorular: [{ ders: 'Matematik', toplam: 80, dogru: 0, yanlis: 0 }],
      deneme: {
        sablonId: 'tyt',
        dersler: [],
        toplamNet: 87,
      },
      anlasilmayan: [],
    }

    const cevap = rabiCevabi(karma, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
    })

    expect(cevap).toEqual([
      'Matematik 80 soru, not aldım. TYT denemesi, toplam 87 net.',
      'Başka?',
    ])
  })

  it('gerçek sesliMetniCoz çıktılarıyla uçtan uca doğru yanıtlar üretir', () => {
    const cozum1 = sesliMetniCoz('Matematik 40 soru çözdüm 32 doğru 8 yanlış', {
      sablonlar: SECENEK_SABLONLAR,
      varsayilanSablonId: 'tyt',
    })
    const cevap1 = rabiCevabi(cozum1, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 0,
    })
    expect(cevap1).toEqual([
      'Matematik 40 soru, 32 doğru 8 yanlış. Not aldım.',
      'Başka?',
    ])

    const cozum2 = sesliMetniCoz('bugün çok yoruldum', {
      sablonlar: SECENEK_SABLONLAR,
      varsayilanSablonId: 'tyt',
    })
    const cevap2 = rabiCevabi(cozum2, {
      sablonlar: SECENEK_SABLONLAR,
      mesajSirasi: 1,
    })
    expect(cevap2).toEqual([
      'Bunu anlayamadım. Mesela “80 matematik” ya da “TYT Türkçe 33 doğru 4 yanlış” diyebilirsin.',
    ])

    let birikim = BOS_BIRIKIM
    birikim = birikimeEkle(birikim, cozum1)
    expect(birikim.sorular).toEqual([
      { ders: 'Matematik', toplam: 40, dogru: 32, yanlis: 8 },
    ])
  })
})
