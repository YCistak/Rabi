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
  guncelSeri,
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
import {
  bossYerlestir,
  bossZorlugu,
  elerMi,
  soruSuresi,
  zorluktaSuz,
  type SiradakiSoru,
  type Zorluk,
} from '@/lib/oyunlar/ritim'
import { etkinMod, modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { useTurSayaci } from '@/lib/oyunlar/tur-sayaci'
import { ZorlukSecimi } from '@/components/zorluk-secimi'
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
  type Eleme,
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

/** `secilenMetin` süre dolduğunda `null`: oyuncu bir şık işaretlemedi. */
type GeriBildirim = { secilenMetin: string | null; dogruMu: boolean; icerik: SoruIcerigi }

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
        // Banka turunda zorluk seçilmiyor, boss da gelmiyor.
        zorluk: 'orta',
      })
    } else {
      yazim.push({
        dogru: kayit.soru.dogru,
        yanlis: kayit.soru.yanlis,
        kural: kayit.soru.kural as YazimKurali,
        // Banka turunda zorluk seçilmiyor, boss da gelmiyor.
        zorluk: 'orta',
      })
    }
  }

  return { yazim, noktalama }
}

/** Seçili türlerin havuzunu tek bir zorluğa indirir. */
function zorluktaHavuz(secili: readonly SoruTuru[], zorluk: Zorluk): Havuzlar {
  const tumu = havuzlariSec(secili)
  return {
    yazim: zorluktaSuz(tumu.yazim, zorluk),
    noktalama: zorluktaSuz(tumu.noktalama, zorluk),
  }
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
  mod,
  setMod,
  onCik,
  bildir,
}: {
  istatistik: OyunIstatistigi
  /** Ses efektleri açık mı (Ayarlar → Mini oyun sesleri). */
  sesAcik: boolean
  /** Boş değilse tur yalnızca bu sorularla kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (
    ozet: TurOzeti<SoruIcerigi>,
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
  const oyun = oyunBul('yazim')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  // Seçim kalıcı: her turda aynı çipleri yeniden işaretlemek, oyunu açıp hemen
  // başlamanın önüne geçerdi. (Zihinden İşlem'deki tür seçimiyle aynı yaklaşım.)
  const [secili, setSecili] = useYerelDepo<SoruTuru[]>(
    ANAHTARLAR.yazimSecimi,
    TUM_SORU_TURLERI,
  )

  const [sorular, setSorular] = useState<SiradakiSoru<OyunSorusu>[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<SoruIcerigi>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  /** Turu ne bitirdi — tur sonu ekranı boss ile sıradan yanlışı ayrı söylüyor. */
  const [elendi, setElendi] = useState<Eleme>(false)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukYazim, 'kolay')
  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)
  /**
   * Kaçıncı tur.
   *
   * Tur saatli modlarda sayacı sıfırlayan tek şey bu: soru sırası bir turun
   * ortasında da sıfır olabiliyor (`tur-sayaci.ts`).
   */
  const [turNo, setTurNo] = useState(0)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<SoruIcerigi>; yeniRekor: boolean } | null>(
    null,
  )

  /** Banka turunda havuz bankadaki kayıtlar; normal turda oyunun kendi havuzu. */
  const bankaHavuzu = useMemo(() => bankaHavuzlari(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.yazim.length + bankaHavuzu.noktalama.length > 0
  // Banka turu modu dinlemiyor; kural tek yerden okunuyor.
  const gecerliMod = etkinMod(mod, bankaTuru)

  // Tur başındaki rekor: sonuç ekranı "yeni rekor" derken güncellenmiş değerle
  // değil, tura girerken geçerli olan değerle karşılaştırmalı.
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
    setTurNo((n) => n + 1)
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    // Banka turunda zorluk ve boss yok: sorular kullanıcının kendi yanlışları.
    // Normal turda iki havuz da zorluğa göre süzülüyor; boss sırası bir üst
    // seviyeden ayrıca kuruluyor ve `bossYerlestir` ikisini tek sıraya örüyor.
    setSorular(
      bankaTuru
        ? turHazirla(bankaHavuzu).map((soru) => ({ soru, boss: false }))
        : bossYerlestir(
            turHazirla(zorluktaHavuz(secili, zorluk)),
            turHazirla(zorluktaHavuz(secili, bossZorlugu(zorluk).zorluk)),
            'yazim',
          ),
    )
    setSira(0)
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setElendi(false)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [bankaHavuzu, bankaTuru, istatistik.enIyiDogru, secili, zorluk])

  const turBitir = useCallback(
    (verilenler: Cevap<SoruIcerigi>[], yarim = false) => {
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
      // Doğrular da bildiriliyor ama bankayı ilerletmiyor: kayıt yalnızca
      // Oyun Bankası’ndaki genel testte doğru bilinince düşüyor (`banka.ts`).
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: bankayaCevir(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
        yarim,
      )
    },
    [bankaTuru, gecerliMod, istatistik, onTurBitti, sesAcik],
  )

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

  const sirali = sorular[sira]
  const soru = sirali?.soru
  const boss = sirali?.boss ?? false

  /** Ekrandaki soruyu bankanın ve tur özetinin anladığı biçime çevirir. */
  const icerikAl = (s: OyunSorusu): SoruIcerigi =>
    s.tur === 'yazim' ? { tur: 'yazim', soru: s.soru } : { tur: 'noktalama', soru: s.soru }

  /**
   * Cevaptan sonraki geçiş.
   *
   * Yanlış cevap turu bitiriyor (banka turu hariç); boss'un farkı sorunun bir
   * üst zorluktan gelmesi. Bekleme süresi ikisinde de aynı: doğrusunu okumadan
   * ekranın değişmesi, elenirken bile öğretmeyi bırakmak olurdu.
   */
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

  const cevapla = (sik: Sik) => {
    // Geri bildirim gösterilirken ikinci dokunuş yok sayılıyor.
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return

    const dogruMu = sik.dogruMu
    const icerik = icerikAl(soru)
    setCevaplar((onceki) => [...onceki, { soru: icerik, dogruMu }])
    setGeriBildirim({ secilenMetin: sik.metin, dogruMu, icerik })
    geriBildir(dogruMu)
    ilerle(dogruMu, boss)
  }

  /** Süre dolması cevap vermemekle aynı: yanlış sayılıyor ve turu bitiriyor. */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    const icerik = icerikAl(soru)
    setCevaplar((onceki) => [...onceki, { soru: icerik, dogruMu: false }])
    setGeriBildirim({ secilenMetin: null, dogruMu: false, icerik })
    geriBildir(false)
    ilerle(false, boss)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, soru, boss])

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
    sure: soruSuresi('yazim', boss ? bossZorlugu(zorluk) : null),
    anahtar: sira,
    onBitti: sureDoldu,
  })

  const turDegistir = (tur: SoruTuru) => {
    setSecili((onceki) => {
      const varMi = onceki.includes(tur)
      if (varMi && onceki.length === 1) return onceki
      return varMi ? onceki.filter((t) => t !== tur) : [...onceki, tur]
    })
  }

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
        oyunId="yazim"
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
        mod={mod}
        setMod={bankaTuru ? null : setMod}
        onBasla={turBaslat}
        onKapat={asama === 'tanitim' ? onCik : yardimKapat}
        // Banka turunda tür seçimi gösterilmiyor: sorular bankadan geliyor,
        // seçim onları değiştirmiyor.
        ekstra={
          asama === 'tanitim' && !bankaTuru ? (
            <div className="flex flex-col gap-4">
              <ZorlukSecimi secili={zorluk} onSec={setZorluk} bossVar />
              <TurSecimi secili={secili} onDegis={turDegistir} />
            </div>
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
  mod,
  elendi,
  onTekrar,
  onCik,
  bildir,
}: {
  sonuc: { ozet: TurOzeti<SoruIcerigi>; yeniRekor: boolean }
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
      oyunId="yazim"
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
