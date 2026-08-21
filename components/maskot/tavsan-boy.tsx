import type { ReactElement } from 'react'
import type { Esya, EsyaKategorisi } from '@/lib/magaza/esyalar'
import type { MagazaDurumu } from '@/lib/magaza/magaza'
import { cn } from '@/lib/utils'
import { ANATOMI, TUVAL } from './olculer'
import { KURK_DESENI, kurkPaleti } from './parcalar/kurkler'
import { SAPKALAR } from './parcalar/sapkalar'
import { GOZLUKLER } from './parcalar/gozlukler'
import { USTLER, UST_ARKASI } from './parcalar/ustler'
import { ALTLAR } from './parcalar/altlar'
import { AYAKKABILAR } from './parcalar/ayakkabilar'
import { SIRT_ARKASI, SIRT_ONU } from './parcalar/sirtlar'

/**
 * Boydan tavşan — Havuç Mağazası'nın avatarı.
 *
 * `components/maskot/rabi.tsx` yalnızca baş çiziyor ve uygulamanın her yerinde
 * o duruyor; burada gövde de var çünkü mağazada satılan şeylerin çoğu boyuna
 * ait. İkisi ayrı dosya: maskot her ekranda, avatar yalnızca mağazada ve
 * ikisinin ölçüleri birbirine bağlı değil.
 *
 * Üç boyutlu bir avatar bu uygulamaya ağır gelirdi — statik dışa aktarım,
 * WebView ve birkaç yüz kilobaytlık bir paket. 2B SVG hem tema
 * değişkenleriyle uyuyor hem de yeni eşya eklemek bir dosyaya birkaç yol
 * yazmak demek.
 */

/** Katman sırası: arkadan öne. Bir eşyanın nereye çizileceği tek yerden okunuyor. */
type Katman = {
  kategori: EsyaKategorisi
  kayit: Record<string, () => ReactElement>
}

export function TavsanBoy({
  durum,
  onizleme,
  boyut = 200,
  kadraj,
  className,
}: {
  durum: MagazaDurumu
  /**
   * Mağazada üstüne dokunulan eşya — sahip olunmasa bile giyilmiş gibi
   * çizilir. Satın almadan önce görmek, satın aldıktan sonra pişman olmaktan
   * iyi.
   */
  onizleme?: Esya | null
  boyut?: number
  /** Kırpma kadrajı; verilmezse tuvalin tamamı. Mağaza kutucukları kullanıyor. */
  kadraj?: string
  className?: string
}) {
  const giyilen: Partial<Record<EsyaKategorisi, string>> = { ...durum.giyilen }
  if (onizleme) giyilen[onizleme.kategori] = onizleme.id

  /*
    Kadraj verildiğinde SVG genişliği kapsayıcıya bırakılıyor; yüksekliği de
    kadrajın kendi oranı belirliyor. Sabit bir yükseklik verilseydi kırpılmış
    kutucuklar oranını kaybederdi.
  */
  const [, , kadrajEni, kadrajBoyu] = (kadraj ?? `0 0 ${TUVAL.genislik} ${TUVAL.yukseklik}`)
    .split(/\s+/)
    .map(Number)

  const palet = kurkPaleti(giyilen.kurk)
  const desen = giyilen.kurk === undefined ? undefined : KURK_DESENI[giyilen.kurk]

  const ciz = ({ kategori, kayit }: Katman) => {
    const id = giyilen[kategori]
    if (id === undefined) return null
    const Parca = kayit[id]
    return Parca ? <Parca /> : null
  }

  return (
    <svg
      viewBox={kadraj ?? `0 0 ${TUVAL.genislik} ${TUVAL.yukseklik}`}
      width={kadraj ? '100%' : boyut}
      height={kadraj ? undefined : (boyut * TUVAL.yukseklik) / TUVAL.genislik}
      style={kadraj ? { aspectRatio: `${kadrajEni} / ${kadrajBoyu}` } : undefined}
      className={cn('shrink-0', className)}
      /* Kırpılmış çizim mağaza kutucuğunun içinde duruyor ve eşyanın adı zaten
         kutucukta yazıyor: çizimi de okutmak, forma numarasını ("7") eşyanın
         adı sanmaya yol açıyordu. */
      role={kadraj ? undefined : 'img'}
      aria-hidden={kadraj ? true : undefined}
      aria-label={kadraj ? undefined : 'Tavşanın'}
    >
      {/* Sırtın arkası: kanatlar, jetpack, çantanın gövdesi. */}
      {ciz({ kategori: 'sirt', kayit: SIRT_ARKASI })}
      {ciz({ kategori: 'ust', kayit: UST_ARKASI })}

      <Kulaklar palet={palet} />
      <Bacaklar palet={palet} />
      <Kollar palet={palet} />
      <Govde palet={palet} />
      {desen?.()}

      {/* Kıyafetler: üst, sonra alt. Tulumun göğüslüğü tişörtün üstünde durmalı. */}
      {ciz({ kategori: 'ust', kayit: USTLER })}
      {ciz({ kategori: 'alt', kayit: ALTLAR })}
      {ciz({ kategori: 'ayakkabi', kayit: AYAKKABILAR })}
      {ciz({ kategori: 'sirt', kayit: SIRT_ONU })}

      {/* Baş kıyafetlerin üstünde: yaka çenenin altında kalsın. */}
      <Bas palet={palet} />
      <Yuz />
      {ciz({ kategori: 'gozluk', kayit: GOZLUKLER })}
      {ciz({ kategori: 'sapka', kayit: SAPKALAR })}
    </svg>
  )
}

