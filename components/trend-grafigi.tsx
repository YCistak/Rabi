'use client'

import { useState } from 'react'
import { netYaz, tarihYaz } from '@/lib/hesap'
import type { TrendNoktasi } from '@/lib/hesap'

const G = 44 // sol eksen payı
const SAG = 16
const UST = 16
const ALT = 26
const EN = 320
const BOY = 180

/** '2026-04-12' → '12.04' (Türkçe gün.ay sırası). */
function gunAy(isoTarih: string): string {
  const [, ay, gun] = isoTarih.split('-')
  return `${gun}.${ay}`
}

/** Eksen için 0'dan başlayan, yuvarlak basamaklı üst sınır. */
function ustSinir(enYuksek: number): number {
  if (enYuksek <= 0) return 10
  const adaylar = [5, 10, 20, 25, 50, 100, 200, 250, 500]
  const hedef = enYuksek * 1.1
  return adaylar.find((a) => a >= hedef) ?? Math.ceil(hedef / 100) * 100
}

/**
 * Toplam net gidişatı. Tek seri olduğu için lejant yok — başlık neyi çizdiğini söyler.
 * Bir noktaya dokununca o denemenin değeri okunur.
 */
export function TrendGrafigi({ seri }: { seri: TrendNoktasi[] }) {
  const [seciliIndeks, setSeciliIndeks] = useState<number | null>(null)

  if (seri.length < 2) {
    return (
      <p className="rounded-xl bg-muted/60 px-3 py-6 text-center text-sm text-muted-foreground">
        Gidişat grafiği için en az iki deneme gerekiyor.
      </p>
    )
  }

  const enYuksek = Math.max(...seri.map((n) => n.toplamNet))
  const tavan = ustSinir(enYuksek)
  const cizimEni = EN - G - SAG
  const cizimBoyu = BOY - UST - ALT

  const x = (i: number) => G + (cizimEni * i) / (seri.length - 1)
  const y = (deger: number) => UST + cizimBoyu - (cizimBoyu * deger) / tavan

  const cizgi = seri.map((n, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(n.toplamNet)}`).join(' ')
  const alan = `${cizgi} L${x(seri.length - 1)},${UST + cizimBoyu} L${x(0)},${UST + cizimBoyu} Z`

  const isaretler = [0, tavan / 2, tavan]
  const secili = seciliIndeks === null ? seri.length - 1 : seciliIndeks
  const seciliNokta = seri[secili]

  return (
    <div>
      <svg
        viewBox={`0 0 ${EN} ${BOY}`}
        className="w-full"
        role="img"
        aria-label={`Toplam net gidişatı: ${seri.length} deneme, son deneme ${netYaz(
          seri[seri.length - 1].toplamNet,
        )} net`}
      >
        {/* ızgara — geri planda kalsın diye 1px düz çizgi */}
        {isaretler.map((deger) => (
          <g key={deger}>
            <line
              x1={G}
              x2={EN - SAG}
              y1={y(deger)}
              y2={y(deger)}
              stroke="var(--grid)"
              strokeWidth={1}
            />
            <text
              x={G - 8}
              y={y(deger) + 4}
              textAnchor="end"
              className="rakam"
              fill="var(--muted-foreground)"
              fontSize={11}
            >
              {deger}
            </text>
          </g>
        ))}

        <path d={alan} fill="var(--primary)" opacity={0.1} />
        <path
          d={cizgi}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* seçili nokta: yüzey rengi halkayla, çizginin üstünde okunur kalsın */}
        <circle
          cx={x(secili)}
          cy={y(seciliNokta.toplamNet)}
          r={5}
          fill="var(--primary)"
          stroke="var(--card)"
          strokeWidth={2}
        />

        {/* dokunma hedefleri, marklardan geniş */}
        {seri.map((_, i) => (
          <rect
            key={i}
            x={x(i) - cizimEni / (seri.length - 1) / 2}
            y={UST}
            width={cizimEni / (seri.length - 1)}
            height={cizimBoyu}
            fill="transparent"
            onPointerDown={() => setSeciliIndeks(i)}
          />
        ))}

        <text
          x={G}
          y={BOY - 8}
          fill="var(--muted-foreground)"
          fontSize={11}
          textAnchor="start"
        >
          {gunAy(seri[0].deneme.tarih)}
        </text>
        <text
          x={EN - SAG}
          y={BOY - 8}
          fill="var(--muted-foreground)"
          fontSize={11}
          textAnchor="end"
        >
          {gunAy(seri[seri.length - 1].deneme.tarih)}
        </text>
      </svg>

      <p className="mt-1 text-center text-sm">
        <span className="font-medium">{seciliNokta.deneme.ad}</span>
        <span className="text-muted-foreground">
          {' · '}
          {tarihYaz(seciliNokta.deneme.tarih)}
          {' · '}
        </span>
        <span className="font-display font-semibold text-primary">
          {netYaz(seciliNokta.toplamNet)} net
        </span>
      </p>
    </div>
  )
}
