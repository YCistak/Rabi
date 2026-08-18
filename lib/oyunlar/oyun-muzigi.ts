'use client'

/**
 * Mini oyunların arka plan müziği.
 *
 * Önce pomodoro'nun lo-fi parçaları kullanılıyordu; oyunla hiç uyuşmadı. Lo-fi
 * yavaş, geniş ve dikkat dağıtmamak için yapılmış — tam tersine, 60 saniyede
 * mümkün olduğunca çok soru çözdüren bir oyunun altında uyku getiriyor ve
 * turun hızlandığını hissettirmiyor.
 *
 * Yerine buradaki **üretilen** (chiptune) döngü kondu. Kararın sebepleri:
 *
 * - Tempo oyunun ritmiyle aynı: 126 BPM'de on altılık arpej, "acele et"
 *   duygusunu müziğin kendisi veriyor.
 * - Dosya yok — APK büyümüyor, oyun açılırken indirilecek bir şey beklenmiyor.
 * - Döngü dikişi duyulmuyor: parça bitip baştan başlamıyor, notalar sürekli
 *   üretiliyor.
 *
 * Zamanlama `setTimeout` ile **değil**, AudioContext'in kendi saatiyle yapılıyor:
 * JS zamanlayıcıları arka planda kısılıyor ve ritim ilk sekmede takılmada
 * dağılıyor. Klasik çözüm burada da uygulanıyor — kısa aralıklarla uyanıp
 * bir sonraki 120 ms'lik dilimi önceden planlamak.
 */

const BPM = 126
/** On altılık nota süresi (saniye). */
const ADIM = 60 / BPM / 4
/** Bir seferde kaç saniyelik nota önceden planlanıyor. */
const ILERI_BAKIS = 0.15
/** Planlayıcının uyanma sıklığı (ms). ILERI_BAKIS'ın epey altında olmalı. */
const UYANMA = 30

/** Akor dizisi: Am – F – C – G. Dört bar sonra başa dönüyor. */
const AKORLAR: { kok: number; arpej: number[] }[] = [
  { kok: 45, arpej: [69, 72, 76, 81] }, // Am
  { kok: 41, arpej: [65, 69, 72, 77] }, // F
  { kok: 48, arpej: [72, 76, 79, 84] }, // C
  { kok: 43, arpej: [67, 71, 74, 79] }, // G
]

/** Arpejin bar içindeki gidiş-geliş deseni (16 adım, akor notası sırası). */
const ARPEJ_DESENI = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3]

/** Bas vuruşları: [adım, oktav kaydırması] */
const BAS_DESENI: [number, number][] = [
  [0, 0],
  [6, 0],
  [8, 12],
  [11, 0],
  [14, 0],
]

const TEPME_ADIMLARI = [0, 8]
const TRAMPET_ADIMLARI = [4, 12]

function frekans(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12)
}

export class OyunMuzigi {
  private ctx: AudioContext | null = null
  private ana: GainNode | null = null
  private gurultu: AudioBuffer | null = null
  private zamanlayici: ReturnType<typeof setInterval> | null = null
  /** Sıradaki on altılığın çalınacağı an (AudioContext saati). */
  private sonrakiAn = 0
  /** Kaçıncı on altılıktayız — akor ve desen buradan hesaplanıyor. */
  private adim = 0
  private seviye = 0.42

  sesSeviyesi(deger: number) {
    this.seviye = Math.min(1, Math.max(0, deger))
    if (this.ana) this.ana.gain.value = this.seviye
  }

  basla() {
    if (this.zamanlayici !== null) return

    const Yapici =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Yapici) return

    if (!this.ctx) {
      this.ctx = new Yapici()
      this.ana = this.ctx.createGain()
      this.ana.gain.value = this.seviye
      this.ana.connect(this.ctx.destination)
      this.gurultu = this.gurultuUret(this.ctx)
    }
    void this.ctx.resume()

