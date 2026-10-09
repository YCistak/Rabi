'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarArrowUp, Check, Clock, MoreHorizontal, Pencil, Plus, Star, Timer, Trash2, X } from 'lucide-react'
import {
  EN_COK_GOREV,
  EN_UZUN_GOREV,
  GOREV_RENKLERI,
  KATEGORILER,
  KATEGORI_ADI,
  EN_UZUN_OZEL_KATEGORI,
  kategoriAdiGoster,
  ozelKategoriKirp,
  gununSiraliGorevleri,
  gunuYerVarMi,
  gorevEkle,
  kalanSure,
  SURE_SECENEKLERI,
  sureYaz,
  elleSure,
  gorevDuzenle,
  gorevErtele,
  gorevIsaretle,
  gorevRengi,
  gorevSil,
  gorevYildizla,
  metniKirp,
  saatKirp,
  type Gorev,
  type GorevDuzeni,
  type GorevKategorisi,
  type GorevRengi,
} from '@/lib/yapilacaklar'
import { bugun, cn, gunKaydir, tariheCevir, yeniId } from '@/lib/utils'
import { AY_ADLARI, HaftaSeridi, type GunIsareti } from '@/components/takvim'
import { useGeriKatmani } from '@/lib/geri'
import { useAsagiKaydirKapat } from '@/lib/asagi-kaydir'
import { Anahtar, BaslikSatiri, Buton, Onay, useKapatmaOnayi } from '@/components/ui'

/**
 * Yapılacaklar — hafta şeridi + günün görev listesi.
 *
 * Ekran eskiden sürüklenebilir not kâğıtlarından bir tahtaydı, sonra
 * Sabah/Öğle/Akşam bölümlerine ayrıldı; ikisinin de neden bırakıldığı
 * `lib/yapilacaklar.ts` başında yazıyor. Şimdi: üstte haftanın yedi günü,
 * altında günün tek listesi (saatliler saate göre üstte), görev eklemek
 * alttan açılan bir sayfada. Saat isteğe bağlı.
 *
 * Görev **düzenlenebiliyor, erteleniyor ve siliniyor**; üçü satırdaki "⋯"nün
 * açtığı alt sayfada (`GorevEylemleri`). Satırda yalnızca tik ve yıldız
 * duruyor — neden, `GorevSatiri`nin başında.
 */

/** Toast ekranda ne kadar duruyor. Okunacak tek cümle, uzatmak gerekmiyor. */
const MESAJ_SURESI = 2400

