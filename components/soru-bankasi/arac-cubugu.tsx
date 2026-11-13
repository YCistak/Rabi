'use client'

import { ChevronLeft, ChevronRight, Eraser, Hand, Highlighter, Minus, PenLine, Plus, Redo2, Trash2, Undo2 } from 'lucide-react'
import { useReducer, useState } from 'react'
import type { Murekkep } from '@/lib/cizim'
import type { KaralamaAraci } from './karalama-katmani'

export const MUREKKEPLER: { ad: Murekkep; etiket: string }[] = [
  { ad: 'kursun', etiket: 'Kurşun' },
  { ad: 'kirmizi', etiket: 'Kırmızı' },
  { ad: 'mavi', etiket: 'Mavi' },
  { ad: 'yesil', etiket: 'Yeşil' },
]

/** Kalınlık kademesi → ekran pikseli. Vurgulayıcı satırı kaplayacak kadar kalın. */
export const KALEM_KALINLIKLARI = [1.6, 2.6, 4.4] as const
export const VURGU_KALINLIKLARI = [12, 18, 26] as const
export type KalinlikKademesi = 0 | 1 | 2

const ARACLAR: {
  arac: KaralamaAraci
  etiket: string
  simge: React.ReactNode
}[] = [
  { arac: 'kalem', etiket: 'Kalem', simge: <PenLine size={20} /> },
  { arac: 'vurgu', etiket: 'Vurgulayıcı', simge: <Highlighter size={20} /> },
  { arac: 'silgi', etiket: 'Silgi', simge: <Eraser size={20} /> },
  { arac: 'el', etiket: 'El (kaydır)', simge: <Hand size={20} /> },
]

type Balon = 'renk' | 'kalinlik' | 'ayar' | null

/** Sayfa yakınlığının dışarıdan sürülmesi (fareyle; dokunmatikte kıstırma var). */
export type YakinlikKolu = {
  /** 1 = %100. */
  al: () => number
  degistir: (fark: number) => void
  sifirla: () => void
}

/**
 * Karalama araçları — gezinme çubuğunun üstünde tek satır. Dar ekranda renk,
 * kalınlık ve temizle tek "kalem ayarı" balonunda toplanır: dokuz düğme 375
 * px'e 44 px'lik dokunma hedefiyle sığmıyor. Tutamakla küçülünce yalnız
 * etkin aracın simgesi kalır ve sayfanın sol altında yüzer.
 *
 * Yakınlık − / + düğmeleri de çubukta yer kalmadığı için balonda: dar ekranda
 * "kalem ayarı", genişte "kalınlık" balonunun altında. Sayfanın üstünde yüzen
 * kalıcı bir balon soru kökünü örtüyordu.
 */
