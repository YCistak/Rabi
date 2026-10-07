import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import sharp from 'sharp'
import { MASKOT_POZLARI, MASKOT_YAN_BOSLUK, gorunurKutu, gununPozu, pozGorseli } from './maskot'

describe('maskot pozları', () => {
  it('her pozun üretilmiş bir dosyası var', () => {
    const eksik = MASKOT_POZLARI.filter(
      (poz) => !existsSync(join(process.cwd(), 'public', pozGorseli(poz))),
    )
    expect(eksik).toEqual([])
  })

  it('poz adları tekrarlanmıyor', () => {
    expect(new Set(MASKOT_POZLARI).size).toBe(MASKOT_POZLARI.length)
  })
})

/** Görselin alfa kanalından ölçülen saydam yan boşluk (sol, sağ). */
async function yanBosluk(poz: (typeof MASKOT_POZLARI)[number]): Promise<[number, number]> {
  const { data, info } = await sharp(join(process.cwd(), 'public', pozGorseli(poz)))
    .ensureAlpha()
    .extractChannel(3)
    .raw()
    .toBuffer({ resolveWithObject: true })
  const doluMu = (x: number) => {
    for (let y = 0; y < info.height; y++) if (data[y * info.width + x] > 0) return true
    return false
  }
  let sol = 0
  while (sol < info.width && !doluMu(sol)) sol++
  let sag = 0
  while (sag < info.width && !doluMu(info.width - 1 - sag)) sag++
  return [sol, sag]
}

describe('MASKOT_YAN_BOSLUK', () => {
  it('her pozun görseliyle uyuşuyor', async () => {
    const farkli: string[] = []
    for (const poz of MASKOT_POZLARI) {
      const olculen = await yanBosluk(poz)
      if (olculen.join() !== MASKOT_YAN_BOSLUK[poz].join()) farkli.push(`${poz}: ${olculen.join(', ')}`)
    }
    expect(farkli).toEqual([])
  })

  it('görünen kutuyu çizim boyutuna ölçekliyor', () => {
    // okuyan: 66 + 66 boşluk, 124 piksel tavşan; 128'de yarısı.
    expect(gorunurKutu('okuyan', 128)).toEqual({ sol: 33, genislik: 62 })
  })
})

describe('gununPozu', () => {
  const pozlar = ['a', 'b', 'c'] as const

  it('aynı gün aynı pozu, ardışık günler farklı pozları veriyor', () => {
    expect(gununPozu('2026-10-04', pozlar)).toBe(gununPozu('2026-10-04', pozlar))
    const uc = ['2026-10-04', '2026-10-05', '2026-10-06'].map((g) => gununPozu(g, pozlar))
    expect(new Set(uc).size).toBe(3)
  })

  it('ay ve yıl sınırında da sırayla ilerliyor', () => {
    const i = (g: string) => pozlar.indexOf(gununPozu(g, pozlar))
    expect((i('2026-12-31') + 1) % 3).toBe(i('2027-01-01'))
    expect((i('2028-02-28') + 1) % 3).toBe(i('2028-02-29'))
  })

  it('kaydırma aynı günün başka bir pozunu seçiyor', () => {
    expect(gununPozu('2026-10-04', pozlar, 1)).not.toBe(gununPozu('2026-10-04', pozlar))
  })
})