type Palet = ReturnType<typeof kurkPaleti>

function Kulaklar({ palet }: { palet: Palet }) {
  const { kulak } = ANATOMI
  return (
    <g>
      {[
        { x: kulak.solX, egim: -kulak.egim },
        { x: kulak.sagX, egim: kulak.egim },
      ].map(({ x, egim }) => (
        <g key={x} transform={`rotate(${egim} ${x} ${kulak.y})`}>
          <ellipse cx={x} cy={kulak.y} rx={kulak.rx} ry={kulak.ry} fill={palet.kurk} />
          <ellipse cx={x} cy={kulak.y + 4} rx={kulak.rx - 6} ry={kulak.ry - 13} fill={palet.kulakIc} />
        </g>
      ))}
    </g>
  )
}

function Bacaklar({ palet }: { palet: Palet }) {
  const { bacak, ayak } = ANATOMI
  return (
    <g fill={palet.kurk}>
      <rect
        x={bacak.solX - bacak.kalinlik / 2}
        y={bacak.ust}
        width={bacak.kalinlik}
        height={bacak.alt - bacak.ust}
        rx={bacak.kalinlik / 2}
      />
      <rect
        x={bacak.sagX - bacak.kalinlik / 2}
        y={bacak.ust}
        width={bacak.kalinlik}
        height={bacak.alt - bacak.ust}
        rx={bacak.kalinlik / 2}
      />
      <ellipse cx={ayak.solX} cy={ayak.y} rx={ayak.rx} ry={ayak.ry} />
      <ellipse cx={ayak.sagX} cy={ayak.y} rx={ayak.rx} ry={ayak.ry} />
    </g>
  )
}

function Kollar({ palet }: { palet: Palet }) {
  const { kol } = ANATOMI
  return (
    <g fill={palet.kurk}>
      {[kol.solX, kol.sagX].map((x) => (
        <rect
          key={x}
          x={x - kol.kalinlik / 2}
          y={kol.ust}
          width={kol.kalinlik}
          height={kol.alt - kol.ust}
          rx={kol.kalinlik / 2}
        />
      ))}
    </g>
  )
}

function Govde({ palet }: { palet: Palet }) {
  const { govde } = ANATOMI
  return (
    <g>
      {/* Kuyruk gövdenin sağ arkasından görünüyor — tavşanı tavşan yapan detay. */}
      <circle cx={govde.sag + 6} cy={govde.alt - 26} r="11" fill={palet.golge} />
      <rect
        x={govde.sol}
        y={govde.ust}
        width={govde.sag - govde.sol}
        height={govde.alt - govde.ust}
        rx={govde.yuvarlak}
        fill={palet.kurk}
      />
      {/* Karın — kürkün açık tonu, kıyafet giyilmediğinde gövdeyi düz bırakmıyor. */}
      <ellipse
        cx={(govde.sol + govde.sag) / 2}
        cy={govde.ust + 58}
        rx="23"
        ry="28"
        fill={palet.golge}
        opacity="0.45"
      />
    </g>
  )
}

function Bas({ palet }: { palet: Palet }) {
  const { bas } = ANATOMI
  return (
    <g>
      <ellipse cx={bas.x} cy={bas.y} rx={bas.rx} ry={bas.ry} fill={palet.kurk} />
      <ellipse cx={bas.x - 34} cy={bas.y + 12} rx="10" ry="6.5" fill={palet.yanak} opacity="0.75" />
      <ellipse cx={bas.x + 34} cy={bas.y + 12} rx="10" ry="6.5" fill={palet.yanak} opacity="0.75" />
    </g>
  )
}

/**
 * Yüz.
 *
 * Tek ifade var: `rabi.tsx`'teki gibi ruh hâli almıyor. Mağaza avatarı bir
 * durum anlatmıyor, kıyafet gösteriyor — değişen bir ifade eşyayı
 * karşılaştırmayı zorlaştırırdı.
 */
function Yuz() {
  const { goz, burun } = ANATOMI
  const cizgi = 'var(--maskot-cizgi)'
  return (
    <g>
      <g fill={cizgi}>
        <ellipse cx={goz.solX} cy={goz.y} rx={goz.rx} ry={goz.ry} />
        <ellipse cx={goz.sagX} cy={goz.y} rx={goz.rx} ry={goz.ry} />
      </g>
      <g fill="var(--maskot-parlak)">
        <circle cx={goz.solX + 2.5} cy={goz.y - 3} r="2.6" />
        <circle cx={goz.sagX + 2.5} cy={goz.y - 3} r="2.6" />
      </g>

      <path d={`M${burun.x} ${burun.y + 2} l-7 -6 h14 z`} fill="var(--maskot-burun)" />

      <g
        fill="none"
        stroke={cizgi}
        strokeWidth="2.4"
        strokeLinecap="round"
      >
        <path d={`M${burun.x} ${burun.y + 2} v6`} />
        <path d={`M${burun.x} ${burun.y + 8} q-8 6 -13 0`} />
        <path d={`M${burun.x} ${burun.y + 8} q8 6 13 0`} />
      </g>

      <g stroke={cizgi} strokeWidth="1.8" strokeLinecap="round" opacity="0.45">
        <path d="M42 122 L64 126" />
        <path d="M42 133 L64 132" />
        <path d="M158 122 L136 126" />
        <path d="M158 133 L136 132" />
      </g>
    </g>
  )
}
