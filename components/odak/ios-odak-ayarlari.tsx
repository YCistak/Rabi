'use client'

import { useEffect, useState } from 'react'
import { Lock } from 'lucide-react'
import type { PomodoroAyar } from '@/lib/types'
import { Buton, Not } from '@/components/ui'
import { KorumaSatiri } from '@/components/odak/odak-ayarlari'
import {
  ekranSuresiDurumu,
  ekranSuresiIzniIste,
  ekranSuresiUygulamaSec,
  type EkranSuresiDurumu,
} from '@/lib/ekran-suresi'

/**
 * iOS'ta odak koruması (Pomodoro'nun "Odak koruması" satırının içi).
 *
 * Android'deki `OdakAyarlari`nın karşılığı; ondan iki yerde ayrılıyor:
 *
 * - **Tek anahtar.** Android'de uygulama kilidi ile Rahatsız Etme ayrı
 *   anahtarlar. iOS'ta kalkanlanan uygulama hem açılmıyor hem bildirim
 *   göndermiyor — Screen Time ikisini birlikte yapıyor, ayırmanın yolu yok.
 *   Ayrı bir susturma anahtarı, çalışmayan bir anahtar olurdu.
 * - **Liste Apple'ın.** Uygulamalar Rabi'nin kendi listesinden değil Apple'ın
 *   seçicisinden seçiliyor ve Rabi seçilenlerin adını bile görmüyor; ekranda
 *   yalnızca kaç tane seçildiği yazıyor.
 *
 * Davet penceresi yok: Android'de pencerenin işi kullanıcıyı korkutucu sistem
 * izin ekranlarına hazırlamaktı. iOS'un izni tek, sade bir sistem penceresi.
 * İzin anahtar açılırken isteniyor — anahtarın tek anlamı zaten o.
 */
export function IosOdakAyarlari({
  ayar,
  setAyar,
}: {
  ayar: PomodoroAyar
  setAyar: (guncelleyici: PomodoroAyar | ((onceki: PomodoroAyar) => PomodoroAyar)) => void
}) {
  const [durum, setDurum] = useState<EkranSuresiDurumu | null>(null)

  // İzin Ayarlar'dan da geri alınabiliyor; Rabi'ye dönülünce yeniden sor.
  useEffect(() => {
    const tazele = () => void ekranSuresiDurumu().then(setDurum)
    tazele()
    const gorunurluk = () => document.visibilityState === 'visible' && tazele()
    document.addEventListener('visibilitychange', gorunurluk)
    return () => document.removeEventListener('visibilitychange', gorunurluk)
  }, [])

  const anahtariDegistir = async () => {
    if (ayar.odakKilidi) {
      setAyar((o) => ({ ...o, odakKilidi: false }))
      return
    }
    // İzin yoksa önce iste. Reddedilirse anahtar kapalı kalıyor ve altındaki
    // not neden açılmadığını söylüyor; açık duran ama çalışmayan bir kilit
    // kullanıcıyı korumada sanırdı.
    let izin = durum?.izin ?? 'sorulmadi'
    if (izin !== 'verildi') {
      izin = await ekranSuresiIzniIste()
      setDurum((d) => (d ? { ...d, izin } : d))
    }
    if (izin === 'verildi') setAyar((o) => ({ ...o, odakKilidi: true }))
  }

  const sec = async () => {
    const sayi = await ekranSuresiUygulamaSec()
    if (sayi !== null) setDurum((d) => (d ? { ...d, secimSayisi: sayi } : d))
  }

  if (durum && !durum.destek) {
    return (
      <div className="px-4 py-3">
        <Not>Odak kilidi iOS 16 ve üstünde çalışıyor. Telefonunu güncelleyince burada açılır.</Not>
      </div>
    )
  }

  return (
    <>
      <KorumaSatiri
        Simge={Lock}
        baslik="Uygulama kilidi"
        aciklama="Seçtiğin uygulamalar tur boyunca açılmaz, bildirimleri de gelmez"
        acik={ayar.odakKilidi}
        onDegis={() => void anahtariDegistir()}
      />

      {!ayar.odakKilidi && durum?.izin === 'reddedildi' && (
        <div className="border-t border-border px-4 py-3">
          <Not tur="uyari">
            Ekran Süresi izni verilmedi, kilit bu yüzden açılamadı. Anahtara yeniden dokunursan
            izin tekrar sorulur.
          </Not>
        </div>
      )}

      {ayar.odakKilidi && (
        <div className="border-t border-border px-4 py-3">
          {durum && durum.secimSayisi === 0 && (
            <Not tur="uyari" className="mb-2.5">
              Henüz uygulama seçmedin; seçmeden kilit hiçbir şeyi engellemez.
            </Not>
          )}
          <Buton bicim="ikincil" boy="kucuk" onClick={() => void sec()}>
            {`Uygulamaları seç (${durum?.secimSayisi ?? 0})`}
          </Buton>
          <Not className="mt-2.5">
            Kilit yalnızca çalışma turunda devrede, molada kalkar. Tur bitince ya da duraklatınca
            uygulamalar hemen açılır.
          </Not>
        </div>
      )}
    </>
  )
}
