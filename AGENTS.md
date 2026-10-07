# Rabi — proje kuralları

Bu dosya **kuralları ve tuzakları** tutar, tarihçeyi değil. Her madde: ne yapılır /
yapılmaz, birlikte değişmesi gerekenler ve tek cümlelik sebep. Bir kararın uzun
gerekçesi ya da "bir süre şöyleydi" anlatısı gerekirse: `git log -p -- AGENTS.md`
(uzun sürüm Ekim 2026'ya kadar orada). Yeni madde eklerken de bu biçimde yaz.

Bu dosyada yalnızca **her işte geçerli** kurallar var. Alanlara özel kurallar
`docs/kurallar/` altında; bir alana dokunmadan **önce** ilgili dosyayı oku. Yeni alan
kuralı oraya yazılır, buraya değil; yeni dosya açarsan aşağıdaki dizine ekle.

"Kullanıcı kaldırttı / istedi" yazan maddeler kullanıcının kararıdır: geri almadan
önce sor.

## Dizin — hangi işte hangi dosya

| Dosya | Ne zaman oku |
| --- | --- |
| [ag-ve-gizlilik.md](docs/kurallar/ag-ve-gizlilik.md) | ağa çıkan her şey, bildirim formları, Crashlytics, Play güncellemesi, gizlilik/sözleşme sayfaları |
| [maskot-ve-ikon.md](docs/kurallar/maskot-ve-ikon.md) | maskot pozları, `tavsan-*.png`, uygulama ikonu üretimi |
| [acilis.md](docs/kurallar/acilis.md) | açılış ekranı ve animasyonu |
| [kurulum-ve-ayarlar.md](docs/kurallar/kurulum-ve-ayarlar.md) | ilk kurulum akışı, Ayarlar ekranı |
| [hareket-ve-gecisler.md](docs/kurallar/hareket-ve-gecisler.md) | ekran/katman geçişleri, animasyon sınıfları, alt menü (iOS cam menü dahil), ✕ kapatma onayı |
| [pomodoro.md](docs/kurallar/pomodoro.md) | Pomodoro, deneme provası, kilit ekranı bildirimi, Android odak kilidi ve engel katmanı |
| [oyunlar.md](docs/kurallar/oyunlar.md) | mini oyunlar, efektler, Oyun Bankası, modlar, zorluk, tek tek oyunlar |
| [konu-anlatimi.md](docs/kurallar/konu-anlatimi.md) | konu kartları, içerik yazımı, yoklama, Harita sekmesi |
| [ana-sayfa.md](docs/kurallar/ana-sayfa.md) | YKS geri sayımı, başlıktaki tavşan, günün hâli cümlesi, kutucuklar |
| [yanlis-soru.md](docs/kurallar/yanlis-soru.md) | yanlış soru ekleme, ders listesi, fotoğrafa çizim |
| [yapilacaklar-ve-soru-takibi.md](docs/kurallar/yapilacaklar-ve-soru-takibi.md) | Yapılacaklar, Soru Takibi, ortak takvim bileşeni |
| [konu-takibi.md](docs/kurallar/konu-takibi.md) | YKS Konu Takibi (sınıf → okul dersi işaretleme, haritayla eşleme) |
| [aylik-ozet.md](docs/kurallar/aylik-ozet.md) | aylık özet, arşiv, paylaşım afişi |
| [basarimlar.md](docs/kurallar/basarimlar.md) | başarımlar/rozetler, ödül sistemi fikirleri |
| [hedef-katalogu.md](docs/kurallar/hedef-katalogu.md) | hedef üniversite/bölüm, puan türü, sıralama |
| [ios.md](docs/kurallar/ios.md) | iOS'a dokunan her iş (Live Activity, Screen Time, imza, geri/sekme kaydırma) |

## Dil

**Kod dahil her şey Türkçe.** Değişken, fonksiyon, tip, dosya ve klasör adları Türkçe;
yorumlar Türkçe. İstisna: çerçevenin dayattığı adlar (`page.tsx`, `layout.tsx`,
`useState`, React prop'ları) ve npm paket adları.

Yorumlar **neden**i anlatır, **ne**yi değil. Yönetmelik/ÖSYM kaynaklı bir kural
uyguluyorsan madde numarasını veya kaynağı yorumda belirt (`lib/hesap.ts` örnek).

## Alt ajanlar

Görevlerde **alt ajanları olabildiğince kullan** (kullanıcı istedi, 2026-10):
bağımsız parçalar (arama, ayrı dosyalar, taslak seçenekleri, gözden geçirme)
paralel ajanlara dağıtılır. Kullanıcı başka bir şey söylemedikçe:

- **Model:** yalnızca **Opus 5.5** ya da **Sonnet 5.5**. Sonnet: arama, mekanik
  düzenleme, test çalıştırma, belge özetleme, kuralı net taslaklar. Opus: tasarım
  kararı, çok dosyalı mantık, hata ayıklama, inceleme, Türkçe içerik/kart yazımı.
- **Efor:** en çok **high** (`xhigh`/`max` yok). Varsayılan **medium**, arama ve
  mekanik işte **low**, **high** yalnız zor hata ayıklama, mimari karar, incelemede.

## Mimari

- **Sunucu yok.** Statik export; her şey istemcide çalışır. Dış servise çıkma, veri
  toplamaya çalışma. Yalnızca üç istisna var, genişletme (ayrıntı:
  [ag-ve-gizlilik.md](docs/kurallar/ag-ve-gizlilik.md)):
  1. hatalı soru + öneri/hata bildirimi → Firestore (`lib/hata-gonder.ts`),
  2. çökme raporu → Crashlytics (`lib/cokme.ts`, `CokmeRaporu.kt`), her seferinde sorulur,
  3. Play güncelleme denetimi (`lib/guncelleme.ts`).
- **Durum kütüphanesi yok.** `AppShell` üst düzey state'in sahibi, props ile aşağı
  geçer. Yeni global state gerekirse önce prop ile çözmeyi dene.
- **Saf mantık `lib/` altında.** React'e bağlı olmayan her hesap `lib/`'e; bileşenler
  yalnızca çizer. `hesap.ts`, `puan.ts`, `siralama.ts`, `rozetler.ts` saf ve testli kalır.
- **localStorage küçük veri için.** Fotoğraflar IndexedDB'de (`lib/resim-depo.ts`).
  localStorage'a asla base64 görüntü yazma — kota birkaç fotoğrafta dolar.
- **Kayıtlı kimlikler ve depo anahtarları yeniden adlandırılmaz** (ör. `rozet`,
  `rabi-notlar`, `Yedek.notlar`, kullanılmayan `Ayarlar` alanları): kullanıcı
  verisini öksüz bırakır, eski yedekleri bozar. Kullanılmayan alan kayıtta durur.
  Silinen özelliklerin anahtarları `ESKI_ANAHTARLAR`a (`lib/depo.ts`) taşınır.

## Tasarım

- Mobil öncelikli, `max-w-md` tek sütun. Hover yerine `active:`.
- Renkler doğrudan yazılmaz, tema değişkenlerinden gelir (`var(--primary)` /
  `text-primary`). **Tek tema**: `dark:` kullanma, Ayarlar'da tema seçeneği yok.
  - `--primary` #B3491F **yazı ve ikon**, `--primary-parlak` #D9622F **dolgu** (halka,
    çubuk, düğme, büyük sayı). İkincil tuğla `--ikincil` #A8432B, zemin `--background`
    #F8F8F7. Kart yüzeyi `golge-kart`.
  - Renk **derse** aittir ve bir ders **her yerde aynı renkte** (harita, oyunlar,
    kutucuklar): `--konu-<ders>` (`bg-konu-turkce`, `text-konu-tarih-koyu`,
    `bg-konu-kimya-ok`…). Matematik mavi, Türkçe/Edebiyat sarı, Fizik mor, Kimya
    turuncu, Biyoloji yeşil, Tarih kahverengi, Coğrafya turkuaz.
  - Eski aileler (`yzm`, `isl`, `edb`, `cog`, `trh`, `byl`, `fzk`) ders kimliği değil,
    genel pastel: araç kutucukları, rozet kademeleri, harita göstergeleri (deniz, kara).
- **Zemin rengi dört yerde, birlikte değişir:** `--background` (globals.css),
  `acilis.tsx` → `ZEMIN`, Android `acilis_zemin` / `uygulama_zemin`, iOS
  `LaunchScreen.storyboard` + `capacitor.config.ts` → `ios.backgroundColor`.
  Ayrılırsa açılışta renk sıçrar.
- Yazı tipi tek: **Nunito**; başlık ayrı aile değil kalınlık (`font-display`). İki
  istisna, ikisi de tek başlık: açılıştaki "RABI" **Rubik** (`font-acilis`), aylık
  özet kapağındaki ay adı **Manrope** (`font-marka`). Başka yerde kullanma.
- Tasarım kaynağı `tasarim/` altındaki HTML mockup'lar; derlemeye girmez, uygulama
  oradan import etmez.
- Sütundaki sayılara `rakam` (tabular-nums). Alt menünün altında kalan içerik için
  `guvenli-alt`.
- **Yazı seçimi ve `touch-callout` kapalı** (`globals.css`): uzun basış oyunda
  "Kopyala" çubuğu açıp turu kesiyordu. Tek istisna giriş alanları (`input`,
  `textarea`, `contenteditable`).
- Çizgi ikon lucide; hizalanan kardeşleri olan yerde emoji kullanma (telefondan
  telefona başka çiziliyor).

## Android uçtan uca ekran

`MainActivity`, `super.onCreate`ten önce `EdgeToEdge.enable(this)` çağırır; eski
`setStatusBarColor` / `setNavigationBarColor` / `layoutInDisplayCutoutMode`'u elle
çağırma. Boşluklar `viewport-fit=cover`, `SystemBars`'ın `--safe-area-inset-*`
değerleri ve `--guvenli-ust` / `--guvenli-alt` ile çözülür; yerli tarafta ayrıca dolgu
ekleme (iki kez uygulanır).

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
