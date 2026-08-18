'use client'

import { ChevronRight } from 'lucide-react'
import { KARTLAR, type Ekran, type KartRengi, type KartTanimi } from '@/lib/gezinme'
import { cn } from '@/lib/utils'

/** Kart ikonunun pastel zemini ve üstünde okunan koyu tonu. */
const RENK_SINIFI: Record<KartRengi, string> = {
  mavi: 'bg-primary-soft text-primary',
  pembe: 'bg-yzm text-yzm-koyu',
  krem: 'bg-isl text-isl-koyu',
  nane: 'bg-success-soft text-success',
  lavanta: 'bg-edb text-edb-koyu',
}

/**
 * "Daha" sekmesinin bölümleri.
 *
 * Gruplama `lib/gezinme.ts` yerine burada, çünkü yalnızca bu ekrana ait: aynı
 * kart listesi ana sayfada başlıksız bir ızgara olarak çiziliyor. On bir giriş
 * düz bir liste hâlinde kaybolduğu için dört başlığa bölündü.
 */
const BOLUMLER: { baslik: string; kartlar: Ekran[] }[] = [
  { baslik: 'Çalışma', kartlar: ['pomodoro', 'soru', 'yanlis-banka'] },
  { baslik: 'Denemeler', kartlar: ['deneme', 'siralama', 'istatistik'] },
  { baslik: 'Okul', kartlar: ['okul', 'devamsizlik'] },
  { baslik: 'Motivasyon', kartlar: ['haftalik-ozet', 'hedef', 'rozetler'] },
]

/**
 * Ana sayfadaki kutucuk ızgarası ve "Daha" sekmesindeki bölümlü liste.
 * `kisa` verilirse yalnızca ilk dört kart, ana sayfadaki ızgara biçiminde çizilir.
 */
export function KartMenusu({
  onKartAc,
  kisa,
  className,
}: {
  onKartAc: (ekran: Ekran) => void
  kisa?: boolean
  className?: string
}) {
  if (kisa) {
    return (
      <ul className={cn('grid grid-cols-4 gap-2.5', className)}>
        {KARTLAR.slice(0, 4).map(({ id, ad, Simge, renk }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onKartAc(id)}
              className="flex w-full flex-col items-center gap-1.5 rounded-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span
                className={cn(
                  'grid aspect-[1/0.92] w-full place-items-center rounded-[18px] transition active:brightness-95',
                  RENK_SINIFI[renk],
                )}
              >
                <Simge size={26} aria-hidden />
              </span>
              <span className="text-center text-[11px] font-bold leading-tight text-muted-foreground">
                {ad}
              </span>
            </button>
          </li>
        ))}
      </ul>
    )
  }

  // Bir bölüme yazılmamış kart sessizce kaybolmasın diye: `gezinme.ts`'e yeni
  // kart eklenip `BOLUMLER`'e işlenmezse hiç çizilmezdi.
  const yerlesenler = new Set(BOLUMLER.flatMap((b) => b.kartlar))
  const yersizler = KARTLAR.filter((k) => !yerlesenler.has(k.id))

  const bolumler = [
    ...BOLUMLER.map(({ baslik, kartlar }) => ({ baslik, kartlar: kartlariBul(kartlar) })),
    ...(yersizler.length > 0 ? [{ baslik: 'Diğer', kartlar: yersizler }] : []),
  ]

  return (
    <div className={className}>
      <header className="px-0.5 pt-1">
        <p className="text-[11px] font-black tracking-[0.2em] text-ikincil">RABİ</p>
        <h1 className="mt-1 font-display text-[27px] font-extrabold tracking-tight">Daha 🗂️</h1>
        <p className="mt-1 text-[13.5px] font-medium text-muted-foreground">Her şey burada.</p>
      </header>

      <div className="mt-4 space-y-4">
        {bolumler.map(({ baslik, kartlar }) => (
          <section key={baslik}>
            <h2 className="mb-2 ml-1 text-[11.5px] font-extrabold uppercase tracking-[0.09em] text-muted-foreground">
              {baslik}
            </h2>

            {/* Bir bölümün satırları tek kartın içinde: her satır ayrı kart
                olsaydı on bir gölge alt alta dizilir, ekran huzursuz olurdu. */}
            <ul className="golge-kart overflow-hidden rounded-[22px] bg-card">
              {kartlar.map(({ id, ad, aciklama, Simge, renk }) => (
                <li key={id} className="border-t border-border first:border-t-0">
                  <button
                    type="button"
                    onClick={() => onKartAc(id)}
                    className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition active:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                  >
                    <span
                      className={cn(
                        'grid size-[42px] shrink-0 place-items-center rounded-[14px]',
                        RENK_SINIFI[renk],
                      )}
                    >
                      <Simge size={22} aria-hidden />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] font-extrabold leading-tight">{ad}</span>
                      <span className="mt-0.5 block text-xs font-medium leading-snug text-muted-foreground">
                        {aciklama}
                      </span>
                    </span>

                    <ChevronRight
                      size={18}
                      strokeWidth={2.6}
                      className="shrink-0 text-muted-foreground/50"
                      aria-hidden
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

/** Bölümde yazan kimlikleri kart tanımlarına çevirir; tanımı olmayanı atlar. */
function kartlariBul(idler: Ekran[]): KartTanimi[] {
  return idler.map((id) => KARTLAR.find((k) => k.id === id)).filter((k) => k !== undefined)
}
