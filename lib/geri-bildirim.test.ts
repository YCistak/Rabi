import { describe, expect, it } from 'vitest'
import {
  GUNLUK_SINIR,
  KUYRUK_SINIRI,
  METIN_EN_AZ,
  METIN_EN_COK,
  bekleyenSayisi,
  denemeArtir,
  geriBildirimEkle,
  geriBildirimFormVerisi,
  gonderildiIsaretle,
  gonderilecekler,
  metinSorunu,
  sinirdaMi,
  TURLER,
  type GeriBildirim,
} from './geri-bildirim'

const AN = new Date('2026-09-12T10:00:00.000Z')
const ERTESI = new Date('2026-09-13T10:00:00.000Z')
const METIN = 'Pomodoro bitince ses çok yüksek geliyor.'

function doldur(adet: number, simdi = AN): GeriBildirim[] {
  let liste: GeriBildirim[] = []
  for (let i = 0; i < adet; i++) {
    // Farklı günlere yayılıyor ki günlük sınıra takılmasın.
    const gun = new Date(simdi.getTime() - i * 86_400_000)
    liste = geriBildirimEkle(liste, 'oneri', `${METIN} ${i}`, gun)
  }
  return liste
}

describe('metinSorunu', () => {
  it('kısa metni reddediyor, boşluk saymıyor', () => {
    expect(metinSorunu('iyi')).not.toBeNull()
    expect(metinSorunu('   '.padEnd(METIN_EN_AZ + 5))).not.toBeNull()
  })

  it('sınırların içindeki metne sorun bulmuyor', () => {
    expect(metinSorunu(METIN)).toBeNull()
    expect(metinSorunu('a'.repeat(METIN_EN_COK))).toBeNull()
    expect(metinSorunu('a'.repeat(METIN_EN_COK + 1))).not.toBeNull()
  })
})

describe('geriBildirimEkle', () => {
  it('metni kırpıp beklemeye alıyor', () => {
    const [b] = geriBildirimEkle([], 'hata', `  ${METIN}  `, AN)
    expect(b.metin).toBe(METIN)
    expect(b.tur).toBe('hata')
    expect(b.gonderildi).toBe(false)
    expect(b.denemeSayisi).toBe(0)
    expect(b.tarih).toBe(AN.toISOString())
  })

  it('geçersiz metinde listeyi değiştirmiyor', () => {
    const liste = geriBildirimEkle([], 'oneri', 'kısa', AN)
    expect(liste).toHaveLength(0)
  })

  it('günlük sınırda yeni kayıt açmıyor, ertesi gün açıyor', () => {
    let liste: GeriBildirim[] = []
    for (let i = 0; i < GUNLUK_SINIR; i++) liste = geriBildirimEkle(liste, 'oneri', `${METIN} ${i}`, AN)
    expect(sinirdaMi(liste, AN)).toBe(true)
    expect(geriBildirimEkle(liste, 'oneri', METIN, AN)).toHaveLength(GUNLUK_SINIR)
    expect(geriBildirimEkle(liste, 'oneri', METIN, ERTESI)).toHaveLength(GUNLUK_SINIR + 1)
  })

  it('kuyruk taşınca önce gönderilmişleri düşürüyor', () => {
    let liste = doldur(KUYRUK_SINIRI)
    liste = gonderildiIsaretle(liste, [liste[0].kimlik])
    const gonderilmis = liste[0].kimlik
    const yeni = geriBildirimEkle(liste, 'baska', METIN, ERTESI)
    expect(yeni).toHaveLength(KUYRUK_SINIRI)
    expect(yeni.some((b) => b.kimlik === gonderilmis)).toBe(false)
    expect(yeni.filter((b) => !b.gonderildi)).toHaveLength(KUYRUK_SINIRI)
  })

  it('hepsi bekliyorsa en eskisi düşüyor', () => {
    const liste = doldur(KUYRUK_SINIRI)
    const enEski = liste[0].kimlik
    const yeni = geriBildirimEkle(liste, 'baska', METIN, ERTESI)
    expect(yeni).toHaveLength(KUYRUK_SINIRI)
    expect(yeni.some((b) => b.kimlik === enEski)).toBe(false)
  })
})

describe('gönderim işaretleri', () => {
  it('gönderilen kuyruktan düşüyor, başarısız sayacı artıyor', () => {
    const liste = doldur(3)
    const [a, b] = liste
    const sonra = denemeArtir(gonderildiIsaretle(liste, [a.kimlik]), [b.kimlik])
    expect(gonderilecekler(sonra).map((x) => x.kimlik)).not.toContain(a.kimlik)
    expect(bekleyenSayisi(sonra)).toBe(2)
    expect(sonra.find((x) => x.kimlik === b.kimlik)?.denemeSayisi).toBe(1)
  })
})

describe('geriBildirimFormVerisi', () => {
  it('yalnızca beş alan gönderiyor', () => {
    const [b] = geriBildirimEkle([], 'oneri', METIN, AN)
    const veri = geriBildirimFormVerisi(b, 'Samsung SM-A536B (mavi-tavsan-42)', '0.7.0 (12)')
    expect(Object.keys(veri).sort()).toEqual(['cihaz', 'metin', 'surum', 'tarih', 'tur'])
    expect(veri.tur).toBe('Öneri')
    expect(veri.metin).toBe(METIN)
  })
})

describe('baska türü kaldırıldı', () => {
  it('ekranda yalnız öneri ve hata seçilebiliyor', () => {
    expect(TURLER).toEqual(['oneri', 'hata'])
  })

  it('kuyruktaki eski baska kaydı hâlâ geçerli forma çevriliyor', () => {
    const eski: GeriBildirim = {
      kimlik: 'eski-1',
      tur: 'baska',
      metin: METIN,
      tarih: AN.toISOString(),
      gonderildi: false,
      denemeSayisi: 2,
    }
    expect(gonderilecekler([eski])).toHaveLength(1)
    expect(geriBildirimFormVerisi(eski, 'Pixel 7', '1.0.0').tur).toBe('Başka')
    expect(gonderildiIsaretle([eski], ['eski-1'])[0].gonderildi).toBe(true)
  })

  it('bilinmeyen türlü kayıt da çökmeden Başka olarak gidiyor', () => {
    const bozuk = { kimlik: 'x', tur: 'yok', metin: METIN, tarih: AN.toISOString(), gonderildi: false, denemeSayisi: 0 } as unknown as GeriBildirim
    expect(geriBildirimFormVerisi(bozuk, 'c', 's').tur).toBe('Başka')
  })
})
