'use client'

import { useEffect, useState } from 'react'
import { BellOff, Lock } from 'lucide-react'
import type { PomodoroAyar } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Anahtar, Buton, Not } from '@/components/ui'
import { OdakDaveti } from '@/components/odak/odak-daveti'
import { UygulamaSecici } from '@/components/odak/uygulama-secici'
import { odakDurumu, odakIzniIste, type OdakDurumu } from '@/lib/odak-kilidi'

/**
 * Odak kilidi ve Rahatsız Etme ayarları.
 *
 * İkisi bir süre hem Ayarlar ekranında hem Pomodoro'nun tepesinde duruyordu ve
 * iki kopya birbirinden ayrı düşüyordu (biri uygulama listesini açıyordu,
 * öteki açmıyordu). Artık tek yer var ve orası **Pomodoro**: ikisi de yalnızca
 * çalışma turu boyunca yaşıyor, turdan bağımsız bir anlamları yok. Ayarlar'da
 * dururken kullanıcı onları turu başlatmadan önce görmüyordu — turu başlatmadan
 * önce görülmeyen bir ayar, o turda yanlış kurulmuş bir ayardır.
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
  /**
   * Kilit daveti açık mı.
   *
   * Anahtar kilidi doğrudan açmıyor: önce pencere çıkıyor, kilit ancak
   * "İstiyorum" denince açılıyor. Sebep izin ekranlarının kendisi — ne işe
   * yaradığını bilmeden oraya düşen kullanıcı geri dönüyor ve anahtar açık ama
   * kilit çalışmıyor kalıyordu (`components/odak/odak-daveti.tsx`).
   */
  const [davetAcik, setDavetAcik] = useState(false)

  useEffect(() => {
    const tazele = () => void odakDurumu().then(setIzinler)
    tazele()
    const gorunurluk = () => document.visibilityState === 'visible' && tazele()
    document.addEventListener('visibilitychange', gorunurluk)
    return () => document.removeEventListener('visibilitychange', gorunurluk)
  }, [])

  return (
    <>
      <KorumaSatiri
        Simge={Lock}
        baslik="Odak kilidi"
        aciklama="Seçtiğin uygulamaları açmaya kalkarsan karşına çıkarım"
        acik={ayar.odakKilidi}
        /*
          Açarken davet penceresi, kapatırken doğrudan: vazgeçmek için ikna
          edilmesi gereken bir anahtar, anahtar değil tuzaktır.
        */
        onDegis={() => {
          if (ayar.odakKilidi) {
            setAyar((o) => ({ ...o, odakKilidi: false }))
            return
          }
          setDavetAcik(true)
        }}
      />

      {ayar.odakKilidi && (
        <div className="border-b border-border px-4 py-3">
          {/*
            Anahtar izin **istemiyor**, yalnızca isteği kaydediyor: izin
            ekranını açan tek şey adı yazılı düğme. Anahtarın kendisi sistem
            ekranını açsaydı, özelliği merak edip deneyen kullanıcı istemediği
            bir izin akışının ortasında bulurdu kendini.
          */}
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

        Davet penceresi burada yok: bu izin korkutucu değil, sıradan bir sistem
        ayarı. Pencerenin işi kilidin izin ekranlarına hazırlamaktı.
      */}
      <KorumaSatiri
        Simge={BellOff}
        baslik="Rahatsız etme"
        aciklama="Tur boyunca telefon susar, bitince eski hâline döner"
        acik={ayar.rahatsizEtme}
        onDegis={() => setAyar((o) => ({ ...o, rahatsizEtme: !o.rahatsizEtme }))}
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

      {ayar.rahatsizEtme && izinler.rahatsizEtme && (
        <div className="border-t border-border px-4 py-3">
          <Not>
            Telefonun tamamı susar, yalnızca seçtiğin uygulamalar değil. Alarmların ve
            kendi Rahatsız Etme istisnaların (kişilerden gelen aramalar gibi) geçmeye
            devam eder.
          </Not>
        </div>
      )}

      <OdakDaveti
        acik={davetAcik}
        /*
          "İstemiyorum" kayda da yazılıyor; pencereyi kapatmak yetmiyordu.
          Tanıtım görülmüş sayılmadığı için kullanıcı Pomodoro'ya girdiğinde
          kurulum ekranı devralıyor ve az önce istemediği özellik yeniden
          karşısına çıkıyordu. Hayır bir kez söylenir.
        */
        onIstemiyorum={() => {
          setDavetAcik(false)
          setAyar((o) => ({ ...o, odakKilidi: false, kilitTanitimiGoruldu: true }))
        }}
        /*
          Kilit burada açılıyor ama henüz çalışmıyor: izinler eksikken anahtar
          açık durur ve altındaki uyarı ne eksik olduğunu söyler. Anahtarı
          izinler gelene kadar kapalı tutmak, kullanıcının "istiyorum" dediği
          anı kaybetmek olurdu.

          İzin ekranı buradan **açılmıyor**. Bir süre eksik izinlerden ilki
          kendiliğinden açılıyordu ve kullanıcı bunu "uygulama izni kendi aldı"
          diye okudu — haklı olarak: "istiyorum" özelliği istemek demek, sistem
          izinlerini vermek değil.
        */
        onIstiyorum={() => {
          setDavetAcik(false)
          setAyar((o) => ({ ...o, odakKilidi: true }))
        }}
      />
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
