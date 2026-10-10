# Hareket ve geçişler

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

- **Altı ortak sınıf** (`globals.css`): `sayfa-girisi`, `katman-zemin`,
  `pencere-girisi`, `alt-pencere-girisi`, `tam-katman-girisi`, `acilir-giris`. Yeni
  pencere/katman bunlardan birini kullanır. Yalnız giriş, çıkış animasyonu yok;
  160–260 ms.
- **Ekranları saran kutunun dolgusu `backwards`, `both` değil:** transform/opaklık
  animasyonu yürürlükteyken `fixed` katmanların kapsayıcısı ve yığın bağlamı değişir
  (alt menü taştı, onay penceresi menünün arkasında kaldı).
- Geçiş yalnız solma olamaz (fark edilmiyor). Geçiş duraklatılmış başlar
  (`SayfaGecisi`, `.sayfa-bekliyor`, iki rAF + emniyet). Animasyonu `AppShell`deki
  `key` oynatır. Tam ekran katmanlar `clip-path` ile yükselir, `transform` değil.
- Alt sayfalar aşağı çekilince kapanır (`useAsagiKaydirKapat`, `lib/asagi-kaydir.ts`);
  yeni alt sayfa kancayı `ref` olarak alır. Kapatılması karar olan sonuç sayfaları
  almaz.
- Izgara kartları sırayla gelir (`kart-girisi`, `components/ui.tsx` → `kartGirisi(sıra)`);
  gecikme tavanı JS'te (CSS `min()` eski WebView'de düşüyor), sekizinci kartta.
- Bilgi taşımayan bütün hareketler `prefers-reduced-motion` altında susar (açılış
  ekranı hariç).
- **Alt menü Android'de donuk, `backdrop-blur` yok** (her kıpırtıda yeniden
  bulanıklaştırma geçişi takıltıyordu). Sayfanın üstünde duran yeni çubuk eklersen
  aynı soruyu sor.
- **iOS'ta menü camdan** (tek istisna, kullanıcı istedi): yüzen kapsül, kayan mercek
  (`alt-menu`, `alt-menu-mercek`, `globals.css` → "Camdan alt menü"; hesaplar
  `lib/cam-menu.ts`). Sürüklenir (6 px eşikten sonra işaretçi yakalanır), arkasının
  rengini örnekler (`elementsFromPoint`, koyu zeminde `data-koyu`). Titreşim yok.
  Mercek konumu yerleşim pikselinde: `seritOlcusu` `offsetWidth` ile oran ölçer
  (tablette `body` `zoom`lu). Android'e taşımadan önce telefonda dene.
- Platform `<html data-platform>`e `layout.tsx` betiğinde yazılır (ilk kare cam
  olsun), `AppShell` yedek. Cam kuralları katman dışında (Tailwind'i ezsin).

## Çarpı önce soruyor

- **✕ yalnız hemen geri gelmeyecek bir şey kaybolacaksa sorar** (kullanıcı istedi);
  kaybedilecek şey yoksa sormadan kapatır. Silme her zaman sorar.
- Kendi `Onay`ıyla soranlar: oyun turu (tur sürerken), konu destesi (ilk ekrandan
  sonra), yoklama (ilk cevaptan sonra), Pomodoro "Turu bitir" (başlamış turda).
- `useKapatmaOnayi` (`components/ui.tsx`) ile, yalnız girilmiş/değişmiş bir şey
  varken soranlar (`girildi ? sor(kapat) : kapat()`): Yeni/Düzenlenen Deneme, Soru
  Takibi, Yapılacaklar ve Devamsızlık formları, hata bildirimi, deneme okutma.
- Bilgi pencereleri sormaz: konu kartı, istatistik, aylık özet, Ayarlar yedeği,
  yanlış soru ayrıntısı, güncelleme şeridi.
- Kapsam yalnız ✕ düğmeleri: geri oku, geri tuşu, kenardan kaydırma, aşağı çekerek
  ve zemine basarak kapatma sormaz. Satır silen/alan temizleyen ✕'ler (Kaydı sil,
  notu sil, Saati kaldır) kapsam dışı.
- Tanıtım turu sürerken (`useTanitimSuruyor`) sorulmaz: spot ışığı hedef dışı
  dokunuşu yutar, açılan onay turu kilitlerdi.
- **Tablette alt pencere ortada:** zemine `tablet-orta-zemin`, pencereye
  `tablet-orta-pencere`, tutamağa `tablet-orta-tutamac` (`globals.css`, katmansız —
  Tailwind'in `max-w-md`/`rounded-t` sınıflarını ezer). Pencere içerik alanının
  ortasında (sağdan `--ray` kadar), en çok 34rem; giriş hareketi aynı. Şimdilik Soru
  ekle ve Pomodoro Süreler; başka alt sayfaya da aynı üç sınıf eklenir.
