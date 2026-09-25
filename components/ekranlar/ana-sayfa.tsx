'use client'

import { useMemo } from 'react'
import { AlertTriangle, ChevronRight, Target } from 'lucide-react'
import type { Ayarlar, Devamsizlik, GunlukKayit, Hedef } from '@/lib/types'
import { dersYilininKayitlari, devamsizlikOzeti, gunOzeti, kayitHaritasi } from '@/lib/hesap'
import { bugun, cn, tariheCevir, tariheYaz } from '@/lib/utils'
import { siraYaz } from '@/lib/siralama'
import { AYLIK_OZET_EN_AZ_ETKIN_GUN, gunDe } from '@/lib/ozet'
import { KARTLAR, type Ekran, type KartRengi } from '@/lib/gezinme'
import { kisayollar } from '@/lib/son-kullanilan'
import { doluDersler, oyunlarinDersleri, type DersId } from '@/lib/oyunlar/tanim'
import { Halka, Kart, kartGirisi, Not } from '@/components/ui'
import { GeriSayim } from '@/components/geri-sayim'
import { Rabi, type MaskotDurumu } from '@/components/maskot/rabi'
import { gununHali } from '@/lib/gunun-hali'
import { geriSayim } from '@/lib/sinav-tarihi'

/** Seride gösterilen gün sayısı. Tasarımda hedef kartının altındaki yedi kutucuk. */
const SERI_GUNU = 7

/**
 * `getDay()` sırasına göre kısa gün adları. `toLocaleDateString` yerine sabit
 * liste kullanılıyor: statik dışa aktarımda cihazın yereli farklıysa
 * kısaltmalar değişir ve yedi kutucuğun genişliği bozulurdu.
 */
const GUN_ADLARI = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

/** Kutucuk yüzleri — `KARTLAR`'daki aile adları tema değişkenlerine bağlanıyor. */
const KUTUCUK_RENGI: Record<KartRengi, string> = {
  mavi: 'bg-primary-soft text-primary',
  pembe: 'bg-yzm-kart text-yzm-koyu',
  krem: 'bg-isl-kart text-isl-koyu',
  nane: 'bg-success-soft text-success',
  lavanta: 'bg-edb-kart text-edb-koyu',
  deniz: 'bg-trh-kart text-trh-koyu',
}

/**
 * Ders kutucuklarının zemini.
 *
 * Kutucuklar bir süre **oyunları** gösteriyordu ve adları ekranın en dar
 * yerinde okunmuyordu: "Anlatım Bozukluğu" ile "Canlıları Sınıflandır" 64
 * piksellik bir kutunun altında üç satıra iniyordu. Dahası dokunuş zaten
 * oyunu açmıyor, Oyunlar sekmesini açıyordu — yani kutucuk gidilecek yerin
 * adını değil, orada bulunabilecek bir şeyin adını yazıyordu. Artık kutucuk
 * dersin kendisi: adı kısa, dokunuşun karşılığı da tam olarak o dersin
 * ızgarası.
 *
 * Renk konu haritasındaki dersin rengi (`--konu-<ders>`) — "renk derse
 * aittir" kuralının doğrudan karşılığı. Sınıflar Tailwind'in taramasına takılsın diye tam yazılı.
 */
const DERS_RENGI: Record<DersId, string> = {
  turkce: 'bg-konu-turkce',
  matematik: 'bg-konu-matematik',
  cografya: 'bg-konu-cografya',
  tarih: 'bg-konu-tarih',
  biyoloji: 'bg-konu-biyoloji',
  kimya: 'bg-konu-kimya',
}

