'use client'

/**
 * Mod müzikleri — turun kuralını duyuran arka plan.
 *
 * Tek bir parça dört modu birden taşıyamıyordu: Rahat turda sakin bir pad
 * doğruyken, Ani Ölüm'de aynı pad turu olduğundan yavaş gösteriyor. Artık her
 * modun **kendi bestesi** var ve üçü ayrı parça — aynı ezginin hızlandırılmış
 * hâli değil. Aynı melodiyi hızlandırmak, üç modu tek bir modun üç ayarı gibi
 * gösterirdi; oysa aralarındaki fark tempo değil kural.
 *
 * | Mod | Parça | Nasıl |
 * | --- | --- | --- |
 * | Rahat | sakin pad (`oyun-muzigi.ts`) | vuruşsuz, akorlar 7 saniyede bir |
 * | Sıradan | "Yürüyüş" — Am/F/C/G, marimba arpej | süre azaldıkça hızlanır |
 * | Turbo | "Koşu" — Dm/B♭/F/C, senkoplu bas | hızlı başlar, sonda daha hızlanır |
 * | Ani Ölüm | "Nefes yok" — Em pedal, inen kromatik | baştan sona aynı hızlı nabız |
 *
 * ## Gerginlik
 *
 * Parçalar dışarıdan tek bir sayı alıyor: `muzikGerginligi(oran)`, 0 turun
 * başı, 1 sonu. Oyun kabuğu bunu sayaçtan türetip besliyor (`oyun-kabuk.tsx`),
 * yani 18 oyun dosyasının müzikten haberi yok — efektlerdeki kuralın aynısı.
 *
 * Gerginliği tempoya çevirmek her parçanın kendi işi: Sıradan sürekli
 * hızlanıyor, Turbo yalnızca sonda bir vites atıyor, Ani Ölüm hiç bakmıyor
 * (orada tur saati yok, baskı zaten sabit).
 *
 * ## Zamanlama
 *
 * `setTimeout` ile nota çalınmıyor: JS zamanlayıcıları arka planda kısılıyor ve
 * ritim aksıyor. Bunun yerine kısa aralıklarla uyanıp AudioContext saatine göre
 * bir sonraki dilim **önceden** planlanıyor (`ILERI_BAKIS`). Ritmik müzikte bu
 * şart — pad'de birkaç ms gecikme duyulmaz, 16'lık hi-hat'te duyulur.
 *
 * Tempo değişimi de nota nota uygulanıyor: bir sonraki adımın anı, o adımın
 * planlandığı andaki tempoyla hesaplanıyor. Çalan sesin süresini geriye dönük
 * değiştirmek mümkün değil, o yüzden hızlanma en fazla bir adım gecikmeyle
 * duyuluyor — kulakta yumuşak bir geçiş olarak.
 */

import type { OyunModu } from './mod'
import { OyunMuzigi } from './oyun-muzigi'

/** Bir vuruşta kaç adım — 16'lık nabız. */
const ADIM_SAYISI = 16

/** Kaç saniyelik nota önceden planlanıyor. */
const ILERI_BAKIS = 0.35

/** Planlayıcının uyanma sıklığı (ms) — ILERI_BAKIS'ın epey altında. */
const UYANMA = 90

/**
 * Müziğin ana ses seviyesi.
 *
 * Efekt dosyaları 0.42'de çalıyor (`oyun-sesi.ts`) ve müzik onların altında
 * kalmalı: doğru/yanlış geri bildirimi oyunun tek sesli işareti, müzik
 * bastırırsa oyun sessizleşmiş sayılır. Hedef, telefonun ses düzeyi ortadayken
 * ikisinin de duyulması: müzik odanın sesini bastırmıyor, efekt müziğin içinde
 * kaybolmuyor.
 *
 * Değer 0.09'du ve kullanıcı telefonda "duyulmuyor" dedi. Hesap kâğıt üstünde
 * doğruydu ama tek şeyi atlıyordu: efektler kaydedilmiş, ustalanmış dosyalar,
 * bu parçalar ise sıfırdan sentezlenen ince dalgalar — aynı sayı ikisinde aynı
 * gürlük demek değil. Sentezlenmiş bir parça, efektle eşit duyulmak için
 * sayıca ondan yüksek durmak zorunda değil ama bu kadar altında da kalamıyor.
 */
