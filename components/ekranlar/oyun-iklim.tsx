'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, X } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import { DUNYA, DUNYA_GENISLIK, DUNYA_YUKSEKLIK, noktayaCevir } from '@/lib/oyunlar/dunya-havuzu'
import { IKLIM_ADI, IKLIM_HAVUZU, type IklimSorusu } from '@/lib/oyunlar/iklim-havuzu'
import {
  ENLEM_CIZGILERI,
  iklimBul,
  isaretNoktasi,
  siklariKur,
  soruUlkesi,
  turHazirla,
  type IklimOyunSorusu,
  type IklimSikki,
} from '@/lib/oyunlar/iklim'
import {
  guncelSeri,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { iklimdenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
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
 * İklim Kuşakları.
 *
 * Ekranın iki yarısı var: üstte dünya haritası (işaretli bölge ve enlem
 * çizgileriyle), altta dört şık. Harita süs değil sorunun yarısı — iklim
 * tiplerinin çoğu enlemden okunuyor ve öğrencinin kurması gereken bağ
 * "bu bölge hangi kuşakta".
 */

/** Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms). */
const CEVAP_BEKLEMESI = 1500

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/** `secilen` süre dolduğunda `null`: oyuncu bir şık işaretlemedi. */
type GeriBildirim = { secilen: string | null; dogruMu: boolean; soru: IklimSorusu }

/**
 * `ritim.ts`'in kurduğu sıraya şıkları ekler.
 *
 * Sıra korunmalı: boss soruları belirli konumlara yerleştirilmiş durumda,
 * `turHazirla` varsayılan hâlinde yeniden karıştırıp o yerleşimi bozardı.
 */
function sirayiKur(sira: SiradakiSoru<IklimSorusu>[]): SiradakiSoru<IklimOyunSorusu>[] {
  const sorular = turHazirla(
    sira.map((s) => s.soru),
    Math.random,
    false,
  )
  return sorular.map((soru, i) => ({ soru, boss: sira[i].boss }))
}

/**
 * Banka kayıtlarından soru havuzu.
 *
 * Kayıt yalnızca bölgenin adını saklıyor; iklimi, haritadaki yeri ve
 * açıklaması havuzdan okunuyor. Havuz değişip bir ad kaybolursa kayıt sessizce
 * eleniyor.
 */
function bankaHavuzu(kayitlar: readonly BankaKaydi[]): IklimSorusu[] {
  const havuz: IklimSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'iklim') continue
    const soru = iklimBul(kayit.soru.bolge)
    if (soru) havuz.push(soru)
  }
  return havuz
}

