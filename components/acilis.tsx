'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { MASKOT_YUVASI, Rabi } from '@/components/maskot/rabi'

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
 * Ekranın ömrü (ms) — tasarımın kendi süresi.
 *
 * Bütün parçalar tek bir 4,2 saniyelik zaman çizgisini paylaşıyor ve sıralarını
 * yüzdelerle alıyor: %0–34 iniş, %34–68 duruş, %68–100 çıkış. Süreyi
 * değiştirirsen `globals.css`'teki bütün `acilis-*` sürelerini birlikte
 * değiştir; yüzdeler kendiliğinden ölçeklenir ama süreler birbirinden ayrılırsa
 * parçalar dağılır.
 *
 * Veri okumasına bağlanmadı: localStorage neredeyse anında dönüyor,
 * bağlansaydı ekran bir kare görünüp kaybolur ve animasyon hiç izlenmezdi.
 */
export const ACILIS_SURESI = 4200

/**
 * Maskotun açılıştaki ölçüleri.
 *
 * Tasarım 118 piksellik kare bir görsel çiziyor. `Rabi`nin kutusu ise 130/120
 * oranında — eski SVG'nin kutusu bu ölçüdeydi ve on beş ekranın yerleşimi ona
 * göre kuruldu. Kare görsel `object-contain` ile o kutunun **ortasına**
 * oturuyor, yani kutu görselden 8 piksel uzun. Üst boşluk bu yüzden kutunun
 * değil görselin merkezinden ölçülüyor: doğrudan tasarımın -160'ı yazılsaydı
 * tavşan 5 piksel aşağı kayardı.
 */
const MASKOT_BOYU = 118
const MASKOT_KUTUSU = (MASKOT_BOYU * 130) / 120
/** Görselin merkezi, ekranın ortasına göre (tasarımda kutunun üstü -160). */
const MASKOT_MERKEZI = -160 + MASKOT_BOYU / 2

/**
 * Tavşanın gösteri sonunda gideceği yer.
 *
 * `kose`: ana sayfanın başlığındaki maskotun üstü — uygulama daha önce
 * kurulmuşsa açılışın arkasında ana sayfa duruyor.
 * `kurulum`: kurulum sihirbazının tepesindeki maskotun üstü. İlk açılışta sol
 * üst köşede hiçbir şey yok; tavşan oraya gidince ekranın kimsesiz bir
 * köşesine süzülmüş gibi oluyordu.
 *
 * Konum sınıf değil **değişken** olarak veriliyor: `kurulumTamamlandi`
 * localStorage'dan bir kare sonra geliyor ve sınıf değişseydi animasyon
 * baştan başlardı. Değişken değişince yalnız varış noktası güncelleniyor.
 */
export type AcilisVarisi = 'kose' | 'kurulum'

/*
  Yedek varış değerleri.

  Asıl değerler ölçülerek bulunuyor (bkz. `useVaris`); buradakiler ölçüm hiç
  tutmazsa kullanılıyor. Uçan tavşanın durduğu yer yatayda ekranın ortası,
  dikeyde `50dvh + MASKOT_MERKEZI` — yani ortanın 101 piksel yukarısı. Yatay
  hedef her iki varışta da sayfa kabının solundan 47px içeride (`mx-auto
  max-w-md` + `px-4` + `px-0.5` + maskotun yarısı): dar ekranda kap ekranla
  aynı, geniş ekranda 448px'e oturuyor — `max()` ikisini de karşılıyor.
*/
const VARIS: Record<AcilisVarisi, React.CSSProperties> = {
  // Ana sayfa başlığındaki 58px'lik maskot.
  kose: {
    '--acilis-x': 'calc(max(0px, (100vw - 448px) / 2) + 47px - 50vw)',
    '--acilis-y': 'calc(1.25rem + var(--guvenli-ust) + 138.7px + 101px - 50dvh)',
    '--acilis-olcek': '0.492',
  },
  // Kurulumun tepesindeki 110px'lik maskot: yatayda zaten ortada.
  kurulum: {
    '--acilis-x': '0px',
    '--acilis-y': 'calc(2rem + var(--guvenli-ust) + 158.9px + 101px - 50dvh)',
    '--acilis-olcek': '0.932',
  },
} as Record<AcilisVarisi, React.CSSProperties>

type Olcum = { dx: number; dy: number; olcek: number }

/** Yuva geç doğabiliyor: ölçüm tutmazsa bu aralıkla bu kadar kez yineleniyor. */
const OLCUM_ARALIGI = 16
const OLCUM_DENEMESI = 60

