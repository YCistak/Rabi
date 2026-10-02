import Capacitor
import DeviceActivity
import FamilyControls
import ManagedSettings
import SwiftUI

/// iOS'ta odak kilidi: Screen Time API'si (FamilyControls + ManagedSettings +
/// DeviceActivity).
///
/// Android'in odak kilidinin karşılığı ama yolu başka: iOS başka bir uygulamanın
/// üstüne katman çizmeye ve önde hangi uygulamanın olduğunu okumaya izin
/// vermiyor. Onun yerine sistemin kendisi seçilen uygulamaları "kalkanlıyor":
/// açılmıyorlar, bildirimleri de gelmiyor. Android'deki iki ayrı özellik
/// (uygulama kilidi + Rahatsız Etme) burada tek bir seçim.
///
/// Uygulama listesi Rabi'ye **verilmiyor**: seçim Apple'ın kendi seçicisinden
/// (`FamilyActivityPicker`) yapılıyor ve elimize uygulama adı değil opak
/// belirteçler geçiyor. Seçim cihazdan çıkmıyor; yalnızca burada,
/// `UserDefaults`'ta duruyor.
///
/// Tur bitince kalkanı kaldıran şey `OdakIzleyici` eklentisi: iOS arka plandaki
/// Rabi'yi uyutuyor ve tur sonunda uygulama çalışmıyor olabilir. Eklenti
/// sistemin zamanlayıcısıyla (DeviceActivity) uyandırılıyor. Web tarafı da
/// her duraklatma, tur sonu ve açılışta `kaldir` çağırıyor — yedek o.
///
/// Bütün API'ler iOS 16 istiyor (kişinin kendi telefonu için yetki,
/// `.individual`). Uygulama iOS 15'te de açılıyor; orada özellik yok.
@objc(EkranSuresiEklentisi)
public class EkranSuresiEklentisi: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "EkranSuresiEklentisi"
    public let jsName = "EkranSuresi"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "durum", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "izinIste", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "uygulamaSec", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "kilitle", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "kaldir", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "listeGoster", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "listeGizle", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "listeKaldir", returnType: CAPPluginReturnPromise),
    ]

    /// Seçimin `UserDefaults` anahtarı.
    private let secimAnahtari = "rabi.odak.secim"

    /// Pomodoro'daki engelli uygulama listesi (bkz. `listeGoster`).
    private var listeBarindirici: UIViewController?
    private var kaydirmaGozlemi: NSKeyValueObservation?
    /// Listenin görünebileceği dikey bant, ekran koordinatında (CSS piksel):
    /// üstte durum çubuğu, altta yapışık Başlat düğmesi ve alt menü var.
    private var gorunurBant: (ust: CGFloat, alt: CGFloat) = (0, .greatestFiniteMagnitude)

    @objc func durum(_ call: CAPPluginCall) {
        guard #available(iOS 16.0, *) else {
            call.resolve(["destek": false, "izin": "yok", "secimSayisi": 0])
            return
        }
        call.resolve([
            "destek": true,
            "izin": izinAdi(AuthorizationCenter.shared.authorizationStatus),
            "secimSayisi": secimSayisi(kayitliSecim()),
        ])
    }

    @objc func izinIste(_ call: CAPPluginCall) {
        guard #available(iOS 16.0, *) else {
            call.resolve(["izin": "yok"])
            return
        }
        Task { @MainActor in
            // Reddedilirse hata fırlatıyor; reddetmek bir hata değil, bir cevap.
            try? await AuthorizationCenter.shared.requestAuthorization(for: .individual)
            call.resolve(["izin": izinAdi(AuthorizationCenter.shared.authorizationStatus)])
        }
    }

    @objc func uygulamaSec(_ call: CAPPluginCall) {
        guard #available(iOS 16.0, *) else {
            call.resolve(["secimSayisi": 0, "kaydedildi": false])
            return
        }
        DispatchQueue.main.async {
            let model = SecimModeli(secim: self.kayitliSecim())
            var sayfa: UIViewController?
            let gorunum = UygulamaSecici(
                model: model,
                kaydet: { secim in
                    self.secimiKaydet(secim)
                    sayfa?.dismiss(animated: true)
                    call.resolve(["secimSayisi": self.secimSayisi(secim), "kaydedildi": true])
                },
                vazgec: {
                    sayfa?.dismiss(animated: true)
                    call.resolve(["secimSayisi": self.secimSayisi(self.kayitliSecim()), "kaydedildi": false])
                }
            )
            let barindirici = UIHostingController(rootView: gorunum)
            sayfa = barindirici
            self.bridge?.viewController?.present(barindirici, animated: true)
        }
    }

    /// Turun koruması. `kilitAcik` yanlışsa kalkan kaldırılıyor — web tarafı
    /// her tur başında çağırıyor, korumasız tur da bir karar.
    @objc func kilitle(_ call: CAPPluginCall) {
        guard #available(iOS 16.0, *) else {
            call.resolve(["kilitlendi": false])
            return
        }
        let kilitAcik = call.getBool("kilitAcik") ?? false
        let bitisMs = call.getDouble("bitisZamani") ?? 0
        let secim = kayitliSecim()

        guard kilitAcik, bitisMs > 0, secimSayisi(secim) > 0,
              AuthorizationCenter.shared.authorizationStatus == .approved
        else {
            kalkaniKaldir()
            call.resolve(["kilitlendi": false])
            return
        }

        let depo = ManagedSettingsStore(named: .rabi)
        depo.shield.applications = secim.applicationTokens.isEmpty ? nil : secim.applicationTokens
        depo.shield.applicationCategories = secim.categoryTokens.isEmpty
            ? nil : .specific(secim.categoryTokens)
        depo.shield.webDomains = secim.webDomainTokens.isEmpty ? nil : secim.webDomainTokens

        // Kalkanı tur sonunda kaldıracak zamanlayıcı. DeviceActivity en az 15
        // dakikalık aralık kabul ediyor: daha kısa bir turda aralığın başı
        // geçmişe çekiliyor, sonu yine turun sonu — kalkanı kaldıran şey sondaki
        // `intervalDidEnd`, başın nerede olduğu önemli değil.
        let bitis = Date(timeIntervalSince1970: bitisMs / 1000)
        let baslangic = min(Date(), bitis.addingTimeInterval(-15 * 60))
        let bilesenler: Set<Calendar.Component> = [.year, .month, .day, .hour, .minute, .second]
        let takvim = Calendar.current
        let program = DeviceActivitySchedule(
            intervalStart: takvim.dateComponents(bilesenler, from: baslangic),
            intervalEnd: takvim.dateComponents(bilesenler, from: bitis),
            repeats: false
        )
        let merkez = DeviceActivityCenter()
        merkez.stopMonitoring([.rabiTur])
        do {
            try merkez.startMonitoring(.rabiTur, during: program)
        } catch {
            // Zamanlayıcı kurulamadıysa kalkan yine duruyor; web tarafı tur
            // sonunda ve uygulama açılınca `kaldir` çağırıyor.
        }
        call.resolve(["kilitlendi": true])
    }

    @objc func kaldir(_ call: CAPPluginCall) {
        if #available(iOS 16.0, *) {
            kalkaniKaldir()
        }
        call.resolve()
    }

    /// Engellenen uygulamaların listesi, Pomodoro'nun sayfasının içinde.
    ///
    /// Uygulamaların adı ve ikonu Rabi'ye verilmiyor (opak belirteç); onları
    /// yalnızca sistemin kendi çizimi (`Label(token)`) gösterebiliyor ve o
    /// çizim bir görüntüye de alınamıyor. Web tarafı bu yüzden listenin
    /// yerini boş bırakıyor, yerli liste tam o yere, WKWebView'ın kaydırma
    /// görünümünün **içine** konuyor: sayfayla birlikte kayıyor, JS'in
    /// her kaydırmada yer bildirmesine gerek kalmıyor.
    ///
    /// Sayfanın içinde ama web'in üstünde çiziliyor; bu yüzden iki şey
    /// gerekiyor: kaydırınca durum çubuğunun, yapışık düğmenin ve alt menünün
    /// üstüne taşmasın diye `gorunurBant`ın dışı maskeleniyor, web'de bir
    /// pencere açılınca da web tarafı `listeGizle` diyor.
    ///
    /// Dokunuş almıyor: kaydırma altındaki sayfaya geçmeli. Değiştirmek
    /// "Uygulamaları düzenle" düğmesinden.
    @objc func listeGoster(_ call: CAPPluginCall) {
        guard #available(iOS 16.0, *) else {
            call.resolve(["satir": 0])
            return
        }
        let x = CGFloat(call.getDouble("x") ?? 0)
        let y = CGFloat(call.getDouble("y") ?? 0)
        let genislik = CGFloat(call.getDouble("genislik") ?? 0)
        let ust = CGFloat(call.getDouble("ust") ?? 0)
        let alt = CGFloat(call.getDouble("alt") ?? Double(Float.greatestFiniteMagnitude))

        DispatchQueue.main.async {
            guard let kaydirma = self.bridge?.webView?.scrollView else {
                call.resolve(["satir": 0])
                return
            }
            let secim = self.kayitliSecim()
            let satir = self.secimSayisi(secim)
            let liste = EngelListesi(secim: secim)

            let barindirici: UIHostingController<EngelListesi>
            if let mevcut = self.listeBarindirici as? UIHostingController<EngelListesi> {
                mevcut.rootView = liste
                barindirici = mevcut
            } else {
                barindirici = UIHostingController(rootView: liste)
                barindirici.view.backgroundColor = .clear
                barindirici.view.isUserInteractionEnabled = false
                if let ana = self.bridge?.viewController {
                    ana.addChild(barindirici)
                    kaydirma.addSubview(barindirici.view)
                    barindirici.didMove(toParent: ana)
                } else {
                    kaydirma.addSubview(barindirici.view)
                }
                self.listeBarindirici = barindirici
                self.kaydirmaGozlemi = kaydirma.observe(\.contentOffset, options: [.new]) { [weak self] _, _ in
                    self?.listeyiMaskele()
                }
            }
            barindirici.view.frame = CGRect(
                x: x, y: y, width: genislik, height: CGFloat(satir) * EngelListesi.satirYuksekligi
            )
            barindirici.view.isHidden = satir == 0
            self.gorunurBant = (ust, alt)
            self.listeyiMaskele()
            call.resolve(["satir": satir])
        }
    }

    @objc func listeGizle(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.listeBarindirici?.view.isHidden = true
            call.resolve()
        }
    }

    @objc func listeKaldir(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.kaydirmaGozlemi?.invalidate()
            self.kaydirmaGozlemi = nil
            if let barindirici = self.listeBarindirici {
                barindirici.willMove(toParent: nil)
                barindirici.view.removeFromSuperview()
                barindirici.removeFromParent()
            }
            self.listeBarindirici = nil
            call.resolve()
        }
    }

    /// Listenin `gorunurBant` dışında kalan kısmını keser.
    private func listeyiMaskele() {
        guard let gorunum = listeBarindirici?.view,
              let kaydirma = bridge?.webView?.scrollView else { return }
        let ustSinir = kaydirma.contentOffset.y + gorunurBant.ust - gorunum.frame.minY
        let altSinir = kaydirma.contentOffset.y + gorunurBant.alt - gorunum.frame.minY
        let bas = min(max(0, ustSinir), gorunum.bounds.height)
        let son = min(max(bas, altSinir), gorunum.bounds.height)
        let maske = gorunum.layer.mask ?? CALayer()
        maske.backgroundColor = UIColor.black.cgColor
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        maske.frame = CGRect(x: 0, y: bas, width: gorunum.bounds.width, height: son - bas)
        gorunum.layer.mask = maske
        CATransaction.commit()
    }

    // MARK: - Yardımcılar

    @available(iOS 16.0, *)
    private func kalkaniKaldir() {
        ManagedSettingsStore(named: .rabi).clearAllSettings()
        DeviceActivityCenter().stopMonitoring([.rabiTur])
    }

    @available(iOS 16.0, *)
    private func kayitliSecim() -> FamilyActivitySelection {
        guard let veri = UserDefaults.standard.data(forKey: secimAnahtari),
              let secim = try? JSONDecoder().decode(FamilyActivitySelection.self, from: veri)
        else { return FamilyActivitySelection() }
        return secim
    }

    @available(iOS 16.0, *)
    private func secimiKaydet(_ secim: FamilyActivitySelection) {
        if let veri = try? JSONEncoder().encode(secim) {
            UserDefaults.standard.set(veri, forKey: secimAnahtari)
        }
    }

    @available(iOS 16.0, *)
    private func secimSayisi(_ secim: FamilyActivitySelection) -> Int {
        secim.applicationTokens.count + secim.categoryTokens.count + secim.webDomainTokens.count
    }

    @available(iOS 16.0, *)
    private func izinAdi(_ durum: AuthorizationStatus) -> String {
        switch durum {
        case .approved: return "verildi"
        case .denied: return "reddedildi"
        default: return "sorulmadi"
        }
    }
}

