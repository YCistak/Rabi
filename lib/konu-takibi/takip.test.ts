import { describe, expect, it } from 'vitest'
import type { KonuIlerlemeleri } from '../konu/ilerleme'
import { HARITA_ESLEMESI } from './harita-eslemesi'
import { YKS_DERSLERI, dersAdi, oturumDersleri, tumYksKonulari, yksDersBul } from './liste'
import {
  BOS_TAKIP,
  asamaYaz,
  dersOzeti,
  eksikAsamalar,
  haritaDurumu,
  haritaKonumu,
  konuDurumu,
  siradakiKonu,
  takibiCoz,
  toplamOzet,
  yuzde,
  type YksTakip,
} from './takip'

const BUGUN = '2026-10-04'

/** Bir harita konusunu tamamlanmış yazar: deste bitti, soruların hepsi doğru. */
function tamamla(ilerlemeler: KonuIlerlemeleri, konuId: string): KonuIlerlemeleri {
  const konum = haritaKonumu(konuId)
  if (!konum) throw new Error(`haritada yok: ${konuId}`)
  return {
    ...ilerlemeler,
    [konuId]: { bitti: true, okunan: konum.konu.kartlar.length, dogru: konum.konu.sorular.length, tarih: BUGUN },
  }
}

describe('YKS konu listesi', () => {
  it('kimlikler bütün listede tek', () => {
    const kimlikler = tumYksKonulari().map((k) => k.id)
    expect(new Set(kimlikler).size).toBe(kimlikler.length)
    const dersler = YKS_DERSLERI.map((d) => d.id)
    expect(new Set(dersler).size).toBe(dersler.length)
  })

  it('her derste en az bir konu var ve adlar boş değil', () => {
    for (const ders of YKS_DERSLERI) {
      expect(ders.konular.length, ders.id).toBeGreaterThan(0)
      for (const konu of ders.konular) expect(konu.ad.trim(), konu.id).not.toBe('')
    }
  })

  it('konu kimliği dersin önekini taşıyor', () => {
    // Kimlik kayıt anahtarı; önek, dağınık bir kimliğin hangi derse ait
    // olduğunu kayıttan okuyabilmek için.
    const onekler: Record<string, string> = {
      'tyt-turkce': 'tyt-trk-',
      'tyt-matematik': 'tyt-',
      'ayt-matematik': 'ayt-',
      ydt: 'ydt-',
    }
    for (const ders of YKS_DERSLERI) {
      const onek = onekler[ders.id] ?? `${ders.id.slice(0, 3)}-`
      for (const konu of ders.konular) expect(konu.id.startsWith(onek), konu.id).toBe(true)
    }
  })

  it('TYT dersleri alanı olmayan, AYT dersleri alanı olan dersler', () => {
    for (const ders of YKS_DERSLERI) {
      if (ders.oturum === 'tyt') expect(ders.alanlar, ders.id).toBeUndefined()
      else expect(ders.alanlar?.length, ders.id).toBeGreaterThan(0)
    }
  })
})

describe('oturumDersleri — alan süzgeci', () => {
  const adlar = (oturum: 'tyt' | 'ayt', alan: Parameters<typeof oturumDersleri>[1]) =>
    oturumDersleri(oturum, alan).map((d) => d.id)

  it('TYT herkese aynı dokuz ders', () => {
    const beklenen = [
      'tyt-turkce',
      'tyt-matematik',
      'tyt-fizik',
      'tyt-kimya',
      'tyt-biyoloji',
      'tyt-tarih',
      'tyt-cografya',
      'tyt-felsefe',
      'tyt-din',
    ]
    for (const alan of ['say', 'ea', 'soz', 'dil', null] as const) expect(adlar('tyt', alan)).toEqual(beklenen)
  })

  it('sayısal: Matematik, Fizik, Kimya, Biyoloji', () => {
    expect(adlar('ayt', 'say')).toEqual(['ayt-matematik', 'ayt-fizik', 'ayt-kimya', 'ayt-biyoloji'])
  })

  it('eşit ağırlık: Matematik, Edebiyat, Tarih, Coğrafya', () => {
    expect(adlar('ayt', 'ea')).toEqual(['ayt-matematik', 'ayt-edebiyat', 'ayt-tarih', 'ayt-cografya'])
  })

  it('sözel: Edebiyat, Tarih, Coğrafya, Felsefe Grubu, Din', () => {
    expect(adlar('ayt', 'soz')).toEqual([
      'ayt-edebiyat',
      'ayt-tarih',
      'ayt-cografya',
      'ayt-felsefe',
      'ayt-din',
    ])
  })

  it('dil: yalnızca YDT', () => {
    expect(adlar('ayt', 'dil')).toEqual(['ydt'])
  })

  it('alan seçilmemişse AYT boş — bir alan varsayılmıyor', () => {
    expect(adlar('ayt', null)).toEqual([])
  })

  it('Tarih ve Coğrafya adı alana göre test adını alıyor', () => {
    const tarih = yksDersBul('ayt-tarih')!
    const cografya = yksDersBul('ayt-cografya')!
    expect(dersAdi(tarih, 'ea')).toBe('Tarih-1')
    expect(dersAdi(tarih, 'soz')).toBe('Tarih-1 ve 2')
    expect(dersAdi(cografya, 'ea')).toBe('Coğrafya-1')
    expect(dersAdi(cografya, 'soz')).toBe('Coğrafya-1 ve 2')
    expect(dersAdi(yksDersBul('ayt-edebiyat')!, 'soz')).toBe('Edebiyat')
  })
})

