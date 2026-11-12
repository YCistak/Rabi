import type { KoordinatGorseli } from '../konu/tip'
import { kesirParcala } from '../kesir'
import { simgeleriParcala } from './metin'

/**
 * Soru Bankası şekillerinin yerleşim hesabı (saf; React'e bağlı değil).
 *
 * Sorulardaki `koordinat` görselleri soru üreten modellerce yazıldı: köşe
 * harfleri ve uzunluklar `etiketler` içinde, koordinatları özensiz (köşenin
 * üstünde, kenarın üstünde, birbirinin üstünde), açı yayı ve dik açı işareti
 * hiç yok. Veri değişmiyor; çizen akıllanıyor: harfleri köşeye bağlayıp
 * şeklin dışına itiyor, uzunluğu ait olduğu parçanın ortasına koyuyor, açıyı
 * yayla, dik açıyı kareyle gösteriyor ve çakışan yazıları ayırıyor.
 *
 * Bütün ölçüler viewBox birimi. Şekil soru sütununun genişliğinde (~340 px)
 * gösterildiği için bir birim aşağı yukarı bir piksel: yazı boyları gerçek
 * piksel gibi düşünülebiliyor.
 */

export const SEKIL_GENISLIGI = 340
const YUK_SINIRI = 300
const KENAR = 6

export const YAZI_BOYU = { harf: 15, uzunluk: 14, aci: 13.5, serbest: 13.5, sayi: 12 }

// ── Temel geometri ───────────────────────────────────────────────────────────

export type Nokta = { x: number; y: number }
export type Parca = { a: Nokta; b: Nokta }

const fark = (a: Nokta, b: Nokta): Nokta => ({ x: a.x - b.x, y: a.y - b.y })
const uzunluk = (v: Nokta) => Math.hypot(v.x, v.y)
const uzaklik = (a: Nokta, b: Nokta) => Math.hypot(a.x - b.x, a.y - b.y)
const ayni = (a: Nokta, b: Nokta, pay = 1.5) => uzaklik(a, b) <= pay
const yon = (aci: number): Nokta => ({ x: Math.cos(aci), y: Math.sin(aci) })
const ikiPi = Math.PI * 2
/** Açıyı [0, 2π) aralığına çeker. */
const aciDuzelt = (a: number) => ((a % ikiPi) + ikiPi) % ikiPi
const sinirla = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const yuvarla = (v: number) => Math.round(v * 100) / 100

/** Noktanın doğru parçasına uzaklığı ve izdüşümünün parça üstündeki yeri (0–1). */
export function parcayaUzaklik(p: Nokta, s: Parca): { d: number; t: number } {
  const v = fark(s.b, s.a)
  const boy2 = v.x * v.x + v.y * v.y
  if (boy2 === 0) return { d: uzaklik(p, s.a), t: 0 }
  const t = ((p.x - s.a.x) * v.x + (p.y - s.a.y) * v.y) / boy2
  const tt = sinirla(t, 0, 1)
  return { d: uzaklik(p, { x: s.a.x + v.x * tt, y: s.a.y + v.y * tt }), t }
}

/** Merkezli kutunun (yazı) bir yöndeki yarı kalınlığı: kutuyu o yönde ne kadar itmek gerekir. */
export function kutuDestek(gen: number, yuk: number, y: Nokta) {
  return (Math.abs(y.x) * gen) / 2 + (Math.abs(y.y) * yuk) / 2
}

/** Merkezli kutu ile doğru parçası kesişiyor mu (ayırıcı eksen sınaması). */
export function kutuParcaKesisir(k: Kutu, s: Parca, pay = 0): boolean {
  const yg = k.gen / 2 + pay
  const yy = k.yuk / 2 + pay
  if (Math.max(s.a.x, s.b.x) < k.x - yg || Math.min(s.a.x, s.b.x) > k.x + yg) return false
  if (Math.max(s.a.y, s.b.y) < k.y - yy || Math.min(s.a.y, s.b.y) > k.y + yy) return false
  const v = fark(s.b, s.a)
  const boy = uzunluk(v)
  if (boy === 0) return true
  const n = { x: -v.y / boy, y: v.x / boy }
  const d = (k.x - s.a.x) * n.x + (k.y - s.a.y) * n.y
  return Math.abs(d) <= Math.abs(n.x) * yg + Math.abs(n.y) * yy
}

export type Kutu = { x: number; y: number; gen: number; yuk: number }

// ── Yazı ölçüsü ──────────────────────────────────────────────────────────────

/*
  SVG'de yazı ölçülemiyor (sunucuda DOM yok, istemcide ölçmek ikinci bir
  çizim turu demek). Nunito yarı kalın için karakter genişlikleri em cinsinden
  yaklaşık bir tablo; çakışma çözümü için birkaç piksellik hata önemsiz.
*/
function karakterGenisligi(k: string): number {
  if (/[0-9]/.test(k)) return 0.58
  if (" .,:;'′|!iIlj".includes(k)) return k === ' ' ? 0.26 : 0.27
  if ('()[]{}ftr'.includes(k)) return 0.36
  if ('mwMW%'.includes(k)) return 0.86
  if ('°'.includes(k)) return 0.4
  if ('√π−+=±<>×·÷'.includes(k)) return 0.6
  if (/[A-ZÇĞİÖŞÜ]/.test(k)) return 0.68
  if (/[a-zçğıöşü]/.test(k)) return 0.53
  if (/[α-ω]/.test(k)) return 0.58
  return 0.62
}

const metinGenisligi = (metin: string, boy: number) =>
  [...metin].reduce((t, k) => t + karakterGenisligi(k), 0) * boy

export type YaziParcasi =
  | { tur: 'duz' | 'ust' | 'alt'; metin: string; x: number; gen: number }
  | { tur: 'kesir'; pay: string; payda: string; x: number; gen: number }

export type YaziDuzeni = {
  metin: string
  boy: number
  gen: number
  yuk: number
  kesirli: boolean
  parcalar: YaziParcasi[]
}

/**
 * Kesir parçaları, ama yalnız içinde sayı/kök/π olanlar.
 *
 * `kesirParcala` "TL/m", "kg/m", "N/m" gibi birimleri de kesir sanıyor ve
 * tablo başlığında "TL bölü m" üst üste çiziliyordu. Birimde rakam yok;
 * matematik kesrinde (12/x, π/2, 3/5) hemen her zaman var.
 */
export function kesirParcalariSec(metin: string): ReturnType<typeof kesirParcala> {
  const cikti: ReturnType<typeof kesirParcala> = []
  for (const k of kesirParcala(metin)) {
    const parca = k.tur === 'kesir' && !/[0-9√π]/.test(k.pay + k.payda) ? { tur: 'metin' as const, metin: `${k.pay}/${k.payda}` } : k
    const son = cikti[cikti.length - 1]
    if (parca.tur === 'metin' && son?.tur === 'metin') son.metin += parca.metin
    else cikti.push(parca.tur === 'metin' ? { ...parca } : parca)
  }
  return cikti
}

/** Üst/alt simgeli ve kesirli yazının parçalarını ve kaba ölçüsünü çıkarır. */
export function yaziDuzeni(metin: string, boy: number): YaziDuzeni {
  const parcalar: YaziParcasi[] = []
  let x = 0
  let ust = false
  let alt = false
  let kesirli = false
  for (const p of simgeleriParcala(metin)) {
    if (p.tur === 'ust' || p.tur === 'alt') {
      const gen = metinGenisligi(p.metin, boy * 0.72)
      parcalar.push({ tur: p.tur, metin: p.metin, x, gen })
      x += gen
      if (p.tur === 'ust') ust = true
      else alt = true
      continue
    }
    for (const k of kesirParcalariSec(p.metin)) {
      if (k.tur === 'metin') {
        if (!k.metin) continue
        const gen = metinGenisligi(k.metin, boy)
        parcalar.push({ tur: 'duz', metin: k.metin, x, gen })
        x += gen
      } else {
        const ic = Math.max(metinGenisligi(k.pay, boy * 0.82), metinGenisligi(k.payda, boy * 0.82))
        const gen = ic + boy * 0.3
        parcalar.push({ tur: 'kesir', pay: k.pay, payda: k.payda, x, gen })
        x += gen
        kesirli = true
      }
    }
  }
  let yuk = boy * 0.95
  if (kesirli) yuk = boy * 2.05
  else {
    if (ust) yuk += boy * 0.28
    if (alt) yuk += boy * 0.22
  }
  return { metin, boy, gen: Math.max(x, boy * 0.4), yuk, kesirli, parcalar }
}

// ── Sahne ────────────────────────────────────────────────────────────────────

/** Çizgi ve yazı rengi: koyu nötr (`currentColor`), mavi vurgu, soluk yardımcı. */
export type CizgiRengi = 'on' | 'mavi' | 'soluk'

export type SahneYolu = {
  d: string
  renk: CizgiRengi
  kalinlik: number
  kesik?: boolean
  dolgu?: 'hafif' | 'mavi' | 'tarali'
}

export type SahneEtiketi = { x: number; y: number; duzen: YaziDuzeni; renk: CizgiRengi; kalin?: boolean }

export type Sahne = {
  viewBox: [number, number, number, number]
  /** Grafik penceresi: eğriler buna kırpılır. */
  kirpma?: { x: number; y: number; gen: number; yuk: number }
  izgara?: string
  eksen?: string
  eksenOklari?: string
  centikler?: string
  yollar: SahneYolu[]
  okUclari: { d: string; renk: CizgiRengi }[]
  cemberler: { x: number; y: number; r: number; renk: CizgiRengi; dolu: boolean }[]
  yaylar?: string
  dikAcilar?: string
  esCentikleri?: string
  noktalar: { x: number; y: number; bos: boolean; renk: CizgiRengi }[]
  etiketler: SahneEtiketi[]
  aciklama: string
}

