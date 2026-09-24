'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { OyunTanimi } from '@/lib/oyunlar/tanim'
import { dersBul } from '@/lib/oyunlar/tanim'
import { MODLAR, type OyunModu } from '@/lib/oyunlar/mod'
import { ZORLUK_ADI, type Zorluk } from '@/lib/oyunlar/ritim'
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

  return (
    <Sayfa onGeri={onKapat} geriEtiketi="Oyundan çık" ustYazi="TUR HAZIRLIĞI">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <header className="border-b border-border pb-6 pt-7">
          <p className="text-xs font-extrabold text-primary">{dersBul(oyun.ders).ad}</p>
          <h1 className="mt-2 font-display text-[34px] font-black leading-[1.08] tracking-tight">{oyun.ad}</h1>
          <p className="mt-2 text-sm leading-snug text-muted-foreground">{oyun.kisaAciklama}</p>
        </header>

        <div className="space-y-7 py-6">
          <ModSecimi secili={mod} onSec={setMod} />
          <ZorlukSecimi secili={zorluk} onSec={setZorluk} />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-background pt-3">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold text-muted-foreground">
          <button
            type="button"
            onClick={() => document.getElementById('zorluk-basligi')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            className="min-h-7 text-left underline decoration-border underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {MODLAR[mod].ad} · Zorluk: {ZORLUK_ADI[zorluk]} · Düzenle
          </button>
          {rekor > 0 && <span className="rakam shrink-0">En iyi: {rekor}</span>}
        </div>
        <AltDugme onClick={() => setSayiliyor(true)}>
          Oyuna başla <ArrowRight size={20} aria-hidden />
        </AltDugme>
      </div>
    </Sayfa>
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
