'use client'

/**
 * Güncelleme şeridinin sahibi.
 *
 * Saf köprü `lib/guncelleme.ts`'te, React'e bağlı olan kısım burada —
 * `cokme-izni.ts` ile aynı desen.
 *
 * **Akış:** açılışta bir kez Play'e soruluyor. Yeni sürüm varsa şerit
 * "Güncelle" ile çıkıyor; dokunulunca Play kendi onay penceresini açıyor ve
 * indirme arkada sürüyor. Paket inince şerit "Yeniden başlat"a dönüyor —
 * yeniden başlatmaya kullanıcı karar veriyor, uygulama onu turun ortasında
 * kapatmıyor.
 *
 * Kapatma bu oturumluk: kullanıcı çarpıya basarsa şerit bir dahaki açılışa
 * kadar gelmiyor, kayda hiçbir şey yazılmıyor. Kalıcı bir "bir daha sorma"
 * yok — güncelleme geldi diye bir kez haber vermek, hiç haber vermemekten
 * iyi ama sonsuza kadar susmak eski sürümde kalmak demek.
 */

import { useCallback, useEffect, useState } from 'react'
import {
  guncellemeDurumunuDinle,
  guncellemeKontrol,
  guncellemeyiBaslat,
  guncellemeyiTamamla,
} from './guncelleme'

/**
 * Şeridin hâli. `yok` ve `kapali` çizilmiyor; `kuruluyor`da düğme pasif —
 * Play paketi kurarken uygulama zaten kapanmak üzere.
 */
export type SeritHali = 'yok' | 'hazir' | 'indiriliyor' | 'indirildi' | 'kuruluyor' | 'kapali'

export interface GuncellemeKolu {
  hal: SeritHali
  onGuncelle: () => void
  onYenidenBaslat: () => void
  onKapat: () => void
}

export function useGuncelleme(): GuncellemeKolu {
  const [hal, setHal] = useState<SeritHali>('yok')

  /* Açılışta bir kez soruluyor. */
  useEffect(() => {
    let iptal = false
    void guncellemeKontrol().then(({ var: varMi, indirildi }) => {
      if (iptal || !varMi) return
      setHal(indirildi ? 'indirildi' : 'hazir')
    })
    return () => {
      iptal = true
    }
  }, [])

  useEffect(
    () =>
      guncellemeDurumunuDinle((durum) => {
        setHal((onceki) => {
          // Kullanıcı şeridi kapattıysa indirme durumu onu geri getirmiyor;
          // "indirildi" hariç — inmiş bir paketi kurmak için tek yol bu şerit.
          if (onceki === 'kapali' && durum !== 'indirildi') return onceki
          switch (durum) {
            case 'indiriliyor':
              return 'indiriliyor'
            case 'indirildi':
              return 'indirildi'
            case 'kuruluyor':
            case 'kuruldu':
              return 'kuruluyor'
            case 'basarisiz':
              // İndirme kesildi: şerit "Güncelle"ye dönüyor, yeniden denenebilir.
              return 'hazir'
          }
        })
      }),
    [],
  )

  const onGuncelle = useCallback(() => {
    void guncellemeyiBaslat()
  }, [])

  const onYenidenBaslat = useCallback(() => {
    setHal('kuruluyor')
    void guncellemeyiTamamla()
  }, [])

  const onKapat = useCallback(() => setHal('kapali'), [])

  return { hal, onGuncelle, onYenidenBaslat, onKapat }
}
