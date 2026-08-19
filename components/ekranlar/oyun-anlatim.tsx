'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, X } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import type { AnlatimSorusu, BozuklukTuru } from '@/lib/oyunlar/anlatim-havuzu'
import {
  ANLATIM_HAVUZU,
  BOZUKLUK_ACIKLAMASI,
  BOZUKLUK_ADI,
} from '@/lib/oyunlar/anlatim-havuzu'
import { turHazirla, type AnlatimOyunSorusu, type AnlatimSikki } from '@/lib/oyunlar/anlatim'
import {
  guncelSeri,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { anlatimdanBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import {
  bossZorlugu,
  elerMi,
  soruSuresi,
  turSirasi,
  type SiradakiSoru,
  type Zorluk,
} from '@/lib/oyunlar/ritim'
import { useSoruSayaci } from '@/lib/oyunlar/soru-sayaci'
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
} from '@/components/oyun-kabuk'
import { OyunTanitim } from '@/components/oyun-tanitim'

/**
 * Anlatım Bozukluğu — mini oyun.
 *
 * Ekranda bozuk cümle duruyor, şıklarda bozukluğun sebepleri. Düzeltilmiş hâl
 * soruda **gösterilmiyor**: yan yana konsaydı fark okunur ve sebebi
 * düşünmeden bulmak mümkün olurdu. Düzeltme cevaptan sonra çıkıyor — orada
 * bilgi, soruda ise ipucu olurdu.
 */

/** Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms) — doğru ve yanlış için aynı. */
const CEVAP_BEKLEMESI = 1300

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/**
 * `ritim.ts`'in kurduğu sıraya şıkları ekler.
 *
 * Sıra korunmalı: boss soruları belirli konumlara yerleştirilmiş durumda,
 * `turHazirla` varsayılan hâlinde yeniden karıştırıp o yerleşimi bozardı.
 */
function sirayiKur(sira: SiradakiSoru<AnlatimSorusu>[]): SiradakiSoru<AnlatimOyunSorusu>[] {
  const sorular = turHazirla(
    sira.map((s) => s.soru),
    Math.random,
    false,
  )
  return sorular.map((soru, i) => ({ soru, boss: sira[i].boss }))
}

/** `secilen` süre dolduğunda `null`: oyuncu bir şık işaretlemedi. */
type GeriBildirim = { secilen: BozuklukTuru | null; dogruMu: boolean; soru: AnlatimSorusu }

/**
 * Banka kayıtlarından cümle havuzu.
 *
 * Banka kaydı ekranda göstermek için gereken her şeyi taşıyor; tek eksik oyunun
 * beklediği biçim. Anlatım dışındaki kayıtlar eleniyor.
 */
function bankaHavuzu(kayitlar: readonly BankaKaydi[]): AnlatimSorusu[] {
  const havuz: AnlatimSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'anlatim') continue
    havuz.push({
      cumle: kayit.soru.cumle,
      duzeltme: kayit.soru.duzeltme,
      tur: kayit.soru.bozuklukTuru,
      // Banka turunda zorluk seçilmiyor ve boss gelmiyor — sorular zaten
      // kullanıcının kendi yanlışları. Alan tipin gereği doldurulmuş durumda.
      zorluk: 'orta',
    })
  }
  return havuz
}

