'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { Konu } from '@/lib/konu'
import type { KonuDersId } from '@/lib/konu/tip'
import { ozetPozuSec, type OzetPozu } from '@/lib/konu/ozet-maskotu'
import { dersVurgusu } from '@/components/ders-renkleri'
import { Buton } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Rabi } from '@/components/maskot/rabi'

/**
 * Destenin kapanışı: konunun özeti.
 *
 * Son kart okununca gelen ekran. Tasarım `tasarim/konu-bitti-v8.html`:
 * yoklama kapanışının (`soru-sahnesi.tsx` → `Kapanis`) dili, **dersin
 * renginde** — kapanışın altın tonlarının yerinde `dersVurgusu`, çizgili
 * kâğıdın yerinde kareli defter (`ozet-zemin`). Bir süre bir **yoklama
 * biletiydi** (`tasarim/yoklama-bileti.html`); kullanıcı süslerin arasında
 * bilginin okunmadığını söyledi, o yüzden süs yine yok: konfeti, damga, ses,
 * dolan halka yok.
 *
 * Yukarıdan aşağı:
 *
 * 1. **Ne bitti?** Ders · tema ve konunun adı; altında büyük Rabi ve
 *    "Konu bitti!". Rabi kutlayan üç pozdan biri (`ozetPozuSec`) ve
 *    **kıpırdamıyor** (kullanıcı istedi).
 * 2. **Ne kadar?** Kart, okuma süresi, yoklamadaki soru. Süre destenin kendi
 *    ölçüsü (`DesteSonucu.saniye`); destede gösterilmiyor — okumayı yarışa
 *    çevirmesin diye — ama okuma bitince söylemek bir şey yarıştırmıyor.
 *    Ölçü yoksa (sıfır) kutu çizilmiyor.
 * 3. **Neyi aklında tutmalı?** Kartların başlıkları (konunun iskeleti): ilk
 *    ikisi görünür, kalanı "Devamını gör" ile açılır (kullanıcı istedi).
 *    Altında varsa Rabi'nin notu: her konuda tek kartta, konunun en çok
 *    tuzak barındıran yeri.
 *
 * "Sırada yoklama var" kartı kullanıcının isteğiyle kalktı; sıradakini
 * "Yoklamaya başla" düğmesi söylüyor. "Haritaya dön" düğme değil yazı —
 * deste okundu ve kaydı yazıldı, yoklamayı vermemek konuyu okunmamış
 * yapmıyor; iki dolu düğme yan yana dursaydı hangisinin ileri götürdüğü
 * okunmazdı. Üstte çarpı yok, aynı sebeple: destenin çarpısıyla aynı yerde
 * duran bir düğme alışkanlıkla basılıyordu.
 *
 * **Çıkış perdeyle** (`kapanis-cikar`): bayrak (`cikiyor`) üst bileşenden
 * geliyor — sökme kararını o veriyor ve süreyi o bekliyor (`SoruSahnesi`).
 */
