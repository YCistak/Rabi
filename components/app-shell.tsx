'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { ArrowLeft } from 'lucide-react'
import type {
  Ayarlar,
  Deneme,
  Devamsizlik,
  GunlukKayit,
  Hedef,
  KazanilanRozet,
  OkulYili,
  OyunId,
  OyunKayitlari,
  OyunTurKaydi,
  PomodoroAyar,
  PomodoroSeans,
  Sablon,
  YanlisSoru,
} from '@/lib/types'
import {
  ANAHTARLAR,
  VARSAYILAN_AYARLAR,
  VARSAYILAN_POMODORO,
  ayarlariNormalize,
  pomodoroAyariniNormalize,
  useYerelDepo,
} from '@/lib/depo'
import type { BankaKaydi } from '@/lib/oyunlar/banka'
import { sablonlariBirlestir } from '@/lib/sablonlar'
import { guncelTahmin, obpHesapla } from '@/lib/tahmin'
import { egitimYili, gunlukToplam, ilerlemisSinif } from '@/lib/hesap'
import { rozetDurumu, yeniRozetler, type Rozet } from '@/lib/rozetler'
import { hatirlatmaIptal, hatirlatmaPlanla, pomodoroIptal } from '@/lib/bildirim'
import { odakKilidiniBitir } from '@/lib/odak-kilidi'
import { bekleyenOzetHaftasi, haftalikOzet } from '@/lib/ozet'
import { bekleyenSayisi } from '@/lib/hata-bildirimi'
import { useHataBildirimi } from '@/lib/hata-kuyrugu'
import { bugun } from '@/lib/utils'
import type { Ekran, Sekme } from '@/lib/gezinme'
import { kullanildi } from '@/lib/son-kullanilan'
import { ustKatmaniKapat } from '@/lib/geri'
import { Acilis, GECIS_SURESI, MaskotGecisi } from '@/components/acilis'
import { HaftalikOzetEkrani } from '@/components/ekranlar/haftalik-ozet'
import { Buton } from '@/components/ui'
import { BottomNav } from '@/components/bottom-nav'
import { Kurulum } from '@/components/kurulum'
import { AnaSayfa } from '@/components/ekranlar/ana-sayfa'
import { KartMenusu } from '@/components/ekranlar/kart-menusu'
import { DenemelerEkrani } from '@/components/ekranlar/denemeler'
import { YeniDenemeEkrani } from '@/components/ekranlar/yeni-deneme'
import { IstatistikEkrani } from '@/components/ekranlar/istatistik'
import { OkulEkrani } from '@/components/ekranlar/okul'
import { AyarlarEkrani } from '@/components/ekranlar/ayarlar'
import { SoruTakibiEkrani } from '@/components/ekranlar/soru-takibi'
import { DevamsizlikEkrani } from '@/components/ekranlar/devamsizlik'
import { PomodoroEkrani } from '@/components/ekranlar/pomodoro'
import { SiralamaEkrani } from '@/components/ekranlar/siralama'
import { HedefEkrani } from '@/components/ekranlar/hedef'
import { YanlisBankaEkrani } from '@/components/ekranlar/yanlis-banka'
import { RozetlerEkrani } from '@/components/ekranlar/rozetler'
import { gununNotlari, notlariNormalize, type NotKagidi } from '@/lib/yapilacaklar'
import { OyunlarEkrani } from '@/components/ekranlar/oyunlar'
import { OyunBankasiEkrani } from '@/components/ekranlar/oyun-bankasi'
import { YapilacaklarEkrani } from '@/components/ekranlar/yapilacaklar'
import { RozetKutlama } from '@/components/rozet-kutlama'

/** Rozet kontrolünün, veri durulana kadar beklediği süre (ms). */
const ROZET_BEKLEME = 1200

/*
  Boyamadan **önce** çalışması gereken etki.

  `useEffect` boyamadan sonra çalışıyor; sayfayı başa almak için kullanılırsa
  yeni ekran bir kare boyunca eski kaydırma konumunda görünüyor, sonra
  zıplıyor. `useLayoutEffect` bunu boyamadan halleder ama sunucuda çalışmıyor
  ve statik dışa aktarım sayfayı sunucuda da bir kez çiziyor — orada uyarı
  çıkmasın diye `useEffect`e düşülüyor. Sunucuda kaydırılacak pencere de yok.
*/
const useYerlesimEtkisi = typeof window === 'undefined' ? useEffect : useLayoutEffect

