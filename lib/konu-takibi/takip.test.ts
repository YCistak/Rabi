import { describe, expect, it } from 'vitest'
import type { KonuIlerlemeleri } from '../konu/ilerleme'
import { HARITA_ESLEMESI } from './harita-eslemesi'
import { BOLUNEN_KONULAR } from './kayit'
import { YKS_DERSLERI, tumYksKonulari, yksDersBul } from './liste'

const TYT_DERSLERI = YKS_DERSLERI.filter((d) => d.oturum === 'tyt')
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
  devamKonusu,
  okuluTopluYaz,
  oncekiOkulsuzlar,
  sonIsaretGunu,
  toplamOzet,
  bitirmeyeHazir,
  hizliBaslangicSinifi,
  hizliBaslangicKonulari,
  dersleriIsaretsiz,
  hizliBayragiCoz,
  BOS_HIZLI_BAYRAK,
  type YksTakip,
} from './takip'

const BUGUN = '2026-10-04'

/**
 * Başka derse taşınan konular: kimlik → şimdiki ders. Kimlik kayıt anahtarı
 * olduğu için taşırken değişmiyor; önek eski dersi gösteriyor.
 */
const TASINAN_KONULAR: Record<string, string> = {
  'tyt-mat-binom': 'ayt-matematik',
}

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
    // olduğunu kayıttan okuyabilmek için. Başka derse taşınan konu kimliğini
    // koruyor (kayıtlı işaret o kimlikte) — onlar ayrıca sayılı.
    const onekler: Record<string, string> = {
      'tyt-turkce': 'tyt-trk-',
      'tyt-matematik': 'tyt-',
      'ayt-matematik': 'ayt-',
      ydt: 'ydt-',
    }
    for (const ders of YKS_DERSLERI) {
      const onek = onekler[ders.id] ?? `${ders.id.slice(0, 3)}-`
      for (const konu of ders.konular) {
        if (TASINAN_KONULAR[konu.id] === ders.id) continue
        expect(konu.id.startsWith(onek), konu.id).toBe(true)
      }
    }
  })

  it('taşınan konu yeni dersinde, kimliği aynı ve kaydı okunuyor', () => {
    for (const [konuId, dersId] of Object.entries(TASINAN_KONULAR)) {
      const ders = YKS_DERSLERI.find((d) => d.konular.some((k) => k.id === konuId))
      expect(ders?.id, konuId).toBe(dersId)
    }
    // Eski sürümde TYT'de işaretlenen Binom, AYT Matematik'in özetinde sayılıyor.
    const takip = takibiCoz({ surum: 1, konular: { 'tyt-mat-binom': { okul: BUGUN } } })
    expect(dersOzeti(yksDersBul('ayt-matematik')!, takip, {}).okul).toBe(1)
    expect(dersOzeti(yksDersBul('tyt-matematik')!, takip, {}).okul).toBe(0)
  })

  it('AYT Matematik TYT konusunu aynı adla tekrar etmiyor', () => {
    const tyt = new Set(yksDersBul('tyt-matematik')!.konular.map((k) => k.ad))
    for (const konu of yksDersBul('ayt-matematik')!.konular) expect(tyt.has(konu.ad), konu.ad).toBe(false)
  })

  it('TYT dersleri alanı olmayan, AYT dersleri alanı olan dersler', () => {
    for (const ders of YKS_DERSLERI) {
      if (ders.oturum === 'tyt') expect(ders.alanlar, ders.id).toBeUndefined()
      else expect(ders.alanlar?.length, ders.id).toBeGreaterThan(0)
    }
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

  it('ilk Türk-İslam devletleri ve Selçuklu Türkiyesi desteleri ayrıştı', () => {
    expect(HARITA_ESLEMESI['tyt-tar-ilk-turk-islam']).toEqual(['trh10-teskilat', 'trh10-turk-islam'])
    // Teşkilat destesi Selçuklu'dan çıktı; bilim-kültür iki konuda ortak.
    expect(HARITA_ESLEMESI['tyt-tar-selcuklu']).not.toContain('trh10-teskilat')
    expect(HARITA_ESLEMESI['tyt-tar-selcuklu']).toContain('trh10-turk-islam')
  })

  it('tamamlanan eşlemeler: bölünebilme asal çarpanları, iklim değişimi iki sınıfı kapsıyor', () => {
    expect(HARITA_ESLEMESI['tyt-mat-bolunebilme']).toContain('mat10-asal-carpan')
    expect(HARITA_ESLEMESI['ayt-cog-iklim-degisimi']).toEqual(['cog9-iklim-degisim', 'cog11-iklim'])
  })

  it('emin olunmayan eşlemeler bilerek yok', () => {
    expect(HARITA_ESLEMESI['tyt-geo-eslik-benzerlik']).not.toContain('mat9-teoremler')
    expect(HARITA_ESLEMESI['ayt-edb-siir-bilgisi']).not.toContain('trk10-imge')
    expect(HARITA_ESLEMESI['tyt-tar-toplum-duzeni']).toBeUndefined()
    expect(HARITA_ESLEMESI['tyt-tar-degisim-cagi']).toBeUndefined()
  })

  it('kullanıcının örneği: TYT trigonometri haritadaki 10. sınıf trigonometriye bağlı', () => {
    const durum = haritaDurumu('tyt-geo-trigonometri', {})
    expect(durum?.hedef.ders).toBe('matematik')
    expect(durum?.hedef.sinif).toBe(10)
    expect(durum?.hedef.konu.id).toBe('mat10-trigonometri')
  })
})

