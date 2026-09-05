'use client'

import { createContext, useContext } from 'react'

/**
 * "Şu an genel test oynanıyor" bilgisi.
 *
 * Bağlamla taşınıyor, prop'la değil: bilgiyi kullanan yer tanıtım penceresi
 * (`oyun-tanitim.tsx`) ve pencereyi çizen yer on sekiz oyun dosyasının her
 * biri. Prop olsaydı aynı satır on sekiz kez yazılacaktı ve yeni bir oyun
 * eklendiğinde unutulan tek satır, testin ortasında beklenmedik bir tanıtım
 * penceresi açacaktı.
 *
 * Varsayılan `false`: bağlam kurulmadan çizilen bir oyun sıradan bir turdur.
 */
const GenelTestBaglami = createContext(false)

export const GenelTestSaglayici = GenelTestBaglami.Provider

export function useGenelTest(): boolean {
  return useContext(GenelTestBaglami)
}
