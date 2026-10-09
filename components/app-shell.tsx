'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
import { eskiNoktalamayiTasi, testiIsle, type BankaKaydi, type BankaTuru } from '@/lib/oyunlar/banka'
import {
  genelTestBittiMi,
  genelTestIlerlet,
  genelTestKur,
  genelTestOyunu,
  type GenelTest,
} from '@/lib/oyunlar/genel-test'
import type { DersId } from '@/lib/oyunlar/tanim'
import { sablonlariBirlestir } from '@/lib/sablonlar'
import { seviyeDersleriniKaydet } from '@/lib/seviye-tespit'
import { guncelTahmin, obpHesapla } from '@/lib/tahmin'
import { egitimYili, gunlukToplam, ilerlemisSinif } from '@/lib/hesap'
import { androidMu, iosMu } from '@/lib/platform'
import { ekranGoruntusuKaydet, geriGecisi, useGeriKaydirma } from '@/lib/geri-kaydirma'
import { bildirilecekler, rozetDurumu, yeniRozetler, type Rozet } from '@/lib/rozetler'
import {
  bildirimDokunusunuDinle,
  gorevBildirimleriniEsitle,
  gorevIzniIste,
  hatirlatmaIptal,
  hatirlatmaPlanla,
  pomodoroIptal,
} from '@/lib/bildirim'
import { odakKilidiniBitir } from '@/lib/odak-kilidi'
import type { SoruGecmisi } from '@/lib/oyunlar/gecmis'
import { bekleyenSayisi } from '@/lib/hata-bildirimi'
import { useHataBildirimi } from '@/lib/hata-kuyrugu'
import { useGeriBildirim } from '@/lib/geri-bildirim-kolu'
import { useCokmeRaporu } from '@/lib/cokme-izni'
import { CokmeSorusu } from '@/components/cokme-sorusu'
import { cokmeTanitimKarari } from '@/lib/cokme-tanitim'
import { useGuncelleme } from '@/lib/guncelleme-kolu'
import { GuncellemeSeridi } from '@/components/guncelleme-seridi'
import { bugun, cn, gunKaydir, yeniId } from '@/lib/utils'
import type { Ekran, Sekme } from '@/lib/gezinme'
import { haritaSinifiBul, programBul, type HaritaSinifi, type KonuDersId } from '@/lib/konu'
import type { BilinmeyenKart, KonuIlerlemeleri } from '@/lib/konu/ilerleme'
import { kullanildi } from '@/lib/son-kullanilan'
import { useBugun, useUygulamaGorunur } from '@/lib/gorunurluk'
import { katmanVarMi, tumKatmanlariKapat, ustKatmaniKapat } from '@/lib/geri'
import { Acilis, GECIS_SOLMA_SURESI, GECIS_SURESI, KurulumGecisi } from '@/components/acilis'
import { Buton } from '@/components/ui'
import { BottomNav } from '@/components/bottom-nav'
import { Kurulum } from '@/components/kurulum'
import { AnaSayfa } from '@/components/ekranlar/ana-sayfa'
import { KartMenusu } from '@/components/ekranlar/kart-menusu'
import { DenemelerEkrani } from '@/components/ekranlar/denemeler'
import { YeniDenemeEkrani } from '@/components/ekranlar/yeni-deneme'
import { IstatistikEkrani } from '@/components/ekranlar/istatistik'
import { YasalEkrani } from '@/components/ekranlar/yasal'
import { GeriBildirimEkrani } from '@/components/ekranlar/geri-bildirim'
import { OkulEkrani } from '@/components/ekranlar/okul'
import { AyarlarEkrani } from '@/components/ekranlar/ayarlar'
import { SoruTakibiEkrani } from '@/components/ekranlar/soru-takibi'
import { DevamsizlikEkrani } from '@/components/ekranlar/devamsizlik'
import { PomodoroEkrani, type PomodoroDurumu } from '@/components/ekranlar/pomodoro'
import { PomodoroSaati } from '@/components/pomodoro-saati'
import { SiralamaEkrani } from '@/components/ekranlar/siralama'
import { HedefEkrani } from '@/components/ekranlar/hedef'
import { YanlisBankaEkrani } from '@/components/ekranlar/yanlis-banka'
import { RozetlerEkrani } from '@/components/ekranlar/rozetler'
import { gorevleriNormalize, gorevleriTarihtenItibaren, type Gorev } from '@/lib/yapilacaklar'
import { OyunlarEkrani } from '@/components/ekranlar/oyunlar'
import { OyunBankasiEkrani } from '@/components/ekranlar/oyun-bankasi'
import { KonuHaritasiEkrani } from '@/components/ekranlar/konu-haritasi'
import { KonuTakibiEkrani } from '@/components/ekranlar/konu-takibi'
import { BOS_TAKIP, takibiCoz, type YksTakip } from '@/lib/konu-takibi/kayit'
import { YapilacaklarEkrani } from '@/components/ekranlar/yapilacaklar'
import { AylikOzetEkrani } from '@/components/ekranlar/aylik-ozet'
import { okumaSeansiEkle, type OkumaSeansi } from '@/lib/konu/okuma-suresi'
import {
  arsivdeEksikAylar,
  aylikOzet,
  bekleyenOzetAyi,
  ozetGosterilebilirMi,
  sonrakiOzetGunu,
  type AylikOzetArsivi,
} from '@/lib/ozet'
import { bugunKonuBittiMi, gorevlerBittiMi } from '@/lib/ana-maskot'
import { RozetBildirimi } from '@/components/rozet-bildirimi'
import { DENEME_FORMU_ADIMLARI, DENEME_VAZGEC, GOREV_VAZGEC, HARITA_TUR_ADIMLARI, gorevFormuTurdaAcik, gorevMenusuTurdaAcik, miniTurSec, tanitimKonumu } from '@/lib/tanitim'
import { demoDenemeleri, istatistikTuruDenemeleri, tanitimKaydiMi, tanitimKayitlariniAyikla, tanitimKimligi, turIstatistikDenemeleri } from '@/lib/tanitim-veri'
import { tanitimGeriKarari } from '@/lib/tanitim-rehber'
import { taniKaydet } from '@/lib/tanitim-tani'
import { TanitimSaglayici, useTanitim } from '@/components/tanitim/tanitim-baglami'
import { SpotIsigi } from '@/components/tanitim/spot-isigi'
import { TanitimSorusu } from '@/components/tanitim/tanitim-sorusu'
import { DemoOyun, DemoOyunKarti } from '@/components/tanitim/demo-oyun'

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
  return <TanitimSaglayici><RabiUygulamasi /></TanitimSaglayici>
}


