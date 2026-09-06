'use client'

/**
 * Tanıtım ekranındaki örnek kutuları.
 *
 * Kuralı anlatan paragrafın yerine **oyunun kendisinden bir kare** koyuyor:
 * "doğru yazılışa dokunursun" cümlesini okumak yerine iki kutu görüyorsun,
 * doğru olan turuncu. Metin okunmadan geçiliyordu; oyunun görüntüsü
 * geçilmiyor, çünkü birazdan göreceği ekranın aynısı.
 *
 * Kutular gerçek bileşenleri kullanmıyor, onların **taklidi**: tanıtım
 * dokunulamayan bir vitrin, oyun ekranlarının durum mantığını buraya
 * taşımak (şık seçimi, sürükleme, tuş takımı) tanıtımı oyunun ikinci bir
 * kopyası hâline getirirdi.
 *
 * Her oyunun bir ya da iki kutusu var; ikiden fazlası ekrana sığmıyor.
 */

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { OyunId } from '@/lib/types'

export type OyunOrnegi = {
  /** Kutunun üstündeki küçük turuncu etiket. */
  baslik: string
  /** Kutunun altındaki tek satırlık kural. `**kalın**` yerine <b> kullanılıyor. */
  kural: ReactNode
  /** Oyundan alınmış kare. */
  gorunum: ReactNode
}

/* --------------------------------------------------------------------------
   Ortak parçalar — bütün örnekler bu üç şeyden kuruluyor.
   -------------------------------------------------------------------------- */

