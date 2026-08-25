'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import type { Ayarlar, OkulYili, PuanTuru } from '@/lib/types'
import { SINIFLAR, SINIF_SECENEKLERI, mezunMu, sinifAdi } from '@/lib/hesap'
import { yeniId } from '@/lib/utils'
import { Alan, Buton, Cip, Etiket, Kart } from '@/components/ui'
import { SaatSecici, SayiTekerlegi } from '@/components/secici'
import { Rabi } from '@/components/maskot/rabi'
import { izinIste } from '@/lib/bildirim'
import { HEDEF_ADIMI, HEDEF_EN_AZ, HEDEF_EN_COK } from '@/lib/depo'

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
 * Liste sabit değil: `notlar` adımı yalnızca mezun seçildiğinde araya giriyor.
 * Okuyan öğrenciye dört yılın notunu sormak anlamsız — yılı bitmemiş bile.
 */
type AdimId = 'sinif' | 'notlar' | 'alan' | 'hedef' | 'hatirlatma'

const ADIM_BILGISI: Record<AdimId, { baslik: string; aciklama: string }> = {
  sinif: {
    baslik: 'Merhaba, ben Rabi',
    aciklama: 'Seninle YKS yolunda çalışacağım. Önce birkaç şey sorayım.',
  },
  notlar: {
    baslik: 'Okul notların',
    aciklama: 'OBP’n sıralama tahminine giriyor. İstersen bu adımı atla.',
  },
  alan: {
    baslik: 'Hangi alandasın?',
    aciklama: 'Sıralama tahmini ve deneme şablonları buna göre ayarlanır.',
  },
  hedef: {
    baslik: 'Bugün kaç soru çözmek istiyorsun?',
    aciklama: 'Günlük hedefini belirle.',
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


export function Kurulum({ onBitir }: { onBitir: (sonuc: KurulumSonucu) => void }) {
  const [adim, setAdim] = useState(0)
  const [sinif, setSinif] = useState(12)
  /** Mezunun yıl sonu notları: sınıf → yazılan metin. Boşlar hesaba girmiyor. */
  const [notlar, setNotlar] = useState<Record<number, string>>({})
  const [obpMetni, setObpMetni] = useState('')
  const [puanTuru, setPuanTuru] = useState<PuanTuru>('ea')
  // Varsayılan 200: çubuğun ortasına yakın, kurulumu hiç ellemeyen için makul.
  const [hedef, setHedef] = useState(200)
  const [saat, setSaat] = useState(20)
  const [dakika, setDakika] = useState(0)
  const [bildirim, setBildirim] = useState(true)

  const mezun = mezunMu(sinif)
  // Sınıf geri dönülüp değiştirilebildiği için liste her çizimde kuruluyor;
  // sıra numarası da listenin boyuna kırpılıyor.
  const adimlar: AdimId[] = [
    'sinif',
    ...(mezun ? (['notlar'] as AdimId[]) : []),
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
      okulYillari: mezun ? okulYillariKur(notlar) : [],
    })
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pt-[calc(2rem+var(--guvenli-ust))] pb-[calc(2rem+var(--guvenli-alt))]">
      <div className="mb-6 flex flex-col items-center text-center">
        <Rabi durum={siradaki === sonAdim ? 'mutlu' : 'normal'} boyut={110} />
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight">
          {ADIM_BILGISI[suanki].baslik}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{ADIM_BILGISI[suanki].aciklama}</p>
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
          </div>
        )}

        {suanki === 'notlar' && (
          <div>
            <Etiket>Yıl sonu notların</Etiket>
            <div className="grid grid-cols-2 gap-2">
              {SINIFLAR.map((s) => (
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

            <Etiket className="mt-4">Ya da OBP’ni biliyorsan</Etiket>
            <Alan
              inputMode="decimal"
              value={obpMetni}
              onChange={(e) => setObpMetni(e.target.value.replace(/[^0-9,.]/g, '').slice(0, 6))}
              placeholder="örn. 412,5"
              aria-label="Elle girilen OBP"
              className="rakam"
            />

            <p className="mt-3 text-xs text-muted-foreground">
              OBP yazarsan notlara gerek yok. İkisini de boş bırakabilirsin.
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
          /*
            Kartta tekerlekten başka hiçbir şey yok: adımın başlığı zaten soruyu
            soruyor, altında da ne işe yaradığı yazıyor. Kartın içinde ayrıca
            bir soru cümlesi, basamak cetveli ve üç satırlık öğüt varken asıl iş
            sayfanın gürültüsü içinde kayboluyordu.
          */
          <SayiTekerlegi
            deger={hedef}
            onDegis={setHedef}
            enAz={HEDEF_EN_AZ}
            enCok={HEDEF_EN_COK}
            adim={HEDEF_ADIMI}
            birim="soru"
            etiket="Günlük soru hedefi"
          />
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
                {/* Sistemin `<input type="time">` seçicisi yerine kendi
                    tekerleğimiz: telefon İngilizceyse orası AM/PM gösteriyor,
                    uygulamanın geri kalanı 24 saatlik "20.00" biçiminde. */}
                <SaatSecici
                  saat={saat}
                  dakika={dakika}
                  onDegis={({ saat: s, dakika: d }) => {
                    setSaat(s)
                    setDakika(d)
                  }}
                  className="mt-1"
                />

                {/* "Şu an seçili" satırı yok: seçilen saat tekerleğin
                    ortasında, vurgulu renkte zaten duruyor. */}
              </div>
            )}

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

/** Girilen yıl notlarını kayda çevirir; boş ve geçersiz olanlar atlanır. */
function okulYillariKur(notlar: Record<number, string>): OkulYili[] {
  return SINIFLAR.flatMap((sinif) => {
    const ham = (notlar[sinif] ?? '').replace(',', '.').trim()
    if (ham === '') return []
    const sayi = Number(ham)
    if (!Number.isFinite(sayi)) return []
    return [
      {
        id: yeniId(),
        sinif,
        ortalama: Math.min(100, Math.max(0, sayi)),
        // Mezunun bütün yılları bitti; hiçbiri dönem sonu notu değil.
        donemSonu: false,
      },
    ]
  })
}
