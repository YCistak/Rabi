'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, X } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import type { SesOlayi, SesSorusu } from '@/lib/oyunlar/ses-havuzu'
import { OLAY_ACIKLAMASI, OLAY_ADI } from '@/lib/oyunlar/ses-havuzu'
import { turHazirla, type SesOyunSorusu, type SesSikki } from '@/lib/oyunlar/ses'
import {
  TUR_SURESI,
  YANLIS_CEZASI,
  guncelSeri,
  kalanSaniye,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { sestenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
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
import { OyunTanitim } from '@/components/oyun-tanitim'

/** Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms) — doğru ve yanlış için aynı. */
const CEVAP_BEKLEMESI = 1100

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type GeriBildirim = { secilen: SesOlayi; dogruMu: boolean; soru: SesSorusu }

/**
 * Banka kayıtlarından ses havuzu.
 *
 * Banka kaydı ekranda göstermek için gereken her şeyi taşıyor; tek eksik oyunun
 * beklediği biçim. Ses dışındaki kayıtlar eleniyor.
 */
function bankaHavuzu(kayitlar: readonly BankaKaydi[]): SesSorusu[] {
  const havuz: SesSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'ses') continue
    havuz.push({
      kelime: kayit.soru.kelime,
      olusum: kayit.soru.olusum,
      olay: kayit.soru.olay,
    })
  }
  return havuz
}

/**
 * Ses Olayları — mini oyun.
 *
 * Sözcüğün nasıl oluştuğu (**kitap + ı**) ekranda yazıyor, olayın adı yazmıyor.
 * Oluşum olmadan bazı sözcükler iki olaya birden uyuyormuş gibi görünüyor —
 * *hakkı* sözcüğüne kökünü bilmeden bakan ünsüz türemesiyle yumuşamayı
 * ayıramaz. Oluşum ipucu değil, sorunun bir parçası.
 */
