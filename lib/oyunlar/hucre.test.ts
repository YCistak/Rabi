import { describe, expect, it } from 'vitest'
import { ORGANELLER, SIK_SAYISI, kayittanSoru, siklariKur, turHazirla } from './hucre'
import { HUCRE_HAVUZU } from './hucre-havuzu'
import { bankaKimligi, bankaSorusuMetni, hucredenBanka } from './banka'
import { ZORLUKLAR } from './ritim'

/**
 * Birbirine uyan yapılar: anahtarın sorusunda bu adlar çeldirici olamaz.
 *
 * Biri ötekinin parçası ya da aynı işi paylaşıyor; anahtarın sorusu çoğu
 * zaman bunlara da uyar ("fotosentezin gerçekleştiği organel" sorusunda
 * tilakoid de doğru sayılabilir). Çeldiriciler elle seçildiği için bu
 * liste o seçimin denetimi: havuza çeldirici eklerken buraya da bak.
 */
const BIRBIRINE_UYANLAR: Record<string, readonly string[]> = {
  Mitokondri: ['Krista', 'Mitokondri matriksi', 'Mezozom'],
  Kloroplast: ['Tilakoid', 'Granum', 'Stroma'],
  Tilakoid: ['Granum'],
  Granum: ['Tilakoid'],
  Lökoplast: ['Stroma'],
  Kromoplast: ['Koful'],
  Ribozom: ['Granüllü endoplazmik retikulum', 'Mitokondri', 'Kloroplast'],
  'Granüllü endoplazmik retikulum': ['Çekirdek zarı', 'Vezikül', 'Ribozom'],
  'Granülsüz endoplazmik retikulum': ['Peroksizom'],
  Lizozom: ['Koful', 'Vezikül'],
  'Golgi cisimciği': ['Vezikül'],
  Çekirdek: ['Nükleoplazma', 'Kromatin', 'Kromozom', 'Çekirdek zarı'],
  'Hücre zarı': ['Glikokaliks', 'Çekirdek zarı'],
  Sentrozom: ['Sentriyol', 'Mikrotübül'],
  Sentriyol: ['Sentrozom', 'Mikrotübül'],
  Sil: ['Mikrotübül', 'Sentriyol'],
  Kamçı: ['Mikrotübül', 'Sentriyol'],
  Mikrotübül: ['Sentriyol', 'Sil', 'Kamçı', 'Hücre iskeleti'],
  'Hücre iskeleti': ['Mikrotübül', 'Mikrofilament', 'Ara filament'],
  'Ara filament': ['Hücre dışı matriks'],
}

describe('siklariKur', () => {
  it('her soruda dört farklı şık, tam olarak biri doğru', () => {
    for (const soru of HUCRE_HAVUZU) {
      for (let i = 0; i < 20; i++) {
        const siklar = siklariKur(soru)
        expect(siklar, soru.organel).toHaveLength(SIK_SAYISI)
        expect(new Set(siklar.map((s) => s.deger)).size, soru.organel).toBe(SIK_SAYISI)
        expect(siklar.filter((s) => s.dogruMu), soru.organel).toHaveLength(1)
        expect(siklar.find((s) => s.dogruMu)?.deger).toBe(soru.organel)
      }
    }
  })

  it('çeldiriciler yalnızca sorunun kendi listesinden', () => {
    for (const soru of HUCRE_HAVUZU) {
      for (let i = 0; i < 20; i++) {
        for (const sik of siklariKur(soru)) {
          if (!sik.dogruMu) expect(soru.karistirilan, soru.organel).toContain(sik.deger)
        }
      }
    }
  })

  /**
   * Doğru şık hep aynı yerde olsaydı oyuncu konumu ezberler, soruyu okumayı
   * bırakırdı.
   */
  it('doğru şıkkın yeri değişiyor', () => {
    const yerler = new Set<number>()
    for (let i = 0; i < 200; i++) {
      yerler.add(siklariKur(HUCRE_HAVUZU[0]).findIndex((s) => s.dogruMu))
    }
    expect(yerler.size).toBe(SIK_SAYISI)
  })
})

describe('turHazirla', () => {
  it('havuzun tamamını sıraya koyar, organel tekrarı yok', () => {
    const organeller = turHazirla().map((s) => s.soru.organel)
    expect(organeller).toHaveLength(HUCRE_HAVUZU.length)
    expect(new Set(organeller).size).toBe(organeller.length)
  })
})

