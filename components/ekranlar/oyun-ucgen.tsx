'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
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
  kalanPas,
  karistir,
  rekorKirildiMi,
  turOzeti,
  yanlisSayisi,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { ucgendenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import { TUR_SORU_SINIRI, elerMi, soruSuresi } from '@/lib/oyunlar/ritim'
import { modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { useEtkinMod } from '@/components/tur-ayari-baglami'
import { useTurSayaci } from '@/lib/oyunlar/tur-sayaci'
import type { BildirimKolu } from '@/components/hata-bildir'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { oyunSesiCal } from '@/lib/oyunlar/oyun-sesi'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { type MaskotDurumu } from '@/components/maskot/rabi'
import {
  Bildirim,
  EN_COK_YANLIS,
  KalanHapi,
  KoseRabisi,
  OyunKabugu,
  TurSonu,
  YanlisKarti,
  rekorCumlesi,
  type Eleme,
} from '@/components/oyun-kabuk'
import { OyunSikki, sikHali } from '@/components/oyun-sikki'
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
type GeriBildirim = { secilen: Kenar | null; dogruMu: boolean; pas: boolean; soru: UcgenSorusu }

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
  onCik,
  bildir,
  gorulenler,
}: {
  istatistik: OyunIstatistigi
  /** Önceki turlarda sorulanlar; deste onları sona atıyor. */
  gorulenler: readonly string[]
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

  const [sonuc, setSonuc] = useState<{
    ozet: TurOzeti<UcgenSorusu>
    /** `ozet.yanlislar` ile aynı sırada: o soru pas mı geçildi. */
    paslar: boolean[]
    yeniRekor: boolean
  } | null>(null)

  const bankaHavuzu = useMemo(() => bankaSorulariniCoz(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.length > 0
  // Seçilen mod (tanıtımın ayar adımı); banka turu seçimi dinlemiyor.
  const gecerliMod = useEtkinMod(bankaTuru)

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  /**
   * Turun başladığı an.
   *
   * Tur sabit uzunlukta değil — modun kuralına göre bitiyor. Eski hesap "tur
   * süresi eksi yanlış cezası" formülüyle türetiliyordu, o formülün karşılığı
   * kalmadı; süre gerçekten ölçülüyor.
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
    setSorular(siklariEkle(bankaTuru ? karistir(bankaHavuzu) : ucgenTuruHazirla(TUR_SORUSU, Math.random, gorulenler)))
    setSira(0)
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setElendi(false)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [bankaHavuzu, bankaTuru, gorulenler, istatistik.enIyiDogru])

  const turBitir = useCallback(
    (verilenler: Cevap<UcgenSorusu>[], yarim = false) => {
      if (bittiRef.current) return
      bittiRef.current = true
      const ozet = turOzeti(verilenler)
      setSonuc({
        ozet,
        paslar: verilenler.filter((c) => !c.dogruMu).map((c) => c.pas === true),
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
    setGeriBildirim({ secilen, dogruMu, pas: false, soru: gecerli.soru })
    geriBildir(dogruMu)


    ilerle(dogruMu)
  }

  /**
   * Pas hakkı: bedelsiz (`Cevap.pas`) — yanlış sayılmıyor, elemeye ve sese
   * girmiyor. Doğru şık işaretlenip sıradaki soruya geçiliyor.
   */
  const pasGec = () => {
    if (asama !== 'oynaniyor' || geriBildirim !== null) return
    if (kalanPas(cevaplarRef.current) <= 0) return
    const gecerli = sorular[sira]
    if (!gecerli) return

    setCevaplar((onceki) => [...onceki, { soru: gecerli.soru, dogruMu: false, pas: true }])
    setGeriBildirim({ secilen: null, dogruMu: false, pas: true, soru: gecerli.soru })
    ilerle(false, true)
  }

  /** Cevaptan sonra: yanlışsa tur biter, doğruysa sıradaki soru gelir. */
  const ilerle = (dogruMu: boolean, pas = false) => {
    zamanlayiciRef.current = setTimeout(() => {
      setGeriBildirim(null)
      if (!pas && elerMi(dogruMu, bankaTuru, gecerliMod)) {
        setElendi('yanlis')
        turBitir(cevaplarRef.current)
      } else {
        setSira((s) => s + 1)
      }
    }, CEVAP_BEKLEMESI)
  }

  /**
   * Süre dolması cevap vermemekle aynı: soru yanlış sayılıyor (pas hakkı
   * harcanmıyor, pas bedelsiz olduğu için ikisi ayrı).
   *
   * Yanlış sayıldığı için turu da bitiriyor — beklemek de bilmemek.
   */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null) return
    const gecerli = sorular[sira]
    if (!gecerli) return

    // Şık seçilmedi: `secilen` null, cevap yanlış sayılıyor.
    setCevaplar((onceki) => [...onceki, { soru: gecerli.soru, dogruMu: false }])
    setGeriBildirim({ secilen: null, dogruMu: false, pas: false, soru: gecerli.soru })
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
    yanlisSayisi: yanlisSayisi(cevaplar),
    onTurBitti: turSuresiDoldu,
    aktif: asama === 'oynaniyor' && geriBildirim === null && !duraklatilan,
    sure: soruSuresi('ucgen'),
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

  const maskotDurumu: MaskotDurumu = geriBildirim && !geriBildirim.pas
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
                mod: gecerliMod,
                seri: guncelSeri(cevaplar),
                dogru: dogruSayisi,
                yanlis: yanlisSayisi(cevaplar),
                enIyiSeri: turOzeti(cevaplar).enIyiSeri,
                rekor: Math.max(istatistik.enIyiDogru, dogruSayisi),
              }
        }
        pas={{
          kalan: kalanPas(cevaplar),
          kilitli: geriBildirim !== null,
          onPas: pasGec,
        }}
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
                    <KoseRabisi durum={maskotDurumu} />x kaç birim?
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
                  {gecerli.siklar.map((sik, i) => (
                    <SikDugmesi
                      key={kenarMetni(sik)}
                      sik={sik}
                      sira={i}
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
                  pas={geriBildirim.pas}
                  baslik={geriBildirim.pas ? 'Pas geçtin' : geriBildirim.dogruMu ? 'Aynen böyle!' : 'Olmadı'}
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
  sira,
  dogruMu,
  geriBildirim,
  onSec,
}: {
  sik: Kenar
  sira: number
  dogruMu: boolean
  geriBildirim: GeriBildirim | null
  onSec: () => void
}) {
  const acikta = geriBildirim !== null
  // Süre dolduysa hiçbir şık seçili değil; yalnızca doğrusu işaretleniyor.
  const secilen =
    acikta && geriBildirim.secilen !== null && kenarEsit(geriBildirim.secilen, sik)
  const hal = sikHali(acikta, secilen, dogruMu)

  return (
    <OyunSikki
      sira={sira}
      hal={hal}
      onSec={onSec}
      className="min-h-[60px] py-3 rakam text-[26px] leading-none"
    >
      {kenarMetni(sik)}
    </OyunSikki>
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
  sonuc: { ozet: TurOzeti<UcgenSorusu>; paslar: boolean[]; yeniRekor: boolean }
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
                {sonuc.paslar[sira] && ' · Pas geçtin'}
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
