import { ChevronDown, CircleCheck, CircleMinus, CircleX, Star } from 'lucide-react'
import type { BankaSorusu, SoruDurumu } from '@/lib/soru-bankasi/tip'
import { Siklar } from './siklar'
import { SoruMetni } from './soru-metni'
import { SoruSekli } from './soru-sekli'

const HARFLER = 'ABCDE'
const ROMEN = ['I', 'II', 'III', 'IV', 'V']

/**
 * Sorunun kendisi: kök, öncüller, şekil, şıklar ve (gösterilecekse) sonuç
 * bandı ile katlanabilir çözüm. Kâğıt sayfası gibi: kutu içinde kutu yok,
 * yalnız öncüller girintili bir zeminde.
 */
export function SoruGovdesi({
  soru,
  numara,
  isaretli,
  secim,
  sonuc,
  goster,
  oncekiDurum,
  elenenler,
  elemeIpucu,
  cozumAcik,
  onSec,
  onEle,
  onCozum,
}: {
  soru: BankaSorusu
  numara: number
  isaretli: boolean
  secim: number | undefined
  /** Gösterilecekse sorunun sonucu. */
  sonuc: SoruDurumu
  /** Doğru/yanlış ve çözüm görünür mü (alıştırmada cevaptan, denemede bitişten sonra). */
  goster: boolean
  /** Kaldığı yerden devam edilen testte önceki çözüşün sonucu. */
  oncekiDurum?: Exclude<SoruDurumu, '-'>
  elenenler: readonly number[]
  elemeIpucu: boolean
  cozumAcik: boolean
  onSec: (sira: number) => void
  onEle: (sira: number) => void
  onCozum: () => void
}) {
  return (
    <article className="px-4 pt-4 pb-6">
      <p className="mb-1.5 flex items-center gap-1.5 text-[13px] font-extrabold text-muted-foreground">
        <span className="rakam">Soru {numara}</span>
        {isaretli && <Star size={13} aria-label="işaretli" className="fill-warning-dolu text-warning-dolu" />}
      </p>
      <div className="text-[17px] leading-[1.65] font-semibold text-foreground">
        <SoruMetni metin={soru.soru} />
      </div>
      {soru.onculler && (
        <ol className="mt-3 space-y-1.5 rounded-xl bg-muted/60 py-2.5 pr-3 pl-2 text-[16px] leading-relaxed font-semibold">
          {soru.onculler.map((oncul, sira) => (
            <li key={sira} className="grid grid-cols-[2.25rem_1fr]">
              <b className="text-right pr-2 font-extrabold">{ROMEN[sira]}.</b>
              <SoruMetni metin={oncul} />
            </li>
          ))}
        </ol>
      )}
      {soru.gorsel && (
        <div className="mt-3">
          <SoruSekli gorsel={soru.gorsel} />
        </div>
      )}
      <Siklar
        siklar={soru.siklar}
        dogru={soru.dogru}
        secim={secim}
        kip={goster ? 'goster' : 'cevapla'}
        elenenler={elenenler}
        elemeIpucu={elemeIpucu}
        onSec={onSec}
        onEle={onEle}
      />
      {!goster && oncekiDurum && (
        <p className="mt-3 text-[13px] font-bold text-muted-foreground">
          Bu soruyu daha önce çözdün ({oncekiDurum === 'd' ? 'doğru' : 'yanlış'}
          ). Yeniden çözebilirsin; kayıt değişmez.
        </p>
      )}
      {goster && (
        <div data-sonuc>
          <p
            className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[15px] font-extrabold ${
              sonuc === 'd'
                ? 'bg-success-soft text-success'
                : sonuc === 'y'
                  ? 'bg-danger-soft text-danger'
                  : 'bg-muted text-muted-foreground'
            }`}
          >
            {sonuc === 'd' ? <CircleCheck size={19} /> : sonuc === 'y' ? <CircleX size={19} /> : <CircleMinus size={19} />}
            {sonuc === 'd' ? 'Doğru' : `${sonuc === 'y' ? 'Yanlış' : 'Boş bıraktın'} · doğru cevap ${HARFLER[soru.dogru]}`}
          </p>
          <section className="mt-2.5 overflow-hidden rounded-2xl border border-border bg-card">
            <button
              type="button"
              onClick={onCozum}
              aria-expanded={cozumAcik}
              className="flex min-h-12 w-full items-center justify-between px-4 text-left font-display text-[16px] font-extrabold"
            >
              Çözüm
              <ChevronDown size={19} className={`text-muted-foreground transition-transform ${cozumAcik ? 'rotate-180' : ''}`} />
            </button>
            {cozumAcik && (
              <div className="border-t border-border px-4 pt-3 pb-4 text-[16px] leading-relaxed">
                <SoruMetni metin={soru.cozum} />
              </div>
            )}
          </section>
        </div>
      )}
    </article>
  )
}
