'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Info } from 'lucide-react'
import type { Ayarlar, Deneme, OkulYili, PuanTuru, Sablon } from '@/lib/types'
import { netYaz, tarihYaz } from '@/lib/hesap'
import { bantYaz, siraYaz } from '@/lib/siralama'
import { aytAdaylari, enYeni, obpHesapla, tahminUret, tytAdaylari } from '@/lib/tahmin'
import { Kart, Not } from '@/components/ui'

const PUAN_TURU_ADI: Record<PuanTuru, string> = {
  say: 'Sayısal',
  ea: 'Eşit Ağırlık',
  soz: 'Sözel',
  dil: 'Dil',
}

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
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-xl font-extrabold">Sıralama</h1>
        <span className="rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-extrabold text-primary">
          {PUAN_TURU_ADI[tur]}
        </span>
      </div>

      {tahmin ? (
        <section aria-labelledby="tahmini-siralama" className="overflow-hidden rounded-[26px] border border-primary/15 bg-primary-soft">
          <div className="px-5 pb-5 pt-5">
            <h2 id="tahmini-siralama" className="text-xs font-extrabold tracking-wide text-primary">
              TAHMİNİ BAŞARI SIRAN
            </h2>
            <p className="rakam mt-3 font-display text-[clamp(1.65rem,7vw,2.1rem)] font-black leading-tight tracking-tight text-foreground">
              {bantYaz(tahmin.siralama.enIyi, tahmin.siralama.enKotu)}
            </p>
            <p className="mt-3 text-[13px] font-semibold leading-snug text-primary">
              Tek bir sayı değil, yıllara göre yaklaşık bir aralık.
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-primary/10 bg-card/70 px-5 py-3 text-xs">
            <span className="font-semibold text-muted-foreground">Yerleştirme puanına göre</span>
            <span className="rakam font-extrabold text-primary">{netYaz(tahmin.yerlestirmePuani)}</span>
          </div>
        </section>
      ) : (
        <Kart className="rounded-[24px] p-5">
          <h2 className="font-display text-base font-extrabold">Henüz sıralama yok</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Tahmini sıralamanı görmek için aşağıdan bir TYT denemesi seç.
          </p>
        </Kart>
      )}

      {tahmin && !tahmin.aytVar && (
        <Not tur="uyari">
          {tur === 'dil' ? 'YDT' : 'AYT'} denemesi seçmedin. O testlerin netleri boş
          sayıldığı için puan gerçekte olacağından çok düşük çıkar — sonucu ciddiye alma.
        </Not>
      )}

      <section aria-labelledby="siralama-denemeler" className="space-y-3">
        <h2 id="siralama-denemeler" className="font-display text-base font-extrabold">
          Hesaba katılan denemeler
        </h2>
        <div className="grid gap-2.5">
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
        <div className="flex items-center justify-between gap-3 px-1 pt-1 text-xs">
          <span className="font-semibold text-muted-foreground">Ortaöğretim başarı puanı</span>
          <span className="rakam text-right font-extrabold">
            {obpSonucu ? netYaz(obpSonucu.obp, 0) : 'Eklenmedi'}
          </span>
        </div>
      </section>

      {tahmin && (
        <>
          <section aria-labelledby="siralama-puanlar" className="space-y-3">
            <h2 id="siralama-puanlar" className="font-display text-base font-extrabold">
              Puanlarım
            </h2>
            <div className="golge-kart grid grid-cols-2 divide-x divide-border rounded-[20px] bg-card p-4">
              <div className="min-w-0 pr-3">
                <p className="text-xs font-semibold text-muted-foreground">Sınav</p>
                <p className="rakam mt-2 font-display text-[22px] font-extrabold leading-none">
                  {netYaz(tahmin.sinavPuani)}
                </p>
              </div>
              <div className="min-w-0 pl-3">
                <p className="text-xs font-semibold text-muted-foreground">Yerleştirme</p>
                <p className="rakam mt-2 font-display text-[22px] font-extrabold leading-none text-primary">
                  {netYaz(tahmin.yerlestirmePuani)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {obpSonucu ? 'OBP dahil' : 'OBP hariç'}
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="siralama-yillar" className="space-y-3">
            <h2 id="siralama-yillar" className="font-display text-base font-extrabold">
              Yıllara göre
            </h2>
            <ul className="golge-kart divide-y divide-border overflow-hidden rounded-[20px] bg-card px-4">
              {tahmin.siralama.yillar.map((yil) => (
                <li key={yil.yil} className="flex items-center justify-between gap-3 py-3.5">
                  <span className="rakam text-sm font-extrabold">{yil.yil} YKS</span>
                  <span className="rakam font-display text-base font-extrabold text-primary">
                    {yil.tabloDisi ? 'Tablo dışında' : `≈ ${siraYaz(yil.siralama)}`}
                  </span>
                </li>
              ))}
            </ul>
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
    <div className="relative min-w-0 rounded-[18px] border border-border bg-card px-4 py-3.5 shadow-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring active:bg-muted/40">
      <p className="text-xs font-semibold text-muted-foreground">{etiket}</p>
      <p className="mt-1 truncate pr-7 text-sm font-extrabold">
        {secilen?.ad ?? 'Deneme seçilmedi'}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {secilen
          ? tarihYaz(secilen.tarih)
          : denemeler.length === 0
            ? 'Bu türde kayıtlı deneme yok'
            : 'Dokunarak seç'}
      </p>
      {denemeler.length > 0 && (
        <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary" aria-hidden />
      )}
      <select
        id={id}
        aria-label={etiket}
        value={secilen?.id ?? ''}
        onChange={(olay) => onSec(olay.target.value)}
        disabled={denemeler.length === 0}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      >
        <option value="" disabled>
          {denemeler.length === 0 ? 'Bu türde kayıtlı deneme yok' : 'Deneme seç'}
        </option>
        {denemeler.map((deneme) => (
          <option key={deneme.id} value={deneme.id}>{denemeYaz(deneme)}</option>
        ))}
      </select>
    </div>
  )
}

function denemeYaz(deneme: Deneme): string {
  return `${deneme.ad} · ${tarihYaz(deneme.tarih)}`
}
