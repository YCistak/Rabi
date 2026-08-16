'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ANAHTARLAR } from '@/lib/depo'

export type Tema = 'acik' | 'koyu'

type TemaBaglami = {
  tema: Tema
  temaDegistir: (tema: Tema) => void
  /** İlk okuma bitene kadar false — tema düğmesi yanlış durumu göstermesin. */
  hazir: boolean
}

const Baglam = createContext<TemaBaglami | null>(null)

function sistemTemasi(): Tema {
  if (typeof window === 'undefined') return 'acik'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'koyu' : 'acik'
}

function uygula(tema: Tema) {
  document.documentElement.classList.toggle('dark', tema === 'koyu')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>('acik')
  const [hazir, setHazir] = useState(false)

  useEffect(() => {
    // layout.tsx'teki senkron script sınıfı zaten uyguladı; burada yalnızca
    // React tarafındaki durum onunla eşitleniyor.
    let kayitli: string | null = null
    try {
      kayitli = localStorage.getItem(ANAHTARLAR.tema)
    } catch {
      // gizli sekme — sistem tercihine düş
    }
    setTema(kayitli === 'acik' || kayitli === 'koyu' ? kayitli : sistemTemasi())
    setHazir(true)
  }, [])

  const temaDegistir = useCallback((yeni: Tema) => {
    setTema(yeni)
    uygula(yeni)
    try {
      // Düz metin olarak yazılır (JSON değil): layout.tsx'teki senkron script bunu
      // JSON.parse etmeden, ilk boyamadan önce okumak zorunda.
      localStorage.setItem(ANAHTARLAR.tema, yeni)
    } catch {
      // yoksay
    }
  }, [])

  return <Baglam.Provider value={{ tema, temaDegistir, hazir }}>{children}</Baglam.Provider>
}

export function useTema(): TemaBaglami {
  const baglam = useContext(Baglam)
  if (!baglam) throw new Error('useTema, ThemeProvider içinde çağrılmalı.')
  return baglam
}
