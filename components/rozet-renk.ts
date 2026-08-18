import type { RozetKademesi } from '@/lib/rozetler'

/**
 * Kademe renkleri. Sunum tarafına ait olduğu için `lib/rozetler.ts` içinde
 * durmuyor, ama rozet ekranı ile kutlama penceresi aynı paleti kullanmak
 * zorunda — ikisinin ortak yeri burası.
 *
 * Renkler madenin gerçek rengini değil, **birbirinden ayrılmayı** kovalıyor:
 * temada bronz diye bir aile yok ve krem (`isl`) ile altın (`warning-soft`)
 * birebir aynı hex'e düşüyor, yan yana konunca iki kademe tek renk görünüyordu.
 * Bu yüzden dört ayrı aile seçildi — mercan, mavi, altın, mor — hepsinin koyu
 * tema karşılığı tanımlı.
 */
export const KADEME_SINIFI: Record<
  RozetKademesi,
  { kenar: string; zemin: string; yazi: string }
> = {
  bronz: { kenar: 'border-ikincil/35', zemin: 'bg-ikincil-soft', yazi: 'text-ikincil' },
  gumus: { kenar: 'border-primary/35', zemin: 'bg-primary-soft', yazi: 'text-primary' },
  altin: { kenar: 'border-warning/50', zemin: 'bg-warning-soft', yazi: 'text-warning' },
  efsane: { kenar: 'border-edb-ok/50', zemin: 'bg-edb', yazi: 'text-edb-koyu' },
}
