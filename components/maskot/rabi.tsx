import { cn } from '@/lib/utils'

/**
 * Rabi'nin ruh hâlleri.
 *
 * Durum **çizimi değiştirmiyor**; yalnızca ekran okuyucuya söylenen etiketi ve
 * bazı ekranlardaki eşlik eden yazıyı belirliyor. Çizilecek görseli seçen şey
 * `poz`.
 *
 * İkisinin ayrı kalması bilerek: ifadeli görseller geldiğinde durumu doğrudan
 * dosyaya bağlamak denendi ve açılışı bozuyordu. Açılış ekranındaki uçan
 * tavşan ana sayfadaki maskotun tam üstüne konuyor; ikisi aynı `durum`u değil
 * aynı **görseli** taşımak zorunda ve aralarında boyut farkı var (110'a karşı
 * 58). Durumdan türeyen bir görsel, katman kalkarken tavşanı başka bir tavşana
 * çevirirdi.
 */
export type MaskotDurumu = 'normal' | 'mutlu' | 'uykulu' | 'calisiyor' | 'uzgun' | 'kutlama'

/**
 * Maskotun pozu — hangi görselin çizileceği.
 *
 * `yuz` dışındakiler **tam boy**: gövde ancak 70 pikselin üstünde okunuyor,
 * altında kollar ve tutulan nesne tek bir lekeye dönüşüyor. Oyun başlıkları
 * (26–54 piksel) ve ana sayfanın selamlaması (58) bu yüzden yüzde kalıyor;
 * poz vermeyen her çağrı da oraya düşüyor.
 */
export type MaskotPozu =
  | 'yuz'
  | 'tam'
  | 'el-sallayan'
  | 'okuyan'
  | 'kupali'
  | 'sevinen'
  | 'uzgun'
  | 'dusunen'
  | 'kahveli'
  | 'isaretci'

/**
 * Poz → dosya.
 *
 * Hepsi `public/` altında, 256'lık kare tuvalde ve **aynı yükseklikte**;
 * üreten yer `scripts/maskot-uret.mjs`. Elle eklenen bir dosya bu boy
 * eşitliğini bozar ve maskot poz değiştirdiğinde büyüyüp küçülür.
 */
const POZ_GORSELI: Record<MaskotPozu, string> = {
  yuz: '/tavsan-yuz.png',
  tam: '/tavsan-tam.png',
  'el-sallayan': '/tavsan-el-sallayan.png',
  okuyan: '/tavsan-okuyan.png',
  kupali: '/tavsan-kupali.png',
  sevinen: '/tavsan-sevinen.png',
  uzgun: '/tavsan-uzgun.png',
  dusunen: '/tavsan-dusunen.png',
  kahveli: '/tavsan-kahveli.png',
  isaretci: '/tavsan-isaretci.png',
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
 * çizim uygulamanın geri kalanının yanında hâlâ yabancı duruyordu. Sonra
 * emojinin (🐰) kendisi bir PNG olarak kullanıldı — o da uygulamaya ait
 * değildi, telefonun yazı tipinden gelen bir simgeydi. Şimdi maskotun kendi
 * çizimleri var (`scripts/maskot-uret.mjs`).
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
      // Maskot her ekranda var: geciktirmek ekranlar arasında geçerken bir
      // kare boş yer bırakıyordu. Pozlar ayrı dosyalar ama her biri yetmiş
      // kilobaytın altında ve ilk gösterimden sonra önbellekten geliyor.
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
