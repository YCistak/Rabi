/**
 * Bildirimlerin gittiği yer — Firebase Firestore.
 *
 * Önce iki Google Form'du. Form, sunucusuz çalışan ilk yoldu ama her yeni
 * alan için elle form açıp `entry` numarası kopyalamak gerekiyordu ve
 * yanıtlar bir Sheets tablosunda, geliştiricinin öteki her şeye baktığı
 * Firebase konsolundan ayrı duruyordu. Firebase projesi Crashlytics için
 * zaten var; Firestore aynı projenin içinde ve kayıt yazan kod alan adlarını
 * olduğu gibi gönderiyor.
 *
 * **SDK yok, REST var.** `@capacitor-firebase/firestore` gibi bir eklenti
 * eklemek yerine `CapacitorHttp` ile Firestore'un REST ucuna yazılıyor: yeni
 * yerli bağımlılık girmiyor, `hata-gonder.ts` ağa çıkan tek dosya olarak
 * kalıyor ve gönderilen gövde gözle okunuyor.
 *
 * **Güvenlik kurallara dayanıyor, anahtara değil.** Aşağıdaki API anahtarı
 * bir sır değil — Firebase'in web anahtarı tasarım gereği istemciye gömülür
 * ve APK'dan sökülebilir. Koruma Firestore kurallarında: iki koleksiyona
 * yalnızca `create` serbest, `read`/`update`/`delete` herkese kapalı, alan
 * adları ve boyları kuralda sayılı. Ele geçiren biri olsa olsa koleksiyona
 * çöp satır atar; olanı okuyamaz, silemez. Kural metni PLANNED.md'de.
 *
 * Ayrıca Google Cloud konsolunda anahtar **yalnızca Firestore API**'ye ve
 * Android uygulama imzasına kısıtlanmalı; bu da sökülen anahtarın başka bir
 * Google servisinde kullanılmasını engeller.
 */

/** Firebase proje kimliği — Proje ayarları → Genel → "Proje kimliği". */
export const PROJE_KIMLIGI: string = ''

/** Web API anahtarı — aynı sayfada "Web API anahtarı". */
export const API_ANAHTARI: string = ''

/** Koleksiyon adları; Firestore kurallarındaki adlarla birebir. */
export const KOLEKSIYONLAR = {
  hataliSoru: 'hatali-sorular',
  geriBildirim: 'geri-bildirimler',
} as const

/** Kimlik ya da anahtar boşsa hiçbir şey gönderilmiyor; kayıtlar cihazda bekliyor. */
export function firestoreHazirMi(): boolean {
  return PROJE_KIMLIGI !== '' && API_ANAHTARI !== ''
}

/** Koleksiyona belge ekleyen REST ucu; belge kimliğini Firestore veriyor. */
export function koleksiyonAdresi(koleksiyon: string): string {
  return `https://firestore.googleapis.com/v1/projects/${PROJE_KIMLIGI}/databases/(default)/documents/${koleksiyon}?key=${API_ANAHTARI}`
}
