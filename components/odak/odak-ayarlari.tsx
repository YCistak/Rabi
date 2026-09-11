'use client'

import { useEffect, useState } from 'react'
import { BellOff, Lock } from 'lucide-react'
import type { PomodoroAyar } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Anahtar, Buton, Not } from '@/components/ui'
import { UygulamaSecici } from '@/components/odak/uygulama-secici'
import { odakDurumu, odakIzniIste, type OdakDurumu } from '@/lib/odak-kilidi'

/**
 * Odak kilidi ve Rahatsız Etme ayarları — Pomodoro'daki "Odak koruması"
 * satırının altında açılan iki anahtar.
 *
 * İkisi bir süre hem Ayarlar ekranında hem Pomodoro'nun tepesinde duruyordu ve
 * iki kopya birbirinden ayrı düşüyordu. Artık tek yer var ve orası Pomodoro:
 * ikisi de yalnızca çalışma turu boyunca yaşıyor, turdan bağımsız bir anlamları
 * yok.
 *
 * **Davet penceresi ve ilk giriş sihirbazı kaldırıldı.** Anahtarı açmadan
 * önce bir pencere "bu turu birlikte koruyalım mı" diye soruyor, Pomodoro'ya
 * ilk girişte de üç adımlık bir tanıtım çıkıyordu. Kullanıcı ikisini de
 * istemedi: anahtar bir anahtar, dokununca açılıyor. İzin **ilk açılışta**
 * isteniyor — anahtar açılırken eksik izin varsa sistem ekranı o an açılıyor;
 * izin bir kez verildikten sonra anahtarı kapatıp açmak bir daha sormuyor,
 * çünkü sorulan şey izin durumu ve o artık var.
 *
 * Bileşen izin durumunu kendi soruyor: izinler sistem ayarlarından veriliyor ve
 * kullanıcı Rabi'ye döndüğünde durum yeniden sorulmalı, yoksa panel hâlâ "izin
 * eksik" derdi.
 */
