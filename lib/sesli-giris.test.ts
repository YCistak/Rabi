import { describe, expect, it } from 'vitest'
import { HAZIR_SABLONLAR, secilebilirSablonlar } from './sablonlar'
import {
  duyulaniDuzelt,
  enIyiAdayiSec,
  sayilariRakamaCevir,
  type SesliCozum,
  sesliMetniCoz,
  TANIMA_IPUCLARI,
} from './sesli-giris'
import type { Sablon } from './types'

const SECENEK_SABLONLAR: Sablon[] = secilebilirSablonlar(HAZIR_SABLONLAR, 12, null)

function coz(
  metin: string,
  varsayilanSablonId = 'tyt',
  sablonlar: Sablon[] = SECENEK_SABLONLAR,
): SesliCozum {
  return sesliMetniCoz(metin, { sablonlar, varsayilanSablonId })
}

describe('sayilariRakamaCevir', () => {
  it('temel yazılı sayıları rakama çevirir, sayı olmayan kelimelere dokunmaz', () => {
    expect(sayilariRakamaCevir('seksen yedi')).toBe('87')
    expect(sayilariRakamaCevir('yüz')).toBe('100')
    expect(sayilariRakamaCevir('iki yüz on')).toBe('210')
    expect(sayilariRakamaCevir('onun dışında')).toBe('onun dışında')
    expect(sayilariRakamaCevir('otuz beş')).toBe('35')
    expect(sayilariRakamaCevir('yüz yirmi')).toBe('120')
    expect(sayilariRakamaCevir('seksen')).toBe('80')
  })

  it('sayı konumundaki "on"u çevirir ama "ön" ve "ondan"a dokunmaz', () => {
    expect(sayilariRakamaCevir('on matematik')).toBe('10 matematik')
    expect(sayilariRakamaCevir('ön hazırlık yaptım')).toBe('ön hazırlık yaptım')
    expect(sayilariRakamaCevir('ondan sonra yirmi soru')).toBe('ondan sonra 20 soru')
  })

  it('ardışık iki ayrı sayıyı tek sayıda toplamaz ve sıra sayılarını bölmez', () => {
    expect(sayilariRakamaCevir('Türkçe otuz beş üç')).toBe('Türkçe 35 3')
    expect(sayilariRakamaCevir('beşinci üniteden kırk soru')).toBe('beşinci üniteden 40 soru')
    expect(sayilariRakamaCevir('bir de otuz matematik')).toBe('bir de 30 matematik')
    expect(sayilariRakamaCevir('yirmi bir soru')).toBe('21 soru')
  })

  it('yazıyla söylenmiş üleştirme ve iyelik ekli sayıları koruyarak çevirir', () => {
    expect(sayilariRakamaCevir('yirmişer soru')).toBe("20'şer soru")
    expect(sayilariRakamaCevir('yirmisi doğru')).toBe("20'si doğru")
  })
})

