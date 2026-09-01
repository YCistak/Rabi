'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, X } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import {
  UCGEN_ACIKLAMASI,
  UCGEN_ADI,
  kenarEsit,
  kenarMetni,
  ucgenCevabi,
  ucgenOzeti,
  ucgenSekli,
  ucgenSiklari,
  ucgenTuruHazirla,
  type Kenar,
  type UcgenSorusu,
} from '@/lib/oyunlar/ucgen'
import {
  guncelSeri,
  karistir,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { ucgendenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import { TUR_SORU_SINIRI, elerMi, soruSuresi } from '@/lib/oyunlar/ritim'
import { etkinMod, modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { useTurSayaci } from '@/lib/oyunlar/tur-sayaci'
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

/**
 * Özel Üçgenler — Geometri Ustası'nın dik üçgen oyunu.
 *
 * İki şık var, çünkü ölçülen şey hesap değil **tanıma**: 8-15-17'yi gördüğünde
 * hipotenüsü hesaplamadan bilmek. Dört şık olsaydı tur içinde okunacak metin
 * ikiye katlanır, oyun hız oyunu olmaktan çıkardı.
 */

/** Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms). */
const CEVAP_BEKLEMESI = 900
/**
 * Turda hazırlanan en fazla soru.
 *
 * Turu bitiren şey moda göre süre ya da ilk yanlış (`mod.ts`); soru sayısı
 * hedefi yok. Bu sabit yalnızca sonsuz bir dizi üretilemediği için var.
 */
const TUR_SORUSU = TUR_SORU_SINIRI

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/** Ekrana gelen tek soru: şekil verisi + karıştırılmış iki şık. */
type TurSorusu = { soru: UcgenSorusu; siklar: [Kenar, Kenar] }

/** `secilen` süre dolduğunda `null`: oyuncu bir kenar işaretlemedi. */
type GeriBildirim = { secilen: Kenar | null; dogruMu: boolean; soru: UcgenSorusu }

/** Banka kayıtlarından tur soruları; şekil sorudan yeniden kuruluyor. */
function bankaSorulariniCoz(kayitlar: readonly BankaKaydi[]): UcgenSorusu[] {
  const sorular: UcgenSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'ucgen') continue
    sorular.push(kayit.soru.ucgen)
  }
  return sorular
}

/** Şıklar tur kurulurken bir kez karışıyor; her çizimde karışsaydı yerleri oynardı. */
function siklariEkle(sorular: readonly UcgenSorusu[]): TurSorusu[] {
  return sorular.map((soru) => ({ soru, siklar: ucgenSiklari(soru) }))
}

export function UcgenOyunuEkrani({
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
    ozet: TurOzeti<UcgenSorusu>,
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
  const oyun = oyunBul('ucgen')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<TurSorusu[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<UcgenSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)

  /** Tur nasıl bitti — tur sonu ekranı bunu ayrıca söylüyor. */
  const [elendi, setElendi] = useState<Eleme>(false)
  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)
  /**
   * Kaçıncı tur.
   *
   * Tur saatli modlarda sayacı sıfırlayan tek şey bu: soru sırası bir turun
   * ortasında da sıfır olabiliyor (`tur-sayaci.ts`).
   */
  const [turNo, setTurNo] = useState(0)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<UcgenSorusu>; yeniRekor: boolean } | null>(
    null,
  )

  const bankaHavuzu = useMemo(() => bankaSorulariniCoz(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.length > 0
  // Banka turu modu dinlemiyor; kural tek yerden okunuyor.
  const gecerliMod = etkinMod(mod, bankaTuru)

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
  const cevaplarRef = useRef<Cevap<UcgenSorusu>[]>([])
  cevaplarRef.current = cevaplar
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    setTurNo((n) => n + 1)
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setSorular(siklariEkle(bankaTuru ? karistir(bankaHavuzu) : ucgenTuruHazirla(TUR_SORUSU)))
    setSira(0)
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setElendi(false)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [bankaHavuzu, bankaTuru, istatistik.enIyiDogru])

  const turBitir = useCallback(
    (verilenler: Cevap<UcgenSorusu>[], yarim = false) => {
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
          soru: ucgendenBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
        yarim,
      )
    },
    [bankaTuru, gecerliMod, istatistik, onTurBitti, sesAcik],
  )

  // Banka turunda liste bankadaki kayıt kadar; tükenirse tur erken biter.
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

  const cevapla = (secilen: Kenar) => {
    // Geri bildirim gösterilirken ikinci dokunuş yok sayılıyor; yoksa aynı
    // soruya iki cevap yazılır ve süre iki kez cezalandırılırdı.
    if (asama !== 'oynaniyor' || geriBildirim !== null) return

    const gecerli = sorular[sira]
    if (!gecerli) return

    const dogruMu = kenarEsit(secilen, ucgenCevabi(gecerli.soru))
    setCevaplar((onceki) => [...onceki, { soru: gecerli.soru, dogruMu }])
    setGeriBildirim({ secilen, dogruMu, soru: gecerli.soru })
    geriBildir(dogruMu)


    ilerle(dogruMu)
  }

  /** Cevaptan sonra: yanlışsa tur biter, doğruysa sıradaki soru gelir. */
  const ilerle = (dogruMu: boolean) => {
    zamanlayiciRef.current = setTimeout(() => {
      setGeriBildirim(null)
      if (elerMi(dogruMu, bankaTuru, gecerliMod)) {
        setElendi('yanlis')
        turBitir(cevaplarRef.current)
      } else {
        setSira((s) => s + 1)
      }
    }, CEVAP_BEKLEMESI)
  }

  /**
   * Süre dolması cevap vermemekle aynı: soru pas geçilmiş sayılıyor.
   *
   * Yanlış sayıldığı için turu da bitiriyor — beklemek de bilmemek.
   */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null) return
    const gecerli = sorular[sira]
    if (!gecerli) return

    // Şık seçilmedi: `secilen` null, cevap yanlış sayılıyor.
    setCevaplar((onceki) => [...onceki, { soru: gecerli.soru, dogruMu: false }])
    setGeriBildirim({ secilen: null, dogruMu: false, soru: gecerli.soru })
    oyunSesiCal('yanlis', sesAcik)

    ilerle(false)
    // `ilerle` her renderda yeniden kuruluyor; sayaç yalnızca güncel olanı
    // çağırsın diye bağımlılıklar bilerek dar tutuldu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, sesAcik, sira, sorular])

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
    aktif: asama === 'oynaniyor' && geriBildirim === null && !duraklatilan,
    sure: soruSuresi('ucgen', null),
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
  const gecerli = sorular[sira]

  const maskotDurumu: MaskotDurumu = geriBildirim
    ? geriBildirim.dogruMu
      ? 'kutlama'
      : 'uzgun'
    : 'calisiyor'

  return (
    <>
      <OyunKabugu
        oyunId="ucgen"
        baslik={oyun.ad}
        sayac={
          asama === 'bitti'
            ? null
            : {
                kalan,
                toplam,
                sira: sira + 1,
                boss: false,
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
          gecerli && (
            <>
              <div className="flex min-h-0 flex-1 flex-col gap-3 py-2">
                {/* Üçgenin ailesi ("30-60-90") yazmıyor: yazsaydı oranı
                    hatırlamak yerine okumak yeterdi. Şekilde açılar var. */}
                <div className="golge-kart flex min-h-0 flex-1 flex-col rounded-3xl bg-card px-3 pb-2.5 pt-3">
                  <div className="flex flex-none items-center gap-2 text-[12.5px] font-bold text-muted-foreground">
                    <Rabi durum={maskotDurumu} boyut={26} />x kaç birim?
                  </div>

                  {/* Şekil kalan yere göre büyüyüp küçülüyor; alt sınır olmasa
                      dar ekranlarda kenar uzunlukları okunmaz olurdu. */}
                  <div className="grid min-h-[96px] flex-1 place-items-center">
                    <OyunSekli
                      sekil={ucgenSekli(gecerli.soru)}
                      className="mx-auto h-full max-h-[190px] w-auto"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {gecerli.siklar.map((sik) => (
                    <SikDugmesi
                      key={kenarMetni(sik)}
                      sik={sik}
                      dogruMu={kenarEsit(sik, ucgenCevabi(gecerli.soru))}
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
                      ? UCGEN_ADI[geriBildirim.soru.tur]
                      : `— doğrusu ${kenarMetni(ucgenCevabi(geriBildirim.soru))}`
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
      />
    </>
  )
}

/**
 * Tek şık.
 *
 * Cevaptan sonra iki şık da renklenir: yanlış seçildiğinde doğrusunun hangisi
 * olduğu aynı anda yeşille gösteriliyor — yoksa oyuncu hatasını görür ama
 * doğrusunu öğrenemezdi.
 */
function SikDugmesi({
  sik,
  dogruMu,
  geriBildirim,
  onSec,
}: {
  sik: Kenar
  dogruMu: boolean
  geriBildirim: GeriBildirim | null
  onSec: () => void
}) {
  const acikta = geriBildirim !== null
  // Süre dolduysa hiçbir şık seçili değil; yalnızca doğrusu işaretleniyor.
  const secilen =
    acikta && geriBildirim.secilen !== null && kenarEsit(geriBildirim.secilen, sik)
  const dogruSecim = secilen && dogruMu
  const yanlisSecim = secilen && !dogruMu
  const isaretli = acikta && !secilen && dogruMu

  return (
    <button
      type="button"
      onClick={onSec}
      disabled={acikta}
      className={cn(
        'golge-kart flex min-h-[60px] w-full items-center justify-center gap-2 rounded-[20px] border-2 px-4 py-3',
        'rakam font-display text-[26px] font-extrabold leading-none transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        !acikta && 'border-border bg-card active:brightness-95',
        dogruSecim && 'border-success bg-success text-white',
        yanlisSecim && 'border-ikincil bg-ikincil text-white',
        isaretli && 'border-success bg-card text-success',
        acikta && !secilen && !dogruMu && 'border-border bg-card opacity-45',
      )}
    >
      {kenarMetni(sik)}
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
  sonuc: { ozet: TurOzeti<UcgenSorusu>; yeniRekor: boolean }
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
      oyunId="ucgen"
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
      bolumBasligi="Karıştırdığın üçgenler"
      bolumAltYazisi="Oranıyla birlikte — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${ucgenOzeti(yanlis)}-${sira}`}
              oyunId="ucgen"
              soru={ucgendenBanka(yanlis)}
              bildir={bildir}
            >
              {/* Üç kenar sırayla, eksik olan "x" ile: hangi kenarın sorulduğu
                  ancak öteki ikisinin yanında anlaşılıyor. */}
              <b className="rakam block font-display text-[14px] font-extrabold leading-tight">
                {ucgenOzeti(yanlis)}
              </b>
              <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
                <span className="rakam text-success">x = {kenarMetni(ucgenCevabi(yanlis))}</span> ·{' '}
                {UCGEN_ADI[yanlis.tur]}
              </span>
              <span className="mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
                {UCGEN_ACIKLAMASI[yanlis.tur]}
              </span>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
