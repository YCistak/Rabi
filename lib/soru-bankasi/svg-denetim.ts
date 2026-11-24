/*
  Hazır SVG şekillerinin güvenlik denetimi (saf; `scripts/kimya-donustur.mjs`
  Node'un tip ayıklamasıyla içe aktarıyor).

  Şekiller `<img>` ile gösterildiği için içlerindeki betik zaten çalışmaz; yine
  de dosyalar başka bir yoldan (doğrudan adresle) açılabildiğinden yalnız
  bilinen çizim etiketlerine izin veriliyor: yasak listesi değil izin listesi.
*/
export const SVG_ETIKETLERI = new Set(['svg', 'defs', 'marker', 'g', 'path', 'rect', 'line', 'circle', 'ellipse', 'polygon', 'polyline', 'text', 'tspan'])
const EN_COK_BOY = 64 * 1024
const AD_ALANI = 'http://www.w3.org/2000/svg'
const ETIKET = /<(\/?)([A-Za-z][\w:-]*)((?:\s+[A-Za-z_:][\w:.-]*\s*=\s*"[^"<>]*")*)\s*(\/?)>/g

/** Dosyanın ilk kusuru (Türkçe, kısa) ya da güvenliyse `null`. */
export function svgHatasi(metin: string): string | null {
  if (metin.length > EN_COK_BOY) return 'dosya 64 KB sınırını aşıyor'
  if (!metin.startsWith('<svg ') || !metin.trimEnd().endsWith('</svg>')) return 'kök etiket <svg> değil'
  if (/<[!?]/.test(metin)) return 'bildirim, yorum ya da işleme yönergesi var'
  // Tanınan etiketler çıkarılınca geride açılı ayraç kalmamalı (tırnaksız nitelik, bozuk etiket…).
  if (/[<>]/.test(metin.replace(ETIKET, ''))) return 'okunamayan etiket var'
  for (const [, , ad, nitelikler] of metin.matchAll(ETIKET)) {
    if (!SVG_ETIKETLERI.has(ad)) return `izinsiz etiket <${ad}>`
    for (const [, nitelik, deger] of nitelikler.matchAll(/([A-Za-z_:][\w:.-]*)\s*=\s*"([^"]*)"/g)) {
      const kucuk = nitelik.toLowerCase()
      if (kucuk === 'xmlns') {
        if (deger !== AD_ALANI) return 'yabancı ad alanı'
        continue
      }
      if (kucuk.startsWith('on') || kucuk.includes('href') || (kucuk.includes(':') && kucuk !== 'xml:space')) return `izinsiz nitelik ${nitelik}`
      // Varlıkla (&#106;…) gizlenmiş değer denetimi atlatamasın.
      if (deger.includes('&')) return `nitelikte varlık kodu (${nitelik})`
      if (/javascript:|data:|https?:|\/\/|@import|expression\(/i.test(deger)) return `dış bağlantı (${nitelik})`
      for (const [, ic] of deger.matchAll(/url\(([^)]*)\)/gi)) if (!/^#[\w-]+$/.test(ic)) return `dış url (${nitelik})`
      if (/\\/.test(deger)) return `nitelikte ters bölü (${nitelik})`
    }
  }
  return svgOlcusu(metin) ? null : 'viewBox "0 0 en boy" değil'
}

/** Kökteki `viewBox`tan çizim ölçüsü (kitap sayfası yüksekliği ve sıçramasız yerleşim için). */
export function svgOlcusu(metin: string): { en: number; boy: number } | null {
  const e = /^<svg [^>]*viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/.exec(metin)
  if (!e) return null
  const en = Math.round(Number(e[1]))
  const boy = Math.round(Number(e[2]))
  return en > 0 && boy > 0 ? { en, boy } : null
}
