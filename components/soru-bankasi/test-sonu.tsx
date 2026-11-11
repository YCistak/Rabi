import { ArrowLeft, RotateCcw } from 'lucide-react'
import type { BankaKonusu } from '@/lib/soru-bankasi/dizin'
import { durumAl } from '@/lib/soru-bankasi/mantik'
import type { BankaSorusu, SoruBankasiKaydi } from '@/lib/soru-bankasi/tip'

export function TestSonu({
  konu,
  sorular,
  kaynakSiralari,
  kayit,
  tekrar,
  sonrakiTestVar,
  onKonuyaDon,
  onSonrakiTest,
  onSoruAc,
  onYanlislariTekrar,
}: {
  konu: BankaKonusu
  sorular: BankaSorusu[]
  kaynakSiralari: number[]
  kayit: SoruBankasiKaydi
  tekrar: boolean
  sonrakiTestVar: boolean
  onKonuyaDon: () => void
  onSonrakiTest: () => void
  onSoruAc: (sira: number) => void
  onYanlislariTekrar: () => void
}) {
  const durumlar = kaynakSiralari.map((sira) => durumAl(kayit, konu.id, sira))
  const dogru = durumlar.filter((durum) => durum === 'd').length
  const yanlis = durumlar.filter((durum) => durum === 'y').length
  const bos = durumlar.filter((durum) => durum === '-').length

  return (
    <main className="sayfa-girisi mx-auto max-w-md px-4 pb-28">
      <button type="button" onClick={onKonuyaDon} className="mb-3 flex min-h-11 items-center gap-1 text-primary">
        <ArrowLeft size={18} /> Konuya dön
      </button>
      <section className="golge-kart rounded-2xl bg-card p-5">
        <p className="text-sm font-extrabold text-muted-foreground">{tekrar ? 'Yanlışları tekrar çözme' : 'Test tamamlandı'}</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold">Eline sağlık!</h1>
        <p className="mt-2 rakam text-muted-foreground">{dogru} doğru · {yanlis} yanlış · {bos} boş</p>
        <div className="mt-5 grid grid-cols-6 gap-2" aria-label="Soru sonuçları">
          {sorular.map((_, sira) => (
            <button type="button" key={sira} onClick={() => onSoruAc(sira)} className={`grid aspect-square place-items-center rounded-xl text-sm font-extrabold ${durumlar[sira] === 'd' ? 'bg-success-dolu text-white' : durumlar[sira] === 'y' ? 'bg-danger-dolu text-white' : 'bg-muted text-muted-foreground'}`}>
              {sira + 1}
            </button>
          ))}
        </div>
        {yanlis > 0 && <p className="mt-4 flex items-center gap-2 text-sm font-bold text-muted-foreground"><RotateCcw size={16} /> Yanlışları konu sayfasından yeniden çözebilirsin.</p>}
      </section>
      <div className="mt-4 space-y-2">
        {sonrakiTestVar && <button type="button" onClick={onSonrakiTest} className="min-h-12 w-full rounded-xl bg-primary-dolu font-extrabold text-white">Sonraki test</button>}
        {yanlis > 0 && <button type="button" onClick={onYanlislariTekrar} className="min-h-12 w-full rounded-xl bg-danger-soft font-extrabold text-danger">Yanlışları tekrar çöz</button>}
        <button type="button" onClick={onKonuyaDon} className="min-h-12 w-full rounded-xl bg-muted font-extrabold text-foreground">Konuya dön</button>
      </div>
    </main>
  )
}