// ── Yön hesapları ────────────────────────────────────────────────────────────

/** Yönleri sıralar ve 0,5°'den yakın olanları birleştirir. */
export function yonleriDuzenle(yonler: number[]): number[] {
  const s = yonler.map(aciDuzelt).sort((a, b) => a - b)
  const cikti: number[] = []
  for (const a of s) {
    if (cikti.length && a - cikti[cikti.length - 1] < 0.009) continue
    cikti.push(a)
  }
  if (cikti.length > 1 && cikti[0] + ikiPi - cikti[cikti.length - 1] < 0.009) cikti.pop()
  return cikti
}

/** Sıralı yönler arasındaki dilimler: [baş, son, genişlik]. */
export function dilimler(yonler: number[]): { bas: number; son: number; aci: number }[] {
  const y = yonleriDuzenle(yonler)
  if (y.length === 0) return []
  if (y.length === 1) return [{ bas: y[0], son: y[0] + ikiPi, aci: ikiPi }]
  return y.map((bas, i) => {
    const son = i + 1 < y.length ? y[i + 1] : y[0] + ikiPi
    return { bas, son, aci: son - bas }
  })
}

/**
 * Köşe harfinin konacağı yön: çizgilerin arasındaki en geniş boşluğun ortası.
 *
 * Üçgenin köşesinde bu, iç açıortayın tam tersi (şeklin dışı); kenarın
 * üstündeki bir noktada (D) kenarın, içeri inen çizgiye karşı yüzü. Birbirine
 * yakın genişlikte iki boşluk varsa (doğru üstündeki nokta) `tercih` yönüne
 * yakın olan seçiliyor: verinin harfi koyduğu taraf ya da şeklin dışı.
 */
export function bosYon(yonler: number[], tercih?: number): number {
  const d = dilimler(yonler)
  if (d.length === 0) return tercih ?? -Math.PI / 4
  const enGenis = Math.max(...d.map((x) => x.aci))
  const adaylar = d.filter((x) => x.aci >= enGenis * 0.8)
  if (tercih === undefined || adaylar.length === 1) {
    const en = adaylar.reduce((a, b) => (b.aci > a.aci ? b : a))
    return aciDuzelt(en.bas + en.aci / 2)
  }
  let sec = adaylar[0]
  let enIyi = -Infinity
  for (const a of adaylar) {
    const orta = a.bas + a.aci / 2
    const puan = Math.cos(orta - tercih) + a.aci / enGenis
    if (puan > enIyi) {
      enIyi = puan
      sec = a
    }
  }
  return aciDuzelt(sec.bas + sec.aci / 2)
}

/** Bir yönü içine alan dilim. */
export function dilimBul(yonler: number[], aci: number) {
  const d = dilimler(yonler)
  const a = aciDuzelt(aci)
  return d.find((x) => (a >= x.bas && a < x.son) || (a + ikiPi >= x.bas && a + ikiPi < x.son))
}

/** Dik açı: dilimin genişliği 90° ± tolerans. */
export function dikMi(aci: number, toleransDerece = 1.5): boolean {
  return Math.abs(aci - Math.PI / 2) <= (toleransDerece * Math.PI) / 180
}

// ── Etiket türleri ───────────────────────────────────────────────────────────

export type EtiketTuru = 'harf' | 'aci' | 'uzunluk' | 'alan' | 'centik' | 'serbest' | 'belirsiz'

const HARF = /^[A-ZÇĞİÖŞÜ](?:['′]|[₀-₉])*(?:\([A-ZÇĞİÖŞÜ](?:['′]|[₀-₉])*\))?$/

/** Etiketin metninden ne olduğunu çıkarır; konumu sonra karar verir (belirsiz). */
export function etiketTuru(ad: string): EtiketTuru {
  const m = ad.trim()
  if (/^\|+$/.test(m)) return 'centik'
  if (HARF.test(m)) return 'harf'
  if (m.includes('°')) return 'aci'
  if (/^[α-ω][₀-₉]*$/.test(m)) return 'aci'
  if (/[²³]/.test(m) || /^S[₀-₉]/.test(m) || /alan/i.test(m)) return 'alan'
  // "|AC| = 24 cm", "Yatay açıklık = 40 cm": adı yazılmış uzunluk, parçasına gider.
  if (m.includes('=') && /[0-9√]/.test(m) && !m.includes('°')) return 'uzunluk'
  const sozcuk = m.replace(/log/g, '').match(/[A-Za-zÇĞİÖŞÜçğıöşü]{3,}/)
  if (sozcuk || m.includes('%') || m.includes('⊥') || m.includes('∥')) return 'serbest'
  // Değişkenli ifade (2x + 10, 3k) açı da olabilir kenar da: konumu karar verir.
  const birimsiz = m.replace(/log/g, '').replace(/(^|[^A-Za-zÇĞİÖŞÜçğıöşü])(cm|dm|mm|km|m|br|birim)(?![A-Za-zÇĞİÖŞÜçğıöşü])/g, '$1')
  if (/[a-zçğıöşü]/.test(birimsiz)) return 'belirsiz'
  if (/[0-9√]/.test(m) || m.startsWith('log')) return 'uzunluk'
  if (m.length <= 10) return 'belirsiz'
  return 'serbest'
}

// ── Çakışma çözümü ───────────────────────────────────────────────────────────

export type YerlesenEtiket = Kutu & {
  /** İstenen merkez: itmeler sonrası yay buraya çekiyor. */
  hx: number
  hy: number
  /** 0 = sabit, 1 = serbest. */
  hareket: number
}

/**
 * Yazıları çizgilerden ve birbirinden ayırır (basit itme döngüsü).
 *
 * Her turda üst üste binen iki yazı az örtüşen eksende ayrılıyor, çizgiye
 * değen yazı çizginin normali boyunca kendi tarafına itiliyor, sonra hafif bir
 * yay yazıyı istenen yerine geri çekiyor. Kusursuz değil ama birkaç düzine
 * yazı ve çizgide birkaç milisaniyede oturuyor.
 */
export function etiketleriAyir(etiketler: YerlesenEtiket[], engeller: Parca[], tur = 140) {
  for (let i = 0; i < tur; i++) {
    let oynadi = false
    for (const e of etiketler) {
      if (e.hareket <= 0) continue
      for (const s of engeller) {
        if (!kutuParcaKesisir(e, s, 2)) continue
        const v = fark(s.b, s.a)
        const boy = uzunluk(v)
        if (boy < 0.5) continue
        const n = { x: -v.y / boy, y: v.x / boy }
        const { t } = parcayaUzaklik(e, s)
        if (t < -0.02 || t > 1.02) {
          // Parçanın ucunda: uçtan uzağa doğru küçük bir adım.
          const uc = t < 0 ? s.a : s.b
          const u = fark(e, uc)
          const ub = uzunluk(u) || 1
          e.x += (u.x / ub) * 1.5 * e.hareket
          e.y += (u.y / ub) * 1.5 * e.hareket
          oynadi = true
          continue
        }
        let d = (e.x - s.a.x) * n.x + (e.y - s.a.y) * n.y
        if (Math.abs(d) < 0.01) d = (e.hx - s.a.x) * n.x + (e.hy - s.a.y) * n.y || 1
        const gerek = kutuDestek(e.gen, e.yuk, n) + 2.5
        if (Math.abs(d) < gerek) {
          const it = (gerek - Math.abs(d)) * Math.sign(d) * 0.6 * e.hareket
          e.x += n.x * it
          e.y += n.y * it
          oynadi = true
        }
      }
    }
    for (let a = 0; a < etiketler.length; a++) {
      for (let b = a + 1; b < etiketler.length; b++) {
        const p = etiketler[a]
        const q = etiketler[b]
        const ox = (p.gen + q.gen) / 2 + 6 - Math.abs(p.x - q.x)
        const oy = (p.yuk + q.yuk) / 2 + 2 - Math.abs(p.y - q.y)
        if (ox <= 0 || oy <= 0) continue
        const toplam = p.hareket + q.hareket
        if (toplam <= 0) continue
        const pa = p.hareket / toplam
        const qa = q.hareket / toplam
        if (ox < oy * 1.4) {
          const s = p.x < q.x || (p.x === q.x && a < b) ? -1 : 1
          p.x += s * ox * pa * 0.6
          q.x -= s * ox * qa * 0.6
        } else {
          const s = p.y < q.y || (p.y === q.y && a < b) ? -1 : 1
          p.y += s * oy * pa * 0.6
          q.y -= s * oy * qa * 0.6
        }
        oynadi = true
      }
    }
    // Son turlarda yay yok: yay her turda yazıyı biraz geri, çizginin üstüne çekiyordu.
    if (i < tur * 0.65) {
      for (const e of etiketler) {
        e.x += (e.hx - e.x) * 0.04 * e.hareket
        e.y += (e.hy - e.y) * 0.04 * e.hareket
      }
    }
    if (!oynadi && i > 4) break
  }
}

/** Etiketler arası ya da etiket–çizgi çakışması kaldı mı (test ve galeri için). */
export function cakismaSay(etiketler: Kutu[], engeller: Parca[] = []): number {
  let n = 0
  for (let a = 0; a < etiketler.length; a++) {
    for (let b = a + 1; b < etiketler.length; b++) {
      const p = etiketler[a]
      const q = etiketler[b]
      if ((p.gen + q.gen) / 2 - Math.abs(p.x - q.x) > 0.5 && (p.yuk + q.yuk) / 2 - Math.abs(p.y - q.y) > 0.5) n++
    }
    for (const s of engeller) if (kutuParcaKesisir(etiketler[a], s, -0.5)) n++
  }
  return n
}

// ── Yol yardımcıları ─────────────────────────────────────────────────────────

const yaz = (p: Nokta) => `${yuvarla(p.x)} ${yuvarla(p.y)}`

