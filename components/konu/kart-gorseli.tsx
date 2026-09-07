import type {
  AkisGorseli,
  Gorsel,
  KartRenk,
  KatmanGorseli,
  KoordinatGorseli,
  SayiDogrusuGorseli,
  TabloGorseli,
  VennGorseli,
} from '@/lib/konu'

/**
 * Bilgi kartının çizimi.
 *
 * Görselin **tarifi** içerik dosyasında (`lib/konu/tip.ts` → `Gorsel`), çizimi
 * burada. İçerik dosyaları React'e bağlı değil ve olmamalı; ayrıca ham SVG
 * kabul eden bir alan her kartın kendi ölçüsünü ve rengini kurması demekti.
 * Burada hepsi aynı kutuya, aynı yazı boyuna ve aynı üç renge oturuyor.
 *
 * Ölçüler `viewBox` üstünden **oran**: kart genişliği telefondan telefona
 * değişiyor ve piksel yazılmış bir çizim dar ekranda taşıyor.
 */

const RENKLER: Record<KartRenk, string> = {
  ana: 'var(--primary-parlak)',
  ikincil: 'var(--ikincil)',
  soluk: 'var(--muted-foreground)',
}

const renk = (r: KartRenk | undefined) => RENKLER[r ?? 'ana']

export function KartGorseli({ gorsel, etiket }: { gorsel: Gorsel; etiket: string }) {
  return (
    /*
      Zemin `--muted`: çizim beyaz kartın üstünde çerçevesiz dururken kartın
      kendi yazısıyla aynı düzlemde görünüyordu. Hafif bir zemin onu ayırıyor
      ve çerçeve çizmeye gerek kalmıyor.
    */
    <figure
      className="mt-4 overflow-hidden rounded-2xl bg-muted px-3 py-3"
      role="img"
      aria-label={`${etiket} — görsel anlatım`}
    >
      {gorsel.tur === 'koordinat' && <Koordinat g={gorsel} />}
      {gorsel.tur === 'sayiDogrusu' && <SayiDogrusu g={gorsel} />}
      {gorsel.tur === 'venn' && <Venn g={gorsel} />}
      {gorsel.tur === 'akis' && <Akis g={gorsel} />}
      {gorsel.tur === 'tablo' && <Tablo g={gorsel} />}
      {gorsel.tur === 'katman' && <Katman g={gorsel} />}
    </figure>
  )
}

// ── Koordinat düzlemi ───────────────────────────────────────────────────────

const G = 320
const Y = 210
/** Kenar payı: eksen uçlarındaki oklar ve etiketler bu boşlukta duruyor. */
const PAY = 18

/**
 * Nokta listesini yumuşak bir yola çeviriyor (Catmull-Rom → kübik Bézier).
 *
 * İçerik dosyası bir eğriyi az sayıda noktayla yazabilsin diye: y = x² için
 * yedi nokta yeterli. Düz `L` ile birleştirilseydi parabol yedi kırıklı bir
 * çizgi olurdu ve "kolları" gösteren şey tam da o eğrilik.
 */
function yumusakYol(n: [number, number][], kapali: boolean) {
  if (n.length < 3) return `M ${n.map((p) => p.join(' ')).join(' L ')}`
  const p = kapali ? [n[n.length - 1], ...n, n[0], n[1]] : [n[0], ...n, n[n.length - 1]]
  let d = `M ${p[1][0]} ${p[1][1]}`
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1]
    const [x1, y1] = p[i]
    const [x2, y2] = p[i + 1]
    const [x3, y3] = p[i + 2]
    d += ` C ${x1 + (x2 - x0) / 6} ${y1 + (y2 - y0) / 6}, ${x2 - (x3 - x1) / 6} ${y2 - (y3 - y1) / 6}, ${x2} ${y2}`
  }
  return kapali ? `${d} Z` : d
}

