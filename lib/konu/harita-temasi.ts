import type { KonuDersId } from './tip'

/**
 * Konu haritasının ders başına görünüşü.
 *
 * Harita bir oyun dünyası gibi çiziliyor: yol, kitap basamakları ve zemine
 * serpilmiş soluk simgeler. Kitapların rengi **işe** ait ve derse göre
 * değişmiyor — yeşil kitap anlatım, turuncu kitap soru; yedi derste yedi
 * ayrı kitap rengi, "yeşile bas, oku" kuralını her derste yeniden öğretmek
 * olurdu. Derse ait olan iki şey var: tema bandının (ve başlığın) rengi ile
 * zemindeki simgeler. Matematik pembe ve kareköklü, Tarih kahverengi ve
 * tüylü.
 *
 * Renkler burada değil `globals.css`te (`--konu-<ders>-*`); tablo yalnızca
 * hangi değişkenin okunacağını söylüyor. Oyunlardaki ders aileleriyle
 * (`KonuAilesi`) aynı renkler **değil**: o aileler rozetlerde ve oyun
 * kartlarında kullanılıyor ve yediye ancak yetiyor; haritanın kendi paleti
 * kâğıt zeminine göre seçildi.
 */

/** Zemine serpilen simge: ya serif italik bir yazı ya da çizgi bir ikon. */
export type HaritaSimgesi = { tur: 'yazi'; metin: string } | { tur: 'cizim'; ad: CizimAdi }

/**
 * Çizim adları bileşen tarafındaki ikon tablosuyla (`konu-haritasi.tsx`)
 * birebir eşleşiyor; buradaki tür o tabloyu tipten denetliyor.
 */
export type CizimAdi =
  | 'tuy'
  | 'parsomen'
  | 'kum-saati'
  | 'sutun'
  | 'tac'
  | 'kale'
  | 'kilic'
  | 'dunya'
  | 'pusula'
  | 'dag'
  | 'harita'
  | 'bulut'
  | 'gunes'
  | 'ruzgar'
  | 'cam'
  | 'kar'
  | 'dna'
  | 'yaprak'
  | 'mikroskop'
  | 'bocek'
  | 'filiz'
  | 'balik'
  | 'cicek'
  | 'erlen'
  | 'tup'
  | 'beher'
  | 'atom'
  | 'alev'
  | 'miknatis'
  | 'simsek'
  | 'yorunge'
  | 'roket'
  | 'olcek'
  | 'tirnak'
  | 'kalem'
  | 'kitap'
  | 'diller'

export type HaritaTemasi = {
  /** Tema bandı ve program kartındaki ikonun zemini. */
  zemin: string
  /** Bandın kenar çizgisi. */
  kenar: string
  /** Başlık, etiket ve sayılar — zeminin üstünde okunan koyu ton. */
  murekkep: string
  /** İlerleme çubuğunun boş kısmı. */
  cubuk: string
  /**
   * Zemin simgeleri. Sıra rastgele değil: haritada düğüm başına bir simge
   * düşüyor ve liste başa sarıyor, yani yan yana iki düğümde aynı simgenin
   * çıkmaması için listenin bir düğüm çevriminden (8) uzun olması gerek.
   */
  simgeler: HaritaSimgesi[]
}

const yazi = (metin: string): HaritaSimgesi => ({ tur: 'yazi', metin })
const cizim = (ad: CizimAdi): HaritaSimgesi => ({ tur: 'cizim', ad })

function renkler(ders: KonuDersId): Omit<HaritaTemasi, 'simgeler'> {
  return {
    zemin: `var(--konu-${ders})`,
    kenar: `var(--konu-${ders}-kenar)`,
    murekkep: `var(--konu-${ders}-koyu)`,
    cubuk: `var(--konu-${ders}-cubuk)`,
  }
}

export const HARITA_TEMALARI: Record<KonuDersId, HaritaTemasi> = {
  matematik: {
    ...renkler('matematik'),
    simgeler: [
      yazi('√x'),
      yazi('π'),
      yazi('a²+b²'),
      yazi('∑'),
      yazi('x < y'),
      yazi('∫'),
      yazi('½ · ¾'),
      yazi('θ'),
      yazi('∞'),
      yazi('≠'),
      yazi('f(x)'),
      yazi('Δ'),
      yazi('≤'),
      yazi('x²'),
    ],
  },
  turkce: {
    ...renkler('turkce'),
    simgeler: [
      yazi('“ ”'),
      cizim('kalem'),
      yazi('¶'),
      yazi('ğ'),
      cizim('tirnak'),
      yazi('&'),
      yazi('ş'),
      cizim('kitap'),
      yazi('…'),
      yazi('§'),
      cizim('diller'),
      yazi('?!'),
      yazi('Aa'),
      yazi('—'),
    ],
  },
  fizik: {
    ...renkler('fizik'),
    simgeler: [
      yazi('F=ma'),
      cizim('miknatis'),
      yazi('λ'),
      yazi('E=mc²'),
      cizim('simsek'),
      yazi('Ω'),
      yazi('v₀'),
      cizim('yorunge'),
      yazi('ħ'),
      yazi('μ'),
      cizim('roket'),
      yazi('P=W/t'),
      cizim('olcek'),
      yazi('Δt'),
    ],
  },
  kimya: {
    ...renkler('kimya'),
    simgeler: [
      yazi('H₂O'),
      cizim('erlen'),
      yazi('pH'),
      yazi('mol'),
      cizim('tup'),
      yazi('CO₂'),
      yazi('NaCl'),
      cizim('atom'),
      yazi('⇌'),
      yazi('ΔH'),
      cizim('beher'),
      yazi('e⁻'),
      cizim('alev'),
      yazi('2H⁺'),
    ],
  },
  biyoloji: {
    ...renkler('biyoloji'),
    simgeler: [
      cizim('dna'),
      yazi('ATP'),
      cizim('yaprak'),
      yazi('G≡C'),
      cizim('mikroskop'),
      yazi('mRNA'),
      cizim('bocek'),
      yazi('n → 2n'),
      cizim('filiz'),
      yazi('C₆H₁₂O₆'),
      cizim('balik'),
      yazi('A=T'),
      cizim('cicek'),
      yazi('O₂'),
    ],
  },
  tarih: {
    ...renkler('tarih'),
    simgeler: [
      cizim('tuy'),
      cizim('parsomen'),
      yazi('MÖ'),
      cizim('kum-saati'),
      cizim('sutun'),
      yazi('1453'),
      cizim('tac'),
      cizim('kilic'),
      yazi('MS'),
      cizim('kale'),
      yazi('XV.'),
      cizim('tuy'),
      cizim('parsomen'),
      yazi('1071'),
    ],
  },
  cografya: {
    ...renkler('cografya'),
    simgeler: [
      cizim('dunya'),
      yazi('40° K'),
      cizim('pusula'),
      cizim('dag'),
      yazi('°C'),
      cizim('bulut'),
      cizim('harita'),
      yazi('hPa'),
      cizim('gunes'),
      cizim('ruzgar'),
      yazi('23°27′'),
      cizim('cam'),
      cizim('kar'),
      yazi('mm'),
    ],
  },
}

export function haritaTemasi(ders: KonuDersId): HaritaTemasi {
  return HARITA_TEMALARI[ders]
}
