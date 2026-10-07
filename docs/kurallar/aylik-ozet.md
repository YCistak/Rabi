# Aylık özet

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

`components/ekranlar/aylik-ozet.tsx`, `lib/ozet.ts`, afiş `lib/ozet-gorsel.ts`, tasarım
`tasarim/aylik-ozet.dc.html`. Araçlar listesinde **yok**. Ay takvim ayı.
- Bir ayın özeti **yalnız sonraki ayın 1'inde** açılır (`bekleyenOzetAyi`; kullanıcı
  kararı). Ana sayfa kartı hep var: aktifken en üstte renkli (`OzetDaveti`),
  değilken en altta gri ve sonraki açılış tarihiyle (`OzetBekliyor`). Kapatma düğmesi
  yok.
- Kapanan ayda en az **7 farklı etkin gün** yoksa hikâye açılmaz
  (`ozetGosterilebilirMi`); etkin gün = soru, Pomodoro, oyun, deneme, konu bitirme ya
  da okuma kaydı. Hiç veri yoksa (`bosMu`) kart aktif olmaz.
- Kapanan her ay `rabi-aylik-ozetler` arşivine bir kez yazılır (`AylikOzetArsivi`,
  `arsivdeEksikAylar`), silinmez; yedeğe girer, geri yüklemede **birleştirilir**.
  Yazmadan önce hazır bayrakları beklenir (boş ay bir daha düzelmez).
- Okunan konu `KonuIlerlemesi.bitisTarihi`ne (yalnız ilk bitişte damgalanır) göre
  sayılır; alanı olmayan eski kayıt hiçbir aya sayılmaz.
- Okuma süresi `KartDestesi`te, yalnız uygulama öndeyken (`useUygulamaGorunur`),
  kullanıcıya gösterilmeden ölçülür; `rabi-okuma-gecmisi`ne (`lib/konu/okuma-suresi.ts`)
  konu + gün + saniye, seans iki saatte kırpılır, yedeğe girer.
- Sayfalar yalnız veri varsa üretilir (kapak ve kapanış hep); dokunarak çevrilir,
  kendiliğinden akmaz.
- `ozetGorulen` ay **açılırken** işaretlenir; hesap `ozetAcik ?? bekleyenAy`.
- Renkler bileşende yazılı (tuval `var()` çözemez) ve `ozet-gorsel.ts` ile **birlikte**
  değişir. Punto/kalınlık `yz()` ile satır içi; CSS `font` kısayolu kullanma.
- Afişte harf aralığı `aralikliYaz` ile elle çizilir; etiket önce küçülür
  (`harfAraliginaGore`), sonra kısalır.
- `OyunTurKaydi.yanlis` ve `hatasiz` isteğe bağlı; yanlışı olmayan eski turda yalnız
  doğru sayılır.