describe('AYT\'de TYT ile ortak konuların haritası', () => {
  it('AYT\'nin TYT ile örtüşen konuları haritaya bağlı', () => {
    for (const id of ['ayt-mat-esitsizlik', 'ayt-fiz-enerji-hareket', 'ayt-fiz-bhh', 'ayt-mat-fonksiyon']) {
      expect(haritaDurumu(id, {}), id).not.toBeNull()
    }
  })

  it('harita konusu bir kez bitirilince TYT ve AYT satırında aynı kayıt okunuyor', () => {
    let ilerleme: KonuIlerlemeleri = {}
    for (const id of HARITA_ESLEMESI['ayt-fiz-enerji-hareket']) ilerleme = tamamla(ilerleme, id)
    expect(haritaDurumu('ayt-fiz-enerji-hareket', ilerleme)?.durum).toBe('tamam')
    // TYT İş, Güç ve Enerji'nin dört konusundan ikisi aynı desteler.
    expect(haritaDurumu('tyt-fiz-is-enerji', ilerleme)).toMatchObject({ durum: 'basladi', biten: 2 })
  })

  it('AYT satırında harita dolu sayılıyor: aşama ve özet', () => {
    const ilerleme = tamamla({}, 'fzk10-periyodik')
    expect(konuDurumu('ayt-fiz-bhh', BOS_TAKIP, ilerleme).dolu).toBe(1)
    expect(dersOzeti(yksDersBul('ayt-fizik')!, BOS_TAKIP, ilerleme).harita).toBe(1)
  })

  it('12. sınıf: Matematik mat12 destelerine eşli, kartı yazılmamış dersler eşlenmiyor', () => {
    expect(HARITA_ESLEMESI['ayt-mat-turev']).toEqual(['mat12-turev', 'mat12-turev-uygulama'])
    expect(HARITA_ESLEMESI['ayt-mat-integral']).toEqual(['mat12-belirsiz-integral', 'mat12-belirli-integral'])
    expect(HARITA_ESLEMESI['ayt-mat-limit']).toEqual(['mat12-limit'])
    for (const id of ['ayt-kim-organik', 'ayt-biy-genden-proteine']) {
      expect(HARITA_ESLEMESI[id], id).toBeUndefined()
    }
  })
})