describe('harita eşlemesi', () => {
  const yksKimlikleri = new Set(tumYksKonulari().map((k) => k.id))

  it('tablodaki her YKS kimliği listede var', () => {
    for (const id of Object.keys(HARITA_ESLEMESI)) expect(yksKimlikleri.has(id), id).toBe(true)
  })

  it('tablodaki her harita kimliği içerikte gerçekten var', () => {
    for (const [yks, haritalar] of Object.entries(HARITA_ESLEMESI)) {
      expect(haritalar.length, yks).toBeGreaterThan(0)
      for (const id of haritalar) expect(haritaKonumu(id), `${yks} → ${id}`).not.toBeNull()
    }
  })

  it('bir YKS konusu aynı harita konusunu iki kez saymıyor', () => {
    for (const [yks, haritalar] of Object.entries(HARITA_ESLEMESI)) {
      expect(new Set(haritalar).size, yks).toBe(haritalar.length)
    }
  })

  it('eşleme konunun dersiyle aynı derse gidiyor', () => {
    // Edebiyat ve Türkçe haritada aynı ders (`turkce`); öteki dersler kendi adıyla.
    for (const ders of YKS_DERSLERI) {
      for (const konu of ders.konular) {
        for (const id of HARITA_ESLEMESI[konu.id] ?? []) {
          expect(haritaKonumu(id)?.ders, `${konu.id} → ${id}`).toBe(ders.renk)
        }
      }
    }
  })

  it('kullanıcının örneği: TYT trigonometri haritadaki 10. sınıf trigonometriye bağlı', () => {
    const durum = haritaDurumu('tyt-geo-trigonometri', {})
    expect(durum?.hedef.ders).toBe('matematik')
    expect(durum?.hedef.sinif).toBe(10)
    expect(durum?.hedef.konu.id).toBe('mat10-trigonometri')
  })
})

describe('haritaDurumu — otomatik aşama', () => {
  it('eşlemesi olmayan konuda null', () => {
    expect(haritaDurumu('ayt-mat-turev', {})).toBeNull()
    expect(haritaDurumu('olmayan-konu', {})).toBeNull()
  })

  it('hiç dokunulmamışsa yok', () => {
    expect(haritaDurumu('tyt-fiz-basinc', {})).toMatchObject({ durum: 'yok', biten: 0, toplam: 4 })
  })

  it('kart okunmuşsa başladı', () => {
    const ilerleme: KonuIlerlemeleri = { 'fzk9-basinc': { okunan: 2, bitti: false, tarih: BUGUN } }
    expect(haritaDurumu('tyt-fiz-basinc', ilerleme)?.durum).toBe('basladi')
  })

  it('yalnızca kilidi açılmış kayıt başlanmış sayılmıyor', () => {
    const ilerleme: KonuIlerlemeleri = { 'fzk9-basinc': { acildi: true, bitti: false, tarih: BUGUN } }
    expect(haritaDurumu('tyt-fiz-basinc', ilerleme)?.durum).toBe('yok')
  })

  it('bir kısmı tamamsa başladı ve hedef ilk eksik konu', () => {
    const ilerleme = tamamla({}, 'fzk9-basinc')
    const durum = haritaDurumu('tyt-fiz-basinc', ilerleme)
    expect(durum).toMatchObject({ durum: 'basladi', biten: 1, toplam: 4 })
    expect(durum?.hedef.konu.id).toBe('fzk9-sivi-basinc')
  })

  it('hepsi tamamsa tamam ve hedef ilk konu', () => {
    let ilerleme: KonuIlerlemeleri = {}
    for (const id of HARITA_ESLEMESI['tyt-fiz-basinc']) ilerleme = tamamla(ilerleme, id)
    const durum = haritaDurumu('tyt-fiz-basinc', ilerleme)
    expect(durum).toMatchObject({ durum: 'tamam', biten: 4, toplam: 4 })
    expect(durum?.hedef.konu.id).toBe('fzk9-basinc')
  })

  it('deste bitti ama soru geçilmediyse tamam değil — haritanın yeşil kitabıyla aynı ölçü', () => {
    // 11. sınıf Fizik soruları yazılı; geçme sınırının altında kalan konu bitmiş sayılmıyor.
    const konum = haritaKonumu('fzk11-newton')!
    expect(konum.konu.sorular.length).toBeGreaterThan(0)
    const ilerleme: KonuIlerlemeleri = {
      'fzk11-newton': { bitti: true, okunan: konum.konu.kartlar.length, dogru: 0, tarih: BUGUN },
    }
    const durum = haritaDurumu('ayt-fiz-newton', ilerleme)
    expect(durum?.durum).toBe('basladi')
    expect(durum?.biten).toBe(0)
  })
})

