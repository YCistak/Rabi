import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/** Yerli eklentinin olay sırasını taklit eden sahte; süreleri testler belirler. */
const sahte = vi.hoisted(() => {
  type Olay = Record<string, unknown>
  const dinleyiciler = new Map<string, Set<(o: Olay) => unknown>>()
  const s = {
    dinleyiciler,
    oturum: 0,
    acik: false,
    startSayisi: 0,
    stopSayisi: 0,
    forceStopSayisi: 0,
    /** Sıradaki start çağrılarının reddedilme metinleri. */
    startRetleri: [] as string[],
    /** `stop` sonrası yerli kapanışa kadar geçen süre; `null` ise hiç kapanmaz. */
    kapanisMs: 10 as number | null,
    /** `stop` sonrası kapanıştan hemen önce gelen kesin sonuç. */
    sonSonuc: null as string[] | null,
    otomatikBasla: true,
    kullanilabilir: true,
    yay(ad: string, olay: Olay): void {
      for (const d of [...(dinleyiciler.get(ad) ?? [])]) d(olay)
    },
    sonuc(...matches: string[]): void {
      s.yay('partialResults', { matches })
    },
    kapat(reason = 'results', errorCode?: string, sessionId ?: number): void {
      sessionId ??= s.oturum
      if (sessionId === s.oturum) s.acik = false
      s.yay('listeningState', { state: 'stoppingListening', sessionId, reason, errorCode })
      s.yay('readyForNextSession', { sessionId })
      s.yay('listeningState', { state: 'stopped', status: 'stopped', sessionId, reason, errorCode })
    },
    hata(code: string, sessionId ?: number): void {
      sessionId ??= s.oturum
      s.yay('error', { code, message: code, sessionId })
      s.kapat('error', code, sessionId)
    },
    basladi(): void {
      s.yay('listeningState', { state: 'started', status: 'started', sessionId: s.oturum })
    },
  }
  return s
})

vi.mock('./kamera', () => ({ cihazdaMi: () => cihaz.deger }))
const cihaz = vi.hoisted(() => ({ deger: true }))

vi.mock('@capgo/capacitor-speech-recognition', () => ({
  SpeechRecognition: {
    available: async () => ({ available: sahte.kullanilabilir }),
    checkPermissions: async () => ({ speechRecognition: 'granted' }),
    requestPermissions: async () => ({ speechRecognition: 'granted' }),
    removeAllListeners: async () => sahte.dinleyiciler.clear(),
    addListener: async (ad: string, fn: (o: Record<string, unknown>) => unknown) => {
      const kume = sahte.dinleyiciler.get(ad) ?? new Set()
      kume.add(fn)
      sahte.dinleyiciler.set(ad, kume)
      return { remove: async () => void kume.delete(fn) }
    },
    start: async () => {
      sahte.startSayisi += 1
      const ret = sahte.startRetleri.shift()
      if (ret) throw new Error(ret)
      if (sahte.acik) throw new Error('Speech recognition is already running.')
      sahte.acik = true
      sahte.oturum += 1
      sahte.yay('listeningState', { state: 'startingListening', sessionId: sahte.oturum })
      if (sahte.otomatikBasla) sahte.basladi()
      return {}
    },
    stop: async () => {
      sahte.stopSayisi += 1
      if (!sahte.acik) return
      const id = sahte.oturum
      if (sahte.kapanisMs === null) return
      setTimeout(() => {
        if (sahte.oturum !== id || !sahte.acik) return
        if (sahte.sonSonuc) sahte.sonuc(...sahte.sonSonuc)
        sahte.kapat('userStop')
      }, sahte.kapanisMs)
    },
    forceStop: async () => {
      sahte.forceStopSayisi += 1
      if (sahte.acik) setTimeout(() => sahte.acik && sahte.kapat('forceStop'), 0)
    },
  },
}))

type Modul = typeof import('./ses-tanima')
let modul: Modul

function izle(bitti: Promise<string>) {
  const durum: { metin?: string; kod?: string; bitti: boolean } = { bitti: false }
  bitti.then(
    (m) => Object.assign(durum, { metin: m, bitti: true }),
    (h) => Object.assign(durum, { kod: h.kod, bitti: true }),
  )
  return durum
}
const gec = (ms: number) => vi.advanceTimersByTimeAsync(ms)

