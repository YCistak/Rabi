'use client'

/**
 * "Turu ayarla" penceresindeki zorluk seçimi
 * (`tasarim/oyun-modu-secimi.dc.html`).
 *
 * Sorduğu şey turun **başlangıcı**, tamamı değil: seviye tur içinde cevaplara
 * göre kaymaya devam ediyor (`lib/oyunlar/uyum.ts`). Bir süre seçim hiç yoktu
 * ve herkes ortadan başlıyordu; seviyesini bilen oyuncu her turda üç soru
 * boyunca ısınmak zorunda kalıyordu. Bir süre de yalnızca seçim vardı ve
 * seçim tur boyunca donuyordu — kolayda on doğru yapana oyun kolay soru
 * vermeye devam ediyordu. İkisi birlikte: seçim nereden, uyum nereye.
 *
 * Bu yüzden altındaki cümle "bu tur hep kolay olacak" demiyor. Kullanıcıya
 * söylenen şey başlangıç; kaymanın kendisi söylenmiyor (gerekçesi `uyum.ts`).
 *
 * Seçim oyun başına saklanıyor (`ANAHTARLAR.oyunZorlugu`): biri edebiyatta
 * kolayda kalırken sesi zorda oynayabiliyor.
 *
 * Mod ızgarasından farklı olarak burası **şeritli seçici**: üç seviye tek bir
 * eksende sıralı ve ızgara o sıralamayı anlatmıyordu. Kayan gösterge de bunun
 * için — seçim değişince nereden nereye gidildiği görünüyor.
 */

import { ZORLUKLAR, ZORLUK_ADI, type Zorluk } from '@/lib/oyunlar/ritim'
import { BolumBasligi } from '@/components/mod-secimi'
import { cn } from '@/lib/utils'

/** Seviyenin ne demek olduğu — çipin adı tek başına "kime göre" sorusunu bırakıyor. */
const ACIKLAMA: Record<Zorluk, string> = {
  kolay: 'Temel sorularla başlar.',
  orta: 'Sınavda en sık çıkan seviyeden başlar.',
  zor: 'En zor sorularla başlar.',
}

export function ZorlukSecimi({
  secili,
  onSec,
}: {
  secili: Zorluk
  onSec: (zorluk: Zorluk) => void
}) {
  const sira = ZORLUKLAR.indexOf(secili)

  return (
    <div>
      <BolumBasligi>Başlangıç zorluğu</BolumBasligi>

      <div className="relative mt-2.5 flex rounded-[18px] border-2 border-border bg-muted/40 p-1.5">
        {/*
          Kayan gösterge, iki katman: dıştaki **ray** düğmelerin kapladığı
          alanın aynısı (`inset-1.5`, yani şeridin dolgusu kadar içeride),
          içteki gösterge o rayın tam üçte biri.

          Ray olmadan da yazılabilirdi — `calc((100% - 0.75rem) / 3)` — ve bir
          süre öyleydi: yüzde şeridin dolgu kutusuna göre çözülüyor, ondan
          dolguyu elle çıkarmak gerekiyor ve kalan üçe bölününce her adımda
          yarım piksellik bir kayma birikiyordu. Üçüncü seviyede gösterge
          şeridin sağ kenarına yapışıyordu. Rayla birlikte `w-1/3` tam üçte
          bir oluyor, çıkarma da kalmıyor.

          Genişlik değil `transform` oynatılıyor: genişlik her karede yeniden
          yerleşim demek ve üstündeki üç yazı da her karede yeniden ölçülürdü
          (tur çubuğuyla aynı kural).

          `pointer-events-none` şart — göstergenin altındaki düğme tıklanabilir
          kalmalı, yoksa seçili seviyeye yeniden dokunmak işlemezdi.
        */}
        <span aria-hidden className="pointer-events-none absolute inset-1.5">
          <span
            className="zorluk-gostergesi block h-full w-1/3 rounded-[13px] bg-primary-dolu shadow-[0_8px_18px_-8px_rgba(180,71,31,0.8)]"
            style={{ transform: `translateX(${sira * 100}%)` }}
          />
        </span>

        {ZORLUKLAR.map((zorluk) => (
          <button
            key={zorluk}
            type="button"
            onClick={() => onSec(zorluk)}
            aria-pressed={zorluk === secili}
            className={cn(
              'relative min-h-12 flex-1 text-[14px] font-black transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              zorluk === secili ? 'text-white' : 'text-muted-foreground',
            )}
          >
            {ZORLUK_ADI[zorluk]}
          </button>
        ))}
      </div>

      <p className="mt-2.5 text-[11.5px] leading-snug text-muted-foreground">{ACIKLAMA[secili]}</p>
    </div>
  )
}