/**
 * Maskotun nereye süzüleceğini varış noktasındaki maskottan ölçer.
 *
 * Varış noktası koda yazılabilirdi — bir süre öyleydi (yukarıdaki `VARIS`
 * tablosu) — ama o hesap başlığın kaç piksel yukarıda durduğunu, güvenli alanı
 * ve kabın genişliğini bilmek zorunda: biri değişince tavşan yuvanın yanına
 * düşüyor ve katman kalkınca zıplıyor. Geçişin tamamı o zıplamada kayboluyor.
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
function useVaris(): Olcum | null {
  const [olcum, setOlcum] = useState<Olcum | null>(null)

  useEffect(() => {
    let zamanlayici = 0
    let kalanDeneme = OLCUM_DENEMESI

    const olc = () => {
      const yuva = document.getElementById(MASKOT_YUVASI)
      const kutu = yuva?.getBoundingClientRect()

      // Yuva henüz yok (veri okunuyor) ya da ölçüsü sıfır: birazdan yeniden
      // bak, deneme hakkı biterse yedek değerlerle devam et.
      if (!kutu || kutu.width === 0) {
        if (kalanDeneme-- > 0) zamanlayici = window.setTimeout(olc, OLCUM_ARALIGI)
        return
      }

      // İki kutu da kare görseli ortalayan `object-contain` kutusu; kutunun
      // merkezi görselin merkeziyle aynı yerde.
      setOlcum({
        dx: kutu.left + kutu.width / 2 - window.innerWidth / 2,
        dy: kutu.top + kutu.height / 2 - (window.innerHeight / 2 + MASKOT_MERKEZI),
        olcek: kutu.width / MASKOT_BOYU,
      })
    }

    olc()
    return () => clearTimeout(zamanlayici)
  }, [])

  return olcum
}

/**
 * Ekran hiç kare üretilmeden başlarsa animasyonun görüleceği bir yer kalmıyor.
 *
 * CSS animasyonları sayfa çizilir çizilmez başlıyor. Uygulama açılırken o an
 * ekranı hâlâ Android'in kendi açılış ekranı kaplıyor olabiliyor: animasyon
 * arkada akıp bitiyor ve pencere açıldığında kullanıcı yalnızca son karesini
 * görüyor. Dışarıdan bakınca "animasyon hiç oynamadı" gibi duruyor.
 *
 * Bu yüzden zaman çizgisi duraklatılmış başlıyor ve **kare üretildiği** an
 * salınıyor: arka arkaya iki `requestAnimationFrame`, tarayıcının gerçekten
 * çizdiğinin kanıtı. rAF sayfa görünür değilken hiç çağrılmadığı için
 * `visibilitychange` de dinleniyor.
 *
 * Emniyet zamanlayıcısı şart: kare hiç gelmezse ekran sonsuza kadar donuk
 * kalır ve uygulama açılış katmanının altında kilitlenirdi.
 */
const EMNIYET_SURESI = 800

function useBaslangic(): boolean {
  const [basladi, setBasladi] = useState(false)

  useEffect(() => {
    let bitti = false
    let kare1 = 0
    let kare2 = 0

    const basla = () => {
      if (bitti) return
      bitti = true
      setBasladi(true)
    }

    const kareBekle = () => {
      cancelAnimationFrame(kare1)
      cancelAnimationFrame(kare2)
      kare1 = requestAnimationFrame(() => {
        kare2 = requestAnimationFrame(basla)
      })
    }

    const gorunurlukDegisti = () => {
      if (document.visibilityState === 'visible') kareBekle()
    }

    kareBekle()
    document.addEventListener('visibilitychange', gorunurlukDegisti)
    const emniyet = window.setTimeout(basla, EMNIYET_SURESI)

    return () => {
      cancelAnimationFrame(kare1)
      cancelAnimationFrame(kare2)
      clearTimeout(emniyet)
      document.removeEventListener('visibilitychange', gorunurlukDegisti)
    }
  }, [])

  return basladi
}

/**
 * @param onBitti Ekranın ömrü dolduğunda çağrılır.
 *
 * Sayaç bu bileşenin içinde, çağıranda değil: ekran ancak animasyon başlayınca
 * yaşamaya başlıyor ve o anı yalnızca burası biliyor. Dışarıda tutulsaydı sayaç
 * animasyondan önce işlemeye başlar, yavaş açılan bir telefonda katman maskot
 * yuvasına varmadan kaldırılırdı.
 */