beforeEach(async () => {
  vi.useFakeTimers()
  vi.resetModules()
  Object.assign(sahte, {
    oturum: 0, acik: false, startSayisi: 0, stopSayisi: 0, forceStopSayisi: 0,
    startRetleri: [], kapanisMs: 10, sonSonuc: null, otomatikBasla: true, kullanilabilir: true,
  })
  sahte.dinleyiciler.clear()
  cihaz.deger = true
  modul = await import('./ses-tanima')
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('cihazda dinleme', () => {
  it('onBasladi yalnız yerli started olayında bir kez çağrılır', async () => {
    sahte.otomatikBasla = false
    const onBasladi = vi.fn()
    const o = modul.dinle({ onKismi: () => {}, onBasladi })
    await gec(50)
    expect(onBasladi).not.toHaveBeenCalled()
    sahte.basladi()
    sahte.basladi()
    expect(onBasladi).toHaveBeenCalledTimes(1)
    o.durdur()
    await gec(100)
  })

  it.each(['NO_MATCH', 'SPEECH_TIMEOUT', 'KAFASSISTANTERRORDOMAIN_1110'])('%s oturumu kapatmaz, dinleme sürer', async (kod) => {
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(5_000)
    sahte.hata(kod)
    await gec(500)
    expect(d.bitti).toBe(false)
    expect(sahte.startSayisi).toBe(2)
    sahte.sonuc('20 matematik')
    o.durdur()
    await gec(100)
    expect(d.metin).toBe('20 matematik')
  })

  it('sessizlikte 60 saniye sürer, sonra boş biter', async () => {
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    for (let i = 0; i < 11; i++) {
      await gec(5_000)
      if (!d.bitti) sahte.hata('SPEECH_TIMEOUT')
      await gec(150)
    }
    expect(d.bitti).toBe(false)
    await gec(6_000)
    expect(d.bitti).toBe(true)
    expect(d.metin).toBe('')
  })

  it('art arda hemen boş dönen segmentlerde boşa dönmez', async () => {
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    for (let i = 0; i < 30 && !d.bitti; i++) {
      await gec(10)
      if (sahte.acik) sahte.hata('NO_MATCH')
      await gec(310)
    }
    expect(d.kod).toBe('sessizlik')
    expect(sahte.startSayisi).toBeLessThanOrEqual(8)
  })

  it.each([
    ['RECOGNIZER_BUSY', 'mesgul'],
    ['CLIENT', 'baslatilamadi'],
    ['SERVER_DISCONNECTED', 'baslatilamadi'],
  ])('%s sınırlı yeniden denenir', async (kod, sonuc) => {
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(10)
    sahte.hata(kod)
    await gec(2_000)
    expect(d.bitti).toBe(false)
    for (let i = 0; i < 10 && !d.bitti; i++) {
      if (sahte.acik) sahte.hata(kod)
      await gec(2_000)
    }
    expect(d.kod).toBe(sonuc)
    expect(sahte.startSayisi).toBe(4)
  })

  it.each([
    ['INSUFFICIENT_PERMISSIONS', 'izin'],
    ['MICROPHONE_PERMISSION_DENIED', 'izin'],
    ['NETWORK', 'ag'],
    ['NETWORK_TIMEOUT', 'ag'],
    ['NSURLERRORDOMAIN_1009', 'ag'],
    ['UNSUPPORTED_LOCALE', 'dil'],
  ])('%s → %s koduyla hemen biter', async (kod, beklenen) => {
    const d = izle(modul.dinle({ onKismi: () => {} }).bitti)
    await gec(10)
    sahte.hata(kod)
    await gec(100)
    expect(d.kod).toBe(beklenen)
    expect(sahte.startSayisi).toBe(1)
  })

  it('kalıcı hatada eldeki söz kaybolmaz', async () => {
    const d = izle(modul.dinle({ onKismi: () => {} }).bitti)
    await gec(10)
    sahte.sonuc('20 matematik')
    sahte.hata('NETWORK')
    await gec(100)
    expect(d.metin).toBe('20 matematik')
  })

  it('Bitirden 2 saniye sonra gelen kesin sonucu bekler', async () => {
    sahte.kapanisMs = 2_000
    sahte.sonSonuc = ['matematik 45 soru']
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(10)
    sahte.sonuc('matematik')
    o.durdur()
    await gec(1_900)
    expect(d.bitti).toBe(false)
    await gec(200)
    expect(d.metin).toBe('matematik 45 soru')
  })

  it('yerli kapanış hiç gelmezse 3 saniyede biter ve yerli oturum sahipsiz kalmaz', async () => {
    sahte.kapanisMs = null
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(10)
    o.durdur()
    await gec(3_100)
    expect(d.metin).toBe('')
    expect(sahte.forceStopSayisi).toBe(1)
    expect(sahte.acik).toBe(false)
  })

  it('yeni oturum öncekinin yerli kapanışını bekler', async () => {
    sahte.kapanisMs = 2_000
    const bir = modul.dinle({ onKismi: () => {} })
    await gec(10)
    bir.durdur()
    const iki = modul.dinle({ onKismi: () => {} })
    const d = izle(iki.bitti)
    await gec(1_000)
    expect(sahte.startSayisi).toBe(1)
    await gec(1_200)
    expect(sahte.startSayisi).toBe(2)
    expect(d.bitti).toBe(false)
  })

  it('start "already running" derse yeniden dener', async () => {
    sahte.startRetleri = ['Speech recognition is already running.']
    const d = izle(modul.dinle({ onKismi: () => {} }).bitti)
    await gec(2_000)
    expect(d.bitti).toBe(false)
    expect(sahte.startSayisi).toBe(2)
  })

  it('boş sonuç eldeki metni silmez, revizyon çift metin üretmez', async () => {
    const gorulen: string[] = []
    const o = modul.dinle({ onKismi: (m) => gorulen.push(m) })
    const d = izle(o.bitti)
    await gec(10)
    for (const m of ['mat', 'matematik kırk', 'matematik 45 soru', 'matematik 40', '']) sahte.sonuc(m)
    o.durdur()
    await gec(100)
    expect(d.metin).toBe('matematik 40')
  })

  it.each([
    ['yüz yirmi beş', '125'],
    ['bir iki üç', '123'],
    ['matematikten kırk beş soru', 'matematikten 45'],
    ['bugün matematik kırk', 'bugün'],
  ])('duraklamadan sonra gelen "%s" → "%s" revizyonu çiftlenmez', async (once, sonra) => {
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(10)
    sahte.sonuc(once)
    await gec(2_000)
    sahte.sonuc(sonra)
    o.durdur()
    await gec(100)
    expect(d.metin).toBe(sonra)
  })

  it('duraklamadan sonra bambaşka sözle sıfırlanan ara metin öncekini silmez', async () => {
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(10)
    sahte.sonuc('bugün 20 matematik çözdüm')
    await gec(2_000)
    sahte.sonuc('fizikten')
    sahte.sonuc('fizikten 30')
    o.durdur()
    await gec(100)
    expect(d.metin).toBe('bugün 20 matematik çözdüm fizikten 30')
  })

  it('sıfırlanan metin sonradan bütünüyle dönerse çiftlenmez', async () => {
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(10)
    sahte.sonuc('bugün 20 matematik çözdüm')
    await gec(2_000)
    sahte.sonuc('fizikten')
    sahte.sonuc('bugün 20 matematik çözdüm fizikten 30')
    o.durdur()
    await gec(100)
    expect(d.metin).toBe('bugün 20 matematik çözdüm fizikten 30')
  })

  it('eski yerli oturumun olayları yeni oturumu etkilemez', async () => {
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(10)
    sahte.hata('NETWORK', sahte.oturum - 1)
    await gec(500)
    expect(d.bitti).toBe(false)
    expect(sahte.startSayisi).toBe(1)
  })

  it('başlamadan durdurulursa yerli oturum hiç açılmaz', async () => {
    const o = modul.dinle({ onKismi: () => {} })
    o.durdur()
    const d = izle(o.bitti)
    await gec(100)
    expect(d.metin).toBe('')
    expect(sahte.startSayisi).toBe(0)
  })

  it('servis yoksa servis-yok koduyla reddeder', async () => {
    sahte.kullanilabilir = false
    const d = izle(modul.dinle({ onKismi: () => {} }).bitti)
    await gec(10)
    expect(d.kod).toBe('servis-yok')
  })
})

describe('kalıcı hata', () => {
  it('mikrofonu yalnız izin reddi ve servis/dil yokluğu kaldırır', () => {
    const kodlar = ['izin', 'servis-yok', 'dil', 'mikrofon-yok', 'ag', 'mesgul', 'baslatilamadi', 'sessizlik'] as const
    expect(kodlar.filter((k) => modul.sesHatasiKaliciMi(k))).toEqual(['izin', 'servis-yok', 'dil'])
  })
})

describe('tarayıcıda dinleme', () => {
  type Sonuc = { m: string; kesin?: boolean; guven?: number }
  class SahteTanima {
    static hepsi: SahteTanima[] = []
    static startHatasi: Error | null = null
    /** `stop` sonrası gelecek son sonuç. */
    static sonSonuc: Sonuc[] | null = null
    static bitisMs: number | null = 10
    continuous = false
    interimResults = false
    lang = ''
    maxAlternatives = 1
    onstart: (() => void) | null = null
    onresult: ((o: unknown) => void) | null = null
    onerror: ((o: { error: string }) => void) | null = null
    onend: (() => void) | null = null
    iptal = false
    constructor() {
      SahteTanima.hepsi.push(this)
    }
    start() {
      if (SahteTanima.startHatasi) throw SahteTanima.startHatasi
    }
    stop() {
      if (SahteTanima.bitisMs === null) return
      setTimeout(() => {
        if (SahteTanima.sonSonuc) this.sonuc(...SahteTanima.sonSonuc)
        this.onend?.()
      }, SahteTanima.bitisMs)
    }
    abort() {
      this.iptal = true
      const { onerror, onend } = this
      onerror?.({ error: 'aborted' })
      onend?.()
    }
    sonuc(...liste: Sonuc[]) {
      const results = liste.map((x) =>
        Object.assign([{ transcript: x.m, confidence: x.guven ?? 0.9 }], { isFinal: x.kesin ?? false }),
      )
      this.onresult?.({ resultIndex: 0, results })
    }
    hata(error: string) {
      this.onerror?.({ error })
      this.onend?.()
    }
  }
  const son = () => SahteTanima.hepsi[SahteTanima.hepsi.length - 1]!

  beforeEach(() => {
    cihaz.deger = false
    SahteTanima.hepsi = []
    SahteTanima.startHatasi = null
    SahteTanima.sonSonuc = null
    SahteTanima.bitisMs = 10
    vi.stubGlobal('window', { webkitSpeechRecognition: SahteTanima, isSecureContext: true })
    vi.stubGlobal('navigator', { userAgent: 'Chrome', onLine: true })
  })

  it('onBasladi tarayıcının onstart olayıyla gelir', async () => {
    const onBasladi = vi.fn()
    modul.dinle({ onKismi: () => {}, onBasladi })
    await gec(10)
    expect(onBasladi).not.toHaveBeenCalled()
    son().onstart?.()
    expect(onBasladi).toHaveBeenCalledTimes(1)
  })

  it.each(['no-speech', 'aborted'])('%s oturumu kapatmaz', async (kod) => {
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(5_000)
    son().hata(kod)
    await gec(1_000)
    expect(d.bitti).toBe(false)
    expect(SahteTanima.hepsi.length).toBe(2)
    son().sonuc({ m: '20 matematik', kesin: true })
    o.durdur()
    await gec(100)
    expect(d.metin).toBe('20 matematik')
  })

  it('sürekli aborted sınırlı denenir', async () => {
    const d = izle(modul.dinle({ onKismi: () => {} }).bitti)
    for (let i = 0; i < 20 && !d.bitti; i++) {
      await gec(50)
      son().hata('aborted')
      await gec(2_000)
    }
    expect(d.kod).toBe('mesgul')
    expect(SahteTanima.hepsi.length).toBe(4)
  })

  it.each([
    ['not-allowed', 'izin'],
    ['service-not-allowed', 'servis-yok'],
    ['network', 'ag'],
    ['audio-capture', 'mikrofon-yok'],
    ['language-not-supported', 'dil'],
  ])('%s → %s', async (kod, beklenen) => {
    const d = izle(modul.dinle({ onKismi: () => {} }).bitti)
    await gec(10)
    son().hata(kod)
    await gec(100)
    expect(d.kod).toBe(beklenen)
  })

  it('onend sonrası yeniden başlar, parçaları birleştirir', async () => {
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(2_000)
    son().sonuc({ m: '20 matematik', kesin: true }, { m: ' 30 fizik' })
    son().onend?.()
    await gec(500)
    son().sonuc({ m: '10 kimya', kesin: true })
    o.durdur()
    await gec(100)
    expect(d.metin).toBe('20 matematik 30 fizik 10 kimya')
  })

  it('aynı söz iki ayrı kesin sonuçta gelirse masaüstünde ikisi de korunur', async () => {
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(10)
    son().sonuc({ m: '20 matematik', kesin: true }, { m: '20 matematik', kesin: true })
    o.durdur()
    await gec(100)
    expect(d.metin).toBe('20 matematik 20 matematik')
  })

  it('Android Chrome kümülatif kesin sonuçları çiftlemez', async () => {
    vi.stubGlobal('navigator', { userAgent: 'Linux; Android 14 Chrome', onLine: true })
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(10)
    son().sonuc(
      { m: '20', kesin: true, guven: 0 },
      { m: '20 matematik', kesin: true, guven: 0 },
      { m: '20 matematik', kesin: true, guven: 0.9 },
    )
    o.durdur()
    await gec(100)
    expect(d.metin).toBe('20 matematik')
  })

  it('boş kesin sonuç ara metni silmez', async () => {
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(10)
    son().sonuc({ m: '20 matematik' })
    son().sonuc({ m: '', kesin: true })
    o.durdur()
    await gec(100)
    expect(d.metin).toBe('20 matematik')
  })

  it('Bitirden sonra gelen son sonucu bekler', async () => {
    SahteTanima.bitisMs = 2_500
    SahteTanima.sonSonuc = [{ m: 'matematik 45', kesin: true }]
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(10)
    son().sonuc({ m: 'matematik' })
    o.durdur()
    await gec(2_600)
    expect(d.metin).toBe('matematik 45')
  })

  it('Bitirden sonra onend gelmezse 3 saniyede eldeki metinle biter', async () => {
    SahteTanima.bitisMs = null
    const o = modul.dinle({ onKismi: () => {} })
    const d = izle(o.bitti)
    await gec(10)
    son().sonuc({ m: 'fizik 10' })
    o.durdur()
    await gec(3_100)
    expect(d.metin).toBe('fizik 10')
  })

  it('yeni oturum eskisini asılı bırakmadan kapatır', async () => {
    const d1 = izle(modul.dinle({ onKismi: () => {} }).bitti)
    await gec(10)
    const d2 = izle(modul.dinle({ onKismi: () => {} }).bitti)
    await gec(1_000)
    expect(d1.bitti).toBe(true)
    expect(d2.bitti).toBe(false)
    expect(SahteTanima.hepsi.length).toBe(2)
  })

  it('start atarsa sınırlı dener, sonra baslatilamadi der', async () => {
    SahteTanima.startHatasi = new Error('InvalidStateError')
    const d = izle(modul.dinle({ onKismi: () => {} }).bitti)
    await gec(10_000)
    expect(d.kod).toBe('baslatilamadi')
  })

  it('hızlı boş onend döngüsü sınırlıdır', async () => {
    const d = izle(modul.dinle({ onKismi: () => {} }).bitti)
    for (let i = 0; i < 40 && !d.bitti; i++) {
      son().onend?.()
      await gec(500)
    }
    expect(d.kod).toBe('sessizlik')
    expect(SahteTanima.hepsi.length).toBeLessThanOrEqual(8)
  })

  it('güvensiz adreste (LAN IP) ve servissiz tarayıcıda durum ayrılır', async () => {
    vi.stubGlobal('window', { webkitSpeechRecognition: SahteTanima, isSecureContext: false })
    expect(await modul.sesTanimaDurumu()).toBe('guvensiz-adres')
    vi.stubGlobal('window', { isSecureContext: true })
    expect(await modul.sesTanimaDurumu()).toBe('yok')
  })
})
