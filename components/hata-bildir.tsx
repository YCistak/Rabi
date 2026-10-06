'use client'

/**
 * "Bu soru hatalı" düğmesi ve açtığı bildirim sayfası.
 *
 * İki yerde kullanılıyor: tur sonundaki yanlış kartları ve Oyun Bankası
 * kayıtları. İkisi de süresiz ekranlar — tur **içinde** bildirim yok, çünkü
 * orada süre işliyor ve geri bildirim şeridi yalnızca bir saniye duruyor;
 * yanlış dokunuş puana mal olurdu.
 *
 * **Sebep zorunlu.** Önce tek dokunuşla sebepsiz kaydediliyordu; gelen
 * bildirimlerin çoğu "belirtilmedi" ile geliyordu ve o kayıt "biri bu soruya
 * kızmış" demekten başka bir şey söylemiyordu. "Başka" seçilirse kısa bir not
 * da zorunlu: "Başka" tek başına aynı boşluğu bırakıyordu.
 *
 * Akış bir süre kartın içinde açılan küçük çiplerdi: on bir piksellik yazı,
 * çipe dokunur dokunmaz kaydedilen bildirim, kayıttan **sonra** beliren izin
 * kartı ve "Başka" için yazacak hiçbir yer. Kullanıcı deneyimi zayıf bulundu;
 * şimdi bayrak alttan bir sayfa açıyor: soru, büyük seçenek satırları, gerekirse
 * not, izin metni ve tek bir Gönder düğmesi. Bildirim ancak Gönder'e basınca
 * kaydediliyor.
 *
 * **İlk** bildirimde izin sayfanın içinde soruluyor: ne gönderileceği tek tek
 * yazılı ve düğme "İzin ver ve gönder". Google Play'in kullanıcı verisi
 * politikası veri cihazdan çıkmadan önce belirgin açıklama ve kullanıcının
 * olumlu bir eylemini istiyor. "Gönderme" diyen kullanıcının bildirimi
 * telefonda kalıyor; kararı aynı sayfadaki "Gönderilsin" ile geri alabiliyor.
 *
 * Sayfa `document.body`'ye taşınarak çiziliyor: tur sonu kartları
 * `clip-path`li bir tam ekran katmanın içinde ve sabit konumlu bir katman
 * orada kırpılırdı (AGENTS.md, "Ekranlar ve katmanlar bağlanarak geliyor").
 */

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CircleCheck,
  CircleX,
  Flag,
  MessageSquareText,
  SpellCheck,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react'
import {
  BASKA_NOTU_SINIRI,
  SECILEBILIR_SEBEPLER,
  SEBEP_ADI,
  notuKirp,
  type HataBildirimi,
  type HataSebebi,
} from '@/lib/hata-bildirimi'
import type { BildirimIzni } from '@/lib/hata-kuyrugu'
import type { BankaSorusu } from '@/lib/oyunlar/banka'
import { bankaCevabiMetni, bankaKimligi, bankaSorusuMetni } from '@/lib/oyunlar/banka'
import { useGeriKatmani } from '@/lib/geri'
import { useAsagiKaydirKapat } from '@/lib/asagi-kaydir'
import { useKapatmaOnayi } from '@/components/ui'
import { cn } from '@/lib/utils'

/** Bildirim özelliğinin ekranlara inen kolu; AppShell'den prop olarak geçiyor. */
export interface BildirimKolu {
  bildirimler: HataBildirimi[]
  /** Günlük sınır dolduysa yeni bildirim kaydedilmiyor. */
  sinirda: boolean
  /** Gönderim izni; `'verildi'` olmadan hiçbir bildirim ağa çıkmıyor. */
  izin: BildirimIzni
  /** Sebep zorunlu: sebepsiz bildirim kaydedilmiyor. Not yalnızca "Başka"da. */
  onBildir: (soru: BankaSorusu, sebep: HataSebebi, not?: string) => void
  onSebep: (kimlik: string, sebep: HataSebebi, not?: string) => void
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
  'sorunun kendisi ve havuzdaki kimliği',
  'hangi oyundan geldiği',
  'uygulamanın doğru saydığı cevap',
  'seçtiğin sebep ve "Başka" dediysen yazdığın kısa not',
  'uygulama sürümü',
  'telefonunun modeli ve ada bağlı olmayan bir cihaz adı',
]

