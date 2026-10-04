'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ChevronRight } from 'lucide-react'
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
  dersOzeti,
  eksikAsamalar,
  konuDurumu,
  siradakiKonu,
  toplamOzet,
  yuzde,
  type AsamaId,
  type DersOzeti,
  type HaritaKonumu,
  type KonuDurumu,
  type YazilanAlan,
  type YksTakip,
} from '@/lib/konu-takibi/takip'
import { useGeriKatmani } from '@/lib/geri'
import { bugun, cn, tariheCevir } from '@/lib/utils'
import { BaslikSatiri, Buton, Cip, Halka, Kart, Not, Onay, SecimSatiri } from '@/components/ui'
import { dersVurgusu } from '@/components/ders-renkleri'
import { Konfeti } from '@/components/oyun-kabuk'

/**
 * Konu Takibi — YKS konularını aşama aşama işaretleme.
 *
 * Akış iki kat: TYT/AYT sekmesi → ders listesi (her derste ilerleme halkası)
 * → dersin konu listesi. Konuya dokununca satır yerinde açılıyor ve aşamalar
 * orada işaretleniyor; ayrı bir sayfa açılsaydı yirmi konuluk bir derste her
 * işaret için bir gidiş bir dönüş olurdu.
 *
 * Hesapların hepsi `lib/konu-takibi/`de; bu dosya yalnızca çiziyor.
 */

/** Aşamaların yüzü — satırdaki küçük simgeler ve açılan kartın satırları aynı. */
const ASAMA: Record<AsamaId | 'bitti', { simge: string; ad: string }> = {
  harita: { simge: '🗺️', ad: 'Haritada çalıştım' },
  okul: { simge: '🏫', ad: 'Okulda öğrendim' },
  soru: { simge: '✍️', ad: 'Soru çözdüm' },
  bitti: { simge: '✅', ad: 'Bitirdim' },
}

/** Hatırlatmada eksik aşamaların cümle içindeki adı. */
const EKSIK_ADI: Record<AsamaId, string> = {
  harita: 'haritada çalışmak',
  okul: 'okulda öğrenmek',
  soru: 'soru çözmek',
}

/** Kutlamanın ekranda kaldığı süre — konfetinin en geç parçası (610 ms) + düşüşü. */
const KUTLAMA_SURESI = 2200

/**
 * Ders renginin tonları. Haritada karşılığı olan ders haritadaki rengini
 * taşıyor; olmayan (Felsefe, Din) Yanlış Soru Bankası'ndaki gibi nötr.
 */
