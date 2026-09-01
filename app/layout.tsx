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
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
