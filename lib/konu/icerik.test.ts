import { describe, expect, it } from 'vitest'
import { KONU_DERSLERI, KONU_SINIFLARI, programBul, tumKonular } from './index'
import type { DersProgrami } from './tip'
import { gorunenMetin, gorunenSatirlar, metniAyristir } from './kart-metni'

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
 * Konu başına kart sayısı: en az 6, en fazla 16.
 *
 * Tavan sekizdi, sonra on; ikisi de konunun genişliğine bakmıyordu ve
 * "Üslü ve Köklü Gösterimler" dört kartla geçiştiriliyordu. Aralık artık
 * Maarif programındaki konunun genişliğine göre kullanılıyor; tavan hâlâ
 * hedef değil **tavan** — tavanı doldurmak için kart yazmak desteyi uzatır,
 * taban ise "konuyu anlatmaya yetmeyen deste" sınırı.
 */
const KART_TABANI = 6
const KART_SINIRI = 16

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
        expect(konu.kartlar.length, `${konu.ad} kısa`).toBeGreaterThanOrEqual(KART_TABANI)
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
        expect(gorunenMetin(kart.metin).length, `metin uzun: ${kart.baslik}`).toBeLessThanOrEqual(METIN_SINIRI)
        expect(kart.metin.trim().length).toBeGreaterThan(0)
      }
    }
  })
})

/**
 * Kartın **düzeni** — uzunluğu değil, nasıl bölündüğü.
 *
 * Uzunluk sınırı tek başına yetmedi: 240 karakterlik tek bir paragrafa dört
 * ayrı bilgi noktalarla dizilebiliyordu ve telefonda bu, okunmayan bir yazı
 * bloğuydu ("sin: 30° → 1/2, 45° → √2/2 … cos tersi sırayla. tan: …").
 * Kullanıcı iki kez "karmakarışık" dedi. Kurallar bu yüzden satıra iniyor:
 *
 * - **Satır kısa.** Bir satır (paragraf ya da madde) telefonda en çok üç
 *   satıra kırılacak kadar; daha uzunu bölünmeli ya da maddelenmeli.
 * - **Satırda en çok iki cümle.** Üçüncü cümle yeni bir bilgi ve yeni bir
 *   satırı hak ediyor.
 * - **Liste en az iki madde.** Tek maddelik liste, madde imi takılmış bir
 *   paragraf.
 * - **Listede ya hepsi adlı ya hiçbiri.** "**Ekvator:** …" diye başlayan bir
 *   maddenin yanında adsız bir madde, hizası kaymış bir tablo gibi okunuyor.
 * - İşaretler temiz: kapanmayan `**`, `•` ya da boşluksuz `-` yok.
 */
const SATIR_SINIRI = 110
const CUMLE_SINIRI = 2

/**
 * Cümle sayısı: nokta/ünlem/soru işaretinden sonra büyük harf ya da rakam.
 *
 * Roma rakamından sonraki nokta sayılmıyor: "II. Osman ve IV. Murat" tek
 * cümle, ama sade kural onu üç cümle sayıyordu.
 */
function cumleSayisi(satir: string): number {
  return satir
    .split(/(?<![\s(][IVXLC]+\.)(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ0-9])/u)
    .filter((c) => c.trim()).length
}

