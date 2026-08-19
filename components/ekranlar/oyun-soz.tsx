'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, X } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import type { SozSorusu } from '@/lib/oyunlar/soz-havuzu'
import { SOZ_HAVUZU, TUR_ACIKLAMASI, TUR_ADI } from '@/lib/oyunlar/soz-havuzu'
import { turHazirla, type SozOyunSorusu, type SozSikki } from '@/lib/oyunlar/soz'
import {
  guncelSeri,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { sozdenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
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
import { OyunTanitim } from '@/components/oyun-tanitim'

/** Cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms) — doğru ve yanlış için aynı. */
const CEVAP_BEKLEMESI = 1100

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/**
 * `ritim.ts`'in kurduğu sıraya şıkları ekler.
 *
 * Sıra korunmalı: boss soruları belirli konumlara yerleştirilmiş durumda,
 * `turHazirla` varsayılan hâlinde yeniden karıştırıp o yerleşimi bozardı.
 */
function sirayiKur(sira: SiradakiSoru<SozSorusu>[]): SiradakiSoru<SozOyunSorusu>[] {
  const sorular = turHazirla(
    sira.map((s) => s.soru),
    Math.random,
    false,
  )
  return sorular.map((soru, i) => ({ soru, boss: sira[i].boss }))
}

/** `secilen` süre dolduğunda `null`: oyuncu bir şık işaretlemedi. */
type GeriBildirim = { secilen: SozSorusu | null; dogruMu: boolean; soru: SozSorusu }

/**
 * Banka kayıtlarından ses havuzu.
 *
 * Banka kaydı ekranda göstermek için gereken her şeyi taşıyor; tek eksik oyunun
 * beklediği biçim. Ses dışındaki kayıtlar eleniyor.
 */
function bankaHavuzu(kayitlar: readonly BankaKaydi[]): SozSorusu[] {
  const havuz: SozSorusu[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'soz') continue
    havuz.push({
      soz: kayit.soru.soz,
      anlam: kayit.soru.anlam,
      tur: kayit.soru.sozTuru,
      konu: kayit.soru.konu,
      // Banka turunda zorluk seçilmiyor, boss da gelmiyor.
      zorluk: 'orta' as const,
    })
  }
  return havuz
}

/**
 * Deyim ve Atasözü — mini oyun.
 *
 * Sözün deyim mi atasözü mü olduğu soruda **yazılı**. Gizlenseydi oyuncu iki
 * şeyi birden tahmin ederdi ama yalnız biri soruluyor; tür bilgisi sorunun
 * kendisi değil, bağlamı. Ayrımın kuralı tur sonunda, yanlış bilinenlerin
 * altında anlatılıyor.
 */
export function SozOyunuEkrani({
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
    ozet: TurOzeti<SozSorusu>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — tur artık sabit süreli değil. */
    gecenSaniye: number,
  ) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('soz')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<SiradakiSoru<SozOyunSorusu>[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<SozSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  /** Turu ne bitirdi — tur sonu ekranı boss ile sıradan yanlışı ayrı söylüyor. */
  const [elendi, setElendi] = useState<Eleme>(false)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukSoz, 'kolay')
  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<SozSorusu>; yeniRekor: boolean } | null>(
    null,
  )

  const havuz = useMemo(() => bankaHavuzu(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0

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
  const cevaplarRef = useRef<Cevap<SozSorusu>[]>([])
  cevaplarRef.current = cevaplar
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    // Banka turunda zorluk ve boss yok: sorular kullanıcının kendi yanlışları,
    // hepsi bir kez sorulup tur bitiyor.
    setSorular(
      bankaTuru
        ? turHazirla(havuz).map((soru) => ({ soru, boss: false }))
        : sirayiKur(turSirasi(SOZ_HAVUZU, 'soz', zorluk)),
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
    (verilenler: Cevap<SozSorusu>[]) => {
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
          soru: sozdenBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
      )
    },
    [bankaTuru, istatistik, onTurBitti, sesAcik],
  )

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

  const sirali = sorular[sira]
  const soru = sirali?.soru
  const boss = sirali?.boss ?? false

  /**
   * Cevaptan sonraki geçiş.
   *
   * Yanlış cevap turu bitiriyor (banka turu hariç); boss'un farkı sorunun bir
   * üst zorluktan gelmesi. Bekleme süresi ikisinde de aynı: doğrusunu okumadan
   * ekranın değişmesi, elenirken bile öğretmeyi bırakmak olurdu.
   */
  const ilerle = (dogruMu: boolean, bossMuydu: boolean) => {
    zamanlayiciRef.current = setTimeout(() => {
      setGeriBildirim(null)
      if (elerMi(dogruMu, bankaTuru)) {
        setElendi(bossMuydu ? 'boss' : 'yanlis')
        turBitir(cevaplarRef.current)
      } else {
        setSira((s) => s + 1)
      }
    }, CEVAP_BEKLEMESI)
  }

  const cevapla = (sik: SozSikki) => {
    // Geri bildirim gösterilirken ikinci dokunuş yok sayılıyor; yoksa aynı
    // soruya iki cevap yazılırdı.
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return

    const dogruMu = sik.dogruMu
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu }])
    setGeriBildirim({ secilen: sik.deger, dogruMu, soru: soru.soru })
    geriBildir(dogruMu)
    ilerle(dogruMu, boss)
  }

  /** Süre dolması cevap vermemekle aynı: yanlış sayılıyor ve turu bitiriyor. */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu: false }])
    setGeriBildirim({ secilen: null, dogruMu: false, soru: soru.soru })
    geriBildir(false)
    ilerle(false, boss)
    // `ilerle` ve `geriBildir` her renderda yeniden kuruluyor; sayaç yalnızca
    // güncel olanı çağırsın diye bağımlılıklar bilerek dar tutuldu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, soru, boss])

  const { kalan, toplam } = useSoruSayaci({
    aktif: asama === 'oynaniyor' && geriBildirim === null && !duraklatilan && soru !== undefined,
    sure: soruSuresi('soz', boss ? bossZorlugu(zorluk) : null),
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
        oyunId="soz"
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
            <>
              <div className="flex flex-1 flex-col justify-center gap-3 py-2">
                <div className="grid place-items-center">
                  <Rabi durum={maskotDurumu} boyut={54} />
                </div>

                <div className="golge-kart rounded-[20px] bg-card px-4 py-4">
                  <p className="mb-1.5 text-center text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-yzm-koyu">
                    {TUR_ADI[soru.soru.tur]}
                  </p>
                  <p className="text-center font-display text-[20px] font-extrabold leading-snug tracking-tight">
                    {soru.soru.soz}
                  </p>
                </div>

                <p className="text-center font-display text-[14px] font-extrabold">
                  Anlamı hangisi?
                </p>

                <div className="flex flex-col gap-2">
                  {soru.siklar.map((sik) => (
                    <SikDugmesi
                      key={sik.deger.soz}
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
                      ? geriBildirim.soru.anlam
                      : `— doğrusu “${geriBildirim.soru.anlam}”`
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
        ekstra={
          asama === 'tanitim' && !bankaTuru ? (
            <ZorlukSecimi secili={zorluk} onSec={setZorluk} bossVar />
          ) : null
        }
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
  sik: SozSikki
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
        'golge-kart flex min-h-[52px] w-full items-center justify-between gap-2 rounded-[16px] border-2 px-3.5 py-2.5 text-left',
        'font-display text-[14px] font-bold leading-snug transition',
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
  elendi,
  onTekrar,
  onCik,
  bildir,
}: {
  sonuc: { ozet: TurOzeti<SozSorusu>; yeniRekor: boolean }
  rekor: number
  bankaTuru: boolean
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
      oyunId="soz"
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
      bolumBasligi="Karıştırdıkların"
      bolumAltYazisi="Anlamı ve türüyle birlikte — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.soz}-${sira}`}
              oyunId="soz"
              soru={sozdenBanka(yanlis)}
              bildir={bildir}
            >
              <b className="block font-display text-[13.5px] font-extrabold leading-tight">
                {yanlis.soz}
              </b>
              <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
                {yanlis.anlam}
              </span>
              {/* Deyim–atasözü ayrımı ÖSYM'nin ayrıca sorduğu bir konu; sözü
                  öğrenirken hangisi olduğunun kuralı da görünsün. */}
              <span className="mt-1.5 block border-t border-border pt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
                <b className="font-extrabold text-yzm-koyu">{TUR_ADI[yanlis.tur]}</b> ·{' '}
                {TUR_ACIKLAMASI[yanlis.tur]}
              </span>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
