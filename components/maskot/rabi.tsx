import { cn } from '@/lib/utils'

/**
 * Rabi'nin ruh hâlleri.
 *
 * Maskot artık tek bir görsel (`public/tavsan-yuz.png`) olduğu için durum
 * **çizimi değiştirmiyor**; yalnızca ekran okuyucuya söylenen etiketi ve
 * bazı ekranlardaki eşlik eden yazıyı belirliyor. Çağıran ekranlar durumu
 * zaten hesaplıyor, propu kaldırmak on beş dosyaya dokunmayı gerektirirdi ve
 * ileride ifadeli görseller eklenirse bağlantı yerinde duruyor.
 */
export type MaskotDurumu = 'normal' | 'mutlu' | 'uykulu' | 'calisiyor' | 'uzgun' | 'kutlama'

type Props = {
  durum?: MaskotDurumu
  /** Piksel cinsinden genişlik; yükseklik oranla belirlenir. */
  boyut?: number
  className?: string
}

/**
 * Rabi — uygulamanın tavşan maskotu.
 *
 * Önce tema değişkenleriyle boyanan bir SVG'ydi. Beyaz temaya geçince kürk de
 * zemin de neredeyse beyaz kaldı ve siluet kayboldu; kontur eklemek çözdü ama
 * çizim uygulamanın geri kalanının yanında hâlâ yabancı duruyordu. Artık
 * açılış ekranıyla aynı görsel kullanılıyor: uygulama açılırken görülen tavşan
 * ile ana sayfadaki aynı tavşan.
 *
 * Yükseklik 130/120 oranında: eski SVG'nin kutusu bu ölçüdeydi ve on beş
 * ekranın yerleşimi ona göre kurulmuştu. Kare görsel `object-contain` ile bu
 * kutunun içine oturuyor, hiçbir ekranda boşluk kaymıyor.
 */
export function Rabi({ durum = 'normal', boyut = 96, className }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/tavsan-yuz.png"
      width={boyut}
      height={(boyut * 130) / 120}
      style={{ width: boyut, height: (boyut * 130) / 120 }}
      className={cn('shrink-0 object-contain', className)}
      alt={`Rabi — ${DURUM_ETIKETI[durum]}`}
      // Maskot her ekranda var ve hepsi aynı dosyayı gösteriyor: tarayıcı
      // önbelleğinden geldiği için geciktirmeye gerek yok, geciktirmek
      // ekranlar arasında geçerken bir kare boş yer bırakıyordu.
      loading="eager"
      decoding="async"
      draggable={false}
    />
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
