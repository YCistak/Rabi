/**
 * Kitap sayfası yerleşimi — saf hesap.
 *
 * Teste girince sorular önce test kitabındaki gibi sayfalara dizilir: sayfa
 * başına 3–4 soru. Telefonda okunur yazıyla (15 px) dört soru bir ekrana
 * sığmaz; sayfa kendi içinde aşağı kayar, sayfalar yana çevrilir. Kaç sorunun
 * aynı sayfaya gireceği sorunun tahmini yüksekliğinden çıkar: kısa sorular
 * dörder, şekilli ya da uzun sorular üçer gelir. Tahmin yalnız gruplamada
 * kullanılır; ekrandaki gerçek yükseklik tarayıcının işidir.
 */
import type { Gorsel } from '@/lib/konu/tip'
import { gorunurUzunluk, sikDuzeni } from './duzen'
import type { BankaSorusu } from './tip'

/** 390 px'lik telefonda sayfa metninin genişliği (ekran ve kâğıt kenar boşlukları düşülmüş). */
export const SAYFA_METIN_GENISLIGI = 326
/** Sayfadaki soru metni: 15 px Nunito, satır yüksekliği 1,55. */
export const SAYFA_YAZI_BOYU = 15
const SATIR_YUKSEKLIGI = SAYFA_YAZI_BOYU * 1.55
/** Nunito'da ortalama harf genişliği, yazı boyunun oranı olarak (Türkçe metin, rakamlar dahil). */
const HARF_ORANI = 0.53
/** Sayfadaki şık satırının yüksekliği (dokunma hedefi 44 px). */
const SIK_SATIRI = 44
/** Soru başlığı (numara ve "Çöz" düğmesi) ile sorular arası boşluk. */
const SORU_CERCEVESI = 36 + 28

/** Kitap sayfasında beş sütun yalnız çok kısa şıkta ("12√3" beşe sığmıyor, harfine yapışıyordu). */
export const SAYFA_SIK_SINIRLARI = { bes: 3, iki: 13 } as const

/**
 * Bir sayfanın hedef yüksekliği (tahmini px). Dört kısa soru (≈ 250 px)
 * buna sığar; dört şekilli soru (≈ 550 px) sığmaz, üçe iner.
 */
export const SAYFA_BUTCESI = 1150
/** Her yeni sayfanın bedeli: sığan yerde dört soruluk sayfa üç soruluktan iyidir. */
const SAYFA_BEDELI = 600
/** Bütçeyi aşan her pikselin bedeli. */
const TASMA_BEDELI = 2
/** 3'ten az soruluk sayfanın eksik soru başına bedeli: yalnız başka çare yoksa (5 soru: 3 + 2, 4 + 1 değil). */
const EKSIK_SAYFA_BEDELI = 4000

function satirSayisi(metin: string, karakter: number): number {
  return metin.split('\n').reduce((toplam, satir) => {
    if (satir.trim() === '') return toplam + 0.35
    return toplam + Math.max(1, Math.ceil(gorunurUzunluk(satir) / karakter))
  }, 0)
}

/** Şeklin sayfadaki tahmini yüksekliği; şekil sayfa genişliğine yayılır. */
export function sekilYuksekligi(gorsel: Gorsel, genislik = SAYFA_METIN_GENISLIGI): number {
  const cerceve = 30
  switch (gorsel.tur) {
    case 'koordinat': {
      const [x1, x2, y1, y2] = gorsel.pencere
      const oran = Math.abs(y2 - y1) / Math.max(1e-6, Math.abs(x2 - x1))
      return cerceve + Math.min(380, Math.max(150, genislik * oran))
    }
    case 'tablo':
      return cerceve + 40 * (gorsel.satirlar.length + 1)
    case 'sayiDogrusu':
      return cerceve + 80
    case 'venn':
      return cerceve + 200
    case 'akis': {
      const dikey = gorsel.dikey || gorsel.adimlar.length > 3
      return cerceve + (dikey ? gorsel.adimlar.length * 90 : 104)
    }
    default:
      return cerceve + 220
  }
}

