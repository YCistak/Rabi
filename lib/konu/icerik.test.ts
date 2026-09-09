import { describe, expect, it } from 'vitest'
import { KONU_DERSLERI, KONU_SINIFLARI, programBul, tumKonular } from './index'
import type { DersProgrami } from './tip'

/**
 * İçerik testleri metni değil **kuralı** denetliyor: kimlikler çakışmasın,
 * kart okunacak kadar kısa kalsın, her ders her sınıfta bir programa sahip
 * olsun.
 *
 * Uzunluk sınırı keyfî değil: kart, telefon ekranında kaydırmadan okunacak
 * kadar olmalı. Sınırı aşan kart, ikiye bölünmesi gereken karttır.
 */
const BASLIK_SINIRI = 44
const METIN_SINIRI = 240
/**
 * Bir konu bu kadar karttan uzunsa kullanıcı desteyi yarıda bırakıyor.
 *
 * Sınır sekizdi ve konunun büyüklüğüne bakmıyordu: "Üslü ve Köklü
 * Gösterimler" ile "Sonsuz Uç" aynı sayıda kart alıyordu. Ona çıkarıldı ama
 * bu bir hedef değil **tavan** — kart sayısını konunun kendi genişliği
 * belirliyor, tavanı doldurmak için kart yazmak desteyi uzatır.
 */
const KART_SINIRI = 10

const programlar = KONU_SINIFLARI.flatMap((sinif) =>
  KONU_DERSLERI.map(
    (ders) => [`${sinif}. sınıf ${ders.ad}`, programBul(ders.id, sinif)] as const,
  ),
)

describe('programlar', () => {
  it.each(programlar)('%s programı var', (_ad, program) => {
    expect(program).not.toBeNull()
    expect(program!.temalar.length).toBeGreaterThan(0)
  })

  it.each(programlar)('%s: her temada konu, her konuda kart var', (_ad, program) => {
    for (const tema of program!.temalar) {
      expect(tema.konular.length, `${tema.ad} boş`).toBeGreaterThan(0)
      for (const konu of tema.konular) {
        expect(konu.kartlar.length, `${konu.ad} boş`).toBeGreaterThan(2)
        expect(konu.kartlar.length, `${konu.ad} çok uzun`).toBeLessThanOrEqual(KART_SINIRI)
      }
    }
  })

  /*
    Özet, harita başlığında iki satıra sığan bir cümle. Uzunsa kart büyüyor
    ve altındaki "sıradaki konu" satırı ekranın dışına iniyor.
  */
  it.each(programlar)('%s: özeti var ve kısa', (_ad, program) => {
    expect(program!.ozet.trim().length).toBeGreaterThan(0)
    expect(program!.ozet.length, `özet uzun: ${program!.ozet}`).toBeLessThanOrEqual(46)
  })

  it.each(programlar)('%s: kartlar kısa', (_ad, program) => {
    for (const konu of tumKonular(program!)) {
      for (const kart of konu.kartlar) {
        expect(kart.baslik.length, `başlık uzun: ${kart.baslik}`).toBeLessThanOrEqual(BASLIK_SINIRI)
        expect(kart.metin.length, `metin uzun: ${kart.baslik}`).toBeLessThanOrEqual(METIN_SINIRI)
        expect(kart.metin.trim().length).toBeGreaterThan(0)
      }
    }
  })
})

/**
 * Kimlik çakışması sessiz bir hata: iki konu aynı kimliği taşırsa birini
 * bitirmek ötekini de bitmiş gösterir, iki kart aynı kimliği taşırsa
 * bilinmeyenler bankası birini yutar. Karşılaştırma bütün ders ve sınıflar
 * arasında yapılıyor — kayıtlar tek bir listede duruyor.
 */
