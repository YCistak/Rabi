'use client'

import { useMemo, useState } from 'react'
import { Info, TriangleAlert } from 'lucide-react'
import type { Ayarlar, Deneme, OkulYili, PuanTuru, Sablon } from '@/lib/types'
import { netYaz, tarihYaz } from '@/lib/hesap'
import { OSYM_TEST_ADI } from '@/lib/sablonlar'
import { VERI_YILLARI } from '@/lib/puan'
import { bantYaz, siraYaz } from '@/lib/siralama'
import { aytAdaylari, enYeni, obpHesapla, tahminUret, tytAdaylari } from '@/lib/tahmin'
import { BaslikSatiri, BosDurum, Deger, Kart, Not, SecmeliAlan } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

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
      tahminUret({
        tytDenemesi: denemeler.find((d) => d.id === tytId),
        aytDenemesi: denemeler.find((d) => d.id === aytId),
        sablonlar,
        tur,
        obp: obpSonucu?.obp ?? null,
      }),
    [denemeler, tytId, aytId, sablonlar, tur, obpSonucu],
  )

  if (denemeler.length === 0) {
    return (
      <div>
        <BaslikSatiri baslik="Sıralama Hesapla" />
        <BosDurum
          simge={<Rabi durum="uykulu" boyut={96} />}
          baslik="Önce bir deneme ekle"
          aciklama="Sıralama tahmini için en az bir TYT ve bir AYT denemesi gerekiyor. Deneme sekmesinden ekleyebilirsin."
        />
      </div>
    )
  }

  return (
    <div>
      <BaslikSatiri
        baslik="Sıralama Hesapla"
        aciklama={`${PUAN_TURU_ADI[tur]} · Ayarlar'dan değiştirilir`}
      />

      <Kart className="mb-3 space-y-3">
        <DenemeSecici
          etiket="TYT denemesi"
          denemeler={tytListesi}
          secili={tytId}
          onSec={setTytId}
        />
        <DenemeSecici
          etiket={tur === 'dil' ? 'YDT denemesi' : 'AYT denemesi'}
          denemeler={aytListesi}
          secili={aytId}
          onSec={setAytId}
        />

        <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5 text-sm">
          <span className="text-muted-foreground">OBP</span>
          {obpSonucu ? (
            <span className="rakam font-medium">
              {netYaz(obpSonucu.obp, 0)}
              <span className="ml-1 font-normal text-muted-foreground">
                (diploma {netYaz(obpSonucu.diplomaNotu)})
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">Okul notlarını gir</span>
          )}
        </div>
      </Kart>

      {tahmin === null ? (
        <Not tur="uyari">Hesap için en az bir deneme seç.</Not>
      ) : (
        <>
          {!tahmin.aytVar && (
            <Not tur="uyari" className="mb-3">
              {tur === 'dil' ? 'YDT' : 'AYT'} denemesi seçmedin. O testlerin netleri boş
              sayıldığı için puan gerçekte olacağından çok düşük çıkar — sonucu ciddiye alma.
            </Not>
          )}

          <div className="mb-3 grid grid-cols-2 gap-3">
            <Deger etiket="Tahmini sınav puanı" deger={netYaz(tahmin.sinavPuani)} />
            <Deger
              etiket="Yerleştirme puanı"
              deger={netYaz(tahmin.yerlestirmePuani)}
              vurgu
              altNot={obpSonucu ? 'OBP dahil' : 'OBP hariç'}
            />
          </div>

          <Kart className="mb-3">
            <p className="mb-3 font-medium">Tahmini sıralama</p>
            <ul className="space-y-2">
              {tahmin.siralama.yillar.map((yil) => (
                <li key={yil.yil} className="flex items-baseline justify-between gap-2">
                  <span className="text-sm text-muted-foreground">{yil.yil} YKS'de olsaydı</span>
                  <span className="rakam font-display text-lg font-semibold">
                    {yil.tabloDisi ? '—' : `~${siraYaz(yil.siralama)}`}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">Yaklaşık bant</p>
              <p className="rakam font-display text-2xl font-semibold text-primary">
                {bantYaz(tahmin.siralama.enIyi, tahmin.siralama.enKotu)}
              </p>
            </div>
          </Kart>

          {tahmin.oranlanan.length > 0 && (
            <Not className="mb-3">
              <span className="flex items-start gap-2">
                <Info size={15} className="mt-0.5 shrink-0" aria-hidden />
                <span>
                  Seçtiğin denemede{' '}
                  {tahmin.oranlanan.map((t) => OSYM_TEST_ADI[t]).join(', ')} soru sayısı gerçek
                  sınavdan farklı. Netler oranlanarak tahmin edildi; gerçek formatta yapılan bir
                  deneme daha güvenilir sonuç verir.
                </span>
              </span>
            </Not>
          )}

          {/* Bu uyarı bilerek kapatılamıyor. */}
          <Not tur="uyari">
            <span className="flex items-start gap-2">
              <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                <strong>Bu bir tahmindir.</strong> Gerçek YKS puanı, o yıl sınava girenlerin
                ortalamasına ve standart sapmasına göre hesaplanır; sınavdan önce kimse bilemez.
                Rabi, ÖSYM'nin yayınladığı {VERI_YILLARI.join(', ')} verilerini kullanıyor —
                sıralaman bu üç yılın koşullarında ne olurdu, onu gösteriyor. Tek bir sayıya
                değil, banda bak.
              </span>
            </span>
          </Not>
        </>
      )}
    </div>
  )
}

function DenemeSecici({
  etiket,
  denemeler,
  secili,
  onSec,
}: {
  etiket: string
  denemeler: Deneme[]
  secili: string
  onSec: (id: string) => void
}) {
  const secilen = denemeler.find((d) => d.id === secili)
  const oneriler = denemeler.map(denemeYaz)

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-muted-foreground">{etiket}</p>
      {denemeler.length === 0 ? (
        <p className="rounded-xl bg-muted/60 px-3 py-2.5 text-sm text-muted-foreground">
          Bu türde kayıtlı deneme yok.
        </p>
      ) : (
        <SecmeliAlan
          deger={secilen ? denemeYaz(secilen) : ''}
          onDegis={(yeni) => {
            const bulunan = denemeler.find((d) => denemeYaz(d) === yeni)
            if (bulunan) onSec(bulunan.id)
          }}
          oneriler={oneriler}
          readOnly
          aria-label={etiket}
        />
      )}
    </div>
  )
}

function denemeYaz(deneme: Deneme): string {
  return `${deneme.ad} · ${tarihYaz(deneme.tarih)}`
}
