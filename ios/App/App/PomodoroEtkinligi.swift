import ActivityKit
import AppIntents
import Foundation

/// Kilit ekranındaki ve Dynamic Island'daki Pomodoro sayacının verisi.
///
/// Android'de aynı işi ön plan servisinin bildirimi yapıyor (`OdakServisi`);
/// iOS'ta ön plan servisi yok, karşılığı Live Activity. Bu dosya **iki
/// hedefte birden** derleniyor: uygulama etkinliği başlatıp güncelliyor,
/// `KilitSayaci` eklentisi çiziyor. İkisi aynı tipi okumazsa sistem veriyi
/// çözemez ve kilit ekranında hiçbir şey görünmez.
///
/// Saniye saniye güncelleme yok: işleyen sayaç `bitis`ten sistemin kendi
/// sayacıyla (`Text(timerInterval:)`) akıyor. Uygulama arka planda uyurken
/// de doğru kalmasının tek yolu bu — web tarafının sayacı o sırada duruyor.
@available(iOS 16.1, *)
struct PomodoroEtkinligi: ActivityAttributes {
    struct ContentState: Codable, Hashable {
        /// İşlerken bitiş anı; duraklatılmışken `nil`.
        var bitis: Date?
        /// Duraklatılmışken kalan saniye. İşlerken okunmuyor.
        var donukKalan: Double
        /// Aşamanın tam süresi, saniye. Çubuk duraklamadan sonra da turun
        /// tamamına göre dolsun diye (Android'in çubuğu yalnızca kesintisiz
        /// parçayı ölçüyor; burada süre web'den geliyor).
        var toplam: Double
        /// "Çalışma", "Kısa mola", "Deneme provası".
        var asama: String
        var ders: String?
        var mola: Bool
    }
}

/// Kilit ekranındaki düğmeler: "duraklat", "devam", "bitir".
///
/// `LiveActivityIntent` uygulamanın **kendi sürecinde** çalışıyor — gerekirse
/// sistem uygulamayı arka planda uyandırıyor. Bu yüzden asıl iş eklentide
/// değil uygulamada (`CanliSayacEklentisi.komutIsle`): kalkanı kaldırmak,
/// bitiş bildirimini geri almak ve web tarafına haber vermek uygulamanın işi.
/// Eklenti hedefinde bu dosya yalnızca düğmeyi kurabilmek için var ve orada
/// `isleyici` boş kalıyor.
@available(iOS 17.0, *)
struct PomodoroKomutuNiyeti: LiveActivityIntent {
    static var title: LocalizedStringResource = "Pomodoro"
    static var isDiscoverable = false

    @Parameter(title: "Komut")
    var komut: String

    init() {}

    init(komut: String) {
        self.komut = komut
    }

    func perform() async throws -> some IntentResult {
        await PomodoroKomutuKoprusu.isleyici?(komut)
        return .result()
    }
}

/// Niyetten uygulamaya giden yol. Uygulama açılışta kuruyor (`AppDelegate`);
/// köprü ya da WebView henüz yokken de çalışmalı — düğmeye basıldığında
/// uygulama arka planda yeni uyanmış olabiliyor.
enum PomodoroKomutuKoprusu {
    static var isleyici: ((String) async -> Void)?
}
