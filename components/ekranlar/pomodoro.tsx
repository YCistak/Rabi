'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { KeepAwake } from '@capacitor-community/keep-awake'
import { Capacitor } from '@capacitor/core'
import {
  ChevronLeft,
  Clock,
  Pause,
  Play,
  ShieldCheck,
  SkipForward,
  Sun,
  X,
} from 'lucide-react'
import type { PomodoroAyar, PomodoroSeans } from '@/lib/types'
import {
  ASAMA_ADI,
  asamaSuresi,
  kalanSaniye,
  sonrakiAsama,
  sureYaz,
  type Asama,
} from '@/lib/pomodoro'
import { SesCalar } from '@/lib/ses'
import { calismaSirasi } from '@/lib/dersler'
import { DersSeridi, SecimKutusu } from '@/components/ders-seridi'
import {
  OZEL_PROVA_SINIRI,
  PROVALAR,
  PROVA_DERSI,
  ozelProva,
  type Prova,
} from '@/lib/sinav-provasi'
import { izinIste, pomodoroIptal, pomodoroPlanla } from '@/lib/bildirim'
import {
  odakKilidiDesteklenir,
  odakKilidiKapatilinca,
  odakKorumasiVar,
  odakKilidiniBaslat,
  odakKilidiniBitir,
  odakKilidiniDuraklat,
  pomodoroKomutuGelince,
  type PomodoroKomutu,
} from '@/lib/odak-kilidi'
import { useGeriKatmani } from '@/lib/geri'
import { useAsagiKaydirKapat } from '@/lib/asagi-kaydir'
import { OdakKurulum } from '@/components/ekranlar/odak-kurulum'
import { OdakAyarlari } from '@/components/odak/odak-ayarlari'
import { IosOdakAyarlari } from '@/components/odak/ios-odak-ayarlari'
import { iosMu } from '@/lib/platform'
import { cn, yeniId } from '@/lib/utils'
import { Anahtar, BaslikSatiri, Buton, Kart, Not, Onay } from '@/components/ui'

