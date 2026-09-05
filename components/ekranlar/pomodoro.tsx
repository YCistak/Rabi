'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { KeepAwake } from '@capacitor-community/keep-awake'
import { Capacitor } from '@capacitor/core'
import {
  Music,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'
import type { PomodoroAyar, PomodoroSeans, SesSecimi } from '@/lib/types'
import {
  ASAMA_ADI,
  asamaSuresi,
  ilerlemeOrani,
  kalanSaniye,
  sonrakiAsama,
  sureYaz,
  type Asama,
} from '@/lib/pomodoro'
import { SesCalar } from '@/lib/ses'
import { LOFI_PARCALAR } from '@/lib/lofi'
import { CALISMA_DERSLERI } from '@/lib/dersler'
import { PROVALAR, PROVA_DERSI, type Prova } from '@/lib/sinav-provasi'
import { izinIste, pomodoroIptal, pomodoroPlanla } from '@/lib/bildirim'
import {
  odakKilidiDesteklenir,
  odakKilidiKapatilinca,
  odakKilidiniBaslat,
  odakKilidiniBitir,
  odakKilidiniDuraklat,
  pomodoroKomutuGelince,
  type PomodoroKomutu,
} from '@/lib/odak-kilidi'
import { OdakKurulum } from '@/components/ekranlar/odak-kurulum'
import { OdakAyarlari } from '@/components/odak/odak-ayarlari'
import { cn, yeniId } from '@/lib/utils'
import { BaslikSatiri, Buton, Cip, Kart, Not } from '@/components/ui'

/** Ders çipleri baştan bu kadar gösteriliyor; gerisi "+N ders" ile açılıyor. */
const KISA_DERS_SAYISI = 14

export function PomodoroEkrani({
  ayar,
  setAyar,
  onSeansBitti,
}: {
  ayar: PomodoroAyar
  setAyar: (guncelleyici: PomodoroAyar | ((onceki: PomodoroAyar) => PomodoroAyar)) => void
  onSeansBitti: (seans: PomodoroSeans) => void
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
  const [hepsiAcik, setHepsiAcik] = useState(false)
  const kisaListe = CALISMA_DERSLERI.slice(0, KISA_DERS_SAYISI)
  // Seçili ders kısa listede yoksa liste tamamen açılıyor; yoksa kullanıcı
  // az önce seçtiği dersin nereye gittiğini göremezdi.
  const gorunenDersler =
    hepsiAcik || (ders !== null && !kisaListe.includes(ders)) ? CALISMA_DERSLERI : kisaListe
  const [bitisZamani, setBitisZamani] = useState<number | null>(null)
  const [kalan, setKalan] = useState(ayar.calisma * 60)
  /**
   * Bu aşama hiç başlatılmadı mı. Süre ayarı değiştiğinde sayacın yeni süreye
   * atlaması gerekiyor — ama yalnızca dokunulmamış aşamada: duraklatılmış bir
   * sayaç sıfırdan başlatılırsa kullanıcı çalıştığı süreyi kaybeder.
   */
  const [dokunulmadi, setDokunulmadi] = useState(true)
  const [sesPaneli, setSesPaneli] = useState(false)
  /**
   * Önizlemesi çalan parçanın dosya adı.
   *
   * Seçimden ayrı bir state: dinlemek seçmek değil. Kullanıcı üç parçayı
   * dinleyip hiçbirini seçmeden paneli kapatabilmeli — dinlenen parçayı seçili
   * saymak, kararı onun yerine vermek olurdu.
   */
  const [onizlenen, setOnizlenen] = useState<string | null>(null)
  /**
   * Odak kilidi tanıtımı pomodoroya ilk girişte bir kez çıkıyor. Tarayıcıda
   * özellik hiç yok; orada tanıtım da gösterilmiyor.
   */
  const [kurulumAcik, setKurulumAcik] = useState(false)
  /** Koruma paneli açık mı — kapalı başlıyor, sayaç ekranın asıl işi. */
  const [korumaPaneli, setKorumaPaneli] = useState(false)
  useEffect(() => {
    if (odakKilidiDesteklenir() && !ayar.kilitTanitimiGoruldu) setKurulumAcik(true)
  }, [ayar.kilitTanitimiGoruldu])

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

  const calarAl = useCallback(() => {
    if (!calarRef.current) calarRef.current = new SesCalar()
    return calarRef.current
  }, [])

  // Bileşen sökülürken ses ve ekran kilidi bırakılmalı, yoksa arka planda kalır.
  useEffect(() => {
    return () => {
      calarRef.current?.kapat()
      calarRef.current = null
      if (Capacitor.isNativePlatform()) void KeepAwake.allowSleep().catch(() => {})
      void pomodoroIptal()
      void odakKilidiniBitir()
    }
  }, [])

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

    const guncelle = () => {
      const yeni = kalanSaniye(bitisZamani)
      setKalan(yeni)
      if (yeni <= 0) asamayiBitir()
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
    setKirilanKilit(false)
    setBitenProva(null)
    const bitis = Date.now() + kalan * 1000
    setBitisZamani(bitis)
    setDokunulmadi(false)
    baslangicRef.current = new Date().toISOString()

    const calar = calarAl()
    calar.sesSeviyesi(ayar.sesSeviyesi)
    calar.cal(ayar.ses)

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
    void odakKilidiniBaslat(
      korumaliTur && ayar.odakKilidi ? ayar.kilitliUygulamalar : [],
      bitis,
      // Engel katmanındaki çip provada dersin değil sınavın adını yazıyor:
      // ekranda "MATEMATİK" görünürken çözülen şey TYT kitapçığı oluyordu.
      prova ? `${prova.ad} PROVASI` : (ders ?? undefined),
      korumaliTur && ayar.rahatsizEtme,
      prova ? 'Deneme provası' : ASAMA_ADI[asama],
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
  }

  const atla = () => {
    turuBirak()
    /*
      Provada atlamak provadan çıkmak demek: yarıda bırakılan kitapçık seans
      olarak sayılmıyor (sayaç dolmadı) ve sayaç sıradan çalışma turuna döner.
    */
    if (prova) {
      setProva(null)
      setAsama('calisma')
      setKalan(ayar.calisma * 60)
      setDokunulmadi(true)
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
    void odakKilidiKapatilinca(() => iptalRef.current()).then((kaldir) => {
      birak = kaldir
    })
    return () => birak()
  }, [])

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
      const calar = calarAl()
      calar.sesSeviyesi(ayar.sesSeviyesi)
      calar.cal(ayar.ses)
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
    void pomodoroKomutuGelince((veri) => komutRef.current(veri)).then((kaldir) => {
      birak = kaldir
    })
    return () => birak()
  }, [])

  /**
   * Prova seçimi. Aynı çipe ikinci kez dokunmak provayı kapatıyor.
   *
   * Sayaç çalışırken seçim yok: süresi değişen bir sayaç, başladığı sınavdan
   * başka bir sınavı ölçer.
   */
  const provaSec = (secilen: Prova) => {
    if (calisiyor) return
    const yeni = prova?.id === secilen.id ? null : secilen
    setProva(yeni)
    setBitenProva(null)
    setAsama('calisma')
    setKalan((yeni ? yeni.dakika : ayar.calisma) * 60)
    setDokunulmadi(true)
    baslangicRef.current = null
  }

  const sesSec = (secim: SesSecimi) => {
    setAyar((o) => ({ ...o, ses: secim }))
    const calar = calarAl()
    calar.sesSeviyesi(ayar.sesSeviyesi)
    // Seçim önizlemeyi bitiriyor: seçtikten sonra hâlâ başka bir parçayı
    // dinliyor olmak, hangisinin seçildiğini duyulamaz yapardı.
    setOnizlenen(null)
    // Ses seçimi çalışırken değişirse anında geçilir; duraklatılmışsa sessiz kalır.
    if (calisiyor) calar.cal(secim)
    else calar.onizlemeyiDurdur()
  }

  /**
   * Önizleme düğmesi: aynı parçaya ikinci kez basmak durduruyor.
   *
   * Kullanıcı bir parçayı **seçmeden önce** dinleyebilmeli; on iki adın
   * arasından "Glow on the Overpass"i ada bakarak seçmek seçim değil kura.
   * Eskiden dinlemenin tek yolu parçayı seçip turu başlatmaktı ve beğenilmeyen
   * parça, başlamış bir turun ortasında değiştiriliyordu.
   *
   * Çalar tek olduğu için önizleme onu ödünç alıyor: tur sürerken bir başka
   * parçayı dinlemek çalanı susturuyor, önizleme bitince seçili parça geri
   * geliyor.
   */
  const onizlemeyiDegistir = (dosya: string) => {
    const calar = calarAl()
    if (onizlenen === dosya) {
      setOnizlenen(null)
      if (calisiyor) calar.cal(ayar.ses)
      else calar.onizlemeyiDurdur()
      return
    }
    calar.sesSeviyesi(ayar.sesSeviyesi)
    setOnizlenen(dosya)
    calar.onizle(dosya, () => {
      setOnizlenen(null)
      // Süresi dolduğunda çalar geri veriliyor. `onBitti` yalnızca önizleme
      // hâlâ etkin kaynakken çağrılıyor, yani buradaki `calisiyor` bayat olamaz:
      // turu başlatmak da duraklatmak da çaları önizlemeden almış olurdu.
      if (calisiyor) calarRef.current?.cal(ayar.ses)
    })
  }

  /** Panel kapanırken önizleme de susuyor; kapalı bir panelden ses gelmemeli. */
  const sesPaneliniDegistir = () => {
    setSesPaneli((acik) => {
      if (acik && onizlenen !== null) {
        setOnizlenen(null)
        if (calisiyor) calarRef.current?.cal(ayar.ses)
        else calarRef.current?.onizlemeyiDurdur()
      }
      return !acik
    })
  }

  /*
    Satırın altındaki özet: paneli açmadan hangi korumanın açık olduğu
    okunabilmeli, yoksa kapalı bir satır ayarı görünmez kılardı.
  */
  const korumaVar = ayar.odakKilidi || ayar.rahatsizEtme
  const korumaOzeti = !korumaVar
    ? 'Kilit ve rahatsız etme kapalı'
    : [ayar.odakKilidi && 'Kilit açık', ayar.rahatsizEtme && 'Rahatsız etme açık']
        .filter(Boolean)
        .join(' · ')

  const oran = bitisZamani !== null ? ilerlemeOrani(bitisZamani, toplamDakika) : 0
  const molaMi = asama !== 'calisma'

  if (kurulumAcik) {
    return (
      <div>
        <BaslikSatiri baslik="Pomodoro" aciklama="Odak kilidi" />
        <OdakKurulum ayar={ayar} setAyar={setAyar} onBitir={() => setKurulumAcik(false)} />
      </div>
    )
  }

  return (
    <div>
      <BaslikSatiri
        baslik="Pomodoro"
        aciklama={prova ? `${prova.ad} provası · ${prova.dakika} dk` : `${tur}. tur · ${ASAMA_ADI[asama]}`}
      />

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
        Korumaların kapısı sayacın **üstünde** ve kapalı.

        İki anahtar (odak kilidi, rahatsız etme) bir süre burada açık duruyordu
        ve ikisi de ayrıca Ayarlar'da vardı; iki kopya zamanla birbirinden
        ayrıldı. Ayarlar'daki kaldırıldı, buradaki tek satıra indi: paneli
        açmadan da hangi korumanın açık olduğu satırın altında yazıyor.

        Yeri değişmedi çünkü gerekçe değişmedi: karar her turda değişiyor
        (kütüphanede telefon sussun, evde uygulamalar engelli olsun yeter) ve
        turu başlatmadan önce görülmeyen bir ayar, o turda yanlış kurulmuş bir
        ayardır.

        Tarayıcıda görünmüyor: odak kilidi cihaza bağlı tek özellik.
      */}
      {odakKilidiDesteklenir() && (
        <Kart className="mb-4 p-0">
          <button
            type="button"
            onClick={() => setKorumaPaneli((a) => !a)}
            className="flex w-full items-center gap-3 p-4 text-left"
          >
            <ShieldCheck
              size={18}
              className={cn('shrink-0', korumaVar ? 'text-primary' : 'text-muted-foreground')}
              aria-hidden
            />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">Odak koruması</span>
              <span className="block truncate text-xs text-muted-foreground">
                {korumaOzeti}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">
              {korumaPaneli ? 'Kapat' : 'Ayarla'}
            </span>
          </button>

          {korumaPaneli && (
            <div className="border-t border-border">
              <OdakAyarlari ayar={ayar} setAyar={setAyar} />
            </div>
          )}
        </Kart>
      )}

      <Kart className="mb-4 flex flex-col items-center py-6">
        <Sayac kalan={kalan} oran={oran} mola={molaMi} />

        <div className="mt-4 flex items-center gap-2">
          <Buton bicim="ikincil" boy="simge" onClick={sifirla} aria-label="Sıfırla">
            <RotateCcw size={18} aria-hidden />
          </Buton>
          <Buton className="min-w-36" onClick={calisiyor ? duraklat : baslat}>
            {calisiyor ? (
              <>
                <Pause size={18} aria-hidden /> Duraklat
              </>
            ) : (
              <>
                <Play size={18} aria-hidden /> Başlat
              </>
            )}
          </Buton>
          <Buton bicim="ikincil" boy="simge" onClick={atla} aria-label="Bu aşamayı atla">
            <SkipForward size={18} aria-hidden />
          </Buton>
        </div>
      </Kart>

      {/* Provada ders sorulmuyor: seans `PROVA_DERSI` ile kaydediliyor ve
          ekranda iki ayrı "ne çalışıyorsun" cevabı olamaz. */}
      {!calisiyor && asama === 'calisma' && prova === null && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium">Hangi derse çalışıyorsun?</p>
          <div className="flex flex-wrap gap-2">
            {gorunenDersler.map((d) => (
              <Cip key={d} secili={ders === d} onClick={() => setDers(ders === d ? null : d)}>
                {d}
              </Cip>
            ))}

            {/*
              Liste baştan açık gelmiyor: bütün çipler sayacın üstünde birkaç
              satır kaplıyor ve asıl işi (başlat düğmesini) aşağı itiyordu.
              Seçili ders kısa listenin dışındaysa liste açık başlıyor, yoksa
              kullanıcı seçtiği dersi göremezdi.
            */}
            {!hepsiAcik && CALISMA_DERSLERI.length > KISA_DERS_SAYISI && (
              <Cip onClick={() => setHepsiAcik(true)}>
                +{CALISMA_DERSLERI.length - KISA_DERS_SAYISI} ders
              </Cip>
            )}
          </div>
        </div>
      )}

      <Kart className="mb-4 p-0">
        <button
          type="button"
          onClick={sesPaneliniDegistir}
          className="flex w-full items-center gap-3 p-4 text-left"
        >
          {ayar.ses === 'yok' ? (
            <VolumeX size={18} className="shrink-0 text-muted-foreground" aria-hidden />
          ) : (
            <Volume2 size={18} className="shrink-0 text-primary" aria-hidden />
          )}
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">Ses</span>
            <span className="block truncate text-xs text-muted-foreground">
              {sesAdi(ayar.ses)}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">{sesPaneli ? 'Kapat' : 'Değiştir'}</span>
        </button>

        {sesPaneli && (
          <div className="border-t border-border p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Music size={13} aria-hidden />
              Lo-fi
            </p>
            {/*
              Çip bulutu yerine satır listesi: her parçanın kendi önizleme
              düğmesi var ve iç içe düğme yazılamıyor — dinlemek ile seçmek iki
              ayrı dokunuş, o yüzden iki ayrı hedef. Ada dokunmak seçiyor,
              üçgene dokunmak dinletiyor.
            */}
            <div className="mb-4 space-y-1.5">
              <Cip
                secili={ayar.ses === 'yok'}
                onClick={() => sesSec('yok')}
                className="w-full !rounded-2xl text-left"
              >
                Sessiz
              </Cip>
              {LOFI_PARCALAR.map((p) => {
                const secim: SesSecimi = `lofi:${p.dosya}`
                const calanOnizleme = onizlenen === p.dosya
                return (
                  <div key={p.dosya} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onizlemeyiDegistir(p.dosya)}
                      aria-label={
                        calanOnizleme
                          ? `${p.ad} önizlemesini durdur`
                          : `${p.ad} parçasını dinle`
                      }
                      className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-full border transition',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                        calanOnizleme
                          ? 'border-primary-parlak bg-primary-parlak text-white'
                          : 'border-border bg-card text-primary active:bg-muted',
                      )}
                    >
                      {calanOnizleme ? (
                        <Pause size={15} aria-hidden />
                      ) : (
                        <Play size={15} aria-hidden />
                      )}
                    </button>
                    <Cip
                      secili={ayar.ses === secim}
                      onClick={() => sesSec(secim)}
                      className="min-w-0 flex-1 truncate !rounded-2xl text-left"
                    >
                      {p.ad}
                    </Cip>
                  </div>
                )
              })}
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Ses seviyesi
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(ayar.sesSeviyesi * 100)}
                onChange={(e) => {
                  const deger = Number(e.target.value) / 100
                  setAyar((o) => ({ ...o, sesSeviyesi: deger }))
                  calarRef.current?.sesSeviyesi(deger)
                }}
                className="w-full accent-[var(--primary)]"
              />
            </label>
          </div>
        )}
      </Kart>

      <SureAyarlari
        ayar={ayar}
        setAyar={setAyar}
        kilitli={calisiyor}
        prova={prova}
        onProvaSec={provaSec}
      />

      <Not className="mt-4">
        {prova
          ? `Sayaç bitiş saatine göre çalışıyor — ${prova.dakika} dakika sonra, telefon kilitli olsa da bildirim gelir.`
          : 'Sayaç bitiş saatine göre çalışıyor — telefonu kilitlesen de doğru zamanda biter ve bildirim gelir.'}
      </Not>
    </div>
  )
}

