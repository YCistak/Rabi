# Rabi — proje kuralları

## Dil

**Kod dahil her şey Türkçe.** Değişken, fonksiyon, tip, dosya ve klasör adları Türkçe;
yorumlar Türkçe. İstisna: çerçevenin dayattığı adlar (`page.tsx`, `layout.tsx`,
`useState`, React prop'ları) ve npm paket adları.

Yorumlar **neden**i anlatır, **ne**yi değil. Yönetmelik/ÖSYM kaynaklı bir kural
uyguluyorsan madde numarasını veya kaynağı yorumda belirt (`lib/hesap.ts` örnek).

## Mimari

- **Sunucu yok.** Statik export; her şey istemcide çalışır. Dış servise çıkma, veri
  toplamaya çalışma.
  - **Tek istisna: hatalı soru bildirimi.** Soru havuzları elle yazıldı; içlerindeki
    hataları öğrenmenin başka yolu yok. Ağa çıkan tek dosya `lib/hata-gonder.ts`;
    gönderilen veri `formVerisi()` içinde tek tek sayılan yedi alandan ibaret (soru
    kimliği, oyun, soru metni, doğru sanılan cevap, sebep, sürüm, anonim cihaz
    numarası). Kullanıcı Ayarlar'dan kapatabiliyor, ne gönderildiği orada yazıyor.
    Bu istisnayı genişletme — başka hiçbir yerden ağa çıkılmıyor.
- **State kütüphanesi yok.** `AppShell` üst düzey state'in sahibi, props ile aşağı geçer.
  Yeni bir global state ihtiyacı çıkarsa önce prop ile çözmeyi dene.
- **Saf mantık `lib/` altında.** React'e bağlı olmayan her hesap `lib/`'e; bileşenler
  yalnızca çizer. `hesap.ts`, `puan.ts`, `siralama.ts`, `rozetler.ts` saf ve test edilebilir
  kalmalı.
- **localStorage küçük veri için.** Fotoğraflar IndexedDB'ye (`lib/resim-depo.ts`).
  localStorage'a asla base64 görüntü yazma — kota birkaç fotoğrafta dolar.

## Tasarım

- Mobil öncelikli, `max-w-md` tek sütun. Hover yerine `active:` — dokunmatik cihaz.
- Renkler doğrudan yazılmaz, tema değişkenlerinden gelir (`var(--primary)` /
  Tailwind `text-primary`). Tek palet var, kullanıcıya renk seçtirilmiyor.
  Vurgu mavi (`--primary` #4A8FE7), ikinci kimlik rengi mercan (`--ikincil` #EF5A52),
  zemin mavimsi kâğıt (`--background` #EDF1FD). Renk **derse** ait, oyuna değil:
  `yzm` (Türkçe, pembe) · `isl` (Matematik, krem) · `edb` (Edebiyat, lavanta) ·
  `trh` (Tarih, deniz mavisi) · `byl` (Biyoloji, yeşil), her biri `-koyu` ve
  `-ok` tonuyla.
  Kart yüzeyi `golge-kart` sınıfıyla: açık temada gölge, koyu temada ince çerçeve.
- Yazı tipi tek: **Nunito**. Başlık ayrı aile değil ayrı kalınlık — `font-display`
  hâlâ var ama Nunito'ya çözülüyor; başlıklar `font-extrabold`, gövde `font-medium`.
- Tasarım kaynağı `tasarim/` altındaki HTML mockup'lar. Derlemeye girmiyorlar,
  uygulama onlardan hiçbir şey import etmiyor — ekran değiştirirken oraya bak.
- Sütun hâlindeki sayılara `rakam` sınıfı (tabular-nums), başlıklara `font-display`.
- Alt menünün altında kalan içerik için `guvenli-alt`.

## Seviye ve havuç

Seviye **türetilmiş**: kayıtta XP sayacı yok, her açılışta mevcut veriden yeniden
hesaplanıyor (`lib/seviye.ts`). Böylece aylardır veri girmiş kullanıcı sistemi ilk
gördüğünde hak ettiği seviyede başlıyor. `rabi-seviye` altında yalnızca **ulaşılan
en yüksek seviye** duruyor; o sayı hem seviyenin geri gitmesini hem aynı ödülün
ikinci kez dağıtılmasını engelliyor.

XP'nin kuralı rozetlerinkiyle aynı (`lib/rozetler.ts`): soru sayısı elle giriliyor,
o yüzden soru XP'sinin hem günlük hem ömür boyu tavanı var. Zaman isteyen ölçüler
(pomodoro dakikası, seri günü, bankadan düşen soru) tavansız ve seviyenin omurgası;
oyun XP'sinin de ayrı bir toplam tavanı var — oyun mola aktivitesi, ana yol değil.
Yeni bir XP kaynağı eklerken önce "bu uydurulabilir mi" diye sor; uydurulabiliyorsa
tavanla.

Havucun **tek** artma yolu seviye atlamak, tek eksilme yolu mağaza. Ömür boyu
kazanılabilecek toplam `TOPLAM_HAVUC` ile sabit (≈10.000) ve joker fiyatları ona
oranla konuldu — `lib/magaza/jokerler.ts` içindeki `denge` testleri bu oranı
koruyor. Fiyatı ya da XP eğrisini değiştirirsen o testler kırılır; kırılmaları
doğru, sayıyı güncellemeden geçme.

## Havuç Mağazası

Satılan tek şey joker; tavşan özelleştirmesi kaldırıldı. Katalog
`lib/magaza/jokerler.ts`, çanta `rabi-jokerler` anahtarında kimlik başına adet
tutuyor. Hiçbir joker doğru cevabı söylemiyor — sahayı daraltıyor, süreye ya da
hakka dokunuyor. Cevabı veren bir joker rekoru da Oyun Bankası'nı da
anlamsızlaştırırdı. Güçlü jokerlerin ayrıca seviye şartı var (`enAzSeviye`);
kilitli joker gizlenmiyor, kilitli gösteriliyor.

Jokerlerin tur içinde kullanılması henüz yazılmadı: stok yalnızca `jokerKullan`
üzerinden eksilmeli, oyun tarafı geldiğinde de o tek kapı kalmalı.

## Doğruluk

Puan ve sıralama hesabı **tahmindir** ve arayüzde her zaman böyle sunulur. Tahmini
kesin sayı gibi gösteren bir arayüz yazma; uyarıyı kapatılabilir yapma.

## Derleme

APK için **JDK 21 şart** — sistem varsayılanı JDK 25, Gradle 8.14.3 desteklemiyor.
`JAVA_HOME=/usr/lib/jvm/java-21-openjdk npm run apk`.

Değişiklikten sonra en az `npm run typecheck`, saf mantığa dokunduysan `npm run test`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