export const MUZIK_SEVIYESI = 0.26

/**
 * Modun temposu (BPM) — gerginliğe göre.
 *
 * Saf ve dışa açık: parçaların tempo kuralı, ses altyapısı olmadan
 * denetlenebilsin diye burada duruyor (`mod-muzigi.test.ts`). Kural üç modda
 * üç farklı biçimde işliyor ve karışması kolay.
 */
export function tempo(mod: OyunModu, gerginlik: number): number {
  const oran = Math.min(1, Math.max(0, gerginlik))
  // Sıradan sürekli hızlanıyor: tur saati eridikçe kulak da onu duyuyor.
  if (mod === 'siradan') return 88 + 46 * oran
  // Turbo basamaklı: baştan hızlı, son çeyrekte tek seferde vites atıyor.
  if (mod === 'turbo') return oran > 0.72 ? 168 : 138
  // Ani Ölümde tur saati yok; baskı ilk soruda da son soruda da aynı.
  if (mod === 'ani-olum') return 152
  // Rahat modun parçasında vuruş yok — temposu da yok.
  return 0
}

function frekans(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12)
}

/**
 * Ritmik parçaların ortak motoru.
 *
 * Zamanlama, ses yardımcıları ve seviye burada; **ne çalınacağı** her parçanın
 * kendi `adim` gövdesinde. Ortak motor olmasaydı üç parça üç kez zamanlayıcı
 * yazardı; tek parça olsaydı üçü aynı besteye benzerdi.
 */
abstract class RitimMotoru {
  protected ctx: AudioContext | null = null
  protected ana: GainNode | null = null
  private gurultu: AudioBuffer | null = null
  private zamanlayici: ReturnType<typeof setInterval> | null = null
  private sonrakiAn = 0
  private adimNo = 0
  private seviye = MUZIK_SEVIYESI
  protected gerginlik = 0

  /** Parçanın o anki temposu (BPM) — gerginliğe nasıl bakacağına kendi karar veriyor. */
  protected abstract bpm(): number

  /** 16'lık ızgaranın tek bir adımı. `sira` 0–15, `an` AudioContext saati. */
  protected abstract adim(sira: number, an: number): void

  /** Kaç adımda bir akor değişiyor — döngü uzunluğu parçaya göre. */
  protected abstract get dongu(): number

  sesSeviyesi(deger: number) {
    this.seviye = Math.min(1, Math.max(0, deger))
    if (this.ana) this.ana.gain.value = this.seviye
  }

  gerginligiAyarla(oran: number) {
    this.gerginlik = Math.min(1, Math.max(0, oran))
  }

  basla() {
    if (this.zamanlayici !== null) return

    const Yapici =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Yapici) return

    if (!this.ctx) this.kur(new Yapici())
    const ctx = this.ctx
    if (!ctx) return
    void ctx.resume()