describe('sesliMetniCoz — temel senaryolar', () => {
  it('1. deneme neti ile onun dışındaki soru çözümlerini ayırır', () => {
    const sonuc = coz(
      'Bugün okulda TYT denemesi çözdük TYT denemesinde 87 net yaptım onun dışında 80 matematik 65 tane de kimya sorusu çözdüm',
    )
    expect(sonuc.sorular).toEqual([
      { ders: 'Matematik', toplam: 80, dogru: 0, yanlis: 0 },
      { ders: 'Kimya', toplam: 65, dogru: 0, yanlis: 0 },
    ])
    expect(sonuc.deneme).toEqual({
      sablonId: 'tyt',
      dersler: [],
      toplamNet: 87,
    })
    expect(sonuc.anlasilmayan).toEqual([])
  })

  it('2. soru bağlamında toplam, doğru ve yanlışı çözer; deneme üretmez', () => {
    const sonuc = coz('Matematik 40 soru çözdüm 32 doğru 8 yanlış')
    expect(sonuc.sorular).toEqual([{ ders: 'Matematik', toplam: 40, dogru: 32, yanlis: 8 }])
    expect(sonuc.deneme).toBeNull()
    expect(sonuc.anlasilmayan).toEqual([])
  })

  it("3. çekim ekli ders ve iyelikli doğru sayısında yanlışı 0 kabul eder", () => {
    const sonuc = coz("Fizikten 25 soru çözdüm 20'si doğru")
    expect(sonuc.sorular).toEqual([{ ders: 'Fizik', toplam: 25, dogru: 20, yanlis: 0 }])
    expect(sonuc.deneme).toBeNull()
    expect(sonuc.anlasilmayan).toEqual([])
  })

  it('4. yazıyla söylenmiş soru sayısını çözer', () => {
    const sonuc = coz('otuz beş tane biyoloji sorusu çözdüm')
    expect(sonuc.sorular).toEqual([{ ders: 'Biyoloji', toplam: 35, dogru: 0, yanlis: 0 }])
    expect(sonuc.deneme).toBeNull()
  })

  it('5. tür söylenmeyen denemede varsayılan şablonu ve ders doğru/yanlışlarını alır', () => {
    const sonuc = coz('Deneme çözdüm Türkçe 32 doğru 6 yanlış matematik 28 doğru 8 yanlış')
    expect(sonuc.sorular).toEqual([])
    expect(sonuc.deneme).toEqual({
      sablonId: 'tyt',
      dersler: [
        { dersId: 'turkce', dogru: 32, yanlis: 6 },
        { dersId: 'matematik', dogru: 28, yanlis: 8 },
      ],
      toplamNet: null,
    })
    expect(sonuc.anlasilmayan).toEqual([])
  })

  it('6. deneme bağlamında etiketsiz iki sayıyı doğru ve yanlış olarak okur', () => {
    const sonuc = coz('TYT denemesinde Türkçe 35 3 matematik 30 5')
    expect(sonuc.sorular).toEqual([])
    expect(sonuc.deneme).toEqual({
      sablonId: 'tyt',
      dersler: [
        { dersId: 'turkce', dogru: 35, yanlis: 3 },
        { dersId: 'matematik', dogru: 30, yanlis: 5 },
      ],
      toplamNet: null,
    })
  })

  it("7. üleştirme ekiyle bağlanan derslerin her birine aynı soru sayısını yazar", () => {
    const sonuc = coz("Tarih ve coğrafyadan 20'şer soru çözdüm")
    expect(sonuc.sorular).toEqual([
      { ders: 'Tarih', toplam: 20, dogru: 0, yanlis: 0 },
      { ders: 'Coğrafya', toplam: 20, dogru: 0, yanlis: 0 },
    ])
    expect(sonuc.anlasilmayan).toEqual([])
  })

  it('8. paragraf sorularını Türkçe dersine yazar', () => {
    const sonuc = coz('yüz yirmi paragraf sorusu çözdüm')
    expect(sonuc.sorular).toEqual([{ ders: 'Türkçe', toplam: 120, dogru: 0, yanlis: 0 }])
  })

  it('9. geometriyi Matematik dersine yazar', () => {
    const sonuc = coz('geometri 30 soru')
    expect(sonuc.sorular).toEqual([{ ders: 'Matematik', toplam: 30, dogru: 0, yanlis: 0 }])
  })

  it('10. doğru sayısı toplamı aşarsa kaydı düşürüp anlaşılmayana ekler', () => {
    const sonuc = coz('Matematik 40 soru 45 doğru')
    expect(sonuc.sorular).toEqual([])
    expect(sonuc.anlasilmayan.length).toBeGreaterThan(0)
  })

  it('11. aynı ders soru bağlamında birden çok kez geçerse toplar', () => {
    const sonuc = coz('20 matematik çözdüm sonra 10 matematik daha çözdüm')
    expect(sonuc.sorular).toEqual([{ ders: 'Matematik', toplam: 30, dogru: 0, yanlis: 0 }])
    expect(sonuc.anlasilmayan).toEqual([])
  })

  it('12. İngilizceyi Yabancı Dil, dini Din Kültürü dersine eşler', () => {
    expect(coz('İngilizce 50 soru').sorular).toEqual([
      { ders: 'Yabancı Dil', toplam: 50, dogru: 0, yanlis: 0 },
    ])
    expect(coz('din 15 soru').sorular).toEqual([
      { ders: 'Din Kültürü', toplam: 15, dogru: 0, yanlis: 0 },
    ])
  })

  it('13. AYT denemesi söylendiğinde AYT şablonunu seçer', () => {
    const sonuc = coz('AYT denemesinde matematik 25 doğru 5 yanlış')
    expect(sonuc.deneme?.sablonId).toBe('ayt-say')
    expect(sonuc.deneme?.dersler).toEqual([{ dersId: 'matematik', dogru: 25, yanlis: 5 }])
    expect(sonuc.anlasilmayan).toEqual([])
  })

  it('14. deneme dersinin soru sayısını aşan sonucu düşürüp anlaşılmayana yazar', () => {
    const sonuc = coz('TYT denemesinde Türkçe 45 doğru 2 yanlış')
    expect(sonuc.deneme).toBeNull()
    expect(sonuc.anlasilmayan.length).toBeGreaterThan(0)
  })

  it('15. ders ve deneme içermeyen günlük konuşmada her şeyi boş döner', () => {
    expect(coz('bugün çok yoruldum')).toEqual({
      sorular: [],
      deneme: null,
      anlasilmayan: [],
    })
  })
})

