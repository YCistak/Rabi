'use client'

import { useState } from 'react'
import { ArrowRight, Check, X } from 'lucide-react'
import type { Konu } from '@/lib/konu'
import { yoklamaDakikasi } from '@/lib/konu'
import { useGeriKatmani } from '@/lib/geri'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

/**
 * Destenin kapanışı: yoklama bileti (`tasarim/yoklama-bileti.html`).
 *
 * Son kart okununca gelen ekran. Bir süre koyu sahnenin kendi ilk ekranıydı
 * (`soru-sahnesi.tsx` → eski `Giris`): maskot, iki satır yazı ve düğme.
 * Tasarım onu destenin **aydınlık** tarafına aldı — ortada koyu bir bilet,
 * kupayı kaldıran Rabi biletin arkasından çıkıyor, sağ üst köşeye "BİTTİ"
 * damgası basılıyor. Yani ekran artık yoklamanın girişi değil destenin
 * kapanışı; koyu sahne "Yoklamaya başla" denince iniyor.
 *
 * **Zemin düz beyaz, bilet derse göre değişmiyor.** Mockup'ta üstte Fizik'in
 * rengine boyalı noktalı bir bant vardı ve bilet lacivertti; uygulama bir
 * süre bunu yedi derse yedi ayrı biletle taşıdı (şarap+nane, mor+limon…).
 * Kullanıcı ikisini de geri aldı: zemin bembeyaz, bilet markanın kendi
 * turuncusundan koyu bir ton ve üstüne altın (`--bilet*`, `globals.css`).
 * Bilet dersin değil uygulamanın — her derste aynı görünüyor, "yoklama"
 * dediğin şey her yerde aynı biletle geliyor. Bu bileşen bu yüzden `bicim`
 * almıyor.
 *
 * **Bilet koçanı gerçek bir çentikle ayrılıyor.** Mockup çentiği `mask-image`
 * ile kesiyordu ve çentiğin yeri piksel olarak yazılıydı (177 px); konu adı
 * iki satıra kırılınca kesik çizgi aşağı kayar, çentik yerinde kalırdı.
 * Burada çentik kesik çizginin **kendi satırında** iki daire: biletin
 * `overflow-hidden` kenarı dairelerin dış yarısını kırpıyor ve geriye içe
 * oyulmuş iki yarım daire kalıyor. Daireler beyaz — zemin beyaz olduğu için
 * çentik her yerde tutuyor.
 *
 * Halka her zaman %100: bilet yalnızca deste **sonuna kadar** okunduğunda
 * geliyor (`konu-haritasi.tsx`), yarım destenin bileti yok. Sayı yine de
 * yazılı — halkanın dolarak gelmesi "hepsi okundu"yu söylemenin kendisi.
 *
 * "Bu destede öğrendiklerin" alttan açılan bir sayfa, biletin içinde liste
 * değil: on altı kartlık konuda liste bileti ekranın dışına taşırırdı.
 *
 * **"Şimdi değil" bir düğme değil bir çıkış.** Deste zaten okundu ve kaydı
 * yazıldı; yoklamayı vermemek konuyu okunmamış yapmıyor. İki dolu düğme yan
 * yana dursaydı hangisinin ileri götürdüğü okunmazdı — kurulumdaki "Şimdilik
 * atla" kuralı.
 */
