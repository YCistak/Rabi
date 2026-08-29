'use client'

import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Eşleştirme oyunlarının ortak tuşu.
 *
 * Üç oyun (Edebiyat, Antlaşma, Kavram) aynı dört durumu çiziyor: boş, seçili,
 * eşleşti, yanlış. Renkler ayrı ayrı yazılınca üçü zamanla ayrışıyordu —
 * eşleşen çiftin yeşili bir oyunda kenarlıklı, ötekinde kenarlıksızdı.
 *
 * Yerleşim burada değil: madde kutusu geniş ve sola dayalı, yazar kutusu dar ve
 * ortalanmış. Onu her oyun `className` ile kendisi veriyor (`cn` sonraki
 * sınıfları öne aldığı için buradaki varsayılanlar eziliyor).
 */

export type EslestirmeDurumu = 'bos' | 'secili' | 'eslesti' | 'yanlis'

/** Seçili hâlin renkleri — oyunun dersinden geliyor (yzm/isl/cog/trh/byl). */
export type EslestirmeRengi = {
  kenar: string
  zemin: string
  yazi: string
}

/**
 * Kutunun durumu.
 *
 * Sıra önemli: eşleşmiş bir kutu artık ne yanlış ne seçili görünür — dokunulsa
 * bile tıklama yok sayılıyor, rengi de değişmemeli.
 */
export function eslestirmeDurumu({
  eslesti,
  hatali,
  secili,
}: {
  eslesti: boolean
  hatali: boolean
  secili: boolean
}): EslestirmeDurumu {
  if (eslesti) return 'eslesti'
  if (hatali) return 'yanlis'
  if (secili) return 'secili'
  return 'bos'
}

export function EslestirmeDugmesi({
  durum,
  renk,
  onSec,
  className,
  children,
}: {
  durum: EslestirmeDurumu
  renk: EslestirmeRengi
  onSec: () => void
  className?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onSec}
      disabled={durum === 'eslesti'}
      className={cn(
        'flex w-full items-center gap-1.5 rounded-[15px] border-2 px-2.5 py-1.5 transition',
        'text-[12.5px] font-extrabold leading-tight',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        durum === 'eslesti' && 'border-transparent bg-success-soft text-success',
        durum === 'yanlis' && 'border-ikincil bg-ikincil-soft text-ikincil',
        durum === 'secili' && cn(renk.kenar, renk.zemin, renk.yazi),
        durum === 'bos' && 'golge-kart border-border bg-card',
        className,
      )}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {durum === 'eslesti' && <Check size={13} className="shrink-0" aria-hidden />}
    </button>
  )
}
