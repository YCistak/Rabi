'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { demoVerileriTemizle, TUR_ADIMLARI, TUR_ANAHTARLARI, tanitimGecisi, type TanitimTuru, type TanitimEylemi } from '@/lib/tanitim'

import { ANIMASYON_ANAHTARI, VARSAYILAN_ANIMASYON, animasyonKaydi, animasyonuDogrula, type TanitimAnimasyonu } from '@/lib/tanitim-animasyonu'

function useTanitimDurumu(deneyMi: boolean) {
  const [animasyon, setAnimasyon] = useState(VARSAYILAN_ANIMASYON)
  const animasyonRef = useRef(animasyon)
  animasyonRef.current = animasyon
  const [rehberGizli, setRehberGizli] = useState(false)
  const [kapanisSuruyor, setKapanisSuruyor] = useState(false)
  useEffect(() => { try { setAnimasyon(animasyonuDogrula(JSON.parse(localStorage.getItem(ANIMASYON_ANAHTARI) ?? 'null'))) } catch {} }, [])
  const animasyonuAyarla = useCallback((deger: TanitimAnimasyonu) => { const yeni = animasyonuDogrula(deger); setAnimasyon(yeni); try { localStorage.setItem(ANIMASYON_ANAHTARI, JSON.stringify(animasyonKaydi(yeni))) } catch {} }, [])
  const [durum, eylemGonder] = useReducer(tanitimGecisi, undefined, demoVerileriTemizle)
  const [gecisSuruyor, setGecisSuruyor] = useState(false)
  const kapanisRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const gecisRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Geçiş boyunca yeni dokunuşları kabul etme; aynı hareket iki adımı atlamasın.
  const gonder = useCallback((eylem: TanitimEylemi) => {
    if (gecisRef.current) return
    const beklenen = { ...eylem, beklenenAdim: durum.aktifAdim, beklenenTur: durum.aktifTur }
    const sure = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : animasyon.gecisMs
    /*
      Bekleme yoksa adım aynı anda değişiyor. Eskiden süre 0 iken de bir
      zamanlayıcıdan geçiliyordu ve araya giren `gecisSuruyor` katmanı bir an
      soldurmaya başlatıp geri getiriyordu. Çift dokunuşu yine
      `beklenenAdim` eliyor: ikinci dokunuş eski adım numarasını taşıyor.
    */
    if (sure <= 0) { eylemGonder(beklenen); return }
    setGecisSuruyor(true)
    gecisRef.current = setTimeout(() => {
      eylemGonder(beklenen)
      gecisRef.current = null
      setGecisSuruyor(false)
    }, sure)
  }, [durum.aktifAdim, durum.aktifTur, animasyon.gecisMs])
  useEffect(() => () => { if (gecisRef.current) clearTimeout(gecisRef.current); if (kapanisRef.current) clearTimeout(kapanisRef.current) }, [])
  const [gorulenler, setGorulenler] = useState<Record<TanitimTuru, boolean> | null>(null)
  const [kayitUyarisi, setKayitUyarisi] = useState('')
  useEffect(() => {
    const kayitlar = {} as Record<TanitimTuru, boolean>
    for (const turAdi of Object.keys(TUR_ANAHTARLARI) as TanitimTuru[]) {
      try { kayitlar[turAdi] = localStorage.getItem(TUR_ANAHTARLARI[turAdi]) === 'true' }
      catch { kayitlar[turAdi] = false }
    }
    setGorulenler(kayitlar)
  }, [])
  const turGorulduMu = useCallback((turAdi: TanitimTuru) => gorulenler?.[turAdi] ?? null, [gorulenler])
  const turuKaydet = useCallback((turAdi: TanitimTuru) => {
    if (deneyMi) return
    setGorulenler((onceki) => onceki ? { ...onceki, [turAdi]: true } : onceki)
    try { localStorage.setItem(TUR_ANAHTARLARI[turAdi], 'true') }
    catch { setKayitUyarisi('Tanıtım temizlendi. Cihaz depolaması kullanılamadığı için uygulamayı yeniden açınca tur tekrar görünebilir.') }
  }, [deneyMi])
  const turuBaslat = useCallback((turAdi: TanitimTuru) => {
    if (!durum.aktifTur && (deneyMi || turGorulduMu(turAdi) === false)) gonder({ tur: 'baslat', turAdi })
  }, [durum.aktifTur, turGorulduMu, gonder, deneyMi])
  const turuBitir = useCallback(() => {
    if (!durum.aktifTur) return
    if (gecisRef.current) clearTimeout(gecisRef.current)
    gecisRef.current = null
    setGecisSuruyor(true)
    setRehberGizli(false)
    turuKaydet(durum.aktifTur)
    eylemGonder({ tur: 'demo-temizle' })
    gecisRef.current = setTimeout(() => {
      eylemGonder({ tur: 'temizle' })
      setGecisSuruyor(false)
      setKapanisSuruyor(true)
      gecisRef.current = null
      if (kapanisRef.current) clearTimeout(kapanisRef.current)
      kapanisRef.current = setTimeout(() => { setKapanisSuruyor(false); kapanisRef.current = null }, animasyonRef.current.gecisMs + 250)
      // Katman `aydinlatmaMs` içinde sönüyor (spot-isigi.tsx); tur onu bekleyip kapanıyor.
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : animasyonRef.current.aydinlatmaMs)
  }, [durum.aktifTur, turuKaydet])

  return useMemo(() => ({
    ...durum, animasyon, animasyonuAyarla, deneyMi, rehberGizli, setRehberGizli, kapanisSuruyor,
    adim: durum.aktifAdim === null ? null : TUR_ADIMLARI[durum.aktifTur!][durum.aktifAdim],
    tanitimdaMi: durum.aktifAdim !== null,
    tamamlandi: gorulenler?.ana_tur ?? null,
    turGorulduMu, turuKaydet, turuBaslat,
    adimSayisi: durum.aktifTur ? TUR_ADIMLARI[durum.aktifTur].length : 0,
    kayitUyarisi, gecisSuruyor,
    gonder,
    turuBitir,
    sonrakiAdimaGec: () => gonder({ tur: 'ileri' }),
    oncekiAdimaDon: () => gonder({ tur: 'geri' }),
  }), [animasyon, animasyonuAyarla, deneyMi, rehberGizli, kapanisSuruyor, durum, gorulenler, turGorulduMu, turuKaydet, turuBaslat, kayitUyarisi, gecisSuruyor, turuBitir, gonder])
}

export const TanitimBaglami = createContext<ReturnType<typeof useTanitimDurumu> | null>(null)

export function TanitimSaglayici({ children, deneyMi = false }: { children: React.ReactNode; deneyMi?: boolean }) {
  const deger = useTanitimDurumu(deneyMi)
  return <TanitimBaglami value={deger}>{children}</TanitimBaglami>
}

export function useTanitim() {
  const baglam = useContext(TanitimBaglami)
  if (!baglam) throw new Error('Tanıtım bileşeni TanitimSaglayici içinde kullanılmalı.')
  return baglam
}
