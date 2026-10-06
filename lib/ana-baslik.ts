/**
 * Ana sayfa başlığı: selamlamanın yanındaki tavşan ve altındaki tek cümle.
 *
 * İkisi bir süre ayrı kurallarla seçiliyordu — tavşanı `ana-maskot.ts`,
 * cümleyi `gunun-hali.ts`. Her biri kendi içinde doğruydu ama birbirini
 * tanımıyordu: tavşan dans ederken cümle "Kimya dersi 9 gündür bekliyor",
 * tavşan Pomodoro'da laptopta çalışırken "Bugün henüz soru kaydın yok",
 * tavşan gece uyurken "güne kısa bir tekrarla başla" diyebiliyordu.
 * Kullanıcı bunu fark etti ve "hiçbir uyumsuzluk olmamalı" dedi.
 *
 * Şimdi karar tek: önce tavşan seçiliyor (`anaMaskot`), cümle de **tavşanın
 * tuttuğu kuraldan** kuruluyor (`AnaMaskot.kural`). Her kuralın cümlesi o
 * kuralın söylediği şeyi söylüyor; başka bir şeyden söz etmiyor.
 *
 * `gununHali`nin önerileri (yanlış bankası, tek derse yığılma, ihmal edilen
 * ders, deneme) yalnızca tavşan çalışırken (`calisma`) geliyor: o zaman
 * kullanıcı gün içinde ve öneri tavşanla çelişmiyor. İhmal edilen ders bir
 * de tavşan gündüz uyurken "o dersle başla" olarak geliyor.
 *
 * Günlük hedef sıfırken cümle yok (`gununHali` ile aynı kural); tavşan yine
 * duruma göre poz veriyor.
 *
 * Saf; `ana-baslik.test.ts` her kuralın cümlesinin tavşanla uyumunu
 * denetliyor.
 */

import { anaMaskot, GECE_BASI, type AnaMaskot, type AnaMaskotGirdisi } from './ana-maskot'
import {
  baglamKur,
  gununHali,
  hedefTuttuCumlesi,
  ihmalBul,
  seriKiriliyor,
  sinavCumlesi,
  SINAV_YAKIN_GUN,
  type Baglam,
} from './gunun-hali'

export type AnaBaslik = {
  maskot: AnaMaskot
  /** Selamlamanın altındaki cümle; günlük hedef sıfırsa null. */
  cumle: string | null
}

function sec(b: Baglam, secenekler: string[]): string {
  return secenekler[b.secim(secenekler.length)]
}

/** Hedefe kalan soru sayısı; hedef tuttuysa 0. */
function kalan(b: Baglam): number {
  return Math.max(0, b.g.hedef - b.toplam)
}

/** Tavşanın kuralına uyan cümle. */
function kuralCumlesi(maskot: AnaMaskot, g: AnaMaskotGirdisi, b: Baglam): string {
  switch (maskot.kural) {
    case 'pomodoro':
      if (b.toplam >= b.g.hedef) return 'Pomodoro turundasın; bugünkü hedefin zaten tamam.'
      if (b.toplam > 0) return `Pomodoro turundasın; hedefine ${kalan(b)} soru kaldı.`
      return 'Pomodoro turundasın; çözdüğün soruları sonra kaydetmeyi unutma.'
    case 'mola':
      return sec(b, [
        'Moladasın; biraz dinlen, sonra kaldığın yerden devam.',
        'Mola zamanı; su iç, gözlerini dinlendir.',
      ])
    case 'devamsizlik':
      return 'Devamsızlık sınırını aştın; kalan okul günlerini kaçırmamaya çalış.'
    case 'sinav-gunu':
      return sinavCumlesi(b)
    case 'ozet':
      return 'Geçen ayın özeti hazır; en üstteki karttan açabilirsin.'
    case 'deneme':
      return 'Bugünkü denemeni kaydettin; sonuçlarına göz atmayı unutma.'
    case 'konu':
      return sec(b, [
        'Bugün bir konuyu bitirdin; eline sağlık.',
        'Bir konu daha bitti; arada tekrar etmeyi unutma.',
      ])
    case 'kutlama':
      return hedefTuttuCumlesi(b)
    case 'gorevler':
      return b.toplam > 0
        ? `Bugünkü görevlerini bitirdin; hedefine ${kalan(b)} soru kaldı.`
        : 'Bugünkü görevlerini bitirdin; soru çözdüysen kaydını da ekle.'
    case 'geri-donus':
      return `Tekrar hoş geldin; hedefine ${kalan(b)} soru kaldı.`
    case 'calisma':
      // `gununHali` bu durumda yalnızca tavşanla uyumlu cümle üretebiliyor:
      // bugün kayıt var ve hedef tutmadı, yani seri cümleleri (biri sıfır
      // kayıt, öteki tutmuş hedef ister) devre dışı; geriye sınav, öneriler
      // ve "hedefine N soru kaldı" kalıyor. Test bunu denetliyor.
      return gununHali(b.g)!
    case 'gece':
      return g.saat >= GECE_BASI
        ? 'Bugün kayıt girmedin; çözdüysen ekle, sonra iyi uykular.'
        : 'Geç oldu; biraz uyu, sabah birlikte başlarız.'
    case 'sabah':
      if (g.kalanGun > 0 && g.kalanGun <= SINAV_YAKIN_GUN) return `Günaydın; sınava ${g.kalanGun} gün kaldı.`
      return sec(b, [
        'Günaydın; güne birkaç soruyla başlayabilirsin.',
        'Günaydın; bugün neyle başlayalım?',
      ])
    case 'hafta-sonu':
      return 'Hafta sonu sabahı; sakin bir tekrarla başlayabilirsin.'
    case 'seri':
      return seriKiriliyor(b)!
    case 'yanlis':
      return `Yanlış bankanda ${g.bekleyenYanlis} soru seni bekliyor; birkaçına göz at.`
    case 'sinav-yakin':
      return sinavCumlesi(b)
    case 'aksam':
      return 'Akşam oldu, bugün henüz kaydın yok; kısa bir tekrar yapalım mı?'
    case 'uyuyan': {
      const ihmal = ihmalBul(b)
      if (ihmal) return `Bugün henüz kaydın yok; ${ihmal.ders} dersiyle başlamaya ne dersin?`
      return sec(b, [
        'Bugün henüz soru kaydın yok; birkaç soruyla başlayabilirsin.',
        'Bugün henüz soru kaydın yok; çözdüysen kaydını eklemeyi unutma.',
      ])
    }
  }
}

export function anaBaslik(g: AnaMaskotGirdisi): AnaBaslik {
  const maskot = anaMaskot(g)
  if (g.hedef <= 0) return { maskot, cumle: null }
  const b = baglamKur({
    bugun: g.bugun,
    hedef: g.hedef,
    gunlukKayitlar: g.gunlukKayitlar,
    bekleyenYanlis: g.bekleyenYanlis,
    sonDenemeTarihi: g.sonDenemeTarihi,
    kalanGun: g.kalanGun,
  })
  return { maskot, cumle: kuralCumlesi(maskot, g, b) }
}
