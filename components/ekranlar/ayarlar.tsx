'use client'

import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  Bookmark,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Copy,
  Download,
  GraduationCap,
  Images,
  Lock,
  Moon,
  Music,
  Plus,
  Smartphone,
  Sun,
  Table,
  Target,
  Flag,
  Trash2,
  Upload,
  Volume2,
  X,
} from 'lucide-react'
import { Alan, Buton, Cip, Etiket, Not, Onay } from '@/components/ui'
import { useTema, type TemaTercihi } from '@/components/theme-provider'
import {
  odakDurumu,
  odakIzniIste,
  odakKilidiDesteklenir,
  type OdakDurumu,
} from '@/lib/odak-kilidi'
import { UygulamaSecici } from '@/components/odak/uygulama-secici'
import { SINIF_SECENEKLERI, egitimYili, katsayiYaz, mezunMu, sinifAdi } from '@/lib/hesap'
import { toplamSoru } from '@/lib/sablonlar'
import type { MagazaDurumu } from '@/lib/magaza/magaza'
import {
  elenenSoruSayisi,
  tumVeriyiSil,
  yedegiDogrula,
  yedegiUygula,
  yedekOlustur,
} from '@/lib/depo'
import {
  resimBoyutu,
  resimleriDisaAktar,
  resimleriIceAktar,
  tumResimleriSil,
} from '@/lib/resim-depo'
import type { BankaKaydi } from '@/lib/oyunlar/banka'
import { izinIste } from '@/lib/bildirim'
import { saatDegeri, saatYaz, saatiCoz } from '@/lib/hatirlatma'
import { cn, yeniId } from '@/lib/utils'
import type {
  Ayarlar,
  Deneme,
  Devamsizlik,
  GunlukKayit,
  Hedef,
  KazanilanRozet,
  OkulYili,
  OyunKayitlari,
  OyunMuzikTuru,
  OyunTurKaydi,
  PomodoroAyar,
  PomodoroSeans,
  PuanTuru,
  Sablon,
  YanlisSoru,
} from '@/lib/types'

const PUAN_TURU_ADI: Record<PuanTuru, string> = {
  say: 'Sayısal',
  ea: 'Eşit Ağırlık',
  soz: 'Sözel',
  dil: 'Dil',
}

/**
 * Tema seçenekleri. Varsayılan `sistem`: uygulama, telefon hangi temadaysa o
 * temada açılır ve telefon gece moduna geçtiğinde kendiliğinden onu izler.
 */
const TEMA_SECENEKLERI: { id: TemaTercihi; ad: string; Simge: LucideIcon }[] = [
  { id: 'sistem', ad: 'Cihazımla aynı', Simge: Smartphone },
  { id: 'acik', ad: 'Açık', Simge: Sun },
  { id: 'koyu', ad: 'Koyu', Simge: Moon },
]

const HAZIR_HEDEFLER = [100, 200, 300, 400, 500]
/**
 * Hızlı seçim saatleri. Yanındaki saat kutusu her değeri kabul ettiği için bu
 * liste "en sık istenenler"; tam liste 24 çip olurdu ve okunmazdı.
 */
const HATIRLATMA_SAATLERI = [8, 12, 16, 18, 19, 20, 21, 22, 23]

/**
 * Mini oyun müziği seçenekleri. Hangisinin "iyi" olduğu tamamen zevk meselesi
 * olduğu için seçim kullanıcıda bırakıldı; tek bir parça dayatmak, beğenmeyen
 * için müziği tamamen kapatmaktan başka yol bırakmıyordu.
 */
const OYUN_MUZIK_ADI: Record<OyunMuzikTuru, string> = {
  arcade: 'Arcade',
  lofi: 'Lo-fi',
}

const OYUN_MUZIK_ACIKLAMA: Record<OyunMuzikTuru, string> = {
  arcade: 'Hızlı chiptune döngüsü — turun temposuyla aynı, acele ettiriyor.',
  lofi: 'Pomodoro’nun sakin parçaları. Yavaş; oyunun hızını taşımıyor.',
}

