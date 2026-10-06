import ActivityKit
import AppIntents
import SwiftUI
import WidgetKit

/// Pomodoro sayacının kilit ekranı ve Dynamic Island çizimi (Live Activity).
///
/// Düzen iPhone'un kendi zamanlayıcısından: solda yuvarlak düğmeler, sağda
/// aşama ve büyük, akan sayı. Kullanıcı tam olarak bunu istedi ("tıpkı
/// iPhone'daki kronometre gibi") ve kilit ekranında başka bir düzen, telefonun
/// geri kalanından ayrı duran bir kart olurdu. Android'in bildiriminden
/// (`OdakServisi`) iki şey geldi: aşama + ders satırı ve ince ilerleme çubuğu.
///
/// Zemin koyu, uygulamanınki gibi kırık beyaz değil: Dynamic Island her
/// zaman siyah ve kilit ekranındaki kart onunla aynı şeyin iki hâli. Renkler
/// web'in tema değişkenlerinden okunamıyor (ayrı süreç); sayılar Android'in
/// `colors.xml`inden: amber `bildirim_amber` #E8783F — koyu zeminde okunan
/// ton, `marka_amber` orada fazla koyu kalıyor —, zemin `odak_metin`
/// #1B1A19. Biri değişirse öteki de.
///
/// Maskot `tavsan_yuz.png`: `public/tavsan-yuz.png`in kopyası (bkz.
/// AGENTS.md › "Engel katmanı"). Görsel değişirse bu kopya da.
@main
struct KilitSayaciPaketi: WidgetBundle {
    var body: some Widget {
        PomodoroSayaci()
    }
}

private let amber = Color(red: 0xE8 / 255, green: 0x78 / 255, blue: 0x3F / 255)
private let zemin = Color(red: 0x1B / 255, green: 0x1A / 255, blue: 0x19 / 255)
private let soluk = Color.white.opacity(0.6)

struct PomodoroSayaci: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: PomodoroEtkinligi.self) { baglam in
            KilitEkrani(durum: baglam.state, bayat: baglam.isStale)
                .activityBackgroundTint(zemin.opacity(0.92))
                .activitySystemActionForegroundColor(.white)
        } dynamicIsland: { baglam in
            let durum = baglam.state
            let bayat = baglam.isStale
            return DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Dugmeler(durum: durum, bayat: bayat, boyut: 44)
                        .padding(.leading, 4)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    VStack(alignment: .trailing, spacing: 0) {
                        Text(baslik(durum, bayat))
                            .font(.footnote.weight(.semibold))
                            .foregroundColor(soluk)
                            .lineLimit(1)
                        SayacYazisi(durum: durum, bayat: bayat)
                            .font(.system(size: 38, weight: .semibold, design: .rounded))
                    }
                    .padding(.trailing, 4)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Cubuk(durum: durum, bayat: bayat)
                        .padding(.horizontal, 4)
                        .padding(.top, 4)
                }
            } compactLeading: {
                Maskot(boyut: 22)
            } compactTrailing: {
                SayacYazisi(durum: durum, bayat: bayat)
                    .font(.system(size: 15, weight: .semibold, design: .rounded))
                    // Akan sayı bütün genişliği istiyor; sabitlenmezse ada
                    // ekranın yarısına uzar. Saatli sürede (prova) bir hane daha.
                    .frame(width: durum.toplam >= 3600 ? 62 : 46, alignment: .trailing)
            } minimal: {
                Maskot(boyut: 22)
            }
            .keylineTint(amber)
        }
    }
}

// MARK: - Kilit ekranı

private struct KilitEkrani: View {
    let durum: PomodoroEtkinligi.ContentState
    let bayat: Bool

    var body: some View {
        VStack(spacing: 12) {
            HStack(alignment: .center, spacing: 12) {
                Dugmeler(durum: durum, bayat: bayat, boyut: 46)
                Spacer(minLength: 8)
                VStack(alignment: .trailing, spacing: 0) {
                    Text(baslik(durum, bayat))
                        .font(.subheadline.weight(.semibold))
                        .foregroundColor(soluk)
                        .lineLimit(1)
                        // "Duraklatıldı · Matematik" iki düğmenin yanına
                        // sığmıyor; kesilen ders adı neyin durduğunu söylemez.
                        .minimumScaleFactor(0.8)
                    SayacYazisi(durum: durum, bayat: bayat)
                        .font(.system(size: 46, weight: .semibold, design: .rounded))
                }
            }
            Cubuk(durum: durum, bayat: bayat)
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 16)
    }
}

// MARK: - Parçalar

/// "Çalışma · Matematik", "Duraklatıldı · Matematik", "Süre doldu".
private func baslik(_ durum: PomodoroEtkinligi.ContentState, _ bayat: Bool) -> String {
    if bayat || bittiMi(durum) { return durum.mola ? "Mola bitti" : "Süre doldu" }
    let ilk = durum.bitis == nil ? "Duraklatıldı" : durum.asama
    guard let ders = durum.ders, !ders.isEmpty else { return ilk }
    return "\(ilk) · \(ders)"
}