export function YapilacaklarEkrani({
  gorevler,
  setGorevler,
  tanitim,
  onPomodoroBaslat,
  gorevIzniIste,
}: {
  gorevler: Gorev[]
  setGorevler: (guncelleyici: Gorev[] | ((onceki: Gorev[]) => Gorev[])) => void
  /**
   * "Pomodoro ile çalış" işaretli görevin satırındaki sayaç düğmesi: Pomodoro
   * ekranını açıp turu başlatıyor (`AppShell`). Verilmezse düğme çizilmiyor.
   */
  onPomodoroBaslat?: (gorev: Gorev) => void
  /**
   * Saat girilen görevde bildirim izni (`lib/bildirim.ts`): "5 dakika önce"
   * hatırlatması izinsiz gelmiyor. Verilmezse (ayar kapalı, tur) sorulmuyor;
   * `null` dönerse ortamda bildirim yok (web), form sessiz kalıyor.
   */
  gorevIzniIste?: () => Promise<boolean | null>
  /**
   * Yapılacaklar turu: ekleme sayfası ve ⋯ menüsü kullanıcının dokunuşuna
   * değil turun adımına bağlı (`gorevFormuTurdaAcik`, `gorevMenusuTurdaAcik`).
   * "+" ve ⋯ yalnızca tura bildiriyor, kapatma bir önceki adıma döndürüyor.
   * Kaydet görevi **gerçekten** ekliyor ve tura bildiriyor (`gorevKaydedildi`).
   */
  tanitim?: {
    formAcik: boolean
    formuAc: () => void
    formuKapat: () => void
    gorevKaydedildi: () => void
    menuAcik: boolean
    menuyuAc: () => void
    menuyuKapat: () => void
  }
}) {
  const bugunIso = bugun()
  const [secili, setSecili] = useState(bugunIso)
  /** Açık ekleme/düzenleme sayfası; düzenlemedeyse düzenlenen görev. */
  const [sayfa, setSayfa] = useState<{ gorev?: Gorev } | null>(null)
  /** Onay bekleyen erteleme ve silme. */
  const [ertelenecek, setErtelenecek] = useState<Gorev | null>(null)
  const [silinecek, setSilinecek] = useState<Gorev | null>(null)
  /** "⋯" ile açılan işlem sayfasının görevi. */
  const [eylemli, setEylemli] = useState<Gorev | null>(null)
  const [mesaj, setMesaj] = useState<string | null>(null)
  /**
   * Turda eklenen görevin kimliği: turun sonraki adımları (Pomodoro düğmesi,
   * ⋯ menüsü) bu görevin satırını aydınlatıyor. Gün doluysa ekleme olmuyor;
   * o zaman listenin ilk görevi kullanılıyor (`turSatiri`).
   */
  const [turGorevId, setTurGorevId] = useState<string | null>(null)

  /*
    Geçmiş gün salt okunur: dün yapılmamış işi bugün işaretlemek geçmişi
    düzeltmek olur. Erteleme varken buna gerek de yok.
  */
  const gecmis = secili < bugunIso

  const isaretler = useMemo(() => {
    const harita = new Map<string, GunIsareti>()
    for (const g of gorevler) harita.set(g.gun, { nokta: 'is' })
    return harita
  }, [gorevler])

  /** Seçili günün görevleri: saatliler saate göre üstte, saatsizler altta. */
  const isler = gununSiraliGorevleri(gorevler, secili)
  const yerVar = gunuYerVarMi(gorevler, secili)

  const seciliTarih = tariheCevir(secili)
  const gunEtiketi =
    secili === bugunIso
      ? 'Bugün'
      : secili === gunKaydir(bugunIso, 1)
        ? 'Yarın'
        : secili === gunKaydir(bugunIso, -1)
          ? 'Dün'
          : `${seciliTarih.getDate()} ${AY_ADLARI[seciliTarih.getMonth()]}`

  /** Toast. Üst üste gelen mesajlar birbirini eziyor, kuyruğa girmiyor. */
  const soyle = (metin: string) => {
    setMesaj(metin)
    window.setTimeout(() => setMesaj((o) => (o === metin ? null : o)), MESAJ_SURESI)
  }

  const kaydet = (duzen: GorevDuzeni, duzenlenen?: Gorev) => {
    if (duzenlenen) {
      const sonuc = gorevDuzenle(gorevler, duzenlenen.id, duzen)
      if (sonuc) setGorevler(sonuc)
      setSayfa(null)
      soyle('Görev güncellendi.')
      return
    }
    const id = yeniId()
    const sonuc = gorevEkle(gorevler, { id, gun: secili, ...duzen })
    if (!sonuc) {
      soyle(`Bu günün listesi dolu (${EN_COK_GOREV} görev).`)
      // Turda dolu gün kilitlemesin: tur listedeki ilk görevle sürüyor.
      if (tanitim) tanitim.gorevKaydedildi()
      return
    }
    setGorevler(sonuc)
    setSayfa(null)
    soyle('Listeye eklendi.')
    if (tanitim) {
      setTurGorevId(id)
      tanitim.gorevKaydedildi()
    }
  }

  /** Ekleme sayfası; turda yalnızca tura bildiriliyor, sayfayı adım açıyor. */
  const sayfaAc = () => {
    if (tanitim) tanitim.formuAc()
    else setSayfa({})
  }
  /*
    Turda sayfanın açıklığı yalnızca adımdan geliyor: `sayfa` kullanılsaydı
    tur bitince (prop kalkınca) adımın kapattığı sayfa yeniden belirirdi.
  */
  const formGorunur = tanitim ? tanitim.formAcik : sayfa !== null
  /** Turun Pomodoro ve ⋯ adımlarında aydınlanan satır. */
  const turSatiri = tanitim ? (isler.find((g) => g.id === turGorevId) ?? isler[0] ?? null) : null
  /** Turda ⋯ menüsü adıma bağlı; tur bitince (prop kalkınca) kendiliğinden kapanıyor. */
  const menuGorevi = tanitim ? (tanitim.menuAcik ? turSatiri : null) : eylemli

  const ertele = (gorev: Gorev) => {
    const sonuc = gorevErtele(gorevler, gorev.id)
    if (!sonuc) {
      soyle(`Ertesi günün listesi dolu (${EN_COK_GOREV} görev).`)
      return
    }
    setGorevler(sonuc)
    soyle('Görev ertesi güne ertelendi.')
  }

  return (
    // Yatay tablette hafta şeridi solda, günün listesi sağda
    // (`tablet-sutunlar`; başlık iki sütunu kaplıyor).
    <div className="tablet-sutunlar">
      <BaslikSatiri arac="notlar" baslik="Yapılacaklar" />

      {/* Yedi günlük şerit her zaman bugünü ortalar; nokta "o günde iş var". */}
      <HaftaSeridi
        secili={secili}
        onSec={setSecili}
        bugunIso={bugunIso}
        isaretler={isaretler}
        // Geçmiş gün salt okunur: oradaki iş artık yapılacak bir şey değil.
        solukMu={(iso) => iso < bugunIso}
      />

      {/* Günün tek listesi için sade bir yüzey; görev kartları öne çıkar. */}
      <div data-tanitim="gorev-listesi" className="mx-1 mt-3.5 rounded-[20px] border border-border bg-card/60 px-2.5 pb-3.5 pt-4">
        <section>
          <div className="flex items-center gap-2 px-0.5 pb-2">
            <h2 className="shrink-0 font-display text-[15px] font-extrabold tracking-tight">
              {gunEtiketi}
            </h2>
            <span aria-hidden className="h-px flex-1 bg-border" />
            {/* Kalan süre: günde daha ne kadar iş var. Biten görevler
                düşüyor, hepsi bitince sayı da kalkıyor. */}
            {kalanSure(isler) > 0 && (
              <span className="rakam shrink-0 text-[11px] font-bold text-muted-foreground">
                {sureYaz(kalanSure(isler))}
              </span>
            )}
            {/* Sayaç kalan yeri söylüyor; geçmiş günde yazılacak bir şey
                olmadığı için orada anlamı yok. */}
            {!gecmis && isler.length > 0 && (
              <span className="rakam shrink-0 text-[11px] font-bold text-muted-foreground/70">
                {isler.length}/{EN_COK_GOREV}
              </span>
            )}
            {!gecmis && (
              <button
                type="button"
                data-tanitim="gorev-ekle"
                onClick={sayfaAc}
                // Turda dolu günde de basılabilir: pasif düğme turu "+" adımında
                // kilitlerdi; kayıt dolu olunca tur listedeki ilk görevle sürüyor.
                disabled={!yerVar && !tanitim}
                aria-label="Görev ekle"
                // Görsel 36 piksel; `::after` dokunma alanını 44'e çıkarıyor.
                className="relative grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary transition after:absolute after:-inset-1 active:scale-95 disabled:opacity-40 disabled:active:scale-100"
              >
                <Plus size={18} strokeWidth={2.8} aria-hidden />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {isler.map((gorev) => (
              <GorevSatiri
                key={gorev.id}
                gorev={gorev}
                gecmis={gecmis}
                onIsaretle={() => setGorevler((o) => gorevIsaretle(o, gorev.id))}
                onYildiz={() => setGorevler((o) => gorevYildizla(o, gorev.id))}
                onEylemler={() => (tanitim ? gorev === turSatiri && tanitim.menuyuAc() : setEylemli(gorev))}
                onPomodoro={onPomodoroBaslat && (() => onPomodoroBaslat(gorev))}
                turSatiri={gorev === turSatiri}
              />
            ))}

            {isler.length === 0 &&
              (gecmis ? (
                <p className="rounded-[14px] border border-dashed border-border bg-card/70 px-3.5 py-3 text-center text-[12.5px] font-bold text-muted-foreground/80">
                  Bu gün için plan yoktu.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={sayfaAc}
                  className="w-full rounded-[14px] border-[1.5px] border-dashed border-border bg-card/70 px-3.5 py-3 text-center text-[12.5px] font-bold text-muted-foreground transition active:border-primary active:text-primary"
                >
                  + Görev ekle
                </button>
              ))}
          </div>
        </section>
      </div>

      {/* Toast: ertelenen görev ekrandan kayboluyor, nereye gittiğini söyleyen
          tek yer bu. Alt menünün üstünde duruyor. */}
      {mesaj !== null && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+var(--guvenli-alt))] z-40 flex justify-center px-6 tablet:right-[var(--ray)] tablet:bottom-[calc(1.5rem+var(--guvenli-alt))]">
          <p className="acilir-giris max-w-md rounded-2xl bg-foreground px-4 py-3 text-center text-[13.5px] font-bold text-background shadow-kart">
            {mesaj}
          </p>
        </div>
      )}

      {formGorunur && (
        <EklemeSayfasi
          duzenlenen={tanitim ? undefined : sayfa?.gorev}
          gunEtiketi={gunEtiketi}
          onKapat={() => (tanitim ? tanitim.formuKapat() : setSayfa(null))}
          onKaydet={(duzen) => kaydet(duzen, tanitim ? undefined : sayfa?.gorev)}
          gorevIzniIste={gorevIzniIste}
          turda={!!tanitim}
        />
      )}

      {menuGorevi !== null && (
        <GorevEylemleri
          gorev={menuGorevi}
          onKapat={() => (tanitim ? tanitim.menuyuKapat() : setEylemli(null))}
          onDuzenle={() => setSayfa({ gorev: menuGorevi })}
          onErtele={() => setErtelenecek(menuGorevi)}
          onSil={() => setSilinecek(menuGorevi)}
        />
      )}

      {/* Erteleme bir dokunuşla oluyordu ve görev o an ekrandan kayboluyordu;
          yanlışlıkla basan kullanıcı işini yarının listesinde arıyordu.
          Kullanıcı önce sorulmasını istedi. Geri alınabilen bir iş, düğme
          kırmızı değil. */}
      <Onay
        acik={ertelenecek !== null}
        baslik="Yarına ertelensin mi?"
        aciklama={
          ertelenecek
            ? `"${ertelenecek.metin}" yarının listesine taşınacak.`
            : ''
        }
        onayMetni="Ertele"
        tehlikeli={false}
        onOnayla={() => ertelenecek && ertele(ertelenecek)}
        onIptal={() => setErtelenecek(null)}
      />

      <Onay
        acik={silinecek !== null}
        baslik="Görev silinsin mi?"
        aciklama={silinecek ? `"${silinecek.metin}" listeden kalkacak.` : ''}
        onOnayla={() => silinecek && setGorevler((o) => gorevSil(o, silinecek.id))}
        onIptal={() => setSilinecek(null)}
      />
    </div>
  )
}

