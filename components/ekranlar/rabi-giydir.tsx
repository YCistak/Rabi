'use client'

import { useEffect, useState } from 'react'
import { Check, Footprints, Glasses, GraduationCap, Pencil, Ribbon, type LucideIcon } from 'lucide-react'
import { BaslikSatiri, Kart, kartGirisi } from '@/components/ui'
import { cn } from '@/lib/utils'
import {
  ESYALAR,
  dokun,
  giyiliMi,
  katmanlar,
  tumTabanlar,
  type Esya,
  type Giyilenler,
  type Yuva,
} from '@/lib/giydir'

/** İkon dosyası yüklenemezse karta düşen çizgi simge — boş kutu kırık görünürdü. */
const YUVA_SIMGESI: Record<Yuva, LucideIcon> = {
  kafa: GraduationCap,
  kulak: Pencil,
  yuz: Glasses,
  boyun: Ribbon,
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
  const hazir = useGorselleriOnYukle()

  return (
    <div>
      <BaslikSatiri baslik="Rabi'yi Giydir" />

      {/*
        Önizleme: aynı tuvaldeki (900×1100) saydam katmanlar üst üste. Kutu
        tuvalin oranında (`aspect-[9/11]`) ki katmanlar kırpılmadan ve
        birbirinden kaymadan otursun; hepsi aynı boyda `absolute inset-0`.
      */}
      <Kart className="mb-4 p-3">
        <div
          className={cn(
            'relative mx-auto aspect-[9/11] w-full max-w-[19rem] transition-opacity duration-200 motion-reduce:transition-none',
            hazir ? 'opacity-100' : 'opacity-0',
          )}
        >
          {katmanListesi.map((src, sira) => (
            // Alttaki Rabi'nin anahtarı sabit: kep takılınca yalnız `src`i değişir,
            // öğe yeniden kurulmaz; yeni görsel gelene dek eskisi durur, boşluk görünmez.
            <Katman key={sira === 0 ? 'taban' : src} src={src} ilk={sira === 0} />
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
 * Çıplak Rabi ve bütün eşya görsellerini ekran açılınca yükler; hepsi bitince
 * (yüklenemeyen de sayılır, yığını sonsuza dek bekletmesin) `true` döner.
 * Katmanlar ayrı ayrı belirirse büyük Rabi gelmeden kep havada asılı kalıyordu;
 * sonradan giyilen eşya da önceden yüklendiği için hemen geliyor.
 */
function useGorselleriOnYukle(): boolean {
  const [hazir, setHazir] = useState(false)
  useEffect(() => {
    const dosyalar = [...tumTabanlar(), ...ESYALAR.flatMap((e) => [e.gorsel, ...Object.values(e.tabanaGore ?? {})])]
    let kalan = dosyalar.length
    let iptal = false
    const bitti = () => {
      kalan -= 1
      if (kalan === 0 && !iptal) setHazir(true)
    }
    for (const dosya of dosyalar) {
      const img = new Image()
      img.onload = bitti
      img.onerror = bitti
      img.src = dosya
    }
    return () => {
      iptal = true
    }
  }, [])
  return hazir
}

/**
 * Tek katman. Dosya yoksa görünmez olur: eşya görseli henüz konmamışken
 * önizlemenin ortasında kırık görsel simgesi durmasın.
 *
 * Eşya katmanı yalnız opaklıkla gelir (`esya-solma`); `acilir-giris` gibi
 * konum oynatsaydı kep/gözlük 200 ms vücuttan ayrık dururdu. `key` dosya
 * yolu olduğu için yalnız yeni giyilen katman oynar. Çıplak Rabi oynamaz.
 */
function Katman({ src, ilk }: { src: string; ilk: boolean }) {
  // Hangi dosyanın yüklenemediği tutulur: alttaki Rabi aynı öğede dosya değiştiriyor.
  const [yokDosya, setYokDosya] = useState<string | null>(null)
  if (yokDosya === src) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      loading="eager"
      decoding="async"
      onError={() => setYokDosya(src)}
      className={cn('pointer-events-none absolute inset-0 size-full object-contain', !ilk && 'esya-solma')}
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
            className="esya-ikon size-[85%] object-contain"
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
