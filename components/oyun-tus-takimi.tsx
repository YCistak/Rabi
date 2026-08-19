'use client'

import { Delete } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Sayı yazdıran oyunların ortak cevap alanı ve tuş takımı.
 *
 * Gerçek bir `<input>` kullanılmıyor: Android'de sistem klavyesi açılıp ekranın
 * yarısını kaplıyor, hem soruyu hem tuşları örtüyordu. Rakamlar ekrandaki tuş
 * takımından geliyor.
 *
 * Zihinden İşlem ile Açı Tamamlama aynı takımı paylaşıyor. Renkler matematik
 * ailesinden (`isl`) çünkü ikisi de matematik dersinin oyunu; başka bir dersin
 * oyunu sayı isterse renk o zaman dışarıdan verilir.
 */

/** Cevap alanına yazılabilecek en fazla rakam. */
export const EN_COK_RAKAM = 5

export function CevapAlani({
  girilen,
  durum,
  bosYazi,
}: {
  girilen: string
  durum: 'yaziliyor' | 'dogru' | 'yanlis'
  /** Hiç rakam yazılmamışken görünen metin ("sonucu yaz", "pas"). */
  bosYazi: string
}) {
  return (
    <div
      aria-live="polite"
      className={cn(
        'golge-kart flex h-[54px] flex-none items-center justify-center rounded-[18px] px-4',
        'rakam font-display text-[27px] font-extrabold tracking-[3px]',
        durum === 'yaziliyor' && 'bg-card',
        durum === 'dogru' && 'bg-success text-white',
        durum === 'yanlis' && 'bg-ikincil text-white',
      )}
    >
      {girilen === '' ? (
        <span className="text-[19px] font-bold tracking-normal opacity-60">{bosYazi}</span>
      ) : (
        <>
          {girilen}
          {durum === 'yaziliyor' && (
            <span className="ml-0.5 h-6 w-[2px] animate-pulse bg-isl-koyu" />
          )}
        </>
      )}
    </div>
  )
}

const TUSLAR = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

export function TusTakimi({
  kilitli,
  bosMu,
  onRakam,
  onSil,
  onOnayla,
  onPas,
}: {
  kilitli: boolean
  bosMu: boolean
  onRakam: (rakam: string) => void
  onSil: () => void
  onOnayla: () => void
  onPas: () => void
}) {
  return (
    <div className="flex flex-none flex-col gap-2">
      <div className="grid grid-cols-3 gap-[7px]">
        {TUSLAR.map((rakam) => (
          <Tus key={rakam} kilitli={kilitli} onClick={() => onRakam(rakam)}>
            {rakam}
          </Tus>
        ))}

        <Tus kilitli={kilitli || bosMu} onClick={onSil} etiket="Sil" bicim="sil">
          <Delete size={21} aria-hidden />
        </Tus>
        <Tus kilitli={kilitli} onClick={() => onRakam('0')}>
          0
        </Tus>
        <Tus kilitli={kilitli || bosMu} onClick={onOnayla} bicim="onay">
          Onayla
        </Tus>
      </div>

      {/* Pas geçmenin bedeli düğmenin üstünde yazıyor: aynı yanlış cezası. */}
      <button
        type="button"
        onClick={onPas}
        disabled={kilitli}
        className="mx-auto rounded-lg px-2.5 py-1 text-[12.5px] font-extrabold text-muted-foreground transition active:bg-foreground/10 disabled:opacity-45"
      >
        Pas geç
      </button>
    </div>
  )
}

function Tus({
  kilitli,
  bicim = 'rakam',
  etiket,
  onClick,
  children,
}: {
  kilitli: boolean
  bicim?: 'rakam' | 'sil' | 'onay'
  etiket?: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={kilitli}
      aria-label={etiket}
      className={cn(
        'grid h-12 place-items-center rounded-2xl font-display transition disabled:opacity-40',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        bicim === 'rakam' && 'golge-kart rakam bg-card text-[21px] font-extrabold',
        bicim === 'sil' && 'bg-ikincil/12 text-ikincil',
        bicim === 'onay' && 'bg-isl-koyu text-sm font-extrabold text-white active:brightness-95',
      )}
    >
      {children}
    </button>
  )
}

/**
 * Rakam yazma kuralı: baştaki sıfır anlamsız, uzunluk sınırlı.
 *
 * İki oyunda da aynı kural geçerli; ekranlarda ayrı ayrı yazılsaydı biri
 * güncellenip öteki unutulurdu.
 */
export function rakamEkle(onceki: string, rakam: string, enCokRakam = EN_COK_RAKAM): string {
  const temel = onceki === '0' ? '' : onceki
  if (temel.length >= enCokRakam) return temel
  return temel + rakam
}
