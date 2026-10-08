# Oyunlar

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

## Ortak kurallar

- **Efektler ortak koddan**, oyun dosyalarına kanca yok: kabuk olayları sayaçtan
  türetir (`dogru`, `yanlis`, `kalan` props). Ses `lib/oyunlar/oyun-sesi.ts`, görsel
  `components/oyun-kabuk.tsx` + `globals.css`.

  | Efekt | Ne zaman | Nerede |
  | --- | --- | --- |
  | Sarsıntı | yanlış cevap | kabuk + `oyun-sarsinti` |
  | Süre nabzı + tek uyarı | kalan süre toplamın ¼'ünün altında | kabuk + `sure-nabzi` |
  | Kart kalkması | bankada tik | `oyun-bankasi.tsx` + `banka-kalkiyor` |
  | Konfeti | yalnız yeni rekor | `TurSonu` + `konfeti` |

- Doğru sesinin perdesi sabit (`playbackRate` sesi bozuyor); seriyi ödüllendirmek
  istersen ayrı ses ekle. `DOSYA_SEVIYESI` 0.42 telefonda ayarlandı.
- **Geri sayım** 3 · 2 · 1 · Başla (`components/oyun-geri-sayim.tsx`,
  `geriSayimSesi`) yalnız `oyun-tanitim.tsx` ve `TurSonu` içinde; oyun dosyaları
  bilmez. CSS süreleri (`geri-sayim-rakam`, `geri-sayim-basla`) `ADIM`, `BASLANGIC`
  ile eşleşir. Katman donuk beyaz, rakamlar `--primary-parlak`. Rakamların tonu aynı
  (`RAKAM_TONU`); `SAYIM_SEVIYESI` 0.8, `AKOR_SEVIYESI` altında (kırpılma).
- Tur sonu: isabet (`isabetYuzdesi`), hiç cevap yoksa "—". Hatasız tur şeridi
  (`lib/oyunlar/tur.ts` → `hatasiz`, süresi biten/elenen turda yok), konfeti değil.
  Puan çubuğu `transform` ile dolar (`tur-cubugu`).
- Oyun turunda ✕ tur sürerken sorar (`Onay`); kural için bkz.
  [hareket-ve-gecisler.md](hareket-ve-gecisler.md) → "Çarpı önce soruyor".
- **Yarıda çıkılan tur da bitirilir:** tur sonu çıkar, yanlışlar bankaya düşer. `yarim`
  bayrağı (`onTurBitti` 4. parametre) ile rekora, istatistiğe, geçmişe yazılmaz
  (`oyunlar.tsx` → `turBitti`); rekor rozeti kutlamaz.

## Pas (`lib/oyunlar/tur.ts` → `PAS_HAKKI`)

- Eşleştirme dışındaki bütün oyunlarda turda **5 pas hakkı** (kullanıcı istedi). Düğme kabuğun sayaç
  şeridinin sağında (`OyunKabugu` → `pas`, `PasBilgisi`), oyun dosyasında değil.
  Kalan hak ayrı sayaç değil, cevaplardan türer (`kalanPas`).
