'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, X } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import type { YazimKurali, YazimSorusu } from '@/lib/oyunlar/yazim-havuzu'
import { KURAL_ACIKLAMASI, KURAL_ADI } from '@/lib/oyunlar/yazim-havuzu'
import type { NoktalamaSorusu } from '@/lib/oyunlar/noktalama-havuzu'
import {
  ISARET_ADI,
  NOKTALAMA_ACIKLAMASI,
  type NoktalamaKurali,
} from '@/lib/oyunlar/noktalama-havuzu'
import {
  SORU_TURU_ADI,
  SORU_TURU_ORNEGI,
  TUM_SORU_TURLERI,
  havuzlariSec,
  turHazirla,
  type Havuzlar,
  type OyunSorusu,
  type Sik,
  type SoruIcerigi,
  type SoruTuru,
} from '@/lib/oyunlar/yazim-oyunu'
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
import {
  noktalamadanBanka,
  yazimdanBanka,
  type BankaCevabi,
  type BankaKaydi,
} from '@/lib/oyunlar/banka'
import type { BildirimKolu } from '@/components/hata-bildir'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { oyunSesiCal } from '@/lib/oyunlar/oyun-sesi'
import { ANAHTARLAR, useYerelDepo } from '@/lib/depo'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Rabi, type MaskotDurumu } from '@/components/maskot/rabi'
import { Cip } from '@/components/ui'
import {
  Bildirim,
  EN_COK_YANLIS,
  KalanHapi,
  OyunKabugu,
  TurSonu,
  YanlisKarti,
  rekorCumlesi,
} from '@/components/oyun-kabuk'
import { OyunTanitim } from '@/components/oyun-tanitim'

/**
 * Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms).
 *
 * Doğru ve yanlış için **aynı**. Önce doğruda çok daha kısaydı (320 ms) ama
 * soru bir anda değişiyordu: oyuncu doğru bildiğini göremeden ekran kayıyor,
 * hızlı gidince de yanlışa basma ihtimali artıyordu. Tek süre, cevabın
 * doğruluğundan bağımsız olarak aynı ritmi kuruyor.
 */
const CEVAP_BEKLEMESI = 900

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type GeriBildirim = { secilenMetin: string; dogruMu: boolean; icerik: SoruIcerigi }

/**
 * Banka kayıtlarından tur havuzları.
 *
 * Kayıt ekranda göstermek için gereken her şeyi taşıyor, tek eksik oyunun
 * beklediği biçim. Yazım dışındaki kayıtlar eleniyor. Noktalama kayıtları
 * `isaretler` alanından tanınıyor: ikisi de bankada `yazim` kimliğiyle duruyor,
 * çünkü ikisi de bu turda sorulacak.
 */
function bankaHavuzlari(kayitlar: readonly BankaKaydi[]): Havuzlar {
  const yazim: YazimSorusu[] = []
  const noktalama: NoktalamaSorusu[] = []

  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'yazim') continue
    const isaretler = kayit.soru.isaretler
    if (isaretler) {
      noktalama.push({
        cumle: kayit.soru.yanlis,
        duzeltme: kayit.soru.dogru,
        yanlisIsaret: isaretler.yanlis,
        dogruIsaret: isaretler.dogru,
        kural: kayit.soru.kural as NoktalamaKurali,
      })
    } else {
      yazim.push({
        dogru: kayit.soru.dogru,
        yanlis: kayit.soru.yanlis,
        kural: kayit.soru.kural as YazimKurali,
      })
    }
  }

  return { yazim, noktalama }
}

/** Cevabı bankanın anladığı biçime çevirir. */
function bankayaCevir(icerik: SoruIcerigi) {
  return icerik.tur === 'yazim' ? yazimdanBanka(icerik.soru) : noktalamadanBanka(icerik.soru)
}

