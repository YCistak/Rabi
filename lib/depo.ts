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
  PomodoroAyar,
  Sablon,
  YanlisSoru,
  Yedek,
} from './types'
import { VARSAYILAN_SABLON_ID } from './sablonlar'
import { egitimYili } from './hesap'
import { yeniId } from './utils'

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
  /** Zihinden İşlem'de seçili işlem türleri — yedeğe girmeyen küçük bir tercih. */
  islemSecimi: 'rabi-islem-secimi',
  ayarlar: 'rabi-ayarlar',
  tema: 'rabi-tema',
  sonBildirim: 'rabi-son-bildirim',
} as const

/** Görünüm tercihleri veriye dahil değildir; sıfırlama ve yedekleme bunlara dokunmaz. */
const GORUNUM_ANAHTARLARI: string[] = [ANAHTARLAR.tema]

/**
 * Artık yazılmayan ama eski kurulumlarda kalmış olabilecek anahtarlar.
 * "Tüm veriyi sil" bunları da temizlemeli, yoksa sıfırlanmış bir uygulamada
 * eski veri artıkları kalırdı.
 */
const ESKI_ANAHTARLAR = ['rabi-gecmis-yillar', 'rabi-okul-dersleri']

/**
 * Tek seferlik taşıma: okul notları ders ders girilirken bitmiş yılların
 * ortalamaları `rabi-gecmis-yillar` altında duruyordu. Yeni sistemde hepsi
 * `rabi-okul-yillari` altında; kullanıcı 9, 10, 11. sınıf notlarını yeniden
 * girmek zorunda kalmasın diye kayıtlar olduğu gibi taşınıyor.
 *
 * Ders ders girilmiş **bu yılın** notları taşınmıyor: yeni sistemde onun yerine
 * tek bir "1. dönem sonu" notu yazılıyor, kullanıcı zaten karnesinden biliyor.
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

export const VARSAYILAN_AYARLAR: Ayarlar = {
  varsayilanSablonId: VARSAYILAN_SABLON_ID,
  buYilSinif: 12,
  sinifYili: egitimYili(),
  puanTuru: 'ea',
  gunlukHedef: 200,
  hatirlatmaSaati: 20,
  bildirimAcik: false,
  kurulumTamamlandi: false,
}

export const VARSAYILAN_POMODORO: PomodoroAyar = {
  calisma: 25,
  kisaMola: 5,
  uzunMola: 15,
  turSayisi: 4,
  ses: 'yok',
  sesSeviyesi: 0.5,
  ekraniAcikTut: false,
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
    gunlukHedef: Number.isFinite(birlesik.gunlukHedef) && birlesik.gunlukHedef > 0
      ? birlesik.gunlukHedef
      : VARSAYILAN_AYARLAR.gunlukHedef,
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
      oynananTur: sayi(i.oynananTur),
      toplamDogru: sayi(i.toplamDogru),
      toplamYanlis: sayi(i.toplamYanlis),
      hatasizTur: sayi(i.hatasizTur),
      sonTarih: typeof i.sonTarih === 'string' ? i.sonTarih : '',
    }
  }
  return temiz
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
    if (GORUNUM_ANAHTARLARI.includes(anahtar)) continue
    try {
      localStorage.removeItem(anahtar)
    } catch {
      // yoksay
    }
  }
}
