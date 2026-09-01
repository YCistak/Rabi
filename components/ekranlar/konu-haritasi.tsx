'use client'

import { useMemo, useState } from 'react'
import { Check, Play } from 'lucide-react'
import {
  KONU_DERSLERI,
  KONU_SINIFLARI,
  dersBul,
  programBul,
  tumKonular,
  type Konu,
  type KonuAilesi,
  type KonuDersId,
  type KonuSinifi,
  type Tema,
} from '@/lib/konu'
import {
  bilinmeyenKur,
  bilinmeyenSil,
  bilinmeyenleriEkle,
  dersOrani,
  ilerlemeyiYaz,
  konuBitti,
  temadaBiten,
  type BilinmeyenKart,
  type KonuIlerlemeleri,
} from '@/lib/konu/ilerleme'
import { bugun, cn } from '@/lib/utils'
import { Kart } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { KartDestesi, type DesteSonucu } from '@/components/konu/kart-destesi'
import { BilinmeyenlerEkrani } from '@/components/konu/bilinmeyenler'

/**
 * Konu Anlatımı haritası.
 *
 * Üstte ders ve sınıf seçilir, altında o programın temaları **patika**
 * hâlinde dizilir: konular üç şeride yayılıp aralarındaki eğri çizgilerle
 * bağlanıyor. Düz bir liste, tema içindeki sırayı ve "nerede kaldım"ı
 * göstermiyordu; patika bunu tek bakışta veriyor.
 *
 * **Kilit yok.** Konular sırayla açılmıyor; hepsi her zaman açık. Sınav
 * hazırlığındaki öğrenci yarın işlenecek konuya bugün bakmak ister ve
 * kilitli bir harita onu kendi müfredatından uzak tutardı. Sıra bilgisi
 * yine duruyor — patikanın kendisi sırayı gösteriyor, dayatmıyor.
 */

