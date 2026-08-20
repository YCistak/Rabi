'use client'

import { Check, HelpCircle, Trophy, X } from 'lucide-react'
import type { OyunId } from '@/lib/types'
import { sureOrani } from '@/lib/oyunlar/tur'
import { BOSS_ARALIGI, bossluMu } from '@/lib/oyunlar/ritim'
import { cn } from '@/lib/utils'
import { Halka } from '@/components/ui'
import { Rabi, type MaskotDurumu } from '@/components/maskot/rabi'
import { BildirimDugmesi, type BildirimKolu } from '@/components/hata-bildir'
import type { BankaSorusu } from '@/lib/oyunlar/banka'

/**
 * Bütün mini oyunların ortak çerçevesi: kapatma, başlık, süre halkası, süre
 * çubuğu, sayaç şeridi ve tur sonu iskeleti.
 *
 * Tek yerde tutulmasının sebebi tutarlılık: üç oyun da aynı süreyi, aynı cezayı
 * ve aynı puanı kullanıyor. Her oyun kendi üst bilgisini çizseydi aynı sayının
 * farklı yerlerde farklı göründüğü bir arayüz çıkardı.
 *
 * Tam ekran açılıyor (`z-50`, alt menü z-40'ta): süreli bir turda yanlışlıkla
 * sekmeye basmak turu bitirirdi.
 */

/**
 * Oyun ailesinin renkleri.
 *
 * Ekranın zemini oyunun kendi pasteli; beyaz kartlar onun üstünde yüzüyor.
 * Kullanıcı hangi oyunda olduğunu başlığı okumadan renkten biliyor — Oyunlar
 * sekmesindeki kart, tur sonu ekranı ve Oyun Bankası aynı üçlüyü kullanıyor.
 */
const AILE: Record<
  OyunId,
  { zemin: string; yazi: string; dolgu: string; kenar: string; degisken: string }
