'use client'

import { useCallback, useEffect, useState } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import type {
  Ayarlar,
  Deneme,
  Devamsizlik,
  GecmisYil,
  GunlukKayit,
  Hedef,
  KazanilanRozet,
  OkulDersi,
  Sablon,
} from '@/lib/types'
import { ANAHTARLAR, VARSAYILAN_AYARLAR, ayarlariNormalize, useYerelDepo } from '@/lib/depo'
import { sablonlariBirlestir } from '@/lib/sablonlar'
import { egitimYili, ilerlemisSinif } from '@/lib/hesap'
import type { Ekran, Sekme } from '@/lib/gezinme'
import { BottomNav } from '@/components/bottom-nav'
import { Kurulum } from '@/components/kurulum'
import { AnaSayfa } from '@/components/ekranlar/ana-sayfa'
import { KartMenusu } from '@/components/ekranlar/kart-menusu'
import { Yakinda } from '@/components/ekranlar/yakinda'

export function AppShell() {
  const [sekme, setSekme] = useState<Sekme>('ana')
  const [ekran, setEkran] = useState<Ekran | null>(null)

  const [ayarlarHam, setAyarlar, ayarlarHazir] = useYerelDepo<Ayarlar>(
    ANAHTARLAR.ayarlar,
    VARSAYILAN_AYARLAR,
  )
  const ayarlar = ayarlariNormalize(ayarlarHam)

  const [denemeler, setDenemeler] = useYerelDepo<Deneme[]>(ANAHTARLAR.denemeler, [])
  const [kayitliSablonlar, setSablonlar] = useYerelDepo<Sablon[]>(ANAHTARLAR.sablonlar, [])
  const [okulDersleri, setOkulDersleri] = useYerelDepo<OkulDersi[]>(ANAHTARLAR.okulDersleri, [])
  const [gecmisYillar, setGecmisYillar] = useYerelDepo<GecmisYil[]>(ANAHTARLAR.gecmisYillar, [])
  const [gunlukKayitlar, setGunlukKayitlar] = useYerelDepo<GunlukKayit[]>(
    ANAHTARLAR.gunlukKayitlar,
    [],
  )
  const [devamsizlik, setDevamsizlik] = useYerelDepo<Devamsizlik[]>(ANAHTARLAR.devamsizlik, [])
  const [rozetler, setRozetler] = useYerelDepo<KazanilanRozet[]>(ANAHTARLAR.rozetler, [])
  const [hedef, setHedef] = useYerelDepo<Hedef | null>(ANAHTARLAR.hedef, null)

  const sablonlar = sablonlariBirlestir(kayitliSablonlar)

  // Eylülde yeni ders yılı başlayınca kullanıcı bir üst sınıfa kendiliğinden geçer.
  useEffect(() => {
    if (!ayarlarHazir || !ayarlarHam.kurulumTamamlandi) return
    const buYil = egitimYili()
    const yeniSinif = ilerlemisSinif(ayarlarHam.buYilSinif, ayarlarHam.sinifYili, buYil)
    if (yeniSinif !== ayarlarHam.buYilSinif || buYil !== ayarlarHam.sinifYili) {
      setAyarlar((o) => ({ ...o, buYilSinif: yeniSinif, sinifYili: buYil }))
    }
  }, [ayarlarHazir, ayarlarHam.kurulumTamamlandi, ayarlarHam.buYilSinif, ayarlarHam.sinifYili, setAyarlar])

  const geriGit = useCallback(() => {
    // Önce alt ekran kapanır, sonra ana sekmeye dönülür; ana sayfadaysak uygulamadan çıkılır.
    if (ekran !== null) {
      setEkran(null)
      return true
    }
    if (sekme !== 'ana') {
      setSekme('ana')
      return true
    }
    return false
  }, [ekran, sekme])

  // Android donanım geri tuşu
  useEffect(() => {
    const dinleyici = CapacitorApp.addListener('backButton', () => {
      if (!geriGit()) void CapacitorApp.exitApp()
    })
    return () => {
      void dinleyici.then((d) => d.remove())
    }
  }, [geriGit])

  const kartAc = useCallback((yeni: Ekran) => setEkran(yeni), [])

  // Veri okunmadan ekran çizilirse "kayıt yok" bir an yanıp söner.
  if (!ayarlarHazir) return <Yukleniyor />

  if (!ayarlar.kurulumTamamlandi) {
    return (
      <Kurulum
        onBitir={(secimler) =>
          setAyarlar((o) => ({
            ...ayarlariNormalize(o),
            ...secimler,
            sinifYili: egitimYili(),
            kurulumTamamlandi: true,
          }))
        }
      />
    )
  }

  return (
    <div className="mx-auto min-h-dvh max-w-md px-4 pb-24 pt-5">
      {ekran !== null ? (
        <Yakinda ekran={ekran} onGeri={() => setEkran(null)} />
      ) : (
        <>
          {sekme === 'ana' && (
            <AnaSayfa
              ayarlar={ayarlar}
              gunlukKayitlar={gunlukKayitlar}
              devamsizlik={devamsizlik}
              hedef={hedef}
              onKartAc={kartAc}
            />
          )}
          {sekme === 'pomodoro' && <Yakinda ekran="pomodoro" />}
          {sekme === 'soru' && <Yakinda ekran="soru" />}
          {sekme === 'deneme' && <Yakinda ekran="deneme" />}
          {sekme === 'daha' && <KartMenusu onKartAc={kartAc} />}
        </>
      )}

      <BottomNav
        sekme={sekme}
        onDegis={(yeni) => {
          setEkran(null)
          setSekme(yeni)
        }}
      />
    </div>
  )
}

function Yukleniyor() {
  return <div className="min-h-dvh" aria-busy="true" />
}
