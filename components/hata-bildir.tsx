'use client'

/**
 * "Bu soru hatalı" düğmesi.
 *
 * İki yerde kullanılıyor: tur sonundaki yanlış kartları ve Oyun Bankası
 * kayıtları. İkisi de süresiz ekranlar — tur **içinde** bildirim yok, çünkü
 * orada süre işliyor ve geri bildirim şeridi yalnızca bir saniye duruyor;
 * yanlış dokunuş puana mal olurdu.
 *
 * Tek dokunuş yeter: bayrağa basıldığı anda bildirim kaydediliyor ve gönderim
 * kuyruğuna giriyor. Altında açılan sebep çipleri isteğe bağlı — ikinci bir
 * adım şart koşulsaydı hiç bildirim gelmezdi.
 *
 * **İlk** bildirimde bir kez izin soruluyor: ne gönderileceği tek tek yazılı
 * ve karar verilmeden hiçbir şey ağa çıkmıyor. Google Play'in kullanıcı verisi
 * politikası veri cihazdan çıkmadan önce belirgin açıklama ve kullanıcının
 * olumlu bir eylemini istiyor, bunu gizlilik politikasına havale etmeye izin
 * vermiyor. Soru bir kez soruluyor; karar ayarlardan değiştirilebiliyor.
 */

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { SECILEBILIR_SEBEPLER, SEBEP_ADI, type HataBildirimi, type HataSebebi } from '@/lib/hata-bildirimi'
import type { BildirimIzni } from '@/lib/hata-kuyrugu'
import type { BankaSorusu } from '@/lib/oyunlar/banka'
import { bankaKimligi } from '@/lib/oyunlar/banka'
import { cn } from '@/lib/utils'

/** Bildirim özelliğinin ekranlara inen kolu; AppShell'den prop olarak geçiyor. */
export interface BildirimKolu {
  bildirimler: HataBildirimi[]
  /** Günlük sınır dolduysa yeni bildirim kaydedilmiyor. */
  sinirda: boolean
  /** Gönderim izni; `'verildi'` olmadan hiçbir bildirim ağa çıkmıyor. */
  izin: BildirimIzni
  onBildir: (soru: BankaSorusu) => void
  onSebep: (kimlik: string, sebep: HataSebebi) => void
  onIzin: (karar: BildirimIzni) => void
}

/**
 * Gönderilecek alanların birebir listesi.
 *
 * `lib/hata-bildirimi.ts` içindeki `formVerisi()` ile aynı olmak zorunda —
 * oraya alan eklenirse buraya da eklenmeli, yoksa kullanıcıya söylenenden
 * fazlası gönderilmiş olur.
 */
const GONDERILENLER = [
  'sorunun kendisi',
  'hangi oyundan geldiği',
  'uygulamanın doğru saydığı cevap',
  'senin seçtiğin sebep',
  'uygulama sürümü',
  'ada bağlı olmayan bir cihaz numarası',
]

/**
 * İlk bildirimde bir kez çıkan izin kartı.
 *
 * Kartta onayın **kapsamı** da yazılı: düğme yalnızca o bildirimi değil
 * sonrakileri de gönderiyor. Play'in kullanıcı verisi politikası onayın "açık
 * ve tereddütsüz" olmasını istiyor ve üstünde "Gönder" yazan bir düğme tek
 * seferlik sanılabilirdi.
 */