describe('takibiCoz — şema güvenliği', () => {
  it('bozuk değerlerde boş kayıt', () => {
    expect(takibiCoz(null)).toEqual(BOS_TAKIP)
    expect(takibiCoz('metin')).toEqual(BOS_TAKIP)
    expect(takibiCoz({ konular: {} })).toEqual(BOS_TAKIP)
    expect(takibiCoz({ surum: 2, konular: { a: { bitti: BUGUN } } })).toEqual(BOS_TAKIP)
    expect(takibiCoz({ surum: 1, konular: null })).toEqual(BOS_TAKIP)
  })

  it('geçerli günleri tutar, bozuk alanları ve boş kayıtları atar', () => {
    const sonuc = takibiCoz({
      surum: 1,
      konular: {
        a: { okul: BUGUN, soru: 'dün', bitti: 5, fazla: true },
        b: { soru: '2026-09-01' },
        c: {},
        d: 'bozuk',
      },
    })
    expect(sonuc).toEqual({ surum: 1, konular: { a: { okul: BUGUN }, b: { soru: '2026-09-01' } } })
  })

  it('listede olmayan kimliği atmıyor', () => {
    const sonuc = takibiCoz({ surum: 1, konular: { 'eski-konu': { bitti: BUGUN } } })
    expect(sonuc.konular['eski-konu']).toEqual({ bitti: BUGUN })
  })

  it('yazılan kayıt JSON gidiş-dönüşünden aynı çıkıyor', () => {
    let takip: YksTakip = BOS_TAKIP
    takip = asamaYaz(takip, 'tyt-mat-uslu', 'okul', true, BUGUN)
    takip = asamaYaz(takip, 'tyt-mat-uslu', 'bitti', true, BUGUN)
    expect(takibiCoz(JSON.parse(JSON.stringify(takip)))).toEqual(takip)
  })
})

describe('asamaYaz', () => {
  it('işaretler ve ilk günü korur', () => {
    const bir = asamaYaz(BOS_TAKIP, 'k', 'soru', true, '2026-09-01')
    const iki = asamaYaz(bir, 'k', 'soru', true, BUGUN)
    expect(iki.konular.k).toEqual({ soru: '2026-09-01' })
  })

  it('kaldırınca alan, boş kalınca kayıt düşüyor', () => {
    const bir = asamaYaz(BOS_TAKIP, 'k', 'okul', true, BUGUN)
    const iki = asamaYaz(bir, 'k', 'soru', true, BUGUN)
    expect(asamaYaz(iki, 'k', 'okul', false, BUGUN).konular.k).toEqual({ soru: BUGUN })
    expect(asamaYaz(bir, 'k', 'okul', false, BUGUN).konular).toEqual({})
  })

  it('girdiyi değiştirmiyor', () => {
    const once = asamaYaz(BOS_TAKIP, 'k', 'okul', true, BUGUN)
    asamaYaz(once, 'k', 'bitti', true, BUGUN)
    expect(once.konular.k).toEqual({ okul: BUGUN })
    expect(BOS_TAKIP.konular).toEqual({})
  })
})

