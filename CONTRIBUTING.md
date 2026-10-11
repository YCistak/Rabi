# Rabi'ye katkı

Rabi'ye ilgi duyduğun için teşekkürler. Bu belge, nasıl katkı verebileceğini ve
projeyi yerelde nasıl çalıştıracağını anlatır. Katılırken [Davranış Kuralları](CODE_OF_CONDUCT.md)
geçerlidir.

## Önce issue aç

Pull request (PR) açabilirsin, ama **önce bir issue aç** ve ne yapmak istediğini yaz.
Rabi küçük bir proje; tasarım ve davranış kararları yazılı kurallara bağlı
([AGENTS.md](AGENTS.md), [docs/kurallar/](docs/kurallar/)) ve bazı özellikler bilerek
yok. Issue'da konuşmak, boşa emek harcamanı önler. Issue açmadan gelen PR'lar
kapatılabilir.

Issue şablonları:

- **Hata bildirimi:** uygulama beklediğin gibi çalışmıyor.
- **Özellik önerisi:** yeni bir şey istiyorsun.
- **İçerik düzeltmesi:** müfredat, konu kartı veya oyun/yoklama sorusunda yanlış ya da
  eksik bilgi gördün (aşağıya bak).

Güvenlik açığını issue olarak **açma**; [SECURITY.md](SECURITY.md) dosyasındaki yolu izle.

## Müfredat ve soru içeriği düzeltmeleri

Öğretmenler ve öğrenciler kod bilmeden de katkı verebilir. Bir konu kartında yanlış
bilgi, bir sorunun cevabında hata, ya da müfredatta olup uygulamada olmayan bir konu
görürsen **"İçerik düzeltmesi"** şablonuyla issue aç. Şunları yaz:

- Hangi ekran, sınıf, ders ve konu (veya hangi oyun ve soru),
- Şu an ne yazıyor, doğrusu ne olmalı,
- Mümkünse kaynak (MEB ders kitabı, Talim Terbiye Kurulu müfredatı, ÖSYM kılavuzu).

Kaynaksız düzeltmeler de değerlidir, ama kaynak olursa daha hızlı karara bağlanır.
İçerik dosyaları `lib/konu/icerik/` ve `lib/oyunlar/` altındadır; PR göndermek istersen
düzeltmeyi oradaki ilgili dosyada yap ve issue'ya bağla.

## Kurulum

Gerekenler: Node.js 22 ve npm.

```bash
git clone https://github.com/YCistak/Rabi.git
cd Rabi
npm install
npm run dev        # http://localhost:3000
```

Uygulama mobil için tasarlandı; tarayıcıda geliştirici araçlarından mobil görünümü aç.
Yalnızca web arayüzünü çalıştırmak için Android veya iOS araçlarına gerek yok.

## Android derlemesi

Android SDK ve **JDK 21** gerekir. Sistem varsayılanı daha yeni bir JDK ise (ör. 25),
Gradle 8.14 onu desteklemediği için derleme bozulur; JDK 21'i açıkça seç:

```bash
JAVA_HOME=/yol/jdk-21 npm run apk
```

`npm run apk` web arayüzünü derler, Capacitor ile Android projesine aktarır ve
`android/` altında debug APK üretir. Telefonda denemek için bu yeterlidir. Yayın
imzası ve sürüm yayınlama süreci bakımcılara aittir; katkı için gerekmez.

iOS projesi `ios/` altındadır; derlemek için macOS ve Xcode gerekir
(`npm run sync:ios`). iOS'a dokunan işlerde önce [docs/kurallar/ios.md](docs/kurallar/ios.md)
dosyasını oku.

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Statik derleme |
| `npm run typecheck` | TypeScript tip denetimi |
| `npm run test` | Birim testleri (Vitest) |
| `npm run test:izle` | Testleri izleme kipinde çalıştırır |
| `npm run apk` | Debug APK üretir |

## Kurallar

Ayrıntıları [AGENTS.md](AGENTS.md) içinde; PR açmadan önce özellikle şunlara bak:

- **Dil Türkçe.** Issue, PR, commit mesajı, yorum, değişken, fonksiyon ve dosya adları
  Türkçe. Çerçevenin dayattığı adlar (`page.tsx`, `useState` gibi) ve paket adları
  istisna. Yorumlar **neden**i anlatır, ne yaptığını değil.
- **Alana özel kurallar:** bir alana dokunmadan önce `docs/kurallar/` altındaki ilgili
  dosyayı oku (ör. oyunlar için `oyunlar.md`, Pomodoro için `pomodoro.md`). "Kullanıcı
  istedi" yazan maddeler bilinçli kararlardır; değiştirmeden önce issue'da sor.
- **Mimari:** durum kütüphanesi yok, saf mantık `lib/` altında ve testli, sunucu yok.
  Ağa çıkan yeni bir şey ekleme; ağ istisnaları [docs/kurallar/ag-ve-gizlilik.md](docs/kurallar/ag-ve-gizlilik.md)
  dosyasında sayılıdır.
- **Tasarım:** mobil öncelikli tek sütun, tek tema (koyu tema yok), renkler tema
  değişkenlerinden gelir, her ders her yerde aynı renkte.
- **Doğruluk:** puan ve sıralama tahmindir ve arayüzde böyle sunulur.
- Kayıtlı veri anahtarları yeniden adlandırılmaz; eski kullanıcı verisini bozar.

### Dal adları

Küçük harfle, Türkçe ve tire ile; başına türünü yaz:

- `ozellik/<kisa-ad>`: yeni özellik veya iyileştirme (ör. `ozellik/harita-secim-alt-sayfa`)
- `duzeltme/<kisa-ad>`: hata düzeltmesi (ör. `duzeltme/mola-uzanan-golge`)
- `icerik/<kisa-ad>`: müfredat veya soru içeriği düzeltmesi
- `belge/<kisa-ad>`: yalnızca belge değişikliği

### Commit mesajları

Türkçe, kısa ve "alan: ne değişti" biçiminde. Mesaj değişikliğin ne olduğunu söylesin,
nasıl yapıldığını değil. Örnekler:

```text
Harita: sınıf ve ders seçimi tek kart + alt pencere
Pomodoro: iptalden sonra takılı kalan bildirim düzeltildi
```

Değişiklikleri küçük ve anlamlı commit'lere böl.

### PR göndermeden önce

```bash
npm run typecheck
npm run test
```

İkisi de hatasız geçmeli. Saf mantığa (`lib/`) dokunduysan test ekle veya güncelle.
PR açıklamasında ilgili issue'yu bağla ve ekran değişikliği varsa görüntü ekle.
