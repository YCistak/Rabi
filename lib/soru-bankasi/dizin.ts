/* Bu dosya soru-bankasi-aktar.mjs tarafından veri eşlemesiyle güncellenir. */
import { programBul } from '../konu'
import type { BankaSorusu } from './tip'

export type BankaKonusu = { id: string; ad: string; sayi: number; yukle?: () => Promise<{ default: BankaSorusu[] }> }
export type BankaTemasi = { id: string; ad: string; konular: BankaKonusu[] }
export type BankaSinifi = { sinif: 9 | 10 | 11; temalar: BankaTemasi[] }

export const AKTARILAN_KONULAR: Record<string, Pick<BankaKonusu, 'sayi' | 'yukle'>> = {
  'mat10-alan': { sayi: 71, yukle: () => import('./veri/mat10-alan.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-asal-carpan': { sayi: 60, yukle: () => import('./veri/mat10-asal-carpan.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-bolunebilme': { sayi: 76, yukle: () => import('./veri/mat10-bolunebilme.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-ebob-ekok': { sayi: 80, yukle: () => import('./veri/mat10-ebob-ekok.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-fonksiyon-sart': { sayi: 56, yukle: () => import('./veri/mat10-fonksiyon-sart.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-karesel': { sayi: 38, yukle: () => import('./veri/mat10-karesel.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-kategorik': { sayi: 39, yukle: () => import('./veri/mat10-kategorik.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-kategorik-inceleme': { sayi: 36, yukle: () => import('./veri/mat10-kategorik-inceleme.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-sinus-kosinus': { sayi: 68, yukle: () => import('./veri/mat10-sinus-kosinus.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-trigonometri': { sayi: 66, yukle: () => import('./veri/mat10-trigonometri.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-yardimci': { sayi: 76, yukle: () => import('./veri/mat10-yardimci.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-cokgen-problem': { sayi: 72, yukle: () => import('./veri/mat11-cokgen-problem.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-cokgen-sinif': { sayi: 42, yukle: () => import('./veri/mat11-cokgen-sinif.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-disbukey': { sayi: 70, yukle: () => import('./veri/mat11-disbukey.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-dortgen': { sayi: 83, yukle: () => import('./veri/mat11-dortgen.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-hazir-veri': { sayi: 53, yukle: () => import('./veri/mat11-hazir-veri.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-iki-nicel': { sayi: 43, yukle: () => import('./veri/mat11-iki-nicel.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-ozel-dortgen': { sayi: 94, yukle: () => import('./veri/mat11-ozel-dortgen.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-trig-denklem': { sayi: 115, yukle: () => import('./veri/mat11-trig-denklem.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-trig-fonk': { sayi: 113, yukle: () => import('./veri/mat11-trig-fonk.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-ustel': { sayi: 80, yukle: () => import('./veri/mat11-ustel.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-ustel-ters': { sayi: 53, yukle: () => import('./veri/mat11-ustel-ters.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-araliklar': { sayi: 50, yukle: () => import('./veri/mat9-araliklar.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-benzer-ucgen': { sayi: 47, yukle: () => import('./veri/mat9-benzer-ucgen.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-cebirsel-ifade': { sayi: 56, yukle: () => import('./veri/mat9-cebirsel-ifade.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-denklem-esitsizlik': { sayi: 92, yukle: () => import('./veri/mat9-denklem-esitsizlik.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-dogrusal': { sayi: 93, yukle: () => import('./veri/mat9-dogrusal.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-donusum': { sayi: 56, yukle: () => import('./veri/mat9-donusum.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-eslik-kosul': { sayi: 54, yukle: () => import('./veri/mat9-eslik-kosul.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-mutlak-deger': { sayi: 72, yukle: () => import('./veri/mat9-mutlak-deger.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-sayi-kumeleri': { sayi: 53, yukle: () => import('./veri/mat9-sayi-kumeleri.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-teoremler': { sayi: 20, yukle: () => import('./veri/mat9-teoremler.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-ucgen-ozellik': { sayi: 91, yukle: () => import('./veri/mat9-ucgen-ozellik.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-uslu-koklu': { sayi: 92, yukle: () => import('./veri/mat9-uslu-koklu.json') as unknown as Promise<{ default: BankaSorusu[] }> },
}

export const BANKA_DIZINI: BankaSinifi[] = ([9, 10, 11] as const).map((sinif) => { const program = programBul('matematik', sinif); return { sinif, temalar: (program?.temalar ?? []).map((tema) => ({ id: tema.id, ad: tema.ad, konular: tema.konular.map((konu) => ({ id: konu.id, ad: konu.ad, ...(AKTARILAN_KONULAR[konu.id] ?? { sayi: 0 }) })) })) } })
export function bankaKonusuBul(id: string): BankaKonusu | undefined { return BANKA_DIZINI.flatMap((sinif) => sinif.temalar).flatMap((tema) => tema.konular).find((konu) => konu.id === id) }
