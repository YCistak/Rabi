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

/**
 * Tek bir ses kaynağını yöneten çalar. Hem üretilen sesleri hem `public/ses/`
 * altındaki mp3 döngülerini çalar.
 *
 * AudioContext kullanıcı etkileşimi olmadan başlatılamaz (tarayıcı kuralı), bu
 * yüzden ilk `cal()` çağrısına kadar hiçbir şey kurulmaz.
 */
export class SesCalar {
  private ctx: AudioContext | null = null
  private kazanc: GainNode | null = null
  private kaynak: AudioBufferSourceNode | null = null
  private eleman: HTMLAudioElement | null = null
  private seviye = 0.5
  /** Önizlemeyi kendiliğinden bitiren sayaç; `durdur` onu da siliyor. */
  private onizlemeSayaci: number | null = null

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
   * Aşamanın son 3 saniyesinde saniyede bir çalan yumuşak geri sayım tiki.
   *
   * Masada derse dalmış ya da molada ekrana bakmayan öğrencinin sürenin
   * bitmek üzere olduğunu fark etmesi için: bitiş zilinden önce üç küçük
   * akustik dokunuş dikkati nazikçe topluyor. `triangle` dalga telefon
   * hoparlöründe cılız kalmıyor ama köşeli bir bip gibi de tırmalamıyor.
   */
  geriSayimTiki() {
    const ctx = this.baglamAl()
    void ctx.resume()

    const osilator = ctx.createOscillator()
    const zarf = ctx.createGain()
    const baslangic = ctx.currentTime
    const bitis = baslangic + 0.12

    osilator.type = 'triangle'
    osilator.frequency.setValueAtTime(659.25, baslangic) // Mi5 — sıcak, tok orta perde
    zarf.gain.setValueAtTime(0.0001, baslangic)
    zarf.gain.linearRampToValueAtTime(0.32, baslangic + 0.01)
    zarf.gain.exponentialRampToValueAtTime(0.0001, bitis)

    osilator.connect(zarf)
    zarf.connect(ctx.destination)
    osilator.start(baslangic)
    osilator.stop(bitis + 0.02)
  }

  /**
   * Aşama bitiş zili: masada çalışan öğrencinin telefonuna bakmasa da net
   * duyacağı, sıcak ve berrak bir marimba/ksilofon akoru.
   *
   * Eskiden yalnızca 0.35 kazançlı iki cılız sinüs tonu vardı ve telefon
   * hoparlöründe neredeyse hiç duyulmuyordu. Şimdi her nota gövdeli bir
   * `triangle` dalga ve onu parlatan hafif bir üst oktav `sine` harmonikten
   * oluşuyor; ayrıca iki kez çalarak tek seferlik kısa bir sesi kaçırma
   * ihtimalini ortadan kaldırıyor.
   *
   * Çalışma bittiğinde (`molaBasliyor = true`) ferahlatıcı, dinlenmeye davet
   * eden yükselen bir Do majör arpej (Do5–Mi5–Sol5–Do6); mola bittiğinde ise
   * derse dönüşü haber veren canlı bir Sol–Re–Sol–Si dizisi çalar.
   */
  zilCal(molaBasliyor = true) {
    const ctx = this.baglamAl()
    void ctx.resume()

    const dizi = molaBasliyor
      ? [
          // Çalışma bitti, mola başlıyor: sıcak yükselen Do majör (C5 - E5 - G5 - C6)
          { frekans: 523.25, gecikme: 0, sure: 0.45, seviye: 0.55 },
          { frekans: 659.25, gecikme: 0.13, sure: 0.45, seviye: 0.55 },
          { frekans: 783.99, gecikme: 0.26, sure: 0.5, seviye: 0.6 },
          { frekans: 1046.5, gecikme: 0.4, sure: 0.95, seviye: 0.68 },
        ]
      : [
          // Mola bitti, derse dönüş: canlandırıcı çağrı (G5 - D5 - G5 - B5)
          { frekans: 783.99, gecikme: 0, sure: 0.36, seviye: 0.55 },
          { frekans: 587.33, gecikme: 0.13, sure: 0.36, seviye: 0.52 },
          { frekans: 783.99, gecikme: 0.26, sure: 0.42, seviye: 0.6 },
          { frekans: 987.77, gecikme: 0.4, sure: 0.9, seviye: 0.68 },
        ]

    // Dalgınken ilk çalış kaçmasın diye kısa bir es ile iki kez çalıyor.
    for (const tekrarGecikmesi of [0, 1.45]) {
      for (const nota of dizi) {
        const baslangic = ctx.currentTime + tekrarGecikmesi + nota.gecikme
        const bitis = baslangic + nota.sure

        // Ana gövde: triangle dalga küçük telefon hoparlöründe dolgun duyulur.
        const govde = ctx.createOscillator()
        const govdeZarf = ctx.createGain()
        govde.type = 'triangle'
        govde.frequency.setValueAtTime(nota.frekans, baslangic)
        govdeZarf.gain.setValueAtTime(0.0001, baslangic)
        govdeZarf.gain.linearRampToValueAtTime(nota.seviye, baslangic + 0.014)
        govdeZarf.gain.exponentialRampToValueAtTime(0.0001, bitis)
        govde.connect(govdeZarf)
        govdeZarf.connect(ctx.destination)
        govde.start(baslangic)
        govde.stop(bitis + 0.02)

        // Üst oktav harmonik: akustik çan/marimba berraklığı katar.
        const parlaklik = ctx.createOscillator()
        const parlakZarf = ctx.createGain()
        parlaklik.type = 'sine'
        parlaklik.frequency.setValueAtTime(nota.frekans * 2, baslangic)
        parlakZarf.gain.setValueAtTime(0.0001, baslangic)
        parlakZarf.gain.linearRampToValueAtTime(nota.seviye * 0.22, baslangic + 0.01)
        parlakZarf.gain.exponentialRampToValueAtTime(0.0001, baslangic + nota.sure * 0.65)
        parlaklik.connect(parlakZarf)
        parlakZarf.connect(ctx.destination)
        parlaklik.start(baslangic)
        parlaklik.stop(bitis + 0.02)
      }
    }
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
