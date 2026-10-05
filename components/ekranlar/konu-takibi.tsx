'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronRight, GraduationCap, Map as HaritaSimgesi, PencilLine } from 'lucide-react'
import { Haptics, NotificationType } from '@capacitor/haptics'
import type { PuanTuru } from '@/lib/types'
import type { KonuDersId } from '@/lib/konu/tip'
import type { KonuIlerlemeleri } from '@/lib/konu/ilerleme'
import {
  ALAN_ADLARI,
  dersAdi,
  oturumDersleri,
  type YksDers,
  type YksKonu,
  type YksOturum,
} from '@/lib/konu-takibi/liste'
import {
  asamaYaz,
  devamKonusu,
  dersOzeti,
  eksikAsamalar,
  konuDurumu,
  okuluTopluYaz,
  oncekiOkulsuzlar,
  siradakiKonu,
  bitirmeyeHazir,
  toplamOzet,
  type AsamaId,
  type DersOzeti,
  type HaritaKonumu,
  type KonuDurumu,
  type YazilanAlan,
  type YksTakip,
} from '@/lib/konu-takibi/takip'
import { useGeriKatmani } from '@/lib/geri'
import { bugun, cn, tariheCevir } from '@/lib/utils'
import { BaslikSatiri, Cip, Kart, Not } from '@/components/ui'
import { dersVurgusu } from '@/components/ders-renkleri'
import { Konfeti } from '@/components/oyun-kabuk'

/**
 * Konu Takibi — YKS konularını aşama aşama işaretleme.
 *
 * Akış iki kat: TYT/AYT sekmesi → ders listesi → dersin konu listesi.
 * İşaretleme **satırın kendisinde**: soldaki ilerleme dairesi "Bitirdim"i,
 * sağdaki okul ve soru yuvaları kendi aşamasını aç/kapa yapıyor. Bir süre
 * aşamalar satırın altında açılan bir kartta işaretleniyordu ve bir konu
 * dört-beş dokunuş istiyordu (aç → okul → soru → Bitirdim → onay); otuz
 * konuluk bir derste bu, aracı açmamak için yeterli sebepti.
 *
 * Hesapların hepsi `lib/konu-takibi/`de; bu dosya yalnızca çiziyor.
 */

/** Aşamaların adı ve simgesi — satırın yuvaları, lejant ve ekran okuyucu aynı. */
const ASAMA: Record<AsamaId, { ad: string; kisa: string; Simge: typeof Check }> = {
  harita: { ad: 'Haritada çalıştım', kisa: 'harita', Simge: HaritaSimgesi },
  okul: { ad: 'Okulda öğrendim', kisa: 'okul', Simge: GraduationCap },
  soru: { ad: 'Soru çözdüm', kisa: 'soru', Simge: PencilLine },
}

/** Kutlamanın ekranda kaldığı süre — konfetinin en geç parçası (610 ms) + düşüşü. */
const KUTLAMA_SURESI = 2200

/** Bildirimin ekranda kaldığı süre. "Geri al"a uzanacak kadar uzun, kalıcı değil. */
const BILDIRIM_SURESI = 4500

/*
  Oturumluk hatırlananlar: seçili sekme, açık ders ve ders listesinin kaydırma
  konumu. Araçtan çıkıp dönen öğrenci kaldığı dersi bulsun; ama bunlar kalıcı
  bir ayar değil, uygulama kapanınca başa dönmek doğru. `sessionStorage`
  gizli pencerede ya da kısıtlı WebView'da atabiliyor, o yüzden her erişim
  sarılı ve ekran onsuz da doğru çalışıyor.
*/
const OTURUM_ANAHTARI = 'rabi-konu-takibi-sekme'
const DERS_ANAHTARI = 'rabi-konu-takibi-ders'
const KAYDIRMA_ANAHTARI = 'rabi-konu-takibi-kaydirma'

function oturumOku(anahtar: string): string | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage.getItem(anahtar)
  } catch {
    return null
  }
}

function oturumYaz(anahtar: string, deger: string | null) {
  try {
    if (deger === null) window.sessionStorage.removeItem(anahtar)
    else window.sessionStorage.setItem(anahtar, deger)
  } catch {
    // Hatırlanmasa da olur.
  }
}

/**
 * Ders renginin tonları. Haritada karşılığı olan ders haritadaki rengini
 * taşıyor; olmayan (Felsefe, Din) Yanlış Soru Bankası'ndaki gibi nötr.
 */
function renkler(renk: KonuDersId | null) {
  if (!renk) {
    return {
      zemin: 'var(--muted)',
      kenar: 'var(--border)',
      koyu: 'var(--foreground)',
      dolgu: 'var(--muted-foreground)',
    }
  }
  return {
    zemin: `var(--konu-${renk})`,
    kenar: `var(--konu-${renk}-kenar)`,
    koyu: `var(--konu-${renk}-koyu)`,
    dolgu: `var(--konu-${renk}-ok)`,
  }
}

type Renkler = ReturnType<typeof renkler>

/** Ders seçilmemişken (giriş ekranının özeti) markanın tonları. */
const MARKA_RENGI: Renkler = {
  zemin: 'var(--primary-soft)',
  kenar: 'var(--primary-soft)',
  koyu: 'var(--primary)',
  dolgu: 'var(--primary-parlak)',
}