export function AppShell() {
  const [sekme, setSekme] = useState<Sekme>('ana')
  const [ekran, setEkran] = useState<Ekran | null>(null)
  /** Deneme ekleme/düzenleme, sekmenin üstünde açılan bir alt ekran. */
  const [denemeFormu, setDenemeFormu] = useState<{ duzenlenen: Deneme | null } | null>(null)

  // Ana sayfadaki kısayolların sırası. Kaydı bu katman tutuyor: açılışı ekranlar
  // kendileri bildirseydi aynı olay birkaç yerden düşer, hangi yolun sayıldığı
  // da ekrandan ekrana değişirdi.
  const [sonAraclar, setSonAraclar] = useYerelDepo<string[]>(ANAHTARLAR.sonAraclar, [])
  const [sonOyunlar, setSonOyunlar] = useYerelDepo<string[]>(ANAHTARLAR.sonOyunlar, [])

  /** Bir aracı açar ve kısayol sırasında öne alır. */
  const aracAc = useCallback(
    (acilan: Ekran) => {
      setEkran(acilan)
      setSonAraclar((onceki) => kullanildi(onceki, acilan))
    },
    [setSonAraclar],
  )

  /** Oyun açıldı — Oyunlar sekmesi bildiriyor, banka turu da buraya düşüyor. */
  const oyunAcildi = useCallback(
    (oyun: OyunId) => setSonOyunlar((onceki) => kullanildi(onceki, oyun)),
    [setSonOyunlar],
  )

  const [ayarlarHam, setAyarlar, ayarlarHazir] = useYerelDepo<Ayarlar>(
    ANAHTARLAR.ayarlar,
    VARSAYILAN_AYARLAR,
  )
  const ayarlar = ayarlariNormalize(ayarlarHam)

  const [denemeler, setDenemeler, denemelerHazir] = useYerelDepo<Deneme[]>(
    ANAHTARLAR.denemeler,
    [],
  )
  const [kayitliSablonlar, setSablonlar] = useYerelDepo<Sablon[]>(ANAHTARLAR.sablonlar, [])
  const [okulYillari, setOkulYillari, okulHazir] = useYerelDepo<OkulYili[]>(
    ANAHTARLAR.okulYillari,
    [],
  )
  const [gunlukKayitlar, setGunlukKayitlar, gunlukHazir] = useYerelDepo<GunlukKayit[]>(
    ANAHTARLAR.gunlukKayitlar,
    [],
  )
  const [devamsizlik, setDevamsizlik] = useYerelDepo<Devamsizlik[]>(
    ANAHTARLAR.devamsizlik,
    [],
  )
  const [yanlisSorular, setYanlisSorular] = useYerelDepo<YanlisSoru[]>(
    ANAHTARLAR.yanlisSorular,
    [],
  )
  const [rozetler, setRozetler, rozetlerHazir] = useYerelDepo<KazanilanRozet[]>(
    ANAHTARLAR.rozetler,
    [],
  )
  const [oyunlar, setOyunlar, oyunlarHazir] = useYerelDepo<OyunKayitlari>(
    ANAHTARLAR.oyunlar,
    {},
  )
  const [oyunGecmisi, setOyunGecmisi] = useYerelDepo<OyunTurKaydi[]>(ANAHTARLAR.oyunGecmisi, [])
  const [oyunBankasi, setOyunBankasi] = useYerelDepo<BankaKaydi[]>(ANAHTARLAR.oyunBankasi, [])
  /**
   * Bankadan düşen toplam soru. Düşen kayıt silindiği için sonradan
   * sayılamıyor; rozet buna baktığından ayrı bir sayaç olarak birikiyor.
   */
  const [bankaDusen, setBankaDusen] = useYerelDepo<number>(ANAHTARLAR.bankaDusen, 0)
  const [notlarHam, setNotlar, notlarHazir] = useYerelDepo<NotKagidi[]>(ANAHTARLAR.notlar, [])
  /*
    Tahta günlük ve gün her çizimde yeniden okunuyor.

    Zamanlayıcı kurmak yerine türetmek: gece yarısını bekleyen bir `setTimeout`
    uygulama kapalıyken çalışmaz, uyanan telefonda da geç çalışır. Gün dönmüşse
    kâğıtlar zaten ilk çizimde eleniyor; aşağıdaki etki de kaydı buna eşitliyor.
  */
  const notlar = gununNotlari(notlariNormalize(notlarHam), bugun())
  /*
    Elenen kâğıtlar kayıttan da siliniyor.

    Yalnızca çizimden düşselerdi dünün kâğıtları `localStorage`'da birikir,
    yedeğe girer ve saati geri alan bir cihazda geri gelirdi. `notlarHazir`
    şart: ilk okuma bitmeden yazmak, kayıtta duran kâğıtları boş varsayılanla
    ezerdi.
  */
  useEffect(() => {
    if (!notlarHazir || notlar.length === notlarHam.length) return
    setNotlar(notlar)
  })
  /**
   * Bankadan açılan tur. Oyun kimliği burada duruyor çünkü turu Oyunlar sekmesi
   * çiziyor ama başlatan Oyun Bankası ekranı — ikisi kardeş, ortak sahibi bu.
   */
  const [bankaTuru, setBankaTuru] = useState<OyunId | null>(null)
  /**
   * Bildirilen hatalı sorular. Kuyruk, gönderim ve arayüzün kolu hook'un
   * içinde; buradan yalnızca ayarın açık olup olmadığı geçiyor.
   */
  const hataBildirimi = useHataBildirimi(ayarlar.hataBildirimiAcik)
  /** İzlenmiş haftalık özetlerin hafta başı tarihleri. */
  const [ozetGorulen, setOzetGorulen] = useYerelDepo<string[]>(ANAHTARLAR.ozetGorulen, [])
  const [kutlanan, setKutlanan] = useState<Rozet[]>([])
  /**
   * Açılış ekranı kalktı mı.
   *
   * Ayrı bir "soluyor" adımı yok: ekran kendi çıkışını kendi yapıyor. Son
   * saniyesinde zemin ve yazılar sönüyor, tavşan varış noktasındaki maskotun
   * üstüne süzülüyor; katman kalktığında ekranda zaten yalnızca o maskot
   * duruyor ve altındaki sayfa görünür durumda. Buraya bir de solma eklemek,
   * biten bir geçişin üstüne ikinci bir geçiş koymak olurdu.
   *
   * Ne zaman kalkacağını ekranın kendisi bildiriyor: sayacı animasyon
   * gerçekten başlayınca işlemeye başlıyor ve o anı yalnızca o bileşen
   * biliyor (bkz. acilis.tsx → `useBaslangic`).
   */
  const [acilisBitti, setAcilisBitti] = useState(false)
  /**
   * Kurulum bitince tavşanın başlığa uçuşu. Açılış ekranıyla aynı üç adım:
   * uçuyor → soluyor → yok. Ortadaki adım olmadan katman bir anda kalkıyor ve
   * varış noktasındaki tavşan zıplıyormuş gibi görünüyor.
   */
  const [gecis, setGecis] = useState<'yok' | 'ucuyor' | 'soluyor'>('yok')
  const [hedef, setHedef] = useYerelDepo<Hedef | null>(ANAHTARLAR.hedef, null)
  const [pomodoroAyarHam, setPomodoroAyar] = useYerelDepo<PomodoroAyar>(
    ANAHTARLAR.pomodoroAyar,
    VARSAYILAN_POMODORO,
  )
  // Odak kilidi alanları sonradan eklendi; eski kurulumlarda eksik geliyor.
  const pomodoroAyar = pomodoroAyariniNormalize(pomodoroAyarHam)
  const [pomodoroGecmis, setPomodoroGecmis] = useYerelDepo<PomodoroSeans[]>(
    ANAHTARLAR.pomodoroGecmis,
    [],
  )

  /*
    Memoize edilmesi şart: her çizimde yeni bir dizi dönseydi bu diziye bağlı
    `useMemo`'ların hiçbiri tutmaz, altındaki ağır hesaplar (haftalık özet,
    rozet ölçüleri) her çizimde yeniden çalışırdı.
  */
  const sablonlar = useMemo(() => sablonlariBirlestir(kayitliSablonlar), [kayitliSablonlar])

  // ---- Haftalık özet ----
  // Biten haftanın özeti. Pazar günü doğuyor ve sonraki pazara kadar duruyor:
  // yalnızca pazar gösterilseydi o gün uygulamayı açmayan kullanıcı kaçırırdı.
  const ozetHaftasi = bekleyenOzetHaftasi(bugun())
  const ozet = useMemo(
    () =>
      haftalikOzet({
        haftaBasiIso: ozetHaftasi,
        gunlukKayitlar,
        gunlukHedef: ayarlar.gunlukHedef,
        devamsizlik,
        pomodoroGecmis,
        oyunGecmisi,
        yanlisSorular,
        denemeler,
        sablonlar,
      }),
    [
      ozetHaftasi,
      gunlukKayitlar,
      ayarlar.gunlukHedef,
      devamsizlik,
      pomodoroGecmis,
      oyunGecmisi,
      yanlisSorular,
      denemeler,
      sablonlar,
    ],
  )
  /** Özet henüz izlenmediyse ana sayfada davet kartı çıkar. */
  const ozetBekliyor = !ozet.bosMu && !ozetGorulen.includes(ozetHaftasi)

  const ozetiKapat = useCallback(() => {
    setEkran(null)
    // İzlenen hafta işaretleniyor; liste son sekiz haftayla sınırlı — daha
    // eskisini bilmenin bir faydası yok, davet kartı zaten yalnızca sona bakıyor.
    setOzetGorulen((onceki) =>
      onceki.includes(ozetHaftasi) ? onceki : [...onceki, ozetHaftasi].slice(-8),
    )
  }, [ozetHaftasi, setOzetGorulen])

  // Hedef kartı ve ana sayfa, en yeni denemelerden çıkan tahmini gösteriyor.
  const tahmin = guncelTahmin(denemeler, sablonlar, okulYillari, ayarlar.puanTuru, ayarlar.elleObp)
  const guncelSiralama = tahmin?.siralama.enKotu ?? null
  const diplomaNotu = obpHesapla(okulYillari, ayarlar.elleObp)?.diplomaNotu ?? null

  // ---- Açılış ekranı ----
  const acilisiKapat = useCallback(() => setAcilisBitti(true), [])

  useEffect(() => {
    if (gecis !== 'ucuyor') return
    const solma = setTimeout(() => setGecis('soluyor'), GECIS_SURESI)
    return () => clearTimeout(solma)
  }, [gecis])

  useEffect(() => {
    if (gecis !== 'soluyor') return
    const kaldirma = setTimeout(() => setGecis('yok'), 320)
    return () => clearTimeout(kaldirma)
  }, [gecis])

  // Açılış ekranı `fixed`: kendisi kaydırılmıyor ama parmak hareketi altındaki
  // sayfaya geçiyordu ve ekran kalkınca ana sayfa ortasından başlıyordu.
  // Ekran görünürken gövde kilitleniyor, kalkarken sayfa başa alınıyor.
  const acilisGorunur = !acilisBitti
  useEffect(() => {
    if (!acilisGorunur) return
    const oncekiTasma = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = oncekiTasma
      window.scrollTo(0, 0)
    }
  }, [acilisGorunur])

  // Eylülde yeni ders yılı başlayınca kullanıcı bir üst sınıfa kendiliğinden geçer.
  useEffect(() => {
    if (!ayarlarHazir || !ayarlarHam.kurulumTamamlandi) return
    const buYil = egitimYili()
    const yeniSinif = ilerlemisSinif(ayarlarHam.buYilSinif, ayarlarHam.sinifYili, buYil)
    if (yeniSinif !== ayarlarHam.buYilSinif || buYil !== ayarlarHam.sinifYili) {
      setAyarlar((o) => ({ ...o, buYilSinif: yeniSinif, sinifYili: buYil }))
    }
  }, [
    ayarlarHazir,
    ayarlarHam.kurulumTamamlandi,
    ayarlarHam.buYilSinif,
    ayarlarHam.sinifYili,
    setAyarlar,
  ])

  // ---- Rozetler ----
  const ilerleme = useMemo(
    () =>
      rozetDurumu({
        denemeler,
        sablonlar,
        gunlukKayitlar,
        gunlukHedef: ayarlar.gunlukHedef,
        diplomaNotu,
        pomodoroGecmis,
        yanlisSorular,
        oyunlar,
        bankaDusen,
        bankaBoyutu: oyunBankasi.length,
      }),
    [
      denemeler,
      sablonlar,
      gunlukKayitlar,
      ayarlar.gunlukHedef,
      diplomaNotu,
      pomodoroGecmis,
      yanlisSorular,
      oyunlar,
      bankaDusen,
      oyunBankasi.length,
    ],
  )

  /** Bankadan soru düştü: rozetin baktığı toplam sayaç ilerliyor. */
  const bankadanDustu = useCallback(
    (adet: number) => {
      setBankaDusen(bankaDusen + adet)
    },
    [bankaDusen, setBankaDusen],
  )

  // Kayıt yazılmadan önce hepsinin okunmuş olması şart. `useYerelDepo` bir kez
  // yazıldıktan sonra ilk okumayı atlıyor; hazır olmadan yazılsaydı kayıtlı
  // rozetler silinirdi.
  const ilerlemeHazir =
    rozetlerHazir &&
    denemelerHazir &&
    gunlukHazir &&
    okulHazir &&
    ayarlarHazir &&
    oyunlarHazir

  useEffect(() => {
    if (!ilerlemeHazir) return

    // Kontrol bilerek geciktiriliyor. Soru sayısı yazılırken her tuş bir
    // değişiklik: "420" yazarken 4 → 42 → 420 geçilir ve kutlama daha alan
    // doldurulmadan ekranı kapatırdı. Yazma durunca bir kez çalışıyor.
    const zamanlayici = setTimeout(() => {
      const yeniler = yeniRozetler(ilerleme, rozetler)
      if (yeniler.length > 0) {
        const tarih = bugun()
        setRozetler((onceki) => [...onceki, ...yeniler.map((r) => ({ rozetId: r.id, tarih }))])
        setKutlanan(yeniler)
      }
    }, ROZET_BEKLEME)

    return () => clearTimeout(zamanlayici)
  }, [ilerlemeHazir, ilerleme, rozetler, setRozetler])

  // ---- Günlük hatırlatma ----
  // Her açılışta ve veri değiştikçe yeniden planlanır: bugün soru girildiyse
  // bekleyen bildirim silinip yarına kayar. "Günde en fazla bir bildirim"
  // kuralı, tek bir bildirimin sürekli yeniden planlanmasından geliyor.
  useEffect(() => {
    if (!ayarlarHazir || !gunlukHazir || !ayarlar.kurulumTamamlandi) return
    if (!ayarlar.bildirimAcik) {
      void hatirlatmaIptal()
      return
    }
    void hatirlatmaPlanla({
      saat: ayarlar.hatirlatmaSaati,
      dakika: ayarlar.hatirlatmaDakikasi,
      bugunGirdiVar: gunlukToplam(gunlukKayitlar, bugun()) > 0,
    })
  }, [
    ayarlarHazir,
    gunlukHazir,
    ayarlar.kurulumTamamlandi,
    ayarlar.bildirimAcik,
    ayarlar.hatirlatmaSaati,
    ayarlar.hatirlatmaDakikasi,
    gunlukKayitlar,
  ])

  /*
    Ekran değişince sayfa başa döner.

    Tarayıcı kaydırma konumunu **belgede** tutuyor; sekmeler ayrı sayfalar
    değil, aynı belgenin farklı içeriği. Uzun bir ekranın (Ayarlar, Oyunlar)
    dibindeyken başka bir sekmeye geçince yeni ekran da dibinden açılıyordu —
    kısa bir ekransa doğrudan boşluğa.
  */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [sekme, ekran, denemeFormu, bankaTuru])

  const geriGit = useCallback(() => {
    // En içteki katmandan dışa doğru: ekranın kendi açtığı katman (fotoğraf
    // görüntüleyici, onay kutusu) → form → alt ekran → ana sekme → çıkış.
    if (ustKatmaniKapat()) return true
    // Banka turu tam ekran bir katman; geri tuşu önce onu kapatmalı, yoksa
    // tur açıkken geri basmak arkadaki sekmeyi değiştirirdi.
    if (bankaTuru !== null) {
      setBankaTuru(null)
      return true
    }
    if (denemeFormu !== null) {
      setDenemeFormu(null)
      return true
    }
    if (ekran !== null) {
      setEkran(null)
      return true
    }
    if (sekme !== 'ana') {
      setSekme('ana')
      return true
    }
    return false
  }, [bankaTuru, denemeFormu, ekran, sekme])

  /**
   * Açılışta kapanmış bir turdan artakalanları temizler.
   *
   * Pomodoro sayacı bilerek hiçbir yere yazılmıyor: uygulama kapatıldığında tur
   * da biter. Ama sayaçtan geriye kalan iki şey uygulamadan bağımsız yaşıyor —
   * bekleyen seans bildirimi ve odak kilidinin servisi. Yerli taraf bunları
   * kapanış anında kaldırıyor; kaldıramadığı durum (uygulama zorla durdurulmuş,
   * telefon yeniden başlamış) için burası ikinci süzgeç: uygulama yeni açıldığına
   * göre ortada çalışan bir tur yoktur.
   */
  useEffect(() => {
    void pomodoroIptal()
    void odakKilidiniBitir()
  }, [])

  /*
    Ekran değişince sayfa başa dönüyor.

    Kaydırılan şey pencerenin kendisi ve ekranlar aynı kökün içinde yer
    değiştiriyor: tarayıcı kaydırma konumunu koruduğu için ana sayfanın
    dibindeyken açılan sekme de dibinden açılıyordu.
  */
  const formAcik = denemeFormu !== null
  useYerlesimEtkisi(() => {
    window.scrollTo(0, 0)
  }, [sekme, ekran, formAcik])

  // Android donanım geri tuşu
  useEffect(() => {
    const dinleyici = CapacitorApp.addListener('backButton', () => {
      if (!geriGit()) void CapacitorApp.exitApp()
    })
    return () => {
      void dinleyici.then((d) => d.remove())
    }
  }, [geriGit])

  const denemeKaydet = useCallback(
    (deneme: Deneme) => {
      setDenemeler((onceki) => {
        const varMi = onceki.some((d) => d.id === deneme.id)
        return varMi ? onceki.map((d) => (d.id === deneme.id ? deneme : d)) : [...onceki, deneme]
      })
      setDenemeFormu(null)
    },
    [setDenemeler],
  )

  /**
   * Açılış katmanı.
   *
   * Aşağıdaki dallar `icerik` değişkenine yazılıyor, ayrı ayrı `return`
   * edilmiyor: açılış katmanı her dalda yeniden yazılsaydı React onu ayrı
   * konumdaki ayrı bir öğe sayar, veri hazır olur olmaz söküp yeniden takar ve
   * **CSS animasyonu baştan başlardı** — tavşan bir iniyor, sonra yukarı
   * kaçıp bir daha iniyordu. Tek bir kökün altında sabit sırada durunca
   * animasyon kesintisiz akıyor.
   */
  // Varış noktası burada seçilmiyor: ekranda tek bir maskot yuvası var (ilk
  // açılışta kurulum sihirbazının tepesindeki, sonrasında ana sayfa
  // başlığındaki) ve açılış onu bulup mesafeyi kendi ölçüyor.
  const acilisKatmani = acilisGorunur ? <Acilis onBitti={acilisiKapat} /> : null

  /**
   * Uçan tavşanın konacağı maskot bu sırada gizli: açılışta ve kurulum
   * geçişinde varış noktasında zaten bir tavşan duruyor ve ikisi üst üste
   * biniyordu. Uçuş bitip katman solmaya başlayınca gizlilik kalkıyor —
   * ikisi tam olarak aynı yerde olduğu için değişim görünmüyor.
   */
  const maskotGizli = acilisGorunur || gecis === 'ucuyor'

  // Veri okunmadan ekran çizilirse "kayıt yok" bir an yanıp söner.
  const icerik = !ayarlarHazir ? (
    <div className="min-h-dvh" aria-busy="true" />
  ) : !ayarlar.kurulumTamamlandi ? (
    <Kurulum
      maskotGizli={maskotGizli}
      onBitir={({ ayarlar: secimler, okulYillari: girilenler }) => {
        setAyarlar((o) => ({
          ...ayarlariNormalize(o),
          ...secimler,
          sinifYili: egitimYili(),
          kurulumTamamlandi: true,
        }))
        // Mezun kurulumda yıl sonu notlarını girmiş olabilir; atladıysa
        // liste boş geliyor ve kayıtlı veriye dokunulmuyor.
        if (girilenler.length > 0) setOkulYillari(girilenler)
        // Kurulum ekranı bu karede kalkıyor; tavşan yerine uçarak gidiyor.
        setGecis('ucuyor')
      }}
    />
  ) : denemeFormu !== null ? (
    <div className="mx-auto min-h-dvh max-w-md px-4 pt-[calc(1.25rem+var(--guvenli-ust))] pb-[calc(2rem+var(--guvenli-alt))]">
      <YeniDenemeEkrani
        sablonlar={sablonlar}
        varsayilanSablonId={ayarlar.varsayilanSablonId}
        duzenlenen={denemeFormu.duzenlenen}
        denemeSayisi={denemeler.length}
        onKaydet={denemeKaydet}
        onVazgec={() => setDenemeFormu(null)}
      />
    </div>
  ) : (
  /*
    Kök `div`de giriş animasyonu **yok** ve olmamalı.

    `.acilis-girisi` içinde `transform` var; animasyon bittikten sonra bile
    hesaplanan değer `none` değil **birim matris** olarak kalıyor ve transformlu
    bir öğe, içindeki `position: fixed` katmanların *kapsayıcı bloğu* olur.
    Sonuç: alt menü, oyun katmanı ve haftalık özet ekrana değil bu `div`e göre
    konumlanıyordu. `min-h-dvh` içerikle birlikte büyüdüğü için alt menü,
    sayfanın en üstündeyken ekranın altından taşıyor ve yarısı görünmez oluyordu.

    Açılıştaki yumuşak geçişi artık `components/acilis.tsx` hallediyor.
  */
    <div className="mx-auto min-h-dvh max-w-md px-4 pt-[calc(1.25rem+var(--guvenli-ust))] pb-[calc(6rem+var(--guvenli-alt))]">
      {/* Haftalık özet bir ekran değil, tam ekran bir katman: kendi kapatma
          düğmesi var ve "Geri" çubuğu kartların üstünde durmamalı. */}
      {ekran !== null && ekran !== 'haftalik-ozet' ? (
        <>
          <Buton
            bicim="hayalet"
            boy="kucuk"
            onClick={() => setEkran(null)}
            className="-ml-2 mb-3"
          >
            <ArrowLeft size={16} aria-hidden /> Geri
          </Buton>

          {ekran === 'okul' && (
            <OkulEkrani
              yillar={okulYillari}
              setYillar={setOkulYillari}
              setAyarlar={setAyarlar}
              ayarlar={ayarlar}
              hazir={okulHazir}
            />
          )}
          {ekran === 'siralama' && (
            <SiralamaEkrani
              denemeler={denemeler}
              sablonlar={sablonlar}
              okulYillari={okulYillari}
              ayarlar={ayarlar}
            />
          )}
          {ekran === 'hedef' && (
            <HedefEkrani
              hedef={hedef}
              setHedef={setHedef}
              varsayilanTur={ayarlar.puanTuru}
              guncelSiralama={guncelSiralama}
            />
          )}
          {ekran === 'yanlis-banka' && (
            <YanlisBankaEkrani sorular={yanlisSorular} setSorular={setYanlisSorular} />
          )}
          {ekran === 'oyun-bankasi' && (
            <OyunBankasiEkrani
              banka={oyunBankasi}
              bildir={hataBildirimi}
              /*
                Elle kaldırma `bankadanDustu`'ya uğramıyor: sayaç, soruyu üst
                üste üç kez doğru bilmenin karşılığı ve rozet ona bakıyor. Tuşa
                basmakla artan bir sayaç ölçtüğü şeyi ölçmez olurdu.
              */
              onKaldir={(id) => setOyunBankasi((o) => o.filter((k) => k.id !== id))}
              onTurBaslat={(oyun) => {
                // Turu Oyunlar sekmesi çiziyor; oyun katmanı tam ekran açıldığı
                // için arkada hangi sekmenin durduğu görünmüyor, ama turdan
                // çıkınca kullanıcı oyunların yanında kalmalı.
                setBankaTuru(oyun)
                setEkran(null)
                setSekme('oyunlar')
              }}
            />
          )}
          {ekran === 'pomodoro' && (
            <PomodoroEkrani
              ayar={pomodoroAyar}
              setAyar={setPomodoroAyar}
              onSeansBitti={(seans) => setPomodoroGecmis((o) => [...o, seans])}
            />
          )}
          {ekran === 'notlar' && <YapilacaklarEkrani notlar={notlar} setNotlar={setNotlar} />}
          {ekran === 'soru' && (
            <SoruTakibiEkrani
              kayitlar={gunlukKayitlar}
              setKayitlar={setGunlukKayitlar}
              ayarlar={ayarlar}
            />
          )}
          {ekran === 'deneme' && (
            <DenemelerEkrani
              denemeler={denemeler}
              sablonlar={sablonlar}
              hazir={denemelerHazir}
              onSil={(id) => setDenemeler((onceki) => onceki.filter((d) => d.id !== id))}
              onDuzenle={(deneme) => setDenemeFormu({ duzenlenen: deneme })}
              onYeniyeGit={() => setDenemeFormu({ duzenlenen: null })}
            />
          )}
          {ekran === 'rozetler' && (
            <RozetlerEkrani
              denemeler={denemeler}
              sablonlar={sablonlar}
              gunlukKayitlar={gunlukKayitlar}
              gunlukHedef={ayarlar.gunlukHedef}
              diplomaNotu={diplomaNotu}
              pomodoroGecmis={pomodoroGecmis}
              yanlisSorular={yanlisSorular}
              oyunlar={oyunlar}
              bankaDusen={bankaDusen}
              bankaBoyutu={oyunBankasi.length}
              kazanilmis={rozetler}
            />
          )}
          {ekran === 'devamsizlik' && (
            <DevamsizlikEkrani kayitlar={devamsizlik} setKayitlar={setDevamsizlik} />
          )}
          {ekran === 'istatistik' && (
            <IstatistikEkrani
              denemeler={denemeler}
              sablonlar={sablonlar}
              varsayilanSablonId={ayarlar.varsayilanSablonId}
            />
          )}
        </>
      ) : (
        <>
          {sekme === 'ana' && (
            <AnaSayfa
              maskotGizli={maskotGizli}
              ayarlar={ayarlar}
              gunlukKayitlar={gunlukKayitlar}
              devamsizlik={devamsizlik}
              hedef={hedef}
              guncelSiralama={guncelSiralama}
              ozetBekliyor={ozetBekliyor}
              sonAraclar={sonAraclar}
              sonOyunlar={sonOyunlar}
              onKartAc={aracAc}
              onDahaGit={() => setSekme('daha')}
              onOyunlaraGit={() => setSekme('oyunlar')}
              acilisSuruyor={!acilisBitti}
            />
          )}
          {sekme === 'oyunlar' && (
            <OyunlarEkrani
              kayitlar={oyunlar}
              setKayitlar={setOyunlar}
              setGecmis={setOyunGecmisi}
              banka={oyunBankasi}
              onBankadanDustu={bankadanDustu}
              setBanka={setOyunBankasi}
              sesAcik={ayarlar.oyunSesi}
              muzikAcik={ayarlar.oyunMuzigi}
              muzikTuru={ayarlar.oyunMuzikTuru}
              onBankayaGit={() => setEkran('oyun-bankasi')}
              bankaTuru={bankaTuru}
              onBankaTuruBitti={() => setBankaTuru(null)}
              onOyunAcildi={oyunAcildi}
              bildir={hataBildirimi}
            />
          )}
          {sekme === 'daha' && <KartMenusu onKartAc={aracAc} />}
          {sekme === 'ayarlar' && (
            <AyarlarEkrani
              sablonlar={sablonlar}
              kayitliSablonlar={kayitliSablonlar}
              setKayitliSablonlar={setSablonlar}
              ayarlar={ayarlar}
              setAyarlar={setAyarlar}
              bekleyenBildirim={bekleyenSayisi(hataBildirimi.bildirimler)}
              bildirimIzni={hataBildirimi.izin}
              onBildirimIzni={hataBildirimi.onIzin}
              pomodoroAyar={pomodoroAyar}
              setPomodoroAyar={setPomodoroAyar}
              yedeklenecek={{
                denemeler,
                okulYillari,
                gunlukKayitlar,
                devamsizlik,
                yanlisSorular,
                rozetler,
                oyunlar,
                oyunGecmisi,
                oyunBankasi,
                bankaDusen,
                notlar,
                pomodoroGecmis,
                pomodoroAyar,
                hedef,
              }}
            />
          )}
        </>
      )}

      <BottomNav
        sekme={sekme}
        onDegis={(yeni) => {
          setEkran(null)
          setSekme(yeni)
        }}
      />

      {ekran === 'haftalik-ozet' && (
        <HaftalikOzetEkrani ozet={ozet} sesAcik={ayarlar.oyunSesi} onKapat={ozetiKapat} />
      )}

      <RozetKutlama rozetler={kutlanan} onKapat={() => setKutlanan([])} />
    </div>
  )

  return (
    <>
      {icerik}
      {acilisKatmani}
      {gecis !== 'yok' && <MaskotGecisi soluyor={gecis === 'soluyor'} />}
    </>
  )
}
