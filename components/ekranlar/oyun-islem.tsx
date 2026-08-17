'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, Delete, RotateCcw, SkipForward } from 'lucide-react'
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
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { ANAHTARLAR, useYerelDepo } from '@/lib/depo'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Buton, Cip, Deger } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { OyunKabugu } from '@/components/oyun-kabuk'
import { OyunTanitim } from '@/components/oyun-tanitim'

/** Doğru cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms). */
const DOGRU_BEKLEME = 300
/** Yanlışta daha uzun bekleniyor: doğru sonuç okunabilsin. */
const YANLIS_BEKLEME = 1100
/** Bir turda üretilen soru sayısı — en hızlı oyuncunun bile tüketemeyeceği kadar. */
const TUR_SORUSU = 120
/** Cevap alanına yazılabilecek en fazla rakam. En büyük sonuç dört basamaklı. */
const EN_COK_RAKAM = 5

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type GeriBildirim = { dogruMu: boolean; girilen: string; beklenen: number }

/**
 * Zihinden İşlem — mini oyun.
 *
 * Cevap gerçek bir `<input>` ile alınmıyor: Android'de sistem klavyesi açılır ve
 * ekranın yarısını kaplayarak hem soruyu hem tuş takımını örterdi. Rakamlar
 * ekrandaki tuş takımından geliyor, yazılan sayı kendi alanında gösteriliyor.
 */
