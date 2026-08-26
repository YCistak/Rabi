import { describe, expect, it } from 'vitest'
import {
  BASLANGIC_HAVUCU,
  EN_YUKSEK_SEVIYE,
  TOPLAM_HAVUC,
  XP,
  birikenOdul,
  esikXp,
  gerekenXp,
  seviyeHesapla,
  seviyeDurumu,
  seviyeOdulu,
  seviyeUnvani,
  tabanla,
  toplamXp,
  type XpGirdisi,
} from './seviye'

const BOS: XpGirdisi = {
  gunToplamlari: [],
  pomodoroDakikasi: 0,
  denemeSayisi: 0,
  bankaDusen: 0,
  enUzunSeri: 0,
  oyunTuru: 0,
  oyunDogru: 0,
}

const girdi = (parcali: Partial<XpGirdisi>): XpGirdisi => ({ ...BOS, ...parcali })

describe('eşik eğrisi', () => {
  it('1. seviye sıfır XP', () => {
    expect(esikXp(1)).toBe(0)
    expect(seviyeHesapla(0).seviye).toBe(1)
  })

  it('eşikler gerekenlerin toplamı', () => {
    let birikim = 0
    for (let s = 1; s < EN_YUKSEK_SEVIYE; s++) {
      expect(esikXp(s)).toBe(birikim)
      birikim += gerekenXp(s)
    }
  })

  /* Her seviye bir öncekinden pahalı olmalı; sabit adım üst seviyeleri anlamsızlaştırırdı. */
  it('her seviye bir öncekinden daha uzun', () => {
    for (let s = 1; s < EN_YUKSEK_SEVIYE; s++) {
      expect(gerekenXp(s + 1)).toBeGreaterThan(gerekenXp(s))
    }
  })

  it('eşiğin bir altı hâlâ önceki seviye', () => {
    for (let s = 2; s <= EN_YUKSEK_SEVIYE; s++) {
      expect(seviyeHesapla(esikXp(s)).seviye).toBe(s)
      expect(seviyeHesapla(esikXp(s) - 1).seviye).toBe(s - 1)
    }
  })

  it('tavanı aşan XP seviyeyi tavanda tutuyor', () => {
    const durum = seviyeHesapla(esikXp(EN_YUKSEK_SEVIYE) * 10)
    expect(durum.seviye).toBe(EN_YUKSEK_SEVIYE)
    expect(durum.tavandaMi).toBe(true)
    expect(durum.oran).toBe(1)
  })

  it('ilerleme oranı 0 ile 1 arasında', () => {
    for (let xp = 0; xp < 20000; xp += 137) {
      const oran = seviyeHesapla(xp).oran
      expect(oran).toBeGreaterThanOrEqual(0)
      expect(oran).toBeLessThanOrEqual(1)
    }
  })

  it('bozuk XP çökertmiyor', () => {
    expect(seviyeHesapla(-500).seviye).toBe(1)
    expect(seviyeHesapla(0).oran).toBe(0)
  })
})

