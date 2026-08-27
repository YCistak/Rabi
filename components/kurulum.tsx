'use client'

import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight, Check, User } from 'lucide-react'
import type { Ayarlar, Hedef, OkulYili, PuanTuru } from '@/lib/types'
import { SINIFLAR, SINIF_SECENEKLERI, mezunMu, sinifAdi } from '@/lib/hesap'
import { cn, yeniId } from '@/lib/utils'
import { Alan, Buton, Etiket, Kart } from '@/components/ui'
import { AramaAlani, Liste, SecilenSatir, SecimSatiri } from '@/components/hedef-secici'
import {
  bolumAra,
  bolumBul,
  tahminEt,
  turAdi,
  universiteAra,
  universiteBul,
  type Bolum,
  type Universite,
} from '@/lib/hedef-katalog'
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
  /**
   * Kurulumda seçilen hedef bölüm; seçilmediyse `null` ve kayda dokunulmuyor.
   *
   * Adım atlanabilir: hedefini henüz bilmeyen öğrenciyi kurulumda tutmak,
   * uygulamayı hiç açamamak demek olurdu. Hedef sonradan Araçlar'daki Hedefim
   * ekranından da konabiliyor.
   */
  hedef: Hedef | null
}

/**
 * Adımlar.
 *
 * Liste sabit değil: `notlar` adımı yalnızca **girilecek notu olan** kullanıcıda
 * araya giriyor. Mezunun dört yılı da bitmiştir; okuyan öğrencinin yalnızca
 * kendinden önceki sınıfları bitmiştir, 9. sınıftakinin ise hiçbiri — ona bu
 * adımı göstermek boş bir form göstermek olurdu.
 */
type AdimId =
  | 'karsilama'
  | 'isim'
  | 'tanisma'
  | 'sinif'
  | 'notlar'
  | 'alan'
  | 'bolum'
  | 'hedef'
  | 'hatirlatma'

