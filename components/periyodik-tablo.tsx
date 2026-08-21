'use client'

import {
  BOLGELER,
  BOLGE_ADI,
  ELEMENTLER,
  SATIR_SAYISI,
  SUTUN_SAYISI,
  tabloKonumu,
  type ElementBolgesi,
} from '@/lib/oyunlar/periyodik-havuzu'
import { cn } from '@/lib/utils'

/**
 * Periyodik tablo çizimi.
 *
 * Hücrelerde **yalnızca atom numarası** yazıyor: sembol ya da ad yazsaydı
 * oyunun cevabı tablodan okunurdu. Geriye kalan tek ipucu konum ve renk —
 * zaten öğretilmek istenen de bu.
 *
 * Dokunma yok: harita oyununun aksine burada tablo cevap alanı değil, referans.
 * Cevaplar alttaki iki şıktan veriliyor.
 */

/**
 * Sayının punto boyu.
 *
 * Üç haneli numaralar (100 ve üstü) iki haneliyle aynı puntoda yazılsaydı
 * hücreden taşardı; ikisi aynı küçük puntoya indirilseydi bu sefer asıl
 * sorulan aralık (1–92) telefonda okunmazdı. Hane sayısına bakmak ikisini de
 * çözüyor. Vurgulu hücre her hâlükârda bir tık büyük.
 */
function puntolar(numara: number, vurgulu: boolean): number {
  const taban = numara >= 100 ? 3.9 : 5
  return vurgulu ? taban + 0.8 : taban
}

/** Hücre adımı ve hücreler arası boşluk — SVG birimleri. */
const ADIM = 10
const BOSLUK = 1

/** Bölge → hücre dolgusu. Renkler `globals.css` içindeki `--pt-*` tonları. */
const DOLGU: Record<ElementBolgesi, string> = {
  alkali: 'fill-pt-alkali',
  'toprak-alkali': 'fill-pt-toprak',
  gecis: 'fill-pt-gecis',
  'zayif-metal': 'fill-pt-zayif',
  'yari-metal': 'fill-pt-yari',
  ametal: 'fill-pt-ametal',
  halojen: 'fill-pt-halojen',
  'soy-gaz': 'fill-pt-soy',
  lantanit: 'fill-pt-lantanit',
  aktinit: 'fill-pt-aktinit',
}

/** Aynı renkler açıklama şeridindeki noktalar için — orada SVG değil, div var. */
const ZEMIN: Record<ElementBolgesi, string> = {
  alkali: 'bg-pt-alkali',
  'toprak-alkali': 'bg-pt-toprak',
  gecis: 'bg-pt-gecis',
  'zayif-metal': 'bg-pt-zayif',
  'yari-metal': 'bg-pt-yari',
  ametal: 'bg-pt-ametal',
  halojen: 'bg-pt-halojen',
  'soy-gaz': 'bg-pt-soy',
  lantanit: 'bg-pt-lantanit',
  aktinit: 'bg-pt-aktinit',
}

/**
 * İşaretin durumu.
 *
 * `soru`: cevap bekleniyor, hücre yanıp sönüyor. `dogru`/`yanlis`: cevap
 * verildi, yanıp sönme duruyor ve çerçeve sonucun rengini alıyor — göz zaten
 * o hücrede, sonucu orada görmesi bildirime bakmasından hızlı.
 */
export type IsaretDurumu = 'soru' | 'dogru' | 'yanlis'

const CERCEVE: Record<IsaretDurumu, string> = {
  soru: 'stroke-foreground',
  dogru: 'stroke-success',
  yanlis: 'stroke-ikincil',
}

export function PeriyodikTablo({
  isaretli,
  durum,
}: {
  /** Vurgulanan elementin atom numarası; yoksa hiçbir hücre işaretli değil. */
  isaretli: number | null
  durum: IsaretDurumu
}) {
  const isaretliKonum = isaretli === null ? null : tabloKonumu(isaretli)

  return (
    <div className="golge-kart flex-none rounded-[20px] bg-card p-2">
      <svg
        viewBox={`0 0 ${SUTUN_SAYISI * ADIM} ${SATIR_SAYISI * ADIM}`}
        className="w-full select-none"
        role="img"
        aria-label="Periyodik tablo"
      >
        {ELEMENTLER.map((element) => {
          const { sutun, satir } = tabloKonumu(element.numara)
          const x = (sutun - 1) * ADIM
          const y = (satir - 1) * ADIM
          const vurgulu = element.numara === isaretli
          return (
            <g key={element.numara}>
              <rect
                x={x}
                y={y}
                width={ADIM - BOSLUK}
                height={ADIM - BOSLUK}
                rx={1.4}
                className={DOLGU[element.bolge]}
              />
              <text
                x={x + (ADIM - BOSLUK) / 2}
                y={y + (ADIM - BOSLUK) / 2}
                textAnchor="middle"
                dominantBaseline="central"
                /* Vurgulu hücrenin sayısı kalın: çerçeve dikkati getiriyor,
                   kalınlık orada ne yazdığını okutuyor. */
                className={cn(
                  'fill-foreground',
                  vurgulu ? 'font-extrabold' : 'font-semibold opacity-80',
                )}
                fontSize={puntolar(element.numara, vurgulu)}
              >
                {element.numara}
              </text>
            </g>
          )
        })}

        {/* İşaret çerçevesi hücrelerin üstünde ayrı çiziliyor: dolgunun kendisi
            yanıp sönseydi altındaki sayı da kaybolurdu. */}
        {isaretliKonum && (
          <rect
            x={(isaretliKonum.sutun - 1) * ADIM - 0.5}
            y={(isaretliKonum.satir - 1) * ADIM - 0.5}
            width={ADIM - BOSLUK + 1}
            height={ADIM - BOSLUK + 1}
            rx={2}
            fill="none"
            strokeWidth={1.1}
            className={cn(CERCEVE[durum], durum === 'soru' && 'isaretli-element')}
          />
        )}
      </svg>
    </div>
  )
}

/**
 * Bölge açıklaması.
 *
 * Renk ipucu olmasın diye tabloyu tek renk çizmek de mümkündü ama o zaman
 * oyun yalnızca ezber ölçerdi. Renk kaldıysa ne anlama geldiği yazmalı —
 * yoksa ipucu değil süs olurdu.
 */
export function BolgeAciklamasi() {
  return (
    <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
      {BOLGELER.map((bolge) => (
        <span key={bolge} className="flex items-center gap-1 text-[9.5px] font-semibold text-muted-foreground">
          <span className={cn('h-2 w-2 flex-none rounded-[3px]', ZEMIN[bolge])} />
          {BOLGE_ADI[bolge]}
        </span>
      ))}
    </div>
  )
}
