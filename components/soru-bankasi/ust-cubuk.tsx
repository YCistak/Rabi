'use client'

import { ArrowLeft, LayoutGrid, Star, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BildirimDugmesi, type BildirimKolu } from '@/components/hata-bildir'
import type { BildirilebilirSoru } from '@/lib/hata-bildirimi'
import { sayacYazisi } from '@/lib/soru-bankasi/sure'

/**
 * Sayaç kendi saniyesini kendisi tutar: her saniye bütün soru sayfasını
 * yeniden çizdirmek, çizim sırasında kare kaçırtırdı.
 */
function SureGostergesi({ sureAl, gizli, onDegistir }: { sureAl: () => number; gizli: boolean; onDegistir: () => void }) {
  const [, setTik] = useState(0)
  useEffect(() => {
    const kimlik = window.setInterval(() => setTik((t) => t + 1), 1000)
    return () => window.clearInterval(kimlik)
  }, [])
  const yazi = sayacYazisi(sureAl())
  return (
    <button
      type="button"
      onClick={onDegistir}
      aria-label={gizli ? 'Süreyi göster' : `Geçen süre ${yazi}. Gizlemek için dokun`}
      className="flex h-11 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[14px] font-extrabold text-muted-foreground active:bg-muted"
    >
      <Timer size={17} aria-hidden />
      {!gizli && <span className="rakam min-w-[2.6rem] text-left text-foreground">{yazi}</span>}
    </button>
  )
}

export function UstCubuk({
  baslik,
  ilerleme,
  sureAl,
  sureGizli,
  isaretli,
  bildirimSorusu,
  hataBildirimi,
  onGeri,
  onSureGizli,
  onIsaretle,
  onIzgara,
}: {
  baslik: string
  /** 0–1: çözülen / toplam. */
  ilerleme: number
  sureAl: () => number
  sureGizli: boolean
  isaretli: boolean
  bildirimSorusu: BildirilebilirSoru
  hataBildirimi: BildirimKolu
  onGeri: () => void
  onSureGizli: () => void
  onIsaretle: () => void
  onIzgara: () => void
}) {
  return (
    <header className="shrink-0 bg-background pt-[var(--guvenli-ust)]">
      <div className="flex h-12 items-center gap-0.5 px-1">
        <button
          type="button"
          onClick={onGeri}
          aria-label="Testten çık"
          className="grid size-11 shrink-0 place-items-center rounded-xl text-primary active:bg-muted"
        >
          <ArrowLeft size={21} />
        </button>
        <p className="min-w-0 truncate font-display text-[17px] font-extrabold">{baslik}</p>
        <SureGostergesi sureAl={sureAl} gizli={sureGizli} onDegistir={onSureGizli} />
        <span className="flex-1" />
        <button
          type="button"
          onClick={onIsaretle}
          aria-pressed={isaretli}
          aria-label={isaretli ? 'İşareti kaldır' : 'Soruyu sonra bakmak için işaretle'}
          className={`grid size-11 shrink-0 place-items-center rounded-xl active:bg-muted ${isaretli ? 'text-warning' : 'text-muted-foreground'}`}
        >
          <Star size={21} className={isaretli ? 'fill-warning-dolu text-warning-dolu' : ''} />
        </button>
        <button
          type="button"
          onClick={onIzgara}
          aria-label="Soru ızgarası"
          aria-haspopup="dialog"
          className="grid size-11 shrink-0 place-items-center rounded-xl text-foreground active:bg-muted"
        >
          <LayoutGrid size={21} />
        </button>
        <BildirimDugmesi soru={bildirimSorusu} kol={hataBildirimi} kompakt />
      </div>
      <div
        className="h-[3px] bg-muted"
        role="progressbar"
        aria-label="Çözülen soru"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ilerleme * 100)}
      >
        <div
          className="h-full rounded-r-full bg-primary-parlak transition-[width] duration-300"
          style={{ width: `${ilerleme * 100}%` }}
        />
      </div>
    </header>
  )
}
