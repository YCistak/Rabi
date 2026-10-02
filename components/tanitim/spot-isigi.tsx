'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Buton } from '@/components/ui'
import { useTanitim } from './tanitim-baglami'

type Kutu = { sol: number; ust: number; genislik: number; yukseklik: number }
type Yerlesim = { ekHedefler: Kutu[]; hedef: Kutu | null; balon: Kutu; ekran: Kutu }
const BOS_KUTU: Kutu = { sol: 0, ust: 0, genislik: 0, yukseklik: 0 }
const ODAK_SECICI = 'button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]'

/*
  Ekran koordinatlarını katmanın kendi CSS pikseline çeviren dönüşüm.

  Tablette `body`de `zoom: var(--olcek)` var (`app/layout.tsx`, iPad'de 1,2)
  ve katman `body`ye portal edildiği için o da büyütülüyor. Hem WebKit hem
  Chromium'da `getBoundingClientRect`, `innerWidth` ve `visualViewport`
  ekran pikseli döndürüyor; katmana yazılan `left`/`top` ve SVG `x`/`y` ise
  büyütülmüş koordinatta çiziliyor. Ölçüleni olduğu gibi yazınca her şey
  ölçek kadar sağa-aşağı kayıyordu: iPad'de delik hedeften ~140 px uzakta,
  balon ekranın dışındaydı.

  Ölçek `--olcek`ten okunmuyor, katmanın kendisinden ölçülüyor: katman ekranı
  kaplıyor, ekrandaki genişliği (`getBoundingClientRect`) ile kendi CSS
  genişliği (`getComputedStyle`) arasındaki oran, motor zoom'u nasıl
  raporlarsa raporlasın çizim ile ölçüm arasındaki gerçek oran. Telefonda 1.
*/
type Donusum = { olcek: number; sol: number; ust: number }
function katmanDonusumu(katman: HTMLElement | null): Donusum {
  if (!katman) return { olcek: 1, sol: 0, ust: 0 }
  const ekranda = katman.getBoundingClientRect()
  const kendi = parseFloat(getComputedStyle(katman).width)
  const olcek = kendi > 0 && ekranda.width > 0 ? ekranda.width / kendi : 1
  return { olcek, sol: ekranda.left, ust: ekranda.top }
}
function yereleCevir(alan: DOMRect, { olcek, sol, ust }: Donusum) {
  const left = (alan.left - sol) / olcek
  const top = (alan.top - ust) / olcek
  return { left, top, right: left + alan.width / olcek, bottom: top + alan.height / olcek, width: alan.width / olcek, height: alan.height / olcek }
}

