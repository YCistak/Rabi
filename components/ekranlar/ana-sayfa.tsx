'use client'

import { useMemo } from 'react'
import { AlertTriangle, Carrot, ChevronRight, Sparkles, Target } from 'lucide-react'
import type { Ayarlar, Devamsizlik, GunlukKayit, Hedef, OyunId } from '@/lib/types'
import { devamsizlikOzeti, gunOzeti, kayitHaritasi, netYaz } from '@/lib/hesap'
import { bugun, cn, tariheCevir, tariheYaz } from '@/lib/utils'
import { sozSec } from '@/lib/sozler'
import { siraYaz } from '@/lib/siralama'
import { KARTLAR, type Ekran, type KartRengi } from '@/lib/gezinme'
import { kisayollar } from '@/lib/son-kullanilan'
import { OYUNLAR } from '@/lib/oyunlar/tanim'
import { Halka, Kart, Not } from '@/components/ui'
import { GeriSayim } from '@/components/geri-sayim'
import { Rabi, type MaskotDurumu } from '@/components/maskot/rabi'

/** Seride gösterilen gün sayısı. Tasarımda kart "7 günlük seri" diye adlandırılıyor. */
const SERI_GUNU = 7

/**
 * `getDay()` sırasına göre kısa gün adları. `toLocaleDateString` yerine sabit
 * liste kullanılıyor: statik dışa aktarımda cihazın yereli farklıysa
 * kısaltmalar değişir ve yedi kutucuğun genişliği bozulurdu.
 */
const GUN_ADLARI = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

/** Kutucuk yüzleri — `KARTLAR`'daki pastel aile adları tema değişkenlerine bağlanıyor. */
const KUTUCUK_RENGI: Record<KartRengi, string> = {
  mavi: 'bg-primary-soft text-primary',
  pembe: 'bg-yzm-kart text-yzm-koyu',
  krem: 'bg-isl-kart text-isl-koyu',
  nane: 'bg-success-soft text-success',
  lavanta: 'bg-edb-kart text-edb-koyu',
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
}