function kirikYol(n: Nokta[], kapali: boolean) {
  return `M ${n.map(yaz).join(' L ')}${kapali ? ' Z' : ''}`
}

/**
 * Nokta listesinden yumuşak yol (Catmull-Rom → kübik Bézier) ve çakışma
 * sınaması için örneklenmiş kırık çizgi.
 */
function yumusakYol(n: Nokta[], kapali: boolean): { d: string; ornek: Nokta[] } {
  if (n.length < 3) return { d: kirikYol(n, kapali), ornek: n }
  const p = kapali ? [n[n.length - 1], ...n, n[0], n[1]] : [n[0], ...n, n[n.length - 1]]
  let d = `M ${yaz(p[1])}`
  const ornek: Nokta[] = [p[1]]
  for (let i = 1; i < p.length - 2; i++) {
    const [a, b, c, e] = [p[i - 1], p[i], p[i + 1], p[i + 2]]
    const k1 = { x: b.x + (c.x - a.x) / 6, y: b.y + (c.y - a.y) / 6 }
    const k2 = { x: c.x - (e.x - b.x) / 6, y: c.y - (e.y - b.y) / 6 }
    d += ` C ${yaz(k1)}, ${yaz(k2)}, ${yaz(c)}`
    for (let s = 1; s <= 6; s++) {
      const t = s / 6
      const u = 1 - t
      ornek.push({
        x: u * u * u * b.x + 3 * u * u * t * k1.x + 3 * u * t * t * k2.x + t * t * t * c.x,
        y: u * u * u * b.y + 3 * u * u * t * k1.y + 3 * u * t * t * k2.y + t * t * t * c.y,
      })
    }
  }
  return { d: kapali ? `${d} Z` : d, ornek }
}

function okUcu(son: Nokta, onceki: Nokta, boy = 9): string {
  const a = Math.atan2(son.y - onceki.y, son.x - onceki.x)
  const k = (s: number) => ({ x: son.x - boy * Math.cos(a + s), y: son.y - boy * Math.sin(a + s) })
  return `M ${yaz(son)} L ${yaz(k(0.4))} L ${yaz(k(-0.4))} Z`
}

const cizgilerDen = (n: Nokta[], kapali: boolean): Parca[] => {
  const c: Parca[] = []
  for (let i = 0; i + 1 < n.length; i++) c.push({ a: n[i], b: n[i + 1] })
  if (kapali && n.length > 2) c.push({ a: n[n.length - 1], b: n[0] })
  return c
}

function cemberParcalari(m: Nokta, r: number, adet = 28): Parca[] {
  const c: Parca[] = []
  for (let i = 0; i < adet; i++) {
    c.push({ a: { x: m.x + r * Math.cos((i / adet) * ikiPi), y: m.y + r * Math.sin((i / adet) * ikiPi) }, b: { x: m.x + r * Math.cos(((i + 1) / adet) * ikiPi), y: m.y + r * Math.sin(((i + 1) / adet) * ikiPi) } })
  }
  return c
}

function noktaIcinde(p: Nokta, cokgen: Nokta[]) {
  let ic = false
  for (let i = 0, j = cokgen.length - 1; i < cokgen.length; j = i++) {
    const a = cokgen[i]
    const b = cokgen[j]
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) ic = !ic
  }
  return ic
}

type Sinir = { minX: number; maxX: number; minY: number; maxY: number }
const bosSinir = (): Sinir => ({ minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity })
function sinirEkle(s: Sinir, x: number, y: number) {
  s.minX = Math.min(s.minX, x)
  s.maxX = Math.max(s.maxX, x)
  s.minY = Math.min(s.minY, y)
  s.maxY = Math.max(s.maxY, y)
}

function etiketOlustur(metin: string, boy: number, x: number, y: number, hareket: number, renk: CizgiRengi = 'on', kalin = true) {
  const duzen = yaziDuzeni(metin, boy)
  return { duzen, renk, kalin, x, y, gen: duzen.gen + 2, yuk: duzen.yuk, hx: x, hy: y, hareket }
}
type IcEtiket = ReturnType<typeof etiketOlustur>

/** Yazıyı `merkez`den `aci` yönünde, kutusu çizgilere değmeyecek kadar uzağa koyar. */
function yonaKoy(e: IcEtiket, merkez: Nokta, aci: number, bosluk: number, engeller: Parca[]) {
  const y = yon(aci)
  let d = bosluk + kutuDestek(e.gen, e.yuk, y)
  for (let i = 0; i < 24; i++) {
    const k = { x: merkez.x + y.x * d, y: merkez.y + y.y * d, gen: e.gen, yuk: e.yuk }
    if (!engeller.some((s) => kutuParcaKesisir(k, s, 1.5))) break
    d += 1.5
  }
  e.x = e.hx = merkez.x + y.x * d
  e.y = e.hy = merkez.y + y.y * d
}

function sahneyiKapat(
  temel: Omit<Sahne, 'viewBox'>,
  sinir: Sinir,
  etiketler: IcEtiket[],
): { sahne: Sahne; gen: number; yuk: number } {
  const s = { ...sinir }
  for (const e of etiketler) {
    sinirEkle(s, e.x - e.gen / 2, e.y - e.yuk / 2)
    sinirEkle(s, e.x + e.gen / 2, e.y + e.yuk / 2)
  }
  const gen = s.maxX - s.minX
  const yuk = s.maxY - s.minY
  const vbGen = Math.max(SEKIL_GENISLIGI, gen + 2 * KENAR)
  const vx = (s.minX + s.maxX) / 2 - vbGen / 2
  const viewBox: [number, number, number, number] = [yuvarla(vx), yuvarla(s.minY - KENAR), yuvarla(vbGen), yuvarla(yuk + 2 * KENAR)]
  return {
    sahne: {
      ...temel,
      etiketler: etiketler.map((e) => ({ x: yuvarla(e.x), y: yuvarla(e.y), duzen: e.duzen, renk: e.renk, kalin: e.kalin })),
      viewBox,
    },
    gen,
    yuk,
  }
}

// ── Geometri (eksensiz koordinat) ────────────────────────────────────────────

type Dugum = { p: Nokta; yonler: number[]; noktaAdi?: string; bos?: boolean; noktaVar: boolean; cizgiUcu: boolean; dolu: number[] }
type AltParca = Parca & { kesik: boolean; kenar: boolean }

function veriSiniri(g: KoordinatGorseli): Sinir {
  const s = bosSinir()
  for (const e of g.egriler ?? []) for (const [x, y] of e.noktalar) sinirEkle(s, x, y)
  for (const c of g.cemberler ?? []) {
    sinirEkle(s, c.x - c.r, c.y - c.r)
    sinirEkle(s, c.x + c.r, c.y + c.r)
  }
  for (const n of g.noktalar ?? []) sinirEkle(s, n.x, n.y)
  if (!Number.isFinite(s.minX)) {
    const [a, b, c, d] = g.pencere
    return { minX: a, maxX: b, minY: c, maxY: d }
  }
  return s
}

/** Eksensiz `koordinat`: kitap görünümlü geometri şekli. */
export function geometriSahnesi(g: KoordinatGorseli): Sahne {
  const sinir = veriSiniri(g)
  const vg = Math.max(sinir.maxX - sinir.minX, 1e-6)
  const vy = Math.max(sinir.maxY - sinir.minY, 1e-6)
  const izinGen = SEKIL_GENISLIGI - 2 * KENAR
  const izinYuk = YUK_SINIRI - 2 * KENAR
  let olcek = Math.min((izinGen - 64) / vg, (250 - 52) / vy)
  let sonuc = geometriKur(g, olcek, sinir)
  for (let i = 0; i < 4; i++) {
    if (sonuc.gen <= izinGen + 0.5 && sonuc.yuk <= izinYuk + 0.5) break
    const tasGen = sonuc.gen - vg * olcek
    const tasYuk = sonuc.yuk - vy * olcek
    const oran = Math.min((izinGen - tasGen) / (vg * olcek), (izinYuk - tasYuk) / (vy * olcek))
    olcek *= sinirla(oran, 0.3, 0.97)
    sonuc = geometriKur(g, olcek, sinir)
  }
  return sonuc.sahne
}

