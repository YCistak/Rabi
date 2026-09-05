'use client'

import { useEffect, useMemo, useState } from 'react'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { BaslikSatiri, BosDurum, Cip, Deger, Kart } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { TrendGrafigi } from '@/components/trend-grafigi'
import { dersIstatistikleri, denemeOzeti, netYaz, trendSerisi, yuvarla } from '@/lib/hesap'
import { toplamSoru } from '@/lib/sablonlar'
import { cn } from '@/lib/utils'
import type { Deneme, Sablon } from '@/lib/types'

/** Yatay bar: taban kare, dış uç 4px yuvarlak. */
function barYolu(genislik: number, yukseklik: number) {
  const r = Math.min(4, genislik)
  if (genislik <= 0) return ''
  return `M0,0 H${genislik - r} Q${genislik},0 ${genislik},${r} V${yukseklik - r} Q${genislik},${yukseklik} ${genislik - r},${yukseklik} H0 Z`
}

export function IstatistikEkrani({
  denemeler,
  sablonlar,
  varsayilanSablonId,
}: {
  denemeler: Deneme[]
  sablonlar: Sablon[]
  varsayilanSablonId: string
}) {
  // Farklı türdeki denemeler karışmasın diye istatistik tek şablon üzerinden okunur
  const doluSablonIdler = useMemo(
    () => new Set(denemeler.map((d) => d.sablonId)),
    [denemeler],
  )
  const secilebilir = sablonlar.filter((s) => doluSablonIdler.has(s.id))
  const [sablonId, setSablonId] = useState(varsayilanSablonId)

  useEffect(() => {
    if (secilebilir.length > 0 && !secilebilir.some((s) => s.id === sablonId)) {
      setSablonId(secilebilir[0].id)
    }
  }, [secilebilir, sablonId])

  const sablon = secilebilir.find((s) => s.id === sablonId) ?? secilebilir[0]
  const sablonDenemeleri = useMemo(
    () => (sablon ? denemeler.filter((d) => d.sablonId === sablon.id) : []),
    [denemeler, sablon],
  )

  const veri = useMemo(() => {
    if (!sablon || sablonDenemeleri.length === 0) return null

    const seri = trendSerisi(sablonDenemeleri, sablon)
    const netler = seri.map((n) => n.toplamNet)
    const dersler = dersIstatistikleri(sablonDenemeleri, sablon)
    const siraliDersler = [...dersler].sort((a, b) => b.yuzde - a.yuzde)
    const sonDeneme = sablonDenemeleri.reduce((a, b) => (a.tarih > b.tarih ? a : b))

    return {
      seri,
      dersler,
      enGuclu: siraliDersler.slice(0, 3),
      /*
        Tamamını doğru yaptığın ders zayıf ders değil.

        Liste yalnızca sıralamanın sonundan üç ders alıyordu; bütün dersleri
        full yapan denemede en güçlü üçü aynı anda "en güçsüz" olarak da
        yazılıyordu. %100'ler eleniyor, geriye bir şey kalmazsa kart onu
        söylüyor.
      */
      enZayif: siraliDersler
        .filter((d) => d.yuzde < 100)
        .slice(-3)
        .reverse(),
      ortalama: yuvarla(netler.reduce((a, b) => a + b, 0) / netler.length),
      enYuksek: Math.max(...netler),
      sonNet: denemeOzeti(sonDeneme, sablon).toplamNet,
    }
  }, [sablon, sablonDenemeleri])

  if (!sablon || !veri) {
    return (
      <div>
        <BaslikSatiri baslik="İstatistik" />
        <BosDurum
          simge={<Rabi durum="uykulu" boyut={96} />}
          baslik="Henüz veri yok"
          aciklama="Deneme ekledikçe ortalaman, hangi derste yükselip düştüğün ve net grafiğin burada oluşur."
        />
      </div>
    )
  }

  return (
    <div>
      <BaslikSatiri
        baslik="İstatistik"
        aciklama={`${sablon.ad} · ${sablonDenemeleri.length} deneme`}
      />

      {/* Her deneme türü kendi içinde hesaplanır: TYT ile seviye tespit sınavının
          soru sayısı farklı olduğu için netleri aynı ortalamaya girmez. */}
      {secilebilir.length > 1 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {secilebilir.map((s) => (
              <Cip key={s.id} secili={s.id === sablon.id} onClick={() => setSablonId(s.id)}>
                {s.ad}
                <span className="rakam ml-1 opacity-70">
                  {denemeler.filter((d) => d.sablonId === s.id).length}
                </span>
              </Cip>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Her deneme türünün istatistiği ayrı tutulur; TYT netleriyle seviye tespit sınavı
            netleri birbirine karışmaz.
          </p>
        </div>
      )}

      <div className="mb-3 grid grid-cols-3 gap-2">
        <Deger etiket="Ortalama" deger={netYaz(veri.ortalama)} vurgu />
        <Deger etiket="En yüksek" deger={netYaz(veri.enYuksek)} />
        <Deger
          etiket="Son deneme"
          deger={netYaz(veri.sonNet)}
          altNot={
            veri.sonNet === veri.ortalama
              ? 'ortalamada'
              : veri.sonNet > veri.ortalama
                ? `ortalamanın ${netYaz(yuvarla(veri.sonNet - veri.ortalama))} üstü`
                : `ortalamanın ${netYaz(yuvarla(veri.ortalama - veri.sonNet))} altı`
          }
        />
      </div>

      <Kart className="mb-3">
        <p className="mb-1 font-medium">Toplam net gidişatı</p>
        <p className="mb-2 text-xs text-muted-foreground">
          {toplamSoru(sablon)} soruluk {sablon.ad} denemeleri. Bir noktaya dokunursan o
          denemenin tarihini ve netini gösterir.
        </p>
        <TrendGrafigi seri={veri.seri} />
      </Kart>

      <Kart className="mb-3">
        <p className="mb-3 font-medium">Ders bazlı ortalama</p>

        <ul className="space-y-3">
          {veri.dersler.map((istatistik) => {
            const oran = Math.max(0, Math.min(100, istatistik.yuzde)) / 100
            return (
              <li key={istatistik.ders.id}>
                <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                  <span className="truncate font-medium">{istatistik.ders.ad}</span>
                  <span className="shrink-0 rakam text-muted-foreground">
                    <span className="font-display font-semibold text-foreground">
                      {netYaz(istatistik.ortalama)}
                    </span>
                    {' / '}
                    {istatistik.ders.soruSayisi}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                    className="h-2 flex-1"
                    aria-hidden
                  >
                    <rect x={0} y={0} width={100} height={8} rx={4} fill="var(--muted)" />
                    <path d={barYolu(oran * 100, 8)} fill="var(--primary)" />
                  </svg>

                  <span
                    className={cn(
                      'flex w-14 shrink-0 items-center justify-end gap-0.5 text-xs font-medium rakam',
                      istatistik.fark > 0.05
                        ? 'text-success'
                        : istatistik.fark < -0.05
                          ? 'text-danger'
                          : 'text-muted-foreground',
                    )}
                    title="Son 3 denemenin ortalamadan farkı"
                  >
                    {istatistik.fark > 0.05 ? (
                      <TrendingUp size={12} />
                    ) : istatistik.fark < -0.05 ? (
                      <TrendingDown size={12} />
                    ) : (
                      <Minus size={12} />
                    )}
                    {istatistik.fark > 0 ? '+' : istatistik.fark < 0 ? '−' : ''}
                    {netYaz(Math.abs(istatistik.fark), 1)}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </Kart>

      <div className="grid grid-cols-2 gap-3">
        <Kart>
          <p className="mb-2 text-sm font-medium text-success">En güçlü dersler</p>
          <ol className="space-y-1.5 text-sm">
            {veri.enGuclu.map((d) => (
              <li key={d.ders.id} className="flex justify-between gap-2">
                <span className="truncate">{d.ders.ad}</span>
                <span className="shrink-0 rakam text-muted-foreground">%{d.yuzde}</span>
              </li>
            ))}
          </ol>
        </Kart>

        <Kart>
          <p className="mb-2 text-sm font-medium text-danger">En güçsüz dersler</p>
          {veri.enZayif.length > 0 ? (
            <ol className="space-y-1.5 text-sm">
              {veri.enZayif.map((d) => (
                <li key={d.ders.id} className="flex justify-between gap-2">
                  <span className="truncate">{d.ders.ad}</span>
                  <span className="shrink-0 rakam text-muted-foreground">%{d.yuzde}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">Hepsi tam — zayıf dersin yok.</p>
          )}
        </Kart>
      </div>
    </div>
  )
}
