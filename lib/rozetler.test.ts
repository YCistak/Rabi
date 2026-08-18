import { describe, expect, it } from 'vitest'
import {
  KADEME_SIRASI,
  ROZETLER,
  hakEdilenler,
  kademeSayimi,
  rozetDurumu,
  rozetListesi,
  yeniRozetler,
} from './rozetler'
import type { Deneme, GunlukKayit, PomodoroSeans, Sablon, YanlisSoru } from './types'

function denemeler(sayi: number): Deneme[] {
  return Array.from({ length: sayi }, (_, i) => ({
    id: `d${i}`,
    sablonId: 'tyt',
    ad: `Deneme ${i}`,
    tarih: '2026-08-10',
    sonuclar: [],
  }))
}

function gun(tarih: string, dogru: number): GunlukKayit {
  return { tarih, kayitlar: [{ ders: 'Matematik', toplam: dogru, dogru, yanlis: 0 }] }
}

function seans(baslangic: string, dakika = 25): PomodoroSeans {
  return { id: `p-${baslangic}`, baslangic, dakika }
}

function yanlis(id: string, cozuldu: boolean): YanlisSoru {
  return { id, ders: 'Matematik', tarih: '2026-08-10', resimId: `r-${id}`, cozuldu }
}

/** Rozet ölçülerinin çoğu için boş bir başlangıç — testler yalnız ilgilendiğini verir. */
const BOS: { denemeler: Deneme[]; gunlukKayitlar: GunlukKayit[]; diplomaNotu: number | null } = {
  denemeler: [],
  gunlukKayitlar: [],
  diplomaNotu: null,
}

describe('rozetDurumu', () => {
  it('gün ve hafta toplamlarını liste olarak çıkarır', () => {
    // 2026-08-10 pazartesi, 2026-08-17 sonraki pazartesi
    const durum = rozetDurumu({
      denemeler: denemeler(12),
      gunlukKayitlar: [gun('2026-08-10', 120), gun('2026-08-11', 310), gun('2026-08-17', 250)],
      diplomaNotu: 91.4,
    })

    expect(durum.denemeSayisi).toBe(12)
    expect(durum.gunToplamlari.sort((a, b) => a - b)).toEqual([120, 250, 310])
    // İlk hafta 120 + 310 = 430, ikinci hafta 250
    expect(durum.haftaToplamlari.sort((a, b) => a - b)).toEqual([250, 430])
    expect(durum.diplomaNotu).toBe(91.4)
  })

  it('kayıt yoksa her ölçü sıfır', () => {
    const durum = rozetDurumu({ ...BOS })
    expect(durum).toEqual({
      denemeSayisi: 0,
      denemeYukselisi: 0,
      diplomaNotu: null,
      gunToplamlari: [],
      haftaToplamlari: [],
      enUzunSeri: 0,
      pomodoroSeansi: 0,
      pomodoroDakikasi: 0,
      pomodoroEnIyiGun: 0,
      yanlisEklenen: 0,
      yanlisCozulen: 0,
      bankaDusen: 0,
      bankaTemiz: false,
      oyunTuru: 0,
      oyunRekoru: 0,
      oyunHatasiz: 0,
      oyunDogru: 0,
      oyunSerisi: 0,
    })
  })

  it('pomodoro seansını, süresini ve en yoğun günü toplar', () => {
    const durum = rozetDurumu({
      ...BOS,
      pomodoroGecmis: [
        seans('2026-08-10T09:00:00.000Z', 25),
        seans('2026-08-10T10:00:00.000Z', 25),
        seans('2026-08-10T11:00:00.000Z', 50),
        seans('2026-08-11T09:00:00.000Z', 25),
      ],
    })
    expect(durum.pomodoroSeansi).toBe(4)
    expect(durum.pomodoroDakikasi).toBe(125)
    // 10 Ağustos'ta üç tur, 11 Ağustos'ta bir tur
    expect(durum.pomodoroEnIyiGun).toBe(3)
  })

  it('yanlış bankasında eklenen ile çözüleni ayırır', () => {
    const durum = rozetDurumu({
      ...BOS,
      yanlisSorular: [yanlis('a', true), yanlis('b', false), yanlis('c', true)],
    })
    expect(durum.yanlisEklenen).toBe(3)
    expect(durum.yanlisCozulen).toBe(2)
  })

  /**
   * "Bankayı temizledin" demek için bankanın bir zamanlar dolmuş olması şart —
   * hiç oynamamış birinin boş bankası temizlik sayılmaz.
   */
  it('boş banka tek başına temizlik sayılmaz', () => {
    expect(rozetDurumu({ ...BOS, bankaDusen: 0, bankaBoyutu: 0 }).bankaTemiz).toBe(false)
    expect(rozetDurumu({ ...BOS, bankaDusen: 25, bankaBoyutu: 3 }).bankaTemiz).toBe(false)
    expect(rozetDurumu({ ...BOS, bankaDusen: 25, bankaBoyutu: 0 }).bankaTemiz).toBe(true)
  })

  it('mini oyun ölçüleri bütün oyunların toplamı', () => {
    const durum = rozetDurumu({
      ...BOS,
      oyunlar: {
        yazim: {
          enIyiDogru: 23,
          enIyiSeri: 7,
          oynananTur: 4,
          toplamDogru: 61,
          toplamYanlis: 9,
          hatasizTur: 1,
          sonTarih: '2026-08-17',
        },
      },
    })
    expect(durum.oyunTuru).toBe(4)
    expect(durum.oyunRekoru).toBe(23)
    expect(durum.oyunHatasiz).toBe(1)
    expect(durum.oyunDogru).toBe(61)
  })
})

