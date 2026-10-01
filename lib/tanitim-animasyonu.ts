export const ANIMASYON_ANAHTARI = 'rabi_tur_animasyon_ayarlari'
export const VARSAYILAN_ANIMASYON = { gecisMs: 0, cerceveMs: 700, aydinlatmaGecikmesiMs: 450, aydinlatmaMs: 550, balonMs: 500, karartma: 0.68 }
export type TanitimAnimasyonu = typeof VARSAYILAN_ANIMASYON
export function animasyonuDogrula(deger: unknown): TanitimAnimasyonu {
  const sonuc = { ...VARSAYILAN_ANIMASYON }
  if (!deger || typeof deger !== 'object') return sonuc
  for (const anahtar of Object.keys(sonuc) as (keyof TanitimAnimasyonu)[]) {
    const sayi = (deger as Record<string, unknown>)[anahtar]
    if (typeof sayi === 'number' && Number.isFinite(sayi)) sonuc[anahtar] = Math.max(0, Math.min(anahtar === 'karartma' ? 0.9 : 3000, sayi))
  }
  return sonuc
}
