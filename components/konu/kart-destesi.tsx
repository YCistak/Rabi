'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import type { BilgiKarti, Konu } from '@/lib/konu'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

/**
 * Bilgi kartı destesi.
 *
 * Kart **aşağı** kaydırılırsa "biliyorum", **yukarı** kaydırılırsa
 * "bilmiyorum" demek. Yön keyfî değil, kullanıcının isteği: bilinmeyen
 * bilgi yukarı, yani "yukarı çıkarılıp bir kenara ayrılan" şey oluyor.
 * Renkler yönü söylüyor — yukarısı kırmızı, aşağısı yeşil.
 *
 * Aynı iki karar için ekranın altında **düğme** de var. Kaydırma keşfedilmesi
 * gereken bir hareket; ilk kartta ne yapacağını bilmeyen kullanıcı ekranda
 * kilitli kalıyordu. Düğmeler ayrıca ekran okuyucunun tek tutamağı.
 */

/** Kararın kesinleştiği eşik, piksel. Altında kalan sürükleme geri yaylanıyor. */
const ESIK = 88

/** Karar verildikten sonra kartın ekrandan çıkma süresi; CSS'teki süreyle eşleşmeli. */
const CIKIS_SURESI = 220

export type DesteSonucu = {
  bilinenler: BilgiKarti[]
  bilinmeyenler: BilgiKarti[]
  /** Destenin sonuna gelindi mi. Yarıda çıkıldıysa `false`. */
  bitti: boolean
}

