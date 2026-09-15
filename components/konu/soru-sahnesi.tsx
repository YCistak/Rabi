'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, ChevronRight, X } from 'lucide-react'
import type { Konu } from '@/lib/konu'
import { isabetOrani, kapanisKademesi, sureYaz } from '@/lib/konu/kapanis'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { KartGorseli } from './kart-gorseli'

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
 * Sahnenin **üç** hâli var ve üçü de burada: kartlardan devralan giriş
 * (`Giris`), soruların kendisi ve kapanış (`Kapanis`). Giriş sonradan
 * eklendi; gerekçesi kendi yorumunda. Kapanış öteki ikisinden ayrı bir
 * yüzeyde — kâğıt zemin — ve gerekçesi de kendi yorumunda. Bir süre kapanış
 * hiç yoktu: koyu sahnedeki ilk özet (`Sonuc`) kullanıcı isteğiyle
 * kaldırılmış, "Bitir" doğrudan haritaya dönüyordu; tasarım gelince yeni
 * hâliyle geri geldi.
 *
 * Giriş ve sorular uygulamanın tek koyu yüzeyi. Gerekçesi `globals.css`teki
 * `.sahne` bloğunda; renkler de orada, burada onaltılık kod yok.
 *
 * Katman yukarıdan aşağı açılarak geliyor (`sahne-iner`): deste kapanıp sahne
 * açıldığında ekran tek karede kırık beyazdan koyuya atlıyordu. Sınıf giriş ve
 * soru hâllerinin kökünde yazılı ama perde **bir kez** oynuyor: React ikisinde
 * de aynı DOM düğümünü yeniden kullanıyor, animasyon da yalnızca düğüm
 * kurulurken başlıyor. Ayrı bir "yalnızca girişte" koşulu, olmayan bir tekrarı
 * önlerdi. Kapanışın kökünde sınıf yok — kâğıt sayfa ayrıca perdeyle gelmiyor,
 * parçaları kendi sırasıyla beliriyor.
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
  const [bitti, setBitti] = useState(false)
  /** Girişteki düğmeye basıldı mı; basılana kadar ilk iddia görünmüyor. */
  const [basladi, setBasladi] = useState(false)
  /**
   * Yanlış bilinen soruların metinleri, sırayla — kapanış "tekrar
   * bakılacaklar" diye listeliyor. Sayaç (`yanlis`) kaç tane olduğunu
   * söylüyor, hangileri olduğunu değil.
   */
  const [yanlislar, setYanlislar] = useState<string[]>([])
  /**
   * İlk soruya geçilen an; kapanıştaki süre buradan ölçülüyor. Giriş
   * ekranında geçen süre sayılmıyor — orada okunan bir açıklama var, cevap
   * verilen bir soru değil.
   */
  const baslangicRef = useRef(0)
  /** Son soru cevaplanıp Bitir'e basıldığında ölçülen süre; sonra donuyor. */
  const [sureMs, setSureMs] = useState(0)

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
  sonucRef.current = { dogru, yanlis, bitti }
  useGeriKatmani(true, () => onKapat(sonucRef.current))

  function karar(cevap: number) {
    if (secim !== null) return
    setSecim(cevap)
    if (cevap === beklenen) setDogru((o) => o + 1)
    else {
      setYanlis((o) => o + 1)
      setYanlislar((o) => [...o, soru.tur === 'sikli' ? soru.soru : soru.ifade])
    }
  }

  function ilerle() {
    if (sira >= toplam - 1) {
      setSureMs(Date.now() - baslangicRef.current)
      setBitti(true)
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
      <div className="sahne sahne-iner fixed inset-0 z-50 flex flex-col text-[var(--sahne-yazi)]">
        <Giris
          konuAdi={konu.ad}
          dersAdi={dersAdi}
          temaAdi={temaAdi}
          kartSayisi={konu.kartlar.length}
          soruSayisi={toplam}
          onBasla={() => {
            baslangicRef.current = Date.now()
            setBasladi(true)
          }}
          onVazgec={() => onKapat({ dogru: 0, yanlis: 0, bitti: false })}
        />
      </div>
    )
  }

  if (bitti) {
    return (
      <div className="kapanis fixed inset-0 z-50 flex flex-col">
        <Kapanis
          konuAdi={konu.ad}
          dersAdi={dersAdi}
          temaAdi={temaAdi}
          dogru={dogru}
          yanlis={yanlis}
          yanlislar={yanlislar}
          sureMs={sureMs}
          onKapat={() => onKapat({ dogru, yanlis, bitti: true })}
        />
      </div>
    )
  }

  return (
    <div className="sahne fixed inset-0 z-50 flex flex-col text-[var(--sahne-yazi)]">
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

/**
 * Yoklamanın giriş ekranı — kartlarla soruların arasındaki köprü.
 *
 * Ekran bir süre yoktu ve destenin yorumu bunu bilerek yazıyordu: "arada
 * duran bir 'deste bitti' ekranı, okumayla soruyu birbirinden ayıran fazladan
 * bir dokunuş". Fazladan dokunuşun bedeli doğruydu ama ayrılmayan iki iş de
 * bir bedel ödüyordu: son kartta "İlerle"ye basan kullanıcı dersin aydınlık,
 * renkli destesinden koyu sahnedeki bir **iddianın üstüne** düşüyordu. Yüzey,
 * ton ve iş tek karede birden değişiyor ve gelen ilk şey cevaplanmayı bekleyen
 * bir cümle oluyordu — okumayı bitirdiğini sanan kullanıcı kendini
 * cevaplayacağı bir şeyin karşısında buluyordu. Fazladan dokunuş burada gecikme
 * değil, bir sonraki ekranın ne olduğunu söyleyen tek yer.
 *
 * Köprü koyu sahnenin **kendi** ilk ekranı, üçüncü bir yüzey değil: renk
 * değişimi böylece bir soruyla değil bir açıklamayla geliyor ve sahnenin iki
 * ucu — giriş ile `Sonuc` — aynı bileşende, aynı düzende duruyor.
 *
 * Sayılar süs değil: "kaç iddia" yazmayan bir köprü, ne kadar süreceğini
 * söylemeden başlat düğmesi gösteriyor — haritadaki "4 kart · 3 dk" satırının
 * aynı gerekçesi.
 *
 * **"Şimdi değil" bir düğme değil bir çıkış.** Deste zaten okundu ve kaydı
 * yazıldı (`konu-haritasi.tsx`); yoklamayı vermemek konuyu okunmamış yapmıyor.
 * Yoklamayı zorunlu kılmak, okumayı bitirmenin bedelini bir sınav yapardı.
 */
function Giris({
  konuAdi,
  dersAdi,
  temaAdi,
  kartSayisi,
  soruSayisi,
  onBasla,
  onVazgec,
}: {
  konuAdi: string
  dersAdi: string
  temaAdi: string
  kartSayisi: number
  soruSayisi: number
  onBasla: () => void
  onVazgec: () => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 pb-[calc(1rem+var(--guvenli-alt))] text-center">
      <p className="text-[10.5px] font-extrabold tracking-[0.12em] text-[var(--sahne-soluk)] uppercase">
        {dersAdi} · {temaAdi}
      </p>

      {/* Maskot kutluyor: köprünün ilk işi okumanın bittiğini söylemek, sınavı
          duyurmak ondan sonra geliyor. */}
      <div className="mt-3">
        <Rabi durum="kutlama" boyut={104} />
      </div>

      <h3 className="mt-3 font-display text-[22px] font-extrabold tracking-tight text-balance">
        {konuAdi} okundu
      </h3>
      <p className="mt-1.5 text-[14.5px] leading-snug font-semibold text-[var(--sahne-soluk)] text-pretty">
        Sırada kısa bir yoklama var: kimi soruda doğru mu yanlış mı diyeceksin, kiminde iki şıktan
        birini seçeceksin; gerekçesi hemen altında çıkıyor.
      </p>

      {/* Zemin nötr (`bg-white/10`, başlıktaki kapatma düğmesiyle aynı):
          sahnenin doğru/yanlış tonları karar renkleri ve sayaç onların hiçbiri
          değil — yeşil bir şerit, henüz verilmemiş yoklamayı geçilmiş
          gösterirdi. */}
      <p className="rakam mt-4 rounded-full bg-white/10 px-4 py-2 text-[12.5px] font-extrabold text-[var(--sahne-yazi)]">
        {kartSayisi} kart okundu · {soruSayisi} soru
      </p>

      <Buton onClick={onBasla} className="mt-6 w-full bg-[var(--sahne-vurgu)]">
        Yoklamaya başla
        <ArrowRight size={18} strokeWidth={3} aria-hidden />
      </Buton>

      {/* Çıkış düğme değil yazı: iki dolu düğme yan yana dururken hangisinin
          ileri götürdüğü okunmuyordu — kurulumdaki "Şimdilik atla" kuralı. */}
      <button
        type="button"
        onClick={onVazgec}
        className="mt-2 px-4 py-3 text-[13.5px] font-extrabold text-[var(--sahne-soluk)] transition active:opacity-70"
      >
        Şimdi değil
      </button>
    </div>
  )
}

/**
 * Kapanış — sorular bitince gelen sayfa (`tasarim/soru-kapanis.dc.html` → 2a).
 *
 * Öteki iki hâlin koyu sahnesinde değil, **kâğıt zeminde**: yoklamanın sonu
 * bir sınav sonucu değil çevrilen bir sayfa ve tasarım onu krem zemin, defter
 * çizgisi ve altın etiketlerle çiziyor. Renkler `globals.css`teki `.kapanis`
 * bloğunda.
 *
 * Bir süre burada koyu sahnede iki sayı ve bir düğme vardı ("N soruda
 * yanıldın"); tasarımın eklediği üç şey var:
 *
 * - **İsabet halkası** sıfırdan dolarak geliyor ve rengi kademeye göre:
 *   yeşil, turuncu, kırmızı. Kademelerin eşiği haritadaki yıldızlarla aynı
 *   (`lib/konu/kapanis.ts`); başlık da oradan ("Harika iş!" / "İyi iş
 *   çıkardın" / "Tekrar bakmaya değer").
 * - **Süre** üçüncü kutu. Yoklama kısa ve süre bir puan değil; ama aynı
 *   konuyu ikinci kez çözen öğrenci hızlandığını buradan görüyor.
 * - **Tekrar bakılacaklar**: yanlış bilinen soruların metni. Sayı "kaç"ı
 *   söylüyor, liste "hangisi"ni — kartlara geri dönecek öğrencinin aradığı
 *   ikincisi. Liste üçle kesiliyor: altı yanlışın altısı da yazılsaydı sayfa
 *   düğmeyi ekranın altına iterdi; kalanı tek satırda sayılıyor.
 *
 * Parçalar sırayla beliriyor (gecikmeler tasarımdan): önce maskot ve halka,
 * sonra üç kutu, en son liste. Maskot kademeye göre seviniyor ya da
 * düşünüyor — tasarım tek pozla çizildi ama yarısı yanlış çıkan yoklamanın
 * üstünde zıplayan bir tavşan sonucu değil ekranı kutlardı.
 */
function Kapanis({
  konuAdi,
  dersAdi,
  temaAdi,
  dogru,
  yanlis,
  yanlislar,
  sureMs,
  onKapat,
}: {
  konuAdi: string
  dersAdi: string
  temaAdi: string
  dogru: number
  yanlis: number
  yanlislar: string[]
  sureMs: number
  onKapat: () => void
}) {
  const kademe = kapanisKademesi(dogru, yanlis)
  const yuzde = isabetOrani(dogru, yanlis)
  const renk = KADEME_RENGI[kademe]
  const listelenen = yanlislar.slice(0, LISTE_SINIRI)
  const kalan = yanlislar.length - listelenen.length

  return (
    <>
      <header className="shrink-0 px-4 pt-[calc(1.1rem+var(--guvenli-ust))] text-center">
        <p className="text-[11px] font-extrabold tracking-[0.14em] text-[var(--kapanis-altin)] uppercase">
          {dersAdi} · {temaAdi}
        </p>
        <h2 className="mt-1 font-display text-[17px] font-extrabold tracking-tight text-balance">
          {konuAdi} · yoklama bitti
        </h2>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5">
        <div className="mx-auto my-auto w-full max-w-md py-4">
          <div className="kapanis-gel flex flex-col items-center">
            <div className="kapanis-suzul">
              <Rabi
                durum={kademe === 'tekrar' ? 'normal' : 'kutlama'}
                poz={kademe === 'tekrar' ? 'dusunen' : 'sevinen'}
                boyut={150}
                className="drop-shadow-[0_14px_18px_rgba(31,36,48,0.18)]"
              />
            </div>

            <div className="relative mt-0.5 grid size-[188px] place-items-center">
              <svg
                width="188"
                height="188"
                viewBox="0 0 188 188"
                className="absolute inset-0 -rotate-90"
                aria-hidden
              >
                <circle
                  cx="94"
                  cy="94"
                  r={HALKA_YARICAP}
                  fill="none"
                  stroke="var(--kapanis-halka-zemin)"
                  strokeWidth="15"
                />
                <circle
                  cx="94"
                  cy="94"
                  r={HALKA_YARICAP}
                  fill="none"
                  stroke="var(--kapanis-cerceve)"
                  strokeWidth="14"
                />
                <circle
                  className="kapanis-halka"
                  cx="94"
                  cy="94"
                  r={HALKA_YARICAP}
                  fill="none"
                  stroke={renk}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={HALKA_CEVRESI}
                  strokeDashoffset={HALKA_CEVRESI * (1 - yuzde / 100)}
                />
              </svg>
              <div className="relative text-center">
                <p className="rakam text-[46px] leading-none font-black tracking-tight">
                  {yuzde}
                  <span className="text-[22px] font-extrabold text-[var(--kapanis-altin-koyu)]">
                    %
                  </span>
                </p>
                <p className="mt-1.5 text-[10.5px] font-extrabold tracking-[0.16em] text-[var(--kapanis-altin)] uppercase">
                  İsabet
                </p>
              </div>
            </div>

            <h3 className="mt-5 text-center font-display text-[27px] font-black tracking-tight text-balance">
              {KADEME_BASLIGI[kademe]}
            </h3>
          </div>

          <div className="mt-6 flex gap-2.5">
            <Kutu deger={dogru} etiket="Doğru" renk="var(--success)" gecikme={900} />
            <Kutu deger={yanlis} etiket="Yanlış" renk="var(--danger)" gecikme={1020} />
            <Kutu
              deger={sureYaz(sureMs)}
              etiket="Süre"
              renk="var(--kapanis-altin-koyu)"
              gecikme={1140}
            />
          </div>

          {listelenen.length > 0 && (
            <div
              className="kapanis-gel mt-3 rounded-[20px] border border-[var(--kapanis-cerceve)] bg-white px-4.5 py-4 shadow-[var(--kapanis-golge)]"
              style={{ animationDelay: '1260ms' }}
            >
              <p className="text-[10.5px] font-extrabold tracking-[0.18em] text-[var(--kapanis-soluk)] uppercase">
                Tekrar bakılacaklar
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {listelenen.map((metin) => (
                  <li key={metin} className="flex items-start gap-2.5">
                    <span
                      aria-hidden
                      className="mt-px grid size-5 shrink-0 place-items-center rounded-[7px] bg-danger-soft text-danger"
                    >
                      <X size={12} strokeWidth={3.5} />
                    </span>
                    <span className="text-[13.5px] leading-snug font-bold text-[var(--kapanis-yazi-govde)] text-pretty">
                      {metin}
                    </span>
                  </li>
                ))}
              </ul>
              {kalan > 0 && (
                <p className="mt-2.5 text-[12.5px] font-bold text-[var(--kapanis-soluk)]">
                  … ve {kalan} soru daha
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 px-4 pt-3 pb-[calc(1.4rem+var(--guvenli-alt))]">
        {/* Dolgu markanın parlak tonu, altındaki çizgi koyu tonu: tasarımın
            "basılabilir" düğmesi. Basınca çizgi kadar iniyor. */}
        <Buton
          onClick={onKapat}
          className="mx-auto h-[60px] w-full max-w-md gap-2.5 rounded-[20px] bg-primary-parlak text-[16.5px] font-extrabold text-white shadow-[0_3px_0_var(--primary)] active:translate-y-0.5 active:shadow-[0_1px_0_var(--primary)] active:brightness-100"
        >
          Haritaya dön
          <span className="grid size-[26px] place-items-center rounded-[9px] bg-white/18">
            <ChevronRight size={16} strokeWidth={3} aria-hidden />
          </span>
        </Buton>
      </div>
    </>
  )
}

/** Halkanın yarıçapı ve çevresi; `kapanisHalka` keyframe'i çevreyi bilmek zorunda. */
const HALKA_YARICAP = 84
const HALKA_CEVRESI = Math.round(2 * Math.PI * HALKA_YARICAP * 10) / 10

/** "Tekrar bakılacaklar" en çok bu kadar soru yazıyor; kalanı sayılıyor. */
const LISTE_SINIRI = 3

const KADEME_BASLIGI = {
  harika: 'Harika iş!',
  iyi: 'İyi iş çıkardın',
  tekrar: 'Tekrar bakmaya değer',
} as const

/* Halkanın rengi kademenin kendisi: yeşil geçti, turuncu geçti ama eksik
   var, kırmızı geçemedi. Üçü de temanın kendi tonları. */
const KADEME_RENGI = {
  harika: 'var(--success)',
  iyi: 'var(--primary-parlak)',
  tekrar: 'var(--danger)',
} as const

function Kutu({
  deger,
  etiket,
  renk,
  gecikme,
}: {
  deger: number | string
  etiket: string
  renk: string
  gecikme: number
}) {
  return (
    <div
      className="kapanis-gel flex-1 rounded-[18px] border border-[var(--kapanis-cerceve)] bg-white px-2 py-3 text-center shadow-[var(--kapanis-golge)]"
      style={{ animationDelay: `${gecikme}ms` }}
    >
      <p className="rakam text-[24px] leading-none font-black" style={{ color: renk }}>
        {deger}
      </p>
      <p className="mt-1.5 text-[11px] font-extrabold tracking-[0.08em] text-[var(--kapanis-soluk)] uppercase">
        {etiket}
      </p>
    </div>
  )
}
