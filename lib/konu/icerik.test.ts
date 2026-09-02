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
/** Bir konu bu kadar karttan uzunsa kullanıcı desteyi yarıda bırakıyor. */
const KART_SINIRI = 8

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