export function AnaSayfa({
  ayarlar,
  gunlukKayitlar,
  devamsizlik,
  hedef,
  guncelSiralama,
  ozetBekliyor,
  sonAraclar,
  sonOyunlar,
  havuc,
  onKartAc,
  onDahaGit,
  onOyunlaraGit,
}: {
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
  /** Havuç bakiyesi — sağ üstteki rozette yazıyor. */
  havuc: number
  onKartAc: (ekran: Ekran) => void
  /** "Araçlar" başlığındaki "Tümü" — kart menüsünün tamamına götürür. */
  onDahaGit: () => void
  /** "Oyunlar" kartındaki her kutucuk oyun sekmesini açar. */
  onOyunlaraGit: () => void
}) {
  const tarih = bugun()

  // Söz gün boyunca sabit kalsın diye tohum olarak tarih verilir; her yeniden
  // çizimde değişse okunamadan kaybolurdu.
  const soz = useMemo(() => sozSec(tarih), [tarih])

  const gosterilenAraclar = useMemo(() => kisayollar(KARTLAR, sonAraclar), [sonAraclar])
  const gosterilenOyunlar = useMemo(() => kisayollar(OYUNLAR, sonOyunlar), [sonOyunlar])

  const bugunku = useMemo(
    () => gunOzeti(gunlukKayitlar.find((k) => k.tarih === tarih)),
    [gunlukKayitlar, tarih],
  )

  // Seri kartı bugünle biten yedi günü gösteriyor: sağa doğru ilerleyen bir
  // takvim yerine "bugüne kadar ne yaptın" okuması isteniyor.
  const gunler = useMemo(() => {
    const harita = kayitHaritasi(gunlukKayitlar)
    const son = tariheCevir(tarih)
    return Array.from({ length: SERI_GUNU }, (_, sira) => {
      const gun = new Date(son)
      gun.setDate(gun.getDate() - (SERI_GUNU - 1 - sira))
      const iso = tariheYaz(gun)
      return {
        iso,
        ad: GUN_ADLARI[gun.getDay()],
        // Hedef sıfırsa "tutturdu" demek anlamsız; kutucuklar boş kalır.
        tuttu: ayarlar.gunlukHedef > 0 && gunOzeti(harita.get(iso)).toplam >= ayarlar.gunlukHedef,
        bugunMu: iso === tarih,
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
        <Rabi durum={maskotDurumu} boyut={58} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-extrabold tracking-wide text-ikincil">Rabi</p>
          <h1 className="mt-px font-display text-xl font-extrabold tracking-tight text-balance">
            Merhaba 👋
          </h1>
          <p className="mt-0.5 text-[13px] leading-snug font-medium text-muted-foreground">
            {durumCumlesi(bugunku.toplam, kalan, hedefTuttu, tamamlanan)}
          </p>
        </div>

        {/* Havuç bakiyesi. Düğme değil, çünkü götüreceği bir yer yok: havucu
            harcayan ya da kazandıran bir özellik henüz yazılmadı. Dokunulunca
            hiçbir şey yapmayan bir düğme, bozuk bir düğmeden farksız olurdu. */}
        <p
          aria-label={`${havuc} havucun var`}
          className="flex shrink-0 items-center gap-1.5 self-start rounded-full bg-isl-kart px-2.5 py-1.5 text-isl-koyu"
        >
          <Carrot size={16} strokeWidth={2.6} aria-hidden />
          <span className="rakam text-sm font-extrabold">{havuc}</span>
        </p>
      </header>

      {/* Haftalık özet daveti — biten haftanın özeti izlenmediyse en üstte.
          Ana sayfanın en görünür yeri burası; kart menüsüne konsaydı özet
          çıktığından haberi olmayan kullanıcı hiç açmazdı. Mercan, tasarımın
          dikkat rengi. */}
      {ozetBekliyor && (
        <button
          type="button"
          onClick={() => onKartAc('haftalik-ozet')}
          className="acilis-girisi flex w-full items-center gap-3 rounded-2xl bg-ikincil px-4 py-3.5 text-left text-white transition active:brightness-95"
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
          <Halka deger={bugunku.toplam} hedef={ayarlar.gunlukHedef} boyut={92} kalinlik={9}>
            <span className="rakam font-display text-[27px] leading-none font-extrabold">
              {bugunku.toplam}
            </span>
            <span className="rakam mt-1 text-xs font-bold text-muted-foreground">
              / {ayarlar.gunlukHedef}
            </span>
          </Halka>

          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="font-display text-base font-extrabold tracking-tight">
              Bugünkü soru hedefin
            </h2>
            <p className="text-[13px] leading-snug font-semibold text-muted-foreground">
              {hedefCumlesi(bugunku.toplam, kalan, hedefTuttu)}
            </p>
            {bugunku.toplam > 0 && (
              <p className="rakam text-xs font-medium text-muted-foreground/80">
                {bugunku.dogru} doğru · {bugunku.yanlis} yanlış · {netYaz(bugunku.net)} net
              </p>
            )}
          </div>
        </div>

        {/* Yedi günlük seri. Kutucuk değil hap: gün adı okunabilsin diye —
            daire içinde "Cmt" sığmıyordu, adı altına yazınca da satır iki kat
            yer kaplıyordu. */}
        <ul
          aria-label={`Son ${SERI_GUNU} gün: ${tamamlanan} günde hedef tuttu`}
          className="mt-4 flex gap-1.5"
        >
          {gunler.map((gun) => (
            <li key={gun.iso} className="flex-1">
              <span
                aria-label={`${gun.ad}: ${gun.tuttu ? 'hedef tuttu' : 'hedef tutmadı'}`}
                className={cn(
                  'grid h-8 place-items-center rounded-full text-[11.5px] font-extrabold',
                  gun.tuttu
                    ? 'bg-primary text-primary-foreground'
                    : gun.bugunMu
                      ? 'bg-primary-soft text-primary'
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

      {/* Araçlar — en son açılan dördü; hiç açılmamışsa `KARTLAR`'ın başı.
          Kart içinde değil, doğrudan zeminde duran dört kutucuk: kartın içine
          konunca ana sayfa üst üste yığılmış kutuların listesine dönüyordu. */}
      <Bolum baslik="Araçlar 🧰" onTumu={onDahaGit}>
        {gosterilenAraclar.map(({ id, ad, Simge, renk }) => (
          <Kutucuk key={id} ad={ad} onSec={() => onKartAc(id)}>
            <span className={cn('grid size-11 place-items-center rounded-2xl', KUTUCUK_RENGI[renk])}>
              <Simge size={22} aria-hidden />
            </span>
          </Kutucuk>
        ))}
      </Bolum>

      {/* Oyunlar — en son oynanan dördü; hiç oynanmamışsa `OYUNLAR`'ın başı.
          Yüz daire, araç kutucuklarının yuvarlak karesi değil: oyunlar bir
          şeyi takip etmiyor, ayrı bir tür olduğu ilk bakışta belli olsun. */}
      <Bolum baslik="Oyunlar 🎮" onTumu={onOyunlaraGit}>
        {gosterilenOyunlar.map((oyun) => (
          <Kutucuk key={oyun.id} ad={oyun.ad} onSec={onOyunlaraGit}>
            <span
              className={cn('grid size-11 place-items-center rounded-full', OYUN_RENGI[oyun.id])}
            >
              <span className="text-[22px] leading-none" aria-hidden>
                {oyun.ikon}
              </span>
            </span>
          </Kutucuk>
        ))}
      </Bolum>

      {/* Günün sözü. Tasarımda yeri yok ama uygulamada vardı; selamlamadaki
          cümle artık duruma bağlı olduğu için söz sayfanın sonuna, sessiz bir
          satıra indi. */}
      <p className="px-2 pt-1 text-center text-xs leading-relaxed font-medium text-muted-foreground">
        {soz.metin}
        {soz.kaynak && <span className="block text-muted-foreground/70">— {soz.kaynak}</span>}
      </p>
    </div>
  )
}

/**
 * Kartsız kısayol bölümü: üstte başlık + "Tümü", altında dört beyaz kutucuk.
 * Kutucukların her biri kendi kartı — dördü tek bir kartın içinde dururken
 * hangisinin ayrı bir düğme olduğu belli olmuyordu.
 */
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
      <div className="grid grid-cols-4 gap-2.5">{children}</div>
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

/** Beyaz kart + ortada renkli yüz + altında ad. Araçlar ve Oyunlar aynı kutucuğu kullanır. */
function Kutucuk({
  ad,
  onSec,
  children,
}: {
  ad: string
  onSec: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onSec}
      className="golge-kart flex flex-col items-center gap-1.5 rounded-[20px] bg-card px-1 pt-3 pb-2.5 transition active:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {children}
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

/** Selamlamanın altındaki cümle — kullanıcının bugünkü durumuna göre değişir. */
function durumCumlesi(
  cozulen: number,
  kalan: number,
  hedefTuttu: boolean,
  tamamlanan: number,
): string {
  if (hedefTuttu) return 'Bugünkü hedefi tutturdun, seri sende.'
  if (cozulen > 0) return `Başladın bile — hedefe ${kalan} soru kaldı.`
  if (tamamlanan > 0) return 'Serini bugün de sürdürelim mi?'
  return 'Bugün çalışmadın henüz, başlayalım mı?'
}

/** Hedef halkasının yanındaki cümle. */
function hedefCumlesi(cozulen: number, kalan: number, hedefTuttu: boolean): string {
  if (hedefTuttu) return 'Hedefi tutturdun. Fazlası cabası.'
  if (cozulen > 0) return `${kalan} soru kaldı, az kaldı bitirmeye.`
  return `${kalan} soru kaldı. Bir 20'lik çözmek bile seriyi başlatır.`
}
