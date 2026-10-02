import {
  cikisDegisimAni,
  cikisHareketi,
  geriGidilmeli,
  HIZ_PENCERESI_MS,
  hizOlc,
  yaylanmaHareketi,
  type Hareket,
  type Ornek,
} from './geri-kaydirma-hesap'

/**
 * Kenardan geri kaydırmanın durum makinesi.
 *
 * Yerli taraf (iOS `AnaDenetleyici.swift`, Android `MainActivity.java`)
 * hareketi tanıyıp sırayla `basla` → `ilerle(dx)`… → `bitir` ya da `iptal`
 * çağırıyor. DOM ve React buraya `Ortam` üzerinden giriyor; böylece mantık
 * tarayıcısız birim testinde sürülebiliyor (`geri-kaydirma-denetci.test.ts`).
 *
 * Durumlar:
 * - `bos`: hiçbir şey kaymıyor. `bitir` geri tuşu gibi doğrudan geri gider.
 * - `surukleniyor`: kutu parmağı izliyor.
 * - `cikiyor`: bırakıldı, kutu sağa çıkıyor; bitince `geriGit`.
 * - `yaylaniyor`: vazgeçildi, kutu yerine dönüyor. Yeni bir `basla` hareketi
 *   kesip kutuyu **olduğu yerden** yakalıyor.
 *
 * **Önizleme.** Sayfa kayarken altında bir önceki ekran görünüyor (iOS'un
 * kendi gezgini gibi): `onizlemeAc` o ekranın görüntüsünü altına seriyor ve
 * görüntü sayfadan yavaş, ekranın `PARALAKS` kadar solundan gelerek kayıyor.
 * Önizleme yokken (görüntü alınmamış) eski davranış sürüyor: altta sayfa
 * zemini, bırakınca yeni ekran soldan kısa bir kayışla geliyor.
 */

/** Kayan kutunun buradan görülen yüzü (gerçekte bir `HTMLElement`). */
export type Kutu = {
  style: {
    transform: string
    transition: string
    boxShadow: string
    willChange: string
    animationName: string
  }
  readonly isConnected: boolean
}

/** Önizlemenin kutusu: yalnızca kayıyor ve kırpılıyor. */
export type AltKutu = {
  style: { transform: string; transition: string; clipPath: string }
}

export type Ortam = {
  kutuBul(): Kutu | null
  /** Sürüklenebilir mi: gidilecek yer var, açık katman / tur / tam ekran test yok. */
  kaydirilabilir(): boolean
  /** Çizim gibi kenardan kaydırmayı yok sayan bir kilit açık mı. */
  kilitli(): boolean
  /**
   * Kilit açıkken bırakma da yutulsun mu. iOS'ta evet (çizimden kaydırarak
   * çıkılmıyor), Android'de hayır: orada geri hareketi geri tuşunun ta
   * kendisi ve geri tuşu kilide hiç bakmıyordu.
   */
  kilitBirakmayiYutar: boolean
  /** Bir adım geri. Ekranı **eşzamanlı** değiştirmeli (React'te `flushSync`). */
  geriGit(): boolean
  /** Gidecek yer kalmadıysa (Android'de uygulamadan çık). */
  cikis(): void
  /**
   * Bir sonraki ekranın soldan gelmesi için yön işareti. `yerinde`: önizleme
   * zaten yerine oturdu, yeni ekran hiç kaymadan gelmeli.
   */
  yonIsaretle(yerinde?: boolean): void
  yonuTemizle(): void
  /** Kutunun o anki yatay kayması (görüntü px), yaylanma kesilirken. */
  anlikKonum(kutu: Kutu): number
  /** Kutunun içindeki `fixed` öğeleri gizler; dönen fonksiyon geri getirir. */
  sabitleriGizle(kutu: Kutu): () => void
  /**
   * Kayan kutuya kenar boşluklarıyla birlikte donuk bir zemin verir — altında
   * önizleme varken saydam kutu onu kendi içinden gösterirdi. Dönen fonksiyon
   * geri alır.
   */
  zeminKur?(kutu: Kutu): () => void
  /**
   * Önceki ekranın görüntüsünü kutunun altına serer. `sol` kutunun dinlenirken
   * sol kenarı (görüntü px): geniş ekranda (iPad) kutu ortada duruyor ve
   * önizleme yalnızca kutunun solunda kalan yerde görünmeli.
   */
  onizlemeAc?(): { kutu: AltKutu; sol: number } | null
  onizlemeKapat?(): void
  genislik(): number
  olcek(): number
  azaltilmis(): boolean
  simdi(): number
  zamanla(is: () => void, ms: number): unknown
  zamanlamaIptal(kimlik: unknown): void
}

