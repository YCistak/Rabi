import { cn } from '@/lib/utils'

/**
 * Rabi'nin ruh hâlleri. Uygulama durumuna göre seçilir:
 * - `normal`   varsayılan
 * - `mutlu`    günlük hedef tutturuldu
 * - `uykulu`   veri yok / boş ekran
 * - `calisiyor` pomodoro çalışma turunda
 * - `uzgun`    devamsızlık sınırı, hedefin gerisinde kalma
 * - `kutlama`  yeni rozet
 */
export type MaskotDurumu = 'normal' | 'mutlu' | 'uykulu' | 'calisiyor' | 'uzgun' | 'kutlama'

type Props = {
  durum?: MaskotDurumu
  /** Piksel cinsinden genişlik; yükseklik oranla belirlenir. */
  boyut?: number
  className?: string
}

/**
 * Rabi — uygulamanın tavşan maskotu. Tek SVG; ayrı dosyalar yerine tek bileşen
 * tutuluyor ki tema değiştiğinde renkler kendiliğinden uysun ve varyant eklemek
 * yeni dosya gerektirmesin. Renkler tema değişkenlerinden gelir.
 */
export function Rabi({ durum = 'normal', boyut = 96, className }: Props) {
  const uzgunMu = durum === 'uzgun'

  return (
    <svg
      viewBox="0 0 120 130"
      width={boyut}
      height={(boyut * 130) / 120}
      className={cn('shrink-0', className)}
      role="img"
      aria-label={`Rabi — ${DURUM_ETIKETI[durum]}`}
    >
      {/* Kulaklar. Üzgünken dışa doğru düşer. */}
      <g
        style={{
          transformOrigin: '60px 62px',
          transform: uzgunMu ? 'none' : undefined,
        }}
      >
        <Kulak taraf="sol" dusuk={uzgunMu} />
        <Kulak taraf="sag" dusuk={uzgunMu} />
      </g>

      {/* Baş */}
      <ellipse cx="60" cy="82" rx="36" ry="32" fill="var(--maskot-kurk)" />

      {/* Yanaklar */}
      <ellipse cx="34" cy="90" rx="8" ry="5.5" fill="var(--maskot-yanak)" opacity="0.75" />
      <ellipse cx="86" cy="90" rx="8" ry="5.5" fill="var(--maskot-yanak)" opacity="0.75" />

      <Gozler durum={durum} />

      {/* Burun */}
      <path d="M60 84 l-5 -4.5 h10 z" fill="var(--maskot-burun)" />

      <Agiz durum={durum} />

      {/* Bıyıklar */}
      <g stroke="var(--maskot-cizgi)" strokeWidth="1.4" strokeLinecap="round" opacity="0.5">
        <line x1="24" y1="82" x2="42" y2="85" />
        <line x1="24" y1="90" x2="42" y2="89" />
        <line x1="96" y1="82" x2="78" y2="85" />
        <line x1="96" y1="90" x2="78" y2="89" />
      </g>

      {durum === 'uykulu' && <Zzz />}
      {durum === 'kutlama' && <Konfeti />}
    </svg>
  )
}

const DURUM_ETIKETI: Record<MaskotDurumu, string> = {
  normal: 'selam veriyor',
  mutlu: 'seviniyor',
  uykulu: 'uyukluyor',
  calisiyor: 'çalışıyor',
  uzgun: 'üzgün',
  kutlama: 'kutluyor',
}

function Kulak({ taraf, dusuk }: { taraf: 'sol' | 'sag'; dusuk: boolean }) {
  const sol = taraf === 'sol'
  // Üzgünken kulak dışa yatar; kaynak (pivot) kulağın başa bağlandığı nokta.
  const doner = dusuk ? (sol ? -28 : 28) : 0
  const x = sol ? 44 : 76

  return (
    <g style={{ transform: `rotate(${doner}deg)`, transformOrigin: `${x}px 62px` }}>
      <ellipse
        cx={x}
        cy="34"
        rx="11"
        ry="30"
        fill="var(--maskot-kurk)"
        transform={`rotate(${sol ? -8 : 8} ${x} 34)`}
      />
      <ellipse
        cx={x}
        cy="36"
        rx="5.5"
        ry="21"
        fill="var(--maskot-kulak-ic)"
        transform={`rotate(${sol ? -8 : 8} ${x} 36)`}
      />
    </g>
  )
}

