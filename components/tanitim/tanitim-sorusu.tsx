'use client'

import { useEffect, useRef } from 'react'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { useGeriKatmani } from '@/lib/geri'

/**
 * İlk açılıştaki "Tanıtım ister misin?" sorusu (`lib/tanitim-tercih.ts`).
 *
 * Tek soru, iki cevap; kapatma (✕) yok: cevapsız kapanırsa bir sonraki
 * açılışta yeniden sorulurdu. Android geri tuşu pencereyi kapatmıyor (yutuluyor),
 * zemine dokunmak da: kullanıcı bir cevap seçmeden turların açık mı kapalı mı
 * olduğu belli değil.
 */
export function TanitimSorusu({ onCevap }: { onCevap: (evet: boolean) => void }) {
  useGeriKatmani(true, () => {})
  const evetRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { evetRef.current?.focus({ preventScroll: true }) }, [])
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="tanitim-sorusu-baslik"
      className="katman-zemin fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pt-[calc(1rem+var(--guvenli-ust))] pb-[calc(1rem+var(--guvenli-alt))]">
      <div className="alt-pencere-girisi w-full max-w-md rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <span aria-hidden className="shrink-0"><Rabi poz="selamlayan" boyut={64} /></span>
          <div className="min-w-0">
            <p id="tanitim-sorusu-baslik" className="font-display text-lg font-extrabold">Tanıtım ister misin?</p>
            <p className="mt-1 text-sm text-muted-foreground">Rabi sana uygulamayı kısa bir turla gezdirsin.</p>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <Buton bicim="ikincil" className="min-h-11 flex-1" onClick={() => onCevap(false)}>Hayır</Buton>
          <Buton ref={evetRef} className="min-h-11 flex-1" onClick={() => onCevap(true)}>Evet</Buton>
        </div>
      </div>
    </div>
  )
}
