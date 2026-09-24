'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, X } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import {
  bankaTuruHazirla,
  sekliVarMi,
  sorulanAd,
  trigAciklamasi,
  trigCevabi,
  trigKimligi,
  trigMetni,
  trigSekli,
  trigTuruHazirla,
  verilenDeger,
  type TrigOyunSorusu,
  type TrigSikki,
  type TrigSorusu,
} from '@/lib/oyunlar/trigonometri'
import {
  guncelSeri,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { trigdenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import {
  TUR_SORU_SINIRI,
  akisUret,
  akisUzunlugu,
  elerMi,
  soruSuresi,
  tekAkis,
  type SoruAkisi,
} from '@/lib/oyunlar/ritim'
import { modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { useTurSayaci } from '@/lib/oyunlar/tur-sayaci'
import { useEtkinMod, useUyarlananZorluk } from '@/components/tur-ayari-baglami'
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
import { OyunSekli } from '@/components/oyun-sekil'
import { OyunTanitim } from '@/components/oyun-tanitim'
import { KesirYazisi } from '@/components/kesir-yazisi'

/**
 * Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms).
 *
 * Yanlışın arkasından sonucun nereden geldiğini söyleyen bir cümle geliyor
 * ("sin α = karşı / hipotenüs = 6/10 = 3/5") ve asıl öğrenme orada; bir
 * saniyede okunmuyor. Sayaç geri bildirim sürerken durduğu için bekleme
 * turdan süre yemiyor — Tepkime Türü'nün kuralı.
 */
const CEVAP_BEKLEMESI = { dogru: 1200, yanlis: 2600 } as const

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/** `secilen` süre dolduğunda `null`: oyuncu bir şık işaretlemedi. */
type GeriBildirim = { secilen: string | null; dogruMu: boolean; soru: TrigSorusu }

function bankaHavuzu(kayitlar: readonly BankaKaydi[]): TrigSorusu[] {
  const havuz: TrigSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun === 'trigonometri') havuz.push(kayit.soru.trig)
  }
  return havuz
}

/**
 * Trigonometrik Oranlar — Geometri Ustası'nın 10. sınıf oyunu.
 *
 * Sorular havuzdan değil üretilerek geliyor (`lib/oyunlar/trigonometri.ts`)
 * ve zorluk soru biçimini seçiyor: kolayda tanım, ortada eksik kenar ve özel
 * açılar, zorda şekilsiz dönüşüm ile tümler açı. Seviye turun içinde kayıyor
 * (`uyum.ts`).
 */
export function TrigonometriOyunuEkrani({
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
    ozet: TurOzeti<TrigSorusu>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — modlar arasında değişiyor. */
    gecenSaniye: number,
    /** Tur bitmeden çıkıldı mı — yarım tur rekora ve istatistiğe yazılmıyor. */
    yarim: boolean,
  ) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('trigonometri')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<SoruAkisi<TrigOyunSorusu>>(tekAkis([]))
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<TrigSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  /** Turu ne bitirdi — tur sonu ekranı süreyi ve yanlışı ayrı söylüyor. */
  const [elendi, setElendi] = useState<Eleme>(false)

  const { zorluk, kaydet: zorlukKaydet, sifirla: zorluguSifirla } = useUyarlananZorluk()
  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)
  /** Kaçıncı tur — tur saatli modlarda sayacı sıfırlayan tek şey (`tur-sayaci.ts`). */
  const [turNo, setTurNo] = useState(0)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<TrigSorusu>; yeniRekor: boolean } | null>(
    null,
  )

  const havuz = useMemo(() => bankaHavuzu(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0
  // Seçilen mod (tanıtımın ayar adımı); banka turu seçimi dinlemiyor.
  const gecerliMod = useEtkinMod(bankaTuru)

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<TrigSorusu>[]>([])
  cevaplarRef.current = cevaplar
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    setTurNo((n) => n + 1)
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    // Banka turunda zorluk yok: sorular kullanıcının kendi yanlışları, hepsi
    // bir kez sorulup tur bitiyor.
    setSorular(
      bankaTuru
        ? tekAkis(bankaTuruHazirla(havuz))
        : akisUret((seviye) => trigTuruHazirla(TUR_SORU_SINIRI, seviye)),
    )
    zorluguSifirla()
    setSira(0)
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setElendi(false)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [bankaTuru, havuz, istatistik.enIyiDogru, zorluguSifirla])

  const turBitir = useCallback(
    (verilenler: Cevap<TrigSorusu>[], yarim = false) => {
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
      // Oyun Bankası'ndaki genel testte doğru bilinince düşüyor (`banka.ts`).
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({ soru: trigdenBanka(cevap.soru), dogruMu: cevap.dogruMu })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
        yarim,
      )
    },
    [bankaTuru, gecerliMod, istatistik, onTurBitti, sesAcik],
  )

  // Şerit tükenirse tur biter — banka turunda ve soru sınırına varılınca.
  useEffect(() => {
    const uzunluk = akisUzunlugu(sorular)
    if (asama !== 'oynaniyor' || uzunluk === 0) return
    if (sira >= uzunluk) turBitir(cevaplarRef.current)
  }, [asama, sira, sorular, turBitir])

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

  const soru = sorular[zorluk][sira]

  const ilerle = (dogruMu: boolean) => {
    zamanlayiciRef.current = setTimeout(() => {
      setGeriBildirim(null)
      // Zorluk **ilerlerken** güncelleniyor, cevap verilirken değil: ekrandaki
      // soru `sorular[zorluk][sira]` ile okunuyor ve geri bildirim okunurken
      // değişmemeli.
      zorlukKaydet(dogruMu)
      if (elerMi(dogruMu, bankaTuru, gecerliMod)) {
        setElendi('yanlis')
        turBitir(cevaplarRef.current)
      } else {
        setSira((s) => s + 1)
      }
    }, CEVAP_BEKLEMESI[dogruMu ? 'dogru' : 'yanlis'])
  }

  const cevapla = (sik: TrigSikki) => {
    // Geri bildirim gösterilirken ikinci dokunuş yok sayılıyor; yoksa aynı
    // soruya iki cevap yazılırdı.
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return

    const dogruMu = sik.dogruMu
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu }])
    setGeriBildirim({ secilen: sik.deger, dogruMu, soru: soru.soru })
    geriBildir(dogruMu)
    ilerle(dogruMu)
  }

  /** Süre dolması cevap vermemekle aynı: yanlış sayılıyor. */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu: false }])
    setGeriBildirim({ secilen: null, dogruMu: false, soru: soru.soru })
    geriBildir(false)
    ilerle(false)
    // `ilerle` ve `geriBildir` her renderda yeniden kuruluyor; sayaç yalnızca
    // güncel olanı çağırsın diye bağımlılıklar bilerek dar tutuldu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, soru])

  /** Tur saati bitti: yanlış değil, tur biter. */
  const turSuresiDoldu = () => {
    setElendi('sure')
    turBitir(cevaplarRef.current)
  }

  /*
    Çıkış turu bitiriyor — her modda; yoksa o turda yanlış bilinen sorular
    Oyun Bankası'na hiç düşmezdi. Yarım tur rekora ve istatistiğe yazılmıyor
    (`oyunlar.tsx`).
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
    sure: soruSuresi('trigonometri'),
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
        oyunId="trigonometri"
        baslik={oyun.ad}
        sayac={
          asama === 'bitti'
            ? null
            : {
                kalan,
                toplam,
                sira: sira + 1,
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
              <div className="flex min-h-0 flex-1 flex-col gap-3 py-2">
                <SoruKarti soru={soru.soru} maskot={maskotDurumu} />

                <div className="grid grid-cols-2 gap-2.5">
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
                  aciklama={trigAciklamasi(geriBildirim.soru)}
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
 * Sorunun kartı.
 *
 * Üçgenli sorularda şekil kalan yeri dolduruyor; şekilsiz sorularda verilen
 * değer kartın ortasında büyük duruyor ve sorulan oran altında. Soru cümlesi
 * kurulmuyor ("… ise … kaçtır?"): ekranda iki eşitlik yan yana okunuyor, sınav
 * kitapçığındaki yazılışın aynısı.
 */
