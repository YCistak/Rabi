'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronRight, Plus, Star, Trash2, X } from 'lucide-react'
import {
  DILIMLER,
  DILIM_ADI,
  EN_COK_GOREV,
  EN_UZUN_GOREV,
  GOREV_RENKLERI,
  KATEGORILER,
  KATEGORI_ADI,
  bekleyenGorev,
  dilimGorevleri,
  dilimeYerVarMi,
  gorevEkle,
  kalanSure,
  SURE_SECENEKLERI,
  sureYaz,
  gorevErtele,
  gorevIsaretle,
  gorevRengi,
  gorevSil,
  gorevYildizla,
  gununGorevleri,
  metniKirp,
  simdikiDilim,
  type Gorev,
  type GorevDilimi,
  type GorevKategorisi,
  type GorevRengi,
} from '@/lib/yapilacaklar'
import { bugun, cn, gunKaydir, tariheCevir, tariheYaz, yeniId } from '@/lib/utils'
import { useGeriKatmani } from '@/lib/geri'
import { BaslikSatiri, Buton, Kart } from '@/components/ui'

/**
 * Yapılacaklar — hafta şeridi + günün üç dilimi.
 *
 * Ekran eskiden sürüklenebilir not kâğıtlarından bir tahtaydı; neden listeye
 * döndüğü `lib/yapilacaklar.ts` başında yazıyor. Buradaki düzen tasarımın
 * kendisi (`tasarim/yapilacaklar-v3.dc.html`): üstte haftanın yedi günü, altında
 * noktalı kâğıt üstünde Sabah/Öğle/Akşam bölümleri, görev eklemek alttan
 * açılan bir sayfada.
 *
 * Görev metni **düzenlenemiyor**, yalnızca silinip yeniden yazılıyor: satır tek
 * satırlık bir iş adı taşıyor ve yirmi sekiz karakteri düzeltmek, her satıra
 * ikinci bir kalem düğmesi koymaktan hızlı.
 */

/** `getDay()` sırasına göre değil, pazartesiden başlayan hafta sırası. */
const GUN_ADLARI = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

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

/** Toast ekranda ne kadar duruyor. Okunacak tek cümle, uzatmak gerekmiyor. */
const MESAJ_SURESI = 2400

