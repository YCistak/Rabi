'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import type { Ayarlar, GunlukKayit, SoruKaydi } from '@/lib/types'
import { bosSayisi, gunOzeti } from '@/lib/hesap'
import { CALISMA_DERSLERI, dersOnerileriniSuz, sadelestir } from '@/lib/dersler'
import { bugun, cn, tariheCevir, tarihYaziKisa } from '@/lib/utils'
import { Alan, BaslikSatiri, Buton, Cip, Deger, Kart, Not, SecmeliAlan } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { Takvim, type GunIsareti } from '@/components/takvim'

export function SoruTakibiEkrani({
  kayitlar,
  setKayitlar,
  ayarlar,
}: {
  kayitlar: GunlukKayit[]
  setKayitlar: (guncelleyici: GunlukKayit[] | ((onceki: GunlukKayit[]) => GunlukKayit[])) => void
  ayarlar: Ayarlar
}) {
  const [bugunIso, setBugunIso] = useState(bugun)
  const [secili, setSecili] = useState(bugunIso)
  const [ay, setAy] = useState(() => tariheCevir(bugunIso))
  const [yeniDers, setYeniDers] = useState('')

  /**
   * "Bugün" ekran açılırken bir kez hesaplanıyordu; uygulama gece yarısını açık
   * geçirdiğinde saat 00.05'te hâlâ düne yazılabiliyordu. Uygulama öne her
   * geldiğinde tarih yeniden soruluyor, seçim de yeni güne taşınıyor.
   */
  useEffect(() => {
    const tazele = () => {
      if (document.visibilityState !== 'visible') return
      const yeniGun = bugun()
      if (yeniGun === bugunIso) return
      setBugunIso(yeniGun)
      if (secili === bugunIso) {
        setSecili(yeniGun)
        setAy(tariheCevir(yeniGun))
      }
    }
    document.addEventListener('visibilitychange', tazele)
    return () => document.removeEventListener('visibilitychange', tazele)
  }, [bugunIso, secili])

  const seciliKayit = kayitlar.find((k) => k.tarih === secili)
  const ozet = gunOzeti(seciliKayit)

  const isaretler = useMemo(() => {
    const harita = new Map<string, GunIsareti>()
    for (const kayit of kayitlar) {
      const toplam = gunOzeti(kayit).toplam
      if (toplam === 0) continue
      const doluluk = ayarlar.gunlukHedef > 0 ? Math.min(1, toplam / ayarlar.gunlukHedef) : 1
      harita.set(kayit.tarih, { doluluk })
    }
    return harita
  }, [kayitlar, ayarlar.gunlukHedef])

  /**
   * Soru yalnızca **bugüne** girilebilir.
   *
   * Geçmiş günler açılıyor ama okunur: sonradan doldurulan bir gün tahmine
   * dayanır, oysa günlük hedef, seri ve haftalık özet bu sayıların o gün
   * gerçekten çözüldüğünü varsayıyor. Gelecek günler takvimde hiç
   * seçilemiyor — orada bakılacak bir şey de yok.
   */
  const duzenlenebilir = secili === bugunIso

  /** Seçili günün kayıt satırlarını değiştirir; gün boşalırsa kaydı tamamen siler. */
  const gunuGuncelle = (degistir: (satirlar: SoruKaydi[]) => SoruKaydi[]) => {
    if (!duzenlenebilir) return
    setKayitlar((onceki) => {
      const mevcut = onceki.find((k) => k.tarih === secili)
      const yeniSatirlar = degistir(mevcut?.kayitlar ?? [])
      const digerleri = onceki.filter((k) => k.tarih !== secili)
      if (yeniSatirlar.length === 0) return digerleri
      return [...digerleri, { tarih: secili, kayitlar: yeniSatirlar }].sort((a, b) =>
        a.tarih.localeCompare(b.tarih),
      )
    })
  }

  const dersEkle = (ad: string) => {
    const temiz = ad.trim()
    if (temiz === '') return
    const zatenVar = (seciliKayit?.kayitlar ?? []).some(
      (s) => sadelestir(s.ders) === sadelestir(temiz),
    )
    if (zatenVar) {
      setYeniDers('')
      return
    }
    gunuGuncelle((satirlar) => [...satirlar, { ders: temiz, toplam: 0, dogru: 0, yanlis: 0 }])
    setYeniDers('')
  }

  const satirGuncelle = (indeks: number, alan: keyof Omit<SoruKaydi, 'ders'>, ham: string) => {
    const sayi = Number(ham.replace(/[^0-9]/g, '').slice(0, 4)) || 0
    gunuGuncelle((satirlar) =>
      satirlar.map((s, i) => (i === indeks ? { ...s, [alan]: sayi } : s)),
    )
  }

  const kullanilanDersler = (seciliKayit?.kayitlar ?? []).map((s) => s.ders)
  const oneriler = dersOnerileriniSuz(yeniDers, kullanilanDersler, CALISMA_DERSLERI)
  const hedefTuttu = ozet.toplam >= ayarlar.gunlukHedef && ayarlar.gunlukHedef > 0

  return (
    <div>
      <BaslikSatiri baslik="Soru Takibi" />

      <Kart className="mb-4">
        <Takvim
          ay={ay}
          onAyDegis={setAy}
          secili={secili}
          onSec={(tarih) => {
            setSecili(tarih)
            setYeniDers('')
          }}
          isaretler={isaretler}
          bugunIso={bugunIso}
          enGecIso={bugunIso}
        />
      </Kart>

      <div className="mb-3 flex items-center gap-3">
        <Rabi durum={hedefTuttu ? 'mutlu' : ozet.toplam > 0 ? 'normal' : 'uykulu'} boyut={52} />
        <div className="min-w-0 flex-1">
          <p className="font-medium">
            {secili === bugunIso ? 'Bugün' : tarihYaziKisa(secili)}
          </p>
          <p className="text-sm text-muted-foreground">
            {!duzenlenebilir
              ? ozet.toplam === 0
                ? 'O gün soru girilmemiş.'
                : `O gün ${ozet.toplam} soru çözmüşsün.`
              : ozet.toplam === 0
                ? 'Henüz soru girmedin.'
                : hedefTuttu
                  ? 'Günlük hedefi tutturdun.'
                  : `Hedefe ${ayarlar.gunlukHedef - ozet.toplam} soru kaldı.`}
          </p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        <Deger etiket="Soru" deger={ozet.toplam} vurgu />
        <Deger etiket="Doğru" deger={ozet.dogru} />
        <Deger etiket="Yanlış" deger={ozet.yanlis} />
        <Deger etiket="Boş" deger={ozet.bos} />
      </div>

      <Kart className="mb-3 p-0">
        {(seciliKayit?.kayitlar ?? []).length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            {duzenlenebilir
              ? 'Bu güne henüz ders eklemedin. Aşağıdan bir ders seç.'
              : 'O gün hiç ders girilmemiş.'}
          </p>
        ) : (
          <ul>
            {(seciliKayit?.kayitlar ?? []).map((satir, indeks) => (
              <li key={satir.ders} className="border-b border-border px-3 py-2.5 last:border-b-0">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{satir.ders}</p>
                  {duzenlenebilir && (
                    <button
                      type="button"
                      aria-label={`${satir.ders} satırını sil`}
                      onClick={() =>
                        gunuGuncelle((satirlar) => satirlar.filter((_, i) => i !== indeks))
                      }
                      className="shrink-0 text-muted-foreground active:text-danger"
                    >
                      <X size={16} aria-hidden />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <SayiKutusu
                    etiket="Toplam"
                    deger={satir.toplam}
                    okunur={!duzenlenebilir}
                    onDegis={(ham) => satirGuncelle(indeks, 'toplam', ham)}
                  />
                  <SayiKutusu
                    etiket="Doğru"
                    deger={satir.dogru}
                    okunur={!duzenlenebilir}
                    onDegis={(ham) => satirGuncelle(indeks, 'dogru', ham)}
                  />
                  <SayiKutusu
                    etiket="Yanlış"
                    deger={satir.yanlis}
                    okunur={!duzenlenebilir}
                    onDegis={(ham) => satirGuncelle(indeks, 'yanlis', ham)}
                  />
                  {/* Boş girilmez, hesaplanır — istenen davranış bu. */}
                  <div>
                    <span className="mb-1 block text-center text-xs text-muted-foreground">
                      Boş
                    </span>
                    <p
                      className={cn(
                        'rakam flex h-10 items-center justify-center rounded-xl bg-muted/60 text-[15px] font-medium',
                        satir.dogru + satir.yanlis > satir.toplam && 'text-danger',
                      )}
                    >
                      {bosSayisi(satir)}
                    </p>
                  </div>
                </div>

                {satir.dogru + satir.yanlis > satir.toplam && (
                  <p className="mt-1.5 text-xs text-danger">
                    Doğru + yanlış toplamı çözdüğün soru sayısını aşıyor.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Kart>

      {!duzenlenebilir && (
        <Not className="mb-4">
          Geçmiş günler okunur. Soru yalnızca <b className="font-bold">bugüne</b> girilir —
          sonradan doldurulan bir gün tahmine dayanır, oysa günlük hedef, seri ve haftalık özet bu
          sayıların o gün gerçekten çözüldüğünü sayıyor.{' '}
          <button
            type="button"
            onClick={() => {
              setSecili(bugunIso)
              setAy(tariheCevir(bugunIso))
            }}
            className="font-bold text-primary underline underline-offset-2"
          >
            Bugüne dön
          </button>
        </Not>
      )}

      {duzenlenebilir && (
        <div className="mb-4">
          <div className="mb-2 flex flex-wrap gap-2">
          {CALISMA_DERSLERI.filter(
            (d) => !kullanilanDersler.some((k) => sadelestir(k) === sadelestir(d)),
          )
            .slice(0, 8)
            .map((ders) => (
              <Cip key={ders} onClick={() => dersEkle(ders)}>
                <Plus size={13} className="mr-1 inline" aria-hidden />
                {ders}
              </Cip>
            ))}
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <SecmeliAlan
              deger={yeniDers}
              onDegis={setYeniDers}
              oneriler={oneriler}
              placeholder="Başka bir ders yaz"
              aria-label="Ders adı"
            />
          </div>
          <Buton onClick={() => dersEkle(yeniDers)} disabled={yeniDers.trim() === ''}>
            <Plus size={18} aria-hidden />
            Ekle
          </Buton>
        </div>
        </div>
      )}

    </div>
  )
}

function SayiKutusu({
  etiket,
  deger,
  okunur,
  onDegis,
}: {
  etiket: string
  deger: number
  /** Geçmiş gün: sayı görünüyor ama değiştirilemiyor. */
  okunur?: boolean
  onDegis: (ham: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-center text-xs text-muted-foreground">{etiket}</span>
      <Alan
        inputMode="numeric"
        readOnly={okunur}
        // 0 yerine boş gösteriliyor: kutuya dokunup yazmaya başlayınca
        // önce sıfırı silmek gerekmesin.
        value={deger === 0 ? '' : String(deger)}
        onChange={(e) => onDegis(e.target.value)}
        className={cn('rakam h-10 px-1 text-center', okunur && 'bg-muted/60 text-muted-foreground')}
      />
    </label>
  )
}
