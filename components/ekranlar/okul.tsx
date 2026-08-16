'use client'

import { useMemo, useState } from 'react'
import { Info, X } from 'lucide-react'
import type { Ayarlar, OkulYili } from '@/lib/types'
import {
  ILK_SINIF,
  netYaz,
  obpTahmini,
  ORTAOGRETIM_YIL_SAYISI,
  yilSayisiYaz,
  type ObpSonucu,
} from '@/lib/hesap'
import { cn, yeniId } from '@/lib/utils'
import { Alan, BaslikSatiri, Deger, Kart, Not } from '@/components/ui'

/**
 * Okul notları.
 *
 * Sistem bilerek tek sayıya indirildi: her ders için yazılı/sözlü/proje girmek
 * yerine yıl başına **bir** ortalama yazılıyor. Öğrenci karnesindeki sayıyı zaten
 * biliyor; on beş dersin notunu tek tek girmek aynı sonucu daha çok emekle
 * veriyordu (ve yarım kalırsa yanlış veriyordu).
 */
export function OkulEkrani({
  yillar,
  setYillar,
  ayarlar,
  hazir,
}: {
  yillar: OkulYili[]
  setYillar: (guncelleyici: OkulYili[] | ((onceki: OkulYili[]) => OkulYili[])) => void
  ayarlar: Ayarlar
  hazir: boolean
}) {
  const obp = useMemo(() => obpTahmini(yillar), [yillar])

  // 9'dan bu yılki sınıfa kadar. Henüz okunmamış sınıflar gösterilmiyor.
  const siniflar = useMemo(() => {
    const son = Math.max(ILK_SINIF, Math.min(12, ayarlar.buYilSinif))
    return Array.from({ length: son - ILK_SINIF + 1 }, (_, i) => ILK_SINIF + i)
  }, [ayarlar.buYilSinif])

  const yilBul = (sinif: number) => yillar.find((y) => y.sinif === sinif)

  const notuYaz = (sinif: number, metin: string) => {
    const temiz = metin.replace(',', '.').trim()
    const buYilMi = sinif === ayarlar.buYilSinif

    setYillar((onceki) => {
      const kalan = onceki.filter((y) => y.sinif !== sinif)
      if (temiz === '') return kalan

      const sayi = Number(temiz)
      if (!Number.isFinite(sayi)) return onceki

      const mevcut = onceki.find((y) => y.sinif === sinif)
      return [
        ...kalan,
        {
          id: mevcut?.id ?? yeniId(),
          sinif,
          ortalama: Math.min(100, Math.max(0, sayi)),
          // Bu yıl bitmediği için girilen değer 1. dönem sonu notudur.
          donemSonu: buYilMi,
        },
      ].sort((a, b) => a.sinif - b.sinif)
    })
  }

  if (!hazir) return <div className="h-40 animate-pulse rounded-2xl bg-muted" />

  return (
    <div>
      <BaslikSatiri
        baslik="Okul Notları"
        aciklama="Her yıl için tek bir ortalama — karnendeki sayı"
      />

      <Kart className="mb-3 border-primary/30 bg-primary-soft/50">
        <p className="text-sm font-medium text-muted-foreground">OBP tahmini</p>
        <p className="font-display text-5xl font-semibold text-primary">
          {obp ? netYaz(obp.obp, obp.obp % 1 === 0 ? 0 : 2) : '—'}
        </p>
        {obp ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Diploma notu {netYaz(obp.diplomaNotu)} × 5.{' '}
            {obp.tamMi
              ? 'Dört yılın hepsi yıl sonu notuyla girili — tahmin değil, gerçek OBP.'
              : aciklama(obp.girilenYil, obp.tahminiYil)}
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            Aşağıya yıl ortalamalarını yazdığında burada hesaplanır.
          </p>
        )}
      </Kart>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Deger
          etiket="Diploma notu"
          deger={obp ? netYaz(obp.diplomaNotu) : '—'}
          altNot="100 üzerinden"
        />
        <Deger
          etiket="Girilen yıl"
          deger={`${obp ? obp.girilenYil : 0} / ${ORTAOGRETIM_YIL_SAYISI}`}
          altNot={yilAltNotu(obp)}
        />
      </div>

      <p className="mb-2 font-display text-lg font-semibold">Yıl ortalamaların</p>

      <ul className="space-y-2">
        {siniflar.map((sinif) => (
          <li key={sinif}>
            <YilSatiri
              sinif={sinif}
              yil={yilBul(sinif)}
              buYilMi={sinif === ayarlar.buYilSinif}
              onDegis={(metin) => notuYaz(sinif, metin)}
            />
          </li>
        ))}
      </ul>

      <Not className="mt-4">
        <span className="flex items-start gap-2">
          <Info size={15} className="mt-0.5 shrink-0" aria-hidden />
          <span>
            Bitmiş yıllar için <strong>yıl sonu</strong> notunu yaz. İçinde bulunduğun yıl
            henüz bitmediği için oraya <strong>1. dönem sonu</strong> notun giriliyor ve o
            yılın tamamı için tahmin sayılıyor — karne gelince yıl sonu notunla değiştir.
          </span>
        </span>
      </Not>

      {obp && !obp.tamMi && (
        <Not className="mt-2">
          Girilmeyen yıllar için, girdiklerinin ortalamasını tutturacağın varsayılıyor.
          Dört yıl da girilince OBP kesinleşir.
        </Not>
      )}
    </div>
  )
}

