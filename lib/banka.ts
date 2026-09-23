import type { YanlisSoru } from './types'
import { sadelestir } from './dersler'
import { tariheCevir } from './utils'

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

/**
 * Bankadaki derslerin renk ailesi — `globals.css`teki `--konu-<ad>-*`
 * değişkenleri. Ders adı serbest metin olduğu için sadeleştirilip eşleniyor;
 * ailesi olmayan ders (Felsefe, İngilizce…) `null` alır ve nötr çizilir.
 * Geometri Matematik'in, Edebiyat Türkçe'nin rengini taşıyor: ikisi de
 * sınavda o testin içinde.
 */
export type BankaRengi =
  | 'matematik'
  | 'turkce'
  | 'fizik'
  | 'kimya'
  | 'biyoloji'
  | 'tarih'
  | 'cografya'

const DERS_RENGI: Record<string, BankaRengi> = {
  matematik: 'matematik',
  geometri: 'matematik',
  'türkçe': 'turkce',
  edebiyat: 'turkce',
  fizik: 'fizik',
  kimya: 'kimya',
  biyoloji: 'biyoloji',
  tarih: 'tarih',
  'coğrafya': 'cografya',
}

export function dersRengi(ders: string): BankaRengi | null {
  return DERS_RENGI[sadelestir(ders)] ?? null
}

/** Bir haftadan uzun bekleyen soru kartta kırmızı rozetle çiziliyor. */
export const ESKI_SORU_GUNU = 7

/** Sorunun eklendiği günden bugüne kaç gün geçti; gelecek tarih 0 sayılır. */
export function bekledigiGun(tarih: string, bugunIso: string): number {
  const fark = Math.round((tariheCevir(bugunIso).getTime() - tariheCevir(tarih).getTime()) / 86_400_000)
  return Math.max(0, fark)
}

export function yasEtiketi(gun: number): string {
  if (gun <= 0) return 'bugün'
  if (gun === 1) return 'dün'
  return `${gun} gün`
}

export type TarihGrubu = { baslik: string; sorular: YanlisSoru[] }

/**
 * "Bu hafta / Daha önce" başlıkları. Sınır kırmızı rozetin sınırıyla aynı
 * (`ESKI_SORU_GUNU`): "Bu hafta" başlığının altında "eski" diye kırmızıya
 * boyanmış bir kart çelişki olurdu. Boş grup başlığı çizilmiyor.
 */
export function tarihGruplari(sorular: YanlisSoru[], bugunIso: string): TarihGrubu[] {
  const hafta: YanlisSoru[] = []
  const once: YanlisSoru[] = []
  for (const soru of sorular) {
    ;(bekledigiGun(soru.tarih, bugunIso) < ESKI_SORU_GUNU ? hafta : once).push(soru)
  }
  const gruplar: TarihGrubu[] = []
  if (hafta.length > 0) gruplar.push({ baslik: 'Bu hafta', sorular: hafta })
  if (once.length > 0) gruplar.push({ baslik: 'Daha önce', sorular: once })
  return gruplar
}