const KISA_KAYDIRMA = 0.6
const azaltilmisHareket = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function SpotIsigi() {
  const { adim, animasyon, deneyMi, rehberGizli, aktifTur, adimSayisi, gecisSuruyor, aktifAdim, sonrakiAdimaGec, oncekiAdimaDon, turuBitir } = useTanitim()
  const [yerlesim, setYerlesim] = useState<Yerlesim>({ ekHedefler: [], hedef: null, balon: BOS_KUTU, ekran: BOS_KUTU })
  const [cizimBasladi, setCizimBasladi] = useState(false)
  useEffect(() => { setCizimBasladi(false); const zaman = setTimeout(() => setCizimBasladi(true), 32); return () => clearTimeout(zaman) }, [adim, rehberGizli])
  const [hedefEksik, setHedefEksik] = useState(false)
  const balonRef = useRef<HTMLDivElement>(null)
  const katmanRef = useRef<HTMLDivElement>(null)
  const guvenliAlanRef = useRef<HTMLDivElement>(null)
  const maske = useId().replace(/:/g, '')

  useLayoutEffect(() => {
    if (!adim || rehberGizli) return
    const etkilesimAcik = adim.tiklamali || ('etkilesimli' in adim && adim.etkilesimli)
    let kare = 0
    let hedef: HTMLElement | null = null
    let kaydirildi = false
    let kaydirmaBaslangici = 0
    let oncekiUst = Number.NaN
    let durgunKare = 0
    let duzeltildi = false
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
    const denetim = deneyMi ? document.querySelector<HTMLElement>('[data-tanitim-denetimi]') : null
    const kilitle = (oge: HTMLElement) => {
      if (oge === katmanRef.current || oge === hedef || oge === denetim) return
      if (oge.contains(katmanRef.current) || (denetim && oge.contains(denetim)) || (hedef && oge.contains(hedef))) {
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
      // Bundan sonraki bütün ölçüler katmanın CSS pikselinde (bkz. `katmanDonusumu`).
      const donusum = katmanDonusumu(katmanRef.current)
      const k = donusum.olcek
      const gorunum = window.visualViewport
      const ekran = {
        sol: ((gorunum?.offsetLeft ?? 0) - donusum.sol) / k, ust: ((gorunum?.offsetTop ?? 0) - donusum.ust) / k,
        genislik: (gorunum?.width ?? window.innerWidth) / k, yukseklik: (gorunum?.height ?? window.innerHeight) / k,
      }
      // Güvenli alan `env()`ten ekran pikseli olarak geliyor; büyütülmüş
      // katmanda o kadar ekran pikseli `/ k` CSS pikseline denk.
      const guvenli = guvenliAlanRef.current ? getComputedStyle(guvenliAlanRef.current) : null
      const ustSinir = ekran.ust + (parseFloat(guvenli?.paddingTop ?? '0') || 0) / k + 12
      const altSinir = ekran.ust + ekran.yukseklik - (parseFloat(guvenli?.paddingBottom ?? '0') || 0) / k - 12
      const gorunumImzasi = `${ekran.genislik}:${ekran.yukseklik}:${ustSinir}:${altSinir}`
      if (sonGorunum !== gorunumImzasi) { sonGorunum = gorunumImzasi; kaydirildi = false; duzeltildi = false }
      let balonGenisligi = Math.min(340, ekran.genislik - 24)
      const balonYuksekligi = balonRef.current ? balonRef.current.getBoundingClientRect().height / k : 230
      let kutu: Kutu | null = null
      if (hedef) {
        let dikdortgen = yereleCevir(hedef.getBoundingClientRect(), donusum)
        if (dikdortgen.width > 0 && dikdortgen.height > 0) {
          if (!kaydirildi) {
            // Kısa mesafede yumuşak, uzunda anında: uzun yumuşak kaydırma adımı yavaşlatıyordu.
            const bloklama = dikdortgen.height > ekran.yukseklik * 0.55 ? 'start' : 'center'
            const hedefUst = bloklama === 'start' ? ustSinir : (ustSinir + altSinir - dikdortgen.height) / 2
            const mesafe = Math.abs(dikdortgen.top - hedefUst)
            hedef.scrollIntoView({ block: bloklama, inline: 'nearest', behavior: azaltilmisHareket() || mesafe > ekran.yukseklik * KISA_KAYDIRMA ? 'instant' : 'smooth' })
            kaydirmaBaslangici = performance.now()
            oncekiUst = Number.NaN
            durgunKare = 0
            kaydirildi = true
          }
          // Düzeltme, sabit süre yerine kaydırma durunca (üç kare aynı konum) yapılır; en fazla 600 ms beklenir.
          if (!duzeltildi) {
            const simdiki = hedef.getBoundingClientRect().top
            durgunKare = Math.abs(simdiki - oncekiUst) < 0.5 ? durgunKare + 1 : 0
            oncekiUst = simdiki
          }
          if (!duzeltildi && ((durgunKare >= 3 && performance.now() - kaydirmaBaslangici > 60) || performance.now() - kaydirmaBaslangici > 600)) {
            dikdortgen = yereleCevir(hedef.getBoundingClientRect(), donusum)
            // Balon ve hedef kısa telefonlarda üst üste binmesin.
            const alttaYer = altSinir - dikdortgen.bottom
            const ustteYer = dikdortgen.top - ustSinir
            if (Math.max(alttaYer, ustteYer) < balonYuksekligi + 20 && ekran.genislik * k < 700) {
              let kaydirmaKabi = hedef.parentElement
              while (kaydirmaKabi && !(['auto', 'scroll'].includes(getComputedStyle(kaydirmaKabi).overflowY) && kaydirmaKabi.scrollHeight > kaydirmaKabi.clientHeight)) kaydirmaKabi = kaydirmaKabi.parentElement
              // Büyütülmüş bir kabın kaydırması kendi CSS pikselinde, pencereninki
              // ekran pikselinde (WebKit ve Chromium'da ölçüldü); `zoom` yalnızca body'de.
              const fark = dikdortgen.top - ustSinir - 8
              const davranis = azaltilmisHareket() || Math.abs(fark) > ekran.yukseklik * KISA_KAYDIRMA ? 'instant' : 'smooth'
              if (kaydirmaKabi) kaydirmaKabi.scrollBy({ top: fark, behavior: davranis })
              else window.scrollBy({ top: fark * k, behavior: davranis })
              dikdortgen = yereleCevir(hedef.getBoundingClientRect(), donusum)
            }
            duzeltildi = true
          }
          // Uzun konu patikasının ilk bölümü ve ilerleme bandı birlikte görünür.
          const gorunenAlt = ['konu-haritasi'].includes(adim.kimlik) ? Math.min(dikdortgen.bottom, dikdortgen.top + ekran.yukseklik * 0.4) : dikdortgen.bottom
          const sol = Math.max(ekran.sol + 4, dikdortgen.left - 5)
          const ust = Math.max(ustSinir - 8, dikdortgen.top - 5)
          const sag = Math.min(ekran.sol + ekran.genislik - 4, dikdortgen.right + 5)
          const alt = Math.min(altSinir + 8, gorunenAlt + 5)
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
      const ekHedefler = ('ekHedefler' in adim ? adim.ekHedefler : []).flatMap((hedefAdi) => {
        const oge = document.querySelector<HTMLElement>(`[data-tanitim="${hedefAdi}"]`)
        if (!oge) return []
        const alan = yereleCevir(oge.getBoundingClientRect(), donusum)
        if (alan.bottom < ustSinir || alan.top > altSinir) return []
        return [{ sol: alan.left - 4, ust: Math.max(ustSinir, alan.top - 4), genislik: alan.width + 8, yukseklik: Math.min(altSinir, alan.bottom + 4) - Math.max(ustSinir, alan.top - 4) }]
      })
      const yeni = { ekHedefler, hedef: kutu, ekran, balon: { sol: balonSol, ust: Math.max(ustSinir, Math.min(balonUst, altSinir - balonYuksekligi)), genislik: balonGenisligi, yukseklik: balonYuksekligi } }
      const imza = JSON.stringify(yeni)
      if (imza !== son) { son = imza; setYerlesim(yeni) }
      if (kutu) eksikBaslangici = null
      else if (eksikBaslangici === null) eksikBaslangici = Date.now()
      const eksik = eksikBaslangici !== null && Date.now() - eksikBaslangici >= 5000
      if (eksik !== eksikGosterildi) { eksikGosterildi = eksik; setHedefEksik(eksik) }
      kare = requestAnimationFrame(olc)
    }
    const izinli = (oge: EventTarget | null) => oge instanceof Node && (denetim?.contains(oge) || balonRef.current?.contains(oge) || (etkilesimAcik && hedef?.contains(oge)))
    const engelle = (olay: Event) => {
      if (!izinli(olay.target)) { olay.preventDefault(); olay.stopImmediatePropagation() }
    }
    const odaklan = () => balonRef.current?.querySelector<HTMLElement>('[data-tanitim-baslik]')?.focus({ preventScroll: true })
    const odagiKoru = (olay: FocusEvent) => { if (!izinli(olay.target)) odaklan() }
    const tusuYakala = (olay: KeyboardEvent) => {
      if (olay.key === 'Escape') { olay.preventDefault(); olay.stopImmediatePropagation(); turuBitir(); return }
      if (olay.key !== 'Tab') { if (['Enter', ' '].includes(olay.key)) engelle(olay); return }
      const odaklar = [
        ...Array.from(denetim?.querySelectorAll<HTMLElement>(ODAK_SECICI) ?? []),
        ...(etkilesimAcik && hedef ? Array.from(hedef.matches(ODAK_SECICI) ? [hedef] : hedef.querySelectorAll<HTMLElement>(ODAK_SECICI)) : []),
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
  }, [adim, turuBitir, rehberGizli, deneyMi])

  /*
    Rehber açıkken sayfa elle kaydırılamaz.

    Rehber, hedefi kendisi görünür alana getiriyor (`scrollIntoView`,
    `scrollBy`); kullanıcının ayrıca kaydırması ise aydınlatılan alanı ve
    balonu birbirinden koparıyordu. Uygulama kabuğu rehber sürerken alta 60vh
    dolgu ekleyip sayfayı uzattığı için kaydırma da mümkündü.

    `overflow: hidden` programatik kaydırmayı engellemez, yalnızca kullanıcı
    kaydırmasını keser. iOS WKWebView'da ise yalnızca CSS yetmiyor (lastik bant
    ve dokunmatik kaydırma sürüyor) — bu yüzden `touchmove` ve `wheel` de
    balonun kendi içinde kaydırılabilir bir bölge dışında iptal ediliyor.
  */
  const rehberGorunur = !!adim && !rehberGizli
  useEffect(() => {
    if (!rehberGorunur) return
    const kok = document.documentElement
    const govde = document.body
    const onceki = { kok: [kok.style.overflow, kok.style.overscrollBehavior], govde: [govde.style.overflow, govde.style.overscrollBehavior] }
    kok.style.overflow = 'hidden'
    kok.style.overscrollBehavior = 'none'
    govde.style.overflow = 'hidden'
    govde.style.overscrollBehavior = 'none'
    const kaydirmayiEngelle = (olay: Event) => {
      const balon = balonRef.current
      // Balon taşıyorsa kendi içinde kaydırılabilsin; sayfaya sıçramasın diye
      // balonda `overscroll-behavior: contain` var.
      if (balon && olay.target instanceof Node && balon.contains(olay.target) && balon.scrollHeight > balon.clientHeight) return
      if (olay.cancelable) olay.preventDefault()
    }
    document.addEventListener('touchmove', kaydirmayiEngelle, { capture: true, passive: false })
    document.addEventListener('wheel', kaydirmayiEngelle, { capture: true, passive: false })
    return () => {
      document.removeEventListener('touchmove', kaydirmayiEngelle, true)
      document.removeEventListener('wheel', kaydirmayiEngelle, true)
      ;[kok.style.overflow, kok.style.overscrollBehavior] = onceki.kok
      ;[govde.style.overflow, govde.style.overscrollBehavior] = onceki.govde
    }
  }, [rehberGorunur])

  // Sayfa yenilenince bellekteki demo kendiliğinden kaybolur; kalıcı kayıt yok.
  useEffect(() => {
    if (!adim) setYerlesim({ ekHedefler: [], hedef: null, balon: BOS_KUTU, ekran: BOS_KUTU })
  }, [adim])

  if (!adim || rehberGizli || typeof document === 'undefined') return null
  const hareketAzalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const kisaBalon = ['pomodoro', 'zorluk'].includes(adim.kimlik)
  const { hedef, ekHedefler, balon, ekran } = yerlesim
  return createPortal(
    <div ref={katmanRef} className="pointer-events-none fixed inset-0 z-[10000]" style={{ opacity: gecisSuruyor ? 0 : 1, transition: hareketAzalt ? 'none' : `opacity ${animasyon.balonMs}ms ease` }}>
      <div ref={guvenliAlanRef} aria-hidden className="invisible absolute" style={{ paddingTop: 'var(--guvenli-ust)', paddingBottom: 'var(--guvenli-alt)' }} />
      <svg aria-hidden className="absolute inset-0 h-full w-full">
        <defs><mask id={maske}><rect width="100%" height="100%" fill="white" />{hedef && <rect x={hedef.sol} y={hedef.ust} width={hedef.genislik} height={hedef.yukseklik} rx="18" fill="black" style={{ opacity: gecisSuruyor || !cizimBasladi ? 0 : 1, transition: hareketAzalt ? 'none' : `opacity ${animasyon.aydinlatmaMs}ms ease ${gecisSuruyor ? 0 : animasyon.aydinlatmaGecikmesiMs}ms, x ${animasyon.cerceveMs}ms ease, y ${animasyon.cerceveMs}ms ease, width ${animasyon.cerceveMs}ms ease, height ${animasyon.cerceveMs}ms ease` }} />}{ekHedefler.map((alan, sira) => <rect key={sira} x={alan.sol} y={alan.ust} width={alan.genislik} height={alan.yukseklik} rx="18" fill="black" />)}</mask></defs>
        <rect width="100%" height="100%" fill="var(--foreground)" opacity={animasyon.karartma} mask={`url(#${maske})`} />
        {hedef && <rect x={hedef.sol} y={hedef.ust} width={hedef.genislik} height={hedef.yukseklik} rx="18" fill="none" stroke="var(--primary-parlak)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={cizimBasladi && !gecisSuruyor ? 0 : 1} style={{ transition: hareketAzalt ? "none" : `stroke-dashoffset ${animasyon.cerceveMs}ms ease, x ${animasyon.cerceveMs}ms ease, y ${animasyon.cerceveMs}ms ease, width ${animasyon.cerceveMs}ms ease, height ${animasyon.cerceveMs}ms ease` }} />}
      </svg>
      <div ref={balonRef} data-tanitim-balonu role="region" aria-label="Rabi tanıtım rehberi"
        className="pointer-events-auto absolute overflow-y-auto overscroll-contain rounded-2xl border border-border bg-card text-card-foreground shadow-xl"
        style={{ padding: adim.kimlik === 'soru-bir' ? 8 : 12, opacity: gecisSuruyor ? 0 : 1, transition: hareketAzalt ? 'none' : `left ${animasyon.balonMs}ms ease, top ${animasyon.balonMs}ms ease, opacity ${animasyon.balonMs}ms ease`, pointerEvents: gecisSuruyor ? 'none' : 'auto', left: balon.sol || 12, top: balon.ust || 12, width: balon.genislik || 'calc(100% - 24px)', maxWidth: 340, maxHeight: ekran.yukseklik ? Math.max(120, ekran.yukseklik * 0.52) : '52dvh', visibility: ekran.genislik ? 'visible' : 'hidden' }}>
        <div className="flex items-center justify-between gap-3" style={{ marginBottom: adim.kimlik === 'soru-bir' ? 0 : 8 }}>
          {adim.kimlik === 'soru-bir' && <div><h2 data-tanitim-baslik tabIndex={-1} className="font-display text-sm font-extrabold outline-none">{adim.baslik}</h2><p className="text-[11px] text-muted-foreground">Sonucu yaz veya pas geç.</p></div>}
          {adim.kimlik !== 'soru-bir' && <span className="text-[11px] font-extrabold tracking-wide text-primary">{aktifTur === 'ana_tur' ? 'RABİ’Yİ TANI' : aktifTur === 'denemeler' ? 'DENEMELER' : 'KONU HARİTASI'} · {(aktifAdim ?? 0) + 1}/{adimSayisi}</span>}
          <button type="button" onClick={turuBitir} className="min-h-11 min-w-11 rounded-lg px-2 text-xs font-bold text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring">Turu Geç</button>
        </div>
        {adim.kimlik !== 'soru-bir' && <h2 data-tanitim-baslik tabIndex={-1} className={kisaBalon ? 'font-display text-sm font-extrabold outline-none' : 'font-display text-lg font-extrabold outline-none'}>{adim.baslik}</h2>}
        {(adim.kimlik !== 'soru-bir' || hedefEksik) && <p aria-live="polite" className={kisaBalon ? 'mt-1 text-xs leading-snug text-muted-foreground' : 'mt-2 text-[13px] leading-relaxed text-muted-foreground'}>{hedefEksik ? 'Bu adımın bileşeni bulunamadı. Geri dönerek yeniden deneyebilir veya turu geçebilirsin.' : adim.kimlik === 'soru-bir' ? 'Sonucu yaz, onayla veya pas geç.' : adim.aciklama}</p>}
        {adim.kimlik !== 'soru-bir' && <div className={kisaBalon ? 'mt-2 flex items-center justify-between gap-2' : 'mt-3 flex items-center justify-between gap-2'}>
          <Buton type="button" bicim="ikincil" className="min-h-11 min-w-11" disabled={aktifAdim === 0 || gecisSuruyor} onClick={oncekiAdimaDon}>Geri</Buton>
          {aktifAdim === adimSayisi - 1 ? <Buton type="button" className="min-h-11 min-w-11" onClick={turuBitir}>Turu Bitir</Buton> : adim.tiklamali ? <span className="text-right text-xs font-bold text-primary">Aydınlatılan alana dokun</span> : <Buton type="button" className="min-h-11 min-w-11" disabled={!hedef || hedefEksik || gecisSuruyor} onClick={sonrakiAdimaGec}>{adim.kimlik === 'pomodoro-kilit' ? 'Oyunlara dön' : adim.kimlik === 'sonuc' ? 'Oyunlara dön' : 'İleri'}</Buton>}
        </div>}
      </div>
    </div>, document.body,
  )
}