/** Seçenek satırlarının simgesi ve alt yazısı. */
const SEBEP_BILGISI: Record<HataSebebi, { simge: LucideIcon; ipucu: string }> = {
  'cevap-yanlis': { simge: CircleX, ipucu: 'Doğru cevap başka' },
  anlasilmiyor: { simge: TriangleAlert, ipucu: 'Soru ya da şıklar belirsiz' },
  yazim: { simge: SpellCheck, ipucu: 'Harf, imla ya da noktalama' },
  baska: { simge: MessageSquareText, ipucu: 'Kısaca kendin yaz' },
  belirtilmedi: { simge: Flag, ipucu: '' },
}

export function BildirimDugmesi({ soru, kol }: { soru: BankaSorusu; kol: BildirimKolu }) {
  const kimlik = bankaKimligi(soru)
  const kayit = kol.bildirimler.find((b) => b.kimlik === kimlik)
  const bildirildi = kayit !== undefined
  const [acik, setAcik] = useState(false)
  const [reddedildi, setReddedildi] = useState(false)

  const bas = () => {
    // Sınır dolmuşsa sayfayı hiç açma: seçmenin bir sonucu olmayacak.
    if (!bildirildi && kol.sinirda) {
      setReddedildi(true)
      return
    }
    setAcik(true)
  }

  return (
    <div className="mt-2 border-t border-border pt-2">
      <button
        type="button"
        onClick={bas}
        aria-pressed={bildirildi}
        aria-haspopup="dialog"
        className={cn(
          'flex min-h-9 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-extrabold transition active:scale-[0.97]',
          bildirildi
            ? 'bg-ikincil-soft text-ikincil'
            : 'bg-foreground/[0.06] text-muted-foreground active:bg-foreground/12',
        )}
      >
        <Flag size={14} className="shrink-0" fill={bildirildi ? 'currentColor' : 'none'} aria-hidden />
        {bildirildi ? `Bildirildi · ${SEBEP_ADI[kayit.sebep]}` : 'Bu soru hatalı'}
      </button>

      {reddedildi && !bildirildi && (
        <p className="mt-1.5 text-[12px] font-semibold leading-snug text-muted-foreground">
          Bugünlük bildirim sınırına ulaştın. Yarın yeniden bildirebilirsin.
        </p>
      )}

      {acik && <BildirimSayfasi soru={soru} kol={kol} kayit={kayit} onKapat={() => setAcik(false)} />}
    </div>
  )
}

