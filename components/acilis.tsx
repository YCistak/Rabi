'use client'

import { useEffect, useState } from 'react'
import { MASKOT_YUVASI, TavsanYuzu } from '@/components/maskot/tavsan-yuz'

/**
 * Açılış ekranı.
 *
 * Android'in kendi açılış ekranı (Android 12+) **tek bir simge** gösterebiliyor
 * ve animasyonu ~1 saniyeyle sınırlı; istenen ekran (inen maskot, beliren
 * "RABİ" yazısı, sonunda maskotun ana sayfadaki yerine süzülmesi) bu yüzden
 * uygulamanın içinde kuruldu.
 *
 * Uygulamaya girerken **tek** bir ekran görünmesi için üç yüzeyin zemini aynı
 * olmak zorunda ve hepsi `ACILIS_ZEMINI`ne bağlı:
 *   1. sistemin açılış ekranı (`values/colors.xml` → `acilis_zemin`),
 *   2. WebView ilk kareyi boyayana kadar görünen pencere zemini
 *      (`values/drawable/acilis_zemini.xml`),
 *   3. bu ekran.
 * Renk, gradyanın **dış** durağı: gradyanın ışığı sol üst köşede, geri kalan
 * her yeri tam bu renk. Sistem ekranı gradyan gösteremediği için eşitlenecek
 * tek sayı bu — birini değiştirirsen üçünü birden değiştir.
 *
 * Ekran temadan bağımsız olarak **hep koyu**: bu bir marka anı, uygulamanın
 * ekranı değil.
 */

/** Ekranın taban rengi — üç yüzeyin de eşitlendiği renk. */
export const ACILIS_ZEMINI = '#0E0D16'

/** Zeminin gradyanı; ışık kaynağı sol üst köşenin dışında. */
const ZEMIN_GRADYANI = 'radial-gradient(130% 65% at 15% -10%, #221F3D 0%, #0E0D16 60%)'

/**
 * Ekranın ömrü (ms) — tasarımın kendi süresi.
 *
 * Bütün parçalar tek bir 4,2 saniyelik zaman çizgisini paylaşıyor: %0–34 iniş,
 * %34–68 duruş, %68–100 çıkış. Süreyi değiştirirsen `.rb3-*` sınıflarının
 * hepsini birlikte değiştir; yüzdeler kendiliğinden ölçeklenir ama süreler
 * birbirinden ayrılırsa parçalar dağılır.
 *
 * Veri okumasına bağlanmadı: localStorage neredeyse anında dönüyor,
 * bağlansaydı ekran bir kare görünüp kaybolur ve animasyon hiç izlenmezdi.
 */
export const ACILIS_SURESI = 4200

/** Maskotun açılıştaki boyu (px) — tasarımda 96. */
const MASKOT_BOYU = 96

/**
 * Tasarımın kendi varış değerleri (360×720 çerçeve için).
 *
 * Ölçüm tutmazsa buraya düşülüyor; ekran yine tasarımdaki gibi bitiyor,
 * yalnızca maskot ana sayfadaki yuvasının birkaç piksel yanına oturuyor.
 */
const VARSAYILAN_VARIS = { dx: -138, dy: -316, olcek: 0.6 }

type Varis = { dx: number; dy: number; olcek: number }

/**
 * Maskotun nereye süzüleceğini ana sayfadaki yuvadan ölçer.
 *
 * Tasarım bu mesafeyi `translate(-138px, -316px) scale(0.6)` diye sabit
 * yazıyor ama o sayılar 360×720'lik prototip çerçevesine ait: gerçek
 * telefonlarda ekranın ortası da başlığın yeri de başka yerde. Sabit kalsaydı
 * maskot yuvanın yanına düşer ve katman kalkınca zıplardı — geçişin tamamı o
 * zıplamada kaybolurdu.
 *
 * Ölçüm ilk boyamadan sonraya bırakılıyor ve tutmazsa yineleniyor: açılış
 * katmanı ana sayfayla aynı anda çiziliyor, ilk karede yuva henüz yok olabilir
 * (veri okunuyor) ya da ölçüsü sıfır dönebilir.
 *
 * Yineleme `requestAnimationFrame` ile değil zamanlayıcıyla: sayfa görünür
 * değilken (uygulama arka planda açıldıysa, cihaz kareyi hiç çizmiyorsa) rAF
 * hiç çağrılmıyor ve ölçüm sonsuza kadar bekliyor. Zamanlayıcı o durumda da
 * işliyor; hesap zaten çizime değil düzene bakıyor.
 */
const OLCUM_ARALIGI = 16
const OLCUM_DENEMESI = 60

function useVaris(): Varis {
  const [varis, setVaris] = useState<Varis>(VARSAYILAN_VARIS)

  useEffect(() => {
    let zamanlayici = 0
    let kalanDeneme = OLCUM_DENEMESI

    const olc = () => {
      const yuva = document.getElementById(MASKOT_YUVASI)
      const kutu = yuva?.getBoundingClientRect()

      // Yuva henüz yok (veri okunuyor ya da kurulum sihirbazı açık) veya
      // ölçüsü sıfır: birazdan yeniden bak, deneme hakkı biterse tasarımın
      // kendi sayılarıyla devam et.
      if (!kutu || kutu.width === 0) {
        if (kalanDeneme-- > 0) zamanlayici = window.setTimeout(olc, OLCUM_ARALIGI)
        return
      }

      // Açılış maskotu ekranın tam ortasında duruyor ve `MASKOT_BOYU` kadar.
      const merkezX = window.innerWidth / 2
      const merkezY = window.innerHeight / 2
      setVaris({
        dx: kutu.left + kutu.width / 2 - merkezX,
        dy: kutu.top + kutu.height / 2 - merkezY,
        olcek: kutu.width / MASKOT_BOYU,
      })
    }

    olc()
    return () => clearTimeout(zamanlayici)
  }, [])

  return varis
}