function RabiUygulamasi() {
  const tanitim = useTanitim()
  /** Başlangıç turu sürüyor: araç ekranları gerçek kayıtlar yerine turun listelerini çiziyor. */
  const anaTurda = tanitim.aktifTur === 'ana_tur'
  // Açılış teşhisi (app/layout.tsx'teki satır içi betik) bu işareti bekliyor:
  // React buraya kadar gelemezse 8 saniye sonra beyaz ekran yerine hata
  // panelini gösteriyor. İlk boyamada koyuluyor; sonrası betiği ilgilendirmiyor.
  useEffect(() => {
    document.documentElement.dataset.rabiAcildi = '1'
  }, [])

  /*
    Günün kendisi state: gün dönünce yeniden çizim geliyor. Güne bağlı
    türetmeler (bekleyen özet ayı, haftanın görevleri, hatırlatma planı)
    buna bakıyor; `bugun()`i doğrudan çağırsalardı arka planda gece yarısını
    geçiren uygulamada dünkü değerde kalırlardı (bkz. `useBugun`).
  */
  const bugunIso = useBugun()

  const [sekme, setSekme] = useState<Sekme>('ana')
  const [ekran, setEkran] = useState<Ekran | null>(null)

  /*
    Pomodoro ekrandan çıkınca sürüyor.

    Tur bir süre Pomodoro ekranından çıkınca bitiyordu: bileşen ekranla
    birlikte sökülüyor, sayaç, bildirim ve odak kilidi onunla gidiyordu;
    sahnenin geri oku da turu duraklatıyordu. Kullanıcı Android'deki gibi
    turun sürmesini ve sayacın sağ altta bir saat olarak görünmesini istedi.

    Bileşen bu yüzden ekranın içinde değil burada, kökte kuruluyor ve ekran
    değişince sökülmüyor (`pomodoroTakili`). Çizildiği yer sabit, ayrık bir
    `div` (`pomodoroKalici`, portalın kabı) ve o div ekran açıkken sayfanın
    içindeki yuvaya taşınıyor (`pomodoroYuvasi`). Portalın kabı hiç
    değişmemeli: React kabı değişen portalı söküp yeniden kurar — tam da
    kaçınılan şey. Deneme formu gibi bütün sayfa ağacını değiştiren bir ekran
    yuvayı söktüğünde kap yalnızca DOM'dan düşüyor, bileşen yaşıyor.
  */
  const [pomodoroDurumu, setPomodoroDurumu] = useState<PomodoroDurumu | null>(null)
  const [pomodoroKalici, setPomodoroKalici] = useState<HTMLDivElement | null>(null)
  const [pomodoroYuvasi, setPomodoroYuvasi] = useState<HTMLDivElement | null>(null)
  // Sunucuda `document` yok; kap ilk çizimden sonra kuruluyor.
  useEffect(() => setPomodoroKalici(document.createElement('div')), [])
  useLayoutEffect(() => {
    if (pomodoroYuvasi && pomodoroKalici && pomodoroKalici.parentElement !== pomodoroYuvasi) {
      pomodoroYuvasi.appendChild(pomodoroKalici)
    }
  }, [pomodoroYuvasi, pomodoroKalici])
  /** Deneme ekleme/düzenleme, sekmenin üstünde açılan bir alt ekran. */
  const [denemeFormu, setDenemeFormu] = useState<{ duzenlenen: Deneme | null } | null>(null)

  // Ana sayfadaki kısayolların sırası. Kaydı bu katman tutuyor: açılışı ekranlar
  // kendileri bildirseydi aynı olay birkaç yerden düşer, hangi yolun sayıldığı
  // da ekrandan ekrana değişirdi.
  const [sonAraclar, setSonAraclar] = useYerelDepo<string[]>(ANAHTARLAR.sonAraclar, [])
  const [sonOyunlar, setSonOyunlar] = useYerelDepo<string[]>(ANAHTARLAR.sonOyunlar, [])
  /** Ana sayfadan seçilen ders — Oyunlar sekmesi açılırken onun ızgarasına giriyor. */
  const [acilacakDers, setAcilacakDers] = useState<DersId | null>(null)
  /*
    Ders kutucuğundan açılan ders. Oyunlar turunun demo adımlarında
    `OyunlarEkrani` yerine `DemoOyun` çiziliyor ve ekranın seçili dersi
    kayboluyordu; tur bitince ders buradan yeniden açılıyor.
  */
  const oyunlarDersiRef = useRef<DersId | null>(null)

  /**
   * Yapılacaklar'dan "Pomodoro ile başlat" isteği. Pomodoro ekranı açıkken
   * duruyor (ekran onu kimliğiyle bir kez işliyor); ekrandan çıkılınca
   * siliniyor. Pomodoro'nun ilk açılış turu da bu sırada başlamıyor — kullanıcı
   * sayacı başlatmak için geldi, tanıtım için değil.
   */
  const [pomodoroIstegi, setPomodoroIstegi] = useState<{ kimlik: string; dakika: number | null } | null>(null)
  useEffect(() => {
    if (ekran !== 'pomodoro') setPomodoroIstegi(null)
  }, [ekran])

  /** Bir aracı açar ve kısayol sırasında öne alır. */
  const aracAc = useCallback(
    (acilan: Ekran) => {
      if (tanitim.tanitimdaMi) {
        // Araçlar'daki satırların hedefi `arac-<ekran>`; tur hangi satırı beklemiyorsa geçiş yok sayılıyor.
        tanitim.gonder({ tur: 'hedefe-dokun', hedef: `arac-${acilan}` })
        return
      }
      setEkran(acilan)
      setSonAraclar((onceki) => kullanildi(onceki, acilan))
    },
    [setSonAraclar, tanitim.tanitimdaMi, tanitim.gonder],
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
  const [soruGecmisi, setSoruGecmisi] = useYerelDepo<SoruGecmisi>(ANAHTARLAR.soruGecmisi, {})
  /*
    Aylık özetin takvimi.

    `kurulumTarihi` uygulamanın ilk açıldığı gün (arşiv oradan başlıyor),
    `ozetGorulen` izlenmiş ayların listesi, `aylikOzetler` kapanmış ayların
    hesaplanmış özetleri. Üçü ayrı anahtarda: biri bir kez yazılıp bir daha
    değişmiyor, ötekiler her ay büyüyor.
  */
  const [kurulumTarihi, setKurulumTarihi, kurulumTarihiHazir] = useYerelDepo<string | null>(
    ANAHTARLAR.kurulumTarihi,
    null,
  )
  const [ozetGorulen, setOzetGorulen] = useYerelDepo<string[]>(ANAHTARLAR.ozetGorulen, [])
  const [aylikOzetler, setAylikOzetler, aylikOzetlerHazir] = useYerelDepo<AylikOzetArsivi>(
    ANAHTARLAR.aylikOzetler,
    {},
  )
  /** Katmanda açık olan ay; kapalıyken null. */
  const [ozetAcik, setOzetAcik] = useState<string | null>(null)
  const [oyunBankasi, setOyunBankasi, oyunBankasiHazir] = useYerelDepo<BankaKaydi[]>(
    ANAHTARLAR.oyunBankasi,
    [],
  )
  /*
    Noktalama Yazım Ustası'ndan ayrıldı; eski kayıtlar bir kez taşınıp
    yazılıyor. Hazır bayrağı şart: ilk okuma bitmeden yazmak kaydı boş
    varsayılanla ezerdi.
  */
  useEffect(() => {
    if (!oyunBankasiHazir) return
    const tasinan = eskiNoktalamayiTasi(oyunBankasi)
    if (tasinan !== oyunBankasi) setOyunBankasi(tasinan)
  }, [oyunBankasi, oyunBankasiHazir, setOyunBankasi])
  /**
   * Bankadan düşen toplam soru. Düşen kayıt silindiği için sonradan
   * sayılamıyor; rozet buna baktığından ayrı bir sayaç olarak birikiyor.
   */
  const [bankaDusen, setBankaDusen] = useYerelDepo<number>(ANAHTARLAR.bankaDusen, 0)
  const [konuIlerleme, setKonuIlerleme] = useYerelDepo<KonuIlerlemeleri>(
    ANAHTARLAR.konuIlerleme,
    {},
  )
  /** Konu destesinde geçen süre seansları — yalnızca aylık özet okuyor. */
  const [okumaGecmisi, setOkumaGecmisi] = useYerelDepo<OkumaSeansi[]>(ANAHTARLAR.okumaGecmisi, [])
  /*
    Bilinmeyenler bankası arayüze bağlı değil: deste karar sormayı bıraktı
    (`components/konu/kart-destesi.tsx`), yani listeye yeni kayıt düşmüyor.
    Okunuyor çünkü eski kurulumlardaki kayıtlar yedeğe girmeye devam ediyor —
    bir özelliğin kapanması, kullanıcının o güne kadar biriktirdiği verinin
    yedekten de düşmesi anlamına gelmemeli.
  */
  const [bilinmeyenKartlar] = useYerelDepo<BilinmeyenKart[]>(ANAHTARLAR.bilinmeyenKartlar, [])
  /*
    Konu haritasında kalınan yer. Yedeğe girmeyen bir tercih olduğu için
    ilerlemeden ayrı anahtarda duruyor.
  */
  const [konuSecimi, setKonuSecimi] = useYerelDepo<{ ders: KonuDersId; sinif: HaritaSinifi }>(
    ANAHTARLAR.konuSecimi,
    { ders: 'matematik', sinif: 9 },
  )
  /*
    Konu Takibi'nin kaydı. Depodan geleni her okumada `takibiCoz` süzüyor:
    elle kurcalanmış ya da yarım yazılmış bir kayıt ekranı çökertmesin.
  */
  const [yksTakipHam, setYksTakipHam] = useYerelDepo<YksTakip>(ANAHTARLAR.yksKonuTakibi, BOS_TAKIP)
  const yksTakip = useMemo(() => takibiCoz(yksTakipHam), [yksTakipHam])
  const setYksTakip = useCallback(
    (guncelle: (onceki: YksTakip) => YksTakip) => setYksTakipHam((onceki) => guncelle(takibiCoz(onceki))),
    [setYksTakipHam],
  )
  /*
    Konu Takibi'nden "Haritaya git" isteği: harita sekmesi açılınca bu konunun
    kartını açıp isteği tüketiyor (`onKonuAcildi`). Prop doğrudan okunsaydı
    haritadan çıkıp dönen kullanıcı aynı kartı her seferinde yeniden görürdü —
    ana sayfadaki ders kutucuğunun `acilacakDers` kalıbı.
  */
  const [haritaIstegi, setHaritaIstegi] = useState<{
    ders: KonuDersId
    sinif: HaritaSinifi
    konuId: string
  } | null>(null)
  /*
    Tanıtım turu Harita'nın yeşil ve turuncu kitabını gösteriyor. Kartı
    yazılmamış bir dersin (12'de Matematik dışındakiler) haritasında kitap yok
    ve adım hedefsiz kalırdı; tur sürerken kitabı olan bir programa bakılıyor:
    aynı sınıfın Matematik'i (her sınıfta var). Kayda yazılmıyor: tur bitince
    harita kendi seçimiyle açılıyor.
  */
  const turHaritaSecimi = useMemo(() => {
    if (!anaTurda || !tanitim.adim || !HARITA_TUR_ADIMLARI.includes(tanitim.adim.kimlik)) return null
    if (programBul(konuSecimi.ders, konuSecimi.sinif)) return null
    const sinif: HaritaSinifi = konuSecimi.sinif
    return { ders: 'matematik' as const, sinif }
  }, [anaTurda, tanitim.adim, konuSecimi])
  /*
    Depo anahtarı `rabi-notlar` kalıyor: ekran not tahtasından görev listesine
    döndü ama kayıtlı görevler o anahtarda duruyor ve kimliği değiştirmek
    kullanıcının bugün yazdıklarını öksüz bırakırdı. Şema dönüşümünü
    `gorevleriNormalize` yapıyor.
  */
  const [gorevlerHam, setGorevler, gorevlerHazir] = useYerelDepo<Gorev[]>(ANAHTARLAR.notlar, [])
  /*
    Liste bugünün çevresindeki kayan şeride göre her çizimde yeniden okunuyor.

    Zamanlayıcı kurmak yerine türetmek: gece yarısını bekleyen bir
    `setTimeout` uygulama kapalıyken çalışmaz, uyanan telefonda da geç çalışır.
    Şerit kaymışsa eski görevler zaten ilk çizimde eleniyor; aşağıdaki etki de
    kaydı buna eşitliyor.
  */
  const gorevler = gorevleriTarihtenItibaren(gorevleriNormalize(gorevlerHam), gunKaydir(bugunIso, -3))
  /*
    Elenen görevler kayıttan da siliniyor.

    Yalnızca çizimden düşselerdi eski işler `localStorage`'da
    birikir, yedeğe girer ve saati geri alan bir cihazda geri gelirdi.
    `gorevlerHazir` şart: ilk okuma bitmeden yazmak, kayıtta duran görevleri
    boş varsayılanla ezerdi.
  */
  useEffect(() => {
    if (!gorevlerHazir || gorevler.length === gorevlerHam.length) return
    setGorevler(gorevler)
  })
  /**
   * Bankadan açılan tur. Oyun kimliği burada duruyor çünkü turu Oyunlar sekmesi
   * çiziyor ama başlatan Oyun Bankası ekranı — ikisi kardeş, ortak sahibi bu.
   */
  /*
    Açık genel test: bankada kaydı olan oyunlar karışık sırayla arka arkaya
    oynatılıyor (`lib/oyunlar/genel-test.ts`). Turun kendisini Oyunlar sekmesi
    çiziyor, sıra burada duruyor.

    `bankaTuru` ayrı bir state değil, testten **türetiliyor**: iki ayrı kayıt
    olsaydı biri ilerlerken öteki eski oyunda kalabilirdi.
  */
  const [genelTest, setGenelTest] = useState<GenelTest | null>(null)
  const bankaTuru: BankaTuru | null = (() => {
    if (genelTest === null) return null
    const oyun = genelTestOyunu(genelTest)
    return oyun === null ? null : { oyun, ilk: genelTest.adim === 0 }
  })()
  /**
   * Bildirilen hatalı sorular. Kuyruk, gönderim ve arayüzün kolu hook'un
   * içinde; buradan yalnızca ayarın açık olup olmadığı geçiyor.
   */
  const hataBildirimi = useHataBildirimi()
  const geriBildirim = useGeriBildirim()
  /**
   * Çökme raporlaması. Global JS hata yakalayıcısını da bu kanca kuruyor,
   * onaydan bağımsız olarak — yakalanan hata onay yokken zaten hiçbir yere
   * gitmiyor, ama onay verilen an öncesindeki hatalar kaybolmasın diye
   * dinleyiciler baştan takılı duruyor.
   */
  const cokmeHam = useCokmeRaporu()
  /*
    Çökme penceresi ile tanıtım turu asla aynı anda görünmüyor
    (`lib/cokme-tanitim.ts`): tur katmanı dokunmaları ve odağı yuttuğu için
    pencerenin düğmeleri çalışmıyor, kullanıcı kilitleniyordu. Pencere
    bekliyorsa tur başlamıyor; tur sürüyorsa pencere tur bitene kadar
    bekliyor. Pencerenin bileşeni ve geri tuşu kaydı yalnızca bu süzülmüş
    `soruAcik`i görüyor.
  */
  const cokmeKarari = cokmeTanitimKarari({ cokmeBekliyor: cokmeHam.soruAcik, tanitimdaMi: tanitim.tanitimdaMi, turKapaniyor: tanitim.kapanisSuruyor })
  const cokme = { ...cokmeHam, soruAcik: cokmeKarari.soruGorunsun }
  const guncelleme = useGuncelleme()
  /** İzlenmiş haftalık özetlerin hafta başı tarihleri. */
  /*
    Bildirim kuyruğu. Aynı anda birden fazla rozet gelebiliyor ve ekranda hep
    tek bildirim var: üst üste inen iki şerit ikisini de okunmaz yapardı.
    Kuyruğun sahibi burası, `RozetBildirimi` tek bir rozet çiziyor.
  */
  const [bildirimKuyrugu, setBildirimKuyrugu] = useState<Rozet[]>([])
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
  const [gecis, setGecis] = useState<'yok' | 'ortulu' | 'soluyor'>('yok')
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

  /*
    Turda Denemeler ve İstatistik alana uygun iki örnek denemeyi ve
    kullanıcının turda eklediğini gösteriyor; gerçek denemeler o sırada
    görünmüyor ve hiçbirine yazılmıyor.
  */
  const turDenemeleri = useMemo(
    () => (anaTurda ? [...demoDenemeleri(ayarlar.buYilSinif, ayarlar.puanTuru, bugunIso), ...tanitim.demo.denemeler] : null),
    [anaTurda, ayarlar.buYilSinif, ayarlar.puanTuru, bugunIso, tanitim.demo.denemeler],
  )
  const gorunenDenemeler = turDenemeleri ?? denemeler
  // İstatistik'in mini turu örnek denemelerle: bölümlerinin çoğu iki
  // denemeden önce hiç çizilmiyor ve turun hedefleri boş kalırdı.
  const istatistikTurunda = tanitim.aktifTur === 'istatistik'
  const turIstatistigi = useMemo(
    () => (anaTurda
      ? turIstatistikDenemeleri(demoDenemeleri(ayarlar.buYilSinif, ayarlar.puanTuru, bugunIso), tanitim.demo.denemeler, sablonlar)
      : istatistikTurunda ? istatistikTuruDenemeleri(ayarlar.buYilSinif, ayarlar.puanTuru, bugunIso, sablonlar) : null),
    [anaTurda, istatistikTurunda, ayarlar.buYilSinif, ayarlar.puanTuru, bugunIso, tanitim.demo.denemeler, sablonlar],
  )

  /** Soru Takibi ve Yapılacaklar'ın ekleme sayfası turda turun adımına bağlı. */
  const turFormu = (formAdimi: string, ekleHedefi: string) => ({
    formAcik: tanitim.adim?.kimlik === formAdimi,
    formuAc: () => tanitim.gonder({ tur: 'hedefe-dokun', hedef: ekleHedefi }),
    formuKapat: () => { if (tanitim.adim?.kimlik === formAdimi) tanitim.oncekiAdimaDon() },
  })
  // Günün hâli kartı "son deneme ne zamandı" diye soruyor; liste tarih
  // sırasında tutulmuyor, en yeni burada bir kez bulunuyor.
  const enYeniDenemeTarihi = useMemo(
    () => denemeler.reduce<string | null>((e, d) => (e === null || d.tarih > e ? d.tarih : e), null),
    [denemeler],
  )

  /*
    ---- Haftalık özet ----

    Araçlar listesinde **yok** ve olmayacak: özet aranıp açılan bir araç değil,
    haftada bir kendiliğinden gelen bir kapanış. Kutucuk olarak konsaydı son
    kullanılanlarla birlikte sıraya girer, hafta ortasında açıldığında da
    yarım bir haftanın sayılarını gösterirdi.

    Tek girişi ana sayfanın **en üstündeki** davet kartı ve o kart yalnızca
    izlenmemiş bir dönem varken duruyor.
  */

  // Kurulum günü bir kez damgalanıyor: arşiv oradan başlıyor.
  useEffect(() => {
    if (!kurulumTarihiHazir || kurulumTarihi) return
    setKurulumTarihi(bugun())
  }, [kurulumTarihiHazir, kurulumTarihi, setKurulumTarihi])

  /**
   * Bir ayın özetini ham kayıtlardan hesaplar.
   *
   * Tek yerden: hem katmanın açtığı ay hem arşive yazılan aylar aynı hesaptan
   * geçiyor, yoksa arşivdeki sayı ekrandakinden ayrışırdı.
   */
  const ayiHesapla = useCallback(
    (ay: string) =>
      aylikOzet({
        ay,
        gunlukKayitlar,
        gunlukHedef: ayarlar.gunlukHedef,
        pomodoroGecmis,
        oyunGecmisi,
        denemeler,
        sablonlar,
        konuIlerleme,
        okumaGecmisi,
      }),
    [gunlukKayitlar, ayarlar.gunlukHedef, pomodoroGecmis, oyunGecmisi, denemeler, sablonlar, konuIlerleme, okumaGecmisi],
  )

  /*
    Arşiv: kapanmış her ay, görülsün görülmemiş olsun, bir kez hesaplanıp
    saklanıyor. Hesap ay kapandıktan sonra yapıldığı için o ayın kayıtları
    artık değişmiyor; bir kez yazılan kayıt bir daha ele alınmıyor. Veri
    durulmadan (ilk açılışta depo okunmadan) yazılsaydı boş bir ay arşive
    geçer ve bir daha düzelmezdi — o yüzden hazır bayrakları bekleniyor.
  */
  useEffect(() => {
    if (!aylikOzetlerHazir || !kurulumTarihiHazir || !kurulumTarihi) return
    if (!gunlukHazir || !denemelerHazir || !oyunlarHazir) return
    const eksikler = arsivdeEksikAylar(aylikOzetler, kurulumTarihi, bugunIso)
    if (eksikler.length === 0) return
    setAylikOzetler((onceki) => {
      const yeni = { ...onceki }
      for (const ay of eksikler) if (!yeni[ay]) yeni[ay] = ayiHesapla(ay)
      return yeni
    })
  }, [
    aylikOzetlerHazir,
    kurulumTarihiHazir,
    kurulumTarihi,
    gunlukHazir,
    denemelerHazir,
    oyunlarHazir,
    aylikOzetler,
    setAylikOzetler,
    ayiHesapla,
    bugunIso,
  ])

  /** Bugün izlenmeyi bekleyen ay; bugün açılış günü değilse ya da izlendiyse null. */
  const bekleyenAy = useMemo(() => {
    const ay = bekleyenOzetAyi(bugunIso)
    if (!ay || ozetGorulen.includes(ay)) return null
    return ay
  }, [ozetGorulen, bugunIso])

  /*
    Hesabın dayandığı ay: katman açıksa onunki, değilse bekleyen.

    İkisi **tek** bir memo'da: ay açılır açılmaz "izlendi" işaretleniyor ve
    `bekleyenAy` o anda `null`a düşüyor — hesap yalnızca ona bağlı olsaydı
    katman açıldığı karede boşalırdı. Arşivde varsa oradan okunuyor; ham
    kayıtlar ay kapandıktan sonra değişmediği için ikisi aynı sayı.
  */
  const ozetAyi = ozetAcik ?? bekleyenAy
  const ozet = useMemo(() => {
    if (!ozetAyi) return null
    return aylikOzetler[ozetAyi] ?? ayiHesapla(ozetAyi)
  }, [ozetAyi, aylikOzetler, ayiHesapla])

  /**
   * Davet kartının hâli.
   *
   * Kart ana sayfada hep var: özet bekliyorsa **en üstte ve renkli**, yoksa
   * **en altta ve pasif**, üstünde bir sonraki açılış günü. Yedi etkin güne
   * ulaşmayan ayda kart aktif olmuyor — birkaç günlük veriyi on sayfalık
   * "aylık" hikâye diye sunmuyor.
   */
  const gosterilebilirOzet = ozet !== null && ozetGosterilebilirMi(ozet)
  const ozetHazir = bekleyenAy !== null && gosterilebilirOzet
  const ozetYetersiz = bekleyenAy !== null && ozet !== null && !gosterilebilirOzet
  const sonrakiOzet = sonrakiOzetGunu(bugunIso)

  // Ay "izlendi" sayılıyor — kapatıldığında değil, **açıldığında**: özet
  // açıkken uygulamayı kapatan kullanıcı aynı hikâyeyi yeniden bulmasın.
  const ozetiAc = useCallback(() => {
    if (!bekleyenAy) return
    setOzetAcik(bekleyenAy)
    setOzetGorulen((onceki) =>
      onceki.includes(bekleyenAy) ? onceki : [...onceki, bekleyenAy].slice(-36),
    )
  }, [bekleyenAy, setOzetGorulen])

  // Hedef kartı ve ana sayfa, en yeni denemelerden çıkan tahmini gösteriyor.
  const tahmin = guncelTahmin(denemeler, sablonlar, okulYillari, ayarlar.puanTuru, ayarlar.elleObp)
  const guncelSiralama = tahmin?.siralama.enKotu ?? null
  const diplomaNotu = obpHesapla(okulYillari, ayarlar.elleObp)?.diplomaNotu ?? null

  // ---- Açılış ekranı ----
  const acilisiKapat = useCallback(() => setAcilisBitti(true), [])

  useEffect(() => {
    if (gecis !== 'ortulu') return
    const solma = setTimeout(() => setGecis('soluyor'), GECIS_SURESI)
    return () => clearTimeout(solma)
  }, [gecis])

  useEffect(() => {
    if (gecis !== 'soluyor') return
    const kaldirma = setTimeout(() => setGecis('yok'), GECIS_SOLMA_SURESI)
    return () => clearTimeout(kaldirma)
  }, [gecis])

  // Açılış ekranı `fixed`: kendisi kaydırılmıyor ama parmak hareketi altındaki
  // sayfaya geçiyordu ve ekran kalkınca ana sayfa ortasından başlıyordu.
  // Ekran görünürken gövde kilitleniyor, kalkarken sayfa başa alınıyor.
  const acilisGorunur = !acilisBitti
  const tanitimAcikti = useRef(false)
  // Çökme penceresi açıkken tur başlamıyor; pencere cevaplanınca
  // (`turBaslayabilir` döner) etki yeniden çalışıp turu başlatıyor.
  const turBaslayabilir = cokmeKarari.turBaslayabilir
  useEffect(() => {
    if (ayarlarHazir && ayarlar.kurulumTamamlandi && acilisBitti && gecis === 'yok' && turBaslayabilir && tanitim.baslangic === 'ana-tur' && !tanitim.tanitimdaMi) {
      tanitim.turuBaslat('ana_tur')
    }
  }, [ayarlarHazir, ayarlar.kurulumTamamlandi, acilisBitti, gecis, turBaslayabilir, tanitim.baslangic, tanitim.tanitimdaMi, tanitim.turuBaslat])
  // Yeni kullanıcıya ana turdan önce "Tanıtım ister misin?" (`lib/tanitim-tercih.ts`).
  // Tur ile aynı anda çıkabileceği koşullarda: kurulum ve açılış bitti, çökme sorusu yok.
  const tanitimSorusuAcik = ayarlarHazir && ayarlar.kurulumTamamlandi && acilisBitti && gecis === 'yok' && turBaslayabilir && tanitim.baslangic === 'sor' && !tanitim.tanitimdaMi

  /*
    Mini turlar: ekran ilk kez açıldığında bir kez (`miniTurSec`). Ana tur
    bitmeden hiçbiri başlamıyor; ana turu eski sürümde bitirmiş kullanıcıda
    da yeni mini turlar ilk ziyarette bir kez çıkıyor. `turuBaslat` görülmüş
    turu yeniden açmıyor.
  */
  const pomodoroIsliyor = pomodoroDurumu?.canli === true
  useEffect(() => {
    if (!ayarlarHazir || !ayarlar.kurulumTamamlandi || !acilisBitti || gecis !== 'yok' || !turBaslayabilir || tanitim.tanitimdaMi || tanitim.tamamlandi !== true) return
    const tur = miniTurSec({
      sekme,
      ekran,
      denemeFormu: denemeFormu !== null,
      pomodoroIsliyor,
      pomodoroIstegi: pomodoroIstegi !== null,
      genelTest: genelTest !== null,
    })
    if (tur) tanitim.turuBaslat(tur)
  }, [ayarlarHazir, ayarlar.kurulumTamamlandi, acilisBitti, gecis, turBaslayabilir, ekran, sekme, denemeFormu, pomodoroIsliyor, pomodoroIstegi, genelTest, tanitim.tanitimdaMi, tanitim.tamamlandi, tanitim.turuBaslat])

  // Oyunlar sekmesinden çıkınca hatırlanan ders unutuluyor; Oyunlar turu
  // bitince (kullanıcı hâlâ sekmedeyse) ders kutucuğundan gelinen ders geri açılıyor.
  const oncekiTurRef = useRef(tanitim.aktifTur)
  useEffect(() => {
    if (sekme !== 'oyunlar') oyunlarDersiRef.current = null
    else if (oncekiTurRef.current === 'oyunlar' && tanitim.aktifTur === null && oyunlarDersiRef.current !== null) setAcilacakDers(oyunlarDersiRef.current)
    oncekiTurRef.current = tanitim.aktifTur
  }, [sekme, tanitim.aktifTur])

  useYerlesimEtkisi(() => {
    if (tanitim.adim && tanitim.aktifTur === 'ana_tur') {
      const konum = tanitimKonumu(tanitim.adim)
      setSekme(konum.sekme)
      setEkran(konum.ekran)
      // Fonksiyonel: açık formun nesnesi her adımda yenilenmesin (yenilenirse sayfa başa kayıyor).
      setDenemeFormu((onceki) => (konum.denemeFormu ? (onceki ?? { duzenlenen: null }) : null))
      setAcilacakDers(null)
      tanitimAcikti.current = true
    } else if (tanitimAcikti.current) {
      setSekme('ana')
      setEkran(null)
      setDenemeFormu(null)
      setAcilacakDers(null)
      tanitimAcikti.current = false
      /*
        Turun soru, görev ve denemeleri cihaz deposuna hiç yazılmıyor (turun
        kendi listesinde, `DemoVeri`). Yine de bir yoldan sızan olursa
        `tanitim-` önekli kimliğinden tanınıp yalnızca o siliniyor; gerçek
        kayıtlara dokunulmuyor.
      */
      setDenemeler((onceki) => (onceki.some(tanitimKaydiMi) ? tanitimKayitlariniAyikla(onceki) : onceki))
      setGorevler((onceki) => (onceki.some(tanitimKaydiMi) ? tanitimKayitlariniAyikla(onceki) : onceki))
      window.scrollTo(0, 0)
    }
  }, [tanitim.adim, tanitim.aktifTur, setDenemeler, setGorevler])
  useEffect(() => {
    if (!acilisGorunur) return
    const oncekiTasma = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = oncekiTasma
      window.scrollTo(0, 0)
    }
  }, [acilisGorunur])

  /*
    Eylülde yeni ders yılı başlayınca kullanıcı bir üst sınıfa kendiliğinden
    geçer. Hesap **normalize edilmiş** ayarlara bakıyor, hama değil: `sinifYili`
    alanı olmayan eski kurulumda ham değer `undefined` ve `ilerlemisSinif`
    NaN döndürüyordu; NaN kayda yazılıp JSON'da `null` oluyor ve ana sayfa
    "2039 YKS · 4673 gün kaldı" gösteriyordu. Bir kez yazılınca da bir daha
    düzelmiyordu.
  */
  useEffect(() => {
    if (!ayarlarHazir || !ayarlar.kurulumTamamlandi) return
    const buYil = egitimYili()
    const yeniSinif = ilerlemisSinif(ayarlar.buYilSinif, ayarlar.sinifYili, buYil)
    if (yeniSinif !== ayarlarHam.buYilSinif || buYil !== ayarlarHam.sinifYili) {
      setAyarlar((o) => ({ ...o, buYilSinif: yeniSinif, sinifYili: buYil }))
    }
  }, [
    ayarlarHazir,
    ayarlar.kurulumTamamlandi,
    ayarlar.buYilSinif,
    ayarlar.sinifYili,
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
        yksTakip,
        haritaIlerleme: konuIlerleme,
        okumaGecmisi,
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
      yksTakip,
      konuIlerleme,
      okumaGecmisi,
    ],
  )

  /** Bankadan soru düştü: rozetin baktığı toplam sayaç ilerliyor. */
  const bankadanDustu = useCallback(
    (adet: number) => {
      // Fonksiyonel: kapanışta yakalanan sayı, aynı karedeki ikinci bir
      // düşüşte eskimiş olurdu.
      setBankaDusen((onceki) => onceki + adet)
    },
    [setBankaDusen],
  )

  /*
    Genel testi kapatır: doğru bilinen kayıtlar bankadan **bir kerede** düşer.

    Tur tur düşürülseydi sıradaki oyunun havuzu test sürerken küçülür, aynı
    testin ortasında bir oyun sorusuz kalabilirdi. Yanlış bilinenlere hiç
    dokunulmuyor — test yeni bir hata değil, hâlâ öğrenilmemiş olanı gösteriyor.
  */
  const genelTestiBitir = useCallback(
    (test: GenelTest | null) => {
      setGenelTest(null)
      if (test === null || test.dogruIdler.length === 0) return
      setOyunBankasi((o) => testiIsle(o, test.dogruIdler))
      bankadanDustu(test.dogruIdler.length)
    },
    [bankadanDustu, setOyunBankasi],
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
        // Kazanılan **hepsi** kayda giriyor; kuyruğa yalnızca her türün en
        // değerlisi düşüyor (`bildirilecekler`). 97 diploma notu yazan öğrenci
        // üç diploma rozetini birden kazanıyor ama tek bildirim görüyor.
        setRozetler((onceki) => [...onceki, ...yeniler.map((r) => ({ rozetId: r.id, tarih }))])
        setBildirimKuyrugu((onceki) => [...onceki, ...bildirilecekler(yeniler)])
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
      bugunGirdiVar: gunlukToplam(gunlukKayitlar, bugunIso) > 0,
    })
  }, [
    ayarlarHazir,
    gunlukHazir,
    ayarlar.kurulumTamamlandi,
    ayarlar.bildirimAcik,
    ayarlar.hatirlatmaSaati,
    ayarlar.hatirlatmaDakikasi,
    gunlukKayitlar,
    // Gün dönünce plan yeniden kuruluyor: "bugün girdi var" dünkü günü
    // gösteriyor olabilir.
    bugunIso,
  ])

  // ---- Görev hatırlatmaları (saatten 5 dk önce) ----
  /*
    Görevlerde bildirimi ilgilendiren her değişiklik (ekleme, düzenleme, saat,
    erteleme, bitirme, silme) ve her açılış/öne geliş, telefondaki görev
    bildirimlerini kayıttan baştan kuruyor (`gorevBildirimleriniEsitle`).
    Tek tek "şu görev değişti" diye izlenmiyor: yedekten geri yükleme ya da
    eski günlerin elenmesi gibi kaçan bir yol eski bildirimi telefonda
    bırakırdı.

    Bağımlılık listedeki diziye değil imzaya bakıyor: `gorevler` her çizimde
    yeniden türetiliyor, diziye bağlansaydı her çizimde eşitlenirdi. Öne
    gelişte de eşitleniyor — izni telefonun ayarlarından verip dönen
    kullanıcının bildirimleri o an kuruluyor.
  */
  const uygulamaGorunur = useUygulamaGorunur()
  const gorevBildirimImzasi = JSON.stringify(
    gorevler.map((g) => [g.id, g.gun, g.saat, g.bitti, g.metin, g.pomodoro === true]),
  )
  useEffect(() => {
    if (!ayarlarHazir || !gorevlerHazir || !ayarlar.kurulumTamamlandi || !uygulamaGorunur) return
    void gorevBildirimleriniEsitle(gorevler, ayarlar.gorevHatirlatma)
    // `gorevler` imzayla birlikte değişiyor; imza aynıyken bildirimi
    // ilgilendiren bir şey değişmemiş demek.
  }, [ayarlarHazir, gorevlerHazir, ayarlar.kurulumTamamlandi, ayarlar.gorevHatirlatma, uygulamaGorunur, gorevBildirimImzasi])

  /*
    Görev bildirimine dokunuş. Pomodoro işaretli ve bitmemiş görevde
    Yapılacaklar'daki sayaç düğmesinin yolu (`pomodoroIstegi` → Pomodoro),
    ötekilerde Yapılacaklar açılıyor. İşareti bildirim değil **kayıt**
    söylüyor: bildirim kurulduktan sonra görev değişmiş ya da silinmiş
    olabilir.

    Dokunuş bekletiliyor: uygulama bildirimle soğuk açıldığında olay, kayıt
    okunmadan ve açılış animasyonu bitmeden geliyor (eklenti olayı dinleyici
    kurulana kadar tutuyor).
  */
  const [bildirimGorevi, setBildirimGorevi] = useState<string | null>(null)
  useEffect(() => bildirimDokunusunuDinle(setBildirimGorevi), [])
  useEffect(() => {
    if (bildirimGorevi === null) return
    if (!ayarlarHazir || !gorevlerHazir || !ayarlar.kurulumTamamlandi || !acilisBitti) return
    // Başlangıç turu sürerken ekran değiştirmek turu bozar; dokunuş düşüyor.
    setBildirimGorevi(null)
    if (tanitim.tanitimdaMi) return
    const gorev = gorevler.find((g) => g.id === bildirimGorevi)
    if (gorev && gorev.pomodoro === true && !gorev.bitti) {
      setPomodoroIstegi({ kimlik: `${gorev.id}-${Date.now()}`, dakika: gorev.sure })
      aracAc('pomodoro')
      return
    }
    aracAc('notlar')
  }, [bildirimGorevi, ayarlarHazir, gorevlerHazir, ayarlar.kurulumTamamlandi, acilisBitti, tanitim.tanitimdaMi])

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

  const cokmeSoruAcik = cokme.soruAcik
  const cokmeyiGonderme = cokme.onGonderme
  const geriGit = useCallback(() => {
    // Çökme penceresi açıksa geri tuşu önce onu kapatıyor, "Gönderme" ile
    // aynı anlamda (kapanan pencere veri göndermemeli). Pencere turla aynı
    // anda görünmüyor (`lib/cokme-tanitim.ts`); bu sıra yine de turun önünde
    // duruyor ki bir gün ikisi çakışsa tuş kullanıcıyı pencerede kilitlemesin.
    if (cokmeSoruAcik) { cokmeyiGonderme(); return true }
    // Donanım geri tuşu turu bitirmiyor: tur yalnızca ilerleyerek biter. Tuş bir adım geri alıyor;
    // geri sayım sürerken yutuluyor, Okut açıkken önce onu kapatıyor (`lib/tanitim-rehber.ts`).
    const turKarari = tanitimGeriKarari({ tanitimdaMi: tanitim.tanitimdaMi, rehberGizli: tanitim.rehberGizli, adimKimligi: tanitim.adim?.kimlik ?? null, katmanVar: katmanVarMi() })
    if (turKarari !== 'normal') taniKaydet('geriTusu', { karar: turKarari, adim: tanitim.adim?.kimlik ?? null, rehberGizli: tanitim.rehberGizli })
    if (turKarari === 'yut') return true
    if (turKarari === 'katman') { if (!ustKatmaniKapat()) tanitim.oncekiAdimaDon(); return true }
    if (turKarari === 'adim-geri') { tanitim.oncekiAdimaDon(); return true }
    // En içteki katmandan dışa doğru: ekranın kendi açtığı katman (fotoğraf
    // görüntüleyici, onay kutusu) → form → alt ekran → ana sekme → çıkış.
    if (ustKatmaniKapat()) return true
    // Genel test tam ekran bir katman; geri tuşu önce onu kapatmalı, yoksa
    // test açıkken geri basmak arkadaki sekmeyi değiştirirdi. O ana kadar
    // doğru bilinenler yine de bankadan düşüyor.
    if (genelTest !== null) {
      genelTestiBitir(genelTest)
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
  }, [cokmeSoruAcik, cokmeyiGonderme, genelTest, genelTestiBitir, denemeFormu, ekran, sekme, tanitim.tanitimdaMi, tanitim.rehberGizli, tanitim.adim, tanitim.oncekiAdimaDon])

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

  // iOS'ta geri tuşu yok, soldan kaydırma var: hareketi yerli taraf tanıyıp
  // (`ios/App/App/AnaDenetleyici.swift`) parmak kalkınca buraya haber
  // veriyor (`lib/geri-kaydirma.ts`). Android'den tek farkı gidecek yer
  // kalmayınca uygulamanın kapanmaması — iOS'ta uygulama kendini kapatmaz,
  // Apple bunu çökme gibi sayıyor. Android'de kanca hiçbir şey yapmaz.
  useEffect(() => {
    // `layout.tsx`teki satır içi betiğin yedeği (iOS'a özel CSS buna bakıyor).
    if (iosMu()) document.documentElement.dataset.platform = 'ios'
  }, [])

  useGeriKaydirma(
    // Sürüklenebilir: gidilecek yer var ve açık bir katman/tam ekran test yok.
    // Katman açıksa sayfa kaymaz; bırakılınca geri tuşu gibi onu kapatır.
    // Tanıtım turunda da kaymaz: orada geri turu bitiriyor, ekranı
    // değiştirmiyor — dışarı kayan sayfa aynı ekrana sıçrayarak dönüyordu.
    () =>
      !tanitim.tanitimdaMi &&
      !katmanVarMi() &&
      genelTest === null &&
      (denemeFormu !== null || ekran !== null || sekme !== 'ana'),
    geriGit,
    // Android'de geri hareketi geri tuşunun kendisi: gidecek yer kalmayınca
    // çıkıyor. iOS'ta uygulama kendini kapatmaz (Apple bunu çökme sayıyor).
    () => {
      if (androidMu()) void CapacitorApp.exitApp()
    },
    // Geri gidince açılacak ekranın `SayfaGecisi` anahtarı (`geriGit` ile
    // aynı sıra): alt ekrandan sekmeye, sekmeden ana sayfaya.
    () => (ekran !== null ? `sekme:${sekme}` : sekme !== 'ana' ? 'sekme:ana' : null),
  )

  const denemeKaydet = useCallback(
    (deneme: Deneme) => {
      // Turda deneme turun listesine gidiyor; formu tur bir sonraki adımda kapatıyor.
      if (anaTurda) {
        tanitim.demoGuncelle('denemeler', (onceki) => [...onceki, { ...deneme, id: tanitimKimligi(deneme.id) }], 'deneme')
        return
      }
      setDenemeler((onceki) => {
        const varMi = onceki.some((d) => d.id === deneme.id)
        return varMi ? onceki.map((d) => (d.id === deneme.id ? deneme : d)) : [...onceki, deneme]
      })
      setDenemeFormu(null)
    },
    [setDenemeler, anaTurda, tanitim.demoGuncelle],
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
  const acilisKatmani = acilisGorunur ? <Acilis onBitti={acilisiKapat} /> : null

  /**
   * Alt ekranların üstündeki "Geri". Kenardan kaydırma ve Android'in geri
   * tuşuyla aynı sıra (`geriGit`): önce ekranın kendi açtığı katman, sonra
   * ekran. Pomodoro'da onu kendi yuvası çiziyor (aşağıda).
   */
  const geriDugmesi = (
    <Buton
      bicim="hayalet"
      boy="kucuk"
      onClick={() => {
        if (!ustKatmaniKapat()) setEkran(null)
      }}
      className="-ml-2 mb-3"
    >
      <ArrowLeft size={16} aria-hidden /> Geri
    </Buton>
  )

  // Veri okunmadan ekran çizilirse "kayıt yok" bir an yanıp söner.
  const icerik = !ayarlarHazir ? (
    <div className="en-az-ekran" aria-busy="true" />
  ) : !ayarlar.kurulumTamamlandi ? (
    <Kurulum
      onBitir={({ ayarlar: secimler, okulYillari: girilenler, hedef: secilenHedef }) => {
        setAyarlar((o) => ({
          ...ayarlariNormalize(o),
          ...secimler,
          sinifYili: egitimYili(),
          kurulumTamamlandi: true,
        }))
        // Mezun kurulumda yıl sonu notlarını girmiş olabilir; atladıysa
        // liste boş geliyor ve kayıtlı veriye dokunulmuyor.
        if (girilenler.length > 0) setOkulYillari(girilenler)
        // Bölüm adımı atlanabiliyor; atlandıysa hedef `null` geliyor ve
        // kayıtlı hedefe (varsa) dokunulmuyor.
        if (secilenHedef) setHedef(secilenHedef)
        // Kurulum ekranı bu karede kalkıyor; ana sayfa bir örtünün altında
        // kurulup örtü sönüyor.
        setGecis('ortulu')
      }}
    />
  ) : denemeFormu !== null ? (
    <div className="mx-auto en-az-ekran max-w-md px-4 pt-[calc(1.25rem+var(--guvenli-ust))] pb-[calc(2rem+var(--guvenli-alt))] tablet:max-w-[40rem] tablet:px-8">
      <YeniDenemeEkrani
        /* Turda da normal akışla aynı şablonlar ve aynı varsayılan. Bir süre
           yalnızca örneklerin türleri (TYT + alan) sunuluyor, TYT seçili
           geliyordu: Okut kâğıdı seçili şablonun derslerine ve soru
           sayılarına göre okuduğu için Seviye Tespit kâğıdı turda hiç
           okunmuyor, tur dışında okunuyordu. İstatistik'in eşleşmesi artık
           `turIstatistikDenemeleri`nde. */
        sablonlar={sablonlar}
        varsayilanSablonId={ayarlar.varsayilanSablonId}
        sinif={ayarlar.buYilSinif}
        puanTuru={ayarlar.puanTuru}
        duzenlenen={denemeFormu.duzenlenen}
        denemeSayisi={gorunenDenemeler.length}
        setYanlisSorular={setYanlisSorular}
        onKaydet={denemeKaydet}
        onSeviyeDersleriKaydet={(sinif, alan, dersler) =>
          setSablonlar((kayitli) =>
            seviyeDersleriniKaydet(kayitli, sinif, alan, dersler, new Set(denemeler.map((d) => d.sablonId)), yeniId()),
          )
        }
        onVazgec={() => (anaTurda ? tanitim.gonder({ tur: 'hedefe-dokun', hedef: DENEME_VAZGEC }) : setDenemeFormu(null))}
        tanitim={anaTurda ? {
          onOkutAcik: tanitim.setRehberGizli,
          // Okut adımı geçilince (İleri) form bir ders hariç örnekle doluyor.
          ornekDoldur: !!tanitim.adim && DENEME_FORMU_ADIMLARI.indexOf(tanitim.adim.kimlik) > 0,
          dersGirildi: () => tanitim.gonder({ tur: 'kayit-eklendi', kayit: 'deneme-ders' }),
        } : undefined}
      />
    </div>
  ) : (
  /*
    Kök `div`de giriş animasyonu **yok** ve olmamalı.

    `.acilis-girisi` içinde `transform` var; animasyon bittikten sonra bile
    hesaplanan değer `none` değil **birim matris** olarak kalıyor ve transformlu
    bir öğe, içindeki `position: fixed` katmanların *kapsayıcı bloğu* olur.
    Sonuç: alt menü, oyun katmanı ve haftalık özet ekrana değil bu `div`e göre
    konumlanıyordu. `en-az-ekran` içerikle birlikte büyüdüğü için alt menü,
    sayfanın en üstündeyken ekranın altından taşıyor ve yarısı görünmez oluyordu.

    Açılıştaki yumuşak geçişi artık `components/acilis.tsx` hallediyor.
  */
    /*
      Alt boşluk alt menüye göre: menü 71 px + kendi güvenli alanı, buradaki
      boşluk 5rem (80 px) + güvenli alan. Eskiden 6rem'di ve menünün üstünde
      25 px fazladan yer ayırıyordu: içerik ekrana sığdığı hâlde sayfa 13-25 px
      kayıyordu (Oyunlar'ın ders ızgarası 740 px yüksekliğinde 753 px çıkıyordu).
      Uzun içerikte kaydırma aynen duruyor; yalnızca son öğe menünün 9 px
      üstünde bitiyor.
    */
    /*
      Tablette (`tablet:`) sütun ekranın ortasında dar durmuyor: sağda ray
      kadar (`--ray`) boşluk bırakılıp sayfa genişliğe yayılıyor; alt menü
      olmadığı için alttaki 5rem'lik pay da yok. İçeriğin en geniş hâlini
      `SayfaGecisi` sınırlıyor (`tabletGenisligi`).
    */
    <div className="mx-auto en-az-ekran max-w-md px-4 pt-[calc(1.25rem+var(--guvenli-ust))] pb-[calc(5rem+var(--guvenli-alt))] tablet:max-w-none tablet:pt-[calc(1.75rem+var(--guvenli-ust))] tablet:pr-[calc(var(--ray)+var(--guvenli-sag)+2rem)] tablet:pb-[calc(2rem+var(--guvenli-alt))] tablet:pl-[calc(2rem+var(--guvenli-sol))]"
      style={tanitim.tanitimdaMi ? { paddingBottom: 'calc(60vh + var(--guvenli-alt))' } : undefined}>
      {/*
        Ekran ve sekme değişimi tek bir karede oluyordu: içerik tak diye yerine
        oturuyordu. `anahtar` her değişimde kutuyu söküp yeniden kuruyor, böylece
        giriş animasyonu her seferinde baştan oynuyor — sınıf tek başına verilse
        React aynı düğümü koruduğu için animasyon yalnızca ilk açılışta çalışırdı.
      */}
      {/* Pomodoro'nun yuvası (yukarıda, "Pomodoro ekrandan çıkınca
          sürüyor"). Geri kaydırma kaydırılacak sayfayı `[data-geri-sayfa]`
          ile ilk bulduğu öğeden alıyor; yuva o yüzden `SayfaGecisi`nden
          önce.

          Yuva yalnızca ekran açıkken **kurulu**, gizlenmiyor. Bir süre hep
          kuruluydu ve ekran kapanınca `hidden` oluyordu; geri kaydırma ise
          ekranın değiştiğini kayan kutunun sökülmesinden anlıyor
          (`isConnected`, `geri-kaydirma-denetci.ts`). Sökülmeyen yuvada
          "ekran değişmedi" sanıp gizli yuvayı yerine yaylandırıyor, önceki
          ekranın kopyası o süre boyunca yeni ekranın üstünde kayıp
          kayboluyordu (iOS'ta Pomodoro'dan kaydırarak çıkınca). Sökülen
          yuvada kap yalnızca DOM'dan düşüyor, bileşen yaşıyor (deneme formu
          da hep böyle yapıyordu). Her açılışta yeni kutu: giriş hareketi
          her seferinde baştan oynuyor.

          Geri düğmesi de burada, Pomodoro'nun başlığının üstünde: diğer
          araçlardaki gibi `SayfaGecisi`nin içinde dursaydı yuvanın, yani
          bütün Pomodoro'nun altında kalırdı. */}
      {ekran === 'pomodoro' && (
        <div data-geri-sayfa className="sayfa-girisi sayfa-ileri tablet:mx-auto tablet:max-w-[40rem]">
          {geriDugmesi}
          <div ref={setPomodoroYuvasi} />
        </div>
      )}
      <SayfaGecisi
        key={ekran ?? `sekme:${sekme}`}
        anahtar={ekran ?? `sekme:${sekme}`}
        ileri={ekran !== null}
        sabit={genelTest !== null}
        yavas={tanitim.tanitimdaMi}
        sure={tanitim.animasyon.gecisMs}
        genis={GENIS_SAYFALAR.has(ekran ?? `sekme:${sekme}`)}
      >
        {ekran !== null ? (
          <>
            {/*
              Ekranın içinde açılan bir alt görünüm varsa (Konu Takibi'nde bir
              ders) "Geri" önce onu kapatıyor — Android'in geri tuşu ve iOS'un
              kenar kaydırmasıyla aynı sıra. Ekran kendi ikinci geri düğmesini
              çizmek zorunda kalmıyor; üstte iki geri, hangisinin nereye
              götürdüğünü belirsiz bırakıyordu. Pencereler ve tam ekran
              katmanlar bu düğmeyi zaten örtüyor.
            */}
            {/* Pomodoro'nun geri düğmesi kendi yuvasında (yukarıda). */}
            {ekran !== 'pomodoro' && geriDugmesi}

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
                demoVeri={tanitim.tanitimdaMi}
                banka={tanitim.tanitimdaMi ? tanitim.demo.banka : oyunBankasi}
                bildir={hataBildirimi}
                /*
                  Elle kaldırma `bankadanDustu`'ya uğramıyor: sayaç, soruyu genel
                  testte doğru bilmenin karşılığı ve rozet ona bakıyor. Tuşa
                  basmakla artan bir sayaç ölçtüğü şeyi ölçmez olurdu.
                */
                onKaldir={(id) => { if (!tanitim.tanitimdaMi) setOyunBankasi((o) => o.filter((k) => k.id !== id)) }}
                /*
                  Genel test Oyunlar sekmesinde oynanıyor: her oyun soruları kendi
                  ekranıyla soruyor. Sekme değişiyor çünkü oyun katmanı tam ekran
                  ve testten çıkan kullanıcı oyunların yanında kalmalı.
                */
                onTestBaslat={() => {
                  if (tanitim.tanitimdaMi) return
                  const test = genelTestKur(oyunBankasi)
                  if (test === null) return
                  setGenelTest(test)
                  setEkran(null)
                  setSekme('oyunlar')
                }}
              />
            )}
            {/* Pomodoro burada çizilmiyor: kökte kalıcı, yuvası yukarıda. */}
            {ekran === 'notlar' && (
              <YapilacaklarEkrani
                gorevler={anaTurda ? tanitim.demo.gorevler : gorevler}
                // Yapılacaklar turunda görev gerçek listeye yazılıyor (kullanıcının kendi eylemi).
                setGorevler={anaTurda ? (g) => tanitim.demoGuncelle('gorevler', g, 'gorev') : setGorevler}
                tanitim={tanitim.aktifTur === 'yapilacaklar' ? {
                  formAcik: gorevFormuTurdaAcik(tanitim.aktifTur, tanitim.adim?.kimlik ?? null),
                  formuAc: () => tanitim.gonder({ tur: 'hedefe-dokun', hedef: 'gorev-ekle' }),
                  formuKapat: () => tanitim.gonder({ tur: 'hedefe-dokun', hedef: GOREV_VAZGEC }),
                  gorevKaydedildi: () => tanitim.gonder({ tur: 'kayit-eklendi', kayit: 'gorev' }),
                  menuAcik: gorevMenusuTurdaAcik(tanitim.aktifTur, tanitim.adim?.kimlik ?? null),
                  menuyuAc: () => tanitim.gonder({ tur: 'hedefe-dokun', hedef: 'gorev-eylem-ac' }),
                  menuyuKapat: () => { if (tanitim.adim?.kimlik === 'gorev-menu') tanitim.oncekiAdimaDon() },
                } : undefined}
                // Turda ve ayar kapalıyken izin sorulmuyor.
                gorevIzniIste={!anaTurda && ayarlar.gorevHatirlatma ? gorevIzniIste : undefined}
                onPomodoroBaslat={(gorev) => {
                  if (tanitim.tanitimdaMi) return
                  // Mevcut yol: Pomodoro bir araç olarak açılıyor, tur onun "Başlat"ıyla başlıyor.
                  setPomodoroIstegi({ kimlik: `${gorev.id}-${Date.now()}`, dakika: gorev.sure })
                  aracAc('pomodoro')
                }}
              />
            )}
            {ekran === 'soru' && (
              <SoruTakibiEkrani
                kayitlar={anaTurda ? tanitim.demo.soruKayitlari : gunlukKayitlar}
                setKayitlar={anaTurda ? (g) => tanitim.demoGuncelle('soruKayitlari', g, 'soru') : setGunlukKayitlar}
                ayarlar={ayarlar}
                tanitim={anaTurda ? turFormu('soru-form', 'soru-ekle') : undefined}
              />
            )}
            {ekran === 'deneme' && (
              <DenemelerEkrani
                denemeler={gorunenDenemeler}
                sablonlar={sablonlar}
                hazir={anaTurda || denemelerHazir}
                onSil={(id) => (anaTurda ? tanitim.demoGuncelle('denemeler', (o) => o.filter((d) => d.id !== id)) : setDenemeler((onceki) => onceki.filter((d) => d.id !== id)))}
                onDuzenle={(deneme) => { if (!anaTurda) setDenemeFormu({ duzenlenen: deneme }) }}
                onYeniyeGit={() => (anaTurda ? tanitim.gonder({ tur: 'hedefe-dokun', hedef: 'deneme-ekle' }) : setDenemeFormu({ duzenlenen: null }))}
                // Turda örnek denemenin kartı adıma bağlı açılıyor (`deneme-detay`).
                tanitim={anaTurda ? {
                  ornekAcik: tanitim.adim?.kimlik === 'deneme-detay',
                  ornegeDokun: () => tanitim.gonder({ tur: 'hedefe-dokun', hedef: 'deneme-ornek' }),
                } : undefined}
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
                yksTakip={yksTakip}
                haritaIlerleme={konuIlerleme}
                okumaGecmisi={okumaGecmisi}
                kazanilmis={rozetler}
              />
            )}
            {ekran === 'devamsizlik' && (
              <DevamsizlikEkrani kayitlar={devamsizlik} setKayitlar={setDevamsizlik} />
            )}
            {ekran === 'istatistik' && (
              <IstatistikEkrani
                denemeler={turIstatistigi ?? gorunenDenemeler}
                sablonlar={sablonlar}
                varsayilanSablonId={anaTurda || istatistikTurunda ? (tanitim.demo.denemeler.at(-1)?.sablonId ?? 'tyt') : ayarlar.varsayilanSablonId}
              />
            )}
            {ekran === 'konu-takibi' && (
              <KonuTakibiEkrani
                tanitimda={anaTurda}
                takip={yksTakip}
                setTakip={setYksTakip}
                ilerlemeler={konuIlerleme}
                alan={ayarlar.puanTuru}
                setAlan={(puanTuru) => setAyarlar((o) => ({ ...o, puanTuru }))}
                sinif={ayarlar.buYilSinif}
                onHaritayaGit={({ ders, sinif, konu }) => {
                  setKonuSecimi({ ders, sinif })
                  setHaritaIstegi({ ders, sinif, konuId: konu.id })
                  setEkran(null)
                  setSekme('harita')
                }}
              />
            )}
            {ekran === 'yasal' && <YasalEkrani />}
            {ekran === 'geri-bildirim' && <GeriBildirimEkrani kol={geriBildirim} />}
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
                bekleyenYanlis={yanlisSorular.filter((s) => !s.cozuldu).length}
                sonDenemeTarihi={enYeniDenemeTarihi}
                ozetHazir={ozetHazir}
                ozetYetersiz={ozetYetersiz}
                sonrakiOzet={sonrakiOzet}
                onOzetAc={ozetiAc}
                sonAraclar={sonAraclar}
                sonOyunlar={sonOyunlar}
                onKartAc={aracAc}
                pomodoro={
                  pomodoroDurumu?.canli && pomodoroDurumu.bitisZamani !== null
                    ? pomodoroDurumu.mola
                      ? 'mola'
                      : 'calisma'
                    : null
                }
                konuBitti={bugunKonuBittiMi(konuIlerleme, bugunIso)}
                gorevlerBitti={gorevlerBittiMi(gorevler, bugunIso)}
                onDahaGit={() => setSekme('daha')}
                onOyunlaraGit={(ders) => {
                  // Ders kutucuğu doğrudan o dersin ızgarasını açıyor; sekmenin
                  // başına düşen kullanıcı aynı seçimi bir kez daha yapıyordu.
                  setAcilacakDers(ders ?? null)
                  setSekme('oyunlar')
                }}
              />
            )}
            {sekme === 'oyunlar' && (tanitim.adim && ['zorluk', 'oyun-baslat', 'soru-bir', 'sonuc'].includes(tanitim.adim.kimlik) ? <DemoOyun bildir={hataBildirimi} /> : (
              <OyunlarEkrani
                tanitimKarti={tanitim.adim?.kimlik === 'demo-ac' ? <DemoOyunKarti /> : undefined}
                kayitlar={oyunlar}
                setKayitlar={setOyunlar}
                setGecmis={setOyunGecmisi}
                soruGecmisi={soruGecmisi}
                setSoruGecmisi={setSoruGecmisi}
                banka={tanitim.aktifTur === 'ana_tur' ? tanitim.demo.banka : oyunBankasi}
                setBanka={setOyunBankasi}
                sesAcik={ayarlar.oyunSesi}
                onBankayaGit={() => { if (tanitim.tanitimdaMi) tanitim.gonder({ tur: 'hedefe-dokun', hedef: 'oyun-bankasi-ac' }); else setEkran('oyun-bankasi') }}
                bankaTuru={bankaTuru}
                onBankaTuruBitti={() => genelTestiBitir(genelTest)}
                /*
                  Bir tur bitti: doğrular biriktirilip sıra bir sonraki oyuna
                  geçiyor. Yarıda bırakılan tur testi de bitiriyor — kullanıcı
                  çıkmak istedi; o ana kadar bildikleri yine de sayılıyor.
                */
                onGenelTestTuruBitti={(dogrular, yarim) => {
                  if (genelTest === null) return
                  const sonraki = genelTestIlerlet(genelTest, dogrular)
                  if (yarim || genelTestBittiMi(sonraki)) genelTestiBitir(sonraki)
                  else setGenelTest(sonraki)
                }}
                acilacakDers={acilacakDers}
                onDersAcildi={() => { oyunlarDersiRef.current = acilacakDers; setAcilacakDers(null) }}
                onOyunAcildi={oyunAcildi}
                bildir={hataBildirimi}
              />
            ))}
            {sekme === 'harita' && (
              <KonuHaritasiEkrani
                secim={turHaritaSecimi ?? konuSecimi}
                setSecim={(secim) => setKonuSecimi(secim)}
                kullaniciSinifi={haritaSinifiBul(ayarlar.buYilSinif)}
                ilerlemeler={konuIlerleme}
                setIlerlemeler={setKonuIlerleme}
                acilacakKonu={haritaIstegi}
                onKonuAcildi={() => setHaritaIstegi(null)}
                onOkumaSeansi={(seans) => setOkumaGecmisi((onceki) => okumaSeansiEkle(onceki, seans))}
              />
            )}
            {sekme === 'daha' && <KartMenusu onKartAc={aracAc} />}
            {sekme === 'ayarlar' && (
              <AyarlarEkrani
                kayitliSablonlar={kayitliSablonlar}
                ayarlar={ayarlar}
                setAyarlar={setAyarlar}
                bekleyenBildirim={bekleyenSayisi(hataBildirimi.bildirimler)}
                onYasalAc={() => setEkran('yasal')}
                onGeriBildirimAc={() => setEkran('geri-bildirim')}
                bekleyenGeriBildirim={geriBildirim.bekleyen}
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
                  notlar: gorevler,
                  konuIlerleme,
                  bilinmeyenKartlar,
                  yksKonuTakibi: yksTakip,
                  aylikOzetler,
                  okumaGecmisi,
                  pomodoroGecmis,
                  pomodoroAyar,
                  hedef,
                }}
              />
            )}
          </>
        )}
      </SayfaGecisi>

      <BottomNav
        sekme={sekme}
        onDegis={(yeni) => {
          if (tanitim.tanitimdaMi) {
            if (yeni === 'oyunlar') tanitim.gonder({ tur: 'hedefe-dokun', hedef: 'oyunlar-ac' })
            else if (yeni === 'daha') tanitim.gonder({ tur: 'hedefe-dokun', hedef: 'araclar-ac' })
            else if (yeni === 'harita') tanitim.gonder({ tur: 'hedefe-dokun', hedef: 'harita-ac' })
            return
          }
          if (yeni === sekme) {
            /*
              Zaten açık olan sekmeye yeniden basış: bölümün ilk görünümüne
              dön. Açık her katman (ders, bölüm, oyun, deste, pencere) geri
              tuşuna basılmış gibi kendi kapanış mantığıyla kapanıyor — yarım
              kalan tur ya da deste kaydedilmeden atılmıyor. Genel test ve
              form aynı şekilde geri tuşunun yaptığıyla kapanıyor. Her durumda sayfa
              yumuşakça en üste kayıyor (kök ekrandaysa tek yapılan bu).
            */
            // Genel testin turu bir katmanken onu kendi çıkışı bitiriyor; ikinci
            // kez bitirmek doğru bilinenleri iki kez düşürürdü.
            const kapanan = tumKatmanlariKapat()
            if (kapanan === 0 && genelTest !== null) genelTestiBitir(genelTest)
            setDenemeFormu(null)
            setEkran(null)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
          }
          setEkran(null)
          setSekme(yeni)
        }}
      />

      {!tanitim.tanitimdaMi && <RozetBildirimi
        rozet={bildirimKuyrugu[0] ?? null}
        onBitti={() => setBildirimKuyrugu((onceki) => onceki.slice(1))}
      />}
    </div>
  )

  return (
    <>
      {icerik}
      {pomodoroKalici &&
        (ekran === 'pomodoro' || pomodoroDurumu?.canli === true) &&
        createPortal(
          <PomodoroEkrani
            demoVeri={tanitim.tanitimdaMi}
            ayar={pomodoroAyar}
            seanslar={pomodoroGecmis}
            setAyar={(guncelle) => { if (!tanitim.tanitimdaMi) setPomodoroAyar(guncelle) }}
            onSeansBitti={(seans) => { if (!tanitim.tanitimdaMi) setPomodoroGecmis((o) => [...o, seans]) }}
            gorunur={ekran === 'pomodoro' && denemeFormu === null}
            onDurum={setPomodoroDurumu}
            // `geriGit` değil: o önce üstteki katmanı kapatıyor ve o katman
            // tam da bu çağrıyı yapan sahne — kendini yeniden çağırırdı.
            onArkaPlan={() => setEkran(null)}
            baslatIstegi={pomodoroIstegi}
          />,
          pomodoroKalici,
        )}
      {pomodoroDurumu?.canli && ekran !== 'pomodoro' && genelTest === null && !tanitim.tanitimdaMi && (
        <PomodoroSaati
          durum={pomodoroDurumu}
          onAc={() => {
            setDenemeFormu(null)
            setEkran('pomodoro')
          }}
        />
      )}
      {tanitim.kayitUyarisi && <p role="status" className="mx-auto max-w-md px-4 pb-24 text-sm text-muted-foreground">{tanitim.kayitUyarisi}</p>}
      <SpotIsigi />
      {tanitimSorusuAcik && <TanitimSorusu onCevap={(evet) => tanitim.tercihKaydet(evet ? 'evet' : 'hayir')} />}
      {/* Özet katmanı açılış ekranının **altında**: uygulama açılırken tavşan
          yuvasına inmeli, üstüne kocaman bir hikâye katmanı düşmemeli. */}
      {ozetAcik && ozet && (
        <AylikOzetEkrani
          ozet={ozet}
          // Mini oyun müziği anahtarı kalktı; özetin sesi de artık tek ses
          // tercihine bakıyor.
          sesAcik={ayarlar.oyunSesi}
          onKapat={() => setOzetAcik(null)}
        />
      )}
      {acilisKatmani}
      <CokmeSorusu kol={cokme} />
      {/* Şerit açılış bitip kurulum tamamlanınca: kurulumun ortasına inen bir
          "güncelle" şeridi, ilk açılışta kullanıcıya iki iş birden verirdi. */}
      {acilisBitti && ayarlar.kurulumTamamlandi && !tanitim.tanitimdaMi && <GuncellemeSeridi kol={guncelleme} />}
      {gecis !== 'yok' && <KurulumGecisi soluyor={gecis === 'soluyor'} />}
    </>
  )
}

