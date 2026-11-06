'use client'

import type { SesSecimi } from './types'
import { LOFI_PARCALAR } from './lofi'

/**
 * Pomodoro müziği.
 *
 * Eskiden burada Web Audio ile üretilen ortam sesleri de vardı (beyaz/kahverengi
 * gürültü, yağmur, kafe). Kullanıcı istemediği için kaldırıldılar; geriye
 * yalnızca `public/ses/` altındaki lo-fi parçalar kaldı.
 *
 * Seans bitiş zili hâlâ koddan üretiliyor — iki sinüs, dosya gerektirmiyor.
 */

/**
 * Önizlemenin uzunluğu. Yirmi saniye bir lo-fi parçanın ne olduğunu anlatmaya
 * yetiyor; uzatmak seçim ekranında oturup müzik dinlemek olurdu.
 */
const ONIZLEME_SANIYE = 20
const KISILMA_MS = 500
const KISILMA_ADIMI_MS = 50

const POMODORO_SESLERI = {
  tik: './ses/tik.mp3',
  seansBitti: './ses/seans-bitti.mp3',
  molaBitti: './ses/mola-bitti.mp3',
} as const

type PomodoroSesi = keyof typeof POMODORO_SESLERI

/**
 * Tek bir ses kaynağını yöneten çalar. Hem `public/ses/` altındaki ses
 * dosyalarını (`decodeAudioData` ile bellekte çözerek) hem mp3/ogg döngülerini
 * çalar.
 *
 * AudioContext kullanıcı etkileşimi olmadan başlatılamaz (tarayıcı kuralı), bu
 * yüzden ilk çağrıya kadar hiçbir şey kurulmaz.
 */
export class SesCalar {
  private ctx: AudioContext | null = null
  private kazanc: GainNode | null = null
  private kaynak: AudioBufferSourceNode | null = null
  private eleman: HTMLAudioElement | null = null
  private seviye = 0.5
  /** Önizlemeyi kendiliğinden bitiren sayaç; `durdur` onu da siliyor. */
  private onizlemeSayaci: number | null = null
  private tamponlar = new Map<PomodoroSesi, AudioBuffer>()
  private yuklemeler = new Map<PomodoroSesi, Promise<void>>()

  private baglamAl(): AudioContext {
    if (!this.ctx) {
      const Yapici =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Yapici()
      this.kazanc = this.ctx.createGain()
      this.kazanc.gain.value = this.seviye
      this.kazanc.connect(this.ctx.destination)
    }
    return this.ctx
  }

  /**
   * Tur başlarken ses dosyalarını belleğe çözer; böylece son 3 saniyedeki
   * tikler ve aşama bitiş zili sıfır gecikmeyle çalar.
   */
  hazirla() {
    for (const tur of Object.keys(POMODORO_SESLERI) as PomodoroSesi[]) {
      void this.tamponYukle(tur)
    }
  }

  private tamponYukle(tur: PomodoroSesi): Promise<void> {
    const mevcut = this.yuklemeler.get(tur)
    if (mevcut) return mevcut

    const is = (async () => {
      const ctx = this.baglamAl()
      try {
        const cevap = await fetch(POMODORO_SESLERI[tur])
        const veri = await cevap.arrayBuffer()
        this.tamponlar.set(tur, await ctx.decodeAudioData(veri))
      } catch {
        this.yuklemeler.delete(tur)
      }
    })()

    this.yuklemeler.set(tur, is)
    return is
  }

  private tamponCal(tur: PomodoroSesi, kazancSeviyesi: number): boolean {
    const ctx = this.baglamAl()
    const tampon = this.tamponlar.get(tur)
    if (!tampon) return false

    void ctx.resume().catch(() => {})
    const kaynak = ctx.createBufferSource()
    const kazanc = ctx.createGain()
    kaynak.buffer = tampon
    kazanc.gain.value = kazancSeviyesi
    kaynak.connect(kazanc)
    kazanc.connect(ctx.destination)
    kaynak.start()
    return true
  }

  sesSeviyesi(deger: number) {
    this.seviye = Math.min(1, Math.max(0, deger))
    if (this.kazanc) this.kazanc.gain.value = this.seviye
    if (this.eleman) this.eleman.volume = this.seviye
  }

  /** Seçilen parçayı çalar. 'yok' ise sadece durdurur. */
  cal(secim: SesSecimi) {
    this.durdur()
    if (secim === 'yok') return
    // lofi:<dosya-adi> → public/ses/<dosya-adi>
    this.lofiCal(secim.slice('lofi:'.length))
  }

  /**
   * Seçilen parçadan başlayıp listeyi sırayla çalar. Tek parçayı döngüye almak
   * yerine listede ilerlemek, döngü dikişindeki ani kesilmeyi ortadan kaldırıyor —
   * parça bitiyor, sonraki başlıyor.
   */
  private lofiCal(dosya: string) {
    const eleman = new Audio(`./ses/${dosya}`)
    eleman.volume = this.seviye
    eleman.addEventListener('ended', () => {
      // Bu eleman hâlâ etkin olan mı — arada kullanıcı sesi değiştirmiş olabilir.
      if (this.eleman !== eleman) return
      const simdiki = LOFI_PARCALAR.findIndex((p) => p.dosya === dosya)
      const sonraki = LOFI_PARCALAR[(simdiki + 1) % LOFI_PARCALAR.length]
      this.eleman = null
      this.lofiCal(sonraki.dosya)
    })
    void eleman.play().catch(() => {
      // Dosya yoksa veya oynatma engellendiyse sessizce geç; sayaç çalışmaya devam etsin.
    })
    this.eleman = eleman
  }

