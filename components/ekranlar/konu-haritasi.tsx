'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronDown, Flag, Star, X } from 'lucide-react'
import {
  KONU_DERSLERI,
  KONU_SINIFLARI,
  dersBul,
  okumaDakikasi,
  programBul,
  tumKonular,
  type Konu,
  type KonuAilesi,
  type KonuDersId,
  type KonuSinifi,
  type Tema,
} from '@/lib/konu'
import {
  GECME_ORANI,
  dersOrani,
  ilerlemeyiYaz,
  kilidiAc,
  konuBitti,
  konuKilitli,
  soruOrani,
  temadaBiten,
  type KonuIlerlemeleri,
} from '@/lib/konu/ilerleme'
import { bugun, cn } from '@/lib/utils'
import { useGeriKatmani } from '@/lib/geri'
import { Kart, Onay } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { KartDestesi, type DesteSonucu } from '@/components/konu/kart-destesi'
import { SoruSahnesi, type SahneSonucu } from '@/components/konu/soru-sahnesi'

/**
 * Konu Anlatımı haritası — yılan patika.
 *
 * Konular ekranın ortasında sağa sola sallanan bir yola diziliyor; düğümün
 * üstünde konunun adı **yazmıyor**. Patika bir kez denenip listeye
 * dönülmüştü çünkü ad düğümün altında iki üç kelimeye sığmak zorundaydı ve
 * "kaç kart, ne kadar sürer" hiçbir yere yazılamıyordu. Bu sefer o yazıların
 * hiçbiri haritada değil: düğüme basınca aşağıdan **konu sayfası** geliyor ve
 * ad, süre, kart sayısı, soru durumu orada duruyor. Harita yalnızca sırayı ve
 * nerede kalındığını gösteriyor — tek bakışta okunması gereken şey o.
 *
 * **Kilit var.** Bir konu, bir öncekinin kartları okunup soruları geçilmeden
 * açılmıyor. Kilit dayatma değil yavaşlatma: konu sayfasındaki "Yine de aç"
 * kilidi kaldırıyor, ama önce "emin misin" diye soruyor. Sınav
 * hazırlığındaki öğrenci yarın işlenecek konuya bugün bakabilsin diye
 * kapının anahtarı hep elinde; sorunun tek işi kapıyı yanlışlıkla
 * açmamasını sağlamak. Açılan kilit kayda giriyor (`acildi`), yani uyarı
 * aynı konuda ikinci kez çıkmıyor.
 */

/**
 * Patikadaki tek basamak.
 *
 * Bir konu yolda **iki** basamak açıyor: kartları (yuvarlak) ve soruları
 * (altıgen). Numara ikisi boyunca kesintisiz akıyor — 1. kartlar, 2. sorular,
 * 3. kartlar, 4. sorular… Sorular bir konunun içine gömülü alt adım değil,
 * yolun üstünde durup geçilmesi gereken kendi basamağı; "kaç durak kaldı"
 * sorusunun cevabı haritada sayılabilmeli.
 *
 * Şekil ayrı çünkü iş ayrı: yuvarlak okumak, altıgen sınanmak. Aynı şekli iki
 * kez kullansaydık yol, birbirinin aynı kırk dört boncuğa dönerdi.
 */
type Basamak = {
  tur: 'kart' | 'soru'
  konu: Konu
  temaId: string
  temaAdi: string
  /** Patikadaki numara, 1'den başlıyor; tema sınırında sıfırlanmıyor. */
  no: number
  /** Konunun program içindeki sırası — kilit ve konu sayfası bunu kullanıyor. */
  konuSirasi: number
}

/**
 * Düğümlerin yatay kayması, piksel.
 *
 * Sekizlik bir çevrim: orta → sağ → uç → sağ → orta → sol → uç → sol. Şerit
 * sayısı yerine kayma listesi tutuluyor çünkü yol düz bir zikzak değil,
 * uçlarda yavaşlayan bir yılan; ara değerler o yumuşamayı veriyor.
 *
 * En büyük kayma 82 px: ekranın dar kenarı (`max-w-md`, yanlarda 1 rem
 * dolgu) 416 px ve 82 + yarım düğüm (36) = 118 px, yarı genişliğin altında.
 */
const KAYMA = [0, 56, 82, 56, 0, -56, -82, -56]

