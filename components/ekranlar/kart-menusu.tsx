'use client'

import { KARTLAR, type Ekran, type KartRengi, type KartTanimi } from '@/lib/gezinme'
import { cn } from '@/lib/utils'

/**
 * Simge yüzleri — her aile bir pastel zemin.
 *
 * Kart artık pastel değil beyaz; renk yalnızca simgenin arkasında duruyor.
 * Satırın tamamı renkliyken bir düzine giriş alt alta bir boya kutusu gibi
 * okunuyordu ve renk "hangi araç" bilgisini taşımayı bırakmıştı.
 */
const RENK_SINIFI: Record<KartRengi, string> = {
  mavi: 'bg-primary-soft',
  pembe: 'bg-yzm-kart',
  krem: 'bg-isl-kart',
  nane: 'bg-success-soft',
  lavanta: 'bg-edb-kart',
  deniz: 'bg-trh-kart',
}

/**
 * "Araçlar" sekmesinin bölümleri.
 *
 * Gruplama `lib/gezinme.ts` yerine burada, çünkü yalnızca bu ekrana ait: aynı
 * kart listesi ana sayfada başlıksız bir ızgara olarak çiziliyor. Bir düzine
 * giriş düz bir liste hâlinde kaybolduğu için dört başlığa bölündü.
 *
 * `ipucu` başlığın sağında duran soluk yazı: başlık ne olduğunu, ipucu ne işe
 * yaradığını söylüyor. "Okul" tek başına takvim mi not mu belli etmiyordu.
 */
const BOLUMLER: { baslik: string; ipucu: string; kartlar: Ekran[] }[] = [
  {
    baslik: 'Çalışma',
    ipucu: 'Günlük rutin',
    kartlar: ['pomodoro', 'soru', 'yanlis-banka', 'notlar'],
  },
  {
    baslik: 'Denemeler',
    ipucu: 'Sınav performansın',
    kartlar: ['deneme', 'siralama', 'istatistik'],
  },
  { baslik: 'Okul', ipucu: 'Dönem takibi', kartlar: ['okul', 'devamsizlik'] },
  {
    baslik: 'Motivasyon',
    ipucu: 'Devam etme sebebin',
    kartlar: ['hedef', 'rozetler'],
  },
]

/**
 * "Araçlar" sekmesi — bölüm bölüm satır listesi.
 *
 * Renkli kart ızgarası da denendi; iki sütunda on iki kart ekranı üç ekran
 * boyuna çıkarıyor ve hepsi aynı ağırlıkta durduğu için aranan araç ancak
 * kaydırarak bulunuyordu. Satır dar: bir bakışta bütün bir bölüm görünüyor.
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
    ...BOLUMLER.map(({ baslik, ipucu, kartlar }) => ({
      baslik,
      ipucu,
      kartlar: kartlariBul(kartlar),
    })),
    ...(yersizler.length > 0 ? [{ baslik: 'Diğer', ipucu: '', kartlar: yersizler }] : []),
  ]

  return (
    <div className={className}>
      <header className="flex items-start gap-3 px-0.5 pt-1">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black tracking-[0.2em] text-ikincil">RABİ</p>
          <h1 className="mt-1 font-display text-[27px] font-extrabold tracking-tight">Araçlar</h1>
        </div>

        {/* Başlığın simgesi sağ üstte, ana sayfada maskotun durduğu hizada:
            iki sekme aynı yerden başlasın diye. */}
        <span
          className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-yzm-kart text-[21px] leading-none"
          aria-hidden
        >
          🧰
        </span>
      </header>

      {/* Süzgeç çipleri kaldırıldı: dört başlık zaten ekranda görünüyor ve
          süzmek listeyi kısaltmaktan çok kaydırmayı yerinden ediyordu. */}
      <div className="mt-5 space-y-5">
        {bolumler.map(({ baslik, ipucu, kartlar }) => (
          <section key={baslik}>
            <div className="mb-2 flex items-baseline justify-between gap-3 px-1.5">
              <h2 className="text-[11.5px] font-extrabold tracking-[0.09em] text-muted-foreground uppercase">
                {baslik}
              </h2>
              {ipucu && (
                <span className="shrink-0 text-[12px] font-medium text-muted-foreground/70">
                  {ipucu}
                </span>
              )}
            </div>

            {/* Bölümün satırları tek kartın içinde: her satır ayrı kart olsaydı
                bir düzine gölge alt alta dizilir, ekran huzursuz olurdu. */}
            <ul className="golge-kart overflow-hidden rounded-[22px] bg-card">
              {kartlar.map((kart) => (
                <li key={kart.id} className="border-t border-border first:border-t-0">
                  <AracSatiri kart={kart} onAc={() => onKartAc(kart.id)} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

/** Tek satır: pastel simge kutusu, ad, açıklama ve sağda ok. */
function AracSatiri({ kart, onAc }: { kart: KartTanimi; onAc: () => void }) {
  const { ad, aciklama, ikon, renk } = kart

  return (
    <button
      type="button"
      onClick={onAc}
      className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition active:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
    >
      <span
        className={cn(
          'grid size-[42px] shrink-0 place-items-center rounded-full text-[20px] leading-none',
          RENK_SINIFI[renk],
        )}
        aria-hidden
      >
        {ikon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-display text-[16px] leading-tight font-extrabold tracking-tight">
          {ad}
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-snug font-medium text-muted-foreground">
          {aciklama}
        </span>
      </span>

      <span className="shrink-0 text-muted-foreground/50" aria-hidden>
        <OkSimgesi boyut={18} />
      </span>
    </button>
  )
}

function OkSimgesi({ boyut }: { boyut: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={boyut}
      height={boyut}
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
