'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { adimPozu } from '@/lib/tanitim'
import { TANITIM_EGRISI, egriDegeri } from '@/lib/tanitim-animasyonu'
import { balonGenisligi, balonKonumu, durgunlukSayaci, kaydirmaKis, kaydirmaKisTam, kutuFarki, type Kutu } from '@/lib/tanitim-yerlesim'
import { taniAcikMi, taniKaydet, taniKutu } from '@/lib/tanitim-tani'
import { useTanitim } from './tanitim-baglami'

/*
  `hedef` null ise delik görünmüyor ama son çizildiği yerde (`cizilen`)
  duruyor: hedef bir an kaybolunca (ekran değişirken, oyun sonucu gelirken)
  delik sökülüp yeniden kurulduğunda geçişsiz yeni yerinde beliriyor, balon
  da ekranın dibine düşüp geri uçuyordu.

  `anlik`: bu yerleşim geçişsiz konacak (turun ilk karesi, kaybolan hedefin
  yeniden belirmesi). Bir sonraki karede kalkıyor.
*/
/*
  `sakli`: ekran değişti, yeni hedef henüz ölçülmedi — delik ve balon o arada
  görünmüyor (eski yerde kalıp yeni ekranın alakasız bir yerini aydınlatmasın).
  `belir`: her artışında delik ve balon yerinde, hafif büyüyüp belirerek açılıyor.
*/
type Yerlesim = { ekHedefler: Kutu[]; hedef: Kutu | null; cizilen: Kutu | null; balon: Kutu; ekran: Kutu; spotAnlik: boolean; balonAnlik: boolean; sakli?: boolean; belir?: number; sayfa?: Element | null }
const BOS_KUTU: Kutu = { sol: 0, ust: 0, genislik: 0, yukseklik: 0 }
const BOS_YERLESIM: Yerlesim = { ekHedefler: [], hedef: null, cizilen: null, balon: BOS_KUTU, ekran: BOS_KUTU, spotAnlik: true, balonAnlik: true }
const ODAK_SECICI = 'button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]'
/**
 * Tam ekran sistem pencerelerinin işareti (`data-sistem-penceresi`; ör.
 * çökme raporu sorusu). Bu pencereler turla aynı anda açılmamalı
 * (`lib/cokme-tanitim.ts`), ama açılırsa rehber içlerindeki dokunmayı ve
 * odağı yutmuyor: yutsaydı pencere kapanamaz, tur da ilerleyemez ve kullanıcı
 * kilitlenirdi.
 */
function sistemPenceresinde(oge: EventTarget | null): boolean {
  // Yazı düğümünden gelen olayda hedef bir `Element` değil; üst öğesine bakılıyor.
  const eleman = oge instanceof Element ? oge : oge instanceof Node ? oge.parentElement : null
  return !!eleman?.closest('[data-sistem-penceresi]')
}
/** Hedef bu kadar süre bulunamazsa delik söner (ekran değişiminin tek karesi için sönmesin). */
const KAYIP_BEKLEMESI = 400
/** Hedef kıpırdamaya devam etse de en geç bu kadar beklenip yerleşiliyor. */
const EN_UZUN_YERLESME = 700

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

/** Hedefin bütün atalarının ve pencerenin kaydırma konumu (`null` = pencere). */
type KaydirmaKaydi = { oge: Element | null; x: number; y: number }
function kaydirmalariOku(hedef: HTMLElement): KaydirmaKaydi[] {
  const kayitlar: KaydirmaKaydi[] = [{ oge: null, x: window.scrollX, y: window.scrollY }]
  for (let oge = hedef.parentElement; oge; oge = oge.parentElement) kayitlar.push({ oge, x: oge.scrollLeft, y: oge.scrollTop })
  return kayitlar
}
function kaydir({ oge, x, y }: KaydirmaKaydi) {
  if (oge) { oge.scrollLeft = x; oge.scrollTop = y }
  else window.scrollTo({ left: x, top: y, behavior: 'instant' })
}

/*
  Hedefi, üst kenarı katmanın `istenenUst` noktasına gelecek kadar kaydırır
  (katman CSS pikseli; `k` = katmanın ölçeği). `scrollIntoView` kullanılmıyor:

  - Çok sütunlu kapta (`tablet-sutunlar`, yatay iPad) WebKit, sağ sütundaki
    öğenin yerini sütunlara bölünmemiş akıştaki yerinden hesaplıyor. Ekranda
    192 px'te, tamamen görünen Yapılacaklar dilimleri için pencereyi 379 px
    kaydırıp hedefi -187 px'e, ekranın dışına itiyordu; görünen yalnızca
    "Akşam" kalıyordu.
  - `block: 'start'` hedefin üstünü ekranın 0 noktasına, durum çubuğunun
    altına koyuyordu; spot güvenli alanın altından başladığı için hedefe
    göre ~30 px aşağıda duruyordu (Pomodoro, yatay iPad).

  Kaydırma önce hedefin kaydırılabilir atalarında yapılıyor, artanı
  pencereye kalıyor. Her istek kabın gidebileceği aralığa önceden kısılıyor
  (`kaydirmaKis`): iOS'ta sınırın dışına istenen kaydırmadan hemen sonraki
  ölçüm, kenetlenmiş yeri değil istenen yeri raporluyor. Hedef sabit (`position: fixed`) bir katmandaysa (alttan
  açılan form) pencere kaydırması onu yerinden oynatmaz, yalnızca arkadaki
  sayfayı kaydırır; klavye açıkken iOS'ta da görünür alanı (visualViewport)
  hedefin altından kaçırır. İkisinde de pencereye dokunulmuyor.
*/
function hedefiKaydir(hedef: HTMLElement, istenenUst: number, k: number, pencereSerbest: boolean) {
  const ust = () => hedef.getBoundingClientRect().top / k
  let kalan = ust() - istenenUst
  for (let kab = hedef.parentElement; kab && kab !== document.body && kab !== document.documentElement; kab = kab.parentElement) {
    const stil = getComputedStyle(kab)
    if (['auto', 'scroll'].includes(stil.overflowX) && kab.scrollWidth > kab.clientWidth) {
      // Yatay şeritte hedef görünmüyorsa en yakın kenara getir ('nearest').
      const h = hedef.getBoundingClientRect(), c = kab.getBoundingClientRect()
      const yatay = h.left < c.left ? (h.left - c.left) / k : h.right > c.right ? Math.min(h.right - c.right, h.left - c.left) / k : 0
      if (yatay) kab.scrollBy({ left: kaydirmaKis(kab.scrollLeft, yatay, kab.scrollWidth - kab.clientWidth), behavior: 'instant' })
    }
    if (Math.abs(kalan) >= 0.5 && ['auto', 'scroll'].includes(stil.overflowY) && kab.scrollHeight > kab.clientHeight) {
      const once = ust()
      // Büyütülmüş kabın kaydırması kendi (katmanla aynı) CSS pikselinde.
      kab.scrollBy({ top: kaydirmaKisTam(kab.scrollTop, kalan, kab.scrollHeight - kab.clientHeight), behavior: 'instant' })
      kalan -= once - ust()
    }
    if (stil.position === 'fixed') return
  }
  // Pencerenin kaydırması ekran pikselinde (WebKit ve Chromium'da ölçüldü); `zoom` yalnızca body'de.
  if (!pencereSerbest || Math.abs(kalan) < 0.5) return
  const kok = document.scrollingElement ?? document.documentElement
  const adim = kaydirmaKisTam(window.scrollY, kalan * k, kok.scrollHeight - window.innerHeight)
  if (Math.abs(adim) >= 0.5) window.scrollBy({ top: adim, behavior: 'instant' })
}

