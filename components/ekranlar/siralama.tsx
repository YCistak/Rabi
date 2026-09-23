'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Info } from 'lucide-react'
import type { Ayarlar, Deneme, OkulYili, Sablon } from '@/lib/types'
import { netYaz, tarihYaz } from '@/lib/hesap'
import { bantYaz, siraYaz } from '@/lib/siralama'
import { aytAdaylari, enYeni, obpHesapla, tahminUret, tytAdaylari } from '@/lib/tahmin'
import { Kart, Not } from '@/components/ui'

export function SiralamaEkrani({
  denemeler,
  sablonlar,
  okulYillari,
  ayarlar,
}: {
  denemeler: Deneme[]
  sablonlar: Sablon[]
  okulYillari: OkulYili[]
  ayarlar: Ayarlar
}) {
  const tur = ayarlar.puanTuru

  // TYT ve AYT ayrı denemelerden geliyor; seviye tespit sınavı ikisini de kapsadığı
  // için her iki listede de görünür.
  const tytListesi = useMemo(() => tytAdaylari(denemeler, sablonlar), [denemeler, sablonlar])
  const aytListesi = useMemo(() => aytAdaylari(denemeler, sablonlar), [denemeler, sablonlar])

  const [tytId, setTytId] = useState<string>(() => enYeni(tytListesi)?.id ?? '')
  const [aytId, setAytId] = useState<string>(() => enYeni(aytListesi)?.id ?? '')

  const obpSonucu = useMemo(
    () => obpHesapla(okulYillari, ayarlar.elleObp),
    [okulYillari, ayarlar.elleObp],
  )

  const tahmin = useMemo(
    () =>
      tur === null
        ? null
        : tahminUret({
            tytDenemesi: denemeler.find((d) => d.id === tytId),
            aytDenemesi: denemeler.find((d) => d.id === aytId),
            sablonlar,
            tur,
            obp: obpSonucu?.obp ?? null,
          }),
    [denemeler, tytId, aytId, sablonlar, tur, obpSonucu],
  )

  /*
    Alan seçilmemişse hesap yapılmıyor. Puan katsayıları da yerleştirme
    dağılımı da türe bağlı; bir tür varsayıp sayı göstermek, kullanıcının hiç
    söylemediği bir alana göre hesaplanmış bir sıralama göstermek olurdu.
    Boş durum kullanıcıyı ayarlara yollamakla yetiniyor: buradan seçtirmek,
    aynı ayarın iki ayrı yerde durması demekti.
  */
  if (tur === null) {
    return (
      <div>
        <h1 className="mb-4 font-display text-xl font-extrabold">Sıralama</h1>
        <Kart className="rounded-[24px] p-5">
          <h2 className="font-display text-lg font-extrabold">Önce alanını seç</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Sıralama tahmini alanına göre hesaplanıyor. Ayarlar › Alanım'dan seçtiğinde
            sonuçlarını burada görebilirsin.
          </p>
        </Kart>
      </div>
    )
  }

  if (denemeler.length === 0) {
    return (
      <div>
        <h1 className="mb-4 font-display text-xl font-extrabold">Sıralama</h1>
        <Kart className="rounded-[24px] p-5">
          <h2 className="font-display text-lg font-extrabold">Önce deneme ekle</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Sıralama tahmini için TYT ve {tur === 'dil' ? 'YDT' : 'AYT'} denemeleri gerekiyor.
            Denemeler bölümünden eklediğinde sonuçların burada görünecek.
          </p>
        </Kart>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-extrabold">Sıralama</h1>

      <Kart className="rounded-[24px] p-5">
        <h2 className="font-display text-base font-extrabold">Denemelerim</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Sıralamanı görmek istediğin denemeleri seç.
        </p>
        <div className="mt-4 space-y-4">
          <DenemeSecici
            id="siralama-tyt"
            etiket="TYT denemesi"
            denemeler={tytListesi}
            secili={tytId}
            onSec={setTytId}
          />
          <DenemeSecici
            id="siralama-ayt"
            etiket={tur === 'dil' ? 'YDT denemesi' : 'AYT denemesi'}
            denemeler={aytListesi}
            secili={aytId}
            onSec={setAytId}
          />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
          <span className="font-bold text-muted-foreground">OBP</span>
          {obpSonucu ? (
            <span className="rakam text-right font-extrabold">
              {netYaz(obpSonucu.obp, 0)}
              <span className="ml-1.5 text-xs font-medium text-muted-foreground">
                Diploma notu {netYaz(obpSonucu.diplomaNotu)}
              </span>
            </span>
          ) : (
            <span className="text-xs font-medium text-muted-foreground">Okul notlarını gir</span>
          )}
        </div>
      </Kart>

      {tahmin === null ? (
        <Not tur="uyari">Hesap için en az bir deneme seç.</Not>
      ) : (
        <>
          {!tahmin.aytVar && (
            <Not tur="uyari">
              {tur === 'dil' ? 'YDT' : 'AYT'} denemesi seçmedin. O testlerin netleri boş
              sayıldığı için puan gerçekte olacağından çok düşük çıkar — sonucu ciddiye alma.
            </Not>
          )}

          <Kart className="rounded-[24px] border border-border/70 p-5">
            <h2 className="text-xs font-extrabold tracking-wide text-muted-foreground">
              TAHMİNİ SIRALAMA ARALIĞI
            </h2>
            <p className="rakam mt-2 font-display text-[27px] font-extrabold leading-tight tracking-tight text-primary">
              {bantYaz(tahmin.siralama.enIyi, tahmin.siralama.enKotu)}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Farklı yılların yerleştirme verilerine göre yaklaşık aralık.
            </p>

            <h3 className="mt-5 border-t border-border pt-4 text-sm font-extrabold">
              Yıllara göre tahmin
            </h3>
            <ul className="mt-2 divide-y divide-border">
              {tahmin.siralama.yillar.map((yil) => (
                <li key={yil.yil} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="text-sm font-semibold text-muted-foreground">{yil.yil} YKS</span>
                  <span className="rakam font-display text-base font-extrabold">
                    {yil.tabloDisi ? 'Tablo dışında' : `≈ ${siraYaz(yil.siralama)}`}
                  </span>
                </li>
              ))}
            </ul>
          </Kart>

          <section aria-labelledby="siralama-puanlar" className="space-y-3">
            <h2 id="siralama-puanlar" className="font-display text-base font-extrabold">
              Puan tahminim
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Kart className="rounded-[20px] p-4">
                <p className="text-xs font-semibold text-muted-foreground">Sınav puanı</p>
                <p className="rakam mt-2 font-display text-[22px] font-extrabold leading-none">
                  {netYaz(tahmin.sinavPuani)}
                </p>
              </Kart>
              <Kart className="rounded-[20px] p-4">
                <p className="text-xs font-semibold text-muted-foreground">Yerleştirme puanı</p>
                <p className="rakam mt-2 font-display text-[22px] font-extrabold leading-none text-primary">
                  {netYaz(tahmin.yerlestirmePuani)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {obpSonucu ? 'OBP dahil' : 'OBP hariç'}
                </p>
              </Kart>
            </div>
          </section>

          <div className="rounded-2xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
            <div className="flex gap-3">
              <Info size={17} className="mt-0.5 shrink-0 text-primary" aria-hidden />
              <div className="space-y-3">
                <p>
                  <strong className="text-foreground">Bu bir tahmindir.</strong> Tek bir sayıya
                  değil, sıralama aralığına bak.
                </p>
                <p className="border-t border-border pt-3">
                  Veriler ÖSYM’nin herkese açık yayınlarından derlenmiştir. Rabi, ÖSYM’ye
                  bağlı değildir.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function DenemeSecici({
  id,
  etiket,
  denemeler,
  secili,
  onSec,
}: {
  id: string
  etiket: string
  denemeler: Deneme[]
  secili: string
  onSec: (id: string) => void
}) {
  const secilen = denemeler.find((d) => d.id === secili)

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-extrabold">{etiket}</label>
      <div className="relative">
        <select
          id={id}
          value={secilen?.id ?? ''}
          onChange={(olay) => onSec(olay.target.value)}
          disabled={denemeler.length === 0}
          className="h-12 w-full appearance-none rounded-[14px] border border-border bg-muted/40 px-3.5 pr-10 text-[13px] font-bold text-foreground focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring/40 disabled:text-muted-foreground"
        >
          <option value="" disabled>
            {denemeler.length === 0 ? 'Bu türde kayıtlı deneme yok' : 'Deneme seç'}
          </option>
          {denemeler.map((deneme) => (
            <option key={deneme.id} value={deneme.id}>{denemeYaz(deneme)}</option>
          ))}
        </select>
        <ChevronDown size={17} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
      </div>
    </div>
  )
}

function denemeYaz(deneme: Deneme): string {
  return `${deneme.ad} · ${tarihYaz(deneme.tarih)}`
}
