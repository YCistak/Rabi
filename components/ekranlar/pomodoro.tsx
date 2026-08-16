'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { KeepAwake } from '@capacitor-community/keep-awake'
import { Capacitor } from '@capacitor/core'
import { Music, Pause, Play, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react'
import type { PomodoroAyar, PomodoroSeans, SesSecimi } from '@/lib/types'
import {
  ASAMA_ADI,
  asamaSuresi,
  ilerlemeOrani,
  kalanSaniye,
  sonrakiAsama,
  sureYaz,
  type Asama,
} from '@/lib/pomodoro'
import { SesCalar, URETILEN_SESLER } from '@/lib/ses'
import { LOFI_PARCALAR } from '@/lib/lofi'
import { CALISMA_DERSLERI } from '@/lib/dersler'
import { pomodoroIptal, pomodoroPlanla } from '@/lib/bildirim'
import { cn, yeniId } from '@/lib/utils'
import { BaslikSatiri, Buton, Cip, Kart, Not } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

export function PomodoroEkrani({
  ayar,
  setAyar,
  onSeansBitti,
}: {
  ayar: PomodoroAyar
  setAyar: (guncelleyici: PomodoroAyar | ((onceki: PomodoroAyar) => PomodoroAyar)) => void
  onSeansBitti: (seans: PomodoroSeans) => void
}) {
  const [asama, setAsama] = useState<Asama>('calisma')
  const [tur, setTur] = useState(1)
  const [ders, setDers] = useState<string | null>(null)
  const [bitisZamani, setBitisZamani] = useState<number | null>(null)
  const [kalan, setKalan] = useState(ayar.calisma * 60)
  const [sesPaneli, setSesPaneli] = useState(false)

  const calarRef = useRef<SesCalar | null>(null)
  const baslangicRef = useRef<string | null>(null)

  const toplamDakika = asamaSuresi(asama, ayar)
  const calisiyor = bitisZamani !== null

  const calarAl = useCallback(() => {
    if (!calarRef.current) calarRef.current = new SesCalar()
    return calarRef.current
  }, [])

  // Bileşen sökülürken ses ve ekran kilidi bırakılmalı, yoksa arka planda kalır.
  useEffect(() => {
    return () => {
      calarRef.current?.kapat()
      calarRef.current = null
      if (Capacitor.isNativePlatform()) void KeepAwake.allowSleep().catch(() => {})
      void pomodoroIptal()
    }
  }, [])

  const asamayiBitir = useCallback(() => {
    const calar = calarAl()
    calar.durdur()
    calar.zilCal()
    void pomodoroIptal()

    if (asama === 'calisma') {
      onSeansBitti({
        id: yeniId(),
        baslangic: baslangicRef.current ?? new Date().toISOString(),
        dakika: ayar.calisma,
        ders: ders ?? undefined,
      })
      const yeniAsama = sonrakiAsama('calisma', tur, ayar)
      setAsama(yeniAsama)
      setKalan(asamaSuresi(yeniAsama, ayar) * 60)
    } else {
      setTur((t) => t + 1)
      setAsama('calisma')
      setKalan(ayar.calisma * 60)
    }

    setBitisZamani(null)
    baslangicRef.current = null
  }, [asama, ayar, calarAl, ders, onSeansBitti, tur])

  // Sayaç: hedef zaman damgasından okunuyor, saniye saymıyor.
  useEffect(() => {
    if (bitisZamani === null) return

    const guncelle = () => {
      const yeni = kalanSaniye(bitisZamani)
      setKalan(yeni)
      if (yeni <= 0) asamayiBitir()
    }

    guncelle()
    const zamanlayici = window.setInterval(guncelle, 500)

    // Uygulama arka plandan dönünce sayaç anında doğru değere sıçrasın.
    const gorunurluk = () => document.visibilityState === 'visible' && guncelle()
    document.addEventListener('visibilitychange', gorunurluk)

    return () => {
      window.clearInterval(zamanlayici)
      document.removeEventListener('visibilitychange', gorunurluk)
    }
  }, [bitisZamani, asamayiBitir])

  const baslat = () => {
    const bitis = Date.now() + kalan * 1000
    setBitisZamani(bitis)
    baslangicRef.current = new Date().toISOString()

    const calar = calarAl()
    calar.sesSeviyesi(ayar.sesSeviyesi)
    calar.cal(ayar.ses)

    void pomodoroPlanla(bitis, asama !== 'calisma')
    if (ayar.ekraniAcikTut && Capacitor.isNativePlatform()) {
      void KeepAwake.keepAwake().catch(() => {})
    }
  }

  const duraklat = () => {
    setBitisZamani(null)
    calarRef.current?.durdur()
    void pomodoroIptal()
    if (Capacitor.isNativePlatform()) void KeepAwake.allowSleep().catch(() => {})
  }

  const sifirla = () => {
    duraklat()
    setKalan(toplamDakika * 60)
    baslangicRef.current = null
  }

  const atla = () => {
    duraklat()
    // Atlanan çalışma turu seans olarak sayılmaz — sayacı doldurmadan geçildi.
    const yeniAsama =
      asama === 'calisma' ? sonrakiAsama('calisma', tur, ayar) : ('calisma' as Asama)
    if (asama !== 'calisma') setTur((t) => t + 1)
    setAsama(yeniAsama)
    setKalan(asamaSuresi(yeniAsama, ayar) * 60)
  }

  const sesSec = (secim: SesSecimi) => {
    setAyar((o) => ({ ...o, ses: secim }))
    const calar = calarAl()
    calar.sesSeviyesi(ayar.sesSeviyesi)
    // Ses seçimi çalışırken değişirse anında geçilir; duraklatılmışsa sessiz kalır.
    if (calisiyor) calar.cal(secim)
  }

  const oran = bitisZamani !== null ? ilerlemeOrani(bitisZamani, toplamDakika) : 0
  const molaMi = asama !== 'calisma'

  return (
    <div>
      <BaslikSatiri baslik="Pomodoro" aciklama={`${tur}. tur · ${ASAMA_ADI[asama]}`} />

      <Kart className="mb-4 flex flex-col items-center py-6">
        <Sayac kalan={kalan} oran={oran} mola={molaMi} />

        <Rabi
          durum={calisiyor ? (molaMi ? 'mutlu' : 'calisiyor') : 'uykulu'}
          boyut={72}
          className="mt-4"
        />

        <div className="mt-4 flex items-center gap-2">
          <Buton bicim="ikincil" boy="simge" onClick={sifirla} aria-label="Sıfırla">
            <RotateCcw size={18} aria-hidden />
          </Buton>
          <Buton className="min-w-36" onClick={calisiyor ? duraklat : baslat}>
            {calisiyor ? (
              <>
                <Pause size={18} aria-hidden /> Duraklat
              </>
            ) : (
              <>
                <Play size={18} aria-hidden /> Başlat
              </>
            )}
          </Buton>
          <Buton bicim="ikincil" boy="simge" onClick={atla} aria-label="Bu aşamayı atla">
            <SkipForward size={18} aria-hidden />
          </Buton>
        </div>
      </Kart>

      {!calisiyor && asama === 'calisma' && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium">Hangi derse çalışıyorsun?</p>
          <div className="flex flex-wrap gap-2">
            {CALISMA_DERSLERI.slice(0, 8).map((d) => (
              <Cip key={d} secili={ders === d} onClick={() => setDers(ders === d ? null : d)}>
                {d}
              </Cip>
            ))}
          </div>
        </div>
      )}

      <Kart className="mb-4 p-0">
        <button
          type="button"
          onClick={() => setSesPaneli((a) => !a)}
          className="flex w-full items-center gap-3 p-4 text-left"
        >
          {ayar.ses === 'yok' ? (
            <VolumeX size={18} className="shrink-0 text-muted-foreground" aria-hidden />
          ) : (
            <Volume2 size={18} className="shrink-0 text-primary" aria-hidden />
          )}
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">Ses</span>
            <span className="block truncate text-xs text-muted-foreground">
              {sesAdi(ayar.ses)}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">{sesPaneli ? 'Kapat' : 'Değiştir'}</span>
        </button>

        {sesPaneli && (
          <div className="border-t border-border p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Ortam sesi</p>
            <div className="mb-4 flex flex-wrap gap-2">
              <Cip secili={ayar.ses === 'yok'} onClick={() => sesSec('yok')}>
                Sessiz
              </Cip>
              {URETILEN_SESLER.map((s) => (
                <Cip key={s.id} secili={ayar.ses === s.id} onClick={() => sesSec(s.id)}>
                  {s.ad}
                </Cip>
              ))}
            </div>

            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Music size={13} aria-hidden />
              Lo-fi
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {LOFI_PARCALAR.map((p) => (
                <Cip
                  key={p.dosya}
                  secili={ayar.ses === `lofi:${p.dosya}`}
                  onClick={() => sesSec(`lofi:${p.dosya}`)}
                >
                  {p.ad}
                </Cip>
              ))}
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Ses seviyesi
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(ayar.sesSeviyesi * 100)}
                onChange={(e) => {
                  const deger = Number(e.target.value) / 100
                  setAyar((o) => ({ ...o, sesSeviyesi: deger }))
                  calarRef.current?.sesSeviyesi(deger)
                }}
                className="w-full accent-[var(--primary)]"
              />
            </label>

            <p className="mt-3 text-xs text-muted-foreground">
              Ortam sesleri koddan üretiliyor, dosya yok. Lo-fi parçalar kamu malı (CC0);
              biri bitince sıradaki başlar.
            </p>
          </div>
        )}
      </Kart>

      <SureAyarlari ayar={ayar} setAyar={setAyar} kilitli={calisiyor} />

      <Not className="mt-4">
        Sayaç bitiş saatine göre çalışıyor — telefonu kilitlesen de doğru zamanda biter ve
        bildirim gelir. Bildirim gelmiyorsa telefonun pil ayarlarından Rabi'yi kısıtlamadan
        çıkarman gerekebilir.
      </Not>
    </div>
  )
}