- Pas **bedelsiz** (kullanıcı seçti): yanlış sayılmaz (`yanlisSayisi`), süreden
  götürmez, Sıfır Tolerans'ta elemez, seriyi bozmaz, uyuma girmez, yanlış sesi ve
  titreşimi yok. Kayıt `{ dogruMu: false, pas: true }`: doğrusu gösterilir ("Pas
  geçtin", nötr `Bildirim pas`), tur sonunda listelenir ve **bankaya düşer**.
- Süre dolması pas değil, yanlıştır.
- **Eşleştirme oyunlarında pas yok** (edebiyat, antlaşma, formül, kavram; kullanıcı
  kaldırttı): `pas` prop'u verilmez, düğme çizilmez. Köklü'de pas yalnız aralık
  aşamasında; Sıralama'da sorunun tamamını geçer.
- Eskiden bazı oyunlarda sınırsız pas vardı (yanlış sayılıyordu) ve Harita/Bölünme'de
  "ilk tercih oluyor" diye kaldırılmıştı; hak sınırı o sorunu karşılıyor. Sınırsız
  pası geri getirme.

## Oyun Bankası

- İki çıkış: **kazanılan** (genel testte doğru → düşer, "bankadan düşen" sayacı ve
  rozet) ve **elle tik** (sayaca dokunmaz). Yeni çıkış yolu uydurulabiliyorsa sayaca
  yazılmaz.
- Kazanılan tek yol **genel test** (`lib/oyunlar/banka-testi.ts`,
  `components/ekranlar/banka-testi.tsx`); turdaki doğru bankaya dokunmaz. Biçim şıklı
  soru (`bankaSorusuMetni`, `bankaCevabiMetni`). Yanlış bilinen kayıt olduğu gibi
  kalır (`testiIsle`; `bankayiGuncelle` kullanılmaz). Çeldiriciler bankadan, aynı oyun
  öncelikli; çeldiricisi olmayan kayıt teste girmez.
- Karta dokunmak soru açmaz. `BankaTuru` yalnız oyun kimliği (+ `ilk`) taşır; "sadece
  bunlardan bir tur" kaydı düşürmez. Süzme `oyunlar.tsx` → `bankaSorulari`.

## Modlar (`lib/oyunlar/mod.ts`)

| Mod | Saat | Yanlış | Kayıt |
| --- | --- | --- | --- |
| Sıradan | tura ait, 60 sn | süreden 3 sn götürür | var |
| Turbo | tura ait, 30 sn | süreden 3 sn götürür | var |
| Sıfır Tolerans | soruya ait (`SORU_SURESI`) | tur biter | var |
| Rahat | yok | hiçbir şey | **yok** |

- Mod ve başlangıç zorluğu tur öncesi tam ekranda (`TurAyariEkrani`, `ModSecimi`,
  `ZorlukSecimi`), varsayılan Sıradan · Orta. Mod bütün oyunlarda ortak, saklanır
  (`ANAHTARLAR.oyunModu`). Soru türü seçimi yok. Rahat seçilince sarı şerit kayda
  geçmediğini söyler; kapı `kayitliMi` / `turBitti`.
- **Ayarlardan sonra tanıtım yok** (kullanıcı kaldırttı): "Başlat" doğrudan sayıma
  gider; kurallar turdaki "?"te. Tanıtım yalnız ayar çıkmayan turda (banka).
- Oyun Bankası turu hep **Rahat** (`etkinMod`), ayar adımı yok (`secilebilir`), sayım
  yalnız ilk oyunda (`BankaTuru.ilk`).
- Mod kutularında lucide ikon; tur içi mod rozetinde emoji kalır.
- Zorluk şeritli seçici: dıştaki ray düğmelerin alanı, gösterge rayın üçte biri
  (`calc` ile yarım piksel kayıyordu).
- Seçim prop değil **bağlamla** iner (`components/tur-ayari-baglami.tsx`); oyunlar
  `useEtkinMod` / `useUyarlananZorluk` çağırır, `etkinMod` ve `uyumBasla` saf kalır.
- Sayaç tek yerde `lib/oyunlar/tur-sayaci.ts` (toplam 0 = sayaç yok). Saat ya tura ya
  soruya ait, ikisi birden olmaz (`mod.test.ts`).

## Zorluk

- Seçim başlangıcı, uyum (`lib/oyunlar/uyum.ts`) gidişi belirler: 3 ardışık doğru bir
  üst, 2 ardışık yanlış bir alt seviye. Seçim yoksa başlangıç orta. Seçim oyun başına
  saklanır (`ANAHTARLAR.oyunZorlugu`), kayan seviye saklanmaz. Kayma kullanıcıya
  **söylenmez**.
- `turSirasi` üç **eşit boylu** şerit döndürür (`SoruAkisi`, `ritim.test.ts`); oyun
  `akis[zorluk][sira]` okur. Havuzsuz oyunlar `akisUret`, banka turu `tekAkis`.
- Uyum `ilerle`nin zamanlayıcısında işlenir (`zorlukKaydet`, `setSira` ile aynı
  karede), cevap anında değil. Eşleştirme oyunlarında seviye `zorlukRef.current`'tan.
- Boss soruları kaldırıldı; `soruSuresi` tek argüman, zorluk süreyi değiştirmez.

## Oyunlara özel

- **Trigonometrik Oranlar** gizli (`OyunTanimi.kapali`, listeler süzer), silinmedi;
  geri açmak için `tanim.ts`teki `kapali: true`yi sil. Çeldiriciler aynı üçgenin öteki
  oranları; değeri doğruya eşit şık olmaz (`degerSayisi`). tan 30° "√3/3". Kesirler
  `components/kesir-yazisi.tsx` ile üst üste. 7-24-25 çizilmez (`sekil.test.ts`).
- **Dünya haritası** `scripts/dunya-uret.mjs` ile Natural Earth'ten üretilir
  (`lib/oyunlar/dunya-havuzu.ts`), elle düzenlenmez. İzdüşüm eşdikdörtgen (enlem
  doğrusal), Antarktika ve 84°K üstü kesik. Yakınlaştırma yok. Ekvator/dönenceler
  çizili, adları haritanın altında.
- **İklim Kuşakları:** yer ancak **tek** iklim tipiyle anılabiliyorsa soru olur (çok
  iklimli ülke yerine bölge noktası). Çeldiriciler `KARISTIRILAN`dan. Ülke kodu ve
  koordinat birbirini tutmalı (`iklim.test.ts`).
- **İzohips** haritaları tohumdan üretilir (`lib/oyunlar/izohips.ts`, mulberry32,
  `Math.random` değil); bankada tohum saklanır. Doğruluk `izohips.test.ts` ile
  (`yukseltiAlani`, 60 tohum); üretim sayılarını oynatırsan testler hangi soruyu
  bozduğunu söyler. Denizli haritada göl olamaz (sütun taraması), dekorlar yalnız
  tepe ve boyun; yamaç sorularında dekor yok. Yükselti sayısı işarete en yakın
  eğriye konur.
- Harita renkleri (deniz `trh`, kara `cog`, okyanus, iller) "renk derse aittir"
  kuralının bilinçli istisnası: gösterge.
- **Periyodik Tablo:** havuz TYT'lik 38 element (`periyodik-havuzu.ts`); ilk yirmi
  şart, üst sınır var (`periyodik.test.ts`). Çizim 18 grup, boş hücreler duruyor
  (`hucreVarMi`, havuzdan bağımsız); `PERIYOT_SAYISI` 6, lantanit/aktinit yok.
  Yakınlaştırma yok; ızgara satır içi ölçü (18 sütunlu Tailwind sınıfı düşebilir).
  Çeldiriciler komşu hücreler (`enYakinlar`). Sınıf sorusunda "Metal" şıkkı yok, Al,
  Sn, Pb'ye sınıf sorulmaz (`sinifSorulurMu`). Banka kaydı sembol + tip; şıklar kayda
  girmez.
- **Formül Eşleştirme:** alt indis `formulParcalari` ile çizilir, Unicode alt indis
  değil (Nunito'da yok); havuzda her rakam alt indis, Roma rakamı adda. El tek türden;
  tür bütün havuzdan seçilir, zorluk tür içinde öne alınır (`formul.test.ts`).
- **Tepkime Türü** (`tepkime-havuzu.ts`, her türden ≥10, toplam ≥100): `ayrica`daki
  türler çeldirici olamaz; tek istisna `N2 + O2 → 2NO`da yanma şıkkı. Cevaptan sonra
  `ayrica` söylenir. `tepkime.test.ts` yapıdan çıkan türleri, atom/yük dengesini,
  sade katsayıları denetler — denklem eklerken çalıştır. Hâl her denklemde yazılı.
  Yazım `2Fe^3+(suda)`, çizen `components/denklem-yazisi.tsx` (terim ortasından
  kırılmaz). Yanlıştan sonra uzun bekleme (`CEVAP_BEKLEMESI`), sayaç durur. Banka
  kaydı yalnız denklem.