const ADIM_BILGISI: Record<AdimId, { baslik: string; aciklama: string }> = {
  karsilama: {
    baslik: 'Rabi seni tanısın',
    aciklama: 'Ne kadar doğru cevap verirsen seni o kadar iyi yönlendiririm.',
  },
  isim: {
    baslik: 'Sana nasıl sesleneyim?',
    aciklama: 'Böylece seni adınla selamlayabilirim.',
  },
  /*
    Tanışma ekranının yazıları burada **yok**: başlıkta kullanıcının adı
    geçiyor ve ad ayrı renkte çiziliyor, yani metin değil JSX. Sabit bir
    tabloya sığmayan tek ekran bu; yazıları `TanismaEkrani` içinde duruyor.
  */
  tanisma: {
    baslik: '',
    aciklama: '',
  },
  sinif: {
    // Karşılama ekranı zaten selam verdi; burada ikinci kez "merhaba" demek
    // kullanıcıyı aynı yerde saydırıyordu.
    baslik: 'Hangi sınıftasın?',
    aciklama: 'Sıralama tahmini ve deneme takvimi buna göre kurulur.',
  },
  notlar: {
    baslik: 'Okul notların',
    aciklama: 'OBP’n sıralama tahminine giriyor. İstersen bu adımı atla.',
  },
  alan: {
    baslik: 'Hangi alandasın?',
    aciklama: 'Sıralama tahmini ve deneme şablonları buna göre ayarlanır.',
  },
  bolum: {
    baslik: 'Hedefin hangi bölüm?',
    aciklama: 'Günde 200 soru dedin. Peki bu sorular hangi bölüm için?',
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

/**
 * Adın en az kaç harf olacağı.
 *
 * Tek harf ("a") ya da boş bırakılan ad selamlamayı anlamsızlaştırıyor;
 * üç, gerçek adların hepsini geçirip baştan savma girişleri eleyen en küçük
 * sınır.
 */
const AD_EN_AZ = 3

const PUAN_TURU_ADI: Record<PuanTuru, string> = {
  say: 'Sayısal',
  ea: 'Eşit Ağırlık',
  soz: 'Sözel',
  dil: 'Dil',
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
  /**
   * Ad uyarısı yalnızca kullanıcı Devam'a bastıktan sonra çıkıyor.
   *
   * Ekran açılır açılmaz boş alanın üstüne kırmızı yazı koymak, daha hiçbir
   * şey yapmamış kullanıcıyı hatalı gibi göstermek olurdu.
   */
  const [adDenendi, setAdDenendi] = useState(false)
  const [sinif, setSinif] = useState(12)
  /** Mezunun yıl sonu notları: sınıf → yazılan metin. Boşlar hesaba girmiyor. */
  const [notlar, setNotlar] = useState<Record<number, string>>({})
  const [obpMetni, setObpMetni] = useState('')
  const [puanTuru, setPuanTuru] = useState<PuanTuru>('ea')
  // Varsayılan 200: çubuğun ortasına yakın, kurulumu hiç ellemeyen için makul.
  const [hedef, setHedef] = useState(200)
  /*
    Hedef bölüm: iki **ad** tutuluyor, kimlik değil — `Hedef` tipi de adla
    çalışıyor ve elle yazılmış eski kayıtlar öyle duruyor.

    Seçimin kendisi ayrı bir state'te durmuyor, adlardan türetiliyor: iki
    kaynak olsaydı biri ötekiyle çelişebilirdi (Hedefim ekranındaki kural).
  */
  const [hedefUniversite, setHedefUniversite] = useState('')
  const [hedefBolum, setHedefBolum] = useState('')
  const [uniArama, setUniArama] = useState('')
  const [bolumArama, setBolumArama] = useState('')
  const [saat, setSaat] = useState(20)
  const [dakika, setDakika] = useState(0)
  const [bildirim, setBildirim] = useState(true)

  const secilenUni = useMemo(() => universiteBul(hedefUniversite), [hedefUniversite])
  const secilenBolum = useMemo(() => bolumBul(hedefBolum), [hedefBolum])
  const uniSonuclari = useMemo(() => universiteAra(uniArama), [uniArama])
  const bolumSonuclari = useMemo(
    () => (secilenUni ? bolumAra(secilenUni, bolumArama) : []),
    [secilenUni, bolumArama],
  )

  const universiteSec = (secilen: Universite) => {
    setHedefUniversite(secilen.ad)
    setUniArama('')
    // Yeni üniversitenin açmadığı bir bölüm seçili kalırsa ekran, o
    // üniversitede olmayan bir hedefi kaydedilebilir gösterirdi.
    if (secilenBolum && !bolumAra(secilen, '').some((b) => b.id === secilenBolum.id)) {
      setHedefBolum('')
    }
  }

  const bolumSec = (secilen: Bolum) => {
    setHedefBolum(secilen.ad)
    setBolumArama('')
  }

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
    'karsilama',
    'isim',
    'tanisma',
    'sinif',
    ...(notluSiniflar.length > 0 ? (['notlar'] as AdimId[]) : []),
    'alan',
    'bolum',
    'hedef',
    'hatirlatma',
  ]
  const sonAdim = adimlar.length - 1
  const siradaki = Math.min(adim, sonAdim)
  const suanki = adimlar[siradaki]
  /*
    Nokta göstergesinin saydığı adımlar: soru soranlar.

    Sayının `adimlar` üzerinden değil ayrı bir listeden çıkması şart — karşılama
    ile tanışma dizinin içinde duruyor (sıra onlardan geçiyor) ama noktası yok.
    Dizinin kendisinden çıkarılsalardı `ilerle` onları atlardı.
  */
  const noktaAdimlari: AdimId[] = adimlar.filter((id) => id !== 'karsilama' && id !== 'tanisma')
  const noktaSirasi = noktaAdimlari.indexOf(suanki)

  const ilerle = () => setAdim(Math.min(sonAdim, siradaki + 1))
  const geri = () => setAdim(Math.max(0, siradaki - 1))

  const adGecerli = ad.trim().length >= AD_EN_AZ
  /** Uyarı, denendikten sonra yazarken de canlı kalıyor; üç harfte kayboluyor. */
  const adUyarisi = adDenendi && !adGecerli

  /**
   * Devam / Başlayalım düğmesi.
   *
   * Ad adımında geçersiz bir adla ilerlemeyi kesiyor: düğmeyi devre dışı
   * bırakmak yerine basılabilir bırakıp uyarı göstermek, kullanıcıya neyin
   * eksik olduğunu söylüyor — ölü bir düğme söylemezdi.
   */
  const devamEt = () => {
    if (suanki === 'isim' && !adGecerli) {
      setAdDenendi(true)
      return
    }
    if (siradaki === sonAdim) void bitir()
    else ilerle()
  }

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
      /*
        Taban puan ve sıra katalogdan hesaplanıyor, kullanıcıya sorulmuyor:
        ikisini de bilen kimse yok ve `hedef-katalog.ts` sırayı üniversitenin
        kademesinden, puanı da o sıradan çıkarıyor. Puan türü seçilen bölümün
        türü — kurulumdaki "Hangi alandasın?" öğrencinin kendi alanını soruyor
        ve hedef bölümünkiyle aynı olmak zorunda değil.
      */
      hedef:
        secilenUni && secilenBolum
          ? {
              universite: secilenUni.ad,
              bolum: secilenBolum.ad,
              puanTuru: secilenBolum.puanTuru,
              ...tahminHedefi(secilenUni, secilenBolum),
            }
          : null,
    })
  }

  /*
    Karşılama ekranının düzeni ötekilere benzemiyor, o yüzden erken dönüyor.

    Soru sormuyor: kart, adım noktaları ve geri düğmesi burada gürültü olurdu —
    ekranda yapılacak tek bir şey var. Maskot da ekranın **ortasında** duruyor,
    başlığın yanında değil; açılıştaki tavşan buranın üstüne konduğu için
    (`yuvaMi`) ilk açılışta uçuş doğrudan bu tavşanın üstünde bitiyor.
  */
  if (suanki === 'karsilama') {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pt-[calc(2rem+var(--guvenli-ust))] pb-[calc(2rem+var(--guvenli-alt))]">
        {/* Üstteki boşluk alttakinden küçük: maskot tam ortada dururken ekran
            aşağı sarkmış gibi görünüyor, göz ağırlık merkezini ortanın biraz
            üstünde arıyor. */}
        <div className="flex-[0.85]" aria-hidden />

        <div className="flex flex-col items-center text-center">
          {/* Açılıştaki tavşan buranın üstüne konuyor: kurulumun ilk ekranı bu. */}
          <Rabi durum="mutlu" boyut={150} gizli={maskotGizli} yuvaMi />
          <h1 className="mt-6 font-display text-[27px] leading-tight font-extrabold tracking-tight text-balance">
            {ADIM_BILGISI.karsilama.baslik}
          </h1>
          <p className="mt-2.5 text-[15px] leading-snug font-medium text-balance text-muted-foreground">
            {ADIM_BILGISI.karsilama.aciklama}
          </p>
        </div>

        <div className="flex-1" aria-hidden />

        <Buton className="w-full" onClick={devamEt}>
          Başlayalım
        </Buton>
      </div>
    )
  }

  /*
    Tanışma: adı aldıktan hemen sonra onu geri söyleyen ekran.

    Yazılan adın gerçekten kaydedildiğini gösteren tek yer burası — kurulumun
    geri kalanı sınıf, alan ve hedef soruyor ve ad bir daha görünmüyordu.
    Maskot burada el sallıyor; selam veren bir yüz, karşılamadaki duran yüzle
    aynı görsel olsaydı ekran ileri gitmiş gibi durmazdı.

    Yuva değil: açılış çoktan bitti ve kullanıcı buraya ancak iki dokunuşla
    gelebiliyor.
  */
  if (suanki === 'tanisma') {
    return <TanismaEkrani ad={ad} maskotGizli={maskotGizli} onDevam={devamEt} />
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

      {/* Sınıf ve notlar adımları kartın dışında duruyor: ikisinde de
          seçenekler/satırlar zaten birer kart, onları bir kartın içine koymak
          iç içe iki çerçeve demek olurdu. */}
      {suanki === 'sinif' ? (
        <SinifSecimi secili={sinif} onSec={setSinif} />
      ) : suanki === 'notlar' ? (
        <OkulNotlari
          siniflar={notluSiniflar}
          notlar={notlar}
          onNot={(sinif, deger) => setNotlar((onceki) => ({ ...onceki, [sinif]: deger }))}
          mezun={mezun}
          obpMetni={obpMetni}
          onObp={setObpMetni}
        />
      ) : (
        <Kart>
          {suanki === 'isim' && (
            <div>
              {/* Uyarı etiketin sağında, alanın hemen üstünde duruyor: göz
                  alandan yukarı kaydığında ilk gördüğü yer burası. Açılır
                  pencere kullanılmadı — kullanıcıyı akıştan koparırdı. */}
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <Etiket htmlFor="kurulum-ad" className="mb-0">
                  Adın
                </Etiket>
                {adUyarisi && (
                  <span
                    id="kurulum-ad-uyari"
                    role="alert"
                    className="flex items-center gap-1 text-xs font-medium text-danger"
                  >
                    <AlertCircle size={13} aria-hidden className="shrink-0" />
                    En az {AD_EN_AZ} harf yaz
                  </span>
                )}
              </div>
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
                  id="kurulum-ad"
                  value={ad}
                  onChange={(e) => setAd(e.target.value)}
                  placeholder="Adını yaz"
                  aria-invalid={adUyarisi}
                  aria-describedby={adUyarisi ? 'kurulum-ad-uyari' : undefined}
                  className={`pl-10 ${adUyarisi ? 'border-danger focus-visible:border-danger' : ''}`}
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
                      devamEt()
                    }
                  }}
                />
              </div>
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

          {suanki === 'bolum' && (
            <div className="space-y-4">
              <div>
                <Etiket htmlFor="kurulum-universite-ara">Üniversite</Etiket>
                {secilenUni ? (
                  <SecilenSatir
                    baslik={secilenUni.ad}
                    alt={`${secilenUni.sehir} · ${turAdi(secilenUni)}`}
                    onDegistir={() => {
                      setHedefUniversite('')
                      setUniArama('')
                    }}
                  />
                ) : (
                  <>
                    <AramaAlani
                      id="kurulum-universite-ara"
                      deger={uniArama}
                      onDegis={setUniArama}
                      ipucu="Üniversite ya da şehir ara"
                    />
                    <Liste bos="Bu adla üniversite bulamadım.">
                      {uniSonuclari.map((u) => (
                        <SecimSatiri
                          key={u.id}
                          baslik={u.ad}
                          alt={`${u.sehir} · ${turAdi(u)}`}
                          onSec={() => universiteSec(u)}
                        />
                      ))}
                    </Liste>
                  </>
                )}
              </div>

              {/* Bölüm listesi ancak üniversite seçilince çıkıyor: hangi
                  bölümlerin açıldığı üniversiteye bağlı ve boş bir liste,
                  seçilecek bir şey yokmuş gibi durur. */}
              {secilenUni && (
                <div>
                  <Etiket htmlFor="kurulum-bolum-ara">Bölüm</Etiket>
                  {secilenBolum ? (
                    <SecilenSatir
                      baslik={secilenBolum.ad}
                      alt={`${PUAN_TURU_ADI[secilenBolum.puanTuru]} · ${secilenBolum.sure} yıl`}
                      onDegistir={() => setHedefBolum('')}
                    />
                  ) : (
                    <>
                      <AramaAlani
                        id="kurulum-bolum-ara"
                        deger={bolumArama}
                        onDegis={setBolumArama}
                        ipucu="Bölüm ara"
                      />
                      <Liste bos="Bu üniversitede böyle bir bölüm bulamadım.">
                        {bolumSonuclari.map((b) => (
                          <SecimSatiri
                            key={b.id}
                            baslik={b.ad}
                            alt={`${PUAN_TURU_ADI[b.puanTuru]} · ${b.sure} yıl`}
                            onSec={() => bolumSec(b)}
                          />
                        ))}
                      </Liste>
                    </>
                  )}
                </div>
              )}
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
                <span className="font-medium">Günlük hatırlatma</span>
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
      )}

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
        <Buton className="flex-1" onClick={devamEt}>
          {/* Karşılama ekranı "Başlayalım" diyor; aynı akışta ikinci kez aynı
              söz, kullanıcıya başa döndüğünü düşündürüyordu. */}
          {siradaki === sonAdim ? 'Hazırım' : 'Devam'}
          {siradaki === sonAdim ? (
            <Check size={18} aria-hidden />
          ) : (
            <ArrowRight size={18} aria-hidden />
          )}
        </Buton>
      </div>

      {/* Adım göstergesi — karşılama ve tanışma sayılmıyor: nokta "kaç soru
          kaldı"yı anlatıyor, ikisi de soru sormuyor. Zaten kendi düzenlerini
          çizdikleri için şerit orada hiç görünmüyor. */}
      <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
        {noktaAdimlari.map((id, i) => (
          <span
            key={id}
            className={`h-1.5 rounded-full transition-all ${
              i === noktaSirasi ? 'w-5 bg-primary' : 'w-1.5 bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}


/**
 * Seçilen bölümün tahmini taban puanı ve başarı sırası.
 *
 * Sayılar `hedef-katalog.ts`ten geliyor ve **tahmin**: kurulum onları
 * sormuyor, kullanıcı sonradan Hedefim ekranından düzeltebiliyor.
 */
function tahminHedefi(
  universite: Universite,
  bolum: Bolum,
): { tabanPuan: number; basariSirasi: number } {
  const tahmin = tahminEt(universite, bolum)
  return { tabanPuan: tahmin.tabanPuan, basariSirasi: tahmin.siralama }
}

/**
 * Tanışma ekranındaki süsler.
 *
 * Konumlar oran (yüzde), piksel değil: ekran boyu telefondan telefona
 * değişiyor ve sabit piksellerde süsler küçük ekranda daireye biniyor,
 * büyükte kenara yapışıyordu. Hepsi `aria-hidden` — taşıdıkları bilgi yok,
 * ekran okuyucuya sekiz emoji okutmak gürültü olurdu.
 *
 * Her süs kendi süresi ve gecikmesiyle süzülüyor (`sus-suzuluyor`): ortak bir
 * ritim sekizini tek ağızdan soluk alıp veren bir topluluğa çeviriyordu.
 */
const SUSLER = [
  { simge: '🐾', sol: '27%', ust: '9%', boy: 'text-[19px]', sure: 4200, gecikme: 0 },
  { simge: '✨', sol: '13%', ust: '19%', boy: 'text-[17px]', sure: 5200, gecikme: 700 },
  { simge: '🩷', sol: '68%', ust: '12%', boy: 'text-[19px]', sure: 4600, gecikme: 1300 },
  { simge: '🥕', sol: '83%', ust: '25%', boy: 'text-[21px]', sure: 5600, gecikme: 400 },
  { simge: '💛', sol: '19%', ust: '47%', boy: 'text-[19px]', sure: 4800, gecikme: 1800 },
  { simge: '🌸', sol: '88%', ust: '53%', boy: 'text-[19px]', sure: 5000, gecikme: 900 },
  { simge: '⭐', sol: '9%', ust: '70%', boy: 'text-[17px]', sure: 4400, gecikme: 2100 },
  { simge: '✨', sol: '78%', ust: '75%', boy: 'text-[19px]', sure: 5400, gecikme: 1500 },
]

/**
 * Tanışma — kurulumun kutlama ekranı.
 *
 * Karşılamayla aynı düzeni **paylaşmıyor** (`TekIsliEkran`): orası sakin bir
 * giriş, burası adı öğrendikten sonraki karşılama anı. Süzülen süsler ve üç
 * noktalı gösterge yalnızca burada; ikisini tek bileşende toplamak, yarısı
 * kullanılmayan bir sürü propla biten bir bileşen olurdu.
 *
 * Zemin uygulamanın geri kalanıyla aynı. Bir süre degrade bir zemin, altın
 * halkalı bir madalyon ve "Aramıza hoş geldin" rozeti vardı; üçü de kalktı.
 * Ekranın tek işi adı geri söylemek ve onun etrafındaki her katman o cümleyi
 * bastırıyordu.
 *
 * Maskot el sallıyor. Tasarımda dairenin sağ üstünde ayrıca bir 👋 duruyordu;
 * alındı — maskot zaten el sallıyor ve iki el aynı anda iki selam gibi
 * okunuyordu.
 *
 * Yuva değil: açılış çoktan bitti, kullanıcı buraya ancak iki dokunuşla
 * geliyor.
 */
function TanismaEkrani({
  ad,
  maskotGizli,
  onDevam,
}: {
  ad: string
  maskotGizli: boolean
  onDevam: () => void
}) {
  const temizAd = ad.trim()

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-md flex-col overflow-hidden px-5 pt-[calc(2rem+var(--guvenli-ust))] pb-[calc(1.5rem+var(--guvenli-alt))]">
      {SUSLER.map((sus, sira) => (
        <span
          key={`${sus.simge}-${sira}`}
          aria-hidden
          className={`sus-suzuluyor pointer-events-none absolute -z-10 -translate-x-1/2 -translate-y-1/2 opacity-80 ${sus.boy}`}
          style={
            {
              left: sus.sol,
              top: sus.ust,
              '--sus-sure': `${sus.sure}ms`,
              '--sus-gecikme': `${sus.gecikme}ms`,
            } as CSSProperties
          }
        >
          {sus.simge}
        </span>
      ))}

      <div className="flex-[0.9]" aria-hidden />

      <div className="flex flex-col items-center text-center">
        {/* Maskot karşılama ekranıyla aynı ölçüde (150): iki ekran arka arkaya
            geliyor ve tavşanın ekrandan ekrana büyüyüp küçülmesi geçişi
            kesiyordu. Halkalı madalyon da kalktı — çember degradenin üstünde
            maskotu zeminden ayırmak için vardı, düz zeminde tavşanın etrafına
            çizilmiş bir çerçeveye dönüşüyor. */}
        <Rabi durum="mutlu" poz="el-sallayan" boyut={150} gizli={maskotGizli} />

        {/* Ad vurgulu: ekranın tek işi adı geri söylemek, o yüzden cümlenin
            içinde aranmadan bulunuyor. Yazıda `--primary` kullanılıyor,
            dolgunun parlak tonu değil — parlak ton yazıda kontrastı tutmuyor. */}
        <h1 className="mt-6 font-display text-[29px] leading-[1.2] font-extrabold tracking-tight text-balance">
          {temizAd === '' ? (
            'Seni tanıdığıma memnun oldum'
          ) : (
            <>
              Seni tanıdığıma memnun oldum, <span className="text-primary">{temizAd}</span>
            </>
          )}
        </h1>

        <p className="mt-3 max-w-[19rem] text-[14.5px] leading-snug font-medium text-balance text-muted-foreground">
          Bundan sonra birlikteyiz — küçük adımlarla güzel şeyler yapacağız. 🌱
        </p>
      </div>

      <div className="flex-1" aria-hidden />

      {/*
        Üç nokta = kurulumun soru sormayan üç ekranı, sonuncusu bu.

        Tasarımda ilk nokta doluydu; sonuncusu dolduruldu çünkü bu ekran
        üçüncü sırada ve "1/3" diyen bir gösterge kullanıcıya yolun daha yeni
        başladığını söylerdi.
      */}
      <div className="mb-5 flex justify-center gap-1.5" aria-hidden>
        <span className="h-1.5 w-1.5 rounded-full bg-border" />
        <span className="h-1.5 w-1.5 rounded-full bg-border" />
        <span className="h-1.5 w-5 rounded-full bg-primary-dolu" />
      </div>

      {/* Düğme kurulumun geri kalanından daha yuvarlak ve daha uzun: bu ekranda
          tek eylem var ve tasarım onu bir tuş değil bir davet gibi çiziyor. */}
      <Buton className="h-14 w-full rounded-full text-[17px]" onClick={onDevam}>
        Devam
      </Buton>
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


/**
 * Sınıf seçimi — büyük, dikey kartlar.
 *
 * Seçim tek göstergeyle anlatılıyor: turuncu dolgu. Tik ya da kutucuk yok,
 * çünkü dolu turuncu kartın seçili olduğu bir bakışta belli; ikon aynı bilgiyi
 * ikinci kez söyleyip listeyi kalabalıklaştırırdı.
 *
 * Seçili kart bir tık büyüyor (`scale`) — düzeni kaydırmayan, yalnızca göze
 * "burası" diyen kadarı. Yükseklikler `min-h` ile veriliyor ki yazı tipi
 * büyütülmüş telefonlarda kart taşmak yerine uzasın.
 */
function SinifSecimi({
  secili,
  onSec,
}: {
  secili: number
  onSec: (sinif: number) => void
}) {
  return (
    /* `my-auto`: kartlar kalan boşlukta dikey ortalanıyor. Üstte maskot,
       altta Devam dururken listenin tepeye yapışması sayfayı dengesiz
       gösteriyordu. */
    <div
      className="my-auto space-y-2.5"
      role="radiogroup"
      aria-label="Bu yıl kaçıncı sınıftasın?"
    >
      {SINIF_SECENEKLERI.map((s) => {
        const bu = secili === s
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={bu}
            onClick={() => onSec(s)}
            className={cn(
              'flex w-full items-center justify-center rounded-3xl border px-5 py-4 text-center',
              'transition-all duration-200 ease-out',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              bu
                ? 'golge-kart min-h-[64px] scale-[1.015] border-primary-dolu bg-primary-dolu text-white'
                : 'min-h-[56px] border-border bg-card text-muted-foreground active:bg-muted',
            )}
          >
            <span
              className={cn(
                'font-display tracking-wide transition-all duration-200 ease-out',
                bu ? 'text-lg font-bold' : 'text-base font-semibold',
              )}
            >
              {sinifAdi(s).toLocaleUpperCase('tr-TR')}
            </span>
          </button>
        )
      })}
    </div>
  )
}


/** Yıl sonu notunun tavanı: notlar yüz üzerinden. */
const NOT_EN_COK = 100
/** OBP'nin tavanı: diploma notunun beş katı, yani 500 üzerinden. */
const OBP_EN_COK = 500

/**
 * Sayı alanına yazılanı süzer; sınırı aşan giriş **kabul edilmiyor**.
 *
 * `null` dönmesi "bu tuşu yok say" demek: 100'lük bir alana 105 yazılınca
 * sayıyı sessizce 100'e çevirmek, kullanıcının yazdığından başka bir şey
 * kaydetmek olurdu — tuş hiç işlenmiyor ve alanda 10 kalıyor.
 *
 * Yarım yazımlar (`82,`) geçiyor: onlar geçersiz değil, henüz bitmemiş.
 */
function sayiSuz(ham: string, enCok: number): string | null {
  const temiz = ham.replace(/[^0-9,.]/g, '').slice(0, 6)
  if (temiz === '') return ''
  const sayi = Number(temiz.replace(',', '.'))
  if (!Number.isFinite(sayi)) return temiz
  return sayi > enCok ? null : temiz
}

/**
 * Okul notları — yıl başına bir satır kartı.
 *
 * Kartlar sınıf seçimiyle aynı dili konuşuyor: adım adım ilerleyen kurulumda
 * her ekranın kendi görsel diline geçmesi akışı parçalıyordu. Eski hâli iki
 * sütunlu bir ızgaraydı ve tek sayıda yıl olduğunda (9-10-11) sağ alt köşe boş
 * kalıp liste yarım görünüyordu.
 *
 * Not girilen kart turuncuya dönüyor: "hangi yılı doldurdum" sorusunu kutuların
 * içine tek tek bakmadan cevaplıyor.
 *
 * `/100` ölçek yazıyor çünkü not beşlik mi yüzlük mü sorusu gerçekten soruluyor;
 * hesap (`okulYillariKur`) 0–100 aralığına kırpıyor.
 */
function OkulNotlari({
  siniflar,
  notlar,
  onNot,
  mezun,
  obpMetni,
  onObp,
}: {
  siniflar: number[]
  notlar: Record<number, string>
  onNot: (sinif: number, deger: string) => void
  /** OBP yalnızca mezunda soruluyor — aşağıdaki açıklamaya bak. */
  mezun: boolean
  obpMetni: string
  onObp: (deger: string) => void
}) {
  const obpDolu = obpMetni.trim() !== ''

  return (
    <div className="my-auto">
      <div className="space-y-2.5">
        {siniflar.map((s) => {
          const dolu = (notlar[s] ?? '').trim() !== ''
          return (
            <label
              key={s}
              className={cn(
                'golge-kart flex items-center justify-between gap-3 rounded-2xl border py-2.5 pl-4 pr-2.5',
                'transition-colors duration-200',
                dolu ? 'border-primary/35 bg-primary-soft' : 'border-border bg-card',
              )}
            >
              <span className="font-display text-base font-bold tracking-wide">
                {s}. SINIF
              </span>
              <span className="flex items-center gap-1.5">
                <Alan
                  inputMode="decimal"
                  value={notlar[s] ?? ''}
                  onChange={(e) => {
                    const deger = sayiSuz(e.target.value, NOT_EN_COK)
                    if (deger !== null) onNot(s, deger)
                  }}
                  placeholder="—"
                  aria-label={`${s}. sınıf yıl sonu notu`}
                  className={cn(
                    'rakam w-20 text-center text-lg font-bold',
                    dolu && 'border-primary/45 text-primary',
                  )}
                />
                <span className="text-sm text-muted-foreground" aria-hidden>
                  /100
                </span>
              </span>
            </label>
          )
        })}
      </div>

      {/* OBP kutusu **yalnızca mezunda**.

          OBP diploma notunun beş katı ve ancak bütün yıllar bitince oluşuyor;
          okuyan öğrencinin bilebileceği bir sayı değil. Kutuyu herkese
          göstermek, henüz var olmayan bir sayıyı soruyor olurdu.

          Görünüşü yıl satırlarıyla aynı: aynı ekranda iki ayrı form dili
          konuşmak, OBP'yi başka bir yerden gelmiş gibi gösteriyordu. Ölçek
          farkını `/500` söylüyor. */}
      {mezun && (
        <div className="mt-4 border-t border-border pt-4">
          <Etiket htmlFor="kurulum-obp">Ya da OBP’ni biliyorsan</Etiket>
          <label
            htmlFor="kurulum-obp"
            className={cn(
              'golge-kart flex items-center justify-between gap-3 rounded-2xl border py-2.5 pl-4 pr-2.5',
              'transition-colors duration-200',
              obpDolu ? 'border-primary/35 bg-primary-soft' : 'border-border bg-card',
            )}
          >
            <span className="font-display text-base font-bold tracking-wide">OBP</span>
            <span className="flex items-center gap-1.5">
              <Alan
                id="kurulum-obp"
                inputMode="decimal"
                value={obpMetni}
                onChange={(e) => {
                  const deger = sayiSuz(e.target.value, OBP_EN_COK)
                  if (deger !== null) onObp(deger)
                }}
                placeholder="—"
                aria-label="Elle girilen OBP"
                className={cn(
                  'rakam w-20 text-center text-lg font-bold',
                  obpDolu && 'border-primary/45 text-primary',
                )}
              />
              <span className="text-sm text-muted-foreground" aria-hidden>
                /500
              </span>
            </span>
          </label>
        </div>
      )}
    </div>
  )
}
