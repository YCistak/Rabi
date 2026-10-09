import { ANA_TUR_SURUM_ANAHTARI, ESKI_ANA_TUR_ANAHTARI, TUR_ANAHTARLARI } from './tanitim'

/*
  Başlangıç sorusu: "Tanıtım ister misin?" (kullanıcı istedi, 2026-10).

  Kurulum ve açılış bitince bir kez sorulur. Evet → ana tur başlar, mini
  turlar eskisi gibi ekranlara ilk girişte çıkar. Hayır → hiçbir tur yok: ne
  ana tur ne mini turlar. Cevap kalıcı (`TANITIM_TERCIH_ANAHTARI`).

  Daha önce herhangi bir turu görmüş kullanıcıya soru sorulmaz; onun
  davranışı aynı kalır (ana tur sürüm kuralı, mini turlar ilk ziyarette).
  "Tüm verileri sil" anahtarı siler (`tumVeriyiSil`); uygulama sıfırdan
  açılınca soru yeniden gelir.
*/
export const TANITIM_TERCIH_ANAHTARI = 'rabi-tanitim-tercihi-v1'

export type TanitimTercihi = 'evet' | 'hayir'

/** Kayıtlı değeri okur; tanınmayan ya da boş değer "sorulmadı" sayılır. */
export function tercihOku(deger: string | null): TanitimTercihi | null {
  return deger === 'evet' || deger === 'hayir' ? deger : null
}

/**
 * Cihazda herhangi bir tur kaydı var mı: ana turun sürümü ya da eski
 * `'true'` anahtarları, ya da bir mini turun bayrağı. Varsa kullanıcı Rabi'yi
 * soru gelmeden önce kullanmış demektir; ona soru sorulmaz.
 */
export function eskiTurKaydiVar(oku: (anahtar: string) => string | null): boolean {
  if (Number(oku(ANA_TUR_SURUM_ANAHTARI) ?? 0) > 0) return true
  if (oku(ESKI_ANA_TUR_ANAHTARI) === 'true') return true
  return Object.values(TUR_ANAHTARLARI).some((anahtar) => oku(anahtar) === 'true')
}

/**
 * Açılışta ne olacak:
 * - `sor`: soru penceresi çıkar (yeni kullanıcı, henüz cevap yok),
 * - `ana-tur`: ana tur başlar (Evet dendi ya da eski kullanıcı, tur görülmedi),
 * - `kapali`: Hayır dendi; hiçbir tur başlamaz,
 * - `bitti`: ana tur görüldü; yalnız mini turlar ilk ziyarette çıkar.
 */
export type TanitimBaslangici = 'sor' | 'ana-tur' | 'kapali' | 'bitti'

export function tanitimBaslangici(d: { tercih: TanitimTercihi | null; anaTurGoruldu: boolean; eskiKayitVar: boolean }): TanitimBaslangici {
  if (d.tercih === 'hayir') return 'kapali'
  if (d.anaTurGoruldu) return 'bitti'
  if (d.tercih === 'evet' || d.eskiKayitVar) return 'ana-tur'
  return 'sor'
}

/** Turlar (ana ve mini) başlayabilir mi: yalnız Hayır demiş kullanıcıda kapalı. */
export function turlarAcik(tercih: TanitimTercihi | null): boolean {
  return tercih !== 'hayir'
}

/**
 * Ayarlar'dan "Tanıtımı yeniden başlat": hangi anahtarlar silinir, hangisi
 * yazılır. Saf — depoya dokunmaz. Yalnız tanıtım kayıtları: ana turun sürümü
 * ve eski `'true'` anahtarı, bütün mini tur bayrakları. Kullanıcının verisine
 * (görevler, denemeler…) dokunmaz. Tercih "evet" olur: önceki "Hayır" kalkar.
 */
export function tanitimiSifirlaKayitlari(): { sil: string[]; yaz: [anahtar: string, deger: TanitimTercihi][] } {
  return {
    sil: [...Object.values(TUR_ANAHTARLARI), ANA_TUR_SURUM_ANAHTARI, ESKI_ANA_TUR_ANAHTARI],
    yaz: [[TANITIM_TERCIH_ANAHTARI, 'evet']],
  }
}