export function PomodoroEkrani({
  ayar,
  setAyar,
  onSeansBitti,
  seanslar,
  demoVeri = false,
  gorunur = true,
  onDurum,
  onArkaPlan,
}: {
  ayar: PomodoroAyar
  /** Geçmiş seanslar — ders şeridi en çok çalışılanları başa alıyor. */
  seanslar: readonly PomodoroSeans[]
  setAyar: (guncelleyici: PomodoroAyar | ((onceki: PomodoroAyar) => PomodoroAyar)) => void
  onSeansBitti: (seans: PomodoroSeans) => void
  demoVeri?: boolean
  /**
   * Ekran açık mı. Tur başlayınca bileşen ekrandan çıkılsa da sökülmüyor
   * (`AppShell` → "Pomodoro ekrandan çıkınca sürüyor"), yalnızca gizleniyor;
   * gizliyken sahne çizilmiyor — açık bir sahne geri katmanı kurar ve
   * başka ekranda geri tuşunu yutardı.
   */
  gorunur?: boolean
  /** Sağ alttaki saat bunu çiziyor (`PomodoroSaati`). */
  onDurum?: (durum: PomodoroDurumu) => void
  /**
   * Sahnenin geri oku sayaç işlerken turu **duraklatmıyor**: ekrandan
   * çıkılıyor, tur sürüyor. Verilmezse eski davranış (duraklat).
   */
  onArkaPlan?: () => void
}) {
  const [asama, setAsama] = useState<Asama>('calisma')
  const [tur, setTur] = useState(1)
  /**
   * Seçili sınav provası — seçiliyken sayaç pomodoro değil kitapçık sayıyor.
   *
   * Aşamadan ayrı bir state: prova bir "uzun çalışma turu" değil, mola
   * döngüsünün tümüyle dışında bir kip. `Asama`ya dördüncü bir değer olarak
   * eklenseydi `sonrakiAsama` her prova sonunda mola vermek zorunda kalırdı.
   */
  const [prova, setProva] = useState<Prova | null>(null)
  /** Biten prova — bir sonraki başlatmaya kadar ekranda duruyor. */
  const [bitenProva, setBitenProva] = useState<Prova | null>(null)
  const [ders, setDers] = useState<string | null>(null)
  const [bitisZamani, setBitisZamani] = useState<number | null>(null)
  const [kalan, setKalan] = useState(ayar.calisma * 60)
  /**
   * Bu aşama hiç başlatılmadı mı. Süre ayarı değiştiğinde sayacın yeni süreye
   * atlaması gerekiyor — ama yalnızca dokunulmamış aşamada: duraklatılmış bir
   * sayaç sıfırdan başlatılırsa kullanıcı çalıştığı süreyi kaybeder.
   */
  const [dokunulmadi, setDokunulmadi] = useState(true)
  /**
   * Çalışma sahnesi açık mı — Başlat'a basınca sayaç tam ekran bir katmana
   * çıkıyor: alt menü ve ayarlar kayboluyor, ekranda tek iş sayaç kalıyor.
   *
   * `calisiyor`dan ayrı bir state: sahne duraklatınca kapanmıyor (duraklatılmış
   * tur hâlâ o turdur) ve aşama bitince de açık kalıyor — mola, sahnedeki
   * Başlat ile başlıyor. Kapatan üç şey var: üst köşedeki geri (duraklatıp
   * hazırlığa döner), turu bitir ve provadan çıkış.
   */
  const [sahne, setSahne] = useState(false)
  const [sureCekmecesi, setSureCekmecesi] = useState(false)
  /**
   * Odak kilidi tanıtımı pomodoroya ilk girişte bir kez çıkıyor. Tarayıcıda
   * özellik hiç yok; orada tanıtım da gösterilmiyor.
   */
  const [kurulumAcik, setKurulumAcik] = useState(false)
  /** Koruma paneli açık mı — kapalı başlıyor, sayaç ekranın asıl işi. */
  const [korumaPaneli, setKorumaPaneli] = useState(false)
  useEffect(() => {
    if (!demoVeri && odakKilidiDesteklenir() && !ayar.kilitTanitimiGoruldu) setKurulumAcik(true)
  }, [ayar.kilitTanitimiGoruldu, demoVeri])

  /**
   * Kilit kırıldı mı — bir sonraki başlatmaya kadar ekranda duruyor.
   *
   * Tur sessizce başa sarsaydı kullanıcı sayacın neden sıfırlandığını
   * anlamazdı; uyarının tek işi kesilen turu görünür kılmak.
   */
  const [kirilanKilit, setKirilanKilit] = useState(false)

  const calarRef = useRef<SesCalar | null>(null)
  const baslangicRef = useRef<string | null>(null)

  // Provada süre ÖSYM'nin, ayarların değil.
  const toplamDakika = prova ? prova.dakika : asamaSuresi(asama, ayar)
  const calisiyor = bitisZamani !== null
  /**
   * Tur başladı mı — duraklatılmış olsa da. Süreler, prova ve kip bu sırada
   * kilitli: başlamış bir turun uzunluğu değişmemeli.
   */
  const turIcinde = !dokunulmadi

  const calarAl = useCallback(() => {
    if (!calarRef.current) calarRef.current = new SesCalar()
    return calarRef.current
  }, [])

  // Bileşen sökülürken ses ve ekran kilidi bırakılmalı, yoksa arka planda kalır.
  useEffect(() => {
    if (demoVeri) return
    return () => {
      calarRef.current?.kapat()
      calarRef.current = null
      if (Capacitor.isNativePlatform()) void KeepAwake.allowSleep().catch(() => {})
      void pomodoroIptal()
      void odakKilidiniBitir()
    }
  }, [demoVeri])

  const asamayiBitir = useCallback(() => {
    const calar = calarAl()
    calar.durdur()
    calar.zilCal()
    void pomodoroIptal()
    void odakKilidiniBitir()

    if (prova) {
      /*
        Prova biten tek parça bir sınav: arkasından mola gelmiyor ve tur
        sayacı ilerlemiyor. Sayaç doğrudan sıradan çalışma turuna dönüyor,
        yoksa kullanıcı bir sonraki "Başlat"ta yeniden 165 dakika alırdı.
        Sahne de kapanıyor: "prova bitti" notu hazırlık ekranında.
      */
      onSeansBitti({
        id: yeniId(),
        baslangic: baslangicRef.current ?? new Date().toISOString(),
        dakika: prova.dakika,
        ders: PROVA_DERSI,
      })
      setBitenProva(prova)
      setProva(null)
      setAsama('calisma')
      setKalan(ayar.calisma * 60)
      setSahne(false)
    } else if (asama === 'calisma') {
      onSeansBitti({
        id: yeniId(),
        baslangic: baslangicRef.current ?? new Date().toISOString(),
        dakika: ayar.calisma,
        ders: ders ?? undefined,
      })
      const yeniAsama = sonrakiAsama('calisma', tur, ayar)
      setAsama(yeniAsama)
      setKalan(asamaSuresi(yeniAsama, ayar) * 60)
    } else {
      setTur((t) => t + 1)
      setAsama('calisma')
      setKalan(ayar.calisma * 60)
    }

    setBitisZamani(null)
    setDokunulmadi(true)
    baslangicRef.current = null
  }, [asama, ayar, calarAl, ders, onSeansBitti, prova, tur])

  // Ayarlardan süre değiştirildiğinde ekrandaki sayaç da değişmeli. Bu olmadan
  // "60 dakika" seçilip Başlat'a basılınca sayaç eski süreyle çalışıyordu.
  useEffect(() => {
    if (calisiyor || !dokunulmadi) return
    setKalan(toplamDakika * 60)
  }, [toplamDakika, calisiyor, dokunulmadi])

  // Sayaç: hedef zaman damgasından okunuyor, saniye saymıyor.
  useEffect(() => {
    if (bitisZamani === null) return

    /*
      Aşama bu kapanışta yalnızca **bir kez** bitiyor. Uygulama arka plandan
      döndüğünde görünürlük olayı ile kısılmış zamanlayıcının gecikmiş tiki
      arka arkaya geliyor ve ikisi de React yeniden çizmeden önce koşabiliyor:
      ikisi de sıfırı görüp `asamayiBitir`i çağırıyor, aynı seans iki kez
      yazılıyor, molada tur sayacı iki artıyordu.
    */
    let bitti = false
    const guncelle = () => {
      if (bitti) return
      const yeni = kalanSaniye(bitisZamani)
      setKalan(yeni)
      if (yeni <= 0) {
        bitti = true
        asamayiBitir()
      }
    }

    guncelle()
    const zamanlayici = window.setInterval(guncelle, 500)

    // Uygulama arka plandan dönünce sayaç anında doğru değere sıçrasın.
    const gorunurluk = () => document.visibilityState === 'visible' && guncelle()
    document.addEventListener('visibilitychange', gorunurluk)

    return () => {
      window.clearInterval(zamanlayici)
      document.removeEventListener('visibilitychange', gorunurluk)
    }
  }, [bitisZamani, asamayiBitir])

  const baslat = () => {
    if (demoVeri) return
    setKirilanKilit(false)
    setBitenProva(null)
    setSahne(true)
    const bitis = Date.now() + kalan * 1000
    setBitisZamani(bitis)
    setDokunulmadi(false)
    // Duraklatılmış turu sürdürmek de buradan geçiyor; seansın başlangıcı
    // turun ilk başlatıldığı an kalmalı, "Devam et"e basılan an değil.
    if (baslangicRef.current === null) baslangicRef.current = new Date().toISOString()

    calarAl().sesSeviyesi(ayar.sesSeviyesi)

    /*
      İzin turu başlatırken isteniyor, ayarlarda değil.

      Android 13'ten beri POST_NOTIFICATIONS olmadan ön plan servisinin
      bildirimi de gösterilmiyor — yani izin verilmemişse kilit ekranındaki
      sayaç sessizce hiç görünmüyor ve kullanıcı özelliğin bozuk olduğunu
      sanıyor. Ayarlardaki bildirim anahtarına bağlanamazdı: o anahtar "seans
      bitince haber ver" demek, buradaki bildirim ise sayacın kendisi ve
      anahtar kapalıyken de gerekiyor.

      Daha önce kalıcı olarak reddedilmişse sistem penceresi hiç açılmıyor,
      `izinIste` sessizce false dönüyor ve tur normal başlıyor.
    */
    void izinIste()
    void pomodoroPlanla(bitis, asama !== 'calisma')
    /*
      Yerli servis her turda kuruluyor — molada da. Asıl işi kilit ekranındaki
      sayaç ve mola da bir sayaç: "kaç dakika sonra masaya dönüyorum" sorusunun
      cevabı orada. Eskiden servis yalnızca kilit ya da Rahatsız Etme açıkken
      kurulurdu ve ikisini de açmamış kullanıcı — yani çoğunluk — sayacı
      telefonu kilitlediği anda kaybediyordu.

      Koruma yine yalnızca çalışma turunda: molada engellenecek uygulama
      listesi boş gidiyor ve susturma istenmiyor, servis yalnızca sayacı
      çiziyor. İzin yoksa yerli taraf sessizce geçiyor, sayaç çalışmaya devam
      ediyor.
    */
    const korumaliTur = asama === 'calisma'
    const kilitIstendi = korumaliTur && ayar.odakKilidi
    void odakKilidiniBaslat(
      kilitIstendi ? ayar.kilitliUygulamalar : [],
      bitis,
      // Engel katmanındaki çip provada dersin değil sınavın adını yazıyor:
      // ekranda "MATEMATİK" görünürken çözülen şey TYT kitapçığı oluyordu.
      prova ? `${prova.ad} PROVASI`.toLocaleUpperCase('tr-TR') : (ders ?? undefined),
      korumaliTur && ayar.rahatsizEtme,
      prova ? 'Deneme provası' : ASAMA_ADI[asama],
      // iOS'ta seçim yerli tarafta durduğu için paket listesi boş; kilidin
      // istenip istenmediği ayrıca söyleniyor.
      kilitIstendi,
    )
    if (ayar.ekraniAcikTut && Capacitor.isNativePlatform()) {
      void KeepAwake.keepAwake().catch(() => {})
    }
  }

  /**
   * Sayacı durdurur ama turu bitirmez.
   *
   * Yerli servis ayakta bırakılıyor, yalnızca donduruluyor: bildirim ekrandan
   * kalksaydı duraklatılmış tur kilit ekranında hiç var olmamış gibi
   * görünürdü ve kullanıcı devam etmek için uygulamayı açmak zorunda kalırdı —
   * tam da açılmaması gereken şey.
   */
  const duraklat = () => {
    setBitisZamani(null)
    calarRef.current?.durdur()
    void pomodoroIptal()
    void odakKilidiniDuraklat()
    if (Capacitor.isNativePlatform()) void KeepAwake.allowSleep().catch(() => {})
  }

  /**
   * Sahnenin geri oku: tur bitmiyor, duraklıyor. Hazırlık ekranı kalan
   * süreyi ve "Devam et" düğmesini gösteriyor; oradan basınca sahne aynı
   * yerden açılıyor.
   */
  const sahnedenCik = () => {
    setSahne(false)
    if (calisiyor && onArkaPlan) {
      onArkaPlan()
      return
    }
    if (calisiyor) duraklat()
  }

  /*
    Tur sürerken ekrana dönülünce (sağ alttaki saat, Araçlar'daki kutucuk)
    doğrudan sahne açılıyor: işleyen bir sayacın hazırlık ekranı, "Başlat"
    yazan bir düğmeyle yanlış bir şey söylerdi.
  */
  useEffect(() => {
    if (gorunur && calisiyor) setSahne(true)
    // Yalnızca görünürlük değişince; sayaç her tikte buraya uğramasın.
  }, [gorunur])

  /*
    Saat için durum. Kalan süre işlerken gönderilmiyor — saat onu bitiş
    zamanından kendisi sayıyor; her tikte AppShell'i yeniden çizmek bütün
    uygulamayı saniyede iki kez çizmek olurdu.
  */
  const canli = !(dokunulmadi && tur === 1 && asama === 'calisma')
  const molaDurumu = asama !== 'calisma'
  const donukKalan = calisiyor ? null : kalan
  const toplamSaniyeDurum = toplamDakika * 60
  useEffect(() => {
    onDurum?.({ canli, bitisZamani, donukKalan, mola: molaDurumu, toplamSaniye: toplamSaniyeDurum })
  }, [canli, bitisZamani, donukKalan, molaDurumu, toplamSaniyeDurum])

  /** Turdan çıkılıyor: duraklamanın aksine bildirim de kalkıyor. */
  const turuBirak = () => {
    duraklat()
    void odakKilidiniBitir()
  }

  const sifirla = () => {
    turuBirak()
    setKalan(toplamDakika * 60)
    setDokunulmadi(true)
    baslangicRef.current = null
    setSahne(false)
  }

  const atla = () => {
    turuBirak()
    baslangicRef.current = null
    /*
      Provada atlamak provadan çıkmak demek: yarıda bırakılan kitapçık seans
      olarak sayılmıyor (sayaç dolmadı) ve sayaç sıradan çalışma turuna döner.
    */
    if (prova) {
      setProva(null)
      setAsama('calisma')
      setKalan(ayar.calisma * 60)
      setDokunulmadi(true)
      setSahne(false)
      return
    }
    // Atlanan çalışma turu seans olarak sayılmaz — sayacı doldurmadan geçildi.
    const yeniAsama =
      asama === 'calisma' ? sonrakiAsama('calisma', tur, ayar) : ('calisma' as Asama)
    if (asama !== 'calisma') setTur((t) => t + 1)
    setAsama(yeniAsama)
    setKalan(asamaSuresi(yeniAsama, ayar) * 60)
    setDokunulmadi(true)
  }

  /**
   * Engel katmanındaki "kilidi kapat" turu baştan başlatıyor. Kilit
   * kırılabilir olmak zorunda — kırılamasaydı telefonun sahibi kendi
   * telefonunda mahsur kalırdı — ama kırmanın karşılığı turu kaybetmek.
   *
   * Geri çağrı ref üzerinden okunuyor: dinleyici bir kez kuruluyor ama
   * iptalin güncel aşamayı görmesi gerekiyor.
   */
  const kilidiKir = () => {
    setKirilanKilit(true)
    sifirla()
  }
  const iptalRef = useRef<() => void>(() => {})
  useEffect(() => {
    iptalRef.current = kilidiKir
  })
  useEffect(() => {
    let birak: () => void = () => {}
    if (demoVeri) return
    void odakKilidiKapatilinca(() => iptalRef.current()).then((kaldir) => {
      birak = kaldir
    })
    return () => birak()
  }, [demoVeri])

  /**
   * Kilit ekranındaki bildirimin düğmeleri.
   *
   * Sayacın iki kopyası var — biri yerli serviste, biri burada — ve düğme
   * yalnızca ilkine dokunuyor. Bu ekran haber almazsa uygulamaya dönen
   * kullanıcı, bildirimden duraklattığı turu hâlâ işlerken buluyor.
   *
   * Yerli tarafta olan bitiş yeniden yapılmıyor: "duraklat" orada zaten
   * dondu, burada yalnızca sayaç ve ses susuyor. `devam`da bitiş zamanı
   * karşıdan geliyor, burada yeniden hesaplanmıyor — iki taraf ayrı ayrı
   * hesaplasaydı köprünün gecikmesi kadar ayrı düşerlerdi.
   */
  const bildirimKomutu = (veri: PomodoroKomutu) => {
    if (veri.komut === 'duraklat') {
      setBitisZamani(null)
      calarRef.current?.durdur()
      void pomodoroIptal()
      if (Capacitor.isNativePlatform()) void KeepAwake.allowSleep().catch(() => {})
      return
    }
    if (veri.komut === 'devam') {
      setBitisZamani(veri.bitisZamani)
      setDokunulmadi(false)
      calarAl().sesSeviyesi(ayar.sesSeviyesi)
      void pomodoroPlanla(veri.bitisZamani, asama !== 'calisma')
      if (ayar.ekraniAcikTut && Capacitor.isNativePlatform()) {
        void KeepAwake.keepAwake().catch(() => {})
      }
      return
    }
    // "Turu bitir": servis kendini çoktan durdurdu, burada sayaç başa dönüyor.
    // Atlanan turda olduğu gibi seans yazılmıyor — sayaç dolmadı.
    sifirla()
  }
  const komutRef = useRef<(veri: PomodoroKomutu) => void>(() => {})
  useEffect(() => {
    komutRef.current = bildirimKomutu
  })
  useEffect(() => {
    let birak: () => void = () => {}
    if (demoVeri) return
    void pomodoroKomutuGelince((veri) => komutRef.current(veri)).then((kaldir) => {
      birak = kaldir
    })
    return () => birak()
  }, [demoVeri])

  /**
   * Prova seçimi; `null` pomodoro kipine dönüş.
   *
   * Tur içinde seçim yok: süresi değişen bir sayaç, başladığı sınavdan başka
   * bir sınavı ölçer.
   */
  const provayiAyarla = (yeni: Prova | null) => {
    if (turIcinde) return
    setProva(yeni)
    setBitenProva(null)
    setAsama('calisma')
    setKalan((yeni ? yeni.dakika : ayar.calisma) * 60)
    setDokunulmadi(true)
    baslangicRef.current = null
  }

  /**
   * "Süre gir"e yazılan süre: ayarda hatırlanıyor ve seçili provaysa sayaç
   * da ona geçiyor. Tur içinde kutu zaten kilitli.
   */
  const ozelSureyiAyarla = (dakika: number) => {
    if (turIcinde) return
    setAyar((o) => ({ ...o, provaSuresi: dakika }))
    if (prova?.id === 'ozel') provayiAyarla(ozelProva(dakika))
  }

  /*
    Satırın altındaki özet: paneli açmadan hangi korumanın açık olduğu
    okunabilmeli, yoksa kapalı bir satır ayarı görünmez kılardı.
  */
  // iOS'ta Rahatsız Etme anahtarı yok: kilit bildirimleri de susturuyor.
  const korumaVar = ayar.odakKilidi || (!iosMu() && ayar.rahatsizEtme)
  const korumaOzeti = iosMu()
    ? ayar.odakKilidi
      ? 'Kilit açık'
      : 'Kilit kapalı'
    : !korumaVar
      ? 'Kilit ve rahatsız etme kapalı'
      : [ayar.odakKilidi && 'Kilit açık', ayar.rahatsizEtme && 'Rahatsız etme açık']
          .filter(Boolean)
          .join(' · ')

  // Halka kalan süreden çiziliyor: duraklatılmış turda da doluluğu koruyor.
  const toplamSaniye = toplamDakika * 60
  const oran = toplamSaniye > 0 ? Math.min(1, Math.max(0, 1 - kalan / toplamSaniye)) : 0
  const molaMi = asama !== 'calisma'
  const durumEtiketi = prova ? 'Deneme provası' : `${tur}. tur · ${ASAMA_ADI[asama]}`

  /*
    Sayacın altındaki satır sıradaki şeyi söylüyor: çalışırken "sonra 5 dk
    mola", molada "sonra 25 dk çalışma", provada kitapçığın kendisi.
  */
  const siradaki = prova
    ? prova.id === 'ozel'
      ? 'kendi süren'
      : prova.ad
    : molaMi
      ? `sonra ${ayar.calisma} dk çalışma`
      : `sonra ${asamaSuresi(sonrakiAsama('calisma', tur, ayar), ayar)} dk mola`

  /*
    Hazırlıktaki ders şeridi: en çok çalışılan üç ders başta, kalanı yana
    kayarak (`calismaSirasi`). Bir süre dört kutuluk bir ızgaraydı — ilk üç
    ders ve "Diğer" — ve listenin geri kalanı alttan açılan bir çekmecedeydi;
    kullanıcı çekmeceyi istemedi: ders seçmek için yeni bir ekran açılmamalı.
    Sıra tur boyunca sabit kalsın diye ekran açılınca bir kez kuruluyor;
    seans bitince yeniden sıralansaydı seçili ders parmağın altından kayardı.
  */
  const [gorunenDersler] = useState(() => calismaSirasi(seanslar))

  const sureOzeti = `${ayar.calisma} dk · mola ${ayar.kisaMola} / ${ayar.uzunMola} · ${ayar.turSayisi} turda bir`

  if (kurulumAcik) {
    return (
      <div>
        <BaslikSatiri arac="pomodoro" baslik="Pomodoro" />
        <OdakKurulum ayar={ayar} setAyar={setAyar} onBitir={() => setKurulumAcik(false)} />
      </div>
    )
  }

  return (
    <div>
      <BaslikSatiri arac="pomodoro" baslik="Pomodoro" />

      {bitenProva && (
        <Not className="mb-4">
          {bitenProva.ad} provası bitti — süre {bitenProva.dakika} dakikaydı, çalışma
          geçmişine yazıldı.
        </Not>
      )}

      {kirilanKilit && (
        <Not tur="uyari" className="mb-4">
          Odak kilidini kırdın, tur baştan başlıyor.
        </Not>
      )}

      {/*
        Kip anahtarı: Pomodoro ya da deneme provası. Prova eskiden Süreler
        kartının bir satırıydı; iki kipin ekranı da ayrı (biri ders soruyor,
        öteki kitapçık) ve aynı kartın içindeki bir satır bunu göstermiyordu.
        Provaya geçmek TYT'yi seçiyor — boş bir prova kipi olmaz, kitapçık
        seçilmeden sayacın süresi yok.
      */}
      <div data-tanitim="pomodoro-prova"
        className={cn(
          'mb-3 flex rounded-[14px] bg-muted p-1',
          turIcinde && 'pointer-events-none opacity-50',
        )}
        role="tablist"
        aria-label="Sayaç kipi"
      >
        <KipDugmesi secili={prova === null} onClick={() => provayiAyarla(null)}>
          Pomodoro
        </KipDugmesi>
        <KipDugmesi secili={prova !== null} onClick={() => provayiAyarla(PROVALAR[0])}>
          Deneme provası
        </KipDugmesi>
      </div>

      {/*
        Hazırlık ekranındaki halka sahnedekinden küçük (168, sahnede 300):
        halka burada ekranın asıl işi değil, altındaki ders seçimi ve ayarlar
        kaydırmadan görünmeli. 228'deyken Başlat'a kadar bir ekran boyu
        kaydırmak gerekiyordu.
      */}
      {/* Turda blok ekrana sığsın. `100dvh` body'deki tablet büyütmesinden
          (`zoom`) etkilenmiyor; bölünmezse iPad'de blok 1,2 kat uzuyor ve
          alt kenarı ekranın dışına taşıyordu (kart 6). */}
      <div data-tanitim="pomodoro-calisma" style={demoVeri ? { maxHeight: "calc(100dvh / var(--olcek, 1) - 300px)", overflowY: "auto" } : undefined}>
      <Kart data-tanitim="pomodoro-sayaci" className="mb-3 flex flex-col items-center rounded-3xl px-4 pt-4 pb-3.5">
        <Sayac kalan={kalan} oran={oran} mola={molaMi} boyut={168} kalinlik={10} altYazi={siradaki} />
        <TurNoktalari tur={tur} turSayisi={ayar.turSayisi} gizli={prova !== null} className="mt-3" />
      </Kart>

      {prova === null ? (
        /* Provada ders sorulmuyor: seans `PROVA_DERSI` ile kaydediliyor ve
           ekranda iki ayrı "ne çalışıyorsun" cevabı olamaz. Molada da yok —
           sıradaki çalışma turu başlarken yeniden görünüyor. */
        !molaMi && (
          <div data-tanitim="pomodoro-ders" className={cn('mb-3', turIcinde && 'pointer-events-none opacity-50')}>
            <p className="mb-2 ml-0.5 text-[12.5px] font-extrabold text-muted-foreground">
              HANGİ DERSE?
            </p>
            <DersSeridi dersler={gorunenDersler} secili={ders} onSec={setDers} />
          </div>
        )
      ) : (
        <div className={cn('mb-3', turIcinde && 'pointer-events-none opacity-50')}>
          <p className="mb-2 ml-0.5 text-[12.5px] font-extrabold text-muted-foreground">
            HANGİ DENEMEYİ ÇÖZÜYORSUN?
          </p>
          <div className="grid grid-cols-4 gap-2">
            {PROVALAR.map((p) => (
              <SecimKutusu
                key={p.id}
                secili={prova.id === p.id}
                onClick={() => provayiAyarla(p)}
                className="h-[60px] flex-col gap-0.5"
              >
                <span className="text-[15px] font-extrabold">{p.ad}</span>
                <span className="text-[11.5px] font-semibold opacity-85">{p.dakika} dk</span>
              </SecimKutusu>
            ))}
            {/* Dördüncü kutu bir süre MEB'in STS'siydi (40 dk); kullanıcı
                kaldırttı, yerine her öğrenci kendi süresini yazıyor. Son
                yazılan süre ayarda hatırlanıyor (`provaSuresi`). */}
            <SecimKutusu
              secili={prova.id === 'ozel'}
              onClick={() => provayiAyarla(ozelProva(ayar.provaSuresi))}
              className="h-[60px] flex-col gap-0.5"
            >
              <span className="text-[14px] leading-tight font-extrabold">Süre gir</span>
              <span className="text-[11.5px] font-semibold opacity-85">{ayar.provaSuresi} dk</span>
            </SecimKutusu>
          </div>
          {prova.id === 'ozel' && (
            <label className="mt-2 flex items-center gap-3">
              <span className="flex-1 text-[13px] font-bold text-muted-foreground">
                Kaç dakika? ({OZEL_PROVA_SINIRI.enAz}–{OZEL_PROVA_SINIRI.enCok})
              </span>
              <SerbestSure
                deger={ayar.provaSuresi}
                hazirlar={[]}
                sinir={OZEL_PROVA_SINIRI}
                onDegis={ozelSureyiAyarla}
                className="w-28 shrink-0"
              />
            </label>
          )}
        </div>
      )}

      <Kart data-tanitim="pomodoro-ayarlar" className="mb-3 p-0">
        {/* Süreler provada yok: o turda kullanılmıyorlar ve kilitli bir satır,
            kullanılıyormuş izlenimi verirdi. Ayarlar kaybolmuyor, prova
            kapatılınca aynı değerlerle geri geliyor. */}
        {prova === null && (
          <AyarSatiri
            simge={<Clock size={18} aria-hidden />}
            vurgulu
            ad="Süreler"
            not={sureOzeti}
            eylem="Ayarla"
            onClick={() => setSureCekmecesi(true)}
            kilitli={turIcinde}
          />
        )}

        {/*
          Odak koruması Süreler'in hemen altında, ekran anahtarı en altta
          (kullanıcının sırası). Koruma bir süre ayrı bir kartta, Başlat'a en
          yakın yerdeydi; turun süresiyle birlikte kurulan bir karar olduğu
          için Süreler'in yanına geldi.

          Korumaların kapısı kapalı bir satır: iki anahtar (odak kilidi,
          rahatsız etme) bir süre açık duruyordu ve ikisi de ayrıca
          Ayarlar'da vardı; iki kopya zamanla birbirinden ayrıldı. Paneli
          açmadan da hangi korumanın açık olduğu satırın altında yazıyor.
          Karar her turda değişiyor ve turu başlatmadan önce görülmeyen bir
          ayar, o turda yanlış kurulmuş bir ayardır.

          Tarayıcıda görünmüyor: odak kilidi cihaza bağlı tek özellik. iOS'ta
          içerik başka (`IosOdakAyarlari`): Screen Time'ın tek kalkanı.

          **Ses satırı yok.** Lo-fi çalar ve önizlemeli parça listesi burada
          duruyordu; kullanıcı kaldırttı. Tur sessiz, aşama sonundaki zil
          duruyor — o müzik değil, haber.
        */}
        {(odakKorumasiVar() || demoVeri) && (
          <div data-tanitim="pomodoro-kilit" className="border-t border-border first:border-t-0">
            <AyarSatiri
              simge={<ShieldCheck size={18} aria-hidden />}
              vurgulu={korumaVar}
              ad="Odak koruması"
              not={korumaOzeti}
              eylem={korumaPaneli ? 'Kapat' : 'Ayarla'}
              onClick={() => { if (!demoVeri) setKorumaPaneli((a) => !a) }}
              kilitli={demoVeri}
            />
            {korumaPaneli && (
              <div className="acilir-giris border-t border-border">
                {iosMu() ? (
                  <IosOdakAyarlari ayar={ayar} setAyar={setAyar} />
                ) : (
                  <OdakAyarlari ayar={ayar} setAyar={setAyar} />
                )}
              </div>
            )}
          </div>
        )}

        {/* Ekran anahtarı her iki kipte de burada ve en altta: provada da
            geçerli ve Süreler çekmecesine konsaydı 165 dakikalık bir turda
            ona hiç ulaşılamazdı. */}
        <label className="flex w-full cursor-pointer items-center gap-3 border-t border-border px-4 py-3.5">
          <Sun size={18} className="shrink-0 text-muted-foreground" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold">Çalışırken ekran açık kalsın</span>
            <span className="block text-[12.5px] text-muted-foreground">Pili daha hızlı tüketir</span>
          </span>
          <input
            type="checkbox"
            className="sr-only"
            checked={ayar.ekraniAcikTut}
            onChange={(e) => setAyar((o) => ({ ...o, ekraniAcikTut: e.target.checked }))}
          />
          <Anahtar acik={ayar.ekraniAcikTut} />
        </label>
      </Kart>

      </div>

      {/*
        Başlat sayfanın dibine yapışık: ayarlar uzadıkça düğme kaydırmanın
        sonuna gitmesin. Alt menü hâlâ altta, çubuk onun hemen üstünde duruyor.
      */}
      {/* `data-yuzen`: iOS'taki yerli engel listesi bunun altına kaymamalı
          (`ios-odak-ayarlari.tsx`). */}
      <div
        data-yuzen
        className="sticky bottom-[calc(4.5rem+var(--guvenli-alt))] -mx-4 bg-background/95 px-4 pt-2 pb-3 tablet:bottom-[calc(0.5rem+var(--guvenli-alt))]"
      >
        <Buton className="h-[52px] w-full rounded-2xl text-[17px] shadow-[0_8px_18px_rgba(217,98,47,0.26)]" onClick={baslat}>
          <Play size={20} fill="currentColor" aria-hidden />
          {turIcinde ? 'Devam et' : 'Başlat'}
        </Buton>
      </div>

      <Cekmece acik={sureCekmecesi} baslik="Süreler" onKapat={() => setSureCekmecesi(false)}>
        <SureAyarlari ayar={ayar} setAyar={setAyar} />
      </Cekmece>

      {sahne && gorunur && (
        <CalismaSahnesi
          durum={prova ? 'DENEME PROVASI' : durumEtiketi.toLocaleUpperCase('tr-TR')}
          baslik={
            prova
              ? prova.id === 'ozel'
                ? 'DENEME'
                : `${prova.ad} DENEMESİ`
              : (ders ?? ASAMA_ADI[asama]).toLocaleUpperCase('tr-TR')
          }
          kalan={kalan}
          oran={oran}
          mola={molaMi}
          bitisZamani={bitisZamani}
          calisiyor={calisiyor}
          dokunulmadi={dokunulmadi}
          tur={tur}
          turSayisi={ayar.turSayisi}
          turlarGizli={prova !== null}
          onGeri={sahnedenCik}
          onBitir={sifirla}
          onBaslat={baslat}
          onDuraklat={duraklat}
          onAtla={atla}
        />
      )}
    </div>
  )
}

