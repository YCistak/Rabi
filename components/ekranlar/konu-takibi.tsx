'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronLeft, ChevronRight, Flag, GraduationCap, ListChecks, Map as HaritaSimgesi, PencilLine, X } from 'lucide-react'
import { Haptics, NotificationType } from '@capacitor/haptics'
import type { PuanTuru } from '@/lib/types'
import type { KonuDersId } from '@/lib/konu/tip'
import type { KonuIlerlemeleri } from '@/lib/konu/ilerleme'
import { ALAN_ADLARI } from '@/lib/konu-takibi/liste'
import { satirKimlikleri, sinifDersleri, type TakipDersi, type TakipSatiri } from '@/lib/konu-takibi/okul-dersleri'
import {
  dersOzeti,
  eksikAsamalar,
  okuluTopluYaz,
  bitirmeyeHazir,
  satirDurumu,
  satirYaz,
  HIZLI_SECENEKLER,
  hizliBaslangicKonulari,
  hizliBaslangicSinifi,
  hizliBayragiCoz,
  dersleriIsaretsiz,
  BOS_HIZLI_BAYRAK,
  type HizliBaslangicBayragi,
  type AsamaId,
  type DersOzeti,
  type HaritaKonumu,
  type KonuDurumu,
  type YazilanAlan,
  type YksTakip,
  sinifSekmeleri,
  konuBloklari,
  type SinifSekmesi as SinifSekmesiVerisi,
} from '@/lib/konu-takibi/takip'
import { HARITASIZ_SINIF, sinifMi, varsayilanSinif, type YksSinif } from '@/lib/konu-takibi/sinif'
import { useGeriKatmani } from '@/lib/geri'
import { useAsagiKaydirKapat } from '@/lib/asagi-kaydir'
import { ANAHTARLAR, useYerelDepo } from '@/lib/depo'
import { bugun, cn, tariheCevir } from '@/lib/utils'
import { BaslikSatiri, Cip, Kart } from '@/components/ui'
import { dersVurgusu } from '@/components/ders-renkleri'
import { Konfeti } from '@/components/oyun-kabuk'

/**
 * Konu Takibi — YKS konularını aşama aşama işaretleme.
 *
 * Akış: en üstte sınıf sekmesi (9 · 10 · 11 · 12) → o sınıfın okul dersleri →
 * dersin yalnız o sınıftaki konuları. TYT/AYT ayrımı yok (kullanıcı
 * kaldırttı, 2026-10); dersler okul dersi başına birleşik
 * (`lib/konu-takibi/okul-dersleri.ts`).
 * İşaretleme **satırın kendisinde**: soldaki ilerleme dairesi "Bitirdim"i,
 * sağdaki okul ve soru yuvaları kendi aşamasını aç/kapa yapıyor. Bir süre
 * aşamalar satırın altında açılan bir kartta işaretleniyordu ve bir konu
 * dört-beş dokunuş istiyordu (aç → okul → soru → Bitirdim → onay); otuz
 * konuluk bir derste bu, aracı açmamak için yeterli sebepti.
 *
 * Hesapların hepsi `lib/konu-takibi/`de; bu dosya yalnızca çiziyor.
 */

/** Aşamaların adı ve simgesi — satırın yuvaları, lejant ve ekran okuyucu aynı. */
const ASAMA: Record<AsamaId, { ad: string; kisa: string; Simge: typeof Check }> = {
  harita: { ad: 'Haritada çalıştım', kisa: 'harita', Simge: HaritaSimgesi },
  okul: { ad: 'Okulda öğrendim', kisa: 'okul', Simge: GraduationCap },
  soru: { ad: 'Soru çözdüm', kisa: 'soru', Simge: PencilLine },
}

/** Kutlamanın ekranda kaldığı süre — konfetinin en geç parçası (610 ms) + düşüşü. */
const KUTLAMA_SURESI = 2200

/** Bildirimin ekranda kaldığı süre. "Geri al"a uzanacak kadar uzun, kalıcı değil. */
const BILDIRIM_SURESI = 4500

/*
  Oturumluk hatırlananlar: seçili sınıf, açık ders ve ders listesinin kaydırma
  konumu. Araçtan çıkıp dönen öğrenci kaldığı dersi bulsun; ama bunlar kalıcı
  bir ayar değil, uygulama kapanınca başa dönmek doğru. `sessionStorage`
  gizli pencerede ya da kısıtlı WebView'da atabiliyor, o yüzden her erişim
  sarılı ve ekran onsuz da doğru çalışıyor.
*/
/** Seçili sınıf ('9'–'12'). Eskiden 'tyt'/'ayt' tutuyordu; okunamayan değer varsayılana düşüyor. */
const OTURUM_ANAHTARI = 'rabi-konu-takibi-sekme'
const DERS_ANAHTARI = 'rabi-konu-takibi-ders'
const KAYDIRMA_ANAHTARI = 'rabi-konu-takibi-kaydirma'

function oturumOku(anahtar: string): string | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage.getItem(anahtar)
  } catch {
    return null
  }
}

function oturumYaz(anahtar: string, deger: string | null) {
  try {
    if (deger === null) window.sessionStorage.removeItem(anahtar)
    else window.sessionStorage.setItem(anahtar, deger)
  } catch {
    // Hatırlanmasa da olur.
  }
}

/**
 * Ders renginin tonları. Haritada karşılığı olan ders haritadaki rengini
 * taşıyor; olmayan (Felsefe, Din) Yanlış Soru Bankası'ndaki gibi nötr.
 */
function renkler(renk: KonuDersId | null) {
  if (!renk) {
    return {
      zemin: 'var(--muted)',
      kenar: 'var(--border)',
      koyu: 'var(--foreground)',
      dolgu: 'var(--muted-foreground)',
    }
  }
  return {
    zemin: `var(--konu-${renk})`,
    kenar: `var(--konu-${renk}-kenar)`,
    koyu: `var(--konu-${renk}-koyu)`,
    dolgu: `var(--konu-${renk}-ok)`,
  }
}

type Renkler = ReturnType<typeof renkler>

/** Ders seçilmemişken (giriş ekranının özeti) markanın tonları. */
const MARKA_RENGI: Renkler = {
  zemin: 'var(--primary-soft)',
  kenar: 'var(--primary-soft)',
  koyu: 'var(--primary)',
  dolgu: 'var(--primary-parlak)',
}

