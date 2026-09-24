'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  Ayarlar,
  Deneme,
  Devamsizlik,
  GunlukKayit,
  Hedef,
  KazanilanRozet,
  OkulYili,
  OyunId,
  OyunIstatistigi,
  OyunKayitlari,
  OyunTurKaydi,
  PomodoroAyar,
  PomodoroSeans,
  Sablon,
  YanlisSoru,
  Yedek,
} from './types'
import {
  BANKA_SINIRI,
  OYUN_KIMLIKLERI,
  type BankaKaydi,
  type BankaSorusu,
} from './oyunlar/banka'
import { VARSAYILAN_SABLON_ID } from './sablonlar'
import { egitimYili } from './hesap'
import { dakikayiKirp, saatiKirp } from './hatirlatma'
import { yeniId } from './utils'
import { gorevleriNormalize, type Gorev } from './yapilacaklar'
import type { BilinmeyenKart, KonuIlerlemeleri } from './konu/ilerleme'
import type { AylikOzetArsivi } from './ozet'
import { okumaGecmisiniCoz, type OkumaSeansi } from './konu/okuma-suresi'

export const ANAHTARLAR = {
  denemeler: 'rabi-denemeler',
  sablonlar: 'rabi-sablonlar',
  okulYillari: 'rabi-okul-yillari',
  gunlukKayitlar: 'rabi-gunluk-kayitlar',
  devamsizlik: 'rabi-devamsizlik',
  yanlisSorular: 'rabi-yanlis-sorular',
  pomodoroAyar: 'rabi-pomodoro-ayar',
  pomodoroGecmis: 'rabi-pomodoro-gecmis',
  hedef: 'rabi-hedef',
  rozetler: 'rabi-rozetler',
  oyunlar: 'rabi-oyunlar',
  oyunGecmisi: 'rabi-oyun-gecmisi',
  /** Oyun başına yakın zamanda sorulan soru kimlikleri (`lib/oyunlar/gecmis.ts`). */
  soruGecmisi: 'rabi-soru-gecmisi',
  /** Oyun Bankası — mini oyunlarda karıştırılan sorular. */
  oyunBankasi: 'rabi-oyun-bankasi',
  /**
   * Oyun Bankası'ndan şimdiye kadar düşen toplam soru.
   *
   * Düşen kayıt bankadan siliniyor, yani geriye dönük sayılamıyor; rozet bu
   * sayıya baktığı için ayrı bir sayaç olarak birikiyor.
   */
  bankaDusen: 'rabi-banka-dusen',
  /** Konu Anlatımı: konu kimliği → deste sonucu. */
  konuIlerleme: 'rabi-konu-ilerleme',
  /** Konu Anlatımı'nda "bilmiyorum" denen kartlar. */
  bilinmeyenKartlar: 'rabi-bilinmeyen-kartlar',
  /**
   * Konu haritasında en son seçili ders ve sınıf.
   *
   * Yedeğe girmiyor: kısayollarla aynı sebep — bu veri değil, bu cihazda
   * kalınan yer. Yedeği başka telefona yükleyen biri kendi seçimini
   * kaybetmemeli.
   */
  konuSecimi: 'rabi-konu-secimi',
  /**
   * Aylık özetin hangi aylarının izlendiği — 'YYYY-AA' listesi.
   *
   * Anahtar haftalık dönemden kalma; eski listedeki 'YYYY-AA-GG' değerleri
   * hiçbir aya eşleşmediği için zararsız, temizlenmesi gerekmiyor.
   */
  ozetGorulen: 'rabi-ozet-gorulen',
  /**
   * Kapanmış ayların hesaplanmış özetleri, ay anahtarına göre.
   *
   * Özet ekranda **yalnızca ayın 1'inde** görülüyor ama hesabı silinmiyor:
   * ham kayıtlar zamanla budanıyor (yanlış sorular çözülünce düşüyor, oyun
   * geçmişi kısalıyor) ve ileride yıllık özetin dayanacağı tek yer burası.
   * Görülmeyen ay da yazılıyor. Yedeğe giriyor.
   */
  aylikOzetler: 'rabi-aylik-ozetler',
  /**
   * Konu destesinde geçen sürenin seansları. Kullanıcıya gösterilmiyor,
   * yalnızca aylık özet okuyor. Yedeğe giriyor.
   */
  okumaGecmisi: 'rabi-okuma-gecmisi',
  /**
   * Uygulamanın ilk açıldığı gün, 'YYYY-AA-GG'.
   *
   * Aylık özet arşivi buradan başlıyor: kurulumdan önceki aylar için boş
   * kayıt yazılmıyor. Yedeğe **girmiyor** — bu cihazın günü.
   */
  kurulumTarihi: 'rabi-kurulum-tarihi',
  /**
   * Ana sayfadaki kısayolların sırası — en son açılan başta.
   *
   * Yedeğe **girmiyor**: bunlar veri değil, bu cihazdaki kullanım alışkanlığı.
   * Yedeği başka bir telefona yükleyen biri kendi kısayollarını kaybetmemeli.
   */
  sonAraclar: 'rabi-son-araclar',
  sonOyunlar: 'rabi-son-oyunlar',
  /**
   * Bildirilen hatalı sorular — gönderim kuyruğu.
   *
   * Yedeğe **girmiyor**: yedek başka bir cihaza yüklenseydi aynı bildirimler
   * ikinci bir cihaz numarasıyla yeniden gönderilir, tabloda kopya satırlar
   * açardı.
   */
  hataBildirimleri: 'rabi-hata-bildirimleri',
  /**
   * Öneri ve hata bildirimleri — gönderim kuyruğu. Yedeğe girmiyor,
   * `hataBildirimleri` ile aynı sebepten.
   */
  geriBildirimler: 'rabi-geri-bildirimler',
  /**
   * Bildirimleri gruplamaya yarayan okunur cihaz adı (`mavi-tavsan-42`);
   * yedeğe girmiyor.
   *
   * Anahtar bilerek yeni: eski `rabi-cihaz-kimligi` altında okunamayan
   * numaralar (`mtoptoc2-1zvbcy`) duruyordu ve hepsinin yenilenmesi istendi.
   * Anahtarı değiştirmek taşıma kodu yazmadan bunu yapıyor — eski değer
   * okunmuyor, ilk gerekişinde yeni ad üretiliyor.
   */
  cihazKimligi: 'rabi-cihaz-adi',
  /**
   * Hatalı soru bildirimlerinin gönderilmesine izin verildi mi.
   *
   * `'sorulmadi' | 'verildi' | 'reddedildi'`. Google Play'in kullanıcı verisi
   * politikası, veri cihazdan çıkmadan önce **belirgin bir açıklama** ve
   * **kullanıcının olumlu bir eylemi** istiyor; ayarlar ekranındaki bir
   * paragraf bunun yerine geçmiyor. İzin verilene kadar bildirimler cihazda
   * bekliyor, ağa hiçbir şey çıkmıyor.
   *
   * Yedeğe **girmiyor**: rıza cihaz başına verilir, başka telefona taşınmaz.
   */
  bildirimIzni: 'rabi-bildirim-izni',
  /**
   * Yapılacaklar tahtasındaki not kâğıtları — metin, renk ve konum.
   *
   * Konum da veri: kullanıcının kâğıdı nereye yapıştırdığı onun verdiği bilgi.
   */
  notlar: 'rabi-notlar',
  /**
   * Tanıtımı kapatılmış oyunların kimlikleri.
   *
   * Tanıtım her turdan önce çıkıyor ve oyunu ezberleyen için bu bir engel:
   * ayarları seçtikten sonra bir de kuralları geçmek gerekiyor. "Bir daha
   * gösterme" oyunu bu listeye yazıyor, sonraki turlar ayarlardan doğrudan
   * geri sayıma gidiyor. Oyun başına ayrı: birini ezberlemek hepsini
   * ezberlemek değil.
   *
   * Kural yine ulaşılabilir — tur sırasındaki "?" düğmesi tanıtımı bu
   * listeye bakmadan açıyor.
   */
  tanitimGizli: 'rabi-tanitim-gizli',
  /**
   * Tur öncesi seçilen oyun modu — bütün oyunlarda **ortak**.
   *
   * Mod turun nasıl işleyeceğini söylüyor, oyunun ne sorduğunu değil:
   * "Turbo sevdim" diyen kullanıcı bunu her oyunda yeniden seçmemeli.
   */
  oyunModu: 'rabi-oyun-modu',
  /**
   * Tur öncesi seçilen başlangıç zorluğu — oyun başına ayrı, tek anahtarda
   * bir tablo (`Record<OyunId, Zorluk>`).
   *
   * Oyun başına, çünkü zorluk o oyunun sorduğu şeye ait: biri edebiyatta
   * kolayda kalırken sesi zorda oynayabiliyor. Eskiden her oyunun kendi
   * anahtarı vardı (`rabi-zorluk-ses` ve yirmi bir kardeşi) ve yeni bir oyun
   * eklemek yeni bir anahtar açmak demekti; tablo `tanitimGizli` ile aynı
   * kalıpta, oyun listesi büyüyünce anahtar sayısı artmıyor.
   *
   * Tuttuğu şey turun **başlangıcı**; seviye tur içinde kayıyor
   * (`lib/oyunlar/uyum.ts`) ve kaydığı yer buraya yazılmıyor — o, kullanıcının
   * kararı değil turun sonucu.
   */
  oyunZorlugu: 'rabi-oyun-zorlugu',
  ayarlar: 'rabi-ayarlar',
  sonBildirim: 'rabi-son-bildirim',
} as const

