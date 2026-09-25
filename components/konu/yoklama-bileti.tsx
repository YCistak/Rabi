'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import type { Konu } from '@/lib/konu'
import { yoklamaDakikasi } from '@/lib/konu'
import { useGeriKatmani } from '@/lib/geri'
import { titret } from '@/lib/titresim'
import { Buton } from '@/components/ui'
import { cn } from '@/lib/utils'
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
 * **Zemin uygulamanın kırık beyazı, bilet beyaz kart, vurgu amber; derse
 * göre değişmiyor.** Mockup'ta üstte Fizik'in rengine boyalı noktalı bir
 * bant vardı ve bilet lacivertti; uygulama bir süre bunu yedi derse yedi
 * ayrı biletle taşıdı (şarap+nane, mor+limon…), sonra tek bir koyu kızıl
 * kahve + altın bilete indi. Kullanıcı onu da geri aldı: bilet artık
 * uygulamanın geri kalanıyla aynı dilde — `--card` üstüne `--primary` yazı
 * ve `--primary-parlak` dolgu, zemin `--background`. Ayrı bir `--bilet*`
 * paleti kalmadı; koyu bilet ekranda tek koyu yüzeydi ve her ekran açık
 * zeminliyken tek başına başka bir uygulamadan gelmiş gibi duruyordu.
 * Bilet dersin değil uygulamanın — her derste aynı görünüyor, "yoklama"
 * dediğin şey her yerde aynı biletle geliyor. Bu bileşen bu yüzden `bicim`
 * almıyor.
 *
 * **Bilet koçanı gerçek bir çentikle ayrılıyor.** Mockup çentiği `mask-image`
 * ile kesiyordu ve çentiğin yeri piksel olarak yazılıydı (177 px); konu adı
 * iki satıra kırılınca kesik çizgi aşağı kayar, çentik yerinde kalırdı.
 * Burada çentik kesik çizginin **kendi satırında** iki daire: biletin
 * `overflow-hidden` kenarı dairelerin dış yarısını kırpıyor ve geriye içe
 * oyulmuş iki yarım daire kalıyor. Daireler zeminin renginde
 * (`--background`) — bilet beyaz, zemin kırık beyaz; daireler bembeyaz
 * olsaydı çentik oyuk değil yama gibi dururdu.
 *
 * Halka her zaman %100: bilet yalnızca deste **sonuna kadar** okunduğunda
 * geliyor (`konu-haritasi.tsx`), yarım destenin bileti yok. Sayı yine de
 * yazılı — halkanın dolarak gelmesi "hepsi okundu"yu söylemenin kendisi.
 *
 * "Bu destede öğrendiklerin" alttan açılan bir sayfa, biletin içinde liste
 * değil: on altı kartlık konuda liste bileti ekranın dışına taşırırdı.
 *
 * **"Haritaya dön" bir düğme değil bir çıkış.** Deste zaten okundu ve kaydı
 * yazıldı; yoklamayı vermemek konuyu okunmamış yapmıyor. İki dolu düğme yan
 * yana dursaydı hangisinin ileri götürdüğü okunmazdı — kurulumdaki "Şimdilik
 * atla" kuralı. Yazı bir süre "Şimdi değil"di; nereye gidildiğini
 * söylemiyordu ve kullanıcı haritaya değil ana sayfaya atılacağını sanıyordu.
 *
 * **Üstte çarpı yok.** Bir süre çubuğun solunda bir kapatma düğmesi vardı
 * ve "Haritaya dön" ile aynı işi yapıyordu; destenin çarpısıyla aynı yerde
 * durduğu için alışkanlıkla basılıyor, kullanıcı yoklamayı seçmeden
 * haritaya atılıyordu. Kullanıcı kaldırılmasını istedi: çıkışın tek yolu
 * altta, adı yazılı.
 *
 * **Çıkış perdeyle.** "Haritaya dön" denince bilet tek karede sökülmüyor;
 * kapanış ekranındaki perdenin aynısı (`kapanis-cikar`, yukarıdan aşağı
 * kırpılarak) burada da çekiliyor. Bayrak (`cikiyor`) üst bileşenden geliyor
 * — sökme kararını o veriyor ve süreyi o bekliyor (`SoruSahnesi`).
 *
 * **Üç efekt, üçü de damgaya bağlı** (kullanıcı seçti): koçandaki sayılar
 * sıfırdan sayarak doluyor (`useSayac`, halkayla aynı anda), damga basılınca
 * kısa bir titreşim geliyor (`titret`), hemen ardından biletin üstünden bir
 * kez altın toz süzülüyor (`Toz`). Zamanlar `globals.css`teki damga
 * gecikmesiyle **eşleşmeli** (`DAMGA_MS`); titreşim görüntüden önce gelirse
 * neyi doğruladığı anlaşılmıyor. Damganın bir de sesi vardı (alçak bir
 * "tak"); kullanıcı kaldırdı — titreşim tek başına yetiyor. Konfeti yok — o
 * oyunlardaki rekora ait. `prefers-reduced-motion` altında damga anında
 * basılı, sayılar dolu, toz yok; titreşim yine geliyor — hareket değil.
 */