/** Beyaz zeminde bir cümle ya da sözcük. */
function Metin({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border-2 border-border bg-card px-3 py-2.5 text-[15px] leading-snug',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Şık ya da düğme; `vurgulu` olan doğru cevabı gösteriyor. */
function Sik({
  children,
  vurgulu,
  className,
}: {
  children: ReactNode
  vurgulu?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border-2 px-3 py-2 text-center text-sm font-bold leading-snug',
        vurgulu
          ? 'border-primary-dolu bg-primary-dolu text-white'
          : 'border-border bg-card text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Yan yana iki şık. */
function Ikili({ sol, sag }: { sol: ReactNode; sag: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1">{sol}</div>
      <div className="flex-1">{sag}</div>
    </div>
  )
}

/** Cümlenin içinde işaretlenmiş bölüm. */
function Isaret({ children }: { children: ReactNode }) {
  return (
    <span className="mx-0.5 inline-block rounded-md bg-primary-dolu px-1.5 font-extrabold text-white">
      {children}
    </span>
  )
}

/** Eşleştirme oyunlarının iki kartı: üstteki soru, alttaki karşılığı. */
function Eslesme({ ust, alt }: { ust: string; alt: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Metin className="text-center text-sm">{ust}</Metin>
      <Sik vurgulu>{alt}</Sik>
    </div>
  )
}

/** Dört şıklı oyunların iki şıklık kısaltması. */
function DortSik({ soru, dogru, yanlis }: { soru: ReactNode; dogru: string; yanlis: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      <Metin>{soru}</Metin>
      <Ikili sol={<Sik>{yanlis}</Sik>} sag={<Sik vurgulu>{dogru}</Sik>} />
    </div>
  )
}

/** Tuş takımına yazılan cevap. */
function Yazilan({ soru, cevap }: { soru: string; cevap: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="rakam flex-1 rounded-xl border-2 border-border bg-card px-3 py-2.5 text-center text-lg font-extrabold">
        {soru}
      </div>
      <div className="rakam flex-none rounded-xl bg-primary-dolu px-4 py-2.5 text-lg font-extrabold text-white">
        {cevap}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------------------
   Oyun oyun örnekler.
   -------------------------------------------------------------------------- */

export const OYUN_ORNEKLERI: Record<OyunId, OyunOrnegi[]> = {
  yazim: [
    {
      baslik: 'Yazım turu',
      kural: (
        <>
          <b>Doğru</b> yazılışa dokunursun.
        </>
      ),
      gorunum: (
        <Ikili sol={<Sik className="line-through">yanlız</Sik>} sag={<Sik vurgulu>yalnız</Sik>} />
      ),
    },
    {
      baslik: 'Noktalama turu',
      kural: (
        <>
          Cümledeki <b>yanlış</b> işarete dokunursun.
        </>
      ),
      gorunum: (
        <Metin>
          Ali<Isaret>,</Isaret> ve Ayşe geldi.
        </Metin>
      ),
    },
  ],

  ses: [
    {
      baslik: 'Ses olayı',
      kural: <>Sözcükte hangi olay yaşanmış, dört şıktan seçersin.</>,
      gorunum: (
        <DortSik
          soru={<span className="text-center font-bold">kitabı</span>}
          dogru="Ünsüz yumuşaması"
          yanlis="Ünlü düşmesi"
        />
      ),
    },
  ],

  oge: [
    {
      baslik: 'Vurgulu bölüm',
      kural: (
        <>
          İşaretli bölüm hangi <b>öge</b>, onu seçersin.
        </>
      ),
      gorunum: (
        <DortSik
          soru={
            <>
              <Isaret>Kardeşim</Isaret> dün kitabı okudu.
            </>
          }
          dogru="Özne"
          yanlis="Nesne"
        />
      ),
    },
  ],

  soz: [
    {
      baslik: 'Deyim ve atasözü',
      kural: <>Gelen sözün anlamını dört şıktan seçersin.</>,
      gorunum: (
        <DortSik
          soru={<span className="font-bold">İpe un sermek</span>}
          dogru="Bahane uydurmak"
          yanlis="Acele etmek"
        />
      ),
    },
  ],

  bolunme: [
    {
      baslik: 'Bölünür mü?',
      kural: <>Sayı bölünüyor mu, iki düğmeden birine dokunursun.</>,
      gorunum: (
        <div className="flex flex-col gap-2.5">
          <Metin className="rakam text-center text-lg font-extrabold">126 · 3</Metin>
          <Ikili sol={<Sik vurgulu>Bölünür</Sik>} sag={<Sik>Bölünmez</Sik>} />
        </div>
      ),
    },
    {
      baslik: 'Kalan turu',
      kural: (
        <>
          Kalanı <b>tuş takımıyla</b> yazarsın.
        </>
      ),
      gorunum: <Yazilan soru="128 · 5" cevap="3" />,
    },
  ],

  islem: [
    {
      baslik: 'Zihinden işlem',
      kural: (
        <>
          Sonucu <b>tuş takımıyla</b> yazıp onaylarsın.
        </>
      ),
      gorunum: <Yazilan soru="24 × 3" cevap="72" />,
    },
  ],

  aci: [
    {
      baslik: 'Açı tamamlama',
      kural: (
        <>
          <b>x</b> kaç derece, tuş takımıyla yazarsın. Şekiller ölçekli.
        </>
      ),
      gorunum: (
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 120 60" className="h-14 flex-1" aria-hidden>
            <line x1="8" y1="52" x2="112" y2="52" stroke="currentColor" strokeWidth="3" />
            <line x1="60" y1="52" x2="24" y2="10" stroke="currentColor" strokeWidth="3" />
            <text x="30" y="46" fontSize="12" fontWeight="700" fill="currentColor">
              50°
            </text>
            <text x="72" y="46" fontSize="13" fontWeight="800" fill="var(--primary-dolu)">
              x
            </text>
          </svg>
          <div className="rakam flex-none rounded-xl bg-primary-dolu px-4 py-2.5 text-lg font-extrabold text-white">
            130
          </div>
        </div>
      ),
    },
  ],

  ucgen: [
    {
      baslik: 'Özel üçgen',
      kural: (
        <>
          <b>x</b> kenarını iki şıktan seçersin.
        </>
      ),
      gorunum: (
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 90 60" className="h-14 w-20 flex-none" aria-hidden>
            <polygon
              points="12,52 78,52 12,10"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <text x="0" y="34" fontSize="12" fontWeight="700" fill="currentColor">
              3
            </text>
            <text x="40" y="60" fontSize="12" fontWeight="700" fill="currentColor">
              4
            </text>
            <text x="48" y="26" fontSize="13" fontWeight="800" fill="var(--primary-dolu)">
              x
            </text>
          </svg>
          <div className="flex flex-1 gap-2.5">
            <Sik className="flex-1">6</Sik>
            <Sik vurgulu className="flex-1">
              5
            </Sik>
          </div>
        </div>
      ),
    },
  ],

  edebiyat: [
    {
      baslik: 'Eşleştirme',
      kural: <>Önce esere, sonra yazarına dokunursun — sıra fark etmez.</>,
      gorunum: <Eslesme ust="Çalıkuşu" alt="Reşat Nuri Güntekin" />,
    },
  ],

  harita: [
    {
      baslik: 'Haritada bul',
      kural: <>İli haritada gösterirsin; harita iki parmakla yakınlaşır.</>,
      gorunum: (
        <div className="flex items-center gap-3">
          <Metin className="flex-1 text-center font-bold">Ankara’yı bul</Metin>
          <div className="flex size-12 flex-none items-center justify-center rounded-xl border-2 border-primary-dolu bg-primary-soft text-xl">
            📍
          </div>
        </div>
      ),
    },
  ],

  antlasma: [
    {
      baslik: 'Madde eşleştirme',
      kural: <>Maddeyi ait olduğu antlaşmayla eşleştirirsin.</>,
      gorunum: <Eslesme ust="Boğazlar komisyonu kurulacak." alt="Lozan" />,
    },
  ],

  kavram: [
    {
      baslik: 'Kavram eşleştirme',
      kural: <>Kavrama, sonra tanımına dokunursun. Bazı tanımların karşılığı yok.</>,
      gorunum: <Eslesme ust="Tımar" alt="Gelirle geçinen asker toprağı" />,
    },
  ],

  anlatim: [
    {
      baslik: 'Bozukluğun sebebi',
      kural: (
        <>
          Cümleyi düzeltmen değil, hatayı <b>adlandırman</b> isteniyor.
        </>
      ),
      gorunum: (
        <DortSik
          soru="Hiç kimse ona ne yardım etti ne de destek oldu."
          dogru="Tamlama yanlışı"
          yanlis="Özne eksikliği"
        />
      ),
    },
  ],

  koklu: [
    {
      baslik: 'Aralığı daralt',
      kural: (
        <>
          Çubuğun uçlarını sürüklersin; yalnız <b>en dar</b> aralık doğru.
        </>
      ),
      gorunum: (
        <div className="flex flex-col gap-2.5">
          <Metin className="rakam text-center text-lg font-extrabold">√50</Metin>
          <div className="relative h-9 rounded-full bg-muted">
            <div className="absolute inset-y-0 left-[46%] right-[26%] rounded-full bg-primary-dolu" />
            <span className="rakam absolute inset-y-0 left-[48%] flex items-center text-sm font-extrabold text-white">
              7
            </span>
            <span className="rakam absolute inset-y-0 right-[28%] flex items-center text-sm font-extrabold text-white">
              8
            </span>
          </div>
        </div>
      ),
    },
  ],

  ortak: [
    {
      baslik: 'Ortak özellikler',
      kural: <>Gelen soruyu dört şıktan cevaplarsın.</>,
      gorunum: (
        <DortSik
          soru="Bütün canlılarda bulunan yapı hangisidir?"
          dogru="Hücre"
          yanlis="Kloroplast"
        />
      ),
    },
  ],

  siniflandirma: [
    {
      baslik: 'Sınıflandırma',
      kural: <>Taksonomi, ikili adlandırma ve âlemler üstüne sorular gelir.</>,
      gorunum: (
        <DortSik
          soru="İkili adlandırmada ilk sözcük neyi gösterir?"
          dogru="Cins"
          yanlis="Tür"
        />
      ),
    },
  ],

  hucre: [
    {
      baslik: 'İpucu kartı',
      kural: (
        <>
          Kart üç saniyede bir yeni ipucu açar; erken bilmek <b>çok puan</b>.
        </>
      ),
      gorunum: (
        <div className="flex flex-col gap-2.5">
          <Metin>
            <span className="mr-2 rounded-md bg-primary-soft px-1.5 py-0.5 text-xs font-extrabold text-primary">
              1. ipucu
            </span>
            Çift zarflıyım.
          </Metin>
          <Ikili sol={<Sik>Ribozom</Sik>} sag={<Sik vurgulu>Mitokondri</Sik>} />
        </div>
      ),
    },
  ],

  sirala: [
    {
      baslik: 'Zaman şeridi',
      kural: (
        <>
          Kartları sürükleyip <b>eskiden yeniye</b> dizersin.
        </>
      ),
      gorunum: (
        <div className="flex flex-col gap-1.5">
          {['Malazgirt', 'İstanbul’un Fethi', 'Lozan'].map((olay, sira) => (
            <div
              key={olay}
              className="flex items-center gap-2 rounded-xl border-2 border-border bg-card px-3 py-1.5 text-sm font-bold"
            >
              <span aria-hidden className="text-muted-foreground">
                ⠿
              </span>
              <span className="rakam text-primary">{sira + 1}</span>
              <span className="min-w-0 truncate">{olay}</span>
            </div>
          ))}
        </div>
      ),
    },
  ],

  tuzak: [
    {
      baslik: 'Doğru mu, yanlış mı?',
      kural: (
        <>
          Doğruysa kartı <b>sağa</b>, yanlışsa <b>sola</b> atarsın.
        </>
      ),
      gorunum: (
        <div className="flex items-center gap-2.5">
          <Sik className="flex-none px-3">←</Sik>
          <Metin className="rakam flex-1 text-center text-lg font-extrabold">
            (a + b)² = a² + b²
          </Metin>
          <Sik className="flex-none px-3">→</Sik>
        </div>
      ),
    },
  ],
}
