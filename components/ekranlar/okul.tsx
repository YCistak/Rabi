'use client'

import { useMemo, useState } from 'react'
import { Check, LockKeyhole, Trash2 } from 'lucide-react'
import type { Ayarlar, OkulYili } from '@/lib/types'
import {
  ILK_SINIF,
  mezunMu,
  netYaz,
  obpSonucu,
  ORTAOGRETIM_YIL_SAYISI,
  SINIFLAR,
} from '@/lib/hesap'
import { cn, yeniId } from '@/lib/utils'
import { Alan, Kart, Not } from '@/components/ui'

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
  setAyarlar,
  hazir,
}: {
  yillar: OkulYili[]
  setYillar: (guncelleyici: OkulYili[] | ((onceki: OkulYili[]) => OkulYili[])) => void
  ayarlar: Ayarlar
  setAyarlar: (guncelleyici: Ayarlar | ((onceki: Ayarlar) => Ayarlar)) => void
  hazir: boolean
}) {
  const mezun = mezunMu(ayarlar.buYilSinif)
  const obp = useMemo(
    () => obpSonucu(yillar, ayarlar.elleObp),
    [yillar, ayarlar.elleObp],
  )
  const elleGirildi = ayarlar.elleObp !== null

  const yilBul = (sinif: number) => yillar.find((y) => y.sinif === sinif)

  const notuYaz = (sinif: number, metin: string) => {
    if (sinif > ayarlar.buYilSinif) return
    const temiz = metin.replace(',', '.').trim()

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
        },
      ].sort((a, b) => a.sinif - b.sinif)
    })
  }

  if (!hazir) return <div className="h-40 animate-pulse rounded-2xl bg-muted" />

  return (
    <div>
      <h1 className="mb-4 font-display text-xl font-extrabold">Okul Notları</h1>

      <Kart className="mb-5 overflow-hidden rounded-[24px] p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-extrabold tracking-wide text-muted-foreground">
            ORTAÖĞRETİM BAŞARI PUANI
          </p>
          <span className="shrink-0 rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
            {elleGirildi ? 'Elle girildi' : obp?.tamMi ? 'Tamamlandı' : 'Tahmini'}
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="rakam font-display text-5xl font-extrabold tracking-tight text-primary">
            {obp ? netYaz(obp.obp, obp.obp % 1 === 0 ? 0 : 2) : '—'}
          </p>
          <span className="text-sm font-bold text-muted-foreground">/ 500</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Diploma notu</p>
            <p className="rakam mt-1 text-lg font-extrabold">
              {obp ? netYaz(obp.diplomaNotu) : '—'}
              <span className="ml-1 text-xs font-medium text-muted-foreground">/ 100</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Kaydedilen yıl</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="rakam text-lg font-extrabold">{yillar.length}/{ORTAOGRETIM_YIL_SAYISI}</p>
              <div className="flex flex-1 gap-1" aria-hidden>
                {Array.from({ length: ORTAOGRETIM_YIL_SAYISI }, (_, i) => (
                  <span key={i} className={cn('h-1.5 flex-1 rounded-full', yilBul(ILK_SINIF + i) ? 'bg-primary-parlak' : 'bg-muted')} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Kart>

      {/* Doğrudan OBP yalnızca mezuna soruluyor: okuyan öğrencinin OBP'si zaten
          kesinleşmemiş oluyor, oraya bir sayı yazdırmak yanlış bir kesinlik
          duygusu verirdi. Mezun ise puanını ÖSYM'den biliyor ve nakil, sınıf
          tekrarı gibi durumlarda o sayı okul ortalamalarından ayrışabiliyor. */}
      {mezun && (
        <ElleObpKarti
          deger={ayarlar.elleObp}
          onDegis={(yeni) => setAyarlar((onceki) => ({ ...onceki, elleObp: yeni }))}
        />
      )}

      <h2 className="mb-3 font-display text-base font-extrabold">Yıl ortalamalarım</h2>
      <div className="golge-kart overflow-hidden rounded-[20px] bg-card px-4">
        <ul className="divide-y divide-border">
          {SINIFLAR.map((sinif) => (
            <li key={sinif}>
              <YilSatiri
                sinif={sinif}
                yil={yilBul(sinif)}
                kilitli={sinif > ayarlar.buYilSinif}
                onDegis={(metin) => notuYaz(sinif, metin)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function YilSatiri({
  sinif,
  yil,
  kilitli,
  onDegis,
}: {
  sinif: number
  yil: OkulYili | undefined
  kilitli: boolean
  onDegis: (metin: string) => void
}) {
  // Yazarken serbest bırakmak için yerel metin; boş bırakılabilsin diye
  // doğrudan sayıya bağlanmıyor ("9" yazarken 9'a kırpılmasın).
  const [metin, setMetin] = useState(yil ? String(yil.ortalama) : '')

  const dolu = metin.trim() !== ''

  return (
    <div className="flex items-center gap-2 py-4">
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-extrabold', kilitli && 'text-muted-foreground')}>{sinif}. sınıf</p>
        <p className={cn('mt-1 flex items-center gap-1 text-[11px]', !kilitli && yil ? 'text-success' : 'text-muted-foreground')}>
          {!kilitli && yil && <Check size={12} aria-hidden />}
          {kilitli ? 'Sınıfına geçince açılır' : yil ? 'Kaydedildi' : 'Not eklenmedi'}
        </p>
      </div>

      <div className="order-last relative w-25 shrink-0">
        <Alan
          inputMode="decimal"
          value={kilitli ? '' : metin}
          disabled={kilitli}
          onChange={(e) => {
            const temiz = e.target.value.replace(/[^0-9,.]/g, '').slice(0, 6)
            setMetin(temiz)
            onDegis(temiz)
          }}
          placeholder={kilitli ? '' : '0–100'}
          aria-label={`${sinif}. sınıf yıl sonu notu${kilitli ? ' (kilitli)' : ''}`}
          className={cn(
            'rakam h-12 w-full rounded-[12px] border-transparent bg-muted/60 text-center text-lg font-extrabold placeholder:text-lg placeholder:font-extrabold focus:placeholder:text-transparent',
            kilitli && 'text-muted-foreground disabled:cursor-not-allowed disabled:opacity-100',
          )}
        />
        {kilitli && (
          <LockKeyhole
            size={17}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/70"
            aria-hidden
          />
        )}
      </div>

      <div className="flex w-9 shrink-0 items-center justify-center">
        {!kilitli && dolu && (
          <button
            type="button"
            onClick={() => {
              setMetin('')
              onDegis('')
            }}
            aria-label={`${sinif}. sınıf notunu sil`}
            className="flex h-11 w-9 items-center justify-center rounded-xl text-muted-foreground active:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Trash2 size={16} aria-hidden />
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Doğrudan OBP girişi (yalnız mezun).
 *
 * Yıl notlarını silmiyor, yalnızca önüne geçiyor: kullanıcı buradaki sayıyı
 * temizlediğinde notlarından hesaplanan tahmine geri dönülüyor. Alt sınır 250,
 * üst sınır 500 — ÖSYM'nin OBP aralığı; arada olmayan bir sayı yazılırsa
 * kırpılıyor ve bu ekranda söyleniyor.
 */
function ElleObpKarti({
  deger,
  onDegis,
}: {
  deger: number | null
  onDegis: (yeni: number | null) => void
}) {
  const [metin, setMetin] = useState(deger === null ? '' : String(deger))

  const yaz = (ham: string) => {
    const temiz = ham.replace(',', '.').replace(/[^0-9.]/g, '').slice(0, 6)
    setMetin(temiz)
    if (temiz === '') {
      onDegis(null)
      return
    }
    const sayi = Number(temiz)
    if (Number.isFinite(sayi)) onDegis(sayi)
  }

  const sayi = Number(metin)
  const aralikDisi = metin !== '' && Number.isFinite(sayi) && (sayi < 250 || sayi > 500)

  return (
    <Kart className="mb-5 rounded-[20px]">
      <div>
        <label htmlFor="okul-elle-obp" className="text-sm font-extrabold">OBP’ni biliyor musun?</label>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Mezunsan puanını doğrudan girebilirsin.
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Alan
          id="okul-elle-obp"
          inputMode="decimal"
          value={metin}
          onChange={(e) => yaz(e.target.value)}
          placeholder="250–500 arası OBP"
          aria-label="Elle girilen OBP"
          className="rakam h-12 flex-1 border-transparent bg-muted/60 text-lg font-extrabold placeholder:text-sm placeholder:font-medium focus:placeholder:text-transparent"
        />

        {metin !== '' && (
          <button
            type="button"
            onClick={() => yaz('')}
            aria-label="Girdiğin OBP'yi sil"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground active:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Trash2 size={16} aria-hidden />
          </button>
        )}
      </div>

      {aralikDisi && (
        <Not className="mt-3">OBP 250 ile 500 arasında olur; girdiğin sayı bu aralığa çekildi.</Not>
      )}
    </Kart>
  )
}
