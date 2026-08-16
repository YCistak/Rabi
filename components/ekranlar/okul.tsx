'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Plus, Trash2, X } from 'lucide-react'
import {
  Alan,
  BaslikSatiri,
  BosDurum,
  Buton,
  Deger,
  Etiket,
  Kart,
  Onay,
  SecmeliAlan,
} from '@/components/ui'
import {
  SINIFLAR,
  agirlikliOrtalama,
  dersYilSonuNotu,
  donemOrtalamasi,
  netYaz,
  obpTahmini,
  yilSayisiYaz,
} from '@/lib/hesap'
import { dersOnerileriniSuz } from '@/lib/dersler'
import { BOS_DONEM } from '@/lib/depo'
import { cn, yeniId } from '@/lib/utils'
import type { Ayarlar, DonemNotlari, GecmisYil, OkulDersi } from '@/lib/types'
import { Rabi } from '@/components/maskot/rabi'

function notYaz(deger: number | null): string {
  return deger === null ? '—' : netYaz(deger, deger % 1 === 0 ? 0 : 2)
}

const NOT_ALANLARI: { anahtar: keyof DonemNotlari; etiket: string }[] = [
  { anahtar: 'yazili1', etiket: '1. Yazılı' },
  { anahtar: 'yazili2', etiket: '2. Yazılı' },
  { anahtar: 'sozlu1', etiket: '1. Sözlü' },
  { anahtar: 'sozlu2', etiket: '2. Sözlü' },
]

/** Tek not kutusu. Boş bırakılan not ortalamaya katılmaz. */
function NotKutusu({
  etiket,
  deger,
  onDegis,
}: {
  etiket: string
  deger: number | null
  onDegis: (deger: number | null) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{etiket}</span>
      <Alan
        inputMode="numeric"
        // Placeholder yok: boş kutuda "—" ile imleç üst üste binip artı gibi görünüyordu
        value={deger === null ? '' : String(deger)}
        onChange={(e) => {
          const temiz = e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
          if (temiz === '') {
            onDegis(null)
            return
          }
          const sayi = Number.parseInt(temiz, 10)
          onDegis(Math.min(100, sayi))
        }}
        className="h-10 px-1 text-center text-[15px] rakam"
      />
    </label>
  )
}

