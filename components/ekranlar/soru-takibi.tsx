'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ChevronDown, Plus, X } from 'lucide-react'
import type { Ayarlar, GunlukKayit, SoruKaydi } from '@/lib/types'
import { bosSayisi, gunOzeti } from '@/lib/hesap'
import { CALISMA_DERSLERI, sadelestir } from '@/lib/dersler'
import { useGeriKatmani } from '@/lib/geri'
import { bugun, cn, gunKaydir, tariheCevir, tariheYaz } from '@/lib/utils'
import { Alan, BaslikSatiri, Buton, Halka, Kart, Not } from '@/components/ui'
import { Takvim, type GunIsareti } from '@/components/takvim'

const GUN_ADLARI = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz']
const AY_ADLARI = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]

/**
 * "12 Eylül" — `tarihYaziKisa` gün adını da ekliyor ve "12 Eylül Cumartesi"
 * halkanın yanındaki 21 piksellik başlığa sığmıyor; hafta şeridi günü zaten
 * gösteriyor.
 */
function gunBasligi(iso: string): string {
  const d = tariheCevir(iso)
  return `${d.getDate()} ${AY_ADLARI[d.getMonth()]}`
}

/** Yazılan metni 0–9999 arası sayıya indirger; boş kalırsa boş döner. */
function sayiya(ham: string): string {
  const temiz = ham.replace(/[^0-9]/g, '').slice(0, 4)
  return temiz === '' ? '' : String(Number(temiz))
}

/**
 * Soru Takibi (`tasarim/soru-takibi.dc.html`).
 *
 * Ekranın omurgası üç kart: günün halkası ve dört sayısı, seçili günün
 * haftası (altında katlanabilir ay takvimi) ve ders satırları. Ay takvimi
 * eskiden ekranın tepesinde sürekli açıktı ve ilk ekranı tek başına
 * dolduruyordu; asıl iş — bugüne soru girmek — onun altında kalıyordu.
 * Hafta şeridi yedi güne bakmaya yetiyor, daha eskisi için takvim açılıyor.
 */
