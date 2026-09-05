'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight, Check, User } from 'lucide-react'
import type { Ayarlar, Hedef, OkulYili, PuanTuru } from '@/lib/types'
import { SINIFLAR, SINIF_SECENEKLERI, mezunMu, sinifAdi } from '@/lib/hesap'
import { cn, yeniId } from '@/lib/utils'
import { Alan, Buton, Etiket, Kart } from '@/components/ui'
import { AramaAlani, Liste, SecilenSatir, SecimSatiri } from '@/components/hedef-secici'
import {
  bolumAra,
  bolumBul,
  bolumleriGetir,
  tahminEt,
  turAdi,
  universiteAra,
  universiteBul,
  type Bolum,
  type Universite,
} from '@/lib/hedef-katalog'
import { SaatSecici, SayiTekerlegi } from '@/components/secici'
import { Rabi } from '@/components/maskot/rabi'
import { HAZIRLIK_SURESI, Hazirlaniyor } from '@/components/hazirlaniyor'
import { AD_EN_AZ, adBiciminde, adGecerliMi } from '@/lib/ad'
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
    aciklama: 'Sıralama tahmini, deneme şablonları ve bölüm listesi buna göre ayarlanır.',
  },
  bolum: {
    /*
      Soru hedefi hayalden **sonra** soruluyor (`hedef` adımı bu adımın
      ardında): açıklama bir süre "Günde 200 soru dedin" diye başlıyordu ve
      kullanıcı o sayıyı henüz söylememişti.
    */
    baslik: 'Hayalindeki üniversite ve bölüm neresi?',
    aciklama: 'Seçmezsen de olur; sonradan Hedefim ekranından ekleyebilirsin.',
  },
  hedef: {
    baslik: 'Bugün kaç soru çözmek istiyorsun?',
    aciklama: 'Günlük hedefini belirle.',
  },
  hatirlatma: {
    /*
      Soruyu balon soruyor, kart değil.

      Başlık bir süre yalnızca "Hatırlatma" diyordu ve asıl soru kartın
      içindeki etikette duruyordu; balonlu düzende ikisi arka arkaya görününce
      ekranda iki başlık oluyordu. Soru yukarı alındı, etiket kaldırıldı.
    */
    baslik: 'Saat kaçta hatırlatayım?',
    aciklama: 'Her gün bu saatte seni çalışmaya çağıracağım.',
  },
}


const PUAN_TURU_ADI: Record<PuanTuru, string> = {
  say: 'Sayısal',
  ea: 'Eşit Ağırlık',
  soz: 'Sözel',
  dil: 'Dil',
}

/**
 * Kurulumda sorulan alanlar.
 *
 * **Dil burada yok**, `PuanTuru` içinde duruyor: Dil öğrencisi azınlıkta ve
 * kurulumdaki dördüncü kart listeyi kararsızlara kapatıyordu. Dil'i seçmek
 * gerekirse yolu Ayarlar &rsaquo; Alanım -- oradaki çip listesi dört türü de
 * gösteriyor. Katalogdaki DİL programları da yerinde; yalnızca kurulumdaki
 * soru sadeleşti.
 *
 * `'yok'` gerçek bir puan türü değil, "karar vermedim"in kart listesindeki
 * karşılığı; kayda `null` olarak geçiyor. Kararsız öğrenciye bir alan
 * seçtirmek, sıralama ekranında onun hiç söylemediği bir türe göre hesaplanmış
 * bir sayı göstermek olurdu.
 */
const ALANSIZ = 'yok'

