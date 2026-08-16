'use client'

import { useCallback, useEffect, useState } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { ArrowLeft } from 'lucide-react'
import type {
  Ayarlar,
  Deneme,
  Devamsizlik,
  GecmisYil,
  GunlukKayit,
  Hedef,
  KazanilanRozet,
  OkulDersi,
  PomodoroAyar,
  PomodoroSeans,
  Sablon,
} from '@/lib/types'
import {
  ANAHTARLAR,
  VARSAYILAN_AYARLAR,
  VARSAYILAN_POMODORO,
  ayarlariNormalize,
  useYerelDepo,
} from '@/lib/depo'
import { sablonlariBirlestir } from '@/lib/sablonlar'
import { guncelTahmin } from '@/lib/tahmin'
import { egitimYili, ilerlemisSinif } from '@/lib/hesap'
import type { Ekran, Sekme } from '@/lib/gezinme'
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
import { Yakinda } from '@/components/ekranlar/yakinda'

export function AppShell() {
  const [sekme, setSekme] = useState<Sekme>('ana')
  const [ekran, setEkran] = useState<Ekran | null>(null)
  /** Deneme ekleme/düzenleme, sekmenin üstünde açılan bir alt ekran. */
  const [denemeFormu, setDenemeFormu] = useState<{ duzenlenen: Deneme | null } | null>(null)

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
  const [okulDersleri, setOkulDersleri, okulHazir] = useYerelDepo<OkulDersi[]>(
    ANAHTARLAR.okulDersleri,
    [],
  )
  const [gecmisYillar, setGecmisYillar] = useYerelDepo<GecmisYil[]>(ANAHTARLAR.gecmisYillar, [])
  const [gunlukKayitlar, setGunlukKayitlar] = useYerelDepo<GunlukKayit[]>(
    ANAHTARLAR.gunlukKayitlar,
    [],
  )
  const [devamsizlik, setDevamsizlik] = useYerelDepo<Devamsizlik[]>(
    ANAHTARLAR.devamsizlik,
    [],
  )
  const [rozetler] = useYerelDepo<KazanilanRozet[]>(ANAHTARLAR.rozetler, [])
  const [hedef, setHedef] = useYerelDepo<Hedef | null>(ANAHTARLAR.hedef, null)
  const [pomodoroAyar, setPomodoroAyar] = useYerelDepo<PomodoroAyar>(
    ANAHTARLAR.pomodoroAyar,
    VARSAYILAN_POMODORO,
  )
  const [, setPomodoroGecmis] = useYerelDepo<PomodoroSeans[]>(
    ANAHTARLAR.pomodoroGecmis,
    [],
  )

  const sablonlar = sablonlariBirlestir(kayitliSablonlar)

  // Hedef kartı ve ana sayfa, en yeni denemelerden çıkan tahmini gösteriyor.
  const tahmin = guncelTahmin(
    denemeler,
    sablonlar,
    okulDersleri,
    gecmisYillar,
    ayarlar.puanTuru,
  )
  const guncelSiralama = tahmin?.siralama.enKotu ?? null

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

  const geriGit = useCallback(() => {
    // En içteki katmandan dışa doğru: form → alt ekran → ana sekme → uygulamadan çık.
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
  }, [denemeFormu, ekran, sekme])

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

  // Veri okunmadan ekran çizilirse "kayıt yok" bir an yanıp söner.
  if (!ayarlarHazir) return <div className="min-h-dvh" aria-busy="true" />

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

  if (denemeFormu !== null) {
    return (
      <div className="mx-auto min-h-dvh max-w-md px-4 pb-8 pt-5">
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

  return (
    <div className="mx-auto min-h-dvh max-w-md px-4 pb-24 pt-5">
      {ekran !== null ? (
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
              dersler={okulDersleri}
              setDersler={setOkulDersleri}
              gecmisYillar={gecmisYillar}
              setGecmisYillar={setGecmisYillar}
              ayarlar={ayarlar}
              hazir={okulHazir}
            />
          )}
          {ekran === 'siralama' && (
            <SiralamaEkrani
              denemeler={denemeler}
              sablonlar={sablonlar}
              okulDersleri={okulDersleri}
              gecmisYillar={gecmisYillar}
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
          {ekran === 'ayarlar' && (
            <AyarlarEkrani
              sablonlar={sablonlar}
              kayitliSablonlar={kayitliSablonlar}
              setKayitliSablonlar={setSablonlar}
              ayarlar={ayarlar}
              setAyarlar={setAyarlar}
              yedeklenecek={{
                denemeler,
                okulDersleri,
                gecmisYillar,
                gunlukKayitlar,
                devamsizlik,
                rozetler,
                hedef,
              }}
            />
          )}
          {!['siralama', 'hedef', 'okul', 'devamsizlik', 'istatistik', 'ayarlar'].includes(
            ekran,
          ) && (
            <Yakinda ekran={ekran} />
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
              onKartAc={setEkran}
            />
          )}
          {sekme === 'pomodoro' && (
            <PomodoroEkrani
              ayar={{ ...VARSAYILAN_POMODORO, ...pomodoroAyar }}
              setAyar={setPomodoroAyar}
              onSeansBitti={(seans) => setPomodoroGecmis((o) => [...o, seans])}
            />
          )}
          {sekme === 'soru' && (
            <SoruTakibiEkrani
              kayitlar={gunlukKayitlar}
              setKayitlar={setGunlukKayitlar}
              ayarlar={ayarlar}
            />
          )}
          {sekme === 'deneme' && (
            <DenemelerEkrani
              denemeler={denemeler}
              sablonlar={sablonlar}
              hazir={denemelerHazir}
              onSil={(id) => setDenemeler((onceki) => onceki.filter((d) => d.id !== id))}
              onDuzenle={(deneme) => setDenemeFormu({ duzenlenen: deneme })}
              onYeniyeGit={() => setDenemeFormu({ duzenlenen: null })}
            />
          )}
          {sekme === 'daha' && <KartMenusu onKartAc={setEkran} />}
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
