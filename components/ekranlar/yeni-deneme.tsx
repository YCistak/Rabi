'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, Camera, Check, X } from 'lucide-react'
import { Alan, Buton, Etiket, Kart, Not, useKapatmaOnayi } from '@/components/ui'
import {
  EklemeFormu,
  FotografDugmeleri,
  useYanlisSoruEkleme,
} from '@/components/yanlis-soru-ekle'
import { useGeriKatmani } from '@/lib/geri'
import { katsayiYaz, net, netYaz, sonucGecerliMi } from '@/lib/hesap'
import { secilebilirSablonlar, toplamSoru } from '@/lib/sablonlar'
import { bugun, cn, yeniId } from '@/lib/utils'
import type { Deneme, PuanTuru, Sablon, YanlisSoru } from '@/lib/types'
import { DenemeOkut } from '@/components/deneme-okut'
import { bosDersGirisiGecerli, turBosDersi, turFormuSonuclari } from '@/lib/tanitim-veri'
import { TarihSecici } from '@/components/tarih-secici'

const useYerlesimEtkisi = typeof window === 'undefined' ? useEffect : useLayoutEffect

type Giris = { dogru: string; yanlis: string }

function bosGirisler(sablon: Sablon): Record<string, Giris> {
  return Object.fromEntries(sablon.dersler.map((d) => [d.id, { dogru: '', yanlis: '' }]))
}

function sayi(metin: string): number {
  const deger = Number.parseInt(metin, 10)
  return Number.isFinite(deger) && deger > 0 ? deger : 0
}

