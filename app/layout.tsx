import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

// Tasarımın tek yazı tipi. 400-900 arası kalınlıkların hepsi isteniyor:
// başlıklar 800/900, gövde 500/600, ince yardımcı metinler 400.
const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rabi — YKS Çalışma Asistanı',
  description:
    'Pomodoro, günlük soru takibi, deneme netleri, OBP ve tahmini YKS sıralaması. ' +
    'Devamsızlık sayacı, yanlış soru bankası ve rozetlerle tek uygulamada.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
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
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#edf1fd' },
    { media: '(prefers-color-scheme: dark)', color: '#12141c' },
  ],
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
    <html
      lang="tr"
      suppressHydrationWarning
      className={nunito.variable}
    >
      <head>
        {/* Tema sınıfı ilk boyamadan önce uygulanmazsa uygulama açılırken
            bir an yanlış renkte parlıyor (FOUC).

            Kayıtlı tercih yoksa ya da `sistem` ise cihazın gece modu izlenir —
            uygulama telefon hangi temadaysa o temada açılır. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('rabi-tema');var koyu=t==='koyu'||(t!=='acik'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(koyu){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