describe('kenar durumları', () => {
  it('ünsüz yumuşaması ve farklı çekim ekleri alan ders adlarını yakalar, CALISMA_DERSLERI sırasında döner', () => {
    const sonuc = coz(
      'kimyadan 30, fiziğe 20, matematiğe 40, Türkçeden 50, biyolojiden 25 soru çözdüm',
    )
    expect(sonuc.sorular).toEqual([
      { ders: 'Türkçe', toplam: 50, dogru: 0, yanlis: 0 },
      { ders: 'Matematik', toplam: 40, dogru: 0, yanlis: 0 },
      { ders: 'Fizik', toplam: 20, dogru: 0, yanlis: 0 },
      { ders: 'Kimya', toplam: 30, dogru: 0, yanlis: 0 },
      { ders: 'Biyoloji', toplam: 25, dogru: 0, yanlis: 0 },
    ])
  })

  it('edebiyat, sosyoloji, psikoloji ve mantık alt dallarını doğru ana derse toplar', () => {
    const sonuc = coz('edebiyat 25 soru sosyoloji 10 soru psikoloji 15 soru mantıktan 10 soru')
    expect(sonuc.sorular).toEqual([
      { ders: 'Türkçe', toplam: 25, dogru: 0, yanlis: 0 },
      { ders: 'Felsefe', toplam: 35, dogru: 0, yanlis: 0 },
    ])
  })

  it('kısaltmaları tanır ama başka kelimelerin içindeki heceleri ders sanmaz', () => {
    expect(coz('mat 30 soru kim 20 soru fiz 15 soru').sorular).toEqual([
      { ders: 'Matematik', toplam: 30, dogru: 0, yanlis: 0 },
      { ders: 'Fizik', toplam: 15, dogru: 0, yanlis: 0 },
      { ders: 'Kimya', toplam: 20, dogru: 0, yanlis: 0 },
    ])
    expect(coz('bugün biraz dinlendim otomat bozuktu')).toEqual({
      sorular: [],
      deneme: null,
      anlasilmayan: [],
    })
  })

  it('soru bağlamında yalnız doğru ve yanlış söylendiyse toplamı ikisinden hesaplar', () => {
    const sonuc = coz('Matematikten 32 doğru 8 yanlış yaptım')
    expect(sonuc.sorular).toEqual([{ ders: 'Matematik', toplam: 40, dogru: 32, yanlis: 8 }])
  })

  it('0 soru ve 500 üstü yanlış duyulmuş sayıları reddeder', () => {
    const sifir = coz('Matematik 0 soru çözdüm')
    expect(sifir.sorular).toEqual([])
    expect(sifir.anlasilmayan.length).toBeGreaterThan(0)

    const asiri = coz('Fizikten 650 soru çözdüm')
    expect(asiri.sorular).toEqual([])
    expect(asiri.anlasilmayan.length).toBeGreaterThan(0)
  })

  it('üleştirme eki olmadan iki derse tek sayı verilirse tahmin yürütmez', () => {
    const sonuc = coz('Tarih ve coğrafyadan 20 soru çözdüm')
    expect(sonuc.sorular).toEqual([])
    expect(sonuc.anlasilmayan.length).toBeGreaterThan(0)
  })

  it('çalışma süresi ve sınıf bilgisini soru sayısıyla karıştırmaz', () => {
    const sonuc = coz('Bugün 2 saat 11. sınıf matematik çalıştım 80 soru çözdüm')
    expect(sonuc.sorular).toEqual([{ ders: 'Matematik', toplam: 80, dogru: 0, yanlis: 0 }])
    expect(sonuc.anlasilmayan).toEqual([])
  })

  it('YDT / dil denemesi ve seviye tespit / okul denemesi şablonlarını seçer', () => {
    const dil = coz('Dil denemesi çözdüm İngilizce 70 doğru 5 yanlış')
    expect(dil.deneme).toEqual({
      sablonId: 'ydt',
      dersler: [{ dersId: 'ydt', dogru: 70, yanlis: 5 }],
      toplamNet: null,
    })

    const okul = coz('Okul denemesinde edebiyat 25 doğru 3 yanlış')
    expect(okul.deneme).toEqual({
      sablonId: 'okul',
      dersler: [{ dersId: 'edebiyat', dogru: 25, yanlis: 3 }],
      toplamNet: null,
    })

    const seviye = coz('Seviye tespit denemesinde 82,5 net yaptım')
    expect(seviye.deneme).toEqual({
      sablonId: 'okul',
      dersler: [],
      toplamNet: 82.5,
    })
  })

  it('varsayılan şablon zaten istenen türdeyse listedeki ilk şablon yerine varsayılanı korur', () => {
    const sonuc = coz('AYT denemesinde edebiyat 20 doğru 4 yanlış', 'ayt-ea')
    expect(sonuc.deneme?.sablonId).toBe('ayt-ea')
    expect(sonuc.deneme?.dersler).toEqual([{ dersId: 'edebiyat', dogru: 20, yanlis: 4 }])
  })

  it('buçuklu neti ve önce soru sonra deneme anlatılan akışı çözer', () => {
    const sonuc = coz(
      'Sabah 40 paragraf sorusu çözdüm akşam TYT denemesinde seksen yedi buçuk net yaptım bir de 30 fizik sorusu çözdüm',
    )
    expect(sonuc.sorular).toEqual([
      { ders: 'Türkçe', toplam: 40, dogru: 0, yanlis: 0 },
      { ders: 'Fizik', toplam: 30, dogru: 0, yanlis: 0 },
    ])
    expect(sonuc.deneme).toEqual({
      sablonId: 'tyt',
      dersler: [],
      toplamNet: 87.5,
    })
    expect(sonuc.anlasilmayan).toEqual([])
  })
})