export function KonuTakibiEkrani({
  tanitimda = false,
  takip,
  setTakip,
  ilerlemeler,
  alan,
  setAlan,
  sinif,
  onHaritayaGit,
}: {
  /**
   * Tanıtım turu ekranı gösteriyor: giriş görünümü öğrencinin sınıfında
   * açılıyor (oturumda açık kalmış ders turun hedefini örtmesin) ve lejant
   * kayıt dolu olsa da görünüyor — tur aşamaları onun üstünden anlatıyor.
   */
  tanitimda?: boolean
  takip: YksTakip
  setTakip: (guncelle: (onceki: YksTakip) => YksTakip) => void
  /** Konu haritasının kaydı — "Haritada çalıştım" buradan hesaplanıyor. */
  ilerlemeler: KonuIlerlemeleri
  /** Ayarlardaki alan; `null` "Karar vermedim" — bütün AYT konuları görünüyor. */
  alan: PuanTuru | null
  /** Alan seçilmemişse listenin altında soruluyor; cevap ayarlara yazılıyor. */
  setAlan: (alan: PuanTuru) => void
  /** Ayarlardaki `buYilSinif` (mezun 13) — varsayılan sınıf, müfredat ve hızlı başlangıç. */
  sinif: number
  onHaritayaGit: (konum: HaritaKonumu) => void
}) {
  const [seciliSinif, setSeciliSinif] = useState<YksSinif>(() => {
    const kayitli = Number(oturumOku(OTURUM_ANAHTARI))
    return sinifMi(kayitli) ? kayitli : varsayilanSinif(sinif)
  })
  const [acikDersId, setAcikDersId] = useState<string | null>(() => oturumOku(DERS_ANAHTARI))
  /** Ders "Devam et"ten açıldıysa ders ekranının açıp göstereceği konu. */
  const [hedefKonu, setHedefKonu] = useState<string | null>(null)
  /** Ders listesinin kaydırma konumu — ders kapanınca geri geliyor. */
  const listeKaydirma = useRef(Number(oturumOku(KAYDIRMA_ANAHTARI)) || 0)

  useEffect(() => oturumYaz(OTURUM_ANAHTARI, String(seciliSinif)), [seciliSinif])
  useEffect(() => oturumYaz(DERS_ANAHTARI, acikDersId), [acikDersId])

  const sekmeler = useMemo(() => sinifSekmeleri(alan, sinif, takip, ilerlemeler), [alan, sinif, takip, ilerlemeler])
  /*
    Görünen sınıf: seçilen, ama pasifse (oturumdan dönen sekme artık boş,
    Maarif'te 12) önce öğrencinin sınıfı, o da olmazsa ilk açık sekme.
    Tanıtım turu her zaman öğrencinin sınıfında.
  */
  const secilebilir = (s: YksSinif) => sekmeler.some((x) => x.sinif === s && !x.pasif)
  const varsayilan = varsayilanSinif(sinif)
  const yedek = secilebilir(varsayilan) ? varsayilan : (sekmeler.find((x) => !x.pasif)?.sinif ?? varsayilan)
  const gorunenSinif: YksSinif = !tanitimda && secilebilir(seciliSinif) ? seciliSinif : yedek

  const dersler = useMemo(() => sinifDersleri(gorunenSinif, alan, sinif), [gorunenSinif, alan, sinif])

  /*
    Ders özetleri bir kez hesaplanıyor; sınıfın özeti ve ders satırları aynı
    tablodan okuyor.
  */
  const ozetler = useMemo(() => {
    const tablo = new Map<string, DersOzeti>()
    for (const ders of dersler) tablo.set(ders.id, dersOzeti(ders, takip, ilerlemeler))
    return tablo
  }, [dersler, takip, ilerlemeler])

  /*
    Giriş açıklaması kapatılana kadar duruyor; turda her zaman görünür (tur
    bu bloğu aydınlatıyor). Depo okunmadan çizilmiyor: kapatmış kullanıcıda
    kart bir kare görünüp kaybolmasın.
  */
  const [aciklamaKapali, setAciklamaKapali, aciklamaHazir] = useYerelDepo<boolean>(
    ANAHTARLAR.konuTakibiAciklamaKapali,
    false,
  )
  const aciklamaGoster = tanitimda || (aciklamaHazir && aciklamaKapali !== true)

  /*
    Hızlı başlangıç: 12. sınıf ve mezunda, seçili sınıfta hiç işaret yokken
    o sınıf için bir kez "N. sınıfta neredeyim?". Bayrak kalıcı; `hazir`
    beklenmeden çizilseydi kart depo okunana kadar bir kare görünüp
    kaybolurdu.
  */
  const [hizliHam, setHizliBayrak, hizliHazir] = useYerelDepo<HizliBaslangicBayragi>(
    ANAHTARLAR.konuTakibiHizliBaslangic,
    BOS_HIZLI_BAYRAK,
  )
  const hizliBayrak = hizliBayragiCoz(hizliHam)
  const hizliGoster =
    hizliHazir &&
    !tanitimda &&
    hizliBaslangicSinifi(sinif) &&
    dersler.length > 0 &&
    !hizliBayrak.gosterilen.includes(gorunenSinif) &&
    dersleriIsaretsiz(dersler, takip)

  const [bildirim, setBildirim] = useState<Bildirim | null>(null)
  const bildirimZamani = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (bildirimZamani.current) clearTimeout(bildirimZamani.current)
    },
    [],
  )
  const soyle = (metin: string, geriAl?: () => void) => {
    const kimlik = Date.now()
    setBildirim({ kimlik, metin, geriAl })
    if (bildirimZamani.current) clearTimeout(bildirimZamani.current)
    bildirimZamani.current = setTimeout(() => setBildirim((o) => (o?.kimlik === kimlik ? null : o)), BILDIRIM_SURESI)
  }

  const bayrakYaz = (s: YksSinif, gosterildi: boolean) =>
    setHizliBayrak((onceki) => {
      const eski = hizliBayragiCoz(onceki).gosterilen.filter((x) => x !== s)
      return { surum: 2, gosterilen: gosterildi ? [...eski, s] : eski }
    })

  /**
   * Seçime göre seçili sınıfın her dersinin ilk konularını "okulda işlendi"
   * yazar ve kartı kapatır. Geri al ikisini birden geri alıyor: işaretler
   * kalkıyor, kart yeniden çıkıyor — öğrenci yanlış seçeneğe bastıysa
   * doğrusunu seçebilsin.
   */
  const hizliSec = (oran: number) => {
    const s = gorunenSinif
    const konuIdleri = hizliBaslangicKonulari(dersler, oran)
    bayrakYaz(s, true)
    if (konuIdleri.length === 0) return
    const gun = bugun()
    setTakip((onceki) => okuluTopluYaz(onceki, konuIdleri, true, gun))
    soyle(`${konuIdleri.length} konu okulda işlendi`, () => {
      setTakip((onceki) => okuluTopluYaz(onceki, konuIdleri, false, gun))
      bayrakYaz(s, false)
    })
  }

  const dersAc = (ders: TakipDersi, konuId: string | null = null) => {
    listeKaydirma.current = window.scrollY
    oturumYaz(KAYDIRMA_ANAHTARI, String(Math.round(window.scrollY)))
    setHedefKonu(konuId)
    setAcikDersId(ders.id)
  }

  /*
    Ders açılınca sayfa başa, kapanınca ders listesinde kalınan yere. Pencere
    kaydırılıyor ve iki görünüm aynı kökte yer değiştiriyor; ayarlanmasaydı
    listenin dibinden açılan ders de dibinden açılır, dönüşte liste başa
    sıçrardı. Boyamadan önce (`useLayoutEffect`): sonra yapılsaydı bir kare
    yanlış yerde görünürdü.
  */
  const ilkCizim = useRef(true)
  useLayoutEffect(() => {
    if (ilkCizim.current) {
      ilkCizim.current = false
      return
    }
    if (acikDersId === null) window.scrollTo(0, listeKaydirma.current)
    else window.scrollTo(0, 0)
  }, [acikDersId])

  const acikDers = tanitimda ? null : (dersler.find((d) => d.id === acikDersId) ?? null)
  // Android'in geri tuşu ve kabuğun "Geri"si önce dersi kapatıyor, sonra araçtan çıkıyor.
  useGeriKatmani(acikDers !== null, () => setAcikDersId(null))

  if (acikDers) {
    return (
      <DersEkrani
        key={`${acikDers.sinif}-${acikDers.id}`}
        ders={acikDers}
        takip={takip}
        setTakip={setTakip}
        ilerlemeler={ilerlemeler}
        hedefKonu={hedefKonu}
        onHaritayaGit={onHaritayaGit}
      />
    )
  }

  return (
    // Tablette içerik ortada sınırlı genişlikte, ders listesi iki sütun;
    // telefonda bu sınıflar eşleşmiyor.
    <div className="tablet:mx-auto tablet:max-w-3xl">
      <BaslikSatiri baslik="Konu Takibi" arac="konu-takibi" />

      {/* Tanıtım turunun "Konu konu işaretle" adımı bu bloğu aydınlatıyor. */}
      <div data-tanitim="konu-takibi">
        <SinifSekmesi sekmeler={sekmeler} secili={gorunenSinif} r={MARKA_RENGI} onSec={setSeciliSinif} />

        {hizliGoster ? (
          <HizliBaslangic
            sinif={gorunenSinif}
            onSec={hizliSec}
            onAtla={() => bayrakYaz(gorunenSinif, true)}
          />
        ) : (
          aciklamaGoster && <GirisAciklamasi onKapat={tanitimda ? undefined : () => setAciklamaKapali(true)} />
        )}
      </div>

      {/* Sınıfın toplam özeti burada yok: sekmedeki yüzde ve kartlardaki "x/y bitti" aynı ilerlemeyi söylüyor. */}
      <ul className="mt-4 grid grid-cols-2 gap-2 tablet:grid-cols-3">
        {dersler.map((ders) => (
          <li key={ders.id}>
            <DersKarti ders={ders} ozet={ozetler.get(ders.id)!} onAc={() => dersAc(ders)} />
          </li>
        ))}
      </ul>

      {alan === null && <AlanSorusu onSec={setAlan} />}

      {bildirim && <BildirimSeridi key={bildirim.kimlik} bildirim={bildirim} onKapat={() => setBildirim(null)} />}
    </div>
  )
}

