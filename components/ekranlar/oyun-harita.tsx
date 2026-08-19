'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { useSoruSayaci } from '@/lib/oyunlar/soru-sayaci'
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
  onCik,
  bildir,
}: {
  istatistik: OyunIstatistigi
  sesAcik: boolean
  bankaSorulari: BankaKaydi[]
  onTurBitti: (
    ozet: TurOzeti<HaritaSorusu>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — tur artık sabit süreli değil. */
    gecenSaniye: number,
  ) => void
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
  /** Boss'ta yanılıp elendi mi. */
  const [elendi, setElendi] = useState(false)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukHarita, 'kolay')
  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)

  const [sonuc, setSonuc] = useState<{
    ozet: TurOzeti<HaritaSorusu>
    yeniRekor: boolean
  } | null>(null)

  const havuz = useMemo(() => bankaSorulariniCoz(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<HaritaSorusu>[]>([])
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
    (verilenler: Cevap<HaritaSorusu>[]) => {
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
          soru: haritadanBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
      )
    },
    [bankaTuru, istatistik, onTurBitti, sesAcik],
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
      if (elerMi(bossMuydu, dogruMu)) {
        setElendi(true)
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

  /** Süre dolması cevap vermemekle aynı: yanlış sayılıyor, boss'ta eliyor. */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    setCevaplar((onceki) => [...onceki, { soru, dogruMu: false }])
    setGeriBildirim({ secilen: null, dogruMu: false, soru })
    geriBildir(false)
    ilerle(false, boss)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, soru, boss])

  const { kalan, toplam } = useSoruSayaci({
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

  return (
    <div className="golge-kart flex-none overflow-hidden rounded-[20px] bg-card p-1.5">
      <svg
        viewBox={`0 0 ${HARITA_GENISLIK} ${HARITA_YUKSEKLIK}`}
        className="w-full"
        role="img"
        aria-label="Türkiye haritası"
      >
        {ILLER.map((il) => (
          <path
            key={il.ad}
            d={il.yol}
            className={cn(
              'stroke-cog-koyu/50 transition-[fill] duration-200',
              boya(il),
              secilebilir && soru.tip === 'bul' && 'cursor-pointer',
            )}
            strokeWidth={1}
            onClick={secilebilir && soru.tip === 'bul' ? () => onSec(il.ad) : undefined}
          >
            <title>{il.ad}</title>
          </path>
        ))}
      </svg>
    </div>
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
        <p className="text-[12.5px] font-semibold text-muted-foreground">
          Haritada dokun — yanlış il de bir cevaptır.
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
  elendi,
  onTekrar,
  onCik,
  bildir,
}: {
  sonuc: { ozet: TurOzeti<HaritaSorusu>; yeniRekor: boolean }
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
      oyunId="harita"
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
