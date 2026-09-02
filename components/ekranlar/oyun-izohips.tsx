'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, X } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import {
  SEKIL_ACIKLAMASI,
  SEKIL_ADI,
  haritaCiz,
  siklariKur,
  turHazirla,
  type IzohipsCizimi,
  type IzohipsOyunSorusu,
  type IzohipsSikki,
  type IzohipsSorusu,
} from '@/lib/oyunlar/izohips'
import {
  guncelSeri,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { izohipstenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import {
  TUR_SORU_SINIRI,
  bossYerlestir,
  bossZorlugu,
  elerMi,
  soruSuresi,
  type SiradakiSoru,
  type Zorluk,
} from '@/lib/oyunlar/ritim'
import { etkinMod, modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { useTurSayaci } from '@/lib/oyunlar/tur-sayaci'
import { ANAHTARLAR, useYerelDepo } from '@/lib/depo'
import { ZorlukSecimi } from '@/components/zorluk-secimi'
import type { BildirimKolu } from '@/components/hata-bildir'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { oyunSesiCal } from '@/lib/oyunlar/oyun-sesi'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
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

/**
 * İzohips Okuma.
 *
 * Sorular havuzdan değil **üretiliyor** (`lib/oyunlar/izohips.ts`); ekranın
 * bildiği tek şey çizilecek yollar. Boss soruları da bir üst zorlukta üretilen
 * haritalar: orada harita kalabalıklaşıyor, yükselti yazıları seyrekleşiyor.
 */

/** Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms). */
const CEVAP_BEKLEMESI = 1600

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/** `secilen` süre dolduğunda `null`: oyuncu bir şık işaretlemedi. */
type GeriBildirim = { secilen: string | null; dogruMu: boolean; soru: IzohipsSorusu }

/**
 * Turun sırası.
 *
 * Havuzlu oyunlardaki `turSirasi`'nın karşılığı: normal sorular seçilen
 * zorlukta, her onuncusu bir üst zorlukta üretiliyor ve `bossYerlestir` ikisini
 * tek sıraya örüyor. Yerleştirme kuralı bütün oyunlarda ortak olmalı, o yüzden
 * burada elle yazılmıyor.
 */
function turSirasiniKur(zorluk: Zorluk): SiradakiSoru<IzohipsOyunSorusu>[] {
  const bossluk = bossZorlugu(zorluk)
  return bossYerlestir(
    turHazirla(zorluk, TUR_SORU_SINIRI),
    turHazirla(bossluk.zorluk, Math.ceil(TUR_SORU_SINIRI / 10)),
    'izohips',
  )
}

/** Banka kayıtlarından soru havuzu; kayıt tohumu taşıyor, harita ondan çiziliyor. */
function bankaHavuzu(kayitlar: readonly BankaKaydi[]): IzohipsOyunSorusu[] {
  const havuz: IzohipsOyunSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'izohips') continue
    havuz.push({ soru: kayit.soru.izohips, siklar: siklariKur(kayit.soru.izohips) })
  }
  return havuz
}

export function IzohipsOyunuEkrani({
  istatistik,
  sesAcik,
  bankaSorulari,
  onTurBitti,
  mod,
  setMod,
  onCik,
  bildir,
}: {
  istatistik: OyunIstatistigi
  sesAcik: boolean
  /** Boş değilse tur yalnızca bu sorularla kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (
    ozet: TurOzeti<IzohipsSorusu>,
    bankaCevaplari: BankaCevabi[],
    gecenSaniye: number,
    yarim: boolean,
  ) => void
  mod: OyunModu
  setMod: (mod: OyunModu) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('izohips')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<SiradakiSoru<IzohipsOyunSorusu>[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<IzohipsSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  const [elendi, setElendi] = useState<Eleme>(false)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukIzohips, 'kolay')
  const [duraklatilan, setDuraklatilan] = useState(false)
  const [turNo, setTurNo] = useState(0)

  const [sonuc, setSonuc] = useState<{
    ozet: TurOzeti<IzohipsSorusu>
    yeniRekor: boolean
  } | null>(null)

  const havuz = useMemo(() => bankaHavuzu(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0
  const gecerliMod = etkinMod(mod, bankaTuru)

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<IzohipsSorusu>[]>([])
  cevaplarRef.current = cevaplar
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    setTurNo((n) => n + 1)
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setSorular(
      bankaTuru ? havuz.map((soru) => ({ soru, boss: false })) : turSirasiniKur(zorluk),
    )
    setSira(0)
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setElendi(false)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [bankaTuru, havuz, istatistik.enIyiDogru, zorluk])

  const turBitir = useCallback(
    (verilenler: Cevap<IzohipsSorusu>[], yarim = false) => {
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
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: izohipstenBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
        yarim,
      )
    },
    [bankaTuru, gecerliMod, istatistik, onTurBitti, sesAcik],
  )

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

  const sirali = sorular[sira]
  const soru = sirali?.soru
  const boss = sirali?.boss ?? false

  /*
    Harita yalnızca soru değişince çiziliyor.

    Çizim ucuz değil: yükselti alanı 150×110'luk bir ızgaraya örnekleniyor ve
    her seviye için marching squares dönüyor. Her renderda yeniden hesaplansaydı
    sayacın her saniyesi haritayı baştan çizerdi.
  */
  const cizim = useMemo(() => (soru ? haritaCiz(soru.soru) : null), [soru])

  const ilerle = (dogruMu: boolean, bossMuydu: boolean) => {
    zamanlayiciRef.current = setTimeout(() => {
      setGeriBildirim(null)
      if (elerMi(dogruMu, bankaTuru, gecerliMod)) {
        setElendi(bossMuydu ? 'boss' : 'yanlis')
        turBitir(cevaplarRef.current)
      } else {
        setSira((s) => s + 1)
      }
    }, CEVAP_BEKLEMESI)
  }

  const cevapla = (sik: IzohipsSikki) => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    const dogruMu = sik.dogruMu
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu }])
    setGeriBildirim({ secilen: sik.deger, dogruMu, soru: soru.soru })
    geriBildir(dogruMu)
    ilerle(dogruMu, boss)
  }

  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu: false }])
    setGeriBildirim({ secilen: null, dogruMu: false, soru: soru.soru })
    geriBildir(false)
    ilerle(false, boss)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, soru, boss])

  const turSuresiDoldu = () => {
    setElendi('sure')
    turBitir(cevaplarRef.current)
  }

  const turdanCik = () => {
    if (asama === 'oynaniyor' && cevaplarRef.current.length > 0) {
      turBitir(cevaplarRef.current, true)
      return
    }
    onCik()
  }

  const { kalan, toplam } = useTurSayaci({
    mod: gecerliMod,
    turNo,
    yanlisSayisi: cevaplar.filter((c) => !c.dogruMu).length,
    onTurBitti: turSuresiDoldu,
    aktif: asama === 'oynaniyor' && geriBildirim === null && !duraklatilan && soru !== undefined,
    sure: soruSuresi('izohips', boss ? bossZorlugu(zorluk) : null),
    anahtar: sira,
    onBitti: sureDoldu,
  })

  const yardimAc = () => {
    setDuraklatilan(true)
    setYardimAcik(true)
  }

  const yardimKapat = () => {
    setDuraklatilan(false)
    setYardimAcik(false)
  }

  const dogruSayisi = cevaplar.filter((c) => c.dogruMu).length

  return (
    <>
      <OyunKabugu
        oyunId="izohips"
        baslik={oyun.ad}
        sayac={
          asama === 'bitti'
            ? null
            : {
                kalan,
                toplam,
                sira: sira + 1,
                boss,
                mod: gecerliMod,
                seri: guncelSeri(cevaplar),
                dogru: dogruSayisi,
                yanlis: cevaplar.length - dogruSayisi,
                enIyiSeri: turOzeti(cevaplar).enIyiSeri,
                rekor: Math.max(istatistik.enIyiDogru, dogruSayisi),
              }
        }
        onCik={turdanCik}
        onYardim={yardimAc}
      >
        {asama === 'bitti' && sonuc ? (
          <SonucGorunumu
            sonuc={sonuc}
            rekor={turBasiRekor.current}
            bankaTuru={bankaTuru}
            mod={gecerliMod}
            elendi={elendi}
            onTekrar={turBaslat}
            onCik={onCik}
            bildir={bildir}
          />
        ) : (
          asama === 'oynaniyor' &&
          soru &&
          cizim && (
            <div className="flex flex-1 flex-col justify-center gap-3 py-2">
              <div className="flex flex-col gap-3">
                <div className="flex-none text-center">
                  <p className="text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                    Daire içine alınan yerde
                  </p>
                  <p className="mt-0.5 font-display text-[21px] font-extrabold leading-tight">
                    hangi yer şekli var?
                  </p>
                </div>

                <IzohipsHaritasi cizim={cizim} />
              </div>

              <div className="flex flex-col gap-2">
                {soru.siklar.map((sik) => (
                  <SikDugmesi
                    key={sik.deger}
                    sik={sik}
                    geriBildirim={geriBildirim}
                    onSec={() => cevapla(sik)}
                  />
                ))}
              </div>

              {geriBildirim && (
                <Bildirim
                  iyi={geriBildirim.dogruMu}
                  baslik={geriBildirim.dogruMu ? 'Doğru!' : 'Olmadı'}
                  aciklama={
                    geriBildirim.dogruMu
                      ? undefined
                      : `Doğrusu: ${SEKIL_ADI[geriBildirim.soru.sekil]}`
                  }
                />
              )}
            </div>
          )
        )}
      </OyunKabugu>

      <OyunTanitim
        oyun={oyun}
        acik={asama === 'tanitim' || yardimAcik}
        rekor={istatistik.enIyiDogru}
        baslatir={asama === 'tanitim'}
        mod={mod}
        setMod={bankaTuru ? null : setMod}
        onBasla={turBaslat}
        onKapat={asama === 'tanitim' ? onCik : yardimKapat}
        ekstra={
          asama === 'tanitim' && !bankaTuru ? (
            <ZorlukSecimi secili={zorluk} onSec={setZorluk} bossVar />
          ) : null
        }
      />
    </>
  )
}