/// Kalkanın deposu ve zamanlayıcının adı — `OdakIzleyici` eklentisi de aynı
/// adları kullanıyor; ikisi ayrılırsa tur sonunda kalkan kalkmaz.
@available(iOS 16.0, *)
extension ManagedSettingsStore.Name {
    static let rabi = Self("rabi")
}

extension DeviceActivityName {
    static let rabiTur = Self("rabiTur")
}

@available(iOS 16.0, *)
final class SecimModeli: ObservableObject {
    @Published var secim: FamilyActivitySelection
    init(secim: FamilyActivitySelection) { self.secim = secim }
}

/// Apple'ın seçicisi, Rabi'nin başlığı ve iki düğmesiyle.
///
/// Aşağı kaydırarak kapatma kapalı: kapatılan sayfa "kaydet" mi "vazgeç" mi
/// belirsiz kalıyordu ve JS tarafındaki çağrı hiç dönmezdi.
///
/// Seçili olanlar burada ayrıca listelenmiyor: liste Pomodoro'nun kendi
/// sayfasında (`EngelListesi`) ve kullanıcı eklerken ikinci bir kopyasını
/// görmek istemedi. Bir süre seçicinin üstünde bir şerit vardı.
@available(iOS 16.0, *)
struct UygulamaSecici: View {
    @ObservedObject var model: SecimModeli
    let kaydet: (FamilyActivitySelection) -> Void
    let vazgec: () -> Void

