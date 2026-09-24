'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { BilgiKarti, Konu } from '@/lib/konu'
import type { HaritaTemasi } from '@/lib/konu/harita-temasi'
import { desteAkisi, molaSecimi, type DesteAdimi } from '@/lib/konu/deste-akisi'
import { useGeriKatmani } from '@/lib/geri'
import { useUygulamaGorunur } from '@/lib/gorunurluk'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { KartGorseli } from './kart-gorseli'
import { KartMetni } from './kart-metni'
import { DesteBasligi, DesteCubugu } from './deste-basligi'
import { KisaMola } from './kisa-mola'
import { HizliKontrolEkrani } from './hizli-kontrol'

/**
 * Bilgi kartı destesi.
 *
 * Deste **karar sormuyor**: kartlar Geri ve İlerle ile okunuyor. Bir süre her
 * kartta "biliyorum / bilmiyorum" soruluyor, bilmediklerin ayrı bir bankaya
 * düşüyordu; ikisi de kaldırıldı. Okumanın ortasında sorulan bir soru
 * okumayı bir sınava çeviriyordu — kartın işi bir şeyi hatırlatmak,
 * kullanıcıyı ölçmek değil.
 *
 * Kartların arasına iki **ara ekran** giriyor (`lib/konu/deste-akisi.ts`):
 * bir kısa mola ve içerik yazılmışsa bir–iki hızlı kontrol. Kontrol yukarıdaki
 * kuralı bozmuyor: her kartta değil, destede bir–iki kez ve iki şıkla. Ara
 * ekranlar kart sayılmıyor — `okunan` ve ilerleme çubuğu yalnızca kartları
 * sayıyor.
 *
 * Kayıt olarak yalnızca **kaç karta kadar gidildiği** ve destenin bitip
 * bitmediği tutuluyor (`DesteSonucu`); harita bu ikisini gösteriyor.
 *
 * Destenin kendi bitiş ekranı yok ve olmayacak: son karttan sonra soru sahnesi
 * geliyor (`soru-sahnesi.tsx`), okumanın bittiğini söyleyen ekran da özet de
 * orada. Deste kendi bitişini de çizseydi arka arkaya iki kapanış ekranı
 * olurdu — biri dersin aydınlık zemininde, öteki sahnenin koyusunda, ikisi de
 * aynı şeyi söyleyerek.
 *
 * Tasarım kaynağı `tasarim/bilgi-karti.html`. Oradaki serif başlık alınmadı
 * (uygulamada tek yazı tipi var, başlık ayrı kalınlık — `font-display`);
 * mavi ise Fizik'in rengiydi ve burada dersin mürekkebi (`bicim.murekkep`)
 * onun yerine geçiyor.
 */

export type DesteSonucu = {
  /** Okunan kart sayısı — gidilen en ileri kart. */
  okunan: number
  /** Destenin sonuna gelindi mi. Yarıda çıkıldıysa `false`. */
  bitti: boolean
  /**
   * Deste açıkken ve uygulama **öndeyken** geçen süre, saniye.
   *
   * Ekranda gösterilmiyor; aylık özetin "konu haritasında geçen süre"
   * kutusu için ölçülüyor. Arka plandaki süre sayılmıyor: ana tuşa basılınca
   * WebView durmuyor ve deste açık kalıyor, o dakikalar okuma değil.
   */
  saniye: number
}

