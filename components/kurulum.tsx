'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, User } from 'lucide-react'
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
  | 'ad'
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
type AdimId = 'isim' | 'sinif' | 'notlar' | 'alan' | 'hedef' | 'hatirlatma'

const ADIM_BILGISI: Record<AdimId, { baslik: string; aciklama: string }> = {
  isim: {
    baslik: 'Sana nasıl sesleneyim?',
    aciklama: 'Böylece seni adınla selamlayabilirim.',
  },
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

const PUAN_TURLERI: { id: PuanTuru; ad: string }[] = [
  { id: 'say', ad: 'Sayısal' },
  { id: 'ea', ad: 'Eşit Ağırlık' },
  { id: 'soz', ad: 'Sözel' },
  { id: 'dil', ad: 'Dil' },
]


export function Kurulum({
  onBitir,
  maskotGizli = false,
}: {
  onBitir: (sonuc: KurulumSonucu) => void
  /** Açılış ekranındaki tavşan buranın üstüne konarken maskot gizleniyor. */
  maskotGizli?: boolean
}) {
  const [adim, setAdim] = useState(0)
  const [ad, setAd] = useState('')
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
    'isim',
    'sinif',
    ...(notluSiniflar.length > 0 ? (['notlar'] as AdimId[]) : []),
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
        // Baştaki/sondaki boşluk temizleniyor: "  Emre " ile "Emre" aynı ad.
        ad: ad.trim(),
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
        <Rabi
          durum={siradaki === sonAdim ? 'mutlu' : 'normal'}
          boyut={110}
          gizli={maskotGizli}
          yuvaMi
        />
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
        {suanki === 'isim' && (
          <div>
            <Etiket>Adın</Etiket>
            {/* Kişi simgesi alanın içinde duruyor: alan tek başına boş bir
                kutu, simge ne beklendiğini yazıya gerek kalmadan söylüyor.
                Simge `pointer-events-none`, yoksa üstüne dokunmak alanı
                odaklamaz ve klavye açılmazdı. */}
            <div className="relative">
              <User
                size={18}
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Alan
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                placeholder="Adını yaz"
                className="pl-10"
                // Ad alanı: klavye baş harfi büyütsün, tarayıcı yazım
                // denetimiyle altını kırmızı çizmesin.
                autoCapitalize="words"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="given-name"
                enterKeyHint="next"
                maxLength={24}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    ilerle()
                  }
                }}
              />
            </div>
          </div>
        )}

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
                <span className="font-medium">{tur.ad}</span>
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

                {/* "Şu an seçili" satırı yok: seçilen saat seçicinin
                    tepesinde, büyük puntoyla zaten duruyor. */}
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
