/**
 * Rabi sesli sohbetinin durum birikimi ve kurallı cevap mantığı.
 *
 * Kullanıcının art arda girdiği sesli/yazılı mesajlar birikimde toplanır,
 * Rabi yalnızca anladığı bilgileri özetleyen ve uydurma yapmayan kurallı
 * yanıtlar döner (yapay zekâ veya dış ağ bağımlılığı yoktur).
 */

import type { Sablon } from './types'
import type { SesliCozum, SesliDeneme, SesliKip, SesliSoru, TopluGrup } from './sesli-giris'
import { dersinGrubu } from './toplu-grup'

export type SohbetBirikimi = { sorular: SesliSoru[]; deneme: SesliDeneme | null }

export const BOS_BIRIKIM: SohbetBirikimi = {
  sorular: [],
  deneme: null,
}

/** Rabi'nin pencere açılınca ilk sorusu. */
export const ACILIS_SORUSU = 'Bugün ne çözdün?'

/** Denemeler sohbeti, tür seçilmeden sonuç anlatımına başlamaz. */
export const DENEME_ACILIS_SORUSU = 'Hangi denemeye girdin?'

/** Seçilen deneme türünü kısa ve değişmeyen bir cümleyle onaylar. */
export function denemeTuruSecildi(sablonAdi: string): string {
  return `${sablonAdi}, tamam. Ders ders doğru ve yanlışlarını anlat.`
}

const KAPANIS_SORULARI = [
  'Başka?',
  'Başka ne çözdün?',
  'Eklemek istediğin başka bir şey var mı?',
] as const

const DENEME_KAPANIS_SORULARI = [
  'Başka ders var mı?',
  'Kalan dersleri de söyler misin?',
  "Bitince Denemeye geç'e basabilirsin.",
] as const

const ANLASILMAYAN_ORNEK_CEVAP =
  'Bunu anlayamadım. Mesela “80 matematik” ya da “TYT Türkçe 33 doğru 4 yanlış” diyebilirsin.'

export type SohbetNiyeti = 'selam' | 'orada' | 'hal' | 'tesekkur' | 'veda' | 'cozmedim' | 'moral' | 'yardim'

const SOHBET_CEVAPLARI: Record<SohbetNiyeti, readonly string[]> = {
  selam: [
    'Merhaba!',
    'Selam!',
    'Merhaba, anlat bakalım.',
    'Selam, hoş geldin.',
    'Merhaba, dinliyorum.',
  ],
  orada: [
    'Buradayım!',
    'Buradayım, dinliyorum.',
    'Evet, buradayım.',
    'Buradayım, seni dinliyorum.',
  ],
  hal: [
    'İyiyim, teşekkür ederim. Sen nasılsın?',
    'İyiyim, sağ ol. Senin günün nasıl geçiyor?',
    'İyiyim. Bugün ne yaptın?',
    'Hazırım, sen nasılsın?',
    'Gayet iyiyim. Sende durumlar nasıl?',
  ],
  tesekkur: [
    'Rica ederim!',
    'Ne demek, her zaman.',
    'Rica ederim, kolay gelsin.',
    'İşe yaradıysa ne mutlu.',
    'Bir şey değil, her zaman.',
  ],
  veda: [
    'Görüşürüz, kolay gelsin.',
    'İyi dinlenmeler.',
    'Görüşürüz, yarın devam ederiz.',
    'Hoşça kal, iyi çalışmalar.',
    'Kendine iyi bak, görüşürüz.',
  ],
  cozmedim: [
    'Olsun, her gün aynı geçmez. Yarın küçük bir hedefle başlayalım mı?',
    'Bugün dinlenmek de gerekliydi. Yarın 10 soruyla başlayabilirsin.',
    'Bir gün boş geçmesi her şeyi bozmaz. Yarın yeniden başlarız.',
    'Kendine yüklenme. Küçük bir başlangıç yeter.',
    'Canın sağ olsun. Yarın kaldığımız yerden devam ederiz.',
  ],
  moral: [
    'Mola vermek de çalışmanın parçası. Kısa bir Pomodoro denemek ister misin?',
    'Zorlanman normal. Beş dakika ara verip küçük bir soruyla dönebilirsin.',
    'Bugünü kusursuz yapmak zorunda değilsin. Biraz nefes al.',
    'Yalnız değilsin. En kolay dersten kısa bir turla başlayalım mı?',
    'Bazen yorulmak çok doğal. Biraz dinlenip öyle devam edebilirsin.',
  ],
  yardim: [
    'Bugün kaç soru çözdüğünü ya da deneme sonucunu anlat; mesela “matematikten 40 soru çözdüm, 5’i yanlış” de.',
    'Ders ders çözdüğün soruları veya deneme doğru-yanlışlarını söyleyebilirsin.',
    'Örneğin “TYT denemesinde Türkçe 30 doğru 5 yanlış yaptım” diyebilirsin.',
    'Söylediklerini soru takibine ve deneme özetine ayırırım.',
    'Çözdüğün soru sayılarını veya deneme netlerini söyleyebilirsin.',
  ],
}

