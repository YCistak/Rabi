import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'

/*
  Bileşenlerde elle yazılmış renk kalmasın (koyu tema planı, PR 1).

  Koyu tema yalnız değişkenlerin ikinci değer takımı; bileşende yazılmış bir
  `#fff` ya da `bg-white` koyu temada beyaz kalır. Bu test, temadan bağımsız
  olması gereken bir rengin sessizce geri gelmesini yakalar.

  Yasaklar:
  - onaltılık renk (`#fff`, `#1b1a19`) ve saf beyaz `rgba(255,255,255,…)`,
  - düz `bg-white`: kart yüzeyi `bg-card`,
  - yazı tonunun dolgu olarak kullanımı: `bg-primary`, `bg-success`,
    `bg-konu-<ders>-koyu`… → `bg-primary-derin`, `bg-success-dolu`,
    `bg-konu-<ders>-dolgu` (koyu temada yazı tonu açılıyor, dolgu açılmıyor),
  - `bg-foreground` / `text-background` (ters balon) → `bg-ters` / `text-ters-yazi`.

  Gölgeler (`rgba(0,0,0,…)`, sıcak gölge tonları) ve dolgu üstündeki
  `text-white`/`bg-white/20` gibi yarı saydam beyazlar serbest: iki temada da
  doğru görünüyorlar.
*/

const KOK = join(__dirname, '..')

/** Bütünüyle muaf dosyalar — temadan bilerek bağımsız. */
const MUAF_DOSYALAR = new Set([
  // Aylık özet: arayüzden gizli; afiş tuvale çiziliyor ve `var()` çözemiyor.
  'components/ekranlar/aylik-ozet.tsx',
  // Fotoğrafın üstüne çizim: siyah zeminli düzenleyici, kalem paleti fotoğrafa göre.
  'components/soru-cizimi.tsx',
  // Tanıtım deneme sayfası, uygulamaya girmiyor.
  'app/tanitim-deneyi/page.tsx',
])

/** Tek tek izinli satırlar: dosya + satırda geçen parça + neden. */
const IZINLI: { dosya: string; parca: string }[] = [
  // Açılış zemini yerli açılış ekranıyla aynı olmalı; koyu takım PR 6'da gelecek.
  { dosya: 'components/acilis.tsx', parca: "const ZEMIN = '#F8F8F7'" },
  // Çökme ekranı React'ten önce, CSS yüklenmeden çiziliyor.
  { dosya: 'app/layout.tsx', parca: 'background:#fff;color:#111' },
  { dosya: 'app/layout.tsx', parca: "themeColor: '#f8f8f7'" },
  // Tekerleğin kenar soluklaştırması bir maske: renk değil, opaklık.
  { dosya: 'components/secici.tsx', parca: 'transparent, #000 22%, #000 78%, transparent' },
  // Aylık özet daveti (gizli).
  { dosya: 'components/ekranlar/ana-sayfa.tsx', parca: 'linear-gradient(150deg,#E07A34' },
  // Kitap gölgeleri dolgu tonunu karartıp açıyor; dolgu iki temada da doygun.
  { dosya: 'components/ekranlar/konu-haritasi.tsx', parca: 'color-mix(in srgb, var(--' },
  // Dolgu üstündeki küçük beyaz parçalar: anahtar topuzu, seçili radyo noktası, seçili gün noktası.
  { dosya: 'components/ui.tsx', parca: 'rounded-full bg-white shadow transition-all' },
  { dosya: 'components/hata-bildir.tsx', parca: 'size-2 rounded-full bg-white' },
  { dosya: 'components/takvim.tsx', parca: "? 'bg-white'" },
  // Fotoğraf görüntüleyici siyah zeminde.
  { dosya: 'components/ekranlar/yanlis-banka.tsx', parca: 'fixed inset-0 z-50 flex flex-col items-center bg-black' },
  // Kilitli kitabın numarası: dolgu üstünde beyaz.
  { dosya: 'components/ekranlar/konu-haritasi.tsx', parca: "'var(--patika-kitap-kilitli-yazi)' : '#fff'" },
  // Kitabın sırt çizgileri dolgu üstünde.
  { dosya: 'components/ekranlar/konu-haritasi.tsx', parca: "gri ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.3)'" },
]

const YASAKLAR: { ad: string; desen: RegExp }[] = [
  { ad: 'onaltılık renk', desen: /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?(?:[0-9a-fA-F]{2})?\b/ },
  { ad: 'saf beyaz rgba', desen: /rgba?\(\s*255\s*,\s*255\s*,\s*255/ },
  { ad: 'düz bg-white (bg-card kullan)', desen: /(?<![\w-])bg-white(?![\w/-])/ },
  { ad: 'yazı tonu dolgu olarak', desen: /(?<![\w-])bg-(primary|ikincil|success|danger|warning)(?![\w/-])/ },
  { ad: 'ders yazı tonu dolgu olarak', desen: /bg-konu-\w+-koyu\b/ },
  { ad: 'ters balon (bg-ters / text-ters-yazi kullan)', desen: /(?<![\w-])(bg-foreground(?![\w/-])|text-background\b)/ },
]

function dosyalar(dizin: string): string[] {
  return readdirSync(dizin).flatMap((ad) => {
    const yol = join(dizin, ad)
    if (statSync(yol).isDirectory()) return dosyalar(yol)
    return ad.endsWith('.tsx') ? [yol] : []
  })
}

/** Yorum satırları sayılmaz: yorumda renk kodu anlatmak serbest. */
function yorumMu(satir: string): boolean {
  const t = satir.trim()
  return t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('{/*')
}

describe('renk denetimi', () => {
  it('bileşenlerde elle yazılmış renk yok', () => {
    const ihlaller: string[] = []
    for (const yol of [...dosyalar(join(KOK, 'components')), ...dosyalar(join(KOK, 'app'))]) {
      const dosya = relative(KOK, yol).split(sep).join('/')
      if (MUAF_DOSYALAR.has(dosya)) continue
      readFileSync(yol, 'utf8')
        .split(/\r?\n/)
        .forEach((satir, i) => {
          if (yorumMu(satir)) return
          if (IZINLI.some((iz) => iz.dosya === dosya && satir.includes(iz.parca))) return
          for (const { ad, desen } of YASAKLAR) {
            if (desen.test(satir)) ihlaller.push(`${dosya}:${i + 1} — ${ad}: ${satir.trim().slice(0, 120)}`)
          }
        })
    }
    expect(ihlaller).toEqual([])
  })
})