/*
  Hedefin (ya da bir atasının) giriş animasyonu sürüyorsa ölçüm o animasyon
  bitmiş gibi yapılıyor: animasyonlar bir an sonlarına sarılıp ölçülüyor ve
  aynı karede geri alınıyor, ekrana hiçbir ara hâl çizilmiyor. Oyunun soru
  ekranı 500 ms'lik bir girişle geliyor ve ilk iki karesi duraklatılmış
  (`sayfa-bekliyor`); spot o duraklamayı "yerleşti" sanıp gidiyor, hedef
  20 px kayınca ikinci kez düzeltiliyordu. Bitmeyen (sonsuz) animasyonlara
  dokunulmuyor.
*/
function sonHalindeOlc<T>(hedef: HTMLElement | null, olc: () => T): T {
  const sarilanlar: [Animation, CSSNumberish | null][] = []
  for (let oge: Element | null = hedef; oge; oge = oge.parentElement) {
    if (typeof oge.getAnimations !== 'function') break
    for (const animasyon of oge.getAnimations()) {
      const bitis = Number(animasyon.effect?.getComputedTiming().endTime)
      if (animasyon.playState === 'finished' || !Number.isFinite(bitis)) continue
      sarilanlar.push([animasyon, animasyon.currentTime])
      animasyon.currentTime = bitis
    }
  }
  try { return olc() } finally { for (const [animasyon, zaman] of sarilanlar) animasyon.currentTime = zaman }
}

