'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { demoVerileriTemizle, TANITIM_ADIMLARI, TUR_ADIMLARI, TUR_ANAHTARLARI, tanitimGecisi, turBitisKayitlari, turGorulduOku, type DemoAlani, type TanitimEylemi, type TanitimKaydi, type TanitimTuru } from '@/lib/tanitim'

import { SAYIM_KORUMA_MS, gecisteEylemKarari, kuyrugaEkle, kuyruktanCikar, rehberAnahtari, rehberGizliMi, sayimKorumasiGerekli } from '@/lib/tanitim-rehber'
import { taniKaydet } from '@/lib/tanitim-tani'
import { ANIMASYON_ANAHTARI, VARSAYILAN_ANIMASYON, animasyonKaydi, animasyonuDogrula, type TanitimAnimasyonu } from '@/lib/tanitim-animasyonu'

function useTanitimDurumu(deneyMi: boolean) {
  const [animasyon, setAnimasyon] = useState(VARSAYILAN_ANIMASYON)
  const animasyonRef = useRef(animasyon)
  animasyonRef.current = animasyon
  const [kapanisSuruyor, setKapanisSuruyor] = useState(false)
  useEffect(() => { try { setAnimasyon(animasyonuDogrula(JSON.parse(localStorage.getItem(ANIMASYON_ANAHTARI) ?? 'null'))) } catch {} }, [])
  const animasyonuAyarla = useCallback((deger: TanitimAnimasyonu) => { const yeni = animasyonuDogrula(deger); setAnimasyon(yeni); try { localStorage.setItem(ANIMASYON_ANAHTARI, JSON.stringify(animasyonKaydi(yeni))) } catch {} }, [])
  const [durum, eylemGonder] = useReducer(tanitimGecisi, undefined, demoVerileriTemizle)
  const [gecisSuruyor, setGecisSuruyor] = useState(false)
  const kapanisRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const gecisRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** Geçiş sürerken gelen oyun/form olayları; geçiş bitince sırayla işleniyor. */
  const kuyrukRef = useRef<TanitimEylemi[]>([])

  /*
    Rehberin gizliliği bir bayrak değil, gizlendiği adımın anahtarı
    (`lib/tanitim-rehber.ts`). Bayrakken yalnız soru adımında sıfırlanıyordu:
    geri sayımda geri tuşu adımı değiştirince rehber bir daha hiç gelmiyordu.
    Şimdi adım ya da tur değişince kendiliğinden görünüyor.
  */
  const [gizliAnahtar, setGizliAnahtar] = useState<string | null>(null)
  const guncelAnahtar = rehberAnahtari(durum.aktifTur, durum.aktifAdim)
  const guncelAnahtarRef = useRef(guncelAnahtar)
  guncelAnahtarRef.current = guncelAnahtar
  const rehberGizli = rehberGizliMi(gizliAnahtar, guncelAnahtar)
  const setRehberGizli = useCallback((gizli: boolean) => {
    const anahtar = gizli ? guncelAnahtarRef.current : null
    taniKaydet('rehberGizli', { gizli, anahtar: guncelAnahtarRef.current })
    setGizliAnahtar(anahtar)
  }, [])
  // Eski adıma ait gizlilik silinir: aynı adıma geri dönülünce yeniden gizlenmesin.
  useEffect(() => {
    if (gizliAnahtar === null || gizliAnahtar === guncelAnahtar) return
    taniKaydet('rehberGizli', { gizli: false, anahtar: gizliAnahtar, sebep: 'adim-degisti', yeni: guncelAnahtar })
    setGizliAnahtar(null)
  }, [gizliAnahtar, guncelAnahtar])

  const gecisSuresi = useCallback(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : animasyonRef.current.gecisMs, [])
  /** Eylemi geçişle işler; geçiş bitince sırada bekleyen olay varsa onu da. */
  const gecisleIsle = useCallback(function isle(eylem: TanitimEylemi) {
    const sure = gecisSuresi()
    /*
      Bekleme yoksa adım aynı anda değişiyor. Eskiden süre 0 iken de bir
      zamanlayıcıdan geçiliyordu ve araya giren `gecisSuruyor` katmanı bir an
      soldurmaya başlatıp geri getiriyordu. Çift dokunuşu yine
      `beklenenAdim` eliyor: ikinci dokunuş eski adım numarasını taşıyor.
    */
    if (sure <= 0) { eylemGonder(eylem); return }
    setGecisSuruyor(true)
    gecisRef.current = setTimeout(() => {
      eylemGonder(eylem)
      gecisRef.current = null
      const sirada = kuyrukRef.current.shift()
      if (sirada) { taniKaydet('gonder', { eylem: sirada.tur, hedef: 'hedef' in sirada ? sirada.hedef : undefined, sonuc: 'kuyruktan' }); isle(sirada) }
      else setGecisSuruyor(false)
    }, sure)
  }, [gecisSuresi])
  /*
    Geçiş boyunca yeni dokunuşları kabul etme; aynı hareket iki adımı atlamasın.
    Oyundan/formdan gelen tek seferlik olaylar ise düşmüyor, sıraya giriyor:
    düşen "oyun başladı" turu Başlat adımında kilitliyordu.
  */
  const gonder = useCallback((eylem: TanitimEylemi) => {
    const beklenen = { ...eylem, beklenenAdim: durum.aktifAdim, beklenenTur: durum.aktifTur }
    const hedef = eylem.tur === 'hedefe-dokun' ? eylem.hedef : undefined
    if (gecisRef.current) {
      if (gecisteEylemKarari(eylem) === 'kuyruk') {
        kuyrukRef.current = kuyrugaEkle(kuyrukRef.current, kuyruktanCikar(beklenen))
        taniKaydet('gonder', { eylem: eylem.tur, hedef, adim: durum.aktifAdim, sonuc: 'kuyruga' })
      } else taniKaydet('gonder', { eylem: eylem.tur, hedef, adim: durum.aktifAdim, sonuc: 'dusuruldu' })
      return
    }
    taniKaydet('gonder', { eylem: eylem.tur, hedef, adim: durum.aktifAdim, sonuc: 'kabul' })
    gecisleIsle(beklenen)
  }, [durum.aktifAdim, durum.aktifTur, gecisleIsle])

  /*
    Sayım koruması: rehber geri sayım adımında beklenenden uzun gizli kaldıysa
    "oyun başladı" olayı kaybolmuştur. Tur atlanamaz ve rehber gizliyken
    kullanıcının elinde hiçbir düğme yok; hazırlığa dönülüp rehber geri
    getiriliyor (oyun ekranı `DemoOyun`da yeniden kuruluyor).
  */
  const adimKimligi = durum.aktifAdim === null || !durum.aktifTur ? null : TUR_ADIMLARI[durum.aktifTur][durum.aktifAdim].kimlik
  useEffect(() => {
    if (!sayimKorumasiGerekli({ rehberGizli, adimKimligi })) return
    const tur = durum.aktifTur
    const adim = durum.aktifAdim
    const zamanlayici = setTimeout(() => {
      taniKaydet('sayimKorumasi', { adim: adimKimligi })
      setGizliAnahtar(null)
      eylemGonder({ tur: 'geri', beklenenTur: tur, beklenenAdim: adim })
    }, SAYIM_KORUMA_MS)
    return () => clearTimeout(zamanlayici)
  }, [rehberGizli, adimKimligi, durum.aktifTur, durum.aktifAdim])
  useEffect(() => () => { if (gecisRef.current) clearTimeout(gecisRef.current); if (kapanisRef.current) clearTimeout(kapanisRef.current) }, [])
  const [gorulenler, setGorulenler] = useState<Record<TanitimTuru, boolean> | null>(null)
  const [kayitUyarisi, setKayitUyarisi] = useState('')
  useEffect(() => {
    const kayitlar = {} as Record<TanitimTuru, boolean>
    for (const turAdi of Object.keys(TUR_ANAHTARLARI) as TanitimTuru[]) {
      try { kayitlar[turAdi] = turGorulduOku(turAdi, (anahtar) => localStorage.getItem(anahtar)) }
      catch { kayitlar[turAdi] = false }
    }
    setGorulenler(kayitlar)
  }, [])
  const turGorulduMu = useCallback((turAdi: TanitimTuru) => gorulenler?.[turAdi] ?? null, [gorulenler])
  const turuKaydet = useCallback((turAdi: TanitimTuru) => {
    if (deneyMi) return
    setGorulenler((onceki) => onceki ? { ...onceki, [turAdi]: true } : onceki)
    try { for (const [anahtar, deger] of turBitisKayitlari(turAdi)) localStorage.setItem(anahtar, deger) }
    catch { setKayitUyarisi('Tanıtım temizlendi. Cihaz depolaması kullanılamadığı için uygulamayı yeniden açınca tur tekrar görünebilir.') }
  }, [deneyMi])
  const turuBaslat = useCallback((turAdi: TanitimTuru) => {
    if (!durum.aktifTur && (deneyMi || turGorulduMu(turAdi) === false)) { setGizliAnahtar(null); gonder({ tur: 'baslat', turAdi }) }
  }, [durum.aktifTur, turGorulduMu, gonder, deneyMi])
  /*
    Turda eklenen soru/görev/deneme turun kendi listesine yazılıyor (cihaz
    deposuna değil). Veri beklemeden işleniyor; ardından gelen "kayıt
    eklendi" ise sıradan bir adım geçişi, form adımında değilse yok sayılıyor.
  */
  const demoGuncelle = useCallback(<A extends DemoAlani>(alan: A, guncelle: Extract<TanitimEylemi, { tur: 'demo-veri'; alan: A }>['guncelle'], kayit?: TanitimKaydi) => {
    eylemGonder({ tur: 'demo-veri', alan, guncelle } as TanitimEylemi)
    if (kayit) gonder({ tur: 'kayit-eklendi', kayit })
  }, [gonder])
  const turuBitir = useCallback(() => {
    if (!durum.aktifTur) return
    if (gecisRef.current) clearTimeout(gecisRef.current)
    gecisRef.current = null
    kuyrukRef.current = []
    setGecisSuruyor(true)
    setGizliAnahtar(null)
    turuKaydet(durum.aktifTur)
    // Haritanın iki kitabını gösterdiyse Harita'nın kendi kısa turu da açılmıyor.
    if (durum.aktifTur === 'ana_tur' && durum.aktifAdim !== null && durum.aktifAdim >= TANITIM_ADIMLARI.findIndex((adim) => adim.kimlik === 'harita-ders')) turuKaydet('konu_haritasi')
    // Deneme ekleme ve İstatistik ana turda geri geldi; ana turu bitiren
    // kullanıcıya o ekranların eski mini turları bir daha açılmıyor.
    if (durum.aktifTur === 'ana_tur' && durum.aktifAdim !== null && durum.aktifAdim >= TANITIM_ADIMLARI.findIndex((adim) => adim.kimlik === 'deneme-ekle')) turuKaydet('denemeler')
    if (durum.aktifTur === 'ana_tur' && durum.aktifAdim !== null && durum.aktifAdim >= TANITIM_ADIMLARI.findIndex((adim) => adim.kimlik === 'istatistik-tur')) turuKaydet('istatistik')
    /*
      Demo verisi (örnek banka, denemeler) katman sönerken ekranda kalıyor ve
      tur tamamen kapanınca `temizle` ile siliniyor. Eskiden burada hemen
      `demo-temizle` gidiyordu: banka turunun "Turu Bitir"inde sönüş boyunca
      "Banka boş" yanıp sönüyordu.
    */
    gecisRef.current = setTimeout(() => {
      eylemGonder({ tur: 'temizle' })
      setGecisSuruyor(false)
      setKapanisSuruyor(true)
      gecisRef.current = null
      if (kapanisRef.current) clearTimeout(kapanisRef.current)
      kapanisRef.current = setTimeout(() => { setKapanisSuruyor(false); kapanisRef.current = null }, animasyonRef.current.gecisMs + 250)
      // Katman `aydinlatmaMs` içinde sönüyor (spot-isigi.tsx); tur onu bekleyip kapanıyor.
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : animasyonRef.current.aydinlatmaMs)
  }, [durum.aktifTur, durum.aktifAdim, turuKaydet])

  return useMemo(() => ({
    ...durum, animasyon, animasyonuAyarla, deneyMi, rehberGizli, setRehberGizli, kapanisSuruyor,
    adim: durum.aktifAdim === null ? null : TUR_ADIMLARI[durum.aktifTur!][durum.aktifAdim],
    tanitimdaMi: durum.aktifAdim !== null,
    tamamlandi: gorulenler?.ana_tur ?? null,
    turGorulduMu, turuKaydet, turuBaslat,
    adimSayisi: durum.aktifTur ? TUR_ADIMLARI[durum.aktifTur].length : 0,
    kayitUyarisi, gecisSuruyor,
    gonder,
    demoGuncelle,
    turuBitir,
    sonrakiAdimaGec: () => gonder({ tur: 'ileri' }),
    oncekiAdimaDon: () => gonder({ tur: 'geri' }),
  }), [animasyon, animasyonuAyarla, deneyMi, rehberGizli, setRehberGizli, kapanisSuruyor, durum, gorulenler, turGorulduMu, turuKaydet, turuBaslat, kayitUyarisi, gecisSuruyor, turuBitir, gonder, demoGuncelle])
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