function Koordinat({ g }: { g: KoordinatGorseli }) {
  const [x0, x1, y0, y1] = g.pencere
  const sx = (x: number) => PAY + ((x - x0) / (x1 - x0)) * (G - 2 * PAY)
  const sy = (y: number) => Y - PAY - ((y - y0) / (y1 - y0)) * (Y - 2 * PAY)
  const eksenler = g.eksenler ?? true
  /* Sıfır pencerenin dışındaysa eksen kenara yapışıyor; çizim yine okunur. */
  const oX = sy(Math.min(Math.max(0, y0), y1))
  const oY = sx(Math.min(Math.max(0, x0), x1))

  return (
    <svg viewBox={`0 0 ${G} ${Y}`} className="w-full" aria-hidden>
      {eksenler && (
        <g stroke="var(--border)" strokeWidth={1}>
          {tamSayilar(x0, x1).map((x) => (
            <line key={`d${x}`} x1={sx(x)} y1={PAY} x2={sx(x)} y2={Y - PAY} />
          ))}
          {tamSayilar(y0, y1).map((y) => (
            <line key={`y${y}`} x1={PAY} y1={sy(y)} x2={G - PAY} y2={sy(y)} />
          ))}
        </g>
      )}
      {eksenler && (
        <g stroke="var(--muted-foreground)" strokeWidth={1.6}>
          <line x1={PAY - 6} y1={oX} x2={G - PAY + 6} y2={oX} />
          <line x1={oY} y1={PAY - 6} x2={oY} y2={Y - PAY + 6} />
        </g>
      )}

      {g.egriler?.map((e, i) => {
        const noktalar = e.noktalar.map(([x, y]) => [sx(x), sy(y)] as [number, number])
        const d = e.kirik
          ? `M ${noktalar.map((p) => p.join(' ')).join(' L ')}${e.kapali ? ' Z' : ''}`
          : yumusakYol(noktalar, e.kapali ?? false)
        return (
          <path
            key={i}
            d={d}
            fill={e.kapali ? renk(e.renk) : 'none'}
            fillOpacity={e.kapali ? 0.16 : undefined}
            stroke={renk(e.renk)}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={e.kesik ? '6 5' : undefined}
          />
        )
      })}

      {g.cemberler?.map((c, i) => (
        <circle
          key={i}
          cx={sx(c.x)}
          cy={sy(c.y)}
          /* Yarıçap x ekseninin ölçeğiyle: pencere kare değilse elips olurdu. */
          r={(c.r / (x1 - x0)) * (G - 2 * PAY)}
          fill="none"
          stroke={renk(c.renk)}
          strokeWidth={2.4}
        />
      ))}

      {g.noktalar?.map((p, i) => (
        <g key={i}>
          <circle
            cx={sx(p.x)}
            cy={sy(p.y)}
            r={4.5}
            fill={p.bos ? 'var(--muted)' : renk(p.renk)}
            stroke={renk(p.renk)}
            strokeWidth={2.2}
          />
          {p.ad && (
            <Yazi x={sx(p.x) + 8} y={sy(p.y) - 8} renk={renk(p.renk)}>
              {p.ad}
            </Yazi>
          )}
        </g>
      ))}

      {g.etiketler?.map((t, i) => (
        <Yazi key={i} x={sx(t.x)} y={sy(t.y)} renk={renk(t.renk)} ortala>
          {t.ad}
        </Yazi>
      ))}

      {g.egriler?.map(
        (e, i) =>
          e.ad && (
            <Yazi
              key={`ad${i}`}
              x={sx(e.noktalar[e.noktalar.length - 1][0])}
              y={sy(e.noktalar[e.noktalar.length - 1][1]) - 9}
              renk={renk(e.renk)}
              sagaYasli
            >
              {e.ad}
            </Yazi>
          ),
      )}

      {eksenler && g.xAd && (
        <Yazi x={G - PAY} y={oX - 8} renk="var(--muted-foreground)" sagaYasli>
          {g.xAd}
        </Yazi>
      )}
      {eksenler && g.yAd && (
        <Yazi x={oY + 6} y={PAY + 2} renk="var(--muted-foreground)">
          {g.yAd}
        </Yazi>
      )}
    </svg>
  )
}

