'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { MASKOT_YUVASI, Rabi } from '@/components/maskot/rabi'

/**
 * Açılış ekranı.
 *
 * Android'in kendi açılış ekranı (Android 12+) **tek bir simge** gösterebiliyor:
 * altına yazı, yanına çark koyulamıyor ve animasyonu ~1 saniyeyle sınırlı — hızlı
 * açılan bir uygulamada çoğu zaman hiç görünmüyor. İstenen ekran (tavşan +
 * "RABİ" yazısı + yükleme noktaları) bu yüzden uygulamanın içinde kuruldu.
 *
 * Tasarım 2a (`tasarim/acilis-ekrani.dc.html`): sadeleştirilmiş hâl. Önceki
 * ekranda tavşan yukarıdan düşüyor, altında dönen bir çark, tarayan bir şerit,
 * "HAZIRLANIYOR" ve "çevrimdışı çalışır" yazıları duruyordu; 2a hepsini tek
 * sakin bir girişe indirdi — tavşan, yazı ve slogan sırayla aşağıdan
 * yükseliyor, altta üç nokta nabız atıyor, arkada birkaç küçük artı süzülüyor.
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
 * Çıkış tek bir 4,2 saniyelik zaman çizgisinin yüzdelerinde: %64–90 tavşan
 * yerine uçuyor, %82–100 sahne soluyor. Süreyi değiştirirsen `globals.css`'teki
 * `acilis-inis` ile `acilis-sahne` sürelerini birlikte değiştir; ikisi
 * ayrılırsa tavşan sahne sönmeden yola çıkmaz ya da sahne tavşandan önce biter.
 *
 * Veri okumasına bağlanmadı: localStorage neredeyse anında dönüyor,
 * bağlansaydı ekran bir kare görünüp kaybolur ve animasyon hiç izlenmezdi.
 */
export const ACILIS_SURESI = 4200

/**
 * Açılışın yerleşimi — tasarımın sayıları.
 *
 * Tasarım tavşanı, "RABİ"yi ve sloganı alt alta tek bir sütunda çiziyor ve
 * sütunu ekranın altından 115 piksel yukarıda ortalıyor. Burada parçalar
 * sütunda değil ekranın ortasından ölçülen sabit boşluklarda duruyor: tavşan
 * uçarken öteki parçalar yerinde kalmalı ve akışta olsalardı tavşanın dönüşümü
 * olmasa da girişleri birbirini itebilirdi. Sayılar sütunun kendisinden
 * türetiliyor, elle yazılmıyor: biri değişirse ötekiler kendiliğinden kayıyor.
 *
 * `Rabi`nin kutusu 130/120 oranında — eski SVG'nin kutusu bu ölçüdeydi ve on
 * beş ekranın yerleşimi ona göre kuruldu. Kare görsel `object-contain` ile o
 * kutunun **ortasına** oturuyor, yani kutu görselden 10 piksel uzun. Üst
 * boşluk bu yüzden kutunun değil görselin merkezinden ölçülüyor.
 */
const MASKOT_BOYU = 118
const MASKOT_KUTUSU = (MASKOT_BOYU * 130) / 120
const YAZI_BOYU = 52
/** "İ"nin noktası kırpılmasın diye satır yüksekliği 1.32. */
const YAZI_SATIRI = YAZI_BOYU * 1.32
const SLOGAN_BOYU = 11
/** Sütunun ekranın altından kaldırıldığı pay (tasarımda `padding-bottom`). */
const ALT_PAY = 115
const SUTUN_BOYU = MASKOT_BOYU + 14 + YAZI_SATIRI + 6 + SLOGAN_BOYU
/** Sütunun üstü, ekranın ortasına göre. */
const SUTUN_USTU = -(ALT_PAY + SUTUN_BOYU) / 2
/** Görselin merkezi, ekranın ortasına göre — varış ölçümü buna göre. */
const MASKOT_MERKEZI = SUTUN_USTU + MASKOT_BOYU / 2
const YAZI_USTU = SUTUN_USTU + MASKOT_BOYU + 14
const SLOGAN_USTU = YAZI_USTU + YAZI_SATIRI + 6

/**
 * Süzülen artılar — tasarımın on iki tanesi, sırası ve yönüyle.
 *
 * Altısı ekranın ortasından dışa, altısı üst ve alt kenardan içe süzülüyor.
 * Kenardakilerin yatay yeri tasarımda 360 piksellik çerçevede piksel;
 * burada yüzde, yoksa geniş telefonda hepsi sol yarıda toplanırdı. Yönler
 * (`dx/dy`) piksel kalıyor: yol uzunluğu ekranla ölçeklenmese de olur,
 * bir süs.
 */
type Arti = {
  /** `orta` ekranın ortası; ötekiler kenarda, yatay yeri yüzde. */
  yer: 'orta' | { kenar: 'ust' | 'alt'; sol: string }
  boy: number
  dx: number
  dy: number
  /** ms */
  gecikme: number
}

