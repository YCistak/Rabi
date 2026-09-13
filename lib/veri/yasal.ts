/**
 * Uygulamanın yasal metinleri — gizlilik politikası, kullanıcı sözleşmesi ve
 * "cihazdan ne çıkıyor" özeti.
 *
 * **Metinler artık uygulamada değil, tek kopya hâlinde GitHub Pages'te.**
 * Bir süre burada düz metin kopyaları duruyordu ve `public/gizlilik/` altındaki
 * HTML ile birlikte güncellenmesi gerekiyordu; iki kopya kaçınılmaz olarak
 * birbirinden ayrışıyor ve Play'in "mağazadaki bağlantı ile uygulama içindeki
 * metin aynı şeyi söylemeli" şartı sessizce bozuluyordu. Uygulama şimdi yalnızca
 * bağlantı veriyor: Ayarlar → Gizlilik ve Koşullar'daki her satır tarayıcıda
 * ilgili sayfayı açıyor. Kaynak dosyalar `public/gizlilik/*.html`, yayın
 * `.github/workflows/gizlilik.yml`.
 *
 * **Gizlilik politikasının adresi (`YASAL_SITE`) değişmez.** Play Console'da
 * kayıtlı ve Data Safety formundan bağlanıyor; adres değişirse mağaza kaydı
 * ölü bağlantıya düşer ve uygulama politika ihlaline girer.
 */

export type YasalBelgeId = 'gizlilik' | 'sozlesme' | 'veri-ozeti'

export type YasalBelge = {
  id: YasalBelgeId
  /** Listede görünen ad. */
  ad: string
  /** Liste satırının altındaki tek satırlık tanım. */
  ozet: string
  /** Tarayıcıda açılacak sayfa. */
  url: string
}

/** GitHub Pages kökü — Play Console'daki gizlilik politikası adresi. Değiştirme. */
export const YASAL_SITE = 'https://ycistak.github.io/Rabi/'

/**
 * Ekrandaki sıra: önce uygulamanın kendi davranışının özeti, sonra iki yasal
 * metin. Gizlilik politikası sitenin kökü (`index.html`), diğerleri yanındaki
 * sayfalar.
 */
export const YASAL_BELGELER: YasalBelge[] = [
  {
    id: 'veri-ozeti',
    ad: 'Cihazından ne çıkıyor?',
    ozet: 'İnternete giden üç şey ve üçü de sana sorularak gidiyor; bir de Play’in sürüm sorgusu',
    url: `${YASAL_SITE}veri-ozeti.html`,
  },
  {
    id: 'gizlilik',
    ad: 'Gizlilik Politikası',
    ozet: 'Hangi veriyi tutuyoruz, nereye gidiyor',
    url: YASAL_SITE,
  },
  {
    id: 'sozlesme',
    ad: 'Kullanıcı Sözleşmesi',
    ozet: 'Uygulamayı kullanma koşulları',
    url: `${YASAL_SITE}sozlesme.html`,
  },
]

/** Kimliğe göre belge; tanınmayan kimlikte `null`. */
export function yasalBelgeBul(id: string | null): YasalBelge | null {
  return YASAL_BELGELER.find((b) => b.id === id) ?? null
}
