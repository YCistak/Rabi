'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import type { OyunIstatistigi } from '@/lib/types'
import {
  HARITA_GENISLIK,
  HARITA_YUKSEKLIK,
  ILLER,
  type Il,
} from '@/lib/oyunlar/harita-havuzu'
import { ilBul, soruKur, type HaritaSorusu } from '@/lib/oyunlar/harita'
import {
  EN_COK_OLCEK,
  gorunumBoyu,
  useHaritaYakinlastirma,
  type Yakinlastirma,
} from '@/lib/oyunlar/harita-yakinlastirma'
import {
  guncelSeri,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { haritadanBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
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

/** Cevaptan sonra doğrusunun haritada görünmesi için beklenen süre. */
const CEVAP_BEKLEMESI = 1400

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/** `secilen` süre dolduğunda `null`: oyuncu hiçbir ile dokunmadı. */
type GeriBildirim = { secilen: string | null; dogruMu: boolean; soru: HaritaSorusu }

/**
 * Banka kayıtlarından il havuzu.
 *
 * Kayıt yalnızca ilin adını saklıyor; sınırı ve zorluğu havuzdan okunuyor.
 * Havuz değişip bir il adı kaybolursa kayıt sessizce eleniyor.
 */
function bankaSorulariniCoz(kayitlar: readonly BankaKaydi[]): HaritaSorusu[] {
  const sorular: HaritaSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'harita') continue
    const il = ilBul(kayit.soru.il)
    if (!il) continue
    sorular.push({
      tip: kayit.soru.haritaTipi,
      il,
      siklar: kayit.soru.haritaTipi === 'sec' ? soruKur(il).siklar : [],
    })
  }
  return sorular
}

