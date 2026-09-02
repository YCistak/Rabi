'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import type { OyunIstatistigi } from '@/lib/types'
import {
  ELEMENTLER,
  GRUP_SAYISI,
  PERIYOT_SAYISI,
  SINIF_ADI,
  hucreVarMi,
  sinifSorulurMu,
  type Element,
} from '@/lib/oyunlar/periyodik-havuzu'
import {
  dogruCevap,
  elementBul,
  soruKur,
  tipteSoruKur,
  type PeriyodikSorusu,
} from '@/lib/oyunlar/periyodik'
import {
  guncelSeri,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { periyodiktenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
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

/** Cevaptan sonra doğrusunun tabloda görünmesi için beklenen süre. */
const CEVAP_BEKLEMESI = 1400

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/** `secilen` süre dolduğunda `null`: oyuncu hiçbir şey seçmedi. */
type GeriBildirim = { secilen: string | null; dogruMu: boolean; soru: PeriyodikSorusu }

/**
 * Banka kayıtlarından element havuzu.
 *
 * Kayıt yalnızca sembolü ve soru tipini saklıyor; adı, yeri ve ailesi havuzdan
 * okunuyor. Havuz değişip bir sembol kaybolursa kayıt sessizce eleniyor.
 */
function bankaSorulariniCoz(kayitlar: readonly BankaKaydi[]): PeriyodikSorusu[] {
  const sorular: PeriyodikSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'periyodik') continue
    const element = elementBul(kayit.soru.sembol)
    if (!element) continue
    const tip = kayit.soru.periyodikTipi
    // Sınıfı sorulamayan bir element için sınıf kaydı ancak havuz değişmişse
    // olabilir; cevabı belirsiz bir soruyu tekrar sormaktansa eleniyor.
    if (tip === 'sinif' && !sinifSorulurMu(element)) continue
    sorular.push(tipteSoruKur(element, tip))
  }
  return sorular
}

