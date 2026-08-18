import { describe, expect, it } from 'vitest'
import {
  TUM_UCGEN_TURLERI,
  UCGEN_ACIKLAMASI,
  UCGEN_ADI,
  kenarDegeri,
  kenarEsit,
  kenarMetni,
  ucgenAcilari,
  ucgenCevabi,
  ucgenSekli,
  ucgenSiklari,
  ucgenTuruHazirla,
  type UcgenKenari,
  type UcgenSorusu,
} from './ucgen'
import { TUVAL_GENISLIK, TUVAL_YUKSEKLIK } from './sekil'

const bolSoru = (adet = 600): UcgenSorusu[] => ucgenTuruHazirla(adet)

/** Şekilde yazan etiketler; yay etiketleri (açılar) hariç. */
function kenarYazilari(soru: UcgenSorusu): string[] {
  const parcalar = ucgenSekli(soru).parcalar
  return parcalar
    .filter((parca, sira) => parca.tur === 'yazi' && parcalar[sira - 1]?.tur !== 'yay')
    .map((parca) => (parca.tur === 'yazi' ? parca.metin : ''))
}

describe('kenarMetni', () => {
  it('köklü kenarı sınavdaki gibi yazar', () => {
    expect(kenarMetni({ kat: 5, kok: 1 })).toBe('5')
    expect(kenarMetni({ kat: 5, kok: 2 })).toBe('5√2')
    expect(kenarMetni({ kat: 1, kok: 3 })).toBe('√3')
  })
})

describe('ucgenTuruHazirla', () => {
  it('istenen kadar soru üretir', () => {
    expect(ucgenTuruHazirla(40)).toHaveLength(40)
  })

  /*
    Oyunun tek doğruluk şartı: üçgen gerçekten dik üçgen olacak. Kenarlar elle
    değil oranlardan kuruluyor ama bir katsayı hatası (2a yerine 3a) sessizce
    çözülemez bir soru üretirdi.
  */
  it('her soruda Pisagor bağıntısı sağlanıyor', () => {
    for (const soru of bolSoru()) {
      const dikey = kenarDegeri(soru.dikey)
      const yatay = kenarDegeri(soru.yatay)
      const hipotenus = kenarDegeri(soru.hipotenus)
      expect(dikey ** 2 + yatay ** 2, JSON.stringify(soru)).toBeCloseTo(hipotenus ** 2, 6)
    }
  })

  it('hipotenüs her zaman en uzun kenar', () => {
    for (const soru of bolSoru()) {
      const hipotenus = kenarDegeri(soru.hipotenus)
      expect(hipotenus, JSON.stringify(soru)).toBeGreaterThan(kenarDegeri(soru.dikey))
      expect(hipotenus, JSON.stringify(soru)).toBeGreaterThan(kenarDegeri(soru.yatay))
    }
  })

  it('çeldirici ne doğru cevaba ne de şekilde yazan bir kenara eşit', () => {
    for (const soru of bolSoru()) {
      const dogru = ucgenCevabi(soru)
      expect(kenarEsit(soru.celdirici, dogru), JSON.stringify(soru)).toBe(false)

      const gorunenler = (['dikey', 'yatay', 'hipotenus'] as UcgenKenari[])
        .filter((kenar) => kenar !== soru.bilinmeyen && kenar !== soru.gizli)
        .map((kenar) => soru[kenar])
      for (const gorunen of gorunenler) {
        expect(kenarEsit(soru.celdirici, gorunen), JSON.stringify(soru)).toBe(false)
      }
    }
  })

  it('gizli kenar yalnızca ikizkenar dik üçgende ve yalnızca dik kenarda', () => {
    for (const soru of bolSoru()) {
      if (soru.gizli === null) continue
      expect(soru.tur).toBe('kirkbes')
      expect(soru.gizli).not.toBe('hipotenus')
      expect(soru.gizli).not.toBe(soru.bilinmeyen)
    }
  })

  it('her tür bir süre sonra çıkıyor ve adı, açıklaması var', () => {
    const cikanlar = new Set(bolSoru().map((s) => s.tur))
    for (const tur of TUM_UCGEN_TURLERI) {
      expect(cikanlar).toContain(tur)
      expect(UCGEN_ADI[tur]).toBeTruthy()
      expect(UCGEN_ACIKLAMASI[tur]).toBeTruthy()
    }
  })
})

