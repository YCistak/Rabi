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
  bugunGirdiVar: boolean,
): Date {
  const hedef = new Date(simdi)
  hedef.setHours(saat, 0, 0, 0)

  if (bugunGirdiVar || hedef.getTime() <= simdi.getTime()) {
    hedef.setDate(hedef.getDate() + 1)
  }
  return hedef
}

/** Planlanacak bildirimin tamamı: zamanı ve o güne düşen metni. */
export function hatirlatmaPlani(
  simdi: Date,
  saat: number,
  bugunGirdiVar: boolean,
): { zaman: Date; baslik: string; metin: string } {
  const zaman = sonrakiHatirlatma(simdi, saat, bugunGirdiVar)
  return { zaman, ...hatirlatmaMesaji(tariheYaz(zaman)) }
}
