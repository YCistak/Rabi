/**
 * Öğrencinin gününü sesli anlattığı metni Soru Takibi ve Deneme verilerine
 * ayırır — saf mantık, cihaz ya da arayüz bağımlılığı yok.
 *
 * Belirsiz veya kural dışı hiçbir parça tahminle tamamlanmaz; düşürülüp ham
 * hâliyle `anlasilmayan` listesine konur ki kullanıcı ekranda görüp düzeltsin.
 */

import { anahtarlar, ESANLAMLI, type OkunanDers, sozSiniriMi } from './deneme-okuma'
import { CALISMA_DERSLERI } from './dersler'
import { sadelestir } from './metin'
import type { Sablon, SablonDers, SablonTuru } from './types'

export type { OkunanDers }
export type SesliSoru = { ders: string; toplam: number; dogru: number; yanlis: number }
export type SesliDeneme = { sablonId: string; dersler: OkunanDers[]; toplamNet: number | null }
export type SesliCozum = { sorular: SesliSoru[]; deneme: SesliDeneme | null; anlasilmayan: string[] }

const EN_COK_SORU = 500

/** Yerli konuşma tanıyıcıya bağlam ipucu olarak verilen sözcükler. */
export const TANIMA_IPUCLARI: string[] = [
  'TYT',
  'AYT',
  'YDT',
  'Rabi',
  'net',
  'doğru',
  'yanlış',
  'boş',
  'deneme',
  ...CALISMA_DERSLERI,
  'Geometri',
  'Paragraf',
  'Edebiyat',
]

// --- Telefonun yanlış duyduğu özel sözcükleri düzeltme ---

const TURKCE_HARF_RAKAM = /[a-zA-ZçğıöşüÇĞİÖŞÜâÂ0-9\u0307]/
const RABI_ADLARI = new Set(['rabi', 'rabbi', 'arabi', 'rabia', 'ravi', 'rabiye'])
const SINAV_BITISIK_EKLERI = new Set([
  'de', 'da', 'te', 'ta', 'den', 'dan', 'ten', 'tan',
  'ye', 'ya', 'yi', 'yı', 'nin', 'nın', 'nde', 'nda', 'nden', 'ndan', 'yle', 'yla',
])
const SINAV_COKLU_BITISIK_EKLERI = new Set(['de', 'da', 'den', 'dan'])

type SinavDuzeltmeKurali = {
  parcalar: readonly string[]
  hedef: 'TYT' | 'AYT' | 'YDT'
  buyukHarfZorunlu?: boolean
  ardindanDenemeZorunlu?: boolean
}

const SINAV_DUZELTME_KURALLARI: readonly SinavDuzeltmeKurali[] = [
  { parcalar: ['te', 'ye', 'te'], hedef: 'TYT' },
  { parcalar: ['t', 'y', 't'], hedef: 'TYT' },
  { parcalar: ['te', 'te'], hedef: 'TYT' },
  { parcalar: ['ti', 'ti'], hedef: 'TYT' },
  { parcalar: ['t', 't'], hedef: 'TYT' },
  { parcalar: ['teyete'], hedef: 'TYT' },
  { parcalar: ['teyte'], hedef: 'TYT' },
  { parcalar: ['tiyti'], hedef: 'TYT' },
  { parcalar: ['tete'], hedef: 'TYT' },
  { parcalar: ['titi'], hedef: 'TYT' },
  { parcalar: ['ttt'], hedef: 'TYT' },
  { parcalar: ['tyt'], hedef: 'TYT' },
  { parcalar: ['tt'], hedef: 'TYT' },
  { parcalar: ['tit'], hedef: 'TYT', ardindanDenemeZorunlu: true },
  { parcalar: ['a', 'ye', 'te'], hedef: 'AYT' },
  { parcalar: ['a', 'y', 't'], hedef: 'AYT' },
  { parcalar: ['ay', 'te'], hedef: 'AYT' },
  { parcalar: ['a', 'te'], hedef: 'AYT' },
  { parcalar: ['ayyte'], hedef: 'AYT' },
  { parcalar: ['ayte'], hedef: 'AYT' },
  { parcalar: ['eyte'], hedef: 'AYT' },
  { parcalar: ['ayt'], hedef: 'AYT' },
  { parcalar: ['AT'], hedef: 'AYT', buyukHarfZorunlu: true },
  { parcalar: ['ye', 'de', 'te'], hedef: 'YDT' },
  { parcalar: ['yde', 'te'], hedef: 'YDT' },
  { parcalar: ['y', 'd', 't'], hedef: 'YDT' },
  { parcalar: ['yedete'], hedef: 'YDT' },
  { parcalar: ['ydt'], hedef: 'YDT' },
]

/** `sozSiniriMi`nin Türkçe büyük/küçük harfleri de kapsayan karşılığı. */
function turkceSozSiniriMi(metin: string, bas: number, uzunluk: number): boolean {
  const onceki = metin[bas - 1]
  const sonraki = metin[bas + uzunluk]
  if (onceki !== undefined && TURKCE_HARF_RAKAM.test(onceki)) return false
  if (sonraki !== undefined && TURKCE_HARF_RAKAM.test(sonraki)) return false
  return true
}

