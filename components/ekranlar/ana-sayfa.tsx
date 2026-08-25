'use client'

import { useMemo } from 'react'
import { AlertTriangle, ChevronRight, Sparkles, Store } from 'lucide-react'
import type { Ayarlar, Devamsizlik, GunlukKayit, Hedef, OyunId } from '@/lib/types'
import { devamsizlikOzeti, gunOzeti, kayitHaritasi } from '@/lib/hesap'
import { bugun, cn, tariheCevir, tariheYaz } from '@/lib/utils'
import { sozSec } from '@/lib/sozler'
import { KARTLAR, type Ekran, type KartRengi } from '@/lib/gezinme'
import { kisayollar } from '@/lib/son-kullanilan'
import { OYUNLAR } from '@/lib/oyunlar/tanim'
import { seviyeUnvani, type SeviyeDurumu } from '@/lib/seviye'
import { Halka, Kart, Not } from '@/components/ui'
import { GeriSayim } from '@/components/geri-sayim'
import { TavsanYuzu } from '@/components/maskot/tavsan-yuz'

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
  ayarlar,
  gunlukKayitlar,
  devamsizlik,
  hedef,
  seviye,
  havuc,
  guncelSiralama,
  ozetBekliyor,
  sonAraclar,
  sonOyunlar,
  onKartAc,
  onOyunlaraGit,
  acilisSuruyor = false,
}: {
  ayarlar: Ayarlar
  gunlukKayitlar: GunlukKayit[]
  devamsizlik: Devamsizlik[]
  hedef: Hedef | null
  /** Türetilen seviye durumu — selamlamanın alt satırındaki sayı. */
  seviye: SeviyeDurumu
  /** Havuç bakiyesi; seviyeyle aynı satırda duruyor. */
  havuc: number
  /** Son denemelerden çıkan tahmini sıralama; deneme yoksa null. */
  guncelSiralama: number | null
  /** Biten haftanın özeti henüz izlenmediyse davet kartı gösterilir. */
  ozetBekliyor: boolean
  /** En son açılan araçlar ve oynanan oyunlar — kısayol kutucuklarının sırası. */
  sonAraclar: string[]
  sonOyunlar: string[]
  onKartAc: (ekran: Ekran) => void
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

  // Söz gün boyunca sabit kalsın diye tohum olarak tarih verilir; her yeniden
  // çizimde değişse okunamadan kaybolurdu.
  const soz = useMemo(() => sozSec(tarih), [tarih])

  const gosterilenAraclar = useMemo(() => kisayollar(KARTLAR, sonAraclar), [sonAraclar])
  const gosterilenOyunlar = useMemo(() => kisayollar(OYUNLAR, sonOyunlar), [sonOyunlar])

  const bugunku = useMemo(
    () => gunOzeti(gunlukKayitlar.find((k) => k.tarih === tarih)),
    [gunlukKayitlar, tarih],
  )

  // Seri şeridi bugünle biten yedi günü gösteriyor: sağa doğru ilerleyen bir
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

  return (
    <div className="space-y-3.5">
      {/* Selamlama — tasarımda ad sorulmuyor, kurulumda ad adımı yok.

          Seviye, unvan ve havuç selamlamanın alt satırında: eskiden bunlar
          hemen altta ayrı bir karttı ve sayfanın en değerli yerini üç sayı
          için harcıyordu. Satırın tamamı mağazaya götürüyor — kazanç ile
          harcama arasındaki yol tek dokunuş olsun. */}
      <header className="flex items-center gap-3 px-0.5 pt-1">
        {/* Açılış ekranının maskotu tam buraya iniyor: aynı görsel, aynı
            yerde, aynı boyda. Bu yüzden ruh hâline göre değişen çizim
            (components/maskot/rabi.tsx) burada kullanılmıyor — açılışta
            başka, ana sayfada başka bir tavşan geçişi bozardı. Çizilmiş
            maskot boş ekranlarda ve kutlamalarda duruyor.

            Açılış sürerken gizli ama yerinde: ekranda tek tavşan olsun diye
            gizli, açılış ekranı varışı bu öğeyi ölçerek bulduğu için
            yerinde. */}
        <TavsanYuzu boyut={58} yuvaMi gizli={acilisSuruyor} />

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-extrabold tracking-[0.2em] text-muted-foreground">RABİ</p>
          <h1 className="mt-0.5 font-display text-[27px] leading-none font-extrabold tracking-tight">
            Merhaba 👋
          </h1>
          <button
            type="button"
            onClick={() => onKartAc('magaza')}
            aria-label={`Seviye ${seviye.seviye}, ${havuc} havuç — Havuç Mağazası`}
            className="mt-1.5 block rounded-lg text-left transition active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="text-[13px] font-bold text-muted-foreground">
              <span className="rakam text-primary">Seviye {seviye.seviye}</span>
              {' · '}
              {seviyeUnvani(seviye.seviye)}
              {' · '}
              <span className="rakam">🥕 {havuc}</span>
            </span>
          </button>
        </div>

        {/* Yalnızca mağaza düğmesi. Sayılar selamlamanın alt satırında zaten
            yazıyor; burada bir de yazsalardı üç sayıyla yarışırlardı. */}
        <button
          type="button"
          onClick={() => onKartAc('magaza')}
          aria-label="Havuç Mağazası"
          className="grid size-11 shrink-0 self-start place-items-center rounded-full bg-primary text-primary-foreground transition active:brightness-95"
        >
          <Store size={19} aria-hidden />
        </button>
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

      {/* YKS geri sayımı ve hedef — sayfanın en görünür yerinde, tek kartta.
          Kalan gün, sayfadaki her sayının bağlamı. */}
      <GeriSayim
        tarih={tarih}
        hedef={hedef}
        guncelSiralama={guncelSiralama}
        onHedefAc={() => onKartAc('hedef')}
      />

      {/* Günlük hedef — halka, cümle ve yedi günlük seri tek kartta.
          Seri eskiden ayrı bir karttı; ikisi de aynı soruyu ("bugün hedefi
          tutturdun mu") farklı ölçekte cevapladığı için ayrı durmaları
          sayfayı uzatmaktan başka bir işe yaramıyordu.

          Halkanın içinde yalnızca çözülen sayı var, "/300" yok: hedef zaten
          hemen yanında cümle olarak yazıyor ve iki sayı halkanın içine
          sığdırılınca ikisi de küçülüyordu. */}
      <Kart className="flex items-center gap-4 px-4 py-4">
        <Halka deger={bugunku.toplam} hedef={ayarlar.gunlukHedef} boyut={104} kalinlik={11}>
          <span className="rakam font-display text-[30px] leading-none font-extrabold">
            {bugunku.toplam}
          </span>
        </Halka>

        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[17px] leading-tight font-extrabold tracking-tight">
            Bugünkü soru hedefin
          </h2>
          <p className="mt-1 text-[13px] leading-snug font-medium text-muted-foreground">
            {hedefCumlesi(ayarlar.gunlukHedef, kalan, hedefTuttu)}
          </p>

          {/* Yedi gün, cümlenin altında tek şerit. Kutucuklar gün adının
              kendisi: önce daire + altında ad vardı, iki kat yer kaplıyordu. */}
          <ul
            className="mt-3 flex gap-1"
            aria-label={`Son ${SERI_GUNU} günde ${tamamlanan} gün hedef tuttu`}
          >
            {gunler.map((gun) => (
              <li key={gun.iso} className="min-w-0 flex-1">
                <span
                  aria-label={`${gun.ad}: ${gun.tuttu ? 'hedef tuttu' : 'hedef tutmadı'}`}
                  className={cn(
                    'grid h-8 place-items-center rounded-[11px] text-[10px] font-extrabold',
                    gun.tuttu
                      ? 'bg-primary-soft text-primary'
                      : 'bg-muted text-muted-foreground/55',
                    // Bugün, dolu olsun olmasın halkasıyla ayrışır.
                    gun.bugunMu && 'ring-2 ring-primary ring-inset',
                  )}
                >
                  {gun.ad}
                </span>
              </li>
            ))}
          </ul>
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

      {/* Araçlar — en son açılan dördü; hiç açılmamışsa `KARTLAR`'ın başı.
          Kartın içinde değil doğrudan zeminin üstünde: tasarımda bunlar
          kısayol, bir bölüm değil. Başlığı da yok, çünkü kutucuğun içindeki
          ad zaten ne olduğunu söylüyor. Hepsine giden yol alt menüdeki
          "Daha" sekmesi. */}
      <nav aria-label="Araç kısayolları" className="grid grid-cols-4 gap-2.5">
        {gosterilenAraclar.map(({ id, ad, Simge, renk }) => (
          <Kutucuk key={id} ad={ad} yuz={KUTUCUK_RENGI[renk]} onSec={() => onKartAc(id)}>
            <Simge size={24} aria-hidden />
          </Kutucuk>
        ))}
      </nav>

      {/* Oyunlar — en son oynanan dördü; hiç oynanmamışsa `OYUNLAR`'ın başı. */}
      <Kart className="p-4">
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <h2 className="font-display text-[17px] font-extrabold tracking-tight">Oyunlar 🎮</h2>
          <button
            type="button"
            onClick={onOyunlaraGit}
            className="shrink-0 rounded-lg px-1.5 py-0.5 text-[13px] font-extrabold text-primary transition active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Tümü →
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {gosterilenOyunlar.map((oyun) => (
            <Kutucuk key={oyun.id} ad={oyun.ad} yuz={OYUN_RENGI[oyun.id]} onSec={onOyunlaraGit}>
              <span className="text-[22px] leading-none" aria-hidden>
                {oyun.ikon}
              </span>
            </Kutucuk>
          ))}
        </div>
      </Kart>

      {/* Günün sözü. Tasarımda sayfanın en altında, sessiz bir satır. */}
      <p className="px-2 pt-1 text-center text-[12.5px] leading-relaxed font-medium text-muted-foreground">
        {soz.metin}
        {soz.kaynak && <span className="block text-muted-foreground/70">— {soz.kaynak}</span>}
      </p>
    </div>
  )
}

