'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, X } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import type { OrganelSorusu } from '@/lib/oyunlar/hucre-havuzu'
import { HUCRE_HAVUZU } from '@/lib/oyunlar/hucre-havuzu'
import {
  IPUCU_SAYISI,
  gorunenIpucu,
  ipucuPuani,
  turHazirla,
  type HucreOyunSorusu,
  type HucreSikki,
} from '@/lib/oyunlar/hucre'
import {
  guncelSeri,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { hucredenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import {
  bossZorlugu,
  elerMi,
  soruSuresi,
  turSirasi,
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
import { OyunTanitim } from '@/components/oyun-tanitim'

/**
 * Organel Kartı — mini oyun.
 *
 * Ekranda arkası dönük bir kart var; arkasında cevap olan organel yazıyor.
 * Kart ipuçlarını kendisi veriyor ve her ipucu cevabı kolaylaştırdığı için
 * puanı azaltıyor (`lib/oyunlar/hucre.ts`).
 *
 * Kart yalnızca **şık seçilirse** dönüyor. Süre dolduğunda dönmemesi bilinçli:
 * kartın açılması oyuncunun kararının karşılığı, süre dolması ise karar
 * vermemek. Doğru cevap yine de söyleniyor — ama kartın üstünde değil, geri
 * bildirim şeridinde.
 */

/**
 * Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms).
 *
 * Öteki oyunlardan uzun: kartın dönme animasyonu bitmeden ekran değişirse
 * oyuncu kartın arkasını hiç göremez.
 */
const CEVAP_BEKLEMESI = 1700

/** Kartın dönme süresi (ms) — sınıf adındaki `duration-500` ile aynı olmalı. */
const DONME_SURESI = 500

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/**
 * `ritim.ts`'in kurduğu sıraya şıkları ekler.
 *
 * Sıra korunmalı: boss soruları belirli konumlara yerleştirilmiş durumda,
 * `turHazirla` varsayılan hâlinde yeniden karıştırıp o yerleşimi bozardı.
 */
function sirayiKur(sira: SiradakiSoru<OrganelSorusu>[]): SiradakiSoru<HucreOyunSorusu>[] {
  const sorular = turHazirla(
    sira.map((s) => s.soru),
    Math.random,
    false,
  )
  return sorular.map((soru, i) => ({ soru, boss: sira[i].boss }))
}

/** `secilen` süre dolduğunda `null`: oyuncu bir şık işaretlemedi, kart dönmüyor. */
type GeriBildirim = {
  secilen: string | null
  dogruMu: boolean
  soru: OrganelSorusu
  /** Cevabın kaçıncı ipucunda verildiği — puanı bu belirliyor. */
  ipucu: number
  kazanilanPuan: number
}

/** Banka kayıtlarından organel havuzu; kayıt ipuçlarını da taşıyor. */
function bankaHavuzu(kayitlar: readonly BankaKaydi[]): OrganelSorusu[] {
  const havuz: OrganelSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'hucre') continue
    havuz.push(kayit.soru.hucre)
  }
  return havuz
}

export function HucreOyunuEkrani({
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
    ozet: TurOzeti<OrganelSorusu>,
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
  const oyun = oyunBul('hucre')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<SiradakiSoru<HucreOyunSorusu>[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<OrganelSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  /** Turun toplam puanı; doğru sayısından ayrı ilerliyor. */
  const [puan, setPuan] = useState(0)
  /** Tur nasıl bitti — tur sonu ekranı bunu ayrıca söylüyor. */
  const [elendi, setElendi] = useState<Eleme>(false)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukHucre, 'kolay')
  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)
  /**
   * Kaçıncı tur.
   *
   * Tur saatli modlarda sayacı sıfırlayan tek şey bu: soru sırası bir turun
   * ortasında da sıfır olabiliyor (`tur-sayaci.ts`).
   */
  const [turNo, setTurNo] = useState(0)

  const [sonuc, setSonuc] = useState<{
    ozet: TurOzeti<OrganelSorusu>
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
  const cevaplarRef = useRef<Cevap<OrganelSorusu>[]>([])
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
    setSorular(
      bankaTuru
        ? turHazirla(havuz).map((soru) => ({ soru, boss: false }))
        : sirayiKur(turSirasi(HUCRE_HAVUZU, 'hucre', zorluk)),
    )
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
    (verilenler: Cevap<OrganelSorusu>[], yarim = false) => {
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
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: hucredenBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
        yarim,
      )
    },
    [bankaTuru, gecerliMod, istatistik, onTurBitti, sesAcik],
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
  const sure = soruSuresi('hucre', boss ? bossZorlugu(zorluk) : null)

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
    sure,
    anahtar: sira,
    onBitti: () => sureDoldu(),
  })

  /** Şu an açık olan ipucu sayısı — cevap verilince donuyor (sayaç duruyor). */
  const acikIpucu = gorunenIpucu(toplam - kalan, toplam)

  const cevapla = (sik: HucreSikki) => {
    // Geri bildirim gösterilirken ikinci dokunuş yok sayılıyor; yoksa aynı
    // soruya iki cevap yazılırdı.
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return

    const dogruMu = sik.dogruMu
    const kazanilan = dogruMu ? ipucuPuani(acikIpucu) : 0
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu }])
    setPuan((onceki) => onceki + kazanilan)
    setGeriBildirim({
      secilen: sik.deger,
      dogruMu,
      soru: soru.soru,
      ipucu: acikIpucu,
      kazanilanPuan: kazanilan,
    })
    geriBildir(dogruMu)
    ilerle(dogruMu, boss)
  }

  /**
   * Süre dolması cevap vermemekle aynı: yanlış sayılıyor, puan yok.
   *
   * Kart dönmüyor — `secilen` null kalıyor, çevirme koşulu da buna bakıyor.
   */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu: false }])
    setGeriBildirim({
      secilen: null,
      dogruMu: false,
      soru: soru.soru,
      ipucu: IPUCU_SAYISI,
      kazanilanPuan: 0,
    })
    geriBildir(false)
    ilerle(false, boss)
    // `ilerle` ve `geriBildir` her renderda yeniden kuruluyor; sayaç yalnızca
    // güncel olanı çağırsın diye bağımlılıklar bilerek dar tutuldu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, soru, boss])

  const yardimAc = () => {
    setDuraklatilan(true)
    setYardimAcik(true)
  }

  const yardimKapat = () => {
    setDuraklatilan(false)
    setYardimAcik(false)
  }

  const dogruSayisi = cevaplar.filter((c) => c.dogruMu).length
  /** Kart yalnızca şık seçildiyse dönüyor. */
  const cevrildi = geriBildirim !== null && geriBildirim.secilen !== null

  const maskotDurumu: MaskotDurumu = geriBildirim
    ? geriBildirim.dogruMu
      ? 'kutlama'
      : 'uzgun'
    : 'calisiyor'

  return (
    <>
      <OyunKabugu
        oyunId="hucre"
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
              <div className="flex flex-1 flex-col justify-center gap-3 py-2">
                <Kart
                  soru={soru.soru}
                  acikIpucu={acikIpucu}
                  cevrildi={cevrildi}
                  dogruBilindiMi={geriBildirim?.dogruMu ?? false}
                  maskotDurumu={maskotDurumu}
                />

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
                  baslik={
                    geriBildirim.dogruMu
                      ? `Doğru! +${geriBildirim.kazanilanPuan} puan`
                      : 'Olmadı'
                  }
                  aciklama={
                    geriBildirim.dogruMu
                      ? `${geriBildirim.ipucu}. ipucunda bildin`
                      : `Doğrusu: ${geriBildirim.soru.organel}`
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
 * Dönen kart.
 *
 * İki yüz aynı kutuda duruyor ve kutu Y ekseninde dönüyor; arka yüz baştan
 * 180° çevrili çizildiği için dönme bitince düz görünüyor. `backface-hidden`
 * olmadan iki yüz üst üste okunurdu.
 *
 * Yükseklik sabit: ipuçları açıldıkça kart büyüseydi altındaki şıklar her üç
 * saniyede bir aşağı kayar, dokunmak isabetsizleşirdi.
 */
function Kart({
  soru,
  acikIpucu,
  cevrildi,
  dogruBilindiMi,
  maskotDurumu,
}: {
  soru: OrganelSorusu
  acikIpucu: number
  cevrildi: boolean
  dogruBilindiMi: boolean
  maskotDurumu: MaskotDurumu
}) {
  return (
    <div className="[perspective:1100px]">
      <div
        className={cn(
          'relative h-[210px] w-full transition-transform ease-in-out [transform-style:preserve-3d]',
          cevrildi && '[transform:rotateY(180deg)]',
        )}
        style={{ transitionDuration: `${DONME_SURESI}ms` }}
      >
        {/* Arka yüz: kartın kapalı hâli, ipuçlarını veren taraf. */}
        <div className="golge-kart absolute inset-0 flex flex-col rounded-[20px] bg-card px-4 py-3.5 [backface-visibility:hidden]">
          <div className="flex flex-none items-center gap-2">
            <Rabi durum={maskotDurumu} boyut={30} />
            <span className="font-display text-[13px] font-extrabold text-muted-foreground">
              Kartın arkasındaki organel hangisi?
            </span>
          </div>

          <ul className="mt-2.5 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto">
            {soru.ipuclari.slice(0, acikIpucu).map((ipucu, sayi) => (
              <li
                key={ipucu}
                className="flex gap-2 rounded-[13px] bg-muted/70 px-2.5 py-2 text-[12.5px] font-semibold leading-snug"
              >
                <span
                  aria-hidden
                  className="rakam mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full bg-byl-ok text-[9.5px] font-extrabold text-white"
                >
                  {sayi + 1}
                </span>
                <span className="min-w-0">{ipucu}</span>
              </li>
            ))}
          </ul>

          {/* Kalan ipucu sayısı: "beklersem bir tane daha gelir" bilgisi
              puan kararını verdiriyor, gizli kalmamalı. */}
          <p className="mt-2 flex-none text-center text-[11px] font-extrabold text-muted-foreground">
            {acikIpucu < IPUCU_SAYISI
              ? `Şimdi bilirsen ${ipucuPuani(acikIpucu)} puan · ${IPUCU_SAYISI - acikIpucu} ipucu daha var`
              : `Son ipucu · şimdi bilirsen ${ipucuPuani(acikIpucu)} puan`}
          </p>
        </div>

        {/* Ön yüz: cevap. Baştan çevrili duruyor, kart dönünce düzeliyor.
            Kart kapalıyken ekran okuyucudan da gizli: `backface-visibility`
            yalnızca göze karşı çalışıyor, metin DOM'da duruyor. */}
        <div
          aria-hidden={!cevrildi}
          className={cn(
            'golge-kart absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[20px] px-4 py-4 text-center',
            '[backface-visibility:hidden] [transform:rotateY(180deg)]',
            dogruBilindiMi ? 'bg-success text-white' : 'bg-ikincil text-white',
          )}
        >
          <span className="text-[11px] font-extrabold uppercase tracking-wider opacity-85">
            Kartın arkası
          </span>
          <b className="font-display text-[24px] font-extrabold leading-tight tracking-tight">
            {soru.organel}
          </b>
          <span className="text-[12px] font-semibold leading-snug opacity-90">
            {soru.aciklama}
          </span>
        </div>
      </div>
    </div>
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
  sik: HucreSikki
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
  sonuc: { ozet: TurOzeti<OrganelSorusu>; yeniRekor: boolean; puan: number }
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
      oyunId="hucre"
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
      bolumBasligi="Açamadığın kartlar"
      bolumAltYazisi="Görevleriyle birlikte — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.organel}-${sira}`}
              oyunId="hucre"
              soru={hucredenBanka(yanlis)}
              bildir={bildir}
            >
              <b className="block font-display text-[13.5px] font-extrabold leading-tight text-success">
                {yanlis.organel}
              </b>
              <span className="mt-0.5 block text-[11.5px] font-semibold leading-snug text-muted-foreground">
                {yanlis.ipuclari[yanlis.ipuclari.length - 1]}
              </span>
              <span className="mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
                {yanlis.aciklama}
              </span>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
