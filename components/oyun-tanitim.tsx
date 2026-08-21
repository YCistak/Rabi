'use client'

import type { OyunTanimi } from '@/lib/oyunlar/tanim'
import type { OyunModu } from '@/lib/oyunlar/mod'
import { vurgulariAyir } from '@/lib/metin'
import { useGeriKatmani } from '@/lib/geri'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { ModSecimi } from '@/components/mod-secimi'

/**
 * Oyun tanıtım penceresi.
 *
 * Oyun her açıldığında çıkar ve turu **o başlatır**: kurallar okunmadan sayaç
 * işlemeye başlasaydı ilk beş saniye boşa giderdi. Oynarken üstteki "?" ile
 * yeniden açılabiliyor; o durumda tur zaten duruyor, düğme "Kapat" olur.
 */
export function OyunTanitim({
  oyun,
  acik,
  rekor,
  baslatir,
  mod,
  setMod,
  ekstra,
  onBasla,
  onKapat,
}: {
  oyun: OyunTanimi
  acik: boolean
  /** Bu oyundaki en iyi puan; 0 ise hiç oynanmamış. */
  rekor: number
  /** Düğme turu başlatıyor mu, yoksa yalnızca pencereyi mi kapatıyor. */
  baslatir: boolean
  /** Seçili tur modu — bütün oyunlarda ortak. */
  mod: OyunModu
  /**
   * Mod seçimi. `null` verilirse seçim hiç çıkmıyor: Oyun Bankası turu modu
   * dinlemiyor (`lib/oyunlar/mod.ts`), orada seçim sunmak yalan olurdu.
   */
  setMod: ((mod: OyunModu) => void) | null
  /**
   * Oyuna özgü başlangıç seçimi (Zihinden İşlem'de işlem türleri). Tur devam
   * ederken "?" ile açılan pencerede verilmez — ayar tur ortasında değişmemeli.
   */
  ekstra?: React.ReactNode
  onBasla: () => void
  onKapat: () => void
}) {
  useGeriKatmani(acik, onKapat)

  if (!acik) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/55 px-4 pt-[calc(1rem+var(--guvenli-ust))] pb-[calc(1rem+var(--guvenli-alt))]">
      <div className="my-auto w-full max-w-sm rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <Rabi durum="calisiyor" boyut={64} />
          <div className="min-w-0">
            <p className="font-display text-xl font-semibold tracking-tight">{oyun.ad}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{oyun.kisaAciklama}</p>
          </div>
        </div>

        <ol className="mt-4 space-y-2.5">
          {oyun.nasilOynanir.map((madde, sira) => (
            <li key={madde} className="flex gap-2.5">
              <span
                aria-hidden
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary"
              >
                {sira + 1}
              </span>
              <span className="text-sm leading-snug text-muted-foreground">
                <Vurgulu metin={madde} />
              </span>
            </li>
          ))}
        </ol>

        {/* Mod seçimi yalnızca turu başlatan pencerede: "?" ile açılan
            pencerede tur zaten sürüyor ve kural tur ortasında değişmemeli. */}
        {baslatir && setMod !== null && (
          <div className="mt-4 border-t border-border pt-4">
            <ModSecimi secili={mod} onSec={setMod} />
          </div>
        )}

        {ekstra && <div className="mt-4 border-t border-border pt-4">{ekstra}</div>}

        {rekor > 0 && (
          <p className="mt-4 rounded-xl bg-muted/70 px-3 py-2.5 text-sm text-muted-foreground">
            Şu anki rekorun <strong className="rakam text-foreground">{rekor}</strong> doğru.
            Geçebilir misin?
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <Buton bicim="ikincil" className="flex-1" onClick={onKapat}>
            {baslatir ? 'Vazgeç' : 'Kapat'}
          </Buton>
          {baslatir && (
            <Buton className="flex-1" onClick={onBasla}>
              Başla
            </Buton>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Maddedeki `**kalın**` ve `*eğik*` bölümleri.
 *
 * Metinler elle yazılıyor, dolayısıyla kullanıcıdan gelen bir şey yok; yine de
 * biçimlendirme HTML üretmeden, parça parça çiziliyor.
 */
function Vurgulu({ metin }: { metin: string }) {
  return (
    <>
      {vurgulariAyir(metin).map((parca, sira) =>
        parca.tur === 'kalin' ? (
          <strong key={sira} className="font-extrabold text-foreground">
            {parca.metin}
          </strong>
        ) : parca.tur === 'egik' ? (
          <em key={sira} className="italic">
            {parca.metin}
          </em>
        ) : (
          <span key={sira}>{parca.metin}</span>
        ),
      )}
    </>
  )
}
