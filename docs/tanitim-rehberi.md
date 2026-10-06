# Rabi ana tanıtımı ve bağlamsal mini turlar

## Dosyalar ve görevleri

1. `lib/tanitim.ts`: Ana tur ve yedi mini turun adımları, bağımsız kayıt anahtarları, mini tur seçimi (`miniTurSec`), saf geçiş fonksiyonu, gerçek oyundan gelen geçici sonuç ve üç örnek banka kaydı.
2. `components/tanitim/tanitim-baglami.tsx`: React 19 Context, aktif tur/adım, `turuBaslat`, `sonrakiAdimaGec`, `oncekiAdimaDon`, `turuBitir`, `turGorulduMu`, `turuKaydet`.
3. `components/tanitim/spot-isigi.tsx`: SVG maskesi, güvenli ekran boşlukları, dokunma kilidi, klavye odağı, yumuşak kaydırma ve konum takibi. Yönlendirme düğmeleri en az 44×44 piksel.
4. `components/tanitim/demo-oyun.tsx`: Ders ızgarasındaki Tanıtım oyunu kartı ve gerçek `IslemOyunuEkrani`. Hazırlık, mod/zorluk seçimi, geri sayım, tuş takımı ve sonuç ekranı mevcut oyunlarla aynıdır. Tur ayarları ve sonuç sadece bellekte tutulur.
5. `components/app-shell.tsx`: Kurulum ve açılış animasyonu bittikten sonra ana turu başlatır; ana turun ekran geçişlerini yönetir. Bir ekran ilk açıldığında `miniTurSec` ile o ekranın mini turunu başlatır.

`data-tanitim` hedefleri ilgili bileşenlerde bulunur: ana sayfa, alt menü, Araçlar satırları, Soru Takibi, Pomodoro, Yapılacaklar, İstatistik, oyun bankası, Denemeler, Konu Takibi ve konu haritası.

## Ana akış

Ana tur **12 adım** (eskiden ~46). Uzun tur kullanıcı değerlendirmesinde ağır bulundu; yalnızca ana sayfa ve temel akış kaldı, gerisi ekran bazlı mini turlara bölündü.

1. Sınav geri sayımı ve hedef kartı.
2. Günlük soru hedefi.
3. Alt menüde Araçlar'a dokunuş.
4. Soru Takibi satırına dokunuş.
5. "Soru ekle"ye dokunuş.
6. Form: ders ve sayılar; Kaydet'le (kayıt turun belleğinde, tur bitince siliniyor).
7. "Kaydın günlük hedefine eklendi" → "Araçlara dön".
8. Konu Takibi satırına dokunuş.
9. Girişin üstü (TYT/AYT seçici, aşama lejantı; tur sürerken ekran TYT girişinde açılır) → "Haritaya geç".
10. Aynı ekranda alt menüden Harita'ya dokunuş.
11. İlk bölümün ilk yeşil kitabı (konu anlatımı).
12. İlk turuncu kitap (sorular; biten konu takipte işaretlenir) → "Turu Bitir".

Kullanıcının istediği sıra korunuyor: Konu Takibi'nden hemen sonra Harita. Deneme ekleme ana turdan çıktı (Denemeler'in kendi turunda); böylece "deneme → Konu Takibi → Harita" sırası soru ekleme → Konu Takibi → Harita olarak kaldı. 12. sınıfın ya da kartı yazılmamış bir dersin haritasında kitap olmadığı için tur sürerken harita kitabı olan ilk programla çizilir (`turHaritaSecimi`, `app-shell.tsx`); seçim kayda yazılmaz. Ana tur iki kitabı gösterdiyse Konu Haritası mini turu da görülmüş sayılır. Konu Takibi kaydına tur hiçbir şey yazmaz.

## Mini turlar

Mini tur, ilgili ekran **ilk kez** açıldığında bir kez çalışır (`miniTurSec`, `lib/tanitim.ts`; tetikleyen etki `app-shell.tsx`). Hepsi ana turla aynı altyapıda (`TanitimSaglayici`, `SpotIsigi`, `tanitimGecisi`): atlanamaz, sayaç yok, Escape kapatmaz, balonda Rabi var. Mini tur ekran değiştirmez; bitince kullanıcı aynı ekranda kalır.

