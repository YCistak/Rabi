'use client'

import { useCallback, useEffect, useState } from 'react'
import type { BildirimKolu } from '@/components/hata-bildir'
import { SoruBankasiGiris } from '@/components/soru-bankasi/giris'
import { KonuSayfasi } from '@/components/soru-bankasi/konu'
import { TestOturumu } from '@/components/soru-bankasi/soru-sayfasi'
import { ANAHTARLAR, useYerelDepo } from '@/lib/depo'
import { bankaDersiCoz, type BankaDersi } from '@/lib/soru-bankasi/ders'
import { useGeriKatmani } from '@/lib/geri'
import type { BankaKonusu } from '@/lib/soru-bankasi/dizin'
import { testCizimleriniSil } from '@/lib/soru-bankasi/cizim-depo'
import { sikDuzeniTercihiCoz, type SikDuzeniTercihi } from '@/lib/soru-bankasi/duzen'
import { TEST_BOYUTU, testlereBol } from '@/lib/soru-bankasi/mantik'
import {
  oturumAnahtari,
  oturumlariCoz,
  oturumSil,
  oturumYaz,
  type OturumKaydi,
  type OturumKayitlari,
} from '@/lib/soru-bankasi/oturum-kaydi'
import type { BankaSorusu, CalismaModu, SoruBankasiKaydi, SoruBankasiTestleri } from '@/lib/soru-bankasi/tip'

type KayitYaz = (guncelle: (onceki: SoruBankasiKaydi) => SoruBankasiKaydi) => void
type TestlerYaz = (guncelle: (onceki: SoruBankasiTestleri) => SoruBankasiTestleri) => void

type AcikTest = {
  test: number
  siralar: number[]
  tekrar: boolean
  mod: CalismaModu
  devam: boolean
  /** Yarım bırakılmış testin kaydı: oradan sürer. */
  kayitliOturum: OturumKaydi | null
  /** Aynı test yeniden açılınca oturum sıfırdan kurulsun. */
  kimlik: number
}

/**
 * Bu cihazdaki tercih (yedeğe girmez): son mod, sayacın gizliliği, eleme ipucu
 * görüldü mü, şık düzeni, girişte seçili ders. `yarimSureler` eski sürümün yarım alıştırma süresi:
 * yalnız okunur (yeni yarım testler `soruBankasiOturumlari`nda).
 */
type Tercih = {
  mod: CalismaModu
  sureGizli: boolean
  elemeOgrenildi: boolean
  sikDuzeni?: SikDuzeniTercihi
  /** Girişte en son bakılan ders; yoksa matematik (eski kayıt). */
  ders?: BankaDersi
  yarimSureler?: Record<string, number>
}
const VARSAYILAN_TERCIH: Tercih = {
  mod: 'alistirma',
  sureGizli: false,
  elemeOgrenildi: false,
}

/** Konunun sorularını bir kez yükler (dinamik içe aktarma önbellekte kalır). */
function useSorular(konu: BankaKonusu | null): BankaSorusu[] | null {
  const [yuklenen, setYuklenen] = useState<{
    id: string
    sorular: BankaSorusu[]
  } | null>(null)
  useEffect(() => {
    if (!konu?.yukle) return
    let iptal = false
    void konu.yukle().then((veri) => {
      if (!iptal) setYuklenen({ id: konu.id, sorular: veri.default })
    })
    return () => {
      iptal = true
    }
  }, [konu])
  return konu && yuklenen?.id === konu.id ? yuklenen.sorular : null
}

