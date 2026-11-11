import { cn } from '@/lib/utils'
import { kesirParcala } from '@/lib/kesir'

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
  const parcalar = kesirParcala(metin)

  return (
    <span className={cn('rakam', className)}>
      {parcalar.map((parca, sira) =>
        parca.tur === 'metin' ? (
          <span key={`${sira}-${parca.metin}`}>{parca.metin}</span>
        ) : (
          <span
            key={`${sira}-${parca.pay}-${parca.payda}`}
            role="math"
            aria-label={`${parca.pay} bölü ${parca.payda}`}
            className="inline-flex flex-col items-stretch text-center align-middle leading-none"
          >
            <span className="px-[0.2em]" aria-hidden>{parca.pay}</span>
            <span className="my-[0.14em] h-[2px] rounded-full bg-current" aria-hidden />
            <span className="px-[0.2em]" aria-hidden>{parca.payda}</span>
          </span>
        ),
      )}
    </span>
  )
}
