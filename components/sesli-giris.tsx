'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUp, Check, ChevronDown, FileSpreadsheet, Mic, X } from 'lucide-react'
import type { Ayarlar, PuanTuru, Sablon, SoruKaydi, TopluGrup } from '@/lib/types'
import { dersRengi } from '@/lib/banka'
import { sadelestir } from '@/lib/dersler'
import type { KonuDersId } from '@/lib/konu/tip'
import { ALAN_KISA_ADI, secilebilirSablonlar } from '@/lib/sablonlar'
import {
  alanGerekir,
  SEVIYE_SINIFLARI,
  seviyeSablonu,
  varsayilanSeviyeSinifi,
  type SeviyeSinifi,
} from '@/lib/seviye-tespit'
import { dinle, sesIzniIste, sesTanimaDurumu } from '@/lib/ses-tanima'
import { sesliMetniCoz, type SesliDeneme, type SesliKip } from '@/lib/sesli-giris'
import { TOPLU_GRUP_ADI } from '@/lib/toplu-grup'
import {
  ACILIS_SORUSU,
  BOS_BIRIKIM,
  DENEME_ACILIS_SORUSU,
  SEVIYE_ALAN_SORUSU,
  SEVIYE_SINIF_SORUSU,
  birikimeEkle,
  denemeTuruSecildi,
  rabiCevabi,
  type SohbetBirikimi,
} from '@/lib/sesli-sohbet'
import { useGeriKatmani } from '@/lib/geri'
import { useAsagiKaydirKapat } from '@/lib/asagi-kaydir'
import { cn } from '@/lib/utils'
import { Buton, useKapatmaOnayi } from '@/components/ui'
import { BosKutusu, HataNotu, SayiKutusu, sayiya } from '@/components/ekranlar/soru-takibi'

export type DenemeBaslangici = {
  sablonId: string
  girisler: Record<string, { dogru: string; yanlis: string }>
  toplu?: Partial<Record<TopluGrup, { dogru: string; yanlis: string }>>
}

type Mesaj = { id: number; kim: 'rabi' | 'kullanici'; metin: string }

type DinlemeDurumu = 'bos' | 'hazirlaniyor' | 'dinliyor' | 'bitiriliyor'

type Durum = {
  mesajlar: Mesaj[]
  /** Sohbet boyunca anlatılanların toplamı; özet kartı bunu çizer, "Kaydet" bunu yazar. */
  birikim: SohbetBirikimi
  dinleme: DinlemeDurumu
  /** Dinlerken akan ara metin; sağda canlı kullanıcı balonu olarak görünür. */
  araMetin: string
  /** Henüz düşmemiş Rabi cevabı sayısı; sıfırdan büyükken "yazıyor" noktaları görünür. */
  bekleyenCevap: number
}

/** Mikrofon düğmesi yalnız `var` iken görünür; ses yoksa ya da izin reddedildiyse sohbet yazıyla sürer. */
type SesDurumu = 'bilinmiyor' | 'var' | 'yok'

/** Rabi'nin cevabından önceki kısa "yazıyor" beklemesi: cevap anında düşünce mesaj gözden kaçıyordu. */
const YAZIYOR_SURESI_MS = 450

/** Listenin sonuna bu kadar yakınsa yeni mesajda aşağı kaydırılır; daha yukarıdaysa kullanıcı okuyordur. */
const SONA_YAKIN_PX = 96

/** Yazı kutusu 1–4 satır büyür: 4 × 22px satır + 16px iç boşluk. */
const YAZI_KUTUSU_EN_YUKSEK_PX = 104

const DALGA_BOYLARI = [8, 16, 24, 14, 28, 19, 26, 12, 22, 17, 25, 15, 20, 11, 18, 9]

const SEVIYE_ALAN_SECENEKLERI: readonly { id: PuanTuru; ad: string }[] = [
  { id: 'say', ad: 'Sayısal' },
  { id: 'ea', ad: 'Eşit Ağırlık' },
  { id: 'soz', ad: 'Sözel' },
  { id: 'dil', ad: 'Dil' },
]

function soruDersAilesi(ders: string): KonuDersId | null {
  const bankaAilesi = dersRengi(ders)
  if (bankaAilesi) return bankaAilesi
  const sade = sadelestir(ders)
  if (sade === 'yabanci dil' || sade === 'ingilizce') return 'ingilizce'
  return null
}

/** Ders rozeti tonları (`--konu-<ders>`); haritada rengi olmayan dersler nötr kalır. */
function dersTonlari(ders: string) {
  const aile = soruDersAilesi(ders)
  if (!aile) {
    return {
      zemin: 'var(--muted)',
      kenar: 'var(--border)',
      koyu: 'var(--foreground)',
    }
  }
  return {
    zemin: `var(--konu-${aile})`,
    kenar: `var(--konu-${aile}-kenar)`,
    koyu: `var(--konu-${aile}-koyu)`,
  }
}

function netMetniYaz(deger: number): string {
  return String(deger).replace('.', ',')
}

function sureMetni(saniye: number): string {
  const dk = Math.floor(saniye / 60)
  const sn = saniye % 60
  return `${dk}:${String(sn).padStart(2, '0')}`
}

function denemedenBaslangic(deneme: SesliDeneme): DenemeBaslangici {
  const girisler: Record<string, { dogru: string; yanlis: string }> = {}
  for (const d of deneme.dersler) {
    girisler[d.dersId] = { dogru: String(d.dogru), yanlis: String(d.yanlis) }
  }
  const toplu: Partial<Record<TopluGrup, { dogru: string; yanlis: string }>> = {}
  for (const sonuc of deneme.toplu ?? []) {
    toplu[sonuc.grup] = { dogru: String(sonuc.dogru), yanlis: String(sonuc.yanlis) }
  }
  return {
    sablonId: deneme.sablonId,
    girisler,
    ...(Object.keys(toplu).length > 0 ? { toplu } : {}),
  }
}

function hareketAzaltilmisMi(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  )
}

function RabiAvatari({ gizli = false }: { gizli?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-[34px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary-soft',
        gizli && 'invisible',
      )}
    >
      <img
        src="/tavsan-yuz.png"
        alt=""
        width={28}
        height={28}
        draggable={false}
        className="size-7 translate-y-0.5 object-contain"
      />
    </span>
  )
}

