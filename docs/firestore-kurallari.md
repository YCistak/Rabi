# Firestore kurallarını kontrol etme ve yayınlama

Depodaki `firestore.rules` dosyası, uygulamanın Firestore'a yazdığı iki koleksiyon
(`hatali-sorular`, `geri-bildirimler`) için olması gereken kuraldır. **Kendiliğinden
yayınlanmaz**; konsolda elle kontrol edip gerekirse yapıştırman gerekir.

Dosyanın özeti: herkes yalnızca **yeni kayıt ekleyebilir** (`create`); okuma,
değiştirme ve silme kapalı; alan adları, türleri ve uzunlukları denetlenir; başka
her koleksiyon kapalı.

## 1. Şu anki kuralı gör

1. <https://console.firebase.google.com> adresine geliştirici Google hesabınla gir.
2. **rabi-fbd8e** projesini aç.
3. Sol menüden **Build → Firestore Database**'e tıkla.
4. Üstteki sekmelerden **Rules** (Türkçe arayüzde **Kurallar**) sekmesini aç.
5. Ekrandaki metin şu an yayında olan kuraldır.

## 2. Depodakiyle karşılaştır

- Konsoldaki metinde `allow read, write: if true;` ya da
  `allow read, write: if request.time < timestamp.date(...)` gibi bir satır varsa
  **veritabanın herkese açık** (ya da test modunda) demektir: herkes kayıtları okuyabilir,
  silebilir. Bu durumda 3. adımı hemen yap.
- Konsoldaki metin `firestore.rules`la aynıysa bir şey yapmana gerek yok.
- Farklıysa ve neden farklı olduğunu bilmiyorsan 3. adımla depodakini yayınla.

## 3. Depodaki kuralı yayınla

1. Depodaki `firestore.rules` dosyasını aç, **tamamını** kopyala.
2. Konsolun Rules sekmesindeki metnin tamamını sil, kopyaladığını yapıştır.
3. Önce sağ üstteki **Rules Playground** (Kural deneme alanı) ile dene (aşağıya bak).
4. **Publish** (Yayınla) düğmesine bas. Kural bir dakika içinde etkinleşir.
5. Eski kurala dönmen gerekirse aynı sekmedeki geçmiş listesinden önceki sürümü
   seçip yeniden yayınlayabilirsin.

## 4. Rules Playground ile hızlı deneme

- **Simulation type: get**, konum `/hatali-sorular/deneme` → sonuç **Denied** (reddedildi)
  olmalı. Okuma kapalı.
- **Simulation type: create**, konum `/geri-bildirimler/deneme`, belge gövdesi:
  `{"tur":"Öneri","metin":"Deneme mesajı yazıyorum","surum":"1.0 (1)","cihaz":"Samsung SM-A536B (mavi-tavsan-42)","tarih":"2026-10-09T12:00:00.000Z"}`
  → **Allowed** (izin verildi) olmalı.
- Aynı gövdeye fazladan bir alan ekle (`"x":"y"`) → **Denied** olmalı.

## 5. Yayınladıktan sonra

Uygulamada Ayarlar → "Öneri ve hata bildir"den kısa bir deneme mesajı gönder ve
konsolda **Data** (Veri) sekmesinde `geri-bildirimler` altında göründüğünü kontrol et.
Görünmüyorsa kural kodla uyuşmuyor demektir; kuralı eski hâline döndür ve bana yaz.

Koddaki gönderilen alanlar değişirse (`lib/hata-bildirimi.ts` → `formVerisi()`,
`lib/geri-bildirim.ts` → `geriBildirimFormVerisi()`), `firestore.rules` da aynı
değişiklikle güncellenip yeniden yayınlanmalı.