> = {
  yazim: {
    zemin: 'bg-yzm',
    yazi: 'text-yzm-koyu',
    dolgu: 'bg-yzm-koyu',
    kenar: 'border-l-yzm-koyu',
    degisken: 'var(--yzm-koyu)',
  },
  // Türkçe dersinin oyunları Yazım'la aynı aileyi paylaşıyor.
  ses: {
    zemin: 'bg-yzm',
    yazi: 'text-yzm-koyu',
    dolgu: 'bg-yzm-koyu',
    kenar: 'border-l-yzm-koyu',
    degisken: 'var(--yzm-koyu)',
  },
  oge: {
    zemin: 'bg-yzm',
    yazi: 'text-yzm-koyu',
    dolgu: 'bg-yzm-koyu',
    kenar: 'border-l-yzm-koyu',
    degisken: 'var(--yzm-koyu)',
  },
  soz: {
    zemin: 'bg-yzm',
    yazi: 'text-yzm-koyu',
    dolgu: 'bg-yzm-koyu',
    kenar: 'border-l-yzm-koyu',
    degisken: 'var(--yzm-koyu)',
  },
  // Matematik dersinin oyunları İşlem'le aynı aileyi paylaşıyor.
  bolunme: {
    zemin: 'bg-isl',
    yazi: 'text-isl-koyu',
    dolgu: 'bg-isl-koyu',
    kenar: 'border-l-isl-koyu',
    degisken: 'var(--isl-koyu)',
  },
  islem: {
    zemin: 'bg-isl',
    yazi: 'text-isl-koyu',
    dolgu: 'bg-isl-koyu',
    kenar: 'border-l-isl-koyu',
    degisken: 'var(--isl-koyu)',
  },
  // Geometri oyunları da matematik dersinin altında; renk derse ait.
  aci: {
    zemin: 'bg-isl',
    yazi: 'text-isl-koyu',
    dolgu: 'bg-isl-koyu',
    kenar: 'border-l-isl-koyu',
    degisken: 'var(--isl-koyu)',
  },
  ucgen: {
    zemin: 'bg-isl',
    yazi: 'text-isl-koyu',
    dolgu: 'bg-isl-koyu',
    kenar: 'border-l-isl-koyu',
    degisken: 'var(--isl-koyu)',
  },
  edebiyat: {
    zemin: 'bg-edb',
    yazi: 'text-edb-koyu',
    dolgu: 'bg-edb-koyu',
    kenar: 'border-l-edb-koyu',
    degisken: 'var(--edb-koyu)',
  },
  harita: {
    zemin: 'bg-cog',
    yazi: 'text-cog-koyu',
    dolgu: 'bg-cog-koyu',
    kenar: 'border-l-cog-koyu',
    degisken: 'var(--cog-koyu)',
  },
  // Tarih dersinin iki eşleştirme oyunu aynı aileyi paylaşıyor.
  antlasma: {
    zemin: 'bg-trh',
    yazi: 'text-trh-koyu',
    dolgu: 'bg-trh-koyu',
    kenar: 'border-l-trh-koyu',
    degisken: 'var(--trh-koyu)',
  },
  kavram: {
    zemin: 'bg-trh',
    yazi: 'text-trh-koyu',
    dolgu: 'bg-trh-koyu',
    kenar: 'border-l-trh-koyu',
    degisken: 'var(--trh-koyu)',
  },
  anlatim: {
    zemin: 'bg-yzm',
    yazi: 'text-yzm-koyu',
    dolgu: 'bg-yzm-koyu',
    kenar: 'border-l-yzm-koyu',
    degisken: 'var(--yzm-koyu)',
  },
  koklu: {
    zemin: 'bg-isl',
    yazi: 'text-isl-koyu',
    dolgu: 'bg-isl-koyu',
    kenar: 'border-l-isl-koyu',
    degisken: 'var(--isl-koyu)',
  },
  // Biyoloji dersinin üç oyunu aynı aileyi paylaşıyor.
  ortak: {
    zemin: 'bg-byl',
    yazi: 'text-byl-koyu',
    dolgu: 'bg-byl-koyu',
    kenar: 'border-l-byl-koyu',
    degisken: 'var(--byl-koyu)',
  },
  siniflandirma: {
    zemin: 'bg-byl',
    yazi: 'text-byl-koyu',
    dolgu: 'bg-byl-koyu',
    kenar: 'border-l-byl-koyu',
    degisken: 'var(--byl-koyu)',
  },
  hucre: {
    zemin: 'bg-byl',
    yazi: 'text-byl-koyu',
    dolgu: 'bg-byl-koyu',
    kenar: 'border-l-byl-koyu',
    degisken: 'var(--byl-koyu)',
  },
  // Zaman Şeridi tarih dersinin üçüncü oyunu.
  sirala: {
    zemin: 'bg-trh',
    yazi: 'text-trh-koyu',
    dolgu: 'bg-trh-koyu',
    kenar: 'border-l-trh-koyu',
    degisken: 'var(--trh-koyu)',
  },
  tuzak: {
    zemin: 'bg-isl',
    yazi: 'text-isl-koyu',
    dolgu: 'bg-isl-koyu',
    kenar: 'border-l-isl-koyu',
    degisken: 'var(--isl-koyu)',
  },
}

/** Tur sonunda listelenen en fazla yanlış. Gerisi Oyun Bankası'nda. */
export const EN_COK_YANLIS = 5

/**
 * Turu ne bitirdi.
 *
 * `false`: eleme yok — soru sınırına gelindi ya da banka turu tükendi.
 * `'boss'` ve `'yanlis'` ikisi de yanlış cevap, ama tur sonu ekranı ikisini
 * ayrı söylüyor: boss'a takılmak ile sıradan bir soruda takılmak oyuncu için
 * aynı his değil.
 */
export type Eleme = false | 'boss' | 'yanlis'

export type SayacBilgisi = {
  /** Kalan saniye. */
  kalan: number
  /**
   * Bu sorunun toplam süresi.
   *
   * Halkanın ve çubuğun doluluğu buna göre. Sabit tur süresi yerine soru
   * süresi kullanılıyor: boss'un süresi uzun, halka yine dolu başlamalı.
   */
  toplam: number
  /** Kaçıncı soru — boss uyarısında görünüyor. */
  sira: number
  /** Bu soru boss mu: eleyici olan, ekranın rengini değiştiren. */
  boss: boolean
  /** Şu anki ardışık doğru sayısı. */
  seri: number
  dogru: number
  yanlis: number
  enIyiSeri: number
  rekor: number
  /**
   * Turun puanı — yalnızca doğru sayısıyla ölçülemeyen oyunlarda.
   *
   * Organel Kartı'nda cevabı kaçıncı ipucunda bulduğun, Köklü Sayı'da bonusu
   * bilip bilmediğin doğru/yanlış ayrımına sığmıyor. Verilmezse sütun hiç
   * çıkmıyor: öteki oyunlarda gösterilecek bir puan yok, sıfır yazan bir
   * sütun ise yanlış bilgi olurdu.
   */
  puan?: number
}

