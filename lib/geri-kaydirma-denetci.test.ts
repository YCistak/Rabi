import { describe, expect, it } from 'vitest'
import { GeriKaydirmaDenetcisi, type Kutu, type Ortam } from './geri-kaydirma-denetci'

/**
 * Sahte ortam: zaman elle ilerliyor, kutu düz bir nesne, `geriGit` ekranı
 * "değiştirince" kutuyu DOM'dan söküyor (gerçekte React anahtarı değişiyor).
 */
function kur(ayar: Partial<Ortam> & { ekranDegisir?: boolean; geriSonuc?: boolean } = {}) {
  let simdi = 0
  const isler: Array<{ zaman: number; is: () => void; kimlik: number }> = []
  let kimlik = 0
  const kayit = { geri: 0, cikis: 0, yon: 0, yonSil: 0, sabitGizle: 0, sabitGetir: 0 }
  const kutu: Kutu & { bagli: boolean } = {
    bagli: true,
    get isConnected() {
      return this.bagli
    },
    style: { transform: '', transition: '', boxShadow: '', willChange: '', animationName: '' },
  }
  const ortam: Ortam = {
    kutuBul: () => kutu,
    kaydirilabilir: () => true,
    kilitli: () => false,
    kilitBirakmayiYutar: true,
    geriGit: () => {
      kayit.geri++
      if (ayar.ekranDegisir !== false) kutu.bagli = false
      return ayar.geriSonuc ?? true
    },
    cikis: () => kayit.cikis++,
    yonIsaretle: () => kayit.yon++,
    yonuTemizle: () => kayit.yonSil++,
    anlikKonum: () => 40,
    sabitleriGizle: () => {
      kayit.sabitGizle++
      return () => kayit.sabitGetir++
    },
    genislik: () => 390,
    olcek: () => 1,
    azaltilmis: () => false,
    simdi: () => simdi,
    zamanla: (is, ms) => {
      isler.push({ zaman: simdi + ms, is, kimlik: ++kimlik })
      return kimlik
    },
    zamanlamaIptal: (k) => {
      const i = isler.findIndex((x) => x.kimlik === k)
      if (i !== -1) isler.splice(i, 1)
    },
    ...ayar,
  }
  const d = new GeriKaydirmaDenetcisi(ortam)
  const ilerlet = (ms: number) => {
    simdi += ms
    for (;;) {
      isler.sort((a, b) => a.zaman - b.zaman)
      const sira = isler[0]
      if (!sira || sira.zaman > simdi) break
      isler.shift()
      sira.is()
    }
  }
  /** Parmak: her karede (16 ms) `adim` px. */
  const surukle = (kare: number, adim: number, bas = 0) => {
    for (let i = 1; i <= kare; i++) {
      ilerlet(16)
      d.ilerle(bas + i * adim)
    }
  }
  const tx = () => {
    const m = /translateX\((-?[\d.]+)px\)/.exec(kutu.style.transform)
    return m ? +m[1] : 0
  }
  return { d, kutu, kayit, ilerlet, surukle, tx }
}

