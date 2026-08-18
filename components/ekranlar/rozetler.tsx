'use client'

import { useMemo } from 'react'
import { Lock } from 'lucide-react'
import type {
  Deneme,
  GunlukKayit,
  KazanilanRozet,
  OyunKayitlari,
  PomodoroSeans,
  Sablon,
  YanlisSoru,
} from '@/lib/types'
import {
  KADEME_ADI,
  KADEME_SIRASI,
  ROZETLER,
  TUR_ADI,
  kademeSayimi,
  rozetDurumu,
  rozetListesi,
  type RozetIlerlemesi,
  type RozetKademesi,
  type RozetTuru,
} from '@/lib/rozetler'
import { netYaz, tarihYaz } from '@/lib/hesap'
import { cn } from '@/lib/utils'
import { BaslikSatiri, Deger, Kart, Not } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { KADEME_SINIFI } from '@/components/rozet-renk'

/**
 * Grupların ekrandaki sırası — değerliden gündeliğe.
 *
 * Seri en başta: uygulamanın en zor kazanılan ve en çok motive eden ölçüsü o.
 * Mini oyunlar en sonda; mola aktivitesi, ana iş değil.
 */
const TUR_SIRASI: RozetTuru[] = [
  'seri',
  'pomodoro-seans',
  'pomodoro-dakika',
  'pomodoro-gun',
  'gunluk-soru',
  'haftalik-soru',
  'deneme',
  'deneme-yukselis',
  'diploma',
  'yanlis-ekleme',
  'yanlis-cozme',
  'banka-dusen',
  'banka-temiz',
  'oyun-tur',
  'oyun-rekor',
  'oyun-hatasiz',
  'oyun-dogru',
  'oyun-seri',
]

/**
 * İlerleme sayısının birimi.
 *
 * Tekrar sayan rozetlerde bu şart: "7 / 10" tek başına 10 soru mu 10 gün mü
 * belli değil, "7 / 10 gün" rozetin ne istediğini tek satırda anlatıyor.
 */
const BIRIM: Partial<Record<RozetTuru, string>> = {
  seri: 'gün',
  'pomodoro-seans': 'seans',
  'pomodoro-dakika': 'dk',
  'pomodoro-gun': 'tur',
  'gunluk-soru': 'gün',
  'haftalik-soru': 'hafta',
  deneme: 'deneme',
  'deneme-yukselis': 'deneme',
  'yanlis-ekleme': 'soru',
  'yanlis-cozme': 'soru',
  'banka-dusen': 'soru',
  'oyun-tur': 'tur',
  'oyun-rekor': 'doğru',
  'oyun-hatasiz': 'tur',
  'oyun-dogru': 'doğru',
  'oyun-seri': 'doğru',
}

/**
 * İlerleme sayısı. Diploma notu ondalıklı (94,30 gibi); tam sayıya yuvarlanırsa
 * "94 / 95" yazıp aslında ne kadar yakın olduğunu gizler. Sayılabilen ölçüler
 * (deneme, soru, gün) ondalıksız gösterilir.
 */
function degerYaz(tur: RozetTuru, deger: number): string {
  return netYaz(deger, tur === 'diploma' ? 2 : 0)
}