describe('XP kaynakları', () => {
  it('boş girdi sıfır XP', () => {
    expect(toplamXp(BOS)).toBe(0)
  })

  /*
    Sistemin en önemli testi. Soru sayısı elle giriliyor: tek bir güne 5000
    yazmak bir saniye sürüyor. Tavan olmasaydı seviye kasmak yazı yazmaktan
    ibaret olurdu.
  */
  it('bir günün soru XP’si tavanı aşamıyor', () => {
    const abartili = toplamXp(girdi({ gunToplamlari: [100000] }))
    expect(abartili).toBe(XP.gunlukSoruTavani * XP.soru)
  })

  it('günlük tavan gün gün uygulanıyor, toplama değil', () => {
    const tekGun = toplamXp(girdi({ gunToplamlari: [600] }))
    const ikiGun = toplamXp(girdi({ gunToplamlari: [300, 300] }))
    expect(tekGun).toBe(XP.gunlukSoruTavani)
    expect(ikiGun).toBe(2 * XP.gunlukSoruTavani)
  })

  /* İkinci tavan yılları koruyor: her gün rakam yazan biri de bir yerde durmalı. */
  it('soru XP’sinin ömür boyu tavanı var', () => {
    const onYil = Array.from({ length: 3650 }, () => XP.gunlukSoruTavani)
    expect(toplamXp(girdi({ gunToplamlari: onYil }))).toBe(XP.soruTavani)
  })

  it('soru tavanı diğer kaynakları kısıtlamıyor', () => {
    const onYil = Array.from({ length: 3650 }, () => XP.gunlukSoruTavani)
    expect(toplamXp(girdi({ gunToplamlari: onYil, bankaDusen: 10 }))).toBe(
      XP.soruTavani + 10 * XP.bankaDusen,
    )
  })

  /* Oyun mola aktivitesi: tavansız bırakılsaydı bir gecelik tur maratonu
     bir aylık çalışmayı geçerdi. */
  it('oyun XP’sinin toplam tavanı var', () => {
    const abartili = toplamXp(girdi({ oyunTuru: 100000, oyunDogru: 100000 }))
    expect(abartili).toBe(XP.oyunTavani)
  })

  it('oyun tavanı diğer kaynakları kısıtlamıyor', () => {
    const sadeceOyun = toplamXp(girdi({ oyunTuru: 100000 }))
    const oyunVePomodoro = toplamXp(girdi({ oyunTuru: 100000, pomodoroDakikasi: 500 }))
    expect(oyunVePomodoro).toBe(sadeceOyun + 500 * XP.pomodoroDakika)
  })

  it('zaman isteyen ölçülerde tavan yok', () => {
    expect(toplamXp(girdi({ pomodoroDakikasi: 10000 }))).toBe(10000 * XP.pomodoroDakika)
    expect(toplamXp(girdi({ enUzunSeri: 365 }))).toBe(365 * XP.seriGunu)
    expect(toplamXp(girdi({ bankaDusen: 500 }))).toBe(500 * XP.bankaDusen)
  })

  it('negatif ve bozuk değerler XP düşürmüyor', () => {
    const bozuk = toplamXp(
      girdi({ gunToplamlari: [-50, 100], pomodoroDakikasi: -30, denemeSayisi: -2 }),
    )
    expect(bozuk).toBe(100 * XP.soru)
  })

  it('kaynaklar toplanıyor', () => {
    const durum = girdi({
      gunToplamlari: [200, 150],
      pomodoroDakikasi: 60,
      denemeSayisi: 2,
      bankaDusen: 3,
      enUzunSeri: 5,
      oyunTuru: 4,
      oyunDogru: 40,
    })
    expect(toplamXp(durum)).toBe(
      350 * XP.soru +
        60 * XP.pomodoroDakika +
        2 * XP.deneme +
        3 * XP.bankaDusen +
        5 * XP.seriGunu +
        (4 * XP.oyunTuru + 40 * XP.oyunDogru),
    )
  })
})

describe('denge', () => {
  /*
    "Kasmak kolay olmasın" kuralının sayıya dökülmüş hâli. Yalnızca oyun
    oynayarak ve soru yazarak tavana çıkılamamalı; pomodoro ve seri gibi zaman
    isteyen ölçüler olmadan üst seviyeler kapalı kalmalı.
  */
  it('tek başına oyun tavan seviyeye yetmiyor', () => {
    const durum = seviyeDurumu(girdi({ oyunTuru: 100000, oyunDogru: 100000 }))
    expect(durum.seviye).toBeLessThan(EN_YUKSEK_SEVIYE / 2)
  })

  it('her gün rakam yazmak tek başına üst seviyelere çıkarmıyor', () => {
    const birYilSoru = Array.from({ length: 365 }, () => XP.gunlukSoruTavani)
    expect(seviyeDurumu(girdi({ gunToplamlari: birYilSoru })).seviye).toBeLessThan(
      EN_YUKSEK_SEVIYE * 0.75,
    )
  })

  /* Uydurulamayan ölçüler seviyenin omurgası: onlarla tavan gerçekten görünür. */
  it('bir yıl günde üç saat pomodoro tavan seviyeye çıkarıyor', () => {
    expect(seviyeDurumu(girdi({ pomodoroDakikasi: 365 * 180 })).seviye).toBe(EN_YUKSEK_SEVIYE)
  })

  /* Öte yandan gerçekten çalışan biri ilk gün ödülsüz kalmamalı. */
  it('ilk dolu gün seviye atlatıyor', () => {
    const durum = seviyeDurumu(girdi({ gunToplamlari: [250], pomodoroDakikasi: 50 }))
    expect(durum.seviye).toBeGreaterThan(1)
  })
})

