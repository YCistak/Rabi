# Denemeler

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

- **Şablon kimlikleri kayıt anahtarıdır** (`lib/sablonlar.ts`): deneme `sablonId` ile
  şablonuna bağlı. Seviye tespitin 9. sınıf şablonu bu yüzden hâlâ `okul`.
- **Seviye tespit sınıfa göre** (kullanıcı istedi, 2026-10): tür satırında tek
  "Seviye Tespit" düğmesi, altında `9 · 10 · 11 · 12`. 9 eski biçim (`okul`), 10 aynısı +
  Felsefe; Tarih 10, Coğrafya 10, Felsefe 5, Din 5 (`okul-10-b`; ilk sürüm `okul-10` `eski`
  işaretli, yalnız eski denemeler için — hazır şablonun sayısı yerinde değişmez), 11 ve 12 alanın AYT'sinin aynı dersleri
  (`okul-<sınıf>-<alan>`, tür yine `okul`). Alan Ayarlar'dan; seçilmemişse 11-12'de
  sınıfın altında alan satırı çıkar. Varsayılan sınıf öğrencininki (mezun → 12). Öteki seviye şablonları tür
  satırında yer tutmaz (`secilebilirSablonlar`).
- **"Dersleri düzenle"** (`components/seviye-dersleri.tsx`, `lib/seviye-tespit.ts`):
  ders ekle/çıkar, ad ve soru sayısı. "Ders ekle" listesinde
  yalnız Felsefe ve İngilizce (kullanıcı istedi, 2026-10-29); öteki ders "Başka ders"le. Kayıt seçili sınıfa (11-12'de alana) yeni bir
  kullanıcı şablonu olarak yazılır ve hazır olanın önüne geçer. **Deneme girilmiş
  şablon yerinde değiştirilmez** (eski denemenin boşu ve neti değişirdi): `seviye.eski`
  işaretlenir, yanına yenisi gelir; kullanılmamışsa silinir. Hazırla aynı derslere
  dönmek ("Varsayılana dön") düzenlemeyi kaldırır.
- **Dersleri düzenle soru sınırı:** ders başı en çok 40 (`DERS_EN_COK_SORU`, kullanıcı
  istedi, 2026-10-29). Hazırda fazlası olan ders (Dil alanında Yabancı Dil 80)
  hazırdaki sayıya kadar çıkar (`dersSoruSiniri`); yoksa o alanda kayıt yapılamazdı.
- **Toplu grup girişi** (kullanıcı istedi, 2026-11): denemede Sosyal ve Fen
  "Ders ders · Toplu" segmentiyle grup hâlinde girilebilir ("sosyalden 20 doğru").
  - **Model:** `Deneme.toplu?: TopluSonuc[]` (`{ grup: 'sosyal' | 'fen', dogru, yanlis }`).
    Toplu girilen grubun derslerinin `sonuclar`da satırı olmaz; grup ya toplu ya ders
    ders. Üyelik tek yerde, ders kimliğinden (`lib/toplu-grup.ts`): Fen = fizik, kimya,
    biyoloji; Sosyal = tarih, cografya, felsefe, din, tarih1/2, cografya1/2. Şablonda
    en az iki üyesi olan grup çıkar (`sablonGruplari`). Alanı olmayan eski kayıt aynen
    çalışır; yedekte `denemeleriNormalize` (`lib/depo.ts`) bozuk satırı atar.
  - **Hesap:** toplam net, D/Y/boş toplamları ve ÖSYM test netleri toplu satırı sayar
    (`denemeOzeti`, `osymNetleri`). TYT'de grup tek test, net olduğu gibi o teste gider.
    AYT'de grup birden çok teste yayılıyorsa net, üye derslerin soru sayısına
    **orantılı** dağıtılır (`topluTestDagilimi`) — yalnız puan tahmini için; ders netine
    ve ders istatistiğine yazılmaz.
  - **İstatistik:** toplu denemede grubun dersleri o deneme için **boş** (anahtar yok,
    sıfır sayılmaz): değişim, en güçlü/zayıf ders ve karşılaştırma o dersi atlar. Ders
    sayfasında tek satır sönük not ("Fen: 2 denemede toplu girildi"), karşılaştırmada
    "… toplu girildi; dersleri ayrı kıyaslanmadı". Formda toplu satırın altında tek
    satır uyarı.
  - **Sahte ders verisi yasak:** toplu sonuç derslere bölünüp "Tarih 5 doğru" gibi
    yazılmaz; toplu → ders ders geçişte ders kutuları boş açılır. Ders ders → toplu
    geçişte yazılmış ders sayıları toplanıp taşınır. Okut (OCR) ders ders okur; okunan
    dersi olan grup ders derse döner.
