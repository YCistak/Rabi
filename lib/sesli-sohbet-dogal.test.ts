import { describe, expect, it } from 'vitest'
import { sesliMetniCoz, type SesliSoru, type SesliTopluSonuc } from './sesli-giris'
import { rabiCevabi } from './sesli-sohbet'
import { HAZIR_SABLONLAR, secilebilirSablonlar } from './sablonlar'

const sablonlar = secilebilirSablonlar(HAZIR_SABLONLAR, 12, null)
const secenek = { sablonlar, varsayilanSablonId: 'tyt' }

type DogalOrnek = {
  metin: string
  sorular: SesliSoru[]
  denemeDersleri?: { dersId: string; dogru: number; yanlis: number }[]
  denemeToplu?: SesliTopluSonuc[]
  cevapta?: string
}

/** Karşılıklı konuşmada duyulabilecek, sabit sırayla üretilen 120 doğal örnek. */
const ORNEKLER: DogalOrnek[] = [
  ...Array.from({ length: 24 }, (_, sira) => ({
    metin: `Merhaba abi bugün ${30 + sira} tane matematik sorusu çözdüm`,
    sorular: [{ ders: 'Matematik', toplam: 30 + sira, dogru: 0, yanlis: 0 }],
    cevapta: 'not aldım.',
  })),
  ...['Merhaba', 'Selam kanka', 'Nasılsın hocam', 'Sağ ol abi', 'Görüşürüz', 'Bugün hiç soru çözmedim', 'Bugün çalışmadım', 'Bir şey yapmadım', 'Boş geçti', 'Çok yoruldum', 'Sıkıldım', 'Canım sıkkın', 'Yapamıyorum', 'Motivasyonum yok', 'Stresliyim', 'Ne yapabilirsin', 'Nasıl kullanılır', 'Ne diyeyim', 'Yardım eder misin', 'İyi geceler'].map((metin) => ({ metin, sorular: [] })),
  ...Array.from({ length: 20 }, () => ({
    metin: "Merhaba abi bugün 50 tane matematik sorusu çözdüm matematik sorularının 20'si doğru 10 tanesi yanlış kalanları ise boştu",
    sorular: [{ ders: 'Matematik', toplam: 50, dogru: 20, yanlis: 10 }],
    cevapta: 'Merhaba!',
  })),
  ...Array.from({ length: 20 }, (_, sira) => ({
    metin: `TYT denemesinde sosyalden ${10 + (sira % 6)} doğru 2 yanlış yaptım`,
    sorular: [],
    denemeDersleri: [],
    denemeToplu: [{ grup: 'sosyal', dogru: 10 + (sira % 6), yanlis: 2 }],
  })),
  ...Array.from({ length: 20 }, () => ({
    metin: 'TYT denemesine girdim 20 doğru 20 yanlış Türkçe yaptım 10 doğru 30 yanlış matematik yaptım',
    sorular: [],
    denemeDersleri: [
      { dersId: 'turkce', dogru: 20, yanlis: 20 },
      { dersId: 'matematik', dogru: 10, yanlis: 30 },
    ],
  })),
  ...Array.from({ length: 16 }, () => ({
    metin: "bugün 50 Türkçe çözdüm 10 tanesi doğru 30 tanesi boş denemeye girdim denemede TYT denemesi bu arada 10 tane Türkçe doğrusu yaptım 20'si yanlıştı matematikten 20 doğru 20 yanlış yaptım",
    sorular: [{ ders: 'Türkçe', toplam: 50, dogru: 10, yanlis: 10 }],
    denemeDersleri: [
      { dersId: 'turkce', dogru: 10, yanlis: 20 },
      { dersId: 'matematik', dogru: 20, yanlis: 20 },
    ],
  })),
]

describe('sesli sohbet — doğal konuşma eğitimi', () => {
  it('en az 120 karşılıklı konuşma örneği kapsar', () => {
    expect(ORNEKLER.length).toBeGreaterThanOrEqual(120)
  })

  it.each(ORNEKLER)('$metin', (ornek) => {
    const cozum = sesliMetniCoz(ornek.metin, secenek)
    expect(cozum.sorular).toEqual(ornek.sorular)
    if (ornek.denemeDersleri === undefined) {
      expect(cozum.deneme).toBeNull()
    } else {
      expect(cozum.deneme?.dersler).toEqual(ornek.denemeDersleri)
      expect(cozum.deneme?.toplu ?? []).toEqual(ornek.denemeToplu ?? [])
    }
    if (ornek.cevapta) {
      expect(rabiCevabi(cozum, { sablonlar, mesajSirasi: 0, metin: ornek.metin }).join(' ')).toContain(ornek.cevapta)
    }
    if (ornek.sorular.length === 0 && ornek.denemeDersleri === undefined) {
      expect(rabiCevabi(cozum, { sablonlar, mesajSirasi: 0, metin: ornek.metin }).join(' ')).not.toContain('Bunu anlayamadım')
    }
  })
})