/**
 * Altıgenin köşeleri — sivri tepeli, kare kutuya oturuyor.
 *
 * `clip-path` kullanılıyor, ayrı bir SVG değil: düğümün zemini durum rengiyle
 * değişiyor ve tek bir `background` ile boyanan kutu, rengi ikinci kez
 * yazmadan kırpılabiliyor. %6.7 ve %93.3 düzgün altıgenin genişlik oranından
 * (√3/2) geliyor, yani şekil kutuda basık durmuyor.
 */
const ALTIGEN = 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)'

/** Zemin sınıfları tam yazılı: birleştirilen ad Tailwind taramasından düşer. */
const AILE_ZEMIN: Record<KonuAilesi, string> = {
  yzm: 'bg-yzm-kart',
  isl: 'bg-isl-kart',
  edb: 'bg-edb-kart',
  cog: 'bg-cog-kart',
  trh: 'bg-trh-kart',
  byl: 'bg-byl-kart',
  fzk: 'bg-fzk-kart',
}

const AILE_YAZI: Record<KonuAilesi, string> = {
  yzm: 'text-yzm-koyu',
  isl: 'text-isl-koyu',
  edb: 'text-edb-koyu',
  cog: 'text-cog-koyu',
  trh: 'text-trh-koyu',
  byl: 'text-byl-koyu',
  fzk: 'text-fzk-koyu',
}

/**
 * Düğümün dört hâli.
 *
 * Tasarımda her bölümün kendi rengi vardı; buraya taşınmadı. Uygulamada
 * **renk derse ait** (bkz. `AGENTS.md`) ve yedi temayı yedi ayrı renge
 * boyamak, aynı ekranda Matematik'i yeşil de mor da gösterirdi. Tema bandı
 * dersin ailesini kullanıyor, düğüm ise durumu.
 *
 * `yazilmadi` yalnızca soru basamağında görülüyor: konunun soru metni henüz
 * yazılmadı (`lib/konu/icerik/`). Kilitliden ayrı bir hâl çünkü kilitli
 * basamak açılabilir, bu açılamaz — beklenen şey öğrencide değil içerikte.
 */
const DUGUM_BICIMI = {
  bitti: {
    zemin: 'bg-success text-white',
    golge: 'color-mix(in srgb, var(--success) 72%, #000)',
  },
  aktif: {
    zemin: 'bg-primary-parlak text-white',
    golge: 'var(--primary)',
  },
  kilitli: {
    zemin: 'bg-muted text-muted-foreground',
    golge: 'var(--grid)',
  },
  yazilmadi: {
    zemin: 'bg-muted text-muted-foreground/45',
    golge: 'var(--grid)',
  },
} as const

type DugumDurumu = keyof typeof DUGUM_BICIMI

