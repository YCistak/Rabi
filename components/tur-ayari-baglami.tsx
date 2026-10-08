'use client'

import { createContext, useContext } from 'react'
import { VARSAYILAN_MOD, etkinMod, type OyunModu } from '@/lib/oyunlar/mod'
import { BASLANGIC_ZORLUGU, useUyum } from '@/lib/oyunlar/uyum'

/**
 * Turun ayarları: seçilen mod ve değiştiricisi. Başlangıç zorluğu da
 * buradaydı; seçimi kaldırıldı (kullanıcı istedi), tur hep ortadan başlıyor.
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
  setMod: (mod: OyunModu) => void
  /**
   * Ayarlar adımı çıksın mı.
   *
   * Oyun Bankası turunda `false`: o tur modu dinlemiyor
   * (`etkinMod`), sunulup dinlenmeyen bir seçim yalan söyleyen bir arayüzdür.
   */
  secilebilir: boolean
}

const TurAyariBaglami = createContext<TurAyari>({
  mod: VARSAYILAN_MOD,
  setMod: () => {},
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
 * Uyumun oyun ekranlarına bakan yüzü. Başlangıç seçimi kalktı; her tur
 * ortadan (`BASLANGIC_ZORLUGU`) başlıyor, uyum gidişi belirliyor
 * (`lib/oyunlar/uyum.ts`). Oyun dosyaları yine bunu çağırıyor: başlangıç bir
 * gün yeniden seçilebilir olursa tek yer burası.
 */
export function useUyarlananZorluk() {
  return useUyum(BASLANGIC_ZORLUGU)
}
