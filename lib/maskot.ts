/**
 * Maskotun pozları ve ruh hâlleri — bileşenden bağımsız liste.
 *
 * Bileşen (`components/maskot/rabi.tsx`) burada duruyordu; `lib/` altındaki saf
 * karar fonksiyonları da (`ana-maskot.ts`) poz döndürdüğü için liste buraya
 * taşındı — `lib/` bir bileşen dosyasına bağımlı olmasın diye.
 */

/**
 * Rabi'nin ruh hâlleri.
 *
 * Durum **çizimi değiştirmiyor**; yalnızca ekran okuyucuya söylenen etiketi
 * belirliyor. Çizilecek görseli seçen şey `poz` (AGENTS.md › "durum ile poz
 * ayrı kalıyor").
 */
export type MaskotDurumu = 'normal' | 'mutlu' | 'uykulu' | 'calisiyor' | 'uzgun' | 'kutlama'

/**
 * Bütün pozlar. Her biri `public/tavsan-<poz>.png` — üreten yer
 * `scripts/maskot-uret.mjs`, `maskot.test.ts` dosyaların varlığını denetliyor.
 *
 * `yuz`, `kafa` ve `kafa-*` dışındakiler **tam boy**: gövde ancak 70
 * pikselin üstünde okunuyor. `kafa-*` ana sayfa başlığının durum kırpımları
 * (58 piksel): pozun baş ve üst gövdesi.
 */
export const MASKOT_POZLARI = [
  // İlk takım
  'yuz',
  'tam',
  'el-sallayan',
  'okuyan',
  'kupali',
  'sevinen',
  'uzgun',
  'dusunen',
  'kahveli',
  'isaretci',
  'kafa',
  'ziplayan',
  // İkinci takım (v2)
  'defterli',
  'basparmak',
  'uzanan',
  'dans',
  'gerinen',
  'selamlayan',
  'bagdas',
  'takla',
  'kahkaha',
  'elleri-belde',
  'megafonlu',
  'kitapli',
  'saatli',
  'laptoplu',
  'tahtali',
  'buyutecli',
  'abakuslu',
  'bitkili',
  'haritali',
  'damgali',
  'fotografci',
  'supuren',
  'cantali',
  'durbunlu',
  'esneyen',
  'alkislayan',
  // Ana sayfa başlığının durum kafaları
  'kafa-uyuyan',
  'kafa-gerinen',
  'kafa-yazan',
  'kafa-kitapli',
  'kafa-laptoplu',
  'kafa-kahveli',
  'kafa-dans',
  'kafa-alkislayan',
  'kafa-kahkaha',
  'kafa-elleri-belde',
  'kafa-bagdas',
  'kafa-uzgun',
] as const

export type MaskotPozu = (typeof MASKOT_POZLARI)[number]

/** Poz → dosya. Ad kuralı tek: `tavsan-<poz>.png`. */
export function pozGorseli(poz: MaskotPozu): string {
  return `/tavsan-${poz}.png`
}

/**
 * Aynı bağlamda dönüşümlü pozlar için günlük seçim.
 *
 * Seçim günün tarihinden (`YYYY-AA-GG`) türüyor — `gunun-hali.ts`teki cümle
 * seçimiyle aynı kural: gün içinde sabit, günden güne değişiyor. Rastgele
 * olsaydı maskot her yeniden çizimde başka bir tavşana dönerdi.
 */
export function gununPozu<T>(iso: string, pozlar: readonly T[], kaydir = 0): T {
  const [y, a, g] = iso.split('-').map(Number)
  const gun = Math.round(Date.UTC(y, a - 1, g) / 86_400_000)
  return pozlar[(((gun + kaydir) % pozlar.length) + pozlar.length) % pozlar.length]
}
