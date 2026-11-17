/*
  Soru Bankası şekil verisinin geçerlilik denetimi (saf).

  Hem uygulama testleri hem `scripts/soru-bankasi-aktar.mjs` kullanıyor; betik
  bu dosyayı Node'un tip ayıklamasıyla doğrudan içe aktarıyor. Bu yüzden
  burada çalışma anında içe aktarma yok (yalnız `import type`) ve yalnız
  silinebilir TypeScript sözdizimi var (enum, namespace yok).

  Matematik türlerinin (koordinat, sayı doğrusu, Venn, akış, tablo, katman)
  denetimi bilerek gevşek ve betikteki eski hâliyle aynı: aynı veriyle
  aktarma bugünkü dosyaları üretmeli. Fizik türleri sıkı denetleniyor: o
  veriyi modeller yazıyor ve bozuk şekil soruyu çözülemez kılıyor.
*/
import type { BankaGorseli, DevreKolu } from './tip'

type Ham = Record<string, unknown>

const nesne = (d: unknown): d is Ham => !!d && typeof d === 'object' && !Array.isArray(d)
const sayi = (d: unknown): d is number => typeof d === 'number' && Number.isFinite(d)
const konum = (d: unknown): d is [number, number] => Array.isArray(d) && d.length === 2 && d.every(sayi)
const metinMi = (d: unknown) => d === undefined || typeof d === 'string'
const mantikMi = (d: unknown) => d === undefined || typeof d === 'boolean'

function pencereHatasi(p: unknown): string | null {
  if (!Array.isArray(p) || p.length !== 4 || !p.every(sayi)) return 'pencere dört sayı değil'
  if (!(p[1] > p[0]) || !(p[3] > p[2])) return 'pencerede sol < sağ ve alt < üst değil'
  return null
}

function yazilarHatasi(e: unknown): string | null {
  if (e === undefined) return null
  if (!Array.isArray(e) || !e.every((y) => nesne(y) && konum(y.konum) && typeof y.ad === 'string')) return 'etiketler { konum, ad } değil'
  return null
}

function acilarHatasi(a: unknown): string | null {
  if (a === undefined) return null
  if (!Array.isArray(a) || !a.every((y) => nesne(y) && konum(y.merkez) && sayi(y.bas) && sayi(y.bit) && metinMi(y.ad))) return 'açılar { merkez, bas, bit, ad? } değil'
  return null
}

// ── Devre ────────────────────────────────────────────────────────────────────

export const DEVRE_ELEMANLARI = ['tel', 'direnc', 'pil', 'lamba', 'anahtar', 'ampermetre', 'voltmetre', 'reosta'] as const

const ayniNokta = (a: [number, number], b: [number, number]) => Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6

/** Nokta, kolun iki ucu arasında (uçlar hariç) kolun üstünde mi. */
export function kolunIcinde(p: [number, number], kol: Pick<DevreKolu, 'bas' | 'bit'>): boolean {
  const [ax, ay] = kol.bas
  const [bx, by] = kol.bit
  const vx = bx - ax
  const vy = by - ay
  const boy2 = vx * vx + vy * vy
  if (boy2 === 0) return false
  const capraz = (p[0] - ax) * vy - (p[1] - ay) * vx
  if (Math.abs(capraz) / Math.sqrt(boy2) > 1e-6) return false
  const t = ((p[0] - ax) * vx + (p[1] - ay) * vy) / boy2
  return t > 1e-6 && t < 1 - 1e-6
}

/** İki kol aynı doğru üstünde üst üste biniyor mu (bir noktadan fazla ortak). */
export function kollarBinisiyor(a: Pick<DevreKolu, 'bas' | 'bit'>, b: Pick<DevreKolu, 'bas' | 'bit'>): boolean {
  const ayniKol = (ayniNokta(a.bas, b.bas) && ayniNokta(a.bit, b.bit)) || (ayniNokta(a.bas, b.bit) && ayniNokta(a.bit, b.bas))
  if (ayniKol) return true
  return kolunIcinde(b.bas, a) || kolunIcinde(b.bit, a) || kolunIcinde(a.bas, b) || kolunIcinde(a.bit, b)
    ? // Uç içeride ama doğrultu farklıysa bu bir T birleşimi, binişme değil.
      Math.abs((a.bit[0] - a.bas[0]) * (b.bit[1] - b.bas[1]) - (a.bit[1] - a.bas[1]) * (b.bit[0] - b.bas[0])) < 1e-6
    : false
}

