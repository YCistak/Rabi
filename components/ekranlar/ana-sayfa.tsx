'use client'

import { useMemo } from 'react'
import { AlertTriangle, ChevronRight, Sparkles, Target } from 'lucide-react'
import type { Ayarlar, Devamsizlik, GunlukKayit, Hedef, OyunId } from '@/lib/types'
import { devamsizlikOzeti, gunOzeti, kayitHaritasi } from '@/lib/hesap'
import { bugun, cn, tariheCevir, tariheYaz } from '@/lib/utils'
import { siraYaz } from '@/lib/siralama'
import { KARTLAR, type Ekran, type KartRengi } from '@/lib/gezinme'
import { kisayollar } from '@/lib/son-kullanilan'
import { OYUNLAR } from '@/lib/oyunlar/tanim'
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

/** Oyunların kendi aileleri var; ana sayfadaki kutucuk da aynı rengi taşımalı. */
const OYUN_RENGI: Record<OyunId, string> = {
  yazim: 'bg-yzm-kart',
  ses: 'bg-yzm-kart',
  oge: 'bg-yzm-kart',
  soz: 'bg-yzm-kart',
  anlatim: 'bg-yzm-kart',
  islem: 'bg-isl-kart',
  bolunme: 'bg-isl-kart',
  aci: 'bg-isl-kart',
  ucgen: 'bg-isl-kart',
  koklu: 'bg-isl-kart',
  edebiyat: 'bg-edb-kart',
  harita: 'bg-cog-kart',
  antlasma: 'bg-trh-kart',
  kavram: 'bg-trh-kart',
  ortak: 'bg-byl-kart',
  siniflandirma: 'bg-byl-kart',
  hucre: 'bg-byl-kart',
  sirala: 'bg-trh-kart',
  tuzak: 'bg-isl-kart',
}

export function AnaSayfa({
  maskotGizli,
  ayarlar,
  gunlukKayitlar,
  devamsizlik,
  hedef,
  guncelSiralama,
  ozetBekliyor,
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
  /** Biten haftanın özeti henüz izlenmediyse davet kartı gösterilir. */
  ozetBekliyor: boolean
  /** En son açılan araçlar ve oynanan oyunlar — kısayol kutucuklarının sırası. */
  sonAraclar: string[]
  sonOyunlar: string[]
  onKartAc: (ekran: Ekran) => void
  /** "Araçlar" bölümünün "Tümü" bağlantısı — kart menüsü sekmesini açar. */
  onDahaGit: () => void
  /** "Oyunlar" kartındaki her kutucuk oyun sekmesini açar. */
  onOyunlaraGit: () => void
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
  const gosterilenOyunlar = useMemo(() => kisayollar(OYUNLAR, sonOyunlar), [sonOyunlar])

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
  const kalan = Math.max(0, ayarlar.gunlukHedef - bugunku.toplam)
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

      {/* Haftalık özet daveti — biten haftanın özeti izlenmediyse en üstte.
          Ana sayfanın en görünür yeri burası; kart menüsüne konsaydı özet
          çıktığından haberi olmayan kullanıcı hiç açmazdı. Fuşya, tasarımın
          dikkat rengi. */}
      {ozetBekliyor && (
        <button
          type="button"
          onClick={() => onKartAc('haftalik-ozet')}
          className="acilis-girisi flex w-full items-center gap-3 rounded-[22px] bg-ikincil px-4 py-3.5 text-left text-white transition active:brightness-95"
        >
          <Sparkles size={22} className="shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block font-display font-extrabold">Haftalık özetin hazır</span>
            <span className="block text-xs font-medium text-white/85">
              Geçen haftanı kart kart izle, paylaş
            </span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-white/85" aria-hidden />
        </button>
      )}

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
        <div className="flex items-center gap-4">
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

          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="font-display text-base font-extrabold tracking-tight">
              Bugünkü soru hedefin
            </h2>
            {/* Satırın tamamı ince, yalnız "kaç soru kaldı" kalın: göz kartta
                tek bir sayı arıyor ve o sayı bu. Hedefin kendisi bağlam. */}
            <p className="rakam text-[13px] leading-snug font-medium text-muted-foreground">
              {ayarlar.gunlukHedef} hedefin var,{' '}
              <strong className="font-extrabold text-foreground">{kalan} soru kaldı.</strong>
            </p>
            <p className="text-[13px] leading-snug font-medium text-muted-foreground">
              {hedefCumlesi(bugunku.toplam, kalan, ayarlar.gunlukHedef, hedefTuttu)}
            </p>
          </div>
        </div>

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

      {/* Araçlar ve Oyunlar aynı biçimde: başlık + "Tümü", altında tek bir
          kutunun içinde dört yüz. Araçlar bir ara başlıksız ve kutusuz
          duruyordu; iki bölüm yan yana iki ayrı tasarım gibi okunuyordu. */}
      <Bolum baslik="Araçlar 🧰" onTumu={onDahaGit}>
        {gosterilenAraclar.map(({ id, ad, ikon, renk }) => (
          <Kutucuk key={id} ad={ad} ikon={ikon} renk={KUTUCUK_RENGI[renk]} onSec={() => onKartAc(id)} />
        ))}
      </Bolum>

      <Bolum baslik="Oyunlar 🎮" onTumu={onOyunlaraGit}>
        {gosterilenOyunlar.map((oyun) => (
          <Kutucuk
            key={oyun.id}
            ad={oyun.ad}
            ikon={oyun.ikon}
            renk={OYUN_RENGI[oyun.id]}
            onSec={onOyunlaraGit}
          />
        ))}
      </Bolum>
    </div>
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
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <h2 className="font-display text-base font-extrabold tracking-tight">{baslik}</h2>
        <TumuBaglantisi onSec={onTumu} />
      </div>
      <Kart className="px-2.5 py-3.5">
        <div className="grid grid-cols-4 gap-1.5">{children}</div>
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

/** Pastel daire içinde emoji, altında ad. Araçlar ve Oyunlar aynı kutucuğu kullanır. */
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
      <span className={cn('grid size-11 place-items-center rounded-full', renk)}>
        <span className="text-[22px] leading-none" aria-hidden>
          {ikon}
        </span>
      </span>
      <span className="text-[10.5px] leading-tight font-bold text-balance text-muted-foreground">
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

/** Hedef halkasının yanındaki cümle. */
/**
 * Halkanın yanındaki ikinci satır — teşvik cümlesi.
 *
 * Sayı geçmiyor: üstteki satır zaten "şu kadar hedefin var, şu kadar kaldı"
 * diyor ve iki satır aynı rakamı iki kez yazınca ikisi de okunmuyordu.
 */
function hedefCumlesi(cozulen: number, kalan: number, hedef: number, hedefTuttu: boolean): string {
  if (hedefTuttu) return 'Hedefi tutturdun, fazlası cabası 🎉'
  if (hedef > 0 && kalan <= hedef / 4) return 'Az kaldı, bugünün kapatalım 🎉'
  if (cozulen > 0) return 'Başladın bile, devam.'
  return "Bir 20'lik çözmek bile seriyi başlatır."
}
