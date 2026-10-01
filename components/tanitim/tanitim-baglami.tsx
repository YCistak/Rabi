'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { demoVerileriTemizle, TANITIM_ADIMLARI, TANITIM_ANAHTARI, tanitimGecisi, type TanitimEylemi } from '@/lib/tanitim'

function useTanitimDurumu() {
  const [durum, eylemGonder] = useReducer(tanitimGecisi, undefined, demoVerileriTemizle)
  // Gecikmiş veya çift dokunuş önceki adımın düğmesiyle yeni adımı atlayamaz.
  const gonder = useCallback((eylem: TanitimEylemi) => eylemGonder({ ...eylem, beklenenAdim: durum.aktifAdim }), [durum.aktifAdim])
  const [tamamlandi, setTamamlandi] = useState<boolean | null>(null)
  const [kayitUyarisi, setKayitUyarisi] = useState('')

  useEffect(() => {
    try { setTamamlandi(localStorage.getItem(TANITIM_ANAHTARI) === 'true') }
    catch { setTamamlandi(false) }
  }, [])

  const turuBitir = useCallback(() => {
    eylemGonder({ tur: 'temizle' })
    setTamamlandi(true)
    try { localStorage.setItem(TANITIM_ANAHTARI, 'true') }
    catch { setKayitUyarisi('Tanıtım temizlendi. Cihaz depolaması kullanılamadığı için uygulamayı yeniden açınca tur tekrar görünebilir.') }
  }, [])

  return useMemo(() => ({
    ...durum,
    adim: durum.aktifAdim === null ? null : TANITIM_ADIMLARI[durum.aktifAdim],
    tanitimdaMi: durum.aktifAdim !== null,
    tamamlandi,
    kayitUyarisi,
    gonder,
    turuBitir,
    sonrakiAdimaGec: () => gonder({ tur: 'ileri' }),
    oncekiAdimaDon: () => gonder({ tur: 'geri' }),
  }), [durum, tamamlandi, kayitUyarisi, turuBitir, gonder])
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