/**
 * Tablette geniş açılan sayfalar (`sekme:<id>` ya da alt ekranın adı).
 *
 * Bunlar yatay tablette kart yığınını iki sütuna (`tablet-sutunlar`) ya da
 * ızgarayı daha çok sütuna açıyor; en çok 60rem. Listede olmayanlar tek
 * sütun kalıyor ve 40rem'de duruyor: tek sütunlu bir formun kartları 900
 * piksele yayılınca satırlar okunmaz uzunluğa çıkıyordu.
 */
const GENIS_SAYFALAR: ReadonlySet<string> = new Set([
  'sekme:ana',
  'sekme:daha',
  'sekme:oyunlar',
  'sekme:ayarlar',
  'soru',
  'devamsizlik',
  'notlar',
  // İçerik kendi içinde max-w-3xl; ders listesi tablette iki sütun.
  'konu-takibi',
])

/**
 * Ekran geçişini oynatan kutu.
 *
 * `key` **bu bileşene** konuyor, içindeki `div`e değil: sökülmesi gereken şey
 * kutu değil bileşenin kendisi — yalnızca `div` yenilenseydi aşağıdaki state
 * ilk geçişten sonra `true` kalır, duraklatma bir daha hiç çalışmazdı. Kutu **duraklatılmış** doğuyor, iki `requestAnimationFrame` sonra
 * salınıyor: CSS animasyonu öğenin ilk çizildiği karede başlıyor ve o kare, tam
 * da yeni ekranın kurulduğu — düzenin hesaplandığı, görsellerin çözüldüğü — en
 * pahalı kare. Orada başlayan animasyonun ilk kareleri düşüyor ve hareket
 * akmıyor, kasıyor gibi görünüyor.
 *
 * İki kare şart: birincisi tarayıcının kutuyu duraklatılmış hâliyle bir kez
 * boyaması, ikincisi gerçekten kare ürettiğinin kanıtı. Arkasında bir emniyet
 * zamanlayıcısı var, çünkü sayfa görünür değilken `rAF` hiç çağrılmıyor ve
 * duraklatılmış kalan ekran (opaklığı 0'da donmuş) hiç görünmezdi. Açılış
 * ekranındaki `acilis-bekliyor` ile aynı kural, aynı gerekçe.
 */
