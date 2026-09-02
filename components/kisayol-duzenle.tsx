'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGeriKatmani } from '@/lib/geri'
import { KISAYOL_SAYISI } from '@/lib/son-kullanilan'
import { Buton } from '@/components/ui'

/**
 * Ana sayfadaki dört kutucuğu seçme penceresi.
 *
 * Kutucuklar bir süre yalnızca "en son kullanılan"dı ve o iyi bir varsayılan
 * ama bir tercih değil: her tur sonrası sıra değişiyor, kullanıcı aradığı
 * kutucuğu her seferinde okumak zorunda kalıyordu. Sabitlenen kutucuk
 * yerinde duruyor.
 *
 * Pencere iki bölümde de aynı: araçlar da dersler de kimlik, ad ve emojiden
 * ibaret bir liste. İkinci bir kopya, iki listenin zamanla birbirinden
 * ayrılması demekti.
 *
 * Seçim **onaylanana kadar** kayda geçmiyor (`secim` yerel state): dört yeri
 * yeniden dizerken her dokunuş ana sayfayı oynatsaydı kullanıcı ne yaptığını
 * göremezdi.
 */

export type SabitlenebilirOge = {
  id: string
  ad: string
  ikon: string
  /** Kutucuğun pastel zemini — ana sayfadaki kutucukla aynı sınıf. */
  renk: string
  /** Satırın altındaki tek satırlık açıklama. */
  aciklama?: string
}

export function KisayolDuzenleme({
  acik,
  baslik,
  secenekler,
  secili,
  onKaydet,
  onKapat,
}: {
  acik: boolean
  baslik: string
  secenekler: SabitlenebilirOge[]
  /** Kayıtta duran sabit kimlikler; boşsa hiçbir şey sabitlenmemiş. */
  secili: string[]
  onKaydet: (secim: string[]) => void
  onKapat: () => void
}) {
  const [secim, setSecim] = useState<string[]>(secili)

  /*
    Pencere her açılışta kayıttaki seçimden başlıyor.

    Kapanışta sıfırlansaydı vazgeçilen bir düzenleme bileşende asılı kalır ve
    pencere ikinci kez açıldığında kullanıcının kaydetmediği seçim görünürdü.
  */
  useEffect(() => {
    if (acik) setSecim(secili)
  }, [acik, secili])

  useGeriKatmani(acik, onKapat)

  if (!acik) return null

  const dolu = secim.length >= KISAYOL_SAYISI

  const degistir = (id: string) =>
    setSecim((onceki) =>
      onceki.includes(id)
        ? onceki.filter((mevcut) => mevcut !== id)
        : // Sıra da bilgi: seçme sırası ana sayfadaki dizilim oluyor.
          onceki.length >= KISAYOL_SAYISI
          ? onceki
          : [...onceki, id],
    )

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 pt-[calc(1rem+var(--guvenli-ust))]">
      {/*
        Alttan açılan sayfa: liste on bir satıra kadar çıkıyor ve ortada duran
        bir kutu küçük telefonda ekranın dışına taşıyordu. Yükseklik sınırı ile
        içerideki kaydırma birlikte şart — düğmeler ekran dışında kalırsa
        pencere kapanamaz hâle gelir.
      */}
      <div className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-t-[26px] bg-card">
        <header className="px-5 pt-5 pb-3">
          <h2 className="font-display text-[19px] font-extrabold tracking-tight">{baslik}</h2>
          {/* Sayaç başlığın altında: dördün kaçının dolduğu, seçim yaparken
              bakılan tek sayı. */}
          <p className="mt-1 text-[13px] font-medium text-muted-foreground">
            En fazla {KISAYOL_SAYISI} tane seç —{' '}
            <b className="rakam font-extrabold text-foreground">
              {secim.length}/{KISAYOL_SAYISI}
            </b>
            . Seçmediklerin en son kullandıklarınla dolar.
          </p>
        </header>

        <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-4 pb-2">
          {secenekler.map((oge) => {
            const isaretli = secim.includes(oge.id)
            return (
              <li key={oge.id}>
                <button
                  type="button"
                  aria-pressed={isaretli}
                  // Dolu listede seçilmemiş satır kapanıyor: sessizce hiçbir şey
                  // yapmayan bir tuş, bozuk bir tuş gibi duruyordu.
                  disabled={!isaretli && dolu}
                  onClick={() => degistir(oge.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    'disabled:opacity-40',
                    isaretli ? 'border-foreground bg-muted/50' : 'border-border bg-card',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-11 shrink-0 place-items-center rounded-[15px] text-[21px] leading-none',
                      oge.renk,
                    )}
                    aria-hidden
                  >
                    {oge.ikon}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-extrabold leading-tight">
                      {oge.ad}
                    </span>
                    {oge.aciklama && (
                      <span className="mt-0.5 block truncate text-xs font-medium text-muted-foreground">
                        {oge.aciklama}
                      </span>
                    )}
                  </span>

                  <span
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-full border-2 transition',
                      isaretli
                        ? 'border-success bg-success text-white'
                        : 'border-border text-transparent',
                    )}
                    aria-hidden
                  >
                    <Check size={14} strokeWidth={3.5} />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="flex gap-2 border-t border-border px-4 pt-3 pb-[calc(1rem+var(--guvenli-alt))]">
          {/* "Sıfırla" seçimi silip kutucukları son kullanılanlara bırakıyor:
              sabitlemekten vazgeçmenin dördünü tek tek çıkarmaktan başka bir
              yolu olmalı. */}
          <Buton
            bicim="hayalet"
            className="flex-1"
            disabled={secim.length === 0}
            onClick={() => setSecim([])}
          >
            Sıfırla
          </Buton>
          <Buton bicim="ikincil" className="flex-1" onClick={onKapat}>
            Vazgeç
          </Buton>
          <Buton
            className="flex-1"
            onClick={() => {
              onKaydet(secim)
              onKapat()
            }}
          >
            Kaydet
          </Buton>
        </div>
      </div>
    </div>
  )
}
