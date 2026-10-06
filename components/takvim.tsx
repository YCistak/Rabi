'use client'

import { useMemo, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Buton, Kart } from '@/components/ui'
import { cn, haftaBasiIsaretiMi, tariheCevir, tariheYaz, yediGunlukSerit } from '@/lib/utils'

/** Hafta pazartesi başlar (Türkiye). */
export const GUN_ADLARI = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

export const AY_ADLARI = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]

/** Bir günün takvimde taşıdığı bilgi; ne anlama geldiğine ekran karar verir. */
export type GunIsareti = {
  /** 0–1 arası doluluk; hücrenin zemin yoğunluğunu belirler. Yoksa ya da 0 ise zemin boyanmaz. */
  doluluk?: number
  /**
   * Sayının altındaki nokta. `is`: o günde kayıt var (Yapılacaklar'da görev);
   * `ozurlu` / `ozursuz`: devamsızlığın türü.
   */
  nokta?: 'is' | 'ozurlu' | 'ozursuz'
}

/**
 * Hafta şeridi ile ay takviminin ortak gün seçimi kuralları. Kurallar ekranın:
 * Soru Takibi dünden eskisini soluk, yarından sonrasını kapalı istiyor;
 * Yapılacaklar geçmişi soluk ama gelecek açık.
 */
type GunSecimi = {
  /** Seçili gün, 'YYYY-AA-GG'. */
  secili: string
  onSec: (tarih: string) => void
  bugunIso: string
  isaretler: Map<string, GunIsareti>
  /**
   * Bu günden sonrası seçilemez. Soru Takibi ve Devamsızlık `bugunIso` veriyor:
   * olmamış bir güne kayıt girilemez.
   */
  enGecIso?: string
  /** Salt okunur günler soluk yazılır (seçilebilir kalırlar). */
  solukMu?: (iso: string) => boolean
}

/**
 * Tek gün hücresi; şerit ve ay takvimi aynısını çiziyor ki iki görünüm aynı
 * takvim gibi dursun. Görünüş Yapılacaklar'ın şeridinden
 * (`tasarim/yapilacaklar-v3.dc.html`).
 */
function GunHucresi({
  iso,
  kucuk,
  secili,
  onSec,
  bugunIso,
  isaretler,
  enGecIso,
  solukMu,
}: GunSecimi & { iso: string; kucuk?: boolean }) {
  const tarih = tariheCevir(iso)
  const isaret = isaretler.get(iso)
  const seciliMi = iso === secili
  const bugunMu = iso === bugunIso
  // ISO tarihler sözlük sırasıyla karşılaştırılabiliyor; Date kurmaya gerek yok.
  const kapali = enGecIso !== undefined && iso > enGecIso
  const soluk = !kapali && (solukMu?.(iso) ?? false)
  const haftaBasi = haftaBasiIsaretiMi(iso, bugunIso)
  const doluluk = isaret?.doluluk ?? 0

  const yaziRengi = seciliMi
    ? 'text-white'
    : kapali
      ? 'text-muted-foreground/35'
      : soluk
        ? 'text-muted-foreground/60'
        : null

  return (
    <button
      type="button"
      onClick={() => onSec(iso)}
      disabled={kapali}
      aria-pressed={seciliMi}
      aria-label={`${tarih.getDate()} ${AY_ADLARI[tarih.getMonth()]}${
        haftaBasi ? ', hafta başı' : ''
      }${kapali ? ' — henüz gelmedi' : ''}`}
      className={cn(
        'relative flex flex-col items-center justify-center transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
        kucuk ? 'h-11 gap-1 rounded-[12px]' : 'h-[68px] gap-1.5 rounded-[14px]',
        seciliMi ? 'bg-primary-parlak' : !kapali && 'active:bg-muted/70',
        // Ay takviminde bugün yerinden belli olmuyor; şeritte hep ortada.
        kucuk && bugunMu && !seciliMi && 'ring-1 ring-primary/40',
      )}
      style={
        doluluk > 0 && !seciliMi
          ? {
              // Doluluk arttıkça zemin belirginleşir; yazı koyu kalacak kadar açık.
              backgroundColor: `color-mix(in oklch, var(--primary-parlak) ${Math.round(
                12 + Math.min(1, doluluk) * 38,
              )}%, transparent)`,
            }
          : undefined
      }
    >
      {/* Hafta başı: üstte ince çizgi. Altındaki yuvarlak noktalarla
          karışmasın diye biçimi de yeri de ayrı. */}
      {haftaBasi && (
        <span
          aria-hidden
          className={cn(
            'absolute left-1/2 h-[2px] w-3 -translate-x-1/2 rounded-full',
            kucuk ? 'top-[3px]' : 'top-1.5',
            seciliMi ? 'bg-white/80' : kapali ? 'bg-primary/20' : 'bg-primary/45',
          )}
        />
      )}
      {!kucuk && (
        <span className={cn('text-[11px] font-bold', yaziRengi ?? 'text-muted-foreground')}>
          {GUN_ADLARI[(tarih.getDay() + 6) % 7]}
        </span>
      )}
      <span
        className={cn(
          'rakam font-extrabold leading-none',
          kucuk ? 'text-[15px]' : 'text-[17px]',
          yaziRengi ?? 'text-foreground',
        )}
      >
        {tarih.getDate()}
      </span>
      {/* Nokta "o günde bir şey var" diyor; geçmiş/soluk günde soluk. Yeri her
          hücrede ayrılıyor ki sayılar aynı hizada kalsın. */}
      <span
        aria-hidden
        className={cn(
          'size-[5px] rounded-full',
          !isaret?.nokta
            ? 'bg-transparent'
            : isaret.nokta === 'ozursuz'
              ? 'bg-danger'
              : isaret.nokta === 'ozurlu'
                ? 'bg-warning'
                : seciliMi
                  ? 'bg-white'
                  : soluk || kapali
                    ? 'bg-muted-foreground/35'
                    : 'bg-primary-parlak',
          seciliMi && isaret?.nokta && isaret.nokta !== 'is' && 'ring-[1.5px] ring-white',
        )}
      />
    </button>
  )
}

