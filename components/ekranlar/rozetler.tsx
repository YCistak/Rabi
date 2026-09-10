'use client'

import { useMemo } from 'react'
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
  ROZETLER,
  kademeSayimi,
  rozetDurumu,
  rozetListesi,
  type RozetIlerlemesi,
  type RozetKademesi,
  type RozetTuru,
} from '@/lib/rozetler'
import { netYaz } from '@/lib/hesap'
import { cn } from '@/lib/utils'
import { BaslikSatiri, Deger, Kart, Not } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { KADEME_SINIFI } from '@/components/rozet-renk'

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

/**
 * Kazanılma tarihinin kısa yazımı: "9 May".
 *
 * `tarihYaz` uzun yazıyor ("9 Mayıs 2026") ve o satır sağ sütunu genişletiyor:
 * ortadaki açıklama iki satıra kırılıyor, satırlar birbirinden farklı boyda
 * kalıyordu. Tarihin buradaki işi kesin bir gün bildirmek değil, "ne zaman
 * kazandım" sorusunu kabaca yanıtlamak.
 *
 * Yıl yalnızca **bu yıl değilse** yazılıyor. Tamamen atılsaydı bir önceki
 * öğretim yılında kazanılmış rozet bu yılkiyle aynı görünürdü; her zaman
 * yazılsaydı satırların çoğuna aynı dört rakam eklenirdi.
 */
function kisaTarih(isoTarih: string): string {
  const [yil, ay, gun] = isoTarih.split('-').map(Number)
  if (!yil || !ay || !gun) return isoTarih
  return new Date(yil, ay - 1, gun).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    ...(yil === new Date().getFullYear() ? {} : { year: 'numeric' }),
  })
}

/**
 * Satırın sağ alt köşesindeki tek satır: kazanılmışta tarih, kazanılmamışta
 * "23 / 25 deneme". Eşiği 1 olan rozetlerde (banka temizliği gibi) sayı
 * anlamsız — orada ilerleme değil, olup olmadığı yazılıyor.
 */
function ilerlemeYazisi({ rozet, mevcut }: RozetIlerlemesi): string {
  if (rozet.esik <= 1) return 'Henüz olmadı'
  const birim = BIRIM[rozet.tur]
  return `${degerYaz(rozet.tur, mevcut)} / ${netYaz(rozet.esik, 0)}${birim ? ` ${birim}` : ''}`
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
  /*
    Liste sırası `rozetListesi`den geliyor ve burada yeniden sıralanmıyor:
    kazanılanlar yeniden eskiye, kilitliler eşiğe yakınlıklarına göre. İkisi de
    bu ekranın istediği sıra — en son kazandığın üstte, en az kalan üstte.
  */
  const kazanilanlar = useMemo(() => liste.filter((s) => s.kazanildi), [liste])
  const kilitliler = useMemo(() => liste.filter((s) => !s.kazanildi), [liste])
  const kazanilanSayi = kazanilanlar.length
  const sayim = useMemo(() => kademeSayimi(liste), [liste])

  // Sıradaki hedef: kazanılmamışlar arasında eşiğe en yakın olan.
  const sonraki = liste.find((s) => !s.kazanildi)
  const odakSaati = Math.floor(durum.pomodoroDakikasi / 60)

  return (
    <div>
      <BaslikSatiri
        baslik="Başarımlar"
        aciklama={`${kazanilanSayi} / ${ROZETLER.length} kazanıldı`}
      />

      <Kart className="mb-3 flex items-center gap-4">
        <Rabi
          durum={kazanilanSayi > 0 ? 'mutlu' : 'normal'}
          poz={kazanilanSayi > 0 ? 'kupali' : 'tam'}
          boyut={72}
        />
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
            <p className="text-sm font-medium">Bütün başarımları topladın. 🐰</p>
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

      {/*
        Bölüm başlığı büyük harfle **yazılıyor**, `uppercase` ile çevrilmiyor:
        CSS'in büyütmesi "Kilitli"yi Türkçede yanlış olan "KILITLI"ye çeviriyor,
        tarayıcı sayfanın dilini bilse bile.
      */}
      {[
        { ad: `KAZANILDI · ${kazanilanlar.length}`, satirlar: kazanilanlar },
        { ad: `KİLİTLİ · ${kilitliler.length}`, satirlar: kilitliler },
      ].map((bolum) =>
        bolum.satirlar.length === 0 ? null : (
          <section key={bolum.ad} className="mb-4">
            <h2 className="mb-2 text-xs font-bold tracking-[0.08em] text-muted-foreground">
              {bolum.ad}
            </h2>
            <ul className="flex flex-col gap-2">
              {bolum.satirlar.map((satir) => (
                <li key={satir.rozet.id}>
                  <RozetSatiri satir={satir} />
                </li>
              ))}
            </ul>
          </section>
        ),
      )}
    </div>
  )
}

/** "7 / 10 gün" satırı — sıradaki hedef kartındaki hâli. */
function Ilerleme({ satir }: { satir: RozetIlerlemesi }) {
  return <p className="rakam mt-1 text-xs text-muted-foreground">{ilerlemeYazisi(satir)}</p>
}

/**
 * Tek başarım satırı: simge · ad ve açıklama · kademe ve ilerleme.
 *
 * Kazanılmamışta simge soluk ve gri, ortada bir ilerleme çubuğu var;
 * kazanılmışta çubuk yok — dolu bir çubuk zaten sağdaki kademe etiketinin
 * söylediğini tekrarlardı.
 */
function RozetSatiri({ satir }: { satir: RozetIlerlemesi }) {
  const { rozet, kazanildi, oran, tarih } = satir
  const renk = KADEME_SINIFI[rozet.kademe]

  return (
    <div className="golge-kart flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      <span
        className={cn(
          'flex size-11 flex-none items-center justify-center rounded-[14px] border text-[22px] leading-none',
          kazanildi ? cn(renk.kenar, renk.zemin) : 'border-border bg-muted opacity-45 grayscale',
        )}
        aria-hidden
      >
        {rozet.ikon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{rozet.ad}</p>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{rozet.aciklama}</p>
        {!kazanildi && (
          <div className="mt-[7px] h-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary-dolu"
              style={{ width: `${Math.round(oran * 100)}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex-none text-right">
        <p className={cn('text-[11px] font-bold', kazanildi ? renk.yazi : 'text-muted-foreground')}>
          {kazanildi ? KADEME_ADI[rozet.kademe] : 'Kilitli'}
        </p>
        <p className="rakam mt-[3px] text-[11px] text-muted-foreground">
          {kazanildi ? (tarih ? kisaTarih(tarih) : 'Kazanıldı') : ilerlemeYazisi(satir)}
        </p>
      </div>
    </div>
  )
}
