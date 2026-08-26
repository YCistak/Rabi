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
 * yüzdelerle alıyor: %0–30 iniş, %30–68 duruş, %68–100 çıkış. Süreyi
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
 * Uçuşun zaman çizgisindeki yeri.
 *
 * Tavşan %68'e kadar yerinde duruyor, oradan sonra varış noktasına süzülüyor
 * (`acilis-inis`). Ölçüm bu ana kadar yenileniyor, bu andan sonra donuyor:
 * uçuş başladıktan sonra varış noktasını değiştirmek tavşanı yolun ortasında
 * ışınlardı.
 */
const UCUS_BASLANGICI = Math.round(ACILIS_SURESI * 0.68)

type Olcum = { dx: number; dy: number; olcek: number }

/** Ölçümün yinelenme aralığı (ms). */
const OLCUM_ARALIGI = 16

/** Bu kadar pikselden küçük oynamalar için yeniden çizmeye değmiyor. */
const ONEMSIZ_OYNAMA = 0.5

/**
 * Maskotun nereye süzüleceğini varış noktasındaki maskottan ölçer.
 *
 * Varış noktası koda yazılabilirdi — bir süre öyleydi (`VARIS` diye bir tablo
 * vardı) — ama o hesap başlığın kaç piksel yukarıda durduğunu, güvenli alanı ve
 * kabın genişliğini bilmek zorunda. Tablo tam da bu yüzden bozuldu: düzen
 * değişti, sayılar kaldı ve tavşan yuvanın **93 piksel altına** iniyordu.
 * Üstelik yalnızca bazen — tablo sadece ölçüm yetişmediğinde devreye giriyordu,
 * yani hata telefonun o açılışta ne kadar hızlı olduğuna bağlıydı.
 *
 * Bu yüzden iki kural var:
 *
 * 1. **Ölçüm uçuş başlayana kadar bırakılmıyor.** Eskiden 60 deneme (~1 sn)
 *    hakkı vardı ve hakkı bitince yedeğe düşülüyordu; yavaş açılan bir
 *    telefonda ana sayfa o saniyeye yetişmiyor. Artık tek sınır uçuşun kendisi:
 *    yuva ne zaman doğarsa ölçüm onu yakalıyor.
 * 2. **İlk başarılı ölçüm son söz değil.** Düzen açılıştan sonra bir kez daha
 *    oynayabiliyor — güvenli alan (`--guvenli-ust`) yerli köprüden gecikmeli
 *    geliyor, yazı tipi sonradan takas oluyor. Ölçüm uçuşa kadar yenilendiği
 *    için tavşan hangi düzen son hâlse ona iniyor.
 *
 * Ölçü ekranın kendi kutusundan alınıyor, `window.innerHeight`ten değil:
 * uçan tavşan `fixed inset-0` bir katmanın ortasına göre duruyor ve WebView
 * açılırken pencere ölçüsüyle o katmanın kutusu bir süre ayrı düşebiliyor.
 *
 * Yineleme `requestAnimationFrame` ile değil zamanlayıcıyla: sayfa görünür
 * değilken (uygulama arka planda açıldıysa) rAF hiç çağrılmıyor ve ölçüm
 * sonsuza kadar beklerdi. Hesap zaten çizime değil düzene bakıyor.
 */