describe('havuz', () => {
  it('her organel yalnız bir kez geçiyor', () => {
    expect(new Set(ORGANELLER).size).toBe(ORGANELLER.length)
  })

  it('her sorunun soru cümlesi ve açıklaması var', () => {
    for (const soru of HUCRE_HAVUZU) {
      expect(soru.soru.length, soru.organel).toBeGreaterThan(20)
      expect(soru.soru.endsWith('?'), soru.organel).toBe(true)
      expect(soru.aciklama.length, soru.organel).toBeGreaterThan(20)
    }
  })

  it('çeldirici listesi en az üç farklı, havuzda geçen ad', () => {
    for (const soru of HUCRE_HAVUZU) {
      const { organel, karistirilan } = soru
      expect(karistirilan.length, organel).toBeGreaterThanOrEqual(SIK_SAYISI - 1)
      expect(new Set(karistirilan).size, organel).toBe(karistirilan.length)
      expect(karistirilan, organel).not.toContain(organel)
      for (const ad of karistirilan) expect(ORGANELLER, `${organel} → ${ad}`).toContain(ad)
    }
  })

  /** İki doğru şık: çeldirici sorunun cevabına da uyuyorsa soru bozuk. */
  it('birbirine uyan yapılar aynı soruda şık olmuyor', () => {
    for (const soru of HUCRE_HAVUZU) {
      const uyanlar = BIRBIRINE_UYANLAR[soru.organel] ?? []
      for (const ad of soru.karistirilan) {
        expect(uyanlar, `${soru.organel} sorusunda ${ad}`).not.toContain(ad)
      }
    }
  })

  /** Soru cevabı doğrudan yazsaydı oyun okumaya inerdi. */
  it('soru cümlesi cevabın adını vermiyor', () => {
    for (const soru of HUCRE_HAVUZU) {
      const ad = soru.organel.toLocaleLowerCase('tr')
      expect(soru.soru.toLocaleLowerCase('tr').includes(ad), soru.organel).toBe(false)
    }
  })

  /**
   * Her zorlukta organel olmalı: bir zorluk boş kalsaydı orayı seçen oyuncuya
   * `turSirasi` sessizce bütün havuzu verirdi.
   */
  it('her zorluk seviyesinde organel var', () => {
    for (const zorluk of ZORLUKLAR) {
      expect(
        HUCRE_HAVUZU.some((s) => s.zorluk === zorluk),
        `${zorluk} seviyesinde organel yok`,
      ).toBe(true)
    }
  })
})

describe('banka kaydı', () => {
  /** İpuçlu kart döneminde bankaya düşmüş bir kayıt — `soru` alanı yok. */
  const eskiKayit = {
    organel: 'Ribozom',
    ipuclari: [
      'Zarsızım ve istisnasız bütün hücrelerde bulunurum.',
      'İki alt birimden oluşurum; ancak birleşince çalışırım.',
      'Protein sentezi bende yapılır.',
    ],
    aciklama: 'Prokaryot hücrelerde bulunan tek organeldir.',
    zorluk: 'kolay' as const,
  }

  it('eski kayıt havuzdaki güncel soruyla soruluyor', () => {
    const soru = kayittanSoru(eskiKayit)
    expect(soru?.soru).toBe(HUCRE_HAVUZU.find((s) => s.organel === 'Ribozom')?.soru)
    expect(siklariKur(soru!)).toHaveLength(SIK_SAYISI)
  })

  /** Kimlik değişseydi eski kayıt yeni turda yanlış bilinince ikinci kayıt açılırdı. */
  it('eski ve yeni kaydın kimliği aynı', () => {
    const yeni = hucredenBanka(HUCRE_HAVUZU.find((s) => s.organel === 'Ribozom')!)
    expect(bankaKimligi({ oyun: 'hucre', hucre: eskiKayit })).toBe(bankaKimligi(yeni))
  })

  it('listede eski kayıt da soru cümlesiyle görünüyor', () => {
    expect(bankaSorusuMetni({ oyun: 'hucre', hucre: eskiKayit })).toBe(
      'Hücrede protein sentezinin yapıldığı organel hangisidir?',
    )
  })

  it('havuzdan düşmüş, sorusu olmayan kayıt sorulmuyor ama listede ipucuyla duruyor', () => {
    const kayip = { ...eskiKayit, organel: 'Olmayan yapı' }
    expect(kayittanSoru(kayip)).toBeUndefined()
    expect(bankaSorusuMetni({ oyun: 'hucre', hucre: kayip })).toBe('Protein sentezi bende yapılır.')
  })
})
