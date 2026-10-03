'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, ImagePlus, LoaderCircle, ScanLine, X } from 'lucide-react'
import { Camera as CihazKamerasi, CameraResultType, CameraSource } from '@capacitor/camera'
import { Buton, Kart, Not } from '@/components/ui'
import { cihazdaMi } from '@/lib/kamera'
import { denemeyiCoz, type OkunanDers, type OkumaSonucu } from '@/lib/deneme-okuma'
import { useGeriKatmani } from '@/lib/geri'
import type { Sablon } from '@/lib/types'

export function DenemeOkut({ sablon, onAktar }: { sablon: Sablon; onAktar: (sonuclar: OkunanDers[]) => void }) {
  const [acik, setAcik] = useState(false)
  const [okunuyor, setOkunuyor] = useState(false)
  const [ilerleme, setIlerleme] = useState('')
  const [hata, setHata] = useState('')
  const [hamMetin, setHamMetin] = useState('')
  const [sonuc, setSonuc] = useState<OkumaSonucu | null>(null)
  const girdi = useRef<HTMLInputElement>(null)
  const islem = useRef<AbortController | null>(null)
  const etkin = useRef(true)
  const secimSuruyor = useRef(false)
  const secimSurumu = useRef(0)

  useEffect(() => {
    etkin.current = true
    return () => { etkin.current = false; islem.current?.abort() }
  }, [])

  const kapat = () => {
    secimSurumu.current++
    islem.current?.abort()
    islem.current = null
    setAcik(false)
    setOkunuyor(false)
    setSonuc(null)
    setHata('')
    setHamMetin('')
  }
  useGeriKatmani(acik, kapat)

  const oku = async (fotograf: Blob) => {
    if (!fotograf.type.startsWith('image/')) { setHata('Bir fotoğraf seç.'); return }
    islem.current?.abort()
    const denetim = new AbortController()
    islem.current = denetim
    setOkunuyor(true)
    setHata('')
    setHamMetin('')
    setSonuc(null)
    setIlerleme('Okuma hazırlanıyor…')
    try {
      const { kagidiOku } = await import('@/lib/deneme-ocr')
      if (denetim.signal.aborted) return
      const metin = await kagidiOku(fotograf, setIlerleme, denetim.signal)
      if (denetim.signal.aborted || !etkin.current) return
      setHamMetin(metin)
      const okuma = denemeyiCoz(metin, sablon)
      if (okuma.okunanlar.length === 0) {
        setHata(metin.trim()
          ? 'Yazı bulundu; ancak doğru ve yanlış sayıları güvenle tamamlanamadı. Aşağıdaki ham okumayı kontrol et veya sonuçları elle gir.'
          : 'Bu kâğıtta yazı bulamadım. İyi ışıkta yeniden fotoğraf çek veya sonuçları elle gir.')
      } else setSonuc(okuma)
    } catch {
      if (!denetim.signal.aborted && etkin.current) setHata('Fotoğraf okunamadı. Başka bir fotoğrafla tekrar dene veya elle gir.')
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
    <Buton bicim="ikincil" className="mb-3 w-full" onClick={() => setAcik(true)}>
      <ScanLine size={19} aria-hidden />
      Okut
      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-extrabold text-primary">Beta</span>
    </Buton>
    {acik && <div role="dialog" aria-modal="true" aria-labelledby="deneme-okut-baslik" className="tam-katman-girisi fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="mx-auto max-w-md px-4 pt-[calc(1.25rem+var(--guvenli-ust))] pb-[calc(2rem+var(--guvenli-alt))]">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="deneme-okut-baslik" className="font-display flex items-center gap-2 text-xl font-semibold">Denemeyi okut <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary">Beta</span></h2>
          <Buton bicim="hayalet" boy="simge" onClick={kapat} aria-label="Okumayı kapat"><X size={20} /></Buton>
        </div>
        <p className="mb-2 text-sm text-muted-foreground">{sablon.ad} için ders adını, doğru ve yanlış sayısını her satıra ayrı yaz.</p>
        <Kart className="mb-4 space-y-1 font-semibold text-sm"><p>Matematik 38D 2Y</p><p>Türkçe 32D 6Y 2B</p></Kart>
        <input ref={girdi} type="file" accept="image/*" className="hidden" aria-label="Deneme fotoğrafı seç" onChange={(olay) => {
          const dosya = olay.target.files?.[0]
          olay.target.value = ''
          if (dosya) void oku(dosya)
        }} />
        {!okunuyor && <div className="mb-4 flex gap-2">
          {cihazdaMi() && <Buton bicim="ikincil" className="flex-1" onClick={() => void fotografSec('kamera')}><Camera size={18} />Çek</Buton>}
          <Buton bicim="ikincil" className="flex-1" onClick={() => void fotografSec('galeri')}><ImagePlus size={18} />Fotoğraf seç</Buton>
        </div>}
        {/* Uyarı düğmelerin altında: ekranın tepesinde, yönergeden ve örnekten
            önce okunuyordu ve okumanın kendisi daha başlamamışken "yanılabilir"
            diyordu. Kullanıcı Çek'in altına istedi — fotoğrafı çekecek kişinin
            gözü orada. */}
        {!okunuyor && <Not className="mb-4">Okuma yanılabilir. Sayıları kontrol ettikten sonra forma aktar. Fotoğraf cihazında okunur ve saklanmaz.</Not>}
        {okunuyor && <div role="status" className="my-8 flex flex-col items-center gap-3 text-sm text-muted-foreground"><LoaderCircle className="animate-spin text-primary" size={28} />{ilerleme}<Buton bicim="hayalet" onClick={kapat}>Vazgeç</Buton></div>}
        {hata && <Not tur="tehlike" className="mb-4">{hata}</Not>}
        {hamMetin && <details className="mb-4 rounded-xl border border-border bg-card px-3 py-2 text-sm">
          <summary className="cursor-pointer font-semibold">Okunan yazıyı göster</summary>
          <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-muted-foreground">{hamMetin}</pre>
        </details>}
        {sonuc && <>
          <h3 className="mb-2 font-display font-semibold">Okunan sonuçları kontrol et</h3>
          <Kart className="mb-3 p-0">
            <div className="grid grid-cols-[1fr_3.5rem_3.5rem] gap-2 border-b border-border px-3 py-2 text-xs text-muted-foreground"><span>Ders</span><span>Doğru</span><span>Yanlış</span></div>
            {sonuc.okunanlar.map((ders) => <div key={ders.dersId} className="grid grid-cols-[1fr_3.5rem_3.5rem] gap-2 border-b border-border px-3 py-3 text-sm last:border-0"><span>{sablon.dersler.find((d) => d.id === ders.dersId)?.ad}</span><span className="rakam">{ders.dogru}</span><span className="rakam">{ders.yanlis}</span></div>)}
          </Kart>
          <p className="mb-4 text-xs text-muted-foreground">{sonuc.okunanlar.length}/{sablon.dersler.length} ders okundu. Eksik veya hatalı sayıları formda düzeltebilirsin. Okunan derslerin girişleri bu sayılarla değişir.</p>
          {sonuc.atlananlar.length > 0 && <p className="mb-4 text-xs text-muted-foreground">Eksik veya belirsiz olduğu için aktarılmayanlar: {sonuc.atlananlar.join(', ')}.</p>}
          <Buton className="w-full" onClick={() => { onAktar(sonuc.okunanlar); kapat() }}>Kontrol ettim, forma aktar</Buton>
        </>}
      </div>
    </div>}
  </>
}
