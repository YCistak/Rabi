import type { LucideIcon } from 'lucide-react'
import {
  Award,
  BarChart3,
  CalendarX2,
  Gamepad2,
  GraduationCap,
  Images,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'

/** Alt menüdeki beş sekme. */
export type Sekme = 'ana' | 'pomodoro' | 'soru' | 'deneme' | 'daha'

/**
 * Alt menüde yeri olmayan, kart menüsünden açılan ekranlar.
 * `yeni-deneme` ve `gun` gibi alt ekranlar burada değil; onları sahibi ekran yönetir.
 */
export type Ekran =
  | 'siralama'
  | 'yanlis-banka'
  | 'haftalik-ozet'
  | 'mini-oyunlar'
  | 'devamsizlik'
  | 'okul'
  | 'hedef'
  | 'rozetler'
  | 'istatistik'
  | 'ayarlar'

export type KartTanimi = {
  id: Ekran
  ad: string
  aciklama: string
  Simge: LucideIcon
}

/**
 * Ana sayfadaki (ve "Daha" sekmesindeki) kart menüsü. Sıra önem taşıyor:
 * kullanıcının en sık açacağı üçü — sıralama, yanlış bankası, devamsızlık — üstte.
 */
export const KARTLAR: KartTanimi[] = [
  {
    id: 'siralama',
    ad: 'Sıralama Hesapla',
    aciklama: 'Denemeden tahmini YKS sırası',
    Simge: TrendingUp,
  },
  {
    id: 'yanlis-banka',
    ad: 'Yanlış Soru Bankası',
    aciklama: 'Zorlandığın soruların fotoğrafı',
    Simge: Images,
  },
  {
    id: 'devamsizlik',
    ad: 'Devamsızlık',
    aciklama: 'Kalan gün hakkın',
    Simge: CalendarX2,
  },
  {
    id: 'haftalik-ozet',
    ad: 'Haftalık Özet',
    aciklama: 'Haftanı kart kart izle',
    Simge: Sparkles,
  },
  {
    id: 'mini-oyunlar',
    ad: 'Mini Oyunlar',
    aciklama: 'Kısa turlarla bilgi tazele',
    Simge: Gamepad2,
  },
  {
    id: 'okul',
    ad: 'Okul Notları',
    aciklama: 'Dönem notları ve OBP',
    Simge: GraduationCap,
  },
  { id: 'hedef', ad: 'Hedefim', aciklama: 'Üniversite ve bölüm', Simge: Target },
  { id: 'rozetler', ad: 'Rozetler', aciklama: 'Kazandıkların', Simge: Award },
  { id: 'istatistik', ad: 'İstatistik', aciklama: 'Ders bazlı gidişat', Simge: BarChart3 },
  { id: 'ayarlar', ad: 'Ayarlar', aciklama: 'Tema, yedek, bildirim', Simge: Settings },
]
