'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import type { Konu } from '@/lib/konu'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { KartGorseli } from './kart-gorseli'
import { YoklamaBileti } from './yoklama-bileti'

/**
 * Soru sahnesi — deste okunduktan **hemen sonra** gelen ekran.
 *
 * Kartlar anlatıyor, burası geri istiyor. Sorular doğru/yanlış: ekranda bir
 * iddia duruyor ve iki düğme var. Akış tek dokunuşluk — karar ver, gerekçeyi
 * oku, devam et.
 *
 * Ekran bir süre **çevrilen** bir kart gösteriyordu: bir yüzünde soru, öteki
 * yüzünde cevap, kararı da kullanıcı kendi veriyordu ("bildim / bilmedim").
 * İki sorunu birden vardı. Ölçtüğü şey bilmek değil beyandı — cevabı gördükten
 * sonra "bildim" demek serbest. Ve deste okunduktan sonra gelen ekranı ikinci
 * bir işe çeviriyordu: her soruda çevir, oku, karar ver.
 *
 * Şimdi cevap `SoruKarti.dogru` içinde ve ekran kararı kendisi tartıyor;
 * gerekçe karardan sonra çıkıyor, öncesinde değil.
 *
 * Sahnenin **iki** hâli var: kartlardan devralan kapanış — yoklama bileti,
 * `yoklama-bileti.tsx`, aydınlık — ve soruların kendisi, koyu. Bilet bir
 * süre koyu sahnenin kendi ilk ekranıydı (`Giris`, burada); tasarım onu
 * destenin aydınlık tarafına aldı ve koyu perde artık "Yoklamaya başla"
 * denince iniyor. İki kök ayrı `key` taşıyor: aynı `div` yeniden
 * kullanılsaydı `sahne-iner` ikinci kökte hiç oynamazdı. Kapanışta bir de
 * özet (`Sonuc`: iki sayı, maskot, "Haritaya dön") vardı; kaldırıldı — son
 * sorunun gerekçesi okunup "Bitir"e basılınca sahne doğrudan haritaya
 * dönüyor. Kullanıcı istedi: bitiş ekranı yok. Sayı kayda yine giriyor
 * (`SahneSonucu`), yalnızca ekranda gösterilmiyor.
 *
 * Ekran uygulamanın tek koyu yüzeyi. Gerekçesi `globals.css`teki `.sahne`
 * bloğunda; renkler de orada, burada onaltılık kod yok.
 *
 * Katman yukarıdan aşağı açılarak geliyor (`sahne-iner`): deste kapanıp sahne
 * açıldığında ekran tek karede kırık beyazdan koyuya atlıyordu.
 */

export type SahneSonucu = {
  dogru: number
  yanlis: number
  /**
   * Yoklamanın sonuna gelindi mi.
   *
   * Yarıda çıkılan yoklama sayı **yazdırmıyor** (`konu-haritasi.tsx`):
   * destenin kendi kuralının aynısı — tamamlanma sona gelmekle kazanılıyor.
   * Bayrak olmadan, girişte "Şimdi değil" diyen kullanıcının kaydına hiç
   * verilmemiş bir yoklamanın "0 doğru"su yazılıyordu.
   */
  bitti: boolean
}

