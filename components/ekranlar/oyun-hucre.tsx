'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import type { OyunIstatistigi } from '@/lib/types'
import type { OrganelSorusu } from '@/lib/oyunlar/hucre-havuzu'
import { HUCRE_HAVUZU } from '@/lib/oyunlar/hucre-havuzu'
import {
  kayittanSoru,
  turHazirla,
  type HucreOyunSorusu,
  type HucreSikki,
} from '@/lib/oyunlar/hucre'
import {
  guncelSeri,
  rekorKirildiMi,
  kalanPas,
  turOzeti,
  yanlisSayisi,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { hucredenBanka, bankaKimligi, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import {
  elerMi,
  soruSuresi,
  turSirasi,
  TUR_SORU_SINIRI,
  akisUzunlugu,
  akisiEsle,
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
import { OyunSikki, sikHali } from '@/components/oyun-sikki'
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
 * Hücre ve Organeller — mini oyun.
 *
 * Bir soru cümlesi, dört şık, biri doğru: ekran Canlıları Sınıflandırma'nın
 * (`oyun-biyoloji.tsx`) düzenini birebir izliyor — ortada yapboz tamamlayan
 * Rabi, altında soru kartı, altında şıklar. Önceden arkası dönük bir kart üç
 * saniyede bir ipucu açıyor, erken bilmek fazla puan getiriyordu; kullanıcı
 * kartlı tasarım yerine düz soru istedi.
 *
 * Ayrı ekran olarak kaldı, biyoloji ekranına katılmadı: veri şekli farklı
 * (çeldiriciler bir ad listesinden seçiliyor) ve banka kaydı da ayrı dal.
 */

/** Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms) — biyoloji oyunlarıyla aynı. */
const CEVAP_BEKLEMESI = 1300

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/**
 * `ritim.ts`'in kurduğu sıraya şıkları ekler.
 *
 * Şeritler ayrı ayrı eşleniyor ve sıraları korunuyor: `turHazirla` varsayılan
 * hâlinde yeniden karıştırırdı ve aynı `sira` numarası üç şeritte farklı bir
 * yere denk gelirdi.
 */
function sirayiKur(akis: SoruAkisi<OrganelSorusu>): SoruAkisi<HucreOyunSorusu> {
  return akisiEsle(akis, (sorular) => turHazirla(sorular, Math.random, false))
}

/** `secilen` süre dolduğunda `null`: oyuncu bir şık işaretlemedi. */
type GeriBildirim = { secilen: string | null; dogruMu: boolean; pas: boolean; soru: OrganelSorusu }

/**
 * Banka kayıtlarından soru havuzu.
 *
 * Kayıt havuzdaki güncel soruya çevriliyor (`kayittanSoru`): ipuçlu kart
 * döneminin kayıtları da böylece yeni biçimde soruluyor. Sorulamayan kayıt
 * (havuzdan düşmüş, sorusu da yok) atlanıyor.
 */
function bankaHavuzu(kayitlar: readonly BankaKaydi[]): OrganelSorusu[] {
  const havuz: OrganelSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'hucre') continue
    const soru = kayittanSoru(kayit.soru.hucre)
    if (soru) havuz.push(soru)
  }
  return havuz
}

export function HucreOyunuEkrani({
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
    ozet: TurOzeti<OrganelSorusu>,
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
  const oyun = oyunBul('hucre')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<SoruAkisi<HucreOyunSorusu>>(tekAkis([]))
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<OrganelSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  /** Tur nasıl bitti — tur sonu ekranı bunu ayrıca söylüyor. */
  const [elendi, setElendi] = useState<Eleme>(false)

  /*
    Zorluk seçilmiyor, turun içinde kayıyor (`lib/oyunlar/uyum.ts`).

    Tur ortadan başlıyor; ardışık doğrular seviyeyi yükseltiyor, ardışık
    yanlışlar düşürüyor ve bunun hiçbiri ekranda yazmıyor.
  */
  const { zorluk, kaydet: zorlukKaydet, sifirla: zorluguSifirla } = useUyarlananZorluk()
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
    /** `ozet.yanlislar` ile aynı sırada: o soru pas mı geçildi. */
    paslar: boolean[]
    yeniRekor: boolean
  } | null>(null)

  const havuz = useMemo(() => bankaHavuzu(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0
  // Seçilen mod (tanıtımın ayar adımı); banka turu seçimi dinlemiyor.
  const gecerliMod = useEtkinMod(bankaTuru)

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<OrganelSorusu>[]>([])
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
        ? tekAkis(turHazirla(havuz))
        : sirayiKur(turSirasi(HUCRE_HAVUZU, Math.random, TUR_SORU_SINIRI, {
              gorulenler,
              anahtar: (s) => bankaKimligi(hucredenBanka(s)),
            })),
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
    (verilenler: Cevap<OrganelSorusu>[], yarim = false) => {
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

  /** `pas`: bedelsiz geçiş — zorluğu kaydırmıyor, Sıfır Tolerans'ta elemiyor. */
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

  const cevapla = (sik: HucreSikki) => {
    // Geri bildirim gösterilirken ikinci dokunuş yok sayılıyor; yoksa aynı
    // soruya iki cevap yazılırdı.
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return

    const dogruMu = sik.dogruMu
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu }])
    setGeriBildirim({ secilen: sik.deger, dogruMu, pas: false, soru: soru.soru })
    geriBildir(dogruMu)
    ilerle(dogruMu)
  }

  /** Pas hakkı: doğrusu gösterilip geçiliyor; yanlış sesi ve titreşimi yok. */
  const pasGec = () => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    if (kalanPas(cevaplarRef.current) <= 0) return
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu: false, pas: true }])
    setGeriBildirim({ secilen: null, dogruMu: false, pas: true, soru: soru.soru })
    ilerle(false, true)
  }

  /** Süre dolması cevap vermemekle aynı: yanlış sayılıyor. */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu: false }])
    setGeriBildirim({ secilen: null, dogruMu: false, pas: false, soru: soru.soru })
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
    sure: soruSuresi('hucre'),
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
        oyunId="hucre"
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
        pas={{ kalan: kalanPas(cevaplar), kilitli: geriBildirim !== null, onPas: pasGec }}
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
                <div className="grid place-items-center">
                  <Rabi durum={maskotDurumu} poz="yapboz" boyut={96} />
                </div>

                <div className="golge-kart rounded-[20px] bg-card px-4 py-3.5 text-center">
                  <p className="font-display text-[16px] font-extrabold leading-snug tracking-tight">
                    {soru.soru.soru}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {soru.siklar.map((sik, i) => (
                    <SikDugmesi
                      key={sik.deger}
                      sik={sik}
                      sira={i}
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
                  baslik={geriBildirim.pas ? 'Pas geçtin' : geriBildirim.dogruMu ? 'Doğru!' : 'Olmadı'}
                  aciklama={
                    geriBildirim.dogruMu ? undefined : `Doğrusu: ${geriBildirim.soru.organel}`
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
 * Tek şık — bütün oyunların ortak düğmesi (`oyun-sikki.tsx`).
 *
 * Cevaptan sonra doğru şık her hâlükârda işaretleniyor: yanlış seçen oyuncu
 * hangisi olması gerektiğini aynı ekranda görüyor. Yazı boyu öteki oyunlardan
 * küçük: "Granülsüz endoplazmik retikulum" gibi adlar dar ekranda tek satıra
 * sığsın diye.
 */
function SikDugmesi({
  sik,
  sira,
  geriBildirim,
  onSec,
}: {
  sik: HucreSikki
  sira: number
  geriBildirim: GeriBildirim | null
  onSec: () => void
}) {
  const acikta = geriBildirim !== null
  const hal = sikHali(acikta, acikta && geriBildirim.secilen === sik.deger, sik.dogruMu)

  return (
    <OyunSikki sira={sira} hal={hal} onSec={onSec} className="min-h-[52px] py-2 text-[15px]">
      {sik.metin}
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
  sonuc: { ozet: TurOzeti<OrganelSorusu>; paslar: boolean[]; yeniRekor: boolean }
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
      oyunId="hucre"
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
      bolumAltYazisi="Açıklamasıyla birlikte — asıl öğrenme burada."
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
              <b className="block font-display text-[13.5px] font-extrabold leading-tight">
                {yanlis.soru}
              </b>
              <span className="mt-1 block text-[12px] font-extrabold text-success">
                {yanlis.organel}
                {paslar[sira] && <span className="text-muted-foreground"> · Pas geçtin</span>}
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