export function PeriyodikOyunuEkrani({
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
  bankaSorulari: BankaKaydi[]
  onTurBitti: (
    ozet: TurOzeti<PeriyodikSorusu>,
    bankaCevaplari: BankaCevabi[],
    gecenSaniye: number,
    yarim: boolean,
  ) => void
  mod: OyunModu
  setMod: (mod: OyunModu) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('periyodik')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<SiradakiSoru<PeriyodikSorusu>[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<PeriyodikSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  const [elendi, setElendi] = useState<Eleme>(false)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukPeriyodik, 'kolay')
  const [duraklatilan, setDuraklatilan] = useState(false)
  const [turNo, setTurNo] = useState(0)

  const [sonuc, setSonuc] = useState<{
    ozet: TurOzeti<PeriyodikSorusu>
    yeniRekor: boolean
  } | null>(null)

  const havuz = useMemo(() => bankaSorulariniCoz(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0
  // Banka turu modu dinlemiyor; kural tek yerden okunuyor.
  const gecerliMod = etkinMod(mod, bankaTuru)

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<PeriyodikSorusu>[]>([])
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
        ? havuz.map((soru) => ({ soru, boss: false }))
        : turSirasi(ELEMENTLER, 'periyodik', zorluk).map(({ soru, boss }) => ({
            soru: soruKur(soru),
            boss,
          })),
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
    (verilenler: Cevap<PeriyodikSorusu>[], yarim = false) => {
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
          soru: periyodiktenBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
        yarim,
      )
    },
    [bankaTuru, gecerliMod, istatistik, onTurBitti, sesAcik],
  )

  // Havuz tükenirse tur biter — banka turunda sık oluyor.
  useEffect(() => {
    if (asama !== 'oynaniyor' || sorular.length === 0) return
    if (sira >= sorular.length) turBitir(cevaplarRef.current)
  }, [asama, sira, sorular.length, turBitir])

  useEffect(() => () => {
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
  }, [])

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

  /** Boş seçim pas demek: hiçbir şeye dokunulmadı, cevap yanlış sayılıyor. */
  const cevapla = (secilen: string) => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    const dogruMu = secilen === dogruCevap(soru)
    setCevaplar((onceki) => [...onceki, { soru, dogruMu }])
    setGeriBildirim({ secilen: secilen === '' ? null : secilen, dogruMu, soru })
    geriBildir(dogruMu)
    ilerle(dogruMu, boss)
  }

  /** Süre dolması cevap vermemekle aynı: yanlış sayılıyor. */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    setCevaplar((onceki) => [...onceki, { soru, dogruMu: false }])
    setGeriBildirim({ secilen: null, dogruMu: false, soru })
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
    Çıkış turu bitiriyor — her modda. Doğrudan çıkılsaydı o turda yanlış
    bilinen sorular Oyun Bankası'na hiç düşmezdi.
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
    sure: soruSuresi('periyodik', boss ? bossZorlugu(zorluk) : null),
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
        oyunId="periyodik"
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
            <div className="flex flex-1 flex-col gap-3 py-2">
              {/* Soru ve tablo boş alanı paylaşıp ortalanıyor; cevap alanı
                  altta sabit duruyor. */}
              <div className="my-auto flex flex-col gap-3">
                <SoruMetni soru={soru} />

                <Tablo
                  soru={soru}
                  geriBildirim={geriBildirim}
                  onSec={cevapla}
                  secilebilir={geriBildirim === null}
                />
              </div>

              <CevapAlani soru={soru} geriBildirim={geriBildirim} onSec={cevapla} />

              {geriBildirim && (
                <Bildirim
                  iyi={geriBildirim.dogruMu}
                  baslik={geriBildirim.dogruMu ? 'Doğru!' : 'Olmadı'}
                  aciklama={
                    geriBildirim.dogruMu
                      ? `${soru.element.ad} · ${soru.element.grup}. grup, ${soru.element.periyot}. periyot`
                      : geriBildirim.secilen === null
                        ? `doğrusu ${dogruCevap(soru)}`
                        : `${geriBildirim.secilen} değil — doğrusu ${dogruCevap(soru)}`
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

/** Soru satırı — üç tipte de aynı yükseklikte, ekran zıplamasın. */
function SoruMetni({ soru }: { soru: PeriyodikSorusu }) {
  const ustYazi =
    soru.tip === 'bul'
      ? 'Tabloda bul'
      : soru.tip === 'sec'
        ? 'İşaretli element hangisi?'
        : 'İşaretli element hangi ailede?'

  return (
    <div className="flex-none text-center">
      <p className="text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
        {ustYazi}
      </p>
      <p className="mt-0.5 font-display text-[22px] font-extrabold leading-tight">
        {soru.tip === 'bul' ? soru.element.ad : 'Yanıp sönen hücre'}
      </p>
    </div>
  )
}

/** Havuzdaki elementler grup–periyot kesişimine göre; arama her çizimde olmasın. */
const YERLESIM = new Map<string, Element>(
  ELEMENTLER.map((e) => [`${e.grup}:${e.periyot}`, e]),
)

/**
 * Periyodik tablo.
 *
 * Harita Avı'ndan iki yerde ayrılıyor. Birincisi yakınlaştırma yok: harita
 * yüzlerce noktalı çokgenlerden kurulu ve Yalova altı piksel kalıyordu, burada
 * her hücre aynı boyda ve on sekiz sütun 375 piksellik ekrana sığıyor.
 * İkincisi tablo **eksik yazılı**: yalnızca havuzdaki elementlerin sembolü
 * duruyor, geri kalan hücreler boş kutu (`periyodik-havuzu.ts`). Boş kutular
 * süs değil — tablonun şeklini, yani grupların nerede başlayıp bittiğini
 * onlar anlatıyor.
 *
 * Izgara Tailwind sınıfıyla değil satır içi ölçüyle kuruluyor: on sekiz
 * sütunluk bir `grid-cols-*` sınıfı taramadan düşerse tablo tek sütuna iner ve
 * oyun ekranda hiç olmaz.
 */
function Tablo({
  soru,
  geriBildirim,
  onSec,
  secilebilir,
}: {
  soru: PeriyodikSorusu
  geriBildirim: GeriBildirim | null
  onSec: (ad: string) => void
  secilebilir: boolean
}) {

  const secilir = secilebilir && soru.tip === 'bul'

  const hucreler = []
  for (let periyot = 1; periyot <= PERIYOT_SAYISI; periyot++) {
    for (let grup = 1; grup <= GRUP_SAYISI; grup++) {
      const anahtar = `${grup}:${periyot}`
      if (!hucreVarMi(grup, periyot)) {
        hucreler.push(<span key={anahtar} aria-hidden />)
        continue
      }

      const element = YERLESIM.get(anahtar)
      if (!element) {
        // Havuzda olmayan hücre: tablonun şeklini taşıyor, soru olmuyor.
        hucreler.push(
          <span
            key={anahtar}
            aria-hidden
            className="aspect-square rounded-[3px] bg-edb-ok/12"
          />,
        )
        continue
      }

      hucreler.push(
        <ElementHucresi
          key={anahtar}
          element={element}
          soru={soru}
          geriBildirim={geriBildirim}
          secilir={secilir}
          onSec={onSec}
        />,
      )
    }
  }

  return (
    <div className="golge-kart flex-none overflow-hidden rounded-[20px] bg-card p-2">
      <div
        role="group"
        aria-label="Periyodik tablo"
        className="grid gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${GRUP_SAYISI}, minmax(0, 1fr))` }}
      >
        {hucreler}
      </div>
    </div>
  )
}

function ElementHucresi({
  element,
  soru,
  geriBildirim,
  secilir,
  onSec,
}: {
  element: Element
  soru: PeriyodikSorusu
  geriBildirim: GeriBildirim | null
  secilir: boolean
  onSec: (ad: string) => void
}) {
  const hedef = element.sembol === soru.element.sembol
  const acikta = geriBildirim !== null

  // Cevaptan sonra: doğrusu yeşil, yanlış dokunulan kırmızı. Yanlış dokunuş
  // yalnızca "bul" sorusunda tabloda oluyor; ötekilerde şıkta.
  const boya = acikta
    ? hedef
      ? 'bg-success text-white'
      : geriBildirim.secilen === element.ad
        ? 'bg-ikincil text-white'
        : 'bg-edb-kart text-edb-koyu'
    : // "Adını seç" ve "ailesi hangisi" sorularında hedef hücre işaretli.
      soru.tip !== 'bul' && hedef
      ? 'bg-edb-koyu text-white isaretli-il'
      : 'bg-edb-kart text-edb-koyu'

  const ortak = cn(
    'flex aspect-square items-center justify-center rounded-[3px] text-[8px] font-extrabold leading-none transition-colors',
    boya,
  )

  if (!secilir) {
    return (
      <span className={ortak} title={element.ad}>
        {element.sembol}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onSec(element.ad)}
      className={cn(ortak, 'cursor-pointer')}
      aria-label={element.ad}
    >
      {element.sembol}
    </button>
  )
}

/**
 * Cevap alanı.
 *
 * Üç soru tipinde de aynı yükseklikte: tip her soruda değişiyor ve ekranın
 * altı zıplasaydı dokunma hedefi kayardı. "Bul" sorusunda burada şık yok,
 * yerinde ne yapılacağını söyleyen bir satır duruyor.
 */
function CevapAlani({
  soru,
  geriBildirim,
  onSec,
}: {
  soru: PeriyodikSorusu
  geriBildirim: GeriBildirim | null
  onSec: (deger: string) => void
}) {
  if (soru.tip === 'bul') {
    return (
      <div className="flex h-[108px] flex-none flex-col items-center justify-center gap-2.5 rounded-[18px] border-[1.5px] border-dashed border-border px-4">
        <p className="text-center text-[12.5px] font-semibold text-muted-foreground">
          Tabloda dokun — yanlış hücre de bir cevaptır.
          <br />
          <span className="text-[11.5px]">Boş kutularda element yok.</span>
        </p>
        {/* Pas, bilmediğini kabul etmenin yolu: rastgele bir hücreye dokunup
            şansa bırakmaktansa geçmek hem daha dürüst hem tur sonunda doğru
            ders. */}
        <button
          type="button"
          disabled={geriBildirim !== null}
          onClick={() => onSec('')}
          className="rounded-lg px-3 py-1.5 text-[12.5px] font-extrabold text-muted-foreground transition active:bg-foreground/10 disabled:opacity-45"
        >
          Bilmiyorum, pas geç
        </button>
      </div>
    )
  }

  const dogru = dogruCevap(soru)

  return (
    <div className="grid h-[108px] flex-none grid-cols-2 gap-2">
      {soru.siklar.map((deger) => {
        const secilen = geriBildirim?.secilen === deger
        const dogruMu = geriBildirim !== null && deger === dogru
        return (
          <button
            key={deger}
            type="button"
            disabled={geriBildirim !== null}
            onClick={() => onSec(deger)}
            className={cn(
              'golge-kart rounded-[18px] px-2 text-[13.5px] font-extrabold transition active:scale-[0.98]',
              dogruMu
                ? 'bg-success text-white'
                : secilen
                  ? 'bg-ikincil text-white'
                  : 'bg-card text-foreground',
            )}
          >
            {deger}
          </button>
        )
      })}
    </div>
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
  sonuc: { ozet: TurOzeti<PeriyodikSorusu>; yeniRekor: boolean }
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
      oyunId="periyodik"
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
      bolumBasligi="Bilemediklerin"
      bolumAltYazisi="Tablodaki yerleri ve aileleriyle."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.element.sembol}-${yanlis.tip}-${sira}`}
              oyunId="periyodik"
              soru={periyodiktenBanka(yanlis)}
              bildir={bildir}
            >
              <div className="flex items-center gap-3">
                {/* Sembol kutusu: bilemediğin element, tabloda göründüğü
                    biçimiyle akılda kalıyor. */}
                <span className="grid size-10 flex-none place-items-center rounded-[10px] bg-edb-kart text-[15px] font-extrabold text-edb-koyu">
                  {yanlis.element.sembol}
                </span>
                <div className="min-w-0">
                  <b className="block font-display text-[14px] font-extrabold leading-tight">
                    {yanlis.element.ad}{' '}
                    <span className="rakam text-muted-foreground">
                      · {yanlis.element.numara}
                    </span>
                  </b>
                  <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
                    {yanlis.element.grup}. grup · {yanlis.element.periyot}. periyot ·{' '}
                    {SINIF_ADI[yanlis.element.sinif]}
                  </span>
                </div>
              </div>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
