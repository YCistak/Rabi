'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { geriKaydirmayiKilitle } from '@/lib/geri-kaydirma'
import type { Sekme } from '@/lib/gezinme'
import {
  KOYU_ESIGI,
  SURUKLEME_OLCEGI,
  buyutecOlcegi,
  enineOlcek,
  mercekKonumu,
  parlaklik,
  parmaktanSira,
  rengiCoz,
  type Ton,
} from '@/lib/cam-menu'

/**
 * Alt menü simgeleri elle çiziliyor, hazır setten alınmıyor.
 *
 * Tasarımdaki simgelerin görsel ağırlığı birbirine eşit; lucide'ın
 * `Gamepad2`si diğerlerinin yanında basık duruyordu. Hepsi 24×24 kutuda,
 * aynı çizgi kalınlığında ve aynı optik yükseklikte. Harita simgesi katlanmış
 * bir harita — sonradan eklendi, aynı kurala göre çizildi.
 */
const SIMGELER: Record<Sekme, React.ReactNode> = {
  ana: (
    <>
      <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.5Z" />
      <path d="M9.5 20.5V14h5v6.5" />
    </>
  ),
  oyunlar: (
    <>
      <path d="M9.3 4.6h5.4a5.7 5.7 0 0 1 5.7 5.7v2a2.4 2.4 0 0 1-.1.8l-1.7 5a3.2 3.2 0 0 1-6-.3l-.5-1.7h-1.6l-.5 1.7a3.2 3.2 0 0 1-6 .3l-1.7-5a2.4 2.4 0 0 1-.1-.8v-2a5.7 5.7 0 0 1 5.7-5.7Z" />
      <path d="M8.4 9.4v3.2M6.8 11h3.2" />
      <path d="M15.4 9.9h.01M17.2 12.1h.01" />
    </>
  ),
  harita: (
    <>
      <path d="M3.5 6.5 9 4l6 2.5L20.5 4v13.5L15 20l-6-2.5-5.5 2.5Z" />
      <path d="M9 4v13.5M15 6.5V20" />
    </>
  ),
  daha: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </>
  ),
  ayarlar: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 14.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7h-.3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1v-.3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.8 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.3a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4.9Z" />
    </>
  ),
}

const SEKME_ADI: Record<Sekme, string> = {
  ana: 'Ana Sayfa',
  daha: 'Araçlar',
  harita: 'Harita',
  oyunlar: 'Oyunlar',
  ayarlar: 'Ayarlar',
}

// Araçlar Oyunlar'dan önce (deneme girişi, sıralama, hedef gibi asıl
// işler orada), Harita ikisinin arasında, menünün ortasında.
const SEKME_SIRASI: readonly Sekme[] = ['ana', 'daha', 'harita', 'oyunlar', 'ayarlar']
const SEKMELER = SEKME_SIRASI.map((id) => ({ id, ad: SEKME_ADI[id] }))

/** Parmak bu kadar kaymadan sürükleme sayılmıyor; altı dokunuş. */
const SURUKLEME_ESIGI = 6

/** Cam yalnızca iOS'ta; işareti yerleşim betiği koyuyor (`layout.tsx`). */
function camMi(): boolean {
  return typeof document !== 'undefined' && document.documentElement.dataset.platform === 'ios'
}

/**
 * Tablette menü sağ kenarda dikey bir ray (`data-yerlesim="tablet"`, yerleşim
 * betiği koyuyor). Sürükleme ve mercek o zaman yatay değil dikey eksende.
 */
function rayMi(): boolean {
  return typeof document !== 'undefined' && document.documentElement.dataset.yerlesim === 'tablet'
}

/** Parmağın şerit boyunca konumu: telefonda yatay, rayda dikey eksen. */
function eksen(e: { clientX: number; clientY: number }): number {
  return rayMi() ? e.clientY : e.clientX
}