const azaltilmisHareket = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function SpotIsigi() {
  const { adim, animasyon, deneyMi, rehberGizli, aktifTur, adimSayisi, gecisSuruyor, aktifAdim, sonrakiAdimaGec, oncekiAdimaDon, turuBitir } = useTanitim()
  const [yerlesim, setYerlesim] = useState<Yerlesim>(BOS_YERLESIM)
  /** Turun ilk yerleşimi yapıldı ve katman belirdi. */
  const [gorunur, setGorunur] = useState(false)
  // Katman görünmüyorken (turun başı, oyunun geri sayımından dönüş) yerleşim
  // geçişsiz konuyor; yoksa balon görünmez hâldeki eski yerinden uçarak geliyordu.
  const gorunurRef = useRef(gorunur)
  gorunurRef.current = gorunur
  const [hedefEksik, setHedefEksik] = useState(false)
  /*
    Klavye açık ve odak hedefteki bir yazı kutusunda (Soru ekle, Görev ekle):
    görünür alan yarıya iniyor, form onu tümüyle kaplıyor. Tam balon (açıklama
    + Geri) formun yarısını örtüyordu; o sırada yalnızca başlık ve ipucu kalıyor.
  */
  const [sikisik, setSikisik] = useState(false)
  const sikisikRef = useRef(false)
  const balonRef = useRef<HTMLDivElement>(null)
  const katmanRef = useRef<HTMLDivElement>(null)
  const guvenliAlanRef = useRef<HTMLDivElement>(null)
  /** Görünür alanın klavyesiz (en büyük) yüksekliği; pencere genişliği değişince sıfırlanıyor. */
  const tamGorunumRef = useRef({ genislik: 0, yukseklik: 0 })
  /** Son çizilen yerleşim; adımlar arasında yaşıyor, yeni adımın animasyonu buradan başlıyor. */
  const sonRef = useRef<Yerlesim | null>(null)
  // Kapanış (ve ayarlıysa adımlar arası solma) sürerken ölçüm donuyor: son
  // adımda demo verisi silinince hedef kayboluyor ve balon, solarken ekranın
  // dibine uçuyordu.
  const donukRef = useRef(gecisSuruyor)
  donukRef.current = gecisSuruyor
  const maske = useId().replace(/:/g, '')

  useLayoutEffect(() => {
    if (!adim || rehberGizli) return
    const etkilesimAcik = adim.tiklamali || !!adim.etkilesimli
    let kare = 0
    let hedef: HTMLElement | null = null
    /*
      Adımın sırası, olaya bağlı:
      1. `bekle`  — hedef bulunup yerinde durana (iki kare kıpırdamayana) kadar
                    spot ve balon eski adımda kalıyor.
      2. planla   — hedefin kaydırılmış son yeri aynı karede (boyamadan)
                    ölçülüyor, kaydırma geri alınıyor; spot ve balon tek
                    seferde o son yere yollanıyor.
      3. `kaydir` — sayfa, spotla aynı süre ve eğriyle o yere kaydırılıyor:
                    delik içerikle birlikte hedefin üstüne iniyor.
      4. `izle`   — hedef sonradan oynarsa (içerik yüklendi, klavye açıldı)
                    yerleştiği an tek bir geçişle izleniyor.
      Eskiden spot her karede hedefin o anki yerine yeniden hedefleniyordu:
      kaydırma sürerken 240 ms'lik geçiş hedefi geriden kovalıyor, önüne geçip
      geri dönüyor; kaydırma bitince ikinci bir düzeltme kaydırması daha
      geliyordu.
    */
    /*
      5. `dogrula` — yalnızca yeni ekranda: sayfa son yerine anında kaydırıldı,
                    delik ve balon gizli. iOS WebKit, ekran değişiminin
                    `scrollTo(0, 0)`ından hemen sonra yapılan kaydırmayı bir
                    kare geri alıyor: iPad tanı kaydında planla `scrollY`=361
                    okudu, bir sonraki kare 0, ondan sonraki 362 (t=72735 →
                    72796 → 72879; aynısı Yapılacaklar, Deneme okut, Deneme
                    listesi ve iPhone'da dört adımda). Spot o karede belirdiği
                    için yeni ekran spotun 300 px altında görünüp yukarı
                    sıçrıyordu. Kaydırma geri dönerse yeniden uygulanıyor;
                    spot ancak kaydırma iki kare yerinde kalınca, o anki
                    ölçümle beliriyor.
    */
    let faz: 'bekle' | 'kaydir' | 'izle' | 'dogrula' = 'bekle'
    let dogrulama: { kayitlar: KaydirmaKaydi[]; bas: number; temiz: number } | null = null
    /** Bir önceki karenin görünür alan imzası: iOS kaydırırken bir karelik ara değerler raporluyor. */
    let oncekiImza = ''
    const adimBasi = performance.now()
    taniKaydet('adim', { adim: adim.kimlik, hedefAdi: adim.hedef })
    let beklemeBasi = adimBasi
    // Süreler kare değil milisaniye: 120 Hz'de ve ağır karelerde aynı bekleme (bkz. `durgunlukSayaci`).
    const durgun = durgunlukSayaci(1, 50)
    const izleDurgun = durgunlukSayaci(2, 40)
    let kaydirmalar: { bas: KaydirmaKaydi; son: KaydirmaKaydi }[] = []
    let kaydirmaBasi = 0
    let sonGorunum = ''
    let eksikBaslangici: number | null = null
    let eksikGosterildi = false
    const oncekiOdak = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dokunulmazlar = new Map<HTMLElement, boolean>()
    const hedefiBul = () => document.querySelector<HTMLElement>(`[data-tanitim="${adim.hedef}"]`)
    /** Tanı: odaktaki öğenin kısa adı (klavyenin hangi kutu için açıldığı). */
    const odakAdi = () => {
      const odak = document.activeElement
      if (!(odak instanceof HTMLElement) || odak === document.body) return null
      return `${odak.tagName.toLowerCase()}${odak.getAttribute('name') ? `[${odak.getAttribute('name')}]` : ''}${odak.closest('[data-tanitim]') ? `@${odak.closest('[data-tanitim]')!.getAttribute('data-tanitim')}` : ''}`
    }
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
    const ciz = (yeni: Yerlesim) => {
      const onceki = sonRef.current
      if (onceki && !yeni.spotAnlik && !yeni.balonAnlik && !!onceki.sakli === !!yeni.sakli && onceki.belir === yeni.belir && kutuFarki(onceki.hedef, yeni.hedef) < 0.5 && kutuFarki(onceki.balon, yeni.balon) < 0.5
        && kutuFarki(onceki.ekran, yeni.ekran) < 0.5 && JSON.stringify(onceki.ekHedefler) === JSON.stringify(yeni.ekHedefler)) return
      sonRef.current = yeni
      setYerlesim(yeni)
      if (taniAcikMi()) {
        const kutu = (k: Kutu | null) => (k ? [k.sol, k.ust, k.genislik, k.yukseklik].map((v) => Math.round(v * 10) / 10) : null)
        taniKaydet('ciz', { adim: adim.kimlik, faz, spot: kutu(yeni.hedef), balon: kutu(yeni.balon), ekran: kutu(yeni.ekran), anlik: [yeni.spotAnlik, yeni.balonAnlik], sakli: !!yeni.sakli, belir: yeni.belir ?? 0,
          hedefEkran: taniKutu(hedef?.getBoundingClientRect()), katman: taniKutu(katmanRef.current?.getBoundingClientRect()) })
      }
    }
    // Bundan sonraki bütün ölçüler katmanın CSS pikselinde (bkz. `katmanDonusumu`).
    const ortam = () => {
      const donusum = katmanDonusumu(katmanRef.current)
      const k = donusum.olcek
      const gorunum = window.visualViewport
      /*
        Görünür alanın (visualViewport) katmandaki yeri. `offsetTop` doğrudan
        kullanılmıyor: o, görünür alanın yerleşim görünümüne göre kaymasını
        veriyor; istemci koordinatlarının hangisine göre olduğu ise motora
        bağlı. iOS'ta klavye açıkken (görünür alan kaydırılmışken) dikdörtgenler
        görünür alana göre gelirse sabit katman `-offsetTop`ta raporlanıyor ve
        `offsetTop - katman.top` kaymayı iki kez sayıyordu: görünür alan
        olduğundan aşağıda sanılıyor, form "ekranın dışında" kalıyor ve delik
        sönüyordu (kart 10, "soru girerken her yer gri"). Belgenin başlangıcının
        istemci koordinatı (`html`in üstü) ile görünür alanın belgedeki yeri
        (`pageTop`) toplanınca görünür alanın istemci koordinatı çıkıyor —
        motor hangi görünüme göre ölçerse ölçsün.
      */
      const belge = document.documentElement.getBoundingClientRect()
      const ekran = {
        sol: gorunum ? (belge.left + gorunum.pageLeft - donusum.sol) / k : -donusum.sol / k,
        ust: gorunum ? (belge.top + gorunum.pageTop - donusum.ust) / k : -donusum.ust / k,
        genislik: (gorunum?.width ?? window.innerWidth) / k, yukseklik: (gorunum?.height ?? window.innerHeight) / k,
      }
      // Güvenli alan `env()`ten ekran pikseli olarak geliyor; büyütülmüş
      // katmanda o kadar ekran pikseli `/ k` CSS pikseline denk.
      const guvenli = guvenliAlanRef.current ? getComputedStyle(guvenliAlanRef.current) : null
      // Yazılım klavyesi açık: görünür alan pencereden belirgin kısa (iOS'ta
      // pencere değil yalnızca visualViewport küçülüyor). Klavye ev çubuğunun
      // üstünde durduğu için alttaki güvenli alan o sırada düşülmüyor.
      /*
        Karşılaştırma `innerHeight` ile değil, görünür alanın klavyesiz
        yüksekliğiyle: iOS klavye açıkken `innerHeight`i de küçültüyor (iPhone
        tanı kaydında 812 → 666 → 526, görünür alan 442). Fark 84'e inince
        klavye "kapalı" sanıldı, alt sınır ve balon yeniden hesaplandı
        (Soru ekle, t=47147).
      */
      const tam = tamGorunumRef.current
      if (Math.abs(tam.genislik - window.innerWidth) > 1) { tam.genislik = window.innerWidth; tam.yukseklik = 0 }
      tam.yukseklik = Math.max(tam.yukseklik, window.innerHeight, gorunum?.height ?? 0)
      const klavye = !!gorunum && tam.yukseklik - gorunum.height > 100
      const ustSinir = ekran.ust + (parseFloat(guvenli?.paddingTop ?? '0') || 0) / k + 12
      const altSinir = ekran.ust + ekran.yukseklik - (klavye ? 0 : (parseFloat(guvenli?.paddingBottom ?? '0') || 0) / k) - 12
      /*
        Alt menü (telefon) ya da sağ ray (tablet) sayfanın üstünde duruyor:
        altında kalan içerik görünmüyor. Spot o kısmı da aydınlatınca delik
        menünün üstüne taşıyordu (kart 6, Pomodoro'nun çalışma bloğu).
      */
      const menu = document.querySelector<HTMLElement>('nav[data-yuzen]')
      const m = menu && menu.getClientRects().length ? yereleCevir(menu.getBoundingClientRect(), donusum) : null
      const menuUst = m && m.width > m.height && m.top > ekran.ust + ekran.yukseklik / 2 ? m.top : null
      const raySol = m && m.height > m.width && m.left > ekran.sol + ekran.genislik / 2 ? m.left : null
      return { donusum, k, ekran, ustSinir, altSinir, klavye, menu, menuUst, raySol }
    }
    type Ortam = ReturnType<typeof ortam>
    const tablet = () => document.documentElement.dataset.yerlesim === 'tablet'
    /*
      Balonun yeni adımdaki yüksekliği, konacağı genişlikte ölçülüyor. Eskiden
      bir önceki karenin yüksekliği kullanılıyordu: içerik değişince balon önce
      eski boyuna göre konuyor, bir kare sonra yeniden konup ikinci kez
      sıçrıyordu (Pomodoro adımında 72 px).
    */
    const balonYuksekligi = (genislik: number, k: number) => {
      const balon = balonRef.current
      if (!balon) return 230
      const onceki = balon.style.width
      balon.style.width = `${genislik}px`
      const yukseklik = balon.getBoundingClientRect().height / k
      balon.style.width = onceki
      return yukseklik
    }
    /*
      Hedef sabit (`position: fixed`) bir katmandaysa (alt menü, alttan açılan
      form) güvenli alan sınırına kırpılmıyor, yalnızca ekranın kenarına: menü
      ev çubuğunun üstüne kadar iniyor ve spot güvenli alanın 12 px üstünde
      kesilince sekme düğmesinin alt 14 px'i dışarıda kalıyor, aydınlık alan
      düğmeye göre yukarıda duruyordu. Akıştaki hedef ise menünün/rayın
      altında kalan kısmıyla birlikte aydınlatılmıyor.
    */
    const sabitKatmanda = (oge: HTMLElement) => {
      for (let a: HTMLElement | null = oge; a && a !== document.body; a = a.parentElement) if (getComputedStyle(a).position === 'fixed') return true
      return false
    }
    const hedefKutusu = (o: Ortam): Kutu | null => {
      if (!hedef) return null
      const d = yereleCevir(hedef.getBoundingClientRect(), o.donusum)
      if (d.width <= 0 || d.height <= 0) return null
      // Uzun konu patikasının ilk bölümü ve ilerleme bandı birlikte görünür.
      const gorunenAlt = adim.kimlik === 'konu-haritasi' ? Math.min(d.bottom, d.top + o.ekran.yukseklik * 0.4) : d.bottom
      const sabit = sabitKatmanda(hedef)
      const ustKenar = sabit ? o.ekran.ust + 2 : o.ustSinir - 8
      let altKenar = sabit ? o.ekran.ust + o.ekran.yukseklik - 2 : o.altSinir + 8
      let sagKenar = o.ekran.sol + o.ekran.genislik - 4
      // Sabit katmanlar (form, menünün kendisi) menünün üstünde çiziliyor; kırpılmıyor.
      if (!sabit && o.menuUst !== null) altKenar = Math.min(altKenar, o.menuUst)
      if (!sabit && o.raySol !== null) sagKenar = Math.min(sagKenar, o.raySol)
      const pay = adim.dolgu ?? 5
      const sol = Math.max(o.ekran.sol + 4, d.left - pay)
      const ust = Math.max(ustKenar, d.top - pay)
      const sag = Math.min(sagKenar, d.right + pay)
      const alt = Math.min(altKenar, gorunenAlt + pay)
      return sag > sol && alt > ust ? { sol, ust, genislik: sag - sol, yukseklik: alt - ust } : null
    }
    /** Klavye açıkken hedefteki odaklı yazı kutusu: balon onu örtmemeli. */
    const odakKutusu = (o: Ortam): Kutu | null => {
      const odak = document.activeElement
      if (!o.klavye || !hedef || !(odak instanceof HTMLElement) || !hedef.contains(odak) || !odak.matches('input, textarea')) return null
      const r = yereleCevir(odak.getBoundingClientRect(), o.donusum)
      return { sol: r.left, ust: r.top, genislik: r.width, yukseklik: r.height }
    }
    const hesapla = (o: Ortam, kutu: Kutu | null): Yerlesim => {
      const genislik = balonGenisligi(kutu, o.ekran, tablet())
      const yukseklik = balonYuksekligi(genislik, o.k)
      const simdiki = sonRef.current && !sonRef.current.sakli && sonRef.current.balon.genislik === genislik ? sonRef.current.balon : null
      const yer = balonKonumu(kutu, o.ekran, o.ustSinir, o.altSinir, genislik, yukseklik, odakKutusu(o), simdiki)
      const ekHedefler = (adim.ekHedefler ?? []).flatMap((hedefAdi) => {
        const oge = document.querySelector<HTMLElement>(`[data-tanitim="${hedefAdi}"]`)
        if (!oge) return []
        const alan = yereleCevir(oge.getBoundingClientRect(), o.donusum)
        if (alan.bottom < o.ustSinir || alan.top > o.altSinir) return []
        return [{ sol: alan.left - 4, ust: Math.max(o.ustSinir, alan.top - 4), genislik: alan.width + 8, yukseklik: Math.min(o.altSinir, alan.bottom + 4) - Math.max(o.ustSinir, alan.top - 4) }]
      })
      return { ekHedefler, hedef: kutu, cizilen: kutu ?? sonRef.current?.cizilen ?? null, ekran: o.ekran, balon: { ...yer, genislik, yukseklik }, spotAnlik: false, balonAnlik: false, belir: sonRef.current?.belir ?? 0, sayfa: document.querySelector('[data-geri-sayfa]') }
    }
    /*
      Kaydırmanın sonunu boyamadan önce ölç: hedef anında kaydırılıyor,
      yerleşim hesaplanıyor, kaydırma geri alınıyor. Tarayıcı aradaki hâlleri
      hiç çizmiyor. Böylece spot ilk seferde doğru yere gidiyor; kısa
      telefondaki "balon sığmıyor, hedefi üste al" düzeltmesi de aynı ölçümün
      içinde, ayrı ve ikinci bir kaydırma değil.
    */
    const planla = (o: Ortam) => {
      if (!hedef) return
      const bas = kaydirmalariOku(hedef)
      const d0 = yereleCevir(hedef.getBoundingClientRect(), o.donusum)
      // Uzun hedefin üstü güvenli alanın hemen altına, kısası görünür alanın ortasına.
      const alan = o.altSinir - o.ustSinir
      let istenen = d0.height > o.ekran.yukseklik * 0.55 ? o.ustSinir + 8 : o.ustSinir + (alan - d0.height) / 2
      // Balon ve hedef kısa telefonlarda üst üste binmesin: hedef üste alınıyor, balon altına.
      const yukseklik = balonYuksekligi(balonGenisligi(hedefKutusu(o), o.ekran, tablet()), o.k)
      if (Math.max(o.altSinir - (istenen + d0.height), istenen - o.ustSinir) < yukseklik + 20 && o.ekran.genislik * o.k < 700) istenen = o.ustSinir + 8
      hedefiKaydir(hedef, istenen + o.donusum.ust / o.k, o.k, !o.klavye)
      const onceki = sonRef.current
      const yeni = hesapla(o, hedefKutusu(o))
      const son = kaydirmalariOku(hedef)
      const hareketsiz = azaltilmisHareket()
      const yeniEkran = ekranDegisti()
      kaydirmalar = []
      // Yeni ekranda sayfa zaten tak diye değişti; kaydırma da canlandırılmıyor, son yerinde kalıyor.
      if (!hareketsiz && onceki && !yeniEkran) {
        for (let i = bas.length - 1; i >= 0; i--) {
          if (Math.abs(bas[i].x - son[i].x) < 0.5 && Math.abs(bas[i].y - son[i].y) < 0.5) continue
          kaydir(bas[i])
          kaydirmalar.push({ bas: bas[i], son: son[i] })
        }
      }
      kaydirmaBasi = performance.now()
      const kaydirilan = son.filter((z, i) => Math.abs(bas[i].x - z.x) >= 0.5 || Math.abs(bas[i].y - z.y) >= 0.5)
      dogrulama = null
      // Yeni ekranda sayfa kaydırıldıysa delik, kaydırma yerinde kalana dek gizli (bkz. `dogrula`).
      if (yeniEkran && onceki?.sakli && gorunurRef.current && !hareketsiz && kaydirilan.length) dogrulama = { kayitlar: kaydirilan, bas: kaydirmaBasi, temiz: 0 }
      // İlk yerleşim ve kaybolup yeniden beliren delik geçişsiz konuyor.
      else if (yeniEkran && onceki && gorunurRef.current) ciz({ ...yeni, sakli: false, belir: (onceki.belir ?? 0) + 1, spotAnlik: true, balonAnlik: true })
      else ciz({ ...yeni, spotAnlik: hareketsiz || !onceki || !onceki.hedef || !gorunurRef.current, balonAnlik: hareketsiz || !onceki || !gorunurRef.current })
      faz = dogrulama ? 'dogrula' : kaydirmalar.length ? 'kaydir' : 'izle'
      izleDurgun.sifirla()
      if (taniAcikMi()) taniKaydet('planla', { adim: adim.kimlik, yeniEkran, k: o.k, ustSinir: o.ustSinir, altSinir: o.altSinir, istenen, kaydirma: kaydirmalar.map(({ bas: b, son: z }) => [b.oge ? 'kap' : 'pencere', b.y, z.y]), bekleme: Math.round(performance.now() - adimBasi) })
    }
    /*
      Ekran değişti mi: sayfa kutusu (`SayfaGecisi`, `data-geri-sayfa`) her
      ekranda yeniden kuruluyor; spotun son çizildiği kutu artık yoksa başka
      bir ekrandayız (ileri, Geri, sekme ya da formun kaydı ekranı kapattıysa).
      Adımın başındaki kutuya bakılmıyor: deneme kaydedilince ekran ile adım
      aynı çizimde değişiyor. Öyleyse spot ve balon eski yerden
      uçmuyor — Pomodoro satırına dokununca Pomodoro ekranında eski satırın
      yerinden gelen spot, orada olmayan bir şeyden geliyordu. Aynı ekranda
      kayarak gidiyor.
    */
    const ekranDegisti = () => {
      // `null`: sayfa kutusunun dışında çizilen tam ekran form (yeni deneme).
      const onceki = sonRef.current?.sayfa
      if (onceki === undefined) return false
      return (onceki !== null && !onceki.isConnected) || document.querySelector('[data-geri-sayfa]') !== onceki
    }
    const olc = () => {
      kare = requestAnimationFrame(olc)
      if (donukRef.current) return
      if (faz === 'bekle' && sonRef.current && !sonRef.current.sakli && ekranDegisti() && gorunurRef.current && !azaltilmisHareket()) {
        ciz({ ...sonRef.current, sakli: true, spotAnlik: true, balonAnlik: true })
      }
      const bulunan = hedefiBul()
      if (bulunan !== hedef) {
        kilitleriBirak()
        hedef = bulunan
        if (faz !== 'bekle') beklemeBasi = performance.now()
        faz = 'bekle'
        durgun.sifirla()
      }
      for (const cocuk of document.body.children) if (cocuk instanceof HTMLElement) kilitle(cocuk)
      const o = ortam()
      // Klavye hedefteki bir kutuya açıldıysa balon yalnızca başlık ve ipucuna iner.
      const sikisikOlmali = !!odakKutusu(o)
      if (sikisikOlmali !== sikisikRef.current) { sikisikRef.current = sikisikOlmali; setSikisik(sikisikOlmali) }
      /*
        Görünür alan ancak iki kare aynı kaldıysa değişmiş sayılıyor, rehberin
        kendi kaydırması sürerken hiç sayılmıyor. iOS programla kaydırılan
        sayfada bir kare boyunca belgenin ve görünür alanın yerini birbirinden
        ayrı raporluyor: iPhone tanı kaydında kaydırma sürerken görünür alanın
        üstü 9, 5, 4 px oynadı (t=24944, 25075, 25192); her seferinde kaydırma
        kesilip baştan planlandı, 360 ms'lik kaydırma bir saniyeyi aştı (bir
        adımda 17 kez planla), spot ise sayfadan önce varıp bekledi. Sekme
        değişiminin ilk karesinde görünür alan -378 px'te raporlandı
        (Oyunlar, t=108707); spot o karede planlanıp boş çizildi, balon 320 px
        sıçradı.
      */
      const gorunumImzasi = `${o.ekran.genislik}:${o.ekran.yukseklik}:${o.ustSinir}:${o.altSinir}`
      const gorunumSabit = gorunumImzasi === oncekiImza
      oncekiImza = gorunumImzasi
      if (gorunumSabit && faz !== 'kaydir' && sonGorunum !== gorunumImzasi) {
        if (sonGorunum && faz !== 'bekle') { faz = 'bekle'; beklemeBasi = performance.now(); durgun.sifirla() }
        sonGorunum = gorunumImzasi
      }
      const simdi = performance.now()
      // Hedef var mı (ekranın dışında da olabilir; onu kaydırarak getiriyoruz)
      // ve görünür kısmı (spotun çizileceği kutu) ayrı sorular.
      const ham = sonHalindeOlc(hedef, () => (hedef ? yereleCevir(hedef.getBoundingClientRect(), o.donusum) : null))
      // Tanı: adımın ilk 1,5 saniyesi kare kare (yalnızca tanı modu açıkken).
      // Bekleme her yeniden başladığında (klavye, form büyüdü) yine 1,5 saniye.
      if (taniAcikMi() && (simdi - adimBasi < 1500 || simdi - beklemeBasi < 1500 || faz === 'dogrula')) {
        taniKaydet('kare', { adim: adim.kimlik, faz, hedef: taniKutu(ham), katman: taniKutu(katmanRef.current?.getBoundingClientRect()), ekranUst: Math.round(o.ekran.ust * 10) / 10,
          ekranY: Math.round(o.ekran.yukseklik * 10) / 10, klavye: o.klavye, sabit: gorunumSabit, odak: odakAdi() })
      }
      if (!ham || ham.width <= 0 || ham.height <= 0) {
        if (eksikBaslangici === null) eksikBaslangici = simdi
        if (simdi - adimBasi >= KAYIP_BEKLEMESI) {
          // Delik söner, balon yerinde kalır; turun ilk adımıysa balon altta belirir.
          const onceki = sonRef.current
          if (!onceki) ciz({ ...hesapla(o, null), spotAnlik: true, balonAnlik: true })
          // Ekran değişiminde gizlenen balon hedef gelmezse geri getiriliyor (bulunamadı notu görünsün).
          else if (onceki.sakli) ciz({ ...onceki, hedef: null, ekHedefler: [], sakli: false, belir: (onceki.belir ?? 0) + 1, spotAnlik: true, balonAnlik: true })
          else if (onceki.hedef) ciz({ ...onceki, hedef: null, ekHedefler: [], spotAnlik: false, balonAnlik: false })
        }
        const eksik = simdi - eksikBaslangici >= 5000
        if (eksik !== eksikGosterildi) { eksikGosterildi = eksik; setHedefEksik(eksik) }
        faz = 'bekle'
        return
      }
      eksikBaslangici = null
      if (eksikGosterildi) { eksikGosterildi = false; setHedefEksik(false) }
      if (faz === 'bekle') {
        // Yazı tipi yükleniyorsa satırlar birazdan yeniden kırılacak; o zamana kadar yerleşme yok.
        const yaziBekliyor = document.fonts?.status === 'loading'
        const durdu = durgun.bildir({ sol: ham.left, ust: ham.top, genislik: ham.width, yukseklik: ham.height }, simdi)
        if ((!durdu || yaziBekliyor || !gorunumSabit) && simdi - beklemeBasi < EN_UZUN_YERLESME) return
        sonHalindeOlc(hedef, () => planla(o))
        return
      }
      if (faz === 'dogrula' && dogrulama) {
        // Kaydırma geri döndüyse (iOS) aynı karede yeniden uygula; 1 px'lik yuvarlama sayılmıyor.
        const sapanlar = dogrulama.kayitlar.filter(({ oge, y }) => Math.abs((oge ? oge.scrollTop : window.scrollY) - y) > 1.5)
        if (taniAcikMi() && sapanlar.length) taniKaydet('geriDondu', { adim: adim.kimlik, istenen: sapanlar.map((z) => z.y), okunan: sapanlar.map(({ oge }) => (oge ? oge.scrollTop : window.scrollY)) })
        if (sapanlar.length) { for (const kayit of sapanlar) kaydir(kayit); dogrulama.temiz = 0; return }
        if (gorunumSabit) dogrulama.temiz++
        if (dogrulama.temiz < 2 && simdi - dogrulama.bas < 500) return
        dogrulama = null
        faz = 'izle'
        izleDurgun.sifirla()
        const onceki = sonRef.current
        ciz({ ...sonHalindeOlc(hedef, () => hesapla(o, hedefKutusu(o))), sakli: false, belir: (onceki?.belir ?? 0) + 1, spotAnlik: true, balonAnlik: true })
        return
      }
      if (faz === 'kaydir') {
        const ilerleme = Math.min(1, (simdi - kaydirmaBasi) / Math.max(1, animasyon.cerceveMs))
        const e = egriDegeri(ilerleme)
        for (const { bas, son } of kaydirmalar) kaydir({ oge: bas.oge, x: bas.x + (son.x - bas.x) * e, y: bas.y + (son.y - bas.y) * e })
        if (ilerleme >= 1) { faz = 'izle'; izleDurgun.sifirla() }
        return
      }
      // İzle: hedef ancak yeni yerinde durunca, tek bir geçişle takip ediliyor.
      const kutu = sonHalindeOlc(hedef, () => hedefKutusu(o))
      // Ekrandan çıktıysa (içerik kaydı) yeniden planla: kaydırıp getir.
      if (!kutu) { faz = 'bekle'; beklemeBasi = simdi; durgun.sifirla(); return }
      if (!izleDurgun.bildir(kutu, simdi)) return
      const son = sonRef.current
      const balonBoyu = (balonRef.current?.getBoundingClientRect().height ?? 0) / o.k
      if (son && !adim.ekHedefler && kutuFarki(son.hedef, kutu) < 0.5 && Math.abs(son.balon.yukseklik - balonBoyu) < 0.5) return
      ciz(sonHalindeOlc(hedef, () => hesapla(o, kutu)))
    }
    const izinli = (oge: EventTarget | null) => sistemPenceresinde(oge) || (oge instanceof Node && (denetim?.contains(oge) || balonRef.current?.contains(oge) || (etkilesimAcik && hedef?.contains(oge))))
    const engelle = (olay: Event) => {
      if (!izinli(olay.target)) { olay.preventDefault(); olay.stopImmediatePropagation() }
    }
    const odaklan = () => balonRef.current?.querySelector<HTMLElement>('[data-tanitim-baslik]')?.focus({ preventScroll: true })
    const odagiKoru = (olay: FocusEvent) => { if (!izinli(olay.target)) odaklan() }
    const tusuYakala = (olay: KeyboardEvent) => {
      // Escape tuşu turu bitirmiyor: tur yalnızca ilerleyerek biter. Tuş, altındaki sayfaya da geçmesin.
      if (olay.key === 'Escape') { olay.preventDefault(); olay.stopImmediatePropagation(); return }
      if (olay.key !== 'Tab') { if (['Enter', ' '].includes(olay.key)) engelle(olay); return }
      // Odak bir sistem penceresindeyse Tab o pencerenin içinde dolaşsın.
      if (sistemPenceresinde(document.activeElement)) return
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
    sikisikRef.current = false
    setSikisik(false)
    olc()
    /*
      Kabuk yeni ekranı bu etkiden sonra, aynı görevde kuruyor ve ilk kare
      boyanmadan önce. Ekran değiştiyse delik ve balon o kareden önce
      gizleniyor; bir sonraki rAF'i bekleseydik yeni ekran bir kare eski
      deliğin altında, yeni adımın yazısı eski balonda görünürdü.
    */
    let iptal = false
    queueMicrotask(() => {
      if (iptal || !sonRef.current || sonRef.current.sakli || !ekranDegisti() || !gorunurRef.current || azaltilmisHareket()) return
      const gizli = { ...sonRef.current, sakli: true, spotAnlik: true, balonAnlik: true }
      flushSync(() => ciz(gizli))
    })
    odaklan()
    const olaylar = ['pointerdown', 'mousedown', 'touchstart', 'click', 'dblclick', 'contextmenu']
    for (const olay of olaylar) document.addEventListener(olay, engelle, { capture: true, passive: false })
    document.addEventListener('keydown', tusuYakala, true)
    document.addEventListener('focusin', odagiKoru, true)
    /*
      Tanı: kare kaydı aralıklı (adımın ve her beklemenin ilk 1,5 saniyesi);
      klavyenin açıldığı, sayfanın kaydığı ve dokunulan an ise olay olarak
      yazılıyor. Kart 10'da "klavye açılınca her yer gri" kaydı bu anları
      içermediği için kayıttan doğrulanamadı.
    */
    // Pencerede, yakalama evresinde: rehberin `engelle`si belgede durdurduğu dokunmalar da yazılsın.
    const tani = taniAcikMi()
    const gorunumOlayi = (olay: Event) => taniKaydet(olay.type === 'resize' ? 'vvBoyut' : olay.currentTarget === window ? 'kaydirma' : 'vvKayma', { adim: adim.kimlik, faz, odak: odakAdi() })
    const dokunmaOlayi = (olay: Event) => {
      const oge = olay.target instanceof Element ? olay.target : null
      taniKaydet(olay.type === 'pointerdown' ? 'dokunma' : olay.type, { adim: adim.kimlik, faz, oge: oge ? `${oge.tagName.toLowerCase()}@${oge.closest('[data-tanitim]')?.getAttribute('data-tanitim') ?? ''}` : null, odak: odakAdi() })
    }
    if (tani) {
      window.visualViewport?.addEventListener('resize', gorunumOlayi)
      window.visualViewport?.addEventListener('scroll', gorunumOlayi)
      window.addEventListener('scroll', gorunumOlayi, { passive: true })
      for (const ad of ['pointerdown', 'focusin', 'focusout']) window.addEventListener(ad, dokunmaOlayi, true)
    }
    return () => {
      if (tani) {
        window.visualViewport?.removeEventListener('resize', gorunumOlayi)
        window.visualViewport?.removeEventListener('scroll', gorunumOlayi)
        window.removeEventListener('scroll', gorunumOlayi)
        for (const ad of ['pointerdown', 'focusin', 'focusout']) window.removeEventListener(ad, dokunmaOlayi, true)
      }
      iptal = true
      cancelAnimationFrame(kare)
      for (const olay of olaylar) document.removeEventListener(olay, engelle, true)
      document.removeEventListener('keydown', tusuYakala, true)
      document.removeEventListener('focusin', odagiKoru, true)
      kilitleriBirak()
      if (oncekiOdak?.isConnected) oncekiOdak.focus({ preventScroll: true })
    }
  }, [adim, turuBitir, rehberGizli, deneyMi, animasyon.cerceveMs])

  // Geçişsiz konan yerleşim bir kare boyandıktan sonra geçişler açılıyor;
  // turun ilk yerleşiminden sonra katman da beliriyor.
  useEffect(() => {
    if (!yerlesim.spotAnlik && !yerlesim.balonAnlik && (gorunur || !yerlesim.ekran.genislik)) return
    // Geçişsiz hâlin stili şimdi hesaplatılıyor. Yoksa React'in iki
    // güncellemesi aynı stil hesabına düşebiliyor ve geçiş, balonun hiç
    // çizilmemiş eski yerinden (sol üst köşeden) başlıyordu.
    balonRef.current?.getBoundingClientRect()
    katmanRef.current?.querySelector('svg')?.getBoundingClientRect()
    const kare = requestAnimationFrame(() => {
      if (yerlesim.ekran.genislik) setGorunur(true)
      // Yalnızca bu etkinin gördüğü yerleşim: arada yenisi geldiyse (o da
      // geçişsiz olabilir) ona dokunma, kendi etkisi temizleyecek.
      if (yerlesim.spotAnlik || yerlesim.balonAnlik) setYerlesim((onceki) => {
        if (onceki !== yerlesim) return onceki
        const yeni = { ...onceki, spotAnlik: false, balonAnlik: false }
        if (sonRef.current === onceki) sonRef.current = yeni
        return yeni
      })
    })
    return () => cancelAnimationFrame(kare)
  }, [yerlesim, gorunur])

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
      // Sistem penceresinin (çökme sorusu) kendi kaydırılan içeriği çalışsın.
      if (sistemPenceresinde(olay.target)) return
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

  // Tur bitince ya da rehber gizlenince bir sonraki açılış baştan, belirerek başlar.
  useEffect(() => {
    if (adim && !rehberGizli) return
    sonRef.current = null
    setGorunur(false)
    setYerlesim(BOS_YERLESIM)
  }, [adim, rehberGizli])

  if (!adim || rehberGizli || typeof document === 'undefined') return null
  const hareketAzalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const kisaBalon = !!adim.kisa || sikisik || ['pomodoro', 'zorluk'].includes(adim.kimlik)
  const aciklama = adim.tabletAciklama && document.documentElement.dataset.yerlesim === 'tablet' ? adim.tabletAciklama : adim.aciklama
  const { hedef, cizilen, ekHedefler, balon, ekran, spotAnlik, balonAnlik, sakli, belir = 0 } = yerlesim
  // Yeni ekranda yerinde beliriş: iki eş anahtar kare dönüşümlü, her `belir` artışında animasyon baştan oynuyor.
  const belirme = belir > 0 && !hareketAzalt ? `tanitim-belir-${belir % 2} ${animasyon.aydinlatmaMs + 40}ms ${TANITIM_EGRISI} backwards` : undefined
  /*
    Süreler ve eğri `lib/tanitim-animasyonu.ts`te. Spot (delik + çerçeve) ve
    sayfa kaydırması aynı süre ve eğriyle yürüyor; balon aynı eğriyle,
    `balonGecikmesiMs` kadar arkadan. Katman opaklığı yalnızca turun açılışı
    ve kapanışında oynuyor.
  */
  const egri = TANITIM_EGRISI
  const spotGecisi = hareketAzalt || spotAnlik ? 'none'
    : ['x', 'y', 'width', 'height'].map((ozellik) => `${ozellik} ${animasyon.cerceveMs}ms ${egri}`).join(', ')
  const delikOpakligi = gorunur && hedef && !gecisSuruyor ? 1 : 0
  const cizgiGecisi = hareketAzalt ? 'none' : `stroke-dashoffset ${animasyon.cerceveMs + 120}ms ${egri} ${animasyon.aydinlatmaGecikmesiMs}ms, opacity ${animasyon.aydinlatmaMs}ms ease-out`
  const katmanOpakligi = gorunur && !gecisSuruyor ? 1 : 0
  const balonKaymasi = gorunur ? 0 : 8
  return createPortal(
    <div ref={katmanRef} className="pointer-events-none fixed inset-0 z-[10000]" style={{ opacity: katmanOpakligi, transition: hareketAzalt ? 'none' : `opacity ${animasyon.aydinlatmaMs}ms ease-out` }}>
      <div ref={guvenliAlanRef} aria-hidden className="invisible absolute" style={{ paddingTop: 'var(--guvenli-ust)', paddingBottom: 'var(--guvenli-alt)' }} />
      <svg aria-hidden className="absolute inset-0 h-full w-full">
        <defs><mask id={maske}><rect width="100%" height="100%" fill="white" />{cizilen && <rect x={cizilen.sol} y={cizilen.ust} width={cizilen.genislik} height={cizilen.yukseklik} rx="18" fill="black" style={{ opacity: sakli ? 0 : delikOpakligi, animation: belirme, transformBox: 'fill-box', transformOrigin: 'center', transition: sakli ? 'none' : [spotGecisi === 'none' ? '' : spotGecisi, hareketAzalt ? '' : `opacity ${animasyon.aydinlatmaMs}ms ease-out ${gorunur && hedef ? animasyon.aydinlatmaGecikmesiMs : 0}ms`].filter(Boolean).join(', ') || 'none' }} />}{ekHedefler.map((alan, sira) => <rect key={sira} x={alan.sol} y={alan.ust} width={alan.genislik} height={alan.yukseklik} rx="18" fill="black" />)}</mask></defs>
        <rect width="100%" height="100%" fill="var(--foreground)" opacity={animasyon.karartma} mask={`url(#${maske})`} />
        {cizilen && <rect x={cizilen.sol} y={cizilen.ust} width={cizilen.genislik} height={cizilen.yukseklik} rx="18" fill="none" stroke="var(--primary-parlak)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={gorunur ? 0 : 1} style={{ opacity: sakli ? 0 : delikOpakligi, animation: belirme, transformBox: 'fill-box', transformOrigin: 'center', transition: sakli ? 'none' : [spotGecisi === 'none' ? '' : spotGecisi, cizgiGecisi === 'none' ? '' : cizgiGecisi].filter(Boolean).join(', ') || 'none' }} />}
      </svg>
      <div ref={balonRef} data-tanitim-balonu role="region" aria-label="Rabi tanıtım rehberi"
        className="pointer-events-auto absolute left-0 top-0 overflow-y-auto overscroll-contain rounded-2xl border border-border bg-card text-card-foreground shadow-xl"
        style={{
          padding: adim.kimlik === 'soru-bir' ? 8 : 12,
          transform: `translate3d(${balon.sol || 12}px, ${(balon.ust || 12) + balonKaymasi}px, 0)`,
          transition: hareketAzalt || balonAnlik ? 'none' : `transform ${animasyon.balonMs}ms ${egri} ${gorunur ? animasyon.balonGecikmesiMs : animasyon.aydinlatmaGecikmesiMs}ms`,
          pointerEvents: gecisSuruyor || sakli ? 'none' : 'auto',
          opacity: sakli ? 0 : undefined, animation: belirme,
          width: balon.genislik || 'calc(100% - 24px)', maxWidth: 340, maxHeight: ekran.yukseklik ? Math.max(120, ekran.yukseklik * 0.52) : '52dvh',
          visibility: ekran.genislik ? 'visible' : 'hidden',
        }}>
        {/* Üst satır: Rabi ve turun etiketi. Sayaç, "Turu Geç" ya da kapatma düğmesi yok; tur yalnızca ilerleyerek biter. */}
        <div className="flex items-center gap-2.5" style={{ marginBottom: adim.kimlik === 'soru-bir' ? 0 : 8 }}>
          <span aria-hidden className="shrink-0"><Rabi poz={adimPozu(adim, aktifTur, aktifAdim === adimSayisi - 1)} boyut={adim.kimlik === 'soru-bir' || kisaBalon ? 36 : 48} /></span>
          {adim.kimlik === 'soru-bir' && <div><h2 data-tanitim-baslik tabIndex={-1} className="font-display text-sm font-extrabold outline-none">{adim.baslik}</h2><p className="text-[11px] text-muted-foreground">Sonucu yaz veya pas geç.</p></div>}
          {adim.kimlik !== 'soru-bir' && <span className="text-[11px] font-extrabold tracking-wide text-primary">{aktifTur === 'ana_tur' ? 'RABİ’Yİ TANI' : aktifTur === 'denemeler' ? 'DENEMELER' : 'KONU HARİTASI'}</span>}
        </div>
        {adim.kimlik !== 'soru-bir' && <h2 data-tanitim-baslik tabIndex={-1} className={kisaBalon ? 'font-display text-sm font-extrabold outline-none' : 'font-display text-lg font-extrabold outline-none'}>{adim.baslik}</h2>}
        {(adim.kimlik !== 'soru-bir' || hedefEksik) && !(sikisik && !hedefEksik) && <p aria-live="polite" className={kisaBalon ? 'mt-1 text-xs leading-snug text-muted-foreground' : 'mt-2 text-[13px] leading-relaxed text-muted-foreground'}>{hedefEksik ? 'Bu adımın bileşeni bulunamadı. Geri dönerek yeniden deneyebilirsin.' : adim.kimlik === 'soru-bir' ? 'Sonucu yaz, onayla veya pas geç.' : aciklama}</p>}
        {adim.kimlik !== 'soru-bir' && <div className={kisaBalon ? 'mt-2 flex items-center justify-between gap-2' : 'mt-3 flex items-center justify-between gap-2'}>
          {!sikisik && <Buton type="button" bicim="ikincil" className="min-h-11 min-w-11" disabled={aktifAdim === 0 || gecisSuruyor} onClick={oncekiAdimaDon}>Geri</Buton>}
          {aktifAdim === adimSayisi - 1 ? <Buton type="button" className="min-h-11 min-w-11" onClick={turuBitir}>Turu Bitir</Buton> : adim.tiklamali ? <span className="text-right text-xs font-bold text-primary">{adim.ipucu ?? 'Aydınlatılan alana dokun'}</span> : <Buton type="button" className="min-h-11 min-w-11" disabled={!hedef || hedefEksik || gecisSuruyor} onClick={sonrakiAdimaGec}>{adim.ileriEtiketi ?? (adim.kimlik === 'sonuc' ? 'Oyunlara dön' : 'İleri')}</Buton>}
        </div>}
      </div>
    </div>, document.body,
  )
}
