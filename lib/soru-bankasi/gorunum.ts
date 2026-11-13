/**
 * Soru sayfasının görünümü — kaydırma ve yakınlaştırma, saf hesap.
 *
 * Sayfa tarayıcının kendi kaydırmasıyla değil, tek bir dönüşümle kayıyor:
 * kalem seçiliyken tek parmak çizerken iki parmağın kaydırması ve kıstırması
 * yerli kaydırmayla yapılamıyor. Değerler CSS pikseli: içerikteki (x, y)
 * noktası ekranda `x * olcek + gorunum.x` yerinde. İçerik görüş alanıyla aynı
 * genişlikte dizildiği için %100'de yatay kayma yok.
 */
export type Nokta = [number, number]

export type Gorunum = { olcek: number; x: number; y: number }

export type GorusOlcusu = {
  /** Görüş alanı (ve %100'deki içerik) genişliği. */
  genislik: number
  yukseklik: number
  /** İçeriğin %100'deki yüksekliği (karalama boşluğu dahil). */
  icerikYukseklik: number
}

export const GORUNUM_BASI: Gorunum = { olcek: 1, x: 0, y: 0 }
export const OLCEK_EN_AZ = 1
export const OLCEK_EN_COK = 4
/** Çift dokunmanın yakınlığı. */
export const CIFT_DOKUNMA_OLCEGI = 2

function aralikta(deger: number, enAz: number, enCok: number): number {
  return Math.min(enCok, Math.max(enAz, deger))
}

/** İçeriğin kenarı görüş alanının içine girmesin; içerik kısa ise üstte dursun. */
export function gorunumSinirla(g: Gorunum, o: GorusOlcusu): Gorunum {
  const olcek = aralikta(g.olcek, OLCEK_EN_AZ, OLCEK_EN_COK)
  const enAzX = Math.min(0, o.genislik - o.genislik * olcek)
  const enAzY = Math.min(0, o.yukseklik - o.icerikYukseklik * olcek)
  return { olcek, x: aralikta(g.x, enAzX, 0), y: aralikta(g.y, enAzY, 0) }
}

/** `dx`, `dy` içeriğin ekranda gideceği yön (parmakla aynı yön). */
export function gorunumKaydir(g: Gorunum, dx: number, dy: number, o: GorusOlcusu): Gorunum {
  return gorunumSinirla({ ...g, x: g.x + dx, y: g.y + dy }, o)
}

/** Ölçeği değiştirir; `odak` (görüş alanına göre) altındaki içerik yerinde kalır. */
export function gorunumOlcekle(g: Gorunum, olcek: number, odak: Nokta, o: GorusOlcusu): Gorunum {
  const hedef = aralikta(olcek, OLCEK_EN_AZ, OLCEK_EN_COK)
  const oran = hedef / g.olcek
  return gorunumSinirla({ olcek: hedef, x: odak[0] - (odak[0] - g.x) * oran, y: odak[1] - (odak[1] - g.y) * oran }, o)
}

export function icerikNoktasi(g: Gorunum, ekran: Nokta): Nokta {
  return [(ekran[0] - g.x) / g.olcek, (ekran[1] - g.y) / g.olcek]
}

export type TekerlekOlayi = { deltaX: number; deltaY: number; deltaMode: number; shiftKey: boolean }

/**
 * Tekerlek farkını piksele çevirir. Satır kipi (Firefox) 16 px, sayfa kipi
 * görüş alanının %90'ı; Shift basılıyken dikey tekerlek yatay kaydırır.
 */
export function tekerlekFarki(olay: TekerlekOlayi, sayfaYuksekligi: number): { dx: number; dy: number } {
  const carpan = olay.deltaMode === 1 ? 16 : olay.deltaMode === 2 ? sayfaYuksekligi * 0.9 : 1
  const dx = olay.deltaX * carpan
  const dy = olay.deltaY * carpan
  return olay.shiftKey && dx === 0 ? { dx: dy, dy: 0 } : { dx, dy }
}

