'use client'

/**
 * Mini oyun ses efektleri.
 *
 * Doğru ve yanlış sesleri `public/ses/oyun/` altındaki kısa mp3'ler (ikisi
 * birlikte ~35 KB). Önceden üretilmiş tonlar kullanılıyordu; kullanıcı
 * "cılız kalıyor" dedi — sentetik sinüs tonu, telefonun hoparlöründe gerçek
 * bir efektin yanında hep zayıf duyulur.
 *
 * Dosyalar `decodeAudioData` ile **bir kez** çözülüp bellekte tutuluyor:
 * `new Audio()` ile her çalışta yeni bir eleman kurmak Android WebView'da
 * gözle görülür bir gecikme yaratıyor ve arka arkaya gelen cevaplarda ses
 * kırpılıyordu. Çözülmüş tampon (buffer) her seferinde anında ve üst üste
 * çalabiliyor.
 *
 * Tur bitiş sesi hâlâ üretiliyor: kullanıcı bunun için bir dosya vermedi ve
 * turda yalnızca bir kez çalıyor.
 *
 * `AudioContext` tarayıcı kuralı gereği kullanıcı etkileşimi olmadan
 * başlatılamıyor; oyunda ilk ses zaten bir dokunuştan sonra çaldığı için sorun
 * çıkmıyor, yine de başarısız olursa sessizce geçiliyor — ses efekti oyunun
 * çalışmasının şartı değil.
 */

/**
 * Dosyaların ses seviyesi.
 *
 * Dosyalar tepe noktası −1 dB olacak şekilde ayarlandı, yani tam seviyede
 * çalıyorlardı ve kullanıcı "çok fazla geliyor" dedi. Efekt oyunun içinden
 * gelen bir işaret; müziği ya da ortamı bastırması gerekmiyor. Sessize
 * yaklaşmıyor çünkü duyulmayan bir efekt hiç olmamış demek — kapatmak için
 * ayarda anahtar zaten var.
 */
const DOSYA_SEVIYESI = 0.42

/**
 * Doğru sesi, yanlışın bir tık altında.
 *
 * İkisi bir süre aynı seviyedeydi ve kullanıcı doğru sesini "biraz yüksek"
 * buldu. Sebep sayı değil sıklık: doğru sesi bir turda onlarca kez çalıyor,
 * yanlış birkaç kez. Aynı seviyede çalan bir ses, çok tekrarlandığında daha
 * gür duyuluyor. Yanlış aşağı çekilmedi: turu kesen, dikkat isteyen olay o.
 */
const DOGRU_SEVIYESI = DOSYA_SEVIYESI * 0.72

/*
  Doğru sesinin perdesi **hiç değişmiyor**.

  Bir süre ardışık doğrularda çeyrek ton çeyrek ton yükseliyordu (önce yarım
  tondu, sonra yarıya indirildi). İkisi de kulakta iyi durmadı: dosya kendi
  perdesinde tasarlanmış bir efekt ve `playbackRate` onu hem tizleştirip hem
  kısaltıyor — seri ilerledikçe ses kendi kimliğinden uzaklaşıyor, kullanıcı
  bunu "ses bozuluyor" diye duyuyor. Seriyi ödüllendiren şey zaten ekranda:
  sayaç, çarpan ve tur sonu. Efektin işi yalnızca "doğru" demek.
*/

/**
 * Ses ayarının son bilinen hâli.
 *
 * Oyun kabuğu (`oyun-kabuk.tsx`) süre uyarısını kendi çalıyor ama ayarı
 * bilmiyor — ona `sesAcik` geçirmek yine 18 dosya demekti. `sesleriHazirla`
 * zaten oyun açılırken ayarla çağrılıyor; değeri orada yakalamak yetiyor.
 */
let sesAcik = false

const DOSYALAR = {
  dogru: './ses/oyun/dogru.mp3',
  yanlis: './ses/oyun/yanlis.mp3',
} as const

type DosyaliSes = keyof typeof DOSYALAR

let baglam: AudioContext | null = null
const tamponlar = new Map<DosyaliSes, AudioBuffer>()
/** Aynı dosya için ikinci bir indirme başlatmamak üzere tutuluyor. */
const yuklemeler = new Map<DosyaliSes, Promise<void>>()

function baglamAl(): AudioContext | null {
  if (baglam) return baglam
  if (typeof window === 'undefined') return null
  try {
    const Yapici =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Yapici) return null
    baglam = new Yapici()
  } catch {
    return null
  }
  return baglam
}

