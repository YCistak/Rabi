'use client'

import { ExternalLink, FileText } from 'lucide-react'
import { YASAL_BELGELER } from '@/lib/veri/yasal'
import { BaslikSatiri, Not } from '@/components/ui'

/**
 * Gizlilik ve Koşullar — yasal metinlere açılan kapı.
 *
 * Metinler bir süre uygulamanın içinde duruyordu (`lib/veri/yasal.ts` düz
 * metin, `public/gizlilik/` HTML) ve iki kopyanın birlikte güncellenmesi
 * gerekiyordu. Kopya kopyayı unutturuyor: bir alan eklenip sitede güncellenince
 * uygulamadaki metin eski kalıyordu ve Play'in "içerideki metin ile mağazadaki
 * bağlantı aynı şeyi söylemeli" şartı sessizce bozuluyordu. Şimdi her satır
 * tarayıcıda GitHub Pages'teki sayfayı açıyor; tek kaynak var.
 *
 * Bağlantılar düz `<a>`: Capacitor'ın WebView'i yabancı bir adrese gidilmek
 * istenince sayfayı kendi içinde yüklemiyor, sistem tarayıcısına veriyor
 * (`Bridge.launchIntent`). `target="_blank"` geliştirmedeki tarayıcı için —
 * orada uygulamanın sekmesi yerinde kalsın.
 */
export function YasalEkrani() {
  return (
    <div>
      <BaslikSatiri
        baslik="Gizlilik ve Koşullar"
        aciklama="Verinin nerede durduğu ve uygulamayı kullanma koşulları"
      />

      <ul className="space-y-2">
        {YASAL_BELGELER.map((belge) => (
          <li key={belge.id}>
            <a
              href={belge.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left transition active:bg-muted"
            >
              <FileText size={18} className="shrink-0 text-primary" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{belge.ad}</span>
                <span className="block text-xs text-muted-foreground">{belge.ozet}</span>
              </span>
              <ExternalLink size={16} className="shrink-0 text-muted-foreground/50" aria-hidden />
            </a>
          </li>
        ))}
      </ul>

      <Not className="mt-3">Sayfalar tarayıcıda açılır; internet bağlantısı gerekir.</Not>
    </div>
  )
}
