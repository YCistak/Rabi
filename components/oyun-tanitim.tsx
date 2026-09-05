'use client'

import { useEffect, useState } from 'react'
import type { OyunTanimi } from '@/lib/oyunlar/tanim'
import type { OyunModu } from '@/lib/oyunlar/mod'
import { useGeriKatmani } from '@/lib/geri'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { ModSecimi } from '@/components/mod-secimi'
import { GeriSayim } from '@/components/oyun-geri-sayim'
import { useGenelTest } from '@/components/genel-test-baglami'

/**
 * Oyun tanıtım penceresi.
 *
 * Oyun her açıldığında çıkar ve turu **o başlatır**: kurallar okunmadan sayaç
 * işlemeye başlasaydı ilk beş saniye boşa giderdi. Oynarken üstteki "?" ile
 * yeniden açılabiliyor; o durumda tur zaten duruyor, düğme "Kapat" olur.
 *
 * "Başla" turu **hemen** başlatmıyor: pencerenin yerini 3 · 2 · 1 geri sayımı
 * alıyor ve tur sayım bitince açılıyor (`onBasla`). Pencere o sırada
 * gizleniyor ama bileşen ayakta kalıyor — sayımı ayrı bir katmana taşımak,
 * onu 18 oyun dosyasına da eklemek demekti.
 *
 * **Genel testte pencere hiç açılmıyor**, tur kendiliğinden başlıyor. Test
 * bankadaki oyunları arka arkaya oynatıyor (`lib/oyunlar/genel-test.ts`) ve
 * her oyunun başında bir kurallar penceresi ile bir geri sayım, tek bir testi
 * yarım düzine ayrı ekrana bölerdi. Kurallar kaybolmuyor: turun içindeki "?"
 * aynı pencereyi açıyor.
 */
export function OyunTanitim({
  oyun,
  acik,
  rekor,
  baslatir,
  mod,
  setMod,
  ekstra,
  onBasla,
  onKapat,
}: {
  oyun: OyunTanimi
  acik: boolean
  /** Bu oyundaki en iyi puan; 0 ise hiç oynanmamış. */
  rekor: number
  /** Düğme turu başlatıyor mu, yoksa yalnızca pencereyi mi kapatıyor. */
  baslatir: boolean
  /** Seçili tur modu — bütün oyunlarda ortak. */
  mod: OyunModu
  /**
   * Mod seçimi. `null` verilirse seçim hiç çıkmıyor: Oyun Bankası turu modu
   * dinlemiyor (`lib/oyunlar/mod.ts`), orada seçim sunmak yalan olurdu.
   */
  setMod: ((mod: OyunModu) => void) | null
  /**
   * Oyuna özgü başlangıç seçimi (Zihinden İşlem'de işlem türleri). Tur devam
   * ederken "?" ile açılan pencerede verilmez — ayar tur ortasında değişmemeli.
   */
  ekstra?: React.ReactNode
  onBasla: () => void
  onKapat: () => void
}) {
  const [sayiliyor, setSayiliyor] = useState(false)
  const genelTest = useGenelTest()

  useGeriKatmani(acik, onKapat)

  /*
    Genel testte tur kendiliğinden başlıyor.

    Etki ikinci kez işlemiyor: `onBasla` turu başlatınca oyunun aşaması
    değişiyor ve pencere `acik` olmaktan çıkıyor. Turun içinden "?" ile açılan
    pencere `baslatir` olmadığı için buraya hiç uğramıyor.
  */
  useEffect(() => {
    if (!genelTest || !acik || !baslatir) return
    onBasla()
  }, [genelTest, acik, baslatir, onBasla])

  if (!acik) return null
  if (genelTest && baslatir) return null

  // Sayım sürerken pencere yok: kurallar okundu, sıra hazırlanmada.
  if (sayiliyor) return <GeriSayim onBitti={onBasla} />

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/55 px-4 pt-[calc(1rem+var(--guvenli-ust))] pb-[calc(1rem+var(--guvenli-alt))]">
      <div className="my-auto w-full max-w-sm rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <Rabi durum="calisiyor" boyut={64} />
          <div className="min-w-0">
            <p className="font-display text-xl font-semibold tracking-tight">{oyun.ad}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{oyun.kisaAciklama}</p>
          </div>
        </div>

        {/* Kural paragrafı (`oyun.ozet`) buradan kalktı: pencerenin işi tur
            başlatmak ve mod/zorluk seçtirmek, kuralı oyunun kendisi öğretiyor.
            Özet duruyor — tur sonu ekranı hâlâ kullanıyor. */}

        {/* Mod seçimi yalnızca turu başlatan pencerede: "?" ile açılan
            pencerede tur zaten sürüyor ve kural tur ortasında değişmemeli. */}
        {baslatir && setMod !== null && (
          <div className="mt-4 border-t border-border pt-4">
            <ModSecimi secili={mod} onSec={setMod} />
          </div>
        )}

        {ekstra && <div className="mt-4 border-t border-border pt-4">{ekstra}</div>}

        {rekor > 0 && (
          <p className="mt-4 rounded-xl bg-muted/70 px-3 py-2.5 text-sm text-muted-foreground">
            Şu anki rekorun <strong className="rakam text-foreground">{rekor}</strong> doğru.
            Geçebilir misin?
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <Buton bicim="ikincil" className="flex-1" onClick={onKapat}>
            {baslatir ? 'Vazgeç' : 'Kapat'}
          </Buton>
          {baslatir && (
            <Buton className="flex-1" onClick={() => setSayiliyor(true)}>
              Başla
            </Buton>
          )}
        </div>
      </div>
    </div>
  )
}