export function OdakAyarlari({
  ayar,
  setAyar,
}: {
  ayar: PomodoroAyar
  setAyar: (guncelleyici: PomodoroAyar | ((onceki: PomodoroAyar) => PomodoroAyar)) => void
}) {
  const [izinler, setIzinler] = useState<OdakDurumu>({
    kullanimVerisi: false,
    katman: false,
    rahatsizEtme: false,
    calisiyor: false,
  })
  const [seciciAcik, setSeciciAcik] = useState(false)

  useEffect(() => {
    const tazele = () => void odakDurumu().then(setIzinler)
    tazele()
    const gorunurluk = () => document.visibilityState === 'visible' && tazele()
    document.addEventListener('visibilitychange', gorunurluk)
    return () => document.removeEventListener('visibilitychange', gorunurluk)
  }, [])

  /*
    Kilidin iki izni var ve sistem ekranı tek seferde birini gösteriyor; eksik
    olanların ilki açılıyor. İkincisi kullanıcı döndüğünde satırın altındaki
    uyarıdan isteniyor — iki sistem ekranını art arda açmak, ilkinden dönen
    kullanıcıyı sormadan ikincisine düşürmek olurdu.
  */
  const kilidiDegistir = () => {
    if (ayar.odakKilidi) {
      setAyar((o) => ({ ...o, odakKilidi: false }))
      return
    }
    setAyar((o) => ({ ...o, odakKilidi: true }))
    if (!izinler.kullanimVerisi) void odakIzniIste('kullanimVerisi')
    else if (!izinler.katman) void odakIzniIste('katman')
  }

  const susturmayiDegistir = () => {
    if (ayar.rahatsizEtme) {
      setAyar((o) => ({ ...o, rahatsizEtme: false }))
      return
    }
    setAyar((o) => ({ ...o, rahatsizEtme: true }))
    if (!izinler.rahatsizEtme) void odakIzniIste('rahatsizEtme')
  }

  return (
    <>
      <KorumaSatiri
        Simge={Lock}
        baslik="Uygulama kilidi"
        aciklama="Seçtiğin uygulamaları açmaya kalkarsan karşına çıkarım"
        acik={ayar.odakKilidi}
        onDegis={kilidiDegistir}
      />

      {ayar.odakKilidi && (
        <div className="border-b border-border px-4 py-3">
          {(!izinler.kullanimVerisi || !izinler.katman) && (
            <Not tur="uyari" className="mb-2.5">
              İzin verilmediği sürece kilit çalışmaz; sayaç normal şekilde işler.
              <span className="mt-2 flex flex-wrap gap-1.5">
                {!izinler.kullanimVerisi && (
                  <Buton
                    bicim="ikincil"
                    boy="kucuk"
                    onClick={() => void odakIzniIste('kullanimVerisi')}
                  >
                    Kullanım verisi izni
                  </Buton>
                )}
                {!izinler.katman && (
                  <Buton bicim="ikincil" boy="kucuk" onClick={() => void odakIzniIste('katman')}>
                    Üste çizme izni
                  </Buton>
                )}
              </span>
            </Not>
          )}

          <Buton bicim="ikincil" boy="kucuk" onClick={() => setSeciciAcik((a) => !a)}>
            {seciciAcik ? 'Listeyi kapat' : `Uygulamaları seç (${ayar.kilitliUygulamalar.length})`}
          </Buton>

          {seciciAcik && (
            <div className="mt-3">
              <UygulamaSecici
                secili={ayar.kilitliUygulamalar}
                onDegis={(paketler) => setAyar((o) => ({ ...o, kilitliUygulamalar: paketler }))}
              />
            </div>
          )}
        </div>
      )}

      {/*
        Rahatsız Etme kilidin **içine gömülü değil**, ayrı bir satır: ikisi
        farklı şeyler engelliyor, farklı izin istiyor ve ayrı ayrı isteniyorlar.
        Kilidin altına konsaydı, kilit izinlerini veremeyen kullanıcı (Xiaomi'de
        sık) susturmaya da hiç ulaşamazdı.
      */}
      <KorumaSatiri
        Simge={BellOff}
        baslik="Rahatsız etme"
        aciklama="Tur boyunca telefon susar, bitince eski hâline döner"
        acik={ayar.rahatsizEtme}
        onDegis={susturmayiDegistir}
      />

      {ayar.rahatsizEtme && !izinler.rahatsizEtme && (
        <div className="border-t border-border px-4 py-3">
          <Not tur="uyari">
            İzin verilmeden telefon susmaz. Açılan listede{' '}
            <b className="font-extrabold">Rabi</b>'yi bul ve aç.
            <span className="mt-2 block">
              <Buton
                bicim="ikincil"
                boy="kucuk"
                onClick={() => void odakIzniIste('rahatsizEtme')}
              >
                Rahatsız Etme izni
              </Buton>
            </span>
          </Not>
        </div>
      )}
    </>
  )
}

/**
 * Koruma anahtarlarından biri.
 *
 * Satırın tamamı düğme: 27 pikselik anahtara parmakla isabet ettirmek zor ve
 * ıskalayan dokunuş "çalışmıyor" gibi okunuyor.
 *
 * İzin durumu burada gösterilmiyor. Anahtar "bu turda istiyor muyum"u soruyor;
 * iznin olup olmadığı ayrı bir soru ve cevabı satırın altındaki uyarıda.
 */
function KorumaSatiri({
  Simge,
  baslik,
  aciklama,
  acik,
  onDegis,
}: {
  Simge: typeof Lock
  baslik: string
  aciklama: string
  acik: boolean
  onDegis: () => void
}) {
  return (
    <button
      type="button"
      onClick={onDegis}
      aria-pressed={acik}
      className="flex w-full items-center gap-3 px-4 py-3 text-left not-last:border-b not-last:border-border active:bg-muted/50"
    >
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-full transition',
          acik ? 'bg-primary-soft text-primary' : 'bg-muted text-muted-foreground',
        )}
      >
        <Simge size={17} strokeWidth={2.4} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-extrabold leading-tight">{baslik}</span>
        <span className="mt-0.5 block text-[12px] leading-snug font-medium text-muted-foreground">
          {aciklama}
        </span>
      </span>
      <Anahtar acik={acik} />
    </button>
  )
}
