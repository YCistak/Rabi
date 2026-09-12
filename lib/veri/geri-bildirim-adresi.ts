/**
 * Öneri ve hata bildirimlerinin gittiği adres — ikinci bir Google Form.
 *
 * Hatalı soru formuyla **aynı form değil**: o formun sütunları soruya göre
 * (kimlik, oyun, cevap…) ve tabloya serbest metin karışınca soru düzeltme
 * listesi okunmaz oluyor. Neden form olduğu, numaraların nereden çıktığı ve
 * form ayarları için `bildirim-adresi.ts`'deki açıklama burada da geçerli.
 *
 * Formda beş kısa cevap alanı olmalı, sırasıyla: Tür · Metin · Sürüm · Cihaz ·
 * Tarih. "Metin" için paragraf (uzun cevap) tipi seçilebilir; gönderim
 * açısından fark yok.
 */

/**
 * Formun kimliği — bağlantıdaki `/forms/d/e/XXXX/viewform` kısmı.
 *
 * Boş bırakıldığı sürece hiçbir şey gönderilmiyor: bildirimler cihazda
 * birikiyor, ekran bunu "bekliyor" diye gösteriyor.
 */
export const GERI_BILDIRIM_FORM_KIMLIGI: string = ''

/** Alan adı → formdaki `entry` numarası. */
export const GERI_BILDIRIM_ALANLARI: Record<string, string> = {
  tur: '',
  metin: '',
  surum: '',
  cihaz: '',
  tarih: '',
}

/** Adres eksikse gönderim hiç denenmiyor. */
export function geriBildirimAdresiHazirMi(): boolean {
  return (
    GERI_BILDIRIM_FORM_KIMLIGI !== '' &&
    Object.values(GERI_BILDIRIM_ALANLARI).every((e) => e !== '')
  )
}

export function geriBildirimFormAdresi(): string {
  return `https://docs.google.com/forms/d/e/${GERI_BILDIRIM_FORM_KIMLIGI}/formResponse`
}