export function Acilis({ onBitti, varis = 'kose' }: { onBitti: () => void; varis?: AcilisVarisi }) {
  const olcum = useVaris()
  const basladi = useBaslangic()

  // Geri çağrı her çizimde yeniden üretilebiliyor; sayacın ona bakması
  // zamanlayıcıyı sıfırlardı.
  const bitisRef = useRef(onBitti)
  bitisRef.current = onBitti

  useEffect(() => {
    if (!basladi) return
    const zamanlayici = window.setTimeout(() => bitisRef.current(), ACILIS_SURESI)
    return () => clearTimeout(zamanlayici)
  }, [basladi])

  const hedef = olcum
    ? ({
        '--acilis-x': `${olcum.dx}px`,
        '--acilis-y': `${olcum.dy}px`,
        '--acilis-olcek': olcum.olcek,
      } as React.CSSProperties)
    : VARIS[varis]

  return (
    <div
      // Zemin bu katmanda değil altındaki `acilis-zemin`de: gösteri biterken
      // zemin soluyor ve tavşan **uygulamanın üstünde** uçarak yerine gidiyor.
      // Zemin burada dursaydı tavşan yol boyunca bomboş beyaz bir ekranda
      // süzülürdü. `pointer-events-none`, son yarım saniyede zemin çoktan
      // saydamken katmanın dokunuşları yutmasını engelliyor: altta uygulama
      // görünüyor ve basan kullanıcı "bastım, olmadı" diyordu.
      className={cn(
        'font-marka pointer-events-none fixed inset-0 z-[60] overflow-hidden',
        !basladi && 'acilis-bekliyor',
      )}
      role="status"
      aria-label="Rabi açılıyor"
    >
      {/* Zemin ve üstündeki iki yumuşak parıltı. Zemin düz beyaza yakın;
          parıltılar olmadan ekran boş bir kâğıt gibi duruyor. */}
      <div className="acilis-zemin" style={{ backgroundColor: ZEMIN }}>
        <span className="acilis-parilti acilis-parilti-sol" />
        <span className="acilis-parilti acilis-parilti-sag" />
      </div>

      {/*
        Parçalar akışta değil, ekranın ortasından ölçülen sabit boşluklarda
        duruyor: hepsi ayrı zamanlarda belirip sönüyor ve akışta olsalardı biri
        giderken ötekiler kayardı. Boşluklar tasarımın kendi sayıları.
      */}

      {/* Maskotun arkasındaki hale ve altındaki zemin gölgesi. */}
      <span className="acilis-hale" />
      <span className="acilis-golge" />

      <div
        className="acilis-inis absolute top-1/2 left-1/2"
        style={{
          marginTop: MASKOT_MERKEZI - MASKOT_KUTUSU / 2,
          marginLeft: -MASKOT_BOYU / 2,
          ...hedef,
        }}
      >
        {/*
          Uygulamanın kendi maskotu kullanılıyor, ayrı bir açılış çizimi değil:
          animasyon tavşanı varış noktasına süzülerek bitiriyor ve orada ana
          sayfanın (ya da kurulumun) maskotunun üstüne oturuyor. İki farklı
          çizim olsaydı geçişte tavşan değişiyormuş gibi görünürdü.
        */}
        <Rabi durum="mutlu" boyut={MASKOT_BOYU} />
      </div>

      {/*
        "RABİ" — 50px yazının satır yüksekliği 1.32 (66px): "İ" harfinin
        noktası kırpılmasın diye.
      */}
      <p className="acilis-yazi text-foreground absolute inset-x-0 top-1/2 mt-[64px] text-center text-[50px] leading-[1.32] font-extrabold tracking-[-0.05em]">
        RABİ
      </p>

      <p className="acilis-slogan text-muted-foreground absolute inset-x-0 top-1/2 mt-[115px] text-center text-[9.5px] leading-none font-semibold tracking-[0.3em] uppercase">
        Sınav yolu arkadaşın
      </p>

      {/* Yükleme bloğu: çark + tarayan şerit + durum metni. */}
      <div className="acilis-yukleme absolute inset-x-0 top-1/2 mt-[165px] flex flex-col items-center gap-3">
        <DonenCark />
        <span className="acilis-ray" aria-hidden />
        <span className="text-muted-foreground text-[9.5px] leading-none font-semibold tracking-[0.2em] uppercase">
          Hazırlanıyor
        </span>
      </div>

      {/* Uygulamanın tek vaadi. Açılışta söylenmesinin sebebi var: sunucusu
          olmayan bir uygulamada bu, kullanıcının ilk merak ettiği şey. */}
      <p className="acilis-alt text-muted-foreground absolute inset-x-0 bottom-[22px] text-center text-[10.5px] font-semibold tracking-[0.16em] uppercase">
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

/* ===========================================================================
   Kurulum sonrası geçiş
   =========================================================================== */

/** Geçişin süresi (ms). `globals.css`'teki `acilis-gecis` ile aynı olmalı. */
export const GECIS_SURESI = 900

/**
 * Kurulum bitince tavşanı yerine götüren katman.
 *
 * "Başlayalım"a basılınca kurulum ekranı kalkıp ana sayfa geliyor ve tavşan
 * bir anda sihirbazın tepesinden sayfa başlığının yanına ışınlanıyordu.
 * Açılıştaki hareketin aynısı: tavşan bulunduğu yerden başlığa uçuyor,
 * arkasında ana sayfa duruyor.
 *
 * Katman yalnız tavşanı çiziyor; ana sayfanın kendi maskotu bu sırada gizli
 * (`Rabi`nin `gizli` propu), yoksa varış noktasında iki tavşan olurdu.
 */
export function MaskotGecisi({ soluyor }: { soluyor: boolean }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden transition-opacity duration-300"
      style={{ opacity: soluyor ? 0 : 1 }}
      aria-hidden
    >
      {/* Başlangıç noktası kurulum sihirbazının maskotuyla birebir aynı:
          sayfanın üst boşluğu (2rem + güvenli alan), yatayda ortada, 110px. */}
      <div
        className="absolute inset-x-0 flex justify-center"
        style={{ top: 'calc(2rem + var(--guvenli-ust))' }}
      >
        <span className="acilis-gecis">
          <Rabi durum="mutlu" boyut={110} />
        </span>
      </div>
    </div>
  )
}
