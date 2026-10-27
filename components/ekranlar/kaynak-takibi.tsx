'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, Check, ChevronRight, MoreHorizontal, Pencil, Plus, Trash2, X } from 'lucide-react'
import {
  EN_COK_KAYNAK,
  EN_UZUN_KAYNAK_ADI,
  kaynakAdiKirp,
  kaynakAdlandir,
  kaynakBittiMi,
  kaynakEkle,
  kaynakIlerlemesi,
  kaynakSil,
  konuIsaretle,
  siraliKaynaklar,
  uniteIlerlemesi,
  uniteIsaretle,
  varsayilanKaynakSinifi,
  type Kaynak,
} from '@/lib/kaynak-takibi/kaynak'
import {
  KAYNAK_SINIFLARI,
  dersAdi,
  dersIkonu,
  kaynakDersleri,
  konuKimligi,
  uniteler,
  type KaynakSinifi,
  type Unite,
} from '@/lib/kaynak-takibi/konular'
import type { KonuDersId } from '@/lib/konu/tip'
import { bugun, cn, yeniId } from '@/lib/utils'
import { useGeriKatmani } from '@/lib/geri'
import { useAsagiKaydirKapat } from '@/lib/asagi-kaydir'
import { dersVurgusu } from '@/components/ders-renkleri'
import { AlanBasligi, SecimDugmesi } from '@/components/ekranlar/yapilacaklar'
import { BaslikSatiri, Buton, Kart, Onay, kartGirisi, useKapatmaOnayi } from '@/components/ui'

/**
 * Kaynak Takibi — öğrencinin test kitapları.
 *
 * Kaynak eklenirken adı, sınıfı ve dersi soruluyor; konular o sınıfın o
 * dersinin listesinden geliyor (`lib/kaynak-takibi/konular.ts`). Kaynağa
 * girince konular ünite ünite, Yapılacaklar'daki görev gibi tek dokunuşla
 * işaretlenip geri alınıyor.
 *
 * Tek geri: açık kaynak bir geri katmanı; kabuğun "Geri"si, Android geri
 * tuşu ve iOS kenar kaydırması önce kaynağı kapatıyor (Konu Takibi'ndeki
 * ders ekranıyla aynı sıra).
 */

/** Toast ekranda ne kadar duruyor. */
const MESAJ_SURESI = 2400