export function AnaSayfa({
  maskotGizli,
  ayarlar,
  gunlukKayitlar,
  devamsizlik,
  hedef,
  guncelSiralama,
  bekleyenYanlis,
  sonDenemeTarihi,
  ozetHazir,
  ozetYetersiz,
  sonrakiOzet,
  onOzetAc,
  sonAraclar,
  sonOyunlar,
  onKartAc,
  onDahaGit,
  onOyunlaraGit,
  acilisSuruyor = false,
}: {
  /** Açılış ya da kurulum geçişindeki tavşan buranın üstüne konarken gizlenir. */
  maskotGizli: boolean
  ayarlar: Ayarlar
  gunlukKayitlar: GunlukKayit[]
  devamsizlik: Devamsizlik[]
  hedef: Hedef | null
  /** Son denemelerden çıkan tahmini sıralama; deneme yoksa null. */
  guncelSiralama: number | null
  /** Yanlış soru bankasında henüz çözülmemiş soru sayısı — günün hâli kartı için. */
  bekleyenYanlis: number
  /** En yeni denemenin tarihi; yoksa null. Günün hâli kartı için. */
  sonDenemeTarihi: string | null
  /** Konu Anlatımı'nda "bilmiyorum" denen kart sayısı — bölümün alt satırı. */
  /**
   * Biten ayın özeti izlenmeyi bekliyor mu.
   *
   * Bekliyorsa davet kartı sayfanın **en üstünde** ve renkli. Yeri tesadüf
   * değil: özet ayda bir gün doğuyor ve o gün açılmazsa bir daha çıkmıyor —
   * selamlamanın altına, Araçlar şeridinin arasına konsaydı görülmeden
   * kaydırılıp geçilirdi. Beklemiyorsa kart sayfanın **en altında** ve
   * pasif: kullanıcı özetin var olduğunu ve ne zaman geleceğini görsün.
   */
  ozetHazir: boolean
  /** Bugün ayın 1'i ama kapanan ay yedi etkin gün eşiğine ulaşmadı mı. */
  ozetYetersiz: boolean
  /** Bir sonraki özetin açılacağı gün, 'YYYY-AA-GG' — pasif kartın satırı. */
  sonrakiOzet: string
  onOzetAc: () => void
  /** En son açılan araçlar ve oynanan oyunlar — kısayol kutucuklarının sırası. */
  sonAraclar: string[]
  sonOyunlar: string[]
  onKartAc: (ekran: Ekran) => void
  /** "Araçlar" bölümünün "Tümü" bağlantısı — kart menüsü sekmesini açar. */
  onDahaGit: () => void
  /**
   * Oyunlar sekmesini açar; ders verilirse doğrudan o dersin ızgarasıyla.
   *
   * Kutucuk dersin adını yazıyor ve dokunuşun karşılığı da o ders olmalı —
   * sekmenin başına düşen kullanıcı aynı seçimi bir kez daha yapıyordu.
   */
  onOyunlaraGit: (ders?: DersId) => void
  /**
   * Açılış ekranı hâlâ duruyor mu.
   *
   * Yalnızca başlıktaki maskotu ilgilendiriyor: açılış sürerken gizli
   * kalıyor, yoksa ekranda iki tavşan birden görünüyor.
   */
  acilisSuruyor?: boolean
}) {
  const tarih = bugun()

  const gosterilenAraclar = useMemo(() => kisayollar(KARTLAR, sonAraclar), [sonAraclar])

  const dersler = useMemo(() => doluDersler(), [])
  /*
    Ders kutucuklarının geçmişi ayrı tutulmuyor, oynanan oyunlardan türetiliyor:
    ikinci bir "son açılan ders" listesi aynı bilgiyi ikinci kez saklamak olurdu
    ve oyunu açmakla dersi açmak aynı hareket.
  */
  const gosterilenDersler = useMemo(
    () => kisayollar(dersler, oyunlarinDersleri(sonOyunlar)),
    [dersler, sonOyunlar],
  )

  const bugunku = useMemo(
    () => gunOzeti(gunlukKayitlar.find((k) => k.tarih === tarih)),
    [gunlukKayitlar, tarih],
  )

  /*
    Seri şeridi **içinde bulunulan takvim haftası**: pazartesiden pazara.

    Önce "bugünle biten son yedi gün"dü ve şerit her gün başka bir güne
    kayıyordu — çarşamba günü perşembeyle başlıyordu. Hafta hep aynı yerden
    başlayınca kullanıcı kendi haftasını tanıyor. Türkiye'de hafta pazartesi
    başlar; `getDay()` pazarı 0 saydığı için pazar 6'ya çekiliyor.
  */
  const gunler = useMemo(() => {
    const harita = kayitHaritasi(gunlukKayitlar)
    const bugunkuTarih = tariheCevir(tarih)
    const haftaninGunu = (bugunkuTarih.getDay() + 6) % 7
    const pazartesi = new Date(bugunkuTarih)
    pazartesi.setDate(pazartesi.getDate() - haftaninGunu)

    return Array.from({ length: SERI_GUNU }, (_, sira) => {
      const gun = new Date(pazartesi)
      gun.setDate(gun.getDate() + sira)
      const iso = tariheYaz(gun)
      return {
        iso,
        ad: GUN_ADLARI[gun.getDay()],
        // Hedef sıfırsa "tutturdu" demek anlamsız; kutucuklar boş kalır.
        tuttu: ayarlar.gunlukHedef > 0 && gunOzeti(harita.get(iso)).toplam >= ayarlar.gunlukHedef,
        bugunMu: iso === tarih,
        // Gelecek günler boş kalıyor ama "tutturamadın" gibi durmamalı.
        gelecekMi: iso > tarih,
      }
    })
  }, [gunlukKayitlar, ayarlar.gunlukHedef, tarih])

  const tamamlanan = gunler.filter((g) => g.tuttu).length
  // Yalnızca bu ders yılı: hak her eylülde sıfırlanıyor (devamsızlık ekranıyla aynı süzgeç).
  const devamsizlikDurumu = useMemo(
    () => devamsizlikOzeti(dersYilininKayitlari(devamsizlik)),
    [devamsizlik],
  )

  const hedefTuttu = bugunku.toplam >= ayarlar.gunlukHedef && ayarlar.gunlukHedef > 0
  const maskotDurumu: MaskotDurumu = devamsizlikDurumu.asildi
    ? 'uzgun'
    : hedefTuttu
      ? 'mutlu'
      : bugunku.toplam > 0
        ? 'normal'
        : 'uykulu'

  return (
    <div className="space-y-3.5">
      {ozetHazir && <OzetDaveti onAc={onOzetAc} />}

      {/* Selamlama — tasarımda ad sorulmuyor, kurulumda ad adımı yok. */}
      <header className="flex items-center gap-3 px-0.5 pt-2 pb-1">
        <Rabi durum={maskotDurumu} poz="kafa" boyut={58} gizli={maskotGizli} yuvaMi />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-extrabold tracking-wide text-ikincil">Rabi</p>
          <h1 className="mt-px font-display text-[22px] font-extrabold tracking-tight text-balance">
            {/* Ad kurulumda boş bırakılmış olabilir; o zaman selamlama adsız
                kalıyor, "Merhaba  👋" gibi çift boşluk oluşmuyor. */}
            {ayarlar.ad ? `Merhaba ${ayarlar.ad} 👋` : 'Merhaba 👋'}
          </h1>
        </div>
      </header>

      {/* YKS geri sayımı — haftalık özet davetinin hemen altında, sayfanın en
          görünür yerinde. Kalan gün, sayfadaki her sayının bağlamı. Hedef
          özeti kartın içine, geri sayımın altına giriyor: ikisi de aynı soruya
          bakıyor, ayrı kartlarda dururken aralarındaki bağ kayboluyordu. */}
      <GeriSayim tarih={tarih} sinif={ayarlar.buYilSinif}>
        <HedefOzeti hedef={hedef} guncelSiralama={guncelSiralama} onAc={() => onKartAc('hedef')} />
      </GeriSayim>

      {/* Günlük hedef. Yedi günlük seri buranın altında, ayrı kart değil: seri
          "bugünkü hedefi tutturdun mu"nun yedi günlük hâli, ayrı kartta
          dururken iki ayrı ölçü gibi okunuyordu. */}
      <Kart className="px-4 py-4">
        {/* Halka ve yanındaki satır tıklanabilir: karttaki sayı "bugün kaç soru
            çözdün" ve o sayıyı büyütmenin tek yolu soru takibi ekranı. Kartın
            tamamı değil yalnızca bu satır — altındaki hafta şeridi yedi günü
            anlatıyor, ona basan kullanıcı bugünkü ekrana gitmeyi beklemiyor. */}
        <button
          type="button"
          onClick={() => onKartAc('soru')}
          className="flex w-full items-center gap-4 text-left"
        >
          {/* Halkanın içinde hedef ("/300") yazmıyor: hedef zaten yanda,
              "300 hedefin var" cümlesinde geçiyordu ve iki kez yazılınca göz
              hangisinin bugünkü sayı olduğunu ayırt edemiyordu. */}
          <Halka deger={bugunku.toplam} hedef={ayarlar.gunlukHedef} boyut={78} kalinlik={8}>
            <span className="rakam font-display text-[23px] leading-none font-extrabold">
              {bugunku.toplam}
            </span>
            <span className="mt-1 text-[9.5px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
              soru
            </span>
          </Halka>

          {/* Başlık ve satırlar `span`: düğmenin içi yalnızca metin öğesi
              alıyor, `h2`/`p` orada geçersiz iç içe geçme oluyor. Görünüş
              `block` ile aynı kalıyor. */}
          <span className="min-w-0 flex-1 space-y-1">
            <span className="block font-display text-base font-extrabold tracking-tight">
              Bugünkü soru hedefin
            </span>
            {/*
              Başlığın altındaki tek satır: ilerlemenin kendisi, "190/200".

              Yerinde iki cümle vardı ("200 hedefin var, 200 soru kaldı." ve bir
              teşvik satırı) ve ikisi de aynı sayıyı çevresinde dolaşarak
              anlatıyordu; halkanın içinde zaten duran sayıyı üçüncü kez yazan
              bir kart, okunmadan geçiliyordu. Kesirin okunacak yarısı payda
              değil pay: hedef bağlam, çözülen sayı haber.

              Hedef sıfırsa payda yazılmıyor — "12/0" bölme değil bozukluk gibi
              duruyor.

              Sayının ardındaki "soru" da kalktı: hemen üstünde "Bugünkü soru
              hedefin" yazıyor ve birimi ikinci kez söylemek kesiri okumayı
              yavaşlatıyordu.
            */}
            <span className="rakam block text-[19px] leading-tight font-extrabold">
              {bugunku.toplam}
              {ayarlar.gunlukHedef > 0 && (
                <span className="text-[15px] font-bold text-muted-foreground">
                  /{ayarlar.gunlukHedef}
                </span>
              )}
            </span>
          </span>
        </button>

        {/* Haftanın günleri. Kutucuk değil hap: gün adı okunabilsin diye —
            daire içinde "Cmt" sığmıyordu, adı altına yazınca da satır iki kat
            yer kaplıyordu. */}
        <ul
          aria-label={`Bu hafta ${tamamlanan} günde hedef tuttu`}
          className="mt-3 flex gap-1.5"
        >
          {gunler.map((gun) => (
            <li key={gun.iso} className="flex-1">
              <span
                aria-label={`${gun.ad}: ${
                  gun.gelecekMi ? 'henüz gelmedi' : gun.tuttu ? 'hedef tuttu' : 'hedef tutmadı'
                }`}
                className={cn(
                  'grid h-7 place-items-center rounded-full text-[11.5px] font-extrabold',
                  gun.bugunMu
                    ? 'bg-primary text-primary-foreground'
                    : gun.tuttu
                      ? 'bg-primary-soft text-primary'
                      : gun.gelecekMi
                        ? 'bg-muted/60 text-muted-foreground/60'
                        : 'bg-muted text-muted-foreground',
                )}
              >
                {gun.ad}
              </span>
            </li>
          ))}
        </ul>
      </Kart>

      {/* Günün hâli, hedef kartının hemen altında: yukarıdaki kart "kaç soru"
          diyor, bu kart o sayının ne anlama geldiğini Rabi'nin yüzüyle
          söylüyor. Ayrı kart olması şart — halkanın yanına konsaydı maskot
          sayıyla aynı satırda ikinci bir gösterge olurdu ve ikisi de aynı
          şeyi ölçtüğü için biri gereksiz görünürdü. */}
      <GununHali
        hal={gununHali({
          bugun: tarih,
          hedef: ayarlar.gunlukHedef,
          gunlukKayitlar,
          bekleyenYanlis,
          sonDenemeTarihi,
          kalanGun: geriSayim(tarih, ayarlar.buYilSinif).kalanGun,
        })}
        onAc={onKartAc}
      />

      {/* Devamsızlık uyarısı — yalnızca gerektiğinde görünür */}
      {(devamsizlikDurumu.asildi || devamsizlikDurumu.uyari) && (
        <Not tur={devamsizlikDurumu.asildi ? 'tehlike' : 'uyari'}>
          <span className="flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden />
            <span>
              {devamsizlikDurumu.asildi
                ? 'Devamsızlık hakkını aştın. Okul rehberliğiyle görüşmen gerekebilir.'
                : `Devamsızlık sınırına yaklaştın: özürsüz ${devamsizlikDurumu.ozursuzKalan}, toplam ${devamsizlikDurumu.toplamKalan} gün hakkın kaldı.`}
            </span>
          </span>
        </Not>
      )}

      {/* Ders haritasının ana sayfada girişi yok: alt menüde kendi sekmesi
          (Harita) var. Bir süre burada "Bilgi Kartları" başlıklı bir kart
          duruyordu; iki kapı aynı yere açılıyordu. */}
      {/* Araçlar ve Oyunlar aynı biçimde: başlık + "Tümü", altında tek bir
          kutunun içinde dört yüz. Araçlar bir ara başlıksız ve kutusuz
          duruyordu; iki bölüm yan yana iki ayrı tasarım gibi okunuyordu. */}
      <Bolum baslik="Araçlar 🧰" onTumu={onDahaGit}>
        {gosterilenAraclar.map(({ id, ad, ikon, renk }, sira) => (
          <Kutucuk
            key={id}
            ad={ad}
            ikon={ikon}
            renk={KUTUCUK_RENGI[renk]}
            sira={sira}
            onSec={() => onKartAc(id)}
          />
        ))}
      </Bolum>

      {/* Kutucuklar oyunları değil dersleri gösteriyor: adları kısa, dokunuşun
          karşılığı da tam olarak o dersin ızgarası (bkz. `DERS_RENGI`). */}
      <Bolum baslik="Oyunlar 🎮" onTumu={() => onOyunlaraGit()}>
        {gosterilenDersler.map((ders, sira) => (
          <Kutucuk
            key={ders.id}
            ad={ders.ad}
            ikon={ders.ikon}
            renk={DERS_RENGI[ders.id]}
            sira={sira}
            onSec={() => onOyunlaraGit(ders.id)}
          />
        ))}
      </Bolum>

      {/* Özet beklemiyorken kart en altta ve pasif: ne zaman geleceğini söylüyor. */}
      {!ozetHazir && <OzetBekliyor tarih={sonrakiOzet} yetersiz={ozetYetersiz} />}
    </div>
  )
}