/**
 * Artık yazılmayan ama eski kurulumlarda kalmış olabilecek anahtarlar.
 * "Tüm veriyi sil" bunları da temizlemeli, yoksa sıfırlanmış bir uygulamada
 * eski veri artıkları kalırdı. `rabi-tema` de burada: koyu tema kaldırıldı,
 * anahtar eski kurulumlarda duruyor olabilir.
 */
const ESKI_ANAHTARLAR = [
  'rabi-gecmis-yillar',
  'rabi-okul-dersleri',
  // Tavşan özelleştirmesi kaldırıldı; kayıt artık hiçbir yerde okunmuyor.
  'rabi-magaza',
  /*
    Havuç, seviye ve Havuç Mağazası kaldırıldı. Üç anahtar da eski
    kurulumlarda duruyor olabilir; "tüm veriyi sil" onları da temizlemeli.
  */
  'rabi-havuc',
  'rabi-seviye',
  'rabi-jokerler',
  // Koyu tema kaldırıldı; anahtar eski kurulumlarda duruyor olabilir.
  'rabi-tema',
  // "Çöktüğümde sor" anahtarı kaldırıldı: rapor sorusu her çökmeden sonra
  // çıkıyor ve "Gönderme" zaten orada. Kayıt eski kurulumlarda duruyor olabilir.
  'rabi-cokme-sorusu',
  /*
    Ana sayfadaki kısayolları sabitleme kaldırıldı; kutucuklar yalnızca son
    kullanılanlardan geliyor. İki anahtar da eski kurulumlarda duruyor olabilir.
  */
  'rabi-sabit-araclar',
  'rabi-sabit-dersler',
  /*
    Oyuna özgü soru türü seçimleri kaldırıldı; havuzun tamamı soruluyor.

    Mod ve zorluk seçimleri geri geldi ama anahtarları aynı değil:
    `rabi-oyun-modu` yeniden kullanılıyor (aynı şeyi, aynı biçimde tutuyor) ve
    bu yüzden listede **yok**. Zorluk ise oyun başına ayrı anahtarlardan tek
    bir tabloya taşındı (`ANAHTARLAR.oyunZorlugu`), eski anahtarlar aşağıdaki
    desenle siliniyor.
  */
  'rabi-islem-secimi',
  'rabi-yazim-secimi',
  'rabi-bolen-secimi',
]