/** Haftalık ders saati elle yazılmaz, buradan seçilir. */
const SAAT_SECENEKLERI = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function SaatSecici({
  deger,
  onDegis,
}: {
  deger: number | null
  onDegis: (saat: number) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {SAAT_SECENEKLERI.map((saat) => (
        <button
          key={saat}
          type="button"
          onClick={() => onDegis(saat)}
          aria-pressed={saat === deger}
          className={cn(
            'h-10 w-10 rounded-xl text-sm font-medium transition rakam',
            saat === deger
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {saat}
        </button>
      ))}
    </div>
  )
}

/** Bir dönemin bütün notları. */
function DonemBolumu({
  baslik,
  donem,
  projeVar,
  onDegis,
}: {
  baslik: string
  donem: DonemNotlari
  projeVar: boolean
  onDegis: (donem: DonemNotlari) => void
}) {
  const ortalama = donemOrtalamasi(donem, projeVar)

  return (
    <div className="rounded-xl bg-muted/50 p-3">
      <div className="mb-2.5 flex items-baseline justify-between">
        <p className="text-sm font-semibold">{baslik}</p>
        <p className="text-xs text-muted-foreground">
          ortalama{' '}
          <span className="font-display text-sm font-semibold text-foreground rakam">
            {notYaz(ortalama)}
          </span>
        </p>
      </div>

      {/* Yazılılar üst satır, sözlüler alt satır; proje varsa sağda dikey ortalı */}
      <div className="flex items-center gap-2">
        <div className="grid flex-1 grid-cols-2 gap-2">
          {NOT_ALANLARI.map(({ anahtar, etiket }) => (
            <NotKutusu
              key={anahtar}
              etiket={etiket}
              deger={donem[anahtar]}
              onDegis={(deger) => onDegis({ ...donem, [anahtar]: deger })}
            />
          ))}
        </div>

        {projeVar && (
          <div className="w-1/4 shrink-0 border-l border-border/60 pl-2">
            <NotKutusu
              etiket="Proje"
              deger={donem.proje}
              onDegis={(deger) => onDegis({ ...donem, proje: deger })}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function OkulEkrani({
  dersler,
  setDersler,
  gecmisYillar,
  setGecmisYillar,
  ayarlar,
  hazir,
}: {
  dersler: OkulDersi[]
  setDersler: (guncelleyici: OkulDersi[] | ((onceki: OkulDersi[]) => OkulDersi[])) => void
  gecmisYillar: GecmisYil[]
  setGecmisYillar: (
    guncelleyici: GecmisYil[] | ((onceki: GecmisYil[]) => GecmisYil[]),
  ) => void
  ayarlar: Ayarlar
  hazir: boolean
}) {
  const [acikId, setAcikId] = useState<string | null>(null)
  const [silinecek, setSilinecek] = useState<OkulDersi | null>(null)
  const [yeniAd, setYeniAd] = useState('')
  const [yeniSaat, setYeniSaat] = useState<number | null>(null)
  const [yeniProje, setYeniProje] = useState(false)
  /** 'liste' ana görünüm, 'ekle' tam ekran ders ekleme (Yeni Deneme ekranıyla aynı kalıp). */
  const [gorunum, setGorunum] = useState<'liste' | 'ekle'>('liste')
  const [yillarAcik, setYillarAcik] = useState(false)
  const [yilSinif, setYilSinif] = useState<number | null>(null)
  const [yilOrtalama, setYilOrtalama] = useState('')

  const buYil = useMemo(() => agirlikliOrtalama(dersler), [dersler])
  const obp = useMemo(() => obpTahmini(buYil.ortalama, gecmisYillar), [buYil, gecmisYillar])

  // Zaten eklenmiş dersler öneri listesinden düşer
  const onerilenDersler = useMemo(
    () => dersOnerileriniSuz(yeniAd, dersler.map((d) => d.ad)),
    [yeniAd, dersler],
  )

  /**
   * Geçmiş yıl olarak yalnızca bulunduğun sınıftan önceki sınıflar girilebilir:
   * 11. sınıftaysan 9 ve 10. Bu yılın notu zaten ders listesinden hesaplanıyor,
   * 12. sınıf ise henüz okunmadı.
   */
  const eklenebilirSiniflar = useMemo(() => {
    const girilenler = new Set(gecmisYillar.map((y) => y.sinif))
    return SINIFLAR.filter((s) => s < ayarlar.buYilSinif && !girilenler.has(s))
  }, [gecmisYillar, ayarlar.buYilSinif])

  const dersEkle = () => {
    const ad = yeniAd.trim()
    if (!ad || yeniSaat === null) return

    const ders: OkulDersi = {
      id: yeniId(),
      ad,
      haftalikSaat: yeniSaat,
      projeVar: yeniProje,
      donem1: { ...BOS_DONEM },
      donem2: { ...BOS_DONEM },
    }
    setDersler((onceki) => [...onceki, ders])
    setYeniAd('')
    setYeniSaat(null)
    setYeniProje(false)
    setGorunum('liste')
    setAcikId(ders.id)
  }

  const formuKapat = () => {
    setYeniAd('')
    setYeniSaat(null)
    setYeniProje(false)
    setGorunum('liste')
  }

  const dersGuncelle = (id: string, degistir: (ders: OkulDersi) => OkulDersi) => {
    setDersler((onceki) => onceki.map((d) => (d.id === id ? degistir(d) : d)))
  }

  const yilEkle = () => {
    const ortalama = Number.parseFloat(yilOrtalama.replace(',', '.'))
    if (yilSinif === null || !eklenebilirSiniflar.includes(yilSinif)) return
    if (!Number.isFinite(ortalama) || ortalama < 0 || ortalama > 100) return

    setGecmisYillar((onceki) =>
      [...onceki, { id: yeniId(), sinif: yilSinif, ortalama }].sort(
        (a, b) => a.sinif - b.sinif,
      ),
    )
    setYilSinif(null)
    setYilOrtalama('')
  }

  if (!hazir) return <div className="h-40 animate-pulse rounded-2xl bg-muted" />

  // Ders ekleme kendi ekranında açılır — liste ekranının altında form belirmez
  if (gorunum === 'ekle') {
    return (
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold tracking-tight">Ders Ekle</h1>
          <Buton bicim="hayalet" boy="simge" onClick={formuKapat} aria-label="Vazgeç">
            <X size={20} />
          </Buton>
        </div>

        <Kart className="mb-4">
          <Etiket htmlFor="ders-ad">Ders adı</Etiket>
          <SecmeliAlan
            id="ders-ad"
            autoFocus
            deger={yeniAd}
            onDegis={setYeniAd}
            oneriler={onerilenDersler}
            placeholder="Listeden seç ya da kendin yaz"
          />

          <div className="mt-4">
            <Etiket>Haftalık ders saati</Etiket>
            <SaatSecici deger={yeniSaat} onDegis={setYeniSaat} />
            <p className="mt-2 text-xs text-muted-foreground">
              Haftada kaç saat okuduğunu seç. Saati çok olan ders, yıl sonu ortalamanı
              daha çok etkiler.
            </p>
          </div>

          <label className="mt-4 flex items-center gap-2.5 rounded-xl bg-muted/60 px-3 py-3 text-sm">
            <input
              type="checkbox"
              checked={yeniProje}
              onChange={(e) => setYeniProje(e.target.checked)}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            Bu dersten proje aldım (2. döneme eklenir)
          </label>
        </Kart>

        <div className="flex gap-2">
          <Buton bicim="ikincil" className="flex-1" onClick={formuKapat}>
            Vazgeç
          </Buton>
          <Buton
            className="flex-1"
            onClick={dersEkle}
            disabled={!yeniAd.trim() || yeniSaat === null}
          >
            <Plus size={18} />
            Ekle
          </Buton>
        </div>
      </div>
    )
  }

  return (
    <div>
      <BaslikSatiri baslik="Okul Notları" aciklama={`${ayarlar.buYilSinif}. sınıf`} />

      <Kart className="mb-3 border-primary/30 bg-primary-soft/50">
        <p className="text-sm font-medium text-muted-foreground">OBP tahmini</p>
        <p className="font-display text-5xl font-semibold text-primary">
          {obp ? netYaz(obp.obp, obp.obp % 1 === 0 ? 0 : 2) : '—'}
        </p>
        {obp ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Diploma notu {notYaz(obp.diplomaNotu)} × 5.{' '}
            {obp.tamMi
              ? 'Dört yılın hepsi girili, tahmin değil gerçek OBP.'
              : `Dört yılın ${yilSayisiYaz(obp.girilenYil)} girili; kalan yıllarda da bu ortalamayı tutturursan bu puanı alırsın.`}
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            Ders ekleyip notlarını girdiğinde burada hesaplanır.
          </p>
        )}
      </Kart>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <Deger
          etiket="Bu yılın ortalaması"
          deger={notYaz(buYil.ortalama)}
          altNot={`${buYil.dersSayisi} ders · haftada ${buYil.toplamSaat} saat`}
        />
        <Deger
          etiket="Girilen yıl"
          deger={`${obp ? obp.girilenYil : 0} / 4`}
          altNot={obp?.tamMi ? 'dört yıl tamam' : 'geçmiş yıllar + bu yıl'}
        />
      </div>

      <p className="mb-2 font-display text-lg font-semibold">Dersler</p>

      {dersler.length === 0 ? (
        <BosDurum
          simge={<Rabi durum="uykulu" boyut={96} />}
          baslik="Kayıtlı ders yok"
          aciklama="Derslerini ekleyip yazılı ve sözlü notlarını gir; yıl sonu ortalaman ve OBP tahminin kendiliğinden hesaplansın."
          eylem={
            <Buton onClick={() => setGorunum('ekle')}>
              <Plus size={18} />
              Ders ekle
            </Buton>
          }
        />
      ) : (
        <ul className="space-y-2">
          {dersler.map((ders) => {
            const acik = acikId === ders.id
            const yilSonu = dersYilSonuNotu(ders)

            return (
              <li key={ders.id}>
                <Kart className="p-0">
                  <button
                    type="button"
                    onClick={() => setAcikId(acik ? null : ders.id)}
                    className="flex w-full items-center gap-3 p-3.5 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{ders.ad}</p>
                      <p className="text-xs text-muted-foreground">
                        haftada {ders.haftalikSaat} saat
                        {ders.projeVar ? ' · proje var' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-semibold rakam">
                        {notYaz(yilSonu)}
                      </p>
                      <p className="text-xs text-muted-foreground">yıl sonu</p>
                    </div>
                    <ChevronDown
                      size={18}
                      className={cn(
                        'shrink-0 text-muted-foreground transition-transform',
                        acik && 'rotate-180',
                      )}
                    />
                  </button>

                  {acik && (
                    <div className="space-y-2.5 px-3.5 pb-3.5">
                      {/* Proje yalnızca 2. dönemde verilir; 1. dönemde proje kutusu çıkmaz */}
                      <DonemBolumu
                        baslik="1. Dönem"
                        donem={ders.donem1}
                        projeVar={false}
                        onDegis={(donem1) => dersGuncelle(ders.id, (d) => ({ ...d, donem1 }))}
                      />
                      <DonemBolumu
                        baslik="2. Dönem"
                        donem={ders.donem2}
                        projeVar={ders.projeVar}
                        onDegis={(donem2) => dersGuncelle(ders.id, (d) => ({ ...d, donem2 }))}
                      />

                      <div className="border-t border-border/60 pt-3">
                        <p className="mb-1.5 text-xs text-muted-foreground">
                          Haftalık ders saati
                        </p>
                        <SaatSecici
                          deger={ders.haftalikSaat}
                          onDegis={(saat) =>
                            dersGuncelle(ders.id, (d) => ({ ...d, haftalikSaat: saat }))
                          }
                        />

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={ders.projeVar}
                              onChange={(e) =>
                                dersGuncelle(ders.id, (d) => ({
                                  ...d,
                                  projeVar: e.target.checked,
                                }))
                              }
                              className="h-4 w-4 accent-[var(--primary)]"
                            />
                            2. dönemde proje aldım
                          </label>

                          <Buton bicim="tehlike" boy="kucuk" onClick={() => setSilinecek(ders)}>
                            <Trash2 size={15} />
                            Sil
                          </Buton>
                        </div>
                      </div>
                    </div>
                  )}
                </Kart>
              </li>
            )
          })}
        </ul>
      )}

      {dersler.length > 0 && (
        <Buton bicim="ikincil" className="mt-3 w-full" onClick={() => setGorunum('ekle')}>
          <Plus size={18} />
          Ders ekle
        </Buton>
      )}

      <Kart className="mt-3 p-0">
        <button
          type="button"
          onClick={() => setYillarAcik((onceki) => !onceki)}
          className="flex w-full items-center gap-3 p-4 text-left"
        >
          <div className="min-w-0 flex-1">
            <p className="font-medium">Geçmiş yıllar</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {gecmisYillar.length > 0
                ? `${gecmisYillar.length} yıl kayıtlı · OBP dört yılın ortalamasından çıkar`
                : 'Alt sınıflarda aldığın yıl sonu ortalamaları'}
            </p>
          </div>
          <ChevronDown
            size={18}
            className={cn(
              'shrink-0 text-muted-foreground transition-transform',
              yillarAcik && 'rotate-180',
            )}
          />
        </button>

        <div className={cn('px-4 pb-4', !yillarAcik && 'hidden')}>
        {gecmisYillar.length > 0 && (
          <ul className="mb-3 space-y-1.5">
            {gecmisYillar.map((yil) => (
              <li
                key={yil.id}
                className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm"
              >
                <span>{yil.sinif}. sınıf</span>
                <span className="flex items-center gap-3">
                  <span className="font-display font-semibold rakam">
                    {notYaz(yil.ortalama)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setGecmisYillar((onceki) => onceki.filter((y) => y.id !== yil.id))
                    }
                    aria-label={`${yil.sinif}. sınıf kaydını sil`}
                    className="text-muted-foreground active:text-danger"
                  >
                    <X size={16} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        {eklenebilirSiniflar.length === 0 ? (
          <p className="rounded-lg bg-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
            {ayarlar.buYilSinif === 9
              ? '9. sınıftasın, senden önce geçmiş bir lise yılın yok. Sınıf atladığında burası açılır.'
              : `${ayarlar.buYilSinif}. sınıftan önceki bütün yılları girdin.`}
          </p>
        ) : (
          <>
            <Etiket>Hangi sınıfın notu?</Etiket>
            <div className="mb-3 flex flex-wrap gap-2">
              {eklenebilirSiniflar.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setYilSinif(s)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium transition',
                    s === yilSinif
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {s}. sınıf
                </button>
              ))}
            </div>

            <Etiket htmlFor="yil-ortalama">Yıl sonu ortalaması</Etiket>
            <Alan
              id="yil-ortalama"
              inputMode="decimal"
              value={yilOrtalama}
              onChange={(e) => setYilOrtalama(e.target.value.replace(/[^0-9.,]/g, ''))}
              placeholder="87,5"
              className="rakam"
              onKeyDown={(e) => {
                if (e.key === 'Enter') yilEkle()
              }}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Karnendeki yıl sonu başarı puanı. E-Okul'da &quot;Yıl Sonu Başarı Puanı&quot;
              olarak yazar.
            </p>

            <Buton
              bicim="ikincil"
              className="mt-3 w-full"
              onClick={yilEkle}
              disabled={yilSinif === null || !yilOrtalama}
            >
              <Plus size={18} />
              {yilSinif === null ? 'Yıl ekle' : `${yilSinif}. sınıfı ekle`}
            </Buton>
          </>
        )}
        </div>
      </Kart>

      <Onay
        acik={silinecek !== null}
        baslik="Ders silinsin mi?"
        aciklama={`"${silinecek?.ad}" dersi ve girdiğin bütün notları silinecek.`}
        onOnayla={() =>
          silinecek && setDersler((onceki) => onceki.filter((d) => d.id !== silinecek.id))
        }
        onIptal={() => setSilinecek(null)}
      />
    </div>
  )
}
