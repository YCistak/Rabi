# Rabi — interaktif tanıtım turu

Tur, mevcut uygulamaya entegre edilmiştir. Ek bağımlılık, sunucu veya yeni bir
Next.js rotası gerektirmez. App Router uygulamasının mevcut `AppShell` ekran
geçişlerini kullanır; statik dışa aktarım ve React 19 ile çalışır.

## 1. Adımları ve geçici veriyi tanımla

`lib/tanitim.ts` adımların tek kaynağıdır. Her adımın kimliği, `data-tanitim`
hedefi, başlığı, açıklaması ve dokunuş gerektirip gerektirmediği burada bulunur.
`tanitimKonumu()` adımı mevcut sekme ve alt ekranla eşleştirir.

| Adım | Hedef | Beklenen etkileşim |
| --- | --- | --- |
| 1 | `gunluk-hedef` | İleri |
| 2 | `pomodoro-ac` | Ana sayfadaki Pomodoro kısayoluna dokun |
| 3 | `pomodoro-sayaci` | Ana sayfaya dön |
| 4 | `soru-takibi` | İleri; Soru Takibi ekranı açılmaz |
| 5 | `oyunlar-ac` | Alt menüdeki Oyunlar’a dokun |
| 6 | `demo-oyun` | Demo Oyun kartına dokun |
| 7 | `demo-zorluk` | Kolay, Orta veya Zor seç |
| 8 | `demo-soru` | Birinci soruyu cevapla, Sonraki soru’ya dokun |
| 9 | `demo-soru` | İkinci soruyu cevapla, Sonucu gör’e dokun |
| 10 | `demo-sonuc` | Bankayı gör |
| 11 | `demo-banka` | Turu Bitir |

Ana sayfanın yedi günlük şeridi mevcut uygulamada **bugünün ortada olduğu
yedi günlük aralıktır**. Tur bunu anlatır; aralıksız yedi gün çalışılmış gibi bir bilgi
üretmez. Günlük hedef kapalıysa karttaki mevcut durum korunur.

`tanitimGecisi()` saf bir durum geçiş fonksiyonudur. Yanlış hedefe dokunma,
cevap vermeden ilerleme, aynı soruya ikinci cevap ve önceki adımdan gecikmiş
bir dokunuş ilerlemeyi değiştirmez. Geri dönüşte ilgili cevaplar temizlenir.

## 2. React bağlamını kur

`components/tanitim/tanitim-baglami.tsx` içindeki `TanitimSaglayici`, mevcut
`AppShell` bileşenini sarar. `useTanitim()` şu alanları sunar:

- `aktifAdim`, `adim`, `tanitimdaMi`: etkin adım ve tur durumu.
- `demo`: yalnızca bellekteki zorluk, cevaplar ve örnek banka listesi.
- `sonrakiAdimaGec()`, `oncekiAdimaDon()`: bilgi adımları ve geri dönüş.
- `gonder()`: hedef dokunuşu, zorluk seçimi ve cevap olayları.
- `turuBitir()`: ortak temizleme ve tamamlanma kaydı.
- `tamamlandi`, `kayitUyarisi`: cihazdaki tamamlanma durumu ve yazma hatası.

React 19’un bağlam sağlayıcı söz dizimi kullanılır. Tur bileşenlerinin tamamı
`'use client'` girişine sahiptir; tarayıcı API’lerine statik çizimde erişilmez.

## 3. Spot ışığını ve balonu çiz

`components/tanitim/spot-isigi.tsx`, hedefin `getBoundingClientRect()` ölçüsünü
okur. SVG maskesi hedef çevresindeki alanı açık bırakır; ekranın geri kalanına
tema renginden yarı saydam karartma uygular. Dosya adı Türkçe isim kuralına
uyduğu için `spotlight.tsx` yerine `spot-isigi.tsx` kullanılmıştır.

Katman `createPortal()` ile doğrudan belge gövdesine yerleşir. Böylece mevcut
ekran animasyonlarındaki dönüşümler sabit konumlu katmanın ölçülerini bozmaz.
`requestAnimationFrame()` kaydırma, ekran dönüşü, yazı tipi yüklenmesi ve ekran
animasyonu sırasında hedefi takip eder. Hedef başlangıçta `scrollIntoView()`
ile görünür alana alınır. Kısa ekranlarda tur boyunca ek alt boşluk bırakılır;
yatay telefonda balon hedefin yanında, gerektiğinde kendi içinde kayar.

`visualViewport` ve mevcut `--guvenli-ust` / `--guvenli-alt` değişkenleri,
WebView’in kullanılabilir alanına göre yerleşimde hesaba katılır. Animasyonlu
kaydırma kullanılmadığı için azaltılmış hareket tercihi de korunur.

Tıklamalar belge düzeyindeki olay yakalama aşamasında süzülür. Bilgi adımının
aydınlatılan kartı dahi tıklanamaz; etkileşim adımında yalnızca ilgili hedef
ve rehberin düğmeleri kullanılabilir. Diğer DOM dalları `inert` ile klavye ve
ekran okuyucu etkileşiminden çıkarılır. Önceki `inert` değerleri çıkışta geri
yüklenir. Tab tuşu izin verilen düğmeler arasında dolaşır, Escape turu bitirir.
Kaydırma açık kalır ve spot ışığı hedefi takip eder.

