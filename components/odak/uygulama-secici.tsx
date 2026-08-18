'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'
import { kilitlenebilirUygulamalar, type KilitlenebilirUygulama } from '@/lib/odak-kilidi'
import { Alan, Not } from '@/components/ui'
import { sadelestir } from '@/lib/dersler'

/**
 * Kilitlenecek uygulamaların seçildiği liste.
 *
 * Liste yerli taraftan geliyor ve tarayıcıda hep boş: hangi uygulamaların
 * kurulu olduğunu web'den görmenin yolu yok. Boş listede kullanıcıya "cihazda
 * dene" deniyor, ekran çökmüyor.
 */
export function UygulamaSecici({
  secili,
  onDegis,
}: {
  secili: string[]
  onDegis: (paketler: string[]) => void
}) {
  const [uygulamalar, setUygulamalar] = useState<KilitlenebilirUygulama[] | null>(null)
  const [arama, setArama] = useState('')

  useEffect(() => {
    let birakildi = false
    void kilitlenebilirUygulamalar().then((liste) => {
      if (!birakildi) setUygulamalar(liste)
    })
    return () => {
      birakildi = true
    }
  }, [])

  const gorunen = useMemo(() => {
    const liste = uygulamalar ?? []
    const aranan = sadelestir(arama.trim())
    if (aranan === '') return liste
    return liste.filter((u) => sadelestir(u.ad).includes(aranan))
  }, [uygulamalar, arama])

  const degistir = (paket: string) => {
    onDegis(
      secili.includes(paket) ? secili.filter((p) => p !== paket) : [...secili, paket],
    )
  }

  if (uygulamalar === null) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Uygulamalar okunuyor…</p>
  }

  if (uygulamalar.length === 0) {
    return (
      <Not tur="uyari">
        Kurulu uygulamalar okunamadı. Odak kilidi yalnızca telefonda çalışıyor; tarayıcıda
        listelenecek bir şey yok.
      </Not>
    )
  }

  return (
    <div>
      <div className="relative mb-3">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Alan
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          placeholder="Uygulama ara"
          className="pl-9"
          aria-label="Uygulama ara"
        />
      </div>

      {gorunen.length === 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">Eşleşen uygulama yok.</p>
      )}

      <div className="max-h-[50vh] space-y-1 overflow-y-auto">
        {gorunen.map((uygulama) => {
          const isaretli = secili.includes(uygulama.paket)
          return (
            <button
              key={uygulama.paket}
              type="button"
              onClick={() => degistir(uygulama.paket)}
              aria-pressed={isaretli}
              className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                isaretli ? 'border-primary bg-primary-soft' : 'border-border active:bg-muted'
              }`}
            >
              {uygulama.ikon ? (
                // Yerli taraftan base64 geliyor; next/image'ın optimizasyonu
                // data adreslerinde işe yaramıyor, üstelik statik export'ta kapalı.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={uygulama.ikon} alt="" className="size-8 shrink-0 rounded-lg" />
              ) : (
                <span className="size-8 shrink-0 rounded-lg bg-muted" aria-hidden />
              )}
              <span className="min-w-0 flex-1 truncate text-[15px]">{uygulama.ad}</span>
              {isaretli && <Check size={18} className="shrink-0 text-primary" aria-hidden />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
