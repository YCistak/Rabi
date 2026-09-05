'use client'

import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Download,
  GraduationCap,
  Images,
  Music,
  Target,
  Trash2,
  Upload,
  UserRound,
  Volume2,
  X,
} from 'lucide-react'
import { Alan, Anahtar, Buton, Cip, Etiket, Not, Onay } from '@/components/ui'
import { SaatSecici, SayiTekerlegi } from '@/components/secici'
import { SINIF_SECENEKLERI, egitimYili, mezunMu, sinifAdi } from '@/lib/hesap'
import type { NotKagidi } from '@/lib/yapilacaklar'
import {
  HEDEF_ADIMI,
  HEDEF_EN_AZ,
  HEDEF_EN_COK,
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
import type { BilinmeyenKart, KonuIlerlemeleri } from '@/lib/konu/ilerleme'
import { izinIste } from '@/lib/bildirim'
import { saatYaz } from '@/lib/hatirlatma'
import { AD_EN_AZ, adBiciminde, adGecerliMi } from '@/lib/ad'
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
  OyunTurKaydi,
  PomodoroAyar,
  PomodoroSeans,
  PuanTuru,
  Sablon,
  YanlisSoru,
} from '@/lib/types'

/** Alan seçilmemişken satırda ve çipte görünen ad. */
const ALANSIZ_ADI = 'Karar vermedim'

const PUAN_TURU_ADI: Record<PuanTuru, string> = {
  say: 'Sayısal',
  ea: 'Eşit Ağırlık',
  soz: 'Sözel',
  dil: 'Dil',
}

/**
 * Çip olarak sunulan alanlar — **Dil yok**.
 *
 * Dil kurulumdan da buradan da çıktı: Dil öğrencisi azınlıkta ve dördüncü kart
 * her iki listeyi de uzatıyordu. Ad tablosunda duruyor çünkü `PuanTuru` hâlâ
 * dört değer taşıyor: katalogdaki DİL programları yerinde ve biri hedef olarak
 * seçilirse `Hedef.puanTuru` 'dil' oluyor.
 *
 * Kayıtlı ayarı 'dil' olan eski kullanıcıya çip **gösteriliyor** (`turler`):
 * gösterilmeseydi satırda "Dil" yazarken altındaki çiplerin hiçbiri seçili
 * görünmez, kullanıcı ayarını bozuk sanırdı. Başka bir türe geçtiği anda çip
 * listeden düşüyor ve geri dönüşü olmuyor — istenen de bu.
 */
const SECILEBILIR_TURLER: PuanTuru[] = ['say', 'ea', 'soz']

/**
 * Seçenekleri açılıp kapanan ayarların kimlikleri. Serbest metin yerine birlik
 * hâlinde: yeni bir açılır ayar eklerken burada da tanımlanması gerekiyor,
 * yazım hatası sessizce hiç açılmayan bir satıra dönüşmesin.
 */
type AyarId =
  | 'ad'
  | 'hedef'
  | 'alan'
  | 'sinif'
  | 'hatirlatma-saati'

