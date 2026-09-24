'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import type { OyunId, OyunIstatistigi } from '@/lib/types'
import { bankaKimligi, type BankaCevabi, type BankaKaydi, type BankaSorusu } from '@/lib/oyunlar/banka'
import { guncelSeri, rekorKirildiMi, turOzeti, type Cevap, type TurOzeti } from '@/lib/oyunlar/tur'
import { akisUzunlugu, elerMi, soruSuresi, tekAkis, turSirasi, TUR_SORU_SINIRI, type SoruAkisi, type Zorluk } from '@/lib/oyunlar/ritim'
import { modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { useTurSayaci } from '@/lib/oyunlar/tur-sayaci'
import { useEtkinMod, useUyarlananZorluk } from '@/components/tur-ayari-baglami'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { oyunSesiCal } from '@/lib/oyunlar/oyun-sesi'
import { useGeriKatmani } from '@/lib/geri'
import { Rabi } from '@/components/maskot/rabi'
import { Bildirim, EN_COK_YANLIS, KalanHapi, OyunKabugu, TurSonu, YanlisKarti, rekorCumlesi, type Eleme } from '@/components/oyun-kabuk'
import { OyunTanitim } from '@/components/oyun-tanitim'
import type { BildirimKolu } from '@/components/hata-bildir'

type Soru = { id: string; zorluk: Zorluk }
type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

export type BulmacaOzellikleri<T extends Soru, V> = {
  oyunId: OyunId
  havuz: readonly T[]
  istatistik: OyunIstatistigi
  sesAcik: boolean
  bankaSorulari: BankaKaydi[]
  bankadanCoz: (kayit: BankaKaydi) => T | null
  bankayaCevir: (soru: T) => BankaSorusu
  ilkSecim: () => V
  secimHazirMi: (secim: V) => boolean
  dogruMu: (soru: T, secim: V) => boolean
  aciklama: (soru: T) => string
  soruMetni: (soru: T) => string
  ciz: (soru: T, secim: V, setSecim: (secim: V) => void, kilitli: boolean, sonuc: boolean | null) => ReactNode
  onTurBitti: (ozet: TurOzeti<T>, cevaplar: BankaCevabi[], saniye: number, yarim: boolean) => void
  onCik: () => void
  bildir: BildirimKolu
  gorulenler: readonly string[]
}

/** Mol bulmacasının tur, banka ve sayaç kurallarını bir arada tutar. */
export function BulmacaOyunuEkrani<T extends Soru, V>({
  oyunId, havuz, istatistik, sesAcik, bankaSorulari, bankadanCoz, bankayaCevir,
  ilkSecim, secimHazirMi, dogruMu, aciklama, soruMetni, ciz, onTurBitti,
  onCik, bildir, gorulenler,
}: BulmacaOzellikleri<T, V>) {
  const oyun = oyunBul(oyunId)
  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)
  const [duraklatilan, setDuraklatilan] = useState(false)
  const [sorular, setSorular] = useState<SoruAkisi<T>>(tekAkis([]))
  const [sira, setSira] = useState(0)
  const [secim, setSecim] = useState<V>(ilkSecim)
  const [cevaplar, setCevaplar] = useState<Cevap<T>[]>([])
  const [geriBildirim, setGeriBildirim] = useState<{ soru: T; dogruMu: boolean } | null>(null)
  const [elendi, setElendi] = useState<Eleme>(false)
  const [turNo, setTurNo] = useState(0)
  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<T>; yeniRekor: boolean } | null>(null)
  const { zorluk, kaydet: zorlukKaydet, sifirla: zorluguSifirla } = useUyarlananZorluk()

  const bankaHavuzu = useMemo(() => bankaSorulari.map(bankadanCoz).filter((soru): soru is T => soru !== null), [bankaSorulari, bankadanCoz])
  const bankaTuru = bankaHavuzu.length > 0
  const gecerliMod = useEtkinMod(bankaTuru)
  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<T>[]>([])
  cevaplarRef.current = cevaplar
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setTurNo((n) => n + 1)
    setSorular(bankaTuru ? tekAkis(bankaHavuzu) : turSirasi(havuz, Math.random, TUR_SORU_SINIRI, {
      gorulenler,
      anahtar: (soru) => bankaKimligi(bankayaCevir(soru)),
    }))
    zorluguSifirla()
    setSira(0)
    setSecim(ilkSecim())
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setElendi(false)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [istatistik.enIyiDogru, bankaTuru, bankaHavuzu, havuz, gorulenler, bankayaCevir, ilkSecim, zorluguSifirla])

  const turBitir = useCallback((verilenler: Cevap<T>[], yarim = false) => {
    if (bittiRef.current) return
    bittiRef.current = true
    const ozet = turOzeti(verilenler)
    setSonuc({
      ozet,
      yeniRekor: !yarim && !bankaTuru && modKayitliMi(gecerliMod) &&
        rekorKirildiMi({ ...istatistik, enIyiDogru: turBasiRekor.current }, ozet),
    })
    oyunSesiCal('bitis', sesAcik)
    setAsama('bitti')
    onTurBitti(ozet, verilenler.map((verilen) => ({ soru: bankayaCevir(verilen.soru), dogruMu: verilen.dogruMu })), Math.round((Date.now() - turBasladiRef.current) / 1000), yarim)
  }, [bankaTuru, gecerliMod, istatistik, sesAcik, onTurBitti, bankayaCevir])

  useEffect(() => {
    const uzunluk = akisUzunlugu(sorular)
    if (asama === 'oynaniyor' && uzunluk > 0 && sira >= uzunluk) turBitir(cevaplarRef.current)
  }, [asama, sira, sorular, turBitir])

  useEffect(() => () => {
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
  }, [])

  const soru = sorular[zorluk][sira]

  const ilerle = (dogru: boolean) => {
    zamanlayiciRef.current = setTimeout(() => {
      setGeriBildirim(null)
      zorlukKaydet(dogru)
      if (elerMi(dogru, bankaTuru, gecerliMod)) {
        setElendi('yanlis')
        turBitir(cevaplarRef.current)
      } else {
        setSecim(ilkSecim())
        setSira((onceki) => onceki + 1)
      }
    }, 1800)
  }

  const cevapla = (suresiDoldu = false) => {
    if (asama !== 'oynaniyor' || geriBildirim || !soru || (!suresiDoldu && !secimHazirMi(secim))) return
    const dogru = !suresiDoldu && dogruMu(soru, secim)
    setCevaplar((onceki) => [...onceki, { soru, dogruMu: dogru }])
    setGeriBildirim({ soru, dogruMu: dogru })
    oyunSesiCal(dogru ? 'dogru' : 'yanlis', sesAcik)
    if (Capacitor.isNativePlatform()) {
      void (dogru ? Haptics.impact({ style: ImpactStyle.Light }) : Haptics.notification({ type: NotificationType.Error })).catch(() => {})
    }
    ilerle(dogru)
  }

  const sureDoldu = useCallback(() => {
    cevapla(true)
    // Sayaç her çizimde güncel geri çağrıyı kullanıyor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, geriBildirim, soru, secim])

  const turSuresiDoldu = () => {
    setElendi('sure')
    turBitir(cevaplarRef.current)
  }

  const turdanCik = () => {
    if (asama === 'oynaniyor' && cevaplarRef.current.length > 0) turBitir(cevaplarRef.current, true)
    else onCik()
  }

  const { kalan, toplam } = useTurSayaci({
    mod: gecerliMod,
    turNo,
    yanlisSayisi: cevaplar.filter((c) => !c.dogruMu).length,
    onTurBitti: turSuresiDoldu,
    aktif: asama === 'oynaniyor' && geriBildirim === null && !duraklatilan && soru !== undefined,
    sure: soruSuresi(oyunId),
    anahtar: sira,
    onBitti: sureDoldu,
  })

  const dogruSayisi = cevaplar.filter((c) => c.dogruMu).length

  return <>
    <OyunKabugu
      oyunId={oyunId}
      baslik={oyun.ad}
      sayac={asama === 'bitti' ? null : {
        kalan, toplam, sira: sira + 1, mod: gecerliMod,
        seri: guncelSeri(cevaplar), dogru: dogruSayisi,
        yanlis: cevaplar.length - dogruSayisi,
        enIyiSeri: turOzeti(cevaplar).enIyiSeri,
        rekor: Math.max(istatistik.enIyiDogru, dogruSayisi),
      }}
      onCik={turdanCik}
      onYardim={() => { setDuraklatilan(true); setYardimAcik(true) }}
    >
      {asama === 'bitti' && sonuc ? (
        <TurSonu
          oyunId={oyunId}
          dogru={sonuc.ozet.dogru}
          yanlis={sonuc.ozet.yanlis}
          enIyiSeri={sonuc.ozet.enIyiSeri}
          rekor={turBasiRekor.current}
          yeniRekor={sonuc.yeniRekor}
          bankaTuru={bankaTuru}
          mod={gecerliMod as OyunModu}
          elendi={elendi}
          altBaslik={bankaTuru ? 'Banka soruları — genel testte doğru bilince düşerler.' : rekorCumlesi(sonuc.ozet.dogru, turBasiRekor.current, sonuc.yeniRekor, 'doğru')}
          bolumBasligi="Karıştırdıkların"
          bolumAltYazisi="Çözüm oranını ve yolu yeniden incele."
          onTekrar={turBaslat}
          onCik={onCik}
        >
          {sonuc.ozet.yanlislar.slice(0, EN_COK_YANLIS).map((yanlis, i) => (
            <YanlisKarti key={`${yanlis.id}-${i}`} oyunId={oyunId} soru={bankayaCevir(yanlis)} bildir={bildir}>
              <b className="block text-[13px]">{soruMetni(yanlis)}</b>
              <span className="mt-1 block text-[12px] font-bold">{aciklama(yanlis)}</span>
            </YanlisKarti>
          ))}
          {sonuc.ozet.yanlislar.length > EN_COK_YANLIS && <KalanHapi kalan={sonuc.ozet.yanlislar.length - EN_COK_YANLIS} />}
        </TurSonu>
      ) : asama === 'oynaniyor' && soru ? <>
        <div className="flex flex-1 flex-col justify-center gap-3 py-3">
          <div className="grid place-items-center"><Rabi durum={geriBildirim ? geriBildirim.dogruMu ? 'kutlama' : 'uzgun' : 'calisiyor'} boyut={48} /></div>
          {ciz(soru, secim, setSecim, geriBildirim !== null, geriBildirim?.dogruMu ?? null)}
          <button
            type="button"
            disabled={geriBildirim !== null || !secimHazirMi(secim)}
            onClick={() => cevapla()}
            className="min-h-12 rounded-2xl bg-primary-parlak px-5 py-3 font-display font-extrabold text-white disabled:opacity-45 active:brightness-95"
          >Kontrol et</button>
        </div>
        {geriBildirim && <Bildirim iyi={geriBildirim.dogruMu} baslik={geriBildirim.dogruMu ? 'Doğru!' : 'Olmadı'} aciklama={aciklama(geriBildirim.soru)} />}
      </> : null}
    </OyunKabugu>
    <OyunTanitim
      oyun={oyun}
      acik={asama === 'tanitim' || yardimAcik}
      rekor={istatistik.enIyiDogru}
      baslatir={asama === 'tanitim'}
      onBasla={turBaslat}
      onKapat={asama === 'tanitim' ? onCik : () => { setDuraklatilan(false); setYardimAcik(false) }}
    />
  </>
}