/** Izgara için pencereye düşen tam sayılar; çok sıklaşırsa seyreltiliyor. */
function tamSayilar(a: number, b: number) {
  const adim = Math.max(1, Math.ceil((b - a) / 10))
  const cikti: number[] = []
  for (let i = Math.ceil(a); i <= Math.floor(b); i += adim) cikti.push(i)
  return cikti
}

function Yazi({
  x,
  y,
  renk: r,
  ortala,
  sagaYasli,
  children,
}: {
  x: number
  y: number
  renk: string
  ortala?: boolean
  sagaYasli?: boolean
  children: React.ReactNode
}) {
  return (
    <text
      x={x}
      y={y}
      fill={r}
      fontSize={12.5}
      fontWeight={800}
      textAnchor={ortala ? 'middle' : sagaYasli ? 'end' : 'start'}
    >
      {children}
    </text>
  )
}

// ── Sayı doğrusu ────────────────────────────────────────────────────────────

function SayiDogrusu({ g }: { g: SayiDogrusuGorseli }) {
  const [a, b] = g.aralik
  const YUK = 74
  const sx = (v: number) => PAY + ((v - a) / (b - a)) * (G - 2 * PAY)
  const oy = 40

  return (
    <svg viewBox={`0 0 ${G} ${YUK}`} className="w-full" aria-hidden>
      <line
        x1={6}
        y1={oy}
        x2={G - 6}
        y2={oy}
        stroke="var(--muted-foreground)"
        strokeWidth={1.6}
      />
      {/* Uçlardaki oklar doğrunun sürdüğünü söylüyor; kesilmiş bir çizgi
          "burada bitiyor" gibi okunuyordu. */}
      <path
        d={`M 6 ${oy} l 7 -4 v 8 Z M ${G - 6} ${oy} l -7 -4 v 8 Z`}
        fill="var(--muted-foreground)"
      />

      {g.isaretler?.map((v) => (
        <g key={v}>
          <line
            x1={sx(v)}
            y1={oy - 5}
            x2={sx(v)}
            y2={oy + 5}
            stroke="var(--muted-foreground)"
            strokeWidth={1.6}
          />
          <Yazi x={sx(v)} y={oy + 20} renk="var(--muted-foreground)" ortala>
            {v}
          </Yazi>
        </g>
      ))}

      {g.parcalar?.map((p, i) => {
        const bas = p.bas === null ? 8 : sx(p.bas)
        const bit = p.bit === null ? G - 8 : sx(p.bit)
        return (
          <g key={i}>
            <line
              x1={bas}
              y1={oy}
              x2={bit}
              y2={oy}
              stroke={renk(p.renk)}
              strokeWidth={5}
              strokeLinecap="butt"
            />
            {p.bas !== null && <Uc x={bas} y={oy} dolu={p.kapaliBas} renk={renk(p.renk)} />}
            {p.bit !== null && <Uc x={bit} y={oy} dolu={p.kapaliBit} renk={renk(p.renk)} />}
            {p.ad && (
              <Yazi x={(bas + bit) / 2} y={oy - 12} renk={renk(p.renk)} ortala>
                {p.ad}
              </Yazi>
            )}
          </g>
        )
      })}

      {g.noktalar?.map((n, i) => (
        <g key={i}>
          <Uc x={sx(n.deger)} y={oy} dolu={!n.bos} renk={renk('ana')} />
          {n.ad && (
            <Yazi x={sx(n.deger)} y={oy - 12} renk={renk('ana')} ortala>
              {n.ad}
            </Yazi>
          )}
        </g>
      ))}
    </svg>
  )
}

/** Aralığın ucu: dolu daire dâhil, boş daire hariç. */
function Uc({ x, y, dolu, renk: r }: { x: number; y: number; dolu?: boolean; renk: string }) {
  return (
    <circle
      cx={x}
      cy={y}
      r={5.5}
      fill={dolu ? r : 'var(--muted)'}
      stroke={r}
      strokeWidth={2.6}
    />
  )
}

// ── Venn ────────────────────────────────────────────────────────────────────

