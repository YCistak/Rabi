/**
 * Oyun Bankası — mini oyunlarda karıştırılan soruların biriktiği havuz.
 *
 * Fotoğraflı **Yanlış Soru Bankası**'ndan (`lib/resim-depo.ts`) bilerek ayrı:
 * o, kullanıcının kendi çektiği fotoğraflar; burası oyunların kendi soruları.
 * Metin olarak duruyorlar, o yüzden yeniden oynanabiliyorlar — fotoğrafa
 * bakmakla soruyu tekrar çözmek arasındaki fark bu.
 *
 * Kayıt kendi kendine yeter: soruyu ekrana çizmek ve doğrusunu bilmek için
 * gereken her şey içinde. Havuzdaki sıraya (indekse) bağlanmadı, çünkü havuza
 * yeni soru eklendiğinde bütün banka kayarrdı.
 */

import type { OyunId } from '../types'
import type { IslemTuru } from './islem'

/** Bir kaydın bankadan düşmesi için gereken üst üste doğru sayısı. */
export const DUSME_ESIGI = 3

/**
 * Bankanın en fazla tutacağı kayıt.
 *
 * Sınırsız olsaydı aylar sonra yüzlerce kayıt birikir, "sadece bunlardan bir
 * tur" da rastgele bir tura dönerdi. Sınır aşılınca **en eski** kayıt düşer:
 * yeni yapılan hata, aylar önce yapılandan daha çok ilgi hak ediyor.
 */
export const BANKA_SINIRI = 100

export type BankaSorusu =
  | { oyun: 'yazim'; dogru: string; yanlis: string; kural: string }
  | { oyun: 'islem'; islemTuru: IslemTuru; metin: string; sonuc: number }
  | { oyun: 'edebiyat'; eser: string; yazar: string }

export type BankaKaydi = {
  /** Soru içeriğinden türetilen kimlik; aynı soru iki kez eklenmez. */
  id: string
  soru: BankaSorusu
  /** Kaç kez yanlış bilindi. "3 kez" rozeti bunu gösteriyor. */
  kacKez: number
  /** Üst üste kaç doğru. `DUSME_ESIGI`'ne ulaşınca kayıt bankadan çıkar. */
  ardisikDogru: number
  /** İlk eklenme (ISO tarih) — sınır aşılınca en eskisi düşsün diye. */
  eklenme: string
  /** Son yanlış bilinme tarihi (ISO). */
  sonYanlis: string
}

/** Bir turda verilen cevap; hem doğrular hem yanlışlar bankaya bildirilir. */
export type BankaCevabi = {
  soru: BankaSorusu
  dogruMu: boolean
}

// ---------------------------------------------------------------------------
// Oyunların kendi soru tiplerinden banka sorusuna çevirim
//
// Dönüştürücüler burada, oyun dosyalarında değil: banka üç oyunun da soru
// şeklini bilmek zorunda, ama oyunların bankayı bilmesine gerek yok.
// ---------------------------------------------------------------------------

export function yazimdanBanka(soru: {
  dogru: string
  yanlis: string
  kural: string
}): BankaSorusu {
  return { oyun: 'yazim', dogru: soru.dogru, yanlis: soru.yanlis, kural: soru.kural }
}

export function islemdenBanka(soru: {
  tur: IslemTuru
  metin: string
  sonuc: number
}): BankaSorusu {
  return { oyun: 'islem', islemTuru: soru.tur, metin: soru.metin, sonuc: soru.sonuc }
}

export function edebiyattanBanka(es: { eser: string; yazar: string }): BankaSorusu {
  return { oyun: 'edebiyat', eser: es.eser, yazar: es.yazar }
}

/**
 * Kayıt kimliği.
 *
 * Soru metninden üretiliyor, rastgele değil: aynı kelimeyi ikinci kez
 * karıştırdığında yeni kayıt açılmamalı, mevcut kaydın sayacı artmalı.
 */
export function bankaKimligi(soru: BankaSorusu): string {
  switch (soru.oyun) {
    case 'yazim':
      return `yazim:${soru.dogru}`
    case 'islem':
      return `islem:${soru.metin}`
    case 'edebiyat':
      return `edebiyat:${soru.eser}`
  }
}

/** Listede görünen soru metni. */
export function bankaSorusuMetni(soru: BankaSorusu): string {
  switch (soru.oyun) {
    case 'yazim':
      return soru.yanlis
    case 'islem':
      return soru.metin
    case 'edebiyat':
      return soru.eser
  }
}

/** Listede görünen doğru cevap. */
export function bankaCevabiMetni(soru: BankaSorusu): string {
  switch (soru.oyun) {
    case 'yazim':
      return soru.dogru
    case 'islem':
      return String(soru.sonuc)
    case 'edebiyat':
      return soru.yazar
  }
}

