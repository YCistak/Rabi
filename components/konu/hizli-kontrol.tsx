'use client'

import { useState } from 'react'
import { Check, ChevronRight, RotateCcw, X } from 'lucide-react'
import type { HizliKontrol } from '@/lib/konu'
import type { HaritaTemasi } from '@/lib/konu/harita-temasi'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { DesteBasligi, DesteCubugu, DesteRozeti } from './deste-basligi'

/**
 * Hızlı kontrol — destenin ortasında, okunmuş bir karttan sorulan iki şıklı
 * soru.
 *
 * Deste sonundaki yoklamadan ayrı bir iş: o "okuma bitti, ne kaldı" diye
 * soruyor, bu "önceki kart oturdu mu" diye. Şık ikiyle sınırlı; dört şıklı
 * soru okumanın ortasına bir test koyar.
 *
 * Cevap verilince alttan bir pencere geliyor ve **yanlışta iki yol** var:
 * "Tekrar oku" soruyu doğuran karta dönüyor, "Devam et" ise önce bir uyarı
 * çıkarıyor ("Kartı atlıyorsun"). Uyarı kararı engellemiyor, sadece
 * bedelini söylüyor — kilitli kitaptaki onay penceresinin aynı kuralı.
 * Doğru cevapta yalnızca "Devam et" var.
 *
 * Mockup'taki "+10 puan · seri sürüyor" satırı alınmadı: uygulamada puan
 * yok ve olmayacak (`AGENTS.md` → "Seviye, havuç ve mağaza kaldırıldı").
 * Konfeti de aynı gerekçeyle yok (`kisa-mola.tsx`).
 */

const HARFLER = ['A', 'B'] as const