/**
 * Yedi günlük hafta şeridi — uygulamanın ortak takvimi. Bugün daima ortada
 * (dördüncü gün); başlıkta seçili günün ayı yazar. `ek` başlığın sağına
 * (özet, takvim düğmesi), `children` şeridin altına (açılır ay takvimi) gelir.
 */
export function HaftaSeridi({
  ek,
  children,
  className,
  ...secim
}: GunSecimi & { ek?: ReactNode; children?: ReactNode; className?: string }) {
  const gunler = useMemo(() => yediGunlukSerit(secim.bugunIso), [secim.bugunIso])
  const seciliTarih = tariheCevir(secim.secili)

  return (
    <Kart className={cn('rounded-[20px] px-2 pb-2 pt-2.5', className)}>
      <div
        className={cn(
          'mb-1.5 flex items-center gap-2 border-b border-dashed border-primary/25 px-1.5 pb-2',
          // Sağdaki düğme 32 piksel; başlık satırı onunla zıplamasın.
          ek && 'min-h-[40px]',
        )}
      >
        <p className="font-display text-[15px] font-extrabold tracking-tight">
          {AY_ADLARI[seciliTarih.getMonth()]} {seciliTarih.getFullYear()}
        </p>
        {ek}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {gunler.map((iso) => (
          <GunHucresi key={iso} iso={iso} {...secim} />
        ))}
      </div>
      {children}
    </Kart>
  )
}

/**
 * Ay görünümlü takvim; hücreleri hafta şeridininkiyle aynı. Kütüphane
 * kullanılmıyor: ihtiyaç duyulan tek şey "ayı çiz, gün seçtir, günleri
 * işaretle" — bir tarih kütüphanesi bunun için APK'ya eklenecek ağırlığı hak
 * etmiyor.
 */
export function Takvim({
  ay,
  onAyDegis,
  ...secim
}: GunSecimi & {
  /** Gösterilen ayın herhangi bir günü. */
  ay: Date
  onAyDegis: (yeniAy: Date) => void
}) {
  const hucreler = useMemo(() => ayHucreleri(ay), [ay])

  const ayKaydir = (fark: number) => {
    // Ayın 1'i üzerinden kaydırılır: 31 Mart'tan bir ay geri gidince
    // "31 Şubat" taşması olup nisana atlamasın.
    onAyDegis(new Date(ay.getFullYear(), ay.getMonth() + fark, 1))
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Buton bicim="hayalet" boy="simge" onClick={() => ayKaydir(-1)} aria-label="Önceki ay">
          <ChevronLeft size={18} aria-hidden />
        </Buton>
        <p className="font-display text-[15px] font-extrabold tracking-tight">
          {AY_ADLARI[ay.getMonth()]} {ay.getFullYear()}
        </p>
        <Buton bicim="hayalet" boy="simge" onClick={() => ayKaydir(1)} aria-label="Sonraki ay">
          <ChevronRight size={18} aria-hidden />
        </Buton>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {GUN_ADLARI.map((gun) => (
          <span key={gun} className="pb-1 text-[11px] font-bold text-muted-foreground">
            {gun}
          </span>
        ))}

        {hucreler.map((hucre, i) =>
          hucre === null ? (
            <span key={`bos-${i}`} />
          ) : (
            <GunHucresi key={hucre} iso={hucre} kucuk {...secim} />
          ),
        )}
      </div>
    </div>
  )
}

/** Ayın günleri ('YYYY-AA-GG'), başına önceki haftanın boşlukları eklenmiş hâlde. */
function ayHucreleri(ay: Date): (string | null)[] {
  const ilkGun = new Date(ay.getFullYear(), ay.getMonth(), 1)
  const gunSayisi = new Date(ay.getFullYear(), ay.getMonth() + 1, 0).getDate()
  // getDay(): 0 = pazar. Pazartesi 0 olacak şekilde kaydırılır.
  const bosluk = (ilkGun.getDay() + 6) % 7

  return [
    ...Array.from({ length: bosluk }, () => null),
    ...Array.from({ length: gunSayisi }, (_, i) =>
      tariheYaz(new Date(ay.getFullYear(), ay.getMonth(), i + 1)),
    ),
  ]
}
