'use client'

import { useMemo, useState, type ComponentType } from 'react'
import {
  Atom,
  Beaker,
  BookOpen,
  Bug,
  Castle,
  Check,
  ChevronDown,
  CloudRain,
  Compass,
  Crown,
  Dna,
  Feather,
  Fish,
  Flag,
  Flame,
  FlaskConical,
  Flower2,
  Gauge,
  Globe,
  Hourglass,
  Landmark,
  Languages,
  Leaf,
  Lock,
  Magnet,
  Map,
  Microscope,
  Mountain,
  Orbit,
  PenLine,
  Quote,
  Rocket,
  Scroll,
  Snowflake,
  Sprout,
  Star,
  Sun,
  Swords,
  TestTube,
  TreePine,
  Wind,
  X,
  Zap,
} from 'lucide-react'
import {
  KONU_DERSLERI,
  KONU_SINIFLARI,
  dersBul,
  okumaDakikasi,
  programBul,
  tumKonular,
  type Konu,
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
import { haritaTemasi, type CizimAdi, type HaritaTemasi } from '@/lib/konu/harita-temasi'
import { bugun, cn } from '@/lib/utils'
import { useGeriKatmani } from '@/lib/geri'
import { Kart, Onay } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { KartDestesi, type DesteSonucu } from '@/components/konu/kart-destesi'
import { SoruSahnesi, type SahneSonucu } from '@/components/konu/soru-sahnesi'

/**
 * Konu Anlatımı haritası — kitaplı yol.
 *
 * Konular ekranın ortasında sağa sola sallanan bir yola diziliyor ve her
 * basamak bir **kitap**: yeşil kapaklı tek kitap anlatıma, turuncu kapaklı
 * kitap çifti sorulara açılıyor. Düğümün üstünde konunun adı **yazmıyor**.
 * Patika bir kez denenip listeye dönülmüştü çünkü ad düğümün altında iki üç
 * kelimeye sığmak zorundaydı ve "kaç kart, ne kadar sürer" hiçbir yere
 * yazılamıyordu. Bu sefer o yazıların hiçbiri haritada değil: kitaba basınca
 * aşağıdan **konu sayfası** geliyor ve ad, süre, kart sayısı, soru durumu
 * orada duruyor. Harita yalnızca sırayı ve nerede kalındığını gösteriyor —
 * tek bakışta okunması gereken şey o.
 *
 * Harita bir oyun dünyası gibi çiziliyor: kitapların altından geçen bir yol,
 * geçilen kısmı bir tık koyu; zemine dersin simgeleri serpili (Matematik'te
 * karekök ve π, Tarih'te tüy ve parşömen). Yolun ve kitapların rengi derse
 * göre değişmiyor, yalnızca band ve simgeler değişiyor — bkz.
 * `lib/konu/harita-temasi.ts`.
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
 * Bir konu yolda **iki** basamak açıyor: kartları (yeşil kitap) ve soruları
 * (turuncu kitap çifti). Numara ikisi boyunca kesintisiz akıyor — 1. kartlar,
 * 2. sorular, 3. kartlar, 4. sorular… Sorular bir konunun içine gömülü alt
 * adım değil, yolun üstünde durup geçilmesi gereken kendi basamağı; "kaç
 * durak kaldı" sorusunun cevabı haritada sayılabilmeli.
 *
 * Kitap ayrı çünkü iş ayrı: tek kitap okumak, açık duran çift sınanmak. Aynı
 * şekli iki kez kullansaydık yol, birbirinin aynı kırk dört boncuğa dönerdi.
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
 * dolgu) 416 px ve 82 + yarım kitap (30) = 112 px, yarı genişliğin altında.
 */
const KAYMA = [0, 56, 82, 56, 0, -56, -82, -56]

function kayma(no: number): number {
  // `no` 1'den başlıyor; sıfır ve eksi (sanal öncül) için de çevrim tutuyor.
  const i = (((no - 1) % KAYMA.length) + KAYMA.length) % KAYMA.length
  return KAYMA[i]
}

/**
 * İki basamak arasındaki düşey adım, piksel.
 *
 * Kitaplar 68–76 px boyunda; aradaki boşluk yolun kıvrımını gösteriyor.
 * Daha sık dizilince yol kitapların arasında görünmez oluyor ve harita bir
 * yola değil bir kitap yığınına dönüyordu.
 */
const ADIM = 112

/** Kitap kutusunun ölçüsü — yol bu kutunun ortasından geçiyor. */
const KITAP_EN = 60
const KITAP_BOY = 76

/**
 * Yol bölümün başlık bandının **altından** geçiyor.
 *
 * Bölüm kutusu bandın altına bu kadar sokuluyor (eksi kenar boşluğu) ve
 * kitaplar aynı kadar aşağıdan başlıyor; yol ise o boşluğu da kullanıyor.
 * Sokulmasaydı yol bandın iki yanında düz bir çizgiyle kesilir, bir
 * bölümden ötekine geçerken kopardı — bandın zemini alta doğru saydamlaşıyor
 * ve altından geçen yol görünüyor.
 */
const BANT_PAYI = 80

/** Bölümün ilk kitabından önceki (bant payı hariç) ve son kitabından sonraki pay. */
const UST_PAY = 22
const ALT_PAY = 26

/**
 * Yolun SVG'si sabit genişlikte ve ortalanmış: kayma piksel cinsinden
 * olduğu için yolun koordinatları da piksel ve viewBox'un yatay ekseni
 * ekranın ortasından başlıyor. 400 px, en dar telefondan (360) geniş; taşan
 * kısmı bölümün kutusu kırpıyor (`overflow: clip`).
 */
const YOL_GENISLIGI = 400

/**
 * Zemin simgelerinin ikon tablosu.
 *
 * Adlar `lib/konu/harita-temasi.ts`teki `CizimAdi` ile birebir; tablo o
 * türle tiplendiği için eksik bir ad derlemede yakalanıyor. Simgeler
 * lucide'den, emoji değil: emoji telefondan telefona başka çiziliyor ve
 * %8 opaklıkta renkli bir emoji soluk bir leke oluyor. Çizgi ikon tek
 * renk, mürekkep gibi soluyor.
 */
const CIZIMLER: Record<CizimAdi, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  tuy: Feather,
  parsomen: Scroll,
  'kum-saati': Hourglass,
  sutun: Landmark,
  tac: Crown,
  kale: Castle,
  kilic: Swords,
  dunya: Globe,
  pusula: Compass,
  dag: Mountain,
  harita: Map,
  bulut: CloudRain,
  gunes: Sun,
  ruzgar: Wind,
  cam: TreePine,
  kar: Snowflake,
  dna: Dna,
  yaprak: Leaf,
  mikroskop: Microscope,
  bocek: Bug,
  filiz: Sprout,
  balik: Fish,
  cicek: Flower2,
  erlen: FlaskConical,
  tup: TestTube,
  beher: Beaker,
  atom: Atom,
  alev: Flame,
  miknatis: Magnet,
  simsek: Zap,
  yorunge: Orbit,
  roket: Rocket,
  olcek: Gauge,
  tirnak: Quote,
  kalem: PenLine,
  kitap: BookOpen,
  diller: Languages,
}

