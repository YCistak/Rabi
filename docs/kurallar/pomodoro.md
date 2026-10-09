# Pomodoro

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

## Deneme provası

- Kip anahtarı başlığın altında (Pomodoro · Deneme provası,
  `tasarim/pomodoro-2a.html`). Süreler `lib/sinav-provasi.ts`: TYT 165, AYT 180,
  YDT 120 dk, ayrıca **"Süre gir"** (1–300 dk, `ozelProva`; son yazılan
  `PomodoroAyar.provaSuresi`de hatırlanır). STS (40 dk) kullanıcı isteğiyle kalktı;
  prova kimliği kaydedilmez, eski 'sts' seçiminin taşınacak kaydı yok. Soru sayıları `OSYM_TEST_SORU`dan
  toplanır, elle yazılmaz; süreler elle (ÖSYM kararı). Provaya geçmek TYT'yi seçer.
- Prova **`Asama` değil ayrı kip** (yoksa `sonrakiAsama` arkasına mola koyar):
  çalışma/mola satırları çizilmez (ayarlar kaybolmaz), ders çipi yok, seans
  `PROVA_DERSI` ("Deneme Çözümü", seçilebilir ders değil) ile yazılır, tur sayacı
  ilerlemez, mola gelmez, dolunca sıradan çalışma turuna döner. Yarıda atlamak seansı
  **yazmaz**.

## Sahne ve kalıcı tur

- Başlat sayacı tam ekran `CalismaSahnesi`ne çıkarır (`tam-katman-girisi`). Geri tuşu
  turu bitirmez, duraklatmaz da: sayaç işliyorsa ekrandan çıkılır, tur sürer;
  duraklatılmış turda yalnız sahne kapanır.
- **Bileşen kalıcı:** `AppShell` onu kökte kurar, tur canlıyken
  (`PomodoroDurumu.canli`) sökmez. Sabit, ayrık bir `div`e (portal kabı) çizilir, kap
  ekran açıkken sayfadaki yuvaya taşınır. Kap **hiç değişmemeli** (React portalı
  yeniden kurar).
- **Yuva yalnız ekran açıkken kurulu**, gizlenmez, sökülür (kap DOM'dan düşer, bileşen
  yaşar): geri kaydırma denetçisi ekran değişimini kayan kutunun sökülmesinden anlar,
  gizlenen yuvada önceki ekranın kopyası yeni ekranın üstünde kalıyordu.
- **Geri düğmesi yuvada**, Pomodoro'nun üstünde (`AppShell` → `geriDugmesi`); öteki
  araçlarınki `SayfaGecisi`nde ve orada Pomodoro yuvasının altında kalıyordu.
- Gizliyken sahne yok (`gorunur`): açık sahne başka ekranda geri tuşunu yutardı.
- Saat `components/pomodoro-saati.tsx`: alt menünün üstünde sağda; kalan süreyi
  bitiş zamanından **kendisi** sayar (her tikte durum göndermek `AppShell`i
  çizdirirdi). Dokununca Pomodoro.
- Sahnenin geri oku `onArkaPlan` → `setEkran(null)`, `geriGit` değil (o sahneyi kapatıp
  kendini çağırırdı). `sahne` state'i `calisiyor`dan ayrı; kapatan: geri oku, "Turu
  bitir", provadan çıkış. Sahnede açıklama satırı yok (kullanıcı kaldırttı).
- Hazırlık ekranında süre, prova ve kip `turIcinde` kilitli. Süreler `Cekmece`de.
  Dersler tek satırlık yatay şerit; başta en çok çalışılan üç ders (`calismaSirasi`),
  sıra ekran açılınca bir kez kurulur. "Diğer" düğmesi ve ders çekmecesi yok
  (kullanıcı kaldırttı). "Ekran açık kalsın" ayar kartında, iki kipte de. Başlat
  `sticky`, alt menünün üstünde.

## Müzik yok

