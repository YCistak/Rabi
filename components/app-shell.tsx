'use client'

import { useCallback, useEffect, useState } from 'react'
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
  OyunKayitlari,
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
  useYerelDepo,
} from '@/lib/depo'
import { sablonlariBirlestir } from '@/lib/sablonlar'
import { guncelTahmin, obpHesapla } from '@/lib/tahmin'
import { egitimYili, gunlukToplam, ilerlemisSinif } from '@/lib/hesap'
import { rozetDurumu, yeniRozetler, type Rozet } from '@/lib/rozetler'
import { hatirlatmaIptal, hatirlatmaPlanla } from '@/lib/bildirim'
import { bugun } from '@/lib/utils'
import type { Ekran, Sekme } from '@/lib/gezinme'
import { ustKatmaniKapat } from '@/lib/geri'
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
import { MiniOyunlarEkrani } from '@/components/ekranlar/mini-oyunlar'
import { RozetKutlama } from '@/components/rozet-kutlama'

/** Rozet kontrolünün, veri durulana kadar beklediği süre (ms). */
const ROZET_BEKLEME = 1200

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
  const [kutlanan, setKutlanan] = useState<Rozet[]>([])
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
  const tahmin = guncelTahmin(denemeler, sablonlar, okulYillari, ayarlar.puanTuru)
  const guncelSiralama = tahmin?.siralama.enKotu ?? null
  const diplomaNotu = obpHesapla(okulYillari)?.diplomaNotu ?? null

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
      const durum = rozetDurumu({ denemeler, gunlukKayitlar, diplomaNotu, oyunlar })
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
    gunlukKayitlar,
    diplomaNotu,
    oyunlar,
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
    <div className="acilis-girisi mx-auto min-h-dvh max-w-md px-4 pb-24 pt-5">
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
              yillar={okulYillari}
              setYillar={setOkulYillari}
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
          {ekran === 'mini-oyunlar' && (
            <MiniOyunlarEkrani
              kayitlar={oyunlar}
              setKayitlar={setOyunlar}
              sesAcik={ayarlar.oyunSesi}
            />
          )}
          {ekran === 'rozetler' && (
            <RozetlerEkrani
              denemeler={denemeler}
              gunlukKayitlar={gunlukKayitlar}
              diplomaNotu={diplomaNotu}
              oyunlar={oyunlar}
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
          {ekran === 'ayarlar' && (
            <AyarlarEkrani
              sablonlar={sablonlar}
              kayitliSablonlar={kayitliSablonlar}
              setKayitliSablonlar={setSablonlar}
              ayarlar={ayarlar}
              setAyarlar={setAyarlar}
              yedeklenecek={{
                denemeler,
                okulYillari,
                gunlukKayitlar,
                devamsizlik,
                yanlisSorular,
                rozetler,
                oyunlar,
                hedef,
              }}
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

      <RozetKutlama rozetler={kutlanan} onKapat={() => setKutlanan([])} />
    </div>
  )
}