/**
 * Sayaç tam ekran: alt menü ve ayarlar arkada kalıyor, ekranda tek iş
 * sayaç. `tam-katman-girisi` ile alttan yükseliyor ve geri tuşu (donanım
 * dahil) turu bitirmiyor: sayaç işliyorsa ekrandan çıkılıyor ve tur sürüyor
 * (sağ altta saat), duraklatılmışsa sahne kapanıyor.
 */
function CalismaSahnesi({
  durum,
  baslik,
  kalan,
  oran,
  mola,
  bitisZamani,
  calisiyor,
  dokunulmadi,
  tur,
  turSayisi,
  turlarGizli,
  onGeri,
  onBitir,
  onBaslat,
  onDuraklat,
  onAtla,
}: {
  durum: string
  baslik: string
  kalan: number
  oran: number
  mola: boolean
  bitisZamani: number | null
  calisiyor: boolean
  dokunulmadi: boolean
  tur: number
  turSayisi: number
  turlarGizli: boolean
  onGeri: () => void
  onBitir: () => void
  onBaslat: () => void
  onDuraklat: () => void
  onAtla: () => void
}) {
  useGeriKatmani(true, onGeri)
  const [bitirSoruluyor, setBitirSoruluyor] = useState(false)

  /*
    Sayacın altında bitiş saati: "kaç dakika kaldı"yı saate çevirmek
    kullanıcının işiydi. Duraklatılmışken saat yok — bitişin ne zaman olacağı
    belli değil.
  */
  const altSatir = calisiyor && bitisZamani !== null
    ? `bitiş ${saatYaz(bitisZamani)}`
    : dokunulmadi
      ? 'başlamadı'
      : 'duraklatıldı'

  return (
    <div className="tam-katman-girisi fixed inset-0 z-50 flex yuk-ekran justify-center bg-background">
      {/*
        "Turu bitir" doğrudan bitirmiyor, önce soruyor: sayaç sıfırlanıyor ve
        tur kaydedilmiyor; düğme Duraklat'ın hemen yanında ve yanlışlıkla
        basılıyordu. Başlamamış turda kaybedilecek bir şey yok, orada sormuyor.
        Geri oku sormuyor — o yalnızca duraklatıyor.
      */}
      <Onay
        acik={bitirSoruluyor}
        baslik="Tur bitirilsin mi?"
        aciklama="Sayaç sıfırlanır, bu tur kaydedilmez."
        onayMetni="Bitir"
        onOnayla={onBitir}
        onIptal={() => setBitirSoruluyor(false)}
      />
      <div
        className="flex w-full max-w-md flex-col px-5"
        style={{
          paddingTop: 'calc(1.5rem + var(--guvenli-ust))',
          paddingBottom: 'calc(1.375rem + var(--guvenli-alt))',
        }}
      >
        <div className="flex shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={onGeri}
            aria-label="Ekrandan çık"
            className="golge-kart flex size-10 items-center justify-center rounded-[13px] bg-card text-muted-foreground transition active:brightness-95"
          >
            <ChevronLeft size={19} aria-hidden />
          </button>
          <span className="text-[12.5px] font-extrabold tracking-[0.1em] text-muted-foreground">
            {durum}
          </span>
          <span className="w-10" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <span className="text-[15px] font-extrabold tracking-[0.14em] text-primary">{baslik}</span>
          <Sayac kalan={kalan} oran={oran} mola={mola} boyut={300} kalinlik={10} altYazi={altSatir} buyuk />
          <TurNoktalari tur={tur} turSayisi={turSayisi} gizli={turlarGizli} genis />
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <SahneDugmesi
            etiket="Turu bitir"
            onClick={() => (dokunulmadi ? onBitir() : setBitirSoruluyor(true))}
          >
            <X size={20} aria-hidden />
          </SahneDugmesi>
          <Buton
            className="h-[54px] flex-1 rounded-2xl text-[17px] shadow-[0_8px_18px_rgba(217,98,47,0.26)]"
            onClick={calisiyor ? onDuraklat : onBaslat}
          >
            {calisiyor ? (
              <>
                <Pause size={20} fill="currentColor" aria-hidden /> Duraklat
              </>
            ) : (
              <>
                <Play size={20} fill="currentColor" aria-hidden />
                {dokunulmadi ? 'Başlat' : 'Devam et'}
              </>
            )}
          </Buton>
          <SahneDugmesi etiket="Bu aşamayı atla" onClick={onAtla}>
            <SkipForward size={20} aria-hidden />
          </SahneDugmesi>
        </div>
      </div>
    </div>
  )
}