function geometriKur(g: KoordinatGorseli, olcek: number, veri: Sinir) {
  const P = (x: number, y: number): Nokta => ({ x: (x - veri.minX) * olcek, y: (veri.maxY - y) * olcek })
  const sinir = bosSinir()
  const yollar: SahneYolu[] = []
  const okUclari: Sahne['okUclari'] = []
  const parcalar: (Parca & { kesik: boolean; ok: boolean })[] = []
  const engeller: Parca[] = []
  const cokgenler: Nokta[][] = []
  const dikdortgenler: Nokta[][] = []
  const isaretler: Nokta[][] = []
  const capraz = Math.hypot(veri.maxX - veri.minX, veri.maxY - veri.minY) * olcek

  for (const e of g.egriler ?? []) {
    let n = e.noktalar.map(([x, y]) => P(x, y))
    if (n.length < 2) continue
    // Son noktası ilkine dönen çizgi kapalı çokgendir (veri bazen ikisini birden yazıyor).
    let kapali = !!e.kapali
    if (n.length > 3 && ayni(n[0], n[n.length - 1], 0.5)) {
      n = n.slice(0, -1)
      kapali = true
    }
    const kirik = e.kirik || n.length === 2
    // Verinin kendi çizdiği küçük "L" dik açı işareti: ayrıca kare çizileceği için atlanır.
    if (kirik && !kapali && n.length === 3) {
      const b1 = uzaklik(n[0], n[1])
      const b2 = uzaklik(n[1], n[2])
      const a = Math.abs(Math.atan2(n[0].y - n[1].y, n[0].x - n[1].x) - Math.atan2(n[2].y - n[1].y, n[2].x - n[1].x))
      if (b1 < capraz * 0.09 && b2 < capraz * 0.09 && Math.abs(Math.min(a, ikiPi - a) - Math.PI / 2) < 0.09) {
        isaretler.push(n)
        continue
      }
    }
    for (const p of n) sinirEkle(sinir, p.x, p.y)
    const renk: CizgiRengi = e.renk === 'ikincil' ? 'mavi' : 'on'
    const kesik = !!e.kesik
    const dolgu: SahneYolu['dolgu'] = kapali ? (e.renk === 'soluk' ? 'tarali' : e.renk === 'ikincil' ? 'mavi' : undefined) : undefined
    const kalinlik = kesik ? 1.3 : e.renk === 'soluk' && !kapali ? 1.5 : 1.85
    if (kirik) {
      yollar.push({ d: kirikYol(n, kapali), renk, kalinlik, kesik, dolgu })
      for (const c of cizgilerDen(n, kapali)) {
        parcalar.push({ ...c, kesik, ok: !!e.ok })
        engeller.push(c)
      }
      if (kapali && e.renk !== 'soluk') cokgenler.push(n)
      if (kapali && n.length === 4 && n.every((p, i) => {
        const a = n[(i + 3) % 4]
        const b = n[(i + 1) % 4]
        const u = fark(a, p)
        const v = fark(b, p)
        return Math.abs(u.x * v.x + u.y * v.y) / (uzunluk(u) * uzunluk(v) || 1) < 0.03
      })) dikdortgenler.push(n)
      if (e.ok) okUclari.push({ d: okUcu(n[n.length - 1], n[n.length - 2]), renk })
    } else {
      const y = yumusakYol(n, kapali)
      yollar.push({ d: y.d, renk, kalinlik, kesik, dolgu })
      engeller.push(...cizgilerDen(y.ornek, false))
      for (const p of y.ornek) sinirEkle(sinir, p.x, p.y)
      if (e.ok) okUclari.push({ d: okUcu(y.ornek[y.ornek.length - 1], y.ornek[y.ornek.length - 2]), renk })
    }
  }

  const cemberler: Sahne['cemberler'] = (g.cemberler ?? []).map((c) => {
    const m = P(c.x, c.y)
    const r = c.r * olcek
    sinirEkle(sinir, m.x - r, m.y - r)
    sinirEkle(sinir, m.x + r, m.y + r)
    engeller.push(...cemberParcalari(m, r))
    return { x: yuvarla(m.x), y: yuvarla(m.y), r: yuvarla(r), renk: c.renk === 'ikincil' ? 'mavi' : 'on', dolu: false }
  })

  // Düğümler: kırık çizgilerin köşeleri ve noktalar.
  const dugumler: Dugum[] = []
  const dugumEkle = (p: Nokta) => {
    let d = dugumler.find((x) => ayni(x.p, p, 2))
    if (!d) {
      d = { p, yonler: [], noktaVar: false, cizgiUcu: false, dolu: [] }
      dugumler.push(d)
    }
    return d
  }
  for (const s of parcalar) {
    dugumEkle(s.a)
    dugumEkle(s.b)
  }
  for (const n of g.noktalar ?? []) {
    const p = P(n.x, n.y)
    sinirEkle(sinir, p.x, p.y)
    const d = dugumEkle(p)
    d.noktaVar = true
    if (n.ad) d.noktaAdi = n.ad
    if (n.bos) d.bos = true
  }
  for (const d of dugumler) {
    for (const s of parcalar) {
      if (ayni(d.p, s.a, 2)) {
        d.yonler.push(Math.atan2(s.b.y - s.a.y, s.b.x - s.a.x))
        if (!s.kesik) d.cizgiUcu = true
      } else if (ayni(d.p, s.b, 2)) {
        d.yonler.push(Math.atan2(s.a.y - s.b.y, s.a.x - s.b.x))
        if (!s.kesik) d.cizgiUcu = true
      } else {
        const { d: u, t } = parcayaUzaklik(d.p, s)
        if (u < 1.6 && t > 0 && t < 1) {
          const a = Math.atan2(s.b.y - s.a.y, s.b.x - s.a.x)
          d.yonler.push(a, a + Math.PI)
        }
      }
    }
    for (const c of cemberler) {
      const u = uzaklik(d.p, c)
      if (Math.abs(u - c.r) < 2 && c.r > 6) {
        const a = Math.atan2(d.p.y - c.y, d.p.x - c.x)
        d.yonler.push(a + Math.PI / 2, a - Math.PI / 2)
      }
    }
    d.yonler = yonleriDuzenle(d.yonler)
  }

  // Alt parçalar: kenarın üstündeki noktalarda bölünmüş doğru parçaları (uzunluk etiketi için).
  const altParcalar: AltParca[] = []
  for (const s of parcalar) {
    // Vektörün (oklu çizgi) boyu yazılmaz; ucundaki yazı gösterdiği yerin adı.
    if (s.ok) continue
    const ic = dugumler
      .map((dg) => ({ dg, ...parcayaUzaklik(dg.p, s) }))
      .filter((x) => x.d < 1.6 && x.t > 0.01 && x.t < 0.99)
      .sort((a, b) => a.t - b.t)
    const sira = [s.a, ...ic.map((x) => x.dg.p), s.b]
    for (let i = 0; i + 1 < sira.length; i++) {
      const a = sira[i]
      const b = sira[i + 1]
      if (uzaklik(a, b) < 6) continue
      if (altParcalar.some((x) => (ayni(x.a, a, 2) && ayni(x.b, b, 2)) || (ayni(x.a, b, 2) && ayni(x.b, a, 2)))) continue
      const orta = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
      const n = birimNormal(a, b)
      const ic1 = cokgenler.some((c) => noktaIcinde({ x: orta.x + n.x * 3, y: orta.y + n.y * 3 }, c))
      const ic2 = cokgenler.some((c) => noktaIcinde({ x: orta.x - n.x * 3, y: orta.y - n.y * 3 }, c))
      altParcalar.push({ a, b, kesik: s.kesik, kenar: ic1 !== ic2 })
    }
  }

  const agirlik = sinir.minX < Infinity ? { x: (sinir.minX + sinir.maxX) / 2, y: (sinir.minY + sinir.maxY) / 2 } : { x: 0, y: 0 }
  const etiketler: IcEtiket[] = []
  const yayParcalari: string[] = []
  const dikParcalari: string[] = []
  const centikParcalari: string[] = []
  const ekEngeller: Parca[] = []
  const harfEsigi = sinirla(Math.min(sinir.maxX - sinir.minX, sinir.maxY - sinir.minY) * 0.2, 26, 52)
  const aciDilimleri: { d: Dugum; bas: number; son: number; dik: boolean }[] = []

  type Ham = { ad: string; p: Nokta; tur: EtiketTuru; dugum?: Dugum }
  const hamlar: Ham[] = []
  for (const t of g.etiketler ?? []) hamlar.push({ ad: t.ad.trim(), p: P(t.x, t.y), tur: etiketTuru(t.ad) })
  // Noktanın adı: etiketlerde aynı harf varsa tek yazı kalır.
  for (const d of dugumler) {
    if (!d.noktaAdi) continue
    const ayniHarf = hamlar.findIndex((h) => h.ad === d.noktaAdi && uzaklik(h.p, d.p) < harfEsigi * 1.6)
    if (ayniHarf >= 0) hamlar.splice(ayniHarf, 1)
    hamlar.push({ ad: d.noktaAdi, p: d.p, tur: HARF.test(d.noktaAdi) ? 'harf' : 'serbest', dugum: d })
  }

  const enYakinDugum = (p: Nokta, enAzYon: number, esik: number) => {
    let en: Dugum | undefined
    let enU = esik
    for (const d of dugumler) {
      if (d.yonler.length < enAzYon) continue
      const u = uzaklik(d.p, p)
      if (u < enU) {
        enU = u
        en = d
      }
    }
    return en
  }
  const enYakinAltParca = (p: Nokta, esik: number) => {
    let en: AltParca | undefined
    let enU = esik
    for (const s of altParcalar) {
      const { d, t } = parcayaUzaklik(p, s)
      const ceza = t < 0.08 || t > 0.92 ? 8 : 0
      // Uzak yazı o parçanın değil: kadran sayıları tek ibreye toplanıyordu.
      if (d > Math.max(26, Math.min(esik, uzaklik(s.a, s.b) * 0.4))) continue
      if (d + ceza < enU) {
        enU = d + ceza
        en = s
      }
    }
    return en
  }

  // Belirsiz etiketler (x, 2x + 10, 3k): köşeye mi kenara mı yakın?
  for (const h of hamlar) {
    if (h.tur !== 'belirsiz') continue
    const d = enYakinDugum(h.p, 2, 60)
    let ortaU = Infinity
    for (const s of altParcalar) ortaU = Math.min(ortaU, uzaklik(h.p, { x: (s.a.x + s.b.x) / 2, y: (s.a.y + s.b.y) / 2 }))
    if (d) {
      const dilim = dilimBul(d.yonler, Math.atan2(h.p.y - d.p.y, h.p.x - d.p.x))
      if (dilim && dilim.aci < Math.PI - 0.05 && uzaklik(d.p, h.p) < ortaU * 0.65) {
        h.tur = 'aci'
        continue
      }
    }
    // Çokgenin içinde, kenarlardan uzakta duran ifade bölge yazısıdır (alan).
    let enYakinKenar = Infinity
    for (const s of altParcalar) enYakinKenar = Math.min(enYakinKenar, parcayaUzaklik(h.p, s).d)
    const icerde = cokgenler.some((c) => noktaIcinde(h.p, c))
    if (icerde && enYakinKenar > Math.max(18, olcek * 0.75)) {
      h.tur = 'serbest'
      continue
    }
    h.tur = altParcalar.length ? 'uzunluk' : 'serbest'
  }

  // 1) Açılar: yay + yazı.
  for (const h of hamlar) {
    if (h.tur !== 'aci') continue
    const d = enYakinDugum(h.p, 2, 64)
    if (!d) {
      h.tur = 'serbest'
      continue
    }
    const yonu = Math.atan2(h.p.y - d.p.y, h.p.x - d.p.x)
    let dilim = dilimBul(d.yonler, yonu)
    if (!dilim) {
      h.tur = 'serbest'
      continue
    }
    if (dilim.aci > Math.PI + 0.02) {
      // Veri yazıyı köşenin dışına koymuş: en yakın dışbükey dilim.
      const dis = dilimler(d.yonler).filter((x) => x.aci <= Math.PI + 0.02)
      if (!dis.length) {
        h.tur = 'serbest'
        continue
      }
      dilim = dis.reduce((a, b) => (Math.cos(b.bas + b.aci / 2 - yonu) > Math.cos(a.bas + a.aci / 2 - yonu) ? b : a))
    }
    const kenarBoyu = (a: number) => {
      let en = Infinity
      for (const s of parcalar) {
        const uc = ayni(s.a, d.p, 2) ? s.b : ayni(s.b, d.p, 2) ? s.a : null
        if (uc && Math.abs(Math.cos(Math.atan2(uc.y - d.p.y, uc.x - d.p.x) - a) - 1) < 0.001) en = Math.min(en, uzaklik(uc, d.p))
      }
      return en === Infinity ? 60 : en
    }
    const kisa = Math.min(kenarBoyu(dilim.bas), kenarBoyu(dilim.son))
    const onceki = aciDilimleri.filter((x) => x.d === d && Math.abs(x.bas - dilim.bas) < 0.01).length
    const dik = h.ad === '90°' && dikMi(dilim.aci, 3)
    let r = dilim.aci < 0.62 ? sinirla(kisa * 0.42, 18, 32) : sinirla(kisa * 0.28, 13, 21)
    r += onceki * 5
    const orta = dilim.bas + dilim.aci / 2
    if (!onceki) {
      if (dik) dikParcalari.push(dikKare(d.p, dilim.bas, dilim.son, sinirla(kisa * 0.18, 7, 10)))
      else yayParcalari.push(yay(d.p, r, dilim.bas, dilim.son))
      for (let i = 0; i < 6; i++) {
        const a1 = dilim.bas + (dilim.aci * i) / 6
        const a2 = dilim.bas + (dilim.aci * (i + 1)) / 6
        ekEngeller.push({ a: { x: d.p.x + r * Math.cos(a1), y: d.p.y + r * Math.sin(a1) }, b: { x: d.p.x + r * Math.cos(a2), y: d.p.y + r * Math.sin(a2) } })
      }
      aciDilimleri.push({ d, bas: dilim.bas, son: dilim.son, dik })
    }
    const e = etiketOlustur(h.ad, YAZI_BOYU.aci, 0, 0, 0.7)
    // Dar açıda yazı yayın dışında ve iki kolun arasında kalacak kadar uzakta.
    const yarim = dilim.aci / 2
    const destek = kutuDestek(e.gen, e.yuk, yon(orta + Math.PI / 2))
    const enAz = yarim < Math.PI / 2 ? (destek + 2) / Math.max(Math.sin(yarim), 0.2) : 0
    const u = Math.min(Math.max(r + 3 + kutuDestek(e.gen, e.yuk, yon(orta)), enAz), r + 46)
    e.x = e.hx = d.p.x + Math.cos(orta) * u
    e.y = e.hy = d.p.y + Math.sin(orta) * u
    d.dolu.push(orta)
    etiketler.push(e)
  }

  // 2) Dik açılar: verinin işareti, sonra dik dilimler (dikdörtgen köşeleri hariç).
  for (const n of isaretler) {
    const tepe = { x: n[0].x + n[2].x - n[1].x, y: n[0].y + n[2].y - n[1].y }
    const d = dugumler.find((x) => ayni(x.p, tepe, 3))
    const dilim = d && dilimBul(d.yonler, Math.atan2(n[1].y - tepe.y, n[1].x - tepe.x))
    if (d && dilim && dikMi(dilim.aci, 4)) {
      if (!aciDilimleri.some((x) => x.d === d && Math.abs(x.bas - dilim.bas) < 0.01)) {
        dikParcalari.push(dikKare(d.p, dilim.bas, dilim.son, 9))
        aciDilimleri.push({ d, bas: dilim.bas, son: dilim.son, dik: true })
        d.dolu.push(dilim.bas + dilim.aci / 2)
      }
    } else {
      yollar.push({ d: kirikYol(n, false), renk: 'on', kalinlik: 1.3 })
    }
  }
  // Yatay-dikey çizgilerden kurulu çizimde (kutu, merdiven, raf, bölünmüş
  // dikdörtgen) her köşe dik; hepsine kare koymak çizimi boğuyordu. Eksene
  // paralel dik köşe üçten çoksa onlar işaretlenmez; eğik dik açılar yine işaretlenir.
  const eksenParalel = (a: number) => Math.abs(Math.sin(2 * a)) < 0.03
  let eksenDikSayisi = 0
  for (const d of dugumler) for (const dl of dilimler(d.yonler)) if (dikMi(dl.aci) && eksenParalel(dl.bas) && eksenParalel(dl.son)) eksenDikSayisi++
  for (const d of dugumler) {
    if (aciDilimleri.some((x) => x.d === d)) continue
    for (const dl of dilimler(d.yonler)) {
      if (!dikMi(dl.aci)) continue
      if (eksenDikSayisi > 3 && eksenParalel(dl.bas) && eksenParalel(dl.son)) continue
      // Dikdörtgen/kare köşesi ve kenarındaki T birleşimi: dik olduğu zaten
      // biliniyor, kitap da işaretlemiyor (döndürülmüş kare dâhil).
      const dikdortgenKenari = dikdortgenler.some((c) => {
        if (!cizgilerDen(c, true).some((s) => parcayaUzaklik(d.p, s).d < 2)) return false
        const t = Math.atan2(c[1].y - c[0].y, c[1].x - c[0].x)
        const paralel = (a: number) => Math.abs(Math.sin(2 * (a - t))) < 0.03
        return paralel(dl.bas) && paralel(dl.son)
      })
      if (dikdortgenKenari) continue
      // Kollar çok kısaysa (iki nokta üst üste gibi) kare yanıltır.
      const kisaKol = parcalar.every((s) => !(ayni(s.a, d.p, 2) || ayni(s.b, d.p, 2)) || uzaklik(s.a, s.b) > 14)
      if (!kisaKol) continue
      dikParcalari.push(dikKare(d.p, dl.bas, dl.son, 9))
      aciDilimleri.push({ d, bas: dl.bas, son: dl.son, dik: true })
      d.dolu.push(dl.bas + dl.aci / 2)
      break
    }
  }
  for (const a of aciDilimleri) {
    if (!a.dik) continue
    const k = 9
    const u = yon(a.bas)
    const v = yon(a.son)
    const p1 = { x: a.d.p.x + u.x * k, y: a.d.p.y + u.y * k }
    const p2 = { x: p1.x + v.x * k, y: p1.y + v.y * k }
    const p3 = { x: a.d.p.x + v.x * k, y: a.d.p.y + v.y * k }
    ekEngeller.push({ a: p1, b: p2 }, { a: p2, b: p3 })
  }

  // 3) Eş kenar çentikleri ("|", "||" etiketleri).
  for (const h of hamlar) {
    if (h.tur !== 'centik') continue
    const s = enYakinAltParca(h.p, 60)
    if (!s) continue
    const adet = h.ad.length
    const v = birim(fark(s.b, s.a))
    const n = birimNormal(s.a, s.b)
    const orta = { x: (s.a.x + s.b.x) / 2, y: (s.a.y + s.b.y) / 2 }
    for (let i = 0; i < adet; i++) {
      const k = (i - (adet - 1) / 2) * 3.6
      const m = { x: orta.x + v.x * k, y: orta.y + v.y * k }
      centikParcalari.push(`M ${yaz({ x: m.x + n.x * 5, y: m.y + n.y * 5 })} L ${yaz({ x: m.x - n.x * 5, y: m.y - n.y * 5 })}`)
    }
  }

  // 4) Uzunluklar: ait olduğu parçanın ortası, dış normal yönünde.
  const tumEngeller = [...engeller, ...ekEngeller]
  for (const h of hamlar) {
    if (h.tur !== 'uzunluk') continue
    const s = enYakinAltParca(h.p, 80)
    if (!s) {
      h.tur = 'serbest'
      continue
    }
    const orta = { x: (s.a.x + s.b.x) / 2, y: (s.a.y + s.b.y) / 2 }
    let n = birimNormal(s.a, s.b)
    const disari = (k: Nokta) => !cokgenler.some((c) => noktaIcinde(k, c))
    let isaret: number
    if (s.kenar) isaret = disari({ x: orta.x + n.x * 3, y: orta.y + n.y * 3 }) ? 1 : -1
    else {
      const taraf = (h.p.x - s.a.x) * n.x + (h.p.y - s.a.y) * n.y
      if (Math.abs(taraf) > 2) isaret = Math.sign(taraf)
      else isaret = (orta.x - agirlik.x) * n.x + (orta.y - agirlik.y) * n.y >= 0 ? 1 : -1
    }
    n = { x: n.x * isaret, y: n.y * isaret }
    const e = etiketOlustur(h.ad, YAZI_BOYU.uzunluk, 0, 0, 0.6)
    yonaKoy(e, orta, Math.atan2(n.y, n.x), 5, [s])
    etiketler.push(e)
  }

  // 5) Köşe harfleri: düğüme bağla, boş yöne it.
  for (const h of hamlar) {
    if (h.tur !== 'harf') continue
    const d = h.dugum ?? enYakinDugum(h.p, 0, harfEsigi)
    const e = etiketOlustur(h.ad, YAZI_BOYU.harf, h.p.x, h.p.y, 0.5)
    if (!d) {
      e.hareket = 0.8
      etiketler.push(e)
      continue
    }
    // Küçük bir çemberin merkezindeki harf (ağaç/çizge düğümü) çemberin içinde kalır.
    const merkezCember = cemberler.find((c) => ayni(c, d.p, 2) && c.r < 26 && c.r >= e.gen / 2 + 3)
    if (merkezCember) {
      merkezCember.dolu = true
      e.x = e.hx = d.p.x
      e.y = e.hy = d.p.y
      e.hareket = 0
      etiketler.push(e)
      continue
    }
    const veriYonu = !h.dugum && uzaklik(h.p, d.p) > 4 ? Math.atan2(h.p.y - d.p.y, h.p.x - d.p.x) : Math.atan2(d.p.y - agirlik.y, d.p.x - agirlik.x)
    const aci = bosYon([...d.yonler, ...d.dolu], veriYonu)
    yonaKoy(e, d.p, aci, 4, tumEngeller)
    d.dolu.push(aci)
    etiketler.push(e)
  }

  // 6) Serbest yazılar (alan, açıklama): verinin koyduğu yerde, çakışırsa itilir.
  for (const h of hamlar) {
    if (h.tur !== 'alan' && h.tur !== 'serbest') continue
    const merkezCember = cemberler.find((c) => ayni(c, h.p, 3) && c.r < 26 && c.r >= yaziDuzeni(h.ad, YAZI_BOYU.serbest).gen / 2 + 3)
    if (merkezCember) {
      merkezCember.dolu = true
      etiketler.push(etiketOlustur(h.ad, YAZI_BOYU.serbest, h.p.x, h.p.y, 0))
      continue
    }
    etiketler.push(etiketOlustur(h.ad, YAZI_BOYU.serbest, h.p.x, h.p.y, 1, 'on', h.tur === 'alan'))
  }
  // Eğri adları (d doğrusu gibi): son ucun biraz ötesinde.
  for (const e of g.egriler ?? []) {
    if (!e.ad || e.noktalar.length < 2) continue
    const n = e.noktalar.map(([x, y]) => P(x, y))
    const son = n[n.length - 1]
    const v = birim(fark(son, n[n.length - 2]))
    const et = etiketOlustur(e.ad, YAZI_BOYU.harf, 0, 0, 0.8)
    yonaKoy(et, son, Math.atan2(v.y, v.x), 4, [])
    etiketler.push(et)
  }

  // Çizgilerin merkezinde birleştiği küçük çemberler (çizge düğümü, fidan, daire
  // dizisi) içi kart rengiyle dolu: çizgi düğümün içinden geçmiş gibi görünmesin.
  for (const c of cemberler) {
    if (c.r < 26 && dugumler.some((d) => d.yonler.length > 0 && ayni(d.p, c, 2))) c.dolu = true
  }

  // Noktalar: çizginin ucunda olmayanlara küçük dolu daire.
  const noktalar: Sahne['noktalar'] = []
  const noktaEngelleri: Parca[] = []
  for (const d of dugumler) {
    if (cemberler.some((c) => c.dolu && ayni(c, d.p, 2))) continue
    // Çemberin merkezi, ucunda yarıçap olsa da noktayla gösterilir.
    const merkez = cemberler.some((c) => c.r >= 26 && ayni(c, d.p, 2))
    if (!d.noktaVar || (d.cizgiUcu && !merkez)) continue
    noktalar.push({ x: yuvarla(d.p.x), y: yuvarla(d.p.y), bos: !!d.bos, renk: 'on' })
    noktaEngelleri.push(...cemberParcalari(d.p, 3.5, 6))
  }

  etiketleriAyir(etiketler, [...tumEngeller, ...noktaEngelleri])

  const harfler = hamlar.filter((h) => h.tur === 'harf').map((h) => h.ad)
  const verilen = hamlar.filter((h) => h.tur === 'uzunluk' || h.tur === 'aci' || h.tur === 'alan').map((h) => h.ad)
  const aciklama = [
    'Geometri şekli',
    harfler.length ? `noktalar: ${harfler.join(', ')}` : '',
    verilen.length ? `verilenler: ${verilen.join(', ')}` : '',
    dikParcalari.length ? 'dik açı işaretli' : '',
  ].filter(Boolean).join('; ')

  return sahneyiKapat(
    {
      yollar,
      okUclari,
      cemberler,
      noktalar,
      etiketler: [],
      yaylar: yayParcalari.join(' ') || undefined,
      dikAcilar: dikParcalari.join(' ') || undefined,
      esCentikleri: centikParcalari.join(' ') || undefined,
      aciklama,
    },
    sinir,
    etiketler,
  )
}

