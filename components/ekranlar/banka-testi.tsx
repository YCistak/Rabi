'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import type { BankaKaydi } from '@/lib/oyunlar/banka'
import { testHazirla, type TestSorusu } from '@/lib/oyunlar/banka-testi'
import { oyunSesiCal } from '@/lib/oyunlar/oyun-sesi'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

/**
 * Genel test ekranı.
 *
 * Bankadaki bütün yanlışlar tek turda, karışık ve **aynı biçimde** soruluyor:
 * soru metni + şıklar. Oyunların kendi ekranlarının buraya taşınması mümkün
 * değil (on sekiz ayrı düzen); soruları ortak bir biçimde sormak, "bankadan
 * çıkış" ölçüsünü de tek bir yerde toplamak demek.
 *
 * Kazanç ve kayıp eşit değil: doğru bilinen kayıt bankadan **düşüyor**, yanlış
 * bilinen olduğu gibi kalıyor — sayacı artmıyor, ikinci kez eklenmiyor. Test
 * yeni bir hata üretmiyor, hâlâ öğrenilmemiş olanı gösteriyor.
 */

/** Cevaptan sonra doğrunun ekranda kaldığı süre (ms). */
const GERI_BILDIRIM = 900

export function BankaTestiEkrani({
  banka,
  sesAcik,
  onBitti,
}: {
  banka: BankaKaydi[]
  sesAcik: boolean
  /** Test kapanıyor: doğru bilinen kayıtlar bankadan düşürülüyor. */
  onBitti: (dogruIdler: string[]) => void
}) {
  /*
    Sorular bir kez kuruluyor.

    Banka test sürerken değişmiyor (cevaplar sonda işleniyor) ama şıklar
    rastgele: her çizimde yeniden kurulsaydı geri bildirim sırasında şıkların
    yeri değişir, kullanıcı doğruyu başka bir satırda görürdü.
  */
  const sorular = useMemo(() => testHazirla(banka), [banka])

  const [sira, setSira] = useState(0)
  const [secilen, setSecilen] = useState<string | null>(null)
  const [dogruSayisi, setDogruSayisi] = useState(0)
  const [bitti, setBitti] = useState(sorular.length === 0)
  /** Doğru bilinen kayıtların kimlikleri — çizime girmiyor, ref yetiyor. */
  const dogrularRef = useRef<string[]>([])

  const soru: TestSorusu | undefined = sorular[sira]

  // Geri tuşu testi kapatıyor; katman olmasaydı banka ekranının kendisi
  // kapanır, o ana kadar kazanılan doğrular da işlenmezdi.
  useGeriKatmani(true, () => onBitti(dogrularRef.current))

  // İlerleme geri bildirimin sonunda: cevap verilir verilmez soru değişseydi
  // kullanıcı doğrusunu hiç görmezdi.
  useEffect(() => {
    if (secilen === null) return
    const zaman = setTimeout(() => {
      setSecilen(null)
      setSira((o) => {
        if (o + 1 >= sorular.length) {
          setBitti(true)
          return o
        }
        return o + 1
      })
    }, GERI_BILDIRIM)
    return () => clearTimeout(zaman)
  }, [secilen, sorular.length])

  const cevapla = (sik: string) => {
    if (secilen !== null || soru === undefined) return
    const dogruMu = sik === soru.dogru
    if (dogruMu) {
      dogrularRef.current = [...dogrularRef.current, soru.id]
      setDogruSayisi((o) => o + 1)
    }
    oyunSesiCal(dogruMu ? 'dogru' : 'yanlis', sesAcik)
    setSecilen(sik)
  }

  if (bitti || soru === undefined) {
    return (
      <Sonuc
        toplam={sorular.length}
        dogru={dogruSayisi}
        onKapat={() => onBitti(dogrularRef.current)}
      />
    )
  }

  return (
    <div className="flex min-h-[70vh] flex-col">
      <header className="mb-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary-parlak transition-[width] duration-300"
            style={{ width: `${((sira + (secilen === null ? 0 : 1)) / sorular.length) * 100}%` }}
          />
        </div>
        <span className="rakam text-[12px] font-extrabold text-muted-foreground">
          {sira + 1}/{sorular.length}
        </span>
        <button
          type="button"
          onClick={() => onBitti(dogrularRef.current)}
          aria-label="Testi bitir"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <X size={16} strokeWidth={3} aria-hidden />
        </button>
      </header>

      {/* Soru Rabi'nin balonunda: kurulumdaki kuralın aynısı, soru ekranın
          başlığı değil sorulan şey. */}
      <div className="flex items-start gap-2.5">
        <Rabi durum="calisiyor" boyut={64} />
        <div className="golge-kart min-w-0 flex-1 rounded-2xl rounded-tl-md bg-card p-3.5">
          <p className="font-display text-[17px] font-extrabold leading-snug">{soru.metin}</p>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {soru.siklar.map((sik) => {
          const secili = secilen === sik
          const dogruSik = secilen !== null && sik === soru.dogru
          return (
            <button
              key={sik}
              type="button"
              onClick={() => cevapla(sik)}
              disabled={secilen !== null}
              className={cn(
                'golge-kart w-full rounded-2xl border-2 p-3.5 text-left text-[15px] font-bold transition active:brightness-95',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                dogruSik
                  ? 'border-success bg-success-soft text-success'
                  : secili
                    ? 'border-danger bg-danger-soft text-danger'
                    : 'border-transparent bg-card',
              )}
            >
              {sik}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Sonuc({
  toplam,
  dogru,
  onKapat,
}: {
  toplam: number
  dogru: number
  onKapat: () => void
}) {
  if (toplam === 0) {
    return (
      <div className="py-10 text-center">
        <Rabi durum="calisiyor" boyut={72} />
        <h2 className="mt-3 font-display text-[19px] font-extrabold">Test kurulamadı</h2>
        <p className="mx-auto mt-1.5 max-w-[280px] text-[13.5px] font-medium leading-relaxed text-muted-foreground">
          Şık kurmak için en az iki farklı cevap gerekiyor. Birkaç soru daha
          birikince genel test açılıyor.
        </p>
        <Buton className="mt-5 w-full bg-ikincil text-white" onClick={onKapat}>
          Bankaya dön
        </Buton>
      </div>
    )
  }

  return (
    <div className="py-8 text-center">
      <Rabi durum={dogru > 0 ? 'mutlu' : 'uzgun'} boyut={80} />
      <h2 className="mt-3 font-display text-[21px] font-extrabold">Test bitti</h2>
      <p className="mt-1.5 text-[13.5px] font-medium text-muted-foreground">
        {toplam} sorunun{' '}
        <b className="rakam font-extrabold text-foreground">{dogru}</b> tanesini doğru bildin.
      </p>

      {/* Düşen sayısı doğru sayısına eşit: testte doğru bilinen kayıt bankadan
          çıkıyor. Ayrı bir sayı yazmak aynı şeyi iki kez söylemek olurdu. */}
      <div className="golge-kart mx-auto mt-5 flex max-w-[300px] items-center gap-2.5 rounded-2xl bg-card p-3.5 text-left">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-success-soft text-success">
          <Check size={18} strokeWidth={3} aria-hidden />
        </span>
        <p className="text-[13px] font-semibold leading-relaxed">
          {dogru === 0
            ? 'Bankadan düşen olmadı — sorular yerinde duruyor.'
            : `${dogru} soru bankadan düştü. Yanlışlar olduğu gibi kaldı.`}
        </p>
      </div>

      <Buton className="mt-5 w-full bg-ikincil text-white" onClick={onKapat}>
        Bankaya dön
      </Buton>
    </div>
  )
}