/**
 * Tek görev satırı: tik, kategori + iş adı, yıldız ve "⋯".
 *
 * Satırda iki düğme var, dört değil. Yıldız, düzenle, ertele ve sil bir süre
 * kategorinin satırında yan yana dört küçük simgeydi: işin **üstünde** bir
 * düğme sırası, 32 piksellik hedefler, simgeden anlaşılmayan eylemler (ok
 * "ertele" demiyordu) ve kaleme yapışık bir çöp kutusu. Kullanıcı dizilimi
 * kötü buldu. Yıldız satırda kaldı çünkü bir eylem değil görevin **hâli** —
 * bakınca görülmeli. Öteki üçü seyrek yapılan işler ve "⋯"nün açtığı alt
 * sayfada adlarıyla duruyor (`GorevEylemleri`); sil orada en altta ve kırmızı.
 */
function GorevSatiri({
  gorev,
  gecmis,
  onIsaretle,
  onYildiz,
  onEylemler,
  onPomodoro,
  turSatiri = false,
}: {
  gorev: Gorev
  gecmis: boolean
  onIsaretle: () => void
  onYildiz: () => void
  onEylemler: () => void
  /** Yalnızca "Pomodoro ile çalış" işaretli, bitmemiş görevde çiziliyor. */
  onPomodoro?: () => void
  /** Yapılacaklar turunun aydınlattığı satır (`data-tanitim` hedefleri). */
  turSatiri?: boolean
}) {
  const renk = gorevRengi(gorev.renk)
  const pomodoroVar = !gecmis && !gorev.bitti && gorev.pomodoro === true && !!onPomodoro

  return (
    <div
      // Pomodoro düğmesi yoksa (kullanıcı formda kapattı) tur satırın kendisini gösteriyor.
      data-tanitim={turSatiri && !pomodoroVar ? 'gorev-satir-pomodoro' : undefined}
      className={cn(
        'flex items-center gap-2.5 rounded-[16px] border border-border bg-card py-2.5 pl-3 pr-1 transition-opacity',
        gorev.bitti ? 'opacity-55' : 'shadow-kart',
      )}
    >
      <button
        type="button"
        onClick={onIsaretle}
        disabled={gecmis}
        aria-pressed={gorev.bitti}
        aria-label={gorev.bitti ? 'Bitmedi olarak işaretle' : 'Bitti olarak işaretle'}
        className={cn(
          'grid size-[26px] shrink-0 place-items-center rounded-full border-2 transition',
          gorev.bitti
            ? 'border-success bg-success text-white'
            : 'border-border bg-card text-transparent',
        )}
      >
        <Check size={12} strokeWidth={3.2} aria-hidden />
      </button>

      <div className="min-w-0 flex-1">
        <span
          className="flex min-w-0 items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.06em]"
          style={{ color: renk }}
        >
          {/* Saat kategorinin önünde ve ön plan renginde: listenin sırası
              ondan geliyor, göz satırı onunla tarıyor. */}
          {gorev.saat !== null ? (
            <span className="rakam shrink-0 text-foreground">{gorev.saat}</span>
          ) : (
            <span aria-hidden className="size-1.5 shrink-0 rounded-full" style={{ background: renk }} />
          )}
          <span className="truncate">{kategoriAdiGoster(gorev)}</span>
          {gorev.sure !== null && <span className="rakam shrink-0">· {sureYaz(gorev.sure)}</span>}
        </span>
        {/* Tek satır: metin sınırı karakterle tutuluyor (`EN_UZUN_GOREV`), bu
            da taşmaya karşı son emniyet — büyük harfli görev sınıra uysa da
            piksele sığmayabiliyor. */}
        <span
          className={cn(
            'mt-0.5 block truncate text-[14.5px] font-bold leading-snug',
            gorev.bitti && 'line-through',
          )}
        >
          {gorev.metin}
        </span>
      </div>

      {/*
        Sayaç düğmesi yalnızca "Pomodoro ile çalış" işaretli görevde: her
        satırda olsaydı tek satırlık iş adı her görevde daralırdı (bkz.
        `EN_UZUN_GOREV`). İşaretli görevde ad biraz erken kırpılabiliyor —
        `truncate` orada son emniyet.
      */}
      {pomodoroVar && onPomodoro && (
        <SatirDugmesi etiket="Pomodoro ile başlat" onClick={onPomodoro} className="text-primary" tanitim={turSatiri ? 'gorev-satir-pomodoro' : undefined}>
          <Timer size={19} strokeWidth={2.4} aria-hidden />
        </SatirDugmesi>
      )}
      {/* Bitmiş görevin önceliği bir şey söylemiyor; geçmiş gün salt okunur. */}
      {!gecmis && !gorev.bitti && (
        <SatirDugmesi
          etiket={gorev.yildiz ? 'Önceliği kaldır' : 'Öncelikli yap'}
          basili={gorev.yildiz}
          onClick={onYildiz}
          className={gorev.yildiz ? 'text-isl-ok' : undefined}
        >
          <Star size={18} fill={gorev.yildiz ? 'currentColor' : 'none'} aria-hidden />
        </SatirDugmesi>
      )}
      {!gecmis && (
        <SatirDugmesi etiket="Diğer işlemler" onClick={onEylemler} tanitim={turSatiri ? 'gorev-eylem-ac' : undefined}>
          <MoreHorizontal size={19} strokeWidth={2.4} aria-hidden />
        </SatirDugmesi>
      )}
    </div>
  )
}

