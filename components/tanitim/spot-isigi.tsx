'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Buton } from '@/components/ui'
import { TANITIM_ADIMLARI } from '@/lib/tanitim'
import { useTanitim } from './tanitim-baglami'

type Kutu = { sol: number; ust: number; genislik: number; yukseklik: number }
type Yerlesim = { hedef: Kutu | null; balon: Kutu; ekran: Kutu }
const BOS_KUTU: Kutu = { sol: 0, ust: 0, genislik: 0, yukseklik: 0 }
const ODAK_SECICI = 'button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]'

export function SpotIsigi() {
  const { adim, aktifAdim, sonrakiAdimaGec, oncekiAdimaDon, turuBitir } = useTanitim()
  const [yerlesim, setYerlesim] = useState<Yerlesim>({ hedef: null, balon: BOS_KUTU, ekran: BOS_KUTU })
  const [hedefEksik, setHedefEksik] = useState(false)
  const balonRef = useRef<HTMLDivElement>(null)
  const katmanRef = useRef<HTMLDivElement>(null)
  const guvenliAlanRef = useRef<HTMLDivElement>(null)
  const maske = useId().replace(/:/g, '')

  useLayoutEffect(() => {
    if (!adim) return
    let kare = 0
    let hedef: HTMLElement | null = null
    let kaydirildi = false
    let sonGorunum = ''
    let eksikBaslangici: number | null = null
    let eksikGosterildi = false
    let son = ''
    const oncekiOdak = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dokunulmazlar = new Map<HTMLElement, boolean>()
    const hedefiBul = () => document.querySelector<HTMLElement>(`[data-tanitim="${adim.hedef}"]`)
    const kilitleriBirak = () => {
      for (const [oge, onceki] of dokunulmazlar) oge.inert = onceki
      dokunulmazlar.clear()
    }
    const kilitle = (oge: HTMLElement) => {
      if (oge === katmanRef.current || oge === hedef) return
      if (oge.contains(katmanRef.current) || (hedef && oge.contains(hedef))) {
        for (const cocuk of oge.children) if (cocuk instanceof HTMLElement) kilitle(cocuk)
      } else if (!dokunulmazlar.has(oge)) {
        dokunulmazlar.set(oge, oge.inert)
        oge.inert = true
      }
    }
    const olc = () => {
      const bulunan = hedefiBul()
      if (bulunan !== hedef) {
        kilitleriBirak()
        hedef = bulunan
        kaydirildi = false
      }
      for (const cocuk of document.body.children) if (cocuk instanceof HTMLElement) kilitle(cocuk)
      const gorunum = window.visualViewport
      const ekran = { sol: gorunum?.offsetLeft ?? 0, ust: gorunum?.offsetTop ?? 0, genislik: gorunum?.width ?? window.innerWidth, yukseklik: gorunum?.height ?? window.innerHeight }
      const guvenli = guvenliAlanRef.current ? getComputedStyle(guvenliAlanRef.current) : null
      const ustSinir = ekran.ust + (parseFloat(guvenli?.paddingTop ?? '0') || 0) + 12
      const altSinir = ekran.ust + ekran.yukseklik - (parseFloat(guvenli?.paddingBottom ?? '0') || 0) - 12
      const gorunumImzasi = `${ekran.genislik}:${ekran.yukseklik}:${ustSinir}:${altSinir}`
      if (sonGorunum !== gorunumImzasi) { sonGorunum = gorunumImzasi; kaydirildi = false }
      let balonGenisligi = Math.min(340, ekran.genislik - 24)
      const balonYuksekligi = balonRef.current?.getBoundingClientRect().height ?? 230
      let kutu: Kutu | null = null
      if (hedef) {
        let dikdortgen = hedef.getBoundingClientRect()
        if (dikdortgen.width > 0 && dikdortgen.height > 0) {
          if (!kaydirildi) {
            hedef.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' })
            dikdortgen = hedef.getBoundingClientRect()
            // Balon ve hedef kısa telefonlarda üst üste binmesin.
            const alttaYer = altSinir - dikdortgen.bottom
            const ustteYer = dikdortgen.top - ustSinir
            if (Math.max(alttaYer, ustteYer) < balonYuksekligi + 20 && ekran.genislik < 700) {
              window.scrollBy({ top: dikdortgen.top - ustSinir - 8, behavior: 'instant' })
              dikdortgen = hedef.getBoundingClientRect()
            }
            kaydirildi = true
          }
          const sol = Math.max(ekran.sol + 4, dikdortgen.left - 5)
          const ust = Math.max(ustSinir - 8, dikdortgen.top - 5)
          const sag = Math.min(ekran.sol + ekran.genislik - 4, dikdortgen.right + 5)
          const alt = Math.min(altSinir + 8, dikdortgen.bottom + 5)
          if (sag > sol && alt > ust) kutu = { sol, ust, genislik: sag - sol, yukseklik: alt - ust }
        }
      }
      let balonSol = ekran.sol + (ekran.genislik - balonGenisligi) / 2
      let balonUst = altSinir - balonYuksekligi
      if (kutu) {
        const alt = kutu.ust + kutu.yukseklik
        const solBosluk = kutu.sol - ekran.sol
        const sagBosluk = ekran.sol + ekran.genislik - kutu.sol - kutu.genislik
        // Yatay telefonda balon yanda, kendi içinde kaydırılabilir kalır.
        if (ekran.genislik > ekran.yukseklik && Math.max(solBosluk, sagBosluk) >= 188) {
          balonGenisligi = Math.min(340, Math.max(solBosluk, sagBosluk) - 28)
        }
        if (ekran.sol + ekran.genislik - kutu.sol - kutu.genislik >= balonGenisligi + 28) {
          balonSol = kutu.sol + kutu.genislik + 16
          balonUst = kutu.ust
        } else if (kutu.sol - ekran.sol >= balonGenisligi + 28) {
          balonSol = kutu.sol - balonGenisligi - 16
          balonUst = kutu.ust
        } else if (altSinir - alt >= balonYuksekligi + 16) balonUst = alt + 16
        else if (kutu.ust - ustSinir >= balonYuksekligi + 16) balonUst = kutu.ust - balonYuksekligi - 16
        else balonUst = alt + 12
      }
      const yeni = { hedef: kutu, ekran, balon: { sol: balonSol, ust: Math.max(ustSinir, Math.min(balonUst, altSinir - balonYuksekligi)), genislik: balonGenisligi, yukseklik: balonYuksekligi } }
      const imza = JSON.stringify(yeni)
      if (imza !== son) { son = imza; setYerlesim(yeni) }
      if (kutu) eksikBaslangici = null
      else if (eksikBaslangici === null) eksikBaslangici = Date.now()
      const eksik = eksikBaslangici !== null && Date.now() - eksikBaslangici >= 5000
      if (eksik !== eksikGosterildi) { eksikGosterildi = eksik; setHedefEksik(eksik) }
      kare = requestAnimationFrame(olc)
    }
    const izinli = (oge: EventTarget | null) => oge instanceof Node && (balonRef.current?.contains(oge) || (adim.tiklamali && hedef?.contains(oge)))
    const engelle = (olay: Event) => {
      if (!izinli(olay.target)) { olay.preventDefault(); olay.stopImmediatePropagation() }
    }
    const odaklan = () => balonRef.current?.querySelector<HTMLElement>('[data-tanitim-baslik]')?.focus({ preventScroll: true })
    const odagiKoru = (olay: FocusEvent) => { if (!izinli(olay.target)) odaklan() }
    const tusuYakala = (olay: KeyboardEvent) => {
      if (olay.key === 'Escape') { olay.preventDefault(); olay.stopImmediatePropagation(); turuBitir(); return }
      if (olay.key !== 'Tab') { if (['Enter', ' '].includes(olay.key)) engelle(olay); return }
      const odaklar = [
        ...(adim.tiklamali && hedef ? Array.from(hedef.matches(ODAK_SECICI) ? [hedef] : hedef.querySelectorAll<HTMLElement>(ODAK_SECICI)) : []),
        ...Array.from(balonRef.current?.querySelectorAll<HTMLElement>(ODAK_SECICI) ?? []),
      ].filter((oge) => !oge.closest('[inert]') && oge.getClientRects().length > 0)
      olay.preventDefault()
      olay.stopImmediatePropagation()
      if (!odaklar.length) return
      const sira = odaklar.indexOf(document.activeElement as HTMLElement)
      const yeni = sira === -1 ? (olay.shiftKey ? odaklar.length - 1 : 0) : (sira + (olay.shiftKey ? -1 : 1) + odaklar.length) % odaklar.length
      odaklar[yeni].focus({ preventScroll: true })
      if (balonRef.current?.contains(odaklar[yeni])) odaklar[yeni].scrollIntoView({ block: 'nearest', behavior: 'instant' })
    }
    setHedefEksik(false)
    olc()
    odaklan()
    const olaylar = ['pointerdown', 'mousedown', 'touchstart', 'click', 'dblclick', 'contextmenu']
    for (const olay of olaylar) document.addEventListener(olay, engelle, { capture: true, passive: false })
    document.addEventListener('keydown', tusuYakala, true)
    document.addEventListener('focusin', odagiKoru, true)
    return () => {
      cancelAnimationFrame(kare)
      for (const olay of olaylar) document.removeEventListener(olay, engelle, true)
      document.removeEventListener('keydown', tusuYakala, true)
      document.removeEventListener('focusin', odagiKoru, true)
      kilitleriBirak()
      if (oncekiOdak?.isConnected) oncekiOdak.focus({ preventScroll: true })
    }
  }, [adim, turuBitir])

  // Sayfa yenilenince bellekteki demo kendiliğinden kaybolur; kalıcı kayıt yok.
  useEffect(() => {
    if (!adim) setYerlesim({ hedef: null, balon: BOS_KUTU, ekran: BOS_KUTU })
  }, [adim])

  if (!adim || typeof document === 'undefined') return null
  const { hedef, balon, ekran } = yerlesim
  return createPortal(
    <div ref={katmanRef} className="pointer-events-none fixed inset-0 z-[10000]">
      <div ref={guvenliAlanRef} aria-hidden className="invisible absolute" style={{ paddingTop: 'var(--guvenli-ust)', paddingBottom: 'var(--guvenli-alt)' }} />
      <svg aria-hidden className="absolute inset-0 h-full w-full">
        <defs><mask id={maske}><rect width="100%" height="100%" fill="white" />{hedef && <rect x={hedef.sol} y={hedef.ust} width={hedef.genislik} height={hedef.yukseklik} rx="18" fill="black" />}</mask></defs>
        <rect width="100%" height="100%" fill="var(--foreground)" opacity="0.58" mask={`url(#${maske})`} />
        {hedef && <rect x={hedef.sol} y={hedef.ust} width={hedef.genislik} height={hedef.yukseklik} rx="18" fill="none" stroke="var(--primary-parlak)" strokeWidth="2" />}
      </svg>
      <div ref={balonRef} data-tanitim-balonu role="region" aria-label="Rabi tanıtım rehberi"
        className="pointer-events-auto absolute overflow-y-auto rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-xl"
        style={{ left: balon.sol || 12, top: balon.ust || 12, width: balon.genislik || 'calc(100% - 24px)', maxWidth: 340, maxHeight: ekran.yukseklik ? Math.max(120, ekran.yukseklik * 0.52) : '52dvh', visibility: ekran.genislik ? 'visible' : 'hidden' }}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[11px] font-extrabold tracking-wide text-primary">RABİ’Yİ TANI · {(aktifAdim ?? 0) + 1}/{TANITIM_ADIMLARI.length}</span>
          <button type="button" onClick={turuBitir} className="min-h-9 rounded-lg px-2 text-xs font-bold text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring">Turu Geç</button>
        </div>
        <h2 data-tanitim-baslik tabIndex={-1} className="font-display text-lg font-extrabold outline-none">{adim.baslik}</h2>
        <p aria-live="polite" className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{hedefEksik ? 'Bu adımın bileşeni bulunamadı. Geri dönerek yeniden deneyebilir veya turu geçebilirsin.' : adim.aciklama}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Buton type="button" bicim="ikincil" boy="kucuk" disabled={aktifAdim === 0} onClick={oncekiAdimaDon}>Geri</Buton>
          {adim.kimlik === 'banka' ? <Buton type="button" boy="kucuk" onClick={turuBitir}>Turu Bitir</Buton> : adim.tiklamali ? <span className="text-right text-xs font-bold text-primary">Aydınlatılan alana dokun</span> : <Buton type="button" boy="kucuk" disabled={!hedef || hedefEksik} onClick={sonrakiAdimaGec}>{adim.kimlik === 'pomodoro' ? 'Ana sayfaya dön' : adim.kimlik === 'sonuc' ? 'Bankayı gör' : 'İleri'}</Buton>}
        </div>
      </div>
    </div>, document.body,
  )
}