/**
 * Desenle silinen eski anahtarlar.
 *
 * Zorluk seçimi oyun başına ayrı bir anahtarda duruyordu (`rabi-zorluk-ses`
 * ve yirmi bir kardeşi). Hepsini `ESKI_ANAHTARLAR`a tek tek yazmak, artık
 * hiçbir yerde tanımlı olmayan bir listeyi elle sürdürmek olurdu. Seçim geri
 * geldi ama tek bir tabloda (`ANAHTARLAR.oyunZorlugu`); eski anahtarlar
 * taşınmıyor, siliniyor — aradan geçen sürümlerde seviye zaten tur içinde
 * kayıyordu ve o kayıtlar kullanıcının bugünkü tercihini temsil etmiyor.
 *
 * Desen `rabi-oyun-zorlugu` ile çakışmıyor: o `rabi-oyun-` ile başlıyor.
 */
const ESKI_DESENLER = [/^rabi-zorluk-/]

/**
 * Tek seferlik taşıma: okul notları ders ders girilirken bitmiş yılların
 * ortalamaları `rabi-gecmis-yillar` altında duruyordu. Yeni sistemde hepsi
 * `rabi-okul-yillari` altında; kullanıcı 9, 10, 11. sınıf notlarını yeniden
 * girmek zorunda kalmasın diye kayıtlar olduğu gibi taşınıyor.
 *
 * Ders ders girilmiş **bu yılın** notları taşınmıyor: yeni sistemde her yıl için
 * tek bir ortalama yazılıyor, kullanıcı zaten karnesinden biliyor.
 * Eski anahtar silinmiyor — taşıma yanlış giderse veri elde kalsın.
 */
function okulNotlariniTasi() {
  if (typeof window === 'undefined') return
  try {
    if (localStorage.getItem(ANAHTARLAR.okulYillari) !== null) return
    const eski = localStorage.getItem('rabi-gecmis-yillar')
    if (!eski) return
    const yillar = JSON.parse(eski)
    if (!Array.isArray(yillar) || yillar.length === 0) return
    localStorage.setItem(ANAHTARLAR.okulYillari, JSON.stringify(yillar))
  } catch {
    // Bozuk veri taşımayı engellemesin; kullanıcı notlarını yeniden girer.
  }
}

okulNotlariniTasi()

/**
 * Günlük soru hedefinin sınırları — kurulumdaki ve Ayarlar'daki çubuk aynı
 * aralığı kullanıyor.
 *
 * Üst sınır 800: 500 sınav dönemindeki öğrenciye dar geliyordu ve tavana dayanmış
 * bir hedef, hedef olmaktan çıkıp sınır oluyor. Sayı seçilebilen bir değer olmak
 * zorunda: 800 - 50 = 750 ve bu onun katı, yani tekerlek tam sekiz yüzde
 * bitiyor — erişilemeyen bir tavan göstermiyor.
 *
 * Basamak yirmi beşten on beşe, oradan ona indi. Sürüklenen çubuk zamanında
 * elli'şerdi ve ince basamağa parmakla isabet ettirmek zordu; tekerlekte her
 * basamak kendi satırı olduğu için o sorun yok. On beşer artan bir tekerlek
 * ise akılda tutulan yuvarlak sayıların çoğunu (100, 150, 250, 300) atlıyordu:
 * hedefini "yüz elli soru" diye kuran öğrenci onu listede bulamıyordu. Onar
 * artan basamakta her yuvarlak sayı var; bedeli listenin uzaması ve tekerlekte
 * uzunluğun görünen bir karşılığı yok.
 */