export function KonuHaritasiEkrani({
  secim,
  setSecim,
  ilerlemeler,
  setIlerlemeler,
}: {
  secim: { ders: KonuDersId; sinif: KonuSinifi }
  setSecim: (secim: { ders: KonuDersId; sinif: KonuSinifi }) => void
  ilerlemeler: KonuIlerlemeleri
  setIlerlemeler: (guncelle: (onceki: KonuIlerlemeleri) => KonuIlerlemeleri) => void
}) {
  /** Açık deste; null ise harita görünüyor. */
  const [acikKonu, setAcikKonu] = useState<{ konu: Konu; temaAdi: string } | null>(null)
  /*
    Açık soru sahnesi. Deste bitince kendiliğinden açılıyor: soru, kartların
    devamı ve arada haritaya dönmek okumayla soruyu birbirinden ayırıyordu.
  */
  const [acikSorular, setAcikSorular] = useState<{ konu: Konu; temaAdi: string } | null>(null)
  /** Düğüme basınca aşağıdan gelen konu sayfası. Haritanın üstüne biniyor. */
  const [sayfa, setSayfa] = useState<{ konu: Konu; temaAdi: string; sira: number } | null>(null)
  /** Kilidi açılmak istenen konu — "emin misin" onayı bunu bekliyor. */
  const [kilitOnayi, setKilitOnayi] = useState<Konu | null>(null)
  /*
    Program seçici **kapalı** başlıyor. Sınıf hapları ve yedi ders çipi
    sürekli açıkken ekranın ilk yarısını kaplıyor, patika katlamanın altında
    kalıyordu; oysa seçim bir kez yapılıp aylarca değişmiyor.
  */
  const [secimAcik, setSecimAcik] = useState(false)

  const ders = dersBul(secim.ders)
  const program = useMemo(() => programBul(secim.ders, secim.sinif), [secim])
  /** Program boyunca tek sıra: kilit tema sınırına değil, bir önceki konuya bakıyor. */
  const sirali = useMemo(() => (program ? tumKonular(program) : []), [program])

  /** Yolun bütün basamakları: her konu bir kart, bir de soru basamağı açıyor. */
  const basamaklar = useMemo(() => {
    const liste: Basamak[] = []
    if (program === null) return liste
    let konuSirasi = 0
    for (const tema of program.temalar) {
      for (const konu of tema.konular) {
        konuSirasi += 1
        const ortak = { konu, temaId: tema.id, temaAdi: tema.ad, konuSirasi }
        liste.push({ ...ortak, tur: 'kart', no: liste.length + 1 })
        liste.push({ ...ortak, tur: 'soru', no: liste.length + 1 })
      }
    }
    return liste
  }, [program])

  /**
   * Basamağın hâli.
   *
   * Kart basamağı konunun kilidine bakıyor, soru basamağı **aynı konunun**
   * kartlarına: kartları okunmamış bir konunun sorusu, okunmamış kartları
   * sormak olurdu.
   */
  function basamakDurumu(b: Basamak): DugumDurumu {
    if (b.tur === 'kart') {
      if (konuBitti(ilerlemeler, b.konu.id)) return 'bitti'
      return konuKilitli(ilerlemeler, sirali, b.konuSirasi - 1) ? 'kilitli' : 'aktif'
    }
    if (b.konu.sorular.length === 0) return 'yazilmadi'
    if (!konuBitti(ilerlemeler, b.konu.id)) return 'kilitli'
    const oran = soruOrani(ilerlemeler, b.konu)
    return oran !== null && oran >= GECME_ORANI ? 'bitti' : 'aktif'
  }

  /** Yoldaki ilk yapılabilir basamak — halka ve "Başla" balonu buna bakıyor. */
  const siradaki = basamaklar.find((b) => basamakDurumu(b) === 'aktif') ?? null

  function desteBitti(acik: { konu: Konu; temaAdi: string }, sonuc: DesteSonucu) {
    setAcikKonu(null)

    /*
      Yarıda çıkılan deste de kaydediliyor: kullanıcı üç kartı okuduysa
      sayfada "3/4 kart okudun" yazmalı. Yalnız `bitti` yazılmıyor, yani
      harita konuyu tamamlanmış göstermiyor — tamamlanma destenin sonuna
      gelmekle kazanılıyor.
    */
    setIlerlemeler((onceki) =>
      ilerlemeyiYaz(onceki, acik.konu.id, { okunan: sonuc.okunan, bitti: sonuc.bitti }, bugun()),
    )

    // Sorular yalnızca deste **sonuna kadar** okunduysa geliyor: yarıda
    // bırakılan bir konunun sorusu, okunmamış kartları sormak olurdu.
    if (sonuc.bitti && acik.konu.sorular.length > 0) setAcikSorular(acik)
  }

  function sorularBitti(konu: Konu, sonuc: SahneSonucu) {
    setAcikSorular(null)
    setIlerlemeler((onceki) =>
      ilerlemeyiYaz(
        onceki,
        konu.id,
        {
          okunan: konu.kartlar.length,
          bitti: true,
          /*
            Sayı yalnızca yoklama **sonuna kadar** verildiyse yazılıyor;
            yarıda çıkanda alan hiç konmuyor. Destenin kuralının aynısı:
            tamamlanma sona gelmekle kazanılıyor. Koşulsuz yazılsaydı,
            köprüde "Şimdi değil" diyen kullanıcının kaydına hiç verilmemiş
            bir yoklamanın "0 doğru"su geçerdi.
          */
          ...(sonuc.bitti ? { dogru: sonuc.dogru } : {}),
        },
        bugun(),
      ),
    )
  }

  if (acikSorular) {
    return (
      <SoruSahnesi
        konu={acikSorular.konu}
        temaAdi={acikSorular.temaAdi}
        dersAdi={ders.ad}
        onKapat={(sonuc) => sorularBitti(acikSorular.konu, sonuc)}
      />
    )
  }

  if (acikKonu) {
    return (
      <KartDestesi
        konu={acikKonu.konu}
        temaAdi={acikKonu.temaAdi}
        dersAdi={ders.ad}
        zeminSinifi={AILE_ZEMIN[ders.aile]}
        onKapat={(sonuc) => desteBitti(acikKonu, sonuc)}
      />
    )
  }

  const oran = program ? dersOrani(program, ilerlemeler) : null

  return (
    <div className="space-y-4">
      {/*
        Başlık patikanın bir parçası: solda hangi programda olunduğu, ortada
        sırayı gösteren tek cümle, sağda kaç konunun bittiği. Eskiden burada
        program özetini taşıyan büyük bir kapak ve "Sıradaki · Devam" düğmesi
        vardı; ikisi de patikanın söylediğini ikinci kez söylüyordu.
      */}
      <header className="flex items-center gap-3 px-0.5">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-[10px] font-extrabold tracking-[0.12em] uppercase',
              AILE_YAZI[ders.aile],
            )}
          >
            {secim.sinif}. sınıf {ders.ad}
          </p>
          <h1 className="mt-0.5 truncate font-display text-[19px] font-extrabold tracking-tight">
            {program === null
              ? 'Konu Anlatımı'
              : siradaki === null
                ? 'Tüm konular bitti'
                : `${siradaki.no}. basamak sırada`}
          </h1>
        </div>

        {/*
          Sayaç basamağı değil **konuyu** sayıyor. Yoldaki basamakların yarısı
          soru ve soru metni bugün hiçbir konuda yazılmadı; "8/44" diyen bir
          sayaç hiçbir zaman dolmazdı.
        */}
        {oran !== null && (
          <span className="rakam inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-warning-soft px-3 text-[13px] font-extrabold text-warning">
            <Star size={14} className="fill-current" aria-hidden />
            {oran.biten}/{oran.toplam}
          </span>
        )}
      </header>

      <Kart className="overflow-hidden p-0">
        <button
          type="button"
          onClick={() => setSecimAcik((o) => !o)}
          aria-expanded={secimAcik}
          className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition active:brightness-[0.98]"
        >
          <span
            className={cn(
              'grid size-10 shrink-0 place-items-center rounded-[14px] text-[20px]',
              AILE_ZEMIN[ders.aile],
            )}
            aria-hidden
          >
            {ders.ikon}
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                'block text-[10px] font-extrabold tracking-[0.09em] uppercase',
                AILE_YAZI[ders.aile],
              )}
            >
              Çalıştığın program
            </span>
            <span className="block truncate font-display text-[15px] font-extrabold tracking-tight">
              {secim.sinif}. sınıf · {ders.ad}
            </span>
          </span>
          <span className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full bg-muted pr-2.5 pl-3 text-[13px] font-extrabold text-muted-foreground">
            Değiştir
            <ChevronDown
              size={15}
              strokeWidth={3}
              aria-hidden
              className={cn('transition-transform', secimAcik && 'rotate-180')}
            />
          </span>
        </button>

        {secimAcik && (
          <div className="space-y-2.5 border-t border-border px-3.5 py-3">
            <div className="flex gap-2">
              {KONU_SINIFLARI.map((sinif) => (
                <button
                  key={sinif}
                  type="button"
                  onClick={() => setSecim({ ...secim, sinif })}
                  aria-pressed={secim.sinif === sinif}
                  className={cn(
                    'flex-1 rounded-xl py-2 text-[13.5px] font-extrabold transition',
                    secim.sinif === sinif
                      ? 'bg-primary-dolu text-white'
                      : 'bg-muted text-muted-foreground active:brightness-95',
                  )}
                >
                  {sinif}. sınıf
                </button>
              ))}
            </div>

            <div className="-mx-3.5 flex gap-2 overflow-x-auto px-3.5 pb-1">
              {KONU_DERSLERI.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSecim({ ...secim, ders: d.id })}
                  aria-pressed={secim.ders === d.id}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-extrabold transition active:brightness-95',
                    secim.ders === d.id
                      ? cn(AILE_ZEMIN[d.aile], AILE_YAZI[d.aile], 'ring-2 ring-current/25')
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  <span aria-hidden>{d.ikon}</span>
                  {d.ad}
                </button>
              ))}
            </div>
          </div>
        )}
      </Kart>

      {program === null ? (
        <Kart className="flex flex-col items-center px-6 py-10 text-center">
          <Rabi durum="calisiyor" poz="okuyan" boyut={92} />
          <p className="mt-3 font-display text-[17px] font-extrabold tracking-tight">
            {secim.sinif}. sınıf {ders.ad} hazırlanıyor
          </p>
          <p className="mt-1 text-[13.5px] font-semibold text-pretty text-muted-foreground">
            Bu dersin kartları henüz yazılmadı. Şimdilik başka bir sınıf ya da ders seçebilirsin.
          </p>
        </Kart>
      ) : (
        <div>
          {program.temalar.map((tema, ti) => (
            <TemaBolumu
              key={tema.id}
              tema={tema}
              sira={ti + 1}
              aile={ders.aile}
              ilerlemeler={ilerlemeler}
              basamaklar={basamaklar.filter((b) => b.temaId === tema.id)}
              durumu={basamakDurumu}
              siradakiNo={siradaki?.no ?? null}
              onAc={(b) => setSayfa({ konu: b.konu, temaAdi: b.temaAdi, sira: b.konuSirasi })}
            />
          ))}

          {/* Yolun sonundaki bayrak: patikanın bittiği yer görünmezse harita
              kaydırmanın nerede duracağını söylemiyor. */}
          <div className="flex flex-col items-center gap-2 pt-2 pb-1">
            <span
              className="grid size-16 place-items-center rounded-full bg-muted"
              style={{ boxShadow: '0 5px 0 var(--grid)' }}
              aria-hidden
            >
              <Flag size={26} strokeWidth={2.4} className="text-muted-foreground" />
            </span>
            <p className="text-center text-[12.5px] font-bold text-pretty text-muted-foreground">
              Yolun sonu. {sirali.length} konu bitince buraya bayrağı dikiyorsun.
            </p>
          </div>
        </div>
      )}

      {sayfa !== null && (
        <KonuSayfasi
          konu={sayfa.konu}
          temaAdi={sayfa.temaAdi}
          sira={sayfa.sira}
          kilitli={konuKilitli(ilerlemeler, sirali, sayfa.sira - 1)}
          oncekiAd={sayfa.sira > 1 ? sirali[sayfa.sira - 2].ad : ''}
          ilerlemeler={ilerlemeler}
          onKapat={() => setSayfa(null)}
          onKilidiAc={() => setKilitOnayi(sayfa.konu)}
          onKartlariOku={() => {
            setSayfa(null)
            setAcikKonu({ konu: sayfa.konu, temaAdi: sayfa.temaAdi })
          }}
          onSorulariCoz={() => {
            setSayfa(null)
            setAcikSorular({ konu: sayfa.konu, temaAdi: sayfa.temaAdi })
          }}
        />
      )}

      {/*
        Kilidi açmak tek dokunuşla olmuyor: "Yine de aç" düğmesi sayfanın
        içinde, parmağın zaten gezindiği yerde duruyor ve yanlışlıkla basmak
        sıradaki konuyu sessizce değiştirirdi.
      */}
      <Onay
        acik={kilitOnayi !== null}
        baslik="Kilidi açılsın mı?"
        aciklama={`“${kilitOnayi?.ad ?? ''}” sırası gelmeden açılıyor. Önceki konuyu atlamak, buradaki kartların dayandığı bilgiyi atlamak olabilir.`}
        onayMetni="Aç"
        onOnayla={() => {
          if (kilitOnayi) setIlerlemeler((onceki) => kilidiAc(onceki, kilitOnayi.id, bugun()))
        }}
        onIptal={() => setKilitOnayi(null)}
      />
    </div>
  )
}