export function OyunKabugu({
  oyunId,
  baslik,
  sayac,
  onCik,
  onYardim,
  children,
}: {
  oyunId: OyunId
  baslik: string
  /** Sonuç ekranında `null` — orada süre ve sayaçların yeri yok. */
  sayac: SayacBilgisi | null
  onCik: () => void
  onYardim: () => void
  children: React.ReactNode
}) {
  const aile = AILE[oyunId]

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col transition-colors duration-300',
        // Boss'ta ekranın zemini oyunun kendi pastelinden çıkıp kırmızıya
        // dönüyor. Ayrı bir ekran açmak yerine aynı ekranın rengini
        // değiştirmek, sorunun akışını kesmeden gerginliği taşıyor.
        // `boss-alan` üstüne içeri doğru atan kırmızı çerçeveyi koyuyor.
        sayac?.boss ? 'boss-alan bg-boss-zemin' : aile.zemin,
      )}
    >
      <div className="guvenli-alt mx-auto flex w-full max-w-md flex-1 flex-col overflow-y-auto px-4 pb-3 pt-[calc(0.9rem+var(--guvenli-ust))]">
        <div className="flex flex-none items-center gap-2">
          <YuvarlakDugme etiket="Oyundan çık" onClick={onCik}>
            <X size={17} aria-hidden />
          </YuvarlakDugme>
          {/* Yardım yalnızca tur sürerken: sonuç ekranında kuralları açmanın
              bir karşılığı yok, tasarımda da orada tek düğme var. */}
          {sayac && (
            <YuvarlakDugme etiket="Nasıl oynanır" onClick={onYardim}>
              <HelpCircle size={17} aria-hidden />
            </YuvarlakDugme>
          )}

          <p className="min-w-0 flex-1 truncate text-center font-display text-[14.5px] font-extrabold tracking-tight">
            {baslik}
          </p>

          {/* Seri rozeti sağda: yerini hep koruyor, yoksa başlık her doğru
              cevapta yana kayardı. */}
          {sayac?.boss ? (
            <span
              // Sıra anahtar: her boss sorusunda rozet yeniden çarpıyor.
              key={sayac.sira}
              className="boss-rozet rakam flex h-[30px] shrink-0 items-center gap-1 rounded-full bg-danger px-2.5 text-[12.5px] font-extrabold text-white"
            >
              <span aria-hidden>⚔️</span>
              {sayac.sira}
            </span>
          ) : (
            <SeriRozeti seri={sayac?.seri ?? 0} gorunur={sayac !== null} />
          )}
        </div>

        {sayac && (
          <>
            <div className="relative mt-4 flex flex-none items-center gap-3">
              <Halka
                deger={sayac.kalan}
                hedef={sayac.toplam}
                boyut={54}
                kalinlik={5}
                renk={sureRengi(sayac.kalan, sayac.toplam, sayac.boss)}
              >
                <span
                  className="rakam font-display text-[17px] font-extrabold"
                  style={{ color: sureRengi(sayac.kalan, sayac.toplam, sayac.boss) }}
                >
                  {sayac.kalan}
                </span>
              </Halka>

              <div className="h-[9px] flex-1 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full transition-[width] duration-200"
                  style={{
                    width: `${sureOrani(sayac.kalan, sayac.toplam) * 100}%`,
                    background: sureRengi(sayac.kalan, sayac.toplam, sayac.boss),
                  }}
                />
              </div>

              {/* Boss uyarısı süre çubuğunun üstünde: gözün zaten baktığı yer
                  burası. Metin artık "elenirsin" demiyor — her yanlış eliyor,
                  boss'u ayıran şey sorunun bir üst zorluktan gelmesi. */}
              {sayac.boss && (
                <span
                  key={sayac.sira}
                  className="boss-rozet absolute -top-3 left-[66px] rounded-full bg-danger px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-white"
                >
                  Boss · bir üst seviye
                </span>
              )}
            </div>

            <SayacSeridi oyunId={oyunId} sayac={sayac} />
          </>
        )}

        {children}
      </div>
    </div>
  )
}