/** Satırın sağındaki düğme; dokunma hedefi 40 piksel. */
function SatirDugmesi({
  etiket,
  basili,
  onClick,
  className,
  tanitim,
  children,
}: {
  etiket: string
  basili?: boolean
  onClick: () => void
  className?: string
  /** Tur hedefi (`data-tanitim`). */
  tanitim?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      data-tanitim={tanitim}
      onClick={onClick}
      aria-label={etiket}
      aria-pressed={basili}
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground transition active:bg-muted',
        className,
      )}
    >
      {children}
    </button>
  )
}

/**
 * "⋯"nün açtığı alt sayfa: görevin adı ve işlemleri.
 *
 * Bitmiş görevde yalnızca sil var: bitmiş işi ertelemek ya da düzenlemek bir
 * şey değiştirmiyor. Seçim sayfayı kapatıyor; ertele ve sil yine kendi onay
 * penceresinden geçiyor (yanlış dokunuşla kaybolan görev kuralı).
 */
function GorevEylemleri({
  gorev,
  onKapat,
  onDuzenle,
  onErtele,
  onSil,
}: {
  gorev: Gorev
  onKapat: () => void
  onDuzenle: () => void
  onErtele: () => void
  onSil: () => void
}) {
  useGeriKatmani(true, onKapat)
  const kaydir = useAsagiKaydirKapat(onKapat)
  const sec = (eylem: () => void) => () => {
    onKapat()
    eylem()
  }

  return (
    <div
      className="katman-zemin fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onKapat}
    >
      <div
        ref={kaydir}
        data-tanitim="gorev-eylemleri"
        className="alt-pencere-girisi w-full max-w-md rounded-t-[26px] bg-card px-[18px] pt-2 pb-[calc(1.25rem+var(--guvenli-alt))]"
        onClick={(olay) => olay.stopPropagation()}
      >
        <div className="flex justify-center pt-1.5 pb-3">
          <span className="h-[5px] w-[42px] rounded-[3px] bg-border" />
        </div>
        <p className="truncate px-1 pb-3 font-display text-[17px] font-extrabold tracking-tight">
          {gorev.metin}
        </p>
        <div className="flex flex-col gap-2">
          {!gorev.bitti && (
            <>
              <EylemSatiri
                simge={<Pencil size={18} strokeWidth={2.3} aria-hidden />}
                onClick={sec(onDuzenle)}
              >
                Düzenle
              </EylemSatiri>
              <EylemSatiri
                simge={<CalendarArrowUp size={18} strokeWidth={2.3} aria-hidden />}
                onClick={sec(onErtele)}
              >
                Yarına ertele
              </EylemSatiri>
            </>
          )}
          <EylemSatiri
            simge={<Trash2 size={18} strokeWidth={2.3} aria-hidden />}
            onClick={sec(onSil)}
            tehlikeli
          >
            Sil
          </EylemSatiri>
        </div>
      </div>
    </div>
  )
}

