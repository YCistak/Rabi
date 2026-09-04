'use client'

/**
 * Haftalık özetin paylaşılabilir görseli.
 *
 * Ekrandaki kartların görüntüsü alınmıyor, görsel **yeniden çiziliyor**. İki
 * sebep: ekran görüntüsü alan kütüphaneler (html2canvas gibi) birkaç yüz KB
 * geliyor ve CSS'in yarısını yanlış yorumluyor; ayrıca paylaşılan görselin
 * telefonun ekran oranından bağımsız, her yerde aynı görünmesi gerekiyor.
 * Burada 1080×1920 sabit bir tuval var — hikâye (story) oranı.
 *
 * Yazı tipi ailesi sayfadan okunuyor: `next/font` üretilen aile adını rastgele
 * bir sınıfın arkasına saklıyor, elle "Space Grotesk" yazmak tutmuyordu.
 */

import type { HaftalikOzet } from './ozet'
import { dakikaYaz, haftaYaz } from './ozet'
import { netYaz } from './hesap'

const GENISLIK = 1080
const YUKSEKLIK = 1920

const BEYAZ = '#FFFFFF'
const SOLUK = 'rgba(255,255,255,0.72)'
const COK_SOLUK = 'rgba(255,255,255,0.16)'

// --- Afiş paleti (tasarım: `Ozet 1d Afis`) ---
const AFIS_KENAR = 84
const FIL_DISI = '#FFF4E1'
const ACIK_VURGU = '#F6B27A'
const CIZGI = 'rgba(255,255,255,0.12)'
const KUTU_ZEMINI = 'rgba(255,255,255,0.07)'

type Yazitipleri = { baslik: string; govde: string }

/**
 * Sayfadaki gerçek yazı tipi adlarını okur. Gizli bir öğe kurulup hesaplanmış
 * `font-family` alınıyor; `--font-display` değişkeni doğrudan okunsaydı
 * `var(--font-space-grotesk), …` gibi çözülmemiş bir metin dönerdi.
 */
function yazitipleriniOku(): Yazitipleri {
  const olc = document.createElement('span')
  olc.style.position = 'absolute'
  olc.style.visibility = 'hidden'
  olc.className = 'font-display'
  document.body.appendChild(olc)
  const baslik = getComputedStyle(olc).fontFamily
  document.body.removeChild(olc)

  return { baslik, govde: getComputedStyle(document.body).fontFamily }
}

/**
 * Özetin paylaşılabilir PNG'si — 1080×1920 afiş.
 *
 * Ekrandaki hikâyenin **özeti**, kopyası değil: on kartı tek görsele sığdırmak
 * hepsini okunmaz yapardı. Afiş haftanın taşıyıcı sayısını (soru), onun yedi
 * günlük dağılımını ve dört kutuda geri kalanını gösteriyor.
 */
export async function ozetGorseliUret(ozet: HaftalikOzet): Promise<Blob | null> {
  if (typeof document === 'undefined') return null

  // Yazı tipleri yüklenmeden çizilirse tuval yedek yazı tipiyle boyar ve
  // görsel uygulamadakine hiç benzemez.
  try {
    await document.fonts.ready
  } catch {
    // Desteklenmiyorsa yedek yazı tipiyle devam; görsel yine de üretilsin.
  }

  const tuval = document.createElement('canvas')
  tuval.width = GENISLIK
  tuval.height = YUKSEKLIK
  const ctx = tuval.getContext('2d')
  if (!ctx) return null

  const yazi = yazitipleriniOku()
  const maskot = await maskotuYukle()

  afisZeminiCiz(ctx)
  afisIcerigiCiz(ctx, ozet, yazi, maskot)

  return new Promise((coz) => tuval.toBlob((blob) => coz(blob), 'image/png'))
}

/**
 * Maskotun görselini yükler; yüklenemezse `null`.
 *
 * Aynı kökten (`public/`) geldiği için tuval kirlenmiyor ve `toBlob` çalışmaya
 * devam ediyor. Yüklenemezse afiş çizgi tavşana düşüyor — kırık görsel simgesi
 * yerine uygulamanın kendi imzası.
 */
function maskotuYukle(): Promise<HTMLImageElement | null> {
  return new Promise((coz) => {
    const gorsel = new Image()
    gorsel.onload = () => coz(gorsel)
    gorsel.onerror = () => coz(null)
    gorsel.src = '/tavsan-yuz.png'
  })
}