/** Cümle başındaki ya da virgül/ünlemle ayrılmış "Rabi" hitaplarını siler. */
function rabiHitabiniSil(metin: string): string {
  const silinecekler: { bas: number; son: number }[] = []
  for (const es of metin.matchAll(/[a-zA-ZçğıöşüÇĞİÖŞÜâÂ0-9\u0307]+/g)) {
    const bas = es.index ?? 0
    const ham = es[0]
    const son = bas + ham.length
    if (!turkceSozSiniriMi(metin, bas, ham.length)) continue
    const kucuk = ham.toLocaleLowerCase('tr-TR').replace(/\u0307/g, '')
    if (!RABI_ADLARI.has(kucuk)) continue
    if (bas >= 2 && /['’`]/.test(metin[bas - 1]!) && TURKCE_HARF_RAKAM.test(metin[bas - 2]!)) continue
    if (/^['’`]/.test(metin.slice(son))) continue

    const sol = metin.slice(0, bas)
    const sag = metin.slice(son)
    const metinBasiMi = /^[\s,!]*$/.test(sol)
    const cumleBasiMi = metinBasiMi || /[.!?\n]\s*$/.test(sol)
    const soldaVirgulUnlem = /[,!]+\s*$/.exec(sol)
    const sagdaVirgulUnlem = /^\s*[,!]+/.exec(sag)
    if (!cumleBasiMi && !soldaVirgulUnlem && !sagdaVirgulUnlem) continue

    let silBas = bas
    let silSon = son
    if (metinBasiMi) {
      silBas = 0
      const sagEk = /^\s*[,!]*\s*/.exec(sag)
      if (sagEk) silSon = son + sagEk[0].length
    } else if (cumleBasiMi) {
      const sagEk = /^\s*[,!]*\s*/.exec(sag)
      if (sagEk) silSon = son + sagEk[0].length
    } else if (soldaVirgulUnlem && sagdaVirgulUnlem) {
      const sagKalan = sag.slice(sagdaVirgulUnlem[0].length)
      if (/^\s*$/.test(sagKalan) || /^\s*[.!?\n]/.test(sagKalan)) {
        const solTam = /\s*[,!]+\s*$/.exec(sol)!
        silBas = bas - solTam[0].length
        silSon = son + sagdaVirgulUnlem[0].length
      } else {
        const solBosluk = /[ \t]*$/.exec(sol)!
        silBas = bas - solBosluk[0].length
        silSon = son + sagdaVirgulUnlem[0].length
      }
    } else if (soldaVirgulUnlem) {
      const solTam = /\s*[,!]+\s*$/.exec(sol)!
      silBas = bas - solTam[0].length
    } else if (sagdaVirgulUnlem) {
      const solBosluk = /[ \t]*$/.exec(sol)!
      silBas = bas - solBosluk[0].length
      silSon = son + sagdaVirgulUnlem[0].length
    }
    silinecekler.push({ bas: silBas, son: silSon })
  }
  if (silinecekler.length === 0) return metin

  let sonuc = ''
  let imlec = 0
  for (const a of silinecekler) {
    const b = Math.max(imlec, a.bas)
    if (b > imlec) sonuc += metin.slice(imlec, b)
    imlec = Math.max(imlec, a.son)
  }
  if (imlec < metin.length) sonuc += metin.slice(imlec)
  return sonuc.replace(/[ \t]{2,}/g, ' ').trim()
}

/**
 * Konuşma tanımanın TYT/AYT/YDT ve Rabi için sık ürettiği yanlış duyma
 * biçimlerini çekim eklerini koruyarak düzeltir.
 */
export function duyulaniDuzelt(metin: string): string {
  const temiz = rabiHitabiniSil(metin.normalize('NFC'))
  if (!temiz) return ''

  const kelimeler = [...temiz.matchAll(/[a-zA-ZçğıöşüÇĞİÖŞÜâÂ0-9]+/g)].map((es) => {
    const bas = es.index ?? 0
    const ham = es[0]
    return { ham, kucuk: ham.toLocaleLowerCase('tr-TR'), bas, son: bas + ham.length }
  })
  if (kelimeler.length === 0) return temiz

  const aradakiBoslukMu = (solSon: number, sagBas: number) => /^[ \t]+$/.test(temiz.slice(solSon, sagBas))
  const degisimler: { bas: number; son: number; yeni: string }[] = []

  for (let i = 0; i < kelimeler.length; i++) {
    const ilk = kelimeler[i]!
    if (!turkceSozSiniriMi(temiz, ilk.bas, ilk.ham.length)) continue
    if (ilk.bas >= 2 && /['’`]/.test(temiz[ilk.bas - 1]!) && TURKCE_HARF_RAKAM.test(temiz[ilk.bas - 2]!)) continue

    for (const kural of SINAV_DUZELTME_KURALLARI) {
      const n = kural.parcalar.length
      if (i + n > kelimeler.length) continue

      let uydu = true
      for (let j = 0; j < n - 1; j++) {
        const k = kelimeler[i + j]!
        const s = kelimeler[i + j + 1]!
        if (k.kucuk !== kural.parcalar[j] || !aradakiBoslukMu(k.son, s.bas)) {
          uydu = false
          break
        }
      }
      if (!uydu) continue

      const sonKelime = kelimeler[i + n - 1]!
      if (!turkceSozSiniriMi(temiz, sonKelime.bas, sonKelime.ham.length)) continue
      const sonBeklenen = kural.parcalar[n - 1]!

      let yeniMetin: string | null = null
      if (kural.buyukHarfZorunlu) {
        if (sonKelime.ham === sonBeklenen) yeniMetin = kural.hedef
      } else if (sonKelime.kucuk === sonBeklenen) {
        if (kural.ardindanDenemeZorunlu) {
          const sonraki = kelimeler[i + n]
          if (sonraki && aradakiBoslukMu(sonKelime.son, sonraki.bas) && /^deneme/.test(sadelestir(sonraki.ham))) {
            yeniMetin = kural.hedef
          }
        } else {
          yeniMetin = kural.hedef
        }
      } else if (!kural.ardindanDenemeZorunlu && sonKelime.kucuk.startsWith(sonBeklenen)) {
        const ekKucuk = sonKelime.kucuk.slice(sonBeklenen.length)
        const ekIzni = n === 1 ? SINAV_BITISIK_EKLERI : SINAV_COKLU_BITISIK_EKLERI
        if (ekIzni.has(ekKucuk)) {
          const ekHam = sonKelime.ham.slice(sonBeklenen.length)
          yeniMetin = `${kural.hedef}'${ekHam}`
        }
      }

      if (yeniMetin !== null) {
        degisimler.push({ bas: ilk.bas, son: sonKelime.son, yeni: yeniMetin })
        i += n - 1
        break
      }
    }
  }

  if (degisimler.length === 0) return temiz
  let sonuc = ''
  let imlec = 0
  for (const d of degisimler) {
    sonuc += temiz.slice(imlec, d.bas) + d.yeni
    imlec = d.son
  }
  return sonuc + temiz.slice(imlec)
}

// --- Yazıyla söylenen sayıları rakama çevirme ---

/** "ön hazırlık"taki "ön" sadeleşince "on" (10) sanılmasın diye Türkçe ünlüleri korur. */
function turkceKucult(kelime: string): string {
  return kelime.toLocaleLowerCase('tr-TR').replace(/â/g, 'a').replace(/\u0307/g, '')
}

const BIRLER: Record<string, number> = {
  bir: 1, iki: 2, üç: 3, uc: 3, dört: 4, dort: 4, beş: 5, bes: 5, altı: 6, alti: 6, yedi: 7, sekiz: 8, dokuz: 9,
}
const ONLAR: Record<string, number> = {
  on: 10, yirmi: 20, otuz: 30, kırk: 40, kirk: 40, elli: 50,
  altmış: 60, altmis: 60, yetmiş: 70, yetmis: 70, seksen: 80, doksan: 90,
}
const SON_EKLI_SAYILAR: Record<string, readonly [number, string]> = {
  birer: [1, "'er"], ikişer: [2, "'şer"], ikiser: [2, "'şer"], üçer: [3, "'er"], ucer: [3, "'er"],
  dörder: [4, "'er"], dorder: [4, "'er"], beşer: [5, "'er"], beser: [5, "'er"],
  altışar: [6, "'şar"], altisar: [6, "'şar"], yedişer: [7, "'şer"], yediser: [7, "'şer"],
  sekizer: [8, "'er"], dokuzar: [9, "'ar"], onar: [10, "'ar"],
  yirmişer: [20, "'şer"], yirmiser: [20, "'şer"], otuzar: [30, "'ar"],
  kırkar: [40, "'ar"], kirkar: [40, "'ar"], ellişer: [50, "'şer"], elliser: [50, "'şer"],
  altmışar: [60, "'ar"], altmisar: [60, "'ar"], yetmişer: [70, "'er"], yetmiser: [70, "'er"],
  seksener: [80, "'er"], doksanar: [90, "'ar"], yüzer: [100, "'er"], yuzer: [100, "'er"],
  biri: [1, "'i"], ikisi: [2, "'si"], üçü: [3, "'ü"], dördü: [4, "'ü"], beşi: [5, "'i"],
  altısı: [6, "'sı"], yedisi: [7, "'si"], sekizi: [8, "'i"], dokuzu: [9, "'u"],
  yirmisi: [20, "'si"], otuzu: [30, "'u"], kırkı: [40, "'ı"], kirki: [40, "'ı"],
  ellisi: [50, "'si"], altmışı: [60, "'ı"], altmisi: [60, "'ı"], yetmişi: [70, "'i"], yetmisi: [70, "'i"],
  sekseni: [80, "'i"], doksanı: [90, "'ı"], doksani: [90, "'ı"], yüzü: [100, "'ü"], yuzu: [100, "'ü"],
  birini: [1, "'ini"], ikisini: [2, "'sini"], üçünü: [3, "'ünü"], ucunu: [3, "'ünü"],
  dördünü: [4, "'ünü"], dordunu: [4, "'ünü"], beşini: [5, "'ini"], besini: [5, "'ini"],
  altısını: [6, "'sını"], altisini: [6, "'sını"], yedisini: [7, "'sini"], sekizini: [8, "'ini"],
  dokuzunu: [9, "'unu"], onunu: [10, "'unu"], yirmisini: [20, "'sini"], otuzunu: [30, "'unu"],
  kırkını: [40, "'ını"], kirkini: [40, "'ını"], ellisini: [50, "'sini"],
  altmışını: [60, "'ını"], altmisini: [60, "'ını"], yetmişini: [70, "'ini"], yetmisini: [70, "'ini"],
  seksenini: [80, "'ini"], doksanını: [90, "'ını"], doksanini: [90, "'ını"], yüzünü: [100, "'ünü"], yuzunu: [100, "'ünü"],
}
const BELIRSIZ_BIR_SONRASI = new Set([
  'de', 'da', 'daha', 'çok', 'cok', 'az', 'kaç', 'kac', 'şey', 'sey', 'sürü', 'suru', 'kısım', 'kisim',
  'türlü', 'turlu', 'ara', 'arada', 'kere', 'kez', 'defa', 'tyt', 'ayt', 'ydt', 'seviye', 'okul', 'sınav', 'sinav',
])

type Kelime = { ham: string; kucuk: string; bas: number; son: number }

/** Basamak sırasını (bin → yüz → onlar → birler) koruyarak "otuz beş üç"ü 38 yapmadan okur. */
function yaziliSayiOku(kelimeler: Kelime[], basIndeks: number, metin: string): { metin: string; sonIndeks: number } | null {
  const ilk = kelimeler[basIndeks]
  if (!ilk) return null
  if (ilk.kucuk === 'sıfır' || ilk.kucuk === 'sifir') return { metin: '0', sonIndeks: basIndeks }

  let imlec = basIndeks
  let toplam = 0
  let sonEk = ''

  const yuzMu = (s: string) => s === 'yüz' || s === 'yuz'
  const yanYana = (a: Kelime, b?: Kelime): b is Kelime => b !== undefined && /^[ \t]+$/.test(metin.slice(a.son, b.bas))
  const acik = () => sonEk === '' && imlec < kelimeler.length && (imlec === basIndeks || yanYana(kelimeler[imlec - 1]!, kelimeler[imlec]))
  const ardindanSonucEtiketiVarMi = (indeks: number): boolean => {
    const s1 = kelimeler[indeks + 1]
    if (!s1 || !yanYana(kelimeler[indeks]!, s1)) return false
    const hedef = (s1.kucuk === 'de' || s1.kucuk === 'da') && yanYana(s1, kelimeler[indeks + 2]) ? kelimeler[indeks + 2]! : s1
    return /^(?:dogru|yanlis|bos)/.test(sadelestir(hedef.ham))
  }
  const ekliOku = (alt: number, ust: number) => {
    const k = kelimeler[imlec]!.kucuk
    const ekli = SON_EKLI_SAYILAR[k]
    if (
      !ekli ||
      ekli[0] < alt ||
      ekli[0] > ust ||
      ((k === 'biri' || k === 'birini' || k === 'ikisi') && imlec === basIndeks && !ardindanSonucEtiketiVarMi(imlec))
    ) {
      return
    }
    toplam += ekli[0]
    sonEk = ekli[1]
    imlec += 1
  }
  const carpanOku = (eslesir: (s: string) => boolean, deger: number, ekliIzni: boolean) => {
    const k = kelimeler[imlec]!
    const c = BIRLER[k.kucuk]
    const s = kelimeler[imlec + 1]
    const ekli = ekliIzni && s ? SON_EKLI_SAYILAR[s.kucuk] : undefined
    if (c && yanYana(k, s) && (eslesir(s.kucuk) || ekli?.[0] === deger)) {
      toplam += c * deger
      if (ekli?.[0] === deger) sonEk = ekli[1]
      imlec += 2
    } else if (eslesir(k.kucuk)) {
      toplam += deger
      imlec += 1
    } else if (ekliIzni) ekliOku(deger, deger)
  }
  const basamakOku = (tablo: Record<string, number>, alt: number, ust: number) => {
    const deger = tablo[kelimeler[imlec]!.kucuk]
    if (deger !== undefined) {
      toplam += deger
      imlec += 1
    } else ekliOku(alt, ust)
  }

  if (acik()) carpanOku((s) => s === 'bin', 1000, false)
  if (acik()) carpanOku(yuzMu, 100, true)
  if (acik()) basamakOku(ONLAR, 10, 90)
  if (acik()) {
    const k = kelimeler[imlec]!
    const s = kelimeler[imlec + 1]
    const yeniCarpan = imlec > basIndeks && yanYana(k, s) && (yuzMu(s.kucuk) || s.kucuk === 'bin' || SON_EKLI_SAYILAR[s.kucuk]?.[0] === 100)
    if (!yeniCarpan) basamakOku(BIRLER, 1, 9)
  }

  if (imlec === basIndeks) return null
  const s = kelimeler[basIndeks + 1]
  if (imlec === basIndeks + 1 && ilk.kucuk === 'bir' && yanYana(ilk, s) && (BELIRSIZ_BIR_SONRASI.has(s.kucuk) || /^deneme/.test(sadelestir(s.ham)))) {
    return null
  }
  return { metin: `${toplam}${sonEk}`, sonIndeks: imlec - 1 }
}

type DonusumParcasi = { cikti: string; hamBas: number; hamSon: number; degisti: boolean }

/** Sayıları çevirirken ham metin aralıklarını saklar ki `anlasilmayan` ham dilimi gösterebilsin. */
function rakamaCevirParcali(metin: string): { metin: string; parcalar: DonusumParcasi[] } {
  const kelimeler = [...metin.matchAll(/[a-zA-ZçğıöşüÇĞİÖŞÜâÂ0-9]+/g)].map((es) => {
    const bas = es.index ?? 0
    return { ham: es[0], kucuk: turkceKucult(es[0]), bas, son: bas + es[0].length }
  })
  const parcalar: DonusumParcasi[] = []
  let imlec = 0
  for (let i = 0; i < kelimeler.length; i++) {
    const okunan = yaziliSayiOku(kelimeler, i, metin)
    if (!okunan) continue
    const { bas } = kelimeler[i]!
    const { son } = kelimeler[okunan.sonIndeks]!
    if (bas > imlec) parcalar.push({ cikti: metin.slice(imlec, bas), hamBas: imlec, hamSon: bas, degisti: false })
    parcalar.push({ cikti: okunan.metin, hamBas: bas, hamSon: son, degisti: true })
    imlec = son
    i = okunan.sonIndeks
  }
  if (imlec < metin.length) parcalar.push({ cikti: metin.slice(imlec), hamBas: imlec, hamSon: metin.length, degisti: false })
  return { metin: parcalar.map((p) => p.cikti).join(''), parcalar }
}

/** Yazıyla söylenmiş Türkçe sayıları rakama çevirir; geri kalan metne dokunmaz. */
export function sayilariRakamaCevir(metin: string): string {
  return rakamaCevirParcali(metin).metin
}

// --- Ham metin konumlarını koruyan sadeleştirme ---

type HazirMetin = { norm: string; hamKesit: (bas: number, son: number) => string }

/** Sadeleştirilmiş metindeki her karakteri ham metindeki konumuna bağlar. */
function metniHazirla(hamMetin: string): HazirMetin {
  const izler: { harf: string; bas: number; son: number }[] = []
  const ekle = (ch: string, bas: number, son: number) => {
    if (ch === ' ') {
      const sonIz = izler[izler.length - 1]
      if (!sonIz) return
      if (sonIz.harf === ' ') {
        sonIz.son = son
        return
      }
    }
    for (const harf of ch) izler.push({ harf, bas, son })
  }

  for (const p of rakamaCevirParcali(hamMetin).parcalar) {
    for (let i = 0; i < p.cikti.length; i++) {
      const bas = p.degisti ? p.hamBas : p.hamBas + i
      const son = p.degisti ? p.hamSon : p.hamBas + i + 1
      const c = p.cikti[i]!
      if (c === '\u0307') continue
      const sade = /\s/.test(c) ? ' ' : c === '’' || c === '‘' || c === '`' ? "'" : sadelestir(c).replace(/\u0307/g, '')
      if (sade) ekle(sade, bas, son)
    }
  }
  while (izler[izler.length - 1]?.harf === ' ') izler.pop()

  const norm = izler.map((x) => x.harf).join('')
  const hamKesit = (bas: number, son: number): string => {
    if (!norm || bas >= son) return ''
    let sol = Math.max(0, Math.min(bas, norm.length - 1))
    let sag = Math.max(sol, Math.min(son - 1, norm.length - 1))
    while (sol < sag && norm[sol] === ' ') sol += 1
    while (sag > sol && norm[sag] === ' ') sag -= 1
    return hamMetin.slice(izler[sol]!.bas, izler[sag]!.son).replace(/^[\s,;.!?:–—-]+|[\s,;.!?:–—-]+$/g, '').trim()
  }
  return { norm, hamKesit }
}

// --- Türkçe çekim ekleriyle ders ve grup adı eşleme ---

const CEKIM_EKLERI = new Set([
  'den', 'dan', 'ten', 'tan', 'nden', 'ndan', 'de', 'da', 'te', 'ta', 'nde', 'nda',
  'e', 'a', 'ye', 'ya', 'ne', 'na', 'i', 'u', 'yi', 'yu', 'si', 'su', 'ni', 'nu',
  'in', 'un', 'nin', 'nun', 'le', 'la', 'yle', 'yla', 'm', 'im', 'um',
])
const YUMUSAMA_EKLERI = new Set(['e', 'a', 'i', 'u', 'in', 'un', 'im', 'um'])
const KISA_KOKLER = new Set(['din', 'dil', 'fen'])
const KISA_INCE_EKLER = new Set(['den', 'de', 'e', 'i', 'in'])
const KISALTMALAR = new Set([
  'turk', 'mat', 'mat1', 'mat2', 'edb', 'tdb', 'tde', 'trh', 'tar', 'cog', 'fel', 'fels',
  'dkab', 'fzk', 'fiz', 'kmy', 'kim', 'byl', 'biy', 'ing', 'yds', 'ydt', 'geo', 'sos', 'psi', 'psik',
])
// "Geodan" ve "coğdan" gibi ek alan yerleşik kısaltmalar, sözcük sınırı
// korunduğu için başka kelimelerin içinde ders diye okunmaz.
const EK_ALABILEN_KISALTMALAR = new Set(['geo', 'cog'])
const YUMUSAYAN_KOKLER: Record<string, readonly string[]> = { matematik: ['matematig', 'temel matematig'], fizik: ['fizig'], mantik: ['mantig'] }

type AnahtarTanimi = { metin: string; yumusamis: boolean; ekAlabilir: boolean }
type DersHedefi<T> = { hedef: T; kimlik: string; anahtarlar: readonly AnahtarTanimi[] }
type DersBulgu<T> = { hedef: T | null; bas: number; son: number }

/** Kök adlara ek alma izni ve ünsüz yumuşaması biçimlerini ekleyerek arama anahtarları üretir. */
function anahtarlariGenislet(metinler: Iterable<string>): AnahtarTanimi[] {
  const kur = (metin: string, yumusamis: boolean): AnahtarTanimi => ({
    metin,
    yumusamis,
    ekAlabilir: yumusamis || (EK_ALABILEN_KISALTMALAR.has(metin) || (!KISALTMALAR.has(metin) && (metin.length >= 4 || KISA_KOKLER.has(metin)))),
  })
  const sonuc: AnahtarTanimi[] = []
  for (const metin of metinler) {
    if (metin.length < 3) continue
    sonuc.push(kur(metin, false))
    for (const y of YUMUSAYAN_KOKLER[metin] ?? []) sonuc.push(kur(y, true))
  }
  return sonuc
}

/** Eşleşen ders kelimesinin çekim eki dahil bitiş dizinini döner; geçersizse -1. */
function dersEslesmeSonu(satir: string, bas: number, anahtar: AnahtarTanimi): number {
  const kokSon = bas + anahtar.metin.length
  if (!anahtar.yumusamis && sozSiniriMi(satir, bas, anahtar.metin.length)) {
    if (satir[kokSon] === "'") {
      let ekSon = kokSon + 1
      while (ekSon < satir.length && /[a-z0-9]/.test(satir[ekSon]!)) ekSon += 1
      if (CEKIM_EKLERI.has(satir.slice(kokSon + 1, ekSon)) && sozSiniriMi(satir, bas, ekSon - bas)) return ekSon
    }
    return kokSon
  }
  if (!anahtar.ekAlabilir) return -1
  let kelimeSon = kokSon
  while (kelimeSon < satir.length && /[a-z0-9]/.test(satir[kelimeSon]!)) kelimeSon += 1
  if (kelimeSon === kokSon || !sozSiniriMi(satir, bas, kelimeSon - bas)) return -1

  const ek = satir.slice(kokSon, kelimeSon)
  if (anahtar.yumusamis) return YUMUSAMA_EKLERI.has(ek) ? kelimeSon : -1
  return (KISA_KOKLER.has(anahtar.metin) ? KISA_INCE_EKLER : CEKIM_EKLERI).has(ek) ? kelimeSon : -1
}

/** "yabancı dil denemesi" ya da "ydt denemesi"ndeki sınav adı ders kaydı sanılmasın. */
function denemeAdiOnuMu(metin: string, son: number): boolean {
  return /^\s+(?:dil\s+)?deneme(?:si|sinde|sinden|de|den|ye|yi|nin|ler)?(?![a-z0-9])/.test(metin.slice(son))
}

const SORU_DERS_EK_ADLARI: Record<string, readonly [readonly string[], readonly string[]]> = {
  Türkçe: [['turkce', 'edebiyat'], ['turk dili ve edebiyati', 'paragraf', 'dil bilgisi', 'dilbilgisi']],
  Matematik: [['matematik'], ['geometri', 'geo', 'mat1', 'mat2', 'problem']],
  Tarih: [['tarih', 'tarih1', 'tarih2'], ['inkilap tarihi', 'inkilap']],
  Coğrafya: [['cografya', 'cografya1', 'cografya2'], []],
  'Yabancı Dil': [['ingilizce'], ['yabanci dil', 'almanca', 'fransizca', 'arapca', 'rusca', 'dil']],
  Felsefe: [['felsefe'], ['felsefe grubu', 'sosyoloji', 'sos', 'psikoloji', 'psi', 'psik', 'mantik']],
  'Din Kültürü': [['din'], ['din kulturu ve ahlak bilgisi']],
}

const SORU_HEDEFLERI: DersHedefi<string>[] = CALISMA_DERSLERI.map((ders) => {
  const sade = sadelestir(ders)
  const [esanlamlilar, ekler] = SORU_DERS_EK_ADLARI[ders] ?? [[sade], []]
  const kume = new Set<string>([sade, ...ekler])
  // Özel ders eşlemelerinde belirtilen adlara ek olarak, dersin kendi kısa ve
  // eş anlamlı biçimlerini de tanır; böylece ek almış "biyoya" gibi doğal
  // söyleyişler ortak çekim eki kuralından geçer.
  for (const id of new Set([sade, ...esanlamlilar])) for (const a of ESANLAMLI[id] ?? []) kume.add(a)
  return { hedef: ders, kimlik: ders, anahtarlar: anahtarlariGenislet(kume) }
})
const SORU_TUM_ANAHTARLAR: AnahtarTanimi[] = SORU_HEDEFLERI.flatMap((h) => h.anahtarlar)
const GRUP_KUMELERI: readonly (readonly string[])[] = [
  ['sosyal', 'sosyal bilimler', 'sosyal bilimleri', 'sosyal bilgiler'],
  ['fen', 'fen bilimleri', 'fen bilgisi'],
]
const GRUP_ANAHTARLARI: AnahtarTanimi[] = anahtarlariGenislet(GRUP_KUMELERI.flat())

/** Uzun eşleşmenin kısayı ezdiği, çakışan veya şablon/liste dışı dersleri `hedef: null` bırakan ortak tarayıcı. */
function dersleriTara<T>(
  metin: string,
  hedefler: readonly DersHedefi<T>[],
  yedekAnahtarlar: readonly AnahtarTanimi[] = [],
  denemeOnuHaric = true,
): DersBulgu<T>[] {
  type Aday = DersBulgu<T> & { kimlik: string | null; oncelik: number; uzunluk: number }
  const adaylar: Aday[] = []
  const ekle = (hedef: T | null, kimlik: string | null, oncelik: number, liste: readonly AnahtarTanimi[]) => {
    for (const anahtar of liste) {
      for (let yer = metin.indexOf(anahtar.metin); yer !== -1; yer = metin.indexOf(anahtar.metin, yer + 1)) {
        const son = dersEslesmeSonu(metin, yer, anahtar)
        if (son !== -1 && (!denemeOnuHaric || !denemeAdiOnuMu(metin, son))) {
          adaylar.push({ hedef, kimlik, oncelik, bas: yer, son, uzunluk: son - yer })
        }
      }
    }
  }
  for (const h of hedefler) ekle(h.hedef, h.kimlik, 0, h.anahtarlar)
  if (yedekAnahtarlar.length > 0) ekle(null, null, 1, yedekAnahtarlar)

  adaylar.sort((a, b) => a.oncelik - b.oncelik || b.uzunluk - a.uzunluk || a.bas - b.bas)
  const bulgular: Aday[] = []
  for (const aday of adaylar) {
    const cakisan = bulgular.find((b) => aday.bas < b.son && b.bas < aday.son)
    if (!cakisan) bulgular.push({ ...aday })
    else if (aday.oncelik === 0 && cakisan.kimlik !== null && cakisan.bas === aday.bas && cakisan.uzunluk === aday.uzunluk && cakisan.kimlik !== aday.kimlik) {
      cakisan.hedef = null
      cakisan.kimlik = null
    }
  }
  return bulgular.sort((a, b) => a.bas - b.bas).map(({ hedef, bas, son }) => ({ hedef, bas, son }))
}

// --- Ortak sayı/etiket okuma ve maskeleme ---

const NET_DESENI =
  /(?<![a-z0-9])(\d+)(?:(?:[.,]|\s*(?:virgul|nokta)\s*)(\d+)|\s+(bucuk))?\s*net[a-z0-9]*(?![a-z0-9])/g
// "ayrıca" bağlacındaki "ay", süre birimi değildir; aksi hâlde önceki
// dersin soru sayısı da bağlaçla birlikte maskelenir.
const SURE_DESENI = /(?<![a-z0-9])\d+(?:[.,]\d+)?(?:\s+bucuk)?\s+(?:saat|dakika|dk|saniye|sn|gun|hafta|ay(?!rica)|yil)\w*(?![a-z0-9])/g
const SIRA_DESENI = /(?<![a-z0-9])\d+\s*(?:\.\s*|(?:inci|nci|uncu|ncu)\s+)(?:sinif|unite|adim|deneme|konu|bolum)\w*(?![a-z0-9])/g
const TEST_SIRA_DESENI = /(?<![a-z0-9])\d+\s*(?:\.\s*|(?:inci|nci|uncu|ncu)\s+)test\w*(?![a-z0-9])/g
const TEST_DESENI = /(?<![a-z0-9])\d+\s+test\w*(?![a-z0-9])/g
const SINIF_DESENI = /(?<![a-z0-9])(?:9|10|11|12)\s+sinif\w*(?![a-z0-9])/g
const REDDEDILEN_TOPLAM_DESENI = /(?<![a-z0-9])toplam\s+\d+\s+degil(?![a-z0-9])/g
const YANLIS_YOK_DESENI = /(?<![a-z0-9])(?:hic\s+yanlis\w*\s+yok|yanlis\w*\s+yok|yanlissiz)(?![a-z0-9])/
const HEPSI_DOGRU_DESENI =
  /(?<![a-z0-9])(?:(?:hepsi(?:ni)?|tamami(?:ni)?|tumu(?:nu)?)(?:\s+d[ea])?\s+dogru\w*|full(?:e\w*)?(?:\s+dogru\w*)?|ful(?:\s+dogru\w*)?)(?![a-z0-9])/
const ON_SAYI_DESENI = /(\d+(?:\s*'?\s*(?:ser|sar|er|ar))?)\s*(?:d[ea]\s+)?$/

/** Eşleşen ilgisiz ifadeleri aynı uzunlukta boşlukla siler ki ham metin dizinleri kaymasın. */
function bosluklaMaskele(metin: string, desen: RegExp, onEslesme?: (es: RegExpExecArray) => void): string {
  let temiz = metin
  for (const es of metin.matchAll(new RegExp(desen.source, 'g'))) {
    onEslesme?.(es as unknown as RegExpExecArray)
    const yer = es.index ?? 0
    temiz = temiz.slice(0, yer) + ' '.repeat(es[0].length) + temiz.slice(yer + es[0].length)
  }
  return temiz
}

/** Net ifadelerini ayıklar ve ders doğru/yanlış sayılarına karışmaması için maskeler. */
function netAyiklaVeMaskele(metin: string): { temizMetin: string; net: number | null } {
  let net: number | null = null
  const temizMetin = bosluklaMaskele(metin, NET_DESENI, (es) => {
    const deger = es[2] !== undefined ? Number(`${es[1]}.${es[2]}`) : es[3] ? Number(es[1]) + 0.5 : Number(es[1])
    if (net === null && Number.isFinite(deger) && deger >= 0 && deger <= EN_COK_SORU) net = deger
  })
  return { temizMetin, net }
}

type SayiMaskeTuru = 'net' | 'sure' | 'sira' | 'test' | 'sinif' | 'reddedilen-toplam'
type SayiMaskesi = { tur: SayiMaskeTuru; bas: number; son: number; anlasilmayanMi: boolean }

/** Soru sayısı olmayan sayıların neden gizlendiğini, sonradan kullanıcıya açıklanacakları ayırmak için saklar. */
function soruDisiSayilariAyir(kesit: string): { temizMetin: string; maskeler: SayiMaskesi[] } {
  const maskeler: SayiMaskesi[] = []
  const maskele = (metin: string, desen: RegExp, tur: SayiMaskeTuru, anlasilmayanMi: boolean) =>
    bosluklaMaskele(metin, desen, (es) => {
      const bas = es.index ?? 0
      maskeler.push({ tur, bas, son: bas + es[0].length, anlasilmayanMi })
    })

  let temizMetin = maskele(kesit, NET_DESENI, 'net', false)
  temizMetin = maskele(temizMetin, SURE_DESENI, 'sure', true)
  temizMetin = maskele(temizMetin, SIRA_DESENI, 'sira', false)
  temizMetin = maskele(temizMetin, TEST_SIRA_DESENI, 'test', true)
  temizMetin = maskele(temizMetin, TEST_DESENI, 'test', true)
  temizMetin = maskele(temizMetin, SINIF_DESENI, 'sinif', false)
  // Öğrenci "toplam 40 değil, ayrı ayrı 20" dediğinde reddettiği toplamı
  // kayda geçirmek yerine, açıkça söylediği dağıtımı kullanıyoruz.
  temizMetin = maskele(temizMetin, REDDEDILEN_TOPLAM_DESENI, 'reddedilen-toplam', false)
  return { temizMetin, maskeler }
}

/** Sayı dışı bağlamı yalnızca çözümleme yapan çağrılar için maskeler. */
function soruDisiSayilariMaskele(kesit: string): string {
  return soruDisiSayilariAyir(kesit).temizMetin
}

type SayiOgesi = {
  tur: 'toplam' | 'ulestirme' | 'dogru' | 'yanlis' | 'bos' | 'hepsi-dogru' | 'kalan-dogru' | 'kalan-yanlis' | 'kalan-bos'
  deger: number
  bas: number
  son: number
  toplamEtiketli: boolean
}

const IYELIK_EK_DESENI = "(?:\\s*'?\\s*(?:sini|sunu|sını|sünü|sinda|sinde|sunda|sunde|sında|sünde|ini|unu|ını|ünü|inda|inde|unda|unde|ında|ünde|si|su|sı|sü|i|u|ı|ü))"
const TANE_EK_DESENI = '(?:\\s+tane(?:si(?:ni|nde|nden)?|de|den)?)'
const SAYI_ARA_EK_DESENI = `(?:${IYELIK_EK_DESENI}|${TANE_EK_DESENI})`
// Konuşmada "10 tanesi ise boş"taki "ise" sonuç etiketinden önce girer.
// Bu bağlaç sayı ile sonucu değiştirmez; etiketi ayırmak için yok sayılır.
const SONUC_BAGLACI_DESENI = '(?:\\s+ise)?'
const KALAN_SONUC_DESENI = /(?<![a-z0-9])(?:geri\s+)?kalan(?:i|lari)?\s+(?:ise\s+)?(dogru|yanlis|bos)\w*(?![a-z0-9])/g
const SAYI_SON_ETIKETLERI: readonly { tur: SayiOgesi['tur']; desen: RegExp }[] = [
  { tur: 'ulestirme', desen: /^\s*'?\s*(?:ser|sar|er|ar)(?![a-z0-9])/ },
  { tur: 'dogru', desen: new RegExp(`^${SAYI_ARA_EK_DESENI}?${SONUC_BAGLACI_DESENI}(?:\\s+d[ea])?\\s*dogru\\w*|^${IYELIK_EK_DESENI}?\\s*d(?![a-z0-9])`) },
  { tur: 'yanlis', desen: new RegExp(`^${SAYI_ARA_EK_DESENI}?${SONUC_BAGLACI_DESENI}(?:\\s+d[ea])?\\s*yanlis\\w*|^${IYELIK_EK_DESENI}?\\s*y(?![a-z0-9])`) },
  { tur: 'bos', desen: new RegExp(`^${SAYI_ARA_EK_DESENI}?${SONUC_BAGLACI_DESENI}(?:\\s+d[ea])?\\s*bos\\w*|^${IYELIK_EK_DESENI}?\\s*b(?![a-z0-9])`) },
]

/** Verilen aralıktaki sayıları, doğru/yanlış/boş etiketlerini ve "hepsi doğru" ifadelerini çıkarır. */
function araliktakiSayilar(kesit: string, aralikBas: number, aralikSon: number): SayiOgesi[] {
  const aralik = kesit.slice(aralikBas, aralikSon)
  const ogeler: SayiOgesi[] = []
  const ekle = (tur: SayiOgesi['tur'], deger: number, bas: number, son: number, toplamEtiketli = false) =>
    ogeler.push({ tur, deger, bas: aralikBas + bas, son: aralikBas + son, toplamEtiketli })

  for (const es of aralik.matchAll(/\d+/g)) {
    const nBas = es.index ?? 0
    const nSon = nBas + es[0].length
    const deger = Number(es[0])
    const sag = aralik.slice(nSon)
    const etiket = SAYI_SON_ETIKETLERI.map((e) => ({ tur: e.tur, es: e.desen.exec(sag) })).find((x) => x.es)
    if (etiket?.es) {
      ekle(etiket.tur, deger, nBas, nSon + etiket.es[0].length)
      continue
    }
    const sol = aralik.slice(0, nBas)
    const soruEki = /^\s+(?:tane(?:\s+d[ea])?|soru\w*)/.exec(sag)
    const tur = /(?:her\s+birinden|ikisi\s+de|ayri\s+ayri)\s+$/.test(sol) ? 'ulestirme' : 'toplam'
    ekle(tur, deger, nBas, nSon + (soruEki ? soruEki[0].length : 0), /(?:^|[^a-z0-9])toplam(?:da)?\s+$/.test(sol))
  }

  for (const es of aralik.matchAll(new RegExp(HEPSI_DOGRU_DESENI.source, 'g'))) {
    const yer = es.index ?? 0
    ekle('hepsi-dogru', 0, yer, yer + es[0].length)
  }
  const yanlisYokEs = YANLIS_YOK_DESENI.exec(aralik)
  if (yanlisYokEs?.index !== undefined && !ogeler.some((o) => o.tur === 'yanlis')) {
    ekle('yanlis', 0, yanlisYokEs.index, yanlisYokEs.index + yanlisYokEs[0].length)
  }
  for (const es of aralik.matchAll(KALAN_SONUC_DESENI)) {
    const yer = es.index ?? 0
    const sonuc = es[1] as 'dogru' | 'yanlis' | 'bos'
    ekle(`kalan-${sonuc}`, 0, yer, yer + es[0].length)
  }
  return ogeler.sort((a, b) => a.bas - b.bas)
}

/** Tekrarlı doğru/yanlış/boş etiketlerini eler; Deneme ve Soru Takibi aynı doğrulamayı paylaşır. */
function etiketleriAyir(ogeler: SayiOgesi[]) {
  const say = (tur: SayiOgesi['tur']) => ogeler.filter((o) => o.tur === tur)
  const [dogrular, yanlislar, boslar, hepsi] = [say('dogru'), say('yanlis'), say('bos'), say('hepsi-dogru')]
  const kalanlar = [say('kalan-dogru'), say('kalan-yanlis'), say('kalan-bos')].flat()
  if (dogrular.length > 1 || yanlislar.length > 1 || boslar.length > 1 || hepsi.length > 1 || kalanlar.length > 1) return null
  const d = dogrular[0]?.deger ?? null
  const y = yanlislar[0]?.deger ?? null
  const b = boslar[0]?.deger ?? null
  const kalan = kalanlar[0]?.tur.replace('kalan-', '') as 'dogru' | 'yanlis' | 'bos' | undefined
  if (hepsi.length === 1 && ((y ?? 0) !== 0 || (b ?? 0) !== 0 || kalan !== undefined)) return null
  return { d, y, b, kalan, hepsiDogru: hepsi.length === 1, toplamlar: ogeler.filter((o) => o.tur === 'toplam' || o.tur === 'ulestirme') }
}

// --- Bağlam ayırma (Deneme ↔ Soru Takibi) ---

type Bolum = { tur: 'deneme' | 'soru'; bas: number; son: number }
type DersGrubu = { dersler: (string | null)[]; bas: number; son: number }

const DENEME_KELIMESI_DESENI =
  /(?<![a-z0-9])(?:deneme(?:si(?:nde|nden|ni|ne|yle)?|de|den|ye|yi|nin|yle|m(?:de|den|i|e)?|miz(?:de|den|i|e)?|ler(?:i|de|den)?)?|seviye\s+tespit(?:te|ten|i|e)?(?:\s+sinav\w*)?(?!\s+deneme))(?![a-z0-9])/g
const ACIK_SORU_GECISI_DESENI =
  /(?<![a-z0-9])(?:(?:onun|bunun|deneme|denemenin)\s+(?:disinda|haricinde)|disinda|haricinde|ayrica|bir\s+de|(?:buna\s+)?ek\s+olarak|ustune)(?![a-z0-9])/
const SORU_BELIRTECI_DESENI =
  /(?<![a-z0-9])(?:tane(?![a-z0-9])(?!\s+(?:d[ea]\s+)?(?:dogru|yanlis|bos|net))|soru(?:su|da|dan|lar|lari)?(?![a-z0-9]))/
const SINAV_KISA_ADLARI_DESENI = /(?<![a-z0-9])(?:tyt|ayt|ydt)(?:'?([a-z]+))?(?![a-z0-9])/g

/** Arada sayı veya yüklem olmadan "ve / ile / veya" ile bağlanan dersleri tek grup yapar. */
function dersGruplariniKur(bulgular: DersBulgu<string>[], kesit: string): DersGrubu[] {
  const gruplar: DersGrubu[] = []
  for (const b of bulgular) {
    const onceki = gruplar[gruplar.length - 1]
    if (onceki && /^[\s,]*(?:(?:ve|ile|veya|arti)\s+)?$/.test(kesit.slice(onceki.son, b.bas))) {
      onceki.dersler.push(b.hedef)
      onceki.son = b.son
    } else gruplar.push({ dersler: [b.hedef], bas: b.bas, son: b.son })
  }
  return gruplar
}

/** "deneme" kelimesinden önceki sınav türü ("TYT") ve adet ("3 deneme") ifadelerini bölgeye katar. */
function denemeBaslangici(norm: string, denemeBas: number): number {
  let bas = denemeBas
  const niteleyici =
    /(?:^|\s)((?:(?:(?:tyt|ayt|ydt)(?:'?[a-z]+)?|sayisal|sozel|esit|agirlik|yabanci|dil|seviye|tespit|okul)\s+)+)$/.exec(norm.slice(0, bas))
  if (niteleyici?.[1]) bas -= niteleyici[1].length

  const adet = /(?:^|\s)((?:bir|\d+(?:\s+tane)?)\s+)$/.exec(norm.slice(0, bas))?.[1]
  if (adet) {
    const oncesi = norm.slice(0, bas - adet.length)
    const acikAdet = /^bir\s|\stane\s/.test(adet)
    const oncekiEtiket = /(?:\d|dogru\w*|yanlis\w*|bos\w*|net\w*|[dyb])\s*$/.test(oncesi)
    const oncekiDers = dersleriTara(oncesi, SORU_HEDEFLERI, GRUP_ANAHTARLARI).some((d) => /^\s*$/.test(oncesi.slice(d.son)))
    if (acikAdet || (!oncekiEtiket && !oncekiDers)) bas -= adet.length
  }
  return bas
}

/** Bir aralığın deneme dersi sonucu taşıyıp taşımadığını ("35 3" ya da etiketli D/Y/B) denetler. */
function denemeSonucuVarMi(aralik: string): boolean {
  return HEPSI_DOGRU_DESENI.test(aralik) || YANLIS_YOK_DESENI.test(aralik) || /\d+\s*(?:d(?:ogru)?|y(?:anlis)?|b(?:os)?)(?![a-z0-9])/.test(aralik) || [...aralik.matchAll(/\d+/g)].length >= 2
}

/** Deneme kelimesinden sonraki kuyrukta Soru Takibi ifadesinin ilk başladığı dizini bulur. */
function denemeKuyrugundaSoruGecisi(kuyruk: string): { denemeUzunluk: number; soruBaslangic: number } {
  const acikGecis = ACIK_SORU_GECISI_DESENI.exec(kuyruk)
  const acikYer = acikGecis?.index ?? Number.POSITIVE_INFINITY
  const temiz = netAyiklaVeMaskele(kuyruk).temizMetin
  const dersler = dersleriTara(temiz, SORU_HEDEFLERI, GRUP_ANAHTARLARI)

  let belirtecYer = Number.POSITIVE_INFINITY
  const belirtec = SORU_BELIRTECI_DESENI.exec(kuyruk)
  if (belirtec?.index !== undefined) {
    const bYer = belirtec.index
    const oncesi = temiz.slice(0, bYer)
    const gruplar = dersGruplariniKur(dersler.filter((d) => d.son <= bYer), oncesi)
    const son = gruplar[gruplar.length - 1]
    if (son && /^\s*$/.test(oncesi.slice(son.son))) {
      const sayiEs = ON_SAYI_DESENI.exec(oncesi.slice(0, son.bas))
      const onceki = gruplar[gruplar.length - 2]
      belirtecYer = sayiEs?.index !== undefined && (!onceki || denemeSonucuVarMi(oncesi.slice(onceki.son, sayiEs.index))) ? sayiEs.index : son.bas
    } else {
      const sonSayi = ON_SAYI_DESENI.exec(oncesi)
      belirtecYer = sonSayi?.index !== undefined ? (son && /^\s*$/.test(oncesi.slice(son.son, sonSayi.index)) ? son.bas : sonSayi.index) : bYer
    }
  }

  let onSayiYer = Number.POSITIVE_INFINITY
  for (let i = 0; i < dersler.length; i++) {
    const ders = dersler[i]!
    const oncekiSon = i === 0 ? 0 : dersler[i - 1]!.son
    const solDilim = temiz.slice(oncekiSon, ders.bas)
    const onSayi = ON_SAYI_DESENI.exec(solDilim)
    if (!onSayi || onSayi.index === undefined) continue
    if (i > 0 && !denemeSonucuVarMi(solDilim.slice(0, onSayi.index))) continue
    if (denemeSonucuVarMi(temiz.slice(ders.son, dersler[i + 1]?.bas ?? temiz.length))) continue
    onSayiYer = oncekiSon + onSayi.index
    break
  }

  const ilk = Math.min(acikYer, belirtecYer, onSayiYer)
  if (!Number.isFinite(ilk)) return { denemeUzunluk: kuyruk.length, soruBaslangic: kuyruk.length }
  return { denemeUzunluk: ilk, soruBaslangic: acikGecis && acikYer === ilk ? ilk + acikGecis[0].length : ilk }
}

/**
 * "deneme" sözcüğü geçmese bile TYT/AYT/YDT adından sonra ders + doğru/yanlış
 * geliyorsa ("TYT Türkçe 32 doğru 6 yanlış") bunun deneme başlangıcı olduğunu
 * saptar; "50 TYT matematik sorusu çözdüm" gibi soru çözümlerini dışarıda tutar.
 */
function sinavDenemeCapasiMi(norm: string, sBas: number, sSon: number, ustSinir: number): boolean {
  const sol = norm.slice(0, sBas)
  const onSayi = /(?:^|\s)(\d+(?:\s*'?\s*(?:ser|sar|er|ar)|\s+tane)?)\s*$/.exec(sol)
  if (onSayi) {
    const sayiOncesi = sol.slice(0, onSayi.index)
    const oncekiDersVar = dersleriTara(sayiOncesi, SORU_HEDEFLERI, GRUP_ANAHTARLARI).some((d) => /^\s*$/.test(sayiOncesi.slice(d.son)))
    const oncekiEtiketVar = /(?:\d|dogru\w*|yanlis\w*|bos\w*|net\w*|[dyb])\s*$/.test(sayiOncesi)
    if (!oncekiDersVar && !oncekiEtiketVar) return false
  }

  const sag = norm.slice(sSon, ustSinir)
  // "TYT'den 90 net yaptım" ders sonuçları vermese de açıkça bir deneme
  // sonucudur; toplam neti derslere dağıtmadan deneme kartına taşır.
  if (/^\s*(?:'?\s*[a-z]+)?\s+\d+(?:[.,]\d+)?\s+net\w*(?![a-z0-9])/.test(sag)) return true
  const gecis = denemeKuyrugundaSoruGecisi(sag)
  const adayDilim = sag.slice(0, gecis.denemeUzunluk)
  if (!adayDilim.trim()) return false

  const temizDilim = soruDisiSayilariMaskele(adayDilim)
  const dersler = dersleriTara(temizDilim, SORU_HEDEFLERI, GRUP_ANAHTARLARI, false)
  const ilkDers = dersler[0]
  if (!ilkDers) return false

  const ara = temizDilim.slice(0, ilkDers.bas)
  if (/\d/.test(ara) || SORU_BELIRTECI_DESENI.test(ara) || ACIK_SORU_GECISI_DESENI.test(ara)) return false
  const araKelimeler = ara.match(/[a-z0-9]+/g) ?? []
  if (
    !araKelimeler.every((k) =>
      /^(?:sayisal\w*|esit|agirlik\w*|sozel\w*|yabanci|dil\w*|coz\w*|yap\w*|gir\w*|ol\w*|toplam\w*|bugun|dun|sabah|aksam|gece|okulda|dershanede|kurs\w*|d[ea])$/.test(k),
    )
  ) {
    return false
  }

  const ilkParca = temizDilim.slice(ilkDers.son, dersler[1]?.bas ?? temizDilim.length)
  if (SORU_BELIRTECI_DESENI.test(ilkParca)) return false
  const ayrilan = etiketleriAyir(araliktakiSayilar(ilkParca, 0, ilkParca.length))
  if (!ayrilan || ayrilan.toplamlar.length > 0) return false
  return ayrilan.d !== null || ayrilan.y !== null || ayrilan.hepsiDogru
}

/** Metni deneme ve soru takibi bölgelerine ayırır; ardışık aynı tür bölgeleri birleştirir. */
function bolumlereAyir(norm: string): Bolum[] {
  const acikCapalar = [...norm.matchAll(DENEME_KELIMESI_DESENI)].map((es) => {
    const kBas = es.index ?? 0
    return { bas: denemeBaslangici(norm, kBas), kelimeSon: kBas + es[0].length }
  })

  const ekCapalar: { bas: number; kelimeSon: number }[] = []
  for (const es of norm.matchAll(SINAV_KISA_ADLARI_DESENI)) {
    const sBas = es.index ?? 0
    const sSon = sBas + es[0].length
    const ek = es[1]
    if (ek !== undefined && !CEKIM_EKLERI.has(ek) && !SINAV_BITISIK_EKLERI.has(ek)) continue
    if (acikCapalar.some((a) => sBas >= a.bas && sSon <= a.kelimeSon)) continue
    const sonrakiAcikBas = acikCapalar.find((a) => a.bas >= sSon)?.bas ?? norm.length
    if (sinavDenemeCapasiMi(norm, sBas, sSon, sonrakiAcikBas)) {
      ekCapalar.push({ bas: denemeBaslangici(norm, sBas), kelimeSon: sSon })
    }
  }

  const siraliCapalar = [...acikCapalar, ...ekCapalar].sort((a, b) => a.bas - b.bas || b.kelimeSon - a.kelimeSon)
  const denemeKelimeleri: { bas: number; kelimeSon: number }[] = []
  for (const c of siraliCapalar) {
    const onceki = denemeKelimeleri[denemeKelimeleri.length - 1]
    if (onceki && c.kelimeSon <= onceki.kelimeSon) continue
    denemeKelimeleri.push(c)
  }
  if (denemeKelimeleri.length === 0) return norm ? [{ tur: 'soru', bas: 0, son: norm.length }] : []

  const ham: Bolum[] = []
  let imlec = 0
  for (let i = 0; i < denemeKelimeleri.length; i++) {
    const dk = denemeKelimeleri[i]!
    const bas = Math.max(imlec, dk.bas)
    if (bas > imlec) ham.push({ tur: 'soru', bas: imlec, son: bas })

    const ustSinir = denemeKelimeleri[i + 1]?.bas ?? norm.length
    const gecis = denemeKuyrugundaSoruGecisi(norm.slice(dk.kelimeSon, ustSinir))
    ham.push({ tur: 'deneme', bas, son: dk.kelimeSon + gecis.denemeUzunluk })
    if (dk.kelimeSon + gecis.soruBaslangic < ustSinir) ham.push({ tur: 'soru', bas: dk.kelimeSon + gecis.soruBaslangic, son: ustSinir })
    imlec = ustSinir
  }
  if (imlec < norm.length) ham.push({ tur: 'soru', bas: imlec, son: norm.length })

  const birlesik: Bolum[] = []
  for (const b of ham) {
    if (b.son <= b.bas) continue
    const onceki = birlesik[birlesik.length - 1]
    if (onceki && onceki.tur === b.tur && onceki.son === b.bas) onceki.son = b.son
    else birlesik.push({ ...b })
  }
  return birlesik
}

// --- Deneme çözümleme ---

/** Konuşulan sınav türünü şablon listesiyle eşler; aynı türdeyse kullanıcının varsayılanını korur. */
function sablonSec(denemeMetni: string, tumMetin: string, sablonlar: Sablon[], varsayilanId: string): Sablon | null {
  const varsayilan = sablonlar.find((s) => s.id === varsayilanId) ?? sablonlar[0] ?? null
  if (!varsayilan) return null

  const turBul = (m: string): SablonTuru | null => {
    if (/(?<![a-z0-9])tyt(?:'?[a-z]+)?(?![a-z0-9])/.test(m)) return 'tyt'
    if (/(?<![a-z0-9])ayt(?:'?[a-z]+)?(?![a-z0-9])/.test(m)) return 'ayt'
    if (/(?<![a-z0-9])ydt(?:'?[a-z]+)?(?![a-z0-9])|(?<![a-z0-9])(?:yabanci\s+)?dil\s+deneme/.test(m)) return 'ydt'
    if (/(?<![a-z0-9])(?:seviye\s+tespit(?:te|ten|i|e)?(?![a-z0-9])|okul\s+deneme)/.test(m)) return 'okul'
    return null
  }
  const istenenTur = turBul(denemeMetni) ?? turBul(tumMetin)
  if (istenenTur === null) return varsayilan
  if (istenenTur === 'ayt') {
    const alan = /(?<![a-z0-9])(sayisal|esit\s+agirlik|sozel)(?![a-z0-9])/.exec(denemeMetni)?.[1]
    const uygun = alan ? sablonlar.find((s) => s.tur === 'ayt' && sadelestir(s.ad).includes(alan.replace(/\s+/g, ' '))) : undefined
    if (uygun) return uygun
  }
  return varsayilan.tur === istenenTur ? varsayilan : sablonlar.find((s) => s.tur === istenenTur) ?? varsayilan
}

/** Şablon dersinin arama anahtarlarını üretir; şablonda "Sosyal"/"Fen" adlı tek ders varsa eşler. */
function sablonDersHedefleri(sablonDersleri: SablonDers[]): DersHedefi<SablonDers>[] {
  return sablonDersleri.map((ders) => {
    const sadeAd = sadelestir(ders.ad)
    const kume = new Set<string>(anahtarlar(ders))
    if (ders.id === 'ydt') for (const a of ESANLAMLI.ingilizce ?? []) kume.add(a)
    for (const a of GRUP_KUMELERI.find((g) => g.includes(sadeAd)) ?? []) kume.add(a)
    return { hedef: ders, kimlik: ders.id, anahtarlar: anahtarlariGenislet(kume) }
  })
}

/** Deneme ders parçasından doğru/yanlış çıkarır; tek ve belirsiz sayılarda uydurmayıp `null` döner. */
function denemeSayilariCoz(parca: string, soruSayisi: number): { dogru: number; yanlis: number } | null {
  const ogeler = araliktakiSayilar(parca, 0, parca.length)
  if (ogeler.some((o) => o.tur === 'ulestirme')) return null
  const ayrilan = etiketleriAyir(ogeler)
  if (!ayrilan) return null

  let { d, y, b } = ayrilan
  const { kalan, hepsiDogru, toplamlar: yalinar } = ayrilan
  if (kalan !== undefined) {
    if ((kalan === 'dogru' && d !== null) || (kalan === 'yanlis' && y !== null) || (kalan === 'bos' && b !== null)) return null
    const kalanSayi = soruSayisi - (d ?? 0) - (y ?? 0) - (b ?? 0)
    if (kalanSayi < 0) return null
    if (kalan === 'dogru') d = kalanSayi
    if (kalan === 'yanlis') y = kalanSayi
    if (kalan === 'bos') b = kalanSayi
  }
  if (hepsiDogru) {
    if ((d !== null && d !== soruSayisi) || yalinar.some((o) => o.deger !== soruSayisi && o.deger !== 0)) return null
    return { dogru: soruSayisi, yanlis: 0 }
  }

  if (d !== null && y !== null) return b !== null && d + y + b !== soruSayisi ? null : { dogru: d, yanlis: y }
  if (d !== null && b !== null) return soruSayisi - d - b < 0 ? null : { dogru: d, yanlis: soruSayisi - d - b }
  if (y !== null && b !== null) return soruSayisi - y - b < 0 ? null : { dogru: soruSayisi - y - b, yanlis: y }
  if (d === soruSayisi) return { dogru: d, yanlis: 0 }
  if (y === soruSayisi) return { dogru: 0, yanlis: y }
  if (d !== null || y !== null || b !== null) return null

  if (yalinar.length === 2) return { dogru: yalinar[0]!.deger, yanlis: yalinar[1]!.deger }
  if (yalinar.length === 3 && yalinar[0]!.deger + yalinar[1]!.deger + yalinar[2]!.deger === soruSayisi) {
    return { dogru: yalinar[0]!.deger, yanlis: yalinar[1]!.deger }
  }
  return null
}

/** `anlasilmayan` dilimine ders sonrasındaki alakasız yüklemleri katmamak için anlamlı sonu bulur. */
function parcaAnlamliSonu(parca: string): number {
  const desen = new RegExp(
    `\\d+${SAYI_ARA_EK_DESENI}?(?:\\s+d[ea])?(?:\\s+(?:dogru|yanlis|bos)\\w*)?(?:\\s+var)?|(?:hepsi(?:ni)?|tamami(?:ni)?|tumu(?:nu)?|full|ful)(?:\\s+d[ea])?(?:\\s+(?:dogru|yanlis|bos)\\w*)?|fulle\\w*|yanlis\\w*\\s+yok|yanlissiz`,
    'g',
  )
  const son = [...parca.matchAll(desen)].pop()
  return son?.index !== undefined ? son.index + son[0].length : parca.length
}

/** Çözülemeyen ders parçalarını yalıtarak denemeyi çözer; tamamen boş denemeleri `anlasilmayan`a atar. */
function denemeBolumleriniCoz(bolumler: Bolum[], hazir: HazirMetin, secenek: { sablonlar: Sablon[]; varsayilanSablonId: string }): { deneme: SesliDeneme | null; anlasilmayan: string[] } {
  const denemeBolumleri = bolumler.filter((b) => b.tur === 'deneme')
  if (denemeBolumleri.length === 0) return { deneme: null, anlasilmayan: [] }

  const birlesik = denemeBolumleri.map((b) => hazir.norm.slice(b.bas, b.son)).join(' ')
  const sablon = sablonSec(birlesik, hazir.norm, secenek.sablonlar, secenek.varsayilanSablonId)
  if (!sablon) return { deneme: null, anlasilmayan: [] }

  const hedefler = sablonDersHedefleri(sablon.dersler)
  const yedekSinirlar = [...GRUP_ANAHTARLARI, ...SORU_TUM_ANAHTARLAR]
  const bulunanlar = new Map<string, { kayit: OkunanDers; hamParca: string }>()
  const cakisanlar = new Set<string>()
  const anlasilmayan = new Set<string>()
  let toplamNet: number | null = null

  const kayitEkle = (hedef: SablonDers | null, sayilar: { dogru: number; yanlis: number } | null, hamParca: string) => {
    if (!hedef || !sayilar || sayilar.dogru < 0 || sayilar.yanlis < 0 || sayilar.dogru + sayilar.yanlis > Math.min(hedef.soruSayisi, EN_COK_SORU)) {
      if (hamParca) anlasilmayan.add(hamParca)
      return
    }
    const onceki = bulunanlar.get(hedef.id)
    if (!onceki) bulunanlar.set(hedef.id, { kayit: { dersId: hedef.id, ...sayilar }, hamParca })
    else if (onceki.kayit.dogru !== sayilar.dogru || onceki.kayit.yanlis !== sayilar.yanlis) {
      if (!cakisanlar.has(hedef.id) && onceki.hamParca) anlasilmayan.add(onceki.hamParca)
      cakisanlar.add(hedef.id)
      if (hamParca) anlasilmayan.add(hamParca)
    }
  }

  for (const bolum of denemeBolumleri) {
    const { temizMetin, net } = netAyiklaVeMaskele(hazir.norm.slice(bolum.bas, bolum.son))
    if (toplamNet === null && net !== null) toplamNet = net
    const bulgular = dersleriTara(temizMetin, hedefler, yedekSinirlar)

    if (bulgular.length === 0 && sablon.dersler.length === 1) {
      const tek = sablon.dersler[0]!
      const sonDeneme = [...temizMetin.matchAll(DENEME_KELIMESI_DESENI)].pop()
      const aday = sonDeneme?.index !== undefined ? temizMetin.slice(sonDeneme.index + sonDeneme[0].length) : temizMetin
      const sayilar = denemeSayilariCoz(aday, tek.soruSayisi) ?? denemeSayilariCoz(temizMetin, tek.soruSayisi)
      if (sayilar) kayitEkle(tek, sayilar, hazir.hamKesit(bolum.bas, bolum.son))
      continue
    }
    for (let sira = 0; sira < bulgular.length; sira++) {
      const bulgu = bulgular[sira]!
      const sonraki = bulgular[sira + 1]
      const parca = temizMetin.slice(bulgu.son, sonraki?.bas ?? temizMetin.length)
      if (bulgu.hedef && sonraki?.hedef?.id === bulgu.hedef.id && /^[\s,;-]*$/.test(parca)) continue
      const hamParca = hazir.hamKesit(bolum.bas + bulgu.bas, bolum.bas + bulgu.son + parcaAnlamliSonu(parca))
      kayitEkle(bulgu.hedef, bulgu.hedef ? denemeSayilariCoz(parca, bulgu.hedef.soruSayisi) : null, hamParca)
    }
  }

  if (toplamNet === null) {
    for (const bolum of bolumler) {
      if (bolum.tur === 'soru') toplamNet = netAyiklaVeMaskele(hazir.norm.slice(bolum.bas, bolum.son)).net
      if (toplamNet !== null) break
    }
  }

  for (const id of cakisanlar) bulunanlar.delete(id)
  const dersler = sablon.dersler.map((d) => bulunanlar.get(d.id)?.kayit).filter((o): o is OkunanDers => o !== undefined)

  if (dersler.length === 0 && toplamNet === null) {
    const yalnizBirDeneme = denemeBolumleri.length === 1 && !/^\s*\d+\s+/.test(hazir.norm.slice(denemeBolumleri[0]!.bas, denemeBolumleri[0]!.son))
    if (yalnizBirDeneme && anlasilmayan.size === 0) return { deneme: { sablonId: sablon.id, dersler: [], toplamNet: null }, anlasilmayan: [] }
    if (anlasilmayan.size === 0) {
      for (const b of denemeBolumleri) {
        const ham = hazir.hamKesit(b.bas, b.son)
        if (ham) anlasilmayan.add(ham)
      }
    }
    return { deneme: null, anlasilmayan: [...anlasilmayan] }
  }
  return { deneme: { sablonId: sablon.id, dersler, toplamNet }, anlasilmayan: [...anlasilmayan] }
}

// --- Soru Takibi çözümleme ---

const CUMLE_SINIRI_DESENI =
  /(?:[,;.\n]|(?<![a-z0-9])(?:coz\w*|bak\w*|yap\w*|calis\w*|bitir\w*|sonra|ardindan|ayrica|bir\s+de|daha)(?![a-z0-9]))/

/** İki ders grubu arasındaki sayıları sol dersin kuyruğu ile sağ dersin ön sayısı arasında böler. */
function araSayilariBol(solOncedenSayiAldi: boolean, araSayilar: SayiOgesi[], kesit: string, aralikBas: number, sagSonrasiSayilar: SayiOgesi[]): { sola: SayiOgesi[]; saga: SayiOgesi[] } {
  let solToplamAldi = solOncedenSayiAldi
  let solIsaretAldi = false
  const bol = (i: number) => ({ sola: araSayilar.slice(0, i), saga: araSayilar.slice(i) })

  for (let i = 0; i < araSayilar.length; i++) {
    const s = araSayilar[i]!
    if (s.tur === 'dogru' || s.tur === 'yanlis' || s.tur === 'bos' || s.tur === 'hepsi-dogru') {
      const araMetin = kesit.slice(i === 0 ? aralikBas : araSayilar[i - 1]!.son, s.bas)
      if ((solToplamAldi || solIsaretAldi) && sagSonrasiSayilar.length === 0 && /(?<![a-z0-9])(?:sonra|ardindan|ayrica|bir\s+de)(?![a-z0-9])/.test(araMetin)) return bol(i)
      solIsaretAldi = true
      continue
    }
    if (solToplamAldi) return bol(i)
    if (solIsaretAldi) {
      if (i === araSayilar.length - 1 && sagSonrasiSayilar.length === 0) return bol(i)
      solToplamAldi = true
      continue
    }
    if (i === araSayilar.length - 1 && sagSonrasiSayilar.length === 0 && CUMLE_SINIRI_DESENI.test(kesit.slice(aralikBas, s.bas))) return bol(i)
    solToplamAldi = true
  }
  return { sola: araSayilar, saga: [] }
}

/** Bir ders grubuna bağlanan sayıları doğrular; çelişki, grup adı veya sınır aşımı varsa `null` döner. */
function soruGrubuDegerlendir(grup: DersGrubu, sayilar: SayiOgesi[]): SesliSoru[] | null {
  if (sayilar.length === 0 || grup.dersler.some((d) => d === null)) return null
  if (grup.dersler.length > 1 && !sayilar.some((s) => s.tur === 'ulestirme')) return null

  const ayrilan = etiketleriAyir(sayilar)
  if (!ayrilan || ayrilan.toplamlar.length > 1) return null

  let { d, y, b } = ayrilan
  const { kalan, hepsiDogru, toplamlar } = ayrilan
  const toplam = toplamlar[0]?.deger
  if (kalan !== undefined) {
    if (toplam === undefined || (kalan === 'dogru' && d !== null) || (kalan === 'yanlis' && y !== null) || (kalan === 'bos' && b !== null)) return null
    const kalanSayi = toplam - (d ?? 0) - (y ?? 0) - (b ?? 0)
    if (kalanSayi < 0) return null
    if (kalan === 'dogru') d = kalanSayi
    if (kalan === 'yanlis') y = kalanSayi
    if (kalan === 'bos') b = kalanSayi
  }
  const bos = b ?? 0
  const cozum = hepsiDogru
    ? toplamlar.length === 1 && (d === null || d === toplamlar[0]!.deger)
      ? { toplam: toplamlar[0]!.deger, dogru: toplamlar[0]!.deger, yanlis: 0 }
      : null
    : toplamlar.length === 1
      ? {
          toplam: toplamlar[0]!.deger,
          dogru: d ?? (y !== null ? toplamlar[0]!.deger - y - bos : 0),
          yanlis: y ?? (d !== null && b !== null ? toplamlar[0]!.deger - d - bos : 0),
        }
      : d !== null && y !== null
        ? { toplam: d + y + bos, dogru: d, yanlis: y }
        : null

  if (!cozum || cozum.toplam <= 0 || cozum.toplam > EN_COK_SORU || cozum.dogru < 0 || cozum.yanlis < 0 || cozum.dogru + cozum.yanlis + bos > cozum.toplam) return null
  return (grup.dersler as string[]).map((ders) => ({ ders, ...cozum }))
}

/** Tek bir soru bölümündeki ders gruplarını ve sayılarını eşleştirir. */
function soruBolumunuCoz(bolum: Bolum, hazir: HazirMetin): { sorular: SesliSoru[]; anlasilmayan: string[] } {
  const soruDisi = soruDisiSayilariAyir(hazir.norm.slice(bolum.bas, bolum.son))
  const kesit = soruDisi.temizMetin
  const bulgular = dersleriTara(kesit, SORU_HEDEFLERI, GRUP_ANAHTARLARI)
  if (bulgular.length === 0) {
    // Ders adı olmadan söylenen soru adedini bir derse yazmak güvenli değildir.
    // Sayı tek başına da gürültü olabileceğinden yalnız soru/sonuç dili taşıyan
    // parçayı kullanıcıya geri veriyoruz.
    const soruDiliVar = /\d/.test(kesit) && /(?:soru\w*|coz\w*|dogru\w*|yanlis\w*|bos\w*)/.test(kesit)
    const ham = soruDiliVar ? hazir.hamKesit(bolum.bas, bolum.son) : ''
    return { sorular: [], anlasilmayan: ham ? [ham] : [] }
  }

  const gruplar = dersGruplariniKur(bulgular, kesit)
  const araliklar = Array.from({ length: gruplar.length + 1 }, (_, i) =>
    araliktakiSayilar(kesit, i === 0 ? 0 : gruplar[i - 1]!.son, i === gruplar.length ? kesit.length : gruplar[i]!.bas),
  )

  const atanan: SayiOgesi[][] = gruplar.map(() => [])
  atanan[0]!.push(...araliklar[0]!)
  for (let m = 1; m < gruplar.length; m++) {
    const solAldi = atanan[m - 1]!.some((s) => s.tur !== 'bos' && s.tur !== 'hepsi-dogru')
    const { sola, saga } = araSayilariBol(solAldi, araliklar[m]!, kesit, gruplar[m - 1]!.son, araliklar[m + 1]!)
    atanan[m - 1]!.push(...sola)
    atanan[m]!.push(...saga)
  }

  const sonIndeks = gruplar.length - 1
  const sonKuyruk = [...araliklar[gruplar.length]!]
  if (gruplar.length >= 2 && sonKuyruk[sonKuyruk.length - 1]?.toplamEtiketli && [...atanan[sonIndeks]!, ...sonKuyruk.slice(0, -1)].some((s) => s.tur === 'toplam' || s.tur === 'ulestirme')) {
    sonKuyruk.pop()
  }
  atanan[sonIndeks]!.push(...sonKuyruk)

  const sorular: SesliSoru[] = []
  const anlasilmayan: string[] = []
  for (let i = 0; i < gruplar.length; i++) {
    const grup = gruplar[i]!
    const sayilar = atanan[i]!
    if (sayilar.length === 0) {
      const aralikBas = i === 0 ? 0 : gruplar[i - 1]!.son
      const aralikSon = gruplar[i + 1]?.bas ?? kesit.length
      const anlamliMaskeler = soruDisi.maskeler.filter((maske) => maske.anlasilmayanMi && maske.bas >= aralikBas && maske.son <= aralikSon)
      // Net, sınıf ve sıra bilgisi ders adını tek başına anlaşılmayan yapmaz.
      // Buna karşılık test adedi ya da süre, soru sayısı olmadığı için kullanıcıdan açıklama ister.
      if (anlamliMaskeler.length === 0) continue
      const parcaBas = Math.min(grup.bas, ...anlamliMaskeler.map((maske) => maske.bas))
      const ham = hazir.hamKesit(bolum.bas + parcaBas, bolum.bas + aralikSon)
      if (ham) anlasilmayan.push(ham)
      continue
    }
    const cozum = soruGrubuDegerlendir(grup, sayilar)
    if (cozum) {
      sorular.push(...cozum)
      continue
    }
    const parcaBas = sayilar.length > 0 ? Math.min(grup.bas, sayilar[0]!.bas) : grup.bas
    const parcaSon = sayilar.length > 0 ? Math.max(grup.son, sayilar[sayilar.length - 1]!.son) : gruplar[i + 1]?.bas ?? kesit.length
    const ham = hazir.hamKesit(bolum.bas + parcaBas, bolum.bas + parcaSon)
    if (ham) anlasilmayan.push(ham)
  }
  return { sorular, anlasilmayan }
}

/** Aynı derse ait birden çok kaydı toplar ve `CALISMA_DERSLERI` sırasına dizer. */
function sorulariBirlestir(hamSorular: SesliSoru[]): SesliSoru[] {
  const harita = new Map<string, SesliSoru>()
  for (const s of hamSorular) {
    const m = harita.get(s.ders)
    if (m) harita.set(s.ders, { ders: s.ders, toplam: m.toplam + s.toplam, dogru: m.dogru + s.dogru, yanlis: m.yanlis + s.yanlis })
    else harita.set(s.ders, { ...s })
  }
  return CALISMA_DERSLERI.map((d) => harita.get(d)).filter((k): k is SesliSoru => k !== undefined)
}

const TANIDIK_YARDIMCI_KOKLER = new Set(
  TANIMA_IPUCLARI.map((s) => sadelestir(s)).filter(
    (s) => s !== 'tyt' && s !== 'ayt' && s !== 'ydt' && !SORU_HEDEFLERI.some((h) => h.anahtarlar.some((a) => a.metin === s)),
  ),
)

/** Bir adayın tanıdık sözcük (ders adı, TYT/AYT/YDT, sayı; eşitlikte diğer tanıma ipuçları) puanını hesaplar. */
function adayTanidikPuani(aday: string): number {
  if (!aday.trim()) return 0
  const cevrilmis = sayilariRakamaCevir(aday)
  const sade = sadelestir(cevrilmis).replace(/[’`]/g, "'")
  if (!sade) return 0

  const kapaliAraliklar: { bas: number; son: number }[] = []
  const cakisiyorMu = (bas: number, son: number) => kapaliAraliklar.some((a) => bas < a.son && a.bas < son)

  let anaPuan = 0
  for (const es of sade.matchAll(/(?<![a-z0-9])(tyt|ayt|ydt)(?:'?([a-z]+))?(?![a-z0-9])/g)) {
    const bas = es.index ?? 0
    const tam = es[0]
    const ek = es[2]
    if (ek !== undefined && !CEKIM_EKLERI.has(ek) && !SINAV_BITISIK_EKLERI.has(ek)) continue
    kapaliAraliklar.push({ bas, son: bas + tam.length })
    anaPuan += 1
  }

  for (const ders of dersleriTara(sade, SORU_HEDEFLERI, [], false)) {
    if (ders.hedef !== null && !cakisiyorMu(ders.bas, ders.son)) {
      kapaliAraliklar.push({ bas: ders.bas, son: ders.son })
      anaPuan += 1
    }
  }

  for (const es of sade.matchAll(/(?<![a-z0-9])\d+(?:[.,]\d+)?/g)) {
    const bas = es.index ?? 0
    const son = bas + es[0].length
    if (!cakisiyorMu(bas, son)) {
      kapaliAraliklar.push({ bas, son })
      anaPuan += 1
    }
  }

  let yardimciPuan = 0
  for (const es of sade.matchAll(/[a-z0-9]+/g)) {
    const bas = es.index ?? 0
    const kelime = es[0]
    const son = bas + kelime.length
    if (cakisiyorMu(bas, son)) continue
    if (/^(?:rabi|net(?:im|imiz|le|ten|te|e|i)?|dogru\w*|yanlis\w*|bos(?:luk)?|deneme\w*)$/.test(kelime)) {
      for (const kok of TANIDIK_YARDIMCI_KOKLER) {
        if (kelime.startsWith(kok)) {
          yardimciPuan += 0.01
          break
        }
      }
    }
  }

  return anaPuan + yardimciPuan
}

/**
 * Konuşma tanımanın döndürdüğü alternatiflerden en çok tanıdık sözcük
 * (ders adı, TYT/AYT/YDT, sayı) içereni seçer; eşitlikte ilk adayı korur.
 */
export function enIyiAdayiSec(adaylar: string[]): string {
  if (adaylar.length === 0) return ''
  let enIyi = adaylar[0]!
  let enIyiPuan = adayTanidikPuani(enIyi)
  for (let i = 1; i < adaylar.length; i++) {
    const aday = adaylar[i]!
    const puan = adayTanidikPuani(aday)
    if (puan > enIyiPuan) {
      enIyi = aday
      enIyiPuan = puan
    }
  }
  return enIyi
}

/** Konuşma tanıma metnini Soru Takibi ve Deneme kayıtlarına dönüştürür. */
export function sesliMetniCoz(metin: string, secenek: { sablonlar: Sablon[]; varsayilanSablonId: string }): SesliCozum {
  const hazir = metniHazirla(duyulaniDuzelt(metin))
  if (!hazir.norm) return { sorular: [], deneme: null, anlasilmayan: [] }

  const bolumler = bolumlereAyir(hazir.norm)
  const denemeSonucu = denemeBolumleriniCoz(bolumler, hazir, secenek)
  const hamSorular: SesliSoru[] = []
  const anlasilmayan = new Set<string>()
  let denemeEklendi = false

  for (const bolum of bolumler) {
    if (bolum.tur === 'deneme') {
      if (!denemeEklendi) {
        for (const p of denemeSonucu.anlasilmayan) anlasilmayan.add(p)
        denemeEklendi = true
      }
      continue
    }
    const sonuc = soruBolumunuCoz(bolum, hazir)
    hamSorular.push(...sonuc.sorular)
    for (const p of sonuc.anlasilmayan) anlasilmayan.add(p)
  }
  return { sorular: sorulariBirlestir(hamSorular), deneme: denemeSonucu.deneme, anlasilmayan: [...anlasilmayan] }
}
