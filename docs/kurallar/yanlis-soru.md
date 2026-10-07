# Yanlış soru

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

- Deneme formundaki **"Yanlış soru ekle"** tam ekran **katman** açar, ekran değil:
  başka ekrana geçmek `denemeFormu`nu söker. Kayıttan sonra katman kapanır.
- Mantık paylaşılır (`components/yanlis-soru-ekle.tsx`: `useYanlisSoruEkleme`,
  `EklemeFormu`, `FotografDugmeleri`), kopyalanmaz. Yazma sırası: önce blob
  IndexedDB'ye, sonra liste kaydı.
- Ders on çipten seçilir, Kaydet ancak seçilince açılır. **Ders listesi on ders ve
  tek** (`CALISMA_DERSLERI`, `lib/dersler.ts`; Pomodoro, Soru Takibi, yanlış soru):
  Türkçe, Matematik, Fizik, Kimya, Biyoloji, Tarih, Coğrafya, Yabancı Dil, Felsefe,
  Din Kültürü. Yeni ders eklemeden sor. Eski kayıtlardaki adlar yeniden
  adlandırılmaz; süzgeç, renk, istatistik onları da tanır.
- **Ders şeridi tek bileşen** (`components/ders-seridi.tsx`, `DersSeridi`): Pomodoro
  ve Soru Takibi'nin "Soru ekle" sayfası aynı şeridi kullanır; ekrana kendi şeridini
  yazma.
- Konu 30, not 60 harf (`YANLIS_SORU_KONU_SINIRI`, `YANLIS_SORU_NOT_SINIRI`); sayaç
  var, kayıtta da kırpılır.

## Fotoğrafa çizim

`components/soru-cizimi.tsx`, hesaplar `lib/cizim.ts`.
- Tuval yalnız fotoğrafın `object-contain` kutusunda (`fotografKutusu`); dışarı
  taşan nokta kenara **kısılmaz**, tuval keser.
- Fotoğrafa dokunulmaz: çizim ayrı saydam PNG, aynı IndexedDB'de
  `cizimAnahtari(resimId)` altında; kayda alan eklenmedi. **Fotoğraf kimliği listesi
  tutan yeni bir yer yazarsan çizimi de ekle**, yoksa öksüz sayılıp silinir (öksüz
  temizliği, silme, yedek zaten biliyor).
- Çizgiler ve kalınlık oran olarak; kayıt fotoğrafın çözünürlüğünde (uzun kenar ≤
  1600). Kalınlık ve yakınlaştırma aynı elle yazılmış dikey çubuk (`DikeyCubuk`;
  `input type="range"` WebView'de bozuk). Yakınlaştırma %100–%400, logaritmik;
  kalınlık ekrandaki boy (`cizgiKalinligi`). El aracı yalnız yakınlaştırılmışken.
- Silgi halkası ölçeklenen katmanın dışında, konumu state'e değil stile yazılır.
- Geri tuşu **kaydeder**; atmanın yolu Vazgeç. Vazgeç/Kaydet araç çubuğunun hemen
  üstünde, tam genişlik.
