'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import type { Konu } from '@/lib/konu'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

/**
 * Soru sahnesi — deste okunduktan **hemen sonra** gelen ekran.
 *
 * Kartlar anlatıyor, burası geri istiyor. Akış tek bir cümle: karta dokun,
 * çevrilir, sonra karar ver. Karar iki düğmede — **Yanlış** ve **Doğru** —
 * ve ikisi de cevap görülene kadar pasif: cevabı görmeden basılan "Doğru",
 * bilmeyi değil emin olmayı ölçer.
 *
 * Ekran uygulamanın tek koyu yüzeyi. Gerekçesi `globals.css`teki `.sahne`
 * bloğunda; renkler de orada, burada onaltılık kod yok.
 *
 * **Ekran yalnızca sorusu yazılmış konuda açılıyor.** Soru metinleri henüz
 * hiçbir konuda yok (`lib/konu/icerik/`), o yüzden bugün hiç görünmüyor:
 * harita boş desteyi açmıyor ve deste bitince konu eskisi gibi kapanıyor.
 * Sorular yazıldıkça o konular ekranı kendiliğinden kazanıyor — burada
 * değişmesi gereken bir şey yok.
 */

/** Kartın çevrilme süresi; `globals.css`teki `.soru-ic` geçişiyle eşleşmeli. */
const CEVIRME_SURESI = 460

export type SahneSonucu = {
  dogru: number
  yanlis: number
}