const ARTILAR: Arti[] = [
  { yer: 'orta', boy: 7, dx: 220, dy: -185, gecikme: 1690 },
  { yer: 'orta', boy: 6, dx: -220, dy: -80, gecikme: 2140 },
  { yer: 'orta', boy: 7, dx: 157, dy: 430, gecikme: 2620 },
  { yer: 'orta', boy: 6, dx: -220, dy: -127, gecikme: 3050 },
  { yer: 'orta', boy: 7, dx: 220, dy: 80, gecikme: 3480 },
  { yer: 'orta', boy: 6, dx: -157, dy: -430, gecikme: 3900 },
  { yer: { kenar: 'ust', sol: '19.4%' }, boy: 7, dx: 40, dy: 160, gecikme: 1900 },
  { yer: { kenar: 'alt', sol: '83.3%' }, boy: 6, dx: -60, dy: -170, gecikme: 2350 },
  { yer: { kenar: 'ust', sol: '33.3%' }, boy: 7, dx: 40, dy: 170, gecikme: 2800 },
  { yer: { kenar: 'alt', sol: '69.4%' }, boy: 6, dx: -50, dy: -180, gecikme: 1450 },
  { yer: { kenar: 'alt', sol: '11.1%' }, boy: 7, dx: 50, dy: -150, gecikme: 3250 },
  { yer: { kenar: 'ust', sol: '88.9%' }, boy: 6, dx: -40, dy: 180, gecikme: 2050 },
]

/**
 * Uçuşun zaman çizgisindeki yeri.
 *
 * Tavşan %64'e kadar yerinde duruyor, oradan sonra varış noktasına süzülüyor
 * (`acilis-inis`). Ölçüm bu ana kadar yenileniyor, bu andan sonra donuyor:
 * uçuş başladıktan sonra varış noktasını değiştirmek tavşanı yolun ortasında
 * ışınlardı.
 */
const UCUS_BASLANGICI = Math.round(ACILIS_SURESI * 0.64)

/**
 * Emniyet zamanlayıcısının animasyona verdiği pay (ms).
 *
 * Ekranı normalde `animationend` kaldırıyor; zamanlayıcı yalnızca olay hiç
 * gelmezse devreye giriyor. Pay olmasaydı ikisi aynı anda dolar ve zamanlayıcı
 * yine yarışı kazanabilirdi — düzeltmenin kendisi etkisiz kalırdı.
 */