export function KonuOzeti({
  konu,
  ders,
  dersAdi,
  temaAdi,
  okumaSaniyesi,
  onBasla,
  onVazgec,
  cikiyor,
}: {
  konu: Konu
  /** Ekranın rengi bu dersten gelir. */
  ders: KonuDersId
  dersAdi: string
  temaAdi: string
  /** Destede geçen süre; bilinmiyorsa 0. */
  okumaSaniyesi: number
  onBasla: () => void
  onVazgec: () => void
  /** Perde çekiliyor; bkz. yukarıdaki yorum. */
  cikiyor?: boolean
}) {
  // Poz açılışta bir kez seçilir; yeniden çizimde tavşan değişmesin.
  const [poz] = useState(() => {
    sonPoz = ozetPozuSec(sonPoz)
    return sonPoz
  })
  const [acik, setAcik] = useState(false)

  const kartSayisi = konu.kartlar.length
  const soruSayisi = konu.sorular.length
  const notluKart = konu.kartlar.find((k) => k.not)
  const ilkKartlar = konu.kartlar.slice(0, ILK_KART)
  const kalanKartlar = konu.kartlar.slice(ILK_KART)

  const kutular = [
    { deger: String(kartSayisi), etiket: 'Kart' },
    ...(okumaSaniyesi > 0 ? [{ deger: sureYaz(okumaSaniyesi), etiket: 'Süre' }] : []),
    ...(soruSayisi > 0 ? [{ deger: String(soruSayisi), etiket: 'Soru' }] : []),
  ]

  return (
    <div
      style={{ ...dersVurgusu(ders), '--ozet-cizgi': `var(--konu-${ders}-kenar)` } as React.CSSProperties}
      className={cn('ozet-zemin fixed inset-0 z-50 flex flex-col', cikiyor && 'kapanis-cikar')}
    >
      <header className="mx-auto w-full max-w-md shrink-0 px-4 pt-[calc(0.9rem+var(--guvenli-ust))] text-center">
        <p className="truncate text-[10.5px] font-extrabold tracking-[0.14em] text-primary uppercase">
          {dersAdi} · {temaAdi}
        </p>
        <h1 className="mt-0.5 font-display text-[16px] leading-tight font-extrabold tracking-tight text-balance">
          {konu.ad}
        </h1>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5">
        <div className="mx-auto my-auto w-full max-w-md py-2">
          <div className="kapanis-gel flex flex-col items-center">
            <Rabi
              durum="kutlama"
              poz={poz}
              boyut={140}
              className="drop-shadow-[0_10px_12px_rgba(31,36,48,0.16)]"
            />
            <h2 className="mt-2 text-center font-display text-[23px] font-black tracking-tight">
              Konu bitti!
            </h2>
          </div>

          <div className="mt-4 flex gap-2.5">
            {kutular.map((k, i) => (
              <div
                key={k.etiket}
                style={{ animationDelay: `${300 + i * 120}ms` }}
                className="kapanis-gel golge-kart flex-1 rounded-[16px] border border-[var(--ozet-cizgi)] bg-card px-2 py-2.5 text-center"
              >
                <p className="rakam text-[22px] leading-none font-black text-primary">{k.deger}</p>
                <p className="mt-1 text-[10.5px] font-extrabold tracking-[0.08em] text-muted-foreground uppercase">
                  {k.etiket}
                </p>
              </div>
            ))}
          </div>

          <section
            style={{ animationDelay: `${300 + kutular.length * 120}ms` }}
            className="kapanis-gel golge-kart mt-2.5 overflow-hidden rounded-[18px] border border-[var(--ozet-cizgi)] bg-card"
          >
            <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-1">
              <h3 className="text-[10px] font-extrabold tracking-[0.18em] text-muted-foreground uppercase">
                Bu konuda öğrendiklerin
              </h3>
              <span className="rakam shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-[11.5px] font-extrabold text-primary">
                {kartSayisi} kart
              </span>
            </div>
            <KartListesi kartlar={ilkKartlar} baslangic={0} son={kalanKartlar.length === 0} />
            {kalanKartlar.length > 0 && (
              <>
                <div id="ozet-kalan" data-acik={acik} className="ozet-liste">
                  <div className="min-h-0 overflow-hidden">
                    <KartListesi kartlar={kalanKartlar} baslangic={ILK_KART} son />
                  </div>
                </div>
                <button
                  type="button"
                  aria-expanded={acik}
                  aria-controls="ozet-kalan"
                  onClick={() => setAcik((a) => !a)}
                  className="flex w-full items-center justify-center gap-1.5 border-t border-border px-4 pt-2.5 pb-3 text-[13px] font-extrabold text-primary transition active:bg-primary-soft"
                >
                  {acik ? 'Daha az göster' : 'Devamını gör'}
                  <ChevronDown
                    size={16}
                    strokeWidth={2.6}
                    aria-hidden
                    className={cn('transition-transform duration-200', acik && 'rotate-180')}
                  />
                </button>
              </>
            )}
          </section>

          {notluKart?.not && (
            <section
              style={{ animationDelay: `${420 + kutular.length * 120}ms` }}
              className="kapanis-gel golge-kart mt-2.5 flex items-start gap-2.5 rounded-[18px] border border-[var(--ozet-cizgi)] bg-card px-4 py-3"
            >
              <span
                aria-hidden
                className="mt-px grid size-5 shrink-0 place-items-center rounded-[7px] bg-primary-parlak text-[12px] font-black text-white"
              >
                !
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold tracking-[0.14em] text-primary uppercase">
                  Dikkat · {notluKart.baslik}
                </p>
                <p className="mt-0.5 text-[13px] leading-snug font-bold text-foreground/85">{notluKart.not}</p>
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="shrink-0 px-4 pt-2 pb-[calc(0.75rem+var(--guvenli-alt))]">
        <div className="mx-auto w-full max-w-md">
          {/* Kapanıştaki "basılabilir" düğme: dolgu dersin parlak tonu, altındaki
              çizgi koyu tonu; basınca çizgi kadar iniyor. */}
          <Buton
            onClick={onBasla}
            className="h-14 w-full gap-2.5 rounded-[18px] bg-primary-parlak text-[16.5px] font-extrabold text-white shadow-[0_3px_0_var(--primary)] active:translate-y-0.5 active:shadow-[0_1px_0_var(--primary)] active:brightness-100"
          >
            Yoklamaya başla
            <span className="grid size-[26px] place-items-center rounded-[9px] bg-white/18">
              <ChevronRight size={16} strokeWidth={3} aria-hidden />
            </span>
          </Buton>
          <button
            type="button"
            onClick={onVazgec}
            className="mt-0.5 w-full pt-2.5 pb-1 text-[13.5px] font-bold text-muted-foreground transition active:text-foreground"
          >
            Haritaya dön
          </button>
        </div>
      </div>
    </div>
  )
}

/** Liste kapalıyken görünen kart sayısı. */
const ILK_KART = 2

/**
 * Bir önceki özetin pozu — art arda iki özette aynı tavşan gelmesin diye
 * (`ozetPozuSec`). Oturumluk; kayda yazılmıyor.
 */
let sonPoz: OzetPozu | null = null

function KartListesi({
  kartlar,
  baslangic,
  son,
}: {
  kartlar: Konu['kartlar']
  baslangic: number
  /** Kutunun en alttaki listesi: alt boşluk yalnız onda, iki liste birleşince arada boşluk kalmasın. */
  son?: boolean
}) {
  return (
    <ol className={cn(son && 'pb-1.5')}>
      {kartlar.map((kart, i) => (
        <li key={kart.id} className="flex items-start gap-2.5 px-4 py-1.5">
          <span className="rakam mt-px grid size-5 shrink-0 place-items-center rounded-[7px] bg-primary-soft text-[11px] font-black text-primary">
            {baslangic + i + 1}
          </span>
          <span className="min-w-0 text-[13px] leading-snug font-bold text-foreground/85">{kart.baslik}</span>
        </li>
      ))}
    </ol>
  )
}

/**
 * "6:40". Saat yazılmıyor: tek seans zaten iki saatte kırpılıyor
 * (`okuma-suresi.ts`) ve bir konu o kadar sürmüyor. Dakikalı biçim üçlü
 * kutuya sığsın diye; "6 dk 40 sn" dar kutuda iki satıra düşerdi.
 */
function sureYaz(saniye: number): string {
  const s = Math.round(saniye)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
