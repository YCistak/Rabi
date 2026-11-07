/**
 * Rabi sesli sohbetinin durum birikimi ve kurallı cevap mantığı.
 *
 * Kullanıcının art arda girdiği sesli/yazılı mesajlar birikimde toplanır,
 * Rabi yalnızca anladığı bilgileri özetleyen ve uydurma yapmayan kurallı
 * yanıtlar döner (yapay zekâ veya dış ağ bağımlılığı yoktur).
 */

import type { Sablon } from './types'
import type { SesliCozum, SesliDeneme, SesliSoru } from './sesli-giris'

export type SohbetBirikimi = { sorular: SesliSoru[]; deneme: SesliDeneme | null }

export const BOS_BIRIKIM: SohbetBirikimi = {
  sorular: [],
  deneme: null,
}

/** Rabi'nin pencere açılınca ilk sorusu. */
export const ACILIS_SORUSU = 'Bugün ne çözdün?'

const KAPANIS_SORULARI = [
  'Başka?',
  'Başka ne çözdün?',
  'Eklemek istediğin başka bir şey var mı?',
] as const

const ANLASILMAYAN_ORNEK_CEVAP =
  'Bunu anlayamadım. Mesela “80 matematik” ya da “TYT Türkçe 33 doğru 4 yanlış” diyebilirsin.'

/** Anlaşılmayan parçayı en çok 40 karakter olacak şekilde tırnak içinde biçimlendirir. */
function anlasilmayanMetni(parca: string): string {
  const kirpilmis = parca.trim()
  const gorunen = kirpilmis.length > 40 ? `${kirpilmis.slice(0, 40)}…` : kirpilmis
  return `“${gorunen}” kısmını anlayamadım.`
}

/** Şablon adını bulur; 'deneme' içermiyorsa sonuna 'denemesi' ekler. Bulunamazsa kimliği kullanır. */
function sablonBasligiBul(sablonlar: readonly Sablon[], sablonId: string): string {
  const sablon = sablonlar.find((s) => s.id === sablonId)
  const hamAd = sablon?.ad ?? sablonId
  const kucuk = hamAd.toLocaleLowerCase('tr-TR')
  if (kucuk.includes('deneme')) {
    return hamAd
  }
  return `${hamAd} denemesi`
}

/** Net sayısını Türkçe ondalık virgülle biçimlendirir (ör. 85.5 -> "85,5"). */
function netMetni(net: number): string {
  return String(net).replace('.', ',')
}

/** Çözülen soru listesini tek veya çok ders kurallarına göre metne döker. */
function soruOzetiUret(sorular: readonly SesliSoru[]): string {
  if (sorular.length === 0) return ''

  if (sorular.length === 1) {
    const s = sorular[0]!
    if (s.dogru > 0 || s.yanlis > 0) {
      return `${s.ders} ${s.toplam} soru, ${s.dogru} doğru ${s.yanlis} yanlış. Not aldım.`
    }
    return `${s.ders} ${s.toplam} soru, not aldım.`
  }

  const ilkDersler = sorular.slice(0, 4)
  const dersMetinleri = ilkDersler.map((s) => `${s.ders} ${s.toplam}`).join(', ')
  const kalanDersSayisi = sorular.length - ilkDersler.length

  if (kalanDersSayisi > 0) {
    return `${dersMetinleri} soru ve ${kalanDersSayisi} ders daha. Not aldım.`
  }

  return `${dersMetinleri} soru. Not aldım.`
}

/** Deneme çözümünü ders doğru/yanlışları veya toplam nete göre özetler. */
function denemeOzetiUret(deneme: SesliDeneme, sablonlar: readonly Sablon[]): string {
  const baslik = sablonBasligiBul(sablonlar, deneme.sablonId)

  if (deneme.dersler.length === 0) {
    if (deneme.toplamNet !== null) {
      return `${baslik}, toplam ${netMetni(deneme.toplamNet)} net.`
    }
    return ''
  }

  const sablon = sablonlar.find((s) => s.id === deneme.sablonId)
  const parcalar = deneme.dersler.map((d) => {
    const sablonDersi = sablon?.dersler.find((sd) => sd.id === d.dersId)
    const dersAdi = sablonDersi?.ad ?? d.dersId
    return `${dersAdi} ${d.dogru} doğru ${d.yanlis} yanlış`
  })

  return `${baslik}: ${parcalar.join(', ')}.`
}