function EylemSatiri({
  simge,
  onClick,
  tehlikeli,
  children,
}: {
  simge: React.ReactNode
  onClick: () => void
  tehlikeli?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[15px] font-bold transition active:brightness-95',
        tehlikeli ? 'mt-1 bg-danger-soft text-danger' : 'bg-muted/70 text-foreground',
      )}
    >
      {simge}
      {children}
    </button>
  )
}

/**
 * "Görev ekle" alt sayfası.
 *
 * Sorular: ne, saat kaçta (isteğe bağlı), ortalama kaç dakika, hangi tür,
 * hangi renk. Süre de **isteğe bağlı** — bir süre zorunluydu, kullanıcı
 * kaldırılmasını istedi: kısa bir iş için tahmin uydurmak, eklemeyi
 * uzatıyordu.
 *
 * Saat ikincil: alan kapalı bir "Saat ekle" düğmesi olarak duruyor ve tek
 * dokunuşla telefonun kendi saat seçicisini açıyor (`<input type="time">`;
 * iOS'ta çark, Android'de saat kadranı). Görevlerin çoğu "gün içinde bir
 * ara" yapılıyor; açık duran boş bir saat kutusu her eklemede doldurulması
 * gereken bir alan gibi görünürdü. Gün etiketi başlıkta yazıyor: görevin
 * nereye gideceği görünmeden kaydetmek, onu ekranda aratırdı. Kaydet, eksik alan varken **pasif** ve eksikler kırmızı
 * çerçeveyle işaretleniyor: pasif bir düğmenin yanında sebebi yazmayan ekran
 * kullanıcıyı formda kilitler (AGENTS.md, "Boş kutuyla ilerlenmiyor").
 */