export const HEDEF_EN_AZ = 50
export const HEDEF_EN_COK = 800
export const HEDEF_ADIMI = 10

export const VARSAYILAN_AYARLAR: Ayarlar = {
  varsayilanSablonId: VARSAYILAN_SABLON_ID,
  ad: '',
  buYilSinif: 12,
  elleObp: null,
  sinifYili: egitimYili(),
  // Alan sorulmadan seçilmiş sayılmıyor; kurulumda "Karar vermedim" de bir
  // cevap ve karşılığı bu.
  puanTuru: null,
  gunlukHedef: 200,
  hatirlatmaSaati: 20,
  hatirlatmaDakikasi: 0,
  bildirimAcik: false,
  oyunSesi: true,
  oyunMuzigi: true,
  oyunMuzikTuru: 'mod',
  kurulumTamamlandi: false,
}

/**
 * Saklanan tur kaydı sayısı.
 *
 * Aylık özet kapanan aya bakıyor ve hesap ayın 1'inde yapılıyor; günde on tur
 * oynansa bile 400 kayıt bir aydan uzunu kapsıyor. Sınırsız büyütmenin tek
 * etkisi localStorage kotasını yemek olurdu.
 */
/**
 * Bir tura yazılabilecek en uzun süre, saniye.
 *
 * Tur sabit uzunlukta değil: modun kuralına göre bitiyor ve iyi bir oyuncuda
 * dakikalarca gidebiliyor. Bu sınır turu kısıtlamıyor, yalnızca bozuk ya da
 * elle kurcalanmış bir kaydın istatistiği uçurmasını engelliyor.
 */
export const TUR_EN_UZUN = 3600

export const OYUN_GECMIS_SINIRI = 400

export const VARSAYILAN_POMODORO: PomodoroAyar = {
  calisma: 25,
  kisaMola: 5,
  uzunMola: 15,
  turSayisi: 4,
  ses: 'yok',
  sesSeviyesi: 0.5,
  ekraniAcikTut: false,
  odakKilidi: false,
  rahatsizEtme: false,
  kilitliUygulamalar: [],
  kilitTanitimiGoruldu: false,
}

/**
 * Kayıtlı pomodoro ayarını güncel şemaya taşır.
 *
 * Odak kilidi alanları sonradan eklendi; eski kurulumlarda hiç yok ve
 * kilitliUygulamalar undefined kalırsa ekran uzunluğunu okurken çöker.
 */
export function pomodoroAyariniNormalize(
  ham: Partial<PomodoroAyar> | null | undefined,
): PomodoroAyar {
  const birlesik = { ...VARSAYILAN_POMODORO, ...(ham ?? {}) }
  return {
    ...birlesik,
    odakKilidi: birlesik.odakKilidi === true,
    // Eski kurulumlarda alan yok; kilit varken sessizce Rahatsız Etme'ye
    // geçen bir güncelleme, kullanıcının haberi olmadan telefonunu susturur.
    rahatsizEtme: birlesik.rahatsizEtme === true,
    kilitliUygulamalar: Array.isArray(birlesik.kilitliUygulamalar)
      ? birlesik.kilitliUygulamalar.filter((paket) => typeof paket === 'string')
      : [],
    kilitTanitimiGoruldu: birlesik.kilitTanitimiGoruldu === true,
  }
}

/**
 * Kayıtlı ayarları güncel şemaya taşır. Sürüm yükseltmesinde eksik alan kalırsa
 * (örn. `gunlukHedef`) hesaplar NaN üretir; varsayılanlarla doldurulur.
 */
export function ayarlariNormalize(ham: Partial<Ayarlar> | null | undefined): Ayarlar {
  const birlesik = { ...VARSAYILAN_AYARLAR, ...(ham ?? {}) }
  return {
    ...birlesik,
    sinifYili: Number.isFinite(birlesik.sinifYili) ? birlesik.sinifYili : egitimYili(),
    // Bozuk kayıtta (NaN → JSON `null`) sınıf son sınıfa düşüyor; NaN geri
    // sayımı on iki yıl ileri atıyor, OBP hesabını da bozuyordu.
    buYilSinif: Number.isFinite(birlesik.buYilSinif) ? birlesik.buYilSinif : VARSAYILAN_AYARLAR.buYilSinif,
    // Eski kurulumlarda alan yok; sayı olmayan her şey "girilmemiş" sayılıyor.
    elleObp: Number.isFinite(birlesik.elleObp as number) ? (birlesik.elleObp as number) : null,
    hatirlatmaSaati: saatiKirp(birlesik.hatirlatmaSaati),
    hatirlatmaDakikasi: dakikayiKirp(birlesik.hatirlatmaDakikasi),
    gunlukHedef: Number.isFinite(birlesik.gunlukHedef) && birlesik.gunlukHedef > 0
      ? birlesik.gunlukHedef
      : VARSAYILAN_AYARLAR.gunlukHedef,
    // Alan artık okunmuyor (oyun müziği kaldırıldı) ama yedek uyumluluğu için
    // bilinen ikiliye zorlanmaya devam ediyor; eski kurulumlarda 'sakin' var.
    oyunMuzikTuru: birlesik.oyunMuzikTuru === 'lofi' ? 'lofi' : 'mod',
  }
}

