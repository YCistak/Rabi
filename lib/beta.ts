/**
 * Kapalı betada gizlenen bölümler.
 *
 * Play'in kapalı betasına çıkarken bitmemiş iki bölüm kullanıcıdan saklandı;
 * biri (Konu Anlatımı) açıldı ve bayrağı dosyadan düştü, geriye haftalık özet
 * kaldı. Kodları **silinmiyor**: bölüm çalışır durumda ve sıradaki
 * güncellemede geri açılacak. Silinseydi geri getirmek yeniden yazmak olurdu;
 * bayrak, o güne kadar kodun derlenmeye ve testlerin koşmaya devam etmesini
 * sağlıyor — çürüyen bir dal olarak beklemiyor.
 *
 * Bayrak burada duruyor ki betada neyin kapalı olduğu tek yerden okunabilsin;
 * ekranların içine serpiştirilmiş `false` sabitleri, açılma zamanı geldiğinde
 * tek tek aranırdı.
 *
 * **Geri açarken:** bayrağı `true` yap, ekranı telefonda bir uçtan bir uca
 * dene, sonra bu dosyadan da düş. Kalıcı olarak kalan bir bayrak, ölü bir
 * dalın kapısı olur.
 *
 * Buraya yalnızca **geçici** gizlemeler girer. Kalıcı olarak kaldırılan bir
 * özellik bayrakla kapatılmaz, kodu silinir — ana sayfadaki kısayol düzenleme
 * penceresinde yapıldığı gibi.
 */

/**
 * Haftalık özet — ana sayfanın en üstündeki davet kartı ve açtığı hikâye.
 *
 * Kapalı: özet haftada bir kendiliğinden doğuyor ve betadaki kullanıcı onu
 * uygulamanın en görünür yerinde, üstelik hiç beklemediği bir anda buluyor.
 * Bölüm çalışıyor, ama ilk izlenim olarak çıkacak hâlde değil.
 *
 * Kapalıyken dönem "izlendi" diye **işaretlenmiyor** (`ozetGorulen`): bayrak
 * açıldığında bekleyen dönem hâlâ orada duruyor ve kullanıcı ilk özetini
 * kaybetmemiş oluyor.
 */
export const HAFTALIK_OZET_ACIK = false