/**
 * Tur sayaçları.
 *
 * Boss'lu oyunlarda "Yanlış" ve "Seri" kaldırıldı: her yanlış turu bitirdiği
 * için yanlış sayısı hep 0, seri de doğru sayısının aynısı — üç hücrenin ikisi
 * aynı sayıyı gösteriyordu. Yerlerine boss'a kaç soru kaldığı geldi; oyuncunun
 * turda gerçekten merak ettiği şey bu, gerilim de oradan geliyor.
 *
 * Matematik oyunlarında boss yok ve yanlış turu bitirmiyor; orada eski dörtlü
 * duruyor.
 */
function SayacSeridi({ oyunId, sayac }: { oyunId: OyunId; sayac: SayacBilgisi }) {
  // Puan yalnızca puanlı oyunlarda var (köklü sayı, organel): sütun sayısı ona
  // göre bir artıyor, boşluk bırakılmıyor.
  const puanli = sayac.puan !== undefined

  if (!bossluMu(oyunId)) {
    return (
      <div
        className={cn(
          'mt-3.5 grid flex-none gap-1.5 border-b border-border pb-3',
          puanli ? 'grid-cols-5' : 'grid-cols-4',
        )}
      >
        <Sayac deger={sayac.dogru} etiket="Doğru" renk="text-success" />
        <Sayac deger={sayac.yanlis} etiket="Yanlış" renk="text-ikincil" />
        <Sayac deger={sayac.enIyiSeri} etiket="Seri" />
        {sayac.puan !== undefined && (
          <Sayac deger={sayac.puan} etiket="Puan" renk="text-primary" />
        )}
        <Sayac deger={sayac.rekor} etiket="Rekor" />
      </div>
    )
  }

  // Bu soru boss'un kendisiyse geri sayım bitti; sayı yerine işaret duruyor.
  const kalan = sayac.boss ? 0 : BOSS_ARALIGI - (sayac.sira % BOSS_ARALIGI)

  return (
    <div
      className={cn(
        'mt-3.5 grid flex-none gap-1.5 border-b border-border pb-3',
        puanli ? 'grid-cols-4' : 'grid-cols-3',
      )}
    >
      <Sayac deger={sayac.dogru} etiket="Doğru" renk="text-success" />
      <Sayac
        deger={kalan}
        etiket={kalan === 0 ? 'Boss burada' : 'Boss’a kalan'}
        renk={kalan === 0 ? 'text-danger' : kalan <= 2 ? 'text-ikincil' : undefined}
      />
      {sayac.puan !== undefined && (
        <Sayac deger={sayac.puan} etiket="Puan" renk="text-primary" />
      )}
      <Sayac deger={sayac.rekor} etiket="Rekor" />
    </div>
  )
}

/**
 * Süre rengi.
 *
 * Üç kademe: bol süre yeşil, azalırken mercan, son on saniyede kırmızı. Renk
 * burada durum bildiriyor — oyunun ailesi zaten ekranın zemininde duruyor,
 * halkayı da aileye boyamak "az kaldı" uyarısını yutardı.
 */
function sureRengi(kalan: number, toplam: number, boss = false): string {
  // Boss'ta renk bilgi taşımıyor, gerginlik taşıyor: baştan sona kırmızı.
  if (boss) return 'var(--danger)'
  // Eşikler orana bağlı, saniyeye değil: soru süreleri oyundan oyuna değişiyor
  // (sözelde 12, üçgende 22) ve sabit "10 saniye kaldı" eşiği birinde turun
  // yarısı, ötekinde sonu demek olurdu.
  const oran = toplam > 0 ? kalan / toplam : 0
  if (oran <= 0.25) return 'var(--danger)'
  if (oran <= 0.5) return 'var(--ikincil)'
  return 'var(--success)'
}

