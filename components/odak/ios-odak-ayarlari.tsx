'use client'

import { useEffect, useRef, useState } from 'react'
import { Lock } from 'lucide-react'
import type { PomodoroAyar } from '@/lib/types'
import { Buton, Not } from '@/components/ui'
import { KorumaSatiri } from '@/components/odak/odak-ayarlari'
import {
  ekranSuresiDurumu,
  ekranSuresiIzniIste,
  ekranSuresiListeGizle,
  ekranSuresiListeGoster,
  ekranSuresiListeKaldir,
  ekranSuresiUygulamaSec,
  type EkranSuresiDurumu,
} from '@/lib/ekran-suresi'
import { katmanlariIzle } from '@/lib/geri'

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
 *   seçicisinden seçiliyor ve Rabi seçilenlerin adını bile görmüyor. Seçilenler
 *   yine de burada, Android'deki gibi ikon ve adıyla görünüyor: o satırları
 *   yerli taraf çiziyor (`EngelListesi`), sayfa yalnızca yerini ayırıyor.
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

  // Seçim aynı sayıda kalsa da değişmiş olabilir; liste her kayıttan sonra
  // yeniden çizilsin diye ayrı bir sayaç.
  const [secimSurumu, setSecimSurumu] = useState(0)
  const sec = async () => {
    const sayi = await ekranSuresiUygulamaSec()
    if (sayi !== null) setDurum((d) => (d ? { ...d, secimSayisi: sayi } : d))
    setSecimSurumu((n) => n + 1)
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
          {durum && durum.secimSayisi > 0 && (
            <>
              <p className="mb-1 text-[11.5px] font-extrabold tracking-[0.09em] text-muted-foreground uppercase">
                Engellenenler ({durum.secimSayisi})
              </p>
              <EngelListesi sayi={durum.secimSayisi} surum={secimSurumu} />
            </>
          )}
          <Buton bicim="ikincil" boy="kucuk" className="mt-2" onClick={() => void sec()}>
            {durum && durum.secimSayisi > 0 ? 'Uygulamaları düzenle' : 'Uygulamaları seç'}
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

/** Yerli satırın yüksekliği — `EngelListesi.satirYuksekligi` ile aynı sayı. */
const SATIR_YUKSEKLIGI = 48

/**
 * Engellenen uygulamaların yeri. Satırları yerli taraf çiziyor (adı ve ikonu
 * yalnızca sistem gösterebiliyor); burası o kadar boşluk bırakıp yerini
 * bildiriyor. Yerli liste sayfanın kaydırmasının içinde, yani sayfayla
 * birlikte kayıyor — yer yalnızca düzen değişince yeniden bildiriliyor.
 *
 * Yerli liste web'in **üstünde** çiziliyor, o yüzden:
 * - Web'de bir pencere açılınca (çekmece, onay, çalışma sahnesi) gizleniyor;
 *   pencerelerin hepsi geri tuşu yığınından geçiyor (`katmanlariIzle`).
 * - Durum çubuğunun, yapışık Başlat düğmesinin ve alt menünün altına
 *   kaymıyor: ekranda görünebileceği bant (`ust`/`alt`) bildiriliyor, dışı
 *   yerli tarafta kesiliyor. Bandın alt ucu `data-yuzen` işaretli öğelerden.
 */
function EngelListesi({ sayi, surum }: { sayi: number; surum: number }) {
  const yer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const kutu = yer.current
    if (!kutu) return
    let pencereAcik = false

    const yerlestir = () => {
      if (pencereAcik) return
      const k = kutu.getBoundingClientRect()
      void ekranSuresiListeGoster({
        x: k.left + window.scrollX,
        y: k.top + window.scrollY,
        genislik: k.width,
        ust: guvenliUst(),
        alt: altSinir(),
      })
    }

    const birakIzle = katmanlariIzle((katman) => {
      pencereAcik = katman > 0
      if (pencereAcik) void ekranSuresiListeGizle()
      else yerlestir()
    })

    // Giriş hareketleri (`sayfa-girisi`, `acilir-giris`) kutuyu bir süre
    // kaydırıyor; ölçüm hareket bitince yineleniyor. Düzeni değiştiren her şey
    // (yazı tipi, üstteki bir satırın açılması) gövdenin boyunu da değiştiriyor.
    const gozlemci = new ResizeObserver(yerlestir)
    gozlemci.observe(document.body)
    document.addEventListener('animationend', yerlestir, true)
    document.addEventListener('transitionend', yerlestir, true)
    window.addEventListener('resize', yerlestir)
    const gecikmeli = window.setTimeout(yerlestir, 400)

    return () => {
      birakIzle()
      gozlemci.disconnect()
      document.removeEventListener('animationend', yerlestir, true)
      document.removeEventListener('transitionend', yerlestir, true)
      window.removeEventListener('resize', yerlestir)
      window.clearTimeout(gecikmeli)
    }
  }, [sayi, surum])

  // Sökülünce liste de gitsin: ekran değişti ya da kilit kapandı.
  useEffect(() => () => void ekranSuresiListeKaldir(), [])

  return (
    <div
      ref={yer}
      className="-mx-4"
      style={{ height: sayi * SATIR_YUKSEKLIGI }}
      aria-label={`${sayi} uygulama engellenecek`}
    />
  )
}

/** Durum çubuğunun yüksekliği: `--guvenli-ust` env() içerdiği için ölçülüyor. */
function guvenliUst(): number {
  const olcu = document.createElement('div')
  olcu.style.cssText = 'position:fixed;top:0;height:var(--guvenli-ust);visibility:hidden'
  document.body.appendChild(olcu)
  const yukseklik = olcu.getBoundingClientRect().height
  olcu.remove()
  return yukseklik
}

/**
 * Listenin inebileceği en alt nokta: ekrandaki yüzen öğelerin (alt menü,
 * yapışık Başlat) en üstü. Yapışık öğe henüz yapışmamışsa ölçülen yeri
 * aşağıda; yapıştığı an duracağı yer `bottom` değerinden hesaplanıyor.
 */
function altSinir(): number {
  let sinir = window.innerHeight
  for (const el of document.querySelectorAll<HTMLElement>('[data-yuzen]')) {
    const k = el.getBoundingClientRect()
    const stil = getComputedStyle(el)
    const ust =
      stil.position === 'sticky'
        ? window.innerHeight - (parseFloat(stil.bottom) || 0) - k.height
        : k.top
    sinir = Math.min(sinir, ust)
  }
  return sinir
}