export type Durum = 'bos' | 'surukleniyor' | 'cikiyor' | 'yaylaniyor'

const GOLGE = '-10px 0 28px rgba(0, 0, 0, 0.10)'

/**
 * Önizleme kaymanın başında ekran genişliğinin bu kadarı solda duruyor ve
 * sayfayla birlikte, ondan yavaş yerine kayıyor — iOS'un kendi oranı.
 */
export const PARALAKS = 0.3

/**
 * Çıkan sayfanın ekranda bu orandan azı kalınca ekran değişiyor. Hareketin
 * yavaşlayan kuyruğu kutuyu ekranın son birkaç pikselinde gezdiriyor; tam
 * bitişte değişseydi arada birkaç kare boyunca hiçbir ekran görünmüyordu
 * (ölçüldü: 390 px'lik ekranda 5-6 kare boyunca 25 px'ten az sayfa).
 */
export const CIKIS_DEGISIM_ORANI = 0.08

export class GeriKaydirmaDenetcisi {
  durum: Durum = 'bos'
  private kutu: Kutu | null = null
  private taban = 0
  private konum = 0
  private ornekler: Ornek[] = []
  private zamanlayici: unknown = null
  private sabitleriGetir: (() => void) | null = null
  /** Çıkış sürerken gelen geri istekleri; çıkış bitince sırayla işlenir. */
  private bekleyen = 0
  /**
   * Hareket kilit açıkken başladı. Kilit hareket bitmeden kalkabilir (parmak
   * menüden kayıp kalktı); bırakma yine de o hareketin bırakması, yutulmalı.
   */
  private kilitliBasladi = false
  private alt: { kutu: AltKutu; sol: number } | null = null
  private zeminiGetir: (() => void) | null = null

  constructor(private readonly o: Ortam) {}

  basla = () => {
    if (this.durum === 'cikiyor') return
    if (this.durum === 'yaylaniyor' && this.kutu?.isConnected) {
      // Yaylanmayı kes: kutuyu olduğu yerden yakala, sıçratma.
      this.zamanlayiciyiKes()
      this.taban = this.o.anlikKonum(this.kutu)
      this.konum = this.taban
      this.ornekler = []
      this.kutu.style.transition = 'none'
      if (this.alt) this.alt.kutu.style.transition = 'none'
      this.yaz(this.konum)
      this.durum = 'surukleniyor'
      return
    }
    this.temizle()
    this.kilitliBasladi = this.o.kilitli()
    if (this.kilitliBasladi || !this.o.kaydirilabilir()) return
    const kutu = this.o.kutuBul()
    if (!kutu) return
    this.kutu = kutu
    // Giriş animasyonu (`.sayfa-ileri`, `.sayfa-girisi`) sürüyorsa transform'u
    // o yazıyor ve satır içi değeri eziyordu: ekrana girdikten hemen sonra
    // kaydırılan sayfa parmağı izlemiyor, animasyon bitince sıçrıyordu.
    // Kutu zaten girişini yaptı; animasyon bir daha hiç dönmüyor (geri
    // açılsaydı iptalden sonra giriş baştan oynardı).
    kutu.style.animationName = 'none'
    kutu.style.transition = 'none'
    kutu.style.willChange = 'transform'
    kutu.style.boxShadow = GOLGE
    this.sabitleriGetir = this.o.sabitleriGizle(kutu)
    // Zemin önce: önizlemenin `sol`u zeminli kutunun kenarından ölçülüyor.
    this.zeminiGetir = this.o.zeminKur?.(kutu) ?? null
    this.alt = this.o.onizlemeAc?.() ?? null
    this.taban = 0
    this.konum = 0
    this.ornekler = []
    this.durum = 'surukleniyor'
    if (this.alt) {
      this.alt.kutu.style.transition = 'none'
      this.yaz(0)
    }
  }

  ilerle = (dx: number) => {
    if (this.durum !== 'surukleniyor' || !this.kutu) return
    this.konum = Math.max(0, this.taban + dx)
    const t = this.o.simdi()
    this.ornekler.push({ t, x: this.konum })
    while (this.ornekler.length > 2 && t - this.ornekler[0].t > HIZ_PENCERESI_MS * 2) this.ornekler.shift()
    this.yaz(this.konum)
  }

  iptal = () => {
    this.kilitliBasladi = false
    if (this.durum !== 'surukleniyor') return
    this.yaylan(hizOlc(this.ornekler, this.o.simdi()))
  }

