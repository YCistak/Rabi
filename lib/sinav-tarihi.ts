/**
 * YKS geri sayımı.
 *
 * ÖSYM sınav tarihini her yıl kendi takviminde ilan ediyor; ilan edilmiş yıllar
 * `BILINEN_TAKVIM`'de elle yazılı. İlan edilmemiş yıllar için tarih **tahmin
 * ediliyor** (haziranın üçüncü cumartesi/pazarı) ve tahmin olduğu arayüzde
 * yazıyor — projedeki "tahmini sayıyı kesinmiş gibi gösterme" kuralı burada da
 * geçerli.
 *
 * Tahminin dayanağı son yılların gerçekleşen tarihleri: 2021 19-20, 2022 18-19,
 * 2023 17-18, 2025 21-22, 2026 20-21 haziran — hepsi haziranın üçüncü hafta
 * sonu. (2024 bir hafta öne alınmıştı; tahmin bu yüzden tahmin.)
 */

import { tariheCevir, tariheYaz } from './utils'

/** Bir yılın YKS hafta sonu: cumartesi TYT, pazar AYT ve YDT. */
export type YksTakvimi = {
  yil: number
  /** 'YYYY-AA-GG' */
  tyt: string
  /** 'YYYY-AA-GG' — YDT de aynı gün, öğleden sonra. */
  ayt: string
  /** Tarih ÖSYM tarafından ilan edilmedi, hesaplanan bir tahmin. */
  tahmini: boolean
}

/** ÖSYM'nin ilan ettiği tarihler. Yeni takvim çıktıkça buraya eklenir. */
const BILINEN_TAKVIM: Record<number, { tyt: string; ayt: string }> = {
  2025: { tyt: '2025-06-21', ayt: '2025-06-22' },
  2026: { tyt: '2026-06-20', ayt: '2026-06-21' },
}

/** Haziranın üçüncü cumartesi — ilan edilmemiş yıllar için tahmin. */
function haziraninUcuncuCumartesi(yil: number): Date {
  const ilkHaziran = new Date(yil, 5, 1)
  // getDay(): 0 pazar, 6 cumartesi. İlk cumartesiye kaç gün var?
  const ilkCumartesi = 1 + ((6 - ilkHaziran.getDay() + 7) % 7)
  return new Date(yil, 5, ilkCumartesi + 14)
}

/** Verilen yılın YKS takvimi — ilan edilmişse gerçek, değilse tahmin. */
export function yilinTakvimi(yil: number): YksTakvimi {
  const bilinen = BILINEN_TAKVIM[yil]
  if (bilinen) return { yil, tyt: bilinen.tyt, ayt: bilinen.ayt, tahmini: false }

  const cumartesi = haziraninUcuncuCumartesi(yil)
  const pazar = new Date(cumartesi)
  pazar.setDate(pazar.getDate() + 1)
  return { yil, tyt: tariheYaz(cumartesi), ayt: tariheYaz(pazar), tahmini: true }
}

/** İki 'YYYY-AA-GG' arasındaki tam gün farkı (b − a). */
export function gunFarki(a: string, b: string): number {
  const birGun = 24 * 60 * 60 * 1000
  // Yaz saati geçişlerinde saat kayabildiği için yuvarlanıyor.
  return Math.round((tariheCevir(b).getTime() - tariheCevir(a).getTime()) / birGun)
}

export type GeriSayim = {
  takvim: YksTakvimi
  /**
   * Beklenen ilk oturum. TYT günü geçtiyse aynı hafta sonunun AYT'sine döner —
   * cumartesi akşamı "364 gün kaldı" demek yanlış olurdu.
   */
  oturum: 'tyt' | 'ayt'
  /** Beklenen oturuma kalan gün; 0 ise sınav bugün. */
  kalanGun: number
  /** Beklenen oturumun tarihi, 'YYYY-AA-GG'. */
  sinavTarihi: string
  /** Bir önceki YKS'den bu yana geçen gün — ilerleme çubuğu için. */
  gecenGun: number
  /** İki YKS arasındaki toplam gün. */
  toplamGun: number
  /** Tarih ÖSYM'den değil, tahminden geliyor. */
  tahmini: boolean
}

/**
 * Bugünden sonraki ilk YKS oturumuna geri sayım.
 *
 * `bugunIso` dışarıdan alınıyor: fonksiyon saf kalsın, testte de sınav haftası
 * canlandırılabilsin diye.
 */
export function geriSayim(bugunIso: string): GeriSayim {
  const yil = tariheCevir(bugunIso).getFullYear()

  // Bu yılın sınavı geçtiyse sıradaki yılın takvimine geçilir.
  let takvim = yilinTakvimi(yil)
  if (gunFarki(bugunIso, takvim.ayt) < 0) takvim = yilinTakvimi(yil + 1)

  const tyteKalan = gunFarki(bugunIso, takvim.tyt)
  const oturum = tyteKalan >= 0 ? 'tyt' : 'ayt'
  const sinavTarihi = oturum === 'tyt' ? takvim.tyt : takvim.ayt

  // İlerleme çubuğu bir önceki sınavın ertesi gününden başlar: "hazırlık yılının
  // neresindeyim" sorusunun cevabı bu.
  const oncekiAyt = yilinTakvimi(takvim.yil - 1).ayt
  const toplamGun = gunFarki(oncekiAyt, takvim.tyt)

  return {
    takvim,
    oturum,
    kalanGun: gunFarki(bugunIso, sinavTarihi),
    sinavTarihi,
    gecenGun: Math.max(0, Math.min(toplamGun, gunFarki(oncekiAyt, bugunIso))),
    toplamGun,
    tahmini: takvim.tahmini,
  }
}

/** 'YYYY-AA-GG' → "20 Haziran 2026 Cumartesi". Geri sayımın altındaki satır. */
export function sinavTarihiYaz(iso: string): string {
  return tariheCevir(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  })
}
