/**
 * Kapalı betada gizlenen bölümler.
 *
 * Play'in kapalı betasına çıkarken bitmemiş iki bölüm kullanıcıdan saklandı.
 * Kodları **silinmiyor**: ikisi de çalışır durumda ve sürüm planındaki
 * (#82) sırayla geri açılacak. Silinselerdi geri getirmek yeniden yazmak
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

/**
 * Bilgi Kartları (Konu Anlatımı) — ana sayfadaki "Ders haritasını aç" kartı.
 *
 * Bayrak iki kez açılıp dosyadan düştü, iki kez geri geldi: 0.6.0'da plan
 * gereği, 0.7.0'da da bölüm henüz çıkacak hâlde olmadığı için. Hangi sürümde
 * açılacağı belirsiz; açılınca bu bayrak yine buradan düşecek. Kart bölümün **tek** girişi (Araçlar
 * şeridinde ve kart menüsünde yok); çizilmeyince bölüme ulaşan yol kalmıyor,
 * ekranın kendisi ve `AppShell`teki kaydı yerinde duruyor.
 */
export const KONU_ANLATIMI_ACIK = false
