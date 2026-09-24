/**
 * Alt menüdeki beş sekme.
 *
 * Bir süre dörttü: Pomodoro, Soru ve Deneme kart menüsüne taşınmış, yerlerine
 * Oyunlar ve Ayarlar gelmişti — beş sekmede yazılar sıkışıyordu ve Ayarlar
 * iki dokunuş uzaktaydı. Beşinci sekme (Harita, ders haritası) sonradan
 * geldi: harita ana sayfada kendi bölümüyle açılıyordu, kullanıcı onu alt
 * menüye istedi. Sekme adı kısa ("Harita") ki beşli sırada yazı sıkışmasın.
 */
export type Sekme = 'ana' | 'oyunlar' | 'harita' | 'daha' | 'ayarlar'

/**
 * Alt menüde yeri olmayan, kart menüsünden açılan ekranlar.
 * `yeni-deneme` ve `gun` gibi alt ekranlar burada değil; onları sahibi ekran yönetir.
 */
export type Ekran =
  | 'pomodoro'
  | 'notlar'
  | 'soru'
  | 'deneme'
  | 'siralama'
  | 'yanlis-banka'
  | 'devamsizlik'
  | 'okul'
  | 'hedef'
  | 'rozetler'
  | 'istatistik'
  | 'oyun-bankasi'
  /** Gizlilik ve Koşullar — yalnızca Ayarlar'dan açılıyor, kart menüsünde yok. */
  | 'yasal'
  /** Öneri ve hata bildir — o da yalnızca Ayarlar'dan. */
  | 'geri-bildirim'

/** Kutucuk zeminleri — tasarımdaki aileler. */
export type KartRengi = 'mavi' | 'pembe' | 'krem' | 'nane' | 'lavanta' | 'deniz'

export type KartTanimi = {
  id: Ekran
  ad: string
  aciklama: string
  /**
   * Kartın yüzü — emoji.
   *
   * Önce `lucide` çizgi simgesiydi. Araçlar ve Oyunlar sekmeleri aynı kart
   * biçimini paylaşıyor ama biri çizgi simge biri emoji gösterince yan yana
   * iki farklı uygulamadan alınmış gibi duruyordu. Oyun tanımlarındaki
   * `ikon` alanıyla aynı iş.
   */
  ikon: string
  renk: KartRengi
}

/**
 * "Araçlar" sekmesindeki kart menüsü. Sıra önem taşıyor: ana sayfadaki "Araçlar"
 * bölümü bu listenin ilk dördünü gösteriyor, o yüzden en sık açılanlar başta.
 */
export const KARTLAR: KartTanimi[] = [
  {
    id: 'pomodoro',
    ad: 'Pomodoro',
    aciklama: 'Sayaçlı çalışma seansı',
    ikon: '⏱️',
    renk: 'krem',
  },
  {
    id: 'yanlis-banka',
    ad: 'Yanlış Soru',
    aciklama: 'Zorlandığın soruların fotoğrafı',
    ikon: '📸',
    renk: 'pembe',
  },
  {
    id: 'devamsizlik',
    ad: 'Devamsızlık',
    aciklama: 'Kalan gün hakkın',
    ikon: '📅',
    renk: 'nane',
  },
  {
    id: 'siralama',
    ad: 'Sıralama',
    aciklama: 'Denemeden tahmini YKS sırası',
    ikon: '📈',
    renk: 'lavanta',
  },
  {
    id: 'soru',
    ad: 'Soru Takibi',
    aciklama: 'Günlük çözdüğün sorular',
    ikon: '✏️',
    renk: 'mavi',
  },
  {
    id: 'notlar',
    ad: 'Yapılacaklar',
    aciklama: 'Günü sabah, öğle, akşam planla',
    ikon: '🗒️',
    renk: 'deniz',
  },
  {
    id: 'deneme',
    ad: 'Denemeler',
    aciklama: 'Net ve gidişat',
    ikon: '📝',
    renk: 'pembe',
  },
  {
    id: 'okul',
    ad: 'Okul Notları',
    aciklama: 'Dönem notları ve OBP',
    ikon: '🎓',
    renk: 'krem',
  },
  { id: 'hedef', ad: 'Hedefim', aciklama: 'Üniversite ve bölüm', ikon: '🎯', renk: 'nane' },
  { id: 'rozetler', ad: 'Başarımlar', aciklama: 'Kazandıkların', ikon: '🏅', renk: 'krem' },
  {
    id: 'istatistik',
    ad: 'İstatistik',
    aciklama: 'Ders bazlı gidişat',
    ikon: '📊',
    renk: 'mavi',
  },
]