function Venn({ g }: { g: VennGorseli }) {
  const YUK = 150

  /*
    Tümleyen ayrı çiziliyor: tek halka ve dışı boyalı. İki çakışan daireyle
    çizilseydi resim "A ile A′ nün ortak elemanı var" derdi — kartın
    anlattığının tersi.
  */
  if (g.tumleyen) {
    return (
      <svg viewBox={`0 0 ${G} ${YUK}`} className="w-full" aria-hidden>
        <mask id="venn-tumleyen">
          <rect x={4} y={16} width={G - 8} height={YUK - 22} rx={12} fill="white" />
          <circle cx={160} cy={80} r={46} fill="black" />
        </mask>
        <rect
          x={4}
          y={16}
          width={G - 8}
          height={YUK - 22}
          rx={12}
          fill={renk('ikincil')}
          fillOpacity={0.2}
          mask="url(#venn-tumleyen)"
        />
        <rect
          x={4}
          y={16}
          width={G - 8}
          height={YUK - 22}
          rx={12}
          fill="none"
          stroke="var(--border)"
          strokeWidth={2}
        />
        <circle cx={160} cy={80} r={46} fill="var(--muted)" stroke={renk('ana')} strokeWidth={2.4} />
        {g.disi && (
          <Yazi x={12} y={30} renk="var(--muted-foreground)">
            {g.disi}
          </Yazi>
        )}
        <Yazi x={160} y={84} renk={renk('ana')} ortala>
          {g.sol}
        </Yazi>
        <Yazi x={262} y={126} renk={renk('ikincil')} ortala>
          {g.sag}
        </Yazi>
      </svg>
    )
  }

  const vurgu = g.vurgu ?? (g.kesisim ? 'kesisim' : 'yok')
  const solX = g.kapsayan ? 160 : 128
  const sagX = g.kapsayan ? 186 : 192
  const solR = g.kapsayan ? 62 : 56
  const sagR = g.kapsayan ? 30 : 56
  const oy = 78

  return (
    <svg viewBox={`0 0 ${G} ${YUK}`} className="w-full" aria-hidden>
      <defs>
        {/* Kesişim iki dairenin **kesişimi**; iki yarı saydam daireyi üst üste
            koymak da renk veriyor ama vurgulanan bölge belirsiz kalıyordu. */}
        <clipPath id="venn-kesisim">
          <circle cx={solX} cy={oy} r={solR} />
        </clipPath>
      </defs>

      {g.disi && (
        <>
          <rect
            x={4}
            y={16}
            width={G - 8}
            height={YUK - 22}
            rx={12}
            fill="none"
            stroke="var(--border)"
            strokeWidth={2}
          />
          <Yazi x={12} y={30} renk="var(--muted-foreground)">
            {g.disi}
          </Yazi>
        </>
      )}

      {vurgu === 'birlesim' && (
        <g fill={renk('ana')} fillOpacity={0.18}>
          <circle cx={solX} cy={oy} r={solR} />
          <circle cx={sagX} cy={oy} r={sagR} />
        </g>
      )}
      {vurgu === 'solFark' && (
        <circle cx={solX} cy={oy} r={solR} fill={renk('ana')} fillOpacity={0.18} />
      )}
      {vurgu === 'solFark' && (
        <circle cx={sagX} cy={oy} r={sagR} fill="var(--muted)" />
      )}
      {vurgu === 'kesisim' && (
        <g clipPath="url(#venn-kesisim)">
          <circle cx={sagX} cy={oy} r={sagR} fill={renk('ana')} fillOpacity={0.3} />
        </g>
      )}

      <circle
        cx={solX}
        cy={oy}
        r={solR}
        fill="none"
        stroke={renk('ana')}
        strokeWidth={2.4}
      />
      <circle
        cx={sagX}
        cy={oy}
        r={sagR}
        fill="none"
        stroke={renk('ikincil')}
        strokeWidth={2.4}
      />

      <Yazi x={g.kapsayan ? solX - 34 : solX - 26} y={oy + 4} renk={renk('ana')} ortala>
        {g.sol}
      </Yazi>
      <Yazi x={g.kapsayan ? sagX : sagX + 26} y={oy + 4} renk={renk('ikincil')} ortala>
        {g.sag}
      </Yazi>
      {g.kesisim && !g.kapsayan && (
        <Yazi x={(solX + sagX) / 2} y={oy + 46} renk="var(--foreground)" ortala>
          {g.kesisim}
        </Yazi>
      )}
    </svg>
  )
}