function oku<T>(anahtar: string, varsayilan: T): T {
  if (typeof window === 'undefined') return varsayilan
  try {
    const ham = localStorage.getItem(anahtar)
    return ham ? (JSON.parse(ham) as T) : varsayilan
  } catch {
    return varsayilan
  }
}

function yaz<T>(anahtar: string, deger: T) {
  try {
    localStorage.setItem(anahtar, JSON.stringify(deger))
  } catch {
    // kota dolu / gizli sekme — sessizce geç, uygulama çalışmaya devam etsin
  }
}

/**
 * localStorage destekli state.
 * İlk okuma useEffect içinde yapılır: statik export'ta sunucu HTML'i ile
 * istemci ilk boyaması aynı olmalı, yoksa hydration hatası çıkar.
 * `hazir` bayrağı, veri okunmadan "kayıt yok" ekranı göstermeyi engeller.
 */
export function useYerelDepo<T>(anahtar: string, varsayilan: T) {
  const [deger, setDegerState] = useState<T>(varsayilan)
  const [hazir, setHazir] = useState(false)
  const varsayilanRef = useRef(varsayilan)
  const yazildiRef = useRef(false)

  useEffect(() => {
    // İlk okuma, kullanıcının bu arada yaptığı değişikliği ezmemeli: kayıt yapıldıysa
    // state'e dokunma. (Yeniden derleme/geç mount durumlarında veri kaybını önler.)
    setDegerState((mevcut) =>
      yazildiRef.current ? mevcut : oku<T>(anahtar, varsayilanRef.current),
    )
    setHazir(true)
  }, [anahtar])

  const setDeger = useCallback(
    (guncelleyici: T | ((onceki: T) => T)) => {
      yazildiRef.current = true
      // Yazma her zaman fonksiyonel güncelleyicinin içinde: eskimiş closure riski kalmasın.
      setDegerState((onceki) => {
        const sonraki =
          typeof guncelleyici === 'function'
            ? (guncelleyici as (o: T) => T)(onceki)
            : guncelleyici
        yaz(anahtar, sonraki)
        return sonraki
      })
    },
    [anahtar],
  )

  return [deger, setDeger, hazir] as const
}

/** Hook dışından tek seferlik okuma/yazma (bildirim zamanlaması gibi yan işler için). */
export const depo = { oku, yaz }

// ---------------------------------------------------------------------------
// Yedekleme
// ---------------------------------------------------------------------------

export function yedekOlustur(veri: Omit<Yedek, 'uygulama' | 'surum' | 'tarih'>): Yedek {
  return {
    uygulama: 'rabi',
    surum: 1,
    tarih: new Date().toISOString(),
    ...veri,
  }
}

function dizi<T>(deger: unknown): T[] {
  return Array.isArray(deger) ? (deger as T[]) : []
}

/**
 * Yedekten okul yıllarını çıkarır.
 *
 * Eski yedeklerde alan `gecmisYillar` adındaydı ve yalnızca bitmiş yılları
 * tutuyordu (o zamanlar içinde bulunulan yıl ders ders giriliyordu, `okulDersleri`
 * altında). Ders sistemi kaldırıldığı için o alan artık okunmuyor; geçmiş yıllar
 * ise birebir taşınıyor, kullanıcı onları yeniden girmek zorunda kalmasın.
 *
 * Kimlik eksikse üretiliyor. Kimlik yalnızca liste anahtarı değil **silme ölçütü**:
 * boş kalsaydı bir yılı silmek `filter((y) => y.id !== silinen.id)` ile hepsini
 * birden silerdi.
 */
function okulYillariniCoz(nesne: Record<string, unknown>): OkulYili[] {
  const ham = Array.isArray(nesne.okulYillari)
    ? (nesne.okulYillari as OkulYili[])
    : dizi<OkulYili>(nesne.gecmisYillar)

  return ham
    .filter((y) => Number.isFinite(y?.sinif) && Number.isFinite(y?.ortalama))
    .map((y) => ({ ...y, id: y.id || yeniId() }))
}

/**
 * Yapıştırılan/yüklenen JSON'u doğrular. Bozuk dosya sessizce veriyi silmesin diye
 * yalnızca imzası doğru olan yedekler kabul edilir.
 */
