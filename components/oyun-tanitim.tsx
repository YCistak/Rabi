'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { OyunTanimi } from '@/lib/oyunlar/tanim'
import type { OyunId } from '@/lib/types'
import { MODLAR, type OyunModu } from '@/lib/oyunlar/mod'
import type { Zorluk } from '@/lib/oyunlar/ritim'
import { ANAHTARLAR, useYerelDepo } from '@/lib/depo'
import { vurgulariAyir } from '@/lib/metin'
import { useGeriKatmani } from '@/lib/geri'
import { useGenelTest } from '@/components/genel-test-baglami'
import { useTurAyari } from '@/components/tur-ayari-baglami'
import { cn } from '@/lib/utils'
import { Rabi } from '@/components/maskot/rabi'
import { ModSecimi } from '@/components/mod-secimi'
import { ZorlukSecimi } from '@/components/zorluk-secimi'
import { dersVurgusu } from '@/components/ders-renkleri'
import { GeriSayim } from '@/components/oyun-geri-sayim'
import { OYUN_ORNEKLERI, type OyunOrnegi } from '@/components/oyun-ornekleri'

/**
 * Turdan önceki ekran: **ayarlar**. Oradaki "Başlat" doğrudan geri sayımı
 * açıyor; arada nasıl oynandığını anlatan **tanıtım** yok.
 *
 * Bir süre ayarlardan sonra tanıtım geliyordu ("Devam" → kurallar → "Başla").
 * Kullanıcı kaldırılmasını istedi: tura girmek her seferinde iki ekran ve iki
 * dokunuş sürüyordu ve kuralı bilen için ikinci ekran yalnızca geçilecek bir
 * engeldi. Kural kaybolmadı — tur sırasındaki "?" tanıtımı her hâlükârda
 * açıyor ve sayaç o sırada duruyor.
 *
 * Tanıtım tur başında yalnızca ayar adımı olmayan turda çıkıyor (Oyun
 * Bankası turu, `secilebilir` false): orada ekranın boş kalmaması için.
 *
 * Adım bir süre kaldırılmıştı: oyunu ilk açan öğrenciye sorulan üç sorunun
 * (hangi mod, hangi seviye, hangi soru türü) cevabı ancak oynayarak
 * öğrenilebiliyor ve "Başla" o üç sorunun arkasında duruyordu. Geri gelirken
 * ikisi değişti — soru türü seçimi geri gelmedi (havuzun tamamı soruluyor) ve
 * kalan iki soru da **cevaplanmak zorunda değil**: ikisi de varsayılanıyla
 * geliyor, dokunulmazsa Sıradan/Orta bir tur açılıyor ve adım tek dokunuşla
 * geçiliyor. Zorluk da artık turu dondurmuyor, yalnızca başlangıcı seçiyor
 * (`lib/oyunlar/uyum.ts`).
 *
 * Tanıtımda "Bir daha gösterme" var (`ANAHTARLAR.tanitimGizli`); artık
 * yalnızca o ayarsız turların başını ilgilendiriyor. Gizlenmiş oyunda ekran
 * hiç çizilmiyor, doğrudan geri sayıma gidiliyor.
 *
 * "Başla" turu **hemen** başlatmıyor: ekranın yerini 3 · 2 · 1 geri sayımı
 * alıyor ve tur sayım bitince açılıyor (`onBasla`). Ekran o sırada
 * gizleniyor ama bileşen ayakta kalıyor — sayımı ayrı bir katmana taşımak,
 * onu 22 oyun dosyasına da eklemek demekti.
 */
