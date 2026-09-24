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
import { DenklemYazisi } from '@/components/denklem-yazisi'

export type OyunOrnegi = {
  /** Kutunun üstündeki küçük turuncu etiket. */
  baslik: string
  /** Kutunun altındaki tek satırlık kural. `**kalın**` yerine <b> kullanılıyor. */
  kural: ReactNode
  /** Oyundan alınmış kare. */
  gorunum: ReactNode
}

/* --------------------------------------------------------------------------
   Ortak parçalar — bütün örnekler bu dört şeyden kuruluyor.

   Yerleşimler oyun ekranlarından alındı, tahmin edilmedi: dört şıklı
   oyunların hepsi şıkları **alt alta** diziyor (`flex flex-col`), yalnız
   noktalama turu, Özel Üçgenler ve Harita Avı'nın şık turu iki sütunlu.
   -------------------------------------------------------------------------- */

/** Beyaz zeminde bir cümle ya da sözcük — oyunun soru kartı. */
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

/** Oyun ekranındaki "…seç" satırı — soruyla şıkların arasında duruyor. */
function Yonerge({ children }: { children: ReactNode }) {
  return (
    <p className="text-center text-[12.5px] font-extrabold text-muted-foreground">{children}</p>
  )
}

/** Alt alta iki şık: dört şıklı oyunların düzeni. */
function Alt({ dogru, yanlis }: { dogru: string; yanlis: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Sik>{yanlis}</Sik>
      <Sik vurgulu>{dogru}</Sik>
    </div>
  )
}

