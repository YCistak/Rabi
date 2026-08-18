'use client'

import { Check, HelpCircle, Trophy, X } from 'lucide-react'
import type { OyunId } from '@/lib/types'
import { TUR_SURESI, YANLIS_CEZASI, sureOrani } from '@/lib/oyunlar/tur'
import { cn } from '@/lib/utils'
import { Halka } from '@/components/ui'
import { Rabi, type MaskotDurumu } from '@/components/maskot/rabi'

/**
 * Bütün mini oyunların ortak çerçevesi: kapatma, başlık, süre halkası, süre
 * çubuğu, sayaç şeridi ve tur sonu iskeleti.
 *
 * Tek yerde tutulmasının sebebi tutarlılık: üç oyun da aynı süreyi, aynı cezayı
 * ve aynı puanı kullanıyor. Her oyun kendi üst bilgisini çizseydi aynı sayının
 * farklı yerlerde farklı göründüğü bir arayüz çıkardı.
 *
 * Tam ekran açılıyor (`z-50`, alt menü z-40'ta): süreli bir turda yanlışlıkla
 * sekmeye basmak turu bitirirdi.
 */

/**
 * Oyun ailesinin renkleri.
 *
 * Ekranın zemini oyunun kendi pasteli; beyaz kartlar onun üstünde yüzüyor.
 * Kullanıcı hangi oyunda olduğunu başlığı okumadan renkten biliyor — Oyunlar
 * sekmesindeki kart, tur sonu ekranı ve Oyun Bankası aynı üçlüyü kullanıyor.
 */
const AILE: Record<
  OyunId,
  { zemin: string; yazi: string; dolgu: string; kenar: string; degisken: string }
> = {
  yazim: {
    zemin: 'bg-yzm',
    yazi: 'text-yzm-koyu',
    dolgu: 'bg-yzm-koyu',
    kenar: 'border-l-yzm-koyu',
    degisken: 'var(--yzm-koyu)',
  },
  // Türkçe dersinin oyunları Yazım'la aynı aileyi paylaşıyor.
  ses: {
    zemin: 'bg-yzm',
    yazi: 'text-yzm-koyu',
    dolgu: 'bg-yzm-koyu',
    kenar: 'border-l-yzm-koyu',
    degisken: 'var(--yzm-koyu)',
  },
  oge: {
    zemin: 'bg-yzm',
    yazi: 'text-yzm-koyu',
    dolgu: 'bg-yzm-koyu',
    kenar: 'border-l-yzm-koyu',
    degisken: 'var(--yzm-koyu)',
  },
  islem: {
    zemin: 'bg-isl',
    yazi: 'text-isl-koyu',
    dolgu: 'bg-isl-koyu',
    kenar: 'border-l-isl-koyu',
    degisken: 'var(--isl-koyu)',
  },
  edebiyat: {
    zemin: 'bg-edb',
    yazi: 'text-edb-koyu',
    dolgu: 'bg-edb-koyu',
    kenar: 'border-l-edb-koyu',
    degisken: 'var(--edb-koyu)',
  },
}

/** Tur sonunda listelenen en fazla yanlış. Gerisi Oyun Bankası'nda. */
export const EN_COK_YANLIS = 5

export type SayacBilgisi = {
  /** Kalan saniye. */
  kalan: number
  /** Şu anki ardışık doğru sayısı. */
  seri: number
  dogru: number
  yanlis: number
  enIyiSeri: number
  rekor: number
  /** Az önce yanlış yapıldı mı — süreden düşen 3 saniye görünsün diye. */
  cezaGorunur?: boolean
}

