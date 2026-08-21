'use client'

import { useMemo } from 'react'
import { AlertTriangle, Check, ChevronRight, Sparkles, Target } from 'lucide-react'
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
  periyodik: 'bg-kmy-kart',
  sirala: 'bg-trh-kart',
  tuzak: 'bg-isl-kart',
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
        <div className="min-w-0">
          <p className="text-[13px] font-extrabold tracking-wide text-ikincil">Rabi</p>
          <h1 className="mt-px font-display text-xl font-extrabold tracking-tight text-balance">
            Merhaba 👋
          </h1>
          <p className="mt-0.5 text-[13px] leading-snug font-medium text-muted-foreground">
            {durumCumlesi(bugunku.toplam, kalan, hedefTuttu, tamamlanan)}
          </p>
        </div>
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
          görünür yerinde. Kalan gün, sayfadaki her sayının bağlamı. */}
      <GeriSayim tarih={tarih} />

      {/* 7 günlük seri */}
      <Kart>
        <KartUstu baslik={`${SERI_GUNU} günlük seri`} aciklama="Bugünkü hedefi tuttur, seriyi büyüt.">
          <span className="rakam shrink-0 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-extrabold text-primary">
            {tamamlanan}/{SERI_GUNU} tamamlandı
          </span>
        </KartUstu>

        <ul className="grid grid-cols-7 gap-1">
          {gunler.map((gun) => (
            <li
              key={gun.iso}
              className="flex flex-col items-center gap-1.5"
              aria-label={`${gun.ad}: ${gun.tuttu ? 'hedef tuttu' : 'hedef tutmadı'}`}
            >
              <span
                className={cn(
                  'grid size-9 place-items-center rounded-full',
                  gun.tuttu ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground/50',
                  // Bugün, dolu olsun olmasın halkasıyla ayrışır.
                  gun.bugunMu && 'ring-2 ring-primary ring-offset-2 ring-offset-card',
                )}
              >
                {gun.tuttu ? (
                  <Check size={18} strokeWidth={3} aria-hidden />
                ) : (
                  <span className="size-2 rounded-full bg-current" aria-hidden />
                )}
              </span>
              <span
                className={cn(
                  'text-[11px] font-bold',
                  gun.bugunMu ? 'text-primary' : 'text-muted-foreground/80',
                )}
              >
                {gun.ad}
              </span>
            </li>
          ))}
        </ul>
      </Kart>

      {/* Günlük hedef */}
      <Kart className="flex items-center gap-4 px-5 py-5">
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

      {/* Araçlar — en son açılan dördü; hiç açılmamışsa `KARTLAR`'ın başı. */}
      <Kart>
        <KartUstu baslik="Araçlar 🧰" aciklama="Çalışmanı takip et">
          <TumuBaglantisi onSec={onDahaGit} />
        </KartUstu>

        <div className="grid grid-cols-4 gap-2.5">
          {gosterilenAraclar.map(({ id, ad, Simge, renk }) => (
            <Kutucuk
              key={id}
              ad={ad}
              yuz={KUTUCUK_RENGI[renk]}
              oran="aspect-[1/0.92]"
              onSec={() => onKartAc(id)}
            >
              <Simge size={26} aria-hidden />
            </Kutucuk>
          ))}
        </div>
      </Kart>

      {/* Oyunlar — en son oynanan dördü; hiç oynanmamışsa `OYUNLAR`'ın başı. */}
      <Kart>
        <KartUstu baslik="Oyunlar 🎮" aciklama="Eğlenerek pratik yap">
          <TumuBaglantisi onSec={onOyunlaraGit} />
        </KartUstu>

        <div className="grid grid-cols-4 gap-2.5">
          {gosterilenOyunlar.map((oyun) => (
            <Kutucuk
              key={oyun.id}
              ad={oyun.ad}
              yuz={OYUN_RENGI[oyun.id]}
              oran="aspect-[1/0.92]"
              onSec={onOyunlaraGit}
            >
              <span className="text-2xl leading-none" aria-hidden>
                {oyun.ikon}
              </span>
            </Kutucuk>
          ))}
        </div>
      </Kart>

      {/* Hedef bölüm — tahmini sıralamayla birlikte */}
      <button
        type="button"
        onClick={() => onKartAc('hedef')}
        className="golge-kart w-full rounded-2xl bg-card p-4 text-left transition active:brightness-[0.98]"
      >
        <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
          <Target size={14} aria-hidden />
          Hedefim
        </span>
        {hedef ? (
          <>
            <span className="mt-1.5 block font-display text-base leading-tight font-extrabold">
              {hedef.bolum}
            </span>
            <span className="block text-[13px] font-semibold text-muted-foreground">
              {hedef.universite}
            </span>
            {hedef.basariSirasi !== null && (
              <span className="rakam mt-1 block text-[13px] font-semibold text-muted-foreground">
                Gereken sıralama: {siraYaz(hedef.basariSirasi)}
              </span>
            )}
            {hedef.basariSirasi !== null && guncelSiralama !== null && (
              <span
                className={cn(
                  'mt-1 block text-[13px] font-bold',
                  guncelSiralama <= hedef.basariSirasi ? 'text-success' : 'text-primary',
                )}
              >
                {guncelSiralama <= hedef.basariSirasi
                  ? 'Şu an hedefinin içindesin.'
                  : `${siraYaz(guncelSiralama - hedef.basariSirasi)} sıra uzaktasın.`}
              </span>
            )}
          </>
        ) : (
          <span className="mt-1.5 block text-[13px] font-semibold text-muted-foreground">
            Hedef bölümünü yaz — Rabi sıralamana ne kadar kaldığını takip etsin.
          </span>
        )}
      </button>

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

/** Kart başlığı: solda ad + açıklama, sağda rozet ya da "Tümü". */
function KartUstu({
  baslik,
  aciklama,
  children,
}: {
  baslik: string
  aciklama: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-3.5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="font-display text-base font-extrabold tracking-tight">{baslik}</h2>
        <p className="mt-0.5 text-xs leading-snug font-medium text-muted-foreground">{aciklama}</p>
      </div>
      {children}
    </div>
  )
}

function TumuBaglantisi({ onSec }: { onSec: () => void }) {
  return (
    <button
      type="button"
      onClick={onSec}
      className="shrink-0 rounded-lg px-1.5 py-0.5 text-[13px] font-extrabold text-ikincil transition active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ikincil"
    >
      Tümü →
    </button>
  )
}

/** Renkli yuvarlak kare + altında ad. Araçlar ve Oyunlar aynı kutucuğu kullanır. */
function Kutucuk({
  ad,
  yuz,
  oran,
  onSec,
  children,
}: {
  ad: string
  /** Zemin ve simge rengi sınıfları. */
  yuz: string
  /** Yüzün en-boy oranı; oyun kutucukları tasarımda daha basık. */
  oran: string
  onSec: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onSec}
      className="flex flex-col items-center gap-1.5 rounded-xl transition active:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className={cn('grid w-full place-items-center rounded-[18px]', oran, yuz)}>
        {children}
      </span>
      <span className="text-[11px] leading-tight font-bold text-balance text-foreground/70">
        {ad}
      </span>
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
