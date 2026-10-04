import { cn } from '@/lib/utils'

import { pozGorseli, type MaskotDurumu, type MaskotPozu } from '@/lib/maskot'

/*
  Durum ve poz listesi `lib/maskot.ts`te. İkisinin ayrı kalması bilerek:
  ifadeli görseller geldiğinde durumu doğrudan dosyaya bağlamak denendi ve
  bir ekranın görselini başka bir ekranın durumuna bağlıyordu (kurulumda
  adımdan adıma uçan tavşan). Poz eklemek: kaynağı `assets/maskot/`a koy,
  `scripts/maskot-uret.mjs`e ve `MASKOT_POZLARI`na ekle.
*/
export type { MaskotDurumu, MaskotPozu }

type Props = {
  durum?: MaskotDurumu
  poz?: MaskotPozu
  /** Piksel cinsinden genişlik; yükseklik oranla belirlenir. */
  boyut?: number
  className?: string
  /**
   * Ekran okuyucu etiketi; verilmezse durumdan türüyor. Ana sayfa başlığı
   * gibi durumu daha ince anlatan yerler için ("uyuyor", "dans ediyor").
   */
  etiket?: string
}

/**
 * Rabi — uygulamanın tavşan maskotu.
 *
 * Önce tema değişkenleriyle boyanan bir SVG'ydi. Beyaz temaya geçince kürk de
 * zemin de neredeyse beyaz kaldı ve siluet kayboldu; kontur eklemek çözdü ama
 * çizim uygulamanın geri kalanının yanında hâlâ yabancı duruyordu. Sonra
 * emojinin (🐰) kendisi bir PNG olarak kullanıldı — o da uygulamaya ait
 * değildi, telefonun yazı tipinden gelen bir simgeydi. Şimdi maskotun kendi
 * çizimleri var (`scripts/maskot-uret.mjs`).
 *
 * Yükseklik 130/120 oranında: eski SVG'nin kutusu bu ölçüdeydi ve on beş
 * ekranın yerleşimi ona göre kurulmuştu. Kare görsel `object-contain` ile bu
 * kutunun içine oturuyor, hiçbir ekranda boşluk kaymıyor.
 */
export function Rabi({
  durum = 'normal',
  poz = 'yuz',
  boyut = 96,
  className,
  etiket,
}: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={pozGorseli(poz)}
      width={boyut}
      height={(boyut * 130) / 120}
      style={{
        width: boyut,
        height: (boyut * 130) / 120,
      }}
      className={cn('shrink-0 object-contain', className)}
      alt={`Rabi — ${etiket ?? DURUM_ETIKETI[durum]}`}
      // Maskot her ekranda var: geciktirmek ekranlar arasında geçerken bir
      // kare boş yer bırakıyordu. Pozlar ayrı dosyalar ama her biri yetmiş
      // kilobaytın altında ve ilk gösterimden sonra önbellekten geliyor.
      loading="eager"
      decoding="async"
      draggable={false}
      /*
        Poz görseli yoksa yüze düşülüyor.

        Maskot birden çok dosyaya bölündü ve biri eksik kalırsa tarayıcı kırık
        görsel simgesi çiziyor: ekranın ortasında duran bir maskot için bu,
        eksik bir dosyadan çok bozuk bir uygulama gibi görünüyor.
      */
      onError={(olay) => {
        const img = olay.currentTarget
        const yuz = pozGorseli('yuz')
        if (img.src.endsWith(yuz)) return
        img.src = yuz
      }}
    />
  )
}

const DURUM_ETIKETI: Record<MaskotDurumu, string> = {
  normal: 'selam veriyor',
  mutlu: 'seviniyor',
  uykulu: 'uyukluyor',
  calisiyor: 'çalışıyor',
  uzgun: 'üzgün',
  kutlama: 'kutluyor',
}
