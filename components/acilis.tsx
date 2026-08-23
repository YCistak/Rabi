'use client'

import { Settings } from 'lucide-react'
import { Rabi } from '@/components/maskot/rabi'

/**
 * Açılış ekranı.
 *
 * Android'in kendi açılış ekranı (Android 12+) **tek bir simge** gösterebiliyor:
 * altına yazı, yanına çark koyulamıyor ve animasyonu ~1 saniyeyle sınırlı — hızlı
 * açılan bir uygulamada çoğu zaman hiç görünmüyor. İstenen ekran (maskot +
 * "RABİ" yazısı + yükleme bloğu) bu yüzden uygulamanın içinde kuruldu.
 *
 * Uygulamaya girerken **tek** bir ekran görünmesi için üç yüzeyin zemini aynı
 * olmak zorunda ve hepsi `ACILIS_ZEMINI`ne bağlı:
 *   1. sistemin açılış ekranı (`values/colors.xml` → `acilis_zemin`),
 *   2. WebView ilk kareyi boyayana kadar görünen pencere zemini
 *      (`values/styles.xml` → `AppTheme.NoActionBar`),
 *   3. bu ekran.
 * Üçü farklıyken uygulama açılışta mor → siyah → mor diye üç kez renk
 * değiştiriyordu. Birini değiştirirsen üçünü birden değiştir.
 *
 * Ekran temadan bağımsız olarak **hep koyu**: bu bir marka anı, uygulamanın
 * ekranı değil. Maskotun renkleri de o yüzden aşağıda sabitleniyor — tema
 * değişkenlerinden gelseydi açık temada beyaz kürk koyu zeminde kaybolurdu.
 */

/** Ekranın taban rengi — üç yüzeyin de eşitlendiği renk. */
export const ACILIS_ZEMINI = '#0D0C16'

/**
 * Zeminin gradyanı. Işık kaynağı ekranın üst ortasında (`at 50% 8%`), yani tam
 * maskotun arkasında: ışığın merkezi maskotu buluyor, kenarlar taban rengine
 * (`ACILIS_ZEMINI`) iniyor. Sistem ekranı düz renk gösterebildiği için taban
 * rengi gradyanın **dış** durağıyla aynı — geçişte kenarlarda renk oynaması
 * olmuyor, yalnızca ortadaki ışık beliriyor.
 */
const ZEMIN_GRADYANI =
  'radial-gradient(120% 70% at 50% 8%, #2A2350 0%, #1A1730 38%, #0D0C16 78%)'

/**
 * Ekranın en az ne kadar kalacağı (ms).
 *
 * Veri localStorage'dan neredeyse anında okunuyor; süre konulmasaydı ekran bir
 * kare görünüp kaybolur, animasyon hiç izlenmezdi. 4,6 saniye kullanıcının
 * isteği: ekranın izlenecek kadar durması. Sayı keyfi değil — maskotun
 * hâlesinin bir turu (4,6 sn) ve yükleme yazılarının üç durumu (3 × 1,5 sn)
 * tam bu sürede tamamlanıyor, ekran yarım kalmış bir animasyonla kapanmıyor.
 */
export const ACILIS_SURESI = 4600

/** Maskotun koyu zemine göre sabitlenmiş renkleri. */
const MASKOT_RENKLERI = {
  '--maskot-kurk': '#E9E4F6',
  '--maskot-kulak-ic': '#C295B0',
  '--maskot-yanak': '#CFA4BB',
  '--maskot-burun': '#DE7F9F',
  '--maskot-agiz': '#B04468',
  '--maskot-cizgi': '#1F1937',
  '--maskot-parlak': '#FFFFFF',
} as React.CSSProperties

const SLOGAN = 'Sınav yolu arkadaşın'

/**
 * Yükleme yazıları. Üçü sırayla görünüp kayboluyor; hangisinin ne zaman
 * çıkacağını CSS gecikmesi belirliyor, sayaç tutan bir state yok — ekranın
 * ömrü zaten sabit, ikinci bir zamanlayıcı ikisini birbirinden ayırırdı.
 */
const DURUMLAR = ['Sorular hazırlanıyor', 'Serin kaydediliyor', 'Neredeyse hazır']

