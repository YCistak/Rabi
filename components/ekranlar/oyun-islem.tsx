'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import type { OyunIstatistigi } from '@/lib/types'
import {
  ISLEM_ADI,
  TUM_ISLEMLER,
  islemTuruHazirla,
  type IslemSorusu,
  type IslemTuru,
} from '@/lib/oyunlar/islem'
import {
  guncelSeri,
  kalanPas,
  karistir,
  rekorKirildiMi,
  turOzeti,
  yanlisSayisi,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import {
  islemdenBanka,
  type BankaCevabi,
  type BankaKaydi,
} from '@/lib/oyunlar/banka'
import { TUR_SORU_SINIRI, elerMi, soruSuresi } from '@/lib/oyunlar/ritim'
import { modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { useEtkinMod } from '@/components/tur-ayari-baglami'
import { useTurSayaci } from '@/lib/oyunlar/tur-sayaci'
import type { BildirimKolu } from '@/components/hata-bildir'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { oyunSesiCal } from '@/lib/oyunlar/oyun-sesi'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import {
  Bildirim,
  EN_COK_YANLIS,
  KalanHapi,
  KoseRabisi,
  OyunKabugu,
  TurSonu,
  YanlisKarti,
  rekorCumlesi,
  type Eleme,
} from '@/components/oyun-kabuk'
import { CevapAlani, TusTakimi, rakamEkle } from '@/components/oyun-tus-takimi'
import { OyunTanitim } from '@/components/oyun-tanitim'

/**
 * Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms).
 *
 * Doğru ve yanlış için **aynı**. Doğruda çok daha kısaydı (300 ms) ve işlem
 * bir anda değişiyordu; tuş takımına bakan oyuncu yeni sorunun ne zaman
 * geldiğini kaçırıyordu. Tek süre ritmi sabitliyor.
 */
const CEVAP_BEKLEMESI = 1100
/**
 * Turda hazırlanan en fazla soru.
 *
 * Turu bitiren şey moda göre süre ya da ilk yanlış (`mod.ts`); soru sayısı
 * hedefi yok. Bu sabit yalnızca sonsuz bir dizi üretilemediği için var.
 */
const TUR_SORUSU = TUR_SORU_SINIRI

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type GeriBildirim = { dogruMu: boolean; pas: boolean; girilen: string; beklenen: number }

/** İşlem ifadesindeki işaretler — ekranda mercan renginde duruyorlar. */
const ISARETLER = new Set(['+', '−', '-', '×', '÷', '·', '/'])

/** İfadeyi ekrana çizmek için parçalara ayırır: "93 − 21" → 93 · − · 21. */
function islemParcalari(metin: string): { parca: string; isaret: boolean }[] {
  return metin
    .split(' ')
    .filter((parca) => parca !== '')
    .map((parca) => ({ parca, isaret: ISARETLER.has(parca) }))
}

/**
 * Banka kayıtlarından tur soruları.
 *
 * Normal turda sorular üretiliyor; banka turunda üretilmiyor — bankadaki
 * sorunun kendisi tekrar edilecek soru. Karıştırılıyor ki iki banka turu
 * arka arkaya aynı sırayla gelmesin.
 */
function bankaSorulariniCoz(kayitlar: readonly BankaKaydi[]): IslemSorusu[] {
  const sorular: IslemSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'islem') continue
    sorular.push({ tur: kayit.soru.islemTuru, metin: kayit.soru.metin, sonuc: kayit.soru.sonuc })
  }
  return sorular
}

/**
 * Yanlışların işlem türüne göre dağılımı, çoktan aza.
 *
 * Hangi işlemde zorlandığını göstermek tek tek soruları saymaktan daha çok işe
 * yarıyor: "bölmede takılıyorsun" bir sonraki turda ne seçeceğini söylüyor.
 */
function turDagilimi(
  yanlislar: readonly IslemSorusu[],
  turler: readonly IslemTuru[],
): { tur: IslemTuru; sayi: number }[] {
  return turler
    .map((tur) => ({ tur, sayi: yanlislar.filter((y) => y.tur === tur).length }))
    .sort((a, b) => b.sayi - a.sayi)
}