/**
 * Tek tema: üstte yapışkan başlık bandı, altında basamakların yılan yolu.
 *
 * Bant yapışkan çünkü patikada konu adı yok; kaydırırken "burası hangi tema"
 * sorusunun cevabı ekranda kalmazsa düğümler numaralı boncuklara dönüyor.
 */
function TemaBolumu({
  tema,
  sira,
  aile,
  ilerlemeler,
  basamaklar,
  durumu,
  siradakiNo,
  onAc,
}: {
  tema: Tema
  sira: number
  aile: KonuAilesi
  ilerlemeler: KonuIlerlemeleri
  /** Bu temaya düşen basamaklar — her konudan iki tane. */
  basamaklar: Basamak[]
  durumu: (b: Basamak) => DugumDurumu
  siradakiNo: number | null
  onAc: (b: Basamak) => void
}) {
  const biten = temadaBiten(tema, ilerlemeler)

  return (
    <section>
      {/* Degrade bandın altında bitmiyor: düz kesilen yapışkan başlık,
          altından geçen düğümü ortasından kırpıyordu. */}
      <div className="sticky top-[var(--guvenli-ust)] z-20 -mx-4 bg-gradient-to-b from-background from-62% to-transparent px-4 pt-2 pb-2.5">
        <div className={cn('flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5', AILE_ZEMIN[aile])}>
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                'text-[10px] font-extrabold tracking-[0.14em] uppercase',
                AILE_YAZI[aile],
              )}
            >
              {sira}. bölüm
            </p>
            <h2 className="mt-0.5 truncate font-display text-[15px] font-extrabold tracking-tight">
              {tema.ad}
            </h2>
          </div>
          <span className={cn('rakam shrink-0 text-[13px] font-extrabold', AILE_YAZI[aile])}>
            {biten}/{tema.konular.length}
          </span>
        </div>
      </div>

      {/*
        Üstteki boşluk süs değil: sıradaki düğümün "Başla" balonu düğümün 26 px
        üstünde duruyor ve bir bölümün ilk düğümünde yapışkan tema bandının
        altında kalıyordu. Balonu bandın üstüne çıkarmak daha kötüsü olurdu —
        kaydırırken başlığın üstünde yüzerdi.
      */}
      <ol className="flex flex-col items-center gap-3.5 pt-8 pb-4">
        {basamaklar.map((b) => (
          <Dugum
            key={`${b.konu.id}-${b.tur}`}
            basamak={b}
            kayma={KAYMA[(b.no - 1) % KAYMA.length]}
            durum={durumu(b)}
            simdi={b.no === siradakiNo}
            onAc={() => onAc(b)}
          />
        ))}
      </ol>
    </section>
  )
}