/**
 * Soru Takibi'nin "Rabi'ye anlat" alt sayfası: Rabi ile kısa bir sohbet.
 *
 * Kullanıcı yazarak ya da dikte ederek anlatır; her mesaj `sesliMetniCoz` ile
 * çözülüp birikime eklenir, Rabi kurallı kısa cevaplar verir (`lib/sesli-sohbet.ts`,
 * yapay zekâ ve ağ yok). Kullanıcı özet kartından "Kaydet" demeden yerel depoya
 * hiçbir şey yazılmaz (`docs/kurallar/sesli-giris.md`).
 */
type TemelProps = {
  sablonlar: Sablon[]
  ayarlar: Ayarlar
  gunEtiketi?: string
  hedefeKalan?: number | null
  onKapat: () => void
}

type SoruKipiProps = TemelProps & {
  kip: 'soru'
  onSorulariKaydet: (sorular: SoruKaydi[]) => void
  onDenemeAc?: (baslangic: DenemeBaslangici) => void
}

type DenemeKipiProps = TemelProps & {
  kip: 'deneme'
  onDenemeAc: (baslangic: DenemeBaslangici) => void
  onSorulariKaydet?: (sorular: SoruKaydi[]) => void
}

export type SesliGirisSayfasiProps = SoruKipiProps | DenemeKipiProps

