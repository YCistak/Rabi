'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Moon, Sun } from 'lucide-react'
import type { Ayarlar, PuanTuru } from '@/lib/types'
import { SINIFLAR } from '@/lib/hesap'
import { saatDegeri, saatYaz, saatiCoz } from '@/lib/hatirlatma'
import { useTema, type Tema } from '@/components/theme-provider'
import { Alan, Buton, Cip, Etiket, Kart } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { izinIste } from '@/lib/bildirim'

/** Kurulumun ürettiği ayarlar — geri kalanı varsayılanlardan gelir. */
export type KurulumSecimleri = Pick<
  Ayarlar,
  | 'buYilSinif'
  | 'puanTuru'
  | 'gunlukHedef'
  | 'hatirlatmaSaati'
  | 'hatirlatmaDakikasi'
  | 'bildirimAcik'
>

const PUAN_TURLERI: { id: PuanTuru; ad: string; aciklama: string }[] = [
  { id: 'say', ad: 'Sayısal', aciklama: 'Matematik · Fizik · Kimya · Biyoloji' },
  { id: 'ea', ad: 'Eşit Ağırlık', aciklama: 'Matematik · Edebiyat · Tarih · Coğrafya' },
  { id: 'soz', ad: 'Sözel', aciklama: 'Edebiyat · Sosyal Bilimler' },
  { id: 'dil', ad: 'Dil', aciklama: 'Yabancı Dil Testi (YDT)' },
]

const HAZIR_HEDEFLER = [100, 200, 300, 400, 500]

/**
 * Hatırlatma için hızlı seçim saatleri — Ayarlar ekranındakilerle **aynı**.
 * Burada beş saatlik kısa bir liste vardı; kurulumda 08.00'i seçmek isteyen
 * kullanıcı önce kurulumu bitirip sonra Ayarlar'a girmek zorunda kalıyordu.
 * Yanındaki saat kutusu, listede olmayan her saati ve dakikayı kabul ediyor.
 */
const HATIRLATMA_SAATLERI = [8, 12, 16, 18, 19, 20, 21, 22, 23]

