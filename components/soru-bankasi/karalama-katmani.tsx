'use client'

import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import { geriKaydirmayiKilitle } from '@/lib/geri-kaydirma'
import {
  DOKUNUS_HAREKET_ESIGI,
  DOKUNUS_SURE_ESIGI,
  noktalariSeyrelt,
  silgiDegiyorMu,
  yolParcasi,
  yumusakYol,
  type Murekkep,
  type SayfaCizgisi,
  type SayfaNoktasi,
  type YolKomutu,
} from '@/lib/cizim'
import {
  ATALET_EN_AZ_HIZ,
  ataletAdimi,
  ciftDokunmaGorunumu,
  GORUNUM_BASI,
  gorunumKaydir,
  gorunumOlcekle,
  gorunumSinirla,
  hizOlc,
  icerikNoktasi,
  kistirmaGorunumu,
  tekerlekFarki,
  tekerlekOlcegi,
  type Gorunum,
  type GorusOlcusu,
  type Nokta,
  type ParmakCifti,
} from '@/lib/soru-bankasi/gorunum'

export type KaralamaAraci = 'kalem' | 'vurgu' | 'silgi' | 'el'
export type GirdiTuru = 'mouse' | 'pen' | 'touch'

/** Sayfanın dışarıdan (klavye, düğme) sürülmesi. */
export type KaralamaKolu = {
  /** Artı aşağı. */
  kaydir: (dy: number) => void
  sayfaKaydir: (yon: 1 | -1) => void
  yakinligiSifirla: () => void
  /** Öğe görüş alanının altında kaldıysa, üstü görünür kalacak kadar yumuşakça kaydırır. */
  gorunurYap: (oge: Element) => void
}

/** Vurgulayıcının saydamlığı: canlıda tuvalin CSS opaklığı, bitmişte `globalAlpha`. */
const VURGU_SAYDAMLIK = 0.38
/** Silginin ekrandaki yarıçapı; yakınlaşınca içerikte küçülür. */
const SILGI_YARICAP = 11
const UZUN_BASIS_MS = 450
const CIFT_DOKUNMA_MS = 300
const CIFT_DOKUNMA_UZAKLIK = 30
/** İkinci parmak bu kadar erken gelirse ilk parmağın başlattığı çizgi kıstırmanın parçasıydı: atılır. */
const KISTIRMA_PAYI_MS = 180
/** Seyreltme toleransı, ekran pikseli: gözle ayırt edilmeyecek kadar küçük. */
const SEYRELTME = 0.35

type Isaretci = {
  tur: GirdiTuru
  bas: { x: number; y: number; zaman: number }
  son: Nokta
  hedef: Element | null
  rol: 'cizim' | 'silgi' | 'kaydir' | 'kistir' | 'bos'
  hareketli: boolean
  ornekler: { x: number; y: number; zaman: number }[]
}

type Cizilen = { cizgi: SayfaCizgisi; cizilenSira: number; baslangic: number }

function etkilesimliMi(hedef: Element | null): boolean {
  return !!hedef?.closest('button, a, input, textarea, select, label, summary, [role="button"]')
}

function girdiTuru(olay: PointerEvent): GirdiTuru {
  return olay.pointerType === 'mouse' || olay.pointerType === 'pen' ? olay.pointerType : 'touch'
}

function yolKur(baglam: CanvasRenderingContext2D, komutlar: readonly YolKomutu[]) {
  for (const k of komutlar) {
    if (k.tur === 'tasi') baglam.moveTo(k.x, k.y)
    else if (k.tur === 'cizgi') baglam.lineTo(k.x, k.y)
    else baglam.quadraticCurveTo(k.kx, k.ky, k.x, k.y)
  }
}

const sinirlar = new WeakMap<SayfaCizgisi, [number, number, number, number]>()
function cizgiSiniri(cizgi: SayfaCizgisi): [number, number, number, number] {
  let kutu = sinirlar.get(cizgi)
  if (!kutu) {
    const xs = cizgi.noktalar.map((n) => n[0])
    const ys = cizgi.noktalar.map((n) => n[1])
    const pay = cizgi.kalinlik
    kutu = [Math.min(...xs) - pay, Math.min(...ys) - pay, Math.max(...xs) + pay, Math.max(...ys) + pay]
    sinirlar.set(cizgi, kutu)
  }
  return kutu
}