/**
 * Menünün arkasında duran ilk "dolu" zeminin tonu.
 *
 * Kapsülün üst kısmındaki noktada üst üste duran öğelere bakılıyor; menünün
 * kendisi atlanıyor, saydam kutular atlanıyor (`rengiCoz` null), ilk dolu
 * zemin camın tonu oluyor. Hiçbiri yoksa sayfanın zemini.
 */
function arkadakiTon(menu: HTMLElement): Ton | null {
  const kutu = menu.getBoundingClientRect()
  const x = kutu.left + kutu.width / 2
  const y = Math.max(0, kutu.top + kutu.height * 0.35)
  for (const el of document.elementsFromPoint(x, y)) {
    if (menu.contains(el)) continue
    const ton = rengiCoz(getComputedStyle(el).backgroundColor)
    if (ton) return ton
  }
  return rengiCoz(getComputedStyle(document.body).backgroundColor)
}

export function BottomNav({
  sekme,
  onDegis,
}: {
  sekme: Sekme
  onDegis: (sekme: Sekme) => void
}) {
  const menuRef = useRef<HTMLElement>(null)
  const seritRef = useRef<HTMLUListElement>(null)
  const sira = SEKMELER.findIndex((s) => s.id === sekme)

  /*
    Sürükleme (iOS). App Store'un çubuğu gibi: parmak kapsülün üstünde
    kayınca mercek parmağı izliyor, bırakılan sekme açılıyor.

    Parmak eşiği geçmeden işaretçi yakalanmıyor: yakalansaydı bırakma olayı
    şeride gider, düğmenin `click`i hiç gelmez ve kısa dokunuş çalışmazdı.
    Eşik geçilince yakalanıyor ki parmak kapsülden taşsa da izlensin.

    Parmak iner inmez mercek "kalkıyor" (Liquid Glass): parmağın altına
    yaylanarak gidip damla boyuna büyüyor, kapsülden taşıyor (`basili`).
    Eşik geçilince parmağı gecikmesiz izliyor (`suruklendi`). Kısa dokunuşta
    seçimi yine düğmenin `click`i yapıyor; bırakınca mercek yayla oturuyor.
  */
  const [surukleme, setSurukleme] = useState<{
    x: number
    sira: number
    /** Şeridin iç genişliği; büyüteç sekmelerin yerini bundan hesaplıyor. */
    genislik: number
    /** Enine ölçek (`enineOlcek`); parmak inince bir kez ölçülüyor. */
    enine: number
    suruklendi: boolean
    /** Tablet rayı: mercek dikey eksende kayıyor. */
    dikey: boolean
  } | null>(null)
  const parmak = useRef<{ id: number; baslangic: number; suruklendi: boolean } | null>(null)
  const dokunusuYut = useRef(false)

  /*
    Parmak menüdeyken kenardan geri kaydırma kilitli. Sol kenardan başlayan
    bir menü sürüklemesini iOS'un kenar hareketi de tanıyordu: sayfa parmakla
    birlikte kayıyor, bırakınca hem geri gidiliyor hem sekme seçiliyordu.
    Parmak inince kilitleniyor (kenar hareketi parmak biraz yol alınca
    tanınıyor, yani kilit ondan önce konmuş oluyor), kalkınca açılıyor.
  */
  const kilidiAc = useRef<(() => void) | null>(null)
  const kilitBirak = () => {
    kilidiAc.current?.()
    kilidiAc.current = null
  }
  useEffect(() => kilitBirak, [])

  /*
    Şeridin ölçüsü **yerleşim** pikselinde. Tablette `<body>` `zoom`lu
    (`--olcek`, iPad'de ~1,3): `getBoundingClientRect` ve `clientX` ekranda
    görünen (büyütülmüş) pikseli veriyor, merceğe yazılan `translateX` ise
    büyütülmüş kutunun içinde yeniden büyüyor. Ölçü bölünmeden yazılınca
    mercek parmaktan `zoom` kat ileri gidiyordu ve en sağa çekilince kapsülün
    dışına taşıyordu; telefonda `zoom` 1 olduğu için hiç görünmedi. Oran
    ölçülüyor (`offsetWidth` büyütülmemiş genişlik), `--olcek` okunmuyor:
    tarayıcının `zoom`u nasıl uyguladığına güvenmek gerekmiyor.
  */
  const seritOlcusu = () => {
    const serit = seritRef.current
    if (!serit) return null
    const kutu = serit.getBoundingClientRect()
    const stil = getComputedStyle(serit)
    // Rayda aynı hesap dikey eksende: "sol" üst kenar, "genişlik" yükseklik.
    if (rayMi()) {
      const oran = serit.offsetHeight > 0 ? kutu.height / serit.offsetHeight : 1
      const sol = kutu.top + parseFloat(stil.paddingTop) * oran
      const genislik =
        serit.offsetHeight - parseFloat(stil.paddingTop) - parseFloat(stil.paddingBottom)
      return { sol, genislik, oran }
    }
    const oran = serit.offsetWidth > 0 ? kutu.width / serit.offsetWidth : 1
    const sol = kutu.left + parseFloat(stil.paddingLeft) * oran
    const genislik = serit.offsetWidth - parseFloat(stil.paddingLeft) - parseFloat(stil.paddingRight)
    return { sol, genislik, oran }
  }

  /** Parmağın konumundan merceğin yeri ve parmağın altındaki sekme. */
  const parmaktanMercek = (konum: number) => {
    const olcu = seritOlcusu()
    if (!olcu) return null
    const x = (konum - olcu.sol) / olcu.oran
    return {
      x: mercekKonumu(x, olcu.genislik, SEKMELER.length, SURUKLEME_OLCEGI),
      sira: parmaktanSira(x, olcu.genislik, SEKMELER.length),
      genislik: olcu.genislik,
    }
  }

  const parmakIndi = (e: React.PointerEvent<HTMLUListElement>) => {
    if (!camMi() || !e.isPrimary) return
    parmak.current = { id: e.pointerId, baslangic: eksen(e), suruklendi: false }
    kilitBirak()
    kilidiAc.current = geriKaydirmayiKilitle()
    // Basılı tutunca mercek kalkıyor (kaydırmadan da). Ölçüler dönüşümsüz
    // yerleşimden; mercek o an yaylanarak küçülüyor olsa da doğru çıkıyor.
    // Rayda (tablet) enine eksen yatay: kalınlık genişlikten ölçülüyor.
    const yer = parmaktanMercek(eksen(e))
    const menu = menuRef.current
    const mercek = seritRef.current?.querySelector<HTMLElement>('.alt-menu-mercek')
    if (!yer || !menu || !mercek) return
    const dikey = rayMi()
    const enine = dikey
      ? enineOlcek(menu.offsetWidth, mercek.offsetWidth)
      : enineOlcek(menu.offsetHeight, mercek.offsetHeight)
    setSurukleme({ ...yer, enine, suruklendi: false, dikey })
  }

  const parmakKaydi = (e: React.PointerEvent<HTMLUListElement>) => {
    const p = parmak.current
    if (!p || p.id !== e.pointerId) return
    if (!p.suruklendi) {
      if (Math.abs(eksen(e) - p.baslangic) < SURUKLEME_ESIGI) return
      p.suruklendi = true
      // İşaretçi o arada bırakılmışsa yakalama hata fırlatıyor; yakalanamasa
      // da sürükleme şeridin içinde çalışmaya devam ediyor.
      try {
        seritRef.current?.setPointerCapture(e.pointerId)
      } catch {}
    }
    const yer = parmaktanMercek(eksen(e))
    if (!yer) return
    setSurukleme((onceki) => (onceki ? { ...onceki, ...yer, suruklendi: true } : null))
  }

  const parmakKalkti = (e: React.PointerEvent<HTMLUListElement>) => {
    const p = parmak.current
    if (!p || p.id !== e.pointerId) return
    parmak.current = null
    kilitBirak()
    if (!p.suruklendi) {
      // Kısa dokunuş: seçimi düğmenin `click`i yapıyor, mercek yalnızca iniyor.
      setSurukleme(null)
      return
    }
    // Yakalama bitince tarayıcı bir `click` daha yollayabiliyor; sürüklemenin
    // sonucu zaten seçildi, o tıklama ikinci kez seçmesin.
    dokunusuYut.current = true
    window.setTimeout(() => {
      dokunusuYut.current = false
    }, 0)
    const secilen = surukleme ? SEKMELER[surukleme.sira].id : null
    setSurukleme(null)
    if (secilen && secilen !== sekme) onDegis(secilen)
  }

  const parmakIptal = () => {
    kilitBirak()
    parmak.current = null
    setSurukleme(null)
  }

  /*
    Renk uyumu (iOS). Cam arkasındaki zeminin tonunu alıyor: sayfa kaydıkça,
    ekran değiştikçe renkli bir kartın üstüne gelen kapsül o renge bürünüyor,
    koyu bir yüzeyin üstünde yazılar açığa dönüyor.

    Örnek kaydırmada kare başına bir kez alınıyor; ekran değişimi kaydırma
    olmadan da arkayı değiştirdiği için seyrek bir zamanlayıcı da var. Değer
    değişmedikçe stile dokunulmuyor — her karede yazmak her karede yeniden
    stil hesabı demek.
  */
  useEffect(() => {
    const menu = menuRef.current
    if (!menu || !camMi()) return
    let kare = 0
    let son = ''
    const ornekle = () => {
      kare = 0
      const ton = arkadakiTon(menu)
      if (!ton) return
      const deger = `${ton.r} ${ton.g} ${ton.b}`
      if (deger === son) return
      son = deger
      menu.style.setProperty('--cam-ton', deger)
      menu.dataset.koyu = String(parlaklik(ton) < KOYU_ESIGI)
    }
    const istek = () => {
      if (!kare) kare = requestAnimationFrame(ornekle)
    }
    ornekle()
    window.addEventListener('scroll', istek, { passive: true })
    window.addEventListener('resize', istek)
    const aralik = window.setInterval(istek, 700)
    return () => {
      cancelAnimationFrame(kare)
      window.removeEventListener('scroll', istek)
      window.removeEventListener('resize', istek)
      window.clearInterval(aralik)
    }
  }, [])

  const gorunenSira = surukleme?.sira ?? sira

  return (
    /*
      Menü zeminden ayrılan, üst köşeleri yuvarlatılmış bir yüzey — tasarımda
      ekranın devamı değil, üstüne oturmuş ayrı bir parça. Yanlarda boşluk yok:
      telefonun alt kenarına yapışık duruyor, yalnızca köşeleri kırılıyor.

      Zemin **donuk** ve `backdrop-blur` yok. Bir süre yarı saydam ve bulanıktı;
      görsel katkısı yoktu (zemin zaten %95 donuktu) ama bedeli büyüktü: menü
      sayfanın üstünde duruyor ve altındaki içerik her kıpırdadığında —
      kaydırmada, ekran geçişinde — WebView arkayı yeniden bulanıklaştırmak
      zorunda kalıyor. Ekran geçişi bu yüzden takılıyordu.

      **iOS'ta cam** (`alt-menu` sınıfı, `globals.css` → "Camdan alt menü").
      Yukarıdaki bedel Android WebView'ın; WKWebView arkayı GPU'da
      bulanıklaştırıyor ve camdan çubuk iOS 26'nın kendi dili. Android bu
      yüzden donuk kalıyor — kararı geri almadan önce Android'de ekran
      geçişini telefonda dene.
    */
    <nav
      data-yuzen
      ref={menuRef}
      data-basili={surukleme ? '' : undefined}
      data-surukleniyor={surukleme?.suruklendi ? '' : undefined}
      /*
        Tablette (`tablet:`) aynı menü sağ kenarda dikey bir ray: ekranın
        yüksekliği boyunca uzanan, sol köşeleri kırık bir yüzey. Neden sağ ve
        neden `zoom`lu ölçüde: `globals.css` → "Tablet yerleşimi". iOS'ta
        kapsül yine cam, bu kez dikey (aynı dosya, "Camdan ray").
      */
      className={cn(
        'alt-menu guvenli-alt fixed inset-x-0 bottom-0 z-40 rounded-t-[26px] border-t border-border bg-card shadow-[0_-6px_22px_rgba(54,33,112,0.12)]',
        'tablet:inset-x-auto tablet:top-0 tablet:right-0 tablet:flex tablet:w-[calc(var(--ray)+var(--guvenli-sag))] tablet:items-center',
        'tablet:rounded-t-none tablet:rounded-l-[26px] tablet:border-t-0 tablet:border-l tablet:pt-[var(--guvenli-ust)] tablet:pr-[var(--guvenli-sag)]',
        'tablet:shadow-[-6px_0_22px_rgba(54,33,112,0.10)]',
      )}
      style={
        {
          '--sekme-sira': sira,
          ...(surukleme
            ? {
                [surukleme.dikey ? '--mercek-y' : '--mercek-x']: `${surukleme.x}px`,
                '--mercek-olcek': SURUKLEME_OLCEGI,
                '--mercek-enine': surukleme.enine,
              }
            : {}),
        } as React.CSSProperties
      }
    >
      <ul
        ref={seritRef}
        className="relative mx-auto flex max-w-md px-2 pt-2.5 pb-1 tablet:w-full tablet:flex-col tablet:px-2 tablet:py-2"
        onPointerDown={parmakIndi}
        onPointerMove={parmakKaydi}
        onPointerUp={parmakKalkti}
        onPointerCancel={parmakIptal}
      >
        {/*
          Seçili sekmenin arkasındaki cam mercek; yalnızca iOS'ta görünüyor.
          Her düğmede ayrı bir zemin olsaydı sekme değişince biri söner öteki
          yanardı; tek mercek sekmeden sekmeye kayıyor.
        */}
        <span className="alt-menu-mercek" aria-hidden />
        {SEKMELER.map(({ id, ad }, i) => {
          const aktif = sekme === id
          // Sürüklerken renk parmağın altındaki sekmeye geçiyor; seçim ancak
          // bırakınca değişiyor.
          const vurgulu = i === gorunenSira
          /*
            Büyüteç: sürüklerken merceğin altından geçen simge büyüyor
            (App Store'un çubuğu gibi). Merceğin ortası ile sekmenin ortası
            arasındaki uzaklıktan; bırakınca hepsi yerine dönüyor.
          */
          let buyutec = 1
          if (surukleme) {
            const sutun = surukleme.genislik / SEKMELER.length
            buyutec = buyutecOlcegi(surukleme.x + sutun / 2 - (i + 0.5) * sutun, sutun)
          }
          return (
            <li key={id} className="flex-1 tablet:h-[68px] tablet:flex-none">
              <button
                type="button"
                data-tanitim={id === 'oyunlar' ? 'oyunlar-ac' : id === 'daha' ? 'araclar-ac' : id === 'harita' ? 'harita-ac' : undefined}
                onClick={() => {
                  if (dokunusuYut.current) return
                  onDegis(id)
                }}
                aria-current={aktif ? 'page' : undefined}
                className={cn(
                  'flex w-full justify-center rounded-xl py-1.5 text-[11px] font-bold transition',
                  'tablet:h-full tablet:items-center',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  vurgulu ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <span
                  className="alt-menu-icerik flex flex-col items-center gap-1"
                  style={{ transform: buyutec === 1 ? undefined : `scale(${buyutec})` }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width={24}
                    height={24}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={vurgulu ? 2.3 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {SIMGELER[id]}
                  </svg>
                  {ad}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