- Oyun müziği ve Pomodoro lo-fi'ı kaldırıldı (kullanıcı). `Ayarlar.oyunMuzigi`,
  `oyunMuzikTuru`, `ses`, `sesSeviyesi` kayıtta duruyor, okunmuyor. `lib/ses.ts` ve
  `lib/lofi.ts` dosyada. Aşama sonu **zili** ve oyun efektleri (`oyun-sesi.ts`, "Mini
  oyun sesleri" anahtarı; aylık özet de ona bakar) duruyor. Geri getirilirse tarihçe:
  `git log -- components/ekranlar/pomodoro.tsx`, `lib/oyunlar/mod-muzigi.ts`.

## Kilit ekranı bildirimi (Android)

- Ön plan servisi `OdakServisi` (ad odak kilidinden kalma, değiştirme — manifest,
  eklenti, `PomodoroKapanis` dokunur) **her turda** ve molada da kurulur; kilit ve
  Rahatsız Etme üstüne binen seçenekler. Molada engelleme yok (web servise boş liste
  geçer).
- Düzen `DecoratedCustomViewStyle`. Renkler tema değişkeni değil:
  `?android:attr/textColorPrimary` ve `bildirim_amber` (iki zeminde okunan ton).
- Sayacın iki kopyası var (servis + web); bildirim düğmesi `pomodoroKomutu` ile web'e
  geçer, `devam` yeni **bitiş zamanını** taşır (web sayacı mutlak zaman damgasından
  okur, `lib/pomodoro.ts`).
- Duraklatmak servisi durdurmaz, dondurur (`odakKilidiniDuraklat`); turdan çıkan
  yollar `odakKilidiniBitir`. Uygulamanın Devam'ının yerli karşılığı yok (`baslat`
  baştan kurar).
- Bildirim izni tur başlarken `izinIste` ile istenir, Ayarlar'daki bildirim
  anahtarından bağımsız (Android 13+ izinsiz ön plan bildirimi görünmez).

## Odak kilidi (Android)

- Yalnız Pomodoro'daki **"Odak koruması"** satırında
  (`components/odak/odak-ayarlari.tsx`); Ayarlar'da kopyası yok. Satır kapalı başlar,
  Süreler'in hemen altında, hazırlık ekranında.
- Anahtar kilidi doğrudan açmaz: önce `odak-daveti.tsx`, "İstiyorum" denince kilit;
  izin ekranı yalnız adı yazılı düğmeyle.
- İzin ekranları Rabi'ye en yakın sayfayı açar, olmazsa genele düşer
  (`Izinler.ilkAcilan`): kullanım verisi ve üste çizme `package:` adresiyle,
  Rahatsız Etme önce gizli `NOTIFICATION_POLICY_ACCESS_DETAIL_SETTINGS` (11+), sonra
  listede `:settings:fragment_args_key` ile satır vurgusu. Arayüz metni "listede bul"
  demez. Erişilebilirlik hizmeti yok (Play politikası).
- **Engel katmanı** (`EngelKatmani.kt`, `res/layout/engel_katmani.xml`) yerli düzen.
  Maskot `drawable-nodpi/tavsan_yuz.png` (üç kopya, bkz. Maskot). Renkler
  `values/colors.xml`, `values-night/` birebir aynı. Kalan süre en büyük öge; çubuğun
  toplamı servis kurulurken damgalanır (`OdakServisi.baslangicZamani`), bilinmiyorsa
  çubuk boş. Çip hep durur (ders adı Türkçe yerelle büyütülür, yoksa "DERS MODU
  AÇIK"). Onay ekranı (`odak_onay`) kilidi kapatmanın bedelini söyler.
- Gecikme: `ARALIK_MS` 350 yalnız engellenecek uygulama varken; sayaç için
  `BILDIRIM_ARALIGI_MS`. Katman bir kez şişirilir (`EngelKatmani.hazirla`);
  dinleyiciler `duzenKur`da, `goster` değil (üst üste binerdi).
- Ses odağı: `AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE`, tur bitene kadar bırakılmaz. İki
  koşullu yerde alınır: başlarken son bir dakikada yasaklı uygulama önde olduysa
  **ve** bir şey çalıyorsa (`baslarkenCalaniSustur`); tur içinde yasaklı uygulama öne
  gelince. Mini oynatıcı penceresi kapatılamıyor (erişilebilirlik API'si Play
  politikası yüzünden kullanılmıyor).
- `com.android.vending` ve Play Games manifest `<queries>`de adıyla; `ONERILENLER`de
  işaretli gelir ama zorunlu değil.