function YuvarlakDugme({
  etiket,
  onClick,
  children,
}: {
  etiket: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiket}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] text-foreground transition active:bg-foreground/15"
    >
      {children}
    </button>
  )
}

/**
 * Ardışık doğru sayısı.
 *
 * Puan çarpanı değil — Rabi'de çarpan yok. İki ve üzerinde yanıyor; altında
 * soluk duruyor.
 */
function SeriRozeti({ seri, gorunur }: { seri: number; gorunur: boolean }) {
  const yaniyor = seri >= 2
  return (
    <span
      aria-label={gorunur ? `Ardışık doğru: ${seri}` : undefined}
      className={cn(
        'rakam flex h-[30px] shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] font-extrabold transition',
        !gorunur && 'invisible',
        yaniyor ? 'bg-ikincil text-white' : 'bg-foreground/[0.07] text-muted-foreground',
      )}
    >
      <span aria-hidden>🔥</span>
      {seri}
    </span>
  )
}

function Sayac({ deger, etiket, renk }: { deger: number; etiket: string; renk?: string }) {
  return (
    <div className="text-center">
      <span
        className={cn('rakam block font-display text-base font-extrabold leading-tight', renk)}
      >
        {deger}
      </span>
      <span className="mt-0.5 block text-[10.5px] font-bold leading-none text-muted-foreground/75">
        {etiket}
      </span>
    </div>
  )
}

/**
 * Cevabın hemen ardından çıkan geri bildirim şeridi.
 *
 * Yalnızca "yanlış" demek yetmiyor: doğrusu da burada yazıyor. Oyunun işi
 * öğretmek, hatayı söyleyip geçmek işe yaramıyor.
 */
