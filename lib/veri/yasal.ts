/**
 * Uygulamanın yasal metinleri — gizlilik politikası, kullanıcı sözleşmesi ve
 * "cihazdan ne çıkıyor" özeti.
 *
 * Metinler burada duruyor, ekranda değil: Ayarlar'a serpiştirilmiş dört beş
 * paragraf hem ayar listesini uzatıyor hem de aranan bir cümlenin nerede
 * olduğunu belirsizleştiriyordu. Google Play'in Data Safety formu ile
 * mağazadaki gizlilik politikası bağlantısı da aynı metne bakıyor; tek
 * kaynaktan okunmazsa üçü zamanla birbirinden ayrışır.
 *
 * **Biçim düz metin.** Paragraf dizisi ve isteğe bağlı alt başlık — Markdown
 * ayrıştırıcısı yok. Kalın/eğik yazı, bağlantı ya da liste gerekiyorsa metni
 * o gereksinim olmadan yazmak daha ucuz; bir ayrıştırıcı eklemek, uygulamaya
 * yalnızca üç sayfa için bir biçimlendirme dili sokmak olurdu.
 *
 * `yururlukTarihi` gösteriliyor: sözleşme değiştiğinde kullanıcının hangi
 * sürümü kabul ettiğini bilmesi gerekiyor.
 */

export type YasalBelgeId = 'gizlilik' | 'sozlesme' | 'veri-ozeti'

export type YasalBolum = {
  /** Alt başlık; yoksa paragraflar doğrudan akar. */
  baslik?: string
  paragraflar: string[]
}

export type YasalBelge = {
  id: YasalBelgeId
  /** Listede ve ekran başlığında görünen ad. */
  ad: string
  /** Liste satırının altındaki tek satırlık tanım. */
  ozet: string
  /**
   * Metnin yürürlüğe girdiği gün (ISO, `YYYY-AA-GG`).
   *
   * Boş bırakılırsa ekran tarih satırını hiç çizmiyor — metin henüz
   * yazılmamışken uydurma bir tarih göstermek, olmayan bir sözleşmeye
   * yürürlük tarihi vermek olurdu.
   */
  yururlukTarihi?: string
  bolumler: YasalBolum[]
}

/**
 * Gizlilik politikası.
 *
 * Metnin **ikinci bir kopyası** `public/gizlilik/index.html` içinde duruyor ve
 * o dosya GitHub Pages'e yayımlanıp Play Console'a bağlantı olarak veriliyor:
 * Play hem herkese açık bir adres hem uygulama içinden erişim istiyor, ikisi
 * bir arada olamıyor. İki kopya **birlikte güncellenmeli** — Play'in kullanıcı
 * verisi politikası Data Safety formu, mağazadaki bağlantı ve uygulama içindeki
 * metnin aynı şeyi söylemesini şart koşuyor.
 *
 * Buradaki sürüm düz metin, oradaki HTML; fark yalnızca biçimde. Bir bölüm
 * eklenir ya da bir alan değişirse ikisine de yazılacak.
 */
