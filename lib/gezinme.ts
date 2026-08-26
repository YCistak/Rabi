/**
 * Alt menüdeki dört sekme.
 *
 * Beş sekmeden dörde indi: Pomodoro, Soru ve Deneme kart menüsüne taşındı,
 * yerlerine Oyunlar ve Ayarlar geldi. Gerekçe tasarımda: beş sekmede yazılar
 * sıkışıyordu ve Ayarlar her seferinde iki dokunuş uzaktaydı. Taşınan üçü
 * ana sayfadaki "Araçlar" kutucuklarından tek dokunuşla açılıyor.
 */
export type Sekme = 'ana' | 'oyunlar' | 'daha' | 'ayarlar'

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
  | 'haftalik-ozet'
  | 'devamsizlik'
  | 'okul'
  | 'hedef'
  | 'rozetler'
  | 'istatistik'
  | 'oyun-bankasi'

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
    aciklama: 'Bugününü kâğıtlara yaz',
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
    id: 'haftalik-ozet',
    ad: 'Haftalık Özet',
    aciklama: 'Haftanı kart kart izle',
    ikon: '✨',
    renk: 'lavanta',
  },
  {
    id: 'okul',
    ad: 'Okul Notları',
    aciklama: 'Dönem notları ve OBP',
    ikon: '🎓',
    renk: 'krem',
  },
  { id: 'hedef', ad: 'Hedefim', aciklama: 'Üniversite ve bölüm', ikon: '🎯', renk: 'nane' },
  { id: 'rozetler', ad: 'Rozetler', aciklama: 'Kazandıkların', ikon: '🏅', renk: 'krem' },
  {
    id: 'istatistik',
    ad: 'İstatistik',
    aciklama: 'Ders bazlı gidişat',
    ikon: '📊',
    renk: 'mavi',
  },
]