export function YoklamaBileti({
  konu,
  dersAdi,
  temaAdi,
  onBasla,
  onVazgec,
  cikiyor,
}: {
  konu: Konu
  dersAdi: string
  temaAdi: string
  onBasla: () => void
  onVazgec: () => void
  /** Perde çekiliyor; bkz. yukarıdaki yorum. */
  cikiyor?: boolean
}) {
  const [liste, setListe] = useState(false)
  useGeriKatmani(liste, () => setListe(false))

  const kartSayisi = konu.kartlar.length
  const soruSayisi = konu.sorular.length
  const dakika = yoklamaDakikasi(soruSayisi)

  const sakin = hareketAzaltilmis()
  const kartSayaci = useSayac(kartSayisi, sakin ? 0 : 760)
  const soruSayaci = useSayac(soruSayisi, sakin ? 0 : 840)
  const dakikaSayaci = useSayac(dakika, sakin ? 0 : 920)

  /*
    Damga ânı: titreşim, hemen ardından toz. Hareket kapalıysa damga ilk
    karede basılı, o yüzden ikisi de beklemeden geliyor.
  */
  const [toz, setToz] = useState(false)
  useEffect(() => {
    const damga = window.setTimeout(titret, sakin ? 0 : DAMGA_MS)
    const tozZ = window.setTimeout(() => setToz(true), sakin ? 0 : TOZ_MS)
    return () => {
      window.clearTimeout(damga)
      window.clearTimeout(tozZ)
    }
  }, [sakin])

  return (
    <div className={cn('fixed inset-0 z-50 flex flex-col bg-background', cikiyor && 'kapanis-cikar')}>
      {/* Işıma maskotun arkasında, markanın sıcak tonunda: düz zeminde
          tavşan havada duruyordu. */}
      <div
        aria-hidden
        className="bilet-hale pointer-events-none absolute top-[136px] left-1/2 size-[330px] -translate-x-1/2 rounded-full"
        style={{
          opacity: 0.7,
          background:
            'radial-gradient(closest-side, rgba(251,238,231,0.95), rgba(251,238,231,0.45) 55%, rgba(248,248,247,0))',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-md min-h-0 flex-1 flex-col items-center overflow-y-auto overscroll-contain px-5 pt-[calc(1rem+var(--guvenli-ust))] pb-[calc(1.25rem+var(--guvenli-alt))]">
        {/* Satır çarpı düğmesinin boyunda kalıyor (h-10): bilet ve ışıma bu
            yüksekliğe göre yerleşti. */}
        <div className="flex h-10 w-full items-center gap-3">
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

        <div className="bilet-kart relative mt-[198px] w-full max-w-[330px] shrink-0">
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
                    color: i % 2 === 0 ? 'var(--primary-parlak)' : 'var(--primary)',
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
            className="bilet-basinc relative z-[1] overflow-hidden rounded-3xl bg-card text-foreground"
            style={{ filter: 'drop-shadow(0 18px 34px rgba(179, 73, 31, 0.18))' }}
          >
            {/* Üstten inen amber ışık ve tepedeki dolu şerit: bilet düz bir
                dikdörtgen değil, ışığın altında duran bir kâğıt. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: 0.55,
                background: 'radial-gradient(120% 62% at 50% -12%, var(--primary-soft), transparent 68%)',
              }}
            />
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[5px] bg-primary-parlak" />

            <div className="relative px-5.5 pt-[54px] text-center">
              <p className="text-[9.5px] font-extrabold tracking-[0.24em] text-primary uppercase">
                Yoklama bileti
              </p>
              <h3 className="mt-2 font-display text-[26px] leading-[1.12] font-black tracking-tight text-balance">
                {konu.ad} okundu
              </h3>
              <p className="mt-2 text-[13.5px] leading-snug font-semibold text-muted-foreground text-pretty">
                Sırada {soruSayisi} soruluk kısa bir yoklama var; gerekçesi her soruda hemen
                altında.
              </p>
            </div>

            {/* Koçan çizgisi ve iki çentik — gerekçesi yukarıdaki yorumda. */}
            <div aria-hidden className="relative mt-4 h-[26px]">
              <span className="absolute inset-x-4.5 top-1/2 border-t-2 border-dashed border-border" />
              <span className="absolute top-1/2 -left-[13px] size-[26px] -translate-y-1/2 rounded-full bg-background" />
              <span className="absolute top-1/2 -right-[13px] size-[26px] -translate-y-1/2 rounded-full bg-background" />
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
                    stroke="var(--primary-soft)"
                    strokeWidth="9"
                  />
                  <circle
                    cx="37"
                    cy="37"
                    r={HALKA_YARICAP}
                    fill="none"
                    stroke="var(--primary-parlak)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={HALKA_CEVRE}
                    strokeDashoffset="0"
                    className="bilet-halka"
                    style={{ ['--cevre' as string]: `${HALKA_CEVRE}px` }}
                  />
                </svg>
                <span className="rakam absolute font-display text-[18px] font-black text-primary">
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
                  className="text-[12.5px] leading-tight font-extrabold text-primary underline underline-offset-2 transition active:opacity-70"
                >
                  Bu destede öğrendiklerin
                </button>
              </span>
            </div>

            <div className="relative flex gap-2 px-5.5 pt-4 pb-5">
              <Kutu deger={kartSayaci} etiket="kart" gecikme={760} />
              <Kutu deger={soruSayaci} etiket="soru" gecikme={840} />
              <Kutu deger={`~${dakikaSayaci}`} etiket="dakika" gecikme={920} vurgu />
            </div>
          </div>

          {/* Damga en son basılıyor; halka basıncın dalgası. */}
          <span
            aria-hidden
            className="bilet-damga absolute -top-3.5 right-1.5 z-[3] grid size-[76px] place-items-center rounded-full border-[2.5px] border-primary-parlak bg-card text-center font-display text-[15px] leading-[1.15] font-black tracking-[0.08em] text-primary"
          >
            BİTTİ
          </span>
          <span
            aria-hidden
            className="bilet-damga-halka absolute -top-3.5 right-1.5 z-[2] size-[76px] rounded-full border-2 border-primary-parlak"
            style={{ opacity: 0 }}
          />

          {toz && !sakin && <Toz />}
        </div>

        <div className="min-h-4 flex-1" />

        {/* `shrink-0` şart: sütun kaydırılabilir bir flex kutusu ve içerik
            ekrana sığmadığında iki düğme yüksekliğinden veriyor — küçük
            telefonda "Yoklamaya başla" birkaç piksellik bir çizgiye iniyordu. */}
        <Buton
          onClick={onBasla}
          className="bilet-giris h-14 w-full shrink-0 text-[16.5px]"
          style={{ animationDelay: '900ms' }}
        >
          Yoklamaya başla
          <ArrowRight size={18} strokeWidth={3} aria-hidden />
        </Buton>
        <button
          type="button"
          onClick={onVazgec}
          className="mt-1.5 shrink-0 px-4 py-3 text-[13.5px] font-extrabold text-muted-foreground transition active:opacity-70"
        >
          Haritaya dön
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
                    className="grid size-[21px] shrink-0 place-items-center rounded-[7px] bg-primary-parlak text-white"
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

/** Damganın basıldığı an — `globals.css`teki `.bilet-damga` gecikmesiyle aynı. */
const DAMGA_MS = 820
/** Tozun başladığı an — biletin basınç altında ezildiği kare (`.bilet-basinc`). */
const TOZ_MS = 1040

function hareketAzaltilmis(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Sıfırdan hedefe sayan sayaç. `gecikme` sonra başlıyor, `SAYAC_SURESI`
 * boyunca yavaşlayarak doluyor (küp ease-out): son sayılar ağır geçiyor,
 * gözün sayıyı okuduğu yer orası. Gecikme sıfırsa hiç saymıyor, hedefi
 * yazıyor — hareket kapalı kullanıcı için.
 */
function useSayac(hedef: number, gecikme: number): number {
  const [deger, setDeger] = useState(gecikme === 0 ? hedef : 0)
  useEffect(() => {
    if (gecikme === 0) {
      setDeger(hedef)
      return
    }
    let kare = 0
    let baslangic = 0
    const adim = (simdi: number) => {
      if (!baslangic) baslangic = simdi
      const t = Math.min(1, (simdi - baslangic) / SAYAC_SURESI)
      const e = 1 - Math.pow(1 - t, 3)
      setDeger(Math.round(hedef * e))
      if (t < 1) kare = requestAnimationFrame(adim)
    }
    const z = window.setTimeout(() => {
      kare = requestAnimationFrame(adim)
    }, gecikme)
    return () => {
      window.clearTimeout(z)
      cancelAnimationFrame(kare)
    }
  }, [hedef, gecikme])
  return deger
}

const SAYAC_SURESI = 620

/**
 * Amber toz — biletin üst kenarından bir kez süzülen parçacıklar.
 *
 * Konum ve zamanlama parçacık başına ve rastgele, ama **bir kez** atılıyor
 * (`useState` başlangıcı): her çizimde yeniden atılsaydı parçacıklar
 * sıçrardı. Sayı az (18) ve hepsi 2,2 saniyede bitiyor — konfeti değil.
 */
function Toz() {
  const [parcalar] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      sol: 6 + Math.random() * 88,
      boy: 3 + Math.random() * 3,
      gecikme: Math.random() * 700,
      sure: 1700 + Math.random() * 900,
      kayma: (Math.random() - 0.5) * 60,
      acik: i % 3 === 0,
    })),
  )
  return (
    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-0">
      {parcalar.map((p, i) => (
        <span
          key={i}
          className="bilet-toz absolute rounded-full"
          style={{
            left: `${p.sol}%`,
            top: -6,
            width: p.boy,
            height: p.boy,
            opacity: 0,
            background: p.acik ? 'var(--primary)' : 'var(--primary-parlak)',
            animationDelay: `${p.gecikme}ms`,
            animationDuration: `${p.sure}ms`,
            ['--kayma' as string]: `${p.kayma}px`,
          }}
        />
      ))}
    </span>
  )
}

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

/**
 * Koçandaki üç kutu; sonuncusu amber zeminde — süre, ötekilerden farklı bir
 * bilgi. Zemin doğrudan tema değişkeninden: koyu bilet döneminde alfa
 * kanalı için ayrı bir katman gerekiyordu, açık kartta `--muted` ve
 * `--primary-soft` zaten o iş için var.
 */
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
      className={cn(
        'bilet-pop relative flex-1 overflow-hidden rounded-[13px] px-1.5 py-2.5 text-center',
        vurgu ? 'bg-primary-soft text-primary' : 'bg-muted text-foreground',
      )}
      style={{ animationDelay: `${gecikme}ms` }}
    >
      <span className="rakam block font-display text-[18px] leading-none font-black">{deger}</span>
      <span
        className={cn(
          'mt-1 block text-[9.5px] leading-none font-extrabold tracking-[0.12em] uppercase',
          vurgu ? 'text-primary/75' : 'text-muted-foreground',
        )}
      >
        {etiket}
      </span>
    </div>
  )
}
