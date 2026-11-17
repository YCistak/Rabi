/**
 * Yarım bırakılan testin kaydı (`rabi-soru-bankasi-oturumlar`) — saf hesap.
 *
 * Öğrenci testten çıkıp dönünce kaldığı yerden sürer: seçtiği şıklar,
 * elediği şıklar, şüpheli/pas işaretleri, soru başına süre ve en son baktığı
 * soru. Kalıcı `rabi-soru-bankasi` kaydı yalnız d/y tuttuğu için (hangi şık
 * seçildi bilinmez) bu ayrı, küçük bir kayıttır; çizimler burada değil
 * IndexedDB'de (`cizim-depo.ts`) — localStorage'a görüntü/çizgi yığını
 * yazılmaz. Test bitince kayıt silinir. Yanlışları tekrar oturumu kaydedilmez.
 */
import type { CalismaModu } from './tip'

export type OturumGorunumu = 'sayfa' | 'soru'

export type OturumKaydi = {
  mod: CalismaModu
  /** En son bakılan soru (test içi sıra). */
  sira: number
  gorunum: OturumGorunumu
  /** Soru sırası → seçilen şık (0–4). */
  secimler: Record<number, number>
  /** Soru sırası → elenen şıklar. */
  elenenler: Record<number, number[]>
  /** "Sonra bak / şüpheli" işaretli sorular. */
  supheliler: number[]
  /** Pas geçilen sorular (cevaplanınca pas sayılmaz). */
  paslar: number[]
  /** Soru başına milisaniye. */
  sureler: number[]
  /** Son yazım (ms, Date.now) — en eski kayıtlar budanır. */
  zaman: number
}

/** Anahtar: `${konu}#${test numarası (1'den)}`. */
export type OturumKayitlari = Record<string, OturumKaydi>

/** Bu kadardan fazla yarım test birikirse en eskisi düşer (kayıt küçük kalsın). */
export const OTURUM_EN_COK = 40

export function oturumAnahtari(konu: string, test: number): string {
  return `${konu}#${test + 1}`
}

function tamSayiMi(deger: unknown, enCok = Infinity): deger is number {
  return typeof deger === 'number' && Number.isInteger(deger) && deger >= 0 && deger <= enCok
}

function siraListesi(ham: unknown): number[] {
  if (!Array.isArray(ham)) return []
  return [...new Set(ham.filter((deger) => tamSayiMi(deger, 999)))].sort((a, b) => a - b)
}

function oturumCoz(ham: unknown): OturumKaydi | null {
  if (typeof ham !== 'object' || ham === null || Array.isArray(ham)) return null
  const k = ham as Record<string, unknown>
  if (k.mod !== 'alistirma' && k.mod !== 'deneme') return null
  const secimler: Record<number, number> = {}
  if (typeof k.secimler === 'object' && k.secimler !== null) {
    for (const [sira, sik] of Object.entries(k.secimler)) {
      if (/^\d{1,3}$/.test(sira) && tamSayiMi(sik, 4)) secimler[Number(sira)] = sik
    }
  }
  const elenenler: Record<number, number[]> = {}
  if (typeof k.elenenler === 'object' && k.elenenler !== null) {
    for (const [sira, liste] of Object.entries(k.elenenler)) {
      const temiz = siraListesi(liste).filter((sik) => sik <= 4)
      if (/^\d{1,3}$/.test(sira) && temiz.length > 0) elenenler[Number(sira)] = temiz
    }
  }
  const sureler = Array.isArray(k.sureler)
    ? k.sureler.map((sure) => (typeof sure === 'number' && Number.isFinite(sure) && sure > 0 ? Math.round(sure) : 0))
    : []
  return {
    mod: k.mod,
    sira: tamSayiMi(k.sira, 999) ? k.sira : 0,
    gorunum: k.gorunum === 'soru' ? 'soru' : 'sayfa',
    secimler,
    elenenler,
    supheliler: siraListesi(k.supheliler),
    paslar: siraListesi(k.paslar),
    sureler,
    zaman: typeof k.zaman === 'number' && Number.isFinite(k.zaman) ? k.zaman : 0,
  }
}

/** Okurken bozuk kayıt ve alan atılır. */
export function oturumlariCoz(ham: unknown): OturumKayitlari {
  if (typeof ham !== 'object' || ham === null || Array.isArray(ham)) return {}
  const temiz: OturumKayitlari = {}
  for (const [anahtar, deger] of Object.entries(ham)) {
    if (!/^[^#]+#[1-9]\d*$/.test(anahtar)) continue
    const kayit = oturumCoz(deger)
    if (kayit) temiz[anahtar] = kayit
  }
  return temiz
}

/** Kaydı yazar; sınır aşılırsa en eski kayıtlar düşer. */
export function oturumYaz(kayitlar: OturumKayitlari, anahtar: string, kayit: OturumKaydi): OturumKayitlari {
  const yeni = { ...kayitlar, [anahtar]: kayit }
  const anahtarlar = Object.keys(yeni)
  if (anahtarlar.length <= OTURUM_EN_COK) return yeni
  const atilacak = anahtarlar
    .filter((a) => a !== anahtar)
    .sort((a, b) => yeni[a].zaman - yeni[b].zaman)
    .slice(0, anahtarlar.length - OTURUM_EN_COK)
  for (const a of atilacak) delete yeni[a]
  return yeni
}

export function oturumSil(kayitlar: OturumKayitlari, anahtar: string): OturumKayitlari {
  if (!(anahtar in kayitlar)) return kayitlar
  const yeni = { ...kayitlar }
  delete yeni[anahtar]
  return yeni
}

/**
 * Kayıt, soru sayısı değişmiş (veri güncellenmiş) teste uyarlanır: sınır
 * dışındaki sıralar atılır.
 */
export function oturumUyarla(kayit: OturumKaydi, soruSayisi: number): OturumKaydi {
  const icinde = (sira: number) => sira < soruSayisi
  const suz = <T>(nesne: Record<number, T>) =>
    Object.fromEntries(Object.entries(nesne).filter(([sira]) => icinde(Number(sira)))) as Record<number, T>
  return {
    ...kayit,
    sira: Math.min(kayit.sira, Math.max(0, soruSayisi - 1)),
    secimler: suz(kayit.secimler),
    elenenler: suz(kayit.elenenler),
    supheliler: kayit.supheliler.filter(icinde),
    paslar: kayit.paslar.filter(icinde),
    sureler: kayit.sureler.slice(0, soruSayisi),
  }
}

export type KonuOturumu = { test: number; kayit: OturumKaydi }

/** Konudaki yarım testlerden en son çalışılanı ("Kaldığın yerden devam et"). */
export function sonOturum(kayitlar: OturumKayitlari, konu: string): KonuOturumu | null {
  let son: KonuOturumu | null = null
  for (const [anahtar, kayit] of Object.entries(kayitlar)) {
    const ayrim = anahtar.lastIndexOf('#')
    if (anahtar.slice(0, ayrim) !== konu) continue
    if (!son || kayit.zaman > son.kayit.zaman) son = { test: Number(anahtar.slice(ayrim + 1)) - 1, kayit }
  }
  return son
}