// ── Akış, tablo, katman: HTML ───────────────────────────────────────────────

/*
  Bu üçü SVG değil çünkü içleri **yazı** ve yazının satır kırması gerekiyor.
  SVG'de metin tek satır: uzun bir adım adı kutudan taşıyor ve kırpılması için
  ölçüm yapmak gerekiyordu. HTML'de aynı iş düzenin kendi işi.
*/

function Akis({ g }: { g: AkisGorseli }) {
  /*
    Ok yönü düzeni belirliyor: aşağı gösteren bir ok kutuların **arasında**
    olmalı. Yatay düzenle aynı satırı paylaştığında ok kutuların sağında,
    boşlukta duruyordu ve okun neyi neye bağladığı okunmuyordu.
  */
  const dikey = g.dikey ?? false
  return (
    <ol
      className={
        dikey ? 'flex flex-col items-stretch' : 'flex items-stretch gap-1.5 overflow-x-auto'
      }
    >
      {g.adimlar.map((a, i) => (
        <li
          key={i}
          className={
            dikey ? 'flex flex-col items-center' : 'flex flex-1 items-center gap-1.5'
          }
        >
          <div
            className="w-full min-w-0 flex-1 rounded-xl px-2.5 py-2 text-center"
            style={{
              background: `color-mix(in srgb, ${renk(a.renk)} 14%, transparent)`,
              borderLeft: `3px solid ${renk(a.renk)}`,
            }}
          >
            <span className="block text-[12.5px] leading-tight font-extrabold text-balance">
              {a.ad}
            </span>
            {a.alt && (
              <span className="mt-0.5 block text-[11px] leading-tight font-semibold text-muted-foreground">
                {a.alt}
              </span>
            )}
          </div>
          {(i < g.adimlar.length - 1 || g.donguSel) && (
            <span
              aria-hidden
              className="shrink-0 text-[13px] leading-none font-extrabold text-muted-foreground"
            >
              {dikey ? '↓' : '→'}
            </span>
          )}
        </li>
      ))}
      {g.donguSel && (
        <li
          className={
            dikey
              ? 'self-center text-[11px] font-extrabold text-muted-foreground'
              : 'shrink-0 self-center text-[11px] font-extrabold text-muted-foreground'
          }
        >
          {g.adimlar[0].ad}
        </li>
      )}
    </ol>
  )
}

function Tablo({ g }: { g: TabloGorseli }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[12.5px]">
        <thead>
          <tr>
            {g.basliklar.map((b) => (
              <th
                key={b}
                className="border-b border-border px-2 pb-1.5 text-left font-extrabold text-primary"
              >
                {b}
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
                  className="border-b border-border/60 px-2 py-1.5 align-top leading-snug font-semibold"
                >
                  {h}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Katman({ g }: { g: KatmanGorseli }) {
  return (
    <div className="flex gap-2">
      {g.eksenAdi && (
        <span
          className="shrink-0 self-center text-[10.5px] font-extrabold tracking-[0.14em] text-muted-foreground uppercase"
          /* Yazı yukarıdan aşağı okunuyor: bantların sırası bir yön anlatıyor
             ve yatay bir etiket o yönü göstermiyordu. */
          style={{ writingMode: 'vertical-rl' }}
        >
          {g.eksenAdi}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {g.katmanlar.map((k, i) => (
          <div
            key={i}
            className="rounded-md px-2.5 py-1.5"
            style={{
              background: `color-mix(in srgb, ${renk(k.renk)} ${20 - i * 2}%, transparent)`,
              /* Daralma soldan değil **iki yandan**: tek yandan daralan bant
                 kapsamayı değil sağa kaymayı gösteriyor. */
              marginInline: g.daralan ? `${i * 9}%` : undefined,
            }}
          >
            <span className="text-[12.5px] leading-tight font-extrabold">{k.ad}</span>
            {k.alt && (
              <span className="ml-1.5 text-[11px] leading-tight font-semibold text-muted-foreground">
                {k.alt}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
