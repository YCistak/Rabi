'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ANAHTARLAR } from '@/lib/depo'

/** Ekrana uygulanan tema. `sistem` tercihi de bunlardan birine çözülür. */
export type Tema = 'acik' | 'koyu'

/** Kullanıcının seçimi. `sistem` = cihazın gece modunu izle (varsayılan). */
export type TemaTercihi = Tema | 'sistem'

type TemaBaglami = {
  /** Kullanıcının seçtiği tercih — Ayarlar ve kurulum bunu işaretler. */
  tercih: TemaTercihi
  /** Ekranda gerçekten geçerli olan tema; `tercih === 'sistem'` iken cihazdan gelir. */
  tema: Tema
  temaDegistir: (tercih: TemaTercihi) => void
  /** İlk okuma bitene kadar false — tema düğmesi yanlış durumu göstermesin. */
  hazir: boolean
}

const Baglam = createContext<TemaBaglami | null>(null)

const KOYU_SORGUSU = '(prefers-color-scheme: dark)'

function sistemTemasi(): Tema {
  if (typeof window === 'undefined') return 'acik'
  return window.matchMedia(KOYU_SORGUSU).matches ? 'koyu' : 'acik'
}

function cozumle(tercih: TemaTercihi): Tema {
  return tercih === 'sistem' ? sistemTemasi() : tercih
}

/** Kayıtlı tercih; hiç yazılmamışsa ya da okunamıyorsa cihazın ayarı izlenir. */
function tercihOku(): TemaTercihi {
  try {
    const kayitli = localStorage.getItem(ANAHTARLAR.tema)
    if (kayitli === 'acik' || kayitli === 'koyu' || kayitli === 'sistem') return kayitli
  } catch {
    // gizli sekme — sistem tercihine düş
  }
  return 'sistem'
}

function uygula(tema: Tema) {
  document.documentElement.classList.toggle('dark', tema === 'koyu')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [tercih, setTercih] = useState<TemaTercihi>('sistem')
  const [tema, setTema] = useState<Tema>('acik')
  const [hazir, setHazir] = useState(false)

  useEffect(() => {
    // layout.tsx'teki senkron script sınıfı zaten uyguladı; burada yalnızca
    // React tarafındaki durum onunla eşitleniyor.
    const okunan = tercihOku()
    setTercih(okunan)
    setTema(cozumle(okunan))
    setHazir(true)
  }, [])

  // Cihaz gece moduna geçtiğinde uygulama anında onu izlemeli — kullanıcı
  // uygulamayı kapatıp açmak zorunda kalmasın. Yalnızca `sistem` tercihinde:
  // açık/koyu seçen kullanıcının seçimi telefon ayarıyla bozulmaz.
  useEffect(() => {
    if (!hazir || tercih !== 'sistem') return
    const sorgu = window.matchMedia(KOYU_SORGUSU)
    const degisti = () => {
      const yeni: Tema = sorgu.matches ? 'koyu' : 'acik'
      setTema(yeni)
      uygula(yeni)
    }
    sorgu.addEventListener('change', degisti)
    // Uygulama arka plandayken tema değişirse WebView `change` olayını her zaman
    // vermiyor; öne dönüldüğünde sorgu yeniden okunuyor.
    document.addEventListener('visibilitychange', degisti)
    return () => {
      sorgu.removeEventListener('change', degisti)
      document.removeEventListener('visibilitychange', degisti)
    }
  }, [hazir, tercih])

  const temaDegistir = useCallback((yeni: TemaTercihi) => {
    setTercih(yeni)
    const etkin = cozumle(yeni)
    setTema(etkin)
    uygula(etkin)
    try {
      // Düz metin olarak yazılır (JSON değil): layout.tsx'teki senkron script bunu
      // JSON.parse etmeden, ilk boyamadan önce okumak zorunda.
      localStorage.setItem(ANAHTARLAR.tema, yeni)
    } catch {
      // yoksay
    }
  }, [])

  return (
    <Baglam.Provider value={{ tercih, tema, temaDegistir, hazir }}>{children}</Baglam.Provider>
  )
}

export function useTema(): TemaBaglami {
  const baglam = useContext(Baglam)
  if (!baglam) throw new Error('useTema, ThemeProvider içinde çağrılmalı.')
  return baglam
}