export function Bildirim({
  iyi,
  baslik,
  aciklama,
}: {
  iyi: boolean
  baslik: string
  aciklama?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-none items-center gap-2 rounded-2xl px-3.5 py-2.5 text-[13.5px] font-extrabold',
        iyi ? 'bg-success-soft text-success' : 'bg-ikincil-soft text-ikincil',
      )}
    >
      {iyi ? (
        <Check size={17} className="shrink-0" aria-hidden />
      ) : (
        <X size={17} className="shrink-0" aria-hidden />
      )}
      {baslik}
      {aciklama && <span className="font-semibold opacity-85">{aciklama}</span>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tur sonu
// ---------------------------------------------------------------------------

/**
 * Puan çubuğunun oranları.
 *
 * Rakamı tek başına göstermek "iyi mi kötü mü" sorusunu cevapsız bırakıyordu;
 * rekor çizgisi ölçüyü veriyor. Tavan, ikisinden büyüğünün biraz üstünde:
 * rekor tam sağ uçta dursaydı, rekor kırıldığında çubuk taşardı.
 */
export function olcekOranlari(dogru: number, rekor: number): { dolu: number; cizgi: number } {
  const tavan = Math.max(dogru, rekor, 1) / 0.8
  return {
    dolu: Math.min(100, (dogru / tavan) * 100),
    cizgi: Math.min(100, (rekor / tavan) * 100),
  }
}

/**
 * Tur sonu başlığının altındaki cümle.
 *
 * `birim` oyuna göre değişiyor ("doğru", "eşleştirme"). Sayıya ek getirmiyoruz
 * (21'di / 18'di / 9'du) — ünlü uyumu her sayıda başka ek istiyor, cümleyi
 * ekten kaçıracak biçimde kurmak daha güvenli.
 */
export function rekorCumlesi(
  dogru: number,
  rekor: number,
  yeniRekor: boolean,
  birim: string,
): string {
  if (dogru === 0) return 'Bu turda hiç doğru yok — bir tur daha?'
  if (yeniRekor && rekor === 0) return 'İlk rekorun. Bundan sonrası bunu geçmek.'
  if (yeniRekor) return `Önceki rekorun ${rekor} ${birim} idi.`
  if (rekor > dogru) return `Rekoruna ${rekor - dogru} ${birim} kaldı.`
  return `Rekoruna eşitledin: ${rekor} ${birim}.`
}

/**
 * Üç oyunun ortak tur sonu iskeleti.
 *
 * Ekranın asıl işi yanlış listesi — puan bir turluk, yanlışlar kalıcı. O yüzden
 * liste `children` olarak dışarıdan geliyor: her oyunun yanlışı başka bir şey
 * anlatıyor (yazımda kural, işlemde tür dağılımı, edebiyatta senin cevabın).
 */
export function TurSonu({
  oyunId,
  dogru,
  yanlis,
  enIyiSeri,
  rekor,
  yeniRekor,
  bankaTuru,
  elendi,
  puan,
  altBaslik,
  bolumBasligi,
  bolumAltYazisi,
  onTekrar,
  onCik,
  children,
}: {
  oyunId: OyunId
  dogru: number
  yanlis: number
  enIyiSeri: number
  /** Tura girerken geçerli olan rekor — çubuktaki çizgi bunu gösteriyor. */
  rekor: number
  yeniRekor: boolean
  /** Banka turunda rekor ve istatistik yazılmıyor; ekran bunu söylüyor. */
  bankaTuru: boolean
  /**
   * Turu ne bitirdi.
   *
   * Başlığı değiştiriyor: "Süre bitti" artık doğru değil — tur sonsuzdu, onu
   * bitiren şey yanlış cevaptı ve oyuncunun bunu net görmesi gerekiyor.
   */
  elendi?: Eleme
  /**
   * Turun puanı ve etiketi — yalnızca puanlı oyunlarda (bkz. `SayacBilgisi`).
   *
   * Verilirse alttaki kutulara dördüncü olarak ekleniyor. Büyük sayı yine
   * doğru sayısı: rekor bütün oyunlarda onunla tutuluyor ve iki farklı "asıl
   * sayı" olsaydı hangisinin rekora gittiği belirsizleşirdi.
   */
  puan?: { deger: number; etiket: string }
  altBaslik: string
  bolumBasligi: string
  bolumAltYazisi: string
  onTekrar: () => void
  onCik: () => void
  children?: React.ReactNode
}) {
  const aile = AILE[oyunId]
  const { dolu, cizgi } = olcekOranlari(dogru, rekor)

  const maskot: MaskotDurumu = yeniRekor
    ? 'kutlama'
    : elendi || dogru === 0
      ? 'uzgun'
      : yanlis === 0
        ? 'mutlu'
        : 'normal'

  return (
    <div className="flex flex-1 flex-col gap-3 py-3">
      <div className="flex flex-none items-center gap-3 px-0.5">
        <Rabi durum={maskot} boyut={52} />
        <div className="min-w-0">
          <h2 className="font-display text-xl font-extrabold tracking-tight">
            {/* Eleme rekorun önünde: oyuncunun ilk sorusu "tur neden bitti".
                Rekor zaten hemen altındaki rozette duruyor. */}
            {elendi === 'boss'
              ? 'Boss’a takıldın'
              : elendi === 'yanlis'
                ? 'Bir yanlış yetti'
                : yeniRekor
                  ? 'Yeni rekor!'
                  : 'Tur bitti'}
          </h2>
          <p className="mt-0.5 text-[12.5px] font-semibold text-muted-foreground">{altBaslik}</p>
        </div>
      </div>

      {bankaTuru && (
        <p className="flex-none self-start rounded-full bg-ikincil-soft px-3 py-1 text-[11.5px] font-extrabold text-ikincil">
          Banka turu — rekora sayılmaz
        </p>
      )}

      <div className="golge-kart flex-none rounded-[20px] bg-card px-4 pb-4 pt-3.5">
        <div className="flex items-baseline justify-between gap-2.5">
          <b className="rakam font-display text-[38px] font-extrabold leading-none">
            {dogru}
            <span className="ml-1.5 text-[15px] font-bold text-muted-foreground">doğru</span>
          </b>

          <span
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-extrabold',
              yeniRekor ? 'bg-warning text-white' : 'bg-warning-soft text-warning',
            )}
          >
            <Trophy size={13} aria-hidden />
            {yeniRekor ? `+${dogru - rekor} rekor` : rekor > 0 ? `Rekor ${rekor}` : 'İlk turun'}
          </span>
        </div>

        <div className="relative mt-3 h-2.5 rounded-full bg-muted">
          <span
            className={cn('block h-full rounded-full', aile.dolgu)}
            style={{ width: `${dolu}%` }}
          />
          {/* Rekor kırılınca çizgi geride kalıyor ve soluyor — artık hedef değil. */}
          {rekor > 0 && (
            <span
              className={cn(
                'absolute -bottom-1 -top-1 w-[3px] rounded-sm',
                yeniRekor ? 'bg-border' : 'bg-foreground',
              )}
              style={{ left: `${cizgi}%` }}
            />
          )}
        </div>

        <div className="mt-2 flex justify-between text-[11px] font-bold text-muted-foreground">
          <span className="rakam">Bu tur {dogru}</span>
          {rekor > 0 && (
            <span className="rakam">
              {yeniRekor ? 'Eski rekorun' : 'Rekorun'} {rekor}
            </span>
          )}
        </div>
      </div>

      <div
        className={cn(
          'grid flex-none gap-2',
          puan === undefined ? 'grid-cols-3' : 'grid-cols-4',
        )}
      >
        <Kutu deger={dogru} etiket="Doğru" renk="text-success" />
        <Kutu deger={yanlis} etiket="Yanlış" renk="text-ikincil" />
        <Kutu deger={enIyiSeri} etiket="En iyi seri" />
        {puan !== undefined && (
          <Kutu deger={puan.deger} etiket={puan.etiket} renk="text-primary" />
        )}
      </div>

      {children && (
        <>
          <p className="mt-1 flex-none font-display text-[13.5px] font-extrabold">
            {bolumBasligi}
            <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
              {bolumAltYazisi}
            </span>
          </p>
          {children}
        </>
      )}

      <div className="mt-auto grid flex-none grid-cols-2 gap-2.5 pt-2">
        <button
          type="button"
          onClick={onCik}
          className="golge-kart grid h-12 place-items-center rounded-[17px] bg-card font-display text-[14.5px] font-extrabold transition active:brightness-95"
        >
          Bitir
        </button>
        <button
          type="button"
          onClick={onTekrar}
          className={cn(
            'grid h-12 place-items-center rounded-[17px] font-display text-[14.5px] font-extrabold text-white transition active:brightness-95',
            aile.dolgu,
          )}
        >
          Bir tur daha
        </button>
      </div>
    </div>
  )
}

