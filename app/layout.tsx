import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-space-grotesk',
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
    { media: '(prefers-color-scheme: light)', color: '#fbf9f6' },
    { media: '(prefers-color-scheme: dark)', color: '#131211' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Tema sınıfı ilk boyamadan önce uygulanmazsa uygulama açılırken
            bir an yanlış renkte parlıyor (FOUC). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('rabi-tema');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'koyu':'acik'}if(t==='koyu'){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