export function OyunKabugu({
  oyunId,
  baslik,
  sayac,
  onCik,
  onYardim,
  children,
}: {
  oyunId: OyunId
  baslik: string
  /** Sonuç ekranında `null` — orada süre ve sayaçların yeri yok. */
  sayac: SayacBilgisi | null
  onCik: () => void
  onYardim: () => void
  children: React.ReactNode
}) {
  const aile = AILE[oyunId]

  return (
    <div className={cn('fixed inset-0 z-50 flex flex-col', aile.zemin)}>
      <div className="guvenli-alt mx-auto flex w-full max-w-md flex-1 flex-col overflow-y-auto px-4 pb-3 pt-[calc(0.9rem+var(--guvenli-ust))]">
        <div className="flex flex-none items-center gap-2">
          <YuvarlakDugme etiket="Oyundan çık" onClick={onCik}>
            <X size={17} aria-hidden />
          </YuvarlakDugme>
          {/* Yardım yalnızca tur sürerken: sonuç ekranında kuralları açmanın
              bir karşılığı yok, tasarımda da orada tek düğme var. */}
          {sayac && (
            <YuvarlakDugme etiket="Nasıl oynanır" onClick={onYardim}>
              <HelpCircle size={17} aria-hidden />
            </YuvarlakDugme>
          )}

          <p className="min-w-0 flex-1 truncate text-center font-display text-[14.5px] font-extrabold tracking-tight">
            {baslik}
          </p>

          {/* Seri rozeti sağda: yerini hep koruyor, yoksa başlık her doğru
              cevapta yana kayardı. */}
          <SeriRozeti seri={sayac?.seri ?? 0} gorunur={sayac !== null} />
        </div>

        {sayac && (
          <>
            <div className="relative mt-4 flex flex-none items-center gap-3">
              <Halka
                deger={sayac.kalan}
                hedef={TUR_SURESI}
                boyut={54}
                kalinlik={5}
                renk={sureRengi(sayac.kalan)}
              >
                <span
                  className="rakam font-display text-[17px] font-extrabold"
                  style={{ color: sureRengi(sayac.kalan) }}
                >
                  {sayac.kalan}
                </span>
              </Halka>

              <div className="h-[9px] flex-1 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full transition-[width] duration-200"
                  style={{
                    width: `${sureOrani(sayac.kalan) * 100}%`,
                    background: sureRengi(sayac.kalan),
                  }}
                />
              </div>

              {/* Yanlışta süreden düşen 3 saniye. Rabi'nin tek cezası bu;
                  görünmezse kullanıcı sürenin neden hızlı bittiğini anlamıyor. */}
              {sayac.cezaGorunur && (
                <span className="rakam absolute -top-3 left-[66px] rounded-full bg-ikincil px-2.5 py-0.5 text-[12.5px] font-black text-white">
                  −{YANLIS_CEZASI} sn
                </span>
              )}
            </div>

            <div className="mt-3.5 grid flex-none grid-cols-4 gap-1.5 border-b border-border pb-3">
              <Sayac deger={sayac.dogru} etiket="Doğru" renk="text-success" />
              <Sayac deger={sayac.yanlis} etiket="Yanlış" renk="text-ikincil" />
              <Sayac deger={sayac.enIyiSeri} etiket="Seri" />
              <Sayac deger={sayac.rekor} etiket="Rekor" />
            </div>
          </>
        )}

        {children}
      </div>
    </div>
  )
}

/**
 * Süre rengi.
 *
 * Üç kademe: bol süre yeşil, azalırken mercan, son on saniyede kırmızı. Renk
 * burada durum bildiriyor — oyunun ailesi zaten ekranın zemininde duruyor,
 * halkayı da aileye boyamak "az kaldı" uyarısını yutardı.
 */
function sureRengi(kalan: number): string {
  if (kalan <= 10) return 'var(--danger)'
  if (kalan <= 20) return 'var(--ikincil)'
  return 'var(--success)'
}

function YuvarlakDugme({
  etiket,
  onClick,
  children,
}: {
  etiket: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiket}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] text-foreground transition active:bg-foreground/15"
    >
      {children}
    </button>
  )
}

/**
 * Ardışık doğru sayısı.
 *
 * Puan çarpanı değil — Rabi'de çarpan yok. İki ve üzerinde yanıyor; altında
 * soluk duruyor.
 */
function SeriRozeti({ seri, gorunur }: { seri: number; gorunur: boolean }) {
  const yaniyor = seri >= 2
  return (
    <span
      aria-label={gorunur ? `Ardışık doğru: ${seri}` : undefined}
      className={cn(
        'rakam flex h-[30px] shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] font-extrabold transition',
        !gorunur && 'invisible',
        yaniyor ? 'bg-ikincil text-white' : 'bg-foreground/[0.07] text-muted-foreground',
      )}
    >
      <span aria-hidden>🔥</span>
      {seri}
    </span>
  )
}

function Sayac({ deger, etiket, renk }: { deger: number; etiket: string; renk?: string }) {
  return (
    <div className="text-center">
      <span
        className={cn('rakam block font-display text-base font-extrabold leading-tight', renk)}
      >
        {deger}
      </span>
      <span className="mt-0.5 block text-[10.5px] font-bold leading-none text-muted-foreground/75">
        {etiket}
      </span>
    </div>
  )
}

/**
 * Cevabın hemen ardından çıkan geri bildirim şeridi.
 *
 * Yalnızca "yanlış" demek yetmiyor: doğrusu da burada yazıyor. Oyunun işi
 * öğretmek, hatayı söyleyip geçmek işe yaramıyor.
 */
