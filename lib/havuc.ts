/**
 * Havuç — uygulamanın tek sayaç para birimi.
 *
 * Bakiye `localStorage`da tek bir sayı olarak duruyor (`ANAHTARLAR.havuc`) ve
 * ana sayfada gösteriliyor. Kazanma ve harcama mekaniği **henüz yok**: havuç
 * için kurulan mağaza/avatar sistemi kaldırıldı, sayaç kaldı. Harcayan ya da
 * kazandıran bir özellik geldiğinde bakiyeyi değiştiren her yol buradan
 * geçmeli ki sayı tek bir yerden değişsin.
 */

/** Yeni kullanıcının başlangıç bakiyesi. */
export const BASLANGIC_HAVUCU = 250
