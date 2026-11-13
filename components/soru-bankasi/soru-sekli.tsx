import { useId, useMemo } from 'react'
import { KartGorseli } from '@/components/konu/kart-gorseli'
import type { AkisGorseli, Gorsel, KoordinatGorseli, SayiDogrusuGorseli, TabloGorseli, VennGorseli } from '@/lib/konu/tip'
import { simgeleriParcala } from '@/lib/soru-bankasi/metin'
import {
  kesirParcalariSec,
  koordinatSahnesi,
  SEKIL_GENISLIGI,
  sayiDogrusuYazilari,
  sayiYaz,
  yaziDuzeni,
  YAZI_BOYU,
  type CizgiRengi,
  type Sahne,
  type SahneEtiketi,
} from '@/lib/soru-bankasi/sekil'

/**
 * Soru Bankası şekli: test kitabı görünümü.
 *
 * Konu kartlarının `KartGorseli`si anlatım için renkli ve iri; soru şekli ise
 * kitaptaki gibi kâğıt zeminli, koyu nötr ince çizgili, harfleri köşenin
 * dışında. Yerleşimin bütün hesabı `lib/soru-bankasi/sekil.ts`te; burası
 * yalnızca çizer. Akış ve katman soru verisinde neredeyse yok, onlar konu
 * kartının çizimine düşüyor.
 */
export function SoruSekli({ gorsel }: { gorsel: Gorsel }) {
  switch (gorsel.tur) {
    case 'koordinat':
      return <KoordinatSekli g={gorsel} />
    case 'tablo':
      return <TabloSekli g={gorsel} />
    case 'sayiDogrusu':
      return <SayiDogrusuSekli g={gorsel} />
    case 'venn':
      return <VennSekli g={gorsel} />
    case 'akis':
      return <AkisSekli g={gorsel} />
    default:
      return <KartGorseli gorsel={gorsel} etiket="Soru görseli" />
  }
}

