'use client'

import { useCallback, useState } from 'react'
import { useGeriKatmani } from '@/lib/geri'
import { BANKA_DIZINI, type BankaKonusu } from '@/lib/soru-bankasi/dizin'
import { testlereBol } from '@/lib/soru-bankasi/mantik'
import { durumAl } from '@/lib/soru-bankasi/mantik'
import type { BankaSorusu, SoruBankasiKaydi } from '@/lib/soru-bankasi/tip'
import type { BildirimKolu } from '@/components/hata-bildir'
import { SoruBankasiGiris } from '@/components/soru-bankasi/giris'
import { KonuSayfasi } from '@/components/soru-bankasi/konu'
import { SoruSayfasi } from '@/components/soru-bankasi/soru-sayfasi'
import { TestSonu } from '@/components/soru-bankasi/test-sonu'

type KayitYaz = (guncelle: (onceki: SoruBankasiKaydi) => SoruBankasiKaydi) => void

type AcikTest = {
  konu: BankaKonusu
  test: number
  siralar: number[]
  tekrar: boolean
}

/** Araç ekranı yalnız gezinme katmanlarının sahibidir; her görünüm kendi parçasında çizilir. */
export function SoruBankasiEkrani({
  kayit,
  setKayit,
  sinif,
  hataBildirimi,
}: {
  kayit: SoruBankasiKaydi
  setKayit: KayitYaz
  sinif: number
  hataBildirimi: BildirimKolu
}) {
  const [seciliSinif, setSeciliSinif] = useState<9 | 10 | 11>(sinif === 10 || sinif === 11 ? sinif : 9)
  const [konu, setKonu] = useState<BankaKonusu | null>(null)
  const [acikTest, setAcikTest] = useState<AcikTest | null>(null)
  const [testBitti, setTestBitti] = useState(false)
  const [sonucSorusu, setSonucSorusu] = useState<number | null>(null)

  const konuyuKapat = useCallback(() => {
    setAcikTest(null)
    setTestBitti(false)
    setSonucSorusu(null)
    setKonu(null)
  }, [])
  const testiKapat = useCallback(() => {
    setAcikTest(null)
    setTestBitti(false)
    setSonucSorusu(null)
  }, [])

  useGeriKatmani(konu !== null && acikTest === null, konuyuKapat)
  useGeriKatmani(acikTest !== null && !testBitti, testiKapat)
  useGeriKatmani(testBitti, testiKapat)

  const testiAc = async (hedef: BankaKonusu, test: number, siralar?: number[]) => {
    if (!hedef.yukle) return
    const sorular = (await hedef.yukle()).default
    const varsayilanSiralar = testlereBol(sorular)[test].map((_, sira) => test * 12 + sira)
    setKonu(hedef)
    setAcikTest({
      konu: hedef,
      test,
      siralar: siralar ?? varsayilanSiralar,
      tekrar: siralar !== undefined,
    })
  }

  const sonrakiTestiAc = async (hedef: BankaKonusu, test: number) => {
    // Sonuç katmanı aynı `SoruYuku` içinde kalır. Önce kapatılmazsa yeni
    // testin soruları yerine eski sonucun yeniden çizilmesine neden olur.
    setTestBitti(false)
    setSonucSorusu(null)
    await testiAc(hedef, test)
  }

  if (acikTest && konu?.yukle) {
    return (
      <SoruYuku
        acikTest={acikTest}
        kayit={kayit}
        setKayit={setKayit}
        hataBildirimi={hataBildirimi}
        bitti={testBitti}
        sonucSorusu={sonucSorusu}
        onBitir={() => setTestBitti(true)}
        onSonucSoruAc={(sira) => {
          setSonucSorusu(sira)
          setTestBitti(false)
        }}
        onGeri={testiKapat}
        onSonrakiTest={() => sonrakiTestiAc(acikTest.konu, acikTest.test + 1)}
        onTekrar={(siralar) => {
          setAcikTest({ ...acikTest, siralar, tekrar: true })
          setTestBitti(false)
          setSonucSorusu(null)
        }}
      />
    )
  }

  if (konu?.yukle) {
    return (
      <KonuYuku
        konu={konu}
        kayit={kayit}
        onTestAc={(test) => testiAc(konu, test)}
        onTekrar={(siralar) => testiAc(konu, 0, siralar)}
      />
    )
  }

  return <SoruBankasiGiris sinif={seciliSinif} kayit={kayit} onSinif={setSeciliSinif} onKonu={setKonu} />
}