/**
 * Yazım Ustası — mini oyun.
 *
 * İki soru türü var: iki yazılıştan doğrusunu seçmek ve bir cümlede yanlış
 * kullanılmış noktalama işaretini bulmak. Hangisinin geleceğini oyuncu tanıtım
 * ekranından seçiyor; ikisi de seçiliyse sorular sırayla harmanlanıyor.
 *
 * Oynarken kelimenin **kuralı yazılmıyor**. Yazılıyordu ve cevabı ele veriyordu:
 * "Bitişik yazılır" notunun altında biri ayrı biri bitişik iki şık varsa okumaya
 * bile gerek kalmıyordu. Kural, tur bitince yanlışların listesinde çıkıyor —
 * öğretmesi gereken yer orası.
 */
export function YazimOyunuEkrani({
  istatistik,
  sesAcik,
  bankaSorulari,
  onTurBitti,
  onCik,
  bildir,
}: {
  istatistik: OyunIstatistigi
  /** Ses efektleri açık mı (Ayarlar → Mini oyun sesleri). */
  sesAcik: boolean
  /** Boş değilse tur yalnızca bu sorularla kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (ozet: TurOzeti<SoruIcerigi>, bankaCevaplari: BankaCevabi[]) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('yazim')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  // Seçim kalıcı: her turda aynı çipleri yeniden işaretlemek, oyunu açıp hemen
  // başlamanın önüne geçerdi. (Zihinden İşlem'deki tür seçimiyle aynı yaklaşım.)
  const [secili, setSecili] = useYerelDepo<SoruTuru[]>(
    ANAHTARLAR.yazimSecimi,
    TUM_SORU_TURLERI,
  )

  const [sorular, setSorular] = useState<OyunSorusu[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<SoruIcerigi>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)

  const [bitisZamani, setBitisZamani] = useState(0)
  const [kalan, setKalan] = useState(TUR_SURESI)
  /** Yardım açıkken sayaç durur; kalan saniye burada bekletilir. */
  const [duraklatilan, setDuraklatilan] = useState<number | null>(null)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<SoruIcerigi>; yeniRekor: boolean } | null>(
    null,
  )

  /** Banka turunda havuz bankadaki kayıtlar; normal turda oyunun kendi havuzu. */
  const bankaHavuzu = useMemo(() => bankaHavuzlari(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.yazim.length + bankaHavuzu.noktalama.length > 0

  // Tur başındaki rekor: sonuç ekranı "yeni rekor" derken güncellenmiş değerle
  // değil, tura girerken geçerli olan değerle karşılaştırmalı.
  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** Sayaç bittiğinde o ana kadarki cevaplar lazım; efekt `cevaplar`a bağlanırsa
   *  her cevapta yeniden kurulur ve sayaç zıplar. */
  const cevaplarRef = useRef<Cevap<SoruIcerigi>[]>([])
  cevaplarRef.current = cevaplar
  /** Tur bir kez bitirilir: 250 ms'lik sayaç, `asama` değişmeden önce ikinci kez
   *  tetiklenirse istatistik iki kat sayılırdı. */
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setSorular(turHazirla(bankaTuru ? bankaHavuzu : havuzlariSec(secili)))
    setSira(0)
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setDuraklatilan(null)
    setKalan(TUR_SURESI)
    setBitisZamani(Date.now() + TUR_SURESI * 1000)
    setAsama('oynaniyor')
  }, [bankaHavuzu, bankaTuru, istatistik.enIyiDogru, secili])

  const turBitir = useCallback(
    (verilenler: Cevap<SoruIcerigi>[]) => {
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
      // Doğrular da bankaya bildiriliyor: banka, üst üste üç kez doğru bilinen
      // kaydı düşürüyor — soruyu nerede bilirsen bil, öğrenmiş sayılıyorsun.
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: bankayaCevir(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
      )
    },
    [bankaTuru, istatistik, onTurBitti, sesAcik],
  )

  // Sayaç. Hedef zaman damgasından okunuyor; arka plana atılan WebView'da
  // sayarak ilerleyen bir sayaç donup kalırdı (pomodoro ile aynı yaklaşım).
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

  // Havuz tükenirse tur süre dolmadan biter; yoksa ekranda soru kalmaz ve sayaç
  // boşa işlerdi. Banka turunda bu sık oluyor: banka birkaç soruluk olabilir.
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

  const cevapla = (sik: Sik) => {
    // Geri bildirim gösterilirken ikinci dokunuş yok sayılıyor; yoksa aynı
    // soruya iki cevap yazılır ve süre iki kez cezalandırılırdı.
    if (asama !== 'oynaniyor' || geriBildirim !== null) return

    const soru = sorular[sira]
    if (!soru) return

    const dogruMu = sik.dogruMu
    const icerik: SoruIcerigi =
      soru.tur === 'yazim' ? { tur: 'yazim', soru: soru.soru } : { tur: 'noktalama', soru: soru.soru }
    setCevaplar((onceki) => [...onceki, { soru: icerik, dogruMu }])
    setGeriBildirim({ secilenMetin: sik.metin, dogruMu, icerik })
    geriBildir(dogruMu)

    if (!dogruMu) setBitisZamani((b) => b - YANLIS_CEZASI * 1000)

    zamanlayiciRef.current = setTimeout(() => {
      setGeriBildirim(null)
      setSira((s) => s + 1)
    }, CEVAP_BEKLEMESI)
  }

  const yardimAc = () => {
    setDuraklatilan(kalanSaniye(bitisZamani))
    setYardimAcik(true)
  }

  const yardimKapat = () => {
    // Okurken geçen süre oyuncudan gitmesin: kalan süre olduğu gibi geri konur.
    if (duraklatilan !== null) setBitisZamani(Date.now() + duraklatilan * 1000)
    setDuraklatilan(null)
    setYardimAcik(false)
  }

  /** Son tür de kapatılamıyor: soru gelmeyen bir tur başlatılamaz. */
  const turDegistir = (tur: SoruTuru) => {
    setSecili((onceki) => {
      const varMi = onceki.includes(tur)
      if (varMi && onceki.length === 1) return onceki
      return varMi ? onceki.filter((t) => t !== tur) : [...onceki, tur]
    })
  }

  const dogruSayisi = cevaplar.filter((c) => c.dogruMu).length
  const gorunenKalan = duraklatilan ?? kalan
  const soru = sorular[sira]

  const maskotDurumu: MaskotDurumu = geriBildirim
    ? geriBildirim.dogruMu
      ? 'kutlama'
      : 'uzgun'
    : 'calisiyor'

  return (
    <>
      <OyunKabugu
        oyunId="yazim"
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
            rekor={turBasiRekor.current}
            bankaTuru={bankaTuru}
            onTekrar={turBaslat}
            onCik={onCik}
            bildir={bildir}
          />
        ) : (
          asama === 'oynaniyor' &&
          soru && (
            <>
              <div className="flex flex-1 flex-col justify-center gap-3.5 py-3">
                <div className="grid place-items-center">
                  <Rabi durum={maskotDurumu} boyut={62} />
                </div>

                {/* Noktalamada cümlenin kendisi sorunun bir parçası; şıklar
                    yalnızca işaret gösterdiği için cümle okunmadan cevaplanamaz. */}
                {soru.tur === 'noktalama' && (
                  <p className="golge-kart rounded-2xl bg-card px-4 py-3 text-center font-display text-[17px] font-extrabold leading-snug">
                    {soru.soru.cumle}
                  </p>
                )}

                <p className="text-center font-display text-[15px] font-extrabold">
                  {soru.tur === 'yazim'
                    ? 'Doğru yazılışı seç'
                    : 'Yanlış kullanılan işareti seç'}
                </p>

                <div
                  className={cn(
                    'gap-2.5',
                    soru.tur === 'yazim' ? 'flex flex-col' : 'grid grid-cols-2',
                  )}
                >
                  {soru.siklar.map((sik) => (
                    <SikDugmesi
                      key={sik.metin}
                      sik={sik}
                      geriBildirim={geriBildirim}
                      onSec={() => cevapla(sik)}
                    />
                  ))}
                </div>
              </div>

              {geriBildirim && <CevapBildirimi geriBildirim={geriBildirim} />}
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
            <TurSecimi secili={secili} onDegis={turDegistir} />
          ) : null
        }
      />
    </>
  )
}