/** Gündelik sohbeti, veriyi çözmeye çalışmadan kısa niyetlere ayırır. */
export function sohbetNiyeti(metin: string): SohbetNiyeti | null {
  const sade = metin.toLocaleLowerCase('tr-TR')
  if (/(?:hiç soru çözmedim|hic soru cozmedim|bugün çalışmadım|bugun calismadim|bir şey yapmadım|bir sey yapmadim|boş geçti|bos gecti)/.test(sade)) return 'cozmedim'
  if (/(?:yoruldum|sıkıldım|canım sıkkın|yapamıyorum|motivasyonum yok|stresliyim)/.test(sade)) return 'moral'
  if (/(?:ne yapabilirsin|nasıl kullanılır|nasil kullanilir|ne diyeyim|yardım|yardim)/.test(sade)) return 'yardim'
  if (/(?:sağ\s*ol|sag\s*ol|teşekkür|tesekkur|eyvallah)/.test(sade)) return 'tesekkur'
  if (/(?:gorusuruz|görüşürüz|iyi geceler|bay bay|hosca kal|hoşça kal)/.test(sade)) return 'veda'
  if (/(?:orada mısın|orada misin|burada mısın|burada misin)/.test(sade)) return 'orada'
  if (/(?:nasilsin|nasılsın|ne haber|iyi misin)/.test(sade)) return 'hal'
  if (/(?:merhaba|selam|naber|hey|gunaydin|günaydın|iyi aksamlar|iyi akşamlar|\babi\b|\bkanka\b|\bhocam\b)/.test(sade)) return 'selam'
  return null
}

function niyetCevabi(niyet: SohbetNiyeti, mesajSirasi: number, metin?: string): string {
  const baslangic = metin?.trim().toLocaleLowerCase('tr-TR') ?? ''
  if (niyet === 'selam' && /^(?:merhaba)(?:\s|$)/.test(baslangic)) return 'Merhaba!'
  if (niyet === 'selam' && /^(?:selam)(?:\s|$)/.test(baslangic)) return 'Selam!'
  const cevaplar = SOHBET_CEVAPLARI[niyet]
  return cevaplar[Math.floor(Math.abs(mesajSirasi)) % cevaplar.length]!
}

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
function denemeOzetiUret(deneme: SesliDeneme, sablonlar: readonly Sablon[], kip?: SesliKip): string {
  const baslik = sablonBasligiBul(sablonlar, deneme.sablonId)

  if (deneme.dersler.length === 0 && (deneme.toplu?.length ?? 0) === 0) {
    if (deneme.toplamNet !== null) {
      return kip === 'deneme'
        ? `Toplam ${netMetni(deneme.toplamNet)} net.`
        : `${baslik}, toplam ${netMetni(deneme.toplamNet)} net.`
    }
    return ''
  }

  const sablon = sablonlar.find((s) => s.id === deneme.sablonId)
  const parcalar = deneme.dersler.map((d) => {
    const sablonDersi = sablon?.dersler.find((sd) => sd.id === d.dersId)
    const dersAdi = sablonDersi?.ad ?? d.dersId
    return `${dersAdi} ${d.dogru} doğru ${d.yanlis} yanlış`
  })

  const grupAdi: Record<TopluGrup, string> = { sosyal: 'Sosyal', fen: 'Fen' }
  for (const sonuc of deneme.toplu ?? []) {
    parcalar.push(`${grupAdi[sonuc.grup]} ${sonuc.dogru} doğru ${sonuc.yanlis} yanlış (toplu)`)
  }
  const ozet = `${parcalar.join(', ')}.`
  return kip === 'deneme' ? ozet : `${baslik}: ${ozet}`
}