function EklemeSayfasi({
  duzenlenen,
  gunEtiketi,
  onKapat,
  onKaydet,
  gorevIzniIste,
  turda = false,
}: {
  /** Verilirse sayfa bu görevi düzenliyor, alanlar onun değerleriyle açılıyor. */
  duzenlenen?: Gorev
  gunEtiketi: string
  onKapat: () => void
  onKaydet: (duzen: GorevDuzeni) => void
  gorevIzniIste?: () => Promise<boolean | null>
  /** Yapılacaklar turunda açıldı: Pomodoro anahtarı açık başlıyor. */
  turda?: boolean
}) {
  const [metin, setMetin] = useState(duzenlenen?.metin ?? '')
  /** Saat kutusunun ham değeri; boşsa görev saatsiz. */
  const [saat, setSaat] = useState(duzenlenen?.saat ?? '')
  /** Saat alanı açık mı — düzenlenen görevin saati varsa açık geliyor. */
  const [saatAcik, setSaatAcik] = useState((duzenlenen?.saat ?? null) !== null)
  /** "Saat ekle"ye basılınca seçici bir kez açılsın diye. */
  const seciciAcilsin = useRef(false)
  const saatKutusu = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!saatAcik || !seciciAcilsin.current) return
    seciciAcilsin.current = false
    const kutu = saatKutusu.current
    if (!kutu) return
    kutu.focus()
    // `showPicker` eski WebView'da yok ya da kullanıcı hareketi dışında
    // reddediliyor; o durumda kutu açık ve odakta kalıyor, bir dokunuş yetiyor.
    try {
      kutu.showPicker?.()
    } catch {
      /* yok sayılıyor */
    }
  }, [saatAcik])
  /*
    Bildirim izni saat girilince soruluyor, uygulama açılırken değil: izin
    penceresi "neden?" sorusunun cevabı ekrandayken anlamlı. İzin zaten
    verildiyse pencere açılmıyor; reddedildiyse görev yine kaydediliyor,
    yalnızca hatırlatma kurulmuyor ve saatin altında bunu söyleyen bir not
    çıkıyor. Sayfa başına bir kez.
  */
  const izinSoruldu = useRef(false)
  const [izinYok, setIzinYok] = useState(false)
  const saatGirildi = saatKirp(saat) !== null
  useEffect(() => {
    if (!saatGirildi || !gorevIzniIste || izinSoruldu.current) return
    izinSoruldu.current = true
    // İptal edilmiyor: izin penceresi açıkken saat silinirse cevap yine
    // yazılmalı, yoksa saat geri girildiğinde not çıkmazdı.
    void gorevIzniIste().then((izinli) => setIzinYok(izinli === false))
  }, [saatGirildi, gorevIzniIste])
  /*
    İki kaynak, tek cevap: çip ya da kutu. Birine dokunmak ötekini
    temizliyor; ikisi birden dolu kalsaydı hangisinin kaydedileceği ekranda
    okunmazdı.
  */
  const ilkSure = duzenlenen?.sure ?? null
  const ilkHazir = ilkSure !== null && SURE_SECENEKLERI.includes(ilkSure)
  const [hazirSure, setHazirSure] = useState<number | null>(ilkHazir ? ilkSure : null)
  const [elle, setElle] = useState(ilkSure !== null && !ilkHazir ? String(ilkSure) : '')
  const sure = elle !== '' ? elleSure(elle) : hazirSure
  const [kategori, setKategori] = useState<GorevKategorisi | null>(duzenlenen?.kategori ?? null)
  // "Diğer"de yazılan ad **zorunlu**. Bir süre isteğe bağlıydı ("Diğer" zaten
  // geçerli bir kategori diye); kullanıcı zorunlu olmasını istedi — listede
  // "DİĞER" yazan bir görev ne olduğunu söylemiyordu.
  const [ozelKategori, setOzelKategori] = useState(duzenlenen?.ozelKategori ?? '')
  const [renk, setRenk] = useState<GorevRengi | null>(duzenlenen?.renk ?? null)
  /**
   * "Pomodoro ile çalış" — kapalı başlıyor; düzenlemede görevin kendi değeri.
   * Turda açık başlıyor: turun sonraki adımı satırdaki Pomodoro düğmesini
   * gösteriyor (kullanıcı kapatabilir; o zaman tur satırı gösteriyor).
   */
  const [pomodoro, setPomodoro] = useState(duzenlenen?.pomodoro === true || (turda && !duzenlenen))
  const [hata, setHata] = useState(false)

  useGeriKatmani(true, onKapat)
  const kaydir = useAsagiKaydirKapat(onKapat)
  // Yalnız görev metni değiştiyse sorar; seçimler birkaç dokunuşla geri gelir.
  const kapatmaOnayi = useKapatmaOnayi({
    aciklama: duzenlenen
      ? 'Yaptığın değişiklikler kaydedilmeden pencere kapanır.'
      : 'Görev eklenmeden pencere kapanır.',
  })

  const yazilan = metniKirp(metin)
  const ozelEksik = kategori === 'diger' && ozelKategoriKirp(ozelKategori) === undefined
  const gecerli = yazilan !== '' && kategori !== null && !ozelEksik && renk !== null

  const gonder = () => {
    if (!gecerli) {
      setHata(true)
      return
    }
    onKaydet({
      metin: yazilan,
      saat: saatKirp(saat),
      kategori,
      ozelKategori: kategori === 'diger' ? ozelKategoriKirp(ozelKategori) : undefined,
      renk,
      sure,
      pomodoro,
    })
  }

  return (
    <div
      className="katman-zemin fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onKapat}
    >
      {kapatmaOnayi.pencere}
      <div
        ref={kaydir}
        data-tanitim="gorev-formu"
        className="alt-pencere-girisi max-h-[88%] w-full max-w-md overflow-y-auto rounded-t-[26px] bg-card px-[18px] pt-2 pb-[calc(1.5rem+var(--guvenli-alt))]"
        onClick={(olay) => olay.stopPropagation()}
      >
        <div className="flex justify-center pt-1.5 pb-3">
          <span className="h-[5px] w-[42px] rounded-[3px] bg-border" />
        </div>

        <div className="mb-3.5 flex items-center gap-2.5">
          <p className="font-display text-lg font-extrabold tracking-tight">
            {duzenlenen ? 'Görevi düzenle' : 'Görev ekle'}
          </p>
          <p className="ml-auto text-[12.5px] font-bold text-muted-foreground">
            {gunEtiketi}
          </p>
          <button
            type="button"
            onClick={() =>
              metin !== (duzenlenen?.metin ?? '') ? kapatmaOnayi.sor(onKapat) : onKapat()
            }
            aria-label="Kapat"
            // Görsel 36 piksel; `::after` dokunma alanını 44'e çıkarıyor.
            className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-muted/70 text-muted-foreground transition after:absolute after:-inset-1 active:brightness-95"
          >
            <X size={16} strokeWidth={2.4} aria-hidden />
          </button>
        </div>

        <div>
          <AlanBasligi
            baslik="Ne yapacaksın?"
            // Sayaç sınırı görünür kılıyor: yazarken kesilen bir kutu, bozuk
            // görünüyor. Sınırın kendisi satırın genişliğinden geliyor.
            sayac={`${yazilan.length}/${EN_UZUN_GOREV}`}
            hata={hata && yazilan === '' ? 'Bir iş yaz' : undefined}
          />
          <input
            value={metin}
            onChange={(olay) => setMetin(olay.target.value.slice(0, EN_UZUN_GOREV))}
            maxLength={EN_UZUN_GOREV}
            placeholder="Tek satırlık bir iş yaz"
            className={cn(
              'h-[52px] w-full rounded-[16px] border bg-background px-3.5 text-[15px] font-bold outline-none transition placeholder:font-semibold placeholder:text-muted-foreground/70 focus-visible:border-primary-parlak focus-visible:bg-card',
              hata && yazilan === '' ? 'border-danger' : 'border-input',
            )}
          />
        </div>

        {/* Saat isteğe bağlı ve kapalı başlıyor: tek dokunuşla telefonun saat
            seçicisi açılıyor. Çarpı saati siler, görev saatsiz kalır. */}
        <div>
          <AlanBasligi baslik="Saat" sayac="isteğe bağlı" />
          {saatAcik ? (
            <div className="flex items-center gap-2">
              <label className="flex h-[46px] min-w-0 flex-1 items-center gap-2.5 rounded-[12px] border-[1.5px] border-primary-parlak bg-card px-3.5 text-primary">
                <Clock size={17} strokeWidth={2.4} aria-hidden className="shrink-0" />
                <input
                  ref={saatKutusu}
                  type="time"
                  value={saat}
                  onChange={(olay) => setSaat(olay.target.value)}
                  aria-label="Görevin saati"
                  className="rakam h-full min-w-0 flex-1 bg-transparent text-[15px] font-extrabold text-foreground outline-none"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setSaat('')
                  setSaatAcik(false)
                }}
                aria-label="Saati kaldır"
                className="grid size-[46px] shrink-0 place-items-center rounded-[12px] bg-muted/70 text-muted-foreground transition active:brightness-95"
              >
                <X size={17} strokeWidth={2.4} aria-hidden />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                seciciAcilsin.current = true
                setSaatAcik(true)
              }}
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-dashed border-border bg-card text-[13.5px] font-extrabold text-muted-foreground transition active:border-primary active:text-primary"
            >
              <Clock size={16} strokeWidth={2.4} aria-hidden />
              Saat ekle
            </button>
          )}
          {izinYok && saatGirildi && (
            <p className="mt-1.5 px-0.5 text-[11.5px] font-bold text-muted-foreground">
              Bildirim izni kapalı, bu görev için hatırlatma gelmez.
            </p>
          )}
        </div>

        {/* Varsayılan seçili gelmiyor: seçili bir "30 dk", kullanıcının hiç
            vermediği bir tahmini onun adına kaydederdi. Seçili çipe yeniden
            dokunmak seçimi kaldırıyor — alan isteğe bağlı ve boş bırakmanın
            bir yolu olmalı. */}
        <AlanBasligi baslik="Ortalama kaç dakika sürer?" sayac="isteğe bağlı" />
        <div className="grid grid-cols-6 gap-1">
          {SURE_SECENEKLERI.map((dk) => (
            <SecimDugmesi
              key={dk}
              secili={elle === '' && hazirSure === dk}
              onClick={() => {
                setElle('')
                setHazirSure((onceki) => (onceki === dk ? null : dk))
              }}
              etiket={`${dk} dakika`}
              className="rakam px-0.5 text-[13px]"
            >
              {dk}
            </SecimDugmesi>
          ))}
          <input
            value={elle}
            onChange={(olay) => {
              setHazirSure(null)
              setElle(olay.target.value.replace(/\D/g, '').slice(0, 3))
            }}
            inputMode="numeric"
            maxLength={3}
            placeholder="dk"
            aria-label="Süreyi dakika olarak yaz"
            className={cn(
              'rakam h-[46px] w-full min-w-0 rounded-[12px] border-[1.5px] bg-card px-1 text-center text-sm font-extrabold outline-none transition placeholder:font-bold placeholder:text-muted-foreground/60',
              elle !== ''
                ? 'border-primary-parlak text-primary'
                : 'border-border focus-visible:border-primary-parlak',
            )}
          />
        </div>

        {/*
          İsteğe bağlı ve kapalı: açıksa görevin satırında Pomodoro'yu tek
          dokunuşla başlatan sayaç düğmesi çıkıyor. Süre verildiyse sayaç o
          süreyle, verilmediyse Pomodoro'nun kendi çalışma süresiyle başlıyor.
        */}
        <button
          type="button"
          role="switch"
          aria-checked={pomodoro}
          onClick={() => setPomodoro((o) => !o)}
          className="mt-4 flex min-h-[52px] w-full items-center gap-3 rounded-[16px] border-[1.5px] border-border bg-card px-3.5 py-2 text-left transition active:bg-muted"
        >
          <Timer size={18} strokeWidth={2.4} aria-hidden className={pomodoro ? 'text-primary' : 'text-muted-foreground'} />
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-extrabold">Pomodoro ile çalış</span>
            <span className="block text-[11.5px] font-bold text-muted-foreground">
              {sure !== null ? `Satırdan ${sure} dakikalık sayaç başlar` : 'Satırdan Pomodoro sayacı başlar'}
            </span>
          </span>
          <Anahtar acik={pomodoro} />
        </button>

        <AlanBasligi baslik="Kategori" hata={hata && kategori === null ? 'Birini seç' : undefined} />
        <div
          className={cn(
            'grid grid-cols-5 gap-1 rounded-2xl',
            hata && kategori === null && 'outline-2 outline-offset-[3px] outline-danger/45',
          )}
        >
          {KATEGORILER.map((k) => (
            <SecimDugmesi
              key={k}
              secili={kategori === k}
              onClick={() => setKategori(k)}
              className="px-0.5 text-[12.5px]"
            >
              {KATEGORI_ADI[k]}
            </SecimDugmesi>
          ))}
        </div>
        {kategori === 'diger' && (
          <>
            <AlanBasligi
              baslik="Kategorinin adı"
              sayac={`${ozelKategori.trim().length}/${EN_UZUN_OZEL_KATEGORI}`}
              hata={hata && ozelEksik ? 'Bir ad yaz' : undefined}
            />
            <input
              value={ozelKategori}
              onChange={(olay) => setOzelKategori(olay.target.value.slice(0, EN_UZUN_OZEL_KATEGORI))}
              maxLength={EN_UZUN_OZEL_KATEGORI}
              placeholder="Kendi kategorini yaz"
              aria-label="Özel kategori adı"
              aria-required
              className={cn(
                'h-11 w-full rounded-[14px] border bg-background px-3.5 text-[14px] font-bold outline-none transition placeholder:font-semibold placeholder:text-muted-foreground/70 focus-visible:border-primary-parlak focus-visible:bg-card',
                hata && ozelEksik ? 'border-danger' : 'border-input',
              )}
            />
          </>
        )}

        <AlanBasligi baslik="Renk" hata={hata && renk === null ? 'Bir renk seç' : undefined} />
        <div
          className={cn(
            'grid grid-cols-6 justify-items-center gap-x-1 gap-y-2.5 rounded-2xl p-1',
            hata && renk === null && 'outline-2 outline-offset-[3px] outline-danger/45',
          )}
        >
          {GOREV_RENKLERI.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRenk(r.id)}
              aria-pressed={renk === r.id}
              aria-label={r.ad}
              title={r.ad}
              className="grid size-11 place-items-center rounded-full text-white transition"
              style={{
                background: gorevRengi(r.id),
                boxShadow:
                  renk === r.id
                    ? `0 0 0 3px var(--card), 0 0 0 5px ${gorevRengi(r.id)}`
                    : undefined,
              }}
            >
              <Check
                size={18}
                strokeWidth={3}
                aria-hidden
                className={renk === r.id ? 'opacity-100' : 'opacity-0'}
              />
            </button>
          ))}
        </div>

        {/*
          Düğme eksik alanda **soluk ama basılabilir**: basmak hangi alanın
          eksik olduğunu kırmızıyla gösteriyor. Tümüyle pasif olsaydı ekran
          kullanıcıya sebebini hiç söylemezdi (AGENTS.md, "Boş kutuyla
          ilerlenmiyor": pasif düğmenin yanında sebep yazmalı).
        */}
        <Buton
          onClick={gonder}
          aria-disabled={!gecerli}
          className={cn('mt-[18px] h-[54px] w-full rounded-[17px] text-base', !gecerli && 'opacity-45')}
        >
          Kaydet
        </Buton>
      </div>
    </div>
  )
}

