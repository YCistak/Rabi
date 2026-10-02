/**
 * Hatalı soru bildirimi — saf mantık.
 *
 * Soru havuzları elle yazıldı; içlerinde yanlış cevap ya da bozuk yazım
 * olacaktır. Bu dosya bildirimin **kaydını** tutuyor, göndermeyi değil —
 * gönderme `lib/hata-gonder.ts` içinde ve ağa çıkan tek yer orası.
 *
 * Kayıt ile gönderimin ayrılmasının sebebi uygulamanın çevrimdışı çalışması:
 * bildirim internet olsun olmasın anında yazılıyor, sonra fırsat bulunca
 * gönderiliyor. Kullanıcı ne bekliyor ne hata görüyor ne düğmeye basıyor.
 */

import type { OyunId } from './types'
import { bankaCevabiMetni, bankaKimligi, bankaSorusuMetni, type BankaSorusu } from './oyunlar/banka'

export type HataSebebi = 'belirtilmedi' | 'cevap-yanlis' | 'anlasilmiyor' | 'yazim' | 'baska'

/** Çiplerde ve gönderilen kayıtta görünen adlar. */
export const SEBEP_ADI: Record<HataSebebi, string> = {
  belirtilmedi: 'Belirtilmedi',
  'cevap-yanlis': 'Cevap yanlış',
  anlasilmiyor: 'Anlaşılmıyor',
  yazim: 'Yazım hatası',
  baska: 'Başka',
}

/**
 * Kullanıcının seçebildiği sebepler.
 *
 * `belirtilmedi` listede yok ve artık **yeni kayıtlarda hiç oluşmuyor**: sebep
 * seçmek zorunlu (`components/hata-bildir.tsx`). Tipte durmaya devam ediyor
 * çünkü kuralın öncesinde açılmış bildirimler telefonlarda duruyor ve onlar
 * gönderilmeyi beklerken okunabilmeli.
 */
export const SECILEBILIR_SEBEPLER: HataSebebi[] = [
  'cevap-yanlis',
  'anlasilmiyor',
  'yazim',
  'baska',
]

export interface HataBildirimi {
  /** `bankaKimligi(soru)` — havuzdaki satırı bulmaya yarayan kararlı kimlik. */
  kimlik: string
  oyun: OyunId
  soruMetni: string
  /** Uygulamanın doğru sandığı cevap; bildirimin çoğu zaten buna itiraz. */
  cevapMetni: string
  sebep: HataSebebi
  /**
   * "Başka" seçilince kullanıcının yazdığı kısa açıklama; öteki sebeplerde yok.
   *
   * Bir süre "Başka" tek başına gidiyordu ve tabloda "Başka" yazan satır neyin
   * bozuk olduğunu söylemiyordu; kullanıcı da yazacak yer arayıp bulamadı.
   */
  not?: string
  tarih: string
  gonderildi: boolean
  /** Kaç kez gönderilmeye çalışıldı — sürekli başarısız olan kayıt anlaşılsın. */
  denemeSayisi: number
}

/**
 * Cihaz başına günlük bildirim sınırı.
 *
 * Gerçek kullanımda bir turda en fazla birkaç bildirim çıkar; bu sınır yalnızca
 * düğmeye dayanan birinin tabloyu doldurmasını engelliyor.
 */
export const GUNLUK_SINIR = 20

/**
 * "Başka" notunun en çok uzunluğu.
 *
 * Not ayrı bir alan olarak değil `sebep` alanının içinde gidiyor ("Başka: …"):
 * Firestore kuralı alanları sayıyor ve `sebep`e 40 harf veriyor
 * (`PLANNED.md` → "Firestore kuralları"). Yeni bir alan, kural konsolda
 * güncellenene kadar her bildirimi 403 ile düşürürdü. "Başka: " yedi harf,
 * geriye 33 kalıyor; 32 bir harf pay bırakıyor.
 */
export const BASKA_NOTU_SINIRI = 32

/** Notu temizler: baştaki/sondaki boşluk, art arda boşluklar, sınır. Boşsa `undefined`. */
export function notuKirp(metin: string | undefined): string | undefined {
  const temiz = (metin ?? '').replace(/\s+/g, ' ').trim().slice(0, BASKA_NOTU_SINIRI).trim()
  return temiz === '' ? undefined : temiz
}

/** Kuyrukta tutulan en fazla kayıt; taşarsa gönderilmişlerin en eskisi düşer. */
export const KUYRUK_SINIRI = 200

/** Tek denemede gönderilen en fazla kayıt — açılışta uzun bir seri atılmasın. */
export const PARTI_BOYU = 10

function gun(tarih: string): string {
  return tarih.slice(0, 10)
}

/**
 * Kuyruğu sınıra çeker.
 *
 * Önce **gönderilmiş** kayıtlar düşüyor: onların işi bitti, bekleyen bir
 * bildirimi atmak ise veriyi kaybetmek olurdu. Hepsi bekliyorsa en eskisi
 * gider — o zaman zaten gönderim uzun süredir çalışmıyor demektir.
 */
function kuyrugaSigdir(liste: HataBildirimi[]): HataBildirimi[] {
  if (liste.length <= KUYRUK_SINIRI) return liste
  const atilacak = liste.length - KUYRUK_SINIRI
  const gonderilmisIndeksleri = liste
    .map((b, i) => ({ b, i }))
    .filter(({ b }) => b.gonderildi)
    .map(({ i }) => i)
    .slice(0, atilacak)
  const atilan = new Set(gonderilmisIndeksleri)
  let kalan = atilacak - atilan.size
  for (let i = 0; i < liste.length && kalan > 0; i++) {
    if (!atilan.has(i)) {
      atilan.add(i)
      kalan--
    }
  }
  return liste.filter((_, i) => !atilan.has(i))
}