function SayfaGecisi({
  children,
  anahtar,
  ileri = false,
  sabit = false,
  yavas = false,
  sure = 500,
  genis = false,
}: {
  children: React.ReactNode
  /** Bileşenin `key`i; görüntüsü bu adla saklanıyor. */
  anahtar: string
  ileri?: boolean
  /**
   * Giriş animasyonu yok. Genel test Oyun Bankası'ndan Oyunlar sekmesine
   * geçip oyunu doğrudan tam ekran açıyor; kutunun kayışı sürerken kutu
   * transformlu ve içindeki tam ekran oyun ekrana değil kutuya göre
   * konumlanıyordu — oyun önce kenarları beyaz, dar bir kutuda açılıyor,
   * animasyon bitince birden ekranı kaplıyordu.
   */
  sabit?: boolean
  yavas?: boolean
  sure?: number
  genis?: boolean
}) {
  const [basladi, setBasladi] = useState(false)
  // Kurulurken bir kez: test bitince prop düşüyor ve animasyon o an baştan
  // başlardı.
  const [sabitKalsin] = useState(sabit)
  // Kaydırarak geri gelindiyse ekran soldan geliyor ya da (önizleme zaten
  // yerindeyse) hiç kaymıyor. Kurulurken **bir kez** okunuyor: yön sonradan
  // değişse de başlamış animasyon değişmemeli (bkz. `geriYonunuIsaretle`).
  const [geri] = useState(geriGecisi)
  const kutu = useRef<HTMLDivElement>(null)

  // Sökülürken görüntüsü alınıyor: geri kaydırırken bu ekran altta görünecek
  // (`lib/geri-kaydirma.ts`). Etkinin temizliği DOM sökülmeden önce çalışıyor;
  // öğe yine de baştan yakalanıyor, ref o sırada boşalmış olabilir.
  useLayoutEffect(() => {
    const el = kutu.current
    return () => {
      if (el) ekranGoruntusuKaydet(anahtar, el)
    }
  }, [anahtar])

  useEffect(() => {
    let ikinci = 0
    const birinci = requestAnimationFrame(() => {
      ikinci = requestAnimationFrame(() => setBasladi(true))
    })
    const emniyet = setTimeout(() => setBasladi(true), 400)
    return () => {
      cancelAnimationFrame(birinci)
      cancelAnimationFrame(ikinci)
      clearTimeout(emniyet)
    }
  }, [])

  return (
    <div
      ref={kutu}
      data-geri-sayfa
      className={cn(
        'sayfa-girisi',
        ileri && 'sayfa-ileri',
        geri === 'kayarak' && 'sayfa-geri',
        geri === 'yerinde' && 'sayfa-yerinde',
        !basladi && 'sayfa-bekliyor',
        // Tablette sayfanın en geniş hâli; telefonda bu sınıflar eşleşmiyor.
        'tablet:mx-auto',
        genis ? 'tablet:max-w-[60rem]' : 'tablet:max-w-[40rem]',
      )}
      style={sabitKalsin ? { animation: 'none' } : yavas ? { animationDuration: `${sure}ms` } : undefined}
    >
      {children}
    </div>
  )
}
