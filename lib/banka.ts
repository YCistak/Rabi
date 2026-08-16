import type { YanlisSoru } from './types'
import { sadelestir } from './dersler'

/**
 * Yanlış soru bankasının saf mantığı — süzme, gruplama, sayım.
 * Ekrandan ayrı tutuluyor ki test edilebilsin.
 */

export type BankaSekmesi = 'bekleyen' | 'cozulen'

export type DersSayisi = { ders: string; sayi: number }

export type BankaOzeti = {
  toplam: number
  bekleyen: number
  cozulen: number
}

export function bankaOzeti(sorular: YanlisSoru[]): BankaOzeti {
  const cozulen = sorular.filter((s) => s.cozuldu).length
  return { toplam: sorular.length, bekleyen: sorular.length - cozulen, cozulen }
}

/**
 * Sekmedeki soruların ders dağılımı, çoktan aza sıralı.
 *
 * Gruplama `sadelestir` ile yapılıyor: kullanıcı bir kez "Matematik", bir kez
 * "matematik" yazarsa bunlar iki ayrı sekme olmamalı. Görünen ad olarak o
 * derste ilk karşılaşılan yazım kullanılır.
 */
export function derslereGore(sorular: YanlisSoru[]): DersSayisi[] {
  const sayac = new Map<string, DersSayisi>()

  for (const soru of sorular) {
    const anahtar = sadelestir(soru.ders)
    const mevcut = sayac.get(anahtar)
    if (mevcut) mevcut.sayi += 1
    else sayac.set(anahtar, { ders: soru.ders, sayi: 1 })
  }

  return [...sayac.values()].sort(
    (a, b) => b.sayi - a.sayi || a.ders.localeCompare(b.ders, 'tr'),
  )
}

/**
 * Sekme ve ders süzgecini uygular, en yeniden eskiye sıralar.
 * `ders` boşsa ders süzgeci uygulanmaz ("Tümü").
 */
export function bankaSuz(
  sorular: YanlisSoru[],
  { sekme, ders = '' }: { sekme: BankaSekmesi; ders?: string },
): YanlisSoru[] {
  const aranan = sadelestir(ders)

  return sorular
    .filter((s) => (sekme === 'cozulen' ? s.cozuldu : !s.cozuldu))
    .filter((s) => aranan === '' || sadelestir(s.ders) === aranan)
    .sort((a, b) => b.tarih.localeCompare(a.tarih) || b.id.localeCompare(a.id))
}

/**
 * Seçili ders artık listede yoksa süzgeci "Tümü"ne düşürür.
 *
 * Bir dersin son sorusu çözüldü işaretlendiğinde o ders sekmesi kaybolur;
 * süzgeç eski değerde kalsaydı ekran boş görünür, kullanıcı da soruların
 * silindiğini sanırdı.
 */
export function gecerliDers(secili: string, dersler: DersSayisi[]): string {
  if (secili === '') return ''
  const aranan = sadelestir(secili)
  return dersler.some((d) => sadelestir(d.ders) === aranan) ? secili : ''
}