describe('GeriKaydirmaDenetcisi', () => {
  it('sürüklerken kutu parmağı izler, giriş animasyonu kapanır', () => {
    const { d, kutu, surukle, tx } = kur()
    d.basla()
    expect(d.durum).toBe('surukleniyor')
    expect(kutu.style.animationName).toBe('none')
    surukle(10, 12)
    expect(tx()).toBe(120)
  })

  it('negatif dx kutuyu sola itmez', () => {
    const { d, tx } = kur()
    d.basla()
    d.ilerle(-30)
    expect(tx()).toBe(0)
  })

  it('bitir: kutu sağa çıkar, çıkış bitince yön işaretlenip tek kez geri gidilir', () => {
    const { d, kutu, kayit, surukle, ilerlet } = kur()
    d.basla()
    surukle(10, 15)
    d.bitir()
    expect(d.durum).toBe('cikiyor')
    expect(kutu.style.transform).toBe('translateX(390px)')
    expect(kayit.geri).toBe(0)
    ilerlet(400)
    expect(kayit.geri).toBe(1)
    expect(kayit.yon).toBe(1)
    expect(d.durum).toBe('bos')
    expect(kayit.sabitGetir).toBe(1)
  })

  it('hızlı fırlatma, yavaş bırakmadan kısa sürede çıkar', () => {
    const sure = (adim: number, kare: number) => {
      const { d, kayit, surukle, ilerlet } = kur()
      d.basla()
      surukle(kare, adim)
      d.bitir()
      let gecen = 0
      while (kayit.geri === 0 && gecen < 1000) {
        ilerlet(1)
        gecen++
      }
      return gecen
    }
    expect(sure(30, 5)).toBeLessThan(sure(3, 50))
  })

  it('sola fırlatıp bırakınca (yerli taraf "geri" dese de) yerine döner', () => {
    const { d, kayit, surukle, ilerlet, tx } = kur()
    d.basla()
    surukle(10, 20) // 200 px
    surukle(4, -20, 200) // hızla sola
    d.bitir()
    expect(d.durum).toBe('yaylaniyor')
    expect(tx()).toBe(0)
    ilerlet(400)
    expect(kayit.geri).toBe(0)
    expect(d.durum).toBe('bos')
  })

  it('iptal: yerine yaylanır, geri gidilmez', () => {
    const { d, kutu, kayit, surukle, ilerlet } = kur()
    d.basla()
    surukle(5, 10)
    d.iptal()
    expect(d.durum).toBe('yaylaniyor')
    expect(kutu.style.transform).toBe('translateX(0px)')
    ilerlet(400)
    expect(d.durum).toBe('bos')
    expect(kutu.style.transform).toBe('')
    expect(kayit.geri).toBe(0)
  })

  it('yaylanırken yeni hareket kutuyu olduğu yerden yakalar (sıçrama yok)', () => {
    const { d, surukle, ilerlet, tx } = kur() // anlikKonum 40 döndürüyor
    d.basla()
    surukle(5, 20)
    d.iptal()
    ilerlet(50)
    d.basla()
    expect(d.durum).toBe('surukleniyor')
    expect(tx()).toBe(40)
    d.ilerle(10)
    expect(tx()).toBe(50)
  })

  it('katman açıkken (kaydırılamaz) sayfa kaymaz, bırakınca doğrudan geri tuşu çalışır', () => {
    const { d, kutu, kayit } = kur({ kaydirilabilir: () => false })
    d.basla()
    d.ilerle(150)
    expect(kutu.style.transform).toBe('')
    expect(d.durum).toBe('bos')
    d.bitir()
    expect(kayit.geri).toBe(1)
    expect(kayit.yon).toBe(0) // ekran değişmiyor, soldan giriş yok
  })

  it('kaydırılamazken iptal hiçbir şey yapmaz', () => {
    const { d, kayit } = kur({ kaydirilabilir: () => false })
    d.basla()
    d.iptal()
    expect(kayit.geri).toBe(0)
  })

  it('gidecek yer yoksa (Android kökü) çıkış çağrılır', () => {
    const { d, kayit } = kur({ kaydirilabilir: () => false, geriSonuc: false })
    d.basla()
    d.bitir()
    expect(kayit.cikis).toBe(1)
  })

  it('iOS kilidi (çizim): sayfa kaymaz, bırakma yutulur', () => {
    const { d, kutu, kayit } = kur({ kilitli: () => true })
    d.basla()
    d.ilerle(100)
    d.bitir()
    expect(kutu.style.transform).toBe('')
    expect(kayit.geri).toBe(0)
  })

  it('kilit hareket sürerken kalksa da o hareketin bırakması yutulur', () => {
    let kilit = true
    const { d, kayit } = kur({ kilitli: () => kilit })
    d.basla()
    kilit = false
    d.bitir()
    expect(kayit.geri).toBe(0)
    // Sonraki hareket normal.
    d.basla()
    expect(d.durum).toBe('surukleniyor')
  })

  it('Android kilidi: sürükleme yok ama geri hareketi geri tuşu gibi çalışır', () => {
    const { d, kayit } = kur({ kilitli: () => true, kilitBirakmayiYutar: false })
    d.basla()
    expect(d.durum).toBe('bos')
    d.bitir()
    expect(kayit.geri).toBe(1)
  })

  it('ekran değişmezse (geri başka bir şeyi kapattı) kutu dışarıda kalmaz, yerine kayar', () => {
    const { d, kayit, surukle, ilerlet, tx } = kur({ ekranDegisir: false })
    d.basla()
    surukle(10, 15)
    d.bitir()
    ilerlet(400)
    expect(kayit.geri).toBe(1)
    expect(kayit.yonSil).toBe(1)
    expect(d.durum).toBe('yaylaniyor')
    expect(tx()).toBe(0)
    ilerlet(400)
    expect(d.durum).toBe('bos')
  })

  it('çıkış sürerken gelen ikinci geri kaybolmaz, çıkıştan sonra işlenir', () => {
    const { d, kayit, surukle, ilerlet } = kur()
    d.basla()
    surukle(10, 15)
    d.bitir()
    d.basla() // çıkış sürerken: yok sayılır
    d.bitir()
    expect(kayit.geri).toBe(0)
    ilerlet(400)
    expect(kayit.geri).toBe(2)
  })

  it('azaltılmış harekette çıkış beklemeden geri gider', () => {
    const { d, kayit, surukle } = kur({ azaltilmis: () => true })
    d.basla()
    surukle(5, 20)
    d.bitir()
    expect(kayit.geri).toBe(1)
    expect(d.durum).toBe('bos')
  })

  it('sökülünce zamanlayıcı ve stiller temizlenir', () => {
    const { d, kutu, kayit, surukle, ilerlet } = kur()
    d.basla()
    surukle(5, 20)
    d.bitir()
    d.birak()
    ilerlet(1000)
    expect(kayit.geri).toBe(0)
    expect(kutu.style.transform).toBe('')
  })
})
