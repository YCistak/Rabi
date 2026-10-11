# Güvenlik Politikası

## Güvenlik açığı nasıl bildirilir

Güvenlik açığını **herkese açık issue, tartışma veya PR olarak açma.** Bunun yerine
GitHub'ın gizli güvenlik açığı bildirimini kullan:

1. Deponun [**Security**](https://github.com/YCistak/Rabi/security) sekmesine git.
2. **Report a vulnerability** (Güvenlik açığı bildir) düğmesine tıkla.
3. Açığı, nasıl yeniden üretileceğini ve etkisini yaz.

Bildirimin yalnızca depo bakımcılarına görünür. GitHub hesabın yoksa veya bu yol
çalışmıyorsa fluxifyinteractive@gmail.com adresine yazabilirsin.

## Ne bekleyebilirsin

- **7 gün içinde ilk yanıt** veririz.
- Açığı doğruladıktan sonra düzeltme planını ve tahmini süreyi paylaşırız.
- Düzeltme yayımlanana kadar ayrıntıları gizli tutmanı rica ederiz; istersen
  düzeltme notunda adını anarız.

## Desteklenen sürümler

Yalnızca **en son sürüm** desteklenir. Eski sürümler için düzeltme yayımlanmaz;
önce son sürümde yeniden üretmeye çalış.

## Kapsam

Kapsam içinde:

- **Mobil uygulama** (Android ve iOS): yerel veriye yetkisiz erişim, uygulamanın izinlerinin
  kötüye kullanılması, uygulama içindeki kod çalıştırma veya veri sızıntısı açıkları.
- **Firestore kuralları** ([`firestore.rules`](firestore.rules)): kuralların izin vermemesi
  gereken okuma, değiştirme, silme veya alan/boyut sınırı aşan yazma işlemlerine izin vermesi.
- **Geri bildirim kanalı:** uygulamadan Firestore'a giden hata ve öneri bildirimi akışı
  (kimliksiz kötüye kullanım, beklenmeyen veri toplama, alan sınırlarının aşılması).

Kapsam dışında:

- Cihazı zaten ele geçirmiş birinin (root, jailbreak, fiziksel erişim) yapabilecekleri.
- Elden kurulan, imzası değiştirilmiş veya üçüncü taraflarca yeniden paketlenmiş sürümler.
- Uygulamanın ve APK'nın zaten herkese açık olan içeriğini (kaynak kod, soru havuzları,
  Firebase proje bilgileri) "ifşa" olarak bildirmek.
- Geri bildirim kanalına çok sayıda kayıt göndermek gibi, salt hacme dayalı
  hizmet engelleme (DoS) denemeleri.
- Puan ve sıralama tahminlerinin kesin olmaması; bu bir hata değil, uygulamanın bilinen
  sınırıdır.
- Müfredat veya soru içeriğindeki yanlışlar: bunlar için "İçerik düzeltmesi" issue şablonunu kullan.
- Üçüncü taraf hizmetlerin (GitHub, Firebase, Google Play, App Store) kendi açıkları.
- Sosyal mühendislik, fiziksel saldırılar ve otomatik tarayıcı çıktılarının doğrulanmamış kopyaları.

Test yaparken yalnızca kendi cihazın ve verinle çalış, başkalarının verisine erişme.