/**
 * Tek soruluk hızlı başlangıç. Otuz-kırk konuyu tek tek "okulda" işaretlemek
 * son sınıftaki öğrenci için aracı açmamak için yeterli sebep; bu kart onu
 * bir dokunuşa indiriyor. Tanıtım değil: "Atla" kartı kapatıyor, cevap
 * vermek zorunlu değil.
 */
function HizliBaslangic({
  sinif,
  onSec,
  onAtla,
}: {
  sinif: YksSinif
  onSec: (oran: number) => void
  onAtla: () => void
}) {
  return (
    <Kart className="mb-3">
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 font-display text-[17px] font-extrabold tracking-tight">{sinif}. sınıfta neredeyim?</p>
        <button
          type="button"
          onClick={onAtla}
          className="-mt-2 -mr-2 min-h-11 shrink-0 rounded-xl px-3 text-[13.5px] font-bold text-muted-foreground transition active:bg-muted"
        >
          Atla
        </button>
      </div>
      <p className="mt-0.5 text-[13.5px] font-semibold text-pretty text-muted-foreground">
        Bu sınıfın okulda işlenen konularını her derste müfredat sırasıyla işaretleyeyim; sonra tek tek düzeltebilirsin.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {HIZLI_SECENEKLER.map((s) => (
          <Cip key={s.id} onClick={() => onSec(s.oran)} className="min-h-11">
            {s.ad}
          </Cip>
        ))}
      </div>
    </Kart>
  )
}

/**
 * Girişin açıklaması: simge, kısa başlık ve tek cümle. Uzun lejant buradan
 * kalktı; halkanın dilimleri ders ekranının altında zaten anlatılıyor.
 * Kapatılınca bir daha çıkmıyor (`konuTakibiAciklamaKapali`).
 */