/** Alt sayfadaki alan başlığı: solda ad, sağda sayaç ya da hata. */
function AlanBasligi({
  baslik,
  sayac,
  hata,
}: {
  baslik: string
  /** Karakter sayacı gibi bilgilendirici not. */
  sayac?: string
  /** Eksik alan uyarısı — sayacın yerine kırmızı yazıyor. */
  hata?: string
}) {
  return (
    <div className="mt-4 mb-1.5 flex items-center justify-between">
      <span className="text-[11.5px] font-extrabold uppercase tracking-[0.05em] text-muted-foreground">
        {baslik}
      </span>
      {hata !== undefined ? (
        <span className="text-xs font-extrabold text-danger">{hata}</span>
      ) : (
        sayac !== undefined && (
          <span className="rakam text-xs font-extrabold text-muted-foreground/70">{sayac}</span>
        )
      )}
    </div>
  )
}

/** Alt sayfadaki seçim düğmesi. */
function SecimDugmesi({
  secili,
  onClick,
  etiket,
  className,
  children,
}: {
  secili: boolean
  onClick: () => void
  /** Görünen yazı tek başına yetmediğinde ekran okuyucunun okuduğu ad ("45" → "45 dakika"). */
  etiket?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={secili}
      aria-label={etiket}
      className={cn(
        'h-[46px] whitespace-nowrap rounded-[12px] border-[1.5px] text-sm font-extrabold transition',
        secili
          ? 'border-primary-parlak bg-primary-parlak text-white'
          : 'border-border bg-card text-foreground active:bg-muted',
        className,
      )}
    >
      {children}
    </button>
  )
}
