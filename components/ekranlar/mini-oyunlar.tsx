'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { OyunId, OyunKayitlari, OyunTurKaydi } from '@/lib/types'
import { OYUNLAR, istatistikAl, oyunToplami } from '@/lib/oyunlar/tanim'
import {
  TUR_SURESI,
  YANLIS_CEZASI,
  istatistigiGuncelle,
  type TurSayilari,
} from '@/lib/oyunlar/tur'
import { sesleriHazirla } from '@/lib/oyunlar/oyun-sesi'
import { OYUN_GECMIS_SINIRI } from '@/lib/depo'
import { LOFI_PARCALAR } from '@/lib/lofi'
import { SesCalar } from '@/lib/ses'
import { tarihYaz } from '@/lib/hesap'
import { bugun } from '@/lib/utils'
import { BaslikSatiri, Deger, Not } from '@/components/ui'
import { YazimOyunuEkrani } from '@/components/ekranlar/oyun-yazim'
import { IslemOyunuEkrani } from '@/components/ekranlar/oyun-islem'
import { EdebiyatOyunuEkrani } from '@/components/ekranlar/oyun-edebiyat'

/**
 * Mini oyun listesi.
 *
 * Oyun seçilince tam ekran bir katman açılıyor; bu ekran arkada duruyor ve
 * çıkışta olduğu gibi geri geliyor. Ayrı bir `Ekran` değeri yapılmadı çünkü
 * oyundan çıkınca listeye değil kart menüsüne dönerdi.
 */
/** Mini oyunların arka plan müziği — pomodoro ile aynı CC0 lo-fi listesinden. */
const OYUN_PARCASI = LOFI_PARCALAR[5]

export function MiniOyunlarEkrani({
  kayitlar,
  setKayitlar,
  setGecmis,
  sesAcik,
  muzikAcik,
}: {
  kayitlar: OyunKayitlari
  setKayitlar: (guncelleyici: OyunKayitlari | ((onceki: OyunKayitlari) => OyunKayitlari)) => void
  setGecmis: (guncelleyici: (onceki: OyunTurKaydi[]) => OyunTurKaydi[]) => void
  sesAcik: boolean
  muzikAcik: boolean
}) {
  const [acikOyun, setAcikOyun] = useState<OyunId | null>(null)
  const toplam = oyunToplami(kayitlar)

  // --- Arka plan müziği ---
  // Yalnızca bir oyun açıkken çalıyor; liste ekranında müzik başlaması,
  // menüde gezinen kullanıcıyı şaşırtırdı.
  const calarRef = useRef<SesCalar | null>(null)
  useEffect(() => {
    if (acikOyun === null || !muzikAcik) {
      calarRef.current?.kapat()
      calarRef.current = null
      return
    }
    const calar = new SesCalar()
    // Ses efektlerinin altında kalmalı: müzik yüksek olursa doğru/yanlış
    // geri bildirimi duyulmuyor ve oyunun tek geri bildirimi kayboluyor.
    calar.sesSeviyesi(0.22)
    calar.cal(`lofi:${OYUN_PARCASI.dosya}`)
    calarRef.current = calar
    return () => {
      calar.kapat()
      calarRef.current = null
    }
  }, [acikOyun, muzikAcik])

  const turBitti = (id: OyunId, ozet: TurSayilari) => {
    setKayitlar((onceki) => ({
      ...onceki,
      [id]: istatistigiGuncelle(onceki[id], ozet, bugun()),
    }))

    /*
      Turun gerçek süresi.

      Ayrı bir kronometre tutulmuyor çünkü gerekmiyor: tur `TUR_SURESI` saniyelik
      bir hedef zaman damgasıyla başlıyor ve her yanlış cevap bu damgadan
      `YANLIS_CEZASI` saniye düşüyor. Turun duvar saatindeki uzunluğu tam olarak
      bu fark. (Tur bitmeden çıkılırsa hiç kayıt düşmüyor — o süre sayılmıyor.)
    */
    const saniye = Math.max(0, TUR_SURESI - YANLIS_CEZASI * ozet.yanlis)
    setGecmis((onceki) =>
      [...onceki, { tarih: bugun(), oyun: id, saniye, dogru: ozet.dogru }].slice(
        -OYUN_GECMIS_SINIRI,
      ),
    )
  }

  return (
    <div>
      <BaslikSatiri
        baslik="Mini Oyunlar"
        aciklama="Bir dakikalık turlarla bilgi tazele"
      />

      <div className="mb-4 grid grid-cols-3 gap-3">
        <Deger etiket="Oynanan tur" deger={String(toplam.oynananTur)} />
        <Deger etiket="Toplam doğru" deger={String(toplam.toplamDogru)} vurgu />
        <Deger etiket="En iyi seri" deger={String(toplam.enIyiSeri)} />
      </div>

      <ul className="space-y-3">
        {OYUNLAR.map((oyun) => {
          const istatistik = istatistikAl(kayitlar, oyun.id)
          return (
            <li key={oyun.id}>
              <button
                type="button"
                onClick={() => {
                  // Ses dosyaları tanıtım açılırken çözülüyor; oyun başlayınca
                  // yüklenseydi ilk cevabın sesi geç gelirdi. Dokunma aynı
                  // zamanda AudioContext'i açan kullanıcı etkileşimi oluyor.
                  sesleriHazirla(sesAcik)
                  setAcikOyun(oyun.id)
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition active:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="text-3xl leading-none" aria-hidden>
                  {oyun.ikon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{oyun.ad}</span>
                  <span className="block text-xs leading-snug text-muted-foreground">
                    {oyun.kisaAciklama}
                  </span>
                  <span className="rakam mt-1 block text-xs text-muted-foreground">
                    {istatistik.oynananTur > 0
                      ? `Rekor ${istatistik.enIyiDogru} · ${istatistik.oynananTur} tur · son ${tarihYaz(istatistik.sonTarih)}`
                      : 'Henüz oynamadın'}
                  </span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-muted-foreground" aria-hidden />
              </button>
            </li>
          )
        })}
      </ul>

      <Not className="mt-4">
        Mini oyunların hepsi rozet veriyor: oynanan tur, tek tur rekoru, hatasız tur ve
        toplam doğru sayısı ayrı ayrı sayılıyor. Rozetler ekranından bakabilirsin.
      </Not>

      {acikOyun === 'yazim' && (
        <YazimOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'yazim')}
          sesAcik={sesAcik}
          onTurBitti={(ozet) => turBitti('yazim', ozet)}
          onCik={() => setAcikOyun(null)}
        />
      )}
      {acikOyun === 'islem' && (
        <IslemOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'islem')}
          sesAcik={sesAcik}
          onTurBitti={(ozet) => turBitti('islem', ozet)}
          onCik={() => setAcikOyun(null)}
        />
      )}
      {acikOyun === 'edebiyat' && (
        <EdebiyatOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'edebiyat')}
          sesAcik={sesAcik}
          onTurBitti={(ozet) => turBitti('edebiyat', ozet)}
          onCik={() => setAcikOyun(null)}
        />
      )}
    </div>
  )
}