function yanlisYerYonu(yanlisYer: SesliCozum['yanlisYer']): string {
  if (yanlisYer === 'deneme') return "Denemeleri buradan giremezsin, Denemeler'deki ‘Rabi'ye anlat’tan girebilirsin."
  if (yanlisYer === 'soru') return "Günlük çözdüğün soruları Soru Takibi'ndeki ‘Rabi'ye anlat’tan ekleyebilirsin."
  return ''
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
          toplu: (birikim.deneme.toplu ?? []).map((sonuc) => ({ ...sonuc })),
          toplamNet: birikim.deneme.toplamNet,
        }
      : null
  } else if (birikim.deneme === null) {
    yeniDeneme = {
      sablonId: cozum.deneme.sablonId,
      dersler: cozum.deneme.dersler.map((d) => ({ ...d })),
      toplu: (cozum.deneme.toplu ?? []).map((sonuc) => ({ ...sonuc })),
      toplamNet: cozum.deneme.toplamNet,
    }
  } else if (birikim.deneme.sablonId === cozum.deneme.sablonId) {
    const yeniDersler = birikim.deneme.dersler.map((d) => ({ ...d }))
    const yeniToplu = (birikim.deneme.toplu ?? []).map((sonuc) => ({ ...sonuc }))
    for (const d of cozum.deneme.dersler) {
      const dIndeks = yeniDersler.findIndex((x) => x.dersId === d.dersId)
      if (dIndeks !== -1) {
        yeniDersler[dIndeks] = { ...d }
      } else {
        yeniDersler.push({ ...d })
      }
    }
    for (const sonuc of cozum.deneme.toplu ?? []) {
      const indeks = yeniToplu.findIndex((eski) => eski.grup === sonuc.grup)
      if (indeks === -1) yeniToplu.push({ ...sonuc })
      else yeniToplu[indeks] = { ...sonuc }
    }
    yeniDeneme = {
      sablonId: birikim.deneme.sablonId,
      dersler: yeniDersler,
      toplu: yeniToplu,
      toplamNet: cozum.deneme.toplamNet !== null ? cozum.deneme.toplamNet : birikim.deneme.toplamNet,
    }
  } else {
    // Farklı şablon geldiğinde yeni şablon eskisinin yerine geçer
    yeniDeneme = {
      sablonId: cozum.deneme.sablonId,
      dersler: cozum.deneme.dersler.map((d) => ({ ...d })),
      toplu: (cozum.deneme.toplu ?? []).map((sonuc) => ({ ...sonuc })),
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
  secenek: { sablonlar: Sablon[]; mesajSirasi: number; hedefeKalan?: number | null; metin?: string; kip?: SesliKip },
): string[] {
  const soruOzeti = soruOzetiUret(cozum.sorular)
  const denemeOzeti = cozum.deneme ? denemeOzetiUret(cozum.deneme, secenek.sablonlar, secenek.kip) : ''
  const anlasilanVar = soruOzeti.length > 0 || denemeOzeti.length > 0
  const niyet = secenek.metin ? sohbetNiyeti(secenek.metin) : null
  const yonlendirme = yanlisYerYonu(cozum.yanlisYer)

  if (!anlasilanVar) {
    if (niyet && yonlendirme) return [`${niyetCevabi(niyet, secenek.mesajSirasi, secenek.metin)} ${yonlendirme}`]
    if (niyet) return [niyetCevabi(niyet, secenek.mesajSirasi, secenek.metin)]
    if (yonlendirme) return [yonlendirme]
    if (cozum.anlasilmayan.length > 0) {
      const anlasilmayan = cozum.anlasilmayan[0]!
      if (/(?:sosyal|fen)\w*\s+\d+(?:[.,]\d+)?\s+net/i.test(secenek.metin ?? '')) {
        const grup = /sosyal/i.test(secenek.metin ?? '') ? 'Sosyal' : 'Fen'
        return [`${grup} için doğru ve yanlış sayısını söyler misin?`]
      }
      if (/(?:sosyal|fen)/i.test(anlasilmayan) && /(?:20|30|40|50|60|70|80|90)/.test(anlasilmayan) && /(?:deneme|tyt|ayt|ydt)/i.test(secenek.metin ?? '')) {
        const grup = /sosyal/i.test(anlasilmayan) ? 'Sosyal' : 'Fen'
        return [`${grup} için doğru ve yanlış toplamı soru sayısını aşıyor.`]
      }
      if (/(?:sosyal|fen)/i.test(anlasilmayan)) {
        return [/(?:sosyal)/i.test(anlasilmayan) ? 'Sosyal derslerden hangisi olduğunu söyler misin?' : 'Fen derslerinden hangisi olduğunu söyler misin?']
      }
      return [anlasilmayanMetni(anlasilmayan)]
    }
    return [ANLASILMAYAN_ORNEK_CEVAP]
  }

  let ilkBalon = [niyet ? niyetCevabi(niyet, secenek.mesajSirasi, secenek.metin) : '', soruOzeti, denemeOzeti].filter(Boolean).join(' ')

  const buMesajdakiToplamSoru = cozum.sorular.reduce((toplam, s) => toplam + s.toplam, 0)
  if (
    typeof secenek.hedefeKalan === 'number' &&
    secenek.hedefeKalan > 0 &&
    buMesajdakiToplamSoru >= secenek.hedefeKalan
  ) {
    ilkBalon += ' Bugünkü hedefin tamam!'
  }

  if (cozum.anlasilmayan.length > 0) {
    const anlasilmayan = cozum.anlasilmayan[0]!
    if (/(?:sosyal|fen)\w*\s+\d+(?:[.,]\d+)?\s+net/i.test(secenek.metin ?? '')) {
      const grup = /sosyal/i.test(secenek.metin ?? '') ? 'Sosyal' : 'Fen'
      ilkBalon += ` ${grup} için doğru ve yanlış sayısını söyler misin?`
    } else if (/(?:sosyal|fen)/i.test(anlasilmayan) && /(?:20|30|40|50|60|70|80|90)/.test(anlasilmayan)) {
      const grup = /sosyal/i.test(anlasilmayan) ? 'Sosyal' : 'Fen'
      ilkBalon += ` ${grup} için bu doğru ve yanlış sayısı soru sayısını aşıyor.`
    } else {
      ilkBalon += ` ${anlasilmayanMetni(anlasilmayan)}`
    }
  }

  if (yonlendirme) ilkBalon += ` ${yonlendirme}`

  if (cozum.deneme?.toplu?.some((toplu) => cozum.deneme!.dersler.some((ders) => {
    return dersinGrubu(ders.dersId) === toplu.grup
  }))) {
    ilkBalon += ' Toplu grup sonucu ile ayrı ders sonucu birlikte kaydedildi.'
  }

  const kapanisSorulari = secenek.kip === 'deneme' ? DENEME_KAPANIS_SORULARI : KAPANIS_SORULARI
  const sira = Math.floor(Math.abs(secenek.mesajSirasi)) % kapanisSorulari.length
  const kapanisSorusu = kapanisSorulari[sira]!

  return [ilkBalon, kapanisSorusu]
}