/**
 * Bulunma hâli eki ("bölme" → "bölmede", "toplama" → "toplamada").
 *
 * Kalınlık uyumu son ünlüye bakıyor; havuzdaki işlem adlarının hepsi ünlü ya da
 * yumuşak ünsüzle bittiği için sertleşme (-ta/-te) durumu çıkmıyor.
 */
function bulunmaEki(kelime: string): string {
  const kalin = 'aıou'
  for (let i = kelime.length - 1; i >= 0; i--) {
    const harf = kelime[i].toLocaleLowerCase('tr')
    if ('aeıioöuü'.includes(harf)) return kalin.includes(harf) ? 'da' : 'de'
  }
  return 'de'
}

/**
 * Zihinden İşlem — mini oyun.
 *
 * Cevap gerçek bir `<input>` ile alınmıyor: Android'de sistem klavyesi açılır ve
 * ekranın yarısını kaplayarak hem soruyu hem tuş takımını örterdi. Rakamlar
 * ekrandaki tuş takımından geliyor, yazılan sayı kendi alanında gösteriliyor.
 */
export function IslemOyunuEkrani({
  istatistik,
  sesAcik,
  bankaSorulari,
  onTurBitti,
  onCik,
  bildir,
  demoSorulari,
  onBasladi,
  onSayimBasladi,
  demoDuraklatildi = false,
}: {
  onSayimBasladi?: () => void
  demoDuraklatildi?: boolean
  demoSorulari?: IslemSorusu[]
  onBasladi?: () => void
  istatistik: OyunIstatistigi
  /** Ses efektleri açık mı (Ayarlar → Mini oyun sesleri). */
  sesAcik: boolean
  /** Boş değilse tur yalnızca bu sorularla kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (
    ozet: TurOzeti<IslemSorusu>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — modlar arasında değişiyor. */
    gecenSaniye: number,
    /** Tur bitmeden çıkıldı mı — yarım tur rekora ve istatistiğe yazılmıyor. */
    yarim: boolean,
  ) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = demoSorulari ? { ...oyunBul('islem'), ad: 'Tanıtım oyunu' } : oyunBul('islem')

  // Seçim kalıcı: her turda altı çipi yeniden işaretlemek, oyunu açıp hemen
  // başlamayı imkânsız kılardı. Yalnızca bu ekranın kullandığı bir tercih,
  // o yüzden AppShell'e taşınmadı.

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<IslemSorusu[]>([])
  const [sira, setSira] = useState(0)
  const [girilen, setGirilen] = useState('')
  const [cevaplar, setCevaplar] = useState<Cevap<IslemSorusu>[]>([])
  /** Yanlış cevaplarda oyuncunun yazdığı sayı, yanlışlarla aynı sırada.
   *  Tur sonunda "sen 16 yazdın" demek için tutuluyor; pas geçildiyse boş. */
  const [yanlisGirdileri, setYanlisGirdileri] = useState<string[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)

  /** Tur nasıl bitti — tur sonu ekranı bunu ayrıca söylüyor. */
  const [elendi, setElendi] = useState<Eleme>(false)
  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)
  /**
   * Kaçıncı tur.
   *
   * Tur saatli modlarda sayacı sıfırlayan tek şey bu: soru sırası bir turun
   * ortasında da sıfır olabiliyor (`tur-sayaci.ts`).
   */
  const [turNo, setTurNo] = useState(0)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<IslemSorusu>; yeniRekor: boolean } | null>(
    null,
  )

  const bankaHavuzu = useMemo(() => bankaSorulariniCoz(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.length > 0
  // Seçilen mod (tanıtımın ayar adımı); banka turu seçimi dinlemiyor.
  const gecerliMod = useEtkinMod(bankaTuru)

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  /**
   * Turun başladığı an.
   *
   * Tur sabit uzunlukta değil — modun kuralına göre bitiyor. Eski hesap "tur
   * süresi eksi yanlış cezası" formülüyle türetiliyordu, o formülün karşılığı
   * kalmadı; süre gerçekten ölçülüyor.
   */
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<IslemSorusu>[]>([])
  cevaplarRef.current = cevaplar
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    setTurNo((n) => n + 1)
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setSorular(demoSorulari ?? (bankaTuru ? karistir(bankaHavuzu) : islemTuruHazirla(TUM_ISLEMLER, TUR_SORUSU)))
    setSira(0)
    setGirilen('')
    setCevaplar([])
    setYanlisGirdileri([])
    setGeriBildirim(null)
    setSonuc(null)
    setElendi(false)
    setDuraklatilan(false)
    setAsama('oynaniyor')
    onBasladi?.()
  }, [bankaHavuzu, bankaTuru, istatistik.enIyiDogru, demoSorulari, onBasladi])

  const turBitir = useCallback(
    (verilenler: Cevap<IslemSorusu>[], yarim = false) => {
      if (bittiRef.current) return
      bittiRef.current = true
      const ozet = turOzeti(verilenler)
      setSonuc({
        ozet,
        yeniRekor:
          !yarim &&
          !bankaTuru &&
          modKayitliMi(gecerliMod) &&
          rekorKirildiMi({ ...istatistik, enIyiDogru: turBasiRekor.current }, ozet),
      })
      oyunSesiCal('bitis', sesAcik)
      setAsama('bitti')
      // Doğrular da bildiriliyor ama bankayı ilerletmiyor: kayıt yalnızca
      // Oyun Bankası’ndaki genel testte doğru bilinince düşüyor (`banka.ts`).
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: islemdenBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
        yarim,
      )
    },
    [bankaTuru, gecerliMod, istatistik, onTurBitti, sesAcik],
  )

  // Seçilen tür az sayıda farklı soru üretebiliyorsa liste kısa dönebiliyor;
  // banka turunda da liste bankadaki kayıt kadar. O zaman tur erken biter.
  useEffect(() => {
    if (asama !== 'oynaniyor' || sorular.length === 0) return
    if (sira >= sorular.length) turBitir(cevaplarRef.current)
  }, [asama, sira, sorular.length, turBitir])

  useEffect(() => () => {
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
  }, [])

  /** Cevabın geri bildirimi: titreşim (yalnızca cihazda) + ses efekti. */
  const geriBildir = (dogruMu: boolean) => {
    oyunSesiCal(dogruMu ? 'dogru' : 'yanlis', sesAcik)
    if (!Capacitor.isNativePlatform()) return
    void (dogruMu
      ? Haptics.impact({ style: ImpactStyle.Light })
      : Haptics.notification({ type: NotificationType.Error })
    ).catch(() => {})
  }

  /**
   * `cevap`: yazılan sayı onaylandı. `sure`: soru saati doldu, cevapsız soru
   * yanlış sayılır. `pas`: pas hakkı kullanıldı — bedelsiz (`Cevap.pas`),
   * yalnızca doğrusu gösterilip geçiliyor.
   */
  const cevapla = useCallback(
    (nasil: 'cevap' | 'sure' | 'pas') => {
      if (asama !== 'oynaniyor' || geriBildirim !== null || demoDuraklatildi) return
      const soru = sorular[sira]
      if (!soru) return
      if (nasil === 'cevap' && girilen === '') return
      if (nasil === 'pas' && kalanPas(cevaplarRef.current) <= 0) return

      const pas = nasil === 'pas'
      const yazilan = nasil === 'cevap' ? girilen : ''
      const dogruMu = nasil === 'cevap' && Number(girilen) === soru.sonuc
      setCevaplar((onceki) => [...onceki, pas ? { soru, dogruMu, pas } : { soru, dogruMu }])
      if (!dogruMu) setYanlisGirdileri((onceki) => [...onceki, yazilan])
      setGeriBildirim({ dogruMu, pas, girilen: yazilan, beklenen: soru.sonuc })
      // Pas bir hata değil: yanlış titreşimi ve sesi yok.
      if (!pas) geriBildir(dogruMu)


      zamanlayiciRef.current = setTimeout(() => {
        setGeriBildirim(null)
        setGirilen('')
        if (!pas && elerMi(dogruMu, bankaTuru, gecerliMod)) {
          setElendi('yanlis')
          turBitir(cevaplarRef.current)
        } else {
          setSira((s) => s + 1)
        }
      }, CEVAP_BEKLEMESI)
    },
    [demoDuraklatildi, asama, bankaTuru, geriBildirim, girilen, sira, sorular, turBitir],
  )


  /**
   * Süre dolması cevap vermemekle aynı: soru pas geçilmiş sayılıyor.
   *
   * Yanlış sayıldığı için turu da bitiriyor — beklemek de bilmemek.
   */
  const sureDoldu = useCallback(() => {
    cevapla('sure')
  }, [cevapla])

  /** Tur saati bitti: yanlış değil, tur biter. */
  const turSuresiDoldu = () => {
    setElendi('sure')
    turBitir(cevaplarRef.current)
  }

  /*
    Çıkış turu bitiriyor — her modda.

    Doğrudan çıkılsaydı o turda yanlış bilinen sorular Oyun Bankası'na hiç
    düşmezdi: yarıda bırakılan tur da öğrenilen bir turdur. Tur sonu ekranı da
    çıkışta görünüyor, oyuncu ne yaptığını görmeden ekrandan atılmıyor.

    Yarım tur `yarim` bayrağıyla bildiriliyor ve rekora, istatistiğe, oyun
    geçmişine **yazılmıyor** (`oyunlar.tsx`). Bankaya yazılıyor: soruyu nerede
    yanlış bilirsen bil, öğrenmen gereken soru odur.
  */
  const turdanCik = () => {
    if (asama === 'oynaniyor' && cevaplarRef.current.length > 0) {
      turBitir(cevaplarRef.current, true)
      return
    }
    onCik()
  }

  const { kalan, toplam } = useTurSayaci({
    mod: gecerliMod,
    turSuresi: demoSorulari ? 600 : undefined,
    turNo,
    yanlisSayisi: yanlisSayisi(cevaplar),
    onTurBitti: turSuresiDoldu,
    aktif: asama === 'oynaniyor' && geriBildirim === null && !duraklatilan && !demoDuraklatildi,
    sure: soruSuresi('islem'),
    anahtar: sira,
    onBitti: sureDoldu,
  })

  const rakamYaz = useCallback((rakam: string) => {
    setGirilen((onceki) => rakamEkle(onceki, rakam))
  }, [])

  const sil = useCallback(() => setGirilen((o) => o.slice(0, -1)), [])

  // Fiziksel klavye desteği: telefonda kullanılmıyor ama tarayıcıda denemeyi
  // ve klavyeli bir tablette oynamayı mümkün kılıyor.
  useEffect(() => {
    if (asama !== 'oynaniyor' || yardimAcik || demoDuraklatildi) return
    const dinleyici = (olay: KeyboardEvent) => {
      if (olay.key >= '0' && olay.key <= '9') rakamYaz(olay.key)
      else if (olay.key === 'Backspace') sil()
      else if (olay.key === 'Enter') cevapla('cevap')
      else return
      olay.preventDefault()
    }
    window.addEventListener('keydown', dinleyici)
    return () => window.removeEventListener('keydown', dinleyici)
  }, [demoDuraklatildi, asama, yardimAcik, rakamYaz, sil, cevapla])

  const yardimAc = () => {
    setDuraklatilan(true)
    setYardimAcik(true)
  }

  const yardimKapat = () => {
    setDuraklatilan(false)
    setYardimAcik(false)
  }


  const dogruSayisi = cevaplar.filter((c) => c.dogruMu).length
  const soru = sorular[sira]
  /** Tur sonundaki dağılım yalnızca bu turda çıkan türleri gösteriyor. */
  const turdekiTurler = TUM_ISLEMLER.filter((tur) => sorular.some((s) => s.tur === tur))

  return (
    <>
      <OyunKabugu
        oyunId="islem"
        tanitimBosluk={!!demoSorulari && asama === "oynaniyor"}
        tanitimSayacHedefi={demoSorulari ? "demo-sayac" : undefined}
        baslik={oyun.ad}
        sayac={
          asama === 'bitti'
            ? null
            : {
                kalan,
                toplam,
                sira: sira + 1,
                mod: gecerliMod,
                seri: guncelSeri(cevaplar),
                dogru: dogruSayisi,
                yanlis: yanlisSayisi(cevaplar),
                enIyiSeri: turOzeti(cevaplar).enIyiSeri,
                rekor: Math.max(istatistik.enIyiDogru, dogruSayisi),
              }
        }
        pas={
          demoSorulari
            ? undefined
            : {
                kalan: kalanPas(cevaplar),
                kilitli: geriBildirim !== null,
                onPas: () => cevapla('pas'),
              }
        }
        onCik={turdanCik}
        onYardim={yardimAc}
      >
        {asama === 'bitti' && sonuc ? (
          <div className={demoSorulari ? "flex flex-1 flex-col sayfa-girisi" : "flex flex-1 flex-col"} style={demoSorulari ? { animationDuration: "500ms" } : undefined}><SonucGorunumu
            tanitimHedefi={demoSorulari ? "demo-sonuc" : undefined}
            sonuc={sonuc}
            girdiler={yanlisGirdileri}
            turler={turdekiTurler}
            rekor={turBasiRekor.current}
            bankaTuru={bankaTuru}
            mod={gecerliMod}
            elendi={elendi}
            onTekrar={turBaslat}
            onCik={onCik}
            bildir={bildir}
          /></div>
        ) : (
          asama === 'oynaniyor' &&
          soru && (
            <>
              <div data-tanitim={demoSorulari ? "demo-soru" : undefined} className={cn("flex flex-col gap-2.5", !demoSorulari && "flex-1 pt-3", demoSorulari && "sayfa-girisi")} style={demoSorulari ? { animationDuration: "500ms" } : undefined}>
                {/* İşlem türü ("Çarpma", "Bölme") bilerek yazılmıyor: köklü ve
                    üslü sorularda hangi işlemin sorulduğunu söylemek, sorunun
                    yarısını söylemek olurdu. */}
                <div data-tanitim={demoSorulari ? "demo-islem" : undefined} className="golge-kart rounded-3xl bg-card px-5 pb-5 pt-4">
                  <div className="flex items-center gap-2 text-[12.5px] font-bold text-muted-foreground">
                    <KoseRabisi durum="calisiyor" />
                    Kaç eder?
                  </div>

                  <div className="rakam mt-2.5 flex items-center justify-center gap-3 font-display text-[40px] font-extrabold leading-tight">
                    {islemParcalari(soru.metin).map(({ parca, isaret }, i) => (
                      <span key={`${parca}-${i}`} className={cn(isaret && 'text-ikincil')}>
                        {parca}
                      </span>
                    ))}
                    <span className="text-border">=</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                <CevapAlani
                  girilen={geriBildirim ? geriBildirim.girilen : girilen}
                  durum={
                    geriBildirim
                      ? geriBildirim.pas ? 'pas' : geriBildirim.dogruMu ? 'dogru' : 'yanlis'
                      : 'yaziliyor'
                  }
                  bosYazi={
                    geriBildirim?.pas ? 'pas' : geriBildirim && !geriBildirim.dogruMu ? 'süre doldu' : 'sonucu yaz'
                  }
                />

                <TusTakimi
                  kilitli={geriBildirim !== null}
                  bosMu={girilen === ''}
                  onRakam={rakamYaz}
                  onSil={sil}
                  onOnayla={() => cevapla('cevap')}
                />
                </div>
              </div>

              {geriBildirim && (
                <Bildirim
                  iyi={geriBildirim.dogruMu}
                  pas={geriBildirim.pas}
                  baslik={geriBildirim.pas ? 'Pas geçtin' : geriBildirim.dogruMu ? 'Aynen böyle!' : 'Olmadı'}
                  aciklama={
                    geriBildirim.dogruMu ? undefined : `— doğrusu ${geriBildirim.beklenen}`
                  }
                />
              )}
            </>
          )
        )}
      </OyunKabugu>

      <OyunTanitim
        oyun={oyun}
        demoVeri={!!demoSorulari}
        onSayimBasladi={onSayimBasladi}
        acik={asama === 'tanitim' || yardimAcik}
        rekor={istatistik.enIyiDogru}
        baslatir={asama === 'tanitim'}
        onBasla={turBaslat}
        onKapat={asama === 'tanitim' ? onCik : yardimKapat}
      />
    </>
  )
}


