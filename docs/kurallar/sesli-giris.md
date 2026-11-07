# Sesli Giriş

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

Soru Takibi ekranında öğrencinin gününü konuşarak anlatması ("80 matematik, 65 kimya sorusu çözdüm, TYT denemesinde 87 net yaptım"). Ağ istisnası, gizlilik ve üçüncü taraf servis kuralları için: [ag-ve-gizlilik.md](ag-ve-gizlilik.md).

## Mimari ve dosyalar

- **Paket:** `@capgo/capacitor-speech-recognition` (MPL-2.0). Cihaz köprüsü `lib/ses-tanima.ts`, saf metin çözümleyici `lib/sesli-giris.ts`, onay ve sonuç arayüzü `components/sesli-giris.tsx`.
- **Sunucu yok:** Rabi'nin kendi sunucusu yoktur. Ses yalnızca telefonun işletim sisteminin konuşma tanıma servisine (Android'de Google, iOS'ta Apple Konuşma Tanıma) gider; Rabi sesi veya metni hiçbir sunucuya aktarmaz, saklamaz veya kaydetmez.
- **İzin ve düğme görünürlüğü:** Mikrofon izni yalnızca kullanıcı düğmeye ilk bastığında istenir; açılışta veya gereksiz yere izin istenmez. Cihazda konuşma tanıma servisi yoksa (ör. Google ses tanıma servisi bulunmayan Android cihazlar) "Sesle anlat" düğmesi hiç gösterilmez.

## Kurallar

- **Çözücü saf ve testli (`lib/sesli-giris.ts`):** Metinden ders, soru sayısı, doğru/yanlış ve deneme neti çıkarma mantığı saf fonksiyondur; React bileşenlerinden veya yerli köprüden bağımsızdır. Kapsamlı birim testleri (`lib/sesli-giris.test.ts`) ile doğrulanır; yeni kalıp eklenirse testle birlikte eklenir.
- **Uydurma yok (çözülemeyen `anlasilmayan`a):** Çözücü kesin emin olmadığı hiçbir bilgiyi tahmin etmez veya uydurmaz. Metindeki ayrıştırılamayan, eksik veya şüpheli parçalar `anlasilmayan` listesine aktarılır; onay ekranında kullanıcıya gösterilerek elle girmesi sağlanır.
- **Onay ekranı atlanmaz:** Konuşma tanıma metni çözümlendikten sonra doğrudan kayda geçilemez. Çıkarılan dersler, soru sayıları ve netler onay ekranında kullanıcıya sunulur. Kullanıcı "Kaydet" demeden hiçbir veri yerel depoya yazılmaz; "Vazgeç" denirse tümü silinir.
- **Ders adları `CALISMA_DERSLERI`ne eşlenir:** Kullanıcının telaffuz ettiği ders adları ve kısaltmalar (mat, geometri, edebiyat vb.) projenin kanonik ders listesine (`CALISMA_DERSLERI`, `lib/dersler.ts`) eşlenir. Eşleşmeyen ya da belirsiz kalan dersler uydurulmaz, `anlasilmayan`a aktarılır.
- **Deneme netleri ders ders girilir:** Denemeler ders bazında çözümlenir (ör. "Türkçe 35 doğru 5 yanlış"). Kullanıcı yalnızca toplam net belirttiyse ("TYT'den 87 net yaptım"), çözücü bunu derslere keyfi olarak dağıtamaz; deneme formu açılır ve net dağılımını kullanıcının tamamlaması istenir.
- **Çözülemeyen deneme parçası geri kalanı düşürmez:** Deneme bağlamında çözülemeyen ders parçası (ör. TYT'de 'sosyal 15 doğru' — grup adı, derslere dağıtılamaz) denemenin geri kalanını düşürmez; yalnız o parça `anlasilmayan`a gider.
- **Android `<queries>` girdisi silinmez:** `android/app/src/main/AndroidManifest.xml` dosyasındaki `<queries>` bloğunda `android.speech.RecognitionService` eylemi (`<action android:name="android.speech.RecognitionService" />`) zorunludur. Android 11+ (API 30+) paket görünürlüğü kısıtlamaları gereği bu girdi olmadan eklentinin `available()` denetimi her zaman `false` döner ve ses tanıma düğmesi açılamaz.
