'use client'

/**
 * Açılış ekranı.
 *
 * Android'in kendi açılış ekranı (Android 12+) **tek bir simge** gösterebiliyor:
 * altına yazı, yanına çark koyulamıyor ve animasyonu ~1 saniyeyle sınırlı — hızlı
 * açılan bir uygulamada çoğu zaman hiç görünmüyor. İstenen ekran (zıplayan
 * tavşan + "Rabi" yazısı + dönen çark) bu yüzden uygulamanın içinde kuruldu.
 *
 * Zemin rengi sistemin açılış ekranıyla **birebir aynı** (`#C2622A`,
 * `android/app/src/main/res/values/colors.xml` içindeki `acilis_zemin`). İkisi
 * arasındaki geçiş böylece görünmüyor; farklı olsaydı açılışta bir renk sıçraması
 * olurdu.
 */

const ZEMIN = '#C2622A'

/**
 * Ekranın en az ne kadar kalacağı (ms).
 *
 * Veri localStorage'dan neredeyse anında okunuyor; süre konulmasaydı ekran bir
 * kare görünüp kaybolur, animasyon hiç izlenmezdi. 1,6 saniye zıplamanın iki
 * turunu ve "Rabi" yazısının belirmesini tamamlıyor.
 */
export const ACILIS_SURESI = 1600

export function Acilis({ kapaniyor }: { kapaniyor: boolean }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center transition-opacity duration-300"
      style={{ backgroundColor: ZEMIN, opacity: kapaniyor ? 0 : 1 }}
      aria-hidden={kapaniyor}
      role="status"
      aria-label="Rabi açılıyor"
    >
      <div className="acilis-ziplama">
        <CizgiTavsan />
      </div>

      <p className="acilis-yazi font-display mt-6 text-4xl font-semibold tracking-[0.18em] text-white">
        Rabi
      </p>

      <DonenCark />
    </div>
  )
}

/**
 * Beyaz çizgi tavşan.
 *
 * Uygulamanın içindeki dolu maskot (`components/maskot/rabi.tsx`) burada
 * kullanılmıyor: turuncu zeminin üstünde açık renkli dolgular birbirine karışıp
 * bulanık bir leke gibi duruyor. Yalnızca çizgi, zeminden net ayrışıyor.
 */
function CizgiTavsan() {
  return (
    <svg
      viewBox="0 0 120 132"
      width={116}
      height={128}
      fill="none"
      stroke="#fff"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Kulaklar */}
      <path d="M45 46 C39 30 38 16 44 8 C50 2 56 10 55 24 C54 33 52 41 50 47" />
      <path d="M75 46 C81 30 82 16 76 8 C70 2 64 10 65 24 C66 33 68 41 70 47" />

      {/* Baş */}
      <ellipse cx="60" cy="84" rx="35" ry="31" />

      {/* Kapalı, memnun gözler — sistem ekranındaki maskotla aynı ifade */}
      <path d="M45 78 q5 6 10 0" />
      <path d="M65 78 q5 6 10 0" />

      {/* Burun ve ağız */}
      <path d="M60 90 l-4.5 -4 h9 z" fill="#fff" stroke="none" />
      <path d="M60 90 v4" />
      <path d="M53 95 q7 6 14 0" />

      {/* Bıyıklar */}
      <path d="M30 88 h10 M30 95 h10 M80 88 h10 M80 95 h10" strokeWidth={3} />
    </svg>
  )
}

/**
 * Dönen çark. `lucide-react`'in `Loader`ı yerine elle çizildi: çarkın dişleri
 * dönerken belli olsun diye kalınlık ve diş sayısı bu boyuta göre ayarlandı.
 */
function DonenCark() {
  return (
    <svg
      viewBox="0 0 48 48"
      width={36}
      height={36}
      className="acilis-cark mt-9"
      fill="none"
      stroke="#fff"
      strokeOpacity={0.8}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="24" cy="24" r="7" />
      <path d="M24 4 v6 M24 38 v6 M4 24 h6 M38 24 h6 M9.9 9.9 l4.3 4.3 M33.8 33.8 l4.3 4.3 M38.1 9.9 l-4.3 4.3 M14.2 33.8 l-4.3 4.3" />
    </svg>
  )
}
