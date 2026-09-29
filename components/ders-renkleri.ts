import type { CSSProperties } from 'react'
import type { KonuDersId } from '@/lib/konu/tip'

/** Ortak oyun düğmeleri de haritadaki ders rengini kullanır. */
export function dersVurgusu(ders: KonuDersId): CSSProperties {
  return {
    '--primary': `var(--konu-${ders}-koyu)`,
    '--primary-soft': `var(--konu-${ders})`,
    '--primary-parlak': `var(--konu-${ders}-ok)`,
    '--primary-dolu': `var(--konu-${ders}-ok)`,
    '--ring': `var(--konu-${ders}-koyu)`,
  } as CSSProperties
}
