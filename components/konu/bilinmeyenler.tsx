'use client'

import { useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { KONU_DERSLERI, dersBul, type KonuDersId } from '@/lib/konu'
import { bankaDagilimi, type BilinmeyenKart } from '@/lib/konu/ilerleme'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Kart } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

/**
 * Bilmediklerim — kartın "bilmiyorum" denen hâlinin durduğu yer.
 *
 * **Şu an hiçbir yerden açılmıyor.** Deste karar sormayı bıraktı
 * (`kart-destesi.tsx`), yani listeye yeni kayıt düşmüyor ve haritanın
 * tepesindeki giriş kaldırıldı; o köşe başka bir iş için ayrıldı. Dosya
 * duruyor çünkü kayıtlar ve depo anahtarı da duruyor — liste yeniden
 * açılacaksa yeniden yazılacak bir ekran değil.
 *
 * Liste bir okuma listesi, bir borç listesi değil: kartın metni burada
 * **açık** duruyor, açılıp kapanan bir başlık değil. Kullanıcı buraya
 * öğrenmek için geliyor; bilgiyi ikinci bir dokunuşun arkasına saklamak
 * listeyi hiç açılmaz hâle getiriyordu.
 *
 * Kayıt yalnızca elle düşüyor ("Öğrendim"). Otomatik bir düşme ölçütü
 * (görüntülenme, süre) kullanıcının öğrendiğini değil listeyi kaydırdığını
 * ölçerdi.
 */
export function BilinmeyenlerEkrani({
  banka,
  onSil,
  onKapat,
}: {
  banka: BilinmeyenKart[]
  onSil: (id: string) => void
  onKapat: () => void
}) {
  const [suzgec, setSuzgec] = useState<KonuDersId | 'tumu'>('tumu')
  useGeriKatmani(true, onKapat)

  const dagilim = useMemo(() => bankaDagilimi(banka), [banka])
  const gosterilen = useMemo(
    () => (suzgec === 'tumu' ? banka : banka.filter((k) => k.ders === suzgec)),
    [banka, suzgec],
  )

  // Süzgeç şeridinde yalnızca kaydı olan dersler duruyor: boş bir çip,
  // dokunulunca boş liste gösteren bir düğmedir.
  const doluDersler = KONU_DERSLERI.filter((d) => (dagilim[d.id] ?? 0) > 0)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <header className="shrink-0 bg-primary-soft px-4 pb-3 pt-[calc(0.75rem+var(--guvenli-ust))]">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[19px] font-extrabold tracking-tight">
              Bilmediklerim
            </h2>
            <p className="text-xs font-semibold text-muted-foreground">
              {banka.length === 0
                ? 'Henüz kart eklemedin'
                : `${banka.length} kart · okudukça çıkar`}
            </p>
          </div>
          <button
            type="button"
            onClick={onKapat}
            aria-label="Kapat"
            className="-mr-1 grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition active:bg-black/5"
          >
            <X size={19} strokeWidth={2.6} aria-hidden />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(2rem+var(--guvenli-alt))] pt-3">
        <div className="mx-auto max-w-md">
          {doluDersler.length > 1 && (
            <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1">
              <Cip ad="Tümü" sayi={banka.length} secili={suzgec === 'tumu'} onSec={() => setSuzgec('tumu')} />
              {doluDersler.map((ders) => (
                <Cip
                  key={ders.id}
                  ad={ders.ad}
                  sayi={dagilim[ders.id] ?? 0}
                  secili={suzgec === ders.id}
                  onSec={() => setSuzgec(ders.id)}
                />
              ))}
            </div>
          )}

          {gosterilen.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <Rabi durum="uykulu" boyut={92} />
              <p className="mt-3 font-display text-[17px] font-extrabold tracking-tight">
                Burası boş
              </p>
              <p className="mt-1 text-[13.5px] font-semibold text-muted-foreground text-pretty">
                Bilgi kartlarını okurken bilmediğin kartı yukarı kaydır; buraya düşsün.
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {gosterilen.map((kayit) => (
                <li key={kayit.id}>
                  <Kart className="px-4 py-3.5">
                    <div className="flex items-start gap-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.09em] text-muted-foreground">
                          {dersBul(kayit.ders).ad} · {kayit.sinif}. sınıf · {kayit.konuAdi}
                        </p>
                        <h3 className="mt-1 font-display text-[15.5px] leading-tight font-extrabold tracking-tight">
                          {kayit.baslik}
                        </h3>
                        <p className="mt-1.5 text-[14px] leading-relaxed font-medium text-pretty">
                          {kayit.metin}
                        </p>
                      </div>
                      {/* Tik listeden çıkarır, "öğrendim" demenin tek yolu bu. */}
                      <button
                        type="button"
                        onClick={() => onSil(kayit.id)}
                        aria-label={`${kayit.baslik}: öğrendim`}
                        className="grid size-9 shrink-0 place-items-center rounded-full bg-success-soft text-success transition active:brightness-95"
                      >
                        <Check size={17} strokeWidth={3} aria-hidden />
                      </button>
                    </div>
                  </Kart>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function Cip({
  ad,
  sayi,
  secili,
  onSec,
}: {
  ad: string
  sayi: number
  secili: boolean
  onSec: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSec}
      aria-pressed={secili}
      className={cn(
        'shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-extrabold transition',
        secili ? 'bg-primary-dolu text-white' : 'bg-muted text-muted-foreground active:brightness-95',
      )}
    >
      {ad} <span className="rakam opacity-70">{sayi}</span>
    </button>
  )
}
