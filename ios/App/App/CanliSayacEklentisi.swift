import ActivityKit
import Capacitor
import UserNotifications

/// Pomodoro sayacının kilit ekranındaki ve Dynamic Island'daki hâli (Live
/// Activity). Köprüsü `lib/canli-sayac.ts`, çizimi `KilitSayaci` eklentisi.
///
/// Sorun şuydu: iOS'ta tur başlatılıp uygulama alta alınınca ya da ekran
/// kilitlenince sayaç hiçbir yerde görünmüyordu — Android'deki kalıcı
/// bildirimin (`OdakServisi`) iOS'ta karşılığı yoktu ve "kaç dakika
/// kaldı"yı öğrenmenin tek yolu uygulamayı açmaktı. Live Activity iPhone'un
/// kendi zamanlayıcısının yolu: kilit ekranında kart, Dynamic Island'da
/// akan sayı.
///
/// Sayacın iki kopyası var, Android'deki gibi: biri burada (etkinliğin
/// durumu), biri web'de. Kilit ekranındaki düğme yalnızca bunu değiştiriyor
/// ve `pomodoroKomutu` olayıyla web'e haber veriyor. Komutun gerektirdiği yerli
/// işler (kalkan, bitiş bildirimi) web'i beklemeden burada yapılıyor: web o
/// sırada uyuyor olabilir.
@objc(CanliSayacEklentisi)
public class CanliSayacEklentisi: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "CanliSayacEklentisi"
    public let jsName = "CanliSayac"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "baslat", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "duraklat", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "bitir", returnType: CAPPluginReturnPromise),
    ]

    /// Niyetten eklentiye giden olay. Niyet köprüyü tanımıyor; eklenti
    /// yüklüyse (WebView ayaktaysa) olayı web'e geçiriyor, değilse haber
    /// verecek bir web de yok.
    static let komutOlayi = Notification.Name("rabiPomodoroKomutu")

    /// `lib/bildirim.ts`teki `POMODORO_ID`. Capacitor'ın yerel bildirim
    /// eklentisi kimliği metin olarak kullanıyor; ikisi ayrılırsa duraklatılan
    /// turun bitiş zili yine çalar.
    static let bildirimKimligi = "1"

    override public func load() {
        NotificationCenter.default.addObserver(
            self, selector: #selector(komutGeldi(_:)), name: Self.komutOlayi, object: nil
        )
    }

    @objc private func komutGeldi(_ bildirim: Notification) {
        guard let veri = bildirim.userInfo as? [String: Any] else { return }
        // Web arka planda uyurken gelen komut kaybolmasın: dinleyici o an
        // yoksa olay uygulama dönünce teslim ediliyor.
        notifyListeners("pomodoroKomutu", data: veri, retainUntilConsumed: true)
    }

    @objc func baslat(_ call: CAPPluginCall) {
        guard #available(iOS 16.2, *) else {
            call.resolve(["basladi": false])
            return
        }
        let bitisMs = call.getDouble("bitisZamani") ?? 0
        guard bitisMs > 0 else {
            call.resolve(["basladi": false])
            return
        }
        let bitis = Date(timeIntervalSince1970: bitisMs / 1000)
        let toplam = call.getDouble("toplamSaniye") ?? max(0, bitis.timeIntervalSinceNow)
        let durum = PomodoroEtkinligi.ContentState(
            bitis: bitis,
            donukKalan: max(0, bitis.timeIntervalSinceNow),
            toplam: max(toplam, bitis.timeIntervalSinceNow),
            asama: call.getString("asama") ?? "Çalışma",
            ders: call.getString("ders"),
            mola: call.getBool("mola") ?? false
        )
        let kilitAcik = call.getBool("kilitAcik") ?? false
        Task {
            let basladi = await CanliSayac.baslat(durum, kilitAcik: kilitAcik)
            call.resolve(["basladi": basladi])
        }
    }

    @objc func duraklat(_ call: CAPPluginCall) {
        guard #available(iOS 16.2, *) else {
            call.resolve()
            return
        }
        Task {
            _ = await CanliSayac.duraklat()
            call.resolve()
        }
    }

    @objc func bitir(_ call: CAPPluginCall) {
        guard #available(iOS 16.2, *) else {
            call.resolve()
            return
        }
        Task {
            await CanliSayac.bitir()
            call.resolve()
        }
    }

    /// Kilit ekranındaki düğmeye basıldı (`PomodoroKomutuNiyeti`).
    static func komutIsle(_ komut: String) async {
        guard #available(iOS 16.2, *) else { return }
        let merkez = UNUserNotificationCenter.current()

        switch komut {
        case "duraklat":
            guard await CanliSayac.duraklat() else { return }
            // Duraklatılmış tur kalkanı tutmuyor (`odakKilidiniDuraklat`'ın
            // gerekçesi): unutulan bir tur uygulamaları süresiz kapalı bırakırdı.
            EkranSuresiEklentisi.kalkaniKaldir()
            merkez.removePendingNotificationRequests(withIdentifiers: [bildirimKimligi])
            haberVer(["komut": "duraklat", "bitisZamani": 0])

        case "devam":
            guard let bitis = await CanliSayac.devam() else { return }
            let bitisMs = bitis.timeIntervalSince1970 * 1000
            if CanliSayac.kilitAcik {
                _ = EkranSuresiEklentisi.kalkaniKur(kilitAcik: true, bitisMs: bitisMs)
            }
            await bitisBildirimiKur(bitis, mola: CanliSayac.molaMi)
            haberVer(["komut": "devam", "bitisZamani": bitisMs])

        case "bitir":
            await CanliSayac.bitir()
            EkranSuresiEklentisi.kalkaniKaldir()
            merkez.removePendingNotificationRequests(withIdentifiers: [bildirimKimligi])
            haberVer(["komut": "bitir", "bitisZamani": 0])

        default:
            break
        }
    }

    private static func haberVer(_ veri: [String: Any]) {
        DispatchQueue.main.async {
            NotificationCenter.default.post(name: komutOlayi, object: nil, userInfo: veri)
        }
    }

    /// Devam edilen turun bitiş zili. Normalde web kuruyor (`pomodoroPlanla`)
    /// ama düğme kilit ekranında basıldığında web uyuyor ve zil ancak
    /// uygulama açılınca kurulurdu. Metin `lib/bildirim.ts`tekiyle aynı;
    /// biri değişirse öteki de. Web uyanınca aynı kimlikle yeniden kuruyor,
    /// iki zil çalmıyor.
    private static func bitisBildirimiKur(_ bitis: Date, mola: Bool) async {
        let merkez = UNUserNotificationCenter.current()
        let ayarlar = await merkez.notificationSettings()
        guard ayarlar.authorizationStatus == .authorized,
              bitis.timeIntervalSinceNow > 1 else { return }

        let icerik = UNMutableNotificationContent()
        icerik.title = mola ? "Mola bitti" : "Seans bitti"
        icerik.body = mola ? "Hazırsan bir tur daha? 🐰" : "Biraz ara ver. 🐰"
        icerik.sound = .default
        let tetik = UNTimeIntervalNotificationTrigger(
            timeInterval: bitis.timeIntervalSinceNow, repeats: false
        )
        merkez.removePendingNotificationRequests(withIdentifiers: [bildirimKimligi])
        try? await merkez.add(UNNotificationRequest(identifier: bildirimKimligi, content: icerik, trigger: tetik))
    }
}

