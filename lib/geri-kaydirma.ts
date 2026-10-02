'use client'

import { useEffect, useRef } from 'react'
import { iosMu } from '@/lib/platform'

/**
 * iOS'ta kenardan geri kaydırma.
 *
 * Hareketin **tanınması** yerli tarafta (`AnaDenetleyici.swift`,
 * `UIScreenEdgePanGestureRecognizer`): JS'te dokunuşla tanımak sayfanın kendi
 * kaydırmasıyla yarışıyordu. Yerli taraf parmak kalkınca `rabiGeri` olayını
 * yolluyor, burası onu Android'in geri tuşuyla aynı yoldan (`geriGit`)
 * geçiriyor; yeni ekran kendi giriş hareketiyle geliyor.
 *
 * Bir süre sayfa parmağı izleyip dışarı kayıyordu ve kullanıcı geri istedi:
 * uygulama tek sayfa, bir önceki ekran DOM'da durmuyor — yerli bir yığın
 * gezgini gibi altta önceki ekranı göstermek mümkün değil, kayan sayfanın
 * altında boş zemin açılıyordu. Yarım bir taklit, hiç taklit olmamasından
 * kötü göründü. Geri getirmeden önce bu sebebe bak.
 */

/**
 * Kenardan kaydırmayı yok sayan kilitlerin sayısı.
 *
 * Yanlış soru fotoğrafına çizerken sol kenardan başlayan bir çizgi yerli
 * tarafta kenardan kaydırma olarak da tanınıyordu ve çizimi kaydedip
 * kapatıyordu (geri, çizimde "kaydet ve çık" demek). Hareketin tanınmasını
 * yerli taraf yapıyor ve parmağın sayfaya da ulaşması gerekiyor (çizgi o),
 * yani tanımayı kapatmak değil, tanınanı burada yok saymak gerekiyordu.
 * Çizimden çıkmanın yolu Vazgeç/Kaydet; Android'in geri tuşu bu kilide
 * bakmıyor, orada geri hâlâ kaydedip çıkıyor.
 *
 * Sayaç, bayrak değil: iki yer aynı anda kilitlerse ilki açınca ikincisi
 * kilitli kalmalı.
 */
let kilitler = 0

/** Kilidi koyar; dönen fonksiyon kaldırır. Bir etkinin dönüşüne verilmek için. */
export function geriKaydirmayiKilitle(): () => void {
  kilitler++
  let acildi = false
  return () => {
    if (acildi) return
    acildi = true
    kilitler--
  }
}

/** Kenardan kaydırma tamamlanınca `geriGit`. Android'de hiçbir şey yapmaz. */
export function useGeriKaydirma(geriGit: () => void) {
  const geriRef = useRef(geriGit)
  geriRef.current = geriGit

  useEffect(() => {
    if (!iosMu()) return
    const dinle = () => {
      if (kilitler > 0) return
      geriRef.current()
    }
    window.addEventListener('rabiGeri', dinle)
    return () => window.removeEventListener('rabiGeri', dinle)
  }, [])
}