describe('tekrar sayan rozetler', () => {
  /**
   * Soru sayısı elle giriliyor: bir kez 300 yazmak bedava. Rozet bu yüzden
   * eşiği kaç **ayrı gün** aştığını sayıyor — kısayolu yok.
   */
  it('bir kez eşiği aşmak günlük rozeti vermez', () => {
    const durum = rozetDurumu({ ...BOS, gunlukKayitlar: [gun('2026-08-10', 900)] })
    expect(hakEdilenler(durum).map((r) => r.id)).not.toContain('gun-200-x5')
  })

  it('beş ayrı gün 200’ü geçince rozet gelir', () => {
    const gunler = ['10', '12', '14', '16', '18'].map((g) => gun(`2026-08-${g}`, 220))
    const durum = rozetDurumu({ ...BOS, gunlukKayitlar: gunler })
    expect(hakEdilenler(durum).map((r) => r.id)).toContain('gun-200-x5')
    // 220 soru 300'ü geçmiyor, üst basamak gelmemeli
    expect(hakEdilenler(durum).map((r) => r.id)).not.toContain('gun-300-x10')
  })

  it('haftalık rozet ayrı haftalar ister', () => {
    // Aynı hafta içinde iki büyük gün tek hafta sayılır.
    const tekHafta = rozetDurumu({
      ...BOS,
      gunlukKayitlar: [gun('2026-08-10', 900), gun('2026-08-11', 900)],
    })
    expect(tekHafta.haftaToplamlari).toEqual([1800])
    expect(hakEdilenler(tekHafta).map((r) => r.id)).not.toContain('hafta-1500-x4')
  })
})

