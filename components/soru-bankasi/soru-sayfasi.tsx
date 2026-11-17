'use client'

import { Play } from 'lucide-react'
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
import { testCizimleriniOku, testCizimleriniSil, testCizimleriniYaz } from '@/lib/soru-bankasi/cizim-depo'
import type { BankaKonusu } from '@/lib/soru-bankasi/dizin'
import { sikDuzeniSec, type SikDuzeniTercihi } from '@/lib/soru-bankasi/duzen'
import { cevapKaydet } from '@/lib/soru-bankasi/mantik'
import {
  denemeyiKaydet,
  gezinmeHedefi,
  hucreDurumlari,
  oncekiDurumlar,
  testDegerlendir,
  type OncekiDurumlar,
} from '@/lib/soru-bankasi/oturum'
import { oturumAnahtari, oturumUyarla, type OturumKaydi } from '@/lib/soru-bankasi/oturum-kaydi'
import { sayfaBul, testSayfalari } from '@/lib/soru-bankasi/sayfa'
import {
  anlikSoruSureleri,
  sayacDuraklat,
  sayacGeriYukle,
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
import { GezinmeCubugu, type YakinlikKolu } from './gezinme-cubugu'
import { KaralamaKatmani, type GirdiTuru, type KaralamaAraci, type KaralamaKolu } from './karalama-katmani'
import { KitapGorunumu, SayfaGezinmesi, type SayfaSoruDurumu } from './kitap-sayfasi'
import { SoruGovdesi } from './soru-govdesi'
import { SoruSeridi } from './soru-seridi'
import { TestSonu } from './test-sonu'
import { UstCubuk, type GorunumMenusu } from './ust-cubuk'

type KayitYaz = (guncelle: (onceki: SoruBankasiKaydi) => SoruBankasiKaydi) => void
type TestlerYaz = (guncelle: (onceki: SoruBankasiTestleri) => SoruBankasiTestleri) => void
type Gorunum = 'sayfa' | 'soru' | 'sonuc'
/** Büyüme geçişinin başladığı kutu: ekran kenarlarına uzaklık (px). */
type BuyumeKutusu = { ust: number; sag: number; alt: number; sol: number }

const simdi = () => performance.now()
/** Bundan kısa bakılıp hiçbir şey yapılmadan çıkılan test "yarım" sayılmaz. */
const YARIM_SAYILAN_SURE = 15000

/** Dokunmatik telefonda öğrenci önce okur (El); fare ya da kalem varsa Kalem. */
function ilkArac(): KaralamaAraci {
  if (typeof window === 'undefined') return 'el'
  return window.matchMedia('(pointer: fine)').matches ? 'kalem' : 'el'
}

function kume(liste: readonly number[] | undefined): Set<number> {
  return new Set(liste ?? [])
}

function kumeDegistir(kume: ReadonlySet<number>, sira: number, var_: boolean): Set<number> {
  const yeni = new Set(kume)
  if (var_) yeni.add(sira)
  else yeni.delete(sira)
  return yeni
}

/**
 * Bir test oturumu: önce test kitabı sayfası (3–4 soru), oradan "Çöz" ile tam
 * ekran soru, sonunda test sonu ve bitmiş testi çözümleriyle gözden geçirme.
 *
 * Kalıcı kayda cevap (alıştırmada anında, denemede bitişte) ve bitişte test
 * sonucu yazılır. Yarım test (seçimler, elemeler, şüpheli/pas, soru başına
 * süre, en son bakılan yer) `onOturumYaz` ile küçük bir kayda, çizimler
 * IndexedDB'ye yazılır; çıkıp dönen öğrenci kaldığı yerden sürer. Yanlışları
 * tekrar oturumu kaydedilmez.
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
  kayitliOturum,
  kayit,
  setKayit,
  setTestler,
  hataBildirimi,
  sonrakiTestVar,
  sureGizli,
  sikDuzeni,
  elemeIpucu,
  onSureGizli,
  onSikDuzeni,
  onElemeOgrenildi,
  onOturumYaz,
  onOturumSil,
  onYarimSureSil,
  onCik,
  onSonrakiTest,
  onTekrar,
  onBastan,
}: {
  konu: BankaKonusu
  test: number
  sorular: BankaSorusu[]
  kaynakSiralari: number[]
  tekrar: boolean
  mod: CalismaModu
  /** Eski sürümden kalan yarım alıştırma: önceki cevaplar sayılır, ilk boş sorudan başlar. */
  devam: boolean
  /** Eski sürümün yarım testten sakladığı toplam süre (sn). */
  oncekiSure: number
  /** Yarım bırakılmış bu testin kaydı; varsa oradan sürer. */
  kayitliOturum: OturumKaydi | null
  kayit: SoruBankasiKaydi
  setKayit: KayitYaz
  setTestler: TestlerYaz
  hataBildirimi: BildirimKolu
  sonrakiTestVar: boolean
  sureGizli: boolean
  sikDuzeni: SikDuzeniTercihi
  elemeIpucu: boolean
  onSureGizli: (gizli: boolean) => void
  onSikDuzeni: (deger: SikDuzeniTercihi) => void
  onElemeOgrenildi: () => void
  onOturumYaz: (kayit: OturumKaydi) => void
  onOturumSil: () => void
  onYarimSureSil: () => void
  onCik: () => void
  onSonrakiTest: () => void
  onTekrar: (siralar: number[]) => void
  onBastan: () => void
}) {
  const deneme = mod === 'deneme'
  const kalici = !tekrar
  const cizimAnahtari = kalici ? oturumAnahtari(konu.id, test) : null
  const n = sorular.length

  // ── Başlangıç durumu (kayıttan ya da sıfırdan) ──────────────────────────
  const [baslangic] = useState(() => (kalici && kayitliOturum ? oturumUyarla(kayitliOturum, n) : null))
  const [onceki] = useState<OncekiDurumlar>(() =>
    !baslangic && devam ? oncekiDurumlar(kayit, konu.id, kaynakSiralari) : {},
  )
  const [sira, setSira] = useState(() => {
    if (baslangic) return baslangic.sira
    if (!devam) return 0
    const ilkBos = sorular.findIndex((_, i) => onceki[i] === undefined)
    return ilkBos === -1 ? 0 : ilkBos
  })
  const sayfalar = useMemo(() => testSayfalari(sorular), [sorular])
  const [gorunum, setGorunum] = useState<Gorunum>(() => baslangic?.gorunum ?? 'sayfa')
  const [aktifSayfa, setAktifSayfa] = useState(() => sayfaBul(sayfalar, sira))
  const [vurgulu, setVurgulu] = useState<number | null>(null)
  const [buyume, setBuyume] = useState<BuyumeKutusu | null>(null)
  const [gecisYonu, setGecisYonu] = useState<'ileri' | 'geri' | null>(null)
  const [secimler, setSecimler] = useState<Record<number, number>>(() => baslangic?.secimler ?? {})
  const [elenenler, setElenenler] = useState<Record<number, number[]>>(() => baslangic?.elenenler ?? {})
  const [supheliler, setSupheliler] = useState<ReadonlySet<number>>(() => kume(baslangic?.supheliler))
  const [paslar, setPaslar] = useState<ReadonlySet<number>>(() => kume(baslangic?.paslar))
  const [cizimler, setCizimler] = useState<Record<number, KaralamaGecmisi>>({})
  const [cozumAcik, setCozumAcik] = useState<Record<number, boolean>>({})
  const [bitti, setBitti] = useState(false)
  const [bitirOnayi, setBitirOnayi] = useState(false)
  const [temizleOnayi, setTemizleOnayi] = useState(false)
  const [bastanOnayi, setBastanOnayi] = useState(false)
  const [incelemeListesi, setIncelemeListesi] = useState<number[] | null>(null)
  const [elemeModu, setElemeModu] = useState(false)
  const [duraklatildi, setDuraklatildi] = useState(false)
  const [arac, setArac] = useState<KaralamaAraci>(ilkArac)
  const [renk, setRenk] = useState<Murekkep>('kursun')
  const [kademe, setKademe] = useState<KalinlikKademesi>(1)
  const [katli, setKatli] = useState(false)
  const [soruSureleri, setSoruSureleri] = useState<number[]>([])
  /** Sayfa görünümünde süre bu soruya yazılır: sayfanın ilk boş sorusu ya da en son dokunulan. */
  const [sayfaOdagi, setSayfaOdagi] = useState(sira)

  const sayac = useRef<SureSayaci>(null!)
  if (!sayac.current) {
    sayac.current = baslangic
      ? sayacGeriYukle(baslangic.sureler, n, simdi(), baslangic.sira)
      : sayacKur(n, simdi(), sira, Math.max(0, oncekiSure) * 1000)
  }
  const katman = useRef<KaralamaKolu>(null)
  const olcekDinleyicileri = useRef(new Set<(olcek: number) => void>())
  const yakinlikKolu = useMemo<YakinlikKolu>(
    () => ({
      dinle: (dinleyici) => {
        olcekDinleyicileri.current.add(dinleyici)
        return () => {
          olcekDinleyicileri.current.delete(dinleyici)
        }
      },
      al: () => katman.current?.yakinlik() ?? 1,
      degistir: (fark) => katman.current?.yakinligiDegistir(fark),
      sifirla: () => katman.current?.yakinligiSifirla(),
    }),
    [],
  )
  // Kayıtsız (tekrar) denemede çıkış cevapları kaybettirir: yalnız orada sorulur.
  const cikisOnayi = useKapatmaOnayi({
    baslik: 'Testten çıkılsın mı?',
    aciklama: 'Yanlışları tekrar testi kaydedilmez; çıkarsan bu cevaplar kaybolur.',
  })

  const soru = sorular[sira]
  const secim = secimler[sira]
  const degerlendirme = useMemo(() => testDegerlendir(sorular, secimler, onceki), [sorular, secimler, onceki])
  const cevaplanan = n - degerlendirme.bos
  const gosterilir = (hedef: number) => bitti || (!deneme && secimler[hedef] !== undefined)
  const goster = gosterilir(sira)
  const gecmis = cizimler[sira] ?? BOS_GECMIS
  const baslik = tekrar ? 'Yanlışlar' : `Test ${test + 1}`
  const modAdi = bitti ? 'Çözümler' : deneme ? 'Deneme' : 'Alıştırma'
  const hucreler = hucreDurumlari(degerlendirme.sonuclar, secimler, paslar, deneme, bitti)
  const oncekiHedef = gezinmeHedefi(sira, -1, n, incelemeListesi)
  const sonrakiHedef = gezinmeHedefi(sira, 1, n, incelemeListesi)

  // ── Süre ────────────────────────────────────────────────────────────────
  const zamanSirasi = gorunum === 'soru' ? sira : sayfaOdagi
  useEffect(() => {
    sayac.current = sayacSoruDegistir(sayac.current, zamanSirasi, simdi())
  }, [zamanSirasi])
  const sureAl = useCallback(() => toplamSure(sayac.current, simdi()), [])
  const durdur = () => {
    sayac.current = sayacDuraklat(sayac.current, simdi())
    setDuraklatildi(true)
  }
  const surdur = () => {
    sayac.current = sayacSurdur(sayac.current, simdi())
    setDuraklatildi(false)
  }

  // ── Kayıt: yarım test ve çizimler ───────────────────────────────────────
  /** Kayıt artık yazılmasın (bitti ya da baştan başlatılıyor). */
  const kayitKapali = useRef(!kalici)
  const cizimlerYuklendi = useRef(false)
  const kaydetRef = useRef<() => void>(() => {})
  kaydetRef.current = () => {
    if (kayitKapali.current) return
    const sureler = anlikSoruSureleri(sayac.current, simdi()).map(Math.round)
    const isVar =
      Object.keys(secimler).length > 0 ||
      Object.keys(elenenler).length > 0 ||
      supheliler.size > 0 ||
      paslar.size > 0 ||
      Object.values(cizimler).some((g) => g.cizgiler.length > 0) ||
      sureler.reduce((a, b) => a + b, 0) >= YARIM_SAYILAN_SURE
    if (!isVar && !baslangic) return
    onOturumYaz({
      mod,
      sira,
      gorunum: gorunum === 'soru' ? 'soru' : 'sayfa',
      secimler,
      elenenler,
      supheliler: [...supheliler].sort((a, b) => a - b),
      paslar: [...paslar].sort((a, b) => a - b),
      sureler,
      zaman: Date.now(),
    })
  }
  const cizimVar = Object.values(cizimler).some((g) => g.cizgiler.length > 0)
  useEffect(() => {
    kaydetRef.current()
  }, [secimler, elenenler, supheliler, paslar, sira, gorunum, cizimVar])
  // Çıkışta (geri, sekme kapanması) son süre de yazılsın.
  useEffect(() => () => kaydetRef.current(), [])

  useEffect(() => {
    if (bitti) return
    const gorunurluk = () => {
      if (document.hidden) {
        sayac.current = sayacDuraklat(sayac.current, simdi())
        kaydetRef.current()
      } else if (!duraklatildi) sayac.current = sayacSurdur(sayac.current, simdi())
    }
    document.addEventListener('visibilitychange', gorunurluk)
    return () => document.removeEventListener('visibilitychange', gorunurluk)
  }, [bitti, duraklatildi])

  // Çizimler: kaldığı yerden açılan testte depodan gelir; sıfırdan açılanda eskisi silinir.
  useEffect(() => {
    if (!cizimAnahtari) return
    let iptal = false
    if (!baslangic) {
      void testCizimleriniSil(cizimAnahtari).catch(() => {})
      cizimlerYuklendi.current = true
      return
    }
    void testCizimleriniOku(cizimAnahtari)
      .then((okunan) => {
        if (iptal) return
        setCizimler((eski) => {
          const yeni: Record<number, KaralamaGecmisi> = {}
          for (const [s, cizgiler] of Object.entries(okunan)) yeni[Number(s)] = { ...BOS_GECMIS, cizgiler }
          return { ...yeni, ...eski }
        })
      })
      .catch(() => {})
      .finally(() => {
        cizimlerYuklendi.current = true
      })
    return () => {
      iptal = true
    }
    // Yalnız açılışta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (!cizimAnahtari || !cizimlerYuklendi.current || kayitKapali.current) return
    const zamanlayici = window.setTimeout(() => {
      if (kayitKapali.current) return
      const yazilacak = Object.fromEntries(Object.entries(cizimler).map(([s, g]) => [s, g.cizgiler]))
      void testCizimleriniYaz(cizimAnahtari, yazilacak).catch(() => {})
    }, 500)
    return () => window.clearTimeout(zamanlayici)
  }, [cizimler, cizimAnahtari])

  // ── Gezinme ─────────────────────────────────────────────────────────────
  const git = useCallback(
    (hedef: number | null) => {
      if (hedef === null || hedef < 0 || hedef >= n || hedef === sira) return
      setGecisYonu(hedef > sira ? 'ileri' : 'geri')
      setSira(hedef)
      setElemeModu(false)
    },
    [sira, n],
  )

  const bitir = (onaylandi = false) => {
    if (bitti) return
    if (!onaylandi && degerlendirme.bos > 0) {
      setBitirOnayi(true)
      return
    }
    setBitirOnayi(false)
    sayac.current = sayacDuraklat(sayac.current, simdi())
    setDuraklatildi(false)
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
    kayitKapali.current = true
    if (kalici) {
      onOturumSil()
      if (cizimAnahtari) void testCizimleriniSil(cizimAnahtari).catch(() => {})
    }
    onYarimSureSil()
    setBitti(true)
    setIncelemeListesi(null)
    setGorunum('sonuc')
  }

  const sayfayaDon = () => {
    setAktifSayfa(sayfaBul(sayfalar, sira))
    setSayfaOdagi(sira)
    setVurgulu(sira)
    setBuyume(null)
    setGorunum('sayfa')
  }
  useEffect(() => {
    if (vurgulu === null) return
    const zamanlayici = window.setTimeout(() => setVurgulu(null), 1100)
    return () => window.clearTimeout(zamanlayici)
  }, [vurgulu])

  const testtenCik = () => {
    if (!bitti && !kalici && deneme && Object.keys(secimler).length > 0) cikisOnayi.sor(onCik)
    else {
      kaydetRef.current()
      onCik()
    }
  }

  const geri = () => {
    if (gorunum === 'soru') sayfayaDon()
    else if (gorunum === 'sayfa' && bitti) setGorunum('sonuc')
    else if (gorunum === 'sonuc') onCik()
    else testtenCik()
  }
  useGeriKatmani(true, geri)

  const buyut = (hedef: number, oge: HTMLElement) => {
    const kutu = oge.getBoundingClientRect()
    setBuyume({
      ust: Math.max(0, kutu.top),
      sol: Math.max(0, kutu.left),
      sag: Math.max(0, window.innerWidth - kutu.right),
      alt: Math.max(0, window.innerHeight - kutu.bottom),
    })
    setGecisYonu(null)
    setSira(hedef)
    setIncelemeListesi(null)
    setElemeModu(false)
    setGorunum('soru')
  }

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

  const sec = (hedef: number, secilen: number) => {
    if (bitti) return
    if (gorunum === 'sayfa') setSayfaOdagi(hedef)
    if (paslar.has(hedef)) setPaslar((eski) => kumeDegistir(eski, hedef, false))
    if (deneme) {
      setSecimler((eski) => {
        const yeni = { ...eski }
        if (yeni[hedef] === secilen) delete yeni[hedef]
        else yeni[hedef] = secilen
        return yeni
      })
      return
    }
    if (secimler[hedef] !== undefined) return
    if (gorunum === 'soru') yeniCevap.current = true
    setSecimler((eski) => ({ ...eski, [hedef]: secilen }))
    setKayit((eski) =>
      cevapKaydet(eski, konu.id, kaynakSiralari[hedef], secilen === sorular[hedef].dogru ? 'd' : 'y', tekrar),
    )
  }

  const ele = (hedef: number, sik: number) => {
    if (gosterilir(hedef)) return
    if (gorunum === 'sayfa') setSayfaOdagi(hedef)
    const liste = elenenler[hedef] ?? []
    const elenecek = !liste.includes(sik)
    setElenenler((eski) => {
      const mevcut = eski[hedef] ?? []
      const yeni = { ...eski }
      const guncel = mevcut.includes(sik) ? mevcut.filter((s) => s !== sik) : [...mevcut, sik]
      if (guncel.length === 0) delete yeni[hedef]
      else yeni[hedef] = guncel
      return yeni
    })
    // Deneme modunda elenen şık seçiliyse seçim kalkar: elediğin şık cevabın olamaz.
    if (deneme && elenecek && secimler[hedef] === sik) {
      setSecimler((eski) => {
        const yeni = { ...eski }
        delete yeni[hedef]
        return yeni
      })
    }
    if (elemeIpucu) onElemeOgrenildi()
  }

  const supheliDegistir = () => setSupheliler((eski) => kumeDegistir(eski, sira, !eski.has(sira)))
  const pasGec = () => {
    setPaslar((eski) => kumeDegistir(eski, sira, true))
    git(sonrakiHedef)
  }

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
    ele(sira, sik)
    return true
  }

  // ── Klavye (masaüstü) ───────────────────────────────────────────────────
  const tusRef = useRef<(olay: KeyboardEvent) => void>(() => {})
  tusRef.current = (olay: KeyboardEvent) => {
    if (gorunum === 'sonuc' || bitirOnayi || duraklatildi) return
    const hedef = olay.target as HTMLElement | null
    if (hedef?.closest('input, textarea, [contenteditable="true"]')) return
    if (document.querySelector('[role="dialog"], [role="alertdialog"]')) return
    const ctrl = olay.ctrlKey || olay.metaKey
    const tus = olay.key.toLocaleLowerCase('tr-TR')
    if (gorunum === 'sayfa') {
      if (ctrl || olay.altKey) return
      const yon = tus === 'arrowright' ? 1 : tus === 'arrowleft' ? -1 : 0
      const yeni = aktifSayfa + yon
      if (yon !== 0 && yeni >= 0 && yeni < sayfalar.length) {
        olay.preventDefault()
        setAktifSayfa(yeni)
      }
      return
    }
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
      sec(sira, sikSirasi)
      return
    }
    const islem: Record<string, () => void> = {
      arrowright: () => git(sonrakiHedef),
      arrowleft: () => git(oncekiHedef),
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

  // ── Ortak parçalar ──────────────────────────────────────────────────────
  const menu: GorunumMenusu = {
    sikDuzeni,
    sureGizli,
    onSikDuzeni,
    onSureGizli: () => onSureGizli(!sureGizli),
    onBastan: kalici && !bitti ? () => setBastanOnayi(true) : undefined,
  }
  const onaylar = (
    <>
      {cikisOnayi.pencere}
      <Onay
        acik={bitirOnayi}
        baslik="Test bitirilsin mi?"
        aciklama={`${degerlendirme.bos} soru boş${paslar.size > 0 ? ` (pas geçtiklerin dahil)` : ''}. Bitirince boş sorular boş sayılır${deneme ? ' ve cevapların değerlendirilir' : ''}.`}
        onayMetni="Bitir"
        tehlikeli={false}
        onOnayla={() => bitir(true)}
        onIptal={() => setBitirOnayi(false)}
      />
      <Onay
        acik={temizleOnayi}
        baslik="Bu sorudaki çizimler silinsin mi?"
        aciklama="Hepsi silinir. Hemen ardından Geri al ile geri getirebilirsin."
        onayMetni="Temizle"
        onOnayla={() => {
          temizle()
          setTemizleOnayi(false)
        }}
        onIptal={() => setTemizleOnayi(false)}
      />
      <Onay
        acik={bastanOnayi}
        baslik="Test baştan başlasın mı?"
        aciklama={`İşaretlerin, elemelerin, çizimlerin ve süren silinir.${deneme ? '' : ' Kayda geçen alıştırma cevapların kalır.'}`}
        onayMetni="Baştan başlat"
        onOnayla={() => {
          kayitKapali.current = true
          setBastanOnayi(false)
          onBastan()
        }}
        onIptal={() => setBastanOnayi(false)}
      />
    </>
  )
  const durakPerdesi = duraklatildi && !bitti && (
    <div className="absolute inset-x-0 top-[calc(var(--guvenli-ust)+51px)] bottom-0 z-30 flex flex-col items-center justify-center gap-4 bg-background px-8 text-center">
      <p className="font-display text-2xl font-extrabold">Süre durdu</p>
      <p className="text-[14px] font-bold text-muted-foreground">
        Sorular süre işlerken görünür. Hazır olunca kaldığın yerden sür.
      </p>
      <button
        type="button"
        onClick={surdur}
        className="flex min-h-12 items-center gap-2 rounded-xl bg-primary-dolu px-6 font-extrabold text-white active:brightness-95"
      >
        <Play size={18} className="fill-current" aria-hidden /> Devam et
      </button>
    </div>
  )
  const sureyiDegistir = () => (duraklatildi ? surdur() : durdur())

  // ── Görünümler ──────────────────────────────────────────────────────────
  if (gorunum === 'sonuc') {
    const sonuclar = degerlendirme.sonuclar
    const yanlislar = sonuclar.flatMap((d, i) => (d === 'y' ? [i] : []))
    const bosOlanlar = sonuclar.flatMap((d, i) => (d === '-' ? [i] : []))
    return (
      <TestSonu
        baslik={baslik}
        mod={mod}
        tekrar={tekrar}
        degerlendirme={degerlendirme}
        sure={sureOzeti(soruSureleri)}
        isaretliler={supheliler}
        paslar={paslar}
        sonrakiTestVar={sonrakiTestVar}
        onSoruAc={(hedef, liste) => {
          setGecisYonu(null)
          setSira(hedef)
          setIncelemeListesi(liste ?? null)
          setBuyume(null)
          setGorunum('soru')
        }}
        onListeAc={(liste) => {
          if (liste.length === 0) return
          setGecisYonu(null)
          setSira(liste[0])
          setIncelemeListesi(liste)
          setBuyume(null)
          setGorunum('soru')
        }}
        yanlislar={yanlislar}
        boslar={bosOlanlar}
        onSayfadaIncele={() => {
          setAktifSayfa(0)
          setGorunum('sayfa')
        }}
        onYanlislariTekrar={() => onTekrar(kaynakSiralari.filter((_, i) => degerlendirme.sonuclar[i] === 'y'))}
        onSonrakiTest={onSonrakiTest}
        onKonuyaDon={onCik}
      />
    )
  }

  // Kitap sayfası soru açıkken de altta kurulu kalır: büyüme geçişinde arkada
  // sayfa görünür ve dönüşte sayfa, kaldığı kaydırma yerinde bekler.
  const sayfaAcik = gorunum === 'sayfa'
  let sayfaKatmani: React.ReactNode = null
  {
    const durumAl = (hedef: number): SayfaSoruDurumu => ({
      secim: secimler[hedef],
      goster: gosterilir(hedef),
      sonuc: degerlendirme.sonuclar[hedef],
      elenenler: elenenler[hedef] ?? [],
      supheli: supheliler.has(hedef),
      pas: paslar.has(hedef),
      cizimVar: (cizimler[hedef]?.cizgiler.length ?? 0) > 0,
    })
    sayfaKatmani = (
      <div className="fixed inset-0 z-50 bg-background" inert={!sayfaAcik} aria-hidden={!sayfaAcik}>
        <main className="relative mx-auto flex h-full max-w-md flex-col">
          <UstCubuk
            baslik={baslik}
            altBaslik={`${konu.ad} · ${modAdi}`}
            geriEtiketi={bitti ? 'Sonuca dön' : 'Testten çık'}
            ilerleme={cevaplanan / n}
            sureAl={sureAl}
            duraklatildi={duraklatildi}
            sureBitti={bitti}
            menu={menu}
            hataBildirimi={hataBildirimi}
            onGeri={geri}
            onSure={sureyiDegistir}
          />
          <KitapGorunumu
            konuAdi={konu.ad}
            testAdi={baslik}
            testNo={tekrar ? null : test + 1}
            sorular={sorular}
            sayfalar={sayfalar}
            aktifSayfa={aktifSayfa}
            durumAl={durumAl}
            sikDuzeniTercihi={sikDuzeni}
            vurgulu={vurgulu}
            bosSayisi={degerlendirme.bos}
            bitti={bitti}
            onSayfa={(yeni) => {
              setAktifSayfa(yeni)
              const sayfa = sayfalar[yeni] ?? []
              setSayfaOdagi(sayfa.find((s) => secimler[s] === undefined && onceki[s] === undefined) ?? sayfa[0] ?? 0)
            }}
            onSec={sec}
            onEle={ele}
            onBuyut={buyut}
            onBitir={() => (bitti ? setGorunum('sonuc') : bitir())}
          />
          <SayfaGezinmesi
            aktif={aktifSayfa}
            toplam={sayfalar.length}
            bitti={bitti}
            hepsiCevapli={degerlendirme.bos === 0}
            onSayfa={(yeni) => setAktifSayfa(Math.max(0, Math.min(sayfalar.length - 1, yeni)))}
            onBitir={() => (bitti ? setGorunum('sonuc') : bitir())}
          />
          {sayfaAcik && durakPerdesi}
          {sayfaAcik && onaylar}
        </main>
      </div>
    )
  }
  if (sayfaAcik) return sayfaKatmani

  const cozumAcikMi = cozumAcik[sira] ?? degerlendirme.sonuclar[sira] !== 'd'
  const listeKonumu = incelemeListesi ? incelemeListesi.indexOf(sira) : -1
  const buyumeStili = buyume
    ? ({
        '--buyume-ust': `${buyume.ust}px`,
        '--buyume-sag': `${buyume.sag}px`,
        '--buyume-alt': `${buyume.alt}px`,
        '--buyume-sol': `${buyume.sol}px`,
      } as React.CSSProperties)
    : undefined

  return (
    <>
      {sayfaKatmani}
      <div
        className={`fixed inset-0 z-50 bg-background ${buyume ? 'soru-buyume' : ''}`}
        style={buyumeStili}
        onAnimationEnd={(olay) => {
          if (olay.target === olay.currentTarget) setBuyume(null)
        }}
      >
        <main className="relative mx-auto flex h-full max-w-md flex-col">
          <UstCubuk
            baslik={`Soru ${sira + 1}`}
            altBaslik={
              incelemeListesi && listeKonumu !== -1
                ? `İnceleme ${listeKonumu + 1} / ${incelemeListesi.length}`
                : `${baslik} · ${modAdi} · ${n} soru`
            }
            geriEtiketi="Sayfaya dön"
            ilerleme={cevaplanan / n}
            sureAl={sureAl}
            duraklatildi={duraklatildi}
            sureBitti={bitti}
            menu={menu}
            supheli={supheliler.has(sira)}
            bildirimSorusu={{
              kimlik: `${konu.id}#${kaynakSiralari[sira]}`,
              oyun: 'soru-bankasi' as const,
              soruMetni: soru.soru,
              cevapMetni: soru.siklar[soru.dogru],
            }}
            hataBildirimi={hataBildirimi}
            onGeri={geri}
            onSure={sureyiDegistir}
            onSupheli={supheliDegistir}
          />
          <SoruSeridi
            durumlar={hucreler}
            supheliler={supheliler}
            aktif={sira}
            onSec={(hedef) => {
              setIncelemeListesi(null)
              git(hedef)
            }}
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
            onOlcek={(olcek) => olcekDinleyicileri.current.forEach((dinleyici) => dinleyici(olcek))}
            gecilebilir={(yon) => (yon === 1 ? sonrakiHedef : oncekiHedef) !== null}
            onYatayGecis={(yon) => git(yon === 1 ? sonrakiHedef : oncekiHedef)}
          >
            <SoruGovdesi
              soru={soru}
              numara={sira + 1}
              isaretli={supheliler.has(sira)}
              pas={paslar.has(sira)}
              secim={secim}
              sonuc={degerlendirme.sonuclar[sira]}
              goster={goster}
              oncekiDurum={onceki[sira]}
              elenenler={elenenler[sira] ?? []}
              elemeIpucu={elemeIpucu}
              cozumAcik={cozumAcikMi}
              duzen={sikDuzeniSec(soru.siklar, sikDuzeni)}
              elemeModu={elemeModu}
              onElemeModu={() => setElemeModu((m) => !m)}
              onSec={(sik) => sec(sira, sik)}
              onEle={(sik) => ele(sira, sik)}
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
              onTemizle={() => setTemizleOnayi(true)}
              onKatla={() => setKatli((k) => !k)}
            />
            <GezinmeCubugu
              oncekiVar={oncekiHedef !== null}
              sonrakiVar={sonrakiHedef !== null}
              cevapli={secim !== undefined || onceki[sira] !== undefined}
              bitti={bitti}
              yakinlik={yakinlikKolu}
              onOnceki={() => git(oncekiHedef)}
              onSonraki={() => git(sonrakiHedef)}
              onPas={pasGec}
              onBitir={() => (bitti ? setGorunum('sonuc') : bitir())}
            />
          </div>
          {durakPerdesi}
          {onaylar}
        </main>
      </div>
    </>
  )
}