export function IslemOyunuEkrani({
  istatistik,
  onTurBitti,
  onCik,
}: {
  istatistik: OyunIstatistigi
  onTurBitti: (ozet: TurOzeti<IslemSorusu>) => void
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
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)

  const [bitisZamani, setBitisZamani] = useState(0)
  const [kalan, setKalan] = useState(TUR_SURESI)
  /** Yardım açıkken sayaç durur; kalan saniye burada bekletilir. */
  const [duraklatilan, setDuraklatilan] = useState<number | null>(null)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<IslemSorusu>; yeniRekor: boolean } | null>(
    null,
  )

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
    setSorular(islemTuruHazirla(secili, TUR_SORUSU))
    setSira(0)
    setGirilen('')
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setDuraklatilan(null)
    setKalan(TUR_SURESI)
    setBitisZamani(Date.now() + TUR_SURESI * 1000)
    setAsama('oynaniyor')
  }, [istatistik.enIyiDogru, secili])

  const turBitir = useCallback(
    (verilenler: Cevap<IslemSorusu>[]) => {
      if (bittiRef.current) return
      bittiRef.current = true
      const ozet = turOzeti(verilenler)
      setSonuc({
        ozet,
        yeniRekor: rekorKirildiMi({ ...istatistik, enIyiDogru: turBasiRekor.current }, ozet),
      })
      setAsama('bitti')
      onTurBitti(ozet)
    },
    [istatistik, onTurBitti],
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
  // o zaman tur süre dolmadan biter.
  useEffect(() => {
    if (asama !== 'oynaniyor' || sorular.length === 0) return
    if (sira >= sorular.length) turBitir(cevaplarRef.current)
  }, [asama, sira, sorular.length, turBitir])

  useEffect(() => () => {
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
  }, [])

  const titre = (dogruMu: boolean) => {
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
      setGeriBildirim({ dogruMu, girilen: pas ? '' : girilen, beklenen: soru.sonuc })
      titre(dogruMu)

      if (!dogruMu) setBitisZamani((b) => b - YANLIS_CEZASI * 1000)

      zamanlayiciRef.current = setTimeout(
        () => {
          setGeriBildirim(null)
          setGirilen('')
          setSira((s) => s + 1)
        },
        dogruMu ? DOGRU_BEKLEME : YANLIS_BEKLEME,
      )
    },
    [asama, geriBildirim, girilen, sira, sorular],
  )

  const rakamYaz = useCallback((rakam: string) => {
    setGirilen((onceki) => {
      // Baştaki sıfır anlamsız: "0" yazıp 5'e basınca 5 olmalı, 05 değil.
      const temel = onceki === '0' ? '' : onceki
      if (temel.length >= EN_COK_RAKAM) return temel
      return temel + rakam
    })
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
  const yanlisSayisi = cevaplar.length - dogruSayisi
  const gorunenKalan = duraklatilan ?? kalan
  const rekor = Math.max(istatistik.enIyiDogru, dogruSayisi)
  const soru = sorular[sira]

  return (
    <>
      <OyunKabugu
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
              }
        }
        onCik={onCik}
        onYardim={yardimAc}
      >
        {asama === 'bitti' && sonuc ? (
          <SonucGorunumu
            sonuc={sonuc}
            rekor={Math.max(istatistik.enIyiDogru, sonuc.ozet.dogru)}
            onTekrar={turBaslat}
            onCik={onCik}
          />
        ) : (
          asama === 'oynaniyor' &&
          soru && (
            <>
              {/* İşlem türü ("Çarpma", "Bölme") bilerek yazılmıyor: köklü ve
                  üslü sorularda hangi işlemin sorulduğunu söylemek, sorunun
                  yarısını söylemek olurdu. */}
              <div className="flex flex-1 flex-col items-center justify-center py-6">
                <p className="rakam font-display text-5xl font-semibold tracking-tight">
                  {soru.metin}
                </p>
                <CevapAlani girilen={girilen} geriBildirim={geriBildirim} />
              </div>

              <TusTakimi
                kilitli={geriBildirim !== null}
                bosMu={girilen === ''}
                onRakam={rakamYaz}
                onSil={sil}
                onOnayla={() => cevapla(false)}
                onPas={() => cevapla(true)}
              />
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
        ekstra={asama === 'tanitim' ? <IslemSecimi secili={secili} onDegis={turDegistir} /> : null}
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

/**
 * Yazılan sayının göründüğü alan.
 *
 * Yanlış cevapta doğru sonuç hemen altında yeşille yazılıyor: yalnızca "yanlış"
 * denseydi oyuncu hatasını görür ama doğrusunu öğrenemezdi.
 */
function CevapAlani({
  girilen,
  geriBildirim,
}: {
  girilen: string
  geriBildirim: GeriBildirim | null
}) {
  const yanlisMi = geriBildirim !== null && !geriBildirim.dogruMu
  const dogruMu = geriBildirim?.dogruMu === true
  const gosterilen = geriBildirim ? geriBildirim.girilen : girilen

  return (
    <div className="mt-6 w-full">
      <div
        aria-live="polite"
        className={cn(
          'flex h-16 w-full items-center justify-center rounded-2xl border-2 px-4',
          'rakam font-display text-4xl font-semibold',
          !geriBildirim && 'border-border bg-card',
          dogruMu && 'border-success bg-success/12 text-success',
          yanlisMi && 'border-danger bg-danger/12 text-danger',
        )}
      >
        {gosterilen === '' ? (
          <span className="text-2xl font-normal text-muted-foreground/60">
            {yanlisMi ? 'pas' : 'sonucu yaz'}
          </span>
        ) : (
          gosterilen
        )}
      </div>

      <p className="mt-2 h-5 text-center text-sm font-medium text-success">
        {yanlisMi ? `Doğrusu ${geriBildirim.beklenen}` : ''}
      </p>
    </div>
  )
}

const TUSLAR = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

function TusTakimi({
  kilitli,
  bosMu,
  onRakam,
  onSil,
  onOnayla,
  onPas,
}: {
  kilitli: boolean
  bosMu: boolean
  onRakam: (rakam: string) => void
  onSil: () => void
  onOnayla: () => void
  onPas: () => void
}) {
  return (
    <div className="pb-3">
      <button
        type="button"
        onClick={onPas}
        disabled={kilitli}
        className="mx-auto mb-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground active:bg-muted disabled:opacity-45"
      >
        <SkipForward size={15} aria-hidden /> Pas geç (−{YANLIS_CEZASI} sn)
      </button>

      <div className="grid grid-cols-3 gap-2">
        {TUSLAR.map((rakam) => (
          <Tus key={rakam} kilitli={kilitli} onClick={() => onRakam(rakam)}>
            {rakam}
          </Tus>
        ))}

        <Tus kilitli={kilitli || bosMu} onClick={onSil} etiket="Sil">
          <Delete size={22} aria-hidden />
        </Tus>
        <Tus kilitli={kilitli} onClick={() => onRakam('0')}>
          0
        </Tus>
        <Tus kilitli={kilitli || bosMu} onClick={onOnayla} etiket="Onayla" vurgu>
          <Check size={24} aria-hidden />
        </Tus>
      </div>
    </div>
  )
}

function Tus({
  kilitli,
  vurgu,
  etiket,
  onClick,
  children,
}: {
  kilitli: boolean
  vurgu?: boolean
  etiket?: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={kilitli}
      aria-label={etiket}
      className={cn(
        'flex h-14 items-center justify-center rounded-2xl border text-2xl font-semibold transition',
        'rakam font-display disabled:opacity-40',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        vurgu
          ? 'border-primary bg-primary text-primary-foreground active:brightness-95'
          : 'border-border bg-card active:bg-muted',
      )}
    >
      {children}
    </button>
  )
}

function SonucGorunumu({
  sonuc,
  rekor,
  onTekrar,
  onCik,
}: {
  sonuc: { ozet: TurOzeti<IslemSorusu>; yeniRekor: boolean }
  rekor: number
  onTekrar: () => void
  onCik: () => void
}) {
  const { ozet, yeniRekor } = sonuc
  const yuzde = Math.round(ozet.oran * 100)

  return (
    <div className="flex-1 py-4">
      <div className="flex flex-col items-center text-center">
        <Rabi
          durum={yeniRekor || ozet.hatasiz ? 'kutlama' : ozet.oran >= 0.6 ? 'mutlu' : 'normal'}
          boyut={104}
        />
        <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
          {yeniRekor ? 'Yeni rekor!' : 'Süre bitti'}
        </p>
        {ozet.hatasiz && (
          <p className="mt-1 text-sm text-success">Hiç yanlışın yok — hatasız tur.</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <Deger className="px-2" etiket="Doğru" deger={String(ozet.dogru)} vurgu />
        <Deger className="px-2" etiket="Yanlış" deger={String(ozet.yanlis)} />
        <Deger className="px-2" etiket="Seri" deger={String(ozet.enIyiSeri)} />
        <Deger className="px-2" etiket="Başarı" deger={`%${yuzde}`} altNot={`rekor ${rekor}`} />
      </div>

      {ozet.yanlislar.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Kaçırdıkların</h2>
          <ul className="space-y-2">
            {ozet.yanlislar.map((yanlis, sira) => (
              <li
                key={`${yanlis.metin}-${sira}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-3 py-2.5"
              >
                <span className="rakam font-display text-lg">{yanlis.metin}</span>
                <span className="rakam font-display text-lg font-semibold text-success">
                  {yanlis.sonuc}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ozet.toplam === 0 && (
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Hiç cevap vermedin. Bir daha dene, süre {TUR_SURESI} saniye.
        </p>
      )}

      <div className="mt-6 flex gap-2 pb-2">
        <Buton bicim="ikincil" className="flex-1" onClick={onCik}>
          Çık
        </Buton>
        <Buton className="flex-1" onClick={onTekrar}>
          <RotateCcw size={16} aria-hidden /> Tekrar oyna
        </Buton>
      </div>
    </div>
  )
}