/** Sorunun sayfadaki tahmini yüksekliği (px). */
export function soruYuksekligi(soru: BankaSorusu, genislik = SAYFA_METIN_GENISLIGI): number {
  const karakter = Math.max(10, Math.floor(genislik / (SAYFA_YAZI_BOYU * HARF_ORANI)))
  let yukseklik = SORU_CERCEVESI + satirSayisi(soru.soru, karakter) * SATIR_YUKSEKLIGI
  if (soru.onculler?.length) {
    const oncul = karakter - 4
    yukseklik += 16 + soru.onculler.reduce((t, o) => t + satirSayisi(o, oncul) * SATIR_YUKSEKLIGI + 4, 0)
  }
  if (soru.gorsel) yukseklik += 12 + sekilYuksekligi(soru.gorsel, genislik)
  const duzen = sikDuzeni(soru.siklar, SAYFA_SIK_SINIRLARI)
  yukseklik += 12
  if (duzen === 'bes') yukseklik += SIK_SATIRI
  else if (duzen === 'iki') yukseklik += 3 * SIK_SATIRI
  else {
    const sikKarakter = karakter - 4
    yukseklik += soru.siklar.reduce(
      (t, sik) => t + Math.max(SIK_SATIRI, satirSayisi(sik, sikKarakter) * SATIR_YUKSEKLIGI + 14),
      0,
    )
  }
  return Math.round(yukseklik)
}

export type SayfaSecenegi = { butce?: number; enAz?: number; enCok?: number }

/**
 * Soruları sırasını bozmadan sayfalara böler; her sayfa soru sıralarının
 * listesi. Dinamik programlama: her sayfanın bedeli (sabit bedel + bütçe
 * taşması + eksik sayfa) toplamı en küçük olan bölünüş seçilir. Soru sayısı
 * küçük (bir test 12) olduğu için hesap anlık.
 */
export function sayfalaraBol(yukseklikler: readonly number[], secenek: SayfaSecenegi = {}): number[][] {
  const { butce = SAYFA_BUTCESI, enAz = 3, enCok = 4 } = secenek
  const n = yukseklikler.length
  if (n === 0) return []
  const enIyi: number[] = [0]
  const onceki: number[] = [0]
  for (let son = 1; son <= n; son++) {
    enIyi[son] = Infinity
    let yukseklik = 0
    for (let boy = 1; boy <= Math.min(enCok, son); boy++) {
      yukseklik += yukseklikler[son - boy]
      const eksik = n >= enAz ? Math.max(0, enAz - boy) * EKSIK_SAYFA_BEDELI : 0
      const bedel = enIyi[son - boy] + SAYFA_BEDELI + Math.max(0, yukseklik - butce) * TASMA_BEDELI + eksik
      if (bedel < enIyi[son]) {
        enIyi[son] = bedel
        onceki[son] = son - boy
      }
    }
  }
  const sayfalar: number[][] = []
  for (let son = n; son > 0; son = onceki[son]) {
    const bas = onceki[son]
    sayfalar.unshift(Array.from({ length: son - bas }, (_, i) => bas + i))
  }
  return sayfalar
}

/** Soruların sayfalara dizilişi (testin her açılışında aynı). */
export function testSayfalari(sorular: readonly BankaSorusu[], secenek?: SayfaSecenegi): number[][] {
  return sayfalaraBol(
    sorular.map((soru) => soruYuksekligi(soru)),
    secenek,
  )
}

/** Sorunun bulunduğu sayfanın sırası. */
export function sayfaBul(sayfalar: readonly (readonly number[])[], sira: number): number {
  const bulunan = sayfalar.findIndex((sayfa) => sayfa.includes(sira))
  return bulunan === -1 ? 0 : bulunan
}
