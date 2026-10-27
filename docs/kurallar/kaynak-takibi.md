# Kaynak Takibi

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

Araçlar › Çalışma › **Kaynak Takibi** (`components/ekranlar/kaynak-takibi.tsx`, mantık
`lib/kaynak-takibi/`): öğrencinin test kitapları ve her kitapta bitirdiği konular.

- **Kaynak = ad + sınıf + ders** (kullanıcı istedi, 2026-10). Konular o sınıfın o
  dersinin listesinden hazır gelir; öğrenci konu yazmaz. Ad değiştirilebilir, sınıf
  ve ders **değiştirilemez** (tikler başka listenin konularına düşerdi).
- **Konu listesi** `konular.ts`, haritadan ayrı: 9–11 **Maarif** (ünite = program
  teması, konu = haritanın destesi), 12 **2018 programı**. Harita 12'de 9–11'de kartı
  olan 2018 konularını yazmıyor; burada yazılır (logaritma, trigonometrik denklem,
  dönüşümler, Canlılarda Enerji Dönüşümleri, düzgün çembersel hareket, İnkılap
  Tarihi 1. ünite). 12'nin Tarih'i ekranda "İnkılap Tarihi". İngilizce'de konu =
  ünite (tek "Üniteler" bölümü, sıra numarası yazılmaz).
- **Konu kimliği adından türer** (`konuKimligi`): konunun adını değiştirmek o konuya
  atılmış tikleri öksüz bırakır. Düzeltme gerekirse eski adı kimlik olarak koruyan
  bir eşleme ekle. `kaynak.test.ts` her listede kimliklerin tekil olduğunu denetler.
- **Tik yalnız bitti/bitmedi**, Yapılacaklar'daki görev gibi: bütün satır dokunulur,
  bitince yeşil ve üstü çizili. Ünite başlığındaki yuvarlak üniteyi toplu işaretler,
  hepsi işaretliyse toplu kaldırır. Konu Takibi'nin aşamalarıyla (okul, soru)
  **bağlanmaz**.
- Renk derse ait (`--konu-<ders>`): kartın simge kutusu, alt satır ve çubuk; kaynağın
  içi `dersVurgusu` ile ders renginde. Bitince çubuk yeşil.
- **Liste ders ders ayrılır** (kullanıcı istedi, 2026-10; `derseGoreGrupla`): ders
  başlıkları ders seçicinin sırasında, grup içinde bitmemiş kaynaklar üstte, eklenme
  sırası (yeni üstte). Üstte sınıf süzgeci (segment) ve ders süzgeci (yana kayan
  `SuzgecKutusu`); ikisi de yalnız birden çok seçenek varken çıkar, birlikte çalışır,
  yeni kaynağı gizliyorsa eklemede kalkar. Form süzülen sınıf/dersle açılır. 12'nin
  Tarih grubu yalnız 12'lik kitaplar varken "İnkılap Tarihi". **Eklenen kaynak açılmaz**, listenin başında
  kalır; konular karta dokununca açılır (kullanıcı istedi, 2026-10: kendiliğinden açılınca
  ikinci kitabı ekleyecek yer bulunmuyordu).
- Tek geri: açık kaynak bir geri katmanı; kabuğun "Geri"si önce kaynağı kapatır.
- **Kayıt** `rabi-kaynak-takibi` (`Kaynak[]`), okurken `kaynaklariCoz` süzer; bilinmeyen
  konu kimliği atılmaz, sayılmaz. Yedeğe girer (`Yedek.kaynakTakibi`; eski yedekte yoksa
  mevcut kayda dokunulmaz). En çok `EN_COK_KAYNAK` (60) kaynak, ad `EN_UZUN_KAYNAK_ADI` (40).
- **Yayınevi hızlı seçimi** (kullanıcı seçti, 2026-10; `yayinevleri.ts`): 18 yayınevinin
  kısa adı, formda yana kayan çipler. Çip kutuya öneki yazar ("Limit "), başka çip
  öneki değiştirir, seçili çipe dokunmak kaldırır; kitabın gerisini öğrenci yazar.
  **Marka kuralları:** yalnız düz yazı (logo, kapak, yayınevi rengi yok), liste
  **alfabetik** (test denetler), "sahiplerine aittir, bağlantılı değildir" notu çiplerin
  altında kalır, mağaza açıklamasına/anahtar kelimelere yayınevi adı yazılmaz. Kitap
  adları listelenmez (her yıl değişiyor). Ankara ve Tonguç kullanıcı isteğiyle yok.
- **Geçmiş öneri** (`gecmisOneriler`): yazılan metni içeren eski kaynak adları, en çok 3,
  kutu boşken yok.
