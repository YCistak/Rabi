'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  Ayarlar,
  Deneme,
  Devamsizlik,
  DonemNotlari,
  GecmisYil,
  GunlukKayit,
  Hedef,
  KazanilanRozet,
  OkulDersi,
  PomodoroAyar,
  Sablon,
  Yedek,
} from './types'
import { VARSAYILAN_SABLON_ID } from './sablonlar'
import { egitimYili } from './hesap'

export const ANAHTARLAR = {
  denemeler: 'rabi-denemeler',
  sablonlar: 'rabi-sablonlar',
  okulDersleri: 'rabi-okul-dersleri',
  gecmisYillar: 'rabi-gecmis-yillar',
  gunlukKayitlar: 'rabi-gunluk-kayitlar',
  devamsizlik: 'rabi-devamsizlik',
  yanlisSorular: 'rabi-yanlis-sorular',
  pomodoroAyar: 'rabi-pomodoro-ayar',
  pomodoroGecmis: 'rabi-pomodoro-gecmis',
  hedef: 'rabi-hedef',
  rozetler: 'rabi-rozetler',
  ayarlar: 'rabi-ayarlar',
  tema: 'rabi-tema',
  sonBildirim: 'rabi-son-bildirim',
} as const

/** Görünüm tercihleri veriye dahil değildir; sıfırlama ve yedekleme bunlara dokunmaz. */
const GORUNUM_ANAHTARLARI: string[] = [ANAHTARLAR.tema]

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

export const BOS_DONEM: DonemNotlari = {
  yazili1: null,
  yazili2: null,
  sozlu1: null,
  sozlu2: null,
  proje: null,
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

/** Kayıtlı dersi güncel şemaya taşır. */
export function dersiNormalize(ham: OkulDersi): OkulDersi {
  return {
    ...ham,
    projeVar: ham.projeVar ?? false,
    donem1: { ...BOS_DONEM, ...(ham.donem1 ?? {}) },
    donem2: { ...BOS_DONEM, ...(ham.donem2 ?? {}) },
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
// Fotoğraflar (IndexedDB) yedeğe girmez — dosya boyutu paylaşılamaz hâle getirir.
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
      okulDersleri: dizi<OkulDersi>(nesne.okulDersleri),
      gecmisYillar: dizi<GecmisYil>(nesne.gecmisYillar),
      gunlukKayitlar: dizi<GunlukKayit>(nesne.gunlukKayitlar),
      devamsizlik: dizi<Devamsizlik>(nesne.devamsizlik),
      rozetler: dizi<KazanilanRozet>(nesne.rozetler),
      hedef: (nesne.hedef as Hedef | null) ?? null,
      // Yedek yükleyen kullanıcı uygulamayı zaten kurmuş demektir; kurulum tekrar sorulmaz
      ayarlar: { ...ayarlariNormalize(nesne.ayarlar as Ayarlar), kurulumTamamlandi: true },
    },
  }
}

/** Yedeği doğrudan localStorage'a yazar; çağıran taraf sayfayı yeniler. */
export function yedegiUygula(yedek: Yedek) {
  yaz(ANAHTARLAR.denemeler, yedek.denemeler)
  yaz(ANAHTARLAR.sablonlar, yedek.sablonlar)
  yaz(ANAHTARLAR.okulDersleri, yedek.okulDersleri)
  yaz(ANAHTARLAR.gecmisYillar, yedek.gecmisYillar)
  yaz(ANAHTARLAR.gunlukKayitlar, yedek.gunlukKayitlar)
  yaz(ANAHTARLAR.devamsizlik, yedek.devamsizlik)
  yaz(ANAHTARLAR.rozetler, yedek.rozetler)
  yaz(ANAHTARLAR.hedef, yedek.hedef)
  yaz(ANAHTARLAR.ayarlar, yedek.ayarlar)
}

export function tumVeriyiSil() {
  for (const anahtar of Object.values(ANAHTARLAR)) {
    if (GORUNUM_ANAHTARLARI.includes(anahtar)) continue
    try {
      localStorage.removeItem(anahtar)
    } catch {
      // yoksay
    }
  }
}