export function OyunTanitim({
  oyun,
  acik,
  rekor,
  baslatir,
  onBasla,
  onKapat,
  demoVeri = false,
  onSayimBasladi,
}: {
  demoVeri?: boolean
  onSayimBasladi?: () => void
  oyun: OyunTanimi
  acik: boolean
  /** Bu oyundaki en iyi puan; 0 ise hiç oynanmamış. */
  rekor: number
  /** Düğme turu başlatıyor mu, yoksa yalnızca ekranı mı kapatıyor. */
  baslatir: boolean
  onBasla: () => void
  onKapat: () => void
}) {
  const [sayiliyor, setSayiliyor] = useState(false)
  const [gizliler, setGizliler] = useYerelDepo<OyunId[]>(ANAHTARLAR.tanitimGizli, [])
  const genelTest = useGenelTest()
  /* Ayarlar prop olarak gelmiyor: pencereyi çizen yirmi iki oyun dosyasının
     her birine aynı dört satırı yazmak gerekirdi (`tur-ayari-baglami.tsx`). */
  const { mod, zorluk, setMod, setZorluk, secilebilir } = useTurAyari()

  /* Ayarlar yalnızca tur başlatan ekranda: turun içinden "?" ile açılan
     tanıtım kuralı okutuyor, ayar değiştirmiyor — başlamış bir turun modu
     değişmemeli. */
  const secimVar = baslatir && secilebilir
  const gizli = !demoVeri && gizliler.includes(oyun.id)

  /*
    Ekran her açıldığında baştan başlıyor: bir önceki turda sayım yarıda
    kalmışsa yeni tur tanıtımla açılmalı.

    Tanıtımı gizlenmiş oyunda tur başlatılırken sayım doğrudan açılıyor —
    "bir daha gösterme" denen ekranı bir kare için bile çizmemek gerekiyor.
    Turun içinden "?" ile açılan ekran (`baslatir` yok) gizlemeyi dinlemiyor:
    orada istenen şey zaten kuralı okumak.
  */
  useEffect(() => {
    if (!acik) return
    setSayiliyor(!secimVar && gizli && baslatir)
  }, [acik, gizli, baslatir, secimVar])

  useGeriKatmani(acik, onKapat)

  /*
    Tanıtımı gizlenmiş oyunda ve genel testte tur kendiliğinden başlıyor.

    Etki ikinci kez işlemiyor: `onBasla` turu başlatınca oyunun aşaması
    değişiyor ve ekran `acik` olmaktan çıkıyor. Turun içinden "?" ile açılan
    ekran `baslatir` olmadığı için buraya hiç uğramıyor.
  */
  useEffect(() => {
    if (!genelTest || !acik || !baslatir) return
    onBasla()
  }, [genelTest, acik, baslatir, onBasla])

  if (!acik) return null
  /* Genel test bankadaki oyunları arka arkaya oynatıyor; her oyunun başında
     bir tanıtım ekranı, tek bir testi yarım düzine ekrana bölerdi. */
  if (genelTest && baslatir) return null

  // Sayım sürerken ekran yok: sıra hazırlanmada.
  if (sayiliyor) return <GeriSayim onBitti={onBasla} />

  const ornekler = OYUN_ORNEKLERI[oyun.id]

  if (secimVar) {
    return <TurAyariEkrani
      oyun={oyun}
      demoVeri={demoVeri}
      rekor={rekor}
      mod={mod}
      setMod={setMod}
      zorluk={zorluk}
      setZorluk={setZorluk}
      dugmeMetni="Başlat"
      onDevam={() => { onSayimBasladi?.(); setSayiliyor(true) }}
      onKapat={onKapat}
    />
  }

  return (
    <Sayfa onGeri={onKapat} geriEtiketi="Vazgeç">
      <Orta>
        <div className="flex justify-center py-2">
          <Rabi durum="calisiyor" poz="isaretci" boyut={84} />
        </div>

        <div className="golge-kart rounded-[24px] bg-card px-4 py-4">
          <p className="text-center font-display text-[26px] font-extrabold leading-tight tracking-tight">
            {oyun.ad}
          </p>
          <p className="mt-1 text-center text-[13px] text-muted-foreground">
            {oyun.kisaAciklama}
          </p>

          <div className="mt-3 flex flex-col gap-2.5">
            {ornekler.length > 0 ? (
              ornekler.map((ornek) => <OrnekKutusu key={ornek.baslik} ornek={ornek} />)
            ) : (
              /* Örneği olmayan bir oyun kalırsa kural yazısı devrede. */
              <div className="rounded-[18px] border border-border bg-muted/50 px-3.5 py-3">
                <p className="text-[13px] leading-relaxed">
                  <Vurgulu metin={oyun.ozet} />
                </p>
              </div>
            )}
          </div>

          {/* Seçilen modun süresi turun kuralı: çip "60 saniyen var" diyor.
              Banka turunda seçim yok ve çip o turun gerçek modunu yazıyor. */}
          <div className="mt-3 flex gap-2">
            <Bilgi simge="⏱️" metin={MODLAR[mod].ozet} />
            {rekor > 0 && <Bilgi simge="🏆" metin={`Rekorun ${rekor} doğru`} />}
          </div>
        </div>
      </Orta>

      {/* Kutu turu **başlatmıyor**: işaretlemek bir tercih, oynamaya
          başlamak ayrı bir karar. Tek dokunuşta ikisini birden yapan bir
          düğme, tanıtımı bir daha görmek istemeyen kullanıcıyı hazır
          olmadan tura sokuyordu. */}
      <Kutu
        isaretli={gizli}
        onDegis={() =>
          setGizliler((onceki) =>
            onceki.includes(oyun.id)
              ? onceki.filter((id) => id !== oyun.id)
              : [...onceki, oyun.id],
          )
        }
      >
        Bu oyunda bir daha gösterme
      </Kutu>

      <BuyukDugme onClick={() => (baslatir ? setSayiliyor(true) : onKapat())}>
        {baslatir ? 'Başla  →' : 'Kapat'}
      </BuyukDugme>
    </Sayfa>
  )
}

