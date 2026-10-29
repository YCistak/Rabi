# Kaynak Takibi

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

Araçlar › Çalışma › **Kaynak Takibi** (`components/ekranlar/kaynak-takibi.tsx`, mantık
`lib/kaynak-takibi/`): öğrencinin test kitapları ve her kitapta bitirdiği konular.

- **Kaynak = ad + sınıf + ders** (kullanıcı istedi, 2026-10). Konular o sınıfın o
  dersinin listesinden hazır gelir; öğrenci konu yazmaz. Ad değiştirilebilir, sınıf
  ve ders **değiştirilemez** (tikler başka listenin konularına düşerdi).
- **Konu listesi** `konular.ts`, haritadan ayrı: 9–11 **Maarif** (ünite = program
  teması, konu = haritanın destesi). **12 haritanın 12. sınıfıyla birebir aynı**
  (kullanıcı istedi, 2026-10; 2018 programı, 9–11'de kartı olan konular 12'de yok);
  `kaynak.test.ts` haritayla karşılaştırır, harita değişince liste de güncellenir.
  Ders adları her sınıfta aynı (12'nin Tarih'i de "Tarih"). İngilizce 9–11'de konu =
  ünite (tek "Üniteler" bölümü, sıra numarası yazılmaz), 12'de haritadaki gibi.
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
  yeni kaynağı gizliyorsa eklemede kalkar. Form süzülen sınıf/dersle açılır. **Eklenen kaynak açılmaz**, listenin başında
  kalır; konular karta dokununca açılır (kullanıcı istedi, 2026-10: kendiliğinden açılınca
  ikinci kitabı ekleyecek yer bulunmuyordu).
- Tek geri: açık kaynak bir geri katmanı; kabuğun "Geri"si önce kaynağı kapatır.
- **Kayıt** `rabi-kaynak-takibi` (`Kaynak[]`), okurken `kaynaklariCoz` süzer; bilinmeyen
  konu kimliği atılmaz, sayılmaz. Yedeğe girer (`Yedek.kaynakTakibi`; eski yedekte yoksa
  mevcut kayda dokunulmaz). En çok `EN_COK_KAYNAK` (60) kaynak, ad `EN_UZUN_KAYNAK_ADI` (40).
- **Yayınevi önerisi ad kutusunda** (kullanıcı istedi, 2026-10; `yayinevleri.ts`): ayrı
  yayınevi kutusu/çip satırı **yok**. Ad kutusu odaktayken Hedefim'deki arama gibi
  altında liste açılır: üstte adı yazılanla başlayan eski kaynak adları (`gecmisOneriler`,
  en çok 3), altta yayınevleri (`yayineviOnerileri`: kutu boşken liste **yok** — kullanıcı istedi;
  yazdıkça adı yazılanla başlayanlar, "o" → Orijinal; adın başında yayınevi varsa liste
  kapanır). Yayınevi seçilince
  kutuya kısa adı yazılır ("Limit "), gerisini öğrenci yazar; hiçbiri seçilmezse yazılan
  ad olduğu gibi kaydedilir. Satırda **simge yok**, yayınevinin altında "Yayınevi" yazmaz (kullanıcı kaldırttı); eski
  adın altında "Daha önce eklediğin". Satırlar `pointerdown`da odağı almaz (liste tıklamadan
  önce kapanmasın). **Marka kuralları:** düz yazı (logo, kapak, yayınevi rengi yok),
  liste **alfabetik** (test denetler), "sahiplerine aittir, bağlantılı değildir" notu
  listenin altında, mağaza açıklamasına/anahtar kelimelere yayınevi adı yazılmaz. Kitap
  adları listelenmez (her yıl değişiyor). Ankara ve Tonguç kullanıcı isteğiyle yok.
