/**
 * Öneri ve hata bildirimi — saf mantık.
 *
 * Hatalı soru bildirimi (`hata-bildirimi.ts`) yalnızca soru havuzunu
 * kapsıyor; "şu ekran donuyor", "şöyle bir özellik olsa" demenin uygulama
 * içinde yolu yoktu. Play yorumları bunun yerini tutmuyor: yorum yazan
 * öğrenci sürümünü ve telefonunu yazmıyor, geliştirici de ona cevap
 * yazamıyor.
 *
 * Yapı hatalı soru bildirimiyle aynı: kayıt burada, gönderim
 * `lib/hata-gonder.ts` içinde. Kayıt ile gönderim ayrı çünkü uygulama
 * çevrimdışı çalışıyor — kullanıcı "Gönder" dediğinde internet yoksa mesaj
 * telefonda bekliyor, bağlanınca gidiyor.
 *
 * Hatalı sorudan tek fark **serbest metin**: kullanıcı ne yazarsa o gidiyor.
 * Bu yüzden ekran gönderilenleri düğmenin hemen üstünde sayıyor ve metne
 * kişisel bilgi yazmamasını söylüyor; alan sayısı da bilerek az tutuldu.
 */

import { yeniId } from './utils'

export type GeriBildirimTuru = 'oneri' | 'hata' | 'baska'

/** Çiplerde ve gönderilen kayıtta görünen adlar. */
export const TUR_ADI: Record<GeriBildirimTuru, string> = {
  oneri: 'Öneri',
  hata: 'Hata',
  baska: 'Başka',
}

export const TURLER: GeriBildirimTuru[] = ['oneri', 'hata', 'baska']

/**
 * Metin sınırları.
 *
 * Alt sınır "iyi" ya da "kötü" gibi tek kelimelik kayıtları eliyor; onlardan
 * düzeltilecek bir şey çıkmıyor. Üst sınır formun rahat okunması için —
 * Google Forms'un kendi sınırı çok daha yüksek ama bin karakteri geçen bir
 * bildirim zaten e-posta olmalı.
 */
export const METIN_EN_AZ = 10
export const METIN_EN_COK = 1000

/**
 * Cihaz başına günlük sınır.
 *
 * Hatalı sorudaki 20'den düşük: bir oturumda birkaç soru bildirilebilir ama
 * günde beşten fazla öneri yazan biri ya düğmeye dayanıyor ya da tek
 * mesajda anlatması gerekeni parçalıyor.
 */
export const GUNLUK_SINIR = 5

/** Kuyrukta tutulan en fazla kayıt; taşarsa gönderilmişlerin en eskisi düşer. */
export const KUYRUK_SINIRI = 50

export interface GeriBildirim {
  kimlik: string
  tur: GeriBildirimTuru
  metin: string
  tarih: string
  gonderildi: boolean
  /** Kaç kez gönderilmeye çalışıldı — sürekli başarısız olan kayıt anlaşılsın. */
  denemeSayisi: number
}

/**
 * Metnin gönderilebilir olup olmadığı; sorun varsa kullanıcıya gösterilecek
 * cümle, yoksa `null`. Baştaki ve sondaki boşluk sayılmıyor.
 */
export function metinSorunu(metin: string): string | null {
  const uzunluk = metin.trim().length
  if (uzunluk < METIN_EN_AZ) return `En az ${METIN_EN_AZ} karakter yaz.`
  if (uzunluk > METIN_EN_COK) return `En fazla ${METIN_EN_COK} karakter.`
  return null
}

function gun(tarih: string): string {
  return tarih.slice(0, 10)
}

/** O gün yazılmış bildirim sayısı. */
export function gunlukSayi(liste: GeriBildirim[], simdi: Date): number {
  const bugun = simdi.toISOString().slice(0, 10)
  return liste.filter((b) => gun(b.tarih) === bugun).length
}

/** Günlük sınıra ulaşıldı mı — arayüz bunu kullanıcıya söylüyor. */
export function sinirdaMi(liste: GeriBildirim[], simdi: Date): boolean {
  return gunlukSayi(liste, simdi) >= GUNLUK_SINIR
}

/**
 * Kuyruğu sınıra çeker: önce gönderilmiş kayıtlar düşer, hepsi bekliyorsa
 * en eskisi.
 */
function kuyrugaSigdir(liste: GeriBildirim[]): GeriBildirim[] {
  if (liste.length <= KUYRUK_SINIRI) return liste
  let atilacak = liste.length - KUYRUK_SINIRI
  const kalanlar: GeriBildirim[] = []
  for (const b of liste) {
    if (atilacak > 0 && b.gonderildi) atilacak--
    else kalanlar.push(b)
  }
  return kalanlar.slice(atilacak)
}

/**
 * Bildirimi kaydeder; sınır dolmuşsa ya da metin geçersizse liste **olduğu
 * gibi** döner ve arayüz kaydın girmediğini uzunluktan anlar.
 */
export function geriBildirimEkle(
  liste: GeriBildirim[],
  tur: GeriBildirimTuru,
  metin: string,
  simdi: Date,
): GeriBildirim[] {
  if (metinSorunu(metin) !== null) return liste
  if (sinirdaMi(liste, simdi)) return liste
  const yeni: GeriBildirim = {
    kimlik: yeniId(),
    tur,
    metin: metin.trim(),
    tarih: simdi.toISOString(),
    gonderildi: false,
    denemeSayisi: 0,
  }
  return kuyrugaSigdir([...liste, yeni])
}

/** Sırada bekleyenler — en eskiden başlayarak. */
export function gonderilecekler(liste: GeriBildirim[]): GeriBildirim[] {
  return liste.filter((b) => !b.gonderildi)
}

export function gonderildiIsaretle(liste: GeriBildirim[], kimlikler: string[]): GeriBildirim[] {
  const kume = new Set(kimlikler)
  return liste.map((b) => (kume.has(b.kimlik) ? { ...b, gonderildi: true } : b))
}

export function denemeArtir(liste: GeriBildirim[], kimlikler: string[]): GeriBildirim[] {
  const kume = new Set(kimlikler)
  return liste.map((b) => (kume.has(b.kimlik) ? { ...b, denemeSayisi: b.denemeSayisi + 1 } : b))
}

export function bekleyenSayisi(liste: GeriBildirim[]): number {
  return liste.filter((b) => !b.gonderildi).length
}

/**
 * Gönderilen alanlar — **tam olarak** dışarı çıkan veri.
 *
 * `entry.NNN` eşlemesi `lib/veri/geri-bildirim-adresi.ts` içinde. Buraya
 * alan eklenirse ekrandaki liste (`components/ekranlar/geri-bildirim.tsx`),
 * `lib/veri/yasal.ts`, `public/gizlilik/index.html` ve Play'in Data Safety
 * formu da güncellenmeli.
 */
export function geriBildirimFormVerisi(
  b: GeriBildirim,
  cihaz: string,
  surum: string,
): Record<string, string> {
  return {
    tur: TUR_ADI[b.tur],
    metin: b.metin,
    surum,
    cihaz,
    tarih: b.tarih,
  }
}