/**
 * Afişin zemini — tasarımdaki `radial-gradient(120% 60% at 22% 2%, …)`.
 *
 * Tuvalin radyal geçişi yalnızca **daire** çizebiliyor; elips, dikey eksende
 * ölçek verilerek kuruluyor. Düz bir daire kullanılsaydı geçiş çok erken
 * kapanır, afişin üst yarısı olduğundan koyu çıkardı.
 */
function afisZeminiCiz(ctx: CanvasRenderingContext2D) {
  const merkezX = GENISLIK * 0.22
  const merkezY = YUKSEKLIK * 0.02
  const yaricap = GENISLIK * 1.2
  // Yatay %120, dikey %60 → dikeyde yarı ölçek.
  const dikeyOlcek = (YUKSEKLIK * 0.6) / yaricap

  ctx.save()
  ctx.translate(0, merkezY)
  ctx.scale(1, dikeyOlcek)
  ctx.translate(0, -merkezY / dikeyOlcek)

  const gecis = ctx.createRadialGradient(merkezX, merkezY, 0, merkezX, merkezY, yaricap)
  gecis.addColorStop(0, '#4A2312')
  gecis.addColorStop(0.55, '#1C0E07')
  gecis.addColorStop(1, '#120A06')
  ctx.fillStyle = gecis
  ctx.fillRect(-GENISLIK, -YUKSEKLIK * 2, GENISLIK * 3, YUKSEKLIK * 5)
  ctx.restore()
}

