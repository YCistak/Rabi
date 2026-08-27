'use client'

/**
 * Rahat modun arka plan müziği — vuruşsuz pad.
 *
 * Bir süre **bütün** oyunların tek müziğiydi; artık her tur modunun kendi
 * parçası var (`mod-muzigi.ts`) ve bu pad Rahat modda çalıyor. Yeri orası
 * çünkü Rahat turda süre yok: taşıyacak bir tempo olmayınca geriye yalnızca
 * ortam kalıyor.
 *
 * Önce 126 BPM'lik bir chiptune döngüsü çalıyordu: arpejli, davullu, turun
 * temposunu taşısın diye yazılmış bir parça. Temposu tutuyordu ama dikkati de
 * üstüne çekiyordu — soru okurken arkada ritim sayılması istenen bir şey değil.
 * Yerine bu sakin pad kondu; artık müziğin işi fark edilmemek.
 *
 * Fark edilmemeyi üç şey sağlıyor:
 *
 * - **Vuruş yok.** Davul ve arpej çıkarıldı. Kulak düzenli bir vuruş duyduğu
 *   anda onu takip etmeye başlıyor; takip edecek bir şey bırakılmadı.
 * - **Girişler yavaş.** Akorlar 7 saniyede bir değişiyor ve saniyeler süren bir
 *   yükselişle giriyor. "Yeni bir şey başladı" denebilecek keskin bir an yok.
 * - **Tiz kesik.** Alçak geçiren süzgeç üst frekansları alıyor. Doğru/yanlış
 *   efektleri tizde duruyor; müzik o aralığı boş bırakınca oyunun asıl geri
 *   bildirimi maskelenmiyor.
 *
 * Notalar üst üste biniyor: bir akor sönerken sonraki çoktan yükseliyor, arada
 * sessizlik kalmıyor. Döngü dikişi bu yüzden duyulmuyor.
 *
 * Zamanlama `setTimeout` ile **değil**, AudioContext'in kendi saatiyle yapılıyor:
 * JS zamanlayıcıları arka planda kısılıyor ve notalar geç kalıyor. Kısa
 * aralıklarla uyanıp bir sonraki dilimi önceden planlama yöntemi burada da
 * geçerli — akorlar seyrekleştiği için yalnızca aralıklar büyüdü.
 */

/** Bir akorun süresi (saniye). */
const AKOR_SURESI = 7
/** Notanın tepe seviyesine ulaşma süresi. Uzun tutuldu: giriş duyulmasın. */
const CIKIS = 2.6
/** Akor değiştikten sonra sönme süresi — sonraki akorla binişen kısım. */
const SONUS = 4.2
/** Bir seferde kaç saniyelik nota önceden planlanıyor. */
const ILERI_BAKIS = 1.5
/** Planlayıcının uyanma sıklığı (ms). ILERI_BAKIS'ın epey altında olmalı. */
const UYANMA = 400

/**
 * Akor dizisi: Am – F – C – G.
 *
 * Sesler arasında ortak nota bırakacak şekilde dizildi; akor değişirken
 * partilerin çoğu yerinde kalıyor, kulağa hareket değil renk değişimi gibi
 * geliyor. Yedili/dokuzlu eklenmedi — gerilim yaratan aralık dikkat çekiyor.
 */
const AKORLAR: { kok: number; notalar: number[] }[] = [
  { kok: 45, notalar: [57, 60, 64, 69] }, // Am
  { kok: 41, notalar: [57, 60, 65, 69] }, // F
  { kok: 48, notalar: [55, 60, 64, 67] }, // C
  { kok: 43, notalar: [55, 59, 62, 67] }, // G
]

/** Süzgecin salınım merkezi ve genliği (Hz). */
const SUZGEC_MERKEZI = 1100
const SUZGEC_GENLIGI = 260
/** Salınım hızı (Hz) — bir tur ~33 saniye; nefes alıp verme kadar yavaş. */
const SUZGEC_HIZI = 0.03

function frekans(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12)
}