export function KaynakTakibiEkrani({
  kaynaklar,
  setKaynaklar,
  sinif,
}: {
  kaynaklar: Kaynak[]
  setKaynaklar: (guncelleyici: (onceki: Kaynak[]) => Kaynak[]) => void
  /** Öğrencinin kayıtlı sınıfı: ekleme formu bu sınıfla açılıyor. */
  sinif: number
}) {
  const [acikId, setAcikId] = useState<string | null>(null)
  /** Ekleme (`{}`) ya da ad değiştirme (`{ kaynak }`) sayfası. */
  const [sayfa, setSayfa] = useState<{ kaynak?: Kaynak } | null>(null)
  const [eylemli, setEylemli] = useState<Kaynak | null>(null)
  const [silinecek, setSilinecek] = useState<Kaynak | null>(null)
  const [suzgec, setSuzgec] = useState<KaynakSinifi | null>(null)
  const [mesaj, setMesaj] = useState<string | null>(null)

  const acik = kaynaklar.find((k) => k.id === acikId) ?? null
  useGeriKatmani(acik !== null, () => setAcikId(null))

  /*
    Listede kalınan yer: kaynaktan dönünce aynı karta. Kaynak açılınca sayfa
    başa çıkıyor; uzun bir kaynağın ortasında açılsaydı başlığı görünmezdi.
  */
  const listeKaydirma = useRef(0)
  useEffect(() => {
    window.scrollTo(0, acikId === null ? listeKaydirma.current : 0)
  }, [acikId])

  const soyle = (metin: string) => {
    setMesaj(metin)
    window.setTimeout(() => setMesaj((o) => (o === metin ? null : o)), MESAJ_SURESI)
  }

  /*
    Süzgeç yalnız birden çok sınıfın kaynağı varken: tek sınıfta "Tümü" ile
    o sınıf aynı listeyi gösterirdi. Seçili sınıfın son kaynağı silinirse
    süzgeç kendiliğinden "Tümü"ne düşüyor.
  */
  const siniflar = KAYNAK_SINIFLARI.filter((s) => kaynaklar.some((k) => k.sinif === s))
  const etkinSuzgec = suzgec !== null && siniflar.includes(suzgec) && siniflar.length > 1 ? suzgec : null
  const gorunenler = useMemo(
    () => siraliKaynaklar(etkinSuzgec === null ? kaynaklar : kaynaklar.filter((k) => k.sinif === etkinSuzgec)),
    [kaynaklar, etkinSuzgec],
  )

  const ekle = (ad: string, kaynakSinifi: KaynakSinifi, ders: KonuDersId) => {
    const id = yeniId()
    const yeni = { id, ad, sinif: kaynakSinifi, ders, eklenme: bugun() }
    if (!kaynakEkle(kaynaklar, yeni)) {
      soyle(kaynaklar.length >= EN_COK_KAYNAK ? `En çok ${EN_COK_KAYNAK} kaynak eklenebilir.` : 'Kaynak eklenemedi.')
      return
    }
    // Güncelleyici en son listeden hesaplıyor: arada gelen bir değişiklik ezilmesin.
    setKaynaklar((o) => kaynakEkle(o, yeni) ?? o)
    setSayfa(null)
    // Eklenen kaynak hemen açılıyor: eklemenin sebebi konularını işaretlemek.
    listeKaydirma.current = window.scrollY
    setAcikId(id)
    soyle('Kaynak eklendi.')
  }

  const isaretle = (kaynak: Kaynak, konuId: string) => {
    const onceBitti = kaynakBittiMi(kaynak)
    const yeni = konuIsaretle([kaynak], kaynak.id, konuId)[0]
    setKaynaklar((o) => konuIsaretle(o, kaynak.id, konuId))
    if (!onceBitti && kaynakBittiMi(yeni)) soyle('Tebrikler, bu kaynağı bitirdin!')
  }

  const uniteyiIsaretle = (kaynak: Kaynak, unite: Unite) => {
    const onceBitti = kaynakBittiMi(kaynak)
    const yeni = uniteIsaretle([kaynak], kaynak.id, unite)[0]
    setKaynaklar((o) => uniteIsaretle(o, kaynak.id, unite))
    if (!onceBitti && kaynakBittiMi(yeni)) soyle('Tebrikler, bu kaynağı bitirdin!')
  }

  return (
    <div>
      {acik ? (
        <KaynakIci
          kaynak={acik}
          onIsaretle={(konuId) => isaretle(acik, konuId)}
          onUnite={(unite) => uniteyiIsaretle(acik, unite)}
          onEylemler={() => setEylemli(acik)}
        />
      ) : (
        <>
          <BaslikSatiri arac="kaynak-takibi" baslik="Kaynak Takibi" />

          {kaynaklar.length === 0 ? (
            <BosListe onEkle={() => setSayfa({})} />
          ) : (
            <>
              {siniflar.length > 1 && (
                <div className="mb-3 grid gap-1 rounded-[14px] bg-muted/70 p-1" style={{ gridTemplateColumns: `repeat(${siniflar.length + 1}, minmax(0, 1fr))` }}>
                  {[null, ...siniflar].map((s) => (
                    <button
                      key={s ?? 'tumu'}
                      type="button"
                      onClick={() => setSuzgec(s)}
                      aria-pressed={etkinSuzgec === s}
                      className={cn(
                        'h-9 rounded-[11px] text-[13px] font-extrabold transition',
                        etkinSuzgec === s ? 'bg-card text-foreground shadow-kart' : 'text-muted-foreground active:bg-card/60',
                      )}
                    >
                      {s === null ? 'Tümü' : `${s}. sınıf`}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 px-0.5 pb-2">
                <h2 className="shrink-0 font-display text-[15px] font-extrabold tracking-tight">Kaynakların</h2>
                <span aria-hidden className="h-px flex-1 bg-border" />
                <span className="rakam shrink-0 text-[11px] font-bold text-muted-foreground/70">
                  {kaynaklar.length}/{EN_COK_KAYNAK}
                </span>
                <button
                  type="button"
                  onClick={() => setSayfa({})}
                  disabled={kaynaklar.length >= EN_COK_KAYNAK}
                  aria-label="Kaynak ekle"
                  // Görsel 36 piksel; `::after` dokunma alanını 44'e çıkarıyor.
                  className="relative grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary transition after:absolute after:-inset-1 active:scale-95 disabled:opacity-40 disabled:active:scale-100"
                >
                  <Plus size={18} strokeWidth={2.8} aria-hidden />
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {gorunenler.map((kaynak, sira) => (
                  <KaynakKarti
                    key={kaynak.id}
                    kaynak={kaynak}
                    sira={sira}
                    onAc={() => {
                      listeKaydirma.current = window.scrollY
                      setAcikId(kaynak.id)
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {mesaj !== null && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+var(--guvenli-alt))] z-40 flex justify-center px-6 tablet:right-[var(--ray)] tablet:bottom-[calc(1.5rem+var(--guvenli-alt))]">
          <p className="acilir-giris max-w-md rounded-2xl bg-foreground px-4 py-3 text-center text-[13.5px] font-bold text-background shadow-kart">
            {mesaj}
          </p>
        </div>
      )}

      {sayfa !== null && (
        <KaynakSayfasi
          duzenlenen={sayfa.kaynak}
          varsayilanSinif={etkinSuzgec ?? varsayilanKaynakSinifi(sinif)}
          onKapat={() => setSayfa(null)}
          onEkle={ekle}
          onAdlandir={(ad) => {
            const eski = sayfa.kaynak
            setSayfa(null)
            if (!eski || eski.ad === ad) return
            setKaynaklar((o) => kaynakAdlandir(o, eski.id, ad))
            soyle('Kaynağın adı değişti.')
          }}
        />
      )}

      {eylemli !== null && (
        <KaynakEylemleri
          kaynak={eylemli}
          onKapat={() => setEylemli(null)}
          onAdlandir={() => setSayfa({ kaynak: eylemli })}
          onSil={() => setSilinecek(eylemli)}
        />
      )}

      <Onay
        acik={silinecek !== null}
        baslik="Kaynak silinsin mi?"
        aciklama={silinecek ? `"${silinecek.ad}" ve işaretlediğin konular silinecek.` : ''}
        onOnayla={() => {
          if (!silinecek) return
          setKaynaklar((o) => kaynakSil(o, silinecek.id))
          setAcikId(null)
          setSilinecek(null)
          soyle('Kaynak silindi.')
        }}
        onIptal={() => setSilinecek(null)}
      />
    </div>
  )
}

/** Dersin dört tonu (`--konu-<ders>`): zemin, kenar, yazı, dolgu. */
function renkler(ders: KonuDersId) {
  return {
    zemin: `var(--konu-${ders})`,
    kenar: `var(--konu-${ders}-kenar)`,
    koyu: `var(--konu-${ders}-koyu)`,
    dolgu: `var(--konu-${ders}-ok)`,
  }
}

function yuzde({ biten, toplam }: { biten: number; toplam: number }): number {
  return toplam > 0 ? Math.round((biten / toplam) * 100) : 0
}

/** Hiç kaynak yokken: ne işe yaradığını söyleyen tek kart ve ekleme düğmesi. */
function BosListe({ onEkle }: { onEkle: () => void }) {
  return (
    <Kart className="flex flex-col items-center px-6 py-8 text-center">
      <span className="grid size-14 place-items-center rounded-[18px] bg-primary-soft text-primary" aria-hidden>
        <BookOpen size={26} strokeWidth={2.2} />
      </span>
      <p className="mt-3.5 font-display text-[18px] font-extrabold tracking-tight">Test kitaplarını ekle</p>
      <p className="mt-1 max-w-xs text-[13.5px] font-semibold text-pretty text-muted-foreground">
        Kitabın adını yaz, sınıfını ve dersini seç. Konular hazır gelir; bitirdikçe tek tek işaretle.
      </p>
      <Buton onClick={onEkle} className="mt-5 h-12 w-full max-w-60 rounded-[15px]">
        <Plus size={18} strokeWidth={2.8} aria-hidden />
        Kaynak ekle
      </Buton>
    </Kart>
  )
}

/** Listedeki kaynak: ders simgesi, ad, sınıf · ders ve ders renginde ilerleme çubuğu. */
function KaynakKarti({ kaynak, sira, onAc }: { kaynak: Kaynak; sira: number; onAc: () => void }) {
  const r = renkler(kaynak.ders)
  const ilerleme = kaynakIlerlemesi(kaynak)
  const bitti = ilerleme.toplam > 0 && ilerleme.biten === ilerleme.toplam
  const giris = kartGirisi(sira)
  return (
    <button
      type="button"
      onClick={onAc}
      style={giris.style}
      className={cn(
        giris.className,
        'golge-kart flex w-full items-center gap-3 rounded-[18px] bg-card py-3 pr-2 pl-3 text-left transition active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      )}
    >
      <span
        className="relative grid size-12 shrink-0 place-items-center rounded-[14px] border"
        style={{ background: r.zemin, borderColor: r.kenar }}
        aria-hidden
      >
        <span className="emoji text-[22px] leading-none">{dersIkonu(kaynak.ders)}</span>
        {bitti && (
          <span className="absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full border-2 border-card bg-success text-white">
            <Check size={11} strokeWidth={3.4} />
          </span>
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] leading-snug font-extrabold">{kaynak.ad}</span>
        <span className="mt-0.5 block text-[12px] font-bold" style={{ color: r.koyu }}>
          {kaynak.sinif}. sınıf · {dersAdi(kaynak.ders, kaynak.sinif)}
        </span>
        <span className="mt-2 flex items-center gap-2">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full transition-[width] duration-500"
              style={{ width: `${yuzde(ilerleme)}%`, background: bitti ? 'var(--success)' : r.dolgu }}
            />
          </span>
          <span className="rakam shrink-0 text-[11.5px] font-extrabold text-muted-foreground">
            {ilerleme.biten}/{ilerleme.toplam}
          </span>
        </span>
      </span>

      <ChevronRight size={18} strokeWidth={2.4} className="shrink-0 text-muted-foreground/60" aria-hidden />
    </button>
  )
}

/**
 * Kaynağın içi: üstte kaynağın kartı (ad, sınıf · ders, yüzde ve çubuk),
 * altında ünite ünite konular. Ekranın vurgu rengi dersin rengi
 * (`dersVurgusu`): ünite çubukları ve tikler dersle aynı tonda.
 */
function KaynakIci({
  kaynak,
  onIsaretle,
  onUnite,
  onEylemler,
}: {
  kaynak: Kaynak
  onIsaretle: (konuId: string) => void
  onUnite: (unite: Unite) => void
  onEylemler: () => void
}) {
  const r = renkler(kaynak.ders)
  const ilerleme = kaynakIlerlemesi(kaynak)
  const oran = yuzde(ilerleme)
  const bitti = ilerleme.toplam > 0 && ilerleme.biten === ilerleme.toplam

  return (
    <div style={dersVurgusu(kaynak.ders)}>
      <div className="golge-kart overflow-hidden rounded-[22px] bg-card">
        <div className="flex items-start gap-3 px-4 pt-4" style={{ background: `linear-gradient(180deg, ${r.zemin}, var(--card))` }}>
          <span
            className="grid size-[52px] shrink-0 place-items-center rounded-[16px] border bg-card"
            style={{ borderColor: r.kenar }}
            aria-hidden
          >
            <span className="emoji text-[25px] leading-none">{dersIkonu(kaynak.ders)}</span>
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <h1 className="font-display text-[21px] leading-tight font-extrabold tracking-tight break-words">{kaynak.ad}</h1>
            <p className="mt-1 text-[12.5px] font-extrabold" style={{ color: r.koyu }}>
              {kaynak.sinif}. sınıf · {dersAdi(kaynak.ders, kaynak.sinif)}
            </p>
          </div>
          <button
            type="button"
            onClick={onEylemler}
            aria-label="Kaynak işlemleri"
            className="-mt-1 -mr-2 grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground transition active:bg-muted"
          >
            <MoreHorizontal size={20} strokeWidth={2.4} aria-hidden />
          </button>
        </div>

        <div className="px-4 pt-4 pb-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[12.5px] font-bold text-muted-foreground">
              <span className="rakam font-extrabold text-foreground">{ilerleme.biten}</span>/
              <span className="rakam">{ilerleme.toplam}</span> konu bitti
            </span>
            <span className="rakam font-display text-[22px] leading-none font-extrabold" style={{ color: bitti ? 'var(--success)' : r.koyu }}>
              %{oran}
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${oran}%`, background: bitti ? 'var(--success)' : r.dolgu }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3.5">
        {uniteler(kaynak.sinif, kaynak.ders).map((unite, sira) => (
          <UniteBolumu
            key={unite.ad}
            kaynak={kaynak}
            unite={unite}
            sira={sira}
            onIsaretle={onIsaretle}
            onUnite={() => onUnite(unite)}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Bir ünite: başlıkta sıra, ad, "b/n" ve üniteyi toplu işaretleyen yuvarlak;
 * altında konu satırları. Yüzey Yapılacaklar'ın gün listesiyle aynı (soluk
 * kart, içinde beyaz satırlar).
 */
function UniteBolumu({
  kaynak,
  unite,
  sira,
  onIsaretle,
  onUnite,
}: {
  kaynak: Kaynak
  unite: Unite
  sira: number
  onIsaretle: (konuId: string) => void
  onUnite: () => void
}) {
  const ilerleme = uniteIlerlemesi(kaynak, unite)
  const tamam = ilerleme.biten === ilerleme.toplam
  // İngilizce'nin tek "ünitesi" bir başlık değil, liste: sıra numarası yazılmıyor.
  const tekBolum = unite.ad === 'Üniteler'

  return (
    <section className="rounded-[20px] border border-border bg-card/60 px-2.5 pt-3 pb-2.5">
      <div className="flex items-center gap-2.5 px-1 pb-2.5">
        <div className="min-w-0 flex-1">
          {!tekBolum && (
            <p className="text-[10.5px] font-extrabold tracking-[0.08em] text-primary uppercase">{sira + 1}. ünite</p>
          )}
          <h2 className="font-display text-[15px] leading-snug font-extrabold tracking-tight text-pretty">{unite.ad}</h2>
        </div>
        <span className="rakam shrink-0 text-[12px] font-extrabold text-muted-foreground">
          {ilerleme.biten}/{ilerleme.toplam}
        </span>
        <button
          type="button"
          onClick={onUnite}
          aria-pressed={tamam}
          aria-label={tamam ? `${unite.ad}: hepsinin işaretini kaldır` : `${unite.ad}: hepsini işaretle`}
          title={tamam ? 'Hepsini kaldır' : 'Hepsini işaretle'}
          className="relative grid size-8 shrink-0 place-items-center rounded-full transition after:absolute after:-inset-1.5 active:scale-95"
        >
          <span
            className={cn(
              'grid size-[26px] place-items-center rounded-full border-2 transition',
              tamam ? 'border-success bg-success text-white' : 'border-dashed border-primary-parlak/60 text-primary/70',
            )}
          >
            <Check size={12} strokeWidth={3.2} aria-hidden />
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        {unite.konular.map((ad) => {
          const id = konuKimligi(ad)
          return <KonuSatiri key={id} ad={ad} bitti={kaynak.bitenler.includes(id)} onIsaretle={() => onIsaretle(id)} />
        })}
      </div>
    </section>
  )
}

/**
 * Konu satırı — Yapılacaklar'daki görev satırının tiki: boş yuvarlak, bitince
 * yeşil ve üstü çizili. Bütün satır dokunulabilir; yalnız yuvarlak hedef
 * olsaydı uzun konu adına dokunan öğrenci hiçbir şey olmadığını görürdü.
 */
function KonuSatiri({ ad, bitti, onIsaretle }: { ad: string; bitti: boolean; onIsaretle: () => void }) {
  return (
    <button
      type="button"
      onClick={onIsaretle}
      aria-pressed={bitti}
      className={cn(
        'flex min-h-[50px] w-full items-center gap-3 rounded-[14px] border border-border bg-card py-2.5 pr-3 pl-3 text-left transition active:scale-[0.99]',
        bitti ? 'opacity-60' : 'shadow-kart',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'grid size-[26px] shrink-0 place-items-center rounded-full border-2 transition',
          bitti ? 'border-success bg-success text-white' : 'border-border bg-card text-transparent',
        )}
      >
        <Check size={12} strokeWidth={3.2} />
      </span>
      <span className={cn('min-w-0 flex-1 text-[14px] leading-snug font-bold text-pretty', bitti && 'line-through')}>
        {ad}
      </span>
    </button>
  )
}

/** "⋯" alt sayfası: adı değiştir ve sil (Yapılacaklar'ın görev menüsüyle aynı biçim). */
function KaynakEylemleri({
  kaynak,
  onKapat,
  onAdlandir,
  onSil,
}: {
  kaynak: Kaynak
  onKapat: () => void
  onAdlandir: () => void
  onSil: () => void
}) {
  useGeriKatmani(true, onKapat)
  const kaydir = useAsagiKaydirKapat(onKapat)
  const sec = (eylem: () => void) => () => {
    onKapat()
    eylem()
  }

  return (
    <div className="katman-zemin fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onKapat}>
      <div
        ref={kaydir}
        className="alt-pencere-girisi w-full max-w-md rounded-t-[26px] bg-card px-[18px] pt-2 pb-[calc(1.25rem+var(--guvenli-alt))]"
        onClick={(olay) => olay.stopPropagation()}
      >
        <div className="flex justify-center pt-1.5 pb-3">
          <span className="h-[5px] w-[42px] rounded-[3px] bg-border" />
        </div>
        <p className="truncate px-1 font-display text-[17px] font-extrabold tracking-tight">{kaynak.ad}</p>
        <p className="px-1 pb-3 text-[12.5px] font-bold text-muted-foreground">
          {kaynak.sinif}. sınıf · {dersAdi(kaynak.ders, kaynak.sinif)}
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={sec(onAdlandir)}
            className="flex w-full items-center gap-3 rounded-2xl bg-muted/70 px-4 py-3.5 text-left text-[15px] font-bold text-foreground transition active:brightness-95"
          >
            <Pencil size={18} strokeWidth={2.3} aria-hidden />
            Adını değiştir
          </button>
          <button
            type="button"
            onClick={sec(onSil)}
            className="mt-1 flex w-full items-center gap-3 rounded-2xl bg-danger-soft px-4 py-3.5 text-left text-[15px] font-bold text-danger transition active:brightness-95"
          >
            <Trash2 size={18} strokeWidth={2.3} aria-hidden />
            Sil
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Kaynak ekleme alt sayfası: ad, sınıf, ders. Ad değiştirmede yalnız ad
 * soruluyor — sınıf ya da ders değişseydi atılmış tikler başka bir listenin
 * konularına düşerdi.
 *
 * Kaydet eksik alanda soluk ama basılabilir; basınca eksik alan kırmızıyla
 * işaretleniyor (Yapılacaklar'ın formuyla aynı kural).
 */
function KaynakSayfasi({
  duzenlenen,
  varsayilanSinif,
  onKapat,
  onEkle,
  onAdlandir,
}: {
  duzenlenen?: Kaynak
  varsayilanSinif: KaynakSinifi
  onKapat: () => void
  onEkle: (ad: string, sinif: KaynakSinifi, ders: KonuDersId) => void
  onAdlandir: (ad: string) => void
}) {
  const [ad, setAd] = useState(duzenlenen?.ad ?? '')
  const [sinif, setSinif] = useState<KaynakSinifi>(varsayilanSinif)
  const [ders, setDers] = useState<KonuDersId | null>(null)
  const [hata, setHata] = useState(false)

  useGeriKatmani(true, onKapat)
  const kaydir = useAsagiKaydirKapat(onKapat)
  const kapatmaOnayi = useKapatmaOnayi({
    aciklama: duzenlenen ? 'Yeni ad kaydedilmeden pencere kapanır.' : 'Kaynak eklenmeden pencere kapanır.',
  })

  const temizAd = kaynakAdiKirp(ad)
  const gecerli = temizAd !== '' && (duzenlenen !== undefined || ders !== null)
  const dersler = kaynakDersleri(sinif)
  const secilenUniteler = ders ? uniteler(sinif, ders) : []
  const konuSayisi = secilenUniteler.reduce((t, u) => t + u.konular.length, 0)

  const gonder = () => {
    if (!gecerli) {
      setHata(true)
      return
    }
    if (duzenlenen) onAdlandir(temizAd)
    else if (ders) onEkle(temizAd, sinif, ders)
  }

  return (
    <div className="katman-zemin fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onKapat}>
      {kapatmaOnayi.pencere}
      <div
        ref={kaydir}
        className="alt-pencere-girisi max-h-[88%] w-full max-w-md overflow-y-auto rounded-t-[26px] bg-card px-[18px] pt-2 pb-[calc(1.5rem+var(--guvenli-alt))]"
        onClick={(olay) => olay.stopPropagation()}
      >
        <div className="flex justify-center pt-1.5 pb-3">
          <span className="h-[5px] w-[42px] rounded-[3px] bg-border" />
        </div>

        <div className="mb-1 flex items-center gap-2.5">
          <p className="font-display text-lg font-extrabold tracking-tight">
            {duzenlenen ? 'Adını değiştir' : 'Kaynak ekle'}
          </p>
          <button
            type="button"
            onClick={() => (ad !== (duzenlenen?.ad ?? '') ? kapatmaOnayi.sor(onKapat) : onKapat())}
            aria-label="Kapat"
            className="relative ml-auto grid size-9 shrink-0 place-items-center rounded-xl bg-muted/70 text-muted-foreground transition after:absolute after:-inset-1 active:brightness-95"
          >
            <X size={16} strokeWidth={2.4} aria-hidden />
          </button>
        </div>

        <AlanBasligi
          baslik="Kaynağın adı"
          sayac={`${temizAd.length}/${EN_UZUN_KAYNAK_ADI}`}
          hata={hata && temizAd === '' ? 'Bir ad yaz' : undefined}
        />
        <input
          value={ad}
          onChange={(olay) => setAd(olay.target.value.slice(0, EN_UZUN_KAYNAK_ADI))}
          maxLength={EN_UZUN_KAYNAK_ADI}
          placeholder="Örn. Fizik Soru Bankası"
          aria-label="Kaynağın adı"
          className={cn(
            'h-[52px] w-full rounded-[16px] border bg-background px-3.5 text-[15px] font-bold outline-none transition placeholder:font-semibold placeholder:text-muted-foreground/70 focus-visible:border-primary-parlak focus-visible:bg-card',
            hata && temizAd === '' ? 'border-danger' : 'border-input',
          )}
        />

        {!duzenlenen && (
          <>
            <AlanBasligi baslik="Sınıf" />
            <div className="grid grid-cols-4 gap-1">
              {KAYNAK_SINIFLARI.map((s) => (
                <SecimDugmesi key={s} secili={sinif === s} onClick={() => setSinif(s)} etiket={`${s}. sınıf`} className="rakam">
                  {s}. sınıf
                </SecimDugmesi>
              ))}
            </div>

            <AlanBasligi baslik="Ders" hata={hata && ders === null ? 'Birini seç' : undefined} />
            <div
              className={cn(
                'grid grid-cols-2 gap-1.5 rounded-2xl',
                hata && ders === null && 'outline-2 outline-offset-[3px] outline-danger/45',
              )}
            >
              {dersler.map((d) => {
                const r = renkler(d.id)
                const secili = ders === d.id
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDers(d.id)}
                    aria-pressed={secili}
                    className={cn(
                      'flex h-[50px] items-center gap-2.5 rounded-[14px] border-[1.5px] px-2.5 text-left text-[14px] font-extrabold transition active:brightness-95',
                      !secili && 'border-border bg-card',
                    )}
                    style={secili ? { background: r.zemin, borderColor: r.dolgu, color: r.koyu } : undefined}
                  >
                    <span
                      className="emoji grid size-8 shrink-0 place-items-center rounded-[10px] text-[17px] leading-none"
                      style={{ background: secili ? 'var(--card)' : r.zemin }}
                      aria-hidden
                    >
                      {d.ikon}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{d.ad}</span>
                    {secili && <Check size={16} strokeWidth={3} className="shrink-0" aria-hidden />}
                  </button>
                )
              })}
            </div>

            {/* Seçimin neyi getireceği kaydetmeden görünsün: kitap bu sınıfın
                konularıyla mı açılacak. */}
            <p className="mt-2.5 min-h-[18px] px-0.5 text-[12px] font-bold text-muted-foreground">
              {ders
                ? `${sinif}. sınıf ${dersAdi(ders, sinif)}: ${secilenUniteler.length} ünite, ${konuSayisi} konu`
                : sinif === 12
                  ? '12. sınıfta 2018 programının konuları listelenir.'
                  : `${sinif}. sınıfta Maarif Modeli'nin konuları listelenir.`}
            </p>
          </>
        )}

        <Buton
          onClick={gonder}
          aria-disabled={!gecerli}
          className={cn('mt-[18px] h-[54px] w-full rounded-[17px] text-base', !gecerli && 'opacity-45')}
        >
          {duzenlenen ? 'Kaydet' : 'Ekle'}
        </Buton>
      </div>
    </div>
  )
}
