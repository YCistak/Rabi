'use client'

import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Buton } from '@/components/ui'
import { cn, tariheYaz } from '@/lib/utils'

const GUN_BASLIKLARI = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz']

const AY_ADLARI = [
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

export type GunIsareti = {
  /** 0–1 arası doluluk; hücrenin renk yoğunluğunu belirler. 0 ise işaret çizilmez. */
  doluluk: number
  /** Hücrenin altındaki nokta (devamsızlık gibi ikinci bir bilgi için). */
  nokta?: 'ozurlu' | 'ozursuz'
}

/**
 * Ay görünümlü takvim. Kütüphane kullanılmıyor: ihtiyaç duyulan tek şey
 * "ayı çiz, gün seçtir, günleri boyayabil" — bir tarih kütüphanesi bunun için
 * APK'ya eklenecek ağırlığı hak etmiyor.
 *
 * Hafta pazartesi başlar (Türkiye).
 */
export function Takvim({
  ay,
  onAyDegis,
  secili,
  onSec,
  isaretler,
  bugunIso,
}: {
  /** Gösterilen ayın herhangi bir günü. */
  ay: Date
  onAyDegis: (yeniAy: Date) => void
  /** Seçili gün, 'YYYY-AA-GG'. */
  secili: string
  onSec: (tarih: string) => void
  isaretler: Map<string, GunIsareti>
  bugunIso: string
}) {
  const hucreler = useMemo(() => ayHucreleri(ay), [ay])
  const ayBasligi = `${AY_ADLARI[ay.getMonth()]} ${ay.getFullYear()}`

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
        <p className="font-display font-semibold">{ayBasligi}</p>
        <Buton bicim="hayalet" boy="simge" onClick={() => ayKaydir(1)} aria-label="Sonraki ay">
          <ChevronRight size={18} aria-hidden />
        </Buton>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {GUN_BASLIKLARI.map((gun) => (
          <span key={gun} className="pb-1 text-xs font-medium text-muted-foreground">
            {gun}
          </span>
        ))}

        {hucreler.map((hucre, i) => {
          if (hucre === null) return <span key={`bos-${i}`} />

          const iso = tariheYaz(hucre)
          const isaret = isaretler.get(iso)
          const seciliMi = iso === secili
          const bugunMu = iso === bugunIso
          const doluluk = isaret?.doluluk ?? 0

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSec(iso)}
              aria-pressed={seciliMi}
              aria-label={`${hucre.getDate()} ${AY_ADLARI[hucre.getMonth()]}`}
              className={cn(
                'relative flex aspect-square items-center justify-center rounded-lg text-sm transition',
                'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
                seciliMi && 'ring-2 ring-primary',
                bugunMu && !seciliMi && 'ring-1 ring-border',
              )}
              style={
                doluluk > 0
                  ? {
                      // Doluluk arttıkça vurgu rengi belirginleşir.
                      backgroundColor: `color-mix(in oklch, var(--primary) ${Math.round(
                        18 + doluluk * 62,
                      )}%, transparent)`,
                      color: doluluk > 0.55 ? 'var(--primary-foreground)' : undefined,
                    }
                  : undefined
              }
            >
              <span className="rakam">{hucre.getDate()}</span>
              {isaret?.nokta && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute bottom-1 h-1 w-1 rounded-full',
                    isaret.nokta === 'ozursuz' ? 'bg-danger' : 'bg-warning',
                  )}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Ayın günleri, başına önceki haftanın boşlukları eklenmiş hâlde. */
function ayHucreleri(ay: Date): (Date | null)[] {
  const ilkGun = new Date(ay.getFullYear(), ay.getMonth(), 1)
  const gunSayisi = new Date(ay.getFullYear(), ay.getMonth() + 1, 0).getDate()
  // getDay(): 0 = pazar. Pazartesi 0 olacak şekilde kaydırılır.
  const bosluk = (ilkGun.getDay() + 6) % 7

  return [
    ...Array.from({ length: bosluk }, () => null),
    ...Array.from({ length: gunSayisi }, (_, i) => new Date(ay.getFullYear(), ay.getMonth(), i + 1)),
  ]
}
