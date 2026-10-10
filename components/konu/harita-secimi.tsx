'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { dersBul, sinifDersleri, HARITA_SINIFLARI, type HaritaSinifi, type KonuDersId } from '@/lib/konu'
import type { KonuIlerlemeleri } from '@/lib/konu/ilerleme'
import { haritaTemasi } from '@/lib/konu/harita-temasi'
import {
  haritaDersAdi,
  pencereBilgisi,
  sinifOrtalamasi,
  sinifPasifMi,
  sinifYuzdesi,
} from '@/lib/konu/sinif-sekmesi'
import { useGeriKatmani } from '@/lib/geri'
import { useAsagiKaydirKapat } from '@/lib/asagi-kaydir'
import { OlcekliEmoji } from '@/components/olcekli-emoji'
import { cn } from '@/lib/utils'

/*
  Haritanın sınıf ve ders seçimi — tasarım "Tek başlık + alt sayfa".

  Önceden ekranın üstünde iki ayrı parça vardı: "Değiştir"le açılan, yana
  taşan ders çipleri ve altında her zaman görünen sınıf sekmesi. Dersler
  sığmıyor, son çipler fark edilmiyordu; iki parça iki ayrı dilde
  konuşuyordu ve patikayı aşağı itiyordu. Şimdi üstte tek bir kart duruyor
  ("10. sınıf · Kimya"), basınca alttan açılan pencerede önce sınıf, sonra o
  sınıfın bütün dersleri kaydırmasız seçiliyor. Sınıfa basmak pencereyi
  kapatmıyor, yalnız listeyi değiştiriyor: seçim derse basınca biter.
*/

type Secim = { ders: KonuDersId; sinif: HaritaSinifi }

/** Seçilen ders kapanmadan önce vurgulu görünür (ms); kullanıcı neyi seçtiğini görsün. */
const VURGU_SURESI = 300
/** Kapanış animasyonunun süresi (ms); `.alt-pencere-cikisi` ile aynı olmalı. */
const KAPANIS_SURESI = 200

