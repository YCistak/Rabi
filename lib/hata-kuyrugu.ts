'use client'

/**
 * Bildirim kuyruğunun sahibi.
 *
 * Kayıt, gönderim denemesi ve arayüzün ihtiyacı olan kol tek yerde toplanıyor;
 * AppShell yalnızca çağırıp sonucu aşağı geçiyor.
 *
 * Gönderim uygulama **öne geldiğinde** deneniyor. Ayrı bir zamanlayıcı yok:
 * bildirimin birkaç dakika gecikmesinin kimseye zararı yok, arka planda dönen
 * bir sayaç ise pil yerdi.
 */

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { ANAHTARLAR, useYerelDepo } from './depo'
import { useUygulamaGorunur } from './gorunurluk'
import {
  bildirimEkle,
  denemeArtir,
  gonderilecekler,
  gonderildiIsaretle,
  sebepGuncelle,
  sinirdaMi,
  type HataBildirimi,
  type HataSebebi,
} from './hata-bildirimi'
import { bildirimleriGonder } from './hata-gonder'
import type { BankaSorusu } from './oyunlar/banka'
import type { BildirimKolu } from '@/components/hata-bildir'

/**
 * İki deneme arasındaki en kısa süre.
 *
 * Gönderim başarısız olduğunda etki state'i değiştiriyor (`denemeSayisi`), o da
 * etkiyi yeniden tetikliyor. Bu bekleme olmasaydı ağ kopukken sıkı bir döngüye
 * girerdi.
 */
const YENIDEN_DENEME = 60_000

export function useHataBildirimi(acik: boolean): BildirimKolu {
  const [bildirimler, setBildirimler] = useYerelDepo<HataBildirimi[]>(
    ANAHTARLAR.hataBildirimleri,
    [],
  )
  const gorunur = useUygulamaGorunur()
  const calisiyor = useRef(false)
  const sonDeneme = useRef(0)

  const bekleyen = useMemo(() => gonderilecekler(bildirimler), [bildirimler])

  useEffect(() => {
    if (!acik || !gorunur || bekleyen.length === 0 || calisiyor.current) return
    if (Date.now() - sonDeneme.current < YENIDEN_DENEME) return

    calisiyor.current = true
    sonDeneme.current = Date.now()
    void bildirimleriGonder(bekleyen)
      .then(({ gonderilen, basarisiz }) => {
        if (gonderilen.length > 0) setBildirimler((l) => gonderildiIsaretle(l, gonderilen))
        if (basarisiz.length > 0) setBildirimler((l) => denemeArtir(l, basarisiz))
      })
      .finally(() => {
        calisiyor.current = false
      })
  }, [acik, gorunur, bekleyen, setBildirimler])

  const onBildir = useCallback(
    (soru: BankaSorusu) => {
      setBildirimler((l) => bildirimEkle(l, soru, 'belirtilmedi', new Date()))
    },
    [setBildirimler],
  )

  const onSebep = useCallback(
    (kimlik: string, sebep: HataSebebi) => {
      setBildirimler((l) => sebepGuncelle(l, kimlik, sebep))
    },
    [setBildirimler],
  )

  return useMemo(
    () => ({
      bildirimler,
      sinirda: sinirdaMi(bildirimler, new Date()),
      onBildir,
      onSebep,
    }),
    [bildirimler, onBildir, onSebep],
  )
}