function birim(v: Nokta): Nokta {
  const u = uzunluk(v) || 1
  return { x: v.x / u, y: v.y / u }
}

function birimNormal(a: Nokta, b: Nokta): Nokta {
  const v = birim(fark(b, a))
  return { x: -v.y, y: v.x }
}

function yay(m: Nokta, r: number, bas: number, son: number) {
  const p1 = { x: m.x + r * Math.cos(bas), y: m.y + r * Math.sin(bas) }
  const p2 = { x: m.x + r * Math.cos(son), y: m.y + r * Math.sin(son) }
  const buyuk = son - bas > Math.PI ? 1 : 0
  return `M ${yaz(p1)} A ${yuvarla(r)} ${yuvarla(r)} 0 ${buyuk} 1 ${yaz(p2)}`
}

/** Köşede iki kol boyunca `k` uzunluğunda küçük kare. */
export function dikKare(m: Nokta, bas: number, son: number, k: number) {
  const u = yon(bas)
  const v = yon(son)
  const p1 = { x: m.x + u.x * k, y: m.y + u.y * k }
  const p2 = { x: p1.x + v.x * k, y: p1.y + v.y * k }
  const p3 = { x: m.x + v.x * k, y: m.y + v.y * k }
  return `M ${yaz(p1)} L ${yaz(p2)} L ${yaz(p3)}`
}

