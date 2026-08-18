'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGeriKatmani } from '@/lib/geri'

export function Kart({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('golge-kart rounded-2xl bg-card p-4 text-card-foreground', className)}
      {...props}
    />
  )
}

const butonBicimleri = {
  birincil: 'bg-primary text-primary-foreground active:brightness-95',
  ikincil: 'bg-muted text-foreground active:brightness-95',
  hayalet: 'bg-transparent text-muted-foreground active:bg-muted',
  tehlike: 'bg-transparent text-danger active:bg-danger/10',
} as const

const butonBoylari = {
  normal: 'h-11 px-4 text-[15px]',
  kucuk: 'h-9 px-3 text-sm',
  simge: 'h-10 w-10',
} as const

export function Buton({
  bicim = 'birincil',
  boy = 'normal',
  className,
  ...props
}: React.ComponentProps<'button'> & {
  bicim?: keyof typeof butonBicimleri
  boy?: keyof typeof butonBoylari
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition',
        'disabled:pointer-events-none disabled:opacity-45',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        butonBicimleri[bicim],
        butonBoylari[boy],
        className,
      )}
      {...props}
    />
  )
}

export function Alan({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-input bg-background px-3 text-[15px]',
        'placeholder:text-muted-foreground/70',
        'focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring/40',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Yazılabilir seçim kutusu: kullanıcı listeden seçebilir ya da kendi metnini
 * yazabilir (alışveriş sitelerindeki şehir kutusu gibi). Öneriler `onPointerDown`
 * ile seçilir; `onClick` kullanılsaydı input'un blur'ü listeyi önce kapatırdı.
 */
export function SecmeliAlan({
  deger,
  onDegis,
  oneriler,
  className,
  ...props
}: Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> & {
  deger: string
  onDegis: (deger: string) => void
  oneriler: string[]
}) {
  const [acik, setAcik] = useState(false)
  const gorunen = acik ? oneriler.slice(0, 8) : []

  return (
    <div className="relative">
      <Alan
        value={deger}
        onChange={(e) => {
          onDegis(e.target.value)
          setAcik(true)
        }}
        onFocus={() => setAcik(true)}
        onBlur={() => setAcik(false)}
        autoComplete="off"
        role="combobox"
        aria-expanded={acik}
        className={cn('pr-9', className)}
        {...props}
      />

      <ChevronDown
        size={18}
        aria-hidden
        className={cn(
          'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-transform',
          acik && 'rotate-180',
        )}
      />

      {gorunen.length > 0 && (
        <ul className="absolute inset-x-0 top-[calc(100%+4px)] z-30 max-h-56 overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-lg">
          {gorunen.map((oneri) => (
            <li key={oneri}>
              <button
                type="button"
                // Seçim blur'den önce yakalanmalı, yoksa liste kapanıp tıklama kaybolur
                onPointerDown={(e) => {
                  e.preventDefault()
                  onDegis(oneri)
                  setAcik(false)
                }}
                className="w-full px-3 py-2 text-left text-sm active:bg-muted"
              >
                {oneri}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Etiket({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      className={cn('mb-1.5 block text-sm font-medium text-muted-foreground', className)}
      {...props}
    />
  )
}

export function BaslikSatiri({
  baslik,
  aciklama,
  sag,
  ortala,
}: {
  baslik: string
  aciklama?: string
  sag?: React.ReactNode
  /**
   * Başlık ve açıklamayı sayfanın ortasına alır; `sag` sağ üst köşeye konumlanır.
   * Sağdaki düğme akışta kalsaydı metni ortalamaz, yana iterdi.
   */
  ortala?: boolean
}) {
  if (ortala) {
    return (
      <div className="relative mb-4 px-12 text-center">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">{baslik}</h1>
        {aciklama && <p className="mt-0.5 text-sm text-muted-foreground">{aciklama}</p>}
        {sag && <div className="absolute right-0 top-0">{sag}</div>}
      </div>
    )
  }

  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">{baslik}</h1>
        {aciklama && <p className="mt-0.5 text-sm text-muted-foreground">{aciklama}</p>}
      </div>
      {sag}
    </div>
  )
}

export function BosDurum({
  simge,
  baslik,
  aciklama,
  eylem,
}: {
  simge: React.ReactNode
  baslik: string
  aciklama: string
  eylem?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-12 text-center">
      <div className="mb-3 text-muted-foreground/60">{simge}</div>
      <p className="font-medium">{baslik}</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{aciklama}</p>
      {eylem && <div className="mt-4">{eylem}</div>}
    </div>
  )
}

/** Sayı istatistiği kutusu: etiket + değer (+ isteğe bağlı alt not). */
export function Deger({
  etiket,
  deger,
  altNot,
  vurgu,
  className,
}: {
  etiket: string
  deger: React.ReactNode
  altNot?: React.ReactNode
  vurgu?: boolean
  className?: string
}) {
  return (
    <div className={cn('rounded-xl bg-muted/60 px-3 py-2.5', className)}>
      <p className="text-xs text-muted-foreground">{etiket}</p>
      <p
        className={cn(
          'font-display text-xl font-extrabold',
          vurgu ? 'text-primary' : 'text-foreground',
        )}
      >
        {deger}
      </p>
      {altNot && <p className="mt-0.5 text-xs text-muted-foreground">{altNot}</p>}
    </div>
  )
}

/** Onay isteyen yıkıcı işlemler için basit alt sayfa. */
export function Onay({
  acik,
  baslik,
  aciklama,
  onayMetni = 'Sil',
  onOnayla,
  onIptal,
}: {
  acik: boolean
  baslik: string
  aciklama: string
  onayMetni?: string
  onOnayla: () => void
  onIptal: () => void
}) {
  // Geri tuşu onayı iptal etsin; yoksa ekrandan tamamen çıkardı.
  useGeriKatmani(acik, onIptal)

  if (!acik) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pt-[calc(1rem+var(--guvenli-ust))] pb-[calc(1rem+var(--guvenli-alt))]">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5">
        <p className="font-display text-lg font-extrabold">{baslik}</p>
        <p className="mt-1 text-sm text-muted-foreground">{aciklama}</p>
        <div className="mt-5 flex gap-2">
          <Buton bicim="ikincil" className="flex-1" onClick={onIptal}>
            Vazgeç
          </Buton>
          <Buton
            className="flex-1 bg-danger text-white"
            onClick={() => {
              onOnayla()
              onIptal()
            }}
          >
            {onayMetni}
          </Buton>
        </div>
      </div>
    </div>
  )
}

/** Günlük hedef ilerlemesini gösteren halka. Yüzde 100'ü aşarsa halka doldu kalır. */
export function Halka({
  deger,
  hedef,
  boyut = 132,
  kalinlik = 10,
  renk,
  children,
}: {
  deger: number
  hedef: number
  boyut?: number
  kalinlik?: number
  /** Rengi sabitler. Verilmezse dolunca yeşile döner (günlük hedef davranışı). */
  renk?: string
  children?: React.ReactNode
}) {
  const yaricap = (boyut - kalinlik) / 2
  const cevre = 2 * Math.PI * yaricap
  const oran = hedef > 0 ? Math.min(1, deger / hedef) : 0

  return (
    <div className="relative" style={{ width: boyut, height: boyut }}>
      <svg width={boyut} height={boyut} className="-rotate-90">
        <circle
          cx={boyut / 2}
          cy={boyut / 2}
          r={yaricap}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={kalinlik}
        />
        <circle
          cx={boyut / 2}
          cy={boyut / 2}
          r={yaricap}
          fill="none"
          stroke={renk ?? (oran >= 1 ? 'var(--ikincil)' : 'var(--primary)')}
          strokeWidth={kalinlik}
          strokeLinecap="round"
          strokeDasharray={cevre}
          strokeDashoffset={cevre * (1 - oran)}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}

/** Uyarı / bilgi şeridi. Sıralama ekranındaki "tahmindir" notu bunu kullanır. */
export function Not({
  tur = 'bilgi',
  className,
  children,
}: {
  tur?: 'bilgi' | 'uyari' | 'tehlike'
  className?: string
  children: React.ReactNode
}) {
  const bicimler = {
    bilgi: 'bg-muted/70 text-muted-foreground',
    uyari: 'bg-warning/12 text-warning',
    tehlike: 'bg-danger/12 text-danger',
  } as const

  return (
    <div className={cn('rounded-xl px-3 py-2.5 text-sm leading-relaxed', bicimler[tur], className)}>
      {children}
    </div>
  )
}

/** Seçilebilir çip — ders seçimi ve şablon seçimi bunu kullanır. */
export function Cip({
  secili,
  className,
  ...props
}: React.ComponentProps<'button'> & { secili?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={secili}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm font-bold transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        secili
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground active:bg-muted',
        className,
      )}
      {...props}
    />
  )
}
