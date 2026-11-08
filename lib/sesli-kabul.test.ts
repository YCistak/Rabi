/**
 * Kabul testleri: Emre'nin uygulamada gerçekten yazdığı/söylediği cümleler
 * (2026-11-08 ekran görüntüleri), birebir yazımlarıyla. Beklentiler KESİNDİR;
 * çözücü bunlara uyar, bu dosyadaki beklenti değiştirilmez (operatör yazdı).
 *
 * 2026-11-08 karar (Emre): iki ayrı sohbet kipi.
 * - 'soru'   → Soru Takibi'ndeki "Rabi'ye anlat": yalnız günlük soru; deneme
 *              söylenirse kaydedilmez, Rabi Denemeler'e yönlendirir (yanlisYer: 'deneme').
 * - 'deneme' → Denemeler'deki "Rabi'ye anlat": tür önce seçilir (sabit şablon);
 *              yalnız deneme sonucu; günlük soru söylenirse reddedilir (yanlisYer: 'soru').
 */
import { describe, expect, it } from 'vitest'
import { HAZIR_SABLONLAR, secilebilirSablonlar } from './sablonlar'
import { sesliMetniCoz, type SesliKip } from './sesli-giris'
import { rabiCevabi } from './sesli-sohbet'
import type { Sablon } from './types'

const sablonlar: Sablon[] = secilebilirSablonlar(HAZIR_SABLONLAR, 12, null)
const coz = (metin: string, kip: SesliKip = 'soru', sablonId = 'tyt') =>
  sesliMetniCoz(metin, { sablonlar, varsayilanSablonId: sablonId, kip })
const cevap = (metin: string, kip: SesliKip = 'soru', sablonId = 'tyt') =>
  rabiCevabi(coz(metin, kip, sablonId), { sablonlar, mesajSirasi: 0, hedefeKalan: null, metin, kip }).join(' ')

describe('kabul — soru kipi (Soru Takibi)', () => {
  it('selam + günlük soru + DERS sorularının + kalanları ise boştu', () => {
    const metin =
      "Merhaba abi  bugün 50 tane matematik sorusu çözdüm  matematik sorularının 20'si doğru 10 tanesi yanlış kalanları ise boştu"
    const c = coz(metin)
    expect(c.sorular).toEqual([{ ders: 'Matematik', toplam: 50, dogru: 20, yanlis: 10 }])
    expect(c.deneme).toBeNull()
    expect(c.anlasilmayan).toEqual([])
    const r = cevap(metin)
    expect(r).toMatch(/^Merhaba/)
    expect(r).not.toMatch(/anlayamadım/)
  })

  it('yalnız selam: anlayamadım denmez', () => {
    expect(coz('Merhaba').anlasilmayan).toEqual([])
    expect(cevap('Merhaba')).not.toMatch(/anlayamadım/)
  })

  it('hiç çözmedim: anlayamadım denmez', () => {
    const c = coz('Bugün hiç soru çözmedim')
    expect(c.sorular).toEqual([])
    expect(c.anlasilmayan).toEqual([])
    expect(cevap('Bugün hiç soru çözmedim')).not.toMatch(/anlayamadım/)
  })

  it('teşekkür niyeti: "Ben buradayım" değil, teşekküre karşılık', () => {
    for (const m of ['teşekkürler', 'Teşekkürler', 'teşekkür ederim', 'sağ ol', 'sağol', 'eyvallah']) {
      for (let sira = 0; sira < 5; sira++) {
        const r = rabiCevabi(coz(m), { sablonlar, mesajSirasi: sira, hedefeKalan: null, metin: m, kip: 'soru' }).join(' ')
        expect(r, `${m} / ${sira}`).not.toMatch(/burada|anlayamadım/i)
      }
    }
  })

  it('günlük soru + deneme karışık: yalnız günlük soru alınır, deneme kaydedilmez ve yönlendirilir', () => {
    const metin =
      "bugün 50 Türkçe çözdüm 10 tanesi doğru 30 tanesi boş denemeye girdim denemede tyt denemesi bu arada  10 tane Türkçe doğrusu yaptım 20'si yanlıştı matematikten 20 doğru 20 yanlış yaptım"
    const c = coz(metin)
    expect(c.sorular).toEqual([{ ders: 'Türkçe', toplam: 50, dogru: 10, yanlis: 10 }])
    expect(c.deneme).toBeNull()
    expect(c.yanlisYer).toBe('deneme')
    expect(c.anlasilmayan).toEqual([])
    const r = cevap(metin)
    expect(r).toMatch(/Türkçe 50/)
    expect(r).toMatch(/Denemeler/)
    expect(r).not.toMatch(/anlayamadım/)
  })

  it('yalnız deneme anlatılırsa hiçbir şey kaydedilmez, Denemeler’e yönlendirilir', () => {
    const metin = 'tyt denemesine girdim türkçe 30 doğru 5 yanlış matematik 25 doğru 5 yanlış'
    const c = coz(metin)
    expect(c.sorular).toEqual([])
    expect(c.deneme).toBeNull()
    expect(c.yanlisYer).toBe('deneme')
    expect(cevap(metin)).toMatch(/Denemeler/)
  })

  it('"TT denemesi" yanlış duyulsa da deneme sayılır ve yönlendirilir', () => {
    const c = coz('TT denemesinde türkçe 33 doğru 4 yanlış')
    expect(c.deneme).toBeNull()
    expect(c.yanlisYer).toBe('deneme')
  })

  it('denemesiz düz günlük soruda yönlendirme yok', () => {
    const c = coz('matematikten 40 soru çözdüm 8 tanesini yanlış yaptım')
    expect(c.sorular).toEqual([{ ders: 'Matematik', toplam: 40, dogru: 32, yanlis: 8 }])
    expect(c.yanlisYer ?? null).toBeNull()
    expect(cevap('matematikten 40 soru çözdüm 8 tanesini yanlış yaptım')).not.toMatch(/Denemeler/)
  })
})

