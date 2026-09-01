'use client'

/**
 * Yeni başarım bildirimi — yukarıdan inen bir şerit, pencere değil.
 *
 * Eskiden kutlama ekranın ortasına bir pencere açıyordu (`RozetKutlama`) ve
 * kapatılmayı bekliyordu. Başarım çoğu zaman bir turun ya da bir günün
 * ortasında geliyor; orada durmak istemeyen kullanıcıyı durduruyordu. Bildirim
 * aynı haberi veriyor ama akışı kesmiyor: iniyor, duruyor, kendiliğinden
 * çekiliyor. Kullanıcı hiçbir şey kapatmıyor.
 *
 * **Kilit açılışın kendisi.** Madalyon gri ve kilitli iniyor; kilit sarsılıp
 * kalkıyor, altından kademe rengi ve rozetin simgesi çıkıyor. Bildirim üç
 * saniye duruyor ve o üç saniyeyi dolduracak bir şey gerekiyordu — ödülü bir
 * yazıyla duyurmak yerine olurken göstermek. Tasarım kaynağı:
 * `tasarim/basarim-bildirim.html`.
 *
 * **Ekranda hep tek bildirim var.** Aynı anda birden fazla rozet gelebiliyor
 * (`bildirilecekler` bunu tür başına bire indiriyor ama iki ayrı tür yine
 * birlikte gelebilir); üst üste inen iki şerit ikisini de okunmaz yapardı.
 * Kuyruğun sahibi `AppShell`, bu bileşen tek bir rozet çiziyor.
 */

import { useCallback, useEffect } from 'react'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'
import { KADEME_SIRASI, type Rozet } from '@/lib/rozetler'
import { KADEME_SINIFI } from '@/components/rozet-renk'
import { cn } from '@/lib/utils'

/**
 * Bildirimin ekranda kaldığı toplam süre.
 *
 * `app/globals.css`'teki gecikmelerle **eşleşmeli**: iniş 520 ms, kilidin
 * açılışı 1940 ms'de bitiyor, çıkış 4400 ms'de başlayıp 420 ms sürüyor. Sayı
 * küçültülürse bildirim çıkış animasyonu bitmeden sökülür ve yerinde silinmiş
 * gibi görünür; büyütülürse çekildikten sonra boş bir katman ekranda kalır.
 */
export const BILDIRIM_SURESI = 4820

export function RozetBildirimi({ rozet, onBitti }: { rozet: Rozet | null; onBitti: () => void }) {
  const kapat = useCallback(() => onBitti(), [onBitti])

  useEffect(() => {
    if (rozet === null) return

    if (Capacitor.isNativePlatform()) {
      // Titreşimin şiddeti kademeye bağlı: efsane bir başarım bronzla aynı
      // hissettirmesin. Başarısız olursa sessizce geçiliyor — bazı cihazlarda
      // titreşim motoru kapalı.
      const siddet =
        KADEME_SIRASI[rozet.kademe] >= KADEME_SIRASI.altin ? ImpactStyle.Heavy : ImpactStyle.Medium
      void Haptics.impact({ style: siddet }).catch(() => {})
    }

    const zamanlayici = setTimeout(kapat, BILDIRIM_SURESI)
    return () => clearTimeout(zamanlayici)
  }, [rozet, kapat])

  if (rozet === null) return null

  const kademe = KADEME_SINIFI[rozet.kademe]

  return (
    /*
      Katman dokunuşu geçiriyor (`pointer-events-none`), yalnızca şeridin
      kendisi almıyor: bildirim ekranın üstünde dururken altındaki sayfa
      kullanılabilir kalmalı — kesmeyen bir bildirimin tek şartı bu.
    */
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-[calc(0.5rem+var(--guvenli-ust))]"
      role="status"
      aria-live="polite"
    >
      {/*
        `key`: iki bildirim arka arkaya gelince React aynı düğümü yeniden
        kullanır ve animasyon hiç baştan başlamazdı — ikinci rozet yerinde
        beliriyormuş gibi görünürdü.
      */}
      <button
        key={rozet.id}
        type="button"
        onClick={kapat}
        className={cn(
          'rozet-bildirimi golge-kart pointer-events-auto flex w-full items-center gap-3',
          'rounded-[26px] border border-border bg-card py-3 pr-4 pl-3 text-left',
          'active:scale-[0.99]',
        )}
      >
        <span className="rozet-madalyon relative grid size-[54px] shrink-0 place-items-center rounded-full border-2 border-border bg-muted">
          {/*
            Kademe rengi ayrı bir katman: gri zeminden renkli zemine geçiş bir
            keyframe içinde yazılsaydı renkler tema değişkenlerinden değil
            CSS'ten gelirdi ve `rozet-renk.ts` ile ikiye ayrılırdı.
          */}
          <span
            className={cn(
              'rozet-yuz absolute inset-[-2px] rounded-full border-2',
              kademe.kenar,
              kademe.zemin,
            )}
            aria-hidden
          />
          <span
            className={cn('rozet-hale absolute inset-[-2px] rounded-full border-2', kademe.kenar)}
            aria-hidden
          />
          <span className="rozet-ikon relative text-[25px] leading-none" aria-hidden>
            {rozet.ikon}
          </span>
          {/*
            Kilit madalyonun **üstünde** duruyor, simgenin yerinde değil:
            simgenin yerini alan bir kilit, açıldığında simgenin oradan
            çıktığını göstermez.
          */}
          <svg
            className="rozet-kilit absolute size-[25px] text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.1}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {/* Halka gövdeden ayrı bir yol: açılırken yalnızca o kalkıyor. */}
            <path className="rozet-halka" d="M8.5 10.5V7.2a3.5 3.5 0 0 1 7 0v3.3" />
            <rect x="5" y="10.5" width="14" height="9.5" rx="3" />
          </svg>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[10.5px] font-extrabold tracking-[0.09em] text-muted-foreground uppercase">
            Yeni başarım
          </span>
          <span className="block text-[15px] font-extrabold tracking-tight">{rozet.ad}</span>
          <span className="block text-[12px] leading-snug font-semibold text-muted-foreground">
            {rozet.aciklama}
          </span>
        </span>
      </button>
    </div>
  )
}
