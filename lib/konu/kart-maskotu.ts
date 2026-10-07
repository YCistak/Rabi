import type { MaskotPozu } from '../maskot'

/**
 * Konu kartının üstündeki tavşanın dönüşümlü pozları.
 *
 * Kartın üstünde bir süre hep "kitap okuyan" duruyordu; Emre her kartta
 * değişsin istedi ve listeyi birlikte seçtik. Hepsi bir şey okuyan, yazan,
 * anlatan ya da inceleyen pozlar: kartın işi ders anlatmak, dürbün ya da
 * yapboz gibi bağı olmayan pozlar bilerek dışarıda.
 */
export const KART_POZLARI = [
  'okuyan',
  'kitapli',
  'yazan',
  'tahtali',
  'isaretci',
  'buyutecli',
  'dusunen',
  'ayracli',
  'laptoplu',
  'abakuslu',
  'haritali',
] as const satisfies readonly MaskotPozu[]

/**
 * Destenin her kartına bir poz.
 *
 * Kartlar torbadan çekiliyor gibi dağıtılıyor: listenin hepsi bir kez
 * çıkmadan hiçbiri ikinci kez çıkmıyor; torba yenilenirken de son çıkan
 * poz yeni torbanın başına gelmiyor. Böylece art arda iki kart aynı tavşanı
 * göstermiyor. Dizi deste açılırken bir kez kuruluyor; geri dönünce kart
 * aynı tavşanla karşılıyor.
 */
export function kartPozlari(
  kartSayisi: number,
  rastgele: () => number = Math.random,
  pozlar: readonly MaskotPozu[] = KART_POZLARI,
): MaskotPozu[] {
  const sonuc: MaskotPozu[] = []
  while (sonuc.length < kartSayisi) {
    const torba = [...pozlar]
    // Fisher–Yates
    for (let i = torba.length - 1; i > 0; i--) {
      const j = Math.floor(rastgele() * (i + 1))
      ;[torba[i], torba[j]] = [torba[j], torba[i]]
    }
    if (torba.length > 1 && torba[0] === sonuc[sonuc.length - 1]) {
      ;[torba[0], torba[1]] = [torba[1], torba[0]]
    }
    sonuc.push(...torba)
  }
  return sonuc.slice(0, kartSayisi)
}