/** Süreç adımları soru kitabında renksiz ve yapısal çizilir; konu kartının renkli kutuları kullanılmaz. */
function AkisSekli({ g }: { g: AkisGorseli }) {
  const dikey = g.dikey || g.adimlar.length > 3
  const kutuGen = 132
  const kutuYuk = 52
  const bosluk = 38
  const gen = dikey ? 220 : Math.max(220, g.adimlar.length * kutuGen + Math.max(0, g.adimlar.length - 1) * bosluk + 24)
  const yuk = dikey ? g.adimlar.length * kutuYuk + Math.max(0, g.adimlar.length - 1) * bosluk + 28 : 104
  const konum = (sira: number) =>
    dikey ? { x: gen / 2, y: 14 + kutuYuk / 2 + sira * (kutuYuk + bosluk) } : { x: 12 + kutuGen / 2 + sira * (kutuGen + bosluk), y: yuk / 2 }
  const sekil = (ad: string, sira: number) => (sira === 0 || sira === g.adimlar.length - 1 ? 'basla' : /\?|karar|doğru mu|yanlış mı/i.test(ad) ? 'karar' : 'islem')
  const ok = (a: number, b: number) => {
    const ilk = konum(a)
    const son = konum(b)
    if (dikey) return `M ${ilk.x} ${ilk.y + kutuYuk / 2} L ${son.x} ${son.y - kutuYuk / 2 - 7}`
    return `M ${ilk.x + kutuGen / 2} ${ilk.y} L ${son.x - kutuGen / 2 - 7} ${son.y}`
  }
  const etiket = `Akış şeması: ${g.adimlar.map((a) => a.ad).join(', ')}`
  return (
    <figure role="img" aria-label={etiket} className="my-3 overflow-x-auto rounded-2xl border border-border bg-card p-2 text-foreground">
      <svg viewBox={`0 0 ${gen} ${yuk}`} className="mx-auto block h-auto min-w-max" style={{ width: dikey ? 220 : gen }} fontFamily="inherit">
        <defs><marker id="akis-ok" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M 0 0 L 7 3.5 L 0 7 Z" fill="currentColor" /></marker></defs>
        {g.adimlar.slice(0, -1).map((_, sira) => <path key={sira} d={ok(sira, sira + 1)} fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#akis-ok)" />)}
        {g.donguSel && g.adimlar.length > 1 && <path d={dikey ? `M ${gen / 2 + 72} ${yuk - 40} H ${gen - 12} V 14 H ${gen / 2 + 72}` : `M ${gen - 20} ${yuk / 2 + 36} V ${yuk - 10} H 18 V ${yuk / 2 + 36}`} fill="none" stroke="currentColor" strokeWidth="1.35" markerEnd="url(#akis-ok)" />}
        {g.adimlar.map((adim, sira) => {
          const p = konum(sira)
          const tur = sekil(adim.ad, sira)
          return <g key={sira}>
            {tur === 'basla' ? <rect x={p.x - kutuGen / 2} y={p.y - kutuYuk / 2} width={kutuGen} height={kutuYuk} rx={26} fill="var(--card)" stroke="currentColor" strokeWidth="1.5" /> : tur === 'karar' ? <path d={`M ${p.x} ${p.y - 31} L ${p.x + 62} ${p.y} L ${p.x} ${p.y + 31} L ${p.x - 62} ${p.y} Z`} fill="var(--card)" stroke="currentColor" strokeWidth="1.5" /> : <rect x={p.x - kutuGen / 2} y={p.y - kutuYuk / 2} width={kutuGen} height={kutuYuk} rx={4} fill="var(--card)" stroke="currentColor" strokeWidth="1.5" />}
            <text x={p.x} y={p.y - (adim.alt ? 3 : -5)} textAnchor="middle" fontSize="14" fontWeight="700">{adim.ad.length > 20 ? `${adim.ad.slice(0, 19)}…` : adim.ad}</text>
            {adim.alt && <text x={p.x} y={p.y + 15} textAnchor="middle" fontSize="12" fontWeight="600">{adim.alt.length > 22 ? `${adim.alt.slice(0, 21)}…` : adim.alt}</text>}
          </g>
        })}
      </svg>
    </figure>
  )
}

const RENK: Record<CizgiRengi, string> = {
  on: 'currentColor',
  mavi: 'var(--konu-matematik-ok)',
  soluk: 'var(--muted-foreground)',
}

/** `useId` iki nokta ve köşeli tırnak üretebiliyor; `url(#…)` içinde güvenli olsun. */
function kimlikAl(ham: string) {
  return `sekil${ham.replace(/[^a-zA-Z0-9_-]/g, '')}`
}

function Cerceve({ etiket, children }: { etiket: string; children: React.ReactNode }) {
  return (
    <figure role="img" aria-label={etiket} className="my-3 rounded-2xl border border-border bg-card px-2 py-3 text-foreground">
      {children}
    </figure>
  )
}

function Svg({ viewBox, children }: { viewBox: [number, number, number, number]; children: React.ReactNode }) {
  return (
    <svg
      viewBox={viewBox.join(' ')}
      className="mx-auto block h-auto w-full"
      /* Geniş ekranda yazılar büyüyüp kitap ölçüsünü kaybetmesin. */
      style={{ maxWidth: viewBox[2] * 1.3 }}
      aria-hidden
      fontFamily="inherit"
    >
      {children}
    </svg>
  )
}

// ── Yazı ─────────────────────────────────────────────────────────────────────

/**
 * Etiket: üst/alt simge `tspan` kaydırmasıyla, kesir üst üste iki satırla.
 *
 * Yazının çevresinde kart renginde ince bir kontur var (`paint-order`):
 * ızgara ya da kesik çizgi bir harfin içinden geçtiğinde harf okunur kalıyor.
 */
function Yazi({ e }: { e: SahneEtiketi }) {
  const { duzen } = e
  const b = duzen.boy
  const ortak = {
    fill: RENK[e.renk],
    fontWeight: e.kalin ? 700 : 600,
    stroke: 'var(--card)',
    strokeWidth: 3.2,
    strokeLinejoin: 'round' as const,
    paintOrder: 'stroke',
  }
  if (!duzen.kesirli) {
    let kayma = 0
    return (
      <text x={e.x} y={e.y + b * 0.35} textAnchor="middle" fontSize={b} {...ortak}>
        {duzen.parcalar.map((p, i) => {
          if (p.tur === 'kesir') return null
          const hedef = p.tur === 'ust' ? -b * 0.4 : p.tur === 'alt' ? b * 0.22 : 0
          const dy = hedef - kayma
          kayma = hedef
          return (
            <tspan key={i} dy={dy || undefined} fontSize={p.tur === 'duz' ? undefined : b * 0.72}>
              {p.metin}
            </tspan>
          )
        })}
      </text>
    )
  }
  const sol = e.x - duzen.gen / 2
  return (
    <g fontSize={b} textAnchor="middle" {...ortak}>
      {duzen.parcalar.map((p, i) => {
        const orta = sol + p.x + p.gen / 2
        if (p.tur === 'kesir') {
          return (
            <g key={i}>
              <text x={orta} y={e.y - b * 0.2} fontSize={b * 0.82}>
                {p.pay}
              </text>
              <line x1={sol + p.x + b * 0.1} x2={sol + p.x + p.gen - b * 0.1} y1={e.y} y2={e.y} stroke={RENK[e.renk]} strokeWidth={1.3} />
              <text x={orta} y={e.y + b * 0.8} fontSize={b * 0.82}>
                {p.payda}
              </text>
            </g>
          )
        }
        const kay = p.tur === 'ust' ? -b * 0.4 : p.tur === 'alt' ? b * 0.22 : 0
        return (
          <text key={i} x={orta} y={e.y + b * 0.35 + kay} fontSize={p.tur === 'duz' ? b : b * 0.72}>
            {p.metin}
          </text>
        )
      })}
    </g>
  )
}

// ── Koordinat (geometri ve grafik) ───────────────────────────────────────────

function KoordinatSekli({ g }: { g: KoordinatGorseli }) {
  const sahne = useMemo<Sahne>(() => koordinatSahnesi(g), [g])
  const kimlik = kimlikAl(useId())
  const kirp = sahne.kirpma ? `url(#${kimlik}-kirp)` : undefined
  const dolgu = (d: Sahne['yollar'][number]['dolgu']) =>
    d === 'tarali' ? `url(#${kimlik}-tarama)` : d === 'mavi' ? 'var(--konu-matematik-ok)' : d === 'hafif' ? 'currentColor' : 'none'
  const dolguSaydam = (d: Sahne['yollar'][number]['dolgu']) => (d === 'mavi' ? 0.16 : d === 'hafif' ? 0.07 : undefined)

  return (
    <Cerceve etiket={sahne.aciklama}>
      <Svg viewBox={sahne.viewBox}>
        <defs>
          {/* Taralı bölge: ince eğik çizgiler ve altında çok hafif bir zemin. */}
          <pattern id={`${kimlik}-tarama`} width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={6} height={6} fill="currentColor" fillOpacity={0.05} />
            <line x1={0} y1={0} x2={0} y2={6} stroke="currentColor" strokeWidth={1.1} strokeOpacity={0.45} />
          </pattern>
          {sahne.kirpma && (
            <clipPath id={`${kimlik}-kirp`}>
              <rect x={sahne.kirpma.x} y={sahne.kirpma.y} width={sahne.kirpma.gen} height={sahne.kirpma.yuk} />
            </clipPath>
          )}
        </defs>

        {sahne.izgara && <path d={sahne.izgara} stroke="currentColor" strokeOpacity={0.09} strokeWidth={1} fill="none" />}

        {/* Önce dolgular, sonra çizgiler: üst üste binen çokgenlerin kenarı dolgunun altında kalmasın. */}
        <g clipPath={kirp}>
          {sahne.yollar.map((y, i) =>
            y.dolgu ? <path key={`d${i}`} d={y.d} fill={dolgu(y.dolgu)} fillOpacity={dolguSaydam(y.dolgu)} stroke="none" /> : null,
          )}
        </g>

        {sahne.eksen && (
          <g>
            <path d={sahne.eksen} stroke="currentColor" strokeWidth={1.4} fill="none" />
            {sahne.eksenOklari && <path d={sahne.eksenOklari} fill="currentColor" />}
            {sahne.centikler && <path d={sahne.centikler} stroke="currentColor" strokeWidth={1.2} fill="none" />}
          </g>
        )}

        <g clipPath={kirp} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {sahne.yollar.map((y, i) => (
            <path
              key={i}
              d={y.d}
              stroke={RENK[y.renk]}
              strokeWidth={y.kalinlik}
              strokeDasharray={y.kesik ? '5 4' : undefined}
              strokeLinecap={y.kesik ? 'butt' : 'round'}
            />
          ))}
          {sahne.cemberler.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r={c.r} stroke={RENK[c.renk]} strokeWidth={1.8} fill={c.dolu ? 'var(--card)' : 'none'} />
          ))}
          {sahne.okUclari.map((o, i) => (
            <path key={i} d={o.d} fill={RENK[o.renk]} stroke={RENK[o.renk]} strokeWidth={1} />
          ))}
        </g>

        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {sahne.yaylar && <path d={sahne.yaylar} strokeWidth={1.3} />}
          {sahne.dikAcilar && <path d={sahne.dikAcilar} strokeWidth={1.3} strokeLinecap="butt" strokeLinejoin="miter" />}
          {sahne.esCentikleri && <path d={sahne.esCentikleri} strokeWidth={1.5} />}
        </g>

        {sahne.noktalar.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={3.1}
            fill={n.bos ? 'var(--card)' : RENK[n.renk]}
            stroke={RENK[n.renk]}
            strokeWidth={n.bos ? 1.6 : 0}
          />
        ))}

        {sahne.etiketler.map((e, i) => (
          <Yazi key={i} e={e} />
        ))}
      </Svg>
    </Cerceve>
  )
}

