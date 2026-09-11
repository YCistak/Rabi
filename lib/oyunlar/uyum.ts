'use client'

/**
 * Zorluk turun içinde kendiliğinden ayarlanıyor.
 *
 * Eskiden tur başlamadan önce bir seviye seçiliyordu (`ZorlukSecimi`,
 * silindi) ve seçim tur boyunca sabit kalıyordu. İki sorunu vardı:
 *
 * - **Seçim bilgi istiyordu.** Oyuna ilk giren öğrenci kendi seviyesini
 *   bilmiyor; "Kolay/Orta/Zor" sorusu, cevabı ancak oynadıktan sonra
 *   öğrenilecek bir soruydu. Çoğu kullanıcı ilk gördüğünü seçip orada
 *   kalıyordu.
 * - **Seçim tur boyunca donuyordu.** Kolayda arka arkaya on doğru yapan
 *   oyuncuya oyun kolay soru vermeye devam ediyor, zorda üst üste elenen
 *   oyuncu ise turu kapatıyordu.
 *
 * Artık tur **orta**dan başlıyor ve seviye cevaplara göre kayıyor. Kullanıcıya
 * söylenmiyor: ekranda bir "seviye atladın" bildirimi, ölçülen şeyi (bilgi)
 * bir ödüle çevirir ve oyuncu seviyeyi kovalamaya başlar.
 *
 * Kural saf ve test edilebilir; React'e bakan tek şey en alttaki kanca.
 */

import { useCallback, useRef, useState } from 'react'
import type { Zorluk } from './ritim'
import { ZORLUKLAR } from './ritim'

/**
 * Turun başladığı seviye.
 *
 * Orta, çünkü uyum iki yöne de aynı hızda gidebilmeli: kolaydan başlayan bir
 * tur, iyi oyuncuyu zora çıkarmak için iki basamak tırmanmak zorunda kalır ve
 * kısa turlarda oraya hiç ulaşamaz.
 */
export const BASLANGIC_ZORLUGU: Zorluk = 'orta'

/** Kaç ardışık doğru bir üst seviyeye çıkarıyor. */
export const YUKSELME_SERISI = 3

/**
 * Kaç ardışık yanlış bir alt seviyeye indiriyor.
 *
 * Yükselmeden az: yanlış, zorlandığının doğrudan işareti ve oyuncuyu üst üste
 * üç soru boyunca yapamayacağı seviyede tutmak öğretmiyor, eliyor. Doğru ise
 * tek başına "bu seviye kolay geliyor" demiyor — şıklı soruda tahmin de
 * tutabiliyor.
 */
export const DUSME_SERISI = 2

/**
 * Uyumun hafızası: bulunulan seviye ve ardışık seri.
 *
 * `seri` işaretli tutuluyor — artı ardışık doğru, eksi ardışık yanlış. İki
 * ayrı sayaç tutmak, birini sıfırlamayı unutmakla eşdeğerdi.
 */
export type UyumDurumu = { zorluk: Zorluk; seri: number }

export function uyumBasla(): UyumDurumu {
  return { zorluk: BASLANGIC_ZORLUGU, seri: 0 }
}

/** Seviye listesinde `adim` kadar kayar; uçlarda yerinde kalır. */
function komsuZorluk(zorluk: Zorluk, adim: number): Zorluk {
  const sira = ZORLUKLAR.indexOf(zorluk) + adim
  if (sira < 0) return ZORLUKLAR[0]
  if (sira >= ZORLUKLAR.length) return ZORLUKLAR[ZORLUKLAR.length - 1]
  return ZORLUKLAR[sira]
}

/**
 * Bir cevabı işler ve yeni durumu döner.
 *
 * Seviye değişince seri **sıfırlanıyor**: yeni seviyedeki ilk soru, eskisinin
 * serisinin devamı değil. Sıfırlanmasaydı üç doğru yapan oyuncu bir üst
 * seviyede tek doğruyla bir üstüne daha çıkardı.
 *
 * Uçta (kolayın altı, zorun üstü) seri sıfırlanmıyor: gidecek yer yok ve
 * sıfırlamak, ilk yanlışta hemen düşmeyi geciktiren sahte bir tampon olurdu.
 */
export function uyumIsle(durum: UyumDurumu, dogruMu: boolean): UyumDurumu {
  const seri = dogruMu ? Math.max(0, durum.seri) + 1 : Math.min(0, durum.seri) - 1

  const yon = seri >= YUKSELME_SERISI ? 1 : -seri >= DUSME_SERISI ? -1 : 0
  if (yon === 0) return { zorluk: durum.zorluk, seri }

  const yeni = komsuZorluk(durum.zorluk, yon)
  return yeni === durum.zorluk ? { zorluk: durum.zorluk, seri } : { zorluk: yeni, seri: 0 }
}

/**
 * Oyun ekranlarının kullandığı kanca.
 *
 * `zorluk` çizim sırasında okunuyor (sıradaki soru o şeritten geliyor),
 * `kaydet` her cevaptan sonra, `sifirla` tur başında çağrılıyor. Durum oyun
 * başına ayrı **saklanmıyor**: uyum turun kendi ölçüsü ve iki tur arasında
 * taşınan bir seviye, yeni turu oyuncunun o anki hâline değil bir öncekine
 * göre kurardı.
 *
 * `zorlukRef` eşleştirme oyunları için: orada sıradaki el bir zamanlayıcının
 * içinde kuruluyor ve zamanlayıcı kurulurken yakalanan `zorluk`, cevabın
 * seviyeyi kaydırmasından **önceki** değer olurdu. Ref çizim sırasında
 * tazeleniyor — dosyaların geri kalanındaki `cevaplarRef` kalıbının aynısı.
 */
export function useUyarlananZorluk() {
  const [durum, setDurum] = useState<UyumDurumu>(uyumBasla)
  const zorlukRef = useRef(durum.zorluk)
  zorlukRef.current = durum.zorluk

  const kaydet = useCallback((dogruMu: boolean) => {
    setDurum((onceki) => uyumIsle(onceki, dogruMu))
  }, [])

  const sifirla = useCallback(() => {
    setDurum(uyumBasla())
  }, [])

  return { zorluk: durum.zorluk, zorlukRef, kaydet, sifirla }
}