describe('çözücü düzeltmeleri', () => {
  it('deneme bağlamında grup adlarını (sosyal/fen) uydurmayıp anlaşılmayana atar, kalan dersleri korur', () => {
    const sonuc = coz(
      'TYT denemesi çözdüm türkçe 30 doğru 5 yanlış sosyal 15 doğru matematik 25 doğru 3 yanlış fen 12 doğru',
    )
    expect(sonuc.sorular).toEqual([])
    expect(sonuc.deneme).toEqual({
      sablonId: 'tyt',
      dersler: [
        { dersId: 'turkce', dogru: 30, yanlis: 5 },
        { dersId: 'matematik', dogru: 25, yanlis: 3 },
      ],
      toplamNet: null,
    })
    expect(sonuc.anlasilmayan).toEqual(['sosyal 15 doğru', 'fen 12 doğru'])

    const uzunGrup = coz(
      'TYT denemesinde Türkçe 32 doğru 4 yanlış sosyal bilimler 14 doğru 3 yanlış matematik 28 doğru 2 yanlış fen bilimleri 15 doğru 2 yanlış',
    )
    expect(uzunGrup.deneme).toEqual({
      sablonId: 'tyt',
      dersler: [
        { dersId: 'turkce', dogru: 32, yanlis: 4 },
        { dersId: 'matematik', dogru: 28, yanlis: 2 },
      ],
      toplamNet: null,
    })
    expect(uzunGrup.anlasilmayan).toEqual([
      'sosyal bilimler 14 doğru 3 yanlış',
      'fen bilimleri 15 doğru 2 yanlış',
    ])
  })

  it('kullanıcı şablonunda "Sosyal" veya "Fen" adlı tek ders varsa doğrudan ona eşler', () => {
    const ozelSablon: Sablon = {
      id: 'ozel-tyt',
      ad: 'Özel TYT',
      tur: 'tyt',
      yanlisKatsayi: 4,
      hazir: false,
      dersler: [
        { id: 'turkce', ad: 'Türkçe', soruSayisi: 40 },
        { id: 'sosyal', ad: 'Sosyal', soruSayisi: 20 },
        { id: 'matematik', ad: 'Matematik', soruSayisi: 40 },
        { id: 'fen', ad: 'Fen', soruSayisi: 20 },
      ],
    }
    const sonuc = coz(
      'TYT denemesinde Türkçe 30 doğru 5 yanlış sosyal 15 doğru 3 yanlış matematik 25 doğru 3 yanlış fen 12 doğru 4 yanlış',
      'ozel-tyt',
      [ozelSablon],
    )
    expect(sonuc.deneme).toEqual({
      sablonId: 'ozel-tyt',
      dersler: [
        { dersId: 'turkce', dogru: 30, yanlis: 5 },
        { dersId: 'sosyal', dogru: 15, yanlis: 3 },
        { dersId: 'matematik', dogru: 25, yanlis: 3 },
        { dersId: 'fen', dogru: 12, yanlis: 4 },
      ],
      toplamNet: null,
    })
    expect(sonuc.anlasilmayan).toEqual([])
  })

  it('denemede tek bir dersin hatalı olması diğer geçerli dersleri düşürmez', () => {
    const sonuc = coz(
      'TYT denemesinde Türkçe 34 doğru 4 yanlış fizik 10 doğru 1 yanlış matematik 30 doğru 5 yanlış',
    )
    expect(sonuc.deneme).toEqual({
      sablonId: 'tyt',
      dersler: [
        { dersId: 'turkce', dogru: 34, yanlis: 4 },
        { dersId: 'matematik', dogru: 30, yanlis: 5 },
      ],
      toplamNet: null,
    })
    expect(sonuc.anlasilmayan).toEqual(['fizik 10 doğru 1 yanlış'])
  })

  it('soru takibinde "hepsi doğru / hepsini doğru yaptım / tamamı doğru" ifadelerinde doğruyu toplama eşitler', () => {
    expect(coz('kimyadan yirmi beş tane soru çözdüm hepsi doğru')).toEqual({
      sorular: [{ ders: 'Kimya', toplam: 25, dogru: 25, yanlis: 0 }],
      deneme: null,
      anlasilmayan: [],
    })

    expect(
      coz('fizikten 30 soru çözdüm hepsini doğru yaptım biyolojiden 20 soru çözdüm tamamı doğru'),
    ).toEqual({
      sorular: [
        { ders: 'Fizik', toplam: 30, dogru: 30, yanlis: 0 },
        { ders: 'Biyoloji', toplam: 20, dogru: 20, yanlis: 0 },
      ],
      deneme: null,
      anlasilmayan: [],
    })
  })

  it('denemede "hepsi doğru / tamamı doğru / hepsini doğru yaptım" dendiğinde şablon soru sayısını yazar', () => {
    const sonuc = coz(
      'TYT denemesinde matematik hepsi doğru fizik tamamı doğru kimya hepsini doğru yaptım',
    )
    expect(sonuc.sorular).toEqual([])
    expect(sonuc.deneme).toEqual({
      sablonId: 'tyt',
      dersler: [
        { dersId: 'matematik', dogru: 40, yanlis: 0 },
        { dersId: 'fizik', dogru: 7, yanlis: 0 },
        { dersId: 'kimya', dogru: 7, yanlis: 0 },
      ],
      toplamNet: null,
    })
    expect(sonuc.anlasilmayan).toEqual([])
  })

  it('sonuç verilmeyen "3 deneme çözdüm" ifadesinde denemeyi null bırakıp ifadeyi anlaşılmayana ekler', () => {
    expect(coz('3 deneme çözdüm')).toEqual({
      sorular: [],
      deneme: null,
      anlasilmayan: ['3 deneme çözdüm'],
    })

    expect(coz('üç deneme çözdüm bir de 50 matematik sorusu çözdüm')).toEqual({
      sorular: [{ ders: 'Matematik', toplam: 50, dogru: 0, yanlis: 0 }],
      deneme: null,
      anlasilmayan: ['üç deneme çözdüm'],
    })
  })

  it('deneme ve soru takibinin bir arada geçtiği karma konuşmada dört kuralı birlikte uygular', () => {
    const sonuc = coz(
      'Bugün TYT denemesi çözdüm matematik hepsi doğru sosyal 15 doğru onun dışında kimyadan yirmi beş tane soru çözdüm hepsi doğru',
    )
    expect(sonuc.deneme).toEqual({
      sablonId: 'tyt',
      dersler: [{ dersId: 'matematik', dogru: 40, yanlis: 0 }],
      toplamNet: null,
    })
    expect(sonuc.sorular).toEqual([{ ders: 'Kimya', toplam: 25, dogru: 25, yanlis: 0 }])
    expect(sonuc.anlasilmayan).toEqual(['sosyal 15 doğru'])
  })
})