// ── Tablo ────────────────────────────────────────────────────────────────────

/** Hücre metni: üs/alt simge ve (yalnız sayılı) kesir düzgün; birimlerin eğik çizgisi kalır. */
function HucreMetni({ metin }: { metin: string }) {
  return (
    <>
      {simgeleriParcala(metin).map((p, i) => {
        if (p.tur === 'ust') return <sup key={i} className="text-[0.72em]">{p.metin}</sup>
        if (p.tur === 'alt') return <sub key={i} className="text-[0.72em]">{p.metin}</sub>
        return kesirParcalariSec(p.metin).map((k, j) =>
          k.tur === 'metin' ? (
            <span key={`${i}-${j}`}>{k.metin}</span>
          ) : (
            <span
              key={`${i}-${j}`}
              role="math"
              aria-label={`${k.pay} bölü ${k.payda}`}
              className="mx-[0.1em] inline-flex flex-col items-stretch text-center align-middle text-[0.92em] leading-none"
            >
              <span className="px-[0.2em]" aria-hidden>{k.pay}</span>
              <span className="my-[0.14em] h-[1.5px] rounded-full bg-current" aria-hidden />
              <span className="px-[0.2em]" aria-hidden>{k.payda}</span>
            </span>
          ),
        )
      })}
    </>
  )
}

