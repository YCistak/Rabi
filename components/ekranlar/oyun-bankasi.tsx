'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { OyunId } from '@/lib/types'
import { oyunBul } from '@/lib/oyunlar/tanim'
import {
  bankaCevabiMetni,
  bankaDagilimi,
  bankaSorusuMetni,
  bankaSuz,
  OYUN_KIMLIKLERI,
  enKalabalikOyun,
  type BankaKaydi,
  type BankaTuru,
} from '@/lib/oyunlar/banka'
import { KURAL_ACIKLAMASI, type YazimKurali } from '@/lib/oyunlar/yazim-havuzu'
import { NOKTALAMA_ACIKLAMASI, type NoktalamaKurali } from '@/lib/oyunlar/noktalama-havuzu'
import { BildirimDugmesi, type BildirimKolu } from '@/components/hata-bildir'
import { Check, ListChecks } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BosDurum, Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { BankaTestiEkrani } from '@/components/ekranlar/banka-testi'

/**
 * Oyun Bankası.
 *
 * Mini oyunlarda karıştırılan sorular burada birikiyor ve **yeniden
 * oynanıyor** — fotoğraflı Yanlış Soru Bankası'ndan farkı bu: oradaki kayıt
 * bakılacak bir görüntü, buradaki çözülecek bir soru.
 *
 * Bir kaydın çıkmasının iki yolu var ve ikisi aynı şey değil:
 *
 * - **Kazanılan çıkış** — genel testte doğru bilinmek (`banka-testi.tsx`).
 *   Bütün yanlışlar tek testte, karışık soruluyor; doğru bilinen düşüyor,
 *   yanlış bilinen olduğu gibi kalıyor. "Bankadan düşen" sayacı — ve ona bakan
 *   rozet — yalnızca bunun karşılığı.
 * - **Elle kaldırma** — karttaki tik. Banka bir borç listesi; öğrendiğine
 *   kullanıcının kendisi karar veremiyorsa liste büyümekten başka bir şey
 *   yapmıyor ve bir yerden sonra hiç açılmıyor. Tik sayacı ilerletmiyor, çünkü
 *   ölçtüğü tek şey kullanıcının tuşa basması.
 *
 * Kartın kendisi **tıklanabilir değil**. Bir süre dokunuş o soruyla tek
 * soruluk bir tur açıyordu; kaldırıldı, çünkü sorunun cevabı kartın üstünde
 * yazıyor ve hemen altında aynı soruyu çözmek bilmeyi değil okumayı ölçüyordu.
 * Aynı soru genel testte, cevabı görünmeden ve karışık sırada soruluyor.
 */

const AILE: Record<OyunId, { zemin: string; yazi: string }> = {
  yazim: { zemin: 'bg-yzm-kart', yazi: 'text-yzm-koyu' },
  ses: { zemin: 'bg-yzm-kart', yazi: 'text-yzm-koyu' },
  oge: { zemin: 'bg-yzm-kart', yazi: 'text-yzm-koyu' },
  soz: { zemin: 'bg-yzm-kart', yazi: 'text-yzm-koyu' },
  islem: { zemin: 'bg-isl-kart', yazi: 'text-isl-koyu' },
  bolunme: { zemin: 'bg-isl-kart', yazi: 'text-isl-koyu' },
  aci: { zemin: 'bg-isl-kart', yazi: 'text-isl-koyu' },
  ucgen: { zemin: 'bg-isl-kart', yazi: 'text-isl-koyu' },
  edebiyat: { zemin: 'bg-edb-kart', yazi: 'text-edb-koyu' },
  harita: { zemin: 'bg-cog-kart', yazi: 'text-cog-koyu' },
  iklim: { zemin: 'bg-cog-kart', yazi: 'text-cog-koyu' },
  izohips: { zemin: 'bg-cog-kart', yazi: 'text-cog-koyu' },
  antlasma: { zemin: 'bg-trh-kart', yazi: 'text-trh-koyu' },
  kavram: { zemin: 'bg-trh-kart', yazi: 'text-trh-koyu' },
  anlatim: { zemin: 'bg-yzm-kart', yazi: 'text-yzm-koyu' },
  koklu: { zemin: 'bg-isl-kart', yazi: 'text-isl-koyu' },
  ortak: { zemin: 'bg-byl-kart', yazi: 'text-byl-koyu' },
  siniflandirma: { zemin: 'bg-byl-kart', yazi: 'text-byl-koyu' },
  hucre: { zemin: 'bg-byl-kart', yazi: 'text-byl-koyu' },
  sirala: { zemin: 'bg-trh-kart', yazi: 'text-trh-koyu' },
  tuzak: { zemin: 'bg-isl-kart', yazi: 'text-isl-koyu' },
  periyodik: { zemin: 'bg-edb-kart', yazi: 'text-edb-koyu' },
  formul: { zemin: 'bg-edb-kart', yazi: 'text-edb-koyu' },
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
  harita: 'Harita',
  iklim: 'İklim',
  izohips: 'İzohips',
  antlasma: 'Antlaşma',
  kavram: 'Kavram',
  anlatim: 'Anlatım',
  koklu: 'Köklü Sayı',
  ortak: 'Ortak Özellik',
  siniflandirma: 'Sınıflandırma',
  hucre: 'Organel',
  sirala: 'Zaman Şeridi',
  tuzak: 'Kural Tuzağı',
  periyodik: 'Element',
  formul: 'Formül',
}

