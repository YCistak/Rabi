'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import type { OyunIstatistigi } from '@/lib/types'
import { SIRA_DONEM_ADI, type SiraliOlay } from '@/lib/oyunlar/sirala-havuzu'
import {
  TAM_BONUS,
  bankadanSorular,
  dogruKomsuSayisi,
  dogruSira,
  siraDogruMu,
  siralaTuruHazirla,
  soruPuani,
  yilMetni,
  type SiralamaSorusu,
} from '@/lib/oyunlar/sirala'
import {
  guncelSeri,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { siraladanBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import {
  TUR_SORU_SINIRI,
  bossMu,
  bossZorlugu,
  elerMi,
  soruSuresi,
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
import { Rabi, type MaskotDurumu } from '@/components/maskot/rabi'
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
import { SurukleSirala } from '@/components/oyun-surukle-sirala'
import { OyunTanitim } from '@/components/oyun-tanitim'

/**
 * Zaman Şeridi — mini oyun.
 *
 * Cevap tek bir dokunuş değil bir düzen: oyuncu kartları dizip **onaylıyor**.
 * Onay düğmesi şart, çünkü sürüklemenin ne zaman bittiğini oyundan başkası
 * bilemez — Köklü Sayı'daki çubukla aynı durum.
 *
 * Puan doğru/yanlıştan ayrı işliyor: sayaç yalnızca tam sıraya bakıyor (rekor
 * öteki oyunlarla karşılaştırılabilir kalsın), puan ise doğru sıralanan komşu
 * çiftlerini topluyor. "Beşin dördü yerinde" bir cevabın sıfır sayılması,
 * oyunun öğrettiği şeyi görmezden gelmek olurdu.
 */

/** Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms). */
const CEVAP_BEKLEMESI = 2200

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type GeriBildirim = {
  dogruMu: boolean
  soru: SiralamaSorusu
  /** Oyuncunun bıraktığı düzen — kartlar bu sırayla işaretleniyor. */
  dizilim: SiraliOlay[]
  puan: number
}

/** Tur sonunda ve bankada saklanan yanlış: soru ile verilen cevap birlikte. */
type Yanlis = { soru: SiralamaSorusu; dizilim: SiraliOlay[] }

/** Banka kayıtlarından tur soruları; kayıt olayların tamamını taşıyor. */
function bankaHavuzu(kayitlar: readonly BankaKaydi[]): SiraliOlay[][] {
  const havuz: SiraliOlay[][] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'sirala') continue
    havuz.push(kayit.soru.olaylar)
  }
  return havuz
}

export function SiralaOyunuEkrani({
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
    ozet: TurOzeti<Yanlis>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — modlar arasında değişiyor. */
    gecenSaniye: number,
    /** Tur bitmeden çıkıldı mı — yarım tur rekora ve istatistiğe yazılmıyor. */
    yarim: boolean,
  ) => void
  /** Seçili tur modu — bütün oyunlarda ortak (`lib/oyunlar/mod.ts`). */
  mod: OyunModu
  setMod: (mod: OyunModu) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('sirala')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<{ soru: SiralamaSorusu; boss: boolean }[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<Yanlis>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  const [elendi, setElendi] = useState<Eleme>(false)
  const [puan, setPuan] = useState(0)

  /**
   * Kartların o anki düzeni.
   *
   * Soru nesnesinden ayrı tutuluyor: soru sabit kalmalı (bankaya o giriyor),
   * düzen ise her sürüklemede değişiyor. İkisi tek yerde olsaydı bankaya
   * oyuncunun karıştırdığı hâli yazılırdı.
   */
  const [dizilim, setDizilim] = useState<SiraliOlay[]>([])

  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)
  /**
   * Kaçıncı tur.
   *
   * Tur saatli modlarda sayacı sıfırlayan tek şey bu: soru sırası bir turun
   * ortasında da sıfır olabiliyor (`tur-sayaci.ts`).
   */
  const [turNo, setTurNo] = useState(0)
  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukSirala, 'kolay')

  const [sonuc, setSonuc] = useState<{
    ozet: TurOzeti<Yanlis>
    yeniRekor: boolean
    puan: number
  } | null>(null)

  const havuz = useMemo(() => bankaHavuzu(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0
  // Banka turu modu dinlemiyor; kural tek yerden okunuyor.
  const gecerliMod = etkinMod(mod, bankaTuru)

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<Yanlis>[]>([])
  cevaplarRef.current = cevaplar
  const puanRef = useRef(0)
  puanRef.current = puan
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    setTurNo((n) => n + 1)
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)

    const yeni = bankaTuru
      ? bankadanSorular(havuz).map((soru) => ({ soru, boss: false }))
      : siralaTuruHazirla(
          zorluk,
          (s) => bossMu('sirala', s),
          bossZorlugu(zorluk).zorluk,
          TUR_SORU_SINIRI,
        )

    setSorular(yeni)
    setDizilim(yeni[0]?.soru.olaylar ?? [])
    setSira(0)
    setCevaplar([])
    setPuan(0)
    setGeriBildirim(null)
    setSonuc(null)
    setElendi(false)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [bankaTuru, havuz, istatistik.enIyiDogru, zorluk])

  const turBitir = useCallback(
    (verilenler: Cevap<Yanlis>[], yarim = false) => {
      if (bittiRef.current) return
      bittiRef.current = true
      const ozet = turOzeti(verilenler)
      setSonuc({
        ozet,
        puan: puanRef.current,
        yeniRekor:
          !yarim &&
          !bankaTuru &&
          modKayitliMi(gecerliMod) &&
          rekorKirildiMi({ ...istatistik, enIyiDogru: turBasiRekor.current }, ozet),
      })
      oyunSesiCal('bitis', sesAcik)
      setAsama('bitti')
      // Doğrular da bildiriliyor: banka, üst üste üç kez doğru bilinen kaydı düşürüyor.
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: siraladanBanka(cevap.soru.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
        yarim,
      )
    },
    [bankaTuru, gecerliMod, istatistik, onTurBitti, sesAcik],
  )

  // Banka turunda liste bankadaki kayıt kadar; tükenirse tur erken biter.
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

  /**
   * Cevabı işler.
   *
   * Süre dolduğunda da buraya geliniyor: kartların o anki hâli cevap sayılıyor.
   * "Cevap vermedin" diye ayrı bir durum yok, çünkü oyuncu her an bir düzen
   * bırakmış oluyor — boş bırakılabilecek bir alan yok.
   */
  const onayla = (verilen: SiraliOlay[]) => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return

    const dogruMu = siraDogruMu(verilen)
    const kazanilan = soruPuani(verilen)
    setCevaplar((onceki) => [...onceki, { soru: { soru, dizilim: verilen }, dogruMu }])
    setPuan((onceki) => onceki + kazanilan)
    setGeriBildirim({ dogruMu, soru, dizilim: verilen, puan: kazanilan })
    geriBildir(dogruMu)

    const bossMuydu = boss
    zamanlayiciRef.current = setTimeout(() => {
      setGeriBildirim(null)
      if (elerMi(dogruMu, bankaTuru, gecerliMod)) {
        setElendi(bossMuydu ? 'boss' : 'yanlis')
        turBitir(cevaplarRef.current)
      } else {
        const sonraki = sorular[sira + 1]
        if (sonraki) setDizilim(sonraki.soru.olaylar)
        setSira((s) => s + 1)
      }
    }, CEVAP_BEKLEMESI)
  }

  const sureDoldu = useCallback(() => {
    onayla(dizilim)
    // `onayla` her renderda yeniden kuruluyor; sayaç yalnızca güncel olanı
    // çağırsın diye bağımlılıklar bilerek dar tutuldu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, soru, boss, dizilim, sorular, sira])

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
    turNo,
    yanlisSayisi: cevaplar.filter((c) => !c.dogruMu).length,
    onTurBitti: turSuresiDoldu,
    aktif: asama === 'oynaniyor' && geriBildirim === null && !duraklatilan && soru !== undefined,
    sure: soruSuresi('sirala', boss ? bossZorlugu(zorluk) : null),
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
  const kilitli = geriBildirim !== null

  const maskotDurumu: MaskotDurumu = geriBildirim
    ? geriBildirim.dogruMu
      ? 'kutlama'
      : 'uzgun'
    : 'calisiyor'

  return (
    <>
      <OyunKabugu
        oyunId="sirala"
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
                puan,
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
          soru && (
            <>
              <div className="flex flex-1 flex-col justify-center gap-2.5 py-2">
                <div className="flex items-center gap-2.5 px-0.5">
                  <Rabi durum={maskotDurumu} boyut={36} />
                  <div className="min-w-0">
                    <p className="font-display text-[14px] font-extrabold leading-tight">
                      Eskiden yeniye diz
                    </p>
                    {/* Dönem adı bir ipucu değil, bir çerçeve: hangi konuda
                        düşünmesi gerektiğini söylüyor, cevabı vermiyor.

                        Banka turunda dönem yazılmıyor: kayıt dönemi taşımıyor
                        ve soru aslında tek dönemden kurulmuştu — "karışık
                        dönem" demek yanlış bilgi olurdu. */}
                    <p className="text-[11.5px] font-semibold text-muted-foreground">
                      {bankaTuru
                        ? 'Banka sorusu'
                        : soru.donem === null
                          ? 'Karışık dönem'
                          : SIRA_DONEM_ADI[soru.donem]}
                    </p>
                  </div>
                </div>

                <SurukleSirala
                  dizilim={kilitli ? geriBildirim.dizilim : dizilim}
                  kilitli={kilitli}
                  dogrusu={kilitli ? dogruSira(geriBildirim.soru) : undefined}
                  onDegis={setDizilim}
                />

                <button
                  type="button"
                  onClick={() => onayla(dizilim)}
                  disabled={kilitli}
                  className={cn(
                    'grid h-12 flex-none place-items-center rounded-[17px] font-display text-[15px] font-extrabold text-white transition',
                    kilitli ? 'bg-muted text-muted-foreground' : 'bg-trh-koyu active:brightness-95',
                  )}
                >
                  Onayla
                </button>
              </div>

              {geriBildirim && (
                <Bildirim
                  iyi={geriBildirim.dogruMu}
                  baslik={
                    geriBildirim.dogruMu
                      ? `Tam sıra! +${geriBildirim.puan} puan`
                      : geriBildirim.puan > 0
                        ? `Olmadı — yine de +${geriBildirim.puan} puan`
                        : 'Olmadı'
                  }
                  aciklama={komsulukMetni(geriBildirim)}
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
 * Geri bildirimin alt satırı: kaçının doğru sırada olduğu.
 *
 * Tam doğru cevapta bonusu, yanlışta kaç komşuluğun tuttuğunu söylüyor —
 * "hepsi yanlış" ile "biri kaymış" arasındaki farkı oyuncunun görmesi gereken
 * yer burası.
 */
function komsulukMetni(geri: GeriBildirim): string {
  const enCok = geri.dizilim.length - 1
  if (geri.dogruMu) return `${enCok} komşuluk + ${TAM_BONUS} tam sıra bonusu`
  return `${dogruKomsuSayisi(geri.dizilim)}/${enCok} komşuluk doğru sırada`
}

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
  sonuc: { ozet: TurOzeti<Yanlis>; yeniRekor: boolean; puan: number }
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
      oyunId="sirala"
      dogru={ozet.dogru}
      yanlis={ozet.yanlis}
      enIyiSeri={ozet.enIyiSeri}
      rekor={rekor}
      yeniRekor={yeniRekor}
      bankaTuru={bankaTuru}
      mod={mod}
      elendi={elendi}
      puan={{ deger: sonuc.puan, etiket: 'Puan' }}
      altBaslik={
        bankaTuru
          ? 'Banka soruları — üst üste üç doğruda düşerler.'
          : rekorCumlesi(ozet.dogru, rekor, yeniRekor, 'doğru')
      }
      bolumBasligi="Karıştırdığın sıralar"
      bolumAltYazisi="Doğrusu yıllarıyla birlikte — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.soru.olaylar[0]?.olay}-${sira}`}
              oyunId="sirala"
              soru={siraladanBanka(yanlis.soru)}
              bildir={bildir}
            >
              <b className="block font-display text-[12.5px] font-extrabold leading-tight">
                Doğru sıra
              </b>
              <ol className="mt-1 space-y-0.5">
                {dogruSira(yanlis.soru).map((olay, yer) => {
                  // Oyuncunun o konuma koyduğu kart tutmuş mu — yanlışın nerede
                  // olduğu, doğru listeyi okumaktan daha çok şey anlatıyor.
                  const yerinde = yanlis.dizilim[yer]?.olay === olay.olay
                  return (
                    <li
                      key={olay.olay}
                      className={cn(
                        'flex items-baseline gap-1.5 text-[11.5px] font-semibold leading-snug',
                        yerinde ? 'text-success' : 'text-muted-foreground',
                      )}
                    >
                      <span className="rakam shrink-0 font-extrabold">
                        {yilMetni(olay.yil)}
                      </span>
                      <span className="min-w-0">{olay.olay}</span>
                    </li>
                  )
                })}
              </ol>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