/**
 * Biten turun cevaplarını bankaya işler.
 *
 * Tek fonksiyon hem ekliyor hem düşürüyor, çünkü ikisi aynı kuralın iki yüzü:
 * yanlış bilinen girer, üst üste `DUSME_ESIGI` kez doğru bilinen çıkar. Ayrı
 * yazılsaydı normal turda verilen doğru cevabın bankayı ilerletmesi unutulurdu —
 * oysa asıl istenen bu: soruyu nerede bilirsen bil, öğrenmiş sayılırsın.
 *
 * Saf: girdiyi değiştirmiyor, yeni dizi döndürüyor.
 */
export function bankayiGuncelle(
  banka: readonly BankaKaydi[],
  cevaplar: readonly BankaCevabi[],
  bugunIso: string,
): BankaKaydi[] {
  const harita = new Map(banka.map((k) => [k.id, { ...k }]))

  for (const cevap of cevaplar) {
    const id = bankaKimligi(cevap.soru)
    const mevcut = harita.get(id)

    if (!cevap.dogruMu) {
      if (mevcut) {
        harita.set(id, {
          ...mevcut,
          // Soru güncelleniyor: havuzdaki kural metni sonradan düzeltilmiş olabilir.
          soru: cevap.soru,
          kacKez: mevcut.kacKez + 1,
          ardisikDogru: 0,
          sonYanlis: bugunIso,
        })
      } else {
        harita.set(id, {
          id,
          soru: cevap.soru,
          kacKez: 1,
          ardisikDogru: 0,
          eklenme: bugunIso,
          sonYanlis: bugunIso,
        })
      }
      continue
    }

    // Doğru cevap yalnızca bankada duran bir soruyu ilerletir; bilinen soru
    // bankaya girmez.
    if (!mevcut) continue
    const ilerleme = mevcut.ardisikDogru + 1
    if (ilerleme >= DUSME_ESIGI) harita.delete(id)
    else harita.set(id, { ...mevcut, ardisikDogru: ilerleme })
  }

  const hepsi = [...harita.values()]
  if (hepsi.length <= BANKA_SINIRI) return hepsi

  // Sınır aşıldı: en eski eklenenler düşer.
  return [...hepsi].sort((a, b) => a.eklenme.localeCompare(b.eklenme)).slice(-BANKA_SINIRI)
}

/** Bankadaki kayıtları oyun kimliğine göre sayar. */
/**
 * Güncelleme sırasında bankadan kaç kaydın düştüğü.
 *
 * `bankayiGuncelle` düşenleri siliyor, yani sonuca bakarak sayılamıyorlar; iki
 * listeyi karşılaştırmak gerekiyor. Boyut farkı yetmez, aynı turda hem ekleme
 * hem düşme olabilir.
 */
export function dusenSayisi(
  onceki: readonly BankaKaydi[],
  sonraki: readonly BankaKaydi[],
): number {
  const kalan = new Set(sonraki.map((k) => k.id))
  return onceki.filter((k) => !kalan.has(k.id)).length
}

export function bankaDagilimi(banka: readonly BankaKaydi[]): Record<OyunId, number> {
  const dagilim: Record<OyunId, number> = { yazim: 0, islem: 0, edebiyat: 0 }
  for (const kayit of banka) dagilim[kayit.soru.oyun]++
  return dagilim
}

/** Belirli bir oyunun kayıtları, en son yanlış bilinen en üstte. */
export function bankaSuz(banka: readonly BankaKaydi[], oyun: OyunId | 'tumu'): BankaKaydi[] {
  const secilen = oyun === 'tumu' ? [...banka] : banka.filter((k) => k.soru.oyun === oyun)
  return secilen.sort((a, b) => b.sonYanlis.localeCompare(a.sonYanlis) || b.kacKez - a.kacKez)
}

/**
 * "Tümü" seçiliyken tur hangi oyundan açılacak: en çok kaydı olan.
 *
 * Tur mantığı oyuna özgü (yazımda iki şık, işlemde tuş takımı, edebiyatta
 * eşleştirme); üç oyunu tek turda karıştırmak her birinin kendi ekranını
 * bozardı. En kalabalık oyunu seçmek, en çok tekrar gereken yer olduğu için
 * de doğru sıralama.
 */
export function enKalabalikOyun(banka: readonly BankaKaydi[]): OyunId | null {
  const dagilim = bankaDagilimi(banka)
  let enIyi: OyunId | null = null
  for (const oyun of ['yazim', 'islem', 'edebiyat'] as const) {
    if (dagilim[oyun] > 0 && (enIyi === null || dagilim[oyun] > dagilim[enIyi])) enIyi = oyun
  }
  return enIyi
}