export function Bildirim({
  iyi,
  baslik,
  aciklama,
}: {
  iyi: boolean
  baslik: string
  aciklama?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-none items-center gap-2 rounded-2xl px-3.5 py-2.5 text-[13.5px] font-extrabold',
        iyi ? 'bg-success-soft text-success' : 'bg-ikincil-soft text-ikincil',
      )}
    >
      {iyi ? (
        <Check size={17} className="shrink-0" aria-hidden />
      ) : (
        <X size={17} className="shrink-0" aria-hidden />
      )}
      {baslik}
      {aciklama && <span className="font-semibold opacity-85">{aciklama}</span>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tur sonu
// ---------------------------------------------------------------------------

/**
 * Puan çubuğunun oranları.
 *
 * Rakamı tek başına göstermek "iyi mi kötü mü" sorusunu cevapsız bırakıyordu;
 * rekor çizgisi ölçüyü veriyor. Tavan, ikisinden büyüğünün biraz üstünde:
 * rekor tam sağ uçta dursaydı, rekor kırıldığında çubuk taşardı.
 */
export function olcekOranlari(dogru: number, rekor: number): { dolu: number; cizgi: number } {
  const tavan = Math.max(dogru, rekor, 1) / 0.8
  return {
    dolu: Math.min(100, (dogru / tavan) * 100),
    cizgi: Math.min(100, (rekor / tavan) * 100),
  }
}

/**
 * Tur sonu başlığının altındaki cümle.
 *
 * `birim` oyuna göre değişiyor ("doğru", "eşleştirme"). Sayıya ek getirmiyoruz
 * (21'di / 18'di / 9'du) — ünlü uyumu her sayıda başka ek istiyor, cümleyi
 * ekten kaçıracak biçimde kurmak daha güvenli.
 */
export function rekorCumlesi(
  dogru: number,
  rekor: number,
  yeniRekor: boolean,
  birim: string,
): string {
  if (dogru === 0) return 'Bu turda hiç doğru yok — bir tur daha?'
  if (yeniRekor && rekor === 0) return 'İlk rekorun. Bundan sonrası bunu geçmek.'
  if (yeniRekor) return `Önceki rekorun ${rekor} ${birim} idi.`
  if (rekor > dogru) return `Rekoruna ${rekor - dogru} ${birim} kaldı.`
  return `Rekoruna eşitledin: ${rekor} ${birim}.`
}

/**
 * Üç oyunun ortak tur sonu iskeleti.
 *
 * Ekranın asıl işi yanlış listesi — puan bir turluk, yanlışlar kalıcı. O yüzden
 * liste `children` olarak dışarıdan geliyor: her oyunun yanlışı başka bir şey
 * anlatıyor (yazımda kural, işlemde tür dağılımı, edebiyatta senin cevabın).
 */
export function TurSonu({
  oyunId,
  dogru,
  yanlis,
  enIyiSeri,
  rekor,
  yeniRekor,
  bankaTuru,
  altBaslik,
  bolumBasligi,
  bolumAltYazisi,
  onTekrar,
  onCik,
  children,
}: {
  oyunId: OyunId
  dogru: number
  yanlis: number
  enIyiSeri: number
  /** Tura girerken geçerli olan rekor — çubuktaki çizgi bunu gösteriyor. */
  rekor: number
  yeniRekor: boolean
  /** Banka turunda rekor ve istatistik yazılmıyor; ekran bunu söylüyor. */
  bankaTuru: boolean
  altBaslik: string
  bolumBasligi: string
  bolumAltYazisi: string
  onTekrar: () => void
  onCik: () => void
  children?: React.ReactNode
}) {
  const aile = AILE[oyunId]
  const { dolu, cizgi } = olcekOranlari(dogru, rekor)

  const maskot: MaskotDurumu = yeniRekor
    ? 'kutlama'
    : dogru === 0
      ? 'uzgun'
      : yanlis === 0
        ? 'mutlu'
        : 'normal'

  return (
    <div className="flex flex-1 flex-col gap-3 py-3">
      <div className="flex flex-none items-center gap-3 px-0.5">
        <Rabi durum={maskot} boyut={52} />
        <div className="min-w-0">
          <h2 className="font-display text-xl font-extrabold tracking-tight">
            {yeniRekor ? 'Yeni rekor!' : 'Süre bitti'}
          </h2>
          <p className="mt-0.5 text-[12.5px] font-semibold text-muted-foreground">{altBaslik}</p>
        </div>
      </div>

      {bankaTuru && (
        <p className="flex-none self-start rounded-full bg-ikincil-soft px-3 py-1 text-[11.5px] font-extrabold text-ikincil">
          Banka turu — rekora sayılmaz
        </p>
      )}

      <div className="golge-kart flex-none rounded-[20px] bg-card px-4 pb-4 pt-3.5">
        <div className="flex items-baseline justify-between gap-2.5">
          <b className="rakam font-display text-[38px] font-extrabold leading-none">
            {dogru}
            <span className="ml-1.5 text-[15px] font-bold text-muted-foreground">doğru</span>
          </b>

          <span
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-extrabold',
              yeniRekor ? 'bg-warning text-white' : 'bg-warning-soft text-warning',
            )}
          >
            <Trophy size={13} aria-hidden />
            {yeniRekor ? `+${dogru - rekor} rekor` : rekor > 0 ? `Rekor ${rekor}` : 'İlk turun'}
          </span>
        </div>

        <div className="relative mt-3 h-2.5 rounded-full bg-muted">
          <span
            className={cn('block h-full rounded-full', aile.dolgu)}
            style={{ width: `${dolu}%` }}
          />
          {/* Rekor kırılınca çizgi geride kalıyor ve soluyor — artık hedef değil. */}
          {rekor > 0 && (
            <span
              className={cn(
                'absolute -bottom-1 -top-1 w-[3px] rounded-sm',
                yeniRekor ? 'bg-border' : 'bg-foreground',
              )}
              style={{ left: `${cizgi}%` }}
            />
          )}
        </div>

        <div className="mt-2 flex justify-between text-[11px] font-bold text-muted-foreground">
          <span className="rakam">Bu tur {dogru}</span>
          {rekor > 0 && (
            <span className="rakam">
              {yeniRekor ? 'Eski rekorun' : 'Rekorun'} {rekor}
            </span>
          )}
        </div>
      </div>

      <div className="grid flex-none grid-cols-3 gap-2">
        <Kutu deger={dogru} etiket="Doğru" renk="text-success" />
        <Kutu deger={yanlis} etiket="Yanlış" renk="text-ikincil" />
        <Kutu deger={enIyiSeri} etiket="En iyi seri" />
      </div>

      {children && (
        <>
          <p className="mt-1 flex-none font-display text-[13.5px] font-extrabold">
            {bolumBasligi}
            <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
              {bolumAltYazisi}
            </span>
          </p>
          {children}
        </>
      )}

      <div className="mt-auto grid flex-none grid-cols-2 gap-2.5 pt-2">
        <button
          type="button"
          onClick={onCik}
          className="golge-kart grid h-12 place-items-center rounded-[17px] bg-card font-display text-[14.5px] font-extrabold transition active:brightness-95"
        >
          Bitir
        </button>
        <button
          type="button"
          onClick={onTekrar}
          className={cn(
            'grid h-12 place-items-center rounded-[17px] font-display text-[14.5px] font-extrabold text-white transition active:brightness-95',
            aile.dolgu,
          )}
        >
          Bir tur daha
        </button>
      </div>
    </div>
  )
}

