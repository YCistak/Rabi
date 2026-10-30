'use client'

import { useState } from 'react'
import { Check, Footprints, Glasses, GraduationCap, type LucideIcon } from 'lucide-react'
import { BaslikSatiri, Kart, kartGirisi } from '@/components/ui'
import { cn } from '@/lib/utils'
import {
  ESYALAR,
  dokun,
  giyiliMi,
  katmanlar,
  type Esya,
  type Giyilenler,
  type Yuva,
} from '@/lib/giydir'

/** İkon dosyası yüklenemezse karta düşen çizgi simge — boş kutu kırık görünürdü. */
const YUVA_SIMGESI: Record<Yuva, LucideIcon> = {
  kafa: GraduationCap,
  yuz: Glasses,
  ayak: Footprints,
}

/**
 * Rabi'yi Giydir — üstte büyük önizleme, altta eşyalar.
 *
 * Kayıt `AppShell`te (`rabi-giydir` anahtarı); ekran yalnızca çiziyor ve
 * dokunuşu bildiriyor. Kurallar `lib/giydir.ts`te.
 */
export function RabiGiydirEkrani({
  giyilenler,
  setGiyilenler,
}: {
  giyilenler: Giyilenler
  setGiyilenler: (guncelle: (onceki: Giyilenler) => Giyilenler) => void
}) {
  const katmanListesi = katmanlar(giyilenler)

  return (
    <div>
      <BaslikSatiri baslik="Rabi'yi Giydir" />

      {/*
        Önizleme: aynı tuvaldeki (900×1100) saydam katmanlar üst üste. Kutu
        tuvalin oranında (`aspect-[9/11]`) ki katmanlar kırpılmadan ve
        birbirinden kaymadan otursun; hepsi aynı boyda `absolute inset-0`.
      */}
      <Kart className="mb-4 p-3">
        <div className="relative mx-auto aspect-[9/11] w-full max-w-[19rem]">
          {katmanListesi.map((src, sira) => (
            <Katman key={src} src={src} ilk={sira === 0} />
          ))}
        </div>
      </Kart>

      <h2 className="mb-2 px-1 font-display text-base font-extrabold tracking-tight">Eşyalar</h2>
      <ul className="grid grid-cols-3 gap-2.5">
        {ESYALAR.map((esya, sira) => (
          <li key={esya.id}>
            <EsyaKarti
              esya={esya}
              secili={giyiliMi(giyilenler, esya.id)}
              sira={sira}
              onSec={() => setGiyilenler((onceki) => dokun(onceki, esya.id))}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Tek katman. Dosya yoksa görünmez olur: eşya görseli henüz konmamışken
 * önizlemenin ortasında kırık görsel simgesi durmasın.
 *
 * Eşya katmanı `acilir-giris` ile hafifçe yerine iner; `key` dosya yolu
 * olduğu için yalnız yeni giyilen katman oynar, ötekiler yerinde kalır.
 * Çıplak Rabi oynamaz — her açılışta zıplayan bir tavşan gürültü olurdu.
 */
function Katman({ src, ilk }: { src: string; ilk: boolean }) {
  const [yok, setYok] = useState(false)
  if (yok) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      loading="eager"
      decoding="async"
      onError={() => setYok(true)}
      className={cn('pointer-events-none absolute inset-0 size-full object-contain', !ilk && 'acilir-giris')}
    />
  )
}

function EsyaKarti({
  esya,
  secili,
  sira,
  onSec,
}: {
  esya: Esya
  secili: boolean
  sira: number
  onSec: () => void
}) {
  const [ikonYok, setIkonYok] = useState(false)
  const Simge = YUVA_SIMGESI[esya.yuva]
  const giris = kartGirisi(sira)

  return (
    <button
      type="button"
      onClick={onSec}
      aria-pressed={secili}
      style={giris.style}
      className={cn(
        // Kenar seçili değilken de var (saydam): seçince kart boyu oynamasın.
        'golge-kart relative flex w-full flex-col items-center gap-1.5 rounded-2xl border-2 bg-card px-2 pt-2.5 pb-2 text-center transition active:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        secili ? 'border-primary-parlak' : 'border-transparent',
        giris.className,
      )}
    >
      {secili && (
        <span className="absolute top-1.5 right-1.5 grid size-5 place-items-center rounded-full bg-primary-parlak text-white">
          <Check size={13} strokeWidth={3} aria-hidden />
        </span>
      )}
      <span className="grid aspect-square w-full max-w-[72px] place-items-center rounded-[18px] bg-muted">
        {ikonYok ? (
          <Simge size={28} strokeWidth={2.2} className="text-muted-foreground" aria-hidden />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={esya.ikon}
            alt=""
            aria-hidden
            draggable={false}
            onError={() => setIkonYok(true)}
            className="size-[85%] object-contain"
          />
        )}
      </span>
      <span className="text-[12px] leading-tight font-extrabold text-balance">{esya.ad}</span>
      {/* Fiyat alanı var ama hepsi 0 ve para birimi yok (`lib/giydir.ts`):
          etiket bu yüzden sabit, fiyattan türetilmiyor. */}
      <span className="text-[10.5px] font-bold text-muted-foreground">Ücretsiz</span>
    </button>
  )
}