export function YoklamaBileti({
  konu,
  dersAdi,
  temaAdi,
  onBasla,
  onVazgec,
}: {
  konu: Konu
  dersAdi: string
  temaAdi: string
  onBasla: () => void
  onVazgec: () => void
}) {
  const [liste, setListe] = useState(false)
  useGeriKatmani(liste, () => setListe(false))

  const kartSayisi = konu.kartlar.length
  const soruSayisi = konu.sorular.length

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Işıma maskotun arkasında, markanın sıcak tonunda: bembeyaz zeminde
          tavşan havada duruyordu. */}
      <div
        aria-hidden
        className="bilet-hale pointer-events-none absolute top-[104px] left-1/2 size-[330px] -translate-x-1/2 rounded-full"
        style={{
          opacity: 0.7,
          background:
            'radial-gradient(closest-side, rgba(251,238,231,0.95), rgba(251,238,231,0.45) 55%, rgba(255,255,255,0))',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-md min-h-0 flex-1 flex-col items-center overflow-y-auto overscroll-contain px-5 pt-[calc(1rem+var(--guvenli-ust))] pb-[calc(1.25rem+var(--guvenli-alt))]">
        <div className="flex w-full items-center gap-3">
          <button
            type="button"
            onClick={onVazgec}
            aria-label="Kapat"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-primary transition active:brightness-95"
          >
            <X size={18} strokeWidth={3} aria-hidden />
          </button>
          {/* Bölmeli çubuk, destenin çubuğu gibi ama dolu: bütün kartlar
              okundu. `DesteCubugu` değil, çünkü o dersin mürekkebiyle boyanıyor
              ve bilet derse göre renk almıyor. */}
          <div className="flex min-w-0 flex-1 gap-1.5" aria-hidden>
            {Array.from({ length: kartSayisi }, (_, i) => (
              <span key={i} className="h-[5px] flex-1 rounded-full bg-primary-parlak/45" />
            ))}
          </div>
          <span className="rakam shrink-0 text-[13px] font-black text-primary">
            {kartSayisi}/{kartSayisi}
          </span>
        </div>

        <p
          className="bilet-giris mt-3.5 text-center text-[10.5px] font-extrabold tracking-[0.14em] text-primary uppercase"
          style={{ animationDelay: '620ms' }}
        >
          {dersAdi} · {temaAdi}
        </p>

        <div className="bilet-kart relative mt-[166px] w-full max-w-[330px]">
          {/* Maskot biletin arkasından çıkıyor (z-0, bilet z-1): kupa biletin
              üstünde, gövde arkasında — tavşan bileti tutuyormuş gibi. */}
          <div className="bilet-maskot absolute -top-[150px] left-1/2 z-0 size-[208px] -translate-x-1/2">
            <div className="mola-suzul relative">
              <Rabi
                durum="kutlama"
                poz="kupali"
                boyut={192}
                className="mx-auto drop-shadow-[0_20px_24px_rgba(31,36,48,0.32)]"
              />
              {KIVILCIMLAR.map((k, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="bilet-kivilcim absolute font-black"
                  style={{
                    top: k.top,
                    left: k.left,
                    fontSize: k.boy,
                    color: i % 2 === 0 ? 'var(--bilet-vurgu)' : 'var(--bilet-vurgu-acik)',
                    opacity: 0,
                    animationDelay: `${900 + i * 400}ms`,
                    animationDuration: `${2400 + (i % 3) * 200}ms`,
                  }}
                >
                  ✦
                </span>
              ))}
            </div>
          </div>

          <div
            className="bilet-basinc relative z-[1] overflow-hidden rounded-3xl"
            style={{
              background: 'var(--bilet)',
              color: BILET_YAZI,
              filter: 'drop-shadow(0 18px 34px rgba(126, 47, 18, 0.35))',
            }}
          >
            {/* Üstten inen vurgu ışığı ve tepedeki ince şerit: bilet düz bir
                dikdörtgen değil, ışığın altında duran bir kâğıt. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: 0.26,
                background: 'radial-gradient(120% 62% at 50% -12%, var(--bilet-vurgu), transparent 68%)',
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--bilet-vurgu) 50%, transparent)',
              }}
            />

            <div className="relative px-5.5 pt-[54px] text-center">
              <p
                className="text-[9.5px] font-extrabold tracking-[0.24em] uppercase"
                style={{ color: 'var(--bilet-vurgu)' }}
              >
                Yoklama bileti
              </p>
              <h3 className="mt-2 font-display text-[26px] leading-[1.12] font-black tracking-tight text-balance">
                {konu.ad} okundu
              </h3>
              <p className="mt-2 text-[13.5px] leading-snug font-semibold text-pretty opacity-70">
                Sırada {soruSayisi} soruluk kısa bir yoklama var; gerekçesi her soruda hemen
                altında.
              </p>
            </div>

            {/* Koçan çizgisi ve iki çentik — gerekçesi yukarıdaki yorumda. */}
            <div aria-hidden className="relative mt-4 h-[26px]">
              <span className="absolute inset-x-4.5 top-1/2 border-t-2 border-dashed border-current opacity-25" />
              <span className="absolute top-1/2 -left-[13px] size-[26px] -translate-y-1/2 rounded-full bg-white" />
              <span className="absolute top-1/2 -right-[13px] size-[26px] -translate-y-1/2 rounded-full bg-white" />
            </div>

            <div className="relative flex items-center gap-3.5 px-5.5">
              <span className="relative grid size-[74px] shrink-0 place-items-center">
                <svg
                  width="74"
                  height="74"
                  viewBox="0 0 74 74"
                  className="-rotate-90"
                  aria-hidden
                >
                  <circle
                    cx="37"
                    cy="37"
                    r={HALKA_YARICAP}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.16"
                    strokeWidth="9"
                  />
                  <circle
                    cx="37"
                    cy="37"
                    r={HALKA_YARICAP}
                    fill="none"
                    stroke="var(--bilet-vurgu)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={HALKA_CEVRE}
                    strokeDashoffset="0"
                    className="bilet-halka"
                    style={{ ['--cevre' as string]: `${HALKA_CEVRE}px` }}
                  />
                </svg>
                <span
                  className="rakam absolute font-display text-[18px] font-black"
                  style={{ color: 'var(--bilet-vurgu-acik)' }}
                >
                  %100
                </span>
              </span>
              <span className="flex min-w-0 flex-col items-start gap-1.5 text-left">
                <span className="text-[14.5px] leading-tight font-black">
                  {kartSayisi} kartın hepsi okundu
                </span>
                <button
                  type="button"
                  onClick={() => setListe(true)}
                  className="text-[12.5px] leading-tight font-extrabold underline underline-offset-2 transition active:opacity-70"
                  style={{ color: 'var(--bilet-vurgu-acik)' }}
                >
                  Bu destede öğrendiklerin
                </button>
              </span>
            </div>

            <div className="relative flex gap-2 px-5.5 pt-4 pb-5">
              <Kutu deger={kartSayisi} etiket="kart" gecikme={760} />
              <Kutu deger={soruSayisi} etiket="soru" gecikme={840} />
              <Kutu deger={`~${yoklamaDakikasi(soruSayisi)}`} etiket="dakika" gecikme={920} vurgu />
            </div>
          </div>

          {/* Damga en son basılıyor; halka basıncın dalgası. */}
          <span
            aria-hidden
            className="bilet-damga absolute -top-3.5 right-1.5 z-[3] grid size-[76px] place-items-center rounded-full border-[2.5px] text-center font-display text-[15px] leading-[1.15] font-black tracking-[0.08em]"
            style={{ background: 'var(--bilet)', borderColor: 'var(--bilet-vurgu)', color: 'var(--bilet-vurgu-acik)' }}
          >
            BİTTİ
          </span>
          <span
            aria-hidden
            className="bilet-damga-halka absolute -top-3.5 right-1.5 z-[2] size-[76px] rounded-full border-2"
            style={{ borderColor: 'var(--bilet-vurgu)', opacity: 0 }}
          />
        </div>

        <div className="min-h-4 flex-1" />

        <Buton
          onClick={onBasla}
          className="bilet-giris h-14 w-full text-[16.5px]"
          style={{ animationDelay: '900ms' }}
        >
          Yoklamaya başla
          <ArrowRight size={18} strokeWidth={3} aria-hidden />
        </Buton>
        <button
          type="button"
          onClick={onVazgec}
          className="mt-1.5 px-4 py-3 text-[13.5px] font-extrabold text-muted-foreground transition active:opacity-70"
        >
          Şimdi değil
        </button>
      </div>

      {liste && (
        <div
          className="katman-zemin fixed inset-0 z-[60] flex items-end justify-center bg-black/40"
          onClick={() => setListe(false)}
        >
          <div
            role="dialog"
            aria-label="Bu destede öğrendiklerin"
            className="alt-pencere-girisi relative w-full max-w-md rounded-t-[26px] bg-card px-5 pt-5 pb-[calc(1.5rem+var(--guvenli-alt))] shadow-[0_-8px_30px_-12px_rgba(31,36,48,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <span aria-hidden className="mx-auto mb-3.5 block h-[5px] w-11 rounded-full bg-border" />
            <p className="text-[10.5px] font-extrabold tracking-[0.18em] text-muted-foreground uppercase">
              Bu destede öğrendiklerin
            </p>
            <ul className="mt-3.5 flex max-h-[50vh] flex-col gap-2.5 overflow-y-auto">
              {konu.kartlar.map((k) => (
                <li key={k.id} className="flex items-center gap-2.5">
                  <span
                    className="grid size-[21px] shrink-0 place-items-center rounded-[7px] text-white"
                    style={{ background: 'var(--bilet)' }}
                    aria-hidden
                  >
                    <Check size={12} strokeWidth={3.5} />
                  </span>
                  <span className="text-[14px] leading-snug font-extrabold text-foreground/85">
                    {k.baslik}
                  </span>
                </li>
              ))}
            </ul>
            <Buton bicim="ikincil" onClick={() => setListe(false)} className="mt-4.5 h-[50px] w-full">
              Kapat
            </Buton>
          </div>
        </div>
      )}
    </div>
  )
}

