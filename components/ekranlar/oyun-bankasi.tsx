'use client'

import { useMemo, useState } from 'react'
import type { OyunId } from '@/lib/types'
import { oyunBul } from '@/lib/oyunlar/tanim'
import {
  DUSME_ESIGI,
  bankaCevabiMetni,
  bankaDagilimi,
  bankaSorusuMetni,
  bankaSuz,
  OYUN_KIMLIKLERI,
  enKalabalikOyun,
  type BankaKaydi,
} from '@/lib/oyunlar/banka'
import { KURAL_ACIKLAMASI, type YazimKurali } from '@/lib/oyunlar/yazim-havuzu'
import { NOKTALAMA_ACIKLAMASI, type NoktalamaKurali } from '@/lib/oyunlar/noktalama-havuzu'
import { BildirimDugmesi, type BildirimKolu } from '@/components/hata-bildir'
import { cn } from '@/lib/utils'
import { BosDurum, Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

/**
 * Oyun Bankası.
 *
 * Mini oyunlarda karıştırılan sorular burada birikiyor ve **yeniden
 * oynanıyor** — fotoğraflı Yanlış Soru Bankası'ndan farkı bu: oradaki kayıt
 * bakılacak bir görüntü, buradaki çözülecek bir soru.
 *
 * Bir kayıt bankadan ancak üst üste `DUSME_ESIGI` kez doğru bilinince düşüyor.
 * Tek doğru yetmiyor: bir kez tutturmak bilmek değil, hatırlamak olabilir.
 */

const AILE: Record<OyunId, { zemin: string; yazi: string; dolgu: string }> = {
  yazim: { zemin: 'bg-yzm', yazi: 'text-yzm-koyu', dolgu: 'bg-yzm-ok' },
  ses: { zemin: 'bg-yzm', yazi: 'text-yzm-koyu', dolgu: 'bg-yzm-ok' },
  oge: { zemin: 'bg-yzm', yazi: 'text-yzm-koyu', dolgu: 'bg-yzm-ok' },
  soz: { zemin: 'bg-yzm', yazi: 'text-yzm-koyu', dolgu: 'bg-yzm-ok' },
  islem: { zemin: 'bg-isl', yazi: 'text-isl-koyu', dolgu: 'bg-isl-ok' },
  bolunme: { zemin: 'bg-isl', yazi: 'text-isl-koyu', dolgu: 'bg-isl-ok' },
  aci: { zemin: 'bg-isl', yazi: 'text-isl-koyu', dolgu: 'bg-isl-ok' },
  ucgen: { zemin: 'bg-isl', yazi: 'text-isl-koyu', dolgu: 'bg-isl-ok' },
  edebiyat: { zemin: 'bg-edb', yazi: 'text-edb-koyu', dolgu: 'bg-edb-ok' },
  antlasma: { zemin: 'bg-trh', yazi: 'text-trh-koyu', dolgu: 'bg-trh-ok' },
  kavram: { zemin: 'bg-trh', yazi: 'text-trh-koyu', dolgu: 'bg-trh-ok' },
}

const KISA_AD: Record<OyunId, string> = {
  yazim: 'Yazım',
  ses: 'Ses Olayı',
  oge: 'Cümle Ögesi',
  soz: 'Deyim',
  islem: 'İşlem',
  bolunme: 'Bölünebilme',
  aci: 'Açı',
  ucgen: 'Üçgen',
  edebiyat: 'Edebiyat',
  antlasma: 'Antlaşma',
  kavram: 'Kavram',
}

type Suzgec = OyunId | 'tumu'

export function OyunBankasiEkrani({
  banka,
  onTurBaslat,
  bildir,
}: {
  banka: BankaKaydi[]
  /** Seçilen oyunun bankadaki sorularıyla bir tur açar. */
  onTurBaslat: (oyun: OyunId) => void
  bildir: BildirimKolu
}) {
  const [suzgec, setSuzgec] = useState<Suzgec>('tumu')
  const dagilim = useMemo(() => bankaDagilimi(banka), [banka])
  const gorunen = useMemo(() => bankaSuz(banka, suzgec), [banka, suzgec])

  /*
    Turun hangi oyundan açılacağı.

    Tur mantığı oyuna özgü — yazımda iki şık, işlemde tuş takımı, edebiyatta
    eşleştirme. Üçünü tek turda karıştırmak her birinin kendi ekranını bozardı,
    o yüzden "Tümü" seçiliyken en çok kaydı olan oyun açılıyor: en çok tekrar
    gereken yer orası.
  */
  const turOyunu: OyunId | null = suzgec === 'tumu' ? enKalabalikOyun(banka) : suzgec
  const turSayisi = turOyunu === null ? 0 : dagilim[turOyunu]

  if (banka.length === 0) {
    return (
      <div>
        <Baslik toplam={0} />
        <BosDurum
          simge={<Rabi durum="mutlu" boyut={72} />}
          baslik="Banka boş — iyi haber"
          aciklama="Mini oyunlarda yanlış bildiğin sorular buraya düşer. Üst üste üç kez doğru bilince kendiliğinden çıkarlar."
        />
      </div>
    )
  }

  return (
    <div>
      <Baslik toplam={banka.length} />

      {/* Özet + tek eylem. Bankanın tamamı için değil, süzgeçte seçili oyun
          için tur açılıyor; başlıkta hangisi olduğu yazıyor. */}
      <div className="golge-kart mb-4 rounded-2xl bg-card p-4">
        <p className="text-sm font-medium leading-relaxed text-muted-foreground">
          <b className="rakam font-extrabold text-foreground">{banka.length} soru</b> tekrar
          bekliyor
          {OYUN_KIMLIKLERI
            .filter((o) => dagilim[o] > 0)
            .map((o) => ` · ${dagilim[o]} ${KISA_AD[o].toLocaleLowerCase('tr')}`)
            .join('')}
          .
        </p>

        <Buton
          className="mt-3 w-full bg-ikincil text-white"
          disabled={turOyunu === null}
          onClick={() => turOyunu && onTurBaslat(turOyunu)}
        >
          {turOyunu === null
            ? 'Tur açılacak soru yok'
            : suzgec === 'tumu'
              ? `${oyunBul(turOyunu).ad} — ${turSayisi} soruyla bir tur`
              : 'Sadece bunlardan bir tur'}
        </Buton>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Banka turları rekora sayılmaz — sorular zaten gördüğün sorular.
        </p>
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        <SuzgecCipi
          etkin={suzgec === 'tumu'}
          sayi={banka.length}
          onClick={() => setSuzgec('tumu')}
        >
          Tümü
        </SuzgecCipi>
        {OYUN_KIMLIKLERI
          .filter((o) => dagilim[o] > 0)
          .map((o) => (
            <SuzgecCipi
              key={o}
              etkin={suzgec === o}
              sayi={dagilim[o]}
              onClick={() => setSuzgec(o)}
            >
              {KISA_AD[o]}
            </SuzgecCipi>
          ))}
      </div>

      <ul className="space-y-2.5">
        {gorunen.map((kayit) => (
          <li key={kayit.id}>
            <KayitKarti kayit={kayit} bildir={bildir} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Baslik({ toplam }: { toplam: number }) {
  return (
    <header className="mb-4 px-0.5">
      <p className="text-[11px] font-black tracking-[0.2em] text-ikincil">RABİ</p>
      <h1 className="mt-1 font-display text-[27px] font-extrabold tracking-tight">
        Oyun Bankası 🗂️
      </h1>
      <p className="mt-1 text-[13.5px] font-medium text-muted-foreground">
        {toplam > 0
          ? 'Oyunlarda karıştırdıkların. Üst üste üç doğruda düşer.'
          : 'Oyunlarda karıştırdığın sorular burada birikir.'}
      </p>
    </header>
  )
}

function SuzgecCipi({
  etkin,
  sayi,
  onClick,
  children,
}: {
  etkin: boolean
  sayi: number
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={etkin}
      onClick={onClick}
      className={cn(
        'flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-extrabold transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        etkin
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-card text-muted-foreground',
      )}
    >
      {children}
      <span className={cn('rakam font-bold', etkin ? 'opacity-70' : 'opacity-60')}>{sayi}</span>
    </button>
  )
}

function KayitKarti({ kayit, bildir }: { kayit: BankaKaydi; bildir: BildirimKolu }) {
  const aile = AILE[kayit.soru.oyun]

  return (
    <div className="golge-kart rounded-2xl bg-card p-3.5">
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            'shrink-0 rounded-lg px-2 py-1 text-[10.5px] font-extrabold',
            aile.zemin,
            aile.yazi,
          )}
        >
          {KISA_AD[kayit.soru.oyun]}
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-extrabold leading-tight">
            {bankaSorusuMetni(kayit.soru)}
          </p>
          <p className="mt-1 text-[13px] font-semibold text-success">
            {bankaCevabiMetni(kayit.soru)}
          </p>
          {/* Kural metni iki havuzdan gelebiliyor: noktalama kayıtları da
              bankada 'yazim' kimliğiyle duruyor, ayıran alan `isaretler`. */}
          {kayit.soru.oyun === 'yazim' && (
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {(kayit.soru.isaretler
                ? NOKTALAMA_ACIKLAMASI[kayit.soru.kural as NoktalamaKurali]
                : KURAL_ACIKLAMASI[kayit.soru.kural as YazimKurali]) ?? ''}
            </p>
          )}
        </div>

        <span className="rakam shrink-0 rounded-full bg-muted px-2 py-1 text-[10.5px] font-extrabold text-muted-foreground">
          {kayit.kacKez} kez
        </span>
      </div>

      {/* Düşme çubuğu: üst üste kaç doğru verildiği. Yanlışta sıfırlanıyor,
          o yüzden "ilerleme" değil "üst üste" diyor. */}
      <div className="mt-2.5 flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {Array.from({ length: DUSME_ESIGI }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full',
                i < kayit.ardisikDogru ? aile.dolgu : 'bg-muted',
              )}
            />
          ))}
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground">
          {kayit.ardisikDogru === 0
            ? `Üst üste ${DUSME_ESIGI} doğruda düşer`
            : `${kayit.ardisikDogru}/${DUSME_ESIGI} üst üste doğru`}
        </span>
      </div>

      <BildirimDugmesi soru={kayit.soru} kol={bildir} />
    </div>
  )
}
