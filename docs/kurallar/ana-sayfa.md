# Ana sayfa

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

- **YKS geri sayımı** öğrencinin sınavına: `geriSayim(bugun, sinif)`, `sinavYili`
  (`lib/sinav-tarihi.ts`); sınıf eylülde `ilerlemisSinif` ile ilerler, burada ikinci
  kez ilerletilmez. Çubuk geçen son sınavdan başlar.
- **Günün hâli** selamlamanın altında **tek cümle** (`lib/gunun-hali.ts`,
  `gunun-hali.test.ts`); kart yok (kullanıcı kaldırttı), dokunulmaz. Kurallar sıralı,
  ilk tutan kazanır:

  | Sıra | Kural | Koşul |
  | --- | --- | --- |
  | 1 | Sınava yakın | kalan gün ≤ 7 her gün; 8–30 gün aşırı |
  | 2 | Seri kırılıyor | dün hedef tuttu, bugün 0 |
  | 3 | Seri sürüyor | bugün ve dün hedef tuttu |
  | 4 | Banka bekliyor | çözülmemiş yanlış var, bugün çalışılmış |
  | 5 | Tek derse yığılma | ≥ 20 soru ve %80'i tek dersten |
  | 6 | İhmal edilen ders | son 30 günde çalışılmış, 7+ gündür yok |
  | 7 | Deneme zamanı | son deneme 10+ gün önce (ya da hiç yok, 7+ günlük geçmiş var) |
  | 8 | Temel | hiç kayıt yok / başladın / hedef tuttu |

  4–7 aynı anda tutarsa günden güne dönüşümlü. Cümle günün tarihinden türeyen sayıyla
  seçilir (gün içinde sabit). Ders adına ek getirilmez. Günlük hedef sıfırsa cümle
  yok; sınav günü dinlenme cümlesi; kayıt yoksa "henüz soru kaydın yok".
- **Başlıktaki tavşan günü gösterir** (kullanıcı istedi). Karar `lib/ana-maskot.ts`
  (saf, testli; saat ana sayfadan gelir). Sıralı, ilk tutan kazanır:

  | Sıra | Koşul | Poz |
  | --- | --- | --- |
  | 1 | Pomodoro çalışma turu işliyor | `laptoplu` |
  | 2 | Pomodoro molası işliyor | `kahveli` |
  | 3 | Devamsızlık hakkı aşıldı | `uzgun` |
  | 4 | Sınav günü | `bagdas` |
  | 5 | Aylık özet açılmayı bekliyor | `megafonlu` |
  | 6 | Bugünün tarihli deneme var | `damgali` |
  | 7 | Bugün bir konu anlatımı bitti | `tahtali` |
  | 8 | Günlük hedef tuttu | `dans` / `alkislayan` / `kahkaha` (günden güne) |
  | 9 | Bugünün görevleri var ve hepsi işaretli | `cantali` |
  | 10 | Bugün kayıt var, öncesinde 3+ boş gün | `selamlayan` |
  | 11 | Bugün başlandı, hedefte değil | `yazan` / `okuyan` (günden güne) |
  | 12 | Kayıt yok, gece (22:00–04:59) | `esneyen` |
  | 13 | Kayıt yok, sabah (05:00–10:59) | `gerinen`, hafta sonu `bitkili` |
  | 14 | Kayıt yok, seri kırılmak üzere | `elleri-belde` |
  | 15 | Kayıt yok, bankada 10+ çözülmemiş yanlış | `buyutecli` |
  | 16 | Kayıt yok, sınava ≤ 30 gün | `saatli` |
  | 17 | Kayıt yok, akşam (18:00–21:59) | `dusunen` |
  | 18 | Kayıt yok | `esneyen` |

  5–7, 9–10, 13'ün hafta sonu kolu ve 15–17 kullanıcının seçimi (2026-10); akşam
  `dusunen` (kaynaktaki "esneyen" esnemiyor). Sabah uyumaz, gerinir: sabah uyuyan
  tavşan "bir şey yapmadın" gibi okunur. Seri kuralı ve hesabı `gunun-hali.ts`ten
  (`hedefSerisi`); günlük hedef sıfırken "tuttu" yok. Duraklatılmış Pomodoro işleyen
  sayılmaz. **Yerde uyuyan tavşan (`uyuyan`) başlıkta hiçbir durumda yok**
  (kullanıcı kaldırttı, 2026-10); kayıtsız gün `esneyen`.
- **Tavşan ile cümle tek karardan çıkar** (`lib/ana-baslik.ts`, kullanıcı: "hiçbir
  uyumsuzluk olmamalı"): önce tavşan (`anaMaskot`, `kural` alanı), cümle o kuraldan;
  `gununHali` önerileri yalnız tavşan çalışırken (`calisma`). Yeni kural
  `MaskotKurali` ve `kuralCumlesi`ne **birlikte** eklenir; `ana-baslik.test.ts` bütün
  kombinasyonları dolaşır ve her kuralın en az bir kez tutmasını ister.
- Başlık tavşanı **tam boy, kırpılmaz** (kullanıcı istedi; kırpım geri getirilmez):
  84 px (tam boy 70 altında leke), yazı sütunu yanında `items-center`. Poz değişince
  `key` ile yeniden kurulur, `ana-maskot-gecis` ile solarak gelir (reduced-motion'da
  yok). **Hiza tavşanın kendisine göre** (kullanıcı istedi): kutu görselin değil
  görünen tavşanın genişliğinde (`gorunurKutu`, `MASKOT_YAN_BOSLUK` — saydam yan
  boşluk ölçüleri, `maskot.test.ts` görsellerle karşılaştırır). Tavşanın sol kenarı
  her pozda geri sayım kartının sol kenarıyla aynı hizada (başlıkta sol dolgu yok),
  yazı her pozda tavşana `gap-3` uzaklıkta. Görsel değişirse tabloyu yeniden ölç.
  Etiket duruma özel (`Rabi.etiket`: "esniyor, bugün henüz kayıt yok",
  "Pomodoro turunda çalışıyor"); `durum` ayrı, ruh hâlini taşır.
- **Dört kutucuk** (Araçlar, Oyunlar) en son kullanılan başta (`lib/son-kullanilan.ts`).
  Sabitleme/"Düzenle" yok (kaldırıldı, anahtarları `ESKI_ANAHTARLAR`ta). Oyun
  kutucukları **dersi** gösterir (ders rengi), dokunuş `onOyunlaraGit(ders)` →
  `acilacakDers`, `oyunlar.tsx`te bir kez tüketilir. Ders geçmişi oyunlardan türetilir
  (`oyunlarinDersleri`).
