'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Moon, Smartphone, Sun } from 'lucide-react'
import type { Ayarlar, OkulYili, PuanTuru } from '@/lib/types'
import { SINIFLAR, SINIF_SECENEKLERI, mezunMu, sinifAdi } from '@/lib/hesap'
import { yeniId } from '@/lib/utils'
import { saatDegeri, saatYaz, saatiCoz } from '@/lib/hatirlatma'
import { useTema, type TemaTercihi } from '@/components/theme-provider'
import { Alan, Buton, Cip, Etiket, Kart } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { izinIste } from '@/lib/bildirim'

/** Kurulumun ürettiği ayarlar — geri kalanı varsayılanlardan gelir. */
export type KurulumSecimleri = Pick<
  Ayarlar,
  | 'buYilSinif'
  | 'elleObp'
  | 'puanTuru'
  | 'gunlukHedef'
  | 'hatirlatmaSaati'
  | 'hatirlatmaDakikasi'
  | 'bildirimAcik'
>

/**
 * Kurulumun çıktısı.
 *
 * Ayarların yanında okul yılları da dönüyor: mezuna yıl sonu notları burada
 * soruluyor ve onlar ayar değil, veri. Atlanmışsa liste boş geliyor.
 */
export type KurulumSonucu = {
  ayarlar: KurulumSecimleri
  okulYillari: OkulYili[]
}

/**
 * Adımlar.
 *
 * Liste sabit değil: `notlar` adımı yalnızca **girilecek notu olan** kullanıcıda
 * araya giriyor. Mezunun dört yılı da bitmiştir; okuyan öğrencinin yalnızca
 * kendinden önceki sınıfları bitmiştir, 9. sınıftakinin ise hiçbiri — ona bu
 * adımı göstermek boş bir form göstermek olurdu.
 */
type AdimId = 'sinif' | 'notlar' | 'tema' | 'alan' | 'hedef' | 'hatirlatma'

const ADIM_BILGISI: Record<AdimId, { baslik: string; aciklama: string }> = {
  sinif: {
    baslik: 'Merhaba, ben Rabi',
    aciklama: 'Seninle YKS yolunda çalışacağım. Önce birkaç şey sorayım.',
  },
  notlar: {
    baslik: 'Okul notların',
    aciklama: 'OBP’n sıralama tahminine giriyor. İstersen bu adımı atla.',
  },
  tema: {
    baslik: 'Nasıl görünelim?',
    aciklama: 'Telefonunla aynı mı, hep açık mı, hep koyu mu? İstediğin an değiştirebilirsin.',
  },
  alan: {
    baslik: 'Hangi alandasın?',
    aciklama: 'Sıralama tahmini ve deneme şablonları buna göre ayarlanır.',
  },
  hedef: {
    baslik: 'Günlük hedefin',
    aciklama: 'Her günü buna göre takip edeceğim.',
  },
  hatirlatma: {
    baslik: 'Hatırlatma',
    aciklama: 'Son adım — istersen atlayabilirsin.',
  },
}

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

