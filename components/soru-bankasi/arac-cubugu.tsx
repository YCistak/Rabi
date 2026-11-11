import { Eraser, Hand, PenLine, RotateCcw, Trash2, Undo2 } from 'lucide-react'
import { useState } from 'react'

export type KaralamaAraci = 'kalem' | 'silgi' | 'el'

const RENKLER = ['#e5484d', '#2f6fde', '#2f9e5b', '#1b1a19'] as const
const KALINLIKLAR = [0.006, 0.012, 0.024] as const

export function AracCubugu({
  arac,
  renk,
  kalinlik,
  yakinlik,
  katli,
  onArac,
  onRenk,
  onKalinlik,
  onGeri,
  onTemizle,
  onSifirla,
  onKatla,
}: {
  arac: KaralamaAraci
  renk: string
  kalinlik: number
  yakinlik: number
  katli: boolean
  onArac: (arac: KaralamaAraci) => void
  onRenk: (renk: string) => void
  onKalinlik: (kalinlik: number) => void
  onGeri: () => void
  onTemizle: () => void
  onSifirla: () => void
  onKatla: () => void
}) {
  const [acik, setAcik] = useState<'renk' | 'kalinlik' | null>(null)
  const dugme = (etiket: string, secili: boolean, islev: () => void, icerik: React.ReactNode) => (
    <button
      type="button"
      aria-label={etiket}
      aria-pressed={secili}
      onClick={islev}
      className={`grid size-9 shrink-0 place-items-center rounded-xl transition active:scale-95 ${secili ? 'bg-primary-derin text-white shadow-sm' : 'text-foreground active:bg-muted'}`}
    >
      {icerik}
    </button>
  )

  if (katli) {
    return (
      <aside className="fixed right-0 bottom-[var(--guvenli-alt)] left-0 z-[60] mx-auto flex max-w-md justify-center">
        <button type="button" aria-label="Araç çubuğunu aç" onClick={onKatla} className="grid h-6 w-14 place-items-center rounded-t-xl border border-border bg-card golge-kart">
          <span className="h-1 w-8 rounded-full bg-muted-foreground/50" />
        </button>
      </aside>
    )
  }

  return (
    <aside className="fixed right-0 bottom-[var(--guvenli-alt)] left-0 z-[60] mx-auto max-w-md px-3">
      <div className="golge-kart rounded-2xl border border-border bg-card px-1.5 py-1.5">
        <button type="button" aria-label="Araç çubuğunu katla" onClick={onKatla} className="mx-auto mb-1 block h-2 w-10 rounded-full">
          <span className="block h-1 w-8 rounded-full bg-muted-foreground/50" />
        </button>
        <div className="flex items-center justify-between gap-0.5">
          {dugme('Kalem', arac === 'kalem', () => { onArac('kalem'); setAcik(null) }, <PenLine size={18} />)}
          {dugme('Silgi', arac === 'silgi', () => { onArac('silgi'); setAcik(null) }, <Eraser size={18} />)}
          {dugme('El', arac === 'el', () => { onArac('el'); setAcik(null) }, <Hand size={18} />)}
          {dugme('Geri al', false, onGeri, <Undo2 size={18} />)}
          {dugme('Temizle', false, onTemizle, <Trash2 size={18} />)}
          <div className="relative">
            {dugme('Mürekkep rengi', acik === 'renk', () => setAcik((onceki) => onceki === 'renk' ? null : 'renk'), <span className="size-4 rounded-full border border-foreground/30" style={{ backgroundColor: renk }} />)}
            {acik === 'renk' && (
              <div className="absolute bottom-full left-1/2 z-10 mb-2 flex -translate-x-1/2 gap-1 rounded-xl border border-border bg-card p-1.5 golge-kart">
                {RENKLER.map((deger) => (
                  <button key={deger} type="button" aria-label="Mürekkep rengi seç" aria-pressed={renk === deger} onClick={() => { onRenk(deger); onArac('kalem'); setAcik(null) }} className={`size-6 rounded-full border border-foreground/25 ${renk === deger ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''}`} style={{ backgroundColor: deger }} />
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            {dugme('Kalınlık', acik === 'kalinlik', () => setAcik((onceki) => onceki === 'kalinlik' ? null : 'kalinlik'), <span className="rounded-full bg-foreground" style={{ width: Math.max(4, kalinlik * 260), height: Math.max(4, kalinlik * 260) }} />)}
            {acik === 'kalinlik' && (
              <div className="absolute bottom-full left-1/2 z-10 mb-2 flex -translate-x-1/2 gap-1 rounded-xl border border-border bg-card p-1.5 golge-kart">
                {KALINLIKLAR.map((deger) => (
                  <button key={deger} type="button" aria-label="Kalınlık seç" aria-pressed={kalinlik === deger} onClick={() => { onKalinlik(deger); setAcik(null) }} className={`grid size-7 place-items-center rounded-lg ${kalinlik === deger ? 'bg-primary-soft text-primary' : 'text-foreground active:bg-muted'}`}><span className="rounded-full bg-current" style={{ width: Math.max(4, deger * 260), height: Math.max(4, deger * 260) }} /></button>
                ))}
              </div>
            )}
          </div>
          <button type="button" aria-label="Yakınlığı sıfırla" onClick={onSifirla} className="grid h-9 shrink-0 place-items-center rounded-xl px-1 text-[10px] font-extrabold text-foreground active:bg-muted">
            <span className="rakam">%{Math.round(yakinlik * 100)}</span><RotateCcw size={12} />
          </button>
        </div>
      </div>
    </aside>
  )
}
