'use client'

import { useRef, useState } from 'react'
import { ChevronDown, Copy, Download, FileUp, Moon, Plus, Sun, Trash2, X } from 'lucide-react'
import { Alan, BaslikSatiri, Buton, Cip, Etiket, Kart, Not, Onay } from '@/components/ui'
import { useTema } from '@/components/theme-provider'
import { SINIFLAR, egitimYili, katsayiYaz } from '@/lib/hesap'
import { toplamSoru } from '@/lib/sablonlar'
import { tumVeriyiSil, yedegiDogrula, yedegiUygula, yedekOlustur } from '@/lib/depo'
import { tumResimleriSil } from '@/lib/resim-depo'
import { cn, yeniId } from '@/lib/utils'
import type {
  Ayarlar,
  Deneme,
  Devamsizlik,
  GecmisYil,
  GunlukKayit,
  Hedef,
  KazanilanRozet,
  OkulDersi,
  PuanTuru,
  Sablon,
} from '@/lib/types'

const PUAN_TURU_ADI: Record<PuanTuru, string> = {
  say: 'Sayısal',
  ea: 'Eşit Ağırlık',
  soz: 'Sözel',
  dil: 'Dil',
}

const HAZIR_HEDEFLER = [100, 200, 300, 400, 500]

export function AyarlarEkrani({
  sablonlar,
  kayitliSablonlar,
  setKayitliSablonlar,
  ayarlar,
  setAyarlar,
  yedeklenecek,
}: {
  sablonlar: Sablon[]
  kayitliSablonlar: Sablon[]
  setKayitliSablonlar: (guncelleyici: Sablon[] | ((onceki: Sablon[]) => Sablon[])) => void
  ayarlar: Ayarlar
  setAyarlar: (guncelleyici: Ayarlar | ((onceki: Ayarlar) => Ayarlar)) => void
  /** Yedeğe girecek bütün veri — fotoğraflar hariç. */
  yedeklenecek: {
    denemeler: Deneme[]
    okulDersleri: OkulDersi[]
    gecmisYillar: GecmisYil[]
    gunlukKayitlar: GunlukKayit[]
    devamsizlik: Devamsizlik[]
    rozetler: KazanilanRozet[]
    hedef: Hedef | null
  }
}) {
  const { tema, temaDegistir } = useTema()
  const [acikSablonId, setAcikSablonId] = useState<string | null>(null)
  const [silinecekSablon, setSilinecekSablon] = useState<Sablon | null>(null)
  const [sifirlamaAcik, setSifirlamaAcik] = useState(false)
  const [durum, setDurum] = useState<string | null>(null)
  const [hedefMetni, setHedefMetni] = useState(String(ayarlar.gunlukHedef))
  const dosyaRef = useRef<HTMLInputElement>(null)

  const yedekJson = () =>
    JSON.stringify(
      yedekOlustur({ ...yedeklenecek, sablonlar: kayitliSablonlar, ayarlar }),
      null,
      2,
    )

  const dosyayaIndir = () => {
    const bag = URL.createObjectURL(new Blob([yedekJson()], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = bag
    link.download = `rabi-yedek-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(bag)
    setDurum('Yedek dosyası indirildi (İndirilenler klasörüne bak).')
  }

  const geriYukle = (ham: string) => {
    const sonuc = yedegiDogrula(ham)
    if ('hata' in sonuc) {
      setDurum(sonuc.hata)
      return
    }
    yedegiUygula(sonuc.yedek)
    setDurum('Yedek yüklendi, uygulama yenileniyor…')
    setTimeout(() => window.location.reload(), 600)
  }

  const sablonGuncelle = (id: string, degistir: (sablon: Sablon) => Sablon) => {
    setKayitliSablonlar((onceki) => onceki.map((s) => (s.id === id ? degistir(s) : s)))
  }

  const sablonKopyala = (kaynak: Sablon) => {
    const kopya: Sablon = {
      ...kaynak,
      id: yeniId(),
      ad: `${kaynak.ad} (kopya)`,
      hazir: false,
      dersler: kaynak.dersler.map((d) => ({ ...d })),
    }
    setKayitliSablonlar((onceki) => [...onceki, kopya])
    setAcikSablonId(kopya.id)
  }

  return (
    <div>
      <BaslikSatiri baslik="Ayarlar" />

      <Kart className="mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Koyu tema</p>
            <p className="text-xs text-muted-foreground">
              {tema === 'koyu' ? 'Etkin' : 'Kapalı'}
            </p>
          </div>
          <Buton
            bicim="ikincil"
            boy="simge"
            onClick={() => temaDegistir(tema === 'koyu' ? 'acik' : 'koyu')}
            aria-label="Temayı değiştir"
          >
            {tema === 'koyu' ? <Sun size={18} /> : <Moon size={18} />}
          </Buton>
        </div>
      </Kart>

      <Kart className="mb-3">
        <p className="mb-2 font-medium">Günlük soru hedefim</p>
        <div className="flex flex-wrap gap-2">
          {HAZIR_HEDEFLER.map((h) => (
            <Cip
              key={h}
              secili={ayarlar.gunlukHedef === h}
              onClick={() => {
                setAyarlar((o) => ({ ...o, gunlukHedef: h }))
                setHedefMetni(String(h))
              }}
            >
              {h}
            </Cip>
          ))}
        </div>

        <Etiket className="mt-4">Kendin yaz</Etiket>
        <Alan
          inputMode="numeric"
          value={hedefMetni}
          onChange={(e) => {
            const temiz = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
            setHedefMetni(temiz)
            const sayi = Number(temiz)
            if (sayi > 0) setAyarlar((o) => ({ ...o, gunlukHedef: sayi }))
          }}
          className="h-10"
        />
      </Kart>

      <Kart className="mb-3">
        <p className="mb-2 font-medium">Alanım</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PUAN_TURU_ADI) as PuanTuru[]).map((tur) => (
            <Cip
              key={tur}
              secili={ayarlar.puanTuru === tur}
              onClick={() => setAyarlar((o) => ({ ...o, puanTuru: tur }))}
            >
              {PUAN_TURU_ADI[tur]}
            </Cip>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Sıralama tahmini bu puan türüne göre hesaplanır.
        </p>
      </Kart>

      <Kart className="mb-3">
        <p className="mb-2 font-medium">Sınıfım</p>
        <div className="flex flex-wrap gap-2">
          {SINIFLAR.map((sinif) => (
            <Cip
              key={sinif}
              secili={sinif === ayarlar.buYilSinif}
              onClick={() =>
                setAyarlar((onceki) => ({
                  ...onceki,
                  buYilSinif: sinif,
                  // Elle seçim, bulunduğumuz ders yılına sabitlenir; otomatik
                  // ilerleme bundan sonraki eylülde devreye girer
                  sinifYili: egitimYili(),
                }))
              }
            >
              {sinif}. sınıf
            </Cip>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Her eylülde bir üst sınıfa kendiliğinden geçer, 12'de durur.
        </p>
      </Kart>

      <Kart className="mb-3">
        <p className="mb-2 font-medium">Varsayılan deneme türü</p>
        <div className="flex flex-wrap gap-2">
          {sablonlar.map((s) => (
            <Cip
              key={s.id}
              secili={s.id === ayarlar.varsayilanSablonId}
              onClick={() => setAyarlar((onceki) => ({ ...onceki, varsayilanSablonId: s.id }))}
            >
              {s.ad}
            </Cip>
          ))}
        </div>
      </Kart>

      <Kart className="mb-3 p-0">
        <div className="p-4 pb-2">
          <p className="font-medium">Deneme şablonları</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Hazır şablonlar değiştirilemez; kopyalayıp kendi ders dağılımını kurabilirsin.
          </p>
        </div>

        <ul>
          {sablonlar.map((sablon) => {
            const acik = acikSablonId === sablon.id

            return (
              <li key={sablon.id} className="border-t border-border">
                <button
                  type="button"
                  onClick={() => setAcikSablonId(acik ? null : sablon.id)}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{sablon.ad}</p>
                    <p className="text-xs text-muted-foreground">
                      {sablon.dersler.length} ders · {toplamSoru(sablon)} soru ·{' '}
                      {katsayiYaz(sablon.yanlisKatsayi)}
                      {sablon.hazir ? ' · hazır' : ''}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn(
                      'shrink-0 text-muted-foreground transition-transform',
                      acik && 'rotate-180',
                    )}
                  />
                </button>

                {acik && (
                  <div className="px-4 pb-4">
                    {sablon.hazir ? (
                      <>
                        <ul className="mb-3 space-y-1 text-sm text-muted-foreground">
                          {sablon.dersler.map((d) => (
                            <li key={d.id} className="flex justify-between">
                              <span>{d.ad}</span>
                              <span className="rakam">{d.soruSayisi} soru</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mb-3 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                          Net hesabı: {katsayiYaz(sablon.yanlisKatsayi)}.
                        </p>
                        <Buton
                          bicim="ikincil"
                          boy="kucuk"
                          className="w-full"
                          onClick={() => sablonKopyala(sablon)}
                        >
                          <Copy size={15} />
                          Kopyala ve düzenle
                        </Buton>
                      </>
                    ) : (
                      <>
                        <div className="mb-3 flex gap-2">
                          <div className="flex-1">
                            <Etiket>Şablon adı</Etiket>
                            <Alan
                              value={sablon.ad}
                              onChange={(e) =>
                                sablonGuncelle(sablon.id, (s) => ({ ...s, ad: e.target.value }))
                              }
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="w-20">
                            <Etiket>Yanlış</Etiket>
                            <Alan
                              inputMode="numeric"
                              value={String(sablon.yanlisKatsayi)}
                              onChange={(e) => {
                                const katsayi = Number.parseInt(
                                  e.target.value.replace(/[^0-9]/g, ''),
                                  10,
                                )
                                sablonGuncelle(sablon.id, (s) => ({
                                  ...s,
                                  yanlisKatsayi: Number.isFinite(katsayi) ? katsayi : 4,
                                }))
                              }}
                              className="rakam h-9 text-center text-sm"
                            />
                          </div>
                        </div>

                        <p className="mb-3 text-xs text-muted-foreground">
                          {katsayiYaz(sablon.yanlisKatsayi)}.
                        </p>

                        <ul className="mb-2 space-y-1.5">
                          {sablon.dersler.map((ders, indeks) => (
                            <li key={ders.id} className="flex items-center gap-2">
                              <Alan
                                value={ders.ad}
                                onChange={(e) =>
                                  sablonGuncelle(sablon.id, (s) => ({
                                    ...s,
                                    dersler: s.dersler.map((d, i) =>
                                      i === indeks ? { ...d, ad: e.target.value } : d,
                                    ),
                                  }))
                                }
                                className="h-9 flex-1 text-sm"
                              />
                              <Alan
                                inputMode="numeric"
                                value={String(ders.soruSayisi)}
                                onChange={(e) => {
                                  const adet = Number.parseInt(
                                    e.target.value.replace(/[^0-9]/g, ''),
                                    10,
                                  )
                                  sablonGuncelle(sablon.id, (s) => ({
                                    ...s,
                                    dersler: s.dersler.map((d, i) =>
                                      i === indeks
                                        ? { ...d, soruSayisi: Number.isFinite(adet) ? adet : 0 }
                                        : d,
                                    ),
                                  }))
                                }}
                                className="rakam h-9 w-14 px-1 text-center text-sm"
                              />
                              <button
                                type="button"
                                aria-label={`${ders.ad} dersini çıkar`}
                                onClick={() =>
                                  sablonGuncelle(sablon.id, (s) => ({
                                    ...s,
                                    dersler: s.dersler.filter((_, i) => i !== indeks),
                                  }))
                                }
                                className="text-muted-foreground active:text-danger"
                              >
                                <X size={16} />
                              </button>
                            </li>
                          ))}
                        </ul>

                        <div className="flex gap-2">
                          <Buton
                            bicim="ikincil"
                            boy="kucuk"
                            className="flex-1"
                            onClick={() =>
                              sablonGuncelle(sablon.id, (s) => ({
                                ...s,
                                dersler: [
                                  ...s.dersler,
                                  { id: yeniId(), ad: 'Yeni ders', soruSayisi: 10 },
                                ],
                              }))
                            }
                          >
                            <Plus size={15} />
                            Ders ekle
                          </Buton>
                          <Buton
                            bicim="tehlike"
                            boy="kucuk"
                            onClick={() => setSilinecekSablon(sablon)}
                          >
                            <Trash2 size={15} />
                            Şablonu sil
                          </Buton>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </Kart>

      <Kart className="mb-3">
        <p className="font-medium">Yedekleme</p>
        <p className="mb-3 mt-0.5 text-xs text-muted-foreground">
          Bütün veriler yalnızca bu cihazda duruyor. Telefon değiştirmeden veya uygulamayı
          silmeden önce yedek al. Yanlış soru fotoğrafları boyutları yüzünden yedeğe girmez.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Buton bicim="ikincil" boy="kucuk" onClick={dosyayaIndir}>
            <Download size={15} />
            Yedeği indir
          </Buton>
          <Buton bicim="ikincil" boy="kucuk" onClick={() => dosyaRef.current?.click()}>
            <FileUp size={15} />
            Yedeği yükle
          </Buton>
        </div>

        <input
          ref={dosyaRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (e) => {
            const dosya = e.target.files?.[0]
            if (!dosya) return
            geriYukle(await dosya.text())
            e.target.value = ''
          }}
        />

        {durum && <Not className="mt-3">{durum}</Not>}
      </Kart>

      <Kart className="mb-3">
        <p className="font-medium">Tüm veriyi sil</p>
        <p className="mb-3 mt-0.5 text-xs text-muted-foreground">
          Denemeler, okul notları, soru kayıtların, yanlış soru fotoğrafların ve kendi
          şablonların silinir. Geri alınamaz.
        </p>
        <Buton bicim="tehlike" boy="kucuk" onClick={() => setSifirlamaAcik(true)}>
          <Trash2 size={15} />
          Sıfırla
        </Buton>
      </Kart>

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Rabi · çevrimdışı çalışır · veri cihazdan çıkmaz
      </p>

      <Onay
        acik={silinecekSablon !== null}
        baslik="Şablon silinsin mi?"
        aciklama={`"${silinecekSablon?.ad}" şablonu silinecek. Bu şablonla kaydedilmiş denemeler listede kalır ama net dökümleri görünmez.`}
        onOnayla={() =>
          silinecekSablon &&
          setKayitliSablonlar((onceki) => onceki.filter((s) => s.id !== silinecekSablon.id))
        }
        onIptal={() => setSilinecekSablon(null)}
      />

      <Onay
        acik={sifirlamaAcik}
        baslik="Her şey silinsin mi?"
        aciklama="Bütün denemeler, okul notların, soru kayıtların, yanlış soru fotoğrafların ve şablonların kalıcı olarak silinecek. Önce yedek almadıysan geri dönüşü yok."
        onayMetni="Hepsini sil"
        onOnayla={async () => {
          // Fotoğraflar ayrı depoda (IndexedDB); localStorage temizliği onlara
          // dokunmuyor. Silinmezlerse kayıtsız blob olarak yer işgal ederler.
          await tumResimleriSil().catch(() => {})
          tumVeriyiSil()
          window.location.reload()
        }}
        onIptal={() => setSifirlamaAcik(false)}
      />
    </div>
  )
}
