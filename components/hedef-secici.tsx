'use client'

import { ChevronRight, School, Search } from 'lucide-react'
import { Alan } from '@/components/ui'

/**
 * Üniversite/bölüm seçiminin ortak parçaları.
 *
 * İki yerde birden çiziliyorlar: Araçlar'daki Hedefim ekranı ve kurulumun
 * bölüm adımı. Parçalar bir süre `ekranlar/hedef.tsx` içinde yerel duruyordu;
 * kurulum aynı listeyi göstermeye başlayınca buraya alındılar — ikinci bir
 * kopya, iki listenin zamanla birbirinden ayrılması demekti.
 */

/** Arama kutusu — solunda büyüteç, listeyi süzen tek alan. */
export function AramaAlani({
  id,
  deger,
  onDegis,
  ipucu,
}: {
  id: string
  deger: string
  onDegis: (deger: string) => void
  ipucu: string
}) {
  return (
    <div className="relative">
      <Search
        size={17}
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <Alan
        id={id}
        value={deger}
        onChange={(e) => onDegis(e.target.value)}
        placeholder={ipucu}
        autoComplete="off"
        className="pl-9"
      />
    </div>
  )
}

/**
 * Seçenek listesi.
 *
 * Yüksekliği sınırlı ve kendi içinde kayıyor: 200 üniversite sayfayı uzatsaydı
 * altındaki düğme ekrandan çıkardı.
 */
export function Liste({ bos, children }: { bos: string; children: React.ReactNode }) {
  const doluMu = Array.isArray(children) ? children.length > 0 : Boolean(children)
  return (
    <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-border">
      {doluMu ? (
        <ul className="divide-y divide-border">{children}</ul>
      ) : (
        <p className="px-3 py-4 text-center text-sm text-muted-foreground">{bos}</p>
      )}
    </div>
  )
}

export function SecimSatiri({
  baslik,
  alt,
  sag,
  onSec,
}: {
  baslik: string
  alt: string
  sag?: React.ReactNode
  onSec: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSec}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition active:bg-muted"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm leading-tight font-bold">{baslik}</span>
          <span className="block text-xs font-medium text-muted-foreground">{alt}</span>
        </span>
        {sag}
        <ChevronRight size={16} className="shrink-0 text-muted-foreground/70" aria-hidden />
      </button>
    </li>
  )
}

/** Seçim yapıldıktan sonra kutunun yerini alan satır. */
export function SecilenSatir({
  baslik,
  alt,
  onDegistir,
}: {
  baslik: string
  alt: string
  onDegistir: () => void
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-primary-soft px-3 py-2.5">
      <School size={18} className="shrink-0 text-primary" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-sm leading-tight font-extrabold">{baslik}</span>
        <span className="block text-xs font-medium text-muted-foreground">{alt}</span>
      </span>
      <button
        type="button"
        onClick={onDegistir}
        className="shrink-0 rounded-lg px-2 py-1 text-[13px] font-extrabold text-primary transition active:opacity-70"
      >
        Değiştir
      </button>
    </div>
  )
}