function SahneDugmesi({
  etiket,
  onClick,
  children,
}: {
  etiket: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiket}
      className="flex h-[54px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground transition active:bg-muted"
    >
      {children}
    </button>
  )
}

/** Bitiş saati "19.42" biçiminde — tasarımın yazımı, `toLocaleTimeString` değil. */
function saatYaz(zaman: number): string {
  const t = new Date(zaman)
  return `${String(t.getHours()).padStart(2, '0')}.${String(t.getMinutes()).padStart(2, '0')}`
}

function KipDugmesi({
  secili,
  onClick,
  children,
}: {
  secili: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={secili}
      onClick={onClick}
      className={cn(
        'h-9 flex-1 rounded-[10px] text-[13px] font-extrabold transition',
        secili ? 'bg-card text-primary shadow-[0_1px_3px_rgba(90,60,35,0.12)]' : 'text-muted-foreground',
      )}
    >
      {children}
    </button>
  )
}

/** Ayar kartındaki satır: simge, ad, altında özet, uçta eylem. */
function AyarSatiri({
  simge,
  vurgulu,
  ad,
  not,
  eylem,
  onClick,
  kilitli,
}: {
  simge: React.ReactNode
  /** Simge amber mi (ayar etkin) yoksa gri mi. */
  vurgulu?: boolean
  ad: string
  not: string
  eylem: string
  onClick: () => void
  kilitli?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={kilitli}
      className="flex w-full items-center gap-3 border-t border-border px-4 py-3.5 text-left first:border-t-0 disabled:opacity-50"
    >
      <span className={cn('shrink-0', vurgulu ? 'text-primary' : 'text-muted-foreground')}>
        {simge}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold">{ad}</span>
        <span className="block truncate text-[12.5px] text-muted-foreground">{not}</span>
      </span>
      <span className="text-[12.5px] font-extrabold text-primary">{eylem}</span>
    </button>
  )
}

