import {
  birim,
  bosSinir,
  bosYon,
  cemberParcalari,
  cizgilerDen,
  etiketleriAyir,
  etiketOlustur,
  etiketTuru,
  KENAR,
  kirikYol,
  kutuDestek,
  okUcu,
  SEKIL_GENISLIGI,
  sahneyiKapat,
  sinirEkle,
  yay,
  YAZI_BOYU,
  yaz,
  yon,
  yonaKoy,
  YUK_SINIRI,
  yuvarla,
  type CizgiRengi,
  type IcEtiket,
  type Nokta,
  type Parca,
  type Sahne,
  type SahneDolgusu,
  type Sinir,
} from './sekil'
import { kolunIcinde } from './gorsel-denetim'
import type { AciYayi, DevreGorseli, DevreKolu, DuzenekGorseli, Konum, OptikArac, OptikGorseli, Pencere, Yazi } from './tip'

/*
  Fizik şekillerinin yerleşimi (saf): devre, optik, düzenek.

  Hepsi `sekil.ts`teki `Sahne`yi üretiyor; çizen bileşen geometri şekliyle
  aynı (`SahneCizimi`), yani çizgi kalınlığı, yazı boyu, etiket itme ve iki
  tema davranışı matematik şekilleriyle bir. Veri `tip.ts`teki şemada:
  kartezyen (y yukarı), açılar derece. Ekran y'si aşağı, dönüşüm burada.

  Kitap çizim dili: koyu nötr 1,6–2 px çizgi; ayna, mercek ve zemin biraz
  kalın; ışın ve ip ince. Semboller Türk ders kitabındaki gibi: direnç
  zikzak, pil uzun (+) ve kısa kalın (−) levha, lamba içi çarpılı daire,
  ampermetre/voltmetre harfli daire, reosta oklu zikzak.
*/

const IZIN_GEN = SEKIL_GENISLIGI - 2 * KENAR
const IZIN_YUK = YUK_SINIRI - 2 * KENAR
const derece = (a: number) => (a * Math.PI) / 180
const sinirla = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const uzaklik = (a: Nokta, b: Nokta) => Math.hypot(a.x - b.x, a.y - b.y)
const topla = (a: Nokta, b: Nokta, k = 1): Nokta => ({ x: a.x + b.x * k, y: a.y + b.y * k })

/** Şekil parçalarını biriktiren yardımcı: yollar, oklar, yazılar ve yazıların kaçtığı engeller. */
class Kurucu {
  yollar: Sahne['yollar'] = []
  okUclari: Sahne['okUclari'] = []
  cemberler: Sahne['cemberler'] = []
  noktalar: Sahne['noktalar'] = []
  etiketler: IcEtiket[] = []
  engeller: Parca[] = []
  yaylar: string[] = []
  sinir: Sinir = bosSinir()

  cizgi(n: Nokta[], s: { kalinlik?: number; renk?: CizgiRengi; kesik?: boolean; kapali?: boolean; dolgu?: SahneDolgusu; kenarsiz?: boolean; kutUc?: boolean; engel?: boolean } = {}) {
    if (n.length < 2) return
    this.yollar.push({
      d: kirikYol(n, !!s.kapali),
      renk: s.renk ?? 'on',
      kalinlik: s.kalinlik ?? 1.8,
      ...(s.kesik ? { kesik: true } : {}),
      ...(s.dolgu ? { dolgu: s.dolgu } : {}),
      ...(s.kenarsiz ? { kenarsiz: true } : {}),
      ...(s.kutUc ? { kutUc: true } : {}),
    })
    if (s.engel !== false) this.engeller.push(...cizgilerDen(n, !!s.kapali))
    for (const p of n) sinirEkle(this.sinir, p.x, p.y)
  }

  yol(d: string, kalinlik: number, renk: CizgiRengi = 'on', dolgu?: SahneDolgusu) {
    this.yollar.push({ d, renk, kalinlik, ...(dolgu ? { dolgu } : {}) })
  }

  ok(uc: Nokta, onceki: Nokta, boy = 9, renk: CizgiRengi = 'on') {
    this.okUclari.push({ d: okUcu(uc, onceki, boy), renk })
    this.engeller.push({ a: uc, b: topla(uc, birim({ x: onceki.x - uc.x, y: onceki.y - uc.y }), boy) })
  }

  cember(m: Nokta, r: number, dolu = true) {
    this.cemberler.push({ x: yuvarla(m.x), y: yuvarla(m.y), r: yuvarla(r), renk: 'on', dolu })
    this.engeller.push(...cemberParcalari(m, r, 16))
    sinirEkle(this.sinir, m.x - r, m.y - r)
    sinirEkle(this.sinir, m.x + r, m.y + r)
  }

  nokta(m: Nokta, s: { bos?: boolean; r?: number } = {}) {
    this.noktalar.push({ x: yuvarla(m.x), y: yuvarla(m.y), bos: !!s.bos, renk: 'on', ...(s.r ? { r: s.r } : {}) })
    this.engeller.push(...cemberParcalari(m, (s.r ?? 3.1) + 0.5, 6))
  }

  /** Yazıyı `merkez`den `aci` yönünde çizgilere değmeyecek kadar uzağa koyar. */
  yazi(metin: string, merkez: Nokta, aci: number, s: { boy?: number; bosluk?: number; hareket?: number; kalin?: boolean } = {}) {
    const e = etiketOlustur(metin, s.boy ?? YAZI_BOYU.uzunluk, merkez.x, merkez.y, s.hareket ?? 0.6, 'on', s.kalin ?? true)
    yonaKoy(e, merkez, aci, s.bosluk ?? 5, this.engeller)
    this.etiketler.push(e)
    return e
  }