describe('seri rozetleri', () => {
  const artArda = (gunler: string[], soru = 300) =>
    gunler.map((g) => gun(g, soru))

  it('kesintisiz günleri sayar', () => {
    const durum = rozetDurumu({
      ...BOS,
      gunlukHedef: 250,
      gunlukKayitlar: artArda(['2026-08-10', '2026-08-11', '2026-08-12']),
    })
    expect(durum.enUzunSeri).toBe(3)
    expect(hakEdilenler(durum).map((r) => r.id)).toContain('seri-3')
  })

  it('araya boş gün girince seri kırılır', () => {
    const durum = rozetDurumu({
      ...BOS,
      gunlukHedef: 250,
      gunlukKayitlar: artArda(['2026-08-10', '2026-08-11', '2026-08-13']),
    })
    expect(durum.enUzunSeri).toBe(2)
    expect(hakEdilenler(durum).map((r) => r.id)).not.toContain('seri-3')
  })

  it('hedefin altındaki gün seriyi taşımaz', () => {
    const durum = rozetDurumu({
      ...BOS,
      gunlukHedef: 250,
      gunlukKayitlar: [gun('2026-08-10', 300), gun('2026-08-11', 100), gun('2026-08-12', 300)],
    })
    expect(durum.enUzunSeri).toBe(1)
  })

  /** Hedef girilmemişse seri ölçülemez; sıfıra bölünüp herkese rozet dağıtmamalı. */
  it('hedef sıfırsa seri sıfır', () => {
    const durum = rozetDurumu({
      ...BOS,
      gunlukHedef: 0,
      gunlukKayitlar: artArda(['2026-08-10', '2026-08-11', '2026-08-12']),
    })
    expect(durum.enUzunSeri).toBe(0)
  })
})

describe('deneme yükselişi', () => {
  const sablon: Sablon = {
    id: 'tyt',
    ad: 'TYT',
    tur: 'tyt',
    yanlisKatsayi: 4,
    hazir: true,
    dersler: [{ id: 'mat', ad: 'Matematik', soruSayisi: 40 }],
  }

  const deneme = (gun: string, dogru: number): Deneme => ({
    id: `d-${gun}`,
    sablonId: 'tyt',
    ad: `Deneme ${gun}`,
    tarih: `2026-08-${gun}`,
    sonuclar: [{ dersId: 'mat', dogru, yanlis: 0 }],
  })

  it('üst üste yükselen netleri sayar', () => {
    const durum = rozetDurumu({
      ...BOS,
      denemeler: [deneme('10', 20), deneme('11', 25), deneme('12', 30)],
      sablonlar: [sablon],
    })
    expect(durum.denemeYukselisi).toBe(3)
    expect(hakEdilenler(durum).map((r) => r.id)).toContain('yukselis-3')
  })

  it('düşüş diziyi kırar', () => {
    const durum = rozetDurumu({
      ...BOS,
      denemeler: [deneme('10', 20), deneme('11', 25), deneme('12', 22), deneme('13', 24)],
      sablonlar: [sablon],
    })
    expect(durum.denemeYukselisi).toBe(2)
  })

  /** Şablon verilmezse net hesaplanamaz; ölçü sessizce sıfır kalmalı. */
  it('şablon yoksa yükseliş ölçülmez', () => {
    const durum = rozetDurumu({ ...BOS, denemeler: [deneme('10', 20), deneme('11', 25)] })
    expect(durum.denemeYukselisi).toBe(0)
  })
})

describe('hakEdilenler', () => {
  it('eşiğin altındaki rozet verilmez', () => {
    expect(hakEdilenler(rozetDurumu({ ...BOS, denemeler: denemeler(9) }))).toEqual([])
  })

  it('eşiğe tam oturunca verilir', () => {
    const durum = rozetDurumu({ ...BOS, denemeler: denemeler(10) })
    expect(hakEdilenler(durum).map((r) => r.id)).toEqual(['deneme-10'])
  })

  it('alt basamaklar da birlikte gelir', () => {
    const durum = rozetDurumu({ ...BOS, denemeler: denemeler(55) })
    expect(hakEdilenler(durum).map((r) => r.id)).toEqual([
      'deneme-10',
      'deneme-25',
      'deneme-50',
    ])
  })

  /** Diploma notu girilmemişse 0 sayılmalı, rozet verilmemeli. */
  it('diploma notu yoksa okul rozeti çıkmaz', () => {
    expect(hakEdilenler(rozetDurumu({ ...BOS })).some((r) => r.tur === 'diploma')).toBe(false)
  })

  it('diploma 96 üç okul rozetini de verir', () => {
    const durum = rozetDurumu({ ...BOS, diplomaNotu: 96 })
    expect(hakEdilenler(durum).map((r) => r.id)).toEqual([
      'diploma-85',
      'diploma-90',
      'diploma-95',
    ])
  })
})

