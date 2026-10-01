# Rabi ana tanıtımı ve bağlamsal mini turlar

## Dosyalar ve görevleri

1. `lib/tanitim.ts`: Üç turun adımları, bağımsız kayıt anahtarları, saf geçiş fonksiyonu, gerçek oyundan gelen geçici sonuç ve üç örnek banka kaydı.
2. `components/tanitim/tanitim-baglami.tsx`: React 19 Context, aktif tur/adım, `turuBaslat`, `sonrakiAdimaGec`, `oncekiAdimaDon`, `turuBitir`, `turGorulduMu`, `turuKaydet`.
3. `components/tanitim/spot-isigi.tsx`: SVG maskesi, güvenli ekran boşlukları, dokunma kilidi, klavye odağı, yumuşak kaydırma ve konum takibi. Yönlendirme düğmeleri en az 44×44 piksel.
4. `components/tanitim/demo-oyun.tsx`: Ders ızgarasındaki Tanıtım oyunu kartı ve gerçek `IslemOyunuEkrani`. Hazırlık, mod/zorluk seçimi, geri sayım, tuş takımı ve sonuç ekranı mevcut oyunlarla aynıdır. Tur ayarları ve sonuç sadece bellekte tutulur.
5. `components/tanitim/net-gelisimi.tsx`: Gerçek denemelerden net gelişimi; şablon seçimi sayesinde TYT/AYT ve farklı ölçekler karışmaz. Son on kaydı gösterir. Kayıt yokken örnek net oluşturmaz.
6. `components/app-shell.tsx`: Kurulum ve açılış animasyonu bittikten sonra ana turu başlatır; ekran geçişlerini yönetir. Denemeler ve Harita ilk açıldığında ilgili mini turu başlatır.

`data-tanitim` hedefleri ilgili bileşenlerde bulunur: ana sayfa, alt menü, Pomodoro, oyun bankası, Denemeler ve konu haritası.

## Ana akış

Beş ana bölüm, on altı etkileşim adımına ayrılır:

1. Sınav geri sayımı ve hedef kartı.
2. Günlük soru hedefi ve yedi günlük şerit.
3. Soru Takibi kartı; içeri girilmez.
4. Pomodoro düğmesine gerçek dokunuş → deneme provası seçimi → sayaç, ders, süreler, ses ve ekran ayarları → ayrı odak kilidi açıklaması → ana sayfa.
5. Oyunlar sekmesine dokunuş → ders kategorileri arasında Tanıtım oyunu → gerçek tur ayarları → Başlat ve karartmasız geri sayım → 10 dakikalık süre ve tur bilgileri → tek örnek işlem → gerçek sonuç ekranı → Oyunlar menüsünde Oyun Bankası kartına dokunuş → üç geçici örnek.

Önceki kullanıcı tercihi korunur: oyun yanlışlarının bulunduğu Oyun Bankası tanıtılır; fotoğraflı Yanlış Soru ekranına veri eklenmez.

## Mini turlar

- Denemeler: Yeni Deneme Ekle düğmesi ve net grafiği. İki bilgi adımıdır; kayıt formunu açmaz.
- Konu Haritası: İlk bölümün ilerleme bandı ve konu patikasının görünür başlangıcı. Uzun patikanın tamamını aydınlatmak yerine ekrana sığan başlangıcı gösterilir. Henüz içerik bulunmayan programda boş durum açıklaması hedeflenir.

Ana tur açıkken mini tur başlamaz. Mini turun bitirilmesi veya geçilmesi kullanıcıyı bulunduğu ekranda bırakır. Tamamlanan mini tur tekrar girişte veya sayfa yenilemede açılmaz.

## Kayıt ve geçici veri

| Tur | localStorage anahtarı |
|---|---|
| Ana tur | `rabi_ana_tur_tamamlandi` |
| Denemeler | `rabi_deneme_turu_tamamlandi` |
| Konu Haritası | `rabi_harita_turu_tamamlandi` |