  /**
   * Parçayı dinletir ama tura bağlamaz — seçim ekranındaki önizleme.
   *
   * Aynı `eleman` üstünden çalıyor, ikinci bir çalar kurulmuyor: iki ses
   * kaynağı üst üste binseydi önizlenen parça, çalmakta olanın üstüne
   * karışırdı ve kullanıcı ikisini birbirinden ayıramazdı. Çalar tek, önizleme
   * onu ödünç alıyor; bittiğinde çağıran taraf `onBitti` ile haber alıp neyin
   * geri konacağına kendisi karar veriyor (tur sürüyorsa seçili parça, yoksa
   * sessizlik).
   *
   * Süre sınırlı: sonu gelmeyen bir önizleme, önizleme değil çalan müziktir.
   * Sonunda kesilmiyor **kısılıyor** — mp3'ün ortasında aniden kesilen ses,
   * parçanın değil uygulamanın bozuk olduğunu düşündürüyor.
   */
  onizle(dosya: string, onBitti?: () => void) {
    this.durdur()
    const eleman = new Audio(`./ses/${dosya}`)
    eleman.volume = this.seviye
    const bitir = () => {
      if (this.eleman !== eleman) return
      this.durdur()
      onBitti?.()
    }
    // Parça önizlemeden kısaysa kendi bitişi geçerli; zamanlayıcı boşa çalışmasın.
    eleman.addEventListener('ended', bitir)
    void eleman.play().catch(() => {
      // Dosya yoksa ya da oynatma engellendiyse önizleme hiç başlamamış sayılır.
      bitir()
    })
    this.eleman = eleman
    this.onizlemeSayaci = window.setTimeout(() => {
      this.kis(eleman, bitir)
    }, ONIZLEME_SANIYE * 1000)
  }

  /** Önizlemeyi sonunu beklemeden keser; `durdur`un okunur adı. */
  onizlemeyiDurdur() {
    this.durdur()
  }

  /** Önizlemenin son yarım saniyesi: ses sıfıra inince çalar kapanıyor. */
  private kis(eleman: HTMLAudioElement, bitir: () => void) {
    const adimSayisi = Math.max(1, Math.round(KISILMA_MS / KISILMA_ADIMI_MS))
    let adim = 0
    const sayac = window.setInterval(() => {
      if (this.eleman !== eleman) {
        window.clearInterval(sayac)
        return
      }
      adim++
      eleman.volume = Math.max(0, this.seviye * (1 - adim / adimSayisi))
      if (adim >= adimSayisi) {
        window.clearInterval(sayac)
        bitir()
      }
    }, KISILMA_ADIMI_MS)
  }

  /**
   * Sesi keser ama parçayı ve konumunu korur. Uygulama arka plana geçtiğinde
   * kullanılıyor: `durdur()` çağrılsaydı geri dönüşte parça baştan başlardı.
   */
  duraklat() {
    this.eleman?.pause()
    void this.ctx?.suspend()
  }

  /** `duraklat()`ın karşılığı — kaldığı yerden devam eder. */
  devam() {
    void this.ctx?.resume()
    void this.eleman?.play().catch(() => {
      // Otomatik oynatma engellendiyse sessizce geç.
    })
  }

  durdur() {
    if (this.onizlemeSayaci !== null) {
      window.clearTimeout(this.onizlemeSayaci)
      this.onizlemeSayaci = null
    }
    if (this.kaynak) {
      this.kaynak.stop()
      this.kaynak.disconnect()
      this.kaynak = null
    }
    if (this.eleman) {
      this.eleman.pause()
      this.eleman.src = ''
      this.eleman = null
    }
  }

  /**
   * Aşamanın son 3 saniyesinde saniyede bir çalan akustik geri sayım tiki.
   *
   * Masada derse dalmış ya da molada ekrana bakmayan öğrencinin sürenin
   * bitmek üzere olduğunu fark etmesi için `public/ses/tik.mp3` dosyasını
   * çalar.
   */
  geriSayimTiki() {
    if (this.tamponCal('tik', 0.48)) return
    void this.tamponYukle('tik').then(() => {
      this.tamponCal('tik', 0.48)
    })
  }

  /**
   * Aşama bitiş zili: zengin harmonikli ve oda yankılı akustik çan/vibrafon
   * kaydı (`seans-bitti.mp3` / `mola-bitti.mp3`).
   *
   * Yalnızca **bir kez** çalar (iki kez arka arkaya çalması kaldırıldı).
   * Çalışma bittiğinde (`molaBasliyor = true`) sıcak ve dinlendirici bir
   * Do majör akor yürüyüşü, mola bittiğinde ise derse dönüşü haber veren
   * ferah bir Re majör çan dizisi duyulur.
   */
  zilCal(molaBasliyor = true) {
    const tur: PomodoroSesi = molaBasliyor ? 'seansBitti' : 'molaBitti'
    if (this.tamponCal(tur, 0.85)) return
    void this.tamponYukle(tur).then(() => {
      this.tamponCal(tur, 0.85)
    })
  }

  /** Sekme kapanırken / bileşen sökülürken çağrılır. */
  kapat() {
    this.durdur()
    if (this.ctx) {
      void this.ctx.close()
      this.ctx = null
      this.kazanc = null
    }
  }
}
