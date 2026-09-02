'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, ChevronRight, Pencil, Target } from 'lucide-react'
import type { Ayarlar, Devamsizlik, GunlukKayit, Hedef } from '@/lib/types'
import { devamsizlikOzeti, gunOzeti, kayitHaritasi } from '@/lib/hesap'
import { bugun, cn, tariheCevir, tariheYaz } from '@/lib/utils'
import { siraYaz } from '@/lib/siralama'
import { KARTLAR, type Ekran, type KartRengi } from '@/lib/gezinme'
import { sabitliKisayollar } from '@/lib/son-kullanilan'
import { doluDersler, oyunlarinDersleri, type DersId, type DersTanimi } from '@/lib/oyunlar/tanim'
import { KisayolDuzenleme } from '@/components/kisayol-duzenle'
import { Halka, Kart, Not } from '@/components/ui'
import { GeriSayim } from '@/components/geri-sayim'
import { Rabi, type MaskotDurumu } from '@/components/maskot/rabi'

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
 * Renk `DersTanimi.aile`den geliyor — "renk derse aittir" kuralının doğrudan
 * karşılığı. Sınıflar Tailwind'in taramasına takılsın diye tam yazılı.
 */
const DERS_RENGI: Record<DersTanimi['aile'], string> = {
  yzm: 'bg-yzm-kart',
  isl: 'bg-isl-kart',
  edb: 'bg-edb-kart',
  cog: 'bg-cog-kart',
  trh: 'bg-trh-kart',
  byl: 'bg-byl-kart',
}