function SonucGorunumu({
  tanitimHedefi,
  sonuc,
  girdiler,
  turler,
  rekor,
  bankaTuru,
  mod,
  elendi,
  onTekrar,
  onCik,
  bildir,
}: {
  tanitimHedefi?: string
  sonuc: { ozet: TurOzeti<IslemSorusu>; yeniRekor: boolean }
  /** Yanlışlarla aynı sıradaki girdiler; boş dize pas geçildiğini gösterir. */
  girdiler: string[]
  turler: IslemTuru[]
  rekor: number
  bankaTuru: boolean
  mod: OyunModu
  elendi: Eleme
  onTekrar: () => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const { ozet, yeniRekor } = sonuc
  const gorunen = ozet.yanlislar.slice(0, EN_COK_YANLIS)
  const kalan = ozet.yanlislar.length - gorunen.length

  const dagilim = turDagilimi(ozet.yanlislar, turler)
  const enCok = dagilim[0]
  const dolular = dagilim.filter((s) => s.sayi > 0)
  const boslar = dagilim.filter((s) => s.sayi === 0)
  /** Tek bir türde yığılma var mı — başlıktaki cümle buradan geliyor. */
  const yigilma = enCok && enCok.sayi >= 2 ? enCok : null

  return (
    <TurSonu
      tanitimHedefi={tanitimHedefi}
      oyunId="islem"
      dogru={ozet.dogru}
      yanlis={ozet.yanlis}
      enIyiSeri={ozet.enIyiSeri}
      rekor={rekor}
      yeniRekor={yeniRekor}
      bankaTuru={bankaTuru}
      mod={mod}
      elendi={elendi}
      altBaslik={
        yigilma
          ? `${ISLEM_ADI[yigilma.tur]} seni yavaşlatıyor.`
          : bankaTuru
            ? 'Banka soruları — genel testte doğru bilince düşerler.'
            : rekorCumlesi(ozet.dogru, rekor, yeniRekor, 'doğru')
      }
      bolumBasligi="Nerede takıldın"
      bolumAltYazisi={
        yigilma
          ? `${ozet.yanlis} yanlıştan ${yigilma.sayi} tanesi ${ISLEM_ADI[
              yigilma.tur
            ].toLocaleLowerCase('tr')}${bulunmaEki(ISLEM_ADI[yigilma.tur])}.`
          : 'Yanlışların işlem türüne göre dağılımı.'
      }
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          <div className="golge-kart flex flex-col gap-[7px] rounded-2xl bg-card px-3.5 py-3">
            {dolular.map(({ tur, sayi }) => (
              <TurSatiri
                key={tur}
                ad={ISLEM_ADI[tur]}
                sayi={sayi}
                oran={enCok && enCok.sayi > 0 ? sayi / enCok.sayi : 0}
              />
            ))}
            {/* Hiç yanlış yapılmayan türler tek satırda toplanıyor: her biri
                ayrı boş çubuk olsaydı dağılım okunmaz olurdu. */}
            {boslar.length > 0 && (
              <TurSatiri
                ad={boslar.map((s) => ISLEM_ADI[s.tur]).join(' · ')}
                sayi={0}
                oran={0}
              />
            )}
          </div>

          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.metin}-${sira}`}
              oyunId="islem"
              soru={islemdenBanka(yanlis)}
              bildir={bildir}
            >
              <b className="rakam block font-display text-[15px] font-extrabold leading-tight">
                {yanlis.metin} = <em className="not-italic text-success">{yanlis.sonuc}</em>
              </b>
              <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
                {girdiler[sira] ? (
                  <>
                    Sen <s className="rakam text-ikincil">{girdiler[sira]}</s> yazdın
                  </>
                ) : (
                  'Pas geçtin'
                )}
              </span>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}

function TurSatiri({ ad, sayi, oran }: { ad: string; sayi: number; oran: number }) {
  const bos = sayi === 0
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 text-[11.5px] font-bold',
        bos ? 'text-muted-foreground/75' : 'text-foreground',
      )}
    >
      <span className={cn('w-24 shrink-0 leading-tight', bos && 'font-semibold')}>{ad}</span>
      <span className="h-[7px] flex-1 overflow-hidden rounded-full bg-muted">
        <span
          className="block h-full rounded-full bg-ikincil"
          style={{ width: `${Math.round(oran * 100)}%` }}
        />
      </span>
      <span className="rakam w-3.5 shrink-0 text-right">{sayi}</span>
    </div>
  )
}
