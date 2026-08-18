'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, X } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import type { YazimKurali, YazimSorusu } from '@/lib/oyunlar/yazim-havuzu'
import { KURAL_ACIKLAMASI, KURAL_ADI } from '@/lib/oyunlar/yazim-havuzu'
import { turHazirla, type OyunSorusu, type Sik } from '@/lib/oyunlar/yazim-oyunu'
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
  yazimdanBanka,
  type BankaCevabi,
  type BankaKaydi,
} from '@/lib/oyunlar/banka'
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
} from '@/components/oyun-kabuk'
import { OyunTanitim } from '@/components/oyun-tanitim'

/** Doğru cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms). */
const DOGRU_BEKLEME = 320
/** Yanlışta daha uzun bekleniyor: doğrusunun hangisi olduğu okunabilsin. */
const YANLIS_BEKLEME = 900

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type GeriBildirim = { secilenMetin: string; dogruMu: boolean; soru: YazimSorusu }

/**
 * Banka kayıtlarından yazım havuzu.
 *
 * Saf ve küçük: banka kaydı ekranda göstermek için gereken her şeyi taşıyor,
 * tek eksik oyunun beklediği biçim. Yazım dışındaki kayıtlar eleniyor —
 * "sadece bunlardan bir tur" akışında bankanın tamamı geliyor.
 */
function bankaHavuzu(kayitlar: readonly BankaKaydi[]): YazimSorusu[] {
  const havuz: YazimSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'yazim') continue
    havuz.push({
      dogru: kayit.soru.dogru,
      yanlis: kayit.soru.yanlis,
      kural: kayit.soru.kural as YazimKurali,
    })
  }
  return havuz
}

/**
 * Yazım Ustası — mini oyun.
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
}: {
  istatistik: OyunIstatistigi
  /** Ses efektleri açık mı (Ayarlar → Mini oyun sesleri). */
  sesAcik: boolean
  /** Boş değilse tur yalnızca bu sorularla kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (ozet: TurOzeti<YazimSorusu>, bankaCevaplari: BankaCevabi[]) => void
  onCik: () => void
}) {
  const oyun = oyunBul('yazim')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<OyunSorusu[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<YazimSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)

  const [bitisZamani, setBitisZamani] = useState(0)
  const [kalan, setKalan] = useState(TUR_SURESI)
  /** Yardım açıkken sayaç durur; kalan saniye burada bekletilir. */
  const [duraklatilan, setDuraklatilan] = useState<number | null>(null)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<YazimSorusu>; yeniRekor: boolean } | null>(
    null,
  )

  /** Banka turunda havuz bankadaki kayıtlar; normal turda oyunun kendi havuzu. */
  const havuz = useMemo(() => bankaHavuzu(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0

  // Tur başındaki rekor: sonuç ekranı "yeni rekor" derken güncellenmiş değerle
  // değil, tura girerken geçerli olan değerle karşılaştırmalı.
  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** Sayaç bittiğinde o ana kadarki cevaplar lazım; efekt `cevaplar`a bağlanırsa
   *  her cevapta yeniden kurulur ve sayaç zıplar. */
  const cevaplarRef = useRef<Cevap<YazimSorusu>[]>([])
  cevaplarRef.current = cevaplar
  /** Tur bir kez bitirilir: 250 ms'lik sayaç, `asama` değişmeden önce ikinci kez
   *  tetiklenirse istatistik iki kat sayılırdı. */
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setSorular(havuz.length > 0 ? turHazirla(havuz) : turHazirla())
    setSira(0)
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setDuraklatilan(null)
    setKalan(TUR_SURESI)
    setBitisZamani(Date.now() + TUR_SURESI * 1000)
    setAsama('oynaniyor')
  }, [havuz, istatistik.enIyiDogru])

  const turBitir = useCallback(
    (verilenler: Cevap<YazimSorusu>[]) => {
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
          soru: yazimdanBanka(cevap.soru),
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
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu }])
    setGeriBildirim({ secilenMetin: sik.metin, dogruMu, soru: soru.soru })
    geriBildir(dogruMu)

    if (!dogruMu) setBitisZamani((b) => b - YANLIS_CEZASI * 1000)

    zamanlayiciRef.current = setTimeout(
      () => {
        setGeriBildirim(null)
        setSira((s) => s + 1)
      },
      dogruMu ? DOGRU_BEKLEME : YANLIS_BEKLEME,
    )
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
          />
        ) : (
          asama === 'oynaniyor' &&
          soru && (
            <>
              <div className="flex flex-1 flex-col justify-center gap-3.5 py-3">
                <div className="grid place-items-center">
                  <Rabi durum={maskotDurumu} boyut={62} />
                </div>
                <p className="text-center font-display text-[15px] font-extrabold">
                  Doğru yazılışı seç
                </p>

                <div className="flex flex-col gap-2.5">
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

              {geriBildirim && (
                <Bildirim
                  iyi={geriBildirim.dogruMu}
                  baslik={geriBildirim.dogruMu ? 'Aynen böyle!' : 'Olmadı'}
                  aciklama={
                    geriBildirim.dogruMu
                      ? `“${geriBildirim.soru.yanlis}” değil`
                      : `— doğrusu “${geriBildirim.soru.dogru}”`
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
      />
    </>
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
      <span className="min-w-0 break-words">{sik.metin}</span>
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
}: {
  sonuc: { ozet: TurOzeti<YazimSorusu>; yeniRekor: boolean }
  rekor: number
  bankaTuru: boolean
  onTekrar: () => void
  onCik: () => void
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
      bolumAltYazisi="Yazım kuralıyla birlikte — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti key={`${yanlis.dogru}-${sira}`} oyunId="yazim">
              <b className="block font-display text-[13.5px] font-extrabold leading-tight">
                {yanlis.dogru}
              </b>
              <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
                Sen <s className="text-ikincil">{yanlis.yanlis}</s> dedin
              </span>
              {/* Kuralın kendisi: doğrusunu ezberlemek yerine neden öyle
                  yazıldığını bilmek, havuzdaki benzer kelimelerin hepsini
                  birden çözüyor. */}
              <span className="mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
                {KURAL_ADI[yanlis.kural]} · {KURAL_ACIKLAMASI[yanlis.kural]}
              </span>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
