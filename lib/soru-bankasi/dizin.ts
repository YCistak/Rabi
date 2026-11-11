/* Bu dosya soru-bankasi-aktar.mjs tarafından veri eşlemesiyle güncellenir. */
import { programBul } from '../konu'
import type { BankaSorusu } from './tip'

export type BankaKonusu = { id: string; ad: string; sayi: number; yukle?: () => Promise<{ default: BankaSorusu[] }> }
export type BankaTemasi = { id: string; ad: string; konular: BankaKonusu[] }
export type BankaSinifi = { sinif: 9 | 10 | 11; temalar: BankaTemasi[] }

export const AKTARILAN_KONULAR: Record<string, Pick<BankaKonusu, 'sayi' | 'yukle'>> = {
  'mat10-alan': { sayi: 71, yukle: () => import('./veri/mat10-alan.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-algoritmik-yapi': { sayi: 18, yukle: () => import('./veri/mat10-algoritmik-yapi.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-asal-carpan': { sayi: 60, yukle: () => import('./veri/mat10-asal-carpan.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-bayes': { sayi: 19, yukle: () => import('./veri/mat10-bayes.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-bolunebilme': { sayi: 76, yukle: () => import('./veri/mat10-bolunebilme.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-denklem-problem': { sayi: 35, yukle: () => import('./veri/mat10-denklem-problem.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-dogru': { sayi: 16, yukle: () => import('./veri/mat10-dogru.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-ebob-ekok': { sayi: 80, yukle: () => import('./veri/mat10-ebob-ekok.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-fonksiyon-sart': { sayi: 56, yukle: () => import('./veri/mat10-fonksiyon-sart.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-karekok': { sayi: 52, yukle: () => import('./veri/mat10-karekok.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-karesel': { sayi: 96, yukle: () => import('./veri/mat10-karesel.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-kategorik': { sayi: 40, yukle: () => import('./veri/mat10-kategorik.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-kategorik-inceleme': { sayi: 36, yukle: () => import('./veri/mat10-kategorik-inceleme.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-kosullu': { sayi: 19, yukle: () => import('./veri/mat10-kosullu.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-nokta': { sayi: 18, yukle: () => import('./veri/mat10-nokta.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-rasyonel': { sayi: 59, yukle: () => import('./veri/mat10-rasyonel.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-sayma': { sayi: 15, yukle: () => import('./veri/mat10-sayma.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-sinus-kosinus': { sayi: 68, yukle: () => import('./veri/mat10-sinus-kosinus.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-ters-fonksiyon': { sayi: 52, yukle: () => import('./veri/mat10-ters-fonksiyon.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-trigonometri': { sayi: 70, yukle: () => import('./veri/mat10-trigonometri.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat10-yardimci': { sayi: 76, yukle: () => import('./veri/mat10-yardimci.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-bileske': { sayi: 75, yukle: () => import('./veri/mat11-bileske.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-cokgen-problem': { sayi: 72, yukle: () => import('./veri/mat11-cokgen-problem.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-cokgen-sinif': { sayi: 56, yukle: () => import('./veri/mat11-cokgen-sinif.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-disbukey': { sayi: 80, yukle: () => import('./veri/mat11-disbukey.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-dort-islem': { sayi: 39, yukle: () => import('./veri/mat11-dort-islem.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-dortgen': { sayi: 92, yukle: () => import('./veri/mat11-dortgen.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-hazir-veri': { sayi: 60, yukle: () => import('./veri/mat11-hazir-veri.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-iki-nicel': { sayi: 59, yukle: () => import('./veri/mat11-iki-nicel.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-log': { sayi: 119, yukle: () => import('./veri/mat11-log.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-ozel-dortgen': { sayi: 114, yukle: () => import('./veri/mat11-ozel-dortgen.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-trig-denklem': { sayi: 115, yukle: () => import('./veri/mat11-trig-denklem.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-trig-fonk': { sayi: 132, yukle: () => import('./veri/mat11-trig-fonk.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-ustel': { sayi: 80, yukle: () => import('./veri/mat11-ustel.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-ustel-log-denklem': { sayi: 99, yukle: () => import('./veri/mat11-ustel-log-denklem.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat11-ustel-ters': { sayi: 57, yukle: () => import('./veri/mat11-ustel-ters.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-algoritma': { sayi: 38, yukle: () => import('./veri/mat9-algoritma.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-araliklar': { sayi: 60, yukle: () => import('./veri/mat9-araliklar.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-benzer-ucgen': { sayi: 47, yukle: () => import('./veri/mat9-benzer-ucgen.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-benzerlik-problem': { sayi: 42, yukle: () => import('./veri/mat9-benzerlik-problem.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-cebirsel-ifade': { sayi: 58, yukle: () => import('./veri/mat9-cebirsel-ifade.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-denklem-esitsizlik': { sayi: 99, yukle: () => import('./veri/mat9-denklem-esitsizlik.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-dogrusal': { sayi: 97, yukle: () => import('./veri/mat9-dogrusal.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-donusum': { sayi: 56, yukle: () => import('./veri/mat9-donusum.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-eslik-kosul': { sayi: 54, yukle: () => import('./veri/mat9-eslik-kosul.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-mantik': { sayi: 72, yukle: () => import('./veri/mat9-mantik.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-mantik-algoritma': { sayi: 34, yukle: () => import('./veri/mat9-mantik-algoritma.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-mutlak-deger': { sayi: 79, yukle: () => import('./veri/mat9-mutlak-deger.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-sayi-kumeleri': { sayi: 56, yukle: () => import('./veri/mat9-sayi-kumeleri.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-teoremler': { sayi: 92, yukle: () => import('./veri/mat9-teoremler.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-ucgen-ozellik': { sayi: 91, yukle: () => import('./veri/mat9-ucgen-ozellik.json') as unknown as Promise<{ default: BankaSorusu[] }> },
  'mat9-uslu-koklu': { sayi: 96, yukle: () => import('./veri/mat9-uslu-koklu.json') as unknown as Promise<{ default: BankaSorusu[] }> },
}

export const BANKA_DIZINI: BankaSinifi[] = ([9, 10, 11] as const).map((sinif) => { const program = programBul('matematik', sinif); return { sinif, temalar: (program?.temalar ?? []).map((tema) => ({ id: tema.id, ad: tema.ad, konular: tema.konular.map((konu) => ({ id: konu.id, ad: konu.ad, ...(AKTARILAN_KONULAR[konu.id] ?? { sayi: 0 }) })) })) } })
export function bankaKonusuBul(id: string): BankaKonusu | undefined { return BANKA_DIZINI.flatMap((sinif) => sinif.temalar).flatMap((tema) => tema.konular).find((konu) => konu.id === id) }
