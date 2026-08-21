'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { Acilis, ACILIS_SURESI } from '@/components/acilis'
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
import { MagazaEkrani } from '@/components/ekranlar/magaza'
import {
  BASLANGIC_HAVUCU,
  BOS_MAGAZA,
  magazayiNormalize,
  type MagazaDurumu,
} from '@/lib/magaza/magaza'
import { BOS_STOK, stoguNormalize, type JokerStogu } from '@/lib/magaza/jokerler'
import { OyunlarEkrani } from '@/components/ekranlar/oyunlar'
import { OyunBankasiEkrani } from '@/components/ekranlar/oyun-bankasi'
import { RozetKutlama } from '@/components/rozet-kutlama'

/** Rozet kontrolünün, veri durulana kadar beklediği süre (ms). */
const ROZET_BEKLEME = 1200

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
  /**
   * Havuç bakiyesi ve mağaza koleksiyonu.
   *
   * Kayıt güncel katalogla uyumlanıyor (`magazayiNormalize`): katalogdan
   * kalkmış bir eşya kayıtta kalırsa avatar çizilirken patlar.
   */
  const [havuc, setHavuc] = useYerelDepo<number>(ANAHTARLAR.havuc, BASLANGIC_HAVUCU)
  const [magazaHam, setMagaza] = useYerelDepo<MagazaDurumu>(ANAHTARLAR.magaza, BOS_MAGAZA)
  const magaza = magazayiNormalize(magazaHam)
  /** Joker çantası. Kozmetikten ayrı tutuluyor: bunlar tükenen sarf malzemesi. */
  const [stokHam, setStok] = useYerelDepo<JokerStogu>(ANAHTARLAR.jokerler, BOS_STOK)
  const jokerler = stoguNormalize(stokHam)
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
   * Açılış ekranının hâli. Üç adım: görünür → soluyor → kaldırıldı. Ortadaki
   * adım olmadan ekran bir anda kayboluyor ve sistem açılış ekranından gelen
   * yumuşak geçiş bozuluyordu.
   */
  const [acilis, setAcilis] = useState<'acik' | 'kapaniyor' | 'bitti'>('acik')
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

  const sablonlar = sablonlariBirlestir(kayitliSablonlar)

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
  // Süre veri okumasına bağlanmadı: localStorage neredeyse anında dönüyor,
  // bağlansaydı ekran bir kare görünüp kaybolur ve animasyon hiç izlenmezdi.
  useEffect(() => {
    const solma = setTimeout(() => setAcilis('kapaniyor'), ACILIS_SURESI)
    const kaldirma = setTimeout(() => setAcilis('bitti'), ACILIS_SURESI + 320)
    return () => {
      clearTimeout(solma)
      clearTimeout(kaldirma)
    }
  }, [])

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
  // Kazanılanlar yazılmadan önce hepsinin okunmuş olması şart. `useYerelDepo`
  // bir kez yazıldıktan sonra ilk okumayı atlıyor; hazır olmadan rozet
  // eklenseydi kayıtlı rozetler silinir, kutlama her açılışta tekrarlanırdı.
  const rozetVerisiHazir =
    rozetlerHazir && denemelerHazir && gunlukHazir && okulHazir && ayarlarHazir && oyunlarHazir

  useEffect(() => {
    if (!rozetVerisiHazir) return

    // Kontrol bilerek geciktiriliyor. Soru sayısı yazılırken her tuş bir
    // değişiklik: "420" yazarken 4 → 42 → 420 geçilir ve kutlama daha alan
    // doldurulmadan ekranı kapatırdı. Yazma durunca bir kez çalışıyor.
    const zamanlayici = setTimeout(() => {
      const durum = rozetDurumu({
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
      })
      const yeniler = yeniRozetler(durum, rozetler)
      if (yeniler.length === 0) return

      const tarih = bugun()
      setRozetler((onceki) => [...onceki, ...yeniler.map((r) => ({ rozetId: r.id, tarih }))])
      setKutlanan(yeniler)
    }, ROZET_BEKLEME)

    return () => clearTimeout(zamanlayici)
  }, [
    rozetVerisiHazir,
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
    rozetler,
    setRozetler,
  ])

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

  // Açılış ekranı bütün dönüşlerin üstünde duruyor: kurulum sihirbazı ve veri
  // beklenirken gösterilen boş ekran da onun altında kalmalı.
  const acilisKatmani =
    acilis === 'bitti' ? null : <Acilis kapaniyor={acilis === 'kapaniyor'} />

  // Veri okunmadan ekran çizilirse "kayıt yok" bir an yanıp söner.
  if (!ayarlarHazir) {
    return (
      <>
        <div className="min-h-dvh" aria-busy="true" />
        {acilisKatmani}
      </>
    )
  }

  if (!ayarlar.kurulumTamamlandi) {
    return (
      <>
        <Kurulum
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
          }}
        />
        {acilisKatmani}
      </>
    )
  }

  if (denemeFormu !== null) {
    return (
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
    )
  }

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
  return (
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
          {ekran === 'magaza' && (
            <MagazaEkrani
              havuc={havuc}
              setHavuc={setHavuc}
              durum={magaza}
              setDurum={setMagaza}
              stok={jokerler}
              setStok={setStok}
            />
          )}
          {ekran === 'oyun-bankasi' && (
            <OyunBankasiEkrani
              banka={oyunBankasi}
              bildir={hataBildirimi}
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
            />
          )}
          {sekme === 'oyunlar' && (
            <OyunlarEkrani
              kayitlar={oyunlar}
              setKayitlar={setOyunlar}
              setGecmis={setOyunGecmisi}
              banka={oyunBankasi}
              onBankadanDustu={(adet) => setBankaDusen((onceki) => onceki + adet)}
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
                havuc,
                magaza,
                jokerler,
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

      {acilisKatmani}
    </div>
  )
}
