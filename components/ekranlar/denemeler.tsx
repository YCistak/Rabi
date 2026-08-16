'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Pencil, Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import { BaslikSatiri, BosDurum, Buton, Kart, Onay } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { denemeOzeti, netYaz, tarihSirala, tarihYaz, yuvarla } from '@/lib/hesap'
import { cn } from '@/lib/utils'
import type { Deneme, Sablon } from '@/lib/types'

export function DenemelerEkrani({
  denemeler,
  sablonlar,
  hazir,
  onSil,
  onDuzenle,
  onYeniyeGit,
}: {
  denemeler: Deneme[]
  sablonlar: Sablon[]
  hazir: boolean
  onSil: (id: string) => void
  onDuzenle: (deneme: Deneme) => void
  onYeniyeGit: () => void
}) {
  const [acikId, setAcikId] = useState<string | null>(null)
  const [silinecek, setSilinecek] = useState<Deneme | null>(null)

  const kartlar = useMemo(() => {
    // Değişim, aynı türdeki bir önceki denemeye göre hesaplanır
    const sonNetler = new Map<string, number>()
    const sirali = tarihSirala(denemeler).map((deneme) => {
      const sablon = sablonlar.find((s) => s.id === deneme.sablonId)
      if (!sablon) return { deneme, sablon: null, ozet: null, degisim: null }

      const ozet = denemeOzeti(deneme, sablon)
      const onceki = sonNetler.get(deneme.sablonId)
      sonNetler.set(deneme.sablonId, ozet.toplamNet)

      return {
        deneme,
        sablon,
        ozet,
        degisim: onceki === undefined ? null : yuvarla(ozet.toplamNet - onceki),
      }
    })

    return sirali.reverse() // en yeni üstte
  }, [denemeler, sablonlar])

  if (!hazir) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />
  }

  return (
    <div>
      <BaslikSatiri
        baslik="Denemeler"
        aciklama={
          denemeler.length > 0
            ? `${denemeler.length} deneme kayıtlı · en yenisi üstte`
            : 'Henüz deneme eklemedin'
        }
        sag={
          <Buton boy="kucuk" onClick={onYeniyeGit}>
            <Plus size={16} />
            Deneme
          </Buton>
        }
      />

      {kartlar.length === 0 ? (
        <BosDurum
          simge={<Rabi durum="uykulu" boyut={96} />}
          baslik="Kayıtlı deneme yok"
          aciklama="İlk denemeni ekle. Girdiğin doğru ve yanlışlardan netini hesaplar, sonrakilerle karşılaştırır."
          eylem={
            <Buton onClick={onYeniyeGit}>
              <Plus size={18} />
              Deneme ekle
            </Buton>
          }
        />
      ) : (
        <ul className="space-y-3">
          {kartlar.map(({ deneme, sablon, ozet, degisim }) => {
            const acik = acikId === deneme.id

            return (
              <li key={deneme.id}>
                <Kart className="p-0">
                  <button
                    type="button"
                    onClick={() => setAcikId(acik ? null : deneme.id)}
                    className="flex w-full items-center gap-3 p-4 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{deneme.ad}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {tarihYaz(deneme.tarih)}
                        {sablon ? ` · ${sablon.ad}` : ' · şablon silinmiş'}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-display text-xl font-semibold">
                        {ozet ? netYaz(ozet.toplamNet) : '—'}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          net
                        </span>
                      </p>
                      {degisim !== null && degisim !== 0 && (
                        <p
                          className={cn(
                            'flex items-center justify-end gap-0.5 text-xs font-medium',
                            degisim > 0 ? 'text-success' : 'text-danger',
                          )}
                        >
                          {degisim > 0 ? (
                            <TrendingUp size={13} />
                          ) : (
                            <TrendingDown size={13} />
                          )}
                          {degisim > 0 ? '+' : '−'}
                          {netYaz(Math.abs(degisim))}
                        </p>
                      )}
                    </div>

                    <ChevronDown
                      size={18}
                      className={cn(
                        'shrink-0 text-muted-foreground transition-transform',
                        acik && 'rotate-180',
                      )}
                    />
                  </button>

                  {acik && ozet && sablon && (
                    <div className="border-t border-border px-4 py-3">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-muted-foreground">
                            <th className="pb-1.5 text-left font-medium">Ders</th>
                            <th className="pb-1.5 text-right font-medium">D</th>
                            <th className="pb-1.5 text-right font-medium">Y</th>
                            <th className="pb-1.5 text-right font-medium">Boş</th>
                            <th className="pb-1.5 text-right font-medium">Net</th>
                          </tr>
                        </thead>
                        <tbody className="rakam">
                          {sablon.dersler.map((ders) => {
                            const sonuc = deneme.sonuclar.find((s) => s.dersId === ders.id)
                            const dogru = sonuc?.dogru ?? 0
                            const yanlis = sonuc?.yanlis ?? 0
                            return (
                              <tr key={ders.id} className="border-t border-border/60">
                                <td className="py-1.5 pr-2 text-left">{ders.ad}</td>
                                <td className="py-1.5 text-right">{dogru}</td>
                                <td className="py-1.5 text-right">{yanlis}</td>
                                <td className="py-1.5 text-right text-muted-foreground">
                                  {ders.soruSayisi - dogru - yanlis}
                                </td>
                                <td className="py-1.5 text-right font-medium">
                                  {netYaz(ozet.dersNetleri[ders.id] ?? 0)}
                                </td>
                              </tr>
                            )
                          })}
                          <tr className="border-t border-border font-semibold">
                            <td className="py-1.5 text-left">Toplam</td>
                            <td className="py-1.5 text-right">{ozet.toplamDogru}</td>
                            <td className="py-1.5 text-right">{ozet.toplamYanlis}</td>
                            <td className="py-1.5 text-right">{ozet.toplamBos}</td>
                            <td className="py-1.5 text-right">{netYaz(ozet.toplamNet)}</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="mt-3 flex gap-2">
                        <Buton
                          bicim="ikincil"
                          boy="kucuk"
                          className="flex-1"
                          onClick={() => onDuzenle(deneme)}
                        >
                          <Pencil size={15} />
                          Düzenle
                        </Buton>
                        <Buton
                          bicim="tehlike"
                          boy="kucuk"
                          className="flex-1"
                          onClick={() => setSilinecek(deneme)}
                        >
                          <Trash2 size={15} />
                          Sil
                        </Buton>
                      </div>
                    </div>
                  )}
                </Kart>
              </li>
            )
          })}
        </ul>
      )}

      <Onay
        acik={silinecek !== null}
        baslik="Deneme silinsin mi?"
        aciklama={`"${silinecek?.ad}" kaydı ve netleri kalıcı olarak silinecek.`}
        onOnayla={() => silinecek && onSil(silinecek.id)}
        onIptal={() => setSilinecek(null)}
      />
    </div>
  )
}
