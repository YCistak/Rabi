'use client'

/** Kamera fotoğrafı yalnız yerel işçiye gider; OCR sunucuya bağlanmaz. */
export function kagidiOku(fotograf: Blob, ilerleme: (metin: string) => void, sinyal: AbortSignal): Promise<string> {
  return new Promise((coz, reddet) => {
    const isci = new Worker('/ocr/okuma-iscisi.js?v=1', { type: 'module' })
    let zamanlayici: ReturnType<typeof setTimeout>
    const temizle = () => {
      clearTimeout(zamanlayici)
      sinyal.removeEventListener('abort', vazgec)
      isci.terminate()
    }
    const vazgec = () => { temizle(); reddet(new DOMException('Vazgeçildi', 'AbortError')) }
    sinyal.addEventListener('abort', vazgec, { once: true })
    zamanlayici = setTimeout(() => { temizle(); reddet(new Error('Okuma zaman aşımına uğradı')) }, 120_000)
    isci.onmessage = (olay: MessageEvent<{ tur: string; metin?: string }>) => {
      if (olay.data.tur === 'ilerleme') ilerleme(olay.data.metin ?? 'Okunuyor…')
      else {
        temizle()
        if (olay.data.tur === 'sonuc') coz(olay.data.metin ?? '')
        else reddet(new Error('Kâğıt okunamadı'))
      }
    }
    isci.onerror = () => { temizle(); reddet(new Error('Okuma başlatılamadı')) }
    if (sinyal.aborted) vazgec()
    else isci.postMessage({ fotograf })
  })
}
