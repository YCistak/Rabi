'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import type { OyunIstatistigi } from '@/lib/types'
import { TUZAK_HAVUZU, TUZAK_KONU_ADI, type TuzakKurali } from '@/lib/oyunlar/tuzak-havuzu'
import {
  bankadanSorular,
  cevapDogruMu,
  duzeltme,
  ifade,
  tuzakTuruHazirla,
  type TuzakSorusu,
} from '@/lib/oyunlar/tuzak'
import {
  guncelSeri,
  kalanPas,
  rekorKirildiMi,
  turOzeti,
  yanlisSayisi,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { tuzaktanBanka, bankaKimligi, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
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
import { KaydirmaKarti } from '@/components/oyun-kaydirma-karti'
import { OyunTanitim } from '@/components/oyun-tanitim'

/**
 * Kural Tuzağı — mini oyun.
 *
 * Tur kuralı öteki oyunlarla aynı: modun belirlediği kural (`mod.ts`). Cevap ikili olduğu için şansın payı var;
 * buna karşılık Sıfır Tolerans'de süre sekiz saniye ve kural bilinmiyorsa o sürede
 * sağlaması yapılamıyor — atılan yazı tura uzun vadede tutmuyor.
 */

/** Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms). */
const CEVAP_BEKLEMESI = 1500

/**
 * Turda hazırlanan en fazla soru.
 *
 * Turu bitiren şey moda göre süre ya da ilk yanlış (`mod.ts`); soru sayısı
 * hedefi yok. Bu sabit yalnızca sonsuz bir dizi üretilemediği için var.
 */
const TUR_SORUSU = TUR_SORU_SINIRI

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/** `dogruDedi` null: oyuncu kaydırmadan süre doldu ya da pas geçti. */
type GeriBildirim = {
  dogruDedi: boolean | null
  dogruMu: boolean
  pas: boolean
  soru: TuzakSorusu
}

/** Tur sonu: özet ve listedeki her yanlışın pas mı olduğu (aynı sırada). */
type Sonuc = { ozet: TurOzeti<TuzakSorusu>; paslar: boolean[]; yeniRekor: boolean }

/** Banka kayıtlarından kural havuzu; kayıt kuralın tamamını taşıyor. */
function bankaHavuzu(kayitlar: readonly BankaKaydi[]): TuzakKurali[] {
  const havuz: TuzakKurali[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'tuzak') continue
    havuz.push(kayit.soru.kural)
  }
  return havuz
}

export function TuzakOyunuEkrani({
  istatistik,
  sesAcik,
  bankaSorulari,
  onTurBitti,
  onCik,
  bildir,
  gorulenler,
}: {
  istatistik: OyunIstatistigi
  sesAcik: boolean
  /** Boş değilse tur yalnızca bu sorularla kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (
    ozet: TurOzeti<TuzakSorusu>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — modlar arasında değişiyor. */
    gecenSaniye: number,
    /** Tur bitmeden çıkıldı mı — yarım tur rekora ve istatistiğe yazılmıyor. */
    yarim: boolean,
  ) => void
  onCik: () => void
  bildir: BildirimKolu
  /** Yakın turlarda sorulan soru kimlikleri — yenisi öne alınıyor (`lib/oyunlar/gecmis.ts`). */
  gorulenler: readonly string[]
}) {
  const oyun = oyunBul('tuzak')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<SoruAkisi<TuzakSorusu>>(tekAkis([]))
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<TuzakSorusu>[]>([])
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
  /*
    Zorluk seçilmiyor, turun içinde kayıyor (`lib/oyunlar/uyum.ts`).

    Tur ortadan başlıyor; ardışık doğrular seviyeyi yükseltiyor, ardışık
    yanlışlar düşürüyor ve bunun hiçbiri ekranda yazmıyor.
  */
  const { zorluk, kaydet: zorlukKaydet, sifirla: zorluguSifirla } = useUyarlananZorluk()

  const [sonuc, setSonuc] = useState<Sonuc | null>(null)

  const havuz = useMemo(() => bankaHavuzu(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0
  // Seçilen mod (tanıtımın ayar adımı); banka turu seçimi dinlemiyor.
  const gecerliMod = useEtkinMod(bankaTuru)

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<TuzakSorusu>[]>([])
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
        ? tekAkis(bankadanSorular(havuz))
        : akisUret((seviye) =>
            tuzakTuruHazirla(TUR_SORUSU, seviye, TUZAK_HAVUZU, Math.random, {
              gorulenler,
              // Kimlik kuralın doğru hâlinden geliyor; kartın hangi yüzü
              // gösterdiği fark etmiyor, o yüzden `dogruHali` uydurma.
              anahtar: (kural) => bankaKimligi(tuzaktanBanka({ kural, dogruHali: true })),
            }),
          ),
    )
    zorluguSifirla()
    setSira(0)
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setElendi(false)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [bankaTuru, gorulenler, havuz, istatistik.enIyiDogru, zorluguSifirla])

  const turBitir = useCallback(
    (verilenler: Cevap<TuzakSorusu>[], yarim = false) => {
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
          soru: tuzaktanBanka(cevap.soru),
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
    const uzunluk = akisUzunlugu(sorular)
    if (asama !== 'oynaniyor' || uzunluk === 0) return
    if (sira >= uzunluk) turBitir(cevaplarRef.current)
  }, [asama, sira, sorular, turBitir])

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

  const soru = sorular[zorluk][sira]

  /**
   * Cevaptan sonra: yanlışsa tur biter, doğruysa sıradaki soru gelir.
   *
   * Pas bedelsiz: uyuma yanlış diye yazılmıyor, Sıfır Tolerans'ta turu
   * bitirmiyor.
   */
  const ilerle = (dogruMu: boolean, pas = false) => {
    zamanlayiciRef.current = setTimeout(() => {
      setGeriBildirim(null)
      /*
        Zorluk **ilerlerken** güncelleniyor, cevap verilirken değil.

        Sıradaki soru `sorular[zorluk][sira]` ile okunuyor; seviye cevap
        anında kaysaydı ekrandaki soru, oyuncu geri bildirimi okurken
        değişirdi. İkisi aynı karede güncellenince değişen tek şey bir
        sonraki soru oluyor.
      */
      if (!pas) zorlukKaydet(dogruMu)
      if (!pas && elerMi(dogruMu, bankaTuru, gecerliMod)) {
        setElendi('yanlis')
        turBitir(cevaplarRef.current)
      } else {
        setSira((s) => s + 1)
      }
    }, CEVAP_BEKLEMESI)
  }

  const cevapla = (dogruDedi: boolean) => {
    // Geri bildirim gösterilirken ikinci kaydırma yok sayılıyor; yoksa aynı
    // soruya iki cevap yazılırdı.
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return

    const dogruMu = cevapDogruMu(soru, dogruDedi)
    setCevaplar((onceki) => [...onceki, { soru, dogruMu }])
    setGeriBildirim({ dogruDedi, dogruMu, pas: false, soru })
    geriBildir(dogruMu)
    ilerle(dogruMu)
  }

  /** Süre dolması cevap vermemekle aynı: yanlış sayılıyor, turu bitiriyor. */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    setCevaplar((onceki) => [...onceki, { soru, dogruMu: false }])
    setGeriBildirim({ dogruDedi: null, dogruMu: false, pas: false, soru })
    geriBildir(false)
    ilerle(false)
    // `ilerle` ve `geriBildir` her renderda yeniden kuruluyor; sayaç yalnızca
    // güncel olanı çağırsın diye bağımlılıklar bilerek dar tutuldu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, soru])

  /**
   * Pas hakkı: soru bilinmeyen olarak kaydediliyor (bankaya düşsün) ama
   * bedelsiz — yanlış sesi, titreşimi yok; doğrusu yine gösteriliyor.
   */
  const pasGec = () => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    if (kalanPas(cevaplarRef.current) <= 0) return
    setCevaplar((onceki) => [...onceki, { soru, dogruMu: false, pas: true }])
    setGeriBildirim({ dogruDedi: null, dogruMu: false, pas: true, soru })
    ilerle(false, true)
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
    yanlisSayisi: yanlisSayisi(cevaplar),
    onTurBitti: turSuresiDoldu,
    aktif: asama === 'oynaniyor' && geriBildirim === null && !duraklatilan && soru !== undefined,
    sure: soruSuresi('tuzak'),
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

  const maskotDurumu: MaskotDurumu = geriBildirim && !geriBildirim.pas
    ? geriBildirim.dogruMu
      ? 'kutlama'
      : 'uzgun'
    : 'calisiyor'

  return (
    <>
      <OyunKabugu
        oyunId="tuzak"
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
          kilitli: asama !== 'oynaniyor' || geriBildirim !== null,
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
          soru && (
            <>
              <div className="flex flex-1 flex-col justify-center gap-3 py-2">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Rabi durum={maskotDurumu} poz="yapboz" boyut={96} />
                  {/* Konu adı ipucu değil çerçeve: kuralın hangi ailede
                      olduğunu bilmek doğru/yanlış kararını vermiyor. */}
                  <span className="rounded-full bg-konu-matematik px-2.5 py-1 text-[11px] font-extrabold text-konu-matematik-koyu">
                    {TUZAK_KONU_ADI[soru.kural.konu]}
                  </span>
                </div>

                {/* Pas geçilince kart kilitlenmiyor: kilitli kart sonucu yalnızca
                    yeşil ya da kırmızı çerçeveyle söyleyebiliyor, pas ise
                    yanlış değil. Bu arada kaydırmayı `cevapla` yok sayıyor. */}
                <KaydirmaKarti
                  metin={ifade(soru)}
                  kilitli={geriBildirim !== null && !geriBildirim.pas}
                  sonuc={
                    geriBildirim && !geriBildirim.pas
                      ? { dogruDedi: geriBildirim.dogruDedi, dogruMu: geriBildirim.dogruMu }
                      : null
                  }
                  onCevap={cevapla}
                />
              </div>

              {geriBildirim && (
                <Bildirim
                  iyi={geriBildirim.dogruMu}
                  pas={geriBildirim.pas}
                  baslik={
                    geriBildirim.pas
                      ? 'Pas geçtin'
                      : geriBildirim.dogruDedi === null
                        ? 'Süre doldu'
                        : geriBildirim.dogruMu
                          ? 'Doğru!'
                          : 'Olmadı'
                  }
                  aciklama={
                    geriBildirim.dogruMu
                      ? undefined
                      : bildirimAciklamasi(geriBildirim.soru)
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
 * Yanlış cevabın altındaki tek satır.
 *
 * Ekrandaki eşitlik yanlışsa doğrusu gösteriliyor; doğruysa gösterilecek bir
 * düzeltme yok — o durumda kuralın neden doğru olduğunu söylemek gerekiyor.
 */
function bildirimAciklamasi(soru: TuzakSorusu): string {
  const dogrusu = duzeltme(soru)
  return dogrusu === null ? `Bu kural doğruydu. ${soru.kural.aciklama}` : `Doğrusu: ${dogrusu}`
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
  sonuc: Sonuc
  rekor: number
  bankaTuru: boolean
  mod: OyunModu
  elendi: Eleme
  onTekrar: () => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const { ozet, paslar, yeniRekor } = sonuc
  const gorunen = ozet.yanlislar.slice(0, EN_COK_YANLIS)
  const kalan = ozet.yanlislar.length - gorunen.length

  return (
    <TurSonu
      oyunId="tuzak"
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
      bolumBasligi="Düştüğün tuzaklar"
      bolumAltYazisi="Yanlışın nerede doğru göründüğüyle birlikte."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.kural.dogru}-${sira}`}
              oyunId="tuzak"
              soru={tuzaktanBanka(yanlis)}
              bildir={bildir}
            >
              {/* Üstte tuzağın kendisi, altında doğrusu: ikisi yan yana
                  durmadan hatanın neye benzediği anlaşılmıyor. */}
              <b className="rakam block font-display text-[13px] font-extrabold leading-tight text-ikincil line-through">
                {yanlis.kural.yanlis}
              </b>
              <span className="rakam mt-1 block text-[13px] font-extrabold text-success">
                {yanlis.kural.dogru}
              </span>
              <span className="mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
                {paslar[sira] && <b className="font-extrabold">Pas geçtin. </b>}
                {yanlis.kural.aciklama}
              </span>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