function devreHatasi(g: Ham): string | null {
  const kollar = g.kollar
  if (!Array.isArray(kollar) || kollar.length === 0) return 'kollar boş'
  if (kollar.length > 40) return 'kırktan çok kol'
  for (const [i, k] of kollar.entries()) {
    const ad = `kol ${i + 1}`
    if (!nesne(k)) return `${ad} nesne değil`
    if (!konum(k.bas) || !konum(k.bit)) return `${ad}: bas/bit [x, y] değil`
    if (ayniNokta(k.bas, k.bit)) return `${ad}: bas ile bit aynı nokta`
    if (!DEVRE_ELEMANLARI.includes(k.eleman as (typeof DEVRE_ELEMANLARI)[number])) return `${ad}: bilinmeyen eleman "${String(k.eleman)}"`
    if (!metinMi(k.ad) || !metinMi(k.deger) || !metinMi(k.icDirenc)) return `${ad}: ad/değer/iç direnç metin değil`
    if (k.arti !== undefined && k.arti !== 'bas' && k.arti !== 'bit') return `${ad}: arti "bas" ya da "bit" olmalı`
    if (!mantikMi(k.kapali)) return `${ad}: kapali true/false değil`
    if (k.akim !== undefined && !(nesne(k.akim) && (k.akim.yon === 'ileri' || k.akim.yon === 'geri') && metinMi(k.akim.ad))) return `${ad}: akim { yon: ileri|geri, ad? } değil`
  }
  const tumu = kollar as DevreKolu[]
  const xs = tumu.flatMap((k) => [k.bas[0], k.bit[0]])
  const ys = tumu.flatMap((k) => [k.bas[1], k.bit[1]])
  if (Math.max(...xs) - Math.min(...xs) > 12 || Math.max(...ys) - Math.min(...ys) > 12) return 'devre 12 birimden geniş'
  for (let i = 0; i < tumu.length; i++) {
    for (let j = i + 1; j < tumu.length; j++) {
      if (kollarBinisiyor(tumu[i], tumu[j])) return `kol ${i + 1} ile kol ${j + 1} üst üste biniyor`
    }
  }
  // Elemanlı kolun ortasından kol ayrılırsa eleman birleşimin üstüne çizilir.
  for (const [i, k] of tumu.entries()) {
    if (k.eleman === 'tel') continue
    const ortada = tumu.find((o) => o !== k && (kolunIcinde(o.bas, k) || kolunIcinde(o.bit, k)))
    if (ortada) return `kol ${i + 1} (${k.eleman}) ortasından başka kol ayrılıyor; kolu ikiye böl`
  }
  if (g.dugumler !== undefined && (!Array.isArray(g.dugumler) || !g.dugumler.every((d) => nesne(d) && konum(d.konum) && metinMi(d.ad)))) return 'düğümler { konum, ad? } değil'
  return null
}

// ── Optik ────────────────────────────────────────────────────────────────────

function optikHatasi(g: Ham): string | null {
  const p = pencereHatasi(g.pencere)
  if (p) return p
  if (!Array.isArray(g.araclar)) return 'araclar dizi değil'
  for (const [i, a] of g.araclar.entries()) {
    const ad = `araç ${i + 1}`
    if (!nesne(a)) return `${ad} nesne değil`
    switch (a.tur) {
      case 'duzlemAyna':
        if (!konum(a.bas) || !konum(a.bit) || ayniNokta(a.bas, a.bit)) return `${ad}: düzlem ayna bas/bit geçersiz`
        break
      case 'cukurAyna':
      case 'tumsekAyna':
      case 'inceMercek':
      case 'kalinMercek':
        if (!konum(a.merkez)) return `${ad}: merkez [x, y] değil`
        if (!sayi(a.boy) || a.boy <= 0) return `${ad}: boy pozitif değil`
        if (!sayi(a.odak) || a.odak <= 0) return `${ad}: odak pozitif değil`
        if (a.yon !== undefined && a.yon !== 'sol' && a.yon !== 'sag') return `${ad}: yon "sol" ya da "sag" olmalı`
        break
      case 'prizma':
        if (!Array.isArray(a.koseler) || a.koseler.length !== 3 || !a.koseler.every(konum)) return `${ad}: prizmanın üç köşesi yok`
        break
      case 'sinir':
        if (!konum(a.bas) || !konum(a.bit) || ayniNokta(a.bas, a.bit)) return `${ad}: sınır bas/bit geçersiz`
        if (a.normal !== undefined && !konum(a.normal)) return `${ad}: normal [x, y] değil`
        if (a.dolgu !== undefined && !['sag', 'sol', 'yok'].includes(a.dolgu as string)) return `${ad}: dolgu sag/sol/yok değil`
        break
      case 'cisim':
      case 'goruntu':
        if (!konum(a.bas) || !konum(a.bit) || ayniNokta(a.bas, a.bit)) return `${ad}: ${a.tur} bas/bit geçersiz`
        if (!metinMi(a.ad) || !mantikMi(a.sanal)) return `${ad}: ad/sanal geçersiz`
        break
      case 'kaynak':
      case 'goz':
        if (!konum(a.konum)) return `${ad}: konum [x, y] değil`
        if (a.aci !== undefined && !sayi(a.aci)) return `${ad}: açı sayı değil`
        break
      default:
        return `${ad}: bilinmeyen tür "${String(a.tur)}"`
    }
  }
  if (g.isinlar !== undefined && (!Array.isArray(g.isinlar) || !g.isinlar.every((s) => nesne(s) && Array.isArray(s.noktalar) && s.noktalar.length >= 2 && s.noktalar.every(konum) && mantikMi(s.kesik)))) return 'ışınlar en az iki noktalı yol değil'
  if (!g.araclar.length && !(Array.isArray(g.isinlar) && g.isinlar.length)) return 'çizilecek araç ya da ışın yok'
  return acilarHatasi(g.acilar) ?? yazilarHatasi(g.etiketler)
}

