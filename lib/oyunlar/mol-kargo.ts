import type { Zorluk } from './ritim'

/** KİM.10.1.7: katsayılar mol oranıdır; paketler tek tek molekül değildir. */
export type MolMaddesi = { formul: string; katsayi: number }
export type MolSorusu = {
  id: string
  ad: string
  tepkenler: [MolMaddesi, MolMaddesi]
  urun: MolMaddesi
  hedef: number
  zorluk: Zorluk
}

type Tepkime = Omit<MolSorusu, 'id' | 'hedef' | 'zorluk'> & {
  id: string
  zorluk: Zorluk
}

const TEPKIMELER: readonly Tepkime[] = [
  { id: 'demir-kukur', ad: 'Demir sülfür oluşumu', tepkenler: [{ formul: 'Fe', katsayi: 1 }, { formul: 'S', katsayi: 1 }], urun: { formul: 'FeS', katsayi: 1 }, zorluk: 'kolay' },
  { id: 'kalsiyum-karbonat', ad: 'Kalsiyum karbonat oluşumu', tepkenler: [{ formul: 'CaO', katsayi: 1 }, { formul: 'CO₂', katsayi: 1 }], urun: { formul: 'CaCO₃', katsayi: 1 }, zorluk: 'kolay' },
  { id: 'hidrojen-klorur', ad: 'Hidrojen klorür oluşumu', tepkenler: [{ formul: 'H₂', katsayi: 1 }, { formul: 'Cl₂', katsayi: 1 }], urun: { formul: 'HCl', katsayi: 2 }, zorluk: 'kolay' },
  { id: 'azot-monoksit', ad: 'Azot monoksit oluşumu', tepkenler: [{ formul: 'N₂', katsayi: 1 }, { formul: 'O₂', katsayi: 1 }], urun: { formul: 'NO', katsayi: 2 }, zorluk: 'kolay' },
  { id: 'su', ad: 'Su oluşumu', tepkenler: [{ formul: 'H₂', katsayi: 2 }, { formul: 'O₂', katsayi: 1 }], urun: { formul: 'H₂O', katsayi: 2 }, zorluk: 'orta' },
  { id: 'magnezyum-oksit', ad: 'Magnezyum oksit oluşumu', tepkenler: [{ formul: 'Mg', katsayi: 2 }, { formul: 'O₂', katsayi: 1 }], urun: { formul: 'MgO', katsayi: 2 }, zorluk: 'orta' },
  { id: 'sodyum-klorur', ad: 'Sodyum klorür oluşumu', tepkenler: [{ formul: 'Na', katsayi: 2 }, { formul: 'Cl₂', katsayi: 1 }], urun: { formul: 'NaCl', katsayi: 2 }, zorluk: 'orta' },
  { id: 'karbon-dioksit', ad: 'Karbon dioksit oluşumu', tepkenler: [{ formul: 'CO', katsayi: 2 }, { formul: 'O₂', katsayi: 1 }], urun: { formul: 'CO₂', katsayi: 2 }, zorluk: 'orta' },
  { id: 'amonyak', ad: 'Amonyak oluşumu', tepkenler: [{ formul: 'N₂', katsayi: 1 }, { formul: 'H₂', katsayi: 3 }], urun: { formul: 'NH₃', katsayi: 2 }, zorluk: 'zor' },
  { id: 'demir-oksit', ad: 'Demir(III) oksit oluşumu', tepkenler: [{ formul: 'Fe', katsayi: 4 }, { formul: 'O₂', katsayi: 3 }], urun: { formul: 'Fe₂O₃', katsayi: 2 }, zorluk: 'zor' },
  { id: 'kukurtdioksit', ad: 'Kükürt trioksit oluşumu', tepkenler: [{ formul: 'SO₂', katsayi: 2 }, { formul: 'O₂', katsayi: 1 }], urun: { formul: 'SO₃', katsayi: 2 }, zorluk: 'zor' },
  { id: 'azot-dioksit', ad: 'Azot dioksit oluşumu', tepkenler: [{ formul: 'NO', katsayi: 2 }, { formul: 'O₂', katsayi: 1 }], urun: { formul: 'NO₂', katsayi: 2 }, zorluk: 'zor' },
]

export const MOL_HAVUZU: readonly MolSorusu[] = TEPKIMELER.flatMap((tepkime) =>
  [1, 2].map((carpan) => ({
    ...tepkime,
    id: `${tepkime.id}-${carpan}`,
    hedef: tepkime.urun.katsayi * carpan,
  })),
)

export type MolYuku = [number, number]

/** KİM.10.1.7: tepkime ilerlemesi kesirli mol de olabilir. */
export function uretim(soru: MolSorusu, yuk: MolYuku) {
  const tur = Math.min(...soru.tepkenler.map((madde, i) => yuk[i] / madde.katsayi))
  return {
    urun: tur * soru.urun.katsayi,
    kalan: soru.tepkenler.map((madde, i) => yuk[i] - tur * madde.katsayi) as MolYuku,
  }
}

export function dogruYuk(soru: MolSorusu): MolYuku {
  const carpan = soru.hedef / soru.urun.katsayi
  return soru.tepkenler.map((madde) => madde.katsayi * carpan) as MolYuku
}

export function dogruMu(soru: MolSorusu, yuk: MolYuku): boolean {
  const sonuc = uretim(soru, yuk)
  return sonuc.urun === soru.hedef && sonuc.kalan.every((miktar) => miktar === 0)
}

export function kargoAciklamasi(soru: MolSorusu): string {
  const yuk = dogruYuk(soru)
  return `${yuk[0]} mol ${soru.tepkenler[0].formul} + ${yuk[1]} mol ${soru.tepkenler[1].formul} → ${soru.hedef} mol ${soru.urun.formul}`
}

export function kargoSorusuMetni(soru: MolSorusu): string {
  return `${soru.hedef} mol ${soru.urun.formul} üret; tepken artmasın.`
}