export function SoruTakibiEkrani({
  kayitlar,
  setKayitlar,
  ayarlar,
}: {
  kayitlar: GunlukKayit[]
  setKayitlar: (guncelleyici: GunlukKayit[] | ((onceki: GunlukKayit[]) => GunlukKayit[])) => void
  ayarlar: Ayarlar
}) {
  const [bugunIso, setBugunIso] = useState(bugun)
  const [secili, setSecili] = useState(bugunIso)
  const [ay, setAy] = useState(() => tariheCevir(bugunIso))
  const [takvimAcik, setTakvimAcik] = useState(false)
  const [sayfaAcik, setSayfaAcik] = useState(false)

  /**
   * "Bugün" ekran açılırken bir kez hesaplanıyordu; uygulama gece yarısını açık
   * geçirdiğinde saat 00.05'te hâlâ düne yazılabiliyordu. Uygulama öne her
   * geldiğinde tarih yeniden soruluyor, seçim de yeni güne taşınıyor.
   */
  useEffect(() => {
    const tazele = () => {
      if (document.visibilityState !== 'visible') return
      const yeniGun = bugun()
      if (yeniGun === bugunIso) return
      setBugunIso(yeniGun)
      if (secili === bugunIso) {
        setSecili(yeniGun)
        setAy(tariheCevir(yeniGun))
      }
    }
    document.addEventListener('visibilitychange', tazele)
    return () => document.removeEventListener('visibilitychange', tazele)
  }, [bugunIso, secili])

  const seciliKayit = kayitlar.find((k) => k.tarih === secili)
  const ozet = gunOzeti(seciliKayit)
  const hedef = ayarlar.gunlukHedef

  const isaretler = useMemo(() => {
    const harita = new Map<string, GunIsareti>()
    for (const kayit of kayitlar) {
      const toplam = gunOzeti(kayit).toplam
      if (toplam === 0) continue
      const doluluk = hedef > 0 ? Math.min(1, toplam / hedef) : 1
      harita.set(kayit.tarih, { doluluk })
    }
    return harita
  }, [kayitlar, hedef])

  /**
   * Soru yalnızca **bugüne ve düne** girilebilir.
   *
   * Bir günlük telafi payı var; daha eski günler açılıyor ama okunur. Gelecek
   * günler takvimde hiç seçilemiyor — orada bakılacak bir şey de yok.
   */
  const dunIso = gunKaydir(bugunIso, -1)
  const bugunMu = secili === bugunIso
  const dunMu = secili === dunIso
  const duzenlenebilir = bugunMu || dunMu

  const gunSec = (tarih: string) => {
    setSecili(tarih)
    setAy(tariheCevir(tarih))
  }

  /** Seçili günün kayıt satırlarını değiştirir; gün boşalırsa kaydı tamamen siler. */
  const gunuGuncelle = (degistir: (satirlar: SoruKaydi[]) => SoruKaydi[]) => {
    if (!duzenlenebilir) return
    setKayitlar((onceki) => {
      const mevcut = onceki.find((k) => k.tarih === secili)
      const yeniSatirlar = degistir(mevcut?.kayitlar ?? [])
      const digerleri = onceki.filter((k) => k.tarih !== secili)
      if (yeniSatirlar.length === 0) return digerleri
      return [...digerleri, { tarih: secili, kayitlar: yeniSatirlar }].sort((a, b) =>
        a.tarih.localeCompare(b.tarih),
      )
    })
  }

  /**
   * Alt sayfadan gelen giriş aynı derse **ekleniyor**, üstüne yazılmıyor:
   * öğle bir 20 soru, akşam bir 20 soru giren öğrenci ikinci girişte ilkini
   * kaybetmemeli. Satırdaki kutular ise doğrudan düzenliyor — orada
   * görünen sayı zaten günün toplamı.
   */
  const girisKaydet = (ders: string, toplam: number, dogru: number, yanlis: number) => {
    gunuGuncelle((satirlar) => {
      const i = satirlar.findIndex((s) => sadelestir(s.ders) === sadelestir(ders))
      if (i === -1) return [...satirlar, { ders, toplam, dogru, yanlis }]
      return satirlar.map((s, j) =>
        j === i
          ? {
              ...s,
              toplam: s.toplam + toplam,
              dogru: s.dogru + dogru,
              yanlis: s.yanlis + yanlis,
            }
          : s,
      )
    })
    setSayfaAcik(false)
  }

  const satirGuncelle = (indeks: number, alan: keyof Omit<SoruKaydi, 'ders'>, ham: string) => {
    const sayi = Number(sayiya(ham)) || 0
    gunuGuncelle((satirlar) => satirlar.map((s, i) => (i === indeks ? { ...s, [alan]: sayi } : s)))
  }

  const satirlar = seciliKayit?.kayitlar ?? []
  const hedefTuttu = ozet.toplam >= hedef && hedef > 0
  const oran = hedef > 0 ? Math.min(1, ozet.toplam / hedef) : 0
  const halkaRengi = hedefTuttu ? 'var(--success)' : 'var(--primary-parlak)'

  // Seçili günün haftası, pazartesiden başlayarak.
  const hafta = useMemo(() => {
    const gun = tariheCevir(secili)
    const pazartesi = new Date(
      gun.getFullYear(),
      gun.getMonth(),
      gun.getDate() - ((gun.getDay() + 6) % 7),
    )
    return Array.from({ length: 7 }, (_, i) => {
      const tarih = new Date(pazartesi.getFullYear(), pazartesi.getMonth(), pazartesi.getDate() + i)
      const iso = tariheYaz(tarih)
      return {
        iso,
        ad: GUN_ADLARI[i],
        sayi: tarih.getDate(),
        etiket: `${tarih.getDate()} ${AY_ADLARI[tarih.getMonth()]}`,
        toplam: gunOzeti(kayitlar.find((k) => k.tarih === iso)).toplam,
      }
    })
  }, [secili, kayitlar])
  const haftaToplami = hafta.reduce((t, g) => t + g.toplam, 0)

  const bugunDon = () => {
    gunSec(bugunIso)
  }

  return (
    <div>
      <BaslikSatiri baslik="Soru Takibi" />
      <div className="flex flex-col gap-3.5">
        {/* Günün hâli: halka, mesaj, çubuk ve dört sayı. */}
        <Kart className="rounded-3xl">
          <div className="flex items-center gap-4">
            <Halka deger={ozet.toplam} hedef={hedef} boyut={112} kalinlik={10} renk={halkaRengi}>
              <span className="rakam text-[30px] font-black leading-none text-primary">
                {ozet.toplam}
              </span>
              <span className="rakam mt-1 text-[11.5px] font-bold text-muted-foreground">
                {hedef} soru
              </span>
            </Halka>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[21px] font-extrabold tracking-tight">
                {bugunMu ? 'Bugün' : dunMu ? 'Dün' : gunBasligi(secili)}
              </p>
              <p className="mt-1 text-[13.5px] leading-snug text-muted-foreground">
                {!duzenlenebilir
                  ? ozet.toplam === 0
                    ? 'O gün soru girilmemiş.'
                    : `O gün ${ozet.toplam} soru çözmüşsün.`
                  : ozet.toplam === 0
                    ? 'Henüz soru girmedin.'
                    : hedefTuttu
                      ? 'Günlük hedefi tutturdun.'
                      : `Hedefe ${hedef - ozet.toplam} soru kaldı.`}
              </p>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-2 rounded-full transition-[width] duration-400"
                  style={{
                    width: `${Math.round(oran * 100)}%`,
                    background: halkaRengi,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3.5 grid grid-cols-4 gap-2">
            <OzetKutusu etiket="Soru" deger={ozet.toplam} className="text-primary" />
            <OzetKutusu etiket="Doğru" deger={ozet.dogru} className="text-success" />
            <OzetKutusu etiket="Yanlış" deger={ozet.yanlis} className="text-danger" />
            <OzetKutusu etiket="Boş" deger={ozet.bos} />
          </div>
        </Kart>

        {/* Hafta şeridi; takvim altında katlanıyor. */}
        <Kart className="rounded-3xl px-3 pb-3 pt-3.5">
          <div className="flex items-baseline gap-2 px-1 pb-2.5">
            <p className="font-display text-[15px] font-extrabold tracking-tight">Bu hafta</p>
            <p className="rakam text-[12.5px] font-bold text-muted-foreground/70">
              {haftaToplami} soru
            </p>
            <button
              type="button"
              onClick={() => {
                setTakvimAcik((o) => !o)
                setAy(tariheCevir(secili))
              }}
              aria-expanded={takvimAcik}
              aria-label={takvimAcik ? 'Takvimi kapat' : 'Takvimi aç'}
              className="ml-auto inline-flex h-8 w-8 items-center justify-center self-center rounded-[11px] bg-muted/60 text-muted-foreground active:bg-muted"
            >
              <CalendarDays size={17} aria-hidden />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {hafta.map((g) => {
              const kapali = g.iso > bugunIso
              const seciliMi = g.iso === secili
              return (
                <button
                  key={g.iso}
                  type="button"
                  onClick={() => gunSec(g.iso)}
                  disabled={kapali}
                  aria-pressed={seciliMi}
                  aria-label={`${g.etiket}${kapali ? ' — henüz gelmedi' : ''}`}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-2xl pb-2.5 pt-2 transition-colors',
                    seciliMi && 'bg-primary-soft',
                  )}
                >
                  <span
                    className={cn(
                      'text-[10px] font-bold tracking-wide',
                      seciliMi
                        ? 'text-primary'
                        : kapali
                          ? 'text-muted-foreground/45'
                          : 'text-muted-foreground/80',
                    )}
                  >
                    {g.ad}
                  </span>
                  <span
                    className={cn(
                      'rakam text-[15px] font-extrabold leading-none',
                      seciliMi
                        ? 'text-primary'
                        : kapali
                          ? 'text-muted-foreground/45'
                          : 'text-foreground',
                    )}
                  >
                    {g.sayi}
                  </span>
                </button>
              )
            })}
          </div>

          {takvimAcik && (
            <div className="acilir-giris mt-3.5 border-t border-border/70 pt-3">
              <Takvim
                ay={ay}
                onAyDegis={setAy}
                secili={secili}
                onSec={gunSec}
                isaretler={isaretler}
                bugunIso={bugunIso}
                enGecIso={bugunIso}
              />
            </div>
          )}
        </Kart>

        {duzenlenebilir ? (
          <Buton
            onClick={() => setSayfaAcik(true)}
            className="h-[54px] w-full rounded-[18px] text-base shadow-[0_8px_18px_rgba(217,98,47,0.24)]"
          >
            <Plus size={19} strokeWidth={2.8} aria-hidden />
            Soru ekle
          </Buton>
        ) : (
          // Tek satırlık sarı şerit: eskiden gerekçeyi anlatan üç cümlelik bir
          // not ve "Bugüne dön" bağlantısı vardı; kullanıcı yalnızca kuralı
          // istedi. Bugüne dönmenin yolu takvimin kendisi.
          <Not tur="uyari" className="rounded-2xl text-center text-[13px] font-extrabold">
            Sadece bugüne ve düne soru girebilirsin
          </Not>
        )}

        <div className="flex items-center justify-between gap-2 px-1 pt-0.5">
          <p className="text-[13px] font-extrabold uppercase tracking-wide text-muted-foreground">
            Dersler
          </p>
          {satirlar.length > 0 && (
            <p className="rakam text-[12.5px] font-bold text-muted-foreground">
              {satirlar.length} ders
            </p>
          )}
        </div>

        {satirlar.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-border px-4 py-6 text-center">
            <p className="text-sm font-bold">
              {bugunMu
                ? 'Bugüne henüz ders eklemedin'
                : dunMu
                  ? 'Düne henüz ders eklemedin'
                  : 'O gün hiç ders girilmemiş'}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              {duzenlenebilir
                ? '"Soru ekle" ile bir ders seç, sayıları gir.'
                : 'Sadece bugüne ve düne soru girebilirsin.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {satirlar.map((satir, indeks) => (
              <DersSatiri
                key={satir.ders}
                satir={satir}
                okunur={!duzenlenebilir}
                onDegis={(alan, ham) => satirGuncelle(indeks, alan, ham)}
                onSil={() => gunuGuncelle((l) => l.filter((_, i) => i !== indeks))}
              />
            ))}
          </div>
        )}
      </div>

      {sayfaAcik && (
        <SoruEkleSayfasi
          kullanilan={satirlar.map((s) => s.ders)}
          onKapat={() => setSayfaAcik(false)}
          onKaydet={girisKaydet}
        />
      )}
    </div>
  )
}