  /** Verinin koyduğu yerde duran yazı (ortam adı, ölçü); simgeler yerinden oynamaz. */
  serbestYazi(y: Yazi, P: (k: Konum) => Nokta) {
    const p = P(y.konum)
    const e = etiketOlustur(y.ad, YAZI_BOYU.serbest, p.x, p.y, 0.35, 'on', true)
    if (e.simge) e.hareket = 0
    this.etiketler.push(e)
  }

  /** Açı yayı ve yazısı; `bas`/`son` ekran açısı (radyan, artan yönde). */
  aciYayi(m: Nokta, bas: number, aciGen: number, ad?: string, r?: number) {
    if (aciGen <= 0.005) return
    const yaricap = r ?? (aciGen < derece(28) ? 34 : 22)
    this.yaylar.push(yay(m, yaricap, bas, bas + aciGen))
    for (let i = 0; i < 6; i++) {
      const a1 = bas + (aciGen * i) / 6
      const a2 = bas + (aciGen * (i + 1)) / 6
      this.engeller.push({ a: topla(m, yon(a1), yaricap), b: topla(m, yon(a2), yaricap) })
    }
    if (!ad) return
    const orta = bas + aciGen / 2
    const e = etiketOlustur(ad, YAZI_BOYU.aci, 0, 0, 0.5)
    // Dar açıda yazı kolların arasına sığacak kadar uzakta.
    const yarim = aciGen / 2
    const destek = kutuDestek(e.gen, e.yuk, yon(orta + Math.PI / 2))
    const enAz = yarim < Math.PI / 2 ? (destek + 2) / Math.max(Math.sin(yarim), 0.2) : 0
    const u = Math.min(Math.max(yaricap + 3 + kutuDestek(e.gen, e.yuk, yon(orta)), enAz), yaricap + 46)
    e.x = e.hx = m.x + Math.cos(orta) * u
    e.y = e.hy = m.y + Math.sin(orta) * u
    this.etiketler.push(e)
  }

  bitir(aciklama: string, ek: Partial<Sahne> = {}) {
    etiketleriAyir(this.etiketler, this.engeller)
    return sahneyiKapat(
      {
        yollar: this.yollar,
        okUclari: this.okUclari,
        cemberler: this.cemberler,
        noktalar: this.noktalar,
        etiketler: [],
        yaylar: this.yaylar.join(' ') || undefined,
        aciklama,
        ...ek,
      },
      this.sinir,
      this.etiketler,
    )
  }
}

/**
 * Bir doğrunun sağ yanına (ekranda yürüme yönüne göre) eğik tarama çizgileri:
 * zemin, aynanın arkası. `n` taranan yanın birim normali.
 */
export function taramaYolu(n: Nokta[], aralik = 7, boy = 7, ters = false): string {
  let d = ''
  for (let i = 0; i + 1 < n.length; i++) {
    const a = n[i]
    const b = n[i + 1]
    const u = birim({ x: b.x - a.x, y: b.y - a.y })
    const yan = ters ? { x: u.y, y: -u.x } : { x: -u.y, y: u.x }
    const egik = birim(topla(yan, u, -0.8))
    const L = uzaklik(a, b)
    const adet = Math.max(1, Math.floor(L / aralik))
    const pay = (L - (adet - 1) * aralik) / 2
    for (let k = 0; k < adet; k++) {
      const p = topla(a, u, pay + k * aralik)
      d += `M ${yaz(p)} L ${yaz(topla(p, egik, boy))} `
    }
  }
  return d.trim()
}

/** Ölçeği şekil + yazılar kutuya sığana kadar küçültür. */
function sigdir<T extends { gen: number; yuk: number }>(baslangic: number, enAz: number, kur: (olcek: number) => T, icerik: (olcek: number) => { gen: number; yuk: number }): T {
  let olcek = baslangic
  let sonuc = kur(olcek)
  for (let i = 0; i < 5; i++) {
    if (sonuc.gen <= IZIN_GEN + 0.5 && sonuc.yuk <= IZIN_YUK + 0.5) break
    const ic = icerik(olcek)
    const tasGen = sonuc.gen - ic.gen
    const tasYuk = sonuc.yuk - ic.yuk
    const oran = Math.min(ic.gen > 0 ? (IZIN_GEN - tasGen) / ic.gen : 1, ic.yuk > 0 ? (IZIN_YUK - tasYuk) / ic.yuk : 1)
    const yeni = Math.max(enAz, olcek * sinirla(oran, 0.4, 0.97))
    if (yeni >= olcek - 0.01) break
    olcek = yeni
    sonuc = kur(olcek)
  }
  return sonuc
}

// ── Devre ────────────────────────────────────────────────────────────────────

const ELEMAN_ADI: Record<DevreKolu['eleman'], string> = {
  tel: 'tel',
  direnc: 'direnç',
  pil: 'pil',
  lamba: 'lamba',
  anahtar: 'anahtar',
  ampermetre: 'ampermetre',
  voltmetre: 'voltmetre',
  reosta: 'reosta',
}

/** T birleşimini ikiye bölünmemiş teli birleşim noktalarından böler (veri unutursa). */
export function devreKollari(kollar: DevreKolu[]): DevreKolu[] {
  const uclar = kollar.flatMap((k) => [k.bas, k.bit])
  return kollar.flatMap((k) => {
    if (k.eleman !== 'tel') return [k]
    const ic = uclar.filter((p) => kolunIcinde(p, k))
    if (!ic.length) return [k]
    const vx = k.bit[0] - k.bas[0]
    const vy = k.bit[1] - k.bas[1]
    const t = (p: Konum) => ((p[0] - k.bas[0]) * vx + (p[1] - k.bas[1]) * vy) / (vx * vx + vy * vy)
    const sira = [k.bas, ...[...new Map(ic.map((p) => [`${p[0]},${p[1]}`, p])).values()].sort((a, b) => t(a) - t(b)), k.bit]
    // Akım oku yalnız ilk parçada kalır; aynı telde iki ok yanıltır.
    return sira.slice(0, -1).map((p, i) => ({ ...k, bas: p, bit: sira[i + 1], ...(i > 0 ? { akim: undefined } : {}) }))
  })
}

