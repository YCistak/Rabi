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
 * Ardışık doğru sayısı — sesin perdesi buna göre yükseliyor.
 *
 * Sayaç burada, çağıran tarafta değil: 18 oyunun her biri seriyi zaten
 * biliyor ama hepsine parametre geçirmek 18 dosyaya dokunmak demekti. Modül
 * kendi saydığında kural tek yerde duruyor ve oyunların haberi bile olmuyor.
 *
 * Yanlış cevap ve tur bitişi sıfırlıyor; ikisi de zaten buradan geçiyor.
 */
let seri = 0

/**
 * Perdenin kaç yarım ton yükselebileceği.
 *
 * Tavan şart: sınırsız yükselen bir ses on beşinci doğruda cıva gibi çıkıyor
 * ve ödül olmaktan çıkıp rahatsız ediyor. Sekiz yarım ton, aynı sesin hâlâ
 * aynı ses olarak tanındığı en üst nokta.
 */
const EN_COK_KADEME = 8

/** Bir yarım tonun oranı — `playbackRate` çarpanı olarak. */
const YARIM_TON = Math.pow(2, 1 / 12)

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

function tamponCal(tur: DosyaliSes, hiz = 1): boolean {
  const ctx = baglamAl()
  const tampon = tamponlar.get(tur)
  if (!ctx || !tampon) return false

  void ctx.resume().catch(() => {})
  const kaynak = ctx.createBufferSource()
  const kazanc = ctx.createGain()
  kaynak.buffer = tampon
  // Perde ve süre birlikte değişiyor: seri yükseldikçe ses hem tizleşiyor hem
  // kısalıyor, yani art arda gelen doğrular birbirine binmiyor.
  kaynak.playbackRate.value = hiz
  kazanc.gain.value = DOSYA_SEVIYESI
  kaynak.connect(kazanc)
  kazanc.connect(ctx.destination)
  kaynak.start()
  return true
}

/** Şu anki serinin perde çarpanı. İlk doğru 1, sonrakiler birer yarım ton. */
function seriPerdesi(): number {
  return Math.pow(YARIM_TON, Math.min(Math.max(seri - 1, 0), EN_COK_KADEME))
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

/** Doğru cevap dosyası okunamazsa çalan yedek ton. Perde yine seriyle yükseliyor. */
function dogruTonu() {
  const perde = seriPerdesi()
  cal([
    { frekans: 880 * perde, gecikme: 0, sure: 0.09, seviye: 0.3 },
    { frekans: 1318 * perde, gecikme: 0.075, sure: 0.13, seviye: 0.3 },
  ])
}

/** Yanlış cevap dosyası okunamazsa çalan yedek ton. */
function yanlisTonu() {
  cal([
    { frekans: 320, hedefFrekans: 150, gecikme: 0, sure: 0.26, bicim: 'triangle', seviye: 0.32 },
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
  seri = 0
  cal([
    { frekans: 784, gecikme: 0, sure: 0.14 },
    { frekans: 988, gecikme: 0.12, sure: 0.14 },
    { frekans: 1318, gecikme: 0.24, sure: 0.34, seviye: 0.5 },
  ])
}

/** Doğru cevap: mp3 hazırsa o, değilse yedek ton. Perde seriyle yükseliyor. */
export function dogruSesi() {
  seri += 1
  if (tamponCal('dogru', seriPerdesi())) return
  void yukle('dogru')
  dogruTonu()
}

/** Yanlış cevap: mp3 hazırsa o, değilse yedek ton. Seriyi de sıfırlıyor. */
export function yanlisSesi() {
  seri = 0
  if (tamponCal('yanlis')) return
  void yukle('yanlis')
  yanlisTonu()
}

/**
 * Seriyi elle sıfırlar — oyun kabuğu açılırken çağrılıyor.
 *
 * Ses kapalıyken `oyunSesiCal` hiç çalışmadığı için sayaç da ilerlemiyor;
 * kullanıcı ayarı tur ortasında açarsa sayaç eski turdan kalmış olabilirdi.
 */
export function seriyiSifirla() {
  seri = 0
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
