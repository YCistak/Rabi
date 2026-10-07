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
 * `yuz` ve `kafa` dışındakiler **tam boy**: gövde ancak 70 pikselin üstünde
 * okunuyor.
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
  'uyuyan',
  'yazan',
  'ayracli',
] as const

export type MaskotPozu = (typeof MASKOT_POZLARI)[number]

/** Kaynak görsellerin kenarı (piksel); `MASKOT_YAN_BOSLUK` bu ölçekte. */
const KAYNAK_BOYUT = 256

/**
 * Her pozun görselindeki saydam yan boşluk (sol, sağ), 256 piksellik kaynakta.
 *
 * Görseller kare ve tavşan ortada, ama genişliği pozdan poza çok değişiyor:
 * kitap okuyan dar, megafonlu geniş. Kutuya göre hizalayınca dar pozların
 * yanında 20 pikseli aşan boş şerit kalıyordu ve yanındaki yazı tavşandan
 * kopuk duruyordu (kullanıcı fark etti). `gorunurKutu` hizayı tavşanın
 * kendisine göre kuruyor. Değerler görsellerin alfa kanalından ölçüldü;
 * `maskot.test.ts` görsellerle karşılaştırıyor, poz eklenince ya da görsel
 * değişince test söyler.
 */
export const MASKOT_YAN_BOSLUK: Record<MaskotPozu, readonly [number, number]> = {
  'yuz': [40, 40],
  'tam': [77, 77],
  'el-sallayan': [50, 50],
  'okuyan': [66, 66],
  'kupali': [41, 40],
  'sevinen': [44, 44],
  'uzgun': [68, 68],
  'dusunen': [71, 70],
  'kahveli': [77, 77],
  'isaretci': [47, 47],
  'kafa': [46, 46],
  'ziplayan': [37, 37],
  'defterli': [77, 77],
  'basparmak': [77, 77],
  'uzanan': [8, 7],
  'dans': [39, 38],
  'gerinen': [57, 56],
  'selamlayan': [52, 51],
  'bagdas': [57, 56],
  'takla': [8, 7],
  'kahkaha': [36, 35],
  'elleri-belde': [71, 70],
  'megafonlu': [16, 16],
  'kitapli': [18, 17],
  'saatli': [72, 71],
  'laptoplu': [54, 54],
  'tahtali': [33, 33],
  'buyutecli': [52, 52],
  'abakuslu': [43, 43],
  'bitkili': [33, 33],
  'haritali': [57, 56],
  'damgali': [47, 47],
  'fotografci': [45, 45],
  'supuren': [53, 52],
  'cantali': [52, 52],
  'durbunlu': [57, 57],
  'esneyen': [60, 59],
  'alkislayan': [60, 60],
  'uyuyan': [8, 7],
  'yazan': [57, 57],
  'ayracli': [54, 53],
}

/**
 * Tavşanın `boyut` genişliğinde çizildiğinde görünen kısmı: soldaki saydam
 * boşluk ve görünen genişlik (piksel). `Rabi` görseli kutunun genişliğine
 * sığdırıyor (`object-contain`, kare görsel), ölçek `boyut / 256`.
 */
export function gorunurKutu(poz: MaskotPozu, boyut: number): { sol: number; genislik: number } {
  const [sol, sag] = MASKOT_YAN_BOSLUK[poz]
  const olcek = boyut / KAYNAK_BOYUT
  return { sol: sol * olcek, genislik: (KAYNAK_BOYUT - sol - sag) * olcek }
}

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
