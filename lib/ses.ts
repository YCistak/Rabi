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

  durdur() {
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
   * Seans bitiş zili: iki notalık kısa bir çıngırak. Bildirimden bağımsız çalar
   * çünkü uygulama öndeyken bildirim gösterilmiyor.
   */
  zilCal() {
    const ctx = this.baglamAl()
    void ctx.resume()

    // Do–Sol beşlisi: dikkat çeker ama tiz ve rahatsız değil.
    const notalar = [
      { frekans: 784, gecikme: 0 },
      { frekans: 1046, gecikme: 0.16 },
    ]

    for (const nota of notalar) {
      const osilator = ctx.createOscillator()
      const zarf = ctx.createGain()
      const baslangic = ctx.currentTime + nota.gecikme

      osilator.type = 'sine'
      osilator.frequency.value = nota.frekans
      zarf.gain.setValueAtTime(0, baslangic)
      zarf.gain.linearRampToValueAtTime(0.35, baslangic + 0.01)
      zarf.gain.exponentialRampToValueAtTime(0.0001, baslangic + 1.1)

      osilator.connect(zarf)
      zarf.connect(ctx.destination)
      osilator.start(baslangic)
      osilator.stop(baslangic + 1.2)
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
