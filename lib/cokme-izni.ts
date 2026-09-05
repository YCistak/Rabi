'use client'

/**
 * Çökme raporlaması onayının sahibi.
 *
 * `lib/hata-kuyrugu.ts` ile aynı desen: saf köprü `lib/cokme.ts`'te, React'e
 * bağlı olan kısım burada.
 *
 * İki iş yapıyor:
 *
 * 1. Global JS hata yakalayıcılarını **onaydan bağımsız** kurar. Yakalanan
 *    hata yerli tarafa geçse bile Crashlytics kapalıyken hiçbir yere
 *    gitmiyor; yakalayıcıyı onaya bağlamak, kullanıcı onayı verdiği anda o
 *    oturumdaki hataların kaybolması demek olurdu.
 * 2. Kararı yerli tarafa yalnızca **değişince** geçirir. Firebase tercihi
 *    cihazda sakladığı için her açılışta tekrarlamak gereksiz; ama ilk
 *    açılışta bir kez gönderiliyor ki depodaki değer ile SDK'nın durumu
 *    ayrışmasın (ör. uygulama verisi silinip localStorage sıfırlanırsa).
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { ANAHTARLAR, useYerelDepo } from './depo'
import { cokmeDurumu, cokmeIzniniUygula, cokmeYakalayiciyiKur, type CokmeDurumu } from './cokme'

/** Onayın üç hâli — `bildirimIzni` ile aynı sözlük. */
export type CokmeIzni = 'sorulmadi' | 'verildi' | 'reddedildi'

export interface CokmeKolu {
  izin: CokmeIzni
  onIzin: (karar: CokmeIzni) => void
  /** Debug derlemesinde test düğmeleri gösterilsin mi. */
  testVar: boolean
}

export function useCokmeRaporu(): CokmeKolu {
  const [izin, setIzin] = useYerelDepo<CokmeIzni>(ANAHTARLAR.cokmeIzni, 'sorulmadi')
  const [durum, setDurum] = useState<CokmeDurumu>({ firebase: false, test: false })
  const sonGonderilen = useRef<boolean | null>(null)

  useEffect(() => cokmeYakalayiciyiKur(), [])

  useEffect(() => {
    void cokmeDurumu().then(setDurum)
  }, [])

  useEffect(() => {
    const acik = izin === 'verildi'
    if (sonGonderilen.current === acik) return
    sonGonderilen.current = acik
    void cokmeIzniniUygula(acik)
  }, [izin])

  const onIzin = useCallback(
    (karar: CokmeIzni) => {
      setIzin(karar)
    },
    [setIzin],
  )

  return { izin, onIzin, testVar: durum.test }
}
