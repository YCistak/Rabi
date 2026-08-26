/**
 * Kural Tuzağı oyununun kural havuzu.
 *
 * TYT matematikte kaybedilen puanların önemli bir kısmı hesap hatasından değil,
 * **yanlış hatırlanan bir kuraldan** geliyor: (a+b)² açılımını a²+b² sanmak,
 * kökü terim terim dağıtmak, üsleri toplarken tabanları da toplamak. Bu hatalar
 * çoktan seçmeli bir soruda görünmüyor — şıklardan biri işaretleniyor ve
 * öğrenci nerede yanıldığını fark etmiyor.
 *
 * Oyun bu yüzden şık sormuyor: ekrana **tek bir eşitlik** geliyor ve doğru mu
 * yanlış mı diye soruyor. Kaydırma da bunun için: karar ikili ve hızlı olmalı,
 * düşünecek vakit varsa kuralı bilmek yerine sağlaması yapılıyor.
 *
 * Her kural **çift** olarak duruyor: doğru hâli ve öğrencinin sık düştüğü
 * yanlış hâli. Oyun her soruda hangisini göstereceğini yazı tura atarak
 * seçiyor (`tuzak.ts`), yani cevap dağılımı yarı yarıya — "hep yanlış de"
 * diyerek tur kazanılmıyor. Havuzda hazır soru yok, çiftten üretiliyor.
 *
 * Yanlış hâller uydurulmadı: her biri sınavda gerçekten yapılan bir hata.
 * "Doğru olan hangisi" diye bakıldığında ikisi de akla yatkın görünmeli, yoksa
 * soru okunmadan cevaplanır.
 */

import type { Zorluk } from './ritim'

export type TuzakKonusu =
  | 'ozdeslik'
  | 'uslu'
  | 'koklu'
  | 'mutlak'
  | 'rasyonel'
  | 'esitsizlik'
  | 'fonksiyon'

export const TUZAK_KONU_ADI: Record<TuzakKonusu, string> = {
  ozdeslik: 'Özdeşlikler',
  uslu: 'Üslü sayılar',
  koklu: 'Köklü sayılar',
  mutlak: 'Mutlak değer',
  rasyonel: 'Rasyonel ifadeler',
  esitsizlik: 'Eşitsizlikler',
  fonksiyon: 'Fonksiyonlar',
}

export type TuzakKurali = {
  /** Kuralın doğru yazılışı — ekrana bu geldiğinde cevap "Doğru". */
  dogru: string
  /** Aynı kuralın sık yapılan yanlış yazılışı — cevap "Yanlış". */
  yanlis: string
  /**
   * Neden.
   *
   * Cevaptan sonra gösteriliyor ve **hatayı** anlatıyor, kuralı tekrar etmiyor:
   * öğrencinin ihtiyacı olan şey doğru kuralın ne olduğu değil, yanlışın nerede
   * doğru göründüğü.
   */
  aciklama: string
  konu: TuzakKonusu
  zorluk: Zorluk
}

