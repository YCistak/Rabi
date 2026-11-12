import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/*
  İki temada da yazı okunsun (koyu tema planı, PR 2).

  `globals.css`teki iki değer takımını okur (`:root` ve
  `:root[data-tema='koyu']`) ve belli yazı/zemin çiftlerinin kontrastını
  WCAG formülüyle ölçer. Eşikler: gövde yazısı 4,5; büyük yazı, ikon ve
  dolgu üstündeki kalın kısa yazı 3. Bir renk değiştirince ya da koyu takıma
  yeni değer yazınca bu test düşüyorsa ton okunmuyor demektir.
*/

const css = readFileSync(join(__dirname, '..', 'app', 'globals.css'), 'utf8')

function takim(secici: RegExp): Record<string, string> {
  const degerler: Record<string, string> = {}
  for (const blok of css.matchAll(secici)) {
    for (const [, ad, deger] of blok[1].matchAll(/(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) degerler[ad] = deger
  }
  return degerler
}

const ACIK = takim(/^:root\s*\{([^}]*)\}/gm)
const KOYU = { ...ACIK, ...takim(/^:root\[data-tema='koyu'\]\s*\{([^}]*)\}/gm) }

function parlaklik(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function kontrast(a: string, b: string): number {
  const [x, y] = [parlaklik(a), parlaklik(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

const BEYAZ = '#ffffff'
const DERSLER = ['matematik', 'turkce', 'fizik', 'kimya', 'biyoloji', 'tarih', 'cografya', 'ingilizce']
const AILELER = ['yzm', 'isl', 'edb', 'cog', 'trh', 'byl', 'fzk', 'dil']
const AYARLAR = ['calisma', 'hatirlatma', 'gorunum', 'ses', 'yasal', 'destek', 'veri']
const GOREVLER = ['turuncu', 'kirmizi', 'gul', 'mor', 'lacivert', 'mavi', 'deniz', 'yesil', 'zeytin', 'hardal', 'kahve', 'gri']

/** [yazı, zemin, eşik]; `#ffffff` doğrudan renk, ötekiler değişken adı. */
const CIFTLER: [string, string, number][] = [
  ['--foreground', '--background', 4.5],
  ['--foreground', '--card', 4.5],
  ['--foreground', '--muted', 4.5],
  ['--muted-foreground', '--card', 4.5],
  ['--muted-foreground', '--background', 4.5],
  ['--primary', '--card', 4.5],
  ['--primary', '--background', 4.5],
  ['--foreground', '--secili', 4.5],
  ['--primary', '--secili', 4.5],
  ['--ters-yazi', '--ters', 4.5],
  ['--ikincil', '--card', 4.5],
  ['--success', '--card', 3],
  ['--danger', '--card', 3],
  ['--warning', '--card', 3],
  [BEYAZ, '--primary-parlak', 3],
  [BEYAZ, '--primary-derin', 4.5],
  [BEYAZ, '--ikincil-dolu', 4.5],
  [BEYAZ, '--success-dolu', 4.5],
  [BEYAZ, '--danger-dolu', 4.5],
  [BEYAZ, '--warning-dolu', 3],
  ...DERSLER.flatMap((d): [string, string, number][] => [
    [`--konu-${d}-koyu`, `--konu-${d}`, 4.5],
    [`--konu-${d}-koyu`, '--card', 4.5],
    [BEYAZ, `--konu-${d}-dolgu`, 4.5],
  ]),
  // Eski aileler ikon ve büyük yazıda (araç kutucukları, rozet kademeleri);
  // açıktaki kırmızı/sarı koyuları 4,5'e zaten ulaşmıyor (globals.css, Ayarlar notu).
  ...AILELER.map((a): [string, string, number] => [`--${a}-koyu`, `--${a}`, 3]),
  ...AYARLAR.map((a): [string, string, number] => [`--ayar-${a}-koyu`, `--ayar-${a}`, 4.5]),
  ...GOREVLER.map((g): [string, string, number] => [`--gorev-${g}`, '--card', 4.5]),
  // Soru Bankası karalaması: mürekkep sayfa zemininde ve kartta (şık) okunmalı.
  // Vurgulayıcı yazı değil, yazının arkasındaki yarı saydam zemin: aşağıda ayrı ölçülür.
  ...['kursun', 'kirmizi', 'mavi', 'yesil'].flatMap((m): [string, string, number][] => [
    [`--murekkep-${m}`, '--background', 3],
    [`--murekkep-${m}`, '--card', 3],
  ]),
]

function renk(takimi: Record<string, string>, ad: string): string {
  if (ad.startsWith('#')) return ad
  const deger = takimi[ad]
  if (!deger) throw new Error(`${ad} onaltılık değer olarak bulunamadı`)
  return deger
}

describe.each([
  ['açık', ACIK],
  ['koyu', KOYU],
])('%s tema kontrastı', (_, takimi) => {
  it('her çift eşiğini geçiyor', () => {
    const dusukler = CIFTLER.flatMap(([yazi, zemin, esik]) => {
      const oran = kontrast(renk(takimi, yazi), renk(takimi, zemin))
      return oran < esik ? [`${yazi} / ${zemin}: ${oran.toFixed(2)} < ${esik}`] : []
    })
    expect(dusukler).toEqual([])
  })

  // Vurgulayıcı `VURGU_SAYDAMLIK` (karalama-katmani.tsx) ile zemine karışır;
  // karışık renk üstünde yazı okunmalı, karışık renk de zeminden seçilmeli.
  it('vurgulayıcı zemine karışınca yazı okunuyor ve vurgu seçiliyor', () => {
    const dusukler = ['--background', '--card'].flatMap((zemin) => {
      const alt = renk(takimi, zemin)
      const karisik = karistir(renk(takimi, '--murekkep-vurgu'), alt, VURGU_SAYDAMLIK)
      const yazi = kontrast(renk(takimi, '--foreground'), karisik)
      const ayrim = kontrast(karisik, alt)
      return [
        ...(yazi < 4.5 ? [`--foreground / vurgu+${zemin}: ${yazi.toFixed(2)} < 4.5`] : []),
        ...(ayrim < 1.15 ? [`vurgu+${zemin} / ${zemin}: ${ayrim.toFixed(2)} < 1.15`] : []),
      ]
    })
    expect(dusukler).toEqual([])
  })
})

/** components/soru-bankasi/karalama-katmani.tsx → VURGU_SAYDAMLIK ile aynı tutulmalı. */
const VURGU_SAYDAMLIK = 0.38

/** `ust` rengini `saydamlik` ile `alt` üstüne bindirir (sRGB'de alfa karışımı, tuval gibi). */
function karistir(ust: string, alt: string, saydamlik: number): string {
  const kanal = (hex: string, i: number) => parseInt(hex.slice(i, i + 2), 16)
  return (
    '#' +
    [1, 3, 5]
      .map((i) => Math.round(kanal(ust, i) * saydamlik + kanal(alt, i) * (1 - saydamlik)).toString(16).padStart(2, '0'))
      .join('')
  )
}