/** Kolun üstündeki yazı: "R₁ = 4 Ω", yalnız ad ya da yalnız değer. */
export function kolYazisi(k: Pick<DevreKolu, 'ad' | 'deger'>): string | undefined {
  const ad = k.ad?.trim()
  const deger = k.deger?.trim()
  if (ad && deger) return `${ad} = ${deger}`
  return ad || deger || undefined
}

const anahtar = (p: Konum) => `${yuvarla(p[0])},${yuvarla(p[1])}`

export function devreSahnesi(g: DevreGorseli): Sahne {
  const kollar = devreKollari(g.kollar)
  const xs = kollar.flatMap((k) => [k.bas[0], k.bit[0]])
  const ys = kollar.flatMap((k) => [k.bas[1], k.bit[1]])
  const enX = Math.max(Math.max(...xs) - Math.min(...xs), 0.5)
  const enY = Math.max(Math.max(...ys) - Math.min(...ys), 0.5)
  const ilk = sinirla(Math.min((IZIN_GEN - 76) / enX, (IZIN_YUK - 64) / enY), 30, 84)
  return sigdir(ilk, 28, (b) => devreKur(g, kollar, b), (b) => ({ gen: enX * b, yuk: enY * b })).sahne
}

function devreKur(g: DevreGorseli, kollar: DevreKolu[], birimBoy: number) {
  const tumX = kollar.flatMap((k) => [k.bas[0], k.bit[0]])
  const tumY = kollar.flatMap((k) => [k.bas[1], k.bit[1]])
  const minX = Math.min(...tumX)
  const maxY = Math.max(...tumY)
  const P = (p: Konum): Nokta => ({ x: (p[0] - minX) * birimBoy, y: (maxY - p[1]) * birimBoy })
  const k = new Kurucu()
  const parcalar = kollar.map((kol) => ({ a: P(kol.bas), b: P(kol.bit) }))
  for (const s of parcalar) {
    sinirEkle(k.sinir, s.a.x, s.a.y)
    sinirEkle(k.sinir, s.b.x, s.b.y)
  }
  const merkez = { x: (k.sinir.minX + k.sinir.maxX) / 2, y: (k.sinir.minY + k.sinir.maxY) / 2 }

  // Yazının konacağı yan: ışın atınca öbür kollara daha uzak olan yan; eşitse devrenin dışı.
  const isinUzunlugu = (c: Nokta, n: Nokta, kendi: number) => {
    let en = Infinity
    parcalar.forEach((s, i) => {
      if (i === kendi) return
      const vx = s.b.x - s.a.x
      const vy = s.b.y - s.a.y
      const bolen = n.x * vy - n.y * vx
      if (Math.abs(bolen) < 1e-9) return
      const t = ((s.a.x - c.x) * vy - (s.a.y - c.y) * vx) / bolen
      const u = ((s.a.x - c.x) * n.y - (s.a.y - c.y) * n.x) / bolen
      if (t > 1 && u >= -0.01 && u <= 1.01) en = Math.min(en, t)
    })
    return en
  }

  const aciklama: string[] = []
  const ertelenen: (() => void)[] = []
  kollar.forEach((kol, i) => {
    const { a, b } = parcalar[i]
    const L = uzaklik(a, b)
    const u = birim({ x: b.x - a.x, y: b.y - a.y })
    const n = { x: -u.y, y: u.x }
    const c = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    const arti = isinUzunlugu(c, n, i)
    const eksi = isinUzunlugu(c, { x: -n.x, y: -n.y }, i)
    let o = arti > eksi + 2 ? 1 : eksi > arti + 2 ? -1 : (c.x - merkez.x) * n.x + (c.y - merkez.y) * n.y > 0.5 ? 1 : (c.x - merkez.x) * n.x + (c.y - merkez.y) * n.y < -0.5 ? -1 : n.y + n.x * 0.01 < 0 ? 1 : -1
    if (!Number.isFinite(o)) o = 1
    const Y = (t: number, h: number) => ({ x: c.x + u.x * t + n.x * h * o, y: c.y + u.y * t + n.y * h * o })

    let uzun = 0
    let yari = 0
    const e = kol.eleman
    if (e === 'direnc' || e === 'reosta') {
      uzun = Math.min(34, L - 10)
      const genlik = 6.5
      const zik: Nokta[] = [Y(-uzun / 2, 0)]
      for (let z = 0; z < 6; z++) zik.push(Y(-uzun / 2 + ((z + 0.5) * uzun) / 6, z % 2 ? -genlik : genlik))
      zik.push(Y(uzun / 2, 0))
      k.cizgi(zik, { kalinlik: 1.7 })
      yari = genlik
      if (e === 'reosta') {
        const bas = Y(-uzun * 0.5, -genlik - 6)
        const uc = Y(uzun * 0.5, genlik + 8)
        k.cizgi([bas, uc], { kalinlik: 1.3 })
        k.ok(uc, bas, 7.5)
        yari = genlik + 9
      }
    } else if (e === 'lamba') {
      const r = 11
      uzun = 2 * r
      // İçi boş: çarpı çizgileri dairenin üstünde kalsın (dolu daire yolların üstüne çiziliyor).
      k.cember(c, r, false)
      const d = r * 0.68
      k.cizgi([Y(-d, -d), Y(d, d)], { kalinlik: 1.4, engel: false })
      k.cizgi([Y(-d, d), Y(d, -d)], { kalinlik: 1.4, engel: false })
      yari = r
    } else if (e === 'ampermetre' || e === 'voltmetre') {
      const r = 12
      uzun = 2 * r
      k.cember(c, r)
      k.etiketler.push(etiketOlustur(e === 'ampermetre' ? 'A' : 'V', YAZI_BOYU.harf - 1, c.x, c.y, 0))
      yari = r
    } else if (e === 'pil') {
      uzun = 8
      const artiBas = kol.arti !== 'bit'
      const uzunLevha = artiBas ? -4 : 4
      k.cizgi([Y(uzunLevha, -12), Y(uzunLevha, 12)], { kalinlik: 1.7, kutUc: true })
      k.cizgi([Y(-uzunLevha, -6.5), Y(-uzunLevha, 6.5)], { kalinlik: 3.6, kutUc: true })
      yari = 12
    } else if (e === 'anahtar') {
      uzun = 28
      const sol = Y(-14, 0)
      const sag = Y(14, 0)
      const uc = kol.kapali ? sag : Y(-14 + 28 * Math.cos(derece(28)), 28 * Math.sin(derece(28)))
      k.cizgi([sol, uc], { kalinlik: 1.8 })
      k.nokta(sol, { bos: true, r: 2.6 })
      k.nokta(sag, { bos: true, r: 2.6 })
      yari = kol.kapali ? 4 : 14
    }
    // Teller: elemanın iki yanı.
    const telBas = uzun ? Y(-uzun / 2, 0) : b
    const telBit = uzun ? Y(uzun / 2, 0) : a
    if (uzun) {
      k.cizgi([a, telBas])
      k.cizgi([telBit, b])
      // Yazının engeli: sembolün kutusu.
      const kose = [Y(-uzun / 2, -yari), Y(uzun / 2, -yari), Y(uzun / 2, yari), Y(-uzun / 2, yari)]
      k.engeller.push(...cizgilerDen(kose, true))
    } else k.cizgi([a, b])

    const yazi = kolYazisi(kol)
    const disYon = Math.atan2(n.y * o, n.x * o)
    if (yazi || kol.icDirenc) {
      ertelenen.push(() => {
        let dayanak = Y(0, yari)
        if (yazi) {
          const ana = k.yazi(yazi, dayanak, disYon, { bosluk: 4 })
          dayanak = { x: ana.x + Math.cos(disYon) * kutuDestek(ana.gen, ana.yuk, yon(disYon)), y: ana.y + Math.sin(disYon) * kutuDestek(ana.gen, ana.yuk, yon(disYon)) }
        }
        if (kol.icDirenc) {
          const ic = kol.icDirenc.includes('=') ? kol.icDirenc : `r = ${kol.icDirenc}`
          // Yazı yana açılıyorsa iç direnç emk'nın altına: yan yana dizilince "r = … ε = …" diye tersten okunuyordu.
          const yana = Math.abs(Math.cos(disYon)) > 0.7
          if (yana && yazi) {
            const ana = k.etiketler[k.etiketler.length - 1]
            const e = etiketOlustur(ic, YAZI_BOYU.aci, ana.x, ana.y + ana.yuk / 2 + 10, 0.4, 'on', false)
            e.x = e.hx = ana.x + (Math.cos(disYon) > 0 ? (e.gen - ana.gen) / 2 : (ana.gen - e.gen) / 2)
            k.etiketler.push(e)
          } else k.yazi(ic, dayanak, disYon, { bosluk: 2, boy: YAZI_BOYU.aci, kalin: false })
        }
      })
    }

    if (kol.akim) {
      // Ok telin elemansız kısmında: elemanın iki yanından uzun olanın ortası.
      const l1 = uzaklik(a, telBas)
      const l2 = uzaklik(telBit, b)
      const m = !uzun ? c : l2 >= l1 ? { x: (telBit.x + b.x) / 2, y: (telBit.y + b.y) / 2 } : { x: (a.x + telBas.x) / 2, y: (a.y + telBas.y) / 2 }
      const yonu = kol.akim.yon === 'geri' ? { x: -u.x, y: -u.y } : u
      const uc = topla(m, yonu, 5)
      k.ok(uc, topla(m, yonu, -5), 9.5)
      const ad = kol.akim.ad?.trim()
      // Elemanın yazısı dış yanda; akımın adı öbür yanda kalsın, ikisi sıkışmasın.
      const akimYonu = uzun && yazi ? disYon + Math.PI : disYon
      if (ad) ertelenen.push(() => k.yazi(ad, m, akimYonu, { boy: YAZI_BOYU.aci, bosluk: 6 }))
    }
    if (e !== 'tel') aciklama.push(`${kol.eleman === 'anahtar' ? (kol.kapali ? 'kapalı ' : 'açık ') : ''}${ELEMAN_ADI[e]}${yazi ? ` ${yazi}` : ''}`)
  })

  // Düğümler: üç ve daha çok kolun birleştiği yer ve verinin adlı düğümleri.
  const sayac = new Map<string, { p: Konum; yonler: number[] }>()
  kollar.forEach((kol, i) => {
    const { a, b } = parcalar[i]
    for (const [uc, ote, ham] of [[a, b, kol.bas], [b, a, kol.bit]] as const) {
      const d = sayac.get(anahtar(ham)) ?? { p: ham, yonler: [] }
      d.yonler.push(Math.atan2(ote.y - uc.y, ote.x - uc.x))
      sayac.set(anahtar(ham), d)
    }
  })
  const adlilar = new Map((g.dugumler ?? []).map((d) => [anahtar(d.konum), d]))
  for (const [kim, d] of sayac) if (d.yonler.length >= 3 && !adlilar.has(kim)) k.nokta(P(d.p), { r: 3.3 })
  for (const [kim, d] of adlilar) {
    const p = P(d.konum)
    k.nokta(p, { r: 3.3 })
    const ad = d.ad?.trim()
    if (!ad) continue
    const yonler = sayac.get(kim)?.yonler ?? []
    ertelenen.unshift(() => k.yazi(ad, p, bosYon(yonler, Math.atan2(p.y - merkez.y, p.x - merkez.x)), { boy: YAZI_BOYU.harf, bosluk: 4, hareket: 0.4 }))
  }
  // Yazılar bütün çizgiler konduktan sonra: sonra çizilen kola binmesinler.
  for (const f of ertelenen) f()

  return k.bitir(`Elektrik devresi${aciklama.length ? `: ${aciklama.join(', ')}` : ''}`)
}