function afisIcerigiCiz(
  ctx: CanvasRenderingContext2D,
  ozet: HaftalikOzet,
  yazi: Yazitipleri,
  maskot: HTMLImageElement | null,
) {
  const kenar = AFIS_KENAR
  const enFazla = GENISLIK - kenar * 2
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  // --- Başlık satırı: maskot + "Rabi", sağda hafta hapı ---
  if (maskot) ctx.drawImage(maskot, kenar, 96, 104, 112)
  else tavsanCiz(ctx, kenar, 96, 1.05)

  ctx.fillStyle = FIL_DISI
  ctx.font = `900 46px ${yazi.baslik}`
  ctx.fillText('Rabi', kenar + 128, 172)

  const hafta = haftaYaz(ozet.hafta).toLocaleUpperCase('tr')
  ctx.font = `900 30px ${yazi.baslik}`
  const hapGenislik = harfAraliginaGore(ctx, hafta, 0.16) + 64
  const hapX = GENISLIK - kenar - hapGenislik
  yuvarlakKutu(ctx, hapX, 122, hapGenislik, 66, 33)
  ctx.fillStyle = 'rgba(255,255,255,0.09)'
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(255,255,255,0.16)'
  ctx.stroke()
  ctx.fillStyle = FIL_DISI
  aralikliYaz(ctx, hafta, hapX + 32, 166, 0.16)

  // --- Taşıyıcı sayı: haftanın soru toplamı + hedef halkası ---
  ctx.fillStyle = ACIK_VURGU
  ctx.font = `900 34px ${yazi.baslik}`
  aralikliYaz(ctx, 'BU HAFTA ÇÖZDÜĞÜM SORU', kenar, 316, 0.2)

  const halkaVar = ozet.haftalikHedef > 0
  const sayiAlani = enFazla - (halkaVar ? 280 : 0)
  const sayiPunto = punto(ctx, String(ozet.toplamSoru), sayiAlani, 300, yazi.baslik)
  ctx.fillStyle = FIL_DISI
  ctx.font = `900 ${sayiPunto}px ${yazi.baslik}`
  ctx.fillText(String(ozet.toplamSoru), kenar, 596)

  if (halkaVar) {
    halkaCiz(
      ctx,
      GENISLIK - kenar - 240,
      356,
      240,
      22,
      Math.min(1, ozet.hedefOrani),
      `%${Math.round(ozet.hedefOrani * 100)}`,
      'HEDEF',
      yazi,
    )
  }

  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = `700 38px ${yazi.govde}`
  ctx.fillText(kisalt(ctx, hedefCumlesi(ozet), enFazla), kenar, 676)

  // --- Yedi günlük çubuk kutusu ---
  const kutuY = 740
  const kutuYuksekligi = 366
  yuvarlakKutu(ctx, kenar, kutuY, enFazla, kutuYuksekligi, 48)
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = CIZGI
  ctx.stroke()

  gunCubuklariCiz(ctx, ozet, kenar + 40, kutuY + 44, enFazla - 80, 250, yazi)

  // --- Dört kutu ---
  const kutuGenislik = (enFazla - 24) / 2
  const dortluY = kutuY + kutuYuksekligi + 56
  const dortluYukseklik = 216

  dortKutu(ozet).forEach((kutu, i) => {
    const x = kenar + (i % 2) * (kutuGenislik + 24)
    const y = dortluY + Math.floor(i / 2) * (dortluYukseklik + 24)

    yuvarlakKutu(ctx, x, y, kutuGenislik, dortluYukseklik, 40)
    if (kutu.vurgulu) {
      const gecis = ctx.createLinearGradient(x, y, x + kutuGenislik, y + dortluYukseklik)
      gecis.addColorStop(0, '#E07A34')
      gecis.addColorStop(1, '#B3491F')
      ctx.fillStyle = gecis
      ctx.fill()
    } else {
      ctx.fillStyle = KUTU_ZEMINI
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = CIZGI
      ctx.stroke()
    }

    const degerPunto = punto(ctx, kutu.deger, kutuGenislik - 72, 68, yazi.baslik)
    ctx.fillStyle = FIL_DISI
    ctx.font = `900 ${degerPunto}px ${yazi.baslik}`
    ctx.fillText(kutu.deger, x + 36, y + 96)

    // Etiket önce **küçülüyor**, sonra kısalıyor: "EN YÜKSEK NET · 2 DENEME"
    // kesildiğinde geriye kutunun ne anlattığını söylemeyen bir baş kalıyordu.
    ctx.fillStyle = kutu.vurgulu ? 'rgba(255,244,225,0.8)' : 'rgba(255,255,255,0.55)'
    let etiketPunto = 24
    ctx.font = `900 ${etiketPunto}px ${yazi.baslik}`
    while (etiketPunto > 18 && harfAraliginaGore(ctx, kutu.etiket, 0.16) > kutuGenislik - 72) {
      etiketPunto -= 1
      ctx.font = `900 ${etiketPunto}px ${yazi.baslik}`
    }
    aralikliYaz(ctx, aralikliKisalt(ctx, kutu.etiket, kutuGenislik - 72, 0.16), x + 36, y + 152, 0.16)
  })

  // --- Alt imza ---
  const cizgiY = YUKSEKLIK - 84 - 72
  ctx.beginPath()
  ctx.moveTo(kenar, cizgiY)
  ctx.lineTo(GENISLIK - kenar, cizgiY)
  ctx.lineWidth = 2
  ctx.strokeStyle = CIZGI
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = `900 30px ${yazi.baslik}`
  aralikliYaz(ctx, 'RABİ · HAFTALIK ÖZET', kenar, cizgiY + 52, 0.18)

  ctx.fillStyle = ACIK_VURGU
  ctx.font = `900 30px ${yazi.baslik}`
  const kapanis = kapanisCumlesi(ozet)
  aralikliYaz(ctx, kapanis, GENISLIK - kenar - harfAraliginaGore(ctx, kapanis, 0.06), cizgiY + 52, 0.06)
}

/** Afişteki dört kutu. Sonuncusu haftanın dersi ve tek vurgulu olan. */
function dortKutu(
  ozet: HaftalikOzet,
): { deger: string; etiket: string; vurgulu?: boolean }[] {
  const birinci = ozet.ilkUcDers[0]
  return [
    {
      deger: ozet.pomodoroDakika > 0 ? dakikaYaz(ozet.pomodoroDakika) : '—',
      etiket: `POMODORO · ${ozet.pomodoroSeans} OTURUM`,
    },
    {
      deger: ozet.denemeEnYuksek ? netYaz(ozet.denemeEnYuksek.net) : '—',
      etiket: `EN YÜKSEK NET · ${ozet.denemeSayisi} DENEME`,
    },
    {
      deger: ozet.oyunTur > 0 ? dakikaYaz(ozet.oyunDakika) : '—',
      etiket: `MİNİ OYUN · ${ozet.oyunTur} TUR`,
    },
    {
      deger: birinci ? birinci.ders : '—',
      etiket: birinci ? `HAFTANIN DERSİ · ${birinci.soru} SORU` : 'HAFTANIN DERSİ · YOK',
      vurgulu: true,
    },
  ]
}

