'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { OyunId, OyunKayitlari } from '@/lib/types'
import { OYUNLAR, istatistikAl, oyunToplami } from '@/lib/oyunlar/tanim'
import { istatistigiGuncelle, type TurSayilari } from '@/lib/oyunlar/tur'
import { tarihYaz } from '@/lib/hesap'
import { bugun } from '@/lib/utils'
import { BaslikSatiri, Deger, Not } from '@/components/ui'
import { YazimOyunuEkrani } from '@/components/ekranlar/oyun-yazim'
import { IslemOyunuEkrani } from '@/components/ekranlar/oyun-islem'

/**
 * Mini oyun listesi.
 *
 * Oyun seçilince tam ekran bir katman açılıyor; bu ekran arkada duruyor ve
 * çıkışta olduğu gibi geri geliyor. Ayrı bir `Ekran` değeri yapılmadı çünkü
 * oyundan çıkınca listeye değil kart menüsüne dönerdi.
 */
export function MiniOyunlarEkrani({
  kayitlar,
  setKayitlar,
}: {
  kayitlar: OyunKayitlari
  setKayitlar: (guncelleyici: OyunKayitlari | ((onceki: OyunKayitlari) => OyunKayitlari)) => void
}) {
  const [acikOyun, setAcikOyun] = useState<OyunId | null>(null)
  const toplam = oyunToplami(kayitlar)

  const turBitti = (id: OyunId, ozet: TurSayilari) => {
    setKayitlar((onceki) => ({
      ...onceki,
      [id]: istatistigiGuncelle(onceki[id], ozet, bugun()),
    }))
  }

  return (
    <div>
      <BaslikSatiri
        baslik="Mini Oyunlar"
        aciklama="Bir dakikalık turlarla bilgi tazele"
      />

      <div className="mb-4 grid grid-cols-3 gap-3">
        <Deger etiket="Oynanan tur" deger={String(toplam.oynananTur)} />
        <Deger etiket="Toplam doğru" deger={String(toplam.toplamDogru)} vurgu />
        <Deger etiket="Hatasız tur" deger={String(toplam.hatasizTur)} />
      </div>

      <ul className="space-y-3">
        {OYUNLAR.map((oyun) => {
          const istatistik = istatistikAl(kayitlar, oyun.id)
          return (
            <li key={oyun.id}>
              <button
                type="button"
                onClick={() => setAcikOyun(oyun.id)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition active:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="text-3xl leading-none" aria-hidden>
                  {oyun.ikon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{oyun.ad}</span>
                  <span className="block text-xs leading-snug text-muted-foreground">
                    {oyun.kisaAciklama}
                  </span>
                  <span className="rakam mt-1 block text-xs text-muted-foreground">
                    {istatistik.oynananTur > 0
                      ? `Rekor ${istatistik.enIyiDogru} · ${istatistik.oynananTur} tur · son ${tarihYaz(istatistik.sonTarih)}`
                      : 'Henüz oynamadın'}
                  </span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-muted-foreground" aria-hidden />
              </button>
            </li>
          )
        })}
      </ul>

      <Not className="mt-4">
        Mini oyunların hepsi rozet veriyor: oynanan tur, tek tur rekoru, hatasız tur ve
        toplam doğru sayısı ayrı ayrı sayılıyor. Rozetler ekranından bakabilirsin.
      </Not>

      {acikOyun === 'yazim' && (
        <YazimOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'yazim')}
          onTurBitti={(ozet) => turBitti('yazim', ozet)}
          onCik={() => setAcikOyun(null)}
        />
      )}
      {acikOyun === 'islem' && (
        <IslemOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'islem')}
          onTurBitti={(ozet) => turBitti('islem', ozet)}
          onCik={() => setAcikOyun(null)}
        />
      )}
    </div>
  )
}
