'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeftRight, ChevronRight, Minus, TrendingDown, TrendingUp, X } from 'lucide-react'
import { AracSimgesi, BosDurum } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { denemeOzeti, netYaz } from '@/lib/hesap'
import {
  denemeKarsilastir,
  farkYaz,
  ilerleyenDersler,
  istatistikOzeti,
  secimGuncelle,
  yon,
  type DersDegisimi,
  type Yon,
} from '@/lib/istatistik'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import type { Deneme, Sablon } from '@/lib/types'

/*
  Tasarım: `tasarim/istatistik.dc.html` → 2a ("kayıp önce").

  Eski ekran ortalamayla açılıyordu: üç sayı kutusu, toplam net grafiği ve her
  dersin ortalama çubuğu. Öğrencinin denemeden sonra sorduğu şey ise "ne
  değişti"; ekran artık son denemenin netiyle ve bir öncekine göre farkıyla
  açılıyor, dersler de son iki deneme arasındaki kazançla sıralanıyor.
*/

/** "En çok ilerleyen dersler" kartında kaç ders duruyor; kalanı "Daha fazla"da. */
const ILERLEYEN_SAYISI = 3

const ROZET_ZEMIN: Record<Yon, string> = {
  artti: 'bg-success-soft text-success',
  azaldi: 'bg-danger-soft text-danger',
  ayni: 'bg-muted text-muted-foreground',
}

const CUBUK_RENGI: Record<Yon, string> = {
  artti: 'bg-success',
  azaldi: 'bg-danger',
  ayni: 'bg-muted-foreground/30',
}

