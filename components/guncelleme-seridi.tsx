'use client'

import { Download, RefreshCw, X } from 'lucide-react'
import { Rabi } from '@/components/maskot/rabi'
import { cn } from '@/lib/utils'
import type { GuncellemeKolu } from '@/lib/guncelleme-kolu'

/**
 * "Yeni sürüm hazır" şeridi — ekranın üstünde, `RozetBildirimi` ile aynı yer
 * ve aynı dil; farkı **kendiliğinden çekilmemesi**. Rozet üç saniyelik bir
 * haber, bu ise cevap bekleyen bir soru: Güncelle ya da kapat.
 *
 * Pencere değil şerit: kullanıcı uygulamayı bir iş için açtı, güncelleme o
 * işin önüne geçmemeli. Katman dokunuşu geçiriyor, altındaki sayfa
 * kullanılabilir kalıyor — kesmeyen bir bildirimin tek şartı bu.
 *
 * Üç hâli var ve üçü aynı satırda: **hazır** (Güncelle), **indiriliyor**
 * (düğme pasif, dönen simge), **indirildi** (Yeniden başlat). Kurulum
 * başladığında da çiziliyor ama düğme pasif — uygulama kapanmak üzere ve
 * ikinci bir dokunuş ikinci bir kurulum isteği olurdu.
 *
 * Çarpı yalnızca hazır hâlde: inen bir paketi kurmanın tek yolu bu şerit ve
 * onu kapatan kullanıcı paketin telefonunda beklediğini bir daha öğrenemezdi.
 */
export function GuncellemeSeridi({ kol }: { kol: GuncellemeKolu }) {
  const { hal } = kol
  if (hal === 'yok' || hal === 'kapali') return null

  const indirildi = hal === 'indirildi' || hal === 'kuruluyor'
  const mesgul = hal === 'indiriliyor' || hal === 'kuruluyor'

  const baslik = indirildi ? 'Yeni sürüm indirildi' : 'Rabi’nin yeni sürümü var'
  const alt =
    hal === 'indiriliyor'
      ? 'İndiriliyor, kullanmaya devam edebilirsin.'
      : hal === 'kuruluyor'
        ? 'Kuruluyor…'
        : indirildi
          ? 'Yeniden başlatınca hazır.'
          : 'Play’de yeni bir sürüm var.'

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-[calc(0.5rem+var(--guvenli-ust))]"
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          'acilir-giris golge-kart pointer-events-auto flex w-full items-center gap-3',
          'rounded-[26px] border border-border bg-card py-2.5 pr-2.5 pl-3',
        )}
      >
        <Rabi durum="normal" poz="kafa" boyut={40} />

        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[14.5px] font-extrabold leading-tight tracking-tight">
            {baslik}
          </span>
          <span className="mt-0.5 block truncate text-[12px] font-semibold text-muted-foreground">
            {alt}
          </span>
        </span>

        <button
          type="button"
          disabled={mesgul}
          onClick={indirildi ? kol.onYenidenBaslat : kol.onGuncelle}
          className={cn(
            'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-primary-parlak px-3.5',
            'text-[13px] font-extrabold text-white transition active:brightness-95',
            'disabled:opacity-60',
          )}
        >
          {indirildi ? (
            <RefreshCw size={15} aria-hidden />
          ) : (
            <Download size={15} className={cn(mesgul && 'animate-bounce')} aria-hidden />
          )}
          {indirildi ? 'Yeniden başlat' : mesgul ? 'İniyor' : 'Güncelle'}
        </button>

        {hal === 'hazir' && (
          <button
            type="button"
            onClick={kol.onKapat}
            aria-label="Kapat"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground active:bg-foreground/[0.06]"
          >
            <X size={17} aria-hidden />
          </button>
        )}
      </div>
    </div>
  )
}