export function SoruSahnesi({
  konu,
  temaAdi,
  dersAdi,
  onKapat,
}: {
  konu: Konu
  temaAdi: string
  dersAdi: string
  onKapat: (sonuc: SahneSonucu) => void
}) {
  const [sira, setSira] = useState(0)
  const [cevrik, setCevrik] = useState(false)
  const [dogru, setDogru] = useState(0)
  const [yanlis, setYanlis] = useState(0)
  const [bitti, setBitti] = useState(false)

  const soru = konu.sorular[sira]
  const toplam = konu.sorular.length

  /** Kart kapanırken sorunun değişmesini bekleten zamanlayıcı. */
  const zamanlayiciRef = useRef<number | undefined>(undefined)
  /*
    Sonuç ref'te de duruyor: geri tuşu katmanı bileşenin ilk çiziminde
    kaydediliyor ve `onKapat`ı çağırdığı anda state'in güncel hâlini görmesi
    gerekiyor.
  */
  const sonucRef = useRef<SahneSonucu>({ dogru: 0, yanlis: 0 })
  sonucRef.current = { dogru, yanlis }
  useGeriKatmani(true, () => onKapat(sonucRef.current))

  function karar(dogruMu: boolean) {
    if (!cevrik) return
    if (dogruMu) setDogru((o) => o + 1)
    else setYanlis((o) => o + 1)

    if (sira >= toplam - 1) {
      setBitti(true)
      return
    }
    /*
      Kart önce **kapanıyor**, soru ondan sonra değişiyor. Metni hemen
      değiştirmek, kart dönerken arkada bir sonraki sorunun cevabını
      göstermek demekti — cevap, sorusu okunmadan ekrana gelirdi.

      Bekleme boyunca düğmeler zaten pasif (`!cevrik`), yani araya ikinci bir
      karar sıkışamıyor.
    */
    setCevrik(false)
    zamanlayiciRef.current = window.setTimeout(() => setSira((o) => o + 1), CEVIRME_SURESI)
  }

  // Uzun bir sorudan sonra gelen kısa soru sayfayı ortasından başlatıyordu.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [sira])

  // Ekran kapanırken bekleyen geçiş de iptal ediliyor: sökülmüş bileşende
  // çalışan bir `setSira`, React'e olmayan bir ekranı güncelletiyor.
  useEffect(() => () => window.clearTimeout(zamanlayiciRef.current), [])

  if (bitti) {
    return (
      <div className="sahne fixed inset-0 z-50 flex flex-col text-[var(--sahne-yazi)]">
        <Sonuc
          konuAdi={konu.ad}
          dogru={dogru}
          yanlis={yanlis}
          onKapat={() => onKapat({ dogru, yanlis })}
        />
      </div>
    )
  }

  return (
    <div className="sahne fixed inset-0 z-50 flex flex-col text-[var(--sahne-yazi)]">
      <header className="shrink-0 px-4 pt-[calc(0.75rem+var(--guvenli-ust))] pb-3">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            type="button"
            onClick={() => onKapat(sonucRef.current)}
            aria-label="Kapat"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 transition active:bg-white/20"
          >
            <X size={19} strokeWidth={2.6} aria-hidden />
          </button>

          <div className="flex flex-1 gap-1.5" aria-hidden>
            {konu.sorular.map((s, i) => (
              <span
                key={s.id}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors duration-200',
                  i <= sira ? 'bg-[var(--sahne-vurgu)]' : 'bg-white/12',
                )}
              />
            ))}
          </div>

          <span className="rakam shrink-0 text-[13px] font-extrabold">
            {sira + 1}/{toplam}
          </span>
        </div>

        <div className="mx-auto mt-3 max-w-md">
          <p className="text-[10.5px] font-extrabold tracking-[0.12em] text-[var(--sahne-soluk)] uppercase">
            {dersAdi} · {temaAdi}
          </p>
          <h2 className="mt-0.5 font-display text-[17px] font-extrabold tracking-tight">
            {konu.ad}
          </h2>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-[calc(1rem+var(--guvenli-alt))]">
        {/* Kart bir düğme: dokunulacak yer kartın kendisi ve altındaki
            "Cevabı görmek için dokun" satırı da onun içinde duruyor. */}
        {/* Kartın boyu sabit ve ekranın ortasında duruyor: içeriğe göre
            uzayıp kısalsaydı kısa soruda küçülür, uzun soruda düğmeleri aşağı
            iterdi — sahnede kartın yeri her soruda aynı olmalı. */}
        <div
          className="mx-auto my-auto h-[min(54vh,420px)] w-full max-w-md"
          style={{ perspective: '1200px' }}
        >
          <button
            type="button"
            onClick={() => setCevrik((o) => !o)}
            aria-label={cevrik ? 'Soruya dön' : 'Cevabı gör'}
            className="relative block h-full w-full text-left"
          >
            <div className={cn('soru-ic relative h-full w-full', cevrik && 'cevrik')}>
              <Yuz
                etiket="Soru"
                metin={soru.soru}
                altYazi="Cevabı görmek için dokun"
                key={`${soru.id}-soru`}
              />
              <Yuz
                arka
                etiket="Cevap"
                metin={soru.cevap}
                altYazi="Soruya dönmek için dokun"
                key={`${soru.id}-cevap`}
              />
            </div>
          </button>
        </div>

        {/* Pasif düğmenin yanında sebebi yazmayan ekran, kullanıcıyı orada
            kilitler — kurulumdaki kuralın aynısı. */}
        <p
          className={cn(
            'mb-2 text-center text-[12px] font-extrabold text-[var(--sahne-soluk)] transition-opacity',
            cevrik && 'opacity-0',
          )}
          aria-hidden={cevrik}
        >
          Karar vermek için önce cevaba bak
        </p>

        <div className="mx-auto flex w-full max-w-md gap-3">
          <Buton
            bicim="ikincil"
            onClick={() => karar(false)}
            disabled={!cevrik}
            className="h-14 flex-1 bg-[var(--sahne-yanlis-zemin)] text-[15px] text-[var(--sahne-yanlis)]"
          >
            <X size={18} strokeWidth={3} aria-hidden /> Yanlış
          </Buton>
          <Buton
            bicim="ikincil"
            onClick={() => karar(true)}
            disabled={!cevrik}
            className="h-14 flex-1 bg-[var(--sahne-dogru-zemin)] text-[15px] text-[var(--sahne-dogru)]"
          >
            <Check size={18} strokeWidth={3} aria-hidden /> Doğru
          </Buton>
        </div>
      </div>
    </div>
  )
}

