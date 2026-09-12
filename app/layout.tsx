import type { Metadata, Viewport } from 'next'
import { Manrope, Nunito } from 'next/font/google'
import './globals.css'

// Tasarımın tek yazı tipi. 400-900 arası kalınlıkların hepsi isteniyor:
// başlıklar 800/900, gövde 500/600, ince yardımcı metinler 400.
const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
})

// Yalnızca açılış ekranının yazı tipi (`font-marka`). Tasarım o ekranı Manrope
// ile çizdi ve "RABİ" 50 pikselde iki ailede belirgin biçimde farklı duruyor;
// uygulamanın geri kalanı Nunito'da kalıyor.
//
// `display: 'block'` bilerek: açılış ekranı 4,2 saniye sürüyor ve wordmark o
// ekranın tamamı. `swap` ile yazı önce yedek aileyle çizilip sonra yerine
// oturuyordu — marka adının ilk yarım saniyede başka bir yazı tipinde
// görünmesi, en çok bakılan anda gözden kaçmıyor. Yazı tipi zaten uygulamayla
// birlikte geliyor (next/font derleme anında indirip gömüyor), yani beklenen
// süre ağ değil yalnızca çözümleme.
const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '800'],
  variable: '--font-manrope',
  display: 'block',
})

export const metadata: Metadata = {
  title: 'Rabi — YKS Çalışma Asistanı',
  description:
    'Pomodoro, günlük soru takibi, deneme netleri, OBP ve tahmini YKS sıralaması. ' +
    'Devamsızlık sayacı, yanlış soru bankası ve rozetlerle tek uygulamada.',
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rabi',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Android 15'ten sonra uygulama penceresi sistem çubuklarının arkasına
  // çiziliyor ve bu ayar olmadan WebView `env(safe-area-inset-*)` değerlerini
  // 0 bildiriyordu — alt menünün yazıları gezinme çubuğunun altında kalıyordu.
  // Boşluklar `--guvenli-ust` / `--guvenli-alt` ile elle veriliyor.
  viewportFit: 'cover',
  // Tek tema var; cihaz gece modundayken bile uygulama açık kalıyor.
  colorScheme: 'light',
  themeColor: '#f8f8f7',
}

/*
  Yazı tipi değişkenleri `<html>` üzerinde, `<body>` üzerinde **değil**.

  Tailwind teması `--font-display`i `:root` üzerinde `var(--font-nunito), …`
  olarak tanımlıyor. Değişkenler `<body>`de dururken bu tanım `:root`ta
  çözülemiyor, geçersiz değere düşüyor ve yazı tipi hiç uygulanmıyordu.
  Nunito'ya geçince iki aile tek aileye indi ama kural değişmedi.
*/
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${nunito.variable} ${manrope.variable}`}>
      <head>
        {/*
          Tablet ölçeği. Tasarım telefon için; tablette sütun ortada dar
          kalıyor, iki yan boş duruyordu. Çözüm arayüzü genişletmek değil,
          telefondaki görüntüyü büyütmek: viewport'a yalnızca `initial-scale`
          veriliyor, genişlik verilmiyor. Genişlik verilmeyince WebView düzen
          genişliğini `cihaz genişliği / ölçek` olarak kendisi hesaplıyor;
          elle `width=` yazınca yuvarlama farkı düzen viewport'unu görsel
          viewport'tan bir iki piksel geniş bırakıyor, sayfa yana kayıyor ve
          `position: fixed` alt menü ekrana değil o geniş düzene yapışıyordu.

          `TABLET_TABAN` = 430, en geniş telefonun CSS genişliği: tablette
          düzen tam telefondaki gibi kuruluyor, sadece büyük. `ESIK` = 480:
          telefonlar 360–430 arasında, 8" tabletler 533'ten başlıyor (800 px
          fiziksel / 1,5 dpr); 600 alınsaydı küçük tabletler telefon
          sayılırdı. Kısa kenar eşiğin altındaysa hiçbir şey değişmiyor.

          Hidrasyondan önce, satır içi: React beklenirse ilk kare dar
          düzende çizilip sonra zıplıyor.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var TABLET_TABAN = 430, ESIK = 480;
  var kisa = Math.min(screen.width, screen.height);
  if (kisa < ESIK) return;
  var olcek = kisa / TABLET_TABAN;
  var m = document.querySelector('meta[name="viewport"]');
  if (!m) { m = document.createElement('meta'); m.name = 'viewport'; document.head.appendChild(m); }
  m.content = 'initial-scale=' + olcek + ', minimum-scale=' + olcek + ', maximum-scale=' + olcek + ', user-scalable=no, viewport-fit=cover';
})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