function renkler(renk: KonuDersId | null) {
  if (!renk) {
    return {
      zemin: 'var(--muted)',
      kenar: 'var(--border)',
      koyu: 'var(--muted-foreground)',
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
  const [oturum, setOturum] = useState<YksOturum>('tyt')
  const [acikDersId, setAcikDersId] = useState<string | null>(null)

  const tytDersleri = useMemo(() => oturumDersleri('tyt', alan), [alan])
  const aytDersleri = useMemo(() => oturumDersleri('ayt', alan), [alan])
  const dersler = oturum === 'tyt' ? tytDersleri : aytDersleri

  /*
    Ders özetleri bir kez hesaplanıyor; sekme sayıları, büyük halka ve ders
    satırları aynı tablodan okuyor.
  */
  const ozetler = useMemo(() => {
    const tablo = new Map<string, DersOzeti>()
    for (const ders of [...tytDersleri, ...aytDersleri]) tablo.set(ders.id, dersOzeti(ders, takip, ilerlemeler))
    return tablo
  }, [tytDersleri, aytDersleri, takip, ilerlemeler])

  const oturumToplami = (liste: readonly YksDers[]) => toplamOzet(liste.map((d) => ozetler.get(d.id)!))
  const tytToplam = oturumToplami(tytDersleri)
  const aytToplam = oturumToplami(aytDersleri)
  const toplam = oturum === 'tyt' ? tytToplam : aytToplam

  const acikDers = dersler.find((d) => d.id === acikDersId) ?? null
  // Android'in geri tuşu önce dersi kapatıyor, sonra araçtan çıkıyor.
  useGeriKatmani(acikDers !== null, () => setAcikDersId(null))

  if (acikDers) {
    return (
      <DersEkrani
        ders={acikDers}
        ad={dersAdi(acikDers, alan)}
        ozet={ozetler.get(acikDers.id)!}
        takip={takip}
        setTakip={setTakip}
        ilerlemeler={ilerlemeler}
        onKapat={() => setAcikDersId(null)}
        onHaritayaGit={onHaritayaGit}
      />
    )
  }

  return (
    <div>
      <BaslikSatiri baslik="Konu Takibi" arac="konu-takibi" />

      <div className="mb-3 flex gap-1 rounded-[14px] bg-muted p-1" role="tablist">
        <SegmentDugmesi secili={oturum === 'tyt'} onClick={() => setOturum('tyt')} sayi={`${tytToplam.biten}/${tytToplam.toplam}`}>
          TYT
        </SegmentDugmesi>
        <SegmentDugmesi
          secili={oturum === 'ayt'}
          onClick={() => setOturum('ayt')}
          sayi={alan === null ? null : `${aytToplam.biten}/${aytToplam.toplam}`}
        >
          {alan === 'dil' ? 'YDT' : 'AYT'}
        </SegmentDugmesi>
      </div>

      {oturum === 'ayt' && alan === null ? (
        <AlanSorusu onSec={setAlan} />
      ) : (
        <>
          <OzetKarti ozet={toplam} />

          {oturum === 'ayt' && (
            <Not className="mt-3">
              {alan === 'dil'
                ? 'YDT, alanın Dil olduğu için burada. '
                : `${ALAN_ADLARI[alan!]} alanının AYT dersleri. `}
              {alan !== 'dil' &&
                'AYT, TYT konularını da sorar; burada yalnızca AYT’ye özgü konular var. '}
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
                  onAc={() => setAcikDersId(ders.id)}
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
  sayi,
  onClick,
  children,
}: {
  secili: boolean
  sayi: string | null
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
        'flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-[11px] text-sm font-extrabold transition-[background-color,box-shadow] duration-200',
        secili
          ? 'bg-card text-primary shadow-[0_1px_3px_rgba(27,26,25,0.12),0_1px_1px_rgba(27,26,25,0.04)]'
          : 'text-muted-foreground',
      )}
    >
      {children}
      {sayi !== null && (
        <span
          className={cn(
            'rakam inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-xs',
            secili ? 'bg-primary-soft text-primary' : 'bg-foreground/[0.07] text-muted-foreground',
          )}
        >
          {sayi}
        </span>
      )}
    </button>
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

/** Sekmenin büyük halkası ve aşama dağılımı. */
function OzetKarti({ ozet }: { ozet: DersOzeti }) {
  const oran = yuzde(ozet.biten, ozet.toplam)
  return (
    <Kart className="flex items-center gap-4">
      <Halka deger={ozet.biten} hedef={ozet.toplam} boyut={92} kalinlik={9} renk="var(--primary-parlak)">
        <span className="rakam font-display text-[22px] leading-none font-extrabold">%{oran}</span>
        <span className="mt-0.5 text-[11px] font-bold text-muted-foreground">bitti</span>
      </Halka>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[17px] leading-tight font-extrabold tracking-tight">
          <span className="rakam">
            {ozet.biten} / {ozet.toplam}
          </span>{' '}
          konu bitti
        </p>
        <AsamaDagilimi ozet={ozet} className="mt-2" />
      </div>
    </Kart>
  )
}

/** "🗺️ 12/40 · 🏫 30 · ✍️ 25" — aşama başına dolu konu sayısı. */
function AsamaDagilimi({ ozet, className }: { ozet: DersOzeti; className?: string }) {
  const satirlar: { id: AsamaId; deger: string }[] = [
    ...(ozet.haritali > 0 ? [{ id: 'harita' as const, deger: `${ozet.harita}/${ozet.haritali}` }] : []),
    { id: 'okul', deger: `${ozet.okul}` },
    { id: 'soru', deger: `${ozet.soru}` },
  ]
  return (
    <ul className={cn('space-y-0.5 text-[12.5px] font-bold text-muted-foreground', className)}>
      {satirlar.map((s) => (
        <li key={s.id} className="flex items-center gap-1.5">
          <span className="emoji text-[12px]" aria-hidden>
            {ASAMA[s.id].simge}
          </span>
          <span className="min-w-0 flex-1 truncate">{ASAMA[s.id].ad}</span>
          <span className="rakam text-foreground">{s.deger}</span>
        </li>
      ))}
    </ul>
  )
}

/** Ders listesinin satırı: dersin rengi, sıradaki konu ve ince ilerleme halkası. */
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
        <span className="block font-display text-[16px] leading-tight font-extrabold tracking-tight">{ad}</span>
        <span className="mt-0.5 block truncate text-[12.5px] font-semibold text-muted-foreground">
          <span className="rakam">
            {ozet.biten}/{ozet.toplam}
          </span>{' '}
          bitti
          {bitti ? ' · Hepsi tamam 🎉' : siradaki ? ` · Sıradaki: ${siradaki.ad}` : ''}
        </span>
      </span>
      <Halka deger={ozet.biten} hedef={ozet.toplam} boyut={40} kalinlik={4} renk={bitti ? 'var(--success)' : r.dolgu}>
        <span className="rakam text-[10.5px] font-extrabold" style={{ color: bitti ? 'var(--success)' : r.koyu }}>
          %{yuzde(ozet.biten, ozet.toplam)}
        </span>
      </Halka>
    </button>
  )
}

/** Bir dersin konu listesi. */
function DersEkrani({
  ders,
  ad,
  ozet,
  takip,
  setTakip,
  ilerlemeler,
  onKapat,
  onHaritayaGit,
}: {
  ders: YksDers
  ad: string
  ozet: DersOzeti
  takip: YksTakip
  setTakip: (guncelle: (onceki: YksTakip) => YksTakip) => void
  ilerlemeler: KonuIlerlemeleri
  onKapat: () => void
  onHaritayaGit: (konum: HaritaKonumu) => void
}) {
  const r = renkler(ders.renk)
  const [acikKonu, setAcikKonu] = useState<string | null>(null)
  /** "Bitirdim"e basıldı ama eksik aşama var — nazik onay bunu bekliyor. */
  const [bitirOnayi, setBitirOnayi] = useState<{ konu: YksKonu; eksik: AsamaId[] } | null>(null)
  const [kutlanan, setKutlanan] = useState<string | null>(null)
  const kutlamaZamani = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (kutlamaZamani.current) clearTimeout(kutlamaZamani.current)
  }, [])

  const siradaki = siradakiKonu(ders, takip, ilerlemeler)

  /*
    Konu listesi bölümlere ayrılıyor (TYT Matematik → Geometri, Felsefe Grubu
    → Psikoloji…). Bölümsüz konular başta, dersin kendi adı altında.
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

  const yaz = (konuId: string, alan: YazilanAlan, acik: boolean) =>
    setTakip((onceki) => asamaYaz(onceki, konuId, alan, acik, bugun()))

  const bitir = (konu: YksKonu) => {
    yaz(konu.id, 'bitti', true)
    setKutlanan(konu.id)
    void Haptics.notification({ type: NotificationType.Success }).catch(() => {})
    if (kutlamaZamani.current) clearTimeout(kutlamaZamani.current)
    kutlamaZamani.current = setTimeout(() => setKutlanan(null), KUTLAMA_SURESI)
  }

  const bitirIstendi = (konu: YksKonu, durum: KonuDurumu) => {
    const eksik = eksikAsamalar(durum)
    if (eksik.length === 0) bitir(konu)
    else setBitirOnayi({ konu, eksik })
  }

  /** Sıradaki konuya git: satırı aç ve görünür yere kaydır. */
  const siradakineGit = (konuId: string) => {
    setAcikKonu(konuId)
    requestAnimationFrame(() =>
      document.getElementById(`yks-konu-${konuId}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }),
    )
  }

  return (
    // Dersin rengi ortak düğmelere de geçiyor: oyunlardaki gibi
    // (`dersVurgusu`), Matematik'in "Bitirdim"i mavi, Kimya'nınki turuncu.
    <div style={ders.renk ? dersVurgusu(ders.renk) : undefined}>
      <Buton bicim="hayalet" boy="kucuk" onClick={onKapat} className="-ml-2 mb-2">
        <ArrowLeft size={16} aria-hidden /> Bütün dersler
      </Buton>

      <div className="mb-4 flex items-center gap-3">
        <span
          className="emoji grid size-11 shrink-0 place-items-center rounded-[15px] text-xl"
          style={{ background: r.zemin }}
          aria-hidden
        >
          {ders.ikon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold tracking-[0.09em] uppercase" style={{ color: r.koyu }}>
            {ders.oturum === 'tyt' ? 'TYT' : ders.id === 'ydt' ? 'Yabancı Dil Testi' : 'AYT'}
          </p>
          <h1 className="font-display text-[24px] leading-tight font-extrabold tracking-tight">{ad}</h1>
        </div>
        <Halka deger={ozet.biten} hedef={ozet.toplam} boyut={52} kalinlik={5} renk={r.dolgu}>
          <span className="rakam text-[12px] font-extrabold" style={{ color: r.koyu }}>
            {ozet.biten}/{ozet.toplam}
          </span>
        </Halka>
      </div>

      <Kart className="mb-4 flex items-center gap-4 py-3">
        <AsamaDagilimi ozet={ozet} className="flex-1" />
        {siradaki && (
          <button
            type="button"
            onClick={() => siradakineGit(siradaki.id)}
            className="flex w-[46%] shrink-0 flex-col items-start rounded-xl px-3 py-2 text-left transition active:brightness-95"
            style={{ background: r.zemin }}
          >
            <span className="text-[10px] font-extrabold tracking-[0.09em] uppercase" style={{ color: r.koyu }}>
              Sıradaki önerilen
            </span>
            <span className="mt-0.5 line-clamp-2 text-[13.5px] leading-snug font-extrabold">{siradaki.ad}</span>
          </button>
        )}
      </Kart>

      <div className="space-y-5">
        {bolumler.map(({ baslik, konular }) => (
          <section key={baslik ?? 'ana'}>
            {baslik && (
              <h2 className="mb-2 px-1.5 text-[11.5px] font-extrabold tracking-[0.09em] text-muted-foreground uppercase">
                {baslik}
              </h2>
            )}
            <ul className="golge-kart overflow-hidden rounded-[22px] bg-card">
              {konular.map((konu) => (
                <li key={konu.id} id={`yks-konu-${konu.id}`} className="border-t border-border first:border-t-0">
                  <KonuSatiri
                    konu={konu}
                    durum={konuDurumu(konu.id, takip, ilerlemeler)}
                    acik={acikKonu === konu.id}
                    kutlaniyor={kutlanan === konu.id}
                    onAcKapa={() => setAcikKonu((o) => (o === konu.id ? null : konu.id))}
                    onYaz={(alan, acik) => yaz(konu.id, alan, acik)}
                    onBitir={(durum) => bitirIstendi(konu, durum)}
                    onHaritayaGit={onHaritayaGit}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/*
        Eksik aşama hatırlatması engel değil: öğrenci konuyu dershanede
        öğrenmiş, haritayı hiç açmamış olabilir; bitirdiğine o karar veriyor.
        Düğme kırmızı değil — geri alınabilen bir iş.
      */}
      <Onay
        acik={bitirOnayi !== null}
        baslik="Bitirdim diyelim mi?"
        aciklama={
          bitirOnayi
            ? `“${bitirOnayi.konu.ad}” konusunda henüz işaretlemediğin ${bitirOnayi.eksik.length === 1 ? 'bir aşama' : 'aşamalar'} var: ${bitirOnayi.eksik.map((a) => EKSIK_ADI[a]).join(', ')}. Konuyu bitirdiğinden eminsen yine de işaretleyebilirsin.`
            : ''
        }
        onayMetni="Eminim, bitirdim"
        tehlikeli={false}
        onOnayla={() => {
          if (bitirOnayi) bitir(bitirOnayi.konu)
        }}
        onIptal={() => setBitirOnayi(null)}
      />
    </div>
  )
}

/** Konu satırı; açıkken aşamaları altında gösteriyor. */
function KonuSatiri({
  konu,
  durum,
  acik,
  kutlaniyor,
  onAcKapa,
  onYaz,
  onBitir,
  onHaritayaGit,
}: {
  konu: YksKonu
  durum: KonuDurumu
  acik: boolean
  kutlaniyor: boolean
  onAcKapa: () => void
  onYaz: (alan: YazilanAlan, acik: boolean) => void
  onBitir: (durum: KonuDurumu) => void
  onHaritayaGit: (konum: HaritaKonumu) => void
}) {
  const { kayit, harita, bitti } = durum
  /** Satırdaki küçük simgelerin hâli: dolu, yarım (yalnızca harita) ya da boş. */
  const simgeler: { id: AsamaId; hal: 'dolu' | 'yarim' | 'bos' }[] = [
    ...(harita
      ? [{ id: 'harita' as const, hal: harita.durum === 'tamam' ? ('dolu' as const) : harita.durum === 'basladi' ? ('yarim' as const) : ('bos' as const) }]
      : []),
    { id: 'okul', hal: kayit.okul ? 'dolu' : 'bos' },
    { id: 'soru', hal: kayit.soru ? 'dolu' : 'bos' },
  ]

  return (
    <div className="relative">
      {kutlaniyor && <Konfeti />}
      <button
        type="button"
        onClick={onAcKapa}
        aria-expanded={acik}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition active:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <span
          aria-hidden
          className={cn(
            'grid size-[26px] shrink-0 place-items-center rounded-full text-[13px] font-extrabold',
            bitti ? 'bg-success text-white' : 'border-2 border-border text-muted-foreground',
            kutlaniyor && 'tik-dolu',
          )}
        >
          {bitti ? '✓' : ''}
        </span>
        <span
          className={cn(
            'min-w-0 flex-1 text-[14.5px] leading-snug font-bold',
            bitti && 'text-muted-foreground',
          )}
        >
          {konu.ad}
        </span>
        <span className="flex shrink-0 items-center gap-1" aria-label={simgeAciklamasi(simgeler)}>
          {simgeler.map((s) => (
            <span
              key={s.id}
              aria-hidden
              className={cn(
                'emoji text-[13px] leading-none transition-opacity',
                s.hal === 'dolu' ? 'opacity-100' : s.hal === 'yarim' ? 'opacity-55' : 'opacity-20 grayscale',
              )}
            >
              {ASAMA[s.id].simge}
            </span>
          ))}
        </span>
        <ChevronRight
          size={16}
          strokeWidth={2.6}
          aria-hidden
          className={cn('shrink-0 text-muted-foreground/50 transition-transform', acik && 'rotate-90')}
        />
      </button>

      {acik && (
        <div className="acilir-giris space-y-2 px-3.5 pb-3.5">
          {harita ? (
            <HaritaAsamasi harita={harita} onGit={() => onHaritayaGit(harita.hedef)} />
          ) : (
            <p className="px-1 text-[12.5px] font-semibold text-muted-foreground">
              Bu konunun haritada karşılığı henüz yok; harita aşaması bu konuda sayılmıyor.
            </p>
          )}
          <SecimSatiri
            ad={`${ASAMA.okul.simge}  ${ASAMA.okul.ad}`}
            ornek={kayit.okul ? `İşaretledin · ${gunYazisi(kayit.okul)}` : 'Okulda ya da derste işlendiyse'}
            secili={kayit.okul !== undefined}
            onClick={() => onYaz('okul', kayit.okul === undefined)}
            className="py-2.5"
          />
          <SecimSatiri
            ad={`${ASAMA.soru.simge}  ${ASAMA.soru.ad}`}
            ornek={kayit.soru ? `İşaretledin · ${gunYazisi(kayit.soru)}` : 'Bu konudan soru çözdüysen'}
            secili={kayit.soru !== undefined}
            onClick={() => onYaz('soru', kayit.soru === undefined)}
            className="py-2.5"
          />

          {bitti ? (
            <div className="flex items-center gap-2 rounded-2xl bg-success-soft px-4 py-2.5">
              <span className="emoji text-[15px]" aria-hidden>
                {ASAMA.bitti.simge}
              </span>
              <span className="min-w-0 flex-1 text-sm font-extrabold text-success">
                {/* Ek yok ("4 Ekim'de"): ay adına göre -de/-da/-ta değişiyor. */}
                Bitirdin{kayit.bitti ? ` · ${gunYazisi(kayit.bitti)}` : ''}
              </span>
              <Buton bicim="hayalet" boy="kucuk" onClick={() => onYaz('bitti', false)}>
                Geri al
              </Buton>
            </div>
          ) : (
            <Buton className="w-full" onClick={() => onBitir(durum)}>
              <span className="emoji" aria-hidden>
                {ASAMA.bitti.simge}
              </span>
              Bitirdim
            </Buton>
          )}
        </div>
      )}
    </div>
  )
}

/** Ekran okuyucu için satırdaki simgelerin sözlü karşılığı. */
function simgeAciklamasi(simgeler: { id: AsamaId; hal: 'dolu' | 'yarim' | 'bos' }[]): string {
  const dolu = simgeler.filter((s) => s.hal === 'dolu').map((s) => ASAMA[s.id].ad.toLowerCase())
  return dolu.length > 0 ? `İşaretli: ${dolu.join(', ')}` : 'Henüz işaretli aşama yok'
}

/**
 * Haritada çalıştım — elle değil, haritanın kaydından.
 *
 * Satır düğme değil: dokunarak işaretlenmiyor, "Haritaya git" ile haritada
 * yapılıyor. Seçim satırlarıyla aynı kalıpta ama dolgu yerine çerçeve —
 * işaretlenebilir bir kutu gibi görünürse öğrenci basıp neden olmadığını
 * merak ederdi.
 */
function HaritaAsamasi({
  harita,
  onGit,
}: {
  harita: NonNullable<KonuDurumu['harita']>
  onGit: () => void
}) {
  const tamam = harita.durum === 'tamam'
  const alt = tamam
    ? 'Haritadaki karşılığını bitirdin'
    : harita.okunan > harita.biten
      ? 'Kartları okudun, soruları bekliyor'
      : harita.toplam > 1 && harita.durum === 'basladi'
        ? `Haritada ${harita.biten}/${harita.toplam} konu tamam`
        : harita.durum === 'basladi'
          ? 'Haritada başladın, henüz bitmedi'
          : 'Haritada kartları okuyup soruları geçince kendiliğinden dolar'
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border-2 px-4 py-2.5',
        tamam ? 'border-success bg-success-soft' : 'border-border bg-muted/50',
      )}
    >
      <span className="min-w-0 flex-1">
        <span className={cn('block text-sm leading-tight font-extrabold', tamam && 'text-success')}>
          {ASAMA.harita.simge}  {ASAMA.harita.ad}
          {tamam && ' ✓'}
        </span>
        <span className="mt-0.5 block text-xs leading-tight text-muted-foreground">{alt}</span>
      </span>
      <Buton bicim="ikincil" boy="kucuk" onClick={onGit} className="shrink-0">
        {tamam ? 'Tekrar et' : 'Haritaya git'}
      </Buton>
    </div>
  )
}