Hedef bulunamazsa tur sessizce bir adım atlamaz. Beş saniye sonra balonda
açıklama gösterilir; Geri ve Turu Geç kullanılabilir kalır.

## 4. Demo oyunu çalıştır

`components/tanitim/demo-oyun.tsx`, Oyunlar sekmesinde yalnızca tur sırasında
bir Demo Oyun kartı gösterir. Kart seçilince üç zorluk ve iki soru sunulur.
Cevap sonrası doğru cevap açıklanır; Sonraki soru / Sonucu gör düğmesiyle
ilerlenir. Skor doğru cevap başına 10’dur ve yalnızca bu demo için hesaplanır.

Gerçek oyunların kayıt yazan fonksiyonları demo oyunundan çağrılmaz. Mod,
oyun zorluğu, son kullanılan oyun, skor, rozet, soru geçmişi ve aylık özet
kayıtlarına demo sonucu eklenmez.

## 5. Mevcut ekranlara bağla

- `components/app-shell.tsx`: bağlam sağlayıcısı, otomatik başlangıç, adımla
  eşleşen ekran geçişleri, demo ekranı ve ortak çıkış.
- `components/ekranlar/ana-sayfa.tsx`: günlük hedefin ve kısayolların hedef
  işaretleri. Turda Pomodoro ve Soru Takibi görünür kalır; kayıtlı kısayol
  sırası değişmez.
- `components/bottom-nav.tsx`: Oyunlar sekmesinin hedef işareti.
- `components/ekranlar/pomodoro.tsx`: sayaç ve döngü noktalarının hedef
  işareti. `demoVeri` sırasında odak kilidi karşılama ekranı, yerli dinleyiciler
  ve sayaç başlatma devre dışıdır. Ayar ve seans yazma geri çağrıları da
  uygulama kabuğunda korunur.
- `components/ekranlar/oyunlar.tsx`: yalnızca turda verilen demo kartının yeri.
- `components/ekranlar/oyun-bankasi.tsx`: gerçek ekran, ayrı demo listeyle
  çizilir. Başlıkta üç sorunun geçici olduğu belirtilir.

Kullanıcı tercihi doğrultusunda son adım **Oyun Bankası** kullanır. Fotoğraflı
Yanlış Soru ekranına veya IndexedDB’deki görüntülere dokunulmaz. Üç örnek
soru demo cevaplarından bağımsız hazırlanır; doğru cevap veren kullanıcıya
yanlış cevap vermiş gibi bir kayıt atfedilmez.

## 6. Bitişte ve geçişte temizle

Turu Bitir, herhangi bir adımdaki Turu Geç, Escape ve Android donanım geri
tuşu aynı `turuBitir()` yolunu kullanır:

1. `demoVerileriTemizle()` adımı, cevapları, zorluğu ve örnek bankayı sıfırlar.
2. `localStorage.setItem('rabi_tanitim_tamamlandi', 'true')` çalışır.
3. Uygulama temiz ana sayfaya döner, geçici kısayol düzeni kalkar.

Temizleme, kalıcı bayrak yazımından bağımsızdır. Depolama engellenirse demo
yine temizlenir ve kullanıcıya bayrağın kaydedilemediği söylenir. Bu oturumda
tur tekrar açılmaz; sonraki açılışta tekrar görünebilir.

Demo verinin kalıcı deposu yoktur. Uygulama zorla kapansa veya sayfa yenilense
bellek kaybolur; temizlenecek kalıcı bir demo kaydı kalmaz. Tamamlanmamış tur
sonraki açılışta baştan başlar. Kullanıcının bütün gerçek kayıtları korunur.

## 7. Başlangıç davranışı

Tur, ayarlar yüklendikten, mevcut kurulum tamamlandıktan ve açılış/kurulum
geçişi bittikten sonra otomatik başlar. Bayrak `true` ise başlamaz. Bayrağı
olmayan mevcut kullanıcılar da turu bir kez görür.

Güncelleme şeridi ve başarım bildirimleri tur boyunca gösterilmez; böylece
rehberin üstüne ikinci bir yönlendirme çıkmaz.

## 8. Doğrulama ve yeniden deneme

Proje kökünde mevcut komutlar:

```fish
cd /home/asaf/rabi
npm run typecheck
npm run test
npm run build
```

`lib/tanitim.test.ts`, üç zorlukta tam akışı, cevap zorunluluğunu, yanlış
hedefleri, gecikmiş dokunuşları, geri dönüşü, her aşamada temizlemeyi ve Soru
Takibi ekranının açılmamasını denetler.

Geliştirme sırasında turu tekrar denemek için tarayıcı geliştirici konsolunda
yalnızca turun bayrağını kaldırıp sayfayı yenile:

```js
localStorage.removeItem('rabi_tanitim_tamamlandi')
location.reload()
```

Bu işlem soru, skor veya ayar kayıtlarını kaldırmaz. Uygulamanın kendi
kurulumunu sıfırlamak gerekmez.

Tarayıcı denetimleri ayrı geçici tarayıcı oturumlarında gerçekleştirilir;
kullanıcının gerçek tarayıcı profili kullanılmaz. Fiziksel Android cihazdaki
WebView ve donanım geri tuşu ayrıca cihazda doğrulanmalıdır.