export function AnlatimOyunuEkrani({
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
    ozet: TurOzeti<AnlatimSorusu>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — tur artık sabit süreli değil. */
    gecenSaniye: number,
  ) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('anlatim')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<SiradakiSoru<AnlatimOyunSorusu>[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<AnlatimSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  /** Boss'ta yanılıp elendi mi — tur sonu ekranı bunu ayrıca söylüyor. */
  const [elendi, setElendi] = useState(false)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukAnlatim, 'kolay')
  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)

  const [sonuc, setSonuc] = useState<{
    ozet: TurOzeti<AnlatimSorusu>
    yeniRekor: boolean
  } | null>(null)

  const havuz = useMemo(() => bankaHavuzu(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<AnlatimSorusu>[]>([])
  cevaplarRef.current = cevaplar
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setSorular(
      bankaTuru
        ? turHazirla(havuz).map((soru) => ({ soru, boss: false }))
        : sirayiKur(turSirasi(ANLATIM_HAVUZU, 'anlatim', zorluk)),
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
    (verilenler: Cevap<AnlatimSorusu>[]) => {
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
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: anlatimdanBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
      )
    },
    [bankaTuru, istatistik, onTurBitti, sesAcik],
  )

  // Havuz tükenirse tur biter — banka turunda ve soru sınırına varılınca.
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
   * Cevaptan sonraki geçiş.
   *
   * Boss'ta yanılmak turu bitiriyor; normal soruda yanılmak yalnızca yanlış
   * sayılıyor. Bekleme süresi ikisinde de aynı: düzeltilmiş cümleyi okumadan
   * ekranın değişmesi, elenirken bile öğretmeyi bırakmak olurdu.
   */
  const ilerle = (dogruMu: boolean, bossMuydu: boolean) => {
    zamanlayiciRef.current = setTimeout(() => {
      setGeriBildirim(null)
      if (elerMi(bossMuydu, dogruMu)) {
        setElendi(true)
        turBitir(cevaplarRef.current)
      } else {
        setSira((s) => s + 1)
      }
    }, CEVAP_BEKLEMESI)
  }

  const cevapla = (sik: AnlatimSikki) => {
    // Geri bildirim gösterilirken ikinci dokunuş yok sayılıyor; yoksa aynı
    // soruya iki cevap yazılırdı.
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return

    const dogruMu = sik.dogruMu
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu }])
    setGeriBildirim({ secilen: sik.deger, dogruMu, soru: soru.soru })
    geriBildir(dogruMu)
    ilerle(dogruMu, boss)
  }

  /** Süre dolması cevap vermemekle aynı: yanlış sayılıyor, boss'ta eliyor. */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu: false }])
    setGeriBildirim({ secilen: null, dogruMu: false, soru: soru.soru })
    geriBildir(false)
    ilerle(false, boss)
    // `ilerle` ve `geriBildir` her renderda yeniden kuruluyor; sayaç yalnızca
    // güncel olanı çağırsın diye bağımlılıklar bilerek dar tutuldu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, soru, boss])

  const { kalan, toplam } = useSoruSayaci({
    aktif: asama === 'oynaniyor' && geriBildirim === null && !duraklatilan && soru !== undefined,
    sure: soruSuresi('anlatim', boss ? bossZorlugu(zorluk) : null),
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

  const maskotDurumu: MaskotDurumu = geriBildirim
    ? geriBildirim.dogruMu
      ? 'kutlama'
      : 'uzgun'
    : 'calisiyor'

  return (
    <>
      <OyunKabugu
        oyunId="anlatim"
        baslik={oyun.ad}
        sayac={
          asama === 'bitti'
            ? null
            : {
                kalan,
                toplam,
                sira: sira + 1,
                boss,
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
              <div className="flex flex-1 flex-col justify-center gap-3 py-2">
                <div className="grid place-items-center">
                  <Rabi durum={maskotDurumu} boyut={46} />
                </div>

                <div className="golge-kart rounded-[20px] bg-card px-4 py-3.5 text-center">
                  <p className="font-display text-[17px] font-extrabold leading-snug tracking-tight">
                    {soru.soru.cumle}
                  </p>
                </div>

                <p className="text-center font-display text-[14px] font-extrabold">
                  Bozukluğun sebebi ne?
                </p>

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
              </div>

              {geriBildirim && (
                <Bildirim
                  iyi={geriBildirim.dogruMu}
                  baslik={geriBildirim.dogruMu ? 'Doğru!' : 'Olmadı'}
                  aciklama={`Doğrusu: ${geriBildirim.soru.duzeltme}`}
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
            <ZorlukSecimi secili={zorluk} onSec={setZorluk} bossVar />
          ) : null
        }
      />
    </>
  )
}

/**
 * Tek şık.
 *
 * Cevaptan sonra doğru şık her hâlükârda yeşile dönüyor: yanlış seçen oyuncu
 * hangisi olması gerektiğini aynı ekranda görüyor.
 */
function SikDugmesi({
  sik,
  geriBildirim,
  onSec,
}: {
  sik: AnlatimSikki
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
        'golge-kart flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[16px] border-2 px-3 py-2',
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

function SonucGorunumu({
  sonuc,
  rekor,
  bankaTuru,
  elendi,
  onTekrar,
  onCik,
  bildir,
}: {
  sonuc: { ozet: TurOzeti<AnlatimSorusu>; yeniRekor: boolean }
  rekor: number
  bankaTuru: boolean
  elendi: boolean
  onTekrar: () => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const { ozet, yeniRekor } = sonuc
  const gorunen = ozet.yanlislar.slice(0, EN_COK_YANLIS)
  const kalan = ozet.yanlislar.length - gorunen.length

  return (
    <TurSonu
      oyunId="anlatim"
      dogru={ozet.dogru}
      yanlis={ozet.yanlis}
      enIyiSeri={ozet.enIyiSeri}
      rekor={rekor}
      yeniRekor={yeniRekor}
      bankaTuru={bankaTuru}
      elendi={elendi}
      altBaslik={
        bankaTuru
          ? 'Banka soruları — üst üste üç doğruda düşerler.'
          : rekorCumlesi(ozet.dogru, rekor, yeniRekor, 'doğru')
      }
      bolumBasligi="Karıştırdıkların"
      bolumAltYazisi="Düzeltilmiş hâliyle birlikte — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.cumle}-${sira}`}
              oyunId="anlatim"
              soru={anlatimdanBanka(yanlis)}
              bildir={bildir}
            >
              <b className="block font-display text-[13.5px] font-extrabold leading-tight">
                {yanlis.cumle}
              </b>
              <span className="mt-1 block text-[11.5px] font-semibold leading-snug text-success">
                {yanlis.duzeltme}
              </span>
              <span className="mt-1 block text-[11.5px] font-extrabold text-muted-foreground">
                {BOZUKLUK_ADI[yanlis.tur]}
              </span>
              <span className="mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
                {BOZUKLUK_ACIKLAMASI[yanlis.tur]}
              </span>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