// ── Pencereli şekiller (optik, düzenek) ──────────────────────────────────────

function pencereDonusumu(p: Pencere, olcek: number) {
  const [sol, , , ust] = p
  return (k: Konum): Nokta => ({ x: (k[0] - sol) * olcek, y: (ust - k[1]) * olcek })
}

function pencereOlcegi(p: Pencere) {
  const gen = p[1] - p[0]
  const yuk = p[3] - p[2]
  return Math.min((IZIN_GEN - 24) / gen, (IZIN_YUK - 24) / yuk, 90)
}

/** Veri açısını (saat yönünün tersine) ekran açısına çevirir. */
const ekranAcisi = (a: number) => -derece(a)

function acilariCiz(k: Kurucu, acilar: AciYayi[] | undefined, P: (k: Konum) => Nokta) {
  for (const a of acilar ?? []) {
    const gen = ((((a.bit - a.bas) % 360) + 360) % 360) || 0
    if (!gen) continue
    k.aciYayi(P(a.merkez), ekranAcisi(a.bit), derece(gen), a.ad?.trim() || undefined)
  }
}

/** Pencere dikdörtgenini bir doğrunun bir yanında kalan çokgene kırpar. */
export function yariDuzlemKirp(cokgen: Nokta[], a: Nokta, n: Nokta): Nokta[] {
  const f = (p: Nokta) => (p.x - a.x) * n.x + (p.y - a.y) * n.y
  const cikti: Nokta[] = []
  for (let i = 0; i < cokgen.length; i++) {
    const p = cokgen[i]
    const q = cokgen[(i + 1) % cokgen.length]
    const fp = f(p)
    const fq = f(q)
    if (fp >= 0) cikti.push(p)
    if (fp >= 0 !== fq >= 0) {
      const t = fp / (fp - fq)
      cikti.push({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t })
    }
  }
  return cikti
}

