'use client'

import { useMemo, useState } from 'react'
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
  rozetDurumu,
  rozetListesi,
  type RozetIlerlemesi,
  type RozetTuru,
} from '@/lib/rozetler'
import { netYaz } from '@/lib/hesap'
import { cn } from '@/lib/utils'
import { BaslikSatiri, Not } from '@/components/ui'
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

type Suzgec = 'tumu' | 'kazanilan' | 'kilitli'

/**
 * Başarımlar ekranı.
 *
 * Ekran bir süre dört katmanlıydı: sıradaki hedefi gösteren maskot kartı, kademe
 * sayacı (bronz/gümüş/altın/efsane), altı ölçülük istatistik ızgarası ve türe
 * göre **on sekiz** başlık altında iki sütunlu kart ızgarası. Dört ayrı özet,
 * hepsi aynı kırk rozeti başka bir şekilde sayıyordu; ekranın kendisi ise
 * ancak üçüncü ekranda başlıyordu.
 *
 * Şimdi tek bir sayaç (12/40 ve çubuğu), tek bir süzgeç ve iki bölüm var:
 * kazanılanlar ve kilitliler. Türe göre gruplama kalktı — on sekiz başlık,
 * aradığı rozeti bilen için bile uzun bir kaydırmaydı ve rozetler zaten
 * adlarıyla kendilerini anlatıyor.
 *
 * Kartlar da ızgaradan **tam genişlik satıra** geçti. İki sütunda ad, açıklama,
 * çubuk ve tarih 170 piksele sığmak zorundaydı ve açıklamalar üç satıra
 * kırılıyordu; satırda hepsi yan yana duruyor.
 *
 * İstatistik ızgarası (en uzun seri, odak saati, deneme sayısı…) buradan
 * kaldırıldı: hiçbiri başarımla ilgili değil, hepsi İstatistik ekranının işi.
 */
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
  const [suzgec, setSuzgec] = useState<Suzgec>('tumu')

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

  /*
    Liste sırası `rozetListesi`den geliyor ve burada yeniden sıralanmıyor:
    kazanılanlar yeniden eskiye, kilitliler eşiğe yakınlıklarına göre. İkisi de
    bu ekranın istediği sıra — en son kazandığın üstte, en az kalan üstte.
  */
  const liste = useMemo(() => rozetListesi(durum, kazanilmis), [durum, kazanilmis])
  const kazanilanlar = useMemo(() => liste.filter((s) => s.kazanildi), [liste])
  const kilitliler = useMemo(() => liste.filter((s) => !s.kazanildi), [liste])

  const toplam = ROZETLER.length
  const oran = toplam > 0 ? kazanilanlar.length / toplam : 0

  const bolumler: { ad: string; satirlar: RozetIlerlemesi[] }[] = [
    ...(suzgec !== 'kilitli'
      ? [{ ad: `KAZANILDI · ${kazanilanlar.length}`, satirlar: kazanilanlar }]
      : []),
    ...(suzgec !== 'kazanilan'
      ? [{ ad: `KİLİTLİ · ${kilitliler.length}`, satirlar: kilitliler }]
      : []),
  ]

  return (
    <div>
      <BaslikSatiri baslik="Başarımlar" />

      {/* Sayaç ve çubuk tek satırda: "12/40" ne kadarını topladığını söylüyor,
          çubuk aynı şeyi bakmadan okunur hâle getiriyor. */}
      <div className="flex items-center gap-3">
        <p className="rakam text-sm font-bold text-primary">
          {kazanilanlar.length}
          <span className="font-medium text-muted-foreground">/{toplam}</span>
        </p>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary-dolu transition-[width] duration-300 ease-out"
            style={{ width: `${Math.round(oran * 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-1.5 rounded-full bg-muted p-1">
        <SuzgecDugmesi secili={suzgec === 'tumu'} onClick={() => setSuzgec('tumu')} sayi={toplam}>
          Tümü
        </SuzgecDugmesi>
        <SuzgecDugmesi
          secili={suzgec === 'kazanilan'}
          onClick={() => setSuzgec('kazanilan')}
          sayi={kazanilanlar.length}
        >
          Kazanılan
        </SuzgecDugmesi>
        <SuzgecDugmesi
          secili={suzgec === 'kilitli'}
          onClick={() => setSuzgec('kilitli')}
          sayi={kilitliler.length}
        >
          Kilitli
        </SuzgecDugmesi>
      </div>

      {gunlukHedef <= 0 && (
        <Not className="mt-4">
          Seri rozetleri günlük soru hedefine göre sayılıyor. Ayarlar’dan bir hedef belirlemeden
          bu grup ilerlemiyor.
        </Not>
      )}

      {durum.diplomaNotu === null && (
        <Not className="mt-4">
          Okul notu rozetleri için Okul Notları ekranından derslerini gir — diploma notun
          hesaplanınca burada da görünür.
        </Not>
      )}

      {bolumler.map((bolum) => (
        <section key={bolum.ad} className="mt-5">
          {/*
            Başlık büyük harfle **yazılıyor**, `uppercase` ile çevrilmiyor:
            CSS'in büyütmesi "Kilitli"yi Türkçede yanlış olan "KILITLI"ye
            çeviriyor, tarayıcı sayfanın dilini bilse bile.
          */}
          <h2 className="mb-2.5 text-xs font-bold tracking-[0.08em] text-muted-foreground">
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
      ))}
    </div>
  )
}

/**
 * Süzgecin tek düğmesi.
 *
 * Çip değil şeritteki bölme: üç seçenek birbirini dışlıyor ve şerit hangisinin
 * açık olduğunu, seçili olmayanların da nerede durduğunu tek bakışta veriyor.
 * Ayrı çipler olsaydı "hepsi kapalı" gibi bir hâl de mümkün görünürdü, oysa
 * burada her zaman biri seçili.
 */
function SuzgecDugmesi({
  secili,
  sayi,
  children,
  ...props
}: React.ComponentProps<'button'> & { secili: boolean; sayi: number }) {
  return (
    <button
      type="button"
      aria-pressed={secili}
      className={cn(
        'flex-1 rounded-full py-2 text-[13px] font-bold transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        secili
          ? 'bg-card text-primary shadow-[0_1px_4px_rgba(90,60,35,0.12)]'
          : 'text-muted-foreground active:bg-card/50',
      )}
      {...props}
    >
      {children} <span className="rakam opacity-60">{sayi}</span>
    </button>
  )
}

/**
 * Tek başarım satırı: simge · ad ve açıklama · kademe ve ilerleme.
 *
 * Kazanılmamışta simge soluk ve gri, ortada bir ilerleme çubuğu var; kazanılmışta
 * çubuk yok — dolu bir çubuk zaten sağdaki kademe etiketinin söylediğini
 * tekrarlardı.
 */
function RozetSatiri({ satir }: { satir: RozetIlerlemesi }) {
  const { rozet, kazanildi, oran, tarih } = satir
  const renk = KADEME_SINIFI[rozet.kademe]

  return (
    <div className="golge-kart flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      <span
        className={cn(
          'flex size-11 flex-none items-center justify-center rounded-[14px] border text-[22px] leading-none',
          kazanildi
            ? cn(renk.kenar, renk.zemin)
            : 'border-border bg-muted opacity-45 grayscale',
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
        <p
          className={cn(
            'text-[11px] font-bold',
            kazanildi ? renk.yazi : 'text-muted-foreground',
          )}
        >
          {kazanildi ? KADEME_ADI[rozet.kademe] : 'Kilitli'}
        </p>
        <p className="rakam mt-[3px] text-[11px] text-muted-foreground">
          {kazanildi ? (tarih ? kisaTarih(tarih) : 'Kazanıldı') : ilerlemeYazisi(satir)}
        </p>
      </div>
    </div>
  )
}
