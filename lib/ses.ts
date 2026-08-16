'use client'

import type { SesSecimi } from './types'
import { LOFI_PARCALAR } from './lofi'

/**
 * Pomodoro ortam sesleri.
 *
 * Sesler dosyadan değil koddan üretiliyor: APK'ya tek bayt eklemiyor, telif
 * sorunu doğurmuyor ve sonsuza kadar döngüde kalıyor. Yöntem, istenen tınıda
 * uzunca bir tampon (buffer) bir kez üretip onu döngüye almak — her örneği
 * canlı hesaplayan bir düğüm (ScriptProcessor/AudioWorklet) telefonda boş yere
 * işlemci yakardı.
 */

/** Döngü tamponunun uzunluğu. Uzun tutuluyor ki tekrar kulağa çarpmasın. */
const TAMPON_SANIYE = 12

export type UretilenSes = 'beyaz-gurultu' | 'kahverengi-gurultu' | 'yagmur' | 'kafe'

export const URETILEN_SESLER: { id: UretilenSes; ad: string; aciklama: string }[] = [
  { id: 'yagmur', ad: 'Yağmur', aciklama: 'Sakin yağmur ve damlalar' },
  { id: 'kafe', ad: 'Kafe', aciklama: 'Uzaktan uğultu' },
  { id: 'kahverengi-gurultu', ad: 'Kahverengi gürültü', aciklama: 'Derin, pes uğultu' },
  { id: 'beyaz-gurultu', ad: 'Beyaz gürültü', aciklama: 'Düz, keskin uğultu' },
]

export function uretilenSesMi(secim: SesSecimi): secim is UretilenSes {
  return URETILEN_SESLER.some((s) => s.id === secim)
}

// ---------------------------------------------------------------------------
// Tampon üreticileri
// ---------------------------------------------------------------------------

/** Beyaz gürültü: her örnek bağımsız rastgele — bütün frekanslar eşit güçte. */
function beyazDoldur(kanal: Float32Array) {
  for (let i = 0; i < kanal.length; i++) {
    kanal[i] = Math.random() * 2 - 1
  }
}

/**
 * Kahverengi gürültü: beyaz gürültünün integrali. Yüksek frekanslar bastığı
 * için beyazdan çok daha yumuşak duyulur; uzun süre dinlenebilen tını budur.
 */
function kahverengiDoldur(kanal: Float32Array) {
  let onceki = 0
  for (let i = 0; i < kanal.length; i++) {
    const beyaz = Math.random() * 2 - 1
    onceki = (onceki + 0.02 * beyaz) / 1.02
    // İntegral aldığı için genlik düşer, geri yükseltiliyor.
    kanal[i] = onceki * 3.5
  }
}

/**
 * Yağmur: kahverengi zemin + üstüne serpiştirilmiş kısa, tiz damlalar.
 * Damlalar tampona baştan işleniyor; çalarken zamanlama yapılmıyor.
 */
function yagmurDoldur(kanal: Float32Array, ornekHizi: number) {
  kahverengiDoldur(kanal)

  // Zemini biraz kısıp damlalara yer aç
  for (let i = 0; i < kanal.length; i++) kanal[i] *= 0.55

  const damlaSayisi = Math.floor((kanal.length / ornekHizi) * 42)
  const damlaUzunluk = Math.floor(ornekHizi * 0.012)

  for (let d = 0; d < damlaSayisi; d++) {
    const bas = Math.floor(Math.random() * (kanal.length - damlaUzunluk))
    const siddet = 0.12 + Math.random() * 0.22
    for (let i = 0; i < damlaUzunluk; i++) {
      // Hızlı sönen bir tıklama
      const sonum = 1 - i / damlaUzunluk
      kanal[bas + i] += (Math.random() * 2 - 1) * siddet * sonum * sonum
    }
  }
}

/**
 * Kafe: çok pes bir uğultu (konuşma bandının altı) + seyrek, kısık tabak/bardak
 * şıkırtıları. Anlaşılır konuşma yok — dikkat dağıtmasın diye.
 */
function kafeDoldur(kanal: Float32Array, ornekHizi: number) {
  kahverengiDoldur(kanal)

  // Uğultuya yavaş bir dalgalanma: sabit gürültü yerine "kalabalık" hissi verir
  for (let i = 0; i < kanal.length; i++) {
    const dalga = 0.75 + 0.25 * Math.sin((i / ornekHizi) * 0.8) * Math.sin((i / ornekHizi) * 0.23)
    kanal[i] *= dalga * 0.7
  }

  const sikirtiSayisi = Math.floor((kanal.length / ornekHizi) * 1.4)
  const uzunluk = Math.floor(ornekHizi * 0.05)

  for (let s = 0; s < sikirtiSayisi; s++) {
    const bas = Math.floor(Math.random() * (kanal.length - uzunluk))
    const frekans = 2200 + Math.random() * 2600
    const siddet = 0.05 + Math.random() * 0.05
    for (let i = 0; i < uzunluk; i++) {
      const sonum = Math.exp(-i / (uzunluk * 0.18))
      kanal[bas + i] += Math.sin((2 * Math.PI * frekans * i) / ornekHizi) * siddet * sonum
    }
  }
}

function tamponUret(ctx: AudioContext, ses: UretilenSes): AudioBuffer {
  const uzunluk = Math.floor(ctx.sampleRate * TAMPON_SANIYE)
  const tampon = ctx.createBuffer(1, uzunluk, ctx.sampleRate)
  const kanal = tampon.getChannelData(0)

  switch (ses) {
    case 'beyaz-gurultu':
      beyazDoldur(kanal)
      break
    case 'kahverengi-gurultu':
      kahverengiDoldur(kanal)
      break
    case 'yagmur':
      yagmurDoldur(kanal, ctx.sampleRate)
      break
    case 'kafe':
      kafeDoldur(kanal, ctx.sampleRate)
      break
  }

  // Döngü dikişi duyulmasın diye baş ve son kısa bir çapraz geçişle yumuşatılır.
  const gecis = Math.floor(ctx.sampleRate * 0.05)
  for (let i = 0; i < gecis; i++) {
    const oran = i / gecis
    const bas = kanal[i]
    const son = kanal[kanal.length - gecis + i]
    kanal[i] = bas * oran + son * (1 - oran)
  }

  return tampon
}

// ---------------------------------------------------------------------------
// Çalar
// ---------------------------------------------------------------------------

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
  private tamponlar = new Map<UretilenSes, AudioBuffer>()
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

  /** Seçilen sesi döngüye alır. 'yok' ise sadece durdurur. */
  cal(secim: SesSecimi) {
    this.durdur()
    if (secim === 'yok') return

    if (uretilenSesMi(secim)) {
      const ctx = this.baglamAl()
      void ctx.resume()

      let tampon = this.tamponlar.get(secim)
      if (!tampon) {
        tampon = tamponUret(ctx, secim)
        this.tamponlar.set(secim, tampon)
      }

      const kaynak = ctx.createBufferSource()
      kaynak.buffer = tampon
      kaynak.loop = true
      kaynak.connect(this.kazanc!)
      kaynak.start()
      this.kaynak = kaynak
      return
    }

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
      this.tamponlar.clear()
    }
  }
}
