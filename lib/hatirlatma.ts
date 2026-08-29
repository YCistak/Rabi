import { tariheYaz } from './utils'

/**
 * Günlük hatırlatmanın saf mantığı — ne zaman ve ne yazacağı.
 *
 * Kural: **günde en fazla bir bildirim.** Bu, tekrarlayan bir bildirim kurup
 * sonra tek tek iptal etmeye çalışarak değil, her zaman **yalnızca bir sonraki**
 * bildirimi planlayarak sağlanıyor. Uygulama her açıldığında plan yeniden
 * hesaplanıyor: bugün soru girildiyse sıradaki bildirim yarına kayıyor.
 */

/** Mesaj havuzu — Rabi'nin ağzından. Her gün aynısını okumak sıkıcı olurdu. */
export const HATIRLATMA_MESAJLARI: { baslik: string; metin: string }[] = [
  { baslik: 'Bugün hiç soru girmedin', metin: 'Bir 20’lik çözsek mi? 🐰' },
  { baslik: 'Rabi bekliyor', metin: 'Bugünden bir şey kalsın istemezsin. Az bir şey de olur. 🥕' },
  { baslik: 'Defteri açalım mı?', metin: 'Bugün hiç soru işaretlemedin. On dakika yeter. 🐰' },
  { baslik: 'Günü boş geçirme', metin: 'Küçük bir tur at, seriyi bozma. 🌿' },
  { baslik: 'Bir soru bile sayılır', metin: 'Bugün hiç giriş yok. Başlamak en zor kısmı. 🐰' },
  { baslik: 'Rabi kulaklarını dikti', metin: 'Bugün defterden hiç ses gelmedi. Bir soru at da duyayım. 🐰' },
  { baslik: 'Yarınki sen izliyor', metin: 'Bugün çözdüğün soru, sınavda tanıdık gelen soru. 🌱' },
  { baslik: 'Havuç kaçıyor!', metin: 'Peşinden koşacak bir tavşan lazım. Yirmi soru yeter. 🥕' },
  { baslik: 'Sıralaman seni bekliyor', metin: 'Bugün girilmeyen her soru, listede geri kalan bir basamak. 📈' },
  { baslik: 'Zor olan başlamak', metin: 'İlk soruyu çöz; gerisi kendiliğinden geliyor. 🐰' },
  { baslik: 'On dakikan var mı?', metin: 'Rabi kronometreyi kurdu bile. Tek soruyla da olur. ⏱️' },
  { baslik: 'Bugünü boş bırakma', metin: 'Bir günlük boşluk, bir haftalık alışkanlığı bozuyor. 🌿' },
  { baslik: 'Rabi bir tur teklif ediyor', metin: 'Oyunlardan kısa bir tur? Hem eğlence hem tekrar. 🎮' },
  { baslik: 'Dünkü sen bugünküne güveniyordu', metin: 'Onu haklı çıkaralım mı? 🐰' },
  { baslik: 'Yanlışların seni bekliyor', metin: 'Bankadaki sorular kendi kendine öğrenilmiyor. 📒' },
  { baslik: 'Küçük ama her gün', metin: 'Yirmi soru bugün az görünür; bir ayda 600 eder. 🥕' },
  { baslik: 'Rabi patisini uzattı', metin: 'Bugünlük bir tur, sonrası rahat rahat dinlenmek. 🐾' },
]

/**
 * Tarihe göre sabit mesaj seçer. Rastgele seçilseydi aynı gün içinde yeniden
 * planlandığında bildirim metni değişirdi.
 */
export function hatirlatmaMesaji(isoTarih: string): { baslik: string; metin: string } {
  let toplam = 0
  for (const harf of isoTarih) toplam = (toplam * 31 + harf.charCodeAt(0)) % 100000
  return HATIRLATMA_MESAJLARI[toplam % HATIRLATMA_MESAJLARI.length]
}

/**
 * Sıradaki hatırlatma zamanı.
 *
 * - Bugün soru girildiyse bildirim yarına planlanır (bugünkü hakkı kullanılmaz).
 * - Girilmediyse bugünkü saat henüz gelmediyse bugüne, geçtiyse yarına.
 *
 * Saat geçtiyse "hemen gönder" **yapılmıyor**: kullanıcı akşam 21'de uygulamayı
 * açtığında 20:00 hatırlatması anında patlardı, hem de uygulama zaten elindeyken.
 */
export function sonrakiHatirlatma(
  simdi: Date,
  saat: number,
  dakika: number,
  bugunGirdiVar: boolean,
): Date {
  const hedef = new Date(simdi)
  hedef.setHours(saatiKirp(saat), dakikayiKirp(dakika), 0, 0)

  if (bugunGirdiVar || hedef.getTime() <= simdi.getTime()) {
    hedef.setDate(hedef.getDate() + 1)
  }
  return hedef
}

/**
 * Saat ve dakikayı geçerli aralığa çeker.
 *
 * Kullanıcı saati elle yazabiliyor; bozuk bir değer `setHours`'a girerse tarih
 * sessizce kayar (25 → ertesi günün 01'i) ve hatırlatma yanlış güne planlanırdı.
 */
export function saatiKirp(saat: number): number {
  if (!Number.isFinite(saat)) return 20
  return Math.min(23, Math.max(0, Math.floor(saat)))
}

export function dakikayiKirp(dakika: number): number {
  if (!Number.isFinite(dakika)) return 0
  return Math.min(59, Math.max(0, Math.floor(dakika)))
}

/** "20.30" biçiminde okunur saat. */
export function saatYaz(saat: number, dakika: number): string {
  return `${String(saatiKirp(saat)).padStart(2, '0')}.${String(dakikayiKirp(dakika)).padStart(2, '0')}`
}

/** `<input type="time">` için "HH:MM". */
export function saatDegeri(saat: number, dakika: number): string {
  return `${String(saatiKirp(saat)).padStart(2, '0')}:${String(dakikayiKirp(dakika)).padStart(2, '0')}`
}

/** "HH:MM" metnini saat/dakikaya çözer. Bozuk girdide null. */
export function saatiCoz(metin: string): { saat: number; dakika: number } | null {
  const parca = metin.match(/^(\d{1,2}):(\d{2})$/)
  if (!parca) return null
  const saat = Number(parca[1])
  const dakika = Number(parca[2])
  if (saat > 23 || dakika > 59) return null
  return { saat, dakika }
}

/** Planlanacak bildirimin tamamı: zamanı ve o güne düşen metni. */
export function hatirlatmaPlani(
  simdi: Date,
  saat: number,
  dakika: number,
  bugunGirdiVar: boolean,
): { zaman: Date; baslik: string; metin: string } {
  const zaman = sonrakiHatirlatma(simdi, saat, dakika, bugunGirdiVar)
  return { zaman, ...hatirlatmaMesaji(tariheYaz(zaman)) }
}
