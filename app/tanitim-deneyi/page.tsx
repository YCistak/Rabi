'use client'

import { TanitimSaglayici, useTanitim } from '@/components/tanitim/tanitim-baglami'
import { SpotIsigi } from '@/components/tanitim/spot-isigi'
import { VARSAYILAN_ANIMASYON, type TanitimAnimasyonu } from '@/lib/tanitim-animasyonu'

const ALANLAR: [keyof TanitimAnimasyonu, string][] = [
  ['gecisMs', 'Adımlar arası bekleme'], ['cerceveMs', 'Turuncu çerçevenin çizilmesi'],
  ['aydinlatmaGecikmesiMs', 'Aydınlanma gecikmesi'], ['aydinlatmaMs', 'Aydınlanma süresi'],
  ['balonMs', 'Bilgi balonu geçişi'], ['karartma', 'Grinin koyuluğu'],
]
function AnimasyonDeneyi() {
  const { animasyon, animasyonuAyarla, turuBaslat, turuBitir, tanitimdaMi, aktifAdim, sonrakiAdimaGec, oncekiAdimaDon } = useTanitim()
  return <main className="min-h-dvh bg-background p-4 text-foreground lg:grid lg:grid-cols-[360px_1fr] lg:gap-12">
    <aside data-tanitim-denetimi className="relative z-[10001] h-fit rounded-2xl border border-border bg-card p-5 shadow-lg">
      <h1 className="text-xl font-extrabold">Tanıtım animasyonu</h1>
      <p className="mt-2 text-sm text-muted-foreground">Ayarlar Rabi’nin gerçek rehberinde de kullanılır. Tur kayıtlarına ve kullanıcı verilerine dokunulmaz.</p>
      {ALANLAR.map(([anahtar, ad]) => <label key={anahtar} className="mt-4 block text-sm">
        <span className="flex justify-between gap-2"><span>{ad}</span><strong>{anahtar === 'karartma' ? Math.round(animasyon[anahtar] * 100) + '%' : animasyon[anahtar] + ' ms'}</strong></span>
        <input aria-label={ad} className="mt-1 h-11 w-full accent-primary" type="range" min="0" max={anahtar === 'karartma' ? 0.9 : 3000} step={anahtar === 'karartma' ? 0.01 : 50} value={animasyon[anahtar]} onChange={(olay) => animasyonuAyarla({ ...animasyon, [anahtar]: Number(olay.target.value) })} />
      </label>)}
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="min-h-11 rounded-xl bg-primary px-4 font-bold text-primary-foreground" onClick={() => tanitimdaMi ? (aktifAdim === 0 ? sonrakiAdimaGec() : oncekiAdimaDon()) : turuBaslat('ana_tur')}>{tanitimdaMi ? 'Geçişi oynat' : 'Önizlemeyi başlat'}</button>
        <button className="min-h-11 rounded-xl border border-border px-3" onClick={() => animasyonuAyarla(VARSAYILAN_ANIMASYON)}>Varsayılanlar</button>
        {tanitimdaMi && <button className="min-h-11 rounded-xl border border-border px-3" onClick={turuBitir}>Önizlemeyi kapat</button>}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Değişiklikler otomatik kaydedilir. Mobilde aşağıdaki iki kart arasında deneyebilirsin.</p>
      <a href="/" className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-primary">Rabi’ye dön</a>
    </aside>
    <section className="mx-auto flex w-full max-w-md flex-col gap-16 py-16">
      <article data-tanitim="sinav-hedefi" className="rounded-3xl border border-border bg-card p-6 shadow-lg"><span className="text-sm text-muted-foreground">HEDEFİN</span><h2 className="mt-2 text-2xl font-bold">Hayalindeki üniversite</h2><p className="mt-4 text-primary">Sınava 120 gün · Hedef sıralama 20.000</p></article>
      <article data-tanitim="gunluk-hedef" className="rounded-3xl border border-border bg-card p-6 shadow-lg"><h2 className="text-xl font-bold">Günlük soru hedefi</h2><div className="mt-4 flex items-center gap-4"><div className="grid size-24 place-items-center rounded-full border-8 border-primary text-xl font-bold">40/80</div><p>Bugünkü hedefin yarısı tamamlandı.</p></div></article>
    </section>
    <SpotIsigi />
  </main>
}
export default function TanitimDeneyiSayfasi() {
  return <TanitimSaglayici deneyMi><AnimasyonDeneyi /></TanitimSaglayici>
}
