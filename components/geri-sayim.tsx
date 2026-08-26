'use client'

import { useMemo } from 'react'
import { ChevronRight, Target } from 'lucide-react'
import type { Hedef } from '@/lib/types'
import { geriSayim, sinavTarihiYaz } from '@/lib/sinav-tarihi'
import { sinavSozu } from '@/lib/sinav-sozleri'
import { siraYaz } from '@/lib/siralama'
import { universiteKisaAdi } from '@/lib/hedef-katalog'
import { cn } from '@/lib/utils'

/**
 * Ana sayfanın üstündeki YKS geri sayımı.
 *
 * Kart dört parçadan ibaret ve sırası tasarımdan geliyor: yıl/oturum satırı ve
 * yanında kalan süreyi tek kelimeyle adlandıran rozet, dev sayı ve devamındaki
 * tarih, hazırlık yılının çubuğu, en altta hedef paneli. Kalan güne uygun uzun
 * söz bilerek **yok**: rozetteki kelime ("Uzun yol") aynı havuzdan geliyor ve
 * sayfanın altında zaten günün sözü duruyor — iki motivasyon cümlesi tek
 * ekranda birbirini eziyordu.
 *
 * Renk kalan güne göre koyulaşıyor: uzaktayken sakin mor, son ayda fuşya,
 * son haftada kartın tamamı fuşya. Sayının yanında yazan "42 gün" ile "son
 * hafta" arasındaki farkı kullanıcı okumadan görsün diye — geri sayımın işi
 * zaten aciliyeti hissettirmek.
 *
 * `tarih` dışarıdan geliyor (ana sayfa `bugun()`'ü zaten hesaplıyor); bileşen
 * kendi saatini okusaydı gece yarısı ekranın yarısı eski tarihte kalırdı.
 *
 * Hedef de bu kartın içinde, ayrı bir kart değil: "kaç gün kaldı" ile "ne için"
 * aynı sorunun iki yarısı ve tasarımda tek yüzeyde duruyorlar. Hedef eskiden
 * sayfanın en altındaydı, hedefini hiç yazmamış kullanıcı oraya inmediği için
 * özelliği hiç görmüyordu.
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
  // Son hafta kartın tamamı fuşya; öncesinde yalnızca vurgular renk değiştiriyor.
  const doluKart = sayim.kalanGun <= 7
  const acil = sayim.kalanGun <= 30

  const yuzde =
    sayim.toplamGun > 0 ? Math.round((sayim.gecenGun / sayim.toplamGun) * 100) : 0

  return (
    <section
      aria-label={`${sayim.takvim.yil} YKS geri sayımı`}
      className={cn(
        'golge-kart overflow-hidden rounded-[26px] p-4',
        doluKart ? 'bg-ikincil text-white' : 'bg-card text-card-foreground',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'text-[12.5px] font-bold',
            doluKart ? 'text-white/85' : 'text-muted-foreground',
          )}
        >
          {sayim.takvim.yil} YKS · {oturumAdi}
        </span>

        <span
          className={cn(
            'shrink-0 rounded-full px-3 py-1 text-[11px] font-extrabold',
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
            <span className="rakam font-display text-[46px] leading-none font-extrabold tracking-tight">
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
        <div
          className="mt-3.5 h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={yuzde}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Hazırlık yılında geçen süre: %${yuzde}`}
        >
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

/**
 * Geri sayımın içindeki hedef şeridi — kartın içinde ayrı bir yüzey.
 *
 * Kendi kartı değil bir iç panel: hedef, geri sayımın bağlamı. Ayrı kart
 * olsaydı ikisi arasındaki bağ görünmezdi.
 */
function HedefPaneli({
  hedef,
  guncelSiralama,
  doluKart,
  onAc,
}: {
  hedef: Hedef | null
  guncelSiralama: number | null
  /** Kartın tamamı fuşyayken panel de o zeminin üstünde duruyor. */
  doluKart: boolean
  onAc: () => void
}) {
  const uzaklik =
    hedef?.basariSirasi != null && guncelSiralama !== null
      ? guncelSiralama - hedef.basariSirasi
      : null

  return (
    <button
      type="button"
      onClick={onAc}
      className={cn(
        'mt-3.5 flex w-full items-center gap-3 rounded-[18px] px-3 py-2.5 text-left transition',
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
        doluKart ? 'bg-white/15 active:bg-white/20' : 'bg-muted/70 active:brightness-95',
      )}
    >
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-full',
          doluKart ? 'bg-white/20 text-white' : 'bg-primary-soft text-primary',
        )}
        aria-hidden
      >
        <Target size={17} strokeWidth={2.4} />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block text-[10.5px] font-extrabold uppercase tracking-[0.14em]',
            doluKart ? 'text-white/75' : 'text-muted-foreground',
          )}
        >
          Hedefim
        </span>
        {/* Kırpılan taraf bölüm, üniversite değil: dar telefonda satır taşınca
            "Bilgisayar Mühen… · ODTÜ" okunuyor; tersi olsaydı hedefin hangi
            üniversitede olduğu tamamen kaybolurdu. */}
        {hedef ? (
          <span className="mt-0.5 flex items-baseline gap-1 text-[13.5px] leading-tight font-extrabold">
            <span className="truncate">{hedef.bolum}</span>
            <span
              className={cn(
                'shrink-0 text-[12.5px] font-bold',
                doluKart ? 'text-white/75' : 'text-muted-foreground',
              )}
            >
              · {universiteKisaAdi(hedef.universite)}
            </span>
          </span>
        ) : (
          <span
            className={cn(
              'mt-0.5 block text-[12.5px] font-semibold',
              doluKart ? 'text-white/85' : 'text-muted-foreground',
            )}
          >
            Üniversiteni ve bölümünü seç
          </span>
        )}
      </span>

      {/* Sağdaki sayı: hedefine ne kadar kaldığı. Sıralama tahmini yoksa
          gereken sıra yazıyor — ikisi de yoksa yalnızca ok kalıyor. */}
      {uzaklik !== null ? (
        <span className="shrink-0 text-right">
          <span
            className={cn(
              'rakam block text-[17px] leading-none font-extrabold',
              doluKart ? 'text-white' : uzaklik <= 0 ? 'text-success' : 'text-primary',
            )}
          >
            {uzaklik <= 0 ? 'İçindesin' : siraYaz(uzaklik)}
          </span>
          <span
            className={cn(
              'mt-1 block text-[10.5px] font-semibold',
              doluKart ? 'text-white/75' : 'text-muted-foreground',
            )}
          >
            {uzaklik <= 0 ? 'hedefin içinde' : 'sıra uzakta'}
          </span>
        </span>
      ) : hedef?.basariSirasi != null ? (
        <span className="shrink-0 text-right">
          <span
            className={cn(
              'rakam block text-[17px] leading-none font-extrabold',
              doluKart ? 'text-white' : 'text-primary',
            )}
          >
            {siraYaz(hedef.basariSirasi)}
          </span>
          <span
            className={cn(
              'mt-1 block text-[10.5px] font-semibold',
              doluKart ? 'text-white/75' : 'text-muted-foreground',
            )}
          >
            gereken sıra
          </span>
        </span>
      ) : (
        <ChevronRight
          size={18}
          strokeWidth={2.6}
          className={cn('shrink-0', doluKart ? 'text-white/70' : 'text-muted-foreground/60')}
          aria-hidden
        />
      )}
    </button>
  )
}
