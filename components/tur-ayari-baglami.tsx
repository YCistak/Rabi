'use client'

import { createContext, useContext } from 'react'
import { VARSAYILAN_MOD, etkinMod, type OyunModu } from '@/lib/oyunlar/mod'
import { BASLANGIC_ZORLUGU, useUyum } from '@/lib/oyunlar/uyum'
import type { Zorluk } from '@/lib/oyunlar/ritim'

/**
 * Turun ayarları: seçilen mod, seçilen başlangıç zorluğu ve ikisinin
 * değiştiricileri.
 *
 * Bağlamla taşınıyor, prop'la değil — `genel-test-baglami.tsx` ile aynı
 * gerekçe: ayarı seçtiren yer tek (`oyun-tanitim.tsx`) ama o pencereyi çizen
 * yer yirmi iki oyun dosyasının her biri, ayarı **kullanan** yer de aynı yirmi
 * iki dosya. Prop olsaydı aynı dört satır yirmi iki kez yazılacaktı ve yeni
 * bir oyun eklendiğinde unutulan satır, seçimi sessizce yok sayan bir oyun
 * demekti.
 *
 * Seçimin sahibi `oyunlar.tsx`: kayda yazan, okuyan ve sağlayıcıyı kuran
 * orası. Buradaki tek iş taşımak.
 *
 * Varsayılanlar bugünkü davranış: bağlam kurulmadan çizilen bir oyun Sıradan
 * modda, ortadan başlayan ve seçim sunmayan bir tur oynar.
 */
export type TurAyari = {
  mod: OyunModu
  /**
   * Turun **başladığı** seviye; kaldığı seviye değil. Uyum bunun üstünde
   * çalışmaya devam ediyor (`lib/oyunlar/uyum.ts`).
   */
  zorluk: Zorluk
  setMod: (mod: OyunModu) => void
  setZorluk: (zorluk: Zorluk) => void
  /**
   * Ayarlar adımı çıksın mı.
   *
   * Oyun Bankası turunda `false`: o tur ne modu ne zorluğu dinliyor
   * (`etkinMod`), sunulup dinlenmeyen bir seçim yalan söyleyen bir arayüzdür.
   */
  secilebilir: boolean
}

const TurAyariBaglami = createContext<TurAyari>({
  mod: VARSAYILAN_MOD,
  zorluk: BASLANGIC_ZORLUGU,
  setMod: () => {},
  setZorluk: () => {},
  secilebilir: false,
})

export const TurAyariSaglayici = TurAyariBaglami.Provider

export function useTurAyari(): TurAyari {
  return useContext(TurAyariBaglami)
}

/**
 * Turun gerçekten hangi modla işlediği.
 *
 * `etkinMod`un bağlamı okuyan hâli. Oyun dosyaları saf fonksiyonu değil bunu
 * çağırıyor; `etkinMod` saf kalıyor ve testlerde seçim elle veriliyor.
 *
 * Oyun Bankası turu seçimi dinlemiyor — kararı yine `etkinMod` veriyor.
 */
export function useEtkinMod(bankaTuru: boolean): OyunModu {
  return etkinMod(bankaTuru, useTurAyari().mod)
}

/**
 * Uyumun oyun ekranlarına bakan yüzü: başlangıcı bağlamdan okur.
 *
 * Sarmal burada, `lib/oyunlar/uyum.ts` içinde değil: `lib/` saf mantık ve bir
 * bileşenden içeri bakmıyor (`AGENTS.md`). Uyum kuralının kendisi orada
 * duruyor ve bağlamı hiç görmüyor; buradaki tek iş seçilen seviyeyi ona
 * geçirmek.
 *
 * Oyun Bankası turunda seçim sorulmuyor ve bağlam varsayılanla geliyor: o tur
 * ortadan başlıyor.
 */
export function useUyarlananZorluk() {
  return useUyum(useTurAyari().zorluk)
}