private func bittiMi(_ durum: PomodoroEtkinligi.ContentState) -> Bool {
    guard let bitis = durum.bitis else { return false }
    return bitis <= Date()
}

/// Aşamanın başı: bitişten toplam süre kadar geri. Duraklama varsa gerçek
/// başlangıçtan sonraya düşüyor; çubuk o yüzden turun **geçen kısmını**
/// doğru gösteriyor (duraklamada geçen süre sayılmıyor).
private func aralik(_ bitis: Date, _ toplam: Double) -> ClosedRange<Date> {
    bitis.addingTimeInterval(-max(toplam, 1))...bitis
}

/// Sayı: işlerken sistemin kendi sayacı akıtıyor, duraklatılmışken donuk.
private struct SayacYazisi: View {
    let durum: PomodoroEtkinligi.ContentState
    let bayat: Bool

    var body: some View {
        Group {
            if bayat || bittiMi(durum) {
                Text(sureYaz(0))
                    .foregroundColor(soluk)
            } else if let bitis = durum.bitis {
                Text(timerInterval: aralik(bitis, durum.toplam), countsDown: true)
                    .foregroundColor(amber)
            } else {
                Text(sureYaz(durum.donukKalan))
                    .foregroundColor(soluk)
            }
        }
        .monospacedDigit()
        .multilineTextAlignment(.trailing)
        .lineLimit(1)
        .minimumScaleFactor(0.6)
    }
}

/// 25:00, saatli sürede 2:45:00 — `Text(timerInterval:)` ile aynı biçim,
/// duraklatınca sayının şekli değişmesin.
private func sureYaz(_ saniye: Double) -> String {
    let s = max(0, Int(saniye.rounded(.up)))
    let saat = s / 3600
    let dakika = (s % 3600) / 60
    let kalan = s % 60
    return saat > 0
        ? String(format: "%d:%02d:%02d", saat, dakika, kalan)
        : String(format: "%d:%02d", dakika, kalan)
}

private struct Cubuk: View {
    let durum: PomodoroEtkinligi.ContentState
    let bayat: Bool

    var body: some View {
        Group {
            if bayat || bittiMi(durum) {
                ProgressView(value: 1, total: 1)
            } else if let bitis = durum.bitis {
                ProgressView(timerInterval: aralik(bitis, durum.toplam), countsDown: false) {
                    EmptyView()
                } currentValueLabel: {
                    EmptyView()
                }
            } else {
                let toplam = max(durum.toplam, 1)
                ProgressView(value: min(toplam, max(0, toplam - durum.donukKalan)), total: toplam)
            }
        }
        .progressViewStyle(.linear)
        .tint(durum.bitis == nil || bayat ? soluk : amber)
        .labelsHidden()
    }
}

/// Solda iPhone zamanlayıcısının iki düğmesi: duraklat/devam ve turu bitir.
/// Düğmeli Live Activity iOS 17 istiyor; 16'da yerinde maskot duruyor.
private struct Dugmeler: View {
    let durum: PomodoroEtkinligi.ContentState
    let bayat: Bool
    let boyut: CGFloat

    var body: some View {
        if #available(iOS 17.0, *) {
            HStack(spacing: 10) {
                // Süre dolduysa duraklatacak bir şey yok; yalnızca bitir.
                if !(bayat || bittiMi(durum)) {
                    let isliyor = durum.bitis != nil
                    Button(intent: PomodoroKomutuNiyeti(komut: isliyor ? "duraklat" : "devam")) {
                        Yuvarlak(
                            simge: isliyor ? "pause.fill" : "play.fill",
                            renk: amber,
                            boyut: boyut
                        )
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(isliyor ? "Duraklat" : "Devam et")
                }
                Button(intent: PomodoroKomutuNiyeti(komut: "bitir")) {
                    Yuvarlak(simge: "xmark", renk: .white, boyut: boyut)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Turu bitir")
            }
        } else {
            Maskot(boyut: boyut)
        }
    }
}

private struct Yuvarlak: View {
    let simge: String
    let renk: Color
    let boyut: CGFloat

    var body: some View {
        Image(systemName: simge)
            .font(.system(size: boyut * 0.38, weight: .bold))
            .foregroundColor(renk)
            .frame(width: boyut, height: boyut)
            .background(Circle().fill(renk.opacity(0.22)))
    }
}

private struct Maskot: View {
    let boyut: CGFloat

    var body: some View {
        Image("tavsan_yuz")
            .resizable()
            .scaledToFit()
            .frame(width: boyut, height: boyut)
            .accessibilityHidden(true)
    }
}