function IzinKarti({ kol }: { kol: BildirimKolu }) {
  return (
    <div className="mt-2 rounded-xl bg-foreground/[0.05] p-3">
      <p className="text-[12px] font-extrabold">Bildirimin gönderilmesine izin veriyor musun?</p>
      <p className="mt-1 text-[11.5px] font-medium leading-snug text-muted-foreground">
        Soruyu düzeltebilmemiz için bildirim telefonundan çıkıp bize ulaşmalı. Gönderilecekler:
      </p>
      <ul className="mt-1.5 list-disc pl-4 text-[11.5px] font-medium leading-snug text-muted-foreground">
        {GONDERILENLER.map((alan) => (
          <li key={alan}>{alan}</li>
        ))}
      </ul>
      <p className="mt-1.5 text-[11.5px] font-medium leading-snug text-muted-foreground">
        Adın, netlerin, notların ve fotoğrafların <b>gönderilmez</b>; onlar telefonunda kalır.
        &ldquo;Gönder&rdquo; dersen <b>bundan sonraki bildirimlerin de</b> aynı şekilde
        gönderilir. Kararını Ayarlar&nbsp;&rsaquo;&nbsp;Veri'den değiştirebilirsin.
      </p>
      <div className="mt-2.5 flex gap-2">
        <button
          type="button"
          onClick={() => kol.onIzin('verildi')}
          className="rounded-full bg-ikincil px-3 py-1.5 text-[11.5px] font-extrabold text-white transition active:scale-[0.97]"
        >
          Gönder
        </button>
        <button
          type="button"
          onClick={() => kol.onIzin('reddedildi')}
          className="rounded-full bg-foreground/[0.08] px-3 py-1.5 text-[11.5px] font-extrabold text-muted-foreground transition active:scale-[0.97]"
        >
          Gönderme
        </button>
      </div>
    </div>
  )
}

export function BildirimDugmesi({ soru, kol }: { soru: BankaSorusu; kol: BildirimKolu }) {
  const kimlik = bankaKimligi(soru)
  const kayit = kol.bildirimler.find((b) => b.kimlik === kimlik)
  const bildirildi = kayit !== undefined
  // Bildirdikten hemen sonra çipler açılıyor: sebep bir dokunuş uzakta dursun.
  const [acik, setAcik] = useState(false)
  const [reddedildi, setReddedildi] = useState(false)

  const bas = () => {
    if (bildirildi) {
      setAcik((a) => !a)
      return
    }
    if (kol.sinirda) {
      setReddedildi(true)
      return
    }
    kol.onBildir(soru)
    setAcik(true)
  }

  return (
    <div className="mt-2 border-t border-border pt-2">
      <button
        type="button"
        onClick={bas}
        aria-pressed={bildirildi}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-extrabold transition active:scale-[0.97]',
          bildirildi
            ? 'bg-ikincil-soft text-ikincil'
            : 'bg-foreground/[0.06] text-muted-foreground active:bg-foreground/12',
        )}
      >
        <Flag size={13} className="shrink-0" fill={bildirildi ? 'currentColor' : 'none'} aria-hidden />
        {bildirildi ? 'Bildirildi' : 'Bu soru hatalı'}
      </button>

      {reddedildi && !bildirildi && (
        <p className="mt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
          Bugünlük bildirim sınırına ulaştın. Yarın yeniden bildirebilirsin.
        </p>
      )}

      {bildirildi && acik && kol.izin === 'sorulmadi' && <IzinKarti kol={kol} />}

      {bildirildi && acik && kol.izin === 'reddedildi' && (
        <p className="mt-1.5 text-[11px] font-semibold leading-snug text-muted-foreground">
          Bildirimin telefonunda kayıtlı; gönderilmiyor. Ayarlar &rsaquo; Veri'den açabilirsin.
        </p>
      )}

      {bildirildi && acik && (
        <div className="mt-2">
          <p className="text-[11px] font-bold text-muted-foreground">
            Nesi hatalı? (isteğe bağlı)
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {SECILEBILIR_SEBEPLER.map((sebep) => {
              const secili = kayit.sebep === sebep
              return (
                <button
                  key={sebep}
                  type="button"
                  onClick={() => kol.onSebep(kimlik, sebep)}
                  aria-pressed={secili}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[11.5px] font-bold transition active:scale-[0.97]',
                    secili
                      ? 'bg-ikincil text-white'
                      : 'bg-foreground/[0.06] text-muted-foreground active:bg-foreground/12',
                  )}
                >
                  {SEBEP_ADI[sebep]}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
