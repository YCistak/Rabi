import DeviceActivity
import ManagedSettings

/// Tur bitince kalkanı kaldıran eklenti.
///
/// iOS arka plandaki Rabi'yi uyutuyor; tur sonunda uygulama çalışmıyor
/// olabilir ve kalkanı kaldıracak kimse kalmaz — öğrenci tur çoktan bitmişken
/// Instagram'ı hâlâ açamıyor olurdu. Bu eklentiyi sistem, uygulamanın kurduğu
/// zamanlayıcının (`DeviceActivitySchedule`) sonunda kendisi uyandırıyor.
///
/// Tek işi bu. Depo ve zamanlayıcının adları uygulamadakiyle
/// (`EkranSuresiEklentisi.swift`) aynı olmak zorunda: eklenti ayrı bir süreç ve
/// o dosyayı göremiyor, adlar burada yeniden yazılı.
class OdakIzleyici: DeviceActivityMonitor {
    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        guard activity == DeviceActivityName("rabiTur") else { return }
        ManagedSettingsStore(named: ManagedSettingsStore.Name("rabi")).clearAllSettings()
    }
}