export function Kurulum({ onBitir }: { onBitir: (secimler: KurulumSecimleri) => void }) {
  const [adim, setAdim] = useState(0)
  const [sinif, setSinif] = useState(12)
  const [puanTuru, setPuanTuru] = useState<PuanTuru>('ea')
  const [hedef, setHedef] = useState(200)
  const [hedefMetni, setHedefMetni] = useState('200')
  const [saat, setSaat] = useState(20)
  const [dakika, setDakika] = useState(0)
  const [bildirim, setBildirim] = useState(true)

  // Tema seçimi anında uygulanıyor (kaydetmeye gerek yok): kullanıcı iki
  // seçeneği de dokunarak görebilsin, sonra devam etsin.
  const { tema, temaDegistir } = useTema()

  const sonAdim = 4
  const ilerle = () => setAdim((a) => Math.min(sonAdim, a + 1))
  const geri = () => setAdim((a) => Math.max(0, a - 1))

  const bitir = async () => {
    // Android 13+ izni burada isteniyor: kullanıcı hatırlatmayı açtıktan hemen
    // sonra, ne için sorulduğu belliyken. Reddederse kurulum yine tamamlanır,
    // yalnızca hatırlatma kapalı kaydedilir — Ayarlar'dan tekrar denenebilir.
    const izinli = bildirim ? await izinIste() : false
    // Tema adımına hiç dokunulmadıysa ekranda gösterilen (telefonun tercihi)
    // seçenek kaydedilir. Yazılmasaydı uygulama sistem temasını izlemeye devam
    // eder, kullanıcı gece telefonu koyuya alınca Rabi de habersiz kararırdı.
    temaDegistir(tema)
    onBitir({
      buYilSinif: sinif,
      puanTuru,
      gunlukHedef: hedef,
      hatirlatmaSaati: saat,
      hatirlatmaDakikasi: dakika,
      bildirimAcik: izinli,
    })
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pt-[calc(2rem+var(--guvenli-ust))] pb-[calc(2rem+var(--guvenli-alt))]">
      <div className="mb-6 flex flex-col items-center text-center">
        <Rabi durum={adim === sonAdim ? 'mutlu' : 'normal'} boyut={110} />
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight">
          {adim === 0 ? 'Merhaba, ben Rabi' : BASLIKLAR[adim]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{ACIKLAMALAR[adim]}</p>
      </div>

      <Kart>
        {adim === 0 && (
          <div>
            <Etiket>Bu yıl kaçıncı sınıftasın?</Etiket>
            <div className="flex flex-wrap gap-2">
              {SINIFLAR.map((s) => (
                <Cip key={s} secili={sinif === s} onClick={() => setSinif(s)}>
                  {s}. sınıf
                </Cip>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Her eylülde bir üst sınıfa kendiliğinden geçersin; tekrar sormam gerekmez.
            </p>
          </div>
        )}

        {adim === 1 && (
          <div className="space-y-2">
            {TEMALAR.map((secenek) => (
              <button
                key={secenek.id}
                type="button"
                onClick={() => temaDegistir(secenek.id)}
                aria-pressed={tema === secenek.id}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  tema === secenek.id
                    ? 'border-primary bg-primary-soft'
                    : 'border-border active:bg-muted'
                }`}
              >
                <secenek.Simge size={20} className="shrink-0 text-primary" aria-hidden />
                <span className="flex-1">
                  <span className="block font-medium">{secenek.ad}</span>
                  <span className="block text-xs text-muted-foreground">{secenek.aciklama}</span>
                </span>
                {tema === secenek.id && <Check size={18} className="shrink-0 text-primary" />}
              </button>
            ))}
            <p className="pt-1 text-xs text-muted-foreground">
              Şu an telefonunun tercihi seçili. Dokunduğun anda değişiyor; beğenmezsen diğerine
              dön. Sonradan Ayarlar'dan da değiştirebilirsin.
            </p>
          </div>
        )}

        {adim === 2 && (
          <div className="space-y-2">
            {PUAN_TURLERI.map((tur) => (
              <button
                key={tur.id}
                type="button"
                onClick={() => setPuanTuru(tur.id)}
                aria-pressed={puanTuru === tur.id}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${
                  puanTuru === tur.id
                    ? 'border-primary bg-primary-soft'
                    : 'border-border active:bg-muted'
                }`}
              >
                <span>
                  <span className="block font-medium">{tur.ad}</span>
                  <span className="block text-xs text-muted-foreground">{tur.aciklama}</span>
                </span>
                {puanTuru === tur.id && <Check size={18} className="shrink-0 text-primary" />}
              </button>
            ))}
          </div>
        )}

        {adim === 3 && (
          <div>
            <Etiket>Günde kaç soru çözmeyi hedefliyorsun?</Etiket>
            <div className="flex flex-wrap gap-2">
              {HAZIR_HEDEFLER.map((h) => (
                <Cip
                  key={h}
                  secili={hedef === h}
                  onClick={() => {
                    setHedef(h)
                    setHedefMetni(String(h))
                  }}
                >
                  {h}
                </Cip>
              ))}
            </div>

            <Etiket className="mt-4">Ya da kendin yaz</Etiket>
            <Alan
              type="number"
              inputMode="numeric"
              value={hedefMetni}
              onChange={(e) => {
                const temiz = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                setHedefMetni(temiz)
                const sayi = Number(temiz)
                if (sayi > 0) setHedef(sayi)
              }}
              placeholder="örn. 250"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Tutturamayacağın bir sayı seçme — küçük başlayıp yükseltmek, büyük başlayıp
              her gün başarısız olmaktan iyi. Sonradan Ayarlar'dan değiştirebilirsin.
            </p>
          </div>
        )}

        {adim === 4 && (
          <div>
            <button
              type="button"
              onClick={() => setBildirim((b) => !b)}
              aria-pressed={bildirim}
              className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${
                bildirim ? 'border-primary bg-primary-soft' : 'border-border active:bg-muted'
              }`}
            >
              <span>
                <span className="block font-medium">Günlük hatırlatma</span>
                <span className="block text-xs text-muted-foreground">
                  Soru girmediğin günlerde tek bir hatırlatma
                </span>
              </span>
              {bildirim && <Check size={18} className="shrink-0 text-primary" />}
            </button>

            {bildirim && (
              <div className="mt-4">
                <Etiket>Saat kaçta hatırlatayım?</Etiket>
                <div className="flex flex-wrap gap-2">
                  {HATIRLATMA_SAATLERI.map((h) => (
                    <Cip
                      key={h}
                      secili={saat === h && dakika === 0}
                      onClick={() => {
                        setSaat(h)
                        setDakika(0)
                      }}
                    >
                      {saatYaz(h, 0)}
                    </Cip>
                  ))}
                </div>

                {/* Çipler tam saatler; "21.30" gibi bir saat ancak buradan
                    girilebiliyor. Telefonun kendi saat seçicisi açıldığı için
                    elle rakam yazmak gerekmiyor. */}
                <div className="mt-3 flex items-center gap-2">
                  <Etiket className="mb-0 shrink-0">Başka saat</Etiket>
                  <Alan
                    type="time"
                    value={saatDegeri(saat, dakika)}
                    onChange={(e) => {
                      const cozulen = saatiCoz(e.target.value)
                      if (!cozulen) return
                      setSaat(cozulen.saat)
                      setDakika(cozulen.dakika)
                    }}
                    aria-label="Hatırlatma saati"
                    className="rakam h-10 w-32"
                  />
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Şu an seçili:{' '}
                  <strong className="rakam text-foreground">{saatYaz(saat, dakika)}</strong>
                </p>
              </div>
            )}

            <p className="mt-4 text-xs text-muted-foreground">
              Günde en fazla bir bildirim gönderiyorum. O gün soru girdiysen hiç göndermem.
            </p>
          </div>
        )}
      </Kart>

      {/* Düğmeler adımdan adıma zıplamasın diye alta itilir */}
      <div className="flex-1" aria-hidden />

      <div className="mt-5 flex items-center gap-2">
        {adim > 0 && (
          <Buton bicim="ikincil" boy="simge" onClick={geri} aria-label="Geri">
            <ArrowLeft size={18} aria-hidden />
          </Buton>
        )}
        <Buton className="flex-1" onClick={() => (adim === sonAdim ? void bitir() : ilerle())}>
          {adim === sonAdim ? 'Başlayalım' : 'Devam'}
          {adim === sonAdim ? (
            <Check size={18} aria-hidden />
          ) : (
            <ArrowRight size={18} aria-hidden />
          )}
        </Buton>
      </div>

      {/* Adım göstergesi */}
      <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
        {Array.from({ length: sonAdim + 1 }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === adim ? 'w-5 bg-primary' : 'w-1.5 bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

const TEMALAR: { id: Tema; ad: string; aciklama: string; Simge: typeof Sun }[] = [
  { id: 'acik', ad: 'Açık tema', aciklama: 'Gündüz ve aydınlık odalarda okunaklı', Simge: Sun },
  { id: 'koyu', ad: 'Koyu tema', aciklama: 'Gece çalışırken gözü yormaz', Simge: Moon },
]

const BASLIKLAR = [
  'Merhaba, ben Rabi',
  'Nasıl görünelim?',
  'Hangi alandasın?',
  'Günlük hedefin',
  'Hatırlatma',
]

const ACIKLAMALAR = [
  'Seninle YKS yolunda çalışacağım. Önce birkaç şey sorayım.',
  'Açık mı koyu mu? İstediğin an değiştirebilirsin.',
  'Sıralama tahmini ve deneme şablonları buna göre ayarlanır.',
  'Her günü buna göre takip edeceğim.',
  'Son adım — istersen atlayabilirsin.',
]
