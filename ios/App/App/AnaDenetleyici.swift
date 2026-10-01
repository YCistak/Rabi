import UIKit
import Capacitor

/// Capacitor'ın köprü denetleyicisi, üstüne iOS'un iki alışkanlığı.
///
/// Android'in `MainActivity`sinin karşılığı. Başka bir iş eklemeden önce
/// sorulacak soru şu: bu iş web tarafında yapılabiliyor mu? Burası derlemesi
/// yalnızca Mac'te denenebilen tek kod; ne kadar az şey taşırsa o kadar az
/// şey sessizce bozulur.
class AnaDenetleyici: CAPBridgeViewController, UIGestureRecognizerDelegate {

    /// Parmağın kenardan en az bu kadar içeri çekilmesi ya da bu hızla
    /// fırlatılması gerekiyor. Daha azı yanlışlıkla geri gitmek demek:
    /// ekranın soluna yakın bir şıkka uzanan başparmak da kenardan başlıyor.
    private let yolEsigi: CGFloat = 70
    private let hizEsigi: CGFloat = 600

    /// Web tarafı bu olayı `AppShell`de dinliyor ve Android'in geri tuşuyla
    /// aynı yoldan (`geriGit`) geçiriyor. Ad iki yerde birden yazılı.
    private let geriOlayi = "rabiGeri"

    override func capacitorDidLoad() {
        super.capacitorDidLoad()
        guard let webView = webView else { return }

        // iOS'ta geri tuşu yok; kullanıcının geri gitmek için bildiği tek
        // hareket soldan kaydırmak. WKWebView'ın kendi
        // `allowsBackForwardNavigationGestures`ı işe yaramıyor: uygulama tek
        // sayfa, tarayıcı geçmişinde gidilecek bir önceki sayfa yok.
        let kenar = UIScreenEdgePanGestureRecognizer(target: self, action: #selector(kenardanKaydirildi(_:)))
        kenar.edges = .left
        kenar.delegate = self
        webView.addGestureRecognizer(kenar)
    }

    @objc private func kenardanKaydirildi(_ hareket: UIScreenEdgePanGestureRecognizer) {
        guard hareket.state == .ended, let alan = hareket.view else { return }
        let yol = hareket.translation(in: alan).x
        let hiz = hareket.velocity(in: alan).x
        guard yol > yolEsigi || hiz > hizEsigi else { return }
        bridge?.triggerWindowJSEvent(eventName: geriOlayi)
    }

    /// Kaydırmayla birlikte tanınmalı: tanınmasaydı kenardan başlayan her
    /// dokunuş sayfanın kendi kaydırmasını ve düğmelerini yutardı.
    func gestureRecognizer(
        _ gestureRecognizer: UIGestureRecognizer,
        shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer
    ) -> Bool {
        true
    }

    /// Tek tema var ve açık; durum çubuğu her koşulda koyu yazıyla çiziliyor.
    /// Sistemin gece modunu izleseydi koyu modda beyaz saat, krem zeminin
    /// üstünde okunmaz olurdu. Web tarafından (`SystemBars`) değil burada:
    /// JS yüklenmeden çizilen ilk karede de doğru olmalı.
    override var preferredStatusBarStyle: UIStatusBarStyle {
        .darkContent
    }
}