function OzetKutusu({
  etiket,
  deger,
  className,
}: {
  etiket: string
  deger: number
  className?: string
}) {
  return (
    <div className="rounded-[14px] bg-muted/60 px-1.5 py-2 text-center">
      <p className="text-[11px] font-bold text-muted-foreground">{etiket}</p>
      <p className={cn('rakam mt-0.5 font-display text-[19px] font-extrabold', className)}>
        {deger}
      </p>
    </div>
  )
}

/**
 * Günün bir dersi: ad, isabet, üç renkli çubuk ve dört kutu.
 *
 * Çubuk toplamı değil paydayı ölçüyor: doğru + yanlış toplamı aşmışsa payda
 * o toplam oluyor, yoksa çubuk %100'ü geçip kartın dışına taşardı.
 */
function DersSatiri({
  satir,
  okunur,
  onDegis,
  onSil,
}: {
  satir: SoruKaydi
  okunur: boolean
  onDegis: (alan: keyof Omit<SoruKaydi, 'ders'>, ham: string) => void
  onSil: () => void
}) {
  const bos = bosSayisi(satir)
  const hata = satir.dogru + satir.yanlis > satir.toplam
  const payda = Math.max(satir.toplam, satir.dogru + satir.yanlis, 1)
  const yuzde = (n: number) => `${Math.round((n / payda) * 100)}%`

  return (
    <Kart className="rounded-[20px] p-3">
      <div className="mb-2 flex items-center gap-2.5">
        <p className="min-w-0 flex-1 truncate font-display text-[15px] font-extrabold tracking-tight">
          {satir.ders}
        </p>
        <span className="rakam shrink-0 text-xs font-extrabold text-muted-foreground">
          {satir.toplam > 0 ? `%${Math.round((satir.dogru / satir.toplam) * 100)} doğru` : '—'}
        </span>
        {!okunur && (
          <button
            type="button"
            aria-label={`${satir.ders} satırını sil`}
            onClick={onSil}
            className="-mr-1 inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[10px] text-muted-foreground/70 active:bg-danger-soft active:text-danger"
          >
            <X size={16} aria-hidden />
          </button>
        )}
      </div>

      <div className="mb-3 flex h-1.5 overflow-hidden rounded-full bg-muted">
        <span
          className="h-1.5 bg-success transition-[width]"
          style={{ width: yuzde(satir.dogru) }}
        />
        <span
          className="h-1.5 bg-danger transition-[width]"
          style={{ width: yuzde(satir.yanlis) }}
        />
        <span
          className="h-1.5 bg-muted-foreground/30 transition-[width]"
          style={{ width: yuzde(bos) }}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <SayiKutusu
          etiket="Toplam"
          deger={satir.toplam === 0 ? '' : String(satir.toplam)}
          okunur={okunur}
          onDegis={(ham) => onDegis('toplam', ham)}
          ariaEtiket={`${satir.ders} toplam soru`}
        />
        <SayiKutusu
          etiket="Doğru"
          ton="dogru"
          deger={satir.dogru === 0 ? '' : String(satir.dogru)}
          okunur={okunur}
          onDegis={(ham) => onDegis('dogru', ham)}
          ariaEtiket={`${satir.ders} doğru`}
        />
        <SayiKutusu
          etiket="Yanlış"
          ton="yanlis"
          deger={satir.yanlis === 0 ? '' : String(satir.yanlis)}
          okunur={okunur}
          onDegis={(ham) => onDegis('yanlis', ham)}
          ariaEtiket={`${satir.ders} yanlış`}
        />
        <BosKutusu deger={bos} hata={hata} />
      </div>

      {hata && <HataNotu />}
    </Kart>
  )
}

