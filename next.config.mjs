/** @type {import('next').NextConfig} */
const nextConfig = {
  // Capacitor WebView'e gömülecek statik HTML üretilir; sunucu yok.
  output: 'export',
  images: { unoptimized: true },
}

export default nextConfig