describe('haritaDurumu — otomatik aşama', () => {
  it('eşlemesi olmayan konuda null', () => {
    expect(haritaDurumu('ayt-kim-organik', {})).toBeNull()
    expect(haritaDurumu('olmayan-konu', {})).toBeNull()
  })

  it('12. sınıf Matematik konusu mat12 destelerinden hesaplanıyor', () => {
    expect(haritaDurumu('ayt-mat-turev', {})).toMatchObject({ durum: 'yok', biten: 0, toplam: 2 })
    const yarim = tamamla({}, 'mat12-turev')
    expect(haritaDurumu('ayt-mat-turev', yarim)).toMatchObject({ durum: 'basladi', biten: 1 })
    expect(haritaDurumu('ayt-mat-turev', tamamla(yarim, 'mat12-turev-uygulama'))?.durum).toBe('tamam')
    expect(haritaKonumu('mat12-cember')?.sinif).toBe(12)
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
    expect(durum?.okunan).toBe(1)
  })
})

describe('bölünen konuların göçü', () => {
  it('bölünen her konunun parçaları listede, eski kimlik de listede kaldı', () => {
    const kimlikler = new Set(tumYksKonulari().map((k) => k.id))
    for (const [eski, yeniler] of Object.entries(BOLUNEN_KONULAR)) {
      expect(kimlikler.has(eski), eski).toBe(true)
      for (const yeni of yeniler) expect(kimlikler.has(yeni), yeni).toBe(true)
    }
  })

  it('sürüm 1 kayıtta eski kimliğin işareti yeni parçalara kopyalanıyor', () => {
    const kayit = { okul: '2026-09-01', bitti: '2026-09-20' }
    const sonuc = takibiCoz({ surum: 1, konular: { 'ayt-edb-halk': kayit, 'ayt-biy-dolasim': { soru: BUGUN } } })
    expect(sonuc.surum).toBe(2)
    expect(sonuc.konular['ayt-edb-halk']).toEqual(kayit)
    expect(sonuc.konular['ayt-edb-halk-asik']).toEqual(kayit)
    expect(sonuc.konular['ayt-edb-halk-tekke']).toEqual(kayit)
    expect(sonuc.konular['ayt-biy-bagisiklik']).toEqual({ soru: BUGUN })
    // Edebiyat özeti: üç parça da bitti sayılıyor.
    expect(dersOzeti(yksDersBul('ayt-edebiyat')!, sonuc, {}).biten).toBe(3)
  })

  it('parçada zaten kayıt varsa üstüne yazılmıyor', () => {
    const sonuc = takibiCoz({
      surum: 1,
      konular: { 'ayt-edb-halk': { okul: '2026-09-01' }, 'ayt-edb-halk-asik': { soru: BUGUN } },
    })
    expect(sonuc.konular['ayt-edb-halk-asik']).toEqual({ soru: BUGUN })
  })

  it('göç bir kez: sürüm 2 kayıtta parçadan kaldırılan işaret geri gelmiyor', () => {
    let takip = takibiCoz({ surum: 1, konular: { 'ayt-edb-halk': { okul: '2026-09-01' } } })
    takip = asamaYaz(takip, 'ayt-edb-halk-tekke', 'okul', false, BUGUN)
    const yeniden = takibiCoz(JSON.parse(JSON.stringify(takip)))
    expect(yeniden.konular['ayt-edb-halk-tekke']).toBeUndefined()
    expect(yeniden.konular['ayt-edb-halk-asik']).toEqual({ okul: '2026-09-01' })
  })

  it('bölünen konular Maarif başlıklarına ayrı ayrı bağlı', () => {
    expect(HARITA_ESLEMESI['ayt-edb-halk']).toEqual(['trk10-anonim'])
    expect(HARITA_ESLEMESI['ayt-edb-halk-asik']).toEqual(['trk11-asik'])
    expect(HARITA_ESLEMESI['ayt-edb-halk-tekke']).toBeUndefined()
    expect(HARITA_ESLEMESI['ayt-biy-dolasim']).toEqual(['byl11-dolasim-homeo'])
    expect(HARITA_ESLEMESI['ayt-biy-bagisiklik']).toEqual(['byl11-dogal-bagisiklik', 'byl11-kazanilmis'])
  })
})