describe('kart düzeni', () => {
  it.each(programlar)('%s: kartlar düzenli', (_ad, program) => {
    const hatalar: string[] = []
    for (const konu of tumKonular(program!)) {
      for (const kart of konu.kartlar) {
        const ad = `${konu.id} › ${kart.baslik}`
        for (const hamSatir of kart.metin.split('\n')) {
          const satir = hamSatir.trim()
          if (!satir) continue
          if ((satir.match(/\*\*/g) ?? []).length % 2 !== 0) hatalar.push(`${ad}: kapanmayan ** — ${satir}`)
          if (/^[-•]\S/.test(satir) || satir.startsWith('•')) hatalar.push(`${ad}: madde imi "- " olmalı — ${satir}`)
          if (satir === '-') hatalar.push(`${ad}: boş madde`)
        }
        for (const satir of gorunenSatirlar(kart.metin)) {
          if (satir.length > SATIR_SINIRI) hatalar.push(`${ad}: satır uzun (${satir.length}) — ${satir}`)
          if (cumleSayisi(satir) > CUMLE_SINIRI) hatalar.push(`${ad}: satırda ${cumleSayisi(satir)} cümle — ${satir}`)
        }
        for (const blok of metniAyristir(kart.metin)) {
          if (blok.tur !== 'liste') continue
          if (blok.maddeler.length < 2) hatalar.push(`${ad}: tek maddelik liste`)
          const adli = blok.maddeler.map((m) => m[0]?.vurgu === true)
          if (adli.some(Boolean) && !adli.every(Boolean)) hatalar.push(`${ad}: listede adlı ve adsız madde karışık`)
        }
      }
    }
    expect(hatalar, hatalar.join('\n')).toEqual([])
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
 * Deste sonu soruları — doğru/yanlış iddialar ve iki şıklı sorular.
 *
 * Biçimin kendisi bir tuzak taşıyor: cevabı bilmeyen kullanıcı da yazı tura
 * atarak yarısını tutturur, hep aynı düğmeye basan ise cevapların dengesine
 * göre kazanır. Testler bu yüzden içeriği değil **dengeyi** denetliyor —
 * her destede iki cevaptan ikisi de bulunsun ve genel dağılım yarı yarıya
 * kalsın. Aynı kural iki şıklıda A/B için geçerli.
 *
 * Soru sayısı kart sayısıyla **orantılı**: altı kartlık konuda yedi–sekiz,
 * on altı kartlıkta yirmiye yakın soru. Sabit bir sayı kısa konuyu sınava
 * çevirir, uzun konunun yarısını yoklamadan bırakırdı.
 */
const IFADE_SINIRI = 130
const ACIKLAMA_SINIRI = 170
const SIKLI_SORU_SINIRI = 110
const SIKLI_SIK_SINIRI = 44

function soruAraligi(kartSayisi: number): [number, number] {
  return [kartSayisi + 1, Math.floor(kartSayisi * 1.3) + 1]
}

describe('sorular', () => {
  const tumu = programlar
    .map(([, program]) => program)
    .filter((p): p is DersProgrami => p !== null)
  const tumSorular = tumu.flatMap((p) => tumKonular(p).flatMap((k) => k.sorular))
  const iddialar = tumSorular.filter((s) => s.tur !== 'sikli')
  const sikliler = tumSorular.filter((s) => s.tur === 'sikli')

  it.each(programlar)('%s: soru sayısı kart sayısıyla orantılı', (_ad, program) => {
    for (const konu of tumKonular(program!)) {
      const [enAz, enCok] = soruAraligi(konu.kartlar.length)
      expect(konu.sorular.length, `${konu.ad}: ${konu.kartlar.length} karta ${konu.sorular.length} soru az`).toBeGreaterThanOrEqual(enAz)
      expect(konu.sorular.length, `${konu.ad}: ${konu.kartlar.length} karta ${konu.sorular.length} soru çok`).toBeLessThanOrEqual(enCok)
    }
  })

  /*
    Her konuda iki biçim de var: yalnızca iddia soran yoklama "hangisi" diye
    soramıyor, yalnızca şık soran yoklama ise iddiayı tartma alışkanlığını
    kaybettiriyor. En az ikişer — tek bir örnekle denge kurulamaz.
  */
  it.each(programlar)('%s: her konuda iki soru biçimi de var', (_ad, program) => {
    for (const konu of tumKonular(program!)) {
      const sikli = konu.sorular.filter((s) => s.tur === 'sikli').length
      expect(sikli, `${konu.ad}: iki şıklı soru az`).toBeGreaterThanOrEqual(2)
      expect(konu.sorular.length - sikli, `${konu.ad}: doğru/yanlış az`).toBeGreaterThanOrEqual(2)
    }
  })

  it.each(programlar)('%s: iddialar ve sorular kısa, gerekçeli', (_ad, program) => {
    for (const konu of tumKonular(program!)) {
      for (const s of konu.sorular) {
        expect(s.aciklama.trim().length, `gerekçesiz: ${konu.ad}`).toBeGreaterThan(0)
        expect(s.aciklama.length, `gerekçe uzun: ${s.aciklama}`).toBeLessThanOrEqual(ACIKLAMA_SINIRI)
        if (s.tur === 'sikli') {
          expect(s.soru.trim().length, `boş soru: ${konu.ad}`).toBeGreaterThan(0)
          expect(s.soru.length, `soru uzun: ${s.soru}`).toBeLessThanOrEqual(SIKLI_SORU_SINIRI)
          expect(s.siklar[0]).not.toBe(s.siklar[1])
          for (const sik of s.siklar) {
            expect(sik.trim().length).toBeGreaterThan(0)
            expect(sik.length, `şık uzun: ${sik}`).toBeLessThanOrEqual(SIKLI_SIK_SINIRI)
          }
        } else {
          expect(s.ifade.trim().length, `boş iddia: ${konu.ad}`).toBeGreaterThan(0)
          expect(s.ifade.length, `iddia uzun: ${s.ifade}`).toBeLessThanOrEqual(IFADE_SINIRI)
        }
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
        if (s.tur === 'sikli') continue
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
      const iddia = konu.sorular.filter((s) => s.tur !== 'sikli')
      const dogru = iddia.filter((s) => s.dogru === true).length
      expect(dogru, `${konu.ad}: hepsi yanlış`).toBeGreaterThan(0)
      expect(dogru, `${konu.ad}: hepsi doğru`).toBeLessThan(iddia.length)
    }
  })

  it('doğru/yanlış genel dağılımı yarı yarıya', () => {
    const oran = iddialar.filter((s) => s.dogru === true).length / iddialar.length
    expect(oran).toBeGreaterThan(0.4)
    expect(oran).toBeLessThan(0.6)
  })

  it('iki şıklı sorularda doğru şık A ile B arasında dengeli', () => {
    if (sikliler.length < 10) return
    const b = sikliler.filter((s) => s.dogru === 1).length / sikliler.length
    expect(b).toBeGreaterThan(0.4)
    expect(b).toBeLessThan(0.6)
  })
})

/**
 * Kart etiketi ve Rabi'nin notu; hızlı kontrol.
 *
 * Üçü de isteğe bağlı ve çoğu kartta henüz yok; testler yalnızca yazılmış
 * olanın ekrana sığdığını ve kontrolün **var olan** bir karta dayandığını
 * denetliyor. Var olmayan karta dayanan kontrol "Tekrar oku" deyince hiçbir
 * yere dönemez.
 */
const ETIKET_SINIRI = 18
const NOT_SINIRI = 120
const KONTROL_SORU_SINIRI = 90
const SIK_SINIRI = 44
const KONTROL_ACIKLAMA_SINIRI = 170

describe('kart notu ve hızlı kontrol', () => {
  it.each(programlar)('%s: etiket ve not kısa', (_ad, program) => {
    for (const konu of tumKonular(program!)) {
      for (const kart of konu.kartlar) {
        if (kart.etiket !== undefined) {
          expect(kart.etiket.trim().length, `boş etiket: ${kart.baslik}`).toBeGreaterThan(0)
          expect(kart.etiket.length, `etiket uzun: ${kart.etiket}`).toBeLessThanOrEqual(ETIKET_SINIRI)
        }
        if (kart.not !== undefined) {
          expect(kart.not.trim().length, `boş not: ${kart.baslik}`).toBeGreaterThan(0)
          expect(kart.not.length, `not uzun: ${kart.not}`).toBeLessThanOrEqual(NOT_SINIRI)
        }
      }
    }
  })

  /*
    On karttan uzun destede iki kontrol, kısasında bir: tek soru uzun
    destenin ikinci yarısını hiç yoklamıyor, iki soru kısa desteyi sınava
    çeviriyor. Sayı sabit ki içerik yazarken unutulmasın.
  */
  it.each(programlar)('%s: her konuda uzunluğuna göre bir ya da iki kontrol var', (_ad, program) => {
    for (const konu of tumKonular(program!)) {
      const beklenen = konu.kartlar.length > 10 ? 2 : 1
      expect(konu.kontroller.length, `${konu.ad}: kontrol sayısı`).toBe(beklenen)
    }
  })

  /*
    Doğru şık hep A'da olsaydı soru okunmadan cevaplanırdı; deste sonundaki
    doğru/yanlış dengesinin aynısı. Konu başına değil bütünde ölçülüyor —
    tek sorulu konuda denge kurulamaz.
  */
  it('kontrollerde doğru şık A ile B arasında dengeli', () => {
    const hepsi = programlar
      .map(([, p]) => p)
      .filter((p): p is DersProgrami => p !== null)
      .flatMap((p) => tumKonular(p).flatMap((k) => k.kontroller))
    if (hepsi.length < 10) return
    const b = hepsi.filter((k) => k.dogru === 1).length / hepsi.length
    expect(b).toBeGreaterThan(0.35)
    expect(b).toBeLessThan(0.65)
  })

  it.each(programlar)('%s: hızlı kontrol var olan bir karta dayanıyor ve kısa', (_ad, program) => {
    for (const konu of tumKonular(program!)) {
      for (const k of konu.kontroller) {
      expect(k.kart, `${konu.ad}: kontrol kartı yok`).toBeGreaterThanOrEqual(1)
      expect(k.kart, `${konu.ad}: kontrol kartı yok`).toBeLessThanOrEqual(konu.kartlar.length)
      expect(k.soru.length, `soru uzun: ${k.soru}`).toBeLessThanOrEqual(KONTROL_SORU_SINIRI)
      expect(k.siklar[0]).not.toBe(k.siklar[1])
      for (const sik of k.siklar) {
        expect(sik.trim().length).toBeGreaterThan(0)
        expect(sik.length, `şık uzun: ${sik}`).toBeLessThanOrEqual(SIK_SINIRI)
      }
      expect(k.aciklama.dogru.length).toBeLessThanOrEqual(KONTROL_ACIKLAMA_SINIRI)
      expect(k.aciklama.yanlis.length).toBeLessThanOrEqual(KONTROL_ACIKLAMA_SINIRI)
      }
    }
  })
})