/** 'YYYY-AA-GG' → "4 Ekim". Yıl yazılmıyor: işaretler bu sınav yılına ait. */
function gunYazisi(iso: string): string {
  return tariheCevir(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
}

export function KonuTakibiEkrani({
  takip,
  setTakip,
  ilerlemeler,
  alan,
  setAlan,
  onHaritayaGit,
}: {
  takip: YksTakip
  setTakip: (guncelle: (onceki: YksTakip) => YksTakip) => void
  /** Konu haritasının kaydı — "Haritada çalıştım" buradan hesaplanıyor. */
  ilerlemeler: KonuIlerlemeleri
  /** Ayarlardaki alan; `null` "Karar vermedim". */
  alan: PuanTuru | null
  /** Alan seçilmemişse AYT sekmesinde soruluyor; cevap ayarlara yazılıyor. */
  setAlan: (alan: PuanTuru) => void
  onHaritayaGit: (konum: HaritaKonumu) => void
}) {
  const [oturum, setOturum] = useState<YksOturum>(() => (oturumOku(OTURUM_ANAHTARI) === 'ayt' ? 'ayt' : 'tyt'))
  const [acikDersId, setAcikDersId] = useState<string | null>(() => oturumOku(DERS_ANAHTARI))
  /** Ders "Devam et"ten açıldıysa ders ekranının açıp göstereceği konu. */
  const [hedefKonu, setHedefKonu] = useState<string | null>(null)
  /** Ders listesinin kaydırma konumu — ders kapanınca geri geliyor. */
  const listeKaydirma = useRef(Number(oturumOku(KAYDIRMA_ANAHTARI)) || 0)

  useEffect(() => oturumYaz(OTURUM_ANAHTARI, oturum), [oturum])
  useEffect(() => oturumYaz(DERS_ANAHTARI, acikDersId), [acikDersId])

  const tytDersleri = useMemo(() => oturumDersleri('tyt', alan), [alan])
  const aytDersleri = useMemo(() => oturumDersleri('ayt', alan), [alan])
  const dersler = oturum === 'tyt' ? tytDersleri : aytDersleri

  /*
    Ders özetleri bir kez hesaplanıyor; sekmenin özeti ve ders satırları aynı
    tablodan okuyor.
  */
  const ozetler = useMemo(() => {
    const tablo = new Map<string, DersOzeti>()
    for (const ders of [...tytDersleri, ...aytDersleri]) tablo.set(ders.id, dersOzeti(ders, takip, ilerlemeler))
    return tablo
  }, [tytDersleri, aytDersleri, takip, ilerlemeler])

  const toplam = toplamOzet(dersler.map((d) => ozetler.get(d.id)!))
  const devam = useMemo(
    () => devamKonusu([...tytDersleri, ...aytDersleri], takip, ilerlemeler),
    [tytDersleri, aytDersleri, takip, ilerlemeler],
  )
  /** Hiç işaret yok — ilk kullanım ipucu bundan türüyor, ayrı bir ayar tutulmuyor. */
  const bos = Object.keys(takip.konular).length === 0

  const dersAc = (ders: YksDers, konuId: string | null = null) => {
    listeKaydirma.current = window.scrollY
    oturumYaz(KAYDIRMA_ANAHTARI, String(Math.round(window.scrollY)))
    setOturum(ders.oturum)
    setHedefKonu(konuId)
    setAcikDersId(ders.id)
  }

  /*
    Ders açılınca sayfa başa, kapanınca ders listesinde kalınan yere. Pencere
    kaydırılıyor ve iki görünüm aynı kökte yer değiştiriyor; ayarlanmasaydı
    listenin dibinden açılan ders de dibinden açılır, dönüşte liste başa
    sıçrardı. Boyamadan önce (`useLayoutEffect`): sonra yapılsaydı bir kare
    yanlış yerde görünürdü.
  */
  const ilkCizim = useRef(true)
  useLayoutEffect(() => {
    if (ilkCizim.current) {
      ilkCizim.current = false
      return
    }
    if (acikDersId === null) window.scrollTo(0, listeKaydirma.current)
    else window.scrollTo(0, 0)
  }, [acikDersId])

  const acikDers = dersler.find((d) => d.id === acikDersId) ?? null
  // Android'in geri tuşu ve kabuğun "Geri"si önce dersi kapatıyor, sonra araçtan çıkıyor.
  useGeriKatmani(acikDers !== null, () => setAcikDersId(null))

  if (acikDers) {
    return (
      <DersEkrani
        key={acikDers.id}
        ders={acikDers}
        ad={dersAdi(acikDers, alan)}
        ozet={ozetler.get(acikDers.id)!}
        takip={takip}
        setTakip={setTakip}
        ilerlemeler={ilerlemeler}
        bos={bos}
        hedefKonu={hedefKonu}
        onHaritayaGit={onHaritayaGit}
      />
    )
  }

  return (
    <div>
      <BaslikSatiri baslik="Konu Takibi" arac="konu-takibi" />

      <div className="mb-3 flex gap-1 rounded-[14px] bg-muted p-1" role="tablist">
        <SegmentDugmesi secili={oturum === 'tyt'} onClick={() => setOturum('tyt')}>
          TYT
        </SegmentDugmesi>
        <SegmentDugmesi secili={oturum === 'ayt'} onClick={() => setOturum('ayt')}>
          {alan === 'dil' ? 'YDT' : 'AYT'}
        </SegmentDugmesi>
      </div>

      {devam && <DevamKarti ders={devam.ders} konu={devam.konu} alan={alan} onAc={() => dersAc(devam.ders, devam.konu.id)} />}
      {bos && <IlkKullanim />}

      {oturum === 'ayt' && alan === null ? (
        <AlanSorusu onSec={setAlan} />
      ) : (
        <>
          <Kart className="py-3.5">
            <OzetCubugu ozet={toplam} r={MARKA_RENGI} />
          </Kart>

          {oturum === 'ayt' && (
            <Not className="mt-3">
              {alan === 'dil'
                ? 'YDT, alanın Dil olduğu için burada. '
                : `${ALAN_ADLARI[alan!]} alanının AYT dersleri. `}
              {alan !== 'dil' && 'AYT, TYT konularını da sorar; burada yalnızca AYT’ye özgü konular var. '}
              Alanını Ayarlar › Alanım’dan değiştirebilirsin.
            </Not>
          )}

          <ul className="golge-kart mt-4 overflow-hidden rounded-[22px] bg-card">
            {dersler.map((ders) => (
              <li key={ders.id} className="border-t border-border first:border-t-0">
                <DersSatiri
                  ders={ders}
                  ad={dersAdi(ders, alan)}
                  ozet={ozetler.get(ders.id)!}
                  siradaki={siradakiKonu(ders, takip, ilerlemeler)}
                  onAc={() => dersAc(ders)}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

/** Yanlış Soru Bankası'ndaki bölümlü seçicinin aynısı (`yanlis-banka.tsx`). */
function SegmentDugmesi({
  secili,
  onClick,
  children,
}: {
  secili: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={secili}
      onClick={onClick}
      className={cn(
        'flex h-10 min-w-0 flex-1 items-center justify-center rounded-[11px] text-sm font-extrabold transition-[background-color,box-shadow] duration-200',
        secili
          ? 'bg-card text-primary shadow-[0_1px_3px_rgba(27,26,25,0.12),0_1px_1px_rgba(27,26,25,0.04)]'
          : 'text-muted-foreground',
      )}
    >
      {children}
    </button>
  )
}

/**
 * Dersler arası en son işaretlenen yarım konu. Tek kart ve tek iş: oraya
 * dön. Hiç işaret yokken çizilmiyor — dokunulmamış bir konuya "devam"
 * denmez.
 */
function DevamKarti({
  ders,
  konu,
  alan,
  onAc,
}: {
  ders: YksDers
  konu: YksKonu
  alan: PuanTuru | null
  onAc: () => void
}) {
  const r = renkler(ders.renk)
  return (
    <button
      type="button"
      onClick={onAc}
      className="golge-kart mb-3 flex w-full items-center gap-3 rounded-[18px] bg-card px-3.5 py-3 text-left transition active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span
        className="emoji grid size-10 shrink-0 place-items-center rounded-[13px] text-[19px] leading-none"
        style={{ background: r.zemin }}
        aria-hidden
      >
        {ders.ikon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-extrabold tracking-[0.06em] uppercase" style={{ color: r.koyu }}>
          Devam et · {ders.oturum === 'tyt' ? 'TYT' : ders.id === 'ydt' ? 'YDT' : 'AYT'} {dersAdi(ders, alan)}
        </span>
        <span className="mt-0.5 block truncate text-[15px] leading-snug font-extrabold">{konu.ad}</span>
      </span>
      <ChevronRight size={18} strokeWidth={2.6} aria-hidden className="shrink-0" style={{ color: r.koyu }} />
    </button>
  )
}

/** Hiç işaret yokken tek cümlelik yön ve aşama simgelerinin lejantı. İlk işaretle kalkıyor. */
function IlkKullanim({ haritali = true }: { haritali?: boolean }) {
  return (
    <div className="mb-3 rounded-2xl bg-muted/70 px-3.5 py-3">
      <p className="text-[13.5px] leading-snug font-bold text-pretty">
        Okulda işlediğin konuları işaretleyerek başla; çok konu işlendiyse bir konuyu açıp
        &ldquo;bu ve öncekiler&rdquo;i kullan.
      </p>
      <Lejant haritali={haritali} className="mt-2" />
    </div>
  )
}

function Lejant({ haritali, className }: { haritali: boolean; className?: string }) {
  const asamalar: AsamaId[] = haritali ? ['harita', 'okul', 'soru'] : ['okul', 'soru']
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-bold text-muted-foreground', className)}>
      <li className="flex items-center gap-1.5">
        <span className="grid size-[18px] place-items-center rounded-full bg-success text-white" aria-hidden>
          <Check size={11} strokeWidth={3.4} />
        </span>
        Bitirdim
      </li>
      {asamalar.map((a) => {
        const { Simge } = ASAMA[a]
        return (
          <li key={a} className="flex items-center gap-1.5">
            <Simge size={14} strokeWidth={2.3} aria-hidden />
            {ASAMA[a].ad}
            {a === 'harita' && <span className="font-semibold">(kendiliğinden)</span>}
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Segmentli ince çubuk + tek satır sayı: bitti › soru çözüldü › okulda
 * işlendi › kalan. Bir süre büyük bir halka yalnızca "Bitirdim"i sayıyordu
 * ve okulda işaretlemeye başlayan öğrenci haftalarca %0 görüyordu; yanında
 * aşama dağılımı ve sekme rozeti aynı sayıları üç kez daha yazıyordu.
 * Yüzde değil sayı: "12 okulda" öğrencinin yaptığı şeyi, "%7" yalnızca bir
 * oranı söylüyor.
 */
function OzetCubugu({ ozet, r, onEk }: { ozet: DersOzeti; r: Renkler; onEk?: string }) {
  const dilimler = cubukDilimleri(ozet, r)
  return (
    <div>
      <div
        className="flex h-2 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${ozet.toplam} konudan ${ozet.biten} bitti, ${ozet.soruda} konuda soru çözüldü, ${ozet.okulda} konu okulda işlendi`}
      >
        {dilimler.map((d) =>
          d.sayi > 0 ? (
            <span
              key={d.ad}
              className="h-full transition-[width] duration-300"
              style={{ width: `${(d.sayi / Math.max(1, ozet.toplam)) * 100}%`, background: d.renk, opacity: d.opaklik }}
            />
          ) : null,
        )}
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12.5px] font-bold text-muted-foreground">
        {onEk && <span className="text-foreground">{onEk}</span>}
        <Sayi renk={r.dolgu} opaklik={0.35} sayi={ozet.okul} ad="okulda" />
        <Sayi renk={r.dolgu} sayi={ozet.soru} ad="soru" />
        <Sayi renk={r.koyu} sayi={ozet.biten} ad="bitti" />
        <span>
          <span className="rakam text-foreground">{ozet.toplam}</span> konu
        </span>
      </p>
    </div>
  )
}

/**
 * Çubuğun üç dilimi, koyudan açığa: bitti › soru › okul. Okul dilimi dolgu
 * tonunun açığı — dersin `-kenar` tonu kartın üstünde neredeyse görünmüyordu
 * ve markanın (giriş ekranı) o ara tonda bir değişkeni yok.
 */
function cubukDilimleri(ozet: DersOzeti, r: Renkler) {
  return [
    { ad: 'bitti', sayi: ozet.biten, renk: r.koyu, opaklik: 1 },
    { ad: 'soru', sayi: ozet.soruda, renk: r.dolgu, opaklik: 1 },
    { ad: 'okul', sayi: ozet.okulda, renk: r.dolgu, opaklik: 0.35 },
  ]
}

function Sayi({ renk, opaklik = 1, sayi, ad }: { renk: string; opaklik?: number; sayi: number; ad: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="size-2 rounded-full" style={{ background: renk, opacity: opaklik }} aria-hidden />
      <span className="rakam text-foreground">{sayi}</span> {ad}
    </span>
  )
}

/**
 * Alan seçilmemişse AYT'de ders yok: hangi derslerin gösterileceğini
 * öğrencinin alanı belirliyor ve bir alan varsaymak onun yerine karar
 * vermek olurdu. Seçim Ayarlar › Alanım'a yazılıyor — iki ayrı alan kaydı
 * birbirini tutmazdı.
 */
function AlanSorusu({ onSec }: { onSec: (alan: PuanTuru) => void }) {
  return (
    <Kart className="text-center">
      <p className="font-display text-[17px] font-extrabold tracking-tight">Hangi alandasın?</p>
      <p className="mt-1 text-[13.5px] font-semibold text-pretty text-muted-foreground">
        AYT’de alanının derslerini göstereceğim. Seçimin Ayarlar › Alanım’a da yazılır.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {(Object.keys(ALAN_ADLARI) as PuanTuru[]).map((tur) => (
          <Cip key={tur} onClick={() => onSec(tur)}>
            {ALAN_ADLARI[tur]}
          </Cip>
        ))}
      </div>
    </Kart>
  )
}

/** Ders listesinin satırı: dersin rengi, segmentli çubuk ve sıradaki konu. */
function DersSatiri({
  ders,
  ad,
  ozet,
  siradaki,
  onAc,
}: {
  ders: YksDers
  ad: string
  ozet: DersOzeti
  siradaki: YksKonu | null
  onAc: () => void
}) {
  const r = renkler(ders.renk)
  const bitti = ozet.toplam > 0 && ozet.biten === ozet.toplam
  return (
    <button
      type="button"
      onClick={onAc}
      className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition active:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
    >
      <span
        className="emoji grid size-[42px] shrink-0 place-items-center rounded-[14px] text-[20px] leading-none"
        style={{ background: r.zemin }}
        aria-hidden
      >
        {ders.ikon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="min-w-0 flex-1 truncate font-display text-[16px] leading-tight font-extrabold tracking-tight">
            {ad}
          </span>
          <span className="shrink-0 text-[12px] font-bold text-muted-foreground">
            <span className="rakam text-foreground">{ozet.biten}</span>/<span className="rakam">{ozet.toplam}</span> bitti
          </span>
        </span>
        <DersCubugu ozet={ozet} r={r} />
        <span className="mt-1.5 block truncate text-[12.5px] font-semibold text-muted-foreground">
          {bitti ? 'Hepsi bitti' : siradaki ? `Sıradaki: ${siradaki.ad}` : ''}
        </span>
      </span>
      <ChevronRight size={16} strokeWidth={2.6} aria-hidden className="shrink-0 text-muted-foreground/50" />
    </button>
  )
}

/** Ders satırındaki ince çubuk — `OzetCubugu`nun sayısız hâli. */
function DersCubugu({ ozet, r }: { ozet: DersOzeti; r: Renkler }) {
  const dilimler = cubukDilimleri(ozet, r)
  return (
    <span className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
      {dilimler.map((d) =>
        d.sayi > 0 ? (
          <span
            key={d.ad}
            className="h-full"
            style={{ width: `${(d.sayi / Math.max(1, ozet.toplam)) * 100}%`, background: d.renk, opacity: d.opaklik }}
          />
        ) : null,
      )}
    </span>
  )
}

type Bildirim = { kimlik: number; metin: string; geriAl?: () => void }

/** Bir dersin konu listesi. */
function DersEkrani({
  ders,
  ad,
  ozet,
  takip,
  setTakip,
  ilerlemeler,
  bos,
  hedefKonu,
  onHaritayaGit,
}: {
  ders: YksDers
  ad: string
  ozet: DersOzeti
  takip: YksTakip
  setTakip: (guncelle: (onceki: YksTakip) => YksTakip) => void
  ilerlemeler: KonuIlerlemeleri
  bos: boolean
  hedefKonu: string | null
  onHaritayaGit: (konum: HaritaKonumu) => void
}) {
  const r = renkler(ders.renk)
  const [acikKonu, setAcikKonu] = useState<string | null>(hedefKonu)
  const [kutlanan, setKutlanan] = useState<string | null>(null)
  const [bildirim, setBildirim] = useState<Bildirim | null>(null)
  /**
   * "Bitmeyenler" süzgeci açılınca görünen konuların listesi o an donuyor:
   * süzgeç her çizimde yeniden hesaplansaydı daireye basılan konu parmağın
   * altından kaybolur, altındaki satır yukarı kayardı.
   */
  const [suzgec, setSuzgec] = useState<Set<string> | null>(null)
  const zamanlayicilar = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(
    () => () => {
      for (const z of zamanlayicilar.current) clearTimeout(z)
    },
    [],
  )
  const sonra = (is: () => void, ms: number) => {
    zamanlayicilar.current.push(setTimeout(is, ms))
  }

  // "Devam et"ten gelindiyse hedef konuyu ekranın ortasına getir.
  useEffect(() => {
    if (!hedefKonu) return
    requestAnimationFrame(() => document.getElementById(`yks-konu-${hedefKonu}`)?.scrollIntoView({ block: 'center' }))
  }, [hedefKonu])

  const durumlar = useMemo(() => {
    const tablo = new Map<string, KonuDurumu>()
    for (const konu of ders.konular) tablo.set(konu.id, konuDurumu(konu.id, takip, ilerlemeler))
    return tablo
  }, [ders, takip, ilerlemeler])

  const siradaki = siradakiKonu(ders, takip, ilerlemeler)
  /** Dersin hiçbir konusunun haritada karşılığı yoksa harita yuvası hiç çizilmiyor (Felsefe, Din, YDT). */
  const haritaKolonu = ozet.haritali > 0
  const bitmeyenSayisi = ozet.toplam - ozet.biten

  /*
    Konu listesi bölümlere ayrılıyor (TYT Matematik → Geometri, Felsefe Grubu
    → Psikoloji…). Bölümsüz konular başta; bölüm varsa onların başlığı dersin
    adı — yapışkan başlık uzun listede hangi bölümde olunduğunu söylüyor.
  */
  const bolumler = useMemo(() => {
    const liste: { baslik: string | null; konular: YksKonu[] }[] = []
    for (const konu of ders.konular) {
      const baslik = konu.bolum ?? null
      const son = liste.at(-1)
      if (son && son.baslik === baslik) son.konular.push(konu)
      else liste.push({ baslik, konular: [konu] })
    }
    return liste
  }, [ders])
  const cokBolumlu = bolumler.length > 1

  const soyle = (metin: string, geriAl?: () => void) => {
    const kimlik = Date.now()
    setBildirim({ kimlik, metin, geriAl })
    sonra(() => setBildirim((o) => (o?.kimlik === kimlik ? null : o)), BILDIRIM_SURESI)
  }

  const yaz = (konuId: string, alan: YazilanAlan, acik: boolean) =>
    setTakip((onceki) => asamaYaz(onceki, konuId, alan, acik, bugun()))

  /**
   * Daireye basmak "Bitirdim"i aç/kapa yapıyor; onay penceresi yok. Eksik
   * aşama hatırlatması bildirime indi ve konuyu bitirmeyi engellemiyor —
   * öğrenci konuyu dershanede öğrenmiş, haritayı hiç açmamış olabilir.
   *
   * Konfeti yalnızca **dersin son konusu** bitince: art arda on konu
   * işaretleyen öğrencinin her dokunuşunda patlayan kutlama listeyi
   * kapatıyor ve kutlamayı sıradanlaştırıyordu (oyunlardaki rekor
   * konfetisiyle aynı gerekçe). Tek konunun karşılığı dairenin dolması.
   */
  const bitirAcKapa = (konu: YksKonu) => {
    const durum = durumlar.get(konu.id)!
    if (durum.bitti) {
      yaz(konu.id, 'bitti', false)
      return
    }
    yaz(konu.id, 'bitti', true)
    void Haptics.notification({ type: NotificationType.Success }).catch(() => {})
    const dersBitti = ders.konular.every((k) => k.id === konu.id || durumlar.get(k.id)!.bitti)
    if (dersBitti) {
      setKutlanan(konu.id)
      sonra(() => setKutlanan(null), KUTLAMA_SURESI)
    }
    const eksik = eksikAsamalar(durum)
    if (eksik.length > 0) {
      soyle(`Bitti · eksik: ${eksik.map((a) => ASAMA[a].kisa).join(', ')}`, () => yaz(konu.id, 'bitti', false))
    }
  }

  const topluOkul = (konuIdleri: string[]) => {
    const gun = bugun()
    setTakip((onceki) => okuluTopluYaz(onceki, konuIdleri, true, gun))
    soyle(`${konuIdleri.length} konu okulda işlendi`, () =>
      setTakip((onceki) => okuluTopluYaz(onceki, konuIdleri, false, gun)),
    )
  }

  /** Sıradaki konuya git: satırı aç ve görünür yere kaydır. */
  const konuyaGit = (konuId: string) => {
    setAcikKonu(konuId)
    requestAnimationFrame(() =>
      document.getElementById(`yks-konu-${konuId}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }),
    )
  }

  return (
    // Dersin rengi ortak bileşenlere de geçiyor (`dersVurgusu`): çip,
    // odak halkası ve başlıktaki kutu Matematik'te mavi, Kimya'da turuncu.
    <div style={ders.renk ? dersVurgusu(ders.renk) : undefined}>
      <BaslikSatiri
        baslik={ad}
        arac="konu-takibi"
        sag={
          <span
            aria-hidden
            className="emoji grid size-11 shrink-0 place-items-center rounded-[15px] text-xl"
            style={{ background: r.zemin }}
          >
            {ders.ikon}
          </span>
        }
      />

      {(ders.id === 'ayt-tarih' || ders.id === 'ayt-cografya') && (
        <Not className="mb-3 py-2 text-[12.5px]">AYT bu derste TYT konularını da sorar; burada yalnızca AYT’ye özgü olanlar var.</Not>
      )}

      {bos && <IlkKullanim haritali={haritaKolonu} />}

      <Kart className="mb-3 py-3.5">
        <OzetCubugu ozet={ozet} r={r} onEk={ders.oturum === 'tyt' ? 'TYT ·' : ders.id === 'ydt' ? 'YDT ·' : 'AYT ·'} />
      </Kart>

      {siradaki && (
        <button
          type="button"
          onClick={() => konuyaGit(siradaki.id)}
          className="mb-3 flex min-h-11 w-full items-center gap-2 rounded-2xl px-3.5 py-2 text-left transition active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          style={{ background: r.zemin }}
        >
          <span className="shrink-0 text-[12px] font-extrabold tracking-[0.06em] uppercase" style={{ color: r.koyu }}>
            Sıradaki
          </span>
          <span className="min-w-0 flex-1 truncate text-[14px] font-extrabold">{siradaki.ad}</span>
          <ChevronRight size={16} strokeWidth={2.6} aria-hidden className="shrink-0" style={{ color: r.koyu }} />
        </button>
      )}

      {/*
        "Bitmeyenler" varsayılan kapalı: öğrenci listeyi müfredat sırasıyla
        tanıyor ve bitmiş konuların arada durması nerede olduğunu söylüyor;
        açık başlasaydı ilk bitirdiği konu ekrandan kaybolur, liste ders
        kitabındaki sıradan kopardı. Dersin yarısı bittikten sonra işe yarıyor.
      */}
      {ozet.biten > 0 && bitmeyenSayisi > 0 && (
        <div className="mb-3 flex">
          <Cip
            secili={suzgec !== null}
            onClick={() =>
              setSuzgec((o) => (o ? null : new Set(ders.konular.filter((k) => !durumlar.get(k.id)!.bitti).map((k) => k.id))))
            }
            className="min-h-9 text-[13px]"
          >
            Bitmeyenler · <span className="rakam">{bitmeyenSayisi}</span>
          </Cip>
        </div>
      )}

      <div className="space-y-4">
        {bolumler.map(({ baslik, konular }) => {
          const gorunen = suzgec ? konular.filter((k) => suzgec.has(k.id)) : konular
          if (gorunen.length === 0) return null
          return (
            <section key={baslik ?? 'ana'}>
              {(baslik || cokBolumlu) && (
                <h2 className="sticky top-[var(--guvenli-ust)] z-10 -mx-1 mb-1 bg-background px-2.5 py-2 text-[12px] font-extrabold tracking-[0.08em] text-muted-foreground uppercase">
                  {baslik ?? ad}
                </h2>
              )}
              <ul className="golge-kart overflow-hidden rounded-[22px] bg-card">
                {gorunen.map((konu) => (
                  <li key={konu.id} id={`yks-konu-${konu.id}`} className="scroll-mt-16 border-t border-border first:border-t-0">
                    <KonuSatiri
                      konu={konu}
                      durum={durumlar.get(konu.id)!}
                      r={r}
                      haritaKolonu={haritaKolonu}
                      acik={acikKonu === konu.id}
                      kutlaniyor={kutlanan === konu.id}
                      oncekiler={acikKonu === konu.id ? oncekiOkulsuzlar(ders, konu.id, takip) : []}
                      onAcKapa={() => setAcikKonu((o) => (o === konu.id ? null : konu.id))}
                      onYaz={(alan, acik) => yaz(konu.id, alan, acik)}
                      onBitir={() => bitirAcKapa(konu)}
                      onTopluOkul={topluOkul}
                      onHaritayaGit={onHaritayaGit}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      {bildirim && <BildirimSeridi key={bildirim.kimlik} bildirim={bildirim} onKapat={() => setBildirim(null)} />}
    </div>
  )
}

/**
 * Kendiliğinden kaybolan bildirim — Yapılacaklar'daki toast'ın kalıbı, bir
 * "Geri al" düğmesiyle. Pencere değil: art arda işaretlerken akışı kesmemeli.
 */
function BildirimSeridi({ bildirim, onKapat }: { bildirim: Bildirim; onKapat: () => void }) {
  return (
    <div
      data-yuzen
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+var(--guvenli-alt))] z-40 flex justify-center px-4 tablet:right-[var(--ray)] tablet:bottom-[calc(1.5rem+var(--guvenli-alt))]"
    >
      <div
        role="status"
        className="acilir-giris pointer-events-auto flex max-w-md items-center gap-1 rounded-2xl bg-foreground py-1 pr-1 pl-4 text-background shadow-kart"
      >
        <p className="min-w-0 flex-1 py-2.5 text-[13.5px] font-bold">{bildirim.metin}</p>
        {bildirim.geriAl && (
          <button
            type="button"
            onClick={() => {
              bildirim.geriAl!()
              onKapat()
            }}
            className="min-h-11 shrink-0 rounded-xl px-3 text-[13.5px] font-extrabold text-primary-parlak transition active:bg-background/10"
          >
            Geri al
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Konu satırı: solda ilerleme dairesi (Bitirdim), ortada ad (ayrıntıyı
 * açıyor), sağda sabit genişlikte üç yuva (harita · okul · soru). Yuvaların
 * genişliği sabit ve haritası olmayan konuda da harita yuvası yer tutuyor:
 * sütunlar satırdan satıra kaysaydı göz aşağı inerken hangi simgenin hangi
 * aşama olduğunu her satırda yeniden okumak zorunda kalırdı.
 */
function KonuSatiri({
  konu,
  durum,
  r,
  haritaKolonu,
  acik,
  kutlaniyor,
  oncekiler,
  onAcKapa,
  onYaz,
  onBitir,
  onTopluOkul,
  onHaritayaGit,
}: {
  konu: YksKonu
  durum: KonuDurumu
  r: Renkler
  haritaKolonu: boolean
  acik: boolean
  kutlaniyor: boolean
  /** Açıkken: "bu ve öncekiler"in işaretleyeceği konular. */
  oncekiler: string[]
  onAcKapa: () => void
  onYaz: (alan: YazilanAlan, acik: boolean) => void
  onBitir: () => void
  onTopluOkul: (konuIdleri: string[]) => void
  onHaritayaGit: (konum: HaritaKonumu) => void
}) {
  const { kayit, harita, bitti } = durum
  const detayId = `yks-detay-${konu.id}`
  // Toplu eylem yalnızca bu konudan başka bir konuyu da işaretleyecekse;
  // yalnızca bu konuysa okul yuvasının işini tekrar eder.
  const topluVar = oncekiler.some((id) => id !== konu.id)
  const gunler = [
    kayit.okul && `Okul ${gunYazisi(kayit.okul)}`,
    kayit.soru && `Soru ${gunYazisi(kayit.soru)}`,
    kayit.bitti && `Bitti ${gunYazisi(kayit.bitti)}`,
  ].filter(Boolean)

  return (
    <div className={cn('relative transition-colors', acik && 'bg-muted/40')}>
      {kutlaniyor && <Konfeti />}
      <div className="flex items-center pr-1.5 pl-1">
        <button
          type="button"
          onClick={onBitir}
          aria-pressed={bitti}
          aria-label={`${konu.ad}: Bitirdim${!bitti && bitirmeyeHazir(durum) ? ' (aşamalar tamam)' : ''}`}
          className="grid size-11 shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          <IlerlemeDairesi durum={durum} r={r} kutlaniyor={kutlaniyor} />
        </button>
        <button
          type="button"
          onClick={onAcKapa}
          aria-expanded={acik}
          aria-controls={detayId}
          className="flex min-h-[52px] min-w-0 flex-1 items-center py-2 pr-1 pl-1.5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          <span className={cn('min-w-0 text-[14.5px] leading-snug font-bold', bitti && 'text-muted-foreground')}>
            {konu.ad}
          </span>
        </button>
        <div className="flex shrink-0 items-center">
          {haritaKolonu && (
            <span className="grid h-11 w-9 place-items-center">
              {harita && (
                <AsamaRozeti
                  asama="harita"
                  hal={harita.durum === 'tamam' ? 'dolu' : harita.durum === 'basladi' ? 'yarim' : 'bos'}
                  r={r}
                  etiket={`Haritada çalıştım: ${harita.durum === 'tamam' ? 'tamam' : harita.durum === 'basladi' ? 'başladın' : 'henüz yok'}`}
                />
              )}
            </span>
          )}
          {(['okul', 'soru'] as const).map((a) => {
            const dolu = kayit[a] !== undefined
            return (
              <button
                key={a}
                type="button"
                onClick={() => onYaz(a, !dolu)}
                aria-pressed={dolu}
                aria-label={`${konu.ad}: ${ASAMA[a].ad}`}
                className="grid size-11 place-items-center rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                <AsamaRozeti asama={a} hal={dolu ? 'dolu' : 'bos'} r={r} />
              </button>
            )
          })}
        </div>
      </div>

      {acik && (
        <div id={detayId} className="acilir-giris space-y-1.5 px-3.5 pb-3">
          {harita ? (
            <div className="flex items-center gap-2">
              <p className="min-w-0 flex-1 text-[12.5px] leading-snug font-semibold text-muted-foreground">
                {haritaYazisi(harita)}
              </p>
              <button
                type="button"
                onClick={() => onHaritayaGit(harita.hedef)}
                className="flex min-h-9 shrink-0 items-center gap-0.5 rounded-lg px-2 text-[13px] font-extrabold transition active:bg-muted"
                style={{ color: r.koyu }}
              >
                {harita.durum === 'tamam' ? 'Tekrar et' : 'Haritaya git'}
                <ChevronRight size={14} strokeWidth={2.8} aria-hidden />
              </button>
            </div>
          ) : (
            <p className="text-[12px] font-semibold text-muted-foreground/80">Haritada karşılığı yok.</p>
          )}
          {topluVar && (
            <button
              type="button"
              onClick={() => onTopluOkul(oncekiler)}
              className="flex min-h-10 w-full items-center gap-2 rounded-xl border px-3 text-left text-[13px] font-bold transition active:bg-muted"
              style={{ borderColor: r.kenar }}
            >
              <GraduationCap size={15} strokeWidth={2.3} aria-hidden style={{ color: r.koyu }} className="shrink-0" />
              <span className="min-w-0 flex-1">Bu ve önceki konuları okulda işlendi say</span>
              <span className="rakam shrink-0 text-muted-foreground">{oncekiler.length}</span>
            </button>
          )}
          {gunler.length > 0 && (
            <p className="text-[12px] font-semibold text-muted-foreground">{gunler.join(' · ')}</p>
          )}
        </div>
      )}
    </div>
  )
}

/** Haritadaki durumun kısa yazısı — ayrıntı satırında tek satır. */
function haritaYazisi(harita: NonNullable<KonuDurumu['harita']>): string {
  if (harita.durum === 'tamam') return 'Haritada bitirdin'
  if (harita.okunan > harita.biten) return 'Haritada kartlar okundu, sorular bekliyor'
  if (harita.toplam > 1 && harita.durum === 'basladi') return `Haritada ${harita.biten}/${harita.toplam} konu tamam`
  if (harita.durum === 'basladi') return 'Haritada başladın'
  return 'Haritada henüz başlamadın'
}

/**
 * Bir aşamanın simgesi. Dolu hâl dersin rengiyle dolgu, boş hâl kenarlık:
 * yalnızca opaklıkla ayrılan iki hâl güneşte ve renk körlüğünde
 * karışıyordu. Haritanın yarım hâli kenarlığı ve simgeyi dersin rengine
 * boyuyor, dolgusu açık ton.
 *
 * (Okul dilimi istisna: çubukta ve noktasında dolgu tonunun açığı, çünkü
 * orada üç dilim yan yana ve hepsinin aynı ailede durması gerekiyor.)
 */
function AsamaRozeti({
  asama,
  hal,
  r,
  etiket,
}: {
  asama: AsamaId
  hal: 'dolu' | 'yarim' | 'bos'
  r: Renkler
  etiket?: string
}) {
  const { Simge } = ASAMA[asama]
  const stil: React.CSSProperties =
    hal === 'dolu'
      ? { background: r.dolgu, borderColor: r.dolgu, color: 'white' }
      : hal === 'yarim'
        ? { background: r.zemin, borderColor: r.dolgu, color: r.koyu }
        : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }
  return (
    <span
      role={etiket ? 'img' : undefined}
      aria-label={etiket}
      aria-hidden={etiket ? undefined : true}
      className={cn(
        'grid place-items-center border-[1.5px] transition-colors',
        // Harita salt okunur: dokunulan yuvalardan küçük, boşken kesik
        // kenarlı — basılabilir bir kutu gibi durmasın.
        asama === 'harita' ? 'size-[26px] rounded-[9px]' : 'size-[30px] rounded-[10px]',
        asama === 'harita' && hal !== 'dolu' && 'border-dashed',
      )}
      style={stil}
    >
      <Simge size={asama === 'harita' ? 13 : 15} strokeWidth={2.3} aria-hidden />
    </span>
  )
}

/**
 * Soldaki ilerleme dairesi: aşama sayısına göre dolan yay, bitince yeşil
 * dolgu ve tik. Bitirmek aşamalardan bağımsız (kayit.ts); yay yalnızca ne
 * kadar yol alındığını gösteriyor.
 */
function IlerlemeDairesi({ durum, r, kutlaniyor }: { durum: KonuDurumu; r: Renkler; kutlaniyor: boolean }) {
  const boyut = 28
  const kalinlik = 3
  const yaricap = (boyut - kalinlik) / 2
  const cevre = 2 * Math.PI * yaricap
  const oran = durum.asamaToplam > 0 ? durum.dolu / durum.asamaToplam : 0
  if (durum.bitti) {
    return (
      <span
        aria-hidden
        className={cn('grid size-7 place-items-center rounded-full bg-success text-white', kutlaniyor && 'tik-dolu')}
      >
        <Check size={16} strokeWidth={3.2} />
      </span>
    )
  }
  /*
    Bitirmeye hazır: yay tam dolu, ortada ders renginde soluk bir tik.
    Öneri bu konuyu atlıyor (`siradakiKonu`); işaret öğrenciye "bitirmeyi
    unuttun" demiyor, yalnızca daireye basınca biteceğini hatırlatıyor.
  */
  const hazir = bitirmeyeHazir(durum)
  return (
    <span className="relative grid size-7 place-items-center" aria-hidden>
      {hazir && (
        <Check
          size={13}
          strokeWidth={3.2}
          className="absolute inset-0 m-auto opacity-60"
          style={{ color: r.dolgu }}
        />
      )}
      <svg width={boyut} height={boyut} className="-rotate-90" aria-hidden>
        <circle cx={boyut / 2} cy={boyut / 2} r={yaricap} fill="none" stroke="var(--border)" strokeWidth={kalinlik} />
        {oran > 0 && (
          <circle
            cx={boyut / 2}
            cy={boyut / 2}
            r={yaricap}
            fill="none"
            stroke={r.dolgu}
            strokeWidth={kalinlik}
            strokeLinecap="round"
            strokeDasharray={cevre}
            strokeDashoffset={cevre * (1 - oran)}
            className="transition-[stroke-dashoffset] duration-300"
          />
        )}
      </svg>
    </span>
  )
}