export function IklimOyunuEkrani({
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
    ozet: TurOzeti<IklimSorusu>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — modlar arasında değişiyor. */
    gecenSaniye: number,
    /** Tur bitmeden çıkıldı mı — yarım tur rekora ve istatistiğe yazılmıyor. */
    yarim: boolean,
  ) => void
  mod: OyunModu
  setMod: (mod: OyunModu) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('iklim')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<SiradakiSoru<IklimOyunSorusu>[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<IklimSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  const [elendi, setElendi] = useState<Eleme>(false)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukIklim, 'kolay')
  const [duraklatilan, setDuraklatilan] = useState(false)
  const [turNo, setTurNo] = useState(0)

  const [sonuc, setSonuc] = useState<{
    ozet: TurOzeti<IklimSorusu>
    yeniRekor: boolean
  } | null>(null)

  const havuz = useMemo(() => bankaHavuzu(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0
  const gecerliMod = etkinMod(mod, bankaTuru)

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<IklimSorusu>[]>([])
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
      bankaTuru
        ? turHazirla(havuz).map((soru) => ({ soru, boss: false }))
        : sirayiKur(turSirasi(IKLIM_HAVUZU, 'iklim', zorluk)),
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
    (verilenler: Cevap<IklimSorusu>[], yarim = false) => {
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
          soru: iklimdenBanka(cevap.soru),
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

  const cevapla = (sik: IklimSikki) => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    const dogruMu = sik.dogruMu
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu }])
    setGeriBildirim({ secilen: sik.metin, dogruMu, soru: soru.soru })
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
    sure: soruSuresi('iklim', boss ? bossZorlugu(zorluk) : null),
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
        oyunId="iklim"
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
            <div className="flex flex-1 flex-col justify-center gap-3 py-2">
              {/* Soru, harita ve şıklar tek bir öbek olarak ortalanıyor:
                  dünya haritası basık (en-boy 2,6) ve üçü ayrı ayrı
                  yaslandığında aralarında iki avuç boşluk kalıyordu. */}
              <div className="flex flex-col gap-3">
                <div className="flex-none text-center">
                  <p className="text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                    İşaretli bölgede hangi iklim görülür?
                  </p>
                  <p className="mt-0.5 font-display text-[21px] font-extrabold leading-tight">
                    {soru.soru.ad}
                  </p>
                </div>

                <DunyaHaritasi soru={soru.soru} />
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
                      ? geriBildirim.soru.aciklama
                      : `Doğrusu: ${IKLIM_ADI[geriBildirim.soru.iklim]}`
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
 * Dünya haritası.
 *
 * Yakınlaştırma yok (Harita Avı'ndan ayrıldığı yer burası): orada oyuncu
 * haritada bir yere **dokunuyor** ve küçük illeri seçebilmesi gerekiyor,
 * burada haritaya yalnızca bakılıyor. İşaretli yeri halka gösteriyor, ülke
 * sınırı da boyalı; ikisi birden olduğu için Hollanda kadar küçük bir ülke de
 * kayboluyor değil.
 *
 * Enlem çizgileri sorunun yarısı: iklim tiplerinin çoğu enlemden okunuyor.
 * Ekvator kalın, dönenceler ile kutup dairesi kesikli.
 */
function DunyaHaritasi({ soru }: { soru: IklimSorusu }) {
  const ulke = soruUlkesi(soru)
  const [isaretX, isaretY] = isaretNoktasi(soru)

  return (
    <div className="golge-kart flex-none overflow-hidden rounded-[20px] bg-card p-1.5">
      <svg
        viewBox={`0 0 ${DUNYA_GENISLIK} ${DUNYA_YUKSEKLIK}`}
        className="w-full select-none"
        role="img"
        aria-label={`Dünya haritası, ${soru.ad} işaretli`}
      >
        {/* Okyanus. Mavisi tarih dersinin renk ailesinden (`trh`): kural
            "renk derse ait" ama burada renk kimlik değil harita göstergesi ve
            coğrafyanın yeşiline boyanmış bir okyanus karadan ayırt
            edilemiyordu. */}
        <rect width={DUNYA_GENISLIK} height={DUNYA_YUKSEKLIK} className="fill-trh-ok/25" />

        {DUNYA.map((u) => (
          <path
            key={u.kod}
            d={u.yol}
            className={cn(
              'stroke-cog-koyu/40',
              ulke && u.kod === ulke.kod ? 'fill-cog-koyu' : 'fill-cog-ok/40',
            )}
            strokeWidth={0.6}
          />
        ))}

        {ENLEM_CIZGILERI.map(({ enlem, ad }) => {
          const y = noktayaCevir(0, enlem)[1]
          const ekvator = enlem === 0
          return (
            <line
              key={ad}
              x1={0}
              y1={y}
              x2={DUNYA_GENISLIK}
              y2={y}
              className="stroke-primary/45"
              strokeWidth={ekvator ? 2.2 : 1.4}
              strokeDasharray={ekvator ? undefined : '9 8'}
            >
              <title>{ad}</title>
            </line>
          )
        })}

        {/* Halka ülkenin de üstünde: bölge soruları (Sahra, Amazon) bir ülkeye
            ait değil, yeri yalnızca burası gösteriyor. */}
        <circle
          cx={isaretX}
          cy={isaretY}
          r={26}
          className="fill-none stroke-ikincil"
          strokeWidth={5}
        />
        <circle cx={isaretX} cy={isaretY} r={5} className="fill-ikincil" />
      </svg>

      {/* Çizgilerin ne olduğu haritanın içine yazılamıyor: 1000 birimlik
          kutuda okunabilir bir yazı ülkelerin yarısını kapatıyor. */}
      <p className="px-1.5 pb-0.5 pt-1 text-center text-[10px] font-bold leading-tight text-muted-foreground">
        Düz çizgi Ekvator · kesikliler dönenceler ve Kuzey Kutup Dairesi
      </p>
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
  sik: IklimSikki
  geriBildirim: GeriBildirim | null
  onSec: () => void
}) {
  const acikta = geriBildirim !== null
  const secilen = acikta && geriBildirim.secilen === sik.metin
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
  sonuc: { ozet: TurOzeti<IklimSorusu>; yeniRekor: boolean }
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
      oyunId="iklim"
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
      bolumBasligi="Karıştırdığın bölgeler"
      bolumAltYazisi="Açıklamasıyla birlikte — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.ad}-${sira}`}
              oyunId="iklim"
              soru={iklimdenBanka(yanlis)}
              bildir={bildir}
            >
              <b className="block font-display text-[13.5px] font-extrabold leading-tight">
                {yanlis.ad}
              </b>
              <span className="mt-1 block text-[12px] font-extrabold text-success">
                {IKLIM_ADI[yanlis.iklim]}
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
