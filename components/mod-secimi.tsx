'use client'

/**
 * "Turu ayarla" penceresindeki mod seçimi (`tasarim/oyun-modu-secimi.dc.html`).
 *
 * Zorluk seçiminin (`zorluk-secimi.tsx`) üstünde duruyor çünkü sorduğu şey
 * daha büyük: zorluk soruların nereden geleceğini, mod turun nasıl işleyeceğini
 * belirliyor. Çip yerine 2×2 ızgara, çünkü her modun adı tek başına yetmiyor —
 * "Turbo"nun kaç saniye olduğu kutunun içinde yazmalı, kullanıcı seçmeden önce
 * bilmeli.
 *
 * Seçim bütün oyunlarda ortak ve saklanıyor (`ANAHTARLAR.oyunModu`): mod
 * turun nasıl işleyeceğini söylüyor, oyunun ne sorduğunu değil. Zorluk ise
 * oyun başına ayrı (`zorluk-secimi.tsx`) — o, oyunun sorduğu şeye ait.
 */

import { AlertTriangle, Clock, Moon, Zap } from 'lucide-react'
import { MODLAR, MOD_SIRASI, modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { cn } from '@/lib/utils'

/**
 * Kutudaki çizgi ikon.
 *
 * `ModTanimi.simge`deki emoji burada kullanılmıyor: tasarım çizgi ikon
 * istiyor ve emoji telefondan telefona başka çiziliyor — dört kutunun
 * dördü de aynı ailede olmalı. Emoji duruyor ve tur içindeki mod rozetinde
 * (`oyun-kabuk.tsx`) hâlâ o çiziliyor; orası tek bir simge, hizalanacak
 * kardeşi yok.
 */
const SIMGELER: Record<OyunModu, typeof Clock> = {
  siradan: Clock,
  turbo: Zap,
  'ani-olum': AlertTriangle,
  rahat: Moon,
}

export function ModSecimi({
  secili,
  onSec,
}: {
  secili: OyunModu
  onSec: (mod: OyunModu) => void
}) {
  return (
    <div>
      <BolumBasligi>Oyun modu</BolumBasligi>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        {MOD_SIRASI.map((mod) => {
          const tanim = MODLAR[mod]
          const Simge = SIMGELER[mod]
          const acik = mod === secili
          return (
            <button
              key={mod}
              type="button"
              onClick={() => onSec(mod)}
              aria-pressed={acik}
              className={cn(
                'flex min-h-[104px] flex-col gap-1.5 rounded-[18px] border-2 p-3.5 text-left transition active:brightness-95',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                acik
                  ? 'border-primary-dolu bg-primary-soft shadow-[0_10px_24px_-14px_rgba(180,71,31,0.9)]'
                  : 'border-border bg-muted/40',
              )}
            >
              <Simge size={19} strokeWidth={2.3} className="text-primary" aria-hidden />
              <span className="text-[15px] font-black leading-tight">{tanim.ad}</span>
              <span className="text-[11.5px] font-bold leading-snug text-muted-foreground">
                {tanim.ozet}
              </span>
            </button>
          )
        })}
      </div>

      {/* Seçilen modun kuralı tam olarak yazıyor: tur ortasında "bu neden
          bitti" diye sorulmasın. */}
      <p className="mt-2.5 text-[11.5px] leading-snug text-muted-foreground">
        {MODLAR[secili].kural}
      </p>

      {/*
        Kayıtsız mod seçildiği **anda** söyleniyor. Turun sonunda öğrenilen bir
        kural, o turu boşa harcatır.
      */}
      {!modKayitliMi(secili) && (
        <p className="mt-2 rounded-xl bg-warning-soft px-2.5 py-1.5 text-[11.5px] font-bold leading-snug text-warning">
          Bu turun rekoru ve istatistiği tutulmaz. Yanlışların yine Oyun
          Bankası’na düşer.
        </p>
      )}
    </div>
  )
}

/**
 * Pencerenin bölüm başlığı — küçük, aralıklı, büyük harf.
 *
 * Büyütme `uppercase` ile değil metnin kendisiyle de yapılabilirdi; sınıfla
 * yapılıyor çünkü Türkçe yerelde CSS doğru harfi veriyor (`lang="tr"`,
 * `app/layout.tsx`) ve "ı" noktasız "I" oluyor.
 */
function BolumBasligi({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11.5px] font-black uppercase leading-none tracking-[0.14em] text-muted-foreground">
      {children}
    </h2>
  )
}

export { BolumBasligi }