function yukle(tur: DosyaliSes): Promise<void> {
  const mevcut = yuklemeler.get(tur)
  if (mevcut) return mevcut

  const is = (async () => {
    const ctx = baglamAl()
    if (!ctx) return
    try {
      const cevap = await fetch(DOSYALAR[tur])
      const veri = await cevap.arrayBuffer()
      tamponlar.set(tur, await ctx.decodeAudioData(veri))
    } catch {
      // Dosya okunamadıysa üretilen ton devreye giriyor; sessiz kalmıyoruz.
      yuklemeler.delete(tur)
    }
  })()

  yuklemeler.set(tur, is)
  return is
}

/**
 * Oyun başlarken çağrılır: dosyaları önceden çözer, böylece ilk cevabın sesi
 * gecikmez. Ses kapalıysa hiçbir şey yapmaz — `AudioContext` bile kurulmaz.
 */
export function sesleriHazirla(acik: boolean) {
  sesAcik = acik
  if (!acik) return
  void yukle('dogru')
  void yukle('yanlis')
}

function tamponCal(tur: DosyaliSes): boolean {
  const ctx = baglamAl()
  const tampon = tamponlar.get(tur)
  if (!ctx || !tampon) return false

  void ctx.resume().catch(() => {})
  const kaynak = ctx.createBufferSource()
  const kazanc = ctx.createGain()
  kaynak.buffer = tampon
  kazanc.gain.value = tur === 'dogru' ? DOGRU_SEVIYESI : DOSYA_SEVIYESI
  kaynak.connect(kazanc)
  kazanc.connect(ctx.destination)
  kaynak.start()
  return true
}

type Nota = {
  frekans: number
  /** Saniye cinsinden, sesin başından itibaren. */
  gecikme: number
  sure: number
  /** Tepe ses seviyesi, 0–1. */
  seviye?: number
  bicim?: OscillatorType
  /** Verilirse ton bu frekansa doğru kayar (düşen "yanlış" sesi için). */
  hedefFrekans?: number
}

function cal(notalar: Nota[]) {
  const ctx = baglamAl()
  if (!ctx) return
  void ctx.resume().catch(() => {})

  for (const nota of notalar) {
    const osilator = ctx.createOscillator()
    const zarf = ctx.createGain()
    const baslangic = ctx.currentTime + nota.gecikme
    const bitis = baslangic + nota.sure
    const seviye = nota.seviye ?? 0.45

    osilator.type = nota.bicim ?? 'sine'
    osilator.frequency.setValueAtTime(nota.frekans, baslangic)
    if (nota.hedefFrekans) {
      osilator.frequency.exponentialRampToValueAtTime(nota.hedefFrekans, bitis)
    }

    // Ani başlangıç/bitiş "tık" sesi çıkarıyor; kısa bir zarf onu yumuşatıyor.
    zarf.gain.setValueAtTime(0.0001, baslangic)
    zarf.gain.exponentialRampToValueAtTime(seviye, baslangic + 0.012)
    zarf.gain.exponentialRampToValueAtTime(0.0001, bitis)

    osilator.connect(zarf)
    zarf.connect(ctx.destination)
    osilator.start(baslangic)
    osilator.stop(bitis + 0.02)
  }
}

/** Doğru cevap dosyası okunamazsa çalan yedek ton. */
function dogruTonu() {
  cal([
    { frekans: 880, gecikme: 0, sure: 0.09, seviye: 0.22 },
    { frekans: 1318, gecikme: 0.075, sure: 0.13, seviye: 0.22 },
  ])
}

/** Yanlış cevap dosyası okunamazsa çalan yedek ton. */
function yanlisTonu() {
  cal([
    { frekans: 320, hedefFrekans: 150, gecikme: 0, sure: 0.26, bicim: 'triangle', seviye: 0.32 },
  ])
}

/**
 * Geri sayımın rakam tonu — üç rakamda da **aynı**.
 *
 * Perde bir süre her rakamda değişiyordu; kullanıcı bunu "kötü duyuluyor" diye
 * bildirdi. Sayımın işi metronom gibi: aynı tonun üç kez, aynı aralıkla
 * vurması sayının indiğini zaten anlatıyor, perde oynatmak onu bir ezgiye
 * çevirip ritmi bulanıklaştırıyor. Tırmanış yalnızca sonda, "Başla!" akorunda.
 *
 * A5 seçildi: telefon hoparlörünün rahat taşıdığı bir bölge — daha alçak tonlar
 * küçük hoparlörde gövdesini kaybediyor.
 */
const RAKAM_TONU = 880

/**
 * Sayım sesinin seviyesi.
 *
 * Efekt dosyalarının (`DOSYA_SEVIYESI`) belirgin biçimde **üstünde**: sayım
 * oyunun ilk sesi, ondan önce duyulmuş bir şey yok ve tek bir triangle tonu,
 * kaydedilmiş bir efektin gövdesini taşımıyor. 0.5'te kullanıcı telefonda hâlâ
 * duymadı; buradaki sayı gürlüğü değil dalganın inceliğini karşılıyor.
 */
