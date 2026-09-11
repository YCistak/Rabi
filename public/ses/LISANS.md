# Müzik lisansı

Bu klasördeki lo-fi parçalar **Open Lo-Fi** derlemesinden alındı:

- Kaynak: https://github.com/btahir/open-lofi (sürüm v1.0.0)
- Lisans: **CC0 1.0 Universal** (kamu malı) — https://creativecommons.org/publicdomain/zero/1.0/
- Atıf gerekmiyor, ticari kullanım serbest, tekrar dağıtılabilir.

Bu dosya yine de tutuluyor: kaynağın izi kaybolmasın ve ileride "bu müzik nereden
geldi" sorusu çıkarsa cevabı burada dursun.

## Parçalar

| Dosya | Ad |
|---|---|
| `dust-on-the-morning-keys.ogg` | Dust on the Morning Keys |
| `candlelit-at-70-bpm.ogg` | Candlelit at 70 BPM |
| `glow-on-the-overpass.ogg` | Glow on the Overpass |
| `almost-floating.ogg` | Almost Floating |
| `after-school-rain.ogg` | After School Rain |
| `2-am-debug-loop.ogg` | 2 AM Debug Loop |
| `graphite-in-the-quiet.ogg` | Graphite in the Quiet |
| `stacks-of-quiet-hours.ogg` | Stacks of Quiet Hours |
| `chapter-by-lamplight.ogg` | Chapter by Lamplight |
| `coffee-ring-notebook.ogg` | Coffee Ring Notebook |
| `margin-notes-at-dusk.ogg` | Margin Notes at Dusk |
| `stacks-of-quiet-books.ogg` | Stacks of Quiet Books |

## Dosyalarda yapılan değişiklik

Özgün dosyalar stereo ve ~160–190 kbps'ti; on iki parça toplam 37 MB tutuyordu.
APK'yı şişirmemek için `ffmpeg` ile **mono, 32 kHz, 64 kbps**'e indirildi (toplam 13 MB).
Arka planda çalan çalışma müziği için bu yeterli; kulaklıkta bile fark edilmiyor.

Dönüştürme komutu:

```bash
ffmpeg -i girdi.ogg -ac 1 -ar 32000 -b:a 64k -map_metadata -1 cikti.ogg
```

CC0 türev çalışmalara izin verdiği için bu değişiklik serbesttir.