const GIZLILIK: YasalBelge = {
  id: 'gizlilik',
  ad: 'Gizlilik Politikası',
  ozet: 'Hangi veriyi tutuyoruz, nereye gidiyor',
  yururlukTarihi: '2026-09-06',
  bolumler: [
    {
      paragraflar: [
        'Bu belge, Rabi’nin hangi bilgilere eriştiğini, bunları ne için kullandığını, telefonundan neyin çıktığını ve nasıl sildirebileceğini anlatır. Uygulama: Rabi (com.fluxifyinteractive.rabi). Geliştirici: Fluxify Interactive.',
        'Kısaca: Rabi’nin sunucusu yok. Denemelerin, notların, fotoğrafların, puanların ve adın telefonundan hiç çıkmaz. Ağa çıkan yalnızca iki şey var ve ikisi de sen izin verene kadar gerçekleşmez: hatalı bir soruyu bildirmen ve uygulama çöktükten sonra çökme kaydını göndermeyi seçmen. Reklam yok, kullanım analizi yok, hesap yok, giriş yok.',
      ],
    },
    {
      baslik: '1. Telefonunda kalan veriler',
      paragraflar: [
        'Rabi’nin kullandığı verinin neredeyse tamamı yalnızca telefonunda, uygulamanın kendi özel alanında durur. Hiçbir sunucuya gönderilmez; Fluxify Interactive bunları göremez.',
        'Telefonunda duranlar: ayarlarda yazdığın ad, sınıfın, alanın ve hedeflerin; deneme sonuçların, netlerin, şablonların, okul notların ve devamsızlığın; yanlış soru kayıtların ve bunlara eklediğin fotoğraflar; çalışma sayacı geçmişin, günlük kayıtların ve başarımların; mini oyun istatistiklerin, Oyun Bankası’n ve zorluk tercihlerin; yapılacaklar tahtasındaki notların; odak kilidinde seçtiğin uygulama listesi; ve cihazına verilen rastgele takma ad.',
        'Uygulamayı silersen bunların tamamı telefonundan silinir. Uygulama içinden de Ayarlar’daki “Tüm veriyi sil” ile temizleyebilirsin. Yedek alırsan dosya senin telefonuna iner; onu kiminle paylaşacağına yalnızca sen karar verirsin.',
      ],
    },
    {
      baslik: '2. Kamera, fotoğraflar ve metin okuma',
      paragraflar: [
        'Yanlış soru eklerken veya deneme kâğıdını okuturken telefonunun kamerası ya da galerisi açılır. İki durum birbirinden farklıdır: yanlış soru fotoğrafı uygulamanın kendi deposuna kaydedilir ve orada kalır, kaydı silersen fotoğraf da silinir; deneme kâğıdı fotoğrafı ise hiç saklanmaz, yalnızca kâğıttaki sayıları okumak için kullanılır ve okuma bitince atılır.',
        'Kâğıttaki yazıyı okuyan metin tanıma modeli uygulamanın içine gömülüdür; okuma tümüyle telefonda yapılır ve uçak modunda da çalışır. Hiçbir fotoğraf, hiçbir zaman internete yüklenmez — ne bize ne bir bulut servisine. Rabi galerinin geri kalanını taramaz; yalnızca sistem seçicisinde senin seçtiğin fotoğrafı alır.',
      ],
    },
    {
      baslik: '3. Telefonundan çıkan ilk şey: hatalı soru bildirimi',
      paragraflar: [
        'Sorular elle yazıldı; içlerinde yanlış cevap veya bozuk yazım olabilir. Bir sorunun yanındaki bayrağa basıp sebep seçersen o bildirim bize ulaşır ve soruyu düzeltiriz.',
        'Bildirim kendiliğinden oluşmaz: bayrağa basman ve bir sebep seçmen gerekir. İlk bildirimde ekranda ne gönderileceğinin listesi çıkar ve “Gönder” demeden hiçbir şey telefonundan çıkmaz. “Gönderme” dersen bildirim telefonunda kalır; kararını aynı yerdeki “Yine de gönder” ile sonradan değiştirebilirsin. İnternet yoksa bildirim bekler, bağlanınca gider. Günde en fazla 20 bildirim açılabilir.',
        'Gönderilen tam liste yedi alandır: sorunun havuzdaki kimliği; sorunun hangi oyundan geldiği; sorunun metni; uygulamanın doğru saydığı cevap; senin seçtiğin sebep; uygulama sürümü; telefonunun üreticisi ve modeli, yanında cihazına verilen rastgele takma ad.',
        'Model bilgisi, bazı arızaların yalnızca belirli ekran ölçülerinde çıkması yüzünden var. Takma ad rastgele üretilir, adınla ya da hesabınla ilgisi yoktur; tek işi aynı telefondan gelen bildirimleri tabloda gruplamaktır. Bu ad kalıcı olduğu için Google Play’in sınıflandırmasında “cihaz veya diğer kimlikler” kategorisine girer ve Data Safety formunda böyle beyan edilir.',
        'Bu bildirimde gönderilmeyenler: adın, e-postan, telefon numaran, konumun, denemelerin ve netlerin, okul notların, yapılacaklar notların, fotoğrafların, çalışma süren, oyun puanların, kilitli uygulama listen, rehberin, mesajların.',
        'Bildirim, bize ait bir Google Formu’na gönderilir ve yanıtlar Google’ın sunucularındaki bir tabloda toplanır. Bağlantı HTTPS ile şifrelenir.',
      ],
    },
    {
      baslik: '4. Telefonundan çıkan ikinci şey: çökme raporu',
      paragraflar: [
        'Uygulama beklenmedik şekilde kapanırsa hatanın kaydı telefonunda tutulur. Kendiliğinden hiçbir yere gitmez: otomatik gönderim uygulamanın içinde kalıcı olarak kapalıdır. Bir sonraki açılışta sana sorulur — “Gönder” dersen kayıt gider, “Gönderme” dersen telefonundan silinir. Bu soru her çökmeden sonra tek tek sorulur; önceden verilmiş kalıcı bir izin yoktur.',
        'Gönderdiğinde giden kayıt şunları içerir: hatanın teknik dökümü, uygulama sürümü ve derleme türü, Android sürümü ve cihazdaki Android System WebView sürümü, telefonun üreticisi ve modeli, ve çökme aracının kendi eklediği teknik bilgiler — cihaza özel rastgele bir kurulum numarası ile cihaz durumu (bellek ve disk doluluğu, ekran yönü, root durumu, işlemci mimarisi).',
        'Bu kayıtta adın, denemelerin, notların, fotoğrafların ve puanların yer almaz. Çökme raporları Google Firebase Crashlytics üzerinden toplanır.',
      ],
    },
    {
      baslik: '5. İzinler ve neden isteniyor',
      paragraflar: [
        'İnternet izni yalnızca yukarıdaki iki gönderim için. Bildirim gönderme izni çalışma hatırlatması ve pomodoro sayacı için; bildirimler telefonunda üretilir, dışarı çıkmaz. Kamera ve galeri sistem seçicisi üzerinden açılır.',
        'Odak kilidi üç izin kullanır ve hiçbirinden okunan bilgi telefondan çıkmaz: kullanım verisi erişimi hangi uygulamanın ön planda olduğunu anlamak için, diğer uygulamaların üzerinde gösterme uyarı katmanı için, ön plan servisi ise pomodoro turu boyunca kilidi ayakta tutmak için.',
        'Bildirim erişimi izni isteğe bağlıdır: kilitli uygulamaların bildirimlerini susturur, vermezsen odak kilidinin geri kalanı çalışmaya devam eder. Bildirimlerin içeriği okunmaz, saklanmaz, gönderilmez — yalnızca hangi uygulamadan geldiğine bakılır.',
        'Kurulu uygulamaları görme izni odak kilidinde engellenecek uygulamaları listelemek için. Titreşim, uyanık tutma, açılışta başlama ve tam zamanlı alarm izinleri sayaç ile hatırlatmaların doğru saatte çalışması için. Kullanım verisi ve ekran üstü gösterme izinlerini telefonunun ayarlarından istediğin zaman geri alabilirsin.',
      ],
    },
    {
      baslik: '6. Üçüncü taraflar',
      paragraflar: [
        'Rabi’nin veri gönderdiği tek şirket Google’dır ve yalnızca iki durumda: hatalı soru bildirimlerinin toplandığı Google Forms ile gönderdiğin çökme raporlarının toplandığı Firebase Crashlytics. Google bu verileri bizim adımıza ve talimatımızla işler. Google’ın gizlilik politikası: policies.google.com/privacy',
        'Rabi’de reklam ağı yoktur, kullanım analizi aracı yoktur, reklam kimliği okunmaz ve davranışını izleyen başka bir araç bulunmaz. Hiçbir veri satılmaz, kiralanmaz veya pazarlama amacıyla paylaşılmaz. Uygulamada hesap, giriş veya üyelik yoktur.',
      ],
    },
    {
      baslik: '7. Güvenlik',
      paragraflar: [
        'Telefondaki veriler işletim sisteminin uygulamalara ayırdığı özel alanda tutulur; başka uygulamalar buraya erişemez. Dışarı çıkan iki gönderim de HTTPS/TLS ile şifrelenerek iletilir; şifresiz bağlantı kullanılmaz.',
        'Bize ulaşan verilere yalnızca uygulamayı geliştiren kişi erişir ve bunlar yalnızca soruları düzeltmek ile hataları gidermek için kullanılır. Bizim işlettiğimiz bir sunucu ya da veri tabanı yoktur.',
      ],
    },
    {
      baslik: '8. Saklama ve silme',
      paragraflar: [
        'Telefonundaki veriler sen silene kadar durur. Ayarlar’daki “Tüm veriyi sil” hepsini temizler; uygulamayı kaldırmak da aynı sonucu verir.',
        'Bize ulaşan hatalı soru bildirimleri, soru düzeltilene kadar tutulur ve sonra tablodan silinir. Daha önce silinmesini istersen aşağıdaki adrese yaz — hangi soruları ve yaklaşık hangi tarihlerde bildirdiğini yazman yeterli. Talepler en geç 30 gün içinde sonuçlandırılır.',
        'Firebase Crashlytics, çökme kayıtlarını ve bunlara bağlı kurulum numaralarını 90 gün sonra silmeye başlar. Bir raporun daha önce silinmesini istersen bize yaz.',
        'Silme talebi için fluxifyinteractive@gmail.com adresine, konuya “Rabi veri silme” yazarak ulaşabilirsin. Rabi’de hesap olmadığı için silinecek bir hesabın yoktur; silinebilecek tek şey yukarıdaki iki kayıt türüdür.',
      ],
    },
    {
      baslik: '9. Çocuklar ve gençler',
      paragraflar: [
        'Rabi lise öğrencileri için tasarlandı ve 13 yaşından küçüklere yönelik değildir. Rabi kimseden ad, e-posta, telefon, konum veya doğum tarihi istemez; hesap açtırmaz, reklam göstermez, kullanıcı profili çıkarmaz ve kimseyi izlemez. Ayarlardaki ad alanı isteğe bağlıdır, boş bırakılabilir ve yazılsa bile telefondan çıkmaz.',
        'Veli veya vasiysen ve çocuğuna ait bir kaydın silinmesini istiyorsan 8. bölümdeki adrese yazman yeterlidir.',
      ],
    },
    {
      baslik: '10. Haklarınız',
      paragraflar: [
        '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuat kapsamında; hakkında veri işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, düzeltilmesini veya silinmesini isteme haklarına sahipsin. Bu haklarını kullanmak için fluxifyinteractive@gmail.com adresine yazabilirsin.',
        'Rabi ad, e-posta veya hesap bilgisi toplamadığı için bize ulaşan kayıtların hangisinin sana ait olduğunu kendiliğimizden bulamıyoruz; talebinde bildirimi yaptığın yaklaşık tarihi ve soruları belirtirsen kaydı bulup silebiliriz.',
      ],
    },
    {
      baslik: '11. Bu politikadaki değişiklikler',
      paragraflar: [
        'Uygulamaya veri gönderen yeni bir özellik eklenirse bu metin güncellenir, yürürlük tarihi değişir ve uygulamanın Google Play’deki Data Safety beyanı da aynı anda güncellenir. Önemli bir değişiklik olursa uygulama içinde de duyurulur.',
      ],
    },
    {
      baslik: '12. İletişim',
      paragraflar: [
        'Uygulama: Rabi (com.fluxifyinteractive.rabi). Geliştirici: Fluxify Interactive. E-posta: fluxifyinteractive@gmail.com',
        'Gizlilik, veri silme veya bu politikayla ilgili her soru için bu adrese yazabilirsin.',
      ],
    },
    {
      baslik: '13. Sorumluluk reddi',
      paragraflar: [
        'Rabi bağımsız bir çalışma uygulamasıdır; ÖSYM ile ya da herhangi bir resmî kurumla bağlantısı yoktur, hiçbiri tarafından desteklenmez veya onaylanmaz.',
        'Uygulamadaki puan ve sıralama tahminleri, girdiğin verilerden yapılan yaklaşık hesaplardır; gerçek sınav sonucunu, puanını veya sıralamanı garanti etmez ve resmî bir değer taşımaz. Soru havuzundaki içerikler çalışma amaçlıdır ve hata içerebilir; fark ettiğin hataları uygulama içindeki bayrak düğmesiyle bildirebilirsin.',
      ],
    },
  ],
}

