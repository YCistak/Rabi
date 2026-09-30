/** OCR olasılıklarını metne ve tespit haritasını satır kutularına dönüştürür. */
export type OkumaKutusu = { sol: number; ust: number; sag: number; alt: number }

export function ctcCoz(veri: Float32Array, sinifSayisi: number, karakterler: string[]): { metin: string; guven: number } {
  let onceki = 0
  let metin = ''
  let toplam = 0
  let adet = 0
  for (let bas = 0; bas < veri.length; bas += sinifSayisi) {
    let enIyi = 0
    for (let i = 1; i < sinifSayisi; i++) if (veri[bas + i] > veri[bas + enIyi]) enIyi = i
    if (enIyi !== 0 && enIyi !== onceki) {
      metin += karakterler[enIyi] ?? ''
      toplam += veri[bas + enIyi]
      adet++
    }
    onceki = enIyi
  }
  return { metin: metin.trim(), guven: adet ? toplam / adet : 0 }
}

export function kutulariBul(veri: Float32Array, en: number, boy: number): OkumaKutusu[] {
  const gorulen = new Uint8Array(en * boy)
  const kuyruk = new Int32Array(en * boy)
  const kutular: OkumaKutusu[] = []
  for (let i = 0; i < veri.length; i++) {
    if (gorulen[i] || veri[i] < 0.3) continue
    let bas = 0, son = 1, toplam = 0
    kuyruk[0] = i
    gorulen[i] = 1
    let sol = en, sag = 0, ust = boy, alt = 0
    while (bas < son) {
      const yer = kuyruk[bas++]
      const x = yer % en, y = Math.floor(yer / en)
      sol = Math.min(sol, x); sag = Math.max(sag, x)
      ust = Math.min(ust, y); alt = Math.max(alt, y)
      toplam += veri[yer]
      for (const komsu of [x > 0 ? yer - 1 : -1, x + 1 < en ? yer + 1 : -1, y > 0 ? yer - en : -1, y + 1 < boy ? yer + en : -1]) {
        if (komsu >= 0 && !gorulen[komsu] && veri[komsu] >= 0.3) {
          gorulen[komsu] = 1
          kuyruk[son++] = komsu
        }
      }
    }
    if (son < 12 || toplam / son < 0.5 || sag - sol < 4 || alt - ust < 2) continue
    // DB tespiti yazının içini verir; pay olmazsa üst/alt harf parçaları kesilir.
    const pay = Math.max(2, (alt - ust) * 0.6)
    kutular.push({ sol: Math.max(0, sol-pay), sag: Math.min(en, sag+pay+1), ust: Math.max(0, ust-pay), alt: Math.min(boy, alt+pay+1) })
  }
  return kutular.sort((a,b) => a.ust-b.ust || a.sol-b.sol).slice(0, 100)
}

export function okumalariSirala(okumalar: (OkumaKutusu & { metin: string })[]): string {
  const satirlar: (OkumaKutusu & { metin: string })[][] = []
  for (const okuma of [...okumalar].sort((a,b) => (a.ust+a.alt)-(b.ust+b.alt))) {
    const orta = (okuma.ust+okuma.alt)/2
    const satir = satirlar.find((s) => {
      const ilk = s[0]
      return Math.abs(orta-(ilk.ust+ilk.alt)/2) < Math.min(okuma.alt-okuma.ust, ilk.alt-ilk.ust)*0.5
    })
    if (satir) satir.push(okuma)
    else satirlar.push([okuma])
  }
  return satirlar.map((s) => s.sort((a,b) => a.sol-b.sol).map((o) => o.metin).join(' ')).join('\n')
}