/**
 * Alttan açılan çekmece. Geri tuşu ve karartmaya dokunuş kapatıyor; içerik
 * ekranın %86'sını aşarsa kendi içinde kayıyor.
 */
function Cekmece({
  acik,
  baslik,
  onKapat,
  children,
}: {
  acik: boolean
  baslik: string
  onKapat: () => void
  children: React.ReactNode
}) {
  useGeriKatmani(acik, onKapat)
  const kaydir = useAsagiKaydirKapat(onKapat)
  if (!acik) return null
  return (
    <div
      className="katman-zemin fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onKapat}
    >
      <div
        ref={kaydir}
        className="alt-pencere-girisi max-h-[86%] w-full max-w-md overflow-y-auto rounded-t-[26px] bg-card px-[18px] pt-2 pb-[calc(1.5rem+var(--guvenli-alt))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-1.5 pb-3">
          <span className="h-[5px] w-[42px] rounded-[3px] bg-border" />
        </div>
        <div className="mb-[18px] flex items-center justify-between">
          <p className="font-display text-lg font-extrabold tracking-tight">{baslik}</p>
          <Buton bicim="ikincil" boy="kucuk" onClick={onKapat} className="rounded-xl text-[13px]">
            Bitti
          </Buton>
        </div>
        {children}
      </div>
    </div>
  )
}