export function Kurulum({ onBitir }: { onBitir: (sonuc: KurulumSonucu) => void }) {
  const [adim, setAdim] = useState(0)
  const [sinif, setSinif] = useState(12)
  /** Mezunun yıl sonu notları: sınıf → yazılan metin. Boşlar hesaba girmiyor. */
  const [notlar, setNotlar] = useState<Record<number, string>>({})
  const [obpMetni, setObpMetni] = useState('')
  const [puanTuru, setPuanTuru] = useState<PuanTuru>('ea')
  const [hedef, setHedef] = useState(200)
  const [hedefMetni, setHedefMetni] = useState('200')
  const [saat, setSaat] = useState(20)
  const [dakika, setDakika] = useState(0)
  const [bildirim, setBildirim] = useState(true)

  // Tema seçimi anında uygulanıyor (kaydetmeye gerek yok): kullanıcı iki
  // seçeneği de dokunarak görebilsin, sonra devam etsin.
  const { tercih, temaDegistir } = useTema()

  const mezun = mezunMu(sinif)
  /**
   * Notu sorulacak sınıflar: **bitmiş** yıllar.
   *
   * Mezunda dördü de bitmiştir. Okuyan öğrencide yalnızca kendinden küçükler:
   * 11'deki öğrencinin 9 ve 10'u bitti, 11'i sürüyor. Yarım yılın notu OBP'ye
   * girmiyor, sorulması da kafa karıştırırdı.
   */
  const notluSiniflar = mezun ? SINIFLAR : SINIFLAR.filter((s) => s < sinif)
  // Sınıf geri dönülüp değiştirilebildiği için liste her çizimde kuruluyor;
  // sıra numarası da listenin boyuna kırpılıyor.
  const adimlar: AdimId[] = [
    'sinif',
    ...(notluSiniflar.length > 0 ? (['notlar'] as AdimId[]) : []),
    'tema',
    'alan',
    'hedef',
    'hatirlatma',
  ]
  const sonAdim = adimlar.length - 1
  const siradaki = Math.min(adim, sonAdim)
  const suanki = adimlar[siradaki]

  const ilerle = () => setAdim(Math.min(sonAdim, siradaki + 1))
  const geri = () => setAdim(Math.max(0, siradaki - 1))

  /** Notları ve OBP'yi boşaltıp geçer — "şimdilik atla" düğmesi. */
  const notlariAtla = () => {
    setNotlar({})
    setObpMetni('')
    ilerle()
  }

  const bitir = async () => {
    // Android 13+ izni burada isteniyor: kullanıcı hatırlatmayı açtıktan hemen
    // sonra, ne için sorulduğu belliyken. Reddederse kurulum yine tamamlanır,
    // yalnızca hatırlatma kapalı kaydedilir — Ayarlar'dan tekrar denenebilir.
    const izinli = bildirim ? await izinIste() : false
    const obp = Number(obpMetni.replace(',', '.'))
    onBitir({
      ayarlar: {
        buYilSinif: sinif,
        // Mezun değilse elle OBP hiç sorulmuyor; yazılmış bir sayı kalmışsa da
        // (sınıf sonradan değiştirildiyse) geçersiz sayılıyor.
        elleObp: mezun && obpMetni.trim() !== '' && Number.isFinite(obp) ? obp : null,
        puanTuru,
        gunlukHedef: hedef,
        hatirlatmaSaati: saat,
        hatirlatmaDakikasi: dakika,
        bildirimAcik: izinli,
      },
      // Sınıf geri dönülüp değiştirilmiş olabilir: 12'yken girilen 11. sınıf
      // notu, sonradan 10 seçildiğinde artık bitmemiş bir yılın notu olur.
      // O yüzden kayda yalnızca güncel sınıfa göre bitmiş yıllar giriyor.
      okulYillari: okulYillariKur(notlar, notluSiniflar),
    })
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pt-[calc(2rem+var(--guvenli-ust))] pb-[calc(2rem+var(--guvenli-alt))]">
      <div className="mb-6 flex flex-col items-center text-center">
        <Rabi durum={siradaki === sonAdim ? 'mutlu' : 'normal'} boyut={110} />
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight">
          {ADIM_BILGISI[suanki].baslik}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {suanki === 'notlar' && !mezun
            ? 'Biten yılların notu OBP tahminine giriyor. İstersen bu adımı atla.'
            : ADIM_BILGISI[suanki].aciklama}
        </p>
      </div>

      <Kart>
        {suanki === 'sinif' && (
          <div>
            <Etiket>Bu yıl kaçıncı sınıftasın?</Etiket>
            <div className="flex flex-wrap gap-2">
              {SINIF_SECENEKLERI.map((s) => (
                <Cip key={s} secili={sinif === s} onClick={() => setSinif(s)}>
                  {sinifAdi(s)}
                </Cip>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {mezun
                ? 'Mezunsan sınıf ilerlemez. Sıradaki adımda yıl sonu notlarını sorayım — istersen atlarsın.'
                : notluSiniflar.length > 0
                  ? `Her eylülde bir üst sınıfa kendiliğinden geçersin. Sıradaki adımda biten ${notluSiniflar.length === 1 ? 'yılının' : 'yıllarının'} notunu sorayım — istersen atlarsın.`
                  : 'Her eylülde bir üst sınıfa kendiliğinden geçersin; tekrar sormam gerekmez.'}
            </p>
          </div>
        )}

        {suanki === 'notlar' && (
          <div>
            <Etiket>Yıl sonu notların</Etiket>
            <div className="grid grid-cols-2 gap-2">
              {notluSiniflar.map((s) => (
                <label key={s} className="flex items-center gap-2 rounded-xl border border-border p-2.5">
                  <span className="flex-1 text-sm font-medium">{s}. sınıf</span>
                  <Alan
                    inputMode="decimal"
                    value={notlar[s] ?? ''}
                    onChange={(e) =>
                      setNotlar((onceki) => ({
                        ...onceki,
                        [s]: e.target.value.replace(/[^0-9,.]/g, '').slice(0, 6),
                      }))
                    }
                    placeholder="—"
                    aria-label={`${s}. sınıf yıl sonu notu`}
                    className="rakam h-9 w-16 text-center font-semibold"
                  />
                </label>
              ))}
            </div>

            {/* OBP kutusu yalnızca mezunda.

                OBP diploma notunun beş katı ve ancak **bütün** yıllar bitince
                oluşuyor; okuyan öğrencinin bilebileceği bir sayı değil. Kutuyu
                herkese göstermek, henüz var olmayan bir sayıyı soruyor olurdu. */}
            {mezun && (
              <>
                <Etiket className="mt-4">Ya da OBP’ni biliyorsan</Etiket>
                <Alan
                  inputMode="decimal"
                  value={obpMetni}
                  onChange={(e) =>
                    setObpMetni(e.target.value.replace(/[^0-9,.]/g, '').slice(0, 6))
                  }
                  placeholder="örn. 412,5"
                  aria-label="Elle girilen OBP"
                  className="rakam"
                />
              </>
            )}

            <p className="mt-3 text-xs text-muted-foreground">
              {mezun
                ? 'OBP yazarsan notlara hiç gerek yok — doğrudan o kullanılır. İkisini de boş bırakabilirsin; sonradan Okul Notları ekranından girersin.'
                : 'Boş bırakabilirsin; sonradan Okul Notları ekranından girersin. Yıllar tamamlanmadığı için buradan çıkan OBP bir tahmindir.'}
            </p>
          </div>
        )}

        {suanki === 'tema' && (
          <div className="space-y-2">
            {TEMALAR.map((secenek) => (
              <button
                key={secenek.id}
                type="button"
                onClick={() => temaDegistir(secenek.id)}
                aria-pressed={tercih === secenek.id}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  tercih === secenek.id
                    ? 'border-primary bg-primary-soft'
                    : 'border-border active:bg-muted'
                }`}
              >
                <secenek.Simge size={20} className="shrink-0 text-primary" aria-hidden />
                <span className="flex-1">
                  <span className="block font-medium">{secenek.ad}</span>
                  <span className="block text-xs text-muted-foreground">{secenek.aciklama}</span>
                </span>
                {tercih === secenek.id && <Check size={18} className="shrink-0 text-primary" />}
              </button>
            ))}
            <p className="pt-1 text-xs text-muted-foreground">
              Dokunmazsan telefonunun temasını izlemeye devam ederim: gece moduna geçince Rabi
              de kararır. Dokunduğun anda değişiyor; sonradan Ayarlar'dan da değiştirebilirsin.
            </p>
          </div>
        )}

        {suanki === 'alan' && (
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

        {suanki === 'hedef' && (
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

        {suanki === 'hatirlatma' && (
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
        {siradaki > 0 && (
          <Buton bicim="ikincil" boy="simge" onClick={geri} aria-label="Geri">
            <ArrowLeft size={18} aria-hidden />
          </Buton>
        )}
        {/* Notlar adımı atlanabilir olmalı: dört yılın notunu hatırlamayan
            kullanıcı kurulumda takılıp kalmasın. */}
        {suanki === 'notlar' && (
          <Buton bicim="ikincil" onClick={notlariAtla}>
            Şimdilik atla
          </Buton>
        )}
        <Buton className="flex-1" onClick={() => (siradaki === sonAdim ? void bitir() : ilerle())}>
          {siradaki === sonAdim ? 'Başlayalım' : 'Devam'}
          {siradaki === sonAdim ? (
            <Check size={18} aria-hidden />
          ) : (
            <ArrowRight size={18} aria-hidden />
          )}
        </Buton>
      </div>

      {/* Adım göstergesi */}
      <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
        {adimlar.map((id, i) => (
          <span
            key={id}
            className={`h-1.5 rounded-full transition-all ${
              i === siradaki ? 'w-5 bg-primary' : 'w-1.5 bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

const TEMALAR: { id: TemaTercihi; ad: string; aciklama: string; Simge: typeof Sun }[] = [
  {
    id: 'sistem',
    ad: 'Cihazımla aynı',
    aciklama: 'Telefonun gece moduna göre kendiliğinden değişir',
    Simge: Smartphone,
  },
  { id: 'acik', ad: 'Açık tema', aciklama: 'Gündüz ve aydınlık odalarda okunaklı', Simge: Sun },
  { id: 'koyu', ad: 'Koyu tema', aciklama: 'Gece çalışırken gözü yormaz', Simge: Moon },
]

/**
 * Girilen yıl notlarını kayda çevirir; boş ve geçersiz olanlar atlanır.
 *
 * `siniflar` yalnızca bitmiş yılları taşıyor — hangi yılların sorulduğunu
 * belirleyen liste ile kayda geçen liste aynı olmak zorunda, yoksa ekranda
 * görünmeyen bir sınıfın eski notu sessizce kaydedilirdi.
 */
function okulYillariKur(notlar: Record<number, string>, siniflar: number[]): OkulYili[] {
  return siniflar.flatMap((sinif) => {
    const ham = (notlar[sinif] ?? '').replace(',', '.').trim()
    if (ham === '') return []
    const sayi = Number(ham)
    if (!Number.isFinite(sayi)) return []
    return [
      {
        id: yeniId(),
        sinif,
        ortalama: Math.min(100, Math.max(0, sayi)),
        // Buraya yalnızca bitmiş yıllar geliyor; hiçbiri dönem sonu notu değil.
        donemSonu: false,
      },
    ]
  })
}
