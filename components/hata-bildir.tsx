'use client'

/**
 * "Bu soru hatalı" düğmesi.
 *
 * İki yerde kullanılıyor: tur sonundaki yanlış kartları ve Oyun Bankası
 * kayıtları. İkisi de süresiz ekranlar — tur **içinde** bildirim yok, çünkü
 * orada süre işliyor ve geri bildirim şeridi yalnızca bir saniye duruyor;
 * yanlış dokunuş puana mal olurdu.
 *
 * Tek dokunuş yeter: bayrağa basıldığı anda bildirim kaydediliyor ve gönderim
 * kuyruğuna giriyor. Altında açılan sebep çipleri isteğe bağlı — ikinci bir
 * adım şart koşulsaydı hiç bildirim gelmezdi.
 */

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { SECILEBILIR_SEBEPLER, SEBEP_ADI, type HataBildirimi, type HataSebebi } from '@/lib/hata-bildirimi'
import type { BankaSorusu } from '@/lib/oyunlar/banka'
import { bankaKimligi } from '@/lib/oyunlar/banka'
import { cn } from '@/lib/utils'

/** Bildirim özelliğinin ekranlara inen kolu; AppShell'den prop olarak geçiyor. */
export interface BildirimKolu {
  bildirimler: HataBildirimi[]
  /** Günlük sınır dolduysa yeni bildirim kaydedilmiyor. */
  sinirda: boolean
  onBildir: (soru: BankaSorusu) => void
  onSebep: (kimlik: string, sebep: HataSebebi) => void
}

export function BildirimDugmesi({ soru, kol }: { soru: BankaSorusu; kol: BildirimKolu }) {
  const kimlik = bankaKimligi(soru)
  const kayit = kol.bildirimler.find((b) => b.kimlik === kimlik)
  const bildirildi = kayit !== undefined
  // Bildirdikten hemen sonra çipler açılıyor: sebep bir dokunuş uzakta dursun.
  const [acik, setAcik] = useState(false)
  const [reddedildi, setReddedildi] = useState(false)

  const bas = () => {
    if (bildirildi) {
      setAcik((a) => !a)
      return
    }
    if (kol.sinirda) {
      setReddedildi(true)
      return
    }
    kol.onBildir(soru)
    setAcik(true)
  }

  return (
    <div className="mt-2 border-t border-border pt-2">
      <button
        type="button"
        onClick={bas}
        aria-pressed={bildirildi}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-extrabold transition active:scale-[0.97]',
          bildirildi
            ? 'bg-ikincil-soft text-ikincil'
            : 'bg-foreground/[0.06] text-muted-foreground active:bg-foreground/12',
        )}
      >
        <Flag size={13} className="shrink-0" fill={bildirildi ? 'currentColor' : 'none'} aria-hidden />
        {bildirildi ? 'Bildirildi' : 'Bu soru hatalı'}
      </button>

      {reddedildi && !bildirildi && (
        <p className="mt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
          Bugünlük bildirim sınırına ulaştın. Yarın yeniden bildirebilirsin.
        </p>
      )}

      {bildirildi && acik && (
        <div className="mt-2">
          <p className="text-[11px] font-bold text-muted-foreground">
            Nesi hatalı? (isteğe bağlı)
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {SECILEBILIR_SEBEPLER.map((sebep) => {
              const secili = kayit.sebep === sebep
              return (
                <button
                  key={sebep}
                  type="button"
                  onClick={() => kol.onSebep(kimlik, sebep)}
                  aria-pressed={secili}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[11.5px] font-bold transition active:scale-[0.97]',
                    secili
                      ? 'bg-ikincil text-white'
                      : 'bg-foreground/[0.06] text-muted-foreground active:bg-foreground/12',
                  )}
                >
                  {SEBEP_ADI[sebep]}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