// ── Optik ────────────────────────────────────────────────────────────────────

type EgriAyna = Extract<OptikArac, { tur: 'cukurAyna' | 'tumsekAyna' | 'inceMercek' | 'kalinMercek' }>
const egriMi = (a: OptikArac): a is EgriAyna => a.tur === 'cukurAyna' || a.tur === 'tumsekAyna' || a.tur === 'inceMercek' || a.tur === 'kalinMercek'
type OkluAraci = Extract<OptikArac, { tur: 'cisim' | 'goruntu' }>
const aynaMi = (a: OptikArac) => a.tur === 'cukurAyna' || a.tur === 'tumsekAyna'

/**
 * Görüntü sanal mı: verinin `sanal` alanı, yoksa fizikten. Ayna arkasındaki
 * görüntü sanaldır; mercekte cisimle aynı yandaki görüntü sanaldır.
 */
export function goruntuSanalMi(g: OptikGorseli, a: OkluAraci): boolean {
  if (a.sanal !== undefined) return a.sanal
  const arac = g.araclar.find((x) => egriMi(x) || x.tur === 'duzlemAyna')
  if (!arac) return false
  if (arac.tur === 'duzlemAyna') {
    const dx = arac.bit[0] - arac.bas[0]
    const dy = arac.bit[1] - arac.bas[1]
    // Bas → bit yönünün sağı aynanın arkası.
    return (a.bas[0] - arac.bas[0]) * dy - (a.bas[1] - arac.bas[1]) * dx > 1e-9
  }
  const egri = arac as EgriAyna
  const yan = Math.sign(a.bas[0] - egri.merkez[0])
  if (aynaMi(egri)) return yan === (egri.yon === 'sag' ? -1 : 1)
  const cisim = g.araclar.find((x) => x.tur === 'cisim') as OkluAraci | undefined
  return !!cisim && yan === Math.sign(cisim.bas[0] - egri.merkez[0])
}

export function optikSahnesi(g: OptikGorseli): Sahne {
  const gen = g.pencere[1] - g.pencere[0]
  const yuk = g.pencere[3] - g.pencere[2]
  return sigdir(pencereOlcegi(g.pencere), 14, (o) => optikKur(g, o), (o) => ({ gen: gen * o, yuk: yuk * o })).sahne
}