function Gozler({ durum }: { durum: MaskotDurumu }) {
  const cizgi = {
    stroke: 'var(--maskot-cizgi)',
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    fill: 'none',
  }

  // Kapalı gözler: uyku ve sevinç aynı çizgiyi farklı yönde kullanır.
  if (durum === 'uykulu') {
    return (
      <g {...cizgi}>
        <path d="M40 76 q7 5 14 0" />
        <path d="M66 76 q7 5 14 0" />
      </g>
    )
  }

  if (durum === 'mutlu' || durum === 'kutlama') {
    return (
      <g {...cizgi}>
        <path d="M40 78 q7 -7 14 0" />
        <path d="M66 78 q7 -7 14 0" />
      </g>
    )
  }

  if (durum === 'calisiyor') {
    // Odaklanmış: göz kapağı yarıya inmiş.
    return (
      <g>
        <path d="M40 74 h14" {...cizgi} strokeWidth={2.5} />
        <path d="M66 74 h14" {...cizgi} strokeWidth={2.5} />
        <circle cx="47" cy="78" r="4" fill="var(--maskot-cizgi)" />
        <circle cx="73" cy="78" r="4" fill="var(--maskot-cizgi)" />
      </g>
    )
  }

  const yukseklik = durum === 'uzgun' ? 5.5 : 6.5
  return (
    <g fill="var(--maskot-cizgi)">
      <ellipse cx="47" cy="77" rx="5.5" ry={yukseklik} />
      <ellipse cx="73" cy="77" rx="5.5" ry={yukseklik} />
      {/* Işıltı — gözü canlı gösterir */}
      <circle cx="49" cy="74.5" r="2" fill="var(--maskot-parlak)" />
      <circle cx="75" cy="74.5" r="2" fill="var(--maskot-parlak)" />
    </g>
  )
}

function Agiz({ durum }: { durum: MaskotDurumu }) {
  const cizgi = {
    stroke: 'var(--maskot-cizgi)',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    fill: 'none',
  }

  if (durum === 'kutlama') {
    return <ellipse cx="60" cy="93" rx="6" ry="7" fill="var(--maskot-agiz)" />
  }
  if (durum === 'uzgun') {
    return <path d="M53 96 q7 -6 14 0" {...cizgi} />
  }
  if (durum === 'uykulu') {
    return <path d="M56 92 q4 3 8 0" {...cizgi} />
  }

  // Tavşan ağzı: burnun altından inen çizgi ve iki yana açılan gülümseme.
  const derinlik = durum === 'mutlu' ? 6 : 4
  return (
    <g {...cizgi}>
      <path d="M60 84 v5" />
      <path d={`M60 89 q-7 ${derinlik} -11 0`} />
      <path d={`M60 89 q7 ${derinlik} 11 0`} />
    </g>
  )
}

function Zzz() {
  return (
    <g fill="var(--maskot-cizgi)" opacity="0.55" fontSize="11" fontWeight="700">
      <text x="94" y="52">
        z
      </text>
      <text x="102" y="40" fontSize="14">
        z
      </text>
    </g>
  )
}

function Konfeti() {
  const parcalar = [
    { x: 14, y: 30, r: 3, renk: 'var(--primary)' },
    { x: 104, y: 24, r: 2.5, renk: 'var(--ikincil)' },
    { x: 22, y: 12, r: 2, renk: 'var(--ikincil)' },
    { x: 98, y: 56, r: 3, renk: 'var(--primary)' },
    { x: 8, y: 62, r: 2.5, renk: 'var(--primary)' },
  ]
  return (
    <g>
      {parcalar.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.renk} />
      ))}
    </g>
  )
}