/** Patikanın üstündeki seçim kartı; basınca pencere açılır. */
export function SecimKarti({
  secim,
  ilerlemeler,
  acik,
  onAc,
}: {
  secim: Secim
  ilerlemeler: KonuIlerlemeleri
  acik: boolean
  onAc: () => void
}) {
  const ders = dersBul(secim.ders)
  const bicim = haritaTemasi(secim.ders)
  const dersAdi = haritaDersAdi(secim.ders)
  const yuzde = sinifYuzdesi(secim.ders, secim.sinif, ilerlemeler)
  return (
    <button
      type="button"
      onClick={onAc}
      aria-haspopup="dialog"
      aria-expanded={acik}
      aria-label={`${secim.sinif}. sınıf ${dersAdi}, değiştir`}
      className="golge-kart flex min-h-16 w-full items-center gap-3 rounded-[18px] border-[1.5px] border-border bg-card px-3 py-2.5 text-left transition active:scale-[0.985]"
    >
      <span
        className="grid size-10 shrink-0 place-items-center rounded-xl"
        style={{ background: bicim.zemin }}
        aria-hidden
      >
        <OlcekliEmoji emoji={ders.ikon} boyut={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[16px] font-extrabold tracking-tight">
          {secim.sinif}. sınıf <span className="font-bold text-muted-foreground">·</span> {dersAdi}
        </span>
        {yuzde === null ? (
          <span className="mt-1 block text-[12px] font-bold text-muted-foreground">Kartları hazırlanıyor</span>
        ) : (
          <span className="mt-1.5 flex items-center gap-2">
            <span className="h-1 w-full max-w-[120px] overflow-hidden rounded-full bg-muted" aria-hidden>
              <span className="block h-full rounded-full bg-primary-parlak" style={{ width: `${yuzde}%` }} />
            </span>
            <span className="rakam shrink-0 text-[12px] font-extrabold text-muted-foreground">%{yuzde} tamamlandı</span>
          </span>
        )}
      </span>
      <span
        className="grid size-[34px] shrink-0 place-items-center rounded-full bg-primary-soft text-primary"
        aria-hidden
      >
        <ChevronDown size={18} strokeWidth={2.6} className={cn('transition-transform', acik && 'rotate-180')} />
      </span>
    </button>
  )
}

/**
 * Alttan açılan seçim penceresi.
 *
 * Bakılan sınıf pencerenin kendi durumu: sınıfa basmak seçimi değiştirmiyor,
 * yalnız altındaki ders listesini. Böylece "9. sınıfta ne var" diye bakıp
 * vazgeçen kullanıcının haritası yerinden oynamıyor.
 */
export function SecimPenceresi({
  secim,
  ilerlemeler,
  onSec,
  onKapat,
}: {
  secim: Secim
  ilerlemeler: KonuIlerlemeleri
  onSec: (secim: Secim) => void
  onKapat: () => void
}) {
  useGeriKatmani(true, onKapat)
  const kaydir = useAsagiKaydirKapat(onKapat)
  const [bakilan, setBakilan] = useState<HaritaSinifi>(secim.sinif)
  const gorunenSiniflar = HARITA_SINIFLARI.filter((s) => !sinifPasifMi(s))
  /** Basılan ders; doluyken pencere vurguyu gösterip kapanmayı bekliyor. */
  const [secilen, setSecilen] = useState<Secim | null>(null)
  const [kapaniyor, setKapaniyor] = useState(false)
  const onSecRef = useRef(onSec)
  onSecRef.current = onSec
  const zamanlayicilar = useRef<number[]>([])
  useEffect(() => {
    const liste = zamanlayicilar.current
    return () => liste.forEach((z) => window.clearTimeout(z))
  }, [])

  /*
    Ders seçilince pencere anında sökülüyordu: kullanıcı neyi seçtiğini
    göremiyordu. Şimdi seçim önce vurgulanıyor, sonra pencere animasyonla
    kapanıyor. Bu sürede pencere dokunuşları yutuyor — ikinci basış ya da
    pencere kalkarken alttaki karta (ghost click) geçen dokunuş seçimi bozmasın.
  */
  const dersSec = (yeni: Secim) => {
    if (secilen) return
    setSecilen(yeni)
    zamanlayicilar.current.push(
      window.setTimeout(() => {
        setKapaniyor(true)
        zamanlayicilar.current.push(window.setTimeout(() => onSecRef.current(yeni), KAPANIS_SURESI))
      }, VURGU_SURESI),
    )
  }
  const dersler = sinifDersleri(bakilan)
  const bilgi = pencereBilgisi(secim, bakilan)

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-end justify-center bg-foreground/35',
        kapaniyor ? 'katman-zemin-cikisi' : 'katman-zemin',
      )}
      onClick={secilen ? undefined : onKapat}
    >
      <div
        ref={kaydir}
        role="dialog"
        aria-modal="true"
        aria-label="Sınıf ve ders seç"
        className={cn(
          'flex max-h-[88dvh] w-full max-w-md flex-col overflow-y-auto rounded-t-[26px] bg-card px-4 pt-2.5 pb-[calc(var(--guvenli-alt)+20px)] shadow-[0_-12px_34px_rgba(90,60,35,0.18)]',
          kapaniyor ? 'alt-pencere-cikisi' : 'alt-pencere-girisi',
          secilen && '[&_button]:pointer-events-none',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onKapat}
          aria-label="Kapat"
          className="mx-auto flex h-6 w-16 shrink-0 items-center justify-center"
        >
          <span className="h-1 w-10 rounded-sm bg-grid" />
        </button>
        <h2 className="mt-1 px-0.5 font-display text-[17px] font-extrabold tracking-tight">Ne çalışacaksın?</h2>

        <p className="mt-3 mb-2 px-1 text-[10.5px] font-black tracking-[0.14em] text-muted-foreground">SINIF</p>
        {/* İçeriği yazılmamış sınıf (şimdilik 12) hiç listelenmiyor; kartları
            yazılınca kendiliğinden görünüyor. "Yakında" rozeti App Store
            incelemesinde yarım özellik gibi durduğu için kaldırıldı. */}
        <div
          role="group"
          aria-label="Sınıf"
          className="grid gap-1 rounded-[18px] bg-muted p-1"
          style={{ gridTemplateColumns: `repeat(${gorunenSiniflar.length}, minmax(0, 1fr))` }}
        >
          {gorunenSiniflar.map((sinif) => {
            const secili = sinif === bakilan
            const ortalama = sinifOrtalamasi(sinif, ilerlemeler)
            return (
              <button
                key={sinif}
                type="button"
                onClick={() => setBakilan(sinif)}
                aria-pressed={secili}
                aria-label={`${sinif}. sınıf, yüzde ${ortalama ?? 0}`}
                className={cn(
                  'flex min-h-[52px] flex-col items-center justify-center rounded-[14px] transition',
                  secili
                    ? 'bg-primary-parlak text-white shadow-[0_2px_8px_rgba(217,98,47,0.3)]'
                    : 'text-foreground active:bg-card/60',
                )}
              >
                <span className="rakam font-display text-[16px] leading-tight font-extrabold">{sinif}.</span>
                <span
                  className={cn(
                    'rakam mt-0.5 text-[11px] leading-[15px] font-bold',
                    secili ? 'text-white/90' : 'text-muted-foreground',
                  )}
                >
                  %{ortalama ?? 0}
                </span>
              </button>
            )
          })}
        </div>

        {bilgi && (
          <p role="status" className="mt-2 px-1 text-[12.5px] font-bold text-muted-foreground">
            {bilgi}
          </p>
        )}

        <p className="mt-4 mb-2 px-1 text-[10.5px] font-black tracking-[0.14em] text-muted-foreground">
          {bakilan}. SINIF DERSLERİ
        </p>
        {/* Dersler havada durmasın: gri bir grup, her ders kendi beyaz satırında. */}
        <ul className="grid gap-1.5 rounded-[18px] bg-muted p-1.5">
          {dersler.map((d) => {
            const gecerli = secilen ?? secim
            const secili = bakilan === gecerli.sinif && d.id === gecerli.ders
            const yuzde = sinifYuzdesi(d.id, bakilan, ilerlemeler) ?? 0
            const db = haritaTemasi(d.id)
            const ad = haritaDersAdi(d.id)
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => dersSec({ ders: d.id, sinif: bakilan })}
                  aria-pressed={secili}
                  aria-label={`${ad}, yüzde ${yuzde}`}
                  className={cn(
                    'flex min-h-14 w-full items-center gap-3 rounded-[13px] border-[1.5px] px-2.5 py-2 text-left transition',
                    secili
                      ? 'border-primary-parlak bg-primary-soft shadow-[0_2px_10px_rgba(217,98,47,0.15)]'
                      : 'border-transparent bg-card shadow-[0_1px_3px_rgba(90,60,35,0.06)] active:brightness-[0.98]',
                  )}
                >
                  <span
                    className="grid size-[30px] shrink-0 place-items-center rounded-lg"
                    style={{ background: db.zemin }}
                    aria-hidden
                  >
                    <OlcekliEmoji emoji={d.ikon} boyut={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block truncate text-[15px] font-extrabold',
                        secili && 'text-primary',
                      )}
                    >
                      {ad}
                    </span>
                    <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
                      <span className="block h-full rounded-full" style={{ width: `${yuzde}%`, background: db.murekkep }} />
                    </span>
                  </span>
                  <span
                    className={cn(
                      'rakam w-9 shrink-0 text-right text-[12.5px] font-extrabold',
                      secili ? 'text-primary' : 'text-muted-foreground',
                    )}
                  >
                    %{yuzde}
                  </span>
                  <Check
                    size={20}
                    strokeWidth={2.6}
                    aria-hidden
                    className={cn('shrink-0 text-primary', !secili && 'invisible')}
                  />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

