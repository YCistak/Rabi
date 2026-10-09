# Rabi ana tanıtımı ve bağlamsal mini turlar

## Dosyalar ve görevleri

1. `lib/tanitim.ts`: Ana tur ve yedi mini turun adımları, bağımsız kayıt anahtarları, mini tur seçimi (`miniTurSec`), saf geçiş fonksiyonu, gerçek oyundan gelen geçici sonuç ve üç örnek banka kaydı.
2. `components/tanitim/tanitim-baglami.tsx`: React 19 Context, aktif tur/adım, `turuBaslat`, `sonrakiAdimaGec`, `oncekiAdimaDon`, `turuBitir`, `turGorulduMu`, `turuKaydet`.
3. `components/tanitim/spot-isigi.tsx`: SVG maskesi, güvenli ekran boşlukları, dokunma kilidi, klavye odağı, yumuşak kaydırma ve konum takibi. Belge düzeyindeki kaydırma engeli aydınlatılan hedefin içindeki taşan kaplarda (hedef dahil) kalkar — ör. Soru ekle'deki ders şeridi; karar `hedefteKaydirilabilir` (`lib/tanitim-yerlesim.ts`, testli). Yönlendirme düğmeleri en az 44×44 piksel.
4. `components/tanitim/demo-oyun.tsx`: Ders ızgarasındaki Tanıtım oyunu kartı (gerçek `OyunKarti`, `oyunlar.tsx`; yalnız başlık ve simge tanıtıma ait) ve gerçek `IslemOyunuEkrani`. Oyun modu penceresi (`ModPenceresi`, `oyun-tanitim.tsx`), geri sayım, tuş takımı ve sonuç ekranı mevcut oyunlarla aynıdır. Tur ayarları ve sonuç sadece bellekte tutulur.
5. `components/app-shell.tsx`: Kurulum ve açılış animasyonu bittikten sonra ana turu başlatır; ana turun ekran geçişlerini yönetir. Bir ekran ilk açıldığında `miniTurSec` ile o ekranın mini turunu başlatır.

`data-tanitim` hedefleri ilgili bileşenlerde bulunur: ana sayfa, alt menü, Araçlar satırları, Soru Takibi, Pomodoro, Yapılacaklar, İstatistik, oyun bankası, Denemeler, Konu Takibi ve konu haritası.

## Başlangıç sorusu

Kurulum ve açılış bitince yeni kullanıcıya bir kez **"Tanıtım ister misin?"** sorulur (`components/tanitim/tanitim-sorusu.tsx`; karar `lib/tanitim-tercih.ts`, testli; kullanıcı istedi, 2026-10). Pencerede Rabi var, ✕ yok; zemine dokunma ve Android geri tuşu kapatmaz.

- **Evet** → ana tur başlar; mini turlar eskisi gibi ekranlara ilk girişte çıkar.
- **Hayır** → hiçbir tur yok: ne ana tur ne mini turlar (`turuBaslat` hepsini keser, `turlarAcik`).
- Cevap `rabi-tanitim-tercihi-v1` anahtarında (`evet` / `hayir`) kalıcı. "Tüm verileri sil" anahtarı siler, soru yeniden gelir. Ayarlar'da turu yeniden başlatma seçeneği **yok**.
- Cihazda herhangi bir tur kaydı olan (ana turun sürümü, eski `'true'` anahtarları ya da bir mini turun bayrağı — `eskiTurKaydiVar`) mevcut kullanıcıya soru sorulmaz; davranışı aynı kalır.
- Soru, tur başlayabileceği koşullarda çıkar (çökme sorusu açıkken çıkmaz).

## Ana akış