/**
 * Patikadaki tek düğüm.
 *
 * Kart basamağı yuvarlak, soru basamağı altıgen. Yuvarlak, uygulamanın geri
 * kalanındaki yuvarlatılmış kareler değil: harita bir yol ve yolun üstündeki
 * basamak elle basılacak bir taş gibi görünmeli. Altındaki düz gölge de bunun
 * için — dokunulunca gölgenin içine çöküyor.
 */
function Dugum({
  basamak,
  kayma,
  durum,
  simdi,
  onAc,
}: {
  basamak: Basamak
  kayma: number
  durum: DugumDurumu
  /** Sıradaki basamak: halka döner, üstünde "Başla" balonu durur. */
  simdi: boolean
  onAc: () => void
}) {
  const bicim = DUGUM_BICIMI[durum]
  const altigen = basamak.tur === 'soru'

  const nedeni =
    durum === 'yazilmadi'
      ? 'soruları henüz yazılmadı'
      : durum === 'kilitli'
        ? 'kilitli'
        : basamak.konu.ad

  return (
    /*
      Kayma satırın kendisine değil **düğümün kutusuna** uygulanıyor. Tam
      genişlikteki bir satırı 82 px ötelemek satırın sağ kenarını kabın dışına
      taşırıyor ve sayfa yatayda kayıyordu; 72 piksellik kutu ortadan
      ötelendiğinde merkeze uzaklığı 118 px kalıyor, `max-w-md`in yarısının
      altında.
    */
    <li className="relative flex w-full justify-center">
      <span
        className="relative flex flex-col items-center"
        style={{ transform: `translateX(${kayma}px)` }}
      >
        <button
          type="button"
          onClick={onAc}
          aria-label={`${basamak.no}. basamak — ${altigen ? 'sorular' : 'bilgi kartları'} — ${nedeni}`}
          className="relative grid size-[72px] place-items-center"
        >
          {simdi && (
            <span
              aria-hidden
              className={cn('patika-halka absolute size-[68px]', altigen ? '' : 'rounded-full')}
              style={
                altigen
                  ? { clipPath: ALTIGEN, background: 'var(--primary-parlak)' }
                  : { border: '3px solid var(--primary-parlak)' }
              }
            />
          )}

          {/*
            Altıgende gölge `box-shadow` olamaz: `clip-path` gölgeyi de
            kırpıyor ve düğüm düz duruyordu. `drop-shadow` şeklin kendisini
            izliyor, o yüzden kırpılan kutunun **dışındaki** kapsayıcıya
            konuyor.
          */}
          <span
            className="relative grid size-16 place-items-center"
            style={
              altigen
                ? { filter: `drop-shadow(0 4px 0 ${bicim.golge})` }
                : { boxShadow: `0 5px 0 ${bicim.golge}`, borderRadius: '9999px' }
            }
          >
            <span
              className={cn(
                'rakam grid size-16 place-items-center font-display text-[23px] font-extrabold transition-transform active:translate-y-[3px]',
                altigen ? '' : 'rounded-full',
                bicim.zemin,
              )}
              style={altigen ? { clipPath: ALTIGEN } : undefined}
            >
              {basamak.no}
            </span>
          </span>

          {durum === 'bitti' && (
            <span
              aria-hidden
              className="golge-kart absolute right-0 bottom-0.5 grid size-[22px] place-items-center rounded-full bg-card"
            >
              <Check size={13} strokeWidth={3.6} className="text-success" />
            </span>
          )}
        </button>

        {simdi && (
          <span className="patika-balon golge-kart absolute -top-[26px] left-1/2 z-10 -translate-x-1/2 rounded-xl bg-card px-3 py-1.5 text-[11.5px] font-extrabold tracking-[0.08em] whitespace-nowrap text-primary uppercase">
            Başla
          </span>
        )}
      </span>
    </li>
  )
}

