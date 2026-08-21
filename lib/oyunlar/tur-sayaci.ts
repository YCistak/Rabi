'use client'

/**
 * Turun sayacı — saatin kime ait olduğunu mod belirliyor.
 *
 * Üç ayrı davranış tek hook'ta çünkü hook sayısı koşula bağlanamıyor ve on
 * sekiz oyun ekranının hepsi bunu tek satırla çağırıyor:
 *
 * - **Tur saati** (Sıradan, Turbo): sayaç bir kez tur başında kuruluyor,
 *   sorular arasında sıfırlanmıyor. Yanlış cevap sayacı geri alıyor —
 *   `yanlisSayisi` arttıkça ceza düşülüyor.
 * - **Soru saati** (Ani Ölüm): sayaç her soruda sıfırlanıyor, süre dolunca
 *   soru yanlış sayılıyor.
 * - **Saatsiz** (Rahat): sayaç hiç çalışmıyor, `toplam` sıfır dönüyor. Arayüz
 *   halkayı ve çubuğu bu sıfıra bakarak gizliyor.
 *
 * Hedef zaman damgasıyla çalışıyor, saniye saymıyor: WebView arka plana
 * atıldığında `setInterval` kısılıyor ve sayarak ilerleyen bir sayaç orada
 * donup kalırdı.
 */

import { useEffect, useRef, useState } from 'react'
import { MODLAR, type OyunModu } from './mod'
import { kalanSaniye } from './tur'

export type TurSayaci = {
  /** Kalan saniye. Saatsiz modda hep 0. */
  kalan: number
  /**
   * Sayacın toplamı — halkanın ve çubuğun doluluğu buna göre.
   *
   * **Sıfır ise sayaç yok**: Rahat modda gösterilecek bir süre olmadığı için
   * arayüz halkayı hiç çizmiyor. Ayrı bir bayrak yerine bu, çünkü "toplamı
   * sıfır olan sayaç" zaten çizilemez.
   */
  toplam: number
}

export function useTurSayaci({
  mod,
  aktif,
  sure,
  anahtar,
  turNo,
  yanlisSayisi,
  onBitti,
  onTurBitti,
}: {
  mod: OyunModu
  /** Sayaç işliyor mu: cevap verildikten sonra ya da yardım açıkken duruyor. */
  aktif: boolean
  /** Bu sorunun süresi, saniye. Yalnızca soru saatli modda kullanılıyor. */
  sure: number
  /** Soru kimliği — soru saatinde sayacı sıfırlıyor. Genelde sıra numarası. */
  anahtar: number
  /** Tur numarası — tur saatinde sayacı sıfırlayan tek şey. */
  turNo: number
  /** Turda o ana kadar verilen yanlış sayısı; tur saatinden ceza düşüyor. */
  yanlisSayisi: number
  /** Soru süresi doldu — soru yanlış sayılır (Ani Ölüm). */
  onBitti: () => void
  /** Tur süresi doldu — tur biter (Sıradan, Turbo). */
  onTurBitti: () => void
}): TurSayaci {
  const tanim = MODLAR[mod]
  /** Saat tura mı ait: öyleyse sorudan soruya sıfırlanmıyor. */
  const turSaati = tanim.turSuresi !== null
  const toplam = tanim.turSuresi ?? (tanim.soruSayaci ? sure : 0)
  /** Sayacı sıfırlayan şey: tur saatinde tur, soru saatinde soru. */
  const sifirlama = turSaati ? turNo : anahtar

  const [kalan, setKalan] = useState(toplam)
  const bitisRef = useRef(0)
  /**
   * Kalan süre ref olarak da tutuluyor.
   *
   * State'in kendisi okunamaz: yeni soruya geçerken `setKalan` henüz
   * uygulanmamış oluyor ve sayacı kuran efekt bir önceki sorunun kalanını
   * görürdü. Ref eşzamanlı yazıldığı için doğru değeri veriyor.
   */
  const kalanRef = useRef(toplam)
  // Süre dolduğunda tam bir kez haber verilmeli: geri çağrılar cevap listesine
  // yazıyor, iki kez çağrılsa soru iki kez yanlış sayılırdı.
  const haberVerildi = useRef(false)
  /** Cezası işlenmiş yanlış sayısı — aynı yanlış iki kez düşülmesin diye. */
  const cezaliRef = useRef(0)
  const bittiRef = useRef(onBitti)
  bittiRef.current = onBitti
  const turBittiRef = useRef(onTurBitti)
  turBittiRef.current = onTurBitti

  // Yeni tur ya da yeni soru: hedef zaman baştan kuruluyor.
  useEffect(() => {
    kalanRef.current = toplam
    bitisRef.current = Date.now() + toplam * 1000
    haberVerildi.current = false
    cezaliRef.current = 0
    setKalan(toplam)
  }, [sifirlama, toplam])

  /*
    Yanlışın bedeli.

    Tur saatli modlarda yanlış cevap turu bitirmiyor, süreden götürüyor.
    Cezasız bir turda bilmediğin soruyu rastgele işaretlemek bedava olurdu ve
    "kaç doğru yaptın" sorusu hızlı dokunmayı ölçerdi.
  */
  useEffect(() => {
    if (!turSaati || tanim.yanlisCezasi <= 0) return
    if (yanlisSayisi <= cezaliRef.current) return
    const dusen = (yanlisSayisi - cezaliRef.current) * tanim.yanlisCezasi
    cezaliRef.current = yanlisSayisi
    kalanRef.current = Math.max(0, kalanRef.current - dusen)
    bitisRef.current -= dusen * 1000
    setKalan(kalanRef.current)
  }, [yanlisSayisi, turSaati, tanim.yanlisCezasi])

  useEffect(() => {
    if (!aktif || toplam <= 0) return

    /*
      Süresi dolmuş bir sayaç yeniden işlemeye başlıyorsa yeni bir tur açılmıştır.

      Soru saatli modda `sifirlama` soru sırası; tur **ilk soruda** bitip hemen
      yeniden başlatıldığında sıra yine 0 oluyor, anahtar değişmiyor ve
      yukarıdaki efekt hiç çalışmıyordu. Sonuç: sayaç sıfırda donuyor ve soru
      sonsuza kadar açık kalıyordu. İlk yanlışın turu bitirdiği modda bu, "bir
      tur daha"nın en sık hâli.
    */
    if (haberVerildi.current) {
      kalanRef.current = toplam
      haberVerildi.current = false
      cezaliRef.current = yanlisSayisi
      setKalan(toplam)
    }

    // Duraklamadan dönüş: hedef zaman, donmuş kalan süreye göre yeniden kuruluyor.
    // Yardım açıkken ve cevap geri bildirimi dururken geçen saniyeler böylece
    // oyuncudan götürülmüyor — tur saati de düşünme süresini ölçüyor, bekleme
    // süresini değil.
    bitisRef.current = Date.now() + kalanRef.current * 1000

    const oku = () => {
      const yeni = kalanSaniye(bitisRef.current)
      kalanRef.current = yeni
      setKalan(yeni)
      if (yeni <= 0 && !haberVerildi.current) {
        haberVerildi.current = true
        if (turSaati) turBittiRef.current()
        else bittiRef.current()
      }
    }
    oku()
    const isaret = setInterval(oku, 250)
    return () => clearInterval(isaret)
    // `yanlisSayisi` bilerek dışarıda: her yanlışta sayacı yeniden kurmak,
    // cezayı ikinci kez uygulamak olurdu. Ceza yukarıdaki efektin işi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktif, sifirlama, toplam, turSaati])

  return { kalan, toplam }
}