export const TUZAK_HAVUZU: TuzakKurali[] = [
  // --- Özdeşlikler: en sık ve en pahalı hata ailesi. ---
  {
    dogru: '(a + b)² = a² + 2ab + b²',
    yanlis: '(a + b)² = a² + b²',
    aciklama: 'Kare, terimlere tek tek dağılmıyor: ortadaki 2ab kayboluyor.',
    konu: 'ozdeslik',
    zorluk: 'kolay',
  },
  {
    dogru: '(a − b)² = a² − 2ab + b²',
    yanlis: '(a − b)² = a² − b²',
    aciklama: 'a² − b² çarpanlara ayrılmış hâli değil; o (a − b)(a + b) eder.',
    konu: 'ozdeslik',
    zorluk: 'kolay',
  },
  {
    dogru: 'a² − b² = (a − b)(a + b)',
    yanlis: 'a² + b² = (a + b)(a + b)',
    aciklama: 'Kareler **toplamı** gerçel sayılarda çarpanlara ayrılmıyor.',
    konu: 'ozdeslik',
    zorluk: 'orta',
  },
  {
    dogru: '(a + b)³ = a³ + 3a²b + 3ab² + b³',
    yanlis: '(a + b)³ = a³ + b³',
    aciklama: 'Küpte de ortadaki terimler var; a³ + b³ ayrı bir özdeşlik.',
    konu: 'ozdeslik',
    zorluk: 'orta',
  },
  {
    dogru: 'a³ + b³ = (a + b)(a² − ab + b²)',
    yanlis: 'a³ + b³ = (a + b)(a² + ab + b²)',
    aciklama: 'Küpler toplamında ortadaki terim eksi; artı olan küpler farkında.',
    konu: 'ozdeslik',
    zorluk: 'zor',
  },

  // --- Üslü sayılar ---
  {
    dogru: 'aᵐ · aⁿ = aᵐ⁺ⁿ',
    yanlis: 'aᵐ · aⁿ = aᵐ·ⁿ',
    aciklama: 'Çarpmada üsler toplanıyor; çarpılan üs (aᵐ)ⁿ biçiminde olurdu.',
    konu: 'uslu',
    zorluk: 'kolay',
  },
  {
    dogru: '(aᵐ)ⁿ = aᵐ·ⁿ',
    yanlis: '(aᵐ)ⁿ = aᵐ⁺ⁿ',
    aciklama: 'Üssün üssü çarpılıyor; toplanan üs aᵐ · aⁿ olurdu.',
    konu: 'uslu',
    zorluk: 'kolay',
  },
  {
    dogru: 'a⁰ = 1  (a ≠ 0)',
    yanlis: 'a⁰ = 0',
    aciklama: 'Sıfırıncı kuvvet 1; sıfır olan a¹ değil, hiçbir kuvvet değil.',
    konu: 'uslu',
    zorluk: 'kolay',
  },
  {
    dogru: 'aᵐ + aᵐ = 2aᵐ',
    yanlis: 'aᵐ + aᵐ = a²ᵐ',
    aciklama: 'Toplama üsse dokunmuyor: iki tane aynı terim, katsayıyı 2 yapıyor.',
    konu: 'uslu',
    zorluk: 'orta',
  },
  {
    dogru: '(−a)² = a²',
    yanlis: '(−a)² = −a²',
    aciklama: 'Parantez varsa eksi de kareye giriyor; −a² parantezsiz hâli.',
    konu: 'uslu',
    zorluk: 'orta',
  },
  {
    dogru: 'a⁻ⁿ = 1 / aⁿ',
    yanlis: 'a⁻ⁿ = −aⁿ',
    aciklama: 'Eksi üs işareti değil, sayıyı paydaya taşıyor.',
    konu: 'uslu',
    zorluk: 'orta',
  },
  {
    dogru: '(a · b)ⁿ = aⁿ · bⁿ',
    yanlis: '(a + b)ⁿ = aⁿ + bⁿ',
    aciklama: 'Üs çarpıma dağılıyor, toplamaya dağılmıyor.',
    konu: 'uslu',
    zorluk: 'zor',
  },

  // --- Köklü sayılar ---
  {
    dogru: '√a · √b = √(a · b)',
    yanlis: '√a + √b = √(a + b)',
    aciklama: 'Kök çarpımda birleşiyor, toplamda birleşmiyor: √9 + √16 = 7, √25 = 5.',
    konu: 'koklu',
    zorluk: 'kolay',
  },
  {
    dogru: '√(a²) = |a|',
    yanlis: '√(a²) = a',
    aciklama: 'a eksi olabilir; kök her zaman eksi olmayan değeri veriyor.',
    konu: 'koklu',
    zorluk: 'orta',
  },
  {
    dogru: '√(a² + b²) sadeleşmez',
    yanlis: '√(a² + b²) = a + b',
    aciklama: 'Kök terim terim dağılmıyor: √(3² + 4²) = 5, 3 + 4 = 7.',
    konu: 'koklu',
    zorluk: 'orta',
  },
  {
    dogru: '√a / √b = √(a / b)  (b ≠ 0)',
    yanlis: '√a − √b = √(a − b)',
    aciklama: 'Bölmede birleşiyor, çıkarmada birleşmiyor.',
    konu: 'koklu',
    zorluk: 'zor',
  },
  {
    dogru: '∛(a³) = a',
    yanlis: '∛(a³) = |a|',
    aciklama: 'Tek dereceli kök eksi değeri koruyor; mutlak değer çift derecelide gerekiyor.',
    konu: 'koklu',
    zorluk: 'zor',
  },
  {
    // Konusu köklü: "x² = 9" bir denklem, eşitsizlik değil — karekök alırken
    // ikinci kökün unutulması hatası.
    dogru: 'x² = 9 ⟹ x = 3 veya x = −3',
    yanlis: 'x² = 9 ⟹ x = 3',
    aciklama: 'Karekök alınırken iki kök doğuyor; denklemde eksi kök de çözüm.',
    konu: 'koklu',
    zorluk: 'kolay',
  },

  // --- Mutlak değer ---
  {
    dogru: '|a · b| = |a| · |b|',
    yanlis: '|a + b| = |a| + |b|',
    aciklama: 'Çarpımda eşit, toplamda yalnızca eşitsizlik var: |a + b| ≤ |a| + |b|.',
    konu: 'mutlak',
    zorluk: 'orta',
  },
  {
    dogru: '|x| = 3 ⟹ x = 3 veya x = −3',
    yanlis: '|x| = 3 ⟹ x = 3',
    aciklama: 'Mutlak değerli denklemde iki kök var; eksi olanı unutuluyor.',
    konu: 'mutlak',
    zorluk: 'kolay',
  },
  {
    dogru: '|x| < 3 ⟹ −3 < x < 3',
    yanlis: '|x| < 3 ⟹ x < 3',
    aciklama: 'Küçüktür eşitsizliği aralık veriyor; alt sınır düşüyor.',
    konu: 'mutlak',
    zorluk: 'orta',
  },

  // --- Rasyonel ifadeler ---
  {
    dogru: '1/a + 1/b = (a + b) / (a · b)',
    yanlis: '1/a + 1/b = 1 / (a + b)',
    aciklama: 'Paydalar toplanmıyor, eşitleniyor: 1/2 + 1/3 = 5/6, 1/5 değil.',
    konu: 'rasyonel',
    zorluk: 'kolay',
  },
  {
    dogru: '(a + b) / c = a/c + b/c',
    yanlis: 'c / (a + b) = c/a + c/b',
    aciklama: 'Bölme payda toplamına dağılmıyor; sadeleşen taraf pay tarafı.',
    konu: 'rasyonel',
    zorluk: 'orta',
  },
  {
    dogru: '(a/b) / (c/d) = (a · d) / (b · c)',
    yanlis: '(a/b) / (c/d) = (a · c) / (b · d)',
    aciklama: 'Bölmede ikinci kesir ters çevriliyor; olduğu gibi çarpılmıyor.',
    konu: 'rasyonel',
    zorluk: 'orta',
  },
  {
    dogru: '(a + b) / a sadeleşmez',
    yanlis: '(a + b) / a = b',
    aciklama: 'Sadeleştirme çarpanlar arasında olur, terimler arasında değil.',
    konu: 'rasyonel',
    zorluk: 'zor',
  },

  // --- Eşitsizlikler ---
  {
    dogru: 'a < b ve c < 0 ⟹ a · c > b · c',
    yanlis: 'a < b ve c < 0 ⟹ a · c < b · c',
    aciklama: 'Eksi sayıyla çarpınca eşitsizlik yön değiştiriyor.',
    konu: 'esitsizlik',
    zorluk: 'orta',
  },
  {
    dogru: 'x² > x, ancak x < 0 veya x > 1 iken doğru',
    yanlis: 'x² > x her x için doğru',
    aciklama: '0 ile 1 arasında kare küçültüyor: (1/2)² = 1/4.',
    konu: 'esitsizlik',
    zorluk: 'zor',
  },

  // --- Fonksiyonlar ---
  {
    dogru: '(f ∘ g)(x) = f(g(x))',
    yanlis: '(f ∘ g)(x) = g(f(x))',
    aciklama: 'İçteki fonksiyon önce çalışıyor; bileşke soldan sağa okunmuyor.',
    konu: 'fonksiyon',
    zorluk: 'orta',
  },
  {
    dogru: 'f(a + b) genelde f(a) + f(b) değildir',
    yanlis: 'f(a + b) = f(a) + f(b)',
    aciklama: 'Yalnızca doğrusal fonksiyonlarda geçerli: f(x) = x² için tutmuyor.',
    konu: 'fonksiyon',
    zorluk: 'zor',
  },
  {
    dogru: 'f⁻¹(x), f’nin ters fonksiyonudur',
    yanlis: 'f⁻¹(x) = 1 / f(x)',
    aciklama: 'Üstteki −1 tersi değil, ters fonksiyonu gösteriyor.',
    konu: 'fonksiyon',
    zorluk: 'zor',
  },
]

/** Havuzdaki kural sayısı — tanıtım ekranı bunu yazıyor. */
export const TUZAK_BOYUTU = TUZAK_HAVUZU.length
