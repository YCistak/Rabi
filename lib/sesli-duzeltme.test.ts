import { describe, expect, it } from 'vitest'
import { HAZIR_SABLONLAR, secilebilirSablonlar } from './sablonlar'
import { sayilariRakamaCevir, sesliMetniCoz, type SesliCozum, type SesliKip } from './sesli-giris'
import { BOS_BAGLAM, BOS_BIRIKIM, birikimeEkle, rabiCevabi, sonrakiBaglam } from './sesli-sohbet'

const SABLONLAR = secilebilirSablonlar(HAZIR_SABLONLAR, 12, null)

/** Mesajları gerçek pencere gibi sırayla işler. */
function konus(kip: SesliKip, ...mesajlar: string[]) {
  let birikim = BOS_BIRIKIM
  let baglam = BOS_BAGLAM
  let cozum: SesliCozum = { sorular: [], deneme: null, anlasilmayan: [] }
  let cevap: string[] = []
  mesajlar.forEach((metin, mesajSirasi) => {
    cozum = sesliMetniCoz(metin, {
      sablonlar: SABLONLAR, varsayilanSablonId: 'tyt', kip,
      baglam: { ...baglam, sorular: birikim.sorular },
    })
    cevap = rabiCevabi(cozum, { sablonlar: SABLONLAR, mesajSirasi, metin, kip })
    birikim = birikimeEkle(birikim, cozum)
    baglam = sonrakiBaglam(baglam, cozum)
  })
  return { birikim, cozum, cevap }
}
const sorular = (...m: string[]) =>
  konus('soru', ...m).birikim.sorular.map((s) => `${s.ders} ${s.toplam}/${s.dogru}/${s.yanlis}`).join(', ')
const deneme = (...m: string[]) => {
  const d = konus('deneme', ...m).birikim.deneme!
  return [
    ...d.dersler.map((x) => `${x.dersId} ${x.dogru}/${x.yanlis}`),
    ...(d.toplu ?? []).map((x) => `${x.grup}* ${x.dogru}/${x.yanlis}`),
    ...(d.toplamNet === null ? [] : [`net ${d.toplamNet}`]),
  ].join(', ')
}

describe('düzeltme sözü', () => {
  it.each([
    [['matematik 50', 'yok matematik 40 çözdüm'], 'Matematik 40/0/0'],
    [['matematik 50', 'pardon matematik 40 çözdüm'], 'Matematik 40/0/0'],
    [['matematik 50', 'pardon 40'], 'Matematik 40/0/0'],
    [['matematik 50', 'hayır yanlış söyledim 40 çözdüm'], 'Matematik 40/0/0'],
    [['matematik 50 soru 30 doğru 10 yanlış', 'pardon matematik 45'], 'Matematik 45/30/10'],
    [['matematik 50 soru 30 doğru 10 yanlış', 'pardon 35 doğru 10 yanlış'], 'Matematik 50/35/10'],
    [['matematik 50 fizik 20', 'pardon fizik 30'], 'Matematik 50/0/0, Fizik 30/0/0'],
    // Düzeltme sözü yoksa toplanır.
    [['20 matematik', '20 matematik'], 'Matematik 40/0/0'],
    [['20 matematik', 'yok bir de 20 matematik çözdüm'], 'Matematik 40/0/0'],
    [['20 matematik', 'yok 20 matematik daha çözdüm'], 'Matematik 40/0/0'],
    // İki ders birden söylenmişse "pardon 40" hangisi belli değil.
    [['matematik 50 fizik 20', 'pardon 40'], 'Matematik 50/0/0, Fizik 20/0/0'],
  ])('%j → %s', (m, b) => expect(sorular(...m)).toBe(b))

  it.each([
    ['40 pardon 50 matematik çözdüm', 'Matematik 50/0/0'],
    ['matematik 40 pardon 50', 'Matematik 50/0/0'],
    ['matematikten 40 soru çözdüm yok 50 soru çözdüm', 'Matematik 50/0/0'],
    ['matematik 50 pardon matematik 40 çözdüm', 'Matematik 40/0/0'],
    ['50 matematik pardon 40 matematik çözdüm', 'Matematik 40/0/0'],
    ['matematik kırk pardon elli fizik yirmi', 'Matematik 50/0/0, Fizik 20/0/0'],
    ['fizik 20 matematik 40 pardon 50', 'Matematik 50/0/0, Fizik 20/0/0'],
    ['tarih 15 doğru 2 yanlış boşum yok 20 fizik', 'Fizik 20/0/0, Tarih 17/15/2'],
    ['matematik 40 yok fizik 20', 'Matematik 40/0/0, Fizik 20/0/0'],
    ['matematik 9 doğru pardon 10 doğru 5 yanlış', 'Matematik 15/10/5'],
    ['matematik 9 doğru pardon 10 5 yanlış', 'Matematik 15/10/5'],
    ['matematikten 20 soru çözdüm yanlışım yok 10 fizik', 'Matematik 20/20/0, Fizik 10/0/0'],
  ])('cümle içi: %s → %s', (m, b) => expect(sorular(m)).toBe(b))

  it.each(['matematik 40 pardon 50 fizik', 'matematik 40 pardon fizik 50', 'matematik 30 doğru pardon 5 yanlış'])(
    'belirsiz düzeltme uydurulmaz: %s',
    (m) => {
      const { cozum } = konus('soru', m)
      expect(cozum.sorular).toEqual([])
      expect(cozum.anlasilmayan).toEqual([m])
    },
  )

  it('deneme kipinde cümle içi düzeltme ve sonraki mesaj eskisinin yerine geçer', () => {
    expect(deneme('türkçe 32 pardon 33 doğru 6 yanlış')).toBe('turkce 33/6')
    expect(deneme('türkçe 32 doğru 6 yanlış', 'pardon türkçe 30 doğru 5 yanlış')).toBe('turkce 30/5')
  })
})