describe('duyulaniDuzelt — telefonun yanlış duyduğu sözcükler', () => {
  it('TYT için bilinen tüm yanlış duyma biçimlerini ekleri koruyarak düzeltir', () => {
    expect(duyulaniDuzelt("TT'de 85 net")).toBe("TYT'de 85 net")
    expect(duyulaniDuzelt('t t denemesi')).toBe('TYT denemesi')
    expect(duyulaniDuzelt('tete denemesi')).toBe('TYT denemesi')
    expect(duyulaniDuzelt('tetede 80 net')).toBe("TYT'de 80 net")
    expect(duyulaniDuzelt('te te denemesi')).toBe('TYT denemesi')
    expect(duyulaniDuzelt('titi denemesi')).toBe('TYT denemesi')
    expect(duyulaniDuzelt('ti ti denemesi')).toBe('TYT denemesi')
    expect(duyulaniDuzelt("tyt'de")).toBe("TYT'de")
    expect(duyulaniDuzelt('t y t denemesi')).toBe('TYT denemesi')
    expect(duyulaniDuzelt("te ye te'den")).toBe("TYT'den")
    expect(duyulaniDuzelt('teyete denemesi')).toBe('TYT denemesi')
    expect(duyulaniDuzelt('teyte denemesi')).toBe('TYT denemesi')
    expect(duyulaniDuzelt('tiyti denemesi')).toBe('TYT denemesi')
    expect(duyulaniDuzelt('ttt denemesi')).toBe('TYT denemesi')
    expect(duyulaniDuzelt('tit denemesi')).toBe('TYT denemesi')
    expect(duyulaniDuzelt('TİT denemesinde')).toBe('TYT denemesinde')
    expect(duyulaniDuzelt('tit ses çıkardı')).toBe('tit ses çıkardı')
  })

  it('AYT biçimlerini düzeltir ve AT büyük/küçük harf ayrımını korur', () => {
    expect(duyulaniDuzelt("AYT'den 65 net")).toBe("AYT'den 65 net")
    expect(duyulaniDuzelt('ayt denemesi')).toBe('AYT denemesi')
    expect(duyulaniDuzelt('a y t denemesi')).toBe('AYT denemesi')
    expect(duyulaniDuzelt("a ye te'de")).toBe("AYT'de")
    expect(duyulaniDuzelt('ayte denemesi')).toBe('AYT denemesi')
    expect(duyulaniDuzelt('ayteden 60 net')).toBe("AYT'den 60 net")
    expect(duyulaniDuzelt('ayyte denemesi')).toBe('AYT denemesi')
    expect(duyulaniDuzelt('eyte denemesi')).toBe('AYT denemesi')
    expect(duyulaniDuzelt('ay te denemesi')).toBe('AYT denemesi')
    expect(duyulaniDuzelt('a te denemesi')).toBe('AYT denemesi')
    expect(duyulaniDuzelt('AT denemesi')).toBe('AYT denemesi')
    expect(duyulaniDuzelt("AT'de matematik 30 doğru")).toBe("AYT'de matematik 30 doğru")
    expect(duyulaniDuzelt('at koşturdu')).toBe('at koşturdu')
    expect(duyulaniDuzelt('at denemesi')).toBe('at denemesi')
    expect(duyulaniDuzelt('At üstünde')).toBe('At üstünde')
    expect(duyulaniDuzelt('ATA')).toBe('ATA')
  })

  it('YDT biçimlerini ekleri koruyarak düzeltir', () => {
    expect(duyulaniDuzelt("ydt'de 70 doğru")).toBe("YDT'de 70 doğru")
    expect(duyulaniDuzelt('y d t denemesi')).toBe('YDT denemesi')
    expect(duyulaniDuzelt('ye de te denemesi')).toBe('YDT denemesi')
    expect(duyulaniDuzelt("yedete'den")).toBe("YDT'den")
    expect(duyulaniDuzelt('yde te denemesi')).toBe('YDT denemesi')
  })

  it('cümle başındaki ve virgül/ünlem yanındaki Rabi hitaplarını siler, "araba"ya dokunmaz', () => {
    expect(duyulaniDuzelt('Rabi, bugün 50 matematik çözdüm')).toBe('bugün 50 matematik çözdüm')
    expect(duyulaniDuzelt('Rabbi! 30 fizik çözdüm')).toBe('30 fizik çözdüm')
    expect(duyulaniDuzelt('Arabi bugün 50 matematik çözdüm')).toBe('bugün 50 matematik çözdüm')
    expect(duyulaniDuzelt('Rabia, 40 kimya çözdüm')).toBe('40 kimya çözdüm')
    expect(duyulaniDuzelt('Ravi bugün 20 biyoloji çözdüm')).toBe('bugün 20 biyoloji çözdüm')
    expect(duyulaniDuzelt('50 matematik çözdüm, Rabiye!')).toBe('50 matematik çözdüm')
    expect(duyulaniDuzelt('bugün araba yıkadım 30 matematik çözdüm')).toBe(
      'bugün araba yıkadım 30 matematik çözdüm',
    )
    expect(coz('bugün araba yıkadım 30 matematik çözdüm')).toEqual({
      sorular: [{ ders: 'Matematik', toplam: 30, dogru: 0, yanlis: 0 }],
      deneme: null,
      anlasilmayan: [],
    })
  })
})