function GirisAciklamasi({ onKapat }: { onKapat?: () => void }) {
  return (
    <Kart className="mb-3 flex items-start gap-3 py-3 pr-1.5 pl-3.5">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary" aria-hidden>
        <ListChecks size={18} strokeWidth={2.4} />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[14px] leading-snug font-extrabold">9–12: her sınıfın okul konuları</p>
        <p className="mt-0.5 text-[12.5px] leading-snug font-semibold text-pretty text-muted-foreground">
          Konuyu okulda gördükçe, soru çözdükçe ve bitirdikçe işaretle; her derste ne kadar ilerlediğini gör.
        </p>
      </div>
      {onKapat && (
        <button
          type="button"
          onClick={onKapat}
          aria-label="Açıklamayı kapat"
          className="-my-1 grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition active:bg-muted"
        >
          <X size={16} strokeWidth={2.6} aria-hidden />
        </button>
      )}
    </Kart>
  )
}

/**
 * Alan seçilmemişse bütün alanların konuları görünüyor (bir alan varsaymak
 * öğrencinin yerine karar vermek olurdu); listenin altında alan soruluyor.
 * Seçim Ayarlar › Alanım'a yazılıyor — iki ayrı alan kaydı birbirini
 * tutmazdı.
 */
function AlanSorusu({ onSec }: { onSec: (alan: PuanTuru) => void }) {
  return (
    <Kart className="mt-4 text-center">
      <p className="font-display text-[17px] font-extrabold tracking-tight">Hangi alandasın?</p>
      <p className="mt-1 text-[13.5px] font-semibold text-pretty text-muted-foreground">
        Şimdilik bütün alanların konuları görünüyor; alanını seçersen yalnız seninkiler kalır. Seçimin Ayarlar › Alanım’a
        da yazılır.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {(Object.keys(ALAN_ADLARI) as PuanTuru[]).map((tur) => (
          <Cip key={tur} onClick={() => onSec(tur)}>
            {ALAN_ADLARI[tur]}
          </Cip>
        ))}
      </div>
    </Kart>
  )
}

/**
 * Ders kartı (tasarım C): ortada ders simgesi olan ilerleme halkası, altında
 * ad ve "x/y bitti". Halka segmentli çubukla aynı mantıkta aşama ağırlıklı
 * dolar (bitti tam, soru çözülen 2/3, okulda işlenen 1/3); yalnız görsel,
 * kayıt ve öneri kuralı değişmiyor.
 */
function DersKarti({ ders, ozet, onAc }: { ders: TakipDersi; ozet: DersOzeti; onAc: () => void }) {
  const r = renkler(ders.renk)
  const oran = ozet.toplam > 0 ? (ozet.biten + ozet.soruda * 0.66 + ozet.okulda * 0.33) / ozet.toplam : 0
  return (
    <button
      type="button"
      onClick={onAc}
      className="golge-kart flex h-full w-full flex-col gap-2 rounded-[18px] bg-card p-3 text-left transition active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="relative grid size-11 place-items-center">
        <Halka oran={oran} renk={r.dolgu} />
        <span className="emoji absolute inset-0 grid place-items-center text-[19px] leading-none" aria-hidden>
          {ders.ikon}
        </span>
      </span>
      <span className="font-display text-[14px] leading-tight font-extrabold tracking-tight">{ders.ad}</span>
      <span className="text-[12px] font-extrabold text-muted-foreground">
        <span className="rakam">{ozet.biten}</span>/<span className="rakam">{ozet.toplam}</span> bitti
      </span>
    </button>
  )
}

/** Ders kartının ilerleme halkası: boş iz + ders renginde yay. */
function Halka({ oran, renk }: { oran: number; renk: string }) {
  const boyut = 44
  const kalinlik = 4
  const yaricap = (boyut - kalinlik) / 2
  const cevre = 2 * Math.PI * yaricap
  return (
    <svg width={boyut} height={boyut} className="-rotate-90" aria-hidden>
      <circle cx={boyut / 2} cy={boyut / 2} r={yaricap} fill="none" stroke="var(--muted)" strokeWidth={kalinlik} />
      {oran > 0 && (
        <circle
          cx={boyut / 2}
          cy={boyut / 2}
          r={yaricap}
          fill="none"
          stroke={renk}
          strokeWidth={kalinlik}
          strokeLinecap="round"
          strokeDasharray={cevre}
          strokeDashoffset={cevre * (1 - Math.min(1, oran))}
          className="transition-[stroke-dashoffset] duration-300"
        />
      )}
    </svg>
  )
}

type Bildirim = { kimlik: number; metin: string; geriAl?: () => void }

/** Konu kartındaki üç karo: sıra, ad ve simge. Aşamalar birbirinden bağımsız. */
const KARO_ASAMALARI = [
  { id: 'okul', ad: 'Okul', Simge: GraduationCap, bildirim: 'Okulda öğrendim · bugün' },
  { id: 'soru', ad: 'Soru', Simge: PencilLine, bildirim: 'Soru çözdüm · bugün' },
  { id: 'bitti', ad: 'Bitti', Simge: Flag, bildirim: '' },
] as const satisfies readonly { id: YazilanAlan; ad: string; Simge: typeof Check; bildirim: string }[]

/** Karo zıplamasının süresi (`.karo-pop`, globals.css) — sınıf bu kadar sonra kalkıyor. */
const ZIPLAMA_SURESI = 360

