# Hedef kataloğu

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

- Hedef aranıp seçilir; veri `lib/veri/hedef-katalog-2025.json` (ÖSYM kılavuzundan ETL:
  ayrı depo `Asaf Belge/files`, `src/etl_kilavuz.py` → `src/uygulama_profili.py`;
  elle güncellenmez). Erişim `lib/veri/katalog.ts`, mantık `lib/hedef-katalog.ts`.
- Sıra ÖSYM'nin değeri, yuvarlanmaz; belirsizlik `bantYaz`ta. **Puan katalogda
  tutulmaz**, `siralamadanPuan` ile hesaplanır; `siralamadanPuan` ve `yilSiralamasi`
  birbirinin **tersi** (`hedef-katalog.test.ts`).
- `bolumBul` üniversite parametresi alır. Önlisans, KKTC uyruklu kontenjanlar ve
  puansız programlar dışarıda. Aynı adlı programa fakülte eklenir; kılavuz aynı adı
  iki kez veriyorsa sırası iyi olan tutulur.
- Liste `Ayarlar.puanTuru`ya göre süzülür (`bolumleriGetir`, `bolumAra`); `bolumBul` ve
  "bu bölüm burada var mı" denetimi süzgeçsiz. "Alanım dışındakileri de göster"
  anahtarı yalnız alan seçiliyken. Süzgeç öğrencinin alanından (`varsayilanTur`),
  seçilen bölümün türünden değil.
- `Ayarlar.puanTuru` `PuanTuru | null`; `null` varsayılanla doldurulmaz,
  `guncelTahmin` `null` döner. Kurulum ve Ayarlar'da dört tür (Dil dahil,
  `SECILEBILIR_TURLER`).
- Elle giriş kipi kalır (katalog dışı kayıtta `universiteBul` null → ekran o kiple açılır); `Hedef` kimlik değil **ad** tutar; seçim
  iki addan türetilir.
- Kurulumdaki bölüm adımı atlanabilir (`KurulumSonucu.hedef` `null`); liste
  `components/hedef-secici.tsx` ile paylaşılır; puan/sıra `tahminEt` ile; kaydedilen
  puan türü seçilen bölümünkü.
- **Seçim kuralları** (Hedefim ve kurulum ortak, `components/hedef-secici.tsx`):
  - Üniversite listesi boş aramada görünmez (kullanıcı istedi): `universiteAra('')`
    boş dizi, altında "Üniversite adını yazmaya başla." (`uniListesiBos`). **Bölüm
    listesi** boş aramada üniversitenin bütün bölümlerini gösterir (kullanıcı öyle
    kalsın dedi).
  - Kaydetmeden önce elle kontrol (kullanıcı istedi): katalogdan bölüm seçilince
    `HedefKontrolu` 2025 başarı sırasını ve taban puanını düzenlenebilir kutularda
    gösterir; kayda kutudaki değer girer (yeni alan yok, `Hedef.tabanPuan` /
    `basariSirasi`), ana sayfa, geri sayım ve Hedefim onu okur, katalogdan yeniden
    hesaplanmaz. Geçersiz değer (boş, sıfır, puan 100–560 dışı, sıra 1–3.000.000 dışı;
    `hedefSayilariGecerli`) Kaydet'i / kurulumda Devam'ı pasif yapar, sebep kutunun
    altında. Elle giriş kipinde sayılar isteğe bağlı ama yazılmışsa aynı denetim.
  - Hedefim'de Kaydet ekranı kapatmaz (kullanıcı istedi): "Hedefin kaydedildi." toast'ı.
  - Üniversite değişip aynı adlı bölüm yenide de varsa kutular yeni programın
    değeriyle dolar.
- Çıkan sayılar tahmindir (**Doğruluk** kuralı): kutular düzenlenebilir, uyarı
  kaldırılamaz.