describe('önceki mesajın bağlamı', () => {
  it.each([
    [['matematikten 40 soru çözdüm', '30 doğru 10 yanlış'], 'Matematik 40/30/10'],
    [['matematikten 40 soru çözdüm', 'matematikten 30 doğru 10 yanlış'], 'Matematik 40/30/10'],
    [['matematikten 40 soru çözdüm', '5 yanlış'], 'Matematik 40/35/5'],
    [['matematikten 40 soru çözdüm', 'tamam', '30 doğru 10 yanlış'], 'Matematik 40/30/10'],
    [['matematikten', '40 soru çözdüm'], 'Matematik 40/0/0'],
    [['matematikten', '40'], 'Matematik 40/0/0'],
    [['matematikten', 'kırk soru çözdüm', '30 doğru 10 yanlış'], 'Matematik 40/30/10'],
    [['fenden 40 soru çözdüm', 'fizik'], 'Fizik 40/0/0'],
    [['sosyalden 20 soru çözdüm 15 doğru 5 yanlış', 'tarihten'], 'Tarih 20/15/5'],
    // Sonucu zaten var: ikinci sonuç yeni kayıttır.
    [['matematik 30 doğru 10 yanlış', 'matematik 5 doğru 5 yanlış'], 'Matematik 50/35/15'],
    // Belirsizler yazılmaz.
    [['matematik 40 fizik 20', '30 doğru 10 yanlış'], 'Matematik 40/0/0, Fizik 20/0/0'],
    [['matematikten 40 soru çözdüm', '60 doğru 10 yanlış'], 'Matematik 40/0/0'],
    [['matematikten 40 soru çözdüm', '20 soru çözdüm'], 'Matematik 40/0/0'],
    [['fenden 40 soru çözdüm', 'türkçe'], ''],
  ])('%j → %s', (m, b) => expect(sorular(...m)).toBe(b))

  it('sayısız ders ve grup için Rabi sorar', () => {
    expect(konus('soru', 'matematikten').cevap).toEqual(['Matematik için kaç soru çözdün?'])
    expect(konus('soru', 'fenden 40 soru çözdüm').cevap).toEqual(['Fen derslerinden hangisi olduğunu söyler misin?'])
    expect(konus('deneme', 'türkçe').cevap).toEqual(['Türkçe için doğru ve yanlış sayısını söyler misin?'])
  })

  it('deneme kipinde sorulan ders ve grup cevaplanır', () => {
    expect(deneme('türkçe', '32 doğru 6 yanlış')).toBe('turkce 32/6')
    expect(deneme('sosyalden 12 net', '15 doğru 2 yanlış')).toBe('sosyal* 15/2')
  })

  it('sonuç bağlanınca hedef sayısı ikinci kez sayılmaz', () => {
    const { cozum } = konus('soru', 'matematikten 40 soru çözdüm', '30 doğru 10 yanlış')
    const cevap = rabiCevabi(cozum, { sablonlar: SABLONLAR, mesajSirasi: 1, hedefeKalan: 20 })
    expect(cevap[0]).not.toContain('hedefin tamam')
  })
})