/** Araç ekranı gezinme katmanlarının sahibidir; her görünüm kendi parçasında çizilir. */
export function SoruBankasiEkrani({
  kayit,
  setKayit,
  testler,
  setTestler,
  sinif,
  hataBildirimi,
}: {
  kayit: SoruBankasiKaydi
  setKayit: KayitYaz
  testler: SoruBankasiTestleri
  setTestler: TestlerYaz
  sinif: number
  hataBildirimi: BildirimKolu
}) {
  const [seciliSinif, setSeciliSinif] = useState<9 | 10 | 11>(sinif === 10 || sinif === 11 ? sinif : 9)
  const [konu, setKonu] = useState<BankaKonusu | null>(null)
  const [acikTest, setAcikTest] = useState<AcikTest | null>(null)
  const [tercihHam, setTercih] = useYerelDepo<Tercih>(ANAHTARLAR.soruBankasiTercihi, VARSAYILAN_TERCIH)
  const tercih: Tercih = {
    ...VARSAYILAN_TERCIH,
    ...tercihHam,
    mod: tercihHam?.mod === 'deneme' ? 'deneme' : 'alistirma',
  }
  const sorular = useSorular(konu)
  const [oturumlarHam, setOturumlar] = useYerelDepo<OturumKayitlari>(ANAHTARLAR.soruBankasiOturumlari, {})
  const oturumlar = oturumlariCoz(oturumlarHam)
  const tercihYaz = (degisim: Partial<Tercih>) => setTercih((eski) => ({ ...VARSAYILAN_TERCIH, ...eski, ...degisim }))

  const konuyuKapat = useCallback(() => {
    setAcikTest(null)
    setKonu(null)
  }, [])
  useGeriKatmani(konu !== null && acikTest === null, konuyuKapat)

  const testiAc = (test: number, secenek: { siralar?: number[]; devam?: boolean; sifirdan?: boolean } = {}) => {
    if (!sorular || !konu) return
    const varsayilan = (testlereBol(sorular)[test] ?? []).map((_, sira) => test * TEST_BOYUTU + sira)
    const tekrar = secenek.siralar !== undefined
    const kayitli = tekrar || secenek.sifirdan ? null : (oturumlar[oturumAnahtari(konu.id, test)] ?? null)
    setAcikTest({
      test,
      siralar: secenek.siralar ?? varsayilan,
      tekrar,
      // Yarım test kendi modunda sürer; eski sürümün yarım testi yalnız alıştırmadır.
      mod: kayitli?.mod ?? (secenek.devam ? 'alistirma' : tercih.mod),
      devam: !kayitli && (secenek.devam ?? false),
      kayitliOturum: kayitli,
      kimlik: Date.now(),
    })
  }
  const yarimSureAnahtari = (konuId: string, test: number) => `${konuId}:${test}`

  if (konu && !sorular) {
    return <main className="sayfa-girisi mx-auto max-w-md px-4 py-8 text-muted-foreground">Sorular hazırlanıyor…</main>
  }

  if (konu && sorular && acikTest) {
    const testSorulari = acikTest.siralar.map((sira) => sorular[sira]).filter((soru): soru is BankaSorusu => soru !== undefined)
    return (
      <TestOturumu
        key={acikTest.kimlik}
        konu={konu}
        test={acikTest.test}
        sorular={testSorulari}
        kaynakSiralari={acikTest.siralar}
        tekrar={acikTest.tekrar}
        mod={acikTest.mod}
        devam={acikTest.devam}
        oncekiSure={tercih.yarimSureler?.[yarimSureAnahtari(konu.id, acikTest.test)] ?? 0}
        kayitliOturum={acikTest.kayitliOturum}
        kayit={kayit}
        setKayit={setKayit}
        setTestler={setTestler}
        hataBildirimi={hataBildirimi}
        sonrakiTestVar={testlereBol(sorular)[acikTest.test + 1] !== undefined}
        sureGizli={tercih.sureGizli}
        sikDuzeni={sikDuzeniTercihiCoz(tercih.sikDuzeni)}
        elemeIpucu={!tercih.elemeOgrenildi}
        onSureGizli={(sureGizli) => tercihYaz({ sureGizli })}
        onSikDuzeni={(sikDuzeni) => tercihYaz({ sikDuzeni })}
        onElemeOgrenildi={() => tercihYaz({ elemeOgrenildi: true })}
        onOturumYaz={(oturum) =>
          setOturumlar((eski) => oturumYaz(oturumlariCoz(eski), oturumAnahtari(konu.id, acikTest.test), oturum))
        }
        onOturumSil={() => setOturumlar((eski) => oturumSil(oturumlariCoz(eski), oturumAnahtari(konu.id, acikTest.test)))}
        onYarimSureSil={() =>
          setTercih((eski) => {
            const yarimSureler = { ...eski.yarimSureler }
            delete yarimSureler[yarimSureAnahtari(konu.id, acikTest.test)]
            return { ...VARSAYILAN_TERCIH, ...eski, yarimSureler }
          })
        }
        onCik={() => setAcikTest(null)}
        onSonrakiTest={() => testiAc(acikTest.test + 1)}
        onTekrar={(siralar) => siralar.length > 0 && testiAc(acikTest.test, { siralar })}
        onBastan={() => {
          const anahtar = oturumAnahtari(konu.id, acikTest.test)
          setOturumlar((eski) => oturumSil(oturumlariCoz(eski), anahtar))
          void testCizimleriniSil(anahtar).catch(() => {})
          testiAc(acikTest.test, { sifirdan: true })
        }}
      />
    )
  }

  if (konu && sorular) {
    return (
      <KonuSayfasi
        konu={konu}
        sorular={sorular}
        kayit={kayit}
        testler={testler}
        oturumlar={oturumlar}
        mod={tercih.mod}
        onMod={(mod) => tercihYaz({ mod })}
        onAc={(test) => testiAc(test)}
        onDevam={(test) => testiAc(test, { devam: true })}
        onTekrar={(siralar) => testiAc(0, { siralar })}
      />
    )
  }

  return <SoruBankasiGiris ders={bankaDersiCoz(tercih.ders)} sinif={seciliSinif} kayit={kayit} onDers={(ders) => tercihYaz({ ders })} onSinif={setSeciliSinif} onKonu={setKonu} />
}