function Kutu({ deger, etiket, renk }: { deger: number; etiket: string; renk?: string }) {
  return (
    <div className="golge-kart rounded-2xl bg-card px-2 py-2.5 text-center">
      <b className={cn('rakam block font-display text-lg font-extrabold leading-tight', renk)}>
        {deger}
      </b>
      <span className="mt-0.5 block text-[10.5px] font-bold text-muted-foreground/75">
        {etiket}
      </span>
    </div>
  )
}

/**
 * Tur sonundaki tek yanlış kartı; sol kenarı oyunun rengiyle çizgili.
 *
 * `soru` ve `bildir` birlikte verilirse altına "Bu soru hatalı" düğmesi
 * geliyor. Yeri burası: kullanıcı tam da az önce yanlış sayılan soruya bakıyor,
 * "ama bu doğruydu" diyeceği an bu an — ve süre işlemiyor.
 */
export function YanlisKarti({
  oyunId,
  soru,
  bildir,
  children,
}: {
  oyunId: OyunId
  soru?: BankaSorusu
  bildir?: BildirimKolu
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'golge-kart rounded-2xl border-l-4 bg-card px-3.5 py-3',
        AILE[oyunId].kenar,
      )}
    >
      {children}
      {soru && bildir && <BildirimDugmesi soru={soru} kol={bildir} />}
    </div>
  )
}

/**
 * Listenin kesildiği yer.
 *
 * Beşten sonrası okunmuyor; tamamı Oyun Bankası'nda duruyor. Hap tıklanabilir
 * değil — bu ekrandan bankaya geçmek turu ortada bırakırdı.
 */
export function KalanHapi({ kalan }: { kalan: number }) {
  return (
    <div className="flex-none">
      <p className="flex h-10 items-center justify-center rounded-[14px] border-[1.5px] border-dashed border-border bg-card/60 text-[12.5px] font-extrabold text-muted-foreground">
        ve {kalan} tane daha
      </p>
      <p className="mt-1.5 text-center text-[11.5px] font-semibold text-muted-foreground">
        Hepsi Oyun Bankası&apos;na eklendi.
      </p>
    </div>
  )
}