/** Afişteki yedi günlük çubuklar — ekrandaki hedef kartının aynısı. */
function gunCubuklariCiz(
  ctx: CanvasRenderingContext2D,
  ozet: HaftalikOzet,
  x: number,
  y: number,
  genislik: number,
  yukseklik: number,
  yazi: Yazitipleri,
) {
  const bosluk = 22
  const sutun = (genislik - bosluk * 6) / 7
  const enYuksek = Math.max(1, ...ozet.gunler.map((g) => g.soru))
  // Etiket satırı çubuğun altında; çubuk alanı onun kadar kısalıyor.
  const cubukAlani = yukseklik - 44

  ozet.gunler.forEach((gun, i) => {
    const sutunX = x + i * (sutun + bosluk)
    const oran = gun.soru === 0 ? 0.04 : Math.max(0.08, gun.soru / enYuksek)
    const boy = cubukAlani * oran
    const enIyi = ozet.enIyiGun?.iso === gun.iso

    yuvarlakKutu(ctx, sutunX, y + cubukAlani - boy, sutun, boy, 16)
    ctx.fillStyle = enIyi
      ? ACIK_VURGU
      : gun.soru === 0
        ? 'rgba(255,255,255,0.18)'
        : 'rgba(255,255,255,0.34)'
    ctx.fill()

    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = `900 22px ${yazi.baslik}`
    ctx.textAlign = 'center'
    ctx.fillText(gun.ad, sutunX + sutun / 2, y + yukseklik)
    ctx.textAlign = 'left'
  })
}

/** Ortasında iki satır yazı olan ilerleme halkası. */
function halkaCiz(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  boyut: number,
  kalinlik: number,
  oran: number,
  ust: string,
  alt: string,
  yazi: Yazitipleri,
) {
  const merkezX = x + boyut / 2
  const merkezY = y + boyut / 2
  const yaricap = (boyut - kalinlik) / 2

  ctx.lineWidth = kalinlik
  ctx.lineCap = 'round'

  ctx.beginPath()
  ctx.arc(merkezX, merkezY, yaricap, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.16)'
  ctx.stroke()

  if (oran > 0) {
    ctx.beginPath()
    // Tepeden başlıyor (saat 12) — ekrandaki `rotate(-90deg)` ile aynı.
    ctx.arc(merkezX, merkezY, yaricap, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * oran)
    ctx.strokeStyle = ACIK_VURGU
    ctx.stroke()
  }
  ctx.lineCap = 'butt'

  ctx.textAlign = 'center'
  ctx.fillStyle = FIL_DISI
  ctx.font = `900 58px ${yazi.baslik}`
  ctx.fillText(ust, merkezX, merkezY + 8)

  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = `900 22px ${yazi.baslik}`
  aralikliYaz(ctx, alt, merkezX - harfAraliginaGore(ctx, alt, 0.14) / 2, merkezY + 52, 0.14)
  ctx.textAlign = 'left'
}

/**
 * Harf aralıklı yazı.
 *
 * Tuvalin `letterSpacing`i her tarayıcıda yok (WebView sürümüne bağlı) ve
 * afişteki bütün büyük harfli etiketler aralıklı yazılıyor — aralıksız
 * yazılsalardı tasarımdaki düzenin yarısı kayardı. Harfler tek tek çiziliyor.
 */
function aralikliYaz(
  ctx: CanvasRenderingContext2D,
  metin: string,
  x: number,
  y: number,
  aralik: number,
) {
  const puntosu = puntoOku(ctx)
  let imlec = x
  for (const harf of metin) {
    ctx.fillText(harf, imlec, y)
    imlec += ctx.measureText(harf).width + puntosu * aralik
  }
}

/**
 * Aralıklı yazılan metni sığdıracak kadar kısaltır.
 *
 * `kisalt` ile ölçülemiyor: o `measureText`e bakıyor, aralık payını saymıyor
 * ve etiketler kutunun kenarından taşıyordu — "HAFTANIN DERSİ · 156 SORU"
 * aralıksız sığıyor, aralıklı sığmıyor.
 */