export function Acilis({ kapaniyor }: { kapaniyor: boolean }) {
  return (
    <div
      className="fixed inset-0 z-[60] overflow-hidden transition-opacity duration-300"
      style={{
        ...MASKOT_RENKLERI,
        backgroundColor: ACILIS_ZEMINI,
        backgroundImage: ZEMIN_GRADYANI,
        opacity: kapaniyor ? 0 : 1,
      }}
      aria-hidden={kapaniyor}
      role="status"
      aria-label="Rabi açılıyor"
    >
      <Aurora />
      <Kivilcimlar />

      {/* Tarama ışığı: ekranın üstünden aşağı geçen ince bir aydınlık. Duran
          bir gradyan zemini ölü gösteriyordu; bu, hiçbir şey söylemeden
          ekranın canlı olduğunu belli eden en ucuz hareket. */}
      <span
        className="rb-tarama pointer-events-none absolute inset-x-0 top-0 h-[220px]"
        style={{
          background:
            'linear-gradient(180deg, transparent, rgba(210,198,255,0.09) 45%, transparent)',
        }}
        aria-hidden
      />

      <div className="relative flex h-full flex-col items-center justify-center gap-10 px-6 py-14">
        <MaskotBlogu />
        <MarkaBlogu />
        <YuklemeBlogu />
      </div>

      {/* Uygulamanın tek vaadi ve ekranın alt sınırı. Açılışta söylenmesinin
          sebebi var: sunucusu olmayan bir uygulamada bu, kullanıcının ilk
          merak ettiği şey. */}
      <p className="absolute inset-x-0 bottom-[22px] text-center text-[9px] leading-none font-semibold tracking-[0.16em] uppercase text-[rgba(167,159,198,0.45)]">
        çevrimdışı çalışır
      </p>

      {/* Çarkın gradyanı. Ayrı bir SVG'de duruyor çünkü `lucide-react` ikonu
          kendi `<defs>`ini almıyor; aynı belgedeki tanıma `url(#…)` ile
          erişilebiliyor. */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="rb-cark-gradyani" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D3C8FD" />
            <stop offset="100%" stopColor="#7F6CCD" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

/**
 * Üç aurora bulutu. Yavaş, farklı hızlarda ve farklı gecikmelerle sürükleniyor;
 * süreleri (19/24/27 sn) bilerek birbirinin katı değil — katı olsaydı üçü belli
 * aralıklarla aynı yerde buluşur ve döngü fark edilirdi.
 */
function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <span
        className="rb-aurora absolute size-[240px] rounded-full blur-[8px]"
        style={{
          left: -70,
          top: 180,
          background: 'radial-gradient(circle, rgba(138,118,224,0.24), transparent 70%)',
          animationDuration: '19s',
        }}
      />
      <span
        className="rb-aurora absolute size-[260px] rounded-full blur-[8px]"
        style={{
          right: -80,
          bottom: 120,
          background: 'radial-gradient(circle, rgba(90,120,220,0.2), transparent 70%)',
          animationDuration: '24s',
          animationDelay: '3s',
        }}
      />
      <span
        className="rb-aurora absolute size-[200px] rounded-full blur-[10px]"
        style={{
          left: 40,
          top: -40,
          background: 'radial-gradient(circle, rgba(216,205,255,0.16), transparent 68%)',
          animationDuration: '27s',
          animationDelay: '8s',
        }}
      />
    </div>
  )
}

/**
 * Yukarı süzülen kıvılcımlar.
 *
 * Dağılım rastgele **değil**, indeksten türetiliyor: `Math.random()` sunucuda
 * ve tarayıcıda başka sayılar üretir, statik dışa aktarımda o fark hidrasyon
 * uyuşmazlığı olarak geri döner. Altın oran adımı, aynı sayıda parçacığı
 * yığılma yapmadan yayan en kısa deterministik yol.
 */
const KIVILCIM_SAYISI = 26
const ALTIN_ADIM = 0.6180339887

const KIVILCIM_RENKLERI = [
  'rgba(195,180,251,0.8)',
  'rgba(150,180,250,0.7)',
  'rgba(230,220,255,0.85)',
  'rgba(170,150,240,0.65)',
]

const KIVILCIMLAR = Array.from({ length: KIVILCIM_SAYISI }, (_, i) => ({
  sol: 4 + ((i * ALTIN_ADIM * 100) % 92),
  alt: 2 + (((i + 1) * 37) % 88),
  boy: 2 + (i % 4),
  renk: KIVILCIM_RENKLERI[i % KIVILCIM_RENKLERI.length],
  sure: 4.6 + (((i * 5) % 37) / 10),
  gecikme: ((i * 11) % 53) / 10,
}))

function Kivilcimlar() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {KIVILCIMLAR.map((k, i) => (
        <span
          key={i}
          className="rb-kivilcim absolute rounded-full"
          style={{
            left: `${k.sol}%`,
            bottom: `${k.alt}%`,
            width: k.boy,
            height: k.boy,
            background: k.renk,
            animationDuration: `${k.sure}s`,
            animationDelay: `${k.gecikme}s`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Maskot ve altındaki zemin.
 *
 * Maskot zıplamıyor, **eğiliyor**: 9 saniyede bir sağa sola ±2°. Zıplama
 * dikkati kendine çekiyor ve dört saniye boyunca izlenince yoruyordu; bu ekran
 * bir eylem değil bir karşılama, hareketin de o kadar sessiz olması gerekiyor.
 *
 * Gölge maskotla **aynı süreyi** paylaşıyor (ikisi de 9 sn): farklı olsalardı
 * gölge maskottan bağımsız kayar ve maskot havada duruyormuş gibi görünürdü.
 */
function MaskotBlogu() {
  return (
    <div className="relative grid size-[212px] place-items-center">
      {/* Arka parıltı: maskotu zeminden ayıran şey bu. Olmadan koyu zeminde
          koyu bir siluet gibi duruyordu. */}
      <span
        className="rb-hale absolute size-[126px] rounded-full blur-[2px]"
        style={{ background: 'radial-gradient(circle, rgba(138,118,224,0.4), transparent 68%)' }}
        aria-hidden
      />

      <Rabi
        durum="mutlu"
        boyut={116}
        className="rb-egil relative"
        style={{ filter: 'drop-shadow(0 14px 24px rgba(16,12,32,0.7))' }}
      />

      {/* Maskotun kendi gölgesi. */}
      <span
        className="rb-egil-golge absolute bottom-[26px] h-[9px] w-[74px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.6), transparent 72%)' }}
        aria-hidden
      />
      {/* Zemin ışık havuzu — maskotun bir yerde **durduğunu** söyleyen parça. */}
      <span
        className="rb-havuz absolute bottom-[14px] h-[26px] w-[150px] rounded-full blur-[3px]"
        style={{ background: 'radial-gradient(ellipse, rgba(170,150,240,0.35), transparent 70%)' }}
        aria-hidden
      />
      <span
        className="absolute bottom-[24px] h-[2px] w-[118px] rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(195,180,251,0.55), transparent)',
        }}
        aria-hidden
      />
    </div>
  )
}

/**
 * "RABİ" yazısı ve sloganı.
 *
 * Harfler dönmüyor, kaymıyor: üzerlerinden geçen tek bir parıltı var. Dört
 * harfin ayrı ayrı hareket ettiği bir açılış denendi ve okunmaz oldu — marka
 * adı okunmak için var, gösteri için değil.
 */
function MarkaBlogu() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center gap-[7px] overflow-hidden px-2">
        {['R', 'A', 'B', 'İ'].map((harf) => (
          <span
            key={harf}
            className="font-display block text-[62px] leading-none font-extrabold tracking-[-0.05em] text-transparent"
            style={{
              background: 'linear-gradient(160deg, #FFFFFF 0%, #D8CFFC 48%, #A493EE 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              filter: 'drop-shadow(0 10px 26px rgba(138,118,224,0.5))',
            }}
          >
            {harf}
          </span>
        ))}
        {/* Yazının üzerinden geçen parıltı. `overflow-hidden` kapta duruyor,
            yoksa ekranın yarısını tarardı. */}
        <span
          className="rb-shimmer absolute top-[-10%] left-0 h-[120%] w-[46px] blur-[3px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            mixBlendMode: 'overlay',
          }}
          aria-hidden
        />
      </div>

      {/* Slogan harf harf yazılıyor. `forwards`: animasyon bir kez oynayıp
          harfleri yerinde bırakıyor, döngüye girmiyor. */}
      <p
        className="m-0 flex gap-px text-[10px] leading-none font-semibold tracking-[0.34em] uppercase text-[rgba(195,180,251,0.75)]"
        aria-label={SLOGAN}
      >
        {[...SLOGAN].map((karakter, i) => (
          <span
            key={i}
            aria-hidden
            className="rb-yaz inline-block whitespace-pre"
            style={{ animationDelay: `${0.5 + i * 0.055}s` }}
          >
            {karakter}
          </span>
        ))}
      </p>
    </div>
  )
}