export function RozetlerEkrani({
  denemeler,
  sablonlar,
  gunlukKayitlar,
  gunlukHedef,
  diplomaNotu,
  pomodoroGecmis,
  yanlisSorular,
  oyunlar,
  bankaDusen,
  bankaBoyutu,
  kazanilmis,
}: {
  denemeler: Deneme[]
  sablonlar: Sablon[]
  gunlukKayitlar: GunlukKayit[]
  gunlukHedef: number
  diplomaNotu: number | null
  pomodoroGecmis: PomodoroSeans[]
  yanlisSorular: YanlisSoru[]
  oyunlar: OyunKayitlari
  bankaDusen: number
  bankaBoyutu: number
  kazanilmis: KazanilanRozet[]
}) {
  const durum = useMemo(
    () =>
      rozetDurumu({
        denemeler,
        sablonlar,
        gunlukKayitlar,
        gunlukHedef,
        diplomaNotu,
        pomodoroGecmis,
        yanlisSorular,
        oyunlar,
        bankaDusen,
        bankaBoyutu,
      }),
    [
      denemeler,
      sablonlar,
      gunlukKayitlar,
      gunlukHedef,
      diplomaNotu,
      pomodoroGecmis,
      yanlisSorular,
      oyunlar,
      bankaDusen,
      bankaBoyutu,
    ],
  )
  const liste = useMemo(() => rozetListesi(durum, kazanilmis), [durum, kazanilmis])
  const kazanilanSayi = liste.filter((s) => s.kazanildi).length
  const sayim = useMemo(() => kademeSayimi(liste), [liste])

  // Sıradaki hedef: kazanılmamışlar arasında eşiğe en yakın olan.
  const sonraki = liste.find((s) => !s.kazanildi)
  const odakSaati = Math.floor(durum.pomodoroDakikasi / 60)

  return (
    <div>
      <BaslikSatiri
        baslik="Rozetler"
        aciklama={`${kazanilanSayi} / ${ROZETLER.length} kazanıldı`}
      />

      <Kart className="mb-3 flex items-center gap-4">
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
              <Ilerleme satir={sonraki} />
            </>
          ) : (
            <p className="text-sm font-medium">Bütün rozetleri topladın. 🐰</p>
          )}
        </div>
      </Kart>

      {/* Kademe sayacı: kaç tane değil, ne kadar değerlisini topladığını gösterir. */}
      <div className="mb-4 grid grid-cols-4 gap-2">
        {(Object.keys(KADEME_ADI) as RozetKademesi[]).map((kademe) => {
          const renk = KADEME_SINIFI[kademe]
          const toplam = ROZETLER.filter((r) => r.kademe === kademe).length
          return (
            <div
              key={kademe}
              className={cn('rounded-2xl border px-2 py-2 text-center', renk.kenar, renk.zemin)}
            >
              <p className={cn('rakam font-display text-lg font-semibold', renk.yazi)}>
                {sayim[kademe]}
                <span className="text-xs font-normal opacity-70">/{toplam}</span>
              </p>
              <p className={cn('text-[11px]', renk.yazi)}>{KADEME_ADI[kademe]}</p>
            </div>
          )
        })}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <Deger etiket="En uzun seri" deger={String(durum.enUzunSeri)} altNot="gün" />
        <Deger etiket="Odak" deger={String(odakSaati)} altNot="saat" />
        <Deger etiket="Deneme" deger={String(durum.denemeSayisi)} />
        <Deger etiket="Bankadan düşen" deger={String(durum.bankaDusen)} altNot="soru" />
        <Deger etiket="Yanlış çözülen" deger={String(durum.yanlisCozulen)} altNot="soru" />
        <Deger etiket="Oyun rekoru" deger={String(durum.oyunRekoru)} altNot="doğru" />
      </div>

      {gunlukHedef <= 0 && (
        <Not className="mb-4">
          Seri rozetleri günlük soru hedefine göre sayılıyor. Ayarlar’dan bir hedef belirlemeden
          bu grup ilerlemiyor.
        </Not>
      )}

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
                .sort(
                  (a, b) =>
                    KADEME_SIRASI[a.rozet.kademe] - KADEME_SIRASI[b.rozet.kademe] ||
                    a.rozet.esik - b.rozet.esik,
                )
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

/**
 * "7 / 10 gün" satırı. Eşiği 1 olan rozetlerde (banka temizliği gibi) sayı
 * anlamsız — orada ilerleme değil, olup olmadığı yazılıyor.
 */
function Ilerleme({ satir }: { satir: RozetIlerlemesi }) {
  const { rozet, mevcut } = satir
  if (rozet.esik <= 1) {
    return <p className="mt-1 text-xs text-muted-foreground">Henüz olmadı</p>
  }
  const birim = BIRIM[rozet.tur]
  return (
    <p className="rakam mt-1 text-xs text-muted-foreground">
      {degerYaz(rozet.tur, mevcut)} / {netYaz(rozet.esik, 0)}
      {birim ? ` ${birim}` : ''}
    </p>
  )
}

function RozetKarti({ satir }: { satir: RozetIlerlemesi }) {
  const { rozet, kazanildi, oran, tarih } = satir
  const renk = KADEME_SINIFI[rozet.kademe]

  return (
    <div
      className={cn(
        'h-full rounded-2xl border p-3',
        kazanildi ? cn(renk.kenar, renk.zemin) : 'border-border bg-card',
      )}
    >
      <div className="flex items-start justify-between gap-1">
        {/* Kazanılmamış rozetin simgesi soluk: neye çalıştığı görünsün ama
            kazanılmışlarla karışmasın. */}
        <span
          className={cn('text-2xl leading-none', !kazanildi && 'opacity-35 grayscale')}
          aria-hidden
        >
          {rozet.ikon}
        </span>
        {kazanildi ? (
          <span className={cn('mt-0.5 text-[10px] font-medium uppercase tracking-wide', renk.yazi)}>
            {KADEME_ADI[rozet.kademe]}
          </span>
        ) : (
          <Lock size={13} className="mt-1 shrink-0 text-muted-foreground/60" aria-hidden />
        )}
      </div>

      <p className={cn('mt-2 text-sm font-medium', !kazanildi && 'text-muted-foreground')}>
        {rozet.ad}
      </p>
      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{rozet.aciklama}</p>

      {kazanildi ? (
        <p className={cn('mt-1.5 text-xs font-medium', renk.yazi)}>
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
          <Ilerleme satir={satir} />
        </>
      )}
    </div>
  )
}
