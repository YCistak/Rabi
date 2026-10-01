'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { demoVerileriTemizle, TUR_ADIMLARI, TUR_ANAHTARLARI, tanitimGecisi, type TanitimTuru, type TanitimEylemi } from '@/lib/tanitim'

function useTanitimDurumu() {
  const [durum, eylemGonder] = useReducer(tanitimGecisi, undefined, demoVerileriTemizle)
  // Gecikmiş veya çift dokunuş önceki adımın düğmesiyle yeni adımı atlayamaz.
  const gonder = useCallback((eylem: TanitimEylemi) => eylemGonder({ ...eylem, beklenenAdim: durum.aktifAdim, beklenenTur: durum.aktifTur }), [durum.aktifAdim, durum.aktifTur])
  const [gorulenler, setGorulenler] = useState<Record<TanitimTuru, boolean> | null>(null)
  const [kayitUyarisi, setKayitUyarisi] = useState('')
  useEffect(() => {
    const kayitlar = {} as Record<TanitimTuru, boolean>
    for (const turAdi of Object.keys(TUR_ANAHTARLARI) as TanitimTuru[]) {
      try { kayitlar[turAdi] = localStorage.getItem(TUR_ANAHTARLARI[turAdi]) === 'true' }
      catch { kayitlar[turAdi] = false }
    }
    setGorulenler(kayitlar)
  }, [])
  const turGorulduMu = useCallback((turAdi: TanitimTuru) => gorulenler?.[turAdi] ?? null, [gorulenler])
  const turuKaydet = useCallback((turAdi: TanitimTuru) => {
    setGorulenler((onceki) => onceki ? { ...onceki, [turAdi]: true } : onceki)
    try { localStorage.setItem(TUR_ANAHTARLARI[turAdi], 'true') }
    catch { setKayitUyarisi('Tanıtım temizlendi. Cihaz depolaması kullanılamadığı için uygulamayı yeniden açınca tur tekrar görünebilir.') }
  }, [])
  const turuBaslat = useCallback((turAdi: TanitimTuru) => {
    if (!durum.aktifTur && turGorulduMu(turAdi) === false) gonder({ tur: 'baslat', turAdi })
  }, [durum.aktifTur, turGorulduMu, gonder])
  const turuBitir = useCallback(() => {
    if (!durum.aktifTur) return
    turuKaydet(durum.aktifTur)
    eylemGonder({ tur: 'temizle' })
  }, [durum.aktifTur, turuKaydet])

  return useMemo(() => ({
    ...durum,
    adim: durum.aktifAdim === null ? null : TUR_ADIMLARI[durum.aktifTur!][durum.aktifAdim],
    tanitimdaMi: durum.aktifAdim !== null,
    tamamlandi: gorulenler?.ana_tur ?? null,
    turGorulduMu, turuKaydet, turuBaslat,
    adimSayisi: durum.aktifTur ? TUR_ADIMLARI[durum.aktifTur].length : 0,
    kayitUyarisi,
    gonder,
    turuBitir,
    sonrakiAdimaGec: () => gonder({ tur: 'ileri' }),
    oncekiAdimaDon: () => gonder({ tur: 'geri' }),
  }), [durum, gorulenler, turGorulduMu, turuKaydet, turuBaslat, kayitUyarisi, turuBitir, gonder])
}

export const TanitimBaglami = createContext<ReturnType<typeof useTanitimDurumu> | null>(null)

export function TanitimSaglayici({ children }: { children: React.ReactNode }) {
  const deger = useTanitimDurumu()
  return <TanitimBaglami value={deger}>{children}</TanitimBaglami>
}

export function useTanitim() {
  const baglam = useContext(TanitimBaglami)
  if (!baglam) throw new Error('Tanıtım bileşeni TanitimSaglayici içinde kullanılmalı.')
  return baglam
}
