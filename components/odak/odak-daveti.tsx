'use client'

import { BellOff, ShieldCheck, Sparkles, Timer } from 'lucide-react'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { useGeriKatmani } from '@/lib/geri'

/**
 * Odak kilidi açılmadan önce çıkan davet penceresi.
 *
 * Anahtar eskiden doğrudan açıyordu ve özellik orada ölüyordu: kilit ancak
 * ikisi de sistem ayarlarından elle verilen izinlerle çalışıyor, izin
 * ekranları da Android'in en korkutucu ekranları ("bu uygulama ekranındaki her
 * şeyi görebilir"). Ne işe yaradığını bilmeden o ekrana düşen kullanıcı geri
 * dönüyor ve anahtar açık ama kilit çalışmıyor kalıyordu.
 *
 * Pencerenin iki işi var: **önce** ne kazandığını söylemek, **sonra** izin
 * ekranındaki uyarının ne olduğunu önceden açıklamak. İkincisi olmadan
 * kullanıcı uyarıyı gördüğü an vazgeçiyor — haklı olarak.
 *
 * Zorlamıyor: "İstemiyorum" pencereyi kapatıyor ve anahtar kapalı kalıyor,
 * ikinci bir soru sorulmuyor. Kendini kapatamayan bir özellik yardım değil
 * dayatmadır; kullanıcı Ayarlar'dan istediği an geri gelebiliyor.
 */
export function OdakDaveti({
  acik,
  onIstiyorum,
  onIstemiyorum,
}: {
  acik: boolean
  /** İzin akışını başlatır — kilit henüz açılmıyor, izinler alınınca açılıyor. */
  onIstiyorum: () => void
  /** Pencere kapanır, anahtar kapalı kalır. */
  onIstemiyorum: () => void
}) {
  // Geri tuşu "istemiyorum" ile aynı: kapanan pencere kilidi açmamalı.
  useGeriKatmani(acik, onIstemiyorum)

  if (!acik) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-5 pt-[calc(1rem+var(--guvenli-ust))] pb-[calc(1rem+var(--guvenli-alt))]">
      {/*
        Dikey dikdörtgen: yüksekliği içeriğe bırakılmadı, ekranın çoğunu
        kaplaması bilinçli. Alçak bir kutu "onayla/vazgeç" kutusuna benziyor ve
        okunmadan kapatılıyordu; bu pencerenin işi okutmak.

        İçerik kaydırılabilir çünkü küçük ekranda dört madde + iki düğme
        sığmıyor ve düğmelerin ekran dışında kalması pencereyi kilitler.
      */}
      <div className="flex max-h-full w-full max-w-[340px] flex-col overflow-hidden rounded-[26px] bg-card golge-kart">
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-1 text-center">
          {/* `mx-auto` şart: maskot bir `img` ve `text-center` onu ortalamıyor. */}
          <Rabi durum="calisiyor" boyut={104} className="mx-auto" />

          <h2 className="mt-2 font-display text-[20px] font-extrabold leading-tight tracking-tight text-balance">
            Bu turu birlikte koruyalım mı?
          </h2>
          <p className="mt-1.5 text-[13.5px] leading-snug font-medium text-muted-foreground">
            Odak kilidi açıkken çalışma turun gerçekten çalışma turu oluyor.
          </p>

          <ul className="mt-4 space-y-2 text-left">
            <Madde Simge={Timer} baslik="Refleksi kesiyor">
              Telefona uzanmak alışkanlık; sayaç çalışırken Instagram'ı açmaya
              kalkarsan karşına ben çıkarım. Bir saniyelik duraklama çoğu zaman
              yeter.
            </Madde>
            <Madde Simge={BellOff} baslik="Bildirimler susuyor">
              Seçtiğin uygulamaların bildirimleri tur boyunca silinir. Dikkatini
              dağıtan şey çoğu zaman uygulama değil, tepeden düşen o yazı.
            </Madde>
            <Madde Simge={Sparkles} baslik="Turların gerçekten dolar">
              Yarıda bırakılan 25 dakika 25 dakika sayılmaz. Kilitli turlar
              istatistiğinde tam olarak görünür.
            </Madde>
          </ul>

          {/*
            İzin ekranındaki uyarı **burada** açıklanıyor, oraya düşmeden önce.
            Android bildirim erişimi ve kullanım verisi için elinden gelen en
            sert cümleyi kuruyor; hazırlıksız yakalanan kullanıcı bunu virüs
            sanıp geri dönüyor. Sistemin uyarısını yumuşatmıyoruz, ne olduğunu
            söylüyoruz.
          */}
          <div className="mt-4 rounded-[16px] border border-border bg-muted/50 p-3 text-left">
            <p className="flex items-center gap-1.5 text-[12.5px] font-extrabold">
              <ShieldCheck size={15} className="shrink-0 text-primary" aria-hidden />
              Android sana korkutucu bir uyarı gösterecek
            </p>
            <p className="mt-1.5 text-[12px] leading-snug font-medium text-muted-foreground">
              &ldquo;Bu uygulama ekrandaki her şeyi görebilir&rdquo; gibi bir yazı
              çıkarsa şaşırma — Android bu izinleri isteyen <em>her</em> uygulamaya
              aynı cümleyi gösteriyor. Rabi virüs değil, reklam da göstermiyor.
            </p>
            <p className="mt-1.5 text-[12px] leading-snug font-medium text-muted-foreground">
              Yaptığım tek şey: <b className="font-extrabold">hangi uygulamanın açık
              olduğuna</b> bakmak ve seçtiklerinin bildirimini silmek. İçeriğini
              okumuyorum, kaydetmiyorum. Rabi'nin sunucusu yok; hiçbir veri
              telefonundan çıkmıyor.
            </p>
          </div>
        </div>

        {/*
          Düğmeler kaydırılan alanın dışında: uzun metnin sonuna kadar inmeden
          de karar verilebilmeli. "İstemiyorum" solda ve ikincil biçimde ama
          soluk değil — vazgeçmesi zorlaştırılmış bir pencere, izni baskıyla
          almış olurdu.
        */}
        <div className="flex flex-none gap-2 border-t border-border p-4">
          <Buton bicim="ikincil" className="flex-1" onClick={onIstemiyorum}>
            İstemiyorum
          </Buton>
          <Buton className="flex-1" onClick={onIstiyorum}>
            İstiyorum
          </Buton>
        </div>
      </div>
    </div>
  )
}

function Madde({
  Simge,
  baslik,
  children,
}: {
  Simge: typeof Timer
  baslik: string
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-2.5">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
        <Simge size={15} strokeWidth={2.4} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-[13.5px] font-extrabold leading-tight">{baslik}</span>
        <span className="mt-0.5 block text-[12.5px] leading-snug font-medium text-muted-foreground">
          {children}
        </span>
      </span>
    </li>
  )
}
