'use client'

import { useRef, useState } from 'react'
import { taniAcikMi, taniAyarla, taniMetni, taniSatirSayisi, taniTemizle } from '@/lib/tanitim-tani'

/*
  Tanıtım rehberinin gizli tanı kaydı (bkz. `lib/tanitim-tani.ts`).

  Kapı Ayarlar başlığı: 2,5 saniye içinde beş dokunuş kaydı açıp kapatıyor.
  Açıkken başlığın altında tek bir satır duruyor — satır sayısı, Kopyala ve
  Kapat. Kullanıcıya görünmüyor; geliştiricinin cihazda kanıt toplama aracı.
*/
export function useTaniKapisi() {
  const [acik, setAcik] = useState(() => (typeof window === 'undefined' ? false : taniAcikMi()))
  const dokunuslar = useRef<number[]>([])
  const dokun = () => {
    const simdi = Date.now()
    dokunuslar.current = [...dokunuslar.current.filter((t) => simdi - t < 2500), simdi]
    if (dokunuslar.current.length < 5) return
    dokunuslar.current = []
    taniAyarla(!acik)
    setAcik(!acik)
  }
  return { acik, dokun, kapat: () => { taniAyarla(false); setAcik(false) } }
}

export function TaniPaneli({ onKapat }: { onKapat: () => void }) {
  const [durum, setDurum] = useState('')
  const [sayi, setSayi] = useState(() => taniSatirSayisi())
  const kopyala = async () => {
    const metin = taniMetni()
    try {
      await navigator.clipboard.writeText(metin)
      setDurum('Kopyalandı')
    } catch {
      // Pano izni yoksa (eski WebView) paylaş penceresi.
      try {
        const { Share } = await import('@capacitor/share')
        await Share.share({ title: 'Rabi tanı kaydı', text: metin })
        setDurum('Paylaşıldı')
      } catch { setDurum('Kopyalanamadı') }
    }
  }
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-border px-3 py-2 text-xs font-bold text-muted-foreground">
      <span className="flex-1">Tanı kaydı açık · {sayi} satır {durum && `· ${durum}`}</span>
      <button type="button" className="min-h-11 rounded-lg px-2 text-primary" onClick={() => void kopyala()}>Kopyala</button>
      <button type="button" className="min-h-11 rounded-lg px-2" onClick={() => { taniTemizle(); setSayi(0); setDurum('') }}>Temizle</button>
      <button type="button" className="min-h-11 rounded-lg px-2" onClick={onKapat}>Kapat</button>
    </div>
  )
}