export function AnaSayfa({
  maskotGizli,
  ayarlar,
  gunlukKayitlar,
  devamsizlik,
  hedef,
  guncelSiralama,
  bilinmeyenSayisi,
  sonAraclar,
  sonOyunlar,
  sabitAraclar,
  setSabitAraclar,
  sabitDersler,
  setSabitDersler,
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
  /** Konu Anlatımı'nda "bilmiyorum" denen kart sayısı — bölümün alt satırı. */
  bilinmeyenSayisi: number
  /** Biten haftanın özeti henüz izlenmediyse davet kartı gösterilir. */
  /** En son açılan araçlar ve oynanan oyunlar — kısayol kutucuklarının sırası. */
  sonAraclar: string[]
  sonOyunlar: string[]
  /** Kullanıcının sabitlediği araçlar; boşsa kutucukları son kullanılanlar doldurur. */
  sabitAraclar: string[]
  setSabitAraclar: (secim: string[]) => void
  /** Sabitlenen dersler — oyun kutucukları ders gösteriyor. */
  sabitDersler: string[]
  setSabitDersler: (secim: string[]) => void
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

  /** Açık düzenleme penceresi; null ise kapalı. */
  const [duzenlenen, setDuzenlenen] = useState<'arac' | 'ders' | null>(null)

  const gosterilenAraclar = useMemo(
    () => sabitliKisayollar(KARTLAR, sabitAraclar, sonAraclar),
    [sabitAraclar, sonAraclar],
  )

  const dersler = useMemo(() => doluDersler(), [])
  /*
    Ders kutucuklarının geçmişi ayrı tutulmuyor, oynanan oyunlardan türetiliyor:
    ikinci bir "son açılan ders" listesi aynı bilgiyi ikinci kez saklamak olurdu
    ve oyunu açmakla dersi açmak aynı hareket.
  */
  const gosterilenDersler = useMemo(
    () => sabitliKisayollar(dersler, sabitDersler, oyunlarinDersleri(sonOyunlar)),
    [dersler, sabitDersler, sonOyunlar],
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
  const devamsizlikDurumu = useMemo(() => devamsizlikOzeti(devamsizlik), [devamsizlik])

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
      {/* Selamlama — tasarımda ad sorulmuyor, kurulumda ad adımı yok. */}
      <header className="flex items-center gap-3 px-0.5 pt-2 pb-1">
        <Rabi durum={maskotDurumu} boyut={58} gizli={maskotGizli} yuvaMi />
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
      <GeriSayim tarih={tarih}>
        <HedefOzeti hedef={hedef} guncelSiralama={guncelSiralama} onAc={() => onKartAc('hedef')} />
      </GeriSayim>

      {/* Günlük hedef. Yedi günlük seri buranın altında, ayrı kart değil: seri
          "bugünkü hedefi tutturdun mu"nun yedi günlük hâli, ayrı kartta
          dururken iki ayrı ölçü gibi okunuyordu. */}
      <Kart className="px-5 py-5">
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
          <Halka deger={bugunku.toplam} hedef={ayarlar.gunlukHedef} boyut={92} kalinlik={9}>
            <span className="rakam font-display text-[27px] leading-none font-extrabold">
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
            */}
            <span className="rakam block text-[19px] leading-tight font-extrabold">
              {bugunku.toplam}
              {ayarlar.gunlukHedef > 0 && (
                <span className="text-[15px] font-bold text-muted-foreground">
                  /{ayarlar.gunlukHedef}
                </span>
              )}
              <span className="ml-1 text-[13px] font-bold text-muted-foreground">soru</span>
            </span>
          </span>
        </button>

        {/* Haftanın günleri. Kutucuk değil hap: gün adı okunabilsin diye —
            daire içinde "Cmt" sığmıyordu, adı altına yazınca da satır iki kat
            yer kaplıyordu. */}
        <ul
          aria-label={`Bu hafta ${tamamlanan} günde hedef tuttu`}
          className="mt-4 flex gap-1.5"
        >
          {gunler.map((gun) => (
            <li key={gun.iso} className="flex-1">
              <span
                aria-label={`${gun.ad}: ${
                  gun.gelecekMi ? 'henüz gelmedi' : gun.tuttu ? 'hedef tuttu' : 'hedef tutmadı'
                }`}
                className={cn(
                  'grid h-8 place-items-center rounded-full text-[11.5px] font-extrabold',
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

      {/* Devamsızlık uyarısı — yalnızca gerektiğinde görünür */}
      {(devamsizlikDurumu.asildi || devamsizlikDurumu.uyari) && (
        <Not tur={devamsizlikDurumu.asildi ? 'tehlike' : 'uyari'}>
          <span className="flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden />
            <span>
              {devamsizlikDurumu.asildi
                ? 'Devamsızlık hakkını aştın. Okul rehberliğiyle görüşmen gerekebilir.'
                : `Devamsızlık sınırına yaklaştın: özürsüz ${devamsizlikDurumu.ozursuzKalan}, özürlü ${devamsizlikDurumu.ozurluKalan} gün hakkın kaldı.`}
            </span>
          </span>
        </Not>
      )}

      {/*
        Konu Anlatımı kendi bölümü, kısayol kutucuğu değil.

        Araçlar şeridine bir kutucuk olarak konsaydı sıraya girip son
        kullanılanlarla birlikte kayardı; buradaki iş "aç ve oku" ve her gün
        aynı yerde durması gerekiyor. Kart menüsünde de yok — aynı şeyin iki
        girişi, hemen altındaki Araçlar kutusunda ikinci bir kopya demekti.
      */}
      <section>
        <div className="mb-2 px-1">
          <h2 className="font-display text-base font-extrabold tracking-tight">
            Konu Anlatımı 📚
          </h2>
          <p className="text-xs text-muted-foreground">Maarif müfredatı, bilgi kartlarıyla</p>
        </div>
        <button
          type="button"
          onClick={() => onKartAc('konu')}
          className="golge-kart flex w-full items-center gap-3.5 rounded-2xl bg-card px-4 py-4 text-left transition active:brightness-[0.98]"
        >
          <span
            className="grid size-12 shrink-0 place-items-center rounded-[18px] bg-primary-soft text-[24px]"
            aria-hidden
          >
            🗺️
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-[15.5px] font-extrabold tracking-tight">
              Ders haritasını aç
            </span>
            {/* Alt satır ya bankadaki kartları ya da neyi kapsadığını söylüyor:
                banka boşken sayı yazmak "0 kart" gibi ölü bir satır olurdu. */}
            <span className="mt-0.5 block text-[13px] leading-snug font-semibold text-muted-foreground">
              {bilinmeyenSayisi > 0
                ? `Bilmediklerinde ${bilinmeyenSayisi} kart bekliyor`
                : '9 ve 10. sınıf · yedi ders'}
            </span>
          </span>
          <ChevronRight size={19} className="shrink-0 text-muted-foreground" aria-hidden />
        </button>
      </section>

      {/* Araçlar ve Oyunlar aynı biçimde: başlık + "Tümü", altında tek bir
          kutunun içinde dört yüz. Araçlar bir ara başlıksız ve kutusuz
          duruyordu; iki bölüm yan yana iki ayrı tasarım gibi okunuyordu. */}
      <Bolum
        baslik="Araçlar 🧰"
        aciklama="Çalışmanı takip et"
        onTumu={onDahaGit}
        onDuzenle={() => setDuzenlenen('arac')}
      >
        {gosterilenAraclar.map(({ id, ad, ikon, renk }) => (
          <Kutucuk key={id} ad={ad} ikon={ikon} renk={KUTUCUK_RENGI[renk]} onSec={() => onKartAc(id)} />
        ))}
      </Bolum>

      {/* Kutucuklar oyunları değil dersleri gösteriyor: adları kısa, dokunuşun
          karşılığı da tam olarak o dersin ızgarası (bkz. `DERS_RENGI`). */}
      <Bolum
        baslik="Oyunlar 🎮"
        aciklama="Eğlenerek pratik yap"
        onTumu={() => onOyunlaraGit()}
        onDuzenle={() => setDuzenlenen('ders')}
      >
        {gosterilenDersler.map((ders) => (
          <Kutucuk
            key={ders.id}
            ad={ders.ad}
            ikon={ders.ikon}
            renk={DERS_RENGI[ders.aile]}
            onSec={() => onOyunlaraGit(ders.id)}
          />
        ))}
      </Bolum>

      <KisayolDuzenleme
        acik={duzenlenen === 'arac'}
        baslik="Araç kısayolların"
        secenekler={KARTLAR.map((kart) => ({
          id: kart.id,
          ad: kart.ad,
          ikon: kart.ikon,
          renk: KUTUCUK_RENGI[kart.renk],
          aciklama: kart.aciklama,
        }))}
        secili={sabitAraclar}
        onKaydet={setSabitAraclar}
        onKapat={() => setDuzenlenen(null)}
      />

      <KisayolDuzenleme
        acik={duzenlenen === 'ders'}
        baslik="Oyun kısayolların"
        secenekler={dersler.map((ders) => ({
          id: ders.id,
          ad: ders.ad,
          ikon: ders.ikon,
          renk: DERS_RENGI[ders.aile],
          aciklama: ders.aciklama,
        }))}
        secili={sabitDersler}
        onKaydet={setSabitDersler}
        onKapat={() => setDuzenlenen(null)}
      />
    </div>
  )
}

/** Kısayol bölümü: üstte başlık + "Tümü", altında dört yüzü tutan tek kutu. */
function Bolum({
  baslik,
  aciklama,
  onTumu,
  onDuzenle,
  children,
}: {
  baslik: string
  /** Başlığın altındaki tek satır: bölümün ne işe yaradığı. */
  aciklama: string
  onTumu: () => void
  /** Dört kutucuğu seçme penceresini açar. */
  onDuzenle: () => void
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="mb-2 flex items-start justify-between gap-3 px-1">
        <div>
          <h2 className="font-display text-base font-extrabold tracking-tight">{baslik}</h2>
          {/* Dört kısayol iki bölümde de emoji ve addan ibaret; "Araçlar" ile
              "Oyunlar" arasındaki farkı ilk kez açan kullanıcıya söyleyen tek
              satır bu. */}
          <p className="text-xs text-muted-foreground">{aciklama}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {/*
            Kalem yazısız duruyor: "Düzenle" ile "Tümü" yan yana iki bağlantı
            olsaydı ikisi de aynı ağırlıkta okunur, asıl yol olan "Tümü"
            kaybolurdu. Erişilebilir adı `aria-label`da.
          */}
          <button
            type="button"
            onClick={onDuzenle}
            aria-label={`${baslik} kısayollarını düzenle`}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition active:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Pencil size={15} strokeWidth={2.6} aria-hidden />
          </button>
          <TumuBaglantisi onSec={onTumu} />
        </div>
      </div>
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
  onSec,
}: {
  ad: string
  ikon: string
  /** Dairenin pastel zemin sınıfı. */
  renk: string
  onSec: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSec}
      className="flex flex-col items-center gap-1.5 rounded-2xl px-1 py-1.5 transition active:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
