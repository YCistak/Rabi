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

        // Uygulamanın kendi eklentileri; npm paketi olmadığı için Capacitor onları
        // kendiliğinden bulamıyor (Android'de `MainActivity.registerPlugin`).
        bridge?.registerPluginInstance(EkranSuresiEklentisi())
        bridge?.registerPluginInstance(CanliSayacEklentisi())
        bridge?.registerPluginInstance(TemaEklentisi())

        guard let webView = webView else { return }

        // WebView'ın arkası (sayfa boyanana kadar ve esneyerek kaydırınca
        // görünen kenar) temayla dönen renk: açıkta #F8F8F7, koyuda #1A1612 —
        // açılış ekranının `AcilisZemini` varlığıyla aynı. `capacitor.config`
        // tek bir sabit renk alabildiği için burada.
        let zemin = UIColor(named: "AcilisZemini") ?? .systemBackground
        view.backgroundColor = zemin
        webView.backgroundColor = zemin
        webView.scrollView.backgroundColor = zemin

        // Sağda beliren kaydırma çubuğu: sayfanın kaydırması WKWebView'ın kendi
        // kaydırma görünümü ve çubuğu CSS'in değil UIKit'in. Uygulama bir belge
        // değil; konumu sayfanın kendisi söylüyor, çubuk yalnızca kenarda bir
        // kıpırtı. İç kaydırma kutularınınki `globals.css`te gizleniyor.
        webView.scrollView.showsVerticalScrollIndicator = false
        webView.scrollView.showsHorizontalScrollIndicator = false

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
        guard let alan = hareket.view else { return }
        let yol = hareket.translation(in: alan).x

        // Sayfa parmağı izlesin: web tarafı (`lib/geri-kaydirma.ts`)
        // `window.rabiGeriKaydirma`yı kuruyor; kurulmamışsa (Android'de ya da
        // sayfa yüklenmeden) `?.` sessizce hiçbir şey yapmıyor.
        switch hareket.state {
        case .began:
            // Kenar hareketi sayfanın kaydırmasıyla birlikte tanınıyor
            // (aşağıdaki delege); çapraz çeken parmak sayfayı yana kaydırırken
            // aşağı-yukarı da oynatıyordu. Hareket sürdükçe sayfanın kendi
            // kaydırması kapalı; kapatmak süren kaydırmayı da kesiyor.
            webView?.scrollView.isScrollEnabled = false
            webView?.evaluateJavaScript("window.rabiGeriKaydirma?.basla()", completionHandler: nil)
        case .changed:
            webView?.evaluateJavaScript("window.rabiGeriKaydirma?.ilerle(\(Int(max(0, yol))))", completionHandler: nil)
        case .ended:
            webView?.scrollView.isScrollEnabled = true
            let hiz = hareket.velocity(in: alan).x
            if yol > yolEsigi || hiz > hizEsigi {
                // Geri git: web tarafı sayfayı dışarı kaydırıp `geriGit`i
                // çağırıyor. Sola fırlatılmışsa (vazgeçme) web tarafı sayfayı
                // yerine döndürüyor (`lib/geri-kaydirma-hesap.ts`).
                bridge?.triggerWindowJSEvent(eventName: geriOlayi)
            } else {
                webView?.evaluateJavaScript("window.rabiGeriKaydirma?.iptal()", completionHandler: nil)
            }
        case .cancelled, .failed:
            webView?.scrollView.isScrollEnabled = true
            webView?.evaluateJavaScript("window.rabiGeriKaydirma?.iptal()", completionHandler: nil)
        default:
            break
        }
    }

    /// Kaydırmayla birlikte tanınmalı: tanınmasaydı kenardan başlayan her
    /// dokunuş sayfanın kendi kaydırmasını ve düğmelerini yutardı.
    func gestureRecognizer(
        _ gestureRecognizer: UIGestureRecognizer,
        shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer
    ) -> Bool {
        true
    }

    /// Durum çubuğu pencerenin görünümünü izliyor: pencereye uygulamanın
    /// teması yazılıyor (`TemaEklentisi.uygula`), açıkta koyu, koyuda açık saat.
    override var preferredStatusBarStyle: UIStatusBarStyle {
        .default
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        // Pencere ancak burada var; kayıtlı tema JS yüklenmeden uygulansın.
        TemaEklentisi.uygula(TemaEklentisi.kayitli(), pencere: view.window)
    }
}

/// Web'in tema tercihini yerli tarafa taşıyan köprü (`lib/tema-yerli.ts`;
/// Android'deki karşılığı `tema/TemaEklentisi.kt`).
///
/// Ayrı dosyada değil, çünkü yeni bir Swift dosyası Xcode projesine ayrıca
/// eklenmeyi gerektiriyor. Tercih `UserDefaults`ta: açılışta JS yüklenmeden
/// okunuyor. Pencereye yazılan görünüm klavyeyi, yerli seçicileri, durum
/// çubuğunu ve WebView arkasının rengini temaya döndürüyor. "Telefona uy"da
/// görünüm zorlanmıyor (`.unspecified`) ve WKWebView telefonun modunu
/// `prefers-color-scheme` olarak bildiriyor. Kayıt yoksa (ilk yükleme) de
/// "Telefona uy" — web'deki varsayılan.
///
/// Yerli açılış ekranı uygulamanın kaydını okuyamıyor, telefonun modunu
/// izliyor: telefonundan farklı temayı seçen kullanıcı soğuk açılışta bir
/// kesir an telefonun rengini görür (plan: docs/koyu-tema-plani.md, Faz 6).
public class TemaEklentisi: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "TemaEklentisi"
    public let jsName = "Tema"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "ayarla", returnType: CAPPluginReturnPromise),
    ]

    private static let anahtar = "rabi_tema"

    static func kayitli() -> String {
        UserDefaults.standard.string(forKey: anahtar) ?? "sistem"
    }

    static func uygula(_ tercih: String, pencere: UIWindow?) {
        switch tercih {
        case "acik": pencere?.overrideUserInterfaceStyle = .light
        case "koyu": pencere?.overrideUserInterfaceStyle = .dark
        default: pencere?.overrideUserInterfaceStyle = .unspecified
        }
    }

    @objc func ayarla(_ call: CAPPluginCall) {
        guard let tercih = call.getString("tercih"), ["sistem", "acik", "koyu"].contains(tercih) else {
            call.reject("tanınmayan tema")
            return
        }
        UserDefaults.standard.set(tercih, forKey: TemaEklentisi.anahtar)
        DispatchQueue.main.async {
            TemaEklentisi.uygula(tercih, pencere: self.bridge?.viewController?.view.window)
            call.resolve()
        }
    }
}