// ── Grafik (eksenli koordinat) ───────────────────────────────────────────────

const ADIMLAR = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000]

/**
 * Eksen çentiklerinin adımı: tam sayı (aralık küçükse 0,5), çentikler
 * arası en az `enAzPiksel`. π etiketli grafikte π/2'nin katları.
 */
export function eksenAdimi(aralik: number, pikselBirim: number, enAzPiksel: number, pi = false): number {
  // 0,25'lik çentik birim çemberde sekiz sayıyla ekseni dolduruyordu; en sık 0,5.
  const adaylar = pi ? [Math.PI / 4, Math.PI / 2, Math.PI, 2 * Math.PI] : aralik < 4 ? [0.5, ...ADIMLAR] : ADIMLAR
  return adaylar.find((a) => a * pikselBirim >= enAzPiksel) ?? adaylar[adaylar.length - 1]
}

/** [bas, son] içindeki adım katları (sıfır hariç; sıfırda eksen var). */
export function eksenCentikleri(bas: number, son: number, adim: number): number[] {
  const c: number[] = []
  for (let k = Math.ceil(bas / adim - 1e-9); k * adim <= son + 1e-9; k++) {
    const v = k * adim
    if (Math.abs(v) > 1e-9) c.push(Math.round(v * 1e6) / 1e6)
  }
  return c
}

/** Tam sayıda "−3", ondalıkta virgül. */
export function sayiYaz(v: number): string {
  const m = Math.abs(v)
  const s = Number.isInteger(m) ? String(m) : String(Math.round(m * 100) / 100).replace('.', ',')
  return v < 0 ? `−${s}` : s
}

const sayiMi = (ad: string) => /^[−-]?\d+([.,]\d+)?$/.test(ad.trim())

function cubukMu(g: KoordinatGorseli): boolean {
  const kapali = (g.egriler ?? []).filter((e) => e.kapali)
  if (!kapali.length) return false
  return kapali.every((e) => {
    const n = e.noktalar
    if (n.length !== 4 && n.length !== 5) return false
    const xs = new Set(n.map((p) => p[0]))
    const ys = new Set(n.map((p) => p[1]))
    return xs.size === 2 && ys.size === 2
  })
}

/**
 * Eksenli `koordinat` (ve eksen adı verilmiş eksensiz sütun grafiği).
 *
 * Ölçek: pencere çok yassı ya da çok uzun değilse iki eksende eşit (açılar ve
 * çemberler doğru), değilse eksenler ayrı ölçeklenir (trigonometri, sütun).
 */
export function grafikSahnesi(g: KoordinatGorseli): Sahne {
  let cizimGen = SEKIL_GENISLIGI - 2 * KENAR - 44
  let carpan = 1
  let sonuc = grafikKur(g, cizimGen, carpan)
  for (let i = 0; i < 4; i++) {
    const tas = sonuc.gen - (SEKIL_GENISLIGI - 2 * KENAR)
    const tasYuk = sonuc.yuk - (YUK_SINIRI - 2 * KENAR)
    if (tas <= 0.5 && tasYuk <= 0.5) break
    if (tas > 0.5) cizimGen = Math.max(140, cizimGen - tas - 2)
    if (tasYuk > 0.5) carpan *= Math.max(0.6, (sonuc.cizimYuk - tasYuk - 2) / sonuc.cizimYuk)
    sonuc = grafikKur(g, cizimGen, carpan)
  }
  return sonuc.sahne
}