Ana tur **28 adım**. Bir süre ~46 adımdı (her ekranı gezdiriyordu, uzun bulundu), sonra 12'ye indi ve deneme ekleme ile İstatistik mini turlara taşındı; kullanıcı o ikisini mini turda zayıf buldu ve Harita'dan sonra ana turda istedi. Metinler kısa (≤ 85 karakter, testte), sayaç yok, atlanamaz. Balon bir düğme/sekme/satır adı anıyorsa ekrandaki yazıyı harfi harfine kullanır (büyük-küçük harf dahil); kesme işaretiyle ek almış adlar (`Kaydet’e`, `Soru Takibi’ne`) hedefin kaynak dosyasında aranır (`lib/tanitim-metin.test.ts`, yeni hedef o testin `KAYNAK` tablosuna da eklenir). Bilgi adımında (`tiklamali: false`, `etkilesimli` yok) hedef dokunmaya kilitlidir: balon orada "…’e dokun" diye buyurmaz, "…’le yaparsın" diye anlatır.

1. Sınav geri sayımı ve hedef kartı.
2. Günlük soru hedefi.
3. Alt menüde Araçlar'a dokunuş.
4. Soru Takibi satırına dokunuş.
5. "Soru ekle"ye dokunuş.
6. Form: ders ve sayılar; Kaydet'le (kayıt turun belleğinde, tur bitince siliniyor).
7. "Kaydın günlük hedefine eklendi" → "Araçlara dön".
7a. Pomodoro satırına dokunuş (`pomodoro-ac`).
7b. Sayaç (`pomodoro-sayaci`, bilgi adımı): çalışma-mola sayacı.
7c. Odak koruması (`pomodoro-kilit`, bilgi adımı) → "Araçlara dön". Sayaç turda başlamaz; ekran `demoVeri` ile açılır (odak kilidi tanıtımı çıkmaz, ayar yazılmaz). Pomodoro'nun mini turu (iki mod, ayarlar) ayrıca ilk gerçek ziyarette çıkar.
8. Konu Takibi satırına dokunuş.
9. Girişin üstü (sınıf sekmesi ve giriş açıklaması; konu satırları bu adımda görünmez) → "İleri" (özel düğme yazısı yok). Balon bu adımda dokunulacak bir şey göstermez: "Dersi açınca konuya dokunup kartta Okul, Soru ve Bitti’yi işaretlersin."
10. Aynı ekranda alt menüden Harita'ya dokunuş.
11. İlk bölümün ilk yeşil kitabı (konu anlatımı) — bilgi adımı, İleri ile geçilir; balon "dokun" demez ("Konuyu kısa kartlarla buradan çalışırsın.").
12. İlk turuncu kitap (sorular; biten konu takipte işaretlenir) → "Araçlara dön". Bilgi adımı. Kitap kilitli/yazılmamış olsa da bu adımda gerçek turuncu rengiyle çizilir (gri ve soluklaştırma yok, kilit rozeti kalır); yalnızca tur sırasında ve yalnızca bu kitap için (`Dugum`, `konu-haritasi.tsx`).
13. Denemeler satırına dokunuş (iki örnek deneme hazır).
14. Örnek denemenin kartına dokunuş (`deneme-ornek`, listedeki ilk kart). Kart turda adıma bağlı açılır (`DenemelerEkrani` → `tanitim.ornekAcik`); öteki kartlar kilitli.
14a. Ders ders netler (`deneme-detay`, açılan tablo; bilgi adımı): doğru, yanlış, boş, net. Balon "ayrıntılı rapor" demez. Örnekler turun belleğinde (`demoDenemeleri`), cihaz deposuna yazılmaz.
15. "Deneme ekle"ye dokunuş.
16. "Okut" düğmesi (balon başlığı "Kâğıdı okut"; etkileşimli, okutmadan İleri denebilir).
17. **Boş ders**: form bir ders hariç örnekle doldu; o dersin satırı aydınlanır, kullanıcı doğru ve yanlışı yazar. Geçerli giriş olmadan ilerlemez.
18. "Yanlış soru ekle" düğmesi aydınlanır (bilgi adımı, İleri ile geçilir; düğme turda bir şey açmaz).
19. Deneme formunun Kaydet'ine dokunuş (deneme turun belleğine).
20. İstatistik satırına dokunuş.
21–25. Deneme türü · Son net · En çok ilerleyenler · Güçlü/zayıf (kutuların adıyla "en güçlü / en kötü ders") · Deneme karşılaştır (düğmenin adı) → "Turu Bitir".

