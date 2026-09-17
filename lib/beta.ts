/**
 * Kapalı betada gizlenen bölümler.
 *
 * Play'in kapalı betasına çıkarken bitmemiş bölümler kullanıcıdan saklandı.
 * Kodları **silinmiyor**: çalışır durumdalar ve sürüm planındaki (#82)
 * sırayla geri açılıyor — Bilgi Kartları 0.7.0'da açılıp buradan düştü. Silinselerdi geri getirmek yeniden yazmak
 * olurdu; bayrak, o güne kadar kodun derlenmeye ve testlerin koşmaya devam
 * etmesini sağlıyor — çürüyen bir dal olarak beklemiyorlar.
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

// Şu an kapalı bölüm yok. Haftalık özet 0.7.x'te aylık özete dönüşüp açıldı ve
// bayrağı buradan düştü; yeni bir bölüm gizlenirse bayrağı buraya gelir.
export {}