function aralikliKisalt(
  ctx: CanvasRenderingContext2D,
  metin: string,
  enFazla: number,
  aralik: number,
): string {
  if (harfAraliginaGore(ctx, metin, aralik) <= enFazla) return metin
  let kesik = metin
  while (kesik.length > 1 && harfAraliginaGore(ctx, `${kesik}…`, aralik) > enFazla) {
    kesik = kesik.slice(0, -1)
  }
  return `${kesik}…`
}

/** Aralıklı yazılacak metnin toplam genişliği — kutuyu ona göre ölçmek için. */
function harfAraliginaGore(ctx: CanvasRenderingContext2D, metin: string, aralik: number): number {
  const puntosu = puntoOku(ctx)
  let toplam = 0
  for (const harf of metin) toplam += ctx.measureText(harf).width + puntosu * aralik
  return Math.max(0, toplam - puntosu * aralik)
}

/** `ctx.font` içindeki punto — aralık hesabı buna oranlı. */
function puntoOku(ctx: CanvasRenderingContext2D): number {
  return Number.parseFloat(/(\d+(?:\.\d+)?)px/.exec(ctx.font)?.[1] ?? '16')
}

/**
 * Halkanın altındaki satır — hedef ve kaç günde tutturulduğu.
 *
 * İki bilgi birlikte: yalnızca haftalık toplam yazılsaydı hedefi bir günde
 * kapatan da yedi güne yayan da aynı cümleyi görürdü.
 */
function hedefCumlesi(ozet: HaftalikOzet): string {
  if (ozet.haftalikHedef <= 0) return 'Haftalık hedef belirlenmemiş'
  return `Haftalık hedef ${ozet.haftalikHedef} soru · 7 günün ${ozet.hedefliGun}'ünde tutturdum`
}

/** Afişin sağ alt köşesindeki cümle — ekrandaki kapanış kartının birinci tekili. */
function kapanisCumlesi(ozet: HaftalikOzet): string {
  if (ozet.hedefDurumu === 'asti') return 'Bu haftayı ben kazandım'
  if (ozet.hedefDurumu === 'tutturdu') return 'Sözümü tuttum'
  return 'Sıradaki hafta daha iyi'
}

/** Sığmayan ders adını üç noktayla kısaltır. */
function kisalt(ctx: CanvasRenderingContext2D, metin: string, enFazla: number): string {
  if (ctx.measureText(metin).width <= enFazla) return metin
  let kesik = metin
  while (kesik.length > 1 && ctx.measureText(`${kesik}…`).width > enFazla) {
    kesik = kesik.slice(0, -1)
  }
  return `${kesik}…`
}

function yuvarlakKutu(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  genislik: number,
  yukseklik: number,
  yaricap: number,
) {
  ctx.beginPath()
  ctx.roundRect(x, y, genislik, yukseklik, yaricap)
}

// ---------------------------------------------------------------------------
// Tek kartın paylaşılabilir görseli
//
// Kullanıcı ekranda kart kart ilerleyen bir hikâye izliyor ama paylaş düğmesi
// ona hep aynı toplu afişi veriyordu — "gördüğüm şey bu değil" duygusu.
// Instagram hikâyesinde ne bakıyorsan onu paylaşırsın; buradaki de aynı
// mantıkta: hangi kart açıksa onun görseli üretiliyor, ekrandakiyle aynı
// zemin, aynı sayı, aynı cümle.
// ---------------------------------------------------------------------------

/** Bir kartın görsele dökülebilir hâli. Kartlar bunu kendileri tanımlıyor. */
export type OzetKartVerisi = {
  /** Üstteki küçük etiket — "Bu hafta çözdüğün soru" gibi. */
  ustluk: string
  /** Kartın taşıyıcı değeri. Genişliğe göre kendiliğinden küçülür. */
  dev: string
  /** Sayının altındaki cümle. */
  alt: string
  /** İsteğe bağlı ek satırlar ("En düşük 68,25" gibi) — kutucuk olarak çizilir. */
  ekstra?: string[]
  /** Zemin geçişinin iki ucu. Ekrandaki kartla aynı renkler. */
  renkler: readonly [string, string]
}