/**
 * Simgelerin boyu ve satır içindeki düşey kayması, düğüm sırasına göre
 * dönen iki çevrim. İkisi de kayma çevriminden (8) başka uzunlukta ki aynı
 * yerdeki simge her turda aynı boyda çıkmasın.
 */
const SIMGE_BOYU = [42, 26, 36, 46, 24, 40, 28]
const SIMGE_KAYMASI = [8, 58, 30, 72, 16, 48]

/**
 * Düğümün dört hâli.
 *
 * Renk **işe** ait: bitmiş ve sıradaki kitap işinin renginde (yeşil ya da
 * turuncu), kilitli kitap gri. Sıradaki olanı ayıran şey renk değil boyu,
 * altındaki ışık ve çevresindeki halka; bitmiş olanı köşedeki tik.
 *
 * `yazilmadi` yalnızca soru basamağında görülüyor: konunun soru metni henüz
 * yazılmadı (`lib/konu/icerik/`). Kilitliden ayrı bir hâl çünkü kilitli
 * basamak açılabilir, bu açılamaz — beklenen şey öğrencide değil içerikte;
 * o yüzden kilit rozeti de yok, kitap yalnızca soluk.
 */
type DugumDurumu = 'bitti' | 'aktif' | 'kilitli' | 'yazilmadi'

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
  const [acikKonu, setAcikKonu] = useState<{
    konu: Konu
    temaAdi: string
  } | null>(null)
  /*
    Açık soru sahnesi. Deste bitince kendiliğinden açılıyor: soru, kartların
    devamı ve arada haritaya dönmek okumayla soruyu birbirinden ayırıyordu.
  */
  const [acikSorular, setAcikSorular] = useState<{
    konu: Konu
    temaAdi: string
  } | null>(null)
  /** Düğüme basınca aşağıdan gelen konu sayfası. Haritanın üstüne biniyor. */
  const [sayfa, setSayfa] = useState<{
    konu: Konu
    temaAdi: string
    sira: number
  } | null>(null)
  /** Kilidi açılmak istenen konu — "emin misin" onayı bunu bekliyor. */
  const [kilitOnayi, setKilitOnayi] = useState<Konu | null>(null)
  /*
    Program seçici **kapalı** başlıyor. Sınıf hapları ve yedi ders çipi
    sürekli açıkken ekranın ilk yarısını kaplıyor, patika katlamanın altında
    kalıyordu; oysa seçim bir kez yapılıp aylarca değişmiyor.
  */
  const [secimAcik, setSecimAcik] = useState(false)

  const ders = dersBul(secim.ders)
  const bicim = haritaTemasi(secim.ders)
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

  /** Yoldaki ilk yapılabilir basamak — halka ve geçilen yol buna bakıyor. */
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
        zeminRengi={bicim.zemin}
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
            className="text-[10px] font-extrabold tracking-[0.12em] uppercase"
            style={{ color: bicim.murekkep }}
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
            className="grid size-10 shrink-0 place-items-center rounded-[14px] text-[20px]"
            style={{ background: bicim.zemin }}
            aria-hidden
          >
            {ders.ikon}
          </span>
          <span className="min-w-0 flex-1">
            <span
              className="block text-[10px] font-extrabold tracking-[0.09em] uppercase"
              style={{ color: bicim.murekkep }}
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

            {/* Çipin rengi haritanın rengi: seçilen dersin bandı hangi
                tondaysa çip de o tonda; ders değişince ekranın ne renge
                döneceği çipten okunuyor. */}
            <div className="-mx-3.5 flex gap-2 overflow-x-auto px-3.5 pb-1">
              {KONU_DERSLERI.map((d) => {
                const secili = secim.ders === d.id
                const db = haritaTemasi(d.id)
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSecim({ ...secim, ders: d.id })}
                    aria-pressed={secili}
                    className={cn(
                      'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-extrabold transition active:brightness-95',
                      !secili && 'bg-muted text-muted-foreground',
                    )}
                    style={
                      secili
                        ? {
                            background: db.zemin,
                            color: db.murekkep,
                            boxShadow: `0 0 0 2px ${db.kenar}`,
                          }
                        : undefined
                    }
                  >
                    <span aria-hidden>{d.ikon}</span>
                    {d.ad}
                  </button>
                )
              })}
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
              ilk={ti === 0}
              bicim={bicim}
              ilerlemeler={ilerlemeler}
              basamaklar={basamaklar.filter((b) => b.temaId === tema.id)}
              durumu={basamakDurumu}
              siradakiNo={siradaki?.no ?? null}
              onAc={(b) =>
                setSayfa({
                  konu: b.konu,
                  temaAdi: b.temaAdi,
                  sira: b.konuSirasi,
                })
              }
            />
          ))}

          {/* Yolun sonundaki bayrak: patikanın bittiği yer görünmezse harita
              kaydırmanın nerede duracağını söylemiyor. */}
          <div className="flex flex-col items-center gap-2 pt-3 pb-1">
            <span className="relative grid size-[72px] place-items-center" aria-hidden>
              <span className="absolute -inset-2 rounded-full border-2 border-dashed border-grid" />
              <span
                className="grid size-full place-items-center rounded-full border-2 border-border bg-card"
                style={{ boxShadow: '0 5px 0 var(--grid)' }}
              >
                <Flag size={26} strokeWidth={2.4} className="text-muted-foreground" />
              </span>
            </span>
            <p className="mt-1 text-[10px] font-black tracking-[0.16em] text-muted-foreground uppercase">
              Bitiş
            </p>
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
 * Tek tema: üstte yapışkan başlık bandı, altında basamakların kitaplı yolu.
 *
 * Bant yapışkan çünkü patikada konu adı yok; kaydırırken "burası hangi tema"
 * sorusunun cevabı ekranda kalmazsa düğümler numaralı boncuklara dönüyor.
 * Bandın rengi dersin rengi (`HaritaTemasi`): yedi derste yedi ton.
 */