describe('söyleyiş sırası', () => {
  it.each([
    ['32 doğru 6 yanlış türkçe, 25 doğru 5 yanlış matematik', 'turkce 32/6, matematik 25/5'],
    ['32 doğru 6 yanlış türkçe', 'turkce 32/6'],
    ['15 doğru 2 yanlış sosyal, 10 doğru 3 yanlış fen', 'sosyal* 15/2, fen* 10/3'],
    ['türkçe doğru 32 yanlış 6', 'turkce 32/6'],
    ['türkçe doğru 32 yanlış 6 matematik doğru 25 yanlış 5', 'turkce 32/6, matematik 25/5'],
    ['türkçe 32 doğru 6 yanlış matematik 25 doğru 5 yanlış', 'turkce 32/6, matematik 25/5'],
    ['türkçe 35 net matematik 30 net', ''],
    ['toplam 87 net', 'net 87'],
    ['tyt 87 net türkçe 33 doğru 4 yanlış', 'turkce 33/4, net 87'],
    ['türkçe 33 doğru 4 yanlış 32 net matematik 20 doğru 4 yanlış 19 net', 'turkce 33/4, matematik 20/4'],
    ['türkçe 32 doğru 6 yanlış 2 boş matematik 25 doğru 5 yanlış', 'turkce 32/6, matematik 25/5'],
    ['tarih 1 doğru 2 yanlış 1', ''],
    ["türkçe 20'de 15", ''],
    ['türkçe 33 doğru 4 yanlış toplam 85 net', 'turkce 33/4, net 85'],
    ['tarih 2 doğru 1 yanlış', 'tarih 2/1'],
    ['coğrafya 2 doğru 3 yanlış', 'cografya 2/3'],
    ['türkçe otuz beşe beş', 'turkce 35/5'],
    ['türkçe hepsi yanlış', 'turkce 0/40'],
    ['türkçe 5 yanlış gerisi doğru', 'turkce 35/5'],
  ])('deneme: %s → %s', (m, b) => expect(deneme(m)).toBe(b))

  it.each([
    ['32 doğru 6 yanlış türkçe, 25 doğru 5 yanlış matematik', 'Türkçe 38/32/6, Matematik 30/25/5'],
    ['türkçe doğru 32 yanlış 6', 'Türkçe 38/32/6'],
    ['tarih 2 doğru 1 yanlış', 'Tarih 3/2/1'],
    ['coğrafya 2 soru çözdüm', 'Coğrafya 2/0/0'],
    ['matematikten 40 soru çözdüm hepsi yanlış', 'Matematik 40/0/40'],
    ['matematikten 40 soru çözdüm 5 yanlış gerisi doğru', 'Matematik 40/35/5'],
    ['matematik 40 çözdüm 5 yanlış gerisi doğru fizik 20 çözdüm', 'Matematik 40/35/5, Fizik 20/0/0'],
    ['matematik 40 çözdüm 30 doğru gerisi yanlış', 'Matematik 40/30/10'],
    ['kırkbeş matematik çözdüm', 'Matematik 45/0/0'],
    ['yüzelli matematik çözdüm', 'Matematik 150/0/0'],
  ])('soru: %s → %s', (m, b) => expect(sorular(m)).toBe(b))

  it('AYT Sözelde "tarih 2" dersi sayı verilince hâlâ tanınır', () => {
    const sozel = SABLONLAR.find((s) => s.dersler.some((d) => d.id === 'tarih2'))!
    const d = sesliMetniCoz('tarih 2 5 doğru 1 yanlış', { sablonlar: SABLONLAR, varsayilanSablonId: sozel.id, kip: 'deneme' })
    expect(d.deneme!.dersler).toEqual([{ dersId: 'tarih2', dogru: 5, yanlis: 1 }])
  })
})

describe('yazıyla sayı', () => {
  it.each([
    ['otuz beşe beş', "35'e 5"],
    ['kırka beş', "40'a 5"],
    ['kırkbeş', '45'],
    ['yüzelli', '150'],
    ['yüz ellibeş', '155'],
    ['yüzyirmibeş soru', '125 soru'],
    ['ona beş soru anlattım', 'ona 5 soru anlattım'],
    ['beşe kadar', 'beşe kadar'],
    ['onun', 'onun'],
    ['yüzünden', 'yüzünden'],
    ['altın', 'altın'],
  ])('%s → %s', (m, b) => expect(sayilariRakamaCevir(m)).toBe(b))
})
