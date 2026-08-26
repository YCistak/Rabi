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

/**
 * Maskotun pozu — hangi görselin çizileceği.
 *
 * Durumdan ayrı bir prop: `durum` yalnızca ekran okuyucuya söylenen etiketi
 * belirliyor ve on beş ekran onu zaten hesaplıyor. Poz ise gerçekten başka bir
 * dosya gösteriyor, o yüzden yalnızca isteyen ekran veriyor.
 */
export type MaskotPozu = 'yuz' | 'el-sallayan'

/** Poz → dosya. Hepsi `public/` altında ve aynı kare oranda. */
const POZ_GORSELI: Record<MaskotPozu, string> = {
  yuz: '/tavsan-yuz.png',
  'el-sallayan': '/tavsan-el-sallayan.png',
}

type Props = {
  durum?: MaskotDurumu
  poz?: MaskotPozu
  /** Piksel cinsinden genişlik; yükseklik oranla belirlenir. */
  boyut?: number
  /**
   * Yerini koruyarak görünmez olur.
   *
   * Açılış ve kurulum sonrası geçişlerinde uçan tavşan tam olarak bu maskotun
   * üstüne konuyor. İkisi birden çizilseydi son karede tavşanın üstünde
   * tavşan olurdu; `display: none` ise satırın hizasını bozardı.
   */
  gizli?: boolean
  /**
   * Uçan tavşanın **varış noktası** burası.
   *
   * Açılış ekranı bu öğeyi kimliğinden bulup mesafeyi kendisi ölçüyor; varış
   * koda yazılıydı ve o hesap başlığın yerini, güvenli alanı ve kabın
   * genişliğini bilmek zorundaydı — biri değişince tavşan yuvanın yanına
   * düşüyor, katman kalkınca zıplıyordu. Aynı anda **tek** bir yuva olabilir:
   * ekranda ya ana sayfanın başlığı vardır ya kurulum sihirbazı.
   */
  yuvaMi?: boolean
  className?: string
}

/** Açılış ekranının aradığı yuvanın kimliği. */
export const MASKOT_YUVASI = 'rabi-maskot-yuvasi'

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
export function Rabi({
  durum = 'normal',
  poz = 'yuz',
  boyut = 96,
  gizli = false,
  yuvaMi = false,
  className,
}: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      id={yuvaMi ? MASKOT_YUVASI : undefined}
      src={POZ_GORSELI[poz]}
      width={boyut}
      height={(boyut * 130) / 120}
      style={{
        width: boyut,
        height: (boyut * 130) / 120,
        visibility: gizli ? 'hidden' : undefined,
      }}
      className={cn('shrink-0 object-contain', className)}
      alt={`Rabi — ${DURUM_ETIKETI[durum]}`}
      // Maskot her ekranda var ve hepsi aynı dosyayı gösteriyor: tarayıcı
      // önbelleğinden geldiği için geciktirmeye gerek yok, geciktirmek
      // ekranlar arasında geçerken bir kare boş yer bırakıyordu.
      loading="eager"
      decoding="async"
      draggable={false}
      /*
        Poz görseli yoksa yüze düşülüyor.

        Maskot birden çok dosyaya bölündü ve biri eksik kalırsa tarayıcı kırık
        görsel simgesi çiziyor: ekranın ortasında duran bir maskot için bu,
        eksik bir dosyadan çok bozuk bir uygulama gibi görünüyor.
      */
      onError={(olay) => {
        const img = olay.currentTarget
        if (img.src.endsWith(POZ_GORSELI.yuz)) return
        img.src = POZ_GORSELI.yuz
      }}
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