export function SesliGirisSayfasi(props: SesliGirisSayfasiProps) {
  const {
    kip,
    sablonlar,
    ayarlar,
    gunEtiketi,
    hedefeKalan = null,
    onKapat,
    onSorulariKaydet,
    onDenemeAc,
  } = props

  const [durum, setDurum] = useState<Durum>(() => ({
    mesajlar: [
      {
        id: 0,
        kim: 'rabi',
        metin: kip === 'deneme' ? DENEME_ACILIS_SORUSU : ACILIS_SORUSU,
      },
    ],
    birikim: BOS_BIRIKIM,
    dinleme: 'bos',
    araMetin: '',
    bekleyenCevap: 0,
  }))
  const [seciliSablonId, setSeciliSablonId] = useState<string | null>(null)
  type SeviyeSecimAsamasi =
    | null
    | { adim: 'sinif' }
    | { adim: 'alan'; sinif: SeviyeSinifi }

  const [seviyeSecimAsamasi, setSeviyeSecimAsamasi] = useState<SeviyeSecimAsamasi>(null)
  const [seciliSeviye, setSeciliSeviye] = useState<{ sinif: SeviyeSinifi; alan?: PuanTuru } | null>(null)
  const [ciplerAcik, setCiplerAcik] = useState(kip === 'deneme')
  const [sesDurumu, setSesDurumu] = useState<SesDurumu>('bilinmiyor')
  const [yazi, setYazi] = useState('')
  const [saniye, setSaniye] = useState(0)
  /** Özet kartında sayılarını düzeltmek için açılmış ders satırı. */
  const [acikDers, setAcikDers] = useState<string | null>(null)

  const etkinRef = useRef(true)
  const oturumSurumuRef = useRef(0)
  const oturumRef = useRef<{ durdur: () => void } | null>(null)
  const sonAraMetinRef = useRef('')
  const mesajKimligiRef = useRef(1)
  /** Kullanıcının kaçıncı mesajı (0'dan); `rabiCevabi` cevabı buna göre çeşitlendirir. */
  const kullaniciSirasiRef = useRef(0)
  /** Birikimin anlık kopyası: cevap hesabı aynı tıklamada güncel birikimi okumalı. */
  const birikimRef = useRef<SohbetBirikimi>(BOS_BIRIKIM)
  const zamanlayicilarRef = useRef<number[]>([])
  const listeRef = useRef<HTMLDivElement | null>(null)
  const sonaYakinRef = useRef(true)
  const yaziKutusuRef = useRef<HTMLTextAreaElement | null>(null)

  const seciliSablonIdRef = useRef<string | null>(seciliSablonId)
  seciliSablonIdRef.current = seciliSablonId
  const oncekiTurKimligiRef = useRef<string | null>(null)

  /*
    Seviye tespit tür satırında tek kimlik (`okul`) taşıyor ama Yeni Deneme
    ekranında öğrencinin sınıfına/alanına ait ders listesini açıyor. Burada da
    kullanıcının seçtiği sınıf ve alana ait seviye şablonunu çözücüye veriyoruz.
  */
  const cozucuSablonlari = useMemo(() => {
    const temel = secilebilirSablonlar(sablonlar, ayarlar.buYilSinif, ayarlar.puanTuru)
    const sinif = seciliSeviye?.sinif ?? varsayilanSeviyeSinifi(ayarlar.buYilSinif)
    const alan = seciliSeviye?.alan ?? ayarlar.puanTuru ?? 'say'
    const aktifSeviye = seviyeSablonu(sablonlar, sinif, alan)
    const idler = new Set(temel.map((s) => s.id))
    return idler.has(aktifSeviye.id) ? temel : [...temel, aktifSeviye]
  }, [sablonlar, ayarlar.buYilSinif, ayarlar.puanTuru, seciliSeviye])

  const secenekler = useMemo(
    () => secilebilirSablonlar(sablonlar, ayarlar.buYilSinif, ayarlar.puanTuru),
    [sablonlar, ayarlar.buYilSinif, ayarlar.puanTuru],
  )

  const seciliSablonAd = useMemo(() => {
    if (!seciliSablonId) return null
    if (seciliSeviye) {
      const { sinif, alan } = seciliSeviye
      return alanGerekir(sinif) && alan
        ? `Seviye Tespit · ${sinif} · ${ALAN_KISA_ADI[alan]}`
        : `Seviye Tespit · ${sinif}`
    }
    const bulunan =
      cozucuSablonlari.find((s) => s.id === seciliSablonId) ??
      sablonlar.find((s) => s.id === seciliSablonId)
    return bulunan?.ad ?? seciliSablonId
  }, [seciliSablonId, seciliSeviye, cozucuSablonlari, sablonlar])

  /** Deneme kipinde tür seçilmeden yazı kutusu ve mikrofon pasif kalır. */
  const turSecilmedi = kip === 'deneme' && seciliSablonId === null

  const cozucuRef = useRef({
    sablonlar: cozucuSablonlari,
    varsayilanSablonId: ayarlar.varsayilanSablonId,
  })
  cozucuRef.current = {
    sablonlar: cozucuSablonlari,
    varsayilanSablonId: ayarlar.varsayilanSablonId,
  }
  const hedefeKalanRef = useRef(hedefeKalan)
  hedefeKalanRef.current = hedefeKalan

  const oturumuTemizle = useCallback(() => {
    oturumSurumuRef.current += 1
    oturumRef.current?.durdur()
    oturumRef.current = null
  }, [])

  const kapat = useCallback(() => {
    oturumuTemizle()
    onKapat()
  }, [oturumuTemizle, onKapat])

  useGeriKatmani(true, kapat)
  const kaydir = useAsagiKaydirKapat(kapat)

  const birikimiYaz = useCallback((yeni: SohbetBirikimi) => {
    birikimRef.current = yeni
    setDurum((onceki) => ({ ...onceki, birikim: yeni }))
  }, [])

  const rabiSoylesin = useCallback((metinler: string[]) => {
    setDurum((onceki) => {
      // Rabi'nin sohbetteki son mesajını bul
      let sonRabiMetni: string | null = null
      for (let i = onceki.mesajlar.length - 1; i >= 0; i--) {
        if (onceki.mesajlar[i].kim === 'rabi') {
          sonRabiMetni = onceki.mesajlar[i].metin.trim()
          break
        }
      }

      const eklenecekler: Mesaj[] = []
      let sonEklenen = sonRabiMetni

      for (const ham of metinler) {
        const metin = ham.trim()
        // Rabi'nin son balonu aynı metinse mükerrer hata/bilgi balonunu tekrar ekleme
        if (!metin || metin === sonEklenen) continue
        eklenecekler.push({
          id: mesajKimligiRef.current++,
          kim: 'rabi' as const,
          metin,
        })
        sonEklenen = metin
      }

      if (eklenecekler.length === 0) return onceki

      return {
        ...onceki,
        mesajlar: [...onceki.mesajlar, ...eklenecekler],
      }
    })
  }, [])

  const turSec = (yeniId: string, yeniAd: string) => {
    const oncekiId = oncekiTurKimligiRef.current ?? seciliSablonIdRef.current
    oncekiTurKimligiRef.current = yeniId
    seciliSablonIdRef.current = yeniId
    setSeciliSablonId(yeniId)
    setSeciliSeviye(null)
    setSeviyeSecimAsamasi(null)
    setCiplerAcik(false)

    // Kullanıcı balonu ekle
    const kullaniciMesajId = mesajKimligiRef.current++
    setDurum((onceki) => ({
      ...onceki,
      mesajlar: [...onceki.mesajlar, { id: kullaniciMesajId, kim: 'kullanici', metin: yeniAd }],
      bekleyenCevap: onceki.bekleyenCevap + 1,
    }))
    sonaYakinRef.current = true

    let rabiMetni: string
    const oncekiSonucVar =
      birikimRef.current.deneme !== null &&
      (birikimRef.current.deneme.dersler.length > 0 ||
        (birikimRef.current.deneme.toplu !== undefined && birikimRef.current.deneme.toplu.length > 0) ||
        birikimRef.current.deneme.toplamNet !== null)

    if (oncekiId !== null && oncekiId !== yeniId) {
      // Tür değişti: birikmiş deneme sonuçları sıfırlanır
      birikimiYaz({ ...birikimRef.current, deneme: null })
      rabiMetni = oncekiSonucVar
        ? `Deneme türünü ${yeniAd} olarak değiştirdin, önceki deneme sonuçlarını sıfırladım. Ders ders doğru ve yanlışlarını anlat.`
        : `Deneme türünü ${yeniAd} olarak değiştirdin. Ders ders doğru ve yanlışlarını anlat.`
    } else {
      rabiMetni = denemeTuruSecildi(yeniAd)
    }

    const zamanlayici = window.setTimeout(() => {
      zamanlayicilarRef.current = zamanlayicilarRef.current.filter((z) => z !== zamanlayici)
      if (!etkinRef.current) return
      setDurum((onceki) => ({
        ...onceki,
        mesajlar: [
          ...onceki.mesajlar,
          { id: mesajKimligiRef.current++, kim: 'rabi', metin: rabiMetni },
        ],
        bekleyenCevap: Math.max(0, onceki.bekleyenCevap - 1),
      }))
    }, YAZIYOR_SURESI_MS)
    zamanlayicilarRef.current.push(zamanlayici)
  }

  const seviyeTamamla = (sinif: SeviyeSinifi, alan: PuanTuru) => {
    const oncekiId = oncekiTurKimligiRef.current
    const hedefSablon = seviyeSablonu(sablonlar, sinif, alan)
    const yeniId = hedefSablon.id

    oncekiTurKimligiRef.current = yeniId
    seciliSablonIdRef.current = yeniId
    setSeciliSablonId(yeniId)
    setSeciliSeviye({ sinif, ...(alanGerekir(sinif) ? { alan } : {}) })
    setSeviyeSecimAsamasi(null)
    setCiplerAcik(false)

    setDurum((onceki) => ({
      ...onceki,
      bekleyenCevap: onceki.bekleyenCevap + 1,
    }))
    sonaYakinRef.current = true

    const alanMetni = alanGerekir(sinif) ? ` ${alan === 'ea' ? 'Eşit Ağırlık' : ALAN_KISA_ADI[alan]}` : ''
    const turAdi = `${sinif}. sınıf${alanMetni} seviye tespit`

    let rabiMetni: string
    const oncekiSonucVar =
      birikimRef.current.deneme !== null &&
      (birikimRef.current.deneme.dersler.length > 0 ||
        (birikimRef.current.deneme.toplu !== undefined && birikimRef.current.deneme.toplu.length > 0) ||
        birikimRef.current.deneme.toplamNet !== null)

    if (oncekiId !== null && oncekiId !== yeniId) {
      birikimiYaz({ ...birikimRef.current, deneme: null })
      rabiMetni = oncekiSonucVar
        ? `Deneme türünü ${turAdi} olarak değiştirdin, önceki deneme sonuçlarını sıfırladım. Ders ders doğru ve yanlışlarını anlat.`
        : `Deneme türünü ${turAdi} olarak değiştirdin. Ders ders doğru ve yanlışlarını anlat.`
    } else {
      rabiMetni = denemeTuruSecildi(turAdi)
    }

    const zamanlayici = window.setTimeout(() => {
      zamanlayicilarRef.current = zamanlayicilarRef.current.filter((z) => z !== zamanlayici)
      if (!etkinRef.current) return
      setDurum((onceki) => ({
        ...onceki,
        mesajlar: [
          ...onceki.mesajlar,
          { id: mesajKimligiRef.current++, kim: 'rabi', metin: rabiMetni },
        ],
        bekleyenCevap: Math.max(0, onceki.bekleyenCevap - 1),
      }))
    }, YAZIYOR_SURESI_MS)
    zamanlayicilarRef.current.push(zamanlayici)
  }

  const seviyeSeciminiBaslat = () => {
    oncekiTurKimligiRef.current = seciliSablonIdRef.current
    seciliSablonIdRef.current = null
    setSeciliSablonId(null)
    setSeciliSeviye(null)
    setSeviyeSecimAsamasi({ adim: 'sinif' })

    const kullaniciMesajId = mesajKimligiRef.current++
    setDurum((onceki) => ({
      ...onceki,
      mesajlar: [
        ...onceki.mesajlar,
        { id: kullaniciMesajId, kim: 'kullanici', metin: 'Seviye Tespit' },
      ],
      bekleyenCevap: onceki.bekleyenCevap + 1,
    }))
    sonaYakinRef.current = true

    const zamanlayici = window.setTimeout(() => {
      zamanlayicilarRef.current = zamanlayicilarRef.current.filter((z) => z !== zamanlayici)
      if (!etkinRef.current) return
      setDurum((onceki) => ({
        ...onceki,
        mesajlar: [
          ...onceki.mesajlar,
          { id: mesajKimligiRef.current++, kim: 'rabi', metin: SEVIYE_SINIF_SORUSU },
        ],
        bekleyenCevap: Math.max(0, onceki.bekleyenCevap - 1),
      }))
    }, YAZIYOR_SURESI_MS)
    zamanlayicilarRef.current.push(zamanlayici)
  }

  const seviyeSinifSec = (secilenSinif: SeviyeSinifi) => {
    const kullaniciMesajId = mesajKimligiRef.current++
    const sinifEtiketi = `${secilenSinif}. sınıf`

    const alanSorulmali = alanGerekir(secilenSinif) && ayarlar.puanTuru === null

    if (alanSorulmali) {
      setSeviyeSecimAsamasi({ adim: 'alan', sinif: secilenSinif })
      setDurum((onceki) => ({
        ...onceki,
        mesajlar: [
          ...onceki.mesajlar,
          { id: kullaniciMesajId, kim: 'kullanici', metin: sinifEtiketi },
        ],
        bekleyenCevap: onceki.bekleyenCevap + 1,
      }))
      sonaYakinRef.current = true

      const zamanlayici = window.setTimeout(() => {
        zamanlayicilarRef.current = zamanlayicilarRef.current.filter((z) => z !== zamanlayici)
        if (!etkinRef.current) return
        setDurum((onceki) => ({
          ...onceki,
          mesajlar: [
            ...onceki.mesajlar,
            { id: mesajKimligiRef.current++, kim: 'rabi', metin: SEVIYE_ALAN_SORUSU },
          ],
          bekleyenCevap: Math.max(0, onceki.bekleyenCevap - 1),
        }))
      }, YAZIYOR_SURESI_MS)
      zamanlayicilarRef.current.push(zamanlayici)
    } else {
      const alan = alanGerekir(secilenSinif) ? ayarlar.puanTuru! : (ayarlar.puanTuru ?? 'say')
      setDurum((onceki) => ({
        ...onceki,
        mesajlar: [
          ...onceki.mesajlar,
          { id: kullaniciMesajId, kim: 'kullanici', metin: sinifEtiketi },
        ],
      }))
      sonaYakinRef.current = true
      seviyeTamamla(secilenSinif, alan)
    }
  }

  const seviyeAlanSec = (sinif: SeviyeSinifi, alan: PuanTuru, alanAdi: string) => {
    const kullaniciMesajId = mesajKimligiRef.current++
    setDurum((onceki) => ({
      ...onceki,
      mesajlar: [
        ...onceki.mesajlar,
        { id: kullaniciMesajId, kim: 'kullanici', metin: alanAdi },
      ],
    }))
    sonaYakinRef.current = true
    seviyeTamamla(sinif, alan)
  }

  /** Kullanıcı mesajını sohbete ekler, birikime işler ve kısa bir beklemeyle Rabi'yi cevaplatır. */
  const mesajGonder = useCallback(
    (ham: string) => {
      const metin = ham.trim()
      if (!metin) return
      if (kip === 'deneme' && seciliSablonIdRef.current === null) return
      const sira = kullaniciSirasiRef.current++
      const cozum = sesliMetniCoz(metin, {
        sablonlar: cozucuRef.current.sablonlar,
        varsayilanSablonId: seciliSablonIdRef.current ?? cozucuRef.current.varsayilanSablonId,
        kip,
      })

      // Kalan, bu mesajdan önceki birikim düşülerek verilir; bu mesajın payını `rabiCevabi` bilir.
      const oncekiToplam = birikimRef.current.sorular.reduce((t, s) => t + s.toplam, 0)
      const kalan =
        hedefeKalanRef.current == null ? null : Math.max(0, hedefeKalanRef.current - oncekiToplam)
      const cevap = rabiCevabi(cozum, {
        sablonlar: cozucuRef.current.sablonlar,
        mesajSirasi: sira,
        hedefeKalan: kip === 'soru' ? kalan : null,
        metin,
        kip,
      })

      const yeniBirikim = birikimeEkle(birikimRef.current, cozum)
      birikimRef.current = yeniBirikim
      sonaYakinRef.current = true
      setDurum((onceki) => ({
        ...onceki,
        mesajlar: [...onceki.mesajlar, { id: mesajKimligiRef.current++, kim: 'kullanici', metin }],
        birikim: yeniBirikim,
        bekleyenCevap: onceki.bekleyenCevap + 1,
      }))

      const zamanlayici = window.setTimeout(() => {
        zamanlayicilarRef.current = zamanlayicilarRef.current.filter((z) => z !== zamanlayici)
        if (!etkinRef.current) return
        setDurum((onceki) => ({
          ...onceki,
          mesajlar: [
            ...onceki.mesajlar,
            ...cevap.map((m) => ({ id: mesajKimligiRef.current++, kim: 'rabi' as const, metin: m })),
          ],
          bekleyenCevap: Math.max(0, onceki.bekleyenCevap - 1),
        }))
      }, YAZIYOR_SURESI_MS)
      zamanlayicilarRef.current.push(zamanlayici)
    },
    [kip],
  )

  const dinlemeyiBaslat = useCallback(async () => {
    if (kip === 'deneme' && seciliSablonIdRef.current === null) return
    oturumuTemizle()
    const buSurum = oturumSurumuRef.current
    const gecerli = () => etkinRef.current && oturumSurumuRef.current === buSurum
    const bosaDon = () => setDurum((o) => ({ ...o, dinleme: 'bos', araMetin: '' }))
    sonAraMetinRef.current = ''
    setDurum((o) => ({ ...o, dinleme: 'hazirlaniyor', araMetin: '' }))

    const uygunluk = await sesTanimaDurumu()
    if (!gecerli()) return

    if (uygunluk === 'yok') {
      // Ses tanıma yoksa sohbet yalnız yazıyla sürer; klavye açılsın.
      setSesDurumu('yok')
      bosaDon()
      yaziKutusuRef.current?.focus()
      return
    }

    if (uygunluk === 'izin-yok') {
      const verildi = await sesIzniIste()
      if (!gecerli()) return
      if (!verildi) {
        setSesDurumu('yok')
        bosaDon()
        rabiSoylesin(['Mikrofon izni yok. Yazarak anlatabilirsin.'])
        window.requestAnimationFrame(() => yaziKutusuRef.current?.focus())
        return
      }
    }

    setSesDurumu('var')
    setDurum((o) => ({ ...o, dinleme: 'dinliyor', araMetin: '' }))

    const oturum = dinle({
      onKismi: (metin) => {
        if (!gecerli()) return
        sonAraMetinRef.current = metin
        setDurum((o) => (o.dinleme === 'bos' ? o : { ...o, araMetin: metin }))
      },
    })
    oturumRef.current = oturum

    try {
      const bitenMetin = await oturum.bitti
      if (!gecerli()) return
      oturumRef.current = null
      const birlesik = bitenMetin.trim() || sonAraMetinRef.current.trim()
      bosaDon()
      mesajGonder(birlesik)
    } catch (yakalanan) {
      if (!gecerli()) return
      oturumRef.current = null
      bosaDon()
      const mesaj = yakalanan instanceof Error ? yakalanan.message : ''
      const kucuk = mesaj.toLocaleLowerCase('tr-TR')
      if (kucuk.includes('izin')) {
        setSesDurumu('yok')
        rabiSoylesin(['Mikrofon izni yok. Yazarak anlatabilirsin.'])
        window.requestAnimationFrame(() => yaziKutusuRef.current?.focus())
        return
      }
      if (
        kucuk.includes('internet') ||
        kucuk.includes('çalışmıyor') ||
        kucuk.includes('calismiyor')
      ) {
        setSesDurumu('yok')
        rabiSoylesin([mesaj])
        window.requestAnimationFrame(() => yaziKutusuRef.current?.focus())
        return
      }
      if (mesaj === '' || kucuk.includes('anlaşılamadı')) {
        rabiSoylesin(['Duyamadım. Tekrar söyle ya da yaz.'])
        return
      }
      rabiSoylesin([mesaj])
    }
  }, [oturumuTemizle, mesajGonder, rabiSoylesin])

  // Açılışta dinleme kendiliğinden başlamaz; ses tanıma desteği sessizce sorgulanır.
  useEffect(() => {
    etkinRef.current = true
    let iptal = false
    sesTanimaDurumu().then((sonuc) => {
      if (!iptal) {
        setSesDurumu(sonuc === 'yok' ? 'yok' : 'var')
      }
    })
    return () => {
      iptal = true
      etkinRef.current = false
      oturumuTemizle()
      for (const z of zamanlayicilarRef.current) window.clearTimeout(z)
      zamanlayicilarRef.current = []
    }
  }, [oturumuTemizle])

  // Dinleme süresi sayacı.
  useEffect(() => {
    if (durum.dinleme !== 'dinliyor') {
      if (durum.dinleme === 'hazirlaniyor') setSaniye(0)
      return
    }
    const baslangic = Date.now()
    setSaniye(0)
    const aralik = window.setInterval(() => {
      setSaniye(Math.floor((Date.now() - baslangic) / 1000))
    }, 500)
    return () => window.clearInterval(aralik)
  }, [durum.dinleme])

  // Yeni mesajda listenin sonuna kay; kullanıcı yukarıda okuyorsa zorla çekme.
  useEffect(() => {
    const liste = listeRef.current
    if (!liste || !sonaYakinRef.current) return
    liste.scrollTo({ top: liste.scrollHeight, behavior: hareketAzaltilmisMi() ? 'auto' : 'smooth' })
  }, [durum.mesajlar.length, durum.araMetin, durum.bekleyenCevap, durum.birikim, ciplerAcik])

  const listeKaydirildi = () => {
    const liste = listeRef.current
    if (!liste) return
    sonaYakinRef.current =
      liste.scrollHeight - liste.scrollTop - liste.clientHeight < SONA_YAKIN_PX
  }

  // Yazı kutusu içeriğe göre 1–4 satır büyür, sonra kendi içinde kayar.
  useEffect(() => {
    const kutu = yaziKutusuRef.current
    if (!kutu) return
    kutu.style.height = 'auto'
    kutu.style.height = `${Math.min(kutu.scrollHeight, YAZI_KUTUSU_EN_YUKSEK_PX)}px`
  }, [yazi, durum.dinleme])

  const yaziyiGonder = () => {
    if (kip === 'deneme' && seciliSablonIdRef.current === null) return
    if (!yazi.trim()) return
    mesajGonder(yazi)
    setYazi('')
  }

  const dinlemeyiBitir = () => {
    if (durum.dinleme !== 'dinliyor') return
    setDurum((o) => ({ ...o, dinleme: 'bitiriliyor' }))
    oturumRef.current?.durdur()
  }

  const soruKaldir = (ders: string) => {
    const b = birikimRef.current
    birikimiYaz({ ...b, sorular: b.sorular.filter((s) => s.ders !== ders) })
    if (acikDers === ders) setAcikDers(null)
  }

  const soruSayisiGuncelle = (
    ders: string,
    alan: 'toplam' | 'dogru' | 'yanlis',
    ham: string,
  ) => {
    const deger = Number(sayiya(ham)) || 0
    const b = birikimRef.current
    birikimiYaz({
      ...b,
      sorular: b.sorular.map((s) => (s.ders === ders ? { ...s, [alan]: deger } : s)),
    })
  }

  const denemeKaldir = () => {
    birikimiYaz({ ...birikimRef.current, deneme: null })
  }

  const { sorular, deneme } = durum.birikim

  const denemeDolu =
    deneme !== null &&
    (deneme.dersler.length > 0 ||
      (deneme.toplu !== undefined && deneme.toplu.length > 0) ||
      deneme.toplamNet !== null)

  const kaydedilecekVar = kip === 'deneme' ? denemeDolu : sorular.length > 0
  const soruHatasiVar =
    kip === 'soru' && sorular.some((s) => s.toplam <= 0 || s.dogru + s.yanlis > s.toplam)

  // Birikimde okunan satır varken ✕ ile çıkmak emeği sileceği için sorar.
  const kapatmaOnayi = useKapatmaOnayi({
    aciklama:
      kip === 'deneme'
        ? 'Anlatılan deneme bilgileri kaydedilmeden pencere kapanır.'
        : 'Anlatılan sorular kaydedilmeden pencere kapanır.',
  })

  const onaylaVeIlerle = () => {
    if (!kaydedilecekVar || soruHatasiVar) return
    if (kip === 'soru') {
      if (sorular.length > 0 && onSorulariKaydet) {
        onSorulariKaydet(sorular)
      }
      kapat()
      return
    }
    if (kip === 'deneme' && deneme !== null && onDenemeAc) {
      kapat()
      onDenemeAc(denemedenBaslangic(deneme))
    }
  }

  const denemeSablonu = deneme
    ? (cozucuSablonlari.find((s) => s.id === deneme.sablonId) ??
      sablonlar.find((s) => s.id === deneme.sablonId) ??
      null)
    : null

  const anaButonMetni = kip === 'deneme' ? 'Denemeye geç' : 'Kaydet'

  const dinleniyor = durum.dinleme !== 'bos'
  const canliBalon = dinleniyor && durum.araMetin.trim() !== ''
  const yaziyor = durum.bekleyenCevap > 0
  const yaziVar = yazi.trim() !== ''

  return (
    <div
      className="katman-zemin tablet-orta-zemin fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={kapat}
    >
      {kapatmaOnayi.pencere}
      <div
        ref={kaydir}
        role="dialog"
        aria-modal="true"
        aria-label="Rabi'ye anlat"
        className="alt-pencere-girisi tablet-orta-pencere flex h-[88%] w-full max-w-md flex-col overflow-hidden rounded-t-[26px] bg-card pb-[calc(0.75rem+var(--guvenli-alt))] tablet:pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık: aşağı çekerek kapatma yalnız buradan (liste ve alt çubuk `data-surukleme-yok`). */}
        <div className="shrink-0 px-4 pt-3 tablet:px-6 tablet:pt-5">
          <div className="tablet-orta-tutamac mx-auto mb-3 h-1 w-[42px] rounded-full bg-border" />
          <div className="flex items-center gap-2.5 pb-3">
            <RabiAvatari />
            <p className="font-display text-lg font-extrabold tracking-tight">Rabi</p>
            {kip === 'deneme' ? (
              seciliSablonAd && (
                <button
                  type="button"
                  onClick={() => {
                    setSeviyeSecimAsamasi(null)
                    setCiplerAcik((o) => !o)
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary-soft px-2.5 py-1 text-xs font-extrabold text-primary transition active:scale-95"
                  aria-label={`Deneme türü: ${seciliSablonAd}. Değiştirmek için dokun.`}
                >
                  <span>{seciliSablonAd}</span>
                  <ChevronDown
                    size={13}
                    strokeWidth={2.5}
                    aria-hidden
                    className={cn('transition-transform duration-200', ciplerAcik && 'rotate-180')}
                  />
                </button>
              )
            ) : (
              gunEtiketi && (
                <p className="text-[12.5px] font-bold text-muted-foreground/70">{gunEtiketi}</p>
              )
            )}
            <button
              type="button"
              onClick={() => (kaydedilecekVar ? kapatmaOnayi.sor(kapat) : kapat())}
              aria-label="Kapat"
              className="ml-auto inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground active:bg-muted"
            >
              <X size={16} strokeWidth={2.4} aria-hidden />
            </button>
          </div>
        </div>

        <div
          ref={listeRef}
          data-surukleme-yok
          onScroll={listeKaydirildi}
          aria-live="polite"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border px-4 pt-4 pb-3 tablet:px-6"
        >
          <div className="flex flex-col gap-2">
            {durum.mesajlar.map((mesaj, i) => {
              if (mesaj.kim === 'kullanici') {
                return (
                  <div key={mesaj.id} className="flex justify-end pt-1">
                    <p className="max-w-[82%] whitespace-pre-wrap break-words rounded-[18px] rounded-br-[4px] bg-primary-parlak px-3.5 py-2.5 text-[14.5px] font-semibold leading-snug text-white shadow-[0_4px_14px_rgba(217,98,47,0.28)]">
                      {mesaj.metin}
                    </p>
                  </div>
                )
              }
              const sonraki = durum.mesajlar[i + 1]
              // Avatar ardışık Rabi balonlarının yalnız sonuncusunun yanında.
              const avatarGizli = sonraki?.kim === 'rabi' || (sonraki === undefined && yaziyor)
              return (
                <div key={mesaj.id} className="flex items-end gap-2.5">
                  <RabiAvatari gizli={avatarGizli} />
                  <p className="max-w-[78%] rounded-[18px] rounded-bl-[4px] border border-border bg-muted px-3.5 py-2.5 text-[15px] font-extrabold leading-snug text-foreground">
                    {mesaj.metin}
                  </p>
                </div>
              )
            })}

            {canliBalon && (
              <div className="flex justify-end pt-1">
                <p className="max-w-[82%] whitespace-pre-wrap break-words rounded-[18px] rounded-br-[4px] bg-primary-parlak px-3.5 py-2.5 text-[14.5px] font-semibold leading-snug text-white shadow-[0_4px_14px_rgba(217,98,47,0.28)]">
                  {durum.araMetin}
                  {durum.dinleme === 'dinliyor' && <span aria-hidden className="sohbet-imlec" />}
                </p>
              </div>
            )}

            {yaziyor && (
              <div className="flex items-end gap-2.5" aria-label="Rabi yazıyor">
                <RabiAvatari />
                <span className="inline-flex items-center gap-1 rounded-[18px] rounded-bl-[4px] border border-border bg-muted px-3.5 py-3.5">
                  {[0, 1, 2].map((n) => (
                    <span
                      key={n}
                      aria-hidden
                      className="sohbet-nokta size-1.5 rounded-full bg-muted-foreground"
                      style={{ animationDelay: `${n * 0.15}s` }}
                    />
                  ))}
                </span>
              </div>
            )}

            {kip === 'deneme' && ciplerAcik && (
              <div className="flex flex-wrap gap-2 pl-[44px] pt-1 pb-1">
                {seviyeSecimAsamasi === null &&
                  secenekler.map((s) => {
                    const ad = s.id === 'okul' ? 'Seviye Tespit' : s.ad
                    const secili = s.id === 'okul' ? seciliSeviye !== null : s.id === seciliSablonId
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          if (s.id === 'okul') {
                            seviyeSeciminiBaslat()
                          } else {
                            turSec(s.id, ad)
                          }
                        }}
                        className={cn(
                          'flex h-10 items-center rounded-xl border px-3.5 text-[13px] font-bold transition active:scale-95',
                          secili
                            ? 'border-[1.5px] border-primary-parlak bg-primary-soft font-extrabold text-primary'
                            : 'border-border bg-card text-foreground active:bg-muted',
                        )}
                      >
                        {ad}
                      </button>
                    )
                  })}

                {seviyeSecimAsamasi?.adim === 'sinif' &&
                  SEVIYE_SINIFLARI.map((s) => {
                    const oneri = s === varsayilanSeviyeSinifi(ayarlar.buYilSinif)
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => seviyeSinifSec(s)}
                        className={cn(
                          'flex h-10 items-center rounded-xl border px-3.5 text-[13px] font-bold transition active:scale-95',
                          oneri
                            ? 'border-primary/40 bg-primary-soft/35 font-extrabold text-foreground'
                            : 'border-border bg-card text-foreground active:bg-muted',
                        )}
                      >
                        {s}. sınıf
                      </button>
                    )
                  })}

                {seviyeSecimAsamasi?.adim === 'alan' &&
                  SEVIYE_ALAN_SECENEKLERI.map((alan) => (
                    <button
                      key={alan.id}
                      type="button"
                      onClick={() => seviyeAlanSec(seviyeSecimAsamasi.sinif, alan.id, alan.ad)}
                      className="flex h-10 items-center rounded-xl border border-border bg-card px-3.5 text-[13px] font-bold text-foreground transition active:scale-95 active:bg-muted"
                    >
                      {alan.ad}
                    </button>
                  ))}
              </div>
            )}

            {kaydedilecekVar && (
              <div className="mt-2 rounded-[22px] border border-border p-3">
                {kip === 'soru' && sorular.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="px-0.5 text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Sorular
                    </span>

                    {sorular.map((satir) => {
                      const ton = dersTonlari(satir.ders)
                      const acik = acikDers === satir.ders
                      const asim = satir.dogru + satir.yanlis > satir.toplam
                      const sifir = satir.toplam <= 0
                      const bos = Math.max(0, satir.toplam - satir.dogru - satir.yanlis)

                      return (
                        <div
                          key={satir.ders}
                          className={cn(
                            'rounded-[18px] border border-border bg-muted/35 p-2.5 transition-colors',
                            (asim || sifir) && 'border-danger/50',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-expanded={acik}
                              onClick={() => setAcikDers(acik ? null : satir.ders)}
                              className="flex min-w-0 flex-1 items-center gap-2 text-left"
                            >
                              <span
                                className="truncate rounded-[10px] border px-2.5 py-1 font-display text-[13px] font-extrabold tracking-tight"
                                style={{
                                  backgroundColor: ton.zemin,
                                  borderColor: ton.kenar,
                                  color: ton.koyu,
                                }}
                              >
                                {satir.ders}
                              </span>
                              <span className="rakam ml-auto flex shrink-0 items-baseline gap-2 pr-1">
                                <span className="font-display text-[14.5px] font-extrabold text-foreground">
                                  {satir.toplam} soru
                                </span>
                                <span
                                  className={cn(
                                    'text-xs font-extrabold',
                                    satir.dogru > 0 ? 'text-success' : 'text-muted-foreground/60',
                                  )}
                                >
                                  {satir.dogru}D
                                </span>
                                <span
                                  className={cn(
                                    'text-xs font-extrabold',
                                    satir.yanlis > 0 ? 'text-danger' : 'text-muted-foreground/60',
                                  )}
                                >
                                  {satir.yanlis}Y
                                </span>
                              </span>
                            </button>

                            <button
                              type="button"
                              aria-label={`${satir.ders} satırını kaldır`}
                              onClick={() => soruKaldir(satir.ders)}
                              className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[10px] text-muted-foreground/70 active:bg-danger-soft active:text-danger"
                            >
                              <X size={15} aria-hidden />
                            </button>
                          </div>

                          {acik && (
                            <div className="acilir-giris mt-2.5 border-t border-border pt-2.5">
                              <div className="grid grid-cols-4 gap-2">
                                <SayiKutusu
                                  etiket="Toplam"
                                  deger={satir.toplam === 0 ? '' : String(satir.toplam)}
                                  onDegis={(ham) => soruSayisiGuncelle(satir.ders, 'toplam', ham)}
                                  ariaEtiket={`${satir.ders} toplam soru`}
                                />
                                <SayiKutusu
                                  etiket="Doğru"
                                  ton="dogru"
                                  deger={satir.dogru === 0 ? '' : String(satir.dogru)}
                                  onDegis={(ham) => soruSayisiGuncelle(satir.ders, 'dogru', ham)}
                                  ariaEtiket={`${satir.ders} doğru`}
                                />
                                <SayiKutusu
                                  etiket="Yanlış"
                                  ton="yanlis"
                                  deger={satir.yanlis === 0 ? '' : String(satir.yanlis)}
                                  onDegis={(ham) => soruSayisiGuncelle(satir.ders, 'yanlis', ham)}
                                  ariaEtiket={`${satir.ders} yanlış`}
                                />
                                <BosKutusu deger={bos} hata={asim} />
                              </div>
                            </div>
                          )}

                          {asim && <HataNotu />}
                          {!asim && sifir && (
                            <p className="mt-2 text-xs font-bold leading-snug text-danger">
                              Toplam soru sayısını gir ya da satırı kaldır.
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {kip === 'deneme' && denemeDolu && (
                  <div>
                    <span className="mb-1.5 block px-0.5 text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Deneme
                    </span>
                    <div className="rounded-[18px] border border-primary/25 bg-primary-soft/45 p-3">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet size={17} className="shrink-0 text-primary" aria-hidden />
                        <p className="min-w-0 flex-1 truncate font-display text-[15px] font-extrabold tracking-tight text-foreground">
                          {seciliSablonAd ?? denemeSablonu?.ad ?? 'Deneme'}
                        </p>
                        <button
                          type="button"
                          aria-label="Denemeyi kaldır"
                          onClick={denemeKaldir}
                          className="-mr-1 inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[10px] text-muted-foreground/70 active:bg-danger-soft active:text-danger"
                        >
                          <X size={15} aria-hidden />
                        </button>
                      </div>

                      {deneme.dersler.length > 0 || (deneme.toplu && deneme.toplu.length > 0) ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {deneme.dersler.map((okunan) => {
                            const dersAdi =
                              denemeSablonu?.dersler.find((d) => d.id === okunan.dersId)?.ad ??
                              okunan.dersId
                            return (
                              <span
                                key={okunan.dersId}
                                className="rakam inline-flex items-center gap-1 rounded-[10px] border border-border bg-card px-2.5 py-1 text-xs font-bold text-foreground"
                              >
                                <span>{dersAdi}</span>
                                <span className="text-success">{okunan.dogru}D</span>
                                <span className="text-danger">{okunan.yanlis}Y</span>
                              </span>
                            )
                          })}
                          {deneme.toplu?.map((topluSonuc) => {
                            const grupAdi =
                              TOPLU_GRUP_ADI[topluSonuc.grup] ??
                              (topluSonuc.grup === 'sosyal' ? 'Sosyal' : 'Fen')
                            return (
                              <span
                                key={`toplu-${topluSonuc.grup}`}
                                className="rakam inline-flex items-center gap-1 rounded-[10px] border border-border bg-card px-2.5 py-1 text-xs font-bold text-foreground"
                              >
                                <span>{grupAdi} (Toplu)</span>
                                <span className="text-success">{topluSonuc.dogru}D</span>
                                <span className="text-danger">{topluSonuc.yanlis}Y</span>
                              </span>
                            )
                          })}
                        </div>
                      ) : deneme.toplamNet !== null ? (
                        <p className="rakam mt-1.5 text-[13px] font-semibold text-muted-foreground">
                          {netMetniYaz(deneme.toplamNet)} net — ders ders girmen gerek
                        </p>
                      ) : (
                        <p className="mt-1.5 text-[13px] font-semibold text-muted-foreground">
                          Ders ders girmen gerek
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <Buton
                  onClick={onaylaVeIlerle}
                  disabled={soruHatasiVar}
                  className="mt-3.5 h-[50px] w-full rounded-[16px] px-3 text-[14.5px] leading-tight"
                >
                  {anaButonMetni}
                </Buton>
              </div>
            )}
          </div>
        </div>

        {/* Alt çubuk: dinlerken ses dalgası + süre + Bitir; değilken yazı kutusu + mikrofon/gönder. */}
        <div data-surukleme-yok className="shrink-0 px-3 pt-2 tablet:px-5">
          {dinleniyor ? (
            <div className="flex items-center gap-2.5 rounded-3xl border border-border bg-background py-1.5 pr-1.5 pl-2.5">
              <span
                aria-hidden
                className={cn(
                  'relative inline-flex size-8 shrink-0 items-center justify-center rounded-full border',
                  durum.dinleme === 'dinliyor'
                    ? 'border-primary/30 bg-primary-soft text-primary'
                    : 'border-border bg-card text-muted-foreground',
                )}
              >
                {durum.dinleme === 'dinliyor' && (
                  <span className="ses-nabiz pointer-events-none absolute inset-0 rounded-full bg-primary-parlak" />
                )}
                <Mic size={16} strokeWidth={2.3} className="relative" />
              </span>
              <div aria-hidden className="flex h-[30px] min-w-0 flex-1 items-center gap-[2.5px] overflow-hidden">
                {DALGA_BOYLARI.map((boy, n) => (
                  <span
                    key={n}
                    className={cn(
                      'w-[3px] shrink-0 rounded-full',
                      durum.dinleme === 'dinliyor'
                        ? 'ses-dalga bg-primary-parlak'
                        : 'bg-muted-foreground/30',
                    )}
                    style={{
                      height: durum.dinleme === 'dinliyor' ? boy : 6 + (n % 3) * 3,
                      animationDelay: `${(n % 5) * 0.08}s`,
                    }}
                  />
                ))}
              </div>
              <span
                className={cn(
                  'rakam shrink-0 text-xs font-extrabold',
                  durum.dinleme === 'dinliyor' ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {sureMetni(saniye)}
              </span>
              <button
                type="button"
                onClick={dinlemeyiBitir}
                disabled={durum.dinleme !== 'dinliyor'}
                className={cn(
                  'inline-flex h-[42px] shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-extrabold transition-colors disabled:opacity-60',
                  durum.araMetin.trim() !== ''
                    ? 'bg-primary-parlak text-white shadow-[0_4px_14px_rgba(217,98,47,0.38)]'
                    : 'bg-primary-soft text-primary',
                )}
              >
                <Check size={16} strokeWidth={2.6} aria-hidden />
                Bitir
              </button>
            </div>
          ) : (
            <div className="flex items-end gap-2 rounded-3xl border border-border bg-background py-1.5 pr-1.5 pl-4">
              <textarea
                ref={yaziKutusuRef}
                value={yazi}
                disabled={turSecilmedi}
                onChange={(e) => setYazi(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault()
                    yaziyiGonder()
                  }
                }}
                rows={1}
                enterKeyHint="send"
                placeholder={turSecilmedi ? 'Önce deneme türünü seç' : 'Yaz ya da konuş'}
                aria-label="Mesaj"
                className={cn(
                  'min-w-0 flex-1 resize-none bg-transparent py-2 text-[15px] leading-[22px] text-foreground outline-none placeholder:text-muted-foreground/80',
                  turSecilmedi && 'cursor-not-allowed opacity-50',
                )}
              />
              {yaziVar || sesDurumu !== 'var' ? (
                <button
                  type="button"
                  onClick={yaziyiGonder}
                  disabled={!yaziVar || turSecilmedi}
                  aria-label="Gönder"
                  className={cn(
                    'inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-parlak text-white transition active:scale-95 disabled:opacity-40',
                    turSecilmedi && 'cursor-not-allowed opacity-40',
                  )}
                >
                  <ArrowUp size={19} strokeWidth={2.6} aria-hidden />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={turSecilmedi}
                  onClick={() => {
                    if (!turSecilmedi) void dinlemeyiBaslat()
                  }}
                  aria-label="Konuşarak anlat"
                  className={cn(
                    'inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-parlak text-white transition active:scale-95',
                    turSecilmedi && 'cursor-not-allowed opacity-40',
                  )}
                >
                  <Mic size={18} strokeWidth={2.3} aria-hidden />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
