import type { LucideIcon } from 'lucide-react'
import {
  Award,
  BarChart3,
  CalendarX2,
  ClipboardList,
  GraduationCap,
  Images,
  PencilLine,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react'

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

/** Kutucuk zeminleri — tasarımdaki pastel aileler. */
export type KartRengi = 'mavi' | 'pembe' | 'krem' | 'nane' | 'lavanta'

export type KartTanimi = {
  id: Ekran
  ad: string
  aciklama: string
  Simge: LucideIcon
  renk: KartRengi
}

/**
 * "Daha" sekmesindeki kart menüsü. Sıra önem taşıyor: ana sayfadaki "Araçlar"
 * bölümü bu listenin ilk dördünü gösteriyor, o yüzden en sık açılanlar başta.
 */
export const KARTLAR: KartTanimi[] = [
  {
    id: 'pomodoro',
    ad: 'Pomodoro',
    aciklama: 'Sayaçlı çalışma seansı',
    Simge: Timer,
    renk: 'krem',
  },
  {
    id: 'yanlis-banka',
    ad: 'Yanlış Soru',
    aciklama: 'Zorlandığın soruların fotoğrafı',
    Simge: Images,
    renk: 'pembe',
  },
  {
    id: 'devamsizlik',
    ad: 'Devamsızlık',
    aciklama: 'Kalan gün hakkın',
    Simge: CalendarX2,
    renk: 'nane',
  },
  {
    id: 'siralama',
    ad: 'Sıralama',
    aciklama: 'Denemeden tahmini YKS sırası',
    Simge: TrendingUp,
    renk: 'lavanta',
  },
  {
    id: 'soru',
    ad: 'Soru Takibi',
    aciklama: 'Günlük çözdüğün sorular',
    Simge: PencilLine,
    renk: 'mavi',
  },
  {
    id: 'deneme',
    ad: 'Denemeler',
    aciklama: 'Net ve gidişat',
    Simge: ClipboardList,
    renk: 'pembe',
  },
  {
    id: 'haftalik-ozet',
    ad: 'Haftalık Özet',
    aciklama: 'Haftanı kart kart izle',
    Simge: Sparkles,
    renk: 'lavanta',
  },
  {
    id: 'okul',
    ad: 'Okul Notları',
    aciklama: 'Dönem notları ve OBP',
    Simge: GraduationCap,
    renk: 'krem',
  },
  { id: 'hedef', ad: 'Hedefim', aciklama: 'Üniversite ve bölüm', Simge: Target, renk: 'nane' },
  { id: 'rozetler', ad: 'Rozetler', aciklama: 'Kazandıkların', Simge: Award, renk: 'krem' },
  {
    id: 'istatistik',
    ad: 'İstatistik',
    aciklama: 'Ders bazlı gidişat',
    Simge: BarChart3,
    renk: 'mavi',
  },
]
