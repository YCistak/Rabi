'use client'

import { useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import type { Sekme } from './gezinme'
import { ekranGoruntusu } from './geri-kaydirma'

/**
 * Ana menüde parmakla yana kaydırarak komşu sekmeye geçmek — Instagram'daki
 * gibi.
 *
 * Kullanıcı bunu üç kez istedi. İlk sürüm yalnızca parmak kalkınca karar
 * veriyordu: 70 pikselden uzun, 0,7 saniyeden kısa, neredeyse düz bir
 * hareket gerekiyordu ve hareket herhangi bir yatay kayan kutunun içinde
 * başladıysa hiç sayılmıyordu. Sayfa parmağı izlemediği için kullanıcı
 * hareketin tanınıp tanınmadığını göremiyordu; yavaş ya da hafif eğik bir
 * kaydırma hiçbir şey yapmıyordu ve özellik "yok" sanıldı.
 *
 * Şimdi parmak yatay yöne kilitlenince sayfa **parmakla birlikte kayıyor**
 * ve komşu sekme yandan görünüyor (daha önce açıldıysa görüntüsüyle,
 * `ekranGoruntusu`; açılmadıysa boş zemin). Bırakınca karar mesafe ya da
 * hızla veriliyor (`birakmaKarari`): ekranın üçte birini geçen ya da hızlı
 * savrulan hareket sekmeyi değiştiriyor, kalanı yaylanıp yerine dönüyor.
 * Uçtaki sekmede (Ana Sayfa'nın solu, Ayarlar'ın sağı) sayfa direnerek az
 * kayıyor ve geri dönüyor.
 *
 * Yön, sayfalı ekranların yönü: parmak **sağa** giderse soldaki sekme,
 * **sola** giderse sağdaki.
 *
 * Yalnızca alt menünün beş sekmesinin kendi ekranlarında çalışıyor; bir
 * araç, form, oyun, deste ya da açık bir pencere varken kapalı (çağıran
 * `etkin` ile söylüyor). Kenardan başlayan hareket sayılmıyor: iOS'ta sol
 * kenar geri kaydırma, Android'de iki kenar sistemin geri hareketi.
 *
 * Yatay kayan bir şeridin içinden başlayan hareket önce şeridi kaydırıyor;
 * şerit o yönde sonuna gelmişse sekme kayıyor. İlk sürüm şeridin içini
 * tümüyle yasaklıyordu. Dikey kayan sayfa kabı da `overflow-x`i `auto`
 * hesaplanan bir öğe ve birkaç piksel taşması varsa bütün ekranı "yatay
 * şerit" sayıyordu — yalnızca yatayda kayan kutular şerit sayılıyor.
 */

export {
  SEKME_SIRASI,
  KENAR_PAYI,
  KILIT_YOLU,
  YATAYLIK,
  GECIS_ORANI,
  SAVRULMA_HIZI,
  SAVRULMA_YOLU,
  DIRENC,
  komsuSekme,
  hedefYonu,
  birakmaKarari,
} from './sekme-kaydirma-hesap'
import {
  DIRENC,
  KENAR_PAYI,
  KILIT_YOLU,
  YATAYLIK,
  birakmaKarari,
  hedefYonu,
  komsuSekme,
} from './sekme-kaydirma-hesap'

/**
 * Yeni sekmenin nasıl geleceği. Ekran kurulurken bir kez okunuyor
 * (`SayfaGecisi`): `'yerinde'` sürükleme sayfayı zaten yerine getirdi,
 * hareketsiz; `'sag'`/`'sol'` o yandan kayarak (komşunun görüntüsü yoktu).
 */
let yon: { taraf: 'sol' | 'sag' | 'yerinde'; zaman: number } | null = null
const YON_OMRU_MS = 400

export function sekmeGecisYonu(): 'sol' | 'sag' | 'yerinde' | null {
  if (!yon || typeof performance === 'undefined' || performance.now() - yon.zaman >= YON_OMRU_MS) return null
  return yon.taraf
}

function olcek(): number {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--olcek'))
  return Number.isFinite(v) && v > 0 ? v : 1
}

/**
 * Hedefin içinde, parmağın gittiği yöne hâlâ kayabilen yatay bir şerit var
 * mı. `dx` parmağın yolu: parmak sola gidiyorsa (dx < 0) şerit sağa kayar.
 */
function seritKayabilir(hedef: EventTarget | null, dx: number): boolean {
  let el = hedef instanceof Element ? hedef : null
  while (el && el !== document.body) {
    if (el instanceof HTMLElement && el.scrollWidth > el.clientWidth + 1) {
      const cs = getComputedStyle(el)
      const yatay = cs.overflowX === 'auto' || cs.overflowX === 'scroll'
      const dikey = cs.overflowY === 'auto' || cs.overflowY === 'scroll'
      if (yatay && !dikey) {
        const enCok = el.scrollWidth - el.clientWidth
        if (dx < 0 && el.scrollLeft < enCok - 1) return true
        if (dx > 0 && el.scrollLeft > 1) return true
      }
    }
    el = el.parentElement
  }
  return false
}

/** Kaydırarak sekme değiştirmeyi dinler. */
export function useSekmeKaydirma(
  sekme: Sekme,
  /** Her dokunuşta soruluyor: açılan bir pencere AppShell'i yeniden çizmiyor. */
  etkin: () => boolean,
  sekmeyeGec: (sekme: Sekme) => void,
) {
  const durum = useRef({ sekme, etkin, sekmeyeGec })
  durum.current = { sekme, etkin, sekmeyeGec }

  useEffect(() => {
    type Hareket = {
      x: number
      y: number
      hedef: EventTarget | null
      /** null: yön henüz belli değil; false: dikey/şerit, bırakıldı. */
      kilit: boolean | null
      kutu: HTMLElement | null
      onizleme: HTMLElement | null
      komsu: Sekme | null
      /** Komşunun hangi yanda olduğu, önizleme o yöne göre kuruldu. */
      komsuYonu: -1 | 1 | 0
      olcek: number
      genislik: number
      izler: { x: number; t: number }[]
      sabitler: { el: HTMLElement; eski: string }[]
    }
    let h: Hareket | null = null
    let animasyon = false

    const azaltilmis = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onizlemeKur = (hareket: Hareket, komsu: Sekme | null, yonu: -1 | 1) => {
      hareket.onizleme?.remove()
      hareket.onizleme = null
      hareket.komsuYonu = yonu
      const kap = hareket.kutu?.parentElement
      if (!kap) return
      const alt = document.createElement('div')
      alt.className = 'geri-onizleme'
      alt.setAttribute('aria-hidden', 'true')
      alt.inert = true
      const goruntu = komsu ? ekranGoruntusu(`sekme:${komsu}`) : undefined
      if (goruntu) {
        const ic = document.createElement('div')
        ic.className = kap.className
        ic.appendChild(goruntu.cloneNode(true))
        alt.appendChild(ic)
      }
      document.body.prepend(alt)
      hareket.onizleme = alt
    }

    /** Sayfayı ve komşuyu `dx` (ekran pikseli) kadar kaydırır. */
    const konumla = (hareket: Hareket, dx: number) => {
      const o = hareket.olcek
      if (hareket.kutu) hareket.kutu.style.transform = `translate3d(${dx / o}px,0,0)`
      if (hareket.onizleme) {
        const G = hareket.genislik
        const x = hareket.komsuYonu === -1 ? dx - G : G + dx
        hareket.onizleme.style.transform = `translate3d(${x / o}px,0,0)`
      }
    }

    const temizle = (hareket: Hareket) => {
      hareket.onizleme?.remove()
      if (hareket.kutu) {
        hareket.kutu.style.removeProperty('transform')
        hareket.kutu.style.removeProperty('transition')
        hareket.kutu.style.removeProperty('animation')
        hareket.kutu.style.removeProperty('will-change')
      }
      hareket.sabitler.forEach(({ el, eski }) => (el.style.visibility = eski))
    }

    const basla = (olay: TouchEvent) => {
      h = null
      if (animasyon || !durum.current.etkin() || olay.touches.length !== 1) return
      const t = olay.touches[0]
      if (t.clientX < KENAR_PAYI || t.clientX > window.innerWidth - KENAR_PAYI) return
      const hedef = olay.target instanceof Element ? olay.target : null
      if (hedef?.closest('input, textarea, select, [contenteditable], nav, [data-sekme-kaydirma-yok]')) return
      h = {
        x: t.clientX,
        y: t.clientY,
        hedef: olay.target,
        kilit: null,
        kutu: null,
        onizleme: null,
        komsu: null,
        komsuYonu: 0,
        olcek: 1,
        genislik: window.innerWidth,
        izler: [{ x: t.clientX, t: performance.now() }],
        sabitler: [],
      }
    }

    const ilerle = (olay: TouchEvent) => {
      const hareket = h
      if (!hareket || hareket.kilit === false) return
      const t = olay.touches[0]
      if (!t) return
      const dx = t.clientX - hareket.x
      const dy = t.clientY - hareket.y

      if (hareket.kilit === null) {
        if (Math.abs(dx) < KILIT_YOLU && Math.abs(dy) < KILIT_YOLU) return
        if (Math.abs(dx) < Math.abs(dy) * YATAYLIK || seritKayabilir(hareket.hedef, dx) || !durum.current.etkin()) {
          hareket.kilit = false
          return
        }
        const kutu = document.querySelector<HTMLElement>('[data-geri-sayfa]')
        if (!kutu) {
          hareket.kilit = false
          return
        }
        hareket.kilit = true
        hareket.kutu = kutu
        hareket.olcek = olcek()
        // Kilit anından ölçülüyor: ilk on piksel sayfayı sıçratmasın.
        hareket.x = t.clientX
        // Giriş animasyonu sürerken transformu eziyor; transformlu kutunun
        // içindeki `fixed` öğeler de kutuya göre konumlanırdı.
        kutu.style.animation = 'none'
        kutu.style.transition = 'none'
        kutu.style.willChange = 'transform'
        hareket.sabitler = [...kutu.querySelectorAll<HTMLElement>('.fixed')]
          .filter((x) => getComputedStyle(x).position === 'fixed')
          .map((el) => {
            const eski = el.style.visibility
            el.style.visibility = 'hidden'
            return { el, eski }
          })
      }

      // Kilitliyken sayfa dikeyde kaymasın.
      if (olay.cancelable) olay.preventDefault()
      const yol = t.clientX - hareket.x
      const yonu = hedefYonu(yol)
      if (hareket.komsuYonu !== yonu) {
        hareket.komsu = komsuSekme(durum.current.sekme, yonu)
        onizlemeKur(hareket, hareket.komsu, yonu)
      }
      konumla(hareket, hareket.komsu ? yol : yol * DIRENC)
      hareket.izler.push({ x: t.clientX, t: performance.now() })
      if (hareket.izler.length > 6) hareket.izler.shift()
    }

    const bitir = (olay: TouchEvent) => {
      const hareket = h
      h = null
      if (!hareket || !hareket.kilit) return
      const t = olay.changedTouches[0]
      const sonX = t ? t.clientX : hareket.izler[hareket.izler.length - 1].x
      const yol = sonX - hareket.x
      const ilk = hareket.izler[0]
      const son = { x: sonX, t: performance.now() }
      const hiz = son.t > ilk.t ? (son.x - ilk.x) / (son.t - ilk.t) : 0
      const yonu = hedefYonu(yol)
      const hedef = hareket.komsuYonu === yonu ? hareket.komsu : null
      const gec = hedef !== null && birakmaKarari(yol, hiz, hareket.genislik)
      const sure = azaltilmis() ? 0 : 230
      const egri = 'cubic-bezier(0.2, 0.75, 0.3, 1)'

      const animasyonla = (hedefDx: number, sonra: () => void) => {
        if (sure === 0) {
          sonra()
          return
        }
        animasyon = true
        for (const el of [hareket.kutu, hareket.onizleme]) {
          if (el) el.style.transition = `transform ${sure}ms ${egri}`
        }
        konumla(hareket, hedefDx)
        window.setTimeout(() => {
          animasyon = false
          sonra()
        }, sure + 20)
      }

      if (gec && hedef) {
        const goruntuVar = !!hareket.onizleme?.firstChild
        animasyonla(yonu === -1 ? hareket.genislik : -hareket.genislik, () => {
          // Görüntü yerine oturduysa yeni sekme hareketsiz geliyor; görüntü
          // yoksa boş zemin kaydı, sekme o yandan kayarak giriyor.
          yon = {
            taraf: goruntuVar ? 'yerinde' : yonu === 1 ? 'sag' : 'sol',
            zaman: performance.now(),
          }
          flushSync(() => durum.current.sekmeyeGec(hedef))
          temizle(hareket)
          window.scrollTo(0, 0)
        })
      } else {
        animasyonla(0, () => temizle(hareket))
      }
    }

    const iptal = () => {
      const hareket = h
      h = null
      if (hareket?.kilit) temizle(hareket)
    }

    window.addEventListener('touchstart', basla, { passive: true })
    // Pasif değil: yön yataya kilitlenince sayfanın dikey kaymasını durduruyor.
    window.addEventListener('touchmove', ilerle, { passive: false })
    window.addEventListener('touchend', bitir, { passive: true })
    window.addEventListener('touchcancel', iptal, { passive: true })
    return () => {
      window.removeEventListener('touchstart', basla)
      window.removeEventListener('touchmove', ilerle)
      window.removeEventListener('touchend', bitir)
      window.removeEventListener('touchcancel', iptal)
      if (h?.kilit) temizle(h)
    }
  }, [])
}
