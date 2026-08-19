'use client'

import { useMemo, useState } from 'react'
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Pencil,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { BaslikSatiri, BosDurum, Buton, Cip, Kart, Onay } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { netYaz, tarihYaz } from '@/lib/hesap'
import {
  denemeSatirlari,
  mevcutTurler,
  suzVeSirala,
  SIRALAMA_ADLARI,
  SIRALAMA_SIRASI,
  TUR_ADLARI,
  type DenemeSatiri,
  type DenemeSiralamasi,
  type DenemeSuzgeci,
} from '@/lib/deneme-liste'
import { cn } from '@/lib/utils'
import type { Deneme, Sablon, SablonTuru } from '@/lib/types'

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
  const [suzgec, setSuzgec] = useState<DenemeSuzgeci>('hepsi')
  const [sira, setSira] = useState<DenemeSiralamasi>('yeni')

  // Değişim tarih sırasına göre çıkar; süzme ve sıralama bunun üstüne uygulanır.
  const satirlar = useMemo(() => denemeSatirlari(denemeler, sablonlar), [denemeler, sablonlar])
  const turler = useMemo(() => mevcutTurler(satirlar), [satirlar])
  const kartlar = useMemo(() => suzVeSirala(satirlar, suzgec, sira), [satirlar, suzgec, sira])

  // Kayıtlı tek tür varsa çipler seçim sunmuyor; boş yere yer kaplamasın.
  const suzgecGorunsun = turler.length > 1

  if (!hazir) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />
  }

  return (
    <div>
      <BaslikSatiri
        ortala
        baslik="Denemeler"
        aciklama={
          denemeler.length > 0
            ? `${denemeler.length} deneme kayıtlı · ${SIRALAMA_ADLARI[sira].toLocaleLowerCase('tr-TR')}`
            : 'Henüz deneme eklemedin'
        }
        sag={
          <Buton boy="simge" onClick={onYeniyeGit} aria-label="Deneme ekle" className="rounded-full">
            <Plus size={20} />
          </Buton>
        }
      />

      {satirlar.length > 0 && (
        <SuzgecCubugu
          turler={turler}
          turlerGorunsun={suzgecGorunsun}
          suzgec={suzgec}
          sira={sira}
          sayilar={satirlar}
          onSuzgec={setSuzgec}
          onSira={setSira}
        />
      )}

      {suzgec !== 'hepsi' && satirlar.length > 0 && kartlar.length === 0 ? (
        <BosDurum
          simge={<Rabi durum="normal" boyut={96} />}
          baslik="Bu türde deneme yok"
          aciklama={`${TUR_ADLARI[suzgec]} denemesi kaydetmemişsin. Süzgeci kaldırıp hepsine bakabilirsin.`}
          eylem={<Buton onClick={() => setSuzgec('hepsi')}>Tümünü göster</Buton>}
        />
      ) : kartlar.length === 0 ? (
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

/**
 * Liste başındaki süzgeç ve sıralama çubuğu.
 *
 * Süzgeç çip olarak duruyor (tek dokunuş, hep görünür), sıralama ise açılır bir
 * listede: dört seçeneğin dördü de çip olsaydı satır iki kat yer kaplar ve
 * hangisinin açık olduğu kalabalıkta kaybolurdu.
 */
function SuzgecCubugu({
  turler,
  turlerGorunsun,
  suzgec,
  sira,
  sayilar,
  onSuzgec,
  onSira,
}: {
  turler: SablonTuru[]
  turlerGorunsun: boolean
  suzgec: DenemeSuzgeci
  sira: DenemeSiralamasi
  /** Çiplerin yanındaki sayıyı çıkarmak için tüm satırlar. */
  sayilar: DenemeSatiri[]
  onSuzgec: (suzgec: DenemeSuzgeci) => void
  onSira: (sira: DenemeSiralamasi) => void
}) {
  const [menuAcik, setMenuAcik] = useState(false)

  return (
    <div className="mb-3 space-y-2">
      {turlerGorunsun && (
        // Tür sayısı arttıkça çipler taşabilir; alt alta sarmak yerine yatay
        // kaydırma tercih edildi — sıralama düğmesi hep aynı hizada kalsın.
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
          <Cip secili={suzgec === 'hepsi'} onClick={() => onSuzgec('hepsi')} className="shrink-0">
            Tümü
            <span className="rakam ml-1 opacity-70">{sayilar.length}</span>
          </Cip>
          {turler.map((tur) => (
            <Cip
              key={tur}
              secili={suzgec === tur}
              onClick={() => onSuzgec(tur)}
              className="shrink-0"
            >
              {TUR_ADLARI[tur]}
              <span className="rakam ml-1 opacity-70">
                {sayilar.filter((s) => s.sablon?.tur === tur).length}
              </span>
            </Cip>
          ))}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuAcik((a) => !a)}
          aria-expanded={menuAcik}
          className={cn(
            'flex w-full items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-left text-sm font-bold transition',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-muted',
          )}
        >
          <ArrowUpDown size={16} className="shrink-0 text-muted-foreground" aria-hidden />
          <span className="min-w-0 flex-1 truncate">{SIRALAMA_ADLARI[sira]}</span>
          <ChevronDown
            size={16}
            aria-hidden
            className={cn('shrink-0 text-muted-foreground transition-transform', menuAcik && 'rotate-180')}
          />
        </button>

        {menuAcik && (
          <>
            {/* Dışarı dokunuş menüyü kapatsın; mobilde "başka yere bas" beklenen davranış. */}
            <button
              type="button"
              aria-hidden
              tabIndex={-1}
              onClick={() => setMenuAcik(false)}
              className="fixed inset-0 z-20 cursor-default"
            />
            <ul className="absolute inset-x-0 top-[calc(100%+4px)] z-30 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg">
              {SIRALAMA_SIRASI.map((secenek) => (
                <li key={secenek}>
                  <button
                    type="button"
                    onClick={() => {
                      onSira(secenek)
                      setMenuAcik(false)
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm active:bg-muted',
                      secenek === sira ? 'font-bold text-primary' : 'font-medium',
                    )}
                  >
                    <Check
                      size={16}
                      aria-hidden
                      className={cn('shrink-0', secenek === sira ? 'opacity-100' : 'opacity-0')}
                    />
                    {SIRALAMA_ADLARI[secenek]}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
