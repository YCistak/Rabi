'use client'

import { useEffect, useState } from 'react'
import { geriSayimSesi } from '@/lib/oyunlar/oyun-sesi'

/**
 * Tur başlamadan önceki 3 · 2 · 1 · Başla.
 *
 * Sebebi tanıtım penceresiyle aynı değil: pencere kuralları okutuyor, bu
 * katman **hazırlanma anı**nı veriyor. Düğmeye basar basmaz ilk soru geliyordu
 * ve süreli modlarda ilk saniye parmağını ekrana götürmekle geçiyordu.
 *
 * Katman iki yerde çıkıyor ve ikisi de ortak bileşen: tanıtımdaki "Başla" ve
 * tur sonundaki "Tekrar" (`oyun-tanitim.tsx`, `oyun-kabuk.tsx`). 18 oyun
 * dosyasının hiçbiri geri sayımdan haberdar değil — tur, sayım bitince
 * başlıyor, yani `onBitti` çağrıldığı an.
 *
 * Sesler `oyun-sesi.ts`'te: üç alçak tik ve sonda açılan bir akor. Ses
 * kapalıysa sayım sessiz akıyor, görüntü değişmiyor.
 */

/** Bir rakamın ekranda kalma süresi (ms). CSS'teki `geri-sayim-rakam` ile eşleşmeli. */
const ADIM = 620

/** "Başla" yazısının süresi — rakamlardan kısa: orada beklenen bir şey yok. */
const BASLANGIC = 480

/** Sayımın adımları: üçten geriye, sonda söz. */
const ADIMLAR = ['3', '2', '1', 'Başla!'] as const

export function GeriSayim({ onBitti }: { onBitti: () => void }) {
  const [sira, setSira] = useState(0)

  useEffect(() => {
    // Ses her adımda burada çalıyor, çizim tarafında değil: React katı kipte
    // gövdeyi iki kez çağırabiliyor ve tik iki kez duyulurdu.
    geriSayimSesi(ADIMLAR.length - 1 - sira)

    const sonMu = sira === ADIMLAR.length - 1
    const zamanlayici = setTimeout(
      () => {
        if (sonMu) onBitti()
        else setSira((s) => s + 1)
      },
      sonMu ? BASLANGIC : ADIM,
    )
    return () => clearTimeout(zamanlayici)
  }, [sira, onBitti])

  const yazi = ADIMLAR[sira]
  const sonMu = sira === ADIMLAR.length - 1

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-6"
      // Ekran okuyucuya tek tek rakam okutmak yerine ne olduğunu bir kez
      // söylüyor: sayım görsel bir hazırlık, taşıdığı bilgi "tur başlıyor".
      role="status"
      aria-label="Tur başlıyor"
    >
      <span
        // Anahtar her adımda değişiyor: aynı öğe kalsaydı animasyon yalnızca
        // ilk rakamda oynardı.
        key={sira}
        aria-hidden
        className={
          sonMu
            ? 'geri-sayim-basla font-display text-[54px] leading-none font-extrabold text-white'
            : 'geri-sayim-rakam rakam font-display text-[92px] leading-none font-extrabold text-white'
        }
      >
        {yazi}
      </span>
    </div>
  )
}
