import { cn } from '@/lib/utils'

/**
 * Açılış ekranındaki tavşanın ana sayfada ineceği yerin kimliği.
 *
 * Açılışın son hareketi maskotu ekranın ortasından sol üste süzüyor ve orada
 * bırakıyor; katman kalkınca ana sayfanın kendi maskotu **tam o noktada**
 * duruyor, iki görüntü üst üste gelince geçiş tek bir hareket gibi okunuyor.
 *
 * Varış noktası koda sabit yazılamaz: tasarım 360×720'lik bir çerçeveye göre
 * `translate(-138px, -316px)` diyor ama gerçek telefonların ölçüsü başka ve o
 * sayı ekran boyuna göre değişiyor. Açılış ekranı bu kimlikten yuvayı bulup
 * mesafeyi kendisi ölçüyor.
 */
export const MASKOT_YUVASI = 'rabi-maskot-yuvasi'

/**
 * Rabi'nin yüzü.
 *
 * Uygulamanın çizilmiş maskotu (`components/maskot/rabi.tsx`) hâlâ duruyor ve
 * ruh hâli gereken yerlerde (boş ekranlar, kutlamalar) kullanılıyor; ana sayfa
 * ile açılış ekranı ise bu görsele geçti. Sebebi geçişin kendisi: iki ekranda
 * **aynı** görüntü olmadan maskotun yerine oturması bir geçiş değil bir
 * değiş tokuş gibi görünüyordu.
 *
 * Dosya 900×900'lük kaynaktan 384×384'e indirildi — en büyük kullanıldığı yer
 * 96 piksel (açılış), 384 onun dört katı ve en yoğun ekranlarda bile net.
 * Kaynağın kendisi uygulamaya girseydi tek başına yarım megabayt tutuyordu.
 */
export function TavsanYuzu({
  boyut,
  yuvaMi = false,
  gizli = false,
  className,
  style,
}: {
  /** Kare kenarı (piksel). */
  boyut: number
  /** Açılış ekranının maskotu buraya inecekse işaretlenir. */
  yuvaMi?: boolean
  /**
   * Yerini tutsun ama görünmesin.
   *
   * Açılış sürerken yuvadaki maskot gizli: ekranın son saniyesinde zemin
   * saydamlaşıyor ve ana sayfa görünür oluyor, o sırada biri uçarken öteki
   * yerinde dururken **iki** tavşan görünüyordu. Katman kalkarken gizlilik
   * de kalkıyor; uçan maskot tam oraya indiği için tek bir tavşanın yerine
   * oturması gibi okunuyor.
   *
   * `display: none` değil `visibility: hidden`: açılış ekranı varış noktasını
   * bu öğeyi ölçerek buluyor ve düzenden çıkmış bir öğenin ölçüsü sıfır olur.
   */
  gizli?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      id={yuvaMi ? MASKOT_YUVASI : undefined}
      src="/tavsan-yuz.png"
      alt="Rabi"
      width={boyut}
      height={boyut}
      aria-hidden={gizli || undefined}
      className={cn('shrink-0 object-contain', className)}
      style={{
        width: boyut,
        height: boyut,
        visibility: gizli ? 'hidden' : undefined,
        ...style,
      }}
    />
  )
}
