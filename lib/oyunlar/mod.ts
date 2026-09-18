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
 * ## Mod tur başlamadan seçiliyor
 *
 * Seçim `ModSecimi` ile tanıtım ekranının ilk adımında ve dördü de açık.
 * Bir süre kaldırılmıştı — turu başlatmak isteyen kullanıcının önüne, cevabını
 * ancak oynayarak öğreneceği iki soru birden (mod ve zorluk) çıkıyor ve ikisi
 * de "Başla"yı bir ekran öteye itiyordu. O sorun seçimin kendisinde değil
 * **zorunluluğunda**: seçim artık varsayılanıyla geliyor (`VARSAYILAN_MOD`),
 * hiçbir şeye dokunmayan kullanıcı Sıradan turu oynuyor ve adım tek dokunuşla
 * geçiliyor.
 *
 * Seçim bütün oyunlarda ortak ve saklanıyor (`ANAHTARLAR.oyunModu`): mod turun
 * nasıl işleyeceğini söylüyor, oyunun ne sorduğunu değil — "Turbo sevdim"
 * diyen kullanıcı bunu her oyunda yeniden seçmemeli. Zorluk ise oyun başına
 * ayrı, çünkü o oyunun sorduğu şeye ait.
 *
 * Tek istisna Oyun Bankası turu (`etkinMod`): seçim orada sorulmuyor.
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

export function modKayitliMi(mod: OyunModu): boolean {
  return MODLAR[mod].kayitliMi
}

/**
 * Turun hangi modla işlediği.
 *
 * Oyun Bankası turu seçimi **dinlemiyor**: oradaki sorular zaten bir kez
 * yanlış bilinmiş olanlar ve turun amacı hepsini bir kez daha görmek. Tur
 * saatli bir mod o işi yarıda keser, o yüzden banka turu soru başına süreyle
 * işliyor; eleme de `elerMi` içinde ayrıca kapatılıyor (`ritim.ts`). Seçim
 * ekranı da bu yüzden banka turunda hiç çıkmıyor — sunulup dinlenmeyen bir
 * seçim, yalan söyleyen bir arayüzdür.
 *
 * Oyun ekranları bunu doğrudan çağırmıyor, seçimi bağlamdan okuyan
 * `useEtkinMod` sarmalını kullanıyor (`components/tur-ayari-baglami.tsx`).
 */
export function etkinMod(bankaTuru: boolean, secilen: OyunModu = VARSAYILAN_MOD): OyunModu {
  return bankaTuru ? 'ani-olum' : secilen
}