/**
 * Renkli kutucuk: zemin ailenin rengi, simge onun üstünde okunan ton, ad
 * kutucuğun içinde altta. Araçlar ve Oyunlar aynı kutucuğu kullanıyor.
 *
 * Ad eskiden kutucuğun **dışındaydı**; tasarımda içeri girdi, böylece kutucuk
 * tek bir dokunma yüzeyi olarak okunuyor ve ızgara satır aralığı olmadan da
 * hizalı duruyor.
 */
function Kutucuk({
  ad,
  yuz,
  onSec,
  children,
}: {
  ad: string
  /** Zemin ve simge rengi sınıfları. */
  yuz: string
  onSec: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onSec}
      className={cn(
        'flex aspect-[1/1.12] w-full flex-col items-center justify-center gap-2 rounded-[20px] px-1 transition',
        'active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        yuz,
      )}
    >
      {children}
      <span className="text-[10.5px] leading-tight font-bold text-balance text-foreground/75">
        {ad}
      </span>
    </button>
  )
}

/** Hedef halkasının yanındaki cümle. */
function hedefCumlesi(gunlukHedef: number, kalan: number, hedefTuttu: boolean): string {
  if (hedefTuttu) return 'Hedefi tutturdun. Fazlası cabası.'
  return `${gunlukHedef} hedefin var, ${kalan} soru kaldı.`
}