describe('konuDurumu ve eksikAsamalar', () => {
  it('haritalı konuda üç aşama, haritasızda iki', () => {
    expect(konuDurumu('tyt-mat-uslu', BOS_TAKIP, {}).asamaToplam).toBe(3)
    expect(konuDurumu('tyt-mat-basamak', BOS_TAKIP, {}).asamaToplam).toBe(2)
  })

  it('eksik aşamalar haritalı konuda haritayı da sayar', () => {
    const takip = asamaYaz(BOS_TAKIP, 'tyt-mat-uslu', 'okul', true, BUGUN)
    expect(eksikAsamalar(konuDurumu('tyt-mat-uslu', takip, {}))).toEqual(['harita', 'soru'])
  })

  it('haritasız konuda harita eksik sayılmaz', () => {
    expect(eksikAsamalar(konuDurumu('tyt-mat-basamak', BOS_TAKIP, {}))).toEqual(['okul', 'soru'])
  })

  it('harita tamamlanınca aşama kendiliğinden dolu', () => {
    let takip = asamaYaz(BOS_TAKIP, 'tyt-mat-uslu', 'okul', true, BUGUN)
    takip = asamaYaz(takip, 'tyt-mat-uslu', 'soru', true, BUGUN)
    const ilerleme = tamamla({}, 'mat9-uslu-koklu')
    const durum = konuDurumu('tyt-mat-uslu', takip, ilerleme)
    expect(durum.dolu).toBe(3)
    expect(eksikAsamalar(durum)).toEqual([])
  })

  it('bitirdim aşamalardan bağımsız', () => {
    const takip = asamaYaz(BOS_TAKIP, 'tyt-mat-basamak', 'bitti', true, BUGUN)
    const durum = konuDurumu('tyt-mat-basamak', takip, {})
    expect(durum.bitti).toBe(true)
    expect(durum.dolu).toBe(0)
  })
})

describe('dersOzeti ve toplamOzet', () => {
  const ders = yksDersBul('tyt-fizik')!

  it('boş kayıtta sıfırlar, haritalı konular sayılı', () => {
    const ozet = dersOzeti(ders, BOS_TAKIP, {})
    expect(ozet.toplam).toBe(ders.konular.length)
    expect(ozet.biten).toBe(0)
    expect(ozet.haritali).toBe(ders.konular.filter((k) => HARITA_ESLEMESI[k.id]).length)
  })

  it('aşamaları ve bitenleri sayar', () => {
    let takip = asamaYaz(BOS_TAKIP, 'tyt-fiz-basinc', 'okul', true, BUGUN)
    takip = asamaYaz(takip, 'tyt-fiz-basinc', 'bitti', true, BUGUN)
    takip = asamaYaz(takip, 'tyt-fiz-optik', 'soru', true, BUGUN)
    const ilerleme = tamamla({}, 'fzk9-kaldirma')
    const ozet = dersOzeti(ders, takip, ilerleme)
    expect(ozet).toMatchObject({ biten: 1, okul: 1, soru: 1, harita: 1 })
  })

  it('toplam ders özetlerini topluyor', () => {
    const a = dersOzeti(ders, BOS_TAKIP, {})
    const b = dersOzeti(yksDersBul('tyt-kimya')!, BOS_TAKIP, {})
    expect(toplamOzet([a, b]).toplam).toBe(a.toplam + b.toplam)
    expect(toplamOzet([])).toMatchObject({ toplam: 0, biten: 0 })
  })

  it('yüzde aşağı yuvarlanır, payda sıfırsa sıfır', () => {
    expect(yuzde(199, 200)).toBe(99)
    expect(yuzde(2, 2)).toBe(100)
    expect(yuzde(0, 0)).toBe(0)
  })
})

describe('siradakiKonu', () => {
  const ders = yksDersBul('tyt-fizik')!

  it('hiç dokunulmamışsa ilk konu', () => {
    expect(siradakiKonu(ders, BOS_TAKIP, {})?.id).toBe('tyt-fiz-giris')
  })

  it('bitmeye en yakın konuyu öneriyor', () => {
    let takip = asamaYaz(BOS_TAKIP, 'tyt-fiz-dalgalar', 'okul', true, BUGUN)
    takip = asamaYaz(takip, 'tyt-fiz-dalgalar', 'soru', true, BUGUN)
    takip = asamaYaz(takip, 'tyt-fiz-basinc', 'okul', true, BUGUN)
    expect(siradakiKonu(ders, takip, {})?.id).toBe('tyt-fiz-dalgalar')
  })

  it('haritada başlanmış konu eşitliği bozuyor', () => {
    const ilerleme: KonuIlerlemeleri = { 'fzk9-kaldirma': { okunan: 1, bitti: false, tarih: BUGUN } }
    expect(siradakiKonu(ders, BOS_TAKIP, ilerleme)?.id).toBe('tyt-fiz-kaldirma')
  })

  it('bitmiş konuyu atlıyor, hepsi bitince null', () => {
    let takip = asamaYaz(BOS_TAKIP, 'tyt-fiz-giris', 'bitti', true, BUGUN)
    expect(siradakiKonu(ders, takip, {})?.id).toBe('tyt-fiz-madde')
    for (const konu of ders.konular) takip = asamaYaz(takip, konu.id, 'bitti', true, BUGUN)
    expect(siradakiKonu(ders, takip, {})).toBeNull()
  })
})
