import { describe, expect, it } from 'vitest'
import {
  ACI_ACIKLAMASI,
  ACI_KURALI_ADI,
  TUM_ACI_KURALLARI,
  aciCevabi,
  aciSekli,
  aciTuruHazirla,
  type AciKurali,
  type AciSorusu,
} from './aci'
import { TUVAL_GENISLIK, TUVAL_YUKSEKLIK, type Sekil, type SekilParcasi } from './sekil'

/**
 * Testin asıl işi: **şekil ile sayı ayrışmasın**.
 *
 * Soru üreteci cevabı kendi hesaplıyor, oyuncu ise şekle bakıyor. Şekildeki yay
 * gerçekte 40 derecelik açıyı gösterirken yanına "55°" yazılırsa oyun sessizce
 * çözülemez bir soru sorar. Aşağıdaki testler yayların açıklığını ölçüp
 * etiketiyle karşılaştırıyor; üçgenlerde yay tamamen koordinatlardan
 * hesaplandığı için bu aynı zamanda çizimin doğruluğunu da ölçüyor.
 */
function yayEtiketleri(sekil: Sekil): { aciklik: number; metin: string; vurgu: boolean }[] {
  const cikti: { aciklik: number; metin: string; vurgu: boolean }[] = []
  sekil.parcalar.forEach((parca, sira) => {
    if (parca.tur !== 'yay') return
    const etiket = sekil.parcalar[sira + 1]
    if (etiket?.tur !== 'yazi') throw new Error('yayın etiketi yok')
    cikti.push({
      aciklik: parca.son - parca.ilk,
      metin: etiket.metin,
      vurgu: etiket.vurgu === true,
    })
  })
  return cikti
}

/** Parçanın tuvalde kapladığı noktalar — taşma denetimi için. */
function noktalar(parca: SekilParcasi): { x: number; y: number }[] {
  switch (parca.tur) {
    case 'cizgi':
      return [parca.bas, parca.son]
    case 'yay':
      return [
        { x: parca.merkez.x - parca.yaricap, y: parca.merkez.y - parca.yaricap },
        { x: parca.merkez.x + parca.yaricap, y: parca.merkez.y + parca.yaricap },
      ]
    case 'dikAci':
      return [parca.kose]
    case 'tik':
      return [parca.orta]
    case 'yazi':
      return [parca.konum]
  }
}

const bolSoru = (adet = 600): AciSorusu[] => aciTuruHazirla(adet)

describe('aciTuruHazirla', () => {
  it('istenen kadar soru üretir', () => {
    expect(aciTuruHazirla(40)).toHaveLength(40)
  })

  it('cevap kuralın gerektirdiği hesapla aynı', () => {
    for (const soru of bolSoru()) {
      expect(aciCevabi(soru.kural, soru.a, soru.b), JSON.stringify(soru)).toBe(soru.cevap)
    }
  })

  it('bütün açılar tam sayı ve şekilde okunabilir aralıkta', () => {
    for (const soru of bolSoru()) {
      const acilar = [soru.a, soru.cevap, ...(soru.b === null ? [] : [soru.b])]
      for (const aci of acilar) {
        expect(Number.isInteger(aci), JSON.stringify(soru)).toBe(true)
        expect(aci, JSON.stringify(soru)).toBeGreaterThanOrEqual(15)
        expect(aci, JSON.stringify(soru)).toBeLessThanOrEqual(165)
      }
    }
  })

  it('her kural bir süre sonra çıkıyor', () => {
    const cikanlar = new Set(bolSoru().map((s) => s.kural))
    for (const kural of TUM_ACI_KURALLARI) expect(cikanlar).toContain(kural)
  })

  it('her kuralın adı ve açıklaması var', () => {
    for (const kural of TUM_ACI_KURALLARI) {
      expect(ACI_KURALI_ADI[kural]).toBeTruthy()
      expect(ACI_ACIKLAMASI[kural]).toBeTruthy()
    }
  })
})

describe('aciSekli', () => {
  it('tek bir x var ve yayı tam cevap kadar açık', () => {
    for (const soru of bolSoru(300)) {
      const aranan = yayEtiketleri(aciSekli(soru)).filter((e) => e.metin === 'x')
      expect(aranan, JSON.stringify(soru)).toHaveLength(1)
      expect(aranan[0].vurgu).toBe(true)
      expect(aranan[0].aciklik, JSON.stringify(soru)).toBeCloseTo(soru.cevap, 1)
    }
  })

  it('yazan her açı, yayının gerçek açıklığı kadar', () => {
    for (const soru of bolSoru(300)) {
      for (const etiket of yayEtiketleri(aciSekli(soru))) {
        if (etiket.metin === 'x') continue
        const yazan = Number(etiket.metin.replace('°', ''))
        expect(yazan, `${JSON.stringify(soru)} · ${etiket.metin}`).toBeCloseTo(etiket.aciklik, 1)
      }
    }
  })

  it('verilen açılar şekilde eksiksiz yazıyor', () => {
    for (const soru of bolSoru(300)) {
      const yazanlar = yayEtiketleri(aciSekli(soru))
        .filter((e) => e.metin !== 'x')
        .map((e) => Number(e.metin.replace('°', '')))
      // İkizkenarda verilen tek açı ya tepe ya taban; ötekini oyuncu bulacak.
      const beklenen = soru.b === null ? 1 : 2
      expect(yazanlar, JSON.stringify(soru)).toHaveLength(beklenen)
      expect(yazanlar.some((y) => y === soru.a || y === soru.cevap)).toBe(true)
    }
  })

  it('hiçbir parça tuvalin dışına taşmıyor', () => {
    for (const soru of bolSoru(300)) {
      const sekil = aciSekli(soru)
      for (const parca of sekil.parcalar) {
        for (const nokta of noktalar(parca)) {
          expect(nokta.x, `${JSON.stringify(soru)} · x=${nokta.x}`).toBeGreaterThanOrEqual(0)
          expect(nokta.x, JSON.stringify(soru)).toBeLessThanOrEqual(TUVAL_GENISLIK)
          expect(nokta.y, `${JSON.stringify(soru)} · y=${nokta.y}`).toBeGreaterThanOrEqual(0)
          expect(nokta.y, JSON.stringify(soru)).toBeLessThanOrEqual(TUVAL_YUKSEKLIK)
        }
      }
    }
  })

  it('paralel kurallarında iki paralel doğru da çiziliyor', () => {
    for (const kural of ['z', 'u', 'm'] as AciKurali[]) {
      const soru: AciSorusu = {
        kural,
        a: 40,
        b: kural === 'm' ? 35 : null,
        cevap: aciCevabi(kural, 40, kural === 'm' ? 35 : null),
      }
      const yataylar = aciSekli(soru).parcalar.filter(
        (p) => p.tur === 'cizgi' && p.bas.y === p.son.y,
      )
      expect(yataylar.length, kural).toBeGreaterThanOrEqual(2)
    }
  })
})
