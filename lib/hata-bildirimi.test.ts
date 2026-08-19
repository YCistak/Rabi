import { describe, expect, it } from 'vitest'
import {
  GUNLUK_SINIR,
  KUYRUK_SINIRI,
  PARTI_BOYU,
  bekleyenSayisi,
  bildirimEkle,
  denemeArtir,
  formVerisi,
  gonderilecekler,
  gonderildiIsaretle,
  gunlukSayi,
  sebepGuncelle,
  sinirdaMi,
  type HataBildirimi,
} from './hata-bildirimi'
import type { BankaSorusu } from './oyunlar/banka'

const ses = (kelime: string): BankaSorusu => ({
  oyun: 'ses',
  kelime,
  olusum: `${kelime} + u`,
  olay: 'unluDusmesi',
})

const bolunme: BankaSorusu = { oyun: 'bolunme', sayi: 43828, bolen: 9, bolunmeTipi: 'kalan' }

const AN = new Date('2026-08-19T10:00:00.000Z')
const ERTESI = new Date('2026-08-20T10:00:00.000Z')

/** `adet` tane bildirimi arka arkaya ekler — sınır testleri için. */
function doldur(adet: number, simdi = AN): HataBildirimi[] {
  let liste: HataBildirimi[] = []
  for (let i = 0; i < adet; i++) liste = bildirimEkle(liste, ses(`kelime${i}`), 'belirtilmedi', simdi)
  return liste
}

describe('bildirimEkle', () => {
  it('soruyu bankanın alanlarından dolduruyor', () => {
    const [b] = bildirimEkle([], bolunme, 'cevap-yanlis', AN)
    expect(b.kimlik).toBe('bolunme:kalan:43828/9')
    expect(b.oyun).toBe('bolunme')
    expect(b.soruMetni).toBe('43828 ÷ 9 · kalan?')
    // 4+3+8+2+8 = 25, 25 mod 9 = 7
    expect(b.cevapMetni).toBe('7')
    expect(b.gonderildi).toBe(false)
  })

  it('aynı soru ikinci kez bildirilince yeni kayıt açmıyor', () => {
    const bir = bildirimEkle([], ses('burun'), 'belirtilmedi', AN)
    const iki = bildirimEkle(bir, ses('burun'), 'belirtilmedi', AN)
    expect(iki).toHaveLength(1)
  })

  it('aynı soru farklı sebeple gelirse sebebi güncelliyor', () => {
    const bir = bildirimEkle([], ses('burun'), 'belirtilmedi', AN)
    const iki = bildirimEkle(bir, ses('burun'), 'yazim', AN)
    expect(iki).toHaveLength(1)
    expect(iki[0].sebep).toBe('yazim')
  })

  it('günlük sınırda yeni kayıt eklemiyor', () => {
    const dolu = doldur(GUNLUK_SINIR)
    expect(dolu).toHaveLength(GUNLUK_SINIR)
    expect(sinirdaMi(dolu, AN)).toBe(true)
    const sonra = bildirimEkle(dolu, ses('fazladan'), 'belirtilmedi', AN)
    expect(sonra).toHaveLength(GUNLUK_SINIR)
    expect(sonra.some((b) => b.kimlik === 'ses:fazladan')).toBe(false)
  })

  it('ertesi gün sınır sıfırlanıyor', () => {
    const dolu = doldur(GUNLUK_SINIR)
    expect(sinirdaMi(dolu, ERTESI)).toBe(false)
    expect(gunlukSayi(dolu, ERTESI)).toBe(0)
    const sonra = bildirimEkle(dolu, ses('yeniGun'), 'belirtilmedi', ERTESI)
    expect(sonra).toHaveLength(GUNLUK_SINIR + 1)
  })

  it('kuyruk sınırında önce gönderilmiş kayıt düşüyor', () => {
    // Sınır dolmasın diye kayıtlar ayrı günlere yayılıyor.
    let liste: HataBildirimi[] = []
    for (let i = 0; i < KUYRUK_SINIRI; i++) {
      const tarih = new Date(AN.getTime() + i * 86_400_000)
      liste = bildirimEkle(liste, ses(`k${i}`), 'belirtilmedi', tarih)
    }
    // İlk kayıt gönderilmiş, ikinci hâlâ bekliyor.
    liste = gonderildiIsaretle(liste, ['ses:k0'])
    const tasan = bildirimEkle(liste, ses('sonuncu'), 'belirtilmedi', ERTESI)

    expect(tasan).toHaveLength(KUYRUK_SINIRI)
    expect(tasan.some((b) => b.kimlik === 'ses:k0')).toBe(false)
    expect(tasan.some((b) => b.kimlik === 'ses:k1')).toBe(true)
    expect(tasan.some((b) => b.kimlik === 'ses:sonuncu')).toBe(true)
  })
})

describe('sebepGuncelle', () => {
  it('gönderilmiş kaydı yeniden kuyruğa alıyor', () => {
    const bir = gonderildiIsaretle(bildirimEkle([], ses('burun'), 'belirtilmedi', AN), ['ses:burun'])
    expect(bir[0].gonderildi).toBe(true)

    const iki = sebepGuncelle(bir, 'ses:burun', 'cevap-yanlis')
    expect(iki[0].sebep).toBe('cevap-yanlis')
    expect(iki[0].gonderildi).toBe(false)
  })

  it('aynı sebep yeniden seçilirse kaydı kuyruğa geri atmıyor', () => {
    const bir = gonderildiIsaretle(bildirimEkle([], ses('burun'), 'yazim', AN), ['ses:burun'])
    const iki = sebepGuncelle(bir, 'ses:burun', 'yazim')
    expect(iki[0].gonderildi).toBe(true)
  })
})

describe('gonderilecekler', () => {
  it('gönderilmişleri atlıyor', () => {
    const liste = gonderildiIsaretle(doldur(3), ['ses:kelime0'])
    const sirada = gonderilecekler(liste)
    expect(sirada.map((b) => b.kimlik)).toEqual(['ses:kelime1', 'ses:kelime2'])
    expect(bekleyenSayisi(liste)).toBe(2)
  })

  it('parti boyunu aşmıyor', () => {
    const liste = doldur(GUNLUK_SINIR)
    expect(gonderilecekler(liste)).toHaveLength(PARTI_BOYU)
  })
})

describe('denemeArtir', () => {
  it('yalnızca verilen kimliklerin sayacını artırıyor', () => {
    const liste = denemeArtir(doldur(2), ['ses:kelime0'])
    expect(liste[0].denemeSayisi).toBe(1)
    expect(liste[1].denemeSayisi).toBe(0)
  })
})

describe('formVerisi', () => {
  it('yalnızca yedi alan gönderiyor', () => {
    const [b] = bildirimEkle([], bolunme, 'cevap-yanlis', AN)
    const veri = formVerisi(b, 'cihaz-1', '1.4.0')
    expect(Object.keys(veri).sort()).toEqual(
      ['cevap', 'cihaz', 'kimlik', 'oyun', 'sebep', 'soru', 'surum'].sort(),
    )
    expect(veri.sebep).toBe('Cevap yanlış')
    expect(veri.cihaz).toBe('cihaz-1')
    expect(veri.surum).toBe('1.4.0')
  })

  it('tarih ve deneme sayısı gönderilmiyor', () => {
    const [b] = bildirimEkle([], ses('burun'), 'belirtilmedi', AN)
    const veri = formVerisi(b, 'cihaz-1', '1.4.0')
    expect(Object.values(veri)).not.toContain(b.tarih)
    expect(veri).not.toHaveProperty('tarih')
  })
})