  bitir = () => {
    const kilitli = this.o.kilitli() || this.kilitliBasladi
    this.kilitliBasladi = false
    if (kilitli && this.o.kilitBirakmayiYutar) {
      // Çizim sırasında tanınan kenar hareketi: hiçbir şey olmamış say.
      if (this.durum === 'surukleniyor') this.yaylan(0)
      return
    }
    if (this.durum === 'cikiyor') {
      this.bekleyen++
      return
    }
    if (this.durum !== 'surukleniyor' || !this.kutu) {
      // Sürükleme yok (katman açık, gidilecek yer yok, kutu yok): geri tuşu.
      this.temizle()
      this.geriAdim(false)
      return
    }
    const hiz = hizOlc(this.ornekler, this.o.simdi())
    if (!geriGidilmeli(hiz)) {
      this.yaylan(hiz)
      return
    }
    this.durum = 'cikiyor'
    const genislik = this.o.genislik()
    const h = cikisHareketi(this.konum, genislik, hiz, this.o.azaltilmis())
    const mesafe = genislik - this.konum
    this.oynat(genislik, h, this.cikisBitti, h.sure - cikisDegisimAni(h, mesafe, genislik * CIKIS_DEGISIM_ORANI))
  }

  /** Kanca sökülürken. */
  birak = () => {
    this.zamanlayiciyiKes()
    this.temizle()
  }

  private cikisBitti = () => {
    const kutu = this.kutu
    this.geriAdim(true)
    if (kutu && kutu.isConnected) {
      // Ekran değişmedi (geri bir şeyi kapattı ama bu kutuyu değil): kutu
      // ekranın dışında kalmasın, yerine kaysın.
      this.o.yonuTemizle()
      this.konum = this.o.genislik()
      this.yaylan(0)
    } else {
      // Kutu söküldü; yeni ekran aynı karede kendi girişiyle geldi.
      this.temizle()
    }
    while (this.bekleyen > 0 && this.durum === 'bos') {
      this.bekleyen--
      this.geriAdim(false)
    }
    this.bekleyen = 0
  }

  private geriAdim(kaydirarak: boolean) {
    if (kaydirarak) this.o.yonIsaretle(this.alt !== null)
    if (!this.o.geriGit()) this.o.cikis()
  }

  private yaylan(hiz: number) {
    if (!this.kutu) return this.temizle()
    this.durum = 'yaylaniyor'
    const h = yaylanmaHareketi(this.konum, hiz, this.o.azaltilmis())
    this.oynat(0, h, () => this.temizle())
  }

  private oynat(hedef: number, h: Hareket, bitince: () => void, erken = 0) {
    const kutu = this.kutu!
    this.zamanlayiciyiKes()
    if (h.sure === 0) {
      this.yaz(hedef)
      bitince()
      return
    }
    kutu.style.transition = `transform ${h.sure}ms ${h.egri}`
    if (this.alt) {
      this.alt.kutu.style.transition = `transform ${h.sure}ms ${h.egri}, clip-path ${h.sure}ms ${h.egri}`
    }
    this.konum = hedef
    this.yaz(hedef)
    this.zamanlayici = this.o.zamanla(() => {
      this.zamanlayici = null
      bitince()
    }, Math.max(0, h.sure - erken))
  }

  private yaz(konum: number) {
    const olcek = this.o.olcek()
    if (this.kutu) this.kutu.style.transform = `translateX(${konum / olcek}px)`
    if (!this.alt) return
    const genislik = this.o.genislik()
    const kayma = (konum - genislik) * PARALAKS
    // Önizleme yalnızca kayan sayfanın solunda görünüyor. Kırpma önizlemenin
    // kendi koordinatında: sayfanın sol kenarı (sol + konum) önizlemenin
    // kaymasından arındırılıyor.
    const sagKesim = Math.max(0, genislik - (this.alt.sol + konum - kayma))
    this.alt.kutu.style.transform = `translateX(${kayma / olcek}px)`
    this.alt.kutu.style.clipPath = `inset(0 ${sagKesim / olcek}px 0 0)`
  }

  private zamanlayiciyiKes() {
    if (this.zamanlayici !== null) this.o.zamanlamaIptal(this.zamanlayici)
    this.zamanlayici = null
  }

  private temizle() {
    this.zamanlayiciyiKes()
    const kutu = this.kutu
    if (kutu) {
      kutu.style.transition = ''
      kutu.style.transform = ''
      kutu.style.boxShadow = ''
      kutu.style.willChange = ''
    }
    this.sabitleriGetir?.()
    this.sabitleriGetir = null
    this.zeminiGetir?.()
    this.zeminiGetir = null
    if (this.alt) this.o.onizlemeKapat?.()
    this.alt = null
    this.kutu = null
    this.konum = 0
    this.taban = 0
    this.ornekler = []
    this.durum = 'bos'
  }
}