    var body: some View {
        NavigationView {
            FamilyActivityPicker(selection: $model.secim)
                .navigationTitle("Engellenecekler")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Vazgeç", action: vazgec)
                    }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Kaydet") { kaydet(model.secim) }
                    }
                }
        }
        .interactiveDismissDisabled()
    }
}

/// Pomodoro'daki engelli uygulama listesi: Android'deki uygulama listesinin
/// satırları gibi, ikon ve ad. Satır yüksekliği sabit, çünkü web tarafı
/// listenin yerini satır sayısından ayırıyor (`ios-odak-ayarlari.tsx`,
/// `SATIR_YUKSEKLIGI`); ikisi birlikte değişir.
@available(iOS 16.0, *)
struct EngelListesi: View {
    static let satirYuksekligi: CGFloat = 48
    let secim: FamilyActivitySelection

    var body: some View {
        VStack(spacing: 0) {
            ForEach(Array(secim.applicationTokens), id: \.self) { Label($0).engelSatiri() }
            ForEach(Array(secim.categoryTokens), id: \.self) { Label($0).engelSatiri() }
            ForEach(Array(secim.webDomainTokens), id: \.self) { Label($0).engelSatiri() }
        }
        .frame(maxWidth: .infinity, alignment: .topLeading)
    }
}

private extension View {
    /// Renkler web'in tema değişkenlerinin sayısı: yazı `--foreground`,
    /// çizgi `--border`. Yerli taraf CSS değişkenini okuyamıyor.
    @available(iOS 16.0, *)
    func engelSatiri() -> some View {
        self
            .labelStyle(.titleAndIcon)
            .font(.system(size: 15, weight: .semibold))
            .foregroundColor(Color(red: 0x1B / 255, green: 0x1A / 255, blue: 0x19 / 255))
            .lineLimit(1)
            .padding(.horizontal, 16)
            .frame(maxWidth: .infinity, alignment: .leading)
            .frame(height: EngelListesi.satirYuksekligi)
            .overlay(alignment: .top) {
                Rectangle()
                    .fill(Color(red: 0xEA / 255, green: 0xE9 / 255, blue: 0xE6 / 255))
                    .frame(height: 1)
            }
    }
}
