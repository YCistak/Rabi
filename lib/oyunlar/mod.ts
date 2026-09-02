/**
 * Oyun modları — turu ne bitirir, süre kime ait.
 *
 * Tek bir tur kuralı yerine dört tane olmasının sebebi, tek kuralın iki farklı
 * kullanıcıyı birden idare edememesi. Her yanlışın turu bitirdiği tasarım
 * bileni ödüllendiriyor ama yeni öğrenen için ceza makinesi: üçüncü soruda tur
 * kapanınca oyun öğretmeyi bırakıp eliyor. Süre baskısı da öyle — birine
 * heyecan, ötekine engel.
 *
 * O yüzden kural moda taşındı:
 *
 * - **Sıradan** turun kendi saati var (60 sn). Yanlış turu bitirmiyor, süreden
 *   götürüyor. Varsayılan ve bütün oyunlarda aynı — rekorlar ancak ortak bir
 *   ölçüde karşılaştırılabilir.
 * - **Turbo** aynı tur, yarı süre. Ayrı bir oyun değil, aynı oyunun sıkıştırılmış
 *   hâli; ölçtüğü şey bilgi değil, bilginin ne kadar hazır olduğu.
 * - **Ani ölüm** süreyi soruya veriyor ve ilk yanlışta turu kapatıyor. Sistem
 *   bir süre yalnızca böyle çalışıyordu; artık dört moddan biri.
 * - **Rahat** ne süre tutuyor ne eliyor. Karşılığı da yok: rekora ve istatistiğe
 *   **sayılmıyor**. Süresiz bir turda "kaç doğru yaptın" sorusunun cevabı
 *   oyuncunun sabrını ölçer, bilgisini değil.
 *
 * Mod seçimi oyun başına değil ortak (`rabi-oyun-modu`): zorluk oyundan oyuna
 * gerçekten değişiyor ama "bugün acele etmek istemiyorum" oyuna göre değişen
 * bir şey değil.
 */

import { TUR_SURESI, YANLIS_CEZASI } from './tur'

export type OyunModu = 'siradan' | 'turbo' | 'ani-olum' | 'rahat'

/** Turbo turun süresi — sıradan turun yarısı. */
export const TURBO_SURESI = TUR_SURESI / 2

export type ModTanimi = {
  id: OyunModu
  ad: string
  simge: string
  /** Seçim çipinin altındaki tek satır. */
  ozet: string
  /** Kuralın tamamı — tanıtım penceresinde seçili modun altında yazıyor. */
  kural: string
  /**
   * Turun kendi saati, saniye. `null` ise saat tura ait değil: ya soru başına
   * işliyor (ani ölüm) ya da hiç yok (rahat).
   */
  turSuresi: number | null
  /** Soru başına sayaç var mı — `SORU_SURESI` ancak bu modda kullanılıyor. */
  soruSayaci: boolean
  /** Yanlış cevap turu bitirir mi. */
  elerMi: boolean
  /** Yanlışın tur saatinden götürdüğü saniye. Tur saati yoksa anlamsız. */
  yanlisCezasi: number
  /** Tur rekora, istatistiğe ve oyun geçmişine yazılıyor mu. */
  kayitliMi: boolean
}

export const MODLAR = {
  siradan: {
    id: 'siradan',
    ad: 'Sıradan',
    simge: '⏳',
    ozet: `${TUR_SURESI} saniye`,
    kural: `Tur ${TUR_SURESI} saniye. Yanlış turu bitirmez ama süreden ${YANLIS_CEZASI} saniye götürür.`,
    turSuresi: TUR_SURESI,
    soruSayaci: false,
    elerMi: false,
    yanlisCezasi: YANLIS_CEZASI,
    kayitliMi: true,
  },
  turbo: {
    id: 'turbo',
    ad: 'Turbo',
    simge: '⚡',
    ozet: `${TURBO_SURESI} saniye`,
    kural: `Aynı tur, ${TURBO_SURESI} saniye. Yanlışın cezası da aynı: ${YANLIS_CEZASI} saniye.`,
    turSuresi: TURBO_SURESI,
    soruSayaci: false,
    elerMi: false,
    yanlisCezasi: YANLIS_CEZASI,
    kayitliMi: true,
  },
  'ani-olum': {
    id: 'ani-olum',
    ad: 'Ani Ölüm',
    simge: '💀',
    ozet: 'Tek yanlış',
    kural:
      'Her sorunun kendi süresi var ve ilk yanlışta tur biter. Süre dolması da yanlış sayılır.',
    turSuresi: null,
    soruSayaci: true,
    elerMi: true,
    yanlisCezasi: 0,
    kayitliMi: true,
  },
  rahat: {
    id: 'rahat',
    ad: 'Rahat',
    simge: '🌿',
    ozet: 'Süresiz',
    kural:
      'Süre yok, yanlış turu bitirmez. Karşılığı da yok: rekora ve istatistiğe sayılmaz, yalnızca öğrenmek için.',
    turSuresi: null,
    soruSayaci: false,
    elerMi: false,
    yanlisCezasi: 0,
    kayitliMi: false,
  },
} as const satisfies Record<OyunModu, ModTanimi>

/** Seçim çiplerinin sırası — soldan sağa artan baskı, sonda baskısız olan. */
export const MOD_SIRASI: readonly OyunModu[] = ['siradan', 'turbo', 'ani-olum', 'rahat']

export const VARSAYILAN_MOD: OyunModu = 'siradan'

export function modTanimi(mod: OyunModu): ModTanimi {
  return MODLAR[mod]
}

/**
 * Kayıttan okunan modu güvenli hâle getirir.
 *
 * `localStorage` elle kurcalanabiliyor ve ileride bir mod kaldırılabilir;
 * tanınmayan değer varsayılana düşüyor, yoksa `MODLAR[mod]` `undefined` dönüp
 * oyun hiç açılmazdı.
 */
export function moduNormalize(ham: unknown): OyunModu {
  return MOD_SIRASI.includes(ham as OyunModu) ? (ham as OyunModu) : VARSAYILAN_MOD
}

export function modKayitliMi(mod: OyunModu): boolean {
  return MODLAR[mod].kayitliMi
}

/**
 * Turun gerçekte hangi modla işlediği.
 *
 * Oyun Bankası turu modu dinlemiyor: oradaki sorular zaten bir kez yanlış
 * bilinmiş olanlar ve turun amacı hepsini bir kez daha görmek. Süreli
 * bir tur o işi yarıda keser, eleyen bir tur imkânsız kılardı. Banka turu bu
 * yüzden her zaman soru başına süreyle işliyor ve eleme `elerMi` içinde ayrıca
 * kapatılıyor (`ritim.ts`).
 */
export function etkinMod(mod: OyunModu, bankaTuru: boolean): OyunModu {
  return bankaTuru ? 'ani-olum' : mod
}