/**
 * İzohips haritası.
 *
 * Çizimin tamamı `haritaCiz`'den geliyor; burada yalnızca renk ve kalınlık
 * kararı var. Deniz seviyesi (0 m) ötekilerden **kalın ve başka renkte**:
 * kıyı çizgisi bir izohips değil, karayla denizin sınırı.
 *
 * Yükselti yazılarının arkasında beyaz kontur var (`paintOrder`): eğrinin
 * üstüne düşen sayı, konturu olmadan çizginin içinde kayboluyordu.
 */
function IzohipsHaritasi({ cizim }: { cizim: IzohipsCizimi }) {
  return (
    <div className="golge-kart flex-none overflow-hidden rounded-[20px] bg-card p-1.5">
      <svg
        viewBox={`0 0 ${cizim.en} ${cizim.boy}`}
        className="w-full select-none"
        role="img"
        aria-label="Eş yükselti eğrileriyle çizilmiş harita"
      >
        <rect width={cizim.en} height={cizim.boy} className="fill-card" />

        {/* Deniz mavisi tarih dersinin renk ailesinden (`trh`) alınıyor.
            Kural "renk derse ait" ama burada renk bir ders kimliği değil, bir
            harita göstergesi: coğrafyanın yeşili suya boyandığında deniz
            karadan ayırt edilemiyordu. */}
        {cizim.deniz && <path d={cizim.deniz} className="fill-trh-ok/35" />}
        {/* Adalar denizin üstüne kara renginde: altta kalsalardı mavinin içinde
            kaybolurlardı. */}
        {cizim.adalar.map((yol, i) => (
          <path key={`ada-${i}`} d={yol} className="fill-card" />
        ))}

        {cizim.egriler.map((egri, i) => (
          <path
            key={`egri-${i}`}
            d={egri.yol}
            fill="none"
            className={egri.yukselti === 0 ? 'stroke-trh-koyu' : 'stroke-primary/70'}
            strokeWidth={egri.yukselti === 0 ? 3 : 1.8}
          />
        ))}

        {cizim.etiketler.map((etiket, i) => (
          <text
            key={`etiket-${i}`}
            x={etiket.x}
            y={etiket.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground stroke-card font-display"
            style={{ paintOrder: 'stroke' }}
            strokeWidth={6}
            fontSize={19}
            fontWeight={800}
          >
            {etiket.metin}
          </text>
        ))}

        {/* Soruyu soran halka: kesikli, çünkü altındaki eğrilerin görünmesi
            gerekiyor. */}
        <circle
          cx={cizim.isaret.x}
          cy={cizim.isaret.y}
          r={cizim.isaret.r}
          className="fill-none stroke-ikincil"
          strokeWidth={4}
          strokeDasharray="11 8"
        />
      </svg>
    </div>
  )
}

function SikDugmesi({
  sik,
  geriBildirim,
  onSec,
}: {
  sik: IzohipsSikki
  geriBildirim: GeriBildirim | null
  onSec: () => void
}) {
  const acikta = geriBildirim !== null
  const secilen = acikta && geriBildirim.secilen === sik.deger
  const dogruSecim = secilen && sik.dogruMu
  const yanlisSecim = secilen && !sik.dogruMu
  const isaretli = acikta && !secilen && sik.dogruMu

  return (
    <button
      type="button"
      onClick={onSec}
      disabled={acikta}
      className={cn(
        'golge-kart flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[16px] border-2 px-3 py-2',
        'font-display text-[14px] font-extrabold leading-snug transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        !acikta && 'border-border bg-card active:brightness-95',
        dogruSecim && 'border-success bg-success text-white',
        yanlisSecim && 'border-ikincil bg-ikincil text-white',
        isaretli && 'border-success bg-card text-success',
        acikta && !secilen && !sik.dogruMu && 'border-border bg-card opacity-45',
      )}
    >
      <span className="min-w-0 break-words">{sik.metin}</span>
      {(dogruSecim || isaretli) && <Check size={17} className="shrink-0" aria-hidden />}
      {yanlisSecim && <X size={17} className="shrink-0" aria-hidden />}
    </button>
  )
}

/**
 * Tur sonu.
 *
 * Yanlış bilinen sorunun kartında haritanın küçültülmüş hâli **yok**: 600×440
 * bir çizim liste satırında okunmuyor. Yerine şeklin adı ve nasıl tanınacağı
 * yazıyor — asıl öğrenilecek olan o, o haritadaki o tepe değil.
 */
function SonucGorunumu({
  sonuc,
  rekor,
  bankaTuru,
  mod,
  elendi,
  onTekrar,
  onCik,
  bildir,
}: {
  sonuc: { ozet: TurOzeti<IzohipsSorusu>; yeniRekor: boolean }
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

  return (
    <TurSonu
      oyunId="izohips"
      dogru={ozet.dogru}
      yanlis={ozet.yanlis}
      enIyiSeri={ozet.enIyiSeri}
      rekor={rekor}
      yeniRekor={yeniRekor}
      bankaTuru={bankaTuru}
      mod={mod}
      elendi={elendi}
      altBaslik={
        bankaTuru
          ? 'Banka soruları — genel testte doğru bilince düşerler.'
          : rekorCumlesi(ozet.dogru, rekor, yeniRekor, 'doğru')
      }
      bolumBasligi="Karıştırdığın şekiller"
      bolumAltYazisi="Nasıl tanınır — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.tohum}-${sira}`}
              oyunId="izohips"
              soru={izohipstenBanka(yanlis)}
              bildir={bildir}
            >
              <b className="block font-display text-[13.5px] font-extrabold leading-tight text-success">
                {SEKIL_ADI[yanlis.sekil]}
              </b>
              <span className="mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
                {SEKIL_ACIKLAMASI[yanlis.sekil].replace(/\*\*/g, '')}
              </span>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
