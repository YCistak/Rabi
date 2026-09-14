'use client'

import { Check, ChevronRight } from 'lucide-react'
import type { BilgiKarti } from '@/lib/konu'
import type { HaritaTemasi } from '@/lib/konu/harita-temasi'
import { molaMetni } from '@/lib/konu/deste-akisi'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { DesteBasligi, DesteCubugu, DesteRozeti } from './deste-basligi'

/**
 * Kısa mola — destenin ortasında bir kez gelen nefes.
 *
 * Kart değil, soru da değil: Rabi zıplıyor, kaç kart okunduğu yazıyor ve
 * okunan kartların adları alt alta duruyor. Listenin işi tekrar: okuyan
 * kişi yedi başlığı görünce hangisini hatırlamadığını fark ediyor; sayı
 * tek başına bunu söylemiyor.
 *
 * Yeri ve metni rastgele (`lib/konu/deste-akisi.ts`): metin beş varyasyondan
 * biri, hangisi olduğu deste açılırken seçiliyor ve mola boyunca sabit —
 * yeniden çizimde değişen bir cümle, ekranı bozuk gösterirdi.
 *
 * Konfeti yok. Mockup'ta vardı; oyunlardaki kural burada da geçerli: her
 * destede patlayan bir kutlama üç desteden sonra anlamını yitiriyor ve
 * rekorun karşılığı olan konfetiyi sıradanlaştırıyor.
 */
export function KisaMola({
  konuAdi,
  dersAdi,
  temaAdi,
  bicim,
  okunanKartlar,
  toplam,
  secim,
  onKapat,
  onIlerle,
}: {
  konuAdi: string
  dersAdi: string
  temaAdi: string
  bicim: HaritaTemasi
  /** Mola gelene kadar okunmuş kartlar, sırayla. */
  okunanKartlar: BilgiKarti[]
  toplam: number
  /** Mola metninin varyasyonu (`molaSecimi`). */
  secim: number
  onKapat: () => void
  onIlerle: () => void
}) {
  const okunan = okunanKartlar.length
  const metin = molaMetni(secim, okunan, toplam - okunan)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="shrink-0 px-4 pt-[calc(0.75rem+var(--guvenli-ust))]">
        <DesteBasligi
          konuAdi={konuAdi}
          dersAdi={dersAdi}
          temaAdi={temaAdi}
          onKapat={onKapat}
          sag={<DesteRozeti bicim={bicim}>Kısa mola</DesteRozeti>}
        />
        <DesteCubugu toplam={toplam} okunan={okunan} bicim={bicim} />
      </header>

      <div className="mx-auto flex w-full max-w-md min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-[calc(1rem+var(--guvenli-alt))]">
        {/* Işıma maskotun arkasında: düz zeminde tavşan havada duruyordu. */}
        <div className="relative mt-8 flex flex-col items-center">
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 size-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: 'radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0))',
            }}
          />
          <div className="mola-maskot relative">
            <div className="mola-suzul">
              <Rabi
                durum="kutlama"
                poz="ziplayan"
                boyut={168}
                className="drop-shadow-[0_16px_20px_rgba(31,36,48,0.18)]"
              />
            </div>
          </div>

          <div className="mola-yazi relative mt-5 text-center">
            <h2 className="font-display text-[30px] leading-tight font-extrabold tracking-tight">
              {metin.baslik}
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed font-semibold text-foreground/75 text-pretty">
              {metin.metin}
            </p>
          </div>

          <div
            className="mola-serit golge-kart relative mt-5 inline-flex items-center gap-3 rounded-2xl bg-card px-4 py-3"
            style={{ animationDelay: '300ms' }}
          >
            <span className="flex items-baseline gap-0.5">
              <span
                className="rakam font-display text-[22px] leading-none font-extrabold"
                style={{ color: bicim.murekkep }}
              >
                {okunan}
              </span>
              <span className="rakam text-[13px] font-bold text-muted-foreground">/{toplam}</span>
            </span>
            <span className="h-[22px] w-px bg-border" />
            <span className="text-[13px] font-bold text-foreground/80">kart okundu</span>
          </div>
        </div>

        <div className="min-h-3.5 flex-1" />

        <div
          className="mola-serit golge-kart w-full rounded-[18px] bg-card px-[18px] py-4"
          style={{ animationDelay: '340ms' }}
        >
          <p className="text-[10.5px] font-extrabold tracking-[0.18em] text-muted-foreground uppercase">
            Bu molada öğrendiklerin
          </p>
          <ul className="mt-3.5 flex flex-col gap-2.5">
            {okunanKartlar.map((k) => (
              <li key={k.id} className="flex items-center gap-2.5">
                <span
                  className="grid size-5 shrink-0 place-items-center rounded-[7px] text-white"
                  style={{ background: bicim.murekkep }}
                  aria-hidden
                >
                  <Check size={12} strokeWidth={3.5} />
                </span>
                <span className="text-[14px] leading-snug font-bold text-foreground/85">
                  {k.baslik}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-h-3.5 flex-1" />

        <Buton
          onClick={onIlerle}
          className="mola-serit h-[58px] w-full text-[16px] shadow-[0_3px_0_var(--primary)]"
          style={{ animationDelay: '380ms' }}
        >
          İlerle
          <span className="grid size-[26px] place-items-center rounded-[9px] bg-white/16">
            <ChevronRight size={16} aria-hidden />
          </span>
        </Buton>
      </div>
    </div>
  )
}