/** Bayt sayısını okunur hâle getirir: 5242880 → "5,0 MB". */
function boyutYaz(bayt: number): string {
  if (bayt < 1024 * 1024) return `${Math.max(1, Math.round(bayt / 1024))} KB`
  return `${(bayt / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}

export function AyarlarEkrani({
  sablonlar,
  kayitliSablonlar,
  setKayitliSablonlar,
  ayarlar,
  setAyarlar,
  bekleyenBildirim,
  pomodoroAyar,
  setPomodoroAyar,
  yedeklenecek,
}: {
  sablonlar: Sablon[]
  kayitliSablonlar: Sablon[]
  setKayitliSablonlar: (guncelleyici: Sablon[] | ((onceki: Sablon[]) => Sablon[])) => void
  ayarlar: Ayarlar
  /** Gönderilmeyi bekleyen hatalı soru bildirimi sayısı. */
  bekleyenBildirim: number
  setAyarlar: (guncelleyici: Ayarlar | ((onceki: Ayarlar) => Ayarlar)) => void
  /** Odak kilidi ayarları pomodoro ayarının içinde duruyor. */
  pomodoroAyar: PomodoroAyar
  setPomodoroAyar: (
    guncelleyici: PomodoroAyar | ((onceki: PomodoroAyar) => PomodoroAyar),
  ) => void
  /** Yedeğe girecek bütün veri — fotoğraflar hariç. */
  yedeklenecek: {
    denemeler: Deneme[]
    okulYillari: OkulYili[]
    gunlukKayitlar: GunlukKayit[]
    devamsizlik: Devamsizlik[]
    yanlisSorular: YanlisSoru[]
    rozetler: KazanilanRozet[]
    oyunlar: OyunKayitlari
    oyunGecmisi: OyunTurKaydi[]
    /** Eski yedeklerde yok; `Yedek` tipinde de isteğe bağlı. */
    oyunBankasi?: BankaKaydi[]
    bankaDusen?: number
    /** Havuç bakiyesi ve mağaza koleksiyonu — ikisi de yedeğe giriyor. */
    havuc?: number
    magaza?: MagazaDurumu
    pomodoroGecmis: PomodoroSeans[]
    /** Kilitli uygulama listesi burada; yedekten dönen kullanıcı yeniden seçmesin. */
    pomodoroAyar: PomodoroAyar
    hedef: Hedef | null
  }
}) {
  const { tercih, tema, temaDegistir } = useTema()
  const [sablonlarAcik, setSablonlarAcik] = useState(false)
  const [acikSablonId, setAcikSablonId] = useState<string | null>(null)
  const [silinecekSablon, setSilinecekSablon] = useState<Sablon | null>(null)
  const [sifirlamaAcik, setSifirlamaAcik] = useState(false)
  const [odakIzinleri, setOdakIzinleri] = useState<OdakDurumu>({
    kullanimVerisi: false,
    katman: false,
    calisiyor: false,
  })
  const [seciciAcik, setSeciciAcik] = useState(false)

  // Odak izinleri sistem ayarlarından veriliyor; kullanıcı Rabi'ye döndüğünde
  // durum yeniden sorulmalı, yoksa kart hâlâ "izin eksik" derdi.
  useEffect(() => {
    if (!odakKilidiDesteklenir()) return
    const tazele = () => void odakDurumu().then(setOdakIzinleri)
    tazele()
    const gorunurluk = () => document.visibilityState === 'visible' && tazele()
    document.addEventListener('visibilitychange', gorunurluk)
    return () => document.removeEventListener('visibilitychange', gorunurluk)
  }, [])
  const [durum, setDurum] = useState<string | null>(null)
  const [hedefMetni, setHedefMetni] = useState(String(ayarlar.gunlukHedef))
  // Kutu yalnızca hazır çiplerden biri seçili değilken ya da kullanıcı "Kendin
  // yaz" dediğinde açılıyor; sürekli açık durduğunda çiplerin altında ikinci
  // bir seçim alanı gibi görünüyordu.
  const [ozelHedefAcik, setOzelHedefAcik] = useState(
    !HAZIR_HEDEFLER.includes(ayarlar.gunlukHedef),
  )
  const [izinReddedildi, setIzinReddedildi] = useState(false)
  const [fotoBoyut, setFotoBoyut] = useState(0)
  const dosyaRef = useRef<HTMLInputElement>(null)

  const temaSecenegi = TEMA_SECENEKLERI.find((s) => s.id === tercih)
  const varsayilanSablon = sablonlar.find((s) => s.id === ayarlar.varsayilanSablonId)

  /**
   * Hatırlatmayı açarken izin de istenir. Android'de izin bir kez kalıcı olarak
   * reddedildiyse `izinIste` sistem penceresini bile açmadan false döner —
   * bu yüzden anahtar sessizce kapalı kalmak yerine ne yapması gerektiğini yazıyor.
   */
  const hatirlatmaDegistir = async () => {
    if (ayarlar.bildirimAcik) {
      setAyarlar((o) => ({ ...o, bildirimAcik: false }))
      setIzinReddedildi(false)
      return
    }
    const izinli = await izinIste()
    setIzinReddedildi(!izinli)
    if (izinli) setAyarlar((o) => ({ ...o, bildirimAcik: true }))
  }

  const resimIdleri = yedeklenecek.yanlisSorular.map((s) => s.resimId)

  // Fotoğrafların toplam boyutu, kullanıcı "fotoğrafları da ekle" derken ne
  // kadar büyük bir dosya çıkacağını bilsin diye önceden ölçülüyor.
  useEffect(() => {
    if (resimIdleri.length === 0) {
      setFotoBoyut(0)
      return
    }
    let iptal = false
    void resimBoyutu(resimIdleri).then((b) => {
      if (!iptal) setFotoBoyut(b)
    })
    return () => {
      iptal = true
    }
    // Kimlik listesi her çizimde yeniden oluşuyor; uzunluğu yeterli bir ölçü.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resimIdleri.length])

  const yedekJson = async (fotograflarla: boolean) => {
    const resimler = fotograflarla ? await resimleriDisaAktar(resimIdleri) : undefined
    return JSON.stringify(
      yedekOlustur({ ...yedeklenecek, sablonlar: kayitliSablonlar, ayarlar, resimler }),
      null,
      2,
    )
  }

  const dosyayaIndir = async (fotograflarla: boolean) => {
    setDurum('Yedek hazırlanıyor…')
    const json = await yedekJson(fotograflarla)
    const bag = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = bag
    link.download = `rabi-yedek-${new Date().toISOString().slice(0, 10)}${
      fotograflarla ? '-fotografli' : ''
    }.json`
    link.click()
    URL.revokeObjectURL(bag)
    setDurum('Yedek dosyası indirildi (İndirilenler klasörüne bak).')
  }

  const geriYukle = async (ham: string) => {
    const sonuc = yedegiDogrula(ham)
    if ('hata' in sonuc) {
      setDurum(sonuc.hata)
      return
    }

    // Fotoğraflar önce yazılıyor: localStorage yazıldıktan sonra sayfa
    // yenilendiği için, sonraya bırakılsa yarısı yazılmadan yenilenebilirdi.
    const elenen = elenenSoruSayisi(sonuc.yedek)
    await resimleriIceAktar(sonuc.yedek.resimler ?? {}).catch(() => {})
    yedegiUygula(sonuc.yedek)

    setDurum(
      elenen > 0
        ? `Yedek yüklendi. ${elenen} yanlış soru kaydı atlandı — bu yedek fotoğrafsız alınmış.`
        : 'Yedek yüklendi, uygulama yenileniyor…',
    )
    setTimeout(() => window.location.reload(), elenen > 0 ? 2500 : 600)
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
      {/* Ayarlar artık alt menüde kendi sekmesi; diğer sekmelerle aynı başlık deseni. */}
      <header className="px-0.5 pt-1">
        <p className="text-[11px] font-black tracking-[0.2em] text-ikincil">RABİ</p>
        <h1 className="mt-1 font-display text-[27px] font-extrabold tracking-tight">Ayarlar ⚙️</h1>
        <p className="mt-1 text-[13.5px] font-medium text-muted-foreground">
          Rabi’yi kendine göre kur.
        </p>
      </header>

      <div className="mt-4 space-y-4">
        {/* ------------------------------ Görünüm ------------------------- */}
        <Bolum baslik="Görünüm">
          <Satir
            Simge={Moon}
            renk="lavanta"
            baslik="Tema"
            aciklama="Gece çalışırken gözü yormaz"
            deger={temaSecenegi?.ad}
          />
          <GenisAlan>
            <Cipler>
              {TEMA_SECENEKLERI.map((secenek) => (
                <Cip
                  key={secenek.id}
                  secili={tercih === secenek.id}
                  onClick={() => temaDegistir(secenek.id)}
                >
                  <secenek.Simge size={14} className="mr-1.5 inline align-[-2px]" aria-hidden />
                  {secenek.ad}
                </Cip>
              ))}
            </Cipler>
            <AlanNotu>
              {tercih === 'sistem'
                ? `Telefonunun ayarını izliyorum — şu an ${tema === 'koyu' ? 'koyu' : 'açık'}.`
                : 'Telefonun gece moduna geçse bile bu seçim değişmez.'}
            </AlanNotu>
          </GenisAlan>
        </Bolum>

        {/* ------------------------------ Çalışma ------------------------- */}
        <Bolum baslik="Çalışma">
          <Satir
            Simge={Target}
            renk="mavi"
            baslik="Günlük soru hedefim"
            aciklama="Her günü buna göre takip ediyorum"
            deger={ayarlar.gunlukHedef}
          />
          <GenisAlan>
            <Cipler>
              {HAZIR_HEDEFLER.map((h) => (
                <Cip
                  key={h}
                  secili={ayarlar.gunlukHedef === h}
                  onClick={() => {
                    setAyarlar((o) => ({ ...o, gunlukHedef: h }))
                    setHedefMetni(String(h))
                    setOzelHedefAcik(false)
                  }}
                >
                  {h}
                </Cip>
              ))}
              <Cip secili={ozelHedefAcik} onClick={() => setOzelHedefAcik((a) => !a)}>
                Kendin yaz
              </Cip>
            </Cipler>

            {ozelHedefAcik && (
              <Alan
                inputMode="numeric"
                aria-label="Günlük soru hedefi"
                value={hedefMetni}
                onChange={(e) => {
                  const temiz = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                  setHedefMetni(temiz)
                  const sayi = Number(temiz)
                  if (sayi > 0) setAyarlar((o) => ({ ...o, gunlukHedef: sayi }))
                }}
                className="rakam mt-2.5 h-10 w-28"
              />
            )}
          </GenisAlan>

          <Satir
            Simge={GraduationCap}
            renk="nane"
            baslik="Alanım"
            aciklama="Sıralama tahmini buna göre hesaplanır"
            deger={PUAN_TURU_ADI[ayarlar.puanTuru]}
          />
          <GenisAlan>
            <Cipler>
              {(Object.keys(PUAN_TURU_ADI) as PuanTuru[]).map((tur) => (
                <Cip
                  key={tur}
                  secili={ayarlar.puanTuru === tur}
                  onClick={() => setAyarlar((o) => ({ ...o, puanTuru: tur }))}
                >
                  {PUAN_TURU_ADI[tur]}
                </Cip>
              ))}
            </Cipler>
          </GenisAlan>

          <Satir
            Simge={ClipboardList}
            renk="krem"
            baslik="Sınıfım"
            aciklama={
              mezunMu(ayarlar.buYilSinif)
                ? 'Mezunda ilerleme durur'
                : 'Her eylülde kendiliğinden ilerler'
            }
            deger={sinifAdi(ayarlar.buYilSinif)}
          />
          <GenisAlan>
            <Cipler>
              {SINIF_SECENEKLERI.map((sinif) => (
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
                      // Mezunluktan çıkılıyorsa elle girilen OBP de kalkıyor:
                      // okuyan öğrencinin OBP'si henüz kesin değil, orada elle
                      // girilmiş bir sayıyı taşımak yanlış kesinlik olurdu.
                      elleObp: mezunMu(sinif) ? onceki.elleObp : null,
                    }))
                  }
                >
                  {sinifAdi(sinif)}
                </Cip>
              ))}
            </Cipler>
            <AlanNotu>
              {mezunMu(ayarlar.buYilSinif)
                ? 'Mezunda ilerleme durur. OBP’ni Okul Notları ekranından doğrudan girebilirsin.'
                : 'Her eylülde bir üst sınıfa kendiliğinden geçer, 12’de durur.'}
            </AlanNotu>
          </GenisAlan>

          <Satir
            Simge={Bookmark}
            renk="mavi"
            baslik="Varsayılan deneme türü"
            aciklama="Yeni deneme bu şablonla açılır"
            deger={varsayilanSablon?.ad}
          />
          <GenisAlan>
            <Cipler>
              {sablonlar.map((s) => (
                <Cip
                  key={s.id}
                  secili={s.id === ayarlar.varsayilanSablonId}
                  onClick={() => setAyarlar((onceki) => ({ ...onceki, varsayilanSablonId: s.id }))}
                >
                  {s.ad}
                </Cip>
              ))}
            </Cipler>
          </GenisAlan>

          <Satir
            Simge={Table}
            renk="pembe"
            baslik="Deneme şablonları"
            aciklama="TYT, AYT, YDT ve kendi şablonların"
            deger={sablonlar.length}
            onClick={() => setSablonlarAcik((a) => !a)}
            acikMi={sablonlarAcik}
            sag={
              <ChevronDown
                size={18}
                strokeWidth={2.6}
                aria-hidden
                className={cn(
                  'shrink-0 text-muted-foreground/50 transition-transform',
                  sablonlarAcik && 'rotate-180',
                )}
              />
            }
          />

          {sablonlarAcik && (
            <GenisAlan tam>
              <AlanNotu ust={false}>
                Hazır şablonlar değiştirilemez; kopyalayıp kendi ders dağılımını kurabilirsin.
              </AlanNotu>

              <ul className="mt-2 overflow-hidden rounded-xl border border-border">
                {sablonlar.map((sablon) => {
                  const acik = acikSablonId === sablon.id

                  return (
                    <li key={sablon.id} className="border-t border-border first:border-t-0">
                      <button
                        type="button"
                        onClick={() => setAcikSablonId(acik ? null : sablon.id)}
                        aria-expanded={acik}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">{sablon.ad}</p>
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
                        <div className="px-3 pb-3">
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
                                      sablonGuncelle(sablon.id, (s) => ({
                                        ...s,
                                        ad: e.target.value,
                                      }))
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
                                              ? {
                                                  ...d,
                                                  soruSayisi: Number.isFinite(adet) ? adet : 0,
                                                }
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
            </GenisAlan>
          )}
          {/* ---- Odak kilidi. Tarayıcıda özellik yok, kart da görünmüyor. ---- */}
          {odakKilidiDesteklenir() && (
            <>
              <Satir
                Simge={Lock}
                renk="lavanta"
                baslik="Odak kilidi"
                aciklama="Çalışma turunda seçtiğin uygulamaların üstüne çıkarım"
                onClick={() => setPomodoroAyar((o) => ({ ...o, odakKilidi: !o.odakKilidi }))}
                basiliMi={pomodoroAyar.odakKilidi}
                sag={<Anahtar acik={pomodoroAyar.odakKilidi} />}
              />

              {pomodoroAyar.odakKilidi && (
                <GenisAlan>
                  {(!odakIzinleri.kullanimVerisi || !odakIzinleri.katman) && (
                    <Not tur="uyari" className="mb-2.5">
                      İzin eksik olduğu sürece kilit çalışmaz.
                      <span className="mt-2 flex flex-wrap gap-1.5">
                        {!odakIzinleri.kullanimVerisi && (
                          <Buton
                            bicim="ikincil"
                            boy="kucuk"
                            onClick={() => void odakIzniIste('kullanimVerisi')}
                          >
                            Kullanım verisi izni
                          </Buton>
                        )}
                        {!odakIzinleri.katman && (
                          <Buton
                            bicim="ikincil"
                            boy="kucuk"
                            onClick={() => void odakIzniIste('katman')}
                          >
                            Üste çizme izni
                          </Buton>
                        )}
                      </span>
                    </Not>
                  )}

                  <Buton bicim="ikincil" boy="kucuk" onClick={() => setSeciciAcik((a) => !a)}>
                    {seciciAcik
                      ? 'Listeyi kapat'
                      : `Uygulamaları seç (${pomodoroAyar.kilitliUygulamalar.length})`}
                  </Buton>

                  {seciciAcik && (
                    <div className="mt-3">
                      <UygulamaSecici
                        secili={pomodoroAyar.kilitliUygulamalar}
                        onDegis={(paketler) =>
                          setPomodoroAyar((o) => ({ ...o, kilitliUygulamalar: paketler }))
                        }
                      />
                    </div>
                  )}

                  <AlanNotu>
                    Kilit bir engel, kilit değil: istediğin an kapatabilirsin. Molada
                    kendiliğinden açılır.
                  </AlanNotu>
                </GenisAlan>
              )}
            </>
          )}
        </Bolum>

        {/* ------------------------------ Hatırlatma ---------------------- */}
        <Bolum baslik="Hatırlatma">
          <Satir
            Simge={Bell}
            renk="mercan"
            baslik="Günlük hatırlatma"
            aciklama="Soru girmediğin günlerde tek bildirim"
            onClick={() => void hatirlatmaDegistir()}
            basiliMi={ayarlar.bildirimAcik}
            sag={<Anahtar acik={ayarlar.bildirimAcik} />}
          />

          {ayarlar.bildirimAcik && (
            <GenisAlan>
              <Cipler>
                {HATIRLATMA_SAATLERI.map((h) => (
                  <Cip
                    key={h}
                    secili={ayarlar.hatirlatmaSaati === h && ayarlar.hatirlatmaDakikasi === 0}
                    onClick={() =>
                      setAyarlar((o) => ({ ...o, hatirlatmaSaati: h, hatirlatmaDakikasi: 0 }))
                    }
                  >
                    {saatYaz(h, 0)}
                  </Cip>
                ))}
              </Cipler>

              {/* Çipler tam saatler; dakikalı bir saat ("21.30") ancak buradan
                  girilebiliyor. Sistemin kendi saat seçicisini açtığı için
                  telefonda elle rakam yazmak gerekmiyor. */}
              <div className="mt-2.5 flex items-center gap-2">
                <Etiket className="mb-0 shrink-0 text-xs">Başka saat</Etiket>
                <Alan
                  type="time"
                  value={saatDegeri(ayarlar.hatirlatmaSaati, ayarlar.hatirlatmaDakikasi)}
                  onChange={(e) => {
                    const cozulen = saatiCoz(e.target.value)
                    if (!cozulen) return
                    setAyarlar((o) => ({
                      ...o,
                      hatirlatmaSaati: cozulen.saat,
                      hatirlatmaDakikasi: cozulen.dakika,
                    }))
                  }}
                  aria-label="Hatırlatma saati"
                  className="rakam h-10 w-32"
                />
              </div>

              <AlanNotu>
                Şu an seçili:{' '}
                <strong className="rakam text-foreground">
                  {saatYaz(ayarlar.hatirlatmaSaati, ayarlar.hatirlatmaDakikasi)}
                </strong>
                . Günde en fazla bir bildirim gönderilir; o gün soru girdiysen hiç gönderilmez.
                Bildirim gelmiyorsa telefonun pil optimizasyonu Rabi’yi kısıtlıyor olabilir.
              </AlanNotu>
            </GenisAlan>
          )}

          {izinReddedildi && (
            <GenisAlan tam>
              <Not tur="uyari">
                Bildirim izni verilmedi. Telefonun Ayarlar → Uygulamalar → Rabi → Bildirimler
                bölümünden açman gerekiyor; sonra buraya dönüp tekrar dene.
              </Not>
            </GenisAlan>
          )}
        </Bolum>

        {/* ------------------------------ Ses ----------------------------- */}
        <Bolum baslik="Ses">
          <Satir
            Simge={Volume2}
            renk="krem"
            baslik="Mini oyun sesleri"
            aciklama="Doğru, yanlış ve tur bitişi efektleri"
            onClick={() => setAyarlar((o) => ({ ...o, oyunSesi: !o.oyunSesi }))}
            basiliMi={ayarlar.oyunSesi}
            sag={<Anahtar acik={ayarlar.oyunSesi} />}
          />
          <Satir
            Simge={Music}
            renk="lavanta"
            baslik="Mini oyun müziği"
            aciklama="Ses efektlerinden ayrı kapatılabilir"
            onClick={() => setAyarlar((o) => ({ ...o, oyunMuzigi: !o.oyunMuzigi }))}
            basiliMi={ayarlar.oyunMuzigi}
            sag={<Anahtar acik={ayarlar.oyunMuzigi} />}
          />

          {ayarlar.oyunMuzigi && (
            <GenisAlan>
              <Cipler>
                {(Object.keys(OYUN_MUZIK_ADI) as OyunMuzikTuru[]).map((tur) => (
                  <Cip
                    key={tur}
                    secili={ayarlar.oyunMuzikTuru === tur}
                    onClick={() => setAyarlar((o) => ({ ...o, oyunMuzikTuru: tur }))}
                  >
                    {OYUN_MUZIK_ADI[tur]}
                  </Cip>
                ))}
              </Cipler>
              <AlanNotu>{OYUN_MUZIK_ACIKLAMA[ayarlar.oyunMuzikTuru]}</AlanNotu>
            </GenisAlan>
          )}
        </Bolum>

        {/* --------------------- Hatalı soru bildirimi -------------------- */}
        {/* Kendi bölümü değil, Veri'nin başı: gönderilen şey de veri ve
            kullanıcının "cihazdan ne çıkıyor" sorusunun cevabı burada. */}
        <Bolum baslik="Hatalı soru bildirimi">
          <Satir
            Simge={Flag}
            renk="mercan"
            baslik="Bildirdiğim soruları gönder"
            aciklama="Mini oyunlarda hatalı bulduğun soruları geliştiriciye ulaştırır"
            onClick={() =>
              setAyarlar((o) => ({ ...o, hataBildirimiAcik: !o.hataBildirimiAcik }))
            }
            basiliMi={ayarlar.hataBildirimiAcik}
            sag={<Anahtar acik={ayarlar.hataBildirimiAcik} />}
          />
          <GenisAlan tam>
            <AlanNotu>
              Uygulamanın internete çıktığı tek yer burası. Bir soruyu
              bildirdiğinde şunlar gönderilir: sorunun kendisi, hangi oyundan
              geldiği, uygulamanın doğru saydığı cevap, seçtiğin sebep, uygulama
              sürümü ve cihazına verilen rastgele bir numara.
            </AlanNotu>
            <AlanNotu ust>
              Adın, e-postan, denemelerin, notların, fotoğrafların ve puanların{' '}
              <b>gönderilmez</b>. Bildirim önce cihaza kaydedilir; internet yoksa
              bekler, bağlanınca kendiliğinden gider.
            </AlanNotu>
            {bekleyenBildirim > 0 && (
              <AlanNotu ust>
                {bekleyenBildirim} bildirim gönderilmeyi bekliyor.
              </AlanNotu>
            )}
          </GenisAlan>
        </Bolum>

        {/* ------------------------------ Veri ---------------------------- */}
        {/* Yedekleme işlemleri önce tek satırın altında çerçeveli düğmelerden
            oluşan ayrı bir blok hâlindeydi; ekranın geri kalanı satır diliyle
            konuşurken orası gri bir levha gibi duruyordu. Her işlem kendi satırı
            oldu, fotoğraf uyarısı da satırların açıklamasına girdi. */}
        <Bolum baslik="Veri">
          <Satir
            Simge={Download}
            renk="mavi"
            baslik="Yedeği indir"
            aciklama="Küçük dosya — yanlış soru fotoğrafları hariç"
            onClick={() => void dosyayaIndir(false)}
          />

          {fotoBoyut > 0 && (
            <Satir
              Simge={Images}
              renk="pembe"
              baslik="Fotoğraflarla yedekle"
              aciklama="Her şeyi taşır, dosya büyür"
              // Base64'e çevrilince veri yaklaşık 4/3 büyüyor.
              deger={`~${boyutYaz((fotoBoyut * 4) / 3)}`}
              onClick={() => void dosyayaIndir(true)}
            />
          )}

          <Satir
            Simge={Upload}
            renk="nane"
            baslik="Yedeği yükle"
            aciklama="Kaydettiğin dosyadan geri getir"
            onClick={() => dosyaRef.current?.click()}
            sag={
              <ChevronRight
                size={18}
                strokeWidth={2.6}
                className="shrink-0 text-muted-foreground/50"
                aria-hidden
              />
            }
          />

          <GenisAlan tam>
            <AlanNotu ust={false}>
              Denemelerin, notların ve fotoğrafların yalnızca bu cihazda duruyor — yedek
              dosyası da buradan çıkmıyor. Telefon değiştirmeden veya uygulamayı silmeden
              önce yedek al. Fotoğrafsız bir yedeği geri yüklersen yanlış soru bankası
              boş gelir.
            </AlanNotu>
            {durum && <Not className="mt-2">{durum}</Not>}
          </GenisAlan>

          {/* Sıfırla düğmesi satırın kendi içinde: altında ayrı bir alan
              olduğunda araya ayırıcı çizgi giriyor ve düğme başka bir ayara
              aitmiş gibi duruyordu. */}
          <Satir
            Simge={Trash2}
            renk="mercan"
            baslik="Tüm veriyi sil"
            aciklama="Geri alınamaz"
            sag={
              <button
                type="button"
                onClick={() => setSifirlamaAcik(true)}
                className="flex h-[34px] shrink-0 items-center gap-1.5 rounded-full bg-ikincil px-3.5 text-[12.5px] font-extrabold text-white transition active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ikincil"
              >
                <Trash2 size={14} aria-hidden />
                Sıfırla
              </button>
            }
          />
        </Bolum>
      </div>

      <input
        ref={dosyaRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={async (e) => {
          const dosya = e.target.files?.[0]
          if (!dosya) return
          await geriYukle(await dosya.text())
          e.target.value = ''
        }}
      />

      <p className="mt-4 pb-2 text-center text-[11.5px] font-semibold text-muted-foreground">
        Rabi · çevrimdışı çalışır · bildirdiğin hatalı sorular dışında veri cihazdan
        çıkmaz
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

/** Satır ikonunun pastel zemini ve üstünde okunan koyu tonu. */
type SatirRengi = 'mavi' | 'pembe' | 'krem' | 'nane' | 'lavanta' | 'mercan'

const IKON_RENGI: Record<SatirRengi, string> = {
  mavi: 'bg-primary-soft text-primary',
  pembe: 'bg-yzm-kart text-yzm-koyu',
  krem: 'bg-isl-kart text-isl-koyu',
  nane: 'bg-success-soft text-success',
  lavanta: 'bg-edb-kart text-edb-koyu',
  mercan: 'bg-ikincil-soft text-ikincil',
}

/**
 * Ayar bölümü: üstte küçük başlık, altında satırların toplandığı tek kart.
 * Dokuz ayrı kart alt alta dizildiğinde hangi ayarın nerede olduğu ancak
 * kaydırarak bulunuyordu.
 */
function Bolum({ baslik, children }: { baslik: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 ml-1 text-[11.5px] font-extrabold uppercase tracking-[0.09em] text-muted-foreground">
        {baslik}
      </h2>
      {/* Ayraç ilk çocuk dışındaki her çocuğa: satırlar koşullu çizildiği için
          (kapalı hatırlatmanın çipleri yok) sabit bir sınıf listesi tutmuyor. */}
      <div className="golge-kart overflow-hidden rounded-[22px] bg-card [&>*+*]:border-t [&>*+*]:border-border">
        {children}
      </div>
    </section>
  )
}

/** Bir ayar satırı: ikon · başlık/açıklama · sağda değer ya da denetim. */
function Satir({
  Simge,
  renk,
  baslik,
  aciklama,
  deger,
  sag,
  onClick,
  basiliMi,
  acikMi,
}: {
  Simge: LucideIcon
  renk: SatirRengi
  baslik: string
  aciklama?: string
  deger?: React.ReactNode
  sag?: React.ReactNode
  onClick?: () => void
  /** Aç/kapa satırlarında anahtarın durumu. */
  basiliMi?: boolean
  /** Altındaki alanı açıp kapatan satırlarda. */
  acikMi?: boolean
}) {
  const icerik = (
    <>
      <span
        className={cn(
          'grid size-[42px] shrink-0 place-items-center rounded-[14px]',
          IKON_RENGI[renk],
        )}
      >
        <Simge size={22} aria-hidden />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-extrabold leading-tight">{baslik}</span>
        {aciklama && (
          <span className="mt-0.5 block text-xs font-medium leading-snug text-muted-foreground">
            {aciklama}
          </span>
        )}
      </span>

      {/* Sağdaki değer seçili olanı söylüyor: çiplere bakmadan okunuyor. */}
      {deger !== undefined && (
        <span className="rakam shrink-0 text-[13px] font-extrabold text-muted-foreground">
          {deger}
        </span>
      )}
      {sag}
    </>
  )

  if (!onClick) {
    return <div className="flex items-center gap-3 px-3.5 py-2.5">{icerik}</div>
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={basiliMi}
      aria-expanded={acikMi}
      className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition active:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
    >
      {icerik}
    </button>
  )
}

/**
 * Bir satıra ait seçeneklerin durduğu alan. Ayrı kart açmıyor; seçim hangi
 * ayara aitse onun altında, ikon genişliği kadar girintili duruyor.
 * `tam` girintiyi kaldırır (uzun metinler ve iç içe listeler için).
 */
function GenisAlan({ tam, children }: { tam?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn('pb-3.5 pr-3.5 pt-0.5', tam ? 'pl-3.5' : 'pl-[68px]')}>{children}</div>
  )
}

function Cipler({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-1.5">{children}</div>
}

/** Seçeneklerin altındaki küçük açıklama. `ust` false ise üst boşluğu almaz. */
function AlanNotu({ ust = true, children }: { ust?: boolean; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        'text-[11.5px] font-medium leading-snug text-muted-foreground',
        ust && 'mt-2.5',
      )}
    >
      {children}
    </p>
  )
}

/** Aç/kapa anahtarının görüntüsü; tıklama satırın kendisinde. */
function Anahtar({ acik }: { acik: boolean }) {
  return (
    <span
      className={cn(
        'relative h-[27px] w-[46px] shrink-0 rounded-full transition',
        acik ? 'bg-primary' : 'bg-muted',
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] size-[21px] rounded-full bg-white shadow transition-all',
          acik ? 'left-[22px]' : 'left-[3px]',
        )}
      />
    </span>
  )
}