/** Patikanın şeritleri: 0 sol, 1 orta, 2 sağ. Dönüşümlü desen S kıvrımı üretiyor. */
const SERITLER = [1, 2, 1, 0]

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
  bilinmeyenler,
  setBilinmeyenler,
}: {
  secim: { ders: KonuDersId; sinif: KonuSinifi }
  setSecim: (secim: { ders: KonuDersId; sinif: KonuSinifi }) => void
  ilerlemeler: KonuIlerlemeleri
  setIlerlemeler: (guncelle: (onceki: KonuIlerlemeleri) => KonuIlerlemeleri) => void
  bilinmeyenler: BilinmeyenKart[]
  setBilinmeyenler: (guncelle: (onceki: BilinmeyenKart[]) => BilinmeyenKart[]) => void
}) {
  /** Açık deste; null ise harita görünüyor. */
  const [acikKonu, setAcikKonu] = useState<{ konu: Konu; temaAdi: string } | null>(null)
  const [bankaAcik, setBankaAcik] = useState(false)

  const ders = dersBul(secim.ders)
  const program = useMemo(() => programBul(secim.ders, secim.sinif), [secim])
  const oran = useMemo(
    () => (program ? dersOrani(program, ilerlemeler) : { biten: 0, toplam: 0 }),
    [program, ilerlemeler],
  )

  /** İlk bitmemiş konu — "kaldığın yer" kartı ve patikadaki vurgu buna bakıyor. */
  const siradaki = useMemo(() => {
    if (!program) return null
    for (const tema of program.temalar) {
      for (const konu of tema.konular) {
        if (!konuBitti(ilerlemeler, konu.id)) return { konu, temaAdi: tema.ad }
      }
    }
    return null
  }, [program, ilerlemeler])

  function desteBitti(konu: Konu, sonuc: DesteSonucu) {
    const tarih = bugun()
    setAcikKonu(null)

    if (sonuc.bilinmeyenler.length > 0) {
      const yeniler = sonuc.bilinmeyenler.map((kart) =>
        bilinmeyenKur(kart, konu, secim.ders, secim.sinif, tarih),
      )
      setBilinmeyenler((onceki) => bilinmeyenleriEkle(onceki, yeniler))
    }

    /*
      Yarıda çıkılan deste de kaydediliyor: kullanıcı üç kartı işaretlemişse
      o üç kart bankaya girmeli. Yalnız `bitti` yazılmıyor, yani harita
      konuyu tamamlanmış göstermiyor — tamamlanma destenin sonuna gelmekle
      kazanılıyor.
    */
    if (!sonuc.bitti && sonuc.bilinenler.length + sonuc.bilinmeyenler.length === 0) return

    setIlerlemeler((onceki) =>
      ilerlemeyiYaz(
        onceki,
        konu.id,
        {
          bilinen: sonuc.bilinenler.length,
          bilinmeyen: sonuc.bilinmeyenler.length,
          bitti: sonuc.bitti,
        },
        tarih,
      ),
    )
  }

  if (acikKonu) {
    return (
      <KartDestesi
        konu={acikKonu.konu}
        temaAdi={acikKonu.temaAdi}
        dersAdi={ders.ad}
        zeminSinifi={AILE_ZEMIN[ders.aile]}
        onKapat={(sonuc) => desteBitti(acikKonu.konu, sonuc)}
      />
    )
  }

  return (
    <div className="space-y-4">
      {bankaAcik && (
        <BilinmeyenlerEkrani
          banka={bilinmeyenler}
          onSil={(id) => setBilinmeyenler((onceki) => bilinmeyenSil(onceki, id))}
          onKapat={() => setBankaAcik(false)}
        />
      )}

      <header className="flex items-start gap-3 px-0.5">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-[22px] font-extrabold tracking-tight">Konu Anlatımı</h1>
          <p className="text-[13px] font-semibold text-muted-foreground">
            Maarif müfredatı · bilgi kartlarıyla
          </p>
        </div>
        {/* Bilmediklerim haritanın **içinde**: kartlar buraya buradan düşüyor,
            ayrı bir araç kutucuğu olsaydı ikisi arasındaki bağ kopardı. */}
        <button
          type="button"
          onClick={() => setBankaAcik(true)}
          className="shrink-0 rounded-xl bg-danger-soft px-3 py-2 text-left transition active:brightness-95"
        >
          <span className="block text-[10.5px] font-extrabold uppercase tracking-[0.07em] text-danger/80">
            Bilmediklerim
          </span>
          <span className="rakam block text-[15px] font-extrabold text-danger">
            {bilinmeyenler.length}
          </span>
        </button>
      </header>

      {/* Sınıf ve ders seçimi. Sınıf az seçenekli olduğu için iki hap, ders
          yedi seçenekli olduğu için kaydırılan şerit. */}
      <div className="space-y-2.5">
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

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
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

      {program === null ? (
        <Kart className="flex flex-col items-center px-6 py-10 text-center">
          <Rabi durum="calisiyor" boyut={92} />
          <p className="mt-3 font-display text-[17px] font-extrabold tracking-tight">
            {secim.sinif}. sınıf {ders.ad} hazırlanıyor
          </p>
          <p className="mt-1 text-[13.5px] font-semibold text-muted-foreground text-pretty">
            Bu dersin kartları henüz yazılmadı. Şimdilik başka bir sınıf ya da ders seçebilirsin.
          </p>
        </Kart>
      ) : (
        <>
          {/* Kaldığın yer: haritada aşağı inip aramanın kısa yolu. Her konu
              bitmişse yerini kutlama satırı alıyor. */}
          {siradaki ? (
            <button
              type="button"
              onClick={() => setAcikKonu(siradaki)}
              className="golge-kart flex w-full items-center gap-3 rounded-2xl bg-card px-4 py-3.5 text-left transition active:brightness-[0.98]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-dolu text-white">
                <Play size={18} strokeWidth={2.6} fill="currentColor" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10.5px] font-extrabold uppercase tracking-[0.09em] text-muted-foreground">
                  {oran.biten === 0 ? 'Buradan başla' : 'Kaldığın yer'}
                </span>
                <span className="mt-0.5 block truncate font-display text-[15.5px] font-extrabold tracking-tight">
                  {siradaki.konu.ad}
                </span>
                <span className="block truncate text-xs font-semibold text-muted-foreground">
                  {siradaki.temaAdi} · {siradaki.konu.kartlar.length} kart
                </span>
              </span>
              <span className="rakam shrink-0 text-[13px] font-extrabold text-muted-foreground">
                {oran.biten}/{oran.toplam}
              </span>
            </button>
          ) : (
            <Kart className="flex items-center gap-3 px-4 py-3.5">
              <Rabi durum="kutlama" boyut={44} />
              <p className="text-[14px] font-bold text-pretty">
                {secim.sinif}. sınıf {ders.ad} konularının hepsini bitirdin.
              </p>
            </Kart>
          )}

          <div className="space-y-6">
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
        </>
      )}
    </div>
  )
}

