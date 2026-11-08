'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, Camera, Check, Pencil, X } from 'lucide-react'
import { Alan, Buton, Etiket, Kart, Not, useKapatmaOnayi } from '@/components/ui'
import {
  EklemeFormu,
  FotografDugmeleri,
  useYanlisSoruEkleme,
} from '@/components/yanlis-soru-ekle'
import { useGeriKatmani } from '@/lib/geri'
import { katsayiYaz, net, netYaz, sonucGecerliMi } from '@/lib/hesap'
import { ALAN_KISA_ADI, secilebilirSablonlar, toplamSoru } from '@/lib/sablonlar'
import {
  alanGerekir,
  hazirSeviyeSablonu,
  SEVIYE_SINIFLARI,
  seviyeSablonu,
  varsayilanSeviyeSinifi,
  type SeviyeSinifi,
} from '@/lib/seviye-tespit'
import { bugun, cn, yeniId } from '@/lib/utils'
import type { Deneme, PuanTuru, Sablon, SablonDers, TopluGrup, YanlisSoru } from '@/lib/types'
import {
  gecerliToplu,
  sablonGruplari,
  TOPLU_GRUP_ADI,
  topluGecerliMi,
  type SablonGrubu,
} from '@/lib/toplu-grup'
import { DenemeOkut } from '@/components/deneme-okut'
import type { DenemeBaslangici } from '@/components/sesli-giris'
import { bosSifir } from '@/lib/bos-sifir'
import { TarihSecici } from '@/components/tarih-secici'
import { SeviyeDersleri } from '@/components/seviye-dersleri'
import { Rabi } from '@/components/maskot/rabi'

const useYerlesimEtkisi = typeof window === 'undefined' ? useEffect : useLayoutEffect

type Giris = { dogru: string; yanlis: string }

const BOS_GIRIS: Giris = { dogru: '', yanlis: '' }

/** Ders kutularındaki sayıların toplamı; hiçbiri yazılmamışsa kutu boş kalır. */
function girisToplami(girisler: Giris[]): Giris {
  const topla = (alan: keyof Giris) => {
    if (girisler.every((g) => g[alan] === '')) return ''
    return String(girisler.reduce((t, g) => t + sayi(g[alan]), 0))
  }
  return { dogru: topla('dogru'), yanlis: topla('yanlis') }
}

/** Ders satırı da toplu satır da aynı görünümle çiziliyor. */
type SatirCizimi = {
  ad: string
  soruSayisi: number
  bos: number
  net: number
  asim: boolean
  giris: Giris
  onDegis: (alan: keyof Giris, deger: string) => void
}

function DersSatiri({ satir }: { satir: SatirCizimi }) {
  return (
    <li className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 border-b border-border px-3 py-2 last:border-b-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{satir.ad}</p>
        <p className="text-xs text-muted-foreground">
          {satir.soruSayisi} soru · {satir.bos} boş
        </p>
      </div>

      <Alan
        inputMode="numeric"
        placeholder="0"
        aria-label={`${satir.ad} doğru sayısı`}
        value={satir.giris.dogru}
        onChange={(e) => satir.onDegis('dogru', e.target.value)}
        className={cn(
          'h-10 w-14 px-0 text-center rakam focus:placeholder:text-transparent',
          satir.asim && 'border-danger text-danger',
        )}
      />
      <Alan
        inputMode="numeric"
        placeholder="0"
        aria-label={`${satir.ad} yanlış sayısı`}
        value={satir.giris.yanlis}
        onChange={(e) => satir.onDegis('yanlis', e.target.value)}
        className={cn(
          'h-10 w-14 px-0 text-center rakam focus:placeholder:text-transparent',
          satir.asim && 'border-danger text-danger',
        )}
      />

      <span
        className={cn(
          'w-14 text-right font-display text-[15px] font-semibold rakam',
          satir.asim && 'text-danger',
        )}
      >
        {satir.asim ? '—' : netYaz(satir.net)}
      </span>
    </li>
  )
}

const ALANLAR = Object.keys(ALAN_KISA_ADI) as PuanTuru[]

