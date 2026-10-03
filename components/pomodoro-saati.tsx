'use client'

import { useEffect, useState } from 'react'
import { Pause } from 'lucide-react'
import type { PomodoroDurumu } from '@/components/ekranlar/pomodoro'
import { kalanSaniye } from '@/lib/pomodoro'

/**
 * Pomodoro ekranından çıkınca sağ altta duran saat.
 *
 * Tur bir süre ekrandan çıkınca bitiyordu: Pomodoro bileşeni sökülüyor,
 * sayaç ve yerli servis onunla gidiyordu; sahnenin geri oku da turu
 * duraklatıyordu. Kullanıcı Android'deki gibi turun sürmesini ve sayacın
 * uygulamanın sağ altında bir saat olarak görünmesini istedi. Bileşen artık
 * kalıcı (`AppShell`), bu saat de onun ekran dışındaki yüzü: dokununca
 * Pomodoro açılıyor, sayaç işliyorsa doğrudan sahneyle.
 *
 * Kalan süreyi bitiş zamanından **kendisi** sayıyor: Pomodoro her tikte
 * durum gönderseydi `AppShell` saniyede iki kez baştan çizilirdi.
 * Duraklatılmışsa donuk süre ve bir duraklat işareti.
 *
 * Yeri alt menünün hemen üstü, sağ kenar (tablette rayın solu). Hiçbir
 * ekranın sağ alt köşesinde basılması gereken bir şey yok; yapışkan
 * Başlat/Kaydet çubukları tam genişlik ve saat onlardan yüksekte.
 */
export function PomodoroSaati({ durum, onAc }: { durum: PomodoroDurumu; onAc: () => void }) {
  const [simdi, setSimdi] = useState(() => Date.now())

  useEffect(() => {
    if (durum.bitisZamani === null) return
    const zamanlayici = window.setInterval(() => setSimdi(Date.now()), 1000)
    return () => window.clearInterval(zamanlayici)
  }, [durum.bitisZamani])

  const kalan =
    durum.bitisZamani !== null ? kalanSaniye(durum.bitisZamani, simdi) : (durum.donukKalan ?? 0)
  const oran = durum.toplamSaniye > 0 ? Math.min(1, Math.max(0, 1 - kalan / durum.toplamSaniye)) : 0
  const dk = Math.floor(kalan / 60)
  const sn = kalan % 60
  const metin = `${dk}:${String(sn).padStart(2, '0')}`
  const duraklatildi = durum.bitisZamani === null

  const R = 27
  const cevre = 2 * Math.PI * R

  return (
    <button
      type="button"
      onClick={onAc}
      aria-label={`Pomodoro: ${durum.mola ? 'mola' : 'çalışma'}, ${dk} dakika ${sn} saniye kaldı${duraklatildi ? ', duraklatıldı' : ''}. Aç`}
      className="acilir-giris fixed right-4 bottom-[calc(5.75rem+var(--guvenli-alt))] z-40 grid size-[64px] place-items-center rounded-full bg-card shadow-[0_8px_22px_rgba(54,33,40,0.22)] transition active:scale-95 tablet:right-[calc(var(--ray)+var(--guvenli-sag)+1rem)] tablet:bottom-[calc(1.25rem+var(--guvenli-alt))]"
    >
      <svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="32" cy="32" r={R} fill="none" stroke="var(--muted)" strokeWidth="4" />
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke={durum.mola ? 'var(--success)' : 'var(--primary-parlak)'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={cevre}
          strokeDashoffset={cevre * (1 - oran)}
          style={{ transition: 'stroke-dashoffset 900ms linear' }}
        />
      </svg>
      <span className="relative flex flex-col items-center leading-none">
        <span className="rakam text-[14px] font-extrabold">{metin}</span>
        {duraklatildi ? (
          <Pause size={11} className="mt-1 text-muted-foreground" fill="currentColor" aria-hidden />
        ) : (
          <span className="mt-1 text-[8.5px] font-extrabold tracking-[0.1em] text-muted-foreground">
            {durum.mola ? 'MOLA' : 'ODAK'}
          </span>
        )}
      </span>
    </button>
  )
}
