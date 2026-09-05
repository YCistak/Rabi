/**
 * Uygulamanın yasal metinleri — gizlilik politikası, kullanıcı sözleşmesi ve
 * "cihazdan ne çıkıyor" özeti.
 *
 * Metinler burada duruyor, ekranda değil: Ayarlar'a serpiştirilmiş dört beş
 * paragraf hem ayar listesini uzatıyor hem de aranan bir cümlenin nerede
 * olduğunu belirsizleştiriyordu. Google Play'in Data Safety formu ile
 * mağazadaki gizlilik politikası bağlantısı da aynı metne bakıyor; tek
 * kaynaktan okunmazsa üçü zamanla birbirinden ayrışır.
 *
 * **Biçim düz metin.** Paragraf dizisi ve isteğe bağlı alt başlık — Markdown
 * ayrıştırıcısı yok. Kalın/eğik yazı, bağlantı ya da liste gerekiyorsa metni
 * o gereksinim olmadan yazmak daha ucuz; bir ayrıştırıcı eklemek, uygulamaya
 * yalnızca üç sayfa için bir biçimlendirme dili sokmak olurdu.
 *
 * `yururlukTarihi` gösteriliyor: sözleşme değiştiğinde kullanıcının hangi
 * sürümü kabul ettiğini bilmesi gerekiyor.
 */

export type YasalBelgeId = 'gizlilik' | 'sozlesme' | 'veri-ozeti'

export type YasalBolum = {
  /** Alt başlık; yoksa paragraflar doğrudan akar. */
  baslik?: string
  paragraflar: string[]
}

export type YasalBelge = {
  id: YasalBelgeId
  /** Listede ve ekran başlığında görünen ad. */
  ad: string
  /** Liste satırının altındaki tek satırlık tanım. */
  ozet: string
  /**
   * Metnin yürürlüğe girdiği gün (ISO, `YYYY-AA-GG`).
   *
   * Boş bırakılırsa ekran tarih satırını hiç çizmiyor — metin henüz
   * yazılmamışken uydurma bir tarih göstermek, olmayan bir sözleşmeye
   * yürürlük tarihi vermek olurdu.
   */
  yururlukTarihi?: string
  bolumler: YasalBolum[]
}

/**
 * Gizlilik politikası.
 *
 * @todo Metin kullanıcıdan gelecek; geldiğinde `bolumler` doldurulacak ve
 * `yururlukTarihi` yazılacak. O ana kadar ekran "hazırlanıyor" diyor.
 */
const GIZLILIK: YasalBelge = {
  id: 'gizlilik',
  ad: 'Gizlilik Politikası',
  ozet: 'Hangi veriyi tutuyoruz, nereye gidiyor',
  bolumler: [],
}

/**
 * Kullanıcı sözleşmesi.
 *
 * @todo Metin kullanıcıdan gelecek.
 */
const SOZLESME: YasalBelge = {
  id: 'sozlesme',
  ad: 'Kullanıcı Sözleşmesi',
  ozet: 'Uygulamayı kullanma koşulları',
  bolumler: [],
}

/**
 * Cihazdan ne çıkıyor — Ayarlar'daki iki bölümün taşındığı yer.
 *
 * Bu metin kullanıcıdan gelmiyor, uygulamanın kendi davranışını anlatıyor ve
 * koddaki gerçekle birlikte değişmesi gerekiyor: `lib/hata-gonder.ts` ile
 * `lib/cokme.ts` dışında ağa çıkan bir yol açılırsa buraya da yazılmalı.
 */
const VERI_OZETI: YasalBelge = {
  id: 'veri-ozeti',
  ad: 'Cihazından ne çıkıyor?',
  ozet: 'İnternete giden iki şey ve ikisi de sana sorularak gidiyor',
  bolumler: [
    {
      paragraflar: [
        'Rabi’nin sunucusu yok. Denemelerin, notların, fotoğrafların, puanların ve ayarların telefonunda duruyor; uygulama onları hiçbir yere göndermiyor. İnternete çıkan yalnızca iki şey var ve ikisi de sen izin vermeden gitmiyor.',
      ],
    },
    {
      baslik: 'Bildirdiğin hatalı sorular',
      paragraflar: [
        'Mini oyunlardaki bir soruyu hatalı bulup bildirdiğinde şunlar gönderiliyor: sorunun kendisi, hangi oyundan geldiği, uygulamanın doğru saydığı cevap, senin seçtiğin sebep, uygulama sürümü, telefonunun modeli ve cihazına verilen rastgele bir ad.',
        'Adın, e-postan, denemelerin, notların, fotoğrafların ve puanların gönderilmiyor. Bildirim önce cihaza kaydediliyor; internet yoksa bekliyor, bağlanınca kendiliğinden gidiyor.',
        'İlk bildiriminde ne gönderileceğini gösteren bir kart çıkıyor ve “Gönder” demeden hiçbir şey ağa çıkmıyor. “Gönderme” dersen bildirimlerin telefonunda kalıyor; aynı yerdeki “Yine de gönder” ile kararını sonradan değiştirebiliyorsun.',
      ],
    },
    {
      baslik: 'Çökme raporları',
      paragraflar: [
        'Uygulama çökerse hata kaydı telefonunda bekliyor; kendiliğinden hiçbir yere gitmiyor. Bir sonraki açılışta gönderilsin mi diye soruluyor — “Gönder” dersen gidiyor, “Gönderme” dersen siliniyor.',
        'Giden şey bir hata kaydı: hatanın hangi satırda olduğu, telefonunun modeli, Android ve uygulama sürümü. Adın, denemelerin, notların ve fotoğrafların gönderilmiyor.',
      ],
    },
  ],
}

/** Ekrandaki sıra: önce uygulamanın kendi davranışı, sonra iki yasal metin. */
export const YASAL_BELGELER: YasalBelge[] = [VERI_OZETI, GIZLILIK, SOZLESME]

/** Kimliğe göre belge; tanınmayan kimlikte `null`. */
export function yasalBelgeBul(id: string | null): YasalBelge | null {
  return YASAL_BELGELER.find((b) => b.id === id) ?? null
}

/** Metni henüz yazılmamış belge — ekran onu "hazırlanıyor" diye çiziyor. */
export function belgeHazirMi(belge: YasalBelge): boolean {
  return belge.bolumler.length > 0
}
