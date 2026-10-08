# Kurulum ve Ayarlar

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

## Kurulum

- Sıra: **karşılama** → **isim** → **tanışma** → soru adımları. Karşılama ile tanışma
  `adimlar`da ama `Kurulum` ikisi için erken döner (kart, geri, ilerleme yok).
  İlerleme onları **saymaz** (`noktaAdimlari`, ayrı liste — diziden çıkarılsalar
  `ilerle` atlardı); payda bu listenin **boyu** (notlar adımı herkeste yok).
- Soru adımları: üstte ince ilerleme çubuğu; maskot 76 px solda, soru onun konuşma
  balonunda, sola hizalı. Alttaki `flex-1` yalnız isim ve bölüm adımlarında;
  ötekilerde içerik `my-auto` ile ortalanır (`flex-1` artan yeri yer).
- **Devam eksik cevapta pasif:** ad geçerli, sınıf kartına dokunulmuş, alan kartına
  dokunulmuş, bölüm adımında üniversite+bölüm, notlar adımında en az bir sayı. Hedef
  ve hatırlatma varsayılanla gelir (çubuk ve saat her değerde anlamlı). Bölüm ve
  notların atlama yolu "daha sonra seçeceğim" onay kutusu (`SonraSec`); işaretlenince
  o adımda yazılanlar temizlenir. Alan adımında hiçbir kart (Karar vermedim dahil)
  seçili gelmez. Ad ipucu: boşken soluk yönerge, kısayken kırmızı uyarı.
- **Sınıf adımında hiçbir kart seçili gelmez** (varsayılan 12, hızlı geçen 10.
  sınıfı yanlış yıla kaydediyordu). `null` yalnız kurulumun yerel state'inde;
  `Ayarlar.buYilSinif` `number` kalır, `bitir` `null` görürse kayıt yazmadan döner.
  Sınıf seçilmeden notlar adımı listede yok (sorulacak yıllar sınıftan belli olur).
- **`KurulumMaskotu` adımdan adıma uçar:** kutusunu `Kurulum`daki ref'e yazar (bileşen
  sökülüyor); ters dönüşüm `useLayoutEffect`te; iki rAF + emniyet zamanlayıcısı;
  ölçmeden önce eski dönüşüm silinir. Reduced-motion'da uçmaz.
- Tanışma: başlık `tanismaBasligi` kurar (ad boşsa virgül düşer); son düğme
  "Hazırım". Tek süs adın altındaki çizilen hat (`tanisma-hat`, bir kez çizilir);
  emoji serpme, degrade zemin, madalyon, rozet yok. Maskot 150 px (karşılamayla
  aynı), `poz="el-sallayan"`, yanında ayrıca 👋 yok. Alttaki üç noktanın
  **sonuncusu** dolu. Yeni süs eklemeden sor: adı öne mi çıkarıyor, yarışıyor mu?

- **Kurulum sonu "uygulaman hazır" ekranı** (`kurulum-hazir.tsx`, kutucuklar
  `lib/kurulum-hazir.ts`). Dolan çubuk/sayaç yok (kullanıcı kaldırttı); ekran
  kendiliğinden kalkmaz, `onBitir` "Başlayalım"da. Altı kutucuk, her birinin alt
  satırı bir kurulum cevabından: Konu Anlatımı, Denemeler, Hedefim, Hatırlatma,
  YKS'ye kalan gün, günlük soru. Oyunlar ve Pomodoro kutucuğu yok (kullanıcı
  kaldırttı; kurulum cevabına bağlı değiller). Atlanan cevapta kutu boş kalmaz
  ("Sonra seçebilirsin"); izin yoksa hatırlatma saati yazılmaz; 12/mezuna sınıf
  konusu vaat edilmez. Konfeti tavşanın ortasından bir kez (Kutlama taslağının
  konfetisi, kullanıcı istedi), reduced-motion'da yok.

## Ayarlar

- Satırlar kapalı açılır, tek satır açık (`acikAyar`). Anahtarlı satırlar açılmaz;
  hatırlatma saati ayrı satır.
- **Simge kutusu bölümün renginde** (kullanıcı istedi): `Bolum` `ton`unu bağlamla
  verir, `Satir` ayrı `renk` almaz. Çalışma kırmızı, Hatırlatma sarı, Ses mor, Yasal
  mavi, Destek yeşil, Veri turkuaz; renkler `--ayar-*` (`globals.css`), her zemin ve
  `-koyu` simge çifti ≥ 4.5:1. Yeni bölüm: kendi `--ayar-<bölüm>` çifti + `SatirRengi`
  üyesi. Ders aileleri (`yzm`, `isl`…) kullanılmaz (koyuları kırmızı/sarıda 4.5 altı).
  Yalnız simge dairesi boyanır, bölüm kartı beyaz (`bg-card`) — kartı boyayan sürüm
  kullanıcı isteğiyle geri alındı.
- Hatırlatma bölümünde iki bağımsız anahtar: "Günlük hatırlatma" (izin yoksa
  açılmaz) ve "Görev hatırlatmaları (5 dk önce)" (varsayılan açık; izin reddedilse de
  açık kalır, bildirim izin gelene kadar kurulmaz). Kullanıcı başka ayar istemedi.
- Şablon düzenleme ayarlarda yok. `lib/sablonlar.ts` duruyor (yeni denemede seçiliyor,
  yedeğe giriyor); `ayarlar.varsayilanSablonId` okunuyor ama ayarlardan değişmiyor.