/**
 * Soru sayfasının kaydırma, yakınlaştırma ve karalama yüzeyi.
 *
 * İçerik (soru, şekil, şıklar) tek bir CSS dönüşümüyle kayar ve büyür;
 * çizgiler görüş alanı boyundaki iki tuvalde, `devicePixelRatio` ile ekran
 * çözünürlüğünde çizilir — yakınlaşınca bulanıklaşmaz, görünüm her değişince
 * yeniden çizilir (çizgi sayısı küçük, görünmeyen çizgi atlanır). Çizilmekte
 * olan çizgi ayrı bir tuvalde, yalnız yeni parçası eklenerek çizilir; çizim
 * sırasında React state'i değişmez, çizgi bırakılınca bir kez `onCizgiEkle`.
 *
 * Düğmeler (şıklar, eleme ✕) tuvalin altında kendi tıklamalarını alır:
 * tuvaller dokunuş almaz, işaretçi olayları kabarcıkla bu yüzeye gelir. Kısa
 * ve hareketsiz dokunuş düğmeye gider; sürükleme başlayınca işaretçi yüzeye
 * yakalanır ve ardından gelen tıklama yutulur (şık üstünde başlayan çizgi şık
 * seçmez).
 */
export const KaralamaKatmani = forwardRef<
  KaralamaKolu,
  {
    sayfaAnahtari: string | number
    gecisYonu: 'ileri' | 'geri' | null
    cizgiler: SayfaCizgisi[]
    arac: KaralamaAraci
    renk: Murekkep
    /** Ekran pikseli. */
    kalinlik: number
    onCizgiEkle: (cizgi: SayfaCizgisi) => void
    onCizgileriSil: (silinenler: Set<SayfaCizgisi>) => void
    /** Girdinin türü görülünce çağrılır; bu dokunuşta geçerli aracı döndürür. */
    onGirdi: (tur: GirdiTuru) => KaralamaAraci
    /** Uzun basış ya da sağ tık; işlendiyse true. */
    onUzunBas: (hedef: Element) => boolean
    children: React.ReactNode
  }