function optikKur(g: OptikGorseli, olcek: number) {
  const P = pencereDonusumu(g.pencere, olcek)
  const k = new Kurucu()
  const [sol, sag, alt, ust] = g.pencere
  const kose = [P([sol, ust]), P([sag, ust]), P([sag, alt]), P([sol, alt])]
  for (const p of kose) sinirEkle(k.sinir, p.x, p.y)
  const aciklama: string[] = []
  const egriler = g.araclar.filter(egriMi)

  // Asal eksen: eğri ayna/merceklerin yatay ekseni, pencere boyunca ince.
  for (const y of [...new Set(egriler.map((a) => a.merkez[1]))]) k.cizgi([P([sol, y]), P([sag, y])], { kalinlik: 1.1, renk: 'soluk', engel: true })

  // Işının aynaya değdiği noktayı aynanın eğrisine oturtmak için.
  const oturt: ((p: Nokta) => Nokta)[] = []
  const odakYazilari: (() => void)[] = []

  for (const a of g.araclar) {
    if (a.tur === 'duzlemAyna') {
      const n = [P(a.bas), P(a.bit)]
      k.cizgi(n, { kalinlik: 2.6 })
      k.yol(taramaYolu(n, 6.5, 7), 1.1)
      aciklama.push('düzlem ayna')
    } else if (egriMi(a)) {
      const m = P(a.merkez)
      const h = (a.boy / 2) * olcek
      const f = a.yon === 'sag' ? 1 : -1
      if (aynaMi(a)) {
        const sarkma = sinirla(h * 0.16, 5, 14)
        // Kenarların tepeye göre kayması: çukurda bakılan yana, tümsekte arkaya.
        const kenar = (a.tur === 'cukurAyna' ? f : -f) * sarkma
        const x = (y: number) => m.x + kenar * ((y - m.y) / h) ** 2
        const nokta: Nokta[] = []
        for (let i = 0; i <= 16; i++) {
          const y = m.y - h + (2 * h * i) / 16
          nokta.push({ x: x(y), y })
        }
        k.yol(`M ${yaz({ x: m.x + kenar, y: m.y - h })} Q ${yaz({ x: m.x - kenar, y: m.y })} ${yaz({ x: m.x + kenar, y: m.y + h })}`, 2.6)
        k.engeller.push(...cizgilerDen(nokta, false))
        for (const p of nokta) sinirEkle(k.sinir, p.x, p.y)
        // Arkası taralı: yansıtan yüzün tersi.
        // Noktalar yukarıdan aşağı: yürüyüşün sağı ekranda sol. Sola bakan aynanın arkası sağda.
        k.yol(taramaYolu(nokta, 6.5, 7, f === -1), 1.1)
        oturt.push((p) => (Math.abs(p.x - m.x) <= 2.5 && Math.abs(p.y - m.y) <= h + 2 ? { x: x(p.y), y: p.y } : p))
        const isaret = a.tur === 'cukurAyna' ? f : -f
        for (const [ad, carpan] of [['F', 1], ['M', 2]] as const) {
          const px = a.merkez[0] + isaret * a.odak * carpan
          if (px < sol || px > sag) continue
          odakYazilari.push(() => {
            const p = P([px, a.merkez[1]])
            k.nokta(p, { r: 2.8 })
            k.yazi(ad, p, Math.PI / 2, { boy: YAZI_BOYU.harf - 1, bosluk: 3, hareket: 0.4 })
          })
        }
        aciklama.push(a.tur === 'cukurAyna' ? 'çukur ayna' : 'tümsek ayna')
      } else {
        let d: string
        if (a.tur === 'inceMercek') {
          const w = sinirla(h * 0.13, 5, 10)
          d = `M ${yaz({ x: m.x, y: m.y - h })} Q ${yaz({ x: m.x + 2 * w, y: m.y })} ${yaz({ x: m.x, y: m.y + h })} Q ${yaz({ x: m.x - 2 * w, y: m.y })} ${yaz({ x: m.x, y: m.y - h })} Z`
        } else {
          const we = sinirla(h * 0.14, 6, 11)
          const wc = 2.5
          d = `M ${yaz({ x: m.x - we, y: m.y - h })} L ${yaz({ x: m.x + we, y: m.y - h })} Q ${yaz({ x: m.x + 2 * wc - we, y: m.y })} ${yaz({ x: m.x + we, y: m.y + h })} L ${yaz({ x: m.x - we, y: m.y + h })} Q ${yaz({ x: m.x - 2 * wc + we, y: m.y })} ${yaz({ x: m.x - we, y: m.y - h })} Z`
        }
        k.yol(d, 1.7, 'on', 'cam')
        const kutu = [{ x: m.x - 8, y: m.y - h }, { x: m.x + 8, y: m.y - h }, { x: m.x + 8, y: m.y + h }, { x: m.x - 8, y: m.y + h }]
        k.engeller.push(...cizgilerDen(kutu, true))
        sinirEkle(k.sinir, m.x, m.y - h)
        sinirEkle(k.sinir, m.x, m.y + h)
        for (const isaret of [-1, 1]) {
          const px = a.merkez[0] + isaret * a.odak
          if (px < sol || px > sag) continue
          odakYazilari.push(() => {
            const p = P([px, a.merkez[1]])
            k.nokta(p, { r: 2.8 })
            k.yazi('F', p, Math.PI / 2, { boy: YAZI_BOYU.harf - 1, bosluk: 3, hareket: 0.4 })
          })
        }
        aciklama.push(a.tur === 'inceMercek' ? 'ince kenarlı mercek' : 'kalın kenarlı mercek')
      }
    } else if (a.tur === 'prizma') {
      k.cizgi(a.koseler.map(P), { kapali: true, dolgu: 'cam', kalinlik: 1.8 })
      aciklama.push('prizma')
    } else if (a.tur === 'sinir') {
      const pa = P(a.bas)
      const pb = P(a.bit)
      const u = birim({ x: pb.x - pa.x, y: pb.y - pa.y })
      const sagYan = { x: -u.y, y: u.x }
      if (a.dolgu !== 'yok') {
        const n = a.dolgu === 'sol' ? { x: -sagYan.x, y: -sagYan.y } : sagYan
        const bolge = yariDuzlemKirp(kose, pa, n)
        if (bolge.length >= 3) k.yollar.unshift({ d: kirikYol(bolge, true), renk: 'on', kalinlik: 0, dolgu: 'cam', kenarsiz: true })
      }
      k.cizgi([pa, pb], { kalinlik: 1.9 })
      if (a.normal) {
        const ayak = P(a.normal)
        const boy = Math.min(kose[1].x - kose[0].x, kose[2].y - kose[1].y) * 0.42
        k.cizgi([topla(ayak, sagYan, -boy), topla(ayak, sagYan, boy)], { kalinlik: 1.25, kesik: true })
      }
      aciklama.push('iki ortamın sınırı')
    }
  }

  // Işınlar: kırık yol, her parçanın ortasında ilerleme oku; sanal uzantı kesik ve oksuz.
  const oturtulmus = (p: Nokta) => oturt.reduce((q, f) => f(q), p)
  for (const isin of g.isinlar ?? []) {
    const n = isin.noktalar.map((p) => oturtulmus(P(p)))
    k.cizgi(n, { kalinlik: isin.kesik ? 1.2 : 1.6, kesik: isin.kesik })
    if (isin.kesik) continue
    for (let i = 0; i + 1 < n.length; i++) {
      const L = uzaklik(n[i], n[i + 1])
      if (L < 22) continue
      const u = birim({ x: n[i + 1].x - n[i].x, y: n[i + 1].y - n[i].y })
      const orta = { x: (n[i].x + n[i + 1].x) / 2, y: (n[i].y + n[i + 1].y) / 2 }
      k.ok(topla(orta, u, 4.5), topla(orta, u, -4.5), 8.5)
    }
  }
  if (g.isinlar?.length) aciklama.push(`${g.isinlar.length} ışın`)

  // Cisim, görüntü, kaynak, göz: ışınların üstünde.
  for (const a of g.araclar) {
    if (a.tur === 'cisim' || a.tur === 'goruntu') {
      const pa = P(a.bas)
      const pb = P(a.bit)
      const sanal = a.tur === 'goruntu' && goruntuSanalMi(g, a)
      k.cizgi([pa, pb], { kalinlik: sanal ? 1.6 : 2.3, kesik: sanal })
      k.ok(pb, pa, 10)
      const ad = a.ad?.trim()
      if (ad) odakYazilari.push(() => k.yazi(ad, pb, Math.atan2(pb.y - pa.y, pb.x - pa.x), { boy: YAZI_BOYU.harf, bosluk: 3, hareket: 0.5 }))
      aciklama.push(`${a.tur === 'cisim' ? 'cisim' : sanal ? 'sanal görüntü' : 'görüntü'}${ad ? ` ${ad}` : ''}`)
    } else if (a.tur === 'kaynak') {
      const m = P(a.konum)
      k.nokta(m, { r: 4.6 })
      let d = ''
      for (let i = 0; i < 8; i++) {
        const y = yon((i * Math.PI) / 4)
        d += `M ${yaz(topla(m, y, 7))} L ${yaz(topla(m, y, 12))} `
      }
      k.yol(d.trim(), 1.4)
      k.engeller.push(...cemberParcalari(m, 12, 8))
      sinirEkle(k.sinir, m.x - 12, m.y - 12)
      sinirEkle(k.sinir, m.x + 12, m.y + 12)
      aciklama.push('ışık kaynağı')
    } else if (a.tur === 'goz') {
      const m = P(a.konum)
      const y = yon(ekranAcisi(a.aci ?? 0))
      const dik = { x: -y.y, y: y.x }
      const arka = topla(m, y, -9)
      const on = topla(m, y, 9)
      k.yol(`M ${yaz(arka)} Q ${yaz(topla(m, dik, 9))} ${yaz(on)} Q ${yaz(topla(m, dik, -9))} ${yaz(arka)} Z`, 1.6, 'on', 'hafif')
      k.nokta(topla(m, y, 2.5), { r: 2.8 })
      k.engeller.push(...cemberParcalari(m, 9, 8))
      sinirEkle(k.sinir, m.x - 10, m.y - 10)
      sinirEkle(k.sinir, m.x + 10, m.y + 10)
      aciklama.push('göz')
    }
  }
  for (const f of odakYazilari) f()
  acilariCiz(k, g.acilar, P)
  for (const y of g.etiketler ?? []) k.serbestYazi(y, P)
  const yazilar = (g.etiketler ?? []).map((y) => y.ad)

  return k.bitir(`Optik şekli: ${aciklama.join(', ')}${yazilar.length ? `; yazılar: ${yazilar.join(', ')}` : ''}`, {
    kirpma: { x: kose[0].x - 3, y: kose[0].y - 3, gen: kose[1].x - kose[0].x + 6, yuk: kose[2].y - kose[1].y + 6 },
  })
}

