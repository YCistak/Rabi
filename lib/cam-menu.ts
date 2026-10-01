/**
 * Camdan alt menünün (iOS) iki hesabı: parmağın hangi sekmenin üstünde
 * olduğu ve menünün arkasındaki rengin cama ne ton vereceği.
 *
 * Bileşen (`components/bottom-nav.tsx`) yalnızca ölçüp çiziyor; sayılar
 * burada, saf ve testli.
 */

/**
 * Parmağın şeritteki konumundan sekme sırası.
 *
 * `x` şeridin sol iç kenarından ölçülüyor. Şeridin dışına taşan parmak en
 * yakın uçtaki sekmede kalıyor — App Store'un çubuğu da öyle: parmak
 * kapsülden çıkınca mercek kenarda bekliyor, kaybolmuyor.
 */
export function parmaktanSira(x: number, genislik: number, adet: number): number {
  if (adet <= 0 || genislik <= 0) return 0
  const sira = Math.floor((x / genislik) * adet)
  return Math.min(adet - 1, Math.max(0, sira))
}

/**
 * Sürüklenen merceğin sol kenarı. Mercek parmağı ortasından izliyor ama
 * şeridin dışına çıkmıyor; çıksaydı kapsülün yuvarlak ucunda yarısı kesilirdi.
 */
export function mercekKonumu(x: number, genislik: number, adet: number): number {
  const mercek = genislik / adet
  return Math.min(genislik - mercek, Math.max(0, x - mercek / 2))
}

export type Ton = { r: number; g: number; b: number }

/**
 * `getComputedStyle`in döndürdüğü renkten ton. Yalnızca `rgb()`/`rgba()`
 * biçimi geliyor (tarayıcı hesaplanmış rengi hep böyle yazıyor). Saydam ya
 * da neredeyse saydam bir zemin `null`: arkasındaki öğeye bakılmalı, yoksa
 * cam şeffaf bir kutunun "rengini" alırdı.
 */
export function rengiCoz(css: string): Ton | null {
  const m = css.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)/)
  if (!m) return null
  let alfa = 1
  if (m[4] !== undefined) alfa = m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4])
  if (alfa < 0.3) return null
  return { r: Math.round(+m[1]), g: Math.round(+m[2]), b: Math.round(+m[3]) }
}

/**
 * Algılanan parlaklık (WCAG göreli parlaklığı, 0–1). Cam koyu bir yüzeyin
 * üstüne gelince yazıları açığa çeviriyor; eşik bu sayıya bakıyor.
 */
export function parlaklik({ r, g, b }: Ton): number {
  const kanal = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b)
}

/**
 * Koyu zemin eşiği. 0,18 orta gri; amber dolgu (#D9622F ≈ 0,22) hâlâ açık
 * sayılıyor, çünkü onun üstünde koyu yazı okunuyor.
 */
export const KOYU_ESIGI = 0.18