/**
 * Çark, şerit ve yükleme yazısı.
 *
 * Üçü de aynı şeyi söylüyor ama farklı hızda: çark sürekli döner (bir şey
 * çalışıyor), şerit gider gelir (ilerliyor), yazı değişir (ne yapılıyor).
 * Tek başına hiçbiri dört saniyeyi taşımıyordu.
 */
function YuklemeBlogu() {
  return (
    <div className="rb-suzul flex flex-col items-center gap-[13px]">
      <Settings
        size={28}
        strokeWidth={2}
        className="rb-cark"
        stroke="url(#rb-cark-gradyani)"
        aria-hidden
      />

      <span
        className="relative block h-[3px] w-[132px] overflow-hidden rounded-full"
        style={{ background: 'rgba(255,255,255,0.09)' }}
        aria-hidden
      >
        <span
          className="rb-yol absolute top-0 left-0 h-full w-[38px] rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, #C3B4FB, transparent)' }}
        />
      </span>

      {/* Üç yazı üst üste duruyor ve sırayla açılıyor. Kapsayıcının yüksekliği
          sabit: akışa girselerdi her geçişte blok bir piksel oynardı. */}
      <span className="relative block h-3 w-[200px]" aria-hidden>
        {DURUMLAR.map((metin, i) => (
          <span
            key={metin}
            className="rb-durum absolute inset-x-0 top-0 text-center text-[9.5px] leading-none font-semibold tracking-[0.2em] uppercase text-[#A79FC6]"
            style={{ animationDelay: `${i * 1.5}s` }}
          >
            {metin}
          </span>
        ))}
      </span>
    </div>
  )
}