describe('takibiCoz — şema güvenliği', () => {
  it('bozuk değerlerde boş kayıt', () => {
    expect(takibiCoz(null)).toEqual(BOS_TAKIP)
    expect(takibiCoz('metin')).toEqual(BOS_TAKIP)
    expect(takibiCoz({ konular: {} })).toEqual(BOS_TAKIP)
    expect(takibiCoz({ surum: 3, konular: { a: { bitti: BUGUN } } })).toEqual(BOS_TAKIP)
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
    expect(sonuc).toEqual({ surum: 2, konular: { a: { okul: BUGUN }, b: { soru: '2026-09-01' } } })
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

  it('çubuk dilimleri en ileri aşamaya göre ayrık ve toplamı aşmıyor', () => {
    let takip = asamaYaz(BOS_TAKIP, 'tyt-fiz-basinc', 'okul', true, BUGUN)
    takip = asamaYaz(takip, 'tyt-fiz-basinc', 'soru', true, BUGUN)
    takip = asamaYaz(takip, 'tyt-fiz-optik', 'okul', true, BUGUN)
    takip = asamaYaz(takip, 'tyt-fiz-giris', 'okul', true, BUGUN)
    takip = asamaYaz(takip, 'tyt-fiz-giris', 'bitti', true, BUGUN)
    const ozet = dersOzeti(ders, takip, {})
    expect(ozet).toMatchObject({ biten: 1, soruda: 1, okulda: 1, okul: 3, soru: 1 })
    expect(ozet.biten + ozet.soruda + ozet.okulda).toBeLessThanOrEqual(ozet.toplam)
    expect(toplamOzet([ozet, ozet])).toMatchObject({ soruda: 2, okulda: 2 })
  })
})

describe('siradakiKonu — müfredat sırasında ilk eksik konu', () => {
  const ders = yksDersBul('tyt-fizik')!

  it('hiç dokunulmamışsa ilk konu', () => {
    expect(siradakiKonu(ders, BOS_TAKIP, {})?.id).toBe('tyt-fiz-giris')
  })

  it('sonraki bir konuya dokunmak öneriyi oraya zıplatmıyor', () => {
    const takip = asamaYaz(BOS_TAKIP, 'tyt-fiz-optik', 'okul', true, BUGUN)
    expect(siradakiKonu(ders, takip, {})?.id).toBe('tyt-fiz-giris')
  })

  it('yarım konu, aşamaları tamamlanana kadar öneride kalıyor', () => {
    const takip = asamaYaz(BOS_TAKIP, 'tyt-fiz-giris', 'okul', true, BUGUN)
    expect(siradakiKonu(ders, takip, {})?.id).toBe('tyt-fiz-giris')
  })

  it('aşamaları tamamlanan konu bitmeden de öneriden çıkıyor', () => {
    let ilerleme: KonuIlerlemeleri = {}
    for (const id of HARITA_ESLEMESI['tyt-fiz-giris']) ilerleme = tamamla(ilerleme, id)
    let takip = asamaYaz(BOS_TAKIP, 'tyt-fiz-giris', 'okul', true, BUGUN)
    takip = asamaYaz(takip, 'tyt-fiz-giris', 'soru', true, BUGUN)
    expect(siradakiKonu(ders, takip, ilerleme)?.id).toBe('tyt-fiz-madde')
    // Harita yarımken aşamalar tamam sayılmıyor.
    expect(siradakiKonu(ders, takip, {})?.id).toBe('tyt-fiz-giris')
  })

  it('haritada karşılığı olmayan konuda okul ve soru yetiyor', () => {
    const din = yksDersBul('tyt-din')!
    const ilk = din.konular[0].id
    expect(HARITA_ESLEMESI[ilk]).toBeUndefined()
    let takip = asamaYaz(BOS_TAKIP, ilk, 'okul', true, BUGUN)
    takip = asamaYaz(takip, ilk, 'soru', true, BUGUN)
    expect(siradakiKonu(din, takip, {})?.id).toBe(din.konular[1].id)
  })

  it('bitmiş konuyu atlıyor, hepsi bitince null', () => {
    let takip = asamaYaz(BOS_TAKIP, 'tyt-fiz-giris', 'bitti', true, BUGUN)
    expect(siradakiKonu(ders, takip, {})?.id).toBe('tyt-fiz-madde')
    for (const konu of ders.konular) takip = asamaYaz(takip, konu.id, 'bitti', true, BUGUN)
    expect(siradakiKonu(ders, takip, {})).toBeNull()
  })
})

describe('kullanıcının senaryosu — TYT Türkçe', () => {
  const turkce = yksDersBul('tyt-turkce')!
  const tumAsamalar = (takip: YksTakip, konuId: string) =>
    asamaYaz(asamaYaz(takip, konuId, 'okul', true, BUGUN), konuId, 'soru', true, BUGUN)
  const haritaTamam = (konuId: string) =>
    HARITA_ESLEMESI[konuId].reduce<KonuIlerlemeleri>((i, id) => tamamla(i, id), {})

  it('Sözcükte Anlam\'a harita + okul + soru: öneri Sözcükte Anlam\'da takılı kalmıyor', () => {
    const ilerleme = haritaTamam('tyt-trk-sozcukte-anlam')
    const takip = tumAsamalar(BOS_TAKIP, 'tyt-trk-sozcukte-anlam')
    expect(bitirmeyeHazir(konuDurumu('tyt-trk-sozcukte-anlam', takip, ilerleme))).toBe(true)
    // Müfredatta Sözcükte Anlam'dan sonra Söz Yorumu geliyor.
    expect(siradakiKonu(turkce, takip, ilerleme)?.id).toBe('tyt-trk-soz-yorumu')
    expect(devamKonusu(TYT_DERSLERI, takip, ilerleme)?.konu.id).toBe('tyt-trk-soz-yorumu')
  })

  it('Söz Yorumu bittiyse sıradaki Cümlede Anlam; ona soru işaretlenince yine Cümlede Anlam', () => {
    const ilerleme = haritaTamam('tyt-trk-sozcukte-anlam')
    let takip = tumAsamalar(BOS_TAKIP, 'tyt-trk-sozcukte-anlam')
    takip = asamaYaz(takip, 'tyt-trk-soz-yorumu', 'bitti', true, BUGUN)
    expect(siradakiKonu(turkce, takip, ilerleme)?.id).toBe('tyt-trk-cumlede-anlam')
    takip = asamaYaz(takip, 'tyt-trk-cumlede-anlam', 'soru', true, BUGUN)
    expect(siradakiKonu(turkce, takip, ilerleme)?.id).toBe('tyt-trk-cumlede-anlam')
    expect(devamKonusu(TYT_DERSLERI, takip, ilerleme)?.konu.id).toBe('tyt-trk-cumlede-anlam')
  })

  it('bitirmeye hazır konu daireye basılınca bitiyor ve hazır olmaktan çıkıyor', () => {
    const ilerleme = haritaTamam('tyt-trk-sozcukte-anlam')
    const takip = asamaYaz(tumAsamalar(BOS_TAKIP, 'tyt-trk-sozcukte-anlam'), 'tyt-trk-sozcukte-anlam', 'bitti', true, BUGUN)
    expect(bitirmeyeHazir(konuDurumu('tyt-trk-sozcukte-anlam', takip, ilerleme))).toBe(false)
  })
})

describe('bitirmeyeHazir ve sonIsaretGunu', () => {
  it('tek aşama yetmiyor, bitmiş konu hazır değil', () => {
    const takip = asamaYaz(BOS_TAKIP, 'tyt-din-bilgi-inanc', 'okul', true, BUGUN)
    expect(bitirmeyeHazir(konuDurumu('tyt-din-bilgi-inanc', takip, {}))).toBe(false)
    const iki = asamaYaz(takip, 'tyt-din-bilgi-inanc', 'soru', true, BUGUN)
    expect(bitirmeyeHazir(konuDurumu('tyt-din-bilgi-inanc', iki, {}))).toBe(true)
    const bitti = asamaYaz(iki, 'tyt-din-bilgi-inanc', 'bitti', true, BUGUN)
    expect(bitirmeyeHazir(konuDurumu('tyt-din-bilgi-inanc', bitti, {}))).toBe(false)
  })

  it('en geç günü döndürüyor', () => {
    expect(sonIsaretGunu({})).toBeNull()
    expect(sonIsaretGunu({ okul: '2026-09-30', soru: '2026-10-02' })).toBe('2026-10-02')
  })
})

describe('devamKonusu — en son dokunulan dersin sıradakisi', () => {
  const dersler = TYT_DERSLERI

  it('hiç işaret yoksa null', () => {
    expect(devamKonusu(dersler, BOS_TAKIP, {})).toBeNull()
  })

  it('en son dokunulan ders, o dersin müfredattaki ilk eksik konusu', () => {
    let takip = asamaYaz(BOS_TAKIP, 'tyt-fiz-optik', 'okul', true, '2026-10-01')
    takip = asamaYaz(takip, 'tyt-trk-paragraf', 'soru', true, '2026-10-03')
    takip = asamaYaz(takip, 'tyt-mat-uslu', 'okul', true, '2026-10-02')
    const sonuc = devamKonusu(dersler, takip, {})
    expect(sonuc?.ders.id).toBe('tyt-turkce')
    expect(sonuc?.konu.id).toBe('tyt-trk-sozcukte-anlam')
  })

  it('bitirmek de dokunuş sayılıyor', () => {
    let takip = asamaYaz(BOS_TAKIP, 'tyt-fiz-optik', 'okul', true, '2026-10-01')
    takip = asamaYaz(takip, 'tyt-mat-temel-kavramlar', 'bitti', true, '2026-10-05')
    const sonuc = devamKonusu(dersler, takip, {})
    expect(sonuc?.ders.id).toBe('tyt-matematik')
    expect(sonuc?.konu.id).toBe(yksDersBul('tyt-matematik')!.konular[1].id)
  })

  it('en son dokunulan derste öneri kalmadıysa bir öncekine bakıyor', () => {
    const din = yksDersBul('tyt-din')!
    let takip = asamaYaz(BOS_TAKIP, 'tyt-fiz-optik', 'okul', true, '2026-10-01')
    for (const konu of din.konular) takip = asamaYaz(takip, konu.id, 'bitti', true, '2026-10-05')
    expect(devamKonusu(dersler, takip, {})?.ders.id).toBe('tyt-fizik')
  })
})

describe('toplu okul işareti', () => {
  const mat = yksDersBul('tyt-matematik')!

  it('bu ve önceki konular, yalnızca okulu boş olanlar', () => {
    const takip = asamaYaz(BOS_TAKIP, 'tyt-mat-basamak', 'okul', true, '2026-09-01')
    const ids = oncekiOkulsuzlar(mat, 'tyt-mat-ebob-ekok', takip).map((k) => k.id)
    expect(ids).toEqual(['tyt-mat-temel-kavramlar', 'tyt-mat-bolunebilme', 'tyt-mat-ebob-ekok'])
  })

  it('bölüm sınırını geçmiyor', () => {
    const geo = mat.konular.find((k) => k.bolum === 'Geometri')!
    const ids = oncekiOkulsuzlar(mat, geo.id, BOS_TAKIP).map((k) => k.id)
    expect(ids).toEqual([geo.id])
  })

  it('yazıp geri alınca kayıt eski hâline dönüyor, önceki gün korunuyor', () => {
    const once = asamaYaz(BOS_TAKIP, 'tyt-mat-basamak', 'okul', true, '2026-09-01')
    const ids = oncekiOkulsuzlar(mat, 'tyt-mat-ebob-ekok', once).map((k) => k.id)
    const sonra = okuluTopluYaz(once, ids, true, BUGUN)
    expect(sonra.konular['tyt-mat-ebob-ekok']).toEqual({ okul: BUGUN })
    expect(sonra.konular['tyt-mat-basamak']).toEqual({ okul: '2026-09-01' })
    expect(okuluTopluYaz(sonra, ids, false, BUGUN)).toEqual(once)
  })
})

describe('hızlı başlangıç', () => {
  const tyt = YKS_DERSLERI.filter((d) => d.oturum === 'tyt')

  it('yalnızca 12. sınıf ve mezun', () => {
    expect(hizliBaslangicSinifi(11)).toBe(false)
    expect(hizliBaslangicSinifi(12)).toBe(true)
    expect(hizliBaslangicSinifi(13)).toBe(true)
  })

  it('her dersin müfredat sırasındaki ilk konuları, bölüm sınırı gözetmeden', () => {
    const konular = hizliBaslangicKonulari(tyt, 0.8)
    for (const ders of tyt) {
      const beklenen = ders.konular.slice(0, Math.floor(ders.konular.length * 0.8)).map((k) => k.id)
      expect(konular.filter((id) => ders.konular.some((k) => k.id === id)), ders.id).toEqual(beklenen)
    }
    // TYT Matematik'in %80'i Geometri bölümüne de uzanıyor.
    const geometri = yksDersBul('tyt-matematik')!.konular.filter((k) => k.bolum === 'Geometri').map((k) => k.id)
    expect(konular.some((id) => geometri.includes(id))).toBe(true)
  })

  it('yarısı ve yeni başlıyorum', () => {
    const turkce = yksDersBul('tyt-turkce')!
    expect(hizliBaslangicKonulari([turkce], 0.5)).toHaveLength(Math.floor(turkce.konular.length / 2))
    expect(hizliBaslangicKonulari(tyt, 0)).toEqual([])
  })

  it('okulda işlendi olarak yazılıyor, bitti değil; geri alınca kayıt boşalıyor', () => {
    const konular = hizliBaslangicKonulari(tyt, 0.5)
    const takip = okuluTopluYaz(BOS_TAKIP, konular, true, BUGUN)
    expect(Object.values(takip.konular).every((k) => k.okul === BUGUN && !k.bitti && !k.soru)).toBe(true)
    expect(dersleriIsaretsiz(tyt, takip)).toBe(false)
    expect(okuluTopluYaz(takip, konular, false, BUGUN)).toEqual(BOS_TAKIP)
  })

  it('dersler işaretsiz mi: başka dersin işareti saymıyor', () => {
    const takip = asamaYaz(BOS_TAKIP, 'ayt-mat-turev', 'okul', true, BUGUN)
    expect(dersleriIsaretsiz(tyt, takip)).toBe(true)
    expect(dersleriIsaretsiz(tyt, asamaYaz(takip, 'tyt-trk-ses', 'soru', true, BUGUN))).toBe(false)
  })
})

describe('hızlı başlangıç bayrağı', () => {
  it('bozuk değer ve bilinmeyen sürüm boş', () => {
    expect(hizliBayragiCoz(null)).toEqual(BOS_HIZLI_BAYRAK)
    expect(hizliBayragiCoz({ surum: 3, gosterilen: [9] })).toEqual(BOS_HIZLI_BAYRAK)
    expect(hizliBayragiCoz({ surum: 2, gosterilen: 9 })).toEqual(BOS_HIZLI_BAYRAK)
  })

  it('yalnızca bilinen sınıflar kalıyor', () => {
    expect(hizliBayragiCoz({ surum: 2, gosterilen: [12, 'xyz', 9, 13] })).toEqual({ surum: 2, gosterilen: [9, 12] })
  })

  it('sürüm 1 (TYT/AYT): kartı görmüş öğrenciye yeniden sorulmuyor', () => {
    expect(hizliBayragiCoz({ surum: 1, gosterilen: ['tyt'] })).toEqual({ surum: 2, gosterilen: [9, 10, 11, 12] })
    expect(hizliBayragiCoz({ surum: 1, gosterilen: [] })).toEqual(BOS_HIZLI_BAYRAK)
  })
})