/** Kısa tarih: "4 Mayıs"; içinde bulunulan yıl değilse yıl da yazılıyor. */
function kisaTarih(iso: string): string {
  const [yil, ay, gun] = iso.split('-').map(Number)
  if (!yil || !ay || !gun) return iso
  const tarih = new Date(yil, ay - 1, gun)
  return tarih.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    ...(yil !== new Date().getFullYear() && { year: 'numeric' }),
  })
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
  const [dersSayfasi, setDersSayfasi] = useState(false)
  const [secimAcik, setSecimAcik] = useState(false)
  const [secili, setSecili] = useState<string[]>([])
  const [sonucAcik, setSonucAcik] = useState(false)

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
  const ozet = useMemo(
    () => (sablon ? istatistikOzeti(sablonDenemeleri, sablon) : null),
    [sablon, sablonDenemeleri],
  )

  const karsilastirma = useMemo(() => {
    if (!sablon || secili.length !== 2) return null
    const [x, y] = secili.map((id) => sablonDenemeleri.find((d) => d.id === id))
    return x && y ? denemeKarsilastir(x, y, sablon) : null
  }, [sablon, sablonDenemeleri, secili])

  const baslik = (
    <div className="mb-2 flex items-start justify-between gap-3">
      <h1 className="font-display text-[27px] font-extrabold tracking-[-0.02em]">İstatistik</h1>
      <AracSimgesi arac="istatistik" />
    </div>
  )

  if (!sablon || !ozet) {
    return (
      <div>
        {baslik}
        <BosDurum
          simge={<Rabi durum="uykulu" poz="kahveli" boyut={96} />}
          baslik="Henüz veri yok"
          aciklama="Deneme ekledikçe son netin, hangi derste kazanıp kaybettiğin ve denemelerinin karşılaştırması burada oluşur."
        />
      </div>
    )
  }

  const ilerleyenler = ilerleyenDersler(ozet.degisimler)
  const sonFark = ozet.oncekiNet === null ? null : ozet.sonNet - ozet.oncekiNet

  const karsilastirmaAc = () => {
    setSecili([])
    setSecimAcik(true)
  }
  const karsilastirmaKapat = () => {
    setSonucAcik(false)
    setSecimAcik(false)
    setSecili([])
  }

  return (
    <div>
      {baslik}

      {/* Her deneme türü kendi içinde hesaplanır: TYT ile seviye tespit sınavının
          soru sayısı farklı olduğu için netleri aynı ortalamaya girmez. */}
      <div className="mb-3 flex gap-2">
        {secilebilir.map((s) => {
          const aktif = s.id === sablon.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSablonId(s.id)}
              aria-pressed={aktif}
              className={cn(
                'h-[46px] min-w-0 flex-1 truncate rounded-[13px] px-1.5 text-[15px] font-extrabold leading-tight transition active:brightness-95',
                aktif
                  ? 'bg-primary-parlak text-white'
                  : 'border border-border bg-card text-muted-foreground',
              )}
            >
              {s.ad}
            </button>
          )
        })}
      </div>

      {/* Son deneme neti + son dört denemenin sütunları */}
      <div className="golge-kart mb-3 rounded-2xl bg-card px-4 pt-4 pb-3.5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-muted-foreground">Son deneme neti</p>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="rakam text-[38px] font-black leading-none tracking-[-0.03em]">
                {netYaz(ozet.sonNet)}
              </span>
              {sonFark !== null && (
                <span
                  className={cn(
                    'rakam inline-flex items-center whitespace-nowrap rounded-full px-[9px] py-[3px] text-[12.5px] font-extrabold',
                    sonFark >= 0 ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
                  )}
                >
                  {sonFark >= 0 ? '+' : '−'}
                  {netYaz(Math.abs(sonFark))}
                </span>
              )}
            </div>
            <div className="mt-2.5 flex items-stretch">
              <div className="pr-3.5">
                <p className="text-[11px] font-extrabold tracking-[0.06em] text-muted-foreground">
                  ÖNCEKİ
                </p>
                <p className="rakam text-[19px] font-black leading-[1.15]">
                  {ozet.oncekiNet === null ? '—' : netYaz(ozet.oncekiNet)}
                </p>
              </div>
              <div className="w-px bg-border" />
              <div className="pl-3.5">
                <p className="text-[11px] font-extrabold tracking-[0.06em] text-muted-foreground">
                  ORTALAMA
                </p>
                <p className="rakam text-[19px] font-black leading-[1.15]">
                  {netYaz(ozet.ortalama)}
                </p>
              </div>
            </div>
          </div>
          <MiniSutunlar netler={ozet.sonDortNet} />
        </div>
      </div>

      {/* En çok ilerleyen dersler */}
      <div className="golge-kart rounded-2xl bg-card pt-1.5 pb-1">
        <div className="flex items-center justify-between gap-2.5 px-4 pt-2.5 pb-2">
          <p className="whitespace-nowrap text-base font-extrabold tracking-[-0.01em]">
            En çok ilerleyen dersler
          </p>
          {ozet.degisimler.length > 0 && (
            <button
              type="button"
              onClick={() => setDersSayfasi(true)}
              className="flex shrink-0 items-center gap-[3px] whitespace-nowrap text-[13px] font-extrabold text-primary active:opacity-70"
            >
              Daha fazla
              <ChevronRight size={14} strokeWidth={2.8} aria-hidden />
            </button>
          )}
        </div>
        {ilerleyenler.length === 0 ? (
          <p className="border-t border-border px-4 py-3 text-[13.5px] font-bold text-muted-foreground/70">
            {ozet.oncekiNet === null
              ? 'İkinci denemeni ekleyince hangi derste ilerlediğin burada görünür.'
              : 'Son denemede neti artan ders yok.'}
          </p>
        ) : (
          ilerleyenler.slice(0, ILERLEYEN_SAYISI).map((d, i) => (
            <div key={d.dersId} className="flex items-center gap-3 border-t border-border px-4 py-2">
              <span className="grid size-[26px] shrink-0 place-items-center rounded-[9px] bg-danger-soft text-[12.5px] font-black text-danger">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-extrabold tracking-[-0.01em]">
                  {d.ad}
                </span>
                <span className="mt-1.5 block h-1.5 overflow-hidden rounded-[3px] bg-muted">
                  <span
                    className="block h-1.5 rounded-[3px] bg-danger"
                    style={{ width: `${Math.round((d.fark / ilerleyenler[0].fark) * 100)}%` }}
                  />
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="rakam block text-base font-black text-success">
                  +{netYaz(d.fark)}
                </span>
                <span className="rakam block whitespace-nowrap text-[11.5px] font-bold text-muted-foreground">
                  {netYaz(d.onceki)} → {netYaz(d.son)}
                </span>
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <OzetKutusu etiket="En güçlü ders" deger={ozet.enGucluDers ?? '—'} ton="iyi" />
        <OzetKutusu etiket="En kötü ders" deger={ozet.enZayifDers ?? '—'} ton="kotu" />
        <OzetKutusu etiket="En yüksek net" deger={netYaz(ozet.enYuksek)} rakam />
        <OzetKutusu etiket="En düşük net" deger={netYaz(ozet.enDusuk)} rakam />
      </div>

      <button
        type="button"
        onClick={karsilastirmaAc}
        disabled={sablonDenemeleri.length < 2}
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[17.9px] bg-primary-parlak text-[15px] font-bold text-white transition active:brightness-95 disabled:bg-grid disabled:text-muted-foreground/70"
      >
        <ArrowLeftRight size={17} strokeWidth={2.4} aria-hidden />
        Deneme karşılaştır
      </button>

      {dersSayfasi && (
        <DersSayfasi
          degisimler={ozet.degisimler}
          altYazi={`${ozet.degisimler.length} ders · ${sablon.ad} · ${ozet.denemeSayisi} deneme`}
          onKapat={() => setDersSayfasi(false)}
        />
      )}

      {secimAcik && !sonucAcik && (
        <SecimSayfasi
          sablonAdi={sablon.ad}
          denemeler={sablonDenemeleri}
          sablon={sablon}
          secili={secili}
          onSec={(id) => setSecili((s) => secimGuncelle(s, id))}
          onKarsilastir={() => karsilastirma && setSonucAcik(true)}
          onKapat={karsilastirmaKapat}
        />
      )}

      {sonucAcik && karsilastirma && (
        <KarsilastirmaKatmani k={karsilastirma} onKapat={karsilastirmaKapat} />
      )}
    </div>
  )
}

/** Son dört denemenin toplam neti; en yenisi dolu turuncu, eskiler soluklaşıyor. */
function MiniSutunlar({ netler }: { netler: number[] }) {
  // Net eksiye düşebiliyor; sütun boyu sıfırın altına inmiyor.
  const enBuyuk = Math.max(...netler, 0.01)
  return (
    <div className="mr-1 flex h-[86px] items-end gap-[5px]" aria-hidden>
      {netler.map((n, i) => {
        const son = i === netler.length - 1
        const onceki = i === netler.length - 2
        return (
          <div key={i} className="flex h-full flex-col items-center justify-end gap-[3px]">
            <span
              className={cn(
                'rakam whitespace-nowrap text-[10.5px]',
                son ? 'font-black text-primary' : 'font-bold text-muted-foreground',
              )}
            >
              {netYaz(n, 1)}
            </span>
            <div
              className={cn(
                'w-[30px] rounded-t-[7px] rounded-b-[3px]',
                son ? 'bg-primary-parlak' : onceki ? 'bg-primary-parlak/35' : 'bg-primary-parlak/20',
              )}
              style={{ height: Math.round((Math.max(0, n) / enBuyuk) * 60) }}
            />
          </div>
        )
      })}
    </div>
  )
}

function OzetKutusu({
  etiket,
  deger,
  ton,
  rakam,
}: {
  etiket: string
  deger: string
  ton?: 'iyi' | 'kotu'
  rakam?: boolean
}) {
  return (
    <div
      className={cn(
        'min-w-0 rounded-[14px] px-3 py-2.5',
        ton === 'iyi' ? 'bg-success-soft' : ton === 'kotu' ? 'bg-danger-soft' : 'bg-muted',
      )}
    >
      <p
        className={cn(
          'text-[11.5px] font-bold',
          ton === 'iyi' ? 'text-success' : ton === 'kotu' ? 'text-danger' : 'text-muted-foreground',
        )}
      >
        {etiket}
      </p>
      <p
        className={cn(
          'truncate text-[19px] font-black',
          rakam && 'rakam',
          ton === 'iyi' ? 'text-success' : ton === 'kotu' ? 'text-danger' : 'text-foreground',
        )}
      >
        {deger}
      </p>
    </div>
  )
}

function FarkRozeti({ fark, className }: { fark: number; className?: string }) {
  return (
    <span
      className={cn(
        'rakam grid min-w-[58px] shrink-0 place-items-center whitespace-nowrap rounded-full px-[9px] py-[3px] font-black',
        ROZET_ZEMIN[yon(fark)],
        className,
      )}
    >
      {farkYaz(fark, netYaz)}
    </span>
  )
}

/** Alttan açılan sayfa; zemin ekranın kendisi, içindeki liste beyaz kartta. */
function AltSayfa({
  yukseklik,
  onKapat,
  children,
}: {
  yukseklik: string
  onKapat: () => void
  children: React.ReactNode
}) {
  useGeriKatmani(true, onKapat)
  return (
    <div
      className="katman-zemin fixed inset-0 z-50 flex items-end justify-center bg-foreground/35"
      onClick={onKapat}
    >
      <div
        className={cn(
          'alt-pencere-girisi flex w-full max-w-md flex-col rounded-t-[26px] bg-background shadow-[0_-12px_34px_rgba(54,33,112,0.2)]',
          yukseklik,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function KapatDugmesi({ onClick, etiket = 'Kapat' }: { onClick: () => void; etiket?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiket}
      className="grid size-8 shrink-0 place-items-center rounded-[11px] bg-muted text-muted-foreground active:brightness-95"
    >
      <X size={17} strokeWidth={2.6} aria-hidden />
    </button>
  )
}

function Tutamak() {
  return <div className="mx-auto mb-3.5 h-1 w-10 rounded-sm bg-grid" />
}

function DersSayfasi({
  degisimler,
  altYazi,
  onKapat,
}: {
  degisimler: DersDegisimi[]
  altYazi: string
  onKapat: () => void
}) {
  const sirali = [...degisimler].sort((a, b) => b.fark - a.fark)
  const enBuyuk = Math.max(...degisimler.map((d) => Math.abs(d.fark)), 0.5)
  return (
    <AltSayfa yukseklik="max-h-[82%]" onKapat={onKapat}>
      <div className="shrink-0 px-[18px] pt-3.5 pb-2.5">
        <Tutamak />
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold tracking-[-0.02em]">Ders bazında ilerleyiş</h2>
          <KapatDugmesi onClick={onKapat} />
        </div>
        <p className="mt-1.5 text-[12.5px] font-bold text-muted-foreground">{altYazi}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-[18px] pt-1 pb-[calc(1.25rem+var(--guvenli-alt))]">
        <div className="golge-kart overflow-hidden rounded-[18px] bg-card">
          {sirali.map((d, i) => (
            <div
              key={d.dersId}
              className={cn('flex items-center gap-3 px-3.5 py-[11px]', i > 0 && 'border-t border-border/70')}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14.5px] font-extrabold tracking-[-0.01em]">
                  {d.ad}
                </span>
                <span className="mt-1.5 block h-1.5 overflow-hidden rounded-[3px] bg-muted">
                  <span
                    className={cn('block h-1.5 rounded-[3px]', CUBUK_RENGI[yon(d.fark)])}
                    style={{
                      width: `${Math.max(6, Math.round((Math.abs(d.fark) / enBuyuk) * 100))}%`,
                    }}
                  />
                </span>
              </span>
              <span className="rakam shrink-0 whitespace-nowrap text-[12.5px] font-extrabold text-muted-foreground/70">
                {netYaz(d.onceki)} → {netYaz(d.son)}
              </span>
              <FarkRozeti fark={d.fark} className="text-[12.5px]" />
            </div>
          ))}
        </div>
      </div>
    </AltSayfa>
  )
}

function SecimSayfasi({
  sablonAdi,
  denemeler,
  sablon,
  secili,
  onSec,
  onKarsilastir,
  onKapat,
}: {
  sablonAdi: string
  denemeler: Deneme[]
  sablon: Sablon
  secili: string[]
  onSec: (id: string) => void
  onKarsilastir: () => void
  onKapat: () => void
}) {
  const hazir = secili.length === 2
  // Rozet seçim sırasını değil tarihi söylüyor: karşılaştırmada A hep eski deneme.
  const seciliSirali = denemeler
    .filter((d) => secili.includes(d.id))
    .sort((a, b) => a.tarih.localeCompare(b.tarih))
    .map((d) => d.id)
  const liste = [...denemeler].sort((a, b) => b.tarih.localeCompare(a.tarih))
  const netler = useMemo(() => {
    const m = new Map<string, number>()
    for (const d of denemeler) m.set(d.id, denemeOzeti(d, sablon).toplamNet)
    return m
  }, [denemeler, sablon])

  return (
    <AltSayfa yukseklik="max-h-[78%]" onKapat={onKapat}>
      <div className="shrink-0 px-[18px] pt-3.5">
        <Tutamak />
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold tracking-[-0.02em]">Deneme karşılaştır</h2>
          <KapatDugmesi onClick={onKapat} />
        </div>
        <div className="mt-3.5 flex items-baseline justify-between gap-2.5">
          <p className="truncate text-xs font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
            {sablonAdi.toLocaleUpperCase('tr-TR')} DENEMELERİN
          </p>
          <span className="shrink-0 text-[12.5px] font-extrabold text-primary">
            {secili.length === 0
              ? 'İki deneme seç'
              : secili.length === 1
                ? 'Bir deneme daha seç'
                : 'Karşılaştırmaya hazır'}
          </span>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto px-[18px] pt-2.5 pb-1">
        {liste.map((d) => {
          const sira = seciliSirali.indexOf(d.id)
          const aktif = sira >= 0
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSec(d.id)}
              aria-pressed={aktif}
              className={cn(
                'flex w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-3 text-left transition',
                aktif ? 'border-primary-parlak bg-primary-soft' : 'border-border bg-card',
              )}
            >
              <span
                className={cn(
                  'grid size-[26px] shrink-0 place-items-center rounded-[9px] text-[13px] font-black',
                  aktif ? 'bg-primary-parlak text-white' : 'border-2 border-grid bg-card',
                )}
              >
                {aktif ? (sira === 0 ? 'A' : 'B') : ''}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-extrabold tracking-[-0.01em]">
                  {d.ad || sablonAdi}
                </span>
                <span className="block text-[12.5px] font-semibold text-muted-foreground">
                  {kisaTarih(d.tarih)}
                </span>
              </span>
              <span className="rakam shrink-0 text-base font-black">
                {netYaz(netler.get(d.id) ?? 0)}
              </span>
            </button>
          )
        })}
      </div>
      <div className="shrink-0 border-t border-border bg-background px-[18px] pt-3 pb-[calc(1.25rem+var(--guvenli-alt))]">
        <button
          type="button"
          onClick={onKarsilastir}
          disabled={!hazir}
          className="h-12 w-full rounded-[17.9px] bg-primary-parlak text-base font-extrabold text-white transition active:brightness-95 disabled:bg-grid disabled:text-muted-foreground/70"
        >
          Karşılaştır
        </button>
      </div>
    </AltSayfa>
  )
}

function KarsilastirmaKatmani({
  k,
  onKapat,
}: {
  k: ReturnType<typeof denemeKarsilastir>
  onKapat: () => void
}) {
  useGeriKatmani(true, onKapat)
  const enCokDusen = k.azalanlar[0] ?? null
  const enCokArtan = k.artanlar[0] ?? null

  return (
    <div className="tam-katman-girisi fixed inset-0 z-50 flex yuk-ekran justify-center bg-background">
      <div className="flex w-full max-w-md flex-col">
        <div
          className="shrink-0 border-b border-border bg-card px-4 pb-3"
          style={{ paddingTop: 'calc(1rem + var(--guvenli-ust))' }}
        >
          <KapatDugmesi onClick={onKapat} etiket="Karşılaştırmayı kapat" />
          <h2 className="mt-2.5 text-[19px] font-extrabold tracking-[-0.02em]">Karşılaştırma</h2>
          <div className="mt-2.5 flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-extrabold tracking-[0.06em] text-muted-foreground">
                A · {kisaTarih(k.a.tarih)}
              </p>
              <p className="mt-px truncate text-sm font-extrabold">{k.a.ad}</p>
              <p className="rakam text-[26px] font-black leading-[1.1] tracking-[-0.03em] text-muted-foreground/70">
                {netYaz(k.aNet)}
              </p>
            </div>
            <div className="w-px self-stretch bg-border" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-extrabold tracking-[0.06em] text-primary">
                B · {kisaTarih(k.b.tarih)}
              </p>
              <p className="mt-px truncate text-sm font-extrabold">{k.b.ad}</p>
              <p className="rakam text-[26px] font-black leading-[1.1] tracking-[-0.03em] text-primary">
                {netYaz(k.bNet)}
              </p>
            </div>
          </div>
          <div className="mt-2.5">
            <span
              className={cn(
                'rakam inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-[7px] text-[15px] font-black',
                k.toplamFark >= 0 ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
              )}
            >
              {farkYaz(k.toplamFark, netYaz)} net
            </span>
          </div>
        </div>

        <div
          className="scrollbar-gizli min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 pt-2.5"
          style={{ paddingBottom: 'calc(1.5rem + var(--guvenli-alt))' }}
        >
          <DegisimKutusu
            ton="artti"
            baslik={`Kazandığın netler · ${k.artanlar.length} ders`}
            bosYazi="Bu iki deneme arasında net kazandığın ders yok."
            satirlar={k.artanlar}
          />
          <DegisimKutusu
            ton="azaldi"
            baslik={`Kaybettiğin netler · ${k.azalanlar.length} ders`}
            bosYazi="Hiçbir derste net kaybetmemişsin."
            satirlar={k.azalanlar}
          />
          {k.sabitler.length > 0 && (
            <div className="golge-kart mb-[9px] overflow-hidden rounded-2xl bg-card">
              <div className="flex items-center gap-[7px] bg-muted px-3.5 py-2">
                <Minus size={14} strokeWidth={2.8} className="text-muted-foreground" aria-hidden />
                <span className="text-[13px] font-extrabold tracking-[-0.01em] text-muted-foreground">
                  Değişmeyen netler · {k.sabitler.length} ders
                </span>
              </div>
              {k.sabitler.map((s) => (
                <div
                  key={s.dersId}
                  className="flex items-center gap-2.5 border-t border-border/70 px-3.5 py-[7px]"
                >
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-extrabold tracking-[-0.01em]">
                    {s.ad}
                  </span>
                  <span className="rakam shrink-0 whitespace-nowrap text-xs font-extrabold text-muted-foreground/70">
                    {netYaz(s.son)} net
                  </span>
                  <span className="rakam grid min-w-[42px] shrink-0 place-items-center rounded-full bg-muted px-2 py-[3px] text-[12.5px] font-black text-muted-foreground">
                    %0
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-[9px]">
            <div className="golge-kart min-w-0 rounded-2xl border-[1.5px] border-danger/25 bg-card px-[13px] py-2.5">
              <p className="text-[11.5px] font-extrabold tracking-[0.06em] text-danger">
                EN BÜYÜK DÜŞÜŞ
              </p>
              <p className="truncate text-[17px] font-black tracking-[-0.02em] text-danger">
                {enCokDusen ? enCokDusen.ad : 'Yok'}
              </p>
              <p className="rakam text-xs font-bold text-muted-foreground">
                {enCokDusen
                  ? `${netYaz(Math.abs(enCokDusen.fark))} net kaybettirdi`
                  : 'Düşen ders yok'}
              </p>
            </div>
            <div className="golge-kart min-w-0 rounded-2xl border-[1.5px] border-success/25 bg-card px-[13px] py-2.5">
              <p className="text-[11.5px] font-extrabold tracking-[0.06em] text-success">
                EN BÜYÜK SIÇRAMA
              </p>
              <p className="truncate text-[17px] font-black tracking-[-0.02em] text-success">
                {enCokArtan ? enCokArtan.ad : 'Yok'}
              </p>
              <p className="rakam text-xs font-bold text-muted-foreground">
                {enCokArtan
                  ? `${netYaz(Math.abs(enCokArtan.fark))} net kazandırdı`
                  : 'Yükselen ders yok'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DegisimKutusu({
  ton,
  baslik,
  bosYazi,
  satirlar,
}: {
  ton: 'artti' | 'azaldi'
  baslik: string
  bosYazi: string
  satirlar: DersDegisimi[]
}) {
  const Simge = ton === 'artti' ? TrendingUp : TrendingDown
  return (
    <div className="golge-kart mb-[9px] overflow-hidden rounded-2xl bg-card">
      <div
        className={cn(
          'flex items-center gap-[7px] px-3.5 py-2',
          ton === 'artti' ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
        )}
      >
        <Simge size={14} strokeWidth={2.8} aria-hidden />
        <span className="text-[13px] font-extrabold tracking-[-0.01em]">{baslik}</span>
      </div>
      {satirlar.length === 0 ? (
        <p className="border-t border-border/70 px-4 py-[13px] text-[13.5px] font-bold text-muted-foreground/70">
          {bosYazi}
        </p>
      ) : (
        satirlar.map((s) => (
          <div
            key={s.dersId}
            className="flex items-center gap-2.5 border-t border-border/70 px-3.5 py-[7px]"
          >
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-extrabold tracking-[-0.01em]">
              {s.ad}
            </span>
            <span className="rakam flex shrink-0 items-baseline gap-[5px] whitespace-nowrap text-xs font-extrabold">
              <span className="text-muted-foreground/70">{netYaz(s.onceki)}</span>
              <span className="text-muted-foreground/40">→</span>
              <span className="text-primary">{netYaz(s.son)}</span>
            </span>
            <FarkRozeti fark={s.fark} className="text-[13px]" />
          </div>
        ))
      )}
    </div>
  )
}
