'use client'

import { useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import type { Hedef, PuanTuru } from '@/lib/types'
import { siraYaz } from '@/lib/siralama'
import { Alan, BaslikSatiri, Buton, Cip, Etiket, Kart, Not, Onay } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

const PUAN_TURU_ADI: Record<PuanTuru, string> = {
  say: 'Sayısal',
  ea: 'Eşit Ağırlık',
  soz: 'Sözel',
  dil: 'Dil',
}

export function HedefEkrani({
  hedef,
  setHedef,
  varsayilanTur,
  /** Sıralama ekranından gelen güncel tahmin; yoksa karşılaştırma gösterilmez. */
  guncelSiralama,
}: {
  hedef: Hedef | null
  setHedef: (hedef: Hedef | null) => void
  varsayilanTur: PuanTuru
  guncelSiralama: number | null
}) {
  const [universite, setUniversite] = useState(hedef?.universite ?? '')
  const [bolum, setBolum] = useState(hedef?.bolum ?? '')
  const [puanTuru, setPuanTuru] = useState<PuanTuru>(hedef?.puanTuru ?? varsayilanTur)
  const [tabanPuan, setTabanPuan] = useState(hedef?.tabanPuan?.toString() ?? '')
  const [basariSirasi, setBasariSirasi] = useState(hedef?.basariSirasi?.toString() ?? '')
  const [silmeAcik, setSilmeAcik] = useState(false)

  const kaydedilebilir = bolum.trim() !== ''

  const kaydet = () => {
    setHedef({
      universite: universite.trim(),
      bolum: bolum.trim(),
      puanTuru,
      tabanPuan: sayiVeyaNull(tabanPuan),
      basariSirasi: sayiVeyaNull(basariSirasi),
    })
  }

  const fark =
    hedef?.basariSirasi != null && guncelSiralama != null
      ? guncelSiralama - hedef.basariSirasi
      : null

  return (
    <div>
      <BaslikSatiri
        baslik="Hedefim"
        aciklama="Taban puan ve başarı sırasını YÖK Atlas'tan bakabilirsin"
      />

      {hedef && (
        <Kart className="mb-4 flex items-center gap-3">
          <Rabi durum={fark !== null && fark <= 0 ? 'kutlama' : 'normal'} boyut={64} />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold leading-tight">{hedef.bolum}</p>
            {hedef.universite && (
              <p className="text-sm text-muted-foreground">{hedef.universite}</p>
            )}
            {fark === null ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {hedef.basariSirasi == null
                  ? 'Gereken başarı sırasını girersen ne kadar kaldığını takip ederim.'
                  : 'Deneme ekleyince buraya ne kadar kaldığını yazarım.'}
              </p>
            ) : fark <= 0 ? (
              <p className="mt-1 text-sm font-medium text-success">
                Hedefin içindesin — {siraYaz(Math.abs(fark))} sıra fazlan var.
              </p>
            ) : (
              <p className="mt-1 text-sm font-medium text-primary">
                {siraYaz(fark)} sıra uzaktasın.
              </p>
            )}
          </div>
        </Kart>
      )}

      <Kart className="space-y-3">
        <div>
          <Etiket htmlFor="hedef-bolum">Bölüm</Etiket>
          <Alan
            id="hedef-bolum"
            value={bolum}
            onChange={(e) => setBolum(e.target.value)}
            placeholder="örn. Hukuk"
          />
        </div>

        <div>
          <Etiket htmlFor="hedef-universite">Üniversite</Etiket>
          <Alan
            id="hedef-universite"
            value={universite}
            onChange={(e) => setUniversite(e.target.value)}
            placeholder="örn. Ankara Üniversitesi"
          />
        </div>

        <div>
          <Etiket>Puan türü</Etiket>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PUAN_TURU_ADI) as PuanTuru[]).map((t) => (
              <Cip key={t} secili={puanTuru === t} onClick={() => setPuanTuru(t)}>
                {PUAN_TURU_ADI[t]}
              </Cip>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Etiket htmlFor="hedef-taban">Taban puan</Etiket>
            <Alan
              id="hedef-taban"
              inputMode="decimal"
              value={tabanPuan}
              onChange={(e) => setTabanPuan(e.target.value.replace(/[^0-9,.]/g, '').slice(0, 7))}
              placeholder="örn. 470"
              className="rakam"
            />
          </div>
          <div>
            <Etiket htmlFor="hedef-sira">Başarı sırası</Etiket>
            <Alan
              id="hedef-sira"
              inputMode="numeric"
              value={basariSirasi}
              onChange={(e) => setBasariSirasi(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
              placeholder="örn. 25000"
              className="rakam"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          {hedef && (
            <Buton bicim="tehlike" boy="simge" onClick={() => setSilmeAcik(true)} aria-label="Hedefi sil">
              <Trash2 size={18} aria-hidden />
            </Buton>
          )}
          <Buton className="flex-1" onClick={kaydet} disabled={!kaydedilebilir}>
            <Check size={18} aria-hidden />
            Kaydet
          </Buton>
        </div>
      </Kart>

      <Not className="mt-4">
        Karşılaştırma, geçen yılların taban sıralamasıyla yapılıyor. Sıralamalar her yıl
        değişiyor — hedefinin biraz üstünü tutturmayı hedeflemek daha güvenli.
      </Not>

      <Onay
        acik={silmeAcik}
        baslik="Hedef silinsin mi?"
        aciklama="Kaydettiğin bölüm ve sıralama bilgisi silinecek."
        onOnayla={() => setHedef(null)}
        onIptal={() => setSilmeAcik(false)}
      />
    </div>
  )
}

function sayiVeyaNull(metin: string): number | null {
  const temiz = metin.replace(',', '.').trim()
  if (temiz === '') return null
  const sayi = Number(temiz)
  return Number.isFinite(sayi) ? sayi : null
}