/// Etkinliğin kendisi. Aynı anda tek etkinlik var; yine de bütün liste
/// dolaşılıyor — uygulama zorla kapatılıp açıldığında eskisi askıda kalabilir.
@available(iOS 16.2, *)
enum CanliSayac {
    /// Bu turda kalkan istendi mi. "Devam et" kalkanı yeniden kurarken
    /// soruyor; web o sırada uyuyor olabilir.
    private static let kilitAnahtari = "rabi.canli.kilit"

    static var kilitAcik: Bool { UserDefaults.standard.bool(forKey: kilitAnahtari) }

    static var molaMi: Bool { Activity<PomodoroEtkinligi>.activities.first?.content.state.mola ?? false }

    static func baslat(_ durum: PomodoroEtkinligi.ContentState, kilitAcik: Bool) async -> Bool {
        UserDefaults.standard.set(kilitAcik, forKey: kilitAnahtari)
        // Bayatlama bitişte: sayaç sıfıra varınca web uyuyorsa etkinliği
        // kapatacak kimse yok; kart o zaman "Süre doldu" diyor.
        let icerik = ActivityContent(state: durum, staleDate: durum.bitis)

        var etkinlikler = Activity<PomodoroEtkinligi>.activities
        if let mevcut = etkinlikler.first {
            etkinlikler.removeFirst()
            for fazla in etkinlikler { await fazla.end(nil, dismissalPolicy: .immediate) }
            await mevcut.update(icerik)
            return true
        }
        // Kullanıcı Ayarlar'dan Rabi'nin canlı etkinliklerini kapattıysa
        // istek hata veriyor; tur yine çalışıyor, yalnızca kilit ekranında yok.
        guard ActivityAuthorizationInfo().areActivitiesEnabled else { return false }
        do {
            _ = try Activity<PomodoroEtkinligi>.request(attributes: PomodoroEtkinligi(), content: icerik, pushType: nil)
            return true
        } catch {
            return false
        }
    }

    /// İşleyen sayacı dondurur; duraklatılmış ya da hiç yoksa `false`.
    static func duraklat() async -> Bool {
        guard let etkinlik = Activity<PomodoroEtkinligi>.activities.first,
              let bitis = etkinlik.content.state.bitis else { return false }
        var durum = etkinlik.content.state
        durum.donukKalan = max(0, bitis.timeIntervalSinceNow)
        durum.bitis = nil
        await etkinlik.update(ActivityContent(state: durum, staleDate: nil))
        return true
    }

    /// Donmuş sayacı yeniden işletir; yeni bitiş anını döndürür.
    static func devam() async -> Date? {
        guard let etkinlik = Activity<PomodoroEtkinligi>.activities.first,
              etkinlik.content.state.bitis == nil else { return nil }
        var durum = etkinlik.content.state
        let bitis = Date().addingTimeInterval(durum.donukKalan)
        durum.bitis = bitis
        await etkinlik.update(ActivityContent(state: durum, staleDate: bitis))
        return bitis
    }

    static func bitir() async {
        for etkinlik in Activity<PomodoroEtkinligi>.activities {
            await etkinlik.end(nil, dismissalPolicy: .immediate)
        }
    }
}