export function KartDestesi({
  konu,
  temaAdi,
  dersAdi,
  dersIkonu,
  bicim,
  onKapat,
}: {
  konu: Konu
  temaAdi: string
  dersAdi: string
  /** Kartın üstünde duran ders simgesi (`KonuDersTanimi.ikon`). */
  dersIkonu: string
  /**
   * Haritanın ders biçimi (`lib/konu/harita-temasi.ts`). Zemin oradan
   * geliyor — haritadan buraya geçerken renk değişmiyor: Matematik'in pembe
   * bandından krem bir desteye düşmek, başka bir derse geçilmiş gibi
   * duruyordu. Mürekkep rengi de aynı yerden: sayfa numarası, şerit ve
   * çubuk dersin rengini taşıyor.
   */
  bicim: HaritaTemasi
  onKapat: (sonuc: DesteSonucu) => void
}) {
  /*
    Akış ve mola metni deste açılırken **bir kez** kuruluyor: rastgelelik her
    çizimde yeniden atılsaydı mola bir karede oradan oraya kayardı. Bileşen
    yalnızca kullanıcı bir kitaba dokununca çiziliyor, sunucu çıktısı yok —
    `Math.random` burada güvenli.
  */
  const [akis] = useState<DesteAdimi[]>(() => desteAkisi(konu.kartlar.length, konu.kontroller))
  const [molaSecimi_] = useState(() => molaSecimi())

  const [adim, setAdim] = useState(0)
  /** Gidilen en ileri kart sayısı; geri dönüp yeniden ilerlemek sayıyı büyütmüyor. */
  const [enIleri, setEnIleri] = useState(1)
  /** Süzülme yönü: ileri 1, geri −1. Kartın giriş animasyonunu bu belirliyor. */
  const [yon, setYon] = useState(1)

  const bu = akis[adim]
  const sonAdim = adim >= akis.length - 1
  const toplam = konu.kartlar.length

  /** Bu adıma kadar okunmuş kart sayısı (bu adım karttsa o da dâhil). */
  const okunanBuraya = useMemo(
    () => akis.slice(0, adim + 1).filter((a) => a.tur === 'kart').length,
    [akis, adim],
  )

  /*
    Süre ölçümü: görünür olunan her aralığın başı damgalanıyor, aralık
    kapanınca (arka plana gidiş ya da deste kapanışı) fark birikiyor. Sayaç
    yok, state yok — her saniye çizim yenilenmesin; okunan değer yalnızca
    kapanışta lazım.
  */
  const gorunur = useUygulamaGorunur()
  const birikenRef = useRef(0)
  const araBasiRef = useRef<number | null>(null)
  useEffect(() => {
    if (gorunur) {
      araBasiRef.current = Date.now()
      return
    }
    if (araBasiRef.current !== null) birikenRef.current += Date.now() - araBasiRef.current
    araBasiRef.current = null
  }, [gorunur])
  const gecenSaniye = () => {
    const acik = araBasiRef.current !== null ? Date.now() - araBasiRef.current : 0
    return Math.round((birikenRef.current + acik) / 1000)
  }

  const sonucRef = useRef<DesteSonucu>({ okunan: 1, bitti: false, saniye: 0 })
  sonucRef.current = { okunan: Math.min(enIleri, toplam), bitti: false, saniye: 0 }
  const sonucla = (): DesteSonucu => ({ ...sonucRef.current, saniye: gecenSaniye() })
  useGeriKatmani(true, () => onKapat(sonucla()))

  function ilerle() {
    if (sonAdim) {
      onKapat({ okunan: toplam, bitti: true, saniye: gecenSaniye() })
      return
    }
    setYon(1)
    const sonraki = akis[adim + 1]
    if (sonraki.tur === 'kart') setEnIleri((ileri) => Math.max(ileri, sonraki.sira + 1))
    setAdim((o) => o + 1)
  }

  function geri() {
    if (adim === 0) return
    setYon(-1)
    // Geri, ara ekranı atlayarak bir önceki **karta** gidiyor: molayı ikinci
    // kez izlemenin, kontrolü ikinci kez cevaplamanın anlamı yok.
    let hedef = adim - 1
    while (hedef > 0 && akis[hedef].tur !== 'kart') hedef--
    setAdim(hedef)
  }

  /** Kontrolün dayandığı karta dönüş — "Tekrar oku". */
  function kartaDon(kartSirasi: number) {
    const hedef = akis.findIndex((a) => a.tur === 'kart' && a.sira === kartSirasi - 1)
    if (hedef < 0) return
    setYon(-1)
    setAdim(hedef)
  }

  // Adım değişince sayfa başa dönmeli: uzun bir karttan sonra gelen kısa kart
  // ekranın ortasından başlıyordu.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [adim])

  const kapat = () => onKapat(sonucla())

  return (
    <div
      className="deste-zemin fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: bicim.zemin }}
    >
      {bu.tur === 'mola' && (
        <KisaMola
          konuAdi={konu.ad}
          dersAdi={dersAdi}
          temaAdi={temaAdi}
          bicim={bicim}
          okunanKartlar={konu.kartlar.slice(0, okunanBuraya)}
          toplam={toplam}
          secim={molaSecimi_}
          onKapat={kapat}
          onIlerle={ilerle}
        />
      )}
      {bu.tur === 'kontrol' && (
        <HizliKontrolEkrani
          /* Aynı destede iki kontrol art arda gelirse React aynı düğümü
             yeniden kullanır ve ilkinin cevabı ikincisinde seçili kalırdı. */
          key={bu.sira}
          konuAdi={konu.ad}
          dersAdi={dersAdi}
          temaAdi={temaAdi}
          bicim={bicim}
          kontrol={konu.kontroller[bu.sira]}
          okunan={okunanBuraya}
          toplam={toplam}
          onKapat={kapat}
          onTekrarOku={() => kartaDon(konu.kontroller[bu.sira].kart)}
          onDevam={ilerle}
        />
      )}
      {bu.tur === 'kart' && (
        <KartEkrani
          kart={konu.kartlar[bu.sira]}
          sira={bu.sira}
          toplam={toplam}
          konuAdi={konu.ad}
          dersAdi={dersAdi}
          temaAdi={temaAdi}
          dersIkonu={dersIkonu}
          bicim={bicim}
          yon={yon}
          ilk={adim === 0}
          son={sonAdim}
          onKapat={kapat}
          onGeri={geri}
          onIlerle={ilerle}
        />
      )}
    </div>
  )
}