const KUTU_TONLARI = {
  toplam: {
    etiket: 'text-muted-foreground',
    odak: 'focus-visible:border-primary-parlak focus-visible:outline-primary-parlak/40',
  },
  dogru: {
    etiket: 'text-success',
    odak: 'focus-visible:border-success focus-visible:outline-success/40',
  },
  yanlis: {
    etiket: 'text-danger',
    odak: 'focus-visible:border-danger focus-visible:outline-danger/40',
  },
} as const

function SayiKutusu({
  etiket,
  ton = 'toplam',
  deger,
  okunur,
  onDegis,
  ariaEtiket,
  buyuk,
}: {
  etiket: string
  ton?: keyof typeof KUTU_TONLARI
  deger: string
  /** Geçmiş gün: sayı görünüyor ama değiştirilemiyor. */
  okunur?: boolean
  onDegis: (ham: string) => void
  ariaEtiket: string
  /** Alt sayfadaki kutular bir tık büyük: orada tek satır var, yer bol. */
  buyuk?: boolean
}) {
  return (
    <label className="block">
      <span
        className={cn('mb-1 block text-center text-[11px] font-bold', KUTU_TONLARI[ton].etiket)}
      >
        {etiket}
      </span>
      <Alan
        inputMode="numeric"
        placeholder="0"
        readOnly={okunur}
        aria-label={ariaEtiket}
        // 0 yerine boş gösteriliyor: kutuya dokunup yazmaya başlayınca
        // önce sıfırı silmek gerekmesin. Placeholder'daki 0 da odakta
        // kayboluyor: imlecin yanında duran sıfır, silinmesi gereken bir
        // değer gibi okunuyordu.
        value={deger}
        onChange={(e) => onDegis(e.target.value)}
        className={cn(
          'rakam rounded-[14px] bg-card px-1 text-center text-[17px] font-extrabold focus:placeholder:text-transparent',
          buyuk ? 'h-[52px] rounded-[15px] text-[19px]' : 'h-[46px]',
          KUTU_TONLARI[ton].odak,
          okunur && 'bg-muted/60 text-muted-foreground',
        )}
      />
    </label>
  )
}

