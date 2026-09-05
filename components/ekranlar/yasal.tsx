'use client'

import { useState } from 'react'
import { ArrowLeft, ChevronRight, FileText } from 'lucide-react'
import {
  YASAL_BELGELER,
  belgeHazirMi,
  type YasalBelge,
  type YasalBelgeId,
} from '@/lib/veri/yasal'
import { BaslikSatiri, Buton, Kart, Not } from '@/components/ui'

/**
 * Gizlilik ve Koşullar — yasal metinlerin tek kapısı.
 *
 * Bu metinler bir süre Ayarlar'ın içinde, "Hatalı soru bildirimi" ve "Çökme
 * raporları" başlıklı iki bölümde duruyordu. Yeri yanlıştı: ikisi de bir ayar
 * değil, bir açıklamaydı — anahtarları kalkınca geriye ayar listesinin
 * ortasında duran iki paragraf kaldı ve ayarını arayan kullanıcının önüne
 * gizlilik metni çıkıyordu. Ayrı bir ekran ikisini de doğru yere koyuyor:
 * ayarlar kısalıyor, metinler de mağazadaki gizlilik politikasıyla aynı yerde
 * toplanıyor.
 *
 * Ekran iki kademeli: önce belge listesi, sonra seçilen belgenin kendisi.
 * Üçünü alt alta sermek, aradığı cümleyi arayan kullanıcıyı üç metin boyunca
 * kaydırmaya zorlardı.
 */
export function YasalEkrani() {
  const [acikId, setAcikId] = useState<YasalBelgeId | null>(null)
  const acik = YASAL_BELGELER.find((b) => b.id === acikId) ?? null

  if (acik) return <Belge belge={acik} onGeri={() => setAcikId(null)} />

  return (
    <div>
      <BaslikSatiri
        baslik="Gizlilik ve Koşullar"
        aciklama="Verinin nerede durduğu ve uygulamayı kullanma koşulları"
      />

      <ul className="space-y-2">
        {YASAL_BELGELER.map((belge) => (
          <li key={belge.id}>
            <button
              type="button"
              onClick={() => setAcikId(belge.id)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left transition active:bg-muted"
            >
              <FileText size={18} className="shrink-0 text-primary" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{belge.ad}</span>
                <span className="block text-xs text-muted-foreground">{belge.ozet}</span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-muted-foreground/50" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Belge({ belge, onGeri }: { belge: YasalBelge; onGeri: () => void }) {
  return (
    <div>
      {/* Kendi geri düğmesi: dıştaki geri ekranı tümüyle kapatıyor ve
          okunan metinden çıkan kullanıcı listeye değil ayarlara düşerdi. */}
      <Buton bicim="hayalet" boy="kucuk" onClick={onGeri} className="-ml-2 mb-3">
        <ArrowLeft size={16} aria-hidden /> Belgeler
      </Buton>

      <BaslikSatiri
        baslik={belge.ad}
        aciklama={belge.yururlukTarihi ? `Yürürlük: ${tarihYaz(belge.yururlukTarihi)}` : undefined}
      />

      {belgeHazirMi(belge) ? (
        <Kart className="space-y-4">
          {belge.bolumler.map((bolum, sira) => (
            // Bölümlerin kimliği yok ve olması da gerekmiyor: liste sabit,
            // sıralanmıyor ve içine bir şey eklenip çıkarılmıyor.
            <section key={sira} className="space-y-2">
              {bolum.baslik && (
                <h2 className="font-display text-base font-extrabold tracking-tight">
                  {bolum.baslik}
                </h2>
              )}
              {bolum.paragraflar.map((paragraf, p) => (
                <p key={p} className="text-sm leading-relaxed text-muted-foreground">
                  {paragraf}
                </p>
              ))}
            </section>
          ))}
        </Kart>
      ) : (
        <Not>Bu metin hazırlanıyor; uygulamanın bir sonraki sürümünde burada olacak.</Not>
      )}
    </div>
  )
}

/** "2026-09-06" → "6 Eylül 2026". */
function tarihYaz(iso: string): string {
  const tarih = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(tarih.getTime())) return iso
  return tarih.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}
