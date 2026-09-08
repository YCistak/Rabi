import { describe, expect, it } from 'vitest'
import { KONU_DERSLERI, KONU_SINIFLARI, programBul, tumKonular } from './index'
import type { BilgiKarti, Gorsel } from './tip'

/**
 * Kart görsellerinin denetimi.
 *
 * Görsel bir çizim ve çizimin bozukluğu **sessiz**: pencerenin dışında kalan
 * bir nokta ekranda hiç görünmüyor, sütun sayısı tutmayan bir tablo satırı
 * kayıyor, uzun bir etiket kutudan taşıyor. Hiçbiri hata vermiyor, yalnızca
 * yanlış bir resim çiziyor — ve yanlış resim, yanlış karttan daha kötü:
 * öğrenci metni okumadan ona bakıyor.
 *
 * Denetlenen şey çizimin **doğruluğu** değil (bir parabolün gerçekten parabol
 * olduğunu test edemeyiz), çizilebilirliği: her şey kendi kutusunda mı.
 */

/** Etiketler tek satır ve dar bir kutuda; uzun olan kırpılıyor. */
const ETIKET_SINIRI = 24
/** Tablo hücresi iki satıra sığmalı — üç sütunda kutu zaten dar. */
const HUCRE_SINIRI = 30

/*
  Soru görselleri de aynı denetimden geçiyor: ikisini tek bir bileşen çiziyor
  (`kart-gorseli.tsx`), yani bir çizimi bozan şey hangi ekranda durduğuna
  bakmıyor. Ayrı iki liste, kuralların yalnızca birine uygulanması demekti.
*/
const gorselliKartlar: [string, { gorsel: Gorsel }][] = KONU_SINIFLARI.flatMap((sinif) =>
  KONU_DERSLERI.flatMap((ders) =>
    tumKonular(programBul(ders.id, sinif)!).flatMap((konu) => {
      const kartlar = konu.kartlar
        .filter((k): k is BilgiKarti & { gorsel: Gorsel } => k.gorsel !== undefined)
        .map((k) => [`${sinif}-${ders.id} · ${konu.ad} · ${k.baslik}`, k] as const)
      const sorular = konu.sorular
        .filter((s): s is typeof s & { gorsel: Gorsel } => s.gorsel !== undefined)
        .map((s) => [`${sinif}-${ders.id} · ${konu.ad} · soru: ${s.ifade}`, s] as const)
      return [...kartlar, ...sorular].map(
        ([ad, x]) => [ad, x] as [string, { gorsel: Gorsel }],
      )
    }),
  ),
)