export function SoruSahnesi({
  konu,
  temaAdi,
  dersAdi,
  onKapat,
}: {
  konu: Konu
  temaAdi: string
  dersAdi: string
  onKapat: (sonuc: SahneSonucu) => void
}) {
  const [sira, setSira] = useState(0)
  /**
   * Verilen cevap; `null` ise henüz karar verilmedi.
   *
   * İki soru biçimi tek sayıda buluşuyor: doğru/yanlışta 1 "doğru", 0
   * "yanlış"; iki şıklıda şıkkın dizini. Beklenen cevap da aynı sayıya
   * çevriliyor (`beklenen`), böylece karar ve gerekçe iki biçimde tek koddan
   * çıkıyor.
   */
  const [secim, setSecim] = useState<number | null>(null)
  const [dogru, setDogru] = useState(0)
  const [yanlis, setYanlis] = useState(0)
  /** Girişteki düğmeye basıldı mı; basılana kadar ilk iddia görünmüyor. */
  const [basladi, setBasladi] = useState(false)

  const soru = konu.sorular[sira]
  const toplam = konu.sorular.length
  const sikli = soru.tur === 'sikli'
  const beklenen = soru.tur === 'sikli' ? soru.dogru : soru.dogru ? 1 : 0
  const isabet = secim !== null && secim === beklenen

  /*
    Sonuç ref'te de duruyor: geri tuşu katmanı bileşenin ilk çiziminde
    kaydediliyor ve `onKapat`ı çağırdığı anda state'in güncel hâlini görmesi
    gerekiyor.
  */
  const sonucRef = useRef<SahneSonucu>({ dogru: 0, yanlis: 0, bitti: false })
  sonucRef.current = { dogru, yanlis, bitti: false }
  useGeriKatmani(true, () => onKapat(sonucRef.current))

  function karar(cevap: number) {
    if (secim !== null) return
    setSecim(cevap)
    if (cevap === beklenen) setDogru((o) => o + 1)
    else setYanlis((o) => o + 1)
  }

  function ilerle() {
    // Son sorudan sonra ekran yok: sayı kayda gidiyor, sahne kapanıyor.
    if (sira >= toplam - 1) {
      onKapat({ dogru, yanlis, bitti: true })
      return
    }
    setSira((o) => o + 1)
    setSecim(null)
  }

  // Uzun bir sorudan sonra gelen kısa soru sayfayı ortasından başlatıyordu.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [sira])

  if (!basladi) {
    return (
      <YoklamaBileti
        key="bilet"
        konu={konu}
        dersAdi={dersAdi}
        temaAdi={temaAdi}
        onBasla={() => setBasladi(true)}
        onVazgec={() => onKapat({ dogru: 0, yanlis: 0, bitti: false })}
      />
    )
  }

  return (
    <div
      key="sorular"
      className="sahne sahne-iner fixed inset-0 z-50 flex flex-col text-[var(--sahne-yazi)]"
    >
      <header className="shrink-0 px-4 pt-[calc(0.75rem+var(--guvenli-ust))] pb-3">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            type="button"
            onClick={() => onKapat(sonucRef.current)}
            aria-label="Kapat"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 transition active:bg-white/20"
          >
            <X size={19} strokeWidth={2.6} aria-hidden />
          </button>

          <div className="flex flex-1 gap-1.5" aria-hidden>
            {konu.sorular.map((s, i) => (
              <span
                key={s.id}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors duration-200',
                  i <= sira ? 'bg-[var(--sahne-vurgu)]' : 'bg-white/12',
                )}
              />
            ))}
          </div>

          <span className="rakam shrink-0 text-[13px] font-extrabold">
            {sira + 1}/{toplam}
          </span>
        </div>

        <div className="mx-auto mt-3 max-w-md">
          <p className="text-[10.5px] font-extrabold tracking-[0.12em] text-[var(--sahne-soluk)] uppercase">
            {dersAdi} · {temaAdi}
          </p>
          <h2 className="mt-0.5 font-display text-[17px] font-extrabold tracking-tight">
            {konu.ad}
          </h2>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-[calc(1rem+var(--guvenli-alt))]">
        {/*
          Kartın boyu içeriğe göre değişiyor ve gerekirse kendi içinde
          kaydırılıyor: görselli soru ile tek cümlelik soru aynı kutuya
          sığmıyor, sabit boy ikisinden birini bozardı. Dikey ortalama
          `my-auto` ile, `flex-1` ile değil — artan yeri paylaşan kutu kartı
          yukarı yapıştırmıyor.
        */}
        <div className="mx-auto my-auto w-full max-w-md overflow-y-auto overscroll-contain">
          {/*
            Kararın izi kartın **çerçevesinde**: gerekçe şeridi aşağıda ve göz
            oraya inmeden önce kartın kendisi cevabı söylüyor.

            Çerçeve `ring` ile değil `outline` ile çiziliyor: Tailwind'in
            `ring`i gölge olarak uygulanıyor ve kartın kendi gölgesi
            (`golge-kart`) onu eziyor — halka ekranda hiç görünmüyordu.
          */}
          <div
            key={soru.id}
            className="golge-kart rounded-3xl bg-[var(--sahne-kart)] px-6 py-5 text-foreground"
            style={{
              outline:
                secim === null
                  ? undefined
                  : `4px solid ${isabet ? 'var(--sahne-dogru)' : 'var(--sahne-yanlis)'}`,
              // Çerçeve kartın **içine** çiziliyor: dışarı taşan bir çizgi,
              // kaydırılabilir kutunun kenarında kırpılıyor ve yatay kaydırma
              // çubuğu çıkarıyordu.
              outlineOffset: '-4px',
            }}
          >
            <p className="flex items-center gap-2 text-[10.5px] font-extrabold tracking-[0.14em] text-[var(--sahne-vurgu)] uppercase">
              <span className="size-2 rounded-full bg-current" aria-hidden />
              {sikli ? 'Hangisi?' : 'Doğru mu, yanlış mı?'}
            </p>

            <p className="py-4 text-center text-[17px] leading-relaxed font-semibold text-pretty">
              {soru.tur === 'sikli' ? soru.soru : soru.ifade}
            </p>

            {soru.gorsel && (
              <KartGorseli
                gorsel={soru.gorsel}
                etiket={soru.tur === 'sikli' ? soru.soru : soru.ifade}
              />
            )}
          </div>

          {/*
            Gerekçe kartın **altında**, içinde değil: karardan sonra beliren
            bir metin kartın içine girseydi kart büyür ve iddia yukarı kayardı
            — okunan cümle, hakkında karar verilenden başka bir yerde durmuş
            olurdu.
          */}
          {secim !== null && (
            <div
              role="status"
              className="soru-gerekce mt-3 rounded-2xl px-4 py-3.5"
              style={{
                backgroundColor: isabet
                  ? 'var(--sahne-dogru-zemin)'
                  : 'var(--sahne-yanlis-zemin)',
                color: isabet ? 'var(--sahne-dogru)' : 'var(--sahne-yanlis)',
              }}
            >
              <p className="flex items-center gap-1.5 text-[13px] font-extrabold">
                {isabet ? (
                  <Check size={16} strokeWidth={3} aria-hidden />
                ) : (
                  <X size={16} strokeWidth={3} aria-hidden />
                )}
                {isabet
                  ? 'Doğru'
                  : soru.tur === 'sikli'
                    ? `Cevap: ${soru.siklar[soru.dogru]}`
                    : soru.dogru
                      ? 'Cevap: Doğru'
                      : 'Cevap: Yanlış'}
              </p>
              <p className="mt-1 text-[14px] leading-snug font-semibold text-[var(--sahne-yazi)] text-pretty">
                {soru.aciklama}
              </p>
            </div>
          )}
        </div>

        <div className="mx-auto mt-4 w-full max-w-md">
          {secim === null && soru.tur === 'sikli' ? (
            /*
              İki şıklı soruda düğmeler alt alta ve şıkkın metnini taşıyor;
              doğru/yanlışın renkli iki düğmesi burada anlamsız — hangisinin
              doğru olduğu düğmenin renginden okunmamalı, ikisi de nötr.
            */
            <div className="flex flex-col gap-2.5">
              {soru.siklar.map((metin, i) => (
                <Buton
                  key={metin}
                  bicim="ikincil"
                  onClick={() => karar(i)}
                  className="h-auto min-h-14 w-full justify-start gap-3 bg-white/10 px-4 py-3 text-left text-[15px] text-[var(--sahne-yazi)] active:bg-white/20"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/15 text-[13px] font-extrabold">
                    {i === 0 ? 'A' : 'B'}
                  </span>
                  <span className="min-w-0 flex-1 leading-snug text-pretty">{metin}</span>
                </Buton>
              ))}
            </div>
          ) : secim === null ? (
            <div className="flex gap-3">
              <Buton
                bicim="ikincil"
                onClick={() => karar(0)}
                className="h-14 flex-1 bg-[var(--sahne-yanlis-zemin)] text-[15px] text-[var(--sahne-yanlis)]"
              >
                <X size={18} strokeWidth={3} aria-hidden /> Yanlış
              </Buton>
              <Buton
                bicim="ikincil"
                onClick={() => karar(1)}
                className="h-14 flex-1 bg-[var(--sahne-dogru-zemin)] text-[15px] text-[var(--sahne-dogru)]"
              >
                <Check size={18} strokeWidth={3} aria-hidden /> Doğru
              </Buton>
            </div>
          ) : (
            <Buton onClick={ilerle} className="h-14 w-full bg-[var(--sahne-vurgu)]">
              {sira >= toplam - 1 ? 'Bitir' : 'Devam'}
            </Buton>
          )}
        </div>
      </div>
    </div>
  )
}
