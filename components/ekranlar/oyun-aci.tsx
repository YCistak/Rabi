'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import type { OyunIstatistigi } from '@/lib/types'
import {
  ACI_ACIKLAMASI,
  ACI_KURALI_ADI,
  aciSekli,
  aciTuruHazirla,
  type AciSorusu,
} from '@/lib/oyunlar/aci'
import {
  guncelSeri,
  karistir,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { acidanBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import { TUR_SORU_SINIRI, elerMi, soruSuresi } from '@/lib/oyunlar/ritim'
import { etkinMod, modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { useTurSayaci } from '@/lib/oyunlar/tur-sayaci'
import type { BildirimKolu } from '@/components/hata-bildir'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { oyunSesiCal } from '@/lib/oyunlar/oyun-sesi'
import { useGeriKatmani } from '@/lib/geri'
import { Rabi } from '@/components/maskot/rabi'
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
import { CevapAlani, TusTakimi, rakamEkle } from '@/components/oyun-tus-takimi'
import { OyunSekli } from '@/components/oyun-sekil'
import { OyunTanitim } from '@/components/oyun-tanitim'

/**
 * Açı Tamamlama — Geometri Ustası'nın açı oyunu.
 *
 * Cevap şıklardan seçilmiyor, **yazılıyor**: açı sorularında iki şıktan biri
 * çoğu zaman şeklin kabaca ölçülmesiyle elenebilirdi. Sayıyı yazmak kuralı
 * uygulamayı zorunlu kılıyor. Tuş takımı Zihinden İşlem'le ortak.
 */

/** Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms) — Zihinden İşlem'le aynı. */
const CEVAP_BEKLEMESI = 1100
/**
 * Turda hazırlanan en fazla soru.
 *
 * Turu bitiren şey moda göre süre ya da ilk yanlış (`mod.ts`); soru sayısı
 * hedefi yok. Bu sabit yalnızca sonsuz bir dizi üretilemediği için var.
 */
const TUR_SORUSU = TUR_SORU_SINIRI
/** Açı üç basamağı geçmiyor; dördüncü rakam yazdırmak yanlış cevabı uzatırdı. */
const EN_COK_RAKAM = 3

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type GeriBildirim = { dogruMu: boolean; girilen: string; soru: AciSorusu }

/** Banka kayıtlarından tur soruları; şekil sorudan yeniden kuruluyor. */
function bankaSorulariniCoz(kayitlar: readonly BankaKaydi[]): AciSorusu[] {
  const sorular: AciSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'aci') continue
    sorular.push(kayit.soru.aci)
  }
  return sorular
}

export function AciOyunuEkrani({
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
    ozet: TurOzeti<AciSorusu>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — modlar arasında değişiyor. */
    gecenSaniye: number,
  ) => void
  /** Seçili tur modu — bütün oyunlarda ortak (`lib/oyunlar/mod.ts`). */
  mod: OyunModu
  setMod: (mod: OyunModu) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('aci')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<AciSorusu[]>([])
  const [sira, setSira] = useState(0)
  const [girilen, setGirilen] = useState('')
  const [cevaplar, setCevaplar] = useState<Cevap<AciSorusu>[]>([])
  /** Yanlışlarla aynı sıradaki girdiler; boş dize pas geçildiğini gösterir. */
  const [yanlisGirdileri, setYanlisGirdileri] = useState<string[]>([])
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

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<AciSorusu>; yeniRekor: boolean } | null>(
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
  const cevaplarRef = useRef<Cevap<AciSorusu>[]>([])
  cevaplarRef.current = cevaplar
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    setTurNo((n) => n + 1)
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setSorular(bankaTuru ? karistir(bankaHavuzu) : aciTuruHazirla(TUR_SORUSU))
    setSira(0)
    setGirilen('')
    setCevaplar([])
    setYanlisGirdileri([])
    setGeriBildirim(null)
    setSonuc(null)
    setElendi(false)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [bankaHavuzu, bankaTuru, istatistik.enIyiDogru])

  const turBitir = useCallback(
    (verilenler: Cevap<AciSorusu>[]) => {
      if (bittiRef.current) return
      bittiRef.current = true
      const ozet = turOzeti(verilenler)
      setSonuc({
        ozet,
        yeniRekor:
          !bankaTuru &&
          modKayitliMi(gecerliMod) &&
          rekorKirildiMi({ ...istatistik, enIyiDogru: turBasiRekor.current }, ozet),
      })
      oyunSesiCal('bitis', sesAcik)
      setAsama('bitti')
      // Doğrular da bildiriliyor: banka, üst üste üç kez doğru bilinen kaydı düşürüyor.
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: acidanBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
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

  /** `pas` true ise cevap verilmeden geçiliyor; yanlış sayılır. */
  const cevapla = useCallback(
    (pas: boolean) => {
      if (asama !== 'oynaniyor' || geriBildirim !== null) return
      const soru = sorular[sira]
      if (!soru) return
      if (!pas && girilen === '') return

      const dogruMu = !pas && Number(girilen) === soru.cevap
      setCevaplar((onceki) => [...onceki, { soru, dogruMu }])
      if (!dogruMu) setYanlisGirdileri((onceki) => [...onceki, pas ? '' : girilen])
      setGeriBildirim({ dogruMu, girilen: pas ? '' : girilen, soru })
      geriBildir(dogruMu)


      zamanlayiciRef.current = setTimeout(() => {
        setGeriBildirim(null)
        setGirilen('')
        if (elerMi(dogruMu, bankaTuru, gecerliMod)) {
          setElendi('yanlis')
          turBitir(cevaplarRef.current)
        } else {
          setSira((s) => s + 1)
        }
      }, CEVAP_BEKLEMESI)
    },
    [asama, bankaTuru, geriBildirim, girilen, sira, sorular, turBitir],
  )


  /**
   * Süre dolması cevap vermemekle aynı: soru pas geçilmiş sayılıyor.
   *
   * Matematik oyunlarında boss yok, dolayısıyla eleme de yok — süre dolunca
   * tur bitmiyor, sıradaki soruya geçiliyor.
   */
  const sureDoldu = useCallback(() => {
    cevapla(true)
  }, [cevapla])

  /** Tur saati bitti: yanlış değil, tur biter. */
  const turSuresiDoldu = () => {
    setElendi('sure')
    turBitir(cevaplarRef.current)
  }

  /*
    Rahat turda çıkış turu bitiriyor.

    Süre yok, yanlış elemiyor: turu bitirecek başka bir şey de yok. Doğrudan
    çıkılsaydı o turda yanlış bilinen sorular Oyun Bankası'na hiç düşmezdi ve
    modun tek amacı olan öğrenme kaybolurdu.
  */
  const turdanCik = () => {
    if (asama === 'oynaniyor' && gecerliMod === 'rahat' && cevaplarRef.current.length > 0) {
      turBitir(cevaplarRef.current)
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
    sure: soruSuresi('aci', null),
    anahtar: sira,
    onBitti: sureDoldu,
  })

  const rakamYaz = useCallback((rakam: string) => {
    setGirilen((onceki) => rakamEkle(onceki, rakam, EN_COK_RAKAM))
  }, [])

  const sil = useCallback(() => setGirilen((o) => o.slice(0, -1)), [])

  // Fiziksel klavye: telefonda kullanılmıyor ama tarayıcıda denemeyi mümkün kılıyor.
  useEffect(() => {
    if (asama !== 'oynaniyor' || yardimAcik) return
    const dinleyici = (olay: KeyboardEvent) => {
      if (olay.key >= '0' && olay.key <= '9') rakamYaz(olay.key)
      else if (olay.key === 'Backspace') sil()
      else if (olay.key === 'Enter') cevapla(false)
      else return
      olay.preventDefault()
    }
    window.addEventListener('keydown', dinleyici)
    return () => window.removeEventListener('keydown', dinleyici)
  }, [asama, yardimAcik, rakamYaz, sil, cevapla])

  const yardimAc = () => {
    setDuraklatilan(true)
    setYardimAcik(true)
  }

  const yardimKapat = () => {
    setDuraklatilan(false)
    setYardimAcik(false)
  }

  const dogruSayisi = cevaplar.filter((c) => c.dogruMu).length
  const soru = sorular[sira]

  return (
    <>
      <OyunKabugu
        oyunId="aci"
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
            girdiler={yanlisGirdileri}
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
              <div className="flex min-h-0 flex-1 flex-col gap-2.5 pt-3">
                {/* Kuralın adı yazmıyor: "Z kuralı" denseydi soru şekli okumadan
                    çözülürdü. Kural tur sonunda, yanlışların yanında çıkıyor. */}
                <div className="golge-kart flex min-h-0 flex-1 flex-col rounded-3xl bg-card px-3 pb-2.5 pt-3">
                  <div className="flex flex-none items-center gap-2 text-[12.5px] font-bold text-muted-foreground">
                    <Rabi durum="calisiyor" boyut={26} />
                    x kaç derece?
                  </div>

                  {/* Şekil boyu sabit değil: tuş takımı ile sayaç ekrandan
                      taşmasın diye kalan yere göre büyüyüp küçülüyor. Alt sınır
                      var, çünkü küçülen bir şekilde açılar okunmuyor. */}
                  <div className="grid min-h-[96px] flex-1 place-items-center">
                    <OyunSekli
                      sekil={aciSekli(soru)}
                      className="mx-auto h-full max-h-[190px] w-auto"
                    />
                  </div>
                </div>

                <CevapAlani
                  girilen={geriBildirim ? geriBildirim.girilen : girilen}
                  durum={
                    geriBildirim ? (geriBildirim.dogruMu ? 'dogru' : 'yanlis') : 'yaziliyor'
                  }
                  bosYazi={geriBildirim && !geriBildirim.dogruMu ? 'pas' : 'dereceyi yaz'}
                />

                <TusTakimi
                  kilitli={geriBildirim !== null}
                  bosMu={girilen === ''}
                  onRakam={rakamYaz}
                  onSil={sil}
                  onOnayla={() => cevapla(false)}
                  onPas={() => cevapla(true)}
                />
              </div>

              {geriBildirim && (
                <Bildirim
                  iyi={geriBildirim.dogruMu}
                  baslik={geriBildirim.dogruMu ? 'Aynen böyle!' : 'Olmadı'}
                  aciklama={
                    geriBildirim.dogruMu
                      ? ACI_KURALI_ADI[geriBildirim.soru.kural]
                      : `— doğrusu ${geriBildirim.soru.cevap}°`
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

function SonucGorunumu({
  sonuc,
  girdiler,
  rekor,
  bankaTuru,
  mod,
  elendi,
  onTekrar,
  onCik,
  bildir,
}: {
  sonuc: { ozet: TurOzeti<AciSorusu>; yeniRekor: boolean }
  /** Yanlışlarla aynı sıradaki girdiler; boş dize pas geçildiğini gösterir. */
  girdiler: string[]
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
      oyunId="aci"
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
          ? 'Banka soruları — üst üste üç doğruda düşerler.'
          : rekorCumlesi(ozet.dogru, rekor, yeniRekor, 'doğru')
      }
      bolumBasligi="Hangi kuralda takıldın"
      bolumAltYazisi="Kuralıyla birlikte — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.kural}-${yanlis.a}-${sira}`}
              oyunId="aci"
              soru={acidanBanka(yanlis)}
              bildir={bildir}
            >
              <b className="rakam block font-display text-[14px] font-extrabold leading-tight">
                {ACI_KURALI_ADI[yanlis.kural]} · x ={' '}
                <em className="not-italic text-success">{yanlis.cevap}°</em>
              </b>
              <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
                {girdiler[sira] ? (
                  <>
                    Sen <s className="rakam text-ikincil">{girdiler[sira]}°</s> yazdın
                  </>
                ) : (
                  'Pas geçtin'
                )}
              </span>
              <span className="mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
                {ACI_ACIKLAMASI[yanlis.kural]}
              </span>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