describe('kimlikler', () => {
  const tumu = programlar
    .map(([, program]) => program)
    .filter((p): p is DersProgrami => p !== null)

  it('konu kimlikleri benzersiz', () => {
    const kimlikler = tumu.flatMap((p) => tumKonular(p).map((k) => k.id))
    expect(new Set(kimlikler).size).toBe(kimlikler.length)
  })

  it('tema kimlikleri benzersiz', () => {
    const kimlikler = tumu.flatMap((p) => p.temalar.map((t) => t.id))
    expect(new Set(kimlikler).size).toBe(kimlikler.length)
  })

  it('kart kimlikleri benzersiz', () => {
    const kimlikler = tumu.flatMap((p) =>
      tumKonular(p).flatMap((k) => k.kartlar.map((c) => c.id)),
    )
    expect(new Set(kimlikler).size).toBe(kimlikler.length)
  })

  /*
    Soru kimlikleri kart kimlikleriyle **aynı havuzda** olmamalı: ikisi de
    `${konuId}-${sıra}` deseninden türeseydi üçüncü kart ile üçüncü soru aynı
    kimliği taşırdı. Ayırıcı 's' eki bu yüzden var.
  */
  it('soru kimlikleri kartlarla çakışmıyor', () => {
    const kimlikler = tumu.flatMap((p) =>
      tumKonular(p).flatMap((k) => [
        ...k.kartlar.map((c) => c.id),
        ...k.sorular.map((c) => c.id),
      ]),
    )
    expect(new Set(kimlikler).size).toBe(kimlikler.length)
  })

  /** Program, kendi ders ve sınıfını taşımalı; kayıt kimliği buna göre kuruluyor. */
  it('program kendi ders ve sınıfını bildiriyor', () => {
    for (const sinif of KONU_SINIFLARI) {
      for (const ders of KONU_DERSLERI) {
        const program = programBul(ders.id, sinif)!
        expect(program.ders).toBe(ders.id)
        expect(program.sinif).toBe(sinif)
      }
    }
  })
})

/**
 * Doğru/yanlış soruları.
 *
 * Biçimin kendisi bir tuzak taşıyor: cevabı bilmeyen kullanıcı da yazı tura
 * atarak yarısını tutturur, hep aynı düğmeye basan ise iddiaların dengesine
 * göre kazanır. Testler bu yüzden içeriği değil **dengeyi** denetliyor —
 * her destede iki cevaptan ikisi de bulunsun ve genel dağılım yarı yarıya
 * kalsın.
 */
const IFADE_SINIRI = 130
const ACIKLAMA_SINIRI = 170
/** Yoklama destenin arkasına eklenen kısa bir adım; uzun olursa deste bitmiyor. */
const SORU_SINIRI = 6

describe('sorular', () => {
  const tumu = programlar
    .map(([, program]) => program)
    .filter((p): p is DersProgrami => p !== null)
  const tumSorular = tumu.flatMap((p) => tumKonular(p).flatMap((k) => k.sorular))

  it.each(programlar)('%s: her konuda soru var ve sayısı sınırda', (_ad, program) => {
    for (const konu of tumKonular(program!)) {
      expect(konu.sorular.length, `${konu.ad} sorusuz`).toBeGreaterThanOrEqual(3)
      expect(konu.sorular.length, `${konu.ad} çok soru`).toBeLessThanOrEqual(SORU_SINIRI)
    }
  })

  it.each(programlar)('%s: iddialar kısa ve gerekçeli', (_ad, program) => {
    for (const konu of tumKonular(program!)) {
      for (const s of konu.sorular) {
        expect(s.ifade.trim().length, `boş iddia: ${konu.ad}`).toBeGreaterThan(0)
        expect(s.ifade.length, `iddia uzun: ${s.ifade}`).toBeLessThanOrEqual(IFADE_SINIRI)
        expect(s.aciklama.trim().length, `gerekçesiz: ${s.ifade}`).toBeGreaterThan(0)
        expect(s.aciklama.length, `gerekçe uzun: ${s.ifade}`).toBeLessThanOrEqual(
          ACIKLAMA_SINIRI,
        )
      }
    }
  })

  /*
    İddia bir soru cümlesi değil. "Kütle korunur mu?" diye soran bir metnin
    altında Doğru/Yanlış düğmeleri anlamsız — cevap evet/hayır olurdu ve
    ekran onu doğru/yanlış diye sayardı.
  */
  it.each(programlar)('%s: iddialar soru cümlesi değil', (_ad, program) => {
    for (const konu of tumKonular(program!)) {
      for (const s of konu.sorular) {
        expect(s.ifade.includes('?'), `soru cümlesi: ${s.ifade}`).toBe(false)
      }
    }
  })

  /*
    Tek yönlü deste, cevabı içeriğe bakmadan verdiriyor: ilk iki soruda hep
    "doğru" çıktığını gören kullanıcı geri kalanını okumuyor.
  */
  it.each(programlar)('%s: her destede iki cevap da var', (_ad, program) => {
    for (const konu of tumKonular(program!)) {
      const dogru = konu.sorular.filter((s) => s.dogru).length
      expect(dogru, `${konu.ad}: hepsi yanlış`).toBeGreaterThan(0)
      expect(dogru, `${konu.ad}: hepsi doğru`).toBeLessThan(konu.sorular.length)
    }
  })

  it('genel dağılım yarı yarıya', () => {
    const oran = tumSorular.filter((s) => s.dogru).length / tumSorular.length
    expect(oran).toBeGreaterThan(0.4)
    expect(oran).toBeLessThan(0.6)
  })
})
