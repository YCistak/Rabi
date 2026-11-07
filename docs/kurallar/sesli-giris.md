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
- **"deneme" sözcüğü olmadan TYT/AYT/YDT:** Cümlede TYT/AYT/YDT adı geçiyor ve ardından ders + doğru/yanlış geliyorsa ("TYT Türkçe 32 doğru 6 yanlış") bu deneme bilgisidir, "deneme" sözcüğü şart değildir; "Bugün 50 TYT matematik sorusu çözdüm" gibi soru çözümü ifadeleri Soru Takibi'nde kalır.
- **Çözülemeyen deneme parçası geri kalanı düşürmez:** Deneme bağlamında çözülemeyen ders parçası (ör. TYT'de 'sosyal 15 doğru' — grup adı, derslere dağıtılamaz) denemenin geri kalanını düşürmez; yalnız o parça `anlasilmayan`a gider.
- **Soru Takibi'nde eksik doğru/yanlış davranışı:** Toplam soru ile yalnız doğru sayısı söylendiğinde ("40 soru çözdüm 32 doğru") kalan soruların boş mu yanlış mı olduğu bilinmediğinden yanlış uydurulmaz ve `0` bırakılır; yalnız yanlış sayısı söylendiğinde ("30 soru çözdüm 5'ini yanlış yaptım") çözülen soruların kalanı doğru kabul edilir (`doğru = toplam − yanlış`).
- **Yanlış duyma düzeltmesi ve ham metin gösterimi:** Telefonun konuşma tanımasının TYT/AYT/YDT ve "Rabi" için yanlış ürettiği biçimler `lib/sesli-giris.ts` içindeki `duyulaniDuzelt` tablosunda tutulur; bildirilen her yeni yanlış duyma oraya ve `lib/sesli-giris.test.ts` testlerine eklenir. Onay ekranı (`components/sesli-giris.tsx`), hatanın nerede olduğunun görülmesi için `duyulaniDuzelt`ten önceki ham metni ("Duyduğum") en üstte gösterir.
- **Android `<queries>` girdisi silinmez:** `android/app/src/main/AndroidManifest.xml` dosyasındaki `<queries>` bloğunda `android.speech.RecognitionService` eylemi (`<action android:name="android.speech.RecognitionService" />`) zorunludur. Android 11+ (API 30+) paket görünürlüğü kısıtlamaları gereği bu girdi olmadan eklentinin `available()` denetimi her zaman `false` döner ve ses tanıma düğmesi açılamaz.
