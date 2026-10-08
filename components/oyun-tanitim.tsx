'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import type { OyunTanimi } from '@/lib/oyunlar/tanim'
import type { OyunId } from '@/lib/types'
import { MODLAR, type OyunModu } from '@/lib/oyunlar/mod'
import { ANAHTARLAR, useYerelDepo } from '@/lib/depo'
import { vurgulariAyir } from '@/lib/metin'
import { useGeriKatmani } from '@/lib/geri'
import { useGenelTest, useGenelTestIlkMi } from '@/components/genel-test-baglami'
import { useTurAyari } from '@/components/tur-ayari-baglami'
import { cn } from '@/lib/utils'
import { Rabi } from '@/components/maskot/rabi'
import { ModSecimi } from '@/components/mod-secimi'
import { dersVurgusu } from '@/components/ders-renkleri'
import { GeriSayim } from '@/components/oyun-geri-sayim'
import { OYUN_ORNEKLERI, type OyunOrnegi } from '@/components/oyun-ornekleri'

/**
 * Turdan önceki ekran: **oyun modu penceresi** (`ModPenceresi`). Oradaki
 * "Başla" doğrudan geri sayımı açıyor; arada nasıl oynandığını anlatan
 * **tanıtım** yok.
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
 * geçiliyor. Sonra zorluk sorusu da kalktı (kullanıcı istedi): pencerede
 * yalnız mod var, tur hep ortadan başlıyor ve uyum gidişi belirliyor
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
  const genelTestIlk = useGenelTestIlkMi()
  /* Ayarlar prop olarak gelmiyor: pencereyi çizen yirmi iki oyun dosyasının
     her birine aynı dört satırı yazmak gerekirdi (`tur-ayari-baglami.tsx`). */
  const { mod, setMod, secilebilir } = useTurAyari()

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
    /* Testin ilk oyunu 3 · 2 · 1 ile açılıyor: kullanıcı "Teste başla"ya
       basınca ilk soru hemen geliyordu, sıradan bir turun başlangıcıyla
       aynı sayım burada da olmalı. Sonraki oyunlar sayımsız. */
    if (genelTestIlk) setSayiliyor(true)
    else onBasla()
  }, [genelTest, genelTestIlk, acik, baslatir, onBasla])

  if (!acik) return null

  // Sayım sürerken ekran yok: sıra hazırlanmada.
  if (sayiliyor) return <GeriSayim onBitti={onBasla} />

  /* Genel test bankadaki oyunları arka arkaya oynatıyor; her oyunun başında
     bir tanıtım ekranı, tek bir testi yarım düzine ekrana bölerdi. */
  if (genelTest && baslatir) return null

  const ornekler = OYUN_ORNEKLERI[oyun.id]

  if (secimVar) {
    return <ModPenceresi
      demoVeri={demoVeri}
      mod={mod}
      setMod={setMod}
      onDevam={() => { onSayimBasladi?.(); setSayiliyor(true) }}
      onKapat={onKapat}
    />
  }

  return (
    <Sayfa onGeri={onKapat} geriEtiketi="Vazgeç">
      <Orta>
        <div className="flex justify-center py-2">
          <Rabi durum="calisiyor" poz="tahtali" boyut={84} />
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
 * Oyun modu penceresi (`tasarim/oyun-modu-penceresi.html`): oyun listesinin
 * üstünde açılır pencere, tam ekran değil — tek bir seçim için bütün ekranı
 * kaplamak, oyunu açan öğrenciyi başka bir sayfaya götürmüş gibi oluyordu.
 *
 * Yalnız mod seçiliyor; başlangıç zorluğu seçimi kaldırıldı (kullanıcı
 * istedi), tur ortadan başlıyor ve uyum gidişi belirliyor (`uyum.ts`).
 * Oyunun adı ve rekor da pencerede yok: tasarım tek soruya ("hangi mod")
 * indirildi.
 *
 * Kapanış üç yoldan: ✕, karartılmış zemine dokunmak, geri tuşu
 * (`useGeriKatmani`, `OyunTanitim`te). Hiçbiri sormuyor: kaybedilecek bir şey
 * yok, seçim zaten saklanıyor.
 */
function ModPenceresi({
  demoVeri = false,
  mod,
  setMod,
  onDevam,
  onKapat,
}: {
  demoVeri?: boolean
  mod: OyunModu
  setMod: (mod: OyunModu) => void
  onDevam: () => void
  onKapat: () => void
}) {
  return (
    <div
      className="katman-zemin fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-5 pt-[calc(1rem+var(--guvenli-ust))] pb-[calc(1rem+var(--guvenli-alt))]"
      onClick={(olay) => {
        // Yalnız zeminin kendisi: pencerenin içine dokunmak kabarıp buraya
        // ulaşıyor ve kart seçmek pencereyi kapatırdı.
        if (olay.target === olay.currentTarget) onKapat()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mod-penceresi-basligi"
        className="pencere-girisi relative flex max-h-full w-full max-w-[360px] flex-col overflow-y-auto rounded-[28px] bg-card px-[18px] pt-6 pb-5 golge-kart"
      >
        {/* Uygulamadaki pencerelerin kapatma düğmesi (Ayarlar, Soru ekle). */}
        <button
          type="button"
          onClick={onKapat}
          aria-label="Kapat"
          className="absolute top-3.5 right-3.5 inline-flex size-9 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground active:bg-muted"
        >
          <X size={16} strokeWidth={2.4} aria-hidden />
        </button>

        <Rabi durum="normal" poz="oturan" boyut={80} className="mx-auto" etiket="oturmuş, turu bekliyor" />
        <h2
          id="mod-penceresi-basligi"
          className="mt-2 text-center font-display text-[23px] font-black leading-tight tracking-tight"
        >
          Oyun modunu seç
        </h2>

        <div data-tanitim={demoVeri ? 'demo-zorluk' : undefined} className="mt-5">
          <ModSecimi secili={mod} onSec={setMod} />
        </div>

        {/* Konu sahnesindeki karar düğmelerinin dili (`sahne-dugme`): altta
            kalın kenar, basınca gömülüyor. Kenar `--primary`, dolgunun koyusu. */}
        <button
          type="button"
          data-tanitim={demoVeri ? 'demo-baslat' : undefined}
          onClick={onDevam}
          className="mt-5 mb-[5px] flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-parlak font-display text-[18px] font-black text-white shadow-[0_5px_0_var(--primary)] transition-[transform,box-shadow] duration-75 active:translate-y-[3px] active:shadow-[0_2px_0_var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Başla
          <ArrowRight size={20} strokeWidth={2.6} aria-hidden />
        </button>
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
