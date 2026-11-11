import { CircleCheck } from 'lucide-react'
import { SoruMetni } from './soru-metni'

export function Siklar({
  siklar,
  dogru,
  secim,
  onSec,
}: {
  siklar: readonly string[]
  dogru: number
  secim: number | undefined
  onSec: (sira: number) => void
}) {
  return (
    <div className="mt-5 space-y-2">
      {siklar.map((sik, sira) => {
        const cevaplandi = secim !== undefined
        const dogruMu = cevaplandi && sira === dogru
        const yanlisMi = cevaplandi && secim === sira && sira !== dogru
        return (
          <button
            key={sik}
            type="button"
            disabled={cevaplandi}
            onClick={() => onSec(sira)}
            className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 text-left font-bold transition disabled:opacity-100 ${dogruMu ? 'border-success-dolu bg-success-dolu text-white' : yanlisMi ? 'border-danger-dolu bg-danger-dolu text-white' : 'border-border bg-card text-foreground active:bg-muted'}`}
          >
            <span className={`grid size-7 shrink-0 place-items-center rounded-full text-sm ${dogruMu || yanlisMi ? 'bg-white/20 text-white' : 'bg-card text-foreground ring-1 ring-border'}`}>
              {dogruMu ? <CircleCheck size={16} aria-hidden /> : 'ABCDE'[sira]}
            </span>
            <SoruMetni metin={sik} />
          </button>
        )
      })}
    </div>
  )
}