/**
 * Ctrl+tekerlek (ve dokunmatik yüzeyin kıstırması, tarayıcı onu Ctrl+tekerlek
 * olarak yolluyor) yakınlığı. Üstel: fare tekerleğinin bir çentiği (100 px)
 * ~%22, dokunmatik yüzeyin küçük farkları akıcı adımlar.
 */
export function tekerlekOlcegi(olcek: number, dy: number): number {
  return aralikta(olcek * Math.exp(-dy * 0.002), OLCEK_EN_AZ, OLCEK_EN_COK)
}

export type ParmakCifti = { ilk: Nokta; ikinci: Nokta }

function uzaklik(a: Nokta, b: Nokta): number {
  return Math.hypot(b[0] - a[0], b[1] - a[1])
}

function orta(cift: ParmakCifti): Nokta {
  return [(cift.ilk[0] + cift.ikinci[0]) / 2, (cift.ilk[1] + cift.ikinci[1]) / 2]
}

/**
 * İki parmak: aralarındaki uzaklık ölçeği, orta noktaları kaydırmayı verir.
 * Önceki orta noktanın altındaki içerik yeni orta noktanın altına gelir.
 */
export function kistirmaGorunumu(g: Gorunum, onceki: ParmakCifti, sonraki: ParmakCifti, o: GorusOlcusu): Gorunum {
  const oncekiUzaklik = uzaklik(onceki.ilk, onceki.ikinci)
  const oran = oncekiUzaklik < 1 ? 1 : uzaklik(sonraki.ilk, sonraki.ikinci) / oncekiUzaklik
  const olcek = aralikta(g.olcek * oran, OLCEK_EN_AZ, OLCEK_EN_COK)
  const [icerikX, icerikY] = icerikNoktasi(g, orta(onceki))
  const [yeniX, yeniY] = orta(sonraki)
  return gorunumSinirla({ olcek, x: yeniX - icerikX * olcek, y: yeniY - icerikY * olcek }, o)
}

/** Çift dokunma/çift tık: %100'deyken dokunulan yere 2x, yakınken %100. */
export function ciftDokunmaGorunumu(g: Gorunum, nokta: Nokta, o: GorusOlcusu): Gorunum {
  if (g.olcek > 1.05) return gorunumOlcekle(g, 1, nokta, o)
  return gorunumOlcekle(g, CIFT_DOKUNMA_OLCEGI, nokta, o)
}

/**
 * Bırakınca süren kayma: hız her milisaniyede üstel söner (zaman sabiti
 * 325 ms, iOS'un kaydırma hissine yakın). Hız px/ms.
 */
export const ATALET_ZAMAN_SABITI = 325
export const ATALET_EN_AZ_HIZ = 0.02

export function ataletAdimi(hiz: Nokta, dt: number): { hiz: Nokta; kayma: Nokta } {
  const sonum = Math.exp(-dt / ATALET_ZAMAN_SABITI)
  const yeni: Nokta = [hiz[0] * sonum, hiz[1] * sonum]
  // Sönen hızın bu adımda aldığı yol: v·τ·(1 − e^(−dt/τ)).
  const yol = ATALET_ZAMAN_SABITI * (1 - sonum)
  return { hiz: yeni, kayma: [hiz[0] * yol, hiz[1] * yol] }
}

/** Son ~100 ms'deki hareketten hız (px/ms); örnek yoksa sıfır. */
export function hizOlc(ornekler: readonly { x: number; y: number; zaman: number }[], simdi: number): Nokta {
  const yakin = ornekler.filter((ornek) => simdi - ornek.zaman <= 100)
  if (yakin.length < 2) return [0, 0]
  const ilk = yakin[0]
  const son = yakin[yakin.length - 1]
  const sure = son.zaman - ilk.zaman
  if (sure <= 0) return [0, 0]
  return [(son.x - ilk.x) / sure, (son.y - ilk.y) / sure]
}