function Sayac({
  kalan,
  oran,
  mola,
  boyut,
  kalinlik,
  altYazi,
  buyuk,
}: {
  kalan: number
  oran: number
  mola: boolean
  boyut: number
  kalinlik: number
  altYazi: string
  /** Sahnedeki büyük sayaç: 72 piksellik rakam. */
  buyuk?: boolean
}) {
  const yaricap = (boyut - kalinlik) / 2
  const cevre = 2 * Math.PI * yaricap

  return (
    <div className="relative" style={{ width: boyut, height: boyut }}>
      <svg width={boyut} height={boyut} className="-rotate-90">
        <circle
          cx={boyut / 2}
          cy={boyut / 2}
          r={yaricap}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={kalinlik}
        />
        <circle
          cx={boyut / 2}
          cy={boyut / 2}
          r={yaricap}
          fill="none"
          stroke={mola ? 'var(--ikincil)' : 'var(--primary-parlak)'}
          strokeWidth={kalinlik}
          strokeLinecap="round"
          strokeDasharray={cevre}
          strokeDashoffset={cevre * (1 - oran)}
          className="transition-[stroke-dashoffset] duration-500 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            'rakam font-display font-extrabold leading-none tabular-nums',
            buyuk ? 'text-[72px] tracking-[-0.04em]' : 'text-[40px] tracking-[-0.03em]',
          )}
        >
          {sureYaz(kalan)}
        </span>
        <span
          className={cn(
            'whitespace-nowrap text-muted-foreground',
            buyuk ? 'mt-2 text-[13px] font-semibold' : 'mt-1 text-[12.5px] font-bold',
          )}
        >
          {altYazi}
        </span>
      </div>
    </div>
  )
}

