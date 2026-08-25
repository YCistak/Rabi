'use client'

import { useMemo } from 'react'
import { CalendarDays } from 'lucide-react'
import { geriSayim, sinavTarihiYaz } from '@/lib/sinav-tarihi'
import { sinavSozu } from '@/lib/sinav-sozleri'
import { cn } from '@/lib/utils'

/**
 * Ana sayfanın üstündeki YKS geri sayımı.
 *
 * Renk kalan güne göre koyulaşıyor: uzaktayken sakin mavi, son ayda mercan,
 * son haftada kartın tamamı mercan. Sayının yanında yazan "42 gün" ile "son
 * hafta" arasındaki farkı kullanıcı okumadan görsün diye — geri sayımın işi
 * zaten aciliyeti hissettirmek.
 *
 * `tarih` dışarıdan geliyor (ana sayfa `bugun()`'ü zaten hesaplıyor); bileşen
 * kendi saatini okusaydı gece yarısı ekranın yarısı eski tarihte kalırdı.
 */
export function GeriSayim({
  tarih,
  className,
  children,
}: {
  tarih: string
  className?: string
  /**
   * Kartın en altına, zeminden ayrışan bir iç kutuya giren içerik — ana sayfa
   * buraya hedef özetini koyuyor. Geri sayımla hedef aynı soruya bakıyor
   * ("ne kadar kaldı"), ayrı kartlarda dururken aralarındaki bağ kayboluyordu.
   */
  children?: React.ReactNode
}) {
  const sayim = useMemo(() => geriSayim(tarih), [tarih])
  const soz = useMemo(
    () => sinavSozu(sayim.kalanGun, sayim.oturum, tarih),
    [sayim.kalanGun, sayim.oturum, tarih],
  )

  const oturumAdi = sayim.oturum === 'tyt' ? 'TYT' : 'AYT'
  const sinavGunu = sayim.kalanGun === 0
  // Son hafta kartın tamamı mercan; öncesinde yalnızca vurgular renk değiştiriyor.
  const doluKart = sayim.kalanGun <= 7
  const acil = sayim.kalanGun <= 30

  const yuzde =
    sayim.toplamGun > 0 ? Math.round((sayim.gecenGun / sayim.toplamGun) * 100) : 0

  return (
    <section
      aria-label={`${sayim.takvim.yil} YKS geri sayımı`}
      className={cn(
        'golge-kart overflow-hidden rounded-2xl p-4',
        doluKart ? 'bg-ikincil text-white' : 'bg-card text-card-foreground',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex items-center gap-1.5 text-xs font-bold',
            doluKart ? 'text-white/85' : 'text-muted-foreground',
          )}
        >
          <CalendarDays size={14} aria-hidden />
          {sayim.takvim.yil} YKS · {oturumAdi}
        </span>

        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold',
            doluKart
              ? 'bg-white/20 text-white'
              : acil
                ? 'bg-ikincil-soft text-ikincil'
                : 'bg-primary-soft text-primary',
          )}
        >
          {soz.baslik}
        </span>
      </div>

      {/* Sayının kendisi. Sınav günü sayı yerine "Bugün" yazıyor: "0 gün kaldı"
          hem tuhaf okunuyor hem de o sabah söylenecek şey bu değil. */}
      {/* Sayı, "gün kaldı" ve tarih tek satırda. Tarih ayrı satırdayken kartın
          yarısını üç satırlık bir bilgi bloğu kaplıyordu; asıl okunacak şey
          büyük sayı, gerisi onun eki. */}
      <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
        {sinavGunu ? (
          <span className="font-display text-[40px] leading-none font-extrabold">Bugün!</span>
        ) : (
          <>
            <span
              className={cn(
                'rakam font-display text-[44px] leading-none font-extrabold',
                doluKart ? 'text-white' : acil ? 'text-ikincil' : 'text-primary',
              )}
            >
              {sayim.kalanGun}
            </span>
            {/* Nokta ayracı "gün kaldı"nın ucunda, tarihin başında değil:
                satır sarınca baştaki nokta alt satırda tek başına kalıyordu. */}
            <span className="font-display text-base font-extrabold">gün kaldı ·</span>
            <span
              className={cn(
                'text-[13px] font-semibold',
                doluKart ? 'text-white/85' : 'text-muted-foreground',
              )}
            >
              {/* Tarih hesaptan geliyorsa "tahmini" yazmak zorunlu: tahmini bir
                  günü kesinmiş gibi göstermiyoruz. */}
              {sinavTarihiYaz(sayim.sinavTarihi)}
              {sayim.tahmini && ' (tahmini)'}
            </span>
          </>
        )}
      </p>

      {/* Hazırlık yılının çubuğu: geri sayım sayısı tek başına "ne kadar yol
          aldım" sorusunu cevaplamıyordu. */}
      {!doluKart && (
        <div className="mt-3">
          <div
            className="h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={yuzde}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Hazırlık yılında geçen süre"
          >
            <div
              className={cn(
                'h-full rounded-full transition-[width] duration-500',
                acil ? 'bg-ikincil' : 'bg-primary',
              )}
              style={{ width: `${Math.max(2, yuzde)}%` }}
            />
          </div>
        </div>
      )}

      {/* Kalan güne uygun söz kaldırıldı: kartta zaten sağ üstte aynı havuzdan
          gelen kısa başlık ("Uzun yol") duruyor ve iki satır aynı şeyi iki kez
          söylüyordu. Havuz `lib/sinav-sozleri.ts`'de, başlık hâlâ oradan. */}

      {children && (
        <div
          className={cn(
            'mt-3 rounded-[18px] p-3',
            doluKart ? 'bg-white/15' : 'bg-background',
          )}
        >
          {children}
        </div>
      )}
    </section>
  )
}
