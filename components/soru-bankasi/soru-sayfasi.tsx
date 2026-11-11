'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { KartGorseli } from '@/components/konu/kart-gorseli'
import { BildirimDugmesi, type BildirimKolu } from '@/components/hata-bildir'
import { cevapKaydet, durumAl } from '@/lib/soru-bankasi/mantik'
import type { BankaKonusu } from '@/lib/soru-bankasi/dizin'
import type { BankaSorusu, SoruBankasiKaydi } from '@/lib/soru-bankasi/tip'
import type { Cizgi } from '@/lib/cizim'
import { KaralamaKatmani } from './karalama-katmani'
import { SoruMetni } from './soru-metni'
import { Siklar } from './siklar'

type KayitYaz = (guncelle: (onceki: SoruBankasiKaydi) => SoruBankasiKaydi) => void

export function SoruSayfasi({
  konu,
  sorular,
  kaynakSiralari,
  kayit,
  setKayit,
  tekrar,
  hataBildirimi,
  onGeri,
  onBitir,
  baslangicSirasi = 0,
  cozumAcik = false,
}: {
  konu: BankaKonusu
  sorular: BankaSorusu[]
  kaynakSiralari: number[]
  kayit: SoruBankasiKaydi
  setKayit: KayitYaz
  tekrar: boolean
  hataBildirimi: BildirimKolu
  onGeri: () => void
  onBitir: () => void
  baslangicSirasi?: number
  cozumAcik?: boolean
}) {
  const [sira, setSira] = useState(baslangicSirasi)
  const [secimler, setSecimler] = useState<Record<number, number>>(
    cozumAcik ? { [baslangicSirasi]: sorular[baslangicSirasi].dogru } : {},
  )
  const [cizimler, setCizimler] = useState<Record<number, Cizgi[]>>({})
  const numaraDugmeleri = useRef<Array<HTMLButtonElement | null>>([])
  const soru = sorular[sira]
  const secim = secimler[sira]

  useEffect(() => {
    numaraDugmeleri.current[sira]?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [sira])

  const sec = (secilen: number) => {
    if (secim !== undefined) return
    setSecimler((onceki) => ({ ...onceki, [sira]: secilen }))
    setKayit((onceki) =>
      cevapKaydet(onceki, konu.id, kaynakSiralari[sira], secilen === soru.dogru ? 'd' : 'y', tekrar),
    )
  }

  const durum = (hedef: number) => {
    if (secimler[hedef] !== undefined) return secimler[hedef] === sorular[hedef].dogru ? 'd' : 'y'
    return durumAl(kayit, konu.id, kaynakSiralari[hedef])
  }
  const bildirimSorusu = {
    kimlik: `${konu.id}#${kaynakSiralari[sira]}`,
    oyun: 'soru-bankasi' as const,
    soruMetni: soru.soru,
    cevapMetni: soru.siklar[soru.dogru],
  }

  return (
    <main className="fixed inset-0 z-50 mx-auto max-w-md overflow-y-auto bg-background pb-[calc(4.75rem+var(--guvenli-alt))]">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 pt-[calc(0.5rem+var(--guvenli-ust))] pb-3 backdrop-blur-sm">
        <div className="flex min-h-11 items-center gap-2">
          <button type="button" onClick={onGeri} aria-label="Konuya dön" className="grid size-11 place-items-center rounded-xl text-primary active:bg-muted">
            <ArrowLeft size={20} />
          </button>
          <p className="min-w-0 flex-1 font-display font-extrabold">
            {tekrar ? 'Yanlışlar' : `Test ${Math.floor(kaynakSiralari[0] / 12) + 1}`} · <span className="rakam">{sira + 1}/{sorular.length}</span>
          </p>
          <BildirimDugmesi soru={bildirimSorusu} kol={hataBildirimi} kompakt />
        </div>
        <div className="scrollbar-gizli flex gap-1 overflow-x-auto pb-0.5" aria-label="Soru numaraları">
          {sorular.map((_, indeks) => {
            const soruDurumu = durum(indeks)
            return (
              <button
                ref={(dugme) => { numaraDugmeleri.current[indeks] = dugme }}
                key={indeks}
                type="button"
                onClick={() => setSira(indeks)}
                aria-current={indeks === sira ? 'step' : undefined}
                className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-extrabold ${indeks === sira ? 'bg-konu-matematik-dolgu text-white' : soruDurumu === 'd' ? 'bg-success-dolu text-white' : soruDurumu === 'y' ? 'bg-danger-dolu text-white' : 'bg-card text-foreground ring-1 ring-border'}`}
              >
                {indeks + 1}
              </button>
            )
          })}
        </div>
      </header>

      <KaralamaKatmani
        soruAnahtari={`${konu.id}#${kaynakSiralari[sira]}`}
        cizgiler={cizimler[sira] ?? []}
        onCizgiler={(deger) => setCizimler((onceki) => ({ ...onceki, [sira]: deger }))}
      >
        <article className="min-h-[calc(100vh-10rem)] px-4 pt-5 pb-[calc(5.5rem+var(--guvenli-alt))]">
          <div className="text-[17px] leading-relaxed font-semibold">
            <SoruMetni metin={soru.soru} />
          </div>
          {soru.onculler && (
            <ol className="mt-4 space-y-2 pl-2 leading-relaxed">
              {soru.onculler.map((oncul, indeks) => (
                <li key={oncul} className="flex gap-2">
                  <b className="shrink-0">{['I', 'II', 'III'][indeks]}.</b>
                  <SoruMetni metin={oncul} />
                </li>
              ))}
            </ol>
          )}
          {soru.gorsel && (
            <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-card p-2">
              <KartGorseli gorsel={soru.gorsel} etiket="Soru görseli" />
            </div>
          )}
          <Siklar siklar={soru.siklar} dogru={soru.dogru} secim={secim} onSec={sec} />
          {secim !== undefined && (
            <>
              <section className="mt-5 rounded-2xl border border-border bg-card p-4">
                <h2 className="font-display font-extrabold">Çözüm</h2>
                <p className="mt-2 leading-relaxed"><SoruMetni metin={soru.cozum} /></p>
              </section>
              <button type="button" onClick={() => sira < sorular.length - 1 ? setSira(sira + 1) : onBitir()} className="mt-4 min-h-12 w-full rounded-xl bg-primary-parlak font-extrabold text-white active:brightness-95">
                {sira < sorular.length - 1 ? 'Sonraki soru' : 'Testi bitir'}
              </button>
            </>
          )}
          <div className="mt-8 min-h-[100vh] rounded-2xl border border-dashed border-border bg-card p-4 text-sm font-bold text-muted-foreground">
            Karalama alanı
          </div>
        </article>
      </KaralamaKatmani>
    </main>
  )
}