describe('çekim ekli dersler, sık konuşma kalıpları ve aday seçimi', () => {
  it('gerçek konuşmada sık geçen çekim ekli tüm ders adlarını doğru derse eşler', () => {
    expect(coz('matematikten 10 soru').sorular).toEqual([{ ders: 'Matematik', toplam: 10, dogru: 0, yanlis: 0 }])
    expect(coz('30 soru matematiği bitirdim').sorular).toEqual([{ ders: 'Matematik', toplam: 30, dogru: 0, yanlis: 0 }])
    expect(coz('fizikten 20 soru').sorular).toEqual([{ ders: 'Fizik', toplam: 20, dogru: 0, yanlis: 0 }])
    expect(coz('25 soru fiziği çözdüm').sorular).toEqual([{ ders: 'Fizik', toplam: 25, dogru: 0, yanlis: 0 }])
    expect(coz('kimyadan 30 soru').sorular).toEqual([{ ders: 'Kimya', toplam: 30, dogru: 0, yanlis: 0 }])
    expect(coz('biyolojiden 35 soru').sorular).toEqual([{ ders: 'Biyoloji', toplam: 35, dogru: 0, yanlis: 0 }])
    expect(coz('türkçeden 40 soru').sorular).toEqual([{ ders: 'Türkçe', toplam: 40, dogru: 0, yanlis: 0 }])
    expect(coz('tarihten 20 soru').sorular).toEqual([{ ders: 'Tarih', toplam: 20, dogru: 0, yanlis: 0 }])
    expect(coz('coğrafyadan 15 soru').sorular).toEqual([{ ders: 'Coğrafya', toplam: 15, dogru: 0, yanlis: 0 }])
    expect(coz('geometriden 25 soru').sorular).toEqual([{ ders: 'Matematik', toplam: 25, dogru: 0, yanlis: 0 }])
    expect(coz('paragraftan 30 soru').sorular).toEqual([{ ders: 'Türkçe', toplam: 30, dogru: 0, yanlis: 0 }])
  })

  it('dört sık konuşma kalıbını eksiksiz çözer', () => {
    expect(coz("matematikten 30 soru çözdüm 5'ini yanlış yaptım")).toEqual({
      sorular: [{ ders: 'Matematik', toplam: 30, dogru: 25, yanlis: 5 }],
      deneme: null,
      anlasilmayan: [],
    })

    expect(coz('kimyadan 40 soru çözdüm 32 doğru')).toEqual({
      sorular: [{ ders: 'Kimya', toplam: 40, dogru: 32, yanlis: 0 }],
      deneme: null,
      anlasilmayan: [],
    })

    expect(coz('TT denemesinde türkçe 33 doğru 4 yanlış')).toEqual({
      sorular: [],
      deneme: {
        sablonId: 'tyt',
        dersler: [{ dersId: 'turkce', dogru: 33, yanlis: 4 }],
        toplamNet: null,
      },
      anlasilmayan: [],
    })

    expect(coz('Arabi bugün 50 matematik çözdüm')).toEqual({
      sorular: [{ ders: 'Matematik', toplam: 50, dogru: 0, yanlis: 0 }],
      deneme: null,
      anlasilmayan: [],
    })
  })

  it('enIyiAdayiSec en çok tanıdık sözcük içereni seçer, eşitlikte ilk adayı korur', () => {
    expect(
      enIyiAdayiSec([
        'bugün TT denemesinde 85 net yaptım',
        'bugün TYT denemesinde 85 net yaptım',
      ]),
    ).toBe('bugün TYT denemesinde 85 net yaptım')

    expect(
      enIyiAdayiSec([
        'bugün soru çözdüm',
        'bugün 40 soru çözdüm',
        'bugün kimyadan 40 soru çözdüm',
      ]),
    ).toBe('bugün kimyadan 40 soru çözdüm')

    expect(
      enIyiAdayiSec([
        'fizikten 20 soru çözdüm',
        'fizikten 20 tane çözdüm',
      ]),
    ).toBe('fizikten 20 soru çözdüm')

    expect(enIyiAdayiSec([])).toBe('')
    expect(TANIMA_IPUCLARI).toEqual(
      expect.arrayContaining(['TYT', 'AYT', 'YDT', 'Rabi', 'Matematik', 'Geometri', 'Paragraf', 'Edebiyat']),
    )
  })
})

