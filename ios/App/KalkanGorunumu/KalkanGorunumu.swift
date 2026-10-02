import DeviceActivity
import ManagedSettings
import ManagedSettingsUI
import UIKit

/// Engellenen uygulama açılınca çıkan ekran.
///
/// Android'deki engel katmanının (`EngelKatmani.kt`, `engel_katmani.xml`)
/// karşılığı ve metni, renkleri ondan: "Odaktasın.", "Bu uygulama ders
/// bitene kadar kilitli.", kalan süre ve amber düğme. Sistemin varsayılan
/// kalkanı gri bir "Kısıtlanmış" ekranı; kullanıcı neden engellendiğini ve
/// kimin engellediğini anlamıyor.
///
/// Birebir aynı olamıyor; Apple kalkanın düzenini kendisi çiziyor ve yalnızca
/// şunları değiştirmeye izin veriyor: zemin, ikon, başlık, alt yazı, iki
/// düğmenin metni ve rengi. Yazı tipi sistemin. Bu yüzden:
/// - Kalan süre büyük sayı değil alt yazının son satırı ve **akmıyor**:
///   yapılandırma ekran açılırken bir kez soruluyor.
/// - İlerleme çubuğu ve ders çipi yok.
/// - "Rabi'ye dön" yok: kalkanın düğmesi başka bir uygulamayı açamıyor, en
///   fazla engellenen uygulamayı kapatıyor. Düğme bu yüzden "Tamam".
/// - "Kilidi kapat" yok: Android'de bedeli olan bir onay ekranı var (tur
///   iptal, seri kırılır); burada o onayı soracak bir yer yok. Kilit Rabi'den
///   kapatılıyor — tur duraklatılınca ya da bitince.
///
/// Renkler web tarafının tema değişkenlerinden okunamıyor (eklenti ayrı bir
/// süreç, WebView yok); Android'in `colors.xml`indeki sayılar burada da
/// yazılı: zemin `odak_zemin` #F8F8F7, başlık `odak_metin` #1B1A19, alt yazı
/// `odak_soluk` #6B6764, düğme `marka_amber` #D9622F. Biri değişirse ötekiler de.
///
/// Maskot `tavsan_yuz.png`: `public/tavsan-yuz.png`in kopyası (Android'in
/// `drawable-nodpi/tavsan_yuz.png`si de öyle). Görsel değişirse üçü birden.
class KalkanGorunumu: ShieldConfigurationDataSource {
    override func configuration(shielding application: Application) -> ShieldConfiguration {
        yapilandirma()
    }

    override func configuration(shielding application: Application, in category: ActivityCategory) -> ShieldConfiguration {
        yapilandirma()
    }

    override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration {
        yapilandirma()
    }

    override func configuration(shielding webDomain: WebDomain, in category: ActivityCategory) -> ShieldConfiguration {
        yapilandirma()
    }

    private func yapilandirma() -> ShieldConfiguration {
        let zemin = UIColor(red: 0xF8 / 255, green: 0xF8 / 255, blue: 0xF7 / 255, alpha: 1)
        let metin = UIColor(red: 0x1B / 255, green: 0x1A / 255, blue: 0x19 / 255, alpha: 1)
        let soluk = UIColor(red: 0x6B / 255, green: 0x67 / 255, blue: 0x64 / 255, alpha: 1)
        let amber = UIColor(red: 0xD9 / 255, green: 0x62 / 255, blue: 0x2F / 255, alpha: 1)

        var altYazi = "Bu uygulama ders bitene kadar kilitli."
        if let kalan = kalanSure() {
            altYazi += "\n\n\(kalan)"
        }

        // Bulanıklık açık ve **açık tonda**: `nil` verilince sistem zemin
        // rengini kararmış uygulama görüntüsünün üstüne yarı saydam koyuyor ve
        // ekran gri-koyu görünüyordu. Açık bulanıklık altta beyaz bir taban
        // kuruyor, zemin rengi telefonun gece modundan bağımsız kırık beyaz kalıyor.
        return ShieldConfiguration(
            backgroundBlurStyle: .extraLight,
            backgroundColor: zemin,
            icon: UIImage(named: "tavsan_yuz"),
            title: ShieldConfiguration.Label(text: "Odaktasın.", color: metin),
            subtitle: ShieldConfiguration.Label(text: altYazi, color: soluk),
            primaryButtonLabel: ShieldConfiguration.Label(text: "Tamam", color: .white),
            primaryButtonBackgroundColor: amber
        )
    }

    /// Turun bitişi, kalkanı tur sonunda kaldıran zamanlayıcıdan okunuyor
    /// (`EkranSuresiEklentisi.kilitle`, ad `rabiTur`). Ayrı bir paylaşılan
    /// depo kurmaktansa zaten var olan kaynak: o zamanlayıcının sonu turun
    /// sonu. Okunamazsa satır hiç yazılmıyor — yanlış bir süre, hiç süre
    /// yazmamaktan kötü.
    private func kalanSure() -> String? {
        guard let program = DeviceActivityCenter().schedule(for: DeviceActivityName("rabiTur")),
              let bitis = Calendar.current.date(from: program.intervalEnd)
        else { return nil }
        let saniye = bitis.timeIntervalSinceNow
        guard saniye > 0 else { return nil }
        let dakika = Int((saniye / 60).rounded(.up))
        if dakika <= 1 { return "1 dakikadan az kaldı" }
        if dakika < 60 { return "\(dakika) dakika kaldı" }
        let saat = dakika / 60
        let artan = dakika % 60
        return artan == 0 ? "\(saat) saat kaldı" : "\(saat) saat \(artan) dakika kaldı"
    }
}
