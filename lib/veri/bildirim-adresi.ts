/**
 * Hatalı soru bildirimlerinin gittiği adres — bir Google Form.
 *
 * Neden form: sunucu kurmadan, hesap istemeden, kota dolmadan çalışan tek yol.
 * Gelen bildirimler formun bağlı olduğu Google Sheets tablosuna satır satır
 * düşüyor. APK'da duran tek şey aşağıdaki numaralar; bunlar bir kimlik bilgisi
 * değil — ele geçiren biri olsa olsa tabloya çöp satır atar, başka hiçbir şeye
 * erişemez.
 *
 * Numaralar formun "önceden doldurulmuş bağlantı"sından çıkıyor:
 * Form → ⋮ → "Önceden doldurulmuş bağlantı al" → kutulara sırayla değer yaz →
 * bağlantıyı kopyala. Çıkan adreste `entry.123456789=deger` çiftleri var.
 *
 * Formun ayarlarında **e-posta toplama kapalı**, **"yanıtı 1 ile sınırla"
 * kapalı** olmalı; açık olursa gönderim giriş ister ve reddedilir.
 */

/**
 * Formun kimliği — bağlantıdaki `/forms/d/e/XXXX/viewform` kısmı.
 *
 * Boş bırakıldığı sürece hiçbir şey gönderilmiyor: bildirimler cihazda
 * birikiyor, uygulama ağa hiç çıkmıyor.
 */
export const FORM_KIMLIGI: string = '1FAIpQLSeLmPYIDs4RSGxpqRnC-LhhmKhifwZfO_ihmuRxEel-rvJMWQ'

/** Alan adı → formdaki `entry` numarası. */
export const ALANLAR: Record<string, string> = {
  kimlik: 'entry.583695316',
  oyun: 'entry.1290091604',
  soru: 'entry.53840930',
  cevap: 'entry.667274758',
  sebep: 'entry.1577263308',
  surum: 'entry.239853441',
  cihaz: 'entry.338085962',
}

/** Adres eksikse gönderim hiç denenmiyor. */
export function adresHazirMi(): boolean {
  return FORM_KIMLIGI !== '' && Object.values(ALANLAR).every((e) => e !== '')
}

export function formAdresi(): string {
  return `https://docs.google.com/forms/d/e/${FORM_KIMLIGI}/formResponse`
}
