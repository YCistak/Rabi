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
 *
 * Gönderim **izne bağlı**: `bildirimIzni` `'verildi'` olana kadar hiçbir şey
 * ağa çıkmıyor, bildirimler cihazda birikiyor. Play'in kullanıcı verisi
 * politikası veri cihazdan çıkmadan önce belirgin açıklama ve kullanıcının
 * olumlu bir eylemini şart koşuyor; ayarlardaki açıklama tek başına yetmiyor.
 * İzin reddedilirse kayıtlar silinmiyor — kullanıcı fikrini değiştirirse
 * bekleyenler o zaman gidiyor.
 *
 * Ayarlarda ayrıca bir "bildirimleri gönder" anahtarı vardı; kalktı. Bildirim
 * zaten bayrak + sebep + izin kartı olmadan oluşmuyordu, anahtar aynı kararın
 * dördüncü kopyasıydı.
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

/** Gönderim izninin üç hâli. */
export type BildirimIzni = 'sorulmadi' | 'verildi' | 'reddedildi'

export function useHataBildirimi(): BildirimKolu {
  const [bildirimler, setBildirimler] = useYerelDepo<HataBildirimi[]>(
    ANAHTARLAR.hataBildirimleri,
    [],
  )
  const [izin, setIzin] = useYerelDepo<BildirimIzni>(ANAHTARLAR.bildirimIzni, 'sorulmadi')
  const gorunur = useUygulamaGorunur()
  const calisiyor = useRef(false)
  const sonDeneme = useRef(0)

  const bekleyen = useMemo(() => gonderilecekler(bildirimler), [bildirimler])

  useEffect(() => {
    if (izin !== 'verildi') return
    if (!gorunur || bekleyen.length === 0 || calisiyor.current) return
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
  }, [gorunur, izin, bekleyen, setBildirimler])

  /**
   * Bildirim **sebebiyle birlikte** açılıyor.
   *
   * Önce tek dokunuşla sebepsiz kaydediliyor, sebep sonradan isteğe bağlı
   * soruluyordu; gelen bildirimlerin çoğu "belirtilmedi" ile geliyor ve
   * "biri bu soruya kızmış" demekten öteye gitmiyordu. Sorunun bozuk mu
   * olduğunu, bozuksa nesinin bozuk olduğunu ayırt ettiren tek alan sebep.
   */
  const onBildir = useCallback(
    (soru: BankaSorusu, sebep: HataSebebi) => {
      setBildirimler((l) => bildirimEkle(l, soru, sebep, new Date()))
    },
    [setBildirimler],
  )

  const onSebep = useCallback(
    (kimlik: string, sebep: HataSebebi) => {
      setBildirimler((l) => sebepGuncelle(l, kimlik, sebep))
    },
    [setBildirimler],
  )

  const onIzin = useCallback(
    (karar: BildirimIzni) => {
      setIzin(karar)
    },
    [setIzin],
  )

  return useMemo(
    () => ({
      bildirimler,
      sinirda: sinirdaMi(bildirimler, new Date()),
      izin,
      onBildir,
      onSebep,
      onIzin,
    }),
    [bildirimler, izin, onBildir, onSebep, onIzin],
  )
}
