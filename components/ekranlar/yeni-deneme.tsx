'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Check, X } from 'lucide-react'
import { Alan, Buton, Cip, Etiket, Kart } from '@/components/ui'
import { katsayiYaz, net, netYaz, sonucGecerliMi, yuvarla } from '@/lib/hesap'
import { toplamSoru } from '@/lib/sablonlar'
import { bugun, cn, yeniId } from '@/lib/utils'
import type { Deneme, Sablon } from '@/lib/types'

type Giris = { dogru: string; yanlis: string }

function bosGirisler(sablon: Sablon): Record<string, Giris> {
  return Object.fromEntries(sablon.dersler.map((d) => [d.id, { dogru: '', yanlis: '' }]))
}

function sayi(metin: string): number {
  const deger = Number.parseInt(metin, 10)
  return Number.isFinite(deger) && deger > 0 ? deger : 0
}

export function YeniDenemeEkrani({
  sablonlar,
  varsayilanSablonId,
  duzenlenen,
  denemeSayisi,
  onKaydet,
  onVazgec,
}: {
  sablonlar: Sablon[]
  varsayilanSablonId: string
  duzenlenen: Deneme | null
  denemeSayisi: number
  onKaydet: (deneme: Deneme) => void
  onVazgec: () => void
}) {
  const ilkSablon =
    sablonlar.find((s) => s.id === (duzenlenen?.sablonId ?? varsayilanSablonId)) ??
    sablonlar[0]

  const [sablonId, setSablonId] = useState(ilkSablon.id)
  const [tarih, setTarih] = useState(duzenlenen?.tarih ?? bugun())
  const [ad, setAd] = useState(duzenlenen?.ad ?? '')
  const [girisler, setGirisler] = useState<Record<string, Giris>>(() => {
    if (!duzenlenen) return bosGirisler(ilkSablon)
    return Object.fromEntries(
      ilkSablon.dersler.map((d) => {
        const sonuc = duzenlenen.sonuclar.find((s) => s.dersId === d.id)
        return [
          d.id,
          {
            dogru: sonuc ? String(sonuc.dogru) : '',
            yanlis: sonuc ? String(sonuc.yanlis) : '',
          },
        ]
      }),
    )
  })

  const sablon = sablonlar.find((s) => s.id === sablonId) ?? sablonlar[0]

  // Şablon değişince ders listesi değişir, girişler sıfırlanır
  useEffect(() => {
    if (duzenlenen) return
    setGirisler(bosGirisler(sablon))
  }, [sablon, duzenlenen])

  const satirlar = useMemo(
    () =>
      sablon.dersler.map((ders) => {
        const giris = girisler[ders.id] ?? { dogru: '', yanlis: '' }
        const dogru = sayi(giris.dogru)
        const yanlis = sayi(giris.yanlis)
        // Doğrulama tek yerden: hesap.ts. Ekranda ayrıca kural yazılmıyor ki
        // ikisi zamanla birbirinden ayrışmasın.
        const asim = !sonucGecerliMi({ dersId: ders.id, dogru, yanlis }, ders)
        return {
          ders,
          dogru,
          yanlis,
          bos: Math.max(0, ders.soruSayisi - dogru - yanlis),
          net: net(dogru, yanlis, sablon.yanlisKatsayi),
          asim,
        }
      }),
    [sablon, girisler],
  )

  const toplamNet = yuvarla(satirlar.reduce((acc, s) => acc + (s.asim ? 0 : s.net), 0))
  const hataliDers = satirlar.find((s) => s.asim)
  const bosMu = satirlar.every((s) => s.dogru === 0 && s.yanlis === 0)

  const girisDegistir = (dersId: string, alan: keyof Giris, deger: string) => {
    const temiz = deger.replace(/[^0-9]/g, '').slice(0, 3)
    setGirisler((onceki) => ({
      ...onceki,
      [dersId]: { ...(onceki[dersId] ?? { dogru: '', yanlis: '' }), [alan]: temiz },
    }))
  }

  const kaydet = () => {
    if (hataliDers || bosMu) return
    onKaydet({
      id: duzenlenen?.id ?? yeniId(),
      sablonId: sablon.id,
      ad: ad.trim() || `${sablon.ad} ${denemeSayisi + 1}`,
      tarih,
      sonuclar: satirlar.map((s) => ({
        dersId: s.ders.id,
        dogru: s.dogru,
        yanlis: s.yanlis,
      })),
    })
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {duzenlenen ? 'Denemeyi Düzenle' : 'Yeni Deneme'}
        </h1>
        <Buton bicim="hayalet" boy="simge" onClick={onVazgec} aria-label="Vazgeç">
          <X size={20} />
        </Buton>
      </div>

      {/* Toplam net — girişler değiştikçe canlı güncellenir */}
      <div className="sticky top-0 z-30 -mx-4 mb-4 border-b border-border bg-background/95 px-4 pb-3 backdrop-blur">
        <div className="flex items-baseline justify-between rounded-xl bg-primary-soft px-4 py-3">
          <span className="text-sm font-medium text-muted-foreground">Toplam net</span>
          <span className="font-display text-3xl font-semibold text-primary">
            {netYaz(toplamNet)}
          </span>
        </div>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          {sablon.ad} · {toplamSoru(sablon)} soru · {katsayiYaz(sablon.yanlisKatsayi)}
        </p>
      </div>

      {!duzenlenen && (
        <div className="mb-4">
          <Etiket>Deneme türü</Etiket>
          <div className="flex flex-wrap gap-2">
            {sablonlar.map((s) => (
              <Cip key={s.id} secili={s.id === sablonId} onClick={() => setSablonId(s.id)}>
                {s.ad}
              </Cip>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <Etiket htmlFor="deneme-ad">Deneme adı</Etiket>
          <Alan
            id="deneme-ad"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            placeholder={`${sablon.ad} ${denemeSayisi + 1}`}
          />
        </div>
        <div>
          <Etiket htmlFor="deneme-tarih">Tarih</Etiket>
          <Alan
            id="deneme-tarih"
            type="date"
            value={tarih}
            onChange={(e) => setTarih(e.target.value)}
          />
        </div>
      </div>

      <Kart className="p-0">
        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
          <span>Ders</span>
          <span className="w-14 text-center">Doğru</span>
          <span className="w-14 text-center">Yanlış</span>
          <span className="w-14 text-right">Net</span>
        </div>

        <ul>
          {satirlar.map((satir) => (
            <li
              key={satir.ders.id}
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 border-b border-border px-3 py-2 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{satir.ders.ad}</p>
                <p className="text-xs text-muted-foreground">
                  {satir.ders.soruSayisi} soru · {satir.bos} boş
                </p>
              </div>

              <Alan
                inputMode="numeric"
                aria-label={`${satir.ders.ad} doğru sayısı`}
                value={girisler[satir.ders.id]?.dogru ?? ''}
                onChange={(e) => girisDegistir(satir.ders.id, 'dogru', e.target.value)}
                className={cn(
                  'h-10 w-14 px-0 text-center rakam',
                  satir.asim && 'border-danger text-danger',
                )}
              />
              <Alan
                inputMode="numeric"
                aria-label={`${satir.ders.ad} yanlış sayısı`}
                value={girisler[satir.ders.id]?.yanlis ?? ''}
                onChange={(e) => girisDegistir(satir.ders.id, 'yanlis', e.target.value)}
                className={cn(
                  'h-10 w-14 px-0 text-center rakam',
                  satir.asim && 'border-danger text-danger',
                )}
              />

              <span
                className={cn(
                  'w-14 text-right font-display text-[15px] font-semibold rakam',
                  satir.asim && 'text-danger',
                )}
              >
                {satir.asim ? '—' : netYaz(satir.net)}
              </span>
            </li>
          ))}
        </ul>
      </Kart>

      {hataliDers && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            <strong>{hataliDers.ders.ad}</strong>: doğru + yanlış toplamı{' '}
            {hataliDers.ders.soruSayisi} soruyu aşıyor.
          </span>
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <Buton bicim="ikincil" className="flex-1" onClick={onVazgec}>
          Vazgeç
        </Buton>
        <Buton className="flex-1" onClick={kaydet} disabled={!!hataliDers || bosMu}>
          <Check size={18} />
          Kaydet
        </Buton>
      </div>
      {bosMu && !hataliDers && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Kaydetmek için en az bir derse sonuç gir.
        </p>
      )}
    </div>
  )
}