export function HaritaOyunuEkrani({
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
    ozet: TurOzeti<HaritaSorusu>,
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
  const oyun = oyunBul('harita')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<SiradakiSoru<HaritaSorusu>[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<HaritaSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  /** Turu ne bitirdi — tur sonu ekranı boss ile sıradan yanlışı ayrı söylüyor. */
  const [elendi, setElendi] = useState<Eleme>(false)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukHarita, 'kolay')
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
    ozet: TurOzeti<HaritaSorusu>
    yeniRekor: boolean
  } | null>(null)

  const havuz = useMemo(() => bankaSorulariniCoz(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0
  // Banka turu modu dinlemiyor; kural tek yerden okunuyor.
  const gecerliMod = etkinMod(mod, bankaTuru)

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<HaritaSorusu>[]>([])
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
        : turSirasi(ILLER, 'harita', zorluk).map(({ soru, boss }) => ({
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
    (verilenler: Cevap<HaritaSorusu>[], yarim = false) => {
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
          soru: haritadanBanka(cevap.soru),
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

  /** Boş ad pas demek: hiçbir ile dokunulmadı, cevap yanlış sayılıyor. */
  const cevapla = (secilenAd: string) => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    const dogruMu = secilenAd === soru.il.ad
    setCevaplar((onceki) => [...onceki, { soru, dogruMu }])
    setGeriBildirim({ secilen: secilenAd === '' ? null : secilenAd, dogruMu, soru })
    geriBildir(dogruMu)
    ilerle(dogruMu, boss)
  }

  /** Süre dolması cevap vermemekle aynı: yanlış sayılıyor ve turu bitiriyor. */
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
    sure: soruSuresi('harita', boss ? bossZorlugu(zorluk) : null),
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
        oyunId="harita"
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
              {/* Soru ve harita boş alanı paylaşıp ortalanıyor; cevap alanı
                  altta sabit duruyor. Haritanın en-boy oranı sabit olduğu için
                  genişlikle sınırlı — kalan dikey boşluk buraya dağıtılıyor. */}
              <div className="my-auto flex flex-col gap-3">
                <SoruMetni soru={soru} />

                  <Harita
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
                      ? `${soru.il.ad} · ${soru.il.plaka}`
                      : geriBildirim.secilen === null
                        ? `doğrusu ${soru.il.ad}`
                        : `${geriBildirim.secilen} değil — doğrusu ${soru.il.ad}`
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

/** Soru satırı — iki tipte de aynı yükseklikte, ekran zıplamasın. */
function SoruMetni({ soru }: { soru: HaritaSorusu }) {
  return (
    <div className="flex-none text-center">
      <p className="text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
        {soru.tip === 'bul' ? 'Haritada bul' : 'İşaretli il hangisi?'}
      </p>
      <p className="mt-0.5 font-display text-[22px] font-extrabold leading-tight">
        {soru.tip === 'bul' ? soru.il.ad : 'Yanıp sönen il'}
      </p>
    </div>
  )
}

/**
 * Türkiye haritası.
 *
 * Dokunma denetimini tarayıcı yapıyor: her il kendi `<path>`'i, tıklama
 * doğrudan o ile gidiyor. Elle nokta-poligon hesabı yazmaya gerek yok ve
 * sınırlar piksel piksel doğru.
 *
 * Yakınlaştırma iki parmakla, fare tekerleğiyle ya da köşedeki düğmelerle;
 * yakınken tek parmak haritayı kaydırıyor. Sürükleme il seçmiyor —
 * `secimSayilirMi()` ayrımı orada.
 */
function Harita({
  soru,
  geriBildirim,
  onSec,
  secilebilir,
}: {
  soru: HaritaSorusu
  geriBildirim: GeriBildirim | null
  onSec: (ad: string) => void
  secilebilir: boolean
}) {
  const acikta = geriBildirim !== null
  const yakinlastirma = useHaritaYakinlastirma()
  const { gorunum, olcek, svgRef, isleyiciler, secimSayilirMi, sifirla } = yakinlastirma

  /**
   * Yeni soruda ve cevap açıldığında görünüm tamamına dönüyor.
   *
   * Cevabın doğrusu haritanın öbür ucunda olabilir; yakınlaşmış bir görünümde
   * yeşil il ekran dışında kalır ve tur sonunda öğrenilecek şey kaçardı.
   */
  useEffect(() => {
    sifirla()
  }, [soru, acikta, sifirla])

  const boya = (il: Il): string => {
    // Cevaptan sonra: doğrusu yeşil, yanlış seçim kırmızı.
    if (acikta) {
      if (il.ad === soru.il.ad) return 'fill-success/70'
      if (il.ad === geriBildirim.secilen) return 'fill-ikincil/70'
      return 'fill-cog-ok/15'
    }
    // "Adını seç" sorusunda hedef il işaretli duruyor.
    if (soru.tip === 'sec' && il.ad === soru.il.ad) return 'fill-cog-koyu isaretli-il'
    return 'fill-cog-ok/15'
  }

  const secilir = secilebilir && soru.tip === 'bul'

  return (
    <div className="golge-kart relative flex-none overflow-hidden rounded-[20px] bg-card p-1.5">
      <svg
        ref={svgRef}
        viewBox={`${gorunum.x} ${gorunum.y} ${gorunum.en} ${gorunumBoyu(gorunum)}`}
        // `touch-none`: tarayıcı sayfayı kaydırmaya kalkarsa jest yarıda kalıyor.
        className="w-full touch-none select-none"
        role="img"
        aria-label="Türkiye haritası"
        {...isleyiciler}
      >
        {ILLER.map((il) => (
          <path
            key={il.ad}
            d={il.yol}
            className={cn(
              'stroke-cog-koyu/50 transition-[fill] duration-200',
              boya(il),
              secilir && 'cursor-pointer',
            )}
            // Çizgi kalınlığı ölçeğe bölünüyor: yakınlaşınca sınırlar
            // kalınlaşıp küçük illeri yutmasın.
            strokeWidth={1 / olcek}
            onClick={secilir ? () => secimSayilirMi() && onSec(il.ad) : undefined}
          >
            <title>{il.ad}</title>
          </path>
        ))}
      </svg>

      <YakinlastirmaDugmeleri yakinlastirma={yakinlastirma} />
    </div>
  )
}

/**
 * Yakınlaştırma düğmeleri.
 *
 * Parmakla sıkıştırmak asıl yol ama tek yol olmamalı: küçük ekranda iki parmak
 * haritanın yarısını kapatıyor, bazı kullanıcılar da jesti hiç denemiyor.
 * Düğmeler görünümün ortasına yakınlaştırıyor.
 */
function YakinlastirmaDugmeleri({ yakinlastirma }: { yakinlastirma: Yakinlastirma }) {
  const { olcek, yakinlas, uzaklas, sifirla } = yakinlastirma
  const uzak = olcek <= 1.001
  const yakin = olcek >= EN_COK_OLCEK - 0.001

  return (
    <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
      {!uzak && (
        <button
          type="button"
          onClick={sifirla}
          className="golge-kart rakam rounded-full bg-card/90 px-2.5 py-1 text-[11.5px] font-extrabold text-muted-foreground backdrop-blur-sm transition active:scale-95"
        >
          ×{olcek.toFixed(1)} · sıfırla
        </button>
      )}
      <DugmeKutusu etiket="Uzaklaştır" edilgin={uzak} onBas={uzaklas}>
        <Minus className="h-4 w-4" strokeWidth={3} />
      </DugmeKutusu>
      <DugmeKutusu etiket="Yakınlaştır" edilgin={yakin} onBas={yakinlas}>
        <Plus className="h-4 w-4" strokeWidth={3} />
      </DugmeKutusu>
    </div>
  )
}

function DugmeKutusu({
  etiket,
  edilgin,
  onBas,
  children,
}: {
  etiket: string
  /** Sınıra gelindi: düğme duruyor ama iş yapmıyor. */
  edilgin: boolean
  onBas: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={etiket}
      disabled={edilgin}
      onClick={onBas}
      className={cn(
        'golge-kart flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur-sm transition active:scale-95',
        edilgin && 'opacity-40',
      )}
    >
      {children}
    </button>
  )
}

/**
 * Cevap alanı.
 *
 * İki soru tipinde de aynı yükseklikte: tip her soruda değişiyor ve ekranın
 * altı zıplasaydı dokunma hedefi kayardı. "Bul" sorusunda burada şık yok,
 * yerinde ne yapılacağını söyleyen bir satır duruyor.
 */
function CevapAlani({
  soru,
  geriBildirim,
  onSec,
}: {
  soru: HaritaSorusu
  geriBildirim: GeriBildirim | null
  onSec: (ad: string) => void
}) {
  if (soru.tip === 'bul') {
    return (
      <div className="flex h-[108px] flex-none flex-col items-center justify-center gap-2.5 rounded-[18px] border-[1.5px] border-dashed border-border px-4">
        <p className="text-center text-[12.5px] font-semibold text-muted-foreground">
          Haritada dokun — yanlış il de bir cevaptır.
          <br />
          <span className="text-[11.5px]">Küçük iller için yakınlaştır.</span>
        </p>
        {/* Pas, bilmediğini kabul etmenin yolu: rastgele bir ile dokunup şansa
            bırakmaktansa geçmek hem daha dürüst hem tur sonunda doğru ders. */}
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

  return (
    <div className="grid h-[108px] flex-none grid-cols-2 gap-2">
      {soru.siklar.map((ad) => {
        const secilen = geriBildirim?.secilen === ad
        const dogru = geriBildirim !== null && ad === soru.il.ad
        return (
          <button
            key={ad}
            type="button"
            disabled={geriBildirim !== null}
            onClick={() => onSec(ad)}
            className={cn(
              'golge-kart rounded-[18px] px-2 text-[14.5px] font-extrabold transition active:scale-[0.98]',
              dogru
                ? 'bg-success text-white'
                : secilen
                  ? 'bg-ikincil text-white'
                  : 'bg-card text-foreground',
            )}
          >
            {ad}
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
  sonuc: { ozet: TurOzeti<HaritaSorusu>; yeniRekor: boolean }
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
      oyunId="harita"
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
      bolumBasligi="Bulamadıkların"
      bolumAltYazisi="Haritadaki yerleriyle — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.il.ad}-${sira}`}
              oyunId="harita"
              soru={haritadanBanka(yanlis)}
              bildir={bildir}
            >
              <div className="flex items-center gap-3">
                <KucukHarita il={yanlis.il} />
                <div className="min-w-0">
                  <b className="block font-display text-[14px] font-extrabold leading-tight">
                    {yanlis.il.ad}{' '}
                    <span className="rakam text-muted-foreground">· {yanlis.il.plaka}</span>
                  </b>
                  <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
                    {yanlis.tip === 'bul' ? 'Haritada bulamadın' : 'Adını bilemedin'}
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

/**
 * Yanlış kartındaki küçük harita.
 *
 * Adı yazmak yetmiyor — bilemediğin il, yerini gördüğünde akılda kalıyor.
 * Ülkenin tamamı soluk, o il koyu.
 */
function KucukHarita({ il }: { il: Il }) {
  return (
    <svg
      viewBox={`0 0 ${HARITA_GENISLIK} ${HARITA_YUKSEKLIK}`}
      className="h-[38px] w-[90px] flex-none"
      aria-hidden
    >
      {ILLER.map((a) => (
        <path
          key={a.ad}
          d={a.yol}
          className={a.ad === il.ad ? 'fill-cog-koyu' : 'fill-cog-ok/25'}
        />
      ))}
    </svg>
  )
}
