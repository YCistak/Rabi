'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, Check, Eye, Layers, ShieldCheck } from 'lucide-react'
import type { PomodoroAyar } from '@/lib/types'
import {
  odakDurumu,
  odakIzniIste,
  type OdakDurumu,
  type OdakIzni,
} from '@/lib/odak-kilidi'
import { Buton, Kart, Not } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { UygulamaSecici } from '@/components/odak/uygulama-secici'

/**
 * Odak kilidinin ilk giriş akışı — pomodoroya ilk girişte bir kez çıkar.
 *
 * Üç adım: tanıtım, izin açıklaması, uygulama seçimi. Her adım atlanabilir;
 * kullanıcı vazgeçerse özellik kapalı kalır ve bir daha sorulmaz (Ayarlar'dan
 * açılabilir). Kilit isteğe bağlı bir yardım, dayatma değil.
 */
export function OdakKurulum({
  ayar,
  setAyar,
  onBitir,
}: {
  ayar: PomodoroAyar
  setAyar: (guncelleyici: PomodoroAyar | ((onceki: PomodoroAyar) => PomodoroAyar)) => void
  onBitir: () => void
}) {
  const [adim, setAdim] = useState(0)
  const [durum, setDurum] = useState<OdakDurumu>({
    kullanimVerisi: false,
    katman: false,
    calisiyor: false,
  })
  const [secili, setSecili] = useState<string[]>(ayar.kilitliUygulamalar)

  const durumuTazele = useCallback(() => {
    void odakDurumu().then(setDurum)
  }, [])

  // İzinler sistem ayarlarında veriliyor; kullanıcı geri döndüğünde durum
  // yeniden sorulmalı, yoksa ekran hâlâ "izin yok" gösterirdi.
  useEffect(() => {
    durumuTazele()
    const gorunurluk = () => document.visibilityState === 'visible' && durumuTazele()
    document.addEventListener('visibilitychange', gorunurluk)
    return () => document.removeEventListener('visibilitychange', gorunurluk)
  }, [durumuTazele])

  /** Bir daha sorulmasın; kullanıcı isterse Ayarlar'dan açar. */
  const vazgec = () => {
    setAyar((o) => ({ ...o, kilitTanitimiGoruldu: true, odakKilidi: false }))
    onBitir()
  }

  const bitir = () => {
    setAyar((o) => ({
      ...o,
      kilitTanitimiGoruldu: true,
      odakKilidi: true,
      kilitliUygulamalar: secili,
    }))
    onBitir()
  }

  const izinAc = (izin: OdakIzni) => {
    void odakIzniIste(izin)
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col">
      <div className="mb-5 flex flex-col items-center text-center">
        <Rabi durum={adim === 2 ? 'mutlu' : 'normal'} boyut={92} />
        <h1 className="mt-3 font-display text-xl font-semibold tracking-tight">
          {BASLIKLAR[adim]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{ACIKLAMALAR[adim]}</p>
      </div>

      <Kart>
        {adim === 0 && (
          <div className="space-y-3 text-[15px]">
            <p>
              Sayaç çalışırken seçtiğin uygulamaları açmaya kalkarsan karşına ben çıkarım.
              Molada kilit kendiliğinden açılır.
            </p>
            <Not>
              Bu bir kilit değil, engel: istediğin an kapatabilirsin. Amacı refleksle
              telefona uzanmayı zorlaştırmak.
            </Not>
            {/* Bedeli izin istenmeden önce yazıyor: sonradan öğrenilen karşılık
                caydırıcı değil, sürpriz olurdu. */}
            <Not tur="uyari">
              Ama bedava değil: çalışma turu sürerken kilidi kaparsan tur baştan başlar.
            </Not>
          </div>
        )}

        {adim === 1 && (
          <div className="space-y-3">
            {/* Play politikası "Belirgin Açıklama": izin istenmeden önce ne
                yaptığımız ve ne yapmadığımız açıkça yazılmalı. */}
            <div className="space-y-2 text-[15px]">
              <p className="font-medium">Ne yapıyorum</p>
              <p className="text-sm text-muted-foreground">
                Yalnızca hangi uygulamanın ekranda olduğuna bakıyorum ve seçtiklerinin
                üstüne kendi ekranımı koyuyorum.
              </p>
              <p className="font-medium">Ne yapmıyorum</p>
              <p className="text-sm text-muted-foreground">
                İçeriğini okumuyorum, kaydetmiyorum, hiçbir yere göndermiyorum. Rabi'nin
                sunucusu yok; her şey telefonunda kalıyor.
              </p>
            </div>

            <IzinSatiri
              Simge={Eye}
              ad="Kullanım verisi erişimi"
              aciklama="Hangi uygulamanın açık olduğunu görmek için"
              verildi={durum.kullanimVerisi}
              onAc={() => izinAc('kullanimVerisi')}
            />
            <IzinSatiri
              Simge={Layers}
              ad="Diğer uygulamaların üzerine çizme"
              aciklama="Engel ekranını gösterebilmek için"
              verildi={durum.katman}
              onAc={() => izinAc('katman')}
            />

            {!durum.kullanimVerisi || !durum.katman ? (
              <Not tur="uyari">
                İzinler sistem ayarlarından veriliyor. Açtıktan sonra Rabi'ye geri dön;
                durum kendiliğinden güncellenir.
              </Not>
            ) : (
              <Not>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={14} aria-hidden /> İki izin de hazır.
                </span>
              </Not>
            )}
          </div>
        )}

        {adim === 2 && (
          <div>
            <UygulamaSecici secili={secili} onDegis={setSecili} />
            {secili.length === 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                En az bir uygulama seç; kilidin engelleyeceği başka bir şey yok.
              </p>
            )}
          </div>
        )}
      </Kart>

      <div className="mt-4 flex items-center gap-2">
        <Buton bicim="ikincil" className="flex-1" onClick={vazgec}>
          {adim === 0 ? 'Kullanmak istemiyorum' : 'Vazgeç'}
        </Buton>
        {adim < 2 ? (
          <Buton
            className="flex-1"
            onClick={() => setAdim((a) => a + 1)}
            disabled={adim === 1 && (!durum.kullanimVerisi || !durum.katman)}
          >
            {adim === 0 ? 'Kuralım' : 'Devam'}
            <ArrowRight size={18} aria-hidden />
          </Buton>
        ) : (
          <Buton className="flex-1" onClick={bitir} disabled={secili.length === 0}>
            <Check size={18} aria-hidden /> Bitir
          </Buton>
        )}
      </div>
    </div>
  )
}

function IzinSatiri({
  Simge,
  ad,
  aciklama,
  verildi,
  onAc,
}: {
  Simge: typeof Eye
  ad: string
  aciklama: string
  verildi: boolean
  onAc: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border p-3">
      <Simge size={20} className="shrink-0 text-primary" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium">{ad}</span>
        <span className="block text-xs text-muted-foreground">{aciklama}</span>
      </span>
      {verildi ? (
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
          <Check size={16} aria-hidden /> verildi
        </span>
      ) : (
        <Buton bicim="ikincil" boy="kucuk" onClick={onAc}>
          Aç
        </Buton>
      )}
    </div>
  )
}

const BASLIKLAR = ['Odak kilidi', 'İki izin gerekiyor', 'Hangi uygulamalar?']

const ACIKLAMALAR = [
  'Pomodoro çalışırken telefon seni bölmesin.',
  'İkisi de telefonunda kalır, hiçbir veri dışarı çıkmaz.',
  'Sayaç çalışırken bunları açmaya kalkarsan karşına çıkarım.',
]
