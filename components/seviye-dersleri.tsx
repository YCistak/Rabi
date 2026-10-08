'use client'

import { useState } from 'react'
import { Plus, RotateCcw, Trash2, X } from 'lucide-react'
import { Alan, Buton, Kart, Not, useKapatmaOnayi } from '@/components/ui'
import { useGeriKatmani } from '@/lib/geri'
import { DERS_EN_COK_SORU, dersleriDenetle, SEVIYE_DERS_SECENEKLERI } from '@/lib/seviye-tespit'
import type { Sablon, SablonDers } from '@/lib/types'

/** Düzenlenen satır: soru sayısı yazılırken boş kalabilsin diye metin. */
type Satir = { id: string; ad: string; soru: string; osymTesti?: SablonDers['osymTesti'] }

function satirlara(dersler: readonly SablonDers[]): Satir[] {
  return dersler.map((d) => ({ id: d.id, ad: d.ad, soru: String(d.soruSayisi), osymTesti: d.osymTesti }))
}

function derslere(satirlar: readonly Satir[]): SablonDers[] {
  return satirlar.map((s) => ({
    id: s.id,
    ad: s.ad,
    soruSayisi: Number(s.soru) || 0,
    ...(s.osymTesti ? { osymTesti: s.osymTesti } : {}),
  }))
}

/**
 * Seviye tespitin derslerini düzenleme katmanı: ders ekle/çıkar, adını ve
 * soru sayısını yaz (kullanıcı istedi, 2026-10). Okullar seviye tespiti kendi
 * biçiminde yapıyor; hazır dağılım her okula uymuyor.
 *
 * Kayıt seçili sınıfa (11-12'de alana) yazılıyor ve o sınıfın bundan sonraki
 * denemelerinde kullanılıyor; girilmiş denemeler kendi derslerini koruyor
 * (`lib/seviye-tespit.ts`). Tam ekran ve donuk: deneme formunun Kaydet'i
 * altta görünür kalmasın (yanlış soru katmanıyla aynı gerekçe).
 */
export function SeviyeDersleri({
  sablon,
  hazir,
  baslik,
  onKaydet,
  onKapat,
}: {
  /** Şu an kullanılan şablon: düzenleme onun derslerinden başlıyor. */
  sablon: Sablon
  /** Sınıfın hazır şablonu: "Varsayılana dön" bunun derslerini getiriyor. */
  hazir: Sablon
  /** "10. sınıf", "11. sınıf Sayısal" */
  baslik: string
  onKaydet: (dersler: SablonDers[]) => void
  onKapat: () => void
}) {
  const [satirlar, setSatirlar] = useState<Satir[]>(() => satirlara(sablon.dersler))
  const [ilkHal] = useState(() => JSON.stringify(satirlara(sablon.dersler)))
  const degisti = JSON.stringify(satirlar) !== ilkHal
  const onay = useKapatmaOnayi({ aciklama: 'Derslerde yaptığın değişiklikler kaydedilmez.' })
  const kapat = () => (degisti ? onay.sor(onKapat) : onKapat())
  useGeriKatmani(true, kapat)

  const hata = dersleriDenetle(derslere(satirlar))
  const eklenebilir = SEVIYE_DERS_SECENEKLERI.filter((d) => !satirlar.some((s) => s.id === d.id))
  const toplam = satirlar.reduce((t, s) => t + (Number(s.soru) || 0), 0)

  const degistir = (id: string, alan: 'ad' | 'soru', deger: string) =>
    setSatirlar((onceki) =>
      onceki.map((s) =>
        s.id !== id ? s : alan === 'soru' ? { ...s, soru: deger.replace(/[^0-9]/g, '').slice(0, 3) } : { ...s, ad: deger },
      ),
    )

  // Listede olmayan bir ders: kimliği adından bağımsız, ad değişse de net kaydı ona bağlı kalsın.
  const baskaDersEkle = () => {
    let n = 1
    while (satirlar.some((s) => s.id === `ders-${n}`)) n++
    setSatirlar((onceki) => [...onceki, { id: `ders-${n}`, ad: '', soru: '10' }])
  }

  return (
    <div className="tam-katman-girisi fixed inset-0 z-50 overflow-y-auto bg-background">
      {onay.pencere}
      <div className="mx-auto max-w-md px-4 pt-[calc(1.25rem+var(--guvenli-ust))] pb-[calc(2rem+var(--guvenli-alt))]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-semibold tracking-tight">Dersleri düzenle</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Seviye Tespit · {baslik} · <span className="rakam">{toplam}</span> soru
            </p>
          </div>
          <Buton bicim="hayalet" boy="simge" onClick={kapat} aria-label="Kapat">
            <X size={20} />
          </Buton>
        </div>

        <Kart className="p-0">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
            <span>Ders</span>
            <span className="w-16 text-center">Soru</span>
            <span className="w-9" />
          </div>
          <ul>
            {satirlar.map((satir) => (
              <li
                key={satir.id}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-border px-3 py-2 last:border-b-0"
              >
                <Alan
                  aria-label="Ders adı"
                  value={satir.ad}
                  placeholder="Ders adı"
                  onChange={(e) => degistir(satir.id, 'ad', e.target.value)}
                  className="h-10"
                />
                <Alan
                  inputMode="numeric"
                  aria-label={`${satir.ad || 'Ders'} soru sayısı`}
                  value={satir.soru}
                  onChange={(e) => degistir(satir.id, 'soru', e.target.value)}
                  className="h-10 w-16 px-0 text-center rakam"
                />
                <Buton
                  bicim="tehlike"
                  boy="simge"
                  className="h-9 w-9"
                  aria-label={`${satir.ad || 'Dersi'} çıkar`}
                  onClick={() => setSatirlar((onceki) => onceki.filter((s) => s.id !== satir.id))}
                >
                  <Trash2 size={17} />
                </Buton>
              </li>
            ))}
          </ul>
        </Kart>

        <p className="mt-4 mb-2 text-xs font-semibold text-muted-foreground">Ders ekle</p>
        <div className="flex flex-wrap gap-2">
          {eklenebilir.map((ders) => (
            <button
              key={ders.id}
              type="button"
              onClick={() => setSatirlar((onceki) => [...onceki, ...satirlara([ders])])}
              className="inline-flex h-9 items-center gap-1 rounded-[11px] border border-border bg-card px-3 text-[12.5px] font-bold text-muted-foreground active:bg-muted"
            >
              <Plus size={14} aria-hidden />
              {ders.ad}
            </button>
          ))}
          <button
            type="button"
            onClick={baskaDersEkle}
            className="inline-flex h-9 items-center gap-1 rounded-[11px] border border-dashed border-border bg-card px-3 text-[12.5px] font-bold text-muted-foreground active:bg-muted"
          >
            <Plus size={14} aria-hidden />
            Başka ders
          </button>
        </div>

        <Not className="mt-4">
          Bu dersler {baslik} seviye tespitinde bundan sonra kullanılır. Daha önce girdiğin
          denemeler değişmez. Bir derste en çok {DERS_EN_COK_SORU} soru olabilir.
        </Not>

        {hata && <p className="mt-3 text-center text-xs font-semibold text-danger">{hata}</p>}

        <div className="mt-4 flex gap-2">
          <Buton bicim="ikincil" className="flex-1" onClick={() => setSatirlar(satirlara(hazir.dersler))}>
            <RotateCcw size={16} aria-hidden />
            Varsayılana dön
          </Buton>
          <Buton className="flex-1" disabled={!!hata} onClick={() => onKaydet(derslere(satirlar))}>
            Kaydet
          </Buton>
        </div>
      </div>
    </div>
  )
}