/** Tür, sınıf ve alan satırlarının düğmesi: üçü aynı dilde. */
function secimDugmesi(secili: boolean): string {
  return cn(
    'flex h-11 shrink-0 snap-start items-center justify-center whitespace-nowrap rounded-[13px] border px-4 text-[12.5px] transition',
    secili
      ? 'border-[1.5px] border-primary-parlak bg-primary-soft font-extrabold text-primary'
      : 'border-border bg-card font-bold text-muted-foreground active:bg-muted',
  )
}

function bosGirisler(sablon: Sablon): Record<string, Giris> {
  return Object.fromEntries(sablon.dersler.map((d) => [d.id, { dogru: '', yanlis: '' }]))
}

// Boş kutu 0 sayılır (ortak kural: lib/bos-sifir.ts).
const sayi = bosSifir

export function YeniDenemeEkrani({
  sablonlar,
  varsayilanSablonId,
  sinif,
  puanTuru,
  duzenlenen,
  baslangic,
  denemeSayisi,
  setYanlisSorular,
  onKaydet,
  onSeviyeDersleriKaydet,
  onVazgec,
}: {
  sablonlar: Sablon[]
  varsayilanSablonId: string
  sinif: number
  puanTuru: PuanTuru | null
  duzenlenen: Deneme | null
  baslangic?: DenemeBaslangici
  denemeSayisi: number
  setYanlisSorular: (guncelleyici: (onceki: YanlisSoru[]) => YanlisSoru[]) => void
  /** "Dersleri düzenle": seçili sınıfın (11-12'de alanın) seviye tespit dersleri. */
  onSeviyeDersleriKaydet: (sinif: SeviyeSinifi, alan: PuanTuru, dersler: SablonDers[]) => void
  onKaydet: (deneme: Deneme) => void
  onVazgec: () => void
}) {
  /*
    Seçim listesi sınıfa ve alana göre süzülü (`secilebilirSablonlar`);
    düzenlenen deneme ise şablonunu tam listeden buluyor — 10. sınıfta
    girilmiş bir AYT denemesi bugün seçilemese de düzenlenebilmeli.
  */
  const secenekler = secilebilirSablonlar(sablonlar, sinif, puanTuru)

  // Tür satırında seçili düğme; seviye tespit tek düğme (`okul`).
  const [sablonId, setSablonId] = useState(() => {
    const aranan = !duzenlenen && baslangic ? baslangic.sablonId : varsayilanSablonId
    return (
      secenekler.find((s) => s.id === aranan) ??
      secenekler.find((s) => s.id === varsayilanSablonId) ??
      secenekler[0]
    ).id
  })
  /*
    Seviye tespit sınıfa göre (kullanıcı istedi, 2026-10): 9 eski biçim, 10'da
    Felsefe ekleniyor, 11 ve 12 alanın AYT'si gibi. Varsayılan öğrencinin kendi
    sınıfı.
    Alan Ayarlar'dan; seçilmemişse 11-12'de altta soruluyor.
  */
  const [seviyeSinifi, setSeviyeSinifi] = useState<SeviyeSinifi>(() =>
    varsayilanSeviyeSinifi(sinif),
  )
  const [seciliAlan, setSeciliAlan] = useState<PuanTuru>(puanTuru ?? 'say')
  const seviyeAlani = puanTuru ?? seciliAlan
  const seviyeSecili = !duzenlenen && sablonId === 'okul'
  const [derslerAcik, setDerslerAcik] = useState(false)

  /*
    Düzenlenen deneme şablonunu tam listeden buluyor — 10. sınıfta girilmiş
    bir AYT denemesi bugün seçilemese de düzenlenebilmeli; düzenlenmiş seviye
    tespit dersleri sonradan değişse de kendi şablonunda kalıyor.
  */
  const sablon = duzenlenen
    ? (sablonlar.find((s) => s.id === duzenlenen.sablonId) ?? sablonlar[0])
    : seviyeSecili
      ? seviyeSablonu(sablonlar, seviyeSinifi, seviyeAlani)
      : (sablonlar.find((s) => s.id === sablonId) ?? sablonlar[0])
  const turSeridi = useRef<HTMLDivElement>(null)

  /*
    Varsayılan tür satırın sonundaysa (11. sınıf ve üstünde alanın AYT'si)
    açılışta görünmezdi; şerit ilk çizimde seçili düğmeye kaydırılıyor.
    Yalnız açılışta: kullanıcı kaydırıp seçtikten sonra şerit yerinde kalır.
  */
  useYerlesimEtkisi(() => {
    const serit = turSeridi.current
    const secili = serit?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!serit || !secili) return
    const kutu = serit.getBoundingClientRect()
    const dugme = secili.getBoundingClientRect()
    if (dugme.right > kutu.right) serit.scrollLeft += dugme.left - kutu.left
  }, [])
  const [tarih, setTarih] = useState(duzenlenen?.tarih ?? bugun())
  const [ad, setAd] = useState(duzenlenen?.ad ?? '')
  const [girisler, setGirisler] = useState<Record<string, Giris>>(() => {
    if (!duzenlenen) {
      const taban = bosGirisler(sablon)
      if (!baslangic) return taban
      for (const d of sablon.dersler) {
        const g = baslangic.girisler[d.id]
        if (g) taban[d.id] = { dogru: g.dogru, yanlis: g.yanlis }
      }
      return taban
    }
    return Object.fromEntries(
      sablon.dersler.map((d) => {
        const sonuc = duzenlenen.sonuclar.find((s) => s.dersId === d.id)
        return [
          d.id,
          {
            dogru: sonuc ? String(sonuc.dogru) : '',
            yanlis: sonuc ? String(sonuc.yanlis) : '',
          },
        ]
      }),
    )
  })

  /*
    Sosyal/Fen toplu girişi (kullanıcı istedi, 2026-11): grup ya ders ders ya
    toplu. Toplu sonuç derslere bölünmez (`lib/toplu-grup.ts`).
  */
  const gruplar = useMemo(() => sablonGruplari(sablon), [sablon])
  const [toplu, setToplu] = useState<Partial<Record<TopluGrup, Giris>>>(() => {
    if (duzenlenen) {
      return Object.fromEntries(
        gecerliToplu(duzenlenen, sablon).map((t) => [
          t.grup,
          { dogru: String(t.dogru), yanlis: String(t.yanlis) },
        ]),
      )
    }
    const gelen = baslangic?.toplu
    if (!gelen) return {}
    return Object.fromEntries(
      gruplar.flatMap((g) => {
        const giris = gelen[g.grup]
        return giris ? [[g.grup, { dogru: giris.dogru, yanlis: giris.yanlis }]] : []
      }),
    )
  })

  /** Ders ders → toplu: yazılmış ders sayıları toplanıp toplu kutulara taşınır. */
  const topluyaGec = (grup: SablonGrubu) => {
    if (toplu[grup.grup]) return
    setToplu((t) => ({
      ...t,
      [grup.grup]: girisToplami(grup.dersIdleri.map((id) => girisler[id] ?? BOS_GIRIS)),
    }))
    setGirisler((g) => ({
      ...g,
      ...Object.fromEntries(grup.dersIdleri.map((id) => [id, BOS_GIRIS])),
    }))
  }

  /**
   * Toplu → ders ders: ders kutuları boş açılır. Toplu sayı derslere
   * bölünmez — bölünseydi öğrencinin hiç girmediği ders sonuçları uydurulurdu.
   */
  const dersDerseGec = (grup: SablonGrubu, dersleriBosalt = true) => {
    setToplu((t) => {
      const yeni = { ...t }
      delete yeni[grup.grup]
      return yeni
    })
    if (dersleriBosalt) {
      setGirisler((g) => ({
        ...g,
        ...Object.fromEntries(grup.dersIdleri.map((id) => [id, BOS_GIRIS])),
      }))
    }
  }

  /*
    Yanlış soru ekleme bu ekranın **içinde** bir katman olarak açılıyor,
    Yanlış Soru Bankası ekranına gidilmiyor.

    Sebep tek: girilen netler. Bu ekran ana kabuktaki `denemeFormu` state'ine
    bağlı ve başka bir ekrana geçmek onu söküyor — kullanıcı sekiz dersin
    doğru/yanlışını yazdıktan sonra bir soru fotoğraflayıp döndüğünde boş bir
    form buluyordu. Katman üstte açılıyor, form altında olduğu gibi duruyor.
  */
  const [yanlisAcik, setYanlisAcik] = useState(false)
  const [eklenenYanlis, setEklenenYanlis] = useState(0)
  const yanlisEkleme = useYanlisSoruEkleme(setYanlisSorular)
  // Geri tuşu önce ekleme formunu, sonra katmanı kapatmalı.
  useGeriKatmani(yanlisAcik && yanlisEkleme.bekleyen === null, () => setYanlisAcik(false))
  useGeriKatmani(yanlisEkleme.bekleyen !== null, yanlisEkleme.vazgec)

  /*
    Şablon değişince ders listesi değişir, girişler sıfırlanır. Seviye
    tespitte sınıf değişince ya da dersler düzenlenince ortak derslere yazılan
    sayılar kalıyor: 9'dan 10'a geçen kullanıcı ötekileri baştan yazmasın.
  */
  const oncekiSablon = useRef(sablon)
  useEffect(() => {
    if (duzenlenen) return
    const onceki = oncekiSablon.current
    oncekiSablon.current = sablon
    // İlk çizimde şablon değişmedi; sıfırlanırsa sesli girişten aktarılan
    // başlangıç sayıları silinir.
    if (onceki === sablon) return
    if (onceki.seviye && sablon.seviye) {
      setGirisler((g) => ({
        ...bosGirisler(sablon),
        ...Object.fromEntries(sablon.dersler.flatMap((d) => (g[d.id] ? [[d.id, g[d.id]]] : []))),
      }))
      // Yeni şablonda da olan toplu grup yerinde kalıyor.
      const yeniGruplar = new Set(sablonGruplari(sablon).map((g) => g.grup))
      setToplu((t) =>
        Object.fromEntries(Object.entries(t).filter(([grup]) => yeniGruplar.has(grup as TopluGrup))),
      )
      return
    }
    setGirisler(bosGirisler(sablon))
    setToplu({})
  }, [sablon, duzenlenen])

  // Toplu girilen grubun dersleri ders satırı olarak çizilmez, kaydedilmez.
  const topluDersler = useMemo(
    () => new Set(gruplar.filter((g) => toplu[g.grup]).flatMap((g) => g.dersIdleri)),
    [gruplar, toplu],
  )

  const satirlar = useMemo(
    () =>
      sablon.dersler.filter((ders) => !topluDersler.has(ders.id)).map((ders) => {
        const giris = girisler[ders.id] ?? { dogru: '', yanlis: '' }
        const dogru = sayi(giris.dogru)
        const yanlis = sayi(giris.yanlis)
        // Doğrulama tek yerden: hesap.ts. Ekranda ayrıca kural yazılmıyor ki
        // ikisi zamanla birbirinden ayrışmasın.
        const asim = !sonucGecerliMi({ dersId: ders.id, dogru, yanlis }, ders)
        return {
          ders,
          dogru,
          yanlis,
          bos: Math.max(0, ders.soruSayisi - dogru - yanlis),
          net: net(dogru, yanlis, sablon.yanlisKatsayi),
          asim,
        }
      }),
    [sablon, girisler, topluDersler],
  )

  const topluSatirlar = useMemo(
    () =>
      gruplar.flatMap((grup) => {
        const giris = toplu[grup.grup]
        if (!giris) return []
        const dogru = sayi(giris.dogru)
        const yanlis = sayi(giris.yanlis)
        return [
          {
            grup,
            ad: TOPLU_GRUP_ADI[grup.grup],
            dogru,
            yanlis,
            bos: Math.max(0, grup.soruSayisi - dogru - yanlis),
            net: net(dogru, yanlis, sablon.yanlisKatsayi),
            asim: !topluGecerliMi({ grup: grup.grup, dogru, yanlis }, grup.soruSayisi),
          },
        ]
      }),
    [gruplar, toplu, sablon],
  )

  const dersHatasi = satirlar.find((s) => s.asim)
  const topluHatasi = topluSatirlar.find((s) => s.asim)
  const hataliDers = dersHatasi
    ? { ad: dersHatasi.ders.ad, soruSayisi: dersHatasi.ders.soruSayisi }
    : topluHatasi
      ? { ad: topluHatasi.ad, soruSayisi: topluHatasi.grup.soruSayisi }
      : undefined
  const bosMu =
    satirlar.every((s) => s.dogru === 0 && s.yanlis === 0) &&
    topluSatirlar.every((s) => s.dogru === 0 && s.yanlis === 0)
  /*
    Tarih kutusu temizlenebiliyor (tarayıcının "temizle" düğmesi, Android'de
    silme tuşu) ve boş tarihle kaydedilen deneme listede tarihsiz duruyor,
    tarihe göre sıralamada da en başa düşüp "en yeni" hesabını bozuyordu.
  */
  const tarihGecerli = /^\d{4}-\d{2}-\d{2}$/.test(tarih)

  const girisDegistir = (dersId: string, alan: keyof Giris, deger: string) => {
    const temiz = deger.replace(/[^0-9]/g, '').slice(0, 3)
    setGirisler((onceki) => ({
      ...onceki,
      [dersId]: { ...(onceki[dersId] ?? { dogru: '', yanlis: '' }), [alan]: temiz },
    }))
  }

  const topluDegistir = (grup: TopluGrup, alan: keyof Giris, deger: string) => {
    const temiz = deger.replace(/[^0-9]/g, '').slice(0, 3)
    setToplu((onceki) => ({
      ...onceki,
      [grup]: { ...(onceki[grup] ?? BOS_GIRIS), [alan]: temiz },
    }))
  }

  const dersCizimi = (satir: (typeof satirlar)[number]): SatirCizimi => ({
    ad: satir.ders.ad,
    soruSayisi: satir.ders.soruSayisi,
    bos: satir.bos,
    net: satir.net,
    asim: satir.asim,
    giris: girisler[satir.ders.id] ?? BOS_GIRIS,
    onDegis: (alan, deger) => girisDegistir(satir.ders.id, alan, deger),
  })

  /*
    Vazgeç yalnız girilmiş bir şey kaybolacaksa soruyor: yeni denemede bir
    sayı ya da ad yazıldıysa, düzenlemede bir şey değiştiyse. Boş formu
    kapatmak bir şey kaybettirmez.
  */
  const [ilkHal] = useState(() => JSON.stringify({ ad, girisler, toplu }))
  const girildi = duzenlenen
    ? JSON.stringify({ ad, girisler, toplu }) !== ilkHal
    : ad.trim() !== '' ||
      Object.values(girisler).some((g) => g.dogru !== '' || g.yanlis !== '') ||
      Object.values(toplu).some((g) => g !== undefined && (g.dogru !== '' || g.yanlis !== ''))
  const vazgecOnayi = useKapatmaOnayi({
    aciklama: duzenlenen
      ? 'Yaptığın değişiklikler kaydedilmez.'
      : 'Girdiğin sonuçlar kaydedilmez.',
  })

  const kaydet = () => {
    if (hataliDers || bosMu || !tarihGecerli) return
    onKaydet({
      id: duzenlenen?.id ?? yeniId(),
      sablonId: sablon.id,
      ad: ad.trim() || `${sablon.ad} ${denemeSayisi + 1}`,
      tarih,
      sonuclar: satirlar.map((s) => ({
        dersId: s.ders.id,
        dogru: s.dogru,
        yanlis: s.yanlis,
      })),
      // Toplu grup yoksa alan hiç yazılmıyor: kayıt eski biçimle aynı kalıyor.
      ...(topluSatirlar.length > 0 && {
        toplu: topluSatirlar.map((s) => ({ grup: s.grup.grup, dogru: s.dogru, yanlis: s.yanlis })),
      }),
    })
  }

  /*
    Kök `overflow-x-clip`: ekran yana kayıyordu. Sebep tarih kutusu — iOS'un
    tarih alanının kendi en küçük genişliği var ve ızgara hücresinin varsayılan
    `min-width: auto`su onu daraltmıyor; hücre taşıyor, sayfa da onunla yana
    kayıyordu. Hücreler artık `minmax(0,1fr)`; kırpma, başka bir alanın aynı
    şeyi yapmasına karşı emniyet. (`hidden` değil `clip`: kaydırma kabı
    kurmuyor, içerideki yapışkan öğeleri bozmuyor.)

    Üstte bir süre yapışkan bir "Toplam net" kutusu duruyordu; kullanıcı
    kaldırılmasını istedi — her dersin neti satırında yazıyor, toplam da
    kaydedilen denemenin kartında.
  */
  return (
    <div className="overflow-x-clip">
      {vazgecOnayi.pencere}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {duzenlenen ? 'Denemeyi Düzenle' : 'Yeni Deneme'}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {sablon.ad} · {toplamSoru(sablon)} soru · {katsayiYaz(sablon.yanlisKatsayi)}
          </p>
        </div>
        <Buton bicim="hayalet" boy="simge" onClick={() => (girildi ? vazgecOnayi.sor(onVazgec) : onVazgec())} aria-label="Vazgeç">
          <X size={20} />
        </Buton>
      </div>

      {!duzenlenen && (
        <div className="mb-4">
          <Etiket>Deneme türü</Etiket>
          {/* Kullanıcı istedi: türler iki sütunlu ızgara yerine tek satırda,
              sağa kaydırılarak seçiliyor. Sağ kenarda kesilen düğme satırın
              devam ettiğini gösteriyor. */}
          <div
            ref={turSeridi}
            className="flex snap-x snap-proximity gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {secenekler.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={s.id === sablonId}
                onClick={() => setSablonId(s.id)}
                className={secimDugmesi(s.id === sablonId)}
              >
                {/* Şablonun adı sınıfı taşıyor; sınıf altındaki satırda seçiliyor. */}
                {s.id === 'okul' ? 'Seviye Tespit' : s.ad}
              </button>
            ))}
          </div>
        </div>
      )}

      {seviyeSecili && (
        <div className="mb-4">
          <Etiket>Sınıf</Etiket>
          <div className="grid grid-cols-4 gap-2">
            {SEVIYE_SINIFLARI.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={s === seviyeSinifi}
                onClick={() => setSeviyeSinifi(s)}
                className={cn(secimDugmesi(s === seviyeSinifi), 'px-0')}
              >
                {s}. sınıf
              </button>
            ))}
          </div>
          {/* 11-12'nin seviye tespiti alanın AYT'si; alan Ayarlar'da seçilmemişse burada. */}
          {alanGerekir(seviyeSinifi) && puanTuru === null && (
            <>
              <Etiket className="mt-3">Alan</Etiket>
              <div className="grid grid-cols-4 gap-2">
                {ALANLAR.map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={a === seciliAlan}
                    onClick={() => setSeciliAlan(a)}
                    className={cn(secimDugmesi(a === seciliAlan), 'px-0')}
                  >
                    {ALAN_KISA_ADI[a]}
                  </button>
                ))}
              </div>
            </>
          )}
          {/*
            "Dersleri düzenle" Rabi'nin balonunda. Önce sınıf satırının
            sağında küçük bir bağlantıydı; kullanıcı fark edilmediğini söyledi
            (2026-10-29): okulun denemesi hazır şablondan farklıysa çıkış yolu
            bu, göze girmesi gerekiyor.
          */}
          <div className="mt-3 flex items-end gap-1.5">
            <Rabi poz="laptoplu" boyut={72} className="-mb-1 shrink-0" />
            <div className="relative min-w-0 flex-1 rounded-2xl border border-[var(--rabi-balon-kenar)] bg-[var(--rabi-balon)] px-3.5 py-3 shadow-kart">
              <span aria-hidden className="absolute bottom-4 -left-[7px] size-3 rotate-45 rounded-[2px] border-b border-l border-[var(--rabi-balon-kenar)] bg-[var(--rabi-balon)]" />
              <p className="relative text-[13px] leading-snug font-bold text-foreground">
                Okulundaki denemenin dersleri ya da soru sayıları farklı mı? Buradan değiştirebilirsin.
              </p>
              <button
                type="button"
                onClick={() => setDerslerAcik(true)}
                className="relative mt-2.5 inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary-parlak px-3.5 text-[13px] font-extrabold text-white transition active:scale-[0.98] active:brightness-95"
              >
                <Pencil size={15} aria-hidden />
                Dersleri düzenle
              </button>
            </div>
          </div>
        </div>
      )}

      {derslerAcik && (
        <SeviyeDersleri
          sablon={sablon}
          hazir={hazirSeviyeSablonu(seviyeSinifi, seviyeAlani)}
          baslik={`${seviyeSinifi}. sınıf${alanGerekir(seviyeSinifi) ? ` ${ALAN_KISA_ADI[seviyeAlani]}` : ''}`}
          onKaydet={(dersler) => {
            onSeviyeDersleriKaydet(seviyeSinifi, seviyeAlani, dersler)
            setDerslerAcik(false)
          }}
          onKapat={() => setDerslerAcik(false)}
        />
      )}

      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
        <div className="min-w-0">
          <Etiket htmlFor="deneme-ad">Deneme adı</Etiket>
          <Alan
            id="deneme-ad"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            placeholder={`${sablon.ad} ${denemeSayisi + 1}`}
          />
        </div>
        <div className="min-w-0">
          <Etiket htmlFor="deneme-tarih">Tarih</Etiket>
          <TarihSecici id="deneme-tarih" deger={tarih} onDegis={setTarih} />
        </div>
      </div>

      <DenemeOkut key={sablon.id} sablon={sablon} onAktar={(okunanlar) => {
        setGirisler((onceki) => {
          const yeni = { ...onceki }
          for (const ders of okunanlar) yeni[ders.dersId] = { dogru: String(ders.dogru), yanlis: String(ders.yanlis) }
          return yeni
        })
        // Okut ders ders okuyor: okunan dersi olan toplu grup ders derse döner,
        // yoksa okunan sayılar gizli satırlarda kalırdı.
        for (const g of gruplar) {
          if (toplu[g.grup] && okunanlar.some((o) => g.dersIdleri.includes(o.dersId))) dersDerseGec(g, false)
        }
      }} />
      <div>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">Elle gir</p>
      <Kart className="p-0">
        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
          <span>Ders</span>
          <span className="w-14 text-center">Doğru</span>
          <span className="w-14 text-center">Yanlış</span>
          <span className="w-14 text-right">Net</span>
        </div>

        <ul>
          {/*
            Ders sırası şablondan; bir grubun dersleri ilk üyesinin yerinde,
            grup başlığının altında bir arada (9. sınıfta Din, Fen'in
            arkasında kalıyor).
          */}
          {sablon.dersler.map((ders) => {
            const grup = gruplar.find((g) => g.dersIdleri.includes(ders.id))
            if (!grup) {
              const satir = satirlar.find((s) => s.ders.id === ders.id)
              return satir ? <DersSatiri key={ders.id} satir={dersCizimi(satir)} /> : null
            }
            if (grup.dersIdleri[0] !== ders.id) return null
            const topluSatir = topluSatirlar.find((s) => s.grup.grup === grup.grup)
            return (
              <li key={`grup-${grup.grup}`} className="border-b border-border last:border-b-0">
                <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/50 px-3 py-1.5">
                  <span className="text-xs font-extrabold text-muted-foreground">
                    {TOPLU_GRUP_ADI[grup.grup]}
                  </span>
                  <div
                    className="flex gap-0.5 rounded-[10px] bg-muted p-0.5"
                    role="group"
                    aria-label={`${TOPLU_GRUP_ADI[grup.grup]} giriş biçimi`}
                  >
                    {(['ders', 'toplu'] as const).map((bicim) => {
                      const secili = (bicim === 'toplu') === !!topluSatir
                      return (
                        <button
                          key={bicim}
                          type="button"
                          aria-pressed={secili}
                          onClick={() =>
                            bicim === 'toplu' ? topluyaGec(grup) : topluSatir && dersDerseGec(grup)
                          }
                          className={cn(
                            'h-7 rounded-[8px] px-2.5 text-xs font-extrabold transition-[background-color,box-shadow] duration-200',
                            secili
                              ? 'bg-secili text-primary shadow-[0_1px_3px_rgba(27,26,25,0.12),0_1px_1px_rgba(27,26,25,0.04)] ring-1 ring-secili-kenar'
                              : 'text-muted-foreground',
                          )}
                        >
                          {bicim === 'toplu' ? 'Toplu' : 'Ders ders'}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <ul>
                  {topluSatir ? (
                    <DersSatiri
                      satir={{
                        ad: topluSatir.ad,
                        soruSayisi: grup.soruSayisi,
                        bos: topluSatir.bos,
                        net: topluSatir.net,
                        asim: topluSatir.asim,
                        giris: toplu[grup.grup] ?? BOS_GIRIS,
                        onDegis: (alan, deger) => topluDegistir(grup.grup, alan, deger),
                      }}
                    />
                  ) : (
                    grup.dersIdleri.map((id) => {
                      const satir = satirlar.find((s) => s.ders.id === id)
                      return satir ? <DersSatiri key={id} satir={dersCizimi(satir)} /> : null
                    })
                  )}
                </ul>
                {topluSatir && (
                  <p className="-mt-1 px-3 pb-2 text-[11px] text-muted-foreground/80">
                    Toplu girince istatistiklerde bu derslerin ayrı analizi olmaz.
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      </Kart>

      {hataliDers && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            <strong>{hataliDers.ad}</strong>: doğru + yanlış toplamı{' '}
            {hataliDers.soruSayisi} soruyu aşıyor.
          </span>
        </p>
      )}
      </div>

      {/*
        Yanlış soru düğmesi Kaydet'in hemen üstünde: yanlışlar kâğıttan tam da
        sayılar yazılırken çekiliyor ve kaydettikten sonra ekran kapandığı için
        "sonra eklerim" pratikte "hiç eklemem" oluyordu.
      */}
      <Buton
        bicim="ikincil"
        className="mt-4 w-full"
        onClick={() => setYanlisAcik(true)}
      >
        <Camera size={18} aria-hidden />
        Yanlış soru ekle
        {eklenenYanlis > 0 && ` (${eklenenYanlis})`}
      </Buton>

      {eklenenYanlis > 0 && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {eklenenYanlis} soru bankaya eklendi. Girdiğin netler yerinde duruyor.
        </p>
      )}

      <div className="mt-3">
      <div className="flex gap-2">
        <Buton bicim="ikincil" className="flex-1" onClick={onVazgec}>
          Vazgeç
        </Buton>
        <Buton className="flex-1" onClick={kaydet} disabled={!!hataliDers || bosMu || !tarihGecerli}>
          <Check size={18} />
          Kaydet
        </Buton>
      </div>
      {bosMu && !hataliDers && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Kaydetmek için en az bir derse sonuç gir.
        </p>
      )}
      {!bosMu && !hataliDers && !tarihGecerli && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Kaydetmek için denemenin tarihini seç.
        </p>
      )}
      </div>

      {yanlisAcik && (
        /* Katman tam ekran ve donuk: altındaki form görünür kalsaydı iki ayrı
           "kaydet" düğmesi aynı anda ekranda olurdu. */
        <div className="tam-katman-girisi fixed inset-0 z-50 overflow-y-auto bg-background">
          <div className="mx-auto max-w-md px-4 pt-[calc(1.25rem+var(--guvenli-ust))] pb-[calc(2rem+var(--guvenli-alt))]">
            {yanlisEkleme.gizliGirdi}

            {yanlisEkleme.bekleyen ? (
              <EklemeFormu
                onizleme={yanlisEkleme.bekleyen.url}
                onKaydet={async (bilgi) => {
                  if (await yanlisEkleme.kaydet(bilgi)) {
                    setEklenenYanlis((n) => n + 1)
                    // Katman kapanıyor: deneme formuna dönmek asıl iş, art
                    // arda çekim isteyen kullanıcı düğmeye yeniden basıyor.
                    setYanlisAcik(false)
                  }
                }}
                onVazgec={yanlisEkleme.vazgec}
                hata={yanlisEkleme.hata}
              />
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold tracking-tight">
                    Yanlış soru ekle
                  </h2>
                  <Buton
                    bicim="hayalet"
                    boy="simge"
                    onClick={() => setYanlisAcik(false)}
                    aria-label="Kapat"
                  >
                    <X size={20} />
                  </Buton>
                </div>

                <FotografDugmeleri
                  onSec={(kaynak) => void yanlisEkleme.fotografAl(kaynak)}
                  className="mb-3 flex gap-2"
                />

                {yanlisEkleme.hata && (
                  <Not tur="tehlike" className="mb-3">
                    {yanlisEkleme.hata}
                  </Not>
                )}

                <Not>
                  Fotoğraf Yanlış Soru Bankası'na gidiyor. Bu ekranda girdiğin doğru ve
                  yanlış sayıları silinmiyor.
                </Not>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