/**
 * Kullanıcı sözleşmesi.
 *
 * @todo Metin kullanıcıdan gelecek.
 */
const SOZLESME: YasalBelge = {
  id: 'sozlesme',
  ad: 'Kullanıcı Sözleşmesi',
  ozet: 'Uygulamayı kullanma koşulları',
  bolumler: [],
}

/**
 * Cihazdan ne çıkıyor — Ayarlar'daki iki bölümün taşındığı yer.
 *
 * Bu metin kullanıcıdan gelmiyor, uygulamanın kendi davranışını anlatıyor ve
 * koddaki gerçekle birlikte değişmesi gerekiyor: `lib/hata-gonder.ts` ile
 * `lib/cokme.ts` dışında ağa çıkan bir yol açılırsa buraya da yazılmalı.
 */
const VERI_OZETI: YasalBelge = {
  id: 'veri-ozeti',
  ad: 'Cihazından ne çıkıyor?',
  ozet: 'İnternete giden iki şey ve ikisi de sana sorularak gidiyor',
  bolumler: [
    {
      paragraflar: [
        'Rabi’nin sunucusu yok. Denemelerin, notların, fotoğrafların, puanların ve ayarların telefonunda duruyor; uygulama onları hiçbir yere göndermiyor. İnternete çıkan yalnızca iki şey var ve ikisi de sen izin vermeden gitmiyor.',
      ],
    },
    {
      baslik: 'Bildirdiğin hatalı sorular',
      paragraflar: [
        'Mini oyunlardaki bir soruyu hatalı bulup bildirdiğinde şunlar gönderiliyor: sorunun kendisi ve havuzdaki kimliği, hangi oyundan geldiği, uygulamanın doğru saydığı cevap, senin seçtiğin sebep, uygulama sürümü, telefonunun modeli ve cihazına verilen rastgele bir ad.',
        'Adın, e-postan, denemelerin, notların, fotoğrafların ve puanların gönderilmiyor. Bildirim önce cihaza kaydediliyor; internet yoksa bekliyor, bağlanınca kendiliğinden gidiyor.',
        'İlk bildiriminde ne gönderileceğini gösteren bir kart çıkıyor ve “Gönder” demeden hiçbir şey ağa çıkmıyor. “Gönderme” dersen bildirimlerin telefonunda kalıyor; aynı yerdeki “Yine de gönder” ile kararını sonradan değiştirebiliyorsun.',
      ],
    },
    {
      baslik: 'Çökme raporları',
      paragraflar: [
        'Uygulama çökerse hata kaydı telefonunda bekliyor; kendiliğinden hiçbir yere gitmiyor. Bir sonraki açılışta gönderilsin mi diye soruluyor — “Gönder” dersen gidiyor, “Gönderme” dersen siliniyor.',
        'Giden şey bir hata kaydı: hatanın hangi satırda olduğu, telefonunun modeli, Android ve uygulama sürümü. Adın, denemelerin, notların ve fotoğrafların gönderilmiyor.',
      ],
    },
  ],
}

/** Ekrandaki sıra: önce uygulamanın kendi davranışı, sonra iki yasal metin. */
export const YASAL_BELGELER: YasalBelge[] = [VERI_OZETI, GIZLILIK, SOZLESME]

/** Kimliğe göre belge; tanınmayan kimlikte `null`. */
export function yasalBelgeBul(id: string | null): YasalBelge | null {
  return YASAL_BELGELER.find((b) => b.id === id) ?? null
}

/** Metni henüz yazılmamış belge — ekran onu "hazırlanıyor" diye çiziyor. */
export function belgeHazirMi(belge: YasalBelge): boolean {
  return belge.bolumler.length > 0
}