export function yedegiDogrula(ham: string): { yedek: Yedek } | { hata: string } {
  let veri: unknown
  try {
    veri = JSON.parse(ham)
  } catch {
    return { hata: 'Dosya geçerli bir JSON değil.' }
  }

  if (typeof veri !== 'object' || veri === null) {
    return { hata: 'Yedek içeriği okunamadı.' }
  }

  const nesne = veri as Record<string, unknown>
  if (nesne.uygulama !== 'rabi') {
    return { hata: 'Bu dosya Rabi yedeği değil.' }
  }

  return {
    yedek: {
      uygulama: 'rabi',
      surum: 1,
      tarih: typeof nesne.tarih === 'string' ? nesne.tarih : new Date().toISOString(),
      denemeler: dizi<Deneme>(nesne.denemeler),
      sablonlar: dizi<Sablon>(nesne.sablonlar),
      okulYillari: okulYillariniCoz(nesne),
      gunlukKayitlar: dizi<GunlukKayit>(nesne.gunlukKayitlar),
      devamsizlik: dizi<Devamsizlik>(nesne.devamsizlik),
      yanlisSorular: dizi<YanlisSoru>(nesne.yanlisSorular),
      rozetler: dizi<KazanilanRozet>(nesne.rozetler),
      oyunlar: oyunKayitlariniCoz(nesne.oyunlar),
      oyunGecmisi: oyunGecmisiniCoz(nesne.oyunGecmisi),
      oyunBankasi: bankayiCoz(nesne.oyunBankasi),
      bankaDusen: sayi(nesne.bankaDusen),
      notlar: gorevleriNormalize(nesne.notlar),
      // Eski yedeklerde alan yok; undefined kalıyor ve geri yüklemede
      // kullanıcının mevcut konu kaydına dokunulmuyor.
      konuIlerleme: nesne.konuIlerleme as KonuIlerlemeleri | undefined,
      aylikOzetler: nesne.aylikOzetler as AylikOzetArsivi | undefined,
      okumaGecmisi: Array.isArray(nesne.okumaGecmisi) ? okumaGecmisiniCoz(nesne.okumaGecmisi) : undefined,
      bilinmeyenKartlar: Array.isArray(nesne.bilinmeyenKartlar)
        ? (nesne.bilinmeyenKartlar as BilinmeyenKart[])
        : undefined,
      pomodoroGecmis: dizi<PomodoroSeans>(nesne.pomodoroGecmis),
      // Eski yedeklerde alan yok; undefined kalıyor ve geri yüklemede
      // kullanıcının mevcut pomodoro ayarına dokunulmuyor.
      pomodoroAyar: nesne.pomodoroAyar
        ? pomodoroAyariniNormalize(nesne.pomodoroAyar as Partial<PomodoroAyar>)
        : undefined,
      hedef: (nesne.hedef as Hedef | null) ?? null,
      // Yedek yükleyen kullanıcı uygulamayı zaten kurmuş demektir; kurulum tekrar sorulmaz
      ayarlar: { ...ayarlariNormalize(nesne.ayarlar as Ayarlar), kurulumTamamlandi: true },
      resimler: resimHaritasi(nesne.resimler),
    },
  }
}

/**
 * Yedekteki mini oyun istatistiklerini süzer.
 *
 * Mini oyunlar yedeğe sonradan eklendi; eski yedeklerde alan hiç yok, o zaman
 * boş kayıt dönüyor. Sayı olmayan alanlar 0'a çekiliyor: bozuk bir sayı rozet
 * eşiklerinde NaN karşılaştırmasına dönüşür, rozet sessizce hiç gelmezdi.
 */
function oyunKayitlariniCoz(ham: unknown): OyunKayitlari {
  if (typeof ham !== 'object' || ham === null) return {}
  const temiz: OyunKayitlari = {}

  for (const [id, deger] of Object.entries(ham as Record<string, unknown>)) {
    if (typeof deger !== 'object' || deger === null) continue
    const i = deger as Partial<OyunIstatistigi>
    temiz[id as OyunId] = {
      enIyiDogru: sayi(i.enIyiDogru),
      enIyiSeri: sayi(i.enIyiSeri),
      oynananTur: sayi(i.oynananTur),
      toplamDogru: sayi(i.toplamDogru),
      toplamYanlis: sayi(i.toplamYanlis),
      hatasizTur: sayi(i.hatasizTur),
      sonTarih: typeof i.sonTarih === 'string' ? i.sonTarih : '',
    }
  }
  return temiz
}

/**
 * Yedekteki tur geçmişini süzer.
 *
 * Yalnızca tarihi ve oyunu tanınan kayıtlar geçiyor. Süre `TUR_EN_UZUN`u aşamaz:
 * bozuk tek bir kayıt aylık özette "oyunda 9 saat geçirdin" gibi saçma bir
 * sayıya dönüşürdü.
 */
function oyunGecmisiniCoz(ham: unknown): OyunTurKaydi[] {
  if (!Array.isArray(ham)) return []
  return (ham as Partial<OyunTurKaydi>[])
    .filter((k) => typeof k?.tarih === 'string' && OYUN_KIMLIKLERI.includes(k.oyun as OyunId))
    .map((k) => ({
      tarih: k.tarih as string,
      oyun: k.oyun as OyunId,
      saniye: Math.min(TUR_EN_UZUN, sayi(k.saniye)),
      dogru: sayi(k.dogru),
      // Eksik olabilir; `undefined` bırakılıyor, sıfıra çevrilmiyor: sıfır
      // yanlış "hatasız tur" demek ve eski kayıtları hak etmedikleri bir
      // isabet oranına sokardı.
      ...(typeof k.yanlis === 'number' ? { yanlis: sayi(k.yanlis) } : {}),
      ...(typeof k.hatasiz === 'boolean' ? { hatasiz: k.hatasiz } : {}),
    }))
    .slice(-OYUN_GECMIS_SINIRI)
}