export function SesOyunuEkrani({
  istatistik,
  sesAcik,
  bankaSorulari,
  onTurBitti,
  onCik,
}: {
  istatistik: OyunIstatistigi
  sesAcik: boolean
  /** Boş değilse tur yalnızca bu sorularla kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (ozet: TurOzeti<SesSorusu>, bankaCevaplari: BankaCevabi[]) => void
  onCik: () => void
}) {
  const oyun = oyunBul('ses')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<SesOyunSorusu[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<SesSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)

  const [bitisZamani, setBitisZamani] = useState(0)
  const [kalan, setKalan] = useState(TUR_SURESI)
  /** Yardım açıkken sayaç durur; kalan saniye burada bekletilir. */
  const [duraklatilan, setDuraklatilan] = useState<number | null>(null)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<SesSorusu>; yeniRekor: boolean } | null>(
    null,
  )

  const havuz = useMemo(() => bankaHavuzu(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<SesSorusu>[]>([])
  cevaplarRef.current = cevaplar
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setSorular(havuz.length > 0 ? turHazirla(havuz) : turHazirla())
    setSira(0)
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setDuraklatilan(null)
    setKalan(TUR_SURESI)
    setBitisZamani(Date.now() + TUR_SURESI * 1000)
    setAsama('oynaniyor')
  }, [havuz, istatistik.enIyiDogru])

  const turBitir = useCallback(
    (verilenler: Cevap<SesSorusu>[]) => {
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
          soru: sestenBanka(cevap.soru),
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

  // Havuz tükenirse tur süre dolmadan biter — banka turunda sık oluyor.
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

  const cevapla = (sik: SesSikki) => {
    // Geri bildirim gösterilirken ikinci dokunuş yok sayılıyor; yoksa aynı
    // soruya iki cevap yazılır ve süre iki kez cezalandırılırdı.
    if (asama !== 'oynaniyor' || geriBildirim !== null) return

    const soru = sorular[sira]
    if (!soru) return

    const dogruMu = sik.dogruMu
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu }])
    setGeriBildirim({ secilen: sik.deger, dogruMu, soru: soru.soru })
    geriBildir(dogruMu)

    if (!dogruMu) setBitisZamani((b) => b - YANLIS_CEZASI * 1000)

    zamanlayiciRef.current = setTimeout(() => {
      setGeriBildirim(null)
      setSira((s) => s + 1)
    }, CEVAP_BEKLEMESI)
  }

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

  const maskotDurumu: MaskotDurumu = geriBildirim
    ? geriBildirim.dogruMu
      ? 'kutlama'
      : 'uzgun'
    : 'calisiyor'

  return (
    <>
      <OyunKabugu
        oyunId="ses"
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
            rekor={turBasiRekor.current}
            bankaTuru={bankaTuru}
            onTekrar={turBaslat}
            onCik={onCik}
          />
        ) : (
          asama === 'oynaniyor' &&
          soru && (
            <>
              <div className="flex flex-1 flex-col justify-center gap-3 py-2">
                <div className="grid place-items-center">
                  <Rabi durum={maskotDurumu} boyut={54} />
                </div>

                {/* Yalnızca sözcük: oluşumu ("burun + u") burada göstermek
                    cevabı ele veriyordu — ses olayı zaten orada görünüyor.
                    Oluşum, cevaptan sonra geri bildirimde ve tur sonunda çıkar. */}
                <div className="golge-kart rounded-[20px] bg-card px-4 py-4 text-center">
                  <p className="font-display text-[26px] font-extrabold leading-none tracking-tight">
                    {soru.soru.kelime}
                  </p>
                </div>

                <p className="text-center font-display text-[14px] font-extrabold">
                  Hangi ses olayı var?
                </p>

                <div className="flex flex-col gap-2">
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
                  aciklama={
                    geriBildirim.dogruMu
                      ? soru.soru.olusum
                      : `${geriBildirim.soru.olusum} — doğrusu ${OLAY_ADI[
                          geriBildirim.soru.olay
                        ].toLocaleLowerCase('tr')}`
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
 * Cevaptan sonra doğru şık her hâlükârda yeşile dönüyor: yanlış seçen oyuncu
 * hangisi olması gerektiğini aynı ekranda görüyor.
 */
function SikDugmesi({
  sik,
  geriBildirim,
  onSec,
}: {
  sik: SesSikki
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
        'golge-kart flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[16px] border-2 px-3 py-2.5',
        'font-display text-[15.5px] font-extrabold leading-snug transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        !acikta && 'border-border bg-card active:brightness-95',
        dogruSecim && 'border-success bg-success text-white',
        yanlisSecim && 'border-ikincil bg-ikincil text-white',
        isaretli && 'border-success bg-card text-success',
        acikta && !secilen && !sik.dogruMu && 'border-border bg-card opacity-45',
      )}
    >
      <span className="min-w-0 break-words">{sik.metin}</span>
      {(dogruSecim || isaretli) && <Check size={18} className="shrink-0" aria-hidden />}
      {yanlisSecim && <X size={18} className="shrink-0" aria-hidden />}
    </button>
  )
}

function SonucGorunumu({
  sonuc,
  rekor,
  bankaTuru,
  onTekrar,
  onCik,
}: {
  sonuc: { ozet: TurOzeti<SesSorusu>; yeniRekor: boolean }
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
      oyunId="ses"
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
      bolumBasligi="Karıştırdıkların"
      bolumAltYazisi="Kuralıyla birlikte — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti key={`${yanlis.kelime}-${sira}`} oyunId="ses">
              <b className="block font-display text-[13.5px] font-extrabold leading-tight">
                {yanlis.kelime}
              </b>
              <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
                {yanlis.olusum} · {OLAY_ADI[yanlis.olay]}
              </span>
              <span className="mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
                {OLAY_ACIKLAMASI[yanlis.olay]}
              </span>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