function SoruKarti({ soru, maskot }: { soru: TrigSorusu; maskot: MaskotDurumu }) {
  if (sekliVarMi(soru)) {
    return (
      <div className="golge-kart flex min-h-0 flex-1 flex-col rounded-3xl bg-card px-3 pb-2.5 pt-3">
        <div className="flex flex-none items-center gap-2 text-[12.5px] font-bold text-muted-foreground">
          <Rabi durum={maskot} boyut={26} />
          <span>
            <b className="font-display text-[15px] font-extrabold text-foreground">{sorulanAd(soru)}</b>{' '}
            kaçtır?
          </span>
        </div>
        <div className="grid min-h-[96px] flex-1 place-items-center">
          <OyunSekli sekil={trigSekli(soru)} className="mx-auto h-full max-h-[190px] w-auto" />
        </div>
      </div>
    )
  }

  const kosul =
    soru.tur === 'ozel' ? null : soru.tur === 'donusum' ? 'α dar açı' : 'α + β = 90°'

  return (
    <div className="golge-kart flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-3xl bg-card px-3 py-4">
      <Rabi durum={maskot} boyut={44} />
      {kosul && (
        <span className="rounded-full bg-muted px-3 py-1 text-[12.5px] font-bold text-muted-foreground">
          {kosul}
        </span>
      )}
      {soru.tur !== 'ozel' && (
        <div className="flex items-center gap-2 font-display text-[24px] font-extrabold">
          <span>{soru.verilen} α =</span>
          <KesirYazisi metin={verilenDeger(soru)} />
        </div>
      )}
      <div
        className={cn(
          'font-display font-extrabold text-primary',
          soru.tur === 'ozel' ? 'text-[34px]' : 'text-[22px]',
        )}
      >
        {sorulanAd(soru)} = ?
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
  sik: TrigSikki
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
        'golge-kart relative flex min-h-[74px] w-full items-center justify-center rounded-[20px] border-2 px-4 py-2',
        'font-display text-[22px] font-extrabold transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        !acikta && 'border-border bg-card active:brightness-95',
        dogruSecim && 'border-success bg-success text-white',
        yanlisSecim && 'border-ikincil bg-ikincil text-white',
        isaretli && 'border-success bg-card text-success',
        acikta && !secilen && !sik.dogruMu && 'border-border bg-card opacity-45',
      )}
    >
      <KesirYazisi metin={sik.metin} />
      {/* İşaret köşede: kesrin yanına konsa kesir ortadan kayardı. */}
      {(dogruSecim || isaretli) && (
        <Check size={17} className="absolute right-2.5 top-2.5 shrink-0" aria-hidden />
      )}
      {yanlisSecim && <X size={17} className="absolute right-2.5 top-2.5 shrink-0" aria-hidden />}
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
  sonuc: { ozet: TurOzeti<TrigSorusu>; yeniRekor: boolean }
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
      oyunId="trigonometri"
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
      bolumBasligi="Karıştırdığın oranlar"
      bolumAltYazisi="Nereden geldiğiyle birlikte — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${trigKimligi(yanlis)}-${sira}`}
              oyunId="trigonometri"
              soru={trigdenBanka(yanlis)}
              bildir={bildir}
            >
              {/* Önce sorunun kendisi, sonra cevabı: "cos α = 4/5" tek başına
                  hangi üçgenden çıktığını söylemiyordu. */}
              <b className="rakam block font-display text-[14px] font-extrabold leading-tight">
                {trigMetni(yanlis)}
              </b>
              <span className="rakam mt-0.5 block text-[11.5px] font-semibold text-success">
                {sorulanAd(yanlis)} = {trigCevabi(yanlis)}
              </span>
              <span className="mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
                {trigAciklamasi(yanlis)}
              </span>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
