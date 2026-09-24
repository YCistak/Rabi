'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Images,
  RotateCcw,
  Shuffle,
  SkipForward,
  Trash2,
  X,
} from 'lucide-react'
import type { YanlisSoru } from '@/lib/types'
import {
  bankaOzeti,
  bankaSuz,
  bekledigiGun,
  derslereGore,
  dersRengi,
  ESKI_SORU_GUNU,
  gecerliDers,
  tarihGruplari,
  yasEtiketi,
  type BankaSekmesi,
  type DersSayisi,
} from '@/lib/banka'
import { oksuzResimleriSil, resimSil, useResimUrl } from '@/lib/resim-depo'
import { cizimAnahtari } from '@/lib/cizim'
import {
  CizimAraclari,
  CizimliFotograf,
  KalemDugmesi,
  useSoruCizimi,
} from '@/components/soru-cizimi'
import {
  EklemeFormu,
  FotografDugmeleri,
  useYanlisSoruEkleme,
} from '@/components/yanlis-soru-ekle'
import { useGeriKatmani } from '@/lib/geri'
import { tarihYaz } from '@/lib/hesap'
import { bugun, cn } from '@/lib/utils'
import { BaslikSatiri, BosDurum, Buton, Not, Onay } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

export function YanlisBankaEkrani({
  sorular,
  setSorular,
}: {
  sorular: YanlisSoru[]
  setSorular: (guncelleyici: (onceki: YanlisSoru[]) => YanlisSoru[]) => void
}) {
  const [sekme, setSekme] = useState<BankaSekmesi>('bekleyen')
  const [dersSuzgec, setDersSuzgec] = useState('')
  const [acikId, setAcikId] = useState<string | null>(null)
  // Karışık tekrarın sırası: karıştırılmış kimlikler ve kaçıncısında olunduğu.
  // Kimlik tutuluyor, soru değil — tekrar sürerken "Çözdüm" kaydı değiştiriyor.
  const [tekrar, setTekrar] = useState<{ sira: string[]; konum: number } | null>(null)
  // Çizim kaydedilince küçük karelerin çizimi yeniden okuması için sayaç:
  // anahtar değişmediği için `useResimUrl` kendiliğinden haberdar olmuyor.
  const [cizimSurumu, setCizimSurumu] = useState(0)
  const { bekleyen, hata, fotografAl, kaydet, vazgec, gizliGirdi } =
    useYanlisSoruEkleme(setSorular)

  const ozet = useMemo(() => bankaOzeti(sorular), [sorular])
  const sekmedekiler = useMemo(
    () => sorular.filter((s) => (sekme === 'cozulen' ? s.cozuldu : !s.cozuldu)),
    [sorular, sekme],
  )
  const dersler = useMemo(() => derslereGore(sekmedekiler), [sekmedekiler])
  const seciliDers = gecerliDers(dersSuzgec, dersler)
  const liste = useMemo(
    () => bankaSuz(sorular, { sekme, ders: seciliDers }),
    [sorular, sekme, seciliDers],
  )
  const bugunIso = bugun()
  const gruplar = useMemo(() => tarihGruplari(liste, bugunIso), [liste, bugunIso])
  const tekrardaki = tekrar ? sorular.find((s) => s.id === tekrar.sira[tekrar.konum]) : undefined
  const acik = tekrardaki ?? sorular.find((s) => s.id === acikId) ?? null

  const tekrarBaslat = () => {
    // Fisher–Yates: sıra her oturumda baştan karışıyor; ders ya da tarih
    // sırasıyla gelen tekrar, sıradaki soruyu tahmin ettirirdi.
    const sira = liste.map((s) => s.id)
    for (let i = sira.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[sira[i], sira[j]] = [sira[j], sira[i]]
    }
    setTekrar({ sira, konum: 0 })
  }
  const tekrarIlerle = () =>
    setTekrar((t) => (t && t.konum + 1 < t.sira.length ? { ...t, konum: t.konum + 1 } : null))
  const kapat = () => {
    setAcikId(null)
    setTekrar(null)
  }

  // Geri tuşu önce görüntüleyiciyi, sonra kaydedilmeyi bekleyen fotoğrafı
  // kapatmalı; ikisi de bu ekranın içinde açılan katmanlar.
  useGeriKatmani(acik !== null, kapat)
  useGeriKatmani(bekleyen !== null, vazgec)

  // Kayıt silinip blob'u kalmış fotoğrafları bir kez temizle. Silme işleminin
  // ortasında uygulama kapanırsa öksüz blob kalabiliyor.
  useEffect(() => {
    // Çizimler de aynı depoda; listede olmasalardı öksüz sayılıp silinirlerdi.
    void oksuzResimleriSil(sorular.flatMap((s) => [s.resimId, cizimAnahtari(s.resimId)]))
    // Yalnızca ekran ilk açıldığında: her değişimde çalışsa, kaydedilmeyi
    // bekleyen fotoğrafı da öksüz sayıp silerdi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sil = (soru: YanlisSoru) => {
    setSorular((onceki) => onceki.filter((s) => s.id !== soru.id))
    void resimSil(soru.resimId)
    void resimSil(cizimAnahtari(soru.resimId))
    if (tekrar) tekrarIlerle()
    else setAcikId(null)
  }

  const cozulduDegistir = (soru: YanlisSoru) => {
    setSorular((onceki) =>
      onceki.map((s) => {
        if (s.id !== soru.id) return s
        const cozuldu = !s.cozuldu
        // İşareti kaldırınca tarih de siliniyor: kalsaydı soru "çözülmemiş"
        // görünürken haftalık özetin çözülenler sayısına girmeye devam ederdi.
        return { ...s, cozuldu, cozulmeTarihi: cozuldu ? bugun() : undefined }
      }),
    )
  }

  if (bekleyen) {
    return (
      <EklemeFormu
        onizleme={bekleyen.url}
        onKaydet={async (bilgi) => {
          // Kaydedilen soru "bekleyen" sekmesine düşüyor; kullanıcı çözdükleri
          // sekmesindeyken eklerse yeni kartı hiç göremezdi.
          if (await kaydet(bilgi)) setSekme('bekleyen')
        }}
        onVazgec={vazgec}
        hata={hata}
      />
    )
  }

  return (
    <div>
      <BaslikSatiri arac="yanlis-banka" baslik="Yanlış Soru Bankası" />

      {gizliGirdi}

      <FotografDugmeleri onSec={(kaynak) => void fotografAl(kaynak)} className="mb-4 flex gap-2" />

      {hata && (
        <Not tur="tehlike" className="mb-3">
          {hata}
        </Not>
      )}

      {ozet.toplam === 0 ? (
        <BosDurum
          simge={<Rabi durum="uykulu" poz="kahveli" boyut={96} />}
          baslik="Banka boş"
          aciklama="Çözemediğin bir soruyla karşılaşınca fotoğrafını çek. Rabi ders ders ayırıp saklar, sonra hepsine tek tek dönersin."
        />
      ) : (
        <>
          <div className="mb-3 flex gap-1 rounded-[14px] bg-muted p-1" role="tablist">
            <SegmentDugmesi
              secili={sekme === 'bekleyen'}
              sayi={ozet.bekleyen}
              onClick={() => setSekme('bekleyen')}
            >
              Bekleyen
            </SegmentDugmesi>
            <SegmentDugmesi
              secili={sekme === 'cozulen'}
              sayi={ozet.cozulen}
              onClick={() => setSekme('cozulen')}
            >
              Çözdüklerim
            </SegmentDugmesi>
          </div>

          {dersler.length > 1 && (
            <DersCipleri
              dersler={dersler}
              secili={seciliDers}
              tumuSayi={liste.length}
              onSec={setDersSuzgec}
            />
          )}

          {liste.length === 0 ? (
            <Not>
              {sekme === 'cozulen'
                ? 'Henüz çözdüğün soru yok. Bir soruyu açıp “Çözdüm” dersen buraya taşınır.'
                : 'Bu sekmede soru kalmadı — hepsini çözmüşsün.'}
            </Not>
          ) : (
            gruplar.map((grup) => (
              <section key={grup.baslik} className="mb-4">
                <div className="mx-0.5 mb-2 flex items-baseline justify-between">
                  <h2 className="text-[13px] font-extrabold">{grup.baslik}</h2>
                  <p className="rakam text-xs font-bold text-muted-foreground">
                    {grup.sorular.length} soru
                  </p>
                </div>
                <ul className="grid grid-cols-3 gap-2">
                  {grup.sorular.map((soru) => (
                    <li key={soru.id}>
                      <Kucuk
                        soru={soru}
                        cizimSurumu={cizimSurumu}
                        gun={bekledigiGun(soru.tarih, bugunIso)}
                        onAc={() => setAcikId(soru.id)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}

          {/* Karışık tekrar yalnızca bekleyenlerde: çözülenleri yeniden karıştırmak
              bankanın işi değil. Düğme alt menünün hemen üstüne yapışık, liste
              uzadıkça kaydırmanın sonuna gitmesin. */}
          {sekme === 'bekleyen' && liste.length > 0 && (
            <div className="sticky bottom-[calc(5.25rem+var(--guvenli-alt))] pt-2">
              <button
                type="button"
                onClick={tekrarBaslat}
                className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-2xl bg-foreground text-[15px] font-extrabold text-white shadow-[0_10px_24px_rgba(27,26,25,0.25)] active:scale-[0.98]"
              >
                <Shuffle size={18} aria-hidden />
                Karışık tekrar
                <span className="rakam font-bold opacity-70">· {liste.length} soru</span>
              </button>
            </div>
          )}
        </>
      )}

      {acik && (
        <Goruntuleyici
          soru={acik}
          tekrar={tekrar ? { konum: tekrar.konum, toplam: tekrar.sira.length } : undefined}
          onKapat={kapat}
          onGec={tekrarIlerle}
          onCozuldu={() => cozulduDegistir(acik)}
          onSil={() => sil(acik)}
          onCizimKaydedildi={() => setCizimSurumu((s) => s + 1)}
        />
      )}
    </div>
  )
}

function SegmentDugmesi({
  secili,
  sayi,
  onClick,
  children,
}: {
  secili: boolean
  sayi: number
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={secili}
      onClick={onClick}
      className={cn(
        'flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-[11px] text-sm font-extrabold transition-[background-color,box-shadow] duration-200',
        secili
          ? 'bg-card text-primary shadow-[0_1px_3px_rgba(27,26,25,0.12),0_1px_1px_rgba(27,26,25,0.04)]'
          : 'text-muted-foreground',
      )}
    >
      {children}
      <span
        className={cn(
          'rakam inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-xs',
          secili ? 'bg-primary-soft text-primary' : 'bg-foreground/[0.07] text-muted-foreground',
        )}
      >
        {sayi}
      </span>
    </button>
  )
}

/** Ders renginin üç tonu; ailesi olmayan ders nötr çiziliyor. */
function renkler(ders: string) {
  const aile = dersRengi(ders)
  if (!aile) {
    return { zemin: 'var(--muted)', kenar: 'var(--border)', koyu: 'var(--muted-foreground)' }
  }
  return {
    zemin: `var(--konu-${aile})`,
    kenar: `var(--konu-${aile}-kenar)`,
    koyu: `var(--konu-${aile}-koyu)`,
  }
}

/**
 * Tek satır, yatay kayan ders çipleri. Sarmalansaydı sekiz derste üç satır
 * olup kareleri aşağı itiyordu. Kenardaki oklar kaydırmanın varlığını
 * söylüyor — dokunmatikte kaydırma çubuğu görünmüyor ve sağda kesilen çip
 * listenin bittiği yer gibi okunuyordu.
 */
function DersCipleri({
  dersler,
  secili,
  tumuSayi,
  onSec,
}: {
  dersler: DersSayisi[]
  secili: string
  tumuSayi: number
  onSec: (ders: string) => void
}) {
  const kutu = useRef<HTMLDivElement>(null)
  const [sol, setSol] = useState(false)
  const [sag, setSag] = useState(false)

  const olc = () => {
    const el = kutu.current
    if (!el) return
    setSol(el.scrollLeft > 4)
    setSag(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }
  // Ders sayısı değişince taşma da değişiyor; ilk ölçüm de burada.
  useEffect(olc, [dersler])

  const kaydir = (fark: number) => kutu.current?.scrollBy({ left: fark, behavior: 'smooth' })

  const cip = (ad: string, sayi: number | null, deger: string) => {
    const acik = secili === deger
    const r = deger === '' ? null : renkler(deger)
    const stil: React.CSSProperties = r
      ? acik
        ? { borderColor: r.koyu, background: r.koyu, color: '#fff' }
        : { borderColor: r.kenar, background: r.zemin, color: r.koyu }
      : acik
        ? { borderColor: 'var(--foreground)', background: 'var(--foreground)', color: '#fff' }
        : { borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--muted-foreground)' }
    const nokta = acik ? '#fff' : r ? r.koyu : '#c9c6c1'
    return (
      <button
        key={deger || 'tumu'}
        type="button"
        aria-pressed={acik}
        onClick={() => onSec(deger)}
        style={stil}
        className="flex h-[34px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[11px] border-[1.5px] px-3 text-[13px] font-bold"
      >
        <span className="size-2 rounded-full" style={{ background: nokta }} aria-hidden />
        {ad}
        {sayi !== null && <span className="rakam">{sayi}</span>}
      </button>
    )
  }

  const ok = (yon: 'sol' | 'sag') => (
    <div
      className={cn(
        'pointer-events-none absolute inset-y-0 flex w-16 items-center',
        yon === 'sol'
          ? 'left-0 justify-start bg-gradient-to-l from-background/0 to-background to-55% pl-3'
          : 'right-0 justify-end bg-gradient-to-r from-background/0 to-background to-55% pr-3',
      )}
    >
      <button
        type="button"
        onClick={() => kaydir(yon === 'sol' ? -140 : 140)}
        aria-label={yon === 'sol' ? 'Önceki dersleri göster' : 'Diğer dersleri göster'}
        className="pointer-events-auto flex size-[30px] items-center justify-center rounded-[9px] border border-border bg-card text-muted-foreground shadow-[0_2px_6px_rgba(27,26,25,0.08)] active:scale-95"
      >
        {yon === 'sol' ? (
          <ChevronLeft size={16} strokeWidth={2.4} aria-hidden />
        ) : (
          <ChevronRight size={16} strokeWidth={2.4} aria-hidden />
        )}
      </button>
    </div>
  )

  return (
    <div className="relative -mx-4 mb-3.5">
      <div
        ref={kutu}
        onScroll={olc}
        className="flex gap-1.5 overflow-x-auto pl-4 pr-[52px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cip('Tümü', secili === '' ? tumuSayi : null, '')}
        {dersler.map((d) => cip(d.ders, d.sayi, d.ders))}
      </div>
      {sol && ok('sol')}
      {sag && ok('sag')}
    </div>
  )
}

/**
 * Galeri karesi. Görüntü IndexedDB'den geldiği için bir an boş kalabilir;
 * o arada dersin renginde çizgili bir zemin duruyor.
 */
function Kucuk({
  soru,
  gun,
  cizimSurumu,
  onAc,
}: {
  soru: YanlisSoru
  gun: number
  cizimSurumu: number
  onAc: () => void
}) {
  const url = useResimUrl(soru.resimId)
  const cizim = useResimUrl(cizimAnahtari(soru.resimId), cizimSurumu)
  const r = renkler(soru.ders)
  const eski = gun >= ESKI_SORU_GUNU

  return (
    <button
      type="button"
      onClick={onAc}
      className="relative block aspect-square w-full overflow-hidden rounded-[14px] border text-left"
      style={{
        borderColor: r.kenar,
        background: `repeating-linear-gradient(135deg, ${r.zemin} 0 7px, ${r.kenar} 7px 8px)`,
      }}
    >
      {url ? (
        // Fotoğraf IndexedDB'den geliyor; next/image statik dışa aktarımda
        // blob adreslerini işleyemez.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={soru.ders} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full items-center justify-center opacity-70" style={{ color: r.koyu }}>
          <Images size={20} aria-hidden />
        </span>
      )}
      {url && cizim && (
        // Çizim fotoğrafla aynı en-boy oranında; `object-cover` ikisini aynı yerden kırpıyor.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cizim} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <span className="absolute inset-x-0 bottom-0 flex flex-col bg-gradient-to-t from-black/70 to-transparent px-[7px] pb-1.5 pt-[18px] text-white">
        <span className="truncate text-[11px] font-extrabold leading-tight">{soru.ders}</span>
        {soru.konu && (
          <span className="truncate text-[10px] font-medium leading-tight opacity-85">
            {soru.konu}
          </span>
        )}
      </span>
      <span className="absolute inset-y-0 left-0 w-1" style={{ background: r.koyu }} aria-hidden />
      {soru.cozuldu ? (
        <span className="absolute right-[5px] top-[5px] rounded-full bg-success p-1 text-white">
          <Check size={11} strokeWidth={2.4} aria-hidden />
        </span>
      ) : (
        // Kaç gündür beklediği: bir haftayı geçen soru kırmızıya dönüyor,
        // bankanın en çok unutulan köşesi o.
        <span
          className={cn(
            'rakam absolute right-[5px] top-[5px] rounded-full px-1.5 py-0.5 text-[10px] font-extrabold',
            eski ? 'bg-danger text-white' : 'bg-white/90 text-foreground',
          )}
        >
          {yasEtiketi(gun)}
        </span>
      )}
    </button>
  )
}

/** Tam ekran görüntüleyici. */
function Goruntuleyici({
  soru,
  tekrar,
  onKapat,
  onGec,
  onCozuldu,
  onSil,
  onCizimKaydedildi,
}: {
  soru: YanlisSoru
  onCizimKaydedildi: () => void
  /** Karışık tekrar sürüyorsa kaçıncı soruda olunduğu. */
  tekrar?: { konum: number; toplam: number }
  onKapat: () => void
  onGec: () => void
  onCozuldu: () => void
  onSil: () => void
}) {
  const url = useResimUrl(soru.resimId)
  const [silmeAcik, setSilmeAcik] = useState(false)
  const cizim = useSoruCizimi(soru.resimId, onCizimKaydedildi)
  // Geri tuşu çizimi kaydedip çizimden çıkıyor, atmıyor: yanlışlıkla
  // basılan geri, çizilen her şeyi sessizce silerdi. Atmak için "Vazgeç" var.
  useGeriKatmani(cizim.ciziyor, () => void cizim.kaydet())

  return (
    // Tam ekran katman: uygulamanın geri kalanı `max-w-md` olduğu için iç sütun
    // da öyle tutuluyor, yoksa geniş ekranda düğmeler kenarlara savruluyor.
    <div className="tam-katman-girisi guvenli-ust guvenli-alt fixed inset-0 z-50 flex flex-col items-center bg-black">
      <div className="flex w-full max-w-md items-center justify-between px-4 py-3 text-white">
        <div className="min-w-0">
          {tekrar && (
            <p className="rakam text-xs font-bold text-white/60">
              Karışık tekrar · {tekrar.konum + 1}/{tekrar.toplam}
            </p>
          )}
          <p className="truncate font-medium">{soru.ders}</p>
          <p className="truncate text-xs text-white/60">
            {tarihYaz(soru.tarih)}
            {soru.konu ? ` · ${soru.konu}` : ''}
          </p>
        </div>
        {/* Çizerken kapatma yok: çıkışın iki yolu Vazgeç ve Kaydet, araç
            çubuğunun hemen üstünde. */}
        {!cizim.ciziyor && (
          <button
            type="button"
            onClick={onKapat}
            aria-label="Kapat"
            className="-mr-2 rounded-full p-2 text-white/80 active:bg-white/10"
          >
            <X size={22} aria-hidden />
          </button>
        )}
      </div>

      <div className="relative flex min-h-0 w-full max-w-md flex-1 items-center justify-center px-3">
        {url ? (
          <CizimliFotograf url={url} alt={soru.konu ?? soru.ders} cizim={cizim.yuzey} />
        ) : (
          <p className="text-sm text-white/60">Fotoğraf yüklenemedi.</p>
        )}
      </div>

      {soru.not && !cizim.ciziyor && (
        <p className="w-full max-w-md px-4 pt-3 text-sm leading-relaxed text-white/80">
          {soru.not}
        </p>
      )}

      {cizim.ciziyor ? (
        <div className="flex w-full max-w-md flex-col gap-2 px-4 pb-6 pt-3">
          {/* Vazgeç/Kaydet araç çubuğunun hemen üstünde, tam genişlikte: üst
              köşedeki küçük düğmeler başparmaktan uzaktı ve çizim bitince göz
              zaten alttaki araçlarda. */}
          <div className="flex gap-2">
            <Buton bicim="ikincil" className="flex-1" onClick={cizim.vazgec}>
              Vazgeç
            </Buton>
            <Buton className="flex-1" onClick={() => void cizim.kaydet()}>
              <Check size={18} aria-hidden />
              Kaydet
            </Buton>
          </div>
          <CizimAraclari cizim={cizim} />
        </div>
      ) : (
        <>
          {url && (
            <div className="flex w-full max-w-md justify-end px-4 pt-3">
              <KalemDugmesi onClick={cizim.basla} />
            </div>
          )}
          <div className="flex w-full max-w-md gap-2 px-4 pb-6 pt-3">
            <Buton
              bicim="tehlike"
              boy="simge"
              onClick={() => setSilmeAcik(true)}
              aria-label="Soruyu sil"
            >
              <Trash2 size={18} aria-hidden />
            </Buton>
            <Buton
              className="flex-1"
              bicim={soru.cozuldu ? 'ikincil' : 'birincil'}
              onClick={() => {
                onCozuldu()
                // Tekrarda "Çözdüm" sıradakine geçiyor; her soruda pencereyi
                // kapatıp yeniden açtırmak tekrarı bölerdi.
                if (tekrar) onGec()
                else onKapat()
              }}
            >
              {soru.cozuldu ? (
                <>
                  <RotateCcw size={18} aria-hidden />
                  Hâlâ takıldım
                </>
              ) : (
                <>
                  <Check size={18} aria-hidden />
                  Çözdüm
                </>
              )}
            </Buton>
            {tekrar && (
              <Buton bicim="ikincil" boy="simge" onClick={onGec} aria-label="Sıradaki soru">
                <SkipForward size={18} aria-hidden />
              </Buton>
            )}
          </div>
        </>
      )}

      <Onay
        acik={silmeAcik}
        baslik="Soru silinsin mi?"
        aciklama="Fotoğraf ve notu kalıcı olarak silinir."
        onOnayla={onSil}
        onIptal={() => setSilmeAcik(false)}
      />
    </div>
  )
}

/** Fotoğraf çekildikten sonra ders/konu/not sorulan adım. */
