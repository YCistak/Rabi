import { Check, X } from 'lucide-react'
import { sikDuzeni } from '@/lib/soru-bankasi/duzen'
import { SoruMetni } from './soru-metni'

const HARFLER = 'ABCDE'

/**
 * Şıklar. `cevapla`: seçilebilir ve elenebilir (deneme modunda seçim
 * değiştirilebilir, seçili şıkka yeniden dokununca boşa döner). `goster`:
 * doğru yeşil, yanlış seçim kırmızı; dokunulmaz.
 *
 * Eleme: sağdaki ✕, uzun basış ya da sağ tık (`data-uzun-bas`, karalama
 * yüzeyi tetikler). Elenmiş şıkka dokunmak onu geri getirir, seçmez.
 */
export function Siklar({
  siklar,
  dogru,
  secim,
  kip,
  elenenler,
  elemeIpucu,
  onSec,
  onEle,
}: {
  siklar: readonly string[]
  dogru: number
  secim: number | undefined
  kip: 'cevapla' | 'goster'
  elenenler: readonly number[]
  elemeIpucu: boolean
  onSec: (sira: number) => void
  onEle: (sira: number) => void
}) {
  const duzen = sikDuzeni(siklar)
  const goster = kip === 'goster'

  const durum = (sira: number) => {
    if (goster) return sira === dogru ? 'dogru' : sira === secim ? 'yanlis' : 'soluk'
    if (elenenler.includes(sira)) return 'elenmis'
    return sira === secim ? 'secili' : 'bos'
  }
  const kutuRengi = {
    dogru: 'border-success-dolu bg-success-dolu text-white',
    yanlis: 'border-danger-dolu bg-danger-dolu text-white',
    soluk: 'border-border bg-card text-foreground opacity-55',
    elenmis: 'border-dashed border-border bg-card text-muted-foreground opacity-50',
    secili: 'border-primary-parlak bg-primary-soft text-foreground ring-1 ring-primary-parlak',
    bos: 'border-border bg-card text-foreground',
  } as const
  const harfRengi = {
    dogru: 'bg-white/20 text-white',
    yanlis: 'bg-white/20 text-white',
    soluk: 'bg-muted text-muted-foreground',
    elenmis: 'bg-transparent text-muted-foreground ring-1 ring-border',
    secili: 'bg-primary-derin text-white',
    bos: 'bg-muted text-foreground',
  } as const

  const harf = (sira: number, kucuk = false) => {
    const d = durum(sira)
    return (
      <span
        className={`grid shrink-0 place-items-center rounded-full font-extrabold ${kucuk ? 'size-6 text-[12px]' : 'size-8 text-[14px]'} ${harfRengi[d]}`}
        aria-hidden
      >
        {d === 'dogru' ? (
          <Check size={kucuk ? 14 : 17} strokeWidth={3} />
        ) : d === 'yanlis' ? (
          <X size={kucuk ? 14 : 17} strokeWidth={3} />
        ) : (
          HARFLER[sira]
        )}
      </span>
    )
  }

  const dokun = (sira: number) => {
    if (goster) return
    if (elenenler.includes(sira)) onEle(sira)
    else onSec(sira)
  }

  const etiket = (sira: number) => {
    const d = durum(sira)
    const ek = {
      dogru: ', doğru cevap',
      yanlis: ', senin cevabın, yanlış',
      soluk: '',
      elenmis: ', elendi',
      secili: ', seçili',
      bos: '',
    }[d]
    return `${HARFLER[sira]} şıkkı: ${siklar[sira]}${ek}`
  }

  if (duzen === 'bes') {
    return (
      <div className="mt-5">
        <div className="grid grid-cols-5 gap-2">
          {siklar.map((sik, sira) => (
            <button
              key={sira}
              type="button"
              data-uzun-bas={goster ? undefined : ''}
              data-sik-sira={sira}
              disabled={goster}
              onClick={() => dokun(sira)}
              aria-label={etiket(sira)}
              aria-pressed={durum(sira) === 'secili'}
              className={`flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border px-1 py-1.5 transition active:scale-[0.97] disabled:cursor-default ${kutuRengi[durum(sira)]}`}
            >
              {harf(sira, true)}
              <span
                className={`text-[17px] leading-tight font-extrabold ${durum(sira) === 'elenmis' ? 'line-through decoration-2' : ''}`}
              >
                <SoruMetni metin={sik} />
              </span>
            </button>
          ))}
        </div>
        {elemeIpucu && !goster && (
          <p className="mt-2 text-center text-[12px] font-bold text-muted-foreground">
            Elemek için şıkka basılı tut (farede sağ tık)
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`mt-5 grid gap-2 ${duzen === 'iki' ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {siklar.map((sik, sira) => {
        const d = durum(sira)
        return (
          <div
            key={sira}
            data-uzun-bas={goster ? undefined : ''}
            data-sik-sira={sira}
            className={`flex overflow-hidden rounded-xl border transition ${kutuRengi[d]}`}
          >
            <button
              type="button"
              disabled={goster}
              onClick={() => dokun(sira)}
              aria-label={etiket(sira)}
              aria-pressed={d === 'secili'}
              className="flex min-h-12 min-w-0 flex-1 cursor-pointer items-center gap-2.5 py-2 pl-2.5 text-left transition active:scale-[0.99] disabled:cursor-default"
            >
              {harf(sira)}
              <span
                className={`min-w-0 flex-1 text-[16px] leading-snug font-bold ${d === 'elenmis' ? 'line-through decoration-2' : ''}`}
              >
                <SoruMetni metin={sik} />
              </span>
            </button>
            {!goster && (
              <button
                type="button"
                onClick={() => onEle(sira)}
                aria-label={d === 'elenmis' ? `${HARFLER[sira]} şıkkını geri getir` : `${HARFLER[sira]} şıkkını ele`}
                aria-pressed={d === 'elenmis'}
                className="grid w-10 shrink-0 cursor-pointer place-items-center text-muted-foreground/70 active:bg-muted"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
