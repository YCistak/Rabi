'use client'

import { cn } from '@/lib/utils'

/** Seçim kutusu: ders çipi, prova kartı. Seçiliyken amber çerçeve ve açık zemin. */
export function SecimKutusu({
  secili,
  className,
  ...props
}: React.ComponentProps<'button'> & { secili: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={secili}
      className={cn(
        'flex items-center justify-center rounded-[13px] border transition',
        secili
          ? 'border-[1.5px] border-primary-parlak bg-primary-soft font-extrabold text-primary'
          : 'border-border bg-card font-bold text-muted-foreground active:bg-muted',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Tek satırlık yatay ders şeridi (Pomodoro ve Soru Takibi aynı görünümü
 * kullanıyor). Sıra çağıran yerde kurulur (`calismaSirasi`). Şerit kartın
 * kenarına kadar kayıyor (`-mx-4 px-4`): kesik duran son çip, yana
 * kaydırılabildiğini söyleyen tek işaret. Yana kayan kutunun içinden başlayan
 * hareket sekme değiştirmiyor (`sekme-kaydirma.ts`). Seçili çipe yeniden
 * dokunmak seçimi kaldırır.
 */
export function DersSeridi({
  dersler,
  secili,
  onSec,
}: {
  dersler: string[]
  secili: string | null
  onSec: (ders: string | null) => void
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {dersler.map((d) => (
        <SecimKutusu
          key={d}
          secili={secili === d}
          onClick={() => onSec(secili === d ? null : d)}
          className="h-11 shrink-0 px-4 text-[12.5px] whitespace-nowrap"
        >
          {d}
        </SecimKutusu>
      ))}
    </div>
  )
}