function Sayac({ kalan, oran, mola }: { kalan: number; oran: number; mola: boolean }) {
  const boyut = 220
  const kalinlik = 12
  const yaricap = (boyut - kalinlik) / 2
  const cevre = 2 * Math.PI * yaricap

  return (
    <div className="relative" style={{ width: boyut, height: boyut }}>
      <svg width={boyut} height={boyut} className="-rotate-90">
        <circle
          cx={boyut / 2}
          cy={boyut / 2}
          r={yaricap}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={kalinlik}
        />
        <circle
          cx={boyut / 2}
          cy={boyut / 2}
          r={yaricap}
          fill="none"
          stroke={mola ? 'var(--ikincil)' : 'var(--primary)'}
          strokeWidth={kalinlik}
          strokeLinecap="round"
          strokeDasharray={cevre}
          strokeDashoffset={cevre * (1 - oran)}
          className="transition-[stroke-dashoffset] duration-500 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rakam font-display text-5xl font-semibold tabular-nums">
          {sureYaz(kalan)}
        </span>
      </div>
    </div>
  )
}

function SureAyarlari({
  ayar,
  setAyar,
  kilitli,
}: {
  ayar: PomodoroAyar
  setAyar: (guncelleyici: PomodoroAyar | ((onceki: PomodoroAyar) => PomodoroAyar)) => void
  kilitli: boolean
}) {
  const alanlar: { anahtar: keyof PomodoroAyar; etiket: string; secenekler: number[] }[] = [
    { anahtar: 'calisma', etiket: 'Çalışma', secenekler: [15, 25, 30, 45, 50] },
    { anahtar: 'kisaMola', etiket: 'Kısa mola', secenekler: [3, 5, 10] },
    { anahtar: 'uzunMola', etiket: 'Uzun mola', secenekler: [15, 20, 30] },
    { anahtar: 'turSayisi', etiket: 'Uzun moladan önce', secenekler: [2, 3, 4, 5] },
  ]

  return (
    <Kart>
      <p className="mb-3 font-medium">Süreler</p>
      <div className={cn('space-y-3', kilitli && 'pointer-events-none opacity-50')}>
        {alanlar.map(({ anahtar, etiket, secenekler }) => (
          <div key={anahtar}>
            <p className="mb-1.5 text-xs text-muted-foreground">
              {etiket}
              {anahtar === 'turSayisi' ? ' (tur)' : ' (dakika)'}
            </p>
            <div className="flex flex-wrap gap-2">
              {secenekler.map((deger) => (
                <Cip
                  key={deger}
                  secili={ayar[anahtar] === deger}
                  onClick={() => setAyar((o) => ({ ...o, [anahtar]: deger }))}
                >
                  {deger}
                </Cip>
              ))}
            </div>
          </div>
        ))}

        <label className="flex items-center justify-between gap-3 pt-1">
          <span className="text-sm">
            Çalışırken ekran açık kalsın
            <span className="block text-xs text-muted-foreground">
              Pili daha hızlı tüketir
            </span>
          </span>
          <input
            type="checkbox"
            checked={ayar.ekraniAcikTut}
            onChange={(e) => setAyar((o) => ({ ...o, ekraniAcikTut: e.target.checked }))}
            className="h-5 w-5 shrink-0 accent-[var(--primary)]"
          />
        </label>
      </div>

      {kilitli && (
        <p className="mt-3 text-xs text-muted-foreground">
          Süreleri değiştirmek için sayacı duraklat.
        </p>
      )}
    </Kart>
  )
}

function sesAdi(secim: SesSecimi): string {
  if (secim === 'yok') return 'Sessiz'
  const uretilen = URETILEN_SESLER.find((s) => s.id === secim)
  if (uretilen) return uretilen.ad
  const parca = LOFI_PARCALAR.find((p) => `lofi:${p.dosya}` === secim)
  return parca ? `Lo-fi · ${parca.ad}` : 'Sessiz'
}
