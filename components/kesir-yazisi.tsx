import { cn } from '@/lib/utils'

/**
 * "3/5" metnini üst üste duran bir kesir olarak çizer.
 *
 * Trigonometri oyununun şıkları ve verilen değerleri kesir; eğik çizgiyle
 * yazılınca "√3/2" ile "√(3/2)" ayırt edilmiyor ve 24 piksellik bir şıkta
 * "12/13" tek bir sayı gibi okunuyordu. Payda yoksa (1, √3) düz yazılıyor.
 *
 * Ekran okuyucu için "bölü" ile okunuyor; çizgi yalnızca görsel.
 */
export function KesirYazisi({ metin, className }: { metin: string; className?: string }) {
  const [pay, payda] = metin.split('/')
  if (payda === undefined) return <span className={cn('rakam', className)}>{pay}</span>

  return (
    <span
      role="math"
      aria-label={`${pay} bölü ${payda}`}
      className={cn('rakam inline-flex flex-col items-stretch text-center align-middle leading-none', className)}
    >
      <span className="px-[0.2em]" aria-hidden>
        {pay}
      </span>
      <span className="my-[0.14em] h-[2px] rounded-full bg-current" aria-hidden />
      <span className="px-[0.2em]" aria-hidden>
        {payda}
      </span>
    </span>
  )
}
