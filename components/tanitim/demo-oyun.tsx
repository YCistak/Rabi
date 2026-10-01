'use client'

import { DEMO_SORULAR, demoSonucu, type TanitimZorlugu } from '@/lib/tanitim'
import { Buton, Kart } from '@/components/ui'
import { useTanitim } from './tanitim-baglami'

export function DemoOyunKarti() {
  const { gonder } = useTanitim()
  return (
    <button type="button" data-tanitim="demo-oyun" onClick={() => gonder({ tur: 'hedefe-dokun', hedef: 'demo-oyun' })}
      className="golge-kart mt-4 flex w-full items-center justify-between rounded-2xl border border-primary/25 bg-primary-soft p-4 text-left focus-visible:outline-2 focus-visible:outline-ring">
      <span><span className="block text-xs font-bold text-primary">BİR SORULUK DENEME</span><span className="mt-1 block font-display text-lg font-extrabold">Demo Oyun</span></span>
      <span className="text-primary" aria-hidden>→</span>
    </button>
  )
}

export function DemoOyun() {
  const { adim, demo, gonder } = useTanitim()
  const sira = 0
  const soru = DEMO_SORULAR[demo.zorluk ?? 'orta'][sira]
  const secilen = demo.cevaplar[sira]
  const sonuc = demoSonucu(demo)
  return (
    <div className="space-y-4">
      <header><p className="text-xs font-bold text-primary">TANITIM · GEÇİCİ DEMO</p><h1 className="mt-1 font-display text-2xl font-extrabold">Zihinden İşlem</h1><p className="mt-1 text-sm text-muted-foreground">Bir soru dene, oyunların akışını tanı.</p></header>
      {adim?.kimlik === 'zorluk' ? (
        <Kart data-tanitim="demo-zorluk">
          <h2 className="mb-3 font-extrabold">Zorluk seçimi</h2>
          <div className="grid grid-cols-3 gap-2">
            {(['kolay', 'orta', 'zor'] as TanitimZorlugu[]).map((zorluk, sira) => <Buton key={zorluk} bicim="ikincil" onClick={() => gonder({ tur: 'zorluk-sec', zorluk })}>{['Kolay', 'Orta', 'Zor'][sira]}</Buton>)}
          </div>
        </Kart>
      ) : adim?.kimlik === 'sonuc' ? (
        <Kart data-tanitim="demo-sonuc">
          <h2 className="font-display text-xl font-extrabold">Demo tamamlandı</h2>
          <p className="my-3 text-sm text-muted-foreground">Bu sonuç istatistiklerine kaydedilmedi.</p>
          <dl className="grid grid-cols-3 gap-2 text-center">
            {[['Doğru', sonuc.dogru], ['Yanlış', sonuc.yanlis], ['Skor', sonuc.skor]].map(([ad, deger]) => <div key={ad} className="rounded-xl bg-muted p-3"><dt className="text-xs text-muted-foreground">{ad}</dt><dd className="rakam text-2xl font-extrabold">{deger}</dd></div>)}
          </dl>
        </Kart>
      ) : (
        <Kart data-tanitim="demo-soru">
          <p className="text-xs font-bold text-muted-foreground">SORU {sira + 1} / 1</p>
          <h2 className="rakam my-4 font-display text-3xl font-extrabold">{soru.metin}</h2>
          <div className="grid grid-cols-3 gap-2">
            {soru.secenekler.map((cevap) => <Buton key={cevap} bicim={secilen === cevap ? 'birincil' : 'ikincil'} aria-pressed={secilen === cevap} disabled={secilen !== undefined} onClick={() => gonder({ tur: 'cevapla', cevap })}>{cevap}</Buton>)}
          </div>
          {secilen !== undefined && <p role="status" className="mt-3 text-sm font-bold">{secilen === soru.cevap ? 'Doğru cevap!' : `Doğru cevap ${soru.cevap}. Bu soruyu tekrar ederek pekiştirebilirsin.`}</p>}
          <Buton className="mt-4 w-full" disabled={secilen === undefined} onClick={() => gonder({ tur: 'soruyu-gec' })}>Sonucu gör</Buton>
        </Kart>
      )}
    </div>
  )
}