/** Boş girilmez, hesaplanır — istenen davranış bu. */
function BosKutusu({ deger, hata, buyuk }: { deger: number; hata: boolean; buyuk?: boolean }) {
  return (
    <div>
      <span className="mb-1 block text-center text-[11px] font-bold text-muted-foreground">
        Boş
      </span>
      <p
        className={cn(
          'rakam flex items-center justify-center rounded-[14px] bg-muted/70 text-[17px] font-extrabold',
          buyuk ? 'h-[52px] rounded-[15px] text-[19px]' : 'h-[46px]',
          hata && 'text-danger',
        )}
      >
        {deger}
      </p>
    </div>
  )
}

function HataNotu() {
  return (
    <p className="mt-2 text-xs font-bold leading-snug text-danger">
      Doğru + yanlış toplamı çözdüğün soru sayısını aşıyor.
    </p>
  )
}

/**
 * "Soru ekle" alt sayfası: ders seç, üç sayıyı gir, kaydet.
 *
 * Ders listesi ekranın kendisinde çip bulutu olarak duruyordu ve sekiz çip +
 * bir yazı kutusu + Ekle düğmesi, ders satırlarını ekranın dibine itiyordu.
 * Şimdi seçim tek düğmenin arkasında; günün dersleri ekranın kendisi.
 *
 * Listede yalnızca `CALISMA_DERSLERI` var, serbest metin yok: eski ekranda
 * elle yazılan ad ("matematık") istatistikte ayrı bir ders olarak dilim
 * açıyordu. Liste bugün eklenmiş dersleri de gösteriyor — aynı derse ikinci
 * giriş üstüne ekleniyor (`girisKaydet`).
 */
