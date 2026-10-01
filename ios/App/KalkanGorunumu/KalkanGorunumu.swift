import ManagedSettings
import ManagedSettingsUI
import UIKit

/// Engellenen uygulama açılınca çıkan ekran.
///
/// Android'deki engel katmanının (`EngelKatmani.kt`) karşılığı. Sistemin
/// varsayılan kalkanı gri bir "Kısıtlanmış" ekranı; kullanıcı neden
/// engellendiğini ve kimin engellediğini anlamıyor. Burada Rabi'nin maskotu,
/// zemini ve sesiyle konuşuyor.
///
/// Renkler web tarafının tema değişkenlerinden okunamıyor (eklenti ayrı bir
/// süreç, WebView yok); aynı sayılar burada yazılı: zemin `--background`
/// #F8F8F7, yazı `--foreground`a yakın koyu kahve, düğme `--primary-parlak`
/// #D9622F. Tema değişirse burası da değişmeli.
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
        let yazi = UIColor(red: 0x2A / 255, green: 0x21 / 255, blue: 0x1C / 255, alpha: 1)
        let soluk = UIColor(red: 0x7A / 255, green: 0x6E / 255, blue: 0x66 / 255, alpha: 1)
        let amber = UIColor(red: 0xD9 / 255, green: 0x62 / 255, blue: 0x2F / 255, alpha: 1)
        return ShieldConfiguration(
            backgroundBlurStyle: nil,
            backgroundColor: zemin,
            icon: UIImage(named: "tavsan_yuz"),
            title: ShieldConfiguration.Label(text: "Odak modundasın", color: yazi),
            subtitle: ShieldConfiguration.Label(
                text: "Rabi'de çalışma turun sürüyor. Bu uygulama tur bitince açılacak.",
                color: soluk
            ),
            primaryButtonLabel: ShieldConfiguration.Label(text: "Tamam", color: .white),
            primaryButtonBackgroundColor: amber
        )
    }
}