    this.sonrakiAn = Math.max(this.sonrakiAn, ctx.currentTime + 0.08)
    this.zamanlayici = setInterval(() => this.planla(), UYANMA)
  }

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
    }
  }

  // -------------------------------------------------------------------------

  private kur(ctx: AudioContext) {
    this.ctx = ctx
    this.ana = ctx.createGain()
    this.ana.gain.value = this.seviye
    this.ana.connect(ctx.destination)

    // Beyaz gürültü bir kez üretilip saklanıyor: hi-hat her 16'lıkta çalıyor ve
    // her seferinde tampon doldurmak boşuna iş.
    const uzunluk = Math.floor(ctx.sampleRate * 0.4)
    const tampon = ctx.createBuffer(1, uzunluk, ctx.sampleRate)
    const veri = tampon.getChannelData(0)
    for (let i = 0; i < uzunluk; i += 1) veri[i] = Math.random() * 2 - 1
    this.gurultu = tampon
  }

  private planla() {
    const ctx = this.ctx
    if (!ctx) return

    while (this.sonrakiAn < ctx.currentTime + ILERI_BAKIS) {
      this.adim(this.adimNo % this.dongu, this.sonrakiAn)
      // Adımın süresi o adım planlanırken hesaplanıyor: tempo değişimi buradan
      // sızıyor ve en fazla bir adım gecikmeyle duyuluyor.
      this.sonrakiAn += 60 / this.bpm() / (ADIM_SAYISI / 4)
      this.adimNo += 1
    }
  }

  /** Alçak, kısa vuruş — perdesi hızla düşen sinüs. */
  protected vurus(an: number, tepe = 0.9, baslangicHz = 130) {
    const ctx = this.ctx
    if (!ctx || !this.ana) return
    const osilator = ctx.createOscillator()
    const zarf = ctx.createGain()
    osilator.type = 'sine'
    osilator.frequency.setValueAtTime(baslangicHz, an)
    osilator.frequency.exponentialRampToValueAtTime(45, an + 0.11)
    zarf.gain.setValueAtTime(0.0001, an)
    zarf.gain.exponentialRampToValueAtTime(tepe, an + 0.006)
    zarf.gain.exponentialRampToValueAtTime(0.0001, an + 0.14)
    osilator.connect(zarf)
    zarf.connect(this.ana)
    osilator.start(an)
    osilator.stop(an + 0.16)
  }

  /** Gürültüden kesilen kısa tık — hi-hat. */
  protected tik(an: number, tepe = 0.12, sure = 0.035, kesim = 7000) {
    const ctx = this.ctx
    if (!ctx || !this.ana || !this.gurultu) return
    const kaynak = ctx.createBufferSource()
    const suzgec = ctx.createBiquadFilter()
    const zarf = ctx.createGain()
    kaynak.buffer = this.gurultu
    suzgec.type = 'highpass'
    suzgec.frequency.value = kesim
    zarf.gain.setValueAtTime(tepe, an)
    zarf.gain.exponentialRampToValueAtTime(0.0001, an + sure)
    kaynak.connect(suzgec)
    suzgec.connect(zarf)
    zarf.connect(this.ana)
    kaynak.start(an)
    kaynak.stop(an + sure + 0.02)
  }

  /** Perdeli tek nota. Süzgeç kesimi enstrümanın karakterini veriyor. */
  protected nota(
    midi: number,
    an: number,
    sure: number,
    {
      tepe = 0.2,
      bicim = 'triangle',
      kesim = 2400,
      sapma = 0,
    }: { tepe?: number; bicim?: OscillatorType; kesim?: number; sapma?: number } = {},
  ) {
    const ctx = this.ctx
    if (!ctx || !this.ana) return
    const osilator = ctx.createOscillator()
    const suzgec = ctx.createBiquadFilter()
    const zarf = ctx.createGain()

    osilator.type = bicim
    osilator.frequency.value = frekans(midi)
    osilator.detune.value = sapma
    suzgec.type = 'lowpass'
    suzgec.frequency.value = kesim

    // Kısa ama sıfır olmayan çıkış: ani başlangıç "tık" sesi çıkarıyor.
    zarf.gain.setValueAtTime(0.0001, an)
    zarf.gain.exponentialRampToValueAtTime(tepe, an + 0.012)
    zarf.gain.exponentialRampToValueAtTime(0.0001, an + sure)

    osilator.connect(suzgec)
    suzgec.connect(zarf)
    zarf.connect(this.ana)
    osilator.start(an)
    osilator.stop(an + sure + 0.03)
  }
}

/**
 * Sıradan — "Yürüyüş".
 *
 * Am–F–C–G üzerinde yumuşak bir marimba arpeji ve 8'liklerde yürüyen bas.
 * Tempo turun başında 88, sonunda 134: hızlanma sürekli ve yavaş, yani
 * oyuncu saate bakmadan da sürenin daraldığını duyuyor. Hi-hat ve ikinci
 * vuruş yalnızca ikinci yarıda giriyor — düzenleme de sıkışıyor, tek başına
 * tempo artışı "kayıt hızlanmış" gibi duyuluyordu.
 */
class SiradanMuzik extends RitimMotoru {
  /** Am – F – C – G. Bas kökleri ve arpej notaları. */
  private static AKORLAR = [
    { kok: 45, notalar: [69, 72, 76] },
    { kok: 41, notalar: [69, 72, 77] },
    { kok: 48, notalar: [67, 72, 76] },
    { kok: 43, notalar: [67, 71, 74] },
  ]