function grafikKur(g: KoordinatGorseli, cizimGen: number, yukCarpani = 1) {
  let [x0, x1, y0, y1] = g.pencere
  if (!(x1 > x0)) x1 = x0 + 1
  if (!(y1 > y0)) y1 = y0 + 1
  const eksenli = g.eksenler !== false
  const cubuk = cubukMu(g)
  const xr = x1 - x0
  const yr = y1 - y0
  let cizimYuk = (cizimGen * yr) / xr
  if (cizimYuk < 140 || cizimYuk > 270) cizimYuk = sinirla(cizimYuk, 170, 240)
  cizimYuk *= yukCarpani
  const kx = cizimGen / xr
  const ky = cizimYuk / yr
  const X = (x: number) => (x - x0) * kx
  const Y = (y: number) => (y1 - y) * ky
  const P = (x: number, y: number): Nokta => ({ x: X(x), y: Y(y) })

  const sinir = bosSinir()
  sinirEkle(sinir, 0, 0)
  sinirEkle(sinir, cizimGen, cizimYuk)
  const engeller: Parca[] = []
  const etiketler: IcEtiket[] = []

  // Sütunların ortak tabanı: sıfır pencerede yoksa eksen oraya oturur.
  const kapaliEgriler = (g.egriler ?? []).filter((e) => e.kapali)
  const taban = cubuk ? Math.min(...kapaliEgriler.flatMap((e) => e.noktalar.map((p) => p[1]))) : y0
  const yEksenDegeri = y0 <= 0 && 0 <= y1 ? 0 : sinirla(taban, y0, y1)
  const xEksenDegeri = eksenli && x0 <= 0 && 0 <= x1 ? 0 : x0
  const eY = Y(yEksenDegeri)
  const eX = X(xEksenDegeri)

  const tumEtiketler = [
    ...(g.etiketler ?? []).map((t) => ({ ad: t.ad, x: t.x, y: t.y })),
    ...(g.noktalar ?? []).filter((n) => n.ad).map((n) => ({ ad: n.ad as string, x: n.x, y: n.y })),
  ]
  const pi = tumEtiketler.some((t) => t.ad.includes('π'))
  // Veri bir eksene kendi sayılarını yazmışsa o eksende otomatik sayı yok:
  // hem çift yazı olur hem de soru "grafikten oku" sorusuna dönüşür.
  const xVeriSayisi = tumEtiketler.some((t) => (sayiMi(t.ad) || t.ad.includes('π')) && Math.abs(Y(t.y) - eY) < 18)
  const yVeriSayisi = tumEtiketler.some((t) => sayiMi(t.ad) && Math.abs(X(t.x) - eX) < 26)
  const xSayilar = eksenli && !cubuk && !xVeriSayisi && !pi
  const ySayilar = eksenli && !yVeriSayisi
  const izgaraVar = eksenli && xSayilar && ySayilar

  const xAdim = eksenAdimi(xr, kx, 16, pi)
  const yAdim = eksenAdimi(yr, ky, 16)
  const xC = eksenli && !cubuk ? eksenCentikleri(x0, x1, xAdim).filter((v) => Math.abs(X(v) - eX) > 1) : []
  const yC = eksenli ? eksenCentikleri(y0, y1, yAdim).filter((v) => Math.abs(Y(v) - eY) > 1) : []

  let izgara = ''
  let centikler = ''
  if (izgaraVar) {
    for (const v of xC) izgara += `M ${yuvarla(X(v))} 0 V ${yuvarla(cizimYuk)} `
    for (const v of yC) izgara += `M 0 ${yuvarla(Y(v))} H ${yuvarla(cizimGen)} `
  }
  for (const v of xC) centikler += `M ${yuvarla(X(v))} ${yuvarla(eY - 3.5)} V ${yuvarla(eY + 3.5)} `
  for (const v of yC) centikler += `M ${yuvarla(eX - 3.5)} ${yuvarla(Y(v))} H ${yuvarla(eX + 3.5)} `

  // Çentik sayıları: sığmayanlar seyreltilir.
  // Küçük aralıkta (birim çember) çentik 0,5'te ama sayı yalnız tam sayılarda.
  const centikSayilari: IcEtiket[] = []
  const tamSec = (c: number[]) => (c.filter(Number.isInteger).length >= 2 ? c.filter(Number.isInteger) : c)
  if (xSayilar && xC.length) {
    const enGenis = Math.max(...xC.map((v) => yaziDuzeni(sayiYaz(v), YAZI_BOYU.sayi).gen))
    const kat = Math.max(1, Math.ceil((enGenis + 6) / (xAdim * kx)))
    for (const v of tamSec(xC)) {
      if (Math.round(v / xAdim) % kat !== 0) continue
      const e = etiketOlustur(sayiYaz(v), YAZI_BOYU.sayi, X(v), 0, 0.15, 'soluk', false)
      centikSayilari.push(e)
      e.y = e.hy = eY + 5 + e.yuk / 2
      etiketler.push(e)
    }
  }
  if (ySayilar && yC.length) {
    const kat = Math.max(1, Math.ceil(16 / (yAdim * ky)))
    for (const v of tamSec(yC)) {
      if (Math.round(v / yAdim) % kat !== 0) continue
      const e = etiketOlustur(sayiYaz(v), YAZI_BOYU.sayi, 0, Y(v), 0.15, 'soluk', false)
      centikSayilari.push(e)
      e.x = e.hx = eX - 6 - e.gen / 2
      etiketler.push(e)
    }
  }

  // Eksenler ve okları.
  const sagUc = cizimGen + 12
  const ustUc = -12
  const eksen = `M ${yuvarla(Math.min(0, eX) - 4)} ${yuvarla(eY)} H ${yuvarla(sagUc)} M ${yuvarla(eX)} ${yuvarla(Math.max(cizimYuk, eY) + 4)} V ${ustUc}`
  const eksenOklari = `${okUcu({ x: sagUc + 2, y: eY }, { x: 0, y: eY }, 8)} ${okUcu({ x: eX, y: ustUc - 2 }, { x: eX, y: 10 }, 8)}`
  sinirEkle(sinir, sagUc + 3, eY)
  sinirEkle(sinir, eX, ustUc - 3)
  engeller.push({ a: { x: Math.min(0, eX) - 4, y: eY }, b: { x: sagUc, y: eY } }, { a: { x: eX, y: cizimYuk + 4 }, b: { x: eX, y: ustUc } })

  // Başlangıç noktasının kendi adı varsa (B(0, 0)) ayrıca "O" yazılmaz.
  const baslangicAdli = tumEtiketler.some((t) => (Math.abs(t.x) < 1e-9 && Math.abs(t.y) < 1e-9) || /\(\s*0\s*[,;]\s*0\s*\)/.test(t.ad))
  if (eksenli && yEksenDegeri === 0 && xEksenDegeri === 0 && !baslangicAdli) {
    const o = etiketOlustur('O', YAZI_BOYU.sayi + 1, eX - 9, eY + 10, 0.3, 'on', false)
    etiketler.push(o)
  }
  const xAd = g.xAd ?? (eksenli ? 'x' : undefined)
  const yAd = g.yAd ?? (eksenli ? 'y' : undefined)
  let altBaslik: IcEtiket | undefined
  if (xAd) {
    const e = etiketOlustur(xAd, YAZI_BOYU.harf - (xAd.length > 2 ? 2 : 0), 0, 0, 0.3)
    if (xAd.length <= 2) {
      e.x = e.hx = sagUc + 6 + e.gen / 2
      e.y = e.hy = eY
    } else if (eY >= cizimYuk - 2) {
      // Eksen başlığı ortada, eksenin altındaki yazıların (kategori adları) da altında;
      // yeri veri etiketleri konduktan sonra belli olur.
      e.x = e.hx = cizimGen / 2
      e.y = e.hy = eY + 24 + e.yuk / 2
      altBaslik = e
    } else {
      e.x = e.hx = sagUc - e.gen / 2
      e.y = e.hy = eY + 8 + e.yuk / 2
    }
    etiketler.push(e)
  }
  if (yAd) {
    const e = etiketOlustur(yAd, YAZI_BOYU.harf - (yAd.length > 2 ? 2 : 0), 0, 0, 0.3)
    if (yAd.length <= 2) {
      e.x = e.hx = eX + 8 + e.gen / 2
      e.y = e.hy = ustUc + 2
    } else {
      e.x = e.hx = eX - 4 + e.gen / 2
      e.y = e.hy = ustUc - 6 - e.yuk / 2
    }
    etiketler.push(e)
  }

  // Eğriler.
  const yollar: SahneYolu[] = []
  const okUclari: Sahne['okUclari'] = []
  const egriEngelleri: Parca[] = []
  const kesikler: Parca[] = []
  // İki ayrı fonksiyon (f ve g) nötr + mavi; aynı fonksiyonun parçaları
  // (parçalı fonksiyon, rasyonel fonksiyonun iki kolu) aynı renkte kalır.
  const adlar = [...new Set((g.egriler ?? []).filter((e) => !e.kesik && !e.kapali && e.ad && e.renk !== 'ikincil' && e.renk !== 'soluk').map((e) => e.ad as string))]
  for (const e of g.egriler ?? []) {
    if (e.noktalar.length < 2) continue
    const n = e.noktalar.map(([x, y]) => P(x, y))
    const kapali = !!e.kapali
    const kesik = !!e.kesik
    let renk: CizgiRengi
    if (kesik) renk = 'soluk'
    else if (e.renk === 'ikincil') renk = 'mavi'
    else if (e.renk === 'soluk') renk = 'soluk'
    else if (kapali || !e.ad) renk = 'on'
    else renk = adlar.indexOf(e.ad) % 2 === 0 ? 'on' : 'mavi'
    const dolgu: SahneYolu['dolgu'] = kapali ? (e.renk === 'soluk' ? 'tarali' : e.renk === 'ikincil' ? 'mavi' : 'hafif') : undefined
    const kalinlik = kesik ? 1.25 : kapali ? 1.6 : 2
    const kirik = e.kirik || n.length === 2
    let ornek = n
    if (kirik) yollar.push({ d: kirikYol(n, kapali), renk, kalinlik, kesik, dolgu })
    else {
      const y = yumusakYol(n, kapali)
      ornek = y.ornek
      yollar.push({ d: y.d, renk, kalinlik, kesik, dolgu })
    }
    const parcalar = cizgilerDen(ornek, kapali && kirik)
    if (kesik) kesikler.push(...parcalar)
    egriEngelleri.push(...parcalar)
    if (e.ok) okUclari.push({ d: okUcu(ornek[ornek.length - 1], ornek[ornek.length - 2]), renk })
    // Eğrinin adı: pencerenin içindeki son noktanın yanında, eğriye değmeyen tarafta.
    if (e.ad) {
      const icerde = ornek.filter((p) => p.x >= 0 && p.x <= cizimGen && p.y >= 0 && p.y <= cizimYuk)
      const son = icerde[icerde.length - 1] ?? ornek[ornek.length - 1]
      const et = etiketOlustur(e.ad, YAZI_BOYU.harf, son.x, son.y, 0.6, renk === 'soluk' ? 'on' : renk)
      adayaKoy(et, son, [...engeller, ...egriEngelleri], etiketler, cizimGen, cizimYuk)
      etiketler.push(et)
    }
  }
  const cemberler: Sahne['cemberler'] = (g.cemberler ?? []).map((c) => {
    const m = P(c.x, c.y)
    const r = c.r * kx
    egriEngelleri.push(...cemberParcalari(m, r))
    return { x: yuvarla(m.x), y: yuvarla(m.y), r: yuvarla(r), renk: c.renk === 'ikincil' ? 'mavi' : c.renk === 'soluk' ? 'soluk' : 'on', dolu: false }
  })
  engeller.push(...egriEngelleri)

  // Noktalar: dolu daire, adı en boş yöne; koordinat yazılı noktaya izdüşüm.
  const noktalar: Sahne['noktalar'] = []
  const noktaEngelleri: Parca[] = []
  const izdusum: string[] = []
  const pencerede = (p: Nokta) => p.x >= -1 && p.x <= cizimGen + 1 && p.y >= -1 && p.y <= cizimYuk + 1
  for (const n of g.noktalar ?? []) {
    const p = P(n.x, n.y)
    if (!pencerede(p)) continue
    noktalar.push({ x: yuvarla(p.x), y: yuvarla(p.y), bos: !!n.bos, renk: 'on' })
    noktaEngelleri.push(...cemberParcalari(p, 4, 6))
    if (!n.ad) continue
    const eksendeX = Math.abs(p.y - eY) < 2
    const eksendeY = Math.abs(p.x - eX) < 2
    if (/\(.+[,;].+\)/.test(n.ad) && !eksendeX && !eksendeY) {
      const dusey = kesikler.some((s) => (ayni(s.a, p, 2) || ayni(s.b, p, 2)) && Math.abs(s.a.x - s.b.x) < 1)
      const yatay = kesikler.some((s) => (ayni(s.a, p, 2) || ayni(s.b, p, 2)) && Math.abs(s.a.y - s.b.y) < 1)
      if (!dusey) izdusum.push(`M ${yuvarla(p.x)} ${yuvarla(p.y)} V ${yuvarla(eY)}`)
      if (!yatay) izdusum.push(`M ${yuvarla(p.x)} ${yuvarla(p.y)} H ${yuvarla(eX)}`)
    }
    const boy = sayiMi(n.ad) ? YAZI_BOYU.sayi + 1 : YAZI_BOYU.uzunluk
    const e = etiketOlustur(n.ad, boy, p.x, p.y, 0.5)
    if (sayiMi(n.ad) && eksendeX) {
      e.x = e.hx = p.x + (eksendeY ? -e.gen / 2 - 5 : 0)
      e.y = e.hy = eY + 5 + e.yuk / 2
    } else if (sayiMi(n.ad) && eksendeY) {
      e.x = e.hx = eX - 6 - e.gen / 2
      e.y = e.hy = p.y
    } else adayaKoy(e, p, [...engeller, ...noktaEngelleri], etiketler, cizimGen, cizimYuk)
    etiketler.push(e)
  }
  if (izdusum.length) yollar.push({ d: izdusum.join(' '), renk: 'soluk', kalinlik: 1.2, kesik: true })

  // Serbest etiketler: verinin yerinde; sayı eksenin hemen yanındaysa eksenden ayrılır.
  for (const t of g.etiketler ?? []) {
    const p = P(t.x, t.y)
    const sayi = sayiMi(t.ad)
    const e = etiketOlustur(t.ad, sayi ? YAZI_BOYU.sayi + 1 : YAZI_BOYU.serbest, p.x, p.y, 0.8)
    etiketler.push(e)
  }
  if (altBaslik) {
    const baslik = altBaslik
    const alttakiler = etiketler.filter((e) => e !== baslik && e.y - e.yuk / 2 > eY - 2)
    const dip = Math.max(eY + 6, ...alttakiler.map((e) => e.y + e.yuk / 2))
    baslik.y = baslik.hy = dip + 10 + baslik.yuk / 2
    baslik.hareket = 0.05
  }

  // Verinin yazısıyla çakışan çentik sayısı düşer: "x = 2" asimptot yazısı
  // 2 ile 3'ün arasına sıkışıyordu. Verinin yazısı sorunun parçası, çentik sayısı değil.
  const sayiEtiketi = new Set(centikSayilari)
  const kalan = etiketler.filter((e) => {
    if (!sayiEtiketi.has(e)) return true
    return !etiketler.some((o) => !sayiEtiketi.has(o) && (o.gen + e.gen) / 2 + 2 > Math.abs(o.x - e.x) && (o.yuk + e.yuk) / 2 + 1 > Math.abs(o.y - e.y))
  })
  etiketler.length = 0
  etiketler.push(...kalan)
  etiketleriAyir(etiketler, [...engeller, ...noktaEngelleri])

  const egriAdlari = (g.egriler ?? []).map((e) => e.ad).filter(Boolean)
  const noktaAdlari = (g.noktalar ?? []).map((n) => n.ad).filter(Boolean)
  const aciklama = [
    cubuk ? 'Sütun grafiği' : 'Koordinat düzleminde grafik',
    egriAdlari.length ? `eğriler: ${egriAdlari.join(', ')}` : '',
    noktaAdlari.length ? `işaretli noktalar: ${noktaAdlari.join(', ')}` : '',
    (g.etiketler ?? []).length ? `yazılar: ${(g.etiketler ?? []).map((t) => t.ad).join(', ')}` : '',
  ].filter(Boolean).join('; ')

  return { cizimYuk, ...sahneyiKapat(
    {
      kirpma: { x: -2, y: -2, gen: yuvarla(cizimGen + 4), yuk: yuvarla(cizimYuk + 4) },
      izgara: izgara || undefined,
      eksen,
      eksenOklari,
      centikler: centikler || undefined,
      yollar,
      okUclari,
      cemberler,
      noktalar,
      etiketler: [],
      aciklama,
    },
    sinir,
    etiketler,
  ) }
}