const EMNIYET_PAYI = 700

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
    // başlıyor (bkz. `useBaslangic`) ve uçuş o zaman çizgisinin %64'ünde.
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

  /**
   * Katmanı kaldıran şey **animasyonun kendisi**, zamanlayıcı değil.
   *
   * Ekranın ömrü bir `setTimeout(ACILIS_SURESI)` idi ve iki saat aynı anda
   * işliyor sanılıyordu: biri JavaScript'in zamanlayıcısı, öteki tavşanın CSS
   * animasyonu. Telefonda ikisi ayrışıyor — animasyon `acilis-bekliyor`
   * kalkınca değil, ondan sonraki ilk **stil hesabında** salınıyor; WebView
   * açılırken o kare gecikebiliyor, kare düşünce animasyon geride kalıyor ve
   * uygulama bir an arka plana düşerse CSS animasyonu duruyor ama zamanlayıcı
   * işlemeye devam ediyor.
   *
   * Sonuç her seferinde aynı: süre dolduğunda tavşan hâlâ yolda oluyor,
   * katman kalkıyor ve tavşan yuvasına **ışınlanıyor**. Dışarıdan bakınca
   * geçiş yumuşamıyor, "tak" diye oluyor.
   *
   * `animationend` bunu tanım gereği çözüyor: tavşan yerine oturmadan olay
   * gelmiyor. Zamanlayıcı duruyor ama artık emniyet kemeri — animasyon hiç
   * çalışmazsa (olay düşerse, `animation: none` veren bir tercih çıkarsa)
   * uygulama açılış katmanının altında kilitlenmesin diye, bir pay ekleyerek.
   */
  const [inisBitti, setInisBitti] = useState(false)

  useEffect(() => {
    if (!basladi) return
    const zamanlayici = window.setTimeout(() => bitisRef.current(), ACILIS_SURESI + EMNIYET_PAYI)
    return () => clearTimeout(zamanlayici)
  }, [basladi])

  useEffect(() => {
    if (inisBitti) bitisRef.current()
  }, [inisBitti])

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
      // Zemin bu katmanda değil altındaki `acilis-sahne`de: gösteri biterken
      // sahne soluyor ve tavşan **uygulamanın üstünde** uçarak yerine gidiyor.
      //
      // Katman dokunuşları **yutuyor** (`pointer-events-none` yok). Bir süre
      // saydamdı: son saniyede sahne çoktan solmuş oluyor ve altındaki
      // düğmeler görünüyordu, ama görünen her şey aynı zamanda basılabilir
      // oluyordu — kullanıcı daha uygulamayı görmeden sekme değiştiriyor,
      // açılış kalkınca kendini başka bir ekranda buluyordu. Görünürlük
      // dokunulabilirlik demek değil: gösteri bitene kadar ekran kilitli.
      // `touch-none`, aynı şeyi kaydırma/yakınlaştırma için yapıyor.
      className={cn(
        'fixed inset-0 z-[60] touch-none overflow-hidden select-none',
        !basladi && 'acilis-bekliyor',
      )}
      role="status"
      aria-label="Rabi açılıyor"
      ref={katmanRef}
    >
      {/* Tavşanın dışındaki her şey: zemin, yazılar, noktalar, artılar. */}
      <div className="acilis-sahne" style={{ backgroundColor: ZEMIN }}>
        <p
          className="acilis-belir font-acilis text-foreground absolute inset-x-0 top-1/2 text-center font-extrabold"
          style={{
            marginTop: YAZI_USTU,
            fontSize: YAZI_BOYU,
            lineHeight: 1.32,
            // Harf aralığı sağa da pay bırakıyor; sol dolgu olmadan kelime
            // yarım aralık sola kayık dururdu.
            letterSpacing: '0.02em',
            paddingLeft: '0.02em',
            animationDelay: '280ms',
          }}
        >
          RABİ
        </p>

        <p
          className="acilis-belir text-muted-foreground absolute inset-x-0 top-1/2 text-center leading-none font-bold tracking-[0.28em] uppercase"
          style={{ marginTop: SLOGAN_USTU, fontSize: SLOGAN_BOYU, animationDelay: '420ms' }}
        >
          Sınav yolu arkadaşın
        </p>

        {/* Yükleme: çark ve şerit yerine üç nokta. Bir yükleme ölçmüyor —
            ekran zaten sabit sürede kalkıyor — yalnızca ekranın donmadığını
            söylüyor, bunun için üç nokta yetiyor. */}
        <div
          className="acilis-belir absolute inset-x-0 flex justify-center gap-2"
          style={{ bottom: 'calc(72px + var(--guvenli-alt))', animationDelay: '560ms' }}
          aria-hidden
        >
          {[0, 160, 320].map((gecikme) => (
            <span key={gecikme} className="acilis-nokta" style={{ animationDelay: `${gecikme}ms` }} />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {ARTILAR.map((arti, i) => (
            <span
              key={i}
              className="acilis-arti"
              style={
                {
                  width: arti.boy,
                  height: arti.boy,
                  marginLeft: -arti.boy / 2,
                  marginTop: -arti.boy / 2,
                  left: arti.yer === 'orta' ? '50%' : arti.yer.sol,
                  top:
                    arti.yer === 'orta'
                      ? '50%'
                      : arti.yer.kenar === 'ust'
                        ? -6
                        : 'calc(100% + 6px)',
                  '--dx': `${arti.dx}px`,
                  '--dy': `${arti.dy}px`,
                  animationDelay: `${arti.gecikme}ms`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <div
        className="acilis-inis absolute top-1/2 left-1/2"
        style={{
          marginTop: MASKOT_MERKEZI - MASKOT_KUTUSU / 2,
          marginLeft: -MASKOT_BOYU / 2,
          ...hedef,
        }}
        /*
          Ekranın ömrünü bitiren olay bu. Ad denetimi şart: bu düğümün altında
          tavşanın kendi giriş animasyonu da bitiyor ve `animationend`
          kabarcıklanıyor — denetimsiz bırakılsaydı katman, giriş biter bitmez
          kalkardı.
        */
        onAnimationEnd={(olay) => {
          if (olay.animationName === 'acilis-inis') setInisBitti(true)
        }}
      >
        {/*
          Uygulamanın kendi maskotu kullanılıyor, ayrı bir açılış çizimi değil:
          animasyon tavşanı varış noktasına süzülerek bitiriyor ve orada ana
          sayfanın (ya da kurulumun) maskotunun üstüne oturuyor. İki farklı
          çizim olsaydı geçişte tavşan değişiyormuş gibi görünürdü.

          Giriş (`acilis-belir`) ile uçuş (`acilis-inis`) ayrı kaplarda: ikisi
          de `transform` oynatıyor ve aynı öğede olsalardı sonuncusu
          öncekini ezerdi. Uçuş yoksa tavşan sahneyle birlikte sönüyor; o da
          üçüncü bir kapta, aynı gerekçeyle.
        */}
        <span className={cn('block', !olcum && 'acilis-son')}>
          <span className="acilis-belir block" style={{ animationDelay: '100ms' }}>
            <Rabi durum="mutlu" poz="kafa" boyut={MASKOT_BOYU} />
          </span>
        </span>
      </div>
    </div>
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
          <Rabi durum="mutlu" poz="kafa" boyut={110} />
        </span>
      </div>
    </div>
  )
}