/** OBP'nin neden tahmin olduğunu anlatan cümle. İki sebep birlikte olabiliyor. */
function aciklama(girilen: number, tahmini: number): string {
  const sebepler: string[] = []
  if (girilen < ORTAOGRETIM_YIL_SAYISI) {
    sebepler.push(`dört yılın ${yilSayisiYaz(girilen)} girili`)
  }
  if (tahmini > 0) {
    sebepler.push(
      tahmini === 1
        ? 'bu yılın notu 1. dönem sonundan geliyor'
        : `${tahmini} yılın notu 1. dönem sonundan geliyor`,
    )
  }
  // Cümle başı büyük harf: parçalar küçük harfle yazılıyor çünkü hangisinin
  // başa geleceği duruma göre değişiyor.
  const metin = sebepler.join('; ')
  return `${metin.charAt(0).toLocaleUpperCase('tr-TR')}${metin.slice(1)}. Bu yüzden sonuç bir tahmin.`
}

/** "Girilen yıl" kutusunun alt notu — eksiklik ile dönem sonu notu ayrı şeyler. */
function yilAltNotu(obp: ObpSonucu | null): string {
  if (!obp || obp.tamMi) return 'dört yıl tamam'
  if (obp.girilenYil < ORTAOGRETIM_YIL_SAYISI) return 'eksik yıllar tahmin edilir'
  return 'biri 1. dönem sonu notu'
}

function YilSatiri({
  sinif,
  yil,
  buYilMi,
  onDegis,
}: {
  sinif: number
  yil: OkulYili | undefined
  buYilMi: boolean
  onDegis: (metin: string) => void
}) {
  // Yazarken serbest bırakmak için yerel metin; boş bırakılabilsin diye
  // doğrudan sayıya bağlanmıyor ("9" yazarken 9'a kırpılmasın).
  const [metin, setMetin] = useState(yil ? String(yil.ortalama) : '')

  const dolu = metin.trim() !== ''

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border p-3',
        dolu ? 'border-primary/40 bg-primary/8' : 'border-border bg-card',
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium">{sinif}. sınıf</p>
        <p className="text-xs text-muted-foreground">
          {buYilMi ? '1. dönem sonu notun' : 'yıl sonu notun'}
        </p>
      </div>

      <Alan
        inputMode="decimal"
        value={metin}
        onChange={(e) => {
          const temiz = e.target.value.replace(/[^0-9,.]/g, '').slice(0, 6)
          setMetin(temiz)
          onDegis(temiz)
        }}
        placeholder="—"
        aria-label={`${sinif}. sınıf ${buYilMi ? '1. dönem sonu' : 'yıl sonu'} notu`}
        className="rakam h-11 w-24 shrink-0 text-center text-lg font-semibold"
      />

      {dolu && (
        <button
          type="button"
          onClick={() => {
            setMetin('')
            onDegis('')
          }}
          aria-label={`${sinif}. sınıf notunu sil`}
          className="-ml-1 shrink-0 rounded-full p-1.5 text-muted-foreground active:bg-muted"
        >
          <X size={16} aria-hidden />
        </button>
      )}
    </div>
  )
}
