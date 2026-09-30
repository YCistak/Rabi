# Çevrimdışı deneme okuma — Beta

- `satir-tani.onnx`: PP-OCRv5 Latin mobile, Rabi için 12 Eylül 2026 ince ayarı.
  30.000 sentetik satır + gerçek eğitim kırpıkları. Sonraki denemede doğrulama
  gerilediği için ilk model kullanılıyor. Kaynak: Claude OCR araştırması.
- `karakterler.txt`: PP-OCRv5 Latin sözlüğü; karakter sırası modelle birlikte korunur.
- `yazi-bul.onnx`: RapidOCR 3.9.2 model listesindeki PP-OCRv5 mobile DB tespit modeli.
  İndirme: https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.9.2/onnx/PP-OCRv5/det/ch_PP-OCRv5_det_mobile.onnx
- PaddleOCR ve RapidOCR: Apache-2.0. ONNX Runtime: MIT.
  ONNX Runtime çalıştırma dosyaları derlemede kurulu npm paketinden kopyalanır;
  uygulama dışarıdan model veya çalıştırma dosyası indirmez.

Okuma bir Web Worker içinde ve tümüyle cihazda çalışır. Fotoğraf kaydedilmez,
bir servise gönderilmez. Kamera/galeri sistem seçicisi mevcut izin düzenini
kullanır. Sonuçlar kullanıcının kontrolüyle forma geçer; otomatik kayıt yoktur.
Bu sürüm ham CTC okumayı kullanır: prototipteki kısıtlı çözücü doğru metindeki
ilk sayı bloğunu silebildiğinden taşınmadı. Eğik kâğıtta tespit kutusu kırpımı
perspektif düzeltmez; düz çekim önerilir. Masaüstündeki %88,7 alan ölçümünün
bu yeni tarayıcı/Android işlem hattında aynı olduğu iddia edilmez.
