'use client'

import { Rabi } from '@/components/maskot/rabi'

/**
 * Açılış ekranı.
 *
 * Android'in kendi açılış ekranı (Android 12+) **tek bir simge** gösterebiliyor:
 * altına yazı, yanına çark koyulamıyor ve animasyonu ~1 saniyeyle sınırlı — hızlı
 * açılan bir uygulamada çoğu zaman hiç görünmüyor. İstenen ekran (inen tavşan +
 * "RABİ" yazısı + yükleme şeridi) bu yüzden uygulamanın içinde kuruldu.
 *
 * Zemin rengi sistemin açılış ekranıyla **birebir aynı** (`#F8F8F7`,
 * `android/app/src/main/res/values/colors.xml` içindeki `acilis_zemin`). İkisi
 * arasındaki geçiş böylece görünmüyor; farklı olsaydı açılışta bir renk
 * sıçraması olurdu. Sabit yazılı çünkü CSS değişkeni Android tarafından
 * okunamıyor; ikisini birlikte değiştir.
 */
const ZEMIN = '#F8F8F7'

/**
 * Ekranın en az ne kadar kalacağı (ms).
 *
 * Veri localStorage'dan neredeyse anında okunuyor; süre konulmasaydı ekran bir
 * kare görünüp kaybolur, animasyon hiç izlenmezdi. 2,4 saniye tavşanın inişini,
 * "RABİ" yazısının belirmesini ve yükleme şeridinin bir turunu tamamlıyor.
 */
export const ACILIS_SURESI = 2400

export function Acilis({ kapaniyor }: { kapaniyor: boolean }) {
  return (
    <div
      className="fixed inset-0 z-[60] overflow-hidden transition-opacity duration-300"
      style={{ backgroundColor: ZEMIN, opacity: kapaniyor ? 0 : 1 }}
      aria-hidden={kapaniyor}
      role="status"
      aria-label="Rabi açılıyor"
    >
      {/* Arka planda yavaşça sürüklenen iki yumuşak parıltı. Zemin düz beyaza
          yakın; bunlar olmadan ekran boş bir kâğıt gibi duruyor. */}
      <span className="acilis-parilti acilis-parilti-sol" />
      <span className="acilis-parilti acilis-parilti-sag" />

      {/*
        Yerleşim `flex` ile değil, ortadan ölçülen sabit boşluklarla kuruluyor:
        parçalar farklı zamanlarda beliriyor ve akışta olsalardı biri gelirken
        ötekiler kayıyordu. Boşluklar `mt-*` ile veriliyor, üst üste binmesin
        diye her parçaya kendi satır yüksekliği kadar yer ayrıldı.
      */}
      <div className="absolute inset-x-0 top-1/2 flex flex-col items-center">
        {/* Maskotun arkasındaki hale ve altındaki zemin gölgesi */}
        <span className="acilis-hale" />
        <span className="acilis-golge" />

        <div className="acilis-inis -mt-[160px]">
          {/*
            Uygulamanın kendi maskotu kullanılıyor, ayrı bir açılış çizimi değil:
            animasyon tavşanı sol üste süzülerek bitiriyor ve orada ana sayfanın
            başlığındaki maskotun üstüne oturuyor. İki farklı çizim olsaydı
            geçişte tavşan değişiyormuş gibi görünürdü.
          */}
          <Rabi durum="mutlu" boyut={112} />
        </div>

        {/*
          "RABİ" — 50px yazının satır yüksekliği 1.32 (66px): "İ" harfinin
          noktası kırpılmasın diye.
        */}
        <p className="acilis-yazi font-display mt-[62px] text-[50px] font-extrabold leading-[1.32] tracking-[-0.05em] text-foreground">
          RABİ
        </p>

        {/*
          Slogan. Üst boşluk yazının **kutusunun altından** ölçülüyor: 62 + 66 =
          128, üstüne 14px nefes. Tasarımın ilk hâlinde bu değer 115'ti ve
          yazının alt kısmı sloganın üstüne biniyordu.
        */}
        <p className="acilis-slogan mt-[14px] text-[9.5px] font-semibold uppercase leading-none tracking-[0.3em] text-muted-foreground">
          Sınav yolu arkadaşın
        </p>

        {/* Yükleme bloğu: çark + tarayan şerit + durum metni */}
        <div className="acilis-yukleme mt-[34px] flex flex-col items-center gap-3">
          <DonenCark />
          <span className="acilis-ray" aria-hidden />
          <span className="text-[9.5px] font-semibold uppercase leading-none tracking-[0.2em] text-muted-foreground">
            Hazırlanıyor
          </span>
        </div>
      </div>

      <p className="acilis-alt absolute inset-x-0 bottom-[22px] text-center text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        çevrimdışı çalışır
      </p>
    </div>
  )
}

/**
 * Dönen çark. `lucide-react`'in `Loader`ı yerine dişli kullanılıyor: dönen bir
 * daire her uygulamada aynı, dişli Rabi'nin "hazırlanıyor" hâline daha çok
 * benziyor. Çizim Feather'ın `settings` dişlisi; 26px'te dişleri seçilsin diye
 * çizgi kalınlığı 2.
 */
function DonenCark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={26}
      height={26}
      className="acilis-cark"
      fill="none"
      stroke="var(--primary)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