function BildirimSayfasi({
  soru,
  kol,
  kayit,
  onKapat,
}: {
  soru: BankaSorusu
  kol: BildirimKolu
  kayit: HataBildirimi | undefined
  onKapat: () => void
}) {
  useGeriKatmani(true, onKapat)
  const kaydir = useAsagiKaydirKapat(onKapat)
  // Portal yalnızca istemcide: sunucuda üretilen HTML'de `document` yok.
  const [hazir, setHazir] = useState(false)
  useEffect(() => setHazir(true), [])

  const [sebep, setSebep] = useState<HataSebebi | null>(
    kayit && kayit.sebep !== 'belirtilmedi' ? kayit.sebep : null,
  )
  const [not, setNot] = useState(kayit?.not ?? '')
  const [bitti, setBitti] = useState(false)
  const kapatmaOnayi = useKapatmaOnayi({ aciklama: 'Bildirim gönderilmeden pencere kapanır.' })

  const notEksik = sebep === 'baska' && notuKirp(not) === undefined
  const gonderilebilir = sebep !== null && !notEksik
  const izinSorulacak = kol.izin === 'sorulmadi'

  const kaydet = (izin: BildirimIzni | null) => {
    if (sebep === null || notEksik) return
    const temizNot = sebep === 'baska' ? notuKirp(not) : undefined
    if (kayit) kol.onSebep(kayit.kimlik, sebep, temizNot)
    else kol.onBildir(soru, sebep, temizNot)
    if (izin) kol.onIzin(izin)
    setBitti(true)
  }

  if (!hazir) return null
  return createPortal(
    <div
      className="katman-zemin fixed inset-0 z-[70] flex items-end justify-center bg-black/40"
      onClick={onKapat}
    >
      {kapatmaOnayi.pencere}
      <div
        ref={kaydir}
        role="dialog"
        aria-modal
        aria-labelledby="hata-bildir-baslik"
        className="alt-pencere-girisi max-h-[90%] w-full max-w-md overflow-y-auto rounded-t-[26px] bg-card px-[18px] pt-2 pb-[calc(1.25rem+var(--guvenli-alt))]"
        onClick={(olay) => olay.stopPropagation()}
      >
        <div className="flex justify-center pt-1.5 pb-3">
          <span className="h-[5px] w-[42px] rounded-[3px] bg-border" />
        </div>

        {bitti ? (
          <Tesekkur gonderilecek={kol.izin === 'verildi'} onKapat={onKapat} />
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2.5">
              <p id="hata-bildir-baslik" className="font-display text-lg font-extrabold tracking-tight">
                Bu soruda ne yanlış?
              </p>
              <button
                type="button"
                onClick={() => kapatmaOnayi.sor(onKapat)}
                aria-label="Kapat"
                className="ml-auto grid size-9 shrink-0 place-items-center rounded-xl bg-muted/70 text-muted-foreground transition active:brightness-95"
              >
                <X size={16} strokeWidth={2.4} aria-hidden />
              </button>
            </div>

            {/* Hangi sorunun bildirildiği sayfada da görünsün: kart altta,
                sayfanın arkasında kalıyor. */}
            <div className="rounded-2xl bg-muted/60 px-3.5 py-3">
              <p className="line-clamp-3 text-[14px] font-bold leading-snug">{bankaSorusuMetni(soru)}</p>
              <p className="mt-1.5 text-[12.5px] font-semibold text-muted-foreground">
                Uygulamanın cevabı:{' '}
                <span className="font-extrabold text-foreground">{bankaCevabiMetni(soru)}</span>
              </p>
            </div>

            <div className="mt-3 flex flex-col gap-2" role="radiogroup" aria-label="Sebep">
              {SECILEBILIR_SEBEPLER.map((s) => {
                const { simge: Simge, ipucu } = SEBEP_BILGISI[s]
                const secili = sebep === s
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={secili}
                    onClick={() => setSebep(s)}
                    className={cn(
                      'flex min-h-[58px] items-center gap-3 rounded-2xl border-[1.5px] px-3.5 text-left transition active:scale-[0.99]',
                      secili ? 'border-ikincil bg-ikincil-soft' : 'border-border bg-card active:bg-muted',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-9 shrink-0 place-items-center rounded-xl',
                        secili ? 'bg-ikincil text-white' : 'bg-muted text-muted-foreground',
                      )}
                    >
                      <Simge size={18} strokeWidth={2.2} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-extrabold">{SEBEP_ADI[s]}</span>
                      <span className="block text-[12.5px] font-semibold text-muted-foreground">{ipucu}</span>
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        'grid size-5 shrink-0 place-items-center rounded-full border-2',
                        secili ? 'border-ikincil bg-ikincil' : 'border-border',
                      )}
                    >
                      {secili && <span className="size-2 rounded-full bg-white" />}
                    </span>
                  </button>
                )
              })}
            </div>

            {sebep === 'baska' && (
              <div className="acilir-giris mt-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="hata-bildir-not"
                    className="text-[11.5px] font-extrabold uppercase tracking-[0.05em] text-muted-foreground"
                  >
                    Ne yanlış?
                  </label>
                  <span className="rakam text-xs font-extrabold text-muted-foreground/70">
                    {not.trim().length}/{BASKA_NOTU_SINIRI}
                  </span>
                </div>
                <input
                  id="hata-bildir-not"
                  value={not}
                  onChange={(olay) => setNot(olay.target.value.slice(0, BASKA_NOTU_SINIRI))}
                  maxLength={BASKA_NOTU_SINIRI}
                  autoFocus
                  enterKeyHint="done"
                  placeholder="Örn. iki şık aynı"
                  className="h-12 w-full rounded-[14px] border border-input bg-background px-3.5 text-[15px] font-bold outline-none transition placeholder:font-semibold placeholder:text-muted-foreground/70 focus-visible:border-ikincil focus-visible:bg-card"
                />
              </div>
            )}

            {izinSorulacak && (
              <div className="mt-3 rounded-2xl bg-foreground/[0.04] px-3.5 py-3 text-[12.5px] font-medium leading-snug text-muted-foreground">
                <p className="font-extrabold text-foreground">Bildirim bize gönderilir</p>
                <p className="mt-1">Soruyu düzeltebilmemiz için şunlar telefonundan çıkar:</p>
                <ul className="mt-1 list-disc pl-4">
                  {GONDERILENLER.map((alan) => (
                    <li key={alan}>{alan}</li>
                  ))}
                </ul>
                <p className="mt-1.5">
                  Adın, netlerin, notların ve fotoğrafların <b>gönderilmez</b>. İzin verirsen
                  <b> sonraki bildirimlerin de</b> aynı şekilde gönderilir.
                </p>
              </div>
            )}

            {kol.izin === 'reddedildi' && (
              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-foreground/[0.04] px-3.5 py-3">
                <p className="min-w-0 flex-1 text-[12.5px] font-semibold leading-snug text-muted-foreground">
                  Bildirimlerin gönderilmiyor, telefonunda kalıyor.
                </p>
                {/* Kararın geri alınabildiği tek yer burası: Ayarlar'daki izin
                    bölümü kalktı. Bekleyen bildirimler silinmediği için
                    basıldığı anda gidiyorlar. */}
                <button
                  type="button"
                  onClick={() => kol.onIzin('verildi')}
                  className="shrink-0 rounded-full bg-foreground/[0.08] px-3 py-1.5 text-[12px] font-extrabold text-foreground transition active:scale-[0.97]"
                >
                  Gönderilsin
                </button>
              </div>
            )}

            {/* Eksikte düğme soluk; neyin eksik olduğu üstünde yazıyor. */}
            <p className="mt-3 min-h-4 text-center text-[12px] font-bold text-muted-foreground">
              {sebep === null ? 'Bir sebep seç' : notEksik ? 'Ne yanlış olduğunu kısaca yaz' : ''}
            </p>
            <button
              type="button"
              onClick={() => kaydet(izinSorulacak ? 'verildi' : null)}
              disabled={!gonderilebilir}
              className="mt-1.5 h-[54px] w-full rounded-[17px] bg-ikincil text-base font-extrabold text-white transition active:scale-[0.99] disabled:opacity-40"
            >
              {izinSorulacak ? 'İzin ver ve gönder' : kayit ? 'Güncelle' : 'Gönder'}
            </button>
            {izinSorulacak && (
              <button
                type="button"
                onClick={() => kaydet('reddedildi')}
                disabled={!gonderilebilir}
                className="mt-1 w-full py-2.5 text-[13.5px] font-extrabold text-muted-foreground transition active:opacity-70 disabled:opacity-40"
              >
                Gönderme, telefonumda kalsın
              </button>
            )}
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

/** Gönderimden sonra sayfanın kendisi teşekkür ediyor; kapatma kullanıcıda. */
function Tesekkur({ gonderilecek, onKapat }: { gonderilecek: boolean; onKapat: () => void }) {
  return (
    <div className="flex flex-col items-center px-2 pt-2 pb-1 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-success-soft text-success">
        <CircleCheck size={30} strokeWidth={2.2} aria-hidden />
      </span>
      <p className="mt-3 font-display text-xl font-extrabold tracking-tight">Teşekkürler!</p>
      <p className="mt-1 text-[14px] font-semibold leading-snug text-muted-foreground">
        {gonderilecek
          ? 'Bildirimin bize ulaşacak, soruya bakacağız.'
          : 'Bildirimin telefonunda kayıtlı.'}
      </p>
      <button
        type="button"
        onClick={onKapat}
        className="mt-5 h-[52px] w-full rounded-[17px] bg-foreground/[0.07] text-base font-extrabold transition active:scale-[0.99]"
      >
        Tamam
      </button>
    </div>
  )
}