/**
 * Tur noktaları: uzun molaya kaç tur kaldığı. Provada gizli ama yeri
 * duruyor (`invisible`), yoksa kip değişince sayaç kartı boy değiştirirdi.
 */
function TurNoktalari({
  tur,
  turSayisi,
  gizli,
  genis,
  className,
}: {
  tur: number
  turSayisi: number
  gizli: boolean
  genis?: boolean
  className?: string
}) {
  const sayi = turSayisi > 0 ? turSayisi : 4
  // Döngüdeki yer: 5. tur dört turluk döngüde yeniden ilk nokta.
  const gecen = (tur - 1) % sayi
  return (
    <div className={cn('flex h-[5px]', genis ? 'gap-[7px]' : 'gap-1.5', gizli && 'invisible', className)}>
      {Array.from({ length: sayi }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-[5px] rounded-[3px]',
            genis ? 'w-7' : 'w-6',
            i <= gecen ? 'bg-primary-parlak' : 'bg-primary-soft',
          )}
        />
      ))}
    </div>
  )
}

/**
 * Süreler çekmecesinin içi.
 *
 * Kart eskiden sayfada açık duruyordu ve dört grup çip sayacın altında
 * ekranın yarısını kaplıyordu; şimdi bir satır ve altındaki çekmece. Prova
 * artık burada değil, kip anahtarında: prova seçmek çalışma/mola sürelerinin
 * yerine ÖSYM'nin süresini koymak demek ve o karar sürelerin bir satırı gibi
 * değil ekranın kipi gibi duruyor.
 */
