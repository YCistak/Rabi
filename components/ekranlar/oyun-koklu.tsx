'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import type { OyunIstatistigi } from '@/lib/types'
import {
  BONUS_PUAN,
  BONUS_SURESI,
  CUBUK_EN_AZ,
  CUBUK_EN_COK,
  TEMEL_PUAN,
  altSinir,
  aralikAciklamasi,
  aralikDogruMu,
  kokluTuruHazirla,
  ustSinir,
  yakinUc,
  yaklasikDeger,
  type KokluSorusu,
} from '@/lib/oyunlar/koklu'
import {
  guncelSeri,
  karistir,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { kokludenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import { MATEMATIK_TUR_SORUSU, soruSuresi } from '@/lib/oyunlar/ritim'
import { useSoruSayaci } from '@/lib/oyunlar/soru-sayaci'
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
} from '@/components/oyun-kabuk'
import { SayiCubugu, type Aralik } from '@/components/oyun-sayi-cubugu'
import { OyunTanitim } from '@/components/oyun-tanitim'

/**
 * Köklü Sayı Aralığı — mini oyun.
 *
 * Soru iki evreli: önce aralık (çubuğu daralt), doğruysa hemen ardından beş
 * saniyelik bonus (hangi uca daha yakın?). Bonus ayrı bir soru değil, aynı
 * sorunun devamı — o yüzden doğru/yanlış sayacına girmiyor, yalnızca puana
 * ekleniyor. Kaçırmak da bir şey götürmüyor: aralığı zaten bilmiş oluyorsun.
 */

/** Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms). */
const CEVAP_BEKLEMESI = 1400
/** Aralık doğru bilindiğinde bonusa geçmeden önceki kısa bekleme (ms). */
const BONUS_BEKLEMESI = 850

/**
 * Turdaki soru sayısı.
 *
 * Matematik oyunlarında boss yok, dolayısıyla eleme de yok — turu bitirecek
 * bir şey gerekiyor. (`ritim.ts`)
 */
const TUR_SORUSU = MATEMATIK_TUR_SORUSU

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'
/** Sorunun hangi evresi ekranda. */
type Evre = 'aralik' | 'bonus'

type GeriBildirim = {
  evre: Evre
  dogruMu: boolean
  soru: KokluSorusu
  /** Aralık evresinde oyuncunun bıraktığı uçlar. */
  secilenAlt: number
  secilenUst: number
  /** Bonus evresinde seçilen uç; süre dolduysa null. */
  secilenUc: number | null
}

/** Banka kayıtlarından tur soruları. */
function bankaHavuzu(kayitlar: readonly BankaKaydi[]): KokluSorusu[] {
  const havuz: KokluSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'koklu') continue
    havuz.push({ sayi: kayit.soru.sayi })
  }
  return havuz
}