>(function KaralamaKatmani(props, kolRef) {
  const alanRef = useRef<HTMLDivElement>(null)
  const kayanRef = useRef<HTMLDivElement>(null)
  const icerikRef = useRef<HTMLDivElement>(null)
  const kaliciRef = useRef<HTMLCanvasElement>(null)
  const canliRef = useRef<HTMLCanvasElement>(null)
  const cubukRef = useRef<HTMLDivElement>(null)

  // Olay dinleyicileri bir kez kuruluyor; güncel prop'lar ref'ten okunur.
  const propsRef = useRef(props)
  propsRef.current = props

  const gorunum = useRef<Gorunum>(GORUNUM_BASI)
  const olcu = useRef<GorusOlcusu>({
    genislik: 1,
    yukseklik: 1,
    icerikYukseklik: 1,
  })
  const [olcek, setOlcek] = useState(1)

  // Olay ve çizim işlevleri efektin içinde kuruluyor; dışarıdan (kol, prop
  // değişimi) çağrılanlar bu ref'te duruyor.
  const islevler = useRef<{
    uygula: (g: Gorunum) => void
    ciz: () => void
    sifirla: () => void
    gorunurYap: (oge: Element) => void
  } | null>(null)

  const yakinligiSifirla = () =>
    islevler.current?.uygula(gorunumOlcekle(gorunum.current, 1, [olcu.current.genislik / 2, 0], olcu.current))

  useImperativeHandle(kolRef, () => ({
    kaydir: (dy) => islevler.current?.uygula(gorunumKaydir(gorunum.current, 0, -dy, olcu.current)),
    sayfaKaydir: (yon) =>
      islevler.current?.uygula(gorunumKaydir(gorunum.current, 0, -yon * olcu.current.yukseklik * 0.85, olcu.current)),
    yakinligiSifirla,
    gorunurYap: (oge) => islevler.current?.gorunurYap(oge),
  }))

  useEffect(() => {
    const alan = alanRef.current!
    const icerik = icerikRef.current!
    const kalici = kaliciRef.current!
    const canli = canliRef.current!
    const kaliciBaglam = kalici.getContext('2d')!
    const canliBaglam = canli.getContext('2d')!

    const isaretciler = new Map<number, Isaretci>()
    let cizilen: Cizilen | null = null
    const silinecek = new Set<SayfaCizgisi>()
    let silgiOnceki: SayfaNoktasi | null = null
    let silgiHalkasi: Nokta | null = null
    let kistirmaOnceki: ParmakCifti | null = null
    let kalemGoruldu = false
    let kilitBirak: (() => void) | null = null
    let tiklamaYutZamani = -Infinity
    let sonDokunma: { x: number; y: number; zaman: number } | null = null
    let uzunBasZamanlayici: number | undefined
    let sonUzunBas = -Infinity
    let ataletKimligi = 0
    let cizimIstendi = 0
    let kaliciKirli = false
    let canliTam = false
    let cubukZamanlayici: number | undefined
    let kutu = { left: 0, top: 0, oran: 1 }
    let oran = window.devicePixelRatio || 1

    const kutuGuncelle = () => {
      const dikdortgen = alan.getBoundingClientRect()
      // Tablette `body` `zoom`lu: ekran pikselini yerleşim pikseline çevir.
      kutu = {
        left: dikdortgen.left,
        top: dikdortgen.top,
        oran: dikdortgen.width / Math.max(1, alan.offsetWidth) || 1,
      }
    }
    const nokta = (olay: { clientX: number; clientY: number }): Nokta => [
      (olay.clientX - kutu.left) / kutu.oran,
      (olay.clientY - kutu.top) / kutu.oran,
    ]

    // ── Çizim ──────────────────────────────────────────────────────────────
    let renkler: Record<string, string> = {}
    const renkleriOku = () => {
      const stil = getComputedStyle(alan)
      renkler = Object.fromEntries(
        ['kursun', 'kirmizi', 'mavi', 'yesil', 'vurgu'].map((ad) => [ad, stil.getPropertyValue(`--murekkep-${ad}`).trim()]),
      )
    }
    renkleriOku()

    const donusum = (baglam: CanvasRenderingContext2D) => {
      const g = gorunum.current
      baglam.setTransform(oran * g.olcek, 0, 0, oran * g.olcek, oran * g.x, oran * g.y)
    }

    const cizgiCiz = (baglam: CanvasRenderingContext2D, cizgi: SayfaCizgisi) => {
      const renk = renkler[cizgi.renk] || 'gray'
      baglam.globalAlpha = cizgi.arac === 'vurgu' ? VURGU_SAYDAMLIK : 1
      baglam.lineWidth = cizgi.kalinlik
      baglam.strokeStyle = renk
      baglam.fillStyle = renk
      baglam.beginPath()
      if (cizgi.noktalar.length === 1) {
        const [x, y] = cizgi.noktalar[0]
        baglam.arc(x, y, cizgi.kalinlik / 2, 0, Math.PI * 2)
        baglam.fill()
        return
      }
      yolKur(baglam, yumusakYol(cizgi.noktalar))
      baglam.stroke()
    }

    const kaliciCiz = () => {
      const g = gorunum.current
      kaliciBaglam.setTransform(1, 0, 0, 1, 0, 0)
      kaliciBaglam.clearRect(0, 0, kalici.width, kalici.height)
      donusum(kaliciBaglam)
      kaliciBaglam.lineCap = 'round'
      kaliciBaglam.lineJoin = 'round'
      const sol = -g.x / g.olcek
      const ust = -g.y / g.olcek
      const sag = (olcu.current.genislik - g.x) / g.olcek
      const alt = (olcu.current.yukseklik - g.y) / g.olcek
      // Vurgulayıcı mürekkebin altında kalsın.
      for (const tur of ['vurgu', 'kalem'] as const) {
        for (const cizgi of propsRef.current.cizgiler) {
          if (cizgi.arac !== tur || silinecek.has(cizgi)) continue
          const [x1, y1, x2, y2] = cizgiSiniri(cizgi)
          if (x2 < sol || x1 > sag || y2 < ust || y1 > alt) continue
          cizgiCiz(kaliciBaglam, cizgi)
        }
      }
      kaliciBaglam.globalAlpha = 1
    }

    /** Canlı çizginin yeni parçaları; `tam` ise baştan (görünüm değişti). */
    const canliCiz = (tam: boolean) => {
      if (tam) {
        canliBaglam.setTransform(1, 0, 0, 1, 0, 0)
        canliBaglam.clearRect(0, 0, canli.width, canli.height)
      }
      if (cizilen) {
        donusum(canliBaglam)
        const { cizgi } = cizilen
        const renk = renkler[cizgi.renk] || 'gray'
        canliBaglam.globalAlpha = 1
        canliBaglam.lineCap = 'round'
        canliBaglam.lineJoin = 'round'
        canliBaglam.lineWidth = cizgi.kalinlik
        canliBaglam.strokeStyle = renk
        canliBaglam.fillStyle = renk
        if (tam || cizilen.cizilenSira < 0) {
          const [x, y] = cizgi.noktalar[0]
          canliBaglam.beginPath()
          canliBaglam.arc(x, y, cizgi.kalinlik / 2, 0, Math.PI * 2)
          canliBaglam.fill()
          cizilen.cizilenSira = 0
        }
        const bas = tam ? 1 : cizilen.cizilenSira + 1
        for (let sira = bas; sira < cizgi.noktalar.length; sira++) {
          canliBaglam.beginPath()
          yolKur(canliBaglam, yolParcasi(cizgi.noktalar, sira))
          canliBaglam.stroke()
        }
        cizilen.cizilenSira = cizgi.noktalar.length - 1
      }
      if (silgiHalkasi) {
        // Halka ekran pikselinde, yakınlıktan bağımsız.
        canliBaglam.setTransform(oran, 0, 0, oran, 0, 0)
        canliBaglam.globalAlpha = 1
        canliBaglam.lineWidth = 1.5
        canliBaglam.strokeStyle = renkler.kursun || 'gray'
        canliBaglam.beginPath()
        canliBaglam.arc(silgiHalkasi[0], silgiHalkasi[1], SILGI_YARICAP, 0, Math.PI * 2)
        canliBaglam.stroke()
      }
    }

    const cizimIste = (kaliciDa: boolean, canliyiTam: boolean) => {
      kaliciKirli ||= kaliciDa
      canliTam ||= canliyiTam
      if (cizimIstendi) return
      cizimIstendi = requestAnimationFrame(() => {
        cizimIstendi = 0
        if (kaliciKirli) kaliciCiz()
        const tam = canliTam
        kaliciKirli = false
        canliTam = false
        canliCiz(tam)
      })
    }

    const tuvalleriBoyutla = () => {
      oran = window.devicePixelRatio || 1
      const { genislik, yukseklik } = olcu.current
      for (const tuval of [kalici, canli]) {
        tuval.width = Math.max(1, Math.round(genislik * oran))
        tuval.height = Math.max(1, Math.round(yukseklik * oran))
        tuval.style.width = `${genislik}px`
        tuval.style.height = `${yukseklik}px`
      }
      cizimIste(true, true)
    }

    // ── Görünüm ────────────────────────────────────────────────────────────
    const cubuguGoster = () => {
      const cubuk = cubukRef.current
      if (!cubuk) return
      const { yukseklik, icerikYukseklik } = olcu.current
      const g = gorunum.current
      const toplam = icerikYukseklik * g.olcek
      if (toplam <= yukseklik + 1) {
        cubuk.style.opacity = '0'
        return
      }
      const boy = Math.max(32, (yukseklik / toplam) * yukseklik)
      const ust = (-g.y / (toplam - yukseklik)) * (yukseklik - boy)
      cubuk.style.height = `${boy}px`
      cubuk.style.transform = `translateY(${ust}px)`
      cubuk.style.opacity = '1'
      window.clearTimeout(cubukZamanlayici)
      cubukZamanlayici = window.setTimeout(() => {
        if (cubukRef.current) cubukRef.current.style.opacity = '0'
      }, 900)
    }

    const uygula = (yeni: Gorunum) => {
      const onceki = gorunum.current
      const g = gorunumSinirla(yeni, olcu.current)
      gorunum.current = g
      icerik.style.transform = `translate(${g.x}px, ${g.y}px) scale(${g.olcek})`
      if (g.x !== onceki.x || g.y !== onceki.y || g.olcek !== onceki.olcek) {
        cubuguGoster()
        cizimIste(true, true)
      }
      setOlcek(Math.round(g.olcek * 100) / 100)
    }

    const ataletiDurdur = () => {
      if (ataletKimligi) cancelAnimationFrame(ataletKimligi)
      ataletKimligi = 0
    }
    const ataletBaslat = (hiz: Nokta) => {
      ataletiDurdur()
      if (Math.hypot(hiz[0], hiz[1]) < 0.15) return
      let anlik = hiz
      let son = performance.now()
      const adim = (zaman: number) => {
        const dt = Math.min(48, zaman - son)
        son = zaman
        const { hiz: yeni, kayma } = ataletAdimi(anlik, dt)
        anlik = yeni
        const onceki = gorunum.current
        uygula(gorunumKaydir(onceki, kayma[0], kayma[1], olcu.current))
        const durdu = gorunum.current.x === onceki.x && gorunum.current.y === onceki.y
        ataletKimligi = durdu || Math.hypot(yeni[0], yeni[1]) < ATALET_EN_AZ_HIZ ? 0 : requestAnimationFrame(adim)
      }
      ataletKimligi = requestAnimationFrame(adim)
    }

    // ── Çizgi ve silgi ─────────────────────────────────────────────────────
    const kilitAl = () => {
      if (!kilitBirak) kilitBirak = geriKaydirmayiKilitle()
    }
    const kilidiBirak = () => {
      kilitBirak?.()
      kilitBirak = null
    }

    const canliyiTemizle = () => {
      canliBaglam.setTransform(1, 0, 0, 1, 0, 0)
      canliBaglam.clearRect(0, 0, canli.width, canli.height)
    }

    const cizimiBaslat = (ekran: Nokta, zaman: number, arac: 'kalem' | 'vurgu') => {
      const g = gorunum.current
      const p = propsRef.current
      cizilen = {
        cizgi: {
          arac,
          renk: arac === 'vurgu' ? 'vurgu' : p.renk,
          kalinlik: p.kalinlik / g.olcek,
          noktalar: [icerikNoktasi(g, ekran)],
        },
        cizilenSira: -1,
        baslangic: zaman,
      }
      canli.style.opacity = arac === 'vurgu' ? String(VURGU_SAYDAMLIK) : '1'
      cizimIste(false, false)
    }

    const cizimeEkle = (ekran: Nokta) => {
      if (!cizilen) return
      const p = icerikNoktasi(gorunum.current, ekran)
      const son = cizilen.cizgi.noktalar[cizilen.cizgi.noktalar.length - 1]
      if (Math.abs(p[0] - son[0]) + Math.abs(p[1] - son[1]) < 0.15 / gorunum.current.olcek) return
      cizilen.cizgi.noktalar.push(p)
    }

    const cizimiBitir = (kaydet: boolean) => {
      const bitti = cizilen
      cizilen = null
      if (cizimIstendi) {
        cancelAnimationFrame(cizimIstendi)
        cizimIstendi = 0
        if (kaliciKirli) kaliciCiz()
        kaliciKirli = false
        canliTam = false
      }
      canliyiTemizle()
      if (kaydet && bitti) {
        const cizgi: SayfaCizgisi = {
          ...bitti.cizgi,
          noktalar: noktalariSeyrelt(bitti.cizgi.noktalar, SEYRELTME / gorunum.current.olcek),
        }
        // Kalıcı tuvale hemen çizilir; canlı tuval aynı karede silindiği için
        // çizgi bir an bile kaybolmaz. Prop gelince sıralı yeniden çizim yapılır.
        donusum(kaliciBaglam)
        kaliciBaglam.lineCap = 'round'
        kaliciBaglam.lineJoin = 'round'
        cizgiCiz(kaliciBaglam, cizgi)
        kaliciBaglam.globalAlpha = 1
        propsRef.current.onCizgiEkle(cizgi)
      }
      if (silgiHalkasi) cizimIste(false, true)
    }

    const silgiDene = (a: SayfaNoktasi, b: SayfaNoktasi) => {
      const yaricap = SILGI_YARICAP / gorunum.current.olcek
      let degdi = false
      for (const cizgi of propsRef.current.cizgiler) {
        if (silinecek.has(cizgi)) continue
        if (silgiDegiyorMu(cizgi, a, b, yaricap)) {
          silinecek.add(cizgi)
          degdi = true
        }
      }
      if (degdi) cizimIste(true, false)
    }

    const silgiyiBitir = () => {
      silgiOnceki = null
      if (silinecek.size === 0) return
      const silinenler = new Set(silinecek)
      silinecek.clear()
      propsRef.current.onCizgileriSil(silinenler)
    }

    // ── İşaretçi ───────────────────────────────────────────────────────────
    const tiklamayiYut = () => {
      tiklamaYutZamani = performance.now()
    }
    const uzunBasiIptal = () => {
      window.clearTimeout(uzunBasZamanlayici)
      uzunBasZamanlayici = undefined
    }
    const dokunmalar = () => [...isaretciler.values()].filter((i) => i.tur === 'touch' && i.rol !== 'bos')
    const parmakCifti = (): ParmakCifti | null => {
      const [ilk, ikinci] = [...isaretciler.values()].filter((i) => i.rol === 'kistir')
      return ilk && ikinci ? { ilk: ilk.son, ikinci: ikinci.son } : null
    }

    const asagi = (olay: PointerEvent) => {
      const tur = girdiTuru(olay)
      if (tur === 'mouse' && olay.button !== 0 && olay.button !== 1) return
      ataletiDurdur()
      kutuGuncelle()
      if (tur === 'pen') kalemGoruldu = true
      const arac = propsRef.current.onGirdi(tur)
      const ekran = nokta(olay)
      const isaretci: Isaretci = {
        tur,
        bas: { x: ekran[0], y: ekran[1], zaman: olay.timeStamp },
        son: ekran,
        hedef: olay.target instanceof Element ? olay.target : null,
        rol: 'bos',
        hareketli: false,
        ornekler: [{ x: ekran[0], y: ekran[1], zaman: olay.timeStamp }],
      }

      if (tur === 'touch') {
        const oncekiler = dokunmalar()
        if (oncekiler.length === 1) {
          // İkinci parmak: kıstırma. İlk parmağın yeni başlamış çizgisi atılır,
          // olgunlaşmış çizgi (bilerek çizilen) korunur.
          const ilk = oncekiler[0]
          if (ilk.rol === 'cizim' && cizilen) cizimiBitir(olay.timeStamp - cizilen.baslangic > KISTIRMA_PAYI_MS && ilk.hareketli)
          if (ilk.rol === 'silgi') silgiyiBitir()
          ilk.rol = 'kistir'
          ilk.hareketli = true
          isaretci.rol = 'kistir'
          isaretci.hareketli = true
          isaretciler.set(olay.pointerId, isaretci)
          uzunBasiIptal()
          kilidiBirak()
          silgiHalkasi = null
          kistirmaOnceki = parmakCifti()
          tiklamayiYut()
          for (const id of isaretciler.keys()) {
            try {
              alan.setPointerCapture(id)
            } catch {
              // kalkmış işaretçi yakalanamaz
            }
          }
          return
        }
        if (oncekiler.length >= 2) {
          isaretciler.set(olay.pointerId, isaretci)
          return
        }
      }
      if (cizilen || (tur !== 'touch' && isaretciler.size > 0)) {
        // Kalem çizerken gelen dokunuş (avuç içi) ya da ikinci işaretçi yok sayılır.
        isaretciler.set(olay.pointerId, isaretci)
        return
      }

      isaretciler.set(olay.pointerId, isaretci)
      if (tur === 'mouse' && olay.button === 1) isaretci.rol = 'kaydir'
      else if (tur === 'touch' && kalemGoruldu) isaretci.rol = 'kaydir'
      else if (arac === 'el') isaretci.rol = 'kaydir'
      else isaretci.rol = arac === 'silgi' ? 'silgi' : 'cizim'

      if (isaretci.rol === 'cizim') {
        kilitAl()
        cizimiBaslat(ekran, olay.timeStamp, arac === 'vurgu' ? 'vurgu' : 'kalem')
      } else if (isaretci.rol === 'silgi') {
        kilitAl()
        silgiOnceki = icerikNoktasi(gorunum.current, ekran)
        silgiHalkasi = ekran
        silgiDene(silgiOnceki, silgiOnceki)
        cizimIste(false, true)
      }

      const uzunHedef = isaretci.hedef?.closest('[data-uzun-bas]')
      if (uzunHedef) {
        uzunBasZamanlayici = window.setTimeout(() => {
          uzunBasZamanlayici = undefined
          if (isaretciler.get(olay.pointerId) !== isaretci || isaretci.hareketli) return
          if (!propsRef.current.onUzunBas(uzunHedef)) return
          sonUzunBas = performance.now()
          if (isaretci.rol === 'cizim') cizimiBitir(false)
          isaretci.rol = 'bos'
          tiklamayiYut()
        }, UZUN_BASIS_MS)
      }
    }

    const hareket = (olay: PointerEvent) => {
      const isaretci = isaretciler.get(olay.pointerId)
      if (!isaretci) {
        // Fareyle silgi: halka imleci izler.
        if (olay.pointerType === 'mouse' && propsRef.current.arac === 'silgi') {
          kutuGuncelle()
          silgiHalkasi = nokta(olay)
          cizimIste(false, true)
        }
        return
      }
      const birlesik = olay.getCoalescedEvents?.()
      const olaylar = birlesik && birlesik.length > 0 ? birlesik : [olay]
      const son = nokta(olaylar[olaylar.length - 1])

      if (!isaretci.hareketli && Math.hypot(son[0] - isaretci.bas.x, son[1] - isaretci.bas.y) > DOKUNUS_HAREKET_ESIGI) {
        isaretci.hareketli = true
        uzunBasiIptal()
        // Sürükleme artık yüzeyin: alttaki düğmeye tıklama gitmesin.
        try {
          alan.setPointerCapture(olay.pointerId)
        } catch {
          // işaretçi çoktan kalktıysa yakalanamaz; sorun değil
        }
      }

      switch (isaretci.rol) {
        case 'cizim':
          for (const tekil of olaylar) cizimeEkle(nokta(tekil))
          cizimIste(false, false)
          break
        case 'silgi':
          for (const tekil of olaylar) {
            const p = icerikNoktasi(gorunum.current, nokta(tekil))
            if (silgiOnceki) silgiDene(silgiOnceki, p)
            silgiOnceki = p
          }
          silgiHalkasi = son
          cizimIste(false, true)
          break
        case 'kaydir':
          uygula(gorunumKaydir(gorunum.current, son[0] - isaretci.son[0], son[1] - isaretci.son[1], olcu.current))
          isaretci.ornekler.push({
            x: son[0],
            y: son[1],
            zaman: olay.timeStamp,
          })
          if (isaretci.ornekler.length > 8) isaretci.ornekler.shift()
          break
        case 'kistir': {
          isaretci.son = son
          const cift = parmakCifti()
          if (cift && kistirmaOnceki) uygula(kistirmaGorunumu(gorunum.current, kistirmaOnceki, cift, olcu.current))
          kistirmaOnceki = cift
          break
        }
      }
      isaretci.son = son
    }

    const yukari = (olay: PointerEvent, iptal: boolean) => {
      const isaretci = isaretciler.get(olay.pointerId)
      if (!isaretci) return
      isaretciler.delete(olay.pointerId)
      uzunBasiIptal()
      const tik = !iptal && !isaretci.hareketli && olay.timeStamp - isaretci.bas.zaman <= DOKUNUS_SURE_ESIGI
      const etkilesimli = etkilesimliMi(isaretci.hedef)

      switch (isaretci.rol) {
        case 'kistir':
          // Kalan parmak kalkana dek bir şey yapmasın (kıstırmanın sonu çizgi olmasın).
          for (const kalan of isaretciler.values()) if (kalan.rol === 'kistir') kalan.rol = 'bos'
          kistirmaOnceki = null
          break
        case 'cizim':
          // Düğmeye yapılan hareketsiz dokunuş tıklamadır, nokta bırakmaz.
          cizimiBitir(isaretci.hareketli || (!etkilesimli && !iptal))
          break
        case 'silgi':
          silgiyiBitir()
          if (olay.pointerType !== 'mouse') silgiHalkasi = null
          cizimIste(false, true)
          break
        case 'kaydir':
          if (isaretci.hareketli && !iptal && isaretci.tur !== 'mouse') ataletBaslat(hizOlc(isaretci.ornekler, olay.timeStamp))
          if (tik && !etkilesimli) {
            const [x, y] = isaretci.son
            const ikinci =
              sonDokunma &&
              olay.timeStamp - sonDokunma.zaman < CIFT_DOKUNMA_MS &&
              Math.hypot(x - sonDokunma.x, y - sonDokunma.y) < CIFT_DOKUNMA_UZAKLIK
            if (ikinci) {
              uygula(ciftDokunmaGorunumu(gorunum.current, [x, y], olcu.current))
              sonDokunma = null
            } else sonDokunma = { x, y, zaman: olay.timeStamp }
          }
          break
      }
      if (isaretci.hareketli) tiklamayiYut()
      if (![...isaretciler.values()].some((i) => i.rol === 'cizim' || i.rol === 'silgi')) kilidiBirak()
    }

    const tekerlek = (olay: WheelEvent) => {
      olay.preventDefault()
      ataletiDurdur()
      kutuGuncelle()
      const g = gorunum.current
      const { dx, dy } = tekerlekFarki(olay, olcu.current.yukseklik)
      if (olay.ctrlKey || olay.metaKey) uygula(gorunumOlcekle(g, tekerlekOlcegi(g.olcek, dy), nokta(olay), olcu.current))
      else uygula(gorunumKaydir(g, -dx, -dy, olcu.current))
    }

    const tiklama = (olay: MouseEvent) => {
      if (performance.now() - tiklamaYutZamani < 500) {
        olay.stopPropagation()
        olay.preventDefault()
        tiklamaYutZamani = -Infinity
      }
    }

    const sagTik = (olay: MouseEvent) => {
      // Yüzeyde tarayıcı menüsü yok: çizgi yarıda kalmasın. Şıkta sağ tık elemedir.
      olay.preventDefault()
      if (performance.now() - sonUzunBas < 1000) return
      const hedef = olay.target instanceof Element ? olay.target.closest('[data-uzun-bas]') : null
      if (hedef && !cizilen) propsRef.current.onUzunBas(hedef)
    }

    const ayrildi = (olay: PointerEvent) => {
      if (olay.pointerType === 'mouse' && silgiHalkasi && isaretciler.size === 0) {
        silgiHalkasi = null
        cizimIste(false, true)
      }
    }

    // `pointerrawupdate` kalemin her örneğini `pointermove`un kare beklemesi
    // olmadan getiriyor (güvenli bağlamda, Chromium); yoksa `pointermove`.
    const hareketOlayi = 'onpointerrawupdate' in window ? 'pointerrawupdate' : 'pointermove'
    const yukariDinle = (olay: PointerEvent) => yukari(olay, false)
    const iptalDinle = (olay: PointerEvent) => yukari(olay, true)
    alan.addEventListener('pointerdown', asagi)
    alan.addEventListener(hareketOlayi, hareket as EventListener)
    alan.addEventListener('pointerup', yukariDinle)
    alan.addEventListener('pointercancel', iptalDinle)
    alan.addEventListener('pointerleave', ayrildi)
    alan.addEventListener('wheel', tekerlek, { passive: false })
    alan.addEventListener('click', tiklama, true)
    alan.addEventListener('contextmenu', sagTik)

    // ── Ölçü, tema ─────────────────────────────────────────────────────────
    const olcGozlemcisi = new ResizeObserver(() => {
      const genislik = alan.clientWidth
      const yukseklik = alan.clientHeight
      const boyutDegisti = genislik !== olcu.current.genislik || yukseklik !== olcu.current.yukseklik
      olcu.current = {
        genislik,
        yukseklik,
        icerikYukseklik: icerik.offsetHeight,
      }
      alan.style.setProperty('--gorus-yuksekligi', `${yukseklik}px`)
      if (boyutDegisti || oran !== window.devicePixelRatio) tuvalleriBoyutla()
      uygula(gorunum.current)
    })
    olcGozlemcisi.observe(alan)
    olcGozlemcisi.observe(icerik)

    const temaGozlemcisi = new MutationObserver(() => {
      renkleriOku()
      cizimIste(true, true)
    })
    temaGozlemcisi.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-tema'],
    })

    const yumusakKaydir = (dy: number) => {
      ataletiDurdur()
      const bas = gorunum.current
      const hedef = gorunumKaydir(bas, 0, -dy, olcu.current)
      const baslangic = performance.now()
      const adim = (zaman: number) => {
        const ilerleme = Math.min(1, (zaman - baslangic) / 260)
        const egri = 1 - (1 - ilerleme) ** 3
        uygula({ ...bas, y: bas.y + (hedef.y - bas.y) * egri })
        ataletKimligi = ilerleme < 1 ? requestAnimationFrame(adim) : 0
      }
      ataletKimligi = requestAnimationFrame(adim)
    }
    const gorunurYap = (oge: Element) => {
      kutuGuncelle()
      const dikdortgen = oge.getBoundingClientRect()
      const ust = (dikdortgen.top - kutu.top) / kutu.oran
      const alt = (dikdortgen.bottom - kutu.top) / kutu.oran
      const yukseklik = olcu.current.yukseklik
      if (alt <= yukseklik - 12) return
      const dy = Math.min(alt - yukseklik + 16, ust - 12)
      if (dy > 4) yumusakKaydir(dy)
    }

    islevler.current = {
      uygula,
      gorunurYap,
      ciz: () => cizimIste(true, false),
      sifirla: () => {
        ataletiDurdur()
        cizimiBitir(false)
        silinecek.clear()
        isaretciler.clear()
        kistirmaOnceki = null
        kilidiBirak()
        uygula(GORUNUM_BASI)
        cizimIste(true, true)
      },
    }

    return () => {
      alan.removeEventListener('pointerdown', asagi)
      alan.removeEventListener(hareketOlayi, hareket as EventListener)
      alan.removeEventListener('pointerup', yukariDinle)
      alan.removeEventListener('pointercancel', iptalDinle)
      alan.removeEventListener('pointerleave', ayrildi)
      alan.removeEventListener('wheel', tekerlek)
      alan.removeEventListener('click', tiklama, true)
      alan.removeEventListener('contextmenu', sagTik)
      olcGozlemcisi.disconnect()
      temaGozlemcisi.disconnect()
      ataletiDurdur()
      uzunBasiIptal()
      window.clearTimeout(cubukZamanlayici)
      if (cizimIstendi) cancelAnimationFrame(cizimIstendi)
      kilidiBirak()
      islevler.current = null
    }
  }, [])

  // Çizgiler değişti (ekleme, silme, geri al): kalıcı tuval yeniden.
  useEffect(() => {
    islevler.current?.ciz()
  }, [props.cizgiler])

  // Soru değişti: en üstten, %100; kısa kayma geçişi.
  useLayoutEffect(() => {
    islevler.current?.sifirla()
    const kayan = kayanRef.current
    if (!kayan || !props.gecisYonu) return
    kayan.classList.remove('soru-gecis-ileri', 'soru-gecis-geri')
    void kayan.offsetWidth
    kayan.classList.add(props.gecisYonu === 'ileri' ? 'soru-gecis-ileri' : 'soru-gecis-geri')
    // Geçiş yönü yalnız anahtarla birlikte okunur.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.sayfaAnahtari])

  return (
    <div
      ref={alanRef}
      className="relative min-h-0 flex-1 overflow-hidden overscroll-none"
      style={{
        touchAction: 'none',
        cursor: props.arac === 'el' ? 'grab' : 'crosshair',
      }}
    >
      <div ref={kayanRef} className="absolute inset-0">
        <div ref={icerikRef} className="absolute top-0 left-0 w-full origin-top-left">
          {props.children}
          {/* Karalama boşluğu: şıkların altında en az bir ekran boyu ızgarasız alan. */}
          <div aria-hidden style={{ height: 'var(--gorus-yuksekligi, 100dvh)' }} />
        </div>
        <canvas ref={kaliciRef} aria-hidden className="pointer-events-none absolute top-0 left-0" />
        <canvas ref={canliRef} aria-hidden className="pointer-events-none absolute top-0 left-0" />
      </div>
      <div
        ref={cubukRef}
        aria-hidden
        className="pointer-events-none absolute top-0 right-0.5 w-1 rounded-full bg-muted-foreground/45 opacity-0 transition-opacity duration-300"
      />
      {olcek > 1.01 && (
        <button
          type="button"
          onClick={yakinligiSifirla}
          aria-label="Yakınlığı sıfırla"
          className="golge-kart absolute top-2 right-2 z-10 flex h-11 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-[13px] font-extrabold text-foreground active:scale-95"
        >
          <span className="rakam">%{Math.round(olcek * 100)}</span>
          <span aria-hidden className="text-muted-foreground">
            ✕
          </span>
        </button>
      )}
    </div>
  )
})