/** Noktanın çevresindeki sekiz adaydan çizgilere ve yazılara en az değeni seçer. */
function adayaKoy(e: IcEtiket, p: Nokta, engeller: Parca[], yerlesmis: IcEtiket[], gen: number, yuk: number) {
  const yonler = [-Math.PI / 4, (-3 * Math.PI) / 4, Math.PI / 4, (3 * Math.PI) / 4, 0, Math.PI, -Math.PI / 2, Math.PI / 2]
  let enIyi = { x: p.x, y: p.y, puan: Infinity }
  yonler.forEach((a, i) => {
    const y = yon(a)
    const d = 5 + kutuDestek(e.gen, e.yuk, y)
    const k = { x: p.x + y.x * d, y: p.y + y.y * d, gen: e.gen, yuk: e.yuk }
    let puan = i * 0.1
    for (const s of engeller) if (kutuParcaKesisir(k, s, 2)) puan += 3
    for (const o of yerlesmis) if ((o.gen + k.gen) / 2 + 2 > Math.abs(o.x - k.x) && (o.yuk + k.yuk) / 2 + 2 > Math.abs(o.y - k.y)) puan += 4
    if (k.x - k.gen / 2 < -20 || k.x + k.gen / 2 > gen + 20 || k.y - k.yuk / 2 < -20 || k.y + k.yuk / 2 > yuk + 20) puan += 1
    if (puan < enIyi.puan) enIyi = { x: k.x, y: k.y, puan }
  })
  e.x = e.hx = enIyi.x
  e.y = e.hy = enIyi.y
}

/** Görsel eksenli grafik mi (ya da eksen adlı sütun grafiği) yoksa geometri şekli mi. */
export function grafikMi(g: KoordinatGorseli): boolean {
  if (g.eksenler !== false) return true
  return !!(g.xAd || g.yAd) && cubukMu(g)
}

export function koordinatSahnesi(g: KoordinatGorseli): Sahne {
  return grafikMi(g) ? grafikSahnesi(g) : geometriSahnesi(g)
}

// ── Sayı doğrusu ─────────────────────────────────────────────────────────────

/**
 * Sayı doğrusu işaretlerinden yazısı sığanlar: aralık uçları her zaman
 * yazılır, ötekiler komşusuyla çakışıyorsa atlanır.
 */
export function sayiDogrusuYazilari(isaretler: number[], konum: (v: number) => number, zorunlu: number[], boy = YAZI_BOYU.sayi + 1): number[] {
  const sirali = [...new Set(isaretler)].sort((a, b) => a - b)
  const genislik = (v: number) => yaziDuzeni(sayiYaz(v), boy).gen
  const secilen: number[] = []
  const cakisir = (a: number, b: number) => Math.abs(konum(a) - konum(b)) < (genislik(a) + genislik(b)) / 2 + 5
  for (const v of sirali) if (zorunlu.some((z) => Math.abs(z - v) < 1e-9)) secilen.push(v)
  for (const v of sirali) {
    if (secilen.includes(v)) continue
    if (secilen.some((s) => cakisir(s, v))) continue
    secilen.push(v)
  }
  return secilen.sort((a, b) => a - b)
}
