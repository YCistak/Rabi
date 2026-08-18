'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import type { OyunIstatistigi } from '@/lib/types'
import {
  ISLEM_ADI,
  ISLEM_ORNEGI,
  TUM_ISLEMLER,
  islemTuruHazirla,
  type IslemSorusu,
  type IslemTuru,
} from '@/lib/oyunlar/islem'
import {
  TUR_SURESI,
  YANLIS_CEZASI,
  guncelSeri,
  kalanSaniye,
  karistir,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import {
  islemdenBanka,
  type BankaCevabi,
  type BankaKaydi,
} from '@/lib/oyunlar/banka'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { oyunSesiCal } from '@/lib/oyunlar/oyun-sesi'
import { ANAHTARLAR, useYerelDepo } from '@/lib/depo'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Cip } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import {
  Bildirim,
  EN_COK_YANLIS,
  KalanHapi,
  OyunKabugu,
  TurSonu,
  YanlisKarti,
  rekorCumlesi,
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
/** Bir turda üretilen soru sayısı — en hızlı oyuncunun bile tüketemeyeceği kadar. */
const TUR_SORUSU = 120

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type GeriBildirim = { dogruMu: boolean; girilen: string; beklenen: number }

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
}: {
  istatistik: OyunIstatistigi
  /** Ses efektleri açık mı (Ayarlar → Mini oyun sesleri). */
  sesAcik: boolean
  /** Boş değilse tur yalnızca bu sorularla kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (ozet: TurOzeti<IslemSorusu>, bankaCevaplari: BankaCevabi[]) => void
  onCik: () => void
}) {
  const oyun = oyunBul('islem')

  // Seçim kalıcı: her turda altı çipi yeniden işaretlemek, oyunu açıp hemen
  // başlamayı imkânsız kılardı. Yalnızca bu ekranın kullandığı bir tercih,
  // o yüzden AppShell'e taşınmadı.
  const [secili, setSecili] = useYerelDepo<IslemTuru[]>(ANAHTARLAR.islemSecimi, TUM_ISLEMLER)

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

  const [bitisZamani, setBitisZamani] = useState(0)
  const [kalan, setKalan] = useState(TUR_SURESI)
  /** Yardım açıkken sayaç durur; kalan saniye burada bekletilir. */
  const [duraklatilan, setDuraklatilan] = useState<number | null>(null)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<IslemSorusu>; yeniRekor: boolean } | null>(
    null,
  )

  const bankaHavuzu = useMemo(() => bankaSorulariniCoz(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.length > 0

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<IslemSorusu>[]>([])
  cevaplarRef.current = cevaplar
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setSorular(bankaTuru ? karistir(bankaHavuzu) : islemTuruHazirla(secili, TUR_SORUSU))
    setSira(0)
    setGirilen('')
    setCevaplar([])
    setYanlisGirdileri([])
    setGeriBildirim(null)
    setSonuc(null)
    setDuraklatilan(null)
    setKalan(TUR_SURESI)
    setBitisZamani(Date.now() + TUR_SURESI * 1000)
    setAsama('oynaniyor')
  }, [bankaHavuzu, bankaTuru, istatistik.enIyiDogru, secili])

  const turBitir = useCallback(
    (verilenler: Cevap<IslemSorusu>[]) => {
      if (bittiRef.current) return
      bittiRef.current = true
      const ozet = turOzeti(verilenler)
      setSonuc({
        ozet,
        yeniRekor:
          !bankaTuru &&
          rekorKirildiMi({ ...istatistik, enIyiDogru: turBasiRekor.current }, ozet),
      })
      oyunSesiCal('bitis', sesAcik)
      setAsama('bitti')
      // Doğrular da bildiriliyor: banka, üst üste üç kez doğru bilinen kaydı
      // düşürüyor.
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: islemdenBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
      )
    },
    [bankaTuru, istatistik, onTurBitti, sesAcik],
  )

  useEffect(() => {
    if (asama !== 'oynaniyor' || duraklatilan !== null) return

    const oku = () => {
      const yeni = kalanSaniye(bitisZamani)
      setKalan(yeni)
      if (yeni <= 0) turBitir(cevaplarRef.current)
    }
    oku()
    const isaret = setInterval(oku, 250)
    return () => clearInterval(isaret)
  }, [asama, bitisZamani, duraklatilan, turBitir])

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

  /** `pas` true ise cevap verilmeden geçiliyor; yanlış sayılır. */
  const cevapla = useCallback(
    (pas: boolean) => {
      if (asama !== 'oynaniyor' || geriBildirim !== null) return
      const soru = sorular[sira]
      if (!soru) return
      if (!pas && girilen === '') return

      const dogruMu = !pas && Number(girilen) === soru.sonuc
      setCevaplar((onceki) => [...onceki, { soru, dogruMu }])
      if (!dogruMu) setYanlisGirdileri((onceki) => [...onceki, pas ? '' : girilen])
      setGeriBildirim({ dogruMu, girilen: pas ? '' : girilen, beklenen: soru.sonuc })
      geriBildir(dogruMu)

      if (!dogruMu) setBitisZamani((b) => b - YANLIS_CEZASI * 1000)

      zamanlayiciRef.current = setTimeout(() => {
        setGeriBildirim(null)
        setGirilen('')
        setSira((s) => s + 1)
      }, CEVAP_BEKLEMESI)
    },
    [asama, geriBildirim, girilen, sira, sorular],
  )

  const rakamYaz = useCallback((rakam: string) => {
    setGirilen((onceki) => rakamEkle(onceki, rakam))
  }, [])

  const sil = useCallback(() => setGirilen((o) => o.slice(0, -1)), [])

  // Fiziksel klavye desteği: telefonda kullanılmıyor ama tarayıcıda denemeyi
  // ve klavyeli bir tablette oynamayı mümkün kılıyor.
  useEffect(() => {
    if (asama !== 'oynaniyor' || yardimAcik) return
    const dinleyici = (olay: KeyboardEvent) => {
      if (olay.key >= '0' && olay.key <= '9') rakamYaz(olay.key)
      else if (olay.key === 'Backspace') sil()
      else if (olay.key === 'Enter') cevapla(false)
      else return
      olay.preventDefault()
    }
    window.addEventListener('keydown', dinleyici)
    return () => window.removeEventListener('keydown', dinleyici)
  }, [asama, yardimAcik, rakamYaz, sil, cevapla])

  const yardimAc = () => {
    setDuraklatilan(kalanSaniye(bitisZamani))
    setYardimAcik(true)
  }

  const yardimKapat = () => {
    if (duraklatilan !== null) setBitisZamani(Date.now() + duraklatilan * 1000)
    setDuraklatilan(null)
    setYardimAcik(false)
  }

  const turDegistir = (tur: IslemTuru) => {
    setSecili((onceki) => {
      const varMi = onceki.includes(tur)
      // Son işlem çıkarılamıyor: hiçbiri seçili değilken oyun soru üretemezdi.
      if (varMi && onceki.length === 1) return onceki
      return varMi ? onceki.filter((t) => t !== tur) : [...onceki, tur]
    })
  }

  const dogruSayisi = cevaplar.filter((c) => c.dogruMu).length
  const gorunenKalan = duraklatilan ?? kalan
  const soru = sorular[sira]
  /** Tur sonundaki dağılım yalnızca bu turda çıkan türleri gösteriyor. */
  const turdekiTurler = TUM_ISLEMLER.filter((tur) => sorular.some((s) => s.tur === tur))

  return (
    <>
      <OyunKabugu
        oyunId="islem"
        baslik={oyun.ad}
        sayac={
          asama === 'bitti'
            ? null
            : {
                kalan: gorunenKalan,
                seri: guncelSeri(cevaplar),
                dogru: dogruSayisi,
                yanlis: cevaplar.length - dogruSayisi,
                enIyiSeri: turOzeti(cevaplar).enIyiSeri,
                rekor: Math.max(istatistik.enIyiDogru, dogruSayisi),
                cezaGorunur: geriBildirim !== null && !geriBildirim.dogruMu,
              }
        }
        onCik={onCik}
        onYardim={yardimAc}
      >
        {asama === 'bitti' && sonuc ? (
          <SonucGorunumu
            sonuc={sonuc}
            girdiler={yanlisGirdileri}
            turler={turdekiTurler}
            rekor={turBasiRekor.current}
            bankaTuru={bankaTuru}
            onTekrar={turBaslat}
            onCik={onCik}
          />
        ) : (
          asama === 'oynaniyor' &&
          soru && (
            <>
              <div className="flex flex-1 flex-col gap-2.5 pt-3">
                {/* İşlem türü ("Çarpma", "Bölme") bilerek yazılmıyor: köklü ve
                    üslü sorularda hangi işlemin sorulduğunu söylemek, sorunun
                    yarısını söylemek olurdu. */}
                <div className="golge-kart rounded-3xl bg-card px-5 pb-5 pt-4">
                  <div className="flex items-center gap-2 text-[12.5px] font-bold text-muted-foreground">
                    <Rabi durum="calisiyor" boyut={26} />
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

                <CevapAlani
                  girilen={geriBildirim ? geriBildirim.girilen : girilen}
                  durum={
                    geriBildirim ? (geriBildirim.dogruMu ? 'dogru' : 'yanlis') : 'yaziliyor'
                  }
                  bosYazi={geriBildirim && !geriBildirim.dogruMu ? 'pas' : 'sonucu yaz'}
                />

                <TusTakimi
                  kilitli={geriBildirim !== null}
                  bosMu={girilen === ''}
                  onRakam={rakamYaz}
                  onSil={sil}
                  onOnayla={() => cevapla(false)}
                  onPas={() => cevapla(true)}
                />
              </div>

              {geriBildirim && (
                <Bildirim
                  iyi={geriBildirim.dogruMu}
                  baslik={geriBildirim.dogruMu ? 'Aynen böyle!' : 'Olmadı'}
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
        acik={asama === 'tanitim' || yardimAcik}
        rekor={istatistik.enIyiDogru}
        baslatir={asama === 'tanitim'}
        onBasla={turBaslat}
        onKapat={asama === 'tanitim' ? onCik : yardimKapat}
        // Banka turunda tür seçimi gösterilmiyor: sorular bankadan geliyor,
        // seçim onları değiştirmiyor.
        ekstra={
          asama === 'tanitim' && !bankaTuru ? (
            <IslemSecimi secili={secili} onDegis={turDegistir} />
          ) : null
        }
      />
    </>
  )
}

/** Tanıtım penceresindeki işlem türü seçimi. */
function IslemSecimi({
  secili,
  onDegis,
}: {
  secili: IslemTuru[]
  onDegis: (tur: IslemTuru) => void
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Hangi işlemler gelsin?</p>
      <div className="flex flex-wrap gap-2">
        {TUM_ISLEMLER.map((tur) => (
          <Cip
            key={tur}
            secili={secili.includes(tur)}
            onClick={() => onDegis(tur)}
            className="flex-col items-start px-3 py-1.5 text-left leading-tight"
          >
            <span className="block">{ISLEM_ADI[tur]}</span>
            <span
              className={cn(
                'rakam block text-[11px] font-normal',
                secili.includes(tur) ? 'text-primary-foreground/75' : 'text-muted-foreground/70',
              )}
            >
              {ISLEM_ORNEGI[tur]}
            </span>
          </Cip>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Seçimin saklanır; en az bir işlem açık kalmalı.
      </p>
    </div>
  )
}

function SonucGorunumu({
  sonuc,
  girdiler,
  turler,
  rekor,
  bankaTuru,
  onTekrar,
  onCik,
}: {
  sonuc: { ozet: TurOzeti<IslemSorusu>; yeniRekor: boolean }
  /** Yanlışlarla aynı sıradaki girdiler; boş dize pas geçildiğini gösterir. */
  girdiler: string[]
  turler: IslemTuru[]
  rekor: number
  bankaTuru: boolean
  onTekrar: () => void
  onCik: () => void
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
      oyunId="islem"
      dogru={ozet.dogru}
      yanlis={ozet.yanlis}
      enIyiSeri={ozet.enIyiSeri}
      rekor={rekor}
      yeniRekor={yeniRekor}
      bankaTuru={bankaTuru}
      altBaslik={
        yigilma
          ? `${ISLEM_ADI[yigilma.tur]} seni yavaşlatıyor.`
          : bankaTuru
            ? 'Banka soruları — üst üste üç doğruda düşerler.'
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
            <YanlisKarti key={`${yanlis.metin}-${sira}`} oyunId="islem">
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
