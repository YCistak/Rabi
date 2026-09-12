'use client'

/**
 * Öneri/hata bildirimi kuyruğunun sahibi — `hata-kuyrugu.ts`'nin küçük
 * kardeşi.
 *
 * İki fark var. Birincisi, ayrı bir izin kartı yok: kullanıcı ne
 * gönderileceğini okuyup "Gönder"e basıyor, düğme iznin kendisi.
 * İkincisi, gönderim düğmeye basıldığı anda **bir kez hemen** deneniyor —
 * yazan kişi mesajının gidip gitmediğini görmek istiyor; hatalı soruda
 * kullanıcı bayrağa basıp turuna dönüyor, orada beklemek yok.
 *
 * Hemen gitmezse (internet yok, form adresi henüz girilmemiş) kayıt cihazda
 * kalıyor ve uygulama bir sonraki öne gelişinde yeniden deneniyor.
 */

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { ANAHTARLAR, useYerelDepo } from './depo'
import { useUygulamaGorunur } from './gorunurluk'
import {
  bekleyenSayisi,
  denemeArtir,
  geriBildirimEkle,
  gonderildiIsaretle,
  gonderilecekler,
  sinirdaMi,
  type GeriBildirim,
  type GeriBildirimTuru,
} from './geri-bildirim'
import { geriBildirimleriGonder } from './hata-gonder'

/** İki arka plan denemesi arasındaki en kısa süre; `hata-kuyrugu.ts` ile aynı gerekçe. */
const YENIDEN_DENEME = 60_000

/** Düğmeye basınca olan şey: gitti, ya da cihazda bekliyor. */
export type GonderimDurumu = 'gonderildi' | 'bekliyor'

export interface GeriBildirimKolu {
  /** Gönderilmeyi bekleyen kayıt sayısı — ekran bunu söylüyor. */
  bekleyen: number
  /** Günlük sınır dolduysa yeni kayıt alınmıyor. */
  sinirda: boolean
  /**
   * Kaydeder ve hemen göndermeyi dener. `null` dönerse kayıt hiç
   * açılmadı (sınır ya da geçersiz metin) — ekran bunu önceden denetliyor,
   * yine de yarış olmasın diye burada da kontrol var.
   */
  onGonder: (tur: GeriBildirimTuru, metin: string) => Promise<GonderimDurumu | null>
}

export function useGeriBildirim(): GeriBildirimKolu {
  const [liste, setListe] = useYerelDepo<GeriBildirim[]>(ANAHTARLAR.geriBildirimler, [])
  const gorunur = useUygulamaGorunur()
  const calisiyor = useRef(false)
  const sonDeneme = useRef(0)

  const bekleyenler = useMemo(() => gonderilecekler(liste), [liste])

  const sonucuIsle = useCallback(
    ({ gonderilen, basarisiz }: { gonderilen: string[]; basarisiz: string[] }) => {
      if (gonderilen.length > 0) setListe((l) => gonderildiIsaretle(l, gonderilen))
      if (basarisiz.length > 0) setListe((l) => denemeArtir(l, basarisiz))
    },
    [setListe],
  )

  // Arka plan denemesi: uygulama öne geldiğinde bekleyenleri yolla.
  useEffect(() => {
    if (!gorunur || bekleyenler.length === 0 || calisiyor.current) return
    if (Date.now() - sonDeneme.current < YENIDEN_DENEME) return

    calisiyor.current = true
    sonDeneme.current = Date.now()
    void geriBildirimleriGonder(bekleyenler)
      .then(sonucuIsle)
      .finally(() => {
        calisiyor.current = false
      })
  }, [gorunur, bekleyenler, sonucuIsle])

  const onGonder = useCallback(
    async (tur: GeriBildirimTuru, metin: string): Promise<GonderimDurumu | null> => {
      // `setListe` işlevsel güncelleme alıyor; yeni kaydı dışarı çıkarmak
      // için önce burada üretip aynı listeyi state'e yazıyoruz.
      const simdiki = geriBildirimEkle(liste, tur, metin, new Date())
      if (simdiki.length === liste.length) return null
      const yeni = simdiki[simdiki.length - 1]
      setListe(simdiki)

      calisiyor.current = true
      sonDeneme.current = Date.now()
      try {
        const sonuc = await geriBildirimleriGonder([yeni])
        sonucuIsle(sonuc)
        return sonuc.gonderilen.includes(yeni.kimlik) ? 'gonderildi' : 'bekliyor'
      } finally {
        calisiyor.current = false
      }
    },
    [liste, setListe, sonucuIsle],
  )

  return useMemo(
    () => ({
      bekleyen: bekleyenSayisi(liste),
      sinirda: sinirdaMi(liste, new Date()),
      onGonder,
    }),
    [liste, onGonder],
  )
}