describe('havuç ödülü', () => {
  it('1. seviyenin ödülü yok', () => {
    expect(seviyeOdulu(1)).toBe(0)
    expect(seviyeOdulu(0)).toBe(0)
    expect(seviyeOdulu(EN_YUKSEK_SEVIYE + 1)).toBe(0)
  })

  it('ödül seviyeyle birlikte büyüyor', () => {
    for (let s = 2; s < EN_YUKSEK_SEVIYE; s++) {
      expect(seviyeOdulu(s + 1)).toBeGreaterThan(seviyeOdulu(s))
    }
  })

  it('aralık ödülü tek tek ödüllerin toplamı', () => {
    expect(birikenOdul(3, 7)).toBe(
      seviyeOdulu(4) + seviyeOdulu(5) + seviyeOdulu(6) + seviyeOdulu(7),
    )
  })

  /* Seviye düşerse (veri silinince) ödül geri alınmıyor, yenisi de verilmiyor. */
  it('geriye giden aralık ödül vermiyor', () => {
    expect(birikenOdul(10, 4)).toBe(0)
    expect(birikenOdul(10, 10)).toBe(0)
  })

  /* Sistemi ilk gören eski kullanıcı aradaki bütün ödülleri bir kerede alıyor. */
  it('birden fazla seviye atlanınca hepsinin ödülü veriliyor', () => {
    expect(birikenOdul(1, 12)).toBe(birikenOdul(1, 6) + birikenOdul(6, 12))
  })

  /*
    Ekonominin tavanı. Joker fiyatları bu sayıya göre konuyor; buradaki bir
    değişiklik `lib/magaza/jokerler.ts`'i de gözden geçirmeyi gerektirir.
  */
  it('ömür boyu kazanılabilecek havuç 10.000 civarında', () => {
    expect(TOPLAM_HAVUC).toBeGreaterThan(9000)
    expect(TOPLAM_HAVUC).toBeLessThan(11000)
    expect(TOPLAM_HAVUC).toBe(BASLANGIC_HAVUCU + birikenOdul(1, EN_YUKSEK_SEVIYE))
  })
})

describe('tabanla', () => {
  it('taban altındaysa seviyeyi yükseltiyor', () => {
    const tabanli = tabanla(seviyeHesapla(0), 9)
    expect(tabanli.seviye).toBe(9)
    expect(tabanli.oran).toBe(1)
    // Sonraki eşik anlamsız: kullanıcı o seviyeyi zaten tamamlamış.
    expect(tabanli.sonrakiIcinXp).toBe(0)
  })

  it('taban üstündeki durumu olduğu gibi bırakıyor', () => {
    const durum = seviyeHesapla(esikXp(12) + 40)
    expect(tabanla(durum, 5)).toBe(durum)
    expect(tabanla(durum, 12)).toBe(durum)
  })

  it('tabanı seviye tavanının üstüne çıkarmıyor', () => {
    expect(tabanla(seviyeHesapla(0), 999).seviye).toBe(EN_YUKSEK_SEVIYE)
  })
})

describe('unvan', () => {
  it('her seviyenin bir unvanı var', () => {
    for (let s = 1; s <= EN_YUKSEK_SEVIYE; s++) {
      expect(seviyeUnvani(s).length, `seviye ${s}`).toBeGreaterThan(2)
    }
  })

  it('unvan seviyeyle değişiyor', () => {
    expect(seviyeUnvani(1)).not.toBe(seviyeUnvani(EN_YUKSEK_SEVIYE))
  })
})
