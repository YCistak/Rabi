'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Açılış ekranı.
 *
 * Android'in kendi açılış ekranı (Android 12+) **tek bir simge** gösterebiliyor:
 * altına yazı koyulamıyor ve animasyonu ~1 saniyeyle sınırlı — hızlı açılan bir
 * uygulamada çoğu zaman hiç görünmüyor. İstenen ekran bu yüzden uygulamanın
 * içinde kuruldu.
 *
 * Tasarım 2d (`tasarim/acilis-ekrani.dc.html`, "Toplanan yıldızlar"): ekranda
 * yalnızca isim var. "RABI" bulanıktan netleşiyor, İ'nin noktası yukarıdan
 * dönerek düşüp harfi tamamlıyor, altta üç nokta nabız atıyor; sonunda isim
 * büyüyüp bulanıklaşarak dağılıyor ve zemin ana sayfaya açılıyor.
 *
 * Önceki tasarım (2a) tavşanı, sloganı ve süzülen artıları taşıyordu ve tavşan
 * ana sayfadaki maskotun üstüne uçarak bitiyordu. 2d tavşansız: uçuş, varış
 * noktasının ölçümü ve maskotun açılış boyunca gizlenmesi onunla birlikte
 * kalktı. Ekranda tavşan olmayınca konacak bir yuva da yok.
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
 * İsim 4000 ms'de dağılmaya başlıyor ve 650 ms'de bitiyor; zemin o sırada,
 * dağılmanın ikinci yarısında söndüğü için isim ana sayfanın üstünde
 * kayboluyor. Süreyi değiştirirsen `globals.css`'teki `acilis-sahne` ile
 * `acilis-yazi` gecikmelerini birlikte değiştir.
 *
 * Veri okumasına bağlanmadı: localStorage neredeyse anında dönüyor,
 * bağlansaydı ekran bir kare görünüp kaybolur ve animasyon hiç izlenmezdi.
 */
export const ACILIS_SURESI = 4650

/**
 * Yerleşim — tasarımın 360×760'lık çerçevesinden.
 *
 * Tasarım ismi çerçevenin tepesinden 331 piksele koyuyor; satırın ortası
 * (331 + 52,8 / 2) çerçevenin ortasının 22,6 piksel üstünde kalıyor. Burada
 * tepeden değil ortadan ölçülüyor: uzun telefonda tepeden ölçülen isim
 * ekranın üst yarısına kayardı.
 */
const YAZI_BOYU = 40
/** "İ"nin noktası satırın tepesine konuyor; satır dar olsaydı kırpılırdı. */
const YAZI_SATIRI = YAZI_BOYU * 1.32
const YAZI_KAYMASI = 331 + YAZI_SATIRI / 2 - 760 / 2

/**
 * Emniyet zamanlayıcısının animasyona verdiği pay (ms).
 *
 * Ekranı normalde `animationend` kaldırıyor; zamanlayıcı yalnızca olay hiç
 * gelmezse devreye giriyor. Pay olmasaydı ikisi aynı anda dolar ve zamanlayıcı
 * yine yarışı kazanabilirdi — düzeltmenin kendisi etkisiz kalırdı.
 */
const EMNIYET_PAYI = 700

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
 * animasyondan önce işlemeye başlar, yavaş açılan bir telefonda katman isim
 * dağılmadan kaldırılırdı.
 */