type Suzgec = OyunId | 'tumu'

export function OyunBankasiEkrani({
  banka,
  onTurBaslat,
  onKaldir,
  onTestBitti,
  sesAcik,
  bildir,
}: {
  banka: BankaKaydi[]
  /** Bankadan tur açar: o oyunun bütün kayıtlarıyla. */
  onTurBaslat: (tur: BankaTuru) => void
  /** Kaydı elle bankadan çıkarır — "bunu öğrendim". */
  onKaldir: (id: string) => void
  /** Genel test bitti: doğru bilinen kayıtlar bankadan düşüyor. */
  onTestBitti: (dogruIdler: string[]) => void
  sesAcik: boolean
  bildir: BildirimKolu
}) {
  const [suzgec, setSuzgec] = useState<Suzgec>('tumu')
  const [testAcik, setTestAcik] = useState(false)
  const dagilim = useMemo(() => bankaDagilimi(banka), [banka])
  const gorunen = useMemo(() => bankaSuz(banka, suzgec), [banka, suzgec])

  /*
    Oyun turunun hangi oyundan açılacağı.

    Tur mantığı oyuna özgü — yazımda iki şık, işlemde tuş takımı, edebiyatta
    eşleştirme. Hepsini tek turda karıştırmak her birinin kendi ekranını
    bozardı, o yüzden "Tümü" seçiliyken en çok kaydı olan oyun açılıyor: en çok
    tekrar gereken yer orası. Bütün oyunları karıştıran tek şey genel test ve
    o, soruları oyunun ekranında değil ortak bir şıklı biçimde soruyor.
  */
  const turOyunu: OyunId | null = suzgec === 'tumu' ? enKalabalikOyun(banka) : suzgec
  const turSayisi = turOyunu === null ? 0 : dagilim[turOyunu]

  /*
    Test açıkken liste hiç çizilmiyor.

    Listede her sorunun cevabı yazıyor; testin altında ya da arkasında duran
    bir kopyası, testin ölçtüğü şeyi ortadan kaldırırdı.
  */
  if (testAcik) {
    return (
      <BankaTestiEkrani
        banka={banka}
        sesAcik={sesAcik}
        onBitti={(dogruIdler) => {
          setTestAcik(false)
          onTestBitti(dogruIdler)
        }}
      />
    )
  }

  if (banka.length === 0) {
    return (
      <div>
        <Baslik toplam={0} />
        <BosDurum
          simge={<Rabi durum="mutlu" boyut={72} />}
          baslik="Banka boş — iyi haber"
          aciklama="Mini oyunlarda yanlış bildiğin sorular buraya düşer. Genel testte doğru bilince çıkar, öğrendiğine karar verdiklerini de tikle kaldırırsın."
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

        {/*
          Genel test önde ve dolu renkte: bankadan çıkışın kazanılan tek yolu o.
          Oyun turu altında ve çerçeveli — soruları kendi oyununun ekranında
          tekrar çözmek hâlâ mümkün, ama kaydı düşürmüyor.
        */}
        <Buton
          className="mt-3 w-full bg-ikincil text-white"
          disabled={banka.length < 2}
          onClick={() => setTestAcik(true)}
        >
          <ListChecks size={17} strokeWidth={2.8} aria-hidden />
          {banka.length < 2
            ? 'Genel test için en az iki soru gerekiyor'
            : `Genel test — ${banka.length} soru karışık`}
        </Buton>

        <Buton
          className="mt-2 w-full border border-border bg-card text-foreground"
          disabled={turOyunu === null}
          onClick={() => turOyunu && onTurBaslat({ oyun: turOyunu })}
        >
          {turOyunu === null
            ? 'Tur açılacak soru yok'
            : suzgec === 'tumu'
              ? `${oyunBul(turOyunu).ad} — ${turSayisi} soruyla bir tur`
              : 'Sadece bunlardan bir tur'}
        </Buton>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Genel testte doğru bildiğin soru bankadan düşer, yanlış bildiğin
          olduğu gibi kalır. Oyun turları rekora sayılmaz — sorular zaten
          gördüğün sorular.
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
            <KayitKarti kayit={kayit} onKaldir={() => onKaldir(kayit.id)} bildir={bildir} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Baslik({ toplam }: { toplam: number }) {
  return (
    <header className="mb-4 px-0.5">
      <p className="text-[11px] font-extrabold tracking-[0.2em] text-muted-foreground">RABİ</p>
      <h1 className="mt-1 font-display text-[27px] font-extrabold tracking-tight">
        Oyun Bankası 🗂️
      </h1>
      <p className="mt-1 text-[13.5px] font-medium text-muted-foreground">
        {toplam > 0
          ? 'Oyunlarda karıştırdıkların. Genel testte doğru bilince düşer, tikle sen de kaldırabilirsin.'
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

/** Kartın çıkış animasyonunun süresi (ms) — CSS'teki `bankaKalk` ile eşleşiyor. */
const KALKMA_SURESI = 420

function KayitKarti({
  kayit,
  onKaldir,
  bildir,
}: {
  kayit: BankaKaydi
  onKaldir: () => void
  bildir: BildirimKolu
}) {
  const aile = AILE[kayit.soru.oyun]
  /**
   * Kaldırma iki adımda.
   *
   * Kayıt anında yok olunca dokunuşun karşılığı görünmüyordu: liste kısalıyor
   * ama hangi kartın gittiği anlaşılmıyor, yanlış karta bastığını fark eden
   * kullanıcı da neyi kaybettiğini göremiyordu. Kart önce onaylanıp süzülüyor,
   * silme ondan sonra.
   */
  const [kalkiyor, setKalkiyor] = useState(false)
  const kaldirRef = useRef(onKaldir)
  kaldirRef.current = onKaldir

  useEffect(() => {
    if (!kalkiyor) return
    const zaman = setTimeout(() => kaldirRef.current(), KALKMA_SURESI)
    return () => clearTimeout(zaman)
  }, [kalkiyor])

  return (
    <div
      className={cn(
        'golge-kart relative rounded-2xl bg-card p-3.5',
        kalkiyor && 'banka-kalkiyor',
      )}
      // Animasyon sürerken karta ikinci kez basılabilseydi `onKaldir` iki kez
      // çağrılırdı; kimliğe göre süzüldüğü için zararsız ama tuş da yanıt
      // vermiş gibi görünürdü.
      aria-hidden={kalkiyor || undefined}
    >
      {/*
        Kartın gövdesi okunacak bir şey, dokunulacak bir şey değil.

        Bir süre tıklanabilirdi ve dokunuş o soruyla tek soruluk bir tur
        açıyordu; kaldırıldı, çünkü doğru cevap kartın üstünde yazıyor ve
        cevabı okuduktan hemen sonra çözülen soru bilmeyi ölçmüyor. Aynı soru
        genel testte cevabı görünmeden soruluyor.
      */}
      <div className="flex w-full items-start gap-2.5 text-left">
        <span
          className={cn(
            'shrink-0 rounded-lg px-2 py-1 text-[10.5px] font-extrabold',
            aile.zemin,
            aile.yazi,
          )}
        >
          {KISA_AD[kayit.soru.oyun]}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-display text-[15px] font-extrabold leading-tight">
            {bankaSorusuMetni(kayit.soru)}
          </span>
          <span className="mt-1 block text-[13px] font-semibold text-success">
            {bankaCevabiMetni(kayit.soru)}
          </span>
          {/* Kural metni iki havuzdan gelebiliyor: noktalama kayıtları da
              bankada 'yazim' kimliğiyle duruyor, ayıran alan `isaretler`. */}
          {kayit.soru.oyun === 'yazim' && (
            <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
              {(kayit.soru.isaretler
                ? NOKTALAMA_ACIKLAMASI[kayit.soru.kural as NoktalamaKurali]
                : KURAL_ACIKLAMASI[kayit.soru.kural as YazimKurali]) ?? ''}
            </span>
          )}
        </span>

        <span className="rakam shrink-0 rounded-full bg-muted px-2 py-1 text-[10.5px] font-extrabold text-muted-foreground">
          {kayit.kacKez} kez
        </span>
      </div>

      {/* Sağ pay tikin yeri: bildirim satırının yazısı tuşun altına girmesin. */}
      <div className="pr-11">
        <BildirimDugmesi soru={kayit.soru} kol={bildir} />
      </div>

      {/*
        Kaldırma tuşu kartın sağ alt köşesinde, akışın içinde değil.

        Yeri kasıtlı olarak sıradan: kartın asıl işi soruyu göstermek, bu tuş
        "bununla işim bitti" demenin yolu. Akışa konsaydı bildirim satırıyla
        aynı ağırlıkta görünür, kart da iki eylemli bir forma dönerdi.
      */}
      <button
        type="button"
        onClick={() => setKalkiyor(true)}
        disabled={kalkiyor}
        aria-label="Bu soruyu bankadan kaldır"
        title="Öğrendim, bankadan kaldır"
        className={cn(
          'absolute bottom-2.5 right-2.5 grid size-9 place-items-center rounded-full transition active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          // Basılınca dolu yeşile dönüyor: kart gitmeden önce kararın alındığı
          // görünüyor ve gidişin sebebi tikte kalıyor.
          kalkiyor ? 'tik-dolu bg-success text-white' : 'bg-success-soft text-success',
        )}
      >
        <Check size={18} strokeWidth={3} aria-hidden />
      </button>
    </div>
  )
}