/** Tanıtım penceresindeki soru türü seçimi. */
function TurSecimi({
  secili,
  onDegis,
}: {
  secili: SoruTuru[]
  onDegis: (tur: SoruTuru) => void
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Hangi hatalar gelsin?</p>
      <div className="flex flex-wrap gap-2">
        {TUM_SORU_TURLERI.map((tur) => (
          <Cip
            key={tur}
            secili={secili.includes(tur)}
            onClick={() => onDegis(tur)}
            className="flex-col items-start px-3 py-1.5 text-left leading-tight"
          >
            <span className="block">{SORU_TURU_ADI[tur]}</span>
            <span
              className={cn(
                'block text-[11px] font-normal',
                secili.includes(tur) ? 'text-primary-foreground/75' : 'text-muted-foreground/70',
              )}
            >
              {SORU_TURU_ORNEGI[tur]}
            </span>
          </Cip>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        İkisi de seçiliyse sorular sırayla karışık gelir.
      </p>
    </div>
  )
}

/** Cevaptan sonra çıkan şerit; iki soru türü farklı şey söylüyor. */
function CevapBildirimi({ geriBildirim }: { geriBildirim: GeriBildirim }) {
  const { dogruMu, icerik } = geriBildirim

  if (icerik.tur === 'yazim') {
    return (
      <Bildirim
        iyi={dogruMu}
        baslik={dogruMu ? 'Aynen böyle!' : 'Olmadı'}
        aciklama={dogruMu ? `“${icerik.soru.yanlis}” değil` : `— doğrusu “${icerik.soru.dogru}”`}
      />
    )
  }

  return (
    <Bildirim
      iyi={dogruMu}
      baslik={dogruMu ? 'Aynen böyle!' : 'Olmadı'}
      aciklama={dogruMu ? undefined : `— yanlış olan ${ISARET_ADI[icerik.soru.yanlisIsaret]}`}
    />
  )
}

/**
 * Tek şık.
 *
 * Cevaptan sonra **iki** şık da renklenir: seçilen kırmızıysa doğrusunun
 * hangisi olduğu aynı anda yeşille gösterilir. Yalnızca seçilen renklenseydi
 * oyuncu yanlış yaptığını görür ama doğrusunu öğrenemezdi.
 */
function SikDugmesi({
  sik,
  geriBildirim,
  onSec,
}: {
  sik: Sik
  geriBildirim: GeriBildirim | null
  onSec: () => void
}) {
  const acikta = geriBildirim !== null
  const secilen = acikta && geriBildirim.secilenMetin === sik.metin
  const dogruSecim = secilen && sik.dogruMu
  const yanlisSecim = secilen && !sik.dogruMu
  /** Yanlış seçildiğinde doğrusu da işaretleniyor — öğrenme burada oluyor. */
  const isaretli = acikta && !secilen && sik.dogruMu

  return (
    <button
      type="button"
      onClick={onSec}
      disabled={acikta}
      className={cn(
        'golge-kart flex min-h-[62px] w-full items-center justify-center gap-2 rounded-[20px] border-2 px-4 py-3',
        'font-display text-lg font-extrabold leading-snug transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        !acikta && 'border-border bg-card active:brightness-95',
        dogruSecim && 'border-success bg-success text-white',
        yanlisSecim && 'border-ikincil bg-ikincil text-white',
        isaretli && 'border-success bg-card text-success',
        acikta && !secilen && !sik.dogruMu && 'border-border bg-card opacity-45',
      )}
    >
      <span className="flex min-w-0 flex-col items-center">
        {/* İşaret büyük, adı altında: tek başına bir “;” küçük ekranda “,” ile
            karışıyor, ad da işareti okumadan seçmeyi engellemiyor. */}
        <span className={cn('break-words', sik.altYazi && 'text-[28px] leading-[1.1]')}>
          {sik.metin}
        </span>
        {sik.altYazi && <span className="text-[11.5px] font-semibold">{sik.altYazi}</span>}
      </span>
      {(dogruSecim || isaretli) && <Check size={19} className="shrink-0" aria-hidden />}
      {yanlisSecim && <X size={19} className="shrink-0" aria-hidden />}
    </button>
  )
}

function SonucGorunumu({
  sonuc,
  rekor,
  bankaTuru,
  onTekrar,
  onCik,
  bildir,
}: {
  sonuc: { ozet: TurOzeti<SoruIcerigi>; yeniRekor: boolean }
  rekor: number
  bankaTuru: boolean
  onTekrar: () => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const { ozet, yeniRekor } = sonuc
  const gorunen = ozet.yanlislar.slice(0, EN_COK_YANLIS)
  const kalan = ozet.yanlislar.length - gorunen.length

  return (
    <TurSonu
      oyunId="yazim"
      dogru={ozet.dogru}
      yanlis={ozet.yanlis}
      enIyiSeri={ozet.enIyiSeri}
      rekor={rekor}
      yeniRekor={yeniRekor}
      bankaTuru={bankaTuru}
      altBaslik={
        bankaTuru
          ? 'Banka soruları — üst üste üç doğruda düşerler.'
          : rekorCumlesi(ozet.dogru, rekor, yeniRekor, 'doğru')
      }
      bolumBasligi="Karıştırdıkların"
      bolumAltYazisi="Kuralıyla birlikte — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.tur === 'yazim' ? yanlis.soru.dogru : yanlis.soru.cumle}-${sira}`}
              oyunId="yazim"
              soru={bankayaCevir(yanlis)}
              bildir={bildir}
            >
              {yanlis.tur === 'yazim' ? (
                <YazimYanlisi soru={yanlis.soru} />
              ) : (
                <NoktalamaYanlisi soru={yanlis.soru} />
              )}
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}

function YazimYanlisi({ soru }: { soru: YazimSorusu }) {
  return (
    <>
      <b className="block font-display text-[13.5px] font-extrabold leading-tight">{soru.dogru}</b>
      <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
        Sen <s className="text-ikincil">{soru.yanlis}</s> dedin
      </span>
      {/* Kuralın kendisi: doğrusunu ezberlemek yerine neden öyle yazıldığını
          bilmek, havuzdaki benzer kelimelerin hepsini birden çözüyor. */}
      <span className="mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
        {KURAL_ADI[soru.kural]} · {KURAL_ACIKLAMASI[soru.kural]}
      </span>
    </>
  )
}

/**
 * Noktalama yanlışı.
 *
 * Önce hatalı cümle, sonra doğrusu: iki cümleyi yan yana görmek, "hangi işaret
 * yanlıştı" cevabından daha çok şey öğretiyor — fark gözle bulunuyor.
 */
function NoktalamaYanlisi({ soru }: { soru: NoktalamaSorusu }) {
  return (
    <>
      <b className="block font-display text-[13.5px] font-extrabold leading-tight">{soru.cumle}</b>
      <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
        Yanlış olan <b className="text-ikincil">{ISARET_ADI[soru.yanlisIsaret]}</b> — doğrusu:{' '}
        {soru.duzeltme}
      </span>
      <span className="mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
        {NOKTALAMA_ACIKLAMASI[soru.kural]}
      </span>
    </>
  )
}