const PUAN_TURLERI: { id: PuanTuru | typeof ALANSIZ; ad: string }[] = [
  { id: 'say', ad: 'Sayısal' },
  { id: 'ea', ad: 'Eşit Ağırlık' },
  { id: 'soz', ad: 'Sözel' },
  { id: ALANSIZ, ad: 'Karar vermedim' },
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
  const [puanTuru, setPuanTuru] = useState<PuanTuru | null>(null)
  /**
   * Alan kartlarından birine dokunuldu mu.
   *
   * `puanTuru` tek başına yetmiyor: "Karar vermedim" de `null` kaydediliyor ve
   * kart listesi bir süre o seçeneği **seçili** gösteriyordu — hiçbir şeye
   * dokunmamış kullanıcı, kendi adına verilmiş bir cevap görüyordu. Şimdi
   * hiçbiri seçili gelmiyor ve Devam, cevap verilene kadar pasif.
   */
  const [alanSecildi, setAlanSecildi] = useState(false)
  /** "Daha sonra seçerim" işaretli mi — bölüm ve notlar adımlarının atlama yolu. */
  const [bolumSonra, setBolumSonra] = useState(false)
  const [notlarSonra, setNotlarSonra] = useState(false)
  /*
    Bölüm listesi alana göre süzülüyor; bu anahtar süzgeci kaldırıyor.

    Süzgeç şart: sözel öğrenciye Bilgisayar Mühendisliği göstermek,
    giremeyeceği bir bölümü hedef olarak kaydettirmek demek. Ama kapısı da
    şart -- alan değiştirmeyi düşünen ya da alanını yanlış işaretlemiş öğrenci
    aradığı bölümü hiç bulamaz ve listeyi bozuk sanardı.
  */
  const [alanDisiniGoster, setAlanDisiniGoster] = useState(false)
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
  /**
   * Kurulum bitti, hazırlık ekranı akıyor.
   *
   * Sonuç burada bekliyor çünkü `onBitir` çağrıldığı anda ekran ana sayfaya
   * dönüyor; hazırlık ekranı da tam olarak o anı geciktirmek için var.
   */
  const [hazirlanan, setHazirlanan] = useState<KurulumSonucu | null>(null)
  /*
    Maskotun bir önceki adımdaki yeri.

    Kurulumun üç düzeni var (karşılama, tanışma, soru ekranları) ve maskot
    ekrandan ekrana hem yer hem boy değiştiriyor: ortada 150 pikselken sol
    üstte 76'ya iniyor. Adım değişince tavşan bir karede oradan oraya
    ışınlanıyordu; `KurulumMaskotu` eski kutuyu buradan okuyup aradaki farkı
    uçarak kapatıyor. Ref `Kurulum`da duruyor çünkü ekranlar ayrı ağaçlar —
    maskot her adımda sökülüp yeniden kuruluyor ve bileşenin kendi içinde
    tutulan bir değer o sırada kayboluyor.
  */
  const maskotKutusu = useRef<DOMRect | null>(null)

  const secilenUni = useMemo(() => universiteBul(hedefUniversite), [hedefUniversite])
  const secilenBolum = useMemo(
    () => bolumBul(secilenUni, hedefBolum),
    [secilenUni, hedefBolum],
  )
  const uniSonuclari = useMemo(() => universiteAra(uniArama), [uniArama])
  /** Kararsızken ve anahtar açıkken süzgeç yok; kalan durumda alan süzüyor. */
  const alanSuzgeci = alanDisiniGoster ? null : puanTuru
  const bolumSonuclari = useMemo(
    () => (secilenUni ? bolumAra(secilenUni, bolumArama, alanSuzgeci) : []),
    [secilenUni, bolumArama, alanSuzgeci],
  )

  const universiteSec = (secilen: Universite) => {
    // Seçim yapan kullanıcıda "daha sonra" işareti kalırsa iki cevap birden
    // verilmiş olurdu; dokunuş işareti kaldırıyor.
    setBolumSonra(false)
    setHedefUniversite(secilen.ad)
    setUniArama('')
    // Yeni üniversitenin açmadığı bir bölüm seçili kalırsa ekran, o
    // üniversitede olmayan bir hedefi kaydedilebilir gösterirdi. Denetim
    // süzgeçsiz listeye bakıyor: alan dışındaki bir seçim geçerli, yalnızca
    // listede gizli.
    if (secilenBolum && !bolumleriGetir(secilen).some((b) => b.id === secilenBolum.id)) {
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
  /*
    Üstteki çubuğun doluluğu — nokta şeridiyle aynı sayıyı gösteriyor.

    Payda `noktaAdimlari`nin boyu: notlar adımı herkeste yok ve çubuk sabit
    bir yediliğe göre dolsaydı o adımı görmeyen kullanıcıda hiç dolmadan
    biterdi. Son adımda tam dolu.
  */
  const ilerlemeYuzdesi = ((noktaSirasi + 1) / noktaAdimlari.length) * 100

  const ilerle = () => setAdim(Math.min(sonAdim, siradaki + 1))
  const geri = () => setAdim(Math.max(0, siradaki - 1))

  const adGecerli = adGecerliMi(ad)
  /** Notlar adımında girilmiş tek bir sayı var mı. */
  const notVar = Object.values(notlar).some((n) => n.trim() !== '') || obpMetni.trim() !== ''
  /**
   * Devam düğmesi basılabilir mi.
   *
   * Kural: **boş kutuyla ilerlenmiyor.** Boş bırakılabilen adımlarda (bölüm,
   * notlar) atlamanın kendi işareti var — "daha sonra seçeceğim". Sessizce
   * geçilen bir adım, kullanıcının cevaplamayı unuttuğu adımdır: bölüm adımı
   * boş geçildiğinde ana sayfadaki hedef paneli boş açılıyor ve oraya kimse
   * geri dönmüyordu.
   */
  const devamEdilebilir =
    suanki === 'isim'
      ? adGecerli
      : suanki === 'alan'
        ? alanSecildi
        : suanki === 'bolum'
          ? bolumSonra || (secilenUni !== null && secilenBolum !== null)
          : suanki === 'notlar'
            ? notlarSonra || notVar
            : true
  /**
   * Ad ipucu iki yüzlü: boş alanda **soluk** bir yönerge, kısa yazılmış adda
   * **kırmızı** bir uyarı.
   *
   * Eskiden uyarı yalnızca Devam'a basıldıktan sonra çıkıyordu; düğme artık
   * geçersiz adla pasif olduğu için o an hiç gelmiyor. Pasif bir düğmenin
   * yanında sebebi yazmayan bir ekran, kullanıcıyı kurulumda kilitler.
   */
  const adUyarisi = !adGecerli && ad.trim() !== ''

  /**
   * Devam / Başlayalım düğmesi.
   *
   * Eksik cevapla ilerlemiyor. Düğme bu durumda **pasif** çiziliyor ve neyin
   * eksik olduğu ekranda yazıyor: ad alanının üstündeki ipucu, bölüm ve notlar
   * adımlarında da düğmenin hemen üstündeki "daha sonra" satırı. Bir süre tersi
   * denendi — düğme basılabilir kalıyor, basılınca uyarı çıkıyordu — ama o
   * düzende hiç uyarı çıkmayan adımlar (bölüm, notlar) sessizce boş
   * geçilebiliyordu.
   *
   * Klavyedeki Enter da buraya düşüyor, o yüzden denetim düğmede değil burada.
   */
  const devamEt = () => {
    if (!devamEdilebilir) return
    /*
      "Daha sonra" işaretliyken yazılmış olanlar temizleniyor: kullanıcı üç yılı
      girip sonra işareti koyduysa kararı sonuncusudur ve yarım bir OBP,
      tahmini sessizce bozardı.
    */
    if (suanki === 'notlar' && notlarSonra) {
      setNotlar({})
      setObpMetni('')
    }
    if (suanki === 'bolum' && bolumSonra) {
      setHedefUniversite('')
      setHedefBolum('')
    }
    if (siradaki === sonAdim) void bitir()
    else ilerle()
  }

  const bitir = async () => {
    // Hatırlatma açık kuruluyor; kurulumda kapatma anahtarı yok. Uygulamayı
    // yeni kuran kişi hatırlatmanın ne olduğunu daha görmedi ve kapalıya basıp
    // bir daha hiç açmıyordu. Kapatma yeri Ayarlar — orada hatırlatmanın ne
    // yaptığı yaşanmış oluyor.
    //
    // Android 13+ izni de burada isteniyor: saat kurulduktan hemen sonra, ne
    // için sorulduğu belliyken. Reddedilirse kurulum yine tamamlanıyor,
    // yalnızca hatırlatma kapalı kaydediliyor — Ayarlar'dan tekrar denenebilir.
    const izinli = await izinIste()
    const obp = Number(obpMetni.replace(',', '.'))
    setHazirlanan({
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
    Hazırlık ekranı dolunca sonuç yukarı veriliyor.

    Sayaç burada, `Hazirlaniyor` içinde değil: bileşen yalnızca çiziyor, akışı
    kesen karar kurulumun kendisine ait. Ekran arada kapanırsa (uygulama
    kapatılırsa) sayaç da temizleniyor — kurulum kaydedilmemiş sayılıyor ve
    açılışta baştan başlıyor.
  */
  const bitirRef = useRef(onBitir)
  bitirRef.current = onBitir

  useEffect(() => {
    if (!hazirlanan) return
    // `onBitir` bağımlılığa konamaz: `AppShell` onu satır içi bir fonksiyon
    // olarak veriyor, yani her çizimde yeni bir referans. Bağımlılık olsaydı
    // üstteki her çizim sayacı baştan kurar ve ekran hiç kapanmazdı.
    const sayac = setTimeout(() => bitirRef.current(hazirlanan), HAZIRLIK_SURESI)
    return () => clearTimeout(sayac)
  }, [hazirlanan])

  if (hazirlanan) return <Hazirlaniyor ad={ad.trim()} />

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
          <KurulumMaskotu
            oncekiKutu={maskotKutusu}
            adimAnahtari={suanki}
            durum="mutlu"
            boyut={BUYUK_MASKOT}
            gizli={maskotGizli}
            yuvaMi
          />
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
    return (
      <TanismaEkrani
        ad={ad}
        maskotGizli={maskotGizli}
        oncekiKutu={maskotKutusu}
        adimAnahtari={suanki}
        onDevam={devamEt}
      />
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pt-[calc(1.5rem+var(--guvenli-ust))] pb-[calc(2rem+var(--guvenli-alt))]">
      {/*
        İlerleme çubuğu — eskiden alttaki nokta şeridiydi.

        İki sebep: nokta sayısı arttıkça "ne kadar kaldı" sayılmadan
        okunmuyordu, ve şerit ekranın altında Devam düğmesinin de altında
        kalıyordu — göz oraya en son gidiyor. Çubuk üstte, ilk bakılan yerde;
        kazanılan yükseklik de içeriğe gidiyor.
      */}
      <div className="h-1 overflow-hidden rounded-full bg-border" aria-hidden>
        <div
          className="h-full rounded-full bg-primary-dolu transition-[width] duration-300 ease-out"
          style={{ width: `${ilerlemeYuzdesi}%` }}
        />
      </div>

      {/*
        Soruyu Rabi soruyor.

        Başlık ortalanmış bir sayfa başlığıydı ve maskot onun üstünde 110
        pikselde duruyordu. Şimdi maskot 76'ya inip sola geçiyor, soru da onun
        konuşma balonunda ve sola hizalı: satır okunduğu yerde başlıyor ve
        soru "ekranın başlığı" değil "Rabi'nin sorusu" gibi duruyor.
      */}
      <div className="mb-5 mt-5 flex items-start gap-2.5">
        <KurulumMaskotu
          oncekiKutu={maskotKutusu}
          adimAnahtari={suanki}
          durum={siradaki === sonAdim ? 'mutlu' : 'normal'}
          boyut={KUCUK_MASKOT}
          gizli={maskotGizli}
          yuvaMi
        />
        <div className="golge-kart relative min-w-0 flex-1 rounded-[22px] bg-card p-4 text-card-foreground">
          {/* Balonun kuyruğu: kartla aynı renkte, 45° çevrilmiş bir kare.
              Yazıların `relative` olması şart — kuyruk konumlanmış bir öğe ve
              onların üstüne binerdi. */}
          <span
            aria-hidden
            className="absolute -left-[5px] top-6 h-3 w-3 rotate-45 bg-card"
          />
          <h1 className="relative font-display text-[19px] leading-tight font-extrabold tracking-tight text-pretty">
            {ADIM_BILGISI[suanki].baslik}
          </h1>
          <p className="relative mt-1 text-[13px] leading-normal font-medium text-muted-foreground">
            {suanki === 'notlar' && !mezun
              ? 'Biten yılların notu OBP tahminine giriyor. İstersen bu adımı atla.'
              : ADIM_BILGISI[suanki].aciklama}
          </p>
        </div>
      </div>

      {/* Sınıf, alan ve notlar adımları kartın dışında duruyor: üçünde de
          seçenekler/satırlar zaten birer kart, onları bir kartın içine koymak
          iç içe iki çerçeve demek olurdu. */}
      {suanki === 'sinif' ? (
        <SecimKartlari
          etiket="Bu yıl kaçıncı sınıftasın?"
          secenekler={SINIF_SECENEKLERI.map((s) => ({ deger: s, ad: sinifAdi(s) }))}
          secili={sinif}
          onSec={setSinif}
        />
      ) : suanki === 'alan' ? (
        <SecimKartlari
          etiket="Hangi alandasın?"
          secenekler={PUAN_TURLERI.map((tur) => ({ deger: tur.id, ad: tur.ad }))}
          secili={alanSecildi ? (puanTuru ?? ALANSIZ) : null}
          onSec={(deger) => {
            setAlanSecildi(true)
            setPuanTuru(deger === ALANSIZ ? null : deger)
          }}
        />
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
        /* Tekerlekli iki adımda kart kalan boşlukta ortalanıyor (`my-auto`):
           tek bir tekerlek balonun hemen altına yapıştığında ekranın altı
           kocaman boş kalıyordu. İsim ve bölüm adımlarında kart yukarıda
           kalıyor — orada içerik yazıldıkça uzuyor. */
        <Kart className={cn((suanki === 'hedef' || suanki === 'hatirlatma') && 'my-auto')}>
          {suanki === 'isim' && (
            <div>
              {/* Uyarı etiketin sağında, alanın hemen üstünde duruyor: göz
                  alandan yukarı kaydığında ilk gördüğü yer burası. Açılır
                  pencere kullanılmadı — kullanıcıyı akıştan koparırdı. */}
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <Etiket htmlFor="kurulum-ad" className="mb-0">
                  Adın
                </Etiket>
                {!adGecerli && (
                  <span
                    id="kurulum-ad-uyari"
                    role={adUyarisi ? 'alert' : undefined}
                    className={cn(
                      'flex items-center gap-1 text-xs font-medium',
                      adUyarisi ? 'text-danger' : 'text-muted-foreground',
                    )}
                  >
                    {adUyarisi && <AlertCircle size={13} aria-hidden className="shrink-0" />}
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
                  // İlk harf büyütülüyor: `autoCapitalize` yalnızca klavyeye
                  // verilen bir ipucu ve her klavye onu dinlemiyor.
                  onChange={(e) => setAd(adBiciminde(e.target.value))}
                  placeholder="Adını yaz"
                  aria-invalid={adUyarisi}
                  aria-describedby={!adGecerli ? 'kurulum-ad-uyari' : undefined}
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
                      <Liste
                        bos={
                          alanSuzgeci
                            ? 'Alanına uyan böyle bir bölüm bulamadım.'
                            : 'Bu üniversitede böyle bir bölüm bulamadım.'
                        }
                      >
                        {bolumSonuclari.map((b) => (
                          <SecimSatiri
                            key={b.id}
                            baslik={b.ad}
                            alt={`${PUAN_TURU_ADI[b.puanTuru]} · ${b.sure} yıl`}
                            onSec={() => bolumSec(b)}
                          />
                        ))}
                      </Liste>
                      {/* Anahtar yalnızca süzgeç varken görünüyor: kararsız
                          öğrenciye zaten bütün liste açık ve "alan dışı"nın
                          karşılığı yok. */}
                      {puanTuru !== null && (
                        <button
                          type="button"
                          onClick={() => setAlanDisiniGoster((a) => !a)}
                          className="mt-2 w-full rounded-lg py-1 text-center text-[13px] font-bold text-ikincil transition active:opacity-70"
                        >
                          {alanDisiniGoster
                            ? 'Yalnızca alanımdaki bölümler'
                            : 'Alanım dışındaki bölümleri de göster'}
                        </button>
                      )}
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
            /* Sistemin `<input type="time">` seçicisi yerine kendi
               tekerleğimiz: telefon İngilizceyse orası AM/PM gösteriyor,
               uygulamanın geri kalanı 24 saatlik "20.00" biçiminde.

               "Şu an seçili" satırı yok: seçilen saat tekerleğin ortasında
               zaten duruyor. */
            <SaatSecici
              saat={saat}
              dakika={dakika}
              onDegis={({ saat: s, dakika: d }) => {
                setSaat(s)
                setDakika(d)
              }}
            />
          )}

        </Kart>
      )}

      {/*
        Boşluk yalnızca içeriği yukarıda duran adımlarda.

        Ötekilerde içerik kendi `my-auto`suyla ortalanıyor ve otomatik kenar
        boşluğu ancak **artan** yeri paylaşıyor: burada duran bir `flex-1`
        artanı önce kendi alıyor, liste de ekranın tepesine yapışıp altında
        kocaman bir boşluk bırakıyordu.
      */}
      {(suanki === 'isim' || suanki === 'bolum') && <div className="flex-1" aria-hidden />}

      {/*
        Atlama işareti düğmelerin **hemen üstünde**: kullanıcının gözü önce
        pasif Devam düğmesine gidiyor, oradan yukarı kayıyor. Eskiden notlar
        adımında Devam'ın yanında "Şimdilik atla" diye ikinci bir düğme vardı;
        iki düğmeli bir satır hangisinin ileri götürdüğünü belirsiz bırakıyordu
        ve bölüm adımında karşılığı hiç yoktu — orası sessizce boş geçiliyordu.
      */}
      {suanki === 'bolum' && (
        <SonraSec
          isaretli={bolumSonra}
          onDegis={setBolumSonra}
          etiket="Hedefimi daha sonra seçeceğim"
          alt="Hedefim ekranından istediğin zaman ekleyebilirsin."
        />
      )}
      {suanki === 'notlar' && (
        <SonraSec
          isaretli={notlarSonra}
          onDegis={setNotlarSonra}
          etiket="Notlarımı daha sonra gireceğim"
          alt="Okulum ekranından sonradan girebilirsin; OBP tahmini o zaman açılır."
        />
      )}

      <div className="mt-5 flex items-center gap-2">
        {siradaki > 0 && (
          <Buton bicim="ikincil" boy="simge" onClick={geri} aria-label="Geri">
            <ArrowLeft size={18} aria-hidden />
          </Buton>
        )}
        <Buton className="flex-1" onClick={devamEt} disabled={!devamEdilebilir}>
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
    </div>
  )
}


/**
 * "Daha sonra seçerim" satırı.
 *
 * Düğme değil onay kutusu: düğme ekranı ileri götürür, bu ise adımın cevabını
 * "şimdilik yok" yapıyor — ileri götüren şey yine Devam. İşaret konduğunda
 * adımın kutuları boş kalabiliyor ve Devam açılıyor.
 */
function SonraSec({
  isaretli,
  onDegis,
  etiket,
  alt,
}: {
  isaretli: boolean
  onDegis: (deger: boolean) => void
  etiket: string
  alt: string
}) {
  return (
    <label
      className={cn(
        'mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition',
        isaretli ? 'border-primary bg-primary-soft' : 'border-border bg-card',
      )}
    >
      <input
        type="checkbox"
        checked={isaretli}
        onChange={(e) => onDegis(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--primary)]"
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{etiket}</span>
        <span className="block text-xs text-muted-foreground">{alt}</span>
      </span>
    </label>
  )
}

/** Ortada duran maskotun boyu — karşılama ve tanışma ekranları. */
const BUYUK_MASKOT = 150
/** Balonun yanındaki maskotun boyu — soru soran ekranlar. */
const KUCUK_MASKOT = 76
/**
 * Maskotun bir adımdan ötekine uçma süresi.
 *
 * CSS'te değil burada: geçiş JS'ten kuruluyor (uçuşun mesafesi ölçülerek
 * bulunuyor), iki yerde iki ayrı sayı tutmak ikisinin ayrı düşmesi demekti.
 */
const MASKOT_UCUS_SURESI = 460

/**
 * Adımdan adıma uçan maskot.
 *
 * Kurulumda tavşan üç ayrı düzende görünüyor: karşılamada ekranın ortasında
 * 150 pikselde, soru ekranlarında sol üstte 76'da, tanışmada yine ortada.
 * Ekranlar ayrı ağaçlar olduğu için tavşan her adımda sökülüp yeniden
 * kuruluyordu ve kullanıcı iki ekran arasında onu **ışınlanırken** görüyordu:
 * ortadaki büyük tavşan bir karede sol üstteki küçük tavşana dönüşüyordu.
 *
 * Çözüm ölçmek. Maskot her yerleştiğinde kendi kutusunu `oncekiKutu`ya
 * yazıyor; bir sonraki adımda yeni kutusunu ölçüp aradaki farkı **ters**
 * dönüşüm olarak uyguluyor (yani bir kare boyunca eski yerinde ve eski boyunda
 * duruyor), sonra dönüşümü kaldırıyor ve tarayıcı aradaki yolu kendi kat
 * ediyor. Varış noktası yazılmıyor, ölçülüyor — açılış ekranındaki kuralın
 * aynısı: yazılmış bir koordinat düzen değişince bayatlıyor.
 *
 * Ters dönüşüm `useLayoutEffect` içinde konuyor: boyamadan önce çalışmazsa
 * kullanıcı tavşanı bir kare varış noktasında görür, uçuş oradan başlar.
 *
 * İki `requestAnimationFrame` şart: geçişin çalışması için tarayıcının ters
 * dönüşümlü hâli gerçekten bir kez boyamış olması gerekiyor. Tek karede
 * hem başlangıç hem bitiş yazılırsa tarayıcı yalnızca sonuncusunu görür ve
 * hareket hiç olmaz.
 */
function KurulumMaskotu({
  oncekiKutu,
  adimAnahtari,
  durum,
  poz,
  boyut,
  gizli,
  yuvaMi,
}: {
  oncekiKutu: RefObject<DOMRect | null>
  /** Değiştiğinde uçuş kuruluyor; aynı adımdaki çizimler tavşana dokunmuyor. */
  adimAnahtari: string
  durum: 'normal' | 'mutlu'
  poz?: 'yuz' | 'el-sallayan'
  boyut: number
  gizli: boolean
  yuvaMi?: boolean
}) {
  const sarmalRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const oge = sarmalRef.current
    if (!oge) return

    /*
      Ölçmeden önce eski dönüşüm siliniyor.

      Kullanıcı Devam'a arka arkaya basarsa bir önceki uçuş hâlâ sürüyor
      olabiliyor ve `getBoundingClientRect` dönüşümlü kutuyu döndürüyor —
      ölçüm o zaman tavşanın durduğu yeri değil yolun ortasını yazardı.
    */
    oge.style.transition = 'none'
    oge.style.transform = ''

    const yeni = oge.getBoundingClientRect()
    const onceki = oncekiKutu.current
    // Kutu her adımda yenileniyor: uçuş bitmese de kayıtta duran şey tavşanın
    // **durduğu** yer olmalı, uçuşun ortasındaki bir ara kare değil.
    oncekiKutu.current = yeni
    if (!onceki || yeni.width === 0) return

    const dx = onceki.left - yeni.left
    const dy = onceki.top - yeni.top
    const olcek = onceki.width / yeni.width
    // Yerinde duran maskot için geçiş kurmak, hiç oynamayan bir animasyon
    // demek; ekran de öyle kalıyor.
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(olcek - 1) < 0.01) return
    // Bu hareket bilgi taşımıyor — nerede olduğunu zaten düzen söylüyor.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    oge.style.transform = `translate(${dx}px, ${dy}px) scale(${olcek})`

    let salindi = false
    const sal = () => {
      if (salindi) return
      salindi = true
      oge.style.transition = `transform ${MASKOT_UCUS_SURESI}ms cubic-bezier(0.22, 1, 0.36, 1)`
      oge.style.transform = ''
    }

    let ikinciKare = 0
    const ilkKare = requestAnimationFrame(() => {
      ikinciKare = requestAnimationFrame(sal)
    })
    /*
      Emniyet zamanlayıcısı: `requestAnimationFrame` sayfa görünür değilken hiç
      çağrılmıyor. Uygulama arka plandayken adım değişirse (bildirimden dönmek
      gibi) tavşan ters dönüşümle, yani eski yerinde asılı kalırdı. Zamanlayıcı
      arka planda yavaşlıyor ama **çalışıyor**; kare gelmezse uçuşu o salıyor.
    */
    const emniyet = setTimeout(sal, 200)

    return () => {
      cancelAnimationFrame(ilkKare)
      cancelAnimationFrame(ikinciKare)
      clearTimeout(emniyet)
    }
  }, [adimAnahtari, oncekiKutu])

  return (
    /*
      Sarmalayıcı şart: uçan şey `transform` alan bir kutu ve maskotun kendisi
      ölçüsünü `width`/`height` ile veriyor — dönüşümü doğrudan ona koymak,
      açılış ekranının ölçtüğü öğeyi de oynatırdı.

      `z-10`: uçuşun ortasında büyümüş tavşan konuşma balonunun üstünden
      geçiyor; balon DOM'da sonra geldiği için katman verilmezse onun altında
      kalırdı.
    */
    <span
      ref={sarmalRef}
      className="relative z-10 inline-flex shrink-0"
      style={{ transformOrigin: 'top left' }}
    >
      <Rabi durum={durum} poz={poz} boyut={boyut} gizli={gizli} yuvaMi={yuvaMi} />
    </span>
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
 * Tanışma — kurulumun kutlama ekranı.
 *
 * Karşılamayla aynı düzeni **paylaşmıyor** (`TekIsliEkran`): orası sakin bir
 * giriş, burası adı öğrendikten sonraki karşılama anı. Üç noktalı gösterge
 * yalnızca burada; ikisini tek bileşende toplamak, yarısı kullanılmayan bir
 * sürü propla biten bir bileşen olurdu.
 *
 * Zemin uygulamanın geri kalanıyla aynı. Bir süre degrade bir zemin, altın
 * halkalı bir madalyon ve "Aramıza hoş geldin" rozeti vardı; üçü de kalktı.
 * Ekranın tek işi adı geri söylemek ve onun etrafındaki her katman o cümleyi
 * bastırıyordu.
 *
 * Süs olarak bir süre sekiz emoji (🐾 ✨ 🥕 …) zemine serpiliyordu; kullanıcı
 * hepsini kaldırttı. Sebebi hareket değil kalabalık: ekranda tek bir cümle var
 * ve etrafına serpilen simgeler cümleyi taşımıyor, ondan dikkat çalıyordu.
 * Yerine **tek** bir süs kondu — adın altına çekilen, çizilerek beliren bir
 * kalem hattı (`tanisma-hat`). Cümleyi çevrelemiyor, altını çiziyor: süs
 * dikkati dağıtmak yerine bakılacak yeri gösteriyor. Yeni bir süs eklemeden
 * önce şunu sor — eklenen şey adı mı öne çıkarıyor, yoksa onunla mı
 * yarışıyor?
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
  oncekiKutu,
  adimAnahtari,
  onDevam,
}: {
  ad: string
  maskotGizli: boolean
  oncekiKutu: RefObject<DOMRect | null>
  adimAnahtari: string
  onDevam: () => void
}) {
  const temizAd = ad.trim()

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-md flex-col overflow-hidden px-5 pt-[calc(2rem+var(--guvenli-ust))] pb-[calc(1.5rem+var(--guvenli-alt))]">
      <div className="flex-[0.9]" aria-hidden />

      <div className="flex flex-col items-center text-center">
        {/* Maskot karşılama ekranıyla aynı ölçüde (150): iki ekran arka arkaya
            geliyor ve tavşanın ekrandan ekrana büyüyüp küçülmesi geçişi
            kesiyordu. Halkalı madalyon da kalktı — çember degradenin üstünde
            maskotu zeminden ayırmak için vardı, düz zeminde tavşanın etrafına
            çizilmiş bir çerçeveye dönüşüyor. */}
        <KurulumMaskotu
          oncekiKutu={oncekiKutu}
          adimAnahtari={adimAnahtari}
          durum="mutlu"
          poz="el-sallayan"
          boyut={BUYUK_MASKOT}
          gizli={maskotGizli}
        />

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

        {/*
          Ekranın tek süsü: adın altına elle çekilmiş gibi duran bir hat.

          Çizilerek beliriyor (`tanisma-hat`), yani hareket cümleyi işaret
          ediyor — ekrana serpilen ve kendi başına oynayan süslerin tersine.
          Genişliği sabit ve ortalı: başlık iki satıra düşse de hat cümlenin
          altında kalıyor, bir kelimenin altını çizmeye çalışmıyor.
        */}
        <svg
          aria-hidden
          className="tanisma-hat mt-4 text-primary-parlak"
          width="132"
          height="12"
          viewBox="0 0 132 12"
          fill="none"
        >
          <path
            d="M3 8.4C25 4 47 2.6 68 4.2C89 5.8 110 7.6 129 4.6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <p className="mt-4 max-w-[19rem] text-[14.5px] leading-snug font-medium text-balance text-muted-foreground">
          Bundan sonra birlikteyiz — küçük adımlarla güzel şeyler yapacağız.
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
 * Tek seçimlik büyük kart listesi — sınıf ve alan adımları bunu kullanıyor.
 *
 * İkisi de "bir tane seç" sorusu ve arka arkaya geliyor; ayrı ayrı çizilseler
 * kullanıcı iki adımda iki farklı form diliyle karşılaşırdı.
 *
 * Seçim tek göstergeyle anlatılıyor: turuncu dolgu. Tik ya da kutucuk yok,
 * çünkü dolu turuncu kartın seçili olduğu bir bakışta belli; ikon aynı bilgiyi
 * ikinci kez söyleyip listeyi kalabalıklaştırırdı.
 *
 * Seçili kart bir tık büyüyor (`scale`) — düzeni kaydırmayan, yalnızca göze
 * "burası" diyen kadarı. Yükseklikler `min-h` ile veriliyor ki yazı tipi
 * büyütülmüş telefonlarda kart taşmak yerine uzasın.
 */
function SecimKartlari<T extends string | number>({
  etiket,
  secenekler,
  secili,
  onSec,
}: {
  /** Ekran okuyucuya sorulan soru; başlıkla aynı cümle. */
  etiket: string
  secenekler: { deger: T; ad: string }[]
  /** Hiçbiri seçilmediyse `null`: kullanıcının vermediği cevap seçili görünmez. */
  secili: T | null
  onSec: (deger: T) => void
}) {
  return (
    /* `my-auto`: kartlar kalan boşlukta dikey ortalanıyor. Üstte maskot,
       altta Devam dururken listenin tepeye yapışması sayfayı dengesiz
       gösteriyordu. */
    <div className="my-auto space-y-2.5" role="radiogroup" aria-label={etiket}>
      {secenekler.map((secenek) => {
        const bu = secili === secenek.deger
        return (
          <button
            key={String(secenek.deger)}
            type="button"
            role="radio"
            aria-checked={bu}
            onClick={() => onSec(secenek.deger)}
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
              {secenek.ad.toLocaleUpperCase('tr-TR')}
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
                    // Yer tutucu odaklanınca kayboluyor. Uzun tire ortada
                    // duruyor ve metin imleci de ortada beliriyor; ikisi üst
                    // üste gelince ekranda artı işareti gibi görünüyordu.
                    'focus:placeholder:text-transparent',
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
                  // Tire + imleç artı görünüyordu; yıl notu alanındaki notun
                  // aynısı.
                  'focus:placeholder:text-transparent',
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