/**
 * Tur ayarları tam ekran açılır: mod ve başlangıç zorluğu aynı yüzeyde.
 * Yalnızca seçimler kayar; geri düğmesi ve Başlat kısa telefonlarda da
 * görünür kalır. Oyun örneği ya da tanıtım bu ekrana girmez.
 */
function TurAyariEkrani({
  oyun,
  demoVeri = false,
  rekor,
  mod,
  setMod,
  zorluk,
  setZorluk,
  dugmeMetni,
  onDevam,
  onKapat,
}: {
  demoVeri?: boolean
  onSayimBasladi?: () => void
  oyun: OyunTanimi
  rekor: number
  mod: OyunModu
  setMod: (mod: OyunModu) => void
  zorluk: Zorluk
  setZorluk: (zorluk: Zorluk) => void
  dugmeMetni: string
  onDevam: () => void
  onKapat: () => void
}) {
  return (
    <div
      className="tam-katman-girisi fixed inset-0 z-50 flex yuk-ekran justify-center bg-background"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tur-ayari-basligi"
      style={dersVurgusu(oyun.ders)}
    >
      <div className="flex min-h-0 w-full max-w-md flex-col">
        <header className="shrink-0 border-b border-border px-5 pb-4" style={{ paddingTop: 'calc(1rem + var(--guvenli-ust))' }}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onKapat}
              aria-label="Geri"
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-card text-foreground active:bg-muted"
            >
              <ArrowLeft size={20} aria-hidden />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-muted-foreground">Tur ayarları</p>
              <h1 id="tur-ayari-basligi" className="mt-0.5 font-display text-[21px] font-extrabold leading-tight tracking-tight">
                {oyun.ad}
              </h1>
            </div>
          </div>
          {rekor > 0 && (
            <p className="mt-3 pl-[52px] text-[12px] font-semibold text-muted-foreground">
              En iyi turun: <span className="rakam text-foreground">{rekor}</span>
            </p>
          )}
        </header>

        <div data-tanitim={demoVeri ? "demo-zorluk" : undefined} style={demoVeri ? { flex: "0 0 auto" } : undefined} className={cn("min-h-0 flex-1 overflow-y-auto px-5", demoVeri ? "py-2" : "py-5")}>
          <ModSecimi kompakt={demoVeri} secili={mod} onSec={setMod} />
          <div className={demoVeri ? "mt-2 border-t border-border pt-2" : "mt-6 border-t border-border pt-5"}>
            <ZorlukSecimi secili={zorluk} onSec={setZorluk} />
          </div>
        </div>

        <footer className={cn("shrink-0 border-t border-border bg-background px-5 pt-3", demoVeri && "mt-auto")} style={{ paddingBottom: 'calc(0.75rem + var(--guvenli-alt))' }}>
          <button
            type="button"
            data-tanitim={demoVeri ? "demo-baslat" : undefined}
            onClick={onDevam}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary-parlak font-display text-[17px] font-extrabold text-white transition active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {dugmeMetni}
            <span aria-hidden>→</span>
          </button>
        </footer>
      </div>
    </div>
  )
}

