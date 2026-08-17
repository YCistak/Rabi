'use client'

import { useMemo } from 'react'
import { Lock } from 'lucide-react'
import type { Deneme, GunlukKayit, KazanilanRozet, OyunKayitlari } from '@/lib/types'
import {
  ROZETLER,
  TUR_ADI,
  rozetDurumu,
  rozetListesi,
  type RozetIlerlemesi,
  type RozetTuru,
} from '@/lib/rozetler'
import { netYaz, tarihYaz } from '@/lib/hesap'
import { cn } from '@/lib/utils'
import { BaslikSatiri, Deger, Kart, Not } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

const TUR_SIRASI: RozetTuru[] = [
  'deneme',
  'gunluk-soru',
  'haftalik-soru',
  'diploma',
  'oyun-tur',
  'oyun-rekor',
  'oyun-hatasiz',
  'oyun-dogru',
]

/**
 * İlerleme sayısı. Diploma notu ondalıklı (94,30 gibi); tam sayıya yuvarlanırsa
 * "94 / 95" yazıp aslında ne kadar yakın olduğunu gizler. Sayılabilen ölçüler
 * (deneme, soru) ondalıksız gösterilir.
 */
function degerYaz(tur: RozetTuru, deger: number): string {
  return netYaz(deger, tur === 'diploma' ? 2 : 0)
}

export function RozetlerEkrani({
  denemeler,
  gunlukKayitlar,
  diplomaNotu,
  oyunlar,
  kazanilmis,
}: {
  denemeler: Deneme[]
  gunlukKayitlar: GunlukKayit[]
  diplomaNotu: number | null
  oyunlar: OyunKayitlari
  kazanilmis: KazanilanRozet[]
}) {
  const durum = useMemo(
    () => rozetDurumu({ denemeler, gunlukKayitlar, diplomaNotu, oyunlar }),
    [denemeler, gunlukKayitlar, diplomaNotu, oyunlar],
  )
  const liste = useMemo(() => rozetListesi(durum, kazanilmis), [durum, kazanilmis])
  const kazanilanSayi = liste.filter((s) => s.kazanildi).length

  // Sıradaki hedef: kazanılmamışlar arasında eşiğe en yakın olan.
  const sonraki = liste.find((s) => !s.kazanildi)

  return (
    <div>
      <BaslikSatiri
        baslik="Rozetler"
        aciklama={`${kazanilanSayi} / ${ROZETLER.length} kazanıldı`}
      />

      <Kart className="mb-4 flex items-center gap-4">
        <Rabi durum={kazanilanSayi > 0 ? 'mutlu' : 'normal'} boyut={72} />
        <div className="min-w-0 flex-1">
          {sonraki ? (
            <>
              <p className="text-sm font-medium">Sıradaki: {sonraki.rozet.ad}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{sonraki.rozet.aciklama}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.round(sonraki.oran * 100)}%` }}
                />
              </div>
              <p className="rakam mt-1 text-xs text-muted-foreground">
                {degerYaz(sonraki.rozet.tur, sonraki.mevcut)} /{' '}
                {netYaz(sonraki.rozet.esik, 0)}
              </p>
            </>
          ) : (
            <p className="text-sm font-medium">Bütün rozetleri topladın. 🐰</p>
          )}
        </div>
      </Kart>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <Deger etiket="Deneme" deger={String(durum.denemeSayisi)} />
        <Deger etiket="En iyi gün" deger={String(durum.enIyiGun)} altNot="soru" />
        <Deger etiket="En iyi hafta" deger={String(durum.enIyiHafta)} altNot="soru" />
        <Deger etiket="Oyun turu" deger={String(durum.oyunTuru)} />
        <Deger etiket="Oyun rekoru" deger={String(durum.oyunRekoru)} altNot="doğru" />
        <Deger etiket="Oyunda doğru" deger={String(durum.oyunDogru)} />
      </div>

      {durum.diplomaNotu === null && (
        <Not className="mb-4">
          Okul notu rozetleri için Okul Notları ekranından derslerini gir — diploma notun
          hesaplanınca burada da görünür.
        </Not>
      )}

      {TUR_SIRASI.map((tur) => {
        const grup = liste.filter((s) => s.rozet.tur === tur)
        if (grup.length === 0) return null
        return (
          <section key={tur} className="mb-4">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">{TUR_ADI[tur]}</h2>
            <ul className="grid grid-cols-2 gap-2">
              {grup
                .slice()
                .sort((a, b) => a.rozet.esik - b.rozet.esik)
                .map((satir) => (
                  <li key={satir.rozet.id}>
                    <RozetKarti satir={satir} />
                  </li>
                ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function RozetKarti({ satir }: { satir: RozetIlerlemesi }) {
  const { rozet, kazanildi, oran, mevcut, tarih } = satir

  return (
    <div
      className={cn(
        'h-full rounded-2xl border p-3',
        kazanildi ? 'border-primary/40 bg-primary/8' : 'border-border bg-card',
      )}
    >
      <div className="flex items-start justify-between gap-1">
        {/* Kazanılmamış rozetin simgesi soluk: neye çalıştığı görünsün ama
            kazanılmışlarla karışmasın. */}
        <span className={cn('text-2xl leading-none', !kazanildi && 'opacity-35 grayscale')} aria-hidden>
          {rozet.ikon}
        </span>
        {!kazanildi && <Lock size={13} className="mt-1 shrink-0 text-muted-foreground/60" aria-hidden />}
      </div>

      <p className={cn('mt-2 text-sm font-medium', !kazanildi && 'text-muted-foreground')}>
        {rozet.ad}
      </p>
      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{rozet.aciklama}</p>

      {kazanildi ? (
        <p className="mt-1.5 text-xs font-medium text-primary">
          {tarih ? tarihYaz(tarih) : 'Kazanıldı'}
        </p>
      ) : (
        <>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-muted-foreground/40"
              style={{ width: `${Math.round(oran * 100)}%` }}
            />
          </div>
          <p className="rakam mt-1 text-xs text-muted-foreground">
            {degerYaz(rozet.tur, mevcut)} / {netYaz(rozet.esik, 0)}
          </p>
        </>
      )}
    </div>
  )
}