/**
 * Yedekteki Oyun Bankası'nı süzer.
 *
 * Kayıt kendi soru nesnesini taşıdığı için doğrulama soru tipine iniyor:
 * `soru.oyun` tanınmıyorsa ya da içindeki alanlar eksikse kayıt atılıyor.
 * Yarım bir kayıt bankada duruyor ama açılınca ekranı çökertirdi.
 */
function bankayiCoz(ham: unknown): BankaKaydi[] {
  if (!Array.isArray(ham)) return []

  return (ham as Partial<BankaKaydi>[])
    .filter((k): k is BankaKaydi => {
      if (typeof k?.id !== 'string') return false
      const s = k.soru as BankaSorusu | undefined
      if (!s) return false
      if (s.oyun === 'yazim') return typeof s.dogru === 'string' && typeof s.yanlis === 'string'
      if (s.oyun === 'islem') return typeof s.metin === 'string' && typeof s.sonuc === 'number'
      if (s.oyun === 'edebiyat') return typeof s.eser === 'string' && typeof s.yazar === 'string'
      if (s.oyun === 'ses')
        return typeof s.kelime === 'string' && typeof s.olusum === 'string' && typeof s.olay === 'string'
      if (s.oyun === 'soz')
        return (
          typeof s.soz === 'string' &&
          typeof s.anlam === 'string' &&
          typeof s.sozTuru === 'string' &&
          typeof s.konu === 'string'
        )
      if (s.oyun === 'harita')
      return (
        typeof s.il === 'string' &&
        (s.haritaTipi === 'bul' || s.haritaTipi === 'sec')
      )
    if (s.oyun === 'bolunme')
        return (
          typeof s.sayi === 'number' &&
          typeof s.bolen === 'number' &&
          s.bolen > 1 &&
          (s.bolunmeTipi === 'kalan' || s.bolunmeTipi === 'bolunur')
        )
      if (s.oyun === 'oge')
        return (
          typeof s.once === 'string' &&
          typeof s.oge === 'string' &&
          typeof s.sonra === 'string' &&
          typeof s.ogeTuru === 'string'
        )
      // Geometri kayıtları şekli kendileri üretiyor; eksik bir açı ya da kenar
      // çizim sırasında NaN koordinat demek olurdu.
      if (s.oyun === 'aci')
        return (
          typeof s.aci?.kural === 'string' &&
          typeof s.aci?.a === 'number' &&
          typeof s.aci?.cevap === 'number'
        )
      if (s.oyun === 'antlasma')
        return typeof s.madde === 'string' && typeof s.antlasma === 'string'
      if (s.oyun === 'kavram')
        return typeof s.kavram === 'string' && typeof s.tanim === 'string'
      if (s.oyun === 'anlatim')
        return (
          typeof s.cumle === 'string' &&
          typeof s.duzeltme === 'string' &&
          typeof s.bozuklukTuru === 'string'
        )
      // Sayı tam kare olmamalı: olsaydı aralık sorusunun cevabı yok demektir.
      if (s.oyun === 'koklu')
        return (
          typeof s.sayi === 'number' &&
          s.sayi > 1 &&
          !Number.isInteger(Math.sqrt(s.sayi))
        )
      // Şıklar kayıttan yeniden kuruluyor; eksik çeldirici üç şıklı bir soru
      // demek olurdu.
      if (s.oyun === 'ortak' || s.oyun === 'siniflandirma')
        return (
          typeof s.biyoloji?.soru === 'string' &&
          typeof s.biyoloji?.dogru === 'string' &&
          Array.isArray(s.biyoloji?.celdiriciler) &&
          s.biyoloji.celdiriciler.length === 3
        )
      // İpuçları olmadan kart açılamaz; üçü de yerinde olmalı.
      if (s.oyun === 'hucre')
        return (
          typeof s.hucre?.organel === 'string' &&
          Array.isArray(s.hucre?.ipuclari) &&
          s.hucre.ipuclari.length === 3
        )
      if (s.oyun === 'ucgen')
        return (
          typeof s.ucgen?.tur === 'string' &&
          typeof s.ucgen?.bilinmeyen === 'string' &&
          typeof s.ucgen?.hipotenus?.kat === 'number' &&
          typeof s.ucgen?.celdirici?.kat === 'number'
        )
      return false
    })
    .map((k) => ({
      ...k,
      kacKez: Math.max(1, sayi(k.kacKez)),
      eklenme: typeof k.eklenme === 'string' ? k.eklenme : '',
      sonYanlis: typeof k.sonYanlis === 'string' ? k.sonYanlis : '',
    }))
    .slice(-BANKA_SINIRI)
}