/** Tek tema: üstte başlık bandı, altında konuların patikası. */
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
  /** Sıradaki konu — patikada halka ile işaretleniyor. */
  vurgulanan: string | null
  onKonuAc: (konu: Konu) => void
}) {
  const biten = temadaBiten(tema, ilerlemeler)
  const tamam = biten === tema.konular.length

  return (
    <section>
      <div className={cn('rounded-2xl px-4 py-3', AILE_ZEMIN[aile])}>
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              'rakam grid size-8 shrink-0 place-items-center rounded-xl bg-white/70 text-[14px] font-extrabold',
              AILE_YAZI[aile],
            )}
          >
            {sira}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-[15.5px] font-extrabold tracking-tight">
              {tema.ad}
            </h2>
            <p className="rakam text-[11.5px] font-bold text-muted-foreground">
              {biten}/{tema.konular.length} konu
            </p>
          </div>
          {tamam && (
            <span className={cn('shrink-0', AILE_YAZI[aile])} aria-label="Tema tamamlandı">
              <Check size={20} strokeWidth={3} aria-hidden />
            </span>
          )}
        </div>

        {/* İnce çubuk, halkadan daha az yer kaplıyor ve bandın genişliğini
            kullanıyor: tema başlığının altında ikinci bir daire fazlaydı. */}
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/60">
          <div
            className="h-full rounded-full bg-primary-parlak transition-[width] duration-300"
            style={{ width: `${(biten / tema.konular.length) * 100}%` }}
          />
        </div>
      </div>

      <ol className="mt-1 pb-1">
        {tema.konular.map((konu, i) => (
          <li key={konu.id}>
            {i > 0 && <Baglanti onceki={SERITLER[(i - 1) % 4]} sonraki={SERITLER[i % 4]} />}
            <KonuDugumu
              konu={konu}
              serit={SERITLER[i % 4]}
              sira={i + 1}
              bitti={konuBitti(ilerlemeler, konu.id)}
              baslandi={ilerlemeler[konu.id] !== undefined}
              vurgulu={konu.id === vurgulanan}
              onAc={() => onKonuAc(konu)}
            />
          </li>
        ))}
      </ol>
    </section>
  )
}

/**
 * İki düğüm arasındaki eğri.
 *
 * SVG `preserveAspectRatio="none"` ile genişliğe yayılıyor: şerit konumları
 * yüzde olarak biliniyor ama piksel karşılığı ekran genişliğine bağlı ve
 * ölçüm yapmadan bilinemiyor. Yatayda esneyen bir kutu bunu ölçüm
 * gerektirmeden çözüyor.
 */
function Baglanti({ onceki, sonraki }: { onceki: number; sonraki: number }) {
  const x1 = (onceki + 0.5) * 100
  const x2 = (sonraki + 0.5) * 100
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 26"
      preserveAspectRatio="none"
      className="block h-[26px] w-full text-border"
    >
      <path
        d={`M ${x1} 0 C ${x1} 13, ${x2} 13, ${x2} 26`}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1 7"
      />
    </svg>
  )
}

/**
 * Patikadaki tek konu.
 *
 * Daire değil **yuvarlatılmış kare**: uygulamanın geri kalanı (ana sayfa
 * kutucukları, kartlar) bu dili konuşuyor ve üst üste dizilen daireler
 * ekranı başka bir uygulamadan alınmış gibi gösteriyordu.
 */
function KonuDugumu({
  konu,
  serit,
  sira,
  bitti,
  baslandi,
  vurgulu,
  onAc,
}: {
  konu: Konu
  serit: number
  sira: number
  bitti: boolean
  /** Deste açılmış ama bitirilmemiş — düğüm yarım işaretleniyor. */
  baslandi: boolean
  vurgulu: boolean
  onAc: () => void
}) {
  return (
    <div className="grid grid-cols-3">
      <button
        type="button"
        onClick={onAc}
        style={{ gridColumnStart: serit + 1 }}
        className="flex flex-col items-center gap-1.5 rounded-2xl px-1 py-1 transition active:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span
          className={cn(
            'grid size-14 place-items-center rounded-[20px] text-[17px] font-extrabold transition',
            bitti
              ? 'bg-primary-dolu text-white'
              : baslandi
                ? 'bg-primary-soft text-primary'
                : 'bg-muted text-muted-foreground',
            // Sıradaki konu halka ile işaretleniyor: patika uzadığında gözün
            // nereye gideceğini söyleyen tek işaret bu.
            vurgulu && 'ring-3 ring-primary ring-offset-2 ring-offset-background',
          )}
        >
          {bitti ? (
            <Check size={24} strokeWidth={3} aria-hidden />
          ) : (
            <span className="rakam" aria-hidden>
              {sira}
            </span>
          )}
        </span>
        <span
          className={cn(
            'text-[11px] leading-tight font-bold text-balance',
            bitti ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {konu.ad}
        </span>
      </button>
    </div>
  )
}