export function YapilacaklarEkrani({
  gorevler,
  setGorevler,
}: {
  gorevler: Gorev[]
  setGorevler: (guncelleyici: Gorev[] | ((onceki: Gorev[]) => Gorev[])) => void
}) {
  const bugunIso = bugun()
  const [secili, setSecili] = useState(bugunIso)
  /** Açık ekleme sayfası — hangi dilime ekleneceğini de taşıyor. */
  const [eklenen, setEklenen] = useState<GorevDilimi | null>(null)
  const [mesaj, setMesaj] = useState<string | null>(null)

  /*
    Geçmiş gün salt okunur: dün yapılmamış işi bugün işaretlemek geçmişi
    düzeltmek olur. Erteleme varken buna gerek de yok.
  */
  const gecmis = secili < bugunIso
  const gununkiler = useMemo(() => gununGorevleri(gorevler, secili), [gorevler, secili])
  const bekleyen = bekleyenGorev(gununkiler)

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
        doluMu: gorevler.some((g) => g.gun === iso),
        gecmisMi: iso < bugunIso,
      }
    })
  }, [secili, gorevler, bugunIso])

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

  const kaydet = (yeni: {
    metin: string
    dilim: GorevDilimi
    kategori: GorevKategorisi
    renk: GorevRengi
    sure: number
  }) => {
    const sonuc = gorevEkle(gorevler, { id: yeniId(), gun: secili, ...yeni })
    if (!sonuc) {
      soyle(`${DILIM_ADI[yeni.dilim]} listesi dolu (${EN_COK_GOREV} görev).`)
      return
    }
    setGorevler(sonuc)
    setEklenen(null)
    soyle(`${DILIM_ADI[yeni.dilim]} listesine eklendi.`)
  }

  const ertele = (gorev: Gorev) => {
    const sonuc = gorevErtele(gorevler, gorev.id)
    if (!sonuc) {
      soyle(`Ertesi günün ${DILIM_ADI[gorev.dilim].toLocaleLowerCase('tr-TR')} listesi dolu.`)
      return
    }
    setGorevler(sonuc)
    soyle('Görev ertesi güne ertelendi.')
  }

  return (
    <div>
      <BaslikSatiri arac="notlar"
        baslik="Yapılacaklar"
        aciklama={
          gununkiler.length === 0
            ? gecmis
              ? 'O gün için plan yazılmamış'
              : 'Bu günün planı boş'
            : bekleyen === 0
              ? `${gununkiler.length} görev · hepsi bitti`
              : `${bekleyen} görev bekliyor`
        }
      />

      {/* Hafta şeridi — gün seçimi. Ay takvimi yok: kayıt yalnızca bu haftayı
          tutuyor (bkz. `haftaninGorevleri`), açılan takvim boş günler
          gösterirdi. */}
      <Kart className="rounded-[20px] px-2 pb-2 pt-2.5">
        <p className="mb-1.5 border-b border-dashed border-primary/25 px-1.5 pb-2 font-display text-[15px] font-extrabold tracking-tight">
          {AY_ADLARI[seciliTarih.getMonth()]} {seciliTarih.getFullYear()}
        </p>
        <div className="grid grid-cols-7 gap-1">
          {hafta.map((g) => {
            const seciliMi = g.iso === secili
            return (
              <button
                key={g.iso}
                type="button"
                onClick={() => setSecili(g.iso)}
                aria-pressed={seciliMi}
                aria-label={g.etiket}
                className={cn(
                  'flex h-[68px] flex-col items-center justify-center gap-1.5 rounded-[14px] transition-colors',
                  seciliMi ? 'bg-primary-parlak' : 'active:bg-muted/70',
                )}
              >
                <span
                  className={cn(
                    'text-[11px] font-bold',
                    seciliMi
                      ? 'text-white'
                      : g.gecmisMi
                        ? 'text-muted-foreground/60'
                        : 'text-muted-foreground',
                  )}
                >
                  {g.ad}
                </span>
                <span
                  className={cn(
                    'rakam text-[17px] font-extrabold leading-none',
                    seciliMi
                      ? 'text-white'
                      : g.gecmisMi
                        ? 'text-muted-foreground/60'
                        : 'text-foreground',
                  )}
                >
                  {g.sayi}
                </span>
                {/* Nokta "o günde iş var" diyor; geçmiş günde soluk, çünkü
                    oradaki iş artık yapılacak bir şey değil. */}
                <span
                  aria-hidden
                  className={cn(
                    'size-[5px] rounded-full',
                    !g.doluMu
                      ? 'bg-transparent'
                      : seciliMi
                        ? 'bg-white'
                        : g.gecmisMi
                          ? 'bg-muted-foreground/35'
                          : 'bg-primary-parlak',
                  )}
                />
              </button>
            )
          })}
        </div>
      </Kart>

      {/* Pano: üç dilim, noktalı kâğıt üstünde. */}
      <div className="gorev-panosu golge-kart mx-1 mt-3.5 flex flex-col gap-4 rounded-[22px] px-2.5 pb-3.5 pt-4">
        {DILIMLER.map((dilim) => {
          const isler = dilimGorevleri(gorevler, secili, dilim)
          const yerVar = dilimeYerVarMi(gorevler, secili, dilim)
          // Şimdiki dilim vurgulu: günün hangi yerinde olunduğu ekranda yazmıyor.
          const simdiki = !gecmis && dilim === (secili === bugunIso ? simdikiDilim(new Date().getHours()) : 'sabah')

          return (
            <section key={dilim}>
              <div className="flex items-center gap-2 px-0.5 pb-2">
                <h2 className="shrink-0 font-display text-[15px] font-extrabold tracking-tight">
                  {DILIM_ADI[dilim]}
                </h2>
                <span aria-hidden className="h-px flex-1 bg-border" />
                {/* Sayaç kalan yeri söylüyor; geçmiş günde yazılacak bir şey
                    olmadığı için orada da anlamı yok. */}
                {/* Kalan süre: dilimde daha ne kadar iş var. Biten görevler
                    düşüyor, hepsi bitince sayı da kalkıyor. */}
                {kalanSure(isler) > 0 && (
                  <span className="rakam shrink-0 text-[11px] font-bold text-muted-foreground">
                    {sureYaz(kalanSure(isler))}
                  </span>
                )}
                {!gecmis && isler.length > 0 && (
                  <span className="rakam shrink-0 text-[11px] font-bold text-muted-foreground/70">
                    {isler.length}/{EN_COK_GOREV}
                  </span>
                )}
                {/*
                  Ekleme düğmesi **her** dilimde duruyor.

                  Tasarım onu yalnızca içinde bulunulan dilime koyuyordu; o
                  zaman dolu ama sırası geçmiş bir bölüme ikinci bir görev
                  yazmanın yolu kalmıyor (boş bölümün kesikli düğmesi de
                  yalnızca boşken çıkıyor). Vurgu duruyor: şimdiki dilimin
                  düğmesi dolu turuncu, ötekiler sessiz.
                */}
                {!gecmis && (
                  <button
                    type="button"
                    onClick={() => setEklenen(dilim)}
                    disabled={!yerVar}
                    aria-label={`${DILIM_ADI[dilim]} için görev ekle`}
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-full transition active:scale-95 disabled:opacity-40 disabled:active:scale-100',
                      simdiki
                        ? 'bg-primary-parlak text-white shadow-[0_6px_14px_rgba(217,98,47,0.35)]'
                        : 'bg-primary-soft text-primary',
                    )}
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
                    onErtele={() => ertele(gorev)}
                    onSil={() => setGorevler((o) => gorevSil(o, gorev.id))}
                  />
                ))}

                {isler.length === 0 &&
                  (gecmis ? (
                    <p className="rounded-[14px] border border-dashed border-border bg-card/70 px-3.5 py-3 text-center text-[12.5px] font-bold text-muted-foreground/80">
                      {DILIM_ADI[dilim]} için plan yoktu.
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEklenen(dilim)}
                      className="w-full rounded-[14px] border-[1.5px] border-dashed border-border bg-card/70 px-3.5 py-3 text-center text-[12.5px] font-bold text-muted-foreground transition active:border-primary active:text-primary"
                    >
                      + {DILIM_ADI[dilim]} için görev ekle
                    </button>
                  ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Toast: ertelenen görev ekrandan kayboluyor, nereye gittiğini söyleyen
          tek yer bu. Alt menünün üstünde duruyor. */}
      {mesaj !== null && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+var(--guvenli-alt))] z-40 flex justify-center px-6">
          <p className="acilir-giris max-w-md rounded-2xl bg-foreground px-4 py-3 text-center text-[13.5px] font-bold text-background shadow-kart">
            {mesaj}
          </p>
        </div>
      )}

      {eklenen !== null && (
        <EklemeSayfasi
          dilim={eklenen}
          gunEtiketi={gunEtiketi}
          onKapat={() => setEklenen(null)}
          onKaydet={kaydet}
        />
      )}
    </div>
  )
}