/**
 * Tek bir kartın ekranı: başlık, bölmeli çubuk, kâğıt destesi gibi duran
 * kart, altında Rabi'nin notu ve iki düğme.
 *
 * Kartın arkasında iki soluk şerit var — bir destenin üstündeki kart gibi
 * dursun diye; "sayfayı çevir" düğmesi bu görüntüden anlam kazanıyor.
 */
function KartEkrani({
  kart,
  sira,
  toplam,
  konuAdi,
  dersAdi,
  temaAdi,
  dersIkonu,
  bicim,
  yon,
  ilk,
  son,
  onKapat,
  onGeri,
  onIlerle,
}: {
  kart: BilgiKarti
  sira: number
  toplam: number
  konuAdi: string
  dersAdi: string
  temaAdi: string
  dersIkonu: string
  bicim: HaritaTemasi
  yon: number
  ilk: boolean
  son: boolean
  onKapat: () => void
  onGeri: () => void
  onIlerle: () => void
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="shrink-0 px-4 pt-[calc(0.75rem+var(--guvenli-ust))]">
        <DesteBasligi
          konuAdi={konuAdi}
          dersAdi={dersAdi}
          temaAdi={temaAdi}
          onKapat={onKapat}
          sag={
            <span className="golge-kart flex h-11 shrink-0 items-baseline rounded-[14px] bg-card px-3.5 leading-[44px]">
              <span
                className="rakam font-display text-[17px] font-extrabold"
                style={{ color: bicim.murekkep }}
              >
                {sira + 1}
              </span>
              <span className="rakam text-[12px] font-bold text-muted-foreground">/{toplam}</span>
            </span>
          }
        />
        <DesteCubugu toplam={toplam} okunan={sira + 1} acik={sira} bicim={bicim} />
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-[calc(1rem+var(--guvenli-alt))]">
        {/*
          Kutu **kaydırılabilir**: görselli kartlar yazıdan uzun ve kısa bir
          telefonda alt kenardan taşıyordu. `my-auto` yalnızca sığan içeriği
          ortalıyor; sığmayan yukarıdan başlayıp kaydırılıyor.
        */}
        <div className="mx-auto flex w-full max-w-md min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          <div className="my-auto w-full">
            {/* Ders simgesi ve altındaki çizgi: kartın üstündeki boşluğu
                dolduruyor ve destenin hangi derse ait olduğunu söylüyor. */}
            <div className="flex min-h-[70px] flex-col items-center justify-center gap-2.5">
              <span
                aria-hidden
                className="text-[38px] leading-none drop-shadow-[0_6px_8px_rgba(31,36,48,0.14)]"
              >
                {dersIkonu}
              </span>
              <span className="h-px w-full bg-black/12" />
            </div>

            <div className="relative mt-3.5">
              {/* Arkadaki iki kâğıt. */}
              <span
                aria-hidden
                className="absolute inset-x-4 -top-2.5 h-5 rounded-t-2xl bg-black/[0.06]"
              />
              <span
                aria-hidden
                className="absolute inset-x-2 -top-[5px] h-4 rounded-t-2xl bg-card/70"
              />

              <article
                /* `key` sıraya bağlı: React aynı düğümü yeniden kullanırsa yazı
                   değişir ama giriş animasyonu hiç oynamaz ve kart yerinde takas
                   edilmiş gibi görünür. */
                key={kart.id}
                style={{ '--deste-yon': yon } as React.CSSProperties}
                className="deste-karti relative w-full overflow-hidden rounded-[20px] bg-card shadow-[0_1px_2px_rgba(31,36,48,0.12),0_16px_34px_-18px_rgba(31,36,48,0.35)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: bicim.murekkep }}
                />
                {/* Sağ altta iki soluk halka: kartın köşesi boş kalmasın. */}
                <span
                  aria-hidden
                  className="absolute -right-14 -bottom-14 size-44 rounded-full border-[1.5px] opacity-[0.13]"
                  style={{ borderColor: bicim.murekkep }}
                />
                <span
                  aria-hidden
                  className="absolute -right-6 -bottom-6 size-28 rounded-full border-[1.5px] opacity-[0.16]"
                  style={{ borderColor: bicim.murekkep }}
                />

                <div className="relative px-6 pt-7 pb-6">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ background: bicim.murekkep }}
                    />
                    <span className="rakam text-[10.5px] font-extrabold tracking-[0.18em] text-muted-foreground uppercase">
                      {kart.etiket ?? `Kart ${sira + 1}/${toplam}`}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-[26px] leading-tight font-extrabold tracking-tight text-balance">
                    {kart.baslik}
                  </h3>
                  <KartMetni metin={kart.metin} murekkep={bicim.murekkep} />
                  {kart.gorsel && <KartGorseli gorsel={kart.gorsel} etiket={kart.baslik} />}
                </div>
              </article>

              {/*
                Rabi'nin notu: balon solda, maskot sağda ve karta işaret ediyor.
                Notu olmayan kartta ikisi de yok — boş balonun yanında duran
                tavşan, söyleyecek sözü olmayan bir rehber gibi görünür.
              */}
              {kart.not && (
                <div key={`${kart.id}-not`} className="deste-not relative mt-3.5 flex items-end gap-3 pr-1">
                  <div className="relative mb-4 min-w-0 flex-1 rounded-[14px] bg-foreground px-4 py-3.5">
                    <span
                      aria-hidden
                      className="absolute -right-1.5 bottom-4 size-3 rotate-45 rounded-[2px] bg-foreground"
                    />
                    <span className="relative block text-[10px] font-bold tracking-[0.16em] text-background/60 uppercase">
                      Rabi&apos;nin notu
                    </span>
                    <p className="relative mt-1.5 text-[13.5px] leading-relaxed font-semibold text-background text-pretty">
                      {kart.not}
                    </p>
                  </div>
                  <Rabi
                    durum="calisiyor"
                    poz="isaretci"
                    boyut={104}
                    className="drop-shadow-[0_8px_12px_rgba(31,36,48,0.16)]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* İlerle geniş, Geri dar: ikisi eşit genişlikteyken destenin asıl
            yönü okunmuyordu. İlk kartta Geri pasif — gidilecek yer yok. */}
        <div className="mx-auto mt-4 flex w-full max-w-md gap-3">
          <button
            type="button"
            onClick={onGeri}
            disabled={ilk}
            aria-label="Önceki kart"
            className="golge-kart grid h-[58px] w-16 shrink-0 place-items-center rounded-2xl bg-card text-foreground/80 transition active:brightness-95 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden />
          </button>
          <Buton onClick={onIlerle} className="h-[58px] flex-1 text-[16px] shadow-[0_3px_0_var(--primary)]">
            {son ? 'Desteyi bitir' : 'Sayfayı çevir'}
            <span className="grid size-[26px] place-items-center rounded-[9px] bg-white/16">
              <ChevronRight size={16} aria-hidden />
            </span>
          </Buton>
        </div>
      </div>
    </div>
  )
}