function sayi(deger: unknown): number {
  return typeof deger === 'number' && Number.isFinite(deger) && deger > 0 ? Math.floor(deger) : 0
}

/** Yedekteki fotoğraf haritasını süzer — yalnızca `data:` ile başlayan değerler. */
function resimHaritasi(ham: unknown): Record<string, string> | undefined {
  if (typeof ham !== 'object' || ham === null) return undefined
  const temiz: Record<string, string> = {}
  for (const [anahtar, deger] of Object.entries(ham as Record<string, unknown>)) {
    if (typeof deger === 'string' && deger.startsWith('data:')) temiz[anahtar] = deger
  }
  return Object.keys(temiz).length > 0 ? temiz : undefined
}

/**
 * Yedeği localStorage'a yazar; çağıran taraf sayfayı yeniler.
 *
 * Fotoğraflar burada değil, `yedegiUygulaResimler` ile ayrı yazılıyor
 * (IndexedDB eşzamansız). Bu fonksiyon, fotoğrafı gelmemiş yanlış soru
 * kayıtlarını **eliyor**: görüntüsü olmayan kart galeride boş bir kare olurdu.
 */
export function yedegiUygula(yedek: Yedek) {
  const gelenResimler = new Set(Object.keys(yedek.resimler ?? {}))

  yaz(ANAHTARLAR.denemeler, yedek.denemeler)
  yaz(ANAHTARLAR.sablonlar, yedek.sablonlar)
  yaz(ANAHTARLAR.okulYillari, yedek.okulYillari)
  yaz(ANAHTARLAR.gunlukKayitlar, yedek.gunlukKayitlar)
  yaz(ANAHTARLAR.devamsizlik, yedek.devamsizlik)
  yaz(
    ANAHTARLAR.yanlisSorular,
    yedek.yanlisSorular.filter((s) => gelenResimler.has(s.resimId)),
  )
  yaz(ANAHTARLAR.rozetler, yedek.rozetler)
  yaz(ANAHTARLAR.oyunlar, yedek.oyunlar)
  yaz(ANAHTARLAR.oyunGecmisi, yedek.oyunGecmisi)
  yaz(ANAHTARLAR.oyunBankasi, yedek.oyunBankasi ?? [])
  yaz(ANAHTARLAR.bankaDusen, yedek.bankaDusen ?? 0)
  // Eski yedeklerde konu kaydı yok; boş yazmak okunan konuları silerdi.
  if (yedek.konuIlerleme) yaz(ANAHTARLAR.konuIlerleme, yedek.konuIlerleme)
  // Arşiv birleştiriliyor, üstüne yazılmıyor: bu cihazda biriken aylar
  // yedekteki eski aylarla yan yana durmalı.
  if (yedek.okumaGecmisi) yaz(ANAHTARLAR.okumaGecmisi, yedek.okumaGecmisi)
  if (yedek.aylikOzetler) {
    yaz(ANAHTARLAR.aylikOzetler, { ...oku<AylikOzetArsivi>(ANAHTARLAR.aylikOzetler, {}), ...yedek.aylikOzetler })
  }
  if (yedek.bilinmeyenKartlar) yaz(ANAHTARLAR.bilinmeyenKartlar, yedek.bilinmeyenKartlar)
  // Eski yedeklerde tahta yok; boş dizi yazmak kullanıcının kâğıtlarını silerdi.
  if (yedek.notlar) yaz(ANAHTARLAR.notlar, yedek.notlar)
  yaz(ANAHTARLAR.pomodoroGecmis, yedek.pomodoroGecmis)
  // Eski yedeklerde alan yok; o zaman kullanıcının mevcut ayarı korunuyor.
  if (yedek.pomodoroAyar) yaz(ANAHTARLAR.pomodoroAyar, yedek.pomodoroAyar)
  yaz(ANAHTARLAR.hedef, yedek.hedef)
  yaz(ANAHTARLAR.ayarlar, yedek.ayarlar)
}

/** Geri yüklemede elenen yanlış soru sayısı — kullanıcıya söylemek için. */
export function elenenSoruSayisi(yedek: Yedek): number {
  const gelen = new Set(Object.keys(yedek.resimler ?? {}))
  return yedek.yanlisSorular.filter((s) => !gelen.has(s.resimId)).length
}

export function tumVeriyiSil() {
  for (const anahtar of [...Object.values(ANAHTARLAR), ...ESKI_ANAHTARLAR]) {
    try {
      localStorage.removeItem(anahtar)
    } catch {
      // yoksay
    }
  }

  try {
    // Desenle eşleşenler: liste kopyalanıyor çünkü silmek `key(i)` sırasını
    // kaydırıyor ve indeksle dönen bir döngü aradan atlardı.
    const eslesenler: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const anahtar = localStorage.key(i)
      if (anahtar !== null && ESKI_DESENLER.some((desen) => desen.test(anahtar))) {
        eslesenler.push(anahtar)
      }
    }
    for (const anahtar of eslesenler) localStorage.removeItem(anahtar)
  } catch {
    // yoksay
  }
}
