# Denemeler

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

- **Şablon kimlikleri kayıt anahtarıdır** (`lib/sablonlar.ts`): deneme `sablonId` ile
  şablonuna bağlı. Seviye tespitin 9. sınıf şablonu bu yüzden hâlâ `okul`.
- **Seviye tespit sınıfa göre** (kullanıcı istedi, 2026-10): tür satırında tek
  "Seviye Tespit" düğmesi, altında `9 · 10 · 11 · 12`. 9 eski biçim (`okul`), 10 aynısı +
  Felsefe 6 soru (`okul-10`), 11 ve 12 alanın AYT'sinin aynı dersleri
  (`okul-<sınıf>-<alan>`, tür yine `okul`). Alan Ayarlar'dan; seçilmemişse 11-12'de
  sınıfın altında alan satırı çıkar. Varsayılan sınıf öğrencininki (mezun → 12); turda
  9, çünkü Okut'un örnek kâğıdı 9. sınıf seviye tespiti. Öteki seviye şablonları tür
  satırında yer tutmaz (`secilebilirSablonlar`).
- **"Dersleri düzenle"** (`components/seviye-dersleri.tsx`, `lib/seviye-tespit.ts`):
  ders ekle/çıkar, ad ve soru sayısı. Kayıt seçili sınıfa (11-12'de alana) yeni bir
  kullanıcı şablonu olarak yazılır ve hazır olanın önüne geçer. **Deneme girilmiş
  şablon yerinde değiştirilmez** (eski denemenin boşu ve neti değişirdi): `seviye.eski`
  işaretlenir, yanına yenisi gelir; kullanılmamışsa silinir. Hazırla aynı derslere
  dönmek ("Varsayılana dön") düzenlemeyi kaldırır.