function Kutu({ deger, etiket, renk }: { deger: number; etiket: string; renk?: string }) {
  return (
    <div className="golge-kart rounded-2xl bg-card px-2 py-2.5 text-center">
      <b className={cn('rakam block font-display text-lg font-extrabold leading-tight', renk)}>
        {deger}
      </b>
      <span className="mt-0.5 block text-[10.5px] font-bold text-muted-foreground/75">
        {etiket}
      </span>
    </div>
  )
}

/** Tur sonundaki tek yanlış kartı; sol kenarı oyunun rengiyle çizgili. */
export function YanlisKarti({
  oyunId,
  children,
}: {
  oyunId: OyunId
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'golge-kart rounded-2xl border-l-4 bg-card px-3.5 py-3',
        AILE[oyunId].kenar,
      )}
    >
      {children}
    </div>
  )
}

/**
 * Listenin kesildiği yer.
 *
 * Beşten sonrası okunmuyor; tamamı Oyun Bankası'nda duruyor. Hap tıklanabilir
 * değil — bu ekrandan bankaya geçmek turu ortada bırakırdı.
 */
export function KalanHapi({ kalan }: { kalan: number }) {
  return (
    <div className="flex-none">
      <p className="flex h-10 items-center justify-center rounded-[14px] border-[1.5px] border-dashed border-border bg-card/60 text-[12.5px] font-extrabold text-muted-foreground">
        ve {kalan} tane daha
      </p>
      <p className="mt-1.5 text-center text-[11.5px] font-semibold text-muted-foreground">
        Hepsi Oyun Bankası&apos;na eklendi.
      </p>
    </div>
  )
}
