'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
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
  kalanPas,
  rekorKirildiMi,
  turOzeti,
  yanlisSayisi,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { izohipstenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import {
  TUR_SORU_SINIRI,
  elerMi,
  soruSuresi,
  akisUret,
  akisUzunlugu,
  tekAkis,
  type SoruAkisi,
} from '@/lib/oyunlar/ritim'
import { modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { useTurSayaci } from '@/lib/oyunlar/tur-sayaci'
import { useEtkinMod, useUyarlananZorluk } from '@/components/tur-ayari-baglami'
import type { BildirimKolu } from '@/components/hata-bildir'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { oyunSesiCal } from '@/lib/oyunlar/oyun-sesi'
import { useGeriKatmani } from '@/lib/geri'
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
import { OyunSikki, sikHali } from '@/components/oyun-sikki'
import { OyunTanitim } from '@/components/oyun-tanitim'

/**
 * İzohips Okuma.
 *
 * Sorular havuzdan değil **üretiliyor** (`lib/oyunlar/izohips.ts`); ekranın
 * bildiği tek şey çizilecek yollar. Zorluk arttıkça harita kalabalıklaşıyor ve
 * yükselti yazıları seyrekleşiyor.
 */

/** Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms). */
const CEVAP_BEKLEMESI = 1600

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/** `secilen` süre dolduğunda ve pasta `null`: oyuncu bir şık işaretlemedi. */
type GeriBildirim = {
  secilen: string | null
  dogruMu: boolean
  pas: boolean
  soru: IzohipsSorusu
}

/**
 * Turun üç zorluk şeridi.
 *
 * Havuzlu oyunlardaki `turSirasi`'nın karşılığı: harita üretiliyor, süzülecek
 * bir havuz yok. Üç seviyenin üçü de baştan üretiliyor çünkü zorluk turun
 * içinde kayıyor (`lib/oyunlar/uyum.ts`) ve sıradaki sorunun hangi seviyeden
 * geleceği ancak oraya gelindiğinde belli oluyor.
 */
function turSirasiniKur(): SoruAkisi<IzohipsOyunSorusu> {
  return akisUret((zorluk) => turHazirla(zorluk, TUR_SORU_SINIRI))
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
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('izohips')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<SoruAkisi<IzohipsOyunSorusu>>(tekAkis([]))
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<IzohipsSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  const [elendi, setElendi] = useState<Eleme>(false)

  /*
    Zorluk seçilmiyor, turun içinde kayıyor (`lib/oyunlar/uyum.ts`).

    Tur ortadan başlıyor; ardışık doğrular seviyeyi yükseltiyor, ardışık
    yanlışlar düşürüyor ve bunun hiçbiri ekranda yazmıyor.
  */
  const { zorluk, kaydet: zorlukKaydet, sifirla: zorluguSifirla } = useUyarlananZorluk()
  const [duraklatilan, setDuraklatilan] = useState(false)
  const [turNo, setTurNo] = useState(0)

  const [sonuc, setSonuc] = useState<SonucBilgisi | null>(null)

  const havuz = useMemo(() => bankaHavuzu(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0
  const gecerliMod = useEtkinMod(bankaTuru)

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
    setSorular(bankaTuru ? tekAkis(havuz) : turSirasiniKur())
    zorluguSifirla()
    setSira(0)
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setElendi(false)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [bankaTuru, havuz, istatistik.enIyiDogru, zorluguSifirla])

  const turBitir = useCallback(
    (verilenler: Cevap<IzohipsSorusu>[], yarim = false) => {
      if (bittiRef.current) return
      bittiRef.current = true
      const ozet = turOzeti(verilenler)
      setSonuc({
        ozet,
        paslar: verilenler.filter((c) => !c.dogruMu).map((c) => c.pas === true),
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
    const uzunluk = akisUzunlugu(sorular)
    if (asama !== 'oynaniyor' || uzunluk === 0) return
    if (sira >= uzunluk) turBitir(cevaplarRef.current)
  }, [asama, sira, sorular, turBitir])

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

  const soru = sorular[zorluk][sira]

  /*
    Harita yalnızca soru değişince çiziliyor.

    Çizim ucuz değil: yükselti alanı 150×110'luk bir ızgaraya örnekleniyor ve
    her seviye için marching squares dönüyor. Her renderda yeniden hesaplansaydı
    sayacın her saniyesi haritayı baştan çizerdi.
  */
  const cizim = useMemo(() => (soru ? haritaCiz(soru.soru) : null), [soru])

  const ilerle = (dogruMu: boolean, pas = false) => {
    zamanlayiciRef.current = setTimeout(() => {
      setGeriBildirim(null)
      // Pas bedelsiz: zorluğu kaydırmıyor, Sıfır Tolerans'ta turu bitirmiyor.
      if (pas) {
        setSira((s) => s + 1)
        return
      }
      /*
        Zorluk **ilerlerken** güncelleniyor, cevap verilirken değil.

        Sıradaki soru `sorular[zorluk][sira]` ile okunuyor; seviye cevap
        anında kaysaydı ekrandaki soru, oyuncu geri bildirimi okurken
        değişirdi. İkisi aynı karede güncellenince değişen tek şey bir
        sonraki soru oluyor.
      */
      zorlukKaydet(dogruMu)
      if (elerMi(dogruMu, bankaTuru, gecerliMod)) {
        setElendi('yanlis')
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
    setGeriBildirim({ secilen: sik.deger, dogruMu, pas: false, soru: soru.soru })
    geriBildir(dogruMu)
    ilerle(dogruMu)
  }

  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu: false }])
    setGeriBildirim({ secilen: null, dogruMu: false, pas: false, soru: soru.soru })
    geriBildir(false)
    ilerle(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, soru])

  /** Pas: doğru şık gösterilip geçiliyor; ses ve titreşim yok, hata değil. */
  const pasGec = () => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    if (kalanPas(cevaplarRef.current) <= 0) return
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu: false, pas: true }])
    setGeriBildirim({ secilen: null, dogruMu: false, pas: true, soru: soru.soru })
    ilerle(false, true)
  }

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
    yanlisSayisi: yanlisSayisi(cevaplar),
    onTurBitti: turSuresiDoldu,
    aktif: asama === 'oynaniyor' && geriBildirim === null && !duraklatilan && soru !== undefined,
    sure: soruSuresi('izohips'),
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
                mod: gecerliMod,
                seri: guncelSeri(cevaplar),
                dogru: dogruSayisi,
                yanlis: yanlisSayisi(cevaplar),
                enIyiSeri: turOzeti(cevaplar).enIyiSeri,
                rekor: Math.max(istatistik.enIyiDogru, dogruSayisi),
              }
        }
        pas={{
          kalan: kalanPas(cevaplar),
          kilitli: geriBildirim !== null,
          onPas: pasGec,
        }}
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
                {soru.siklar.map((sik, i) => (
                  <SikDugmesi
                    key={sik.deger}
                    sik={sik}
                    sira={i}
                    geriBildirim={geriBildirim}
                    onSec={() => cevapla(sik)}
                  />
                ))}
              </div>

              {geriBildirim && (
                <Bildirim
                  iyi={geriBildirim.dogruMu}
                  pas={geriBildirim.pas}
                  baslik={geriBildirim.pas ? 'Pas geçtin' : geriBildirim.dogruMu ? 'Doğru!' : 'Olmadı'}
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
        onBasla={turBaslat}
        onKapat={asama === 'tanitim' ? onCik : yardimKapat}
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

        {/* Deniz mavisi genel pastel aileden (`trh`), dersin renginden değil:
            burada renk bir ders kimliği değil, bir harita göstergesi. */}
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
  sira,
  geriBildirim,
  onSec,
}: {
  sik: IzohipsSikki
  sira: number
  geriBildirim: GeriBildirim | null
  onSec: () => void
}) {
  const acikta = geriBildirim !== null
  const hal = sikHali(acikta, acikta && geriBildirim.secilen === sik.deger, sik.dogruMu)

  return (
    <OyunSikki sira={sira} hal={hal} onSec={onSec} className="min-h-[46px] py-2 text-[14px]">
      {sik.metin}
    </OyunSikki>
  )
}

type SonucBilgisi = {
  ozet: TurOzeti<IzohipsSorusu>
  /** `ozet.yanlislar` ile aynı sırada: o soru pas mı geçildi. */
  paslar: boolean[]
  yeniRekor: boolean
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
  sonuc: SonucBilgisi
  rekor: number
  bankaTuru: boolean
  mod: OyunModu
  elendi: Eleme
  onTekrar: () => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const { ozet, paslar, yeniRekor } = sonuc
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
                {paslar[sira] && (
                  <span className="ml-1.5 text-[11px] font-bold text-muted-foreground">
                    · Pas geçtin
                  </span>
                )}
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
