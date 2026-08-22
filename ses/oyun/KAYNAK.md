# Mini oyun ses efektleri

| Dosya | Kaynak |
|---|---|
| `dogru.mp3` | YouTube — "Correct Answer - Sound Effect HD", *Extreme Sound Effects* kanalı (https://youtu.be/ZUZrGQwA4xI) |
| `yanlis.mp3` | Kullanıcının verdiği dosya: `incoreccrt.wav` |

Her ikisi de kullanıcı tarafından seçildi.

## Yapılan işlem

Ham kayıtlar `ffmpeg` ile:

- baştaki/sondaki sessizlik kırpıldı (`dogru` 1,17 sn, `yanlis` 0,92 sn),
- sonlarına kısa bir sönümleme kondu,
- hafif sıkıştırma (compressor) + sınırlayıcı (limiter) ile tepe noktası −1 dB'ye
  çekildi. Amaç: telefon hoparlöründe kısık kalmasınlar. Uygulama bunları
  1,0 kazançla (tam ses) çalıyor.
- 128 kbps mp3, 44,1 kHz stereo. İkisi toplam ~35 KB.

## Lisans uyarısı

`dogru.mp3` bir YouTube videosundan alındı; o videonun lisans durumu belirsiz.
Kişisel kullanımda sorun değil, ama **uygulama mağazaya yüklenecekse** bu ses
lisansı belli bir kaynakla (örneğin Pixabay veya freesound.org üzerindeki CC0
bir efektle) değiştirilmeli. `public/ses/LISANS.md` altındaki lo-fi parçalar
CC0 olduğu için böyle bir sorun taşımıyor.
