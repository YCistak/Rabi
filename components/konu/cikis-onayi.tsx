'use client'

import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { useGeriKatmani } from '@/lib/geri'

/**
 * Desteden ya da yoklamadan yarıda çıkarken sorulan "emin misin" penceresi.
 *
 * Çarpı düğmesi bir süre doğrudan kapatıyordu. Başlıktaki çarpı, kaydırırken
 * ya da sayfayı çevirirken yanlışlıkla basılacak kadar yakın ve tek dokunuş
 * okunan desteyi kapatıyordu; kullanıcı kaldığı yeri bulmak için haritaya
 * dönüp kitaba yeniden basıyordu. Geri tuşu da aynı kapıdan geçiyor —
 * ikisi ayrı davransaydı biri korunup öteki korunmazdı.
 *
 * Genel `Onay` alttan gelen kırmızı düğmeli bir silme penceresi; burası
 * silme değil, bir okumanın yarıda kalması. O yüzden Rabi var ve üzgün
 * duruyor: pencere azarlamıyor, "kalmak ister misin" diyor. Kalma düğmesi
 * dolu, çıkma düğmesi soluk — yanlışlıkla basan bir daha yanlışlıkla
 * çıkmasın.
 *
 * Pencere dersin renkli zemininin ya da koyu sahnenin **üstünde** açılıyor
 * (`z-[60]`); ikisi de `z-50`.
 */
export function CikisOnayi({
  acik,
  aciklama,
  onKal,
  onCik,
}: {
  acik: boolean
  /** Çıkınca ne olacağı — desteyle yoklamanın kaydı ayrı işliyor. */
  aciklama: string
  onKal: () => void
  onCik: () => void
}) {
  // Geri tuşu pencereyi kapatıp desteye dönüyor; çıkmıyor.
  useGeriKatmani(acik, onKal)

  if (!acik) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cikis-onayi-baslik"
      className="katman-zemin fixed inset-0 z-[60] flex items-center justify-center bg-black/45 px-5 pt-[calc(1rem+var(--guvenli-ust))] pb-[calc(1rem+var(--guvenli-alt))]"
    >
      <div className="pencere-girisi golge-kart w-full max-w-[340px] overflow-hidden rounded-[26px] bg-card text-foreground">
        <div className="px-5 pt-5 text-center">
          <Rabi durum="uzgun" poz="uzgun" boyut={96} className="mx-auto" />
          <h2
            id="cikis-onayi-baslik"
            className="mt-2 font-display text-[20px] leading-tight font-extrabold tracking-tight text-balance"
          >
            Çıkmak istediğine emin misin?
          </h2>
          <p className="mt-1.5 text-[13.5px] leading-snug font-medium text-muted-foreground text-pretty">
            {aciklama}
          </p>
        </div>

        <div className="flex gap-2 px-5 pt-4 pb-5">
          <Buton
            className="h-12 flex-1 rounded-full bg-foreground/[0.08] text-[14px] text-muted-foreground"
            onClick={onCik}
          >
            Çık
          </Buton>
          <Buton className="h-12 flex-1 rounded-full text-[14px]" onClick={onKal}>
            Kalıyorum
          </Buton>
        </div>
      </div>
    </div>
  )
}