function SoruEkleSayfasi({
  kullanilan,
  onKapat,
  onKaydet,
}: {
  kullanilan: string[]
  onKapat: () => void
  onKaydet: (ders: string, toplam: number, dogru: number, yanlis: number) => void
}) {
  useGeriKatmani(true, onKapat)
  const [listeAcik, setListeAcik] = useState(false)
  const [ders, setDers] = useState<string | null>(null)
  const [toplam, setToplam] = useState('')
  const [dogru, setDogru] = useState('')
  const [yanlis, setYanlis] = useState('')

  const t = Number(toplam || 0)
  const d = Number(dogru || 0)
  const y = Number(yanlis || 0)
  const hata = d + y > t
  const gecerli = ders !== null && t > 0 && !hata

  // Bugün girilmiş dersler listenin başında: ikinci girişin en sık hedefi onlar.
  const secenekler = useMemo(() => {
    const kullanilanSet = new Set(kullanilan.map(sadelestir))
    return [
      ...CALISMA_DERSLERI.filter((x) => kullanilanSet.has(sadelestir(x))),
      ...CALISMA_DERSLERI.filter((x) => !kullanilanSet.has(sadelestir(x))),
    ]
  }, [kullanilan])

  return (
    <div
      className="katman-zemin fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onKapat}
    >
      <div
        className="alt-pencere-girisi max-h-[76%] w-full max-w-md overflow-y-auto rounded-t-[26px] bg-card px-4 pt-3 pb-[calc(1.5rem+var(--guvenli-alt))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-[42px] rounded-full bg-border" />
        <div className="mb-3.5 flex items-center gap-2.5">
          <p className="font-display text-lg font-extrabold tracking-tight">Soru ekle</p>
          <p className="ml-auto text-[12.5px] font-bold text-muted-foreground/70">Bugün</p>
          <button
            type="button"
            onClick={onKapat}
            aria-label="Kapat"
            className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground active:bg-muted"
          >
            <X size={16} strokeWidth={2.4} aria-hidden />
          </button>
        </div>

        <span className="mb-1.5 block text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground">
          Ders
        </span>
        <button
          type="button"
          onClick={() => setListeAcik((o) => !o)}
          aria-expanded={listeAcik}
          className={cn(
            'flex h-[52px] w-full items-center gap-2.5 rounded-2xl border border-border bg-background px-3.5 text-left text-[15px] font-extrabold active:bg-muted/60',
            ders ? 'text-foreground' : 'text-muted-foreground/70',
          )}
        >
          <span className="flex-1 truncate">{ders ?? 'Ders seç'}</span>
          <ChevronDown
            size={17}
            strokeWidth={2.4}
            aria-hidden
            className={cn(
              'shrink-0 text-muted-foreground/70 transition-transform duration-200',
              listeAcik && 'rotate-180',
            )}
          />
        </button>
        {listeAcik && (
          <div className="acilir-giris mt-2 max-h-[216px] overflow-y-auto rounded-2xl border border-border bg-card p-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              {secenekler.map((ad) => {
                const seciliMi = ders === ad
                return (
                  <button
                    key={ad}
                    type="button"
                    onClick={() => {
                      setDers(ad)
                      setListeAcik(false)
                    }}
                    aria-pressed={seciliMi}
                    className={cn(
                      'h-11 w-full truncate rounded-[13px] px-3 text-left text-[13.5px] font-bold active:bg-primary-soft active:text-primary',
                      seciliMi ? 'bg-primary-soft text-primary' : 'bg-muted/60 text-foreground',
                    )}
                  >
                    {ad}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-4 gap-2">
          <SayiKutusu
            buyuk
            etiket="Toplam"
            deger={toplam}
            onDegis={(ham) => setToplam(sayiya(ham))}
            ariaEtiket="Toplam soru"
          />
          <SayiKutusu
            buyuk
            etiket="Doğru"
            ton="dogru"
            deger={dogru}
            onDegis={(ham) => setDogru(sayiya(ham))}
            ariaEtiket="Doğru"
          />
          <SayiKutusu
            buyuk
            etiket="Yanlış"
            ton="yanlis"
            deger={yanlis}
            onDegis={(ham) => setYanlis(sayiya(ham))}
            ariaEtiket="Yanlış"
          />
          <BosKutusu buyuk deger={Math.max(0, t - d - y)} hata={hata} />
        </div>
        {hata && <HataNotu />}

        <Buton
          onClick={() => {
            if (ders !== null && gecerli) onKaydet(ders, t, d, y)
          }}
          disabled={!gecerli}
          className="mt-4 h-[54px] w-full rounded-[17px] text-base"
        >
          Kaydet
        </Buton>
      </div>
    </div>
  )
}
