'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import type { OyunIstatistigi } from '@/lib/types'
import {
  BOLGE_ADI,
  SORU_HAVUZU,
  konumMetni,
  sorulanBul,
} from '@/lib/oyunlar/periyodik-havuzu'
import {
  asamaKur,
  dogruCevap,
  eliKur,
  type PeriyodikEli,
  type PeriyodikSorusu,
} from '@/lib/oyunlar/periyodik'
import {
  guncelSeri,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { periyodiktenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
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
import { BolgeAciklamasi, PeriyodikTablo } from '@/components/periyodik-tablo'

/** Cevaptan sonra doğrusunun tabloda görünmesi için beklenen süre. */
const CEVAP_BEKLEMESI = 1100

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

/** `secilen` süre dolduğunda `null`: hiçbir şıkka dokunulmadı. */
type GeriBildirim = { secilen: string | null; dogruMu: boolean; soru: PeriyodikSorusu }

/**
 * Banka kayıtlarından el listesi.
 *
 * Normal turda bir el, ilk 20'deyse iki aşama taşıyor; banka turunda ise her
 * kayıt **tek bir aşama**. Sebebi bankanın kendi kuralı: kayıt "17'nin adını
 * bilemedin" diyor, sembolü değil. İkinci aşama eklenseydi bankada hiç
 * yanlışlanmamış bir soru tekrar tekrar sorulurdu.
 */
function bankaElleriniCoz(kayitlar: readonly BankaKaydi[]): PeriyodikEli[] {
  const eller: PeriyodikEli[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'periyodik') continue
    const element = sorulanBul(kayit.soru.numara)
    // Havuzdan çıkarılmış bir element kaydı sessizce eleniyor.
    if (!element) continue
    eller.push({ element, asamalar: [asamaKur(element, kayit.soru.asama)] })
  }
  return eller
}

export function PeriyodikOyunuEkrani({
  istatistik,
  sesAcik,
  bankaSorulari,
  onTurBitti,
  onCik,
  bildir,
}: {
  istatistik: OyunIstatistigi
  sesAcik: boolean
  bankaSorulari: BankaKaydi[]
  onTurBitti: (
    ozet: TurOzeti<PeriyodikSorusu>,
    bankaCevaplari: BankaCevabi[],
    gecenSaniye: number,
  ) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('periyodik')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [eller, setEller] = useState<SiradakiSoru<PeriyodikEli>[]>([])
  const [elSira, setElSira] = useState(0)
  /** Bu elementin kaçıncı aşamasındayız: 0 ad, 1 sembol. */
  const [asamaSira, setAsamaSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap<PeriyodikSorusu>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)
  const [elendi, setElendi] = useState<Eleme>(false)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukPeriyodik, 'kolay')
  const [duraklatilan, setDuraklatilan] = useState(false)

  const [sonuc, setSonuc] = useState<{
    ozet: TurOzeti<PeriyodikSorusu>
    yeniRekor: boolean
  } | null>(null)

  const havuz = useMemo(() => bankaElleriniCoz(bankaSorulari), [bankaSorulari])
  const bankaTuru = havuz.length > 0

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<PeriyodikSorusu>[]>([])
  cevaplarRef.current = cevaplar
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setEller(
      bankaTuru
        ? havuz.map((el) => ({ soru: el, boss: false }))
        : /*
             Çeldiriciler seviyeye göre süzülmüş havuzdan değil havuzun
             tamamından seçiliyor: "adı hangisi" sorusunun en iyi yanlış şıkkı
             aynı gruptan bir element ve o element başka bir seviyede olabilir
             (klorun karşısına brom). Süzgeç sorulan elemente ait, çeldiriciye
             değil.
          */
          turSirasi(SORU_HAVUZU, 'periyodik', zorluk).map(({ soru, boss }) => ({
            soru: eliKur(soru),
            boss,
          })),
    )
    setElSira(0)
    setAsamaSira(0)
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setElendi(false)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [bankaTuru, havuz, istatistik.enIyiDogru, zorluk])

  const turBitir = useCallback(
    (verilenler: Cevap<PeriyodikSorusu>[]) => {
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
          soru: periyodiktenBanka(cevap.soru.element, cevap.soru.asama),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
      )
    },
    [bankaTuru, istatistik, onTurBitti, sesAcik],
  )

  // Havuz tükenirse tur biter — banka turunda sık oluyor.
  useEffect(() => {
    if (asama !== 'oynaniyor' || eller.length === 0) return
    if (elSira >= eller.length) turBitir(cevaplarRef.current)
  }, [asama, elSira, eller.length, turBitir])

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

  const sirali = eller[elSira]
  const el = sirali?.soru
  const soru = el?.asamalar[asamaSira]
  const boss = sirali?.boss ?? false

  const ilerle = (dogruMu: boolean, bossMuydu: boolean) => {
    const kalanAsama = (el?.asamalar.length ?? 0) - asamaSira - 1
    zamanlayiciRef.current = setTimeout(() => {
      setGeriBildirim(null)
      if (elerMi(dogruMu, bankaTuru)) {
        setElendi(bossMuydu ? 'boss' : 'yanlis')
        turBitir(cevaplarRef.current)
        return
      }
      // Sembol sorusu ancak ad doğru bilinince geliyor; yanlışta bu element
      // kapanıyor (banka turunda yanlış elemiyor, o yüzden buraya düşülüyor).
      if (dogruMu && kalanAsama > 0) {
        setAsamaSira((s) => s + 1)
      } else {
        setElSira((s) => s + 1)
        setAsamaSira(0)
      }
    }, CEVAP_BEKLEMESI)
  }

  const cevapla = (secilen: string) => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    const dogruMu = secilen === dogruCevap(soru)
    setCevaplar((onceki) => [...onceki, { soru, dogruMu }])
    setGeriBildirim({ secilen, dogruMu, soru })
    geriBildir(dogruMu)
    ilerle(dogruMu, boss)
  }

  /** Süre dolması cevap vermemekle aynı: yanlış sayılıyor. */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || geriBildirim !== null || !soru) return
    setCevaplar((onceki) => [...onceki, { soru, dogruMu: false }])
    setGeriBildirim({ secilen: null, dogruMu: false, soru })
    geriBildir(false)
    ilerle(false, boss)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, soru, boss])

  const { kalan, toplam } = useSoruSayaci({
    aktif: asama === 'oynaniyor' && geriBildirim === null && !duraklatilan && soru !== undefined,
    sure: soruSuresi('periyodik', boss ? bossZorlugu(zorluk) : null),
    // Aşama da anahtara giriyor: aynı elementin ikinci sorusu yeni bir soru,
    // sayaç baştan başlamalı.
    anahtar: elSira * 2 + asamaSira,
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

  return (
    <>
      <OyunKabugu
        oyunId="periyodik"
        baslik={oyun.ad}
        sayac={
          asama === 'bitti'
            ? null
            : {
                kalan,
                toplam,
                /*
                  Sıra element sayıyor, cevap değil: boss her on **elementte**
                  bir geliyor ve şeritteki "Boss'a kalan" da onu sayıyor. İlk
                  20'de bir element iki cevap demek; cevapla sayılsaydı şerit
                  boss'u iki kat erken vaat ederdi.
                */
                sira: elSira + 1,
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
            <div className="flex flex-1 flex-col gap-2.5 py-2">
              <div className="my-auto flex flex-col gap-2.5">
                <SoruMetni soru={soru} />

                <PeriyodikTablo
                  isaretli={soru.element.numara}
                  durum={
                    geriBildirim === null ? 'soru' : geriBildirim.dogruMu ? 'dogru' : 'yanlis'
                  }
                />

                <BolgeAciklamasi />
              </div>

              <div className="grid flex-none grid-cols-2 gap-2">
                {soru.siklar.map((sik) => {
                  const secilen = geriBildirim?.secilen === sik
                  const dogru = geriBildirim !== null && sik === dogruCevap(soru)
                  return (
                    <button
                      key={sik}
                      type="button"
                      disabled={geriBildirim !== null}
                      onClick={() => cevapla(sik)}
                      className={cn(
                        'golge-kart h-[62px] rounded-[18px] px-2 font-display text-[17px] font-extrabold transition active:scale-[0.98]',
                        dogru
                          ? 'bg-success text-white'
                          : secilen
                            ? 'bg-ikincil text-white'
                            : 'bg-card text-foreground',
                      )}
                    >
                      {sik}
                    </button>
                  )
                })}
              </div>

              {geriBildirim && (
                <Bildirim
                  iyi={geriBildirim.dogruMu}
                  baslik={geriBildirim.dogruMu ? 'Doğru!' : 'Olmadı'}
                  aciklama={bildirimAciklamasi(geriBildirim)}
                />
              )}
            </div>
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
 * Cevap satırı.
 *
 * Doğruda elementin konumu yazıyor, cevabın kendisi değil: "Klor" zaten
 * şıkta duruyordu, öğrenilecek olan onun 3. periyot 7A'da olduğu.
 */
function bildirimAciklamasi({ secilen, dogruMu, soru }: GeriBildirim): string {
  const { element } = soru
  if (dogruMu) {
    return soru.asama === 'ad'
      ? `${element.ad} · ${konumMetni(element.numara)}`
      : `${element.ad} → ${element.sembol} · ${BOLGE_ADI[element.bolge]}`
  }
  const dogru = dogruCevap(soru)
  return secilen === null ? `doğrusu ${dogru}` : `${secilen} değil — doğrusu ${dogru}`
}

/** Soru satırı — iki aşamada da aynı yükseklikte, ekran zıplamasın. */
function SoruMetni({ soru }: { soru: PeriyodikSorusu }) {
  return (
    <div className="flex-none text-center">
      <p className="text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
        {soru.asama === 'ad' ? 'Bu element hangisi?' : 'Sembolü hangisi?'}
      </p>
      <p className="mt-0.5 font-display text-[22px] font-extrabold leading-tight">
        {soru.asama === 'ad' ? (
          <>
            <span className="rakam">{soru.element.numara}</span>{' '}
            <span className="text-[15px] font-bold text-muted-foreground">numara</span>
          </>
        ) : (
          <>
            {soru.element.ad}{' '}
            <span className="rakam text-[15px] font-bold text-muted-foreground">
              · {soru.element.numara}
            </span>
          </>
        )}
      </p>
    </div>
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
  sonuc: { ozet: TurOzeti<PeriyodikSorusu>; yeniRekor: boolean }
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
      oyunId="periyodik"
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
      bolumBasligi="Bilemediklerin"
      bolumAltYazisi="Tablodaki yerleriyle — asıl öğrenme burada."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((yanlis, sira) => (
            <YanlisKarti
              key={`${yanlis.element.numara}-${yanlis.asama}-${sira}`}
              oyunId="periyodik"
              soru={periyodiktenBanka(yanlis.element, yanlis.asama)}
              bildir={bildir}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 flex-none flex-col items-center justify-center rounded-xl bg-kmy-kart">
                  <span className="rakam text-[10px] font-bold text-kmy-koyu">
                    {yanlis.element.numara}
                  </span>
                  <span className="font-display text-[15px] font-extrabold leading-none text-kmy-koyu">
                    {yanlis.element.sembol}
                  </span>
                </div>
                <div className="min-w-0">
                  <b className="block font-display text-[14px] font-extrabold leading-tight">
                    {yanlis.element.ad}
                  </b>
                  <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
                    {konumMetni(yanlis.element.numara)} · {BOLGE_ADI[yanlis.element.bolge]}
                  </span>
                </div>
              </div>
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
