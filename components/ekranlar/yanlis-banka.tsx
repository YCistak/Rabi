'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Images, RotateCcw, Trash2, X } from 'lucide-react'
import type { YanlisSoru } from '@/lib/types'
import {
  bankaOzeti,
  bankaSuz,
  derslereGore,
  gecerliDers,
  type BankaSekmesi,
} from '@/lib/banka'
import { oksuzResimleriSil, resimSil, useResimUrl } from '@/lib/resim-depo'
import {
  EklemeFormu,
  FotografDugmeleri,
  useYanlisSoruEkleme,
} from '@/components/yanlis-soru-ekle'
import { useGeriKatmani } from '@/lib/geri'
import { tarihYaz } from '@/lib/hesap'
import { bugun } from '@/lib/utils'
import { BaslikSatiri, BosDurum, Buton, Cip, Kart, Not, Onay } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

export function YanlisBankaEkrani({
  sorular,
  setSorular,
}: {
  sorular: YanlisSoru[]
  setSorular: (guncelleyici: (onceki: YanlisSoru[]) => YanlisSoru[]) => void
}) {
  const [sekme, setSekme] = useState<BankaSekmesi>('bekleyen')
  const [dersSuzgec, setDersSuzgec] = useState('')
  const [acikId, setAcikId] = useState<string | null>(null)
  const { bekleyen, hata, fotografAl, kaydet, vazgec, gizliGirdi } =
    useYanlisSoruEkleme(setSorular)

  const ozet = useMemo(() => bankaOzeti(sorular), [sorular])
  const sekmedekiler = useMemo(
    () => sorular.filter((s) => (sekme === 'cozulen' ? s.cozuldu : !s.cozuldu)),
    [sorular, sekme],
  )
  const dersler = useMemo(() => derslereGore(sekmedekiler), [sekmedekiler])
  const seciliDers = gecerliDers(dersSuzgec, dersler)
  const liste = useMemo(
    () => bankaSuz(sorular, { sekme, ders: seciliDers }),
    [sorular, sekme, seciliDers],
  )
  const acik = sorular.find((s) => s.id === acikId) ?? null

  // Geri tuşu önce görüntüleyiciyi, sonra kaydedilmeyi bekleyen fotoğrafı
  // kapatmalı; ikisi de bu ekranın içinde açılan katmanlar.
  useGeriKatmani(acik !== null, () => setAcikId(null))
  useGeriKatmani(bekleyen !== null, vazgec)

  // Kayıt silinip blob'u kalmış fotoğrafları bir kez temizle. Silme işleminin
  // ortasında uygulama kapanırsa öksüz blob kalabiliyor.
  useEffect(() => {
    void oksuzResimleriSil(sorular.map((s) => s.resimId))
    // Yalnızca ekran ilk açıldığında: her değişimde çalışsa, kaydedilmeyi
    // bekleyen fotoğrafı da öksüz sayıp silerdi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sil = (soru: YanlisSoru) => {
    setSorular((onceki) => onceki.filter((s) => s.id !== soru.id))
    void resimSil(soru.resimId)
    setAcikId(null)
  }

  const cozulduDegistir = (soru: YanlisSoru) => {
    setSorular((onceki) =>
      onceki.map((s) => {
        if (s.id !== soru.id) return s
        const cozuldu = !s.cozuldu
        // İşareti kaldırınca tarih de siliniyor: kalsaydı soru "çözülmemiş"
        // görünürken haftalık özetin çözülenler sayısına girmeye devam ederdi.
        return { ...s, cozuldu, cozulmeTarihi: cozuldu ? bugun() : undefined }
      }),
    )
  }

  if (bekleyen) {
    return (
      <EklemeFormu
        onizleme={bekleyen.url}
        onKaydet={async (bilgi) => {
          // Kaydedilen soru "bekleyen" sekmesine düşüyor; kullanıcı çözdükleri
          // sekmesindeyken eklerse yeni kartı hiç göremezdi.
          if (await kaydet(bilgi)) setSekme('bekleyen')
        }}
        onVazgec={vazgec}
        hata={hata}
      />
    )
  }

  return (
    <div>
      <BaslikSatiri
        baslik="Yanlış Soru Bankası"
        aciklama={
          ozet.toplam > 0 ? `${ozet.bekleyen} bekleyen · ${ozet.cozulen} çözüldü` : undefined
        }
      />

      {gizliGirdi}

      <FotografDugmeleri onSec={(kaynak) => void fotografAl(kaynak)} className="mb-4 flex gap-2" />

      {hata && (
        <Not tur="tehlike" className="mb-3">
          {hata}
        </Not>
      )}

      {ozet.toplam === 0 ? (
        <BosDurum
          simge={<Rabi durum="uykulu" boyut={96} />}
          baslik="Banka boş"
          aciklama="Çözemediğin bir soruyla karşılaşınca fotoğrafını çek. Rabi ders ders ayırıp saklar, sonra hepsine tek tek dönersin."
        />
      ) : (
        <>
          <div className="mb-3 flex gap-2">
            <Cip secili={sekme === 'bekleyen'} onClick={() => setSekme('bekleyen')}>
              Bekleyen ({ozet.bekleyen})
            </Cip>
            <Cip secili={sekme === 'cozulen'} onClick={() => setSekme('cozulen')}>
              Çözdüklerim ({ozet.cozulen})
            </Cip>
          </div>

          {dersler.length > 1 && (
            <div className="mb-3 flex flex-wrap gap-2">
              <Cip secili={seciliDers === ''} onClick={() => setDersSuzgec('')}>
                Tümü
              </Cip>
              {dersler.map((d) => (
                <Cip
                  key={d.ders}
                  secili={seciliDers === d.ders}
                  onClick={() => setDersSuzgec(d.ders)}
                >
                  {d.ders} ({d.sayi})
                </Cip>
              ))}
            </div>
          )}

          {liste.length === 0 ? (
            <Not>
              {sekme === 'cozulen'
                ? 'Henüz çözdüğün soru yok. Bir soruyu açıp “Çözdüm” dersen buraya taşınır.'
                : 'Bu sekmede soru kalmadı — hepsini çözmüşsün.'}
            </Not>
          ) : (
            <ul className="grid grid-cols-3 gap-2">
              {liste.map((soru) => (
                <li key={soru.id}>
                  <Kucuk soru={soru} onAc={() => setAcikId(soru.id)} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {acik && (
        <Goruntuleyici
          soru={acik}
          onKapat={() => setAcikId(null)}
          onCozuldu={() => cozulduDegistir(acik)}
          onSil={() => sil(acik)}
        />
      )}
    </div>
  )
}

/** Galeri karesi. Görüntü IndexedDB'den geldiği için bir an boş kalabilir. */
function Kucuk({ soru, onAc }: { soru: YanlisSoru; onAc: () => void }) {
  const url = useResimUrl(soru.resimId)

  return (
    <button
      type="button"
      onClick={onAc}
      className="relative block aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted"
    >
      {url ? (
        // Fotoğraf IndexedDB'den geliyor; next/image statik dışa aktarımda
        // blob adreslerini işleyemez.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={soru.ders} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full items-center justify-center text-muted-foreground/50">
          <Images size={20} aria-hidden />
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1 pt-4 text-left text-[11px] font-medium text-white">
        {soru.ders}
      </span>
      {soru.cozuldu && (
        <span className="absolute right-1 top-1 rounded-full bg-success p-1 text-white">
          <Check size={11} aria-hidden />
        </span>
      )}
    </button>
  )
}

/** Tam ekran görüntüleyici. */
function Goruntuleyici({
  soru,
  onKapat,
  onCozuldu,
  onSil,
}: {
  soru: YanlisSoru
  onKapat: () => void
  onCozuldu: () => void
  onSil: () => void
}) {
  const url = useResimUrl(soru.resimId)
  const [silmeAcik, setSilmeAcik] = useState(false)

  return (
    // Tam ekran katman: uygulamanın geri kalanı `max-w-md` olduğu için iç sütun
    // da öyle tutuluyor, yoksa geniş ekranda düğmeler kenarlara savruluyor.
    <div className="guvenli-ust guvenli-alt fixed inset-0 z-50 flex flex-col items-center bg-black">
      <div className="flex w-full max-w-md items-center justify-between px-4 py-3 text-white">
        <div className="min-w-0">
          <p className="truncate font-medium">{soru.ders}</p>
          <p className="truncate text-xs text-white/60">
            {tarihYaz(soru.tarih)}
            {soru.konu ? ` · ${soru.konu}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={onKapat}
          aria-label="Kapat"
          className="-mr-2 rounded-full p-2 text-white/80 active:bg-white/10"
        >
          <X size={22} aria-hidden />
        </button>
      </div>

      <div className="flex min-h-0 w-full max-w-md flex-1 items-center justify-center px-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={soru.konu ?? soru.ders}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <p className="text-sm text-white/60">Fotoğraf yüklenemedi.</p>
        )}
      </div>

      {soru.not && (
        <p className="w-full max-w-md px-4 pt-3 text-sm leading-relaxed text-white/80">
          {soru.not}
        </p>
      )}

      <div className="flex w-full max-w-md gap-2 px-4 pb-6 pt-3">
        <Buton
          bicim="tehlike"
          boy="simge"
          onClick={() => setSilmeAcik(true)}
          aria-label="Soruyu sil"
        >
          <Trash2 size={18} aria-hidden />
        </Buton>
        <Buton
          className="flex-1"
          bicim={soru.cozuldu ? 'ikincil' : 'birincil'}
          onClick={() => {
            onCozuldu()
            onKapat()
          }}
        >
          {soru.cozuldu ? (
            <>
              <RotateCcw size={18} aria-hidden />
              Hâlâ takıldım
            </>
          ) : (
            <>
              <Check size={18} aria-hidden />
              Çözdüm
            </>
          )}
        </Buton>
      </div>

      <Onay
        acik={silmeAcik}
        baslik="Soru silinsin mi?"
        aciklama="Fotoğraf ve notu kalıcı olarak silinir."
        onOnayla={onSil}
        onIptal={() => setSilmeAcik(false)}
      />
    </div>
  )
}

/** Fotoğraf çekildikten sonra ders/konu/not sorulan adım. */