/** Hikâye kartının PNG'si. `sira`/`toplam` üstteki ilerleme çizgisini çizer. */
export async function kartGorseliUret(
  veri: OzetKartVerisi,
  haftaMetni: string,
  sira: number,
  toplam: number,
): Promise<Blob | null> {
  if (typeof document === 'undefined') return null
  try {
    await document.fonts.ready
  } catch {
    // yedek yazı tipiyle devam
  }

  const tuval = document.createElement('canvas')
  tuval.width = GENISLIK
  tuval.height = YUKSEKLIK
  const ctx = tuval.getContext('2d')
  if (!ctx) return null

  const yazi = yazitipleriniOku()

  kartZeminiCiz(ctx, veri.renkler)
  ilerlemeCiz(ctx, sira, toplam)
  kartIcerigiCiz(ctx, veri, haftaMetni, yazi)

  return new Promise((coz) => tuval.toBlob((blob) => coz(blob), 'image/png'))
}

function kartZeminiCiz(ctx: CanvasRenderingContext2D, renkler: readonly [string, string]) {
  // CSS'teki `linear-gradient(160deg, …)` ile aynı yön: hafif sağa yatık, yukarıdan aşağı.
  const gecis = ctx.createLinearGradient(GENISLIK * 0.25, 0, GENISLIK * 0.75, YUKSEKLIK)
  gecis.addColorStop(0, renkler[0])
  gecis.addColorStop(1, renkler[1])
  ctx.fillStyle = gecis
  ctx.fillRect(0, 0, GENISLIK, YUKSEKLIK)

  ctx.fillStyle = 'rgba(255,255,255,0.055)'
  for (const [x, y, r] of [
    [900, 300, 420],
    [90, 1240, 330],
    [1000, 1760, 300],
  ]) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // Alt kenara doğru koyulaşan bir perde: metin zeminden ayrışsın.
  const perde = ctx.createLinearGradient(0, YUKSEKLIK * 0.55, 0, YUKSEKLIK)
  perde.addColorStop(0, 'rgba(0,0,0,0)')
  perde.addColorStop(1, 'rgba(0,0,0,0.22)')
  ctx.fillStyle = perde
  ctx.fillRect(0, YUKSEKLIK * 0.55, GENISLIK, YUKSEKLIK * 0.45)
}

/** Hikâyenin üstündeki bölmeli çizgi — görsele bakan "bu bir hikâye" diye okuyor. */
function ilerlemeCiz(ctx: CanvasRenderingContext2D, sira: number, toplam: number) {
  if (toplam <= 0) return
  const kenar = 88
  const bosluk = 8
  const genislik = (GENISLIK - kenar * 2 - bosluk * (toplam - 1)) / toplam

  for (let i = 0; i < toplam; i += 1) {
    yuvarlakKutu(ctx, kenar + i * (genislik + bosluk), 96, genislik, 8, 4)
    ctx.fillStyle = i <= sira ? BEYAZ : 'rgba(255,255,255,0.3)'
    ctx.fill()
  }
}