12. sınıfın ya da kartı yazılmamış bir dersin haritasında kitap olmadığı için tur sürerken harita kitabı olan ilk programla çizilir (`turHaritaSecimi`, `app-shell.tsx`); seçim kayda yazılmaz. Konu Takibi kaydına tur hiçbir şey yazmaz.

### Deneme formu: bir ders boş kalır

- Okut adımında kullanıcı kâğıdı gerçekten okutabilir (rehber Okut açıkken gizlenir). Okutmadan İleri derse form, şablonun **ilk dersi hariç** örnek sonuçlarla dolar (`turFormuSonuclari`, `turBosDersi` — `lib/tanitim-veri.ts`). Okut bir sonuç yazdıysa forma dokunulmaz.
- Boş kalan ilk ders: TYT'de **Türkçe**, AYT Sayısal/EA'da Matematik, Sözel'de Edebiyat, YDT'de tek ders. İlk satır "Elle gir" başlığının hemen altında: kaydırmadan görünür, açılan klavye onu örtmez ve öğrencinin netini en iyi bildiği derslerden biri.
- Satır `data-tanitim="deneme-bos-ders"` ile aydınlanır. Adım `kayit: 'deneme-ders'` bekler; form, iki kutu da yazılmış, en az bir soru cevaplanmış ve toplam soru sayısını aşmıyorsa (`bosDersGirisiGecerli`) son tuştan 0,9 saniye sonra klavyeyi kapatıp bildirir — "12" yazan kullanıcı "1"de ileri atılmasın.
- "Yanlış soru ekle" turda **yalnızca gösterilir** (`deneme-yanlis-ekle`, bilgi adımı, `tiklamali: false`): düğme aydınlanır, "Buradan … ekleyebilirsin" denir, İleri ile geçilir. Turda düğme hiçbir şey açmaz (kamera/izin penceresi turla çakışırdı, fotoğraf gerçek bankaya yazılırdı). Bir süre dokundurulup örnek bir soruyla ekleme formu açtırılıyor ve Kaydet'e bastırılıyordu; Android'de (Mi Note 10 Lite) hatalı bulundu, kullanıcı turda yanlış soru eklettirilmesin, yalnız gösterilsin istedi (2026-10). Formu turda yeniden açtırma; Oyunlar ve Oyun Bankası mini turlarında da yanlış soru ekleme etkileşimi yok.
- Deneme Kaydet'le turun listesine (`demo.denemeler`, `tanitim-` önekli) gider, cihaz deposuna yazılmaz; İstatistik adımları bu deneme ile örneklerden çizilir (`turIstatistikDenemeleri`). Formun Vazgeç'i "Deneme ekle" adımına döner; kayıttan sonra Geri, forma değil listeye döner.

Ana tur iki kitabı gösterdiyse Konu Haritası, deneme eklemeyi gösterdiyse Denemeler, İstatistik'i gösterdiyse İstatistik mini turu da görülmüş sayılır (`turuBitir`).

## Mini turlar

Mini tur, ilgili ekran **ilk kez** açıldığında bir kez çalışır (`miniTurSec`, `lib/tanitim.ts`; tetikleyen etki `app-shell.tsx`). Hepsi ana turla aynı altyapıda (`TanitimSaglayici`, `SpotIsigi`, `tanitimGecisi`): atlanamaz, sayaç yok, Escape kapatmaz, balonda Rabi var. Mini tur ekran değiştirmez; bitince kullanıcı aynı ekranda kalır.

