'use client'

import { KARTLAR, type Ekran, type KartRengi, type KartTanimi } from '@/lib/gezinme'
import { cn } from '@/lib/utils'

/**
 * Kart aileleri — Oyunlar sekmesindeki ders kartlarıyla aynı üçlü.
 *
 * `zemin` kartın pastel yüzeyi, `ok` sağ alttaki dolu dairenin rengi. İki
 * ekran aynı kart biçimini kullanıyor, dolayısıyla renk sözleşmesi de aynı
 * olmak zorunda.
 */
const RENK_SINIFI: Record<KartRengi, { zemin: string; ok: string }> = {
  mavi: { zemin: 'bg-primary-soft', ok: 'bg-primary' },
  pembe: { zemin: 'bg-yzm-kart', ok: 'bg-yzm-ok' },
  krem: { zemin: 'bg-isl-kart', ok: 'bg-isl-ok' },
  nane: { zemin: 'bg-success-soft', ok: 'bg-success' },
  lavanta: { zemin: 'bg-edb-kart', ok: 'bg-edb-ok' },
  deniz: { zemin: 'bg-trh-kart', ok: 'bg-trh-ok' },
}

/**
 * "Araçlar" sekmesinin bölümleri.
 *
 * Gruplama `lib/gezinme.ts` yerine burada, çünkü yalnızca bu ekrana ait: aynı
 * kart listesi ana sayfada başlıksız bir ızgara olarak çiziliyor. Bir düzine
 * giriş düz bir liste hâlinde kaybolduğu için dört başlığa bölündü.
 */
const BOLUMLER: { baslik: string; kartlar: Ekran[] }[] = [
  { baslik: 'Çalışma', kartlar: ['pomodoro', 'soru', 'yanlis-banka', 'notlar'] },
  { baslik: 'Denemeler', kartlar: ['deneme', 'siralama', 'istatistik'] },
  { baslik: 'Okul', kartlar: ['okul', 'devamsizlik'] },
  { baslik: 'Motivasyon', kartlar: ['haftalik-ozet', 'hedef', 'rozetler'] },
]

/**
 * "Araçlar" sekmesi — bölüm bölüm kart ızgarası.
 *
 * Beyaz satır listesi de denendi; Oyunlar sekmesindeki renkli kartların yanında
 * soluk ve birbirine benzer duruyordu. İki sekme aynı kart ölçüsünü paylaşıyor:
 * iki sütun, pastel zemin, beyaz kutuda simge ve sağ altta dolu ok.
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

      <div className="mt-4 space-y-5">
        {bolumler.map(({ baslik, kartlar }) => (
          <section key={baslik}>
            <h2 className="mb-3 ml-1 text-[11.5px] font-extrabold tracking-[0.09em] text-muted-foreground uppercase">
              {baslik}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {kartlar.map((kart, sira) => (
                <AracKarti
                  key={kart.id}
                  kart={kart}
                  // Tek sayıda kart varsa sonuncusu iki sütunu kaplıyor; yoksa
                  // ızgarada yanı boş bir kart kalıyordu.
                  genis={kartlar.length % 2 === 1 && sira === kartlar.length - 1}
                  onAc={() => onKartAc(kart.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

/** Oyunlardaki ders kartıyla aynı ölçüde: simge kutusu, ad, açıklama ve dolu ok. */
function AracKarti({
  kart,
  genis,
  onAc,
}: {
  kart: KartTanimi
  /** İki sütunu birden kaplayan yatay hâl. */
  genis: boolean
  onAc: () => void
}) {
  const { ad, aciklama, ikon, renk } = kart
  const aile = RENK_SINIFI[renk]

  return (
    <button
      type="button"
      onClick={onAc}
      className={cn(
        'relative rounded-2xl p-4 text-left transition active:brightness-[0.97]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        aile.zemin,
        genis ? 'col-span-2 flex items-center gap-3.5' : 'flex min-h-[164px] flex-col',
      )}
    >
      {/* Oyun kartındaki kutunun aynısı: aynı ölçü, aynı beyaz yüzey, aynı
          emoji boyu. İki sekme yan yana bakıldığında tek bir dile benzesin. */}
      <span
        className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[15px] bg-white/80 text-[23px] leading-none"
        aria-hidden
      >
        {ikon}
      </span>

      <span className={cn('min-w-0', genis ? 'flex-1' : 'mt-2.5')}>
        <span className="block font-display text-[16.5px] leading-[1.15] font-extrabold tracking-tight text-foreground">
          {ad}
        </span>
        <span className="mt-1.5 block text-[12.5px] leading-snug font-medium text-foreground/60">
          {aciklama}
        </span>
      </span>

      <span
        className={cn(
          'grid h-8 w-8 shrink-0 place-items-center rounded-full text-white',
          aile.ok,
          genis ? '' : 'mt-auto self-end',
        )}
        aria-hidden
      >
        <OkSimgesi />
      </span>
    </button>
  )
}

function OkSimgesi() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={17}
      height={17}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}

/** Bölümde yazan kimlikleri kart tanımlarına çevirir; tanımı olmayanı atlar. */
function kartlariBul(idler: Ekran[]): KartTanimi[] {
  return idler
    .map((id) => KARTLAR.find((k) => k.id === id))
    .filter((k): k is KartTanimi => k !== undefined)
}
