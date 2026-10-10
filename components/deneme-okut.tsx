'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, ImagePlus, LoaderCircle, ScanLine } from 'lucide-react'
import { Camera as CihazKamerasi, CameraResultType, CameraSource } from '@capacitor/camera'
import { Buton, Not } from '@/components/ui'
import { cihazdaMi } from '@/lib/kamera'
import { denemeyiCoz, type OkunanDers } from '@/lib/deneme-okuma'
import { useGeriKatmani } from '@/lib/geri'
import type { Sablon } from '@/lib/types'

export function DenemeOkut({ sablon, onAktar, onAcikDegisti }: {
  sablon: Sablon
  onAktar: (sonuclar: OkunanDers[]) => void
  /** Tam ekran okuma katmanı açıldı/kapandı (başlangıç turu rehberi o sırada çekiliyor). */
  onAcikDegisti?: (acik: boolean) => void
}) {
  const [acik, setAcik] = useState(false)
  const [okunuyor, setOkunuyor] = useState(false)
  const [ilerleme, setIlerleme] = useState('')
  const [hata, setHata] = useState('')
  const girdi = useRef<HTMLInputElement>(null)
  const islem = useRef<AbortController | null>(null)
  const etkin = useRef(true)
  const secimSuruyor = useRef(false)
  const secimSurumu = useRef(0)

  useEffect(() => {
    etkin.current = true
    return () => { etkin.current = false; islem.current?.abort() }
  }, [])

  // Geri çağrı ref'te: her çizimde yeni işlev gelse de etki yalnızca `acik` değişince koşsun.
  const acikBildir = useRef(onAcikDegisti)
  acikBildir.current = onAcikDegisti
  useEffect(() => {
    acikBildir.current?.(acik)
    return () => { if (acik) acikBildir.current?.(false) }
  }, [acik])

  const kapat = () => {
    secimSurumu.current++
    islem.current?.abort()
    islem.current = null
    setAcik(false)
    setOkunuyor(false)
    setHata('')
  }
  useGeriKatmani(acik, kapat)

  const oku = async (fotograf: Blob) => {
    if (!fotograf.type.startsWith('image/')) { setHata('Bir fotoğraf seç.'); return }
    islem.current?.abort()
    const denetim = new AbortController()
    islem.current = denetim
    setOkunuyor(true)
    setHata('')
    setIlerleme('Okuma hazırlanıyor…')
    try {
      const { kagidiOku } = await import('@/lib/deneme-ocr')
      if (denetim.signal.aborted) return
      const metin = await kagidiOku(fotograf, setIlerleme, denetim.signal)
      if (denetim.signal.aborted || !etkin.current) return
      const okuma = denemeyiCoz(metin, sablon)
      if (okuma.okunanlar.length === 0) {
        setHata(metin.trim()
          ? 'Sayılar güvenle okunamadı. Yeniden dene veya elle gir.'
          : 'Kâğıtta yazı bulamadım. İyi ışıkta yeniden dene veya elle gir.')
      } else { onAktar(okuma.okunanlar); kapat() }
    } catch {
      if (!denetim.signal.aborted && etkin.current) setHata('Fotoğraf okunamadı. Tekrar dene veya elle gir.')
    } finally {
      if (etkin.current && islem.current === denetim) {
        setOkunuyor(false)
        islem.current = null
      }
    }
  }

  const fotografSec = async (kaynak: 'kamera' | 'galeri') => {
    if (secimSuruyor.current) return
    if (!cihazdaMi()) { girdi.current?.click(); return }
    secimSuruyor.current = true
    const surum = secimSurumu.current
    try {
      // Soru fotoğrafındaki küçük JPEG burada harfleri silebilir; OCR için daha yüksek çözünürlük tutuluyor.
      const fotograf = await CihazKamerasi.getPhoto({
        resultType: CameraResultType.Uri, source: kaynak === 'kamera' ? CameraSource.Camera : CameraSource.Photos,
        quality: 95, width: 2400, correctOrientation: true, allowEditing: false,
      })
      if (fotograf.webPath && etkin.current && surum === secimSurumu.current) {
        const cevap = await fetch(fotograf.webPath)
        if (surum !== secimSurumu.current || !etkin.current) return
        await oku(await cevap.blob())
      }
    } catch {
      // Sistem seçicisinden vazgeçmek bir okuma hatası değildir.
    } finally { secimSuruyor.current = false }
  }

  return <>
    <Buton data-tanitim="deneme-okut" bicim="ikincil" className="mb-3 w-full" onClick={() => setAcik(true)}>
      <ScanLine size={19} aria-hidden />
      Okut
      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-extrabold text-primary">Beta</span>
    </Buton>
    {acik && <div role="dialog" aria-modal="true" aria-labelledby="deneme-okut-baslik" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-xl">
        <h2 id="deneme-okut-baslik" className="font-display mb-2 text-lg font-semibold">Kâğıdı okut</h2>
        <input ref={girdi} type="file" accept="image/*" className="hidden" aria-label="Deneme fotoğrafı seç" onChange={(olay) => {
          const dosya = olay.target.files?.[0]
          olay.target.value = ''
          if (dosya) void oku(dosya)
        }} />
        {okunuyor ? <div role="status" className="my-4 flex flex-col items-center gap-3 text-sm text-muted-foreground">
          <LoaderCircle className="animate-spin text-primary" size={28} />{ilerleme}
          <Buton bicim="hayalet" onClick={kapat}>Vazgeç</Buton>
        </div> : <>
          <p className="mb-1 text-sm text-muted-foreground">Kâğıdı düz tut, iyi ışıkta çek; sonuç tablosunun tamamı kadrajda olsun.</p>
          <p className="mb-4 text-sm font-semibold">Okunan sayıları kontrol et.</p>
          {hata && <Not tur="tehlike" className="mb-3">{hata}</Not>}
          <div className="flex flex-col gap-2">
            {cihazdaMi() && <Buton onClick={() => void fotografSec('kamera')}><Camera size={18} />Fotoğraf çek</Buton>}
            <Buton bicim={cihazdaMi() ? 'ikincil' : 'birincil'} onClick={() => void fotografSec('galeri')}><ImagePlus size={18} />Galeriden seç</Buton>
            <Buton bicim="hayalet" onClick={kapat}>Vazgeç</Buton>
          </div>
        </>}
      </div>
    </div>}
  </>
}