function Sayac({ kalan, oran, mola }: { kalan: number; oran: number; mola: boolean }) {
  const boyut = 220
  const kalinlik = 12
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
          stroke={mola ? 'var(--ikincil)' : 'var(--primary)'}
          strokeWidth={kalinlik}
          strokeLinecap="round"
          strokeDasharray={cevre}
          strokeDashoffset={cevre * (1 - oran)}
          className="transition-[stroke-dashoffset] duration-500 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rakam font-display text-5xl font-semibold tabular-nums">
          {sureYaz(kalan)}
        </span>
      </div>
    </div>
  )
}

/**
 * Süreler kartı — deneme provası dahil.
 *
 * Prova bir süre bu kartın **üstünde kendi kartındaydı** ve iki kart aynı
 * soruya cevap veriyordu: "bu tur kaç dakika sürecek". İkisi ayrı dururken
 * seçim de ayrı iki karar gibi görünüyordu; oysa prova seçmek, çalışma/mola
 * sürelerinin yerine ÖSYM'nin süresini koymak demek.
 *
 * Prova seçiliyken çalışma ve mola satırları çizilmiyor: o turda
 * kullanılmıyorlar ve kilitli bir kutu, kullanılıyormuş izlenimi verirdi.
 * Ayarlar kaybolmuyor, prova kapatılınca aynı değerlerle geri geliyor. Kart
 * artık her hâlde duruyor — eskiden tümüyle gizleniyordu ve provayı kapatmanın
 * yolu da onunla birlikte kayboluyordu.
 */
