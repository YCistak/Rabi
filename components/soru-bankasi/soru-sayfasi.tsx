'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { BildirimKolu } from '@/components/hata-bildir'
import { Onay, useKapatmaOnayi } from '@/components/ui'
import {
  BOS_GECMIS,
  gecmiseYaz,
  gecmisGeriAl,
  gecmisIleriAl,
  type KaralamaGecmisi,
  type Murekkep,
  type SayfaCizgisi,
} from '@/lib/cizim'
import { useGeriKatmani } from '@/lib/geri'
import type { BankaKonusu } from '@/lib/soru-bankasi/dizin'
import { cevapKaydet } from '@/lib/soru-bankasi/mantik'
import { denemeyiKaydet, oncekiDurumlar, testDegerlendir, type OncekiDurumlar } from '@/lib/soru-bankasi/oturum'
import {
  anlikSoruSureleri,
  sayacDuraklat,
  sayacKur,
  sayacSoruDegistir,
  sayacSurdur,
  sureOzeti,
  toplamSure,
  type SureSayaci,
} from '@/lib/soru-bankasi/sure'
import { testSonucuYaz } from '@/lib/soru-bankasi/testler'
import type { BankaSorusu, CalismaModu, SoruBankasiKaydi, SoruBankasiTestleri } from '@/lib/soru-bankasi/tip'
import { AracCubugu, KALEM_KALINLIKLARI, VURGU_KALINLIKLARI, type KalinlikKademesi } from './arac-cubugu'
import { GezinmeCubugu } from './gezinme-cubugu'
import { KaralamaKatmani, type GirdiTuru, type KaralamaAraci, type KaralamaKolu } from './karalama-katmani'
import { SoruGovdesi } from './soru-govdesi'
import { SoruIzgarasi, type HucreDurumu } from './soru-izgarasi'
import { TestSonu } from './test-sonu'
import { UstCubuk } from './ust-cubuk'

type KayitYaz = (guncelle: (onceki: SoruBankasiKaydi) => SoruBankasiKaydi) => void
type TestlerYaz = (guncelle: (onceki: SoruBankasiTestleri) => SoruBankasiTestleri) => void

const simdi = () => performance.now()

/** Dokunmatik telefonda öğrenci önce okur (El); fare ya da kalem varsa Kalem. */
function ilkArac(): KaralamaAraci {
  if (typeof window === 'undefined') return 'el'
  return window.matchMedia('(pointer: fine)').matches ? 'kalem' : 'el'
}

/**
 * Bir test oturumu: soru sayfası, test sonu ve bitmiş testi çözümleriyle
 * gözden geçirme. Seçimler, elemeler, işaretler, çizimler ve süre oturumluk;
 * kalıcı kayda yalnız cevap (alıştırmada anında, denemede bitişte) ve bitişte
 * test sonucu yazılır.
 */
