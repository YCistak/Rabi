import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.fluxifyinteractive.rabi',
  appName: 'Rabi',
  webDir: 'out',
  ios: {
    // WebView yüklenirken arkası beyaz kalıyordu ve açılış ekranının krem
    // zemininden sonra bir kare beyaz yanıp sönüyordu. Açılış zemininin
    // yazıldığı yerlerden biri (bkz. LaunchScreen.storyboard).
    backgroundColor: '#F8F8F7',
    // Güvenli alanı iOS değil CSS veriyor (`--guvenli-ust`, `env()`); iOS da
    // içeriği kaydırsaydı boşluk iki kez uygulanırdı — Android'deki kuralın
    // aynısı.
    contentInset: 'never',
    // Uzun basışta bağlantının önizlemesi açılmasın: `touch-callout`un
    // kapattığı sistem menüsünün iOS'taki kardeşi (bkz. globals.css).
    allowsLinkPreview: false,
    preferredContentMode: 'mobile',
  },
}

export default config