export function Acilis() {
  const varis = useVaris()

  // `pointer-events-none`: son yarım saniyede zemin çoktan saydam ve altta ana
  // sayfa görünüyor. Katman dokunuşları yutsaydı kullanıcı gördüğü ekrana basıp
  // hiçbir şey olmadığını sanırdı; ekranda dokunulacak bir şey zaten yok.
  return (
    <div
      className="rb3-acilis font-marka pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      role="status"
      aria-label="Rabi açılıyor"
      style={
        {
          '--rb3-dx': `${varis.dx}px`,
          '--rb3-dy': `${varis.dy}px`,
          '--rb3-olcek': varis.olcek,
        } as React.CSSProperties
      }
    >
      {/*
        Zemin ayrı bir katman: tasarımda çerçevenin kendi arka planı ve hiç
        solmuyor, çünkü prototipte arkasında hiçbir şey yok. Uygulamada arkada
        ana sayfa duruyor ve zemin kalkmazsa katman sertçe siliniyor — maskotun
        yerine oturması da o sertlikte kayboluyor. Bu yüzden zemin de ekranın
        kendi çıkış eğrisini (`rb3-son`) izliyor: yazılar giderken zemin de
        açılıyor, maskot son yarım saniyesini ana sayfanın üstünde uçarak
        tamamlıyor.
      */}
      <span
        className="rb3-son absolute inset-0"
        style={{ backgroundColor: ACILIS_ZEMINI, backgroundImage: ZEMIN_GRADYANI }}
        aria-hidden
      />

      {/* Arka plan parıltısı. */}
      <span
        className="rb-aurora absolute rounded-full blur-[9px]"
        style={{
          left: -60,
          bottom: 190,
          width: 240,
          height: 240,
          background: 'radial-gradient(circle, rgba(138,118,224,0.2), transparent 70%)',
        }}
        aria-hidden
      />

      {/* Logonun arkasında nefes alan iki katmanlı hâle. Tek katmanken ışık
          maskotun kenarında sert bir daire olarak bitiyordu. */}
      <span
        className="rb3-hale absolute top-1/2 left-1/2 rounded-full blur-[14px]"
        style={{
          width: 260,
          height: 260,
          margin: '-130px 0 0 -130px',
          background:
            'radial-gradient(circle, rgba(138,118,224,0.28), rgba(122,150,240,0.1) 45%, transparent 70%)',
          animationDuration: '8s, 4.2s',
        }}
        aria-hidden
      />
      <span
        className="rb3-hale absolute top-1/2 left-1/2 rounded-full blur-[6px]"
        style={{
          width: 170,
          height: 170,
          margin: '-85px 0 0 -85px',
          background: 'radial-gradient(circle, rgba(170,150,240,0.42), transparent 68%)',
          animationDuration: '5.4s, 4.2s',
          animationDelay: '0.8s, 0s',
        }}
        aria-hidden
      />

      {/* Wordmark. Satır yüksekliği 1.32: daha dar bir değerde "İ"nin noktası
          kırpılıyor. */}
      <p
        className="rb3-yazi absolute inset-x-0 top-1/2 m-0 text-center text-[46px] leading-[1.32] font-extrabold tracking-[-0.05em] text-transparent"
        style={{
          marginTop: 64,
          background: 'linear-gradient(160deg, #FFFFFF, #A493EE)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          filter: 'drop-shadow(0 10px 24px rgba(138,118,224,0.5))',
        }}
      >
        RABİ
      </p>

      <p
        className="rb3-slogan absolute inset-x-0 top-1/2 m-0 text-center text-[9.5px] leading-none font-semibold tracking-[0.3em] uppercase"
        style={{ marginTop: 132, color: 'rgba(195,180,251,0.7)' }}
      >
        Sınav yolu arkadaşın
      </p>

      {/* Maskot: yukarıdan iner, ortada durur, çıkışta ana sayfadaki yuvasına
          süzülür. Katmanın en üstünde çünkü giderken zemin çoktan açılmış
          oluyor ve son anlarını ana sayfanın üstünde geçiriyor. */}
      <TavsanYuzu
        boyut={MASKOT_BOYU}
        className="rb3-inis absolute top-1/2 left-1/2"
        style={{ margin: `${-MASKOT_BOYU / 2}px 0 0 ${-MASKOT_BOYU / 2}px` }}
      />

      {/* Uygulamanın tek vaadi. Açılışta söylenmesinin sebebi var: sunucusu
          olmayan bir uygulamada bu, kullanıcının ilk merak ettiği şey. */}
      <p
        className="rb3-son absolute inset-x-0 bottom-[22px] m-0 text-center text-[10.5px] leading-none font-semibold tracking-[0.16em] uppercase"
        style={{ color: 'rgba(195,180,251,0.72)' }}
      >
        çevrimdışı çalışır
      </p>
    </div>
  )
}