const SAYIM_SEVIYESI = 0.8

/**
 * "Başla!" akorunun tek nota seviyesi — sayım tonunun altında.
 *
 * Üç nota 0.08 saniye arayla giriyor ve kuyrukları üst üste biniyor: üçü de
 * `SAYIM_SEVIYESI` ile çalsaydı toplam çıkış 1'i aşar, akor yüksek değil
 * **kırpılmış** duyulurdu. Bölünen tepe sayesinde akor tikler kadar gür ama
 * bozulmuyor.
 */
const AKOR_SEVIYESI = SAYIM_SEVIYESI * 0.6

/**
 * Geri sayım sesi — 3, 2, 1 ve `0` ile "Başla!".
 *
 * Rakamlar tek ve sabit bir tik; sonuncusu yukarı açılan üç nota. Tırmanış
 * kasıtlı: sayım aşağı iner, ses yukarı çıkar, o yüzden "bitti" değil
 * "başlıyor" gibi duyuluyor.
 */
export function geriSayimSesi(kalan: number) {
  if (!sesAcik) return
  if (kalan > 0) {
    cal([{ frekans: RAKAM_TONU, gecikme: 0, sure: 0.14, bicim: 'triangle', seviye: SAYIM_SEVIYESI }])
    return
  }
  cal([
    { frekans: 880, gecikme: 0, sure: 0.12, bicim: 'triangle', seviye: AKOR_SEVIYESI },
    { frekans: 1174.66, gecikme: 0.08, sure: 0.12, bicim: 'triangle', seviye: AKOR_SEVIYESI },
    { frekans: 1760, gecikme: 0.16, sure: 0.34, bicim: 'triangle', seviye: AKOR_SEVIYESI },
  ])
}

/**
 * Boss sorusunun yenilmesi.
 *
 * Doğru sesinin **üstüne** biniyor, onun yerine geçmiyor: boss da bir doğru
 * cevap, farkı ağırlığında. Küçük bir gecikme iki sesi ayırıyor, yoksa tek bir
 * bulanık ses duyuluyor.
 */
export function bossSesi() {
  if (!sesAcik) return
  cal([
    { frekans: 523, gecikme: 0.1, sure: 0.11, bicim: 'triangle', seviye: 0.3 },
    { frekans: 659, gecikme: 0.19, sure: 0.11, bicim: 'triangle', seviye: 0.3 },
    { frekans: 1046, gecikme: 0.28, sure: 0.3, bicim: 'triangle', seviye: 0.34 },
  ])
}

/**
 * Süre tükenmek üzere — tur başına **bir kez**.
 *
 * Her saniye tıklayan bir sayaç öğrenmeyi değil kaygıyı besler; tek bir alçak
 * uyarı "başını kaldır" demeye yetiyor.
 */
export function sureUyarisi() {
  if (!sesAcik) return
  cal([{ frekans: 392, gecikme: 0, sure: 0.16, bicim: 'triangle', seviye: 0.26 }])
}

/** Tur bitişi: üç notalık küçük bir kapanış. */
export function bitisSesi() {
  cal([
    { frekans: 784, gecikme: 0, sure: 0.14 },
    { frekans: 988, gecikme: 0.12, sure: 0.14 },
    { frekans: 1318, gecikme: 0.24, sure: 0.34, seviye: 0.5 },
  ])
}

/** Doğru cevap: mp3 hazırsa o, değilse yedek ton. */
export function dogruSesi() {
  if (tamponCal('dogru')) return
  void yukle('dogru')
  dogruTonu()
}

/** Yanlış cevap: mp3 hazırsa o, değilse yedek ton. */
export function yanlisSesi() {
  if (tamponCal('yanlis')) return
  void yukle('yanlis')
  yanlisTonu()
}

/**
 * Ayardaki açık/kapalı durumuna göre çalan sarmalayıcı.
 *
 * Kapalıyken hiçbir şey yapılmıyor — `AudioContext` bile kurulmuyor, sesi
 * kapatan kullanıcı ses altyapısının açılmasını da beklemez.
 */
export function oyunSesiCal(tur: 'dogru' | 'yanlis' | 'bitis', acik: boolean) {
  // Ayarın son hâli burada da yakalanıyor: kabuğun çaldığı sesler (`bossSesi`,
  // `sureUyarisi`) bayrağı parametreyle almıyor, bu değişkene bakıyor.
  sesAcik = acik
  if (!acik) return
  if (tur === 'dogru') dogruSesi()
  else if (tur === 'yanlis') yanlisSesi()
  else bitisSesi()
}