/** Yan yana iki şık: noktalama, üçgen ve haritanın şık turu. */
function Yan({ sol, sag }: { sol: ReactNode; sag: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {sol}
      {sag}
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

/** Dört şıklı oyunların kısaltması: soru kartı, yönerge, iki şık. */
function DortSik({
  soru,
  yonerge,
  dogru,
  yanlis,
}: {
  soru: ReactNode
  yonerge: string
  dogru: string
  yanlis: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <Metin className="text-center">{soru}</Metin>
      <Yonerge>{yonerge}</Yonerge>
      <Alt dogru={dogru} yanlis={yanlis} />
    </div>
  )
}

/** Tuş takımıyla yazılan cevap. */
function Yazilan({ soru, cevap }: { soru: ReactNode; cevap: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 rounded-xl border-2 border-border bg-card px-3 py-2.5 text-center">
        {soru}
      </div>
      <div className="rakam flex-none rounded-xl bg-primary-dolu px-4 py-2.5 text-lg font-extrabold text-white">
        {cevap}
      </div>
    </div>
  )
}

/**
 * Eşleştirme tahtasının iki sırası.
 *
 * Tahta gerçekte altı çiftlik bir ızgara; buraya sığmıyor. Sığan şey
 * mekaniğin kendisi: üst sıradan biri, alt sıradan biri seçiliyor.
 */
function Tahta({
  ustBaslik,
  altBaslik,
  ust,
  alt,
}: {
  ustBaslik: string
  altBaslik: string
  ust: [string, string]
  alt: [string, string]
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10.5px] font-extrabold uppercase tracking-wide text-muted-foreground/75">
        {ustBaslik}
      </p>
      <Yan
        sol={
          <Sik vurgulu className="text-[13px]">
            {ust[0]}
          </Sik>
        }
        sag={<Sik className="text-[13px]">{ust[1]}</Sik>}
      />
      <p className="mt-0.5 text-[10.5px] font-extrabold uppercase tracking-wide text-muted-foreground/75">
        {altBaslik}
      </p>
      <Yan
        sol={<Sik className="text-[13px]">{alt[0]}</Sik>}
        sag={
          <Sik vurgulu className="text-[13px]">
            {alt[1]}
          </Sik>
        }
      />
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
          <b>Doğru</b> yazılışı şıklardan seçersin.
        </>
      ),
      gorunum: (
        <div className="flex flex-col gap-2">
          <Yonerge>Doğru yazılışı seç</Yonerge>
          <Alt dogru="yalnız" yanlis="yanlız" />
        </div>
      ),
    },
    {
      baslik: 'Noktalama turu',
      kural: (
        <>
          Cümledeki <b>yanlış</b> işareti şıklardan seçersin.
        </>
      ),
      gorunum: (
        <div className="flex flex-col gap-2">
          <Metin className="text-center font-bold">Ali, ve Ayşe geldi.</Metin>
          <Yonerge>Yanlış kullanılan işareti seç</Yonerge>
          <Yan
            sol={
              <Sik vurgulu>
                , <span className="text-[11px] font-semibold">virgül</span>
              </Sik>
            }
            sag={
              <Sik>
                . <span className="text-[11px] font-semibold">nokta</span>
              </Sik>
            }
          />
        </div>
      ),
    },
  ],

  ses: [
    {
      baslik: 'Ses olayı',
      kural: <>Sözcükte hangi olayın yaşandığını dört şıktan seçersin.</>,
      gorunum: (
        <DortSik
          soru={<span className="font-display text-lg font-extrabold">kitabı</span>}
          yonerge="Hangi ses olayı var?"
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
          İşaretli bölüm hangi <b>öge</b>, dört şıktan seçersin.
        </>
      ),
      gorunum: (
        <DortSik
          soru={
            <>
              <Isaret>Kardeşim</Isaret> dün kitabı okudu.
            </>
          }
          yonerge="İşaretli bölüm hangi öge?"
          dogru="Özne"
          yanlis="Belirtili nesne"
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
          soru={<span className="font-display font-extrabold">İpe un sermek</span>}
          yonerge="Anlamı hangisi?"
          dogru="Bahane uydurmak"
          yanlis="Acele etmek"
        />
      ),
    },
  ],

  bolunme: [
    {
      baslik: 'Evet mi, hayır mı?',
      kural: <>Sayı bölünüyor mu, iki düğmeden birine dokunursun.</>,
      gorunum: (
        <div className="flex flex-col gap-2">
          <p className="rakam text-center font-display text-2xl font-extrabold tracking-widest">
            126
          </p>
          <Yonerge>3’e bölünür mü?</Yonerge>
          <Alt dogru="Evet" yanlis="Hayır" />
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
      gorunum: (
        <Yazilan
          soru={
            <span className="rakam font-display text-lg font-extrabold tracking-widest">128</span>
          }
          cevap="3"
        />
      ),
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
      gorunum: (
        <Yazilan
          soru={<span className="rakam font-display text-lg font-extrabold">24 × 3</span>}
          cevap="72"
        />
      ),
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
        <Yazilan
          soru={
            <svg viewBox="0 0 120 56" className="mx-auto h-12" aria-hidden>
              <line x1="8" y1="48" x2="112" y2="48" stroke="currentColor" strokeWidth="3" />
              <line x1="60" y1="48" x2="24" y2="8" stroke="currentColor" strokeWidth="3" />
              <text x="28" y="42" fontSize="12" fontWeight="700" fill="currentColor">
                50°
              </text>
              <text x="72" y="42" fontSize="13" fontWeight="800" fill="var(--primary-dolu)">
                x
              </text>
            </svg>
          }
          cevap="130"
        />
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
        <div className="flex flex-col gap-2">
          <svg viewBox="0 0 90 56" className="mx-auto h-14" aria-hidden>
            <polygon points="12,48 78,48 12,8" fill="none" stroke="currentColor" strokeWidth="3" />
            <text x="0" y="32" fontSize="12" fontWeight="700" fill="currentColor">
              3
            </text>
            <text x="40" y="56" fontSize="12" fontWeight="700" fill="currentColor">
              4
            </text>
            <text x="46" y="24" fontSize="13" fontWeight="800" fill="var(--primary-dolu)">
              x
            </text>
          </svg>
          <Yan sol={<Sik>6</Sik>} sag={<Sik vurgulu>5</Sik>} />
        </div>
      ),
    },
  ],

  trigonometri: [
    {
      baslik: 'Dik üçgende oran',
      kural: (
        <>
          <b>α</b> işaretli üçgende istenen oranı dört şıktan seçersin: sin = karşı / hipotenüs,
          cos = komşu / hipotenüs, tan = karşı / komşu.
        </>
      ),
      gorunum: (
        <div className="flex flex-col gap-2">
          <Yonerge>sin α kaçtır?</Yonerge>
          <svg viewBox="0 0 96 58" className="mx-auto h-14" aria-hidden>
            <polygon points="14,48 80,48 14,8" fill="none" stroke="currentColor" strokeWidth="3" />
            <text x="2" y="32" fontSize="12" fontWeight="700" fill="currentColor">
              3
            </text>
            <text x="43" y="58" fontSize="12" fontWeight="700" fill="currentColor">
              4
            </text>
            <text x="50" y="24" fontSize="12" fontWeight="700" fill="currentColor">
              5
            </text>
            <text x="60" y="45" fontSize="12" fontWeight="800" fill="var(--primary-dolu)">
              α
            </text>
          </svg>
          <Yan sol={<Sik>4/5</Sik>} sag={<Sik vurgulu>3/5</Sik>} />
        </div>
      ),
    },
    {
      baslik: 'Tümler açı',
      kural: (
        <>
          Seviye yükselince şekil kalkar. α + β = 90° ise sin α = cos β ve tan α = cot β.
        </>
      ),
      gorunum: <DortSik soru="α + β = 90° · tan α = 3/4" yonerge="cot β kaçtır?" dogru="3/4" yanlis="4/3" />,
    },
  ],

  edebiyat: [
    {
      baslik: 'Eşleştirme',
      kural: <>Önce esere, sonra yazarına dokunursun — sıra fark etmez.</>,
      gorunum: (
        <Tahta
          ustBaslik="Eserler"
          altBaslik="Yazarlar"
          ust={['Çalıkuşu', 'Kuyucaklı Yusuf']}
          alt={['Sabahattin Ali', 'Reşat Nuri']}
        />
      ),
    },
  ],

  harita: [
    {
      baslik: 'Haritada bul',
      kural: <>İli haritada gösterirsin; küçük iller için yakınlaştırırsın.</>,
      gorunum: (
        <div className="flex items-center gap-3">
          <Metin className="flex-1 text-center font-display font-extrabold">Ankara</Metin>
          <div className="flex size-12 flex-none items-center justify-center rounded-xl border-2 border-dashed border-border text-xl">
            📍
          </div>
        </div>
      ),
    },
    {
      baslik: 'İşaretli il turu',
      kural: <>Yanıp sönen ilin adını dört şıktan seçersin.</>,
      gorunum: <Yan sol={<Sik>Çorum</Sik>} sag={<Sik vurgulu>Yozgat</Sik>} />,
    },
  ],

  antlasma: [
    {
      baslik: 'Madde eşleştirme',
      kural: <>Maddeyi ait olduğu antlaşmayla eşleştirirsin.</>,
      gorunum: (
        <Tahta
          ustBaslik="Maddeler"
          altBaslik="Antlaşmalar"
          ust={['Boğazlar komisyonu', 'Kapitülasyonlar']}
          alt={['Sevr', 'Lozan']}
        />
      ),
    },
  ],

  kavram: [
    {
      baslik: 'Kavram eşleştirme',
      kural: <>Kavrama, sonra tanımına dokunursun. Bazı tanımların karşılığı yok.</>,
      gorunum: (
        <Tahta
          ustBaslik="Kavramlar"
          altBaslik="Tanımlar"
          ust={['Tımar', 'Divan']}
          alt={['Devlet meclisi', 'Gelirle geçinen asker toprağı']}
        />
      ),
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
          soru="Yaklaşık iki saat kadar bekledik."
          yonerge="Bozukluğun sebebi hangisi?"
          dogru="Gereksiz sözcük kullanımı"
          yanlis="Anlam belirsizliği"
        />
      ),
    },
  ],

  koklu: [
    {
      baslik: 'Aralığı daralt',
      kural: (
        <>
          Çubuğun uçlarını sürükleyip onaylarsın; yalnız <b>en dar</b> aralık doğru.
        </>
      ),
      gorunum: (
        <div className="flex flex-col gap-2">
          <p className="rakam text-center font-display text-2xl font-extrabold">√50</p>
          <div className="relative h-9 rounded-full bg-muted">
            <div className="absolute inset-y-0 left-[46%] right-[26%] rounded-full bg-primary-dolu" />
            <span className="rakam absolute inset-y-0 left-[48%] flex items-center text-sm font-extrabold text-white">
              7
            </span>
            <span className="rakam absolute inset-y-0 right-[28%] flex items-center text-sm font-extrabold text-white">
              8
            </span>
          </div>
          <Sik vurgulu>Onayla</Sik>
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
          yonerge="Doğru cevabı seç"
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
          yonerge="Doğru cevabı seç"
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
        <div className="flex flex-col gap-2">
          <Metin>
            <span className="mr-2 rounded-md bg-primary-soft px-1.5 py-0.5 text-xs font-extrabold text-primary">
              1. ipucu
            </span>
            Çift zarflıyım.
          </Metin>
          <Alt dogru="Mitokondri" yanlis="Ribozom" />
        </div>
      ),
    },
  ],

  sirala: [
    {
      baslik: 'Zaman şeridi',
      kural: (
        <>
          Kartları sürükleyip <b>eskiden yeniye</b> dizip onaylarsın.
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

  iklim: [
    {
      baslik: 'İklim kuşağı',
      kural: (
        <>
          İşaretli bölgenin iklimini dört şıktan seçersin; çoğu <b>enlemden</b> okunur.
        </>
      ),
      gorunum: (
        <div className="flex flex-col gap-2">
          <div className="relative h-14 overflow-hidden rounded-xl border-2 border-border bg-card">
            {/* Dönenceler ve kutup dairesi: haritanın kesikli çizgileri. */}
            {[22, 38, 62, 78].map((ust) => (
              <span
                key={ust}
                className="absolute inset-x-0 border-t border-dashed border-border"
                style={{ top: `${ust}%` }}
              />
            ))}
            <span className="absolute left-[38%] top-[30%] size-4 rounded-full bg-primary-dolu" />
          </div>
          <Yonerge>Burada hangi iklim görülür?</Yonerge>
          <Alt dogru="Çöl iklimi" yanlis="Muson iklimi" />
        </div>
      ),
    },
  ],

  izohips: [
    {
      baslik: 'İzohips okuma',
      kural: (
        <>
          Eğrilerin üstündeki <b>sayılara</b> bak: tepe ile çukurun çizimi aynı, sayıları ters.
        </>
      ),
      gorunum: (
        <div className="flex flex-col gap-2">
          <svg viewBox="0 0 120 52" className="mx-auto h-14" aria-hidden>
            {[26, 18, 10].map((yaricap, sira) => (
              <ellipse
                key={yaricap}
                cx="60"
                cy="28"
                rx={yaricap}
                ry={yaricap * 0.62}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            ))}
            <circle
              cx="60"
              cy="28"
              r="14"
              fill="none"
              stroke="var(--primary-dolu)"
              strokeWidth="2.5"
            />
            <text x="86" y="20" fontSize="9" fontWeight="700" fill="currentColor">
              200
            </text>
            <text x="52" y="31" fontSize="9" fontWeight="700" fill="currentColor">
              400
            </text>
          </svg>
          <Yonerge>Daire içindeki şekil hangisi?</Yonerge>
          <Alt dogru="Tepe" yanlis="Kapalı çukur" />
        </div>
      ),
    },
  ],

  periyodik: [
    {
      baslik: 'Tabloda bul',
      kural: <>Elementi periyodik tabloda gösterirsin.</>,
      gorunum: (
        <div className="flex items-center gap-3">
          <Metin className="flex-1 text-center font-display font-extrabold">Kalsiyum</Metin>
          <div className="flex size-12 flex-none items-center justify-center rounded-xl border-2 border-dashed border-border font-display text-sm font-extrabold">
            Ca
          </div>
        </div>
      ),
    },
    {
      baslik: 'İşaretli hücre turu',
      kural: <>Yanıp sönen hücrenin adını ya da ailesini dört şıktan seçersin.</>,
      gorunum: <Yan sol={<Sik>Potasyum</Sik>} sag={<Sik vurgulu>Kalsiyum</Sik>} />,
    },
  ],

  formul: [
    {
      baslik: 'Formül eşleştirme',
      kural: <>Önce formüle, sonra adına dokunursun — sıra fark etmez.</>,
      gorunum: (
        <Tahta
          ustBaslik="Formüller"
          altBaslik="Adlar"
          ust={['H₂SO₄', 'HNO₃']}
          alt={['Nitrik asit', 'Sülfürik asit']}
        />
      ),
    },
  ],

  tepkime: [
    {
      baslik: 'Tepkime türü',
      kural: (
        <>
          Denklemi okur, türünü dört şıktan seçersin. Bir denklem iki türe girebilir; şıklarda
          yalnızca biri durur.
        </>
      ),
      gorunum: (
        <DortSik
          soru={
            <DenklemYazisi
              denklem="CaCO3(k) → CaO(k) + CO2(g)"
              className="font-display text-lg font-extrabold"
            />
          }
          yonerge="Hangi tepkime türü?"
          dogru="Analiz (ayrışma)"
          yanlis="Sentez (oluşum)"
        />
      ),
    },
  ],

  tuzak: [
    {
      baslik: 'Doğru mu, yanlış mı?',
      kural: (
        <>
          Kartı <b>sağa</b> sürüklersen doğru, <b>sola</b> sürüklersen yanlış demiş olursun.
        </>
      ),
      gorunum: (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="flex flex-1 items-center justify-center gap-1 rounded-full border-2 border-ikincil/40 py-1 text-[11.5px] font-extrabold uppercase tracking-wide text-ikincil">
              ← Yanlış
            </span>
            <span className="flex flex-1 items-center justify-center gap-1 rounded-full border-2 border-success/40 py-1 text-[11.5px] font-extrabold uppercase tracking-wide text-success">
              Doğru →
            </span>
          </div>
          <Metin className="rakam text-center font-display text-lg font-extrabold">
            (a + b)² = a² + b²
          </Metin>
        </div>
      ),
    },
  ],
}
