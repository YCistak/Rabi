'use client'

import { useCallback, useEffect, useState } from 'react'
import type { BildirimKolu } from '@/components/hata-bildir'
import { SoruBankasiGiris } from '@/components/soru-bankasi/giris'
import { KonuSayfasi } from '@/components/soru-bankasi/konu'
import { TestOturumu } from '@/components/soru-bankasi/soru-sayfasi'
import { ANAHTARLAR, useYerelDepo } from '@/lib/depo'
import { useGeriKatmani } from '@/lib/geri'
import type { BankaKonusu } from '@/lib/soru-bankasi/dizin'
import { TEST_BOYUTU, testlereBol } from '@/lib/soru-bankasi/mantik'
import type { BankaSorusu, CalismaModu, SoruBankasiKaydi, SoruBankasiTestleri } from '@/lib/soru-bankasi/tip'

type KayitYaz = (guncelle: (onceki: SoruBankasiKaydi) => SoruBankasiKaydi) => void
type TestlerYaz = (guncelle: (onceki: SoruBankasiTestleri) => SoruBankasiTestleri) => void

type AcikTest = {
  test: number
  siralar: number[]
  tekrar: boolean
  mod: CalismaModu
  devam: boolean
  /** Aynı test yeniden açılınca oturum sıfırdan kurulsun. */
  kimlik: number
}

/** Bu cihazdaki tercih (yedeğe girmez): son mod, sayacın gizliliği, eleme ipucu görüldü mü. */
type Tercih = { mod: CalismaModu; sureGizli: boolean; elemeOgrenildi: boolean }
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

  const konuyuKapat = useCallback(() => {
    setAcikTest(null)
    setKonu(null)
  }, [])
  useGeriKatmani(konu !== null && acikTest === null, konuyuKapat)

  const testiAc = (test: number, secenek: { siralar?: number[]; devam?: boolean } = {}) => {
    if (!sorular) return
    const varsayilan = (testlereBol(sorular)[test] ?? []).map((_, sira) => test * TEST_BOYUTU + sira)
    setAcikTest({
      test,
      siralar: secenek.siralar ?? varsayilan,
      tekrar: secenek.siralar !== undefined,
      // Yarım test yalnız alıştırmada oluşur (deneme bitmeden kayda yazmaz).
      mod: secenek.devam ? 'alistirma' : tercih.mod,
      devam: secenek.devam ?? false,
      kimlik: Date.now(),
    })
  }

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
        kayit={kayit}
        setKayit={setKayit}
        setTestler={setTestler}
        hataBildirimi={hataBildirimi}
        sonrakiTestVar={testlereBol(sorular)[acikTest.test + 1] !== undefined}
        sureGizli={tercih.sureGizli}
        elemeIpucu={!tercih.elemeOgrenildi}
        onSureGizli={(sureGizli) => setTercih((eski) => ({ ...VARSAYILAN_TERCIH, ...eski, sureGizli }))}
        onElemeOgrenildi={() =>
          setTercih((eski) => ({
            ...VARSAYILAN_TERCIH,
            ...eski,
            elemeOgrenildi: true,
          }))
        }
        onCik={() => setAcikTest(null)}
        onSonrakiTest={() => testiAc(acikTest.test + 1)}
        onTekrar={(siralar) => siralar.length > 0 && testiAc(acikTest.test, { siralar })}
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
        mod={tercih.mod}
        onMod={(mod) => setTercih((eski) => ({ ...VARSAYILAN_TERCIH, ...eski, mod }))}
        onAc={(test) => testiAc(test)}
        onDevam={(test) => testiAc(test, { devam: true })}
        onTekrar={(siralar) => testiAc(0, { siralar })}
      />
    )
  }

  return <SoruBankasiGiris sinif={seciliSinif} kayit={kayit} onSinif={setSeciliSinif} onKonu={setKonu} />
}