  protected get dongu() {
    return ADIM_SAYISI * SiradanMuzik.AKORLAR.length
  }

  protected bpm() {
    return tempo('siradan', this.gerginlik)
  }

  protected adim(sira: number, an: number) {
    const akor = SiradanMuzik.AKORLAR[Math.floor(sira / ADIM_SAYISI)]
    const yerel = sira % ADIM_SAYISI

    if (yerel === 0 || yerel === 8) this.vurus(an, 0.75)
    // Sıkışan yarıda ikinci bir vuruş ve hi-hat: aynı ezgi daha yoğun duyuluyor.
    if (this.gerginlik > 0.4 && (yerel === 4 || yerel === 12)) this.tik(an, 0.13, 0.07, 4200)
    if (this.gerginlik > 0.55 && yerel % 4 === 2) this.tik(an, 0.07)
    if (this.gerginlik > 0.82 && yerel % 2 === 1) this.tik(an, 0.045, 0.025)

    // Bas 8'liklerde: kök – beşli – kök – beşli.
    if (yerel % 4 === 0) {
      const bes = yerel % 8 === 0 ? akor.kok - 12 : akor.kok - 5
      this.nota(bes, an, 0.34, { tepe: 0.28, bicim: 'triangle', kesim: 700 })
    }

    // Arpej 8'liklerin arasında; yükselip inen üç nota.
    if (yerel % 2 === 0) {
      const sirali = [0, 1, 2, 1, 0, 1, 2, 1][yerel / 2]
      this.nota(akor.notalar[sirali], an, 0.42, { tepe: 0.11, kesim: 2600, sapma: 4 })
    }
  }
}

/**
 * Turbo — "Koşu".
 *
 * Başka bir tonalite (Dm–B♭–F–C) ve başka bir enstrüman: kare dalgadan kısa,
 * senkoplu bir bas. Baştan hızlı (138) ve son çeyrekte tek seferde 168'e
 * çıkıyor — Turbo'nun kuralı da böyle: kısa tur, sonunda ani baskı.
 */
class TurboMuzik extends RitimMotoru {
  private static AKORLAR = [
    { kok: 38, notalar: [65, 69, 72] },
    { kok: 34, notalar: [65, 70, 74] },
    { kok: 41, notalar: [65, 69, 72] },
    { kok: 36, notalar: [64, 67, 72] },
  ]

  /** Basın senkoplu deseni — 16'lık ızgarada vurduğu adımlar. */
  private static BAS = [0, 3, 6, 8, 11, 14]

  protected get dongu() {
    return ADIM_SAYISI * TurboMuzik.AKORLAR.length
  }

  protected bpm() {
    return tempo('turbo', this.gerginlik)
  }

  protected adim(sira: number, an: number) {
    const akor = TurboMuzik.AKORLAR[Math.floor(sira / ADIM_SAYISI)]
    const yerel = sira % ADIM_SAYISI

    // Dört vuruş yerde: koşu temposunun omurgası.
    if (yerel % 4 === 0) this.vurus(an, 0.8, 150)
    if (yerel % 8 === 4) this.tik(an, 0.16, 0.08, 3600)
    if (yerel % 2 === 0) this.tik(an, 0.06)
    if (this.gerginlik > 0.72 && yerel % 2 === 1) this.tik(an, 0.05, 0.022)

    if (TurboMuzik.BAS.includes(yerel)) {
      this.nota(akor.kok - 12, an, 0.13, { tepe: 0.3, bicim: 'square', kesim: 900 })
    }

    // Akor vuruşları ters vuruşta: senkopu duyuran şey bu iki nokta.
    if (yerel === 2 || yerel === 10) {
      for (const nota of akor.notalar) {
        this.nota(nota, an, 0.16, { tepe: 0.07, bicim: 'sawtooth', kesim: 1800 })
      }
    }
  }
}

/**
 * Ani Ölüm — "Nefes yok".
 *
 * Tek akor değil tek **pedal**: bas hep E'de duruyor, üstteki çizgi her ölçüde
 * bir yarım ton iniyor (E – D♯ – D – C♯). Kromatik iniş çözülmüyor; gerilimin
 * kaynağı bu, tempo değil.
 *
 * Gerginliğe bakmıyor: modda tur saati yok ve baskı ilk soruda da son soruda da
 * aynı — hızlanan bir müzik, olmayan bir sayacı taklit ederdi.
 */
