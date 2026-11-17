import { ArrowLeft, BookOpen, ChevronRight, CircleX, RotateCcw, SkipForward, Star, Timer } from 'lucide-react'
import type { TestDegerlendirmesi } from '@/lib/soru-bankasi/oturum'
import type { SureOzeti } from '@/lib/soru-bankasi/sure'
import { sureYazisi } from '@/lib/soru-bankasi/sure'
import type { CalismaModu } from '@/lib/soru-bankasi/tip'
import { IzgaraAciklamasi, IzgaraHucreleri } from './soru-izgarasi'

function sayiYazisi(deger: number): string {
  return Number.isInteger(deger) ? String(deger) : deger.toFixed(2).replace('.', ',').replace(/0$/, '')
}

/**
 * Test sonu: büyük özet, süre, gözden geçirme (yanlışlar, boş/pas, sonra
 * bakılacaklar yalnız kendi aralarında gezilir; sayfa sayfa inceleme), en çok
 * vakit alan sorular, ızgara ve sonraki adımlar. Çizimler oturumda durduğu
 * için açılan soruda karalaması da görünür.
 */
export function TestSonu({
  baslik,
  mod,
  tekrar,
  degerlendirme,
  sure,
  isaretliler,
  paslar,
  yanlislar,
  boslar,
  sonrakiTestVar,
  onSoruAc,
  onListeAc,
  onSayfadaIncele,
  onYanlislariTekrar,
  onSonrakiTest,
  onKonuyaDon,
}: {
  baslik: string
  mod: CalismaModu
  tekrar: boolean
  degerlendirme: TestDegerlendirmesi
  sure: SureOzeti
  isaretliler: ReadonlySet<number>
  paslar: ReadonlySet<number>
  yanlislar: number[]
  boslar: number[]
  sonrakiTestVar: boolean
  onSoruAc: (sira: number, liste?: number[]) => void
  /** Listedeki sorular yalnız kendi aralarında gezilerek açılır. */
  onListeAc: (liste: number[]) => void
  onSayfadaIncele: () => void
  onYanlislariTekrar: () => void
  onSonrakiTest: () => void
  onKonuyaDon: () => void
}) {
  const { dogru, yanlis, bos, net, sonuclar } = degerlendirme
  const toplam = sonuclar.length
  const isaretliListe = [...isaretliler].sort((a, b) => a - b)
  const ust =
    dogru === toplam
      ? 'Hepsi doğru!'
      : dogru / Math.max(1, toplam) >= 0.75
        ? 'Eline sağlık!'
        : dogru === 0
          ? 'Bitti, şimdi çözümlere bak'
          : 'Bitti!'

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <main className="relative mx-auto flex h-full max-w-md flex-col">
        <header className="shrink-0 pt-[var(--guvenli-ust)]">
          <div className="flex h-12 items-center gap-1 px-1">
            <button
              type="button"
              onClick={onKonuyaDon}
              aria-label="Konuya dön"
              className="grid size-11 place-items-center rounded-xl text-primary active:bg-muted"
            >
              <ArrowLeft size={21} />
            </button>
            <p className="font-display text-[17px] font-extrabold">{baslik} · sonuç</p>
          </div>
        </header>
        <div className="sayfa-girisi min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-[calc(1.5rem+var(--guvenli-alt))]">
          <section className="golge-kart rounded-2xl bg-card p-5">
            <p className="text-[13px] font-extrabold text-muted-foreground">
              {tekrar ? 'Yanlışları tekrar' : mod === 'deneme' ? 'Deneme sonucu' : 'Alıştırma sonucu'}
            </p>
            <h1 className="mt-0.5 font-display text-2xl font-extrabold tracking-tight">{ust}</h1>
            <div className="mt-4 grid grid-cols-3 text-center">
              {(
                [
                  ['Doğru', dogru, 'text-success'],
                  ['Yanlış', yanlis, 'text-danger'],
                  ['Boş', bos, 'text-muted-foreground'],
                ] as const
              ).map(([ad, sayi, renk]) => (
                <div key={ad}>
                  <p className={`rakam font-display text-[34px] leading-none font-extrabold ${renk}`}>{sayi}</p>
                  <p className="mt-1 text-[12.5px] font-bold text-muted-foreground">{ad}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
              <i className="bg-success-dolu" style={{ width: `${(dogru / Math.max(1, toplam)) * 100}%` }} />
              <i className="bg-danger-dolu" style={{ width: `${(yanlis / Math.max(1, toplam)) * 100}%` }} />
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
              <div>
                <dt className="text-[12px] font-bold text-muted-foreground">Süre</dt>
                <dd className="rakam mt-0.5 font-extrabold">{sureYazisi(sure.toplam)}</dd>
              </div>
              <div>
                <dt className="text-[12px] font-bold text-muted-foreground">Soru başına</dt>
                <dd className="rakam mt-0.5 font-extrabold">{sureYazisi(sure.ortalama)}</dd>
              </div>
              <div>
                <dt className="text-[12px] font-bold text-muted-foreground">Net</dt>
                <dd className="rakam mt-0.5 font-extrabold">{sayiYazisi(net)}</dd>
              </div>
            </dl>
          </section>

          <section className="golge-kart mt-3 overflow-hidden rounded-2xl bg-card">
            <h2 className="px-4 pt-4 pb-1 font-display font-extrabold">Gözden geçir</h2>
            <ul>
              {(
                [
                  ['Yanlışların', yanlislar, <CircleX key="y" size={18} className="text-danger" />],
                  ['Boş ve pas geçtiklerin', boslar, <SkipForward key="b" size={18} className="text-muted-foreground" />],
                  [
                    'Sonra bak dediklerin',
                    isaretliListe,
                    <Star key="s" size={18} className="fill-warning-dolu text-warning-dolu" />,
                  ],
                ] as const
              ).map(([ad, liste, simge]) =>
                liste.length === 0 ? null : (
                  <li key={ad} className="border-t border-border first:border-t-0">
                    <button
                      type="button"
                      onClick={() => onListeAc([...liste])}
                      className="flex min-h-12 w-full items-center gap-3 px-4 text-left active:bg-muted"
                    >
                      {simge}
                      <span className="font-extrabold">{ad}</span>
                      <span className="rakam ml-auto font-bold text-muted-foreground">{liste.length}</span>
                      <ChevronRight size={17} className="text-muted-foreground" />
                    </button>
                  </li>
                ),
              )}
              <li className="border-t border-border first:border-t-0">
                <button
                  type="button"
                  onClick={onSayfadaIncele}
                  className="flex min-h-12 w-full items-center gap-3 px-4 text-left active:bg-muted"
                >
                  <BookOpen size={18} className="text-primary" />
                  <span className="font-extrabold">Sayfa sayfa incele</span>
                  <ChevronRight size={17} className="ml-auto text-muted-foreground" />
                </button>
              </li>
            </ul>
          </section>

          <section className="golge-kart mt-3 rounded-2xl bg-card p-4">
            <h2 className="font-display font-extrabold">Sorular</h2>
            <p className="mb-3 text-[12.5px] font-bold text-muted-foreground">Dokun, çözümüyle aç.</p>
            <IzgaraHucreleri
              durumlar={sonuclar.map((d, i) => (d === '-' && paslar.has(i) ? 'pas' : d))}
              isaretliler={isaretliler}
              onSec={(sira) => onSoruAc(sira)}
            />
            <IzgaraAciklamasi deneme={false} />
          </section>

          {sure.enUzun.length > 0 && (
            <section className="golge-kart mt-3 overflow-hidden rounded-2xl bg-card">
              <h2 className="flex items-center gap-2 px-4 pt-4 pb-1 font-display font-extrabold">
                <Timer size={17} className="text-muted-foreground" /> En çok vakit alan
              </h2>
              <ul>
                {sure.enUzun.map(({ sira, sure: soruSuresi }) => (
                  <li key={sira} className="border-t border-border first:border-t-0">
                    <button
                      type="button"
                      onClick={() => onSoruAc(sira)}
                      className="flex min-h-12 w-full items-center gap-3 px-4 text-left active:bg-muted"
                    >
                      <span className="rakam font-extrabold">Soru {sira + 1}</span>
                      <span
                        className={`size-2 rounded-full ${sonuclar[sira] === 'd' ? 'bg-success-dolu' : sonuclar[sira] === 'y' ? 'bg-danger-dolu' : 'bg-muted-foreground/40'}`}
                        aria-hidden
                      />
                      <span className="rakam ml-auto font-bold text-muted-foreground">{sureYazisi(soruSuresi)}</span>
                      <ChevronRight size={17} className="text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-4 space-y-2">
            {yanlis > 0 && (
              <button
                type="button"
                onClick={onYanlislariTekrar}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-danger-soft font-extrabold text-danger active:brightness-95"
              >
                <RotateCcw size={17} /> Yanlışları tekrar çöz <span className="rakam">({yanlis})</span>
              </button>
            )}
            {sonrakiTestVar && !tekrar && (
              <button
                type="button"
                onClick={onSonrakiTest}
                className="min-h-12 w-full rounded-xl bg-primary-dolu font-extrabold text-white active:brightness-95"
              >
                Sonraki test
              </button>
            )}
            <button
              type="button"
              onClick={onKonuyaDon}
              className="min-h-12 w-full rounded-xl bg-muted font-extrabold text-foreground active:brightness-95"
            >
              Konuya dön
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
