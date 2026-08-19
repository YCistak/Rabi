'use client'

/**
 * Haritanın yakınlaştırma ve kaydırma mantığı.
 *
 * Küçük iller 390 piksellik ekranda birkaç piksel kalıyor: Yalova'yı görmek
 * için haritaya sokulabilmek gerekiyor. Yakınlaştırma `viewBox`'ı daraltarak
 * yapılıyor — `transform: scale()` yerine, çünkü `viewBox` çizgi kalınlığını
 * ve dokunma hedefini birlikte büyütüyor, il sınırları yakınlaşınca da keskin
 * kalıyor.
 *
 * Saf hesaplar (sınırlama, odaklı yakınlaştırma) React'ten bağımsız duruyor ve
 * test ediliyor; hook yalnızca işaretçileri (parmak/fare) izleyip bu hesapları
 * çağırıyor.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { HARITA_GENISLIK, HARITA_YUKSEKLIK } from './harita-havuzu'

/** Görünen pencere: `viewBox`'ın sol üst köşesi ve genişliği. */
export type Gorunum = { x: number; y: number; en: number }

/** Haritanın tamamı. */
export const TAM_GORUNUM: Gorunum = { x: 0, y: 0, en: HARITA_GENISLIK }

/**
 * En çok kaç kat yakınlaşılabilir.
 *
 * Beş kat, en küçük ili (Yalova ~6 piksel) parmakla rahat seçilebilir hâle
 * getiriyor. Fazlası haritayı bulanıklaştırmıyor ama yön duygusunu bitiriyor:
 * ekranda tek bir il kalıyor, nereye baktığın belli olmuyor.
 */
export const EN_COK_OLCEK = 5

/** Bir düğmeye basınca ölçeğin çarpanı. */
export const DUGME_ADIMI = 1.6

/** Görünümün en-boy oranı sabit — kutu değişirse harita ezilirdi. */
const ORAN = HARITA_YUKSEKLIK / HARITA_GENISLIK

/** Sürükleme mi dokunma mı: bu kadar pikselden azı dokunma sayılıyor. */
export const DOKUNMA_ESIGI = 8

function kis(deger: number, en_az: number, en_cok: number): number {
  return Math.min(Math.max(deger, en_az), en_cok)
}

/** Görünümün yüksekliği; genişliğinden türüyor. */
export function gorunumBoyu(gorunum: Gorunum): number {
  return gorunum.en * ORAN
}

/** Kaç kat yakınlaşılmış. */
export function gorunumOlcegi(gorunum: Gorunum): number {
  return HARITA_GENISLIK / gorunum.en
}

/**
 * Görünümü haritanın içinde tutar.
 *
 * Kenardan dışarı kaydırmaya izin verilseydi ekranın yarısı boş kalırdı;
 * uzaklaşınca da görünüm kendiliğinden haritanın tamamına oturuyor.
 */
export function sinirla(gorunum: Gorunum): Gorunum {
  const en = kis(gorunum.en, HARITA_GENISLIK / EN_COK_OLCEK, HARITA_GENISLIK)
  const boy = en * ORAN
  return {
    en,
    x: kis(gorunum.x, 0, HARITA_GENISLIK - en),
    y: kis(gorunum.y, 0, HARITA_YUKSEKLIK - boy),
  }
}

/**
 * Odak noktasını yerinde tutarak yakınlaştırır.
 *
 * Parmakların ortası neredeyse harita orada sabit kalmalı: kullanıcı bir ile
 * bakarken sıkıştırdığında o il ekranın ortasına kaçmadan büyümeli. Çarpan
 * 1'den büyükse yakınlaşıyor, küçükse uzaklaşıyor.
 */
export function odaklaYakinlastir(
  gorunum: Gorunum,
  odak: readonly [number, number],
  carpan: number,
): Gorunum {
  const istenen = sinirla({ ...gorunum, en: gorunum.en / carpan })
  // Sınıra takılmış olabilir; gerçekleşen oranla kaydırma hesaplanıyor.
  const oran = istenen.en / gorunum.en
  return sinirla({
    en: istenen.en,
    x: odak[0] - (odak[0] - gorunum.x) * oran,
    y: odak[1] - (odak[1] - gorunum.y) * oran,
  })
}