/** Bayt sayısını okunur hâle getirir: 5242880 → "5,0 MB". */
function boyutYaz(bayt: number): string {
  if (bayt < 1024 * 1024) return `${Math.max(1, Math.round(bayt / 1024))} KB`
  return `${(bayt / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}

export function AyarlarEkrani({
  kayitliSablonlar,
  ayarlar,
  setAyarlar,
  bekleyenBildirim,
  yedeklenecek,
}: {
  /** Yedeğe giren kullanıcı şablonları — ekranda düzenlenmiyor. */
  kayitliSablonlar: Sablon[]
  ayarlar: Ayarlar
  /** Gönderilmeyi bekleyen hatalı soru bildirimi sayısı. */
  bekleyenBildirim: number
  setAyarlar: (guncelleyici: Ayarlar | ((onceki: Ayarlar) => Ayarlar)) => void
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
    /** Konu Anlatımı kayıtları — okunan konular ve bilinmeyen kartlar. */
    konuIlerleme?: KonuIlerlemeleri
    bilinmeyenKartlar?: BilinmeyenKart[]
    /** Yapılacaklar tahtası — kâğıdın konumu da veri. */
    notlar?: NotKagidi[]
    pomodoroGecmis: PomodoroSeans[]
    /** Kilitli uygulama listesi burada; yedekten dönen kullanıcı yeniden seçmesin. */
    pomodoroAyar: PomodoroAyar
    hedef: Hedef | null
  }
}) {
  /**
   * Seçenekleri açık duran ayar; aynı anda yalnız biri açılabiliyor.
   *
   * Önce bütün çipler hep görünüyordu ve Ayarlar altı ekran boyu bir çip
   * duvarıydı: kullanıcı aradığı ayarı bulmak için onlarca seçeneğin arasından
   * kaydırıyordu. Artık satır ne seçili olduğunu sağında yazıyor, çipler ancak
   * satıra dokununca açılıyor.
   */
  const [acikAyar, setAcikAyar] = useState<AyarId | null>(null)
  /**
   * Ad alanının taslağı: kayda geçmemiş yazım.
   *
   * `null` "taslak yok, kayıtlı ad görünüyor" demek. Geçersiz bir ad (üç
   * harften kısa) doğrudan ayarlara yazılsaydı kullanıcı adını silerken
   * uygulama bir anlığına adsız kalır, satır kapanınca da o hâlde kaydolurdu.
   */
  const [adTaslagi, setAdTaslagi] = useState<string | null>(null)
  const adMetni = adTaslagi ?? ayarlar.ad
  const adUyarisi = adTaslagi !== null && !adGecerliMi(adTaslagi)
  const [sifirlamaAcik, setSifirlamaAcik] = useState(false)
  const [durum, setDurum] = useState<string | null>(null)
  const [izinReddedildi, setIzinReddedildi] = useState(false)
  const [fotoBoyut, setFotoBoyut] = useState(0)
  const dosyaRef = useRef<HTMLInputElement>(null)

  /** Seçenekli bir satırı açıp kapatan ortak prop'lar. */
  const acilir = (id: AyarId) => ({
    onClick: () => {
      // Ad satırı kapanırken kaydedilmemiş taslak da düşüyor: geri açıldığında
      // kayıtlı olmayan bir adı görmek, kaydedilmiş sanmaya yol açardı.
      setAdTaslagi(null)
      setAcikAyar((a) => (a === id ? null : id))
    },
    acikMi: acikAyar === id,
    sag: <AcilirOk acik={acikAyar === id} />,
  })

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

  return (
    <div>
      {/* Ayarlar artık alt menüde kendi sekmesi; diğer sekmelerle aynı başlık deseni. */}
      <header className="flex items-start gap-3 px-0.5 pt-1">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-extrabold tracking-[0.2em] text-muted-foreground">RABİ</p>
          <h1 className="mt-1 font-display text-[27px] font-extrabold tracking-tight">Ayarlar</h1>
        </div>

        {/* Simge başlığın içinden çıkıp sağ üste taşındı (Araçlar'daki 🧰 ile
            aynı kutu, aynı hiza): başlığın sonuna yapışan emoji sekmeden
            sekmeye başlığın bittiği yeri kaydırıyor, sağ üstteki kutu ise üç
            sekmede de aynı noktada duruyor. */}
        <span
          className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-yzm-kart text-[21px] leading-none"
          aria-hidden
        >
          ⚙️
        </span>
      </header>

      <div className="mt-4 space-y-4">
        {/* Görünüm bölümü yok: tek tema var, seçilecek bir şey kalmadı. */}

        {/* ------------------------------ Çalışma ------------------------- */}
        <Bolum baslik="Çalışma">
          <Satir
            Simge={UserRound}
            renk="mercan"
            baslik="Adım"
            deger={ayarlar.ad || 'Belirtilmedi'}
            {...acilir('ad')}
          />
          {acikAyar === 'ad' && (
            <GenisAlan tam>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <Etiket className="mb-0">Adın</Etiket>
                {/* Uzunluk kuralı kurulumdakiyle aynı: orada üç harf isteyip
                    burada tek harfe izin vermek, aynı alanın iki ekranda iki
                    ayrı kural tanıması olurdu. */}
                {adUyarisi && (
                  <span role="alert" className="text-xs font-medium text-danger">
                    En az {AD_EN_AZ} harf yaz
                  </span>
                )}
              </div>
              <Alan
                value={adMetni}
                // İlk harf büyütülüyor: `autoCapitalize` yalnızca klavyeye
                // verilen bir ipucu ve her klavye onu dinlemiyor.
                onChange={(e) => setAdTaslagi(adBiciminde(e.target.value))}
                // Kayda giren değer kırpılıyor ama yazarken kırpılmıyor:
                // aradaki boşluğu silmek kullanıcının elinden alınmamalı.
                // Geçersiz ad kaydedilmiyor; taslak alanda kalıyor ki kullanıcı
                // yazdığını kaybetmesin ve uyarıyı görsün.
                onBlur={(e) => {
                  if (!adGecerliMi(e.target.value)) return
                  setAyarlar((o) => ({ ...o, ad: e.target.value.trim() }))
                  setAdTaslagi(null)
                }}
                aria-invalid={adUyarisi}
                placeholder="Adını yaz"
                autoCapitalize="words"
                autoCorrect="off"
                spellCheck={false}
                maxLength={24}
                className={adUyarisi ? 'border-danger focus-visible:border-danger' : undefined}
              />
            </GenisAlan>
          )}

          <Satir
            Simge={Target}
            renk="mavi"
            baslik="Günlük soru hedefim"
            deger={ayarlar.gunlukHedef}
            {...acilir('hedef')}
          />
          {acikAyar === 'hedef' && (
            <GenisAlan tam>
              {/* Kurulumdaki tekerleğin aynısı: iki yerde iki farklı seçim
                  biçimi olsaydı kullanıcı hedefi değiştirmeye geldiğinde
                  tanımadığı bir arayüzle karşılaşırdı. */}
              <SayiTekerlegi
                deger={ayarlar.gunlukHedef}
                onDegis={(yeni) => setAyarlar((o) => ({ ...o, gunlukHedef: yeni }))}
                enAz={HEDEF_EN_AZ}
                enCok={HEDEF_EN_COK}
                adim={HEDEF_ADIMI}
                etiket="Günlük soru hedefi"
              />
              {/* Tekerlek onar artıyor; eski bir kurulumdan 315 gibi
                  bir sayı kalmışsa kullanıcı onu görebilmeli. */}
              {ayarlar.gunlukHedef % HEDEF_ADIMI !== 0 && (
                <AlanNotu>
                  Şu an <strong className="rakam text-foreground">{ayarlar.gunlukHedef}</strong>{' '}
                  seçili. Tekerleğe dokunursan en yakın basamağa oturur.
                </AlanNotu>
              )}
            </GenisAlan>
          )}

          <Satir
            Simge={GraduationCap}
            renk="nane"
            baslik="Alanım"
            deger={ayarlar.puanTuru ? PUAN_TURU_ADI[ayarlar.puanTuru] : ALANSIZ_ADI}
            {...acilir('alan')}
          />
          {acikAyar === 'alan' && (
          <GenisAlan>
            <Cipler>
              {(ayarlar.puanTuru === 'dil'
                ? [...SECILEBILIR_TURLER, 'dil' as PuanTuru]
                : SECILEBILIR_TURLER
              ).map((tur) => (
                <Cip
                  key={tur}
                  secili={ayarlar.puanTuru === tur}
                  onClick={() => setAyarlar((o) => ({ ...o, puanTuru: tur }))}
                >
                  {PUAN_TURU_ADI[tur]}
                </Cip>
              ))}
              {/* Kararsızlık da bir cevap ve geri dönülebilir olmalı: kurulumda
                  "Karar vermedim" diyen öğrenci burada alanını seçiyor, alanını
                  değiştiren de buraya dönebiliyor. Çip olmasaydı bir kez alan
                  seçen bir daha kararsıza dönemezdi. */}
              <Cip
                secili={ayarlar.puanTuru === null}
                onClick={() => setAyarlar((o) => ({ ...o, puanTuru: null }))}
              >
                {ALANSIZ_ADI}
              </Cip>
            </Cipler>
          </GenisAlan>
          )}

          <Satir
            Simge={ClipboardList}
            renk="krem"
            baslik="Sınıfım"
            deger={sinifAdi(ayarlar.buYilSinif)}
            {...acilir('sinif')}
          />
          {acikAyar === 'sinif' && (
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
            {/* "Her eylülde bir üst sınıfa geçer" notu kaldırıldı: satırın
                kendi açıklaması zaten bunu söylüyordu. */}
          </GenisAlan>
          )}

          {/*
            Odak kilidi ve Rahatsız Etme burada **yok**.

            İkisi bir süre hem burada hem Pomodoro'nun tepesinde duruyordu ve
            iki kopya zamanla birbirinden ayrıldı. İkisi de yalnızca çalışma
            turu boyunca yaşıyor; turdan bağımsız bir anlamları yok ve buradan
            açılan bir koruma, turu başlatan ekranda görünmüyordu. Tek yerleri
            artık Pomodoro sekmesindeki "Odak koruması" satırı
            (`components/odak/odak-ayarlari.tsx`).
          */}
        </Bolum>

        {/* ------------------------------ Hatırlatma ---------------------- */}
        <Bolum baslik="Hatırlatma">
          <Satir
            Simge={Bell}
            renk="mercan"
            baslik="Günlük hatırlatma"
            onClick={() => void hatirlatmaDegistir()}
            basiliMi={ayarlar.bildirimAcik}
            sag={<Anahtar acik={ayarlar.bildirimAcik} />}
          />

          {/* Saat seçimi kendi satırında: bildirim anahtarının altına doğrudan
              dokuz çip serilince "Günlük hatırlatma" ile saat aynı ayar gibi
              okunuyordu. Ayrı satır hem seçili saati sağında yazıyor hem de
              çipler ancak dokununca açılıyor. */}
          {ayarlar.bildirimAcik && (
            <Satir
              Simge={Bell}
              renk="mercan"
              baslik="Hatırlatma saati"
              deger={saatYaz(ayarlar.hatirlatmaSaati, ayarlar.hatirlatmaDakikasi)}
              {...acilir('hatirlatma-saati')}
            />
          )}

          {ayarlar.bildirimAcik && acikAyar === 'hatirlatma-saati' && (
            <GenisAlan tam>
              {/* Sistemin `<input type="time">` seçicisi kaldırıldı: telefon
                  İngilizceyse AM/PM düzeninde açılıyor ve uygulamanın her
                  yerindeki 24 saatlik "20.00" biçimiyle çelişiyordu. */}
              <SaatSecici
                saat={ayarlar.hatirlatmaSaati}
                dakika={ayarlar.hatirlatmaDakikasi}
                onDegis={({ saat, dakika }) =>
                  setAyarlar((o) => ({ ...o, hatirlatmaSaati: saat, hatirlatmaDakikasi: dakika }))
                }
              />

              {/* Seçili saat satırın sağında zaten yazıyor; burada tekrar
                  etmiyor. Kalan tek cümle bildirimin ne sıklıkta geleceği. */}
              <AlanNotu>
                Günde en fazla bir bildirim gelir; o gün soru girdiysen hiç gelmez.
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
            onClick={() => setAyarlar((o) => ({ ...o, oyunSesi: !o.oyunSesi }))}
            basiliMi={ayarlar.oyunSesi}
            sag={<Anahtar acik={ayarlar.oyunSesi} />}
          />
          <Satir
            Simge={Music}
            renk="lavanta"
            baslik="Mini oyun müziği"
            onClick={() => setAyarlar((o) => ({ ...o, oyunMuzigi: !o.oyunMuzigi }))}
            basiliMi={ayarlar.oyunMuzigi}
            sag={<Anahtar acik={ayarlar.oyunMuzigi} />}
          />

          {/* "Müzik parçası" satırı kaldırıldı: turda artık her zaman mod müziği
              çalıyor, lo-fi listesi oyunun içine girmiyor. Tempo turun kuralının
              parçası (`mod-muzigi.ts`); onu seçilebilir kılmak, kuralı bir zevk
              meselesi gibi gösteriyordu. Anahtar duruyor — müziği kapatmak hâlâ
              kullanıcının kararı. `ayarlar.oyunMuzikTuru` kayıtta duruyor ama
              okunmuyor; alanı silmek eski yedekleri bozardı. */}
        </Bolum>

        {/* --------------------- Hatalı soru bildirimi -------------------- */}
        {/* Kendi bölümü değil, Veri'nin başı: gönderilen şey de veri ve
            kullanıcının "cihazdan ne çıkıyor" sorusunun cevabı burada.

            Burada bir anahtar ve bir izin seçimi vardı; ikisi de kalktı.
            Bildirim kendiliğinden olan bir şey değil — kullanıcı bayrağa basıp
            sebep seçmeden hiçbir kayıt oluşmuyor, ilk bildirimde de ne
            gönderileceğini gösteren izin kartı çıkıyor. Rıza zaten o iki
            adımda alınıyordu; ayarlardaki üçüncü kopyası aynı kararı iki ayrı
            yerde tutup hangisinin geçerli olduğunu belirsizleştiriyordu. */}
        <Bolum baslik="Hatalı soru bildirimi">
          <GenisAlan tam>
            {/* Master'da iki uzun paragraf durup kaldırılmıştı ("yerine daha
                kısası gelecek"); yerine gelen bu. Ne gönderildiğinin tam
                listesi ilk bildirimde çıkan izin kartında duruyor — burada
                kalan tek iş, ayarlara bakan kullanıcıya cihazdan ne çıktığını
                bir cümlede söylemek. */}
            <AlanNotu>
              Bildirdiğin soru, hangi oyundan geldiği, seçtiğin sebep ve telefonunun
              modeli gönderilir. Adın, denemelerin, notların ve fotoğrafların
              <b> gönderilmez</b>.
            </AlanNotu>
            {bekleyenBildirim > 0 && (
              <AlanNotu ust>
                {bekleyenBildirim} bildirim gönderilmeyi bekliyor.
              </AlanNotu>
            )}
          </GenisAlan>
        </Bolum>

        {/* ----------------------- Çökme raporları ------------------------ */}
        {/* Hatalı soru bildiriminin hemen altında: ikisi de "cihazdan ne
            çıkıyor" sorusunun cevabı. Burada da önceden verilen bir izin yok,
            her çökmeden sonra tek tek soruluyor.

            "Çöktüğümde sor" anahtarı kalktı: soru zaten çökmeden sonra, gerçek
            bir olay üzerine çıkıyor ve orada "Gönderme" demek raporu siliyor.
            Anahtar, aynı hayırı önceden ve soyut olarak söylemekten başka bir
            işe yaramıyordu. */}
        <Bolum baslik="Çökme raporları">
          <GenisAlan tam>
            <AlanNotu>
              Uygulama çökerse hata kaydı <b>telefonunda</b> bekler; kendiliğinden
              hiçbir yere gitmez. Bir sonraki açılışta sana sorarım — &ldquo;Gönder&rdquo;
              dersen gider, &ldquo;Gönderme&rdquo; dersen silinir.
            </AlanNotu>
            <AlanNotu ust>
              Giden şey bir hata kaydı: hatanın hangi satırda olduğu, telefonunun
              modeli, Android ve uygulama sürümü. Adın, denemelerin, notların ve
              fotoğrafların <b>gönderilmez</b>.
            </AlanNotu>
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
            onClick={() => void dosyayaIndir(false)}
          />

          {fotoBoyut > 0 && (
            <Satir
              Simge={Images}
              renk="pembe"
              baslik="Fotoğraflarla yedekle"
              // Base64'e çevrilince veri yaklaşık 4/3 büyüyor.
              deger={`~${boyutYaz((fotoBoyut * 4) / 3)}`}
              onClick={() => void dosyayaIndir(true)}
            />
          )}

          <Satir
            Simge={Upload}
            renk="nane"
            baslik="Yedeği yükle"
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

          {/* Yedeğin ne taşıdığını anlatan paragraf şimdilik kaldırıldı.
              İşlem sonucu (`durum`) duruyor: yedek alındı mı, yüklendi mi —
              onu söylemeyen bir düğme çalışmamış gibi görünür. */}
          {durum && (
            <GenisAlan tam>
              <Not>{durum}</Not>
            </GenisAlan>
          )}

          {/* Sıfırla düğmesi satırın kendi içinde: altında ayrı bir alan
              olduğunda araya ayırıcı çizgi giriyor ve düğme başka bir ayara
              aitmiş gibi duruyordu. */}
          <Satir
            Simge={Trash2}
            renk="mercan"
            baslik="Tüm veriyi sil"
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
      {/* Ayracı `Satir` kendi çiziyor (bkz. `AYRAC`). Burada bir zamanlar
          "ilk çocuk dışında her çocuğa çizgi" kuralı vardı; `GenisAlan` da bir
          çocuk olduğu için çizgi ayarı bir sonrakinden değil **kendi
          seçeneklerinden** ayırıyordu ve "Mini oyun müziği" anahtarı ile onun
          Arcade/Lo-fi seçimi iki ayrı ayar gibi duruyordu. */}
      <div className="golge-kart overflow-hidden rounded-[22px] bg-card">{children}</div>
    </section>
  )
}

/** Seçenekli satırların sağındaki, açıkken dönen ok. */
function AcilirOk({ acik }: { acik: boolean }) {
  return (
    <ChevronDown
      size={18}
      strokeWidth={2.6}
      aria-hidden
      className={cn('shrink-0 text-muted-foreground/50 transition-transform', acik && 'rotate-180')}
    />
  )
}

/** Satırın üstündeki ayraç; bölümün ilk satırında çizilmiyor. */
const AYRAC = 'border-t border-border first:border-t-0'

/**
 * Bir ayar satırı: ikon · başlık · sağda değer ya da denetim.
 *
 * Ayraç çizgisi burada: her satır **kendi üstüne** çiziyor, bölümün ilki
 * hariç. Böylece çizgi hep iki ayarın arasına düşüyor; bir ayarın kendi
 * seçenekleri (`GenisAlan`) çizgisiz kalıp satıra bağlı görünüyor. Koşullu
 * satırlarda da doğru: baştaki satır çizilmezse `:first-child` sonrakine geçer.
 */
function Satir({
  Simge,
  renk,
  baslik,
  deger,
  sag,
  onClick,
  basiliMi,
  acikMi,
}: {
  Simge: LucideIcon
  renk: SatirRengi
  baslik: string
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

      {/* Satırın altındaki açıklama yazıları kaldırıldı: ayarın adı zaten ne
          olduğunu söylüyordu ve her satırın ikinci bir cümlesi listeyi iki
          katına çıkarıyordu. */}
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-extrabold leading-tight">{baslik}</span>
      </span>

      {/* Sağdaki değer seçili olanı söylüyor: çiplere bakmadan okunuyor. */}
      {deger !== undefined && (
        <span className="rakam shrink-0 text-[13px] font-extrabold text-primary">
          {deger}
        </span>
      )}
      {sag}
    </>
  )

  if (!onClick) {
    return <div className={cn(AYRAC, 'flex items-center gap-3 px-3.5 py-2.5')}>{icerik}</div>
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={basiliMi}
      aria-expanded={acikMi}
      className={cn(
        AYRAC,
        'flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition active:bg-muted',
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
      )}
    >
      {icerik}
    </button>
  )
}

/**
 * Açılır satırların sağındaki ok. Tasarımda çizilmemiş ama bir yeri olmalı:
 * dokununca açılan bir satırın dokunulabildiği başka türlü anlaşılmıyor.
 */
function AcOk({ acik }: { acik: boolean }) {
  return (
    <ChevronDown
      size={18}
      strokeWidth={2.6}
      aria-hidden
      className={cn(
        'shrink-0 text-muted-foreground/50 transition-transform',
        acik && 'rotate-180',
      )}
    />
  )
}

/**
 * Bir satıra ait seçeneklerin durduğu alan. Ayrı kart açmıyor; seçim hangi
 * ayara aitse onun altında, ikon genişliği kadar girintili duruyor.
 * `tam` girintiyi kaldırır (uzun metinler ve iç içe listeler için).
 */
function GenisAlan({ tam, children }: { tam?: boolean; children: React.ReactNode }) {
  return (
    // Ayraç yok: bu alan üstündeki satırın parçası, ondan ayrılmamalı.
    <div className={cn('pb-3.5 pr-3.5 pt-0.5', tam ? 'pl-3.5' : 'pl-[68px]')}>
      {children}
    </div>
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