export class OyunMuzigi {
  private ctx: AudioContext | null = null
  private ana: GainNode | null = null
  private suzgec: BiquadFilterNode | null = null
  /** Sıradaki akorun çalınacağı an (AudioContext saati). */
  private sonrakiAn = 0
  /** Kaçıncı akordayız. */
  private adim = 0
  private zamanlayici: ReturnType<typeof setInterval> | null = null
  private seviye = 0.06

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

    if (!this.ctx) this.kur(new Yapici())
    const ctx = this.ctx
    if (!ctx) return
    void ctx.resume()

    // Duraklatıp devam edildiğinde hâlâ sönmekte olan notalar var; `sonrakiAn`
    // geri alınmıyor ki üstlerine ikinci bir akor binmesin.
    this.sonrakiAn = Math.max(this.sonrakiAn, ctx.currentTime + 0.06)
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
      this.suzgec = null
    }
  }

  // -------------------------------------------------------------------------

  private kur(ctx: AudioContext) {
    this.ctx = ctx
    this.ana = ctx.createGain()
    this.ana.gain.value = this.seviye

    // Süzgeç ana seviyeden önce: tizi burada kesince notaların hepsi tek elden
    // yumuşuyor, her ses için ayrı süzgeç kurmaya gerek kalmıyor.
    const suzgec = ctx.createBiquadFilter()
    suzgec.type = 'lowpass'
    suzgec.frequency.value = SUZGEC_MERKEZI
    suzgec.Q.value = 0.5
    this.suzgec = suzgec

    suzgec.connect(this.ana)
    this.ana.connect(ctx.destination)

    // Süzgeci çok yavaş salındıran LFO. Akorlar sabitken bile ses hafifçe
    // açılıp kapanıyor; hareketsiz bir pad bir süre sonra uğultuya dönüşüyor.
    const lfo = ctx.createOscillator()
    const lfoDerinlik = ctx.createGain()
    lfo.type = 'sine'
    lfo.frequency.value = SUZGEC_HIZI
    lfoDerinlik.gain.value = SUZGEC_GENLIGI
    lfo.connect(lfoDerinlik)
    lfoDerinlik.connect(suzgec.frequency)
    lfo.start()
  }

  private planla() {
    const ctx = this.ctx
    if (!ctx) return

    while (this.sonrakiAn < ctx.currentTime + ILERI_BAKIS) {
      this.akorCal(this.adim % AKORLAR.length, this.sonrakiAn)
      this.sonrakiAn += AKOR_SURESI
      this.adim += 1
    }
  }

  private akorCal(sira: number, an: number) {
    const akor = AKORLAR[sira]

    // Tepe seviyesi nota sayısına bölünüyor; bölünmezse akorlar toplanıp
    // ana seviyeyi kırpıyor.
    const tepe = 0.5 / akor.notalar.length
    for (const nota of akor.notalar) this.notaCal(frekans(nota), an, tepe)

    // Kök nota iki oktav altta, tek ve kısık: akoru yere bağlıyor ama kendi
    // başına duyulmuyor.
    this.notaCal(frekans(akor.kok - 12), an, 0.1, 'sine')
  }

  private notaCal(hz: number, an: number, tepe: number, tur: OscillatorType = 'triangle') {
    const ctx = this.ctx
    if (!ctx || !this.suzgec) return

    const zarf = ctx.createGain()
    zarf.connect(this.suzgec)

    zarf.gain.setValueAtTime(0.0001, an)
    zarf.gain.linearRampToValueAtTime(tepe, an + CIKIS)
    zarf.gain.setValueAtTime(tepe, an + AKOR_SURESI)
    zarf.gain.exponentialRampToValueAtTime(0.0001, an + AKOR_SURESI + SONUS)

    // Aynı nota iki kez, birkaç sent arayla: hafif bir dalgalanma veriyor.
    // Tek osilatör düz ve sentetik duruyor, iki tanesi koro etkisi yapıyor.
    for (const sapma of [-4, 4]) {
      const osilator = ctx.createOscillator()
      osilator.type = tur
      osilator.frequency.value = hz
      osilator.detune.value = sapma
      osilator.connect(zarf)
      osilator.start(an)
      osilator.stop(an + AKOR_SURESI + SONUS + 0.1)
    }
  }
}
