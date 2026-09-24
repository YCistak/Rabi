'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import type { OyunTanimi } from '@/lib/oyunlar/tanim'
import { dersBul } from '@/lib/oyunlar/tanim'
import type { OyunModu } from '@/lib/oyunlar/mod'
import type { Zorluk } from '@/lib/oyunlar/ritim'
import { vurgulariAyir } from '@/lib/metin'
import { useGeriKatmani } from '@/lib/geri'
import { useGenelTest } from '@/components/genel-test-baglami'
import { useTurAyari } from '@/components/tur-ayari-baglami'
import { ModSecimi } from '@/components/mod-secimi'
import { ZorlukSecimi } from '@/components/zorluk-secimi'
import { GeriSayim } from '@/components/oyun-geri-sayim'

/**
 * Tur öncesinde yalnızca mod ve başlangıç zorluğu seçilir.
 * Banka turu bu ayarları kullanmadığı için doğrudan geri sayıma geçer.
 * Oyun içindeki yardım, örnek göstermeden kısa kural metnini açar.
 */
export function OyunTanitim({
  oyun,
  acik,
  rekor,
  baslatir,
  onBasla,
  onKapat,
}: {
  oyun: OyunTanimi
  acik: boolean
  rekor: number
  baslatir: boolean
  onBasla: () => void
  onKapat: () => void
}) {
  const [sayiliyor, setSayiliyor] = useState(false)
  const genelTest = useGenelTest()
  const { mod, zorluk, setMod, setZorluk, secilebilir } = useTurAyari()

  useEffect(() => {
    if (acik) setSayiliyor(false)
  }, [acik])

  useGeriKatmani(acik, onKapat)

  // Genel test oyunları arka arkaya açar; her oyundan önce yeni bir karar istemez.
  useEffect(() => {
    if (genelTest && acik && baslatir) onBasla()
  }, [genelTest, acik, baslatir, onBasla])

  if (!acik || (genelTest && baslatir)) return null
  if (baslatir && (!secilebilir || sayiliyor)) return <GeriSayim onBitti={onBasla} />

  if (!baslatir) {
    return (
      <Sayfa onGeri={onKapat} geriEtiketi="Oyuna dön" ustYazi="OYUN KURALI">
        <div className="min-h-0 flex-1 overflow-y-auto pt-9">
          <p className="text-xs font-extrabold text-primary">{dersBul(oyun.ders).ad}</p>
          <h1 className="mt-2 font-display text-[34px] font-black leading-[1.08] tracking-tight">{oyun.ad}</h1>
          <div className="mt-8 border-t border-border pt-6 text-[16px] leading-relaxed">
            <Vurgulu metin={oyun.ozet} />
          </div>
        </div>
        <AltDugme onClick={onKapat}>Oyuna dön</AltDugme>
      </Sayfa>
    )
  }

  return <AyarPenceresi
    oyun={oyun}
    rekor={rekor}
    mod={mod}
    setMod={setMod}
    zorluk={zorluk}
    setZorluk={setZorluk}
    onDevam={() => setSayiliyor(true)}
    onKapat={onKapat}
  />
}

/** Önceki mod ve zorluk seçim düzeni; Başlat doğrudan geri sayıma geçer. */
function AyarPenceresi({
  oyun,
  rekor,
  mod,
  setMod,
  zorluk,
  setZorluk,
  onDevam,
  onKapat,
}: {
  oyun: OyunTanimi
  rekor: number
  mod: OyunModu
  setMod: (mod: OyunModu) => void
  zorluk: Zorluk
  setZorluk: (zorluk: Zorluk) => void
  onDevam: () => void
  onKapat: () => void
}) {
  return (
    <div
      className="katman-zemin fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-[2px]"
      onClick={onKapat}
    >
      <div
        className="pencere-girisi max-h-[86%] w-full max-w-[400px] overflow-y-auto rounded-[28px] bg-card px-4.5 pb-5 pt-5.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[10.5px] font-black uppercase leading-none tracking-[0.18em] text-primary">
              {oyun.ad}
            </p>
            <h1 className="mt-1.5 font-display text-[21px] font-black leading-tight">Turu ayarla</h1>
            {rekor > 0 && (
              <p className="mt-2.5 inline-flex items-center rounded-full bg-primary-dolu px-3.5 py-1.5 text-[12.5px] font-black leading-none text-white shadow-[0_8px_18px_-10px_rgba(180,71,31,0.9)]">
                <span className="rakam">Rekor — {rekor}</span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onKapat}
            aria-label="Kapat"
            className="inline-flex size-11 flex-none items-center justify-center rounded-[14px] bg-muted/70 text-muted-foreground transition active:bg-muted"
          >
            <X size={15} strokeWidth={2.8} aria-hidden />
          </button>
        </div>
        <div className="mt-4.5 flex flex-col gap-4.5">
          <ModSecimi secili={mod} onSec={setMod} />
          <ZorlukSecimi secili={zorluk} onSec={setZorluk} />
        </div>
        <button
          type="button"
          onClick={onDevam}
          className="mt-4.5 w-full rounded-[18px] bg-primary-dolu py-[19px] font-display text-[17px] font-black leading-none text-white transition active:brightness-95"
        >
          Başlat
        </button>
      </div>
    </div>
  )
}

function Sayfa({
  onGeri,
  geriEtiketi,
  ustYazi,
  children,
}: {
  onGeri: () => void
  geriEtiketi: string
  ustYazi: string
  children: React.ReactNode
}) {
  return (
    <div className="tam-katman-girisi fixed inset-0 z-50 flex yuk-ekran justify-center bg-background">
      <div
        className="flex w-full max-w-md flex-col px-5"
        style={{
          paddingTop: 'calc(0.5rem + var(--guvenli-ust))',
          paddingBottom: 'calc(0.75rem + var(--guvenli-alt))',
        }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border pb-3">
          <button
            type="button"
            onClick={onGeri}
            aria-label={geriEtiketi}
            className="flex size-11 items-center justify-center rounded-xl text-foreground active:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft size={20} strokeWidth={2.2} aria-hidden />
          </button>
          <span className="text-[11px] font-black tracking-[0.16em] text-muted-foreground">{ustYazi}</span>
        </div>
        {children}
      </div>
    </div>
  )
}

function AltDugme({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-dolu px-5 font-display text-[17px] font-black text-white active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {children}
    </button>
  )
}

function Vurgulu({ metin }: { metin: string }) {
  return (
    <>
      {vurgulariAyir(metin).map((parca, sira) =>
        parca.tur === 'kalin' ? (
          <strong key={sira} className="font-extrabold text-foreground">{parca.metin}</strong>
        ) : parca.tur === 'egik' ? (
          <em key={sira} className="italic">{parca.metin}</em>
        ) : (
          <span key={sira} className="text-muted-foreground">{parca.metin}</span>
        ),
      )}
    </>
  )
}