function KonuYuku({
  konu,
  kayit,
  onTestAc,
  onTekrar,
}: {
  konu: BankaKonusu
  kayit: SoruBankasiKaydi
  onTestAc: (test: number) => void
  onTekrar: (siralar: number[]) => void
}) {
  const [sorular, setSorular] = useState<BankaSorusu[] | null>(null)

  if (!sorular) {
    void konu.yukle?.().then((veri) => setSorular(veri.default))
    return <main className="sayfa-girisi mx-auto max-w-md px-4 py-8 text-muted-foreground">Sorular hazırlanıyor…</main>
  }

  return <KonuSayfasi konu={konu} sorular={sorular} kayit={kayit} onAc={onTestAc} onTekrar={onTekrar} />
}

function SoruYuku({
  acikTest,
  kayit,
  setKayit,
  hataBildirimi,
  bitti,
  sonucSorusu,
  onBitir,
  onSonucSoruAc,
  onGeri,
  onSonrakiTest,
  onTekrar,
}: {
  acikTest: AcikTest
  kayit: SoruBankasiKaydi
  setKayit: KayitYaz
  hataBildirimi: BildirimKolu
  bitti: boolean
  sonucSorusu: number | null
  onBitir: () => void
  onSonucSoruAc: (sira: number) => void
  onGeri: () => void
  onSonrakiTest: () => void
  onTekrar: (siralar: number[]) => void
}) {
  const [sorular, setSorular] = useState<BankaSorusu[] | null>(null)

  if (!sorular) {
    void acikTest.konu.yukle?.().then((veri) => setSorular(veri.default))
    return <main className="sayfa-girisi mx-auto max-w-md px-4 py-8 text-muted-foreground">Sorular hazırlanıyor…</main>
  }

  const testSorulari = acikTest.siralar.map((sira) => sorular[sira]).filter((soru): soru is BankaSorusu => soru !== undefined)
  if (bitti) {
    return (
      <TestSonu
        konu={acikTest.konu}
        sorular={testSorulari}
        kaynakSiralari={acikTest.siralar}
        kayit={kayit}
        tekrar={acikTest.tekrar}
        sonrakiTestVar={testlereBol(sorular)[acikTest.test + 1] !== undefined}
        onKonuyaDon={onGeri}
        onSonrakiTest={onSonrakiTest}
        onSoruAc={onSonucSoruAc}
        onYanlislariTekrar={() => {
          const yanlislar = acikTest.siralar.filter((sira) => durumAl(kayit, acikTest.konu.id, sira) === 'y')
          if (yanlislar.length > 0) {
            onTekrar(yanlislar)
          }
        }}
      />
    )
  }

  return (
    <SoruSayfasi
      key={`${acikTest.konu.id}:${acikTest.test}:${acikTest.siralar.join(',')}:${sonucSorusu ?? 'yeni'}`}
      konu={acikTest.konu}
      sorular={testSorulari}
      kaynakSiralari={acikTest.siralar}
      kayit={kayit}
      setKayit={setKayit}
      tekrar={acikTest.tekrar}
      hataBildirimi={hataBildirimi}
      onGeri={onGeri}
      onBitir={onBitir}
      baslangicSirasi={sonucSorusu ?? 0}
      cozumAcik={sonucSorusu !== null}
    />
  )
}