export function Acilis({ onBitti }: { onBitti: () => void }) {
  const basladi = useBaslangic()

  // Geri çağrı her çizimde yeniden üretilebiliyor; sayacın ona bakması
  // zamanlayıcıyı sıfırlardı.
  const bitisRef = useRef(onBitti)
  bitisRef.current = onBitti

  /**
   * Katmanı kaldıran şey **animasyonun kendisi**, zamanlayıcı değil.
   *
   * Telefonda JavaScript'in zamanlayıcısı ile CSS animasyonu ayrışıyor:
   * animasyon `acilis-bekliyor` kalkınca değil ondan sonraki ilk stil
   * hesabında salınıyor, WebView açılırken o kare gecikebiliyor ve uygulama
   * bir an arka plana düşerse animasyon duruyor ama zamanlayıcı işliyor.
   * Zamanlayıcıyla kalkan katman, zemin daha sönmeden "tak" diye
   * kayboluyordu. `animationend` bunu tanım gereği çözüyor; zamanlayıcı
   * yalnızca emniyet kemeri.
   */
  const [sahneBitti, setSahneBitti] = useState(false)

  useEffect(() => {
    if (!basladi) return
    const zamanlayici = window.setTimeout(() => bitisRef.current(), ACILIS_SURESI + EMNIYET_PAYI)
    return () => clearTimeout(zamanlayici)
  }, [basladi])

  useEffect(() => {
    if (sahneBitti) bitisRef.current()
  }, [sahneBitti])

  return (
    <div
      // Katman dokunuşları **yutuyor** (`pointer-events-none` yok): son
      // yarım saniyede zemin sönüyor ve altındaki düğmeler görünüyor, ama
      // görünen her şey basılabilir olsaydı kullanıcı daha uygulamayı
      // görmeden sekme değiştirirdi. `touch-none`, aynı şeyi
      // kaydırma/yakınlaştırma için yapıyor.
      className={cn(
        'fixed inset-0 z-[60] touch-none overflow-hidden select-none',
        !basladi && 'acilis-bekliyor',
      )}
      role="status"
      aria-label="Rabi açılıyor"
    >
      <div
        className="acilis-sahne"
        style={{ backgroundColor: ZEMIN }}
        /*
          Ekranın ömrünü bitiren olay bu. Ad denetimi şart: içerideki
          yazının, noktaların ve İ noktasının animasyonları da bitiyor ve
          `animationend` kabarcıklanıyor.
        */
        onAnimationEnd={(olay) => {
          if (olay.animationName === 'acilis-sahne') setSahneBitti(true)
        }}
      >
        {/*
          "RABI" + ayrı çizilen nokta: İ'nin noktası harfin kendisi değil,
          düşüp harfi tamamlayan kare. Yazı tipi tasarımın Rubik'i
          (`font-acilis`). Ekran okuyucuya kapalı; katmanın kendi etiketi
          var ve "R A B I" diye harf harf okunmasının anlamı yok.
        */}
        <p
          className="acilis-yazi font-acilis text-foreground absolute inset-x-0 top-1/2 text-center font-extrabold"
          style={{
            marginTop: YAZI_KAYMASI - YAZI_SATIRI / 2,
            fontSize: YAZI_BOYU,
            lineHeight: 1.32,
            // Harf aralığı sağa da pay bırakıyor; sol dolgu olmadan kelime
            // yarım aralık sola kayık dururdu.
            letterSpacing: '0.02em',
            paddingLeft: '0.02em',
          }}
          aria-hidden
        >
          <span>RAB</span>
          <span className="relative inline-block">
            I
            <span className="acilis-i-noktasi" />
          </span>
        </p>

        {/* Yükleme: üç nokta. Bir yükleme ölçmüyor — ekran zaten sabit
            sürede kalkıyor — yalnızca ekranın donmadığını söylüyor. İsimden
            önce sönüyorlar (`acilis-noktalar`): dağılan isim ekranın son
            hareketi olsun. */}
        <div
          className="acilis-noktalar absolute inset-x-0 flex justify-center gap-2"
          style={{ bottom: 'calc(72px + var(--guvenli-alt))' }}
          aria-hidden
        >
          {[0, 160, 320].map((gecikme) => (
            <span key={gecikme} className="acilis-nokta" style={{ animationDelay: `${gecikme}ms` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ===========================================================================
   Kurulum sonrası geçiş
   =========================================================================== */

/**
 * Kurulum bitince örtünün ekranda kalıp sönmeye başlamadan önceki süresi
 * (ms). Ana sayfa bu sürede örtünün altında kuruluyor; örtü hemen sönseydi
 * sayfanın ilk, yarım çizilmiş karesi görünürdü.
 */
export const GECIS_SURESI = 80

/** Örtünün sönme süresi (ms); `KurulumGecisi`ndeki geçişle aynı. */
export const GECIS_SOLMA_SURESI = 420

/**
 * Kurulumdan ana sayfaya geçiş: zemin renginde bir örtü sönüyor.
 *
 * Bir süre burada tavşan uçuyordu: "Hazırlanıyor" ekranından sonra kurulumun
 * üst ortasında belirip ana sayfa başlığına süzülüyordu. Telefonda "tavşan bir
 * anda ortaya ışınlanıp sol üste kayıyor" diye okundu — hazırlanıyor
 * ekranında tavşan ortada değil, belirdiği yer ondan kopuktu — ve kullanıcı
 * uçuş yerine solma istedi (iOS ve Android). Örtü ekranın zemin rengi
 * (`ZEMIN`), yani geçiş bir renk sıçraması değil, kurulumun yumuşakça ana
 * sayfaya dönüşmesi. Ana sayfanın maskotu bu sırada gizli değil: örtü
 * sönerken yerinde beliriyor.
 *
 * Açılış ekranında da artık uçan tavşan yok (tasarım 2d); iki geçiş de solma.
 */
export function KurulumGecisi({ soluyor }: { soluyor: boolean }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{
        backgroundColor: ZEMIN,
        opacity: soluyor ? 0 : 1,
        transition: `opacity ${GECIS_SOLMA_SURESI}ms ease-out`,
      }}
      aria-hidden
    />
  )
}
