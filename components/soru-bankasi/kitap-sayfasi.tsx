'use client'

import { Check, ChevronLeft, ChevronRight, Maximize2, PenLine, SkipForward, Star, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { sikDuzeni, sikDuzeniSec, type SikDuzeni, type SikDuzeniTercihi } from '@/lib/soru-bankasi/duzen'
import { SAYFA_SIK_SINIRLARI } from '@/lib/soru-bankasi/sayfa'
import type { BankaSorusu, SoruDurumu } from '@/lib/soru-bankasi/tip'
import { SoruMetni } from './soru-metni'
import { SoruSekli } from './soru-sekli'

const HARFLER = 'ABCDE'
const ROMEN = ['I', 'II', 'III', 'IV', 'V']
const UZUN_BASIS_MS = 450

/** Sayfadaki bir sorunun o anki hâli (çizer; karar `TestOturumu`nun). */
export type SayfaSoruDurumu = {
  secim: number | undefined
  /** Doğru/yanlış görünür mü (alıştırmada cevaptan, denemede bitişten sonra). */
  goster: boolean
  sonuc: SoruDurumu
  elenenler: readonly number[]
  supheli: boolean
  pas: boolean
  cizimVar: boolean
}

/** Kitap sayfasında şık düzeni: kitap düzeninde sayfanın dar sütun sınırları. */
function sayfaSikDuzeni(siklar: readonly string[], tercih: SikDuzeniTercihi): SikDuzeni {
  return tercih === 'kitap' ? sikDuzeni(siklar, SAYFA_SIK_SINIRLARI) : sikDuzeniSec(siklar, tercih)
}

/**
 * Şık düğmesi. Kısa dokunuş seçer (elenmişse geri getirir), uzun basış ya da
 * sağ tık eler. Android'de uzun basış ayrıca `contextmenu` da ateşliyor: hangisi
 * önce gelirse o sayılır, ikincisi yutulur (yoksa şık elenip hemen geri gelirdi).
 */
function SayfaSikki({
  harf,
  metin,
  durum,
  devreDisi,
  onDokun,
  onUzun,
}: {
  harf: number
  metin: string
  durum: 'bos' | 'secili' | 'elenmis' | 'dogru' | 'yanlis' | 'soluk'
  devreDisi: boolean
  onDokun: () => void
  onUzun: () => void
}) {
  const zamanlayici = useRef<number | undefined>(undefined)
  const bas = useRef<{ x: number; y: number } | null>(null)
  const uzunOldu = useRef(false)
  const iptal = () => {
    window.clearTimeout(zamanlayici.current)
    zamanlayici.current = undefined
    bas.current = null
  }
  useEffect(() => iptal, [])

  const kabarcik = {
    bos: 'border-[1.5px] border-foreground/55 text-foreground',
    secili: 'border-[1.5px] border-primary-derin bg-primary-derin text-white',
    elenmis: 'border-[1.5px] border-dashed border-muted-foreground/60 text-muted-foreground',
    dogru: 'border-[1.5px] border-success-dolu bg-success-dolu text-white',
    yanlis: 'border-[1.5px] border-danger-dolu bg-danger-dolu text-white',
    soluk: 'border-[1.5px] border-border text-muted-foreground',
  }[durum]
  const etiket = { bos: '', secili: ', işaretli', elenmis: ', elendi', dogru: ', doğru cevap', yanlis: ', senin cevabın, yanlış', soluk: '' }[
    durum
  ]

  return (
    <button
      type="button"
      disabled={devreDisi}
      aria-pressed={durum === 'secili'}
      aria-label={`${HARFLER[harf]} şıkkı: ${metin}${etiket}`}
      onPointerDown={(olay) => {
        if (devreDisi || (olay.pointerType === 'mouse' && olay.button !== 0)) return
        uzunOldu.current = false
        bas.current = { x: olay.clientX, y: olay.clientY }
        zamanlayici.current = window.setTimeout(() => {
          zamanlayici.current = undefined
          uzunOldu.current = true
          onUzun()
        }, UZUN_BASIS_MS)
      }}
      onPointerMove={(olay) => {
        if (bas.current && Math.hypot(olay.clientX - bas.current.x, olay.clientY - bas.current.y) > 8) iptal()
      }}
      onPointerUp={iptal}
      onPointerCancel={iptal}
      onPointerLeave={iptal}
      onContextMenu={(olay) => {
        olay.preventDefault()
        if (devreDisi) return
        window.clearTimeout(zamanlayici.current)
        if (uzunOldu.current) return
        uzunOldu.current = true
        onUzun()
      }}
      onClick={() => {
        if (uzunOldu.current) {
          uzunOldu.current = false
          return
        }
        onDokun()
      }}
      className={`flex min-h-11 w-full min-w-0 cursor-pointer items-center gap-2 rounded-xl py-1 pr-1.5 pl-1 text-left transition active:bg-muted disabled:cursor-default ${
        durum === 'soluk' ? 'opacity-60' : durum === 'secili' ? 'bg-primary-soft' : ''
      }`}
    >
      <span
        aria-hidden
        className={`grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-extrabold ${kabarcik}`}
      >
        {durum === 'dogru' ? <Check size={15} strokeWidth={3} /> : durum === 'yanlis' ? <X size={15} strokeWidth={3} /> : HARFLER[harf]}
      </span>
      <span
        className={`min-w-0 flex-1 text-[15px] leading-snug font-semibold ${
          durum === 'elenmis' ? 'text-muted-foreground line-through decoration-2 opacity-60' : ''
        }`}
      >
        <SoruMetni metin={metin} />
      </span>
    </button>
  )
}

function SayfaSorusu({
  sira,
  soru,
  durum,
  sikDuzeniTercihi,
  vurgulu,
  onSec,
  onEle,
  onBuyut,
}: {
  sira: number
  soru: BankaSorusu
  durum: SayfaSoruDurumu
  sikDuzeniTercihi: SikDuzeniTercihi
  vurgulu: boolean
  onSec: (sik: number) => void
  onEle: (sik: number) => void
  onBuyut: (oge: HTMLElement) => void
}) {
  const kok = useRef<HTMLElement>(null)
  const duzen = sayfaSikDuzeni(soru.siklar, sikDuzeniTercihi)
  const sikDurumu = (sik: number) => {
    if (durum.goster) return sik === soru.dogru ? 'dogru' : sik === durum.secim ? 'yanlis' : 'soluk'
    if (durum.elenenler.includes(sik)) return 'elenmis'
    return sik === durum.secim ? 'secili' : 'bos'
  }

  return (
    <article
      ref={kok}
      data-sayfa-sorusu={sira}
      aria-label={`Soru ${sira + 1}`}
      className={`-mx-2 rounded-2xl px-2 pt-3 pb-3 transition-[box-shadow,background-color] duration-700 ${
        vurgulu ? 'bg-primary-soft/60 ring-2 ring-primary-parlak' : 'ring-0 ring-transparent'
      }`}
    >
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="rakam font-display text-[19px] leading-none font-extrabold text-primary">{sira + 1}.</span>
        {durum.supheli && (
          <Star size={15} aria-label="sonra bak" className="fill-warning-dolu text-warning-dolu" />
        )}
        {durum.pas && durum.secim === undefined && !durum.goster && (
          <span className="flex items-center gap-0.5 text-[12px] font-extrabold text-muted-foreground">
            <SkipForward size={13} aria-hidden /> Pas
          </span>
        )}
        {durum.cizimVar && <PenLine size={14} aria-label="çizim var" className="text-muted-foreground" />}
        <span className="flex-1" />
        <button
          type="button"
          onClick={() => kok.current && onBuyut(kok.current)}
          aria-label={`Soru ${sira + 1}: büyüt ve çöz`}
          className="group -my-1.5 -mr-1 grid h-11 place-items-center px-1"
        >
          <span className="flex h-8 items-center gap-1.5 rounded-full bg-primary-dolu pr-3 pl-2.5 text-[13px] font-extrabold text-white transition group-active:scale-95">
            <Maximize2 size={14} aria-hidden /> Çöz
          </span>
        </button>
      </div>

      <div className="text-[15px] leading-[1.55] font-semibold text-foreground">
        <SoruMetni metin={soru.soru} />
      </div>
      {soru.onculler && (
        <ol className="mt-2 space-y-1 rounded-xl bg-muted/60 py-2 pr-2.5 pl-1.5 text-[15px] leading-normal font-semibold">
          {soru.onculler.map((oncul, i) => (
            <li key={i} className="grid grid-cols-[2rem_1fr]">
              <b className="pr-1.5 text-right font-extrabold">{ROMEN[i]}.</b>
              <SoruMetni metin={oncul} />
            </li>
          ))}
        </ol>
      )}
      {/* Sayfada çizim şekli biraz küçük (yazısı ~12,5 px): sayfa kısalır, ayrıntı "Çöz"de.
          Tablo ve akış küçültülmez: sütunları dar ekrana zaten sığmıyor. */}
      {soru.gorsel && (
        <div
          className={`mx-auto mt-2 ${soru.gorsel.tur === 'tablo' || soru.gorsel.tur === 'akis' ? '' : 'max-w-[18rem]'}`}
        >
          <SoruSekli gorsel={soru.gorsel} />
        </div>
      )}

      <div
        className={`mt-2 grid gap-x-1 ${duzen === 'bes' ? 'grid-cols-5' : duzen === 'iki' ? 'grid-cols-2' : 'grid-cols-1'}`}
      >
        {soru.siklar.map((sik, i) => (
          <SayfaSikki
            key={i}
            harf={i}
            metin={sik}
            durum={sikDurumu(i)}
            devreDisi={durum.goster}
            onDokun={() => (durum.elenenler.includes(i) ? onEle(i) : onSec(i))}
            onUzun={() => onEle(i)}
          />
        ))}
      </div>
    </article>
  )
}

/**
 * Test kitabı görünümü: sorular sayfalara dizilir (3–4 soru, `testSayfalari`),
 * sayfalar yana kaydırılarak (kaydırma yakalamalı) ya da alttaki oklarla
 * çevrilir; her sayfa kendi içinde aşağı kayar. Kâğıt: kart yüzeyi, üstte konu
 * ve test kutusu, altta sayfa numarası. Şık sayfadan da işaretlenir; her
 * sorunun üstündeki "Çöz" onu tam ekran büyütür.
 */
export function KitapGorunumu({
  konuAdi,
  testAdi,
  testNo,
  sorular,
  sayfalar,
  aktifSayfa,
  durumAl,
  sikDuzeniTercihi,
  vurgulu,
  bosSayisi,
  bitti,
  onSayfa,
  onSec,
  onEle,
  onBuyut,
  onBitir,
}: {
  konuAdi: string
  testAdi: string
  /** Test kutusundaki numara; yanlış tekrarında yok. */
  testNo: number | null
  sorular: BankaSorusu[]
  sayfalar: number[][]
  aktifSayfa: number
  durumAl: (sira: number) => SayfaSoruDurumu
  sikDuzeniTercihi: SikDuzeniTercihi
  /** Tam ekrandan dönülen soru: görünür yapılır ve kısa süre vurgulanır. */
  vurgulu: number | null
  bosSayisi: number
  bitti: boolean
  onSayfa: (sayfa: number) => void
  onSec: (sira: number, sik: number) => void
  onEle: (sira: number, sik: number) => void
  onBuyut: (sira: number, oge: HTMLElement) => void
  onBitir: () => void
}) {
  const serit = useRef<HTMLDivElement>(null)
  const bildirilen = useRef(aktifSayfa)

  // Açılışta ve tam ekrandan dönüşte: doğru sayfa (kaydırmasız) ve dönülen soru görünür.
  useLayoutEffect(() => {
    const kutu = serit.current
    if (!kutu) return
    kutu.scrollLeft = aktifSayfa * kutu.clientWidth
    bildirilen.current = aktifSayfa
    if (vurgulu !== null) {
      const oge = kutu.querySelector<HTMLElement>(`[data-sayfa-sorusu="${vurgulu}"]`)
      const sayfa = oge?.closest<HTMLElement>('[data-kitap-sayfasi]')
      if (oge && sayfa) {
        const ust = oge.getBoundingClientRect().top - sayfa.getBoundingClientRect().top + sayfa.scrollTop - 12
        if (ust > sayfa.scrollTop + sayfa.clientHeight * 0.6 || ust < sayfa.scrollTop) sayfa.scrollTop = Math.max(0, ust)
      }
    }
    // Sayfa değişimi aşağıdaki efektte (yumuşak); burası yalnız dönüşte.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vurgulu])

  // Oklarla çevrilince kaydır; kaydırmadan gelen değişiklik zaten yerinde.
  useEffect(() => {
    const kutu = serit.current
    if (!kutu || bildirilen.current === aktifSayfa) return
    bildirilen.current = aktifSayfa
    const azalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    kutu.scrollTo({ left: aktifSayfa * kutu.clientWidth, behavior: azalt ? 'auto' : 'smooth' })
  }, [aktifSayfa])

  const kaydirildi = () => {
    const kutu = serit.current
    if (!kutu) return
    const sayfa = Math.round(kutu.scrollLeft / Math.max(1, kutu.clientWidth))
    if (sayfa !== bildirilen.current && sayfa >= 0 && sayfa < sayfalar.length) {
      bildirilen.current = sayfa
      onSayfa(sayfa)
    }
  }

  const son = sayfalar.length - 1
  return (
    <>
      <div
        ref={serit}
        onScroll={kaydirildi}
        className="scrollbar-gizli flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain"
      >
        {sayfalar.map((sayfa, sayfaSirasi) => (
          <section
            key={sayfaSirasi}
            data-kitap-sayfasi
            aria-label={`Sayfa ${sayfaSirasi + 1} / ${sayfalar.length}`}
            className="h-full w-full shrink-0 snap-start snap-always overflow-y-auto overscroll-y-contain px-2.5 pt-2.5 pb-4"
          >
            <div className="golge-kart rounded-[18px] bg-card px-4 pt-3.5 pb-3">
              {/* Kitap başlığı: konu solda, test kutusu sağda, altında turuncu çizgi. */}
              <header className="flex items-end gap-3 border-b-2 border-primary-parlak pb-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-extrabold tracking-[0.1em] text-muted-foreground uppercase">Matematik</p>
                  <p className="truncate font-display text-[15px] leading-tight font-extrabold">{konuAdi}</p>
                </div>
                <div className="shrink-0 rounded-lg border-2 border-primary-parlak px-2 py-0.5 text-center leading-none">
                  {testNo !== null ? (
                    <>
                      <span className="block text-[9px] font-extrabold tracking-[0.14em] text-primary">TEST</span>
                      <span className="rakam block font-display text-[20px] font-extrabold text-primary">{testNo}</span>
                    </>
                  ) : (
                    <span className="block py-1 text-[12px] font-extrabold text-primary">{testAdi}</span>
                  )}
                </div>
              </header>

              <div className="divide-y divide-dashed divide-border">
                {sayfa.map((sira) => (
                  <div key={sira} className="py-1.5">
                    <SayfaSorusu
                      sira={sira}
                      soru={sorular[sira]}
                      durum={durumAl(sira)}
                      sikDuzeniTercihi={sikDuzeniTercihi}
                      vurgulu={vurgulu === sira}
                      onSec={(sik) => onSec(sira, sik)}
                      onEle={(sik) => onEle(sira, sik)}
                      onBuyut={(oge) => onBuyut(sira, oge)}
                    />
                  </div>
                ))}
              </div>

              <footer className="mt-1 flex items-center justify-center border-t border-border pt-2.5">
                <span className="rakam text-[13px] font-extrabold text-muted-foreground">— {sayfaSirasi + 1} —</span>
              </footer>
            </div>

            {sayfaSirasi === son && (
              <div className="golge-kart mt-3 rounded-[18px] bg-card p-4 text-center">
                <p className="font-display font-extrabold">{bitti ? 'Test bitti' : 'Testin sonu'}</p>
                <p className="mt-0.5 text-[13px] font-bold text-muted-foreground">
                  {bitti ? 'Sonuçlarına dönebilirsin.' : bosSayisi === 0 ? 'Bütün soruları işaretledin.' : `${bosSayisi} soru boş.`}
                </p>
                <button
                  type="button"
                  onClick={onBitir}
                  className="mt-3 min-h-12 w-full rounded-xl bg-primary-dolu font-extrabold text-white active:brightness-95"
                >
                  {bitti ? 'Sonuca dön' : 'Testi bitir'}
                </button>
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  )
}

/** Sayfa görünümünün alt çubuğu: ‹ · sayfa göstergesi · › · Bitir. */
export function SayfaGezinmesi({
  aktif,
  toplam,
  bitti,
  hepsiCevapli,
  onSayfa,
  onBitir,
}: {
  aktif: number
  toplam: number
  bitti: boolean
  hepsiCevapli: boolean
  onSayfa: (sayfa: number) => void
  onBitir: () => void
}) {
  const ok = 'grid size-12 shrink-0 place-items-center rounded-xl bg-muted text-foreground transition active:brightness-95 disabled:opacity-35'
  return (
    <nav aria-label="Sayfalar" className="shrink-0 bg-background px-2 pt-1.5 pb-[calc(0.375rem+var(--guvenli-alt))]">
      <div className="flex items-center gap-2">
        <button type="button" aria-label="Önceki sayfa" disabled={aktif === 0} onClick={() => onSayfa(aktif - 1)} className={ok}>
          <ChevronLeft size={22} />
        </button>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1" aria-live="polite">
          <span className="flex gap-1.5" aria-hidden>
            {Array.from({ length: toplam }, (_, i) => (
              <i
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === aktif ? 'w-5 bg-primary-parlak' : 'w-1.5 bg-border'}`}
              />
            ))}
          </span>
          <span className="rakam text-[12.5px] font-extrabold text-muted-foreground">
            Sayfa {aktif + 1} / {toplam}
          </span>
        </div>
        <button
          type="button"
          aria-label="Sonraki sayfa"
          disabled={aktif >= toplam - 1}
          onClick={() => onSayfa(aktif + 1)}
          className={ok}
        >
          <ChevronRight size={22} />
        </button>
        <button
          type="button"
          onClick={onBitir}
          className={`flex min-h-12 shrink-0 items-center gap-1.5 rounded-xl px-4 font-extrabold transition active:brightness-95 ${
            bitti || hepsiCevapli ? 'bg-primary-dolu text-white' : 'bg-muted text-foreground'
          }`}
        >
          <Check size={18} aria-hidden /> {bitti ? 'Sonuç' : 'Bitir'}
        </button>
      </div>
    </nav>
  )
}