| Tur | Ne zaman | Adımlar |
|---|---|---|
| Denemeler | Denemeler açılınca (form kapalıyken), ana turda görülmediyse | Deneme ekle (elle ya da fotoğrafla okut) |
| Konu Haritası | Harita sekmesi açılınca | Patikanın başı: yeşil kitap, turuncu kitap |
| Pomodoro | Pomodoro açılınca, sayaç işlemiyorken | İki mod · Çalışma ayarları · Odak koruması (satırın adı) |
| Yapılacaklar | Yapılacaklar açılınca | "+"ya dokun · Görevi yaz ve kaydet · Pomodoro ile başlat · ⋯'ye dokun · Düzenle/ertele/sil |
| İstatistik | İstatistik açılınca, ana turda görülmediyse | Deneme türü · Son net · En çok ilerleyenler · Güçlü/zayıf · Karşılaştır |
| Oyunlar | Oyunlar sekmesi açılınca | Tanıtım oyunu kartı · Oyun modu · Başla · Bir işlem · Sonuç |
| Oyun Bankası | Oyun Bankası açılınca | Yanlışların · Liste · Genel test · Öğrendim (bilgi adımı: düğme kilitli, balon "dokun" demez) |

- **Denemeler** ve **İstatistik** mini turları ana turla örtüşür: ana turu (sürüm 2) bitirende ikisi de görülmüş sayılır. Eski turu bitirmiş kullanıcı da artık önce yeni ana turu gördüğünden (mini turlar ana tur bitmeden başlamaz) bu iki mini tur pratikte bir daha çıkmaz. Denemeler tek adımlı: mini turlar kayıt eklettirmiyor (turun geçici verisi yalnızca ana turda yazılıyor).
- **İstatistik** ve **Oyun Bankası** gerçek veri olmadan boş durum çiziyor; tur kendi örnek verisini gösteriyor (İstatistik'te alana göre iki örnek deneme ve gerekiyorsa geçici eşi — `istatistikTuruDenemeleri`; bankada üç örnek soru — tur başlarken kuruluyor). Örnekler yalnızca bellekte, tur bitince siliniyor.
- **Pomodoro** turu sayaç işlerken (tam ekran sahne) ya da Yapılacaklar'dan "Pomodoro ile başlat" ile gelinmişken başlamıyor; bir sonraki boş ziyarette çıkıyor. İlk girişteki odak kilidi tanıtımı (Android) tur bitene kadar bekliyor.
- **Yapılacaklar** turu görevi **gerçekten ekletir** (kullanıcı istedi, 2026-10). Bir süre form alanları bilgi adımlarıyla gösteriliyor, kayıt kapalıydı; rehber bilgi adımında hedefe dokunmayı ve odağı kilitlediği için "+"dan sonra yazı yazılamıyor, kullanıcı "bozuk" buldu. Beş adım:
  1. `gorev-ekle` — "+" dokunmalı: "+ düğmesine dokun; görev ekleme sayfası açılsın." Turda dolu günde de basılabilir.
  2. `gorev-form` — bütün sayfa (`gorev-formu`), Soru ekle'deki gibi **kayıt adımı** (`kayit: 'gorev'`, `tiklamali`): form serbest, klavye açılır; tur Kaydet'le gelen kaydı bekler. Eksik alanla Kaydet her zamanki gibi eksikleri kırmızı gösterir, tur ilerlemez. Turda "Pomodoro ile çalış" açık başlar (sonraki adım o düğmeyi gösterir) ve sayfa balona yer bıraksın diye biraz kısadır.
  3. `gorev-pomodoro-baslat` — eklenen görevin satırındaki Pomodoro düğmesi (bilgi adımı, düğme kilitli): "Bu görevden Pomodoro başlatabilirsin." Kullanıcı formda Pomodoro'yu kapattıysa satırın kendisi aydınlanır. Bu adımdan **geri yok** (`geriKapali`): kayıt gerçek, forma dönmek ikinci görev açardı.
  4. `gorev-menu-ac` — satırın ⋯ düğmesi (dokunmalı).
  5. `gorev-menu` — açılan alt sayfa (`gorev-eylemleri`, bilgi adımı): "Görevi buradan düzenler, yarına erteler ya da silersin." → "Turu Bitir".

  Sayfa ve ⋯ menüsü turda kullanıcının dokunuşuna değil **adıma** bağlı (`gorevFormuTurdaAcik`, `gorevMenusuTurdaAcik`). Görev **gerçek listeye** yazılır ve tur bitince **kalır**: kullanıcının kendi eylemi. Ana turun temizlik deseni (`tanitim-` önekli kayıtları ayıklamak) yalnız ana turun geçici verisi için; bu görevin kimliği sıradan (`yeniId`), dokunulmaz. Gün doluysa ekleme olmaz, uyarı çıkar ve tur listenin ilk göreviyle sürer. Geri (balon ya da Android tuşu, karar `adim-geri`): formdan "+"ya (sayfa kaydetmeden kapanır), menüden ⋯ adımına (menü kapanır). ✕ ya da aşağı kaydırma (`GOREV_VAZGEC`) "+" adımına döndürür; turda ✕ onay sormaz.
- **Oyunlar** turu beş adım:
  1. `demo-ac` — Tanıtım oyunu kartı (dokunmalı): "Tanıtım oyunu kartına dokun; skor tanıtımda kalır."
  2. `zorluk` — Oyun modu penceresinin mod ızgarası (bilgi adımı, mod seçilebilir; Başla bu adımda aydınlanmaz): "Her oyun bu pencereyle açılır. İstersen başka bir mod seç."
  3. `oyun-baslat` — "Başla" (dokunmalı): "Başla’ya dokun; 3, 2, 1 sayımından sonra soru gelir."
  4. `soru-bir` — soru ve tuş takımı: "Sonucu yaz ve Onayla’ya dokun." (demoda pas yok, balon pas önermez)
  5. `sonuc` — "Bu turdaki doğru sayın burada. Bilemediklerin Oyun Bankası’na düşer." → "Turu Bitir". Hedef yalnız puan kartı; Yanlış kutusu aydınlığın dışında, balon yanlışı anlatmaz.

  Kimlik `zorluk` eski Hazırlık adımından kaldı; geri dönüş kararları ve `DemoOyun` ona bakıyor, yeniden adlandırma.
- **Oyunlar** turunda eski "Süre ve skor" adımı kalktı (beş adıma sığmak için): rehber geri sayımdan sonra doğrudan soruyla geri geliyor ve demo sayacı o sırada işliyor. Ana sayfadaki ders kutucuğundan gelindiyse de ızgara ilk adımda görünüyor.

Ana tur açıkken mini tur başlamaz ve ana tur bitmeden hiçbiri başlamaz. **Mevcut kullanıcı:** ana tur sürümlüdür (`ANA_TUR_SURUMU`, şu an 2). Kayıtlı sürümü (`rabi_ana_tur_surumu`) güncelden küçük olan kurulu kullanıcı — eski `rabi_ana_tur_tamamlandi` ya da `rabi_tanitim_tamamlandi` anahtarı `true` olsa da — yeni ana turu **bir kez** görür; bitirince sürüm yazılır ve bir daha çıkmaz (kullanıcı istedi, 2026-10). Ana turu bitirince Denemeler ve İstatistik mini turları görülmüş sayılır; mini turlar (Pomodoro, Yapılacaklar, İstatistik, Oyunlar, Oyun Bankası) o ekranları ilk ziyaretinde bir kez görür. Eski (46 adımlı) ana tur Denemeler ve Harita turlarını zaten görülmüş saydıysa onlar çıkmaz.

## Kayıt ve geçici veri

| Tur | localStorage anahtarı |
|---|---|
| Ana tur | `rabi_ana_tur_surumu` (= `2`; okunan bu) + `rabi_ana_tur_tamamlandi` (= `true`, yalnız geriye uyum için yazılır) |
| Denemeler | `rabi_deneme_turu_tamamlandi` |
| Konu Haritası | `rabi_harita_turu_tamamlandi` |
| Pomodoro | `rabi-mini-tur-pomodoro-v1` |
| Yapılacaklar | `rabi-mini-tur-yapilacaklar-v3` (v1, v2 `ESKI_ANAHTARLAR`da) |
| Başlangıç sorusu | `rabi-tanitim-tercihi-v1` (`evet` / `hayir`; tur değil, tercih) |
| İstatistik | `rabi-mini-tur-istatistik-v1` |
| Oyunlar | `rabi-mini-tur-oyunlar-v1` |
| Oyun Bankası | `rabi-mini-tur-oyun-bankasi-v1` |

İlk üç anahtar eski adlarıyla kaldı (değişselerdi turu bitirmiş herkes yeniden görürdü); yeniler projenin anahtar kuralında (`rabi-` öneki, sürümlü). Her anahtara tur tamamlanınca `'true'` yazılır; ana tur ayrıca `rabi_ana_tur_surumu`na güncel sürümü yazar ve görülmüş sayılması **yalnız** bu sürüme bakar (`turGorulduOku`, `turBitisKayitlari`). Tur içeriği baştan değişirse `ANA_TUR_SURUMU` artırılır: herkes yeni turu bir kez görür. Tur atlanamaz: balonda "Turu Geç"/kapat düğmesi, adım sayacı ve ilerleme göstergesi yoktur; Escape tuşu ve arka plana dokunma turu kapatmaz, Android geri tuşu bir adım geri alır. Tek çıkış, son adımdaki "Turu Bitir" düğmesidir. Eski anahtarlar (`rabi_tanitim_tamamlandi`, `rabi_ana_tur_tamamlandi`) artık ana turu görülmüş saydırmaz. Güncellemeden sonra açılışta çökme sorusuyla tur bir kez çakışıp kullanıcıyı kilitlemişti; bu yüzden çökme sorusu açıkken hiçbir tur başlamaz, tur sürerken soru tur bitene kadar bekler (`lib/cokme-tanitim.ts`).

Demo cevapları, skor, örnek denemeler ve banka soruları yalnızca Context belleğindedir. Gerçek banka, oyun geçmişi, soru takibi veya Pomodoro kayıtlarına yazılmaz. `demoVerileriTemizle()` bitişte boş durumu döndürür. Sayfa yenileme de bellekteki demo verilerini kaldırır; tamamlanmayan tur yeniden başlar.

Depolama yazılamazsa temizlik yine gerçekleşir ve oturum içindeki tamamlanma durumu korunur; yeniden açılışta turun tekrarlanabileceği kullanıcıya bildirilir. Tur ve adım kimliği kontrolü, gecikmiş veya çift dokunuşun sonraki adımı atlamasını engeller. "Tüm verileri sil" tur anahtarlarını da siler (`tumVeriyiSil`).

## Maskot (Rabi)

Her balonun üst satırında küçük bir Rabi tavşanı ve turun etiketi (`TUR_ETIKETLERI`) durur (`components/maskot/rabi.tsx`; 48 piksel, kısa balonda ve oyun adımında 36). Poz `lib/tanitim.ts` içindeki `adimPozu` ile seçilir: önce adımın isteğe bağlı `poz` alanı, ana turun son adımında `alkislayan` (kutlama), sonra `ADIM_POZLARI` tablosu (kimliğe göre), tabloda yoksa dokunma adımında `isaretci`, değilse `tam`. İlk adım `selamlayan`dır. Örnekler: Pomodoro `saatli`, deneme ekleme `fotografci`, görev `defterli`, konu takibi `okuyan`, harita `haritali`/`kitapli`, istatistik `buyutecli`/`tahtali`/`ziplayan`, oyun sonucu `sevinen`. Tavşan dekoratiftir (`aria-hidden`); balonun yüksekliği ölçülerek yerleştiğinden hedefi örtmez.

## Yeniden deneme

Tarayıcı konsolunda yalnızca denenecek turun anahtarını kaldırıp sayfayı yenile:

```js
localStorage.removeItem('rabi_ana_tur_surumu')
location.reload()
```

Mini turlar için tablodaki ilgili anahtarı kaldır; ana tur tamamlanmışken ilgili ekrana gir. Gerçek kullanıcı kayıtlarını silme.

## Doğrulama ve mobil kullanım

`npm run typecheck`, `npm test` ve `npm run build` proje doğrulamalarıdır. Tarayıcı senaryoları tur geçişlerini, tek soruluk demo/banka temizliğini, gerçek kayıtların korunmasını, mini tur kayıtlarının bağımsızlığını, yenilemeyi ve 44 piksel düğmeleri denetler.

Capacitor aynı statik çıktıyı kullanır. Android geri tuşu turu bitirmez, bir adım geri alır (sayımda yutulur). Bu değişiklik Android cihazında doğrulanmadı; yeni uygulama paketine alınması için proje derleme ve Capacitor eşitleme süreci ayrıca çalıştırılmalıdır.

## Geçiş ve oyun deneyimi

Animasyon ayarları `/tanitim-deneyi` sayfasında canlı değiştirilir. Çerçeve çizimi, aydınlanma gecikmesi, aydınlanma süresi, balon geçişi, adım bekleme süresi ve karartma ayrı ayarlanır. Ayarlar `rabi_tur_animasyon_ayarlari` anahtarında saklanır; önizleme tamamlanma kayıtlarına dokunmaz. Varsayılan karartma önceki `--foreground` tonunu yüzde 68 opaklıkla kullanır. Kullanıcı hareket azaltmayı seçtiyse rehber geçişleri devre dışıdır.

Pomodoro mini turunda sayaç, ders ve ayar blokları tek çerçevede birlikte anlatılır; odak koruması ayrı kartta ve ayrı adımda gösterilir. Tarayıcıda da tanıtım satırı görünür, fakat cihaz izni istenmez veya koruma başlatılmaz.

Tanıtım oyununun görünümü kopyalanmaz: kart da oyun da gerçek bileşendir (Oyunlar mini turu); oyun ekranı ya da kart yeniden tasarlanınca tur kendiliğinden yeni hâli gösterir, balon metinleri elle güncellenir. Hazırlık ekranı yok: oyun, gerçek oyunlardaki gibi oyun modu penceresiyle açılır (zorluk seçimi yok, düğme "Başla"). Geri sayımda rehber ve karartma tamamen kaldırılır; sayım bitince rehber doğrudan soruyla geri gelir. Rehberin gizliliği gizlendiği adıma bağlıdır (`lib/tanitim-rehber.ts`): adım ya da tur değişince kendiliğinden kalkar. Sayım sürerken Android geri tuşu yutulur (adım geri alınsaydı sayım sonundaki "oyun başladı" olayı uymaz, rehber hiç geri gelmez ve tur kilitlenirdi — 2026-10, Android). Rehber Başla adımında `SAYIM_KORUMA_MS`ten (8 sn) uzun gizli kalırsa tur Oyun modu adımına (`zorluk`) döner. Geçiş sürerken kullanıcı dokunuşları düşer (çift dokunuş koruması), oyundan/formdan gelen olaylar (`demo-baslat`, `oyun-bitti`, `kayit-eklendi`) sıraya alınıp geçiş bitince işlenir. Deneme formunda Okut açıkken geri tuşu önce Okut'u kapatır. Tanıtımın süresi 600 saniyedir. Oyun aşamasında balon kısa bir ipucuna dönüşür. Sonuç mevcut mini oyunun tam yerleşimini kullanır. Sonuçtan Geri denildiğinde oyun yeni bir deneme için sıfırlanır. Gerçek oyun modu ve rekorlar değiştirilmez.

Varsayılan süreler: adımlar arası bekleme 0 ms, çerçeve çizimi 700 ms, aydınlanma gecikmesi 450 ms, aydınlanma 550 ms, bilgi balonu geçişi 500 ms.