/**
 * "Bugün çalıştın mı" kartı — günün hâlini Rabi'nin pozuyla söylüyor.
 *
 * Cümleyi ve pozu `lib/gunun-hali.ts` seçiyor: eskiden üç sabit hâl vardı
 * (hiç soru / başladın / hedef tuttu), şimdi seri, banka, ders dengesi,
 * ihmal edilen ders, deneme ve sınav yakınlığından bir öneri çıkıyor; hiçbiri
 * tutmazsa üç hâl duruyor. Sayının kendisi burada yazmıyor; halka onu zaten
 * üç kez söylüyor ve kartın işi sayıyı tekrar etmek değil, ona bir yüz vermek.
 *
 * Hedef sıfırken `gununHali` null döner ve kart **çizilmiyor**: hedefi olmayan
 * kullanıcıda "ulaştın" da "ulaşmadın" da anlamsız — ölçülecek bir eşik yok.
 *
 * Dokunuş önerinin işaret ettiği ekranı açıyor (`hal.ekran`): bankayı
 * hatırlatan kart bankayı, denemeyi hatırlatan kart denemeleri.
 */
function GununHali({
  hal,
  onAc,
}: {
  hal: ReturnType<typeof gununHali>
  onAc: (ekran: Ekran) => void
}) {
  if (!hal) return null

  return (
    <button
      type="button"
      onClick={() => onAc(hal.ekran)}
      className="golge-kart flex w-full items-center rounded-2xl bg-card py-3 pr-4 pl-4 text-left transition active:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {/* Maskotun arkasında bir süre hâle göre renklenen bir kutu vardı (gri,
          amber, yeşil); kaldırıldı. Düz renkli kare, kartın beyaz zemininde
          yapıştırılmış bir etiket gibi duruyordu — maskot kartın kendi
          zemininde duruyor. Arkasına bir süre soluk bir leke de kondu,
          kullanıcı onu da geri aldı.

          Maskot 72'de ve ayraca yakın: kartın sol dolgusu 16, ayraçla arası
          0 — görselin kendi saydam payı var, tavşan kutusunun ortasında daha
          dar duruyor ve ayraca yine de değmiyor. Bir süre iki yana 8'er
          piksel verilip tam ortalanmıştı; kullanıcı sağa kaydırılmasını
          istedi. Kutu daha geniş tutulursa yazının alanı daralıp "Bugün hiç
          soru çözmedin" iki satıra kırılıyor.

          Ayağının altında yumuşak bir zemin gölgesi var (bulanık elips,
          `foreground`un %12'si): tavşan kartın üstünde bir yere basıyor.
          `drop-shadow` değil — görselin çevresine sarılan gölge onu kâğıttan
          kesilmiş bir çıkartma gibi gösterirdi. Ayraç `--border` tonunda, beyazda soluk kalıyor ve
          kartın kenarlarına değmeden bitiyor (`self-stretch` içeriğin boyunu
          alıyor, `my-2` iki ucundan kısaltıyor). Birini değiştirirsen iki
          yandaki boşluğu yeniden eşitle. */}
      <span className="relative grid w-[72px] shrink-0 place-items-center">
        <span
          aria-hidden
          className="absolute bottom-0 left-[calc(50%-2px)] h-[7px] w-[36px] -translate-x-1/2 rounded-[50%] bg-foreground/12 blur-[2px]"
        />
        <span className="relative grid">
          <Rabi durum={hal.durum} poz={hal.poz} boyut={72} />
        </span>
      </span>
      <span aria-hidden className="my-2 mr-3 w-px shrink-0 self-stretch bg-border" />
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-extrabold tracking-[0.16em] text-muted-foreground">
          BUGÜN
        </span>
        <span className="mt-0.5 block font-display text-[15.5px] leading-tight font-extrabold tracking-tight">
          {hal.baslik}
        </span>
        <span className="mt-0.5 block text-[12.5px] font-semibold text-muted-foreground">
          {hal.alt}
        </span>
      </span>
      <ChevronRight size={19} className="ml-2 shrink-0 text-muted-foreground" aria-hidden />
    </button>
  )
}

