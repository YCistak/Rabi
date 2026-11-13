import { ChevronRight, Play, RotateCcw, Timer } from 'lucide-react'
import type { BankaKonusu } from '@/lib/soru-bankasi/dizin'
import { durumAl, ozet, TEST_BOYUTU, testlereBol, zorlukEtiketi } from '@/lib/soru-bankasi/mantik'
import { yarimTestBul } from '@/lib/soru-bankasi/oturum'
import { kisaSureYazisi } from '@/lib/soru-bankasi/sure'
import { testSonucuAl } from '@/lib/soru-bankasi/testler'
import type { BankaSorusu, CalismaModu, SoruBankasiKaydi, SoruBankasiTestleri } from '@/lib/soru-bankasi/tip'

const MOD_ACIKLAMASI: Record<CalismaModu, string> = {
  alistirma: 'Her cevaptan sonra doğrusunu ve çözümü görürsün.',
  deneme: 'Cevapların test bitince değerlendirilir; şık değiştirebilir, boş bırakabilirsin.',
}

export function KonuSayfasi({
  konu,
  sorular,
  kayit,
  testler,
  mod,
  onMod,
  onAc,
  onDevam,
  onTekrar,
}: {
  konu: BankaKonusu
  sorular: BankaSorusu[]
  kayit: SoruBankasiKaydi
  testler: SoruBankasiTestleri
  mod: CalismaModu
  onMod: (mod: CalismaModu) => void
  onAc: (test: number) => void
  onDevam: (test: number) => void
  onTekrar: (siralar: number[]) => void
}) {
  const konuOzeti = ozet(kayit, konu.id, sorular.length)
  const yanlislar = sorular.map((_, sira) => sira).filter((sira) => durumAl(kayit, konu.id, sira) === 'y')
  const yarim = yarimTestBul(kayit, testler, konu.id, sorular.length)

  return (
    <main className="sayfa-girisi mx-auto max-w-md px-4 pb-28">
      <h1 className="font-display text-2xl font-extrabold">{konu.ad}</h1>
      <p className="mt-1 text-sm font-bold text-muted-foreground">
        <span className="rakam">
          {konuOzeti.cozulen}/{sorular.length}
        </span>{' '}
        çözüldü · <span className="rakam">{konuOzeti.dogru}</span> doğru · <span className="rakam">{konuOzeti.yanlis}</span>{' '}
        yanlış
      </p>

      <div role="group" aria-label="Çalışma modu" className="mt-4 grid grid-cols-2 gap-1 rounded-[18px] bg-muted/70 p-1">
        {(
          [
            ['alistirma', 'Alıştırma'],
            ['deneme', 'Deneme'],
          ] as const
        ).map(([deger, ad]) => (
          <button
            key={deger}
            type="button"
            onClick={() => onMod(deger)}
            aria-pressed={mod === deger}
            className={`min-h-11 rounded-[14px] font-display font-extrabold transition ${mod === deger ? 'golge-kart bg-secili text-foreground ring-1 ring-secili-kenar' : 'text-muted-foreground active:bg-card/60'}`}
          >
            {ad}
          </button>
        ))}
      </div>
      <p className="mt-2 px-1 text-[12.5px] font-bold text-muted-foreground">{MOD_ACIKLAMASI[mod]}</p>

      {yarim && (
        <button
          type="button"
          onClick={() => onDevam(yarim.test)}
          className="golge-kart mt-4 flex min-h-14 w-full items-center gap-3 rounded-2xl bg-card px-4 py-3 text-left active:scale-[0.99]"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-dolu text-white">
            <Play size={18} className="translate-x-px fill-current" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-extrabold">Kaldığın yerden devam et</span>
            <span className="rakam block text-[12.5px] font-bold text-muted-foreground">
              Test {yarim.test + 1} · {yarim.cozulen}/{yarim.toplam} · Alıştırma
            </span>
          </span>
          <ChevronRight size={18} className="text-muted-foreground" />
        </button>
      )}

      {yanlislar.length > 0 && (
        <button
          type="button"
          onClick={() => onTekrar(yanlislar)}
          className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-danger-soft font-extrabold text-danger active:brightness-95"
        >
          <RotateCcw size={17} /> Yanlışlarımı tekrar çöz <span className="rakam">({yanlislar.length})</span>
        </button>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        {testlereBol(sorular).map((test, sira) => {
          const bas = sira * TEST_BOYUTU
          const sonuc = testSonucuAl(testler, konu.id, sira)
          const kayittan = test.reduce(
            (toplam, _, indeks) => {
              const durum = durumAl(kayit, konu.id, bas + indeks)
              return {
                cozulen: toplam.cozulen + Number(durum !== '-'),
                dogru: toplam.dogru + Number(durum === 'd'),
                yanlis: toplam.yanlis + Number(durum === 'y'),
              }
            },
            { cozulen: 0, dogru: 0, yanlis: 0 },
          )
          // Bitirilmiş testte son çözüşün sonucu (süresiyle birlikte), yoksa ilk cevaplar.
          const bitti = sonuc !== undefined || kayittan.cozulen === test.length
          const dogru = sonuc?.dogru ?? kayittan.dogru
          const yanlis = sonuc?.yanlis ?? kayittan.yanlis
          const yarimMi = yarim?.test === sira
          return (
            <button
              key={sira}
              type="button"
              onClick={() => (yarimMi ? onDevam(sira) : onAc(sira))}
              className="golge-kart flex min-h-28 flex-col rounded-2xl bg-card p-4 text-left transition active:scale-[0.98]"
            >
              <span className="font-display text-lg font-extrabold">
                Test {sira + 1}{' '}
                <span className="text-[13px] font-bold text-muted-foreground">
                  · {zorlukEtiketi(test.map((soru) => soru.zorluk))}
                </span>
              </span>
              <span className="rakam mt-1 block text-[12.5px] font-bold text-muted-foreground">
                {bitti
                  ? `${dogru} doğru · ${yanlis} yanlış`
                  : kayittan.cozulen === 0
                    ? 'Başlanmadı'
                    : `${kayittan.cozulen}/${test.length} çözüldü`}
              </span>
              {sonuc && (
                <span className="rakam mt-0.5 flex items-center gap-1 text-[12.5px] font-bold text-muted-foreground">
                  <Timer size={13} aria-hidden /> {kisaSureYazisi(sonuc.sure)}
                </span>
              )}
              <span className="mt-auto pt-3">
                <span className="flex h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                  {bitti ? (
                    <>
                      <i className="bg-success-dolu" style={{ width: `${(dogru / test.length) * 100}%` }} />
                      <i className="bg-danger-dolu" style={{ width: `${(yanlis / test.length) * 100}%` }} />
                    </>
                  ) : (
                    <i
                      className="bg-primary-parlak"
                      style={{
                        width: `${(kayittan.cozulen / test.length) * 100}%`,
                      }}
                    />
                  )}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </main>
  )
}
