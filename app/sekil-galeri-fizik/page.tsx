'use client'

/*
  GEÇİCİ gözle denetim sayfası: fizik şekilleri. Patron onaylayınca silinecek.
  Üstteki örnekler soru yazarlarının şeması `soru-bankasi-calisma/gorev/tip-fizik.ts`
  içindeki `ornekler`in birebir kopyası; altındakiler zorlayıcı durumlar.
*/
import { useEffect, useState } from 'react'
import { SoruSekli } from '@/components/soru-bankasi/soru-sekli'
import type { BankaGorseli } from '@/lib/soru-bankasi/tip'

const BELGE: Record<string, BankaGorseli> = {
  'Seri devre': { tur: 'devre', kollar: [{ bas: [0, 0], bit: [4, 0], eleman: 'pil', deger: '6 V', arti: 'bas' }, { bas: [0, 0], bit: [0, 2], eleman: 'tel', akim: { yon: 'ileri', ad: 'I' } }, { bas: [0, 2], bit: [4, 2], eleman: 'direnc', ad: 'R₁', deger: '4 Ω' }, { bas: [4, 2], bit: [4, 0], eleman: 'lamba', ad: 'L' }] },
  'Paralel dirençler': { tur: 'devre', kollar: [{ bas: [0, 0], bit: [4, 0], eleman: 'pil', deger: '12 V' }, { bas: [0, 0], bit: [0, 2], eleman: 'tel' }, { bas: [4, 0], bit: [4, 2], eleman: 'tel' }, { bas: [0, 2], bit: [4, 2], eleman: 'direnc', ad: 'R₁' }, { bas: [0, 2], bit: [0, 4], eleman: 'tel' }, { bas: [0, 4], bit: [4, 4], eleman: 'direnc', ad: 'R₂' }, { bas: [4, 4], bit: [4, 2], eleman: 'tel' }] },
  'Çukur aynada gerçek görüntü': { tur: 'optik', pencere: [-8, 2, -2, 3], araclar: [{ tur: 'cukurAyna', merkez: [0, 0], boy: 4, odak: 2 }, { tur: 'cisim', bas: [-6, 0], bit: [-6, 1.5], ad: 'K' }, { tur: 'goruntu', bas: [-3, 0], bit: [-3, -0.75], ad: 'K′' }], isinlar: [{ noktalar: [[-6, 1.5], [0, 1.5], [-3, -0.75]] }, { noktalar: [[-6, 1.5], [0, 0], [-3, -0.75]] }] },
  'İki ortamda kırılma': { tur: 'optik', pencere: [-4, 4, -3, 3], araclar: [{ tur: 'sinir', bas: [-4, 0], bit: [4, 0], normal: [0, 0] }], isinlar: [{ noktalar: [[-2, 2], [0, 0], [1.2, -2.25]] }], acilar: [{ merkez: [0, 0], bas: 90, bit: 135, ad: '45°' }], etiketler: [{ konum: [2.8, 1.6], ad: 'Hava' }, { konum: [-2.6, -1.5], ad: 'Cam' }] },
  'Eğik düzlemde blok': { tur: 'duzenek', pencere: [-1, 7, -1, 5], parcalar: [{ tur: 'zemin', noktalar: [[0, 0], [6, 3]] }, { tur: 'blok', merkez: [2.78, 1.95], en: 1.6, boy: 1, aci: 26.565, ad: 'K' }, { tur: 'ok', bas: [3.5, 2.3], bit: [5.1, 3.1], ad: 'F' }] },
  'U borusunda iki sıvı': { tur: 'duzenek', pencere: [-1, 6, -1, 6], parcalar: [{ tur: 'sivi', noktalar: [[0, 2], [1, 2], [1, 1], [4, 1], [4, 3.6], [5, 3.6], [5, 0], [0, 0]] }, { tur: 'sivi', noktalar: [[0, 2], [1, 2], [1, 4], [0, 4]] }, { tur: 'kap', noktalar: [[0, 5], [0, 0], [5, 0], [5, 5]] }, { tur: 'kap', noktalar: [[1, 5], [1, 1], [4, 1], [4, 5]] }], etiketler: [{ konum: [0.5, 3], ad: 'Yağ' }, { konum: [4.5, 2], ad: 'Su' }] },
  'Konum–zaman grafiği': { tur: 'koordinat', pencere: [-1, 6, -1, 6], eksenler: true, xAd: 't (s)', yAd: 'x (m)', egriler: [{ noktalar: [[0, 0], [2, 4], [5, 4]], kirik: true }], noktalar: [{ x: 2, y: 4 }, { x: 5, y: 4 }] },
  'Yayda atma': { tur: 'koordinat', pencere: [-1, 9, -1, 3], eksenler: false, egriler: [{ noktalar: [[0, 0], [2, 0], [3, 1], [4, 2], [5, 1], [6, 0], [8, 0]], kirik: true }, { noktalar: [[5.5, 1.8], [7, 1.8]], ok: true, kirik: true }] },
}