/**
 * Ekranın iskeleti.
 *
 * Yükseklik ekranın kendisi (`h-dvh`) ve içerik üç parçaya bölünüyor: üstte
 * geri düğmesi, ortada esneyen kart, altta büyük düğme. Kart taşarsa yalnız
 * o kayıyor; "Başla" her cihazda görünür kalıyor.
 */
function Sayfa({
  onGeri,
  geriEtiketi,
  children,
}: {
  onGeri: () => void
  geriEtiketi: string
  children: React.ReactNode
}) {
  return (
    <div className="tam-katman-girisi fixed inset-0 z-50 flex yuk-ekran justify-center bg-background">
      <div
        className="flex w-full max-w-[480px] flex-col px-5"
        style={{
          paddingTop: 'calc(0.5rem + var(--guvenli-ust))',
          paddingBottom: 'calc(0.75rem + var(--guvenli-alt))',
        }}
      >
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={onGeri}
            aria-label={geriEtiketi}
            className="golge-kart flex size-9 items-center justify-center rounded-full bg-card text-foreground transition active:brightness-95"
          >
            <ArrowLeft size={18} aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/**
 * Geri düğmesiyle alttaki büyük düğmenin arasında kalan boşluk.
 *
 * İçerik bu boşluğu **doldurmuyor**, ortasında duruyor: kart esneyip
 * yüksekliği kaplayınca uzun telefonlarda kartın altında kocaman bir boş
 * alan kalıyordu. `my-auto` kaydırmayla da uyumlu — içerik sığmadığında
 * `justify-center` gibi üstü kırpmıyor, normal biçimde kayıyor.
 */
function Orta({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="my-auto w-full">{children}</div>
    </div>
  )
}

/** Tanıtımın altındaki işaret kutusu. */
function Kutu({
  isaretli,
  onDegis,
  children,
}: {
  isaretli: boolean
  onDegis: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isaretli}
      onClick={onDegis}
      className="mt-3 flex shrink-0 items-center gap-2.5 self-center px-2 py-1.5 text-[13px] font-bold text-muted-foreground"
    >
      <span
        aria-hidden
        className={cn(
          'flex size-5 flex-none items-center justify-center rounded-md border-2 text-xs font-extrabold',
          isaretli ? 'border-primary-dolu bg-primary-dolu text-white' : 'border-border bg-card',
        )}
      >
        {isaretli ? '✓' : ''}
      </span>
      {children}
    </button>
  )
}

/** Ekranın en altındaki turuncu düğme. */
function BuyukDugme({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 w-full shrink-0 rounded-[20px] bg-primary-dolu py-4 font-display text-lg font-extrabold text-white transition active:brightness-95"
    >
      {children}
    </button>
  )
}

/** Oyundan alınmış tek kare: etiket, görüntü, altında kuralı. */
function OrnekKutusu({ ornek }: { ornek: OyunOrnegi }) {
  return (
    <div className="rounded-[18px] border border-border bg-muted/50 px-3.5 py-3">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-primary">
        {ornek.baslik}
      </p>
      <div className="mt-2">{ornek.gorunum}</div>
      <p className="mt-2 text-[13px] leading-snug text-muted-foreground">{ornek.kural}</p>
    </div>
  )
}

/** Kartın altındaki tek satırlık bilgi çipi: süre, rekor. */
function Bilgi({ simge, metin }: { simge: string; metin: string }) {
  return (
    <div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-primary-soft px-3.5 py-3">
      <span aria-hidden className="emoji text-lg leading-none">
        {simge}
      </span>
      <span className="rakam text-[13.5px] font-bold leading-snug">{metin}</span>
    </div>
  )
}

/**
 * Maddedeki `**kalın**` ve `*eğik*` bölümleri.
 *
 * Metinler elle yazılıyor, dolayısıyla kullanıcıdan gelen bir şey yok; yine de
 * biçimlendirme HTML üretmeden, parça parça çiziliyor.
 */
function Vurgulu({ metin }: { metin: string }) {
  return (
    <>
      {vurgulariAyir(metin).map((parca, sira) =>
        parca.tur === 'kalin' ? (
          <strong key={sira} className="font-extrabold text-foreground">
            {parca.metin}
          </strong>
        ) : parca.tur === 'egik' ? (
          <em key={sira} className="italic">
            {parca.metin}
          </em>
        ) : (
          <span key={sira} className="text-muted-foreground">
            {parca.metin}
          </span>
        ),
      )}
    </>
  )
}
