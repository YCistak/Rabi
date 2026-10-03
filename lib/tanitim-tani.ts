/*
  Tanıtım rehberinin gizli tanı kaydı — geliştirici aracı, ürün özelliği değil.

  Spotun takılması başsız WebKit'te görünmedi, gerçek iPhone/iPad'de göründü;
  aradaki farkı (kaydırmanın, görünür alanın, güvenli alanın o anki değerleri)
  cihazın kendisinden okumanın başka yolu yok. Ayarlar'da başlığa beş kez
  dokununca açılıyor; açıkken rehber her adımda hedefin ve spotun
  dikdörtgenini, kaydırmayı, görünür alanı ve zaman damgalarını buraya yazıyor,
  Ayarlar'daki "Tanı kaydı" satırından kopyalanıyor ya da paylaşılıyor.

  Varsayılan kapalı ve kapalıyken her çağrı tek bir boole denetimi: rehber
  normal kullanımda hiçbir şey ölçmüyor, yazmıyor. Kayıt cihazda kalıyor, ağa
  çıkmıyor.
*/

const ACIK_ANAHTARI = 'rabi_tani_acik'
const KAYIT_ANAHTARI = 'rabi_tani_kaydi'
/** Kaydın tavanı: bir tur ~40 adım, adım başına en çok birkaç düzine satır. */
const EN_COK_SATIR = 4000

let acik: boolean | null = null
let satirlar: string[] | null = null

export function taniAcikMi(): boolean {
  if (acik === null) {
    try { acik = localStorage.getItem(ACIK_ANAHTARI) === '1' } catch { acik = false }
  }
  return acik
}

export function taniAyarla(deger: boolean) {
  acik = deger
  try {
    if (deger) localStorage.setItem(ACIK_ANAHTARI, '1')
    else { localStorage.removeItem(ACIK_ANAHTARI); localStorage.removeItem(KAYIT_ANAHTARI) }
  } catch {}
  if (!deger) satirlar = []
}

function yukle(): string[] {
  if (satirlar) return satirlar
  try { satirlar = JSON.parse(localStorage.getItem(KAYIT_ANAHTARI) ?? '[]') as string[] } catch { satirlar = [] }
  return satirlar
}

let kayitZamanlayici: ReturnType<typeof setTimeout> | null = null
function sakla() {
  // Her satırda değil, bir an sonra toplu: kayıt, ölçülen kareleri ağırlaştırmasın.
  if (kayitZamanlayici) return
  kayitZamanlayici = setTimeout(() => {
    kayitZamanlayici = null
    try { localStorage.setItem(KAYIT_ANAHTARI, JSON.stringify(satirlar ?? [])) } catch {}
  }, 1000)
}

const yuvarla = (v: number) => Math.round(v * 10) / 10
/** Dikdörtgeni kısa diziye çevirir: [sol, üst, genişlik, yükseklik]. */
export function taniKutu(r: { left: number; top: number; width: number; height: number } | null | undefined) {
  return r ? [yuvarla(r.left), yuvarla(r.top), yuvarla(r.width), yuvarla(r.height)] : null
}

/** Pencerenin ve görünür alanın o anki hâli (her satıra eklenir). */
function ortamOzeti() {
  const vv = window.visualViewport
  return {
    sy: yuvarla(window.scrollY),
    vv: vv ? [yuvarla(vv.offsetTop), yuvarla(vv.pageTop), yuvarla(vv.width), yuvarla(vv.height), yuvarla(vv.scale)] : null,
    html: yuvarla(document.documentElement.getBoundingClientRect().top),
    ih: window.innerHeight,
  }
}

export function taniKaydet(olay: string, veri: Record<string, unknown> = {}) {
  if (!taniAcikMi()) return
  const liste = yukle()
  liste.push(JSON.stringify({ t: Math.round(performance.now()), z: Date.now() % 100000, olay, ...ortamOzeti(), ...veri }))
  if (liste.length > EN_COK_SATIR) liste.splice(0, liste.length - EN_COK_SATIR)
  sakla()
}

export function taniSatirSayisi(): number {
  return taniAcikMi() ? yukle().length : 0
}

export function taniTemizle() {
  satirlar = []
  try { localStorage.removeItem(KAYIT_ANAHTARI) } catch {}
}

/** Paylaşılacak metin: başta cihazın sabitleri, altında satırlar. */
export function taniMetni(): string {
  const kok = getComputedStyle(document.documentElement)
  const olcu = document.createElement('div')
  olcu.style.cssText = 'position:fixed;visibility:hidden;padding-top:var(--guvenli-ust);padding-bottom:var(--guvenli-alt)'
  document.body.append(olcu)
  const guvenli = [getComputedStyle(olcu).paddingTop, getComputedStyle(olcu).paddingBottom]
  olcu.remove()
  const bas = {
    ua: navigator.userAgent, dpr: window.devicePixelRatio, ekran: [screen.width, screen.height], pencere: [window.innerWidth, window.innerHeight],
    olcek: kok.getPropertyValue('--olcek').trim(), yerlesim: document.documentElement.dataset.yerlesim ?? 'telefon',
    platform: document.documentElement.dataset.platform ?? '', guvenli,
  }
  return ['RABİ TANITIM TANI KAYDI', JSON.stringify(bas), ...yukle()].join('\n')
}
