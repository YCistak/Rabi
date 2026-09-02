import { describe, expect, it } from 'vitest'
import {
  KARISTIRILAN,
  SEKIL_ACIKLAMASI,
  SEKIL_ADI,
  denizliMi,
  haritaCiz,
  siklariKur,
  soruUret,
  turHazirla,
  uretec,
  yukseltiAlani,
  type YerSekli,
} from './izohips'
import { ZORLUKLAR } from './ritim'

/** Sabit üreteç — testler rastgeleliğe bakmasın. */
function sayac(baslangic = 0.5): () => number {
  let x = baslangic
  return () => {
    x = (x * 9301 + 49297) % 233280
    return x / 233280
  }
}

const TUM_SEKILLER = Object.keys(SEKIL_ADI) as YerSekli[]

describe('tohum', () => {
  it('aynı tohum aynı sayıları veriyor', () => {
    const a = uretec(1234)
    const b = uretec(1234)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  it('farklı tohum farklı harita çiziyor', () => {
    const bir = haritaCiz({ tohum: 1, zorluk: 'orta', sekil: 'tepe' })
    const iki = haritaCiz({ tohum: 2, zorluk: 'orta', sekil: 'tepe' })
    expect(bir.egriler.map((e) => e.yol).join()).not.toBe(iki.egriler.map((e) => e.yol).join())
  })

  /*
    Banka kaydı yalnızca tohumu saklıyor; harita her açılışta yeniden
    çiziliyor. Çizim tohumdan sapsaydı öğrencinin yanlış bildiği harita
    tekrarda başka bir harita olurdu.
  */
  it('aynı soru her çağrıda aynı haritayı veriyor', () => {
    const soru = { tohum: 987654, zorluk: 'zor' as const, sekil: 'ada' as const }
    expect(haritaCiz(soru)).toEqual(haritaCiz(soru))
  })
})

describe('şekil tabloları', () => {
  it('her şeklin adı, açıklaması ve çeldirici listesi var', () => {
    for (const sekil of TUM_SEKILLER) {
      expect(SEKIL_ADI[sekil]).toBeTruthy()
      expect(SEKIL_ACIKLAMASI[sekil]).toBeTruthy()
      expect(KARISTIRILAN[sekil]).toHaveLength(3)
    }
  })

  it('çeldiriciler şeklin kendisini içermiyor', () => {
    for (const sekil of TUM_SEKILLER) {
      expect(KARISTIRILAN[sekil]).not.toContain(sekil)
      expect(new Set(KARISTIRILAN[sekil]).size).toBe(3)
    }
  })
})

describe('şıklar', () => {
  it('dört şık ve tek doğru', () => {
    for (const sekil of TUM_SEKILLER) {
      const siklar = siklariKur({ tohum: 7, zorluk: 'orta', sekil }, sayac())
      expect(siklar).toHaveLength(4)
      expect(siklar.filter((s) => s.dogruMu)).toHaveLength(1)
      expect(siklar.find((s) => s.dogruMu)?.deger).toBe(sekil)
    }
  })

  /*
    Kıyı şekilleri denizsiz haritalarda çıkmamalı — çıksaydı deniz olmadan
    "ada" diye bir şık gösterilir ve soru çözülmeden elenirdi.
  */
  it('denizsiz haritanın şıklarında kıyı şekli yok', () => {
    for (const sekil of ['tepe', 'cukur', 'vadi', 'sirt', 'boyun'] as YerSekli[]) {
      const siklar = siklariKur({ tohum: 3, zorluk: 'zor', sekil }, sayac())
      expect(siklar.every((s) => !denizliMi(s.deger))).toBe(true)
    }
  })
})

describe('tur', () => {
  it('istenen sayıda soru üretiyor ve hepsi o zorlukta', () => {
    for (const zorluk of ZORLUKLAR) {
      const sorular = turHazirla(zorluk, 30, sayac())
      expect(sorular).toHaveLength(30)
      expect(sorular.every((s) => s.soru.zorluk === zorluk)).toBe(true)
    }
  })

  /*
    Kolay haritada kıyı şekli ve eğim karşılaştırması yok: ikisi de haritanın
    başka bir yerine bakmayı gerektiriyor.
  */
  it('kolay turda yalnızca temel şekiller çıkıyor', () => {
    const sorular = turHazirla('kolay', 60, sayac(0.1))
    const cikanlar = new Set(sorular.map((s) => s.soru.sekil))
    expect([...cikanlar].every((s) => ['tepe', 'cukur', 'vadi', 'sirt'].includes(s))).toBe(true)
  })
})

/*
  Harita testlerinin süre sınırı ayrı.

  Buradaki her doğrulama bir haritayı gerçekten çiziyor: yükselti alanı,
  marching squares, dikiş ve etiket yerleştirme. Onlarca tohum × on bir şekil,
  varsayılan beş saniyeyi yüklü bir makinede aşıyor ve testler mantık
  bozulmadan kırmızıya dönüyordu. Tohum sayısını kısmak kapsamı daraltırdı;
  kısılan şey süre sınırı.
*/
const HARITA_SURESI = 30_000

describe('harita', () => {
  /*
    Marching squares'in parçaları yönlü ekleniyor; yön tutmazsa eğriler uç uca
    eklenemez ve harita binlerce kırık çizgiye dönüşür. Bu yüzden eğri
    **sayısı** denetleniyor: bir harita birkaç düzine eğriden oluşur, yüzlerce
    değil.
  */
  it('eğriler dikiliyor, kırıntıya bölünmüyor', () => {
    for (let tohum = 1; tohum <= 40; tohum++) {
      const soru = soruUret('zor', uretec(tohum))
      const harita = haritaCiz(soru)
      expect(harita.egriler.length).toBeGreaterThan(0)
      expect(harita.egriler.length).toBeLessThan(80)
    }
  }, HARITA_SURESI)

  it('her şekilde eğri ve işaret üretiliyor', () => {
    for (const sekil of TUM_SEKILLER) {
      for (let tohum = 1; tohum <= 10; tohum++) {
        const harita = haritaCiz({ tohum, zorluk: 'zor', sekil })
        expect(harita.egriler.length).toBeGreaterThan(2)
        expect(harita.isaret.r).toBeGreaterThan(0)
      }
    }
  }, HARITA_SURESI)

  /** İşaret haritanın içinde kalmalı; yarısı dışarıda kalan daire okunmuyor. */
  it('işaret haritanın içinde duruyor', () => {
    for (const sekil of TUM_SEKILLER) {
      for (let tohum = 1; tohum <= 20; tohum++) {
        const { isaret, en, boy } = haritaCiz({ tohum, zorluk: 'orta', sekil })
        expect(isaret.x).toBeGreaterThan(0)
        expect(isaret.x).toBeLessThan(en)
        expect(isaret.y).toBeGreaterThan(0)
        expect(isaret.y).toBeLessThan(boy)
      }
    }
  }, HARITA_SURESI)

  it('deniz yalnızca kıyı şekillerinde çiziliyor', () => {
    for (const sekil of TUM_SEKILLER) {
      const harita = haritaCiz({ tohum: 42, zorluk: 'zor', sekil })
      expect(harita.deniz !== null).toBe(denizliMi(sekil))
    }
  })

  /** Ada sorusunun haritasında denizin içinde en az bir kara parçası olmalı. */
  it('ada sorusunda ada çiziliyor', () => {
    for (let tohum = 1; tohum <= 15; tohum++) {
      const harita = haritaCiz({ tohum, zorluk: 'zor', sekil: 'ada' })
      expect(harita.adalar.length).toBeGreaterThan(0)
    }
  })

  /** Yükseltiler eşit aralıklı: izohipsin tanımı bu. */
  it('eğriler eşit yükselti aralığıyla geçiyor', () => {
    const harita = haritaCiz({ tohum: 5, zorluk: 'kolay', sekil: 'tepe' })
    const yukseltiler = [...new Set(harita.egriler.map((e) => e.yukselti))].sort((a, b) => a - b)
    for (let i = 1; i < yukseltiler.length; i++) {
      expect(yukseltiler[i] - yukseltiler[i - 1]).toBe(harita.aralik)
    }
  })
})

/*
  Sorunun cevabı gerçekten haritada mı?

  Buradaki testler çizime değil, çizimin çıktığı **yükselti alanına** bakıyor
  (`yukseltiAlani`): daire içine alınan yerin çevresini örnekleyip şeklin
  tanımını doğruluyorlar — tepede merkez her yönden yüksek, kapalı çukurda her
  yönden alçak, boyunda iki yönde yüksek iki yönde alçak, adada çevresi deniz.

  Bu, oyunun en kritik güvencesi: harita üretiliyor, yani "daire içindeki şekil
  budur" cümlesini kimse elle yazmıyor. Yerleşim bozulursa (bir dekor daireye
  girerse, ada karaya yapışırsa) soru sessizce yanlış cevaplı hâle gelirdi.
*/
describe('cevabın doğruluğu', () => {
  /** Merkezin çevresinde, halkanın içinde kalan sekiz nokta. */
  function cevre(
    alan: (x: number, y: number) => number,
    [cx, cy]: [number, number],
    uzaklik: number,
  ): number[] {
    const degerler: number[] = []
    for (let i = 0; i < 8; i++) {
      const aci = (i * Math.PI) / 4
      degerler.push(alan(cx + Math.cos(aci) * uzaklik, cy + Math.sin(aci) * uzaklik))
    }
    return degerler
  }

  /** Eğimin büyüklüğü — yamaç sorularının ölçüsü. */
  function egimBoyu(alan: (x: number, y: number) => number, x: number, y: number): number {
    const h = 0.01
    return Math.hypot(alan(x + h, y) - alan(x - h, y), alan(x, y + h) - alan(x, y - h))
  }

  const TOHUMLAR = Array.from({ length: 60 }, (_, i) => i + 1)

  it('tepede merkez her yönden yüksek', () => {
    for (const tohum of TOHUMLAR) {
      const { alan, merkez, yaricap } = yukseltiAlani({ tohum, zorluk: 'orta', sekil: 'tepe' })
      const orta = alan(...merkez)
      for (const deger of cevre(alan, merkez, yaricap * 0.75)) {
        expect(deger, `tohum ${tohum}`).toBeLessThan(orta)
      }
    }
  })

  it('kapalı çukurda merkez her yönden alçak', () => {
    for (const tohum of TOHUMLAR) {
      const { alan, merkez, yaricap } = yukseltiAlani({ tohum, zorluk: 'orta', sekil: 'cukur' })
      const orta = alan(...merkez)
      for (const deger of cevre(alan, merkez, yaricap * 0.75)) {
        expect(deger, `tohum ${tohum}`).toBeGreaterThan(orta)
      }
    }
  })

  /** Boyun bir eyer: iki yönde tırmanıyor, iki yönde iniyorsun. */
  it('boyunda iki yön yukarı iki yön aşağı', () => {
    for (const tohum of TOHUMLAR) {
      const { alan, merkez, yaricap } = yukseltiAlani({ tohum, zorluk: 'orta', sekil: 'boyun' })
      const orta = alan(...merkez)
      const degerler = cevre(alan, merkez, yaricap * 0.75)
      expect(degerler.filter((d) => d > orta).length, `tohum ${tohum}`).toBeGreaterThanOrEqual(2)
      expect(degerler.filter((d) => d < orta).length, `tohum ${tohum}`).toBeGreaterThanOrEqual(2)
    }
  })

  /*
    Vadi ile sırt aynı eksende ayrışıyor: eğime **dik** yönde vadi bir çukur,
    sırt bir tümsek. Eğim yönünde ikisi de iniyor — asıl ayrım burada değil.
  */
  it('vadi eğime dik yönde çukur, sırt tümsek', () => {
    for (const [sekil, artiyorMu] of [
      ['vadi', true],
      ['sirt', false],
    ] as const) {
      for (const tohum of TOHUMLAR) {
        const { alan, merkez, egim, yaricap } = yukseltiAlani({ tohum, zorluk: 'orta', sekil })
        const boy = Math.hypot(egim[0], egim[1])
        const dikX = -egim[1] / boy
        const dikY = egim[0] / boy
        const orta = alan(...merkez)
        const d = yaricap * 0.7
        for (const yon of [1, -1]) {
          const yan = alan(merkez[0] + dikX * d * yon, merkez[1] + dikY * d * yon)
          if (artiyorMu) expect(yan, `${sekil} ${tohum}`).toBeGreaterThan(orta)
          else expect(yan, `${sekil} ${tohum}`).toBeLessThan(orta)
        }
      }
    }
  })

  it('ada karadır ve çevresi denizdir', () => {
    for (const tohum of TOHUMLAR) {
      const { alan, merkez, yaricap } = yukseltiAlani({ tohum, zorluk: 'zor', sekil: 'ada' })
      expect(alan(...merkez), `tohum ${tohum}`).toBeGreaterThan(0)
      for (const deger of cevre(alan, merkez, yaricap * 0.9)) {
        expect(deger, `tohum ${tohum}`).toBeLessThan(0)
      }
    }
  })

  it('yarımada karadır, iki yanı denizdir', () => {
    for (const tohum of TOHUMLAR) {
      const { alan, merkez, yaricap } = yukseltiAlani({ tohum, zorluk: 'zor', sekil: 'yarimada' })
      expect(alan(...merkez), `tohum ${tohum}`).toBeGreaterThan(0)
      expect(alan(merkez[0] - yaricap * 0.8, merkez[1]), `tohum ${tohum}`).toBeLessThan(0)
      expect(alan(merkez[0] + yaricap * 0.8, merkez[1]), `tohum ${tohum}`).toBeLessThan(0)
    }
  })

  it('koy denizdir, iki yanı karadır', () => {
    for (const tohum of TOHUMLAR) {
      const { alan, merkez, yaricap } = yukseltiAlani({ tohum, zorluk: 'zor', sekil: 'koy' })
      expect(alan(...merkez), `tohum ${tohum}`).toBeLessThan(0)
      expect(alan(merkez[0] - yaricap * 1.2, merkez[1]), `tohum ${tohum}`).toBeGreaterThan(0)
      expect(alan(merkez[0] + yaricap * 1.2, merkez[1]), `tohum ${tohum}`).toBeGreaterThan(0)
    }
  })

  /*
    Platonun tanımı düzlük: halkanın içindeki yükselti farkı bir izohips
    aralığından küçük kalmalı, yoksa daire içinde eğri görünür ve soru "geniş
    düzlük" diye sorulmuş olmaz.
  */
  it('platonun halkası içinde tek bir izohips bile geçmiyor', () => {
    for (const tohum of TOHUMLAR) {
      const { alan, merkez, yaricap } = yukseltiAlani({ tohum, zorluk: 'zor', sekil: 'plato' })
      const degerler = [alan(...merkez), ...cevre(alan, merkez, yaricap * 0.85)]
      expect(Math.max(...degerler) - Math.min(...degerler), `tohum ${tohum}`).toBeLessThan(100)
    }
  })

  /*
    Eğim soruları kıyaslamalı: ölçü haritanın **en dik** yeri.

    Ortalamaya bakmak yanlış ölçüydü — haritanın çoğu düz olduğu için bir
    yamacın üstündeki her nokta ortalamanın üstünde kalıyor ve "yatık yamaç"
    sorusu ölçülemiyordu. Öğrencinin gözü de ortalamayı değil en sık geçen
    izohipsleri arıyor: dik yamaç o yer olmalı, yatık yamaç ondan belirgin
    biçimde uzak.
  */
  it('dik yamaç haritanın en dik yeri, yatık yamaç onun yarısından az', () => {
    for (const [sekil, dikMi] of [
      ['dik-yamac', true],
      ['yatik-yamac', false],
    ] as const) {
      for (const tohum of TOHUMLAR) {
        const { alan, merkez } = yukseltiAlani({ tohum, zorluk: 'zor', sekil })
        /*
          Tarama sık: dik yamacın geçiş kuşağı dar ve seyrek bir ızgara onu
          ıskalıyor. Iskalandığında "haritanın en diki" diye ölçülen sayı
          yamacın değil düz zeminin oluyor, test de olmayan bir hatayı
          gösteriyordu.
        */
        let enDik = 0
        for (let i = 1; i < 60; i++) {
          for (let j = 1; j < 60; j++) enDik = Math.max(enDik, egimBoyu(alan, i / 60, j / 60))
        }
        const merkezEgimi = egimBoyu(alan, ...merkez)
        if (dikMi) expect(merkezEgimi, `${sekil} ${tohum}`).toBeGreaterThan(enDik * 0.8)
        else expect(merkezEgimi, `${sekil} ${tohum}`).toBeLessThan(enDik * 0.5)
      }
    }
  })
})