export function KartDestesi({
  konu,
  temaAdi,
  dersAdi,
  zeminSinifi,
  onKapat,
}: {
  konu: Konu
  temaAdi: string
  dersAdi: string
  /** Üst şeridin zemin sınıfı; dersin renk ailesinden geliyor.
   *  Sınıf adı **dışarıdan tam yazılı** geliyor: `bg-${aile}-kart` gibi
   *  birleştirilen bir ad Tailwind'in taramasından düşer ve şerit renksiz kalır. */
  zeminSinifi: string
  onKapat: (sonuc: DesteSonucu) => void
}) {
  const [sira, setSira] = useState(0)
  const [bilinenler, setBilinenler] = useState<BilgiKarti[]>([])
  const [bilinmeyenler, setBilinmeyenler] = useState<BilgiKarti[]>([])
  /** Sürükleme mesafesi; karar verilince ekrandan çıkış için büyütülüyor. */
  const [kaydirma, setKaydirma] = useState(0)
  const [cikiyor, setCikiyor] = useState(false)

  const bitti = sira >= konu.kartlar.length
  const kart = bitti ? null : konu.kartlar[sira]

  /*
    Sonuç ref'te de duruyor: geri tuşu katmanı bileşenin ilk çiziminde
    kaydediliyor ve `onKapat`ı çağırdığı anda state'in güncel hâlini görmesi
    gerekiyor.
  */
  const sonucRef = useRef<DesteSonucu>({ bilinenler: [], bilinmeyenler: [], bitti: false })
  sonucRef.current = { bilinenler, bilinmeyenler, bitti }
  useGeriKatmani(true, () => onKapat(sonucRef.current))

  const baslangicRef = useRef<number | null>(null)

  function karar(biliyorMu: boolean) {
    if (!kart || cikiyor) return
    setCikiyor(true)
    setKaydirma(biliyorMu ? 600 : -600)
    if (biliyorMu) setBilinenler((o) => [...o, kart])
    else setBilinmeyenler((o) => [...o, kart])
    window.setTimeout(() => {
      setCikiyor(false)
      setKaydirma(0)
      setSira((o) => o + 1)
    }, CIKIS_SURESI)
  }

  function baslat(olay: React.PointerEvent) {
    if (cikiyor) return
    baslangicRef.current = olay.clientY
    olay.currentTarget.setPointerCapture(olay.pointerId)
  }

  function surukle(olay: React.PointerEvent) {
    if (baslangicRef.current === null) return
    setKaydirma(olay.clientY - baslangicRef.current)
  }

  function birak() {
    if (baslangicRef.current === null) return
    const mesafe = kaydirma
    baslangicRef.current = null
    if (Math.abs(mesafe) >= ESIK) karar(mesafe > 0)
    else setKaydirma(0)
  }

  // Kart değişince sayfa başa dönmeli: uzun bir karttan sonra gelen kısa kart
  // ekranın ortasından başlıyordu.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [sira])

  const oran = konu.kartlar.length === 0 ? 1 : Math.min(sira / konu.kartlar.length, 1)
  const yukari = kaydirma < 0
  const guc = Math.min(Math.abs(kaydirma) / ESIK, 1)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Üst şerit: dersin rengi, konunun adı ve ilerleme çubuğu. */}
      <header
        className={cn('shrink-0 px-4 pb-3 pt-[calc(0.75rem+var(--guvenli-ust))]', zeminSinifi)}
      >
        <div className="mx-auto flex max-w-md items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
              {dersAdi} · {temaAdi}
            </p>
            <h2 className="mt-0.5 truncate font-display text-[17px] font-extrabold tracking-tight">
              {konu.ad}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onKapat(sonucRef.current)}
            aria-label="Kapat"
            className="-mr-1 grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition active:bg-black/5"
          >
            <X size={19} strokeWidth={2.6} aria-hidden />
          </button>
        </div>

        <div className="mx-auto mt-2.5 flex max-w-md items-center gap-2.5">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/10">
            <div
              className="h-full rounded-full bg-primary-parlak transition-[width] duration-200"
              style={{ width: `${oran * 100}%` }}
            />
          </div>
          <span className="rakam shrink-0 text-[11.5px] font-extrabold text-muted-foreground">
            {Math.min(sira + (bitti ? 0 : 1), konu.kartlar.length)}/{konu.kartlar.length}
          </span>
        </div>
      </header>

      {bitti ? (
        <Sonuc
          konuAdi={konu.ad}
          bilinen={bilinenler.length}
          bilinmeyen={bilinmeyenler.length}
          onKapat={() => onKapat({ bilinenler, bilinmeyenler, bitti: true })}
        />
      ) : (
        <div className="relative flex min-h-0 flex-1 flex-col justify-center px-4 py-4">
          {/* Kararı anlatan iki bölge. Sürükleme yönüne göre parlıyorlar;
              dururken de soluk hâlde görünüyorlar ki hareket keşfedilebilsin. */}
          <Bolge
            yon="ust"
            etiket="Bilmiyorum"
            etkin={yukari}
            guc={guc}
          />

          <div className="relative mx-auto w-full max-w-md flex-1">
            {/* Arkadaki kart: destede daha kart olduğunu gösteriyor. Tek kart
                kaldığında çizilmiyor, yoksa bitmeyen bir deste izlenimi verirdi. */}
            {sira + 1 < konu.kartlar.length && (
              <div
                aria-hidden
                className="golge-kart absolute inset-x-3 top-3 bottom-0 rounded-3xl bg-card opacity-60"
              />
            )}

            <article
              onPointerDown={baslat}
              onPointerMove={surukle}
              onPointerUp={birak}
              onPointerCancel={birak}
              style={{
                transform: `translateY(${kaydirma}px) rotate(${kaydirma * 0.012}deg)`,
                transition: baslangicRef.current === null ? `transform ${CIKIS_SURESI}ms ease` : 'none',
              }}
              className="golge-kart relative flex h-full touch-none flex-col justify-center rounded-3xl bg-card px-6 py-8 select-none"
            >
              <h3 className="font-display text-[21px] leading-tight font-extrabold tracking-tight text-balance">
                {kart!.baslik}
              </h3>
              <p className="mt-3 text-[16.5px] leading-relaxed font-medium text-pretty">
                {kart!.metin}
              </p>
            </article>
          </div>

          <Bolge yon="alt" etiket="Biliyorum" etkin={!yukari && kaydirma !== 0} guc={guc} />

          {/* Düğmeler kaydırmanın yerine değil yanına konuyor: yönü öğrenen
              kullanıcı kaydırmaya geçiyor, öğrenmeyen düğmeyle ilerliyor. */}
          <div className="mx-auto mt-3 flex w-full max-w-md gap-2.5">
            <Buton
              bicim="ikincil"
              onClick={() => karar(false)}
              className="flex-1 bg-danger-soft text-danger"
            >
              <ChevronUp size={17} aria-hidden /> Bilmiyorum
            </Buton>
            <Buton
              bicim="ikincil"
              onClick={() => karar(true)}
              className="flex-1 bg-success-soft text-success"
            >
              <ChevronDown size={17} aria-hidden /> Biliyorum
            </Buton>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Kararı gösteren renkli bölge.
 *
 * Sürükleme yönündeyken doluyor. Dururken tümüyle kaybolmuyor: hangi yönün
 * ne demek olduğu kart sürüklenmeden de okunabilmeli.
 */
function Bolge({
  yon,
  etiket,
  etkin,
  guc,
}: {
  yon: 'ust' | 'alt'
  etiket: string
  etkin: boolean
  guc: number
}) {
  const dolu = etkin ? guc : 0
  return (
    <div
      aria-hidden
      className={cn(
        'mx-auto flex w-full max-w-md shrink-0 items-center justify-center gap-1.5 rounded-2xl py-2 text-[12px] font-extrabold uppercase tracking-[0.1em] transition-colors',
        yon === 'ust' ? 'mb-2 text-danger' : 'mt-2 text-success',
      )}
      style={{
        backgroundColor:
          yon === 'ust'
            ? `color-mix(in srgb, var(--danger-soft) ${25 + dolu * 75}%, transparent)`
            : `color-mix(in srgb, var(--success-soft) ${25 + dolu * 75}%, transparent)`,
        opacity: 0.55 + dolu * 0.45,
      }}
    >
      {yon === 'ust' ? <ChevronUp size={15} /> : null}
      {etiket}
      {yon === 'alt' ? <ChevronDown size={15} /> : null}
    </div>
  )
}

/** Deste bitince: iki sayı ve tek bir çıkış. */
function Sonuc({
  konuAdi,
  bilinen,
  bilinmeyen,
  onKapat,
}: {
  konuAdi: string
  bilinen: number
  bilinmeyen: number
  onKapat: () => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 text-center">
      <Rabi durum={bilinmeyen === 0 ? 'kutlama' : 'normal'} boyut={104} />
      <h3 className="mt-3 font-display text-[22px] font-extrabold tracking-tight text-balance">
        {konuAdi} bitti
      </h3>
      <p className="mt-1.5 text-[14.5px] font-semibold text-muted-foreground text-pretty">
        {bilinmeyen === 0
          ? 'Bu konudaki her kartı biliyordun.'
          : `${bilinmeyen} kartı Bilmediklerim’e ekledim, oradan tekrar okuyabilirsin.`}
      </p>

      <div className="mt-5 flex w-full gap-2.5">
        <Sayi deger={bilinen} etiket="biliyorum" renk="bg-success-soft text-success" />
        <Sayi deger={bilinmeyen} etiket="bilmiyorum" renk="bg-danger-soft text-danger" />
      </div>

      <Buton onClick={onKapat} className="mt-6 w-full">
        Haritaya dön
      </Buton>
    </div>
  )
}

function Sayi({ deger, etiket, renk }: { deger: number; etiket: string; renk: string }) {
  return (
    <div className={cn('flex-1 rounded-2xl px-3 py-3.5', renk)}>
      <p className="rakam font-display text-[26px] leading-none font-extrabold">{deger}</p>
      <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.08em] opacity-80">
        {etiket}
      </p>
    </div>
  )
}