// ── Düzenek ──────────────────────────────────────────────────────────────────

export function duzenekSahnesi(g: DuzenekGorseli): Sahne {
  const gen = g.pencere[1] - g.pencere[0]
  const yuk = g.pencere[3] - g.pencere[2]
  return sigdir(pencereOlcegi(g.pencere), 14, (o) => duzenekKur(g, o), (o) => ({ gen: gen * o, yuk: yuk * o })).sahne
}

/** Blok köşeleri: merkez çevresinde `aci` derece döndürülmüş dikdörtgen (veri koordinatı). */
export function blokKoseleri(merkez: Konum, en: number, boy: number, aci = 0): Konum[] {
  const c = Math.cos(derece(aci))
  const s = Math.sin(derece(aci))
  return ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as const).map(([i, j]) => {
    const x = (i * en) / 2
    const y = (j * boy) / 2
    return [merkez[0] + x * c - y * s, merkez[1] + x * s + y * c] as Konum
  })
}

function duzenekKur(g: DuzenekGorseli, olcek: number) {
  const P = pencereDonusumu(g.pencere, olcek)
  const k = new Kurucu()
  const [sol, sag, alt, ust] = g.pencere
  for (const p of [P([sol, ust]), P([sag, alt])]) sinirEkle(k.sinir, p.x, p.y)
  const aciklama: string[] = []
  const yazilar: (() => void)[] = []
  const zeminler: Nokta[][] = []
  let siviSirasi = 0

  for (const a of g.parcalar) {
    const ad = a.ad?.trim()
    if (a.tur === 'zemin' || a.tur === 'ip' || a.tur === 'kap') {
      const n = a.noktalar.map(P)
      k.cizgi(n, { kalinlik: a.tur === 'ip' ? 1.35 : a.tur === 'kap' ? 2.1 : 1.9 })
      if (a.tur === 'zemin') {
        k.yol(taramaYolu(n, 7, 7.5), 1.1)
        zeminler.push(n)
      }
      if (ad) {
        // Ad, taranmayan yanda ilk parçanın ortasında.
        const u = birim({ x: n[1].x - n[0].x, y: n[1].y - n[0].y })
        const orta = { x: (n[0].x + n[1].x) / 2, y: (n[0].y + n[1].y) / 2 }
        yazilar.push(() => k.yazi(ad, orta, Math.atan2(-u.x, u.y), { boy: YAZI_BOYU.serbest, bosluk: 4, kalin: false }))
      }
      aciklama.push(a.tur === 'zemin' ? 'zemin' : a.tur === 'ip' ? 'ip' : 'kap')
    } else if (a.tur === 'sivi') {
      const n = a.noktalar.map(P)
      k.cizgi(n, { kapali: true, dolgu: siviSirasi % 2 ? 'sivi2' : 'sivi', kalinlik: 1.1, engel: false })
      siviSirasi++
      if (ad) {
        const orta = n.reduce((t, p) => ({ x: t.x + p.x / n.length, y: t.y + p.y / n.length }), { x: 0, y: 0 })
        yazilar.push(() => k.etiketler.push(etiketOlustur(ad, YAZI_BOYU.serbest, orta.x, orta.y, 0.3)))
      }
      aciklama.push(`sıvı${ad ? ` ${ad}` : ''}`)
    } else if (a.tur === 'blok') {
      const n = blokKoseleri(a.merkez, a.en, a.boy, a.aci).map(P)
      k.cizgi(n, { kapali: true, dolgu: 'blok', kalinlik: 1.8 })
      if (ad) {
        const m = P(a.merkez)
        yazilar.push(() => k.etiketler.push(etiketOlustur(ad, YAZI_BOYU.harf - 1, m.x, m.y, 0)))
      }
      aciklama.push(`blok${ad ? ` ${ad}` : ''}`)
    } else if (a.tur === 'makara') {
      const m = P(a.merkez)
      const r = a.yaricap * olcek
      k.cember(m, r)
      k.nokta(m, { r: 2.6 })
      if (ad) yazilar.push(() => k.yazi(ad, m, -Math.PI / 4, { boy: YAZI_BOYU.harf - 1, bosluk: r + 3, hareket: 0.5 }))
      aciklama.push('makara')
    } else if (a.tur === 'ok') {
      const pa = P(a.bas)
      const pb = P(a.bit)
      k.cizgi([pa, pb], { kalinlik: 2 })
      k.ok(pb, pa, 9.5)
      if (ad) yazilar.push(() => k.yazi(ad, pb, Math.atan2(pb.y - pa.y, pb.x - pa.x), { boy: YAZI_BOYU.harf, bosluk: 3, hareket: 0.5 }))
      aciklama.push(`ok${ad ? ` ${ad}` : ''}`)
    }
  }
  for (const f of yazilar) f()
  acilariCiz(k, g.acilar, P)

  /*
    Eğik düzlemin açısı çoğu zaman yalnız yazıyla geliyor ("37°" köşenin
    yanında). Yazı eğik bir zeminin ucuna yakınsa kitaptaki gibi yatay bir
    yardımcı çizgi ve açı yayı çizilir, yazı yayın ağzına alınır.
  */
  for (const y of g.etiketler ?? []) {
    if (etiketTuru(y.ad) === 'aci' && !g.acilar?.length) {
      const p = P(y.konum)
      let en: { uc: Nokta; ote: Nokta; u: number } | undefined
      for (const n of zeminler) {
        for (let i = 0; i + 1 < n.length; i++) {
          for (const [uc, ote] of [[n[i], n[i + 1]], [n[i + 1], n[i]]] as const) {
            const egim = Math.abs(Math.atan2(ote.y - uc.y, Math.abs(ote.x - uc.x)))
            if (egim < derece(3) || egim > derece(87)) continue
            const u = uzaklik(uc, p)
            if (u < 1.8 * olcek + 30 && (!en || u < en.u)) en = { uc, ote, u }
          }
        }
      }
      if (en) {
        const { uc, ote } = en
        const sagaMi = ote.x > uc.x
        const yatayVar = zeminler.some((n) => n.some((q, i) => i + 1 < n.length && Math.abs(q.y - n[i + 1].y) < 0.5 && Math.min(q.x, n[i + 1].x) <= uc.x + 0.5 && Math.max(q.x, n[i + 1].x) >= uc.x - 0.5 && Math.abs(q.y - uc.y) < 0.5))
        if (!yatayVar) {
          const boy = Math.min(Math.abs(ote.x - uc.x), 2 * olcek, 90)
          k.cizgi([uc, { x: uc.x + (sagaMi ? boy : -boy), y: uc.y }], { kalinlik: 1.2, kesik: true })
        }
        const aZemin = Math.atan2(ote.y - uc.y, ote.x - uc.x)
        const aYatay = sagaMi ? 0 : Math.PI
        // Ekran açısında küçükten büyüğe.
        let bas = Math.min(aZemin, aYatay)
        let gen = Math.abs(aZemin - aYatay)
        if (gen > Math.PI) {
          bas = Math.max(aZemin, aYatay)
          gen = 2 * Math.PI - gen
        }
        k.aciYayi(uc, bas, gen, y.ad.trim())
        continue
      }
    }
    k.serbestYazi(y, P)
  }

  return k.bitir(`Düzenek: ${aciklama.join(', ')}${g.etiketler?.length ? `; yazılar: ${g.etiketler.map((y) => y.ad).join(', ')}` : ''}`)
}
