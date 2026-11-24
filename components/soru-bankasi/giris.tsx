import { ChevronRight } from 'lucide-react'
import { BANKA_DERSLERI, type BankaDersi } from '@/lib/soru-bankasi/ders'
import { BANKA_DIZINLERI, type BankaKonusu } from '@/lib/soru-bankasi/dizin'
import { ozet } from '@/lib/soru-bankasi/mantik'
import type { SoruBankasiKaydi } from '@/lib/soru-bankasi/tip'

/** Konu satırının noktası: renk derse aittir (sınıf adları sabit kalsın diye tablo). */
const DERS_NOKTASI: Record<BankaDersi, string> = {
  matematik: 'bg-konu-matematik-dolgu',
  fizik: 'bg-konu-fizik-dolgu',
  kimya: 'bg-konu-kimya-dolgu',
}

export function SoruBankasiGiris({ ders, sinif, kayit, onDers, onSinif, onKonu }: { ders: BankaDersi; sinif: 9 | 10 | 11; kayit: SoruBankasiKaydi; onDers: (ders: BankaDersi) => void; onSinif: (sinif: 9 | 10 | 11) => void; onKonu: (konu: BankaKonusu) => void }) {
  const veri = BANKA_DIZINLERI[ders].find((deger) => deger.sinif === sinif)!
  const konular = veri.temalar.flatMap((tema) => tema.konular)
  const toplam = konular.reduce((sonuc, konu) => sonuc + konu.sayi, 0)
  const bilgi = konular.reduce((sonuc, konu) => {
    const konuOzeti = ozet(kayit, konu.id, konu.sayi)
    return { dogru: sonuc.dogru + konuOzeti.dogru, yanlis: sonuc.yanlis + konuOzeti.yanlis, cozulen: sonuc.cozulen + konuOzeti.cozulen }
  }, { dogru: 0, yanlis: 0, cozulen: 0 })
  const yuzde = bilgi.cozulen === 0 ? null : Math.round((bilgi.dogru / bilgi.cozulen) * 100)
  return <main className="sayfa-girisi mx-auto max-w-md px-4 pb-28">
    <h1 className="font-display text-2xl font-extrabold tracking-tight">Soru Bankası</h1>
    {/* Ders ve sınıf aynı sade sekmeyle seçilir; ders sekmesi biraz alçak, sınıf onun altında. */}
    <div role="group" aria-label="Ders" className="mt-4 grid grid-cols-3 gap-1 rounded-[18px] bg-muted/70 p-1">
      {BANKA_DERSLERI.map((d) => <button key={d.id} type="button" onClick={() => onDers(d.id)} aria-pressed={ders === d.id} className={`min-h-[44px] rounded-[14px] font-display text-[15px] font-extrabold transition ${ders === d.id ? 'golge-kart bg-secili text-foreground ring-1 ring-secili-kenar' : 'text-muted-foreground active:bg-card/60'}`}>{d.ad}</button>)}
    </div>
    <div role="group" aria-label="Sınıf" className="mt-2 grid grid-cols-3 gap-1 rounded-[18px] bg-muted/70 p-1">
      {([9, 10, 11] as const).map((deger) => <button key={deger} type="button" onClick={() => onSinif(deger)} aria-pressed={sinif === deger} className={`min-h-[52px] rounded-[14px] font-display text-base font-extrabold transition ${sinif === deger ? 'golge-kart bg-secili text-foreground ring-1 ring-secili-kenar' : 'text-muted-foreground active:bg-card/60'}`}><span className="rakam">{deger}.</span> sınıf</button>)}
    </div>
    <p className="mt-3 px-1 text-sm font-bold text-muted-foreground">{toplam === 0 ? 'Bu sınıfın soruları hazırlanıyor' : bilgi.cozulen === 0 ? <><span className="rakam">{toplam}</span> soru seni bekliyor</> : <><span className="rakam">{toplam}</span> sorudan <span className="rakam">{bilgi.cozulen}</span>'i çözüldü · <span className="rakam">%{yuzde}</span> doğru</>}</p>
    {veri.temalar.map((tema) => <section key={tema.id} className="mt-5"><h2 className="px-1 text-[11px] font-extrabold tracking-[0.08em] text-muted-foreground uppercase">{tema.ad}</h2><ul className="golge-kart mt-2 overflow-hidden rounded-[18px] bg-card">{tema.konular.map((konu) => <KonuSatiri key={konu.id} konu={konu} nokta={DERS_NOKTASI[ders]} kayit={kayit} onAc={() => onKonu(konu)} />)}</ul></section>)}
  </main>
}

function KonuSatiri({ konu, nokta, kayit, onAc }: { konu: BankaKonusu; nokta: string; kayit: SoruBankasiKaydi; onAc: () => void }) {
  const bilgi = ozet(kayit, konu.id, konu.sayi)
  const toplam = Math.max(1, konu.sayi)
  return <li className="border-b border-border last:border-b-0"><button type="button" disabled={!konu.yukle} onClick={onAc} className="flex min-h-[66px] w-full items-center gap-3 px-3 py-2 text-left transition active:bg-muted disabled:opacity-45"><span className={`size-3 shrink-0 rounded-full ${nokta}`} /><span className="min-w-0 flex-1"><span className="block font-extrabold">{konu.ad}</span><span className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-muted"><i className="bg-success-dolu" style={{ width: `${(bilgi.dogru / toplam) * 100}%` }} /><i className="bg-danger-dolu" style={{ width: `${(bilgi.yanlis / toplam) * 100}%` }} /></span></span><span className="rakam text-[12.5px] font-bold text-muted-foreground">{konu.yukle ? `${bilgi.cozulen}/${konu.sayi}` : 'Yakında'}</span><ChevronRight size={17} className="shrink-0 text-muted-foreground" /></button></li>
}
