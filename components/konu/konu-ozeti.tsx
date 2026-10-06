"use client";

import { ArrowRight, BookOpenCheck, Clock3, ListChecks } from "lucide-react";
import type { Konu } from "@/lib/konu";
import type { KonuDersId } from "@/lib/konu/tip";
import { dersVurgusu } from "@/components/ders-renkleri";
import { Buton, kartGirisi } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Rabi } from "@/components/maskot/rabi";

/**
 * Destenin kapanışı: konunun özeti.
 *
 * Son kart okununca gelen ekran. Bir süre bir **yoklama biletiydi**
 * (`tasarim/yoklama-bileti.html`): kupayı kaldıran Rabi, "BİTTİ" damgası,
 * çentikli koçan, dolan halka, damgayla süzülen altın toz. Kullanıcı ekranı
 * kötü buldu ve tasarımdan değil koddan yeniden yazılmasını istedi; isteği
 * de açıktı: ders sonunda **gerekli bilgiyi** ver. Biletin bilgisi üç sayıdan
 * ibaretti (kart, soru, dakika) ve sayılar süslerin arasında okunmuyordu.
 *
 * Ekran şimdi üç soruya cevap veriyor, yukarıdan aşağı:
 *
 * 1. **Ne bitti?** Konunun adı, ders ve tema.
 * 2. **Ne kadar?** Okunan kart ve destede geçen süre. Süre destenin kendi
 *    ölçüsü (`DesteSonucu.saniye`, uygulama öndeyken akan); destede
 *    gösterilmiyor — okumayı yarışa çevirmesin diye — ama okuma bitince
 *    söylemek bir şey yarıştırmıyor. Ölçü yoksa (sıfır) kutu çizilmiyor.
 * 3. **Neyi aklında tutmalı?** Kartların başlıkları, sırayla — konunun
 *    iskeleti — ve varsa Rabi'nin notu. Not her konuda tek kartta ve o
 *    kart konunun en çok tuzak barındıran yeri (`BilgiKarti.not`); destenin
 *    ortasında bir kez geçip kayboluyordu, kapanışta bir kez daha söylenmeye
 *    değer. Kart metinleri yazılmıyor: özet destenin ikinci kopyası olurdu.
 *
 * En alttaki "Sırada yoklama var" kartı kullanıcının isteğiyle kalktı;
 * sıradakini "Yoklamaya başla" düğmesi söylüyor.
 *
 * Renk **dersin rengi** (`dersVurgusu`, kullanıcı istedi): ders bir yerde
 * hangi renkteyse burada da o. Hareket hafif ve tek seferlik — başlık bandı
 * yükselir, Rabi süzülür, bant çubuğu dolar, kutular sırayla gelir; bilgi
 * süsün arasında kaybolmasın diye konfeti, damga, ses yok. "Haritaya
 * dön" düğme değil yazı — deste okundu ve kaydı yazıldı, yoklamayı vermemek
 * konuyu okunmamış yapmıyor; iki dolu düğme yan yana dursaydı hangisinin
 * ileri götürdüğü okunmazdı. Üstte çarpı yok, aynı sebeple: destenin
 * çarpısıyla aynı yerde duran bir düğme alışkanlıkla basılıyordu.
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
  konu: Konu;
  /** Ekranın rengi bu dersten gelir. */
  ders: KonuDersId;
  dersAdi: string;
  temaAdi: string;
  /** Destede geçen süre; bilinmiyorsa 0. */
  okumaSaniyesi: number;
  onBasla: () => void;
  onVazgec: () => void;
  /** Perde çekiliyor; bkz. yukarıdaki yorum. */
  cikiyor?: boolean;
}) {
  const kartSayisi = konu.kartlar.length;
  const soruSayisi = konu.sorular.length;
  const notluKart = konu.kartlar.find((k) => k.not);

  return (
    <div
      style={dersVurgusu(ders)}
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-background",
        cikiyor && "kapanis-cikar",
      )}
    >
      <div className="mx-auto w-full max-w-md min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-[calc(1.25rem+var(--guvenli-ust))] pb-4">
        <div className="ozet-bandi relative overflow-hidden rounded-3xl bg-primary-soft px-4 pt-4 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="kapanis-suzul shrink-0">
              <Rabi durum="kutlama" poz="kafa" boyut={64} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold tracking-[0.12em] text-primary uppercase">
                Konu bitti
              </p>
              <h1 className="font-display text-[22px] leading-tight font-extrabold tracking-tight">
                {konu.ad}
              </h1>
              <p className="mt-0.5 truncate text-[12.5px] font-bold text-muted-foreground">
                {dersAdi} · {temaAdi}
              </p>
            </div>
          </div>
          {/* Destenin bittiğini söyleyen çubuk: boştan dolar, bir kez. */}
          <div className="absolute inset-x-4 bottom-2.5 h-1 overflow-hidden rounded-full bg-card/60">
            <div className="ozet-bandi-cubuk h-full rounded-full bg-primary-parlak" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Sayi
            sira={0}
            simge={<BookOpenCheck size={17} strokeWidth={2.3} aria-hidden />}
            deger={`${kartSayisi}/${kartSayisi}`}
            etiket="kart okundu"
          />
          {okumaSaniyesi > 0 ? (
            <Sayi
              sira={1}
              simge={<Clock3 size={17} strokeWidth={2.3} aria-hidden />}
              deger={sureYaz(okumaSaniyesi)}
              etiket="okuma süresi"
            />
          ) : (
            <Sayi
              sira={1}
              simge={<ListChecks size={17} strokeWidth={2.3} aria-hidden />}
              deger={String(soruSayisi)}
              etiket="yoklama sorusu"
            />
          )}
        </div>

        <section className="mt-5">
          <h2 className="mb-2 ml-0.5 text-[12px] font-extrabold tracking-[0.06em] text-muted-foreground uppercase">
            Bu konuda öğrendiklerin
          </h2>
          <ol className="golge-kart overflow-hidden rounded-2xl bg-card">
            {konu.kartlar.map((kart, i) => (
              <li
                key={kart.id}
                style={kartGirisi(i).style}
                className="kart-girisi flex items-start gap-3 border-t border-border px-4 py-2.5 first:border-t-0"
              >
                <span className="rakam mt-px w-5 shrink-0 text-right text-[12.5px] font-extrabold text-primary">
                  {i + 1}
                </span>
                <span className="min-w-0 text-[14px] leading-snug font-bold">
                  {kart.baslik}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {notluKart?.not && (
          <section className="mt-4 flex items-start gap-3 rounded-2xl bg-primary-soft px-4 py-3.5">
            <Rabi poz="isaretci" boyut={40} className="-my-1" />
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold tracking-[0.08em] text-primary uppercase">
                Dikkat · {notluKart.baslik}
              </p>
              <p className="mt-0.5 text-[13.5px] leading-snug font-semibold">
                {notluKart.not}
              </p>
            </div>
          </section>
        )}
      </div>

      <div className="mx-auto w-full max-w-md shrink-0 border-t border-border bg-background px-5 pt-3 pb-[calc(0.75rem+var(--guvenli-alt))]">
        <Buton className="w-full" onClick={onBasla}>
          Yoklamaya başla
          <ArrowRight size={18} aria-hidden />
        </Buton>
        <button
          type="button"
          onClick={onVazgec}
          className="mt-1 w-full py-2.5 text-[13.5px] font-bold text-muted-foreground transition active:text-foreground"
        >
          Haritaya dön
        </button>
      </div>
    </div>
  );
}

function Sayi({
  sira,
  simge,
  deger,
  etiket,
}: {
  /** Bant yükseldikten sonra sırayla gelsin diye. */
  sira: number;
  simge: React.ReactNode;
  deger: string;
  etiket: string;
}) {
  return (
    <div
      style={{ animationDelay: `${180 + sira * 70}ms` }}
      className="ozet-sayi golge-kart rounded-2xl bg-card px-3.5 py-3"
    >
      <span className="text-primary">{simge}</span>
      <p className="rakam mt-1.5 font-display text-[22px] leading-none font-extrabold">
        {deger}
      </p>
      <p className="mt-1 text-[12px] font-bold text-muted-foreground">
        {etiket}
      </p>
    </div>
  );
}

/**
 * "4 dk 20 sn", bir dakikanın altında "45 sn". Saat yazılmıyor: tek seans
 * zaten iki saatte kırpılıyor (`okuma-suresi.ts`) ve bir konu o kadar sürmüyor.
 */
function sureYaz(saniye: number): string {
  const s = Math.round(saniye);
  if (s < 60) return `${s} sn`;
  const dk = Math.floor(s / 60);
  const kalan = s % 60;
  return kalan === 0 ? `${dk} dk` : `${dk} dk ${kalan} sn`;
}
