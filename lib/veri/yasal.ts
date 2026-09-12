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
  yururlukTarihi: '2026-09-12',
  bolumler: [
    {
      paragraflar: [
        'Bu belge, Rabi’nin hangi bilgilere eriştiğini, bunları ne için kullandığını, telefonundan neyin çıktığını ve nasıl sildirebileceğini anlatır. Uygulama: Rabi (com.fluxifyinteractive.rabi). Geliştirici: Fluxify Interactive.',
        'Kısaca: Rabi’nin sunucusu yok. Denemelerin, notların, fotoğrafların, puanların ve adın telefonundan hiç çıkmaz. Ağa çıkan yalnızca üç şey var ve üçü de sen izin verene kadar gerçekleşmez: hatalı bir soruyu bildirmen, uygulama çöktükten sonra çökme kaydını göndermeyi seçmen ve Ayarlar’daki “Öneri ve hata bildir” ekranından bize bir mesaj yazıp göndermen. Bunların dışında uygulama açılırken telefonundaki Google Play, Rabi’nin yeni bir sürümü olup olmadığına bakar; bu sorguyu Rabi değil Play yapar ve sana ait hiçbir bilgi taşımaz (bkz. 4b). Reklam yok, kullanım analizi yok, hesap yok, giriş yok.',
      ],
    },
    {
      baslik: '1. Telefonunda kalan veriler',
      paragraflar: [
        'Rabi’nin kullandığı verinin neredeyse tamamı yalnızca telefonunda, uygulamanın kendi özel alanında durur. Hiçbir sunucuya gönderilmez; Fluxify Interactive bunları göremez.',
        'Telefonunda duranlar: ayarlarda yazdığın ad, sınıfın, alanın ve hedeflerin; deneme sonuçların, netlerin, şablonların, okul notların ve devamsızlığın; yanlış soru kayıtların ve bunlara eklediğin fotoğraflar; çalışma sayacı geçmişin, günlük kayıtların ve başarımların; mini oyun istatistiklerin, Oyun Bankası’n ve zorluk tercihlerin; yapılacaklar tahtasındaki notların; odak kilidinde seçtiğin uygulama listesi; ve cihazına verilen rastgele takma ad.',
        'Uygulamayı silersen bunların tamamı telefonundan silinir. Uygulama içinden de Ayarlar’daki “Tüm veriyi sil” ile temizleyebilirsin. Android’in otomatik uygulama yedeği Rabi için kapalıdır: verin Google hesabına ya da telefon yedeğine kopyalanmaz, telefon değiştirdiğinde kendiliğinden taşınmaz. Yedek alırsan (Ayarlar’daki “Yedeği indir”) dosya telefonunun İndirilenler klasörüne iner; o klasörü başka uygulamalar da okuyabilir ve dosyayı kiminle paylaşacağına yalnızca sen karar verirsin.',
      ],
    },
    {
      baslik: '2. Kamera ve fotoğraflar',
      paragraflar: [
        'Yanlış soru eklerken telefonunun kamerası ya da galerisi sistemin kendi seçicisiyle açılır; Rabi kameraya doğrudan erişmez ve kamera izni istemez. Çektiğin ya da seçtiğin fotoğraf küçültülüp uygulamanın kendi deposuna kaydedilir ve orada kalır; kaydı silersen fotoğraf da silinir.',
        'Hiçbir fotoğraf, hiçbir zaman internete yüklenmez — ne bize ne bir bulut servisine. Rabi galerinin geri kalanını taramaz; yalnızca sistem seçicisinde senin seçtiğin fotoğrafı alır.',
      ],
    },
    {
      baslik: '3. Telefonundan çıkan ilk şey: hatalı soru bildirimi',
      paragraflar: [
        'Sorular elle yazıldı; içlerinde yanlış cevap veya bozuk yazım olabilir. Bir sorunun yanındaki bayrağa basıp sebep seçersen o bildirim bize ulaşır ve soruyu düzeltiriz.',
        'Bildirim kendiliğinden oluşmaz: bayrağa basman ve bir sebep seçmen gerekir. İlk bildirimde ekranda ne gönderileceğinin listesi çıkar ve “Gönder” demeden hiçbir şey telefonundan çıkmaz. “Gönderme” dersen bildirim telefonunda kalır; kararını aynı yerdeki “Yine de gönder” ile sonradan değiştirebilirsin. İnternet yoksa bildirim bekler, bağlanınca gider. Günde en fazla 20 bildirim açılabilir.',
        'Gönderilen tam liste yedi alandır: sorunun havuzdaki kimliği; sorunun hangi oyundan geldiği; sorunun metni; uygulamanın doğru saydığı cevap; senin seçtiğin sebep; uygulama sürümü; telefonunun üreticisi ve modeli, yanında cihazına verilen rastgele takma ad.',
        'Model bilgisi, bazı arızaların yalnızca belirli ekran ölçülerinde çıkması yüzünden var. Takma ad rastgele üretilir, adınla ya da hesabınla ilgisi yoktur; tek işi aynı telefondan gelen bildirimleri gruplamaktır. Bu ad kalıcı olduğu için Google Play’in sınıflandırmasında “cihaz veya diğer kimlikler” kategorisine girer ve Data Safety formunda böyle beyan edilir.',
        'Bu bildirimde gönderilmeyenler: adın, e-postan, telefon numaran, konumun, denemelerin ve netlerin, okul notların, yapılacaklar notların, fotoğrafların, çalışma süren, oyun puanların, kilitli uygulama listen, rehberin, mesajların.',
        'Bildirim, bize ait Firebase projesindeki bir veri tabanına (Cloud Firestore) kaydedilir; bu Google’ın sunucularında durur. Bağlantı HTTPS ile şifrelenir. Uygulamanın bu veri tabanında yapabildiği tek şey yeni kayıt eklemektir: kendi gönderdiği dahil hiçbir kaydı okuyamaz, değiştiremez, silemez.',
      ],
    },
    {
      baslik: '4. Telefonundan çıkan ikinci şey: çökme raporu',
      paragraflar: [
        'Uygulama beklenmedik şekilde kapanırsa ya da kapanmadan bir hata yakalarsa (ekrandaki bir bölümün çizilememesi, yüklenemeyen bir dosya gibi) hatanın kaydı telefonunda tutulur. Kendiliğinden hiçbir yere gitmez: otomatik gönderim uygulamanın içinde kalıcı olarak kapalıdır. Bir sonraki açılışta sana sorulur — “Gönder” dersen kayıt gider, “Gönderme” dersen telefonundan silinir. Bu soru her kayıttan sonra tek tek sorulur; önceden verilmiş kalıcı bir izin yoktur.',
        'Gönderdiğinde giden kayıt şunları içerir: hatanın teknik dökümü ve hata mesajı (yüklenemeyen bir dosya söz konusuysa o dosyanın uygulama içindeki adresi), uygulama sürümü ve derleme türü, Android sürümü ve cihazdaki Android System WebView sürümü, telefonun üreticisi ve modeli, ve çökme aracının kendi eklediği teknik bilgiler — cihaza özel rastgele bir kurulum numarası ile cihaz durumu (bellek ve disk doluluğu, ekran yönü, root durumu, işlemci mimarisi).',
        'Bu kayıtta adın, denemelerin, notların, fotoğrafların ve puanların yer almaz. Çökme raporları Google Firebase Crashlytics üzerinden toplanır.',
      ],
    },
    {
      baslik: '4a. Telefonundan çıkan üçüncü şey: öneri ve hata bildirimi',
      paragraflar: [
        'Ayarlar’daki “Öneri ve hata bildir” ekranından bize bir mesaj yazabilirsin: bir öneri, bozuk bir şeyin tarifi ya da başka bir not. Mesaj yalnızca sen “Gönder” dediğinde telefonundan çıkar; düğmenin hemen üstünde ne gönderileceği yazar. İnternet yoksa mesaj telefonunda bekler, bağlanınca gider. Günde en fazla 5 mesaj gönderilebilir.',
        'Gönderilen tam liste beş alandır: seçtiğin tür (öneri, hata, başka); yazdığın metin, olduğu gibi; uygulama sürümü; telefonunun üreticisi ve modeli, yanında cihazına verilen rastgele takma ad (3. bölümdekiyle aynı ad); gönderim tarihi.',
        'Metni sen yazdığın için içine ne koyduğun sana bağlı. Ekran, adını, telefon numaranı ya da başka bir kişisel bilgiyi yazmamanı söyler; bu kutu tek yönlüdür, sana geri dönemeyiz. Yine de yazarsan o bilgi metnin parçası olarak bize ulaşır ve 8. bölümdeki adrese yazarak sildirebilirsin.',
        'Bu bildirimde gönderilmeyenler, hatalı soru bildirimindekiyle aynıdır: adın, e-postan, telefon numaran, konumun, denemelerin ve netlerin, okul notların, yapılacaklar notların, fotoğrafların, çalışma süren, oyun puanların, kilitli uygulama listen, rehberin, mesajların.',
        'Mesaj, hatalı soru bildirimleriyle aynı veri tabanına (Cloud Firestore) ayrı bir bölümde kaydedilir. Bağlantı HTTPS ile şifrelenir; uygulama burada da yalnızca yeni kayıt ekleyebilir.',
      ],
    },
    {
      baslik: '4b. Güncelleme denetimi',
      paragraflar: [
        'Uygulama açılırken telefonundaki Google Play uygulamasına Rabi’nin yeni bir sürümü olup olmadığı sorulur. Bu sorguyu Rabi değil Play yapar ve Play’in zaten bildiği tek şeyi kullanır: uygulamanın paket adı ve kurulu sürümü. Adın, kullanımın ya da başka bir bilgi geçmez. Yeni sürüm varsa ekranın üstünde bir şerit çıkar; indirme ancak sen “Güncelle” dersen ve Play’in kendi onay penceresinden geçerek başlar. Şeridi kapatabilirsin; kapatman kaydedilmez, bir sonraki açılışta yeniden hatırlatılır.',
        'Rabi Play dışından (doğrudan APK olarak) kurulduysa bu denetim çalışmaz ve şerit hiç görünmez.',
      ],
    },
    {
      baslik: '5. İzinler ve neden isteniyor',
      paragraflar: [
        'İnternet izni yukarıdaki üç gönderim ve Play’in güncelleme denetimi için. Bildirim gönderme izni çalışma hatırlatması ve pomodoro sayacı için; bildirimler telefonunda üretilir, dışarı çıkmaz. Kamera ve galeri sistem seçicisi üzerinden açılır.',
        'Odak kilidi üç izin kullanır ve hiçbirinden okunan bilgi telefondan çıkmaz: kullanım verisi erişimi hangi uygulamanın ön planda olduğunu anlamak için, diğer uygulamaların üzerinde gösterme uyarı katmanı için, ön plan servisi ise pomodoro turu boyunca sayacı ve kilidi ayakta tutmak için. Xiaomi telefonlarda üreticinin kendi “arka planda açılır pencere” ayarı da açık olmalıdır; bu bir Android izni değil, üstte gösterme izninin o telefonlardaki ek şartıdır.',
        'Rahatsız Etme erişimi isteğe bağlıdır: verirsen pomodoro turu boyunca telefon Rahatsız Etme moduna alınır ve tur bitince önceki ayarına döner; vermezsen odak kilidinin geri kalanı çalışmaya devam eder. Bu izinle bildirimlerin içeriği okunmaz, saklanmaz, gönderilmez — Rabi yalnızca modu açıp kapatır.',
        'Sayaç, telefonun kilit ekranında bir bildirim olarak durur ve o bildirimde aşama ile seçtiğin ders adı (“Çalışma · Matematik” gibi) yazar. Bu, telefon kilitliyken görünen tek Rabi verisidir ve telefondan çıkmaz.',
        'Kurulu uygulamaları görme izni odak kilidinde engellenecek uygulamaları listelemek için. Titreşim, uyanık tutma, açılışta başlama ve tam zamanlı alarm izinleri sayaç ile hatırlatmaların doğru saatte çalışması için. Kullanım verisi ve ekran üstü gösterme izinlerini telefonunun ayarlarından istediğin zaman geri alabilirsin.',
      ],
    },
    {
      baslik: '6. Üçüncü taraflar',
      paragraflar: [
        'Rabi’nin veri gönderdiği tek şirket Google’dır ve yalnızca üç durumda: hatalı soru bildirimlerinin ve öneri/hata mesajlarının kaydedildiği Firebase Cloud Firestore ile gönderdiğin çökme raporlarının toplandığı Firebase Crashlytics. İkisi de aynı Firebase projesinin parçasıdır. Google bu verileri bizim adımıza ve talimatımızla işler. Güncelleme denetimi (4b) bunlardan ayrıdır: o sorguyu telefonundaki Google Play kendi adına yapar ve Play’in gizlilik politikasına tabidir. Google’ın gizlilik politikası: policies.google.com/privacy',
        'Rabi’de reklam ağı yoktur, kullanım analizi aracı yoktur, reklam kimliği okunmaz ve davranışını izleyen başka bir araç bulunmaz. Hiçbir veri satılmaz, kiralanmaz veya pazarlama amacıyla paylaşılmaz. Uygulamada hesap, giriş veya üyelik yoktur.',
      ],
    },
    {
      baslik: '7. Güvenlik',
      paragraflar: [
        'Telefondaki veriler işletim sisteminin uygulamalara ayırdığı özel alanda tutulur; başka uygulamalar buraya erişemez. Dışarı çıkan üç gönderim de HTTPS/TLS ile şifrelenerek iletilir; şifresiz bağlantı kullanılmaz.',
        'Bize ulaşan verilere yalnızca uygulamayı geliştiren kişi erişir ve bunlar yalnızca soruları düzeltmek, hataları gidermek ve önerileri değerlendirmek için kullanılır. Bizim işlettiğimiz bir sunucu yoktur; kayıtlar Google’ın Firebase hizmetinde, Google hesabı korumasının arkasında durur ve uygulamanın kendisi oradan hiçbir şey okuyamaz.',
      ],
    },
    {
      baslik: '8. Saklama ve silme',
      paragraflar: [
        'Telefonundaki veriler sen silene kadar durur. Ayarlar’daki “Tüm veriyi sil” hepsini temizler; uygulamayı kaldırmak da aynı sonucu verir.',
        'Bize ulaşan hatalı soru bildirimleri, soru düzeltilene kadar tutulur ve sonra veri tabanından silinir. Daha önce silinmesini istersen aşağıdaki adrese yaz — hangi soruları ve yaklaşık hangi tarihlerde bildirdiğini yazman yeterli. Talepler en geç 30 gün içinde sonuçlandırılır.',
        'Firebase Crashlytics, çökme kayıtlarını ve bunlara bağlı kurulum numaralarını 90 gün sonra silmeye başlar. Bir raporun daha önce silinmesini istersen bize yaz.',
        'Bize ulaşan öneri ve hata mesajları, konu ele alınana kadar tutulur ve en geç 1 yıl sonra veri tabanından silinir. Daha önce silinmesini istersen yaklaşık tarihini ve ne yazdığını belirterek aşağıdaki adrese yaz.',
        'Silme talebi için fluxifyinteractive@gmail.com adresine, konuya “Rabi veri silme” yazarak ulaşabilirsin. Rabi’de hesap olmadığı için silinecek bir hesabın yoktur; silinebilecek tek şey yukarıdaki üç kayıt türüdür.',
      ],
    },
    {
      baslik: '9. Çocuklar ve gençler',
      paragraflar: [
        'Rabi lise öğrencileri için tasarlandı ve 13 yaşından küçüklere yönelik değildir. Rabi kimseden ad, e-posta, telefon, konum veya doğum tarihi istemez; hesap açtırmaz, reklam göstermez, kullanıcı profili çıkarmaz ve kimseyi izlemez. Kurulumda sana hitap etmek için bir ad sorulur; gerçek adın olmak zorunda değildir, takma ad yazabilirsin ve yazdığın ad telefondan çıkmaz.',
        'Veli veya vasiysen ve çocuğuna ait bir kaydın silinmesini istiyorsan 8. bölümdeki adrese yazman yeterlidir.',
      ],
    },
    {
      baslik: '10. Haklarınız',
      paragraflar: [
        '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuat kapsamında; hakkında veri işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, düzeltilmesini veya silinmesini isteme haklarına sahipsin. Bu haklarını kullanmak için fluxifyinteractive@gmail.com adresine yazabilirsin.',
        'Rabi ad, e-posta veya hesap bilgisi toplamadığı için bize ulaşan kayıtların hangisinin sana ait olduğunu kendiliğimizden bulamıyoruz; talebinde bildirimi yaptığın yaklaşık tarihi ve soruları ya da mesajı belirtirsen kaydı bulup silebiliriz.',
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
 * Play **zorunlu tutmuyor**: sözleşme yalnızca hesap açtıran, satın alma sunan
 * ya da kullanıcı içeriği barındıran uygulamalarda ve Child Safety Standards
 * kapsamındakilerde şart; Rabi bunların hiçbiri değil. Yine de yazıldı, çünkü
 * iki şeyin bir yerde durması gerekiyordu: puan ve sıralama sayılarının tahmin
 * olduğu (Play'in Yanıltıcı İddialar politikası) ve odak kilidinin telefonu
 * Rahatsız Etme'ye alabildiği (kullanıcı önemli bir bildirimi kaçırabilir).
 *
 * Gizlilik politikasına **girmedi**: o belge veriyi anlatıyor, bu belge
 * kullanımı. İkisini birleştirmek, veriyle ilgili bir cümle arayan kullanıcıyı
 * sorumluluk maddelerinin arasında gezdirirdi.
 */
const SOZLESME: YasalBelge = {
  id: 'sozlesme',
  ad: 'Kullanıcı Sözleşmesi',
  ozet: 'Uygulamayı kullanma koşulları',
  yururlukTarihi: '2026-09-12',
  bolumler: [
    {
      paragraflar: [
        'Bu sözleşme, Fluxify Interactive tarafından geliştirilen Rabi uygulamasını kullanma koşullarını anlatır. Uygulamayı kurup kullanmaya devam ederek buradaki koşulları kabul etmiş olursun. Kabul etmiyorsan uygulamayı kullanma ve telefonundan kaldır.',
        '18 yaşından küçüksen uygulamayı velinin bilgisi dahilinde kullanmalısın. Rabi lise öğrencileri için tasarlandı ve 13 yaşından küçüklere yönelik değildir.',
      ],
    },
    {
      baslik: '1. Rabi nedir, ne değildir',
      paragraflar: [
        'Rabi bir çalışma asistanıdır: çalışma süreni tutar, denemelerini ve okul notlarını kaydeder, mini oyunlarla tekrar yapmanı sağlar ve girdiğin verilerden hesaplar yapar.',
        'Rabi bir eğitim kurumu, kurs, koçluk hizmeti ya da resmî bir kaynak değildir. ÖSYM ile ya da herhangi bir resmî kurumla bağlantısı yoktur, hiçbiri tarafından desteklenmez veya onaylanmaz. Uygulamadaki hiçbir bilgi resmî kılavuzun yerini tutmaz; sınav, başvuru ve tercih işlemlerinde esas alınacak tek kaynak ÖSYM’nin kendi yayımladığı belgelerdir.',
      ],
    },
    {
      baslik: '2. Puan ve sıralama sayıları tahmindir',
      paragraflar: [
        'Uygulamanın gösterdiği puan, net, diploma notu ve sıralama sayıları, senin girdiğin verilerden ve geçmiş yılların açıklanmış yerleştirme sonuçlarından yapılan yaklaşık hesaplardır.',
        'Bu sayılar bir garanti değildir. Gerçek sınav sonucunu o yıl sınava girenlerin başarısı, soruların zorluğu ve ÖSYM’nin kendi hesaplama yöntemi belirler. Tercih, okul veya bölüm kararlarını yalnızca uygulamadaki sayılara bakarak verme.',
        'Uygulamadaki bir hesabın yanlış çıkmasından doğan sonuçlardan Fluxify Interactive sorumlu tutulamaz.',
      ],
    },
    {
      baslik: '3. Soru havuzu hata içerebilir',
      paragraflar: [
        'Mini oyunlardaki sorular elle yazıldı ve içlerinde yanlış cevap ya da bozuk yazım bulunabilir. Bir soruyu hatalı bulursan yanındaki bayrak düğmesiyle bildir; bildirimler okunuyor ve sorular düzeltiliyor.',
        'Bildirim sistemini gerçek bir hata olmadan doldurmak, aynı soruyu tekrar tekrar bildirmek ya da otomatik araçlarla bildirim göndermek yasaktır. Günlük bildirim sınırı bu yüzden var.',
      ],
    },
    {
      baslik: '4. Odak kilidi hakkında bilmen gerekenler',
      paragraflar: [
        'Odak kilidi, senin seçtiğin uygulamaları çalışma seansı boyunca engeller; engellenen uygulama arkadan ses çalıyorsa (video, müzik) o ses de kesilir. İstersen tur boyunca telefonu Rahatsız Etme moduna alır. Bu özellik yalnızca sen açtığında çalışır ve tur bitince telefon eski hâline döner.',
        'Rahatsız Etme telefonun tamamını susturur, yalnızca seçtiğin uygulamaları değil; alarmların ve kendi Rahatsız Etme istisnaların (kişilerden gelen aramalar gibi) geçmeye devam eder. Susturulan bildirimler arasında sana ulaşmaya çalışan biri olabilir. Acil durumda ulaşılman gerekiyorsa Rahatsız Etme’yi açma ve kilit listesine telefon ve mesaj uygulamalarını ekleme; seansı istediğin an bitirebilirsin. Kaçırdığın bir bildirimden ya da aramadan doğan sonuçlardan Fluxify Interactive sorumlu değildir.',
        'Odak kilidi bir güvenlik ya da ebeveyn denetimi aracı değildir; kendi kararınla kendine koyduğun bir engeldir ve istediğin zaman kaldırabilirsin.',
      ],
    },
    {
      baslik: '5. Verinin sorumluluğu sende',
      paragraflar: [
        'Rabi’nin sunucusu yok; denemelerin, notların, fotoğrafların ve çalışma geçmişin yalnızca telefonunda duruyor. Bunun anlamı şudur: uygulamayı silersen, telefonun bozulur ya da kaybolursa veriler geri getirilemez.',
        'Android’in otomatik uygulama yedeği Rabi için kapalıdır; verin telefon değiştirdiğinde kendiliğinden taşınmaz. Ayarlar’daki “Yedeği indir” ile verinin bir dosyasını alabilir, yeni telefonda “Yedeği yükle” ile geri getirebilirsin. Yedek almak senin sorumluluğundur; kaybolan veriden Fluxify Interactive sorumlu tutulamaz.',
        'Verinin nasıl işlendiği ayrı bir belgede: Gizlilik Politikası.',
      ],
    },
    {
      baslik: '6. Ücret ve reklam',
      paragraflar: [
        'Rabi ücretsizdir. Uygulama içi satın alma, abonelik ve reklam yoktur; ücretli bir özellik eklenmesi hâlinde bu sözleşme güncellenir ve değişiklik uygulama içinde duyurulur.',
        'Uygulamanın tek resmî dağıtım yeri Google Play’dir. Başka bir yerden indirilen dosyalar değiştirilmiş olabilir; onlardan doğacak zarardan sorumlu değiliz.',
      ],
    },
    {
      baslik: '7. Kullanım kuralları',
      paragraflar: [
        'Uygulamayı tersine mühendislikle çözmeye, kaynak koduna dönüştürmeye, değiştirilmiş sürümünü dağıtmaya ya da içeriğini izinsiz kopyalayıp yayımlamaya çalışma.',
        'Uygulamanın çalışmasını bozmaya, gönderilen bildirimleri sahte veriyle doldurmaya veya başkalarının kullanımını engellemeye yönelik davranışlar bu sözleşmenin ihlalidir.',
      ],
    },
    {
      baslik: '8. Haklar',
      paragraflar: [
        'Uygulamanın kodu, tasarımı, maskotu, soru havuzu ve metinleri Fluxify Interactive’e aittir. Sana verilen şey uygulamayı kişisel olarak kullanma hakkıdır; mülkiyeti devredilmez.',
        'Uygulamadaki lo-fi parçalar CC0 1.0 (kamu malı) lisanslı Open Lo-Fi derlemesinden alınmıştır. Uygulama ayrıca açık kaynaklı bileşenler kullanır ve bunların lisansları kendi sahiplerine aittir.',
        'Telefonunda oluşturduğun veriler senindir; onlar üzerinde hiçbir hak talep etmiyoruz.',
      ],
    },
    {
      baslik: '9. Garanti ve sorumluluk',
      paragraflar: [
        'Rabi “olduğu gibi” sunulur. Uygulamanın hatasız çalışacağı, her cihazda aynı davranacağı, kesintisiz olacağı ya da belirli bir sonucu sağlayacağı garanti edilmez.',
        'Yürürlükteki mevzuatın izin verdiği ölçüde Fluxify Interactive, uygulamanın kullanımından doğan dolaylı zararlardan sorumlu değildir. Bu madde, tüketici mevzuatının sana tanıdığı hakları ortadan kaldırmaz.',
      ],
    },
    {
      baslik: '10. Değişiklikler ve sona erme',
      paragraflar: [
        'Bu sözleşme güncellenebilir; güncel metin her zaman uygulamanın içinde durur ve yürürlük tarihi en üstte yazar. Önemli bir değişiklik olursa uygulama içinde duyurulur.',
        'Uygulamayı istediğin zaman silerek bu sözleşmeyi sona erdirebilirsin. Sözleşmeyi ihlal eden bir kullanım hâlinde uygulamayı kullanma hakkın sona erer.',
      ],
    },
    {
      baslik: '11. Uygulanacak hukuk ve iletişim',
      paragraflar: [
        'Bu sözleşme Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda tüketici mevzuatının öngördüğü merciler yetkilidir.',
        'Soruların için: fluxifyinteractive@gmail.com',
      ],
    },
  ],
}

/**
 * Cihazdan ne çıkıyor — Ayarlar'daki iki bölümün taşındığı yer.
 *
 * Bu metin kullanıcıdan gelmiyor, uygulamanın kendi davranışını anlatıyor ve
 * koddaki gerçekle birlikte değişmesi gerekiyor: `lib/hata-gonder.ts` (hatalı
 * soru + öneri/hata mesajı) ile `lib/cokme.ts` dışında ağa çıkan bir yol
 * açılırsa buraya da yazılmalı.
 */
const VERI_OZETI: YasalBelge = {
  id: 'veri-ozeti',
  ad: 'Cihazından ne çıkıyor?',
  ozet: 'İnternete giden üç şey ve üçü de sana sorularak gidiyor; bir de Play’in sürüm sorgusu',
  bolumler: [
    {
      paragraflar: [
        'Rabi’nin sunucusu yok. Denemelerin, notların, fotoğrafların, puanların ve ayarların telefonunda duruyor; uygulama onları hiçbir yere göndermiyor. İnternete çıkan yalnızca üç şey var ve üçü de sen izin vermeden gitmiyor.',
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
    {
      baslik: 'Öneri ve hata mesajların',
      paragraflar: [
        'Ayarlar’daki “Öneri ve hata bildir” ekranından yazdığın mesaj, sen “Gönder” demeden gitmiyor. Giden şey: seçtiğin tür, yazdığın metin, uygulama sürümü, telefonunun modeli ve cihazına verilen rastgele ad, bir de tarih.',
        'Metni sen yazıyorsun; içine adını ya da telefonunu yazma, sana geri dönemeyiz. İnternet yoksa mesaj bekliyor, bağlanınca gidiyor.',
      ],
    },
    {
      baslik: 'Play’in sürüm sorgusu',
      paragraflar: [
        'Uygulama açılırken telefonundaki Google Play’e “Rabi’nin yeni sürümü var mı” diye soruluyor. Bunu Rabi değil Play yapıyor ve Play’in zaten bildiği şeyle: uygulamanın adı ve kurulu sürümü. Sana ait hiçbir şey geçmiyor.',
        'Yeni sürüm varsa üstte bir şerit çıkıyor; indirme sen “Güncelle” demeden başlamıyor. Kapatırsan bir sonraki açılışta yeniden hatırlatılıyor.',
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
