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
  TUR_SURESI,
  YANLIS_CEZASI,
  guncelSeri,
  kalanSaniye,
  karistir,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { acidanBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
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
/** Bir turda üretilen soru sayısı — en hızlı oyuncunun bile tüketemeyeceği kadar. */
const TUR_SORUSU = 120
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
  onCik,
}: {
  istatistik: OyunIstatistigi
  /** Ses efektleri açık mı (Ayarlar → Mini oyun sesleri). */
  sesAcik: boolean
  /** Boş değilse tur yalnızca bu sorularla kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (ozet: TurOzeti<AciSorusu>, bankaCevaplari: BankaCevabi[]) => void
  onCik: () => void
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

  const [bitisZamani, setBitisZamani] = useState(0)
  const [kalan, setKalan] = useState(TUR_SURESI)
  /** Yardım açıkken sayaç durur; kalan saniye burada bekletilir. */
  const [duraklatilan, setDuraklatilan] = useState<number | null>(null)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<AciSorusu>; yeniRekor: boolean } | null>(
    null,
  )

  const bankaHavuzu = useMemo(() => bankaSorulariniCoz(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.length > 0

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<AciSorusu>[]>([])
  cevaplarRef.current = cevaplar
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setSorular(bankaTuru ? karistir(bankaHavuzu) : aciTuruHazirla(TUR_SORUSU))
    setSira(0)
    setGirilen('')
    setCevaplar([])
    setYanlisGirdileri([])
    setGeriBildirim(null)
    setSonuc(null)
    setDuraklatilan(null)
    setKalan(TUR_SURESI)
    setBitisZamani(Date.now() + TUR_SURESI * 1000)
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
      )
    },
    [bankaTuru, istatistik, onTurBitti, sesAcik],
  )

  // Sayaç hedef zaman damgasından okunuyor; arka plana atılan WebView'da sayarak
  // ilerleyen bir sayaç donup kalırdı.
  useEffect(() => {
    if (asama !== 'oynaniyor' || duraklatilan !== null) return

    const oku = () => {
      const yeni = kalanSaniye(bitisZamani)
      setKalan(yeni)
      if (yeni <= 0) turBitir(cevaplarRef.current)
    }
    oku()
    const isaret = setInterval(oku, 250)
    return () => clearInterval(isaret)
  }, [asama, bitisZamani, duraklatilan, turBitir])

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

      if (!dogruMu) setBitisZamani((b) => b - YANLIS_CEZASI * 1000)

      zamanlayiciRef.current = setTimeout(() => {
        setGeriBildirim(null)
        setGirilen('')
        setSira((s) => s + 1)
      }, CEVAP_BEKLEMESI)
    },
    [asama, geriBildirim, girilen, sira, sorular],
  )

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
    setDuraklatilan(kalanSaniye(bitisZamani))
    setYardimAcik(true)
  }

  const yardimKapat = () => {
    if (duraklatilan !== null) setBitisZamani(Date.now() + duraklatilan * 1000)
    setDuraklatilan(null)
    setYardimAcik(false)
  }

  const dogruSayisi = cevaplar.filter((c) => c.dogruMu).length
  const gorunenKalan = duraklatilan ?? kalan
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
                kalan: gorunenKalan,
                seri: guncelSeri(cevaplar),
                dogru: dogruSayisi,
                yanlis: cevaplar.length - dogruSayisi,
                enIyiSeri: turOzeti(cevaplar).enIyiSeri,
                rekor: Math.max(istatistik.enIyiDogru, dogruSayisi),
                cezaGorunur: geriBildirim !== null && !geriBildirim.dogruMu,
              }
        }
        onCik={onCik}
        onYardim={yardimAc}
      >
        {asama === 'bitti' && sonuc ? (
          <SonucGorunumu
            sonuc={sonuc}
            girdiler={yanlisGirdileri}
            rekor={turBasiRekor.current}
            bankaTuru={bankaTuru}
            onTekrar={turBaslat}
            onCik={onCik}
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
  onTekrar,
  onCik,
}: {
  sonuc: { ozet: TurOzeti<AciSorusu>; yeniRekor: boolean }
  /** Yanlışlarla aynı sıradaki girdiler; boş dize pas geçildiğini gösterir. */
  girdiler: string[]
  rekor: number
  bankaTuru: boolean
  onTekrar: () => void
  onCik: () => void
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
            <YanlisKarti key={`${yanlis.kural}-${yanlis.a}-${sira}`} oyunId="aci">
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