function SureAyarlari({
  ayar,
  setAyar,
}: {
  ayar: PomodoroAyar
  setAyar: (guncelleyici: PomodoroAyar | ((onceki: PomodoroAyar) => PomodoroAyar)) => void
}) {
  const calismaSecenekleri = [15, 25, 30, 45, 50, 60]
  const turSecenekleri = [2, 3, 4, 5]

  return (
    <div>
      <GrupBasligi>Çalışma · dakika</GrupBasligi>
      <div className="mb-[18px] grid grid-cols-4 gap-2">
        {calismaSecenekleri.map((deger) => (
          <SureKutusu
            key={deger}
            secili={ayar.calisma === deger}
            onClick={() => setAyar((o) => ({ ...o, calisma: deger }))}
          >
            {deger}
          </SureKutusu>
        ))}
        <SerbestSure
          deger={ayar.calisma}
          hazirlar={calismaSecenekleri}
          sinir={{ enAz: 1, enCok: 180 }}
          onDegis={(deger) => setAyar((o) => ({ ...o, calisma: deger }))}
        />
      </div>

      <GrupBasligi>Molalar · dakika</GrupBasligi>
      <div className="mb-[18px] flex gap-2.5">
        <Sayici
          etiket="Kısa"
          deger={ayar.kisaMola}
          sinir={{ enAz: 1, enCok: 60 }}
          onDegis={(deger) => setAyar((o) => ({ ...o, kisaMola: deger }))}
        />
        <Sayici
          etiket="Uzun"
          deger={ayar.uzunMola}
          sinir={{ enAz: 1, enCok: 120 }}
          onDegis={(deger) => setAyar((o) => ({ ...o, uzunMola: deger }))}
        />
      </div>

      <GrupBasligi>Uzun moladan önce</GrupBasligi>
      <div className="grid grid-cols-4 gap-2">
        {turSecenekleri.map((deger) => (
          <SureKutusu
            key={deger}
            secili={ayar.turSayisi === deger}
            onClick={() => setAyar((o) => ({ ...o, turSayisi: deger }))}
          >
            {deger} tur
          </SureKutusu>
        ))}
      </div>
    </div>
  )
}

function GrupBasligi({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
      {children}
    </p>
  )
}

function SureKutusu({
  secili,
  className,
  ...props
}: React.ComponentProps<'button'> & { secili: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={secili}
      className={cn(
        'rakam flex h-[46px] items-center justify-center rounded-[14px] border text-[15px] transition',
        secili
          ? 'border-[1.5px] border-primary-parlak bg-primary-soft font-extrabold text-primary'
          : 'border-border bg-background font-bold text-muted-foreground active:bg-muted',
        className,
      )}
      {...props}
    />
  )
}

/** Mola süresi için −/+ sayaç: mola bir iki dakika oynatılan bir sayı, çip seçtirmeye değmez. */
function Sayici({
  etiket,
  deger,
  sinir,
  onDegis,
}: {
  etiket: string
  deger: number
  sinir: { enAz: number; enCok: number }
  onDegis: (deger: number) => void
}) {
  const ayarla = (yeni: number) => onDegis(Math.min(sinir.enCok, Math.max(sinir.enAz, yeni)))
  return (
    <div className="flex-1 rounded-2xl border border-border bg-background px-3.5 py-3">
      <p className="mb-2 text-xs font-bold text-muted-foreground">{etiket}</p>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => ayarla(deger - 1)}
          disabled={deger <= sinir.enAz}
          aria-label={`${etiket} molayı azalt`}
          className="flex size-[34px] items-center justify-center rounded-[11px] bg-muted text-lg font-extrabold text-muted-foreground transition active:brightness-95 disabled:opacity-40"
        >
          −
        </button>
        <span className="rakam text-[22px] font-extrabold">{deger}</span>
        <button
          type="button"
          onClick={() => ayarla(deger + 1)}
          disabled={deger >= sinir.enCok}
          aria-label={`${etiket} molayı artır`}
          className="flex size-[34px] items-center justify-center rounded-[11px] bg-primary-soft text-lg font-extrabold text-primary transition active:brightness-95 disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  )
}

/**
 * Hazır seçeneklerin dışında bir süre yazmak için.
 *
 * Kutu, yalnızca hazır seçeneklerden biri **seçili değilken** dolu görünüyor;
 * böylece hangi değerin geçerli olduğu tek bakışta anlaşılıyor (çip mi, kutu mu).
 * Yazarken anında uygulanmıyor: "6" yazıp "60" yapmaya giderken sayaç 6 dakikaya
 * düşerdi. Değer odaktan çıkınca ya da Enter'a basınca işleniyor.
 */
function SerbestSure({
  deger,
  hazirlar,
  sinir,
  onDegis,
  className,
}: {
  deger: number
  hazirlar: number[]
  sinir: { enAz: number; enCok: number }
  onDegis: (deger: number) => void
  className?: string
}) {
  const ozel = !hazirlar.includes(deger)
  const [metin, setMetin] = useState(ozel ? String(deger) : '')

  // Çipe basıldığında kutu boşalmalı; dışarıdan gelen değer değişimini izliyor.
  useEffect(() => {
    setMetin(ozel ? String(deger) : '')
  }, [deger, ozel])

  const uygula = () => {
    const sayi = Number(metin)
    if (!Number.isFinite(sayi) || sayi <= 0) {
      setMetin(ozel ? String(deger) : '')
      return
    }
    onDegis(Math.min(sinir.enCok, Math.max(sinir.enAz, Math.round(sayi))))
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      value={metin}
      onChange={(e) => setMetin(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
      onBlur={uygula}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          e.currentTarget.blur()
        }
      }}
      placeholder="Kendim yazayım"
      aria-label={`Serbest süre (${sinir.enAz}–${sinir.enCok} dakika)`}
      className={cn(
        'rakam col-span-2 h-[46px] rounded-[14px] border border-dashed bg-transparent px-3 text-center text-[15px] font-bold',
        'placeholder:text-sm placeholder:font-semibold placeholder:text-muted-foreground',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ozel ? 'border-solid border-primary-parlak bg-primary-soft text-primary' : 'border-border text-muted-foreground',
        className,
      )}
    />
  )
}


/** Sağ alttaki saatin okuduğu durum (`PomodoroEkrani` → `AppShell`). */
export type PomodoroDurumu = {
  /** Başlamış ya da bir aşaması bitmiş tur var — bileşen sökülmemeli. */
  canli: boolean
  /** İşliyorsa bitiş zamanı; duraklatılmışsa null. */
  bitisZamani: number | null
  /** Duraklatılmışken kalan saniye. */
  donukKalan: number | null
  mola: boolean
  toplamSaniye: number
}