const ZORLAYICI: Record<string, BankaGorseli> = {
  'Kalabalık devre (üreteç iç direnci, anahtar, ampermetre, voltmetre, reosta, düğümler)': {
    tur: 'devre',
    kollar: [
      { bas: [0, 0], bit: [3, 0], eleman: 'pil', ad: 'ε', deger: '24 V', icDirenc: '2 Ω', arti: 'bit' },
      { bas: [3, 0], bit: [6, 0], eleman: 'ampermetre', akim: { yon: 'geri', ad: 'i' } },
      { bas: [0, 0], bit: [0, 2], eleman: 'anahtar', ad: 'S' },
      { bas: [6, 0], bit: [6, 2], eleman: 'reosta', ad: 'Rₓ' },
      { bas: [0, 2], bit: [3, 2], eleman: 'direnc', ad: 'R₁', deger: '6 Ω' },
      { bas: [3, 2], bit: [6, 2], eleman: 'direnc', ad: 'R₂', deger: '3 Ω', akim: { yon: 'ileri', ad: 'i₂' } },
      { bas: [3, 2], bit: [3, 4], eleman: 'tel' },
      { bas: [0, 2], bit: [0, 4], eleman: 'tel' },
      { bas: [0, 4], bit: [3, 4], eleman: 'lamba', ad: 'L₁' },
      { bas: [3, 4], bit: [6, 4], eleman: 'lamba', ad: 'L₂' },
      { bas: [6, 4], bit: [6, 2], eleman: 'voltmetre', ad: 'V₁' },
    ],
    dugumler: [{ konum: [0, 2], ad: 'K' }, { konum: [6, 2], ad: 'L' }],
  },
  'Kapalı anahtar ve uzun etiketler (T bağlantısı bölünmemiş)': {
    tur: 'devre',
    kollar: [
      { bas: [0, 0], bit: [0, 3], eleman: 'pil', deger: 'ε = 1,5 V', icDirenc: 'r = 0,5 Ω' },
      { bas: [0, 3], bit: [4, 3], eleman: 'tel' },
      { bas: [2, 3], bit: [2, 0], eleman: 'direnc', ad: 'R', deger: '12 Ω' },
      { bas: [4, 3], bit: [4, 0], eleman: 'anahtar', kapali: true, ad: 'K' },
      { bas: [0, 0], bit: [4, 0], eleman: 'tel', akim: { yon: 'geri' } },
    ],
  },
  'Tümsek ayna, sanal görüntü': { tur: 'optik', pencere: [-6, 4, -2.5, 2.5], araclar: [{ tur: 'tumsekAyna', merkez: [0, 0], boy: 4, odak: 1.5 }, { tur: 'cisim', bas: [-4, 0], bit: [-4, 1.5], ad: 'X' }, { tur: 'goruntu', bas: [1.1, 0], bit: [1.1, 0.41], ad: 'X′' }], isinlar: [{ noktalar: [[-4, 1.5], [0, 1.5], [-4, 3.5]] }, { noktalar: [[0, 1.5], [1.5, 0]], kesik: true }] },
  'İnce kenarlı mercek': { tur: 'optik', pencere: [-6, 6, -2, 2.5], araclar: [{ tur: 'inceMercek', merkez: [0, 0], boy: 4, odak: 2 }, { tur: 'cisim', bas: [-3, 0], bit: [-3, 1], ad: 'K' }, { tur: 'goruntu', bas: [6, 0], bit: [6, -2] }], isinlar: [{ noktalar: [[-3, 1], [0, 1], [6, -2]] }, { noktalar: [[-3, 1], [0, 0], [6, -2]] }] },
  'Kalın kenarlı mercek, sanal görüntü': { tur: 'optik', pencere: [-5, 4, -2, 2.5], araclar: [{ tur: 'kalinMercek', merkez: [0, 0], boy: 4, odak: 2 }, { tur: 'cisim', bas: [-4, 0], bit: [-4, 1.5] }, { tur: 'goruntu', bas: [-1.33, 0], bit: [-1.33, 0.5] }], isinlar: [{ noktalar: [[-4, 1.5], [0, 1.5], [4, 4.5]] }, { noktalar: [[0, 1.5], [-2, 0]], kesik: true }] },
  'Prizmada kırılma, küçük açı': { tur: 'optik', pencere: [-4, 4, -2.5, 3], araclar: [{ tur: 'prizma', koseler: [[-2, -2], [2, -2], [0, 2.5]] }], isinlar: [{ noktalar: [[-4, -0.2], [-1, 0.25], [1.1, 0.2], [4, -1.2]] }], acilar: [{ merkez: [0, 2.5], bas: 246, bit: 294, ad: 'A' }, { merkez: [1.1, 0.2], bas: 334, bit: 345, ad: '8°' }] },
  'Düzlem ayna, kaynak ve göz': { tur: 'optik', pencere: [-1, 7, -1, 4], araclar: [{ tur: 'duzlemAyna', bas: [0, 0], bit: [6, 0] }, { tur: 'kaynak', konum: [1, 3] }, { tur: 'goz', konum: [5.5, 3], aci: 225 }], isinlar: [{ noktalar: [[1, 3], [3.2, 0], [5.3, 2.8]] }, { noktalar: [[3.2, 0], [1, -3]], kesik: true }], acilar: [{ merkez: [3.2, 0], bas: 53.1, bit: 90, ad: 'α' }] },
  'Makara ve ip': { tur: 'duzenek', pencere: [-1, 6, -1, 6], parcalar: [{ tur: 'zemin', noktalar: [[4, 5.5], [0, 5.5]] }, { tur: 'ip', noktalar: [[2, 5.5], [2, 4]] }, { tur: 'makara', merkez: [2, 4], yaricap: 0.6, ad: 'M' }, { tur: 'ip', noktalar: [[1.4, 4], [1.4, 1.5]] }, { tur: 'ip', noktalar: [[2.6, 4], [2.6, 2.6]] }, { tur: 'blok', merkez: [1.4, 1], en: 1, boy: 1, ad: 'm₁' }, { tur: 'blok', merkez: [2.6, 2.1], en: 0.8, boy: 1, ad: '2m' }, { tur: 'zemin', noktalar: [[-1, 0], [5, 0]] }], etiketler: [{ konum: [3.2, 3], ad: 'h' }] },
  'Eğik düzlem 37°, yatay zemin ve açı yazısı': { tur: 'duzenek', pencere: [-0.5, 8.5, -0.8, 6.5], parcalar: [{ tur: 'zemin', noktalar: [[0, 0], [8, 0]] }, { tur: 'zemin', noktalar: [[0, 0], [8, 6]] }, { tur: 'zemin', noktalar: [[8, 6], [8, 0]] }, { tur: 'blok', merkez: [3.7, 3.4], en: 1.5, boy: 1, aci: 36.87, ad: 'm' }], etiketler: [{ konum: [1.4, 0.4], ad: '37°' }, { konum: [4, -0.5], ad: '8 m' }] },
  'Manyetik alan (⊗ ⊙ simgeleri)': { tur: 'koordinat', pencere: [0, 6, 0, 4], eksenler: false, egriler: [{ noktalar: [[0, 0], [3, 0], [3, 4], [0, 4]], kapali: true, kirik: true, renk: 'soluk' }, { noktalar: [[3.6, 2], [5.4, 2]], ok: true, kirik: true, ad: 'v' }], etiketler: [{ x: 0.75, y: 1, ad: '⊗' }, { x: 1.5, y: 1, ad: '⊗' }, { x: 2.25, y: 1, ad: '⊗' }, { x: 0.75, y: 2, ad: '⊗' }, { x: 1.5, y: 2, ad: '⊗' }, { x: 2.25, y: 2, ad: '⊗' }, { x: 0.75, y: 3, ad: '⊗' }, { x: 1.5, y: 3, ad: '⊗' }, { x: 2.25, y: 3, ad: '⊗' }, { x: 4.5, y: 3.4, ad: '⊙' }, { x: 5.2, y: 3.4, ad: '⊙' }, { x: 1.5, y: 4.4, ad: 'B' }], noktalar: [{ x: 3.6, y: 2, ad: 'q' }] },
  'Hız–zaman grafiği (iki araç)': { tur: 'koordinat', pencere: [-1, 7, -1, 25], eksenler: true, xAd: 't (s)', yAd: 'v (m/s)', egriler: [{ noktalar: [[0, 20], [4, 20], [6, 0]], kirik: true, ad: 'K' }, { noktalar: [[0, 0], [6, 15]], kirik: true, ad: 'L', renk: 'ikincil' }], etiketler: [{ x: 4, y: -2, ad: '4' }, { x: 6, y: -2, ad: '6' }] },
}