describe('kart görselleri', () => {
  it('görselli kart var', () => {
    expect(gorselliKartlar.length).toBeGreaterThan(0)
  })

  it.each(gorselliKartlar)('%s: çizilebilir', (_ad, kart) => {
    const g = kart.gorsel

    if (g.tur === 'koordinat') {
      const [x0, x1, y0, y1] = g.pencere
      expect(x1, 'pencere x tersine yazılmış').toBeGreaterThan(x0)
      expect(y1, 'pencere y tersine yazılmış').toBeGreaterThan(y0)

      /*
        Pencerenin dışı çizilmiyor: SVG onu sessizce kırpıyor ve kart, yarısı
        eksik bir grafik gösteriyor. Eğrinin **uçlarının** dışarı taşması bir
        kez oldu — pencere daraltıldı, noktalar olduğu gibi kaldı.
      */
      const icinde = (x: number, y: number) => x >= x0 && x <= x1 && y >= y0 && y <= y1
      for (const e of g.egriler ?? [])
        for (const [x, y] of e.noktalar)
          expect(icinde(x, y), `eğri noktası pencere dışında: (${x}, ${y})`).toBe(true)
      for (const p of g.noktalar ?? [])
        expect(icinde(p.x, p.y), `nokta pencere dışında: (${p.x}, ${p.y})`).toBe(true)
      for (const t of g.etiketler ?? [])
        expect(icinde(t.x, t.y), `etiket pencere dışında: ${t.ad}`).toBe(true)

      /* İki noktalı bir "eğri" doğru parçasıdır; tek nokta çizim değil. */
      for (const e of g.egriler ?? [])
        expect(e.noktalar.length, 'eğri en az iki nokta ister').toBeGreaterThan(1)
      for (const c of g.cemberler ?? [])
        expect(c.r, 'çemberin yarıçapı pozitif olmalı').toBeGreaterThan(0)
    }

    if (g.tur === 'sayiDogrusu') {
      const [a, b] = g.aralik
      expect(b).toBeGreaterThan(a)
      const icinde = (v: number) => v >= a && v <= b
      for (const i of g.isaretler ?? [])
        expect(icinde(i), `işaret aralık dışında: ${i}`).toBe(true)
      for (const p of g.parcalar ?? []) {
        if (p.bas !== null) expect(icinde(p.bas), `parça başı dışarıda: ${p.bas}`).toBe(true)
        if (p.bit !== null) expect(icinde(p.bit), `parça sonu dışarıda: ${p.bit}`).toBe(true)
        if (p.bas !== null && p.bit !== null)
          expect(p.bit, 'parça geriye doğru yazılmış').toBeGreaterThan(p.bas)
      }
      for (const n of g.noktalar ?? [])
        expect(icinde(n.deger), `nokta aralık dışında: ${n.deger}`).toBe(true)
    }

    if (g.tur === 'tablo') {
      expect(g.basliklar.length, 'tablo en az iki sütun ister').toBeGreaterThan(1)
      expect(g.basliklar.length, 'üç sütundan fazlası telefonda okunmuyor').toBeLessThanOrEqual(3)
      expect(g.satirlar.length).toBeGreaterThan(0)
      for (const s of g.satirlar)
        expect(s.length, `satır sütun sayısını tutmuyor: ${s.join(' | ')}`).toBe(
          g.basliklar.length,
        )
      for (const h of g.satirlar.flat())
        expect(h.length, `hücre uzun: ${h}`).toBeLessThanOrEqual(HUCRE_SINIRI)
    }

    if (g.tur === 'akis') {
      expect(g.adimlar.length, 'tek adımlık akış akış değil').toBeGreaterThan(1)
      /*
        Yatay sırada beş kutu 320 birimlik kutuya sığmıyor; uzunu dikey olmalı.
        Ad uzunluğu da sınırlı: kutular genişliği eşit paylaşıyor ve uzun bir
        ad taşmıyor ama üç-dört satıra sarıyor — çizim o noktada bir şema
        değil, kutulara bölünmüş bir paragraf oluyor. Sınır aşılırsa çözüm
        adı kısaltmak ya da akışı `dikey` yapmak.
      */
      if (!g.dikey) {
        expect(g.adimlar.length, 'yatay akış en çok dört adım').toBeLessThanOrEqual(4)
        for (const a of g.adimlar)
          expect(a.ad.length, `yatay akış adımı uzun: ${a.ad}`).toBeLessThanOrEqual(17)
      }
    }

    if (g.tur === 'katman') {
      expect(g.katmanlar.length, 'tek katman katman değil').toBeGreaterThan(1)
      expect(g.katmanlar.length, 'altıdan çok bant kartı uzatıyor').toBeLessThanOrEqual(6)
    }

    if (g.tur === 'venn') {
      expect(g.sol.trim().length).toBeGreaterThan(0)
      expect(g.sag.trim().length).toBeGreaterThan(0)
    }
  })

  it.each(gorselliKartlar)('%s: etiketleri kısa', (_ad, kart) => {
    const g = kart.gorsel
    const etiketler: string[] = []
    if (g.tur === 'koordinat')
      etiketler.push(
        ...(g.egriler ?? []).map((e) => e.ad ?? ''),
        ...(g.noktalar ?? []).map((p) => p.ad ?? ''),
        ...(g.etiketler ?? []).map((t) => t.ad),
        g.xAd ?? '',
        g.yAd ?? '',
      )
    if (g.tur === 'sayiDogrusu')
      etiketler.push(
        ...(g.parcalar ?? []).map((p) => p.ad ?? ''),
        ...(g.noktalar ?? []).map((n) => n.ad ?? ''),
      )
    if (g.tur === 'venn') etiketler.push(g.sol, g.sag, g.kesisim ?? '', g.disi ?? '')
    if (g.tur === 'akis')
      etiketler.push(...g.adimlar.flatMap((a) => [a.ad, a.alt ?? '']))
    if (g.tur === 'katman')
      etiketler.push(...g.katmanlar.flatMap((k) => [k.ad, k.alt ?? '']), g.eksenAdi ?? '')
    if (g.tur === 'tablo') etiketler.push(...g.basliklar)

    for (const e of etiketler)
      expect(e.length, `etiket uzun: ${e}`).toBeLessThanOrEqual(ETIKET_SINIRI)
  })
})