/** Tek görev satırı: tik, kategori, iş adı ve eylemler. */
function GorevSatiri({
  gorev,
  gecmis,
  onIsaretle,
  onYildiz,
  onErtele,
  onSil,
}: {
  gorev: Gorev
  gecmis: boolean
  onIsaretle: () => void
  onYildiz: () => void
  onErtele: () => void
  onSil: () => void
}) {
  const renk = gorevRengi(gorev.renk)

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-[16px] border border-border bg-card py-2.5 pl-3 pr-1 transition-opacity',
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
          className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.06em]"
          style={{ color: renk }}
        >
          <span aria-hidden className="size-1.5 rounded-full" style={{ background: renk }} />
          {KATEGORI_ADI[gorev.kategori]}
          {/* Süre kategorinin satırında: iş adının satırı tek satırlık ve
              genişliği sayılı (`EN_UZUN_GOREV`), oraya sığmazdı. */}
          {gorev.sure !== null && <span className="rakam">· {sureYaz(gorev.sure)}</span>}
        </span>
        {/* Tek satır: metin sınırı karakterle tutuluyor (`EN_UZUN_GOREV`), bu
            da taşmaya karşı son emniyet — büyük harfli görev sınıra uysa da
            piksele sığmayabiliyor. */}
        <span
          className={cn(
            'block truncate text-[14.5px] font-bold leading-snug',
            gorev.bitti && 'line-through',
          )}
        >
          {gorev.metin}
        </span>
      </div>

      {!gecmis && !gorev.bitti && (
        <>
          <button
            type="button"
            onClick={onYildiz}
            aria-pressed={gorev.yildiz}
            aria-label="Öncelikli"
            className={cn(
              'grid size-7 shrink-0 place-items-center rounded-[10px] transition active:bg-muted',
              gorev.yildiz ? 'text-isl-ok' : 'text-muted-foreground',
            )}
          >
            <Star size={17} fill={gorev.yildiz ? 'currentColor' : 'none'} aria-hidden />
          </button>
          <button
            type="button"
            onClick={onErtele}
            aria-label="Ertesi güne ertele"
            className="grid size-7 shrink-0 place-items-center rounded-[10px] bg-muted text-muted-foreground transition active:brightness-95"
          >
            <ChevronRight size={16} strokeWidth={2.4} aria-hidden />
          </button>
        </>
      )}

      {!gecmis && gorev.bitti && (
        <button
          type="button"
          onClick={onSil}
          aria-label="Sil"
          className="grid size-7 shrink-0 place-items-center rounded-[10px] text-muted-foreground transition active:bg-danger-soft active:text-danger"
        >
          <Trash2 size={14} aria-hidden />
        </button>
      )}
    </div>
  )
}