class AniOlumMuzik extends RitimMotoru {
  /** İnen üst çizgi: E, D♯, D, C♯. */
  private static CIZGI = [76, 75, 74, 73]

  protected get dongu() {
    return ADIM_SAYISI * AniOlumMuzik.CIZGI.length
  }

  protected bpm() {
    return tempo('ani-olum', this.gerginlik)
  }

  protected adim(sira: number, an: number) {
    const ust = AniOlumMuzik.CIZGI[Math.floor(sira / ADIM_SAYISI)]
    const yerel = sira % ADIM_SAYISI

    // Düzensiz aksan: 0 – 6 – 10. Dört vuruş yerde olsaydı koşu gibi olurdu,
    // burada istenen tedirginlik.
    if (yerel === 0 || yerel === 6 || yerel === 10) this.vurus(an, 0.7, 110)
    this.tik(an, yerel % 4 === 0 ? 0.075 : 0.04, 0.022, 8000)

    // Pedal bas: her 8'likte aynı nota, kısa ve kuru.
    if (yerel % 4 === 0) this.nota(28, an, 0.16, { tepe: 0.32, bicim: 'square', kesim: 600 })

    // Tremolo: 16'lıkta tekrarlayan iki nota, nefes bırakmıyor.
    if (yerel % 2 === 0) {
      this.nota(ust, an, 0.1, { tepe: 0.085, bicim: 'sawtooth', kesim: 1500, sapma: -6 })
    }
    if (yerel % 4 === 3) {
      this.nota(ust - 12, an, 0.12, { tepe: 0.07, bicim: 'triangle', kesim: 1200 })
    }
  }
}

/**
 * Çalan parça — aynı anda yalnızca bir tane.
 *
 * Modül düzeyinde tekil: gerginliği besleyen yer oyun kabuğu, parçayı kuran yer
 * oyunlar ekranı. İkisinin aynı nesneye ulaşması gerekiyordu ve prop olarak
 * geçirmek 18 oyun dosyasından geçmek demekti (`oyun-sesi.ts` ile aynı gerekçe).
 */
let calan: { mod: OyunModu; parca: RitimMotoru | OyunMuzigi } | null = null

function parcaKur(mod: OyunModu): RitimMotoru | OyunMuzigi {
  if (mod === 'siradan') return new SiradanMuzik()
  if (mod === 'turbo') return new TurboMuzik()
  if (mod === 'ani-olum') return new AniOlumMuzik()
  // Rahat mod eski sakin pad'i kullanıyor: vuruşsuz tur, vuruşsuz müzik.
  return new OyunMuzigi()
}

/**
 * Moda ait parçayı çalar. Aynı mod için ikinci çağrı bir şey yapmıyor; mod
 * değişmişse eski parça kapatılıp yenisi kuruluyor.
 */
export function muzikBaslat(mod: OyunModu) {
  if (calan && calan.mod !== mod) muzikDurdur()
  if (!calan) {
    const parca = parcaKur(mod)
    // Sakin pad kendi dengesini koruyor: sürekli ve vuruşsuz olduğu için aynı
    // seviyede ritmik parçalardan daha çok fark ediliyor, o yüzden altında.
    parca.sesSeviyesi(mod === 'rahat' ? 0.18 : MUZIK_SEVIYESI)
    calan = { mod, parca }
  }
  calan.parca.basla()
}

/** Uygulama arka plana geçince: ses susar, bağlam açık kalır. */
export function muzikDuraklat() {
  calan?.parca.duraklat()
}

export function muzikDurdur() {
  calan?.parca.kapat()
  calan = null
}

/**
 * Turun ne kadarının geçtiği (0–1). Sayacı olmayan modlarda çağrılmıyor;
 * çağrılsa da o parçalar gerginliğe bakmıyor.
 */
export function muzikGerginligi(oran: number) {
  const parca = calan?.parca
  if (parca instanceof OyunMuzigi) return
  parca?.gerginligiAyarla(oran)
}