/**
 * Kartın tek yüzü.
 *
 * İki yüz de aynı ölçüde ve üst üste duruyor: arkadaki yüz kısa olsaydı kart
 * çevrilirken boyu değişir, hareket dönmek yerine büzülmek gibi görünürdü.
 */
function Yuz({
  arka = false,
  etiket,
  metin,
  altYazi,
}: {
  arka?: boolean
  etiket: string
  metin: string
  altYazi: string
}) {
  return (
    <div
      className={cn(
        'soru-yuz golge-kart absolute inset-0 flex flex-col rounded-3xl bg-[var(--sahne-kart)] px-6 py-5 text-foreground',
        arka && 'soru-yuz-arka',
      )}
    >
      <p className="flex items-center gap-2 text-[10.5px] font-extrabold tracking-[0.14em] text-[var(--sahne-vurgu)] uppercase">
        <span className="size-2 rounded-full bg-current" aria-hidden />
        {etiket}
      </p>

      {/* Metin ortada duruyor: soru bir başlık değil, ekrandaki tek iş. */}
      <p className="flex flex-1 items-center justify-center py-4 text-center text-[17px] leading-relaxed font-semibold text-pretty">
        {metin}
      </p>

      <div className="mt-auto border-t border-dashed border-black/15 pt-3.5">
        <span className="flex items-center justify-center gap-2 text-[13.5px] font-extrabold text-[var(--sahne-vurgu)]">
          <RotateCcw size={15} strokeWidth={2.8} aria-hidden />
          {altYazi}
        </span>
      </div>
    </div>
  )
}

/** Sorular bitince: iki sayı ve tek bir çıkış. */
function Sonuc({
  konuAdi,
  dogru,
  yanlis,
  onKapat,
}: {
  konuAdi: string
  dogru: number
  yanlis: number
  onKapat: () => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 pb-[calc(1rem+var(--guvenli-alt))] text-center">
      <Rabi durum={yanlis === 0 ? 'kutlama' : 'normal'} boyut={104} />
      <h3 className="mt-3 font-display text-[22px] font-extrabold tracking-tight text-balance">
        {konuAdi} bitti
      </h3>
      <p className="mt-1.5 text-[14.5px] font-semibold text-[var(--sahne-soluk)] text-pretty">
        {yanlis === 0
          ? 'Bütün sorulara doğru dedin.'
          : `${yanlis} soruyu yanlış işaretledin; konuyu istediğin zaman yeniden okuyabilirsin.`}
      </p>

      <div className="mt-5 flex w-full gap-2.5">
        <Sayi
          deger={dogru}
          etiket="doğru"
          zemin="var(--sahne-dogru-zemin)"
          yazi="var(--sahne-dogru)"
        />
        <Sayi
          deger={yanlis}
          etiket="yanlış"
          zemin="var(--sahne-yanlis-zemin)"
          yazi="var(--sahne-yanlis)"
        />
      </div>

      {/* Zemin markanın dolgu tonunda, yazı beyaz: sahnenin koyu zemininde
          `bg-primary-dolu`nun kendi tonu tuğlaya kaçıyordu. */}
      <Buton onClick={onKapat} className="mt-6 w-full bg-[var(--sahne-vurgu)]">
        Haritaya dön
      </Buton>
    </div>
  )
}

function Sayi({
  deger,
  etiket,
  zemin,
  yazi,
}: {
  deger: number
  etiket: string
  zemin: string
  yazi: string
}) {
  return (
    <div className="flex-1 rounded-2xl px-3 py-3.5" style={{ backgroundColor: zemin, color: yazi }}>
      <p className="font-display text-[26px] leading-none font-extrabold">{deger}</p>
      <p className="mt-1 text-[11px] font-extrabold tracking-[0.08em] uppercase opacity-80">
        {etiket}
      </p>
    </div>
  )
}