function kartIcerigiCiz(
  ctx: CanvasRenderingContext2D,
  veri: OzetKartVerisi,
  haftaMetni: string,
  yazi: Yazitipleri,
) {
  const kenar = 88
  const enFazla = GENISLIK - kenar * 2

  ctx.textAlign = 'left'
  ctx.fillStyle = SOLUK
  ctx.font = `600 32px ${yazi.govde}`
  ctx.fillText('RABİ · HAFTALIK ÖZET', kenar, 190)

  ctx.textAlign = 'right'
  ctx.fillText(haftaMetni, GENISLIK - kenar, 190)
  ctx.textAlign = 'left'

  // --- Orta blok ---
  // Alttan yukarı doğru diziliyor: cümle kaç satır tutarsa tutsun sayı hep
  // aynı yerde durmuyor, blok bir bütün olarak ortalanıyor.
  ctx.font = `500 44px ${yazi.govde}`
  const altSatirlar = kelimeSar(ctx, veri.alt, enFazla)
  const devPuntosu = punto(ctx, veri.dev, enFazla, 190, yazi.baslik)

  const ekstraYuksekligi = veri.ekstra?.length ? 150 : 0
  const toplamYukseklik = 60 + devPuntosu * 0.94 + 40 + altSatirlar.length * 62 + ekstraYuksekligi
  let y = (YUKSEKLIK - toplamYukseklik) / 2

  ctx.fillStyle = SOLUK
  ctx.font = `600 36px ${yazi.govde}`
  ctx.fillText(veri.ustluk.toLocaleUpperCase('tr'), kenar, y)
  y += 60 + devPuntosu * 0.78

  ctx.fillStyle = BEYAZ
  ctx.font = `700 ${devPuntosu}px ${yazi.baslik}`
  ctx.fillText(veri.dev, kenar, y)
  y += devPuntosu * 0.16 + 40

  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = `500 44px ${yazi.govde}`
  for (const satir of altSatirlar) {
    y += 62
    ctx.fillText(satir, kenar, y)
  }

  if (veri.ekstra?.length) {
    y += 46
    const kutuGenislik = (enFazla - 28) / Math.min(2, veri.ekstra.length)
    veri.ekstra.slice(0, 2).forEach((metin, i) => {
      const x = kenar + i * (kutuGenislik + 28)
      yuvarlakKutu(ctx, x, y, kutuGenislik, 104, 28)
      ctx.fillStyle = COK_SOLUK
      ctx.fill()
      ctx.fillStyle = BEYAZ
      ctx.font = `600 38px ${yazi.baslik}`
      ctx.fillText(kisalt(ctx, metin, kutuGenislik - 56), x + 28, y + 66)
    })
  }

  // --- Alt imza ---
  tavsanCiz(ctx, kenar, YUKSEKLIK - 178, 0.62)

  ctx.fillStyle = BEYAZ
  ctx.font = `700 46px ${yazi.baslik}`
  ctx.fillText('Rabi', kenar + 96, YUKSEKLIK - 120)

  ctx.fillStyle = SOLUK
  ctx.font = `500 30px ${yazi.govde}`
  ctx.fillText('YKS çalışma asistanı', kenar + 96, YUKSEKLIK - 76)
}

/**
 * Açılış ekranındaki çizgi tavşan (components/acilis.tsx) — aynı yollar.
 * Paylaşılan görselde uygulamanın imzası olsun diye; dolu maskot bu boyutta
 * lekeye dönüşüyor, çizgi hâli küçükken de okunuyor.
 */
function tavsanCiz(ctx: CanvasRenderingContext2D, x: number, y: number, olcek: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(olcek, olcek)
  ctx.strokeStyle = BEYAZ
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (const yol of [
    'M45 46 C39 30 38 16 44 8 C50 2 56 10 55 24 C54 33 52 41 50 47',
    'M75 46 C81 30 82 16 76 8 C70 2 64 10 65 24 C66 33 68 41 70 47',
    'M45 78 q5 6 10 0',
    'M65 78 q5 6 10 0',
    'M53 95 q7 6 14 0',
  ]) {
    ctx.stroke(new Path2D(yol))
  }

  ctx.beginPath()
  ctx.ellipse(60, 84, 35, 31, 0, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = BEYAZ
  ctx.fill(new Path2D('M60 90 l-4.5 -4 h9 z'))
  ctx.restore()
}

/** Metni verilen genişliğe sığdıran en büyük punto (üst sınırdan aşağı iner). */
function punto(
  ctx: CanvasRenderingContext2D,
  metin: string,
  enFazla: number,
  baslangic: number,
  aile: string,
): number {
  let boy = baslangic
  ctx.font = `700 ${boy}px ${aile}`
  while (boy > 44 && ctx.measureText(metin).width > enFazla) {
    boy -= 6
    ctx.font = `700 ${boy}px ${aile}`
  }
  return boy
}

/** Cümleyi kelime sınırlarından satırlara böler. */
function kelimeSar(ctx: CanvasRenderingContext2D, metin: string, enFazla: number): string[] {
  const kelimeler = metin.split(' ')
  const satirlar: string[] = []
  let simdiki = ''

  for (const kelime of kelimeler) {
    const aday = simdiki ? `${simdiki} ${kelime}` : kelime
    if (ctx.measureText(aday).width <= enFazla || !simdiki) {
      simdiki = aday
      continue
    }
    satirlar.push(simdiki)
    simdiki = kelime
  }
  if (simdiki) satirlar.push(simdiki)

  // Beş satırdan uzun bir cümle kartı boğuyor; kalanı kısaltılıyor.
  if (satirlar.length <= 5) return satirlar
  return [...satirlar.slice(0, 4), kisalt(ctx, satirlar.slice(4).join(' '), enFazla)]
}