/** Kısayol bölümü: üstte başlık + "Tümü", altında dört yüzü tutan tek kutu. */
function Bolum({
  baslik,
  onTumu,
  children,
}: {
  baslik: string
  onTumu: () => void
  children: React.ReactNode
}) {
  return (
    <section>
      {/* Başlığın altında bir ara açıklama satırı vardı ("Çalışmanı takip
          et"); kaldırıldı. Ana sayfada üst üste üç bölüm var ve her birinin
          altındaki ikinci satır, kutucukların kendisini aşağı itiyordu —
          asıl okunacak şey kutucuklar. */}
      <div className="mb-2 flex items-start justify-between gap-3 px-1">
        <div>
          <h2 className="font-display text-base font-extrabold tracking-tight">{baslik}</h2>
        </div>
        <TumuBaglantisi onSec={onTumu} />
      </div>
      {/* Kutucukları kullanıcının seçtiği bir "Düzenle" penceresi vardı; kalıcı
          olarak kaldırıldı (`kisayol-duzenle.tsx` silindi). Dört yüz yalnızca
          son kullanılanlardan geliyor: sıralamayı kullanan belirliyor, ayrıca
          kurulacak bir tercih yok. */}
      <Kart className="px-2.5 py-3.5">
        <div className="grid grid-cols-4 gap-2">{children}</div>
      </Kart>
    </section>
  )
}