describe('kabul — deneme kipi (Denemeler, tür önceden seçili)', () => {
  it('"deneme" ya da "TYT" demeden ders sonuçları seçili denemeye yazılır', () => {
    const c = coz('türkçe 30 doğru 5 yanlış matematik 25 doğru 5 yanlış', 'deneme', 'tyt')
    expect(c.sorular).toEqual([])
    expect(c.deneme).toMatchObject({
      sablonId: 'tyt',
      dersler: [
        { dersId: 'turkce', dogru: 30, yanlis: 5 },
        { dersId: 'matematik', dogru: 25, yanlis: 5 },
      ],
    })
    expect(c.anlasilmayan).toEqual([])
  })

  it('SONUÇ … DERS yaptım sırası', () => {
    const c = coz('20 doğru 20 yanlış Türkçe yaptım 10 doğru 30 yanlış matematik yaptım', 'deneme', 'tyt')
    expect(c.deneme?.dersler).toEqual([
      { dersId: 'turkce', dogru: 20, yanlis: 20 },
      { dersId: 'matematik', dogru: 10, yanlis: 30 },
    ])
    expect(c.anlasilmayan).toEqual([])
  })

  it('yalın "sosyal" ve "fen" toplu sonuçtur (Emre: "direkt sosyal 20 doğru 0 yanlış")', () => {
    const c = coz('türkçe 30 doğru 5 yanlış sosyal 15 doğru 2 yanlış fen 12 doğru 3 yanlış', 'deneme', 'tyt')
    expect(c.deneme?.dersler).toEqual([{ dersId: 'turkce', dogru: 30, yanlis: 5 }])
    expect(c.deneme?.toplu).toEqual([
      { grup: 'sosyal', dogru: 15, yanlis: 2 },
      { grup: 'fen', dogru: 12, yanlis: 3 },
    ])
    expect(c.anlasilmayan).toEqual([])
  })

  it('imkânsız Sosyal/Fen (40 > 20) anlaşılmayana, gerisi bozulmaz', () => {
    const c = coz(
      "10 tane Türkçe doğrusu yaptım 20'si yanlıştı matematikten 20 doğru 20 yanlış yaptım  Sosyalden 10 doğru 30 yanlış fenden ise 20 doğru 20 yanlış",
      'deneme',
      'tyt',
    )
    expect(c.deneme?.dersler).toEqual([
      { dersId: 'turkce', dogru: 10, yanlis: 20 },
      { dersId: 'matematik', dogru: 20, yanlis: 20 },
    ])
    expect(c.deneme?.toplu ?? []).toEqual([])
    expect(c.anlasilmayan.length).toBe(2)
  })

  it('günlük soru söylenirse reddedilir, deneme bozulmaz', () => {
    const metin = 'türkçe 30 doğru 5 yanlış bir de bugün 50 matematik sorusu çözdüm'
    const c = coz(metin, 'deneme', 'tyt')
    expect(c.sorular).toEqual([])
    expect(c.deneme?.dersler).toEqual([{ dersId: 'turkce', dogru: 30, yanlis: 5 }])
    expect(c.yanlisYer).toBe('soru')
    expect(cevap(metin, 'deneme', 'tyt')).toMatch(/Soru Takibi/)
  })

  it('yalnız günlük soru söylenirse hiçbir şey alınmaz', () => {
    const c = coz('matematikten 40 soru çözdüm', 'deneme', 'tyt')
    expect(c.sorular).toEqual([])
    expect(c.deneme?.dersler ?? []).toEqual([])
    expect(c.yanlisYer).toBe('soru')
  })

  it('seçili tür AYT sayısal: matematik ve fen AYT şablonuna yazılır', () => {
    const c = coz('matematik 20 doğru 5 yanlış fen 15 doğru 3 yanlış', 'deneme', 'ayt-say')
    expect(c.deneme).toMatchObject({ sablonId: 'ayt-say', dersler: [{ dersId: 'matematik', dogru: 20, yanlis: 5 }] })
    expect(c.deneme?.toplu).toEqual([{ grup: 'fen', dogru: 15, yanlis: 3 }])
  })

  it('resmî grup adları: "fen bilimleri", "sosyal bilimler" (Emre, 2026-11-08)', () => {
    const c = coz('fen bilimleri 10 doğru 10 yanlış', 'deneme', 'tyt')
    expect(c.deneme?.toplu).toEqual([{ grup: 'fen', dogru: 10, yanlis: 10 }])
    expect(c.anlasilmayan).toEqual([])
    const s = coz('sosyal bilimler 12 doğru 3 yanlış fen bilimlerinden 8 doğru 2 yanlış', 'deneme', 'tyt')
    expect(s.deneme?.toplu).toEqual([
      { grup: 'sosyal', dogru: 12, yanlis: 3 },
      { grup: 'fen', dogru: 8, yanlis: 2 },
    ])
    expect(s.anlasilmayan).toEqual([])
  })

  it('resmî ders adları: "temel matematik", "türkçe testi", "din kültürü ve ahlak bilgisi"', () => {
    const c = coz(
      'türkçe testinde 30 doğru 5 yanlış temel matematik 25 doğru 5 yanlış din kültürü ve ahlak bilgisi 4 doğru 1 yanlış',
      'deneme',
      'tyt',
    )
    // TYT şablon sırası: Türkçe, (sosyal dersleri) Din, Temel Matematik
    expect(c.deneme?.dersler).toEqual([
      { dersId: 'turkce', dogru: 30, yanlis: 5 },
      { dersId: 'din', dogru: 4, yanlis: 1 },
      { dersId: 'matematik', dogru: 25, yanlis: 5 },
    ])
    expect(c.anlasilmayan).toEqual([])
  })

  it('seçili denemede olmayan ders: kaydedilmez, "bu denemede yok" denir (Emre, 2026-11-08)', () => {
    const metin = 'türkçe 30 doğru 5 yanlış matematik 20 doğru 5 yanlış sosyal 10 doğru 2 yanlış'
    const c = coz(metin, 'deneme', 'ayt-say')
    expect(c.deneme?.dersler).toEqual([{ dersId: 'matematik', dogru: 20, yanlis: 5 }])
    expect(c.deneme?.toplu ?? []).toEqual([])
    expect(c.denemedeYok).toEqual(['Türkçe', 'Sosyal'])
    expect(c.anlasilmayan).toEqual([])
    const r = cevap(metin, 'deneme', 'ayt-say')
    expect(r).toMatch(/Türkçe/)
    expect(r).toMatch(/yok/)
    expect(r).not.toMatch(/anlayamadım/)
  })

  it('Türkçe = Edebiyat = Türk Dili ve Edebiyatı (Emre, 2026-11-08): denemedeki karşılığına yazılır', () => {
    // TYT'de ders 'turkce'
    for (const ad of ['edebiyat', 'Edebiyat', 'türk dili ve edebiyatı', 'tde', 'türkçe', 'paragraf']) {
      const c = coz(`${ad} 20 doğru 3 yanlış`, 'deneme', 'tyt')
      expect(c.deneme?.dersler, ad).toEqual([{ dersId: 'turkce', dogru: 20, yanlis: 3 }])
      expect(c.denemedeYok ?? [], ad).toEqual([])
    }
    // AYT EA / Sözel ve 9. sınıf seviye tespitte ders 'edebiyat'
    for (const sablonId of ['ayt-ea', 'ayt-soz', 'okul']) {
      for (const ad of ['türkçe', 'edebiyat', 'türk dili ve edebiyatı', 'türkçeden']) {
        const c = coz(`${ad} 20 doğru 3 yanlış`, 'deneme', sablonId)
        expect(c.deneme?.dersler, `${sablonId}: ${ad}`).toEqual([{ dersId: 'edebiyat', dogru: 20, yanlis: 3 }])
        expect(c.denemedeYok ?? [], `${sablonId}: ${ad}`).toEqual([])
      }
    }
    // AYT Sayısal'da bu ders yok
    expect(coz('edebiyat 20 doğru 3 yanlış', 'deneme', 'ayt-say').denemedeYok).toEqual(['Türkçe'])
  })

  it('soru kipinde de üçü Türkçe sayılır', () => {
    for (const ad of ['edebiyattan', 'türk dili ve edebiyatından', 'türkçeden']) {
      expect(coz(`${ad} 30 soru çözdüm`).sorular, ad).toEqual([{ ders: 'Türkçe', toplam: 30, dogru: 0, yanlis: 0 }])
    }
  })

  it('TYT/AYT\'de dersin soru sayısını aşan sonuç: kaydedilmez, soru sayısıyla uyarılır (Emre, 2026-11-08)', () => {
    const metin = 'Türkçe 100 doğru 50 yanlış'
    const c = coz(metin, 'deneme', 'tyt')
    expect(c.deneme?.dersler ?? []).toEqual([])
    expect(c.fazlaSoru).toEqual([{ ad: 'Türkçe', soruSayisi: 40 }])
    expect(c.anlasilmayan).toEqual([])
    const r = cevap(metin, 'deneme', 'tyt')
    expect(r).toMatch(/Türkçe/)
    expect(r).toMatch(/40/)
    expect(r).not.toMatch(/anlayamadım/)
    expect(r).not.toMatch(/turkce|dogru|yanlis/) // normalize edilmiş metin kullanıcıya gösterilmez
  })

  it('AYT\'de de aşım uyarısı; geçerli dersler kaydedilir', () => {
    const c = coz('matematik 50 doğru 5 yanlış fizik 10 doğru 2 yanlış', 'deneme', 'ayt-say')
    expect(c.deneme?.dersler).toEqual([{ dersId: 'fizik', dogru: 10, yanlis: 2 }])
    expect(c.fazlaSoru).toEqual([{ ad: 'Matematik', soruSayisi: 40 }])
  })

  it('seviye tespitte aşım uyarısı YOK (soru sayısı denemeden denemeye değişir)', () => {
    const c = coz('türkçe 45 doğru 5 yanlış', 'deneme', 'okul')
    expect(c.fazlaSoru ?? []).toEqual([])
    // 9. sınıf seviye tespitte Türkçe dersinin kimliği 'edebiyat'
    expect(c.deneme?.dersler).toEqual([{ dersId: 'edebiyat', dogru: 45, yanlis: 5 }])
  })

  it('anlaşılmayan parça kullanıcının yazdığı biçimde gösterilir (Türkçe karakterli)', () => {
    const c = coz('Türkçe şöyle böyle iyiydi', 'deneme', 'tyt')
    for (const p of c.anlasilmayan) expect(p).not.toMatch(/turkce|soyle|boyle/)
  })

  it('"sosyalden 12 net" toplam net değildir', () => {
    const c = coz('sosyalden 12 net yaptım', 'deneme', 'tyt')
    expect(c.deneme?.toplamNet ?? null).toBeNull()
  })
})
