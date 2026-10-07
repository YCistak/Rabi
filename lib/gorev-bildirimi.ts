import type { Gorev } from './yapilacaklar'

/**
 * Saatli görev hatırlatmasının saf mantığı — hangi göreve, ne zaman, hangi
 * kimlikle ve ne yazan bir bildirim kurulacağı. Planlayıcı (`lib/bildirim.ts`)
 * yalnızca bu listeyi telefona yazıyor.
 *
 * Bildirim görevin saatinde değil **beş dakika önce** geliyor: tam saatinde
 * gelen bildirim "geç kaldın" der, beş dakika önceki "hazırlan" der.
 *
 * Plan her seferinde kayıttan baştan kuruluyor (eşitleme): görev eklenince,
 * düzenlenince, ertelenince, bitince, silinince ve uygulama açılınca. Tek tek
 * "bu değişti, şunu güncelle" diye izlemek, kaçan bir yolda (yedekten geri
 * yükleme, gün dönümünde eleme) eski bildirimi telefonda bırakırdı.
 */

/** Görevin saatinden kaç dakika önce haber verilecek. */
export const GOREV_ONCE_DAKIKA = 5

/**
 * Görev bildirimlerinin kimlik aralığı.
 *
 * Pomodoro 1, günlük hatırlatmalar 2–8 (`lib/bildirim.ts`), Android odak
 * servisinin kalıcı bildirimi 4211. Görevler bir milyondan başlıyor ki hiçbiri
 * ötekinin bildirimini ezmesin ya da eşitlemede silmesin. Üst sınır Android'in
 * 32 bitlik `int` kimliğinin altında kalıyor.
 */
export const GOREV_BILDIRIM_ILK_ID = 1_000_000
const GOREV_BILDIRIM_ARALIK = 1_000_000_000

/**
 * Aynı anda kurulacak en çok görev bildirimi.
 *
 * iOS bir uygulamanın bekleyen bildirimlerinden yalnızca **64**'ünü tutuyor,
 * fazlasını sessizce atıyor. Yedi günlük hatırlatma ve Pomodoro'dan sonra
 * kalan yerin altında bir sayı: en yakın zamanlılar kuruluyor, uzaktakiler
 * uygulama sonraki açılışta zaten yeniden eşitlendiğinde sıraya giriyor.
 */
export const GOREV_BILDIRIM_EN_COK = 48

/** Bu kimlik bir görev bildirimine mi ait — eşitleme yalnızca bunları siler. */
export function gorevBildirimiMi(id: number): boolean {
  return id >= GOREV_BILDIRIM_ILK_ID && id < GOREV_BILDIRIM_ILK_ID + GOREV_BILDIRIM_ARALIK
}

/**
 * Görev kimliğinden kararlı bildirim kimliği (FNV-1a, 32 bit).
 *
 * Kayıtta ayrı bir sayaç tutulmuyor: aynı görev her eşitlemede aynı kimliği
 * almalı ki yeni plan eskisinin **üstüne** yazılsın, telefonda iki kopya
 * kalmasın. Görev kimliği metin (`yeniId`), bildirim kimliği tam sayı
 * olmak zorunda.
 */
export function gorevBildirimKimligi(gorevId: string): number {
  let ozet = 0x811c9dc5
  for (let i = 0; i < gorevId.length; i++) {
    ozet ^= gorevId.charCodeAt(i)
    ozet = Math.imul(ozet, 0x01000193) >>> 0
  }
  return GOREV_BILDIRIM_ILK_ID + (ozet % GOREV_BILDIRIM_ARALIK)
}

/**
 * Bildirimin düşeceği an: görev gününde, saatten beş dakika önce, yerel saat.
 *
 * Gece yarısına yakın görevde (00:00–00:04) an **önceki güne** düşüyor;
 * dakika eksiye gidince `Date` günü kendisi geri sarıyor — gün metnini elle
 * kaydırmak gerekmiyor. Saatsiz, bitmiş ya da bozuk tarihli görevde `null`.
 */
export function gorevBildirimZamani(gorev: Pick<Gorev, 'gun' | 'saat' | 'bitti'>): Date | null {
  if (gorev.bitti || gorev.saat === null) return null
  const gun = gorev.gun.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const saat = gorev.saat.match(/^(\d{2}):(\d{2})$/)
  if (!gun || !saat) return null
  const an = new Date(
    Number(gun[1]),
    Number(gun[2]) - 1,
    Number(gun[3]),
    Number(saat[1]),
    Number(saat[2]) - GOREV_ONCE_DAKIKA,
    0,
    0,
  )
  return Number.isNaN(an.getTime()) ? null : an
}

export type GorevBildirimPlani = {
  id: number
  gorevId: string
  zaman: Date
  baslik: string
  metin: string
  /** Dokununca Pomodoro'yu bu görevle başlatmak için. */
  pomodoro: boolean
}

/**
 * Bildirim metni — Rabi'nin ağzından, kısa, emojisiz. Başlık görevin adını
 * taşıyor (en çok 24 karakter, `EN_UZUN_GOREV`), gövde ne yapılacağını.
 * Pomodoro'lu görevde dokunuşun sayacı kuracağı söyleniyor.
 */
export function gorevBildirimMetni(gorev: Pick<Gorev, 'metin' | 'pomodoro'>): {
  baslik: string
  metin: string
} {
  return {
    baslik: `${GOREV_ONCE_DAKIKA} dakika sonra: ${gorev.metin}`,
    metin: gorev.pomodoro === true ? 'Dokun, sayacı ben kurayım.' : 'Hazırlan, ben buradayım.',
  }
}

/**
 * Şu an kurulması gereken görev bildirimleri, zamana göre sıralı.
 *
 * Zamanı geçmiş olan kurulmuyor: Android geçmişe kurulan bildirimi **hemen**
 * gösteriyor; görevi saatine dört dakika kala yazan kullanıcı, o an elindeki
 * uygulamadan bir bildirim alırdı. Tam şu ana denk gelen de geçmiş sayılıyor
 * (`pomodoroPlanla`'daki gibi bir saniyelik pay).
 *
 * Kimlik çakışırsa (iki görevin özeti aynıysa) sonraki boş kimliğe kayılıyor;
 * liste zamana göre sıralı olduğu için bu kayma her eşitlemede aynı.
 */
export function gorevBildirimPlanlari(
  gorevler: readonly Gorev[],
  simdi: Date,
  enCok = GOREV_BILDIRIM_EN_COK,
): GorevBildirimPlani[] {
  const esik = simdi.getTime() + 1000
  const adaylar = gorevler
    .map((gorev) => ({ gorev, zaman: gorevBildirimZamani(gorev) }))
    .filter((a): a is { gorev: Gorev; zaman: Date } => a.zaman !== null && a.zaman.getTime() >= esik)
    // Eşit zamanda görev kimliği sırası: çakışma kayması kararlı kalsın.
    .sort((a, b) => a.zaman.getTime() - b.zaman.getTime() || (a.gorev.id < b.gorev.id ? -1 : 1))
    .slice(0, Math.max(0, enCok))

  const kullanilan = new Set<number>()
  return adaylar.map(({ gorev, zaman }) => {
    let id = gorevBildirimKimligi(gorev.id)
    while (kullanilan.has(id)) {
      id = gorevBildirimiMi(id + 1) ? id + 1 : GOREV_BILDIRIM_ILK_ID
    }
    kullanilan.add(id)
    return { id, gorevId: gorev.id, zaman, pomodoro: gorev.pomodoro === true, ...gorevBildirimMetni(gorev) }
  })
}