describe('ucgenAcilari', () => {
  it('30° her zaman en kısa kenarın karşısında', () => {
    for (const soru of bolSoru()) {
      const acilar = ucgenAcilari(soru)
      if (soru.tur === 'pisagor') {
        expect(acilar).toBeNull()
        continue
      }
      if (acilar === null) throw new Error('özel üçgende açı yok')
      if (soru.tur === 'kirkbes') {
        expect(acilar).toEqual({ dikeyUcu: 45, yatayUcu: 45 })
        continue
      }
      // Dikey ucundaki açı yatay kenarı, yatay ucundaki açı dikey kenarı görür.
      const kisaDikey = kenarDegeri(soru.dikey) < kenarDegeri(soru.yatay)
      expect(kisaDikey ? acilar.yatayUcu : acilar.dikeyUcu, JSON.stringify(soru)).toBe(30)
    }
  })
})

describe('ucgenSiklari', () => {
  it('iki şıktan biri doğru cevap, öteki çeldirici', () => {
    for (const soru of bolSoru(200)) {
      const siklar = ucgenSiklari(soru, () => 0.9)
      expect(siklar).toHaveLength(2)
      expect(siklar.filter((s) => kenarEsit(s, ucgenCevabi(soru)))).toHaveLength(1)
      expect(siklar.filter((s) => kenarEsit(s, soru.celdirici))).toHaveLength(1)
    }
  })

  it('doğru şık her iki tarafa da düşebiliyor', () => {
    const soru = ucgenTuruHazirla(1)[0]
    expect(ucgenSiklari(soru, () => 0.2)[0]).toEqual(ucgenCevabi(soru))
    expect(ucgenSiklari(soru, () => 0.8)[1]).toEqual(ucgenCevabi(soru))
  })
})

describe('ucgenSekli', () => {
  it('kenar oranları gerçek uzunluklarla aynı — şekil ölçekli', () => {
    for (const soru of bolSoru(200)) {
      const parcalar = ucgenSekli(soru).parcalar
      const cizgiler = parcalar.filter((p) => p.tur === 'cizgi')
      const [taban, dikKenar] = cizgiler
      if (taban.tur !== 'cizgi' || dikKenar.tur !== 'cizgi') throw new Error('kenar yok')

      const cizilenYatay = Math.abs(taban.son.x - taban.bas.x)
      const cizilenDikey = Math.abs(dikKenar.son.y - dikKenar.bas.y)
      expect(cizilenYatay / cizilenDikey, JSON.stringify(soru)).toBeCloseTo(
        kenarDegeri(soru.yatay) / kenarDegeri(soru.dikey),
        4,
      )
    }
  })

  it('dik açı işareti var ve tuvalden taşma yok', () => {
    for (const soru of bolSoru(200)) {
      const sekil = ucgenSekli(soru)
      expect(sekil.parcalar.some((p) => p.tur === 'dikAci')).toBe(true)
      for (const parca of sekil.parcalar) {
        if (parca.tur !== 'yazi') continue
        expect(parca.konum.x, JSON.stringify(soru)).toBeGreaterThanOrEqual(0)
        expect(parca.konum.x, JSON.stringify(soru)).toBeLessThanOrEqual(TUVAL_GENISLIK)
        expect(parca.konum.y, JSON.stringify(soru)).toBeGreaterThanOrEqual(0)
        expect(parca.konum.y, JSON.stringify(soru)).toBeLessThanOrEqual(TUVAL_YUKSEKLIK)
      }
    }
  })

  it('bir kenarda x yazıyor, gizli kenarda hiçbir şey yazmıyor', () => {
    for (const soru of bolSoru(200)) {
      const yazilar = kenarYazilari(soru)
      expect(yazilar.filter((y) => y === 'x'), JSON.stringify(soru)).toHaveLength(1)
      expect(yazilar, JSON.stringify(soru)).toHaveLength(soru.gizli === null ? 3 : 2)
      for (const kenar of ['dikey', 'yatay', 'hipotenus'] as UcgenKenari[]) {
        if (kenar === soru.bilinmeyen || kenar === soru.gizli) continue
        expect(yazilar, JSON.stringify(soru)).toContain(kenarMetni(soru[kenar]))
      }
    }
  })

  it('eş kenar çentiği yalnızca gizli kenar varken çiziliyor', () => {
    for (const soru of bolSoru(200)) {
      const tikVar = ucgenSekli(soru).parcalar.some((p) => p.tur === 'tik')
      expect(tikVar, JSON.stringify(soru)).toBe(soru.gizli !== null)
    }
  })
})
