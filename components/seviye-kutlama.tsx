'use client'

import { useEffect } from 'react'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'
import { Carrot } from 'lucide-react'
import { seviyeUnvani } from '@/lib/seviye'
import { useGeriKatmani } from '@/lib/geri'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

export type SeviyeKutlamasi = {
  seviye: number
  /** Bu atlayışta kazanılan havuç. */
  odul: number
}

/**
 * Seviye atlama kutlaması.
 *
 * Rozet kutlamasından ayrı bir bileşen: rozet "şunu başardın" diyor, bu ise
 * kullanıcıya **harcayacağı bir şey** veriyor. Havuç kutlamanın merkezinde
 * duruyor, yoksa ödülün mağazaya gittiği hiç anlaşılmazdı.
 *
 * Birden fazla seviye tek seferde atlanabiliyor (sistemi ilk gören eski
 * kullanıcı) — o yüzden ulaşılan seviye ve **toplam** ödül gösteriliyor,
 * atlanan seviyeler tek tek değil.
 */
export function SeviyeKutlama({
  kutlama,
  onKapat,
}: {
  kutlama: SeviyeKutlamasi | null
  onKapat: () => void
}) {
  const acik = kutlama !== null

  useGeriKatmani(acik, onKapat)

  useEffect(() => {
    if (!acik || !Capacitor.isNativePlatform()) return
    // Titreşim kutlamanın parçası; kapalı cihazlarda sessizce geçiliyor.
    void Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {})
  }, [acik])

  if (!kutlama) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 pt-[calc(1rem+var(--guvenli-ust))] pb-[calc(1rem+var(--guvenli-alt))]">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center">
        <div className="flex justify-center">
          <Rabi durum="kutlama" boyut={110} />
        </div>

        <p className="mt-3 font-display text-xl font-extrabold tracking-tight">Seviye atladın!</p>

        <p className="mt-4 flex items-baseline justify-center gap-2">
          <span className="rakam font-display text-5xl font-extrabold text-primary">
            {kutlama.seviye}
          </span>
          <span className="text-sm font-bold text-muted-foreground">
            {seviyeUnvani(kutlama.seviye)}
          </span>
        </p>

        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-isl-kart px-3.5 py-2 text-sm font-extrabold text-isl-koyu">
          <Carrot size={16} strokeWidth={2.6} aria-hidden />
          <span className="rakam">+{kutlama.odul}</span>
          <span>havuç</span>
        </p>

        <p className="mt-3 text-[13px] font-medium text-muted-foreground text-balance">
          Havuçlarını Mağaza’da jokere çevirebilirsin.
        </p>

        <Buton className="mt-5 w-full" onClick={onKapat}>
          Devam
        </Buton>
      </div>
    </div>
  )
}
