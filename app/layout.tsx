import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

// Tasarımın tek yazı tipi. Ailenin en kalını 800; kodda `font-black` (900)
// kullanılmıyor, olsaydı tarayıcı onu 800'e düşürüp sahte bir kalınlık üretirdi.
// `latin-ext` şart: ğ/ş/İ olmadan uygulamanın yarısı yedek yazı tipine düşer.
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
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
    { media: '(prefers-color-scheme: light)', color: '#f5f3ff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0b1c' },
  ],
}

/*
  Yazı tipi değişkenleri `<html>` üzerinde, `<body>` üzerinde **değil**.

  Tailwind teması `--font-display`i `:root` üzerinde `var(--font-jakarta), …`
  olarak tanımlıyor. Değişkenler `<body>`de dururken bu tanım `:root`ta
  çözülemiyor, geçersiz değere düşüyor ve yazı tipi hiç uygulanmıyordu.
  Tek aileye inince de, Nunito'dan Plus Jakarta Sans'a geçince de kural değişmedi.
*/
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={jakarta.variable}
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
