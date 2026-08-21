'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, Delete, X } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import {
  BOLEN_KURALI,
  KALAN_KURALI,
  TUM_BOLENLER,
  bolunmeCevabi,
  bolunmeTuruHazirla,
  bolunuyorMu,
  kuralIzi,
  type BolunmeSorusu,
} from '@/lib/oyunlar/bolunme'
import {
  guncelSeri,
  karistir,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { bolunmedenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import { TUR_SORU_SINIRI, elerMi, soruSuresi } from '@/lib/oyunlar/ritim'
import { useSoruSayaci } from '@/lib/oyunlar/soru-sayaci'
import type { BildirimKolu } from '@/components/hata-bildir'
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
  type Eleme,
} from '@/components/oyun-kabuk'
import { OyunTanitim } from '@/components/oyun-tanitim'

/** Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms). İşlem oyunuyla aynı ritim. */
const CEVAP_BEKLEMESI = 1100
/**
 * Turda hazırlanan en fazla soru.
 *
 * Tur sınırsız: yanlış cevap turu bitiriyor (`ritim.ts`), o yüzden bir soru
 * sayısı hedefi yok — bu sabit yalnızca sonsuz dizi üretilemediği için var.
 */
const TUR_SORUSU = TUR_SORU_SINIRI

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/** Verilen cevap: kalan sorusunda yazılan rakam, bölünür sorusunda evet/hayır. */
type Girdi = { tip: 'kalan'; rakam: string } | { tip: 'bolunur'; evet: boolean }

type GeriBildirim = { dogruMu: boolean; girdi: Girdi | null; soru: BolunmeSorusu }

/**
 * Bölenin yönelme hâli: 6 → "6'ya", 9 → "9'a".
 *
 * Kural tablodan okunuyor, ekten üretilmiyor: sayıların okunuşu ("altı", "dokuz")
 * yazılışlarından çıkarılamıyor, dokuz bir yandan ince ünlüyle bitiyor ama eki
 * kalın alıyor.
 */
const YONELME: Record<number, string> = {
  2: '2’ye',
  3: '3’e',
  4: '4’e',
  5: '5’e',
  6: '6’ya',
  7: '7’ye',
  8: '8’e',
  9: '9’a',
  10: '10’a',
}

/** "8'e bölünür mü?" / "8'e bölümünden kalan?" */
function soruMetni(soru: BolunmeSorusu): string {
  return soru.tip === 'kalan'
    ? `${YONELME[soru.bolen]} bölümünden kalan kaç?`
    : `${YONELME[soru.bolen]} bölünür mü?`
}

/** Doğru cevabın okunur hâli — bildirimde ve tur sonunda. */
function cevapMetni(soru: BolunmeSorusu): string {
  return soru.tip === 'kalan' ? String(bolunmeCevabi(soru)) : bolunuyorMu(soru) ? 'Evet' : 'Hayır'
}

/**
 * Banka kayıtlarından tur soruları.
 *
 * Bankadaki kayıt cevabı taşımıyor, sayıyla böleni taşıyor; cevap burada da
 * hesaplanıyor. Böylece bankada eskimiş bir cevap kalma ihtimali yok.
 */
function bankaSorulariniCoz(kayitlar: readonly BankaKaydi[]): BolunmeSorusu[] {
  const sorular: BolunmeSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'bolunme') continue
    sorular.push({ tip: kayit.soru.bolunmeTipi, sayi: kayit.soru.sayi, bolen: kayit.soru.bolen })
  }
  return sorular
}

/** Yanlışların bölene göre dağılımı, çoktan aza. Hangi kuralda takıldığını gösterir. */
function bolenDagilimi(
  yanlislar: readonly BolunmeSorusu[],
  bolenler: readonly number[],
): { bolen: number; sayi: number }[] {
  return bolenler
    .map((bolen) => ({ bolen, sayi: yanlislar.filter((y) => y.bolen === bolen).length }))
    .sort((a, b) => b.sayi - a.sayi)
}

/**
 * Bölünebilme Kuralları — mini oyun.
 *
 * İki soru tipi tek turda karışık geliyor: "kalan kaç" tuş takımından, "bölünür
 * mü" iki düğmeden cevaplanıyor. Cevap alanı iki tipte de aynı yükseklikte
 * duruyor — soru tipi her soruda değiştiği için yükseklik oynasaydı ekran
 * sürekli zıplardı.
 */