/**
 * Konu sayfası — düğüme basınca aşağıdan gelen yüzey.
 *
 * Haritada olmayan her şey burada: adı, hangi temaya ait olduğu, iki basamak
 * (kartlar, sorular) ve her birinin nerede kaldığı. Kart ve soru düğümlerinin
 * ikisi de aynı sayfayı açıyor: ikisi de aynı konunun basamağı ve hangisine
 * basıldığına göre başka bir ekran göstermek için sebep yok.
 */
function KonuSayfasi({
  konu,
  temaAdi,
  sira,
  kilitli,
  oncekiAd,
  ilerlemeler,
  onKapat,
  onKilidiAc,
  onKartlariOku,
  onSorulariCoz,
}: {
  konu: Konu
  temaAdi: string
  sira: number
  kilitli: boolean
  /** Kilidi tutan konunun adı — uyarı hangi kapının kapalı olduğunu söylüyor. */
  oncekiAd: string
  ilerlemeler: KonuIlerlemeleri
  onKapat: () => void
  onKilidiAc: () => void
  onKartlariOku: () => void
  onSorulariCoz: () => void
}) {
  useGeriKatmani(true, onKapat)

  const ilerleme = ilerlemeler[konu.id]
  const kartBitti = konuBitti(ilerlemeler, konu.id)
  const okunan = ilerleme?.okunan ?? 0
  const toplamKart = konu.kartlar.length
  const soruVar = konu.sorular.length > 0
  const oran = soruOrani(ilerlemeler, konu)
  const gecti = oran !== null && oran >= GECME_ORANI

  /*
    İkinci basamağın hâli tek bir üçlü karar: kartlar okunmadan kapalı, sorusu
    yazılmamış konuda yine kapalı ama sebebi başka, geçildiyse yeşil.
  */
  const soruKapali = !kartBitti || !soruVar
  const soruAlt = !soruVar
    ? 'Bu konunun soruları henüz yazılmadı'
    : !kartBitti
      ? `Kartlar bitince açılır · ${konu.sorular.length} soru`
      : oran === null
        ? `${konu.sorular.length} soru · geçmek için %${GECME_ORANI}`
        : gecti
          ? `%${oran} doğru · geçtin`
          : `%${oran} doğru · %${GECME_ORANI} gerekiyor`

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/45">
      {/* Zemine basmak kapatıyor: yarıya kadar gelen bir yüzeyin altındaki
          haritaya dokunmak, o haritayı kullanmaya çalışmak demek. */}
      <button
        type="button"
        aria-label="Kapat"
        onClick={onKapat}
        className="absolute inset-0 cursor-default"
      />

      <div className="konu-sayfasi relative w-full max-w-md rounded-t-[28px] bg-card px-4 pt-4 pb-[calc(1.25rem+var(--guvenli-alt))]">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-extrabold tracking-[0.1em] text-warning uppercase">
              {sira}. konu · {temaAdi}
            </p>
            <h3 className="mt-0.5 font-display text-[19px] leading-tight font-extrabold tracking-tight text-balance">
              {konu.ad}
            </h3>
          </div>
          <button
            type="button"
            onClick={onKapat}
            aria-label="Kapat"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
          >
            <X size={16} strokeWidth={2.6} aria-hidden />
          </button>
        </div>

        {kilitli && (
          <div className="mt-3.5 rounded-2xl bg-warning-soft p-3.5">
            <p className="text-[13.5px] leading-snug font-bold text-pretty text-warning">
              “{oncekiAd}” bitmeden bu konu açılmıyor. Yine de bakmak istersen aç, ama sıralı gitmek
              daha kolay.
            </p>
            <button
              type="button"
              onClick={onKilidiAc}
              className="mt-2.5 h-11 w-full rounded-xl bg-warning text-[14px] font-extrabold text-white transition active:brightness-95"
            >
              Yine de aç
            </button>
          </div>
        )}

        {/* Kilitliyken basamaklar soluk ama görünür: neyin arkada beklediğini
            gizlemek, kilidi açma kararını körlemesine verdirmek olurdu. */}
        <div className={cn('mt-3.5 space-y-2.5', kilitli && 'pointer-events-none opacity-40')}>
          <Adim
            no={sira * 2 - 1}
            noZemin={kartBitti ? 'bg-success' : 'bg-primary-parlak'}
            baslik="Bilgi kartları"
            alt={
              kartBitti
                ? `${toplamKart} kart okundu`
                : okunan > 0
                  ? `${okunan}/${toplamKart} kart okudun`
                  : `${toplamKart} kart · ${okumaDakikasi(toplamKart)} dk`
            }
            eylem={kartBitti ? 'Tekrar oku' : 'Oku'}
            vurgulu={!kartBitti}
            onTikla={onKartlariOku}
          />

          <Adim
            no={sira * 2}
            altigen
            noZemin={
              soruKapali ? 'bg-muted text-muted-foreground' : gecti ? 'bg-success' : 'bg-ikincil'
            }
            baslik="Sorular"
            alt={soruAlt}
            eylem={
              soruKapali ? 'Kilitli' : oran === null ? 'Başla' : gecti ? 'Tekrar çöz' : 'Tekrar dene'
            }
            vurgulu={!soruKapali && !gecti}
            kapali={soruKapali}
            onTikla={onSorulariCoz}
          />
        </div>

        {soruVar && (
          <p className="mt-3 px-0.5 text-[12px] font-bold text-pretty text-muted-foreground">
            Sorular çevrilen kart: cevabı gör, sonra kendini işaretle.
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Konu sayfasındaki numaralı basamak satırı.
 *
 * Numara haritadaki basamak numarasının **aynısı** ve rozetin şekli de öyle:
 * yuvarlak kartlar, altıgen sorular. Sayfada 1–2 diye yeniden başlayan bir
 * numaralandırma, öğrencinin az önce bastığı düğümü sayfada bulamaması
 * demekti.
 */
function Adim({
  no,
  altigen = false,
  noZemin,
  baslik,
  alt,
  eylem,
  vurgulu,
  kapali = false,
  onTikla,
}: {
  no: number
  altigen?: boolean
  noZemin: string
  baslik: string
  alt: string
  eylem: string
  /** Sıradaki iş bu mu — dolu düğme yalnızca bir basamakta duruyor. */
  vurgulu: boolean
  kapali?: boolean
  onTikla: () => void
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-[20px] bg-background px-3.5 py-3',
        kapali && 'opacity-70',
      )}
    >
      <span
        className={cn(
          'rakam grid size-8 shrink-0 place-items-center text-[13px] font-extrabold text-white',
          altigen ? '' : 'rounded-full',
          noZemin,
        )}
        style={altigen ? { clipPath: ALTIGEN } : undefined}
        aria-hidden
      >
        {no}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[14.5px] font-extrabold tracking-tight">
          {baslik}
        </span>
        <span className="rakam block text-[12px] font-bold text-muted-foreground">{alt}</span>
      </span>
      <button
        type="button"
        onClick={onTikla}
        disabled={kapali}
        className={cn(
          'h-9 shrink-0 rounded-full px-4 text-[13.5px] font-extrabold transition active:brightness-95',
          'disabled:pointer-events-none',
          kapali
            ? 'bg-muted text-muted-foreground'
            : vurgulu
              ? 'bg-primary-dolu text-white'
              : 'bg-muted text-muted-foreground',
        )}
      >
        {eylem}
      </button>
    </div>
  )
}