// ── Düzenek ──────────────────────────────────────────────────────────────────

function duzenekHatasi(g: Ham): string | null {
  const p = pencereHatasi(g.pencere)
  if (p) return p
  if (!Array.isArray(g.parcalar) || g.parcalar.length === 0) return 'parcalar boş'
  for (const [i, a] of g.parcalar.entries()) {
    const ad = `parça ${i + 1}`
    if (!nesne(a)) return `${ad} nesne değil`
    if (!metinMi(a.ad)) return `${ad}: ad metin değil`
    switch (a.tur) {
      case 'zemin':
      case 'ip':
      case 'kap':
      case 'sivi': {
        const enAz = a.tur === 'sivi' ? 3 : 2
        if (!Array.isArray(a.noktalar) || a.noktalar.length < enAz || !a.noktalar.every(konum)) return `${ad}: ${a.tur} için en az ${enAz} nokta yok`
        break
      }
      case 'blok':
        if (!konum(a.merkez) || !sayi(a.en) || !sayi(a.boy) || a.en <= 0 || a.boy <= 0) return `${ad}: blok merkez/en/boy geçersiz`
        if (a.aci !== undefined && !sayi(a.aci)) return `${ad}: açı sayı değil`
        break
      case 'makara':
        if (!konum(a.merkez) || !sayi(a.yaricap) || a.yaricap <= 0) return `${ad}: makara merkez/yarıçap geçersiz`
        break
      case 'ok':
        if (!konum(a.bas) || !konum(a.bit) || ayniNokta(a.bas, a.bit)) return `${ad}: ok bas/bit geçersiz`
        break
      default:
        return `${ad}: bilinmeyen tür "${String(a.tur)}"`
    }
  }
  return acilarHatasi(g.acilar) ?? yazilarHatasi(g.etiketler)
}

// ── Hepsi ────────────────────────────────────────────────────────────────────

/** Eski betikteki denetimler; matematik verisinin aktarımı bunlarla aynı kalmalı. */
const MATEMATIK: Record<string, (g: Ham) => boolean> = {
  koordinat: (g) => Array.isArray(g.pencere) && g.pencere.length === 4 && g.pencere.every(Number.isFinite),
  sayiDogrusu: (g) => Array.isArray(g.aralik) && g.aralik.length === 2 && g.aralik.every(Number.isFinite),
  venn: (g) => typeof g.sol === 'string' && typeof g.sag === 'string',
  akis: (g) => Array.isArray(g.adimlar) && g.adimlar.every((a) => !!a && typeof (a as Ham).ad === 'string'),
  tablo: (g) => Array.isArray(g.basliklar) && Array.isArray(g.satirlar) && g.basliklar.every((a) => typeof a === 'string') && g.satirlar.every((s) => Array.isArray(s) && s.length === (g.basliklar as unknown[]).length && s.every((a) => typeof a === 'string')),
  katman: (g) => Array.isArray(g.katmanlar) && g.katmanlar.every((a) => !!a && typeof (a as Ham).ad === 'string'),
}

const FIZIK: Record<string, (g: Ham) => string | null> = { devre: devreHatasi, optik: optikHatasi, duzenek: duzenekHatasi }

export const BANKA_GORSEL_TURLERI = [...Object.keys(MATEMATIK), ...Object.keys(FIZIK)]

/** Şeklin ilk kusuru (Türkçe, kısa) ya da geçerliyse `null`. */
export function gorselHatasi(g: unknown): string | null {
  if (!nesne(g)) return 'görsel nesne değil'
  const tur = String(g.tur)
  if (MATEMATIK[tur]) return MATEMATIK[tur](g) ? null : `${tur} biçimi geçersiz`
  if (FIZIK[tur]) return FIZIK[tur](g)
  return `bilinmeyen görsel türü "${tur}"`
}

export function gorselGecerliMi(g: unknown): g is BankaGorseli {
  return gorselHatasi(g) === null
}
