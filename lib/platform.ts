import { Capacitor } from '@capacitor/core'

/**
 * Hangi yerli kabukta çalışıldığı.
 *
 * `Capacitor.isNativePlatform()` iOS'ta da `true` dönüyor ve yalnızca
 * Android'de yazılmış bir eklentiye (odak kilidi, Play güncellemesi, çökme
 * raporu) sorulan her soru iOS'ta "UNIMPLEMENTED" ile reddediliyor. Çağrılar
 * try/catch içinde olduğu için uygulama çökmüyor ama **arayüz** özelliği
 * varmış gibi çiziliyordu: iOS'ta hiçbir şey yapmayan bir odak koruması
 * anahtarı. Özelliğin var olup olmadığı bu yüzden platformla soruluyor.
 */
export function androidMu(): boolean {
  return Capacitor.getPlatform() === 'android'
}

export function iosMu(): boolean {
  return Capacitor.getPlatform() === 'ios'
}
