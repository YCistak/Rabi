'use client'

import { ChevronRight } from 'lucide-react'
import { KARTLAR, type Ekran, type KartRengi, type KartTanimi } from '@/lib/gezinme'
import { cn } from '@/lib/utils'

/**
 * Simge kutusunun yüzü — ders aileleriyle aynı pastel + koyu ton ikilisi.
 * Kartın tamamı artık beyaz; renk yalnızca simgede duruyor, böylece on bir
 * satır alt alta dizildiğinde sayfa renk kalabalığına dönüşmüyor.
 */
const RENK_SINIFI: Record<KartRengi, string> = {
  mavi: 'bg-primary-soft text-primary',
  pembe: 'bg-yzm-kart text-yzm-koyu',
  krem: 'bg-isl-kart text-isl-koyu',
  nane: 'bg-success-soft text-success',
  lavanta: 'bg-edb-kart text-edb-koyu',
}

/**
 * "Araçlar" sekmesinin bölümleri.
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
 * "Araçlar" sekmesi — bölüm bölüm satır listesi.
 *
 * Önce iki sütunlu, tamamı pastel zeminli kartlardı. On bir araç bu boyda
 * ekranı üç ekran boyu uzatıyordu ve her kart farklı renkte olduğu için göz
 * sırayı takip edemiyordu. Ayarlar ekranıyla aynı satır desenine geçildi:
 * beyaz kart, renkli simge, ad, açıklama, sağda ok.
 */
export function KartMenusu({
  onKartAc,
  className,
}: {
  onKartAc: (ekran: Ekran) => void
  className?: string
}) {
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
        <h1 className="mt-1 font-display text-[27px] font-extrabold tracking-tight">Araçlar 🧰</h1>
        <p className="mt-1 text-[13.5px] font-medium text-muted-foreground">Her şey burada.</p>
      </header>

      <div className="mt-4 space-y-4">
        {bolumler.map(({ baslik, kartlar }) => (
          <section key={baslik}>
            <h2 className="mb-2 ml-1 text-[11.5px] font-extrabold tracking-[0.09em] text-muted-foreground uppercase">
              {baslik}
            </h2>

            {/* Ayraç satırın kendisinde (`first:border-t-0`), kabın seçicisinde
                değil: bölümün ilk satırı koşullu çizilse bile çizgi hep iki
                satırın arasına düşsün. */}
            <div className="golge-kart overflow-hidden rounded-[22px] bg-card">
              {kartlar.map((kart) => (
                <AracSatiri key={kart.id} kart={kart} onAc={() => onKartAc(kart.id)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

/** Ayarlar ekranındaki satırla aynı desen: simge · ad/açıklama · ok. */
function AracSatiri({ kart, onAc }: { kart: KartTanimi; onAc: () => void }) {
  const { ad, aciklama, Simge, renk } = kart

  return (
    <button
      type="button"
      onClick={onAc}
      className={cn(
        'flex w-full items-center gap-3 border-t border-border px-3.5 py-2.5 text-left first:border-t-0',
        'transition active:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
      )}
    >
      <span
        className={cn('grid size-[42px] shrink-0 place-items-center rounded-[14px]', RENK_SINIFI[renk])}
      >
        <Simge size={22} aria-hidden />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-extrabold leading-tight">{ad}</span>
        <span className="mt-0.5 block text-xs font-medium leading-snug text-muted-foreground">
          {aciklama}
        </span>
      </span>

      <ChevronRight size={18} strokeWidth={2.6} className="shrink-0 text-muted-foreground/50" aria-hidden />
    </button>
  )
}

/** Bölümde yazan kimlikleri kart tanımlarına çevirir; tanımı olmayanı atlar. */
function kartlariBul(idler: Ekran[]): KartTanimi[] {
  return idler
    .map((id) => KARTLAR.find((k) => k.id === id))
    .filter((k): k is KartTanimi => k !== undefined)
}