function Bolum({ baslik, sekiller }: { baslik: string; sekiller: Record<string, BankaGorseli> }) {
  return (
    <section className="mt-6">
      <h2 className="font-display text-lg font-extrabold">{baslik}</h2>
      {Object.entries(sekiller).map(([ad, g]) => (
        <div key={ad} className="mt-4">
          <p className="text-sm font-bold text-muted-foreground">{ad}</p>
          <SoruSekli gorsel={g} ders="fizik" />
        </div>
      ))}
    </section>
  )
}

export default function FizikSekilGalerisi() {
  const [tema, setTema] = useState<'acik' | 'koyu'>('acik')
  useEffect(() => {
    // Açılış bekçisi (layout.tsx) uygulama kabuğu olmayan bu sayfayı "açılamadı" sanmasın.
    document.documentElement.setAttribute('data-rabi-acildi', '1')
    setTema(document.documentElement.dataset.tema === 'koyu' ? 'koyu' : 'acik')
  }, [])
  const temaSec = (t: 'acik' | 'koyu') => {
    document.documentElement.dataset.tema = t
    setTema(t)
  }
  return (
    <main className="mx-auto min-h-dvh max-w-md bg-background px-4 py-6 text-foreground">
      <h1 className="font-display text-2xl font-extrabold">Fizik şekilleri (geçici)</h1>
      <div className="mt-3 flex gap-2">
        {(['acik', 'koyu'] as const).map((t) => (
          <button key={t} type="button" onClick={() => temaSec(t)} aria-pressed={tema === t} className={`rounded-xl px-4 py-2 font-bold ${tema === t ? 'bg-primary-parlak text-white' : 'bg-muted'}`}>
            {t === 'acik' ? 'Açık' : 'Koyu'}
          </button>
        ))}
      </div>
      <Bolum baslik="Şema belgesindeki örnekler" sekiller={BELGE} />
      <Bolum baslik="Zorlayıcı örnekler" sekiller={ZORLAYICI} />
    </main>
  )
}
