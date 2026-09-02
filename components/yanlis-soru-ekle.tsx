'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, Check, ImagePlus } from 'lucide-react'
import type { YanlisSoru } from '@/lib/types'
import { CALISMA_DERSLERI, dersOnerileriniSuz } from '@/lib/dersler'
import { cihazdaMi, cihazdanFotograf, dosyadanFotograf, type Kaynak } from '@/lib/kamera'
import { resimYaz } from '@/lib/resim-depo'
import { bugun, yeniId } from '@/lib/utils'
import { Alan, BaslikSatiri, Buton, Etiket, Kart, Not, SecmeliAlan } from '@/components/ui'

/**
 * Yanlış soru ekleme — fotoğrafı alan ve kaydeden ortak parça.
 *
 * İki ekran kullanıyor: Yanlış Soru Bankası ve yeni deneme formu. İkinci
 * kullanım sonradan geldi (deneme sonucunu girerken yanlışları anında çekmek
 * için) ve mantığı kopyalamak, iki ekranın zamanla ayrı davranması demekti —
 * biri fotoğrafı küçültürken ötekinin küçültmemesi gibi.
 */

/** Kaydedilmeyi bekleyen fotoğraf: blob ile önizleme adresi birlikte taşınır. */
export type Bekleyen = { blob: Blob; url: string }

export type SoruBilgisi = { ders: string; konu: string; not: string }

export function useYanlisSoruEkleme(
  setSorular: (guncelleyici: (onceki: YanlisSoru[]) => YanlisSoru[]) => void,
) {
  const [bekleyen, setBekleyen] = useState<Bekleyen | null>(null)
  const [hata, setHata] = useState<string | null>(null)
  const dosyaGirdisi = useRef<HTMLInputElement>(null)

  // Önizleme adresi bırakılmalı, yoksa bellekte kalır.
  useEffect(() => {
    return () => {
      if (bekleyen) URL.revokeObjectURL(bekleyen.url)
    }
  }, [bekleyen])

  const fotografAl = async (kaynak: Kaynak) => {
    setHata(null)
    if (!cihazdaMi()) {
      dosyaGirdisi.current?.click()
      return
    }
    const blob = await cihazdanFotograf(kaynak)
    if (!blob) return
    setBekleyen({ blob, url: URL.createObjectURL(blob) })
  }

  /** Kaydedildiyse `true`. Çağıran ekran buna göre kapanır ya da açık kalır. */
  const kaydet = async (bilgi: SoruBilgisi): Promise<boolean> => {
    if (!bekleyen) return false
    const resimId = yeniId()
    try {
      // Önce blob, sonra kayıt: ters sırada olsa ve yazma başarısız olsa,
      // galeride görüntüsü olmayan bir kart kalırdı.
      await resimYaz(resimId, bekleyen.blob)
    } catch {
      setHata('Fotoğraf kaydedilemedi — cihazda yer kalmamış olabilir.')
      return false
    }

    setSorular((onceki) => [
      ...onceki,
      {
        id: yeniId(),
        ders: bilgi.ders.trim(),
        tarih: bugun(),
        resimId,
        konu: bilgi.konu.trim() || undefined,
        not: bilgi.not.trim() || undefined,
        cozuldu: false,
      },
    ])
    setBekleyen(null)
    return true
  }

  const vazgec = () => setBekleyen(null)

  /* Tarayıcıda kamera eklentisi çalışmaz; dosya seçici onun yerine geçer.
     Girdi burada üretiliyor ki iki ekran da aynı yedeğe düşsün. */
  const gizliGirdi = (
    <input
      ref={dosyaGirdisi}
      type="file"
      accept="image/*"
      capture="environment"
      className="hidden"
      onChange={async (e) => {
        const dosya = e.target.files?.[0]
        e.target.value = ''
        if (!dosya) return
        const blob = await dosyadanFotograf(dosya)
        if (!blob) {
          setHata('Seçilen dosya bir görsel değil.')
          return
        }
        setBekleyen({ blob, url: URL.createObjectURL(blob) })
      }}
    />
  )

  return { bekleyen, hata, setHata, fotografAl, kaydet, vazgec, gizliGirdi }
}

/** "Fotoğraf çek" / "Galeriden" ikilisi. */
export function FotografDugmeleri({
  onSec,
  className,
}: {
  onSec: (kaynak: Kaynak) => void
  className?: string
}) {
  return (
    <div className={className ?? 'flex gap-2'}>
      <Buton className="flex-1" onClick={() => onSec('kamera')}>
        <Camera size={18} aria-hidden />
        Fotoğraf çek
      </Buton>
      <Buton bicim="ikincil" className="flex-1" onClick={() => onSec('galeri')}>
        <ImagePlus size={18} aria-hidden />
        Galeriden
      </Buton>
    </div>
  )
}

export function EklemeFormu({
  onizleme,
  onKaydet,
  onVazgec,
  hata,
  varsayilanDers = '',
}: {
  onizleme: string
  onKaydet: (bilgi: SoruBilgisi) => Promise<void>
  onVazgec: () => void
  hata: string | null
  /** Deneme formundan gelirken ders zaten biliniyor; boşsa kullanıcı yazıyor. */
  varsayilanDers?: string
}) {
  const [ders, setDers] = useState(varsayilanDers)
  const [konu, setKonu] = useState('')
  const [not, setNot] = useState('')
  const [kaydediliyor, setKaydediliyor] = useState(false)

  const kaydedilebilir = ders.trim() !== '' && !kaydediliyor

  return (
    <div>
      <BaslikSatiri baslik="Soruyu ekle" aciklama="Hangi dersten olduğunu yaz, sonra kaydet" />

      <div className="mb-4 overflow-hidden rounded-2xl border border-border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={onizleme} alt="Çekilen soru" className="max-h-72 w-full object-contain" />
      </div>

      {hata && (
        <Not tur="tehlike" className="mb-3">
          {hata}
        </Not>
      )}

      <Kart className="space-y-3">
        <div>
          <Etiket htmlFor="banka-ders">Ders</Etiket>
          <SecmeliAlan
            id="banka-ders"
            deger={ders}
            onDegis={setDers}
            oneriler={dersOnerileriniSuz(ders, [], CALISMA_DERSLERI)}
            placeholder="örn. Matematik"
          />
        </div>

        <div>
          <Etiket htmlFor="banka-konu">Konu (isteğe bağlı)</Etiket>
          <Alan
            id="banka-konu"
            value={konu}
            onChange={(e) => setKonu(e.target.value)}
            placeholder="örn. Türev"
          />
        </div>

        <div>
          <Etiket htmlFor="banka-not">Not (isteğe bağlı)</Etiket>
          <Alan
            id="banka-not"
            value={not}
            onChange={(e) => setNot(e.target.value)}
            placeholder="örn. İkinci adımda takıldım"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Buton bicim="ikincil" className="flex-1" onClick={onVazgec}>
            Vazgeç
          </Buton>
          <Buton
            className="flex-1"
            disabled={!kaydedilebilir}
            onClick={async () => {
              setKaydediliyor(true)
              await onKaydet({ ders, konu, not })
              setKaydediliyor(false)
            }}
          >
            <Check size={18} aria-hidden />
            Kaydet
          </Buton>
        </div>
      </Kart>
    </div>
  )
}