export function TestOturumu({
  konu,
  test,
  sorular,
  kaynakSiralari,
  tekrar,
  mod,
  devam,
  oncekiSure,
  kayit,
  setKayit,
  setTestler,
  hataBildirimi,
  sonrakiTestVar,
  sureGizli,
  elemeIpucu,
  onSureGizli,
  onElemeOgrenildi,
  onYarimSure,
  onYarimSureSil,
  onCik,
  onSonrakiTest,
  onTekrar,
}: {
  konu: BankaKonusu
  test: number
  sorular: BankaSorusu[]
  kaynakSiralari: number[]
  tekrar: boolean
  mod: CalismaModu
  /** Yarım kalan testi kaldığı yerden aç: önceki cevaplar sayılır, ilk boş sorudan başlar. */
  devam: boolean
  /** Yarım testten gelen, saniye cinsinden toplam süre. */
  oncekiSure: number
  kayit: SoruBankasiKaydi
  setKayit: KayitYaz
  setTestler: TestlerYaz
  hataBildirimi: BildirimKolu
  sonrakiTestVar: boolean
  sureGizli: boolean
  elemeIpucu: boolean
  onSureGizli: (gizli: boolean) => void
  onElemeOgrenildi: () => void
  onYarimSure: (sure: number) => void
  onYarimSureSil: () => void
  onCik: () => void
  onSonrakiTest: () => void
  onTekrar: (siralar: number[]) => void
}) {
  const deneme = mod === 'deneme'
  const [onceki] = useState<OncekiDurumlar>(() => (devam ? oncekiDurumlar(kayit, konu.id, kaynakSiralari) : {}))
  const [sira, setSira] = useState(() => {
    if (!devam) return 0
    const ilkBos = sorular.findIndex((_, i) => onceki[i] === undefined)
    return ilkBos === -1 ? 0 : ilkBos
  })
  const [gecisYonu, setGecisYonu] = useState<'ileri' | 'geri' | null>(null)
  const [secimler, setSecimler] = useState<Record<number, number>>({})
  const [elenenler, setElenenler] = useState<Record<number, number[]>>({})
  const [isaretliler, setIsaretliler] = useState<ReadonlySet<number>>(new Set())
  const [cizimler, setCizimler] = useState<Record<number, KaralamaGecmisi>>({})
  const [cozumAcik, setCozumAcik] = useState<Record<number, boolean>>({})
  const [bitti, setBitti] = useState(false)
  const [gorunum, setGorunum] = useState<'soru' | 'sonuc'>('soru')
  const [izgaraAcik, setIzgaraAcik] = useState(false)
  const [bitirOnayi, setBitirOnayi] = useState(false)
  const [arac, setArac] = useState<KaralamaAraci>(ilkArac)
  const [renk, setRenk] = useState<Murekkep>('kursun')
  const [kademe, setKademe] = useState<KalinlikKademesi>(1)
  const [katli, setKatli] = useState(false)
  const [soruSureleri, setSoruSureleri] = useState<number[]>([])
  const sayac = useRef<SureSayaci>(null!)
  if (!sayac.current) {
    const yeni = sayacKur(sorular.length, simdi(), sira, Math.max(0, oncekiSure) * 1000)
    // Eski sürümler yalnız cevabı saklıyordu. Süre yoksa sıfırdan, varsa
    // toplamı koruyarak devam eder; soru dağılımı bu cihazlık ayrıntıdır.
    sayac.current = yeni
  }
  const katman = useRef<KaralamaKolu>(null)
  const yakinlikKolu = useMemo(
    () => ({
      al: () => katman.current?.yakinlik() ?? 1,
      degistir: (fark: number) => katman.current?.yakinligiDegistir(fark),
      sifirla: () => katman.current?.yakinligiSifirla(),
    }),
    [],
  )
  const cikisOnayi = useKapatmaOnayi({
    baslik: 'Testten çıkılsın mı?',
    aciklama: 'Testi bitirmeden çıkarsan cevapların kaydedilmez.',
  })

  const soru = sorular[sira]
  const secim = secimler[sira]
  const degerlendirme = useMemo(() => testDegerlendir(sorular, secimler, onceki), [sorular, secimler, onceki])
  const cevaplanan = sorular.filter((_, i) => secimler[i] !== undefined || onceki[i] !== undefined).length
  const goster = bitti || (!deneme && secim !== undefined)
  const gecmis = cizimler[sira] ?? BOS_GECMIS
  const baslik = tekrar ? 'Yanlışlar' : `Test ${test + 1}`

  // ── Süre: soru değişimi, arka plan, bitiş ───────────────────────────────
  useEffect(() => {
    sayac.current = sayacSoruDegistir(sayac.current, sira, simdi())
  }, [sira])
  useEffect(() => {
    if (bitti) return
    const gorunurluk = () => {
      sayac.current = document.hidden ? sayacDuraklat(sayac.current, simdi()) : sayacSurdur(sayac.current, simdi())
    }
    document.addEventListener('visibilitychange', gorunurluk)
    return () => document.removeEventListener('visibilitychange', gorunurluk)
  }, [bitti])
  const sureAl = useCallback(() => toplamSure(sayac.current, simdi()), [])
  const yarimSureyiKaydet = () => onYarimSure(toplamSure(sayac.current, simdi()) / 1000)

  // ── Gezinme ─────────────────────────────────────────────────────────────
  const git = useCallback(
    (hedef: number) => {
      if (hedef < 0 || hedef >= sorular.length || hedef === sira) return
      setGecisYonu(hedef > sira ? 'ileri' : 'geri')
      setSira(hedef)
    },
    [sira, sorular.length],
  )

  const bitir = (onaylandi = false) => {
    if (bitti) return
    if (!onaylandi && degerlendirme.bos > 0) {
      setBitirOnayi(true)
      return
    }
    setBitirOnayi(false)
    sayac.current = sayacDuraklat(sayac.current, simdi())
    const sureler = anlikSoruSureleri(sayac.current, simdi())
    setSoruSureleri(sureler)
    if (deneme) setKayit((eski) => denemeyiKaydet(eski, konu.id, kaynakSiralari, sorular, secimler, tekrar))
    if (!tekrar) {
      const { dogru, yanlis, bos } = degerlendirme
      const toplam = sureler.reduce((a, b) => a + b, 0)
      setTestler((eski) =>
        testSonucuYaz(eski, konu.id, test, {
          sure: Math.round(toplam / 1000),
          dogru,
          yanlis,
          bos,
          tarih: new Date().toISOString(),
        }),
      )
    }
    onYarimSureSil()
    setIzgaraAcik(false)
    setBitti(true)
    setGorunum('sonuc')
  }

  const sonraki = () => {
    if (sira < sorular.length - 1) git(sira + 1)
    else if (bitti) setGorunum('sonuc')
    else bitir()
  }

  const geri = () => {
    if (bitti && gorunum === 'soru') setGorunum('sonuc')
    else if (!bitti && deneme && Object.keys(secimler).length > 0) cikisOnayi.sor(onCik)
    else {
      if (!bitti && !deneme) yarimSureyiKaydet()
      onCik()
    }
  }
  useGeriKatmani(true, geri)

  // ── Cevap, eleme, işaret ────────────────────────────────────────────────
  // Alıştırmada cevap verilince sonuç bandı ve çözüm şıkların altında, çoğu
  // zaman ekranın dışında kalıyordu: bir kez, yumuşakça görünür yapılır.
  const yeniCevap = useRef(false)
  useEffect(() => {
    if (!yeniCevap.current) return
    yeniCevap.current = false
    const kare = requestAnimationFrame(() => {
      const oge = document.querySelector('[data-sonuc]')
      if (oge) katman.current?.gorunurYap(oge)
    })
    return () => cancelAnimationFrame(kare)
  }, [secimler])

  const sec = (secilen: number) => {
    if (bitti) return
    if (deneme) {
      setSecimler((eski) => {
        const yeni = { ...eski }
        if (yeni[sira] === secilen) delete yeni[sira]
        else yeni[sira] = secilen
        return yeni
      })
      return
    }
    if (secim !== undefined) return
    yeniCevap.current = true
    setSecimler((eski) => ({ ...eski, [sira]: secilen }))
    setKayit((eski) => cevapKaydet(eski, konu.id, kaynakSiralari[sira], secilen === soru.dogru ? 'd' : 'y', tekrar))
  }

  const ele = (sik: number) => {
    if (goster) return
    setElenenler((eski) => {
      const liste = eski[sira] ?? []
      return {
        ...eski,
        [sira]: liste.includes(sik) ? liste.filter((s) => s !== sik) : [...liste, sik],
      }
    })
    // Deneme modunda elenen şık seçiliyse seçim kalkar: elediğin şık cevabın olamaz.
    if (deneme && secimler[sira] === sik && !(elenenler[sira] ?? []).includes(sik)) {
      setSecimler((eski) => {
        const yeni = { ...eski }
        delete yeni[sira]
        return yeni
      })
    }
    if (elemeIpucu) onElemeOgrenildi()
  }

  const isaretle = () =>
    setIsaretliler((eski) => {
      const yeni = new Set(eski)
      if (yeni.has(sira)) yeni.delete(sira)
      else yeni.add(sira)
      return yeni
    })

  // ── Karalama ────────────────────────────────────────────────────────────
  const gecmisiDegistir = (degistir: (g: KaralamaGecmisi) => KaralamaGecmisi) =>
    setCizimler((eski) => ({
      ...eski,
      [sira]: degistir(eski[sira] ?? BOS_GECMIS),
    }))
  const geriAl = () => gecmisiDegistir(gecmisGeriAl)
  const ileriAl = () => gecmisiDegistir(gecmisIleriAl)
  const temizle = () => gecmisiDegistir((g) => (g.cizgiler.length === 0 ? g : gecmiseYaz(g, [])))
  const cizgiEkle = (cizgi: SayfaCizgisi) => gecmisiDegistir((g) => gecmiseYaz(g, [...g.cizgiler, cizgi]))
  const cizgileriSil = (silinenler: Set<SayfaCizgisi>) =>
    gecmisiDegistir((g) =>
      gecmiseYaz(
        g,
        g.cizgiler.filter((c) => !silinenler.has(c)),
      ),
    )

  const aracSecildi = useRef(false)
  const aracSec = (yeni: KaralamaAraci) => {
    aracSecildi.current = true
    setArac(yeni)
  }
  const girdiGeldi = (tur: GirdiTuru): KaralamaAraci => {
    // Kalem ya da fare görülünce, öğrenci araç seçmediyse El'den Kalem'e geç.
    if (!aracSecildi.current && tur !== 'touch' && arac === 'el') {
      setArac('kalem')
      return 'kalem'
    }
    return arac
  }
  const uzunBas = (hedef: Element) => {
    const sik = Number((hedef as HTMLElement).dataset.sikSira)
    if (goster || Number.isNaN(sik)) return false
    ele(sik)
    return true
  }

  // ── Klavye (masaüstü) ───────────────────────────────────────────────────
  const tusRef = useRef<(olay: KeyboardEvent) => void>(() => {})
  tusRef.current = (olay: KeyboardEvent) => {
    if (gorunum !== 'soru' || izgaraAcik || bitirOnayi) return
    const hedef = olay.target as HTMLElement | null
    if (hedef?.closest('input, textarea, [contenteditable="true"]')) return
    if (document.querySelector('[role="dialog"], [role="alertdialog"]')) return
    const ctrl = olay.ctrlKey || olay.metaKey
    const tus = olay.key.toLocaleLowerCase('tr-TR')
    if (ctrl && tus === 'z') {
      olay.preventDefault()
      if (olay.shiftKey) ileriAl()
      else geriAl()
      return
    }
    if (ctrl && tus === 'y') {
      olay.preventDefault()
      ileriAl()
      return
    }
    if (ctrl || olay.altKey) return
    const sikSirasi = '12345'.indexOf(tus) !== -1 ? '12345'.indexOf(tus) : 'abcde'.indexOf(tus)
    if (sikSirasi !== -1 && tus.length === 1) {
      olay.preventDefault()
      sec(sikSirasi)
      return
    }
    const islem: Record<string, () => void> = {
      arrowright: () => git(sira + 1),
      arrowleft: () => git(sira - 1),
      arrowdown: () => katman.current?.kaydir(80),
      arrowup: () => katman.current?.kaydir(-80),
      pagedown: () => katman.current?.sayfaKaydir(1),
      pageup: () => katman.current?.sayfaKaydir(-1),
      ' ': () => katman.current?.sayfaKaydir(olay.shiftKey ? -1 : 1),
    }
    if (islem[tus]) {
      olay.preventDefault()
      islem[tus]()
    }
  }
  useEffect(() => {
    const dinle = (olay: KeyboardEvent) => tusRef.current(olay)
    window.addEventListener('keydown', dinle)
    return () => window.removeEventListener('keydown', dinle)
  }, [])

  // ── Görünüm ─────────────────────────────────────────────────────────────
  const hucreler: HucreDurumu[] = sorular.map((_, i) => {
    if (bitti || !deneme) return degerlendirme.sonuclar[i]
    return secimler[i] !== undefined ? 'cevaplandi' : '-'
  })

  const sonucuAc = (hedef: number) => {
    setGecisYonu(null)
    setSira(hedef)
    setGorunum('soru')
  }

  if (gorunum === 'sonuc') {
    return (
      <>
        <TestSonu
          baslik={baslik}
          mod={mod}
          tekrar={tekrar}
          degerlendirme={degerlendirme}
          sure={sureOzeti(soruSureleri)}
          isaretliler={isaretliler}
          sonrakiTestVar={sonrakiTestVar}
          onSoruAc={sonucuAc}
          onYanlislariTekrar={() => onTekrar(kaynakSiralari.filter((_, i) => degerlendirme.sonuclar[i] === 'y'))}
          onSonrakiTest={onSonrakiTest}
          onKonuyaDon={onCik}
        />
      </>
    )
  }

  const cozumAcikMi = cozumAcik[sira] ?? degerlendirme.sonuclar[sira] !== 'd'
  const son = sira === sorular.length - 1

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <main className="relative mx-auto flex h-full max-w-md flex-col">
        {cikisOnayi.pencere}
        <UstCubuk
          baslik={baslik}
          ilerleme={cevaplanan / sorular.length}
          sureAl={sureAl}
          sureGizli={sureGizli}
          isaretli={isaretliler.has(sira)}
          bildirimSorusu={{
            kimlik: `${konu.id}#${kaynakSiralari[sira]}`,
            oyun: 'soru-bankasi' as const,
            soruMetni: soru.soru,
            cevapMetni: soru.siklar[soru.dogru],
          }}
          hataBildirimi={hataBildirimi}
          onGeri={geri}
          onSureGizli={() => onSureGizli(!sureGizli)}
          onIsaretle={isaretle}
          onIzgara={() => setIzgaraAcik(true)}
        />
        <KaralamaKatmani
          ref={katman}
          sayfaAnahtari={sira}
          gecisYonu={gecisYonu}
          cizgiler={gecmis.cizgiler}
          arac={arac}
          renk={renk}
          kalinlik={(arac === 'vurgu' ? VURGU_KALINLIKLARI : KALEM_KALINLIKLARI)[kademe]}
          onCizgiEkle={cizgiEkle}
          onCizgileriSil={cizgileriSil}
          onGirdi={girdiGeldi}
          onUzunBas={uzunBas}
        >
          <SoruGovdesi
            soru={soru}
            numara={sira + 1}
            isaretli={isaretliler.has(sira)}
            secim={secim}
            sonuc={degerlendirme.sonuclar[sira]}
            goster={goster}
            oncekiDurum={onceki[sira]}
            elenenler={elenenler[sira] ?? []}
            elemeIpucu={elemeIpucu}
            cozumAcik={cozumAcikMi}
            onSec={sec}
            onEle={ele}
            onCozum={() => setCozumAcik((eski) => ({ ...eski, [sira]: !cozumAcikMi }))}
          />
        </KaralamaKatmani>
        <div className="relative shrink-0">
          <AracCubugu
            arac={arac}
            renk={renk}
            kademe={kademe}
            katli={katli}
            geriAlinabilir={gecmis.geri.length > 0}
            ileriAlinabilir={gecmis.ileri.length > 0}
            cizgiVar={gecmis.cizgiler.length > 0}
            onArac={aracSec}
            onRenk={setRenk}
            onKademe={setKademe}
            onGeriAl={geriAl}
            onIleriAl={ileriAl}
            onTemizle={temizle}
            onKatla={() => setKatli((k) => !k)}
            yakinlik={yakinlikKolu}
          />
          <GezinmeCubugu
            sira={sira}
            toplam={sorular.length}
            modEtiketi={bitti ? 'Çözümler' : deneme ? 'Deneme' : 'Alıştırma'}
            vurgulu={bitti || secim !== undefined || (son && cevaplanan === sorular.length)}
            sonEtiket={bitti ? 'Sonuç' : 'Bitir'}
            onOnceki={() => git(sira - 1)}
            onSonraki={sonraki}
            onIzgara={() => setIzgaraAcik(true)}
          />
        </div>
        {izgaraAcik && (
          <SoruIzgarasi
            durumlar={hucreler}
            isaretliler={isaretliler}
            aktif={sira}
            deneme={deneme}
            bitti={bitti}
            onSec={(hedef) => {
              setIzgaraAcik(false)
              git(hedef)
            }}
            onBitir={() => {
              setIzgaraAcik(false)
              bitir()
            }}
            onSonuc={() => {
              setIzgaraAcik(false)
              setGorunum('sonuc')
            }}
            onKapat={() => setIzgaraAcik(false)}
          />
        )}
        <Onay
          acik={bitirOnayi}
          baslik="Test bitirilsin mi?"
          aciklama={`${degerlendirme.bos} soru boş. Bitirince boş sorular boş sayılır${deneme ? ' ve cevapların değerlendirilir' : ''}.`}
          onayMetni="Bitir"
          tehlikeli={false}
          onOnayla={() => bitir(true)}
          onIptal={() => setBitirOnayi(false)}
        />
      </main>
    </div>
  )
}