    // Baştan başlamıyor: duraklatılıp devam edildiğinde ritim kaldığı yerden
    // sürsün diye `adim` sıfırlanmıyor.
    this.sonrakiAn = this.ctx.currentTime + 0.06
    this.zamanlayici = setInterval(() => this.planla(), UYANMA)
  }

  /** Sesi keser ama bağlamı açık tutar — geri dönüşte yeniden kurulum olmasın. */
  duraklat() {
    if (this.zamanlayici !== null) {
      clearInterval(this.zamanlayici)
      this.zamanlayici = null
    }
    void this.ctx?.suspend()
  }

  kapat() {
    this.duraklat()
    if (this.ctx) {
      void this.ctx.close()
      this.ctx = null
      this.ana = null
      this.gurultu = null
    }
  }

  // -------------------------------------------------------------------------

  private planla() {
    const ctx = this.ctx
    if (!ctx) return

    while (this.sonrakiAn < ctx.currentTime + ILERI_BAKIS) {
      this.adimCal(this.adim % 64, this.sonrakiAn)
      this.sonrakiAn += ADIM
      this.adim += 1
    }
  }

  /** `konum`: 64 adımlık (4 bar) döngü içindeki sıra. */
  private adimCal(konum: number, an: number) {
    const akor = AKORLAR[Math.floor(konum / 16)]
    const barIci = konum % 16

    // --- Arpej: melodinin taşıyıcısı ---
    this.arpejCal(frekans(akor.arpej[ARPEJ_DESENI[barIci]]), an, barIci % 4 === 0 ? 0.16 : 0.11)

    // --- Bas ---
    for (const [adim, kaydirma] of BAS_DESENI) {
      if (adim === barIci) this.basCal(frekans(akor.kok + kaydirma), an)
    }

    // --- Davul ---
    if (TEPME_ADIMLARI.includes(barIci)) this.tepmeCal(an)
    if (TRAMPET_ADIMLARI.includes(barIci)) this.trampetCal(an)
    // Sekizlikte hi-hat; tek sayılı on altılıklarda daha kısık bir "ghost"
    // vuruş var — düz sekizlik tek başına robot gibi duruyordu.
    if (barIci % 2 === 0) this.hatCal(an, 0.05)
    else if (barIci % 4 === 3) this.hatCal(an, 0.022)
  }

  private arpejCal(hz: number, an: number, tepe: number) {
    const ctx = this.ctx
    if (!ctx || !this.ana) return

    const osilator = ctx.createOscillator()
    const zarf = ctx.createGain()
    const suzgec = ctx.createBiquadFilter()

    // Kare dalga chiptune sesini veriyor ama tizde çok sert; alçak geçiren
    // süzgeç köşeleri yuvarlıyor, kulakta cızırtı bırakmıyor.
    osilator.type = 'square'
    osilator.frequency.value = hz
    suzgec.type = 'lowpass'
    suzgec.frequency.value = 2600

    zarf.gain.setValueAtTime(0, an)
    zarf.gain.linearRampToValueAtTime(tepe, an + 0.006)
    zarf.gain.exponentialRampToValueAtTime(0.0001, an + ADIM * 1.4)

    osilator.connect(suzgec)
    suzgec.connect(zarf)
    zarf.connect(this.ana)
    osilator.start(an)
    osilator.stop(an + ADIM * 1.5)
  }

  private basCal(hz: number, an: number) {
    const ctx = this.ctx
    if (!ctx || !this.ana) return

    const osilator = ctx.createOscillator()
    const zarf = ctx.createGain()

    osilator.type = 'triangle'
    osilator.frequency.value = hz

    zarf.gain.setValueAtTime(0, an)
    zarf.gain.linearRampToValueAtTime(0.2, an + 0.01)
    zarf.gain.exponentialRampToValueAtTime(0.0001, an + ADIM * 1.8)

    osilator.connect(zarf)
    zarf.connect(this.ana)
    osilator.start(an)
    osilator.stop(an + ADIM * 2)
  }

  private tepmeCal(an: number) {
    const ctx = this.ctx
    if (!ctx || !this.ana) return

    const osilator = ctx.createOscillator()
    const zarf = ctx.createGain()

    // Frekansın hızla düşmesi "tuk" sesini veriyor — davul örneği gerekmiyor.
    osilator.type = 'sine'
    osilator.frequency.setValueAtTime(130, an)
    osilator.frequency.exponentialRampToValueAtTime(46, an + 0.11)

    zarf.gain.setValueAtTime(0.26, an)
    zarf.gain.exponentialRampToValueAtTime(0.0001, an + 0.16)

    osilator.connect(zarf)
    zarf.connect(this.ana)
    osilator.start(an)
    osilator.stop(an + 0.18)
  }

  private trampetCal(an: number) {
    this.gurultuCal(an, 0.1, 0.14, 'bandpass', 1900)
  }

  private hatCal(an: number, tepe: number) {
    this.gurultuCal(an, tepe, 0.035, 'highpass', 7000)
  }

  private gurultuCal(
    an: number,
    tepe: number,
    sure: number,
    suzgecTuru: BiquadFilterType,
    hz: number,
  ) {
    const ctx = this.ctx
    if (!ctx || !this.ana || !this.gurultu) return

    const kaynak = ctx.createBufferSource()
    const zarf = ctx.createGain()
    const suzgec = ctx.createBiquadFilter()

    kaynak.buffer = this.gurultu
    suzgec.type = suzgecTuru
    suzgec.frequency.value = hz
    if (suzgecTuru === 'bandpass') suzgec.Q.value = 0.8

    zarf.gain.setValueAtTime(tepe, an)
    zarf.gain.exponentialRampToValueAtTime(0.0001, an + sure)

    kaynak.connect(suzgec)
    suzgec.connect(zarf)
    zarf.connect(this.ana)
    kaynak.start(an)
    kaynak.stop(an + sure + 0.02)
  }

  /** Yarım saniyelik beyaz gürültü — davulların hepsi bunu süzerek kullanıyor. */
  private gurultuUret(ctx: AudioContext): AudioBuffer {
    const uzunluk = Math.floor(ctx.sampleRate * 0.5)
    const tampon = ctx.createBuffer(1, uzunluk, ctx.sampleRate)
    const veri = tampon.getChannelData(0)
    for (let i = 0; i < uzunluk; i += 1) veri[i] = Math.random() * 2 - 1
    return tampon
  }
}