describe('yeniRozetler', () => {
  const durum = rozetDurumu({ ...BOS, denemeler: denemeler(25) })

  it('kazanılmamışları döner', () => {
    expect(yeniRozetler(durum, []).map((r) => r.id)).toEqual(['deneme-10', 'deneme-25'])
  })

  it('zaten kazanılanı tekrar vermez', () => {
    const kazanilmis = [{ rozetId: 'deneme-10', tarih: '2026-07-01' }]
    expect(yeniRozetler(durum, kazanilmis).map((r) => r.id)).toEqual(['deneme-25'])
  })

  it('hepsi kazanılmışsa boş döner', () => {
    const kazanilmis = [
      { rozetId: 'deneme-10', tarih: '2026-07-01' },
      { rozetId: 'deneme-25', tarih: '2026-07-20' },
    ]
    expect(yeniRozetler(durum, kazanilmis)).toEqual([])
  })
})

describe('rozetListesi', () => {
  /**
   * Rozet bir kez kazanılınca kalıcı. Deneme silinip sayı eşiğin altına düşse
   * bile rozet ekranda kazanılmış kalmalı — geri alınması cezalandırıcı olurdu.
   */
  it('veri düşse de kazanılmış rozet durur', () => {
    const durum = rozetDurumu({ ...BOS, denemeler: denemeler(3) })
    const liste = rozetListesi(durum, [{ rozetId: 'deneme-10', tarih: '2026-07-01' }])
    const on = liste.find((s) => s.rozet.id === 'deneme-10')!

    expect(on.kazanildi).toBe(true)
    expect(on.tarih).toBe('2026-07-01')
    expect(on.mevcut).toBe(3)
  })

  it('bütün rozetleri kapsar', () => {
    expect(rozetListesi(rozetDurumu({ ...BOS }), [])).toHaveLength(ROZETLER.length)
  })

  it('kazanılanlar en üstte', () => {
    const durum = rozetDurumu({ ...BOS, denemeler: denemeler(10) })
    const liste = rozetListesi(durum, [{ rozetId: 'deneme-10', tarih: '2026-08-10' }])
    expect(liste[0].rozet.id).toBe('deneme-10')
  })

  it('rozet kimlikleri benzersiz', () => {
    expect(new Set(ROZETLER.map((r) => r.id)).size).toBe(ROZETLER.length)
  })

  it('her simge yalnız bir rozette kullanılır', () => {
    expect(new Set(ROZETLER.map((r) => r.ikon)).size).toBe(ROZETLER.length)
  })
})

describe('kademeler', () => {
  it('her rozetin kademesi tanımlı', () => {
    for (const rozet of ROZETLER) {
      expect(KADEME_SIRASI[rozet.kademe]).toBeTypeOf('number')
    }
  })

  /**
   * Rozetlerin ağırlık merkezi çalışmada olmalı, oyunda değil. Mini oyun
   * rozetleri toplamın beşte birini geçerse denge yeniden bozulmuş demektir.
   */
  it('mini oyun rozetleri azınlıkta', () => {
    const oyun = ROZETLER.filter((r) => r.tur.startsWith('oyun-')).length
    expect(oyun / ROZETLER.length).toBeLessThan(0.2)
  })

  it('kademe sayımı yalnız kazanılanları toplar', () => {
    const durum = rozetDurumu({ ...BOS, denemeler: denemeler(10) })
    const sayim = kademeSayimi(rozetListesi(durum, []))
    expect(sayim.bronz).toBe(1)
    expect(sayim.efsane).toBe(0)
  })
})