Her anahtara tamamlamada veya Turu Geç işleminde `'true'` yazılır. Eski `rabi_tanitim_tamamlandi` yeni ana turun kaydı yerine kullanılmaz; güncellenen akış bir kez gösterilir.

Demo cevapları, skor ve banka soruları yalnızca Context belleğindedir. Gerçek banka, oyun geçmişi, soru takibi veya Pomodoro kayıtlarına yazılmaz. `demoVerileriTemizle()` bitişte ve geçmede boş durumu döndürür. Sayfa yenileme de bellekteki demo verilerini kaldırır; tamamlanmayan tur yeniden başlar. Bitiş veya geçme anında demo temizlenir; rehberin kapanışından sonra temiz ana sayfaya animasyonla dönülür.

Depolama yazılamazsa temizlik yine gerçekleşir ve oturum içindeki tamamlanma durumu korunur; yeniden açılışta turun tekrarlanabileceği kullanıcıya bildirilir. Tur ve adım kimliği kontrolü, gecikmiş veya çift dokunuşun sonraki adımı atlamasını engeller.

## Yeniden deneme

Tarayıcı konsolunda yalnızca denenecek turun anahtarını kaldırıp sayfayı yenile:

```js
localStorage.removeItem('rabi_ana_tur_tamamlandi')
location.reload()
```

Mini turlar için tablodaki ilgili anahtarı kaldır; ana tur tamamlanmışken ilgili ekrana gir. Gerçek kullanıcı kayıtlarını silme.

## Doğrulama ve mobil kullanım

`npm run typecheck`, `npm test` ve `npm run build` proje doğrulamalarıdır. Tarayıcı senaryoları tur geçişlerini, tek soruluk demo/banka temizliğini, gerçek kayıtların korunmasını, mini tur kayıtlarının bağımsızlığını, yenilemeyi ve 44 piksel düğmeleri denetler.

Capacitor aynı statik çıktıyı kullanır. Android geri tuşu etkin turu bitirip geçici veriyi temizler. Bu değişiklik Android cihazında doğrulanmadı; yeni uygulama paketine alınması için proje derleme ve Capacitor eşitleme süreci ayrıca çalıştırılmalıdır.

## Geçiş ve oyun deneyimi

Animasyon ayarları `/tanitim-deneyi` sayfasında canlı değiştirilir. Çerçeve çizimi, aydınlanma gecikmesi, aydınlanma süresi, balon geçişi, adım bekleme süresi ve karartma ayrı ayarlanır. Ayarlar `rabi_tur_animasyon_ayarlari` anahtarında saklanır; önizleme tamamlanma kayıtlarına dokunmaz. Varsayılan karartma önceki `--foreground` tonunu yüzde 64 opaklıkla kullanır. Kullanıcı hareket azaltmayı seçtiyse rehber geçişleri devre dışıdır.

Pomodoro’nun sayaç, ders ve ayar blokları tek çerçevede birlikte anlatılır; odak koruması ayrı kartta ve ayrı adımda gösterilir. Tarayıcıda da tanıtım satırı görünür, fakat cihaz izni istenmez veya koruma başlatılmaz.

Tanıtım oyununun görünümü kopyalanmaz: gerçek oyun bileşeni kullanılır. Hazırlık ekranında seçenekler ve başlangıç zorluğu birlikte görünür. Geri sayımda rehber ve karartma tamamen kaldırılır. Ardından önce süre ve tur bilgileri açıklanır; sayaç bu sırada durur. Tanıtımın süresi 600 saniyedir. Oyun aşamasında balon kısa bir ipucuna dönüşür. Sonuç mevcut mini oyunun tam yerleşimini kullanır. Sonuçtan Geri denildiğinde oyun yeni bir deneme için sıfırlanır. Gerçek oyun modu, zorluk tercihi ve rekorlar değiştirilmez.
