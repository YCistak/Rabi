'use client'

/**
 * Öneri ve hata bildir — Ayarlar'dan açılan ekran.
 *
 * Tür seçimi ve mesaj alanı bir kartta, gönderim bilgileri hemen altındaki
 * kartta. İzin kartı yok; hatalı soruda kart var çünkü orada bayrak turun
 * içinde tek dokunuşla basılıyor ve kullanıcı ne gönderdiğini düşünmemiş
 * olabiliyor. Burada kullanıcı bir metin yazıp gönder düğmesine basıyor —
 * ne gönderdiğini biliyor, listesi de düğmenin hemen üstünde.
 *
 * Gönderilenler listesi `lib/geri-bildirim.ts` içindeki
 * `geriBildirimFormVerisi()` ile aynı olmak zorunda; oraya alan eklenirse
 * buraya da eklenmeli, yoksa kullanıcıya söylenenden fazlası gider.
 */

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Buton, Kart, Not } from '@/components/ui'
import {
  METIN_EN_COK,
  TURLER,
  TUR_ADI,
  metinSorunu,
  type GeriBildirimTuru,
} from '@/lib/geri-bildirim'
import type { GeriBildirimKolu, GonderimDurumu } from '@/lib/geri-bildirim-kolu'
import { cn } from '@/lib/utils'

const GONDERILENLER = [
  'seçtiğin tür ve yazdığın metin',
  'uygulama sürümü',
  'telefonunun modeli ve ada bağlı olmayan bir cihaz adı',
  'gönderim tarihi',
]

/** Türe göre yer tutucu — boş kutu ne yazılacağını söylemiyor. */
const YER_TUTUCU: Record<GeriBildirimTuru, string> = {
  oneri: 'Ne olsa daha iyi olurdu? Hangi ekranda, ne yaparken aklına geldi?',
  hata: 'Ne oldu, ne yapınca oldu? Hangi ekrandaydın, ne bekliyordun?',
  baska: 'Aklındakini yaz.',
}

const DURUM_METNI: Record<GonderimDurumu, string> = {
  gonderildi: 'Gönderildi, teşekkürler. Her mesaj okunuyor.',
  bekliyor: 'Kaydedildi; internet gelince kendiliğinden gidecek.',
}

export function GeriBildirimEkrani({ kol }: { kol: GeriBildirimKolu }) {
  const [tur, setTur] = useState<GeriBildirimTuru>('oneri')
  const [metin, setMetin] = useState('')
  const [gonderiliyor, setGonderiliyor] = useState(false)
  const [sonDurum, setSonDurum] = useState<GonderimDurumu | null>(null)

  const sorun = metinSorunu(metin)
  // Uyarı yalnızca kullanıcı yazmaya başladıktan sonra: boş kutunun altında
  // "en az 10 karakter" yazması, daha başlamadan azarlamak olurdu.
  const uyari = metin.length > 0 ? sorun : null

  async function gonder() {
    if (sorun !== null || kol.sinirda || gonderiliyor) return
    setGonderiliyor(true)
    setSonDurum(null)
    try {
      const durum = await kol.onGonder(tur, metin)
      if (durum === null) return
      setSonDurum(durum)
      setMetin('')
    } finally {
      setGonderiliyor(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-extrabold">Öneri ve hata bildir</h1>

      <Kart className="rounded-[24px] p-5">
        <p className="text-sm font-extrabold">Ne paylaşmak istersin?</p>
        <div className="mt-3 flex rounded-[14px] bg-muted p-1" role="group" aria-label="Bildirim türü">
          {TURLER.map((secenek) => (
            <button
              key={secenek}
              type="button"
              aria-pressed={tur === secenek}
              onClick={() => setTur(secenek)}
              className={cn(
                'h-10 flex-1 rounded-[10px] text-[13px] font-extrabold transition focus-visible:outline-2 focus-visible:outline-ring',
                tur === secenek ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground',
              )}
            >
              {TUR_ADI[secenek]}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <label htmlFor="geri-bildirim-mesaji" className="mb-2 block text-sm font-extrabold">
            Mesajın
          </label>
          <textarea
            id="geri-bildirim-mesaji"
            value={metin}
            onChange={(olay) => setMetin(olay.target.value)}
            maxLength={METIN_EN_COK}
            rows={6}
            placeholder={YER_TUTUCU[tur]}
            aria-describedby="geri-bildirim-uyarisi"
            className={cn(
              'block min-h-40 w-full resize-none rounded-[14px] border border-border bg-muted/30 px-4 py-3 text-[15px] leading-relaxed',
              'placeholder:text-muted-foreground/70',
              'focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring/40',
            )}
          />
          <div className="mt-2 flex items-start justify-between gap-3 text-xs font-medium text-muted-foreground">
            <span id="geri-bildirim-uyarisi">{uyari ?? 'Kişisel bilgilerini mesajına ekleme.'}</span>
            <span className="rakam shrink-0">
              {metin.length}/{METIN_EN_COK}
            </span>
          </div>
        </div>
      </Kart>

      <Kart className="rounded-[20px] border border-border/70 p-4">
        <h2 className="text-sm font-extrabold">Gönderilen bilgiler</h2>
        <ul className="mt-3 space-y-2 text-[13px] leading-snug text-muted-foreground">
          {GONDERILENLER.map((alan) => (
            <li key={alan} className="flex gap-2.5">
              <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-primary-parlak" aria-hidden />
              <span>{alan}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
          Adın, netlerin, notların ve fotoğrafların <b>gönderilmez</b>. Yazdığın metin
          olduğu gibi gider; içine adını, telefonunu ya da başka kişisel bilgi yazma.
          Bu kutudan sana yanıt veremeyiz.
        </p>
      </Kart>

      <div className="space-y-3">
        {kol.sinirda ? (
          <Not tur="uyari">Bugünlük sınıra ulaştın; yarın yeniden yazabilirsin.</Not>
        ) : (
          <Buton
            onClick={gonder}
            disabled={sorun !== null || gonderiliyor}
            className="h-12 w-full rounded-[14px]"
          >
            <Send size={16} aria-hidden />
            {gonderiliyor ? 'Gönderiliyor…' : 'Gönder'}
          </Buton>
        )}

        <div aria-live="polite" className="space-y-3">
          {sonDurum && <Not>{DURUM_METNI[sonDurum]}</Not>}
          {kol.bekleyen > 0 && sonDurum !== 'bekliyor' && (
            <Not>
              {kol.bekleyen} bildirim gönderilmeyi bekliyor; internet gelince gidecek.
            </Not>
          )}
        </div>
      </div>
    </div>
  )
}