/** Yeni çözümü birikime ekler (saf fonksiyon, girdileri değiştirmez). */
export function birikimeEkle(birikim: SohbetBirikimi, cozum: SesliCozum): SohbetBirikimi {
  const yeniSorular: SesliSoru[] = birikim.sorular.map((s) => ({ ...s }))

  for (const soru of cozum.sorular) {
    const indeks = yeniSorular.findIndex((s) => s.ders === soru.ders)
    if (indeks !== -1) {
      const eski = yeniSorular[indeks]!
      yeniSorular[indeks] = {
        ders: eski.ders,
        toplam: eski.toplam + soru.toplam,
        dogru: eski.dogru + soru.dogru,
        yanlis: eski.yanlis + soru.yanlis,
      }
    } else {
      yeniSorular.push({ ...soru })
    }
  }

  let yeniDeneme: SesliDeneme | null = null

  if (cozum.deneme === null) {
    yeniDeneme = birikim.deneme
      ? {
          sablonId: birikim.deneme.sablonId,
          dersler: birikim.deneme.dersler.map((d) => ({ ...d })),
          toplamNet: birikim.deneme.toplamNet,
        }
      : null
  } else if (birikim.deneme === null) {
    yeniDeneme = {
      sablonId: cozum.deneme.sablonId,
      dersler: cozum.deneme.dersler.map((d) => ({ ...d })),
      toplamNet: cozum.deneme.toplamNet,
    }
  } else if (birikim.deneme.sablonId === cozum.deneme.sablonId) {
    const yeniDersler = birikim.deneme.dersler.map((d) => ({ ...d }))
    for (const d of cozum.deneme.dersler) {
      const dIndeks = yeniDersler.findIndex((x) => x.dersId === d.dersId)
      if (dIndeks !== -1) {
        yeniDersler[dIndeks] = { ...d }
      } else {
        yeniDersler.push({ ...d })
      }
    }
    yeniDeneme = {
      sablonId: birikim.deneme.sablonId,
      dersler: yeniDersler,
      toplamNet: cozum.deneme.toplamNet !== null ? cozum.deneme.toplamNet : birikim.deneme.toplamNet,
    }
  } else {
    // Farklı şablon geldiğinde yeni şablon eskisinin yerine geçer
    yeniDeneme = {
      sablonId: cozum.deneme.sablonId,
      dersler: cozum.deneme.dersler.map((d) => ({ ...d })),
      toplamNet: cozum.deneme.toplamNet,
    }
  }

  return {
    sorular: yeniSorular,
    deneme: yeniDeneme,
  }
}

/** Bu mesaja Rabi'nin cevabı: 1–2 kısa balon döner. */
export function rabiCevabi(
  cozum: SesliCozum,
  secenek: { sablonlar: Sablon[]; mesajSirasi: number; hedefeKalan?: number | null },
): string[] {
  const soruOzeti = soruOzetiUret(cozum.sorular)
  const denemeOzeti = cozum.deneme ? denemeOzetiUret(cozum.deneme, secenek.sablonlar) : ''
  const anlasilanVar = soruOzeti.length > 0 || denemeOzeti.length > 0

  if (!anlasilanVar) {
    if (cozum.anlasilmayan.length > 0) {
      return [anlasilmayanMetni(cozum.anlasilmayan[0]!)]
    }
    return [ANLASILMAYAN_ORNEK_CEVAP]
  }

  let ilkBalon = [soruOzeti, denemeOzeti].filter(Boolean).join(' ')

  const buMesajdakiToplamSoru = cozum.sorular.reduce((toplam, s) => toplam + s.toplam, 0)
  if (
    typeof secenek.hedefeKalan === 'number' &&
    secenek.hedefeKalan > 0 &&
    buMesajdakiToplamSoru >= secenek.hedefeKalan
  ) {
    ilkBalon += ' Bugünkü hedefin tamam!'
  }

  if (cozum.anlasilmayan.length > 0) {
    ilkBalon += ` ${anlasilmayanMetni(cozum.anlasilmayan[0]!)}`
  }

  const sira = Math.floor(Math.abs(secenek.mesajSirasi)) % KAPANIS_SORULARI.length
  const kapanisSorusu = KAPANIS_SORULARI[sira]!

  return [ilkBalon, kapanisSorusu]
}