export function YeniDenemeEkrani({
  sablonlar,
  varsayilanSablonId,
  sinif,
  puanTuru,
  duzenlenen,
  denemeSayisi,
  setYanlisSorular,
  onKaydet,
  onVazgec,
  tanitim,
}: {
  sablonlar: Sablon[]
  varsayilanSablonId: string
  sinif: number
  puanTuru: PuanTuru | null
  duzenlenen: Deneme | null
  denemeSayisi: number
  setYanlisSorular: (guncelleyici: (onceki: YanlisSoru[]) => YanlisSoru[]) => void
  onKaydet: (deneme: Deneme) => void
  onVazgec: () => void
  /**
   * Başlangıç turunda. `ornekDoldur`: tur Okut adımını geçti; form boşsa
   * örnek sonuçlar bir ders hariç yazılıyor (`turFormuSonuclari`), boş
   * dersi kullanıcı dolduruyor ve geçerli giriş `dersGirildi` ile bildiriliyor.
   * "Yanlış soru ekle" turda yalnızca gösteriliyor: düğme katmanı açmıyor
   * (turda yanlış soru eklettirilmiyor — kullanıcı istedi, 2026-10).
   */
  tanitim?: {
    onOkutAcik: (acik: boolean) => void
    ornekDoldur?: boolean
    dersGirildi?: () => void
  }
}) {
  /*
    Seçim listesi sınıfa ve alana göre süzülü (`secilebilirSablonlar`);
    düzenlenen deneme ise şablonunu tam listeden buluyor — 10. sınıfta
    girilmiş bir AYT denemesi bugün seçilemese de düzenlenebilmeli.
  */
  const secenekler = secilebilirSablonlar(sablonlar, sinif, puanTuru)
  const ilkSablon = duzenlenen
    ? (sablonlar.find((s) => s.id === duzenlenen.sablonId) ?? sablonlar[0])
    : (secenekler.find((s) => s.id === varsayilanSablonId) ?? secenekler[0])

  const [sablonId, setSablonId] = useState(ilkSablon.id)
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
    if (!duzenlenen) return bosGirisler(ilkSablon)
    return Object.fromEntries(
      ilkSablon.dersler.map((d) => {
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

  const sablon = sablonlar.find((s) => s.id === sablonId) ?? sablonlar[0]

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
  // Geri tuşu önce ekleme formunu, sonra katmanı kapatmalı. Turda katman hiç açılmıyor.
  useGeriKatmani(yanlisAcik && yanlisEkleme.bekleyen === null, () => setYanlisAcik(false))
  useGeriKatmani(yanlisEkleme.bekleyen !== null, yanlisEkleme.vazgec)

  // Şablon değişince ders listesi değişir, girişler sıfırlanır
  useEffect(() => {
    if (duzenlenen) return
    setGirisler(bosGirisler(sablon))
  }, [sablon, duzenlenen])

  const satirlar = useMemo(
    () =>
      sablon.dersler.map((ders) => {
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
    [sablon, girisler],
  )

  /*
    Turun Okut'tan sonraki adımları: Okut ile okunan bir sonuç varsa ona
    dokunulmuyor, form boşsa örnek sonuçlar bir ders hariç yazılıyor. Bir süre
    hepsi doluyordu ve kullanıcı tabloya hiç dokunmuyordu; tek ders, klavyenin
    ve balonun tabloyu kapatmadığı ilk satır (`turBosDersi`).
  */
  const ornekDoldur = !!tanitim?.ornekDoldur
  /*
    Boyamadan önce: sonuçlar bir sonraki karede yazılınca "Kaydetmek için en az
    bir derse sonuç gir" notu bir kare görünüyor, Kaydet bölümü 24 px kısalıyor
    ve rehberin spotu o arada ölçtüğü uzun hâle gidip ikinci kez oynuyordu
    (yavaş telefonda iki karelik durgunluk o notun ömründen kısa).
  */
  useYerlesimEtkisi(() => {
    if (!ornekDoldur) return
    setGirisler((onceki) => {
      const bos = sablon.dersler.every((d) => !Number(onceki[d.id]?.dogru || 0) && !Number(onceki[d.id]?.yanlis || 0))
      if (!bos) return onceki
      return { ...bosGirisler(sablon), ...Object.fromEntries(turFormuSonuclari(sablon).map((s) => [s.dersId, { dogru: String(s.dogru), yanlis: String(s.yanlis) }])) }
    })
  }, [ornekDoldur, sablon])

  /*
    Boş derse geçerli sonuç girilince tur bir sonraki adıma geçiyor; ama son
    tuştan kısa bir süre sonra: "12" yazan kullanıcı "1"de ileri atılmasın.
    Klavye de kapatılıyor, yoksa sıradaki adımın düğmesini örterdi.
  */
  const bosDers = ornekDoldur ? turBosDersi(sablon) : null
  const bosGiris = bosDers ? girisler[bosDers] : undefined
  const bosDersTanimi = bosDers ? sablon.dersler.find((d) => d.id === bosDers) : undefined
  const bosDersGecerli = !!bosDersTanimi && bosDersGirisiGecerli(bosGiris, bosDersTanimi)
  const dersGirildi = tanitim?.dersGirildi
  useEffect(() => {
    if (!bosDersGecerli || !dersGirildi) return
    const zamanlayici = setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
      dersGirildi()
    }, 900)
    return () => clearTimeout(zamanlayici)
  }, [bosDersGecerli, bosGiris, dersGirildi])

  const hataliDers = satirlar.find((s) => s.asim)
  const bosMu = satirlar.every((s) => s.dogru === 0 && s.yanlis === 0)
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

  /*
    Vazgeç yalnız girilmiş bir şey kaybolacaksa soruyor: yeni denemede bir
    sayı ya da ad yazıldıysa, düzenlemede bir şey değiştiyse. Boş formu
    kapatmak bir şey kaybettirmez.
  */
  const [ilkHal] = useState(() => JSON.stringify({ ad, girisler }))
  const girildi = duzenlenen
    ? JSON.stringify({ ad, girisler }) !== ilkHal
    : ad.trim() !== '' ||
      Object.values(girisler).some((g) => g.dogru !== '' || g.yanlis !== '')
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
                className={cn(
                  'flex h-11 shrink-0 snap-start items-center justify-center whitespace-nowrap rounded-[13px] border px-4 text-[12.5px] transition',
                  s.id === sablonId
                    ? 'border-[1.5px] border-primary-parlak bg-primary-soft font-extrabold text-primary'
                    : 'border-border bg-card font-bold text-muted-foreground active:bg-muted',
                )}
              >
                {s.ad}
              </button>
            ))}
          </div>
        </div>
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

      <DenemeOkut key={sablon.id} sablon={sablon} onAcikDegisti={tanitim?.onOkutAcik} onAktar={(okunanlar) => {
        setGirisler((onceki) => {
          const yeni = { ...onceki }
          for (const ders of okunanlar) yeni[ders.dersId] = { dogru: String(ders.dogru), yanlis: String(ders.yanlis) }
          return yeni
        })
      }} />
      <div data-tanitim="deneme-elle">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">Elle gir</p>
      <Kart className="p-0">
        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
          <span>Ders</span>
          <span className="w-14 text-center">Doğru</span>
          <span className="w-14 text-center">Yanlış</span>
          <span className="w-14 text-right">Net</span>
        </div>

        <ul>
          {satirlar.map((satir) => (
            <li
              key={satir.ders.id}
              data-tanitim={satir.ders.id === bosDers ? 'deneme-bos-ders' : undefined}
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 border-b border-border px-3 py-2 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{satir.ders.ad}</p>
                <p className="text-xs text-muted-foreground">
                  {satir.ders.soruSayisi} soru · {satir.bos} boş
                </p>
              </div>

              <Alan
                inputMode="numeric"
                aria-label={`${satir.ders.ad} doğru sayısı`}
                value={girisler[satir.ders.id]?.dogru ?? ''}
                onChange={(e) => girisDegistir(satir.ders.id, 'dogru', e.target.value)}
                className={cn(
                  'h-10 w-14 px-0 text-center rakam',
                  satir.asim && 'border-danger text-danger',
                )}
              />
              <Alan
                inputMode="numeric"
                aria-label={`${satir.ders.ad} yanlış sayısı`}
                value={girisler[satir.ders.id]?.yanlis ?? ''}
                onChange={(e) => girisDegistir(satir.ders.id, 'yanlis', e.target.value)}
                className={cn(
                  'h-10 w-14 px-0 text-center rakam',
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
          ))}
        </ul>
      </Kart>

      {hataliDers && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            <strong>{hataliDers.ders.ad}</strong>: doğru + yanlış toplamı{' '}
            {hataliDers.ders.soruSayisi} soruyu aşıyor.
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
        data-tanitim="deneme-yanlis-ekle"
        bicim="ikincil"
        className="mt-4 w-full"
        // Turda düğme yalnızca gösteriliyor; kamera/izin penceresi açılmasın.
        onClick={() => { if (!tanitim) setYanlisAcik(true) }}
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

      <div data-tanitim="deneme-kaydet" className="mt-3">
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
