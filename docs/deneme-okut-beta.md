# Deneme okut — Beta

Deneme ekleme/düzenleme ekranında elle giriş tablosunun üstündeki **Okut · Beta**
düğmesi kamera veya fotoğraf seçiciyi açar. Tarayıcıda dosya seçici kullanılır.
Okuma yerel Web Worker içinde PP-OCRv5 mobile tespit ve Rabi için ince ayarlı
Latin tanıyıcı ile yapılır. Sözlük, ONNX modelleri ve WebAssembly çalıştırma
dosyaları APK'nın içindedir; ağdan servis/model çağrısı yapılmaz.

Sayılar önce önizlemede görünür. **Kontrol ettim, forma aktar** yalnızca okunan
derslerin kutularını değiştirir; öteki girişleri korur. Deneme hâlâ normal
**Kaydet** düğmesiyle kaydedilir. Eksik, çelişkili veya soru sayısını aşan
sonuçlar aktarılmaz. Şablon otomatik değiştirilmez. Okuma iptalinde ve ekran
kapanınca işçi sonlandırılır; fotoğraf uygulama tarafından saklanmaz.

## Model seçimi ve sınırlar

12 Eylül modeli kullanılır: 30 Eylül ikinci eğitimin 62 gerçek kırpıktaki tam
metin başarısı %74,19'dan %70,97'ye düştü. Bu oran masaüstü tanıyıcısının
ölçümüdür. Kâğıt iyi ışıkta çekilmeli; yan çekilmiş fotoğrafın yönü okunabilir
sayılar bulunamazsa iki yönde denenir. Perspektif düzeltmesi yapılmaz. Prototip FSM çözücüsü ilk sayı
bloğunu yanlışlıkla ders adına katabildiğinden ham CTC okuma kullanılır.

## Derleme

`scripts/ocr-hazirla.mjs`, `predev` ve `prebuild` sırasında çalıştırma dosyalarını
kurulu `onnxruntime-web` paketinden kopyalar, TypeScript işçisini üretir. Üretilen
dosyalar depoya girmez; modeller ve sözlük girer. Android'e aktarım normal
`npm run build` ve `npx cap sync android` akışıyla yapılır.

Kaynaklar: [ONNX Runtime Web ayarları](https://onnxruntime.ai/docs/tutorials/web/env-flags-and-session-options.html),
[RapidOCR model listesi](https://github.com/RapidAI/RapidOCR/blob/main/python/rapidocr/default_models.yaml).

## Doğrulama — 30 Eylül 2026

- Tür kontrolü, statik üretim derlemesi ve 2.289 test geçti.
- Chromium'da yapay kâğıttaki 10 satır tespit/tanıma hattında okundu.
- Aynı araştırmadaki 19 gerçek kâğıdın 154 satırı, uygulamanın yerel OCR
  işçisine verildi: ders adı ve sayı dizisi 140 satırda birlikte doğru (%90,9).
  Dört yan çekilmiş kâğıt otomatik döndürmeyle okundu; ilk denemede 111/154
  satır doğruydu. Ölçü, masaüstü araştırmasının `sifir_atis.py` eşleştirmesiyle
  hesaplandı. Bu kâğıtlar model geliştirmesinde de kullanıldığından bağımsız
  kullanıcı doğruluğu sayılmaz; ayrıca forma aktarımın şablon kurallarını içermez.
- `k8` kâğıdında Kimya `0Y` → `6Y` okundu; kontrol ekranı bu nedenle kalır.
  Yalnızca `30D` gibi tek sayı yazılıp kalan iki sayı bilinmiyorsa, uygulama
  bunları uydurmaz; ham okuma kullanıcıya gösterilir.
- Mobil genişlikte dosya seçimi → sonuç önizlemesi → forma aktarım çalıştırıldı.
  Türkçe 32/6 ve Matematik 28/8 forma geçti; önceden girilen Tarih 4 doğru korundu.
  Aktarımda otomatik kayıt oluşmadığı ve iptalde değerlerin değişmediği doğrulandı.
- Yan çekilmiş `k8` gerçek kâğıdı da aynı ekrandan seçildi. Yön düzeltmesiyle
  Türkçe 30/10 ve Matematik 35/5 aktarıldı; fotoğrafta eksik yazılmış
  Coğrafya için önceden girilen 4 doğru korundu. Kimya ve Felsefe belirsiz
  satırlar olarak gösterildi; kaydetme otomatik tetiklenmedi.
- Capacitor eşitlemesi ve JDK 21 ile `assembleDebug` geçti. APK içinde iki model,
  sözlük, işçi ve yerel WebAssembly dosyalarının bulunduğu denetlendi.
- Gerçek Android cihazda kamera ve WebView çalıştırma testi henüz yapılmadı.