export function KokluOyunuEkrani({
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
    ozet: TurOzeti<KokluSorusu>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — tur artık sabit süreli değil. */
    gecenSaniye: number,
  ) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('koklu')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<KokluSorusu[]>([])
  const [sira, setSira] = useState(0)
  const [evre, setEvre] = useState<Evre>('aralik')
  const [cevaplar, setCevaplar] = useState<Cevap<KokluSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  const [puan, setPuan] = useState(0)

  /**
   * Çubuğun uçları. Her soruda tam genişlikten başlıyor: daraltmak oyunun işi.
   *
   * İki uç tek bir durumda: birbirlerini geçemedikleri için her değişiklik
   * ikisini birden görmek zorunda, ayrı state'lerde biri ötekinin eski hâlini
   * okurdu.
   */
  const [aralik, setAralik] = useState<Aralik>({ alt: CUBUK_EN_AZ, ust: CUBUK_EN_COK })

  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)

  const [sonuc, setSonuc] = useState<{
    ozet: TurOzeti<KokluSorusu>
    yeniRekor: boolean
    puan: number
  } | null>(null)

  const havuz = useMemo(() => bankaHavuzu(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<KokluSorusu>[]>([])
  cevaplarRef.current = cevaplar
  const puanRef = useRef(0)
  puanRef.current = puan
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setSorular(bankaTuru ? karistir(havuz) : kokluTuruHazirla(TUR_SORUSU))
    setSira(0)
    setEvre('aralik')
    setCevaplar([])
    setPuan(0)
    setGeriBildirim(null)
    setSonuc(null)
    setAralik({ alt: CUBUK_EN_AZ, ust: CUBUK_EN_COK })
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [bankaTuru, havuz, istatistik.enIyiDogru])

  const turBitir = useCallback(
    (verilenler: Cevap<KokluSorusu>[]) => {
      if (bittiRef.current) return
      bittiRef.current = true
      const ozet = turOzeti(verilenler)
      setSonuc({
        ozet,
        puan: puanRef.current,
        yeniRekor:
          !bankaTuru &&
          rekorKirildiMi({ ...istatistik, enIyiDogru: turBasiRekor.current }, ozet),
      })
      oyunSesiCal('bitis', sesAcik)
      setAsama('bitti')
      // Doğrular da bildiriliyor: banka, üst üste üç kez doğru bilinen kaydı düşürüyor.
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: kokludenBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
      )
    },
    [bankaTuru, istatistik, onTurBitti, sesAcik],
  )

  // Banka turunda liste bankadaki kayıt kadar; tükenirse tur erken biter.
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

  const soru = sorular[sira]

  /** Sıradaki soru: çubuk yeniden tam genişliğe açılıyor. */
  const sonrakiSoru = () => {
    setGeriBildirim(null)
    setEvre('aralik')
    setAralik({ alt: CUBUK_EN_AZ, ust: CUBUK_EN_COK })
    setSira((s) => s + 1)
  }

  /** Aralık cevabı — doğruysa bonus evresine, değilse sıradaki soruya. */
  const aralikBitir = (secilenAlt: number, secilenUst: number) => {
    if (!soru) return
    const dogruMu = aralikDogruMu(soru, secilenAlt, secilenUst)
    setCevaplar((onceki) => [...onceki, { soru, dogruMu }])
    if (dogruMu) setPuan((onceki) => onceki + TEMEL_PUAN)
    setGeriBildirim({
      evre: 'aralik',
      dogruMu,
      soru,
      secilenAlt,
      secilenUst,
      secilenUc: null,
    })
    geriBildir(dogruMu)

    zamanlayiciRef.current = setTimeout(
      () => {
        if (dogruMu) {
          setGeriBildirim(null)
          setEvre('bonus')
        } else {
          sonrakiSoru()
        }
      },
      dogruMu ? BONUS_BEKLEMESI : CEVAP_BEKLEMESI,
    )
  }

  /**
   * Bonus cevabı.
   *
   * Doğru/yanlış sayacına girmiyor: soru zaten bir kez cevaplandı. Yalnızca
   * puana ekleniyor, bilinemezse de bir şey götürmüyor.
   */
  const bonusBitir = (secilenUc: number | null) => {
    if (!soru) return
    const dogruMu = secilenUc !== null && secilenUc === yakinUc(soru)
    if (dogruMu) setPuan((onceki) => onceki + BONUS_PUAN)
    setGeriBildirim({
      evre: 'bonus',
      dogruMu,
      soru,
      secilenAlt: altSinir(soru),
      secilenUst: ustSinir(soru),
      secilenUc,
    })
    geriBildir(dogruMu)
    zamanlayiciRef.current = setTimeout(sonrakiSoru, CEVAP_BEKLEMESI)
  }

  /** Süre dolması: aralıkta cevap vermemekle aynı, bonusta bonusu kaçırmak. */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    if (evre === 'aralik') aralikBitir(aralik.alt, aralik.ust)
    else bonusBitir(null)
    // `aralikBitir` ve `bonusBitir` her renderda yeniden kuruluyor; sayaç
    // yalnızca güncel olanı çağırsın diye bağımlılıklar bilerek dar tutuldu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, soru, evre, aralik])

  const { kalan, toplam } = useSoruSayaci({
    aktif: asama === 'oynaniyor' && geriBildirim === null && !duraklatilan && soru !== undefined,
    sure: evre === 'bonus' ? BONUS_SURESI : soruSuresi('koklu', null),
    // İki evre ayrı sayaç: aynı anahtar kalsaydı bonusa geçerken sayaç
    // sıfırlanmaz, aralıktan kalan süreyle devam ederdi.
    anahtar: sira * 2 + (evre === 'bonus' ? 1 : 0),
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
  const kilitli = geriBildirim !== null

  const maskotDurumu: MaskotDurumu = geriBildirim
    ? geriBildirim.dogruMu
      ? 'kutlama'
      : 'uzgun'
    : 'calisiyor'

  return (
    <>
      <OyunKabugu
        oyunId="koklu"
        baslik={oyun.ad}
        sayac={
          asama === 'bitti'
            ? null
            : {
                kalan,
                toplam,
                sira: sira + 1,
                boss: false,
                seri: guncelSeri(cevaplar),
                dogru: dogruSayisi,
                yanlis: cevaplar.length - dogruSayisi,
                enIyiSeri: turOzeti(cevaplar).enIyiSeri,
                puan,
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
            onTekrar={turBaslat}
            onCik={onCik}
            bildir={bildir}
          />
        ) : (
          asama === 'oynaniyor' &&
          soru && (
            <>
              <div className="flex flex-1 flex-col justify-center gap-3 py-2">
                <div className="golge-kart flex items-center justify-center gap-3 rounded-[20px] bg-card px-4 py-3.5">
                  <Rabi durum={maskotDurumu} boyut={38} />
                  <p className="rakam font-display text-[34px] font-extrabold leading-none tracking-tight">
                    √{soru.sayi}
                  </p>
                </div>

                {evre === 'aralik' ? (
                  <>
                    <p className="text-center font-display text-[13.5px] font-extrabold">
                      Hangi iki sayı arasında?
                      <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
                        Uçları sürükleyip aralığı daralt, sonra onayla.
                      </span>
                    </p>

                    <SayiCubugu
                      enAz={CUBUK_EN_AZ}
                      enCok={CUBUK_EN_COK}
                      alt={kilitli ? geriBildirim.secilenAlt : aralik.alt}
                      ust={kilitli ? geriBildirim.secilenUst : aralik.ust}
                      kilitli={kilitli}
                      durum={kilitli ? (geriBildirim.dogruMu ? 'dogru' : 'yanlis') : null}
                      dogruAlt={
                        kilitli && !geriBildirim.dogruMu ? altSinir(soru) : undefined
                      }
                      onDegis={setAralik}
                    />

                    <button
                      type="button"
                      onClick={() => !kilitli && aralikBitir(aralik.alt, aralik.ust)}
                      disabled={kilitli}
                      className={cn(
                        'grid h-12 flex-none place-items-center rounded-[17px] font-display text-[15px] font-extrabold text-white transition',
                        kilitli ? 'bg-muted text-muted-foreground' : 'bg-isl-koyu active:brightness-95',
                      )}
                    >
                      Onayla
                    </button>
                  </>
                ) : (
                  <BonusGorunumu
                    soru={soru}
                    kilitli={kilitli}
                    secilenUc={geriBildirim?.secilenUc ?? null}
                    onSec={bonusBitir}
                  />
                )}
              </div>

              {geriBildirim && (
                <Bildirim
                  iyi={geriBildirim.dogruMu}
                  baslik={geriBildirimBasligi(geriBildirim)}
                  aciklama={`√${geriBildirim.soru.sayi} ≈ ${yaklasikDeger(geriBildirim.soru)} · ${aralikAciklamasi(geriBildirim.soru)}`}
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

function geriBildirimBasligi(geri: GeriBildirim): string {
  if (geri.evre === 'aralik') {
    return geri.dogruMu ? `Doğru! +${TEMEL_PUAN} puan · bonus geliyor` : 'Olmadı'
  }
  return geri.dogruMu ? `Bonus doğru! +${BONUS_PUAN} puan` : 'Bonus kaçtı — puanın duruyor'
}

/**
 * Bonus evresi: sayı hangi uca daha yakın?
 *
 * İki şık, çünkü ölçülen şey hesap değil sezgi: √50 yediye mi sekize mi yakın
 * sorusunun cevabı 49 ile 64'ün nerede durduğunu bilmekten çıkıyor.
 */
function BonusGorunumu({
  soru,
  kilitli,
  secilenUc,
  onSec,
}: {
  soru: KokluSorusu
  kilitli: boolean
  secilenUc: number | null
  onSec: (uc: number) => void
}) {
  const uclar = [altSinir(soru), ustSinir(soru)]
  const dogru = yakinUc(soru)

  return (
    <div className="flex flex-col gap-3">
      <p className="flex-none self-center rounded-full bg-warning-soft px-3 py-1 text-[11.5px] font-extrabold text-warning">
        ⚡ Bonus · {BONUS_SURESI} saniye
      </p>

      <p className="text-center font-display text-[14px] font-extrabold">
        Hangisine daha yakın?
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {uclar.map((uc) => {
          const secilen = kilitli && secilenUc === uc
          const dogruMu = uc === dogru
          const isaretli = kilitli && !secilen && dogruMu

          return (
            <button
              key={uc}
              type="button"
              onClick={() => !kilitli && onSec(uc)}
              disabled={kilitli}
              className={cn(
                'golge-kart grid h-16 place-items-center rounded-[18px] border-2 transition',
                'rakam font-display text-[26px] font-extrabold',
                !kilitli && 'border-border bg-card active:brightness-95',
                secilen && dogruMu && 'border-success bg-success text-white',
                secilen && !dogruMu && 'border-ikincil bg-ikincil text-white',
                isaretli && 'border-success bg-card text-success',
                kilitli && !secilen && !dogruMu && 'border-border bg-card opacity-45',
              )}
            >
              {uc}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SonucGorunumu({
  sonuc,
  rekor,
  bankaTuru,
  onTekrar,
  onCik,
  bildir,
}: {
  sonuc: { ozet: TurOzeti<KokluSorusu>; yeniRekor: boolean; puan: number }
  rekor: number
  bankaTuru: boolean
  onTekrar: () => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const { ozet, yeniRekor } = sonuc
  const gorunen = ozet.yanlislar.slice(0, EN_COK_YANLIS)
  const kalan = ozet.yanlislar.length - gorunen.length

  return (
    <TurSonu
      oyunId="koklu"
      dogru={ozet.dogru}
      yanlis={ozet.yanlis}
      enIyiSeri={ozet.enIyiSeri}
      rekor={rekor}
      yeniRekor={yeniRekor}
      bankaTuru={bankaTuru}
      puan={{ deger: sonuc.puan, etiket: 'Puan' }}
      altBaslik={
        bankaTuru
          ? 'Banka soruları — üst üste üç doğruda düşerler.'
          : rekorCumlesi(ozet.dogru, rekor, yeniRekor, 'doğru')
      }
      bolumBasligi="Karıştırdığın sayılar"
      bolumAltYazisi="Komşu tam kareleriyle birlikte — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.sayi}-${sira}`}
              oyunId="koklu"
              soru={kokludenBanka(yanlis)}
              bildir={bildir}
            >
              <b className="rakam block font-display text-[14px] font-extrabold leading-tight">
                √{yanlis.sayi} ≈ {yaklasikDeger(yanlis)}
              </b>
              <span className="rakam mt-0.5 block text-[11.5px] font-extrabold text-success">
                {altSinir(yanlis)} – {ustSinir(yanlis)} arasında
              </span>
              <span className="rakam mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
                {aralikAciklamasi(yanlis)} · {yakinUc(yanlis)} sayısına daha yakın
              </span>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
