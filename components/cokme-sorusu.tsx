'use client'

import { Bug } from 'lucide-react'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { useGeriKatmani } from '@/lib/geri'
import type { CokmeKolu } from '@/lib/cokme-izni'

/**
 * Çökmeden sonra çıkan rapor sorusu.
 *
 * Crashlytics'in otomatik gönderimi hiç açık değil: çökme cihazda saklanıyor
 * ve uygulama yeniden açıldığında burası soruyor. Soru soyut bir ayar değil,
 * gerçekten olmuş bir olayın karşılığı — kullanıcı neye izin verdiğini
 * biliyor.
 *
 * `OdakDaveti` ile aynı dil, ama **kısa**: kullanıcı az önce uygulaması
 * çökerken bir işi yarıda kalmış biri; onu okumaya zorlamak yanlış olur.
 * Gönderilecek şeyler yine tek tek yazılı, çünkü Play'in kullanıcı verisi
 * politikası veri çıkmadan önce belirgin açıklama istiyor.
 *
 * Geri tuşu "Gönderme" ile aynı: kapanan pencere veri göndermemeli.
 */
export function CokmeSorusu({ kol }: { kol: CokmeKolu }) {
  useGeriKatmani(kol.soruAcik, kol.onGonderme)

  if (!kol.soruAcik) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-5 pt-[calc(1rem+var(--guvenli-ust))] pb-[calc(1rem+var(--guvenli-alt))]">
      <div className="flex max-h-full w-full max-w-[340px] flex-col overflow-hidden rounded-[26px] bg-card golge-kart">
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-1 text-center">
          <Rabi durum="uzgun" boyut={92} className="mx-auto" />

          <h2 className="mt-2 font-display text-[20px] font-extrabold leading-tight tracking-tight text-balance">
            {kol.cokmeyleBitti ? 'Kusura bakma, kapandım' : 'Bir aksaklık kaydettim'}
          </h2>
          <p className="mt-1.5 text-[13.5px] font-medium leading-snug text-muted-foreground">
            {kol.cokmeyleBitti
              ? 'Geçen sefer beklenmedik şekilde kapandım. Neden olduğunu ancak raporu görürsem bulabilirim.'
              : 'Bir şeyler ters gitti ama kapanmadım. Raporu görürsem düzeltebilirim.'}
          </p>

          <div className="mt-4 rounded-xl bg-foreground/[0.05] p-3 text-left">
            <p className="flex items-center gap-1.5 text-[12px] font-extrabold">
              <Bug size={14} aria-hidden />
              Gönderilecekler
            </p>
            <ul className="mt-1.5 list-disc pl-4 text-[11.5px] font-medium leading-snug text-muted-foreground">
              <li>hatanın uygulamanın hangi satırında olduğu</li>
              <li>telefonunun modeli ve Android sürümü</li>
              <li>uygulama sürümü</li>
            </ul>
            <p className="mt-1.5 text-[11.5px] font-medium leading-snug text-muted-foreground">
              Adın, netlerin, notların ve fotoğrafların <b>gönderilmez</b>.
              &ldquo;Gönderme&rdquo; dersen rapor telefonundan silinir.
            </p>
          </div>
        </div>

        <div className="flex flex-none gap-2 px-5 pb-5 pt-3">
          <Buton
            className="h-12 flex-1 rounded-full bg-foreground/[0.08] text-[14px] text-muted-foreground"
            onClick={kol.onGonderme}
          >
            Gönderme
          </Buton>
          <Buton className="h-12 flex-1 rounded-full text-[14px]" onClick={kol.onGonder}>
            Gönder
          </Buton>
        </div>
      </div>
    </div>
  )
}