/**
 * Kitap tablosu: ince kenarlık, hafif zeminli kalın başlık, ortalı hücre.
 * Dar ekranda yazı küçülmez; tablo yana kayar.
 */
function TabloSekli({ g }: { g: TabloGorseli }) {
  const kisa = (m: string) => m.length <= 14
  return (
    <figure className="my-3 rounded-2xl border border-border bg-card p-2 text-foreground">
      <div className="overflow-x-auto">
        <table
          className="rakam mx-auto min-w-full border-collapse text-center text-[14px] leading-snug"
          aria-label={`Tablo: ${g.basliklar.join(', ')}`}
        >
          <thead>
            <tr>
              {g.basliklar.map((b, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`border border-muted-foreground/40 bg-muted px-2.5 py-2 align-middle text-[13.5px] font-extrabold ${kisa(b) ? 'whitespace-nowrap' : 'min-w-24'}`}
                >
                  <HucreMetni metin={b} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {g.satirlar.map((satir, i) => (
              <tr key={i}>
                {satir.map((h, j) => (
                  <td
                    key={j}
                    className={`border border-muted-foreground/40 px-2.5 py-1.5 align-middle font-semibold ${kisa(h) ? 'whitespace-nowrap' : 'min-w-24'} ${j === 0 && g.basliklar.length > 2 ? 'font-bold' : ''}`}
                  >
                    <HucreMetni metin={h} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

// ── Sayı doğrusu ─────────────────────────────────────────────────────────────

const ParcaRengi = (r: string | undefined) => (r === 'ikincil' ? RENK.on : r === 'soluk' ? RENK.soluk : RENK.mavi)

/**
 * Sayı doğrusu: iki yanı oklu doğru, çentik, aralık kalın çizgi; dâhil uç dolu,
 * hariç uç boş daire. Birbirine binen aralıklar (A ∩ B soruları) doğrunun
 * üstünde ayrı katlarda çizilir: aynı kalın çizgide üst üste gelince hangi
 * ucun hangi aralığa ait olduğu okunmuyordu.
 */
function SayiDogrusuSekli({ g }: { g: SayiDogrusuGorseli }) {
  const W = SEKIL_GENISLIGI
  const [a, b] = g.aralik[1] > g.aralik[0] ? g.aralik : [g.aralik[0], g.aralik[0] + 1]
  const PAY = 22
  const sx = (v: number) => PAY + ((v - a) / (b - a)) * (W - 2 * PAY)
  const parcalar = g.parcalar ?? []
  const ust = (p: (typeof parcalar)[number]) => [p.bas ?? -Infinity, p.bit ?? Infinity]
  const binisik = parcalar.some((p, i) =>
    parcalar.some((q, j) => {
      if (i >= j) return false
      const [p1, p2] = ust(p)
      const [q1, q2] = ust(q)
      return p1 < q2 && q1 < p2
    }),
  )
  const katli = binisik && parcalar.length > 1
  const katAraligi = 22
  const ustBosluk = (katli ? parcalar.length * katAraligi + 8 : 0) + (parcalar.some((p) => p.ad) || g.noktalar?.some((n) => n.ad) ? 20 : 10)
  const oy = ustBosluk + 6
  const zorunlu = [...parcalar.flatMap((p) => [p.bas, p.bit]).filter((v): v is number => v !== null), ...(g.noktalar ?? []).map((n) => n.deger)]
  const yazilacak = sayiDogrusuYazilari(g.isaretler ?? [], sx, zorunlu)
  const yuk = oy + 32
  const boy = YAZI_BOYU.sayi + 1
  const ucX = (v: number | null, sol: boolean) => (v === null ? (sol ? 8 : W - 8) : sx(v))
  const etiket = [
    'Sayı doğrusu',
    parcalar.map((p) => `${p.ad ? `${p.ad}: ` : ''}${p.bas === null ? '−∞' : sayiYaz(p.bas)} ile ${p.bit === null ? '+∞' : sayiYaz(p.bit)} arası`).join('; '),
  ].filter(Boolean).join(', ')

  return (
    <Cerceve etiket={etiket}>
      <Svg viewBox={[0, 0, W, yuk]}>
        <line x1={6} y1={oy} x2={W - 6} y2={oy} stroke="currentColor" strokeWidth={1.4} />
        <path d={`M 2 ${oy} l 9 -4.5 v 9 Z M ${W - 2} ${oy} l -9 -4.5 v 9 Z`} fill="currentColor" />
        {(g.isaretler ?? []).map((v) => (
          <line key={v} x1={sx(v)} y1={oy - 5} x2={sx(v)} y2={oy + 5} stroke="currentColor" strokeWidth={1.3} />
        ))}
        {yazilacak.map((v) => (
          <Yazi key={v} e={{ x: sx(v), y: oy + 17, duzen: yaziDuzeni(sayiYaz(v), boy), renk: 'on' }} />
        ))}

        {parcalar.map((p, i) => {
          const y = katli ? oy - 16 - i * katAraligi : oy
          const renk = ParcaRengi(p.renk)
          const x1 = ucX(p.bas, true)
          const x2 = ucX(p.bit, false)
          return (
            <g key={i}>
              {katli && (
                <g stroke={renk} strokeWidth={1} strokeDasharray="3 3" strokeOpacity={0.7}>
                  {p.bas !== null && <line x1={x1} x2={x1} y1={y} y2={oy} />}
                  {p.bit !== null && <line x1={x2} x2={x2} y1={y} y2={oy} />}
                </g>
              )}
              <line x1={p.bas === null ? x1 + 6 : x1} x2={p.bit === null ? x2 - 6 : x2} y1={y} y2={y} stroke={renk} strokeWidth={4} />
              {p.bas === null && <path d={`M ${x1 - 2} ${y} l 10 -6 v 12 Z`} fill={renk} />}
              {p.bit === null && <path d={`M ${x2 + 2} ${y} l -10 -6 v 12 Z`} fill={renk} />}
              {p.bas !== null && <Uc x={x1} y={y} dolu={!!p.kapaliBas} renk={renk} />}
              {p.bit !== null && <Uc x={x2} y={y} dolu={!!p.kapaliBit} renk={renk} />}
              {p.ad && (
                <Yazi
                  e={{
                    x: katli ? Math.max(x1, 14) - 8 - yaziDuzeni(p.ad, YAZI_BOYU.harf - 1).gen / 2 : (x1 + x2) / 2,
                    y: katli ? y : y - 15,
                    duzen: yaziDuzeni(p.ad, YAZI_BOYU.harf - 1),
                    renk: 'on',
                    kalin: true,
                  }}
                />
              )}
            </g>
          )
        })}

        {(g.noktalar ?? []).map((n, i) => (
          <g key={i}>
            <Uc x={sx(n.deger)} y={oy} dolu={!n.bos} renk={RENK.on} />
            {n.ad && <Yazi e={{ x: sx(n.deger), y: oy - 16, duzen: yaziDuzeni(n.ad, YAZI_BOYU.harf - 1), renk: 'on', kalin: true }} />}
          </g>
        ))}
      </Svg>
    </Cerceve>
  )
}

/** Aralığın ucu: dolu daire dâhil, boş daire hariç. */
function Uc({ x, y, dolu, renk }: { x: number; y: number; dolu: boolean; renk: string }) {
  return <circle cx={x} cy={y} r={4.6} fill={dolu ? renk : 'var(--card)'} stroke={renk} strokeWidth={2} />
}

// ── Venn ─────────────────────────────────────────────────────────────────────

/**
 * İki küme: temiz daireler, küme adları dairelerin dışında, kesişim yazısı
 * ortak bölgenin ortasında. Vurgu hafif mavi dolgu.
 */
function VennSekli({ g }: { g: VennGorseli }) {
  const kimlik = kimlikAl(useId())
  const W = SEKIL_GENISLIGI
  const boy = YAZI_BOYU.harf - 1
  const solAd = yaziDuzeni(g.sol, boy)
  const sagAd = yaziDuzeni(g.sag, boy)
  const ayriSatir = solAd.gen + sagAd.gen + 24 > W - 16
  const ustY = 16
  const oy = ustY + 74
  const r = g.kapsayan ? 64 : 58
  const solX = g.tumleyen ? W / 2 : g.kapsayan ? W / 2 : W / 2 - 38
  const sagX = g.kapsayan ? W / 2 + 18 : W / 2 + 38
  const sagR = g.kapsayan ? 30 : r
  const altY = oy + r + (ayriSatir ? 22 : 10)
  const yuk = altY + (ayriSatir ? 8 : 0)
  const vurgu = g.vurgu ?? (g.kesisim ? 'kesisim' : 'yok')
  const dolgu = 'var(--konu-matematik-ok)'
  const etiket = `Küme şeması: ${g.sol}, ${g.sag}${g.kesisim ? `; ortak bölge: ${g.kesisim}` : ''}${g.disi ? `; dışarıda: ${g.disi}` : ''}`

  if (g.tumleyen) {
    return (
      <Cerceve etiket={etiket}>
        <Svg viewBox={[0, 0, W, oy + r + 16]}>
          <defs>
            <mask id={`${kimlik}-m`}>
              <rect x={8} y={6} width={W - 16} height={oy + r + 4} fill="white" />
              <circle cx={solX} cy={oy} r={r} fill="black" />
            </mask>
          </defs>
          <rect x={8} y={6} width={W - 16} height={oy + r + 4} fill={dolgu} fillOpacity={0.14} mask={`url(#${kimlik}-m)`} />
          <rect x={8} y={6} width={W - 16} height={oy + r + 4} fill="none" stroke="currentColor" strokeWidth={1.5} />
          <circle cx={solX} cy={oy} r={r} fill="none" stroke="currentColor" strokeWidth={1.8} />
          <Yazi e={{ x: solX, y: oy, duzen: solAd, renk: 'on', kalin: true }} />
          <Yazi e={{ x: W - 16 - sagAd.gen / 2, y: oy + r - 6, duzen: sagAd, renk: 'on', kalin: true }} />
          {g.disi && <Yazi e={{ x: 16 + yaziDuzeni(g.disi, boy).gen / 2, y: 20, duzen: yaziDuzeni(g.disi, boy), renk: 'on' }} />}
        </Svg>
      </Cerceve>
    )
  }

  return (
    <Cerceve etiket={etiket}>
      <Svg viewBox={[0, 0, W, yuk]}>
        <defs>
          <clipPath id={`${kimlik}-sol`}>
            <circle cx={solX} cy={oy} r={r} />
          </clipPath>
          <mask id={`${kimlik}-fark`}>
            <circle cx={solX} cy={oy} r={r} fill="white" />
            <circle cx={sagX} cy={oy} r={sagR} fill="black" />
          </mask>
        </defs>
        {g.disi && <rect x={8} y={4} width={W - 16} height={yuk - 8} rx={4} fill="none" stroke="currentColor" strokeWidth={1.3} />}
        {vurgu === 'kesisim' && <circle cx={sagX} cy={oy} r={sagR} fill={dolgu} fillOpacity={0.2} clipPath={`url(#${kimlik}-sol)`} />}
        {vurgu === 'birlesim' && (
          <g fill={dolgu} fillOpacity={0.16}>
            <circle cx={solX} cy={oy} r={r} />
            <circle cx={sagX} cy={oy} r={sagR} mask={`url(#${kimlik}-fark)`} />
          </g>
        )}
        {vurgu === 'solFark' && <circle cx={solX} cy={oy} r={r} fill={dolgu} fillOpacity={0.18} mask={`url(#${kimlik}-fark)`} />}
        <circle cx={solX} cy={oy} r={r} fill="none" stroke="currentColor" strokeWidth={1.8} />
        <circle cx={sagX} cy={oy} r={sagR} fill="none" stroke="currentColor" strokeWidth={1.8} />

        {/* Küme adları dairelerin dışında: sol üstte ve sağ üstte (sığmazsa sağdaki altta). */}
        <Yazi e={{ x: Math.max(14 + solAd.gen / 2, Math.min(solX - r * 0.55, W / 2 - 8 - solAd.gen / 2)), y: ustY, duzen: solAd, renk: 'on', kalin: true }} />
        <Yazi
          e={{
            x: Math.min(W - 14 - sagAd.gen / 2, Math.max(sagX + sagR * 0.55, ayriSatir ? 0 : W / 2 + 8 + sagAd.gen / 2)),
            y: ayriSatir ? altY : ustY,
            duzen: sagAd,
            renk: 'on',
            kalin: true,
          }}
        />
        {g.kesisim && !g.kapsayan && <Yazi e={{ x: (solX + sagX) / 2, y: oy, duzen: yaziDuzeni(g.kesisim, boy - 1), renk: 'on' }} />}
        {g.disi && <Yazi e={{ x: W - 18 - yaziDuzeni(g.disi, boy - 1).gen / 2, y: 18, duzen: yaziDuzeni(g.disi, boy - 1), renk: 'on' }} />}
      </Svg>
    </Cerceve>
  )
}
