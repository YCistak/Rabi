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
    <html
      lang="tr"
      className={`${nunito.variable} ${manrope.variable}`}
      // Tablet betiği hidrasyondan önce `style="--olcek: …"` yazıyor; React
      // bunu sunucu çıktısıyla karşılaştırıp uyarıyordu. Uyarı dev'de kalıyor
      // ama gürültü; öznitelik bilerek farklı.
      suppressHydrationWarning
    >
      <head>
        {/*
          Açılış teşhisi — beyaz ekrana karşı.

          Bir telefonda (vivo Y18, Play sürümü) uygulama bembeyaz kaldı ve
          elimizde hiçbir iz yoktu: Crashlytics raporu ancak uygulama açılıp
          kullanıcı onay verince gidiyor, açılamayan uygulama soramıyor.
          Bu betik React'ten ve her şeyden önce çalışıyor; ilk karedeki JS
          hatalarını (bundle'ın çözümlenememesi dahil) biriktiriyor ve
          `AppShell` 8 saniye içinde `data-rabi-acildi` işaretini koymazsa
          beyaz ekranın yerine hata metni + cihaz bilgisi basıyor. Kullanıcı
          ekran görüntüsünü gönderiyor, sebebi oradan okuyoruz.

          Ağa çıkmıyor, hiçbir şeyi kaydetmiyor; yalnızca ekrana yazıyor.
          Normal açılışta hiçbir izi yok.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var hatalar = [];
  function kaydet(m){ if (hatalar.length < 8) hatalar.push(String(m).slice(0, 400)); }
  window.addEventListener('error', function(e){
    kaydet((e.message || 'hata') + (e.filename ? ' @ ' + e.filename.split('/').pop() + ':' + e.lineno : ''));
  }, true);
  window.addEventListener('unhandledrejection', function(e){
    var r = e.reason; kaydet('promise: ' + (r && (r.stack || r.message) || r));
  });
  setTimeout(function(){
    if (document.documentElement.getAttribute('data-rabi-acildi') === '1') return;
    var d = document.createElement('div');
    d.setAttribute('style', 'position:fixed;inset:0;z-index:2147483647;background:#fff;color:#111;padding:24px 16px;font:15px/1.5 sans-serif;overflow:auto;white-space:pre-wrap;word-break:break-word');
    d.textContent = 'Rabi açılamadı.\\n\\nBu ekranın görüntüsünü geliştiriciye gönderir misin?\\n\\n'
      + 'Cihaz: ' + navigator.userAgent + '\\n'
      + 'Ekran: ' + window.innerWidth + 'x' + window.innerHeight + '\\n'
      + 'Adres: ' + location.href + '\\n\\n'
      + (hatalar.length ? 'Hatalar:\\n' + hatalar.join('\\n\\n') : 'Hata yakalanmadı (JS hiç çalışmamış ya da yükleme takılmış olabilir).');
    document.body ? document.body.appendChild(d) : document.documentElement.appendChild(d);
  }, 8000);
})();`,
          }}
        />
        {/*
          Tablet ölçeği. Tasarım telefon için; tablette sütun ortada dar
          kalıyor, iki yan boş duruyordu. Çözüm arayüzü genişletmek değil,
          telefondaki görüntüyü büyütmek: betik `<html>`e `--olcek` yazıyor,
          `globals.css` onu `<body>`ye `zoom` olarak veriyor; düzen
          `TELEFON_GENISLIGI` CSS pikseline göre kuruluyor ve ekrana sığacak
          kadar büyütülüyor. Telefonda (kısa kenar `ESIK` altı) ölçek 1.

          `zoom` seçildi, viewport meta değil: meta'yı betikle sonradan
          değiştirmek tarayıcı emülasyonunda tutarsızdı. `zoom` `position:
          fixed`i etkilemiyor — alt menü ve tam ekran katmanlar ekrana yapışık
          kalıyor; px/rem ölçüler büyüyor, istenen de bu. Viewport birimlerini
          de etkilemiyor ve bu istenmiyor: ekranı dolduran yükseklikler
          `--olcek`e bölünüyor (`.yuk-ekran`, `.en-az-ekran`). Zoom neden
          `html`de değil, `globals.css`te yazıyor: kökte kaydırma bozuluyordu.

          Değerler: 430 en geniş telefonun CSS genişliği; eşik 480, çünkü
          telefonlar 360–430, 8" tabletler 533'ten başlıyor. Ölçek kısa
          kenardan hesaplanıyor ki döndürünce yazı boyutu değişmesin.

          Hidrasyondan önce, satır içi: React beklenirse ilk kare dar
          düzende çizilip sonra zıplıyor.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var TELEFON_GENISLIGI = 430, ESIK = 480;
  // Masaüstü tarayıcıda (fare + imleç) kapalı: geliştirirken pencere
  // yüksekliği tablet sayılıp her şey 2 kat büyüyordu. DevTools cihaz modu
  // dokunmatik taklit ettiği için orada tablet emülasyonu çalışmaya devam eder.
  var masaustu = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function uygula(){
    var kisa = Math.min(window.innerWidth, window.innerHeight);
    document.documentElement.style.setProperty('--olcek', masaustu || kisa < ESIK ? '1' : String(kisa / TELEFON_GENISLIGI));
  }
  uygula();
  window.addEventListener('resize', uygula);
})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