function TumuBaglantisi({ onSec }: { onSec: () => void }) {
  return (
    <button
      type="button"
      onClick={onSec}
      className="shrink-0 rounded-lg px-1.5 py-0.5 text-[13px] font-extrabold text-primary transition active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      Tümü →
    </button>
  )
}

/**
 * Pastel yuvarlak kare içinde emoji, altında ad. Araçlar ve Oyunlar aynı
 * kutucuğu kullanır.
 *
 * Daireydi ve dört daire yan yana dizildiğinde satır bir simge şeridi gibi
 * duruyordu; köşeleri yumuşatılmış kare, kartın ve seçim kartlarının diliyle
 * aynı ve aynı yerde daha çok renk taşıyor — dokunulacak bir yüzey olduğu
 * daha çabuk okunuyor.
 */
function Kutucuk({
  ad,
  ikon,
  renk,
  sira,
  onSec,
}: {
  ad: string
  ikon: string
  /** Dairenin pastel zemin sınıfı. */
  renk: string
  /** Izgaradaki sırası — kutucuklar bu sırayla beliriyor. */
  sira: number
  onSec: () => void
}) {
  const giris = kartGirisi(sira)

  return (
    <button
      type="button"
      onClick={onSec}
      style={giris.style}
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-2xl px-1 py-1.5 transition active:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        giris.className,
      )}
    >
      {/* `aspect-square` + `w-full`: kutu sütunun genişliğini alıyor, dar
          telefonda küçülüyor. Üst sınır olmasaydı geniş ekranda dört kocaman
          kare olurdu. */}
      <span
        className={cn('grid aspect-square w-full max-w-[64px] place-items-center rounded-[18px]', renk)}
      >
        <span className="text-[26px] leading-none" aria-hidden>
          {ikon}
        </span>
      </span>
      <span className="text-[11px] leading-tight font-bold text-balance text-muted-foreground">
        {ad}
      </span>
    </button>
  )
}

