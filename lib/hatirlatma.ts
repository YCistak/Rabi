import { tariheYaz } from './utils'

/**
 * Günlük hatırlatmanın saf mantığı — ne zaman ve ne yazacağı.
 *
 * Kural: **günde en fazla bir bildirim.** Tekrarlayan bir bildirim kurulmuyor;
 * önümüzdeki günlerin her birine **ayrı** bir bildirim planlanıyor ve uygulama
 * her açıldığında hepsi silinip yeniden kuruluyor: bugün soru girildiyse
 * bugünkü düşüyor, sıradakiler yerinde kalıyor.
 */

/**
 * Mesaj havuzu — Rabi'nin ağzından. Her gün aynısını okumak sıkıcı olurdu.
 *
 * Metinler **kısa**: bildirim ekranın tepesinden iner ve birkaç saniyede
 * okunup geçilir. Uzun cümleler iOS'ta iki satırda kesiliyor, kilit ekranında
 * yarısı "…" ile bitiyordu. Başlık en çok 24, metin en çok 40 karakter;
 * `hatirlatma.test.ts` ikisini de denetliyor.
 */
export const HATIRLATMA_MESAJLARI: { baslik: string; metin: string }[] = [
  { baslik: 'Bugün soru yok', metin: 'Bir 20’lik çözelim mi? 🐰' },
  { baslik: 'Rabi bekliyor', metin: 'Az bir şey de olur. 🥕' },
  { baslik: 'Defteri açalım mı?', metin: 'On dakika yeter. 🐰' },
  { baslik: 'Günü boş geçirme', metin: 'Kısa bir tur, seri bozulmasın. 🌿' },
  { baslik: 'Bir soru bile sayılır', metin: 'Başlamak en zor kısmı. 🐰' },
  { baslik: 'Rabi kulak kesildi', metin: 'Bir soru at da duyayım. 🐰' },
  { baslik: 'Yarınki sen izliyor', metin: 'Bugünkü soru sınavda tanıdık gelir. 🌱' },
  { baslik: 'Havuç kaçıyor!', metin: 'Yirmi soru yeter. 🥕' },
  { baslik: 'Sıralaman bekliyor', metin: 'Her soru bir basamak. 📈' },
  { baslik: 'Zor olan başlamak', metin: 'İlk soruyu çöz, gerisi gelir. 🐰' },
  { baslik: 'On dakikan var mı?', metin: 'Tek soruyla da olur. ⏱️' },
  { baslik: 'Bugünü boş bırakma', metin: 'Alışkanlık bir günde bozulur. 🌿' },
  { baslik: 'Bir tura ne dersin?', metin: 'Oyunlarda kısa bir tekrar. 🎮' },
  { baslik: 'Dünkü sen güveniyor', metin: 'Onu haklı çıkaralım mı? 🐰' },
  { baslik: 'Yanlışların bekliyor', metin: 'Bankaya bir göz at. 📒' },
  { baslik: 'Küçük ama her gün', metin: 'Günde 20 soru, ayda 600. 🥕' },
  { baslik: 'Rabi patisini uzattı', metin: 'Bir tur, sonra dinlen. 🐾' },
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

/**
 * Önceden planlanan gün sayısı.
 *
 * Plan bir süre **yalnızca bir sonraki** bildirimden ibaretti ve uygulama
 * açılınca yenileniyordu. Hatırlatmanın asıl muhatabı uygulamayı açmayan
 * kullanıcı; o kişi tek bir bildirim alıyor, ertesi günden itibaren hiçbir
 * şey almıyordu — "günlük" hatırlatma ilk günden sonra susuyordu. Yedi gün,
 * bir haftalık aradan sonra da susmak için yeterince uzun; daha uzunu,
 * uygulamayı bırakmış birine haftalarca bildirim göndermek olurdu.
 */
export const PLANLANAN_GUN = 7

/**
 * Önümüzdeki `PLANLANAN_GUN` günün bildirimleri, her güne en fazla bir tane.
 *
 * İlki `hatirlatmaPlani` ile aynı: bugün soru girildiyse ya da saat geçtiyse
 * yarından başlıyor. Sonrakiler birer gün arayla aynı saatte; metin her
 * bildirimin düştüğü güne göre seçiliyor.
 */
export function hatirlatmaPlanlari(
  simdi: Date,
  saat: number,
  dakika: number,
  bugunGirdiVar: boolean,
  gunSayisi = PLANLANAN_GUN,
): { zaman: Date; baslik: string; metin: string }[] {
  const ilk = sonrakiHatirlatma(simdi, saat, dakika, bugunGirdiVar)
  return Array.from({ length: gunSayisi }, (_, i) => {
    // Gün `setDate` ile kaydırılıyor, milisaniye eklenerek değil: yaz saati
    // olan bir saat diliminde 24 saat eklemek bildirimi bir saat kaydırırdı.
    const zaman = new Date(ilk)
    zaman.setDate(ilk.getDate() + i)
    return { zaman, ...hatirlatmaMesaji(tariheYaz(zaman)) }
  })
}