/** Görünümü harita birimiyle kaydırır. */
export function kaydir(gorunum: Gorunum, dx: number, dy: number): Gorunum {
  return sinirla({ ...gorunum, x: gorunum.x + dx, y: gorunum.y + dy })
}

/** Görünümün ortası — düğmeyle yakınlaşırken odak burası. */
export function gorunumMerkezi(gorunum: Gorunum): [number, number] {
  return [gorunum.x + gorunum.en / 2, gorunum.y + gorunumBoyu(gorunum) / 2]
}

type Isaretci = { x: number; y: number }

function orta(a: Isaretci, b: Isaretci): Isaretci {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function uzaklik(a: Isaretci, b: Isaretci): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export type Yakinlastirma = {
  gorunum: Gorunum
  olcek: number
  /** `<svg>` elemanına bağlanacak ref — ekran koordinatı buradan çevriliyor. */
  svgRef: React.RefObject<SVGSVGElement | null>
  /** `<svg>` üzerine yayılacak işaretçi olayları. */
  isleyiciler: {
    onPointerDown: (olay: React.PointerEvent<SVGSVGElement>) => void
    onPointerMove: (olay: React.PointerEvent<SVGSVGElement>) => void
    onPointerUp: (olay: React.PointerEvent<SVGSVGElement>) => void
    onPointerCancel: (olay: React.PointerEvent<SVGSVGElement>) => void
    onPointerLeave: (olay: React.PointerEvent<SVGSVGElement>) => void
  }
  yakinlas: () => void
  uzaklas: () => void
  sifirla: () => void
  /**
   * Son dokunuş bir seçim sayılır mı.
   *
   * Haritayı kaydırmak için parmağı sürüklemek, parmağın kalktığı ilin
   * seçilmesi demek olmamalı — il seçen tıklamada bu denetim yapılıyor.
   */
  secimSayilirMi: () => boolean
}

export function useHaritaYakinlastirma(): Yakinlastirma {
  const [gorunum, setGorunum] = useState<Gorunum>(TAM_GORUNUM)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const isaretciler = useRef(new Map<number, Isaretci>())
  /** Sıkıştırmadaki son parmak arası — oran buradan çıkıyor. */
  const sonAralik = useRef(0)
  const hareketEtti = useRef(false)
  /** Parmağın indiği nokta — sürükleme eşiği buna göre ölçülüyor. */
  const baslangic = useRef<Isaretci | null>(null)
  /** Ölçek hesabı sırasında en güncel görünüm; state gecikmesine takılmamak için. */
  const gorunumRef = useRef(gorunum)
  gorunumRef.current = gorunum

  const uygula = useCallback((yeni: Gorunum) => {
    gorunumRef.current = yeni
    setGorunum(yeni)
  }, [])

  /** Ekran koordinatını harita birimine çevirir. */
  const haritaNoktasi = useCallback((x: number, y: number): [number, number] => {
    const kutu = svgRef.current?.getBoundingClientRect()
    const g = gorunumRef.current
    if (!kutu || kutu.width === 0) return gorunumMerkezi(g)
    return [
      g.x + ((x - kutu.left) / kutu.width) * g.en,
      g.y + ((y - kutu.top) / kutu.height) * gorunumBoyu(g),
    ]
  }, [])

  /** Ekran mesafesini harita birimine çevirir. */
  const haritaMesafesi = useCallback((piksel: number): number => {
    const kutu = svgRef.current?.getBoundingClientRect()
    if (!kutu || kutu.width === 0) return 0
    return (piksel / kutu.width) * gorunumRef.current.en
  }, [])

  const onPointerDown = useCallback((olay: React.PointerEvent<SVGSVGElement>) => {
    isaretciler.current.set(olay.pointerId, { x: olay.clientX, y: olay.clientY })
    if (isaretciler.current.size === 1) {
      baslangic.current = { x: olay.clientX, y: olay.clientY }
      hareketEtti.current = false
    }
    if (isaretciler.current.size === 2) {
      const [a, b] = [...isaretciler.current.values()]
      sonAralik.current = uzaklik(a, b)
      // İki parmak indiyse artık dokunma değil jest: seçim tetiklenmemeli.
      hareketEtti.current = true
    }
  }, [])

  const onPointerMove = useCallback(
    (olay: React.PointerEvent<SVGSVGElement>) => {
      const onceki = isaretciler.current.get(olay.pointerId)
      if (!onceki) return
      const simdi = { x: olay.clientX, y: olay.clientY }
      isaretciler.current.set(olay.pointerId, simdi)

      // İki parmak: sıkıştırma. Aralığın oranı doğrudan ölçek çarpanı.
      if (isaretciler.current.size >= 2) {
        const [a, b] = [...isaretciler.current.values()]
        const aralik = uzaklik(a, b)
        if (sonAralik.current > 0 && aralik > 0) {
          const merkez = orta(a, b)
          uygula(
            odaklaYakinlastir(
              gorunumRef.current,
              haritaNoktasi(merkez.x, merkez.y),
              aralik / sonAralik.current,
            ),
          )
        }
        sonAralik.current = aralik
        return
      }

      // Eşik parmağın **indiği** noktaya göre ölçülüyor: dokunurken kayan iki
      // piksel seçimi iptal etmemeli, ama yavaş yavaş biriken kayma etmeli.
      const bas = baslangic.current
      if (bas && Math.hypot(simdi.x - bas.x, simdi.y - bas.y) > DOKUNMA_ESIGI) {
        hareketEtti.current = true
      }

      // Tam görünümde kaydırılacak yer yok.
      if (gorunumRef.current.en >= HARITA_GENISLIK) return
      uygula(
        kaydir(
          gorunumRef.current,
          -haritaMesafesi(simdi.x - onceki.x),
          -haritaMesafesi(simdi.y - onceki.y),
        ),
      )
    },
    [haritaMesafesi, haritaNoktasi, uygula],
  )

  const birak = useCallback((olay: React.PointerEvent<SVGSVGElement>) => {
    isaretciler.current.delete(olay.pointerId)
    if (isaretciler.current.size < 2) sonAralik.current = 0
  }, [])

  // Fare tekerleği: masaüstünde denemek için. Tarayıcının sayfa kaydırmasını
  // engellemek gerektiğinden React'in edilgen (passive) dinleyicisi yetmiyor.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const tekerlek = (olay: WheelEvent) => {
      olay.preventDefault()
      uygula(
        odaklaYakinlastir(
          gorunumRef.current,
          haritaNoktasi(olay.clientX, olay.clientY),
          olay.deltaY < 0 ? 1.15 : 1 / 1.15,
        ),
      )
    }
    svg.addEventListener('wheel', tekerlek, { passive: false })
    return () => svg.removeEventListener('wheel', tekerlek)
  }, [haritaNoktasi, uygula])

  const dugmeyle = useCallback(
    (carpan: number) => {
      const g = gorunumRef.current
      uygula(odaklaYakinlastir(g, gorunumMerkezi(g), carpan))
    },
    [uygula],
  )

  // Dönen işlevler kararlı: bileşen bunları efekt bağımlılığı olarak kullanıyor,
  // her çizimde yenilenselerdi efekt sonsuz dönerdi.
  const yakinlas = useCallback(() => dugmeyle(DUGME_ADIMI), [dugmeyle])
  const uzaklas = useCallback(() => dugmeyle(1 / DUGME_ADIMI), [dugmeyle])
  const sifirla = useCallback(() => uygula(TAM_GORUNUM), [uygula])
  const secimSayilirMi = useCallback(() => !hareketEtti.current, [])

  return {
    gorunum,
    olcek: gorunumOlcegi(gorunum),
    svgRef,
    isleyiciler: {
      onPointerDown,
      onPointerMove,
      onPointerUp: birak,
      onPointerCancel: birak,
      // Fare sürüklerken haritadan çıkarsa `pointerup` gelmiyor; iz kalmasın.
      // Dokunmada üstü örtülü yakalama (implicit capture) var, bu tetiklenmiyor.
      onPointerLeave: birak,
    },
    yakinlas,
    uzaklas,
    sifirla,
    secimSayilirMi,
  }
}