/** O gün açılmış bildirim sayısı. */
export function gunlukSayi(liste: HataBildirimi[], simdi: Date): number {
  const bugun = simdi.toISOString().slice(0, 10)
  return liste.filter((b) => gun(b.tarih) === bugun).length
}

/** Günlük sınıra ulaşıldı mı — arayüz bunu kullanıcıya söylüyor. */
export function sinirdaMi(liste: HataBildirimi[], simdi: Date): boolean {
  return gunlukSayi(liste, simdi) >= GUNLUK_SINIR
}

/**
 * Bildirimi kaydeder.
 *
 * Aynı soru ikinci kez bildirilirse yeni kayıt açılmıyor: tabloda tek satır
 * kalsın diye mevcut kayıt tazeleniyor. Sınır dolmuşsa liste **olduğu gibi**
 * dönüyor; arayüz kimliğin listeye girmediğini görüp kullanıcıyı uyarıyor.
 *
 * `sebep` her zaman gerçek bir sebep: arayüz sebep seçilmeden buraya hiç
 * gelmiyor.
 */
export function bildirimEkle(
  liste: HataBildirimi[],
  soru: BankaSorusu,
  sebep: HataSebebi,
  simdi: Date,
  not?: string,
): HataBildirimi[] {
  const kimlik = bankaKimligi(soru)
  const mevcut = liste.find((b) => b.kimlik === kimlik)
  if (mevcut) return sebepGuncelle(liste, kimlik, sebep, not)
  if (sinirdaMi(liste, simdi)) return liste

  const temizNot = sebep === 'baska' ? notuKirp(not) : undefined
  const yeni: HataBildirimi = {
    kimlik,
    oyun: soru.oyun,
    soruMetni: bankaSorusuMetni(soru),
    cevapMetni: bankaCevabiMetni(soru),
    sebep,
    ...(temizNot ? { not: temizNot } : {}),
    tarih: simdi.toISOString(),
    gonderildi: false,
    denemeSayisi: 0,
  }
  return kuyrugaSigdir([...liste, yeni])
}

/**
 * Çiple seçilen sebebi işler.
 *
 * Kayıt zaten gönderilmişse yeniden kuyruğa alınıyor: tabloya ikinci bir satır
 * düşüyor ama sebepli. Sebepsiz bildirim "biri bu soruya kızmış" demek,
 * sorunun bozuk mu olduğunu ayırt ettirmiyor — ikinci satıra değer.
 */
export function sebepGuncelle(
  liste: HataBildirimi[],
  kimlik: string,
  sebep: HataSebebi,
  not?: string,
): HataBildirimi[] {
  const temizNot = sebep === 'baska' ? notuKirp(not) : undefined
  return liste.map((b) => {
    if (b.kimlik !== kimlik || (b.sebep === sebep && b.not === temizNot)) return b
    const { not: _eski, ...gerisi } = b
    return {
      ...gerisi,
      sebep,
      ...(temizNot ? { not: temizNot } : {}),
      gonderildi: false,
      denemeSayisi: 0,
    }
  })
}

/** Gönderilen `sebep` metni: "Başka"da not varsa yanına ekleniyor. */
export function sebepMetni(b: Pick<HataBildirimi, 'sebep' | 'not'>): string {
  const not = b.sebep === 'baska' ? notuKirp(b.not) : undefined
  return not ? `${SEBEP_ADI.baska}: ${not}` : SEBEP_ADI[b.sebep]
}

/** Sırada bekleyenler — en eskiden başlayarak, parti boyu kadar. */
export function gonderilecekler(liste: HataBildirimi[]): HataBildirimi[] {
  return liste.filter((b) => !b.gonderildi).slice(0, PARTI_BOYU)
}

export function gonderildiIsaretle(liste: HataBildirimi[], kimlikler: string[]): HataBildirimi[] {
  const kume = new Set(kimlikler)
  return liste.map((b) => (kume.has(b.kimlik) ? { ...b, gonderildi: true } : b))
}

export function denemeArtir(liste: HataBildirimi[], kimlikler: string[]): HataBildirimi[] {
  const kume = new Set(kimlikler)
  return liste.map((b) => (kume.has(b.kimlik) ? { ...b, denemeSayisi: b.denemeSayisi + 1 } : b))
}

/** Bekleyen bildirim sayısı — Ayarlar'da gösteriliyor. */
export function bekleyenSayisi(liste: HataBildirimi[]): number {
  return liste.filter((b) => !b.gonderildi).length
}

/**
 * Gönderilecek alanlar.
 *
 * Burada biten liste **tam olarak** dışarı çıkan veridir; alan adları
 * Firestore belgesine olduğu gibi yazılıyor ve kural (`PLANNED.md`) yalnızca
 * bu adları kabul ediyor — alan eklersen kuralı da güncelle.
 */
export function formVerisi(
  b: HataBildirimi,
  cihaz: string,
  surum: string,
): Record<string, string> {
  return {
    kimlik: b.kimlik,
    oyun: b.oyun,
    soru: b.soruMetni,
    cevap: b.cevapMetni,
    sebep: sebepMetni(b),
    surum,
    // Telefon modeli + okunur cihaz adı; `lib/hata-gonder.ts` → `cihazAlani()`.
    cihaz,
  }
}