export function HizliKontrolEkrani({
  konuAdi,
  dersAdi,
  temaAdi,
  bicim,
  kontrol,
  okunan,
  toplam,
  onKapat,
  onTekrarOku,
  onDevam,
}: {
  konuAdi: string
  dersAdi: string
  temaAdi: string
  bicim: HaritaTemasi
  kontrol: HizliKontrol
  okunan: number
  toplam: number
  onKapat: () => void
  /** Sorunun dayandığı karta dönülüyor. */
  onTekrarOku: () => void
  onDevam: () => void
}) {
  /** Seçilen şık; `null` ise henüz karar verilmedi. */
  const [secim, setSecim] = useState<0 | 1 | null>(null)
  const [uyari, setUyari] = useState(false)
  const dogru = secim !== null && secim === kontrol.dogru

  // Geri tuşu: önce uyarıyı, sonra sonuç penceresini kapatıyor; ikisi de
  // kapalıyken deste kendi katmanıyla ilgileniyor.
  useGeriKatmani(uyari, () => setUyari(false))
  useGeriKatmani(secim !== null && !uyari, () => setSecim(null))

  function devam() {
    if (secim !== null && !dogru) {
      setUyari(true)
      return
    }
    onDevam()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="shrink-0 px-4 pt-[calc(0.75rem+var(--guvenli-ust))]">
        <DesteBasligi
          konuAdi={konuAdi}
          dersAdi={dersAdi}
          temaAdi={temaAdi}
          onKapat={onKapat}
          sag={
            <DesteRozeti bicim={bicim}>
              <span aria-hidden className="text-[12px]">
                🧠
              </span>
              Hızlı kontrol
            </DesteRozeti>
          }
        />
        <DesteCubugu toplam={toplam} okunan={okunan} bicim={bicim} />
      </header>

      <div className="mx-auto flex w-full max-w-md min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-[calc(1rem+var(--guvenli-alt))]">
        <div className="relative mt-8 flex flex-col items-center">
          <span
            aria-hidden
            className="pointer-events-none absolute top-[90px] left-1/2 size-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: 'radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0))',
            }}
          />
          <div className="mola-maskot relative">
            <div className="mola-suzul">
              <Rabi
                durum="calisiyor"
                poz="dusunen"
                boyut={156}
                className="drop-shadow-[0_16px_20px_rgba(31,36,48,0.18)]"
              />
            </div>
            <span
              aria-hidden
              className="golge-kart absolute top-1.5 -right-1.5 grid size-11 place-items-center rounded-[15px] bg-card text-[21px] leading-none"
            >
              💭
            </span>
          </div>

          <div className="mola-yazi relative mt-4 text-center">
            <p className="text-[10.5px] font-extrabold tracking-[0.18em] text-muted-foreground uppercase">
              Önceki kartlardan
            </p>
            <h2 className="mt-3 font-display text-[24px] leading-snug font-extrabold tracking-tight text-pretty">
              {kontrol.soru}
            </h2>
          </div>
        </div>

        <div className="mola-serit mt-6 flex flex-col gap-3" style={{ animationDelay: '260ms' }}>
          {kontrol.siklar.map((metin, i) => {
            const bu = secim === i
            const yesil = bu && i === kontrol.dogru
            const kirmizi = bu && i !== kontrol.dogru
            return (
              <button
                key={metin}
                type="button"
                disabled={secim !== null}
                onClick={() => setSecim(i as 0 | 1)}
                className={cn(
                  'flex min-h-[66px] w-full items-center gap-3.5 rounded-[18px] border-[1.5px] px-4 py-3.5 text-left transition active:brightness-[0.97] disabled:pointer-events-none',
                  yesil && 'border-success bg-success-soft',
                  kirmizi && 'border-danger bg-danger-soft',
                  !bu && 'golge-kart border-black/10 bg-card',
                )}
              >
                <span
                  className={cn(
                    'grid size-[34px] shrink-0 place-items-center rounded-xl text-[14px] font-extrabold',
                    yesil && 'bg-success text-white',
                    kirmizi && 'bg-danger text-white',
                    !bu && 'bg-muted text-foreground/80',
                  )}
                >
                  {HARFLER[i]}
                </span>
                <span className="min-w-0 flex-1 text-[15.5px] leading-snug font-bold text-pretty">
                  {metin}
                </span>
                {yesil && <Check size={20} strokeWidth={3} className="shrink-0 text-success" aria-hidden />}
                {kirmizi && <X size={20} strokeWidth={3} className="shrink-0 text-danger" aria-hidden />}
              </button>
            )
          })}
        </div>
        <div className="min-h-4 flex-1" />
      </div>

      {secim !== null && (
        <div className="katman-zemin fixed inset-0 z-[60] flex items-end justify-center bg-black/35">
          <div
            role="dialog"
            aria-labelledby="kontrol-sonuc-baslik"
            className="alt-pencere-girisi relative w-full max-w-md rounded-t-[28px] bg-card px-6 pt-6 pb-[calc(1.75rem+var(--guvenli-alt))] shadow-[0_-8px_30px_-12px_rgba(31,36,48,0.4)]"
          >
            <span
              aria-hidden
              className="absolute top-3 left-1/2 h-1 w-11 -translate-x-1/2 rounded-full bg-black/15"
            />
            <div className="mt-3 flex items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  'grid size-12 shrink-0 place-items-center rounded-[17px] text-[25px] leading-none',
                  dogru ? 'bg-success-soft' : 'bg-danger-soft',
                )}
              >
                {dogru ? '🎉' : '💡'}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  id="kontrol-sonuc-baslik"
                  className="font-display text-[23px] leading-tight font-extrabold tracking-tight"
                >
                  {dogru ? 'Doğru bildin!' : 'Neredeyse'}
                </p>
                <p className={cn('mt-1 text-[13px] font-bold', dogru ? 'text-success' : 'text-danger')}>
                  {dogru ? 'Kart yerine oturmuş' : 'Kartı bir kez daha oku'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-end gap-2.5">
              <Rabi
                durum={dogru ? 'mutlu' : 'calisiyor'}
                poz={dogru ? 'sevinen' : 'dusunen'}
                boyut={80}
                className="drop-shadow-[0_6px_9px_rgba(31,36,48,0.16)]"
              />
              <div className="relative mb-3 min-w-0 flex-1 rounded-2xl bg-foreground px-4 py-3.5">
                <span
                  aria-hidden
                  className="absolute bottom-4 -left-1.5 size-3 rotate-45 rounded-[2px] bg-foreground"
                />
                <p className="relative text-[14px] leading-relaxed font-semibold text-background text-pretty">
                  {dogru ? kontrol.aciklama.dogru : kontrol.aciklama.yanlis}
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              {!dogru && (
                <Buton
                  bicim="ikincil"
                  onClick={onTekrarOku}
                  className="h-14 flex-1 border-[1.5px] border-black/12 bg-card text-[15px] text-foreground/80"
                >
                  <RotateCcw size={16} aria-hidden /> Tekrar oku
                </Buton>
              )}
              <Buton onClick={devam} className="h-14 flex-1 text-[16px] shadow-[0_3px_0_var(--primary)]">
                Devam et
                <span className="grid size-[26px] place-items-center rounded-[9px] bg-white/16">
                  <ChevronRight size={16} aria-hidden />
                </span>
              </Buton>
            </div>
          </div>
        </div>
      )}

      {uyari && (
        <div className="katman-zemin fixed inset-0 z-[70] grid place-items-center bg-black/45 px-7">
          <div
            role="alertdialog"
            aria-labelledby="kontrol-uyari-baslik"
            className="pencere-girisi golge-kart w-full max-w-[300px] rounded-3xl bg-card px-5.5 py-6 text-center"
          >
            <span
              aria-hidden
              className="mx-auto grid size-14 place-items-center rounded-[19px] bg-warning-soft text-[27px] leading-none"
            >
              ⚠️
            </span>
            <p
              id="kontrol-uyari-baslik"
              className="mt-4 font-display text-[20px] leading-tight font-extrabold tracking-tight"
            >
              Kartı atlıyorsun
            </p>
            <p className="mt-2.5 text-[14px] leading-relaxed font-semibold text-foreground/75 text-pretty">
              Bu soruyu bilemedin. Kartı tekrar okumadan devam edersen sonraki konular eksik
              oturabilir.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <Buton
                onClick={onTekrarOku}
                className="h-13 w-full text-[15px] text-white"
                style={{ background: bicim.murekkep }}
              >
                Kartı tekrar oku
              </Buton>
              <Buton bicim="hayalet" onClick={onDevam} className="h-12 w-full text-[14px]">
                Yine de devam et
              </Buton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