| Tur | Ne zaman | Adımlar |
|---|---|---|
| Denemeler | Denemeler açılınca (form kapalıyken) | Deneme ekle (elle ya da fotoğrafla okut) |
| Konu Haritası | Harita sekmesi açılınca | Patikanın başı: yeşil kitap, turuncu kitap |
| Pomodoro | Pomodoro açılınca, sayaç işlemiyorken | İki mod · Çalışma ayarları · Odak kilidi |
| Yapılacaklar | Yapılacaklar açılınca | Görev ekle · Görevlerin (işaretle, Pomodoro ile başlat) |
| İstatistik | İstatistik açılınca | Deneme türü · Son net · En çok ilerleyenler · Güçlü/zayıf · Karşılaştır |
| Oyunlar | Oyunlar sekmesi açılınca | Tanıtım oyunu kartı · Hazırlık · Başlat · Bir işlem · Sonuç |
| Oyun Bankası | Oyun Bankası açılınca | Yanlışların · Liste · Genel test · Öğrendim |

- **Denemeler** tek adımlı kaldı: mini turlar kayıt eklettirmiyor (turun geçici verisi yalnızca ana turda yazılıyor) ve ekranda her zaman bulunan tek hedef "Deneme ekle". Net grafiği bir süre bu ekrandaydı; kullanıcı kaldırttı.
- **İstatistik** ve **Oyun Bankası** gerçek veri olmadan boş durum çiziyor; tur kendi örnek verisini gösteriyor (İstatistik'te alana göre iki örnek deneme ve gerekiyorsa geçici eşi — `istatistikTuruDenemeleri`; bankada üç örnek soru — tur başlarken kuruluyor). Örnekler yalnızca bellekte, tur bitince siliniyor.
- **Pomodoro** turu sayaç işlerken (tam ekran sahne) ya da Yapılacaklar'dan "Pomodoro ile başlat" ile gelinmişken başlamıyor; bir sonraki boş ziyarette çıkıyor. İlk girişteki odak kilidi tanıtımı (Android) tur bitene kadar bekliyor.
- **Oyunlar** turunda eski "Süre ve skor" adımı kalktı (beş adıma sığmak için): rehber geri sayımdan sonra doğrudan soruyla geri geliyor ve demo sayacı o sırada işliyor. Ana sayfadaki ders kutucuğundan gelindiyse de ızgara ilk adımda görünüyor.

Ana tur açıkken mini tur başlamaz ve ana tur bitmeden hiçbiri başlamaz. **Mevcut kullanıcı:** eski ana turu bitirmiş kullanıcı (`rabi_ana_tur_tamamlandi` = `true`) yeni ana turu yeniden görmez; yeni mini turlar (Pomodoro, Yapılacaklar, İstatistik, Oyunlar, Oyun Bankası) o ekranları ilk ziyaretinde bir kez görür. Eski ana tur Denemeler ve Harita turlarını zaten görülmüş saydıysa onlar çıkmaz.

## Kayıt ve geçici veri

| Tur | localStorage anahtarı |
|---|---|
| Ana tur | `rabi_ana_tur_tamamlandi` |
| Denemeler | `rabi_deneme_turu_tamamlandi` |
| Konu Haritası | `rabi_harita_turu_tamamlandi` |
| Pomodoro | `rabi-mini-tur-pomodoro-v1` |
| Yapılacaklar | `rabi-mini-tur-yapilacaklar-v1` |
| İstatistik | `rabi-mini-tur-istatistik-v1` |
| Oyunlar | `rabi-mini-tur-oyunlar-v1` |
| Oyun Bankası | `rabi-mini-tur-oyun-bankasi-v1` |

İlk üç anahtar eski adlarıyla kaldı (değişselerdi turu bitirmiş herkes yeniden görürdü); yeniler projenin anahtar kuralında (`rabi-` öneki, sürümlü). Her anahtara tur tamamlanınca `'true'` yazılır. Tur atlanamaz: balonda "Turu Geç"/kapat düğmesi, adım sayacı ve ilerleme göstergesi yoktur; Escape tuşu ve arka plana dokunma turu kapatmaz, Android geri tuşu bir adım geri alır. Tek çıkış, son adımdaki "Turu Bitir" düğmesidir. Eski `rabi_tanitim_tamamlandi` yeni ana turun kaydı yerine kullanılmaz.

Demo cevapları, skor, örnek denemeler ve banka soruları yalnızca Context belleğindedir. Gerçek banka, oyun geçmişi, soru takibi veya Pomodoro kayıtlarına yazılmaz. `demoVerileriTemizle()` bitişte boş durumu döndürür. Sayfa yenileme de bellekteki demo verilerini kaldırır; tamamlanmayan tur yeniden başlar.

Depolama yazılamazsa temizlik yine gerçekleşir ve oturum içindeki tamamlanma durumu korunur; yeniden açılışta turun tekrarlanabileceği kullanıcıya bildirilir. Tur ve adım kimliği kontrolü, gecikmiş veya çift dokunuşun sonraki adımı atlamasını engeller. "Tüm verileri sil" tur anahtarlarını da siler (`tumVeriyiSil`).

## Maskot (Rabi)

Her balonun üst satırında küçük bir Rabi tavşanı ve turun etiketi (`TUR_ETIKETLERI`) durur (`components/maskot/rabi.tsx`; 48 piksel, kısa balonda ve oyun adımında 36). Poz `lib/tanitim.ts` içindeki `adimPozu` ile seçilir: önce adımın isteğe bağlı `poz` alanı, ana turun son adımında `alkislayan` (kutlama), sonra `ADIM_POZLARI` tablosu (kimliğe göre), tabloda yoksa dokunma adımında `isaretci`, değilse `tam`. İlk adım `selamlayan`dır. Örnekler: Pomodoro `saatli`, deneme ekleme `fotografci`, görev `defterli`, konu takibi `okuyan`, harita `haritali`/`kitapli`, istatistik `buyutecli`/`tahtali`/`ziplayan`, oyun sonucu `sevinen`. Tavşan dekoratiftir (`aria-hidden`); balonun yüksekliği ölçülerek yerleştiğinden hedefi örtmez.

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

Animasyon ayarları `/tanitim-deneyi` sayfasında canlı değiştirilir. Çerçeve çizimi, aydınlanma gecikmesi, aydınlanma süresi, balon geçişi, adım bekleme süresi ve karartma ayrı ayarlanır. Ayarlar `rabi_tur_animasyon_ayarlari` anahtarında saklanır; önizleme tamamlanma kayıtlarına dokunmaz. Varsayılan karartma önceki `--foreground` tonunu yüzde 68 opaklıkla kullanır. Kullanıcı hareket azaltmayı seçtiyse rehber geçişleri devre dışıdır.

Pomodoro mini turunda sayaç, ders ve ayar blokları tek çerçevede birlikte anlatılır; odak koruması ayrı kartta ve ayrı adımda gösterilir. Tarayıcıda da tanıtım satırı görünür, fakat cihaz izni istenmez veya koruma başlatılmaz.

Tanıtım oyununun görünümü kopyalanmaz: gerçek oyun bileşeni kullanılır (Oyunlar mini turu). Hazırlık ekranında seçenekler ve başlangıç zorluğu birlikte görünür. Geri sayımda rehber ve karartma tamamen kaldırılır; sayım bitince rehber doğrudan soruyla geri gelir. Tanıtımın süresi 600 saniyedir. Oyun aşamasında balon kısa bir ipucuna dönüşür. Sonuç mevcut mini oyunun tam yerleşimini kullanır. Sonuçtan Geri denildiğinde oyun yeni bir deneme için sıfırlanır. Gerçek oyun modu, zorluk tercihi ve rekorlar değiştirilmez.

Varsayılan süreler: adımlar arası bekleme 0 ms, çerçeve çizimi 700 ms, aydınlanma gecikmesi 450 ms, aydınlanma 550 ms, bilgi balonu geçişi 500 ms.