export function BolunmeOyunuEkrani({
  istatistik,
  sesAcik,
  bankaSorulari,
  onTurBitti,
  onCik,
  bildir,
}: {
  istatistik: OyunIstatistigi
  sesAcik: boolean
  bankaSorulari: BankaKaydi[]
  onTurBitti: (
    ozet: TurOzeti<BolunmeSorusu>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — tur artık sabit süreli değil. */
    gecenSaniye: number,
  ) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('bolunme')

  const [secili, setSecili] = useYerelDepo<number[]>(ANAHTARLAR.bolenSecimi, [...TUM_BOLENLER])

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<BolunmeSorusu[]>([])
  const [sira, setSira] = useState(0)
  const [girilen, setGirilen] = useState('')
  const [cevaplar, setCevaplar] = useState<Cevap<BolunmeSorusu>[]>([])
  /** Yanlışlarla aynı sıradaki girdiler; null pas geçildiğini gösterir. */
  const [yanlisGirdileri, setYanlisGirdileri] = useState<(Girdi | null)[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)

  /** Tur nasıl bitti — tur sonu ekranı bunu ayrıca söylüyor. */
  const [elendi, setElendi] = useState<Eleme>(false)
  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)

  const [sonuc, setSonuc] = useState<{
    ozet: TurOzeti<BolunmeSorusu>
    yeniRekor: boolean
  } | null>(null)

  const bankaHavuzu = useMemo(() => bankaSorulariniCoz(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.length > 0

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  /**
   * Turun başladığı an.
   *
   * Tur artık sabit uzunlukta değil — sınırsız sürüyor ve boss'ta bitiyor. Eski
   * hesap "tur süresi eksi yanlış cezası" formülüyle türetiliyordu, o formülün
   * karşılığı kalmadı; süre gerçekten ölçülüyor.
   */
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<BolunmeSorusu>[]>([])
  cevaplarRef.current = cevaplar
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setSorular(bankaTuru ? karistir(bankaHavuzu) : bolunmeTuruHazirla(secili, TUR_SORUSU))
    setSira(0)
    setGirilen('')
    setCevaplar([])
    setYanlisGirdileri([])
    setGeriBildirim(null)
    setSonuc(null)
    setElendi(false)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [bankaHavuzu, bankaTuru, istatistik.enIyiDogru, secili])

  const turBitir = useCallback(
    (verilenler: Cevap<BolunmeSorusu>[]) => {
      if (bittiRef.current) return
      bittiRef.current = true
      const ozet = turOzeti(verilenler)
      setSonuc({
        ozet,
        yeniRekor:
          !bankaTuru && rekorKirildiMi({ ...istatistik, enIyiDogru: turBasiRekor.current }, ozet),
      })
      oyunSesiCal('bitis', sesAcik)
      setAsama('bitti')
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({ soru: bolunmedenBanka(cevap.soru), dogruMu: cevap.dogruMu })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
      )
    },
    [bankaTuru, istatistik, onTurBitti, sesAcik],
  )

  // Banka turunda liste bankadaki kayıt kadar; tükenince tur erken biter.
  useEffect(() => {
    if (asama !== 'oynaniyor' || sorular.length === 0) return
    if (sira >= sorular.length) turBitir(cevaplarRef.current)
  }, [asama, sira, sorular.length, turBitir])

  useEffect(
    () => () => {
      if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    },
    [],
  )

  const geriBildir = (dogruMu: boolean) => {
    oyunSesiCal(dogruMu ? 'dogru' : 'yanlis', sesAcik)
    if (!Capacitor.isNativePlatform()) return
    void (dogruMu
      ? Haptics.impact({ style: ImpactStyle.Light })
      : Haptics.notification({ type: NotificationType.Error })
    ).catch(() => {})
  }

  /** `girdi` null ise pas geçiliyor; yanlış sayılır. */
  const cevapla = useCallback(
    (girdi: Girdi | null) => {
      if (asama !== 'oynaniyor' || geriBildirim !== null) return
      const soru = sorular[sira]
      if (!soru) return
      // Soru tipiyle girdi tipi uyuşmuyorsa (klavyeden yanlış tuş) cevap sayılmaz.
      if (girdi && girdi.tip !== soru.tip) return

      const dogruMu =
        girdi !== null &&
        (girdi.tip === 'kalan'
          ? Number(girdi.rakam) === bolunmeCevabi(soru)
          : girdi.evet === bolunuyorMu(soru))

      setCevaplar((onceki) => [...onceki, { soru, dogruMu }])
      if (!dogruMu) setYanlisGirdileri((onceki) => [...onceki, girdi])
      setGeriBildirim({ dogruMu, girdi, soru })
      geriBildir(dogruMu)


      zamanlayiciRef.current = setTimeout(() => {
        setGeriBildirim(null)
        setGirilen('')
        if (elerMi(dogruMu, bankaTuru)) {
          setElendi('yanlis')
          turBitir(cevaplarRef.current)
        } else {
          setSira((s) => s + 1)
        }
      }, CEVAP_BEKLEMESI)
    },
    [asama, bankaTuru, geriBildirim, sira, sorular, turBitir],
  )

  // Kalan tek basamaklı (bölen en çok 10), o yüzden yazılan rakam eskisini
  // değiştiriyor: yanlış tuşa basan önce silmek zorunda kalmasın.

  /**
   * Süre dolması cevap vermemekle aynı: soru pas geçilmiş sayılıyor.
   *
   * Matematik oyunlarında boss yok, dolayısıyla eleme de yok — süre dolunca
   * tur bitmiyor, sıradaki soruya geçiliyor.
   */
  const sureDoldu = useCallback(() => {
    cevapla(null)
  }, [cevapla])

  const { kalan, toplam } = useSoruSayaci({
    aktif: asama === 'oynaniyor' && geriBildirim === null && !duraklatilan,
    sure: soruSuresi('bolunme', null),
    anahtar: sira,
    onBitti: sureDoldu,
  })

  const rakamYaz = useCallback((rakam: string) => setGirilen(rakam), [])
  const sil = useCallback(() => setGirilen(''), [])

  const soru = sorular[sira]

  // Fiziksel klavye: tarayıcıda denemeyi ve klavyeli tablette oynamayı sağlıyor.
  useEffect(() => {
    if (asama !== 'oynaniyor' || yardimAcik || !soru) return
    const dinleyici = (olay: KeyboardEvent) => {
      const harf = olay.key.toLocaleLowerCase('tr')
      if (soru.tip === 'bolunur') {
        if (harf === 'e') cevapla({ tip: 'bolunur', evet: true })
        else if (harf === 'h') cevapla({ tip: 'bolunur', evet: false })
        else return
      } else {
        if (olay.key >= '0' && olay.key <= '9') rakamYaz(olay.key)
        else if (olay.key === 'Backspace') sil()
        else if (olay.key === 'Enter' && girilen !== '')
          cevapla({ tip: 'kalan', rakam: girilen })
        else return
      }
      olay.preventDefault()
    }
    window.addEventListener('keydown', dinleyici)
    return () => window.removeEventListener('keydown', dinleyici)
  }, [asama, yardimAcik, soru, girilen, rakamYaz, sil, cevapla])

  const yardimAc = () => {
    setDuraklatilan(true)
    setYardimAcik(true)
  }

  const yardimKapat = () => {
    setDuraklatilan(false)
    setYardimAcik(false)
  }

  const bolenDegistir = (bolen: number) => {
    setSecili((onceki) => {
      const varMi = onceki.includes(bolen)
      // Son bölen çıkarılamıyor: hiçbiri seçili değilken oyun soru üretemezdi.
      if (varMi && onceki.length === 1) return onceki
      return varMi ? onceki.filter((b) => b !== bolen) : [...onceki, bolen].sort((a, b) => a - b)
    })
  }

  const dogruSayisi = cevaplar.filter((c) => c.dogruMu).length
  const turdekiBolenler = TUM_BOLENLER.filter((b) => sorular.some((s) => s.bolen === b))

  return (
    <>
      <OyunKabugu
        oyunId="bolunme"
        baslik={oyun.ad}
        sayac={
          asama === 'bitti'
            ? null
            : {
                kalan,
                toplam,
                sira: sira + 1,
                boss: false,
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
            girdiler={yanlisGirdileri}
            bolenler={turdekiBolenler}
            rekor={turBasiRekor.current}
            bankaTuru={bankaTuru}
            elendi={elendi}
            onTekrar={turBaslat}
            onCik={onCik}
            bildir={bildir}
          />
        ) : (
          asama === 'oynaniyor' &&
          soru && (
            <>
              <div className="flex flex-1 flex-col gap-2.5 pt-3">
                {/* Soru kartı boşta kalan alanın ortasında duruyor; cevap alanı
                    aşağıya sabitli, başparmağın gittiği yerde kalsın diye. */}
                <div className="golge-kart my-auto rounded-3xl bg-card px-5 pb-4 pt-4">
                  <div className="flex items-center gap-2 text-[12.5px] font-bold text-muted-foreground">
                    <Rabi durum="calisiyor" boyut={26} />
                    {soru.tip === 'kalan' ? 'Kalanı bul' : 'Evet mi, hayır mı?'}
                  </div>

                  <p className="rakam mt-2 text-center font-display text-[40px] font-extrabold leading-tight tracking-[2px]">
                    {soru.sayi}
                  </p>
                  <p className="mt-1 text-center font-display text-[14.5px] font-extrabold text-isl-koyu">
                    {soruMetni(soru)}
                  </p>
                </div>

                {/* Cevap alanı iki tipte de aynı yükseklikte: soru tipi her
                    soruda değiştiği için oynak bir yükseklik ekranı zıplatırdı. */}
                <div className="flex flex-none flex-col gap-2">
                  {soru.tip === 'kalan' ? (
                    <>
                      <CevapAlani girilen={girilen} geriBildirim={geriBildirim} />
                      <TusTakimi
                        kilitli={geriBildirim !== null}
                        bosMu={girilen === ''}
                        onRakam={rakamYaz}
                        onSil={sil}
                        onOnayla={() => cevapla({ tip: 'kalan', rakam: girilen })}
                      />
                    </>
                  ) : (
                    <EvetHayir
                      kilitli={geriBildirim !== null}
                      geriBildirim={geriBildirim}
                      onSec={(evet) => cevapla({ tip: 'bolunur', evet })}
                    />
                  )}

                  {/* Pas geçmek soruyu yanlış sayıyor; bedeli yalnızca bu. */}
                  <button
                    type="button"
                    onClick={() => cevapla(null)}
                    disabled={geriBildirim !== null}
                    className="mx-auto rounded-lg px-2.5 py-1 text-[12.5px] font-extrabold text-muted-foreground transition active:bg-foreground/10 disabled:opacity-45"
                  >
                    Pas geç
                  </button>
                </div>
              </div>

              {geriBildirim && (
                <Bildirim
                  iyi={geriBildirim.dogruMu}
                  baslik={geriBildirim.dogruMu ? 'Aynen böyle!' : 'Olmadı'}
                  aciklama={
                    geriBildirim.dogruMu
                      ? kuralIzi(geriBildirim.soru.sayi, geriBildirim.soru.bolen)
                      : `${kuralIzi(geriBildirim.soru.sayi, geriBildirim.soru.bolen)} — doğrusu ${cevapMetni(
                          geriBildirim.soru,
                        )}`
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
        ekstra={
          asama === 'tanitim' && !bankaTuru ? (
            <BolenSecimi secili={secili} onDegis={bolenDegistir} />
          ) : null
        }
      />
    </>
  )
}

/** Tanıtım penceresindeki bölen seçimi. */
function BolenSecimi({
  secili,
  onDegis,
}: {
  secili: number[]
  onDegis: (bolen: number) => void
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Hangi bölenler gelsin?</p>
      <div className="flex flex-wrap gap-2">
        {TUM_BOLENLER.map((bolen) => (
          <Cip key={bolen} secili={secili.includes(bolen)} onClick={() => onDegis(bolen)}>
            <span className="rakam">{bolen}</span>
          </Cip>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Seçimin saklanır; en az bir bölen açık kalmalı.
      </p>
    </div>
  )
}

/** Yazılan rakamın göründüğü alan. */
function CevapAlani({
  girilen,
  geriBildirim,
}: {
  girilen: string
  geriBildirim: GeriBildirim | null
}) {
  const yanlisMi = geriBildirim !== null && !geriBildirim.dogruMu
  const dogruMu = geriBildirim?.dogruMu === true
  const gosterilen =
    geriBildirim === null
      ? girilen
      : geriBildirim.girdi?.tip === 'kalan'
        ? geriBildirim.girdi.rakam
        : ''

  return (
    <div
      aria-live="polite"
      className={cn(
        'golge-kart flex h-[54px] flex-none items-center justify-center rounded-[18px] px-4',
        'rakam font-display text-[27px] font-extrabold tracking-[3px]',
        !geriBildirim && 'bg-card',
        dogruMu && 'bg-success text-white',
        yanlisMi && 'bg-ikincil text-white',
      )}
    >
      {gosterilen === '' ? (
        <span className="text-[19px] font-bold tracking-normal opacity-60">
          {yanlisMi ? 'pas' : 'kalanı yaz'}
        </span>
      ) : (
        gosterilen
      )}
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
}: {
  kilitli: boolean
  bosMu: boolean
  onRakam: (rakam: string) => void
  onSil: () => void
  onOnayla: () => void
}) {
  return (
    <div className="grid flex-none grid-cols-3 gap-[7px]">
      {TUSLAR.map((rakam) => (
        <Tus key={rakam} kilitli={kilitli} onClick={() => onRakam(rakam)}>
          {rakam}
        </Tus>
      ))}

      <Tus kilitli={kilitli || bosMu} onClick={onSil} etiket="Sil" bicim="sil">
        <Delete size={21} aria-hidden />
      </Tus>
      <Tus kilitli={kilitli} onClick={() => onRakam('0')}>
        0
      </Tus>
      <Tus kilitli={kilitli || bosMu} onClick={onOnayla} bicim="onay">
        Onayla
      </Tus>
    </div>
  )
}

function Tus({
  kilitli,
  bicim = 'rakam',
  etiket,
  onClick,
  children,
}: {
  kilitli: boolean
  bicim?: 'rakam' | 'sil' | 'onay'
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
        'grid h-12 place-items-center rounded-2xl font-display transition disabled:opacity-40',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        bicim === 'rakam' && 'golge-kart rakam bg-card text-[21px] font-extrabold',
        bicim === 'sil' && 'bg-ikincil/12 text-ikincil',
        bicim === 'onay' && 'bg-isl-koyu text-sm font-extrabold text-white active:brightness-95',
      )}
    >
      {children}
    </button>
  )
}

/**
 * "Bölünür mü" sorusunun iki düğmesi.
 *
 * Tuş takımıyla aynı yüksekliği kaplıyorlar (cevap alanı + dört sıra tuş), o
 * yüzden soru tipi değişince ekranda hiçbir şey yer değiştirmiyor.
 */
function EvetHayir({
  kilitli,
  geriBildirim,
  onSec,
}: {
  kilitli: boolean
  geriBildirim: GeriBildirim | null
  onSec: (evet: boolean) => void
}) {
  const secilen = geriBildirim?.girdi?.tip === 'bolunur' ? geriBildirim.girdi.evet : null
  const dogruEvet = geriBildirim ? bolunuyorMu(geriBildirim.soru) : null

  return (
    <div className="flex h-[267px] flex-none flex-col gap-2">
      {[true, false].map((evet) => {
        const secildi = secilen === evet
        const dogruSik = geriBildirim !== null && dogruEvet === evet
        return (
          <button
            key={String(evet)}
            type="button"
            onClick={() => onSec(evet)}
            disabled={kilitli}
            className={cn(
              'golge-kart flex flex-1 items-center justify-center gap-2 rounded-3xl',
              'font-display text-[22px] font-extrabold transition disabled:opacity-100',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              geriBildirim === null && 'bg-card text-foreground active:brightness-95',
              // Cevaptan sonra: doğru şık yeşil, yanlış seçilen mercan, öbürü sönük.
              dogruSik && 'bg-success text-white',
              geriBildirim !== null && !dogruSik && secildi && 'bg-ikincil text-white',
              geriBildirim !== null && !dogruSik && !secildi && 'bg-card text-muted-foreground/60',
            )}
          >
            {evet ? 'Evet' : 'Hayır'}
            {dogruSik && <Check size={22} aria-hidden />}
            {!dogruSik && secildi && <X size={22} aria-hidden />}
          </button>
        )
      })}
    </div>
  )
}

function SonucGorunumu({
  sonuc,
  girdiler,
  bolenler,
  rekor,
  bankaTuru,
  elendi,
  onTekrar,
  onCik,
  bildir,
}: {
  sonuc: { ozet: TurOzeti<BolunmeSorusu>; yeniRekor: boolean }
  girdiler: (Girdi | null)[]
  bolenler: readonly number[]
  rekor: number
  bankaTuru: boolean
  elendi: Eleme
  onTekrar: () => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const { ozet, yeniRekor } = sonuc
  const gorunen = ozet.yanlislar.slice(0, EN_COK_YANLIS)
  const kalanSayisi = ozet.yanlislar.length - gorunen.length

  const dagilim = bolenDagilimi(ozet.yanlislar, bolenler)
  const enCok = dagilim[0]
  const dolular = dagilim.filter((s) => s.sayi > 0)
  const boslar = dagilim.filter((s) => s.sayi === 0)
  /** Tek bir bölende yığılma var mı — başlıktaki cümle buradan geliyor. */
  const yigilma = enCok && enCok.sayi >= 2 ? enCok : null

  return (
    <TurSonu
      oyunId="bolunme"
      dogru={ozet.dogru}
      yanlis={ozet.yanlis}
      enIyiSeri={ozet.enIyiSeri}
      rekor={rekor}
      yeniRekor={yeniRekor}
      bankaTuru={bankaTuru}
      elendi={elendi}
      altBaslik={
        yigilma
          ? `${YONELME[yigilma.bolen]} bölünmede takılıyorsun.`
          : bankaTuru
            ? 'Banka soruları — üst üste üç doğruda düşerler.'
            : rekorCumlesi(ozet.dogru, rekor, yeniRekor, 'doğru')
      }
      bolumBasligi="Hangi kuralda takıldın"
      bolumAltYazisi={
        yigilma
          ? `${ozet.yanlis} yanlıştan ${yigilma.sayi} tanesi ${yigilma.bolen} bölenli.`
          : 'Yanlışların bölene göre dağılımı.'
      }
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          <div className="golge-kart flex flex-col gap-[7px] rounded-2xl bg-card px-3.5 py-3">
            {dolular.map(({ bolen, sayi }) => (
              <BolenSatiri
                key={bolen}
                ad={`${bolen} ile`}
                sayi={sayi}
                oran={enCok && enCok.sayi > 0 ? sayi / enCok.sayi : 0}
              />
            ))}
            {boslar.length > 0 && (
              <BolenSatiri ad={boslar.map((s) => s.bolen).join(' · ')} sayi={0} oran={0} />
            )}
          </div>

          {gorunen.map((yanlis, sira) => {
            const girdi = girdiler[sira]
            const kural =
              yanlis.tip === 'kalan'
                ? (KALAN_KURALI[yanlis.bolen] ?? BOLEN_KURALI[yanlis.bolen])
                : BOLEN_KURALI[yanlis.bolen]
            return (
              <YanlisKarti
                key={`${yanlis.tip}-${yanlis.sayi}-${yanlis.bolen}-${sira}`}
                oyunId="bolunme"
                soru={bolunmedenBanka(yanlis)}
                bildir={bildir}
              >
                <b className="rakam block font-display text-[15px] font-extrabold leading-tight">
                  {yanlis.sayi} · {soruMetni(yanlis)}{' '}
                  <em className="not-italic text-success">{cevapMetni(yanlis)}</em>
                </b>
                <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
                  {kuralIzi(yanlis.sayi, yanlis.bolen)}
                  {girdi === null ? (
                    ' · pas geçtin'
                  ) : (
                    <>
                      {' · sen '}
                      <s className="rakam text-ikincil">
                        {girdi.tip === 'kalan' ? girdi.rakam : girdi.evet ? 'Evet' : 'Hayır'}
                      </s>
                      {' dedin'}
                    </>
                  )}
                </span>
                <span className="mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
                  {kural}
                </span>
              </YanlisKarti>
            )
          })}

          {kalanSayisi > 0 && <KalanHapi kalan={kalanSayisi} />}
        </div>
      )}
    </TurSonu>
  )
}

function BolenSatiri({ ad, sayi, oran }: { ad: string; sayi: number; oran: number }) {
  const bos = sayi === 0
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 text-[11.5px] font-bold',
        bos ? 'text-muted-foreground/75' : 'text-foreground',
      )}
    >
      <span className={cn('rakam w-24 shrink-0 leading-tight', bos && 'font-semibold')}>{ad}</span>
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