export function AracCubugu({
  arac,
  renk,
  kademe,
  katli,
  geriAlinabilir,
  ileriAlinabilir,
  cizgiVar,
  onArac,
  onRenk,
  onKademe,
  onGeriAl,
  onIleriAl,
  onTemizle,
  onKatla,
  yakinlik,
}: {
  arac: KaralamaAraci
  renk: Murekkep
  kademe: KalinlikKademesi
  katli: boolean
  geriAlinabilir: boolean
  ileriAlinabilir: boolean
  cizgiVar: boolean
  onArac: (arac: KaralamaAraci) => void
  onRenk: (renk: Murekkep) => void
  onKademe: (kademe: KalinlikKademesi) => void
  onGeriAl: () => void
  onIleriAl: () => void
  onTemizle: () => void
  onKatla: () => void
  yakinlik: YakinlikKolu
}) {
  const [balon, setBalon] = useState<Balon>(null)
  // Yakınlık ana bileşenin state'inde değil (kıstırmada her kare yeniden
  // çizerdi); balon açıkken düğmeye basınca okunup yeniden çizilir.
  const [, yenile] = useReducer((n: number) => n + 1, 0)
  const ac = (hedef: Balon) => setBalon((onceki) => (onceki === hedef ? null : hedef))
  const etkin = ARACLAR.find((deger) => deger.arac === arac)!

  if (katli) {
    return (
      <div className="pointer-events-none absolute bottom-full left-2 z-20 mb-2">
        <button
          type="button"
          onClick={onKatla}
          aria-label={`Araçları aç (seçili: ${etkin.etiket})`}
          className="golge-kart pointer-events-auto flex h-11 items-center gap-1 rounded-full border border-border bg-card pr-3 pl-1.5 text-primary active:scale-95"
        >
          <ChevronRight size={18} className="text-muted-foreground" />
          {etkin.simge}
        </button>
      </div>
    )
  }

  const kalinliklar = arac === 'vurgu' ? VURGU_KALINLIKLARI : KALEM_KALINLIKLARI
  const nokta = (boyut: number, ad: Murekkep | 'vurgu') => (
    <span
      className="block rounded-full"
      style={{
        width: boyut,
        height: boyut,
        backgroundColor: `var(--murekkep-${ad})`,
      }}
    />
  )

  const renkSecimi = (
    <div className="flex gap-1">
      {MUREKKEPLER.map((m) => (
        <button
          key={m.ad}
          type="button"
          aria-label={m.etiket}
          aria-pressed={renk === m.ad}
          onClick={() => {
            onRenk(m.ad)
            if (arac !== 'kalem') onArac('kalem')
            setBalon(null)
          }}
          className={`grid size-11 place-items-center rounded-full ${renk === m.ad ? 'bg-muted ring-2 ring-primary' : 'active:bg-muted'}`}
        >
          {nokta(24, m.ad)}
        </button>
      ))}
    </div>
  )
  const kalinlikSecimi = (
    <div className="flex gap-1">
      {kalinliklar.map((deger, sira) => (
        <button
          key={deger}
          type="button"
          aria-label={['İnce', 'Orta', 'Kalın'][sira]}
          aria-pressed={kademe === sira}
          onClick={() => {
            onKademe(sira as KalinlikKademesi)
            setBalon(null)
          }}
          className={`grid size-11 place-items-center rounded-xl ${kademe === sira ? 'bg-muted ring-2 ring-primary' : 'active:bg-muted'}`}
        >
          {nokta(arac === 'vurgu' ? 6 + sira * 4 : 4 + sira * 4, arac === 'vurgu' ? 'vurgu' : renk)}
        </button>
      ))}
    </div>
  )
  const temizle = (
    <button
      type="button"
      disabled={!cizgiVar}
      onClick={() => {
        onTemizle()
        setBalon(null)
      }}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-extrabold text-danger active:bg-danger-soft disabled:opacity-40"
    >
      <Trash2 size={18} /> Hepsini temizle
    </button>
  )

  const olcek = balon === 'ayar' || balon === 'kalinlik' ? yakinlik.al() : 1
  const yakinlikDugmesi = (etiket: string, devreDisi: boolean, islev: () => void, icerik: React.ReactNode) => (
    <button
      type="button"
      aria-label={etiket}
      disabled={devreDisi}
      onClick={() => {
        islev()
        yenile()
      }}
      className="grid size-11 place-items-center rounded-xl text-foreground active:bg-muted disabled:opacity-30"
    >
      {icerik}
    </button>
  )
  const yakinlikSecimi = (
    <div className="flex w-full items-center justify-between gap-1 border-t border-border pt-1">
      {yakinlikDugmesi('Uzaklaştır', olcek <= 1, () => yakinlik.degistir(-0.5), <Minus size={18} />)}
      {yakinlikDugmesi(
        'Yakınlığı sıfırla',
        olcek === 1,
        yakinlik.sifirla,
        <span className="rakam text-[13px] font-extrabold">%{Math.round(olcek * 100)}</span>,
      )}
      {yakinlikDugmesi('Yakınlaştır', olcek >= 4, () => yakinlik.degistir(0.5), <Plus size={18} />)}
    </div>
  )

  const dugme = (
    etiket: string,
    secili: boolean,
    islev: () => void,
    icerik: React.ReactNode,
    devreDisi = false,
    gorunurluk = 'grid',
  ) => (
    <button
      type="button"
      aria-label={etiket}
      title={etiket}
      aria-pressed={secili}
      disabled={devreDisi}
      onClick={islev}
      className={`${gorunurluk} h-11 w-11 shrink-0 place-items-center rounded-xl transition active:scale-95 disabled:opacity-30 ${secili ? 'bg-primary-derin text-white' : 'text-foreground active:bg-muted'}`}
    >
      {icerik}
    </button>
  )

  return (
    <div className="@container relative px-2 pt-1.5">
      {balon && <div className="fixed inset-0 z-30" onClick={() => setBalon(null)} aria-hidden />}
      {balon && (
        <div
          role="dialog"
          aria-label={balon === 'renk' ? 'Mürekkep rengi' : balon === 'kalinlik' ? 'Kalınlık ve yakınlık' : 'Kalem ayarı'}
          className="acilir-giris golge-kart absolute right-2 bottom-full z-40 mb-1 flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-1.5"
        >
          {(balon === 'renk' || balon === 'ayar') && arac !== 'vurgu' && renkSecimi}
          {(balon === 'kalinlik' || balon === 'ayar') && kalinlikSecimi}
          {(balon === 'kalinlik' || balon === 'ayar') && yakinlikSecimi}
          {balon === 'ayar' && <div className="w-full border-t border-border pt-1">{temizle}</div>}
        </div>
      )}
      <div className="golge-kart flex items-center justify-between rounded-2xl border border-border bg-card px-0.5">
        <button
          type="button"
          onClick={onKatla}
          aria-label="Araç çubuğunu küçült"
          className="grid h-11 w-6 shrink-0 place-items-center text-muted-foreground active:text-foreground"
        >
          <ChevronLeft size={16} />
        </button>
        {ARACLAR.map((deger) => (
          <span key={deger.arac} className="contents">
            {dugme(
              deger.etiket,
              arac === deger.arac,
              () => {
                onArac(deger.arac)
                setBalon(null)
              },
              deger.simge,
            )}
          </span>
        ))}
        <span className="mx-0.5 h-6 w-px shrink-0 bg-border" aria-hidden />
        {dugme('Geri al', false, onGeriAl, <Undo2 size={20} />, !geriAlinabilir)}
        {dugme('İleri al', false, onIleriAl, <Redo2 size={20} />, !ileriAlinabilir)}
        {/* Dar ekranda tek balon; genişte renk, kalınlık, temizle ayrı. */}
        {dugme(
          'Kalem ayarı',
          balon === 'ayar',
          () => ac('ayar'),
          <span className="grid size-7 place-items-center rounded-full ring-1 ring-border">
            {nokta(arac === 'vurgu' ? 8 + kademe * 3 : 5 + kademe * 3, arac === 'vurgu' ? 'vurgu' : renk)}
          </span>,
          false,
          'grid @min-[25rem]:hidden',
        )}
        {dugme(
          'Mürekkep rengi',
          balon === 'renk',
          () => ac('renk'),
          <span className="grid size-7 place-items-center rounded-full ring-1 ring-border">
            {nokta(18, arac === 'vurgu' ? 'vurgu' : renk)}
          </span>,
          arac === 'vurgu',
          'hidden @min-[25rem]:grid',
        )}
        {dugme(
          'Kalınlık',
          balon === 'kalinlik',
          () => ac('kalinlik'),
          nokta(arac === 'vurgu' ? 8 + kademe * 3 : 4 + kademe * 3, 'kursun'),
          false,
          'hidden @min-[25rem]:grid',
        )}
        {dugme('Hepsini temizle', false, onTemizle, <Trash2 size={20} />, !cizgiVar, 'hidden @min-[25rem]:grid')}
      </div>
    </div>
  )
}