/** 'YYYY-AA-GG' → "8 Eki". Karoda ve satırda yer dar. */
function kisaGun(iso: string): string {
  return tariheCevir(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

/** Satırın tek satırlık durumu: ne yapıldığı, bitmişse günü. */
function durumYazisi(durum: KonuDurumu): string {
  if (durum.bitti) return durum.kayit.bitti ? `Bitti · ${kisaGun(durum.kayit.bitti)}` : 'Bitti'
  if (bitirmeyeHazir(durum)) return 'Aşamalar tamam · bitirmeye hazır'
  const parcalar: string[] = []
  if (durum.kayit.okul) parcalar.push('okulda gördün')
  if (durum.kayit.soru) parcalar.push('soru çözdün')
  if (durum.harita?.durum === 'tamam') parcalar.push('haritada bitirdin')
  else if (durum.harita?.durum === 'basladi') parcalar.push('haritada başladın')
  if (parcalar.length === 0) return 'Başlamadın'
  const yazi = parcalar.join(' · ')
  return yazi.charAt(0).toLocaleUpperCase('tr') + yazi.slice(1)
}

/** Seçili sınıfta bir okul dersinin konu listesi. */
function DersEkrani({
  ders,
  takip,
  setTakip,
  ilerlemeler,
  hedefKonu,
  onHaritayaGit,
}: {
  ders: TakipDersi
  takip: YksTakip
  setTakip: (guncelle: (onceki: YksTakip) => YksTakip) => void
  ilerlemeler: KonuIlerlemeleri
  hedefKonu: string | null
  onHaritayaGit: (konum: HaritaKonumu) => void
}) {
  const r = renkler(ders.renk)
  const [acikKonu, setAcikKonu] = useState<string | null>(hedefKonu)
  const [kutlanan, setKutlanan] = useState<string | null>(null)
  const [ziplayan, setZiplayan] = useState<YazilanAlan | null>(null)
  const [bildirim, setBildirim] = useState<Bildirim | null>(null)
  /**
   * "Bitmeyenler" süzgeci açılınca görünen konuların listesi o an donuyor:
   * süzgeç her çizimde yeniden hesaplansaydı bitirilen konu parmağın
   * altından kaybolur, altındaki satır yukarı kayardı.
   */
  const [suzgec, setSuzgec] = useState<Set<string> | null>(null)
  const zamanlayicilar = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(
    () => () => {
      for (const z of zamanlayicilar.current) clearTimeout(z)
    },
    [],
  )
  const sonra = (is: () => void, ms: number) => {
    zamanlayicilar.current.push(setTimeout(is, ms))
  }

  // Bir konu hedeflenerek açıldıysa satırı ekranın ortasına getir.
  useEffect(() => {
    if (!hedefKonu) return
    requestAnimationFrame(() => document.getElementById(`yks-konu-${hedefKonu}`)?.scrollIntoView({ block: 'center' }))
  }, [hedefKonu])

  const durumlar = useMemo(() => {
    const tablo = new Map<string, KonuDurumu>()
    for (const konu of ders.konular) tablo.set(konu.id, satirDurumu(konu, takip, ilerlemeler))
    return tablo
  }, [ders, takip, ilerlemeler])

  /**
   * Hiçbir satırın haritada karşılığı yoksa halkada harita dilimi yok:
   * Felsefe, Din, Yabancı Dil ve 12. sınıf.
   */
  const haritaKolonu = ders.konular.some((k) => durumlar.get(k.id)!.harita !== null)
  const biten = ders.konular.filter((k) => durumlar.get(k.id)!.bitti).length
  const bitmeyenSayisi = ders.konular.length - biten

  /*
    Konu listesi bölümlere ayrılıyor (Matematik → Geometri, Türk Dili ve
    Edebiyatı → Dil ve Anlatım / Edebiyat, Felsefe → Psikoloji…). Bölümsüz
    konular başta; bölüm varsa onların başlığı dersin adı.
  */
  const bloklar = useMemo(() => konuBloklari(ders), [ders])
  const cokBlok = bloklar.length > 1

  const soyle = (metin: string, geriAl?: () => void) => {
    const kimlik = Date.now()
    setBildirim({ kimlik, metin, geriAl })
    sonra(() => setBildirim((o) => (o?.kimlik === kimlik ? null : o)), BILDIRIM_SURESI)
  }

  /** Satıra yazar; birleşen satırda iki kaydı birden (`satirYaz`). */
  const yaz = (satir: TakipSatiri, alan: YazilanAlan, acik: boolean) =>
    setTakip((onceki) => satirYaz(onceki, satir, alan, acik, bugun()))

  /**
   * Satırın kayıtlarını dokunmadan önceki hâline döndürür. Yalnız bu satırın
   * kimliklerine dokunuyor: bildirim ekranda dururken başka konuda yapılan
   * işaret geri alınmasın.
   */
  const geriAlici = (satir: TakipSatiri) => {
    const eski = satirKimlikleri(satir).map((id) => [id, takip.konular[id]] as const)
    return () =>
      setTakip((o) => {
        const konular = { ...o.konular }
        for (const [id, kayit] of eski) {
          if (kayit) konular[id] = kayit
          else delete konular[id]
        }
        return { ...o, konular }
      })
  }

  /**
   * Karoya dokunmak o aşamayı aç/kapa yapıyor; onay penceresi yok. "Bitti"de
   * eksik aşama hatırlatması bildirimde ve konuyu bitirmeyi engellemiyor —
   * öğrenci konuyu dershanede öğrenmiş, haritayı hiç açmamış olabilir.
   *
   * Konfeti yalnızca **dersin bu sınıftaki son konusu** bitince: art arda on
   * konu işaretleyen öğrencinin her dokunuşunda patlayan kutlama listeyi
   * kapatıyor ve kutlamayı sıradanlaştırıyordu.
   */
  const asamaDokun = (konu: TakipSatiri, alan: YazilanAlan) => {
    const durum = durumlar.get(konu.id)!
    const geriAl = geriAlici(konu)
    const ad = KARO_ASAMALARI.find((a) => a.id === alan)!
    setZiplayan(alan)
    sonra(() => setZiplayan(null), ZIPLAMA_SURESI)

    const dolu = alan === 'bitti' ? durum.bitti : durum.kayit[alan] !== undefined
    if (dolu) {
      yaz(konu, alan, false)
      soyle(`${ad.ad} işareti kaldırıldı`, geriAl)
      return
    }
    yaz(konu, alan, true)
    if (alan !== 'bitti') {
      soyle(ad.bildirim, geriAl)
      return
    }
    void Haptics.notification({ type: NotificationType.Success }).catch(() => {})
    const dersBitti = ders.konular.every((k) => k.id === konu.id || durumlar.get(k.id)!.bitti)
    if (dersBitti) {
      setKutlanan(konu.id)
      sonra(() => setKutlanan(null), KUTLAMA_SURESI)
    }
    const eksik = eksikAsamalar(durum)
    soyle(
      eksik.length > 0 ? `Bitti · eksik: ${eksik.map((a) => ASAMA[a].kisa).join(', ')}` : `${konu.ad} · bitti`,
      geriAl,
    )
  }

  const acik = acikKonu === null ? -1 : ders.konular.findIndex((k) => k.id === acikKonu)
  const acikSatir = acik >= 0 ? ders.konular[acik] : null
  const gez = (yon: -1 | 1) => {
    const hedef = ders.konular[acik + yon]
    if (hedef) setAcikKonu(hedef.id)
  }

  return (
    // Dersin rengi ortak bileşenlere de geçiyor (`dersVurgusu`): çip ve
    // odak halkası Matematik'te mavi, Kimya'da turuncu. Tablette konu
    // satırları tek sütun ama ortada sınırlı genişlikte.
    <div className="tablet:mx-auto tablet:max-w-3xl" style={ders.renk ? dersVurgusu(ders.renk) : undefined}>
      <div className="mb-3 flex min-h-11 items-center gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-[24px] leading-tight font-extrabold tracking-tight">{ders.ad}</h1>
          <p className="text-[12.5px] font-extrabold text-muted-foreground">
            {ders.sinif}. sınıf · <b className="rakam text-foreground">{biten}</b>/<span className="rakam">{ders.konular.length}</span> bitti
          </p>
        </div>
        <span className="relative grid size-12 shrink-0 place-items-center">
          <Halka oran={ders.konular.length > 0 ? biten / ders.konular.length : 0} renk={r.dolgu} />
          <span className="emoji absolute inset-0 grid place-items-center text-[20px] leading-none" aria-hidden>
            {ders.ikon}
          </span>
        </span>
      </div>

      {ders.sinif === HARITASIZ_SINIF && !haritaKolonu && (
        <p role="status" className="-mt-1.5 mb-3 px-1 text-[12.5px] font-bold text-pretty text-muted-foreground">
          12. sınıfın haritası yok; konuları okul ve soru aşamasıyla işaretleyebilirsin.
        </p>
      )}

      {/*
        "Bitmeyenler" varsayılan kapalı: öğrenci listeyi müfredat sırasıyla
        tanıyor ve bitmiş konuların arada durması nerede olduğunu söylüyor;
        açık başlasaydı ilk bitirdiği konu ekrandan kaybolur, liste ders
        kitabındaki sıradan kopardı. Dersin yarısı bittikten sonra işe yarıyor.
      */}
      {biten > 0 && bitmeyenSayisi > 0 && (
        <div className="mb-1 flex">
          <Cip
            secili={suzgec !== null}
            onClick={() =>
              setSuzgec((o) => (o ? null : new Set(ders.konular.filter((k) => !durumlar.get(k.id)!.bitti).map((k) => k.id))))
            }
            className="min-h-9 text-[13px]"
          >
            Bitmeyenler · <span className="rakam">{bitmeyenSayisi}</span>
          </Cip>
        </div>
      )}

      <div>
        {bloklar.map(({ bolum, konular }) => {
          const gorunen = suzgec ? konular.filter((k) => suzgec.has(k.id)) : konular
          if (gorunen.length === 0) return null
          const blokBiten = konular.filter((k) => durumlar.get(k.id)!.bitti).length
          return (
            <section key={bolum ?? 'ana'}>
              {(bolum || cokBlok) && (
                <div className="sticky top-[var(--guvenli-ust)] z-10 -mx-1 mt-3 mb-1 flex items-center gap-2 bg-background px-2.5 py-2">
                  <h2 className="min-w-0 flex-1 text-[11px] font-extrabold tracking-[0.08em] text-muted-foreground uppercase">
                    {bolum ?? ders.ad}
                  </h2>
                  <span className="text-[12px] font-extrabold text-muted-foreground">
                    <b className="rakam text-foreground">{blokBiten}</b>/<span className="rakam">{konular.length}</span> bitti
                  </span>
                  <BolumCubugu konular={konular} durumlar={durumlar} r={r} />
                </div>
              )}
              <ul className="golge-kart overflow-hidden rounded-[18px] bg-card">
                {gorunen.map((konu) => {
                  const durum = durumlar.get(konu.id)!
                  return (
                    <li key={konu.id} id={`yks-konu-${konu.id}`} className="scroll-mt-16 border-t border-border first:border-t-0">
                      <button
                        type="button"
                        onClick={() => setAcikKonu(konu.id)}
                        className="flex min-h-[58px] w-full items-center gap-2.5 py-2 pr-2.5 pl-3 text-left transition active:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                      >
                        <DilimliHalka durum={durum} r={r} />
                        <span className="min-w-0 flex-1">
                          <span className={cn('block text-[14.5px] leading-snug font-extrabold', durum.bitti && 'text-muted-foreground')}>
                            {konu.ad}
                          </span>
                          <span className="block text-[11.5px] font-bold text-muted-foreground">{durumYazisi(durum)}</span>
                        </span>
                        <ChevronRight size={16} strokeWidth={2.6} aria-hidden className="shrink-0 text-muted-foreground" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      <p className="mt-3 flex items-start gap-2 rounded-xl bg-muted px-2.5 py-2 text-[12px] font-bold text-muted-foreground">
        <HaritaSimgesi size={14} strokeWidth={2.3} aria-hidden className="mt-px shrink-0" />
        <span>
          {haritaKolonu
            ? 'Halkanın üç dilimi: harita · okul · soru. Yeşil halka: bitti.'
            : 'Halkanın iki dilimi: okul · soru. Yeşil halka: bitti.'}
        </span>
      </p>

      {acikSatir && (
        <KonuKarti
          konu={acikSatir}
          durum={durumlar.get(acikSatir.id)!}
          r={r}
          etiket={(() => {
            const blok = bloklar.find((b) => b.konular.some((k) => k.id === acikSatir.id))!
            return `${blok.bolum ?? ders.ad} · ${blok.konular.indexOf(acikSatir) + 1}/${blok.konular.length}`
          })()}
          onceki={acik > 0}
          sonraki={acik < ders.konular.length - 1}
          ziplayan={ziplayan}
          kutlaniyor={kutlanan === acikSatir.id}
          onGez={gez}
          onKapat={() => setAcikKonu(null)}
          onAsama={(alan) => asamaDokun(acikSatir, alan)}
          onHaritayaGit={onHaritayaGit}
        />
      )}

      {bildirim && (
        <BildirimSeridi key={bildirim.kimlik} bildirim={bildirim} ustte={acikSatir !== null} onKapat={() => setBildirim(null)} />
      )}
    </div>
  )
}

/** Bölüm başlığındaki ince çubuk: bitti yeşil, okulda/soruda olan ama bitmemiş ders renginin açığı. */
function BolumCubugu({
  konular,
  durumlar,
  r,
}: {
  konular: readonly TakipSatiri[]
  durumlar: Map<string, KonuDurumu>
  r: Renkler
}) {
  const n = Math.max(1, konular.length)
  const bitti = konular.filter((k) => durumlar.get(k.id)!.bitti).length
  const yolda = konular.filter((k) => {
    const d = durumlar.get(k.id)!
    return !d.bitti && (d.kayit.okul !== undefined || d.kayit.soru !== undefined)
  }).length
  return (
    <span aria-hidden className="flex h-1.5 w-[70px] shrink-0 overflow-hidden rounded-full bg-muted">
      <i className="block h-full bg-success" style={{ width: `${(bitti / n) * 100}%` }} />
      <i className="block h-full" style={{ width: `${(yolda / n) * 100}%`, background: r.kenar }} />
    </span>
  )
}

/**
 * Satırın halkası: harita · okul · soru için üç dilim (haritasız konuda
 * ikisi), dolu dilim ders renginde; harita yarımsa açık ton. Bitince tam
 * yeşil halka ve tik; aşamalar tamam ama bitmemişse ortada soluk tik.
 */
function DilimliHalka({ durum, r }: { durum: KonuDurumu; r: Renkler }) {
  const boy = 36
  const kalinlik = 4
  const yaricap = (boy - kalinlik) / 2
  const cevre = 2 * Math.PI * yaricap
  if (durum.bitti) {
    return (
      <span className="relative grid shrink-0 place-items-center text-success" style={{ width: boy, height: boy }} aria-hidden>
        <svg width={boy} height={boy} className="-rotate-90" aria-hidden>
          <circle cx={boy / 2} cy={boy / 2} r={yaricap} fill="none" stroke="var(--success)" strokeWidth={kalinlik} />
        </svg>
        <Check size={15} strokeWidth={3.2} className="absolute" />
      </span>
    )
  }
  const dilimler = [
    ...(durum.harita
      ? [durum.harita.durum === 'tamam' ? r.dolgu : durum.harita.durum === 'basladi' ? r.kenar : 'var(--muted)']
      : []),
    durum.kayit.okul ? r.dolgu : 'var(--muted)',
    durum.kayit.soru ? r.dolgu : 'var(--muted)',
  ]
  const bosluk = 5
  const uzunluk = cevre / dilimler.length - bosluk
  return (
    <span className="relative grid shrink-0 place-items-center" style={{ width: boy, height: boy }} aria-hidden>
      <svg width={boy} height={boy} aria-hidden>
        {dilimler.map((renk, j) => (
          <circle
            key={j}
            cx={boy / 2}
            cy={boy / 2}
            r={yaricap}
            fill="none"
            stroke={renk}
            strokeWidth={kalinlik}
            strokeLinecap="round"
            strokeDasharray={`${uzunluk} ${cevre - uzunluk}`}
            transform={`rotate(${-90 + (j * 360) / dilimler.length + ((bosluk / cevre) * 180)} ${boy / 2} ${boy / 2})`}
          />
        ))}
      </svg>
      {bitirmeyeHazir(durum) && (
        <Check size={13} strokeWidth={3} className="absolute text-success opacity-70" />
      )}
    </span>
  )
}

/**
 * Konuya dokununca alttan açılan kart: konu adı, yan yana üç büyük karo
 * (Okul · Soru · Bitti), önceki/sonraki konu ve haritada pekiştir bağı.
 * İşaretli karo ders renginde dolu (Bitti yeşil), içinde tik ve işaret günü;
 * boşta "Dokun". Aşamalar bağımsız, Bitti hiçbirine bağlı değil.
 */
function KonuKarti({
  konu,
  durum,
  r,
  etiket,
  onceki,
  sonraki,
  ziplayan,
  kutlaniyor,
  onGez,
  onKapat,
  onAsama,
  onHaritayaGit,
}: {
  konu: TakipSatiri
  durum: KonuDurumu
  r: Renkler
  etiket: string
  onceki: boolean
  sonraki: boolean
  ziplayan: YazilanAlan | null
  kutlaniyor: boolean
  onGez: (yon: -1 | 1) => void
  onKapat: () => void
  onAsama: (alan: YazilanAlan) => void
  onHaritayaGit: (konum: HaritaKonumu) => void
}) {
  useGeriKatmani(true, onKapat)
  const kaydir = useAsagiKaydirKapat(onKapat)
  // Portal yalnızca istemcide: sunucuda üretilen HTML'de `document` yok.
  const [hazir, setHazir] = useState(false)
  useEffect(() => setHazir(true), [])
  if (!hazir) return null

  const dugme =
    'grid size-[34px] shrink-0 place-items-center rounded-[11px] bg-muted text-muted-foreground transition active:brightness-95 disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-ring'
  return createPortal(
    <div className="katman-zemin fixed inset-0 z-[70] flex items-end justify-center bg-black/40" onClick={onKapat}>
      <div
        ref={kaydir}
        role="dialog"
        aria-modal
        aria-label={konu.ad}
        className="alt-pencere-girisi relative w-full max-w-md overflow-hidden rounded-t-[24px] bg-card px-3.5 pt-2.5 pb-[calc(0.875rem+var(--guvenli-alt))]"
        onClick={(olay) => olay.stopPropagation()}
      >
        {kutlaniyor && <Konfeti />}
        <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-border" />
        <div className="mb-2.5 flex items-start gap-1.5">
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 text-[11px] font-extrabold tracking-[0.08em] text-muted-foreground uppercase">{etiket}</p>
            <h2 className="font-display text-[20px] leading-tight font-extrabold tracking-tight">{konu.ad}</h2>
          </div>
          <button type="button" className={dugme} disabled={!onceki} onClick={() => onGez(-1)} aria-label="Önceki konu">
            <ChevronLeft size={16} strokeWidth={2.8} aria-hidden />
          </button>
          <button type="button" className={dugme} disabled={!sonraki} onClick={() => onGez(1)} aria-label="Sonraki konu">
            <ChevronRight size={16} strokeWidth={2.8} aria-hidden />
          </button>
          <button type="button" className={dugme} onClick={onKapat} aria-label="Kapat">
            <X size={15} strokeWidth={2.6} aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {KARO_ASAMALARI.map(({ id, ad, Simge }) => {
            const gun = durum.kayit[id]
            const dolu = id === 'bitti' ? durum.bitti : gun !== undefined
            const dolgu = id === 'bitti' ? 'var(--success)' : r.dolgu
            return (
              <button
                key={id}
                type="button"
                onClick={() => onAsama(id)}
                aria-pressed={dolu}
                className={cn(
                  'flex aspect-[1/1.05] flex-col items-center justify-center gap-1.5 rounded-[18px] text-[15px] font-black transition-[background-color,color,transform] duration-200 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  dolu ? 'text-white' : 'bg-muted text-foreground',
                  ziplayan === id && 'karo-pop',
                )}
                style={dolu ? { background: dolgu } : undefined}
              >
                <span
                  className="grid size-[34px] place-items-center rounded-full bg-card transition-colors"
                  style={{ color: dolu ? dolgu : 'var(--muted-foreground)' }}
                >
                  {dolu ? <Check size={17} strokeWidth={3.2} aria-hidden /> : <Simge size={17} strokeWidth={2.3} aria-hidden />}
                </span>
                {ad}
                <small className={cn('text-[11px] font-extrabold', dolu ? 'opacity-85' : 'text-muted-foreground')}>
                  {gun ? kisaGun(gun) : 'Dokun'}
                </small>
              </button>
            )
          })}
        </div>

        {durum.harita && (
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => onHaritayaGit(durum.harita!.hedef)}
              className="flex min-h-9 items-center gap-1 rounded-lg pr-2 text-[12.5px] font-extrabold text-muted-foreground transition active:bg-muted"
            >
              <HaritaSimgesi size={13} strokeWidth={2.3} aria-hidden />
              Haritada pekiştir
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

/**
 * Ekranın en üstündeki sınıf sekmesi: `9 · 10 · 11 · 12` — haritanın sınıf
 * sekmesinin (`konu-haritasi.tsx` → `SinifSekmesi`) görsel dili: aynı yuva,
 * aynı "sen" işareti, altında küçük yüzde. TYT/AYT ayrımı ve "Tümü" yok
 * (kullanıcı kaldırttı, 2026-10). 12 müfredata göre: 12. sınıf ve mezunda
 * (2018 programı) **açık**; görünen satırların hiçbiri haritaya eşli değilse
 * "harita yok" yazıyor (12'de harita yalnız Matematik'te); 9–11'de
 * (Maarif) haritadaki gibi pasif ve "Yakında" rozetli. Yüzde o sınıfın
 * satırlarındaki dairelerin ortalaması (`sinifSekmeleri`).
 */
function SinifSekmesi({
  sekmeler,
  secili,
  r,
  onSec,
}: {
  sekmeler: SinifSekmesiVerisi[]
  secili: YksSinif
  r: Renkler
  onSec: (sinif: YksSinif) => void
}) {
  return (
    <div role="group" aria-label="Sınıf" className="mb-3 grid grid-cols-4 gap-1 rounded-[18px] bg-muted/70 p-1">
      {sekmeler.map(({ sinif, yuzde, pasif, sen, haritasiz, yakinda }) => {
        const seciliMi = sinif === secili
        const etiket = `${sinif}. sınıf${sen ? ', senin sınıfın' : ''}${
          yakinda ? ', yakında' : pasif ? ', konu yok' : `, yüzde ${yuzde}`
        }${haritasiz && !pasif ? ', haritası yok' : ''}`
        return (
          <button
            key={sinif}
            type="button"
            disabled={pasif}
            onClick={() => onSec(sinif)}
            aria-pressed={seciliMi}
            aria-label={etiket}
            className={cn(
              'relative flex min-h-[52px] min-w-0 flex-col items-center justify-center rounded-[14px] transition',
              seciliMi ? 'golge-kart bg-card text-foreground' : 'text-muted-foreground active:bg-card/60',
              pasif && (yakinda ? 'opacity-60' : 'opacity-50'),
            )}
          >
            {sen && (
              <span
                aria-hidden
                className="absolute top-1 right-1 rounded-full bg-primary-parlak px-1 text-[8.5px] leading-[13px] font-black text-white"
              >
                sen
              </span>
            )}
            <span className="rakam font-display text-[16px] leading-tight font-extrabold">{sinif}.</span>
            {yakinda ? (
              // Haritanın sınıf sekmesindeki rozetin aynısı (`konu-haritasi.tsx`).
              <span className="mt-0.5 rounded-full bg-background px-1.5 text-[9.5px] leading-[15px] font-extrabold">
                Yakında
              </span>
            ) : (
              <span
                className="rakam mt-0.5 text-[11px] leading-[15px] font-bold"
                style={seciliMi && !pasif ? { color: r.koyu } : undefined}
              >
                {pasif ? '—' : `%${yuzde}`}
              </span>
            )}
            {haritasiz && !pasif && (
              <span aria-hidden className="text-[9px] leading-[11px] font-extrabold opacity-80">
                harita yok
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Kendiliğinden kaybolan bildirim — Yapılacaklar'daki toast'ın kalıbı, bir
 * "Geri al" düğmesiyle. Pencere değil: art arda işaretlerken akışı kesmemeli.
 */
function BildirimSeridi({
  bildirim,
  ustte = false,
  onKapat,
}: {
  bildirim: Bildirim
  /** Konu kartı açıkken bildirim kartın altında kalmasın diye üstte çıkıyor. */
  ustte?: boolean
  onKapat: () => void
}) {
  return (
    <div
      data-yuzen
      className={cn(
        'pointer-events-none fixed inset-x-0 flex justify-center px-4',
        ustte
          ? 'top-[calc(var(--guvenli-ust)+0.5rem)] z-[80]'
          : 'bottom-[calc(5.5rem+var(--guvenli-alt))] z-40 tablet:right-[var(--ray)] tablet:bottom-[calc(1.5rem+var(--guvenli-alt))]',
      )}
    >
      <div
        role="status"
        className="acilir-giris pointer-events-auto flex max-w-md items-center gap-1 rounded-2xl bg-foreground py-1 pr-1 pl-4 text-background shadow-kart"
      >
        <p className="min-w-0 flex-1 py-2.5 text-[13.5px] font-bold">{bildirim.metin}</p>
        {bildirim.geriAl && (
          <button
            type="button"
            onClick={() => {
              bildirim.geriAl!()
              onKapat()
            }}
            className="min-h-11 shrink-0 rounded-xl px-3 text-[13.5px] font-extrabold text-primary-parlak transition active:bg-background/10"
          >
            Geri al
          </button>
        )}
      </div>
    </div>
  )
}