function TemaBolumu({
  tema,
  sira,
  ilk,
  bicim,
  ilerlemeler,
  basamaklar,
  durumu,
  siradakiNo,
  onAc,
}: {
  tema: Tema
  sira: number
  /** Programın ilk bölümü — pusula yalnızca burada, yolun başında duruyor. */
  ilk: boolean
  bicim: HaritaTemasi
  ilerlemeler: KonuIlerlemeleri
  /** Bu temaya düşen basamaklar — her konudan iki tane. */
  basamaklar: Basamak[]
  durumu: (b: Basamak) => DugumDurumu
  siradakiNo: number | null
  onAc: (b: Basamak) => void
}) {
  const biten = temadaBiten(tema, ilerlemeler)
  const yuzde = tema.konular.length === 0 ? 0 : Math.round((biten / tema.konular.length) * 100)

  const ust = BANT_PAYI + UST_PAY
  const boy = ust + (basamaklar.length - 1) * ADIM + KITAP_BOY + ALT_PAY

  /*
    Yolun geçtiği noktalar: kitapların ortası. Başa ve sona birer sanal
    nokta ekleniyor (bir önceki ve bir sonraki basamağın olacağı yer) ki yol
    bölümün ilk kitabında başlayıp son kitabında bitmesin, bandın altından
    gelip bir sonraki bölüme doğru çıksın. Taşan kısmı kutu kırpıyor.
  */
  const noktalar = basamaklar.map((b, i) => ({
    x: kayma(b.no),
    y: ust + i * ADIM + KITAP_BOY / 2,
  }))
  const ilkNo = basamaklar[0].no
  const sonNo = basamaklar[basamaklar.length - 1].no
  // Sanal uçlar bir adım artı bant payı kadar ötede: iki bölüm arasındaki
  // mesafe bir adımdan uzun ve kısa tutulan uç, bandın altında dik bir
  // dirsek yapıyordu.
  const tumu = [
    { x: kayma(ilkNo - 1), y: noktalar[0].y - ADIM - BANT_PAYI },
    ...noktalar,
    {
      x: kayma(sonNo + 1),
      y: noktalar[noktalar.length - 1].y + ADIM + BANT_PAYI,
    },
  ]

  /*
    Geçilen yol: baştan sıradaki kitaba kadar. Sıradaki bu bölümdeyse ona
    kadar; daha sonraki bir bölümdeyse (ya da hiç kalmadıysa) yol sona kadar
    koyu; daha önceki bir bölümdeyse hiç yok. Sıradaki kitabın *kendisine*
    kadar boyanıyor, ötesine değil — kullanıcı oraya yürüdü, orada duruyor.
  */
  const siradakiIndeks = basamaklar.findIndex((b) => b.no === siradakiNo)
  const gecilen =
    siradakiIndeks >= 0
      ? siradakiIndeks + 1
      : siradakiNo === null || siradakiNo > sonNo
        ? tumu.length - 1
        : 0

  return (
    <section>
      {/* Degrade bandın altında bitmiyor: düz kesilen yapışkan başlık,
          altından geçen düğümü ortasından kırpıyordu. */}
      <div className="sticky top-[var(--guvenli-ust)] z-20 -mx-4 bg-gradient-to-b from-background from-62% to-transparent px-4 pt-2 pb-2.5">
        <div
          className="flex items-center gap-2.5 rounded-[18px] border px-3.5 py-2.5"
          style={{ background: bicim.zemin, borderColor: bicim.kenar }}
        >
          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] font-extrabold tracking-[0.14em] uppercase"
              style={{ color: bicim.murekkep }}
            >
              {sira}. bölüm
            </p>
            <h2 className="mt-0.5 truncate font-display text-[15px] font-extrabold tracking-tight">
              {tema.ad}
            </h2>
          </div>
          {/* Çubuk sayının yanında: "2/4" okunuyor ama yarısı mı çeyreği mi
              olduğu sayılmadan görünmüyor. */}
          <span
            className="relative h-1.5 w-[74px] shrink-0 overflow-hidden rounded-full"
            style={{ background: bicim.cubuk }}
            aria-hidden
          >
            <span
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${yuzde}%`, background: bicim.murekkep }}
            />
          </span>
          <span
            className="rakam shrink-0 text-[13px] font-extrabold"
            style={{ color: bicim.murekkep }}
          >
            {biten}/{tema.konular.length}
          </span>
        </div>
      </div>

      {/*
        `overflow: clip`, `hidden` değil: yol SVG'si kutudan geniş ve taşan
        kısmı kırpılmalı, ama `hidden` kutuyu kaydırma kabı yapıyor ve
        üstteki yapışkan bandın hesabını bozuyordu.
      */}
      <div
        className="relative"
        style={{ height: boy, marginTop: -BANT_PAYI, overflow: 'clip' }}
        role="list"
        aria-label={`${sira}. bölüm basamakları`}
      >
        <Simgeler basamaklar={basamaklar} simgeler={bicim.simgeler} ust={ust} />

        <Yol noktalar={tumu} gecilen={gecilen} boy={boy} />

        {ilk && <Pusula />}

        {basamaklar.map((b, i) => (
          <Dugum
            key={`${b.konu.id}-${b.tur}`}
            basamak={b}
            x={kayma(b.no)}
            y={ust + i * ADIM}
            durum={durumu(b)}
            simdi={b.no === siradakiNo}
            onAc={() => onAc(b)}
          />
        ))}
      </div>
    </section>
  )
}

/**
 * Zemine serpilen ders simgeleri.
 *
 * Her basamak satırına bir simge, kitabın **karşı** yanına: kitap sağdaysa
 * simge solda. Kitapla aynı yanda dursaydı kitabın altından çıkıp ona
 * yapışırdı.
 *
 * Simgeler süs, bilgi değil; o yüzden okuyucudan gizli ve dokunuşu
 * geçiriyor.
 */
function Simgeler({
  basamaklar,
  simgeler,
  ust,
}: {
  basamaklar: Basamak[]
  simgeler: HaritaTemasi['simgeler']
  /** İlk kitabın üst kenarı — simgeler kitap satırlarına göre diziliyor. */
  ust: number
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 font-serif italic"
      style={{ color: 'var(--patika-simge)' }}
      aria-hidden
    >
      {basamaklar.map((b, i) => {
        const simge = simgeler[(b.no - 1) % simgeler.length]
        const k = kayma(b.no)
        // Ortadaki kitap çevrimde iki kez geliyor (1. ve 5.); ilkinde simge
        // solda, ikincisinde sağda — yoksa çevrimin beşi sola, üçü sağa düşüyordu.
        const solda = k > 0 || (k === 0 && (b.no - 1) % KAYMA.length === 0)
        const boy = SIMGE_BOYU[(b.no - 1) % SIMGE_BOYU.length]
        const tepe = ust + i * ADIM + SIMGE_KAYMASI[(b.no - 1) % SIMGE_KAYMASI.length]
        // Kitap kenara ne kadar yakınsa simge kenara o kadar sokuluyor;
        // yoksa uçtaki kitabın karşısındaki simge yolun altında kalıyordu.
        const kenar = Math.abs(k) >= 82 ? 14 : Math.abs(k) >= 56 ? 22 : 34
        return (
          <span
            key={b.no}
            className="absolute leading-none"
            style={{
              top: tepe,
              [solda ? 'left' : 'right']: kenar,
              fontSize: simge.tur === 'yazi' ? boy : undefined,
            }}
          >
            {simge.tur === 'yazi' ? simge.metin : <Cizim ad={simge.ad} boy={boy} />}
          </span>
        )
      })}
    </div>
  )
}

function Cizim({ ad, boy }: { ad: CizimAdi; boy: number }) {
  const Ikon = CIZIMLER[ad]
  /*
    Çizgi ikon aynı opaklıkta yazıdan hafif duruyor: yazı dolu, ikon çizgi.
    Kalınlık bu yüzden 2.4 ve ikon aynı boydaki yazıdan biraz büyük;
    opaklığın kendisi (`--patika-simge`) yedi derste de aynı.
  */
  return <Ikon size={Math.round(boy * 1.1)} strokeWidth={2.4} />
}

/**
 * Kitapların altından geçen yol.
 *
 * Dört katman: dış gölge, kenar, iç dolgu ve ortadaki kesik çizgi; üstüne
 * aynı katmanların geçilen kısmı, bir tık koyu. Kıvrım kübik Bezier ve
 * teğetler düşey: yol her kitaba yukarıdan girip aşağıdan çıkıyor, kitabın
 * yanından sıyırıp geçmiyor.
 */
function Yol({
  noktalar,
  gecilen,
  boy,
}: {
  noktalar: { x: number; y: number }[]
  /** Kaç parçası geçildi — 0 ise koyu katman hiç çizilmiyor. */
  gecilen: number
  boy: number
}) {
  function yol(parca: number): string {
    if (parca < 1) return ''
    const [ilk, ...gerisi] = noktalar.slice(0, parca + 1)
    let onceki = ilk
    let d = `M${ilk.x} ${ilk.y}`
    for (const n of gerisi) {
      const yarim = (n.y - onceki.y) / 2
      d += ` C${onceki.x} ${onceki.y + yarim} ${n.x} ${n.y - yarim} ${n.x} ${n.y}`
      onceki = n
    }
    return d
  }

  const tam = yol(noktalar.length - 1)
  const koyu = yol(gecilen)

  const katmanlar = (d: string, kenar: string, ic: string, cizgi: string) => (
    <>
      <path d={d} fill="none" stroke={kenar} strokeWidth={44} strokeLinecap="round" />
      <path d={d} fill="none" stroke={ic} strokeWidth={36} strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke={cizgi}
        strokeWidth={30}
        strokeDasharray="3 17"
        strokeLinecap="round"
      />
    </>
  )

  return (
    <svg
      viewBox={`${-YOL_GENISLIGI / 2} 0 ${YOL_GENISLIGI} ${boy}`}
      width={YOL_GENISLIGI}
      height={boy}
      className="absolute top-0 left-1/2 -translate-x-1/2"
      aria-hidden
    >
      <path
        d={tam}
        fill="none"
        stroke="var(--patika-golge)"
        strokeWidth={48}
        strokeLinecap="round"
        transform="translate(0 5)"
      />
      {katmanlar(tam, 'var(--patika-yol)', 'var(--patika-yol-ic)', 'var(--patika-yol-cizgi)')}
      {koyu &&
        katmanlar(
          koyu,
          'var(--patika-gecilen)',
          'var(--patika-gecilen-ic)',
          'var(--patika-gecilen-cizgi)',
        )}
    </svg>
  )
}

/** Yolun başındaki pusula — süs; haritanın bir harita olduğunu söylüyor. */
function Pusula() {
  return (
    <div className="absolute right-4 size-[54px]" style={{ top: BANT_PAYI + 30 }} aria-hidden>
      <div
        className="absolute inset-0 rounded-full border-2 bg-card"
        style={{
          borderColor: 'var(--patika-gecilen-ic)',
          boxShadow: '0 3px 8px var(--patika-golge), 0 0 0 5px rgba(255,255,255,.5)',
        }}
      />
      <svg viewBox="0 0 54 54" width="54" height="54" className="absolute inset-0">
        <circle cx="27" cy="27" r="18" fill="none" stroke="var(--patika-yol-ic)" strokeWidth="2" />
        <g stroke="var(--patika-gecilen)" strokeWidth="2.6" strokeLinecap="round">
          <path d="M27 7v5M27 42v5M7 27h5M42 27h5" />
        </g>
        <polygon points="27,10 32,27 27,44 22,27" fill="var(--primary)" />
        <polygon points="27,27 32,27 27,44 22,27" fill="var(--primary-parlak)" />
        <circle
          cx="27"
          cy="27"
          r="3.2"
          fill="var(--card)"
          stroke="var(--patika-gecilen)"
          strokeWidth="1.6"
        />
      </svg>
    </div>
  )
}

/**
 * Patikadaki tek düğüm: bir kitap.
 *
 * Kart basamağı yeşil kapaklı tek bir kitap, soru basamağı turuncu kapaklı
 * ve hafif çapraz duran bir kitap çifti. Kitabın altında düz bir gölge var
 * ve dokunulunca gölgenin içine çöküyor — yolun üstündeki basamak elle
 * basılacak bir şey gibi durmalı.
 *
 * Sıradaki kitap ötekilerden biraz büyük, altında bir ışık ve çevresinde
 * genişleyen bir halka var: patikada kırk kitap var ve hepsi aynı boyda;
 * hangisinin sırada olduğunu renk tek başına söylemiyordu — bitmiş kitaplar
 * da aynı yeşil.
 */
function Dugum({
  basamak,
  x,
  y,
  durum,
  simdi,
  onAc,
}: {
  basamak: Basamak
  /** Kutunun ortasının ekran ortasından kayması, piksel. */
  x: number
  /** Kutunun üst kenarı, bölüm kutusundan piksel. */
  y: number
  durum: DugumDurumu
  /** Sıradaki basamak: halka genişler, kitap büyür. */
  simdi: boolean
  onAc: () => void
}) {
  const soru = basamak.tur === 'soru'
  const gri = durum === 'kilitli' || durum === 'yazilmadi'
  const ton = soru ? 'var(--primary-parlak)' : 'var(--success)'

  const nedeni =
    durum === 'yazilmadi'
      ? 'soruları henüz yazılmadı'
      : durum === 'kilitli'
        ? 'kilitli'
        : basamak.konu.ad

  return (
    <button
      type="button"
      role="listitem"
      onClick={onAc}
      aria-label={`${basamak.no}. basamak — ${soru ? 'sorular' : 'bilgi kartları'} — ${nedeni}`}
      className={cn('absolute grid place-items-center', durum === 'yazilmadi' && 'opacity-60')}
      style={{
        left: `calc(50% + ${x}px)`,
        top: y,
        width: KITAP_EN,
        height: KITAP_BOY,
        transform: 'translateX(-50%)',
      }}
    >
      {simdi && (
        <>
          <span
            aria-hidden
            className="absolute size-32 rounded-full"
            style={{
              background: `radial-gradient(circle, color-mix(in srgb, ${ton} 20%, transparent), transparent 68%)`,
            }}
          />
          <span
            aria-hidden
            className="patika-halka absolute -inset-1 rounded-[13px_19px_19px_13px] border-[3px]"
            style={{ borderColor: ton }}
          />
        </>
      )}

      {soru ? (
        <SoruKitabi gri={gri} simdi={simdi} />
      ) : (
        <KartKitabi no={basamak.no} gri={gri} simdi={simdi} />
      )}

      {durum === 'bitti' && (
        <span
          aria-hidden
          className="golge-kart absolute -right-1 -bottom-1 grid size-[22px] place-items-center rounded-full bg-card"
        >
          <Check size={13} strokeWidth={3.6} className="text-success" />
        </span>
      )}
      {durum === 'kilitli' && (
        <span
          aria-hidden
          className="absolute -right-1 -bottom-0.5 grid size-5 place-items-center rounded-full border-[1.5px] border-border bg-card"
        >
          <Lock size={11} strokeWidth={2.6} className="text-muted-foreground" />
        </span>
      )}
    </button>
  )
}

/**
 * Anlatım kitabı: yeşil kapak, sol kenarda koyu sırt, üstte ince bir ışık
 * çizgisi, ortada basamak numarası. Kapak rengi `--success` — bitmiş ve
 * sıradaki aynı yeşil, "bitti" bilgisini köşedeki tik taşıyor.
 */
function KartKitabi({ no, gri, simdi }: { no: number; gri: boolean; simdi: boolean }) {
  return (
    <span
      className={cn(
        'rakam relative grid place-items-center font-display font-extrabold transition-transform active:translate-y-[3px]',
        simdi
          ? 'h-[76px] w-[60px] rounded-[10px_16px_16px_10px] text-[25px]'
          : 'h-[68px] w-[56px] rounded-[9px_15px_15px_9px] text-[23px]',
        gri ? 'text-[var(--patika-kitap-kilitli-yazi)]' : 'text-white',
      )}
      style={{
        background: gri
          ? 'var(--patika-kitap-kilitli)'
          : 'linear-gradient(color-mix(in srgb, var(--success) 82%, #9dd08a), var(--success))',
        boxShadow: gri
          ? '0 5px 0 var(--patika-kitap-kilitli-golge)'
          : simdi
            ? '0 6px 0 color-mix(in srgb, var(--success) 72%, #000), 0 12px 20px color-mix(in srgb, var(--success) 24%, transparent)'
            : '0 5px 0 color-mix(in srgb, var(--success) 72%, #000), 0 9px 16px color-mix(in srgb, var(--success) 18%, transparent)',
        paddingLeft: 9,
        paddingTop: 6,
      }}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[9px] rounded-l-[9px]"
        style={{
          background: gri ? 'var(--patika-kitap-kilitli-sirt)' : 'rgba(0,0,0,.22)',
        }}
      />
      {!gri && (
        <span
          aria-hidden
          className="absolute top-[11px] left-[15px] h-[3px] w-[26px] rounded-sm bg-white/30"
        />
      )}
      {no}
    </span>
  )
}

/**
 * Soru kitabı: iki kitap, arkadaki eğik. Kapakta numara değil bir liste
 * simgesi — sorular sayılmıyor, çözülüyor. Sağ üstte bir kurdele.
 */
function SoruKitabi({ gri, simdi }: { gri: boolean; simdi: boolean }) {
  return (
    <span
      className="relative block h-[66px] w-14 transition-transform active:translate-y-[3px]"
      style={{ transform: simdi ? 'scale(1.08)' : undefined }}
    >
      <span
        aria-hidden
        className="absolute top-3.5 left-px h-[46px] w-12 rounded-[6px_11px_11px_6px]"
        style={{
          background: gri
            ? 'var(--patika-kitap-kilitli-arka)'
            : 'color-mix(in srgb, var(--primary-parlak) 80%, var(--primary))',
          boxShadow: gri
            ? '0 3px 0 var(--patika-kitap-kilitli-golge)'
            : '0 3px 0 color-mix(in srgb, var(--primary) 85%, #000)',
          transform: 'rotate(-13deg)',
        }}
      />
      <span
        className="absolute top-2.5 left-1.5 grid h-[50px] w-[47px] place-items-center rounded-[7px_12px_12px_7px]"
        style={{
          background: gri
            ? 'var(--patika-kitap-kilitli)'
            : 'linear-gradient(color-mix(in srgb, var(--primary-parlak) 88%, #fff), var(--primary-parlak))',
          boxShadow: gri ? '0 4px 0 var(--patika-kitap-kilitli-golge)' : '0 4px 0 var(--primary)',
          transform: 'rotate(-3deg)',
        }}
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-2 rounded-l-[7px]"
          style={{
            background: gri ? 'var(--patika-kitap-kilitli-sirt)' : 'rgba(0,0,0,.22)',
          }}
        />
        <span
          aria-hidden
          className="absolute top-[9px] left-3.5 h-[3px] w-[22px] rounded-sm"
          style={{
            background: gri ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.3)',
          }}
        />
        <span
          aria-hidden
          className="absolute -top-px right-[11px] h-[15px] w-2"
          style={{
            background: gri ? 'var(--patika-yol)' : 'var(--patika-serit)',
            clipPath: 'polygon(0 0,100% 0,100% 100%,50% 76%,0 100%)',
          }}
        />
        <svg viewBox="0 0 24 24" width="22" height="22" className="mt-1 ml-2" aria-hidden>
          <g fill={gri ? 'var(--patika-kitap-kilitli-yazi)' : '#fff'}>
            <rect x="4" y="6" width="5" height="5" rx="1.4" />
            <rect x="11.5" y="7" width="9" height="3" rx="1.5" />
            <rect x="4" y="14" width="5" height="5" rx="1.4" />
            <rect x="11.5" y="15" width="9" height="3" rx="1.5" />
          </g>
        </svg>
      </span>
    </span>
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
    /*
      `z-50`, alt menünün (`z-40`) üstünde: sayfa alt menüyle aynı katmanda
      dururken menü DOM'da sonra geldiği için sayfanın alt satırını örtüyor,
      "Sorular" basamağı menünün altında kalıyordu.
    */
    <div className="katman-zemin fixed inset-0 z-50 flex items-end justify-center bg-black/45">
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
            noZemin="bg-success"
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
            noZemin={soruKapali ? 'bg-muted text-muted-foreground' : 'bg-primary-parlak'}
            baslik="Sorular"
            alt={soruAlt}
            eylem={
              soruKapali
                ? 'Kilitli'
                : oran === null
                  ? 'Başla'
                  : gecti
                    ? 'Tekrar çöz'
                    : 'Tekrar dene'
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
 * Numara haritadaki basamak numarasının **aynısı** ve rozet de haritadaki
 * gibi bir kitap sırtı: yeşil kartlar, turuncu sorular. Sayfada 1–2 diye
 * yeniden başlayan bir numaralandırma, öğrencinin az önce bastığı kitabı
 * sayfada bulamaması demekti.
 */
function Adim({
  no,
  noZemin,
  baslik,
  alt,
  eylem,
  vurgulu,
  kapali = false,
  onTikla,
}: {
  no: number
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
          'rakam relative grid h-9 w-8 shrink-0 place-items-center rounded-[5px_9px_9px_5px] pl-1 text-[13px] font-extrabold text-white',
          noZemin,
        )}
        aria-hidden
      >
        <span className="absolute inset-y-0 left-0 w-1 rounded-l-[5px] bg-black/20" />
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