describe('tanesi/iyelik ekli yanlış sayıları ve denemesiz TYT/AYT/YDT', () => {
  it('"N tanesini yanlış yaptım" ve ardından "de/da" ile gelen dersi eksiksiz çözer', () => {
    expect(
      coz('bugün matematikten 40 soru çözdüm 8 tanesini yanlış yaptım fizikten de 20 soru çözdüm hepsi doğru'),
    ).toEqual({
      sorular: [
        { ders: 'Matematik', toplam: 40, dogru: 32, yanlis: 8 },
        { ders: 'Fizik', toplam: 20, dogru: 20, yanlis: 0 },
      ],
      deneme: null,
      anlasilmayan: [],
    })
  })

  it('tanesi/tanesini/tanesinde, iyelik ekleri (8\'ini, sekizini, \'sı/\'si/\'unu) ve "hepsini doğru yaptım" ailesini çözer', () => {
    expect(
      coz('matematikten 40 soru çözdüm sekizini yanlış yaptım kimyadan da 25 soru çözdüm hepsini doğru yaptım'),
    ).toEqual({
      sorular: [
        { ders: 'Matematik', toplam: 40, dogru: 32, yanlis: 8 },
        { ders: 'Kimya', toplam: 25, dogru: 25, yanlis: 0 },
      ],
      deneme: null,
      anlasilmayan: [],
    })

    expect(
      coz("türkçeden 40 soru çözdüm 8'ini yanlış yaptım biyolojiden de 30 soru çözdüm 6'sı yanlış"),
    ).toEqual({
      sorular: [
        { ders: 'Türkçe', toplam: 40, dogru: 32, yanlis: 8 },
        { ders: 'Biyoloji', toplam: 30, dogru: 24, yanlis: 6 },
      ],
      deneme: null,
      anlasilmayan: [],
    })

    expect(
      coz("tarihten 20 soru çözdüm 3 tanesi yanlış coğrafyadan da 25 soru çözdüm 4 tanesinde yanlış yaptım fizikten 30 soru çözdüm 20'si doğru kimyadan 20 soru çözdüm 9'unu yanlış yaptım"),
    ).toEqual({
      sorular: [
        { ders: 'Fizik', toplam: 30, dogru: 20, yanlis: 0 },
        { ders: 'Kimya', toplam: 20, dogru: 11, yanlis: 9 },
        { ders: 'Tarih', toplam: 20, dogru: 17, yanlis: 3 },
        { ders: 'Coğrafya', toplam: 25, dogru: 21, yanlis: 4 },
      ],
      deneme: null,
      anlasilmayan: [],
    })
  })

  it('"deneme" sözcüğü olmadan TYT/AYT/YDT + ders + doğru/yanlış ifadesini deneme olarak çözer', () => {
    expect(coz('TT Türkçe otuz iki doğru altı yanlış')).toEqual({
      sorular: [],
      deneme: {
        sablonId: 'tyt',
        dersler: [{ dersId: 'turkce', dogru: 32, yanlis: 6 }],
        toplamNet: null,
      },
      anlasilmayan: [],
    })

    expect(coz('AYT matematik 30 doğru 5 yanlış fizik 12 doğru 2 yanlış')).toEqual({
      sorular: [],
      deneme: {
        sablonId: 'ayt-say',
        dersler: [
          { dersId: 'matematik', dogru: 30, yanlis: 5 },
          { dersId: 'fizik', dogru: 12, yanlis: 2 },
        ],
        toplamNet: null,
      },
      anlasilmayan: [],
    })

    expect(coz('YDT İngilizce 70 doğru 5 yanlış')).toEqual({
      sorular: [],
      deneme: {
        sablonId: 'ydt',
        dersler: [{ dersId: 'ydt', dogru: 70, yanlis: 5 }],
        toplamNet: null,
      },
      anlasilmayan: [],
    })
  })

  it('"Bugün 50 TYT matematik sorusu çözdüm" gibi soru çözümü ifadelerini Soru Takibi\'nde tutar', () => {
    expect(coz('Bugün 50 TYT matematik sorusu çözdüm')).toEqual({
      sorular: [{ ders: 'Matematik', toplam: 50, dogru: 0, yanlis: 0 }],
      deneme: null,
      anlasilmayan: [],
    })

    expect(coz('Bugün TYT matematikten 40 soru çözdüm 8 tanesini yanlış yaptım')).toEqual({
      sorular: [{ ders: 'Matematik', toplam: 40, dogru: 32, yanlis: 8 }],
      deneme: null,
      anlasilmayan: [],
    })
  })
})