/** Biletin yazısı: koyu zeminde kırık beyaz. */
const BILET_YAZI = '#fbf7ef'

const HALKA_YARICAP = 32
/** Halkanın çevresi (2πr, yukarı yuvarlandı) — dolma animasyonunun yolu. */
const HALKA_CEVRE = Math.ceil(2 * Math.PI * HALKA_YARICAP)

/** Kupanın çevresinde uçuşan beş kıvılcım; konumlar 208'lik maskot kutusuna göre. */
const KIVILCIMLAR = [
  { top: 26, left: 122, boy: 13 },
  { top: 8, left: 152, boy: 10 },
  { top: 34, left: 176, boy: 11 },
  { top: 2, left: 134, boy: 9 },
  { top: 46, left: 158, boy: 9 },
]

/** Koçandaki üç kutu; sonuncusu vurgu renginde — süre, ötekilerden farklı bir bilgi. */
function Kutu({
  deger,
  etiket,
  gecikme,
  vurgu,
}: {
  deger: number | string
  etiket: string
  gecikme: number
  vurgu?: boolean
}) {
  return (
    <div
      className="bilet-pop relative flex-1 overflow-hidden rounded-[13px] px-1.5 py-2.5 text-center"
      style={{ animationDelay: `${gecikme}ms` }}
    >
      {/* Zemin ayrı katman: vurgu bir değişken ve alfa kanalı `rgba()` ile
          verilemiyor, `color-mix` eski WebView'da yok. */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: vurgu ? 'var(--bilet-vurgu)' : BILET_YAZI, opacity: vurgu ? 0.16 : 0.09 }}
      />
      <span
        className="rakam relative block font-display text-[18px] leading-none font-black"
        style={{ color: vurgu ? 'var(--bilet-vurgu-acik)' : undefined }}
      >
        {deger}
      </span>
      <span
        className="relative mt-1 block text-[9.5px] leading-none font-extrabold tracking-[0.12em] uppercase"
        style={{ color: vurgu ? 'var(--bilet-vurgu-acik)' : undefined, opacity: vurgu ? 0.75 : 0.6 }}
      >
        {etiket}
      </span>
    </div>
  )
}