function SureAyarlari({
  ayar,
  setAyar,
  kilitli,
  prova,
  onProvaSec,
}: {
  ayar: PomodoroAyar
  setAyar: (guncelleyici: PomodoroAyar | ((onceki: PomodoroAyar) => PomodoroAyar)) => void
  kilitli: boolean
  prova: Prova | null
  onProvaSec: (secilen: Prova) => void
}) {
  const alanlar: {
    anahtar: keyof PomodoroAyar
    etiket: string
    secenekler: number[]
    /** Serbest giriş sınırı; yoksa yalnızca hazır seçenekler kullanılır. */
    sinir?: { enAz: number; enCok: number }
  }[] = [
    {
      anahtar: 'calisma',
      etiket: 'Çalışma',
      secenekler: [15, 25, 30, 45, 50, 60],
      sinir: { enAz: 1, enCok: 180 },
    },
    { anahtar: 'kisaMola', etiket: 'Kısa mola', secenekler: [3, 5, 10], sinir: { enAz: 1, enCok: 60 } },
    { anahtar: 'uzunMola', etiket: 'Uzun mola', secenekler: [15, 20, 30], sinir: { enAz: 1, enCok: 120 } },
    { anahtar: 'turSayisi', etiket: 'Uzun moladan önce', secenekler: [2, 3, 4, 5] },
  ]

  return (
    <Kart>
      <p className="mb-3 font-display text-base font-extrabold tracking-tight">Süreler</p>

      {/* Prova, ötekilerle aynı biçimde etiketlenmiş bir satır: kendi başlığı
          ve simgesi olsaydı kartın içinde ikinci bir kart gibi dururdu. */}
      <div className={cn('mb-3', kilitli && 'pointer-events-none opacity-50')}>
        <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
          Deneme provası
        </p>
        <div className="flex flex-wrap gap-2">
          {PROVALAR.map((p) => (
            <Cip key={p.id} secili={prova?.id === p.id} onClick={() => onProvaSec(p)}>
              {p.ad} · {p.dakika} dk
            </Cip>
          ))}
        </div>
      </div>

      {/* Seçili provanın altında bir kural cümlesi vardı, kaldırıldı: soru ve
          dakika sayısı çipin kendisinde yazıyor, mola olmadığı da prova
          seçilince süre satırlarının çizilmemesinden görülüyor. */}

      <div
        className={cn(
          'space-y-3',
          kilitli && 'pointer-events-none opacity-50',
          // Provada çalışma ve mola süreleri kullanılmıyor.
          prova && 'hidden',
        )}
      >
        {alanlar.map(({ anahtar, etiket, secenekler, sinir }) => (
          <div key={anahtar}>
            {/* Etiket küçük ve büyük harf: dört grup alt alta dizildiğinde
                normal yazıyla çipler ile etiketler aynı ağırlıkta okunuyordu. */}
            <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
              {etiket}
              {anahtar === 'turSayisi' ? ' (tur)' : ' (dk)'}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {secenekler.map((deger) => (
                <Cip
                  key={deger}
                  secili={ayar[anahtar] === deger}
                  onClick={() => setAyar((o) => ({ ...o, [anahtar]: deger }))}
                >
                  {deger}
                </Cip>
              ))}
              {sinir && (
                <SerbestSure
                  deger={ayar[anahtar] as number}
                  hazirlar={secenekler}
                  sinir={sinir}
                  onDegis={(deger) => setAyar((o) => ({ ...o, [anahtar]: deger }))}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Ekran anahtarı süre satırlarının dışında: provada da geçerli ve
          gizlenseydi 165 dakikalık bir turda ona hiç ulaşılamazdı. Sayaç
          çalışırken de değiştirilebiliyor — süreler kilitli çünkü başlamış bir
          turun uzunluğu değişmemeli, ekranın açık kalması ise turun ortasında
          verilebilecek bir karar. */}
      <label className="flex items-center justify-between gap-3 pt-1">
        <span className="text-sm">
          Çalışırken ekran açık kalsın
          <span className="block text-xs text-muted-foreground">Pili daha hızlı tüketir</span>
        </span>
        <input
          type="checkbox"
          checked={ayar.ekraniAcikTut}
          onChange={(e) => setAyar((o) => ({ ...o, ekraniAcikTut: e.target.checked }))}
          className="h-5 w-5 shrink-0 accent-[var(--primary)]"
        />
      </label>

      {kilitli && (
        <p className="mt-3 text-xs text-muted-foreground">
          {prova
            ? 'Provayı değiştirmek için sayacı duraklat.'
            : 'Süreleri ve provayı değiştirmek için sayacı duraklat.'}
        </p>
      )}
    </Kart>
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
}: {
  deger: number
  hazirlar: number[]
  sinir: { enAz: number; enCok: number }
  onDegis: (deger: number) => void
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
      placeholder="Diğer"
      aria-label={`Serbest süre (${sinir.enAz}–${sinir.enCok} dakika)`}
      className={cn(
        'rakam h-[34px] w-[68px] rounded-full border bg-card px-3 text-center text-sm font-medium',
        'placeholder:font-normal placeholder:text-muted-foreground/70',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ozel ? 'border-primary text-primary' : 'border-border text-muted-foreground',
      )}
    />
  )
}

function sesAdi(secim: SesSecimi): string {
  const parca = LOFI_PARCALAR.find((p) => `lofi:${p.dosya}` === secim)
  // Eski kayıtlarda kaldırılmış ortam sesleri (yağmur, kafe…) olabilir;
  // tanınmayan her seçim sessize düşer.
  return parca ? `Lo-fi · ${parca.ad}` : 'Sessiz'
}
