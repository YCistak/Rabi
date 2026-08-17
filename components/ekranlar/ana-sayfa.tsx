'use client'

import { useMemo } from 'react'
import { AlertTriangle, ChevronRight, Flame, Sparkles, Target } from 'lucide-react'
import type { Ayarlar, Devamsizlik, GunlukKayit, Hedef } from '@/lib/types'
import { devamsizlikOzeti, gunOzeti, hedefSerisi, netYaz } from '@/lib/hesap'
import { bugun, cn } from '@/lib/utils'
import { sozSec } from '@/lib/sozler'
import { siraYaz } from '@/lib/siralama'
import type { Ekran } from '@/lib/gezinme'
import { Halka, Kart, Not } from '@/components/ui'
import { Rabi, type MaskotDurumu } from '@/components/maskot/rabi'
import { KartMenusu } from './kart-menusu'

export function AnaSayfa({
  ayarlar,
  gunlukKayitlar,
  devamsizlik,
  hedef,
  guncelSiralama,
  ozetBekliyor,
  onKartAc,
}: {
  ayarlar: Ayarlar
  gunlukKayitlar: GunlukKayit[]
  devamsizlik: Devamsizlik[]
  hedef: Hedef | null
  /** Son denemelerden çıkan tahmini sıralama; deneme yoksa null. */
  guncelSiralama: number | null
  /** Biten haftanın özeti henüz izlenmediyse davet kartı gösterilir. */
  ozetBekliyor: boolean
  onKartAc: (ekran: Ekran) => void
}) {
  const tarih = bugun()

  // Söz gün boyunca sabit kalsın diye tohum olarak tarih verilir; her yeniden
  // çizimde değişse okunamadan kaybolurdu.
  const soz = useMemo(() => sozSec(tarih), [tarih])

  const bugunku = useMemo(
    () => gunOzeti(gunlukKayitlar.find((k) => k.tarih === tarih)),
    [gunlukKayitlar, tarih],
  )
  const seri = useMemo(
    () => hedefSerisi(gunlukKayitlar, ayarlar.gunlukHedef, tarih),
    [gunlukKayitlar, ayarlar.gunlukHedef, tarih],
  )
  const devamsizlikDurumu = useMemo(() => devamsizlikOzeti(devamsizlik), [devamsizlik])

  const hedefTuttu = bugunku.toplam >= ayarlar.gunlukHedef && ayarlar.gunlukHedef > 0
  const maskotDurumu: MaskotDurumu = devamsizlikDurumu.asildi
    ? 'uzgun'
    : hedefTuttu
      ? 'mutlu'
      : bugunku.toplam > 0
        ? 'normal'
        : 'uykulu'

  return (
    <div className="space-y-5">
      {/* Selam + günün sözü */}
      <div className="flex items-center gap-3">
        <Rabi durum={maskotDurumu} boyut={80} />
        <div className="min-w-0">
          <p className="font-display text-xl font-semibold tracking-tight">
            {selamla()}
          </p>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">{soz.metin}</p>
          {soz.kaynak && (
            <p className="mt-0.5 text-xs text-muted-foreground/70">— {soz.kaynak}</p>
          )}
        </div>
      </div>

      {/* Haftalık özet daveti — biten haftanın özeti izlenmediyse en üstte.
          Ana sayfanın en görünür yeri burası; kart menüsüne konsaydı özet
          çıktığından haberi olmayan kullanıcı hiç açmazdı. */}
      {ozetBekliyor && (
        <button
          type="button"
          onClick={() => onKartAc('haftalik-ozet')}
          className="acilis-girisi flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-white transition active:brightness-95"
          style={{ background: 'linear-gradient(120deg, #C2622A 0%, #8C3D14 100%)' }}
        >
          <Sparkles size={22} className="shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block font-display font-semibold">Haftalık özetin hazır</span>
            <span className="block text-xs text-white/80">
              Geçen haftanı kart kart izle, paylaş
            </span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-white/80" aria-hidden />
        </button>
      )}

      {/* Günlük hedef */}
      <Kart className="flex items-center gap-4">
        <Halka deger={bugunku.toplam} hedef={ayarlar.gunlukHedef}>
          <span className="rakam font-display text-2xl font-semibold leading-none">
            {bugunku.toplam}
          </span>
          <span className="mt-0.5 text-xs text-muted-foreground">/ {ayarlar.gunlukHedef}</span>
        </Halka>

        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-sm font-medium">Bugünkü soru hedefin</p>
          <p className="text-sm text-muted-foreground">
            {hedefTuttu
              ? 'Hedefi tutturdun. Fazlası cabası.'
              : `${ayarlar.gunlukHedef - bugunku.toplam} soru kaldı.`}
          </p>
          {bugunku.toplam > 0 && (
            <p className="rakam text-xs text-muted-foreground">
              {bugunku.dogru} doğru · {bugunku.yanlis} yanlış · {netYaz(bugunku.net)} net
            </p>
          )}
          {seri > 0 && (
            <p className="flex items-center gap-1 text-xs font-medium text-primary">
              <Flame size={13} aria-hidden />
              {seri} gündür üst üste
            </p>
          )}
        </div>
      </Kart>

      {/* Devamsızlık uyarısı — yalnızca gerektiğinde görünür */}
      {(devamsizlikDurumu.asildi || devamsizlikDurumu.uyari) && (
        <Not tur={devamsizlikDurumu.asildi ? 'tehlike' : 'uyari'}>
          <span className="flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden />
            <span>
              {devamsizlikDurumu.asildi
                ? 'Devamsızlık hakkını aştın. Okul rehberliğiyle görüşmen gerekebilir.'
                : `Devamsızlık sınırına yaklaştın: özürsüz ${devamsizlikDurumu.ozursuzKalan}, özürlü ${devamsizlikDurumu.ozurluKalan} gün hakkın kaldı.`}
            </span>
          </span>
        </Not>
      )}

      {/* Hedef bölüm */}
      <button
        type="button"
        onClick={() => onKartAc('hedef')}
        className="w-full rounded-2xl border border-border bg-card p-4 text-left transition active:bg-muted"
      >
        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Target size={14} aria-hidden />
          Hedefim
        </span>
        {hedef ? (
          <>
            <span className="mt-1.5 block font-display text-lg font-semibold leading-tight">
              {hedef.bolum}
            </span>
            <span className="block text-sm text-muted-foreground">{hedef.universite}</span>
            {hedef.basariSirasi !== null && (
              <span className="rakam mt-1 block text-sm text-muted-foreground">
                Gereken sıralama: {siraYaz(hedef.basariSirasi)}
              </span>
            )}
            {hedef.basariSirasi !== null && guncelSiralama !== null && (
              <span
                className={cn(
                  'mt-1 block text-sm font-medium',
                  guncelSiralama <= hedef.basariSirasi ? 'text-success' : 'text-primary',
                )}
              >
                {guncelSiralama <= hedef.basariSirasi
                  ? 'Şu an hedefinin içindesin.'
                  : `${siraYaz(guncelSiralama - hedef.basariSirasi)} sıra uzaktasın.`}
              </span>
            )}
          </>
        ) : (
          <span className="mt-1.5 block text-sm text-muted-foreground">
            Hedef bölümünü yaz — Rabi sıralamana ne kadar kaldığını takip etsin.
          </span>
        )}
      </button>

      <KartMenusu onKartAc={onKartAc} kisa />
    </div>
  )
}

function selamla(): string {
  const saat = new Date().getHours()
  if (saat < 6) return 'Hâlâ ayaktasın'
  if (saat < 11) return 'Günaydın'
  if (saat < 18) return 'İyi çalışmalar'
  return 'İyi akşamlar'
}