/**
 * "Görev ekle" alt sayfası.
 *
 * Dört soru: ne, ortalama kaç dakika, hangi tür, hangi renk. Süre sonradan
 * geldi: dilimin başlığı kalan işin toplamını gösteriyor ve plan ancak
 * işlerin ne kadar süreceği bilinince plan oluyor. "Ne zaman?" sorulmuyor: dilim basılan
 * düğmenin bölümünden geliyor — kullanıcı "Akşam"ın düğmesine bastıysa cevabı
 * zaten verdi. Sayfada bir süre üç dilimlik bir seçici de duruyordu;
 * kullanıcı kaldırılmasını istedi, verilmiş bir cevabı ikinci kez soruyordu.
 * Dilim başlıktaki gün etiketinin yanında yazıyor: görevin nereye gideceği
 * görünmeden kaydetmek, onu ekranda aratırdı. Kaydet, eksik alan varken **pasif** ve eksikler kırmızı
 * çerçeveyle işaretleniyor: pasif bir düğmenin yanında sebebi yazmayan ekran
 * kullanıcıyı formda kilitler (AGENTS.md, "Boş kutuyla ilerlenmiyor").
 */
function EklemeSayfasi({
  dilim,
  gunEtiketi,
  onKapat,
  onKaydet,
}: {
  dilim: GorevDilimi
  gunEtiketi: string
  onKapat: () => void
  onKaydet: (yeni: {
    metin: string
    dilim: GorevDilimi
    kategori: GorevKategorisi
    renk: GorevRengi
    sure: number
  }) => void
}) {
  const [metin, setMetin] = useState('')
  const [sure, setSure] = useState<number | null>(null)
  const [kategori, setKategori] = useState<GorevKategorisi | null>(null)
  const [renk, setRenk] = useState<GorevRengi | null>(null)
  const [hata, setHata] = useState(false)

  useGeriKatmani(true, onKapat)

  const yazilan = metniKirp(metin)
  const gecerli = yazilan !== '' && sure !== null && kategori !== null && renk !== null

  const gonder = () => {
    if (!gecerli) {
      setHata(true)
      return
    }
    onKaydet({ metin: yazilan, dilim, kategori, renk, sure })
  }

  return (
    <div
      className="katman-zemin fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onKapat}
    >
      <div
        className="alt-pencere-girisi max-h-[88%] w-full max-w-md overflow-y-auto rounded-t-[26px] bg-card px-[18px] pt-2 pb-[calc(1.5rem+var(--guvenli-alt))]"
        onClick={(olay) => olay.stopPropagation()}
      >
        <div className="flex justify-center pt-1.5 pb-3">
          <span className="h-[5px] w-[42px] rounded-[3px] bg-border" />
        </div>

        <div className="mb-3.5 flex items-center gap-2.5">
          <p className="font-display text-lg font-extrabold tracking-tight">Görev ekle</p>
          <p className="ml-auto text-[12.5px] font-bold text-muted-foreground">
            {gunEtiketi} · {DILIM_ADI[dilim]}
          </p>
          <button
            type="button"
            onClick={onKapat}
            aria-label="Kapat"
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted/70 text-muted-foreground transition active:brightness-95"
          >
            <X size={16} strokeWidth={2.4} aria-hidden />
          </button>
        </div>

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

        {/* Varsayılan seçili gelmiyor: seçili bir "30 dk", kullanıcının hiç
            vermediği bir tahmini onun adına kaydederdi. */}
        <AlanBasligi
          baslik="Ortalama kaç dakika sürer?"
          hata={hata && sure === null ? 'Birini seç' : undefined}
        />
        <div
          className={cn(
            'grid grid-cols-6 gap-1 rounded-2xl',
            hata && sure === null && 'outline-2 outline-offset-[3px] outline-danger/45',
          )}
        >
          {SURE_SECENEKLERI.map((dk) => (
            <SecimDugmesi
              key={dk}
              secili={sure === dk}
              onClick={() => setSure(dk)}
              etiket={`${dk} dakika`}
              className="rakam px-0.5 text-[13px]"
            >
              {dk}
            </SecimDugmesi>
          ))}
        </div>

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
