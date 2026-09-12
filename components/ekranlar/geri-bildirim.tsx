'use client'

/**
 * Öneri ve hata bildir — Ayarlar'dan açılan ekran.
 *
 * Tek kart: tür çipleri, metin alanı, ne gönderileceğinin listesi ve
 * "Gönder". İzin kartı yok; hatalı soruda kart var çünkü orada bayrak turun
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
import { BaslikSatiri, Buton, Cip, Kart, Not } from '@/components/ui'
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
    <div>
      <BaslikSatiri
        baslik="Öneri ve hata bildir"
        aciklama="Bir şey bozuksa ya da eksikse buradan yaz"
      />

      <Kart className="space-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Bildirim türü">
          {TURLER.map((t) => (
            <Cip key={t} secili={tur === t} onClick={() => setTur(t)}>
              {TUR_ADI[t]}
            </Cip>
          ))}
        </div>

        <div>
          <textarea
            value={metin}
            onChange={(olay) => setMetin(olay.target.value)}
            maxLength={METIN_EN_COK}
            rows={6}
            placeholder={YER_TUTUCU[tur]}
            aria-label="Mesajın"
            className={cn(
              'block w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-[15px] leading-snug',
              'placeholder:text-muted-foreground/70',
              'focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring/40',
            )}
          />
          <div className="mt-1 flex items-center justify-between text-[11.5px] font-medium text-muted-foreground">
            <span>{uyari ?? ''}</span>
            <span className="rakam">
              {metin.length}/{METIN_EN_COK}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-foreground/[0.05] p-3">
          <p className="text-[11.5px] font-medium leading-snug text-muted-foreground">
            &ldquo;Gönder&rdquo; dediğinde telefonundan çıkanlar:
          </p>
          <ul className="mt-1 list-disc pl-4 text-[11.5px] font-medium leading-snug text-muted-foreground">
            {GONDERILENLER.map((alan) => (
              <li key={alan}>{alan}</li>
            ))}
          </ul>
          <p className="mt-1.5 text-[11.5px] font-medium leading-snug text-muted-foreground">
            Adın, netlerin, notların ve fotoğrafların <b>gönderilmez</b>. Yazdığın metin
            olduğu gibi gider; içine adını, telefonunu ya da başka kişisel bilgi yazma —
            sana geri dönemeyiz, buradan tek yönlü bir kutu bu.
          </p>
        </div>

        {kol.sinirda ? (
          <Not tur="uyari">Bugünlük sınıra ulaştın; yarın yeniden yazabilirsin.</Not>
        ) : (
          <Buton
            onClick={gonder}
            disabled={sorun !== null || gonderiliyor}
            className="w-full"
          >
            <Send size={16} aria-hidden />
            {gonderiliyor ? 'Gönderiliyor…' : 'Gönder'}
          </Buton>
        )}

        {sonDurum && <Not>{DURUM_METNI[sonDurum]}</Not>}
        {kol.bekleyen > 0 && sonDurum !== 'bekliyor' && (
          <Not>
            {kol.bekleyen} bildirim gönderilmeyi bekliyor; internet gelince gidecek.
          </Not>
        )}
      </Kart>
    </div>
  )
}
