# Denemeler

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

- **Şablon kimlikleri kayıt anahtarıdır** (`lib/sablonlar.ts`): deneme `sablonId` ile
  şablonuna bağlı. Seviye tespitin 9. sınıf şablonu bu yüzden hâlâ `okul`.
- **Seviye tespit sınıfa göre** (kullanıcı istedi, 2026-10): tür satırında tek
  "Seviye Tespit" düğmesi, altında `9 · 10 · 11 · 12`. 9 eski biçim (`okul`), 10 aynısı +
  Felsefe; Tarih 10, Coğrafya 10, Felsefe 5, Din 5 (`okul-10-b`; ilk sürüm `okul-10` `eski`
  işaretli, yalnız eski denemeler için — hazır şablonun sayısı yerinde değişmez), 11 ve 12 alanın AYT'sinin aynı dersleri
  (`okul-<sınıf>-<alan>`, tür yine `okul`). Alan Ayarlar'dan; seçilmemişse 11-12'de
  sınıfın altında alan satırı çıkar. Varsayılan sınıf öğrencininki (mezun → 12). Öteki seviye şablonları tür
  satırında yer tutmaz (`secilebilirSablonlar`).
- **"Dersleri düzenle"** (`components/seviye-dersleri.tsx`, `lib/seviye-tespit.ts`):
  ders ekle/çıkar, ad ve soru sayısı. "Ders ekle" listesinde
  yalnız Felsefe ve İngilizce (kullanıcı istedi, 2026-10-29); öteki ders "Başka ders"le. Kayıt seçili sınıfa (11-12'de alana) yeni bir
  kullanıcı şablonu olarak yazılır ve hazır olanın önüne geçer. **Deneme girilmiş
  şablon yerinde değiştirilmez** (eski denemenin boşu ve neti değişirdi): `seviye.eski`
  işaretlenir, yanına yenisi gelir; kullanılmamışsa silinir. Hazırla aynı derslere
  dönmek ("Varsayılana dön") düzenlemeyi kaldırır.
- **Dersleri düzenle soru sınırı:** ders başı en çok 40 (`DERS_EN_COK_SORU`, kullanıcı
  istedi, 2026-10-29). Hazırda fazlası olan ders (Dil alanında Yabancı Dil 80)
  hazırdaki sayıya kadar çıkar (`dersSoruSiniri`); yoksa o alanda kayıt yapılamazdı.
- **Toplu grup girişi** (kullanıcı istedi, 2026-11): denemede Sosyal ve Fen Katlanır Satır
  tasarımıyla grup hâlinde girilebilir ("sosyalden 20 doğru").
  - **Arayüz (Katlanır Satır, her zaman açık):** "Ders ders · Toplu" segmenti ve
    aç/kapa chevron'u yok; grup satırı ve altındaki girintili dersler her zaman
    görünür. Hangi tarafın kullanılacağı yazılan sayılardan anlaşılır: grup
    satırına sayı yazılırsa grup toplu sayılır, ders kutuları pasif (`disabled`)
    ve boş kalır; ders satırlarından birine sayı yazılırsa grup satırının kutuları
    gizlenir, yerinde kutusuz toplam özet rakamları yazar. Bir taraftan öbürüne
    geçmek için o tarafı silmek yeterlidir; sayılar otomatik aktarılmaz veya
    bölünmez (sahte veri ve veri kaybı olmasın). Uyarı grup başında değil, tablonun
    en altında tek satır dipnot olarak yalnız en az bir grup toplu doluyken
    çıkar ("Toplu girince istatistiklerde bu derslerin ayrı analizi olmaz.").
  - **Model:** `Deneme.toplu?: TopluSonuc[]` (`{ grup: 'sosyal' | 'fen', dogru, yanlis }`).
    Toplu girilen grubun derslerinin `sonuclar`da satırı olmaz; grup ya toplu ya ders
    ders. Üyelik tek yerde, ders kimliğinden (`lib/toplu-grup.ts`): Fen = fizik, kimya,
    biyoloji; Sosyal = tarih, cografya, felsefe, din, tarih1/2, cografya1/2. Şablonda
    en az iki üyesi olan grup çıkar (`sablonGruplari`). Alanı olmayan eski kayıt aynen
    çalışır; yedekte `denemeleriNormalize` (`lib/depo.ts`) bozuk satırı atar.
  - **Hesap:** toplam net, D/Y/boş toplamları ve ÖSYM test netleri toplu satırı sayar
    (`denemeOzeti`, `osymNetleri`). TYT'de grup tek test, net olduğu gibi o teste gider.
    AYT'de grup birden çok teste yayılıyorsa net, üye derslerin soru sayısına
    **orantılı** dağıtılır (`topluTestDagilimi`) — yalnız puan tahmini için; ders netine
    ve ders istatistiğine yazılmaz.
  - **İstatistik:** toplu denemede grubun dersleri o deneme için **boş** (anahtar yok,
    sıfır sayılmaz): en güçlü/zayıf ders hesabı bu dersleri atlar (yalnız ders ders girilen
    denemelerden oranlanır). Karşılaştırma ve en çok ilerleyen derslerde ise grup
    düzeyinde karşılaştırma yapılır (`grupNeti`): iki denemede de ders ders ise ders ders
    kıyaslanır; en az birinde toplu girildiyse o grubun dersleri yerine tek bir grup
    satırı ("Sosyal" / "Fen", grup neti) "toplu" etiketiyle listelere (kazanç/kayıp/sabit)
    ve en büyük sıçrama/düşüş adaylarına girer. Ders bazında ilerleyiş sayfasında grubu
    olan şablonlarda Sosyal ve Fen için grup neti serisi her zaman çizilir ("Sosyal (toplam)" /
    "Fen (toplam)"); ders serileri yalnız ders ders denemelerden çizilmeye devam eder;
    "N denemede toplu girildi" notu kalır. Karşılaştırmadaki eski "dersleri ayrı
    kıyaslanmadı" uyarısı kaldırılmıştır.
  - **Sahte ders verisi yasak:** toplu sonuç derslere bölünüp "Tarih 5 doğru" gibi
    yazılmaz; sayılar otomatik aktarılmaz. Okut (OCR) ders ders okur; okunan dersi
    olan grup ders derse döner (grup kutuları boşaltılır).