function useVaris(katmanRef: React.RefObject<HTMLDivElement | null>, basladi: boolean): Olcum | null {
  const [olcum, setOlcum] = useState<Olcum | null>(null)

  useEffect(() => {
    let zamanlayici = 0
    let dondu = false

    const olc = () => {
      if (dondu) return

      const yuva = document.getElementById(MASKOT_YUVASI)
      const yuvaKutusu = yuva?.getBoundingClientRect()
      const katmanKutusu = katmanRef.current?.getBoundingClientRect()

      // Yuva henüz yok (veri okunuyor) ya da ölçüsü sıfır: birazdan yeniden bak.
      if (yuvaKutusu && katmanKutusu && yuvaKutusu.width > 0) {
        // İki kutu da kare görseli ortalayan `object-contain` kutusu; kutunun
        // merkezi görselin merkeziyle aynı yerde.
        const yeni: Olcum = {
          dx: yuvaKutusu.left + yuvaKutusu.width / 2 - (katmanKutusu.left + katmanKutusu.width / 2),
          dy:
            yuvaKutusu.top +
            yuvaKutusu.height / 2 -
            (katmanKutusu.top + katmanKutusu.height / 2 + MASKOT_MERKEZI),
          olcek: yuvaKutusu.width / MASKOT_BOYU,
        }
        // Ölçüm 16 ms'de bir yineleniyor; her seferinde yeni bir nesne vermek
        // ekranı boşuna baştan çizerdi.
        setOlcum((onceki) =>
          onceki &&
          Math.abs(onceki.dx - yeni.dx) < ONEMSIZ_OYNAMA &&
          Math.abs(onceki.dy - yeni.dy) < ONEMSIZ_OYNAMA &&
          Math.abs(onceki.olcek - yeni.olcek) < 0.001
            ? onceki
            : yeni,
        )
      }

      zamanlayici = window.setTimeout(olc, OLCUM_ARALIGI)
    }

    olc()

    // Donma sayacı animasyon **başlayınca** işliyor: ekran duraklatılmış
    // başlıyor (bkz. `useBaslangic`) ve uçuş o zaman çizgisinin %68'inde.
    // Bağlanmadan işletilseydi yavaş açılan bir telefonda ölçüm tavşan daha
    // yola çıkmadan donardı.
    const donma = basladi ? window.setTimeout(() => (dondu = true), UCUS_BASLANGICI) : 0

    return () => {
      dondu = true
      clearTimeout(zamanlayici)
      clearTimeout(donma)
    }
  }, [katmanRef, basladi])

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
export function Acilis({ onBitti }: { onBitti: () => void }) {
  const katmanRef = useRef<HTMLDivElement>(null)
  const basladi = useBaslangic()
  const olcum = useVaris(katmanRef, basladi)

  // Geri çağrı her çizimde yeniden üretilebiliyor; sayacın ona bakması
  // zamanlayıcıyı sıfırlardı.
  const bitisRef = useRef(onBitti)
  bitisRef.current = onBitti

  useEffect(() => {
    if (!basladi) return
    const zamanlayici = window.setTimeout(() => bitisRef.current(), ACILIS_SURESI)
    return () => clearTimeout(zamanlayici)
  }, [basladi])

  /*
    Ölçüm hiç tutmadıysa tavşan **uçmuyor**, olduğu yerde sönüyor.

    Eskiden koda yazılmış bir yedek tabloya uçuyordu ve bu ekranın tek gerçek
    hatasıydı: yuva yoksa zaten konacak bir maskot da yok, tahmin edilen bir
    köşeye süzülmek hareketi kurtarmıyor — yanlış yere inen bir tavşan
    gösteriyor. Kendi yerinde sönmek hiç olmazsa yanlış bir şey söylemiyor.
  */
  const hedef = (
    olcum
      ? {
          '--acilis-x': `${olcum.dx}px`,
          '--acilis-y': `${olcum.dy}px`,
          '--acilis-olcek': olcum.olcek,
        }
      : { '--acilis-x': '0px', '--acilis-y': '0px', '--acilis-olcek': 1 }
  ) as React.CSSProperties

  return (
    <div
      // Zemin bu katmanda değil altındaki `acilis-zemin`de: gösteri biterken
      // zemin soluyor ve tavşan **uygulamanın üstünde** uçarak yerine gidiyor.
      // Zemin burada dursaydı tavşan yol boyunca bomboş beyaz bir ekranda
      // süzülürdü.
      //
      // Katman dokunuşları **yutuyor** (`pointer-events-none` yok). Bir süre
      // saydamdı: son saniyede zemin çoktan solmuş oluyor ve altındaki
      // düğmeler görünüyordu, ama görünen her şey aynı zamanda basılabilir
      // oluyordu — kullanıcı daha uygulamayı görmeden sekme değiştiriyor,
      // açılış kalkınca kendini başka bir ekranda buluyordu. Görünürlük
      // dokunulabilirlik demek değil: gösteri bitene kadar ekran kilitli.
      // `touch-none`, aynı şeyi kaydırma/yakınlaştırma için yapıyor.
      className={cn(
        'font-marka fixed inset-0 z-[60] touch-none overflow-hidden select-none',
        !basladi && 'acilis-bekliyor',
      )}
      role="status"
      aria-label="Rabi açılıyor"
      ref={katmanRef}
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
        {/* Uçuş yoksa tavşan öteki süslemelerle birlikte sönüyor. Solma
            `acilis-inis`in üstünde değil ayrı bir kapta: ikisi de aynı öğede
            olsaydı opaklığı sonuncusu ele geçirir ve iniş görünmez olurdu. */}
        <span className={cn('block', !olcum && 'acilis-son')}>
          <Rabi durum="mutlu" boyut={MASKOT_BOYU} />
        </span>
      </div>

      {/*
        "RABİ" — 50px yazının satır yüksekliği 1.32 (66px): "İ" harfinin
        noktası kırpılmasın diye.
      */}
      <p className="acilis-yazi text-foreground absolute inset-x-0 top-1/2 mt-[48px] text-center text-[50px] leading-[1.32] font-extrabold tracking-[-0.05em]">
        RABİ
      </p>

      <p className="acilis-slogan text-muted-foreground absolute inset-x-0 top-1/2 mt-[128px] text-center text-[9.5px] leading-none font-semibold tracking-[0.3em] uppercase">
        Sınav yolu arkadaşın
      </p>

      {/* Yükleme bloğu: çark + tarayan şerit + durum metni. */}
      <div className="acilis-yukleme absolute inset-x-0 top-1/2 mt-[176px] flex flex-col items-center gap-3">
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