/**
 * Haftalık özet daveti — sayfanın en üstündeki tek kart.
 *
 * Uygulamanın kırık beyaz zemininden **ayrı** duruyor: koyu amber ve altında
 * beliren bir parıltı. Öteki kartların diliyle çizilseydi araç kutucuklarının
 * arasında sıradan bir satır olurdu; buradaki şey haftada bir kez gelen ve
 * kaçırılmaması gereken bir davet. Aynı zemin, açtığı hikâyenin de zemini —
 * dokunulan kart ile açılan ekran tek bir hareket gibi okunuyor.
 *
 * Kapatma düğmesi **yok**: kart zaten kendiliğinden kalkıyor, çünkü özet
 * açıldığı anda "izlendi" işaretleniyor. İkinci bir kapatma yolu, hikâyeyi hiç
 * görmeden özeti tüketmenin yolu olurdu.
 */
function OzetDaveti({ onAc }: { onAc: () => void }) {
  return (
    <button
      type="button"
      onClick={onAc}
      className="relative mt-2 flex w-full items-center gap-3.5 overflow-hidden rounded-2xl px-4 py-4 text-left text-white shadow-[0_10px_26px_rgba(90,32,10,.28)] transition active:brightness-95"
      style={{ background: 'linear-gradient(150deg,#E07A34 0%,#B3491F 56%,#83300F 100%)' }}
    >
      {/* Işıma maskotun arkasında: kartın soluna bakması için bir sebep. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-8 h-36 w-36 rounded-full"
        style={{ background: 'radial-gradient(circle,rgba(255,244,225,.35),transparent 68%)' }}
      />
      <Rabi durum="kutlama" poz="el-sallayan" boyut={46} className="relative shrink-0" />
      <span className="relative min-w-0 flex-1">
        <span className="block text-[10px] font-extrabold tracking-[0.18em] text-white/70">
          AY KAPANDI · BUGÜNE ÖZEL
        </span>
        <span className="mt-1 block font-display text-[17px] leading-tight font-extrabold">
          Aylık özetin hazır
        </span>
        <span className="mt-0.5 block text-[12.5px] font-semibold text-white/80">
          Yalnızca bugün açılıyor — Rabi’yle sayfaları çevir
        </span>
      </span>
      <ChevronRight size={20} className="relative shrink-0 text-white/75" aria-hidden />
    </button>
  )
}

/**
 * Özetin pasif hâli — sayfanın en altında, dokunulamıyor.
 *
 * Kartın var olması bilerek: özet ayda bir gün ve yalnızca o gün geliyor;
 * ortada hiç görünmeyen bir özet, ilk kez çıktığında nereden geldiği
 * anlaşılmayan bir kart olurdu. Pasif kart tarihi söylüyor, gün gelince
 * aynı kart sayfanın tepesine çıkıp renkleniyor.
 */
function OzetBekliyor({ tarih, yetersiz }: { tarih: string; yetersiz: boolean }) {
  return (
    <div
      aria-disabled
      className="flex w-full items-center gap-3.5 rounded-2xl border border-dashed border-muted-foreground/30 bg-card/60 px-4 py-3.5 text-left opacity-70"
    >
      <Rabi durum="uykulu" poz="kahveli" boyut={40} className="shrink-0 grayscale" />
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-extrabold tracking-[0.18em] text-muted-foreground">
          AYLIK ÖZET
        </span>
        <span className="mt-0.5 block font-display text-[15px] leading-tight font-extrabold text-muted-foreground">
          {yetersiz ? 'Geçen ay yeterli etkin gün oluşmadı' : `${gunDe(tarih)} açılır`}
        </span>
        <span className="mt-0.5 block text-[12px] font-semibold text-muted-foreground/80">
          {yetersiz
            ? `En az ${AYLIK_OZET_EN_AZ_ETKIN_GUN} gün gerekiyor · Sonraki özet ${gunDe(tarih)} açılır`
            : 'Ayın hikâyesi yalnızca o gün görülür'}
        </span>
      </span>
    </div>
  )
}

/**
 * Geri sayım kartının içindeki hedef özeti.
 *
 * Hedef yazılmamışsa da görünüyor: boşluğu doldurmak için değil, hedefin
 * girilebilir bir şey olduğunu söylemek için — kart menüsünde kaybolduğunda
 * kullanıcı hiç girmiyordu.
 */
function HedefOzeti({
  hedef,
  guncelSiralama,
  onAc,
}: {
  hedef: Hedef | null
  guncelSiralama: number | null
  onAc: () => void
}) {
  const uzaklik =
    hedef?.basariSirasi != null && guncelSiralama !== null
      ? guncelSiralama - hedef.basariSirasi
      : null

  return (
    <button type="button" onClick={onAc} className="flex w-full items-center gap-3 text-left">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
        <Target size={18} strokeWidth={2.4} aria-hidden />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[10.5px] font-extrabold uppercase tracking-[0.09em] text-muted-foreground">
          Hedefim
        </span>
        {hedef ? (
          <>
            <span className="mt-0.5 block truncate text-[13.5px] leading-tight font-extrabold">
              {hedef.bolum}
            </span>
            <span className="block truncate text-xs font-semibold text-muted-foreground">
              {hedef.universite}
            </span>
          </>
        ) : (
          <span className="mt-0.5 block text-[13px] leading-snug font-semibold text-muted-foreground">
            Hedef bölümünü yaz, sıralamana ne kadar kaldığını takip edeyim.
          </span>
        )}
      </span>

      {/* Sağdaki sayı "hedefe ne kadar kaldı"nın tek satırlık hâli. Deneme
          girilmemişse gereken sıralama yazılıyor: karşılaştıracak bir şey yok. */}
      {hedef?.basariSirasi != null && (
        <span className="shrink-0 text-right">
          {uzaklik === null ? (
            <>
              <span className="rakam block text-[15px] font-extrabold text-primary">
                {siraYaz(hedef.basariSirasi)}
              </span>
              <span className="block text-[10.5px] font-semibold text-muted-foreground">
                gereken sıra
              </span>
            </>
          ) : uzaklik <= 0 ? (
            <>
              <span className="block text-[13px] font-extrabold text-success">Hedefindesin</span>
              <span className="block text-[10.5px] font-semibold text-muted-foreground">
                tahmini sıralamana göre
              </span>
            </>
          ) : (
            <>
              <span className="rakam block text-[15px] font-extrabold text-primary">
                {siraYaz(uzaklik)}
              </span>
              <span className="block text-[10.5px] font-semibold text-muted-foreground">
                sıra uzakta
              </span>
            </>
          )}
        </span>
      )}
    </button>
  )
}
