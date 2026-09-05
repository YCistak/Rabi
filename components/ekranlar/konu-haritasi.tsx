'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'
import {
  KONU_DERSLERI,
  KONU_SINIFLARI,
  dersBul,
  okumaDakikasi,
  programBul,
  programSayilari,
  type Konu,
  type KonuAilesi,
  type KonuDersId,
  type KonuSinifi,
  type Tema,
} from '@/lib/konu'
import {
  dersOrani,
  ilerlemeyiYaz,
  konuBitti,
  temadaBiten,
  type KonuIlerlemeleri,
} from '@/lib/konu/ilerleme'
import { bugun, cn } from '@/lib/utils'
import { Halka, Kart } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { KartDestesi, type DesteSonucu } from '@/components/konu/kart-destesi'
import { SoruSahnesi, type SahneSonucu } from '@/components/konu/soru-sahnesi'

/**
 * Konu Anlatımı haritası.
 *
 * Ekran üç parçadan oluşuyor: programın tek cümlelik özetini ve sıradaki
 * konuyu taşıyan **kapak**, hangi programda çalışıldığını yazan **kapalı bir
 * seçici** ve altında temaların **listesi**.
 *
 * Konular bir süre üç şeride yayılan bir patikada duruyordu; liste ona
 * döndü. Patikada konunun adı düğümün altında iki üç kelimeye sığmak
 * zorundaydı ve "kaç kart, ne kadar sürer" hiçbir yerde yazamıyordu — oysa
 * "şimdi mi sonra mı" kararını veren şey o. Sıra bilgisi kayboldu sayılmaz:
 * soldaki ray ve numaralı düğümler aynı sırayı gösteriyor.
 *
 * **Kilit yok.** Konular sırayla açılmıyor; hepsi her zaman açık. Sınav
 * hazırlığındaki öğrenci yarın işlenecek konuya bugün bakmak ister ve
 * kilitli bir harita onu kendi müfredatından uzak tutardı.
 */

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
  /*
    Program seçici **kapalı** başlıyor. Sınıf hapları ve yedi ders çipi
    sürekli açıkken ekranın ilk yarısını kaplıyor, konu listesi katlamanın
    altında kalıyordu; oysa seçim bir kez yapılıp aylarca değişmiyor.
  */
  const [secimAcik, setSecimAcik] = useState(false)

  const ders = dersBul(secim.ders)
  const program = useMemo(() => programBul(secim.ders, secim.sinif), [secim])
  /** İlk bitmemiş konu — kapaktaki "sıradaki" ve listedeki halka buna bakıyor. */
  const siradaki = useMemo(() => {
    if (!program) return null
    for (const tema of program.temalar) {
      for (const konu of tema.konular) {
        if (!konuBitti(ilerlemeler, konu.id)) return { konu, temaAdi: tema.ad }
      }
    }
    return null
  }, [program, ilerlemeler])

  function desteBitti(acik: { konu: Konu; temaAdi: string }, sonuc: DesteSonucu) {
    setAcikKonu(null)

    /*
      Yarıda çıkılan deste de kaydediliyor: kullanıcı üç kartı okuduysa
      listede "3/4 kart okudun" yazmalı. Yalnız `bitti` yazılmıyor, yani
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
        { okunan: konu.kartlar.length, bitti: true, dogru: sonuc.dogru },
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
  const sayilar = program ? programSayilari(program) : null

  return (
    <div className="space-y-4">
      <header className="px-0.5">
        <h1 className="font-display text-[22px] font-extrabold tracking-tight">Konu Anlatımı</h1>
        <p className="text-[13px] font-semibold text-muted-foreground">
          Maarif müfredatı · bilgi kartları
        </p>
      </header>

      {program !== null && oran !== null && sayilar !== null && (
        <section className={cn('rounded-3xl px-4 py-4', AILE_ZEMIN[ders.aile])}>
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'text-[10.5px] font-extrabold tracking-[0.09em] uppercase',
                  AILE_YAZI[ders.aile],
                )}
              >
                ✦ {secim.sinif}. sınıf {ders.ad}
              </p>
              {/* Başlık programın kendi özeti: "9. sınıf Matematik" zaten bir
                  satır yukarıda yazıyor ve ikinci kez yazılması ekranın en
                  büyük yazısını bir etikete çeviriyordu. */}
              <h2 className="mt-1 font-display text-[27px] leading-[1.08] font-extrabold tracking-tight text-balance">
                {program.ozet}
              </h2>
              <p className="rakam mt-2.5 text-[12.5px] font-bold text-muted-foreground">
                {sayilar.tema} tema · {sayilar.konu} konu
              </p>
            </div>

            <div className="golge-kart shrink-0 rounded-full bg-card">
              <Halka
                deger={oran.biten}
                hedef={oran.toplam}
                boyut={76}
                kalinlik={7}
                renk="var(--primary-parlak)"
              >
                <span className="font-display text-[22px] leading-none font-extrabold">
                  {oran.biten}
                </span>
                <span className="rakam mt-0.5 text-[9.5px] font-bold text-muted-foreground">
                  /{oran.toplam} konu
                </span>
              </Halka>
            </div>
          </div>

          {/* Kapağın altındaki tek düğme: haritayı açan öğrencinin çoğu zaman
              yapmak istediği şey kaldığı yerden devam etmek ve o konuyu
              listede aramak, ekranı iki kez okumak demekti. */}
          {siradaki !== null && (
            <button
              type="button"
              onClick={() => setAcikKonu(siradaki)}
              className="golge-kart mt-3.5 flex w-full items-center gap-2.5 rounded-2xl bg-card p-2.5 text-left transition active:brightness-[0.98]"
            >
              <Rabi boyut={34} />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-extrabold tracking-[0.09em] text-muted-foreground uppercase">
                  Sıradaki
                </span>
                <span className="block truncate font-display text-[15px] font-extrabold tracking-tight">
                  {siradaki.konu.ad}
                </span>
              </span>
              <span className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full bg-primary-dolu pr-2.5 pl-3.5 text-[13.5px] font-extrabold text-white">
                Devam
                <ChevronRight size={16} strokeWidth={3} aria-hidden />
              </span>
            </button>
          )}
        </section>
      )}

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
          <Rabi durum="calisiyor" boyut={92} />
          <p className="mt-3 font-display text-[17px] font-extrabold tracking-tight">
            {secim.sinif}. sınıf {ders.ad} hazırlanıyor
          </p>
          <p className="mt-1 text-[13.5px] font-semibold text-pretty text-muted-foreground">
            Bu dersin kartları henüz yazılmadı. Şimdilik başka bir sınıf ya da ders seçebilirsin.
          </p>
        </Kart>
      ) : (
        <div className="space-y-5">
          {program.temalar.map((tema, sira) => (
            <TemaBolumu
              key={tema.id}
              tema={tema}
              sira={sira + 1}
              aile={ders.aile}
              ilerlemeler={ilerlemeler}
              vurgulanan={siradaki?.konu.id ?? null}
              onKonuAc={(konu) => setAcikKonu({ konu, temaAdi: tema.ad })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/** Tek tema: üstte başlık bandı, altında konuların listesi. */
function TemaBolumu({
  tema,
  sira,
  aile,
  ilerlemeler,
  vurgulanan,
  onKonuAc,
}: {
  tema: Tema
  sira: number
  aile: KonuAilesi
  ilerlemeler: KonuIlerlemeleri
  /** Sıradaki konu — listede halka ile işaretleniyor. */
  vurgulanan: string | null
  onKonuAc: (konu: Konu) => void
}) {
  const biten = temadaBiten(tema, ilerlemeler)

  return (
    <section>
      {/*
        Bandın altındaki ilerleme çubuğu kalktı: sağdaki "1/4" aynı şeyi
        sayıyla söylüyor ve tema başlıkları ekranda arka arkaya dizildiğinde
        yedi çubuk, konu listesinden çok yer kaplıyordu.
      */}
      <div className={cn('flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5', AILE_ZEMIN[aile])}>
        <span
          className={cn(
            'rakam grid size-6 shrink-0 place-items-center rounded-lg bg-white/70 text-[12px] font-extrabold',
            AILE_YAZI[aile],
          )}
        >
          {sira}
        </span>
        <h2 className="min-w-0 flex-1 truncate font-display text-[14.5px] font-extrabold tracking-tight">
          {tema.ad}
        </h2>
        <span className="rakam shrink-0 text-[12px] font-extrabold text-muted-foreground">
          {biten}/{tema.konular.length}
        </span>
      </div>

      <ol className="mt-2">
        {tema.konular.map((konu, i) => (
          <KonuSatiri
            key={konu.id}
            konu={konu}
            sira={i + 1}
            sonuncu={i === tema.konular.length - 1}
            ilerleme={ilerlemeler[konu.id]}
            vurgulu={konu.id === vurgulanan}
            onAc={() => onKonuAc(konu)}
          />
        ))}
      </ol>
    </section>
  )
}

/**
 * Listedeki tek konu: solda raydaki düğüm, sağda kart.
 *
 * Ray ile kart ayrı iki öğe: ray sırayı ve tamamlanmayı taşıyor, kart
 * konunun kendisini. Düğümü kartın içine koymak, sıradaki konuyu gösteren
 * halkanın kartın gölgesiyle çakışması demekti.
 */
function KonuSatiri({
  konu,
  sira,
  sonuncu,
  ilerleme,
  vurgulu,
  onAc,
}: {
  konu: Konu
  sira: number
  /** Sonuncuda ray aşağı devam etmiyor; eden bir çizgi boşluğa iniyordu. */
  sonuncu: boolean
  ilerleme: KonuIlerlemeleri[string] | undefined
  vurgulu: boolean
  onAc: () => void
}) {
  const bitti = ilerleme?.bitti === true
  const okunan = ilerleme?.okunan ?? 0
  const toplam = konu.kartlar.length

  return (
    <li className="relative flex gap-3 pb-2">
      {!sonuncu && (
        <span
          aria-hidden
          className="absolute top-9 bottom-0 left-[17px] w-0.5 rounded-full bg-border"
        />
      )}

      <span
        aria-hidden
        className={cn(
          'relative z-10 mt-2 grid size-9 shrink-0 place-items-center rounded-full text-[13px] font-extrabold transition',
          bitti
            ? 'bg-primary-dolu text-white'
            : vurgulu
              ? 'bg-card text-primary ring-2 ring-primary'
              : 'bg-card text-muted-foreground ring-2 ring-border',
        )}
      >
        {bitti ? <Check size={17} strokeWidth={3} /> : <span className="rakam">{sira}</span>}
      </span>

      <button
        type="button"
        onClick={onAc}
        className="golge-kart flex min-w-0 flex-1 items-center gap-2 rounded-2xl bg-card px-3.5 py-3 text-left transition active:brightness-[0.98]"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[14.5px] leading-tight font-extrabold tracking-tight text-pretty">
            {konu.ad}
          </span>
          {/* Alt satır durumu söylüyor: hiç açılmamış konuda "ne kadar sürer",
              açılmışta "nerede kalındı". İkisi de aynı anda yazılsaydı satır
              iki katına çıkar, listede sekiz konu ekranı doldururdu. */}
          <span className="rakam mt-0.5 block text-[12px] font-bold text-primary/80">
            {bitti
              ? `${toplam} kart okundu`
              : okunan > 0
                ? `${okunan}/${toplam} kart okudun`
                : `${toplam} kart · ${okumaDakikasi(toplam)} dk`}
          </span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-muted-foreground" aria-hidden />
      </button>
    </li>
  )
}
