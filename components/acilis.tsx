'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Açılış ekranı.
 *
 * Android'in kendi açılış ekranı (Android 12+) **tek bir simge** gösterebiliyor:
 * altına yazı koyulamıyor ve animasyonu ~1 saniyeyle sınırlı — hızlı açılan bir
 * uygulamada çoğu zaman hiç görünmüyor. İstenen ekran bu yüzden uygulamanın
 * içinde kuruldu.
 *
 * Tasarım "Ders makarası" (`tasarim/acilis-arsiv.html` → 3. tur, Yazı C · 2):
 * dört makara harf yerine derslerin simgelerini çeviriyor (√x, 1453, DNA,
 * H₂O, MÖ, Ω…), her simge kendi dersinin renginde, ve soldan sağa tık tık
 * R·A·B·I'ya kilitleniyor — bütün dersler tek kelimede toplanıyor. Sonra
 * harfler bir tık daha dönüp çıkıyor ve zemin dört şerit hâlinde yukarı
 * kalkarak ana sayfayı açıyor.
 *
 * Önceki tasarım 2d 4,65 saniye sürüyordu; günde birkaç kez açılan bir
 * uygulamada beklemeye dönüşüyordu. Bu tasarım 2,26 saniye. Tavşan hiçbir
 * yere uçmuyor (kullanıcının şartı): yalnızca son makarada, I'dan önceki bir
 * an, bir simge olarak görünüyor.
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
 * Son şerit 1840 ms'de kalkmaya başlıyor ve 420 ms sürüyor. Süreyi
 * değiştirirsen `globals.css`'teki açılış zaman çizgisini birlikte değiştir.
 *
 * Veri okumasına bağlanmadı: localStorage neredeyse anında dönüyor,
 * bağlansaydı ekran bir kare görünüp kaybolur ve animasyon hiç izlenmezdi.
 */
export const ACILIS_SURESI = 2260

/**
 * Makaraların simgeleri. Her makara: boş · dört simge · harf · boş; harf
 * beşinci hücrede, çıkış altıncıya (bkz. `acilis-makara-don`).
 *
 * Renk derse ait (`text-konu-<ders>-koyu`), konu haritası ve oyunlarla aynı.
 * Simgeler YKS'nin dersleri: matematik (√x, π, ∑, x², %), tarih (1453, MÖ),
 * biyoloji (DNA), kimya (H₂O, Fe), coğrafya (40°K, °), fizik (Ω), Türkçe
 * (Aa, !). Son makaranın son simgesi Rabi'nin yüzü.
 */
type Simge = { metin: ReactNode; renk: string; kucuk?: boolean } | 'tavsan'

const MAKARALAR: { harf: string; simgeler: Simge[] }[] = [
  {
    harf: 'R',
    simgeler: [
      { metin: '√x', renk: 'text-konu-matematik-koyu' },
      { metin: '1453', renk: 'text-konu-tarih-koyu', kucuk: true },
      { metin: 'DNA', renk: 'text-konu-biyoloji-koyu' },
      { metin: 'π', renk: 'text-konu-matematik-koyu' },
    ],
  },
  {
    harf: 'A',
    simgeler: [
      {
        metin: (
          <>
            H<sub>2</sub>O
          </>
        ),
        renk: 'text-konu-kimya-koyu',
      },
      { metin: '40°K', renk: 'text-konu-cografya-koyu' },
      { metin: 'MÖ', renk: 'text-konu-tarih-koyu' },
      { metin: '∑', renk: 'text-konu-matematik-koyu' },
    ],
  },
  {
    harf: 'B',
    simgeler: [
      { metin: 'Ω', renk: 'text-konu-fizik-koyu' },
      { metin: 'x²', renk: 'text-konu-matematik-koyu' },
      { metin: 'Fe', renk: 'text-konu-kimya-koyu' },
      { metin: 'Aa', renk: 'text-konu-turkce-koyu' },
    ],
  },
  {
    harf: 'I',
    simgeler: [
      { metin: '°', renk: 'text-konu-cografya-koyu' },
      { metin: '%', renk: 'text-konu-matematik-koyu' },
      { metin: '!', renk: 'text-konu-turkce-koyu' },
      'tavsan',
    ],
  },
]

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
 * animasyondan önce işlemeye başlar, yavaş açılan bir telefonda katman
 * makaralar dönerken kaldırılırdı.
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
   * Zamanlayıcıyla kalkan katman, şeritler daha kalkmadan "tak" diye
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
      // Katman dokunuşları **yutuyor** (`pointer-events-none` yok): şeritler
      // kalkarken altındaki düğmeler görünüyor, ama görünen her şey
      // basılabilir olsaydı kullanıcı daha uygulamayı görmeden sekme
      // değiştirirdi. `touch-none`, aynı şeyi kaydırma/yakınlaştırma için
      // yapıyor.
      className={cn(
        'fixed inset-0 z-[60] touch-none overflow-hidden select-none',
        !basladi && 'acilis-bekliyor',
      )}
      role="status"
      aria-label="Rabi açılıyor"
    >
      {/*
        Zemin dört dikey şerit; sırayla yukarı kalkıp ana sayfayı açıyorlar.
        Ekranın ömrünü bitiren olay **sonuncusunun** bitişi; en geç o
        kalkıyor. Ad denetimi emniyet için: olay başka bir animasyondan
        gelmemeli.
      */}
      {[0, 1, 2, 3].map((sira) => (
        <div
          key={sira}
          className="acilis-serit"
          style={{ left: `${sira * 25}%`, backgroundColor: ZEMIN }}
          onAnimationEnd={
            sira === 3
              ? (olay) => {
                  if (olay.animationName === 'acilis-serit-kalk') setSahneBitti(true)
                }
              : undefined
          }
        />
      ))}

      {/*
        Kelime: dört pencere, her birinin genişliğini içindeki görünmez son
        harf belirliyor (`acilis-olcu`). Eşit genişlikte pencereler dar I'yı
        geniş bir kutunun ortasında bırakıyor ve "RAB I" gibi okunuyordu.
        Simgeler harften geniş olabildiği için kırpma pencerede değil, iki
        yana taşan "kuyu"da. Ekran okuyucuya kapalı; katmanın kendi etiketi
        var.
      */}
      <div className="acilis-kelime font-acilis text-primary font-extrabold" aria-hidden>
        {MAKARALAR.map(({ harf, simgeler }) => (
          <div key={harf} className="acilis-pencere">
            <span className="acilis-olcu">{harf}</span>
            <div className="acilis-kuyu">
              <div className="acilis-makara">
                <div className="acilis-hucre" />
                {simgeler.map((simge, i) =>
                  simge === 'tavsan' ? (
                    <div key={i} className="acilis-hucre">
                      <img src="/tavsan-yuz.png" alt="" width={32} height={32} draggable={false} />
                    </div>
                  ) : (
                    <div
                      key={i}
                      className={cn(
                        'acilis-hucre acilis-simge font-sans',
                        simge.renk,
                        simge.kucuk && 'acilis-simge-kucuk',
                      )}
                    >
                      {simge.metin}
                    </div>
                  ),
                )}
                <div className="acilis-hucre">{harf}</div>
                <div className="acilis-hucre" />
              </div>
            </div>
          </div>
        ))}
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
 * Açılış ekranında da uçan tavşan yok (ders makarası); tavşan yerinde kalıyor.
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
